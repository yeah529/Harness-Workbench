/**
 * Server-backed observable store for the Cyberpunk workbench client.
 *
 * createWorkbenchStore(api) returns a React-usable external store with
 * subscribe / getSnapshot / actions / dispose. The API (and, through it,
 * SQLite on the host) is the single source of truth: this module never reads
 * or writes the browser key/value store. State is an immutable snapshot replaced on every
 * change, so useSyncExternalStore re-renders only on genuine updates.
 *
 * The snapshot strictly contains the base server collections plus the minimal
 * UI state the views actually need:
 *
 *   { phase, projects, knowledgeBases, documents, health, error,
 *     activeProjectId, activeKnowledgeBaseId, linkedKnowledgeBases,
 *     todos, schedules, summaries, citations, action,
 *     draft, workbenchSessions, scopeSessionPage, contextBySession }
 *
 * refresh() aborts any prior refresh and fetches health / projects /
 * knowledgeBases / documents in parallel. refreshProject(projectId, today)
 * fetches todos / schedules / summaries. Every mutation re-fetches the
 * related collection from the server after success (no optimistic forgery).
 * Sequence counters guarantee a stale concurrent response never overwrites a
 * newer one, and dispose() aborts all in-flight requests.
 */

import { registerWorkbenchSession } from "./workbenchSessions.js";

/** Local calendar day as YYYY-MM-DD (never derived from the UTC clock). */
export function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function toError(err) {
  if (err && typeof err.code === "string") {
    return { code: err.code, message: err && typeof err.message === "string" ? err.message : String(err) };
  }
  return { code: "UNKNOWN", message: err && typeof err.message === "string" ? err.message : String(err) };
}

function isAborted(err, ac) {
  return (err && err.code === "ABORTED") || (ac && ac.signal && ac.signal.aborted);
}

function loadAutomation(api, projectId, signal) {
  if (typeof api.automation?.get !== "function") return Promise.resolve({ projectId, summaryEnabled: true, nextDayTodosEnabled: true });
  return api.automation.get(projectId, { signal }).catch(function (err) {
    // Older test doubles and already-running hosts may not expose the additive
    // toggle route; defaulting is safe because host defaults are both enabled.
    if (err && (err.code === "NOT_FOUND" || err.status === 404)) return { projectId, summaryEnabled: true, nextDayTodosEnabled: true };
    throw err;
  });
}

function loadScheduleRuns(api, schedules, signal) {
  if (typeof api.schedules?.runs !== "function") return Promise.resolve({});
  return Promise.all((Array.isArray(schedules) ? schedules : []).map((schedule) =>
    api.schedules.runs(schedule.id, { signal }).catch(function (err) {
      if (err && (err.code === "NOT_FOUND" || err.status === 404)) return [];
      throw err;
    }).then((runs) => [String(schedule.id), Array.isArray(runs) ? runs : []]),
  )).then((entries) => Object.fromEntries(entries));
}

function normalizeSessionRow(row) {
  const kind = row?.scope?.kind ?? row?.scopeKind;
  const id = row?.scope?.id ?? row?.scopeId ?? null;
  return {
    ...row,
    scope: { kind, id },
  };
}

function normalizeSessionScope(scope) {
  if (!scope || !["project", "knowledge_base", "independent"].includes(scope.kind)) {
    throw new TypeError("会话归属无效");
  }
  if (scope.kind === "independent") return { kind: "independent", id: null };
  if (!Number.isSafeInteger(scope.id) || scope.id <= 0) throw new TypeError("会话归属缺少有效 ID");
  return { kind: scope.kind, id: scope.id };
}

function sessionMap(rows) {
  const out = {};
  for (const raw of Array.isArray(rows) ? rows : []) {
    const row = normalizeSessionRow(raw);
    if (row.sessionId) out[row.sessionId] = row;
  }
  return out;
}

export function createWorkbenchStore(api) {
  if (!api || typeof api.health !== "function") {
    throw new Error("createWorkbenchStore requires a cpwb api");
  }

  let state = {
    phase: "loading",
    projects: [],
    knowledgeBases: [],
    documents: [],
    health: null,
    settings: { timezone: "Asia/Shanghai", embedding: null, network: null, auth: null, index: null, automationPrompts: null },
    error: null,
    activeProjectId: null,
    activeKnowledgeBaseId: null,
    linkedKnowledgeBases: [],
    todos: [],
    schedules: [],
    scheduleRuns: {},
    summaries: [],
    automation: { summaryEnabled: true, nextDayTodosEnabled: true },
    citations: [],
    action: null,
    draft: null,
    recentSessions: [],
    recentSessionTotal: 0,
    sessionPage: { items: [], total: 0, limit: 20, offset: 0, query: "", context: null },
    workbenchSessions: {},
    citationsBySession: {},
    contextBySession: {},
    scopeSessionPage: { items: [], total: 0, limit: 3, offset: 0 },
    globalSchedules: [],
    linkedProjects: [],
  };

  const listeners = new Set();
  const controllers = new Set();

  let disposed = false;
  let documentsScope = { type: "all" };
  let lastToday = null;

  let refreshSeq = 0;
  let refreshAbort = null;
  let projectSeq = 0;
  let projectAbort = null;

  function setState(patch) {
    state = { ...state, ...patch };
    for (const listener of listeners) listener();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return function unsubscribe() { listeners.delete(listener); };
  }

  function getSnapshot() {
    return state;
  }

  function track(ac) {
    controllers.add(ac);
    return ac;
  }
  function untrack(ac) {
    controllers.delete(ac);
  }

  /** Guarded single-collection loader: stale responses never overwrite newer ones. */
  function makeGuarded(fetcher, apply) {
    let seq = 0;
    let controller = null;
    return {
      async run(...args) {
        seq += 1;
        const mySeq = seq;
        if (controller) controller.abort();
        const ac = track(new AbortController());
        controller = ac;
        try {
          const data = await fetcher(...args, ac.signal);
          if (disposed || mySeq !== seq) return data;
          apply(data);
          return data;
        } catch (err) {
          if (disposed || mySeq !== seq) return undefined;
          if (isAborted(err, ac)) return undefined;
          setState({ error: toError(err) });
          return undefined;
        } finally {
          untrack(ac);
          if (controller === ac) controller = null;
        }
      },
    };
  }

  const loadProjects = makeGuarded(
    (signal) => api.projects.list({ signal }),
    (projects) => setState({ projects }),
  );
  const loadKnowledgeBases = makeGuarded(
    (signal) => api.knowledgeBases.list({ signal }),
    (knowledgeBases) => setState({ knowledgeBases }),
  );
  const loadDocuments = makeGuarded(
    (signal) => {
      if (documentsScope.type === "knowledgeBase") {
        return api.documents.list({ scope: "knowledgeBase", scopeId: documentsScope.id, signal });
      }
      return api.documents.list({ signal });
    },
    (documents) => setState({ documents }),
  );
  const loadLinked = makeGuarded(
    (projectId, signal) => api.projectKnowledgeBases.list(projectId, { signal }),
    (linkedKnowledgeBases) => setState({ linkedKnowledgeBases }),
  );
  async function fetchSessionPage(params, signal) {
    if (typeof api.chat?.sessions?.list !== "function") {
      return { items: [], total: 0, limit: params.limit ?? 8, offset: params.offset ?? 0 };
    }
    try {
      const result = await api.chat.sessions.list(params, { signal });
      if (Array.isArray(result)) {
        return { items: result, total: result.length, limit: params.limit ?? result.length, offset: params.offset ?? 0 };
      }
      return result;
    } catch (error) {
      if (error?.status === 404 || error?.code === "NOT_FOUND") {
        return { items: [], total: 0, limit: params.limit ?? 8, offset: params.offset ?? 0 };
      }
      throw error;
    }
  }

  const loadRecent = makeGuarded(
    (limit, signal) => fetchSessionPage({ limit, offset: 0 }, signal),
    (page) => {
      const rows = page.items.map(normalizeSessionRow);
      setState({ recentSessions: rows, recentSessionTotal: Number(page.total) || rows.length, workbenchSessions: { ...state.workbenchSessions, ...sessionMap(rows) } });
    },
  );

  const loadSessionPage = makeGuarded(
    (params, signal) => fetchSessionPage(params, signal),
    (page) => {
      const items = page.items.map(normalizeSessionRow);
      setState({
        sessionPage: { ...page, items },
        workbenchSessions: { ...state.workbenchSessions, ...sessionMap(items) },
      });
    },
  );

  async function refresh() {
    refreshSeq += 1;
    const seq = refreshSeq;
    if (refreshAbort) refreshAbort.abort();
    const ac = track(new AbortController());
    refreshAbort = ac;
    documentsScope = { type: "all" };
    setState({ phase: "loading", error: null, activeKnowledgeBaseId: null });
    try {
      const [health, projects, knowledgeBases, documents] = await Promise.all([
        api.health({ signal: ac.signal }),
        api.projects.list({ signal: ac.signal }),
        api.knowledgeBases.list({ signal: ac.signal }),
        api.documents.list({ signal: ac.signal }),
      ]);
      if (disposed || seq !== refreshSeq) return;
      const sessionPage = await fetchSessionPage({ limit: 8, offset: 0 }, ac.signal);
      if (disposed || seq !== refreshSeq) return;
      const recentSessions = sessionPage.items.map(normalizeSessionRow);
      setState({
        phase: "ready",
        health,
        projects,
        knowledgeBases,
        documents,
        recentSessions,
        recentSessionTotal: Number(sessionPage.total) || recentSessions.length,
        workbenchSessions: sessionMap(recentSessions),
        error: null,
      });
    } catch (err) {
      if (disposed || seq !== refreshSeq) return;
      if (isAborted(err, ac)) return;
      setState({ phase: "error", error: toError(err) });
    } finally {
      untrack(ac);
      if (refreshAbort === ac) refreshAbort = null;
    }
  }

  async function refreshProject(projectId, today) {
    projectSeq += 1;
    const seq = projectSeq;
    if (projectAbort) projectAbort.abort();
    const ac = track(new AbortController());
    projectAbort = ac;
    lastToday = today;
    setState({ activeProjectId: projectId, error: null, action: { type: "refreshProject", status: "running", error: null } });
    try {
      const [todos, schedules, summaries, automation] = await Promise.all([
        api.todos.list({ projectId, signal: ac.signal }),
        api.schedules.list({ projectId, signal: ac.signal }),
        api.summaries.list({ projectId, signal: ac.signal }),
        loadAutomation(api, projectId, ac.signal),
      ]);
      const scheduleRuns = await loadScheduleRuns(api, schedules, ac.signal);
      if (disposed || seq !== projectSeq) return;
      setState({ todos, schedules, scheduleRuns, summaries, automation, error: null, action: { type: "refreshProject", status: "done", error: null } });
    } catch (err) {
      if (disposed || seq !== projectSeq) return;
      if (isAborted(err, ac)) return;
      setState({ error: toError(err), action: { type: "refreshProject", status: "error", error: toError(err) } });
    } finally {
      untrack(ac);
      if (projectAbort === ac) projectAbort = null;
    }
  }

  async function refreshDocuments() {
    await loadDocuments.run();
  }

  async function loadSettings() {
    if (!api.settings) return state.settings;
    const readSetting = (name) => typeof api.settings[name] === "function"
      ? Promise.resolve().then(() => api.settings[name]()).catch(() => null)
      : Promise.resolve(null);
    const [timezone, embedding, network, auth, index, automationPrompts] = await Promise.all([
      readSetting("timezone"),
      readSetting("embedding"),
      readSetting("network"),
      readSetting("authStatus"),
      readSetting("indexStatus"),
      readSetting("automationPrompts"),
    ]);
    const next = {
      timezone: timezone?.timezone || timezone || state.settings.timezone,
      embedding: embedding || state.settings.embedding,
      network: network || state.settings.network,
      auth: auth || state.settings.auth,
      index: index || state.settings.index,
      automationPrompts: automationPrompts || state.settings.automationPrompts,
    };
    setState({ settings: next });
    return next;
  }

  function projectIdFor(collection, id) {
    const arr = state[collection];
    if (Array.isArray(arr)) {
      const item = arr.find((x) => x.id === id);
      if (item && item.projectId != null) return item.projectId;
    }
    return activeProjectId;
  }

  async function runAction(type, fn, meta = {}) {
    setState({ action: { type, ...meta, status: "running", error: null } });
    try {
      const result = await fn();
      setState({ action: { type, ...meta, status: "done", error: null, result } });
      return result;
    } catch (err) {
      setState({ action: { type, ...meta, status: "error", error: toError(err) } });
      throw err;
    }
  }

  const actions = {
    refresh,
    retry: async function retry() {
      await refresh();
      if (state.activeProjectId != null) {
        await refreshProject(state.activeProjectId, lastToday ?? localDateKey());
      }
    },
    refreshProject,
    refreshDocuments,
    loadSettings,

    updateTimezone: async function updateTimezone(timezone) {
      const result = await runAction("updateTimezone", () => api.settings.updateTimezone(timezone));
      setState({ settings: { ...state.settings, timezone: result?.timezone || result } });
      return result;
    },

    updateAutomationPrompts: async function updateAutomationPrompts(prompts) {
      const result = await runAction("updateAutomationPrompts", () => api.settings.updateAutomationPrompts(prompts));
      setState({ settings: { ...state.settings, automationPrompts: result } });
      return result;
    },

    updateEmbedding: async function updateEmbedding(config) {
      const result = await runAction("updateEmbedding", () => api.settings.updateEmbedding(config));
      setState({ settings: { ...state.settings, embedding: result } });
      return result;
    },

    testEmbedding: async function testEmbedding(config) {
      return runAction("testEmbedding", () => api.settings.testEmbedding(config));
    },

    putEmbeddingCredential: async function putEmbeddingCredential(input) {
      const result = await runAction("putEmbeddingCredential", () => api.settings.putEmbeddingCredential(input));
      await loadSettings();
      return result;
    },

    deleteEmbeddingCredential: async function deleteEmbeddingCredential(input) {
      const result = await runAction("deleteEmbeddingCredential", () => api.settings.deleteEmbeddingCredential(input));
      await loadSettings();
      return result;
    },

    reindexAllIndexes: async function reindexAllIndexes() {
      const result = await runAction("reindexIndex", () => api.settings.reindex());
      await loadSettings();
      return result;
    },

    updateNetwork: async function updateNetwork(config) {
      const result = await runAction("updateNetwork", () => api.settings.updateNetwork(config));
      setState({ settings: { ...state.settings, network: result } });
      return result;
    },

    testNetwork: async function testNetwork(config) {
      return runAction("testNetwork", () => api.settings.testNetwork(config));
    },

    testAuth: async function testAuth() {
      return runAction("testAuth", () => api.settings.authTest());
    },

    connectCodex: async function connectCodex() {
      const result = await runAction("connectCodex", () => api.settings.connectCodex());
      await loadSettings();
      return result;
    },

    loadRecentSessions: async function loadRecentSessions({ limit = 8 } = {}) {
      return loadRecent.run(limit);
    },

    loadAllSessions: async function loadAllSessions({ query = "", scopeKind = null, scopeId = null, offset = 0, limit = 20 } = {}) {
      return loadSessionPage.run({ query, scopeKind, scopeId, offset, limit });
    },

    loadScopeSessions: async function loadScopeSessions(scope) {
      const normalized = normalizeSessionScope(scope);
      if (normalized.kind === "independent") {
        const page = { items: [], total: 0, limit: 3, offset: 0 };
        setState({ scopeSessionPage: page });
        return page;
      }
      const page = await fetchSessionPage({ scopeKind: normalized.kind, scopeId: normalized.id, limit: 3, offset: 0 });
      setState({ scopeSessionPage: page });
      return page;
    },

    loadGlobalSchedules: async function loadGlobalSchedules() {
      const schedules = await runAction("loadGlobalSchedules", () => api.schedules.list({}));
      setState({ globalSchedules: Array.isArray(schedules) ? schedules : [] });
      return schedules;
    },

    loadKnowledgeBaseProjects: async function loadKnowledgeBaseProjects(knowledgeBaseId) {
      const projects = await runAction("loadKnowledgeBaseProjects", () => api.knowledgeBaseProjects.list(knowledgeBaseId));
      setState({ linkedProjects: Array.isArray(projects) ? projects : [] });
      return projects;
    },

    reindexKnowledgeBase: async function reindexKnowledgeBase(knowledgeBaseId) {
      const result = await runAction("reindexKnowledgeBase", () => api.knowledgeBaseIndex.reindex(knowledgeBaseId));
      await actions.refreshDocuments();
      return result;
    },

    startDraft: function startDraft({ scope, pinnedSources = [] }) {
      const draft = {
        scope: normalizeSessionScope(scope),
        pinnedSources: Array.isArray(pinnedSources) ? pinnedSources : [],
        text: "",
        status: "pristine",
        sessionId: null,
        error: null,
      };
      setState({ draft, error: null });
      return draft;
    },

    discardDraft: function discardDraft() {
      setState({ draft: null });
    },

    activateDraft: async function activateDraft({ text, oneShotSources = [] }) {
      const question = typeof text === "string" ? text.trim() : "";
      if (!question) throw new TypeError("首条消息不能为空");
      const draft = state.draft;
      if (!draft) throw new TypeError("当前没有待激活的会话草稿");
      setState({ draft: { ...draft, text, status: "activating", error: null } });
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("activateDraft", () => api.chat.sessions.create({
          scope: draft.scope,
          question,
          pinnedSources: draft.pinnedSources,
          oneShotSources,
        }, { signal: ac.signal }));
      } catch (error) {
        const details = error?.details;
        setState({ draft: {
          ...draft,
          text,
          status: details?.lifecycleStatus === "draft_failed" ? "draft_failed" : "error",
          sessionId: details?.sessionId ?? null,
          error: toError(error),
        } });
        throw error;
      } finally {
        untrack(ac);
      }
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId: result.sessionId, scope: entry.scope });
      setState({
        draft: null,
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
        citationsBySession: { ...state.citationsBySession, [result.sessionId]: Array.isArray(result.citations) ? result.citations : [] },
      });
      await loadRecent.run(8);
      return result;
    },

    retryDraft: async function retryDraft({ text, oneShotSources = [] }) {
      const draft = state.draft;
      const question = typeof text === "string" ? text.trim() : "";
      if (!draft?.sessionId || draft.status !== "draft_failed") throw new TypeError("当前草稿不可重试");
      if (!question) throw new TypeError("首条消息不能为空");
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("retryDraft", () => api.chat.sessions.retry({
          sessionId: draft.sessionId,
          question,
          oneShotSources,
        }, { signal: ac.signal }));
      } catch (error) {
        setState({ draft: { ...draft, text, status: "draft_failed", error: toError(error) } });
        throw error;
      } finally {
        untrack(ac);
      }
      const entry = normalizeSessionRow({ ...result, scope: result.scope ?? draft.scope });
      registerWorkbenchSession({ sessionId: result.sessionId, scope: entry.scope });
      setState({
        draft: null,
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
        citationsBySession: { ...state.citationsBySession, [result.sessionId]: Array.isArray(result.citations) ? result.citations : [] },
      });
      await loadRecent.run(8);
      return result;
    },

    openSession: async function openSession(sessionId) {
      const result = await runAction("openSession", () => api.chat.sessions.open(sessionId));
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId, scope: entry.scope });
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      return entry;
    },

    renameSession: async function renameSession({ sessionId, title }) {
      const result = await runAction("renameSession", () => api.chat.sessions.rename({ sessionId, title }));
      const entry = normalizeSessionRow(result);
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(8);
      return entry;
    },

    moveSession: async function moveSession({ sessionId, scope }) {
      const result = await runAction("moveSession", () => api.chat.sessions.move({ sessionId, scope: normalizeSessionScope(scope) }));
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId, scope: entry.scope });
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(8);
      return entry;
    },

    deleteSession: async function deleteSession(sessionId) {
      const result = await runAction("deleteSession", () => api.chat.sessions.remove(sessionId));
      const next = { ...state.workbenchSessions };
      delete next[sessionId];
      setState({ workbenchSessions: next });
      await loadRecent.run(8);
      return result;
    },

    loadSessionContext: async function loadSessionContext(sessionId) {
      const context = await runAction("loadSessionContext", () => api.chat.sessions.context.get(sessionId));
      setState({ contextBySession: { ...state.contextBySession, [sessionId]: context } });
      return context;
    },

    setSessionContext: async function setSessionContext({ sessionId, source, mode }) {
      const context = await runAction("setSessionContext", () => api.chat.sessions.context.set({ sessionId, source, mode }));
      setState({ contextBySession: { ...state.contextBySession, [sessionId]: context } });
      return context;
    },

    removeSessionContext: async function removeSessionContext({ sessionId, source }) {
      await runAction("removeSessionContext", () => api.chat.sessions.context.remove({ sessionId, source }));
      return actions.loadSessionContext(sessionId);
    },

    selectKnowledgeBase: async function selectKnowledgeBase(kbId) {
      documentsScope = { type: "knowledgeBase", id: kbId };
      setState({ activeKnowledgeBaseId: kbId, citations: [] });
      await loadDocuments.run();
    },
    loadAllDocuments: async function loadAllDocuments() {
      documentsScope = { type: "all" };
      setState({ activeKnowledgeBaseId: null, citations: [] });
      await loadDocuments.run();
    },
    loadLinkedKnowledgeBases: async function loadLinkedKnowledgeBases(projectId) {
      await loadLinked.run(projectId);
    },

    createProject: async function createProject({ name, path, workspaceId }) {
      const ac = track(new AbortController());
      let created;
      try {
        created = await runAction("createProject", () =>
          api.projects.create({ name, path, workspaceId }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await loadProjects.run();
      return created;
    },

    renameProject: async function renameProject({ id, name }) {
      const ac = track(new AbortController());
      let updated;
      try {
        updated = await runAction("renameProject", () =>
          api.projects.update({ id, name }, { signal: ac.signal }), { projectId: id });
      } finally {
        untrack(ac);
      }
      await loadProjects.run();
      return updated;
    },

    deleteProject: async function deleteProject(id) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteProject", () => api.projects.remove(id, { signal: ac.signal }), { projectId: id });
      } finally {
        untrack(ac);
      }
      await loadProjects.run();
      if (state.activeProjectId === id) {
        setState({
          activeProjectId: null,
          linkedKnowledgeBases: [],
          todos: [],
          schedules: [],
          scheduleRuns: {},
          summaries: [],
        });
      }
    },

    createKnowledgeBase: async function createKnowledgeBase({ name, description }) {
      const ac = track(new AbortController());
      let created;
      try {
        created = await runAction("createKnowledgeBase", () =>
          api.knowledgeBases.create({ name, description }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await loadKnowledgeBases.run();
      return created;
    },

    deleteKnowledgeBase: async function deleteKnowledgeBase(id) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteKnowledgeBase", () => api.knowledgeBases.remove(id, { signal: ac.signal }), { knowledgeBaseId: id });
      } finally {
        untrack(ac);
      }
      if (state.activeKnowledgeBaseId === id) documentsScope = { type: "all" };
      await refresh();
      setState({
        activeKnowledgeBaseId: state.activeKnowledgeBaseId === id ? null : state.activeKnowledgeBaseId,
        citations: state.activeKnowledgeBaseId === id ? [] : state.citations,
      });
    },

    linkProjectKnowledgeBase: async function linkProjectKnowledgeBase(projectId, knowledgeBaseId) {
      const ac = track(new AbortController());
      try {
        await runAction("linkProjectKnowledgeBase", () =>
          api.projectKnowledgeBases.link(projectId, knowledgeBaseId, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await loadLinked.run(projectId);
    },

    unlinkProjectKnowledgeBase: async function unlinkProjectKnowledgeBase(projectId, knowledgeBaseId) {
      const ac = track(new AbortController());
      try {
        await runAction("unlinkProjectKnowledgeBase", () =>
          api.projectKnowledgeBases.unlink(projectId, knowledgeBaseId, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await loadLinked.run(projectId);
    },

    uploadFiles: async function uploadFiles({ files, scope, scopeId }) {
      const list = Array.isArray(files) ? files : [files];
      if (list.length === 0) return { ok: true, uploaded: [], failures: [] };
      setState({ action: { type: "upload", status: "running", error: null, done: 0, total: list.length } });
      const uploaded = [];
      const failures = [];
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        const ac = track(new AbortController());
        try {
          const res = await api.documents.upload({ file, scope, scopeId }, { signal: ac.signal });
          uploaded.push({ file, document: res.document });
        } catch (err) {
          failures.push({ file, error: toError(err) });
        } finally {
          untrack(ac);
        }
        setState({ action: { type: "upload", status: "running", error: null, done: i + 1, total: list.length } });
      }
      await refreshDocuments();
      if (failures.length > 0) {
        setState({ action: { type: "upload", status: "error", error: failures[0].error, done: list.length, total: list.length } });
        return { ok: false, uploaded, failures };
      }
      setState({ action: { type: "upload", status: "done", error: null, done: list.length, total: list.length } });
      return { ok: true, uploaded, failures };
    },

    reindexDocument: async function reindexDocument(id) {
      const ac = track(new AbortController());
      try {
        await runAction("reindexDocument", () => api.documents.reindex(id, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshDocuments();
    },

    unlinkDocument: async function unlinkDocument({ id, scope, scopeId }) {
      const ac = track(new AbortController());
      try {
        await runAction("unlinkDocument", () => api.documents.unlink({ id, scope, scopeId }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshDocuments();
    },

    search: async function search({ scope, scopeId, query, limit }) {
      const ac = track(new AbortController());
      let results;
      try {
        results = await runAction("search", () => api.search({ scope, scopeId, query, limit }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      setState({ citations: Array.isArray(results) ? results : [] });
      return results;
    },

    createTodo: async function createTodo({ projectId, title, dueAt, source = "manual" }) {
      const ac = track(new AbortController());
      try {
        await runAction("todo", () => api.todos.create({ projectId, title, dueAt, source }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
    },

    updateTodo: async function updateTodo({ id, title, dueAt, done }) {
      const ac = track(new AbortController());
      try {
        await runAction("todo", () => api.todos.update({ id, title, dueAt, done }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      const projectId = projectIdFor("todos", id);
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },

    deleteTodo: async function deleteTodo(id) {
      const projectId = projectIdFor("todos", id);
      const ac = track(new AbortController());
      try {
        await runAction("todo", () => api.todos.remove(id, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },

    createSchedule: async function createSchedule({ projectId, name, recurrence, startsAt, prompt, enabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("createSchedule", () => api.schedules.create({ projectId, name, recurrence, startsAt, prompt, enabled }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
    },

    updateSchedule: async function updateSchedule({ id, name, prompt, recurrence, startsAt, enabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("updateSchedule", () => api.schedules.update({ id, name, prompt, recurrence, startsAt, enabled }, { signal: ac.signal }), { scheduleId: id });
      } finally {
        untrack(ac);
      }
      const projectId = projectIdFor("schedules", id);
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },

    deleteSchedule: async function deleteSchedule(id) {
      const projectId = projectIdFor("schedules", id);
      const ac = track(new AbortController());
      try {
        await runAction("deleteSchedule", () => api.schedules.remove(id, { signal: ac.signal }), { scheduleId: id });
      } finally {
        untrack(ac);
      }
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },

    runSchedule: async function runSchedule(id) {
      const ac = track(new AbortController());
      try {
        await runAction("runSchedule", () => api.schedules.run(id, { signal: ac.signal }), { scheduleId: id });
      } finally {
        untrack(ac);
      }
      if (state.activeProjectId != null) await refreshProject(state.activeProjectId, lastToday ?? localDateKey());
    },

    runSummary: async function runSummary({ projectId, summaryDate }) {
      const ac = track(new AbortController());
      let result;
      let failure = null;
      try {
        result = await runAction("runSummary", () => api.summaries.run({ projectId, summaryDate }, { signal: ac.signal }));
      } catch (error) {
        failure = error;
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
      if (failure) {
        setState({ action: { type: "runSummary", status: "error", error: toError(failure) } });
        throw failure;
      }
      setState({ action: { type: "runSummary", status: "done", error: null, result } });
    },

    deleteSummary: async function deleteSummary({ id, projectId }) {
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("deleteSummary", () => api.summaries.remove(id, { signal: ac.signal }), { summaryId: id });
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
      setState({ action: { type: "deleteSummary", summaryId: id, status: "done", error: null, result } });
    },

    updateAutomation: async function updateAutomation({ projectId, summaryEnabled, nextDayTodosEnabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("updateAutomation", () => api.automation.update(
          { projectId, summaryEnabled, nextDayTodosEnabled }, { signal: ac.signal },
        ));
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
    },
  };

  function dispose() {
    disposed = true;
    for (const ac of controllers) ac.abort();
    controllers.clear();
    listeners.clear();
  }

  return { subscribe, getSnapshot, actions, dispose };
}
