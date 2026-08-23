import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createWorkbenchStore } from "../src/client/store.js";
import { NewSessionDialog } from "../src/client/NewSessionDialog.js";

function sessionApi({ activateError } = {}) {
  const calls = [];
  const api = {
    calls,
    health: async () => ({ ok: true }),
    chat: { sessions: {
      async create(input) {
        calls.push(["create", input]);
        if (activateError) throw activateError;
        return { sessionId: "session-cpwb-new", scope: input.scope, title: "完成接口验收", lifecycleStatus: "active", citations: [] };
      },
      async retry(input) { calls.push(["retry", input]); return { sessionId: input.sessionId, lifecycleStatus: "active", citations: [] }; },
      async open(sessionId) { calls.push(["open", sessionId]); return { sessionId, scope: { kind: "independent", id: null } }; },
      async list() { return { items: [], total: 0, limit: 8, offset: 0 }; },
      async rename(input) { calls.push(["rename", input]); return input; },
      async move(input) { calls.push(["move", input]); return input; },
      async remove(sessionId) { calls.push(["remove", sessionId]); return { deleted: true }; },
      context: {
        async get(sessionId) { calls.push(["context.get", sessionId]); return []; },
        async set(input) { calls.push(["context.set", input]); return [input]; },
        async remove(input) { calls.push(["context.remove", input]); return { removed: true }; },
      },
    } },
  };
  return api;
}

test("store keeps a new session local until the first non-empty prompt", async () => {
  const api = sessionApi();
  const store = createWorkbenchStore(api);
  store.actions.startDraft({
    scope: { kind: "project", id: 3 },
    pinnedSources: [{ kind: "knowledge_base", id: "4" }],
  });
  assert.equal(api.calls.length, 0);
  assert.deepEqual(store.getSnapshot().draft.scope, { kind: "project", id: 3 });
  await assert.rejects(() => store.actions.activateDraft({ text: "   " }), /不能为空/);
  assert.equal(api.calls.length, 0);

  const result = await store.actions.activateDraft({ text: "完成接口验收。继续前端。" });
  assert.equal(result.sessionId, "session-cpwb-new");
  assert.deepEqual(api.calls[0], ["create", {
    scope: { kind: "project", id: 3 },
    question: "完成接口验收。继续前端。",
    pinnedSources: [{ kind: "knowledge_base", id: "4" }],
    oneShotSources: [],
  }]);
  assert.equal(store.getSnapshot().draft, null);
  assert.equal(store.getSnapshot().workbenchSessions[result.sessionId].scope.kind, "project");
});

test("failed activation keeps text and retry reuses the persisted failed session", async () => {
  const failure = Object.assign(new Error("provider failed"), {
    code: "EDRAFT_ACTIVATION_FAILED",
    details: { sessionId: "session-cpwb-failed", lifecycleStatus: "draft_failed", pendingQuestion: "保留正文" },
  });
  const api = sessionApi({ activateError: failure });
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "independent", id: null } });
  await assert.rejects(() => store.actions.activateDraft({ text: "保留正文" }), /provider failed/);
  assert.deepEqual(store.getSnapshot().draft, {
    scope: { kind: "independent", id: null },
    pinnedSources: [],
    text: "保留正文",
    status: "draft_failed",
    sessionId: "session-cpwb-failed",
    error: { code: "EDRAFT_ACTIVATION_FAILED", message: "provider failed" },
  });

  await store.actions.retryDraft({ text: "保留正文" });
  assert.deepEqual(api.calls[1], ["retry", { sessionId: "session-cpwb-failed", question: "保留正文", oneShotSources: [] }]);
  assert.equal(store.getSnapshot().draft, null);
});

test("discarding a pristine local draft performs no request", () => {
  const api = sessionApi();
  const store = createWorkbenchStore(api);
  store.actions.startDraft({ scope: { kind: "knowledge_base", id: 7 } });
  store.actions.discardDraft();
  assert.equal(store.getSnapshot().draft, null);
  assert.equal(api.calls.length, 0);
});

test("new-session dialog exposes one owner choice and inherited-context preview", () => {
  const state = {
    projects: [{ id: 1, name: "DSH Research" }],
    knowledgeBases: [{ id: 2, name: "架构知识库" }],
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state };
  const html = renderToStaticMarkup(React.createElement(NewSessionDialog, {
    open: true,
    store,
    initialScope: { kind: "project", id: 1 },
    onClose() {},
    onStart() {},
  }));
  assert.match(html, /新建会话/);
  assert.match(html, /项目/);
  assert.match(html, /知识库/);
  assert.match(html, /独立会话/);
  assert.match(html, /默认上下文/);
  assert.doesNotMatch(html, /会话标题/);
});
