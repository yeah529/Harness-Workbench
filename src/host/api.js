/**
 * Cyberpunk workbench host HTTP API.
 *
 * createApi exposes exactly one handler registered as a "/api/cpwb" prefix
 * route on the DSH webServer service (no web framework: the handler owns the
 * full node:http response lifecycle). Every success response is JSON; every
 * error response is the stable envelope { error: { code, message } } with no
 * stack and no internal detail. Paths are parsed with new URL(req.url), write
 * endpoints validate method, application/json content type (exact media type
 * before any parameters), fields, positive integer ids, document scope, and
 * status, and JSON bodies are capped at 1 MB.
 *
 * The route table below is the single source of truth for the approved
 * section-13 surface. A path that matches a known route with a disallowed
 * method yields 405 (never a silent 404); a path matching no route yields 404.
 *
 * "run"-style endpoints (schedule run, summary run) delegate to injected
 * callback services and return a stable 501 NOT_IMPLEMENTED when none is
 * provided — they never fabricate a successful execution. Internal (unknown)
 * errors are logged in full through the injected logger, while the response
 * keeps only the stable INTERNAL_ERROR envelope.
 */

import { join } from "node:path";

import { saveFile, FileStorageError, FILE_ERROR_CODES } from "./files.js";
import { RetrievalError } from "./retrieval.js";
import { WorkbenchSessionError, SESSION_ERROR_CODES } from "./session-errors.js";
import { nextScheduleOccurrence, scheduleRuleFromInput } from "./scheduler.js";
import { DEFAULT_TIME_ZONE } from "./timezone.js";
import { embeddingIdentity } from "./embedding.js";
import { describeProxyEnv, validateProxyUrl } from "../launcher/proxy.js";

/** The single prefix route registered with webServer. */
export const API_PREFIX = "/api/cpwb";

/** Hard cap on a JSON request body. */
const MAX_JSON_BODY_BYTES = 1024 * 1024;

/** Valid document association scopes. */
const SCOPE_VALUES = new Set(["project", "knowledgeBase"]);

/** A strict YYYY-MM-DD calendar-day shape (checked for real-date validity too). */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** An HTTP error carrying a stable machine-readable code and a clean message. */
class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** HTTP status for each stable session-layer error code. */
const SESSION_ERROR_STATUS = {
  [SESSION_ERROR_CODES.MISSING_SCOPE]: 422,
  [SESSION_ERROR_CODES.INVALID_SCOPE]: 422,
  [SESSION_ERROR_CODES.PROJECT_NOT_FOUND]: 404,
  [SESSION_ERROR_CODES.KNOWLEDGE_BASE_NOT_FOUND]: 404,
  [SESSION_ERROR_CODES.WORKSPACE_NOT_FOUND]: 404,
  [SESSION_ERROR_CODES.SESSION_NOT_FOUND]: 404,
  [SESSION_ERROR_CODES.SCOPE_MISMATCH]: 409,
  [SESSION_ERROR_CODES.RETRIEVAL_FAILED]: 502,
  [SESSION_ERROR_CODES.CHAT_PERSIST_FAILED]: 500,
  [SESSION_ERROR_CODES.SESSION_CREATE_FAILED]: 500,
  [SESSION_ERROR_CODES.CHAT_NOT_FOUND]: 404,
  [SESSION_ERROR_CODES.CHAT_KB_MISMATCH]: 409,
  [SESSION_ERROR_CODES.SESSION_RESUME_FAILED]: 500,
};

// ------------------------------------------------------------- small helpers

function isPositiveInt(value) {
  return Number.isSafeInteger(value) && value > 0;
}

/** True for a strict YYYY-MM-DD string that names a real calendar day. */
function isValidDate(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
  });
  res.end(body);
}

function ok(res, payload, status = 200) {
  sendJson(res, status, payload);
}

function fail(res, status, code, message) {
  sendJson(res, status, { error: { code, message } });
}

/** Map any thrown value into an ApiError with a stable, non-leaking code. */
function toApiError(err) {
  if (err instanceof ApiError) return err;
  if (err instanceof FileStorageError) {
    if (err.code === FILE_ERROR_CODES.TOO_LARGE) {
      return new ApiError(413, err.code, err.message);
    }
    if (err.code === FILE_ERROR_CODES.UNSUPPORTED_EXTENSION) {
      return new ApiError(415, err.code, err.message);
    }
    return new ApiError(422, err.code, err.message);
  }
  if (err instanceof RetrievalError) {
    return new ApiError(422, err.code, err.message);
  }
  if (err instanceof WorkbenchSessionError) {
    return new ApiError(SESSION_ERROR_STATUS[err.code] ?? 500, err.code, err.message);
  }
  return new ApiError(500, "INTERNAL_ERROR", "internal server error");
}

/**
 * True only for errors worth logging server-side: a genuine internal error, or
 * a 5xx service fault that carries an underlying cause. Expected 4xx and the
 * 501 NOT_IMPLEMENTED sentinel are never logged (they are normal control flow,
 * not faults).
 */
function shouldLogError(apiError, thrown) {
  if (apiError.status < 500) return false;
  if (apiError.status === 501) return false;
  if (apiError.code === "INTERNAL_ERROR") return true;
  return thrown != null && thrown.cause !== undefined;
}

/** Parse a numeric path id; reject anything but a positive safe integer. */
function parseId(raw) {
  const id = Number(raw);
  if (!isPositiveInt(id)) {
    throw new ApiError(422, "INVALID_ID", "id must be a positive integer");
  }
  return id;
}

function withNextRun(schedule, timeZone = DEFAULT_TIME_ZONE) {
  const next = schedule.enabled === false ? null : nextScheduleOccurrence(schedule, new Date(), timeZone);
  return { ...schedule, nextRunAt: next ? next.toISOString() : null };
}

function normalizeNextLaunchNetwork(value = {}) {
  const mode = value.mode ?? "inherit";
  if (!["inherit", "direct", "custom"].includes(mode)) {
    throw new ApiError(422, "INVALID_NETWORK_MODE", "network mode must be inherit, direct, or custom");
  }
  let proxyUrl = null;
  if (value.proxyUrl != null && value.proxyUrl !== "") {
    try { proxyUrl = validateProxyUrl(value.proxyUrl); }
    catch { throw new ApiError(422, "INVALID_PROXY_URL", "proxy URL must be http(s) without credentials"); }
  }
  if (mode === "custom" && !proxyUrl) {
    throw new ApiError(422, "INVALID_PROXY_URL", "custom proxy mode requires a proxy URL");
  }
  return { mode, proxyUrl, noProxy: typeof value.noProxy === "string" ? value.noProxy : "" };
}

function describeCurrentNetwork(env) {
  const facts = describeProxyEnv(env);
  const proxyUrl = facts.http || facts.https || null;
  const mode = facts.nodeUseEnvProxy
    ? (proxyUrl ? "custom" : "direct")
    : "inherit";
  return { mode, proxyUrl, ...facts };
}

function networkShape(value) {
  return {
    mode: value.mode,
    http: value.http ?? (value.mode === "custom" ? value.proxyUrl || null : null),
    https: value.https ?? (value.mode === "custom" ? value.proxyUrl || null : null),
    noProxy: value.noProxy || "",
    nodeUseEnvProxy: value.nodeUseEnvProxy ?? true,
  };
}

function nextLaunchShape(next, env) {
  const inherited = describeProxyEnv(env);
  if (next.mode === "direct") return { mode: "direct", http: null, https: null, noProxy: next.noProxy, nodeUseEnvProxy: true };
  if (next.mode === "custom") return { mode: "custom", http: next.proxyUrl, https: next.proxyUrl, noProxy: next.noProxy, nodeUseEnvProxy: true };
  return { mode: "inherit", http: inherited.http, https: inherited.https, noProxy: next.noProxy || inherited.noProxy, nodeUseEnvProxy: true };
}

function describeNetworkState(saved, env) {
  const nextLaunch = normalizeNextLaunchNetwork(saved);
  const currentEffective = describeCurrentNetwork(env);
  const requiresRestart = JSON.stringify(networkShape(currentEffective)) !== JSON.stringify(nextLaunchShape(nextLaunch, env));
  return { saved: nextLaunch, nextLaunch, currentEffective, effective: currentEffective, requiresRestart };
}

/** Validate a document scope ("project" | "knowledgeBase") and its positive id. */
function validateScope(scope, scopeId) {
  if (typeof scope !== "string" || !SCOPE_VALUES.has(scope)) {
    throw new ApiError(422, "INVALID_SCOPE", "scope must be 'project' or 'knowledgeBase'");
  }
  if (!isPositiveInt(scopeId)) {
    throw new ApiError(422, "INVALID_SCOPE_ID", "scopeId must be a positive integer");
  }
  return { scope, scopeId };
}

function methodNotAllowed(res, allowed) {
  fail(res, 405, "METHOD_NOT_ALLOWED", "method not allowed; use " + allowed.join(", "));
}

function notFound(res, message = "not found") {
  fail(res, 404, "NOT_FOUND", message);
}

/** Read and parse a JSON request body (application/json, <= 1 MB). */
async function readJsonBody(req) {
  const contentType = req.headers["content-type"] ?? "";
  // Compare the media type exactly (everything before the first ";"), so a
  // lookalike like "application/json-evil" is rejected, not accepted.
  const mediaType = contentType.toLowerCase().split(";")[0].trim();
  if (mediaType !== "application/json") {
    throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json");
  }
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > MAX_JSON_BODY_BYTES) {
      throw new ApiError(413, "PAYLOAD_TOO_LARGE", "JSON body exceeds 1 MB limit");
    }
    chunks.push(buf);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (text.trim() === "") return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(422, "INVALID_JSON", "malformed JSON body");
  }
}

// ----------------------------------------------------------- field validation

function requireString(body, field, label = field) {
  const value = body[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(422, "INVALID_FIELD", label + " must be a non-empty string");
  }
  return value;
}

function requirePositiveInt(body, field, label = field) {
  const value = body[field];
  if (!isPositiveInt(value)) {
    throw new ApiError(422, "INVALID_FIELD", label + " must be a positive integer");
  }
  return value;
}

function optionalString(body, field, label = field) {
  const value = body[field];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    throw new ApiError(422, "INVALID_FIELD", label + " must be a string");
  }
  return value;
}

/** Validate a required YYYY-MM-DD date field. */
function requireDate(body, field, label = field) {
  const value = body[field];
  if (!isValidDate(value)) {
    throw new ApiError(422, "INVALID_FIELD", label + " must be a YYYY-MM-DD date");
  }
  return value;
}

/** Validate an optional YYYY-MM-DD date field; returns null when absent. */
function optionalDate(body, field, label = field) {
  const value = body[field];
  if (value === undefined || value === null) return null;
  if (!isValidDate(value)) {
    throw new ApiError(422, "INVALID_FIELD", label + " must be a YYYY-MM-DD date");
  }
  return value;
}

/** Validate an optional query id; returns undefined when absent. */
function queryPositiveInt(raw, label) {
  if (raw == null) return undefined;
  const value = Number(raw);
  if (!isPositiveInt(value)) {
    throw new ApiError(422, "INVALID_ID", label + " must be a positive integer");
  }
  return value;
}

function queryNonNegativeInt(raw, label, fallback) {
  if (raw == null) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new ApiError(422, "INVALID_ID", label + " must be a non-negative integer");
  }
  return value;
}

/** Validate an optional query date; returns undefined when absent. */
function queryDate(raw, label) {
  if (raw == null) return undefined;
  if (!isValidDate(raw)) {
    throw new ApiError(422, "INVALID_FIELD", label + " must be a YYYY-MM-DD date");
  }
  return raw;
}

function requireDateTime(body, field = "dueAt") {
  const value = body[field];
  const isoDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})$/;
  if (typeof value !== "string" || !isoDateTime.test(value) || Number.isNaN(new Date(value).getTime())) {
    throw new ApiError(422, "INVALID_DATETIME", field + " must be a valid ISO 8601 date-time");
  }
  return new Date(value).toISOString();
}

/** Strip the /api/cpwb prefix; a bare prefix maps to "/". */
function subPath(pathname) {
  if (pathname === API_PREFIX) return "/";
  if (pathname.startsWith(API_PREFIX + "/")) return pathname.slice(API_PREFIX.length);
  return pathname;
}

/** Match "/a/:id/b" patterns against a path, returning named params or null. */
function matchParams(path, pattern) {
  const pp = pattern.split("/").filter(Boolean);
  const sp = path.split("/").filter(Boolean);
  if (pp.length !== sp.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i += 1) {
    if (pp[i].startsWith(":")) {
      try {
        params[pp[i].slice(1)] = decodeURIComponent(sp[i]);
      } catch {
        throw new ApiError(422, "INVALID_PATH", "malformed percent-encoding in path");
      }
    } else if (pp[i] !== sp[i]) {
      return null;
    }
  }
  return params;
}

// --------------------------------------------------------------------- create

/**
 * @param {object} deps
 * @param {ReturnType<import("./repositories.js").createRepositories>} deps.repos
 * @param {{ enqueue: Function, idle: Function, close: Function }} deps.queue
 * @param {{ health: Function }} deps.ollama
 * @param {{ search: Function }} deps.retriever
 * @param {string} deps.dataDir data root for file storage
 * @param {{ runSchedule?: Function, runSummary?: Function }} [deps.services]
 * @param {{ error?: Function }} [deps.logger]
 */
export function createApi({ repos, queue, ollama, retriever, dataDir, services = {}, sessions, settings, embeddingFactory, onEmbeddingConfigChange, credentials, codexAuth, dshAdapter, logger = console, networkEnv = process.env }) {
  if (!repos || !queue || !ollama || !retriever || typeof dataDir !== "string") {
    throw new Error("createApi requires repos, queue, ollama, retriever, and dataDir");
  }

  const hasRunSchedule = typeof services.runSchedule === "function";
  const hasRunSummary = typeof services.runSummary === "function";
  const hasSessions = typeof sessions?.createSession === "function" && typeof sessions?.submitPrompt === "function";
  const logError = typeof logger?.error === "function" ? logger.error.bind(logger) : () => {};
  const configuredTimeZone = () => settings?.get?.("timezone") ?? DEFAULT_TIME_ZONE;

  // ----- documents -----

  async function handleUpload(req, res) {
    const rawName = req.headers["x-cpwb-filename"];
    if (typeof rawName !== "string" || rawName === "") {
      throw new ApiError(422, "INVALID_FILENAME", "x-cpwb-filename header is required");
    }
    let originalName;
    try {
      originalName = decodeURIComponent(rawName);
    } catch {
      throw new ApiError(422, "INVALID_FILENAME", "x-cpwb-filename is not valid URI encoding");
    }
    const scope = req.headers["x-cpwb-scope"];
    const scopeIdRaw = req.headers["x-cpwb-scope-id"];
    const { scopeId } = validateScope(scope, scopeIdRaw == null ? NaN : Number(scopeIdRaw));

    const entity = scope === "project"
      ? repos.projects.get(scopeId)
      : repos.knowledgeBases.get(scopeId);
    if (!entity) {
      throw new ApiError(404, "NOT_FOUND", scope + " not found: " + scopeId);
    }

    // Durable file first (content-addressed, 50 MB authoritative), then the
    // SQLite document + association row, and only then enqueue parsing.
    const saved = await saveFile({ stream: req, originalName, dataDir });
    const doc = repos.documents.upsertBySha256({
      sha256: saved.sha256,
      originalName: saved.originalName,
      mimeType: saved.mimeType,
      size: saved.size,
    });
    repos.documents.link({ documentId: doc.id, scope, scopeId });

    let queued = false;
    if (doc.status === "ready") {
      // Already indexed: a repeat upload only adds the new association.
      queued = false;
    } else {
      // New (parsing), failed, or stale: reset to parsing and enqueue.
      if (doc.status !== "parsing" && doc.status !== "uploading" && doc.status !== "embedding") {
        repos.documents.updateIndexState(doc.id, { status: "parsing", error: null, indexedAt: null });
      }
      queue.enqueue({
        documentId: doc.id,
        filePath: saved.path,
        originalName: saved.originalName,
        mimeType: saved.mimeType,
      });
      queued = true;
    }

    ok(res, { document: repos.documents.get(doc.id), queued }, 202);
  }

  async function handleDocumentsList(req, res, { url }) {
    const scope = url.searchParams.get("scope");
    if (scope != null) {
      const scopeId = Number(url.searchParams.get("scopeId"));
      const v = validateScope(scope, scopeId);
      ok(res, v.scope === "project"
        ? repos.documents.listByProject(v.scopeId)
        : repos.documents.listByKnowledgeBase(v.scopeId));
      return;
    }
    ok(res, repos.documents.list());
  }

  async function handleDocumentGet(req, res, { params }) {
    const id = parseId(params.id);
    const doc = repos.documents.get(id);
    if (!doc) { notFound(res, "document not found: " + id); return; }
    ok(res, doc);
  }

  async function handleReindex(req, res, { params }) {
    const id = parseId(params.id);
    const doc = repos.documents.get(id);
    if (!doc) throw new ApiError(404, "NOT_FOUND", "document not found: " + id);
    repos.documents.updateIndexState(id, { status: "parsing", error: null, indexedAt: null });
    queue.enqueue({
      documentId: id,
      filePath: join(dataDir, "files", doc.sha256),
      originalName: doc.originalName,
      mimeType: doc.mimeType,
    });
    ok(res, { document: repos.documents.get(id), queued: true }, 202);
  }

  async function handleKnowledgeBaseReindex(req, res, { params }) {
    const knowledgeBaseId = parseId(params.id);
    if (!repos.knowledgeBases.get(knowledgeBaseId)) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + knowledgeBaseId);
    const queued = repos.documents.listByKnowledgeBase(knowledgeBaseId).map((doc) => {
      repos.documents.updateIndexState(doc.id, { status: "parsing", error: null, indexedAt: null });
      queue.enqueue({
        documentId: doc.id,
        filePath: join(dataDir, "files", doc.sha256),
        originalName: doc.originalName,
        mimeType: doc.mimeType,
      });
      return doc.id;
    });
    ok(res, { knowledgeBaseId, queued, count: queued.length }, 202);
  }

  async function handleUnlink(req, res, { params }) {
    const id = parseId(params.id);
    const doc = repos.documents.get(id);
    if (!doc) throw new ApiError(404, "NOT_FOUND", "document not found: " + id);
    const { scope, scopeId } = validateScope(params.scope, params.scopeId == null ? NaN : Number(params.scopeId));
    const removed = repos.documents.unlink({ documentId: id, scope, scopeId });
    ok(res, { removed });
  }

  // ----- search -----

  async function handleSearch(req, res) {
    const body = await readJsonBody(req);
    const scope = body.scope;
    const scopeId = body.scopeId;
    const { scopeId: validScopeId } = validateScope(scope, scopeId);
    const entity = scope === "project"
      ? repos.projects.get(validScopeId)
      : repos.knowledgeBases.get(validScopeId);
    if (!entity) {
      throw new ApiError(404, "NOT_FOUND", scope + " not found: " + validScopeId);
    }
    const query = body.query;
    if (typeof query !== "string" || query.trim() === "") {
      throw new ApiError(422, "INVALID_QUERY", "query must be a non-empty string");
    }
    const limit = body.limit === undefined ? 8 : body.limit;
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 8) {
      throw new ApiError(422, "INVALID_LIMIT", "limit must be an integer in [1, 8]");
    }
    const results = await retriever.search({ query, scope, scopeId: validScopeId, limit });
    ok(res, results);
  }

  // ----- run endpoints -----

  async function handleScheduleRun(req, res, { params }) {
    const id = parseId(params.id);
    const schedule = repos.schedules.get(id);
    if (!schedule) throw new ApiError(404, "NOT_FOUND", "schedule not found: " + id);
    if (!hasRunSchedule) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "schedule run service is not available");
    }
    const result = await services.runSchedule(schedule);
    ok(res, result);
  }

  async function handleSummaryRun(req, res) {
    const body = await readJsonBody(req);
    const projectId = requirePositiveInt(body, "projectId");
    const project = repos.projects.get(projectId);
    if (!project) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    // No summaryDate => pass null and let the Task 9 service decide the local day.
    const summaryDate = optionalDate(body, "summaryDate");
    if (!hasRunSummary) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "summary run service is not available");
    }
    const result = await services.runSummary({ projectId, summaryDate });
    ok(res, result);
  }

  // ----- projects / knowledge-bases / collections -----

  async function handleProjectsList(req, res) {
    ok(res, repos.projects.list().map((project) => {
      const recentSession = repos.workbenchSessions.latest({ scopeKind: "project", scopeId: project.id });
      return recentSession ? { ...project, recentSession } : project;
    }));
  }

  async function handleProjectCreate(req, res) {
    const body = await readJsonBody(req);
    const name = requireString(body, "name");
    const pathValue = optionalString(body, "path");
    const workspaceId = optionalString(body, "workspaceId");
    ok(res, repos.projects.create({ name, path: pathValue, workspaceId }), 201);
  }

  async function handleProjectPatch(req, res, { params }) {
    const id = parseId(params.id);
    if (!repos.projects.get(id)) throw new ApiError(404, "NOT_FOUND", "project not found: " + id);
    const body = await readJsonBody(req);
    const name = requireString(body, "name").trim();
    ok(res, repos.projects.update({ id, name }));
  }

  async function handleProjectDelete(req, res, { params }) {
    const id = parseId(params.id);
    if (!repos.projects.get(id)) throw new ApiError(404, "NOT_FOUND", "project not found: " + id);
    const plan = typeof services.deleteProject === "function"
      ? await services.deleteProject(id)
      : repos.projects.removeCascade(id);
    ok(res, {
      removed: true,
      projectId: id,
      orphanDocumentIds: (plan?.orphanDocuments || []).map((document) => document.id),
    });
  }

  async function handleKnowledgeBasesList(req, res) {
    ok(res, repos.knowledgeBases.list().map((knowledgeBase) => {
      const recentSession = repos.workbenchSessions.latest({ scopeKind: "knowledge_base", scopeId: knowledgeBase.id });
      return recentSession ? { ...knowledgeBase, recentSession } : knowledgeBase;
    }));
  }

  async function handleKnowledgeBaseCreate(req, res) {
    const body = await readJsonBody(req);
    const name = requireString(body, "name");
    const description = optionalString(body, "description");
    ok(res, repos.knowledgeBases.create({ name, description }), 201);
  }

  async function handleKnowledgeBaseDelete(req, res, { params }) {
    const id = parseId(params.id);
    if (!repos.knowledgeBases.get(id)) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + id);
    const plan = typeof services.deleteKnowledgeBase === "function"
      ? await services.deleteKnowledgeBase(id)
      : repos.knowledgeBases.removeCascade(id);
    ok(res, {
      removed: true,
      knowledgeBaseId: id,
      orphanDocumentIds: (plan?.orphanDocuments || []).map((document) => document.id),
    });
  }

  async function handleTodosList(req, res, { url }) {
    const projectId = queryPositiveInt(url.searchParams.get("projectId"), "projectId");
    ok(res, repos.todos.list({ projectId }));
  }

  async function handleTodoCreate(req, res) {
    const body = await readJsonBody(req);
    const projectId = requirePositiveInt(body, "projectId");
    if (!repos.projects.get(projectId)) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    const title = requireString(body, "title");
    const dueAt = requireDateTime(body);
    const source = body.source === undefined ? "manual" : requireString(body, "source");
    if (!["manual", "auto"].includes(source)) throw new ApiError(422, "INVALID_SOURCE", "source must be manual or auto");
    ok(res, repos.todos.create({ projectId, title, dueAt, source }), 201);
  }

  async function handleTodoPatch(req, res) {
    const body = await readJsonBody(req);
    const id = requirePositiveInt(body, "id");
    const patch = {};
    if (body.title !== undefined) patch.title = requireString(body, "title");
    if (body.dueAt !== undefined) patch.dueAt = requireDateTime(body);
    if (body.done !== undefined) {
      if (typeof body.done !== "boolean") throw new ApiError(422, "INVALID_FIELD", "done must be a boolean");
      patch.done = body.done;
    }
    const updated = repos.todos.update({ id, ...patch });
    if (!updated) { notFound(res, "todo not found: " + id); return; }
    ok(res, updated);
  }

  function requireSettings() {
    if (!settings) throw new ApiError(501, "NOT_IMPLEMENTED", "Workbench settings service is not available");
    return settings;
  }

  async function handleEmbeddingSettings(req, res) {
    const config = requireSettings().get("embedding");
    const credential = await describeCredential(config.credentialRef);
    ok(res, { ...config, credential });
  }

  async function describeCredential(ref) {
    if (!ref || typeof credentials?.describe !== "function") return { configured: false, source: null, readOnly: true };
    const info = await credentials.describe(ref);
    return { configured: Boolean(info?.configured), source: info?.source ?? null, readOnly: info?.writable === false };
  }

  async function handleEmbeddingPatch(req, res) {
    const body = await readJsonBody(req);
    if (typeof embeddingFactory !== "function") throw new ApiError(501, "NOT_IMPLEMENTED", "embedding adapter is not available");
    const config = { ...requireSettings().get("embedding"), ...body };
    try {
      await embeddingFactory(config).health();
    } catch (error) {
      throw new ApiError(502, error?.code || "EMBEDDING_TEST_FAILED", error instanceof Error ? error.message : "embedding connection test failed");
    }
    const workbenchSettings = requireSettings();
    const previous = workbenchSettings.get("embedding");
    const next = workbenchSettings.set("embedding", body);
    try {
      if (typeof onEmbeddingConfigChange === "function") await onEmbeddingConfigChange(next, previous);
    } catch (error) {
      // PATCH is a merge for normal callers; rollback must restore the exact
      // preflight document so a failed reconcile cannot leave a half-commit.
      repos.settings.set("embedding", previous);
      try { if (typeof onEmbeddingConfigChange === "function") await onEmbeddingConfigChange(previous, next); } catch { /* keep the durable setting rollback */ }
      throw new ApiError(502, error?.code || "EMBEDDING_RECONFIGURE_FAILED", error instanceof Error ? error.message : "embedding reconfiguration failed");
    }
    ok(res, { ...next, credential: await describeCredential(next.credentialRef) });
  }

  async function handleEmbeddingTest(req, res) {
    const body = await readJsonBody(req);
    const config = { ...requireSettings().get("embedding"), ...body };
    if (typeof embeddingFactory !== "function") throw new ApiError(501, "NOT_IMPLEMENTED", "embedding adapter is not available");
    const result = await embeddingFactory(config).health();
    ok(res, result);
  }

  async function handleIndexStatus(req, res) {
    const documents = repos.documents.list();
    const counts = Object.fromEntries(["uploading", "parsing", "embedding", "ready", "stale", "failed"].map((status) => [status, documents.filter((doc) => doc.status === status).length]));
    ok(res, { status: counts.stale || counts.failed ? "stale" : "ready", counts, identity: embeddingIdentity(requireSettings().get("embedding")), metadata: repos.documentIndexMetadata.list(), credential: await describeCredential(requireSettings().get("embedding").credentialRef) });
  }

  async function handleIndexReindex(req, res) {
    const queued = repos.documents.list().map((doc) => {
      repos.documents.updateIndexState(doc.id, { status: "parsing", error: null, indexedAt: null });
      queue.enqueue({ documentId: doc.id, filePath: join(dataDir, "files", doc.sha256), originalName: doc.originalName, mimeType: doc.mimeType });
      return doc.id;
    });
    ok(res, { queued, count: queued.length }, 202);
  }

  async function handleTimezoneSettings(req, res) { ok(res, { timezone: requireSettings().get("timezone") }); }

  async function handleTimezonePatch(req, res) {
    const body = await readJsonBody(req);
    if (typeof body.timezone !== "string") throw new ApiError(422, "INVALID_TIMEZONE", "timezone must be an IANA time zone ID");
    ok(res, { timezone: requireSettings().set("timezone", body.timezone) });
  }

  async function handleNetworkSettings(req, res) {
    ok(res, describeNetworkState(requireSettings().get("network"), networkEnv));
  }

  async function handleNetworkPatch(req, res) {
    const body = await readJsonBody(req);
    const next = normalizeNextLaunchNetwork({ ...requireSettings().get("network"), ...body });
    const saved = requireSettings().set("network", next);
    ok(res, describeNetworkState(saved, networkEnv));
  }

  async function handleNetworkTest(req, res) {
    const body = await readJsonBody(req);
    const current = requireSettings().get("network");
    // The test target is selected by the configured embedding adapter or the
    // DSH provider adapter. Ignore arbitrary request URLs so this endpoint
    // cannot become a generic SSRF probe.
    const next = normalizeNextLaunchNetwork({
      mode: body.mode ?? current.mode,
      proxyUrl: body.proxyUrl ?? current.proxyUrl,
      noProxy: body.noProxy ?? current.noProxy,
    });
    const currentEffective = describeCurrentNetwork(networkEnv);
    const nextLaunchValidation = {
      ...next,
      proxyConfigured: Boolean(next.proxyUrl),
      requiresRestart: JSON.stringify(networkShape(currentEffective)) !== JSON.stringify(nextLaunchShape(next, networkEnv)),
    };
    if (typeof embeddingFactory !== "function") throw new ApiError(503, "EMBEDDING_UNAVAILABLE", "embedding adapter is not available");
    let embedding;
    try { embedding = await embeddingFactory(requireSettings().get("embedding")).health(); }
    catch (error) { throw new ApiError(502, error?.code || "EMBEDDING_TEST_FAILED", error instanceof Error ? error.message : "embedding connection test failed"); }
    const providerTest = dshAdapter?.providerTest ?? dshAdapter?.testProvider ?? dshAdapter?.testNetwork;
    if (typeof providerTest !== "function") throw new ApiError(503, "PROVIDER_UNAVAILABLE", "DSH provider network adapter is not available");
    let provider;
    try { provider = await providerTest.call(dshAdapter, { network: currentEffective }); }
    catch (error) { throw new ApiError(502, error?.code || "PROVIDER_TEST_FAILED", error instanceof Error ? error.message : "DSH provider connection test failed"); }
    ok(res, { currentTests: { embedding, provider }, nextLaunchValidation });
  }

  async function handleAuthStatus(req, res) {
    if (typeof codexAuth?.status !== "function") {
      ok(res, { provider: "openai-codex", configured: false, source: null, readOnly: true, canConnect: false, activation: "next-request" });
      return;
    }
    ok(res, await codexAuth.status());
  }

  async function handleAuthTest(req, res) {
    if (typeof codexAuth?.test !== "function") throw new ApiError(501, "CODEX_AUTH_UNAVAILABLE", "Codex auth service is not available");
    try { ok(res, await codexAuth.test()); }
    catch (error) {
      if (Number.isInteger(error?.status) && typeof error?.code === "string") throw new ApiError(error.status, error.code, error.message);
      throw error;
    }
  }

  async function handleCodexAuthConnect(req, res) {
    if (typeof codexAuth?.connect !== "function") throw new ApiError(501, "CODEX_AUTH_UNAVAILABLE", "Codex auth service is not available");
    try { ok(res, await codexAuth.connect()); }
    catch (error) {
      if (Number.isInteger(error?.status) && typeof error?.code === "string") throw new ApiError(error.status, error.code, error.message);
      throw error;
    }
  }

  async function handleCredentialPut(req, res) {
    const body = await readJsonBody(req);
    const ref = requireString(body, "credentialRef");
    const value = requireString(body, "value");
    if (!credentials?.set) throw new ApiError(501, "NOT_IMPLEMENTED", "DSH credentials service is not available");
    await credentials.set(ref, value);
    ok(res, { credentialRef: ref, configured: true });
  }

  async function handleCredentialDelete(req, res, { params }) {
    if (!credentials?.unset) throw new ApiError(501, "NOT_IMPLEMENTED", "DSH credentials service is not available");
    const body = params.ref ? {} : await readJsonBody(req);
    const ref = params.ref || requireString(body, "credentialRef");
    await credentials.unset(ref);
    ok(res, { credentialRef: ref, configured: false });
  }

  async function handleSchedulesList(req, res, { url }) {
    const projectId = queryPositiveInt(url.searchParams.get("projectId"), "projectId");
    ok(res, repos.schedules.list({ projectId }).map((schedule) => withNextRun(schedule, configuredTimeZone())));
  }

  async function handleScheduleCreate(req, res) {
    const body = await readJsonBody(req);
    const projectId = requirePositiveInt(body, "projectId");
    if (!repos.projects.get(projectId)) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    const name = requireString(body, "name");
    const recurrence = requireString(body, "recurrence");
    if (!["once", "daily", "weekly", "monthly"].includes(recurrence)) {
      throw new ApiError(422, "INVALID_RECURRENCE", "recurrence must be once, daily, weekly, or monthly");
    }
    const startsAt = requireDateTime(body, "startsAt");
    const rule = scheduleRuleFromInput({ recurrence, startsAt }, configuredTimeZone());
    const prompt = optionalString(body, "prompt");
    const enabled = body.enabled === undefined ? true : body.enabled;
    if (typeof enabled !== "boolean") {
      throw new ApiError(422, "INVALID_FIELD", "enabled must be a boolean");
    }
    ok(res, withNextRun(repos.schedules.create({ projectId, name, rule, recurrence, startsAt, prompt, enabled }), configuredTimeZone()), 201);
  }

  async function handleSchedulePatch(req, res) {
    const body = await readJsonBody(req);
    const id = requirePositiveInt(body, "id");
    const current = repos.schedules.get(id);
    if (!current) { notFound(res, "schedule not found: " + id); return; }
    const patch = {};
    if (body.name !== undefined) patch.name = requireString(body, "name");
    if (body.prompt !== undefined) patch.prompt = optionalString(body, "prompt");
    if (body.recurrence !== undefined || body.startsAt !== undefined) {
      const recurrence = body.recurrence === undefined ? current.recurrence : requireString(body, "recurrence");
      if (!["once", "daily", "weekly", "monthly"].includes(recurrence)) {
        throw new ApiError(422, "INVALID_RECURRENCE", "recurrence must be once, daily, weekly, or monthly");
      }
      const startsAt = body.startsAt === undefined ? current.startsAt : requireDateTime(body, "startsAt");
      if (!startsAt) throw new ApiError(422, "INVALID_DATETIME", "startsAt must be a valid ISO 8601 date-time");
      patch.recurrence = recurrence;
      patch.startsAt = startsAt;
      patch.rule = scheduleRuleFromInput({ recurrence, startsAt }, configuredTimeZone());
    }
    if (body.enabled !== undefined) {
      if (typeof body.enabled !== "boolean") {
        throw new ApiError(422, "INVALID_FIELD", "enabled must be a boolean");
      }
      patch.enabled = body.enabled;
    }
    const updated = repos.schedules.update({ id, ...patch });
    ok(res, withNextRun(updated, configuredTimeZone()));
  }

  async function handleScheduleDelete(req, res, { params }) {
    const id = parseId(params.id);
    if (!repos.schedules.remove(id)) { notFound(res, "schedule not found: " + id); return; }
    ok(res, { removed: true, id });
  }

  async function handleScheduleRuns(req, res, { params }) {
    const id = parseId(params.id);
    if (!repos.schedules.get(id)) { notFound(res, "schedule not found: " + id); return; }
    ok(res, repos.schedules.listRuns(id));
  }

  async function handleSummariesList(req, res, { url }) {
    const projectId = queryPositiveInt(url.searchParams.get("projectId"), "projectId");
    ok(res, repos.summaries.list({ projectId }));
  }

  async function handleAutomationGet(req, res, { params }) {
    const projectId = parseId(params.projectId);
    if (!repos.projects.get(projectId)) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    ok(res, repos.automation?.get?.(projectId) ?? { projectId, summaryEnabled: true, nextDayTodosEnabled: true });
  }

  async function handleAutomationPatch(req, res, { params }) {
    const projectId = parseId(params.projectId);
    if (!repos.projects.get(projectId)) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    const body = await readJsonBody(req);
    const patch = { projectId };
    for (const field of ["summaryEnabled", "nextDayTodosEnabled"]) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "boolean") throw new ApiError(422, "INVALID_FIELD", field + " must be a boolean");
        patch[field] = body[field];
      }
    }
    if (Object.keys(patch).length === 1) throw new ApiError(422, "INVALID_FIELD", "provide summaryEnabled or nextDayTodosEnabled");
    ok(res, repos.automation?.update?.(patch) ?? patch);
  }

  async function handleKnowledgeChatsList(req, res, { url }) {
    const kbRaw = url.searchParams.get("knowledgeBaseId");
    if (kbRaw != null) {
      const knowledgeBaseId = queryPositiveInt(kbRaw, "knowledgeBaseId");
      if (!repos.knowledgeBases.get(knowledgeBaseId)) {
        throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + knowledgeBaseId);
      }
      ok(res, repos.knowledgeChats.listByKnowledgeBase(knowledgeBaseId));
      return;
    }
    ok(res, repos.knowledgeChats.list());
  }

  async function handleKnowledgeChatCreate(req, res) {
    const body = await readJsonBody(req);
    const knowledgeBaseId = requirePositiveInt(body, "knowledgeBaseId");
    if (!repos.knowledgeBases.get(knowledgeBaseId)) {
      throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + knowledgeBaseId);
    }
    const title = optionalString(body, "title");
    ok(res, repos.knowledgeChats.create({ knowledgeBaseId, title }), 201);
  }

  // ----- project <-> knowledge-base association -----

  async function handleProjectKbs(req, res, { params }) {
    const projectId = parseId(params.projectId);
    if (!repos.projects.get(projectId)) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    ok(res, repos.projectKnowledgeBases.listByProject(projectId));
  }

  async function handleProjectKbLink(req, res, { params }) {
    const projectId = parseId(params.projectId);
    const knowledgeBaseId = parseId(params.knowledgeBaseId);
    if (!repos.projects.get(projectId)) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    if (!repos.knowledgeBases.get(knowledgeBaseId)) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + knowledgeBaseId);
    ok(res, repos.projectKnowledgeBases.link({ projectId, knowledgeBaseId }), 201);
  }

  async function handleProjectKbUnlink(req, res, { params }) {
    const projectId = parseId(params.projectId);
    const knowledgeBaseId = parseId(params.knowledgeBaseId);
    if (!repos.projects.get(projectId)) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    if (!repos.knowledgeBases.get(knowledgeBaseId)) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + knowledgeBaseId);
    const removed = repos.projectKnowledgeBases.unlink({ projectId, knowledgeBaseId });
    ok(res, { removed });
  }

  async function handleHealth(req, res) {
    const report = await ollama.health();
    ok(res, { ok: true, ...report });
  }

  // ----- chat sessions / prompts -----

  async function handleChatSessionCreate(req, res) {
    if (!hasSessions) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session service is not available");
    }
    const body = await readJsonBody(req);
    const projectId = body.projectId === undefined ? undefined : requirePositiveInt(body, "projectId");
    const knowledgeBaseId = body.knowledgeBaseId === undefined ? undefined : requirePositiveInt(body, "knowledgeBaseId");
    if (projectId !== undefined && knowledgeBaseId !== undefined) {
      throw new ApiError(422, "INVALID_SCOPE", "provide at most one of projectId or knowledgeBaseId");
    }
    const title = optionalString(body, "title");
    const chatId = body.chatId === undefined ? undefined : requirePositiveInt(body, "chatId");
    const resumeSessionId = optionalString(body, "resumeSessionId");
    const input = { title };
    if (projectId !== undefined) input.projectId = projectId;
    if (knowledgeBaseId !== undefined) input.knowledgeBaseId = knowledgeBaseId;
    if (chatId !== undefined) input.chatId = chatId;
    if (resumeSessionId != null) input.resumeSessionId = resumeSessionId;
    const result = await sessions.createSession(input);
    ok(res, result, 201);
  }

  async function handleChatSessionList(req, res, { url }) {
    const projectId = url.searchParams.get("projectId");
    const knowledgeBaseId = url.searchParams.get("knowledgeBaseId");
    if (projectId != null && knowledgeBaseId != null) {
      throw new ApiError(422, "INVALID_SCOPE", "provide at most one of projectId or knowledgeBaseId");
    }
    if (projectId != null) {
      const id = parseId(projectId);
      if (!repos.projects.get(id)) throw new ApiError(404, "NOT_FOUND", "project not found: " + id);
      ok(res, repos.workbenchSessions.list({ scopeKind: "project", scopeId: id }));
      return;
    }
    if (knowledgeBaseId != null) {
      const id = parseId(knowledgeBaseId);
      if (!repos.knowledgeBases.get(id)) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + id);
      ok(res, repos.workbenchSessions.list({ scopeKind: "knowledge_base", scopeId: id }));
      return;
    }

    const limit = Math.min(queryPositiveInt(url.searchParams.get("limit"), "limit") ?? 8, 100);
    const offset = queryNonNegativeInt(url.searchParams.get("offset"), "offset", 0);
    const query = url.searchParams.get("query") ?? "";
    const scopeKind = url.searchParams.get("context");
    if (scopeKind != null && !["project", "knowledge_base", "independent"].includes(scopeKind)) {
      throw new ApiError(422, "INVALID_SCOPE", "context must be project, knowledge_base, or independent");
    }
    ok(res, {
      items: repos.workbenchSessions.listAll({ scopeKind, query, limit, offset }),
      total: repos.workbenchSessions.countAll({ scopeKind, query }),
      limit,
      offset,
    });
  }

  async function handleChatPromptCreate(req, res) {
    if (!hasSessions) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session service is not available");
    }
    const body = await readJsonBody(req);
    const sessionId = requireString(body, "sessionId");
    const question = requireString(body, "question");
    const projectId = body.projectId === undefined ? undefined : requirePositiveInt(body, "projectId");
    const knowledgeBaseId = body.knowledgeBaseId === undefined ? undefined : requirePositiveInt(body, "knowledgeBaseId");
    if (projectId !== undefined && knowledgeBaseId !== undefined) {
      throw new ApiError(422, "INVALID_SCOPE", "provide at most one of projectId or knowledgeBaseId");
    }
    const input = { sessionId, question };
    if (projectId !== undefined) input.projectId = projectId;
    if (knowledgeBaseId !== undefined) input.knowledgeBaseId = knowledgeBaseId;
    const result = await sessions.submitPrompt(input);
    ok(res, result);
  }

  // ----- dispatcher (single source of truth for the approved surface) -----

  const routes = [
    { pattern: "/health", methods: { GET: handleHealth } },
    { pattern: "/chat/sessions", methods: { GET: handleChatSessionList, POST: handleChatSessionCreate } },
    { pattern: "/chat/prompts", methods: { POST: handleChatPromptCreate } },
    { pattern: "/projects", methods: { GET: handleProjectsList, POST: handleProjectCreate } },
    { pattern: "/projects/:id", methods: { PATCH: handleProjectPatch, DELETE: handleProjectDelete } },
    { pattern: "/knowledge-bases", methods: { GET: handleKnowledgeBasesList, POST: handleKnowledgeBaseCreate } },
    { pattern: "/knowledge-bases/:id", methods: { DELETE: handleKnowledgeBaseDelete } },
    { pattern: "/documents", methods: { GET: handleDocumentsList, POST: handleUpload } },
    { pattern: "/documents/:id/reindex", methods: { POST: handleReindex } },
    { pattern: "/knowledge-bases/:id/reindex", methods: { POST: handleKnowledgeBaseReindex } },
    { pattern: "/documents/:id/links/:scope/:scopeId", methods: { DELETE: handleUnlink } },
    { pattern: "/documents/:id", methods: { GET: handleDocumentGet } },
    { pattern: "/search", methods: { POST: handleSearch } },
    { pattern: "/todos", methods: { GET: handleTodosList, POST: handleTodoCreate, PATCH: handleTodoPatch } },
    { pattern: "/schedules", methods: { GET: handleSchedulesList, POST: handleScheduleCreate, PATCH: handleSchedulePatch } },
    { pattern: "/schedules/:id", methods: { DELETE: handleScheduleDelete } },
    { pattern: "/schedules/:id/runs", methods: { GET: handleScheduleRuns } },
    { pattern: "/schedules/:id/run", methods: { POST: handleScheduleRun } },
    { pattern: "/summaries", methods: { GET: handleSummariesList } },
    { pattern: "/summaries/run", methods: { POST: handleSummaryRun } },
    { pattern: "/projects/:projectId/automation", methods: { GET: handleAutomationGet, PATCH: handleAutomationPatch } },
    { pattern: "/knowledge-chats", methods: { GET: handleKnowledgeChatsList, POST: handleKnowledgeChatCreate } },
    { pattern: "/projects/:projectId/knowledge-bases", methods: { GET: handleProjectKbs } },
    { pattern: "/projects/:projectId/knowledge-bases/:knowledgeBaseId", methods: { POST: handleProjectKbLink, DELETE: handleProjectKbUnlink } },
    { pattern: "/settings/embedding", methods: { GET: handleEmbeddingSettings, PATCH: handleEmbeddingPatch } },
    { pattern: "/settings/embedding/test", methods: { POST: handleEmbeddingTest } },
    { pattern: "/settings/index", methods: { GET: handleIndexStatus } },
    { pattern: "/settings/index/reindex", methods: { POST: handleIndexReindex } },
    { pattern: "/settings/embedding/credential", methods: { PUT: handleCredentialPut, DELETE: handleCredentialDelete } },
    { pattern: "/settings/timezone", methods: { GET: handleTimezoneSettings, PATCH: handleTimezonePatch } },
    { pattern: "/settings/network", methods: { GET: handleNetworkSettings, PATCH: handleNetworkPatch } },
    { pattern: "/settings/network/test", methods: { POST: handleNetworkTest } },
    { pattern: "/settings/auth/status", methods: { GET: handleAuthStatus } },
    { pattern: "/settings/auth/test", methods: { POST: handleAuthTest } },
    { pattern: "/settings/auth/codex/connect", methods: { POST: handleCodexAuthConnect } },
  ];

  async function dispatch(req, res, url) {
    const path = subPath(url.pathname);
    const method = req.method.toUpperCase();
    const allowed = [];
    for (const route of routes) {
      const params = matchParams(path, route.pattern);
      if (params) {
        for (const m of Object.keys(route.methods)) allowed.push(m);
        const handler = route.methods[method];
        if (handler) {
          await handler(req, res, { params, url });
          return;
        }
      }
    }
    if (allowed.length > 0) {
      methodNotAllowed(res, [...new Set(allowed)]);
      return;
    }
    notFound(res);
  }

  async function handler(req, res) {
    try {
      const url = new URL(req.url ?? "/", "http://x");
      await dispatch(req, res, url);
    } catch (err) {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      const apiError = toApiError(err);
      if (shouldLogError(apiError, err)) logError(err);
      fail(res, apiError.status, apiError.code, apiError.message);
    }
  }

  return {
    handler,
    /** Register the single prefix route; returns the route disposer. */
    register(webServer) {
      return webServer.register({ kind: "prefix", path: API_PREFIX, handler });
    },
  };
}
