import { test } from "node:test";
import assert from "node:assert/strict";

import {
  loadPendingModelCatalog,
  submitPendingDraft,
} from "../src/client/pendingSession.js";

test("pending model catalog uses the rc.2 host-scoped LLM directory", async () => {
  const connection = {
    api: { llm: { async models(payload) {
      assert.deepEqual(payload, {});
      return { rpcId: "rpc-models", result: { ok: true, value: {
        groups: [{ id: "deepseek-official", name: "DeepSeek", models: [{ id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", reasoning: { efforts: [{ id: "high", name: "High" }] } }] }],
        failures: [],
      } } };
    } } },
  };
  const catalog = await loadPendingModelCatalog(connection);
  assert.equal(catalog.groups[0].models[0].name, "DeepSeek V4 Flash");
});

test("knowledge-base first submit uses the payload-direct rc.2 model contract before native admission", async () => {
  const order = [];
  let draft = { status: "pristine", sessionId: null, scope: { kind: "knowledge_base", id: 3 } };
  const store = {
    getSnapshot: () => ({ draft }),
    actions: {
      async materializeDraft({ text }) { order.push(["materialize", text]); draft = { ...draft, text, status: "materialized", sessionId: "session-cpwb-new" }; return { sessionId: draft.sessionId }; },
      markDraftAdmitted() { order.push(["admitted"]); draft = { ...draft, status: "admitted" }; },
      markDraftError(error) { order.push(["error", error.message]); },
      async confirmDraft() { order.push(["confirm"]); return { sessionId: draft.sessionId, scope: draft.scope, lifecycleStatus: "active" }; },
    },
  };
  const sessionFace = {};
  const sessions = { binding: () => ({ session: sessionFace }) };
  const connection = { api: { sessions: { async selectModel(payload) {
    assert.deepEqual(payload, {
      sessionId: "session-cpwb-new",
      provider: "deepseek-official",
      model: "deepseek-v4-pro",
      reasoningEffort: "high",
    });
    order.push(["model", payload.provider, payload.model, payload.reasoningEffort]);
    return { rpcId: "rpc-select", result: { ok: true, value: { selected: payload } } };
  } } } };
  const conversation = { async sendSession(session, text, imageIds, mode) {
    order.push(["send", session === sessionFace, text, imageIds, mode]);
    return { kind: "success" };
  } };

  const result = await submitPendingDraft({
    store,
    sessions,
    workspaces: {},
    connection,
    conversation,
    text: "开始实现",
    imageIds: ["image-1"],
    modelSelection: { provider: "deepseek-official", model: "deepseek-v4-pro", reasoningEffort: "high" },
    waitForReady: async () => order.push(["ready"]),
  });

  assert.equal(result.sessionId, "session-cpwb-new");
  assert.deepEqual(order, [
    ["materialize", "开始实现"],
    ["ready"],
    ["model", "deepseek-official", "deepseek-v4-pro", "high"],
    ["send", true, "开始实现", ["image-1"], "queue"],
    ["admitted"],
    ["confirm"],
  ]);
});

test("first submit materializes before uploading File Vault assets and sends their visible references", async () => {
  const order = [];
  const file = { name: "需求 说明.md" };
  let draft = { status: "pristine", sessionId: null, scope: { kind: "project", id: 7 } };
  const store = {
    getSnapshot: () => ({ draft, sessionFilesBySession: {} }),
    actions: {
      async materializeDraft({ text }) { order.push(["materialize", text]); draft = { ...draft, text, status: "materialized", sessionId: "session-cpwb-file" }; return { sessionId: draft.sessionId }; },
      async loadSessionFiles(sessionId) { order.push(["list-files", sessionId]); return []; },
      async uploadSessionFiles(input) { order.push(["upload-files", input.sessionId, input.files]); return [{ id: 4, originalName: file.name, parseStatus: "ready" }]; },
      markDraftAdmitted() { order.push(["admitted"]); draft = { ...draft, status: "admitted" }; },
      markDraftError(error) { order.push(["error", error.message]); },
      async confirmDraft() { order.push(["confirm"]); return { sessionId: draft.sessionId }; },
    },
  };
  const sessionFace = {};
  const result = await submitPendingDraft({
    store,
    sessions: { binding: () => ({ session: sessionFace }) },
    workspaces: {},
    conversation: { async sendSession(session, text) { order.push(["send", session === sessionFace, text]); return { kind: "success" }; } },
    text: "请检查",
    files: [file],
    waitForReady: async () => order.push(["ready"]),
  });
  assert.equal(result.sessionId, "session-cpwb-file");
  assert.deepEqual(order, [
    ["materialize", "请检查"],
    ["list-files", "session-cpwb-file"],
    ["upload-files", "session-cpwb-file", [file]],
    ["ready"],
    ["send", true, "请检查 @文件/需求 说明.md"],
    ["admitted"],
    ["confirm"],
  ]);
});

test("an admitted draft retries confirmation without duplicating the native prompt", async () => {
  const order = [];
  const draft = { status: "admitted", sessionId: "session-cpwb-new", scope: { kind: "independent", id: null }, text: "已经发送" };
  const store = {
    getSnapshot: () => ({ draft }),
    actions: {
      async confirmDraft() { order.push("confirm"); return { sessionId: draft.sessionId, scope: draft.scope, lifecycleStatus: "active" }; },
      markDraftError(error) { order.push(error.message); },
    },
  };
  const result = await submitPendingDraft({ store, sessions: {}, workspaces: {}, conversation: {}, text: draft.text });
  assert.equal(result.sessionId, draft.sessionId);
  assert.deepEqual(order, ["confirm"]);
});

test("native admission failure keeps the materialized draft retryable and never confirms", async () => {
  const order = [];
  let draft = { status: "pristine", sessionId: null, scope: { kind: "independent", id: null } };
  const store = {
    getSnapshot: () => ({ draft }),
    actions: {
      async materializeDraft({ text }) { draft = { ...draft, text, status: "materialized", sessionId: "session-cpwb-fail" }; return { sessionId: draft.sessionId }; },
      markDraftAdmitted() { order.push("admitted"); },
      markDraftError(error) { order.push(["error", error.message]); },
      async confirmDraft() { order.push("confirm"); },
    },
  };
  const sessions = { binding: () => ({ session: {} }) };
  const conversation = { async sendSession() { return { kind: "error" }; } };
  await assert.rejects(() => submitPendingDraft({
    store, sessions, workspaces: {}, conversation, text: "保留草稿", waitForReady: async () => {},
  }), /DSH 未接受/);
  assert.deepEqual(order, [["error", "DSH 未接受首条消息"]]);
});
