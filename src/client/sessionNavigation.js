import { waitForSessionReady } from "./workbenchSessions.js";

/**
 * Restore one persisted Workbench session without leaving the user on the
 * source card/list while rc.2 mounts the native agent. The latest click owns
 * native selection; an older, slower restore may finish but cannot steal focus.
 */
export async function openKnownWorkbenchSession({ sessionId, store, sessions, workspaces, navigation }) {
  if (!store?.actions?.openSession || !sessions || !navigation?.beginConversation) {
    throw new TypeError("session navigation dependencies are unavailable");
  }

  const transitionId = navigation.beginConversation(sessionId);
  try {
    const result = await store.actions.openSession(sessionId);
    const targetId = result?.sessionId || sessionId;
    await waitForSessionReady(sessions, targetId, { workspaces });
    if (navigation.isConversationTransitionCurrent(sessionId, transitionId)) {
      sessions.open(targetId);
      navigation.completeConversation(sessionId, transitionId);
    }
    return result;
  } catch (error) {
    navigation.failConversation(sessionId, transitionId, error);
    throw error;
  }
}
