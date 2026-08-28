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
 *     draft, workbenchSessions, contextBySession, skillCatalogs, skillAction }
 *
 * refresh() aborts any prior refresh and fetches health / projects /
 * knowledgeBases / documents in parallel. refreshProject(projectId, today)
 * fetches todos / schedules / summaries. Every mutation re-fetches the
 * related collection from the server after success (no optimistic forgery).
 * Sequence counters guarantee a stale concurrent response never overwrites a
 * newer one, and dispose() aborts all in-flight requests.
 */

import { registerWorkbenchSession } from "./workbenchSessions.js";

const RECENT_SESSION_LIMIT = 20;

/** Local calendar day as YYYY-MM-DD (never derived from the UTC clock). */
export function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function toError(err, { includeDetails = false } = {}) {
  if (err && typeof err.code === "string") {
    return {
      code: err.code,
      message: err && typeof err.message === "string" ? err.message : String(err),
      ...(includeDetails && err.details !== undefined ? { details: err.details } : {}),
    };
  }
  return {
    code: "UNKNOWN",
    message: err && typeof err.message === "string" ? err.message : String(err),
    ...(includeDetails && err?.details !== undefined ? { details: err.details } : {}),
  };
}

function normalizeSkillTarget(input = {}) {
  if (input.scope === "global") return { scope: "global", key: "global", request: { scope: "global" } };
  if (input.scope === "project" && Number.isSafeInteger(input.projectId) && input.projectId > 0) {
    return {
      scope: "project",
      projectId: input.projectId,
      key: "project:" + input.projectId,
      request: { scope: "project", projectId: input.projectId },
    };
  }
  throw new TypeError("skill scope must be global or project with a positive projectId");
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
    sessionPage: { items: [], total: 0, limit: 20, offset: 0, query: "", context: null, archived: false },
    workbenchSessions: {},
    citationsBySession: {},
    contextBySession: {},
    globalSchedules: [],
    linkedProjects: [],
    maintenanceJob: null,
    skillCatalogs: {},
    skillAction: null,
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
  const skillLoadSeq = new Map();
  const skillLoads = new Map();
  let skillActionSeq = 0;

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
      const sessionPage = await fetchSessionPage({ limit: RECENT_SESSION_LIMIT, offset: 0 }, ac.signal);
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

  function updateSkillCatalog(key, patch) {
    const previous = state.skillCatalogs[key] || { status: "loading", data: null, error: null };
    setState({
      skillCatalogs: {
        ...state.skillCatalogs,
        [key]: { ...previous, ...patch },
      },
    });
  }

  async function loadSkills(input = {}, { throwOnError = false } = {}) {
    if (disposed) return undefined;
    const target = normalizeSkillTarget(input);
    const key = target.key;
    const previous = state.skillCatalogs[key] || { status: "loading", data: null, error: null };
    const seq = (skillLoadSeq.get(key) || 0) + 1;
    skillLoadSeq.set(key, seq);
    const prior = skillLoads.get(key);
    if (prior) prior.abort();
    const ac = track(new AbortController());
    skillLoads.set(key, ac);
    updateSkillCatalog(key, { status: "loading", data: previous.data ?? null, error: null });
    try {
      const data = await api.skills.list({ ...target.request, signal: ac.signal });
      if (disposed || skillLoadSeq.get(key) !== seq) return data;
      updateSkillCatalog(key, { status: "ready", data, error: null });
      return data;
    } catch (err) {
      if (disposed || skillLoadSeq.get(key) !== seq || isAborted(err, ac)) return undefined;
      updateSkillCatalog(key, { status: "error", data: previous.data ?? null, error: toError(err, { includeDetails: true }) });
      if (throwOnError) throw err;
      return undefined;
    } finally {
      untrack(ac);
      if (skillLoads.get(key) === ac) skillLoads.delete(key);
    }
  }

  function updateSkillAction(mySeq, action) {
    if (!disposed && mySeq === skillActionSeq) setState({ skillAction: action });
  }

  async function runSkillMutation(type, input, invoke, { reload = true } = {}) {
    const target = normalizeSkillTarget(input);
    const key = target.key;
    const name = input.name;
    const mySeq = ++skillActionSeq;
    updateSkillAction(mySeq, { type, key, name, status: "running", error: null });
    const ac = track(new AbortController());
    try {
      const result = await invoke({ ...target.request, signal: ac.signal });
      if (!disposed && reload) await loadSkills(target.request, { throwOnError: true });
      updateSkillAction(mySeq, { type, key, name, status: "done", error: null, result });
      return result;
    } catch (err) {
      updateSkillAction(mySeq, { type, key, name, status: "error", error: toError(err, { includeDetails: true }) });
      throw err;
    } finally {
      untrack(ac);
    }
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
    loadSkills,

    importSkill: async function importSkill(input = {}) {
      return runSkillMutation(
        "importSkill",
        input,
        ({ scope, projectId, signal }) => api.skills.importBundle({
          archive: input.archive,
          scope,
          ...(projectId === undefined ? {} : { projectId }),
          sourceName: input.sourceName,
          replace: input.replace === true,
        }, { signal }),
      );
    },

    setSkillEnabled: async function setSkillEnabled(input = {}) {
      return runSkillMutation(
        "setSkillEnabled",
        input,
        ({ scope, projectId, signal }) => api.skills.setEnabled({
          name: input.name,
          scope,
          ...(projectId === undefined ? {} : { projectId }),
          enabled: input.enabled === true,
        }, { signal }),
      );
    },

    deleteSkill: async function deleteSkill(input = {}) {
      return runSkillMutation(
        "deleteSkill",
        input,
        ({ scope, projectId, signal }) => api.skills.remove({
          name: input.name,
          scope,
          ...(projectId === undefined ? {} : { projectId }),
        }, { signal }),
      );
    },

    revealSkill: async function revealSkill(input = {}) {
      return runSkillMutation(
        "revealSkill",
        input,
        ({ scope, projectId, signal }) => api.skills.reveal({
          name: input.name,
          scope,
          ...(projectId === undefined ? {} : { projectId }),
        }, { signal }),
        { reload: false },
      );
    },

    startContainerPurge: async function startContainerPurge(input) {
      if (typeof api.maintenance?.createPurgeJob !== "function") {
        throw new Error("maintenance purge API is unavailable");
      }
      const job = await runAction(
        "startContainerPurge",
        () => api.maintenance.createPurgeJob(input),
      );
      setState({
        maintenanceJob: {
          ...job,
          disconnected: false,
          lastPollError: null,
        },
      });
      return job;
    },

    refreshPurgeJob: async function refreshPurgeJob(jobId) {
      if (typeof api.maintenance?.getPurgeJob !== "function") {
        throw new Error("maintenance purge API is unavailable");
      }
      try {
        const job = await api.maintenance.getPurgeJob(jobId);
        setState({
          maintenanceJob: {
            ...(state.maintenanceJob?.jobId === jobId ? state.maintenanceJob : {}),
            ...job,
            disconnected: false,
            lastPollError: null,
          },
        });
        return job;
      } catch (error) {
        const lastConfirmed = state.maintenanceJob?.jobId === jobId
          ? state.maintenanceJob
          : { jobId };
        setState({
          maintenanceJob: {
            ...lastConfirmed,
            disconnected: true,
            lastPollError: toError(error),
          },
        });
        return null;
      }
    },

    resumePurgeJob: async function resumePurgeJob(jobId) {
      if (state.maintenanceJob?.jobId !== jobId) {
        setState({
          maintenanceJob: {
            jobId,
            state: "reconnecting",
            disconnected: false,
            lastPollError: null,
          },
        });
      }
      return actions.refreshPurgeJob(jobId);
    },

    clearPurgeJob: async function clearPurgeJob() {
      const terminal = state.maintenanceJob?.state;
      if (!terminal) return;
      if (terminal !== "completed" && terminal !== "restored") {
        throw new Error("maintenance job is not complete");
      }
      setState({ maintenanceJob: null });
      await refresh();
    },

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

    loadRecentSessions: async function loadRecentSessions({ limit = RECENT_SESSION_LIMIT } = {}) {
      return loadRecent.run(limit);
    },

    loadAllSessions: async function loadAllSessions({ query = "", scopeKind = null, scopeId = null, archived = false, offset = 0, limit = 20 } = {}) {
      return loadSessionPage.run({ query, scopeKind, scopeId, archived, offset, limit });
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

    discardDraft: async function discardDraft() {
      const draft = state.draft;
      if (!draft) return null;
      if (draft.status === "admitted") return actions.confirmDraft();
      if (draft.sessionId) {
        await runAction("discardDraft", () => api.chat.sessions.remove(draft.sessionId));
      }
      setState({ draft: null });
      return null;
    },

    materializeDraft: async function materializeDraft({ text }) {
      const title = typeof text === "string" ? text.trim() : "";
      if (!title) throw new TypeError("首条消息不能为空");
      const draft = state.draft;
      if (!draft) throw new TypeError("当前没有待激活的会话草稿");
      if (draft.sessionId) {
        setState({ draft: { ...draft, text, error: null } });
        return { sessionId: draft.sessionId, scope: draft.scope, title };
      }
      setState({ draft: { ...draft, text, status: "materializing", error: null } });
      const ac = track(new AbortController());
      try {
        const result = await runAction("materializeDraft", () => api.chat.sessions.create({
          scope: draft.scope,
          title,
          pinnedSources: draft.pinnedSources,
        }, { signal: ac.signal }));
        setState({ draft: {
          ...draft,
          text,
          status: "materialized",
          sessionId: result.sessionId,
          error: null,
        } });
        return result;
      } catch (error) {
        setState({ draft: { ...draft, text, status: "error", error: toError(error) } });
        throw error;
      } finally {
        untrack(ac);
      }
    },

    markDraftAdmitted: function markDraftAdmitted() {
      const draft = state.draft;
      if (!draft?.sessionId) throw new TypeError("会话尚未物化");
      setState({ draft: { ...draft, status: "admitted", error: null } });
    },

    markDraftError: function markDraftError(error) {
      const draft = state.draft;
      if (!draft) return;
      setState({ draft: { ...draft, status: draft.status === "admitted" ? "admitted" : "materialized", error: toError(error) } });
    },

    confirmDraft: async function confirmDraft() {
      const draft = state.draft;
      if (!draft?.sessionId || draft.status !== "admitted") throw new TypeError("首条消息尚未被 DSH 接受");
      const result = await runAction("confirmDraft", () => api.chat.sessions.confirm(draft.sessionId));
      const entry = normalizeSessionRow({ ...result, scope: result.scope ?? draft.scope });
      registerWorkbenchSession({ sessionId: result.sessionId, scope: entry.scope });
      setState({
        draft: null,
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
      });
      await loadRecent.run(RECENT_SESSION_LIMIT);
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
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },

    moveSession: async function moveSession({ sessionId, scope }) {
      const result = await runAction("moveSession", () => api.chat.sessions.move({ sessionId, scope: normalizeSessionScope(scope) }));
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId, scope: entry.scope });
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },

    archiveSession: async function archiveSession(sessionId) {
      const result = await runAction("archiveSession", () => api.chat.sessions.archive(sessionId));
      const entry = normalizeSessionRow(result);
      setState({
        recentSessions: state.recentSessions.filter((row) => row.sessionId !== sessionId),
        workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry },
      });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },

    restoreSession: async function restoreSession(sessionId) {
      const result = await runAction("restoreSession", () => api.chat.sessions.restore(sessionId));
      const entry = normalizeSessionRow(result);
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },

    deleteSession: async function deleteSession(sessionId) {
      const result = await runAction("deleteSession", () => api.chat.sessions.remove(sessionId));
      const next = { ...state.workbenchSessions };
      delete next[sessionId];
      setState({ workbenchSessions: next });
      await loadRecent.run(RECENT_SESSION_LIMIT);
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

    loadProjectDeletionPlan: async function loadProjectDeletionPlan(id) {
      const ac = track(new AbortController());
      try {
        return await runAction("loadProjectDeletionPlan", () => api.projects.deletionPlan(id, { signal: ac.signal }), { projectId: id });
      } finally {
        untrack(ac);
      }
    },

    deleteProject: async function deleteProject({ id, sessionPolicy = "detach" }) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteProject", () => api.projects.remove(id, { sessionPolicy, signal: ac.signal }), { projectId: id, sessionPolicy });
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

    loadKnowledgeBaseDeletionPlan: async function loadKnowledgeBaseDeletionPlan(id) {
      const ac = track(new AbortController());
      try {
        return await runAction("loadKnowledgeBaseDeletionPlan", () => api.knowledgeBases.deletionPlan(id, { signal: ac.signal }), { knowledgeBaseId: id });
      } finally {
        untrack(ac);
      }
    },

    deleteKnowledgeBase: async function deleteKnowledgeBase({ id, sessionPolicy = "detach" }) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteKnowledgeBase", () => api.knowledgeBases.remove(id, { sessionPolicy, signal: ac.signal }), { knowledgeBaseId: id, sessionPolicy });
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
      await Promise.all([loadLinked.run(projectId), loadKnowledgeBases.run()]);
    },

    unlinkProjectKnowledgeBase: async function unlinkProjectKnowledgeBase(projectId, knowledgeBaseId) {
      const ac = track(new AbortController());
      try {
        await runAction("unlinkProjectKnowledgeBase", () =>
          api.projectKnowledgeBases.unlink(projectId, knowledgeBaseId, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await Promise.all([loadLinked.run(projectId), loadKnowledgeBases.run()]);
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

    createGlobalSchedule: async function createGlobalSchedule({ projectId, name, recurrence, startsAt, prompt, enabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("createGlobalSchedule", () => api.schedules.create({ projectId, name, recurrence, startsAt, prompt, enabled }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      const schedules = await api.schedules.list({});
      setState({ globalSchedules: Array.isArray(schedules) ? schedules : [] });
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
      let result;
      let failure = null;
      try {
        result = await runAction("runSchedule", () => api.schedules.run(id, { signal: ac.signal }), { scheduleId: id });
      } catch (error) {
        failure = error;
      } finally {
        untrack(ac);
      }
      if (state.activeProjectId != null) await refreshProject(state.activeProjectId, lastToday ?? localDateKey());
      await loadRecent.run(RECENT_SESSION_LIMIT);
      if (failure) {
        setState({ action: { type: "runSchedule", scheduleId: id, status: "error", error: toError(failure) } });
        throw failure;
      }
      setState({ action: { type: "runSchedule", scheduleId: id, status: "done", error: null, result } });
      return result;
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
    for (const ac of skillLoads.values()) ac.abort();
    for (const ac of controllers) ac.abort();
    controllers.clear();
    listeners.clear();
  }

  return { subscribe, getSnapshot, actions, dispose };
}
