/**
 * Ollama HTTP client for the Cyberpunk workbench host.
 *
 * Owns the two Ollama endpoints needed for local indexing — GET /api/tags and
 * POST /api/embed. Generation is routed through the existing DSH provider and
 * is deliberately absent from this client. Every request carries its caller's
 * signal, and no error message echoes a large response body.
 */

import { LlmError, errorChain } from "@deepseek-ai/dsh-llm";

/** Installed embedding model. */
export const EMBEDDING_MODEL = "qwen3-embedding:0.6b";

/** Exact embedding dimensionality of EMBEDDING_MODEL. */
export const EMBEDDING_DIMENSIONS = 1024;

/** Default loopback base URL when the caller supplies none. */
export const DEFAULT_OLLAMA_BASE_URL = "http://127.0.0.1:11434";

/** Stable machine-routable failure codes for every Ollama client error. */
export const OLLAMA_ERROR_CODES = Object.freeze({
  INVALID_BASE_URL: "INVALID_BASE_URL",
  TRANSPORT: "TRANSPORT",
  HTTP: "HTTP",
  MALFORMED_JSON: "MALFORMED_JSON",
  MISSING_MODEL: "MISSING_MODEL",
  INVALID_DIMENSION: "INVALID_DIMENSION",
  ABORTED: "ABORTED",
});

const MAX_ERROR_BODY_CHARS = 2048;
const MAX_ERROR_MESSAGE_CHARS = 300;

function bounded(value, limit = MAX_ERROR_MESSAGE_CHARS) {
  const text = typeof value === "string" ? value : String(value);
  return text.length <= limit ? text : text.slice(0, limit) + "…";
}

function abortError() {
  return new LlmError("Ollama request aborted", OLLAMA_ERROR_CODES.ABORTED);
}

function isAbortError(error, signal) {
  if (signal && signal.aborted) return true;
  if (!error) return false;
  return error.name === "AbortError" || error.code === "ABORT_ERR" || error.code === 20;
}

function normalizeBaseURL(raw) {
  if (raw === undefined || raw === null || raw === "") raw = DEFAULT_OLLAMA_BASE_URL;
  if (typeof raw !== "string") {
    throw new LlmError("Ollama baseURL must be a string", OLLAMA_ERROR_CODES.INVALID_BASE_URL);
  }
  let parsed;
  try {
    parsed = new URL(raw);
  } catch (cause) {
    throw new LlmError("invalid Ollama baseURL: " + bounded(raw), OLLAMA_ERROR_CODES.INVALID_BASE_URL, { cause });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new LlmError("Ollama baseURL must use http or https", OLLAMA_ERROR_CODES.INVALID_BASE_URL);
  }
  let normalized = parsed.toString();
  while (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
  return normalized;
}

async function readErrorBody(response) {
  try {
    if (typeof response.text !== "function") return "";
    const text = await response.text();
    return bounded(text, MAX_ERROR_BODY_CHARS);
  } catch {
    return "";
  }
}

async function readJson(response, endpoint) {
  try {
    return await response.json();
  } catch (cause) {
    throw new LlmError("malformed JSON from Ollama " + endpoint, OLLAMA_ERROR_CODES.MALFORMED_JSON, { cause });
  }
}

function httpFailure(response, bodyText) {
  const status = response.status;
  let detail = "";
  if (bodyText) {
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed && typeof parsed.error === "string") detail = parsed.error;
    } catch {
      detail = bodyText;
    }
  }
  const looksMissingModel =
    status === 404 ||
    (typeof detail === "string" && /not found|no such model|unknown model/i.test(detail));
  if (looksMissingModel) {
    return new LlmError(
      "Ollama model not found" + (detail ? ": " + bounded(detail) : ""),
      OLLAMA_ERROR_CODES.MISSING_MODEL,
      { status },
    );
  }
  return new LlmError(
    "Ollama HTTP " + status + (detail ? ": " + bounded(detail) : ""),
    OLLAMA_ERROR_CODES.HTTP,
    { status },
  );
}

export function createOllamaClient(options = {}) {
  const baseURL = normalizeBaseURL(options.baseURL);
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new LlmError("Ollama client requires a fetch implementation", OLLAMA_ERROR_CODES.INVALID_BASE_URL);
  }

  async function request(path, init) {
    const signal = init.signal;
    if (signal && signal.aborted) throw abortError();
    let response;
    try {
      response = await fetchImpl(baseURL + path, { ...init, signal });
    } catch (cause) {
      if (isAbortError(cause, signal)) throw abortError();
      throw new LlmError("Ollama transport failure: " + bounded(errorChain(cause)), OLLAMA_ERROR_CODES.TRANSPORT, { cause });
    }
    return response;
  }

  async function listModels({ signal } = {}) {
    const response = await request("/api/tags", { method: "GET", signal });
    if (!response.ok) throw httpFailure(response, await readErrorBody(response));
    const data = await readJson(response, "/api/tags");
    const models = data && data.models;
    if (!Array.isArray(models)) {
      throw new LlmError("Ollama /api/tags returned no models array", OLLAMA_ERROR_CODES.MALFORMED_JSON);
    }
    return models.map((m) => ({
      name: m && typeof m.name === "string" ? m.name : "",
      ...(m && typeof m.digest === "string" ? { digest: m.digest } : {}),
      ...(m && m.details && typeof m.details === "object" ? { details: m.details } : {}),
    }));
  }

  async function embed({ input, model = EMBEDDING_MODEL, signal } = {}) {
    const texts = Array.isArray(input) ? input : [input];
    const response = await request("/api/embed", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, input: texts }),
      signal,
    });
    if (!response.ok) throw httpFailure(response, await readErrorBody(response));
    const data = await readJson(response, "/api/embed");
    const embeddings = data && data.embeddings;
    if (!Array.isArray(embeddings) || embeddings.length !== texts.length) {
      throw new LlmError("Ollama /api/embed returned a mismatched embeddings array", OLLAMA_ERROR_CODES.MALFORMED_JSON);
    }
    return embeddings.map((vector, i) => {
      if (!Array.isArray(vector) || vector.length !== EMBEDDING_DIMENSIONS) {
        throw new LlmError(
          "Ollama embedding " + i + " has " + (Array.isArray(vector) ? vector.length : "no") + " dimensions, expected " + EMBEDDING_DIMENSIONS,
          OLLAMA_ERROR_CODES.INVALID_DIMENSION,
        );
      }
      if (!vector.every((n) => typeof n === "number" && Number.isFinite(n))) {
        throw new LlmError("Ollama embedding " + i + " contains a non-finite value", OLLAMA_ERROR_CODES.INVALID_DIMENSION);
      }
      return vector;
    });
  }

  async function health({ signal } = {}) {
    const report = {
      reachable: false,
      embedding: { model: EMBEDDING_MODEL, present: false, dimensions: EMBEDDING_DIMENSIONS, usable: false },
    };
    let models;
    try {
      models = await listModels({ signal });
      report.reachable = true;
    } catch {
      return report;
    }
    const emb = models.find((m) => m.name === EMBEDDING_MODEL);
    report.embedding.present = emb !== undefined;
    if (emb) {
      report.embedding.usable = emb.details && emb.details.embedding_length === EMBEDDING_DIMENSIONS;
    }
    return report;
  }

  return { baseURL, listModels, embed, health };
}
