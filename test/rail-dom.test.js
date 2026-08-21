/**
 * Rail DOM-targeting helpers (Codex review fixes).
 *
 * The DSH slot anchors ([data-slot="sidebar"] / [data-slot="conversation"]) are
 * display: contents, so they have no box and cannot hold padding. These tests
 * verify the pure helpers that resolve the *real* column (parentElement) and
 * save/apply/restore inline style verbatim so cleanup never clobbers host state.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  resolveSlotColumn,
  captureInlineStyle,
  applyInlineStyle,
  restoreInlineStyle,
  measureRailPlacement,
  measureHomeOverlayPlacement,
  computeWorkbenchSeats,
  resolveWorkbenchColumns,
  RAIL_STYLE_PROPS,
} from "../src/client/rail.js";

/** A minimal CSSStyleDeclaration-like store that actually persists values. */
function makeStyle(initial = {}) {
  const store = { ...initial };
  return {
    getPropertyValue: (prop) => (prop in store ? store[prop] : ""),
    setProperty: (prop, value) => { store[prop] = String(value); },
    removeProperty: (prop) => { delete store[prop]; },
    _store: store,
  };
}

/** A minimal element with a parent link and an optional measurable rect. */
function makeElement(overrides = {}) {
  const { style, rect, parentElement, ...rest } = overrides;
  return {
    style: makeStyle(style),
    parentElement: parentElement || null,
    getBoundingClientRect: rect == null ? undefined : () => rect,
    ...rest,
  };
}

test("resolveSlotColumn maps a display:contents slot anchor to its parentElement", () => {
  const column = makeElement({ rect: { left: 240, width: 240 } });
  const anchor = makeElement({ parentElement: column }); // the slot anchor (display: contents)
  assert.equal(resolveSlotColumn(anchor), column);
  assert.equal(resolveSlotColumn(null), null);
  assert.equal(resolveSlotColumn(undefined), null);
  assert.equal(resolveSlotColumn({ parentElement: null }), null);
});

test("home overlay starts after the measurable native sidebar column", () => {
  const sidebarColumn = makeElement({ rect: { left: 0, width: 260 } });
  assert.deepEqual(measureHomeOverlayPlacement(sidebarColumn), {
    left: 260,
    cssVariable: { name: "--cpwb-home-left", value: "260px" },
  });
  assert.deepEqual(measureHomeOverlayPlacement(null), {
    left: 0,
    cssVariable: { name: "--cpwb-home-left", value: "0px" },
  });
});

test("capture/apply/restore round-trips inline style verbatim (incl. pre-existing host values)", () => {
  const col = makeElement({
    style: { "box-sizing": "content-box", "padding-right": "12px" },
  });
  const snap = captureInlineStyle(col, RAIL_STYLE_PROPS);
  assert.deepEqual(snap, { "box-sizing": "content-box", "padding-right": "12px", "--cpwb-rail-width": "" });

  // The rail effect applies its own compression style.
  applyInlineStyle(col, { "box-sizing": "border-box", "padding-right": "320px", "--cpwb-rail-width": "320px" });
  assert.equal(col.style.getPropertyValue("box-sizing"), "border-box");
  assert.equal(col.style.getPropertyValue("padding-right"), "320px");
  assert.equal(col.style.getPropertyValue("--cpwb-rail-width"), "320px");

  // Cleanup restores the exact original values, never simply clearing the attr.
  restoreInlineStyle(col, snap);
  assert.equal(col.style.getPropertyValue("box-sizing"), "content-box");
  assert.equal(col.style.getPropertyValue("padding-right"), "12px");
  assert.equal(col.style.getPropertyValue("--cpwb-rail-width"), "", "plugin var removed when absent originally");
});

test("restore removes a property the plugin introduced (snapshot had '')", () => {
  const col = makeElement({ style: { "padding-right": "0px" } });
  const snap = captureInlineStyle(col, RAIL_STYLE_PROPS); // --cpwb-rail-width was absent
  applyInlineStyle(col, { "padding-right": "320px", "--cpwb-rail-width": "320px" });
  restoreInlineStyle(col, snap);
  assert.equal(col.style.getPropertyValue("padding-right"), "0px");
  assert.equal(col.style.getPropertyValue("--cpwb-rail-width"), "");
  assert.ok(!("--cpwb-rail-width" in col.style._store), "removed, not left as empty inline");
});

test("applyInlineStyle ignores null/empty values (removes rather than writes empty)", () => {
  const col = makeElement({ style: { "padding-left": "320px" } });
  applyInlineStyle(col, { "padding-left": null, "box-sizing": "" });
  assert.equal(col.style.getPropertyValue("padding-left"), "");
  assert.equal(col.style.getPropertyValue("box-sizing"), "");
});

test("measureRailPlacement uses the real sidebar column rect and compresses via border-box", () => {
  // The slot anchor is display:contents and would measure 0x0; the parent
  // column supplies the real rect, so the docked rail sits just right of it.
  const conversationColumn = makeElement();
  const sidebarColumn = makeElement({ rect: { left: 0, width: 240 } });
  const placement = measureRailPlacement({ conversationColumn, sidebarColumn, railWidth: 320 });

  assert.equal(placement.sidebarRight, 240);
  assert.deepEqual(placement.docked, { left: 240, width: 320 });
  assert.deepEqual(placement.conversationStyle, {
    "box-sizing": "border-box",
    "padding-right": "320px",
    "--cpwb-rail-width": "320px",
  });
});

test("measureRailPlacement tolerates a missing sidebar column (left=0)", () => {
  const placement = measureRailPlacement({ conversationColumn: makeElement(), sidebarColumn: null, railWidth: 320 });
  assert.equal(placement.sidebarRight, 0);
  assert.deepEqual(placement.docked, { left: 0, width: 320 });
});

test("1280px project session has exactly left, center, and project-tool seats", () => {
  assert.deepEqual(computeWorkbenchSeats({
    viewportWidth: 1280,
    sidebarWidth: 248,
    railWidth: 320,
    scopeKind: "project",
    nativeDetailsWidth: 0,
  }), {
    left: 248,
    center: 712,
    right: 320,
    rightOwner: "project-tools",
  });
});

test("non-project session keeps only left and center seats", () => {
  for (const scopeKind of ["knowledge_base", "independent"]) {
    assert.deepEqual(computeWorkbenchSeats({
      viewportWidth: 1280,
      sidebarWidth: 248,
      railWidth: 320,
      scopeKind,
      nativeDetailsWidth: 0,
    }), {
      left: 248,
      center: 1032,
      right: 0,
      rightOwner: null,
    });
  }
});

test("native details temporarily owns the right seat instead of creating a fourth column", () => {
  assert.deepEqual(computeWorkbenchSeats({
    viewportWidth: 1280,
    sidebarWidth: 248,
    railWidth: 320,
    scopeKind: "project",
    nativeDetailsWidth: 360,
  }), {
    left: 248,
    center: 672,
    right: 360,
    rightOwner: "native-details",
  });
});

test("resolveWorkbenchColumns targets only stable public slot anchors", () => {
  const sidebarColumn = makeElement();
  const conversationColumn = makeElement();
  const detailsColumn = makeElement();
  const elements = {
    '[data-slot="sidebar"]': makeElement({ parentElement: sidebarColumn }),
    '[data-slot="conversation"]': makeElement({ parentElement: conversationColumn }),
    '[data-slot="details"]': makeElement({ parentElement: detailsColumn }),
  };
  const selectors = [];
  const root = {
    querySelector(selector) {
      selectors.push(selector);
      return elements[selector] || null;
    },
  };

  assert.deepEqual(resolveWorkbenchColumns(root), { sidebarColumn, conversationColumn, detailsColumn });
  assert.deepEqual(selectors, [
    '[data-slot="sidebar"]',
    '[data-slot="conversation"]',
    '[data-slot="details"]',
  ]);
});
