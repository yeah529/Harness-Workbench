/**
 * Task 8B client tests: chat API wrapper, workbench session registry + selector,
 * session-wait orchestration, unified draft lifecycle, and rail-width helpers.
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

test("api: chat.sessions.create posts one canonical owner and first prompt", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/chat/sessions");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), {
      scope: { kind: "project", id: 1 },
      question: "开始实现",
      pinnedSources: [],
      oneShotSources: [],
    });
    return jsonResponse(201, { sessionId: "s1", scope: { kind: "project", id: 1 } });
  });
  const api = createCpwbApi({ fetchImpl });
  const out = await api.chat.sessions.create({ scope: { kind: "project", id: 1 }, question: "开始实现" });
  assert.equal(out.sessionId, "s1");
});

test("api: chat.sessions.open resumes one durable session", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/chat/sessions/s2/open");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), {});
    return jsonResponse(200, { sessionId: "s2", scope: { kind: "knowledge_base", id: 2 } });
  });
  const api = createCpwbApi({ fetchImpl });
  const out = await api.chat.sessions.open("s2");
  assert.equal(out.scope.id, 2);
});

test("api: chat.sessions mutation and context routes use the session id", async () => {
  let call = 0;
  const fetchImpl = makeFetch(({ url, init }) => {
    call += 1;
    const parsed = parse(url);
    if (call === 1) assert.deepEqual(JSON.parse(init.body), { operation: "retryDraft", question: "重试", oneShotSources: [] });
    if (call === 2) assert.deepEqual(JSON.parse(init.body), { operation: "rename", title: "新标题" });
    if (call === 3) assert.deepEqual(JSON.parse(init.body), { operation: "move", scope: { kind: "independent", id: null } });
    if (call <= 3) assert.equal(parsed.pathname, "/api/cpwb/chat/sessions/s-old");
    if (call === 4) {
      assert.equal(parsed.pathname, "/api/cpwb/chat/sessions/s-old/context");
      assert.deepEqual(JSON.parse(init.body), { source: { kind: "knowledge_base", id: "2" }, mode: "pinned" });
    }
    if (call === 5) {
      assert.equal(parsed.pathname, "/api/cpwb/chat/sessions/s-old/context");
      assert.equal(parsed.searchParams.get("sourceKind"), "knowledge_base");
      assert.equal(parsed.searchParams.get("sourceId"), "2");
    }
    if (call === 6) assert.equal(parsed.pathname, "/api/cpwb/chat/sessions/s-old");
    return jsonResponse(200, { sessionId: "s-old", scope: { kind: "independent", id: null } });
  });
  const api = createCpwbApi({ fetchImpl });
  await api.chat.sessions.retry({ sessionId: "s-old", question: "重试" });
  await api.chat.sessions.rename({ sessionId: "s-old", title: "新标题" });
  await api.chat.sessions.move({ sessionId: "s-old", scope: { kind: "independent", id: null } });
  await api.chat.sessions.context.set({ sessionId: "s-old", source: { kind: "knowledge_base", id: "2" }, mode: "pinned" });
  await api.chat.sessions.context.remove({ sessionId: "s-old", source: { kind: "knowledge_base", id: "2" } });
  await api.chat.sessions.remove("s-old");
});

test("api: chat.sessions.list supports scoped and global paged queries", async () => {
  const calls = [];
  const fetchImpl = makeFetch(({ url, init }) => {
    calls.push(url);
    assert.equal(parse(url).pathname, "/api/cpwb/chat/sessions");
    assert.equal(init.method ?? "GET", "GET");
    return jsonResponse(200, { items: [{ sessionId: "session-cpwb-1", scopeKind: "project", scopeId: 9 }], total: 1, limit: 8, offset: 0 });
  });
  const api = createCpwbApi({ fetchImpl });
  const page = await api.chat.sessions.list({ scopeKind: "project", scopeId: 9, limit: 8, offset: 0, query: "研究" });
  assert.equal(page.items[0].sessionId, "session-cpwb-1");
  const global = parse(calls[0]).searchParams;
  assert.equal(global.get("limit"), "8");
  assert.equal(global.get("offset"), "0");
  assert.equal(global.get("query"), "研究");
  assert.equal(global.get("scopeKind"), "project");
  assert.equal(global.get("scopeId"), "9");
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
  registerWorkbenchSession({ sessionId: "s9", scope: { kind: "knowledge_base", id: 3 } });
  assert.deepEqual(getWorkbenchSession("s9"), { scope: { kind: "knowledge_base", id: 3 } });
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
      return jsonResponse(201, overrides.createResult ?? {
        sessionId: "s1",
        scope: { kind: "project", id: 1 },
        lifecycleStatus: "active",
        citations: [],
      });
    }
    if (pathname.endsWith("/open") && method === "POST") {
      return jsonResponse(200, overrides.openResult ?? { sessionId: "s1", scope: { kind: "project", id: 1 } });
    }
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "nf" } });
  });
}

test("store: activation registers the canonical session and reloads recents", async () => {
  clearWorkbenchSessions();
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl: chatScenarioFetch() }));
  store.actions.startDraft({ scope: { kind: "project", id: 1 } });
  const out = await store.actions.activateDraft({ text: "开始" });
  assert.equal(out.sessionId, "s1");
  assert.deepEqual(store.getSnapshot().workbenchSessions.s1.scope, { kind: "project", id: 1 });
  assert.deepEqual(store.getSnapshot().citationsBySession.s1, []);
});

test("store: loads recent and scoped session pages", async () => {
  const sessionPage = {
    items: [
      { sessionId: "session-cpwb-i", scopeKind: "independent", scopeId: null, contextName: "独立" },
      { sessionId: "session-cpwb-p", scopeKind: "project", scopeId: 2, contextName: "P" },
    ],
    total: 2,
    limit: 8,
    offset: 0,
  };
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl: chatScenarioFetch({ sessionPage }) }));
  await store.actions.loadRecentSessions({ limit: 8 });
  assert.deepEqual(store.getSnapshot().recentSessions.map((item) => item.sessionId), ["session-cpwb-i", "session-cpwb-p"]);
  await store.actions.loadAllSessions({ query: "P", scopeKind: "project", scopeId: 2, offset: 0 });
  assert.equal(store.getSnapshot().sessionPage.total, 2);
});

test("store: openSession restores its canonical scope", async () => {
  clearWorkbenchSessions();
  const api = createCpwbApi({ fetchImpl: chatScenarioFetch({
    openResult: { sessionId: "s2", scope: { kind: "knowledge_base", id: 2 } },
  }) });
  const store = createWorkbenchStore(api);
  const out = await store.actions.openSession("s2");
  assert.deepEqual(out.scope, { kind: "knowledge_base", id: 2 });
  assert.ok(store.getSnapshot().workbenchSessions.s2);
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
