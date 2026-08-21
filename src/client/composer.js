/**
 * Pure composer helpers for the workbench chat takeover.
 *
 * The composer submits through api.chat.prompts (never inputActions.submit)
 * and clears the draft only on success; on any error the draft is retained so
 * the user's question is never lost.
 */

export const ATTACHMENT_UNSUPPORTED_TEXT = "知识库问答当前仅支持文本";

/** Shown when the Host answered successfully but retrieved no citations. */
export const EMPTY_RETRIEVAL_TEXT = "未找到足够相关的知识库内容";

/**
 * Map the workbench session's declared scope onto the prompt API's optional
 * scope fields. Exactly one of projectId / knowledgeBaseId is set.
 */
export function buildSubmitPayload({ sessionId, question, scope }) {
  return {
    sessionId,
    question,
    projectId: scope && scope.kind === "project" ? scope.scopeId : undefined,
    knowledgeBaseId: scope && scope.kind === "knowledge_base" ? scope.scopeId : undefined,
  };
}

/** Draft policy: clear only on success; any error retains the draft. */
export function composerDraftPolicy(error) {
  return { clear: error == null };
}

/**
 * Interpret the session `cancel()` result. DSH's stop binding resolves (it does
 * NOT reject) with an RpcResult `{ ok, error }`; only `ok === true` means the
 * stop actually succeeded. `{ ok:false, error }` is a *successful resolution*
 * carrying a server-side failure that must be surfaced, never treated as a
 * successful stop.
 *
 * @param {any} result
 * @returns {{ ok: boolean, error: string | null }}
 */
export function cancelResultToOutcome(result) {
  if (result && result.ok === true) return { ok: true, error: null };
  let message = null;
  if (result && result.error) {
    if (typeof result.error === "string") message = result.error;
    else if (result.error.message) message = String(result.error.message);
  }
  return { ok: false, error: message || "停止失败" };
}

/**
 * Drive the injected session cancel() and normalize every terminal state into
 * one outcome: a resolved `{ ok:true }` is success, a resolved `{ ok:false,
 * error }` is a server-side failure surfaced from its error, and a rejected
 * promise is surfaced from its Error message. The returned promise never
 * rejects, so callers only ever read `{ ok, error }`.
 *
 * @param {() => any} cancel
 * @returns {Promise<{ ok: boolean, error: string | null }>}
 */
export function runCancel(cancel) {
  return Promise.resolve()
    .then(function () { return cancel(); })
    .then(function (result) { return cancelResultToOutcome(result); })
    .catch(function (err) {
      return { ok: false, error: (err && err.message) ? err.message : "停止失败" };
    });
}
