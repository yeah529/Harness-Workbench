import React from "react";
import { ArrowRight, Books, FolderOpen, PaperPlaneTilt, Sparkle, UserCircle } from "@phosphor-icons/react";

import { GlobalModal } from "./globalModal.js";

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
  return ["默认不继承上下文，可在会话中使用 @ 添加"];
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

export function DraftConversation({ store, onActivated, onCancel }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const draft = state.draft;
  const [text, setText] = React.useState(draft?.text || "");

  React.useEffect(function () { setText(draft?.text || ""); }, [draft?.sessionId, draft?.status]);
  if (!draft) return null;
  const busy = draft.status === "activating";
  const submit = function (event) {
    event.preventDefault();
    const action = draft.status === "draft_failed" ? store.actions.retryDraft : store.actions.activateDraft;
    action({ text }).then(onActivated).catch(function () {});
  };
  const scopeLabel = draft.scope.kind === "project" ? "项目会话" : draft.scope.kind === "knowledge_base" ? "知识库会话" : "独立会话";

  return React.createElement("main", { className: "cpwb-draft-conversation", "data-status": draft.status },
    React.createElement("header", null,
      React.createElement("span", null, scopeLabel),
      React.createElement("strong", null, "新会话"),
      React.createElement("button", { type: "button", onClick: onCancel }, "退出草稿")),
    React.createElement("section", { className: "cpwb-draft-empty" },
      React.createElement(Sparkle, { size: 26, weight: "duotone", "aria-hidden": true }),
      React.createElement("h2", null, draft.status === "draft_failed" ? "首次响应失败，可原地重试" : "从第一条消息开始"),
      React.createElement("p", null, "发送后才会创建原生 DSH Session，并继续使用完整的模型、推理、文件、工具与 Subagent 能力。")),
    React.createElement("form", { className: "cpwb-draft-composer", onSubmit: submit },
      React.createElement("textarea", {
        value: text,
        disabled: busy,
        onChange: (event) => setText(event.target.value),
        placeholder: "描述你想要构建的内容…",
        "aria-label": "首条消息",
      }),
      draft.error ? React.createElement("p", { className: "cpwb-draft-error", role: "alert" }, draft.error.message) : null,
      React.createElement("button", { type: "submit", disabled: busy || !text.trim() },
        React.createElement(PaperPlaneTilt, { size: 18, weight: "fill", "aria-hidden": true }),
        busy ? "正在连接" : draft.status === "draft_failed" ? "重试" : "发送")));
}
