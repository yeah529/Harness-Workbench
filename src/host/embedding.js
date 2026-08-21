function urlOf(value) {
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw new Error("embedding endpoint must be http(s) without credentials");
  return url.toString().replace(/\/$/, "");
}

function checkConfig(config) {
  const provider = config?.provider;
  if (provider !== "ollama" && provider !== "openai-compatible") throw new Error("unsupported embedding provider");
  const baseUrl = urlOf(config.baseUrl || "http://127.0.0.1:11434");
  if (typeof config.model !== "string" || !config.model.trim()) throw new Error("embedding model is required");
  const dimensions = Number(config.dimensions);
  if (!Number.isSafeInteger(dimensions) || dimensions <= 0) throw new Error("embedding dimensions must be a positive integer");
  const timeoutMs = Number(config.timeoutMs ?? 30_000);
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 300_000) throw new Error("embedding timeout is invalid");
  return { provider, baseUrl, model: config.model.trim(), dimensions, timeoutMs, credentialRef: config.credentialRef ?? null };
}

export function embeddingIdentity(config) {
  const normalized = checkConfig(config);
  return { provider: normalized.provider, endpoint: normalized.baseUrl, model: normalized.model, dimensions: normalized.dimensions };
}

export function createEmbeddingAdapter(config, options = {}) {
  const normalized = checkConfig(config);
  const fetchImpl = options.fetchImpl ?? config?.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") throw new Error("embedding adapter requires fetch");
  const credentialResolver = options.getCredential ?? config?.getCredential ?? config?.resolveCredential;
  function embeddingError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }
  async function headers() {
    const result = { "content-type": "application/json" };
    if (normalized.provider !== "openai-compatible") return result;
    if (!normalized.credentialRef) throw embeddingError("CREDENTIAL_REQUIRED", "OpenAI-compatible embedding requires credentialRef");
    if (typeof credentialResolver !== "function") throw embeddingError("CREDENTIAL_MISSING", "embedding credential is not configured");
    const resolved = await credentialResolver(normalized.credentialRef);
    const value = resolved && typeof resolved === "object" && "value" in resolved ? resolved.value : resolved;
    if (typeof value !== "string" || value.trim() === "") throw embeddingError("CREDENTIAL_MISSING", "embedding credential is not configured");
    result.authorization = "Bearer " + value;
    return result;
  }
  async function request(path, { method = "POST", body } = {}, signal) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), normalized.timeoutMs);
    const onAbort = () => controller.abort();
    if (signal) signal.addEventListener("abort", onAbort, { once: true });
    try {
      const init = { method, headers: await headers(), signal: controller.signal };
      if (body !== undefined) init.body = JSON.stringify(body);
      const response = await fetchImpl(normalized.baseUrl + path, init);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error("embedding service returned HTTP " + response.status);
      return payload;
    } finally {
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", onAbort);
    }
  }
  return {
    identity: () => embeddingIdentity(normalized),
    async embed(texts, { signal } = {}) {
      if (!Array.isArray(texts) || texts.length === 0) return [];
      const payload = normalized.provider === "ollama"
        ? await request("/api/embed", { body: { model: normalized.model, input: texts } }, signal)
        : await request("/embeddings", { body: { model: normalized.model, input: texts } }, signal);
      const vectors = normalized.provider === "ollama" ? payload.embeddings : (payload.data || []).sort((a, b) => a.index - b.index).map((item) => item.embedding);
      if (!Array.isArray(vectors) || vectors.length !== texts.length || vectors.some((v) => !Array.isArray(v) || v.length !== normalized.dimensions)) throw new Error("embedding dimensions mismatch");
      return vectors;
    },
    async listModels({ signal } = {}) {
      const payload = normalized.provider === "ollama"
        ? await request("/api/tags", { method: "GET" }, signal)
        : await request("/models", { method: "GET" }, signal);
      if (normalized.provider === "ollama") return Array.isArray(payload.models) ? payload.models : [];
      return Array.isArray(payload.data) ? payload.data.map((item) => ({ id: item.id, name: item.id, ownedBy: item.owned_by })) : [];
    },
    async health({ signal } = {}) {
      const vectors = await this.embed(["health check"], { signal });
      return { ok: true, provider: normalized.provider, model: normalized.model, dimensions: vectors[0].length };
    },
  };
}

export { checkConfig as validateEmbeddingConfig };
