import React from "react";

export const MOBILE_MAX = 899;
export const DESKTOP_MIN = 1280;

export function layoutModeForWidth(width) {
  const value = Number(width) || 0;
  if (value <= MOBILE_MAX) return "mobile";
  if (value < DESKTOP_MIN) return "tablet";
  return "desktop";
}

export function nextDrawerOwner(current, requested) {
  if (requested == null || current === requested) return null;
  return requested;
}

function subscribeViewport(listener) {
  if (typeof window === "undefined") return function () {};
  window.addEventListener("resize", listener);
  return function () { window.removeEventListener("resize", listener); };
}

function viewportSnapshot() {
  return layoutModeForWidth(typeof window === "undefined" ? DESKTOP_MIN : window.innerWidth);
}

export function useWorkbenchLayoutMode(override) {
  const observed = React.useSyncExternalStore(subscribeViewport, viewportSnapshot, () => "desktop");
  return override || observed;
}

export function activateDrawerDialog(dialog, restoreTarget) {
  if (!dialog) return function () {};
  try {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute?.("open", "");
  } catch {
    dialog.setAttribute?.("open", "");
  }
  dialog.querySelector?.("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")?.focus?.();
  return function () {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute?.("open");
    restoreTarget?.focus?.();
  };
}

export function handleDrawerCancel(event, onClose) {
  event.preventDefault();
  onClose?.();
}

/** Native dialog supplies modal focus containment; this wrapper adds fallback,
 * Escape close, backdrop close, and trigger-focus restoration. */
export function DrawerDialog({ open, onClose, label, side, triggerRef, children }) {
  const dialogRef = React.useRef(null);

  React.useEffect(function () {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const restoreTarget = triggerRef?.current || document.activeElement;
    return activateDrawerDialog(dialog, restoreTarget);
  }, [open, triggerRef]);

  if (!open) return null;
  return React.createElement("dialog", {
    ref: dialogRef,
    className: "cpwb-responsive-drawer cpwb-drawer-" + side,
    role: "dialog",
    "aria-label": label,
    "aria-modal": "true",
    "data-open": "true",
    onCancel(event) {
      handleDrawerCancel(event, onClose);
    },
    onClick(event) {
      if (event.target === event.currentTarget) onClose?.();
    },
  }, children);
}
