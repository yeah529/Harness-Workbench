import React from "react";
import { Books, CalendarCheck, ClockCountdown, Note } from "@phosphor-icons/react";
import { getWorkbenchSession } from "./workbenchSessions.js";
import { useHomeOpen } from "./ProjectHome.js";
import { Todos } from "./Todos.js";
import { KnowledgeBase } from "./KnowledgeBase.js";
import { Automation } from "./Automation.js";
import {
  RAIL_STYLE_PROPS,
  RAIL_WIDTH_DEFAULT,
  applyInlineStyle,
  captureInlineStyle,
  conversationCompression,
  isDrawerMode,
  resolveWorkbenchColumns,
  restoreInlineStyle,
} from "./rail.js";
import { DrawerDialog, useWorkbenchLayoutMode } from "./responsive.js";

export const PROJECT_TOOL_TABS = Object.freeze([
  ["todos", "待办", CalendarCheck],
  ["schedule", "定时任务", ClockCountdown],
  ["knowledge", "关联知识库", Books],
  ["summary", "每日总结", Note],
]);

function readSessionSnapshot(sessions) {
  try {
    return sessions?.list?.getSnapshot?.() ?? { current: undefined };
  } catch {
    return { current: undefined };
  }
}

function projectFor(state, projectId) {
  return Array.isArray(state.projects) ? state.projects.find((project) => project.id === projectId) : null;
}

function knowledgeBaseFor(state, knowledgeBaseId) {
  return Array.isArray(state.knowledgeBases)
    ? state.knowledgeBases.find((knowledgeBase) => knowledgeBase.id === knowledgeBaseId)
    : null;
}

const useBrowserLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
const SESSION_HEADER_STYLE_PROPS = ["box-sizing", "padding-top", "--cpwb-session-header-height"];

function useSessionHeaderSeat(active) {
  useBrowserLayoutEffect(function () {
    if (!active || typeof document === "undefined") return undefined;
    const { conversationColumn } = resolveWorkbenchColumns(document);
    if (!conversationColumn) return undefined;
    const original = captureInlineStyle(conversationColumn, SESSION_HEADER_STYLE_PROPS);
    const update = function () {
      const height = typeof window !== "undefined" && window.innerWidth < 900 ? 108 : 64;
      applyInlineStyle(conversationColumn, {
        "box-sizing": "border-box",
        "padding-top": height + "px",
        "--cpwb-session-header-height": height + "px",
      });
    };
    update();
    window.addEventListener("resize", update);
    return function () {
      window.removeEventListener("resize", update);
      restoreInlineStyle(conversationColumn, original);
    };
  }, [active]);
}

export function parseNativeModelSelectionLabel(value) {
  const match = typeof value === "string"
    ? value.match(/^选择模型，当前\s*(.+?)，推理等级\s*(.+)$/)
    : null;
  return match ? match[1].trim() + " · " + match[2].trim() : null;
}

function useNativeModelSelectionLabel(sessionId) {
  const [label, setLabel] = React.useState(null);
  React.useEffect(function () {
    if (typeof document === "undefined") return undefined;
    const update = function () {
      const button = document.querySelector('button[aria-label^="选择模型，当前"]');
      setLabel(parseNativeModelSelectionLabel(button?.getAttribute("aria-label")));
    };
    update();
    if (typeof MutationObserver !== "function") return undefined;
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-label"],
    });
    return function () { observer.disconnect(); };
  }, [sessionId]);
  return label;
}

/** Reserve one right-side seat inside the native conversation column. */
function useProjectRailSeat(projectId) {
  const [nativeDetailsOpen, setNativeDetailsOpen] = React.useState(false);

  useBrowserLayoutEffect(function () {
    setNativeDetailsOpen(false);
    if (projectId == null || typeof document === "undefined") return undefined;

    const { conversationColumn, detailsColumn } = resolveWorkbenchColumns(document);
    if (!conversationColumn) return undefined;

    const original = captureInlineStyle(conversationColumn, RAIL_STYLE_PROPS);
    const compression = conversationCompression(RAIL_WIDTH_DEFAULT);
    let restored = false;

    const restore = function () {
      if (restored) return;
      restoreInlineStyle(conversationColumn, original);
      restored = true;
    };
    const reserve = function () {
      applyInlineStyle(conversationColumn, {
        "box-sizing": "border-box",
        "padding-right": compression.paddingRight,
        [compression.cssVariable.name]: compression.cssVariable.value,
      });
      restored = false;
    };
    const update = function () {
      const detailsWidth = typeof detailsColumn?.getBoundingClientRect === "function"
        ? detailsColumn.getBoundingClientRect().width || 0
        : 0;
      const detailsOpen = detailsWidth > 1;
      setNativeDetailsOpen(detailsOpen);
      const viewportWidth = typeof window === "undefined" ? 1280 : window.innerWidth;
      if (!detailsOpen && !isDrawerMode(viewportWidth)) reserve();
      else restore();
    };

    update();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
    observer?.observe(conversationColumn);
    if (detailsColumn) observer?.observe(detailsColumn);
    window.addEventListener("resize", update);

    return function () {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      restoreInlineStyle(conversationColumn, original);
    };
  }, [projectId]);

  return !nativeDetailsOpen;
}

/** Native RC.8 ConversationRoot remains the only conversation renderer. */
export function WorkbenchSessionShell(props) {
  const state = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const legacyHomeOpen = useHomeOpen();
  const sessionSnapshot = readSessionSnapshot(props.sessions);
  const sessionId = props.sessionId ?? sessionSnapshot.current;
  const runtimeEntry = getWorkbenchSession(sessionId);
  const persistedEntry = state.workbenchSessions?.[sessionId];
  const entry = persistedEntry ? { ...runtimeEntry, ...persistedEntry } : runtimeEntry;
  const scope = entry?.scope;
  const projectId = scope?.kind === "project" ? scope.scopeId : null;
  const knowledgeBaseId = scope?.kind === "knowledge_base" ? scope.scopeId : null;
  const project = projectId == null ? null : projectFor(state, projectId);
  const knowledgeBase = knowledgeBaseId == null ? null : knowledgeBaseFor(state, knowledgeBaseId);
  const [activeTool, setActiveTool] = React.useState("todos");
  const visible = props.open === undefined ? !legacyHomeOpen : props.open;
  const projectSeatAvailable = useProjectRailSeat(projectId);
  useSessionHeaderSeat(visible && Boolean(sessionId?.startsWith?.("session-cpwb-")));
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const projectTriggerRef = React.useRef(null);
  const nativeSelectionLabel = useNativeModelSelectionLabel(sessionId);

  React.useEffect(function () {
    if (scope?.kind !== "independent" || entry?.title || typeof props.store.actions.loadRecentSessions !== "function") return undefined;
    let attempts = 0;
    let stopped = false;
    let timer = null;
    const refresh = async function () {
      attempts += 1;
      await props.store.actions.loadRecentSessions({ limit: 8 }).catch(function () {});
      if (!stopped && attempts < 12) timer = setTimeout(refresh, 1500);
    };
    void refresh();
    return function () { stopped = true; if (timer) clearTimeout(timer); };
  }, [entry?.title, props.store, scope?.kind, sessionId]);

  React.useEffect(function () {
    if (projectId != null && state.activeProjectId !== projectId) {
      props.store.actions.refreshProject(projectId).catch(function () {});
    }
  }, [projectId, props.store, state.activeProjectId]);

  if (!visible || !sessionId || !String(sessionId).startsWith("session-cpwb-")) return null;

  let body = null;
  if (projectId != null) {
    if (activeTool === "todos") body = React.createElement(Todos, { store: props.store, projectId });
    else if (activeTool === "schedule") body = React.createElement(Automation, { store: props.store, projectId, view: "schedule" });
    else if (activeTool === "knowledge") body = React.createElement(KnowledgeBase, { store: props.store, projectId, view: "linked" });
    else if (activeTool === "summary") body = React.createElement(Automation, { store: props.store, projectId, view: "summary" });
  }

  const projectRail = function (drawer = false) {
    return React.createElement("aside", { className: "cpwb-project-rail" + (drawer ? " cpwb-project-rail-drawer" : ""), "aria-label": "项目工具" },
      React.createElement("header", { className: "cpwb-project-rail-header" },
        React.createElement("span", null, "PROJECT SYSTEM"),
        React.createElement("h2", null, project?.name || "项目工作台"),
        React.createElement("small", null, "项目上下文 · " + String(projectId).padStart(2, "0"))),
      React.createElement("nav", { className: "cpwb-project-tool-tabs", "aria-label": "项目工具" }, PROJECT_TOOL_TABS.map(([id, label, IconComponent]) => React.createElement("button", {
        type: "button",
        key: id,
        className: activeTool === id ? "cpwb-active" : "",
        onClick: () => setActiveTool(id),
        "aria-current": activeTool === id ? "page" : undefined,
        title: label,
      }, React.createElement(IconComponent, { size: 18, weight: "regular", "aria-hidden": true }), React.createElement("span", null, label)))),
      React.createElement("div", { className: "cpwb-project-tool-body" }, body));
  };

  const dockedProjectRail = projectId != null && projectSeatAvailable && layoutMode === "desktop";
  const drawerProjectRail = projectId != null && projectSeatAvailable && layoutMode !== "desktop";
  const contextType = projectId != null ? "项目会话" : knowledgeBaseId != null ? "知识库会话" : "独立会话";
  const contextName = projectId != null
    ? project?.name || "项目工作台"
    : knowledgeBaseId != null
      ? knowledgeBase?.name || entry?.contextName || "知识库"
      : entry?.title || entry?.displayTitle || "新独立会话";
  const contextDetail = projectId != null
    ? String(Array.isArray(state.linkedKnowledgeBases) ? state.linkedKnowledgeBases.length : 0) + " 个关联知识库"
    : knowledgeBaseId != null
      ? "向量检索已启用"
      : "未关联项目 · 未启用知识库";
  const selection = entry?.selection || {};
  const selectionLabel = nativeSelectionLabel
    || [selection.model, selection.reasoningEffort].filter(Boolean).join(" · ")
    || "模型由会话选择器控制";

  return React.createElement("div", {
    className: "cpwb-session-chrome cpwb-workbench-overlay" + (projectId != null ? " cpwb-project-context" : " cpwb-standalone-context"),
    "data-session-context": scope?.kind || "unknown",
    "data-right-owner": dockedProjectRail ? "project-tools" : projectId != null && !projectSeatAvailable ? "native-details" : undefined,
    "aria-label": "Workbench 会话框架",
  },
  React.createElement("header", { className: "cpwb-session-context-bar", "aria-label": "会话上下文" },
    React.createElement("div", { className: "cpwb-session-context-identity" },
      React.createElement("span", { className: "cpwb-session-context-kind" }, contextType),
      React.createElement("strong", null, contextName)),
    React.createElement("div", { className: "cpwb-session-context-meta" },
      React.createElement("small", null, contextDetail),
      React.createElement("em", null, selectionLabel))),
  dockedProjectRail ? projectRail(false) : null,
  drawerProjectRail ? React.createElement("button", {
    ref: projectTriggerRef,
    type: "button",
    className: "cpwb-project-tool-toggle",
    "aria-label": "打开项目工具",
    "aria-expanded": props.projectDrawerOpen === true,
    onClick: props.onProjectDrawerOpen,
  }, React.createElement(CalendarCheck, { size: 18, "aria-hidden": true }), React.createElement("span", null, "项目工具")) : null,
  drawerProjectRail ? React.createElement(DrawerDialog, {
    open: props.projectDrawerOpen === true,
    onClose: props.onProjectDrawerClose,
    label: "项目工具",
    side: "right",
    triggerRef: projectTriggerRef,
  }, projectRail(true)) : null);
}
