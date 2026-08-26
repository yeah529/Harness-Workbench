import { test } from "node:test";
import assert from "node:assert/strict";

import { createSessionIndexAdapter, extractSessionPairs } from "../src/host/session-index.js";

function user(seq, text, id = "user-" + seq) {
  return { seq, type: "user/message", data: { id, source: { kind: "user" }, content: [{ type: "text", text }] } };
}

function assistant(seq, content) {
  return { seq, type: "assistant/message", data: { message: { content } } };
}

test("extractSessionPairs indexes only completed user and final assistant bodies", () => {
  const events = [
    user(0, "请检查 Files API"),
    { seq: 1, type: "turn/start", data: { turn: 1 } },
    assistant(2, [
      { type: "reasoning", text: "内部推理" },
      { type: "tool-call", id: "call-1", name: "bash", arguments: "{}" },
    ]),
    { seq: 3, type: "tool/result", data: { message: { content: [{ type: "text", text: "工具输出" }] } } },
    assistant(4, [{ type: "text", text: "Files API 已通过范围校验。" }]),
    { seq: 5, type: "turn/end", data: { reason: { kind: "completed" } } },
    user(6, "失败轮次"),
    { seq: 7, type: "turn/start", data: { turn: 2 } },
    assistant(8, [{ type: "text", text: "不应索引" }]),
    { seq: 9, type: "turn/end", data: { reason: { kind: "error" } } },
    user(10, "还没回答"),
  ];

  assert.deepEqual(extractSessionPairs(events).map(({ contentHash, ...pair }) => pair), [{
    ordinal: 0,
    messageId: "user-0",
    user: "请检查 Files API",
    assistant: "Files API 已通过范围校验。",
  }]);
  assert.match(extractSessionPairs(events)[0].contentHash, /^[a-f0-9]{64}$/);
});

test("later complete pairs keep deterministic ordinals and hashes", () => {
  const events = [
    user(1, "第一问"),
    assistant(2, [{ type: "text", text: "第一答" }]),
    { seq: 3, type: "turn/end", data: { reason: { kind: "completed" } } },
    user(4, "第二问"),
    assistant(5, [{ type: "text", text: "第二答" }]),
    { seq: 6, type: "turn/end", data: { reason: { kind: "completed" } } },
  ];
  const first = extractSessionPairs(events);
  const second = extractSessionPairs(events);
  assert.deepEqual(first.map((pair) => pair.ordinal), [0, 1]);
  assert.deepEqual(first.map((pair) => pair.contentHash), second.map((pair) => pair.contentHash));
});

test("session index reuses the configured embedding and vector store", async () => {
  const calls = { replace: [], search: [], remove: [] };
  const events = [
    user(1, "Files API 怎么样"),
    assistant(2, [{ type: "text", text: "范围隔离已经完成" }]),
    { seq: 3, type: "turn/end", data: { reason: { kind: "completed" } } },
  ];
  const adapter = createSessionIndexAdapter({
    sessionQuery: { async readSession(sessionId) { assert.equal(String(sessionId), "session-source"); return { events }; } },
    embedding: { async embed(texts) { return texts.map((_, index) => [index + 1, 0]); }, identity() { return { model: "local-embed" }; } },
    vectorStore: {
      async replaceSession(sessionId, rows) { calls.replace.push({ sessionId, rows }); return rows.length; },
      async searchSession(input) { calls.search.push(input); return [{ sourceSessionId: input.sourceSessionId, text: "命中" }]; },
      async deleteSession(sessionId) { calls.remove.push(sessionId); return 1; },
    },
  });

  assert.equal(await adapter.reindex("session-source"), 1);
  assert.equal(calls.replace[0].rows[0].source_kind, "session");
  assert.equal(calls.replace[0].rows[0].text, "用户：Files API 怎么样\n助手：范围隔离已经完成");
  assert.deepEqual(await adapter.search({ sourceSessionId: "session-source", query: "范围", limit: 3 }), [{
    sourceId: "session:session-source:0",
    sourceKind: "session",
    sessionId: "session-source",
    originalName: "会话：session-source",
    locator: "turn:1",
    heading: null,
    text: "命中",
    vectorSimilarity: null,
    keywordMatched: false,
  }]);
  assert.equal(await adapter.remove("session-source"), 1);
});
