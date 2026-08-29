import React from "react";
import { Paperclip } from "@phosphor-icons/react";

import { ACCEPT } from "./KnowledgeBase.js";
import { sessionFileReferenceText } from "../shared/sessionFileReferences.js";
import { isWorkbenchSessionId } from "./workbenchSessions.js";

function appendReferences(draft, rows) {
  const references = rows.map(sessionFileReferenceText).join(" ");
  if (!references) return String(draft || "");
  const prefix = String(draft || "");
  return prefix + (prefix && !/\s$/u.test(prefix) ? " " : "") + references + " ";
}

export function FileAttachmentButton({ sessionId, input, inputActions, store }) {
  const pickerRef = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const owned = isWorkbenchSessionId(sessionId);
  const locked = uploading || !owned || !inputActions || ["submitting", "adjudicating"].includes(input?.phase);
  const selected = async function (event) {
    const picker = event.currentTarget;
    const files = Array.from(picker.files || []);
    picker.value = "";
    if (!files.length || locked) return;
    setUploading(true);
    setError(null);
    try {
      const rows = await store.actions.uploadSessionFiles({ sessionId, files });
      inputActions.setDraft(appendReferences(input?.draft, rows));
    } catch (cause) {
      setError(cause?.message || "文件上传失败");
    } finally {
      setUploading(false);
    }
  };
  if (!owned) return null;
  return React.createElement(React.Fragment, null,
    React.createElement("button", {
      type: "button",
      className: "cpwb-file-attachment-button",
      disabled: locked,
      title: uploading ? "正在保存文件" : "添加会话文件（不向量化）",
      "aria-label": "添加文件",
      onClick: () => pickerRef.current?.click?.(),
    }, React.createElement(Paperclip, { size: 17, weight: "regular", "aria-hidden": true })),
    React.createElement("input", {
      ref: pickerRef,
      className: "cpwb-file-attachment-input",
      type: "file",
      accept: ACCEPT,
      multiple: true,
      tabIndex: -1,
      "aria-hidden": true,
      onChange: selected,
    }),
    error ? React.createElement("span", { className: "cpwb-file-attachment-error", role: "alert" }, error) : null);
}

export function registerFileAttachmentButton(ctx, store) {
  return ctx.slots.inject("conversation.input.left", function () {
    return ctx.slots.register({
      name: "conversation.input.left",
      id: "cpwb-file-attachment-button",
      order: 20,
      inject: () => ({ store }),
    }, FileAttachmentButton);
  });
}
