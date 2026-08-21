import React from "react";
import { ChatCircleText, MagnifyingGlass } from "@phosphor-icons/react";

function scopeLabel(row) {
  if (row.contextName) return row.contextName;
  if (row.scope?.kind === "project") return "项目";
  if (row.scope?.kind === "knowledge_base") return "知识库";
  return "独立";
}

function activityLabel(value) {
  if (!value) return "尚未开始";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function SessionListPage({ store, onOpenSession }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const [query, setQuery] = React.useState("");
  const [context, setContext] = React.useState("");
  const page = state.sessionPage ?? { items: [], total: 0, limit: 20, offset: 0 };

  const load = React.useCallback((offset = 0) => store.actions.loadAllSessions({
    query: query.trim(),
    context: context || null,
    offset,
    limit: page.limit || 20,
  }), [context, page.limit, query, store]);

  React.useEffect(function () { load(0).catch(function () {}); }, []);

  return React.createElement("main", { className: "cpwb-session-list-page cpwb-workbench-page", "data-page": "sessions" },
    React.createElement("header", { className: "cpwb-page-header" },
      React.createElement("div", { className: "cpwb-page-header-main" },
        React.createElement("span", null, "03 / CONVERSATIONS"),
        React.createElement("h1", null, "全部会话"),
        React.createElement("p", null, "项目、知识库与独立会话统一归档。")),
      React.createElement("div", { className: "cpwb-page-header-stat" }, React.createElement("strong", null, page.total), React.createElement("span", null, "条会话"))),
    React.createElement("form", { className: "cpwb-session-filters", onSubmit: function (event) { event.preventDefault(); load(0).catch(function () {}); } },
      React.createElement("label", null,
        React.createElement(MagnifyingGlass, { size: 18, weight: "regular", "aria-hidden": true }),
        React.createElement("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "搜索会话或来源", "aria-label": "搜索会话" })),
      React.createElement("select", { value: context, onChange: (event) => setContext(event.target.value), "aria-label": "会话类型" },
        React.createElement("option", { value: "" }, "全部类型"),
        React.createElement("option", { value: "project" }, "项目"),
        React.createElement("option", { value: "knowledge_base" }, "知识库"),
        React.createElement("option", { value: "independent" }, "独立")),
      React.createElement("button", { type: "submit" }, "检索")),
    state.action?.status === "error"
      ? React.createElement("div", { className: "cpwb-page-error", role: "alert" }, state.action.error?.message || "会话加载失败")
      : null,
    page.items.length === 0
      ? React.createElement("div", { className: "cpwb-session-list-empty" }, React.createElement(ChatCircleText, { size: 28, weight: "regular" }), React.createElement("span", null, "暂无匹配会话"))
      : React.createElement("div", { className: "cpwb-session-list" }, page.items.map((row) => React.createElement("button", {
        type: "button",
        key: row.sessionId,
        className: "cpwb-session-list-row",
        onClick: () => onOpenSession?.(row.sessionId),
      },
      React.createElement(ChatCircleText, { size: 20, weight: "regular", "aria-hidden": true }),
      React.createElement("span", null,
        React.createElement("strong", null, row.title || row.displayTitle || row.contextName || "未命名会话"),
        React.createElement("small", null, scopeLabel(row))),
      React.createElement("time", null, activityLabel(row.updatedAt))))),
    React.createElement("footer", { className: "cpwb-session-pagination" },
      React.createElement("span", null, "共 " + page.total + " 条"),
      React.createElement("div", null,
        React.createElement("button", { type: "button", disabled: page.offset <= 0, onClick: () => load(Math.max(0, page.offset - page.limit)).catch(function () {}) }, "上一页"),
        React.createElement("button", { type: "button", disabled: page.offset + page.limit >= page.total, onClick: () => load(page.offset + page.limit).catch(function () {}) }, "下一页"))));
}
