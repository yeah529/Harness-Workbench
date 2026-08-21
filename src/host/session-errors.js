/**
 * Lightweight session-layer error vocabulary (Task 8A-R).
 *
 * WorkbenchSessionError and SESSION_ERROR_CODES live here — NOT in sessions.js —
 * so callers that only need the error type for instanceof mapping (e.g. the HTTP
 * API) can import this tiny module without transitively loading sessions.js and
 * therefore @deepseek-ai/dsh-agent / @deepseek-ai/dsh-session.
 *
 * sessions.js re-exports both symbols so its existing public interface (and the
 * tests that import from it) stays unchanged; that re-export is NOT a
 * compatibility layer — it is the single source of truth.
 */

/** Stable machine-routable failure codes surfaced by the session layer. */
export const SESSION_ERROR_CODES = Object.freeze({
  MISSING_SCOPE: "EMISSING_SCOPE",
  INVALID_SCOPE: "EINVALID_SCOPE",
  PROJECT_NOT_FOUND: "EPROJECT_NOT_FOUND",
  KNOWLEDGE_BASE_NOT_FOUND: "EKNOWLEDGE_BASE_NOT_FOUND",
  WORKSPACE_NOT_FOUND: "EWORKSPACE_NOT_FOUND",
  SESSION_NOT_FOUND: "ESESSION_NOT_FOUND",
  SCOPE_MISMATCH: "ESCOPE_MISMATCH",
  RETRIEVAL_FAILED: "ERETRIEVAL_FAILED",
  CHAT_PERSIST_FAILED: "ECHAT_PERSIST_FAILED",
  SESSION_CREATE_FAILED: "ESESSION_CREATE_FAILED",
  CHAT_NOT_FOUND: "ECHAT_NOT_FOUND",
  CHAT_KB_MISMATCH: "ECHAT_KB_MISMATCH",
  SESSION_RESUME_FAILED: "ESESSION_RESUME_FAILED",
});

/** Session-layer error: a stable code and a clean message, never a stack leak. */
export class WorkbenchSessionError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "WorkbenchSessionError";
    this.code = code;
    if (cause !== undefined) this.cause = cause;
  }
}
