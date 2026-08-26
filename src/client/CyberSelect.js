import React from "react";
import { CaretDown, Check } from "@phosphor-icons/react";

function enabledItems(root) {
  return Array.from(root?.querySelectorAll?.('[role="option"]') || []).filter((item) => !item.disabled);
}

export function CyberSelect({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "请选择",
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const focusOnOpen = React.useRef(null);
  const listId = React.useId();
  const selectedId = value == null ? "" : String(value);
  const selected = options.find((option) => String(option.value) === selectedId);

  React.useEffect(() => {
    if (!open || focusOnOpen.current == null) return;
    const items = enabledItems(rootRef.current);
    const target = focusOnOpen.current === "last" ? items.at(-1) : items[0];
    focusOnOpen.current = null;
    target?.focus?.();
  }, [open]);

  const close = React.useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus?.();
  }, []);

  React.useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const dismiss = (event) => {
      if (rootRef.current?.contains?.(event.target)) return;
      close(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [close, open]);

  const moveFocus = (event) => {
    const items = enabledItems(rootRef.current);
    if (!items.length) return;
    const current = items.indexOf(event.target);
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (event.key === "ArrowDown") next = current < 0 ? 0 : (current + 1) % items.length;
    if (event.key === "ArrowUp") next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
    if (next !== current || current < 0) items[next]?.focus?.();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && open && event.target?.getAttribute?.("role") === "option") {
      event.preventDefault();
      event.stopPropagation();
      event.target.click();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!open) {
      focusOnOpen.current = event.key === "ArrowUp" || event.key === "End" ? "last" : "first";
      setOpen(true);
      return;
    }
    moveFocus(event);
  };

  return React.createElement("div", {
    ref: rootRef,
    className: `cpwb-cyber-select${className ? ` ${className}` : ""}`,
    onKeyDown: handleKeyDown,
  }, React.createElement("button", {
      ref: triggerRef,
      type: "button",
      className: "cpwb-cyber-select-trigger",
      disabled,
      "aria-label": ariaLabel,
      "aria-haspopup": "listbox",
      "aria-expanded": open,
      "aria-controls": open ? listId : undefined,
      onClick: () => setOpen((current) => !current),
    },
    React.createElement("span", { className: selected ? "" : "cpwb-cyber-select-placeholder" }, selected?.label ?? placeholder),
    React.createElement(CaretDown, { size: 15, weight: "bold", "aria-hidden": true })),
    open ? React.createElement("div", {
      id: listId,
      className: "cpwb-cyber-select-list",
      role: "listbox",
      "aria-label": ariaLabel,
    }, options.map((option) => {
      const id = String(option.value);
      const isSelected = id === selectedId;
      return React.createElement("button", {
        type: "button",
        role: "option",
        key: id,
        disabled: option.disabled === true,
        "aria-selected": isSelected,
        className: isSelected ? "cpwb-selected" : "",
        onClick: () => {
          onChange?.(option.value);
          close(true);
        },
      }, React.createElement("span", null, option.label), isSelected
        ? React.createElement(Check, { size: 14, weight: "bold", "aria-hidden": true })
        : null);
    })) : null);
}
