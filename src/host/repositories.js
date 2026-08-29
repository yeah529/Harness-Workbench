/**
 * Repository layer over the workbench SQLite database.
 *
 * Each method returns plain JSON-safe objects whose timestamps are ISO 8601
 * UTC strings. Mutations that combine more than one statement run inside a
 * transaction via the helper from database.js.
 */

import { transaction } from "./database.js";

/** Normalize a timestamp value (Date or string) into an ISO 8601 UTC string. */
function nowIso(now = new Date()) {
  if (now instanceof Date) return now.toISOString();
  if (typeof now === "string") return now;
  return new Date(now).toISOString();
}

function mapProject(row) {
  return {
    id: row.id,
    workspaceId: row.workspace_id ?? null,
    name: row.name,
    path: row.path ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapKnowledgeBase(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDocument(row) {
  return {
    id: row.id,
    sha256: row.sha256,
    originalName: row.original_name,
    mimeType: row.mime_type ?? null,
    size: row.size ?? null,
    status: row.status,
    error: row.error ?? null,
    createdAt: row.created_at,
    indexedAt: row.indexed_at ?? null,
  };
}

function mapSessionFile(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    sha256: row.sha256,
    originalName: row.original_name,
    mimeType: row.mime_type ?? null,
    size: row.size,
    parseStatus: row.parse_status,
    parseError: row.parse_error ?? null,
    contextText: row.context_text ?? null,
    contextCodePoints: row.context_code_points,
    createdAt: row.created_at,
  };
}

function mapTodo(row, now = new Date()) {
  const due = new Date(row.due_at);
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    done: row.done !== 0,
    source: row.source,
    dueAt: row.due_at,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? null,
    overdue: row.done === 0 && Number.isFinite(due.getTime()) && due.getTime() < new Date(now).getTime(),
  };
}

function mapSchedule(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    sessionId: row.session_id ?? null,
    name: row.name,
    prompt: row.prompt ?? null,
    rule: row.rule,
    recurrence: row.recurrence ?? null,
    startsAt: row.starts_at ?? null,
    enabled: row.enabled !== 0,
    lastRunAt: row.last_run_at ?? null,
    nextRunAt: row.next_run_at ?? null,
  };
}

function mapRun(row, claimed = false) {
  return {
    id: row.id,
    scheduleId: row.schedule_id,
    scheduledAt: row.scheduled_at,
    sessionId: row.session_id ?? null,
    status: row.status,
    startedAt: row.started_at ?? null,
    finishedAt: row.finished_at ?? null,
    error: row.error ?? null,
    claimed,
  };
}

function mapSummary(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    summaryDate: row.summary_date,
    content: row.content ?? null,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapChunk(row) {
  return {
    id: row.id,
    documentId: row.document_id,
    ordinal: row.ordinal,
    text: row.text,
    locator: row.locator,
    heading: row.heading ?? null,
    originalName: row.original_name,
    contentHash: row.content_hash,
  };
}

function mapIndexMetadata(row) {
  return {
    documentId: row.document_id,
    embeddingModel: row.embedding_model,
    embeddingDigest: row.embedding_digest,
    dimensions: row.dimensions,
    parserVersion: row.parser_version,
    chunkerVersion: row.chunker_version,
    updatedAt: row.updated_at,
  };
}

function mapWorkbenchSession(row) {
  const scopeId = row.scope_id ?? null;
  return {
    sessionId: row.session_id,
    scopeKind: row.scope_kind,
    scopeId,
    scope: { kind: row.scope_kind, id: scopeId },
    contextName: row.context_name ?? (row.scope_kind === "independent" ? "独立" : null),
    title: row.title ?? null,
    titleLocked: row.title_locked !== 0,
    lifecycleStatus: row.lifecycle_status,
    archivedAt: row.archived_at ?? null,
    sessionType: row.session_type ?? "chat",
    scheduleName: row.schedule_name ?? null,
    selection: {
      provider: row.provider ?? null,
      model: row.model ?? null,
      ...(row.reasoning_effort == null ? {} : { reasoningEffort: row.reasoning_effort }),
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const WORKBENCH_SESSION_SELECT =
  "SELECT ws.*, sch.name AS schedule_name, " +
  "CASE WHEN sch.id IS NULL THEN 'chat' ELSE 'schedule' END AS session_type, " +
  "CASE ws.scope_kind " +
  "WHEN 'project' THEN p.name " +
  "WHEN 'knowledge_base' THEN kb.name " +
  "ELSE '独立' END AS context_name " +
  "FROM workbench_sessions ws " +
  "LEFT JOIN projects p ON ws.scope_kind = 'project' AND p.id = ws.scope_id " +
  "LEFT JOIN knowledge_bases kb ON ws.scope_kind = 'knowledge_base' AND kb.id = ws.scope_id " +
  "LEFT JOIN schedules sch ON sch.session_id = ws.session_id ";

const SESSION_SCOPE_KINDS = new Set(["project", "knowledge_base", "independent"]);
const CONTEXT_SOURCE_KINDS = new Set(["knowledge_base", "workspace_file", "uploaded_file", "session"]);
const CONTEXT_MODES = new Set(["pinned", "disabled"]);
const SESSION_LIFECYCLE_STATUSES = new Set(["draft_failed", "active"]);

function normalizeSessionScope(scope) {
  const kind = scope?.kind;
  const rawId = scope?.id;
  if (!SESSION_SCOPE_KINDS.has(kind)) throw new TypeError("invalid session scope kind");
  if (kind === "independent") {
    if (rawId !== undefined && rawId !== null) throw new TypeError("independent scope cannot have an id");
    return { kind, id: null };
  }
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new TypeError(kind + " scope requires a positive id");
  return { kind, id };
}

function normalizeContextIdentity({ sessionId, sourceKind, sourceId }) {
  if (typeof sessionId !== "string" || sessionId.trim() === "") throw new TypeError("sessionId is required");
  if (!CONTEXT_SOURCE_KINDS.has(sourceKind)) throw new TypeError("invalid context source kind");
  const id = String(sourceId ?? "").trim();
  if (!id) throw new TypeError("context source id is required");
  if (sourceKind === "session" && id === sessionId) throw new TypeError("a session cannot reference itself");
  return { sessionId, sourceKind, sourceId: id };
}

/**
 * Replace a document's chunks inside a running transaction and return the
 * persisted rows (with their SQLite ids) so the caller can correlate each
 * chunk with a vector. The chunks_ai/ad triggers keep chunks_fts in sync.
 *
 * This helper performs no transaction boundary of its own: callers wrap it in
 * `transaction(db, ...)` or combine it with other statements in one boundary.
 */
function replaceChunksCore(db, documentId, chunkList) {
  const doc = db.prepare("SELECT original_name FROM documents WHERE id = ?").get(documentId);
  const fallbackName = doc ? doc.original_name : "";
  db.prepare("DELETE FROM chunks WHERE document_id = ?").run(documentId);
  const insert = db.prepare(
    "INSERT INTO chunks (document_id, ordinal, text, locator, heading, original_name, content_hash) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  const inserted = [];
  for (const chunk of chunkList) {
    const originalName = chunk.originalName ?? fallbackName;
    const heading = chunk.heading ?? null;
    const info = insert.run(
      documentId, chunk.ordinal, chunk.text, chunk.locator, heading, originalName, chunk.contentHash,
    );
    inserted.push(mapChunk({
      id: Number(info.lastInsertRowid),
      document_id: documentId,
      ordinal: chunk.ordinal,
      text: chunk.text,
      locator: chunk.locator,
      heading,
      original_name: originalName,
      content_hash: chunk.contentHash,
    }));
  }
  return inserted;
}

/** Upsert one document's index metadata (single atomic statement, no boundary). */
function upsertIndexMetadataCore(db, {
  documentId,
  embeddingModel,
  embeddingDigest,
  dimensions,
  parserVersion,
  chunkerVersion,
  now,
}) {
  const iso = nowIso(now);
  db.prepare(
    "INSERT INTO document_index_metadata " +
      "(document_id, embedding_model, embedding_digest, dimensions, parser_version, chunker_version, updated_at) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?) " +
      "ON CONFLICT(document_id) DO UPDATE SET " +
      "embedding_model = excluded.embedding_model, " +
      "embedding_digest = excluded.embedding_digest, " +
      "dimensions = excluded.dimensions, " +
      "parser_version = excluded.parser_version, " +
      "chunker_version = excluded.chunker_version, " +
      "updated_at = excluded.updated_at",
  ).run(documentId, embeddingModel, embeddingDigest, dimensions, parserVersion, chunkerVersion, iso);
}

/**
 * Build the grouped repository API bound to one database connection.
 *
 * @param {import("node:sqlite").DatabaseSync} db
 */
export function createRepositories(db) {
  function orphanSessionFilesForSessions(sessionIds) {
    const targets = new Set(sessionIds);
    if (targets.size === 0) return [];
    const ownership = new Map();
    for (const row of db.prepare("SELECT session_id, sha256 FROM session_files ORDER BY sha256").all()) {
      const state = ownership.get(row.sha256) ?? { hasTarget: false, hasOutside: false };
      if (targets.has(row.session_id)) state.hasTarget = true;
      else state.hasOutside = true;
      ownership.set(row.sha256, state);
    }
    return [...ownership]
      .filter(([, state]) => state.hasTarget && !state.hasOutside)
      .map(([sha256]) => ({ sha256 }));
  }

  const projects = {
    create({ name, path = null, workspaceId = null, now = new Date() }) {
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO projects (workspace_id, name, path, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      ).run(workspaceId, name, path, iso, iso);
      const row = db.prepare("SELECT * FROM projects WHERE id = last_insert_rowid()").get();
      return mapProject(row);
    },

    get(id) {
      const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
      return row ? mapProject(row) : null;
    },

    list() {
      return db.prepare("SELECT * FROM projects ORDER BY id").all().map(mapProject);
    },

    update({ id, name, now = new Date() }) {
      const info = db.prepare(
        "UPDATE projects SET name = ?, updated_at = ? WHERE id = ?",
      ).run(name, nowIso(now), id);
      return info.changes === 0 ? null : this.get(id);
    },

    deletionPlan(id) {
      const project = this.get(id);
      if (!project) return null;
      const linkedDocuments = db.prepare(
        "SELECT d.* FROM documents d JOIN project_documents pd ON pd.document_id = d.id WHERE pd.project_id = ? ORDER BY d.id",
      ).all(id).map(mapDocument);
      const orphanDocuments = linkedDocuments.filter((document) => {
        const projectCount = Number(db.prepare(
          "SELECT COUNT(*) AS n FROM project_documents WHERE document_id = ? AND project_id != ?",
        ).get(document.id, id).n);
        const knowledgeBaseCount = Number(db.prepare(
          "SELECT COUNT(*) AS n FROM knowledge_base_documents WHERE document_id = ?",
        ).get(document.id).n);
        return projectCount + knowledgeBaseCount === 0;
      });
      const sessionIds = db.prepare(
        "SELECT session_id FROM workbench_sessions WHERE scope_kind = 'project' AND scope_id = ? ORDER BY session_id",
      ).all(id).map((row) => row.session_id);
      const orphanSessionFiles = orphanSessionFilesForSessions(sessionIds);
      const relationshipCount = Number(db.prepare(
        "SELECT COUNT(*) AS n FROM project_knowledge_bases WHERE project_id = ?",
      ).get(id).n);
      return { project, linkedDocuments, orphanDocuments, orphanSessionFiles, sessionIds, relationshipCount };
    },

    removeContainer(id) {
      const plan = this.deletionPlan(id);
      if (!plan) return null;
      if (plan.sessionIds.length > 0) throw new Error("project still owns sessions");
      return transaction(db, () => {
        db.prepare("DELETE FROM projects WHERE id = ?").run(id);
        for (const document of plan.orphanDocuments) {
          db.prepare("DELETE FROM documents WHERE id = ?").run(document.id);
        }
        return plan;
      });
    },
  };

  const workbenchSessions = {
    create({ sessionId, scope, provider = null, model = null, reasoningEffort = null, title = null, titleLocked = false, lifecycleStatus = "active", now = new Date() }) {
      if (typeof sessionId !== "string" || sessionId.trim() === "") throw new TypeError("sessionId is required");
      const normalizedScope = normalizeSessionScope(scope);
      if (!SESSION_LIFECYCLE_STATUSES.has(lifecycleStatus)) throw new TypeError("invalid session lifecycle status");
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO workbench_sessions " +
          "(session_id, scope_kind, scope_id, provider, model, reasoning_effort, title, title_locked, lifecycle_status, created_at, updated_at) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).run(sessionId, normalizedScope.kind, normalizedScope.id, provider, model, reasoningEffort, title, titleLocked ? 1 : 0, lifecycleStatus, iso, iso);
      return this.get(sessionId);
    },

    get(sessionId) {
      const row = db.prepare(WORKBENCH_SESSION_SELECT + "WHERE ws.session_id = ?").get(sessionId);
      return row ? mapWorkbenchSession(row) : null;
    },

    list({ scopeKind, scopeId, lifecycleStatus = null, archived = null, limit = 100, offset = 0 }) {
      const normalizedScope = normalizeSessionScope({ kind: scopeKind, id: scopeId });
      if (lifecycleStatus != null && !SESSION_LIFECYCLE_STATUSES.has(lifecycleStatus)) throw new TypeError("invalid session lifecycle status");
      const safeLimit = Math.max(1, Math.min(500, Number(limit) || 100));
      const safeOffset = Math.max(0, Number(offset) || 0);
      const lifecycleFilter = lifecycleStatus == null ? "" : "AND ws.lifecycle_status = ? ";
      const archiveFilter = archived === true
        ? "AND ws.archived_at IS NOT NULL "
        : archived === false ? "AND ws.archived_at IS NULL " : "";
      const params = [normalizedScope.kind, normalizedScope.id];
      if (lifecycleStatus != null) params.push(lifecycleStatus);
      return db.prepare(
        WORKBENCH_SESSION_SELECT +
        "WHERE ws.scope_kind = ? AND ws.scope_id IS ? " + lifecycleFilter + archiveFilter +
        "ORDER BY ws.updated_at DESC, ws.rowid DESC LIMIT ? OFFSET ?",
      ).all(...params, safeLimit, safeOffset).map(mapWorkbenchSession);
    },

    listAll({ scopeKind = null, scopeId = null, query = "", lifecycleStatus = null, archived = null, limit = 100, offset = 0 } = {}) {
      const safeLimit = Math.max(1, Math.min(500, Number(limit) || 100));
      const safeOffset = Math.max(0, Number(offset) || 0);
      const filters = [];
      const params = [];
      if (scopeKind) {
        if (!SESSION_SCOPE_KINDS.has(scopeKind)) throw new TypeError("invalid session scope kind");
        filters.push("ws.scope_kind = ?");
        params.push(scopeKind);
      }
      if (scopeId != null) {
        if (!scopeKind || scopeKind === "independent") throw new TypeError("scopeId requires a project or knowledge-base scope");
        filters.push("ws.scope_id IS ?");
        params.push(Number(scopeId));
      }
      if (lifecycleStatus != null) {
        if (!SESSION_LIFECYCLE_STATUSES.has(lifecycleStatus)) throw new TypeError("invalid session lifecycle status");
        filters.push("ws.lifecycle_status = ?");
        params.push(lifecycleStatus);
      }
      if (archived === true) filters.push("ws.archived_at IS NOT NULL");
      else if (archived === false) filters.push("ws.archived_at IS NULL");
      const normalizedQuery = String(query ?? "").trim().toLowerCase();
      if (normalizedQuery) {
        filters.push("(LOWER(ws.session_id) LIKE ? OR LOWER(COALESCE(ws.title, p.name, kb.name, '独立')) LIKE ?)");
        const pattern = "%" + normalizedQuery + "%";
        params.push(pattern, pattern);
      }
      const where = filters.length ? "WHERE " + filters.join(" AND ") + " " : "";
      return db.prepare(
        WORKBENCH_SESSION_SELECT + where +
        "ORDER BY ws.updated_at DESC, ws.rowid DESC LIMIT ? OFFSET ?",
      ).all(...params, safeLimit, safeOffset).map(mapWorkbenchSession);
    },

    countAll({ scopeKind = null, scopeId = null, query = "", lifecycleStatus = null, archived = null } = {}) {
      const filters = [];
      const params = [];
      if (scopeKind) {
        if (!SESSION_SCOPE_KINDS.has(scopeKind)) throw new TypeError("invalid session scope kind");
        filters.push("ws.scope_kind = ?");
        params.push(scopeKind);
      }
      if (scopeId != null) {
        if (!scopeKind || scopeKind === "independent") throw new TypeError("scopeId requires a project or knowledge-base scope");
        filters.push("ws.scope_id IS ?");
        params.push(Number(scopeId));
      }
      if (lifecycleStatus != null) {
        if (!SESSION_LIFECYCLE_STATUSES.has(lifecycleStatus)) throw new TypeError("invalid session lifecycle status");
        filters.push("ws.lifecycle_status = ?");
        params.push(lifecycleStatus);
      }
      if (archived === true) filters.push("ws.archived_at IS NOT NULL");
      else if (archived === false) filters.push("ws.archived_at IS NULL");
      const normalizedQuery = String(query ?? "").trim().toLowerCase();
      if (normalizedQuery) {
        filters.push("(LOWER(ws.session_id) LIKE ? OR LOWER(COALESCE(ws.title, p.name, kb.name, '独立')) LIKE ?)");
        const pattern = "%" + normalizedQuery + "%";
        params.push(pattern, pattern);
      }
      const where = filters.length ? "WHERE " + filters.join(" AND ") : "";
      const row = db.prepare(
        "SELECT COUNT(*) AS total FROM workbench_sessions ws " +
        "LEFT JOIN projects p ON ws.scope_kind = 'project' AND p.id = ws.scope_id " +
        "LEFT JOIN knowledge_bases kb ON ws.scope_kind = 'knowledge_base' AND kb.id = ws.scope_id " + where,
      ).get(...params);
      return Number(row.total);
    },

    remove(sessionId) {
      return Number(db.prepare("DELETE FROM workbench_sessions WHERE session_id = ?").run(sessionId).changes) > 0;
    },

    archive(sessionId, now = new Date()) {
      const iso = nowIso(now);
      const info = db.prepare(
        "UPDATE workbench_sessions SET archived_at = COALESCE(archived_at, ?), updated_at = ? WHERE session_id = ?",
      ).run(iso, iso, sessionId);
      return Number(info.changes) === 0 ? null : this.get(sessionId);
    },

    restore(sessionId, now = new Date()) {
      const iso = nowIso(now);
      const info = db.prepare(
        "UPDATE workbench_sessions SET archived_at = NULL, updated_at = ? WHERE session_id = ?",
      ).run(iso, sessionId);
      return Number(info.changes) === 0 ? null : this.get(sessionId);
    },

    latest({ scopeKind, scopeId }) {
      const row = db.prepare(
        WORKBENCH_SESSION_SELECT +
        "WHERE ws.scope_kind = ? AND ws.scope_id IS ? AND ws.lifecycle_status = 'active' AND ws.archived_at IS NULL ORDER BY ws.updated_at DESC, ws.rowid DESC LIMIT 1",
      ).get(scopeKind, scopeId);
      return row ? mapWorkbenchSession(row) : null;
    },

    updateScope({ sessionId, scope, now = new Date() }) {
      const normalizedScope = normalizeSessionScope(scope);
      const info = db.prepare(
        "UPDATE workbench_sessions SET scope_kind = ?, scope_id = ?, updated_at = ? WHERE session_id = ?",
      ).run(normalizedScope.kind, normalizedScope.id, nowIso(now), sessionId);
      return Number(info.changes) === 0 ? null : this.get(sessionId);
    },

    updateLifecycle({ sessionId, lifecycleStatus, now = new Date() }) {
      if (!SESSION_LIFECYCLE_STATUSES.has(lifecycleStatus)) throw new TypeError("invalid session lifecycle status");
      const info = db.prepare(
        "UPDATE workbench_sessions SET lifecycle_status = ?, updated_at = ? WHERE session_id = ?",
      ).run(lifecycleStatus, nowIso(now), sessionId);
      return Number(info.changes) === 0 ? null : this.get(sessionId);
    },

    rename({ sessionId, title, titleLocked = true, now = new Date() }) {
      const normalizedTitle = typeof title === "string" ? title.trim() : "";
      if (!normalizedTitle) throw new TypeError("session title is required");
      const info = db.prepare(
        "UPDATE workbench_sessions SET title = ?, title_locked = ?, updated_at = ? WHERE session_id = ?",
      ).run(normalizedTitle, titleLocked ? 1 : 0, nowIso(now), sessionId);
      return Number(info.changes) === 0 ? null : this.get(sessionId);
    },

    touch(sessionId, now = new Date()) {
      db.prepare("UPDATE workbench_sessions SET updated_at = ? WHERE session_id = ?").run(nowIso(now), sessionId);
      return this.get(sessionId);
    },

    setTitleIfEmpty(sessionId, title, now = new Date()) {
      if (typeof title !== "string" || title.trim() === "") return this.get(sessionId);
      db.prepare(
        "UPDATE workbench_sessions SET title = ?, updated_at = ? WHERE session_id = ? AND title_locked = 0 AND (title IS NULL OR TRIM(title) = '')",
      ).run(title.trim(), nowIso(now), sessionId);
      return this.get(sessionId);
    },
  };

  const automation = {
    get(projectId) {
      const row = db.prepare("SELECT * FROM project_automation WHERE project_id = ?").get(projectId);
      return {
        projectId,
        summaryEnabled: row ? row.summary_enabled !== 0 : true,
        nextDayTodosEnabled: row ? row.next_day_todos_enabled !== 0 : true,
        updatedAt: row?.updated_at ?? null,
      };
    },

    update({ projectId, summaryEnabled, nextDayTodosEnabled, now = new Date() }) {
      const current = this.get(projectId);
      const next = {
        summaryEnabled: summaryEnabled === undefined ? current.summaryEnabled : summaryEnabled,
        nextDayTodosEnabled: nextDayTodosEnabled === undefined ? current.nextDayTodosEnabled : nextDayTodosEnabled,
      };
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO project_automation (project_id, summary_enabled, next_day_todos_enabled, updated_at) VALUES (?, ?, ?, ?) " +
          "ON CONFLICT(project_id) DO UPDATE SET summary_enabled = excluded.summary_enabled, next_day_todos_enabled = excluded.next_day_todos_enabled, updated_at = excluded.updated_at",
      ).run(projectId, next.summaryEnabled ? 1 : 0, next.nextDayTodosEnabled ? 1 : 0, iso);
      return this.get(projectId);
    },
  };

  const knowledgeBases = {
    create({ name, description = null, now = new Date() }) {
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO knowledge_bases (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ).run(name, description, iso, iso);
      const row = db.prepare("SELECT * FROM knowledge_bases WHERE id = last_insert_rowid()").get();
      return mapKnowledgeBase(row);
    },

    get(id) {
      const row = db.prepare("SELECT * FROM knowledge_bases WHERE id = ?").get(id);
      return row ? mapKnowledgeBase(row) : null;
    },

    list() {
      return db.prepare("SELECT * FROM knowledge_bases ORDER BY id").all().map(mapKnowledgeBase);
    },

    deletionPlan(id) {
      const knowledgeBase = this.get(id);
      if (!knowledgeBase) return null;
      const linkedDocuments = db.prepare(
        "SELECT d.* FROM documents d JOIN knowledge_base_documents kbd ON kbd.document_id = d.id WHERE kbd.knowledge_base_id = ? ORDER BY d.id",
      ).all(id).map(mapDocument);
      const orphanDocuments = linkedDocuments.filter((document) => {
        const projectCount = Number(db.prepare("SELECT COUNT(*) AS n FROM project_documents WHERE document_id = ?").get(document.id).n);
        const knowledgeBaseCount = Number(db.prepare(
          "SELECT COUNT(*) AS n FROM knowledge_base_documents WHERE document_id = ? AND knowledge_base_id != ?",
        ).get(document.id, id).n);
        return projectCount + knowledgeBaseCount === 0;
      });
      const sessionIds = db.prepare(
        "SELECT session_id FROM workbench_sessions WHERE scope_kind = 'knowledge_base' AND scope_id = ? ORDER BY session_id",
      ).all(id).map((row) => row.session_id);
      const orphanSessionFiles = orphanSessionFilesForSessions(sessionIds);
      const relationshipCount = Number(db.prepare(
        "SELECT COUNT(*) AS n FROM project_knowledge_bases WHERE knowledge_base_id = ?",
      ).get(id).n);
      return { knowledgeBase, linkedDocuments, orphanDocuments, orphanSessionFiles, sessionIds, relationshipCount };
    },

    removeContainer(id) {
      const plan = this.deletionPlan(id);
      if (!plan) return null;
      if (plan.sessionIds.length > 0) throw new Error("knowledge base still owns sessions");
      return transaction(db, () => {
        db.prepare("DELETE FROM knowledge_bases WHERE id = ?").run(id);
        for (const document of plan.orphanDocuments) {
          db.prepare("DELETE FROM documents WHERE id = ?").run(document.id);
        }
        return plan;
      });
    },
  };

  const projectKnowledgeBases = {
    link({ projectId, knowledgeBaseId }) {
      db.prepare(
        "INSERT OR IGNORE INTO project_knowledge_bases (project_id, knowledge_base_id) VALUES (?, ?)",
      ).run(projectId, knowledgeBaseId);
      return { projectId, knowledgeBaseId };
    },

    unlink({ projectId, knowledgeBaseId }) {
      const info = db.prepare(
        "DELETE FROM project_knowledge_bases WHERE project_id = ? AND knowledge_base_id = ?",
      ).run(projectId, knowledgeBaseId);
      return Number(info.changes);
    },

    listByProject(projectId) {
      return db.prepare(
        "SELECT kb.* FROM knowledge_bases kb " +
          "JOIN project_knowledge_bases pkb ON pkb.knowledge_base_id = kb.id " +
          "WHERE pkb.project_id = ? ORDER BY kb.id",
      ).all(projectId).map(mapKnowledgeBase);
    },

    listByKnowledgeBase(knowledgeBaseId) {
      return db.prepare(
        "SELECT p.* FROM projects p " +
          "JOIN project_knowledge_bases pkb ON pkb.project_id = p.id " +
          "WHERE pkb.knowledge_base_id = ? ORDER BY p.id",
      ).all(knowledgeBaseId).map(mapProject);
    },
  };

  const documents = {
    /**
     * Insert a document once, keyed by SHA-256. When the SHA already exists
     * this returns the stored record unchanged: status, indexed_at, and
     * original metadata are never reset by a repeat upload.
     */
    upsertBySha256({
      sha256,
      originalName,
      mimeType = null,
      size = null,
      now = new Date(),
    }) {
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO documents (sha256, original_name, mime_type, size, status, error, created_at, indexed_at) " +
          "VALUES (?, ?, ?, ?, 'parsing', NULL, ?, NULL) " +
          "ON CONFLICT(sha256) DO NOTHING",
      ).run(sha256, originalName, mimeType, size, iso);
      const row = db.prepare("SELECT * FROM documents WHERE sha256 = ?").get(sha256);
      return mapDocument(row);
    },

    /**
     * Advance a document's indexing lifecycle. The parse/embed pipeline calls
     * this explicitly so status, error, and indexed_at change only when the
     * pipeline says so — never as a side effect of a duplicate upload.
     */
    updateIndexState(id, { status, error = null, indexedAt = null }) {
      db.prepare(
        "UPDATE documents SET status = ?, error = ?, indexed_at = ? WHERE id = ?",
      ).run(status, error, indexedAt, id);
      const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
      return row ? mapDocument(row) : null;
    },

    /**
     * Atomically replace a document's chunks and index metadata inside one
     * SQLite transaction, returning the persisted chunk rows (with ids). The
     * indexer calls this only after every embedding has been produced and
     * validated, so a document can never expose partially-embedded chunks.
     */
    applyIndexedChunks({ documentId, chunks, metadata, now = new Date() }) {
      return transaction(db, () => {
        const inserted = replaceChunksCore(db, documentId, chunks);
        upsertIndexMetadataCore(db, { documentId, ...metadata, now });
        return inserted;
      });
    },

    /** Restore the last known SQLite index state after a failed replacement. */
    restoreIndexedState({ documentId, document, chunks = [], metadata = null }) {
      return transaction(db, () => {
        db.prepare("DELETE FROM chunks WHERE document_id = ?").run(documentId);
        const insert = db.prepare(
          "INSERT INTO chunks (id, document_id, ordinal, text, locator, heading, original_name, content_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        );
        for (const chunk of chunks) {
          insert.run(chunk.id, documentId, chunk.ordinal, chunk.text, chunk.locator, chunk.heading ?? null, chunk.originalName ?? "", chunk.contentHash);
        }
        if (metadata) {
          upsertIndexMetadataCore(db, { documentId, ...metadata });
        } else {
          db.prepare("DELETE FROM document_index_metadata WHERE document_id = ?").run(documentId);
        }
        if (document) {
          db.prepare("UPDATE documents SET status = ?, error = ?, indexed_at = ? WHERE id = ?")
            .run(document.status, document.error ?? null, document.indexedAt ?? null, documentId);
        }
        return this.get(documentId);
      });
    },

    get(id) {
      const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
      return row ? mapDocument(row) : null;
    },

    getBySha256(sha256) {
      const row = db.prepare("SELECT * FROM documents WHERE sha256 = ?").get(sha256);
      return row ? mapDocument(row) : null;
    },

    list() {
      return db.prepare("SELECT * FROM documents ORDER BY id").all().map(mapDocument);
    },

    link({ documentId, scope, scopeId }) {
      if (scope === "project") {
        db.prepare(
          "INSERT OR IGNORE INTO project_documents (project_id, document_id) VALUES (?, ?)",
        ).run(scopeId, documentId);
      } else if (scope === "knowledgeBase") {
        db.prepare(
          "INSERT OR IGNORE INTO knowledge_base_documents (knowledge_base_id, document_id) VALUES (?, ?)",
        ).run(scopeId, documentId);
      } else {
        throw new Error("unknown document scope: " + scope);
      }
      return { documentId, scope, scopeId };
    },

    unlink({ documentId, scope, scopeId }) {
      let info;
      if (scope === "project") {
        info = db.prepare(
          "DELETE FROM project_documents WHERE project_id = ? AND document_id = ?",
        ).run(scopeId, documentId);
      } else if (scope === "knowledgeBase") {
        info = db.prepare(
          "DELETE FROM knowledge_base_documents WHERE knowledge_base_id = ? AND document_id = ?",
        ).run(scopeId, documentId);
      } else {
        throw new Error("unknown document scope: " + scope);
      }
      return Number(info.changes);
    },

    listLinks(documentId) {
      const projectRows = db.prepare(
        "SELECT project_id FROM project_documents WHERE document_id = ?",
      ).all(documentId);
      const kbRows = db.prepare(
        "SELECT knowledge_base_id FROM knowledge_base_documents WHERE document_id = ?",
      ).all(documentId);
      return [
        ...projectRows.map((r) => ({ scope: "project", scopeId: r.project_id })),
        ...kbRows.map((r) => ({ scope: "knowledgeBase", scopeId: r.knowledge_base_id })),
      ];
    },

    listByProject(projectId) {
      const rows = db.prepare(
        "SELECT d.* FROM documents d JOIN project_documents pd ON pd.document_id = d.id " +
          "WHERE pd.project_id = ? ORDER BY d.id",
      ).all(projectId);
      return rows.map(mapDocument);
    },

    listByKnowledgeBase(knowledgeBaseId) {
      const rows = db.prepare(
        "SELECT d.* FROM documents d JOIN knowledge_base_documents kbd ON kbd.document_id = d.id " +
          "WHERE kbd.knowledge_base_id = ? ORDER BY d.id",
      ).all(knowledgeBaseId);
      return rows.map(mapDocument);
    },

    scopeDocumentIds({ scope, scopeId }) {
      if (scope === "project") {
        const rows = db.prepare(
          "SELECT DISTINCT d.id FROM documents d WHERE d.status = 'ready' AND d.id IN (" +
            "SELECT pd.document_id FROM project_documents pd WHERE pd.project_id = ? " +
            "UNION " +
            "SELECT kbd.document_id FROM knowledge_base_documents kbd " +
            "JOIN project_knowledge_bases pkb ON pkb.knowledge_base_id = kbd.knowledge_base_id " +
            "WHERE pkb.project_id = ?" +
            ") ORDER BY d.id",
        ).all(scopeId, scopeId);
        return rows.map((r) => r.id);
      }
      if (scope === "knowledgeBase") {
        const rows = db.prepare(
          "SELECT DISTINCT d.id FROM documents d WHERE d.status = 'ready' AND d.id IN (" +
            "SELECT kbd.document_id FROM knowledge_base_documents kbd WHERE kbd.knowledge_base_id = ? " +
            "UNION " +
            "SELECT pd.document_id FROM project_documents pd " +
            "JOIN project_knowledge_bases pkb ON pkb.project_id = pd.project_id " +
            "WHERE pkb.knowledge_base_id = ?" +
            ") ORDER BY d.id",
        ).all(scopeId, scopeId);
        return rows.map((r) => r.id);
      }
      throw new Error("unknown document scope: " + scope);
    },
  };

  const chunks = {
    /**
     * Atomically replace every chunk of a document. Deletes and re-inserts
     * inside one transaction; the chunks_ai/chunks_ad triggers keep chunks_fts
     * in sync with the new content. Returns the persisted chunk rows (with
     * their SQLite ids, heading, and original_name) so callers can correlate
     * each chunk with a vector.
     */
    replaceForDocument({ documentId, chunks: chunkList }) {
      return transaction(db, () => replaceChunksCore(db, documentId, chunkList));
    },

    listByDocument(documentId) {
      return db.prepare(
        "SELECT * FROM chunks WHERE document_id = ? ORDER BY ordinal",
      ).all(documentId).map(mapChunk);
    },

    deleteForDocument(documentId) {
      const info = db.prepare("DELETE FROM chunks WHERE document_id = ?").run(documentId);
      return Number(info.changes);
    },

    searchFts({ matchExpression, documentIds, limit = 20 }) {
      if (typeof matchExpression !== "string" || matchExpression === "") return [];
      if (!Array.isArray(documentIds) || documentIds.length === 0) return [];
      const ids = [...new Set(documentIds)].filter((n) => Number.isSafeInteger(n) && n > 0);
      if (ids.length === 0) return [];
      if (!Number.isSafeInteger(limit) || limit <= 0) limit = 20;
      const placeholders = ids.map(() => "?").join(",");
      const sql =
        "SELECT c.id AS id, c.document_id AS document_id, c.ordinal AS ordinal, " +
        "c.text AS text, c.locator AS locator, c.heading AS heading, c.original_name AS original_name " +
        "FROM chunks_fts JOIN chunks c ON c.id = chunks_fts.rowid " +
        "WHERE chunks_fts MATCH ? AND c.document_id IN (" + placeholders + ") " +
        "ORDER BY bm25(chunks_fts) LIMIT " + limit;
      return db.prepare(sql).all(matchExpression, ...ids).map((row) => ({
        chunkId: row.id,
        documentId: row.document_id,
        ordinal: row.ordinal,
        text: row.text,
        locator: row.locator,
        heading: row.heading == null ? null : row.heading,
        originalName: row.original_name,
      }));
    },

    getByIds(ids) {
      if (!Array.isArray(ids) || ids.length === 0) return [];
      const list = [...new Set(ids)].filter((n) => Number.isSafeInteger(n) && n > 0);
      if (list.length === 0) return [];
      const placeholders = list.map(() => "?").join(",");
      return db.prepare(
        "SELECT * FROM chunks WHERE id IN (" + placeholders + ") ORDER BY document_id, ordinal",
      ).all(...list).map(mapChunk);
    },
  };

  const todos = {
    create({ projectId, title, dueAt, source = "manual", now = new Date() }) {
      if (source !== "manual" && source !== "auto") throw new Error("source must be manual or auto");
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO todos (project_id, title, done, source, due_at, created_at) VALUES (?, ?, 0, ?, ?, ?)",
      ).run(projectId, title, source, new Date(dueAt).toISOString(), iso);
      const row = db.prepare("SELECT * FROM todos WHERE id = last_insert_rowid()").get();
      return mapTodo(row, now);
    },

    update({ id, title, dueAt, done, now = new Date() }) {
      const current = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
      if (!current) return null;
      const currentDone = current.done !== 0;
      const nextDone = done === undefined ? currentDone : Boolean(done);
      const nextTitle = title === undefined ? current.title : title;
      const nextDueAt = dueAt === undefined ? current.due_at : new Date(dueAt).toISOString();
      const completedAt = !currentDone && nextDone
        ? nowIso(now)
        : currentDone && !nextDone
          ? null
          : current.completed_at ?? null;
      db.prepare("UPDATE todos SET title = ?, due_at = ?, done = ?, completed_at = ? WHERE id = ?")
        .run(nextTitle, nextDueAt, nextDone ? 1 : 0, completedAt, id);
      return mapTodo(db.prepare("SELECT * FROM todos WHERE id = ?").get(id), now);
    },

    remove(id) {
      return db.prepare("DELETE FROM todos WHERE id = ?").run(id).changes > 0;
    },

    list({ projectId, now = new Date() } = {}) {
      const rows = projectId != null
        ? db.prepare("SELECT * FROM todos WHERE project_id = ?").all(projectId)
        : db.prepare("SELECT * FROM todos").all();
      return rows.map((row) => mapTodo(row, now)).sort((a, b) => {
        const rank = (item) => item.done ? 3 : item.overdue ? 0 : (new Date(item.dueAt).getTime() - new Date(now).getTime() <= 24 * 60 * 60 * 1000 ? 1 : 2);
        return rank(a) - rank(b) || new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      });
    },
  };

  const settings = {
    get(key) {
      const row = db.prepare("SELECT value FROM workbench_settings WHERE key = ?").get(key);
      return row ? JSON.parse(row.value) : null;
    },
    set(key, value, now = new Date()) {
      db.prepare("INSERT INTO workbench_settings(key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
        .run(key, JSON.stringify(value), nowIso(now));
      return value;
    },
    list() {
      return db.prepare("SELECT key, value, updated_at FROM workbench_settings ORDER BY key").all()
        .map((row) => ({ key: row.key, value: JSON.parse(row.value), updatedAt: row.updated_at }));
    },
  };

  const summaries = {
    /**
     * Insert or refresh one summary per (project, date). The UNIQUE key keeps
     * a daily re-run idempotent: content and status update in place while the
     * row and its created_at stay stable.
     */
    upsert({ projectId, summaryDate, content = null, status = "pending", now = new Date() }) {
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO summaries (project_id, summary_date, content, status, created_at) VALUES (?, ?, ?, ?, ?) " +
          "ON CONFLICT(project_id, summary_date) DO UPDATE SET content = excluded.content, status = excluded.status",
      ).run(projectId, summaryDate, content, status, iso);
      const row = db.prepare(
        "SELECT * FROM summaries WHERE project_id = ? AND summary_date = ?",
      ).get(projectId, summaryDate);
      return mapSummary(row);
    },

    get(id) {
      const row = db.prepare("SELECT * FROM summaries WHERE id = ?").get(id);
      return row ? mapSummary(row) : null;
    },

    list({ projectId } = {}) {
      const rows = projectId != null
        ? db.prepare("SELECT * FROM summaries WHERE project_id = ? ORDER BY summary_date").all(projectId)
        : db.prepare("SELECT * FROM summaries ORDER BY summary_date").all();
      return rows.map(mapSummary);
    },

    remove(id) {
      const row = db.prepare("SELECT * FROM summaries WHERE id = ?").get(id);
      if (!row) return null;
      db.prepare("DELETE FROM summaries WHERE id = ?").run(id);
      return mapSummary(row);
    },
  };

  const sessionContextSources = {
    set({ sessionId, sourceKind, sourceId, mode, now = new Date() }) {
      const identity = normalizeContextIdentity({ sessionId, sourceKind, sourceId });
      if (!CONTEXT_MODES.has(mode)) throw new TypeError("invalid context source mode");
      const iso = nowIso(now);
      db.prepare(
        "INSERT INTO session_context_sources (session_id, source_kind, source_id, mode, created_at, updated_at) " +
          "VALUES (?, ?, ?, ?, ?, ?) " +
          "ON CONFLICT(session_id, source_kind, source_id) DO UPDATE SET mode = excluded.mode, updated_at = excluded.updated_at",
      ).run(identity.sessionId, identity.sourceKind, identity.sourceId, mode, iso, iso);
      return this.get(identity);
    },

    get({ sessionId, sourceKind, sourceId }) {
      const identity = normalizeContextIdentity({ sessionId, sourceKind, sourceId });
      const row = db.prepare(
        "SELECT * FROM session_context_sources WHERE session_id = ? AND source_kind = ? AND source_id = ?",
      ).get(identity.sessionId, identity.sourceKind, identity.sourceId);
      return row ? {
        sessionId: row.session_id,
        sourceKind: row.source_kind,
        sourceId: row.source_id,
        mode: row.mode,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      } : null;
    },

    list(sessionId) {
      return db.prepare(
        "SELECT * FROM session_context_sources WHERE session_id = ? ORDER BY source_kind, source_id",
      ).all(sessionId).map((row) => ({
        sessionId: row.session_id,
        sourceKind: row.source_kind,
        sourceId: row.source_id,
        mode: row.mode,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },

    remove({ sessionId, sourceKind, sourceId }) {
      const identity = normalizeContextIdentity({ sessionId, sourceKind, sourceId });
      return Number(db.prepare(
        "DELETE FROM session_context_sources WHERE session_id = ? AND source_kind = ? AND source_id = ?",
      ).run(identity.sessionId, identity.sourceKind, identity.sourceId).changes) > 0;
    },
  };

  const sessionFiles = {
    create({
      sessionId,
      sha256,
      originalName,
      mimeType = null,
      size,
      parseStatus,
      parseError = null,
      contextText = null,
      contextCodePoints = 0,
      now = new Date(),
    }) {
      db.prepare(
        "INSERT INTO session_files (session_id, sha256, original_name, mime_type, size, parse_status, parse_error, context_text, context_code_points, created_at) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).run(
        sessionId,
        sha256,
        originalName,
        mimeType,
        size,
        parseStatus,
        parseError,
        contextText,
        contextCodePoints,
        nowIso(now),
      );
      return mapSessionFile(db.prepare("SELECT * FROM session_files WHERE id = last_insert_rowid()").get());
    },

    get(id) {
      const row = db.prepare("SELECT * FROM session_files WHERE id = ?").get(id);
      return row ? mapSessionFile(row) : null;
    },

    getBySessionAndName(sessionId, originalName) {
      const row = db.prepare(
        "SELECT * FROM session_files WHERE session_id = ? AND original_name = ?",
      ).get(sessionId, originalName);
      return row ? mapSessionFile(row) : null;
    },

    listBySession(sessionId) {
      return db.prepare(
        "SELECT * FROM session_files WHERE session_id = ? ORDER BY created_at DESC, id DESC",
      ).all(sessionId).map(mapSessionFile);
    },

    countBySha256(sha256) {
      return Number(db.prepare("SELECT COUNT(*) AS n FROM session_files WHERE sha256 = ?").get(sha256).n);
    },

    remove(id) {
      const row = db.prepare("SELECT * FROM session_files WHERE id = ?").get(id);
      if (!row) return null;
      db.prepare("DELETE FROM session_files WHERE id = ?").run(id);
      return mapSessionFile(row);
    },
  };

  const messageContextRefs = {
    addMany({ sessionId, messageId, sources, now = new Date() }) {
      if (typeof messageId !== "string" || messageId.trim() === "") throw new TypeError("messageId is required");
      if (!Array.isArray(sources)) throw new TypeError("sources must be an array");
      const identities = sources.map((source) => normalizeContextIdentity({
        sessionId,
        sourceKind: source.kind ?? source.sourceKind,
        sourceId: source.id ?? source.sourceId,
      }));
      const iso = nowIso(now);
      transaction(db, () => {
        const insert = db.prepare(
          "INSERT OR IGNORE INTO message_context_refs (session_id, message_id, source_kind, source_id, created_at) VALUES (?, ?, ?, ?, ?)",
        );
        for (const source of identities) insert.run(source.sessionId, messageId.trim(), source.sourceKind, source.sourceId, iso);
      });
      return this.list({ sessionId, messageId: messageId.trim() });
    },

    list({ sessionId, messageId = null }) {
      const rows = messageId == null
        ? db.prepare("SELECT * FROM message_context_refs WHERE session_id = ? ORDER BY message_id, source_kind, source_id").all(sessionId)
        : db.prepare("SELECT * FROM message_context_refs WHERE session_id = ? AND message_id = ? ORDER BY source_kind, source_id").all(sessionId, messageId);
      return rows.map((row) => ({
        sessionId: row.session_id,
        messageId: row.message_id,
        sourceKind: row.source_kind,
        sourceId: row.source_id,
        createdAt: row.created_at,
      }));
    },

    removeForMessage({ sessionId, messageId }) {
      return Number(db.prepare(
        "DELETE FROM message_context_refs WHERE session_id = ? AND message_id = ?",
      ).run(sessionId, messageId).changes);
    },
  };

  const schedules = {
    create({ projectId, name, rule, recurrence = null, startsAt = null, prompt = null, enabled = true }) {
      db.prepare(
        "INSERT INTO schedules (project_id, name, prompt, rule, recurrence, starts_at, enabled) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).run(projectId, name, prompt, rule, recurrence, startsAt, enabled ? 1 : 0);
      const row = db.prepare("SELECT * FROM schedules WHERE id = last_insert_rowid()").get();
      return mapSchedule(row);
    },

    get(id) {
      const row = db.prepare("SELECT * FROM schedules WHERE id = ?").get(id);
      return row ? mapSchedule(row) : null;
    },

    list({ projectId } = {}) {
      const rows = projectId != null
        ? db.prepare("SELECT * FROM schedules WHERE project_id = ? ORDER BY id").all(projectId)
        : db.prepare("SELECT * FROM schedules ORDER BY id").all();
      return rows.map(mapSchedule);
    },

    update({ id, name, prompt, rule, recurrence, startsAt, enabled }) {
      const current = this.get(id);
      if (!current) return null;
      const next = {
        name: name !== undefined ? name : current.name,
        prompt: prompt !== undefined ? prompt : current.prompt,
        rule: rule !== undefined ? rule : current.rule,
        recurrence: recurrence !== undefined ? recurrence : current.recurrence,
        startsAt: startsAt !== undefined ? startsAt : current.startsAt,
        enabled: enabled !== undefined ? enabled : current.enabled,
      };
      db.prepare("UPDATE schedules SET name = ?, prompt = ?, rule = ?, recurrence = ?, starts_at = ?, enabled = ? WHERE id = ?")
        .run(next.name, next.prompt, next.rule, next.recurrence, next.startsAt, next.enabled ? 1 : 0, id);
      return this.get(id);
    },

    bindSession({ id, sessionId }) {
      const schedule = this.get(id);
      if (!schedule) return null;
      const session = workbenchSessions.get(sessionId);
      if (!session) throw new Error("scheduled session does not exist");
      if (session.scopeKind !== "project" || session.scopeId !== schedule.projectId) {
        throw new Error("scheduled session must belong to the schedule project");
      }
      db.prepare("UPDATE schedules SET session_id = ? WHERE id = ?").run(sessionId, id);
      return this.get(id);
    },

    remove(id) {
      const info = db.prepare("DELETE FROM schedules WHERE id = ?").run(id);
      return Number(info.changes) === 1;
    },

    claimRun({ scheduleId, scheduledAt, startedAt = null }) {
      const startedIso = startedAt == null ? null : nowIso(startedAt);
      return transaction(db, () => {
        const info = db.prepare(
          "INSERT INTO schedule_runs (schedule_id, scheduled_at, status, started_at) VALUES (?, ?, 'running', ?) " +
            "ON CONFLICT(schedule_id, scheduled_at) DO NOTHING",
        ).run(scheduleId, scheduledAt, startedIso);
        const claimed = Number(info.changes) === 1;
        const row = db.prepare(
          "SELECT * FROM schedule_runs WHERE schedule_id = ? AND scheduled_at = ?",
        ).get(scheduleId, scheduledAt);
        return mapRun(row, claimed);
      });
    },

    completeRun({ id, sessionId = null, finishedAt = new Date() }) {
      const iso = nowIso(finishedAt);
      db.prepare(
        "UPDATE schedule_runs SET status = 'completed', session_id = ?, finished_at = ? WHERE id = ?",
      ).run(sessionId, iso, id);
      const row = db.prepare("SELECT * FROM schedule_runs WHERE id = ?").get(id);
      return row ? mapRun(row) : null;
    },

    failRun({ id, sessionId = null, error = null, finishedAt = new Date() }) {
      const iso = nowIso(finishedAt);
      db.prepare(
        "UPDATE schedule_runs SET status = 'failed', session_id = ?, error = ?, finished_at = ? WHERE id = ?",
      ).run(sessionId, error, iso, id);
      const row = db.prepare("SELECT * FROM schedule_runs WHERE id = ?").get(id);
      return row ? mapRun(row) : null;
    },

    failRunning({ error = "interrupted", finishedAt = new Date() } = {}) {
      const info = db.prepare(
        "UPDATE schedule_runs SET status = 'failed', error = ?, finished_at = ? WHERE status = 'running'",
      ).run(error, nowIso(finishedAt));
      return Number(info.changes);
    },

    missRun({ id, error = "missed", finishedAt = new Date() }) {
      const iso = nowIso(finishedAt);
      db.prepare(
        "UPDATE schedule_runs SET status = 'missed', error = ?, finished_at = ? WHERE id = ?",
      ).run(error, iso, id);
      const row = db.prepare("SELECT * FROM schedule_runs WHERE id = ?").get(id);
      return row ? mapRun(row) : null;
    },

    updateLastRunAt({ id, lastRunAt = new Date() }) {
      db.prepare("UPDATE schedules SET last_run_at = ? WHERE id = ?").run(nowIso(lastRunAt), id);
      return this.get(id);
    },

    listRuns(scheduleId) {
      return db.prepare("SELECT * FROM schedule_runs WHERE schedule_id = ? ORDER BY id").all(scheduleId).map((row) => mapRun(row));
    },
  };

  const documentIndexMetadata = {
    get(documentId) {
      const row = db.prepare("SELECT * FROM document_index_metadata WHERE document_id = ?").get(documentId);
      return row ? mapIndexMetadata(row) : null;
    },

    list() {
      return db.prepare("SELECT * FROM document_index_metadata ORDER BY document_id").all().map(mapIndexMetadata);
    },

    upsert({
      documentId,
      embeddingModel,
      embeddingDigest,
      dimensions,
      parserVersion,
      chunkerVersion,
      now = new Date(),
    }) {
      upsertIndexMetadataCore(db, {
        documentId, embeddingModel, embeddingDigest, dimensions, parserVersion, chunkerVersion, now,
      });
      return this.get(documentId);
    },

    /**
     * Mark a document's index stale: its metadata no longer matches the current
     * model/parser/chunker, so its vectors must be rebuilt before retrieval.
     */
    markStale(documentId) {
      db.prepare("UPDATE documents SET status = 'stale', error = NULL WHERE id = ?").run(documentId);
      const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(documentId);
      return row ? mapDocument(row) : null;
    },

    /**
     * List ready documents whose stored index metadata differs from the given
     * current settings. The embedding digest comparison is skipped when the
     * caller cannot resolve it (e.g. Ollama is down during startup).
     */
    listMismatch({ embeddingModel, embeddingDigest = null, dimensions, parserVersion, chunkerVersion }) {
      let sql =
        "SELECT m.* FROM document_index_metadata m JOIN documents d ON d.id = m.document_id " +
        "WHERE d.status = 'ready' AND (m.embedding_model IS NOT ? OR m.dimensions != ? " +
        "OR m.parser_version IS NOT ? OR m.chunker_version IS NOT ?";
      const params = [embeddingModel, dimensions, parserVersion, chunkerVersion];
      if (embeddingDigest != null) {
        sql += " OR m.embedding_digest IS NOT ?";
        params.push(embeddingDigest);
      }
      sql += ") ORDER BY m.document_id";
      return db.prepare(sql).all(...params).map(mapIndexMetadata);
    },
  };

  const maintenance = {
    purgeContainer({
      kind,
      id,
      expectedSessionIds,
      expectedOrphanDocumentIds,
      expectedSessionFileHashes,
    }) {
      if (kind !== "project" && kind !== "knowledge_base") {
        throw new TypeError("maintenance purge requires a project or knowledge base");
      }
      const containerId = Number(id);
      if (!Number.isInteger(containerId) || containerId <= 0) {
        throw new TypeError("maintenance purge requires a positive container id");
      }
      const normalizeIds = (values, label) => {
        if (!Array.isArray(values)) throw new TypeError(`${label} must be an array`);
        return [...new Set(values)].sort((left, right) =>
          typeof left === "number" && typeof right === "number"
            ? left - right
            : String(left).localeCompare(String(right)),
        );
      };
      const expectedSessions = normalizeIds(expectedSessionIds, "expectedSessionIds");
      const expectedDocuments = normalizeIds(
        expectedOrphanDocumentIds,
        "expectedOrphanDocumentIds",
      );
      const expectedFiles = normalizeIds(
        expectedSessionFileHashes,
        "expectedSessionFileHashes",
      );

      return transaction(db, () => {
        const repository = kind === "project" ? projects : knowledgeBases;
        const plan = repository.deletionPlan(containerId);
        if (!plan) throw new Error("maintenance purge container not found");
        const currentSessions = normalizeIds(plan.sessionIds, "current session ids");
        const currentDocuments = normalizeIds(
          plan.orphanDocuments.map((document) => document.id),
          "current orphan document ids",
        );
        const currentFiles = normalizeIds(
          plan.orphanSessionFiles.map((file) => file.sha256),
          "current session file hashes",
        );
        if (
          JSON.stringify(currentSessions) !== JSON.stringify(expectedSessions) ||
          JSON.stringify(currentDocuments) !== JSON.stringify(expectedDocuments) ||
          JSON.stringify(currentFiles) !== JSON.stringify(expectedFiles)
        ) {
          throw new Error("stale purge plan: container graph changed after confirmation");
        }

        const removeSession = db.prepare(
          "DELETE FROM workbench_sessions WHERE session_id = ?",
        );
        for (const sessionId of expectedSessions) removeSession.run(sessionId);
        if (kind === "project") {
          db.prepare("DELETE FROM projects WHERE id = ?").run(containerId);
        } else {
          db.prepare("DELETE FROM knowledge_bases WHERE id = ?").run(containerId);
        }
        const removeDocument = db.prepare("DELETE FROM documents WHERE id = ?");
        for (const documentId of expectedDocuments) removeDocument.run(documentId);
        return {
          ...plan,
          container: kind === "project" ? plan.project : plan.knowledgeBase,
        };
      });
    },
  };

  return {
    projects,
    knowledgeBases,
    projectKnowledgeBases,
    documents,
    chunks,
    documentIndexMetadata,
    automation,
    todos,
    settings,
    summaries,
    sessionContextSources,
    messageContextRefs,
    sessionFiles,
    workbenchSessions,
    schedules,
    maintenance,
  };
}
