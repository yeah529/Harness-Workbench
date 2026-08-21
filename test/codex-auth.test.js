import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

import { createCodexAuth, CODEX_CREDENTIAL_REF } from "../src/host/codex-auth.js";
import { createTempDir, removeTempDir } from "./helpers.js";

function memoryCredentials() {
  const values = new Map();
  const calls = [];
  return {
    calls,
    async describe(ref) {
      calls.push(["describe", ref]);
      return { configured: values.has(ref), source: values.has(ref) ? "credentials" : null, writable: true };
    },
    async resolve(ref) {
      calls.push(["resolve", ref]);
      return values.has(ref) ? { value: values.get(ref), source: "credentials" } : undefined;
    },
    async set(ref, value) {
      calls.push(["set", ref, value]);
      values.set(ref, value);
    },
  };
}

test("Codex status is sanitized and never scans auth.json before explicit connect", async (t) => {
  const codexHome = await createTempDir();
  t.after(() => removeTempDir(codexHome));
  await writeFile(codexHome + "/auth.json", "not-json");
  const credentials = memoryCredentials();
  const auth = createCodexAuth({ credentials, codexHome, env: {} });

  assert.deepEqual(await auth.status(), {
    provider: "openai-codex",
    configured: false,
    source: null,
    readOnly: false,
    canConnect: true,
    activation: "next-request",
  });
  assert.deepEqual(credentials.calls, [["describe", CODEX_CREDENTIAL_REF]]);
});

test("explicit Codex connect imports the cache into DSH credentials without leaking the token", async (t) => {
  const codexHome = await createTempDir();
  t.after(() => removeTempDir(codexHome));
  const token = `codex-connect-${Date.now()}-${Math.random()}`;
  await writeFile(codexHome + "/auth.json", JSON.stringify({ tokens: { access_token: token } }));
  const credentials = memoryCredentials();
  const auth = createCodexAuth({ credentials, codexHome, env: {} });

  const result = await auth.connect();
  assert.equal(result.configured, true);
  assert.equal(result.source, "credentials");
  assert.equal(result.activation, "next-request");
  assert.equal(JSON.stringify(result).includes(token), false);
  assert.deepEqual(credentials.calls.find((call) => call[0] === "set"), ["set", CODEX_CREDENTIAL_REF, token]);
  assert.deepEqual(await auth.test(), { ok: true, code: "CREDENTIAL_READY", activation: "next-request" });
});

test("Codex connect reports stable cache errors and never logs secret material", async (t) => {
  const codexHome = await createTempDir();
  t.after(() => removeTempDir(codexHome));
  await writeFile(codexHome + "/auth.json", JSON.stringify({ tokens: {} }));
  const auth = createCodexAuth({ credentials: memoryCredentials(), codexHome, env: {} });

  await assert.rejects(() => auth.connect(), (error) => {
    assert.equal(error.code, "CODEX_AUTH_TOKEN_MISSING");
    assert.equal(error.status, 422);
    assert.doesNotMatch(error.message, /auth\.json|\.codex/);
    return true;
  });
});

test("environment-backed Codex credential remains read-only and is not overwritten", async () => {
  let setCalls = 0;
  const credentials = {
    async describe() { return { configured: true, source: "env", writable: false }; },
    async resolve() { return { value: "env-owned-token", source: "env" }; },
    async set() { setCalls += 1; },
  };
  const auth = createCodexAuth({ credentials, env: {} });
  const result = await auth.connect();
  assert.equal(result.configured, true);
  assert.equal(result.readOnly, true);
  assert.equal(result.source, "env");
  assert.equal(setCalls, 0);
  assert.equal(JSON.stringify(result).includes("env-owned-token"), false);
});
