import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createNavigationStore } from "../src/client/navigation.js";
import { WorkbenchSessionShell } from "../src/client/WorkbenchSessionShell.js";
import { clearWorkbenchSessions, registerWorkbenchSession } from "../src/client/workbenchSessions.js";
import { openKnownWorkbenchSession } from "../src/client/sessionNavigation.js";

function readyRuntime(sessionId) {
  let opened = null;
  const sessions = {
    list: {
      getSnapshot: () => ({
        state: "ready",
        ids: [sessionId],
        byId: { [sessionId]: { sessionId, cwd: "/tmp/project" } },
      }),
      subscribe: () => () => {},
    },
    binding: (id) => id === sessionId ? { sessionId: id } : undefined,
    open(id) { opened = id; },
  };
  const workspaces = {
    list: {
      getSnapshot: () => ({ items: [{ workspaceId: "ws-1", sessionIds: [sessionId] }] }),
      subscribe: () => () => {},
    },
  };
  return { sessions, workspaces, opened: () => opened };
}

test("opening an existing session navigates immediately while DSH restoration is pending", async () => {
  const sessionId = "session-cpwb-cold";
  const navigation = createNavigationStore();
  const runtime = readyRuntime(sessionId);
  let release;
  const store = {
    actions: {
      openSession() {
        return new Promise((resolve) => { release = resolve; });
      },
    },
  };

  const pending = openKnownWorkbenchSession({
    sessionId,
    store,
    sessions: runtime.sessions,
    workspaces: runtime.workspaces,
    navigation,
  });

  assert.deepEqual(navigation.getSnapshot(), {
    page: "conversation",
    sessionId,
    opening: true,
  });
  assert.equal(runtime.opened(), null);

  release({ sessionId, scope: { kind: "project", id: 1 } });
  const result = await pending;

  assert.equal(result.sessionId, sessionId);
  assert.equal(runtime.opened(), sessionId);
  assert.deepEqual(navigation.getSnapshot(), { page: "conversation", sessionId });
});

test("a failed session restoration stays on the target page with a retryable error", async () => {
  const sessionId = "session-cpwb-missing";
  const navigation = createNavigationStore();
  const runtime = readyRuntime(sessionId);
  const store = {
    actions: {
      async openSession() { throw new Error("session resume failed"); },
    },
  };

  await assert.rejects(openKnownWorkbenchSession({
    sessionId,
    store,
    sessions: runtime.sessions,
    workspaces: runtime.workspaces,
    navigation,
  }), /session resume failed/);

  assert.deepEqual(navigation.getSnapshot(), {
    page: "conversation",
    sessionId,
    error: { message: "session resume failed" },
  });
});

test("only the latest session click can select the native DSH conversation", async () => {
  const ids = ["session-cpwb-first", "session-cpwb-second"];
  const navigation = createNavigationStore();
  const resolvers = new Map();
  const opened = [];
  const sessions = {
    list: {
      getSnapshot: () => ({
        state: "ready",
        ids,
        byId: Object.fromEntries(ids.map((sessionId) => [sessionId, { sessionId, cwd: "/tmp/project" }])),
      }),
      subscribe: () => () => {},
    },
    binding: (sessionId) => ids.includes(sessionId) ? { sessionId } : undefined,
    open(sessionId) { opened.push(sessionId); },
  };
  const workspaces = {
    list: {
      getSnapshot: () => ({ items: [{ workspaceId: "ws-1", sessionIds: ids }] }),
      subscribe: () => () => {},
    },
  };
  const store = {
    actions: {
      openSession(sessionId) {
        return new Promise((resolve) => resolvers.set(sessionId, resolve));
      },
    },
  };

  const first = openKnownWorkbenchSession({ sessionId: ids[0], store, sessions, workspaces, navigation });
  const second = openKnownWorkbenchSession({ sessionId: ids[1], store, sessions, workspaces, navigation });
  resolvers.get(ids[1])({ sessionId: ids[1], scope: { kind: "independent", id: null } });
  await second;
  resolvers.get(ids[0])({ sessionId: ids[0], scope: { kind: "independent", id: null } });
  await first;

  assert.deepEqual(opened, [ids[1]]);
  assert.deepEqual(navigation.getSnapshot(), { page: "conversation", sessionId: ids[1] });
});

test("session shell masks stale native content while the target session is restoring", () => {
  const sessionId = "session-cpwb-loading";
  clearWorkbenchSessions();
  registerWorkbenchSession({ sessionId, scope: { kind: "project", id: 7 } });
  const state = {
    projects: [{ id: 7, name: "DSH Research" }],
    knowledgeBases: [],
    linkedKnowledgeBases: [],
    workbenchSessions: {
      [sessionId]: { sessionId, scope: { kind: "project", id: 7 }, title: "会话恢复测试" },
    },
    settings: { timezone: "Asia/Shanghai" },
    todos: [],
    schedules: [],
    summaries: [],
  };
  const store = {
    getSnapshot: () => state,
    subscribe: () => () => {},
    actions: { refreshProject: async () => {} },
  };
  const sessions = {
    list: {
      getSnapshot: () => ({ state: "ready", ids: [], byId: {}, current: undefined }),
      subscribe: () => () => {},
    },
  };

  const html = renderToStaticMarkup(React.createElement(WorkbenchSessionShell, {
    open: true,
    opening: true,
    sessionId,
    store,
    sessions,
    layoutMode: "desktop",
  }));

  assert.match(html, /正在恢复会话/);
  assert.match(html, /正在同步 DSH 会话与 Workspace/);
  assert.match(html, /role="status"/);
  assert.doesNotMatch(html, /PROJECT SYSTEM/);
});
