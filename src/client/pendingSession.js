import { openWorkbenchSession } from "./workbenchSessions.js";

function valueOf(response, label) {
  const result = response?.result;
  if (result?.ok) return result.value;
  const error = new Error(result?.error?.message || label + " failed");
  error.code = result?.error?.code;
  error.details = result?.error?.details;
  throw error;
}

export async function loadPendingModelCatalog(connection) {
  if (typeof connection?.api?.llm?.models !== "function") return { groups: [], failures: [] };
  const response = await connection.api.llm.models({});
  return valueOf(response, "读取模型目录");
}

async function applyModelSelection(connection, sessionId, selection) {
  if (!selection) return null;
  if (typeof connection?.api?.sessions?.selectModel !== "function") {
    throw new Error("DSH 模型选择服务不可用");
  }
  const response = await connection.api.sessions.selectModel({
    sessionId,
    provider: selection.provider,
    model: selection.model,
    ...(selection.reasoningEffort ? { reasoningEffort: selection.reasoningEffort } : {}),
  });
  return valueOf(response, "切换模型");
}

export async function submitPendingDraft({
  store,
  sessions,
  workspaces,
  connection,
  conversation,
  text,
  imageIds = [],
  modelSelection = null,
  waitForReady = openWorkbenchSession,
}) {
  const existing = store.getSnapshot().draft;
  if (existing?.status === "admitted") {
    try {
      return await store.actions.confirmDraft();
    } catch (error) {
      store.actions.markDraftError?.(error);
      throw error;
    }
  }

  try {
    const pending = await store.actions.materializeDraft({ text });
    const sessionId = pending.sessionId;
    await waitForReady(sessions, sessionId, { workspaces });
    await applyModelSelection(connection, sessionId, modelSelection);
    const session = sessions?.binding?.(sessionId)?.session;
    if (!session) throw new Error("DSH 会话尚未就绪");
    if (typeof conversation?.sendSession !== "function") throw new Error("DSH 原生会话输入服务不可用");
    const outcome = await conversation.sendSession(session, text.trim(), imageIds, "queue");
    if (outcome?.kind !== "success") throw new Error("DSH 未接受首条消息");
    store.actions.markDraftAdmitted();
    return await store.actions.confirmDraft();
  } catch (error) {
    store.actions.markDraftError?.(error);
    throw error;
  }
}
