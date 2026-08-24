const SOURCE_KINDS = new Set(["knowledge_base", "workspace_file", "uploaded_file", "session"]);
const OVERRIDE_MODES = new Set(["pinned", "disabled"]);

export class ContextSourceError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "ContextSourceError";
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

function normalizeSource(source) {
  const kind = source?.kind ?? source?.sourceKind;
  const id = String(source?.id ?? source?.sourceId ?? "").trim();
  if (!SOURCE_KINDS.has(kind)) throw new ContextSourceError("INVALID_SOURCE", "invalid context source kind");
  if (!id) throw new ContextSourceError("INVALID_SOURCE", "context source id is required");
  return { kind, id };
}

function sourceKey(source) {
  return source.kind + ":" + source.id;
}

export function createContextResolver({ repos, sourceAccess } = {}) {
  if (!repos?.workbenchSessions || !repos?.sessionContextSources) {
    throw new Error("createContextResolver requires session repositories");
  }

  function requireSession(sessionId) {
    const session = repos.workbenchSessions.get(sessionId);
    if (!session) throw new ContextSourceError("SESSION_NOT_FOUND", "session not found: " + sessionId);
    return session;
  }

  function inheritedForScope(scope) {
    if (scope.kind === "independent") return [];
    if (scope.kind === "knowledge_base") {
      return [{ kind: "knowledge_base", id: String(scope.id), state: "inherited" }];
    }
    const linked = repos.projectKnowledgeBases.listByProject(scope.id);
    return [
      { kind: "workspace_file", id: String(scope.id), state: "inherited" },
      ...linked.map((kb) => ({ kind: "knowledge_base", id: String(kb.id), state: "inherited" })),
    ];
  }

  function available(source) {
    if (typeof sourceAccess?.available === "function") return sourceAccess.available(source) !== false;
    if (source.kind === "knowledge_base") return repos.knowledgeBases.get(Number(source.id)) != null;
    if (source.kind === "workspace_file") return repos.projects.get(Number(source.id)) != null;
    if (source.kind === "uploaded_file") return repos.documents.get(Number(source.id)) != null;
    if (source.kind === "session") return repos.workbenchSessions.get(source.id) != null;
    return false;
  }

  function validate({ sessionId, sources }) {
    requireSession(sessionId);
    if (!Array.isArray(sources)) throw new ContextSourceError("INVALID_SOURCE", "sources must be an array");
    const seen = new Set();
    return sources.map(normalizeSource).filter((source) => {
      if (source.kind === "session" && source.id === sessionId) {
        throw new ContextSourceError("SELF_REFERENCE", "a session cannot reference itself");
      }
      const key = sourceKey(source);
      if (seen.has(key)) return false;
      seen.add(key);
      if (!available(source)) {
        throw new ContextSourceError("SOURCE_UNAVAILABLE", "context source is unavailable", source);
      }
      return true;
    });
  }

  function resolve({ sessionId }) {
    const session = requireSession(sessionId);
    const inherited = inheritedForScope(session.scope);
    const byKey = new Map(inherited.map((source) => [sourceKey(source), source]));
    const overrides = repos.sessionContextSources.list(sessionId);
    for (const row of overrides) {
      const source = { kind: row.sourceKind, id: row.sourceId };
      const key = sourceKey(source);
      if (row.mode === "disabled") {
        byKey.delete(key);
      } else {
        byKey.set(key, { ...source, state: "pinned" });
      }
    }
    return [...byKey.values()].map((source) => ({ ...source, available: available(source) }));
  }

  function setOverride({ sessionId, source, mode }) {
    if (!OVERRIDE_MODES.has(mode)) throw new ContextSourceError("INVALID_MODE", "invalid context override mode");
    const [normalized] = validate({ sessionId, sources: [source] });
    return repos.sessionContextSources.set({
      sessionId,
      sourceKind: normalized.kind,
      sourceId: normalized.id,
      mode,
    });
  }

  function removeOverride({ sessionId, source }) {
    requireSession(sessionId);
    const normalized = normalizeSource(source);
    return repos.sessionContextSources.remove({
      sessionId,
      sourceKind: normalized.kind,
      sourceId: normalized.id,
    });
  }

  function rebase({ sessionId, toScope }) {
    requireSession(sessionId);
    const inheritedKeys = new Set(inheritedForScope(toScope).map(sourceKey));
    for (const row of repos.sessionContextSources.list(sessionId)) {
      if (row.mode !== "disabled") continue;
      const source = { kind: row.sourceKind, id: row.sourceId };
      if (!inheritedKeys.has(sourceKey(source))) removeOverride({ sessionId, source });
    }
    return resolve({ sessionId });
  }

  function resolveForPrompt({ sessionId, oneShotSources = [] }) {
    const persistent = resolve({ sessionId }).filter((source) => source.available);
    const oneShot = validate({ sessionId, sources: oneShotSources }).map((source) => ({
      ...source,
      state: "one_shot",
      available: true,
    }));
    const merged = new Map(persistent.map((source) => [sourceKey(source), source]));
    for (const source of oneShot) merged.set(sourceKey(source), source);
    return [...merged.values()];
  }

  return { resolve, validate, setOverride, removeOverride, rebase, resolveForPrompt };
}
