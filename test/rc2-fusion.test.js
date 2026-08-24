import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";

import {
  compactModelSelectionLabel,
  parseNativeModelSelectionLabel,
} from "../src/client/ModelIndicator.js";
import {
  createSubagentClient,
  healthySubagentEntries,
  subagentHistoryToTranscript,
} from "../src/client/subagents.js";
import { SubagentDrawer } from "../src/client/SubagentDrawer.js";
import { dispatchImageFiles } from "../src/client/ImageAttachmentButton.js";

test("rc.2 model prompt keeps the exact route visible in a compact label", () => {
  assert.equal(
    parseNativeModelSelectionLabel("选择模型，当前 DeepSeek-V4-Flash，推理等级 High"),
    "DeepSeek-V4-Flash · High",
  );
  assert.equal(
    parseNativeModelSelectionLabel("Select model, current DeepSeek V4 Pro, reasoning effort Medium"),
    "DeepSeek V4 Pro · Medium",
  );
  assert.equal(compactModelSelectionLabel("DeepSeek-V4-Flash · High"), "V4 Flash · High");
  assert.equal(compactModelSelectionLabel("DeepSeek V4 Pro · 极高"), "V4 Pro · 极高");
});

test("rc.2 subagent catalog excludes diagnostics and preserves mode/activity", () => {
  assert.deepEqual(healthySubagentEntries({ entries: [
    { kind: "diagnostic", id: "broken", reason: "corrupt" },
    { kind: "child", id: "child-1", label: "Files API 接口审计", mode: "one-shot", activity: "running", hasChildren: false },
    { kind: "child", id: "child-2", label: "响应式验证", mode: "continuable", activity: "inactive", hasChildren: true },
  ] }).map((entry) => [entry.id, entry.mode, entry.activity]), [
    ["child-1", "one-shot", "running"],
    ["child-2", "continuable", "inactive"],
  ]);
});

test("rc.2 subagent history becomes a readable user/assistant/tool transcript", () => {
  const rows = subagentHistoryToTranscript([
    { event: { seq: 1, type: "user/message", data: { source: { kind: "user" }, content: [{ type: "text", text: "检查 Files API" }] } } },
    { event: { seq: 2, type: "assistant/message", data: { message: { content: [{ type: "text", text: "接口可用" }] } } } },
    { event: { seq: 3, type: "tool/call", data: { name: "read", arguments: "{}" } } },
    { event: { seq: 4, type: "tool/result", data: { message: { content: [{ type: "text", text: "ok" }] } } } },
  ]);
  assert.deepEqual(rows.map((row) => [row.role, row.text]), [
    ["user", "检查 Files API"],
    ["assistant", "接口可用"],
    ["tool", "调用 read"],
    ["tool", "ok"],
  ]);
});

test("rc.2 subagent client routes history, follow-up and interrupt through the public API", async () => {
  const calls = [];
  const ok = (value) => ({ rpcId: "echo", result: { ok: true, value } });
  const connection = { api: { subagents: {
    history: async (request) => { calls.push(["history", request.payload]); return ok({ events: [], hasMore: false }); },
    prompt: async (request) => { calls.push(["prompt", request.payload]); return ok({ messageId: "m1" }); },
    interrupt: async (request) => { calls.push(["interrupt", request.payload]); return ok({ accepted: true }); },
  } } };
  const client = createSubagentClient(connection);
  const address = { parentSessionId: "parent", childSessionId: "child", mode: "continuable" };
  await client.history(address);
  await client.prompt(address, "继续检查", { clientTimeZone: "Asia/Shanghai" });
  await client.interrupt(address);
  assert.deepEqual(calls.map(([name, payload]) => [name, payload.mode, payload.parentSessionId, payload.childSessionId]), [
    ["history", "continuable", "parent", "child"],
    ["prompt", "continuable", "parent", "child"],
    ["interrupt", "continuable", "parent", "child"],
  ]);
  assert.deepEqual(calls[1][1].content, [{ type: "text", text: "继续检查" }]);
});

test("one-shot drawer is explicitly read-only while continuable drawer owns a follow-up composer", () => {
  const base = {
    open: true,
    parentSessionId: "parent",
    connection: {},
    sessions: { list: { subscribe: () => () => {}, getSnapshot: () => ({ subagentsByParent: {} }) } },
    initialHistory: [{ role: "assistant", text: "完成接口核验", key: "a1" }],
    onClose() {},
  };
  const oneShot = renderToStaticMarkup(React.createElement(SubagentDrawer, {
    ...base,
    initialCatalog: { parentAvailable: true, entries: [{ kind: "child", id: "one", label: "接口审计", mode: "one-shot", activity: "inactive", hasChildren: false }] },
  }));
  assert.match(oneShot, /ONE-SHOT/);
  assert.match(oneShot, /一次性任务仅支持查看记录/);
  assert.doesNotMatch(oneShot, /向子智能体发送消息/);

  const continuable = renderToStaticMarkup(React.createElement(SubagentDrawer, {
    ...base,
    initialCatalog: { parentAvailable: true, entries: [{ kind: "child", id: "live", label: "响应式验证", mode: "continuable", activity: "running", hasChildren: false }] },
  }));
  assert.match(continuable, /CONTINUABLE/);
  assert.match(continuable, /向子智能体发送消息/);
  assert.match(continuable, /停止当前轮次/);
});

test("production package and CSS declare the rc.2 fusion contracts", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.peerDependencies["@deepseek-ai/dsh"], "0.1.1-rc.2");
  assert.ok(pkg.files.includes("src/launcher"), "published CLI must include its launcher runtime");
  for (const version of Object.values(pkg.peerDependencies)) {
    if (typeof version === "string" && version.startsWith("0.")) assert.equal(version, "0.1.1-rc.2");
  }
  const css = await readFile(new URL("../src/client/workbench.css", import.meta.url), "utf8");
  assert.match(css, /cpwb-subagent-drawer/);
  assert.match(css, /conversation\.input\.overlay/);
  assert.match(css, /conversation\.input\.attachments/);
  assert.match(css, /conversation\.input\.model/);
  assert.match(css, /cpwb-model-indicator/);
});

test("image picker hands selected files to the native rc.2 paste intake", () => {
  const added = [];
  class FakeDataTransfer {
    constructor() {
      this.items = { add: (file) => added.push(file) };
      this.files = added;
    }
  }
  class FakeClipboardEvent {
    constructor(type, init) {
      this.type = type;
      this.clipboardData = init.clipboardData;
      this.bubbles = init.bubbles;
      this.cancelable = init.cancelable;
    }
  }
  const dispatched = [];
  const target = { dispatchEvent(event) { dispatched.push(event); return false; } };
  const files = [{ name: "screen.png", type: "image/png" }];
  assert.equal(dispatchImageFiles(target, files, {
    DataTransferCtor: FakeDataTransfer,
    ClipboardEventCtor: FakeClipboardEvent,
  }), true);
  assert.deepEqual(added, files);
  assert.equal(dispatched[0].type, "paste");
  assert.equal(dispatched[0].clipboardData.files, added);
  assert.equal(dispatchImageFiles(null, files), false);
  assert.equal(dispatchImageFiles(target, []), false);
});
