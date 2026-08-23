import React from "react";
import { Books, CalendarCheck, ClockCountdown, File, FolderOpen, MagnifyingGlass, Note, Paperclip, Robot, TreeStructure } from "@phosphor-icons/react";
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
import { useNativeModelSelectionLabel } from "./ModelIndicator.js";
import { SubagentDrawer } from "./SubagentDrawer.js";
import { DEFAULT_TIME_ZONE, localDateTimeParts } from "./timezone.js";

export { parseNativeModelSelectionLabel } from "./ModelIndicator.js";

export const PROJECT_TOOL_TABS = Object.freeze([
  ["todos", "待办", CalendarCheck],
  ["schedule", "定时任务", ClockCountdown],
  ["knowledge", "关联知识库", Books],
  ["summary", "每日总结", Note],
]);

export const KNOWLEDGE_TOOL_TABS = Object.freeze([
  ["documents", "文档", File],
  ["index", "索引", MagnifyingGlass],
  ["projects", "关联项目", FolderOpen],
  ["global_schedule", "全局定时", ClockCountdown],
]);

export const INDEPENDENT_TOOL_TABS = Object.freeze([
  ["context", "上下文", TreeStructure],
  ["files", "文件", Paperclip],
  ["subagents", "Subagent", Robot],
  ["global_schedule", "全局定时", ClockCountdown],
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

/** Reserve one right-side seat inside the native conversation column. */
function useContextRailSeat(scopeKey) {
  const [nativeDetailsOpen, setNativeDetailsOpen] = React.useState(false);

  useBrowserLayoutEffect(function () {
    setNativeDetailsOpen(false);
    if (!scopeKey || typeof document === "undefined") return undefined;

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
  }, [scopeKey]);

  return !nativeDetailsOpen;
}

function instantDateKey(value, timeZone) {
  if (!value) return "";
  try {
    const parts = localDateTimeParts(value, timeZone);
    return [parts.year, String(parts.month).padStart(2, "0"), String(parts.day).padStart(2, "0")].join("-");
  } catch { return ""; }
}

export function GlobalSchedulesPanel({ state, store }) {
  React.useEffect(function () { store.actions.loadGlobalSchedules?.().catch(function () {}); }, [store]);
  const rows = Array.isArray(state.globalSchedules) ? state.globalSchedules : [];
  const [projectFilter, setProjectFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("");
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const visibleRows = rows.filter((schedule) => {
    if (projectFilter !== "all" && String(schedule.projectId) !== projectFilter) return false;
    if (statusFilter === "enabled" && schedule.enabled === false) return false;
    if (statusFilter === "paused" && schedule.enabled !== false) return false;
    if (dateFilter && instantDateKey(schedule.nextRunAt || schedule.startsAt, timeZone) !== dateFilter) return false;
    return true;
  });
  return React.createElement("div", { className: "cpwb-global-schedules" },
    React.createElement("div", { className: "cpwb-context-filters", "aria-label": "筛选全局定时任务" },
      React.createElement("label", null, "项目", React.createElement("select", { value: projectFilter, onChange: (event) => setProjectFilter(event.target.value) },
        React.createElement("option", { value: "all" }, "全部项目"),
        (state.projects || []).map((project) => React.createElement("option", { key: project.id, value: String(project.id) }, project.name)))),
      React.createElement("label", null, "状态", React.createElement("select", { value: statusFilter, onChange: (event) => setStatusFilter(event.target.value) },
        React.createElement("option", { value: "all" }, "全部状态"),
        React.createElement("option", { value: "enabled" }, "已启用"),
        React.createElement("option", { value: "paused" }, "已暂停"))),
      React.createElement("label", null, "触发日期", React.createElement("input", { type: "date", value: dateFilter, onChange: (event) => setDateFilter(event.target.value) }))),
    React.createElement("div", { className: "cpwb-context-filter-count" }, "显示 " + visibleRows.length + " / " + rows.length + " 项"),
    visibleRows.length === 0 ? React.createElement("div", { className: "cpwb-context-empty" }, rows.length ? "没有符合筛选条件的定时任务" : "暂无全局定时任务") : null,
    React.createElement("div", { className: "cpwb-context-list" }, visibleRows.map((schedule) => {
    const project = state.projects?.find?.((item) => item.id === schedule.projectId);
    return React.createElement("article", { key: schedule.id, className: "cpwb-context-card" },
      React.createElement("span", null, project?.name || "项目 #" + schedule.projectId),
      React.createElement("strong", null, schedule.name),
      React.createElement("small", null, (schedule.enabled ? "已启用" : "已暂停") + " · " + (schedule.nextRunAt || schedule.startsAt || "待计算")));
    })));
}

function SessionContextPanel({ sessionId, scope, state, store }) {
  React.useEffect(function () { store.actions.loadSessionContext?.(sessionId).catch(function () {}); }, [sessionId, store]);
  const rows = Array.isArray(state.contextBySession?.[sessionId]) ? state.contextBySession[sessionId] : [];
  const inherited = scope.kind === "project" ? "项目 Workspace + 全部关联知识库" : scope.kind === "knowledge_base" ? "当前知识库全部可用文档" : "无默认继承来源";
  return React.createElement("div", { className: "cpwb-context-list" },
    React.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" }, React.createElement("span", null, "INHERITED"), React.createElement("strong", null, inherited), React.createElement("small", null, "随容器关联变化动态更新")),
    rows.map((row, index) => React.createElement("article", { key: row.id || index, className: "cpwb-context-card" },
      React.createElement("span", null, String(row.mode || "pinned").toUpperCase()),
      React.createElement("strong", null, (row.sourceKind || row.source?.kind) + " / " + (row.sourceId || row.source?.id)),
      React.createElement("small", null, row.available === false ? "引用来源已删除" : "会话固定来源"))));
}

function SessionFilesPanel() {
  return React.createElement("div", { className: "cpwb-context-list" },
    React.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" },
      React.createElement("span", null, "DSH FILES API"),
      React.createElement("strong", null, "文件与图片由原生输入区管理"),
      React.createElement("small", null, "使用回形针、图片按钮或 @ 引用当前 Workspace 文件")));
}

function KnowledgeIndexPanel({ knowledgeBaseId, state, store }) {
  const docs = Array.isArray(state.documents) ? state.documents : [];
  const ready = docs.filter((item) => item.status === "ready").length;
  const stale = docs.filter((item) => item.status === "stale" || item.status === "failed").length;
  return React.createElement("div", { className: "cpwb-context-list" },
    React.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" },
      React.createElement("span", null, "VECTOR INDEX"), React.createElement("strong", null, ready + " / " + docs.length + " 文档就绪"), React.createElement("small", null, stale ? stale + " 个索引需要处理" : "索引状态正常")),
    React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: () => store.actions.reindexKnowledgeBase?.(knowledgeBaseId) }, "重建当前知识库索引"));
}

function LinkedProjectsPanel({ knowledgeBaseId, state, store }) {
  React.useEffect(function () { store.actions.loadKnowledgeBaseProjects?.(knowledgeBaseId).catch(function () {}); }, [knowledgeBaseId, store]);
  const projects = Array.isArray(state.linkedProjects) ? state.linkedProjects : [];
  return React.createElement("div", { className: "cpwb-context-list" }, projects.length
    ? projects.map((project) => React.createElement("article", { key: project.id, className: "cpwb-context-card" }, React.createElement("span", null, "PROJECT"), React.createElement("strong", null, project.name), React.createElement("small", null, project.path || "已关联")))
    : React.createElement("div", { className: "cpwb-context-empty" }, "尚未关联任何项目"));
}

/** Native rc.2 ConversationRoot remains the only conversation renderer. */
export function WorkbenchSessionShell(props) {
  const state = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const homeOpenSnapshot = useHomeOpen();
  const sessionSnapshot = React.useSyncExternalStore(
    props.sessions?.list?.subscribe || (() => () => {}),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions)),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions)),
  );
  const sessionId = props.sessionId ?? sessionSnapshot.current;
  const runtimeEntry = getWorkbenchSession(sessionId);
  const persistedEntry = state.workbenchSessions?.[sessionId];
  const entry = persistedEntry ? { ...runtimeEntry, ...persistedEntry } : runtimeEntry;
  const scope = entry?.scope;
  const projectId = scope?.kind === "project" ? scope.id : null;
  const knowledgeBaseId = scope?.kind === "knowledge_base" ? scope.id : null;
  const project = projectId == null ? null : projectFor(state, projectId);
  const knowledgeBase = knowledgeBaseId == null ? null : knowledgeBaseFor(state, knowledgeBaseId);
  const [activeTool, setActiveTool] = React.useState(function () {
    return scope?.kind === "project" ? "todos" : scope?.kind === "knowledge_base" ? "documents" : "context";
  });
  const visible = props.open === undefined ? !homeOpenSnapshot : props.open;
  const scopeKey = scope?.kind ? scope.kind + ":" + String(scope.id ?? "") : null;
  const contextSeatAvailable = useContextRailSeat(scopeKey);
  useSessionHeaderSeat(visible && Boolean(sessionId?.startsWith?.("session-cpwb-")));
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const projectTriggerRef = React.useRef(null);
  const nativeSelectionLabel = useNativeModelSelectionLabel(sessionId);
  const [subagentOpen, setSubagentOpen] = React.useState(false);
  const subagentCatalog = sessionSnapshot?.subagentsByParent?.[sessionId];
  const subagentCount = Array.isArray(subagentCatalog?.entries)
    ? subagentCatalog.entries.filter((item) => item?.kind === "child").length
    : 0;

  React.useEffect(function () {
    setSubagentOpen(false);
    if (!visible || !sessionId || typeof props.sessions?.refreshSubagents !== "function") return undefined;
    props.sessions.refreshSubagents(sessionId).catch(function () {});
    return undefined;
  }, [props.sessions, sessionId, visible]);

  React.useEffect(function () {
    setActiveTool(scope?.kind === "project" ? "todos" : scope?.kind === "knowledge_base" ? "documents" : "context");
  }, [scope?.kind, scope?.id]);

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

  const toolTabs = projectId != null ? PROJECT_TOOL_TABS : knowledgeBaseId != null ? KNOWLEDGE_TOOL_TABS : INDEPENDENT_TOOL_TABS;
  let body = null;
  if (projectId != null) {
    if (activeTool === "todos") body = React.createElement(Todos, { store: props.store, projectId });
    else if (activeTool === "schedule") body = React.createElement(Automation, { store: props.store, projectId, view: "schedule" });
    else if (activeTool === "knowledge") body = React.createElement(KnowledgeBase, { store: props.store, projectId, view: "linked" });
    else if (activeTool === "summary") body = React.createElement(Automation, { store: props.store, projectId, view: "summary" });
  } else if (knowledgeBaseId != null) {
    if (activeTool === "documents") body = React.createElement(KnowledgeBase, { store: props.store, knowledgeBaseId, view: "documents" });
    else if (activeTool === "index") body = React.createElement(KnowledgeIndexPanel, { knowledgeBaseId, state, store: props.store });
    else if (activeTool === "projects") body = React.createElement(LinkedProjectsPanel, { knowledgeBaseId, state, store: props.store });
    else if (activeTool === "global_schedule") body = React.createElement(GlobalSchedulesPanel, { state, store: props.store });
  } else {
    if (activeTool === "context") body = React.createElement(SessionContextPanel, { sessionId, scope: scope || { kind: "independent", id: null }, state, store: props.store });
    else if (activeTool === "files") body = React.createElement(SessionFilesPanel);
    else if (activeTool === "subagents") body = React.createElement("div", { className: "cpwb-context-list" },
      React.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" }, React.createElement("span", null, "SUBAGENT ACTIVITY"), React.createElement("strong", null, subagentCount + " 个子智能体"), React.createElement("small", null, "查看会话、状态与运行详情")),
      React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: () => setSubagentOpen(true) }, "打开 Subagent 抽屉"));
    else if (activeTool === "global_schedule") body = React.createElement(GlobalSchedulesPanel, { state, store: props.store });
  }

  const contextRail = function (drawer = false) {
    const railKind = projectId != null ? "PROJECT SYSTEM" : knowledgeBaseId != null ? "KNOWLEDGE SYSTEM" : "SESSION SYSTEM";
    const railName = projectId != null ? project?.name || "项目工作台" : knowledgeBaseId != null ? knowledgeBase?.name || "知识库" : entry?.title || "独立会话";
    const railMeta = projectId != null ? "项目上下文 · " + String(projectId).padStart(2, "0") : knowledgeBaseId != null ? "知识库上下文 · " + String(knowledgeBaseId).padStart(2, "0") : "无容器归属 · GLOBAL";
    return React.createElement("aside", { className: "cpwb-project-rail" + (drawer ? " cpwb-project-rail-drawer" : ""), "aria-label": "上下文工具" },
      React.createElement("header", { className: "cpwb-project-rail-header" },
        React.createElement("span", null, railKind),
        React.createElement("h2", null, railName),
        React.createElement("small", null, railMeta)),
      React.createElement("nav", { className: "cpwb-project-tool-tabs", "aria-label": "上下文工具" }, toolTabs.map(([id, label, IconComponent]) => React.createElement("button", {
        type: "button",
        key: id,
        className: activeTool === id ? "cpwb-active" : "",
        onClick: () => setActiveTool(id),
        "aria-current": activeTool === id ? "page" : undefined,
        title: label,
      }, React.createElement(IconComponent, { size: 18, weight: "regular", "aria-hidden": true }), React.createElement("span", null, label)))),
      React.createElement("div", { className: "cpwb-project-tool-body" }, body));
  };

  const dockedContextRail = contextSeatAvailable && layoutMode === "desktop";
  const drawerContextRail = contextSeatAvailable && layoutMode !== "desktop";
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
    className: "cpwb-session-chrome cpwb-workbench-overlay cpwb-has-context-rail " + (projectId != null ? "cpwb-project-context" : "cpwb-standalone-context"),
    "data-session-context": scope?.kind || "unknown",
    "data-right-owner": dockedContextRail ? "context-tools" : !contextSeatAvailable ? "native-details" : undefined,
    "aria-label": "Workbench 会话框架",
  },
  React.createElement("header", { className: "cpwb-session-context-bar", "aria-label": "会话上下文" },
    React.createElement("div", { className: "cpwb-session-context-identity" },
      React.createElement("span", { className: "cpwb-session-context-kind" }, contextType),
      React.createElement("strong", null, contextName)),
    React.createElement("div", { className: "cpwb-session-context-meta" },
      React.createElement("small", null, contextDetail),
      React.createElement("button", {
        type: "button",
        className: "cpwb-session-subagent-trigger",
        onClick: () => setSubagentOpen(true),
        "aria-label": "打开子智能体活动，共 " + subagentCount + " 个",
        "aria-expanded": subagentOpen,
      }, React.createElement(Robot, { size: 16, weight: "duotone", "aria-hidden": true }), React.createElement("span", null, "SUBAGENT"), React.createElement("b", null, String(subagentCount).padStart(2, "0"))),
      React.createElement("em", null, selectionLabel))),
  dockedContextRail ? contextRail(false) : null,
  drawerContextRail ? React.createElement("button", {
    ref: projectTriggerRef,
    type: "button",
    className: "cpwb-project-tool-toggle",
    "aria-label": "打开上下文工具",
    "aria-expanded": props.projectDrawerOpen === true,
    onClick: props.onProjectDrawerOpen,
  }, React.createElement(TreeStructure, { size: 18, "aria-hidden": true }), React.createElement("span", null, "上下文工具")) : null,
  drawerContextRail ? React.createElement(DrawerDialog, {
    open: props.projectDrawerOpen === true,
    onClose: props.onProjectDrawerClose,
    label: "上下文工具",
    side: "right",
    triggerRef: projectTriggerRef,
  }, contextRail(true)) : null,
  React.createElement(SubagentDrawer, {
    open: subagentOpen,
    parentSessionId: sessionId,
    connection: props.connection,
    sessions: props.sessions,
    onClose: () => setSubagentOpen(false),
  }));
}
