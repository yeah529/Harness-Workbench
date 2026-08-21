import { existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import { DB_FILENAME, resolveDataRoot } from "../host/config.js";
import { validateProxyUrl } from "./proxy.js";

const INHERIT = Object.freeze({ mode: "inherit", proxyUrl: null, noProxy: "" });

function invalidSavedNetwork() {
  return new Error("saved Workbench network settings are invalid");
}

export function normalizeSavedNetwork(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw invalidSavedNetwork();
  const mode = value.mode;
  if (!["inherit", "direct", "custom"].includes(mode)) throw invalidSavedNetwork();
  if (value.noProxy !== undefined && typeof value.noProxy !== "string") throw invalidSavedNetwork();
  let proxyUrl = null;
  if (value.proxyUrl !== undefined && value.proxyUrl !== null && value.proxyUrl !== "") {
    try { proxyUrl = validateProxyUrl(value.proxyUrl); }
    catch { throw invalidSavedNetwork(); }
  }
  if (mode === "custom" && !proxyUrl) throw invalidSavedNetwork();
  return { mode, proxyUrl, noProxy: value.noProxy ?? "" };
}

/** Read only the persisted next-launch network row; never creates or migrates a DB. */
export function readSavedNetwork({ dataDir, env = process.env } = {}) {
  const dbPath = join(resolveDataRoot({ dataDir, env }), DB_FILENAME);
  if (!existsSync(dbPath)) return { ...INHERIT };
  let db;
  try {
    db = new DatabaseSync(dbPath, { readOnly: true });
    let row;
    try {
      row = db.prepare("SELECT value FROM workbench_settings WHERE key = 'network'").get();
    } catch (error) {
      if (/no such table:\s*workbench_settings/i.test(String(error?.message))) return { ...INHERIT };
      throw error;
    }
    if (!row) return { ...INHERIT };
    let value;
    try { value = JSON.parse(row.value); }
    catch { throw invalidSavedNetwork(); }
    return normalizeSavedNetwork(value);
  } catch (error) {
    if (error?.message === "saved Workbench network settings are invalid") throw error;
    throw new Error("saved Workbench network settings are unreadable", { cause: error });
  } finally {
    if (db) db.close();
  }
}

export function selectProxySettings({ saved, cli = {}, proxyExplicit = false, proxyFields = [] } = {}) {
  const hasInlineProxy = cli.mode !== undefined && cli.mode !== "inherit"
    || Boolean(cli.proxyUrl)
    || Boolean(cli.noProxy);
  if (!proxyExplicit && !hasInlineProxy) return saved;
  if (proxyFields.length === 0) return { ...saved, ...cli };
  return { ...saved, ...Object.fromEntries(proxyFields.filter((key) => key in cli).map((key) => [key, cli[key]])) };
}
