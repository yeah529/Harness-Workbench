/**
 * LanceDB vector lifecycle and document indexing tests.
 *
 * These tests use a real temporary LanceDB (no mocking of the vector store) and
 * a mock Ollama (no network). The vector-index tests build 1024-dimension
 * one-hot unit vectors directly; the indexer tests go through the mock embed
 * so the full parsing -> embedding -> ready pipeline is exercised end to end.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import {
  createVectorIndex,
  createDocumentIndexer,
  VECTOR_ERROR_CODES,
} from "../src/host/vectors.js";
import {
  createRetriever,
  RETRIEVAL_ERROR_CODES,
  buildMatchExpression,
  extractTokens,
  truncateToken,
  rrfScore,
} from "../src/host/retrieval.js";
import { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "../src/host/ollama.js";
import { PARSER_VERSION } from "../src/host/parse.js";
import { CHUNK_RULE_VERSION } from "../src/host/chunk.js";
import { createTempDir, removeTempDir } from "./helpers.js";

const DIM = 1024;

/** Deterministic one-hot unit vector: 1.0 at index, 0 elsewhere. */
function unit(dim, index) {
  const v = new Array(dim).fill(0);
  v[index % dim] = 1;
  return v;
}

/** Deterministic embedding of a text into a unit vector. */
function embedText(text, dim) {
  let h = 0;
  for (const ch of String(text)) {
    h = (h * 31 + ch.codePointAt(0)) >>> 0;
  }
  return unit(dim, h);
}

/** Mock Ollama client: deterministic embeddings, no network. */
function makeMockOllama({ digest = "sha256:mock-embedding-v1", dimensions = DIM } = {}) {
  return {
    async listModels() {
      return [{ name: EMBEDDING_MODEL, digest, details: { embedding_length: dimensions } }];
    },
    async embed({ input }) {
      const texts = Array.isArray(input) ? input : [input];
      return texts.map((text) => embedText(text, dimensions));
    },
  };
}

function row(chunkId, documentId, index, projectIds = [], knowledgeBaseIds = []) {
  return {
    chunk_id: chunkId,
    document_id: documentId,
    vector: unit(DIM, index),
    project_ids: projectIds,
    knowledge_base_ids: knowledgeBaseIds,
    content_hash: "hash-" + chunkId,
    embedding_model: EMBEDDING_MODEL,
  };
}

test("vector index first write and 1024-dim cosine search", async (t) => {
  const dataDir = await createTempDir();
  const idx = createVectorIndex({ dataDir, dimensions: DIM });
  t.after(async () => {
    await idx.close();
    await removeTempDir(dataDir);
  });

  await idx.initialize();
  const count = await idx.replaceDocument(1, [row(1, 1, 7), row(2, 1, 99)]);
  assert.equal(count, 2);

  const hits = await idx.search({ vector: unit(DIM, 7), limit: 2 });
  assert.equal(hits.length, 2);
  assert.equal(hits[0].chunkId, 1, "nearest chunk is returned first");
  assert.equal(hits[0].documentId, 1);
  assert.equal(hits[0].contentHash, "hash-1");
  assert.ok(hits[0].distance < hits[1].distance, "results are ordered by cosine distance");
});

test("replaceDocument atomically replaces a document's rows", async (t) => {
  const dataDir = await createTempDir();
  const idx = createVectorIndex({ dataDir, dimensions: DIM });
  t.after(async () => {
    await idx.close();
    await removeTempDir(dataDir);
  });

  await idx.replaceDocument(1, [row(1, 1, 0), row(2, 1, 1)]);
  // Replace with a disjoint set: chunk ids 1 and 2 must disappear, 3 and 4 appear.
  await idx.replaceDocument(1, [row(3, 1, 5), row(4, 1, 6)]);

  const hits = await idx.search({ vector: unit(DIM, 0), documentIds: [1], limit: 10 });
  assert.deepEqual(
    hits.map((h) => h.chunkId).sort((a, b) => a - b),
    [3, 4],
    "only the new chunk rows remain",
  );

  // A query that would have hit the old row no longer returns it.
  const oldHits = await idx.search({ vector: unit(DIM, 0), documentIds: [1], limit: 10 });
  assert.ok(oldHits.every((h) => h.chunkId !== 1 && h.chunkId !== 2), "old rows are gone");
});

test("deleteDocument removes every row of a document", async (t) => {
  const dataDir = await createTempDir();
  const idx = createVectorIndex({ dataDir, dimensions: DIM });
  t.after(async () => {
    await idx.close();
    await removeTempDir(dataDir);
  });

  await idx.replaceDocument(1, [row(1, 1, 0), row(2, 1, 1)]);
  await idx.replaceDocument(2, [row(3, 2, 2)]);

  const removed = await idx.deleteDocument(1);
  assert.equal(removed, 2);

  const hits1 = await idx.search({ vector: unit(DIM, 0), documentIds: [1], limit: 10 });
  assert.equal(hits1.length, 0, "document 1 rows are gone");
  const hits2 = await idx.search({ vector: unit(DIM, 2), documentIds: [2], limit: 10 });
  assert.equal(hits2.length, 1, "document 2 rows remain");
});

test("scope documentIds filter is applied before topK", async (t) => {
  const dataDir = await createTempDir();
  const idx = createVectorIndex({ dataDir, dimensions: DIM });
  t.after(async () => {
    await idx.close();
    await removeTempDir(dataDir);
  });

  // Document 1 is globally nearest to the query; document 2 is farther.
  await idx.replaceDocument(1, [row(1, 1, 0)]);
  await idx.replaceDocument(2, [row(2, 2, 1)]);

  const query = unit(DIM, 0);
  const global = await idx.search({ vector: query, limit: 2 });
  assert.equal(global[0].documentId, 1, "document 1 is globally nearest");

  // With limit 1 and scope restricted to document 2, document 2 must be
  // returned. A post-filter implementation would take the global top-1
  // (document 1) and then filter it out, yielding zero results.
  const scoped = await idx.search({ vector: query, documentIds: [2], limit: 1 });
  assert.equal(scoped.length, 1, "filter runs before topK, not after");
  assert.equal(scoped[0].documentId, 2, "only the in-scope document is returned");
});

test("dimension errors are rejected for both query and stored vectors", async (t) => {
  const dataDir = await createTempDir();
  const idx = createVectorIndex({ dataDir, dimensions: DIM });
  t.after(async () => {
    await idx.close();
    await removeTempDir(dataDir);
  });

  await assert.rejects(
    () => idx.search({ vector: unit(4, 0), limit: 1 }),
    (err) => err && err.code === VECTOR_ERROR_CODES.INVALID_VECTOR,
  );

  await assert.rejects(
    () => idx.replaceDocument(1, [{
      chunk_id: 1,
      document_id: 1,
      vector: [1, 2, 3],
      project_ids: [],
      knowledge_base_ids: [],
      content_hash: "h",
      embedding_model: EMBEDDING_MODEL,
    }]),
    (err) => err && err.code === VECTOR_ERROR_CODES.INVALID_VECTOR,
  );

  // A non-finite value is rejected too.
  await assert.rejects(
    () => idx.replaceDocument(1, [{
      chunk_id: 1,
      document_id: 1,
      vector: unit(DIM, 0).map((v, i) => (i === 0 ? Infinity : v)),
      project_ids: [],
      knowledge_base_ids: [],
      content_hash: "h",
      embedding_model: EMBEDDING_MODEL,
    }]),
    (err) => err && err.code === VECTOR_ERROR_CODES.INVALID_VECTOR,
  );
});

test("a failed vector write leaves the previous rows fully intact", async (t) => {
  const dataDir = await createTempDir();

  const seed = createVectorIndex({ dataDir, dimensions: DIM });
  await seed.replaceDocument(1, [row(1, 1, 0), row(2, 1, 1)]);
  await seed.close();

  // Reopen with an injected write seam that throws before committing anything,
  // simulating the add step failing during a delete+add replacement.
  const failing = createVectorIndex({
    dataDir,
    dimensions: DIM,
    writeRows: async () => {
      throw new Error("simulated add failure");
    },
  });
  await assert.rejects(
    () => failing.replaceDocument(1, [row(9, 1, 9)]),
    (err) => err && err.code === VECTOR_ERROR_CODES.WRITE_FAILED && /simulated add failure/.test(err.message),
  );
  await failing.close();

  const verify = createVectorIndex({ dataDir, dimensions: DIM });
  const hits = await verify.search({ vector: unit(DIM, 0), documentIds: [1], limit: 10 });
  assert.deepEqual(
    hits.map((h) => h.chunkId).sort((a, b) => a - b),
    [1, 2],
    "old rows remain complete after a failed replace",
  );
  await verify.close();

  await removeTempDir(dataDir);
});

test("indexer drives a document to ready with persisted chunks, metadata, and vectors", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const ollama = makeMockOllama();
  const vectorIndex = createVectorIndex({ dataDir, dimensions: DIM });
  const indexer = createDocumentIndexer({ repos, vectorIndex, ollama, dimensions: DIM });
  t.after(async () => {
    await vectorIndex.close();
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const doc = repos.documents.upsertBySha256({
    sha256: "e".repeat(64),
    originalName: "guide.md",
    mimeType: "text/markdown",
    size: 3,
  });

  const chunks = [
    { ordinal: 0, text: "chapter one body", locator: "lines:1-2", heading: "Chapter One", originalName: "guide.md", contentHash: "c1" },
    { ordinal: 1, text: "chapter two body", locator: "lines:3-4", heading: null, originalName: "guide.md", contentHash: "c2" },
  ];

  const result = await indexer.indexDocument({
    documentId: doc.id,
    chunks,
    projectIds: [10],
    knowledgeBaseIds: [20],
  });
  assert.equal(result.ok, true);
  assert.equal(result.chunkCount, 2);

  const stored = repos.documents.get(doc.id);
  assert.equal(stored.status, "ready");
  assert.ok(stored.indexedAt, "indexed_at is set on success");

  const persisted = repos.chunks.listByDocument(doc.id);
  assert.equal(persisted.length, 2);
  assert.deepEqual(persisted.map((c) => c.heading), ["Chapter One", null], "heading survives indexing");
  assert.deepEqual(persisted.map((c) => c.originalName), ["guide.md", "guide.md"], "original name survives indexing");

  const meta = repos.documentIndexMetadata.get(doc.id);
  assert.equal(meta.embeddingModel, EMBEDDING_MODEL);
  assert.equal(meta.embeddingDigest, "sha256:mock-embedding-v1");
  assert.equal(meta.dimensions, DIM);
  assert.equal(meta.parserVersion, PARSER_VERSION);
  assert.equal(meta.chunkerVersion, CHUNK_RULE_VERSION);

  const hits = await vectorIndex.search({
    vector: embedText("chapter one body", DIM),
    documentIds: [doc.id],
    limit: 10,
  });
  assert.equal(hits.length, 2);
  assert.ok(hits.every((h) => h.documentId === doc.id));
});

test("indexer marks failed with the embedding phase when embedding fails", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const vectorIndex = createVectorIndex({ dataDir, dimensions: DIM });
  const ollama = {
    async listModels() { return [{ name: EMBEDDING_MODEL, digest: "sha256:mock" }]; },
    async embed() { throw new Error("local embedding unavailable"); },
  };
  const indexer = createDocumentIndexer({ repos, vectorIndex, ollama, dimensions: DIM });
  t.after(async () => {
    await vectorIndex.close();
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const doc = repos.documents.upsertBySha256({
    sha256: "f".repeat(64),
    originalName: "a.md",
    mimeType: "text/markdown",
    size: 1,
  });

  const result = await indexer.indexDocument({
    documentId: doc.id,
    chunks: [{ ordinal: 0, text: "body", locator: "line:1", heading: null, originalName: "a.md", contentHash: "c1" }],
  });
  assert.equal(result.ok, false);
  assert.equal(result.phase, "embedding");

  const stored = repos.documents.get(doc.id);
  assert.equal(stored.status, "failed");
  assert.match(stored.error, /embedding/);
  assert.match(stored.error, /local embedding unavailable/);
  assert.equal(repos.chunks.listByDocument(doc.id).length, 0, "no chunks persist after an embedding failure");
});

test("indexer marks failed with the vector phase when the vector write fails", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const ollama = makeMockOllama();
  const vectorIndex = createVectorIndex({
    dataDir,
    dimensions: DIM,
    writeRows: async () => { throw new Error("disk full"); },
  });
  const indexer = createDocumentIndexer({ repos, vectorIndex, ollama, dimensions: DIM });
  t.after(async () => {
    await vectorIndex.close();
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const doc = repos.documents.upsertBySha256({
    sha256: "aa".repeat(32),
    originalName: "b.md",
    mimeType: "text/markdown",
    size: 1,
  });

  const result = await indexer.indexDocument({
    documentId: doc.id,
    chunks: [{ ordinal: 0, text: "body", locator: "line:1", heading: null, originalName: "b.md", contentHash: "c1" }],
  });
  assert.equal(result.ok, false);
  assert.equal(result.phase, "vector");

  const stored = repos.documents.get(doc.id);
  assert.equal(stored.status, "failed", "a half-written document is never ready");
  assert.match(stored.error, /vector/);
  assert.match(stored.error, /disk full/);
});

test("reconcileStale marks ready documents stale only on a real mismatch", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const ollama = makeMockOllama({ digest: "sha256:v1" });
  const vectorIndex = createVectorIndex({ dataDir, dimensions: DIM });
  const indexer = createDocumentIndexer({ repos, vectorIndex, ollama, dimensions: DIM });
  t.after(async () => {
    await vectorIndex.close();
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const doc = repos.documents.upsertBySha256({
    sha256: "bb".repeat(32),
    originalName: "c.md",
    mimeType: "text/markdown",
    size: 1,
  });
  await indexer.indexDocument({
    documentId: doc.id,
    chunks: [{ ordinal: 0, text: "body", locator: "line:1", heading: null, originalName: "c.md", contentHash: "c1" }],
  });
  assert.equal(repos.documents.get(doc.id).status, "ready");

  // Same digest: nothing to mark.
  const same = await indexer.reconcileStale({ embeddingDigest: "sha256:v1" });
  assert.equal(same.marked, 0);
  assert.equal(repos.documents.get(doc.id).status, "ready");

  // Changed model digest: the ready document becomes stale.
  const changed = await indexer.reconcileStale({ embeddingDigest: "sha256:v2" });
  assert.equal(changed.marked, 1);
  assert.deepEqual(changed.documentIds, [doc.id]);
  assert.equal(repos.documents.get(doc.id).status, "stale");
});

test("listMismatch flags model, dimensions, parser, and chunker differences", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const doc = repos.documents.upsertBySha256({
    sha256: "cc".repeat(32),
    originalName: "d.md",
    mimeType: "text/markdown",
    size: 1,
  });
  repos.documents.updateIndexState(doc.id, { status: "ready", indexedAt: "2026-08-17T00:00:00.000Z" });
  repos.documentIndexMetadata.upsert({
    documentId: doc.id,
    embeddingModel: EMBEDDING_MODEL,
    embeddingDigest: "sha256:d",
    dimensions: 1024,
    parserVersion: "1",
    chunkerVersion: "1",
    now: "2026-08-17T00:00:00.000Z",
  });

  const current = {
    embeddingModel: EMBEDDING_MODEL,
    embeddingDigest: "sha256:d",
    dimensions: 1024,
    parserVersion: PARSER_VERSION,
    chunkerVersion: CHUNK_RULE_VERSION,
  };

  assert.equal(repos.documentIndexMetadata.listMismatch(current).length, 0, "matching metadata is not a mismatch");

  for (const [key, value] of [
    ["embeddingModel", "other-model"],
    ["embeddingDigest", "sha256:other"],
    ["dimensions", 768],
    ["parserVersion", "2"],
    ["chunkerVersion", "2"],
  ]) {
    const mismatch = repos.documentIndexMetadata.listMismatch({ ...current, [key]: value });
    assert.equal(mismatch.length, 1, key + " mismatch must be detected");
    assert.equal(mismatch[0].documentId, doc.id);
  }
});

// ---------------------------------------------------------------------------
// Retriever tests (scoped hybrid retrieval): real temp SQLite + LanceDB,
// mock Ollama, no network.
// ---------------------------------------------------------------------------

/** Mock Ollama whose embed always returns the same query vector (no network). */
function makeFixedOllama(queryVector, digest = "sha256:mock-embedding-v1") {
  return {
    async listModels() {
      return [{ name: EMBEDDING_MODEL, digest, details: { embedding_length: DIM } }];
    },
    async embed({ input }) {
      const texts = Array.isArray(input) ? input : [input];
      return texts.map(() => queryVector.slice());
    },
  };
}

/** Unit vector whose cosine similarity to unit(dim, 0) is exactly "sim". */
function vectorWithSimilarity(dim, sim) {
  const v = new Array(dim).fill(0);
  v[0] = sim;
  v[1] = Math.sqrt(Math.max(0, 1 - sim * sim));
  return v;
}

/** Minimal chunk object for direct seeding. */
function mkChunk(ordinal, text, opts = {}) {
  return {
    ordinal,
    text,
    locator: opts.locator ?? "lines:" + (ordinal + 1) + "-" + (ordinal + 1),
    heading: opts.heading ?? null,
    originalName: opts.originalName ?? "doc.md",
    contentHash: opts.contentHash ?? "hash-" + ordinal,
  };
}

/**
 * Seed one document directly (chunks + metadata + vectors + status) without
 * going through the indexer, so tests control exact vectors and statuses.
 */
async function seedDocument({
  repos,
  vectorIndex,
  sha256,
  originalName,
  chunks,
  vectors,
  status = "ready",
  projectIds = [],
  knowledgeBaseIds = [],
}) {
  const doc = repos.documents.upsertBySha256({
    sha256,
    originalName,
    mimeType: "text/plain",
    size: 1,
  });
  const inserted = repos.documents.applyIndexedChunks({
    documentId: doc.id,
    chunks,
    metadata: {
      embeddingModel: EMBEDDING_MODEL,
      embeddingDigest: "sha256:mock-embedding-v1",
      dimensions: DIM,
      parserVersion: PARSER_VERSION,
      chunkerVersion: CHUNK_RULE_VERSION,
    },
  });
  await vectorIndex.replaceDocument(doc.id, inserted.map((c, i) => ({
    chunk_id: c.id,
    document_id: doc.id,
    vector: vectors[i],
    project_ids: projectIds,
    knowledge_base_ids: knowledgeBaseIds,
    content_hash: c.contentHash,
    embedding_model: EMBEDDING_MODEL,
  })));
  repos.documents.updateIndexState(doc.id, {
    status,
    indexedAt: status === "ready" ? new Date().toISOString() : null,
  });
  return { doc: repos.documents.get(doc.id), chunks: inserted };
}

/** Spin up a full retriever harness over a throwaway temp directory. */
async function makeHarness(ollama) {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const vectorIndex = createVectorIndex({ dataDir, dimensions: DIM });
  await vectorIndex.initialize();
  const retriever = createRetriever({ repos, vectorIndex, ollama, embeddingModel: EMBEDDING_MODEL });
  return {
    dataDir,
    db,
    repos,
    vectorIndex,
    retriever,
    async dispose() {
      await vectorIndex.close();
      closeDatabase(db);
      await removeTempDir(dataDir);
    },
  };
}

test("retriever isolates project scope and expands knowledgeBase scope from live SQLite", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;

  const A = repos.projects.create({ name: "A" });
  const B = repos.projects.create({ name: "B" });
  const C = repos.projects.create({ name: "C" });
  const K = repos.knowledgeBases.create({ name: "K" });
  repos.projectKnowledgeBases.link({ projectId: A.id, knowledgeBaseId: K.id });
  repos.projectKnowledgeBases.link({ projectId: B.id, knowledgeBaseId: K.id });

  // Chunk vectors are orthogonal to the query vector, so FTS is the signal.
  async function seedDoc(sha, name, links) {
    const { doc } = await seedDocument({
      repos,
      vectorIndex,
      sha256: sha,
      originalName: name,
      chunks: [mkChunk(0, "shared needle " + name)],
      vectors: [unit(DIM, 1)],
    });
    for (const link of links) {
      repos.documents.link({ documentId: doc.id, scope: link.scope, scopeId: link.id });
    }
    return doc;
  }

  const aDirect = await seedDoc("a".repeat(64), "a.md", [{ scope: "project", id: A.id }]);
  const bDirect = await seedDoc("b".repeat(64), "b.md", [{ scope: "project", id: B.id }]);
  const kShared = await seedDoc("c".repeat(64), "k.md", [{ scope: "knowledgeBase", id: K.id }]);
  const cDirect = await seedDoc("d".repeat(64), "c.md", [{ scope: "project", id: C.id }]);

  const aRes = await h.retriever.search({ query: "needle", scope: "project", scopeId: A.id });
  const aDocs = new Set(aRes.map((r) => r.documentId));
  assert.ok(aDocs.has(aDirect.id), "project A sees its own direct file");
  assert.ok(aDocs.has(kShared.id), "project A sees the linked KB file");
  assert.ok(!aDocs.has(bDirect.id), "project A never sees project B's direct file");
  assert.ok(!aDocs.has(cDirect.id), "project A never sees unlinked project C");

  const kRes = await h.retriever.search({ query: "needle", scope: "knowledgeBase", scopeId: K.id });
  const kDocs = new Set(kRes.map((r) => r.documentId));
  assert.ok(kDocs.has(kShared.id), "KB sees its own direct file");
  assert.ok(kDocs.has(aDirect.id), "KB sees linked project A's direct file");
  assert.ok(kDocs.has(bDirect.id), "KB sees linked project B's direct file");
  assert.ok(!kDocs.has(cDirect.id), "KB never sees unlinked project C's file");

  const cRes = await h.retriever.search({ query: "needle", scope: "project", scopeId: C.id });
  assert.deepEqual(
    [...new Set(cRes.map((r) => r.documentId))].sort((x, y) => x - y),
    [cDirect.id],
    "project C sees only its own direct file",
  );
});

test("failed, stale, and parsing documents are invisible despite live chunks and vectors", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  async function seed(sha, name, status) {
    const { doc } = await seedDocument({
      repos,
      vectorIndex,
      sha256: sha,
      originalName: name,
      chunks: [mkChunk(0, "visible needle " + name)],
      vectors: [unit(DIM, 1)],
      status,
    });
    repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });
    return doc;
  }

  const failed = await seed("a".repeat(64), "failed.md", "failed");
  const stale = await seed("b".repeat(64), "stale.md", "stale");
  const parsing = await seed("c".repeat(64), "parsing.md", "parsing");
  const ready = await seed("d".repeat(64), "ready.md", "ready");

  // Sanity: the non-ready documents still have chunks, FTS rows, and vectors.
  assert.equal(repos.chunks.listByDocument(failed.id).length, 1);
  assert.equal((await vectorIndex.search({ vector: unit(DIM, 1), documentIds: [failed.id], limit: 5 })).length, 1);

  const res = await h.retriever.search({ query: "needle", scope: "project", scopeId: P.id });
  const docs = new Set(res.map((r) => r.documentId));
  assert.ok(docs.has(ready.id), "ready document is visible");
  assert.ok(!docs.has(failed.id), "failed document is hidden");
  assert.ok(!docs.has(stale.id), "stale document is hidden");
  assert.ok(!docs.has(parsing.id), "parsing document is hidden");
});

test("scope resolves live from SQLite associations, not the vector snapshot", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const A = repos.projects.create({ name: "A" });
  const K = repos.knowledgeBases.create({ name: "K" });

  // Vector rows carry knowledge_base_ids=[K] and project_ids=[] on purpose.
  const { doc } = await seedDocument({
    repos,
    vectorIndex,
    sha256: "a".repeat(64),
    originalName: "k.md",
    chunks: [mkChunk(0, "shared needle k")],
    vectors: [unit(DIM, 1)],
    projectIds: [],
    knowledgeBaseIds: [K.id],
  });
  repos.documents.link({ documentId: doc.id, scope: "knowledgeBase", scopeId: K.id });

  let res = await h.retriever.search({ query: "needle", scope: "project", scopeId: A.id });
  assert.deepEqual(res.map((r) => r.documentId), [], "unlinked project A sees nothing");

  repos.projectKnowledgeBases.link({ projectId: A.id, knowledgeBaseId: K.id });
  res = await h.retriever.search({ query: "needle", scope: "project", scopeId: A.id });
  assert.ok(res.some((r) => r.documentId === doc.id), "linking A<->K exposes it via SQLite only");

  repos.projectKnowledgeBases.unlink({ projectId: A.id, knowledgeBaseId: K.id });
  res = await h.retriever.search({ query: "needle", scope: "project", scopeId: A.id });
  assert.deepEqual(res.map((r) => r.documentId), [], "unlinking hides it again");
});

test("vector semantic hit returns keywordMatched=false with cosine similarity", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  // Text shares no token with the query; only the vector matches.
  const { doc } = await seedDocument({
    repos,
    vectorIndex,
    sha256: "a".repeat(64),
    originalName: "sem.md",
    chunks: [mkChunk(0, "unrelated prose about widgets")],
    vectors: [unit(DIM, 0)],
  });
  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });

  const res = await h.retriever.search({ query: "completely different query", scope: "project", scopeId: P.id });
  assert.equal(res.length, 1);
  assert.equal(res[0].documentId, doc.id);
  assert.equal(res[0].keywordMatched, false, "pure vector hit is not keywordMatched");
  assert.ok(res[0].vectorSimilarity != null);
  assert.ok(Math.abs(res[0].vectorSimilarity - 1) < 1e-4, "cosine similarity is ~1.0");
});

test("vector similarity threshold: below 0.35 discarded, above kept", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  async function seed(sha, text, vector) {
    const { doc } = await seedDocument({
      repos,
      vectorIndex,
      sha256: sha,
      originalName: "v.md",
      chunks: [mkChunk(0, text)],
      vectors: [vector],
    });
    repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });
    return doc;
  }

  const low = await seed("a".repeat(64), "wordone", vectorWithSimilarity(DIM, 0.3));
  const high = await seed("b".repeat(64), "wordtwo", vectorWithSimilarity(DIM, 0.5));

  const res = await h.retriever.search({ query: "queryxyz", scope: "project", scopeId: P.id });
  const docs = new Set(res.map((r) => r.documentId));
  assert.ok(docs.has(high.id), "0.5 similarity is kept");
  assert.ok(!docs.has(low.id), "0.3 similarity is discarded");
});

test("FTS matches Chinese text, filename, heading, locator, and code symbols", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  async function seed(sha, name, text, heading, locator) {
    const { doc } = await seedDocument({
      repos,
      vectorIndex,
      sha256: sha,
      originalName: name,
      chunks: [mkChunk(0, text, { heading, locator, originalName: name })],
      vectors: [unit(DIM, 1)],
    });
    repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });
    return doc;
  }

  // No artificial spaces: the trigram tokenizer must find the 4-code-point
  // substring "神经网络" inside the unspaced CJK body.
  const zh = await seed("a".repeat(64), "guide.md", "深度学习神经网络入门教程", "第一章", "lines:1-2");
  const code = await seed("b".repeat(64), "app.js", "function compute_score(input) { return input * 2; }", null, "lines:10-12");
  const fn = await seed("c".repeat(64), "report.md", "the quarterly results are in", "Quarterly Review", "lines:3-4");
  const loc = await seed("d".repeat(64), "sheet.md", "just some body text", "Overview", "section-7-appendix");
  // Unspaced CJK in the filename and heading columns (the text carries no match).
  const zhFile = await seed("e".repeat(64), "神经网络教程.md", "完全无关的正文内容", null, "lines:1-1");
  const zhHeading = await seed("f".repeat(64), "plain.md", "完全无关的正文内容", "神经网络入门", "lines:1-1");

  let res = await h.retriever.search({ query: "神经网络", scope: "project", scopeId: P.id });
  assert.ok(res.some((r) => r.documentId === zh.id), "unspaced Chinese body token hit");
  assert.ok(res.some((r) => r.documentId === zhFile.id), "unspaced Chinese filename hit");
  assert.ok(res.some((r) => r.documentId === zhHeading.id), "unspaced Chinese heading hit");
  assert.ok(res.every((r) => r.keywordMatched), "FTS hit is keywordMatched");

  res = await h.retriever.search({ query: "app.js", scope: "project", scopeId: P.id });
  assert.ok(res.some((r) => r.documentId === code.id), "filename hit");

  res = await h.retriever.search({ query: "Quarterly", scope: "project", scopeId: P.id });
  assert.ok(res.some((r) => r.documentId === fn.id), "heading hit");

  res = await h.retriever.search({ query: "compute_score", scope: "project", scopeId: P.id });
  assert.ok(res.some((r) => r.documentId === code.id), "code symbol hit");

  res = await h.retriever.search({ query: "appendix", scope: "project", scopeId: P.id });
  assert.ok(res.some((r) => r.documentId === loc.id), "locator hit");
});

test("malicious and special MATCH inputs never throw", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });
  await seedDocument({
    repos,
    vectorIndex,
    sha256: "a".repeat(64),
    originalName: "x.md",
    chunks: [mkChunk(0, "hello world needle")],
    vectors: [unit(DIM, 1)],
  }).then(({ doc }) => repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id }));

  const hostile = [
    "hello-world AND (x) NEAR(y) OR NOT",
    "***",
    "\"quoted\" text:col -minus ^caret",
    "(",
    ")",
    "NEAR",
    "OR",
    "AND",
    "*",
    "a\"b",
    "SELECT * FROM users WHERE id = 1",
    "\u4e2d\u6587\uff0c\u6807\u70b9\u7b26\u53f7\uff01",
  ];
  for (const q of hostile) {
    let result;
    await assert.doesNotReject(async () => {
      result = await h.retriever.search({ query: q, scope: "project", scopeId: P.id });
    }, "query must not throw: " + JSON.stringify(q));
    assert.ok(Array.isArray(result), "result is an array for: " + JSON.stringify(q));
  }
});

test("same chunk from both routes is deduped and ranks above single-route chunks", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  async function seed(sha, text, vector) {
    const { doc } = await seedDocument({
      repos,
      vectorIndex,
      sha256: sha,
      originalName: "r.md",
      chunks: [mkChunk(0, text)],
      vectors: [vector],
    });
    repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });
    return doc;
  }

  // CX matches both vector (unit(0)) and FTS ("alpha"); CY matches FTS only.
  const cx = await seed("a".repeat(64), "alpha", unit(DIM, 0));
  const cy = await seed("b".repeat(64), "alpha beta", unit(DIM, 1));

  const res = await h.retriever.search({ query: "alpha", scope: "project", scopeId: P.id });
  assert.equal(res.length, 2);
  assert.equal(res[0].documentId, cx.id, "both-route chunk ranks first");
  assert.equal(res[0].keywordMatched, true);
  assert.ok(res[0].vectorSimilarity != null, "both-route chunk keeps vectorSimilarity");
  assert.equal(res.filter((r) => r.documentId === cx.id).length, 1, "no duplicate for the both-route chunk");

  const cyCitation = res.find((r) => r.documentId === cy.id);
  assert.ok(cyCitation, "single-route chunk is present");
  assert.equal(cyCitation.keywordMatched, true);
  assert.equal(cyCitation.vectorSimilarity, null, "FTS-only chunk has null vectorSimilarity");
});

test("adjacent chunks merge within a document, capped at three, never across documents", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  async function seedDoc(sha, name, texts) {
    const { doc, chunks } = await seedDocument({
      repos,
      vectorIndex,
      sha256: sha,
      originalName: name,
      chunks: texts.map((text, i) => mkChunk(i, text, { originalName: name })),
      vectors: texts.map(() => unit(DIM, 1)),
    });
    repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });
    return { doc, chunks };
  }

  const a = await seedDoc("a".repeat(64), "a.md", ["zebra A0", "zebra A1", "zebra A2", "zebra A3", "zebra A4"]);
  const b = await seedDoc("b".repeat(64), "b.md", ["zebra B0"]);

  const res = await h.retriever.search({ query: "zebra", scope: "project", scopeId: P.id });
  assert.equal(res.length, 3, "5+1 consecutive chunks merge into 3 citations");

  const ordById = new Map();
  for (const c of [...a.chunks, ...b.chunks]) ordById.set(c.id, c.ordinal);

  for (const c of res) {
    assert.ok(c.chunkIds.length <= 3, "merge capped at three consecutive chunks");
    const docIds = new Set([c.documentId]);
    assert.equal(docIds.size, 1, "citation never crosses documents");
    const ords = c.chunkIds.map((id) => ordById.get(id)).sort((x, y) => x - y);
    for (let i = 1; i < ords.length; i += 1) {
      assert.equal(ords[i], ords[i - 1] + 1, "merged chunk ids are consecutive ordinals");
    }
  }

  const aCitations = res.filter((r) => r.documentId === a.doc.id);
  const bCitations = res.filter((r) => r.documentId === b.doc.id);
  assert.equal(aCitations.length, 2, "document A's five chunks split into two groups");
  assert.equal(bCitations.length, 1, "document B's chunk stays alone");
  assert.deepEqual(
    aCitations.flatMap((r) => r.chunkIds).sort((x, y) => x - y),
    a.chunks.map((c) => c.id).sort((x, y) => x - y),
    "all of A's chunks appear exactly once",
  );
});

test("citations carry sourceId, locator, heading, file, and merged locator/text", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  // Two consecutive chunks in one document; both match "needle".
  const { doc, chunks } = await seedDocument({
    repos,
    vectorIndex,
    sha256: "a".repeat(64),
    originalName: "guide.md",
    chunks: [
      mkChunk(0, "the needle is here", { heading: "Chapter One", locator: "lines:1-2", originalName: "guide.md" }),
      mkChunk(1, "needle again below", { heading: "Chapter One", locator: "lines:3-4", originalName: "guide.md" }),
    ],
    vectors: [unit(DIM, 1), unit(DIM, 1)],
  });
  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });

  const res = await h.retriever.search({ query: "needle", scope: "project", scopeId: P.id });
  assert.equal(res.length, 1, "two consecutive chunks merge into one citation");
  const c = res[0];
  assert.equal(c.documentId, doc.id);
  assert.equal(c.sourceId, String(chunks[0].id), "sourceId is the anchor chunk id");
  assert.deepEqual(c.chunkIds, [chunks[0].id, chunks[1].id], "chunkIds in ordinal order");
  assert.equal(c.originalName, "guide.md");
  assert.equal(c.heading, "Chapter One");
  assert.equal(c.locator, "lines:1-2..lines:3-4", "merged locator stays traceable");
  assert.equal(c.text, "the needle is here" + "\n\n" + "needle again below", "text uses a stable separator");
  assert.ok(c.score > 0, "fusion score is present");
  assert.equal(c.keywordMatched, true);
  assert.equal(c.vectorSimilarity, null, "FTS-only citation has null vectorSimilarity");
});

test("limit is honoured and invalid limits throw", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  for (let i = 0; i < 9; i += 1) {
    const { doc } = await seedDocument({
      repos,
      vectorIndex,
      sha256: String(i).repeat(64),
      originalName: "d" + i + ".md",
      chunks: [mkChunk(0, "commonword " + i)],
      vectors: [unit(DIM, 1)],
    });
    repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });
  }

  const full = await h.retriever.search({ query: "commonword", scope: "project", scopeId: P.id });
  assert.equal(full.length, 8, "default limit is 8");

  const three = await h.retriever.search({ query: "commonword", scope: "project", scopeId: P.id, limit: 3 });
  assert.equal(three.length, 3, "explicit limit is honoured");

  await assert.rejects(
    () => h.retriever.search({ query: "commonword", scope: "project", scopeId: P.id, limit: 9 }),
    (err) => err && err.code === RETRIEVAL_ERROR_CODES.INVALID_LIMIT,
  );
  await assert.rejects(
    () => h.retriever.search({ query: "commonword", scope: "project", scopeId: P.id, limit: 0 }),
    (err) => err && err.code === RETRIEVAL_ERROR_CODES.INVALID_LIMIT,
  );
  await assert.rejects(
    () => h.retriever.search({ query: "commonword", scope: "project", scopeId: P.id, limit: 1.5 }),
    (err) => err && err.code === RETRIEVAL_ERROR_CODES.INVALID_LIMIT,
  );
});

test("empty query returns [] and unknown scope / invalid ids throw stable errors", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos } = h;
  const P = repos.projects.create({ name: "P" });

  assert.deepEqual(await h.retriever.search({ query: "", scope: "project", scopeId: P.id }), []);
  assert.deepEqual(await h.retriever.search({ query: "   ", scope: "project", scopeId: P.id }), []);

  await assert.rejects(
    () => h.retriever.search({ query: "x", scope: "folder", scopeId: P.id }),
    (err) => err && err.code === RETRIEVAL_ERROR_CODES.UNKNOWN_SCOPE,
  );
  await assert.rejects(
    () => h.retriever.search({ query: "x", scope: "project", scopeId: 0 }),
    (err) => err && err.code === RETRIEVAL_ERROR_CODES.INVALID_SCOPE_ID,
  );
  await assert.rejects(
    () => h.retriever.search({ query: "x", scope: "project", scopeId: 999999 }),
    (err) => err && err.code === RETRIEVAL_ERROR_CODES.INVALID_SCOPE_ID,
  );
  await assert.rejects(
    () => h.retriever.search({ query: "x", scope: "knowledgeBase", scopeId: 999999 }),
    (err) => err && err.code === RETRIEVAL_ERROR_CODES.INVALID_SCOPE_ID,
  );
});

test("embedding errors propagate from search", async (t) => {
  const failing = {
    async listModels() { return [{ name: EMBEDDING_MODEL, digest: "sha256:x" }]; },
    async embed() { throw new Error("local embedding unavailable"); },
  };
  const h = await makeHarness(failing);
  t.after(h.dispose);
  const P = h.repos.projects.create({ name: "P" });
  const { doc } = await seedDocument({
    repos: h.repos,
    vectorIndex: h.vectorIndex,
    sha256: "a".repeat(64),
    originalName: "x.md",
    chunks: [mkChunk(0, "needle")],
    vectors: [unit(DIM, 1)],
  });
  h.repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });

  await assert.rejects(
    () => h.retriever.search({ query: "needle", scope: "project", scopeId: P.id }),
    /local embedding unavailable/,
  );
});

// ---------------------------------------------------------------------------
// Pure-function unit tests: MATCH expression resource bounds and RRF scoring.
// ---------------------------------------------------------------------------

test("buildMatchExpression dedupes, caps tokens, and bounds token length", () => {
  // No real tokens means "skip FTS".
  assert.equal(buildMatchExpression(""), "");
  assert.equal(buildMatchExpression("   \t\n *** &&& --- "), "");

  // Dedup preserves first-occurrence order.
  assert.equal(
    buildMatchExpression("alpha beta alpha gamma"),
    '"alpha" OR "beta" OR "gamma"',
  );

  // At most 32 distinct tokens, each quoted as a phrase.
  const many = Array.from({ length: 40 }, (_, i) => "tok" + i).join(" ");
  const parts = buildMatchExpression(many).split(" OR ");
  assert.equal(parts.length, 32, "MATCH expression is capped at 32 tokens");
  assert.ok(parts.every((p) => p.startsWith('"') && p.endsWith('"')), "every token is quoted");

  // A token longer than 128 code points is truncated to exactly 128 code points.
  assert.equal(
    buildMatchExpression("x".repeat(200)),
    '"' + "x".repeat(128) + '"',
    "token truncated to 128 code points",
  );

  // Truncation never splits a surrogate pair (U+1F600 is one code point but
  // two UTF-16 code units).
  const astral = String.fromCodePoint(0x1f600).repeat(70);
  const cut = truncateToken(astral, 5);
  assert.equal([...cut].length, 5, "truncation counts code points");
  assert.ok(cut.endsWith(String.fromCodePoint(0x1f600)), "surrogate pair stays intact");

  // Operators are ordinary word characters here, so they are quoted and never
  // interpreted as FTS5 syntax.
  assert.deepEqual(extractTokens("AND OR NOT NEAR"), ["AND", "OR", "NOT", "NEAR"]);
});

test("rrfScore uses standard 1-based ranks", () => {
  assert.equal(rrfScore(1), 1 / 61);
  assert.equal(rrfScore(2), 1 / 62);
  assert.equal(rrfScore(3), 1 / 63);
});

test("RRF fuses with exact 1-based scores; dual-route beats single-route", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  // dual matches both routes: vector rank 1 (similarity 1.0) + FTS rank 1.
  const dual = await seedDocument({
    repos,
    vectorIndex,
    sha256: "a".repeat(64),
    originalName: "dual.md",
    chunks: [mkChunk(0, "needle only here")],
    vectors: [unit(DIM, 0)],
  });
  // vecOnly matches the vector route only, at rank 2 (similarity 0.5).
  const vecOnly = await seedDocument({
    repos,
    vectorIndex,
    sha256: "b".repeat(64),
    originalName: "vec.md",
    chunks: [mkChunk(0, "unrelated prose about widgets")],
    vectors: [vectorWithSimilarity(DIM, 0.5)],
  });
  repos.documents.link({ documentId: dual.doc.id, scope: "project", scopeId: P.id });
  repos.documents.link({ documentId: vecOnly.doc.id, scope: "project", scopeId: P.id });

  const res = await h.retriever.search({ query: "needle", scope: "project", scopeId: P.id });

  const dualCitation = res.find((r) => r.documentId === dual.doc.id);
  const vecCitation = res.find((r) => r.documentId === vecOnly.doc.id);
  assert.ok(dualCitation, "dual-route chunk is present");
  assert.ok(vecCitation, "vector-only chunk is present");
  assert.equal(dualCitation.score, 1 / 61 + 1 / 61, "dual-route score is exactly 2/61 (rank 1 in both routes)");
  assert.equal(vecCitation.score, 1 / 62, "vector-only rank-2 score is exactly 1/62");
  assert.ok(dualCitation.score > vecCitation.score, "dual-route chunk ranks above single-route chunk");
});

test("sub-3-code-point query tokens never throw and rely on the vector route", async (t) => {
  const h = await makeHarness(makeFixedOllama(unit(DIM, 0)));
  t.after(h.dispose);
  const { repos, vectorIndex } = h;
  const P = repos.projects.create({ name: "P" });

  // The stored text holds an unspaced CJK sentence, but each query below is
  // 1-2 code points. The trigram tokenizer emits no trigram for such tokens,
  // so FTS contributes nothing; the orthogonal vector also contributes
  // nothing, and the search cleanly returns [] without throwing.
  const { doc } = await seedDocument({
    repos,
    vectorIndex,
    sha256: "a".repeat(64),
    originalName: "教程.md",
    chunks: [mkChunk(0, "深度学习神经网络入门教程")],
    vectors: [unit(DIM, 1)],
  });
  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: P.id });

  for (const q of ["教程", "入门", "神", "a", "ab"]) {
    const res = await h.retriever.search({ query: q, scope: "project", scopeId: P.id });
    assert.deepEqual(res, [], "short token returns [] without throwing: " + JSON.stringify(q));
  }
});
