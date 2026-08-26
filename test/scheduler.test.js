import { test } from "node:test";
import assert from "node:assert/strict";

import { createScheduler, isWithinCatchUpWindow, nextOccurrence, isTodoDueOnLocalDate } from "../src/host/scheduler.js";
import { localDateKey, localDateTimeParts } from "../src/host/timezone.js";

const at = (value) => new Date(value);

function makeRepos({ schedules = [], projects = [], automation = {}, runRows = new Map(), todos = [], summary = null, scheduleRuns = {}, knowledgeBases = [], knowledgeDocuments = {}, knowledgeChunks = {} } = {}) {
  const calls = { claims: [], complete: [], failed: [], missed: [], bound: [], reconciled: [], summaries: [], todos: [] };
  return {
    calls,
    projects: { list: () => projects },
    automation: { get: (projectId) => automation[projectId] ?? { summaryEnabled: true, nextDayTodosEnabled: true } },
    schedules: {
      list: () => schedules,
      listRuns(scheduleId) { return scheduleRuns[scheduleId] ?? []; },
      claimRun(input) {
        calls.claims.push(input);
        const key = input.scheduleId + ":" + input.scheduledAt;
        if (runRows.has(key)) return { ...runRows.get(key), claimed: false };
        const row = { id: calls.claims.length, ...input, status: "running" };
        runRows.set(key, row);
        return { ...row, claimed: true };
      },
      completeRun(input) { calls.complete.push(input); return { ...input, status: "completed" }; },
      failRun(input) { calls.failed.push(input); return { ...input, status: "failed" }; },
      missRun(input) { calls.missed.push(input); return { ...input, status: "missed" }; },
      bindSession(input) { calls.bound.push(input); return { ...schedules.find((row) => row.id === input.id), sessionId: input.sessionId }; },
      failRunning(input) { calls.reconciled.push(input); return 0; },
    },
    summaries: {
      getByProjectDate() { return summary; },
      upsert(input) { calls.summaries.push(input); return input; },
    },
    todos: {
      list: () => todos,
      create(input) { calls.todos.push(input); return input; },
    },
    projectKnowledgeBases: { listByProject: () => knowledgeBases },
    documents: { listByKnowledgeBase: (knowledgeBaseId) => knowledgeDocuments[knowledgeBaseId] ?? [] },
    chunks: { listByDocument: (documentId) => knowledgeChunks[documentId] ?? [] },
  };
}

test("scheduler startup closes runs orphaned by an earlier process", () => {
  const repos = makeRepos();
  const now = at("2026-08-25T16:00:00.000+08:00");
  const scheduler = createScheduler({ repos, clock: () => now, runPrompt: async () => ({}) });

  scheduler.start();
  scheduler.stop();

  assert.deepEqual(repos.calls.reconciled, [{
    error: "interrupted: Workbench restarted before the scheduled run completed",
    finishedAt: now,
  }]);
});

test("scheduler executes a due daily rule once and ignores a not-due rule", async () => {
  const repos = makeRepos({ schedules: [
    { id: 1, projectId: 7, name: "daily", rule: "daily 21:00", prompt: "check", enabled: true },
    { id: 2, projectId: 7, name: "later", rule: "daily 22:00", prompt: "later", enabled: true },
  ] });
  const prompts = [];
  const scheduler = createScheduler({ repos, clock: () => at("2026-08-20T21:00:05.000+08:00"), runPrompt: async (input) => {
    prompts.push(input);
    return { sessionId: "session-1" };
  } });

  await scheduler.tick();
  await scheduler.tick();

  assert.equal(prompts.length, 1);
  assert.equal(prompts[0].prompt, "check");
  assert.equal(repos.calls.complete.length, 1);
  assert.equal(repos.calls.claims.length, 2, "duplicate ticks may claim-check but only one execution is allowed");
});

test("scheduler skips disabled rules and marks an occurrence older than 24 hours missed", async () => {
  const repos = makeRepos({ schedules: [
    { id: 1, projectId: 7, name: "off", rule: "daily 21:00", enabled: false },
    { id: 2, projectId: 7, name: "old", rule: "once 2026-08-18T20:00:00.000+08:00", enabled: true },
  ] });
  const scheduler = createScheduler({ repos, clock: () => at("2026-08-20T21:00:05.000+08:00"), runPrompt: async () => ({ sessionId: "never" }) });

  await scheduler.tick();

  assert.equal(repos.calls.claims.length, 1);
  assert.equal(repos.calls.missed.length, 1);
  assert.equal(repos.calls.complete.length, 0);
});

test("21:00 summary and next-day todo toggles are independent", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }, { id: 2 }],
    automation: {
      1: { summaryEnabled: true, nextDayTodosEnabled: false },
      2: { summaryEnabled: false, nextDayTodosEnabled: true },
    },
  });
  const prompts = [];
  const scheduler = createScheduler({
    repos,
    clock: () => at("2026-08-20T21:00:00.000+08:00"),
    projectConversations: async ({ projectId }) => projectId === 2
      ? [{ sessionId: "session-project-2", messages: [{ role: "user", text: "Tomorrow follow up both items" }] }]
      : [],
    runPrompt: async (input) => {
      prompts.push(input);
      return { sessionId: "session-" + prompts.length, text: input.kind === "todo" ? "- Plan item one\n- Plan item two" : "Summary" };
    },
  });

  await scheduler.tick();

  assert.deepEqual(prompts.map((p) => [p.kind, p.projectId]), [["summary", 1], ["todo", 2]]);
  assert.equal(repos.calls.summaries.length, 2, "summary is first persisted as pending, then completed");
  assert.equal(repos.calls.todos.length, 2);
  assert.ok(repos.calls.todos.every((todo) => todo.source === "auto" && todo.dueAt === new Date("2026-08-21T18:00:00").toISOString()));
});

test("daily summary prompt includes todo changes, schedule outcomes, and todo completion", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    schedules: [{ id: 4, projectId: 1, name: "nightly", rule: "daily 21:00", enabled: true }],
    todos: [{ id: 8, title: "Ship patch", done: true, completedAt: "2026-08-20T10:00:00.000Z", dueAt: "2026-08-20T18:00:00.000Z", source: "manual" }],
    scheduleRuns: { 4: [{ scheduleId: 4, status: "completed", sessionId: "session-scheduled-1", scheduledAt: "2026-08-20T21:00:00.000Z", finishedAt: "2026-08-20T13:00:00.000Z" }] },
  });
  let prompt;
  const scheduler = createScheduler({ repos, runPrompt: async (input) => { prompt = input.prompt; return { text: "ok" }; } });

  await scheduler.runSummary({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-20");

  assert.match(prompt, /待办完成情况：/);
  assert.match(prompt, /Ship patch/);
  assert.match(prompt, /定时任务执行结果：/);
  assert.match(prompt, /session-scheduled-1/);
  assert.match(prompt, /项目会话正文：\[\]/);
  assert.match(prompt, /待办完成情况：/);
  assert.match(prompt, /"done":true/);
  assert.match(prompt, /"completedAt":"2026-08-20T10:00:00.000Z"/);
  assert.match(prompt, /不要调用任何工具/);
  assert.match(prompt, /仅输出最终中文总结正文/);
});

test("daily summary includes all project conversation text and newly added knowledge content", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    knowledgeBases: [
      { id: 2, name: "产品知识库", createdAt: "2026-08-19T01:00:00.000Z" },
      { id: 3, name: "今日新建知识库", createdAt: "2026-08-20T02:00:00.000Z" },
    ],
    knowledgeDocuments: {
      2: [
        { id: 8, originalName: "今日方案.md", status: "ready", createdAt: "2026-08-20T03:00:00.000Z", indexedAt: "2026-08-20T03:01:00.000Z" },
        { id: 9, originalName: "旧资料.md", status: "ready", createdAt: "2026-08-18T03:00:00.000Z", indexedAt: "2026-08-18T03:01:00.000Z" },
      ],
    },
    knowledgeChunks: {
      8: [{ locator: "lines:1-2", heading: "方案", text: "知识库新增了首页验收标准。" }],
    },
  });
  let prompt;
  const scheduler = createScheduler({
    repos,
    projectConversations: async () => [{
      sessionId: "session-project-1",
      title: "交付讨论",
      messages: [
        { role: "user", text: "今天完成首页重构", time: Date.parse("2026-08-20T04:00:00.000Z") },
        { role: "assistant", text: "首页重构已通过测试", time: Date.parse("2026-08-20T04:01:00.000Z") },
      ],
    }],
    runPrompt: async (input) => { prompt = input.prompt; return { text: "ok" }; },
  });

  await scheduler.runSummary({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-20");

  assert.match(prompt, /项目会话正文：/);
  assert.match(prompt, /今天完成首页重构/);
  assert.match(prompt, /首页重构已通过测试/);
  assert.match(prompt, /知识库新增内容：/);
  assert.match(prompt, /今日方案\.md/);
  assert.match(prompt, /知识库新增了首页验收标准/);
  assert.match(prompt, /今日新建知识库/);
  assert.doesNotMatch(prompt, /旧资料\.md/);
  assert.doesNotMatch(prompt, /知识库会话正文/);
});

test("daily automations render the latest custom prompts and keep runtime project data", async () => {
  const repos = makeRepos({
    todos: [{ title: "Ship patch", done: false, dueAt: "2026-08-21T10:00:00.000Z", source: "manual" }],
  });
  const prompts = [];
  let configured = {
    summaryPrompt: "CUSTOM SUMMARY {{projectId}} {{date}}",
    todoPrompt: "CUSTOM TODO {{projectId}} {{date}} {{nextDate}}",
  };
  const scheduler = createScheduler({
    repos,
    automationPrompts: () => configured,
    projectConversations: async () => [{ sessionId: "session-project-7", messages: [{ role: "user", text: "Follow up tomorrow" }] }],
    runPrompt: async (input) => { prompts.push(input); return { text: input.kind === "todo" ? "- Follow up" : "ok" }; },
  });

  await scheduler.runSummary({ id: 7 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-20");
  configured = { ...configured, todoPrompt: "UPDATED TODO {{projectId}} {{date}} {{nextDate}}" };
  await scheduler.runAutoTodos({ id: 7 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

  assert.match(prompts[0].prompt, /^CUSTOM SUMMARY 7 2026-08-20/);
  assert.match(prompts[0].prompt, /待办完成情况：.*Ship patch/);
  assert.match(prompts[1].prompt, /^UPDATED TODO 7 2026-08-20 2026-08-21/);
  assert.match(prompts[1].prompt, /已有未完成待办（仅用于去重，禁止重复输出）：.*Ship patch/);
});

test("daily summary never persists leaked DSML as completed content", async () => {
  const repos = makeRepos({ projects: [{ id: 1 }] });
  const scheduler = createScheduler({
    repos,
    runPrompt: async () => ({
      sessionId: "session-summary-invalid",
      text: '<｜｜DSML｜｜tool_calls><｜｜DSML｜｜invoke name="bash"></｜｜DSML｜｜invoke></｜｜DSML｜｜tool_calls>',
    }),
  });

  await assert.rejects(
    () => scheduler.runSummary({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-20"),
    /工具调用协议/,
  );

  assert.deepEqual(repos.calls.summaries.map((row) => row.status), ["pending", "failed"]);
  assert.equal(repos.calls.summaries[1].content, null);
});

test("daily summary rejects flattened thinking text and stores no error as summary content", async () => {
  const repos = makeRepos({ projects: [{ id: 1 }] });
  const scheduler = createScheduler({
    repos,
    runPrompt: async () => ({ text: "思考：先分析项目。\n最终总结：今日完成联调。" }),
  });

  await assert.rejects(
    () => scheduler.runSummary({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-20"),
    /分析过程/,
  );

  assert.deepEqual(repos.calls.summaries.map((row) => [row.status, row.content]), [
    ["pending", null],
    ["failed", null],
  ]);
});

test("failed forced regeneration preserves the previous completed summary", async () => {
  const previous = { id: 9, projectId: 1, summaryDate: "2026-08-20", status: "completed", content: "上一版有效总结" };
  const repos = makeRepos({ projects: [{ id: 1 }], summary: previous });
  const scheduler = createScheduler({ repos, runPrompt: async () => { throw new Error("provider unavailable"); } });

  await assert.rejects(
    () => scheduler.runSummary({ id: 1 }, at("2026-08-20T21:10:00.000+08:00"), "2026-08-20", "Asia/Shanghai", { force: true }),
    /provider unavailable/,
  );

  assert.deepEqual(repos.calls.summaries.map((row) => [row.status, row.content]), [
    ["pending", null],
    ["completed", "上一版有效总结"],
  ]);
});

test("failed forced regeneration discards a legacy protocol leak instead of restoring it", async () => {
  const previous = {
    id: 9,
    projectId: 1,
    summaryDate: "2026-08-20",
    status: "completed",
    content: '<｜｜DSML｜｜tool_calls><｜｜DSML｜｜invoke name="bash"></｜｜DSML｜｜invoke></｜｜DSML｜｜tool_calls>',
  };
  const repos = makeRepos({ projects: [{ id: 1 }], summary: previous });
  const scheduler = createScheduler({ repos, runPrompt: async () => { throw new Error("provider unavailable"); } });

  await assert.rejects(
    () => scheduler.runSummary({ id: 1 }, at("2026-08-20T21:10:00.000+08:00"), "2026-08-20", "Asia/Shanghai", { force: true }),
    /provider unavailable/,
  );

  assert.deepEqual(repos.calls.summaries.map((row) => [row.status, row.content]), [
    ["pending", null],
    ["failed", null],
  ]);
});

test("scheduled summary failure does not stop next-day todo generation", async () => {
  const repos = makeRepos({ projects: [{ id: 1 }], automation: { 1: { summaryEnabled: true, nextDayTodosEnabled: true } } });
  const scheduler = createScheduler({
    repos,
    clock: () => at("2026-08-20T21:00:00.000+08:00"),
    projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "明日继续联调" }] }],
    runPrompt: async ({ kind }) => {
      if (kind === "summary") throw new Error("provider failed summary");
      return { text: "- 明日继续联调" };
    },
  });

  await scheduler.tick();

  assert.deepEqual(repos.calls.summaries.map((row) => [row.status, row.content]), [["pending", null], ["failed", null]]);
  assert.equal(repos.calls.todos.length, 1);
  assert.equal(repos.calls.todos[0].title, "明日继续联调");
});

test("manual summary generation can replace an existing summary for the same day", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    summary: { id: 9, projectId: 1, summaryDate: "2026-08-20", status: "completed", content: "old" },
  });
  const scheduler = createScheduler({ repos, runPrompt: async () => ({ text: "新的最终总结" }) });

  await scheduler.runSummary(
    { id: 1 },
    at("2026-08-20T21:10:00.000+08:00"),
    "2026-08-20",
    "Asia/Shanghai",
    { force: true },
  );

  assert.deepEqual(repos.calls.summaries.map((row) => [row.status, row.content]), [
    ["pending", null],
    ["completed", "新的最终总结"],
  ]);
});

test("next-day todo generation skips the model when the project has no conversation or new knowledge", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    todos: [{ projectId: 1, title: "Existing todo", done: false, source: "manual" }],
  });
  let promptCalls = 0;
  const scheduler = createScheduler({
    repos,
    projectConversations: async () => [],
    runPrompt: async () => {
      promptCalls += 1;
      return { text: "- Should not be created" };
    },
  });

  const result = await scheduler.runAutoTodos({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

  assert.deepEqual(result, []);
  assert.equal(promptCalls, 0);
  assert.deepEqual(repos.calls.todos, []);
});

test("next-day todo prompt uses project conversations and new knowledge while existing todos are exclusions only", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    todos: [{ projectId: 1, title: "已有待办", done: false, dueAt: "2026-08-21T10:00:00.000Z", source: "manual" }],
    knowledgeBases: [{ id: 2, name: "今日知识芯片", createdAt: "2026-08-20T02:00:00.000Z" }],
    knowledgeDocuments: {
      2: [{ id: 8, originalName: "验收标准.md", status: "ready", createdAt: "2026-08-20T03:00:00.000Z", indexedAt: "2026-08-20T03:01:00.000Z" }],
    },
    knowledgeChunks: {
      8: [{ locator: "lines:1-2", heading: "验收", text: "需要补充移动端验收。" }],
    },
  });
  let prompt;
  const scheduler = createScheduler({
    repos,
    projectConversations: async () => [{
      sessionId: "session-project-1",
      title: "今日讨论",
      messages: [
        { role: "user", text: "移动端还有一个布局问题", time: Date.parse("2026-08-20T04:00:00.000Z") },
        { role: "assistant", text: "需要在明天补测窄屏布局", time: Date.parse("2026-08-20T04:01:00.000Z") },
      ],
    }],
    runPrompt: async (input) => {
      prompt = input.prompt;
      return { text: "NONE" };
    },
  });

  const result = await scheduler.runAutoTodos({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

  assert.deepEqual(result, []);
  assert.match(prompt, /项目会话正文：/);
  assert.match(prompt, /移动端还有一个布局问题/);
  assert.match(prompt, /需要在明天补测窄屏布局/);
  assert.match(prompt, /知识库新增内容：/);
  assert.match(prompt, /验收标准\.md/);
  assert.match(prompt, /需要补充移动端验收/);
  assert.match(prompt, /已有未完成待办（仅用于去重，禁止重复输出）：/);
  assert.match(prompt, /已有待办/);
  assert.match(prompt, /没有明确待办时只输出 NONE/);
  assert.match(prompt, /每行只输出一项并以“- ”开头/);
});

test("next-day todo generation rejects a legacy todos array without final assistant text", async () => {
  const repos = makeRepos({ projects: [{ id: 1 }] });
  const scheduler = createScheduler({
    repos,
    projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "明天处理问题" }] }],
    runPrompt: async () => ({ todos: ["Should never persist"] }),
  });

  const result = await scheduler.runAutoTodos({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

  assert.equal(result.status, "failed");
  assert.match(result.error, /最终待办内容/);
  assert.deepEqual(repos.calls.todos, []);
});

test("next-day todo generation rejects prose or headings instead of persisting them as todos", async () => {
  const repos = makeRepos({ projects: [{ id: 1 }] });
  const scheduler = createScheduler({
    repos,
    projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "明天完成验收" }] }],
    runPrompt: async () => ({ text: "待办如下：\n- 完成验收" }),
  });

  const result = await scheduler.runAutoTodos({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

  assert.equal(result.status, "failed");
  assert.match(result.error, /待办清单格式/);
  assert.deepEqual(repos.calls.todos, []);
});

test("next-day todo generation rejects tool protocol and thinking text", async () => {
  for (const text of [
    '<｜｜DSML｜｜tool_calls><｜｜DSML｜｜invoke name="bash"></｜｜DSML｜｜invoke></｜｜DSML｜｜tool_calls>',
    "思考：先分析项目。\n- 明天完成验收",
  ]) {
    const repos = makeRepos({ projects: [{ id: 1 }] });
    const scheduler = createScheduler({
      repos,
      projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "明天完成验收" }] }],
      runPrompt: async () => ({ text }),
    });

    const result = await scheduler.runAutoTodos({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

    assert.equal(result.status, "failed");
    assert.deepEqual(repos.calls.todos, []);
  }
});

test("next-day todo generation deduplicates all open todos including timestamp suffix variants", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    todos: [{ projectId: 1, title: "Polish session navigation", done: false, source: "manual" }],
  });
  const scheduler = createScheduler({
    repos,
    projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "明天继续修复实际错误" }] }],
    runPrompt: async () => ({ text: "- Polish session navigation (2026-08-23 10:00)\n- 修复实际错误" }),
  });

  await scheduler.runAutoTodos({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

  assert.deepEqual(repos.calls.todos.map((todo) => todo.title), ["修复实际错误"]);
});

test("next-day todos compare normalized titles and create only missing unique items", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    todos: [{ projectId: 1, title: "Keep existing", source: "auto", dueAt: "2026-08-21T10:00:00.000Z" }],
  });
  const scheduler = createScheduler({
    repos,
    projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "Create the missing item" }] }],
    runPrompt: async () => ({ text: "- Keep existing\n- New item\n- New   item\n- New item" }),
  });

  await scheduler.runAutoTodos({ id: 1 }, at("2026-08-20T21:00:00.000+08:00"), "2026-08-21");

  assert.deepEqual(repos.calls.todos.map((todo) => todo.title), ["New item"]);
});

test("auto todo dueAt is matched by runtime local date, not UTC string prefix", () => {
  assert.equal(isTodoDueOnLocalDate("2026-08-21T01:00:00.000Z", "2026-08-20", "America/Los_Angeles"), true);
  assert.equal(isTodoDueOnLocalDate("2026-08-21T01:00:00.000Z", "2026-08-21", "America/Los_Angeles"), false);
});

test("daily auto todos use the configured timezone for 21:00 and 18:00", async () => {
  const repos = makeRepos({
    projects: [{ id: 1 }],
    automation: { 1: { summaryEnabled: false, nextDayTodosEnabled: true } },
  });
  const scheduler = createScheduler({
    repos,
    timeZone: () => "America/Los_Angeles",
    clock: () => at("2026-08-20T04:00:00.000Z"),
    projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "Create a Los Angeles item" }] }],
    runPrompt: async () => ({ text: "- Los Angeles item" }),
  });
  await scheduler.tick();
  assert.equal(repos.calls.todos[0].dueAt, "2026-08-21T01:00:00.000Z");
});

test("manual schedule runs use now instead of a future nextRunAt occurrence", async () => {
  const repos = makeRepos();
  const now = at("2026-08-20T12:34:56.000+08:00");
  const scheduler = createScheduler({ repos, runPrompt: async () => ({ sessionId: "manual-session" }) });

  await scheduler.runScheduleNow({ id: 7, projectId: 1, prompt: "run now", rule: "daily 21:00", nextRunAt: "2099-01-01T00:00:00.000Z" }, now);

  assert.equal(repos.calls.claims[0].scheduledAt, now.toISOString());
});

test("nextOccurrence computes real once, daily, and weekly future occurrences", () => {
  const now = at("2026-08-20T12:34:56.000+08:00");
  assert.equal(nextOccurrence("once 2099-01-01T00:00:00.000Z", now).toISOString(), "2099-01-01T00:00:00.000Z");
  const daily = nextOccurrence("daily 21:00", now);
  assert.equal(daily.toISOString(), "2026-08-20T13:00:00.000Z");
  const nextDay = nextOccurrence("daily 12:00", now);
  assert.equal(localDateKey(nextDay, "Asia/Shanghai"), "2026-08-21");
  const weekly = nextOccurrence("weekly thu 20:30", now);
  assert.equal(localDateKey(weekly, "Asia/Shanghai"), "2026-08-20");
  assert.equal(localDateTimeParts(weekly, "Asia/Shanghai").hour, 20);
});

test("start immediately catches up the current 21:00 automation once and does not catch up before the slot", async () => {
  const run = async (now) => {
    const repos = makeRepos({ projects: [{ id: 1 }] });
    const prompts = [];
    const scheduler = createScheduler({
      repos,
      clock: () => now,
      projectConversations: async () => [{ sessionId: "session-project-1", messages: [{ role: "user", text: "Create the next item" }] }],
      runPrompt: async (input) => { prompts.push(input); return { text: input.kind === "todo" ? "- New item" : "Summary" }; },
    });
    scheduler.start();
    await new Promise((resolve) => setImmediate(resolve));
    scheduler.stop();
    return prompts;
  };

  const afterSlot = await run(at("2026-08-20T21:05:00.000+08:00"));
  assert.deepEqual(afterSlot.map((input) => input.kind), ["summary", "todo"]);
  const beforeSlot = await run(at("2026-08-20T20:59:00.000+08:00"));
  assert.deepEqual(beforeSlot, []);
});

test("startup catch-up stops after the 24-hour boundary", () => {
  const now = at("2026-08-21T21:00:00.000+08:00");
  assert.equal(isWithinCatchUpWindow(now, new Date(now.getTime() - 24 * 60 * 60 * 1000)), true);
  assert.equal(isWithinCatchUpWindow(now, new Date(now.getTime() - 24 * 60 * 60 * 1000 - 1)), false);
});

test("a failed scheduled DeepSeek run persists session id and error without retrying", async () => {
  const repos = makeRepos({ schedules: [{ id: 1, projectId: 7, name: "fail", rule: "21:00", enabled: true }] });
  let attempts = 0;
  const scheduler = createScheduler({ repos, clock: () => at("2026-08-20T21:00:00.000+08:00"), runPrompt: async () => {
    attempts += 1;
    const error = new Error("DSH DeepSeek provider unavailable");
    error.sessionId = "session-scheduled-failed";
    throw error;
  } });

  await scheduler.tick();
  await scheduler.tick();

  assert.equal(attempts, 1);
  assert.equal(repos.calls.failed.length, 1);
  assert.equal(repos.calls.failed[0].sessionId, "session-scheduled-failed");
  assert.deepEqual(repos.calls.bound, [{ id: 1, sessionId: "session-scheduled-failed" }]);
  assert.match(repos.calls.failed[0].error, /DSH DeepSeek provider unavailable/);
});

test("successful scheduled runs bind the first session and pass it back on later runs", async () => {
  const schedule = { id: 4, projectId: 7, name: "nightly", prompt: "audit", rule: "daily 21:00", enabled: true, sessionId: null };
  const repos = makeRepos({ schedules: [schedule] });
  const inputs = [];
  const scheduler = createScheduler({ repos, runPrompt: async (input) => {
    inputs.push(input);
    return { sessionId: input.schedule.sessionId || "session-scheduled-stable", text: "done" };
  } });

  await scheduler.runScheduleNow(schedule, at("2026-08-20T12:00:00.000Z"));
  assert.deepEqual(repos.calls.bound, [{ id: 4, sessionId: "session-scheduled-stable" }]);
  schedule.sessionId = "session-scheduled-stable";
  await scheduler.runScheduleNow(schedule, at("2026-08-21T12:00:00.000Z"));

  assert.equal(inputs.length, 2);
  assert.equal(inputs[1].schedule.sessionId, "session-scheduled-stable");
  assert.deepEqual(repos.calls.complete.map((row) => row.sessionId), ["session-scheduled-stable", "session-scheduled-stable"]);
});

test("weekly rules execute at the configured local weekday and time", async () => {
  const repos = makeRepos({ schedules: [{ id: 3, projectId: 7, name: "weekly", rule: "weekly thu 20:30", prompt: "weekly check", enabled: true }] });
  const prompts = [];
  const scheduler = createScheduler({ repos, clock: () => at("2026-08-20T20:30:01.000+08:00"), runPrompt: async (input) => {
    prompts.push(input);
    return { sessionId: "weekly-session" };
  } });

  await scheduler.tick();

  assert.equal(prompts.length, 1);
  assert.equal(prompts[0].prompt, "weekly check");
  assert.equal(repos.calls.complete.length, 1);
  assert.equal(repos.calls.complete[0].sessionId, "weekly-session");
});

test("a restart can catch up a persisted daily occurrence, but a first boot does not run yesterday's slot", async () => {
  const make = (schedule) => {
    const repos = makeRepos({ schedules: [schedule] });
    const prompts = [];
    const scheduler = createScheduler({ repos, clock: () => at("2026-08-21T08:00:00.000+08:00"), runPrompt: async (input) => {
      prompts.push(input);
      return { sessionId: "restart-session" };
    } });
    return { repos, prompts, scheduler };
  };

  const firstBoot = make({ id: 4, projectId: 7, rule: "daily 21:00", enabled: true });
  await firstBoot.scheduler.tick();
  assert.equal(firstBoot.prompts.length, 0);

  const restarted = make({ id: 5, projectId: 7, rule: "daily 21:00", lastRunAt: "2026-08-20T20:00:00.000+08:00", enabled: true });
  await restarted.scheduler.tick();
  assert.equal(restarted.prompts.length, 1);
  assert.equal(restarted.repos.calls.complete.length, 1);
});

test("future one-time rules are not claimed", async () => {
  const repos = makeRepos({ schedules: [{ id: 6, projectId: 7, rule: "once 2026-08-22T09:00:00.000+08:00", enabled: true }] });
  const scheduler = createScheduler({ repos, clock: () => at("2026-08-21T08:00:00.000+08:00"), runPrompt: async () => ({ sessionId: "never" }) });

  await scheduler.tick();

  assert.equal(repos.calls.claims.length, 0);
});
