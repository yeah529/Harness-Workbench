import React from "react";
import { Archive, ArrowCounterClockwise, ChatCircleText, MagnifyingGlass } from "@phosphor-icons/react";

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

export function SessionListPage({ archived = false, store, onOpenSession, initialScope = null }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const [query, setQuery] = React.useState("");
  const [appliedQuery, setAppliedQuery] = React.useState("");
  const [context, setContext] = React.useState("");
  const page = state.sessionPage ?? { items: [], total: 0, limit: 20, offset: 0 };
  const lockedScope = initialScope?.kind === "project" || initialScope?.kind === "knowledge_base" ? initialScope : null;
  const scopeKind = lockedScope?.kind ?? (context || null);
  const scopeId = lockedScope?.id ?? null;

  const load = React.useCallback((offset = 0) => store.actions.loadAllSessions({
    query: appliedQuery,
    scopeKind,
    scopeId,
    archived,
    offset,
    limit: page.limit || 20,
  }), [appliedQuery, archived, page.limit, scopeId, scopeKind, store]);

  React.useEffect(function () { load(0).catch(function () {}); }, [load]);

  const mutate = async function (row) {
    if (archived) await store.actions.restoreSession(row.sessionId);
    else await store.actions.archiveSession(row.sessionId);
    await load(0).catch(function () {});
  };

  return React.createElement("main", { className: "cpwb-session-list-page cpwb-workbench-page", "data-page": archived ? "archive" : "sessions" },
    React.createElement("header", { className: "cpwb-page-header" },
      React.createElement("div", { className: "cpwb-page-header-main" },
        React.createElement("span", null, archived ? "04 / ARCHIVE" : "03 / CONVERSATIONS"),
        React.createElement("h1", null, archived ? "归档会话" : "全部会话"),
        React.createElement("p", null, archived ? "已归档记录仍可查看，并可随时恢复到最近会话。" : "项目、知识库与独立会话统一管理。")),
      React.createElement("div", { className: "cpwb-page-header-stat" }, React.createElement("strong", null, page.total), React.createElement("span", null, "条会话"))),
    lockedScope ? React.createElement("div", { className: "cpwb-session-scope-banner" },
      React.createElement("span", null, lockedScope.kind === "project" ? "PROJECT SCOPE" : "KNOWLEDGE SCOPE"),
      React.createElement("strong", null, lockedScope.name || (lockedScope.kind === "project" ? "当前项目" : "当前知识库")),
      React.createElement("small", null, "仅显示该" + (lockedScope.kind === "project" ? "项目" : "知识库") + "会话")) : null,
    React.createElement("form", { className: "cpwb-session-filters" + (lockedScope ? " cpwb-session-filters-locked" : ""), onSubmit: function (event) { event.preventDefault(); setAppliedQuery(query.trim()); } },
      React.createElement("label", null,
        React.createElement(MagnifyingGlass, { size: 18, weight: "regular", "aria-hidden": true }),
        React.createElement("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "搜索会话或来源", "aria-label": "搜索会话" })),
      lockedScope ? null : React.createElement("select", { value: context, onChange: (event) => setContext(event.target.value), "aria-label": "会话类型" },
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
      : React.createElement("div", { className: "cpwb-session-list" }, page.items.map((row) => React.createElement("article", {
        key: row.sessionId,
        className: "cpwb-session-list-row" + (archived ? " cpwb-session-list-row-archived" : ""),
      },
      React.createElement("button", { type: "button", className: "cpwb-session-list-open", onClick: () => onOpenSession?.(row.sessionId) },
        React.createElement(ChatCircleText, { size: 20, weight: "regular", "aria-hidden": true }),
        React.createElement("span", null,
          React.createElement("strong", null, row.title || row.displayTitle || row.contextName || "未命名会话"),
          React.createElement("small", null, scopeLabel(row))),
        React.createElement("time", null, archived ? "归档于 " + activityLabel(row.archivedAt) : activityLabel(row.updatedAt))),
      React.createElement("button", {
        type: "button",
        className: "cpwb-session-list-action",
        disabled: state.action?.status === "loading",
        onClick: () => mutate(row).catch(function () {}),
        "aria-label": (archived ? "恢复会话 " : "归档会话 ") + (row.title || "未命名会话"),
        title: archived ? "恢复会话" : "归档会话",
      }, archived
        ? React.createElement(ArrowCounterClockwise, { size: 18, weight: "regular", "aria-hidden": true })
        : React.createElement(Archive, { size: 18, weight: "regular", "aria-hidden": true }))))),
    React.createElement("footer", { className: "cpwb-session-pagination" },
      React.createElement("span", null, "共 " + page.total + " 条"),
      React.createElement("div", null,
        React.createElement("button", { type: "button", disabled: page.offset <= 0, onClick: () => load(Math.max(0, page.offset - page.limit)).catch(function () {}) }, "上一页"),
        React.createElement("button", { type: "button", disabled: page.offset + page.limit >= page.total, onClick: () => load(page.offset + page.limit).catch(function () {}) }, "下一页"))));
}
