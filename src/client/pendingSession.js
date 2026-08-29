import { openWorkbenchSession } from "./workbenchSessions.js";
import { sessionFileReferenceText } from "../shared/sessionFileReferences.js";

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

async function ensureSessionFiles(store, sessionId, files) {
  const requested = Array.isArray(files) ? files.filter(Boolean) : [];
  if (requested.length === 0) return [];
  const existing = await store.actions.loadSessionFiles(sessionId);
  const byName = new Map((existing || []).map((row) => [row.originalName, row]));
  const missing = requested.filter((file) => !byName.has(file.name));
  const uploaded = missing.length > 0
    ? await store.actions.uploadSessionFiles({ sessionId, files: missing })
    : [];
  for (const row of uploaded) byName.set(row.originalName, row);
  return requested.map((file) => byName.get(file.name)).filter(Boolean);
}

export async function submitPendingDraft({
  store,
  sessions,
  workspaces,
  connection,
  conversation,
  text,
  imageIds = [],
  files = [],
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
    const sessionFiles = await ensureSessionFiles(store, sessionId, files);
    const references = sessionFiles.map(sessionFileReferenceText).join(" ");
    const prompt = text.trim() + (references ? " " + references : "");
    await waitForReady(sessions, sessionId, { workspaces });
    await applyModelSelection(connection, sessionId, modelSelection);
    const session = sessions?.binding?.(sessionId)?.session;
    if (!session) throw new Error("DSH 会话尚未就绪");
    if (typeof conversation?.sendSession !== "function") throw new Error("DSH 原生会话输入服务不可用");
    const outcome = await conversation.sendSession(session, prompt, imageIds, "queue");
    if (outcome?.kind !== "success") throw new Error("DSH 未接受首条消息");
    store.actions.markDraftAdmitted();
    return await store.actions.confirmDraft();
  } catch (error) {
    store.actions.markDraftError?.(error);
    throw error;
  }
}
