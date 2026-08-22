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
import { createWorkbenchRagPreStep, deriveSessionTitle } from "../src/host/sessions.js";
import { Automation, buildSummaryMarkdown } from "../src/client/Automation.js";
import { SessionListPage } from "../src/client/SessionListPage.js";

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
  assert.doesNotMatch(html, /daily 21:00 \/ weekly/);
});

test("summary UI exposes generation feedback plus download and delete actions", () => {
  const summary = { id: 9, projectId: 1, summaryDate: "2026-08-22", status: "completed", content: "今日完成接口联调。" };
  const running = renderToStaticMarkup(React.createElement(Automation, {
    store: staticStore({ projects: [{ id: 1, name: "智能陪练" }], summaries: [summary], action: { type: "runSummary", status: "running" } }),
    projectId: 1,
    view: "summary",
  }));
  assert.match(running, /生成中/);
  assert.match(running, /执行中/);
  assert.match(running, /aria-label="下载 2026-08-22 每日总结"/);
  assert.match(running, /aria-label="删除 2026-08-22 每日总结"/);

  const failed = renderToStaticMarkup(React.createElement(Automation, {
    store: staticStore({ summaries: [summary], action: { type: "runSummary", status: "error", error: { message: "模型不可用" } } }),
    projectId: 1,
    view: "summary",
  }));
  assert.match(failed, /模型不可用/);
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
