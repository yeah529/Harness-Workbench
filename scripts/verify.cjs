const fs = require("fs");
const path = require("path");
const Module = require("module");
const React = require("react");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

function requireText(source, token, label) {
  if (!source.includes(token)) throw new Error(label + " missing: " + token);
}

function forbid(source, pattern, label) {
  if (pattern.test(source)) throw new Error(label + " contains forbidden " + pattern);
}

function verifySources() {
  const index = read("src/client/index.js");
  const shell = read("src/client/WorkbenchShell.js");
  const session = read("src/client/WorkbenchSessionShell.js");
  const sidebar = read("src/client/WorkbenchSidebar.js");
  const settingsSlot = read("src/client/settingsSlot.js");
  const imageAttachment = read("src/client/ImageAttachmentButton.js");
  const modelIndicator = read("src/client/ModelIndicator.js");
  const subagentDrawer = read("src/client/SubagentDrawer.js");
  const rail = read("src/client/rail.js");
  const theme = read("src/client/theme.css");
  const css = read("src/client/workbench.css");
  const logo = read("src/client/assets/harness-workbench-logo.svg");
  const clientSources = fs.readdirSync(path.join(root, "src/client"))
    .filter((name) => name.endsWith(".js"))
    .map((name) => read("src/client/" + name))
    .join("\n");

  if ((index.match(/slots\.inject\(["']shell\.overlay["']/g) || []).length !== 1) {
    throw new Error("Workbench must register exactly one shell.overlay");
  }
  for (const token of ["cpwb-workbench-shell", "WorkbenchShell", "createNavigationStore", "registerImageAttachmentButton", "registerModelIndicator"]) requireText(index, token, "index.js");
  forbid(index, /cpwb-project-home|cpwb-session-shell|cpwb-home-launcher/, "index.js");
  forbid(index, /slots\.inject\(["'](?:conversation\.session|conversation\.view|details)["']/, "index.js");

  for (const token of ["home", "knowledge", "sessions", "conversation", "cpwb-layout-"]) requireText(shell, token, "WorkbenchShell.js");
  for (const token of ["待办", "定时任务", "关联知识库", "每日总结", "native-details", "DrawerDialog"]) requireText(session, token, "WorkbenchSessionShell.js");
  forbid(session, /renderSlot\([\s\S]*conversation\.view|only\s*:\s*["']chat["']/, "WorkbenchSessionShell.js");

  for (const token of ["新建会话", "首页", "知识库", "最近会话", "查看全部会话", "SidebarBrand"]) requireText(sidebar, token, "WorkbenchSidebar.js");
  requireText(sidebar, "@phosphor-icons/react", "WorkbenchSidebar.js");
  for (const token of ['viewBox="0 0 190 74"', "Harness Workbench", "HARNESS", "WORKBENCH"]) requireText(logo, token, "logo SVG");

  requireText(settingsSlot, 'ctx.slots.inject("settings.section"', "settingsSlot.js");
  forbid(settingsSlot, /children\s*:/, "settingsSlot.js");
  for (const token of ['ctx.slots.inject("conversation.input.left"', 'accept: "image/*"', "dispatchImageFiles"]) requireText(imageAttachment, token, "ImageAttachmentButton.js");
  requireText(modelIndicator, 'ctx.slots.inject("conversation.input.right"', "ModelIndicator.js");
  for (const token of ["createSubagentClient", "ONE-SHOT", "CONTINUABLE", "cpwb-subagent-drawer"]) requireText(subagentDrawer, token, "SubagentDrawer.js");
  for (const token of ["resolveWorkbenchColumns", "computeWorkbenchSeats", "RAIL_STYLE_PROPS", '[data-slot="conversation"]', '[data-slot="details"]']) requireText(rail, token, "rail.js");

  for (const token of ["--cpwb-surface-base", "--cpwb-border-strong", "body:has(.cpwb-app-shell)", "--dsw-alias-bg-base", '[role="dialog"][aria-modal="true"]', "prefers-reduced-motion"]) requireText(theme, token, "theme.css");
  for (const token of ["cpwb-global-sidebar", "cpwb-project-rail", "cpwb-responsive-drawer", "max-width: 899px", "min-width: 900px", "max-width: 1279px", "prefers-reduced-transparency", "focus-visible"]) requireText(css, token, "workbench.css");

  forbid(clientSources, /localStorage/, "client source");
  forbid(clientSources, /setInterval\s*\(/, "client source");
  console.log("static architecture and visual contracts: OK");
}

async function verifyBundle() {
  let captured = null;
  const styles = [];
  const sessionCreates = [];
  let createMode = "project";
  let sessionState = { ids: [], byId: {}, current: undefined, bindingId: undefined, phase: "ready" };
  let workspaceState = { items: [], phase: "ready" };
  globalThis.window = {
    innerWidth: 1280,
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    __ModuleLoader__: { load(module) { captured = module; } },
  };
  globalThis.document = {
    activeElement: null,
    querySelector() { return null; },
    createElement(tagName) {
      return { tagName, dataset: {}, textContent: "", style: {}, setAttribute() {}, removeAttribute() {} };
    },
    head: { appendChild(node) { if (node.tagName === "style") styles.push(node.textContent); } },
  };
  globalThis.fetch = async (url, init = {}) => {
    const pathname = new URL(String(url), "http://dsh.local").pathname;
    if (pathname.endsWith("/chat/sessions") && init.method === "POST") {
      const body = JSON.parse(init.body || "{}");
      sessionCreates.push(body);
      const sessionId = createMode === "project" ? "session-cpwb-project" : "session-cpwb-independent";
      const scope = createMode === "project" ? { kind: "project", scopeId: 1 } : { kind: "independent", scopeId: null };
      sessionState = { ids: [sessionId], byId: { [sessionId]: { sessionId, cwd: "/tmp/workbench", blank: true } }, current: sessionId, bindingId: sessionId, phase: "ready" };
      workspaceState = { items: [{ workspaceId: "ws-test", path: "/tmp/workbench", sessionIds: [sessionId] }], phase: "ready" };
      const value = { sessionId, scope, reused: false };
      return { ok: true, status: 201, json: async () => value, text: async () => JSON.stringify(value) };
    }
    const value = pathname.endsWith("/health")
      ? { ok: true, reachable: true }
      : pathname.endsWith("/settings")
        ? { timezone: "Asia/Shanghai" }
        : pathname.includes("/chat/sessions")
          ? { items: [], total: 0, limit: 8, offset: 0 }
          : [];
    return { ok: true, status: 200, json: async () => value, text: async () => JSON.stringify(value) };
  };

  const filename = path.join(root, "lib/client.js");
  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  compiled._compile(read("lib/client.js"), filename);
  if (!captured || captured.id !== "dsh-cyberpunk-workbench") throw new Error("client bundle did not register the expected module id");

  const exports = captured.factory((specifier) => {
    if (specifier === "react") return React;
    throw new Error("unexpected client external: " + specifier);
  });
  if (typeof exports.apply !== "function" || typeof exports.getStore !== "function") throw new Error("client bundle exports are incomplete");

  const registrations = [];
  const disposers = [];
  const ctx = {
    effect(effect) {
      const dispose = effect();
      if (typeof dispose === "function") disposers.push(dispose);
    },
    layout: {},
    connection: {},
    inputTriggers: { registerSource() { return () => {}; } },
    workspaces: {
      pickDirectory: async () => null,
      create: async () => null,
      list: { getSnapshot: () => workspaceState, subscribe: () => () => {} },
    },
    sessions: {
      open(sessionId) { sessionState = { ...sessionState, current: sessionId, bindingId: sessionId }; },
      list: { getSnapshot: () => sessionState, subscribe: () => () => {} },
    },
    slots: {
      inject(name, callback) {
        const registered = callback();
        return () => registered?.dispose?.();
      },
      register(config, Component) {
        const entry = { config, Component, dispose() {} };
        registrations.push(entry);
        return entry;
      },
    },
  };

  exports.apply(ctx);
  await new Promise((resolve) => setTimeout(resolve, 0));
  if (styles.length !== 2) throw new Error("expected exactly two Workbench stylesheets, got " + styles.length);
  const shell = registrations.filter((entry) => entry.config.name === "shell.overlay");
  const settings = registrations.filter((entry) => entry.config.name === "settings.section");
  const imageAttachment = registrations.filter((entry) => entry.config.name === "conversation.input.left" && entry.config.id === "cpwb-image-attachment-button");
  const modelIndicator = registrations.filter((entry) => entry.config.name === "conversation.input.right" && entry.config.id === "cpwb-model-indicator");
  if (shell.length !== 1 || shell[0].config.id !== "cpwb-workbench-shell") throw new Error("bundle must register one unified Workbench shell");
  if (settings.length !== 1 || settings[0].config.id !== "cpwb-workbench-settings") throw new Error("bundle must contribute one native settings section");
  if (imageAttachment.length !== 1) throw new Error("bundle must add one image picker beside the native rc.2 composer chrome");
  if (modelIndicator.length !== 1) throw new Error("bundle must add one compact model indicator beside the native selector");
  if (registrations.some((entry) => ["conversation.session", "conversation.view", "details"].includes(entry.config.name))) {
    throw new Error("bundle must not claim native conversation or details slots");
  }
  const store = exports.getStore();
  await store.actions.openProjectChat({ projectId: 1 });
  createMode = "independent";
  const shellProps = shell[0].config.inject();
  await shellProps.createSession();
  if (JSON.stringify(sessionCreates.at(-1)) !== "{}") {
    throw new Error("global new-session action must create an unscoped independent session");
  }
  for (const dispose of disposers.reverse()) await dispose();
  console.log("bundle exports, CSS injection, and Slot composition: OK");
}

async function main() {
  verifySources();
  await verifyBundle();
  console.log("=== VERIFY OK ===");
}

main().catch((error) => {
  console.error("VERIFY FAILED:", error?.stack || error);
  process.exitCode = 1;
});
