/**
 * Host HTTP API + automatic index queue tests (Task 6).
 *
 * These tests drive the API over a real node:http server (the handler is the
 * exact one registered with DSH webServer.register as a "/api/cpwb" prefix
 * route) against a real SQLite database and real file storage. The
 * Ollama/LanceDB boundary is a small injected fake indexer, so the queue's
 * serial/fail-continue/ready-not-reindex behavior is observable without
 * network or a vector store.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { createApi } from "../src/host/api.js";
import { createIndexQueue } from "../src/host/queue.js";
import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import { createWorkbenchSettings } from "../src/host/settings.js";
import { localDateTimeParts } from "../src/host/timezone.js";
import { WorkbenchSessionError, SESSION_ERROR_CODES } from "../src/host/session-errors.js";
import { createTempDir, removeTempDir } from "./helpers.js";

const JSON_HEADERS = { "content-type": "application/json" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const inProcessApis = new Map();
let nextApiId = 0;

/** Drive the exact API handler without node:http (Node 26 test-runner workaround). */
async function fetch(input, init = {}) {
  const requestUrl = new URL(String(input));
  const api = inProcessApis.get(requestUrl.origin);
  if (!api) throw new Error("unknown in-process API URL");

  const headers = Object.fromEntries(new Headers(init.headers ?? {}).entries());
  const body = init.body == null ? [] : [init.body];
  const req = Readable.from(body);
  req.method = init.method ?? "GET";
  req.url = requestUrl.pathname + requestUrl.search;
  req.headers = headers;

  let status = 200;
  let responseHeaders = {};
  let responseBody = Buffer.alloc(0);
  let destroyed = false;
  const finishListeners = [];
  const res = {
    headersSent: false,
    writeHead(nextStatus, nextHeaders) {
      status = nextStatus;
      responseHeaders = nextHeaders ?? {};
      this.headersSent = true;
    },
    end(value = "") {
      responseBody = Buffer.isBuffer(value) ? value : Buffer.from(String(value));
      for (const listener of finishListeners.splice(0)) listener();
    },
    once(event, listener) {
      if (event === "finish") finishListeners.push(listener);
      return this;
    },
    destroy() {
      destroyed = true;
    },
  };
  await api.handler(req, res);
  if (destroyed) throw new Error("API response was destroyed");
  return new Response(responseBody, { status, headers: responseHeaders });
}

/** Fake Ollama client: only the local embedding health surface is exposed. */
function makeFakeOllama({ embeddingPresent = true } = {}) {
  return {
    async health() {
      return {
        reachable: true,
        embedding: {
          model: "emb-model",
          present: embeddingPresent,
          dimensions: 1024,
          usable: embeddingPresent,
        },
      };
    },
  };
}

/** Fake retriever: records calls, returns a fixed citation. */
function makeFakeRetriever() {
  const calls = [];
  return {
    calls,
    async search(opts) {
      calls.push(opts);
      return [{
        sourceId: "1",
        documentId: 1,
        chunkIds: [1],
        originalName: "note.md",
        locator: "lines:1-1",
        heading: null,
        text: "a hit",
        score: 0.5,
        vectorSimilarity: 0.9,
        keywordMatched: true,
      }];
    },
  };
}

/**
 * Fake indexer standing in for the parse->embed->vector pipeline. It records
 * every call (document id, chunk count, and the resolved live links), enforces
 * serial observation (maxActive must stay 1), optionally fails the next N
 * calls, and marks the document ready on success.
 */
function makeFakeIndexer(repos) {
  const state = { calls: [], failRemaining: 0, delayMs: 0, active: 0, maxActive: 0 };
  return {
    state,
    async indexDocument({ documentId, chunks, projectIds, knowledgeBaseIds }) {
      state.active += 1;
      state.maxActive = Math.max(state.maxActive, state.active);
      state.calls.push({ documentId, chunkCount: chunks.length, projectIds, knowledgeBaseIds });
      try {
        if (state.delayMs > 0) await sleep(state.delayMs);
        if (state.failRemaining > 0) {
          state.failRemaining -= 1;
          throw new Error("boom-" + documentId);
        }
        repos.documents.updateIndexState(documentId, {
          status: "ready",
          error: null,
          indexedAt: new Date().toISOString(),
        });
        return { ok: true, documentId, chunkCount: chunks.length };
      } finally {
        state.active -= 1;
      }
    },
  };
}

/** A fake unified session service that records calls and returns canned results. */
function makeFakeSessionService({ materializeResult, materializeError, confirmResult, confirmError } = {}) {
  const calls = { materialize: [], confirm: [], open: [], rename: [], move: [], archive: [], restore: [], delete: [], contextGet: [], contextSet: [], contextRemove: [] };
  return {
    calls,
    async materializeDraft(input) {
      calls.materialize.push(input);
      if (materializeError) throw materializeError;
      return materializeResult ?? { sessionId: "session-1", scope: input.scope, title: input.title, lifecycleStatus: "draft_failed" };
    },
    async confirmDraft(input) {
      calls.confirm.push(input);
      if (confirmError) throw confirmError;
      return confirmResult ?? { sessionId: input.sessionId, lifecycleStatus: "active" };
    },
    async openSession(input) { calls.open.push(input); return { sessionId: input.sessionId, reused: true }; },
    async renameSession(input) { calls.rename.push(input); return { sessionId: input.sessionId, title: input.title, titleLocked: true }; },
    async moveSession(input) { calls.move.push(input); return { sessionId: input.sessionId, scope: input.scope }; },
    async archiveSession(sessionId) { calls.archive.push(sessionId); return { sessionId, archivedAt: "2026-08-23T09:30:00.000Z" }; },
    async restoreSession(sessionId) { calls.restore.push(sessionId); return { sessionId, archivedAt: null }; },
    async deleteSession(sessionId) { calls.delete.push(sessionId); return true; },
    getContext(sessionId) { calls.contextGet.push(sessionId); return [{ kind: "knowledge_base", id: "2", state: "inherited", available: true }]; },
    setContext(input) { calls.contextSet.push(input); return { ...input.source, state: input.mode }; },
    removeContext(input) { calls.contextRemove.push(input); return true; },
    async dispose() {},
  };
}

/** Start the full stack (real SQLite + files, fake Ollama/indexer) in-process. */
async function startApi(t, { ollama, retriever, indexer, services, sessions, settings, embeddingFactory, onEmbeddingConfigChange, credentials, codexAuth, dshAdapter, logger, networkEnv } = {}) {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const fakeOllama = ollama ?? makeFakeOllama();
  const fakeRetriever = retriever ?? makeFakeRetriever();
  const fakeIndexer = indexer ?? makeFakeIndexer(repos);
  const workbenchSettings = settings ?? createWorkbenchSettings({ repos });
  const queue = createIndexQueue({ repos, indexer: fakeIndexer });
  const api = createApi({
    repos,
    queue,
    ollama: fakeOllama,
    retriever: fakeRetriever,
    dataDir,
    services: services ?? {},
    sessions,
    settings: workbenchSettings,
    embeddingFactory,
    onEmbeddingConfigChange,
    credentials,
    codexAuth,
    dshAdapter,
    logger,
    networkEnv,
  });
  const origin = `http://cpwb-test-${++nextApiId}`;
  inProcessApis.set(origin, api);
  const base = `${origin}/api/cpwb`;
  t.after(async () => {
    inProcessApis.delete(origin);
    await queue.close();
    closeDatabase(db);
    await removeTempDir(dataDir);
  });
  return { base, repos, queue, fakeIndexer, fakeRetriever, dataDir, db };
}

function uploadBody(name, scope, scopeId, body) {
  return {
    method: "POST",
    headers: {
      "x-cpwb-filename": encodeURIComponent(name),
      "x-cpwb-scope": scope,
      "x-cpwb-scope-id": String(scopeId),
    },
    body,
  };
}

// ---------------------------------------------------------------- health

test("health reports only local embedding availability", async (t) => {
  const { base } = await startApi(t, {
    ollama: makeFakeOllama({ embeddingPresent: false }),
  });
  const res = await fetch(base + "/health");
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.embedding.present, false);
  assert.equal("generation" in body, false);
});

test("health reports usable local embedding state", async (t) => {
  const { base } = await startApi(t, {
    ollama: makeFakeOllama({ embeddingPresent: true }),
  });
  const res = await fetch(base + "/health");
  const body = await res.json();
  assert.equal(body.embedding.present, true);
});

test("settings API exposes global timezone, validates embedding before save, and keeps index status", async (t) => {
  const tested = [];
  const { base, repos } = await startApi(t, {
    embeddingFactory: (config) => ({
      async health() { tested.push(config); return { ok: true, model: config.model }; },
    }),
    dshAdapter: { async providerTest() { return { ok: true, provider: "test" }; } },
  });
  const timezone = await fetch(base + "/settings/timezone");
  assert.equal(timezone.status, 200);
  assert.equal((await timezone.json()).timezone, "Asia/Shanghai");

  const updatedTimezone = await fetch(base + "/settings/timezone", {
    method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ timezone: "America/Los_Angeles" }),
  });
  assert.equal(updatedTimezone.status, 200);
  assert.equal((await updatedTimezone.json()).timezone, "America/Los_Angeles");

  const patched = await fetch(base + "/settings/embedding", {
    method: "PATCH", headers: JSON_HEADERS,
    body: JSON.stringify({ model: "embed-v2", nested: { apiKey: "SENTINEL_API_KEY" } }),
  });
  assert.equal(patched.status, 200);
  assert.equal((await patched.json()).model, "embed-v2");
  assert.equal(tested.length, 1);
  assert.equal(JSON.stringify(repos.settings.list()).includes("SENTINEL_API_KEY"), false);

  const network = await fetch(base + "/settings/network/test", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ mode: "custom", proxyUrl: "http://127.0.0.1:8080" }),
  });
  assert.equal(network.status, 200);
  const networkBody = await network.json();
  assert.equal(networkBody.nextLaunchValidation.proxyConfigured, true);
  assert.equal("currentTests" in networkBody, true);
  const index = await fetch(base + "/settings/index");
  assert.equal(index.status, 200);
  assert.equal((await index.json()).status, "ready");
  assert.deepEqual((await (await fetch(base + "/settings/index")).json()).identity, {
    provider: "ollama",
    endpoint: "http://127.0.0.1:11434",
    model: "embed-v2",
    dimensions: 1024,
  });
});

test("automation prompt settings expose defaults, persist edits, and reject blank prompts", async (t) => {
  const { base } = await startApi(t);
  const initial = await fetch(base + "/settings/automation-prompts");
  assert.equal(initial.status, 200);
  assert.match((await initial.json()).summaryPrompt, /最终中文总结正文/);

  const updated = await fetch(base + "/settings/automation-prompts", {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ summaryPrompt: "Custom summary", todoPrompt: "Custom todo" }),
  });
  assert.equal(updated.status, 200);
  assert.deepEqual(await updated.json(), { summaryPrompt: "Custom summary", todoPrompt: "Custom todo" });

  const invalid = await fetch(base + "/settings/automation-prompts", {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ summaryPrompt: "   " }),
  });
  assert.equal(invalid.status, 422);
  assert.equal((await invalid.json()).error.code, "INVALID_AUTOMATION_PROMPT");
});

test("network test performs the configured embedding check and refuses a missing DSH provider adapter", async (t) => {
  const calls = [];
  const { base } = await startApi(t, {
    embeddingFactory: () => ({ async health() { calls.push("embedding"); return { ok: true }; } }),
  });
  const response = await fetch(base + "/settings/network/test", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ mode: "direct" }),
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "PROVIDER_UNAVAILABLE");
  assert.deepEqual(calls, ["embedding"]);
});

test("network test never forwards an arbitrary request URL to the provider adapter", async (t) => {
  let providerOptions;
  const { base } = await startApi(t, {
    embeddingFactory: () => ({ async health() { return { ok: true }; } }),
    dshAdapter: { async providerTest(options) { providerOptions = options; return { ok: true }; } },
  });
  const response = await fetch(base + "/settings/network/test", {
    method: "POST", headers: JSON_HEADERS,
    body: JSON.stringify({ mode: "direct", targetUrl: "http://169.254.169.254/latest/meta-data" }),
  });
  assert.equal(response.status, 200);
  assert.equal("targetUrl" in providerOptions.network, false);
});

test("network settings keep saved next-launch proxy separate from current process effective state", async (t) => {
  const { base } = await startApi(t, {
    networkEnv: { HTTP_PROXY: "", HTTPS_PROXY: "", NO_PROXY: "", NODE_USE_ENV_PROXY: "1" },
  });
  const direct = await fetch(base + "/settings/network", {
    method: "PATCH", headers: JSON_HEADERS,
    body: JSON.stringify({ mode: "direct", noProxy: "" }),
  });
  assert.equal(direct.status, 200);
  assert.equal((await direct.json()).requiresRestart, false);
  const saved = await fetch(base + "/settings/network", {
    method: "PATCH", headers: JSON_HEADERS,
    body: JSON.stringify({ mode: "custom", proxyUrl: "http://127.0.0.1:8080", noProxy: "localhost" }),
  });
  assert.equal(saved.status, 200);
  const savedBody = await saved.json();
  assert.equal(savedBody.nextLaunch.mode, "custom");
  assert.equal(savedBody.currentEffective.http, null);
  assert.equal(savedBody.currentEffective.https, null);
  assert.equal(savedBody.requiresRestart, true);

  const read = await fetch(base + "/settings/network");
  const body = await read.json();
  assert.equal(body.currentEffective.http, null);
  assert.equal(body.nextLaunch.proxyUrl, "http://127.0.0.1:8080");
  assert.equal(body.requiresRestart, true);
});

test("network test reports live current checks separately from next-launch validation", async (t) => {
  let providerNetwork;
  const { base } = await startApi(t, {
    networkEnv: { HTTP_PROXY: "", HTTPS_PROXY: "", NO_PROXY: "", NODE_USE_ENV_PROXY: "1" },
    embeddingFactory: () => ({ async health() { return { ok: true, via: "current" }; } }),
    dshAdapter: { async providerTest(options) { providerNetwork = options.network; return { ok: true, via: "current" }; } },
  });
  const response = await fetch(base + "/settings/network/test", {
    method: "POST", headers: JSON_HEADERS,
    body: JSON.stringify({ mode: "custom", proxyUrl: "http://127.0.0.1:8080" }),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.currentTests.embedding.via, "current");
  assert.equal(body.currentTests.provider.via, "current");
  assert.equal(body.nextLaunchValidation.proxyConfigured, true);
  assert.equal(body.nextLaunchValidation.requiresRestart, true);
  assert.equal(providerNetwork.http, null);
  assert.equal(providerNetwork.https, null);
});

test("Codex auth status, connect, and credential readiness use the dedicated host service", async (t) => {
  const calls = [];
  const sentinel = "api-must-not-return-this-token";
  const codexAuth = {
    async status() {
      calls.push("status");
      return { provider: "openai-codex", configured: false, source: null, readOnly: false, canConnect: true, activation: "next-request" };
    },
    async connect() {
      calls.push("connect");
      return { provider: "openai-codex", configured: true, source: "credentials", readOnly: false, canConnect: true, activation: "next-request" };
    },
    async test() {
      calls.push("test");
      return { ok: true, code: "CREDENTIAL_READY", activation: "next-request" };
    },
    sentinel,
  };
  const { base } = await startApi(t, { codexAuth });

  const status = await fetch(base + "/settings/auth/status");
  assert.equal(status.status, 200);
  assert.equal((await status.json()).canConnect, true);
  const connect = await fetch(base + "/settings/auth/codex/connect", {
    method: "POST", headers: JSON_HEADERS, body: "{}",
  });
  assert.equal(connect.status, 200);
  const connectBody = await connect.json();
  assert.equal(connectBody.configured, true);
  assert.equal(JSON.stringify(connectBody).includes(sentinel), false);
  const readiness = await fetch(base + "/settings/auth/test", {
    method: "POST", headers: JSON_HEADERS, body: "{}",
  });
  assert.equal(readiness.status, 200);
  assert.equal((await readiness.json()).code, "CREDENTIAL_READY");
  assert.deepEqual(calls, ["status", "connect", "test"]);
});

test("Codex connect returns a stable 501 when DSH credentials are unavailable", async (t) => {
  const { base } = await startApi(t);
  const response = await fetch(base + "/settings/auth/codex/connect", {
    method: "POST", headers: JSON_HEADERS, body: "{}",
  });
  assert.equal(response.status, 501);
  assert.equal((await response.json()).error.code, "CODEX_AUTH_UNAVAILABLE");
});

test("embedding settings expose DSH credential describe facts and rollback on reconfigure failure", async (t) => {
  let callbackCalls = 0;
  const credentials = {
    async describe(ref) { assert.equal(ref, "EMBEDDING_KEY"); return { configured: true, source: "env", writable: false }; },
  };
  const { base, repos } = await startApi(t, {
    credentials,
    embeddingFactory: () => ({ async health() { return { ok: true }; } }),
    onEmbeddingConfigChange: async () => { callbackCalls += 1; throw new Error("reconcile failed"); },
  });
  repos.settings.set("embedding", { credentialRef: "EMBEDDING_KEY" });
  const read = await fetch(base + "/settings/embedding");
  assert.equal(read.status, 200);
  assert.deepEqual((await read.json()).credential, { configured: true, source: "env", readOnly: true });
  const patch = await fetch(base + "/settings/embedding", {
    method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ model: "should-rollback" }),
  });
  assert.equal(patch.status, 502);
  assert.equal((await patch.json()).error.code, "EMBEDDING_RECONFIGURE_FAILED");
  assert.equal(repos.settings.get("embedding").model, "qwen3-embedding:0.6b");
  assert.equal(callbackCalls, 2);
});

// ------------------------------------------------- projects / knowledge-bases

test("projects CRUD (create + list + validation)", async (t) => {
  const { base } = await startApi(t);

  let res = await fetch(base + "/projects", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ name: "Alpha", path: "/workspaces/alpha" }),
  });
  assert.equal(res.status, 201);
  const created = await res.json();
  assert.equal(created.name, "Alpha");
  assert.equal(created.path, "/workspaces/alpha");
  assert.ok(Number.isInteger(created.id) && created.id > 0);

  res = await fetch(base + "/projects");
  assert.equal(res.status, 200);
  const projects = await res.json();
  assert.equal(projects.length, 1);
  assert.equal(projects[0].name, "Alpha");

  res = await fetch(base + "/projects", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ path: "/x" }),
  });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_FIELD");
});

test("project deletion plan defaults to detaching sessions and never touches workspace files", async (t) => {
  const { base, repos } = await startApi(t);
  const project = repos.projects.create({ name: "Before", path: "/workspace/keep-me", workspaceId: "ws-keep" });
  repos.todos.create({ projectId: project.id, title: "Child", dueAt: "2026-08-22T10:00:00.000Z" });

  let response = await fetch(base + "/projects/" + project.id, {
    method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ name: "  After  " }),
  });
  assert.equal(response.status, 200);
  const renamed = await response.json();
  assert.equal(renamed.name, "After");
  assert.equal(renamed.path, "/workspace/keep-me");
  assert.equal(renamed.workspaceId, "ws-keep");

  response = await fetch(base + "/projects/" + project.id, {
    method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ name: "   " }),
  });
  assert.equal(response.status, 422);
  assert.equal((await response.json()).error.code, "INVALID_FIELD");

  repos.workbenchSessions.create({ sessionId: "session-cpwb-project-owned", scope: { kind: "project", id: project.id } });
  response = await fetch(base + "/projects/" + project.id + "/deletion-plan");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    kind: "project",
    id: project.id,
    name: "After",
    sessionCount: 1,
    relationshipCount: 0,
    documentCount: 0,
    orphanDocumentCount: 0,
    permanentDeletion: {
      available: false,
      requiresRestart: true,
      backend: null,
      reason: "Permanent deletion requires dsh-workbench supervised mode",
    },
  });

  response = await fetch(base + "/projects/" + project.id, { method: "DELETE" });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { removed: true, projectId: project.id, sessionPolicy: "detach", detachedSessionCount: 1, deletedSessionCount: 0, orphanDocumentIds: [] });
  assert.equal(repos.projects.get(project.id), null);
  assert.equal(repos.todos.list({ projectId: project.id }).length, 0);
  assert.deepEqual(repos.workbenchSessions.get("session-cpwb-project-owned").scope, { kind: "independent", id: null });

  response = await fetch(base + "/projects/" + project.id, { method: "DELETE" });
  assert.equal(response.status, 404);
});

test("permanent project deletion fails closed before any data changes when native deletion is unavailable", async (t) => {
  const { base, repos } = await startApi(t);
  const project = repos.projects.create({ name: "Keep until supported" });
  repos.workbenchSessions.create({ sessionId: "session-cpwb-keep", scope: { kind: "project", id: project.id } });
  const response = await fetch(base + "/projects/" + project.id + "?sessionPolicy=delete", { method: "DELETE" });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, "PURGE_JOB_REQUIRED");
  assert.equal(repos.projects.get(project.id).name, "Keep until supported");
  assert.deepEqual(repos.workbenchSessions.get("session-cpwb-keep").scope, { kind: "project", id: project.id });
});

test("purge API returns restart capability, arms after response, and hides server paths", async (t) => {
  const calls = [];
  const maintenance = {
    capability: () => ({
      available: true,
      requiresRestart: true,
      backend: "rc2-jsonl-zstd",
      reason: null,
    }),
    async containerPlan() {
      return {
        kind: "project",
        id: 4,
        name: "Research",
        sessionIds: ["session-parent"],
        descendantSessionIds: ["session-child"],
        relationshipCount: 0,
        linkedDocuments: [],
        orphanDocuments: [],
        planVersion: "plan-hash",
      };
    },
    async createPurgeJob(input) {
      calls.push(input);
      return {
        jobId: "purge-api",
        state: "queued",
        revision: 1,
        recoveryCommand: "dsh-workbench web",
        backupRoot: "/Users/private/backup",
      };
    },
    async armPurgeJob(jobId) { calls.push({ armed: jobId }); },
    async getJob() { return { jobId: "purge-api", state: "queued", revision: 1 }; },
    isLocked: () => false,
  };
  const { base } = await startApi(t, { services: { maintenance } });

  const plan = await fetch(base + "/projects/4/deletion-plan").then((response) => response.json());
  assert.equal(plan.permanentDeletion.available, true);
  assert.equal(plan.descendantSessionCount, 1);
  const response = await fetch(base + "/maintenance/purge-jobs", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      kind: "project",
      id: 4,
      planVersion: "plan-hash",
      confirmation: "Research",
      restartConfirmed: true,
    }),
  });
  assert.equal(response.status, 202);
  const body = await response.json();
  assert.equal(body.recoveryCommand, "dsh-workbench web");
  assert.equal("backupRoot" in body, false);
  assert.doesNotMatch(JSON.stringify(body), /Users|access_token|Authorization/);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(calls.at(-1), { armed: "purge-api" });
});

test("knowledge-bases CRUD", async (t) => {
  const { base } = await startApi(t);

  let res = await fetch(base + "/knowledge-bases", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ name: "Manual", description: "docs" }),
  });
  assert.equal(res.status, 201);
  const kb = await res.json();
  assert.equal(kb.name, "Manual");
  assert.equal(kb.description, "docs");

  res = await fetch(base + "/knowledge-bases");
  assert.equal(res.status, 200);
  const kbs = await res.json();
  assert.equal(kbs.length, 1);
});

test("knowledge-base list exposes real chip metrics and reverse project links", async (t) => {
  const { base, repos } = await startApi(t);
  const project = repos.projects.create({ name: "Harness Workbench" });
  const kb = repos.knowledgeBases.create({ name: "Architecture", description: "RC.2 docs" });
  const ready = repos.documents.upsertBySha256({
    sha256: "a".repeat(64), originalName: "ready.md", size: 12,
  });
  repos.documents.link({ documentId: ready.id, scope: "knowledgeBase", scopeId: kb.id });
  repos.documents.updateIndexState(ready.id, {
    status: "ready", error: null, indexedAt: "2026-08-24T08:00:00.000Z",
  });
  repos.chunks.replaceForDocument({
    documentId: ready.id,
    chunks: [
      { ordinal: 0, text: "one", locator: "line:1", heading: null, originalName: "ready.md", contentHash: "h1" },
      { ordinal: 1, text: "two", locator: "line:2", heading: null, originalName: "ready.md", contentHash: "h2" },
    ],
  });
  const pending = repos.documents.upsertBySha256({
    sha256: "b".repeat(64), originalName: "pending.md", size: 8,
  });
  repos.documents.link({ documentId: pending.id, scope: "knowledgeBase", scopeId: kb.id });
  repos.projectKnowledgeBases.link({ projectId: project.id, knowledgeBaseId: kb.id });
  repos.workbenchSessions.create({
    sessionId: "session-cpwb-kb-overview", scope: { kind: "knowledge_base", id: kb.id },
    provider: "deepseek-official", model: "deepseek-v4-flash",
  });
  repos.workbenchSessions.create({
    sessionId: "session-cpwb-project-overview", scope: { kind: "project", id: project.id },
    provider: "deepseek-official", model: "deepseek-v4-flash",
  });

  const response = await fetch(base + "/knowledge-bases");
  assert.equal(response.status, 200);
  const [listed] = await response.json();
  assert.equal(listed.name, "Architecture");
  assert.deepEqual(listed.overview, {
    fileCount: 2,
    readyFileCount: 1,
    chunkCount: 2,
    linkedProjectCount: 1,
    sessionCount: 1,
    indexPercent: 50,
    state: "indexing",
    latestIndexedAt: "2026-08-24T08:00:00.000Z",
  });
  assert.equal(listed.linkedProjects.length, 1);
  assert.equal(listed.linkedProjects[0].name, "Harness Workbench");
  assert.equal(listed.linkedProjects[0].sessionCount, 1);
  assert.equal(listed.recentDocuments.length, 2);
  assert.equal("sha256" in listed.recentDocuments[0], false, "overview never exposes storage identities");
});

// --------------------------------------------------------------- documents

test("raw upload persists file + document + link, then indexes to ready", async (t) => {
  const { base, repos, queue, fakeIndexer, dataDir } = await startApi(t);
  const p = repos.projects.create({ name: "P" });

  const res = await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "# hello\nworld"));
  assert.equal(res.status, 202);
  const { document, queued } = await res.json();
  assert.equal(queued, true);
  assert.equal(document.originalName, "note.md");
  assert.ok(document.sha256.length === 64);

  await queue.idle();

  const doc = repos.documents.get(document.id);
  assert.equal(doc.status, "ready");
  assert.ok(doc.indexedAt != null);

  const stored = await readFile(join(dataDir, "files", doc.sha256), "utf8");
  assert.equal(stored, "# hello\nworld");

  assert.deepEqual(repos.documents.listLinks(doc.id), [{ scope: "project", scopeId: p.id }]);
  assert.equal(fakeIndexer.state.calls.length, 1);
  assert.deepEqual(fakeIndexer.state.calls[0].projectIds, [p.id]);
  assert.deepEqual(fakeIndexer.state.calls[0].knowledgeBaseIds, []);
});

test("document content opens or downloads the original bytes without exposing a local path", async (t) => {
  const { base, repos, queue, dataDir } = await startApi(t);
  const kb = repos.knowledgeBases.create({ name: "K" });
  const uploaded = await fetch(base + "/documents", uploadBody("中文 笔记.md", "knowledgeBase", kb.id, "# 原始内容"));
  const { document } = await uploaded.json();
  await queue.idle();

  let response = await fetch(base + `/documents/${document.id}/content`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "# 原始内容");
  assert.match(response.headers.get("content-type"), /^text\/markdown/);
  assert.match(response.headers.get("content-disposition"), /^inline;/);
  assert.match(response.headers.get("content-security-policy"), /sandbox/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.doesNotMatch(response.headers.get("content-disposition"), new RegExp(dataDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  response = await fetch(base + `/documents/${document.id}/content?download=1`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-disposition"), /^attachment;/);
  assert.match(response.headers.get("content-disposition"), /UTF-8''/);

  response = await fetch(base + "/documents/999999/content");
  assert.equal(response.status, 404);
  assert.equal((await response.json()).error.code, "NOT_FOUND");
});

test("duplicate ready upload only adds association, does not reindex", async (t) => {
  const { base, repos, queue, fakeIndexer } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const kb = repos.knowledgeBases.create({ name: "K" });

  await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "same bytes"));
  await queue.idle();
  assert.equal(fakeIndexer.state.calls.length, 1);

  const res = await fetch(base + "/documents", uploadBody("note.md", "knowledgeBase", kb.id, "same bytes"));
  assert.equal(res.status, 202);
  const { document, queued } = await res.json();
  assert.equal(queued, false);
  assert.equal(document.status, "ready");
  await queue.idle();
  assert.equal(fakeIndexer.state.calls.length, 1, "ready document is never re-indexed");

  const links = repos.documents.listLinks(document.id);
  assert.equal(links.length, 2);
});

test("failed document is retried on re-upload", async (t) => {
  const { base, repos, queue, fakeIndexer } = await startApi(t);
  const p = repos.projects.create({ name: "P" });

  fakeIndexer.state.failRemaining = 1;
  const first = await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "bytes"));
  const { document } = await first.json();
  await queue.idle();
  assert.equal(repos.documents.get(document.id).status, "failed");

  const again = await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "bytes"));
  assert.equal(again.status, 202);
  const againBody = await again.json();
  assert.equal(againBody.queued, true);
  await queue.idle();
  assert.equal(repos.documents.get(document.id).status, "ready");
  assert.equal(fakeIndexer.state.calls.length, 2);
});

test("upload rejects over 50MB with a stable 413 code", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const big = new Uint8Array(50 * 1024 * 1024 + 1);
  const res = await fetch(base + "/documents", uploadBody("big.txt", "project", p.id, big));
  assert.equal(res.status, 413);
  assert.equal((await res.json()).error.code, "EFILE_TOO_LARGE");
});

test("upload rejects unsupported extension with a stable 415 code", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/documents", uploadBody("evil.exe", "project", p.id, "MZ"));
  assert.equal(res.status, 415);
  assert.equal((await res.json()).error.code, "EUNSUPPORTED_EXTENSION");
});

test("upload rejects path traversal filename with a stable 422 code", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/documents", uploadBody("../../x.md", "project", p.id, "hi"));
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "EINVAL_PATH");
});

test("upload decodes URI-encoded CJK filename", async (t) => {
  const { base, repos, queue } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/documents", uploadBody("笔记.md", "project", p.id, "中文内容"));
  const { document } = await res.json();
  assert.equal(document.originalName, "笔记.md");
  await queue.idle();
});

test("reindex sets parsing then enqueues and returns to ready", async (t) => {
  const { base, repos, queue, fakeIndexer } = await startApi(t);
  const p = repos.projects.create({ name: "P" });

  await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "v1"));
  await queue.idle();
  const docId = repos.documents.list()[0].id;
  assert.equal(repos.documents.get(docId).status, "ready");
  assert.equal(fakeIndexer.state.calls.length, 1);

  const res = await fetch(base + `/documents/${docId}/reindex`, { method: "POST" });
  assert.equal(res.status, 202);
  const { document, queued } = await res.json();
  assert.equal(queued, true);
  assert.equal(document.status, "parsing");

  await queue.idle();
  assert.equal(repos.documents.get(docId).status, "ready");
  assert.equal(fakeIndexer.state.calls.length, 2);
});

test("unlink uses DELETE /documents/:id/links/:scope/:scopeId with no body", async (t) => {
  const { base, repos, queue } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const kb = repos.knowledgeBases.create({ name: "K" });

  await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "bytes"));
  await queue.idle();
  const docId = repos.documents.list()[0].id;
  repos.documents.link({ documentId: docId, scope: "knowledgeBase", scopeId: kb.id });

  const res = await fetch(base + `/documents/${docId}/links/project/${p.id}`, { method: "DELETE" });
  assert.equal(res.status, 200);
  const { removed } = await res.json();
  assert.equal(removed, 1);
  assert.deepEqual(repos.documents.listLinks(docId), [{ scope: "knowledgeBase", scopeId: kb.id }]);
});

// ------------------------------------------------------------------ search

test("search is POST with a JSON body and returns citations", async (t) => {
  const { base, repos, fakeRetriever } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/search", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ query: "hello", scope: "project", scopeId: p.id, limit: 3 }),
  });
  assert.equal(res.status, 200);
  const hits = await res.json();
  assert.equal(hits.length, 1);
  assert.equal(hits[0].originalName, "note.md");
  assert.deepEqual(fakeRetriever.calls[0], { query: "hello", scope: "project", scopeId: p.id, limit: 3 });
});

test("search GET returns 405 (search is POST-only)", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/search?scope=project&scopeId=1&query=x");
  assert.equal(res.status, 405);
  assert.equal((await res.json()).error.code, "METHOD_NOT_ALLOWED");
});

test("search validates scope and scopeId", async (t) => {
  const { base } = await startApi(t);
  const post = (body) => fetch(base + "/search", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(body) });
  let res = await post({ query: "x", scope: "nope", scopeId: 1 });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_SCOPE");

  res = await post({ query: "x", scope: "project", scopeId: -1 });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_SCOPE_ID");
});

// ----------------------------------------------------- todos/schedules

test("todos CRUD validates dueAt and supports completion", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });

  let res = await fetch(base + "/todos", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id, title: "do the thing", dueAt: "2026-08-20T18:00:00+08:00" }),
  });
  assert.equal(res.status, 201);
  const todo = await res.json();
  assert.equal(todo.title, "do the thing");
  assert.equal(todo.dueAt, "2026-08-20T10:00:00.000Z");
  assert.equal(todo.done, false);

  res = await fetch(base + "/todos?projectId=" + p.id);
  assert.equal((await res.json()).length, 1);

  res = await fetch(base + "/todos", {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ id: todo.id, title: "revised", dueAt: "2026-08-21T12:00:00Z", done: true }),
  });
  assert.equal(res.status, 200);
  const updated = await res.json();
  assert.equal(updated.title, "revised");
  assert.equal(updated.done, true);
  assert.match(updated.completedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

  res = await fetch(base + "/todos", {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ id: todo.id, dueAt: "tomorrow" }),
  });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_DATETIME");

  res = await fetch(base + "/todos/" + todo.id, { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { removed: true, todoId: todo.id });
  assert.equal(repos.todos.list({ projectId: p.id }).length, 0);

  res = await fetch(base + "/todos/" + todo.id, { method: "DELETE" });
  assert.equal(res.status, 404);
});

test("todos API rejects an invalid source", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/todos", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id, title: "bad", dueAt: "2026-08-20T18:00:00Z", source: "imported" }),
  });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_SOURCE");
});

test("schedules CRUD accepts modal date-time/recurrence fields and deletes history", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });

  let res = await fetch(base + "/schedules", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id, name: "nightly", recurrence: "daily", startsAt: "2026-08-20T13:00:00.000Z", enabled: true }),
  });
  assert.equal(res.status, 201);
  const schedule = await res.json();
  assert.equal(schedule.name, "nightly");
  assert.equal(schedule.recurrence, "daily");
  assert.equal(schedule.startsAt, "2026-08-20T13:00:00.000Z");
  assert.ok(schedule.nextRunAt, "the API must expose a real next occurrence");

  res = await fetch(base + "/schedules?projectId=" + p.id);
  assert.equal((await res.json()).length, 1);

  res = await fetch(base + "/schedules", {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ id: schedule.id, enabled: false, name: "nightly-off" }),
  });
  assert.equal(res.status, 200);
  const updated = await res.json();
  assert.equal(updated.enabled, false);
  assert.equal(updated.name, "nightly-off");
  assert.equal(updated.nextRunAt, null, "a disabled schedule has no upcoming occurrence");

  repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt: schedule.startsAt });
  res = await fetch(base + "/schedules/" + schedule.id, { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).removed, true);
  assert.equal(repos.schedules.get(schedule.id), null);
  assert.deepEqual(repos.schedules.listRuns(schedule.id), []);
});

test("schedule nextRunAt uses the Workbench global timezone", async (t) => {
  const { base, repos } = await startApi(t, {
    settings: { get: (key) => key === "timezone" ? "America/Los_Angeles" : null },
  });
  const project = repos.projects.create({ name: "P" });
  const response = await fetch(base + "/schedules", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: project.id, name: "nightly", recurrence: "daily", startsAt: "2026-08-21T04:00:00.000Z" }),
  });
  assert.equal(response.status, 201);
  const schedule = await response.json();
  assert.equal(localDateTimeParts(new Date(schedule.nextRunAt), "America/Los_Angeles").hour, 21);
  assert.equal(localDateTimeParts(new Date(schedule.nextRunAt), "America/Los_Angeles").minute, 0);
});

test("knowledge-base DELETE removes its exclusive documents and keeps shared documents", async (t) => {
  const { base, repos } = await startApi(t);
  const target = repos.knowledgeBases.create({ name: "Target" });
  const other = repos.knowledgeBases.create({ name: "Other" });
  const orphan = repos.documents.upsertBySha256({ sha256: "1".repeat(64), originalName: "orphan.md", size: 1 });
  const shared = repos.documents.upsertBySha256({ sha256: "2".repeat(64), originalName: "shared.md", size: 1 });
  repos.documents.link({ documentId: orphan.id, scope: "knowledgeBase", scopeId: target.id });
  repos.documents.link({ documentId: shared.id, scope: "knowledgeBase", scopeId: target.id });
  repos.documents.link({ documentId: shared.id, scope: "knowledgeBase", scopeId: other.id });
  repos.workbenchSessions.create({ sessionId: "session-cpwb-kb-owned", scope: { kind: "knowledge_base", id: target.id } });

  const preview = await fetch(base + "/knowledge-bases/" + target.id + "/deletion-plan");
  assert.equal(preview.status, 200);
  assert.equal((await preview.json()).sessionCount, 1);

  const response = await fetch(base + "/knowledge-bases/" + target.id, { method: "DELETE" });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).orphanDocumentIds, [orphan.id]);
  assert.equal(repos.documents.get(orphan.id), null);
  assert.equal(repos.documents.get(shared.id).id, shared.id);
  assert.deepEqual(repos.workbenchSessions.get("session-cpwb-kb-owned").scope, { kind: "independent", id: null });
});

test("schedule runs list exposes status, session id, timestamp, and error", async (t) => {
  const { base, repos } = await startApi(t);
  const project = repos.projects.create({ name: "P" });
  const schedule = repos.schedules.create({ projectId: project.id, name: "s", rule: "daily 21:00" });
  const run = repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt: "2026-08-20T13:00:00.000Z" });
  repos.schedules.failRun({ id: run.id, sessionId: "session-failed", error: "provider unavailable", finishedAt: "2026-08-20T13:00:01.000Z" });

  const response = await fetch(base + `/schedules/${schedule.id}/runs`);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json())[0], {
    id: run.id,
    scheduleId: schedule.id,
    scheduledAt: "2026-08-20T13:00:00.000Z",
    status: "failed",
    sessionId: "session-failed",
    startedAt: null,
    finishedAt: "2026-08-20T13:00:01.000Z",
    error: "provider unavailable",
    claimed: false,
  });
});

test("schedule run delegates to injected service; 501 without it", async (t) => {
  const runCalls = [];
  const { base, repos } = await startApi(t, {
    services: { runSchedule: async (schedule) => { runCalls.push(schedule.id); return { sessionId: "sess-1", scheduleId: schedule.id }; } },
  });
  const p = repos.projects.create({ name: "P" });
  const s = repos.schedules.create({ projectId: p.id, name: "s", rule: "daily" });

  const res = await fetch(base + `/schedules/${s.id}/run`, { method: "POST" });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.sessionId, "sess-1");
  assert.deepEqual(runCalls, [s.id]);
});

test("manual schedule run reports a persisted failed execution as an API error", async (t) => {
  const { base, repos } = await startApi(t, {
    services: { runSchedule: async (schedule) => ({
      id: 9,
      scheduleId: schedule.id,
      sessionId: "session-scheduled-failed",
      status: "failed",
      error: "provider unavailable",
    }) },
  });
  const project = repos.projects.create({ name: "P" });
  const schedule = repos.schedules.create({ projectId: project.id, name: "s", rule: "daily" });

  const response = await fetch(base + `/schedules/${schedule.id}/run`, { method: "POST" });
  assert.equal(response.status, 502);
  assert.deepEqual((await response.json()).error, {
    code: "SCHEDULE_RUN_FAILED",
    message: "provider unavailable",
    details: { runId: 9, sessionId: "session-scheduled-failed" },
  });
});

test("schedule run returns 501 when no service is provided", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const s = repos.schedules.create({ projectId: p.id, name: "s", rule: "daily" });
  const res = await fetch(base + `/schedules/${s.id}/run`, { method: "POST" });
  assert.equal(res.status, 501);
  assert.equal((await res.json()).error.code, "NOT_IMPLEMENTED");
});

// ----------------------------------------------------- summaries / chats

test("summaries list and run", async (t) => {
  const { base, repos } = await startApi(t, {
    services: {
      runSummary: async ({ projectId, summaryDate }) =>
        repos.summaries.upsert({ projectId, summaryDate, content: "generated", status: "ready" }),
    },
  });
  const p = repos.projects.create({ name: "P" });

  let res = await fetch(base + "/summaries?projectId=" + p.id);
  assert.equal((await res.json()).length, 0);

  res = await fetch(base + "/summaries/run", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id, summaryDate: "2026-08-17" }),
  });
  assert.equal(res.status, 200);
  const summary = await res.json();
  assert.equal(summary.content, "generated");
  assert.equal(summary.status, "ready");

  res = await fetch(base + "/summaries?projectId=" + p.id);
  assert.equal((await res.json()).length, 1);

  res = await fetch(base + "/summaries/" + summary.id, { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { removed: true, id: summary.id });

  res = await fetch(base + "/summaries/" + summary.id, { method: "DELETE" });
  assert.equal(res.status, 404);
});

test("summary run returns 501 without a service", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/summaries/run", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id }),
  });
  assert.equal(res.status, 501);
  assert.equal((await res.json()).error.code, "NOT_IMPLEMENTED");
});

test("summary generation errors return a stable error envelope without leaking provider details", async (t) => {
  const logged = [];
  const { base, repos } = await startApi(t, {
    services: { runSummary: async () => { throw new Error("private provider failure detail"); } },
    logger: { error: (error) => logged.push(error) },
  });
  const p = repos.projects.create({ name: "P" });

  const res = await fetch(base + "/summaries/run", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id, summaryDate: "2026-08-17" }),
  });
  const body = await res.json();

  assert.equal(res.status, 502);
  assert.deepEqual(body, { error: { code: "SUMMARY_GENERATION_FAILED", message: "每日总结生成失败，请重试" } });
  assert.doesNotMatch(JSON.stringify(body), /private provider/);
  assert.equal(logged.length, 1);
  assert.match(logged[0].message, /private provider failure/);
});

// ------------------------------------------------------- errors / queue

test("errors use {error:{code,message}} and never leak a stack", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/projects", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.ok(body.error, "has error envelope");
  assert.equal(typeof body.error.code, "string");
  assert.equal(typeof body.error.message, "string");
  assert.equal(body.stack, undefined);
  assert.equal(body.error.stack, undefined);
});

test("malformed JSON body -> 422 INVALID_JSON", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/projects", {
    method: "POST",
    headers: JSON_HEADERS,
    body: "{not json",
  });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_JSON");
});

test("non-JSON content type on write endpoint -> 415", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/projects", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "{}",
  });
  assert.equal(res.status, 415);
  assert.equal((await res.json()).error.code, "UNSUPPORTED_MEDIA_TYPE");
});

test("JSON body over 1MB -> 413", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/projects", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ name: "a".repeat(1024 * 1024) }),
  });
  assert.equal(res.status, 413);
  assert.equal((await res.json()).error.code, "PAYLOAD_TOO_LARGE");
});

test("unknown route -> 404 and wrong method -> 405", async (t) => {
  const { base } = await startApi(t);
  let res = await fetch(base + "/nope");
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error.code, "NOT_FOUND");

  res = await fetch(base + "/projects", { method: "DELETE" });
  assert.equal(res.status, 405);
  assert.equal((await res.json()).error.code, "METHOD_NOT_ALLOWED");
});

test("queue processes serially and continues after a failure", async (t) => {
  const { base, repos, queue, fakeIndexer } = await startApi(t);
  const p = repos.projects.create({ name: "P" });

  fakeIndexer.state.delayMs = 15;
  fakeIndexer.state.failRemaining = 1; // first indexDocument call fails

  const a = await fetch(base + "/documents", uploadBody("a.md", "project", p.id, "first doc"));
  const b = await fetch(base + "/documents", uploadBody("b.md", "project", p.id, "second doc"));
  assert.equal(a.status, 202);
  assert.equal(b.status, 202);

  await queue.idle();

  assert.equal(fakeIndexer.state.maxActive, 1, "indexer calls never overlap (serial)");
  const docs = repos.documents.list();
  assert.equal(docs.length, 2);
  const byName = new Map(docs.map((d) => [d.originalName, d]));
  assert.equal(byName.get("a.md").status, "failed");
  assert.equal(byName.get("b.md").status, "ready");
  assert.deepEqual(fakeIndexer.state.calls.map((c) => c.documentId), [
    byName.get("a.md").id,
    byName.get("b.md").id,
  ], "failure of the first document does not block the second");
});

test("registers exactly one /api/cpwb prefix route", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const queue = createIndexQueue({ repos, indexer: makeFakeIndexer(repos) });
  const api = createApi({
    repos,
    queue,
    ollama: makeFakeOllama(),
    retriever: makeFakeRetriever(),
    dataDir,
    services: {},
  });
  t.after(async () => {
    await queue.close();
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const registered = [];
  const fakeWebServer = { register(route) { registered.push(route); return () => {}; } };
  const dispose = api.register(fakeWebServer);
  assert.equal(registered.length, 1);
  assert.equal(registered[0].kind, "prefix");
  assert.equal(registered[0].path, "/api/cpwb");
  assert.equal(typeof registered[0].handler, "function");
  assert.equal(typeof dispose, "function");
});

// ------------------------------------------- codex review: route + validation
test("wrong method on any known route returns 405, not 404", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const doc = repos.documents.upsertBySha256({ sha256: "a".repeat(64), originalName: "x.md", mimeType: "text/markdown", size: 1 });
  const cases = [
    ["/health", "POST"],
    [`/documents/${doc.id}/reindex`, "GET"],
    [`/documents/${doc.id}/links/project/${p.id}`, "POST"],
    ["/summaries/run", "GET"],
    ["/summaries", "POST"],
  ];
  for (const [path, method] of cases) {
    const res = await fetch(base + path, { method });
    assert.equal(res.status, 405, method + " " + path + " must be 405");
    assert.equal((await res.json()).error.code, "METHOD_NOT_ALLOWED");
  }
});

test("old tasks/plans routes are removed (404, not 200)", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/tasks/1", {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ done: true }),
  });
  assert.equal(res.status, 404);
  const plans = await fetch(base + "/plans?projectId=1");
  assert.equal(plans.status, 404);
});

test("queue coalesces a re-enqueue of an in-flight document (runs once)", async (t) => {
  const { base, repos, queue, fakeIndexer } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  fakeIndexer.state.delayMs = 40;
  const first = await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "bytes"));
  assert.equal(first.status, 202);
  const second = await fetch(base + "/documents", uploadBody("note.md", "project", p.id, "bytes"));
  assert.equal(second.status, 202);
  await queue.idle();
  assert.equal(fakeIndexer.state.calls.length, 1, "in-flight re-enqueue must coalesce to one run");
});

test("GET collection id query params must be positive integers (422)", async (t) => {
  const { base } = await startApi(t);
  for (const route of ["/todos?projectId=abc", "/schedules?projectId=abc", "/summaries?projectId=abc"]) {
    const res = await fetch(base + route);
    assert.equal(res.status, 422, route);
    assert.equal((await res.json()).error.code, "INVALID_ID", route);
  }
});

test("creating todo/schedule validates the parent exists (404, not 500)", async (t) => {
  const { base } = await startApi(t);
  const post = (path, body) => fetch(base + path, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(body) });
  let res = await post("/todos", { projectId: 999999, title: "x", dueAt: "2026-08-18T18:00:00Z" });
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error.code, "NOT_FOUND");
  res = await post("/schedules", { projectId: 999999, name: "x", rule: "daily" });
  assert.equal(res.status, 404);
});

test("content-type must equal application/json exactly (charset ok, evil rejected)", async (t) => {
  const { base } = await startApi(t);
  let res = await fetch(base + "/projects", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ name: "A" }),
  });
  assert.equal(res.status, 201);

  res = await fetch(base + "/projects", {
    method: "POST",
    headers: { "content-type": "application/json-evil" },
    body: "{}",
  });
  assert.equal(res.status, 415);
  assert.equal((await res.json()).error.code, "UNSUPPORTED_MEDIA_TYPE");
});

test("malformed percent-encoding in a path id returns 422, not 500", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/documents/%E0%A4%A/reindex", { method: "POST" });
  assert.equal(res.status, 422);
});

// ---------------------------------------------------- todos + date-time validation
test("todos GET computes overdue from dueAt", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  repos.todos.create({ projectId: p.id, title: "old", dueAt: "2026-08-16T18:00:00.000Z" });
  const res = await fetch(base + `/todos?projectId=${p.id}`);
  assert.equal(res.status, 200);
  const todos = await res.json();
  assert.equal(todos.length, 1);
  assert.equal(typeof todos[0].overdue, "boolean");
});

test("todo create rejects a non-date-time dueAt (422)", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/todos", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id, title: "x", dueAt: "08-18-2026" }),
  });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_DATETIME");
});

test("summary run rejects a non-YYYY-MM-DD summaryDate (422)", async (t) => {
  const { base, repos } = await startApi(t, { services: { runSummary: async () => ({}) } });
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/summaries/run", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id, summaryDate: "08/17/2026" }),
  });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_FIELD");
});

test("summary run without summaryDate passes null (no UTC derivation)", async (t) => {
  let captured;
  const { base, repos } = await startApi(t, {
    services: { runSummary: async (args) => { captured = args; return {}; } },
  });
  const p = repos.projects.create({ name: "P" });
  const res = await fetch(base + "/summaries/run", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ projectId: p.id }),
  });
  assert.equal(res.status, 200);
  assert.equal(captured.projectId, p.id);
  assert.equal(captured.summaryDate, null);
});

// --------------------------------------------- project knowledge-base links
test("project knowledge-base links are idempotent and list/unlink", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  const kb1 = repos.knowledgeBases.create({ name: "K1" });
  const kb2 = repos.knowledgeBases.create({ name: "K2" });

  let res = await fetch(base + `/projects/${p.id}/knowledge-bases/${kb1.id}`, { method: "POST" });
  assert.equal(res.status, 201);
  res = await fetch(base + `/projects/${p.id}/knowledge-bases/${kb1.id}`, { method: "POST" });
  assert.equal(res.status, 201, "linking twice is idempotent");
  await fetch(base + `/projects/${p.id}/knowledge-bases/${kb2.id}`, { method: "POST" });

  res = await fetch(base + `/projects/${p.id}/knowledge-bases`);
  assert.equal(res.status, 200);
  const kbs = await res.json();
  assert.deepEqual(kbs.map((k) => k.id).sort((a, b) => a - b), [kb1.id, kb2.id]);

  res = await fetch(base + `/knowledge-bases/${kb1.id}/projects`);
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).map((project) => project.id), [p.id]);

  res = await fetch(base + `/projects/${p.id}/knowledge-bases/${kb1.id}`, { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).removed, 1);
  res = await fetch(base + `/projects/${p.id}/knowledge-bases/${kb1.id}`, { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).removed, 0, "unlink is idempotent");
});

test("project knowledge-base routes validate both ends exist", async (t) => {
  const { base, repos } = await startApi(t);
  const p = repos.projects.create({ name: "P" });
  let res = await fetch(base + "/projects/999999/knowledge-bases");
  assert.equal(res.status, 404);
  res = await fetch(base + `/projects/${p.id}/knowledge-bases/999999`, { method: "POST" });
  assert.equal(res.status, 404);
  res = await fetch(base + "/projects/999999/knowledge-bases/1", { method: "POST" });
  assert.equal(res.status, 404);
  res = await fetch(base + `/projects/${p.id}/knowledge-bases/abc`, { method: "POST" });
  assert.equal(res.status, 422);
  res = await fetch(base + "/knowledge-bases/999999/projects");
  assert.equal(res.status, 404);
});

// ------------------------------------------------------ internal error logging
test("unknown internal errors are logged in full but never leak the stack", async (t) => {
  const logged = [];
  const logger = { error: (err) => logged.push(err) };
  const { base } = await startApi(t, {
    logger,
    ollama: { async health() { throw new Error("secret stack details"); } },
  });
  const res = await fetch(base + "/health");
  assert.equal(res.status, 500);
  const body = await res.json();
  assert.equal(body.error.code, "INTERNAL_ERROR");
  assert.equal(body.error.message, "internal server error");
  assert.equal(body.error.stack, undefined);
  assert.equal(body.stack, undefined);
  assert.equal(logged.length, 1);
  assert.ok(logged[0] instanceof Error);
  assert.match(logged[0].message, /secret stack details/);
  assert.ok(logged[0].stack, "logged error retains its stack");
});
// ------------------------------------------------------ unified chat sessions

test("POST /chat/sessions materializes one hidden session with a canonical scope", async (t) => {
  const fake = makeFakeSessionService();
  const { base } = await startApi(t, { sessions: fake });
  const res = await fetch(base + "/chat/sessions", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ scope: { kind: "knowledge_base", id: 3 }, title: "第一句话", pinnedSources: [] }),
  });
  assert.equal(res.status, 201);
  assert.equal((await res.json()).sessionId, "session-1");
  assert.deepEqual(fake.calls.materialize, [{ scope: { kind: "knowledge_base", id: 3 }, title: "第一句话", pinnedSources: [] }]);
});

test("POST /chat/sessions returns materialization failure without leaking an internal cause", async (t) => {
  const fake = makeFakeSessionService({
    materializeError: new WorkbenchSessionError(
      SESSION_ERROR_CODES.DRAFT_ACTIVATION_FAILED,
      "failed to activate session draft",
      new Error("secret vector endpoint"),
      { sessionId: "session-failed", lifecycleStatus: "draft_failed", pendingQuestion: "保留正文" },
    ),
  });
  const { base } = await startApi(t, { sessions: fake });
  const res = await fetch(base + "/chat/sessions", {
    method: "POST", headers: JSON_HEADERS,
    body: JSON.stringify({ scope: { kind: "project", id: 1 }, title: "保留正文" }),
  });
  assert.equal(res.status, 502);
  const body = await res.json();
  assert.deepEqual(body.error.details, {
    sessionId: "session-failed",
    lifecycleStatus: "draft_failed",
    pendingQuestion: "保留正文",
  });
  assert.equal(body.error.cause, undefined);
});

test("GET /chat/sessions filters one canonical scope and excludes failed drafts", async (t) => {
  const { base, repos } = await startApi(t, { sessions: makeFakeSessionService() });
  const project = repos.projects.create({ name: "P" });
  repos.workbenchSessions.create({ sessionId: "session-active", scope: { kind: "project", id: project.id }, provider: "deepseek-official", model: "deepseek-v4-flash" });
  repos.workbenchSessions.create({ sessionId: "session-failed", scope: { kind: "project", id: project.id }, provider: "deepseek-official", model: "deepseek-v4-flash", lifecycleStatus: "draft_failed" });
  const res = await fetch(base + `/chat/sessions?scopeKind=project&scopeId=${project.id}`);
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).items.map((row) => row.sessionId), ["session-active"]);
});

test("GET /chat/sessions applies keyword search inside one project scope", async (t) => {
  const { base, repos } = await startApi(t, { sessions: makeFakeSessionService() });
  const project = repos.projects.create({ name: "Research" });
  repos.workbenchSessions.create({ sessionId: "session-hit", scope: { kind: "project", id: project.id }, title: "定时任务回归" });
  repos.workbenchSessions.create({ sessionId: "session-miss", scope: { kind: "project", id: project.id }, title: "知识库检索" });
  const res = await fetch(base + `/chat/sessions?scopeKind=project&scopeId=${project.id}&query=${encodeURIComponent("定时")}`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body.items.map((row) => row.sessionId), ["session-hit"]);
  assert.equal(body.total, 1);
});

test("GET /chat/sessions lists active sessions across all containers", async (t) => {
  const { base, repos } = await startApi(t, { sessions: makeFakeSessionService() });
  repos.workbenchSessions.create({ sessionId: "session-independent", scope: { kind: "independent" }, provider: "deepseek-official", model: "deepseek-v4-flash" });
  const res = await fetch(base + "/chat/sessions?limit=8&offset=0");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    items: [repos.workbenchSessions.get("session-independent")], total: 1, limit: 8, offset: 0,
  });
});

test("GET /chat/sessions separates archived records from active recents", async (t) => {
  const { base, repos } = await startApi(t, { sessions: makeFakeSessionService() });
  repos.workbenchSessions.create({ sessionId: "session-active", scope: { kind: "independent" } });
  repos.workbenchSessions.create({ sessionId: "session-archived", scope: { kind: "independent" } });
  repos.workbenchSessions.archive("session-archived", new Date("2026-08-23T09:30:00.000Z"));

  let res = await fetch(base + "/chat/sessions");
  assert.deepEqual((await res.json()).items.map((row) => row.sessionId), ["session-active"]);
  res = await fetch(base + "/chat/sessions?archived=true");
  const archived = await res.json();
  assert.deepEqual(archived.items.map((row) => row.sessionId), ["session-archived"]);
  assert.equal(archived.items[0].archivedAt, "2026-08-23T09:30:00.000Z");
});

test("PATCH /chat/sessions/:id dispatches rename, move, archive, restore, and draft confirmation", async (t) => {
  const fake = makeFakeSessionService();
  const { base } = await startApi(t, { sessions: fake });
  const patch = (body) => fetch(base + "/chat/sessions/session-1", { method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify(body) });

  assert.equal((await patch({ operation: "rename", title: "新标题" })).status, 200);
  assert.equal((await patch({ operation: "move", scope: { kind: "independent" } })).status, 200);
  assert.equal((await patch({ operation: "archive" })).status, 200);
  assert.equal((await patch({ operation: "restore" })).status, 200);
  assert.equal((await patch({ operation: "confirmDraft" })).status, 200);
  assert.deepEqual(fake.calls.rename, [{ sessionId: "session-1", title: "新标题" }]);
  assert.deepEqual(fake.calls.move, [{ sessionId: "session-1", scope: { kind: "independent", id: null } }]);
  assert.deepEqual(fake.calls.archive, ["session-1"]);
  assert.deepEqual(fake.calls.restore, ["session-1"]);
  assert.deepEqual(fake.calls.confirm, [{ sessionId: "session-1" }]);
});

test("DELETE /chat/sessions/:id delegates native-first deletion", async (t) => {
  const fake = makeFakeSessionService();
  const { base } = await startApi(t, { sessions: fake });
  const res = await fetch(base + "/chat/sessions/session-1", { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { deleted: true });
  assert.deepEqual(fake.calls.delete, ["session-1"]);
});

test("POST /chat/sessions/:id/open resumes one durable native session", async (t) => {
  const fake = makeFakeSessionService();
  const { base } = await startApi(t, { sessions: fake });
  const res = await fetch(base + "/chat/sessions/session-1/open", { method: "POST", headers: JSON_HEADERS, body: "{}" });
  assert.equal(res.status, 200);
  assert.deepEqual(fake.calls.open, [{ sessionId: "session-1" }]);
});

test("session context API reads, updates, and removes source overrides", async (t) => {
  const fake = makeFakeSessionService();
  const { base } = await startApi(t, { sessions: fake });
  const path = base + "/chat/sessions/session-1/context";

  let res = await fetch(path);
  assert.equal(res.status, 200);
  assert.equal((await res.json())[0].state, "inherited");
  res = await fetch(path, {
    method: "PUT", headers: JSON_HEADERS,
    body: JSON.stringify({ source: { kind: "knowledge_base", id: "2" }, mode: "pinned" }),
  });
  assert.equal(res.status, 200);
  res = await fetch(path + "?sourceKind=knowledge_base&sourceId=2", { method: "DELETE" });
  assert.equal(res.status, 200);
  assert.deepEqual(fake.calls.contextGet, ["session-1"]);
  assert.deepEqual(fake.calls.contextSet, [{ sessionId: "session-1", source: { kind: "knowledge_base", id: "2" }, mode: "pinned" }]);
  assert.deepEqual(fake.calls.contextRemove, [{ sessionId: "session-1", source: { kind: "knowledge_base", id: "2" } }]);
});

test("unified session API rejects fields outside the canonical contract", async (t) => {
  const { base } = await startApi(t, { sessions: makeFakeSessionService() });
  const res = await fetch(base + "/chat/sessions", {
    method: "POST", headers: JSON_HEADERS,
    body: JSON.stringify({ owner: 1, question: "unknown field" }),
  });
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error.code, "INVALID_FIELD");
});

test("session activation returns 501 when the unified session service is unavailable", async (t) => {
  const { base } = await startApi(t);
  const res = await fetch(base + "/chat/sessions", {
    method: "POST", headers: JSON_HEADERS,
    body: JSON.stringify({ scope: { kind: "independent" }, title: "hello" }),
  });
  assert.equal(res.status, 501);
  assert.equal((await res.json()).error.code, "NOT_IMPLEMENTED");
});

// ------------------------------------------------------ logger noise (Task 8A-R)

test("expected 501s (run/chat without services) never pollute the logger", async (t) => {
  const logged = [];
  const logger = { error: (err) => logged.push(err) };
  const { base, repos } = await startApi(t, { logger });
  const p = repos.projects.create({ name: "P" });

  let res = await fetch(base + "/summaries/run", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ projectId: p.id }),
  });
  assert.equal(res.status, 501);

  res = await fetch(base + "/chat/sessions", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ knowledgeBaseId: 1 }),
  });
  assert.equal(res.status, 501);

  assert.equal(logged.length, 0, "expected 501s are not internal errors and stay quiet");
});

test("502 retrieval failure is logged server-side and its cause never leaks", async (t) => {
  const logged = [];
  const logger = { error: (err) => logged.push(err) };
  const sessions = makeFakeSessionService({
    materializeError: new WorkbenchSessionError(SESSION_ERROR_CODES.DRAFT_ACTIVATION_FAILED, "failed to activate session draft", new Error("vector store secret"), {
      sessionId: "session-failed", lifecycleStatus: "draft_failed", pendingQuestion: "q",
    }),
  });
  const { base } = await startApi(t, { sessions, logger });

  const res = await fetch(base + "/chat/sessions", {
    method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ scope: { kind: "independent" }, title: "q" }),
  });
  assert.equal(res.status, 502);
  const body = await res.json();
  assert.equal(body.error.code, "EDRAFT_ACTIVATION_FAILED");
  assert.equal(body.error.message, "failed to activate session draft");
  assert.equal(body.error.stack, undefined);
  assert.equal(body.error.cause, undefined);

  assert.equal(logged.length, 1, "server logs the 502 retrieval failure");
  assert.ok(logged[0] instanceof WorkbenchSessionError);
  assert.ok(logged[0].cause instanceof Error);
  assert.match(logged[0].cause.message, /vector store secret/);
});
