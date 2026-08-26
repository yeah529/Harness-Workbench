import React from "react";
import { Check, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { glyph, ICONS, Empty } from "./icons.js";
import { GlobalModal } from "./globalModal.js";
import { useArrivalPulse } from "./arrivalPulse.js";
import { addLocalDays, DEFAULT_TIME_ZONE, formatInstant, localDateKey, localDateTimeParts, zonedDateTimeToUtc } from "./timezone.js";

function pad(value) { return String(value).padStart(2, "0"); }
function localDateTime(value, timeZone) { try { return formatInstant(value, timeZone); } catch { return String(value || ""); } }
function localTime(value, timeZone) {
  try {
    const date = localDateTimeParts(value, timeZone);
    return `${pad(date.hour)}:${pad(date.minute)}`;
  } catch { return ""; }
}
function calendarLabel(value, timeZone) {
  const date = localDateTimeParts(value, timeZone);
  const weekday = new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "short" }).format(new Date(value));
  return `${date.month}月${date.day}日，${weekday}`;
}
function parts(value, timeZone) {
  if (!value) return { date: "", time: "" };
  const date = localDateTimeParts(value, timeZone);
  return { date: `${date.year}-${pad(date.month)}-${pad(date.day)}`, time: `${pad(date.hour)}:${pad(date.minute)}` };
}

export function filterTodos(todos, query = "") {
  const needle = String(query ?? "").trim().toLocaleLowerCase();
  if (!needle) return Array.isArray(todos) ? todos : [];
  return (Array.isArray(todos) ? todos : []).filter((todo) => String(todo?.title || "").toLocaleLowerCase().includes(needle));
}

export function organizeTodos(todos, { view = "pending", timeZone = DEFAULT_TIME_ZONE, now = new Date() } = {}) {
  const today = localDateKey(now, timeZone);
  const tomorrow = addLocalDays(today, 1);
  const rows = (Array.isArray(todos) ? todos : []).filter((todo) => view === "completed" ? todo.done : !todo.done);
  rows.sort((a, b) => view === "completed"
    ? new Date(b.completedAt || b.dueAt).getTime() - new Date(a.completedAt || a.dueAt).getTime()
    : new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const sections = new Map();
  for (const todo of rows) {
    const overdue = !todo.done && (todo.overdue === true || new Date(todo.dueAt).getTime() < now.getTime());
    const value = view === "completed" ? (todo.completedAt || todo.dueAt) : todo.dueAt;
    const date = localDateKey(value, timeZone);
    const key = overdue ? "overdue" : view === "completed" ? "completed-" + date : date;
    let label;
    if (overdue) label = "已过期";
    else if (view === "completed") label = date === today ? "今天完成" : calendarLabel(value, timeZone) + "完成";
    else if (date === today) label = "今天，" + new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "short" }).format(new Date(value));
    else if (date === tomorrow) label = "明天，" + new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "short" }).format(new Date(value));
    else label = calendarLabel(value, timeZone);
    if (!sections.has(key)) sections.set(key, { key, label, status: overdue ? "overdue" : view, items: [] });
    sections.get(key).items.push(todo);
  }
  return [...sections.values()];
}

function TodoDialog({ todo, onSave, onClose, busy, error, timeZone }) {
  const initial = parts(todo?.dueAt, timeZone);
  const [title, setTitle] = React.useState(todo?.title || "");
  const [date, setDate] = React.useState(initial.date);
  const [time, setTime] = React.useState(initial.time);
  const [localError, setLocalError] = React.useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!title.trim() || !date || !time) { setLocalError("标题、日期和时间均为必填项"); return; }
    let dueAt;
    try { dueAt = zonedDateTimeToUtc(date, time, timeZone).toISOString(); } catch (error) { setLocalError(error.message); return; }
    onSave({ title: title.trim(), dueAt }).catch(() => {});
  };
  return React.createElement(GlobalModal, { onClose, labelledBy: "cpwb-todo-dialog-title" },
    React.createElement("form", { className: "cpwb-modal", onSubmit: submit },
      React.createElement("div", { className: "cpwb-modal-kicker" }, todo ? "TODO / MODIFY" : "TODO / NEW"),
      React.createElement("h3", { id: "cpwb-todo-dialog-title" }, todo ? "编辑待办" : "添加待办"),
      React.createElement("label", null, "标题", React.createElement("input", { autoFocus: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "例如：完成检索接口审计" })),
      React.createElement("div", { className: "cpwb-form-grid" },
        React.createElement("label", null, "预计完成日期", React.createElement("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value) })),
        React.createElement("label", null, "预计完成时间", React.createElement("input", { type: "time", value: time, onChange: (e) => setTime(e.target.value) }))),
      localError || error ? React.createElement("div", { className: "cpwb-form-error", role: "alert" }, localError || error.message || String(error)) : null,
      React.createElement("div", { className: "cpwb-modal-actions" }, React.createElement("button", { type: "button", className: "cpwb-btn", onClick: onClose }, "取消"), React.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: busy }, busy ? "保存中…" : "保存"))));
}

export function Todos({ store, projectId, now, initialQuery = "" }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const [dialog, setDialog] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [view, setView] = React.useState("pending");
  const [query, setQuery] = React.useState(initialQuery);
  const action = state.action;
  const todos = Array.isArray(state.todos) ? state.todos : [];
  const arrivingTodoIds = useArrivalPulse(todos);
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const error = action?.type === "todo" && action.status === "error" ? action.error : null;
  const save = (payload) => {
    const todo = dialog?.todo;
    const operation = todo ? store.actions.updateTodo({ id: todo.id, ...payload }) : store.actions.createTodo({ projectId, ...payload });
    return operation.then(() => setDialog(null));
  };
  const toggle = (todo) => store.actions.updateTodo({ id: todo.id, done: !todo.done }).catch(() => {});
  const pending = todos.filter((todo) => !todo.done).length;
  const completed = todos.length - pending;
  const filteredTodos = filterTodos(todos, query);
  const sections = organizeTodos(filteredTodos, { view, timeZone, now: now || new Date() });
  const remove = () => store.actions.deleteTodo(deleteTarget.id).then(() => setDeleteTarget(null));
  return React.createElement("section", { className: "cpwb-tool-panel" },
    React.createElement("div", { className: "cpwb-tool-head" }, React.createElement("span", null, "PROJECT TODO"), React.createElement("button", { className: "cpwb-btn cpwb-btn-primary cpwb-button-content", type: "button", onClick: () => setDialog({ todo: null }) }, React.createElement(Plus, { size: 14, weight: "bold" }), React.createElement("span", null, "新增"))),
    React.createElement("label", { className: "cpwb-tool-search" },
      React.createElement("span", { "aria-hidden": true }, "⌕"),
      React.createElement("input", { type: "search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "搜索待办事项", "aria-label": "搜索待办" })),
    React.createElement("div", { className: "cpwb-todo-tabs", role: "tablist", "aria-label": "待办状态" },
      React.createElement("button", { type: "button", role: "tab", "aria-selected": view === "pending", className: view === "pending" ? "cpwb-active" : "", onClick: () => setView("pending") }, React.createElement("span", null, "待处理"), React.createElement("small", null, pending)),
      React.createElement("button", { type: "button", role: "tab", "aria-selected": view === "completed", className: view === "completed" ? "cpwb-active" : "", onClick: () => setView("completed") }, React.createElement("span", null, "已完成"), React.createElement("small", null, completed))),
    error ? React.createElement("div", { className: "cpwb-status cpwb-status-error", role: "alert" }, error.message || String(error)) : null,
    sections.length === 0 ? React.createElement(Empty, { glyph: glyph(ICONS.grid) }, view === "completed" ? "暂无已完成待办" : "暂无待处理待办，添加第一项") : React.createElement("div", { className: "cpwb-todo-sections" }, sections.map((section) => React.createElement("section", { key: section.key, className: "cpwb-todo-section cpwb-todo-section-" + section.status },
      React.createElement("h4", null, section.label),
      React.createElement("div", { className: "cpwb-list" }, section.items.map((todo) => React.createElement("article", { key: todo.id, className: "cpwb-todo-row" + (todo.done ? " cpwb-item-done" : "") + (section.status === "overdue" ? " cpwb-todo-row-overdue" : "") + (arrivingTodoIds.has(String(todo.id)) ? " cpwb-entry-arrived" : "") },
        React.createElement("button", { type: "button", className: "cpwb-check" + (todo.done ? " cpwb-done" : ""), onClick: () => toggle(todo), "aria-label": todo.done ? "标记未完成" : "标记完成" }, todo.done ? React.createElement(Check, { size: 14, weight: "bold" }) : null),
        React.createElement("button", { type: "button", className: "cpwb-item-main cpwb-todo-details", onClick: () => setDialog({ todo }) },
          React.createElement("span", { className: "cpwb-item-title" }, todo.title),
          React.createElement("span", { className: "cpwb-item-meta" }, todo.done ? "预计完成 " + localDateTime(todo.dueAt, timeZone) : todo.source === "auto" ? "自动生成" : "手动创建")),
        React.createElement("span", { className: "cpwb-todo-time" + (section.status === "overdue" ? " cpwb-todo-overdue" : "") }, section.status === "overdue" ? React.createElement("small", null, "已过期") : null, localTime(todo.done ? (todo.completedAt || todo.dueAt) : todo.dueAt, timeZone)),
        React.createElement("button", { type: "button", className: "cpwb-icon-button", onClick: () => setDialog({ todo }), "aria-label": "编辑待办 " + todo.title }, React.createElement(PencilSimple, { size: 14 })),
        React.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", onClick: () => setDeleteTarget(todo), "aria-label": "删除待办 " + todo.title }, React.createElement(Trash, { size: 14 })))))))),
    dialog ? React.createElement(TodoDialog, { todo: dialog.todo, onSave: save, onClose: () => setDialog(null), busy: action?.type === "todo" && action.status === "running", error, timeZone }) : null,
    deleteTarget ? React.createElement(GlobalModal, { onClose: () => setDeleteTarget(null), labelledBy: "cpwb-delete-todo-title" },
      React.createElement("section", { className: "cpwb-modal cpwb-danger-modal" },
        React.createElement("div", { className: "cpwb-modal-kicker" }, "TODO / DELETE"),
        React.createElement("h3", { id: "cpwb-delete-todo-title" }, "删除待办？"),
        React.createElement("p", null, "「" + deleteTarget.title + "」将永久删除，此操作无法撤销。"),
        React.createElement("div", { className: "cpwb-modal-actions" },
          React.createElement("button", { type: "button", className: "cpwb-btn", onClick: () => setDeleteTarget(null) }, "取消"),
          React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", disabled: action?.type === "todo" && action.status === "running", onClick: () => remove().catch(() => {}) }, React.createElement(Trash, { size: 14 }), React.createElement("span", null, "确认删除"))))) : null);
}
