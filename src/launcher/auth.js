import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

function defaultCodexHome() { return join(homedir(), ".codex"); }

function own(env, key) {
  return Object.prototype.hasOwnProperty.call(env, key);
}

export async function loadCodexAccessToken({ codexAuth = "disabled", codexHome, env = process.env } = {}) {
  if (codexAuth !== "disabled" && codexAuth !== "auto") throw new Error("codexAuth must be disabled or auto");
  if (own(env, "CODEX_ACCESS_TOKEN")) {
    const explicit = env.CODEX_ACCESS_TOKEN;
    if (typeof explicit !== "string" || !explicit.trim()) throw new Error("CODEX_ACCESS_TOKEN is empty");
    return explicit.trim();
  }
  if (codexAuth !== "auto") return undefined;
  const file = join(codexHome || env.CODEX_HOME || defaultCodexHome(), "auth.json");
  let raw;
  try { raw = await readFile(file, "utf8"); } catch { throw new Error("Codex auth cache is unavailable or unreadable"); }
  let parsed;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Codex auth cache is not valid JSON"); }
  const token = parsed?.tokens?.access_token;
  if (typeof token !== "string" || !token.trim()) throw new Error("Codex auth cache has no access token");
  return token.trim();
}

export function buildChildEnv({ baseEnv = process.env, token, proxyEnv = {} } = {}) {
  const env = { ...baseEnv, ...proxyEnv };
  // CODEX_ACCESS_TOKEN is a launcher input, never a DSH configuration input.
  // The child receives only the provider-specific name used by the patch.
  delete env.CODEX_ACCESS_TOKEN;
  if (token) env.OPENAI_CODEX_ACCESS_TOKEN = token;
  return env;
}

export function redactToken(text, token) {
  return token && typeof text === "string" ? text.split(token).join("[REDACTED]") : text;
}
