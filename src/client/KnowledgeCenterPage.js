import React from "react";
import {
  ArrowLeft,
  ArrowSquareOut,
  ChatCircleDots,
  DownloadSimple,
  GearSix,
  LinkSimple,
  Plus,
  Trash,
  UploadSimple,
  X,
} from "@phosphor-icons/react";

import { cpwbApi } from "./api.js";
import { GlobalModal } from "./globalModal.js";
import { ACCEPT, formatBytes, needsDocumentPolling, statusMeta } from "./KnowledgeBase.js";
import {
  activeKnowledgeBaseId,
  nextKnowledgePreviewAfterLeave,
  useKnowledgeBackplaneLink,
} from "./knowledgeBackplane.js";

const h = React.createElement;

function twoDigits(value) {
  return String(value || 0).padStart(2, "0");
}

function overviewOf(knowledgeBase) {
  return {
    fileCount: 0,
    readyFileCount: 0,
    chunkCount: 0,
    linkedProjectCount: 0,
    sessionCount: 0,
    indexPercent: 0,
    state: "empty",
    latestIndexedAt: null,
    ...(knowledgeBase?.overview || {}),
  };
}

export function startKnowledgeChatDraft({ store, knowledgeBaseId, onDraftOpen }) {
  if (knowledgeBaseId == null) return false;
  store.actions.startDraft({ scope: { kind: "knowledge_base", id: knowledgeBaseId } });
  onDraftOpen?.();
  return true;
}

export function knowledgeStateLabel(overview) {
  const value = overview || {};
  if (value.state === "empty" || !value.fileCount) return "EMPTY";
  if (value.state === "ready") return "READY";
  if (value.state === "attention") return `ATTENTION ${value.indexPercent || 0}%`;
  return `INDEXING ${value.indexPercent || 0}%`;
}

export function knowledgeActivityRows(knowledgeBase) {
  const overview = overviewOf(knowledgeBase);
  const rows = [];
  if (knowledgeBase?.recentSession?.updatedAt) {
    rows.push({ at: knowledgeBase.recentSession.updatedAt, label: `${overview.sessionCount} 个知识库会话`, action: "SESSION" });
  }
  if (overview.latestIndexedAt) {
    rows.push({ at: overview.latestIndexedAt, label: `${overview.chunkCount} 个向量分块可检索`, action: "INDEX" });
  }
  if (knowledgeBase?.updatedAt) {
    rows.push({ at: knowledgeBase.updatedAt, label: "模块配置已更新", action: "UPDATE" });
  }
  return rows.slice(0, 3);
}

function formatClock(value, timezone) {
  if (!value) return "--:--";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone || "Asia/Shanghai",
    }).format(new Date(value));
  } catch {
    return "--:--";
  }
}

function fileType(document) {
  const name = String(document?.originalName || "FILE");
  const extension = name.includes(".") ? name.split(".").pop() : "FILE";
  return extension.slice(0, 5).toUpperCase();
}

function KnowledgeHeader({ mode, knowledgeBase, onBack, onCreate, onSettings, onUpload, onChat }) {
  const board = mode === "board";
  const create = mode === "create";
  return h("header", { className: "cpwb-page-header cpwb-knowledge-page-head" },
    h("div", { className: "cpwb-page-header-main" },
      h("span", null, create
        ? "NEW INTELLIGENCE MODULE"
        : board
          ? "KNOWLEDGE BACKPLANE / INTELLIGENCE MODULES"
          : `KB-MODULE // ${twoDigits(knowledgeBase?.id)} / ${knowledgeStateLabel(overviewOf(knowledgeBase))}`),
      h("h1", null, create ? "初始化知识芯片" : board ? "知识芯片" : knowledgeBase?.name || "知识库"),
      h("p", null, create
        ? "知识库创建后，文件上传与向量化会在模块详情中继续运行。"
        : board
          ? "管理可插拔知识模块。文件、向量索引、关联项目与会话状态保持在同一条真实数据链路上。"
          : "管理原始文件、向量索引和项目连接；会话继续复用 Workbench 的 RC.2 原生能力。")),
    h("div", { className: "cpwb-knowledge-head-actions" },
      board ? h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost", onClick: onSettings }, h(GearSix, { size: 16 }), "向量模型") : null,
      board ? h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary", onClick: onCreate }, h(Plus, { size: 16 }), "新建芯片") : null,
      !board ? h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost", onClick: onBack }, h(ArrowLeft, { size: 16 }), "返回知识库") : null,
      mode === "detail" ? h("button", { type: "button", className: "cpwb-kb-action", onClick: onUpload }, h(UploadSimple, { size: 16 }), "上传文件") : null,
      mode === "detail" ? h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary", onClick: onChat }, h(ChatCircleDots, { size: 16 }), "新建知识库会话") : null));
}

function KnowledgeChip({ knowledgeBase, selected, preview, onPin, onPreview, onPreviewEnd, cardRef }) {
  const overview = overviewOf(knowledgeBase);
  const fileValue = overview.state === "indexing"
    ? `${overview.readyFileCount} / ${overview.fileCount}`
    : String(overview.fileCount);
  return h("button", {
    ref: cardRef,
    type: "button",
    className: "cpwb-knowledge-chip" + (selected ? " cpwb-selected" : "") + (preview ? " cpwb-preview" : ""),
    "data-kb-id": knowledgeBase.id,
    onMouseEnter: onPreview,
    onMouseLeave: onPreviewEnd,
    onFocus: onPreview,
    onBlur: onPreviewEnd,
    onClick: onPin,
    "aria-pressed": selected,
    "aria-label": `选择知识库 ${knowledgeBase.name}`,
  },
    h("span", { className: "cpwb-knowledge-chip-top" },
      h("span", null, `KB-MODULE // ${twoDigits(knowledgeBase.id)}`),
      h("span", { className: "cpwb-knowledge-chip-state cpwb-state-" + overview.state }, knowledgeStateLabel(overview))),
    h("span", { className: "cpwb-knowledge-chip-core" },
      h("i", { className: "cpwb-knowledge-die", "aria-hidden": true }),
      h("span", { className: "cpwb-knowledge-chip-copy" },
        h("h2", null, knowledgeBase.name),
        h("p", null, knowledgeBase.description || "可被项目和独立会话调用的知识模块"))),
    h("span", { className: "cpwb-knowledge-chip-meta" },
      h("span", null, h("span", null, "FILES"), h("b", null, fileValue)),
      h("span", null, h("span", null, "CHUNKS"), h("b", null, overview.chunkCount.toLocaleString("en-US"))),
      h("span", null, h("span", null, "LINKS"), h("b", null, twoDigits(overview.linkedProjectCount)))));
}

function KnowledgeBackplane({ knowledgeBase, previewing, panelRef, timezone, onLink, onChat, onDetail }) {
  if (!knowledgeBase) return null;
  const overview = overviewOf(knowledgeBase);
  const projects = Array.isArray(knowledgeBase.linkedProjects) ? knowledgeBase.linkedProjects : [];
  const activity = knowledgeActivityRows(knowledgeBase);
  return h("aside", { ref: panelRef, className: "cpwb-knowledge-core" + (previewing ? " cpwb-previewing" : ""), "aria-live": "polite" },
    h("header", { className: "cpwb-knowledge-core-head" },
      h("div", null,
        h("span", { className: "cpwb-knowledge-eyebrow" }, previewing ? "连接背板 / HOVER PREVIEW" : "连接背板 / PINNED MODULE"),
        h("h2", null, knowledgeBase.name),
        h("small", null, `KB-MODULE // ${twoDigits(knowledgeBase.id)}`)),
      h("span", { className: "cpwb-knowledge-core-mark" }, "HW")),
    h("section", { className: "cpwb-knowledge-core-section" },
      h("div", { className: "cpwb-knowledge-core-label" }, h("span", null, "已接入项目"), h("b", null, `${twoDigits(projects.length)} LINKED`)),
      h("div", { className: "cpwb-knowledge-sockets" }, projects.length
        ? projects.map((project, index) => h("div", { className: "cpwb-knowledge-socket cpwb-live", key: project.id },
            h("i", null, `P${index + 1}`),
            h("span", null, h("strong", null, project.name), h("small", null, `${project.sessionCount || 0} 个项目会话`)),
            h("em", null, "LINKED")))
        : h("div", { className: "cpwb-knowledge-socket cpwb-empty-socket" },
            h("i", null, "00"),
            h("span", null, h("strong", null, "尚未关联项目"), h("small", null, "接入项目后，该知识库会加入项目会话上下文")))),
      h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-core-action", onClick: onLink }, h(LinkSimple, { size: 15 }), "接入其他项目")),
    h("section", { className: "cpwb-knowledge-core-section" },
      h("div", { className: "cpwb-knowledge-core-label" }, h("span", null, "当前知识上下文"), h("b", null, `${overview.chunkCount.toLocaleString("en-US")} CHUNKS`)),
      h("div", { className: "cpwb-knowledge-activity" }, activity.length
        ? activity.map((row, index) => h("div", { key: row.action + index }, h("time", null, formatClock(row.at, timezone)), h("span", null, row.label), h("b", null, row.action)))
        : h("p", null, "暂无索引或会话活动"))),
    h("section", { className: "cpwb-knowledge-core-section cpwb-knowledge-core-actions" },
      h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary cpwb-kb-core-action", onClick: onChat }, "使用此芯片新建会话"),
      h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost cpwb-kb-core-action", onClick: onDetail }, "打开模块详情")));
}

function KnowledgeBoard({ knowledgeBases, pinnedId, previewId, onPin, onPreview, onPreviewEnd, onCreate, onChat, onDetail, onLink, timezone }) {
  const activeId = activeKnowledgeBaseId({ previewId, pinnedId });
  const active = knowledgeBases.find((item) => item.id === activeId) || null;
  const boardRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const cardRefs = React.useRef(new Map());
  const link = useKnowledgeBackplaneLink({ activeId, boardRef, panelRef, cardRefs, cardCount: knowledgeBases.length });
  if (knowledgeBases.length === 0) {
    return h("section", { className: "cpwb-knowledge-empty-board" },
      h("i", { className: "cpwb-knowledge-die", "aria-hidden": true }),
      h("span", { className: "cpwb-knowledge-eyebrow" }, "NO INTELLIGENCE MODULES"),
      h("h2", null, "尚未接入知识芯片"),
      h("p", null, "创建知识库并上传文件，Workbench 会在本地向量节点完成解析与索引。"),
      h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary", onClick: onCreate }, h(Plus, { size: 16 }), "初始化第一个芯片"));
  }
  return h("div", { ref: boardRef, className: "cpwb-knowledge-board" },
    link ? h("svg", { className: "cpwb-knowledge-link" + (previewId != null ? " cpwb-previewing" : ""), viewBox: link.viewBox, "aria-hidden": true },
      h("path", { className: "cpwb-knowledge-link-path", d: link.path }),
      h("circle", { className: "cpwb-knowledge-link-origin", cx: link.origin.x, cy: link.origin.y, r: 3 }),
      h("circle", { cx: link.target.x, cy: link.target.y, r: 3 })) : null,
    h("section", { className: "cpwb-knowledge-chip-area" },
      h("div", { className: "cpwb-knowledge-chip-area-title" },
        h("span", null, "可用模块 ", h("b", null, twoDigits(knowledgeBases.length))),
        h("span", null, "本地向量节点 ", h("b", null, "READY"))),
      knowledgeBases.map((knowledgeBase) => h(KnowledgeChip, {
        key: knowledgeBase.id,
        knowledgeBase,
        selected: knowledgeBase.id === pinnedId,
        preview: knowledgeBase.id === previewId && knowledgeBase.id !== pinnedId,
        onPin: () => onPin(knowledgeBase.id),
        onPreview: () => onPreview(knowledgeBase.id),
        onPreviewEnd: () => onPreviewEnd(knowledgeBase.id),
        cardRef: (element) => {
          if (element) cardRefs.current.set(String(knowledgeBase.id), element);
          else cardRefs.current.delete(String(knowledgeBase.id));
        },
      }))),
    h(KnowledgeBackplane, {
      knowledgeBase: active,
      previewing: previewId != null,
      panelRef,
      timezone,
      onLink: () => onLink(active.id),
      onChat,
      onDetail: () => onDetail(active.id),
    }));
}

function KnowledgeCreate({ settings, files, setFiles, name, setName, description, setDescription, saving, error, onSubmit, onSettings }) {
  const embedding = settings?.embedding || {};
  const removeFile = (index) => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  return h("form", { className: "cpwb-knowledge-create-layout", onSubmit },
    h("section", { className: "cpwb-knowledge-panel cpwb-knowledge-form" },
      h("label", null, h("span", null, "知识库名称"), h("input", { value: name, onChange: (event) => setName(event.target.value), required: true, autoFocus: true, placeholder: "例如：产品需求与设计" }), h("small", null, "用于项目关联、会话范围和全局检索。")),
      h("label", null, h("span", null, "描述（可选）"), h("textarea", { value: description, onChange: (event) => setDescription(event.target.value), placeholder: "说明这个知识模块包含什么内容" })),
      h("div", { className: "cpwb-knowledge-runtime" },
        h("span", { className: "cpwb-knowledge-eyebrow" }, "全局向量运行时"),
        h("div", null, h("i", null, "EM"), h("span", null, h("strong", null, embedding.model || "未配置向量模型"), h("small", null, `${embedding.provider || "unknown"} / ${embedding.dimensions || "?"} dimensions`)), h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost", onClick: onSettings }, "设置")))),
    h("section", { className: "cpwb-knowledge-panel cpwb-knowledge-upload-zone" },
      h("label", { className: "cpwb-knowledge-drop" },
        h("input", { type: "file", multiple: true, accept: ACCEPT, onChange: (event) => { setFiles(Array.from(event.target.files || [])); event.target.value = ""; } }),
        h("span", null, h(Plus, { size: 27 })),
        h("strong", null, "将文件接入知识芯片"),
        h("p", null, "选择多个 TXT、MD、HTML、DOCX、PPTX、XLSX 或代码文件；也可以先创建空知识库。")),
      h("div", { className: "cpwb-knowledge-selected-files" }, files.map((file, index) => h("div", { key: file.name + index },
        h("b", null, fileType({ originalName: file.name })),
        h("span", null, h("strong", null, file.name), h("small", null, `${formatBytes(file.size)} / 等待上传`)),
        h("button", { type: "button", onClick: () => removeFile(index), "aria-label": `移除 ${file.name}` }, h(X, { size: 14 }))))),
      error ? h("p", { className: "cpwb-knowledge-local-error" }, error) : null,
      h("button", { type: "submit", className: "cpwb-kb-action cpwb-kb-action-primary cpwb-knowledge-create-submit", disabled: saving || !name.trim() }, saving ? "创建中…" : "创建知识库")));
}

export function documentProgress(document) {
  return document?.status === "ready" ? 100 : 0;
}

function KnowledgeDetail({ knowledgeBase, documents, action, settings, onFileInput, onLink, onDelete, onChat, onReindex, onUnlink }) {
  const overview = overviewOf(knowledgeBase);
  const linkedIds = new Set((knowledgeBase.linkedProjects || []).map((project) => project.id));
  return h("div", { className: "cpwb-knowledge-detail" },
    h("div", { className: "cpwb-knowledge-summary-strip" },
      h("div", null, h("span", null, "索引完成度"), h("b", { className: "cpwb-cyan" }, `${overview.indexPercent}%`)),
      h("div", null, h("span", null, "原始文件"), h("b", null, overview.fileCount)),
      h("div", null, h("span", null, "向量分块"), h("b", null, overview.chunkCount.toLocaleString("en-US"))),
      h("div", null, h("span", null, "关联项目"), h("b", null, twoDigits(overview.linkedProjectCount)))),
    h("div", { className: "cpwb-knowledge-detail-grid" },
      h("section", { className: "cpwb-knowledge-panel cpwb-knowledge-files-panel" },
        h("header", null, h("h2", null, "文件与向量索引"), h("span", null, `${overview.fileCount} FILES / ${knowledgeStateLabel(overview)}`)),
        h("label", { className: "cpwb-knowledge-compact-upload" }, h("input", { type: "file", multiple: true, accept: ACCEPT, onChange: onFileInput }), h(UploadSimple, { size: 15 }), "选择文件并上传"),
        documents.length ? h("div", { className: "cpwb-knowledge-file-list" }, documents.map((document) => {
          const meta = statusMeta(document.status);
          const progress = documentProgress(document);
          return h("article", { key: document.id, className: "cpwb-knowledge-file-row" },
            h("i", null, fileType(document)),
            h("span", null, h("strong", null, document.originalName), h("small", null, `${formatBytes(document.size)}${document.indexedAt ? " / 已建立索引" : " / 等待索引"}`)),
            h("span", { className: "cpwb-knowledge-file-progress" }, h("span", null, h("i", { style: { width: `${progress}%` } })), h("small", null, progress ? `${progress}%` : meta.label)),
            h("em", { className: "cpwb-status-" + meta.kind }, meta.label),
            h("span", { className: "cpwb-knowledge-file-actions" },
              h("a", { href: cpwbApi.documents.contentUrl(document.id), target: "_blank", rel: "noreferrer", title: "打开原始文件", "aria-label": `打开原始文件 ${document.originalName}` }, h(ArrowSquareOut, { size: 15 })),
              h("a", { href: cpwbApi.documents.contentUrl(document.id, { download: true }), download: document.originalName, title: "下载原始文件", "aria-label": `下载原始文件 ${document.originalName}` }, h(DownloadSimple, { size: 15 })),
              document.status === "failed" || document.status === "stale" ? h("button", { type: "button", onClick: () => onReindex(document), title: "重新索引" }, "RETRY") : null,
              h("button", { type: "button", onClick: () => onUnlink(document), title: "从知识库移除", "aria-label": `从知识库移除 ${document.originalName}` }, h(X, { size: 14 }))));
        })) : h("div", { className: "cpwb-knowledge-detail-empty" }, "该知识库暂无文件"),
        action?.type === "upload" ? h("div", { className: "cpwb-knowledge-upload-progress" }, h("span", null, `上传进度 ${action.done || 0} / ${action.total || 0}`), h("i", null, h("b", { style: { width: `${action.total ? Math.round(((action.done || 0) / action.total) * 100) : 0}%` } }))) : null),
      h("aside", { className: "cpwb-knowledge-panel cpwb-knowledge-links-panel" },
        h("header", null, h("h2", null, "背板连接"), h("span", null, `${twoDigits(linkedIds.size)} PROJECTS`)),
        h("div", { className: "cpwb-knowledge-link-map" }, (knowledgeBase.linkedProjects || []).length
          ? knowledgeBase.linkedProjects.map((project, index) => h("div", { key: project.id }, h("i", null, `P${index + 1}`), h("span", null, h("strong", null, project.name), h("small", null, `项目上下文已启用 / ${project.sessionCount || 0} 个会话`))))
          : h("p", null, "尚未关联项目")),
        h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-core-action", onClick: onLink }, h(LinkSimple, { size: 15 }), "管理项目连接"),
        h("section", { className: "cpwb-knowledge-runtime-detail" },
          h("div", { className: "cpwb-knowledge-core-label" }, h("span", null, "向量运行时"), h("b", null, "ONLINE")),
          h("p", null, h("span", null, "Provider"), h("strong", null, settings?.embedding?.provider || "unknown")),
          h("p", null, h("span", null, "Model"), h("strong", null, settings?.embedding?.model || "未配置")),
          h("p", null, h("span", null, "Dimensions"), h("strong", null, settings?.embedding?.dimensions || "?"))),
        h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary cpwb-kb-core-action", onClick: onChat }, "新建知识库会话"),
        h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-danger cpwb-kb-core-action", onClick: onDelete }, h(Trash, { size: 15 }), "删除知识库"))));
}

export function ProjectLinkDialog({ knowledgeBase, projects, busyProjectId = null, error = null, onToggle, onClose }) {
  if (!knowledgeBase) return null;
  const linked = new Set((knowledgeBase.linkedProjects || []).map((project) => project.id));
  return h(GlobalModal, { className: "cpwb-knowledge-link-host", onClose, labelledBy: "cpwb-kb-link-title" },
    h("section", { className: "cpwb-modal cpwb-knowledge-link-dialog" },
      h("div", { className: "cpwb-modal-kicker" }, "BACKPLANE / PROJECT LINKS"),
      h("h3", { id: "cpwb-kb-link-title" }, `管理「${knowledgeBase.name}」的项目连接`),
      h("div", { className: "cpwb-knowledge-project-options" }, projects.length
        ? projects.map((project) => {
            const pending = busyProjectId === project.id;
            return h("button", { type: "button", key: project.id, disabled: busyProjectId != null, "aria-busy": pending ? "true" : undefined, "aria-pressed": linked.has(project.id), onClick: () => onToggle(project, linked.has(project.id)) },
              h("i", null, pending ? ".." : linked.has(project.id) ? "ON" : "--"),
              h("span", null, h("strong", null, project.name), h("small", null, pending ? "正在同步项目上下文" : linked.has(project.id) ? "已接入知识上下文" : "尚未连接")),
              h("em", null, pending ? "SYNCING" : linked.has(project.id) ? "UNLINK" : "LINK"));
          })
        : h("p", null, "暂无可连接项目")),
      error ? h("p", { className: "cpwb-knowledge-local-error", role: "alert" }, error) : null,
      h("div", { className: "cpwb-modal-actions" }, h("button", { type: "button", className: "cpwb-kb-action", onClick: onClose }, "完成"))));
}

export function KnowledgeCenterPage({
  store,
  onDraftOpen,
  initialMode = "board",
  initialKnowledgeBaseId = null,
}) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const knowledgeBases = Array.isArray(state.knowledgeBases) ? state.knowledgeBases : [];
  const projects = Array.isArray(state.projects) ? state.projects : [];
  const documents = Array.isArray(state.documents) ? state.documents : [];
  const initialId = initialKnowledgeBaseId ?? state.activeKnowledgeBaseId ?? knowledgeBases[0]?.id ?? null;
  const [mode, setMode] = React.useState(initialMode);
  const [pinnedId, setPinnedId] = React.useState(initialId);
  const [previewId, setPreviewId] = React.useState(null);
  const [createName, setCreateName] = React.useState("");
  const [createDescription, setCreateDescription] = React.useState("");
  const [createFiles, setCreateFiles] = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const [localError, setLocalError] = React.useState(null);
  const [linkingProjectId, setLinkingProjectId] = React.useState(null);
  const [linkError, setLinkError] = React.useState(null);
  const [showLinks, setShowLinks] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const selected = knowledgeBases.find((item) => item.id === pinnedId) || null;
  const timezone = state.settings?.timezone || "Asia/Shanghai";

  React.useEffect(function () {
    if (knowledgeBases.length === 0) {
      setPinnedId(null);
      setPreviewId(null);
      return;
    }
    if (!knowledgeBases.some((item) => item.id === pinnedId)) setPinnedId(knowledgeBases[0].id);
  }, [knowledgeBases, pinnedId]);

  React.useEffect(function () {
    if (mode !== "detail" || pinnedId == null) return;
    store.actions.selectKnowledgeBase(pinnedId).catch(() => {});
  }, [mode, pinnedId, store]);

  React.useEffect(function () {
    if (mode !== "detail" || !needsDocumentPolling(documents, pinnedId)) return;
    const timer = setTimeout(() => store.actions.refreshDocuments().catch(() => {}), 1500);
    return () => clearTimeout(timer);
  }, [documents, mode, pinnedId, store]);

  const openSettings = function () {
    if (typeof document === "undefined") return;
    document.querySelector('[data-slot="sidebar.settings"] > button')?.click?.();
  };

  const pin = function (id) {
    setPinnedId(id);
    setPreviewId(null);
    store.actions.selectKnowledgeBase(id).catch(() => {});
  };

  const openDetail = function (id = pinnedId) {
    if (id == null) return;
    setPinnedId(id);
    setPreviewId(null);
    store.actions.selectKnowledgeBase(id).catch(() => {});
    setMode("detail");
  };

  const openProjectLinks = function (id = pinnedId) {
    if (id == null) return;
    setPinnedId(id);
    setPreviewId(null);
    store.actions.selectKnowledgeBase(id).catch(() => {});
    setLinkError(null);
    setShowLinks(true);
  };

  const openChat = function () {
    const id = activeKnowledgeBaseId({ previewId, pinnedId });
    if (id == null || saving) return;
    setLocalError(null);
    try {
      startKnowledgeChatDraft({ store, knowledgeBaseId: id, onDraftOpen });
    } catch (error) {
      setLocalError(error?.message || "打开知识库会话失败");
    }
  };

  const createKnowledgeBase = async function (event) {
    event.preventDefault();
    const name = createName.trim();
    if (!name || saving) return;
    setSaving(true);
    setLocalError(null);
    try {
      const created = await store.actions.createKnowledgeBase({ name, description: createDescription.trim() || undefined });
      setPinnedId(created.id);
      await store.actions.selectKnowledgeBase(created.id);
      setMode("detail");
      if (createFiles.length) await store.actions.uploadFiles({ files: createFiles, scope: "knowledgeBase", scopeId: created.id });
      await store.actions.refresh();
      await store.actions.selectKnowledgeBase(created.id);
      setCreateFiles([]);
    } catch (error) {
      setLocalError(error?.message || "创建知识库失败");
    } finally {
      setSaving(false);
    }
  };

  const uploadFiles = function (event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length || pinnedId == null) return;
    store.actions.uploadFiles({ files, scope: "knowledgeBase", scopeId: pinnedId }).then(() => store.actions.refresh()).then(() => store.actions.selectKnowledgeBase(pinnedId)).catch(() => {});
  };

  const toggleProject = async function (project, isLinked) {
    if (!selected || linkingProjectId != null) return;
    setLinkingProjectId(project.id);
    setLinkError(null);
    try {
      if (isLinked) await store.actions.unlinkProjectKnowledgeBase(project.id, selected.id);
      else await store.actions.linkProjectKnowledgeBase(project.id, selected.id);
    } catch (error) {
      setLinkError(error?.message || "项目连接更新失败");
    } finally {
      setLinkingProjectId(null);
    }
  };

  const deleteKnowledgeBase = async function () {
    if (!deleteTarget || saving) return;
    setSaving(true);
    try {
      await store.actions.deleteKnowledgeBase(deleteTarget.id);
      setDeleteTarget(null);
      setMode("board");
      setPinnedId(null);
    } finally {
      setSaving(false);
    }
  };

  return h("main", { className: `cpwb-knowledge-center cpwb-workbench-page cpwb-knowledge-mode-${mode}`, "data-page": "knowledge" },
    h(KnowledgeHeader, {
      mode,
      knowledgeBase: selected,
      onBack: () => setMode("board"),
      onCreate: () => { setMode("create"); setLocalError(null); },
      onSettings: openSettings,
      onUpload: () => document.querySelector("#cpwb-kb-detail-upload")?.click?.(),
      onChat: openChat,
    }),
    localError ? h("div", { className: "cpwb-knowledge-local-error cpwb-knowledge-page-error" }, localError) : null,
    mode === "board" ? h(KnowledgeBoard, {
      knowledgeBases,
      pinnedId,
      previewId,
      onPin: pin,
      onPreview: setPreviewId,
      onPreviewEnd: (id) => setPreviewId((current) => nextKnowledgePreviewAfterLeave(current, id)),
      onCreate: () => setMode("create"),
      onChat: openChat,
      onDetail: openDetail,
      onLink: openProjectLinks,
      timezone,
    }) : null,
    mode === "create" ? h(KnowledgeCreate, {
      settings: state.settings,
      files: createFiles,
      setFiles: setCreateFiles,
      name: createName,
      setName: setCreateName,
      description: createDescription,
      setDescription: setCreateDescription,
      saving,
      error: localError,
      onSubmit: createKnowledgeBase,
      onSettings: openSettings,
    }) : null,
    mode === "detail" && selected ? h(React.Fragment, null,
      h("input", { id: "cpwb-kb-detail-upload", type: "file", multiple: true, accept: ACCEPT, hidden: true, onChange: uploadFiles }),
      h(KnowledgeDetail, {
        knowledgeBase: selected,
        documents,
        action: state.action,
        settings: state.settings,
        onFileInput: uploadFiles,
        onLink: openProjectLinks,
        onDelete: () => setDeleteTarget(selected),
        onChat: openChat,
        onReindex: (document) => store.actions.reindexDocument(document.id).catch(() => {}),
        onUnlink: (document) => store.actions.unlinkDocument({ id: document.id, scope: "knowledgeBase", scopeId: selected.id }).then(() => store.actions.refresh()).then(() => store.actions.selectKnowledgeBase(selected.id)).catch(() => {}),
      })) : null,
    showLinks ? h(ProjectLinkDialog, { knowledgeBase: selected, projects, busyProjectId: linkingProjectId, error: linkError, onToggle: toggleProject, onClose: () => setShowLinks(false) }) : null,
    deleteTarget ? h("div", { className: "cpwb-modal-backdrop", onMouseDown: (event) => { if (event.target === event.currentTarget) setDeleteTarget(null); } },
      h("section", { className: "cpwb-modal cpwb-danger-modal", role: "dialog", "aria-modal": true, "aria-labelledby": "cpwb-delete-kb-center-title" },
        h("div", { className: "cpwb-modal-kicker" }, "KNOWLEDGE / DELETE"),
        h("h3", { id: "cpwb-delete-kb-center-title" }, `删除「${deleteTarget.name}」？`),
        h("p", null, "知识库、会话和仅属于它的文档与向量将永久删除；共享文档会保留。"),
        h("div", { className: "cpwb-modal-actions" },
          h("button", { type: "button", className: "cpwb-kb-action", onClick: () => setDeleteTarget(null) }, "取消"),
          h("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-danger", disabled: saving, onClick: deleteKnowledgeBase }, h(Trash, { size: 14 }), saving ? "删除中…" : "永久删除")))) : null);
}
