import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createWorkbenchStore } from "../src/client/store.js";
import { NewSessionDialog } from "../src/client/NewSessionDialog.js";
import { ContainerDeleteDialog } from "../src/client/ContainerDeleteDialog.js";
import { WorkbenchSidebar, partitionSidebarSessions } from "../src/client/WorkbenchSidebar.js";
import {
  WorkbenchSessionShell,
  PROJECT_TOOL_TABS,
  KNOWLEDGE_TOOL_TABS,
  INDEPENDENT_TOOL_TABS,
  GlobalSchedulesPanel,
} from "../src/client/WorkbenchSessionShell.js";

function sessionApi({ activateError } = {}) {
  const calls = [];
  const api = {
    calls,
    health: async () => ({ ok: true }),
    chat: { sessions: {
      async create(input) {
        calls.push(["create", input]);
        if (activateError) throw activateError;
        return { sessionId: "session-cpwb-new", scope: input.scope, title: "完成接口验收", lifecycleStatus: "active", citations: [] };
      },
      async retry(input) { calls.push(["retry", input]); return { sessionId: input.sessionId, lifecycleStatus: "active", citations: [] }; },
      async open(sessionId) { calls.push(["open", sessionId]); return { sessionId, scope: { kind: "independent", id: null } }; },
      async list() { return { items: [], total: 0, limit: 8, offset: 0 }; },
      async rename(input) { calls.push(["rename", input]); return input; },
      async move(input) { calls.push(["move", input]); return input; },
      async remove(sessionId) { calls.push(["remove", sessionId]); return { deleted: true }; },
      context: {
        async get(sessionId) { calls.push(["context.get", sessionId]); return []; },
        async set(input) { calls.push(["context.set", input]); return [input]; },
        async remove(input) { calls.push(["context.remove", input]); return { removed: true }; },
      },
    } },
  };
  return api;
}

test("store keeps a new session local until the first non-empty prompt", async () => {
  const api = sessionApi();
  const store = createWorkbenchStore(api);
  store.actions.startDraft({
    scope: { kind: "project", id: 3 },
    pinnedSources: [{ kind: "knowledge_base", id: "4" }],
  });
  assert.equal(api.calls.length, 0);
  assert.deepEqual(store.getSnapshot().draft.scope, { kind: "project", id: 3 });
  await assert.rejects(() => store.actions.activateDraft({ text: "   " }), /不能为空/);
  assert.equal(api.calls.length, 0);

  const result = await store.actions.activateDraft({ text: "完成接口验收。继续前端。" });
  assert.equal(result.sessionId, "session-cpwb-new");
  assert.deepEqual(api.calls[0], ["create", {
    scope: { kind: "project", id: 3 },
    question: "完成接口验收。继续前端。",
    pinnedSources: [{ kind: "knowledge_base", id: "4" }],
    oneShotSources: [],
  }]);
  assert.equal(store.getSnapshot().draft, null);
  assert.equal(store.getSnapshot().workbenchSessions[result.sessionId].scope.kind, "project");
});

test("failed activation keeps text and retry reuses the persisted failed session", async () => {
  const failure = Object.assign(new Error("provider failed"), {
    code: "EDRAFT_ACTIVATION_FAILED",
    details: { sessionId: "session-cpwb-failed", lifecycleStatus: "draft_failed", pendingQuestion: "保留正文" },
  });
  const api = sessionApi({ activateError: failure });
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "independent", id: null } });
  await assert.rejects(() => store.actions.activateDraft({ text: "保留正文" }), /provider failed/);
  assert.deepEqual(store.getSnapshot().draft, {
    scope: { kind: "independent", id: null },
    pinnedSources: [],
    text: "保留正文",
    status: "draft_failed",
    sessionId: "session-cpwb-failed",
    error: { code: "EDRAFT_ACTIVATION_FAILED", message: "provider failed" },
  });

  await store.actions.retryDraft({ text: "保留正文" });
  assert.deepEqual(api.calls[1], ["retry", { sessionId: "session-cpwb-failed", question: "保留正文", oneShotSources: [] }]);
  assert.equal(store.getSnapshot().draft, null);
});

test("discarding a pristine local draft performs no request", () => {
  const api = sessionApi();
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "knowledge_base", id: 7 } });
  store.actions.discardDraft();
  assert.equal(store.getSnapshot().draft, null);
  assert.equal(api.calls.length, 0);
});

test("new-session dialog exposes one owner choice and inherited-context preview", () => {
  const state = {
    projects: [{ id: 1, name: "DSH Research" }],
    knowledgeBases: [{ id: 2, name: "架构知识库" }],
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state };
  const html = renderToStaticMarkup(React.createElement(NewSessionDialog, {
    open: true,
    store,
    initialScope: { kind: "project", id: 1 },
    onClose() {},
    onStart() {},
  }));
  assert.match(html, /新建会话/);
  assert.match(html, /项目/);
  assert.match(html, /知识库/);
  assert.match(html, /独立会话/);
  assert.match(html, /默认上下文/);
  assert.doesNotMatch(html, /会话标题/);
});

test("sidebar partitions the current container before unrelated recents", () => {
  const sessions = [
    { sessionId: "p-1", title: "项目一", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "p-2", title: "项目二", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "p-3", title: "项目三", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "p-4", title: "项目四", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "kb-1", title: "知识会话", scope: { kind: "knowledge_base", id: 2 }, contextName: "架构库" },
    { sessionId: "i-1", title: "独立会话", scope: { kind: "independent", id: null }, contextName: "独立" },
  ];
  const partition = partitionSidebarSessions(sessions, { kind: "project", id: 7 }, "p-2");
  assert.deepEqual(partition.current.map((item) => item.sessionId), ["p-1", "p-2", "p-3"]);
  assert.deepEqual(partition.recent.map((item) => item.sessionId), ["kb-1", "i-1"]);

  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, {
    page: "conversation",
    activeSessionId: "p-2",
    recentSessions: sessions,
    currentScope: { kind: "project", id: 7 },
    currentContainerName: "Research",
    currentContainerTotal: 4,
  }));
  assert.match(html, /全部会话/);
  assert.match(html, /当前项目/);
  assert.match(html, /Research/);
  assert.match(html, /查看全部 4 个会话/);
  assert.match(html, /其他最近会话/);
  assert.equal((html.match(/项目[一二三]/g) || []).length, 3);
  assert.doesNotMatch(html, /项目四/);
});

test("right rail follows the project, knowledge-base, and independent tool matrix", () => {
  assert.deepEqual(PROJECT_TOOL_TABS.map((item) => item[1]), ["待办", "定时任务", "关联知识库", "每日总结"]);
  assert.deepEqual(KNOWLEDGE_TOOL_TABS.map((item) => item[1]), ["文档", "索引", "关联项目", "全局定时"]);
  assert.deepEqual(INDEPENDENT_TOOL_TABS.map((item) => item[1]), ["上下文", "文件", "Subagent", "全局定时"]);

  for (const [kind, id, labels] of [
    ["project", 7, PROJECT_TOOL_TABS],
    ["knowledge_base", 2, KNOWLEDGE_TOOL_TABS],
    ["independent", null, INDEPENDENT_TOOL_TABS],
  ]) {
    const sessionId = "session-cpwb-" + kind;
    const state = {
      projects: [{ id: 7, name: "Research" }],
      knowledgeBases: [{ id: 2, name: "架构库" }],
      workbenchSessions: { [sessionId]: { sessionId, scope: { kind, id }, title: "会话" } },
      linkedKnowledgeBases: [], documents: [], schedules: [], globalSchedules: [], contextBySession: {},
    };
    const store = { getSnapshot: () => state, subscribe: () => () => {}, actions: {} };
    const html = renderToStaticMarkup(React.createElement(WorkbenchSessionShell, { sessionId, open: true, store, layoutMode: "desktop" }));
    for (const [, label] of labels) assert.match(html, new RegExp(label));
  }
});

test("container deletion defaults to preserving sessions and discloses every cleanup boundary", () => {
  const snapshot = { action: null };
  const store = { subscribe: () => () => {}, getSnapshot: () => snapshot, actions: {} };
  const html = renderToStaticMarkup(React.createElement(ContainerDeleteDialog, {
    kind: "knowledge_base",
    target: { id: 2, name: "架构资料" },
    store,
    initialPlan: {
      kind: "knowledge_base", id: 2, name: "架构资料", sessionCount: 3,
      relationshipCount: 2, documentCount: 8, orphanDocumentCount: 5,
      permanentDeletionAvailable: false,
    },
    onClose() {},
  }));
  assert.match(html, /保留会话并移为独立会话/);
  assert.match(html, /推荐/);
  assert.match(html, /3<\/b> 个会话/);
  assert.match(html, /2<\/b> 个关联项目/);
  assert.match(html, /外部原文件与本地 embedding 模型不会删除/);
  assert.match(html, /checked="" value="detach"/);
});

test("global schedules identify their project and expose project, status, and trigger-date filters", () => {
  const state = {
    settings: { timezone: "Asia/Shanghai" },
    projects: [{ id: 1, name: "Workbench" }, { id: 2, name: "Docs" }],
    globalSchedules: [{ id: 7, projectId: 2, name: "每日索引", enabled: true, nextRunAt: "2026-08-23T13:00:00.000Z" }],
  };
  const store = { actions: { loadGlobalSchedules: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(GlobalSchedulesPanel, { state, store }));
  assert.match(html, /全部项目/);
  assert.match(html, /全部状态/);
  assert.match(html, /触发日期/);
  assert.match(html, /Docs/);
  assert.match(html, /每日索引/);
});
