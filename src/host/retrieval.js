/**
 * Scope-isolated hybrid retrieval (LanceDB vector + SQLite FTS5) for the
 * workbench host.
 *
 * createRetriever builds a search function that:
 *   1. resolves the retrieval scope live from the SQLite association tables
 *      (never from the LanceDB project_ids / knowledge_base_ids snapshot
 *      columns), restricted to documents whose status is "ready";
 *   2. recalls up to 20 chunks per route — LanceDB cosine similarity and
 *      SQLite FTS5 keyword search — over the same ready document set;
 *   3. fuses the two ranked lists with Reciprocal Rank Fusion (k = 60),
 *      deduplicating by chunk id and keeping each route's signal
 *      (vectorSimilarity / keywordMatched);
 *   4. merges adjacent chunks of the same document (consecutive ordinals),
 *      capped at three chunks, and returns at most "limit" citations.
 *
 * Every final chunk is re-fetched from SQLite and re-checked against the
 * resolved scope and the ready status, so the vector table's id-list columns
 * are never an authorization source.
 */

import { EMBEDDING_MODEL } from "./ollama.js";

/** Stable machine-routable failure codes surfaced by the retriever. */
export const RETRIEVAL_ERROR_CODES = Object.freeze({
  UNKNOWN_SCOPE: "EUNKNOWN_SCOPE",
  INVALID_SCOPE_ID: "EINVALID_SCOPE_ID",
  INVALID_LIMIT: "EINVALID_LIMIT",
});

/** Retrieval error carrying a stable machine-readable code. */
export class RetrievalError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RetrievalError";
    this.code = code;
  }
}

/** Recall depth for each of the two routes. */
const ROUTE_K = 20;

/** Reciprocal Rank Fusion constant k. */
const RRF_K = 60;

/** Minimum cosine similarity for a vector hit to enter the fusion. */
const MIN_VECTOR_SIMILARITY = 0.35;

/** Maximum consecutive chunks merged into a single citation. */
const MAX_MERGED_CHUNKS = 3;

/** Upper bound on the requested citation count. */
const MAX_LIMIT = 8;

/** Stable separator between merged chunk texts. */
const TEXT_SEPARATOR = "\n\n";

/**
 * Token characters for the FTS query builder: Unicode letters, digits and the
 * underscore (so code identifiers such as "compute_score" stay whole).
 * Everything else — FTS5 operators (AND/OR/NOT/NEAR), quotes, brackets,
 * colons, stars, hyphens — is a separator and therefore can never be
 * interpreted as FTS5 syntax.
 */
const TOKEN_RE = /[\p{L}\p{N}_]+/gu;

/** Extract the real tokens from a user query. */
export function extractTokens(query) {
  return String(query).match(TOKEN_RE) ?? [];
}

/**
 * Resource bounds for one MATCH expression. The trigram tokenizer indexes
 * 3+ character substrings, so a hostile query must not grow the MATCH string
 * without bound: at most MAX_TOKENS distinct tokens, each truncated to
 * MAX_TOKEN_CODE_POINTS Unicode code points (never splitting a surrogate pair).
 */
const MAX_TOKENS = 32;
const MAX_TOKEN_CODE_POINTS = 128;

/**
 * Truncate one token to at most `maxCodePoints` Unicode code points without
 * splitting a surrogate pair. `for...of` over a string iterates code points,
 * so a 128-code-point cut never lands between the two halves of a surrogate
 * pair, and the loop stops early so a huge token never allocates a huge array.
 */
export function truncateToken(token, maxCodePoints = MAX_TOKEN_CODE_POINTS) {
  const text = String(token);
  // Fast path: a short UTF-16 string is always within the code-point cap.
  if (text.length <= maxCodePoints) return text;
  let out = "";
  let count = 0;
  for (const cp of text) {
    if (count >= maxCodePoints) break;
    out += cp;
    count += 1;
  }
  return out;
}

/**
 * Build a token-safe, resource-bounded FTS5 MATCH expression.
 *
 *   - Tokens are deduplicated (first occurrence order), capped at MAX_TOKENS,
 *     and each truncated to MAX_TOKEN_CODE_POINTS code points.
 *   - Every token is quoted as a phrase, which neutralizes FTS5 operators, the
 *     "*" prefix marker, column filters ("col:"), and unbalanced brackets.
 *   - Tokens are OR-ed so a hit on any real token counts as a candidate.
 *
 * A token shorter than three code points matches nothing under the trigram
 * tokenizer (it contributes no trigram), so such queries rely on the vector
 * route; they are kept in the expression because they never throw and keep the
 * bounded behavior uniform. An empty result means "skip the FTS route".
 */
export function buildMatchExpression(query) {
  const tokens = extractTokens(query);
  if (tokens.length === 0) return "";
  const unique = [...new Set(tokens)].slice(0, MAX_TOKENS);
  const parts = unique.map((token) => {
    const bounded = truncateToken(token);
    return '"' + bounded.replace(/"/g, '""') + '"';
  });
  return parts.join(" OR ");
}

/**
 * Reciprocal Rank Fusion score for a 1-based rank (standard RRF: the first hit
 * has rank 1). Score is 1/(RRF_K + rank).
 */
export function rrfScore(rank) {
  return 1 / (RRF_K + rank);
}

function assertScopeId(scopeId) {
  if (!Number.isSafeInteger(scopeId) || scopeId <= 0) {
    throw new RetrievalError(
      RETRIEVAL_ERROR_CODES.INVALID_SCOPE_ID,
      "scopeId must be a positive safe integer",
    );
  }
}

function assertLimit(limit) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new RetrievalError(
      RETRIEVAL_ERROR_CODES.INVALID_LIMIT,
      "limit must be an integer in [1, " + MAX_LIMIT + "]",
    );
  }
}

/** Build the grouped retrieval API bound to repositories + vector index. */
export function createRetriever({
  repos,
  vectorIndex,
  ollama,
  embedding,
  embeddingModel,
}) {
  const embedder = embedding ?? ollama;
  const genericEmbedding = embedding != null;
  if (!repos || !vectorIndex || !embedder) {
    throw new Error("createRetriever requires repos, vectorIndex, and embedding");
  }

  async function search({ query, scope, scopeId, limit = 8, signal } = {}) {
    // An empty query is a clean "no results", never an error.
    if (typeof query !== "string" || query.trim() === "") return [];

    if (scope !== "project" && scope !== "knowledgeBase") {
      throw new RetrievalError(
        RETRIEVAL_ERROR_CODES.UNKNOWN_SCOPE,
        "unknown retrieval scope: " + String(scope),
      );
    }
    assertScopeId(scopeId);
    assertLimit(limit);

    const entity = scope === "project"
      ? repos.projects.get(scopeId)
      : repos.knowledgeBases.get(scopeId);
    if (!entity) {
      throw new RetrievalError(
        RETRIEVAL_ERROR_CODES.INVALID_SCOPE_ID,
        scope + " not found: " + scopeId,
      );
    }

    // Resolve the scope live from SQLite associations (ready documents only).
    const scopeIds = repos.documents.scopeDocumentIds({ scope, scopeId });
    if (scopeIds.length === 0) return [];
    const scopeIdSet = new Set(scopeIds);

    // Embed the query exactly once through the configured Workbench adapter.
    const identity = typeof embedder.identity === "function" ? embedder.identity() : {};
    const model = embeddingModel ?? identity.model ?? EMBEDDING_MODEL;
    const embeddings = genericEmbedding
      ? await embedder.embed([query], { signal })
      : await embedder.embed({ input: [query], model, signal });
    const queryVector = Array.isArray(embeddings) ? embeddings[0] : undefined;

    // Recall both routes over the same ready document set.
    const ftsHits = recallFts(scopeIds, query);
    const vectorHits = await recallVector(queryVector, scopeIds);

    // Fuse with RRF, deduplicating by chunk id. rrfScore takes a 1-based
    // rank (standard RRF), so the 0-based loop index is passed as index + 1.
    const fused = new Map();
    for (let i = 0; i < vectorHits.length; i += 1) {
      const hit = vectorHits[i];
      const entry = fused.get(hit.chunkId) ?? {
        chunkId: hit.chunkId,
        score: 0,
        vectorSimilarity: null,
        keywordMatched: false,
      };
      entry.score += rrfScore(i + 1);
      entry.vectorSimilarity = hit.similarity;
      fused.set(hit.chunkId, entry);
    }
    for (let i = 0; i < ftsHits.length; i += 1) {
      const hit = ftsHits[i];
      const entry = fused.get(hit.chunkId) ?? {
        chunkId: hit.chunkId,
        score: 0,
        vectorSimilarity: null,
        keywordMatched: false,
      };
      entry.score += rrfScore(i + 1);
      entry.keywordMatched = true;
      fused.set(hit.chunkId, entry);
    }

    if (fused.size === 0) return [];

    const ranked = [...fused.values()].sort(
      (a, b) => b.score - a.score || a.chunkId - b.chunkId,
    );

    // Fetch authoritative chunk details from SQLite and re-validate each
    // chunk against the resolved scope AND a fresh ready-status check. The
    // vector table's project_ids / knowledge_base_ids are never consulted.
    const details = repos.chunks.getByIds(ranked.map((e) => e.chunkId));
    const detailById = new Map(details.map((d) => [d.id, d]));
    const readyDocIds = new Set();
    for (const docId of new Set(details.map((d) => d.documentId))) {
      const doc = repos.documents.get(docId);
      if (doc && doc.status === "ready") readyDocIds.add(docId);
    }
    const valid = ranked
      .map((e) => {
        const d = detailById.get(e.chunkId);
        return d
          ? { ...e, documentId: d.documentId, ordinal: d.ordinal, text: d.text, locator: d.locator, heading: d.heading, originalName: d.originalName }
          : null;
      })
      .filter((e) => e != null && scopeIdSet.has(e.documentId) && readyDocIds.has(e.documentId));

    if (valid.length === 0) return [];

    return buildCitations(valid, limit);
  }

  async function recallVector(queryVector, scopeIds) {
    if (queryVector == null) return [];
    const raw = await vectorIndex.search({
      vector: queryVector,
      documentIds: scopeIds,
      limit: ROUTE_K,
    });
    return raw
      .map((hit) => ({
        chunkId: hit.chunkId,
        documentId: hit.documentId,
        similarity: 1 - hit.distance,
      }))
      .filter((hit) => hit.similarity >= MIN_VECTOR_SIMILARITY);
  }

  function recallFts(scopeIds, query) {
    const matchExpression = buildMatchExpression(query);
    if (matchExpression === "") return [];
    return repos.chunks.searchFts({
      matchExpression,
      documentIds: scopeIds,
      limit: ROUTE_K,
    });
  }

  function groupScore(members) {
    let best = -Infinity;
    for (const m of members) if (m.score > best) best = m.score;
    return best;
  }

  function toCitation(members) {
    // members are already sorted by ordinal ascending.
    const first = members[0];
    const last = members[members.length - 1];
    let heading = null;
    for (const m of members) {
      if (m.heading != null) { heading = m.heading; break; }
    }
    let vectorSimilarity = null;
    for (const m of members) {
      if (m.vectorSimilarity != null && (vectorSimilarity == null || m.vectorSimilarity > vectorSimilarity)) {
        vectorSimilarity = m.vectorSimilarity;
      }
    }
    const keywordMatched = members.some((m) => m.keywordMatched);
    return {
      sourceId: String(first.chunkId),
      documentId: first.documentId,
      chunkIds: members.map((m) => m.chunkId),
      originalName: first.originalName,
      locator: members.length === 1 ? first.locator : first.locator + ".." + last.locator,
      heading,
      text: members.map((m) => m.text).join(TEXT_SEPARATOR),
      score: groupScore(members),
      vectorSimilarity,
      keywordMatched,
    };
  }

  function buildCitations(valid, limit) {
    const byDoc = new Map();
    for (const entry of valid) {
      const key = entry.documentId;
      if (!byDoc.has(key)) byDoc.set(key, []);
      byDoc.get(key).push(entry);
    }

    const groups = [];
    for (const entries of byDoc.values()) {
      entries.sort((a, b) => a.ordinal - b.ordinal || a.chunkId - b.chunkId);
      let i = 0;
      while (i < entries.length) {
        let j = i;
        while (j + 1 < entries.length && entries[j + 1].ordinal === entries[j].ordinal + 1) {
          j += 1;
        }
        // A run of consecutive ordinals is split into groups of at most
        // MAX_MERGED_CHUNKS so adjacent merging never grows unbounded.
        let k = i;
        while (k <= j) {
          const end = Math.min(k + MAX_MERGED_CHUNKS - 1, j);
          groups.push(entries.slice(k, end + 1));
          k = end + 1;
        }
        i = j + 1;
      }
    }

    groups.sort((a, b) => {
      const sa = groupScore(a);
      const sb = groupScore(b);
      if (sa !== sb) return sb - sa;
      return (a[0].documentId - b[0].documentId) || (a[0].ordinal - b[0].ordinal);
    });

    return groups.slice(0, limit).map(toCitation);
  }

  return { search };
}
