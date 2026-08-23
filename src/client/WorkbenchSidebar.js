import React from "react";
import {
  Books,
  ChatsCircle,
  GearSix,
  House,
  ListBullets,
  Plus,
} from "@phosphor-icons/react";
import { SidebarBrand } from "./SidebarBrand.js";

const ICON_WEIGHT = "regular";

function NavIcon({ component: Component }) {
  return React.createElement(Component, { size: 19, weight: ICON_WEIGHT, "aria-hidden": true });
}

function contextLabel(session) {
  if (session.contextName) return session.contextName;
  if (session.scope?.kind === "project") return "项目";
  if (session.scope?.kind === "knowledge_base") return "知识库";
  return "独立";
}

function sessionScope(session) {
  if (session?.scope) return { kind: session.scope.kind, id: session.scope.id ?? null };
  return { kind: session?.scopeKind, id: session?.scopeId ?? null };
}

function sameScope(left, right) {
  return left?.kind === right?.kind && String(left?.id ?? "") === String(right?.id ?? "");
}

export function partitionSidebarSessions(sessions, currentScope, activeSessionId) {
  const list = Array.isArray(sessions) ? sessions : [];
  if (!currentScope) return { current: [], recent: list.slice(0, 8) };
  const inCurrent = currentScope.kind === "independent"
    ? list.filter((item) => item.sessionId === activeSessionId)
    : list.filter((item) => sameScope(sessionScope(item), currentScope));
  const excluded = new Set(inCurrent.map((item) => item.sessionId));
  if (currentScope.kind === "independent" && activeSessionId) excluded.add(activeSessionId);
  return {
    current: inCurrent.slice(0, 3),
    recent: list.filter((item) => !excluded.has(item.sessionId) && !sameScope(sessionScope(item), currentScope)).slice(0, 8),
  };
}

function sessionButton(session, activeSessionId, onOpenSession) {
  return React.createElement("button", {
    type: "button",
    key: session.sessionId,
    className: "cpwb-sidebar-recent" + (session.sessionId === activeSessionId ? " cpwb-active" : ""),
    onClick: () => onOpenSession?.(session.sessionId),
  },
  React.createElement(NavIcon, { component: ChatsCircle }),
  React.createElement("span", null,
    React.createElement("strong", null, session.title || session.displayTitle || session.contextName || "未命名会话"),
    React.createElement("small", null, contextLabel(session))));
}

export function WorkbenchSidebar({
  page,
  activeSessionId,
  recentSessions = [],
  currentScope = null,
  currentContainerName = null,
  currentContainerTotal = 0,
  onNavigate,
  onNewSession,
  onOpenSession,
  settingsTrigger,
}) {
  const groups = partitionSidebarSessions(recentSessions, currentScope, activeSessionId);
  const nav = [
    ["home", "首页", House],
    ["sessions", "全部会话", ListBullets],
    ["knowledge", "知识库", Books],
  ];
  const containerKind = currentScope?.kind === "project" ? "当前项目" : currentScope?.kind === "knowledge_base" ? "当前知识库" : "当前会话";
  return React.createElement("aside", { className: "cpwb-global-sidebar", "aria-label": "Workbench 全局导航" },
    React.createElement("div", { className: "cpwb-sidebar-primary" },
      React.createElement("div", { className: "cpwb-sidebar-product" },
        React.createElement("span", null, "DEEPSEEK"),
        React.createElement("small", null, "HARNESS WORKBENCH")),
      React.createElement("button", { type: "button", className: "cpwb-sidebar-new", onClick: onNewSession },
        React.createElement(NavIcon, { component: Plus }), React.createElement("span", null, "新建会话")),
      React.createElement("nav", { className: "cpwb-sidebar-global-nav", "aria-label": "主导航" },
        nav.map(([id, label, IconComponent]) => React.createElement("button", {
          type: "button",
          key: id,
          className: "cpwb-sidebar-nav-item" + (page === id ? " cpwb-active" : ""),
          "aria-current": page === id ? "page" : undefined,
          onClick: () => onNavigate?.(id),
        }, React.createElement(NavIcon, { component: IconComponent }), React.createElement("span", null, label))))),
    currentScope ? React.createElement("section", { className: "cpwb-sidebar-current", "aria-label": containerKind },
      React.createElement("div", { className: "cpwb-sidebar-section-label" }, containerKind, React.createElement("b", null, String(currentContainerTotal || groups.current.length).padStart(2, "0"))),
      React.createElement("div", { className: "cpwb-sidebar-container-name" }, currentContainerName || "当前上下文"),
      React.createElement("div", { className: "cpwb-sidebar-current-list" },
        groups.current.length ? groups.current.map((session) => sessionButton(session, activeSessionId, onOpenSession)) : React.createElement("p", { className: "cpwb-sidebar-empty" }, "暂无已保存会话")),
      React.createElement("button", { type: "button", className: "cpwb-sidebar-all", onClick: () => onNavigate?.("sessions") },
        "查看全部 " + (currentContainerTotal || groups.current.length) + " 个会话")) : null,
    React.createElement("section", { className: "cpwb-sidebar-recents", "aria-label": "其他最近会话" },
      React.createElement("div", { className: "cpwb-sidebar-section-label" }, currentScope ? "其他最近会话" : "最近会话", React.createElement("b", null, String(groups.recent.length).padStart(2, "0"))),
      React.createElement("div", { className: "cpwb-sidebar-recent-scroll" },
        groups.recent.length === 0
          ? React.createElement("p", { className: "cpwb-sidebar-empty" }, "暂无会话")
          : groups.recent.map((session) => sessionButton(session, activeSessionId, onOpenSession)),
        React.createElement("button", { type: "button", className: "cpwb-sidebar-all", onClick: () => onNavigate?.("sessions") },
          "查看全部会话"))),
    React.createElement("div", { className: "cpwb-sidebar-fixed-footer" },
      React.createElement("button", { type: "button", className: "cpwb-sidebar-settings", onClick: settingsTrigger },
        React.createElement(NavIcon, { component: GearSix }), React.createElement("span", null, "设置")),
      React.createElement(SidebarBrand, { status: "INTELLIGENCE ONLINE" })));
}
