import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SlotCore, resolveSlotLabel } from "@deepseek-ai/dsh-client-ui-slots";
import { WorkbenchSettingsSection } from "../src/client/SettingsSection.js";
import { registerWorkbenchSettingsSection } from "../src/client/settingsSlot.js";
import { createWorkbenchSettings } from "../src/host/settings.js";
import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import { createTempDir, removeTempDir } from "./helpers.js";

const NATIVE_SETTINGS_CHILDREN = {
  "settings.trigger": { kind: "single", scope: "root" },
  "settings.header": { kind: "single", scope: "root" },
  "settings.action": { kind: "list", scope: "root" },
  "settings.close": { kind: "single", scope: "root" },
  "settings.section": { kind: "list", scope: "root" },
  "settings.onboarding": { kind: "list", scope: "root" },
};

function makeNativeSettingsRuntime() {
  const core = new SlotCore();
  const root = core.register({
    name: "root",
    children: { "sidebar.settings": { kind: "single", scope: "root" } },
  }, () => null);
  const nativeSidebar = core.register({
    name: "sidebar.settings",
    children: NATIVE_SETTINGS_CHILDREN,
  }, () => React.createElement("div", null, "native-settings-root"));
  const nativeGeneral = core.register({
    name: "settings.section",
    id: "general",
    order: 0,
    label: "General",
  }, () => React.createElement("div", null, "native-general"));

  // This mirrors the public runtime service's already-declared-slot path:
  // inject observes the declaration and installs the callback's disposer.
  const ctx = {
    slots: {
      register: (options, component) => core.register(options, component),
      inject: (key, callback) => {
        assert.equal(key, "settings.section");
        const disposer = callback();
        return () => disposer?.();
      },
    },
  };
  return { core, ctx, root, nativeSidebar, nativeGeneral };
}

test("production settings.section injection coexists with native SettingsRoot", () => {
  const runtime = makeNativeSettingsRuntime();
  const store = { getSnapshot: () => ({ settings: {} }), actions: {} };
  const injectedDisposer = registerWorkbenchSettingsSection(runtime.ctx, store);

  assert.deepEqual(
    runtime.core.entriesOfSlot("settings.section").map((entry) => entry.options.id),
    ["general", "cpwb-workbench-settings"],
  );
  assert.equal(runtime.core.snapshot("sidebar.settings")[0].declaredBy, "an entry in \"root\"");
  assert.deepEqual(
    runtime.core.snapshot("sidebar.settings")[0].children.find((child) => child.name === "settings.section").occupants.map((row) => row.id),
    ["general", "cpwb-workbench-settings"],
  );
  assert.equal(resolveSlotLabel(runtime.core.entries("settings.section")[1].options.label), "Workbench");

  // The native sidebar declaration and native General section survive plugin
  // unload; only the Workbench contribution is removed.
  injectedDisposer();
  assert.equal(runtime.core.entriesOfSlot("sidebar.settings")[0].component !== undefined, true);
  assert.deepEqual(runtime.core.entriesOfSlot("settings.section").map((entry) => entry.options.id), ["general"]);
  assert.deepEqual(runtime.core.snapshot("sidebar.settings")[0].children.find((child) => child.name === "settings.section").occupants.map((row) => row.id), ["general"]);

  runtime.nativeGeneral();
  runtime.nativeSidebar();
  runtime.root();
});

test("native SettingsRoot remains the only settings child-slot declarer", () => {
  const runtime = makeNativeSettingsRuntime();
  assert.throws(() => runtime.core.register({
    name: "sidebar.settings",
    priority: 1,
    children: { "settings.section": { kind: "list", scope: "root" } },
  }, () => null), /slot "settings\.section" is already declared/);
  runtime.nativeGeneral();
  runtime.nativeSidebar();
  runtime.root();
});

test("WorkbenchSettingsSection is a native section component with real controls", () => {
  const calls = [];
  const store = {
    getSnapshot: () => ({ settings: {
      timezone: "Asia/Shanghai",
      embedding: {
        provider: "ollama",
        baseUrl: "http://127.0.0.1:11434",
        model: "qwen3-embedding:0.6b",
        dimensions: 1024,
        timeoutMs: 30000,
        credentialRef: "EMBEDDING_KEY",
        credential: { configured: true, source: "env", readOnly: false },
      },
      network: { currentEffective: { mode: "direct" }, nextLaunch: { mode: "custom" }, requiresRestart: true },
      auth: { configured: false, source: null, readOnly: false, canConnect: true, activation: "next-request" },
      index: { status: "ready", counts: { ready: 3 } },
      automationPrompts: { summaryPrompt: "Custom summary", todoPrompt: "Custom todo" },
    } }),
    actions: { loadSettings: async () => calls.push("loadSettings") },
  };
  const render = (initialActive) => renderToStaticMarkup(React.createElement(WorkbenchSettingsSection, {
    close: () => calls.push("close"),
    initialActive,
    store,
  }));
  assert.match(render("workbench"), /Workbench 设置/);
  assert.match(render("timezone"), /全局时区/);
  const embedding = render("embedding");
  assert.match(embedding, /Embedding Base URL/);
  assert.match(embedding, /设置 \/ 替换凭据/);
  assert.match(embedding, /重建全部向量索引/);
  assert.match(embedding, /全部知识库/);
  const network = render("network");
  assert.match(network, /网络 \/ Proxy/);
  assert.match(network, /当前生效：direct/);
  assert.match(network, /下次启动：custom/);
  const auth = render("auth");
  assert.match(auth, /Codex 快速接入/);
  assert.match(auth, /扫描并接入 Codex/);
  assert.match(auth, /令牌不会发送到浏览器/);
  const automation = render("automation");
  assert.match(automation, /每日总结提示词/);
  assert.match(automation, /次日待办提示词/);
  assert.match(automation, /Custom summary/);
  assert.match(automation, /Custom todo/);
  assert.match(automation, /保存提示词/);
  assert.match(render("workbench"), /DSH credentials/);
});

test("historical Workbench setting values are sanitized on read and persisted clean", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });
  const repos = createRepositories(db);
  const sentinel = "task2-history-sentinel";
  repos.settings.set("embedding", {
    provider: "ollama",
    nested: { apiKey: sentinel, safe: "ok" },
    list: [{ authorization: sentinel, keep: true }],
  });
  const settings = createWorkbenchSettings({ repos });
  const value = settings.get("embedding");
  assert.equal(value.nested.apiKey, undefined);
  assert.equal(value.list[0].authorization, undefined);
  assert.equal(value.nested.safe, "ok");
  assert.doesNotMatch(repos.settings.get("embedding").nested?.apiKey ?? "", /sentinel/);
  assert.doesNotMatch(JSON.stringify(settings.all()), new RegExp(sentinel));
});
