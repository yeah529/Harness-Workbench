import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GlobalModal } from "../src/client/globalModal.js";
import { ProjectLinkDialog } from "../src/client/KnowledgeCenterPage.js";

test("global modal uses the browser top layer without bundling ReactDOM", async () => {
  const html = renderToStaticMarkup(React.createElement(GlobalModal, {
    labelledBy: "modal-title",
  }, React.createElement("h2", { id: "modal-title" }, "Modal")));
  assert.match(html, /^<dialog/);
  assert.match(html, /class="cpwb-page-modal-host"/);
  assert.match(html, /aria-labelledby="modal-title"/);
  const source = await readFile(new URL("../src/client/globalModal.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /react-dom|createPortal/);
  assert.match(source, /activateDrawerDialog/);
});

test("todo and schedule dialogs both use the page-level top layer", async () => {
  const [todos, automation] = await Promise.all([
    readFile(new URL("../src/client/Todos.js", import.meta.url), "utf8"),
    readFile(new URL("../src/client/Automation.js", import.meta.url), "utf8"),
  ]);
  for (const source of [todos, automation]) {
    assert.match(source, /GlobalModal/);
    assert.doesNotMatch(source, /className:\s*"cpwb-modal-backdrop"/);
  }
});

test("knowledge project links use the page-level top layer and expose progress or errors", () => {
  const html = renderToStaticMarkup(React.createElement(ProjectLinkDialog, {
    knowledgeBase: {
      id: 7,
      name: "Product KB",
      linkedProjects: [{ id: 2, name: "Workbench" }],
    },
    projects: [{ id: 2, name: "Workbench" }, { id: 3, name: "Research" }],
    busyProjectId: 3,
    error: "关联失败",
    onToggle() {},
    onClose() {},
  }));

  assert.match(html, /^<dialog/);
  assert.match(html, /cpwb-page-modal-host cpwb-knowledge-link-host/);
  assert.match(html, /role="alert"[^>]*>关联失败/);
  assert.match(html, /Research[\s\S]*?SYNCING/);
  assert.match(html, /aria-pressed="true"[\s\S]*?Workbench/);
});
