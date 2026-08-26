/**
 * The Workbench owns only session scope metadata. Conversation state remains
 * in the rc.2 Session/Chat stores and is rendered by the standard conversation
 * kit. These helpers keep Workbench list/paging and command affordances thin
 * adapters over that public DSH face.
 */

import { isWorkbenchSessionId } from "./workbenchSessions.js";

export const STANDARD_SESSION_SLOTS = Object.freeze([
  "conversation.view",
  "conversation.chat.node",
  "conversation.chat.commandview",
  "conversation.chat.turnTail",
  "conversation.chat.assistant-actions",
  "conversation.details.tool",
  "conversation.composer",
  "conversation.composer.bar",
  "conversation.composer.dock",
  "conversation.input.left",
  "conversation.input.right",
  "conversation.input.attachments",
  "conversation.input.plan",
  "conversation.input.model",
  "*",
]);

export function sessionCapabilitySlots() {
  return [...STANDARD_SESSION_SLOTS];
}

function snapshotRows(snapshot) {
  if (!snapshot?.byId || typeof snapshot.byId !== "object") return [];
  const ids = Array.isArray(snapshot.ids) ? snapshot.ids : Object.keys(snapshot.byId);
  return ids.map((id) => snapshot.byId[id]).filter(Boolean);
}

export function listWorkbenchSessions(snapshot, scopes = null, activeScope = null) {
  return snapshotRows(snapshot)
    .filter((session) => isWorkbenchSessionId(session.sessionId ?? session.id))
    .filter((session) => {
      if (!activeScope) return true;
      const id = session.sessionId ?? session.id;
      const metadata = session.scope
        ? session
        : (scopes && (scopes[id] ?? scopes[String(id)]));
      const scope = metadata?.scope ?? (
        metadata?.scopeKind ? { kind: metadata.scopeKind, id: metadata.scopeId } : null
      );
      return scope?.kind === activeScope.kind && Number(scope.id) === Number(activeScope.id);
    })
    .map((session) => session.sessionId ? session : { ...session, sessionId: session.id });
}

export function paginateWorkbenchSessions(snapshot, { offset = 0, limit = 20 } = {}) {
  const start = Math.max(0, Number.isFinite(offset) ? offset : 0);
  const size = Math.max(1, Number.isFinite(limit) ? limit : 20);
  return listWorkbenchSessions(snapshot).slice(start, start + size);
}

export function sessionRuntimeActions(session) {
  if (!session || typeof session !== "object") throw new TypeError("session face is required");
  const contentOf = (content) => Array.isArray(content) ? content : [{ type: "text", text: String(content ?? "") }];
  return {
    send(content) { return session.prompt(contentOf(content), "queue"); },
    steer(content) { return session.prompt(contentOf(content), "steer"); },
    stop() { return session.cancel(); },
    loadOlder() { return session.loadOlder(); },
    updateQueue(itemId, action) { return session.updateQueue(itemId, action); },
    rename(title) { return session.rename(title); },
    command(command) { return session.command(command); },
  };
}

const KNOWLEDGE_SOURCES_KEY = "workbench-knowledge-sources";
const SOURCE_LINE = /^\[source id="([^"\r\n]*)" document-id="([^"\r\n]*)" file="([^"\r\n]*)" locator="([^"\r\n]*)"\]$/gm;

function decodeXmlAttribute(value) {
  const entities = {
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    "#13": "\r",
    "#10": "\n",
    "#9": "\t",
  };
  return String(value).replace(/&(quot|amp|lt|gt|#13|#10|#9);/g, (match, entity) => entities[entity] ?? match);
}

function knowledgeContextFromEvent(event) {
  if (event?.type !== "user/message") return null;
  const source = event.data?.source;
  if (source?.kind !== "plugin" || source.plugin !== "dsh-cyberpunk-workbench" || source.form !== "recall") return null;
  const text = (Array.isArray(event.data?.content) ? event.data.content : [])
    .filter((block) => block?.type === "text")
    .map((block) => String(block.text ?? ""))
    .join("\n");
  const open = text.indexOf("<knowledge_context>\n");
  const close = text.indexOf("</knowledge_context>", open + 1);
  if (open === -1 || close === -1) return null;
  const citations = [];
  SOURCE_LINE.lastIndex = 0;
  for (const match of text.slice(open, close).matchAll(SOURCE_LINE)) {
    const documentId = Number(match[2]);
    citations.push({
      ...(Number.isSafeInteger(documentId) && documentId > 0 ? { documentId } : {}),
      sourceId: decodeXmlAttribute(match[1]),
      originalName: decodeXmlAttribute(match[3]),
      locator: decodeXmlAttribute(match[4]),
    });
  }
  if (citations.length === 0) return null;
  const documents = new Set(citations.map((citation) => citation.documentId
    ? "document:" + citation.documentId
    : "file:" + citation.originalName));
  return {
    version: 1,
    passageCount: citations.length,
    documentCount: documents.size,
    citations,
  };
}

function locationTurn(location) {
  if (location?.kind === "turn" || location?.kind === "step") return location.turn?.turn;
  return undefined;
}

export const knowledgeSourcesDefinition = {
  kind: KNOWLEDGE_SOURCES_KEY,
  match(event) {
    return knowledgeContextFromEvent(event) === null ? null : { id: String(event.seq), role: "start" };
  },
  start(_context, match) {
    return knowledgeContextFromEvent(match.event);
  },
  update(context) {
    return context.state;
  },
  buildLocationData(context, scope) {
    if (scope !== "turn" || !context.state) return null;
    const turn = locationTurn(context.start?.location);
    return turn === undefined ? null : {
      kind: "turn",
      turn,
      key: KNOWLEDGE_SOURCES_KEY,
      value: context.state,
    };
  },
};

export function selectKnowledgeSources(owner) {
  const value = owner?.turn?.data?.get?.(KNOWLEDGE_SOURCES_KEY);
  return Array.isArray(value?.citations) && value.citations.length > 0 ? value : null;
}

export function registerKnowledgeSources(ctx, Component) {
  if (!ctx?.conversationEvents?.register || !ctx?.slots?.inject || !ctx?.slots?.register) {
    throw new TypeError("knowledge sources require DSH conversationEvents and slots services");
  }
  ctx.conversationEvents.register(knowledgeSourcesDefinition);
  return ctx.slots.inject("conversation.chat.turnTail", function () {
    return ctx.slots.register({
      name: "conversation.chat.turnTail",
      select: selectKnowledgeSources,
    }, Component);
  });
}
