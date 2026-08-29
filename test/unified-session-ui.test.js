import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createWorkbenchStore } from "../src/client/store.js";
import * as newSessionDialogModule from "../src/client/NewSessionDialog.js";
import { ContainerDeleteDialog } from "../src/client/ContainerDeleteDialog.js";
import {
  WorkbenchSidebar,
  groupSidebarSessionsByDate,
} from "../src/client/WorkbenchSidebar.js";
import { WorkbenchNodeMark } from "../src/client/SidebarBrand.js";
import { SessionListPage } from "../src/client/SessionListPage.js";
import { createNavigationStore } from "../src/client/navigation.js";
import { SkillsPage, SkillCollectionDialog, SkillConflictDialog } from "../src/client/SkillsPage.js";
import { actionMatches, copySkillPath, shouldRetainSkillInput, skillCatalogCount, skillScopeKey, ProjectSkillsPanel, SkillScopeManager } from "../src/client/SkillsManager.js";
import {
  WorkbenchSessionShell,
  PROJECT_TOOL_TABS,
  KNOWLEDGE_TOOL_TABS,
  INDEPENDENT_TOOL_TABS,
  GlobalSchedulesPanel,
} from "../src/client/WorkbenchSessionShell.js";

const { DraftConversation, NewSessionDialog } = newSessionDialogModule;

function sessionApi({ materializeError } = {}) {
  const calls = [];
  const api = {
    calls,
    health: async () => ({ ok: true }),
    chat: { sessions: {
      async create(input) {
        calls.push(["create", input]);
        if (materializeError) throw materializeError;
        return { sessionId: "session-cpwb-new", scope: input.scope, title: input.title, lifecycleStatus: "draft_failed" };
      },
      async confirm(sessionId) { calls.push(["confirm", sessionId]); return { sessionId, scope: { kind: "project", id: 3 }, lifecycleStatus: "active" }; },
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
  await assert.rejects(() => store.actions.materializeDraft({ text: "   " }), /不能为空/);
  assert.equal(api.calls.length, 0);

  const result = await store.actions.materializeDraft({ text: "完成接口验收。继续前端。" });
  assert.equal(result.sessionId, "session-cpwb-new");
  assert.deepEqual(api.calls[0], ["create", {
    scope: { kind: "project", id: 3 },
    title: "完成接口验收。继续前端。",
    pinnedSources: [{ kind: "knowledge_base", id: "4" }],
  }]);
  assert.equal(store.getSnapshot().draft.sessionId, result.sessionId);
  assert.equal(store.getSnapshot().draft.status, "materialized");
});

test("store keeps a materialized draft hidden until native prompt admission is confirmed", async () => {
  const calls = [];
  const api = sessionApi();
  api.chat.sessions.create = async function (input) {
    calls.push(["create", input]);
    return { sessionId: "session-cpwb-pending", scope: input.scope, title: input.title, lifecycleStatus: "draft_failed" };
  };
  api.chat.sessions.confirm = async function (sessionId) {
    calls.push(["confirm", sessionId]);
    return { sessionId, scope: { kind: "project", id: 3 }, title: "先发送再出现", lifecycleStatus: "active" };
  };
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "project", id: 3 } });

  const pending = await store.actions.materializeDraft({ text: "先发送再出现。第二句" });
  assert.equal(pending.sessionId, "session-cpwb-pending");
  assert.equal(store.getSnapshot().draft.status, "materialized");
  assert.equal(store.getSnapshot().recentSessions.length, 0);
  assert.deepEqual(calls[0], ["create", {
    scope: { kind: "project", id: 3 },
    title: "先发送再出现。第二句",
    pinnedSources: [],
  }]);

  store.actions.markDraftAdmitted();
  await store.actions.confirmDraft();
  assert.equal(store.getSnapshot().draft, null);
  assert.equal(store.getSnapshot().workbenchSessions["session-cpwb-pending"].lifecycleStatus, "active");
  assert.deepEqual(calls[1], ["confirm", "session-cpwb-pending"]);
});

test("failed materialization keeps the local text without fabricating a session id", async () => {
  const failure = Object.assign(new Error("provider failed"), {
    code: "EDRAFT_ACTIVATION_FAILED",
    details: { sessionId: "session-cpwb-failed", lifecycleStatus: "draft_failed", pendingQuestion: "保留正文" },
  });
  const api = sessionApi({ materializeError: failure });
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "independent", id: null } });
  await assert.rejects(() => store.actions.materializeDraft({ text: "保留正文" }), /provider failed/);
  assert.deepEqual(store.getSnapshot().draft, {
    scope: { kind: "independent", id: null },
    pinnedSources: [],
    text: "保留正文",
    status: "error",
    sessionId: null,
    error: { code: "EDRAFT_ACTIVATION_FAILED", message: "provider failed" },
  });
});

test("discarding a pristine local draft performs no request", () => {
  const api = sessionApi();
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "knowledge_base", id: 7 } });
  store.actions.discardDraft();
  assert.equal(store.getSnapshot().draft, null);
  assert.equal(api.calls.length, 0);
});

test("discarding a materialized draft removes its hidden native session", async () => {
  const api = sessionApi();
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "independent", id: null } });
  await store.actions.materializeDraft({ text: "不再发送" });
  await store.actions.discardDraft();
  assert.equal(store.getSnapshot().draft, null);
  assert.deepEqual(api.calls.at(-1), ["remove", "session-cpwb-new"]);
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
  assert.doesNotMatch(html, /<select/);
});

test("zero-id draft uses the full conversation chrome with model, image, and file controls", () => {
  const state = {
    draft: { scope: { kind: "project", id: 1 }, pinnedSources: [], text: "", status: "pristine", sessionId: null, error: null },
    projects: [{ id: 1, name: "DSH Research", path: "/tmp/research" }],
    knowledgeBases: [],
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: {} };
  const html = renderToStaticMarkup(React.createElement(DraftConversation, {
    store,
    sessions: {},
    workspaces: {},
    connection: {},
    conversation: {},
    onActivated() {},
    onCancel() {},
  }));
  assert.match(html, /Session ID 将在首次发送时生成/);
  assert.match(html, /选择模型与推理强度/);
  assert.match(html, /添加图片/);
  assert.match(html, /添加文件/);
  assert.match(html, /PROJECT SYSTEM/);
  assert.match(html, /发送前不创建 Session/);
});

test("pending model menu dismisses only for pointers outside its root", () => {
  assert.equal(typeof newSessionDialogModule.watchPendingModelDismiss, "function");
  const listeners = new Map();
  const documentObject = {
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type, listener) {
      if (listeners.get(type) === listener) listeners.delete(type);
    },
  };
  const inside = {};
  const outside = {};
  const root = { contains: (target) => target === inside };
  let dismissals = 0;
  const cleanup = newSessionDialogModule.watchPendingModelDismiss(documentObject, root, () => { dismissals += 1; });

  listeners.get("pointerdown")({ target: inside });
  assert.equal(dismissals, 0);
  listeners.get("pointerdown")({ target: outside });
  assert.equal(dismissals, 1);
  cleanup();
  assert.equal(listeners.has("pointerdown"), false);
});

test("sidebar stays on one fixed recent list when the active container changes", () => {
  const sessions = [
    { sessionId: "p-1", title: "项目一", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "p-2", title: "项目二", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "p-3", title: "项目三", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "p-4", title: "项目四", scope: { kind: "project", id: 7 }, contextName: "Research" },
    { sessionId: "kb-1", title: "知识会话", scope: { kind: "knowledge_base", id: 2 }, contextName: "架构库" },
    { sessionId: "i-1", title: "独立会话", scope: { kind: "independent", id: null }, contextName: "独立" },
    { sessionId: "schedule-1", title: "夜间接口审计", sessionType: "schedule", scope: { kind: "project", id: 7 }, contextName: "Research" },
  ];

  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, {
    page: "conversation",
    activeSessionId: "p-2",
    recentSessions: sessions,
    currentScope: { kind: "project", id: 7 },
    currentContainerName: "Research",
    currentContainerTotal: 4,
    onArchiveSession() {},
  }));
  assert.match(html, /全部会话/);
  assert.doesNotMatch(html, /<span>归档会话<\/span>/);
  assert.match(html, />知识芯片</);
  assert.doesNotMatch(html, />知识库</);
  assert.match(html, /最近会话/);
  assert.match(html, /Research/);
  assert.doesNotMatch(html, /当前项目|其他最近会话|查看全部 4 个会话/);
  assert.equal((html.match(/<strong>项目[一二三四]<\/strong>/g) || []).length, 4);
  assert.match(html, /aria-label="归档会话 项目一"/);
  assert.match(html, /cpwb-sidebar-session-action/);
  assert.match(html, /aria-label="项目会话"/);
  assert.match(html, /aria-label="知识库会话"/);
  assert.match(html, /aria-label="独立会话"/);
  assert.match(html, /aria-label="定时任务会话"/);
  assert.match(html, /cpwb-sidebar-date-group/);
  assert.match(html, />更早</);
});

test("sidebar separates the compact Workbench node from the footer wordmark", () => {
  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, {
    page: "home",
    recentSessions: [],
  }));
  const footerStart = html.indexOf('class="cpwb-sidebar-footer-wordmark"');

  assert.match(html, /class="cpwb-sidebar-product-mark"/);
  assert.match(html, /class="cpwb-workbench-node-mark"/);
  assert.match(html, /aria-label="Harness Workbench 图标"/);
  assert.match(html, /class="cpwb-sidebar-product-copy"/);
  assert.match(html, /class="cpwb-sidebar-product-wordmark"/);
  assert.equal((html.match(/data-logo-part="approved-node-artwork"/g) || []).length, 1);
  assert.equal((html.slice(0, footerStart).match(/data-logo-part="wordmark-main"/g) || []).length, 1);
  assert.equal((html.slice(footerStart).match(/data-logo-part="wordmark-main"/g) || []).length, 3);
  assert.match(html, /class="cpwb-sidebar-footer-wordmark"/);
  assert.doesNotMatch(html, /<text/);
  assert.doesNotMatch(html, /DEEPSEEK/);
  assert.match(html, /class="cpwb-sidebar-brand-footer"/);
  assert.match(html, /aria-label="Harness Workbench"/);
});

test("skills navigation is mutually exclusive and sidebar entry sits above settings", () => {
  const navigation = createNavigationStore();
  navigation.openSkills();
  assert.equal(navigation.getSnapshot().page, "skills");
  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, { page: "skills", recentSessions: [] }));
  assert.match(html, /aria-current="page"[^>]*>[\s\S]*Skills/);
  assert.ok(html.indexOf(">Skills<") < html.indexOf(">设置<"));
});

test("SkillsPage presents Skills with the 技能矩阵 alias and defaults to global scope", () => {
  const state = {
    projects: [{ id: 7, name: "Research" }],
    skillCatalogs: { global: { status: "ready", data: { scope: { kind: "global" }, rootPath: "/dsh/skills", items: [], diagnostics: [] }, error: null } },
    skillAction: null,
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: { loadSkills: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(SkillsPage, { store }));
  assert.match(html, /SKILL MATRIX \/ CHIP BAY/);
  assert.match(html, /<h1>Skills <span class="cpwb-skills-title-alias">技能矩阵<\/span><\/h1>/);
  assert.match(html, /将可复用能力写入神经芯片，在全局或当前项目接入 Workbench。/);
  assert.match(html, /role="img" aria-label="神经技能芯片已连接"/);
  assert.match(html, /class="cpwb-skills-chip-die"/);
  assert.match(html, /role="tab" aria-selected="true"[^>]*>全局矩阵/);
  assert.match(html, /项目矩阵/);
  assert.match(html, /\/dsh\/skills/);
  assert.match(html, /导入目录/);
  assert.match(html, /导入 ZIP/);
  assert.doesNotMatch(html, /替换 Skill/);
});

test("Skill conflict dialog is only an import decision", () => {
  const html = renderToStaticMarkup(React.createElement(SkillConflictDialog, {
    existing: { name: "x", description: "old", state: "enabled", files: ["SKILL.md"], installedPath: "/dsh/skills/x" },
    incoming: { name: "x", description: "new", files: ["SKILL.md", "references/a.md"], sourceName: "x.zip" },
    onCancel() {}, onReplace() {},
  }));
  assert.match(html, /同名 Skill 已存在/);
  assert.match(html, /取消/);
  assert.match(html, /确认替换/);
  assert.match(html, /SKILL\.md/);
  assert.match(html, /\/dsh\/skills\/x/);
});

test("Skill collection dialog previews every child and marks replacements before confirmation", () => {
  const html = renderToStaticMarkup(React.createElement(SkillCollectionDialog, {
    preview: {
      kind: "collection",
      sourceName: "superpowers.zip",
      count: 2,
      conflictCount: 1,
      skills: [
        { name: "brainstorming", description: "Explore intent", fileCount: 2, conflict: true, existing: { state: "disabled" } },
        { name: "systematic-debugging", description: "Debug from evidence", fileCount: 1, conflict: false },
      ],
    },
    scope: "global",
    onCancel() {},
    onConfirm() {},
  }));
  assert.match(html, /SKILL COLLECTION \/ MATRIX LOAD/);
  assert.match(html, /检测到 2 个 Skills/);
  assert.match(html, /brainstorming/);
  assert.match(html, /systematic-debugging/);
  assert.match(html, /替换已停用版本/);
  assert.match(html, /新增/);
  assert.match(html, /导入 2 个 Skills/);
  assert.match(html, /superpowers\.zip/);
});

test("SkillsPage keeps each catalog count beside its scope tab and renders the A1 status reactor", () => {
  const state = {
    projects: [{ id: 7, name: "Research" }],
    skillCatalogs: {
      global: { status: "ready", data: { rootPath: "/dsh/skills", items: [{ name: "global", description: "Global skill", state: "enabled", health: "valid", path: "/dsh/skills/global", fileCount: 1 }], diagnostics: [] }, error: null },
      "project:7": { status: "ready", data: { items: [{ name: "project-a" }, { name: "project-b" }] }, error: null },
    },
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: { loadSkills: async () => {} } };
  assert.equal(skillCatalogCount(state, "global"), 1);
  assert.equal(skillCatalogCount(state, "project", 7), 2);
  const html = renderToStaticMarkup(React.createElement(SkillsPage, { store }));
  assert.match(html, />全局矩阵<span class="cpwb-skills-tab-count">（1）<\/span><\/button>/);
  assert.match(html, />项目矩阵<span class="cpwb-skills-tab-count">（2）<\/span><\/button>/);
  assert.doesNotMatch(html, /class="cpwb-skills-count"/);
  assert.match(html, /class="cpwb-skill-reactor-core" aria-hidden="true"/);
  assert.match(html, /class="cpwb-skill-reactor-label">已启用<\/span>/);
});

test("skill action matching is bound to the canonical scope key", () => {
  const action = { type: "setSkillEnabled", name: "same-skill", key: "project:7", status: "running" };
  assert.equal(skillScopeKey("global"), "global");
  assert.equal(skillScopeKey("project", 7), "project:7");
  assert.equal(actionMatches(action, "setSkillEnabled", "same-skill", "project:7"), true);
  assert.equal(actionMatches(action, "setSkillEnabled", "same-skill", "global"), false);
  assert.equal(actionMatches({ ...action, key: "global" }, "setSkillEnabled", "same-skill", "project:7"), false);
});

test("only same-scope conflicts retain an import payload", () => {
  const details = { existing: { name: "same-skill" }, incoming: { name: "same-skill" } };
  assert.equal(shouldRetainSkillInput({ code: "SKILL_CONFLICT", details }, "global", "global", { archive: {} }), true);
  assert.equal(shouldRetainSkillInput({ code: "SKILL_CONFLICT", details }, "project:7", "global", { archive: {} }), false);
  assert.equal(shouldRetainSkillInput({ code: "SKILL_PACKAGE_INVALID", details }, "global", "global", { archive: {} }), false);
  assert.equal(shouldRetainSkillInput({ code: "SKILL_CONFLICT", details: { incoming: { name: "same-skill" } } }, "global", "global", { archive: {} }), false);
  assert.equal(shouldRetainSkillInput({ code: "SKILL_CONFLICT", details: { existing: { name: "same-skill" } } }, "global", "global", { archive: {} }), false);
  assert.equal(shouldRetainSkillInput({ code: "SKILL_CONFLICT", details }, "global", "global", null), false);
  const collection = { kind: "collection", count: 2, conflictCount: 0, skills: [
    { name: "a", conflict: false }, { name: "b", conflict: false },
  ] };
  assert.equal(shouldRetainSkillInput({ code: "SKILL_COLLECTION_CONFIRMATION_REQUIRED", details: collection }, "global", "global", { archive: {} }), true);
  assert.equal(shouldRetainSkillInput({ code: "SKILL_COLLECTION_CONFIRMATION_REQUIRED", details: { ...collection, skills: [] } }, "global", "global", { archive: {} }), false);
});

test("copySkillPath reports missing and rejected clipboard writers instead of false success", async () => {
  await assert.rejects(() => copySkillPath(undefined, "/dsh/skills"), /不支持复制/);
  await assert.rejects(() => copySkillPath(async () => { throw new Error("denied"); }, "/dsh/skills"), /denied/);
  let copied = "";
  assert.equal(await copySkillPath(async (path) => { copied = path; }, "/dsh/skills"), true);
  assert.equal(copied, "/dsh/skills");
});

test("skill import controls fail closed only when the selected project is unavailable", () => {
  const unavailableState = { skillCatalogs: {}, skillAction: null };
  const unavailableStore = { subscribe: () => () => {}, getSnapshot: () => unavailableState, actions: {} };
  const unavailable = renderToStaticMarkup(React.createElement(SkillScopeManager, { store: unavailableStore, scope: "project", projectId: null }));
  assert.match(unavailable, /disabled=""/);
  assert.match(unavailable, /当前项目目录不可用/);

  const validState = { skillCatalogs: {}, skillAction: null };
  const validStore = { subscribe: () => () => {}, getSnapshot: () => validState, actions: {} };
  const valid = renderToStaticMarkup(React.createElement(SkillScopeManager, { store: validStore, scope: "project", projectId: 7 }));
  assert.doesNotMatch(valid, /当前项目目录不可用/);
  assert.doesNotMatch(valid, /disabled=""/);
});

test("only the footer wordmark renders the static cyberpunk fracture layer", () => {
  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, {
    page: "home",
    recentSessions: [],
  }));
  const footerStart = html.indexOf('class="cpwb-sidebar-footer-wordmark"');

  assert.notEqual(footerStart, -1);
  assert.doesNotMatch(html.slice(0, footerStart), /data-logo-part="wordmark-fractures"/);
  assert.equal((html.slice(footerStart).match(/data-logo-part="wordmark-fractures"/g) || []).length, 1);
});

test("only the footer wordmark renders two chromatic glitch channels", () => {
  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, {
    page: "home",
    recentSessions: [],
  }));
  const footerStart = html.indexOf('class="cpwb-sidebar-footer-wordmark"');
  const footer = html.slice(footerStart);

  assert.notEqual(footerStart, -1);
  assert.doesNotMatch(html.slice(0, footerStart), /data-logo-channel=/);
  assert.equal((footer.match(/data-logo-channel=/g) || []).length, 2);
  assert.match(footer, /data-logo-channel="cyan"/);
  assert.match(footer, /data-logo-channel="magenta"/);
});

test("compact Workbench node preserves the exact approved visual artwork", () => {
  const html = renderToStaticMarkup(React.createElement(WorkbenchNodeMark));
  const encoded = html.match(/href="data:image\/png;base64,([^"]+)"/)?.[1];

  assert.ok(encoded, "approved node artwork must render as an embedded PNG");
  assert.match(html, /viewBox="0 0 178 178"/);
  assert.match(html, /data-logo-part="approved-node-artwork"/);
  assert.equal(createHash("sha256").update(Buffer.from(encoded, "base64")).digest("hex"),
    "ec8d17458902b8a02cb8b54d291bcfe73cb2ca6cdd7a474c036847a3d21fe371");
  assert.doesNotMatch(html, /data-logo-part="harness-core"|<circle/);
});

test("sidebar groups recent sessions by activity date in the Workbench timezone", () => {
  const sessions = [
    { sessionId: "today", updatedAt: "2026-08-23T00:00:00.000Z" },
    { sessionId: "yesterday", updatedAt: "2026-08-22T06:00:00.000Z" },
    { sessionId: "weekday", updatedAt: "2026-08-20T06:00:00.000Z" },
    { sessionId: "same-year", updatedAt: "2026-08-10T06:00:00.000Z" },
    { sessionId: "previous-year", createdAt: "2025-12-31T06:00:00.000Z" },
  ];

  const groups = groupSidebarSessionsByDate(sessions, {
    now: new Date("2026-08-23T04:00:00.000Z"),
    timeZone: "Asia/Shanghai",
  });

  assert.deepEqual(groups.map((group) => group.label), [
    "今天",
    "昨天",
    "星期四",
    "8月10日",
    "2025年12月31日",
  ]);
  assert.deepEqual(groups.map((group) => group.sessions.map((session) => session.sessionId)), [
    ["today"],
    ["yesterday"],
    ["weekday"],
    ["same-year"],
    ["previous-year"],
  ]);
});

test("archived sessions are reserved for settings instead of a standalone Workbench route", () => {
  const row = {
    sessionId: "session-cpwb-archived",
    title: "历史架构讨论",
    scope: { kind: "project", id: 7 },
    contextName: "Research",
    archivedAt: "2026-08-23T09:30:00.000Z",
    updatedAt: "2026-08-23T09:30:00.000Z",
  };
  const state = { sessionPage: { items: [row], total: 1, limit: 20, offset: 0 }, action: null };
  const store = {
    subscribe: () => () => {},
    getSnapshot: () => state,
    actions: { loadAllSessions: async () => {}, restoreSession: async () => {} },
  };
  const html = renderToStaticMarkup(React.createElement(SessionListPage, { archived: true, embedded: true, store }));
  assert.match(html, /归档会话/);
  assert.match(html, /搜索归档会话/);
  assert.match(html, /历史架构讨论/);
  assert.match(html, /恢复会话/);
  assert.match(html, /归档于/);

  assert.throws(() => createNavigationStore({ initialPage: "archive" }), /unknown Workbench page/);
});

test("project session list keeps a visible locked project scope", () => {
  const state = { sessionPage: { items: [], total: 0, limit: 20, offset: 0 }, action: null };
  const store = {
    subscribe: () => () => {},
    getSnapshot: () => state,
    actions: { loadAllSessions: async () => {} },
  };
  const html = renderToStaticMarkup(React.createElement(SessionListPage, {
    store,
    initialScope: { kind: "project", id: 7, name: "DSH Research" },
  }));
  assert.match(html, /DSH Research/);
  assert.match(html, /仅显示该项目会话/);
  assert.doesNotMatch(html, /<option value="knowledge_base">知识库<\/option>/);
});

test("right rail follows the project, knowledge-base, and independent tool matrix", () => {
  assert.deepEqual(PROJECT_TOOL_TABS.map(([id, label]) => [id, label]), [
    ["todos", "待办"],
    ["schedule", "定时任务"],
    ["files", "会话文件"],
    ["knowledge", "关联知识芯片"],
    ["summary", "每日总结"],
    ["skills", "Skills"],
  ]);
  assert.deepEqual(KNOWLEDGE_TOOL_TABS.map((item) => item[1]), ["会话文件", "芯片文档", "索引", "关联项目", "全局定时"]);
  assert.deepEqual(INDEPENDENT_TOOL_TABS.map((item) => item[1]), ["会话文件", "Subagent", "全局定时"]);
  assert.equal(KNOWLEDGE_TOOL_TABS.some(([id]) => id === "skills"), false);
  assert.equal(INDEPENDENT_TOOL_TABS.some(([id]) => id === "skills"), false);

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
      linkedKnowledgeBases: [], documents: [], schedules: [], globalSchedules: [], contextBySession: {}, sessionFilesBySession: {},
    };
    const store = { getSnapshot: () => state, subscribe: () => () => {}, actions: {} };
    const html = renderToStaticMarkup(React.createElement(WorkbenchSessionShell, { sessionId, open: true, store, layoutMode: "desktop" }));
    for (const [, label] of labels) assert.match(html, new RegExp(label));
    if (kind === "independent") {
      assert.match(html, /直接注入当前轮上下文/);
      assert.match(html, /不会向量化/);
      assert.match(html, /type="file"/);
      assert.match(html, /multiple=""/);
      assert.doesNotMatch(html, />上下文</);
      assert.doesNotMatch(html, /无默认继承来源/);
    }
  }
});

test("project Skills panel binds to the current project without global controls", () => {
  const state = {
    skillCatalogs: {
      "project:7": {
        status: "ready",
        data: {
          scope: { kind: "project", projectId: 7 },
          rootPath: "/project/.dsh/skills",
          items: [{
            name: "release-notes",
            description: "Draft release notes from the current project context.",
            state: "enabled",
            health: "valid",
            path: "/project/.dsh/skills/release-notes",
            fileCount: 2,
            shadowsGlobal: true,
          }],
          diagnostics: [],
        },
        error: null,
      },
    },
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: { loadSkills: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(ProjectSkillsPanel, { store, projectId: 7 }));
  assert.match(html, /项目 Skills/);
  assert.match(html, /\.dsh\/skills\//);
  assert.match(html, /title="\/project\/\.dsh\/skills"/);
  assert.match(html, /title="\/project\/\.dsh\/skills\/release-notes"/);
  assert.match(html, /2 个文件 · \.dsh\/skills\/release-notes/);
  assert.match(html, /release-notes/);
  assert.match(html, /覆盖全局版本/);
  assert.match(html, /导入 Skill/);
  assert.doesNotMatch(html, /选择项目/);
});

test("right rail tabs use unique accessible ids and roving keyboard tab stops", () => {
  const state = {
    projects: [{ id: 7, name: "Research" }],
    workbenchSessions: {
      "session-cpwb-project-a": { sessionId: "session-cpwb-project-a", scope: { kind: "project", id: 7 }, title: "A" },
      "session-cpwb-project-b": { sessionId: "session-cpwb-project-b", scope: { kind: "project", id: 7 }, title: "B" },
    },
    linkedKnowledgeBases: [],
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: { refreshProject: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(WorkbenchSessionShell, { sessionId: "session-cpwb-project-a", open: true, store, layoutMode: "desktop" }),
    React.createElement(WorkbenchSessionShell, { sessionId: "session-cpwb-project-b", open: true, store, layoutMode: "desktop" })));
  const tabMatches = [...html.matchAll(/<button type="button" role="tab" id="([^"]+)"[^>]*tabindex="(-?\d+)"[^>]*aria-selected="([^"]+)"/g)];
  const panelMatches = [...html.matchAll(/<div id="([^"]+)" class="cpwb-project-tool-body" role="tabpanel" aria-label="([^"]+)" aria-labelledby="([^"]+)"/g)];
  const projectToolCount = PROJECT_TOOL_TABS.length;
  assert.equal(tabMatches.length, projectToolCount * 2);
  assert.equal(new Set(tabMatches.map((match) => match[1])).size, projectToolCount * 2);
  for (let offset = 0; offset < tabMatches.length; offset += projectToolCount) {
    assert.equal(tabMatches[offset][2], "0");
    assert.equal(tabMatches[offset][3], "true");
    for (const match of tabMatches.slice(offset + 1, offset + projectToolCount)) assert.equal(match[2], "-1");
  }
  assert.equal(panelMatches.length, 2);
  assert.equal(new Set(panelMatches.map((match) => match[1])).size, 2);
  assert.ok(panelMatches.every((match) => tabMatches.some((tab) => tab[1] === match[3] && tab[3] === "true")));
});

test("server-rendered project skill managers allocate unique import menu ids", () => {
  const snapshot = {
    skillCatalogs: {
      "project:7": { status: "ready", data: { rootPath: "/project-a/.dsh/skills", items: [], diagnostics: [] } },
      "project:8": { status: "ready", data: { rootPath: "/project-b/.dsh/skills", items: [], diagnostics: [] } },
    },
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => snapshot, actions: {} };
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(ProjectSkillsPanel, { store, projectId: 7 }),
    React.createElement(ProjectSkillsPanel, { store, projectId: 8 })));
  const triggerIds = [...html.matchAll(/id="([^"]+-trigger)"[^>]*aria-haspopup="menu"/g)].map((match) => match[1]);
  const menuIds = [...html.matchAll(/<div id="([^"]+)"[^>]*role="menu"/g)].map((match) => match[1]);
  assert.equal(triggerIds.length, 2);
  assert.equal(menuIds.length, 0, "closed SSR menus should not render menu nodes");
  assert.equal(new Set(triggerIds).size, 2);
  assert.ok(triggerIds.every((id) => id.includes("cpwb-skills-import-menu-")));
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

test("global schedules identify their project and expose search, creation, status, and trigger-date filters", () => {
  const state = {
    settings: { timezone: "Asia/Shanghai" },
    projects: [{ id: 1, name: "Workbench" }, { id: 2, name: "Docs" }],
    globalSchedules: [{ id: 7, projectId: 2, name: "每日索引", enabled: true, nextRunAt: "2026-08-23T13:00:00.000Z" }],
  };
  const store = { actions: { loadGlobalSchedules: async () => {}, createGlobalSchedule: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(GlobalSchedulesPanel, { state, store, initialDialog: true }));
  assert.match(html, /全部项目/);
  assert.match(html, /全部状态/);
  assert.match(html, /触发日期/);
  assert.match(html, /aria-label="搜索全局定时任务"/);
  assert.match(html, /新增定时/);
  assert.match(html, /选择所属项目/);
  assert.match(html, /Docs/);
  assert.match(html, /每日索引/);
  assert.doesNotMatch(html, /<select/);
});
