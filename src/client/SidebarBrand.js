import React from "react";

export function HarnessWorkbenchLogo() {
  return React.createElement("svg", { viewBox: "0 0 190 74", role: "img", "aria-labelledby": "cpwb-logo-title" },
    React.createElement("title", { id: "cpwb-logo-title" }, "Harness Workbench"),
    React.createElement("g", { fill: "var(--cpwb-logo-cyan, #4de8f4)", transform: "translate(3 3)" },
      React.createElement("text", { x: "9", y: "39", textLength: "166", lengthAdjust: "spacingAndGlyphs", fontFamily: "Rajdhani, sans-serif", fontSize: "39", fontStyle: "italic", fontWeight: "500" }, "HARNESS")),
    React.createElement("g", { fill: "var(--cpwb-logo-amber, #ffb51b)" },
      React.createElement("text", { x: "7", y: "37", textLength: "166", lengthAdjust: "spacingAndGlyphs", fontFamily: "Rajdhani, sans-serif", fontSize: "39", fontStyle: "italic", fontWeight: "500" }, "HARNESS")),
    React.createElement("path", { fill: "var(--cpwb-logo-cut, #07090f)", d: "M43 9h8L37 43h-8zM94 8h7L87 44h-7zM146 8h7l-14 36h-7z" }),
    React.createElement("path", { fill: "none", stroke: "var(--cpwb-logo-cyan, #4de8f4)", strokeWidth: "1.5", d: "M2 45L28 39M0 49L43 45M159 39L188 31M153 44L190 39" }),
    React.createElement("text", { x: "28", y: "63", fill: "var(--cpwb-logo-cyan, #4de8f4)", fontFamily: "Rajdhani, sans-serif", fontSize: "11", fontWeight: "600", letterSpacing: "5" }, "WORKBENCH"));
}

export function SidebarBrand({ status = "DSH // LOCAL NODE" }) {
  return React.createElement("footer", { className: "cpwb-sidebar-brand-footer", "aria-label": "Harness Workbench" },
    React.createElement("div", { className: "cpwb-sidebar-status" }, status),
    React.createElement("div", { className: "cpwb-sidebar-wordmark" }, React.createElement(HarnessWorkbenchLogo)));
}
