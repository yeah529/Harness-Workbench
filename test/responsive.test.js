import { test } from "node:test";
import assert from "node:assert/strict";

import { activateDrawerDialog, handleDrawerCancel } from "../src/client/responsive.js";

test("drawer activation opens modally, focuses its first control, and restores trigger focus", () => {
  const calls = [];
  const first = { focus: () => calls.push("first-focus") };
  const trigger = { focus: () => calls.push("trigger-focus") };
  const dialog = {
    open: false,
    showModal() { calls.push("showModal"); this.open = true; },
    close() { calls.push("close"); this.open = false; },
    querySelector() { return first; },
  };
  const cleanup = activateDrawerDialog(dialog, trigger);
  assert.deepEqual(calls, ["showModal", "first-focus"]);
  cleanup();
  assert.deepEqual(calls, ["showModal", "first-focus", "close", "trigger-focus"]);
});

test("drawer cancel prevents native dismissal and delegates one close", () => {
  const calls = [];
  handleDrawerCancel({ preventDefault: () => calls.push("prevent") }, () => calls.push("close"));
  assert.deepEqual(calls, ["prevent", "close"]);
});
