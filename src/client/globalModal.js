import React from "react";
import { activateDrawerDialog, handleDrawerCancel } from "./responsive.js";

export function GlobalModal({ children, onClose, labelledBy, className = "" }) {
  const dialogRef = React.useRef(null);
  const restoreTargetRef = React.useRef(typeof document === "undefined" ? null : document.activeElement);

  React.useEffect(function () {
    return activateDrawerDialog(dialogRef.current, restoreTargetRef.current);
  }, []);

  return React.createElement("dialog", {
    ref: dialogRef,
    className: "cpwb-page-modal-host" + (className ? " " + className : ""),
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": labelledBy,
    onCancel(event) { handleDrawerCancel(event, onClose); },
    onClick(event) { if (event.target === event.currentTarget) onClose?.(); },
  }, children);
}
