const PAGES = new Set(["home", "knowledge", "sessions", "conversation"]);

export function createNavigationStore({ initialPage = "home" } = {}) {
  if (!PAGES.has(initialPage)) throw new TypeError("unknown Workbench page: " + initialPage);
  let snapshot = { page: initialPage, sessionId: null };
  const listeners = new Set();

  function publish(page, sessionId = null) {
    const next = { page, sessionId };
    if (snapshot.page === next.page && snapshot.sessionId === next.sessionId) return;
    snapshot = next;
    for (const listener of listeners) listener();
  }

  return {
    getSnapshot() { return snapshot; },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    openHome() { publish("home"); },
    openKnowledge() { publish("knowledge"); },
    openSessions() { publish("sessions"); },
    openConversation(sessionId) {
      if (typeof sessionId !== "string" || sessionId.length === 0) {
        throw new TypeError("sessionId is required");
      }
      publish("conversation", sessionId);
    },
  };
}
