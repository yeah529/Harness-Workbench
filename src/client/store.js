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
 *     knowledgeChats, workbenchSessions, citationsBySession }
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
  const scopeId = row?.scope?.scopeId ?? row?.scopeId ?? null;
  return {
    ...row,
    scope: { kind, scopeId },
    chatId: row?.chatId ?? null,
  };
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
    settings: { timezone: "Asia/Shanghai", embedding: null, network: null, auth: null, index: null },
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
    knowledgeChats: [],
    recentSessions: [],
    recentSessionTotal: 0,
    sessionPage: { items: [], total: 0, limit: 20, offset: 0, query: "", context: null },
    workbenchSessions: {},
    citationsBySession: {},
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
  const loadKnowledgeChats = makeGuarded(
    (knowledgeBaseId, signal) => api.knowledgeChats.list({ knowledgeBaseId, signal }),
    (knowledgeChats) => setState({ knowledgeChats }),
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
    const [timezone, embedding, network, auth, index] = await Promise.all([
      readSetting("timezone"),
      readSetting("embedding"),
      readSetting("network"),
      readSetting("authStatus"),
      readSetting("indexStatus"),
    ]);
    const next = {
      timezone: timezone?.timezone || timezone || state.settings.timezone,
      embedding: embedding || state.settings.embedding,
      network: network || state.settings.network,
      auth: auth || state.settings.auth,
      index: index || state.settings.index,
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

    loadKnowledgeChats: async function loadKnowledgeChats(kbId) {
      await loadKnowledgeChats.run(kbId);
    },

    loadRecentSessions: async function loadRecentSessions({ limit = 8 } = {}) {
      return loadRecent.run(limit);
    },

    loadAllSessions: async function loadAllSessions({ query = "", context = null, offset = 0, limit = 20 } = {}) {
      return loadSessionPage.run({ query, context, offset, limit });
    },

    openIndependentSession: async function openIndependentSession({ resumeSessionId } = {}) {
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("openIndependentSession", () => api.chat.sessions.create({ resumeSessionId }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      const entry = { scope: result.scope ?? { kind: "independent", scopeId: null }, chatId: null };
      registerWorkbenchSession({ sessionId: result.sessionId, ...entry });
      setState({
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
        citationsBySession: { ...state.citationsBySession, [result.sessionId]: [] },
      });
      await loadRecent.run(8);
      return result;
    },

    /**
     * Create (POST /chat/sessions {projectId}) the plugin's own local Ollama
     * session for a project, register it, and reset that session's citations.
     * Rejects on failure so the caller stays on the project home and surfaces
     * the error. The caller then waits for the session in ctx.sessions.list and
     * opens it — this action never touches the DSH session service directly.
     */
    openProjectChat: async function openProjectChat({ projectId, resumeSessionId }) {
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("openProjectChat", () =>
          api.chat.sessions.create({ projectId, resumeSessionId }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      registerWorkbenchSession({
        sessionId: result.sessionId,
        scope: result.scope ?? { kind: "project", scopeId: projectId },
        chatId: result.chatId ?? null,
      });
      const entry = {
        scope: result.scope ?? { kind: "project", scopeId: projectId },
        chatId: result.chatId ?? null,
      };
      setState({
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
        citationsBySession: { ...state.citationsBySession, [result.sessionId]: [] },
      });
      await loadRecent.run(8);
      return result;
    },

    /**
     * Create or reopen (POST /chat/sessions {knowledgeBaseId, chatId?}) a
     * knowledge-base chat session (backed by a hidden DSH workspace), register
     * it, reset its citations, and re-fetch the KB chat list. Rejects on failure.
     */
    openKnowledgeChat: async function openKnowledgeChat({ knowledgeBaseId, chatId, title }) {
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("openKnowledgeChat", () =>
          api.chat.sessions.create({ knowledgeBaseId, chatId, title }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      registerWorkbenchSession({
        sessionId: result.sessionId,
        scope: result.scope ?? { kind: "knowledge_base", scopeId: knowledgeBaseId },
        chatId: result.chatId ?? chatId ?? null,
      });
      const entry = {
        scope: result.scope ?? { kind: "knowledge_base", scopeId: knowledgeBaseId },
        chatId: result.chatId ?? chatId ?? null,
      };
      setState({
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
        citationsBySession: { ...state.citationsBySession, [result.sessionId]: [] },
      });
      await loadKnowledgeChats.run(knowledgeBaseId);
      await loadRecent.run(8);
      return result;
    },

    /**
     * Submit one question through the RAG path (POST /chat/prompts), which the
     * host retrieves and injects hidden context for before sending. On success
     * the returned real citations are stored under the session; on failure the
     * action rejects (the composer keeps the draft and shows the error).
     */
    submitPrompt: async function submitPrompt({ sessionId, question, projectId, knowledgeBaseId }) {
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("submitPrompt", () =>
          api.chat.prompts.submit({ sessionId, question, projectId, knowledgeBaseId }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      const citations = Array.isArray(result.citations) ? result.citations : [];
      setState({ citationsBySession: { ...state.citationsBySession, [sessionId]: citations } });
      return result;
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
        knowledgeChats: state.activeKnowledgeBaseId === id ? [] : state.knowledgeChats,
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
      try {
        await runAction("runSummary", () => api.summaries.run({ projectId, summaryDate }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
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
