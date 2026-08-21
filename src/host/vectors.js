/**
 * LanceDB vector lifecycle and document index state.
 *
 * createVectorIndex owns a single LanceDB table under <dataDir>/vectors with the
 * design section 5.2 fields, exposes initialize/replaceDocument/deleteDocument/
 * search/close, and performs atomic per-document replacement through LanceDB's
 * mergeInsert (a single version commit) so a failed write never leaves old and
 * new rows mixed. createDocumentIndexer drives the parsing -> embedding ->
 * ready state machine on top of the SQLite repositories and this vector index,
 * and provides reconcileStale for startup model/rule-mismatch detection.
 */

import { connect } from "@lancedb/lancedb";
import {
  Field,
  FixedSizeList,
  Float32,
  Int32,
  Int64,
  List,
  Schema,
  Utf8,
} from "apache-arrow";
import { join } from "node:path";

import { resolveDataRoot } from "./config.js";
import { CHUNK_RULE_VERSION } from "./chunk.js";
import { PARSER_VERSION } from "./parse.js";
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from "./ollama.js";

/** LanceDB table name inside <dataDir>/vectors. */
export const VECTOR_TABLE_NAME = "chunks";

/** Default embedding dimensionality (matches qwen3-embedding:0.6b). */
export const DEFAULT_VECTOR_DIMENSIONS = 1024;

/** Maximum magnitude storable in a float32 without overflowing to Infinity. */
const FLOAT32_MAX = 3.4028234663852886e38;

/** Int32 upper bound for project/knowledge-base list ids. */
const INT32_MAX = 2147483647;

/** Field-metadata key LanceDB stamps on the unenforced primary key column. */
const PRIMARY_KEY_METADATA_KEY = "lance-schema:unenforced-primary-key:position";

/** Stable error codes surfaced by the vector index. */
export const VECTOR_ERROR_CODES = Object.freeze({
  INVALID_DIMENSIONS: "EINVAL_DIMENSIONS",
  INVALID_VECTOR: "EINVAL_VECTOR",
  INVALID_ROW: "EINVAL_ROW",
  INVALID_DOCUMENT_ID: "EINVAL_DOCUMENT_ID",
  INVALID_LIMIT: "EINVAL_LIMIT",
  NOT_INITIALIZED: "ENOT_INITIALIZED",
  WRITE_FAILED: "EWRITE_FAILED",
});

/** Vector-index error carrying a stable machine-readable code. */
export class VectorIndexError extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.name = "VectorIndexError";
    this.code = code;
  }
}

function messageOf(err) {
  if (err == null) return "unknown error";
  const msg = typeof err.message === "string" ? err.message : String(err);
  return msg.length <= 400 ? msg : msg.slice(0, 400) + "…";
}

function nowIso(now = new Date()) {
  if (now instanceof Date) return now.toISOString();
  if (typeof now === "string") return now;
  return new Date(now).toISOString();
}

function validateDimensions(dimensions) {
  if (!Number.isSafeInteger(dimensions) || dimensions <= 0) {
    throw new VectorIndexError(
      VECTOR_ERROR_CODES.INVALID_DIMENSIONS,
      "dimensions must be a positive safe integer",
    );
  }
}

function assertDocumentId(documentId) {
  if (!Number.isSafeInteger(documentId) || documentId <= 0) {
    throw new VectorIndexError(
      VECTOR_ERROR_CODES.INVALID_DOCUMENT_ID,
      "documentId must be a positive safe integer",
    );
  }
}

function assertVector(vector, dimensions, label) {
  if (!Array.isArray(vector)) {
    throw new VectorIndexError(
      VECTOR_ERROR_CODES.INVALID_VECTOR,
      (label ? label + " " : "") + "must be an array of numbers",
    );
  }
  if (vector.length !== dimensions) {
    throw new VectorIndexError(
      VECTOR_ERROR_CODES.INVALID_VECTOR,
      (label ? label + " " : "") + "has " + vector.length + " dimensions, expected " + dimensions,
    );
  }
  if (!vector.every((n) => typeof n === "number" && Number.isFinite(n))) {
    throw new VectorIndexError(
      VECTOR_ERROR_CODES.INVALID_VECTOR,
      (label ? label + " " : "") + "must contain only finite numbers",
    );
  }
  if (!vector.every((n) => Math.abs(n) <= FLOAT32_MAX)) {
    throw new VectorIndexError(
      VECTOR_ERROR_CODES.INVALID_VECTOR,
      (label ? label + " " : "") + "contains a value outside float32 range",
    );
  }
}

function assertIdList(value, label) {
  if (!Array.isArray(value)) {
    throw new VectorIndexError(VECTOR_ERROR_CODES.INVALID_ROW, label + " must be an array of integers");
  }
  if (!value.every((n) => Number.isSafeInteger(n) && n >= 0 && n <= INT32_MAX)) {
    throw new VectorIndexError(
      VECTOR_ERROR_CODES.INVALID_ROW,
      label + " must contain only integers in [0, " + INT32_MAX + "]",
    );
  }
}

function buildSchema(dimensions) {
  return new Schema([
    new Field("chunk_id", new Int64(), false),
    new Field("document_id", new Int64(), false),
    new Field("vector", new FixedSizeList(dimensions, new Field("item", new Float32(), false)), false),
    new Field("project_ids", new List(new Field("item", new Int32(), false)), false),
    new Field("knowledge_base_ids", new List(new Field("item", new Int32(), false)), false),
    new Field("content_hash", new Utf8(), false),
    new Field("embedding_model", new Utf8(), false),
  ]);
}

/**
 * Validate and normalize one row before any write, so a bad batch fails fast
 * and never touches the table. document_id is forced to the argument so a
 * caller cannot accidentally write rows under a different document.
 */
function prepareRow(row, index, documentId, dimensions) {
  const where = "row " + index + ": ";
  if (row == null || typeof row !== "object") {
    throw new VectorIndexError(VECTOR_ERROR_CODES.INVALID_ROW, where + "must be an object");
  }
  if (!Number.isSafeInteger(row.chunk_id) || row.chunk_id <= 0) {
    throw new VectorIndexError(VECTOR_ERROR_CODES.INVALID_ROW, where + "chunk_id must be a positive safe integer");
  }
  assertVector(row.vector, dimensions, where + "vector");
  assertIdList(row.project_ids, where + "project_ids");
  assertIdList(row.knowledge_base_ids, where + "knowledge_base_ids");
  if (typeof row.content_hash !== "string" || row.content_hash === "") {
    throw new VectorIndexError(VECTOR_ERROR_CODES.INVALID_ROW, where + "content_hash must be a non-empty string");
  }
  if (typeof row.embedding_model !== "string" || row.embedding_model === "") {
    throw new VectorIndexError(VECTOR_ERROR_CODES.INVALID_ROW, where + "embedding_model must be a non-empty string");
  }
  return {
    chunk_id: row.chunk_id,
    document_id: documentId,
    vector: row.vector,
    project_ids: row.project_ids,
    knowledge_base_ids: row.knowledge_base_ids,
    content_hash: row.content_hash,
    embedding_model: row.embedding_model,
  };
}

/**
 * Atomic per-document replacement via mergeInsert on chunk_id: rows matching
 * the source are updated, new chunk ids are inserted, and rows of the same
 * document no longer in the source are deleted — all in one version commit.
 */
async function replaceRowsAtomic(table, documentId, prepared) {
  await table
    .mergeInsert("chunk_id")
    .whenMatchedUpdateAll()
    .whenNotMatchedInsertAll()
    .whenNotMatchedBySourceDelete({ where: "document_id = " + documentId })
    .execute(prepared);
}

/** Map a LanceDB search row back to JSON-safe values. */
function mapSearchRow(row) {
  return {
    chunkId: Number(row.chunk_id),
    documentId: Number(row.document_id),
    contentHash: row.content_hash,
    embeddingModel: row.embedding_model,
    projectIds: Array.from(row.project_ids ?? []),
    knowledgeBaseIds: Array.from(row.knowledge_base_ids ?? []),
    distance: row._distance,
  };
}

/**
 * Create a vector index over a LanceDB table.
 *
 * @param {object} options
 * @param {string} options.dataDir data root; the table lives under <dataDir>/vectors
 * @param {number} [options.dimensions=1024] vector dimensionality
 * @param {string} [options.tableName="chunks"] LanceDB table name
 * @param {(table, documentId, rows) => Promise<void>} [options.writeRows]
 *   internal seam defaulting to the atomic mergeInsert write; tests inject a
 *   failing function to verify a failed replace leaves old data intact.
 */
export function createVectorIndex(options = {}) {
  const {
    dataDir,
    dimensions = DEFAULT_VECTOR_DIMENSIONS,
    tableName = VECTOR_TABLE_NAME,
    writeRows = replaceRowsAtomic,
  } = options;

  validateDimensions(dimensions);

  let db = null;
  let table = null;
  let tablePromise = null;
  let closed = false;

  async function connectDb() {
    const root = resolveDataRoot({ dataDir });
    return connect(join(root, "vectors"));
  }

  async function readVectorDimension(tbl) {
    const schema = await tbl.schema();
    const field = schema.fields.find((f) => f.name === "vector");
    const type = field && field.type;
    return type && typeof type.listSize === "number" ? type.listSize : null;
  }

  async function ensurePrimaryKey(tbl) {
    const schema = await tbl.schema();
    const chunkField = schema.fields.find((f) => f.name === "chunk_id");
    const hasPk = chunkField && chunkField.metadata && chunkField.metadata.has(PRIMARY_KEY_METADATA_KEY);
    if (!hasPk) await tbl.setUnenforcedPrimaryKey("chunk_id");
  }

  async function ensureTable() {
    if (closed) {
      throw new VectorIndexError(VECTOR_ERROR_CODES.NOT_INITIALIZED, "vector index is closed");
    }
    if (table) return table;
    if (!tablePromise) {
      tablePromise = (async () => {
        db = await connectDb();
        const names = await db.tableNames();
        if (names.includes(tableName)) {
          table = await db.openTable(tableName);
          await ensurePrimaryKey(table);
          const actual = await readVectorDimension(table);
          if (actual != null && actual !== dimensions) {
            const opened = table;
            table = null;
            opened.close();
            throw new VectorIndexError(
              VECTOR_ERROR_CODES.INVALID_DIMENSIONS,
              "existing vector table has " + actual + " dimensions, expected " + dimensions,
            );
          }
        } else {
          table = await db.createEmptyTable(tableName, buildSchema(dimensions), { mode: "create" });
          await table.setUnenforcedPrimaryKey("chunk_id");
        }
        return table;
      })();
    }
    return tablePromise;
  }

  const index = {
    /** Open (or create) the LanceDB table and ensure its primary key. */
    async initialize() {
      await ensureTable();
      return index;
    },

    /**
     * Atomically replace every vector row of one document. All rows are
     * validated before any write; the write itself is a single mergeInsert
     * commit so a failure leaves the previous rows fully intact.
     */
    async replaceDocument(documentId, rows) {
      assertDocumentId(documentId);
      const prepared = (Array.isArray(rows) ? rows : []).map((row, i) =>
        prepareRow(row, i, documentId, dimensions),
      );
      const tbl = await ensureTable();
      if (prepared.length === 0) {
        await tbl.delete("document_id = " + documentId);
        return 0;
      }
      try {
        await writeRows(tbl, documentId, prepared);
      } catch (err) {
        throw new VectorIndexError(
          VECTOR_ERROR_CODES.WRITE_FAILED,
          "vector replace failed for document " + documentId + ": " + messageOf(err),
          { cause: err },
        );
      }
      return prepared.length;
    },

    /** Delete every vector row of one document. Returns the number removed. */
    async deleteDocument(documentId) {
      assertDocumentId(documentId);
      const tbl = await ensureTable();
      const result = await tbl.delete("document_id = " + documentId);
      return Number(result.numDeletedRows);
    },

    /**
     * Cosine vector search. documentIds (when supplied) is applied as a
     * pre-filter (WHERE document_id IN (...)) before topK, so the limit is
     * evaluated within the resolved scope rather than after a global topK.
     */
    async search({ vector, documentIds = null, limit = 10 } = {}) {
      assertVector(vector, dimensions, "query vector");
      if (!Number.isSafeInteger(limit) || limit <= 0) {
        throw new VectorIndexError(VECTOR_ERROR_CODES.INVALID_LIMIT, "limit must be a positive safe integer");
      }
      const tbl = await ensureTable();
      let query = tbl.vectorSearch(vector).distanceType("cosine");
      if (documentIds != null) {
        if (!Array.isArray(documentIds)) {
          throw new VectorIndexError(VECTOR_ERROR_CODES.INVALID_DOCUMENT_ID, "documentIds must be an array");
        }
        const ids = [...new Set(documentIds)];
        for (const id of ids) assertDocumentId(id);
        if (ids.length === 0) return [];
        query = query.where("document_id IN (" + ids.join(",") + ")");
      }
      const rows = await query.limit(limit).toArray();
      return rows.map(mapSearchRow);
    },

    /** Close the LanceDB table and connection. */
    async close() {
      closed = true;
      if (table) {
        try { table.close(); } catch { /* ignore */ }
        table = null;
      }
      if (db) {
        try { db.close(); } catch { /* ignore */ }
        db = null;
      }
      tablePromise = null;
    },
  };

  return index;
}

/**
 * Create the document indexing service.
 *
 * indexDocument runs the parsing -> embedding -> ready state machine:
 *   1. documents.status = "embedding";
 *   2. batch ollama.embed for every chunk text;
 *   3. once all vectors are confirmed, replace chunks + index metadata in one
 *      SQLite transaction;
 *   4. replace the document's vector rows (LanceDB);
 *   5. only then documents.status = "ready" with indexed_at.
 * SQLite and LanceDB cannot share a transaction, so the order above guarantees
 * a half-written document is never "ready" (only ready documents are
 * retrievable): if the vector step fails after SQLite committed, the document
 * stays "failed" and is rebuilt wholesale on the next attempt.
 */
export function createDocumentIndexer({
  repos,
  vectorIndex,
  ollama,
  embedding,
  embeddingModel,
  dimensions,
  parserVersion = PARSER_VERSION,
  chunkerVersion = CHUNK_RULE_VERSION,
  batchSize = 32,
}) {
  const embedder = embedding ?? ollama;
  const genericEmbedding = embedding != null;
  if (!repos || !vectorIndex || !embedder) {
    throw new Error("createDocumentIndexer requires repos, vectorIndex, and embedding");
  }
  if (!Number.isSafeInteger(batchSize) || batchSize <= 0) {
    throw new Error("batchSize must be a positive safe integer");
  }

  function runtimeIdentity() {
    const identity = typeof embedder.identity === "function" ? embedder.identity() : {};
    return {
      model: embeddingModel ?? identity.model ?? EMBEDDING_MODEL,
      dimensions: dimensions ?? identity.dimensions ?? EMBEDDING_DIMENSIONS,
    };
  }

  async function resolveDigest(model) {
    try {
      const models = await embedder.listModels({});
      const found = (models ?? []).find((m) => m && (m.name === model || m.id === model));
      if (found && typeof found.digest === "string" && found.digest !== "") return found.digest;
      return genericEmbedding && found ? "config:" + model : null;
    } catch {
      return genericEmbedding ? "config:" + model : null;
    }
  }

  async function embedAll(texts, model, signal) {
    const out = [];
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const vectors = genericEmbedding
        ? await embedder.embed(batch, { signal })
        : await embedder.embed({ input: batch, model, signal });
      out.push(...vectors);
    }
    return out;
  }

  function markFailed(documentId, phase, err) {
    repos.documents.updateIndexState(documentId, {
      status: "failed",
      error: phase + ": " + messageOf(err),
      indexedAt: null,
    });
  }

  async function indexDocument({
    documentId,
    chunks = [],
    projectIds = [],
    knowledgeBaseIds = [],
    model,
    signal,
  } = {}) {
    const doc = repos.documents.get(documentId);
    if (!doc) throw new Error("document not found: " + documentId);
    const previousDoc = doc;
    const previousChunks = repos.chunks.listByDocument(documentId);
    const previousMetadata = repos.documentIndexMetadata.get(documentId);
    const identity = runtimeIdentity();
    model = model ?? identity.model;
    const runtimeDimensions = identity.dimensions;

    function restorePrevious() {
      if (!previousMetadata) return false;
      repos.documents.restoreIndexedState({
        documentId,
        document: previousDoc,
        chunks: previousChunks,
        metadata: previousMetadata,
      });
      return true;
    }

    // Phase 1: mark embedding.
    repos.documents.updateIndexState(documentId, { status: "embedding", error: null, indexedAt: null });

    // Resolve the model digest up front; index metadata requires it.
    let digest = null;
    try {
      digest = await resolveDigest(model);
    } catch (err) {
      if (!restorePrevious()) markFailed(documentId, "embedding", err);
      return { ok: false, phase: "embedding", error: messageOf(err), documentId };
    }
    if (digest == null) {
      const msg = "cannot resolve embedding model digest for " + model;
      if (!restorePrevious()) markFailed(documentId, "embedding", new Error(msg));
      return { ok: false, phase: "embedding", error: msg, documentId };
    }

    const texts = chunks.map((c) => c.text);

    // Phase 2: embed every chunk.
    let vectors;
    try {
      vectors = texts.length > 0 ? await embedAll(texts, model, signal) : [];
    } catch (err) {
      if (!restorePrevious()) markFailed(documentId, "embedding", err);
      return { ok: false, phase: "embedding", error: messageOf(err), documentId };
    }
    if (vectors.length !== texts.length) {
      const msg = "embedding count mismatch: expected " + texts.length + ", got " + vectors.length;
      markFailed(documentId, "embedding", new Error(msg));
      return { ok: false, phase: "embedding", error: msg, documentId };
    }
    for (let i = 0; i < vectors.length; i++) {
      try {
        assertVector(vectors[i], runtimeDimensions, "embedding " + i);
      } catch (err) {
        if (!restorePrevious()) markFailed(documentId, "embedding", err);
        return { ok: false, phase: "embedding", error: messageOf(err), documentId };
      }
    }

    // Phase 3: replace chunks + metadata in one SQLite transaction.
    let inserted;
    try {
      inserted = repos.documents.applyIndexedChunks({
        documentId,
        chunks,
        metadata: {
          embeddingModel: model,
          embeddingDigest: digest,
          dimensions: runtimeDimensions,
          parserVersion,
          chunkerVersion,
        },
        now: new Date(),
      });
    } catch (err) {
      if (!restorePrevious()) markFailed(documentId, "sqlite", err);
      return { ok: false, phase: "sqlite", error: messageOf(err), documentId };
    }

    // Phase 4: replace vector rows.
    try {
      const rows = inserted.map((chunk, i) => ({
        chunk_id: chunk.id,
        document_id: documentId,
        vector: vectors[i],
        project_ids: projectIds,
        knowledge_base_ids: knowledgeBaseIds,
        content_hash: chunk.contentHash,
        embedding_model: model,
      }));
      await vectorIndex.replaceDocument(documentId, rows);
    } catch (err) {
      if (!restorePrevious()) markFailed(documentId, "vector", err);
      return { ok: false, phase: "vector", error: messageOf(err), documentId };
    }

    // Phase 5: ready.
    repos.documents.updateIndexState(documentId, { status: "ready", error: null, indexedAt: nowIso() });
    return { ok: true, documentId, chunkCount: inserted.length };
  }

  /**
   * Mark every ready document whose stored index metadata mismatches the
   * current model/dimensions/parser/chunker as stale. The digest comparison is
   * skipped when it cannot be resolved (e.g. Ollama is down at startup).
   */
  async function reconcileStale({ model, embeddingDigest = null, signal } = {}) {
    const identity = runtimeIdentity();
    model = model ?? identity.model;
    let digest = embeddingDigest;
    if (digest == null) {
      try { digest = await resolveDigest(model); } catch { digest = null; }
    }
    const mismatched = repos.documentIndexMetadata.listMismatch({
      embeddingModel: model,
      embeddingDigest: digest,
      dimensions: identity.dimensions,
      parserVersion,
      chunkerVersion,
    });
    for (const meta of mismatched) {
      repos.documentIndexMetadata.markStale(meta.documentId);
    }
    return {
      marked: mismatched.length,
      documentIds: mismatched.map((m) => m.documentId),
    };
  }

  return { indexDocument, reconcileStale };
}
