import test from "node:test";
import assert from "node:assert/strict";

import {
  activeKnowledgeBaseId,
  nextKnowledgePreviewAfterLeave,
  routeKnowledgeBackplaneLink,
} from "../src/client/knowledgeBackplane.js";

const boardRect = { left: 0, top: 0, width: 920, height: 580 };
const panelRect = { left: 650, top: 30, width: 250, height: 520 };
const leftChip = { left: 20, right: 280, top: 60, bottom: 260, width: 260, height: 200 };
const rightChip = { left: 320, right: 580, top: 60, bottom: 260, width: 260, height: 200 };
const lowerChip = { left: 20, right: 280, top: 300, bottom: 500, width: 260, height: 200 };

test("left chip routes below a sibling that blocks its horizontal path", () => {
  const link = routeKnowledgeBackplaneLink({
    boardRect, chipRect: leftChip, panelRect, blockerRects: [rightChip, lowerChip],
  });
  assert.equal(link.path, "M 280 160 H 300 V 278 H 622 V 126 H 650");
  assert.deepEqual(link.origin, { x: 280, y: 160 });
  assert.deepEqual(link.target, { x: 650, y: 126 });
  assert.equal(link.viewBox, "0 0 920 580");
});

test("right chip takes the direct lane because no card blocks it", () => {
  const link = routeKnowledgeBackplaneLink({
    boardRect, chipRect: rightChip, panelRect, blockerRects: [leftChip, lowerChip],
  });
  assert.equal(link.path, "M 580 160 H 608 V 160 H 622 V 126 H 650");
});

test("connector returns null for missing or non-finite geometry", () => {
  assert.equal(routeKnowledgeBackplaneLink({ boardRect, chipRect: null, panelRect }), null);
  assert.equal(routeKnowledgeBackplaneLink({
    boardRect, panelRect, chipRect: { ...leftChip, right: Number.NaN },
  }), null);
});

test("hover preview wins over pinned selection and stale leaves cannot clear it", () => {
  assert.equal(activeKnowledgeBaseId({ previewId: 2, pinnedId: 1 }), 2);
  assert.equal(activeKnowledgeBaseId({ previewId: null, pinnedId: 1 }), 1);
  assert.equal(nextKnowledgePreviewAfterLeave(2, 1), 2);
  assert.equal(nextKnowledgePreviewAfterLeave(2, 2), null);
});
