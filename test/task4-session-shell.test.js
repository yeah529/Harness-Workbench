import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { SlotCore } from "@deepseek-ai/dsh-client-ui-slots";

import {
  PROJECT_TOOL_TABS,
  WorkbenchSessionShell,
} from "../src/client/WorkbenchSessionShell.js";
import { resolveHomeMetrics, setProjectHomeOpen } from "../src/client/ProjectHome.js";
import {
  listWorkbenchSessions,
  paginateWorkbenchSessions,
  sessionCapabilitySlots,
  sessionRuntimeActions,
} from "../src/client/sessionAdapter.js";
import { workbenchGridTemplate } from "../src/client/rail.js";
import { formatInstant, localDateKey, zonedDateTimeToUtc } from "../src/client/timezone.js";
import { registerWorkbenchSettingsSection } from "../src/client/settingsSlot.js";
import { createNavigationStore } from "../src/client/navigation.js";
import { WorkbenchShell } from "../src/client/WorkbenchShell.js";
import { layoutModeForWidth, nextDrawerOwner } from "../src/client/responsive.js";
import { clearWorkbenchSessions, registerWorkbenchSession } from "../src/client/workbenchSessions.js";

function shellStore() {
  const state = {
    phase: "ready",
    projects: [],
    knowledgeBases: [],
    documents: [],
    recentSessions: [],
    sessionPage: { items: [], total: 0, limit: 20, offset: 0 },
    workbenchSessions: {
      "session-cpwb-i": { scope: { kind: "independent", scopeId: null }, chatId: null },
    },
  };
  return {
    getSnapshot: () => state,
    subscribe: () => () => {},
    actions: { loadAllSessions: async () => {}, refreshProject: async () => {} },
  };
}

test("home metrics fall back to loaded Workbench projects and use the paged session total", () => {
  assert.deepEqual(resolveHomeMetrics({
    projects: [{ id: 1 }, { id: 2 }],
    knowledgeBases: [{ id: 3 }],
    recentSessions: [{ sessionId: "session-cpwb-1" }],
    recentSessionTotal: 12,
  }), { workspaceCount: 2, sessionCount: 12, knowledgeCount: 1 });
  assert.deepEqual(resolveHomeMetrics({
    projects: [{ id: 1 }, { id: 2 }],
    recentSessions: [{ sessionId: "session-cpwb-1" }],
  }), { workspaceCount: 2, sessionCount: 1, knowledgeCount: 0 });
});

test("unified shell renders one mutually exclusive center page and no duplicate home sidebar", () => {
  for (const page of ["home", "knowledge", "sessions", "conversation"]) {
    const navigation = createNavigationStore({ initialPage: page === "conversation" ? "home" : page });
    if (page === "conversation") navigation.openConversation("session-cpwb-i");
    const html = renderToStaticMarkup(React.createElement(WorkbenchShell, {
      navigation,
      store: shellStore(),
      sessions: { list: { getSnapshot: () => ({ ids: [], byId: {}, current: undefined }), subscribe: () => () => {} } },
      createProject: async () => {},
      createSession: async () => {},
      enterProject: async () => {},
      openSession: async () => {},
      openKnowledge: navigation.openKnowledge,
    }));
    assert.match(html, new RegExp('class="cpwb-app-shell cpwb-layout-desktop" data-page="' + page + '"'));
    assert.equal((html.match(/class="cpwb-global-sidebar"/g) || []).length, 1);
    assert.doesNotMatch(html, /cpwb-home-identity/);
    if (page === "home") {
      assert.match(html, /打开知识库中心/);
      assert.doesNotMatch(html, /cpwb-knowledge-grid/);
    }
  }
});

test("responsive modes cover desktop, tablet, mobile and keep drawers mutually exclusive", () => {
  assert.equal(layoutModeForWidth(1280), "desktop");
  assert.equal(layoutModeForWidth(1279), "tablet");
  assert.equal(layoutModeForWidth(900), "tablet");
  assert.equal(layoutModeForWidth(899), "mobile");
  assert.equal(layoutModeForWidth(768), "mobile");
  assert.equal(layoutModeForWidth(390), "mobile");
  assert.equal(nextDrawerOwner(null, "navigation"), "navigation");
  assert.equal(nextDrawerOwner("navigation", "project"), "project");
  assert.equal(nextDrawerOwner("project", "project"), null);
});

test("native model accessible label maps to the live context-bar selection", async () => {
  const module = await import("../src/client/WorkbenchSessionShell.js");
  assert.equal(
    module.parseNativeModelSelectionLabel?.("选择模型，当前 DeepSeek-V4-Flash，推理等级 High"),
    "DeepSeek-V4-Flash · High",
  );
  assert.equal(module.parseNativeModelSelectionLabel?.("选择模型"), null);
});

test("mobile shell hides the docked sidebar and exposes one accessible navigation trigger", () => {
  const navigation = createNavigationStore({ initialPage: "home" });
  const html = renderToStaticMarkup(React.createElement(WorkbenchShell, {
    layoutMode: "mobile",
    navigation,
    store: shellStore(),
    sessions: { list: { getSnapshot: () => ({ ids: [], byId: {}, current: undefined }), subscribe: () => () => {} } },
  }));
  assert.match(html, /cpwb-layout-mobile/);
  assert.match(html, /aria-label="打开导航"/);
  assert.doesNotMatch(html, /class="cpwb-global-sidebar"/);
});

test("project rail contains only the approved project-owned tools", () => {
  assert.deepEqual(PROJECT_TOOL_TABS.map(([id, label]) => [id, label]), [
    ["todos", "待办"],
    ["schedule", "定时任务"],
    ["knowledge", "关联知识库"],
    ["summary", "每日总结"],
  ]);
  assert.equal(PROJECT_TOOL_TABS.some(([, label]) => label === "任务" || label === "计划"), false);
});

test("Workbench session list only contains cpwb sessions and paginates through the DSH list snapshot", () => {
  const snapshot = {
    ids: ["normal-1", "session-cpwb-a", "session-cpwb-b", "normal-2"],
    byId: {
      "normal-1": { sessionId: "normal-1" },
      "session-cpwb-a": { sessionId: "session-cpwb-a", title: "A" },
      "session-cpwb-b": { sessionId: "session-cpwb-b", title: "B" },
      "normal-2": { sessionId: "normal-2" },
    },
  };
  assert.deepEqual(listWorkbenchSessions(snapshot).map((x) => x.sessionId), ["session-cpwb-a", "session-cpwb-b"]);
  assert.deepEqual(paginateWorkbenchSessions(snapshot, { offset: 1, limit: 1 }).map((x) => x.sessionId), ["session-cpwb-b"]);
});

test("Workbench history is isolated to the active project or knowledge-base scope", () => {
  const snapshot = {
    ids: ["session-cpwb-a", "session-cpwb-b", "session-cpwb-c"],
    byId: {
      "session-cpwb-a": { id: "session-cpwb-a", displayTitle: "A" },
      "session-cpwb-b": { id: "session-cpwb-b", displayTitle: "B" },
      "session-cpwb-c": { id: "session-cpwb-c", displayTitle: "C" },
    },
  };
  const scopes = {
    "session-cpwb-a": { scope: { kind: "project", scopeId: 1 } },
    "session-cpwb-b": { scope: { kind: "project", scopeId: 2 } },
    "session-cpwb-c": { scope: { kind: "knowledge_base", scopeId: 3 } },
  };
  assert.deepEqual(
    listWorkbenchSessions(snapshot, scopes, { kind: "project", scopeId: 1 }).map((row) => row.sessionId),
    ["session-cpwb-a"],
  );
  assert.deepEqual(
    listWorkbenchSessions(snapshot, scopes, { kind: "knowledge_base", scopeId: 3 }).map((row) => row.sessionId),
    ["session-cpwb-c"],
  );
});

test("standard session kit capability surface preserves dynamic Slot names", () => {
  const slots = sessionCapabilitySlots();
  for (const name of [
    "conversation.view",
    "conversation.chat.node",
    "conversation.chat.commandview",
    "conversation.chat.turnTail",
    "conversation.details.tool",
    "conversation.composer.bar",
    "conversation.input.left",
    "conversation.input.right",
    "conversation.input.attachments",
    "conversation.input.plan",
    "conversation.input.model",
    "conversation.composer.dock",
  ]) assert.ok(slots.includes(name), name);
  assert.ok(slots.includes("*") || slots.includes("dynamic"), "unknown extension slots remain delegated to rc.2 SlotRenderer");
});

test("session runtime actions delegate to the DSH Session face, not a second message store", async () => {
  const calls = [];
  const session = {
    prompt: async (...args) => { calls.push(["prompt", ...args]); return "queued"; },
    cancel: async () => { calls.push(["cancel"]); return { ok: true }; },
    loadOlder: async () => { calls.push(["loadOlder"]); return "older"; },
    updateQueue: async (...args) => { calls.push(["updateQueue", ...args]); return "queue"; },
    rename: async (...args) => { calls.push(["rename", ...args]); return "rename"; },
    command: async (...args) => { calls.push(["command", ...args]); return "command"; },
  };
  const actions = sessionRuntimeActions(session);
  await actions.send("hello");
  await actions.steer("new direction");
  await actions.stop();
  await actions.loadOlder();
  await actions.updateQueue("msg-1", { kind: "remove" });
  await actions.rename("renamed");
  await actions.command("/status");
  assert.deepEqual(calls, [
    ["prompt", [{ type: "text", text: "hello" }], "queue"],
    ["prompt", [{ type: "text", text: "new direction" }], "steer"],
    ["cancel"],
    ["loadOlder"],
    ["updateQueue", "msg-1", { kind: "remove" }],
    ["rename", "renamed"],
    ["command", "/status"],
  ]);
});

test("toolOpen=false removes the third grid column", () => {
  assert.equal(workbenchGridTemplate(false), "232px minmax(0, 1fr)");
  assert.equal(workbenchGridTemplate(true), "232px minmax(0, 1fr) minmax(280px, 320px)");
});

test("todo wall-clock values use the Workbench IANA timezone, not the browser process timezone", () => {
  const instant = zonedDateTimeToUtc("2026-01-02", "00:30", "America/Los_Angeles");
  assert.equal(instant.toISOString(), "2026-01-02T08:30:00.000Z");
  assert.equal(formatInstant("2026-01-02T08:30:00.000Z", "America/Los_Angeles"), "2026-01-02 00:30");
  assert.equal(localDateKey("2026-01-02T07:30:00.000Z", "America/Los_Angeles"), "2026-01-01");
  assert.equal(formatInstant("2026-07-01T01:30:00.000Z", "America/Los_Angeles"), "2026-06-30 18:30");
});

test("Workbench session shell is an overlay and leaves rc.2 conversation rendering to the native root", () => {
  const calls = [];
  const store = {
    getSnapshot: () => ({
      projects: [{ id: 7, name: "Research" }],
      workbenchSessions: { "session-cpwb-project-7": {
        scope: { kind: "project", scopeId: 7 },
        selection: { model: "deepseek-v4-flash", reasoningEffort: "high" },
      } },
      activeProjectId: 7,
      linkedKnowledgeBases: [{ id: 2, name: "Architecture" }],
      todos: [],
    }),
    subscribe: () => () => {},
    actions: { refreshProject: async () => {} },
  };
  clearWorkbenchSessions();
  registerWorkbenchSession({
    sessionId: "session-cpwb-project-7",
    scope: { kind: "project", scopeId: 7 },
    chatId: null,
  });
  setProjectHomeOpen(false);
  try {
    const html = renderToStaticMarkup(React.createElement(WorkbenchSessionShell, {
      sessionId: "session-cpwb-project-7",
      store,
      renderSlot: (name, props, options) => {
        calls.push({ name, props, options });
        return React.createElement("div", { "data-rendered-slot": name }, "rc.2 VIEW");
      },
      sessions: { list: { getSnapshot: () => ({ ids: [], byId: {}, current: undefined, phase: "ready" }), subscribe: () => () => {} } },
      createSession: () => {},
      onHome: () => {},
    }));
    assert.equal(calls.length, 0, "overlay must not replace or manually render conversation.view");
    assert.doesNotMatch(html, /<textarea/);
    assert.match(html, /待办/);
    assert.match(html, /定时任务/);
    assert.match(html, /关联知识库/);
    assert.match(html, /每日总结/);
    assert.match(html, /cpwb-session-context-bar/);
    assert.match(html, /项目会话/);
    assert.match(html, /Research/);
    assert.match(html, /1 个关联知识库/);
    assert.match(html, /deepseek-v4-flash/);
    assert.match(html, /high/);
    assert.doesNotMatch(html, /cpwb-global-sidebar|cpwb-sidebar-brand-footer/);
  } finally {
    clearWorkbenchSessions();
    setProjectHomeOpen(true);
  }
});

test("knowledge-base and independent conversations never render project-owned tools", () => {
  for (const kind of ["knowledge_base", "independent"]) {
    const sessionId = "session-cpwb-" + kind;
    const store = {
      getSnapshot: () => ({
        projects: [],
        knowledgeBases: kind === "knowledge_base" ? [{ id: 2, name: "Workbench Docs" }] : [],
        workbenchSessions: { [sessionId]: { scope: { kind, scopeId: kind === "independent" ? null : 2 } } },
      }),
      subscribe: () => () => {},
      actions: {},
    };
    const html = renderToStaticMarkup(React.createElement(WorkbenchSessionShell, { sessionId, open: true, store }));
    assert.doesNotMatch(html, /cpwb-project-rail/);
    assert.match(html, /cpwb-session-context-bar/);
    if (kind === "knowledge_base") {
      assert.match(html, /知识库会话/);
      assert.match(html, /Workbench Docs/);
      assert.match(html, /向量检索已启用/);
    } else {
      assert.match(html, /独立会话/);
      assert.match(html, /未关联项目/);
      assert.match(html, /未启用知识库/);
    }
  }
});

test("session shell unmounts while the Workbench home state is open", () => {
  const store = {
    getSnapshot: () => ({ projects: [], workbenchSessions: {} }),
    subscribe: () => () => {},
    actions: {},
  };
  setProjectHomeOpen(true);
  const html = renderToStaticMarkup(React.createElement(WorkbenchSessionShell, {
    sessionId: "session-cpwb-project-7",
    store,
    sessions: { list: { getSnapshot: () => ({ ids: [], byId: {}, current: undefined, phase: "ready" }), subscribe: () => () => {} } },
  }));
  assert.equal(html, "");
});

test("production composition does not claim conversation.session or filter native view slots", async () => {
  const indexSource = await readFile(new URL("../src/client/index.js", import.meta.url), "utf8");
  const shellSource = await readFile(new URL("../src/client/WorkbenchSessionShell.js", import.meta.url), "utf8");
  assert.doesNotMatch(indexSource, /slots\.inject\(["']conversation\.session["']/);
  assert.doesNotMatch(shellSource, /renderSlot\([\s\S]*conversation\.view/);
  assert.doesNotMatch(shellSource, /only\s*:\s*["']chat["']/);
  assert.match(indexSource, /shell\.overlay/);
  assert.match(indexSource, /cpwb-workbench-shell/);
  assert.doesNotMatch(indexSource, /cpwb-project-home|cpwb-session-shell/);
  assert.equal((indexSource.match(/slots\.inject\(["']shell\.overlay["']/g) || []).length, 1);
});

test("rc.2 SlotCore composition keeps native Chat/Trajectory and a dynamic Workbench view switchable", () => {
  const core = new SlotCore();
  const nativeRootDisposer = core.register({
    name: "root",
    children: {
      "shell.overlay": { kind: "list", scope: "root" },
      "settings.section": { kind: "list", scope: "root" },
      "conversation.session": { kind: "single", scope: "session" },
    },
  }, () => null);
  const nativeSessionDisposer = core.register({
    name: "conversation.session",
    children: { "conversation.view": { kind: "list", scope: "session" } },
  }, () => null);
  const chat = core.register({ name: "conversation.view", id: "chat", order: 0, label: "Chat" }, () => "chat");
  const trajectory = core.register({ name: "conversation.view", id: "trajectory", order: 10, label: "Trajectory" }, () => "trajectory");

  const injections = [];
  const ctx = {
    effect(fn) { return fn(); },
    slots: {
      inject(name, fn) {
        injections.push({ name, fn });
        return fn();
      },
      register(options, component) { return core.register(options, component); },
    },
  };
  registerWorkbenchSettingsSection(ctx);

  assert.deepEqual(core.entriesOfSlot("conversation.view").map((entry) => entry.options.id), ["chat", "trajectory"]);
  assert.ok(injections.some((entry) => entry.name === "settings.section"), "Workbench settings uses the additive native section injection");
  const dynamic = core.register({ name: "conversation.view", id: "workbench-test", order: 20, label: "Workbench test" }, () => "test");
  const views = core.entriesOfSlot("conversation.view");
  assert.deepEqual(views.map((entry) => entry.options.id), ["chat", "trajectory", "workbench-test"]);
  const renderActive = (id) => views.find((entry) => entry.options.id === id)?.component();
  assert.equal(renderActive("chat"), "chat");
  assert.equal(renderActive("trajectory"), "trajectory");
  assert.equal(renderActive("workbench-test"), "test");

  dynamic();
  assert.deepEqual(core.entriesOfSlot("conversation.view").map((entry) => entry.options.id), ["chat", "trajectory"]);
  chat();
  trajectory();
  nativeSessionDisposer();
  nativeRootDisposer();
});
