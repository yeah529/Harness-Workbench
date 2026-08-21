/** Ollama embedding client tests. Generation is routed through DSH directly. */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
  OLLAMA_ERROR_CODES,
  createOllamaClient,
} from "../src/host/ollama.js";
import { createTempDir, removeTempDir } from "./helpers.js";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function routeFetch(routes) {
  return async (url, init) => {
    const pathname = new URL(url).pathname;
    const handler = routes[pathname];
    if (!handler) return jsonResponse({ error: "not found" }, 404);
    return handler({ url, init });
  };
}

test("baseURL defaults to loopback and rejects non-http(s) URLs", () => {
  const client = createOllamaClient({ fetchImpl: async () => jsonResponse({ models: [] }) });
  assert.equal(client.baseURL, "http://127.0.0.1:11434");
  assert.throws(
    () => createOllamaClient({ baseURL: "ftp://host", fetchImpl: async () => {} }),
    (err) => err.code === OLLAMA_ERROR_CODES.INVALID_BASE_URL,
  );
  assert.throws(
    () => createOllamaClient({ baseURL: "not a url", fetchImpl: async () => {} }),
    (err) => err.code === OLLAMA_ERROR_CODES.INVALID_BASE_URL,
  );
});

test("listModels returns local embedding tags and details", async () => {
  const fetchImpl = routeFetch({
    "/api/tags": async () => jsonResponse({
      models: [{ name: EMBEDDING_MODEL, digest: "d2", details: { embedding_length: 1024 } }],
    }),
  });
  const models = await createOllamaClient({ fetchImpl }).listModels();
  assert.deepEqual(models, [{ name: EMBEDDING_MODEL, digest: "d2", details: { embedding_length: 1024 } }]);
});

test("health reports only local embedding availability", async () => {
  const client = createOllamaClient({
    fetchImpl: routeFetch({
      "/api/tags": async () => jsonResponse({ models: [{ name: EMBEDDING_MODEL, details: { embedding_length: 1024 } }] }),
    }),
  });
  const health = await client.health();
  assert.deepEqual(health, {
    reachable: true,
    embedding: { model: EMBEDDING_MODEL, present: true, dimensions: EMBEDDING_DIMENSIONS, usable: true },
  });

  const unavailable = await createOllamaClient({ fetchImpl: async () => { throw new TypeError("ECONNREFUSED"); } }).health();
  assert.equal(unavailable.reachable, false);
  assert.equal(unavailable.embedding.present, false);
});

test("health marks the embedding model unusable when its declared dimension is wrong", async () => {
  const client = createOllamaClient({
    fetchImpl: async () => jsonResponse({ models: [{ name: EMBEDDING_MODEL, details: { embedding_length: 512 } }] }),
  });
  const health = await client.health();
  assert.equal(health.embedding.present, true);
  assert.equal(health.embedding.usable, false);
});

test("embed validates 1024 finite dimensions and forwards the local model", async () => {
  let request;
  const client = createOllamaClient({
    fetchImpl: async (_url, init) => {
      request = JSON.parse(init.body);
      return jsonResponse({ embeddings: [Array.from({ length: 1024 }, (_, i) => i / 1024)] });
    },
  });
  const vectors = await client.embed({ input: ["one"] });
  assert.equal(request.model, EMBEDDING_MODEL);
  assert.deepEqual(request.input, ["one"]);
  assert.equal(vectors[0].length, EMBEDDING_DIMENSIONS);
});

test("embed rejects non-finite or wrong-dimension vectors", async () => {
  const wrongLength = createOllamaClient({ fetchImpl: async () => jsonResponse({ embeddings: [[1, 2]] }) });
  await assert.rejects(() => wrongLength.embed({ input: ["x"] }), (err) => err.code === OLLAMA_ERROR_CODES.INVALID_DIMENSION);

  const nonFinite = createOllamaClient({
    fetchImpl: async () => jsonResponse({ embeddings: [Array.from({ length: 1024 }, () => Number.NaN)] }),
  });
  await assert.rejects(() => nonFinite.embed({ input: ["x"] }), (err) => err.code === OLLAMA_ERROR_CODES.INVALID_DIMENSION);
});

test("embedding transport and HTTP model errors remain explicit", async () => {
  const transport = createOllamaClient({ fetchImpl: async () => { throw new TypeError("ECONNREFUSED"); } });
  await assert.rejects(() => transport.embed({ input: ["x"] }), (err) => err.code === OLLAMA_ERROR_CODES.TRANSPORT);

  const missing = createOllamaClient({ fetchImpl: async () => jsonResponse({ error: "model not found" }, 404) });
  await assert.rejects(() => missing.embed({ input: ["x"] }), (err) => err.code === OLLAMA_ERROR_CODES.MISSING_MODEL);
});

test("host plugin registers its API route without registering a generation adapter", async (t) => {
  const dataDir = await createTempDir();
  let registeredRoute = null;
  let dispose = null;
  const ctx = {
    effect(runner) { dispose = runner(); return dispose; },
    webServer: { register(route) { registeredRoute = route; return function disposeRoute() {}; } },
  };
  t.after(async () => {
    if (dispose) await dispose();
    await removeTempDir(dataDir);
  });
  const mod = await import("../src/host/index.js");
  mod.apply(ctx, { dataDir });
  assert.equal(registeredRoute.kind, "prefix");
  assert.equal(registeredRoute.path, "/api/cpwb");
});
