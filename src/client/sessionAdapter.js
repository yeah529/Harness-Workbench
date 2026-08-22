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
        metadata?.scopeKind ? { kind: metadata.scopeKind, scopeId: metadata.scopeId } : null
      );
      return scope?.kind === activeScope.kind && Number(scope.scopeId) === Number(activeScope.scopeId);
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
