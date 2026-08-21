/**
 * Client registry of workbench-owned DSH sessions + session-list wait/open
 * orchestration.
 *
 * This is the ONLY place the plugin remembers which sessions it created or
 * reopened through POST /api/cpwb/chat/sessions — but that registry is for
 * *scope lookup* only (projectId / knowledgeBaseId / chatId). Message state
 * and input state remain exclusively in RC.8 session services.
 */

export const WORKBENCH_SESSION_PREFIX = "session-cpwb-";

const registry = new Map(); // sessionId -> { scope: { kind, scopeId }, chatId: number | null }

/** Pure membership test: is this session id a workbench-owned DSH session? */
export function isWorkbenchSessionId(sessionId) {
  return typeof sessionId === "string" && sessionId.startsWith(WORKBENCH_SESSION_PREFIX);
}

/** Register (or replace) the workbench entry for one session. */
export function registerWorkbenchSession({ sessionId, scope, chatId }) {
  const entry = { scope, chatId: chatId ?? null };
  registry.set(sessionId, entry);
  return entry;
}

/** Drop one session from the registry. */
export function unregisterWorkbenchSession(sessionId) {
  registry.delete(sessionId);
}

/** Drop every session (used by tests and lifecycle teardown). */
export function clearWorkbenchSessions() {
  registry.clear();
}

/** Look up one session's workbench entry, or null when it is not owned. */
export function getWorkbenchSession(sessionId) {
  return registry.get(sessionId) ?? null;
}

/** Membership test (registry-backed; used by tests only). */
export function isWorkbenchSession(sessionId) {
  return registry.has(sessionId);
}

/** Plain-object snapshot of the registry (for the store's React state mirror). */
export function workbenchSessionSnapshot() {
  const out = {};
  for (const [id, entry] of registry) out[id] = entry;
  return out;
}

function readSnapshot(store) {
  if (!store || typeof store.getSnapshot !== "function") return null;
  try { return store.getSnapshot(); } catch { return null; }
}

function hasSession(sessions, sessionId) {
  const snapshot = readSnapshot(sessions?.list);
  return Boolean(snapshot?.byId && snapshot.byId[sessionId]);
}

function workspaceItems(workspaces) {
  const snapshot = readSnapshot(workspaces?.list);
  return Array.isArray(snapshot?.items) ? snapshot.items : [];
}

function workspaceContainsSession(workspaces, sessionId) {
  if (!workspaces) return true;
  return workspaceItems(workspaces).some((workspace) => Array.isArray(workspace?.sessionIds) && workspace.sessionIds.includes(sessionId));
}

function observableError(store, label) {
  const snapshot = readSnapshot(store);
  if (snapshot?.state !== "error") return null;
  const detail = snapshot.error?.message || snapshot.error?.code || `${label} snapshot error`;
  return new Error(detail);
}

function sessionListReady(sessions, sessionId) {
  return hasSession(sessions, sessionId) &&
    (typeof sessions.binding !== "function" || sessions.binding(sessionId) !== undefined);
}

/**
 * Resolve once the freshly-created session id is present in the RC.8 public
 * list snapshot. RC.8 exposes the public `ids`/`byId` projection. The
 * workspaces service uses a separate `items` projection and is handled below.
 * Readiness is observed through the snapshot subscription and has one
 * bounded timeout; every subscription/timer is disposed on settlement.
 */
export function waitForSessionInList(sessions, sessionId, { timeoutMs = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    let unsub = null;
    let timer = null;
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      if (unsub) unsub();
      if (timer) clearTimeout(timer);
      fn(value);
    };
    const check = () => {
      if (settled) return;
      if (hasSession(sessions, sessionId)) return finish(resolve, sessionId);
      if (Date.now() >= deadline) return finish(reject, new Error("session did not appear in the list: " + sessionId));
    };
    if (typeof sessions.list.subscribe === "function") unsub = sessions.list.subscribe(check);
    timer = setTimeout(check, Math.max(0, timeoutMs));
    check();
  });
}

/**
 * Wait for the public session binding and workspace projection before open.
 * Host-side attachSession is durable, but the renderer must not select the id
 * until both RC.8 list stores have observed that projection.
 */
export function waitForSessionReady(sessions, sessionId, { workspaces, timeoutMs = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const unsubs = [];
    let timer = null;
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      for (const unsub of unsubs) unsub();
      if (timer) clearTimeout(timer);
      fn(value);
    };
    const check = () => {
      if (settled) return;
      const workspaceError = observableError(workspaces?.list, "workspaces");
      if (workspaceError) return finish(reject, workspaceError);
      if (sessionListReady(sessions, sessionId) && workspaceContainsSession(workspaces, sessionId)) {
        return finish(resolve, sessionId);
      }
      if (Date.now() >= deadline) {
        return finish(reject, new Error("session is not ready for open: " + sessionId));
      }
    };
    for (const store of [sessions?.list, workspaces?.list]) {
      if (typeof store?.subscribe === "function") unsubs.push(store.subscribe(check));
    }
    timer = setTimeout(check, Math.max(0, timeoutMs));
    check();
  });
}

/** Wait for the session to be renderer-ready, then ctx.sessions.open it. */
export async function openWorkbenchSession(sessions, sessionId, options = {}) {
  await waitForSessionReady(sessions, sessionId, options);
  sessions.open(sessionId);
  return sessionId;
}
