import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  latestOccurrence,
  nextOccurrence,
  parseScheduleRule,
  scheduleRuleFromInput,
} from "../src/host/scheduler.js";
import {
  createKnowledgeBaseReferenceSource,
  decodeKnowledgeBaseReference,
  encodeKnowledgeBaseReference,
  registerKnowledgeBaseReferenceSource,
} from "../src/client/knowledgeReferences.js";
import { createSessionFileReferenceSource } from "../src/client/sessionFileReferences.js";
import { createWorkbenchRagPreStep, deriveSessionTitle } from "../src/host/sessions.js";
import { Automation, buildSummaryMarkdown, filterSchedules } from "../src/client/Automation.js";
import { getNewRecordIds } from "../src/client/arrivalPulse.js";
import { SessionListPage } from "../src/client/SessionListPage.js";
import { Todos, filterTodos, organizeTodos } from "../src/client/Todos.js";

function staticStore(overrides = {}) {
  const state = {
    schedules: [], scheduleRuns: {}, summaries: [], todos: [],
    automation: { summaryEnabled: true, nextDayTodosEnabled: true },
    settings: { timezone: "Asia/Shanghai" }, action: null,
    sessionPage: { items: [], total: 0, limit: 20, offset: 0 },
    ...overrides,
  };
  return {
    getSnapshot: () => state,
    subscribe: () => () => {},
    actions: {
      loadAllSessions: async () => {}, createSchedule: async () => {},
      updateSchedule: async () => {}, deleteSchedule: async () => {},
      runSchedule: async () => {}, runSummary: async () => {},
      deleteSummary: async () => {},
      updateAutomation: async () => {},
    },
  };
}

test("monthly schedules clamp day 31 to the target month's final local day", () => {
  assert.deepEqual(parseScheduleRule("monthly 31 09:30"), {
    kind: "monthly", day: 31, hour: 9, minute: 30,
  });
  assert.equal(
    nextOccurrence("monthly 31 09:30", new Date("2026-02-01T00:00:00.000Z"), "Asia/Shanghai").toISOString(),
    "2026-02-28T01:30:00.000Z",
  );
  assert.equal(
    latestOccurrence("monthly 31 09:30", new Date("2026-03-15T00:00:00.000Z"), "Asia/Shanghai").toISOString(),
    "2026-02-28T01:30:00.000Z",
  );
});

test("schedule form contract derives canonical rules from recurrence and a selected local date-time", () => {
  const startsAt = "2026-08-24T01:15:00.000Z"; // Monday 09:15 in Shanghai.
  assert.equal(scheduleRuleFromInput({ recurrence: "once", startsAt }, "Asia/Shanghai"), "once 2026-08-24T01:15:00.000Z");
  assert.equal(scheduleRuleFromInput({ recurrence: "daily", startsAt }, "Asia/Shanghai"), "daily 09:15");
  assert.equal(scheduleRuleFromInput({ recurrence: "weekly", startsAt }, "Asia/Shanghai"), "weekly mon 09:15");
  assert.equal(scheduleRuleFromInput({ recurrence: "monthly", startsAt }, "Asia/Shanghai"), "monthly 24 09:15");
});

test("knowledge-base references round-trip and expose only matching knowledge bases in the native @ menu", async () => {
  const ref = encodeKnowledgeBaseReference({ id: 7, name: "产品规范" });
  assert.deepEqual(decodeKnowledgeBaseReference(ref), { id: 7, name: "产品规范" });

  const source = createKnowledgeBaseReferenceSource({
    getKnowledgeBases: () => [{ id: 7, name: "产品规范", description: "PRD 与接口" }, { id: 8, name: "运维手册" }],
  });
  const candidates = await source.candidates({ sessionId: "session-cpwb-1" }, {
    query: "产品", position: "inline", signal: new AbortController().signal,
  });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].section, "知识库");
  const picked = source.onPick({ candidate: candidates[0] });
  assert.equal(picked.insert.source, "cpwbKnowledge");
  assert.equal(picked.insert.label, "产品规范");
  assert.match(await source.codec.serialize(picked.insert.ref), /^<cpwb_knowledge_base /);
});

test("knowledge-base reference source registers through the injected rc.2 service face", () => {
  let registered;
  const ctx = {
    inputTriggers: { registerSource(source) { registered = source; return () => {}; } },
    effect(effect) { return effect(); },
  };
  registerKnowledgeBaseReferenceSource(ctx, staticStore({ knowledgeBases: [] }));
  assert.equal(registered.name, "cpwbKnowledge");
});

test("session-file references list only the active session and fail before send for unusable context", async () => {
  const state = {
    sessionFilesBySession: {
      "session-cpwb-1": [
        { id: 1, originalName: "产品 规范.md", parseStatus: "ready", contextCodePoints: 120 },
        { id: 2, originalName: "损坏.pdf", parseStatus: "failed", contextCodePoints: 0 },
      ],
      "session-cpwb-2": [{ id: 3, originalName: "其他.txt", parseStatus: "ready", contextCodePoints: 20 }],
    },
  };
  const loads = [];
  const store = {
    getSnapshot: () => state,
    subscribe: () => () => {},
    actions: { async loadSessionFiles(sessionId) { loads.push(sessionId); } },
  };
  const source = createSessionFileReferenceSource({ store });
  const session = { sessionId: "session-cpwb-1" };
  const candidates = await source.candidates(session, { query: "产品", signal: new AbortController().signal });
  assert.deepEqual(candidates.map((item) => item.name), ["产品 规范.md"]);
  assert.deepEqual(source.onPick({ session, candidate: candidates[0] }), { text: "@文件/产品 规范.md " });
  assert.deepEqual(source.lexicon(session), ["@文件/产品 规范.md", "@文件/损坏.pdf"]);
  await assert.rejects(
    source.matchEnter(session, "请读 @文件/损坏.pdf"),
    /解析失败/,
  );
  assert.deepEqual(loads, ["session-cpwb-1", "session-cpwb-1"]);
});

test("session-file references stay invisible in native non-Workbench sessions", async () => {
  let loads = 0;
  const store = {
    getSnapshot: () => ({ sessionFilesBySession: {} }),
    subscribe: () => { throw new Error("native sessions must not subscribe to the File Vault"); },
    actions: { async loadSessionFiles() { loads += 1; } },
  };
  const source = createSessionFileReferenceSource({ store });
  const session = { sessionId: "session-native-1" };
  assert.deepEqual(await source.candidates(session, { query: "", signal: new AbortController().signal }), []);
  assert.equal(source.lexicon(session), undefined);
  assert.equal(await source.matchEnter(session, "@文件/本地.md"), undefined);
  assert.equal(typeof source.subscribeLexicon(session, () => {}), "function");
  assert.equal(loads, 0);
});

test("first natural sentence becomes a stable independent-session title", () => {
  assert.equal(deriveSessionTitle("请帮我检查登录流程。后面再看部署。"), "请帮我检查登录流程");
  assert.equal(deriveSessionTitle("  @产品规范\n重新设计一下首页布局  "), "重新设计一下首页布局");
  assert.equal(deriveSessionTitle("a".repeat(80)).length, 48);
});

test("an independent native conversation retrieves every explicitly referenced knowledge base and records its first title", async () => {
  const calls = [];
  const titles = [];
  const step = createWorkbenchRagPreStep({
    scope: { kind: "independent", scopeId: null },
    retriever: { search: async (input) => { calls.push(input); return [{ sourceId: input.scopeId, locator: "p1", text: "hit" }]; } },
    onQuestion: async (question) => titles.push(question),
  });
  const question = '<cpwb_knowledge_base id="7" name="产品规范" /> 请检查登录流程';
  const decision = await step({ signal: new AbortController().signal }, async () => ({
    kind: "enter",
    messages: [{ source: { kind: "user" }, content: [{ type: "text", text: question }] }],
  }));
  assert.equal(calls.length, 1);
  assert.deepEqual({ scope: calls[0].scope, scopeId: calls[0].scopeId, query: calls[0].query }, { scope: "knowledgeBase", scopeId: 7, query: "请检查登录流程" });
  assert.deepEqual(titles, [question]);
  assert.equal(decision.messages[0].source.form, "recall");
});

test("schedule UI uses a compact add action and exposes date-time plus recurrence in its dialog", () => {
  const html = renderToStaticMarkup(React.createElement(Automation, { store: staticStore(), projectId: 1, view: "schedule", initialDialog: "create" }));
  assert.match(html, /新增定时任务/);
  assert.match(html, /type="date"/);
  assert.match(html, /type="time"/);
  assert.match(html, /每日/);
  assert.match(html, /每周/);
  assert.match(html, /每月/);
  assert.match(html, /aria-label="搜索定时任务"/);
  assert.doesNotMatch(html, /daily 21:00 \/ weekly/);
  assert.deepEqual(filterSchedules([{ name: "生成周报" }, { name: "同步索引" }], "周报").map((row) => row.name), ["生成周报"]);
});

test("todo UI separates completed items and groups pending items by local date status", () => {
  const todos = [
    { id: 1, title: "过期", done: false, overdue: true, source: "manual", dueAt: "2026-08-22T02:00:00.000Z", createdAt: "2026-08-20T02:00:00.000Z", completedAt: null },
    { id: 2, title: "今天", done: false, overdue: false, source: "manual", dueAt: "2026-08-23T10:00:00.000Z", createdAt: "2026-08-20T02:00:00.000Z", completedAt: null },
    { id: 3, title: "明天", done: false, overdue: false, source: "auto", dueAt: "2026-08-24T10:00:00.000Z", createdAt: "2026-08-20T02:00:00.000Z", completedAt: null },
    { id: 4, title: "稍后", done: false, overdue: false, source: "manual", dueAt: "2026-08-25T06:00:00.000Z", createdAt: "2026-08-20T02:00:00.000Z", completedAt: null },
    { id: 5, title: "已经完成", done: true, overdue: false, source: "manual", dueAt: "2026-08-22T02:00:00.000Z", createdAt: "2026-08-20T02:00:00.000Z", completedAt: "2026-08-23T03:00:00.000Z" },
  ];
  const input = { timeZone: "Asia/Shanghai", now: new Date("2026-08-23T01:00:00.000Z") };

  assert.deepEqual(organizeTodos(todos, { ...input, view: "pending" }).map((section) => ({
    key: section.key,
    label: section.label,
    ids: section.items.map((item) => item.id),
  })), [
    { key: "overdue", label: "已过期", ids: [1] },
    { key: "2026-08-23", label: "今天，周日", ids: [2] },
    { key: "2026-08-24", label: "明天，周一", ids: [3] },
    { key: "2026-08-25", label: "8月25日，周二", ids: [4] },
  ]);
  assert.deepEqual(organizeTodos(todos, { ...input, view: "completed" }).flatMap((section) => section.items.map((item) => item.id)), [5]);

  const store = staticStore({ todos });
  store.actions.updateTodo = async () => {};
  store.actions.createTodo = async () => {};
  store.actions.deleteTodo = async () => {};
  const html = renderToStaticMarkup(React.createElement(Todos, { store, projectId: 1, now: input.now }));
  assert.match(html, /role="tablist"/);
  assert.match(html, />待处理<.*>4</);
  assert.match(html, />已完成<.*>1</);
  assert.match(html, /cpwb-todo-overdue/);
  assert.match(html, /aria-label="删除待办 过期"/);
  assert.match(html, /aria-label="搜索待办"/);
  assert.doesNotMatch(html, /已经完成/);
  assert.deepEqual(filterTodos(todos, "今天").map((row) => row.id), [2]);
});

test("summary generation uses a quiet pulse rail and keeps failure feedback explicit", () => {
  const summary = { id: 9, projectId: 1, summaryDate: "2026-08-22", status: "completed", content: "今日完成接口联调。" };
  const running = renderToStaticMarkup(React.createElement(Automation, {
    store: staticStore({ projects: [{ id: 1, name: "智能陪练" }], summaries: [summary], action: { type: "runSummary", status: "running" } }),
    projectId: 1,
    view: "summary",
  }));
  assert.match(running, /cpwb-generation-wave/);
  assert.match(running, /项目日志/);
  assert.match(running, /<details class="cpwb-summary-entry/);
  assert.match(running, /aria-label="正在生成每日总结"/);
  assert.doesNotMatch(running, /执行中|生成中|已完成/);
  assert.match(running, /aria-label="下载 2026-08-22 每日总结"/);
  assert.match(running, /aria-label="删除 2026-08-22 每日总结"/);

  const failed = renderToStaticMarkup(React.createElement(Automation, {
    store: staticStore({ summaries: [summary], action: { type: "runSummary", status: "error", error: { message: "模型不可用" } } }),
    projectId: 1,
    view: "summary",
  }));
  assert.match(failed, /模型不可用/);
});

test("summary and todo deletion success removes the row without a completion notice", () => {
  const summaryHtml = renderToStaticMarkup(React.createElement(Automation, {
    store: staticStore({ summaries: [], action: { type: "deleteSummary", status: "done" } }),
    projectId: 1,
    view: "summary",
  }));
  assert.doesNotMatch(summaryHtml, /cpwb-status-success/);
  assert.doesNotMatch(summaryHtml, />已完成</);

  const todoStore = staticStore({ todos: [], action: { type: "todo", status: "done" } });
  todoStore.actions.updateTodo = async () => {};
  todoStore.actions.createTodo = async () => {};
  todoStore.actions.deleteTodo = async () => {};
  const todoHtml = renderToStaticMarkup(React.createElement(Todos, { store: todoStore, projectId: 1 }));
  assert.doesNotMatch(todoHtml, /cpwb-status-success/);
});

test("arrival pulse ignores initial records and selects only newly inserted record ids", () => {
  assert.deepEqual(getNewRecordIds(null, [1, 2]), []);
  assert.deepEqual(getNewRecordIds(new Set(["1", "2"]), [2, 3, 4]), ["3", "4"]);
  assert.deepEqual(getNewRecordIds(new Set(["1", "2"]), [2, 1]), []);
});

test("summary Markdown download content is UTF-8 friendly and filename-safe", () => {
  assert.deepEqual(buildSummaryMarkdown({
    projectName: "智能/陪练:项目",
    summary: { summaryDate: "2026-08-22", status: "completed", content: "今日完成接口联调。" },
  }), {
    filename: "智能-陪练-项目-2026-08-22-每日总结.md",
    content: "# 智能/陪练:项目 每日总结\n\n- 日期：2026-08-22\n- 状态：已完成\n\n今日完成接口联调。\n",
  });
});

test("failed summaries show retry guidance and cannot be downloaded as report content", () => {
  const html = renderToStaticMarkup(React.createElement(Automation, {
    store: staticStore({ summaries: [{ id: 9, projectId: 1, summaryDate: "2026-08-22", status: "failed", content: null }] }),
    projectId: 1,
    view: "summary",
  }));

  assert.match(html, /生成失败，请重新生成/);
  assert.doesNotMatch(html, /下载 2026-08-22 每日总结/);
  assert.match(html, /删除 2026-08-22 每日总结/);
});

test("session-list page renders a full-width identity header with its count", () => {
  const html = renderToStaticMarkup(React.createElement(SessionListPage, { store: staticStore({
    sessionPage: { items: [], total: 12, limit: 20, offset: 0 },
  }) }));
  assert.match(html, /cpwb-page-header-main/);
  assert.match(html, /<strong>12<\/strong><span>条会话<\/span>/);
});
