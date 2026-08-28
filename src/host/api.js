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
import { readFile } from "node:fs/promises";

import { saveFile, FileStorageError, FILE_ERROR_CODES } from "./files.js";
import { RetrievalError } from "./retrieval.js";
import { WorkbenchSessionError, SESSION_ERROR_CODES } from "./session-errors.js";
import { ContextSourceError } from "./context.js";
import { SkillManagerError, SKILL_ERROR_CODES, SKILL_PACKAGE_LIMITS } from "./skill-package.js";
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
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    if (details !== undefined) this.details = details;
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
  [SESSION_ERROR_CODES.DRAFT_ACTIVATION_FAILED]: 502,
  [SESSION_ERROR_CODES.DRAFT_NOT_RETRYABLE]: 409,
  [SESSION_ERROR_CODES.CONTEXT_SOURCE_UNAVAILABLE]: 422,
  [SESSION_ERROR_CODES.SESSION_RENAME_FAILED]: 500,
  [SESSION_ERROR_CODES.SESSION_DELETE_FAILED]: 500,
  [SESSION_ERROR_CODES.SESSION_DELETE_UNAVAILABLE]: 501,
  [SESSION_ERROR_CODES.SESSION_RESUME_FAILED]: 500,
};

const SKILL_ERROR_STATUS = {
  [SKILL_ERROR_CODES.INVALID_SCOPE]: 422,
  [SKILL_ERROR_CODES.PROJECT_NOT_FOUND]: 404,
  [SKILL_ERROR_CODES.PROJECT_PATH_UNAVAILABLE]: 422,
  [SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE]: 413,
  [SKILL_ERROR_CODES.ARCHIVE_UNSAFE]: 422,
  [SKILL_ERROR_CODES.PACKAGE_INVALID]: 422,
  [SKILL_ERROR_CODES.NAME_INVALID]: 422,
  [SKILL_ERROR_CODES.CONFLICT]: 409,
  [SKILL_ERROR_CODES.STATE_CONFLICT]: 409,
  [SKILL_ERROR_CODES.NOT_FOUND]: 404,
  [SKILL_ERROR_CODES.PERMISSION_DENIED]: 403,
  [SKILL_ERROR_CODES.RECOVERY_REQUIRED]: 409,
  [SKILL_ERROR_CODES.FILE_MANAGER_UNAVAILABLE]: 501,
};

const SKILL_ERROR_MESSAGES = {
  [SKILL_ERROR_CODES.INVALID_SCOPE]: "Skill 作用域无效",
  [SKILL_ERROR_CODES.PROJECT_NOT_FOUND]: "项目不存在",
  [SKILL_ERROR_CODES.PROJECT_PATH_UNAVAILABLE]: "项目目录不可用",
  [SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE]: "Skill ZIP 超过大小限制",
  [SKILL_ERROR_CODES.ARCHIVE_UNSAFE]: "Skill ZIP 未通过安全校验",
  [SKILL_ERROR_CODES.PACKAGE_INVALID]: "Skill 包格式无效",
  [SKILL_ERROR_CODES.NAME_INVALID]: "Skill 名称无效",
  [SKILL_ERROR_CODES.CONFLICT]: "Skill 已存在",
  [SKILL_ERROR_CODES.STATE_CONFLICT]: "Skill 状态冲突",
  [SKILL_ERROR_CODES.NOT_FOUND]: "Skill 不存在",
  [SKILL_ERROR_CODES.PERMISSION_DENIED]: "Skill 目录无权访问",
  [SKILL_ERROR_CODES.RECOVERY_REQUIRED]: "Skill 事务需要人工恢复",
  [SKILL_ERROR_CODES.FILE_MANAGER_UNAVAILABLE]: "文件管理器不可用",
};

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ------------------------------------------------------------- small helpers

function isPositiveInt(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function normalizeSessionScope(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(422, "INVALID_SCOPE", "scope is required");
  }
  if (!["project", "knowledge_base", "independent"].includes(value.kind)) {
    throw new ApiError(422, "INVALID_SCOPE", "scope.kind must be project, knowledge_base, or independent");
  }
  if (value.kind === "independent") {
    if (value.id !== undefined && value.id !== null) {
      throw new ApiError(422, "INVALID_SCOPE", "independent scope cannot have an id");
    }
    return { kind: "independent", id: null };
  }
  if (!isPositiveInt(value.id)) {
    throw new ApiError(422, "INVALID_SCOPE", value.kind + " scope requires a positive id");
  }
  return { kind: value.kind, id: value.id };
}

function optionalSourceList(body, field) {
  const value = body[field];
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new ApiError(422, "INVALID_FIELD", field + " must be an array");
  return value;
}

function normalizeContextSource(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(422, "INVALID_CONTEXT_SOURCE", "source is required");
  }
  if (!["knowledge_base", "workspace_file", "uploaded_file", "session"].includes(value.kind)) {
    throw new ApiError(422, "INVALID_CONTEXT_SOURCE", "invalid context source kind");
  }
  const id = String(value.id ?? "").trim();
  if (!id) throw new ApiError(422, "INVALID_CONTEXT_SOURCE", "context source id is required");
  return { kind: value.kind, id };
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

function originalFileHeaders(document, download) {
  const encodedName = encodeURIComponent(document.originalName).replace(/'/g, "%27");
  const fallbackName = document.originalName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  return {
    "content-type": document.mimeType || "application/octet-stream",
    "content-disposition": `${download ? "attachment" : "inline"}; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`,
    "content-security-policy": "sandbox; default-src 'none'",
    "x-content-type-options": "nosniff",
    "cache-control": "private, no-store",
  };
}

function fail(res, status, code, message, details) {
  sendJson(res, status, { error: { code, message, ...(details === undefined ? {} : { details }) } });
}

function safeSessionErrorDetails(error) {
  if (error?.code !== SESSION_ERROR_CODES.DRAFT_ACTIVATION_FAILED || !error.details) return undefined;
  const { sessionId, lifecycleStatus, pendingQuestion } = error.details;
  if (typeof sessionId !== "string" || lifecycleStatus !== "draft_failed" || typeof pendingQuestion !== "string") return undefined;
  return { sessionId, lifecycleStatus, pendingQuestion };
}

function safeSkillSummary(value) {
  if (!value || typeof value !== "object") return undefined;
  const summary = {};
  for (const field of ["name", "description", "state", "health", "fileCount", "sourceName"]) {
    if (typeof value[field] === "string" || Number.isSafeInteger(value[field])) summary[field] = value[field];
  }
  return Object.keys(summary).length > 0 ? summary : undefined;
}

function safeSkillErrorDetails(error) {
  const details = error?.details;
  if (!details || typeof details !== "object" || Array.isArray(details)) return undefined;
  if (error.code === SKILL_ERROR_CODES.CONFLICT) {
    const existing = safeSkillSummary(details.existing);
    const incoming = safeSkillSummary(details.incoming);
    return existing || incoming ? { ...(existing ? { existing } : {}), ...(incoming ? { incoming } : {}) } : undefined;
  }
  const safe = {};
  if (Number.isSafeInteger(details.bytes)) safe.bytes = details.bytes;
  if (Number.isSafeInteger(details.limit)) safe.limit = details.limit;
  if (typeof details.name === "string" && SKILL_NAME_PATTERN.test(details.name)) safe.name = details.name;
  if (typeof details.id === "string" && details.id.length <= 128 && /^[A-Za-z0-9-]+$/.test(details.id)) safe.id = details.id;
  if (typeof details.operation === "string" && /^[a-z]+$/.test(details.operation)) safe.operation = details.operation;
  return Object.keys(safe).length > 0 ? safe : undefined;
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
  if (err instanceof ContextSourceError) {
    return new ApiError(422, err.code, err.message);
  }
  if (err instanceof WorkbenchSessionError) {
    return new ApiError(SESSION_ERROR_STATUS[err.code] ?? 500, err.code, err.message, safeSessionErrorDetails(err));
  }
  if (err instanceof SkillManagerError) {
    const status = SKILL_ERROR_STATUS[err.code];
    if (status === undefined) return new ApiError(500, "INTERNAL_ERROR", "internal server error");
    return new ApiError(status, err.code, SKILL_ERROR_MESSAGES[err.code] ?? "Skill 操作失败", safeSkillErrorDetails(err));
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

function discardRequestBody(req) {
  if (req.readableEnded || req.destroyed) return;
  let active = true;
  const cleanup = () => {
    if (!active) return;
    active = false;
    req.off?.("error", onError);
    req.off?.("end", cleanup);
    req.off?.("aborted", cleanup);
  };
  const onError = () => cleanup();
  req.once?.("error", onError);
  req.once?.("end", cleanup);
  req.once?.("aborted", cleanup);
  try {
    req.resume?.();
  } catch (error) {
    cleanup();
    throw error;
  }
}

/** Read a raw ZIP request body without buffering beyond the compressed limit. */
async function readRawBody(req, limit = SKILL_PACKAGE_LIMITS.archiveBytes) {
  const declared = req.headers["content-length"];
  if (declared != null && /^\d+$/.test(String(declared)) && Number(declared) > limit) {
    discardRequestBody(req);
    throw new ApiError(413, SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE, "Skill ZIP exceeds the byte limit");
  }
  return new Promise((resolvePromise, rejectPromise) => {
    const chunks = [];
    let total = 0;
    let settled = false;
    const discard = () => {
      // Keep the socket alive for the response while discarding the rest of
      // an oversized request. Defer the mode switch until data unwinds.
      setImmediate(() => {
        try { discardRequestBody(req); } catch { /* the request is already ending */ }
      });
    };
    const cleanup = () => {
      req.off?.("data", onData);
      req.off?.("end", onEnd);
      req.off?.("error", onError);
      req.off?.("aborted", onAborted);
    };
    const fail = (error, drain = false) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (drain) discard();
      rejectPromise(error);
    };
    const onData = (chunk) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += buf.byteLength;
      if (total > limit) {
        fail(new ApiError(413, SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE, "Skill ZIP exceeds the byte limit"), true);
        return;
      }
      chunks.push(buf);
    };
    const onEnd = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolvePromise(Buffer.concat(chunks, total));
    };
    const onError = (error) => fail(error);
    const onAborted = () => fail(new Error("request body was aborted"));
    req.on("data", onData);
    req.once("end", onEnd);
    req.once("error", onError);
    req.once("aborted", onAborted);
  });
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
 * @param {{ list: Function, importArchive: Function, setEnabled: Function, remove: Function, reveal: Function }} [deps.skills]
 * @param {{ runSchedule?: Function, runSummary?: Function }} [deps.services]
 * @param {{ error?: Function }} [deps.logger]
 */
export function createApi({ repos, queue, ollama, retriever, dataDir, services = {}, sessions, settings, embeddingFactory, onEmbeddingConfigChange, credentials, codexAuth, dshAdapter, skills, logger = console, networkEnv = process.env }) {
  if (!repos || !queue || !ollama || !retriever || typeof dataDir !== "string") {
    throw new Error("createApi requires repos, queue, ollama, retriever, and dataDir");
  }

  const hasRunSchedule = typeof services.runSchedule === "function";
  const hasRunSummary = typeof services.runSummary === "function";
  const hasSessions = typeof sessions?.materializeDraft === "function"
    && typeof sessions?.confirmDraft === "function"
    && typeof sessions?.renameSession === "function"
    && typeof sessions?.moveSession === "function"
    && typeof sessions?.deleteSession === "function";
  const hasSessionContext = typeof sessions?.getContext === "function"
    && typeof sessions?.setContext === "function"
    && typeof sessions?.removeContext === "function";
  const hasSessionArchive = typeof sessions?.archiveSession === "function"
    && typeof sessions?.restoreSession === "function";
  const maintenance = services.maintenance ?? null;
  const logError = typeof logger?.error === "function" ? logger.error.bind(logger) : () => {};
  const configuredTimeZone = () => settings?.get?.("timezone") ?? DEFAULT_TIME_ZONE;

  function requireSkillMethod(method) {
    if (typeof skills?.[method] !== "function") {
      throw new ApiError(501, "SKILL_MANAGER_UNAVAILABLE", "Skill 管理服务不可用");
    }
  }

  function parseSkillScope(scope, projectId) {
    if (scope !== "global" && scope !== "project") {
      throw new ApiError(422, SKILL_ERROR_CODES.INVALID_SCOPE, "scope must be global or project");
    }
    if (scope === "global") {
      if (projectId !== undefined) throw new ApiError(422, "INVALID_FIELD", "projectId is only valid for project scope");
      return { scope };
    }
    if (!isPositiveInt(projectId)) {
      throw new ApiError(422, "INVALID_FIELD", "projectId must be a positive integer");
    }
    return { scope, projectId };
  }

  function parseSkillQuery(url) {
    const allowed = new Set(["scope", "projectId"]);
    for (const key of url.searchParams.keys()) {
      if (!allowed.has(key)) throw new ApiError(422, "INVALID_FIELD", "unknown field: " + key);
      if (url.searchParams.getAll(key).length !== 1) {
        throw new ApiError(422, "INVALID_FIELD", key + " must be provided once");
      }
    }
    const scope = url.searchParams.get("scope");
    const projectIdRaw = url.searchParams.get("projectId");
    const projectId = projectIdRaw == null ? undefined : queryPositiveInt(projectIdRaw, "projectId");
    return parseSkillScope(scope, projectId);
  }

  function parseSkillJsonScope(body, fields) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ApiError(422, "INVALID_FIELD", "JSON body must be an object");
    }
    const allowed = new Set(fields);
    const unknownField = Object.keys(body).find((field) => !allowed.has(field));
    if (unknownField) throw new ApiError(422, "INVALID_FIELD", "unknown field: " + unknownField);
    const scope = body.scope;
    const projectId = body.projectId;
    if (projectId !== undefined && !isPositiveInt(projectId)) {
      throw new ApiError(422, "INVALID_FIELD", "projectId must be a positive integer");
    }
    return parseSkillScope(scope, projectId);
  }

  function parseSkillName(raw) {
    if (typeof raw !== "string" || !SKILL_NAME_PATTERN.test(raw)) {
      throw new ApiError(422, SKILL_ERROR_CODES.NAME_INVALID, "Skill name is not valid");
    }
    return raw;
  }

  function parseSkillFilename(raw) {
    if (typeof raw !== "string" || raw === "") {
      throw new ApiError(422, "INVALID_FILENAME", "x-cpwb-filename header is required");
    }
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded === "") throw new Error("empty");
      return decoded;
    } catch {
      throw new ApiError(422, "INVALID_FILENAME", "x-cpwb-filename is not valid URI encoding");
    }
  }

  function parseSkillImportHeaders(req) {
    const mediaType = String(req.headers["content-type"] ?? "").toLowerCase().trim();
    if (mediaType !== "application/zip") {
      throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/zip");
    }
    const scope = req.headers["x-cpwb-skill-scope"];
    const projectRaw = req.headers["x-cpwb-project-id"];
    let projectId;
    if (projectRaw !== undefined) {
      if (!/^[1-9]\d*$/.test(String(projectRaw))) {
        throw new ApiError(422, "INVALID_FIELD", "projectId must be a positive integer");
      }
      projectId = Number(projectRaw);
      if (!isPositiveInt(projectId)) throw new ApiError(422, "INVALID_FIELD", "projectId must be a positive integer");
    }
    const replaceRaw = req.headers["x-cpwb-replace"];
    if (replaceRaw !== undefined && replaceRaw !== "true" && replaceRaw !== "false") {
      throw new ApiError(422, "INVALID_FIELD", "replace must be true or false");
    }
    return {
      ...parseSkillScope(scope, projectId),
      sourceName: parseSkillFilename(req.headers["x-cpwb-filename"]),
      replace: replaceRaw === "true",
    };
  }

  const permanentDeletionCapability = () => maintenance?.capability?.() ?? {
    available: false,
    requiresRestart: true,
    backend: null,
    reason: "Permanent deletion requires dsh-workbench supervised mode",
  };

  function publicMaintenanceJob(job) {
    if (!job || typeof job !== "object") return job;
    const output = {};
    for (const key of [
      "jobId",
      "state",
      "revision",
      "armed",
      "createdAt",
      "completedAt",
      "recoveryCommand",
      "container",
    ]) {
      if (job[key] !== undefined) output[key] = job[key];
    }
    if (job.error && typeof job.error === "object") {
      output.error = {
        code: String(job.error.code ?? "PURGE_FAILED"),
        message: String(job.error.message ?? "Maintenance failed"),
      };
    }
    return output;
  }

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

  async function handleDocumentContent(req, res, { params, url }) {
    const id = parseId(params.id);
    const document = repos.documents.get(id);
    if (!document) throw new ApiError(404, "NOT_FOUND", "document not found: " + id);
    let bytes;
    try {
      bytes = await readFile(join(dataDir, "files", document.sha256));
    } catch {
      throw new ApiError(404, "FILE_NOT_FOUND", "original file is unavailable");
    }
    res.writeHead(200, {
      ...originalFileHeaders(document, url.searchParams.get("download") === "1"),
      "content-length": bytes.byteLength,
    });
    res.end(bytes);
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

  // ----- Skills -----------------------------------------------------------

  async function handleSkillsList(req, res, { url }) {
    requireSkillMethod("list");
    ok(res, await skills.list(parseSkillQuery(url)));
  }

  async function handleSkillImport(req, res) {
    requireSkillMethod("importArchive");
    const input = parseSkillImportHeaders(req);
    const archiveBytes = await readRawBody(req);
    const item = await skills.importArchive({ ...input, archiveBytes });
    ok(res, item, input.replace ? 200 : 201);
  }

  async function handleSkillPatch(req, res, { params }) {
    requireSkillMethod("setEnabled");
    const name = parseSkillName(params.name);
    const body = await readJsonBody(req);
    const input = parseSkillJsonScope(body, ["scope", "projectId", "operation"]);
    if (body.operation !== "enable" && body.operation !== "disable") {
      throw new ApiError(422, "INVALID_FIELD", "operation must be enable or disable");
    }
    ok(res, await skills.setEnabled({ ...input, name, enabled: body.operation === "enable" }));
  }

  async function handleSkillDelete(req, res, { params, url }) {
    requireSkillMethod("remove");
    const name = parseSkillName(params.name);
    ok(res, await skills.remove({ ...parseSkillQuery(url), name }));
  }

  async function handleSkillReveal(req, res, { params }) {
    requireSkillMethod("reveal");
    const name = parseSkillName(params.name);
    const body = await readJsonBody(req);
    const input = parseSkillJsonScope(body, ["scope", "projectId"]);
    await skills.reveal({ ...input, name });
    ok(res, { revealed: true });
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
    if (result?.status === "failed") {
      throw new ApiError(
        502,
        "SCHEDULE_RUN_FAILED",
        result.error || "定时任务执行失败",
        { runId: result.id ?? null, sessionId: result.sessionId ?? null },
      );
    }
    ok(res, result);
  }

  async function handleSummaryRun(req, res) {
    const body = await readJsonBody(req);
    const projectId = requirePositiveInt(body, "projectId");
    const project = repos.projects.get(projectId);
    if (!project) throw new ApiError(404, "NOT_FOUND", "project not found: " + projectId);
    // No summaryDate: pass null so the scheduler decides the configured local day.
    const summaryDate = optionalDate(body, "summaryDate");
    if (!hasRunSummary) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "summary run service is not available");
    }
    try {
      const result = await services.runSummary({ projectId, summaryDate });
      ok(res, result);
    } catch (cause) {
      logError(cause);
      throw new ApiError(502, "SUMMARY_GENERATION_FAILED", "每日总结生成失败，请重试");
    }
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

  function deletionPlanResponse(kind, plan, extended = null) {
    const container = kind === "project" ? plan.project : plan.knowledgeBase;
    return {
      kind,
      id: container.id,
      name: container.name,
      sessionCount: plan.sessionIds.length,
      ...(extended ? { descendantSessionCount: extended.descendantSessionIds?.length ?? 0 } : {}),
      relationshipCount: plan.relationshipCount,
      documentCount: plan.linkedDocuments.length,
      orphanDocumentCount: plan.orphanDocuments.length,
      ...(extended ? { planVersion: extended.planVersion } : {}),
      permanentDeletion: permanentDeletionCapability(),
    };
  }

  function deletionPolicy(url) {
    const value = url.searchParams.get("sessionPolicy") || "detach";
    if (value !== "detach" && value !== "delete") {
      throw new ApiError(422, "INVALID_FIELD", "sessionPolicy must be detach or delete");
    }
    return value;
  }

  async function handleProjectDeletionPlan(req, res, { params }) {
    const id = parseId(params.id);
    const extended = maintenance?.containerPlan
      ? await maintenance.containerPlan("project", id)
      : null;
    const plan = extended
      ? {
          project: extended.container ?? { id: extended.id, name: extended.name },
          sessionIds: extended.sessionIds ?? [],
          linkedDocuments: extended.linkedDocuments ?? [],
          orphanDocuments: extended.orphanDocuments ?? [],
          relationshipCount: extended.relationshipCount ?? 0,
        }
      : repos.projects.deletionPlan(id);
    if (!plan) throw new ApiError(404, "NOT_FOUND", "project not found: " + id);
    ok(res, deletionPlanResponse("project", plan, extended));
  }

  async function handleProjectDelete(req, res, { params, url }) {
    const id = parseId(params.id);
    const preview = repos.projects.deletionPlan(id);
    if (!preview) throw new ApiError(404, "NOT_FOUND", "project not found: " + id);
    const sessionPolicy = deletionPolicy(url);
    if (sessionPolicy === "delete") {
      throw new ApiError(409, "PURGE_JOB_REQUIRED", "permanent deletion requires a maintenance purge job");
    }
    const plan = typeof services.deleteProject === "function"
      ? await services.deleteProject({ projectId: id, sessionPolicy })
      : (() => {
          for (const sessionId of preview.sessionIds) {
            if (sessionPolicy === "delete") repos.workbenchSessions.remove(sessionId);
            else repos.workbenchSessions.updateScope({ sessionId, scope: { kind: "independent", id: null } });
          }
          return repos.projects.removeContainer(id);
        })();
    ok(res, {
      removed: true,
      projectId: id,
      sessionPolicy,
      detachedSessionCount: sessionPolicy === "detach" ? preview.sessionIds.length : 0,
      deletedSessionCount: sessionPolicy === "delete" ? preview.sessionIds.length : 0,
      orphanDocumentIds: (plan?.orphanDocuments || []).map((document) => document.id),
    });
  }

  async function handleKnowledgeBasesList(req, res) {
    ok(res, repos.knowledgeBases.list().map((knowledgeBase) => {
      const documents = repos.documents.listByKnowledgeBase(knowledgeBase.id);
      const linkedProjects = repos.projectKnowledgeBases.listByKnowledgeBase(knowledgeBase.id).map((project) => ({
        ...project,
        sessionCount: repos.workbenchSessions.list({ scopeKind: "project", scopeId: project.id, limit: 500 }).length,
      }));
      const readyFileCount = documents.filter((document) => document.status === "ready").length;
      const hasAttention = documents.some((document) => document.status === "failed" || document.status === "stale");
      const chunkCount = documents.reduce((total, document) => total + repos.chunks.listByDocument(document.id).length, 0);
      const latestIndexedAt = documents.reduce((latest, document) => {
        if (!document.indexedAt) return latest;
        return !latest || document.indexedAt > latest ? document.indexedAt : latest;
      }, null);
      const recentSession = repos.workbenchSessions.latest({ scopeKind: "knowledge_base", scopeId: knowledgeBase.id });
      const overview = {
        fileCount: documents.length,
        readyFileCount,
        chunkCount,
        linkedProjectCount: linkedProjects.length,
        sessionCount: repos.workbenchSessions.list({ scopeKind: "knowledge_base", scopeId: knowledgeBase.id, limit: 500 }).length,
        indexPercent: documents.length === 0 ? 0 : Math.round((readyFileCount / documents.length) * 100),
        state: documents.length === 0
          ? "empty"
          : hasAttention
            ? "attention"
            : readyFileCount === documents.length
              ? "ready"
              : "indexing",
        latestIndexedAt,
      };
      const recentDocuments = [...documents]
        .sort((a, b) => String(b.indexedAt || b.createdAt).localeCompare(String(a.indexedAt || a.createdAt)))
        .slice(0, 3)
        .map(({ id, originalName, mimeType, size, status, createdAt, indexedAt, error }) => ({
          id, originalName, mimeType, size, status, createdAt, indexedAt, error,
        }));
      return {
        ...knowledgeBase,
        ...(recentSession ? { recentSession } : {}),
        overview,
        linkedProjects,
        recentDocuments,
      };
    }));
  }

  async function handleKnowledgeBaseCreate(req, res) {
    const body = await readJsonBody(req);
    const name = requireString(body, "name");
    const description = optionalString(body, "description");
    ok(res, repos.knowledgeBases.create({ name, description }), 201);
  }

  async function handleKnowledgeBaseDeletionPlan(req, res, { params }) {
    const id = parseId(params.id);
    const extended = maintenance?.containerPlan
      ? await maintenance.containerPlan("knowledge_base", id)
      : null;
    const plan = extended
      ? {
          knowledgeBase: extended.container ?? { id: extended.id, name: extended.name },
          sessionIds: extended.sessionIds ?? [],
          linkedDocuments: extended.linkedDocuments ?? [],
          orphanDocuments: extended.orphanDocuments ?? [],
          relationshipCount: extended.relationshipCount ?? 0,
        }
      : repos.knowledgeBases.deletionPlan(id);
    if (!plan) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + id);
    ok(res, deletionPlanResponse("knowledge_base", plan, extended));
  }

  async function handleKnowledgeBaseDelete(req, res, { params, url }) {
    const id = parseId(params.id);
    const preview = repos.knowledgeBases.deletionPlan(id);
    if (!preview) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + id);
    const sessionPolicy = deletionPolicy(url);
    if (sessionPolicy === "delete") {
      throw new ApiError(409, "PURGE_JOB_REQUIRED", "permanent deletion requires a maintenance purge job");
    }
    const plan = typeof services.deleteKnowledgeBase === "function"
      ? await services.deleteKnowledgeBase({ knowledgeBaseId: id, sessionPolicy })
      : (() => {
          for (const sessionId of preview.sessionIds) {
            if (sessionPolicy === "delete") repos.workbenchSessions.remove(sessionId);
            else repos.workbenchSessions.updateScope({ sessionId, scope: { kind: "independent", id: null } });
          }
          return repos.knowledgeBases.removeContainer(id);
        })();
    ok(res, {
      removed: true,
      knowledgeBaseId: id,
      sessionPolicy,
      detachedSessionCount: sessionPolicy === "detach" ? preview.sessionIds.length : 0,
      deletedSessionCount: sessionPolicy === "delete" ? preview.sessionIds.length : 0,
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

  async function handleTodoDelete(req, res, { params }) {
    const id = parseId(params.id);
    if (!repos.todos.remove(id)) { notFound(res, "todo not found: " + id); return; }
    ok(res, { removed: true, todoId: id });
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

  async function handleAutomationPromptsSettings(req, res) {
    ok(res, requireSettings().get("automationPrompts"));
  }

  async function handleAutomationPromptsPatch(req, res) {
    const body = await readJsonBody(req);
    const patch = {};
    for (const key of ["summaryPrompt", "todoPrompt"]) {
      if (body[key] === undefined) continue;
      if (typeof body[key] !== "string" || body[key].trim() === "" || body[key].length > 20_000) {
        throw new ApiError(422, "INVALID_AUTOMATION_PROMPT", `${key} must be a non-empty string up to 20000 characters`);
      }
      patch[key] = body[key].trim();
    }
    if (Object.keys(patch).length === 0) {
      throw new ApiError(422, "INVALID_AUTOMATION_PROMPT", "provide summaryPrompt or todoPrompt");
    }
    ok(res, requireSettings().set("automationPrompts", patch));
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

  async function handleSummaryDelete(req, res, { params }) {
    const id = parseId(params.id);
    if (!repos.summaries.remove(id)) { notFound(res, "summary not found: " + id); return; }
    ok(res, { removed: true, id });
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

  async function handleKnowledgeBaseProjects(req, res, { params }) {
    const knowledgeBaseId = parseId(params.id);
    if (!repos.knowledgeBases.get(knowledgeBaseId)) throw new ApiError(404, "NOT_FOUND", "knowledge base not found: " + knowledgeBaseId);
    ok(res, repos.projectKnowledgeBases.listByKnowledgeBase(knowledgeBaseId));
  }

  async function handleHealth(req, res) {
    const report = await ollama.health();
    ok(res, { ok: true, ...report });
  }

  // ----- unified chat sessions -----

  async function handleChatSessionCreate(req, res) {
    if (!hasSessions) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session service is not available");
    }
    const body = await readJsonBody(req);
    const allowedFields = new Set(["scope", "title", "pinnedSources"]);
    const unknownField = Object.keys(body).find((field) => !allowedFields.has(field));
    if (unknownField) throw new ApiError(422, "INVALID_FIELD", "unknown field: " + unknownField);
    const input = {
      scope: normalizeSessionScope(body.scope),
      title: requireString(body, "title"),
      pinnedSources: optionalSourceList(body, "pinnedSources"),
    };
    const result = await sessions.materializeDraft(input);
    ok(res, result, 201);
  }

  async function handleChatSessionList(req, res, { url }) {
    const limit = Math.min(queryPositiveInt(url.searchParams.get("limit"), "limit") ?? 8, 100);
    const offset = queryNonNegativeInt(url.searchParams.get("offset"), "offset", 0);
    const query = url.searchParams.get("query") ?? "";
    const archivedRaw = url.searchParams.get("archived");
    if (archivedRaw != null && archivedRaw !== "true" && archivedRaw !== "false") {
      throw new ApiError(422, "INVALID_FIELD", "archived must be true or false");
    }
    const archived = archivedRaw === "true";
    const scopeKind = url.searchParams.get("scopeKind");
    if (scopeKind != null && !["project", "knowledge_base", "independent"].includes(scopeKind)) {
      throw new ApiError(422, "INVALID_SCOPE", "scopeKind must be project, knowledge_base, or independent");
    }
    const scopeIdRaw = url.searchParams.get("scopeId");
    if (scopeKind === "project" || scopeKind === "knowledge_base") {
      const scopeId = queryPositiveInt(scopeIdRaw, "scopeId");
      if (scopeId === undefined) throw new ApiError(422, "INVALID_SCOPE", "scopeId is required for this scopeKind");
      ok(res, {
        items: repos.workbenchSessions.listAll({ scopeKind, scopeId, query, lifecycleStatus: "active", archived, limit, offset }),
        total: repos.workbenchSessions.countAll({ scopeKind, scopeId, query, lifecycleStatus: "active", archived }),
        limit,
        offset,
      });
      return;
    }
    if (scopeKind === "independent" && scopeIdRaw != null) {
      throw new ApiError(422, "INVALID_SCOPE", "independent scope cannot have a scopeId");
    }
    ok(res, {
      items: repos.workbenchSessions.listAll({ scopeKind, query, lifecycleStatus: "active", archived, limit, offset }),
      total: repos.workbenchSessions.countAll({ scopeKind, query, lifecycleStatus: "active", archived }),
      limit,
      offset,
    });
  }

  async function handleChatSessionPatch(req, res, { params }) {
    if (!hasSessions) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session service is not available");
    }
    const body = await readJsonBody(req);
    const sessionId = params.sessionId;
    if (body.operation === "rename") {
      ok(res, await sessions.renameSession({ sessionId, title: requireString(body, "title") }));
      return;
    }
    if (body.operation === "move") {
      ok(res, await sessions.moveSession({ sessionId, scope: normalizeSessionScope(body.scope) }));
      return;
    }
    if (body.operation === "archive" || body.operation === "restore") {
      if (!hasSessionArchive) throw new ApiError(501, "NOT_IMPLEMENTED", "session archive service is not available");
      ok(res, body.operation === "archive"
        ? await sessions.archiveSession(sessionId)
        : await sessions.restoreSession(sessionId));
      return;
    }
    if (body.operation === "confirmDraft") {
      ok(res, await sessions.confirmDraft({ sessionId }));
      return;
    }
    throw new ApiError(422, "INVALID_OPERATION", "operation must be rename, move, archive, restore, or confirmDraft");
  }

  async function handleChatSessionDelete(req, res, { params }) {
    if (!hasSessions) throw new ApiError(501, "NOT_IMPLEMENTED", "session service is not available");
    const deleted = await sessions.deleteSession(params.sessionId);
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "session not found: " + params.sessionId);
    ok(res, { deleted: true });
  }

  async function handleChatSessionOpen(req, res, { params }) {
    if (!hasSessions || typeof sessions.openSession !== "function") {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session service is not available");
    }
    ok(res, await sessions.openSession({ sessionId: params.sessionId }));
  }

  async function handleChatSessionContextGet(req, res, { params }) {
    if (!hasSessionContext) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session context service is not available");
    }
    ok(res, sessions.getContext(params.sessionId));
  }

  async function handleChatSessionContextPut(req, res, { params }) {
    if (!hasSessionContext) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session context service is not available");
    }
    const body = await readJsonBody(req);
    if (!["pinned", "disabled"].includes(body.mode)) {
      throw new ApiError(422, "INVALID_CONTEXT_MODE", "mode must be pinned or disabled");
    }
    ok(res, sessions.setContext({
      sessionId: params.sessionId,
      source: normalizeContextSource(body.source),
      mode: body.mode,
    }));
  }

  async function handleChatSessionContextDelete(req, res, { params, url }) {
    if (!hasSessionContext) {
      throw new ApiError(501, "NOT_IMPLEMENTED", "session context service is not available");
    }
    const source = normalizeContextSource({
      kind: url.searchParams.get("sourceKind"),
      id: url.searchParams.get("sourceId"),
    });
    ok(res, {
      removed: Boolean(sessions.removeContext({ sessionId: params.sessionId, source })),
    });
  }

  async function handlePurgeJobCreate(req, res) {
    if (!maintenance?.createPurgeJob || !maintenance?.armPurgeJob) {
      throw new ApiError(501, "PURGE_UNAVAILABLE", "maintenance purge service is unavailable");
    }
    const body = await readJsonBody(req);
    const allowedFields = new Set([
      "kind",
      "id",
      "planVersion",
      "confirmation",
      "restartConfirmed",
    ]);
    const unknownField = Object.keys(body).find((field) => !allowedFields.has(field));
    if (unknownField) throw new ApiError(422, "INVALID_FIELD", "unknown field: " + unknownField);
    const kind = requireString(body, "kind");
    if (!["project", "knowledge_base"].includes(kind)) {
      throw new ApiError(422, "INVALID_FIELD", "kind must be project or knowledge_base");
    }
    const id = requirePositiveInt(body, "id");
    const planVersion = requireString(body, "planVersion");
    const confirmation = requireString(body, "confirmation");
    if (body.restartConfirmed !== true) {
      throw new ApiError(422, "INVALID_FIELD", "restartConfirmed must be true");
    }
    let job;
    try {
      job = await maintenance.createPurgeJob({
        kind,
        id,
        planVersion,
        name: confirmation,
        restartConfirmed: true,
      });
    } catch (error) {
      throw new ApiError(409, "PURGE_PLAN_REJECTED", error?.message ?? "purge job rejected");
    }
    res.once?.("finish", () => {
      void maintenance.armPurgeJob(job.jobId).catch(logError);
    });
    ok(res, publicMaintenanceJob(job), 202);
  }

  async function handlePurgeJobGet(req, res, { params }) {
    if (!maintenance?.getJob) {
      throw new ApiError(501, "PURGE_UNAVAILABLE", "maintenance purge service is unavailable");
    }
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9_-]{0,126}[A-Za-z0-9])?$/.test(params.jobId)) {
      throw new ApiError(422, "INVALID_ID", "invalid purge job id");
    }
    try {
      ok(res, publicMaintenanceJob(await maintenance.getJob(params.jobId)));
    } catch {
      throw new ApiError(404, "NOT_FOUND", "purge job not found");
    }
  }

  // ----- dispatcher (single source of truth for the approved surface) -----

  const routes = [
    { pattern: "/health", methods: { GET: handleHealth } },
    { pattern: "/skills", methods: { GET: handleSkillsList } },
    { pattern: "/skills/import", methods: { POST: handleSkillImport } },
    { pattern: "/skills/:name/reveal", methods: { POST: handleSkillReveal } },
    { pattern: "/skills/:name", methods: { PATCH: handleSkillPatch, DELETE: handleSkillDelete } },
    { pattern: "/maintenance/purge-jobs", methods: { POST: handlePurgeJobCreate } },
    { pattern: "/maintenance/purge-jobs/:jobId", methods: { GET: handlePurgeJobGet } },
    { pattern: "/chat/sessions", methods: { GET: handleChatSessionList, POST: handleChatSessionCreate } },
    { pattern: "/chat/sessions/:sessionId/context", methods: { GET: handleChatSessionContextGet, PUT: handleChatSessionContextPut, DELETE: handleChatSessionContextDelete } },
    { pattern: "/chat/sessions/:sessionId/open", methods: { POST: handleChatSessionOpen } },
    { pattern: "/chat/sessions/:sessionId", methods: { PATCH: handleChatSessionPatch, DELETE: handleChatSessionDelete } },
    { pattern: "/projects", methods: { GET: handleProjectsList, POST: handleProjectCreate } },
    { pattern: "/projects/:id/deletion-plan", methods: { GET: handleProjectDeletionPlan } },
    { pattern: "/projects/:id", methods: { PATCH: handleProjectPatch, DELETE: handleProjectDelete } },
    { pattern: "/knowledge-bases", methods: { GET: handleKnowledgeBasesList, POST: handleKnowledgeBaseCreate } },
    { pattern: "/knowledge-bases/:id/deletion-plan", methods: { GET: handleKnowledgeBaseDeletionPlan } },
    { pattern: "/knowledge-bases/:id", methods: { DELETE: handleKnowledgeBaseDelete } },
    { pattern: "/documents", methods: { GET: handleDocumentsList, POST: handleUpload } },
    { pattern: "/documents/:id/content", methods: { GET: handleDocumentContent } },
    { pattern: "/documents/:id/reindex", methods: { POST: handleReindex } },
    { pattern: "/knowledge-bases/:id/reindex", methods: { POST: handleKnowledgeBaseReindex } },
    { pattern: "/documents/:id/links/:scope/:scopeId", methods: { DELETE: handleUnlink } },
    { pattern: "/documents/:id", methods: { GET: handleDocumentGet } },
    { pattern: "/search", methods: { POST: handleSearch } },
    { pattern: "/todos", methods: { GET: handleTodosList, POST: handleTodoCreate, PATCH: handleTodoPatch } },
    { pattern: "/todos/:id", methods: { DELETE: handleTodoDelete } },
    { pattern: "/schedules", methods: { GET: handleSchedulesList, POST: handleScheduleCreate, PATCH: handleSchedulePatch } },
    { pattern: "/schedules/:id", methods: { DELETE: handleScheduleDelete } },
    { pattern: "/schedules/:id/runs", methods: { GET: handleScheduleRuns } },
    { pattern: "/schedules/:id/run", methods: { POST: handleScheduleRun } },
    { pattern: "/summaries", methods: { GET: handleSummariesList } },
    { pattern: "/summaries/run", methods: { POST: handleSummaryRun } },
    { pattern: "/summaries/:id", methods: { DELETE: handleSummaryDelete } },
    { pattern: "/projects/:projectId/automation", methods: { GET: handleAutomationGet, PATCH: handleAutomationPatch } },
    { pattern: "/projects/:projectId/knowledge-bases", methods: { GET: handleProjectKbs } },
    { pattern: "/projects/:projectId/knowledge-bases/:knowledgeBaseId", methods: { POST: handleProjectKbLink, DELETE: handleProjectKbUnlink } },
    { pattern: "/knowledge-bases/:id/projects", methods: { GET: handleKnowledgeBaseProjects } },
    { pattern: "/settings/embedding", methods: { GET: handleEmbeddingSettings, PATCH: handleEmbeddingPatch } },
    { pattern: "/settings/embedding/test", methods: { POST: handleEmbeddingTest } },
    { pattern: "/settings/index", methods: { GET: handleIndexStatus } },
    { pattern: "/settings/index/reindex", methods: { POST: handleIndexReindex } },
    { pattern: "/settings/embedding/credential", methods: { PUT: handleCredentialPut, DELETE: handleCredentialDelete } },
    { pattern: "/settings/timezone", methods: { GET: handleTimezoneSettings, PATCH: handleTimezonePatch } },
    { pattern: "/settings/automation-prompts", methods: { GET: handleAutomationPromptsSettings, PATCH: handleAutomationPromptsPatch } },
    { pattern: "/settings/network", methods: { GET: handleNetworkSettings, PATCH: handleNetworkPatch } },
    { pattern: "/settings/network/test", methods: { POST: handleNetworkTest } },
    { pattern: "/settings/auth/status", methods: { GET: handleAuthStatus } },
    { pattern: "/settings/auth/test", methods: { POST: handleAuthTest } },
    { pattern: "/settings/auth/codex/connect", methods: { POST: handleCodexAuthConnect } },
  ];

  async function dispatch(req, res, url) {
    const path = subPath(url.pathname);
    const method = req.method.toUpperCase();
    if (
      maintenance?.isLocked?.() === true &&
      !["GET", "HEAD", "OPTIONS"].includes(method)
    ) {
      throw new ApiError(
        503,
        "PURGE_MAINTENANCE_ACTIVE",
        "Workbench maintenance is active; retry after restart",
      );
    }
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
      fail(res, apiError.status, apiError.code, apiError.message, apiError.details);
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
