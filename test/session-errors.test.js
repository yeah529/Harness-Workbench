/**
 * Lightweight session error module smoke test (Task 8A-R item 4).
 *
 * WorkbenchSessionError + SESSION_ERROR_CODES live in the tiny
 * src/host/session-errors.js module so api.js can import them for instanceof
 * mapping WITHOUT transitively loading sessions.js (and thus dsh-agent /
 * dsh-session). This guards that contract: the module is self-contained and
 * api.js imports it instead of sessions.js.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { WorkbenchSessionError, SESSION_ERROR_CODES } from "../src/host/session-errors.js";

test("session-errors.js exports the error class and stable codes", () => {
  assert.equal(typeof WorkbenchSessionError, "function");
  assert.equal(SESSION_ERROR_CODES.RETRIEVAL_FAILED, "ERETRIEVAL_FAILED");
  assert.equal(SESSION_ERROR_CODES.SCOPE_MISMATCH, "ESCOPE_MISMATCH");
  assert.equal(SESSION_ERROR_CODES.CONTEXT_SOURCE_UNAVAILABLE, "ECONTEXT_SOURCE_UNAVAILABLE");
  assert.equal(SESSION_ERROR_CODES.SESSION_RESUME_FAILED, "ESESSION_RESUME_FAILED");

  const err = new WorkbenchSessionError(SESSION_ERROR_CODES.SESSION_NOT_FOUND, "gone", new Error("cause"));
  assert.equal(err.name, "WorkbenchSessionError");
  assert.equal(err.code, "ESESSION_NOT_FOUND");
  assert.equal(err.message, "gone");
  assert.ok(err.cause instanceof Error);
});

test("session-errors.js imports nothing from @deepseek-ai (lightweight)", async () => {
  const src = await readFile(new URL("../src/host/session-errors.js", import.meta.url), "utf8");
  assert.ok(!/from\s+["']@deepseek-ai\//.test(src), "session-errors.js must not import @deepseek-ai packages");
});

test("api.js imports session-errors.js, not sessions.js (no dsh-agent/dsh-session pull-in)", async () => {
  const src = await readFile(new URL("../src/host/api.js", import.meta.url), "utf8");
  assert.ok(/session-errors\.js/.test(src), "api.js imports the lightweight error module");
  assert.ok(!/from\s+["']\.\/sessions\.js["']/.test(src), "api.js must not statically import sessions.js");
});

test("api.test.js imports session-errors.js, not sessions.js (HTTP test process stays lightweight)", async () => {
  const src = await readFile(new URL("./api.test.js", import.meta.url), "utf8");
  assert.ok(/from\s+["']\.\.\/src\/host\/session-errors\.js["']/.test(src), "api.test.js imports the lightweight error module");
  assert.ok(!/from\s+["']\.\.\/src\/host\/sessions\.js["']/.test(src), "api.test.js must not statically import sessions.js");
});
