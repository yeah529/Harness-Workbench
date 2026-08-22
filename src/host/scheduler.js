/** Host-side scheduler for ordinary jobs and the 21:00 project automations. */

import {
  DEFAULT_TIME_ZONE,
  addLocalDays,
  localDateKey,
  localDateTimeParts,
  validateTimeZone,
  zonedDateTimeToUtc,
} from "./timezone.js";

const MINUTE_MS = 60 * 1000;
const CATCH_UP_MS = 24 * 60 * MINUTE_MS;
const DAY_MS = 24 * 60 * MINUTE_MS;

const WEEKDAYS = new Map([
  ["sun", 0], ["sunday", 0], ["0", 0],
  ["mon", 1], ["monday", 1], ["1", 1],
  ["tue", 2], ["tuesday", 2], ["2", 2],
  ["wed", 3], ["wednesday", 3], ["3", 3],
  ["thu", 4], ["thursday", 4], ["4", 4],
  ["fri", 5], ["friday", 5], ["5", 5],
  ["sat", 6], ["saturday", 6], ["6", 6],
]);

function localDate(date, timeZone = DEFAULT_TIME_ZONE) {
  return localDateKey(date, timeZone);
}

export function isTodoDueOnLocalDate(value, dueDate, timeZone) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && localDate(date, timeZone) === dueDate;
}

function parseTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/** Parse the documented one-time, daily, weekly, and monthly rule forms. */
export function parseScheduleRule(rule) {
  if (typeof rule !== "string") return null;
  const value = rule.trim();
  const once = /^(?:once\s+)?(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)$/i.exec(value);
  if (once) {
    const date = new Date(once[1]);
    return Number.isNaN(date.getTime()) ? null : { kind: "once", at: date };
  }

  const daily = /^(?:daily\s+)?(\d{1,2}:\d{2})$/i.exec(value);
  if (daily) {
    const time = parseTime(daily[1]);
    return time ? { kind: "daily", ...time } : null;
  }

  const weekly = /^weekly\s+([^\s]+)\s+(\d{1,2}:\d{2})$/i.exec(value);
  if (weekly) {
    const weekday = WEEKDAYS.get(weekly[1].toLowerCase());
    const time = parseTime(weekly[2]);
    return weekday === undefined || !time ? null : { kind: "weekly", weekday, ...time };
  }

  const monthly = /^monthly\s+(\d{1,2})\s+(\d{1,2}:\d{2})$/i.exec(value);
  if (!monthly) return null;
  const day = Number(monthly[1]);
  const time = parseTime(monthly[2]);
  return day < 1 || day > 31 || !time ? null : { kind: "monthly", day, ...time };
}

const WEEKDAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Convert the modal's recurrence + selected instant into the scheduler's canonical rule. */
export function scheduleRuleFromInput({ recurrence, startsAt }, timeZone = DEFAULT_TIME_ZONE) {
  validateTimeZone(timeZone);
  if (!["once", "daily", "weekly", "monthly"].includes(recurrence)) {
    throw new TypeError("recurrence must be once, daily, weekly, or monthly");
  }
  const instant = new Date(startsAt);
  if (!Number.isFinite(instant.getTime())) throw new TypeError("startsAt must be an ISO date-time");
  if (recurrence === "once") return "once " + instant.toISOString();
  const parts = localDateTimeParts(instant, timeZone);
  const time = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
  if (recurrence === "daily") return "daily " + time;
  if (recurrence === "monthly") return "monthly " + parts.day + " " + time;
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(instant).toLowerCase();
  return "weekly " + WEEKDAY_NAMES[WEEKDAYS.get(weekday)] + " " + time;
}

function localWeekday(dateValue, timeZone) {
  const instant = zonedDateTimeToUtc(dateValue, "12:00", timeZone);
  const value = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(instant).toLowerCase();
  return WEEKDAYS.get(value);
}

function localOccurrence(date, hour, minute, timeZone = DEFAULT_TIME_ZONE) {
  const dateValue = date instanceof Date ? localDate(date, timeZone) : date;
  return zonedDateTimeToUtc(dateValue, `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`, timeZone);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function monthOccurrence(year, month, day, hour, minute, timeZone) {
  const clampedDay = Math.min(day, daysInMonth(year, month));
  const date = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`;
  return localOccurrence(date, hour, minute, timeZone);
}

function shiftMonth(year, month, delta) {
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

export function isWithinCatchUpWindow(now, occurrence) {
  return now.getTime() > occurrence.getTime() && now.getTime() - occurrence.getTime() <= CATCH_UP_MS;
}

/** Return the latest occurrence at or before now, or null for an invalid rule. */
export function latestOccurrence(rule, now, timeZone = DEFAULT_TIME_ZONE) {
  const parsed = typeof rule === "string" ? parseScheduleRule(rule) : rule;
  if (!parsed) return null;
  if (parsed.kind === "once") return parsed.at.getTime() <= now.getTime() ? parsed.at : null;

  if (parsed.kind === "daily") {
    const date = localDate(now, timeZone);
    let result = localOccurrence(date, parsed.hour, parsed.minute, timeZone);
    if (result > now) result = localOccurrence(addLocalDays(date, -1), parsed.hour, parsed.minute, timeZone);
    return result;
  }

  if (parsed.kind === "monthly") {
    const parts = localDateTimeParts(now, timeZone);
    let target = { year: parts.year, month: parts.month };
    let result = monthOccurrence(target.year, target.month, parsed.day, parsed.hour, parsed.minute, timeZone);
    if (result > now) {
      target = shiftMonth(target.year, target.month, -1);
      result = monthOccurrence(target.year, target.month, parsed.day, parsed.hour, parsed.minute, timeZone);
    }
    return result;
  }

  const date = localDate(now, timeZone);
  const delta = (localWeekday(date, timeZone) - parsed.weekday + 7) % 7;
  let result = localOccurrence(addLocalDays(date, -delta), parsed.hour, parsed.minute, timeZone);
  if (result > now) result = localOccurrence(addLocalDays(date, -delta - 7), parsed.hour, parsed.minute, timeZone);
  return result;
}

/** Return the next occurrence strictly after now, or null for invalid/expired rules. */
export function nextOccurrence(rule, now, timeZone = DEFAULT_TIME_ZONE) {
  const parsed = typeof rule === "string" ? parseScheduleRule(rule) : rule;
  if (!parsed) return null;
  if (parsed.kind === "once") return parsed.at.getTime() > now.getTime() ? parsed.at : null;

  if (parsed.kind === "monthly") {
    const parts = localDateTimeParts(now, timeZone);
    let target = { year: parts.year, month: parts.month };
    let result = monthOccurrence(target.year, target.month, parsed.day, parsed.hour, parsed.minute, timeZone);
    if (result <= now) {
      target = shiftMonth(target.year, target.month, 1);
      result = monthOccurrence(target.year, target.month, parsed.day, parsed.hour, parsed.minute, timeZone);
    }
    return result;
  }

  const date = localDate(now, timeZone);
  let occurrenceDate = date;
  let result = localOccurrence(occurrenceDate, parsed.hour, parsed.minute, timeZone);
  if (parsed.kind === "daily") {
    if (result <= now) occurrenceDate = addLocalDays(occurrenceDate, 1);
    return localOccurrence(occurrenceDate, parsed.hour, parsed.minute, timeZone);
  }

  const delta = (parsed.weekday - localWeekday(occurrenceDate, timeZone) + 7) % 7;
  occurrenceDate = addLocalDays(occurrenceDate, delta);
  result = localOccurrence(occurrenceDate, parsed.hour, parsed.minute, timeZone);
  if (result <= now) occurrenceDate = addLocalDays(occurrenceDate, 7);
  return localOccurrence(occurrenceDate, parsed.hour, parsed.minute, timeZone);
}

export function latestScheduleOccurrence(schedule, now, timeZone = DEFAULT_TIME_ZONE) {
  const occurrence = latestOccurrence(schedule.rule, now, timeZone);
  if (!occurrence || !schedule.startsAt) return occurrence;
  return occurrence.getTime() < new Date(schedule.startsAt).getTime() ? null : occurrence;
}

export function nextScheduleOccurrence(schedule, now, timeZone = DEFAULT_TIME_ZONE) {
  let occurrence = nextOccurrence(schedule.rule, now, timeZone);
  if (!schedule.startsAt || !occurrence) return occurrence;
  const startsAt = new Date(schedule.startsAt);
  if (!Number.isFinite(startsAt.getTime()) || occurrence >= startsAt) return occurrence;
  occurrence = nextOccurrence(schedule.rule, new Date(startsAt.getTime() - 1), timeZone);
  return occurrence && occurrence >= startsAt ? occurrence : null;
}

function isCurrentOccurrence(rule, occurrence, now, timeZone) {
  if (!occurrence) return false;
  const parsed = parseScheduleRule(rule);
  if (!parsed || parsed.kind === "once") return true;
  return localDate(occurrence, timeZone) === localDate(now, timeZone);
}

function shouldConsider(schedule, occurrence, now, timeZone) {
  if (!occurrence) return false;
  if (isCurrentOccurrence(schedule.rule, occurrence, now, timeZone)) return true;
  // A persisted lastRunAt/nextRunAt is the durable evidence that this is a
  // restart catch-up, rather than a first tick discovering yesterday's slot.
  const marker = schedule.lastRunAt ?? schedule.nextRunAt;
  return marker != null && new Date(marker).getTime() < occurrence.getTime();
}

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

const DSML_TOOL_PROTOCOL = /<\s*[｜|]{1,2}\s*DSML\s*[｜|]{1,2}\s*(?:tool_calls|invoke|parameter)\b/i;
const GENERIC_TOOL_PROTOCOL = /<\s*\/?\s*(?:tool_calls?|function_calls?|invoke|parameter)\b/i;
const INTERNAL_REASONING_TEXT = /(?:<\s*\/?\s*(?:think|thinking|analysis|reasoning)\b|^\s*(?:思考|分析过程|推理过程|thinking|analysis|reasoning)\s*[:：])/im;
const FENCED_CODE_BLOCK = /```/;

/** Reject internal model protocol before it can become user-facing content. */
export function assertAutomationText(value, kind = "automation") {
  const text = typeof value === "string" ? value.trim() : "";
  const label = kind === "summary" ? "总结" : kind === "todo" ? "待办" : "自动任务";
  if (text === "") throw new Error(`模型未返回最终${label}内容`);
  if (DSML_TOOL_PROTOCOL.test(text)) {
    throw new Error(`模型返回了工具调用协议，而不是最终${label}内容`);
  }
  if (GENERIC_TOOL_PROTOCOL.test(text)) {
    throw new Error(`模型返回了工具调用协议，而不是最终${label}内容`);
  }
  if (INTERNAL_REASONING_TEXT.test(text)) {
    throw new Error(`模型返回了分析过程，而不是最终${label}内容`);
  }
  if (FENCED_CODE_BLOCK.test(text)) {
    throw new Error(`模型返回了代码块，而不是最终${label}内容`);
  }
  return text;
}

export function isAutomationProtocolLeak(value) {
  return typeof value === "string" && DSML_TOOL_PROTOCOL.test(value);
}

function projectAutomation(repos, projectId) {
  const value = repos.automation?.get?.(projectId) ?? repos.projects.getAutomation?.(projectId);
  return {
    summaryEnabled: value?.summaryEnabled !== false,
    nextDayTodosEnabled: value?.nextDayTodosEnabled !== false,
  };
}

function existingSummary(repos, projectId, summaryDate) {
  const direct = repos.summaries?.getByProjectDate?.(projectId, summaryDate);
  if (direct) return direct;
  return repos.summaries?.list?.({ projectId })?.find((row) => row.summaryDate === summaryDate) ?? null;
}

function existingAutoTodos(repos, projectId, dueDate, timeZone) {
  return (repos.todos?.list?.({ projectId }) ?? [])
    .filter((row) => row.source === "auto" && isTodoDueOnLocalDate(row.dueAt, dueDate, timeZone));
}

function normalizeTodoTitle(title) {
  return String(title ?? "").trim().replace(/\s+/g, " ");
}

function todoTitles(result) {
  const values = Array.isArray(result?.todos) ? result.todos : String(result?.text ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, ""));
  return values.map(normalizeTodoTitle).filter(Boolean);
}

function isLocalDate(value, date, timeZone) {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && localDate(parsed, timeZone) === date;
}

function projectScheduleRuns(repos, projectId, date, timeZone) {
  const schedules = repos.schedules?.list?.({ projectId }) ?? [];
  return schedules.flatMap((schedule) => (repos.schedules?.listRuns?.(schedule.id) ?? [])
    .filter((run) => [run.scheduledAt, run.startedAt, run.finishedAt].some((value) => isLocalDate(value, date, timeZone)))
    .map((run) => ({
      scheduleId: run.scheduleId,
      scheduledAt: run.scheduledAt,
      status: run.status,
      sessionId: run.sessionId,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      error: run.error,
    })));
}

function projectSessionActivity(repos, projectId, date, timeZone) {
  return (repos.knowledgeChats?.listActivityByProject?.(projectId) ?? [])
    .filter((activity) => isLocalDate(activity.updatedAt, date, timeZone));
}

function dailyAutomationData(repos, projectId, date, timeZone) {
  const todos = repos.todos?.list?.({ projectId, timeZone }) ?? [];
  return {
    todos,
    scheduleRuns: projectScheduleRuns(repos, projectId, date, timeZone),
    sessionActivity: projectSessionActivity(repos, projectId, date, timeZone),
  };
}

function makeSummaryPrompt(repos, projectId, date, timeZone) {
  const { todos, scheduleRuns, sessionActivity } = dailyAutomationData(repos, projectId, date, timeZone);
  return [
    `请总结项目 ${projectId} 在 ${date} 的进展。`,
    "以下数据是本次总结的全部输入；不要读取工作区，不要调用任何工具。",
    "仅输出最终中文总结正文，不要输出 DSML、XML、代码、分析过程或工具调用。若数据均为空，请直接说明今日暂无可总结的项目进展记录。",
    "定时任务执行结果：" + JSON.stringify(scheduleRuns),
    "会话活动：" + JSON.stringify(sessionActivity),
    "待办完成情况：" + JSON.stringify(todos.map((todo) => ({ title: todo.title, done: todo.done === true, completedAt: todo.completedAt ?? null, dueAt: todo.dueAt }))),
  ].join("\n");
}

function makeTodoPrompt(repos, projectId, date, nextDate, timeZone) {
  const todos = repos.todos?.list?.({ projectId, timeZone }) ?? [];
  return [
    `请根据项目 ${projectId} 在 ${date} 的未完成事项生成 ${nextDate} 的待办。`,
    "以下数据是本次生成的全部输入；不要读取工作区，不要调用任何工具，也不要输出 DSML、XML 或工具调用。",
    "只输出逐行清单，不要输出标题。",
    "待办：" + JSON.stringify(todos),
  ].join("\n");
}

function nextLocalDate(date) { return addLocalDays(date, 1); }

function createScheduler({ repos, clock = () => new Date(), runPrompt, intervalMs = 60000, timeZone = DEFAULT_TIME_ZONE } = {}) {
  if (!repos || typeof repos.schedules?.list !== "function") throw new Error("createScheduler requires repos.schedules.list");
  if (typeof runPrompt !== "function") throw new Error("createScheduler requires runPrompt");
  const getTimeZone = () => validateTimeZone(typeof timeZone === "function" ? timeZone() : timeZone);

  let timer = null;
  let stopped = false;
  const automationAttempts = new Set();

  async function runSchedule(schedule, occurrence, now) {
    const scheduledAt = occurrence.toISOString();
    const run = repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt, startedAt: now });
    if (!run?.claimed) return null;
    if (now.getTime() - occurrence.getTime() > CATCH_UP_MS) {
      return repos.schedules.missRun({ id: run.id, error: "missed: occurrence was older than 24 hours", finishedAt: now });
    }
    try {
      const result = await runPrompt({ kind: "schedule", schedule, projectId: schedule.projectId, prompt: schedule.prompt ?? "", scheduledAt });
      repos.schedules.updateLastRunAt?.({ id: schedule.id, lastRunAt: now });
      return repos.schedules.completeRun({ id: run.id, sessionId: result?.sessionId ?? null, finishedAt: now });
    } catch (error) {
      repos.schedules.updateLastRunAt?.({ id: schedule.id, lastRunAt: now });
      return repos.schedules.failRun({
        id: run.id,
        sessionId: error?.sessionId ?? null,
        error: errorText(error),
        finishedAt: now,
      });
    }
  }

  async function runSummary(project, now, summaryDate, zone = getTimeZone(), { force = false } = {}) {
    const key = `summary:${project.id}:${summaryDate}`;
    const previous = existingSummary(repos, project.id, summaryDate);
    let previousContent = null;
    try {
      if (previous?.status === "completed") previousContent = assertAutomationText(previous.content, "summary");
    } catch { /* legacy protocol/reasoning content is not a valid fallback */ }
    if (!force && (automationAttempts.has(key) || previous)) return null;
    automationAttempts.add(key);
    repos.summaries.upsert({ projectId: project.id, summaryDate, status: "pending", content: null, now });
    try {
      const result = await runPrompt({ kind: "summary", projectId: project.id, prompt: makeSummaryPrompt(repos, project.id, summaryDate, zone), scheduledAt: now.toISOString() });
      const content = assertAutomationText(result?.text, "summary");
      return repos.summaries.upsert({ projectId: project.id, summaryDate, status: "completed", content, now });
    } catch (error) {
      if (force && previousContent !== null) {
        repos.summaries.upsert({ projectId: project.id, summaryDate, status: "completed", content: previousContent, now });
      } else {
        repos.summaries.upsert({ projectId: project.id, summaryDate, status: "failed", content: null, now });
      }
      throw error;
    }
  }

  async function runAutoTodos(project, now, dueDate, zone = getTimeZone()) {
    const key = `todo:${project.id}:${dueDate}`;
    if (automationAttempts.has(key)) return null;
    automationAttempts.add(key);
    try {
      const result = await runPrompt({ kind: "todo", projectId: project.id, prompt: makeTodoPrompt(repos, project.id, addLocalDays(dueDate, -1), dueDate, zone), scheduledAt: now.toISOString() });
      if (!Array.isArray(result?.todos)) assertAutomationText(result?.text, "todo");
      const existingTitles = new Set(existingAutoTodos(repos, project.id, dueDate, zone).map((todo) => normalizeTodoTitle(todo.title)));
      const createdTitles = new Set();
      const created = [];
      for (const title of todoTitles(result)) {
        if (existingTitles.has(title) || createdTitles.has(title)) continue;
        createdTitles.add(title);
        created.push(repos.todos.create({ projectId: project.id, title, dueAt: zonedDateTimeToUtc(dueDate, "18:00", zone).toISOString(), source: "auto", now }));
      }
      return created;
    } catch (error) {
      // There is no todo error column; the attempt set prevents an in-process
      // retry loop, while the next host start can retry the missing todos.
      return { status: "failed", error: errorText(error) };
    }
  }

  async function tick(now = clock()) {
    const current = now instanceof Date ? now : new Date(now);
    const zone = getTimeZone();
    const schedules = repos.schedules.list() ?? [];
    for (const schedule of schedules) {
      if (!schedule.enabled) continue;
      const occurrence = latestScheduleOccurrence(schedule, current, zone);
      if (shouldConsider(schedule, occurrence, current, zone)) await runSchedule(schedule, occurrence, current);
    }

    const nowParts = localDateTimeParts(current, zone);
    if (nowParts.hour !== 21 || nowParts.minute !== 0) return;
    await runDailyAutomations(current, zone);
  }

  async function runDailyAutomations(current, zone = getTimeZone()) {
    const summaryDate = localDate(current, zone);
    const dueDate = nextLocalDate(summaryDate);
    for (const project of repos.projects?.list?.() ?? []) {
      const flags = projectAutomation(repos, project.id);
      if (flags.summaryEnabled) {
        try { await runSummary(project, current, summaryDate, zone); } catch { /* failed row is already persisted */ }
      }
      if (flags.nextDayTodosEnabled) await runAutoTodos(project, current, dueDate, zone);
    }
  }

  function start() {
    if (timer !== null) return stop;
    stopped = false;
    timer = setInterval(() => { if (!stopped) void tick().catch(() => {}); }, intervalMs);
    const startupNow = new Date(clock());
    const zone = getTimeZone();
    const dailySlot = localOccurrence(localDate(startupNow, zone), 21, 0, zone);
    const needsDailyCatchUp = isWithinCatchUpWindow(startupNow, dailySlot);
    void (async () => {
      await tick(startupNow);
      if (needsDailyCatchUp) await runDailyAutomations(startupNow, zone);
    })().catch(() => {});
    return stop;
  }

  function stop() {
    stopped = true;
    if (timer !== null) clearInterval(timer);
    timer = null;
  }

  async function runScheduleNow(schedule, now = clock()) {
    const current = now instanceof Date ? now : new Date(now);
    return runSchedule(schedule, current, current);
  }

  return { start, stop, tick, runSchedule, runScheduleNow, runSummary, runAutoTodos };
}

export { createScheduler, localDate };
