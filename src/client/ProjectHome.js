import React from "react";
import { ArrowUpRight, Database, PencilSimple, Trash } from "@phosphor-icons/react";
import { glyph, ICONS, Empty } from "./icons.js";
import { ContainerDeleteDialog } from "./ContainerDeleteDialog.js";

let homeOpen = true;
const homeListeners = new Set();

export function setProjectHomeOpen(value) {
  const next = !!value;
  if (homeOpen === next) return;
  homeOpen = next;
  for (const listener of homeListeners) listener();
}

export function openProjectHome() {
  setProjectHomeOpen(true);
}

export function useHomeOpen() {
  return React.useSyncExternalStore(
    function subscribe(listener) { homeListeners.add(listener); return function () { homeListeners.delete(listener); }; },
    function snapshot() { return homeOpen; },
    function serverSnapshot() { return homeOpen; },
  );
}

function shortPath(value) {
  if (!value) return "未绑定路径";
  const parts = String(value).split(/[\\/]/).filter(Boolean);
  return parts.length > 3 ? "…/" + parts.slice(-3).join("/") : value;
}

function formatRecent(value) {
  if (!value) return "尚未开始会话";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "最近会话可继续";
  return "最近活动 " + date.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function useHomeOverlayStyle(open) {
  return {
    "--cpwb-home-left": "0px",
    visibility: open ? "visible" : "hidden",
  };
}

export function resolveHomeMetrics({
  projects = [],
  knowledgeBases = [],
  recentSessions = [],
  recentSessionTotal = 0,
} = {}) {
  return {
    workspaceCount: projects.length,
    sessionCount: Math.max(Number(recentSessionTotal) || 0, recentSessions.length),
    knowledgeCount: knowledgeBases.length,
  };
}

function ProjectCard({ project, index, enterProject, busyId, setBusyId, setError, onRename, onDelete, onViewSessions }) {
  const recent = project.recentSession || null;
  const mountedRef = React.useRef(true);
  React.useEffect(function () {
    mountedRef.current = true;
    return function () { mountedRef.current = false; };
  }, []);
  const open = function (newSession) {
    if (busyId != null) return;
    setBusyId("project:" + project.id);
    setError(null);
    enterProject(project.id, {
      newSession,
      resumeSessionId: newSession || !recent ? undefined : recent.sessionId,
    }).then(function () {
      if (mountedRef.current) setBusyId(null);
    }).catch(function (err) {
      if (!mountedRef.current) return;
      setError(err && err.message ? err.message : "无法打开项目");
      setBusyId(null);
    });
  };
  const busy = busyId === "project:" + project.id;
  return React.createElement("article", {
    className: "cpwb-project-card",
    style: { "--cpwb-card-index": index },
    onClick: function () { open(false); },
    onKeyDown: function (event) { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(false); } },
    role: "button",
    tabIndex: 0,
    "aria-label": "打开项目 " + project.name,
  },
  React.createElement("div", { className: "cpwb-card-scan", "aria-hidden": true }),
  React.createElement("div", { className: "cpwb-card-topline" },
    React.createElement("span", { className: "cpwb-card-seq" }, "PROJECT / " + String(index + 1).padStart(2, "0")),
    React.createElement("div", { className: "cpwb-card-top-actions" },
      React.createElement("span", { className: "cpwb-card-state" }, recent ? "SESSION READY" : "NEW NODE"),
      React.createElement("button", {
        type: "button",
        className: "cpwb-card-manage",
        disabled: busyId != null,
        onClick: function (event) { event.stopPropagation(); onRename(project); },
        onKeyDown: function (event) { event.stopPropagation(); },
        title: "修改项目名称",
        "aria-label": "重命名项目 " + project.name,
      }, React.createElement(PencilSimple, { size: 14, weight: "regular", "aria-hidden": true })),
      React.createElement("button", {
        type: "button",
        className: "cpwb-card-manage cpwb-card-manage-danger",
        disabled: busyId != null,
        onClick: function (event) { event.stopPropagation(); onDelete(project); },
        onKeyDown: function (event) { event.stopPropagation(); },
        title: "从 Workbench 删除项目",
        "aria-label": "删除项目 " + project.name,
      }, React.createElement(Trash, { size: 14, weight: "regular", "aria-hidden": true })))),
  React.createElement("div", { className: "cpwb-card-symbol", "aria-hidden": true }, glyph(ICONS.folder, 32)),
  React.createElement("div", { className: "cpwb-card-copy" },
    React.createElement("h3", null, project.name),
    React.createElement("p", { title: project.path || "" }, shortPath(project.path)),
    React.createElement("span", null, formatRecent(recent && recent.updatedAt))),
  React.createElement("div", { className: "cpwb-card-actions" },
    React.createElement("span", { className: "cpwb-card-enter" }, busy ? "连接中…" : (recent ? "继续会话" : "进入项目"), React.createElement(ArrowUpRight, { size: 14, weight: "regular", "aria-hidden": true })),
    React.createElement("button", {
      type: "button",
      className: "cpwb-card-sessions",
      onClick: function (event) { event.stopPropagation(); onViewSessions?.(project); },
      onKeyDown: function (event) { event.stopPropagation(); },
      disabled: busyId != null,
      "aria-label": "查看项目 " + project.name + " 的全部会话",
      title: "查看全部会话",
    }, "全部会话"),
    React.createElement("button", {
      type: "button",
      className: "cpwb-card-new",
      onClick: function (event) { event.stopPropagation(); open(true); },
      disabled: busyId != null,
      title: "为该项目新建会话",
    }, glyph(ICONS.plus), React.createElement("span", null, "新会话"))));
}

export function ProjectHome(props) {
  const store = props.store;
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const homeOpenSnapshot = useHomeOpen();
  const open = props.open === undefined ? homeOpenSnapshot : props.open;
  const homeStyle = useHomeOverlayStyle(open);
  const [busyId, setBusyId] = React.useState(null);
  const [enterError, setEnterError] = React.useState(null);
  const [creatingProject, setCreatingProject] = React.useState(false);
  const [renameTarget, setRenameTarget] = React.useState(null);
  const [renameDraft, setRenameDraft] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  if (!open) return null;

  const projects = Array.isArray(state.projects) ? state.projects : [];
  const knowledgeBases = Array.isArray(state.knowledgeBases) ? state.knowledgeBases : [];
  const { workspaceCount, sessionCount, knowledgeCount } = resolveHomeMetrics({
    projects,
    knowledgeBases,
    recentSessions: state.recentSessions,
    recentSessionTotal: state.recentSessionTotal,
  });
  const error = enterError || state.error;
  const renaming = !!(state.action && state.action.type === "renameProject" && state.action.status === "running");

  const addFolder = function () {
    if (creatingProject) return;
    setCreatingProject(true);
    setEnterError(null);
    props.createProject().catch(function (err) {
      setEnterError(err && err.message ? err.message : "添加文件夹失败");
    }).finally(function () { setCreatingProject(false); });
  };

  const beginRename = function (project) {
    setEnterError(null);
    setRenameTarget(project);
    setRenameDraft(project.name);
  };

  const submitRename = function (event) {
    event.preventDefault();
    const name = renameDraft.trim();
    if (!renameTarget || !name || renaming) return;
    setEnterError(null);
    store.actions.renameProject({ id: renameTarget.id, name }).then(function () {
      setRenameTarget(null);
      setRenameDraft("");
    }).catch(function (err) {
      setEnterError(err && err.message ? err.message : "修改项目名称失败");
    });
  };

  return React.createElement("div", { className: "cpwb-home cpwb-workbench-overlay", "data-page": "home", style: homeStyle, role: "main", "aria-label": "Deepseek Harness Workbench" },
    React.createElement("div", { className: "cpwb-home-noise", "aria-hidden": true }),
    React.createElement("main", { className: "cpwb-home-main" },
      React.createElement("section", { className: "cpwb-hero" },
        React.createElement("div", { className: "cpwb-hero-kicker" }, "Harness Workbench / Intelligence online"),
        React.createElement("h1", null,
          React.createElement("span", null, "YOUR PROJECT."),
          React.createElement("span", null, "YOUR SYSTEM."),
          React.createElement("span", { className: "cpwb-hero-accent" }, "YOUR INTELLIGENCE.")),
        React.createElement("p", null, "驾驭智能，项目觉醒"),
        React.createElement("div", { className: "cpwb-home-metrics" },
          React.createElement("span", null, React.createElement("b", null, String(workspaceCount).padStart(2, "0")), " WORKSPACES"),
          React.createElement("span", null, React.createElement("b", null, String(sessionCount).padStart(2, "0")), " SESSIONS"),
          React.createElement("span", null, React.createElement("b", null, String(knowledgeCount).padStart(2, "0")), " KNOWLEDGE"))),
      error ? React.createElement("div", { className: "cpwb-home-error", role: "alert" },
        glyph(ICONS.warn), React.createElement("span", null, error.message || String(error)),
        React.createElement("button", { type: "button", onClick: function () { setEnterError(null); store.actions.retry().catch(function () {}); } }, "重试")) : null,
      state.phase === "loading"
        ? React.createElement("div", { className: "cpwb-home-loading", role: "status" }, React.createElement("i"), " 正在同步工作台数据…")
        : React.createElement(React.Fragment, null,
          React.createElement("section", { className: "cpwb-home-section" },
            React.createElement("header", null,
              React.createElement("div", null, React.createElement("span", null, "01 / WORKSPACES"), React.createElement("h2", null, "项目工作区")),
              React.createElement("button", { type: "button", className: "cpwb-folder-add", onClick: addFolder, disabled: creatingProject, title: "添加文件夹为项目", "aria-label": "添加文件夹为项目" },
                React.createElement("span", null, glyph(ICONS.folder, 22)), React.createElement("b", null, "+"), React.createElement("em", null, creatingProject ? "连接中" : "添加文件夹"))),
            projects.length === 0
              ? React.createElement(Empty, { glyph: glyph(ICONS.folder, 24) }, "暂无项目，使用右上角文件夹图标添加")
              : React.createElement("div", { className: "cpwb-project-grid" }, projects.map(function (project, index) {
                return React.createElement(ProjectCard, {
                  key: project.id,
                  project,
                  index,
                  enterProject: props.enterProject,
                  busyId,
                  setBusyId,
                  setError: setEnterError,
                  onRename: beginRename,
                  onDelete: setDeleteTarget,
                  onViewSessions: props.openProjectSessions,
                });
              }))),
          React.createElement("section", { className: "cpwb-home-section cpwb-knowledge-entry" },
            React.createElement("button", { type: "button", onClick: props.openKnowledge },
              React.createElement(Database, { size: 26, weight: "regular", "aria-hidden": true }),
              React.createElement("span", null,
                React.createElement("small", null, "02 / KNOWLEDGE NODES"),
                React.createElement("strong", null, "打开知识库中心"),
                React.createElement("em", null, knowledgeBases.length + " 个知识库 · 上传、向量化、检索与会话")),
              React.createElement(ArrowUpRight, { size: 20, weight: "regular", "aria-hidden": true }))))),
    React.createElement("footer", { className: "cpwb-home-footer" }, "DEEPSEEK HARNESS / PROJECT INTELLIGENCE SYSTEM", React.createElement("span", null, "LOCAL-FIRST · VECTOR-READY")),
    renameTarget ? React.createElement("div", {
      className: "cpwb-modal-backdrop",
      onMouseDown: function (event) { if (event.target === event.currentTarget && !renaming) setRenameTarget(null); },
    }, React.createElement("form", {
      className: "cpwb-modal cpwb-project-modal",
      role: "dialog",
      "aria-modal": true,
      "aria-labelledby": "cpwb-rename-project-title",
      onSubmit: submitRename,
    },
    React.createElement("div", { className: "cpwb-modal-kicker" }, "PROJECT / RENAME"),
    React.createElement("h3", { id: "cpwb-rename-project-title" }, "修改项目名称"),
    React.createElement("label", null, "项目名称", React.createElement("input", {
      value: renameDraft,
      maxLength: 120,
      autoFocus: true,
      onChange: function (event) { setRenameDraft(event.target.value); },
    })),
    React.createElement("p", { className: "cpwb-project-modal-note" }, "仅修改 Workbench 中的显示名称，不会重命名磁盘目录或 DSH workspace。"),
    React.createElement("div", { className: "cpwb-modal-actions" },
      React.createElement("button", { type: "button", className: "cpwb-btn", disabled: renaming, onClick: function () { setRenameTarget(null); } }, "取消"),
      React.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: renaming || renameDraft.trim() === "" }, renaming ? "保存中…" : "保存名称")))) : null,
    deleteTarget ? React.createElement(ContainerDeleteDialog, { kind: "project", target: deleteTarget, store, onClose: () => setDeleteTarget(null) }) : null);
}
