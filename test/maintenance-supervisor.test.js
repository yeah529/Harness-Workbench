import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { EventEmitter } from "node:events";
import {
  access,
  appendFile,
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { closeDatabase, openDatabase } from "../src/host/database.js";
import { createPurgeJobStore } from "../src/maintenance/purge-jobs.js";
import {
  buildSupervisedChildEnv,
  launchDsh,
  recoverIncompletePurge,
  waitForGenerationReady,
} from "../src/launcher/process.js";

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function waitUntil(check, message, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const value = await check();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(message);
}

async function makeFixture(t) {
  const root = await mkdtemp(join(tmpdir(), "cpwb-supervisor-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dshHome = join(root, "dsh");
  const dataDir = join(root, "workbench");
  const logFile = join(root, "generations.jsonl");
  await mkdir(join(dshHome, "storages"), { recursive: true });
  await mkdir(join(dshHome, "sessions", "target", "session-target"), { recursive: true });
  await mkdir(join(dshHome, "sessions", "keep", "session-keep"), { recursive: true });
  await mkdir(join(dataDir, "vectors", "chunks.lance"), { recursive: true });
  await mkdir(join(dataDir, "files"), { recursive: true });
  await writeFile(join(dshHome, "sessions", "target", "session-target", "session.jsonl.zstd"), "target");
  await writeFile(join(dshHome, "sessions", "keep", "session-keep", "session.jsonl.zstd"), "keep");
  closeDatabase(openDatabase({ dataDir }));
  await writeFile(join(dataDir, "vectors", "chunks.lance", "rows.lance"), "vectors-before");
  await writeFile(join(dshHome, "storages", "workspace.json"), JSON.stringify({
    global: { archivedSessionIds: [] },
    tables: { workspaces: { target: { sessionIds: ["session-target"] }, keep: { sessionIds: ["session-keep"] } } },
  }));
  await writeFile(join(dshHome, "storages", "session_projcache.json"), JSON.stringify({
    tables: {
      sessions: {
        "session-target": { identity: { cwd: "/target" } },
        "session-keep": { identity: { cwd: "/keep" } },
      },
    },
  }));
  return { root, dshHome, dataDir, logFile };
}

async function writeHostStub(root, logFile, { exitJobGeneration = false } = {}) {
  const file = join(root, "dsh-host-stub.mjs");
  const storeUrl = new URL("../src/maintenance/purge-jobs.js", import.meta.url).href;
  await writeFile(file, `#!${process.execPath}
import { createHash } from "node:crypto";
import { appendFile } from "node:fs/promises";
import { createPurgeJobStore } from ${JSON.stringify(storeUrl)};

const jobs = createPurgeJobStore({ dshHome: process.env.CPWB_DSH_HOME });
const generation = process.env.CPWB_LAUNCH_GENERATION;
const jobId = process.env.CPWB_MAINTENANCE_JOB_ID || null;
await appendFile(${JSON.stringify(logFile)}, JSON.stringify({
  pid: process.pid,
  generation,
  jobId,
  tokenHash: process.env.OPENAI_CODEX_ACCESS_TOKEN
    ? createHash("sha256").update(process.env.OPENAI_CODEX_ACCESS_TOKEN).digest("hex")
    : null,
  proxy: {
    http: process.env.HTTP_PROXY,
    https: process.env.HTTPS_PROXY,
    noProxy: process.env.NO_PROXY,
    nodeUseEnvProxy: process.env.NODE_USE_ENV_PROXY,
  },
}) + "\\n");
if (jobId) {
  await jobs.transition(jobId, "restarting", "workbench_finalizing");
  await jobs.transition(jobId, "workbench_finalizing", "verifying");
}
await jobs.writeReady(generation, { jobId, generation, readyAt: new Date().toISOString() });
if (${JSON.stringify(exitJobGeneration)} && jobId) process.exit(0);
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
setInterval(() => {}, 1000);
`);
  await chmod(file, 0o755);
  return file;
}

async function createArmedJob(jobs, jobId) {
  const created = await jobs.create({
    jobId,
    container: { kind: "project", id: 1, name: "Research" },
    sessionIds: ["session-target"],
    descendantSessionIds: [],
    orphanDocuments: [],
    createdAt: "2026-08-25T12:00:00.000Z",
  });
  return jobs.arm(created.jobId);
}

async function waitForFirstChild(logFile) {
  return waitUntil(async () => {
    if (!(await pathExists(logFile))) return false;
    return (await readFile(logFile, "utf8")).trim().split("\n").length >= 1;
  }, "first supervised child did not start");
}

test("supervised launcher restarts once, preserves auth/proxy, and commits exact deletion", async (t) => {
  const fixture = await makeFixture(t);
  const child = await writeHostStub(fixture.root, fixture.logFile);
  const jobs = createPurgeJobStore({ dshHome: fixture.dshHome });
  const parent = new EventEmitter();
  const token = `supervisor-token-${Date.now()}`;

  const launch = launchDsh({
    dshBin: child,
    dataDir: fixture.dataDir,
    processLike: parent,
    readyTimeoutMs: 3000,
    monitorPollMs: 20,
    env: {
      PATH: "/usr/bin:/bin",
      DSH_HOME: fixture.dshHome,
      CODEX_ACCESS_TOKEN: token,
    },
    proxy: {
      mode: "custom",
      proxyUrl: "http://127.0.0.1:7897",
      noProxy: "localhost,127.0.0.1",
    },
  });

  await waitForFirstChild(fixture.logFile);
  const created = await createArmedJob(jobs, "purge-supervisor");

  await waitUntil(async () => (await jobs.read(created.jobId)).state === "completed", "purge did not complete");
  parent.emit("SIGTERM");
  const result = await launch;
  assert.equal(result.signal, "SIGTERM");

  const generations = (await readFile(fixture.logFile, "utf8"))
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  assert.equal(generations.length, 2);
  assert.notEqual(generations[0].pid, generations[1].pid);
  assert.equal((await jobs.read(created.jobId)).state, "completed");
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "target", "session-target")), false);
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "keep", "session-keep")), true);
  const tokenHash = createHash("sha256").update(token).digest("hex");
  assert.equal(generations[0].tokenHash, tokenHash);
  assert.equal(generations[1].tokenHash, tokenHash);
  assert.deepEqual(generations[1].proxy, generations[0].proxy);
});

test("maintenance restart failure restores all data and starts one healthy recovery child", async (t) => {
  const fixture = await makeFixture(t);
  const child = await writeHostStub(fixture.root, fixture.logFile);
  const jobs = createPurgeJobStore({ dshHome: fixture.dshHome });
  const parent = new EventEmitter();
  const launch = launchDsh({
    dshBin: child,
    dataDir: fixture.dataDir,
    processLike: parent,
    readyTimeoutMs: 3000,
    monitorPollMs: 20,
    env: { PATH: "/usr/bin:/bin", DSH_HOME: fixture.dshHome },
    faultInjector(boundary) {
      if (boundary === "before-maintenance-child-spawn") {
        const error = new Error("injected maintenance restart failure");
        error.code = "INJECTED_RESTART_FAILURE";
        throw error;
      }
    },
  });

  await waitForFirstChild(fixture.logFile);
  const job = await createArmedJob(jobs, "purge-restart-restore");
  await waitUntil(async () => (await jobs.read(job.jobId)).state === "restored", "purge was not restored");
  parent.emit("SIGTERM");
  assert.equal((await launch).signal, "SIGTERM");
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "target", "session-target")), true);
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "keep", "session-keep")), true);
  const workspace = JSON.parse(await readFile(join(fixture.dshHome, "storages", "workspace.json"), "utf8"));
  const projection = JSON.parse(await readFile(join(fixture.dshHome, "storages", "session_projcache.json"), "utf8"));
  assert.deepEqual(workspace.tables.workspaces.target.sessionIds, ["session-target"]);
  assert.equal(Object.hasOwn(projection.tables.sessions, "session-target"), true);
  assert.equal((await readFile(fixture.logFile, "utf8")).trim().split("\n").length, 2);
});

test("failed recovery leaves rollback_pending and the next healthy launch restores before ready", async (t) => {
  const fixture = await makeFixture(t);
  const child = await writeHostStub(fixture.root, fixture.logFile);
  const jobs = createPurgeJobStore({ dshHome: fixture.dshHome });
  const firstParent = new EventEmitter();
  const firstLaunch = launchDsh({
    dshBin: child,
    dataDir: fixture.dataDir,
    processLike: firstParent,
    readyTimeoutMs: 3000,
    monitorPollMs: 20,
    env: { PATH: "/usr/bin:/bin", DSH_HOME: fixture.dshHome },
    faultInjector(boundary) {
      if (["before-maintenance-child-spawn", "before-recovery-child-spawn"].includes(boundary)) {
        const error = new Error(`injected ${boundary}`);
        error.code = "INJECTED_RECOVERY_FAILURE";
        throw error;
      }
    },
  });

  await waitForFirstChild(fixture.logFile);
  const job = await createArmedJob(jobs, "purge-rollback-pending");
  assert.deepEqual(await firstLaunch, { code: 1, signal: null });
  const pending = await jobs.read(job.jobId);
  assert.equal(pending.state, "rollback_pending");
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "target", "session-target")), true);
  assert.equal(await pathExists((await jobs.readManifest(job.jobId)).backupRoot), true);

  const secondParent = new EventEmitter();
  const secondLaunch = launchDsh({
    dshBin: child,
    dataDir: fixture.dataDir,
    processLike: secondParent,
    readyTimeoutMs: 3000,
    monitorPollMs: 20,
    env: { PATH: "/usr/bin:/bin", DSH_HOME: fixture.dshHome },
  });
  await waitUntil(async () => (await jobs.read(job.jobId)).state === "restored", "next launch did not restore");
  secondParent.emit("SIGTERM");
  assert.equal((await secondLaunch).signal, "SIGTERM");
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "target", "session-target")), true);
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "keep", "session-keep")), true);
});

test("parent signal after quarantine restores before returning the same signal", async (t) => {
  const fixture = await makeFixture(t);
  const child = await writeHostStub(fixture.root, fixture.logFile, { exitJobGeneration: true });
  const jobs = createPurgeJobStore({ dshHome: fixture.dshHome });
  const parent = new EventEmitter();
  const launch = launchDsh({
    dshBin: child,
    dataDir: fixture.dataDir,
    processLike: parent,
    readyTimeoutMs: 3000,
    monitorPollMs: 20,
    env: { PATH: "/usr/bin:/bin", DSH_HOME: fixture.dshHome },
    faultInjector(boundary) {
      if (boundary === "before-maintenance-child-spawn") parent.emit("SIGTERM");
    },
  });

  await waitForFirstChild(fixture.logFile);
  const job = await createArmedJob(jobs, "purge-interrupted");
  assert.equal((await launch).signal, "SIGTERM");
  assert.equal((await jobs.read(job.jobId)).state, "restored");
  assert.equal(await pathExists(join(fixture.dshHome, "sessions", "target", "session-target")), true);
  assert.equal((await readFile(fixture.logFile, "utf8")).trim().split("\n").length, 1);
});

test("supervised child environment never changes the sanitized auth and proxy base", () => {
  const base = { PATH: "/usr/bin:/bin", OPENAI_CODEX_ACCESS_TOKEN: "secret", HTTP_PROXY: "http://proxy" };
  const first = buildSupervisedChildEnv({
    baseEnv: base,
    dshHome: "/tmp/dsh",
    generation: "generation-1",
    recoveryCommand: "dsh-workbench web",
  });
  const second = buildSupervisedChildEnv({
    baseEnv: base,
    dshHome: "/tmp/dsh",
    generation: "generation-2",
    jobId: "purge-1",
    recoveryCommand: "dsh-workbench web",
  });
  assert.equal(second.OPENAI_CODEX_ACCESS_TOKEN, first.OPENAI_CODEX_ACCESS_TOKEN);
  assert.equal(second.HTTP_PROXY, first.HTTP_PROXY);
  assert.equal(second.CPWB_MAINTENANCE_JOB_ID, "purge-1");
  assert.equal("CPWB_MAINTENANCE_JOB_ID" in first, false);
});

test("recovery helpers are exported as explicit supervisor seams", () => {
  assert.equal(typeof waitForGenerationReady, "function");
  assert.equal(typeof recoverIncompletePurge, "function");
  assert.equal(typeof appendFile, "function");
});
