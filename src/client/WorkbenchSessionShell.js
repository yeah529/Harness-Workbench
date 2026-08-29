import React from "react";
import { ArrowClockwise, ArrowSquareOut, Books, CalendarCheck, Check, ClockCountdown, Copy, DownloadSimple, File, FolderOpen, House, LockSimple, MagnifyingGlass, Note, Plus, Robot, Sparkle, Trash, TreeStructure, UploadSimple, WarningCircle } from "@phosphor-icons/react";
import { CyberSelect } from "./CyberSelect.js";
import { cpwbApi } from "./api.js";
import { getWorkbenchSession } from "./workbenchSessions.js";
import { useHomeOpen } from "./ProjectHome.js";
import { Todos } from "./Todos.js";
import { ACCEPT, KnowledgeBase, formatBytes } from "./KnowledgeBase.js";
import { Automation, filterSchedules, ScheduleDialog } from "./Automation.js";
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
import { SubagentDrawer } from "./SubagentDrawer.js";
import { DEFAULT_TIME_ZONE, localDateTimeParts } from "./timezone.js";
import { ProjectSkillsPanel } from "./SkillsManager.js";

export { parseNativeModelSelectionLabel } from "./ModelIndicator.js";
export { KnowledgeSourcesTail } from "./KnowledgeSourcesTail.js";
export { ProjectSkillsPanel } from "./SkillsManager.js";

export function compactSessionId(sessionId) {
  const value = String(sessionId || "");
  return value.length > 26 ? value.slice(0, 14) + "…" + value.slice(-8) : value;
}

function SessionIdCopy({ sessionId }) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef(null);

  React.useEffect(function () {
    return function () { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, []);

  const copy = async function () {
    const writeText = globalThis.navigator?.clipboard?.writeText;
    if (typeof writeText !== "function") return;
    try {
      await writeText.call(globalThis.navigator.clipboard, sessionId);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return React.createElement("span", { className: "cpwb-session-id", title: sessionId },
    React.createElement("code", null, compactSessionId(sessionId)),
    React.createElement("button", {
      type: "button",
      className: "cpwb-session-id-copy",
      onClick: copy,
      "aria-label": "复制 Session ID",
      title: copied ? "已复制" : "复制完整 Session ID",
    }, copied
      ? React.createElement(Check, { size: 14, weight: "bold", "aria-hidden": true })
      : React.createElement(Copy, { size: 14, weight: "regular", "aria-hidden": true })));
}

export const PROJECT_TOOL_TABS = Object.freeze([
  ["todos", "待办", CalendarCheck],
  ["files", "会话文件", File],
  ["summary", "每日总结", Note],
  ["schedule", "定时任务", ClockCountdown],
  ["knowledge", "知识芯片", Books],
  ["skills", "Skills", Sparkle],
]);

export const KNOWLEDGE_TOOL_TABS = Object.freeze([
  ["files", "会话文件", File],
  ["documents", "芯片文档", Books],
  ["index", "索引", MagnifyingGlass],
  ["projects", "关联项目", FolderOpen],
  ["global_schedule", "全局定时", ClockCountdown],
]);

export const INDEPENDENT_TOOL_TABS = Object.freeze([
  ["files", "会话文件", File],
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

export function GlobalSchedulesPanel({ state, store, initialDialog = false }) {
  React.useEffect(function () { store.actions.loadGlobalSchedules?.().catch(function () {}); }, [store]);
  const rows = Array.isArray(state.globalSchedules) ? state.globalSchedules : [];
  const [dialogOpen, setDialogOpen] = React.useState(initialDialog);
  const [query, setQuery] = React.useState("");
  const [projectFilter, setProjectFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("");
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const visibleRows = filterSchedules(rows, query).filter((schedule) => {
    if (projectFilter !== "all" && String(schedule.projectId) !== projectFilter) return false;
    if (statusFilter === "enabled" && schedule.enabled === false) return false;
    if (statusFilter === "paused" && schedule.enabled !== false) return false;
    if (dateFilter && instantDateKey(schedule.nextRunAt || schedule.startsAt, timeZone) !== dateFilter) return false;
    return true;
  });
  const action = state.action;
  const save = (payload) => store.actions.createGlobalSchedule(payload).then(() => setDialogOpen(false));
  return React.createElement("div", { className: "cpwb-global-schedules" },
    React.createElement("div", { className: "cpwb-tool-head cpwb-global-schedule-head" },
      React.createElement("span", null, "GLOBAL SCHEDULES"),
      React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", onClick: () => setDialogOpen(true) }, React.createElement(Plus, { size: 14, weight: "bold", "aria-hidden": true }), React.createElement("span", null, "新增定时"))),
    React.createElement("label", { className: "cpwb-tool-search" },
      React.createElement(MagnifyingGlass, { size: 15, "aria-hidden": true }),
      React.createElement("input", { type: "search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "搜索任务名称或提示词", "aria-label": "搜索全局定时任务" })),
    React.createElement("div", { className: "cpwb-context-filters", "aria-label": "筛选全局定时任务" },
      React.createElement("label", null, "项目", React.createElement(CyberSelect, {
        value: projectFilter,
        onChange: setProjectFilter,
        ariaLabel: "筛选定时任务所属项目",
        options: [{ value: "all", label: "全部项目" }, ...(state.projects || []).map((project) => ({ value: String(project.id), label: project.name }))],
      })),
      React.createElement("label", null, "状态", React.createElement(CyberSelect, {
        value: statusFilter,
        onChange: setStatusFilter,
        ariaLabel: "筛选定时任务状态",
        options: [{ value: "all", label: "全部状态" }, { value: "enabled", label: "已启用" }, { value: "paused", label: "已暂停" }],
      })),
      React.createElement("label", null, "触发日期", React.createElement("input", { type: "date", value: dateFilter, onChange: (event) => setDateFilter(event.target.value) }))),
    React.createElement("div", { className: "cpwb-context-filter-count" }, "显示 " + visibleRows.length + " / " + rows.length + " 项"),
    visibleRows.length === 0 ? React.createElement("div", { className: "cpwb-context-empty" }, rows.length ? "没有符合筛选条件的定时任务" : "暂无全局定时任务") : null,
    React.createElement("div", { className: "cpwb-context-list" }, visibleRows.map((schedule) => {
    const project = state.projects?.find?.((item) => item.id === schedule.projectId);
    return React.createElement("article", { key: schedule.id, className: "cpwb-context-card" },
      React.createElement("span", null, project?.name || "项目 #" + schedule.projectId),
      React.createElement("strong", null, schedule.name),
      React.createElement("small", null, (schedule.enabled ? "已启用" : "已暂停") + " · " + (schedule.nextRunAt || schedule.startsAt || "待计算")));
    })),
    dialogOpen ? React.createElement(ScheduleDialog, {
      projects: state.projects || [],
      timeZone,
      busy: action?.type === "createGlobalSchedule" && action.status === "running",
      error: action?.type === "createGlobalSchedule" && action.status === "error" ? action.error : null,
      onSave: save,
      onClose: () => setDialogOpen(false),
    }) : null);
}

export function SessionFilesPanel({ sessionId, state, store, scopeKind }) {
  const [dragActive, setDragActive] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const files = state.sessionFilesBySession?.[sessionId] || [];

  React.useEffect(function () {
    store.actions.loadSessionFiles?.(sessionId).catch(function (cause) { setError(cause?.message || "文件读取失败"); });
  }, [sessionId, store]);

  const upload = async function (fileList) {
    const selectedFiles = Array.from(fileList || []);
    if (selectedFiles.length === 0 || uploading) return;
    setUploading(true);
    setError(null);
    try { await store.actions.uploadSessionFiles({ files: selectedFiles, sessionId }); }
    catch (cause) { setError(cause?.message || "文件上传失败"); }
    finally { setUploading(false); }
  };

  const onDrop = function (event) {
    event.preventDefault();
    setDragActive(false);
    upload(event.dataTransfer?.files);
  };

  const scopeHint = scopeKind === "project"
    ? "上传后用 @文件 引用，项目文件直接用 @路径"
    : scopeKind === "knowledge_base"
      ? "上传后用 @文件 引用，不会写入知识芯片"
      : "上传后用 @文件 引用";

  return React.createElement("div", { className: "cpwb-session-files" },
    React.createElement("div", { className: "cpwb-tool-head" },
      React.createElement("div", { className: "cpwb-tool-heading" },
        React.createElement("span", null, "私有存储"),
        React.createElement("h3", null, "会话文件")),
      React.createElement("div", { className: "cpwb-tool-head-actions" },
        React.createElement("code", null, String(files.length).padStart(2, "0")),
        React.createElement("button", {
          type: "button",
          className: "cpwb-icon-button",
          onClick: () => store.actions.loadSessionFiles?.(sessionId),
          title: "刷新会话文件",
          "aria-label": "刷新会话文件",
        }, React.createElement(ArrowClockwise, { size: 14, "aria-hidden": true })))),
    React.createElement("div", { className: "cpwb-session-file-scope" },
      React.createElement(LockSimple, { size: 15, weight: "regular", "aria-hidden": true }),
      React.createElement("div", null,
        React.createElement("strong", null, "仅当前会话"),
        React.createElement("small", null, scopeHint))),
    React.createElement("label", {
      className: "cpwb-drop" + (dragActive ? " cpwb-drop-active" : ""),
      onDrop,
      onDragOver: function (event) { event.preventDefault(); if (!uploading) setDragActive(true); },
      onDragLeave: function () { setDragActive(false); },
    },
    React.createElement("input", {
      type: "file",
      multiple: true,
      accept: ACCEPT,
      disabled: uploading,
      style: { display: "none" },
      onChange: function (event) { upload(event.target.files); event.target.value = ""; },
    }),
    React.createElement(UploadSimple, { size: 20, "aria-hidden": true }),
    React.createElement("strong", null, uploading ? "正在保存与解析…" : "上传会话文件"),
    React.createElement("small", null, "点击或拖拽 · 单文件最大 50 MB")),
    error ? React.createElement("div", { className: "cpwb-error-msg", role: "alert" }, error) : null,
    files.length > 0
      ? React.createElement("div", { className: "cpwb-list cpwb-session-document-list" }, files.map(function (file) {
          return React.createElement(
            "article",
            { key: file.id, className: "cpwb-item cpwb-session-document" },
            React.createElement("div", { className: "cpwb-item-main" },
              React.createElement("div", { className: "cpwb-item-title" }, file.originalName),
              React.createElement("div", { className: "cpwb-item-meta" }, formatBytes(file.size) + " · " + (file.parseStatus === "ready" ? "可直接引用" : "解析失败")),
              file.parseError ? React.createElement("small", { className: "cpwb-error-msg" }, file.parseError) : null),
            React.createElement("div", { className: "cpwb-session-document-actions" },
              React.createElement("a", { className: "cpwb-icon-button", href: cpwbApi.sessionFiles.contentUrl(file.id), target: "_blank", rel: "noreferrer", title: "打开原始文件", "aria-label": "打开原始文件 " + file.originalName }, React.createElement(ArrowSquareOut, { size: 14, "aria-hidden": true })),
              React.createElement("a", { className: "cpwb-icon-button", href: cpwbApi.sessionFiles.contentUrl(file.id, { download: true }), download: file.originalName, title: "下载原始文件", "aria-label": "下载原始文件 " + file.originalName }, React.createElement(DownloadSimple, { size: 14, "aria-hidden": true })),
              React.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", onClick: () => store.actions.deleteSessionFile({ sessionId, id: file.id }).catch((cause) => setError(cause?.message || "删除失败")), title: "删除会话文件", "aria-label": "删除会话文件 " + file.originalName }, React.createElement(Trash, { size: 14, "aria-hidden": true }))),
          );
        }))
      : null,
  );
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
  const tabIdSeed = React.useId();
  const tabIdPrefix = "cpwb-tool-tab-" + tabIdSeed.replace(/:/g, "-");
  const tabRefs = React.useRef(new Map());
  const state = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const homeOpenSnapshot = useHomeOpen();
  const sessionSnapshot = React.useSyncExternalStore(
    props.sessions?.list?.subscribe || (() => () => {}),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions)),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions)),
  );
  const sessionId = props.sessionId ?? sessionSnapshot.current;
  const opening = props.opening === true;
  const openError = props.openError?.message ? props.openError : null;
  const runtimeEntry = getWorkbenchSession(sessionId);
  const persistedEntry = state.workbenchSessions?.[sessionId];
  const entry = persistedEntry ? { ...runtimeEntry, ...persistedEntry } : runtimeEntry;
  const scope = entry?.scope;
  const projectId = scope?.kind === "project" ? scope.id : null;
  const knowledgeBaseId = scope?.kind === "knowledge_base" ? scope.id : null;
  const project = projectId == null ? null : projectFor(state, projectId);
  const knowledgeBase = knowledgeBaseId == null ? null : knowledgeBaseFor(state, knowledgeBaseId);
  const [activeTool, setActiveTool] = React.useState(function () {
    return scope?.kind === "project" ? "todos" : "files";
  });
  const visible = props.open === undefined ? !homeOpenSnapshot : props.open;
  const scopeKey = scope?.kind ? scope.kind + ":" + String(scope.id ?? "") : null;
  const contextSeatAvailable = useContextRailSeat(scopeKey);
  useSessionHeaderSeat(visible && Boolean(sessionId?.startsWith?.("session-cpwb-")));
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const projectTriggerRef = React.useRef(null);
  const [subagentOpen, setSubagentOpen] = React.useState(false);
  const subagentCatalog = sessionSnapshot?.subagentsByParent?.[sessionId];
  const subagentCount = Array.isArray(subagentCatalog?.entries)
    ? subagentCatalog.entries.filter((item) => item?.kind === "child").length
    : 0;

  React.useEffect(function () {
    setSubagentOpen(false);
    if (!visible || opening || openError || !sessionId || typeof props.sessions?.refreshSubagents !== "function") return undefined;
    props.sessions.refreshSubagents(sessionId).catch(function () {});
    return undefined;
  }, [openError, opening, props.sessions, sessionId, visible]);

  React.useEffect(function () {
    setActiveTool(scope?.kind === "project" ? "todos" : "files");
  }, [scope?.kind, scope?.id]);

  React.useEffect(function () {
    if (scope?.kind !== "independent" || entry?.title || typeof props.store.actions.loadRecentSessions !== "function") return undefined;
    let attempts = 0;
    let stopped = false;
    let timer = null;
    const refresh = async function () {
      attempts += 1;
      await props.store.actions.loadRecentSessions().catch(function () {});
      if (!stopped && attempts < 12) timer = setTimeout(refresh, 1500);
    };
    void refresh();
    return function () { stopped = true; if (timer) clearTimeout(timer); };
  }, [entry?.title, props.store, scope?.kind, sessionId]);

  React.useEffect(function () {
    if (!opening && !openError && projectId != null && state.activeProjectId !== projectId) {
      props.store.actions.refreshProject(projectId).catch(function () {});
    }
  }, [openError, opening, projectId, props.store, state.activeProjectId]);

  if (!visible || !sessionId || !String(sessionId).startsWith("session-cpwb-")) return null;

  const toolTabs = projectId != null ? PROJECT_TOOL_TABS : knowledgeBaseId != null ? KNOWLEDGE_TOOL_TABS : INDEPENDENT_TOOL_TABS;
  const effectiveActiveTool = toolTabs.some(([id]) => id === activeTool) ? activeTool : toolTabs[0]?.[0];
  const tabIdFor = (id) => tabIdPrefix + "-" + id;
  const tabPanelId = tabIdPrefix + "-panel";
  const setTabRef = (id) => (node) => {
    if (node) tabRefs.current.set(id, node);
    else tabRefs.current.delete(id);
  };
  const onToolTabKeyDown = (event, id) => {
    const currentId = toolTabs.some(([tabId]) => tabId === id) ? id : effectiveActiveTool;
    const currentIndex = toolTabs.findIndex(([tabId]) => tabId === currentId);
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % toolTabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + toolTabs.length) % toolTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = toolTabs.length - 1;
    else return;
    event.preventDefault();
    const nextId = toolTabs[nextIndex][0];
    setActiveTool(nextId);
    tabRefs.current.get(nextId)?.focus?.();
  };
  let body = null;
  if (projectId != null) {
    if (effectiveActiveTool === "todos") body = React.createElement(Todos, { store: props.store, projectId });
    else if (effectiveActiveTool === "schedule") body = React.createElement(Automation, { store: props.store, projectId, view: "schedule" });
    else if (effectiveActiveTool === "files") body = React.createElement(SessionFilesPanel, { sessionId, state, store: props.store, scopeKind: "project" });
    else if (effectiveActiveTool === "knowledge") body = React.createElement(KnowledgeBase, { store: props.store, projectId, view: "linked" });
    else if (effectiveActiveTool === "summary") body = React.createElement(Automation, { store: props.store, projectId, view: "summary" });
    else if (effectiveActiveTool === "skills") body = React.createElement(ProjectSkillsPanel, { store: props.store, projectId });
  } else if (knowledgeBaseId != null) {
    if (effectiveActiveTool === "files") body = React.createElement(SessionFilesPanel, { sessionId, state, store: props.store, scopeKind: "knowledge_base" });
    else if (effectiveActiveTool === "documents") body = React.createElement(KnowledgeBase, { store: props.store, knowledgeBaseId, view: "documents" });
    else if (effectiveActiveTool === "index") body = React.createElement(KnowledgeIndexPanel, { knowledgeBaseId, state, store: props.store });
    else if (effectiveActiveTool === "projects") body = React.createElement(LinkedProjectsPanel, { knowledgeBaseId, state, store: props.store });
    else if (effectiveActiveTool === "global_schedule") body = React.createElement(GlobalSchedulesPanel, { state, store: props.store });
  } else {
    if (effectiveActiveTool === "files") body = React.createElement(SessionFilesPanel, { sessionId, state, store: props.store, scopeKind: "independent" });
    else if (effectiveActiveTool === "subagents") body = React.createElement("div", { className: "cpwb-context-list" },
      React.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" }, React.createElement("span", null, "SUBAGENT ACTIVITY"), React.createElement("strong", null, subagentCount + " 个子智能体"), React.createElement("small", null, "查看会话、状态与运行详情")),
      React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: () => setSubagentOpen(true) }, "打开 Subagent 抽屉"));
    else if (effectiveActiveTool === "global_schedule") body = React.createElement(GlobalSchedulesPanel, { state, store: props.store });
  }

  const contextRail = function (drawer = false) {
    const railKind = projectId != null ? "PROJECT SYSTEM" : knowledgeBaseId != null ? "KNOWLEDGE SYSTEM" : "SESSION SYSTEM";
    const railName = projectId != null ? project?.name || "项目工作台" : knowledgeBaseId != null ? knowledgeBase?.name || "知识库" : entry?.title || "独立会话";
    const railMeta = projectId != null ? "项目工具舱 · " + String(projectId).padStart(2, "0") : knowledgeBaseId != null ? "知识库上下文 · " + String(knowledgeBaseId).padStart(2, "0") : "无容器归属 · GLOBAL";
    return React.createElement("aside", { className: "cpwb-project-rail" + (drawer ? " cpwb-project-rail-drawer" : ""), "aria-label": "上下文工具" },
      React.createElement("header", { className: "cpwb-project-rail-header" },
        React.createElement("span", null, railKind),
        React.createElement("h2", null, railName),
        React.createElement("small", null, railMeta)),
      React.createElement("nav", { className: "cpwb-project-tool-tabs", role: "tablist", "aria-label": "上下文工具", "data-tool-count": String(toolTabs.length) }, toolTabs.map(([id, label, IconComponent]) => React.createElement("button", {
        type: "button",
        role: "tab",
        id: tabIdFor(id),
        ref: setTabRef(id),
        key: id,
        className: effectiveActiveTool === id ? "cpwb-active" : "",
        onClick: () => setActiveTool(id),
        onKeyDown: (event) => onToolTabKeyDown(event, id),
        tabIndex: effectiveActiveTool === id ? 0 : -1,
        "aria-selected": effectiveActiveTool === id,
        "aria-controls": tabPanelId,
        "aria-current": effectiveActiveTool === id ? "page" : undefined,
        "aria-label": label,
        "data-tooltip": label,
      }, React.createElement(IconComponent, { size: 18, weight: "regular", "aria-hidden": true }), React.createElement("span", null, label)))),
      React.createElement("div", { id: tabPanelId, className: "cpwb-project-tool-body", role: "tabpanel", "aria-label": effectiveActiveTool, "aria-labelledby": tabIdFor(effectiveActiveTool) }, body));
  };

  const transitioning = opening || Boolean(openError);
  const dockedContextRail = !transitioning && contextSeatAvailable && layoutMode === "desktop";
  const drawerContextRail = !transitioning && contextSeatAvailable && layoutMode !== "desktop";
  const contextType = projectId != null ? "项目会话" : knowledgeBaseId != null ? "知识库会话" : "独立会话";
  const contextName = projectId != null
    ? project?.name || "项目工作台"
    : knowledgeBaseId != null
      ? knowledgeBase?.name || entry?.contextName || "知识库"
      : entry?.title || entry?.displayTitle || "新独立会话";
  const contextDetail = opening
    ? "正在恢复会话"
    : openError
      ? "恢复失败"
      : projectId != null
        ? String(Array.isArray(state.linkedKnowledgeBases) ? state.linkedKnowledgeBases.length : 0) + " 个关联知识库"
        : knowledgeBaseId != null
          ? "向量检索已启用"
          : "未关联项目 · 未启用知识库";
  return React.createElement("div", {
    className: "cpwb-session-chrome cpwb-workbench-overlay " + (dockedContextRail ? "cpwb-has-context-rail " : "") + (projectId != null ? "cpwb-project-context" : "cpwb-standalone-context") + (transitioning ? " cpwb-session-transitioning" : ""),
    "data-session-context": scope?.kind || "unknown",
    "data-right-owner": dockedContextRail ? "context-tools" : !contextSeatAvailable ? "native-details" : undefined,
    "aria-label": "Workbench 会话框架",
  },
  React.createElement("header", { className: "cpwb-session-context-bar", "aria-label": "会话上下文" },
    React.createElement("div", { className: "cpwb-session-context-identity" },
      React.createElement("span", { className: "cpwb-session-context-kind" }, contextType),
      React.createElement("strong", null, contextName),
      React.createElement(SessionIdCopy, { sessionId })),
    React.createElement("div", { className: "cpwb-session-context-meta" },
      React.createElement("small", null, contextDetail),
      React.createElement("button", {
        type: "button",
        className: "cpwb-session-subagent-trigger",
        onClick: () => setSubagentOpen(true),
        "aria-label": "打开子智能体活动，共 " + subagentCount + " 个",
        "aria-expanded": subagentOpen,
      }, React.createElement(Robot, { size: 16, weight: "duotone", "aria-hidden": true }), React.createElement("span", null, "SUBAGENT"), React.createElement("b", null, String(subagentCount).padStart(2, "0"))))),
  transitioning ? React.createElement("div", {
    className: "cpwb-session-transition",
    role: opening ? "status" : "alert",
    "aria-live": opening ? "polite" : "assertive",
  }, React.createElement("div", { className: "cpwb-session-transition-panel" },
    React.createElement("div", { className: "cpwb-session-transition-code" }, openError ? "SESSION RESTORE ERROR" : "SESSION HANDSHAKE"),
    React.createElement("div", { className: "cpwb-session-transition-mark", "aria-hidden": true }, openError
      ? React.createElement(WarningCircle, { size: 28, weight: "regular" })
      : React.createElement(ArrowClockwise, { size: 28, weight: "regular" })),
    React.createElement("strong", null, openError ? "会话恢复失败" : "正在恢复会话"),
    React.createElement("p", null, openError ? openError.message : "正在同步 DSH 会话与 Workspace，请稍候。"),
    opening ? React.createElement("div", { className: "cpwb-session-transition-signal", "aria-hidden": true },
      React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)) : null,
    openError ? React.createElement("div", { className: "cpwb-session-transition-actions" },
      React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: props.onRetryOpen }, React.createElement(ArrowClockwise, { size: 15, "aria-hidden": true }), "重试"),
      React.createElement("button", { type: "button", className: "cpwb-btn", onClick: props.onHome }, React.createElement(House, { size: 15, "aria-hidden": true }), "返回首页")) : null)) : null,
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
  !transitioning ? React.createElement(SubagentDrawer, {
    open: subagentOpen,
    parentSessionId: sessionId,
    connection: props.connection,
    sessions: props.sessions,
    onClose: () => setSubagentOpen(false),
  }) : null);
}
