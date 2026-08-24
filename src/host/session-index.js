import { createHash } from "node:crypto";

import { SessionId } from "@deepseek-ai/dsh-session";

function textOf(message) {
  return (Array.isArray(message?.content) ? message.content : [])
    .filter((block) => block?.type === "text")
    .map((block) => String(block.text ?? ""))
    .join("")
    .trim();
}

function userMessageId(event) {
  return String(event?.data?.id ?? event?.data?.message?.id ?? event?.id ?? event?.seq);
}

function pairHash(user, assistant) {
  return createHash("sha256").update(user).update("\0").update(assistant).digest("hex");
}

/** Extract only completed user/final-assistant pairs from a durable DSH log. */
export function extractSessionPairs(events) {
  const pairs = [];
  let currentUser = null;
  let finalAssistant = "";

  for (const event of Array.isArray(events) ? events : []) {
    if (event?.type === "user/message" && event?.data?.source?.kind === "user") {
      const text = textOf(event.data);
      currentUser = text ? { text, messageId: userMessageId(event) } : null;
      finalAssistant = "";
      continue;
    }
    if (event?.type === "assistant/message") {
      const text = textOf(event.data?.message);
      if (text) finalAssistant = text;
      continue;
    }
    if (event?.type !== "turn/end") continue;
    if (event.data?.reason?.kind === "completed" && currentUser && finalAssistant) {
      pairs.push({
        ordinal: pairs.length,
        messageId: currentUser.messageId,
        user: currentUser.text,
        assistant: finalAssistant,
        contentHash: pairHash(currentUser.text, finalAssistant),
      });
    }
    currentUser = null;
    finalAssistant = "";
  }
  return pairs;
}

/**
 * Adapt durable DSH conversations to the existing embedding/vector runtime.
 * The adapter owns no model client or database; both are injected from the
 * Workbench host's single configured indexing stack.
 */
export function createSessionIndexAdapter({ sessionQuery, embedding, vectorStore }) {
  if (!sessionQuery || typeof sessionQuery.readSession !== "function") {
    throw new Error("createSessionIndexAdapter requires sessionQuery.readSession");
  }
  if (!embedding || typeof embedding.embed !== "function") {
    throw new Error("createSessionIndexAdapter requires embedding.embed");
  }
  if (!vectorStore || typeof vectorStore.replaceSession !== "function"
      || typeof vectorStore.searchSession !== "function"
      || typeof vectorStore.deleteSession !== "function") {
    throw new Error("createSessionIndexAdapter requires session vector methods");
  }

  async function extract(sessionId) {
    const snapshot = await sessionQuery.readSession(SessionId(sessionId));
    return extractSessionPairs(snapshot?.events);
  }

  async function reindex(sessionId, { signal } = {}) {
    const pairs = await extract(sessionId);
    const texts = pairs.map((pair) => `用户：${pair.user}\n助手：${pair.assistant}`);
    const vectors = texts.length === 0 ? [] : await embedding.embed(texts, { signal });
    const model = embedding.identity?.().model ?? "unknown";
    const rows = pairs.map((pair, index) => ({
      row_id: sessionId + ":" + pair.ordinal,
      source_session_id: sessionId,
      source_kind: "session",
      ordinal: pair.ordinal,
      message_id: pair.messageId,
      text: texts[index],
      vector: vectors[index],
      content_hash: pair.contentHash,
      embedding_model: model,
    }));
    return vectorStore.replaceSession(sessionId, rows);
  }

  async function search({ sourceSessionId, query, limit = 8, signal } = {}) {
    if (typeof query !== "string" || query.trim() === "") return [];
    const [vector] = await embedding.embed([query], { signal });
    const hits = await vectorStore.searchSession({ sourceSessionId, vector, limit });
    return hits.map((hit) => ({
      sourceId: hit.rowId ?? `session:${sourceSessionId}:${hit.ordinal ?? 0}`,
      sourceKind: "session",
      sessionId: sourceSessionId,
      originalName: "会话：" + sourceSessionId,
      locator: "turn:" + ((hit.ordinal ?? 0) + 1),
      heading: null,
      text: hit.text,
      vectorSimilarity: hit.distance == null ? null : 1 - hit.distance,
      keywordMatched: false,
    }));
  }

  return {
    extract,
    reindex,
    search,
    remove: (sessionId) => vectorStore.deleteSession(sessionId),
  };
}
