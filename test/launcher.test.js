import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmod, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EventEmitter } from "node:events";
import { loadCodexAccessToken, buildChildEnv } from "../src/launcher/auth.js";
import { launchDsh, forwardChildSignals, resolveDshCommand } from "../src/launcher/process.js";
import { buildProxyEnv, validateProxyUrl } from "../src/launcher/proxy.js";
import { parseWorkbenchArgs } from "../src/launcher/cli.js";
import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import { createWorkbenchSettings } from "../src/host/settings.js";
import { resolveDataRoot } from "../src/host/config.js";

async function tempDir() {
  return mkdtemp(join(tmpdir(), "cpwb-launcher-"));
}

async function executableRecorder(dir) {
  const file = join(dir, "record-launch.mjs");
  await writeFile(file, `#!${process.execPath}
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
const output = process.argv.find((argument) => argument.endsWith("result.json"));
const token = process.env.OPENAI_CODEX_ACCESS_TOKEN;
await writeFile(output, JSON.stringify({
  argv: process.argv.slice(2),
  tokenHash: token ? createHash("sha256").update(token).digest("hex") : null,
  hasLegacyToken: Object.hasOwn(process.env, "CODEX_ACCESS_TOKEN"),
  proxy: {
    nodeUseEnvProxy: process.env.NODE_USE_ENV_PROXY,
    http: process.env.HTTP_PROXY,
    https: process.env.HTTPS_PROXY,
    httpLower: process.env.http_proxy,
    httpsLower: process.env.https_proxy,
    noProxy: process.env.NO_PROXY,
    noProxyLower: process.env.no_proxy
  }
}));
process.exit(7);
`);
  await chmod(file, 0o755);
  return file;
}

test("ordinary auth resolution never reads a Codex cache and preserves no legacy token", async () => {
  const token = ["task3", "runtime", Date.now()].join("-");
  assert.equal(await loadCodexAccessToken({ codexAuth: "disabled", env: { CODEX_HOME: "/path/that/must/not/be/read" } }), undefined);
  const child = buildChildEnv({ baseEnv: { CODEX_ACCESS_TOKEN: token }, token });
  assert.equal(child.OPENAI_CODEX_ACCESS_TOKEN, token);
  assert.equal(Object.hasOwn(child, "CODEX_ACCESS_TOKEN"), false);
});

test("explicit CODEX_ACCESS_TOKEN wins before cache access", async () => {
  const dir = await tempDir();
  const explicit = ["explicit", "token", Date.now()].join("-");
  await writeFile(join(dir, "auth.json"), "not json");
  assert.equal(await loadCodexAccessToken({ codexAuth: "auto", codexHome: dir, env: { CODEX_ACCESS_TOKEN: explicit } }), explicit);
  await rm(dir, { recursive: true, force: true });
});

test("auto cache failures are stable and happen before spawn", async () => {
  const cases = [
    { name: "missing", content: null, expected: /unavailable|unreadable/i },
    { name: "invalid", content: "{", expected: /not valid JSON/i },
    { name: "missing field", content: JSON.stringify({ tokens: {} }), expected: /no access token/i },
    { name: "empty field", content: JSON.stringify({ tokens: { access_token: "   " } }), expected: /no access token/i },
    { name: "unreadable path", content: "directory", directory: true, expected: /unavailable|unreadable/i }
  ];
  for (const item of cases) {
    const dir = await tempDir();
    if (item.content !== null) {
      if (item.directory) await mkdir(join(dir, "auth.json"));
      else await writeFile(join(dir, "auth.json"), item.content);
    }
    await assert.rejects(() => loadCodexAccessToken({ codexAuth: "auto", codexHome: dir }), item.expected, item.name);
    await rm(dir, { recursive: true, force: true });
  }
  const missingDir = await tempDir();
  await assert.rejects(
    () => launchDsh({ dshBin: join(missingDir, "must-not-spawn"), codexAuth: "auto", env: { CODEX_HOME: missingDir, PATH: "/usr/bin:/bin" } }),
    /unavailable|unreadable/i,
    "cache validation precedes spawn"
  );
  await rm(missingDir, { recursive: true, force: true });
});

test("launcher maps token only into child env, applies patch and proxy, preserves args and exit code", async () => {
  const dir = await tempDir();
  const child = await executableRecorder(dir);
  const output = join(dir, "result.json");
  const token = ["sentinel", "task3", Date.now(), Math.random()].join("-");
  const patchPath = join(dir, "dsh-codex.patch.yml");
  await writeFile(patchPath, "[]");
  const result = await launchDsh({
    dataDir: dir,
    dshBin: child,
    args: [output, "--alpha", "two"],
    codexAuth: "disabled",
    env: { PATH: "/usr/bin:/bin", CODEX_ACCESS_TOKEN: token, http_proxy: "http://old.example:80" },
    proxy: { mode: "custom", proxyUrl: "https://proxy.example:8443", noProxy: "localhost" },
    patchPath
  });
  assert.equal(result.code, 7);
  assert.equal(result.signal, null);
  const record = JSON.parse(await readFile(output, "utf8"));
  assert.deepEqual(record.argv, ["web", "--patch", patchPath, output, "--alpha", "two"]);
  assert.equal(record.tokenHash, createHash("sha256").update(token).digest("hex"));
  assert.equal(record.hasLegacyToken, false);
  assert.deepEqual(record.proxy, {
    nodeUseEnvProxy: "1",
    http: "https://proxy.example:8443",
    https: "https://proxy.example:8443",
    httpLower: "https://proxy.example:8443",
    httpsLower: "https://proxy.example:8443",
    noProxy: "localhost",
    noProxyLower: "localhost"
  });
  await rm(dir, { recursive: true, force: true });
});

test("saved Workbench network settings reach the child, while explicit CLI proxy overrides them", async () => {
  for (const [saved, expected] of [
    [{ mode: "custom", proxyUrl: "https://saved.example:8443", noProxy: "saved.local" }, { http: "https://saved.example:8443", https: "https://saved.example:8443", noProxy: "saved.local", httpLower: "https://saved.example:8443", httpsLower: "https://saved.example:8443", noProxyLower: "saved.local" }],
    [{ mode: "direct", noProxy: "direct.local" }, { http: "", https: "", noProxy: "direct.local", httpLower: "", httpsLower: "", noProxyLower: "direct.local" }]
  ]) {
    const dir = await tempDir();
    const db = openDatabase({ dataDir: dir });
    const settings = createWorkbenchSettings({ repos: createRepositories(db) });
    settings.set("network", saved);
    closeDatabase(db);
    const child = await executableRecorder(dir);
    const output = join(dir, "result.json");
    const result = await launchDsh({ dshBin: child, dataDir: dir, args: [output], env: { PATH: "/usr/bin:/bin" } });
    assert.equal(result.code, 7);
    const record = JSON.parse(await readFile(output, "utf8"));
    assert.equal(record.proxy.http, expected.http);
    assert.equal(record.proxy.https, expected.https);
    assert.equal(record.proxy.noProxy, expected.noProxy);
    assert.equal(record.proxy.httpLower, expected.httpLower);
    assert.equal(record.proxy.httpsLower, expected.httpsLower);
    assert.equal(record.proxy.noProxyLower, expected.noProxyLower);
    await rm(dir, { recursive: true, force: true });
  }

  const dir = await tempDir();
  const db = openDatabase({ dataDir: dir });
  const settings = createWorkbenchSettings({ repos: createRepositories(db) });
  settings.set("network", { mode: "custom", proxyUrl: "https://saved.example:8443", noProxy: "saved.local" });
  closeDatabase(db);
  const child = await executableRecorder(dir);
  const output = join(dir, "result.json");
  await launchDsh({
    dshBin: child, dataDir: dir, args: [output], env: { PATH: "/usr/bin:/bin" },
    proxyExplicit: true, proxy: { mode: "direct", noProxy: "cli.local" }
  });
  const record = JSON.parse(await readFile(output, "utf8"));
  assert.equal(record.proxy.http, "");
  assert.equal(record.proxy.https, "");
  assert.equal(record.proxy.noProxy, "cli.local");
  await rm(dir, { recursive: true, force: true });
});

test("missing saved network settings inherit the current environment and invalid rows fail before spawn", async () => {
  const dir = await tempDir();
  const child = await executableRecorder(dir);
  const output = join(dir, "result.json");
  await launchDsh({ dshBin: child, dataDir: dir, args: [output], env: { PATH: "/usr/bin:/bin", HTTP_PROXY: "http://current.example", NO_PROXY: "current.local" } });
  const record = JSON.parse(await readFile(output, "utf8"));
  assert.equal(record.proxy.http, "http://current.example");
  assert.equal(record.proxy.noProxy, "current.local");
  const db = openDatabase({ dataDir: dir });
  const settings = createWorkbenchSettings({ repos: createRepositories(db) });
  settings.set("network", { mode: "custom", proxyUrl: "https://valid.example", noProxy: "valid.local" });
  db.prepare("UPDATE workbench_settings SET value = ? WHERE key = 'network'").run(JSON.stringify({ mode: "custom", proxyUrl: "ftp://invalid.example" }));
  closeDatabase(db);
  await assert.rejects(() => launchDsh({ dshBin: join(dir, "must-not-spawn"), dataDir: dir, env: { PATH: "/usr/bin:/bin" } }), /saved|proxy|invalid/i);
  await rm(dir, { recursive: true, force: true });
});

test("proxy accepts only credential-free HTTP(S) URLs and direct mode clears inherited proxies", () => {
  assert.equal(validateProxyUrl("https://proxy.example:8443/path"), "https://proxy.example:8443/path");
  assert.throws(() => validateProxyUrl("ftp://proxy.example"), /http or https/i);
  assert.throws(() => validateProxyUrl("https://user:password@proxy.example"), /credentials/i);
  const env = buildProxyEnv({
    mode: "direct",
    noProxy: "localhost",
    env: { HTTP_PROXY: "http://old", HTTPS_PROXY: "http://old", http_proxy: "http://old", https_proxy: "http://old", NO_PROXY: "old.local", no_proxy: "old.local" }
  });
  assert.equal(env.NODE_USE_ENV_PROXY, "1");
  assert.equal(env.HTTP_PROXY, "");
  assert.equal(env.HTTPS_PROXY, "");
  assert.equal(env.http_proxy, "");
  assert.equal(env.https_proxy, "");
  assert.equal(env.NO_PROXY, "localhost");
  assert.equal(env.no_proxy, "localhost");
  const custom = buildProxyEnv({ mode: "custom", proxyUrl: "https://proxy.example", noProxy: "custom.local", env: { no_proxy: "old.local" } });
  assert.equal(custom.http_proxy, "https://proxy.example");
  assert.equal(custom.https_proxy, "https://proxy.example");
  assert.equal(custom.NO_PROXY, "custom.local");
  assert.equal(custom.no_proxy, "custom.local");
});

test("launcher CLI consumes only its own flags and preserves DSH args", () => {
  assert.deepEqual(parseWorkbenchArgs(["web", "--codex-auth=auto", "--proxy-mode", "custom", "--proxy-url", "https://proxy.example", "--no-proxy", "localhost", "--resume", "abc"]), {
    command: "web",
    codexAuth: "auto",
    proxy: { mode: "custom", proxyUrl: "https://proxy.example", noProxy: "localhost" },
    proxyExplicit: true,
    proxyFields: ["mode", "proxyUrl", "noProxy"],
    dataDir: undefined,
    args: ["--resume", "abc"]
  });
  assert.deepEqual(parseWorkbenchArgs(["web", "--", "--codex-auth=auto"]), {
    command: "web",
    codexAuth: "disabled",
    proxy: { mode: "inherit", noProxy: "" },
    proxyExplicit: false,
    proxyFields: [],
    dataDir: undefined,
    args: ["--codex-auth=auto"]
  });
  assert.throws(() => parseWorkbenchArgs(["web", "--codex-auth="]), /needs a non-empty value/i);
  assert.throws(() => parseWorkbenchArgs(["web", "--proxy-mode="]), /needs a non-empty value/i);
  assert.throws(() => parseWorkbenchArgs(["web", "--proxy-url="]), /needs a non-empty value/i);
  assert.throws(() => parseWorkbenchArgs(["web", "--no-proxy="]), /needs a non-empty value/i);
});

test("default DSH resolution does not require a dsh executable on PATH", () => {
  const command = resolveDshCommand({ requireResolve: () => { throw new Error("not installed"); }, env: { PATH: "/empty" } });
  assert.equal(command.file, "npx");
  assert.deepEqual(command.prefixArgs, ["--yes", "@deepseek-ai/dsh@0.1.1-rc.2"]);
});

test("default DSH resolution runs through npx when no global dsh is available", async (t) => {
  const dir = await tempDir();
  t.after(() => rm(dir, { recursive: true, force: true }));
  const npx = await executableRecorder(dir);
  const pathBin = join(dir, "bin");
  await mkdir(pathBin);
  await symlink(npx, join(pathBin, "npx"));
  const output = join(dir, "result.json");
  const result = await launchDsh({
    args: [output],
    env: { PATH: pathBin, DSH_CYBERPUNK_WORKBENCH_DATA_DIR: dir }
  });
  assert.equal(result.code, 7);
  const record = JSON.parse(await readFile(output, "utf8"));
  assert.deepEqual(record.argv, ["--yes", "@deepseek-ai/dsh@0.1.1-rc.2", "web", output]);
});

test("launcher and host resolve the same configurable DSH_HOME data root", () => {
  assert.equal(resolveDataRoot({ env: { DSH_HOME: "/tmp/example-dsh-home" } }), "/tmp/example-dsh-home/cyberpunk-workbench");
});

test("launcher subprocess ends with the same signal received by its child", async (t) => {
  const dir = await tempDir();
  t.after(() => rm(dir, { recursive: true, force: true }));
  const child = join(dir, "wait-child.mjs");
  await writeFile(child, `#!${process.execPath}
setInterval(() => {}, 1000);
`);
  await chmod(child, 0o755);
  await chmod(child, 0o755);
  for (const signal of ["SIGTERM", "SIGINT"]) {
    const launched = spawn(process.execPath, [fileURLToPath(new URL("../bin/dsh-workbench.js", import.meta.url)), "web"], {
      env: { PATH: "/usr/bin:/bin", DSH_BIN: child, DSH_CYBERPUNK_WORKBENCH_DATA_DIR: dir },
      stdio: ["ignore", "ignore", "pipe"]
    });
    let stderr = "";
    launched.stderr.on("data", (chunk) => { stderr += chunk; });
    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`${signal} launcher timeout`)), 5000);
      launched.once("error", reject);
      launched.once("exit", (code, received) => { clearTimeout(timeout); resolve({ code, signal: received }); });
      setTimeout(() => launched.kill(signal), 100);
    });
    assert.deepEqual(result, { code: null, signal }, stderr);
  }
});

test("signal forwarding kills the child and disposes handlers", () => {
  const parent = new EventEmitter();
  const child = new EventEmitter();
  const signals = [];
  child.kill = (signal) => signals.push(signal);
  const dispose = forwardChildSignals({ processLike: parent, child });
  parent.emit("SIGINT");
  assert.deepEqual(signals, ["SIGINT"]);
  dispose();
  parent.emit("SIGTERM");
  assert.deepEqual(signals, ["SIGINT"]);
  dispose();
});

test("Codex patch binds the optional credential and uses proxy-safe SSE", async () => {
  const patch = await readFile(new URL("../dsh-codex.patch.yml", import.meta.url), "utf8");
  assert.match(patch, /openai-codex:/);
  assert.match(patch, /apiKeyEnv:\s*OPENAI_CODEX_ACCESS_TOKEN/);
  assert.match(patch, /transport:\s*sse/);
  assert.doesNotMatch(patch, /agent-default-model|gpt-5\.6-luna|deepseek-v4-flash/);
});
