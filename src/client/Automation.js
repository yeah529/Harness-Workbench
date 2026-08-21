import React from "react";
import { CalendarBlank, CheckCircle, ClockCountdown, PencilSimple, Play, Plus, SpinnerGap, Trash, Warning } from "@phosphor-icons/react";
import { Empty } from "./icons.js";
import { localDateKey } from "./store.js";
import { DEFAULT_TIME_ZONE, formatInstant, localDateTimeParts, zonedDateTimeToUtc } from "./timezone.js";

const RECURRENCE_LABELS = { once: "仅一次", daily: "每日", weekly: "每周", monthly: "每月" };
const pad = (value) => String(value).padStart(2, "0");

function fmtTime(value, timeZone = DEFAULT_TIME_ZONE) {
  if (!value) return "未安排";
  try { return formatInstant(value, timeZone); } catch { return String(value); }
}

function dateTimeFields(value, timeZone) {
  const parts = localDateTimeParts(value || new Date(Date.now() + 60 * 60 * 1000), timeZone);
  return { date: `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`, time: `${pad(parts.hour)}:${pad(parts.minute)}` };
}

function inferredRecurrence(schedule) {
  if (schedule?.recurrence) return schedule.recurrence;
  const kind = String(schedule?.rule || "").split(/\s+/)[0];
  return ["once", "daily", "weekly", "monthly"].includes(kind) ? kind : "daily";
}

function Feedback({ action, type }) {
  if (!action || action.type !== type) return null;
  const iconProps = { size: 15, weight: "bold", "aria-hidden": true };
  if (action.status === "running") return React.createElement("div", { className: "cpwb-status cpwb-status-loading", role: "status" }, React.createElement(SpinnerGap, iconProps), React.createElement("span", null, "执行中…"));
  if (action.status === "error") return React.createElement("div", { className: "cpwb-status cpwb-status-error", role: "alert" }, React.createElement(Warning, iconProps), React.createElement("span", null, action.error?.message || "操作失败"));
  if (action.status === "done") return React.createElement("div", { className: "cpwb-status cpwb-status-success", role: "status" }, React.createElement(CheckCircle, iconProps), React.createElement("span", null, "已完成"));
  return null;
}

function ScheduleDialog({ schedule, timeZone, busy, error, onSave, onDelete, onClose }) {
  const initial = dateTimeFields(schedule?.startsAt || schedule?.nextRunAt, timeZone);
  const [name, setName] = React.useState(schedule?.name || "");
  const [prompt, setPrompt] = React.useState(schedule?.prompt || "");
  const [recurrence, setRecurrence] = React.useState(inferredRecurrence(schedule));
  const [date, setDate] = React.useState(initial.date);
  const [time, setTime] = React.useState(initial.time);
  const [enabled, setEnabled] = React.useState(schedule?.enabled !== false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [localError, setLocalError] = React.useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !date || !time) { setLocalError("名称、日期和时间均为必填项"); return; }
    let startsAt;
    try { startsAt = zonedDateTimeToUtc(date, time, timeZone).toISOString(); }
    catch (cause) { setLocalError(cause.message); return; }
    onSave({ name: name.trim(), prompt: prompt.trim() || null, recurrence, startsAt, enabled }).catch(() => {});
  };

  return React.createElement("div", { className: "cpwb-modal-backdrop", onMouseDown: (event) => { if (event.target === event.currentTarget) onClose(); } },
    React.createElement("form", { className: "cpwb-modal cpwb-schedule-modal", role: "dialog", "aria-modal": true, "aria-labelledby": "cpwb-schedule-dialog-title", onSubmit: submit },
      React.createElement("div", { className: "cpwb-modal-kicker" }, schedule ? "SCHEDULE / DETAILS" : "SCHEDULE / NEW"),
      React.createElement("h3", { id: "cpwb-schedule-dialog-title" }, schedule ? "定时任务详情" : "新增定时任务"),
      React.createElement("label", null, "任务名称", React.createElement("input", { autoFocus: true, value: name, onChange: (event) => setName(event.target.value), placeholder: "例如：生成项目周报" })),
      React.createElement("label", null, "执行提示词", React.createElement("textarea", { value: prompt, onChange: (event) => setPrompt(event.target.value), placeholder: "告诉模型需要完成什么" })),
      React.createElement("div", { className: "cpwb-recurrence-picker", role: "group", "aria-label": "重复频率" }, Object.entries(RECURRENCE_LABELS).map(([value, label]) => React.createElement("button", {
        key: value, type: "button", className: recurrence === value ? "cpwb-active" : "", "aria-pressed": recurrence === value, onClick: () => setRecurrence(value),
      }, label))),
      React.createElement("div", { className: "cpwb-form-grid" },
        React.createElement("label", null, recurrence === "once" ? "执行日期" : "首次执行日期", React.createElement("input", { type: "date", value: date, onChange: (event) => setDate(event.target.value) })),
        React.createElement("label", null, "执行时间", React.createElement("input", { type: "time", value: time, onChange: (event) => setTime(event.target.value) }))),
      React.createElement("label", { className: "cpwb-switch-row" }, React.createElement("span", null, "启用任务"), React.createElement("input", { type: "checkbox", checked: enabled, onChange: (event) => setEnabled(event.target.checked) })),
      localError || error ? React.createElement("div", { className: "cpwb-form-error", role: "alert" }, localError || error.message || String(error)) : null,
      confirmDelete ? React.createElement("div", { className: "cpwb-danger-confirm" }, React.createElement("span", null, "删除后执行历史也会清除。"), React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: busy, onClick: () => onDelete().catch(() => {}) }, "确认删除")) : null,
      React.createElement("div", { className: "cpwb-modal-actions cpwb-modal-actions-split" },
        schedule ? React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", onClick: () => setConfirmDelete(true) }, React.createElement(Trash, { size: 15 }), React.createElement("span", null, "删除")) : React.createElement("span", null),
        React.createElement("div", { className: "cpwb-row" }, React.createElement("button", { type: "button", className: "cpwb-btn", onClick: onClose }, "取消"), React.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: busy }, busy ? "保存中…" : "保存")))));
}

export function Automation({ store, projectId, view = "all", initialDialog = null }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const [dialog, setDialog] = React.useState(initialDialog === "create" ? { schedule: null } : null);
  const schedules = Array.isArray(state.schedules) ? state.schedules : [];
  const scheduleRuns = state.scheduleRuns || {};
  const summaries = Array.isArray(state.summaries) ? state.summaries : [];
  const automation = state.automation || { summaryEnabled: true, nextDayTodosEnabled: true };
  const action = state.action;
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const scheduleAction = ["createSchedule", "updateSchedule", "deleteSchedule"].includes(action?.type) ? action : null;

  const save = (payload) => {
    const schedule = dialog?.schedule;
    const operation = schedule ? store.actions.updateSchedule({ id: schedule.id, ...payload }) : store.actions.createSchedule({ projectId, ...payload });
    return operation.then(() => setDialog(null));
  };
  const remove = () => store.actions.deleteSchedule(dialog.schedule.id).then(() => setDialog(null));
  const toggle = (field) => store.actions.updateAutomation({
    projectId,
    summaryEnabled: field === "summaryEnabled" ? !automation.summaryEnabled : automation.summaryEnabled,
    nextDayTodosEnabled: field === "nextDayTodosEnabled" ? !automation.nextDayTodosEnabled : automation.nextDayTodosEnabled,
  }).catch(() => {});

  const scheduleNodes = schedules.map((schedule) => {
    const runs = Array.isArray(scheduleRuns[schedule.id]) ? scheduleRuns[schedule.id] : [];
    const latest = runs.at(-1);
    return React.createElement("article", { key: schedule.id, className: "cpwb-schedule-row", onClick: () => setDialog({ schedule }) },
      React.createElement("div", { className: "cpwb-schedule-icon" }, React.createElement(ClockCountdown, { size: 18, weight: "regular" })),
      React.createElement("div", { className: "cpwb-item-main" }, React.createElement("div", { className: "cpwb-item-title" }, schedule.name), React.createElement("div", { className: "cpwb-item-meta" }, `${RECURRENCE_LABELS[inferredRecurrence(schedule)]} · 下次 ${fmtTime(schedule.nextRunAt, timeZone)}`), latest ? React.createElement("div", { className: "cpwb-item-meta" }, "最近执行 · " + (latest.status || "unknown")) : null),
      React.createElement("span", { className: "cpwb-schedule-state " + (schedule.enabled === false ? "cpwb-off" : "cpwb-on") }, schedule.enabled === false ? "停用" : "运行中"),
      React.createElement("button", { type: "button", className: "cpwb-icon-button", title: "立即运行", "aria-label": "立即运行 " + schedule.name, disabled: schedule.enabled === false || (action?.type === "runSchedule" && action.scheduleId === schedule.id && action.status === "running"), onClick: (event) => { event.stopPropagation(); store.actions.runSchedule(schedule.id).catch(() => {}); } }, React.createElement(Play, { size: 14, weight: "fill" })),
      React.createElement("button", { type: "button", className: "cpwb-icon-button", "aria-label": "编辑 " + schedule.name, onClick: (event) => { event.stopPropagation(); setDialog({ schedule }); } }, React.createElement(PencilSimple, { size: 14 })));
  });

  const summaryNodes = summaries.map((summary) => React.createElement("article", { key: summary.id, className: "cpwb-summary-entry" }, React.createElement("div", { className: "cpwb-item-meta" }, summary.summaryDate + " · " + summary.status), summary.content || "暂无内容"));

  return React.createElement("div", null,
    view !== "schedule" ? React.createElement("section", { className: "cpwb-section" }, React.createElement("div", { className: "cpwb-section-head" }, React.createElement("div", { className: "cpwb-label" }, "自动化开关")), React.createElement("div", { className: "cpwb-toggle-row" }, React.createElement("span", null, "21:00 每日总结"), React.createElement("button", { type: "button", className: "cpwb-toggle" + (automation.summaryEnabled ? " cpwb-on" : ""), onClick: () => toggle("summaryEnabled") }, automation.summaryEnabled ? "开" : "关")), React.createElement("div", { className: "cpwb-toggle-row" }, React.createElement("span", null, "21:00 次日待办"), React.createElement("button", { type: "button", className: "cpwb-toggle" + (automation.nextDayTodosEnabled ? " cpwb-on" : ""), onClick: () => toggle("nextDayTodosEnabled") }, automation.nextDayTodosEnabled ? "开" : "关")), React.createElement(Feedback, { action, type: "updateAutomation" })) : null,
    view !== "summary" ? React.createElement("section", { className: "cpwb-tool-panel" }, React.createElement("div", { className: "cpwb-tool-head" }, React.createElement("span", null, "SCHEDULES // " + String(schedules.length).padStart(2, "0")), React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", onClick: () => setDialog({ schedule: null }) }, React.createElement(Plus, { size: 14, weight: "bold" }), React.createElement("span", null, "新增"))), React.createElement(Feedback, { action, type: "runSchedule" }), schedules.length === 0 ? React.createElement(Empty, { glyph: React.createElement(CalendarBlank, { size: 20 }) }, "暂无定时任务") : React.createElement("div", { className: "cpwb-list" }, scheduleNodes)) : null,
    view !== "schedule" ? React.createElement("section", { className: "cpwb-section" }, React.createElement("div", { className: "cpwb-section-head" }, React.createElement("div", { className: "cpwb-label" }, "每日总结记录"), React.createElement("button", { type: "button", className: "cpwb-btn cpwb-button-content", onClick: () => store.actions.runSummary({ projectId, summaryDate: localDateKey() }).catch(() => {}) }, React.createElement(Play, { size: 13 }), React.createElement("span", null, "立即生成"))), summaries.length === 0 ? React.createElement(Empty, { glyph: React.createElement(CalendarBlank, { size: 20 }) }, "暂无总结记录") : summaryNodes) : null,
    dialog ? React.createElement(ScheduleDialog, { schedule: dialog.schedule, timeZone, busy: scheduleAction?.status === "running", error: scheduleAction?.status === "error" ? scheduleAction.error : null, onSave: save, onDelete: remove, onClose: () => setDialog(null) }) : null);
}
