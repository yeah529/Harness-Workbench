/**
 * Knowledge-base management panel for the workbench project rail.
 *
 * Selects/creates a knowledge base, shows its link state with the current
 * project (link/unlink), uploads multiple files via picker + drag/drop with
 * the exact Office/text/code accept list the host allows, tracks per-file
 * status (uploading/queued/parsing/embedding/ready/failed/stale) plus n/total
 * progress, reindexes failed/stale documents, unlinks documents from the
 * current scope, and runs pure retrieval returning real citations. It does not
 * keeps retrieval separate from generation and never fakes upload success: the
 * host remains the authority on format and the 50 MB limit.
 *
 * While the selected knowledge base still has in-flight documents, a single
 * 1500ms setTimeout re-fetches document statuses (cleanup clears the timer);
 * polling is driven by the pure needsDocumentPolling helper and never installs
 * a recurring interval timer.
 */

import React from "react";
import { Trash } from "@phosphor-icons/react";
import { glyph, ICONS, Badge, Empty } from "./icons.js";
import { openWorkbenchSession } from "./workbenchSessions.js";
import { ContainerDeleteDialog } from "./ContainerDeleteDialog.js";

/** Mirrors files.js ALLOWED_EXTENSIONS — the host remains the real authority. */
const ACCEPT_EXTENSIONS = [
  "txt", "md", "markdown", "html", "htm", "docx", "pptx", "xlsx",
  "js", "ts", "jsx", "tsx", "json", "yaml", "yml", "py", "java",
  "go", "rs", "c", "cpp", "h", "hpp", "css", "sql", "sh",
];
export const ACCEPT = ACCEPT_EXTENSIONS.map(function (e) { return "." + e; }).join(",");

export const DOC_STATUS = {
  uploading: { label: "上传中", kind: "pending" },
  queued: { label: "排队中", kind: "pending" },
  parsing: { label: "解析中", kind: "pending" },
  embedding: { label: "向量化中", kind: "pending" },
  ready: { label: "可检索", kind: "done" },
  failed: { label: "失败", kind: "overdue" },
  stale: { label: "索引过期", kind: "overdue" },
};

export function statusMeta(status) {
  return DOC_STATUS[status] || { label: status || "未知", kind: "pending" };
}

/**
 * Pure decision helper for the document-status poll loop. Polling is required
 * only when a knowledge base is selected AND at least one of its documents is
 * still in an in-flight server state (uploading / parsing / embedding).
 *
 * `queued` is a client-side display state only and is NEVER a database status
 * the host stores, so it must not trigger polling. ready / failed / stale are
 * terminal states and also must not trigger polling.
 */
export function needsDocumentPolling(documents, selectedId) {
  if (selectedId == null || selectedId === "") return false;
  const list = Array.isArray(documents) ? documents : [];
  return list.some(function (d) {
    return d && (d.status === "uploading" || d.status === "parsing" || d.status === "embedding");
  });
}

export function formatBytes(n) {
  if (n == null) return "";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / (1024 * 1024)).toFixed(1) + " MB";
}

export function uploadStatusLabel(batchIndex, action) {
  if (!action || action.type !== "upload") return "排队中";
  if (action.status === "error") return batchIndex < action.done ? "已提交" : "失败";
  if (batchIndex < action.done) return "已提交";
  if (batchIndex === action.done) return "上传中";
  return "排队中";
}

export function renderDocumentItem(d, onReindex, onUnlink, reindexing, unlinkingDoc) {
  const meta = statusMeta(d.status);
  const canReindex = d.status === "failed" || d.status === "stale";
  return React.createElement("div", { key: d.id, className: "cpwb-item" },
    React.createElement("div", { className: "cpwb-item-main" },
      React.createElement("div", { className: "cpwb-item-title" },
        glyph(ICONS.doc), " " + d.originalName,
        React.createElement(Badge, { kind: meta.kind }, meta.label)),
      React.createElement("div", { className: "cpwb-item-meta" },
        formatBytes(d.size) + (d.error ? " · " + d.error : ""))),
    canReindex
      ? React.createElement("button", { type: "button", className: "cpwb-btn", disabled: !!reindexing, onClick: function () { onReindex(d); }, title: "重新索引" }, glyph(ICONS.refresh), " 重新索引")
      : null,
    React.createElement("button", { type: "button", className: "cpwb-x", disabled: !!unlinkingDoc, onClick: function () { onUnlink(d); }, title: "从本知识库解除关联" }, glyph(ICONS.x)));
}

export function renderCitation(c, i) {
  return React.createElement("div", { key: c.sourceId || (c.originalName + ":" + i), className: "cpwb-citation" },
    React.createElement("div", { className: "cpwb-citation-head" },
      React.createElement("span", { className: "cpwb-citation-file" }, c.originalName),
      React.createElement("span", { className: "cpwb-citation-locator" }, c.locator || "")),
    c.heading ? React.createElement("div", { className: "cpwb-citation-heading" }, c.heading) : null,
    React.createElement("div", { className: "cpwb-citation-text" }, c.text));
}

export function KnowledgeBase({ store, projectId, knowledgeBaseId, sessions, workspaces, onConversationOpen, onDraftOpen, view = "all" }) {
  const standalone = knowledgeBaseId != null;
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const newKbState = React.useState("");
  const queryState = React.useState("");
  const dragState = React.useState(false);
  const pendingState = React.useState([]);
  const newKb = newKbState[0];
  const setNewKb = newKbState[1];
  const query = queryState[0];
  const setQuery = queryState[1];
  const dragActive = dragState[0];
  const setDragActive = dragState[1];
  const pending = pendingState[0];
  const setPending = pendingState[1];
  const chatErrorState = React.useState(null);
  const chatError = chatErrorState[0];
  const setChatError = chatErrorState[1];
  const openingChatState = React.useState(false);
  const openingChat = openingChatState[0];
  const setOpeningChat = openingChatState[1];
  const scopeReadyState = React.useState(!standalone);
  const scopeReady = scopeReadyState[0];
  const setScopeReady = scopeReadyState[1];
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const mountedRef = React.useRef(true);

  React.useEffect(function () {
    mountedRef.current = true;
    return function () { mountedRef.current = false; };
  }, []);

  const knowledgeBases = Array.isArray(state.knowledgeBases) ? state.knowledgeBases : [];
  const selectedId = standalone ? knowledgeBaseId : state.activeKnowledgeBaseId;
  const knowledgeSessions = selectedId == null ? [] : (state.sessionPage?.items || []).filter(function (session) {
    return session.scope?.kind === "knowledge_base" && session.scope.id === selectedId;
  });
  const linked = Array.isArray(state.linkedKnowledgeBases) ? state.linkedKnowledgeBases : [];
  const documents = !standalone || scopeReady ? (Array.isArray(state.documents) ? state.documents : []) : [];
  const citations = Array.isArray(state.citations) ? state.citations : [];
  const action = state.action;
  const showDirectory = !standalone && (view === "all" || view === "project" || view === "linked");
  const showDocuments = view === "all" || view === "project" || view === "documents";
  const showRetrieval = view === "all" || view === "retrieval";
  const showSessions = view === "all" || view === "session";

  // Per-action running flags: each mutation button disables only while its own
  // action is in flight, then recovers as soon as the action settles.
  const creatingKb = !!(action && action.type === "createKnowledgeBase" && action.status === "running");
  const uploading = !!(action && action.type === "upload" && action.status === "running");
  const searching = !!(action && action.type === "search" && action.status === "running");
  const linking = !!(action && action.type === "linkProjectKnowledgeBase" && action.status === "running");
  const unlinkingKb = !!(action && action.type === "unlinkProjectKnowledgeBase" && action.status === "running");
  const reindexing = !!(action && action.type === "reindexDocument" && action.status === "running");
  const unlinkingDoc = !!(action && action.type === "unlinkDocument" && action.status === "running");

  React.useEffect(function () {
    if (projectId == null) return;
    // A project rail is a new scope. Clear a previous project's selected KB
    // before loading links; otherwise the next project can briefly show and
    // mutate documents belonging to the project visited immediately before it.
    store.actions.loadAllDocuments().catch(function () {});
    store.actions.loadLinkedKnowledgeBases(projectId).catch(function () {});
  }, [projectId, store]);

  React.useEffect(function () {
    if (!standalone) { setScopeReady(true); return; }
    let current = true;
    setScopeReady(false);
    Promise.all([
      store.actions.selectKnowledgeBase(knowledgeBaseId),
      store.actions.loadAllSessions({ scopeKind: "knowledge_base", scopeId: knowledgeBaseId, limit: 100 }),
    ]).then(function () {
      if (current) setScopeReady(true);
    }).catch(function () {
      if (current) setScopeReady(true);
    });
    return function () { current = false; };
  }, [standalone, knowledgeBaseId, store]);

  // Document-status polling: when the selected knowledge base still has
  // in-flight documents, schedule a single 1500ms refresh; cleanup clears the
  // timer, and the next render re-decides from the fresh statuses. Never
  // installs a recurring interval timer.
  React.useEffect(function () {
    if (!needsDocumentPolling(documents, selectedId)) return;
    const timer = setTimeout(function () {
      store.actions.refreshDocuments().catch(function () {});
    }, 1500);
    return function () { clearTimeout(timer); };
  }, [documents, selectedId, store]);

  React.useEffect(function () {
    if (!standalone && selectedId != null) store.actions.loadAllSessions({ scopeKind: "knowledge_base", scopeId: selectedId, limit: 100 }).catch(function () {});
  }, [standalone, selectedId, store]);

  const linkedIds = new Set(linked.map(function (kb) { return kb.id; }));
  const selected = knowledgeBases.find(function (kb) { return kb.id === selectedId; }) || null;

  // Readable error surface: a failed mutation (action.status === "error") or a
  // failed load (state.error) must both be visible, never swallowed silently.
  const actionError = (action && action.status === "error" && action.error) || null;
  const kbError = actionError || state.error;

  const select = function (kb) {
    store.actions.selectKnowledgeBase(kb.id).catch(function () {});
  };

  const createKb = function () {
    const name = newKb.trim();
    if (!name) return;
    setNewKb("");
    store.actions.createKnowledgeBase({ name: name }).then(function (created) {
      if (created && created.id) store.actions.selectKnowledgeBase(created.id).catch(function () {});
    }).catch(function () {});
  };

  const refreshStatus = function () {
    store.actions.refreshDocuments().catch(function () {});
  };

  const retryError = function () {
    store.actions.refreshDocuments().catch(function () {});
    if (projectId != null) store.actions.loadLinkedKnowledgeBases(projectId).catch(function () {});
  };

  const handleFiles = function (fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0 || selectedId == null || uploading) return;
    const batch = files.map(function (f, i) { return { key: Date.now() + ":" + i, name: f.name, index: i }; });
    setPending(batch);
    // Clear the client-side queue once the upload promise settles; server
    // document statuses remain authoritative and are re-fetched by uploadFiles.
    store.actions.uploadFiles({ files: files, scope: "knowledgeBase", scopeId: selectedId }).then(
      function () { setPending([]); },
      function () { setPending([]); },
    );
  };

  const onDrop = function (e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer && e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const runSearch = function () {
    const q = query.trim();
    if (!q || selectedId == null) return;
    store.actions.search({ scope: "knowledgeBase", scopeId: selectedId, query: q, limit: 8 }).catch(function () {});
  };

  const openChat = function (sessionId) {
    if (selectedId == null || openingChat) return;
    if (sessionId == null) {
      store.actions.startDraft({ scope: { kind: "knowledge_base", id: selectedId } });
      onDraftOpen?.();
      return;
    }
    setOpeningChat(true);
    setChatError(null);
    store.actions.openSession(sessionId).then(function (result) {
      if (!mountedRef.current) return result;
      if (!sessions) return result;
      return openWorkbenchSession(sessions, result.sessionId, { workspaces }).then(function () {
        onConversationOpen?.(result.sessionId);
        return result;
      });
    }).then(function (result) {
      if (!mountedRef.current) return result;
      setOpeningChat(false);
      store.actions.loadAllSessions({ scopeKind: "knowledge_base", scopeId: selectedId, limit: 100 }).catch(function () {});
      return result;
    }).catch(function (err) {
      if (!mountedRef.current) return;
      setOpeningChat(false);
      setChatError(err && err.message ? err.message : "打开聊天失败");
    });
  };

  const reindex = function (d) { store.actions.reindexDocument(d.id).catch(function () {}); };
  const unlink = function (d) { store.actions.unlinkDocument({ id: d.id, scope: "knowledgeBase", scopeId: selectedId }).catch(function () {}); };

  const uploadAction = action && action.type === "upload" ? action : null;
  const uploadDone = uploadAction ? uploadAction.done || 0 : 0;
  const uploadTotal = uploadAction ? uploadAction.total || 0 : 0;

  return React.createElement("div", null,
    kbError
      ? React.createElement("div", { className: "cpwb-error" },
          React.createElement("div", { className: "cpwb-error-msg" },
            (kbError.code ? kbError.code + "：" : "") + (kbError.message || "加载失败")),
          React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: retryError, title: "刷新/重试" }, glyph(ICONS.refresh), " 刷新 / 重试"))
      : null,
    showDirectory ? React.createElement("div", { className: "cpwb-section" },
      React.createElement("div", { className: "cpwb-section-head" },
        React.createElement("div", { className: "cpwb-label" }, "知识库 · " + knowledgeBases.length)),
      React.createElement("div", { className: "cpwb-addrow" },
        React.createElement("input", { className: "cpwb-input", value: newKb, placeholder: "新建知识库…", onChange: function (e) { setNewKb(e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter") createKb(); } }),
        React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: createKb, title: "新建知识库", disabled: creatingKb }, glyph(ICONS.plus))),
      knowledgeBases.length === 0
        ? React.createElement(Empty, { glyph: glyph(ICONS.db, 18) }, "暂无知识库，先新建一个")
        : React.createElement("div", { className: "cpwb-kb-list" }, knowledgeBases.map(function (kb) {
          const isSel = kb.id === selectedId;
          const isLinked = linkedIds.has(kb.id);
          return React.createElement("div", { key: kb.id, className: "cpwb-kb-row" + (isSel ? " cpwb-kb-sel" : "") },
            React.createElement("button", { type: "button", className: "cpwb-kb-name", onClick: function () { select(kb); }, title: "选择知识库" },
              glyph(ICONS.db), " " + kb.name),
            projectId != null && isLinked
              ? React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", onClick: function () { store.actions.unlinkProjectKnowledgeBase(projectId, kb.id).catch(function () {}); }, title: "解除与本项目的关联", disabled: unlinkingKb }, "解除关联")
              : projectId != null
                ? React.createElement("button", { type: "button", className: "cpwb-btn", onClick: function () { store.actions.linkProjectKnowledgeBase(projectId, kb.id).catch(function () {}); }, title: "关联到本项目", disabled: linking }, "关联")
                : null,
            React.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", onClick: function () { setDeleteTarget(kb); }, title: "删除知识库", "aria-label": "删除知识库 " + kb.name }, React.createElement(Trash, { size: 14 })));
        }))) : null,
    showDocuments ? React.createElement("div", { className: "cpwb-section" },
      React.createElement("div", { className: "cpwb-section-head" },
        React.createElement("div", { className: "cpwb-label" }, "文档"),
        React.createElement("button", { type: "button", className: "cpwb-btn", onClick: refreshStatus, title: "刷新状态" }, glyph(ICONS.refresh), " 刷新状态")),
      selectedId != null
        ? React.createElement("label", {
            className: "cpwb-drop" + (dragActive ? " cpwb-drop-active" : ""),
            onDrop: onDrop,
            onDragOver: function (e) { e.preventDefault(); if (!uploading) setDragActive(true); },
            onDragLeave: function () { setDragActive(false); },
          },
          React.createElement("input", { type: "file", multiple: true, accept: ACCEPT, disabled: uploading, style: { display: "none" }, onChange: function (e) { handleFiles(e.target.files); e.target.value = ""; } }),
          glyph(ICONS.upload), " 选择文件或拖拽到「" + (selected ? selected.name : "知识库") + "」")
        : React.createElement(Empty, { glyph: glyph(ICONS.db, 18) }, "选择或新建知识库后上传文件"),
      pending.length > 0
        ? React.createElement("div", { className: "cpwb-upload-block" },
            React.createElement("div", { className: "cpwb-item-meta" }, "上传进度 " + uploadDone + "/" + uploadTotal),
            pending.map(function (p) {
              const label = uploadStatusLabel(p.index, uploadAction);
              return React.createElement("div", { key: p.key, className: "cpwb-upload-file" },
                React.createElement("span", { className: "cpwb-item-title" }, p.name),
                React.createElement(Badge, { kind: label === "失败" ? "overdue" : "pending" }, label));
            }))
        : null,
      selectedId == null
        ? null
        : documents.length === 0
          ? React.createElement(Empty, { glyph: glyph(ICONS.doc, 18) }, "该知识库暂无文档")
          : React.createElement("div", { className: "cpwb-list" }, documents.map(function (d) { return renderDocumentItem(d, reindex, unlink, reindexing, unlinkingDoc); }))) : null,
    selectedId != null && showRetrieval
      ? React.createElement("div", { className: "cpwb-section" },
          React.createElement("div", { className: "cpwb-section-head" }, React.createElement("div", { className: "cpwb-label" }, "知识库检索")),
          React.createElement("div", { className: "cpwb-addrow" },
            React.createElement("input", { className: "cpwb-input", value: query, placeholder: "检索该知识库…", onChange: function (e) { setQuery(e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter") runSearch(); } }),
            React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: runSearch, title: "检索", disabled: searching }, glyph(ICONS.search))),
          citations.length === 0
            ? React.createElement(Empty, { glyph: glyph(ICONS.search, 18) }, "输入关键词检索知识库内容")
            : React.createElement("div", { className: "cpwb-citations" }, citations.map(renderCitation)))
      : null,
    selectedId != null && showSessions
      ? React.createElement("div", { className: "cpwb-section" },
          React.createElement("div", { className: "cpwb-section-head" },
            React.createElement("div", { className: "cpwb-label" }, "知识库问答"),
            React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: function () { openChat(null); }, disabled: openingChat, title: "新建聊天" }, glyph(ICONS.plus), " 新建聊天")),
          chatError
            ? React.createElement("div", { className: "cpwb-error-msg" }, chatError)
            : null,
          knowledgeSessions.length === 0
            ? React.createElement(Empty, { glyph: glyph(ICONS.book, 18) }, "选择知识库后新建会话")
            : React.createElement("div", { className: "cpwb-kb-list" }, knowledgeSessions.map(function (session) {
              return React.createElement("div", { key: session.sessionId, className: "cpwb-kb-row" },
                React.createElement("button", { type: "button", className: "cpwb-kb-name", onClick: function () { openChat(session.sessionId); }, title: "打开会话" },
                  glyph(ICONS.book), " " + (session.title || "未命名会话")));
            })))
      : null,
    deleteTarget ? React.createElement(ContainerDeleteDialog, { kind: "knowledge_base", target: deleteTarget, store, onClose: () => setDeleteTarget(null) }) : null);
}
