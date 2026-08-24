import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  documentProgress,
  KnowledgeCenterPage,
  knowledgeActivityRows,
  knowledgeStateLabel,
} from "../src/client/KnowledgeCenterPage.js";

const kb = {
  id: 7,
  name: "产品知识模块",
  description: "真实产品规范与交互决策",
  updatedAt: "2026-08-24T08:30:00.000Z",
  recentSession: { updatedAt: "2026-08-24T09:00:00.000Z" },
  overview: {
    fileCount: 8,
    readyFileCount: 5,
    chunkCount: 238,
    linkedProjectCount: 1,
    sessionCount: 3,
    indexPercent: 63,
    state: "indexing",
    latestIndexedAt: "2026-08-24T08:00:00.000Z",
  },
  linkedProjects: [{ id: 2, name: "Workbench Core", sessionCount: 6 }],
  recentDocuments: [{ id: 11, originalName: "spec.md", status: "ready", indexedAt: "2026-08-24T08:00:00.000Z" }],
};

function makeStore(overrides = {}) {
  const state = {
    phase: "ready",
    knowledgeBases: [kb],
    projects: [{ id: 2, name: "Workbench Core" }, { id: 3, name: "DSH Research" }],
    documents: [{ id: 11, originalName: "spec.md", mimeType: "text/markdown", size: 1024, status: "ready", indexedAt: "2026-08-24T08:00:00.000Z" }],
    knowledgeChats: [],
    activeKnowledgeBaseId: 7,
    settings: { embedding: { provider: "ollama", model: "qwen3-embedding:0.6b", dimensions: 1024 } },
    action: null,
    error: null,
    ...overrides,
  };
  const actions = new Proxy({}, { get: () => async () => ({ id: 7, sessionId: "session-cpwb-kb" }) });
  return { subscribe: () => () => {}, getSnapshot: () => state, actions };
}

function render(props = {}) {
  return renderToStaticMarkup(React.createElement(KnowledgeCenterPage, {
    store: makeStore(props.state),
    ...props,
  }));
}

test("knowledge board renders the approved chip/backplane hierarchy with only real snapshot data", () => {
  const html = render();
  assert.match(html, /KNOWLEDGE BACKPLANE \/ INTELLIGENCE MODULES/);
  assert.match(html, /知识芯片/);
  assert.match(html, /cpwb-knowledge-board/);
  assert.match(html, /cpwb-knowledge-chip cpwb-selected/);
  assert.match(html, /产品知识模块/);
  assert.match(html, /FILES<\/span><b>5 \/ 8/);
  assert.match(html, /CHUNKS<\/span><b>238/);
  assert.match(html, /LINKS<\/span><b>01/);
  assert.match(html, /INDEXING 63%/);
  assert.match(html, /Workbench Core/);
  assert.match(html, /6 个项目会话/);
  assert.match(html, /使用此芯片新建会话/);
  assert.doesNotMatch(html, /DSH 架构说明/);
});

test("knowledge create screen is full-width and initializes name, description, and multiple files", () => {
  const html = render({ initialMode: "create" });
  assert.match(html, /NEW INTELLIGENCE MODULE/);
  assert.match(html, /初始化知识芯片/);
  assert.match(html, /知识库名称/);
  assert.match(html, /描述（可选）/);
  assert.match(html, /type="file"[^>]+multiple/);
  assert.match(html, /qwen3-embedding:0.6b/);
  assert.match(html, /创建知识库/);
});

test("knowledge detail exposes real files, index progress, project links, open, download, and destructive action", () => {
  const html = render({ initialMode: "detail", initialKnowledgeBaseId: 7 });
  assert.match(html, /文件与向量索引/);
  assert.match(html, /spec.md/);
  assert.match(html, /打开原始文件/);
  assert.match(html, /下载原始文件/);
  assert.match(html, /管理项目连接/);
  assert.match(html, /新建知识库会话/);
  assert.match(html, /删除知识库/);
});

test("empty knowledge board has a deliberate module initialization state", () => {
  const html = render({ state: { knowledgeBases: [], activeKnowledgeBaseId: null, documents: [] } });
  assert.match(html, /尚未接入知识芯片/);
  assert.match(html, /初始化第一个知识库/);
  assert.doesNotMatch(html, /cpwb-knowledge-link-path/);
});

test("knowledge labels and activity are derived from persisted state", () => {
  assert.equal(knowledgeStateLabel(kb.overview), "INDEXING 63%");
  assert.equal(knowledgeStateLabel({ fileCount: 0, state: "empty", indexPercent: 0 }), "EMPTY");
  assert.equal(knowledgeStateLabel({ fileCount: 2, state: "attention", indexPercent: 50 }), "ATTENTION 50%");
  const rows = knowledgeActivityRows(kb);
  assert.deepEqual(rows.map((row) => row.action), ["SESSION", "INDEX", "UPDATE"]);
  assert.equal(rows.some((row) => row.label.includes("spec.md")), false, "activity does not invent per-document events");
});

test("document progress never invents intermediate percentages", () => {
  assert.equal(documentProgress({ status: "ready" }), 100);
  assert.equal(documentProgress({ status: "embedding" }), 0);
  assert.equal(documentProgress({ status: "parsing" }), 0);
  assert.equal(documentProgress({ status: "uploading" }), 0);
  assert.equal(documentProgress({ status: "failed" }), 0);
});
