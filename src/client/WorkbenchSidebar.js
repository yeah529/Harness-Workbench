import React from "react";
import {
  Books,
  ChatsCircle,
  GearSix,
  House,
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

export function WorkbenchSidebar({
  page,
  activeSessionId,
  recentSessions = [],
  onNavigate,
  onNewSession,
  onOpenSession,
  settingsTrigger,
}) {
  const recent = recentSessions.slice(0, 8);
  const nav = [
    ["home", "首页", House],
    ["knowledge", "知识库", Books],
  ];
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
    React.createElement("section", { className: "cpwb-sidebar-recents", "aria-label": "最近会话" },
      React.createElement("div", { className: "cpwb-sidebar-section-label" }, "最近会话", React.createElement("b", null, String(recent.length).padStart(2, "0"))),
      React.createElement("div", { className: "cpwb-sidebar-recent-scroll" },
        recent.length === 0
          ? React.createElement("p", { className: "cpwb-sidebar-empty" }, "暂无会话")
          : recent.map((session) => React.createElement("button", {
            type: "button",
            key: session.sessionId,
            className: "cpwb-sidebar-recent" + (session.sessionId === activeSessionId ? " cpwb-active" : ""),
            onClick: () => onOpenSession?.(session.sessionId),
          },
          React.createElement(NavIcon, { component: ChatsCircle }),
          React.createElement("span", null,
            React.createElement("strong", null, session.title || session.displayTitle || session.contextName || "未命名会话"),
            React.createElement("small", null, contextLabel(session))))),
        React.createElement("button", { type: "button", className: "cpwb-sidebar-all", onClick: () => onNavigate?.("sessions") },
          "查看全部会话"))),
    React.createElement("div", { className: "cpwb-sidebar-fixed-footer" },
      React.createElement("button", { type: "button", className: "cpwb-sidebar-settings", onClick: settingsTrigger },
        React.createElement(NavIcon, { component: GearSix }), React.createElement("span", null, "设置")),
      React.createElement(SidebarBrand, { status: "INTELLIGENCE ONLINE" })));
}
