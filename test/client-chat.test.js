/**
 * Task 8B client tests: chat API wrapper, workbench session registry + selector,
 * session-wait orchestration, project/KB entry via store actions, citation
 * persistence, composer draft policy, and rail-width helpers.
 *
 * Pure Node tests (no React): they drive createCpwbApi / createWorkbenchStore
 * and the pure helper modules against a mock fetch.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { createCpwbApi } from "../src/client/api.js";
import { createNavigationStore } from "../src/client/navigation.js";
import { createWorkbenchStore } from "../src/client/store.js";
import {
  registerWorkbenchSession,
  clearWorkbenchSessions,
  getWorkbenchSession,
  isWorkbenchSessionId,
  waitForSessionInList,
  waitForSessionReady,
  openWorkbenchSession,
} from "../src/client/workbenchSessions.js";
import {
  buildSubmitPayload,
  composerDraftPolicy,
  cancelResultToOutcome,
  runCancel,
  ATTACHMENT_UNSUPPORTED_TEXT,
  EMPTY_RETRIEVAL_TEXT,
} from "../src/client/composer.js";
import {
  clampRailWidth,
  adjustRailWidth,
  RAIL_WIDTH_DEFAULT,
  RAIL_WIDTH_MIN,
  RAIL_WIDTH_MAX,
  shouldShowProjectRail,
  isDrawerMode,
  dockedRailLeft,
  conversationCompression,
} from "../src/client/rail.js";

function jsonResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body, text: async () => JSON.stringify(body) };
}
function makeFetch(handler) {
  const calls = [];
  const fetchImpl = (url, init) => {
    const entry = { url: String(url), init: init || {} };
    calls.push(entry);
    return handler(entry, calls.length - 1);
  };
  fetchImpl.calls = calls;
  return fetchImpl;
}
function parse(url) {
  const u = new URL(url, "http://dsh.local");
  return { pathname: u.pathname, searchParams: u.searchParams };
}

/** Minimal observable sessions double for wait/open helpers. */
function makeSessions(initialById = {}) {
  let state = { ids: Object.keys(initialById), byId: { ...initialById }, current: undefined, phase: "ready" };
  const listeners = new Set();
  const sessions = {
    list: {
      getSnapshot: () => state,
      subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    },
    open: (id) => { state = { ...state, current: id }; },
  };
  sessions._upsert = (id, summary) => {
    state = { ...state, byId: { ...state.byId, [id]: summary }, ids: state.ids.includes(id) ? state.ids : [...state.ids, id] };
    for (const l of listeners) l();
  };
  return sessions;
}

// -------------------------------------------------------------------- api

test("api: chat.sessions.create posts projectId to /chat/sessions", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/chat/sessions");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), { projectId: 1 });
    return jsonResponse(201, { sessionId: "s1", scope: { kind: "project", scopeId: 1 }, reused: false });
  });
  const api = createCpwbApi({ fetchImpl });
  const out = await api.chat.sessions.create({ projectId: 1 });
  assert.equal(out.sessionId, "s1");
});

test("api: chat.sessions.create posts knowledgeBaseId + chatId for reopen", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/chat/sessions");
    assert.deepEqual(JSON.parse(init.body), { knowledgeBaseId: 2, chatId: 7 });
    return jsonResponse(201, { sessionId: "s2", scope: { kind: "knowledge_base", scopeId: 2 }, chatId: 7, reused: true });
  });
  const api = createCpwbApi({ fetchImpl });
  const out = await api.chat.sessions.create({ knowledgeBaseId: 2, chatId: 7 });
  assert.equal(out.reused, true);
});

test("api: chat.sessions.create can resume a project workbench session", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/chat/sessions");
    assert.deepEqual(JSON.parse(init.body), { projectId: 9, resumeSessionId: "session-cpwb-old" });
    return jsonResponse(201, { sessionId: "session-cpwb-old", scope: { kind: "project", scopeId: 9 }, reused: true });
  });
  const api = createCpwbApi({ fetchImpl });
  const out = await api.chat.sessions.create({ projectId: 9, resumeSessionId: "session-cpwb-old" });
  assert.equal(out.reused, true);
});

test("api: chat.sessions.list supports scoped and global paged queries", async () => {
  const calls = [];
  const fetchImpl = makeFetch(({ url, init }) => {
    calls.push(url);
    assert.equal(parse(url).pathname, "/api/cpwb/chat/sessions");
    assert.equal(init.method ?? "GET", "GET");
    if (parse(url).searchParams.has("projectId")) {
      return jsonResponse(200, [{ sessionId: "session-cpwb-1", scope: { kind: "project", scopeId: 9 } }]);
    }
    return jsonResponse(200, { items: [], total: 0, limit: 8, offset: 0 });
  });
  const api = createCpwbApi({ fetchImpl });
  const rows = await api.chat.sessions.list({ projectId: 9 });
  assert.equal(rows[0].sessionId, "session-cpwb-1");
  const page = await api.chat.sessions.list({ limit: 8, offset: 0, query: "独立", context: "independent" });
  assert.equal(page.total, 0);
  const global = parse(calls[1]).searchParams;
  assert.equal(global.get("limit"), "8");
  assert.equal(global.get("offset"), "0");
  assert.equal(global.get("query"), "独立");
  assert.equal(global.get("context"), "independent");
});

test("navigation store keeps Workbench pages mutually exclusive", () => {
  const navigation = createNavigationStore({ initialPage: "home" });
  const snapshots = [];
  const dispose = navigation.subscribe(() => snapshots.push(navigation.getSnapshot()));
  navigation.openKnowledge();
  assert.deepEqual(navigation.getSnapshot(), { page: "knowledge", sessionId: null });
  navigation.openSessions();
  assert.deepEqual(navigation.getSnapshot(), { page: "sessions", sessionId: null });
  navigation.openConversation("session-cpwb-1");
  assert.deepEqual(navigation.getSnapshot(), { page: "conversation", sessionId: "session-cpwb-1" });
  navigation.openHome();
  assert.deepEqual(navigation.getSnapshot(), { page: "home", sessionId: null });
  assert.equal(snapshots.length, 4);
  dispose();
});

test("api: chat.prompts.submit posts sessionId/question/scope", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/chat/prompts");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), { sessionId: "s1", question: "hello?", knowledgeBaseId: 2 });
    return jsonResponse(200, { sessionId: "s1", citations: [], outcome: { text: "hi" } });
  });
  const api = createCpwbApi({ fetchImpl });
  await api.chat.prompts.submit({ sessionId: "s1", question: "hello?", knowledgeBaseId: 2 });
});

test("selector: isWorkbenchSessionId matches the stable session-cpwb- prefix", () => {
  assert.equal(isWorkbenchSessionId("session-cpwb-1"), true);
  assert.equal(isWorkbenchSessionId("session-cpwb-"), true);
  assert.equal(isWorkbenchSessionId("session-1"), false);
  assert.equal(isWorkbenchSessionId("sess-cpwb-1"), false);
  assert.equal(isWorkbenchSessionId(null), false);
  assert.equal(isWorkbenchSessionId(undefined), false);
  assert.equal(isWorkbenchSessionId(123), false);
});

test("registry: getWorkbenchSession returns null for unknown and entry for known", () => {
  clearWorkbenchSessions();
  assert.equal(getWorkbenchSession("nope"), null);
  registerWorkbenchSession({ sessionId: "s9", scope: { kind: "knowledge_base", scopeId: 3 }, chatId: 5 });
  assert.deepEqual(getWorkbenchSession("s9"), { scope: { kind: "knowledge_base", scopeId: 3 }, chatId: 5 });
});

// ------------------------------------------------------------ wait / open

test("waitForSessionInList resolves once the session appears", async () => {
  const sessions = makeSessions();
  const p = waitForSessionInList(sessions, "s1", { timeoutMs: 1000, pollMs: 5 });
  sessions._upsert("s1", { sessionId: "s1" });
  assert.equal(await p, "s1");
});

test("waitForSessionInList observes the rc.2 public ids/byId snapshot", async () => {
  let state = { ids: [], byId: {}, current: undefined, phase: "ready" };
  const listeners = new Set();
  const sessions = {
    list: {
      getSnapshot: () => state,
      subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    },
  };
  const pending = waitForSessionInList(sessions, "session-cpwb-public", { timeoutMs: 100, pollMs: 5 });
  state = {
    ids: ["session-cpwb-public"],
    byId: { "session-cpwb-public": { sessionId: "session-cpwb-public", cwd: "/tmp/project", blank: true } },
    current: undefined,
    phase: "ready",
  };
  for (const listener of listeners) listener();
  assert.equal(await pending, "session-cpwb-public");
});

test("waitForSessionInList rejects on timeout", async () => {
  const sessions = makeSessions();
  await assert.rejects(
    () => waitForSessionInList(sessions, "missing", { timeoutMs: 20, pollMs: 5 }),
    /did not appear/,
  );
});

test("open waits for rc.2 binding and workspace projection, not only list arrival", async () => {
  let sessionState = { ids: [], byId: {}, current: undefined, phase: "ready" };
  let workspaceState = { items: [], state: "idle", phase: "ready" };
  const sessionListeners = new Set();
  const workspaceListeners = new Set();
  const sessions = {
    list: {
      getSnapshot: () => sessionState,
      subscribe: (listener) => { sessionListeners.add(listener); return () => sessionListeners.delete(listener); },
    },
    binding: (id) => sessionState.bindingId === id ? { sessionId: id } : undefined,
    open: (id) => { sessionState = { ...sessionState, current: id }; },
  };
  const workspaces = {
    list: {
      getSnapshot: () => workspaceState,
      subscribe: (listener) => { workspaceListeners.add(listener); return () => workspaceListeners.delete(listener); },
    },
  };
  const pending = waitForSessionReady(sessions, "session-cpwb-ready", { workspaces, timeoutMs: 100 });
  sessionState = {
    ...sessionState,
    ids: ["session-cpwb-ready"],
    byId: { "session-cpwb-ready": { sessionId: "session-cpwb-ready", cwd: "/tmp/project", blank: true } },
  };
  for (const listener of sessionListeners) listener();
  await new Promise((resolve) => setImmediate(resolve));
  let settled = false;
  pending.then(() => { settled = true; });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(settled, false, "list arrival alone must not open the session");
  sessionState = { ...sessionState, bindingId: "session-cpwb-ready" };
  for (const listener of sessionListeners) listener();
  workspaceState = { ...workspaceState, items: [{ workspaceId: "ws-1", path: "/tmp/project", sessionIds: ["session-cpwb-ready"] }] };
  for (const listener of workspaceListeners) listener();
  assert.equal(await pending, "session-cpwb-ready");
  assert.equal(sessionState.current, undefined, "readiness helper does not select; caller owns open");
});

test("openWorkbenchSession waits then opens", async () => {
  const sessions = makeSessions();
  let opened = null;
  sessions.open = (id) => { opened = id; };
  const p = openWorkbenchSession(sessions, "s2", { timeoutMs: 1000, pollMs: 5 });
  sessions._upsert("s2", { sessionId: "s2" });
  await p;
  assert.equal(opened, "s2");
});

// ------------------------------------------------------------- store actions

function chatScenarioFetch(overrides = {}) {
  return makeFetch(({ url, init }) => {
    const { pathname, searchParams } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/chat/sessions" && method === "GET") {
      return jsonResponse(200, overrides.sessionPage ?? {
        items: [], total: 0,
        limit: Number(searchParams.get("limit") || 8),
        offset: Number(searchParams.get("offset") || 0),
      });
    }
    if (pathname === "/api/cpwb/chat/sessions" && method === "POST") {
      return jsonResponse(201, overrides.createResult ?? { sessionId: "s1", scope: { kind: "project", scopeId: 1 }, reused: false });
    }
    if (pathname === "/api/cpwb/chat/prompts" && method === "POST") {
      if (overrides.submitError) return jsonResponse(502, { error: { code: "RETRIEVAL_FAILED", message: "retrieval down" } });
      return jsonResponse(200, overrides.submitResult ?? { sessionId: "s1", citations: [], outcome: { text: "ok" } });
    }
    if (pathname === "/api/cpwb/knowledge-chats" && method === "GET") return jsonResponse(200, overrides.knowledgeChats ?? []);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "nf" } });
  });
}

test("store: openProjectChat registers the workbench session", async () => {
  clearWorkbenchSessions();
  const api = createCpwbApi({ fetchImpl: chatScenarioFetch() });
  const store = createWorkbenchStore(api);
  const out = await store.actions.openProjectChat({ projectId: 1 });
  assert.equal(out.sessionId, "s1");
  const snap = store.getSnapshot();
  assert.ok(snap.workbenchSessions["s1"], "session registry mirrors into the store");
  assert.deepEqual(snap.workbenchSessions["s1"].scope, { kind: "project", scopeId: 1 });
  assert.deepEqual(snap.citationsBySession["s1"], []);
});

test("store: a newly opened session appears in recent navigation", async () => {
  clearWorkbenchSessions();
  let created = false;
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname, searchParams } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/chat/sessions" && method === "POST") {
      created = true;
      return jsonResponse(201, {
        sessionId: "session-cpwb-new-project",
        scope: { kind: "project", scopeId: 1 },
        reused: false,
      });
    }
    if (pathname === "/api/cpwb/chat/sessions" && method === "GET") {
      return jsonResponse(200, {
        items: created ? [{
          sessionId: "session-cpwb-new-project",
          scopeKind: "project",
          scopeId: 1,
          contextName: "DSH-Research",
          chatId: null,
        }] : [],
        total: created ? 1 : 0,
        limit: Number(searchParams.get("limit") || 8),
        offset: Number(searchParams.get("offset") || 0),
      });
    }
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "nf" } });
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));

  await store.actions.openProjectChat({ projectId: 1 });

  assert.deepEqual(
    store.getSnapshot().recentSessions.map((item) => item.sessionId),
    ["session-cpwb-new-project"],
  );
});

test("store: loads refresh-safe recent/all sessions and creates an independent session", async () => {
  clearWorkbenchSessions();
  const sessionPage = {
    items: [
      { sessionId: "session-cpwb-i", scopeKind: "independent", scopeId: null, contextName: "独立", chatId: null },
      { sessionId: "session-cpwb-p", scopeKind: "project", scopeId: 2, contextName: "P", chatId: null },
    ],
    total: 2,
    limit: 8,
    offset: 0,
  };
  const api = createCpwbApi({ fetchImpl: chatScenarioFetch({
    sessionPage,
    createResult: { sessionId: "session-cpwb-new", scope: { kind: "independent", scopeId: null }, reused: false },
  }) });
  const store = createWorkbenchStore(api);
  await store.actions.loadRecentSessions({ limit: 8 });
  assert.deepEqual(store.getSnapshot().recentSessions.map((item) => item.sessionId), ["session-cpwb-i", "session-cpwb-p"]);
  await store.actions.loadAllSessions({ query: "P", context: "project", offset: 0 });
  assert.equal(store.getSnapshot().sessionPage.total, 2);
  const created = await store.actions.openIndependentSession();
  assert.equal(created.scope.kind, "independent");
  assert.deepEqual(store.getSnapshot().workbenchSessions[created.sessionId].scope, { kind: "independent", scopeId: null });
});

test("store: openKnowledgeChat reopens with chatId and reloads chat list", async () => {
  clearWorkbenchSessions();
  const api = createCpwbApi({ fetchImpl: chatScenarioFetch({ createResult: { sessionId: "s2", scope: { kind: "knowledge_base", scopeId: 2 }, chatId: 7, reused: true } }) });
  const store = createWorkbenchStore(api);
  const out = await store.actions.openKnowledgeChat({ knowledgeBaseId: 2, chatId: 7 });
  assert.equal(out.reused, true);
  assert.equal(out.chatId, 7);
  assert.ok(store.getSnapshot().workbenchSessions["s2"]);
});

test("store: submitPrompt stores citations by session and rejects without overwriting on failure", async () => {
  clearWorkbenchSessions();
  const citations = [{ sourceId: "1", originalName: "n.md", locator: "lines:1-1", text: "hit" }];
  const api = createCpwbApi({ fetchImpl: chatScenarioFetch({ submitResult: { sessionId: "s1", citations, outcome: { text: "ok" } } }) });
  const store = createWorkbenchStore(api);
  await store.actions.openProjectChat({ projectId: 1 });
  await store.actions.submitPrompt({ sessionId: "s1", question: "q", projectId: 1 });
  assert.deepEqual(store.getSnapshot().citationsBySession["s1"], citations);

  const failingApi = createCpwbApi({ fetchImpl: chatScenarioFetch({ submitError: true }) });
  const failingStore = createWorkbenchStore(failingApi);
  await failingStore.actions.openProjectChat({ projectId: 1 });
  await assert.rejects(
    () => failingStore.actions.submitPrompt({ sessionId: "s1", question: "q", projectId: 1 }),
    (err) => err.code === "RETRIEVAL_FAILED",
  );
  assert.deepEqual(failingStore.getSnapshot().citationsBySession["s1"], [], "failed submit leaves no citations");
});

// ------------------------------------------------------------ composer pure

test("composer: buildSubmitPayload maps scope to projectId/knowledgeBaseId", () => {
  assert.deepEqual(
    buildSubmitPayload({ sessionId: "s", question: "q", scope: { kind: "project", scopeId: 1 } }),
    { sessionId: "s", question: "q", projectId: 1, knowledgeBaseId: undefined },
  );
  assert.deepEqual(
    buildSubmitPayload({ sessionId: "s", question: "q", scope: { kind: "knowledge_base", scopeId: 2 } }),
    { sessionId: "s", question: "q", projectId: undefined, knowledgeBaseId: 2 },
  );
});

test("composer: draft policy clears only on success (retains on error)", () => {
  assert.deepEqual(composerDraftPolicy(null), { clear: true });
  assert.deepEqual(composerDraftPolicy(new Error("boom")), { clear: false });
  assert.equal(ATTACHMENT_UNSUPPORTED_TEXT, "知识库问答当前仅支持文本");
});

test("composer: empty-retrieval copy is the designed sentence", () => {
  assert.equal(EMPTY_RETRIEVAL_TEXT, "未找到足够相关的知识库内容");
});

test("composer: cancelResultToOutcome treats only ok===true as success", () => {
  assert.deepEqual(cancelResultToOutcome({ ok: true }), { ok: true, error: null });
  assert.deepEqual(cancelResultToOutcome({ ok: true, error: "ignored" }), { ok: true, error: null });
  assert.equal(cancelResultToOutcome(null).ok, false);
  assert.equal(cancelResultToOutcome(undefined).ok, false);
  assert.equal(cancelResultToOutcome({}).ok, false);
  assert.equal(cancelResultToOutcome({ ok: false }).ok, false);
});

test("composer: cancelResultToOutcome surfaces the server error for ok!==true", () => {
  assert.deepEqual(cancelResultToOutcome({ ok: false, error: "server refused" }), { ok: false, error: "server refused" });
  assert.deepEqual(cancelResultToOutcome({ ok: false, error: { message: "bad stop" } }), { ok: false, error: "bad stop" });
  assert.deepEqual(cancelResultToOutcome({ ok: false, error: null }), { ok: false, error: "停止失败" });
  assert.deepEqual(cancelResultToOutcome({ ok: false }), { ok: false, error: "停止失败" });
});

test("composer: runCancel covers success / failure / reject into one outcome", async () => {
  // success: resolved RpcResult { ok:true }
  assert.deepEqual(await runCancel(async () => ({ ok: true })), { ok: true, error: null });
  // failure: resolved RpcResult { ok:false, error } (does NOT reject)
  assert.deepEqual(await runCancel(async () => ({ ok: false, error: "server refused" })), { ok: false, error: "server refused" });
  // reject: the session binding throws / rejects
  assert.deepEqual(await runCancel(async () => { throw new Error("session gone"); }), { ok: false, error: "session gone" });
  // reject with no message falls back to the stable copy
  assert.deepEqual(await runCancel(async () => { throw null; }), { ok: false, error: "停止失败" });
});

// ---------------------------------------------------------------- rail

test("rail: clamp and adjust keep width within bounds", () => {
  assert.equal(RAIL_WIDTH_DEFAULT, 320);
  assert.equal(RAIL_WIDTH_MIN, 280);
  assert.equal(RAIL_WIDTH_MAX, 420);
  assert.equal(clampRailWidth(100), 280);
  assert.equal(clampRailWidth(999), 420);
  assert.equal(adjustRailWidth(320, 40), 360);
  assert.equal(adjustRailWidth(300, -100), 280);
});

test("rail: shouldShowProjectRail is restricted to project workbench sessions", () => {
  assert.equal(shouldShowProjectRail({ sessionId: "session-cpwb-1", scope: { kind: "project", scopeId: 1 } }), true);
  assert.equal(shouldShowProjectRail({ sessionId: "session-cpwb-1", scope: { kind: "knowledge_base", scopeId: 2 } }), false);
  assert.equal(shouldShowProjectRail({ sessionId: "session-cpwb-1", scope: { kind: "independent", scopeId: null } }), false);
  // Plain DSH session never shows the rail.
  assert.equal(shouldShowProjectRail({ sessionId: "session-1", scope: { kind: "project", scopeId: 1 } }), false);
  assert.equal(shouldShowProjectRail({ sessionId: undefined, scope: { kind: "project", scopeId: 1 } }), false);
  assert.equal(shouldShowProjectRail({ sessionId: "session-cpwb-1", scope: null }), false);
});

test("rail: isDrawerMode switches below the desktop breakpoint", () => {
  assert.equal(isDrawerMode(1279), true);
  assert.equal(isDrawerMode(1280), false);
  assert.equal(isDrawerMode(1200), true);
});

test("rail: dockedRailLeft and conversationCompression reserve the right side", () => {
  assert.deepEqual(dockedRailLeft({ conversationLeft: 240, conversationWidth: 900, railWidth: 320 }), { left: 820, width: 320 });
  assert.deepEqual(dockedRailLeft({ conversationLeft: 0, conversationWidth: 900, railWidth: 999 }), { left: 480, width: 420 });
  assert.deepEqual(conversationCompression(320), {
    paddingRight: "320px",
    cssVariable: { name: "--cpwb-rail-width", value: "320px" },
  });
  assert.equal(conversationCompression(100).paddingRight, "280px", "clamps to minimum width");
});
