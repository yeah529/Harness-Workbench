const PAGES = new Set(["home", "knowledge", "sessions", "draft", "conversation"]);

export function createNavigationStore({ initialPage = "home" } = {}) {
  if (!PAGES.has(initialPage)) throw new TypeError("unknown Workbench page: " + initialPage);
  let snapshot = { page: initialPage, sessionId: null };
  let conversationTransition = 0;
  const listeners = new Set();

  function publish(page, sessionId = null, meta = {}) {
    const next = { page, sessionId, ...meta };
    if (
      snapshot.page === next.page &&
      snapshot.sessionId === next.sessionId &&
      snapshot.opening === next.opening &&
      snapshot.error?.message === next.error?.message
    ) return;
    snapshot = next;
    for (const listener of listeners) listener();
  }

  function openPage(page) {
    conversationTransition += 1;
    publish(page);
  }

  return {
    getSnapshot() { return snapshot; },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    openHome() { openPage("home"); },
    openKnowledge() { openPage("knowledge"); },
    openSessions() { openPage("sessions"); },
    openDraft() { openPage("draft"); },
    openConversation(sessionId) {
      if (typeof sessionId !== "string" || sessionId.length === 0) {
        throw new TypeError("sessionId is required");
      }
      conversationTransition += 1;
      publish("conversation", sessionId);
    },
    beginConversation(sessionId) {
      if (typeof sessionId !== "string" || sessionId.length === 0) {
        throw new TypeError("sessionId is required");
      }
      conversationTransition += 1;
      publish("conversation", sessionId, { opening: true });
      return conversationTransition;
    },
    isConversationTransitionCurrent(sessionId, transitionId) {
      return snapshot.page === "conversation" && snapshot.sessionId === sessionId && conversationTransition === transitionId;
    },
    completeConversation(sessionId, transitionId) {
      if (snapshot.page !== "conversation" || snapshot.sessionId !== sessionId || conversationTransition !== transitionId) return false;
      publish("conversation", sessionId);
      return true;
    },
    failConversation(sessionId, transitionId, error) {
      if (snapshot.page !== "conversation" || snapshot.sessionId !== sessionId || conversationTransition !== transitionId) return false;
      const message = error && typeof error.message === "string" ? error.message : String(error || "无法恢复会话");
      publish("conversation", sessionId, { error: { message } });
      return true;
    },
  };
}
