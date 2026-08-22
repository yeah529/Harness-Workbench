import React from "react";
import { Check, PencilSimple, Plus } from "@phosphor-icons/react";
import { glyph, ICONS, Empty } from "./icons.js";
import { GlobalModal } from "./globalModal.js";
import { DEFAULT_TIME_ZONE, formatInstant, localDateTimeParts, zonedDateTimeToUtc } from "./timezone.js";

function pad(value) { return String(value).padStart(2, "0"); }
function localDateTime(value, timeZone) { try { return formatInstant(value, timeZone); } catch { return String(value || ""); } }
function parts(value, timeZone) {
  if (!value) return { date: "", time: "" };
  const date = localDateTimeParts(value, timeZone);
  return { date: `${date.year}-${pad(date.month)}-${pad(date.day)}`, time: `${pad(date.hour)}:${pad(date.minute)}` };
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

export function Todos({ store, projectId }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const [dialog, setDialog] = React.useState(null);
  const action = state.action;
  const todos = Array.isArray(state.todos) ? state.todos : [];
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const error = action?.type === "todo" && action.status === "error" ? action.error : null;
  const save = (payload) => {
    const todo = dialog?.todo;
    const operation = todo ? store.actions.updateTodo({ id: todo.id, ...payload }) : store.actions.createTodo({ projectId, ...payload });
    return operation.then(() => setDialog(null));
  };
  const toggle = (todo) => store.actions.updateTodo({ id: todo.id, done: !todo.done }).catch(() => {});
  const pending = todos.filter((todo) => !todo.done).length;
  return React.createElement("section", { className: "cpwb-tool-panel" },
    React.createElement("div", { className: "cpwb-tool-head" }, React.createElement("span", null, "PROJECT TODO // " + String(pending).padStart(2, "0")), React.createElement("button", { className: "cpwb-btn cpwb-btn-primary cpwb-button-content", type: "button", onClick: () => setDialog({ todo: null }) }, React.createElement(Plus, { size: 14, weight: "bold" }), React.createElement("span", null, "新增"))),
    error ? React.createElement("div", { className: "cpwb-status cpwb-status-error", role: "alert" }, error.message || String(error)) : null,
    todos.length === 0 ? React.createElement(Empty, { glyph: glyph(ICONS.grid) }, "暂无待办，添加第一项") : React.createElement("div", { className: "cpwb-list" }, todos.map((todo) => React.createElement("article", { key: todo.id, className: "cpwb-todo-row" + (todo.done ? " cpwb-item-done" : "") },
      React.createElement("button", { type: "button", className: "cpwb-check" + (todo.done ? " cpwb-done" : ""), onClick: () => toggle(todo), "aria-label": todo.done ? "标记未完成" : "标记完成" }, todo.done ? React.createElement(Check, { size: 14, weight: "bold" }) : null),
      React.createElement("button", { type: "button", className: "cpwb-item-main cpwb-todo-details", onClick: () => setDialog({ todo }) }, React.createElement("span", { className: "cpwb-item-title" }, todo.title), React.createElement("span", { className: "cpwb-item-meta" }, todo.overdue && !todo.done ? "已逾期 · " : "预计完成 · ", localDateTime(todo.dueAt, timeZone), " · 创建于 ", localDateTime(todo.createdAt, timeZone), todo.source === "auto" ? " · 自动生成" : "")),
      React.createElement("button", { type: "button", className: "cpwb-icon-button", onClick: () => setDialog({ todo }), "aria-label": "编辑待办" }, React.createElement(PencilSimple, { size: 14 }))))),
    dialog ? React.createElement(TodoDialog, { todo: dialog.todo, onSave: save, onClose: () => setDialog(null), busy: action?.type === "todo" && action.status === "running", error, timeZone }) : null);
}
