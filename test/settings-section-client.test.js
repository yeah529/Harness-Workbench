import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { WorkbenchSettingsSection } from "../src/client/SettingsSection.js";

class FakeNode {
  constructor(ownerDocument, nodeType, nodeName) {
    this.ownerDocument = ownerDocument;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.parentNode = null;
    this.childNodes = [];
  }

  appendChild(child) {
    return this.insertBefore(child, null);
  }

  insertBefore(child, before) {
    if (child.parentNode) child.parentNode.removeChild(child);
    const index = before == null ? this.childNodes.length : this.childNodes.indexOf(before);
    this.childNodes.splice(index < 0 ? this.childNodes.length : index, 0, child);
    child.parentNode = this;
    return child;
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index >= 0) this.childNodes.splice(index, 1);
    child.parentNode = null;
    return child;
  }

  addEventListener() {}
  removeEventListener() {}
  contains(node) { return node === this || this.childNodes.some((child) => child.contains?.(node)); }

  get textContent() {
    return this.nodeType === 3 || this.nodeType === 8
      ? this.nodeValue
      : this.childNodes.map((child) => child.textContent).join("");
  }

  set textContent(value) {
    this.childNodes = [];
    if (value !== "") this.appendChild(new FakeNode(this.ownerDocument, 3, "#text")).nodeValue = String(value);
  }
}

class FakeElement extends FakeNode {
  constructor(ownerDocument, tagName) {
    super(ownerDocument, 1, tagName.toUpperCase());
    this.tagName = tagName.toUpperCase();
    this.namespaceURI = "http://www.w3.org/1999/xhtml";
    this.attributes = new Map();
    this.style = { setProperty: (key, value) => { this.style[key] = value; }, removeProperty: (key) => { delete this.style[key]; } };
    if (tagName.toLowerCase() === "select") this.options = [];
  }

  appendChild(child) {
    const result = super.appendChild(child);
    if (this.options && child.tagName === "OPTION") this.options.push(child);
    return result;
  }

  removeChild(child) {
    const result = super.removeChild(child);
    if (this.options) {
      const index = this.options.indexOf(child);
      if (index >= 0) this.options.splice(index, 1);
    }
    return result;
  }

  setAttribute(name, value) { this.attributes.set(name, String(value)); this[name] = String(value); }
  removeAttribute(name) { this.attributes.delete(name); delete this[name]; }
  contains(node) { return super.contains(node); }
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

function installFakeDom() {
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

test("WorkbenchSettingsSection rerenders settings after one store notification", async () => {
  const document = installFakeDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  let snapshot = { settings: { network: { currentEffective: { mode: "direct" }, nextLaunch: { mode: "inherit" } } } };
  const listeners = new Set();
  const store = {
    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => snapshot,
    actions: {},
  };
  const container = document.createElement("div");
  const root = createRoot(container);

  await act(async () => {
    root.render(React.createElement(WorkbenchSettingsSection, { store, initialActive: "network" }));
  });
  assert.match(container.textContent, /当前生效：direct/);

  snapshot = { settings: { network: { currentEffective: { mode: "custom" }, nextLaunch: { mode: "custom" } } } };
  await act(async () => { for (const listener of listeners) listener(); });
  assert.match(container.textContent, /当前生效：custom/);
  assert.doesNotMatch(container.textContent, /当前生效：direct/);
  await act(async () => { root.unmount(); });
});

test("archived settings section requests only archived sessions on mount", async () => {
  const document = installFakeDom();
  const { createRoot } = await import("react-dom/client");
  const { act } = React;
  const calls = [];
  const snapshot = {
    settings: {},
    sessionPage: { items: [], total: 0, limit: 20, offset: 0 },
  };
  const store = {
    subscribe: () => () => {},
    getSnapshot: () => snapshot,
    actions: {
      loadSettings: async () => {},
      loadAllSessions: async (input) => { calls.push(input); },
    },
  };
  const container = document.createElement("div");
  const root = createRoot(container);

  await act(async () => {
    root.render(React.createElement(WorkbenchSettingsSection, { store, initialActive: "archive" }));
  });

  assert.deepEqual(calls, [{
    query: "",
    scopeKind: null,
    scopeId: null,
    archived: true,
    offset: 0,
    limit: 20,
  }]);
  assert.match(container.textContent, /归档会话/);
  await act(async () => { root.unmount(); });
});
