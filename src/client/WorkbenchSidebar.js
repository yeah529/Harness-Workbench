import React from "react";
import {
  Books,
  Archive,
  ChatsCircle,
  FolderOpen,
  GearSix,
  House,
  ListBullets,
  ClockCountdown,
  Plus,
  Sparkle,
} from "@phosphor-icons/react";
import { HarnessWordmark, SidebarBrand, WorkbenchNodeMark } from "./SidebarBrand.js";
import { DEFAULT_TIME_ZONE, localDateTimeParts } from "./timezone.js";

const ICON_WEIGHT = "regular";
const RECENT_SESSION_LIMIT = 20;

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

function sessionType(session) {
  if (session?.sessionType === "schedule") return { Icon: ClockCountdown, label: "定时任务会话", kind: "schedule" };
  const scope = sessionScope(session);
  if (scope.kind === "project") return { Icon: FolderOpen, label: "项目会话", kind: "project" };
  if (scope.kind === "knowledge_base") return { Icon: Books, label: "知识库会话", kind: "knowledge-base" };
  return { Icon: ChatsCircle, label: "独立会话", kind: "independent" };
}

function calendarDay(parts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000;
}

function activityGroupLabel(session, now, timeZone) {
  const value = session?.updatedAt || session?.createdAt;
  if (!value) return "更早";
  try {
    const activity = new Date(value);
    const activityParts = localDateTimeParts(activity, timeZone);
    const nowParts = localDateTimeParts(now, timeZone);
    const daysAgo = calendarDay(nowParts) - calendarDay(activityParts);
    if (daysAgo === 0) return "今天";
    if (daysAgo === 1) return "昨天";
    if (daysAgo >= 2 && daysAgo <= 6) {
      return new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "long" }).format(activity);
    }
    if (activityParts.year === nowParts.year) return `${activityParts.month}月${activityParts.day}日`;
    return `${activityParts.year}年${activityParts.month}月${activityParts.day}日`;
  } catch {
    return "更早";
  }
}

export function groupSidebarSessionsByDate(sessions, {
  now = new Date(),
  timeZone = DEFAULT_TIME_ZONE,
} = {}) {
  const groups = [];
  const byLabel = new Map();
  for (const session of Array.isArray(sessions) ? sessions : []) {
    const label = activityGroupLabel(session, now, timeZone);
    let group = byLabel.get(label);
    if (!group) {
      group = { label, sessions: [] };
      byLabel.set(label, group);
      groups.push(group);
    }
    group.sessions.push(session);
  }
  return groups;
}

function sessionButton(session, activeSessionId, onOpenSession, onArchiveSession) {
  const title = session.title || session.displayTitle || session.contextName || "未命名会话";
  const active = session.sessionId === activeSessionId;
  const type = sessionType(session);
  return React.createElement("div", {
    key: session.sessionId,
    className: "cpwb-sidebar-session-row" + (active ? " cpwb-active" : ""),
    "data-session-kind": type.kind,
  }, React.createElement("button", {
      type: "button",
      className: "cpwb-sidebar-recent",
      onClick: () => onOpenSession?.(session.sessionId),
      "aria-current": active ? "page" : undefined,
    },
    React.createElement("span", { className: "cpwb-sidebar-session-content" },
      React.createElement("strong", null, title),
      React.createElement("small", null,
        React.createElement(type.Icon, {
          size: 12,
          weight: ICON_WEIGHT,
          role: "img",
          "aria-label": type.label,
        }),
        React.createElement("span", null, type.kind === "schedule" ? `定时任务 · ${contextLabel(session)}` : contextLabel(session))))),
  React.createElement("button", {
    type: "button",
    className: "cpwb-sidebar-session-action",
    onClick: () => onArchiveSession?.(session.sessionId),
    "aria-label": "归档会话 " + title,
    title: "归档会话",
  }, React.createElement(Archive, { size: 15, weight: "regular", "aria-hidden": true })));
}

export function WorkbenchSidebar({
  page,
  activeSessionId,
  recentSessions = [],
  onNavigate,
  onNewSession,
  onOpenSession,
  onArchiveSession,
  settingsTrigger,
  timeZone = DEFAULT_TIME_ZONE,
}) {
  const recents = (Array.isArray(recentSessions) ? recentSessions : []).slice(0, RECENT_SESSION_LIMIT);
  const nav = [
    ["home", "首页", House],
    ["sessions", "全部会话", ListBullets],
    ["knowledge", "知识芯片", Books],
  ];
  return React.createElement("aside", { className: "cpwb-global-sidebar", "aria-label": "Workbench 全局导航" },
    React.createElement("div", { className: "cpwb-sidebar-primary" },
      React.createElement("div", { className: "cpwb-sidebar-product" },
        React.createElement("div", { className: "cpwb-sidebar-product-mark" }, React.createElement(WorkbenchNodeMark)),
        React.createElement("div", { className: "cpwb-sidebar-product-copy" },
          React.createElement(HarnessWordmark, { className: "cpwb-sidebar-product-wordmark" }))),
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
      React.createElement("div", { className: "cpwb-sidebar-section-label" }, "最近会话", React.createElement("b", null, String(recents.length).padStart(2, "0"))),
      React.createElement("div", { className: "cpwb-sidebar-recent-scroll" },
        recents.length === 0
          ? React.createElement("p", { className: "cpwb-sidebar-empty" }, "暂无会话")
          : groupSidebarSessionsByDate(recents, { timeZone }).map((group) => React.createElement("section", {
            key: group.label,
            className: "cpwb-sidebar-date-group",
            "aria-label": group.label,
          },
          React.createElement("h3", { className: "cpwb-sidebar-date-label" }, group.label),
          group.sessions.map((session) => sessionButton(session, activeSessionId, onOpenSession, onArchiveSession)))),
        React.createElement("button", { type: "button", className: "cpwb-sidebar-all", onClick: () => onNavigate?.("sessions") },
          "查看全部会话"))),
    React.createElement("div", { className: "cpwb-sidebar-fixed-footer" },
      React.createElement("button", {
        type: "button",
        className: "cpwb-sidebar-settings cpwb-sidebar-skills" + (page === "skills" ? " cpwb-active" : ""),
        "aria-current": page === "skills" ? "page" : undefined,
        onClick: () => onNavigate?.("skills"),
      }, React.createElement(NavIcon, { component: Sparkle }), React.createElement("span", null, "Skills")),
      React.createElement("button", { type: "button", className: "cpwb-sidebar-settings", onClick: settingsTrigger },
        React.createElement(NavIcon, { component: GearSix }), React.createElement("span", null, "设置")),
      React.createElement(SidebarBrand, { status: "INTELLIGENCE ONLINE" })));
}
