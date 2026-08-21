/**
 * Host plugin apply() lifecycle boundary tests.
 *
 * apply() must release whatever it created before an initialization failure so
 * a failed boot never leaks an open database. Generation uses the existing DSH
 * provider route; this plugin has no adapter registration boundary.
 *
 * Cordis calls the plugin body as runtime.callback(this.ctx, this.config):
 * the plugin config arrives as apply()'s SECOND argument, while ctx exposes
 * only the declared inject services plus runtime methods like
 * effect. Accessing anything else — notably ctx.config, which is never
 * injected — must throw, exactly like Cordis' "cannot get property <name>
 * without inject". makeCtx() below reproduces that shape with a Proxy so a
 * regression back to reading ctx.config fails loudly.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { inject, apply, createScheduledRunPrompt } from "../src/host/index.js";
import { createTempDir, removeTempDir } from "./helpers.js";

/**
 * Build a Cordis-like ctx for apply(). Only the declared inject services and
 * the runtime methods explicitly passed here are reachable; any other property
 * access (e.g. ctx.config) throws, simulating Cordis' missing-inject error.
 */
function makeCtx({ webServer, effect }) {
  const provided = { webServer, effect };
  return new Proxy(provided, {
    get(target, prop, receiver) {
      if (Reflect.has(target, prop)) return Reflect.get(target, prop, receiver);
      throw new Error(`cannot get property ${String(prop)} without inject`);
    },
  });
}

test("ctx.config is not injected and must throw (real Cordis shape)", () => {
  const ctx = makeCtx({ webServer: {}, effect() {} });
  assert.throws(
    () => ctx.config,
    /cannot get property config without inject/,
  );
});

test("host injects the DSH agent/session/workspace services it composes", () => {
  for (const name of ["webServer", "agents", "sessions", "workspaceRegistry"]) {
    assert.ok(inject.includes(name), "missing inject: " + name);
  }
  assert.equal(inject.includes("llm"), false, "the plugin must not register a generation adapter");
});

test("host apply fails cleanly when initialization cannot open its database", async (t) => {
  const dataDir = await createTempDir();
  const blocker = join(dataDir, "blocker");
  await writeFile(blocker, "x");
  // dataDir points at a path whose parent is a regular file, so openDatabase's
  // mkdirSync throws ENOTDIR — a deterministic init failure after the adapter
  // has already been registered.
  const badDataDir = join(blocker, "sub");
  t.after(async () => removeTempDir(dataDir));

  const ctx = makeCtx({
    webServer: { register() { return () => {}; } },
    effect(fn) { return fn(); },
  });

  // The plugin config is apply()'s second argument, never ctx.config.
  assert.throws(() => apply(ctx, { dataDir: badDataDir }));
});

test("host apply disposes cleanly on the happy path in order", async (t) => {
  const dataDir = await createTempDir();
  t.after(async () => removeTempDir(dataDir));

  const events = [];
  const disposers = [];
  const ctx = makeCtx({
    webServer: {
      register() {
        return () => { events.push("route"); };
      },
    },
    effect(fn) {
      const dispose = fn();
      disposers.push(dispose);
      return dispose;
    },
  });

  apply(ctx, { dataDir });
  assert.equal(disposers.length, 1);
  await disposers[0]();
  assert.deepEqual(events, ["route"]);
});

test("scheduled prompt releases its live handle and carries the persisted session id on failure", async () => {
  const calls = [];
  const runner = createScheduledRunPrompt({
    async createSession() {
      calls.push("create");
      return { sessionId: "session-scheduled-failed" };
    },
    async submitPrompt(input) {
      calls.push(["submit", input.sessionId]);
      throw new Error("provider unavailable");
    },
    async release(sessionId) { calls.push(["release", sessionId]); },
  });

  await assert.rejects(
    () => runner({ projectId: 7, prompt: "run" }),
    (error) => error.message === "provider unavailable" && error.sessionId === "session-scheduled-failed",
  );
  assert.deepEqual(calls, ["create", ["submit", "session-scheduled-failed"], ["release", "session-scheduled-failed"]]);
});

test("scheduled prompt releases its live handle after success", async () => {
  let released = null;
  const runner = createScheduledRunPrompt({
    async createSession() { return { sessionId: "session-scheduled-ok" }; },
    async submitPrompt() { return { outcome: { text: "ok" } }; },
    async release(sessionId) { released = sessionId; },
  });

  const result = await runner({ projectId: 7, prompt: "run" });
  assert.deepEqual(result, { sessionId: "session-scheduled-ok", text: "ok" });
  assert.equal(released, "session-scheduled-ok");
});
