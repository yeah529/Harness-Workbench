/**
 * Pure rail-width + rail-placement helpers for the project workbench rail.
 *
 * The rail defaults to 320px and is clamped to [280, 420]px whether the resize
 * comes from the pointer divider or its keyboard handlers. Placement decision
 * helpers keep every branch — project vs. KB session, drawer vs. docked rail —
 * a pure function of its inputs so the positioning logic is unit-testable
 * independent of the DOM effect that applies it.
 */

export const RAIL_WIDTH_MIN = 280;
export const RAIL_WIDTH_MAX = 420;
export const RAIL_WIDTH_DEFAULT = 320;

export function workbenchGridTemplate(toolOpen) {
  return toolOpen
    ? "232px minmax(0, 1fr) minmax(280px, 320px)"
    : "232px minmax(0, 1fr)";
}

/** Below this viewport width the rail switches to a masking drawer. */
export const RAIL_DRAWER_BREAKPOINT = 1280;

/** Clamp an arbitrary width into the supported rail range. */
export function clampRailWidth(value) {
  return Math.min(RAIL_WIDTH_MAX, Math.max(RAIL_WIDTH_MIN, value));
}

/** Apply a signed delta to the current width and clamp the result. */
export function adjustRailWidth(current, delta) {
  return clampRailWidth(current + delta);
}

/**
 * Decide whether the project rail should be visible for a session. Only a
 * workbench session whose scope is a *project* gets the rail; KB-only chats
 * (`knowledge_base` scope) never do.
 *
 * @param {{ sessionId?: string, scope?: { kind?: string } | null }} input
 * @returns {boolean}
 */
export function shouldShowProjectRail({ sessionId, scope }) {
  if (typeof sessionId !== "string" || !sessionId.startsWith("session-cpwb-")) return false;
  return scope?.kind === "project";
}

/**
 * True when the viewport should render the rail as a masking drawer instead of
 * a docked (conversation-compressing) column.
 *
 * @param {number} viewportWidth
 * @returns {boolean}
 */
export function isDrawerMode(viewportWidth) {
  return viewportWidth < RAIL_DRAWER_BREAKPOINT;
}

/**
 * Compute the fixed-position rectangle of the docked rail from the measured
 * sidebar right edge and the rail width. Pure: the DOM effect reads measurements
 * and feeds this, so the math is testable without a browser.
 *
 * @param {{ sidebarRight: number, railWidth: number }} input
 * @returns {{ left: number, width: number }}
 */
export function dockedRailLeft({ conversationLeft, conversationWidth, railWidth }) {
  const width = clampRailWidth(railWidth);
  return { left: conversationLeft + Math.max(0, conversationWidth - width), width };
}

/**
 * Compute the CSS style an effect should apply to the DSH conversation column
 * so the docked rail compresses the conversation instead of covering it. The
 * padding-right equals the rail width; the effect must remember the column's
 * original padding-right to restore it on cleanup.
 *
 * @param {number} railWidth
 * @returns {{ paddingLeft: string, cssVariable: { name: string, value: string } }}
 */
export function conversationCompression(railWidth) {
  const width = clampRailWidth(railWidth);
  return {
    paddingRight: width + "px",
    cssVariable: { name: "--cpwb-rail-width", value: width + "px" },
  };
}

/**
 * Inline style properties the rail effect mutates on the conversation column
 * and must restore exactly on cleanup (never blindly clearing the attribute):
 * box-sizing makes padding-right *compress* the chat instead of widening the
 * column, padding-right reserves the rail's physical space, and the CSS custom
 * property feeds any plugin CSS that keys off the live rail width.
 */
export const RAIL_STYLE_PROPS = ["box-sizing", "padding-right", "--cpwb-rail-width"];

/**
 * Resolve the measurable, style-able column for a DSH slot anchor.
 *
 * The DSH slot elements themselves (`[data-slot="sidebar"]` /
 * `[data-slot="conversation"]`) are `display: contents`: they have no box, so
 * getBoundingClientRect() measures nothing and inline padding has no effect.
 * The real column is the anchor's parentElement.
 *
 * @param {Element | null | undefined} slotEl
 * @returns {Element | null}
 */
export function resolveSlotColumn(slotEl) {
  if (!slotEl || typeof slotEl !== "object") return null;
  return slotEl.parentElement || null;
}

/**
 * Resolve the three rc.2 frame columns through public slot anchors only. The
 * returned nodes are the measurable parent columns, never the display:contents
 * slot wrappers and never build-hash classes.
 *
 * @param {{ querySelector?: (selector: string) => Element | null } | null | undefined} root
 */
export function resolveWorkbenchColumns(root) {
  const query = typeof root?.querySelector === "function"
    ? root.querySelector.bind(root)
    : function () { return null; };
  return {
    sidebarColumn: resolveSlotColumn(query('[data-slot="sidebar"]')),
    conversationColumn: resolveSlotColumn(query('[data-slot="conversation"]')),
    detailsColumn: resolveSlotColumn(query('[data-slot="details"]')),
  };
}

/**
 * Describe the visible horizontal seats. The right side has one owner at a
 * time: native DSH details wins while open; otherwise project tools may occupy
 * it. This is the invariant that prevents an accidental fourth column.
 */
export function computeWorkbenchSeats({
  viewportWidth,
  sidebarWidth,
  railWidth,
  scopeKind,
  nativeDetailsWidth = 0,
}) {
  const viewport = Math.max(0, Number(viewportWidth) || 0);
  const left = Math.min(viewport, Math.max(0, Number(sidebarWidth) || 0));
  const details = Math.max(0, Number(nativeDetailsWidth) || 0);
  let right = 0;
  let rightOwner = null;

  if (details > 0) {
    right = Math.min(Math.max(0, viewport - left), details);
    rightOwner = "native-details";
  } else if (scopeKind === "project") {
    right = Math.min(Math.max(0, viewport - left), clampRailWidth(Number(railWidth) || RAIL_WIDTH_DEFAULT));
    rightOwner = "project-tools";
  }

  return {
    left,
    center: Math.max(0, viewport - left - right),
    right,
    rightOwner,
  };
}

/**
 * Compute the left edge for the home overlay from the real DSH sidebar
 * column. The shell overlay is viewport-sized, so the workbench home must
 * reserve the native sidebar explicitly instead of relying on z-index.
 *
 * @param {Element | null | undefined} sidebarColumn
 * @returns {{ left: number, cssVariable: { name: string, value: string } }}
 */
export function measureHomeOverlayPlacement(sidebarColumn) {
  const rect = sidebarColumn && typeof sidebarColumn.getBoundingClientRect === "function"
    ? sidebarColumn.getBoundingClientRect()
    : { left: 0, width: 0 };
  const left = Math.max(0, Math.round((rect.left || 0) + (rect.width || 0)));
  return {
    left,
    cssVariable: { name: "--cpwb-home-left", value: left + "px" },
  };
}

/**
 * Snapshot the exact inline values of `props` on an element so cleanup can
 * restore them verbatim. Absent properties snapshot as "" (meaning "remove
 * the property on restore", which falls back to the stylesheet).
 *
 * @param {Element | null | undefined} el
 * @param {string[]} props
 * @returns {Record<string, string>}
 */
export function captureInlineStyle(el, props) {
  const snapshot = {};
  if (el && el.style && typeof el.style.getPropertyValue === "function") {
    for (const prop of props) snapshot[prop] = el.style.getPropertyValue(prop);
  } else {
    for (const prop of props) snapshot[prop] = "";
  }
  return snapshot;
}

/**
 * Apply a map of kebab-case property -> value onto an element's inline style.
 * A null/empty value removes the property (never leaves an empty "" inline
 * declaration behind).
 *
 * @param {Element | null | undefined} el
 * @param {Record<string, string | null | undefined>} values
 */
export function applyInlineStyle(el, values) {
  if (!el || !el.style) return;
  for (const prop of Object.keys(values || {})) {
    const value = values[prop];
    if (value == null || value === "") {
      if (typeof el.style.removeProperty === "function") el.style.removeProperty(prop);
    } else if (typeof el.style.setProperty === "function") {
      el.style.setProperty(prop, value);
    }
  }
}

/**
 * Restore an element's inline style to a previously captured snapshot.
 * "" in the snapshot means the property was absent originally and is removed
 * (so it falls back to the stylesheet); any other value is re-applied verbatim.
 *
 * @param {Element | null | undefined} el
 * @param {Record<string, string>} snapshot
 */
export function restoreInlineStyle(el, snapshot) {
  if (!el || !el.style) return;
  for (const prop of Object.keys(snapshot || {})) {
    const original = snapshot[prop];
    if (original == null || original === "") {
      if (typeof el.style.removeProperty === "function") el.style.removeProperty(prop);
    } else if (typeof el.style.setProperty === "function") {
      el.style.setProperty(prop, original);
    }
  }
}

/**
 * Measure the docked rail's physical placement + the conversation compression
 * style, using the *real* columns (the slot anchors' parentElements). Pure of
 * DOM side effects: it only reads getBoundingClientRect() and computes values.
 *
 * @param {{ conversationColumn: Element | null, sidebarColumn: Element | null, railWidth: number }} input
 * @returns {{ sidebarRight: number, docked: { left: number, width: number }, conversationStyle: Record<string, string> }}
 */
export function measureRailPlacement({ conversationColumn, sidebarColumn, railWidth }) {
  const sidebarRect = sidebarColumn && typeof sidebarColumn.getBoundingClientRect === "function"
    ? sidebarColumn.getBoundingClientRect()
    : { left: 0, width: 0 };
  const sidebarRight = (sidebarRect.left || 0) + (sidebarRect.width || 0);
  const conversationRect = conversationColumn && typeof conversationColumn.getBoundingClientRect === "function"
    ? conversationColumn.getBoundingClientRect()
    : { left: sidebarRight, width: 0 };
  const comp = conversationCompression(railWidth);
  return {
    sidebarRight,
    docked: dockedRailLeft({ conversationLeft: conversationRect.left || 0, conversationWidth: conversationRect.width || 0, railWidth }),
    conversationStyle: {
      "box-sizing": "border-box",
      "padding-right": comp.paddingRight,
      [comp.cssVariable.name]: comp.cssVariable.value,
    },
  };
}
