import { loadCodexAccessToken } from "../launcher/auth.js";

export const CODEX_CREDENTIAL_REF = "OPENAI_CODEX_ACCESS_TOKEN";

export class CodexAuthError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "CodexAuthError";
    this.status = status;
    this.code = code;
  }
}

function cacheError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("unavailable or unreadable")) {
    return new CodexAuthError(404, "CODEX_AUTH_CACHE_UNAVAILABLE", "未找到可读取的 Codex 登录缓存");
  }
  if (message.includes("not valid JSON")) {
    return new CodexAuthError(422, "CODEX_AUTH_CACHE_INVALID", "Codex 登录缓存格式无效");
  }
  if (message.includes("no access token") || message.includes("is empty")) {
    return new CodexAuthError(422, "CODEX_AUTH_TOKEN_MISSING", "Codex 登录缓存中没有可用的访问凭据");
  }
  return new CodexAuthError(500, "CODEX_AUTH_IMPORT_FAILED", "Codex 凭据接入失败");
}

function sanitizedStatus(description, credentials) {
  const configured = description?.configured === true;
  const readOnly = description?.writable === false;
  return {
    provider: "openai-codex",
    configured,
    source: configured ? description?.source ?? "credentials" : null,
    readOnly,
    canConnect: typeof credentials?.set === "function" && !readOnly,
    activation: "next-request",
  };
}

/**
 * Explicit, host-only bridge from the local Codex login cache to DSH's
 * credential provider. No method returns the credential value.
 */
export function createCodexAuth({ credentials, codexHome, env = process.env } = {}) {
  async function status() {
    if (typeof credentials?.describe !== "function") {
      return sanitizedStatus({ configured: false, writable: false }, credentials);
    }
    return sanitizedStatus(await credentials.describe(CODEX_CREDENTIAL_REF), credentials);
  }

  async function connect() {
    const current = await status();
    if (current.configured && current.readOnly) return current;
    if (typeof credentials?.set !== "function") {
      throw new CodexAuthError(501, "CODEX_AUTH_UNAVAILABLE", "DSH credentials 服务不可用");
    }
    let token;
    try {
      token = await loadCodexAccessToken({ codexAuth: "auto", codexHome, env });
    } catch (error) {
      throw cacheError(error);
    }
    await credentials.set(CODEX_CREDENTIAL_REF, token);
    return status();
  }

  async function testCredential() {
    if (typeof credentials?.resolve !== "function") {
      throw new CodexAuthError(501, "CODEX_AUTH_UNAVAILABLE", "DSH credentials 服务不可用");
    }
    const resolved = await credentials.resolve(CODEX_CREDENTIAL_REF);
    const value = resolved?.value ?? resolved;
    if (typeof value !== "string" || !value.trim()) {
      return { ok: false, code: "CREDENTIAL_MISSING", activation: "next-request" };
    }
    return { ok: true, code: "CREDENTIAL_READY", activation: "next-request" };
  }

  return { status, connect, test: testCredential };
}
