/**
 * Shared geometric SVG icons and tiny presentational helpers for the
 * Cyberpunk workbench client. No emoji, no image assets.
 */

import React from "react";

export function Icon(props) {
  const size = props.size || 14;
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true },
    React.createElement("path", { d: props.d }));
}

export const ICONS = {
  grid: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  check: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z",
  x: "M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z",
  bolt: "M11 21h-1l1-7H7.5c-.58 0-1.05-.63-.74-1.18L11.5 3h1l-1 7h3.5c.58 0 1.05.63.74 1.18L11 21z",
  book: "M4 6H2v14c0 1.1.9 2 2 2h16v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H10v-2h10v2zm0-4H10v-2h10v2zm0-4H10V4h10v2z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.59 4.24 2.47-.78 1.33L11 13.5V7h2z",
  chart: "M5 9h4v11H5zM10 4h4v16h-4zM15 13h4v7h-4z",
  warn: "M12 2 1 21h22L12 2zm1 15h-2v2h2v-2zm0-6h-2v4h2v-4z",
  refresh: "M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24L13 11h7V4l-2.35 2.35z",
  sliders: "M4 7h8v2H4V7zm10 0h6v2h-6V7zM8 15h12v2H8v-2zM4 15h2v2H4v-2z",
  upload: "M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z",
  search: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z",
  link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  doc: "M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z",
  folder: "M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z",
  db: "M12 2C8.13 2 5 4.69 5 8c0 3.31 3.13 6 7 6s7-2.69 7-6c0-3.31-3.13-6-7-6zm0 10c-2.48 0-4.5-1.79-4.5-4S9.52 4 12 4s4.5 1.79 4.5 4-2.02 4-4.5 4zm0 1c-3.87 0-7 1.34-7 3v2h14v-2c0-1.66-3.13-3-7-3z",
};

export function glyph(d, size) {
  return React.createElement(Icon, { d: d, size: size || 14 });
}

export function Badge(props) {
  return React.createElement("span", { className: "cpwb-badge cpwb-badge-" + props.kind }, props.children);
}

export function Toggle(props) {
  return React.createElement("button", {
    type: "button",
    className: "cpwb-toggle" + (props.on ? " cpwb-on" : ""),
    "aria-pressed": !!props.on,
    onClick: props.onClick,
    title: props.title || "切换",
  });
}

export function Empty(props) {
  return React.createElement("div", { className: "cpwb-empty" },
    React.createElement("span", { className: "cpwb-glyph" }, props.glyph),
    props.children);
}
