import React from "react";
import { ImageSquare } from "@phosphor-icons/react";

export function dispatchImageFiles(target, files, {
  DataTransferCtor = globalThis.DataTransfer,
  ClipboardEventCtor = globalThis.ClipboardEvent,
  EventCtor = globalThis.Event,
} = {}) {
  if (!target || typeof target.dispatchEvent !== "function" || !files?.length || typeof DataTransferCtor !== "function") return false;
  const transfer = new DataTransferCtor();
  for (const file of files) transfer.items.add(file);
  let event;
  try {
    event = new ClipboardEventCtor("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: transfer,
    });
  } catch {
    if (typeof EventCtor !== "function") return false;
    event = new EventCtor("paste", { bubbles: true, cancelable: true });
  }
  if (!event.clipboardData) {
    try { Object.defineProperty(event, "clipboardData", { value: transfer }); } catch { return false; }
  }
  target.dispatchEvent(event);
  return true;
}

export function ImageAttachmentButton({ input }) {
  const pickerRef = React.useRef(null);
  const locked = !input || ["submitting", "adjudicating"].includes(input.phase);
  const choose = function () { pickerRef.current?.click?.(); };
  const selected = function (event) {
    const picker = event.currentTarget;
    const textarea = picker.closest?.("[data-composer-card]")?.querySelector?.("textarea");
    const files = Array.from(picker.files || []).filter((file) => file.type.startsWith("image/"));
    dispatchImageFiles(textarea, files);
    picker.value = "";
  };
  return React.createElement(React.Fragment, null,
    React.createElement("button", {
      type: "button",
      className: "cpwb-image-attachment-button",
      disabled: locked,
      title: "添加图片",
      "aria-label": "添加图片",
      onClick: choose,
    }, React.createElement(ImageSquare, { size: 17, weight: "regular", "aria-hidden": true })),
    React.createElement("input", {
      ref: pickerRef,
      className: "cpwb-image-attachment-input",
      type: "file",
      accept: "image/*",
      multiple: true,
      tabIndex: -1,
      "aria-hidden": true,
      onChange: selected,
    }));
}

export function registerImageAttachmentButton(ctx) {
  return ctx.slots.inject("conversation.input.left", function () {
    return ctx.slots.register({
      name: "conversation.input.left",
      id: "cpwb-image-attachment-button",
      order: 10,
    }, ImageAttachmentButton);
  });
}
