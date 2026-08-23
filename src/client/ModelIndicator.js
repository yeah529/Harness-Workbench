import React from "react";
import { CaretDown } from "@phosphor-icons/react";

function modelButtonIn(root = document) {
  if (!root || typeof root.querySelectorAll !== "function") return null;
  return Array.from(root.querySelectorAll("button[aria-label]")).find((button) => {
    const label = button.getAttribute("aria-label") || "";
    return label.startsWith("选择模型，当前") || label.startsWith("Select model, current");
  }) || null;
}
export function parseNativeModelSelectionLabel(value) {
  if (typeof value !== "string") return null;
  const zh = value.match(/^选择模型，当前\s*(.+?)，推理等级\s*(.+)$/i);
  if (zh) return zh[1].trim() + " · " + zh[2].trim();
  const en = value.match(/^Select model, current\s*(.+?),\s*reasoning effort\s*(.+)$/i);
  if (en) return en[1].trim() + " · " + en[2].trim();
  return null;
}

export function compactModelSelectionLabel(value) {
  if (typeof value !== "string" || !value.trim()) return "模型 · 自动";
  const [model, effort] = value.split(" · ");
  const compactModel = String(model || "")
    .replace(/^DeepSeek[-\s]*/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return [compactModel || model, effort].filter(Boolean).join(" · ");
}

export function useNativeModelSelectionLabel(sessionId) {
  const [label, setLabel] = React.useState(null);
  React.useEffect(function () {
    if (typeof document === "undefined") return undefined;
    const update = function () {
      const native = modelButtonIn(document);
      setLabel(parseNativeModelSelectionLabel(native?.getAttribute("aria-label")));
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

export function ModelIndicator({ sessionId, locked = false }) {
  const selection = useNativeModelSelectionLabel(sessionId);
  const label = compactModelSelectionLabel(selection);
  const openNativeModelMenu = function () {
    if (locked || typeof document === "undefined") return;
    modelButtonIn(document)?.click?.();
  };
  return React.createElement("button", {
    type: "button",
    className: "cpwb-model-indicator",
    disabled: locked,
    title: selection ? "当前模型：" + selection : "打开模型与推理等级选择",
    "aria-label": selection ? "当前模型 " + selection + "，点击切换" : "打开模型与推理等级选择",
    onClick: openNativeModelMenu,
  }, React.createElement("span", null, label), React.createElement(CaretDown, { size: 14, weight: "bold", "aria-hidden": true }));
}

export function registerModelIndicator(ctx) {
  return ctx.slots.inject("conversation.input.right", function () {
    return ctx.slots.register({
      name: "conversation.input.right",
      id: "cpwb-model-indicator",
      order: 40,
    }, ModelIndicator);
  });
}
