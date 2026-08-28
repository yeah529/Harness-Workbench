import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { SkillScopeManager } from "../src/client/SkillsManager.js";
import { WorkbenchSessionShell } from "../src/client/WorkbenchSessionShell.js";

class FakeNode {
  constructor(ownerDocument, nodeType, nodeName) {
    this.ownerDocument = ownerDocument;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.parentNode = null;
    this.childNodes = [];
    this.listeners = new Map();
  }
  appendChild(child) { return this.insertBefore(child, null); }
  insertBefore(child, before) {
    if (child.parentNode) child.parentNode.removeChild(child);
    const index = before == null ? this.childNodes.length : this.childNodes.indexOf(before);
    this.childNodes.splice(index < 0 ? this.childNodes.length : index, 0, child);
    child.parentNode = this;
    return child;
  }
  removeChild(child) { const index = this.childNodes.indexOf(child); if (index >= 0) this.childNodes.splice(index, 1); child.parentNode = null; return child; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type, listener) { if (this.listeners.get(type) === listener) this.listeners.delete(type); }
  contains(node) { return node === this || this.childNodes.some((child) => child.contains?.(node)); }
  get textContent() { return this.nodeType === 3 || this.nodeType === 8 ? this.nodeValue : this.childNodes.map((child) => child.textContent).join(""); }
  set textContent(value) { this.childNodes = []; if (value !== "") { const child = new FakeNode(this.ownerDocument, 3, "#text"); child.nodeValue = String(value); this.appendChild(child); } }
}

class FakeElement extends FakeNode {
  constructor(ownerDocument, tagName) {
    super(ownerDocument, 1, tagName.toUpperCase());
    this.tagName = tagName.toUpperCase();
    this.namespaceURI = "http://www.w3.org/1999/xhtml";
    this.attributes = new Map();
    this.style = { setProperty() {}, removeProperty() {} };
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); this[name] = String(value); }
  removeAttribute(name) { this.attributes.delete(name); delete this[name]; }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  focus() { this.ownerDocument.activeElement = this; }
  click() { this.clicked = true; }
  querySelector(selector) {
    return findNodes(this, (node) => node.nodeType === 1 && (
      selector === "button" ? node.tagName === "BUTTON" : selector.includes("button") && node.tagName === "BUTTON"
    ))[0] || null;
  }
}

class FakeDocument extends FakeNode {
  constructor() {
    super(null, 9, "#document");
    this.ownerDocument = this;
    this.defaultView = null;
    this.documentElement = new FakeElement(this, "html");
    this.body = new FakeElement(this, "body");
    this.documentElement.appendChild(this.body);
    this.activeElement = this.body;
  }
  createElement(tagName) { return new FakeElement(this, tagName); }
  createElementNS(_namespace, tagName) { return this.createElement(tagName); }
  createTextNode(value) { const node = new FakeNode(this, 3, "#text"); node.nodeValue = String(value); return node; }
  createComment(value) { const node = new FakeNode(this, 8, "#comment"); node.nodeValue = String(value); return node; }
}

function installDom() {
  const document = new FakeDocument();
  const window = { document, event: undefined, addEventListener() {}, removeEventListener() {}, Node: FakeNode, Element: FakeElement, HTMLElement: FakeElement, HTMLIFrameElement: FakeElement, SVGElement: FakeElement };
  document.defaultView = window;
  globalThis.window = window;
  globalThis.document = document;
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { userAgent: "fake" } });
  globalThis.Node = FakeNode;
  globalThis.HTMLElement = FakeElement;
  globalThis.HTMLIFrameElement = FakeElement;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  return document;
}

function findNodes(node, predicate, out = []) {
  if (predicate(node)) out.push(node);
  for (const child of node.childNodes || []) findNodes(child, predicate, out);
  return out;
}

function invokeProp(target, prop, event) {
  const props = Object.values(target).find((value) => value && typeof value === "object" && typeof value[prop] === "function");
  assert.ok(props, `React ${prop} prop should be installed`);
  return props[prop](event);
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((nextResolve, nextReject) => { resolve = nextResolve; reject = nextReject; });
  return { promise, resolve, reject };
}

function storeFor(catalogs, importSkill) {
  const listeners = new Set();
  const snapshot = { skillCatalogs: catalogs, skillAction: null };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    actions: { loadSkills: async () => {}, importSkill },
  };
}

test("mounted manager ignores a late conflict after switching project scope", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const pending = deferred();
  const calls = [];
  const store = storeFor({ "project:1": { status: "ready", data: { rootPath: "/project-a/.dsh/skills", items: [], diagnostics: [] } } }, (input) => { calls.push(input); return pending.promise; });
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "project", projectId: 1 })); });
  const zip = { name: "same.zip", size: 4, arrayBuffer: async () => new ArrayBuffer(4) };
  const input = findNodes(container, (node) => node.tagName === "INPUT" && node.accept)?.[0];
  assert.ok(input);
  input.files = [zip];
  await act(async () => { await invokeProp(input, "onChange", { currentTarget: input }); });
  assert.equal(calls[0].projectId, 1);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "project", projectId: 2 })); });
  await act(async () => { pending.reject(Object.assign(new Error("conflict"), { code: "SKILL_CONFLICT", details: { existing: { name: "same-skill" }, incoming: { name: "same-skill" } } })); });
  assert.doesNotMatch(container.textContent, /同名 Skill 已存在/);
  assert.equal(calls.length, 1);
  await act(async () => { root.unmount(); });
});

test("mounted manager ignores an older same-scope conflict after a newer import succeeds", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const first = deferred();
  const second = deferred();
  const calls = [];
  const store = storeFor({ global: { status: "ready", data: { rootPath: "/dsh/skills", items: [], diagnostics: [] } } }, (input) => {
    calls.push(input);
    return input.sourceName === "a.zip" ? first.promise : second.promise;
  });
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "global" })); });
  const input = findNodes(container, (node) => node.tagName === "INPUT" && node.accept)?.[0];
  assert.ok(input);
  input.files = [{ name: "a.zip", size: 4 }];
  await act(async () => { void invokeProp(input, "onChange", { currentTarget: input }); });
  input.files = [{ name: "b.zip", size: 4 }];
  await act(async () => { void invokeProp(input, "onChange", { currentTarget: input }); });
  assert.equal(calls.length, 2);
  await act(async () => { second.resolve(); });
  await act(async () => { first.reject(Object.assign(new Error("conflict"), { code: "SKILL_CONFLICT", details: { existing: { name: "same-skill" }, incoming: { name: "same-skill" } } })); });
  assert.doesNotMatch(container.textContent, /同名 Skill 已存在/);
  assert.equal(findNodes(container, (node) => node.tagName === "BUTTON" && node.textContent === "确认替换").length, 0);
  assert.equal(calls.length, 2);
  await act(async () => { root.unmount(); });
});

test("mounted manager retains a failed replacement decision for retry", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const first = deferred();
  const failedReplace = deferred();
  const successfulReplace = deferred();
  const calls = [];
  const store = storeFor({ global: { status: "ready", data: { rootPath: "/dsh/skills", items: [], diagnostics: [] } } }, (input) => {
    calls.push(input);
    if (!input.replace) return first.promise;
    return calls.filter((call) => call.replace).length === 1 ? failedReplace.promise : successfulReplace.promise;
  });
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "global" })); });
  const zip = { name: "same.zip", size: 4 };
  const input = findNodes(container, (node) => node.tagName === "INPUT" && node.accept)?.[0];
  assert.ok(input);
  input.files = [zip];
  await act(async () => { void invokeProp(input, "onChange", { currentTarget: input }); });
  await act(async () => { first.reject(Object.assign(new Error("conflict"), { code: "SKILL_CONFLICT", details: { existing: { name: "same-skill", description: "old" }, incoming: { name: "same-skill", description: "new" } } })); });
  const replaceButton = () => findNodes(container, (node) => node.tagName === "BUTTON" && node.textContent === "确认替换")[0];
  assert.ok(replaceButton());
  await act(async () => { void invokeProp(replaceButton(), "onClick", {}); });
  assert.equal(calls.filter((call) => call.replace).length, 1);
  await act(async () => { failedReplace.reject(Object.assign(new Error("permission denied"), { code: "SKILL_PERMISSION_DENIED" })); });
  assert.match(container.textContent, /同名 Skill 已存在/);
  assert.match(container.textContent, /permission denied/);
  assert.ok(replaceButton());
  assert.equal(calls[1].archive, zip);
  await act(async () => { void invokeProp(replaceButton(), "onClick", {}); });
  assert.equal(calls.filter((call) => call.replace).length, 2);
  await act(async () => { successfulReplace.resolve(); });
  assert.doesNotMatch(container.textContent, /同名 Skill 已存在/);
  assert.equal(findNodes(container, (node) => node.tagName === "BUTTON" && node.textContent === "确认替换").length, 0);
  await act(async () => { root.unmount(); });
});

test("mounted manager resets directory input before stale packing can finish", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const firstRead = deferred();
  const secondRead = deferred();
  const bImport = deferred();
  const calls = [];
  const store = storeFor({ global: { status: "ready", data: { rootPath: "/dsh/skills", items: [], diagnostics: [] } } }, (input) => {
    calls.push(input);
    return input.sourceName === "b.zip" ? bImport.promise : Promise.resolve();
  });
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "global" })); });
  const directoryInput = findNodes(container, (node) => node.tagName === "INPUT" && node.webkitdirectory !== undefined)?.[0];
  const zipInput = findNodes(container, (node) => node.tagName === "INPUT" && node.accept)?.[0];
  assert.ok(directoryInput);
  assert.ok(zipInput);
  const directoryFile = (read) => ({ name: "SKILL.md", size: 1, webkitRelativePath: "same-skill/SKILL.md", arrayBuffer: () => read.promise });

  directoryInput.value = "A";
  directoryInput.files = [directoryFile(firstRead)];
  await act(async () => { void invokeProp(directoryInput, "onChange", { currentTarget: directoryInput }); });
  assert.equal(directoryInput.value, "");

  zipInput.value = "B";
  zipInput.files = [{ name: "b.zip", size: 4 }];
  await act(async () => { void invokeProp(zipInput, "onChange", { currentTarget: zipInput }); });
  assert.equal(zipInput.value, "");

  directoryInput.value = "A-again";
  directoryInput.files = [directoryFile(secondRead)];
  await act(async () => { void invokeProp(directoryInput, "onChange", { currentTarget: directoryInput }); });
  assert.equal(directoryInput.value, "");
  await act(async () => { firstRead.resolve(new ArrayBuffer(1)); });
  assert.equal(calls.filter((call) => call.sourceName === "same-skill").length, 0);
  assert.equal(directoryInput.value, "");
  await act(async () => { secondRead.resolve(new ArrayBuffer(1)); });
  assert.equal(calls.filter((call) => call.sourceName === "same-skill").length, 1);
  await act(async () => { bImport.resolve(); });
  await act(async () => { root.unmount(); });
});

test("mounted manager closes a delete decision before a project switch", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const calls = [];
  const snapshot = {
    skillCatalogs: { "project:1": { status: "ready", data: { rootPath: "/project-a/.dsh/skills", items: [{ name: "same-skill", description: "A", state: "enabled", health: "valid", path: "/project-a/.dsh/skills/same-skill", fileCount: 1 }], diagnostics: [] } } },
    skillAction: null,
  };
  const store = {
    getSnapshot: () => snapshot,
    subscribe: () => () => {},
    actions: { loadSkills: async () => {}, deleteSkill: async (input) => { calls.push(input); } },
  };
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "project", projectId: 1 })); });
  const deleteButton = findNodes(container, (node) => node.tagName === "BUTTON" && String(node["aria-label"] || "").startsWith("删除 "))[0];
  assert.ok(deleteButton);
  await act(async () => { await invokeProp(deleteButton, "onClick", {}); });
  assert.match(container.textContent, /删除 Skill「same-skill」/);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "project", projectId: 2 })); });
  assert.doesNotMatch(container.textContent, /删除 Skill「same-skill」/);
  assert.deepEqual(calls, []);
  await act(async () => { root.unmount(); });
});

test("mounted manager ignores a pending clipboard result after scope switch and unmount", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const pending = deferred();
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { userAgent: "fake", clipboard: { writeText: () => pending.promise } } });
  const snapshot = { skillCatalogs: { global: { status: "ready", data: { rootPath: "/dsh/skills", items: [], diagnostics: [] } } }, skillAction: null };
  const store = { getSnapshot: () => snapshot, subscribe: () => () => {}, actions: { loadSkills: async () => {} } };
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "global" })); });
  const copy = findNodes(container, (node) => node.tagName === "BUTTON" && node["aria-label"] === "复制安装路径")[0];
  assert.ok(copy);
  await act(async () => { void invokeProp(copy, "onClick", {}); });
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "project", projectId: 2 })); });
  await act(async () => { root.unmount(); });
  await act(async () => { pending.resolve(); });
  assert.doesNotMatch(container.textContent, /已复制/);
});

test("compact import menu has stable focus, outside dismissal, and chooser semantics", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const snapshot = { skillCatalogs: { "project:7": { status: "ready", data: { rootPath: "/project/.dsh/skills", items: [], diagnostics: [] } } }, skillAction: null };
  const store = { getSnapshot: () => snapshot, subscribe: () => () => {}, actions: { loadSkills: async () => {} } };
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(React.createElement(SkillScopeManager, { store, scope: "project", projectId: 7, compact: true })); });
  const trigger = findNodes(container, (node) => node.tagName === "BUTTON" && node.getAttribute?.("aria-haspopup") === "menu")[0];
  assert.ok(trigger);
  const triggerId = trigger.getAttribute("id");
  assert.ok(triggerId);
  await act(async () => { await invokeProp(trigger, "onClick", {}); });
  const menu = findNodes(container, (node) => node.getAttribute?.("role") === "menu")[0];
  const options = findNodes(menu, (node) => node.getAttribute?.("role") === "menuitem");
  assert.ok(menu);
  assert.equal(menu.getAttribute("aria-labelledby"), triggerId);
  assert.equal(options.length, 2);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(document.activeElement, options[0]);
  assert.ok(document.listeners.get("keydown"));
  assert.ok(document.listeners.get("pointerdown"));
  await act(async () => {
    document.listeners.get("keydown")({ key: "Escape", preventDefault() {} });
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  assert.equal(document.activeElement, trigger);
  assert.equal(document.listeners.get("keydown"), undefined);
  assert.equal(document.listeners.get("pointerdown"), undefined);

  await act(async () => { await invokeProp(trigger, "onClick", {}); });
  const reopened = findNodes(container, (node) => node.getAttribute?.("role") === "menu")[0];
  await act(async () => { document.listeners.get("pointerdown")({ target: document.body }); });
  assert.equal(findNodes(container, (node) => node.getAttribute?.("role") === "menu").length, 0);
  assert.ok(reopened);

  await act(async () => { await invokeProp(trigger, "onClick", {}); });
  await act(async () => { document.listeners.get("click")({ target: document.body }); });
  assert.equal(findNodes(container, (node) => node.getAttribute?.("role") === "menu").length, 0);

  await act(async () => { await invokeProp(trigger, "onClick", {}); });
  const directoryOption = findNodes(container, (node) => node.getAttribute?.("role") === "menuitem")[0];
  const directoryInput = findNodes(container, (node) => node.tagName === "INPUT" && node.getAttribute?.("webkitdirectory") !== null)[0];
  assert.ok(directoryInput);
  await act(async () => { await invokeProp(directoryOption, "onClick", {}); });
  assert.equal(directoryInput.clicked, true);
  assert.equal(findNodes(container, (node) => node.getAttribute?.("role") === "menu").length, 0);

  await act(async () => { root.unmount(); });
  assert.equal(document.listeners.get("keydown"), undefined);
  assert.equal(document.listeners.get("pointerdown"), undefined);
});

test("mounted project rail tabs activate and move focus with roving keyboard navigation", async () => {
  const document = installDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const state = {
    projects: [{ id: 7, name: "Research" }],
    workbenchSessions: { "session-cpwb-tabs": { sessionId: "session-cpwb-tabs", scope: { kind: "project", id: 7 }, title: "Tabs" } },
    linkedKnowledgeBases: [],
    skillCatalogs: { "project:7": { status: "ready", data: { rootPath: "/project/.dsh/skills", items: [], diagnostics: [] } } },
  };
  const store = { getSnapshot: () => state, subscribe: () => () => {}, actions: { refreshProject: async () => {}, loadSkills: async () => {} } };
  const container = document.createElement("div");
  const root = createRoot(container);
  const sessionsSnapshot = { subagentsByParent: {} };
  const sessions = { list: { getSnapshot: () => sessionsSnapshot, subscribe: () => () => {} } };
  await act(async () => { root.render(React.createElement(WorkbenchSessionShell, { sessionId: "session-cpwb-tabs", open: true, store, sessions, layoutMode: "desktop" })); });
  const tabs = () => findNodes(container, (node) => node.tagName === "BUTTON" && node.getAttribute?.("role") === "tab");
  const first = tabs()[0];
  const second = tabs()[1];
  assert.equal(first.getAttribute("tabindex"), "0");
  assert.equal(second.getAttribute("tabindex"), "-1");
  await act(async () => { invokeProp(first, "onKeyDown", { key: "ArrowRight", preventDefault() {} }); });
  assert.equal(document.activeElement, second);
  assert.equal(second.getAttribute("aria-selected"), "true");
  assert.equal(first.getAttribute("tabindex"), "-1");
  await act(async () => { invokeProp(second, "onKeyDown", { key: "End", preventDefault() {} }); });
  const last = tabs()[4];
  assert.equal(document.activeElement, last);
  assert.equal(last.getAttribute("aria-selected"), "true");
  await act(async () => { invokeProp(last, "onKeyDown", { key: "ArrowRight", preventDefault() {} }); });
  assert.equal(document.activeElement, tabs()[0]);
  await act(async () => { invokeProp(tabs()[0], "onKeyDown", { key: "ArrowLeft", preventDefault() {} }); });
  assert.equal(document.activeElement, tabs()[4]);
  const panel = findNodes(container, (node) => node.getAttribute?.("role") === "tabpanel")[0];
  assert.equal(panel.getAttribute("aria-labelledby"), last.getAttribute("id"));
  await act(async () => { root.unmount(); });
});
