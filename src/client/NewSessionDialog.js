import React from "react";
import { ArrowRight, Books, CaretDown, FolderOpen, Image, PaperPlaneTilt, Sparkle, UserCircle, X } from "@phosphor-icons/react";

import { GlobalModal } from "./globalModal.js";
import { loadPendingModelCatalog, submitPendingDraft } from "./pendingSession.js";

const OWNER_TYPES = [
  ["project", "项目", FolderOpen],
  ["knowledge_base", "知识库", Books],
  ["independent", "独立会话", UserCircle],
];

function normalizedInitialScope(scope) {
  if (scope?.kind === "project" || scope?.kind === "knowledge_base") return { kind: scope.kind, id: scope.id };
  return { kind: "independent", id: null };
}

function sourcePreview(scope, state) {
  if (scope.kind === "project") {
    const project = state.projects?.find((item) => item.id === scope.id);
    return [project?.path ? "Workspace 文件" : "项目 Workspace", "项目关联的全部知识库"];
  }
  if (scope.kind === "knowledge_base") {
    const kb = state.knowledgeBases?.find((item) => item.id === scope.id);
    return ["知识库文档 · " + (kb?.name || "当前知识库")];
  }
  return ["默认不继承上下文；首次发送后可使用 @ 添加"];
}

export function NewSessionDialog({ open, store, initialScope, onClose, onStart }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const normalized = normalizedInitialScope(initialScope);
  const [kind, setKind] = React.useState(normalized.kind);
  const [ownerId, setOwnerId] = React.useState(normalized.id == null ? "" : String(normalized.id));

  React.useEffect(function () {
    if (!open) return;
    const next = normalizedInitialScope(initialScope);
    setKind(next.kind);
    setOwnerId(next.id == null ? "" : String(next.id));
  }, [open, initialScope?.kind, initialScope?.id]);

  if (!open) return null;
  const owners = kind === "project" ? state.projects || [] : kind === "knowledge_base" ? state.knowledgeBases || [] : [];
  const selectedId = kind === "independent" ? null : Number(ownerId || owners[0]?.id);
  const scope = { kind, id: kind === "independent" ? null : selectedId };
  const valid = kind === "independent" || Number.isSafeInteger(selectedId) && selectedId > 0;
  const start = function (event) {
    event.preventDefault();
    if (!valid) return;
    onStart?.({ scope, pinnedSources: [] });
  };

  return React.createElement(GlobalModal, { onClose, labelledBy: "cpwb-new-session-title", className: "cpwb-new-session-host" },
    React.createElement("form", { className: "cpwb-new-session-dialog", onSubmit: start },
      React.createElement("header", null,
        React.createElement("span", null, "SESSION / INITIALIZE"),
        React.createElement("h2", { id: "cpwb-new-session-title" }, "新建会话"),
        React.createElement("p", null, "选择唯一归属。第一条有效消息发送前不会创建 DSH Session。")),
      React.createElement("fieldset", { className: "cpwb-owner-options" },
        React.createElement("legend", null, "会话归属"),
        OWNER_TYPES.map(([value, label, Icon]) => React.createElement("label", {
          key: value,
          className: kind === value ? "cpwb-active" : "",
        },
        React.createElement("input", {
          type: "radio",
          name: "session-owner",
          value,
          checked: kind === value,
          onChange: function () {
            setKind(value);
            const list = value === "project" ? state.projects : value === "knowledge_base" ? state.knowledgeBases : [];
            setOwnerId(value === "independent" ? "" : String(list?.[0]?.id ?? ""));
          },
        }),
        React.createElement(Icon, { size: 20, weight: "duotone", "aria-hidden": true }),
        React.createElement("span", null, label)))),
      kind !== "independent" ? React.createElement("label", { className: "cpwb-owner-select" },
        React.createElement("span", null, kind === "project" ? "选择项目" : "选择知识库"),
        React.createElement("select", {
          value: ownerId || String(owners[0]?.id ?? ""),
          onChange: (event) => setOwnerId(event.target.value),
        }, owners.map((item) => React.createElement("option", { key: item.id, value: item.id }, item.name)))) : null,
      React.createElement("section", { className: "cpwb-context-preview", "aria-label": "默认上下文" },
        React.createElement("div", null, React.createElement(Sparkle, { size: 18, "aria-hidden": true }), React.createElement("strong", null, "默认上下文")),
        React.createElement("ul", null, sourcePreview(scope, state).map((text) => React.createElement("li", { key: text }, text)))),
      React.createElement("footer", null,
        React.createElement("button", { type: "button", className: "cpwb-button-ghost", onClick: onClose }, "取消"),
        React.createElement("button", { type: "submit", className: "cpwb-button-primary", disabled: !valid },
          "进入新会话", React.createElement(ArrowRight, { size: 17, "aria-hidden": true })))));
}

function modelOption(groups, selection) {
  for (const group of groups) {
    const model = group.models?.find((item) => item.id === selection?.model);
    if (model && group.id === selection?.provider) return { group, model };
  }
  return null;
}

function pendingScopeName(draft, state) {
  if (draft.scope.kind === "project") return state.projects?.find((item) => item.id === draft.scope.id)?.name || "项目工作台";
  if (draft.scope.kind === "knowledge_base") return state.knowledgeBases?.find((item) => item.id === draft.scope.id)?.name || "知识库";
  return "独立会话";
}

export function DraftConversation({ store, sessions, workspaces, connection, conversation, onActivated, onCancel }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const draft = state.draft;
  const [text, setText] = React.useState(draft?.text || "");
  const [catalog, setCatalog] = React.useState({ groups: [], failures: [] });
  const [selection, setSelection] = React.useState(null);
  const [modelOpen, setModelOpen] = React.useState(false);
  const [attachments, setAttachments] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [localError, setLocalError] = React.useState(null);
  const fileInput = React.useRef(null);

  React.useEffect(function () { setText(draft?.text || ""); }, [draft?.sessionId, draft?.status]);
  React.useEffect(function () {
    let active = true;
    loadPendingModelCatalog(connection).then((value) => { if (active) setCatalog(value); }).catch((error) => { if (active) setLocalError(error.message); });
    return function () { active = false; };
  }, [connection]);
  if (!draft) return null;
  const busy = submitting || draft.status === "materializing";
  const chosen = modelOption(catalog.groups || [], selection);
  const modelLabel = chosen
    ? chosen.model.name + (selection.reasoningEffort ? " · " + (chosen.model.reasoning?.efforts?.find((item) => item.id === selection.reasoningEffort)?.name || selection.reasoningEffort) : "")
    : "DSH 默认 · 自动";
  const submit = async function (event) {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setSubmitting(true);
    setLocalError(null);
    try {
      const result = await submitPendingDraft({
        store,
        sessions,
        workspaces,
        connection,
        conversation,
        text,
        imageIds: attachments.map((item) => item.id),
        modelSelection: selection,
      });
      await onActivated?.(result);
    } catch (error) {
      setLocalError(error.message || "首条消息发送失败");
    } finally {
      setSubmitting(false);
    }
  };
  const scopeLabel = draft.scope.kind === "project" ? "项目会话" : draft.scope.kind === "knowledge_base" ? "知识库会话" : "独立会话";
  const scopeName = pendingScopeName(draft, state);
  const chooseFiles = function (event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    try {
      const created = conversation?.createDraftImages?.(files) || [];
      setAttachments((current) => [...current, ...created]);
      setLocalError(null);
    } catch (error) {
      setLocalError(error.message || "图片读取失败");
    }
  };
  const removeAttachment = function (id) {
    conversation?.releaseDraftImage?.(id);
    setAttachments((current) => current.filter((item) => item.id !== id));
  };
  const cancel = function () {
    for (const attachment of attachments) conversation?.releaseDraftImage?.(attachment.id);
    onCancel?.();
  };

  return React.createElement("main", { className: "cpwb-draft-conversation cpwb-pending-session", "data-status": draft.status },
    React.createElement("header", null,
      React.createElement("div", { className: "cpwb-pending-identity" },
        React.createElement("span", null, scopeLabel),
        React.createElement("strong", null, "新会话"),
        React.createElement("small", null, "Session ID 将在首次发送时生成")),
      React.createElement("button", { type: "button", onClick: cancel }, "退出草稿")),
    React.createElement("section", { className: "cpwb-pending-main" },
      React.createElement("section", { className: "cpwb-draft-empty" },
        React.createElement(Sparkle, { size: 26, weight: "duotone", "aria-hidden": true }),
        React.createElement("h2", null, draft.status === "admitted" ? "消息已发送，正在确认会话" : "从第一条消息开始"),
        React.createElement("p", null, "发送前不创建 Session。发送后原地进入完整 DSH 会话，模型响应会立即开始流式显示。")),
      React.createElement("form", { className: "cpwb-draft-composer", onSubmit: submit },
        attachments.length ? React.createElement("div", { className: "cpwb-pending-attachments", "aria-label": "待发送图片" }, attachments.map((attachment) => React.createElement("figure", { key: attachment.id },
          React.createElement("img", { src: attachment.previewUrl, alt: attachment.file?.name || "待发送图片" }),
          React.createElement("button", { type: "button", onClick: () => removeAttachment(attachment.id), "aria-label": "移除 " + (attachment.file?.name || "图片") }, React.createElement(X, { size: 13, "aria-hidden": true }))))) : null,
        React.createElement("textarea", {
          value: text,
          disabled: busy,
          onChange: (event) => setText(event.target.value),
          placeholder: "描述你想要构建的内容…",
          "aria-label": "首条消息",
        }),
        React.createElement("div", { className: "cpwb-pending-composer-tools" },
          React.createElement("input", { ref: fileInput, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: chooseFiles }),
          React.createElement("button", { type: "button", className: "cpwb-pending-tool", onClick: () => fileInput.current?.click(), "aria-label": "添加图片", title: "添加图片" }, React.createElement(Image, { size: 20, "aria-hidden": true })),
          React.createElement("div", { className: "cpwb-pending-model" },
            React.createElement("button", { type: "button", className: "cpwb-pending-model-trigger", onClick: () => setModelOpen((value) => !value), "aria-expanded": modelOpen, "aria-label": "选择模型与推理强度" },
              React.createElement("span", null, modelLabel), React.createElement(CaretDown, { size: 15, "aria-hidden": true })),
            modelOpen ? React.createElement("div", { className: "cpwb-pending-model-menu", role: "dialog", "aria-label": "模型与推理强度" },
              React.createElement("div", { className: "cpwb-pending-model-menu-head" }, React.createElement("span", null, "MODEL ROUTING"), React.createElement("button", { type: "button", onClick: () => { setSelection(null); setModelOpen(false); } }, "使用默认")),
              (catalog.groups || []).map((group) => React.createElement("section", { key: group.id },
                React.createElement("h3", null, group.name),
                group.models?.map((model) => React.createElement("button", {
                  type: "button",
                  key: model.id,
                  className: selection?.provider === group.id && selection?.model === model.id ? "cpwb-active" : "",
                  onClick: () => setSelection({ provider: group.id, model: model.id, reasoningEffort: model.reasoning?.defaultEffort }),
                }, React.createElement("strong", null, model.name), model.description ? React.createElement("small", null, model.description) : null)))),
              chosen?.model?.reasoning?.efforts?.length ? React.createElement("div", { className: "cpwb-pending-reasoning" },
                React.createElement("span", null, "REASONING EFFORT"),
                React.createElement("div", null, chosen.model.reasoning.efforts.map((effort) => React.createElement("button", {
                  type: "button", key: effort.id, className: selection?.reasoningEffort === effort.id ? "cpwb-active" : "",
                  onClick: () => setSelection({ ...selection, reasoningEffort: effort.id }),
                }, effort.name)))) : null) : null),
          React.createElement("button", { className: "cpwb-pending-send", type: "submit", disabled: busy || !text.trim() },
            React.createElement(PaperPlaneTilt, { size: 18, weight: "fill", "aria-hidden": true }),
            busy ? "正在连接" : draft.status === "admitted" ? "完成连接" : "发送")),
        draft.error || localError ? React.createElement("p", { className: "cpwb-draft-error", role: "alert" }, localError || draft.error?.message) : null)),
    React.createElement("aside", { className: "cpwb-pending-context", "aria-label": "新会话上下文" },
      React.createElement("span", null, draft.scope.kind === "project" ? "PROJECT SYSTEM" : draft.scope.kind === "knowledge_base" ? "KNOWLEDGE SYSTEM" : "SESSION SYSTEM"),
      React.createElement("h2", null, scopeName),
      React.createElement("small", null, "首条消息发送后激活完整工具栏"),
      React.createElement("div", null,
        sourcePreview(draft.scope, state).map((label) => React.createElement("article", { key: label }, React.createElement(Sparkle, { size: 14, "aria-hidden": true }), React.createElement("span", null, label))))));
}
