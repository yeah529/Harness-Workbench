/**
 * Cyberpunk workbench host configuration.
 *
 * Constants and data-root resolution shared by the SQLite database and the
 * repositories that sit on top of it. Tests override the data root with a
 * temporary directory; production defaults to ~/.dsh/cyberpunk-workbench.
 */

import { homedir } from "node:os";
import { join } from "node:path";

export const DEFAULT_DSH_HOME = join(homedir(), ".dsh");

/** Default persistent data root when no override is supplied. */
export const DEFAULT_DATA_ROOT = join(DEFAULT_DSH_HOME, "cyberpunk-workbench");

/** SQLite database filename inside the data root. */
export const DB_FILENAME = "workbench.sqlite";

/** Schema version persisted via PRAGMA user_version. */
export const SCHEMA_VERSION = 9;

/** Allowed document lifecycle states. */
export const DOCUMENT_STATUSES = Object.freeze([
  "uploading",
  "parsing",
  "embedding",
  "ready",
  "failed",
  "stale",
]);

/**
 * Resolve the data root from an optional override.
 *
 * @param {{ dataDir?: string }} [options]
 * @returns {string} absolute data-root path
 */
export function resolveDataRoot({ dataDir, env = process.env } = {}) {
  return dataDir
    ?? env.DSH_CYBERPUNK_WORKBENCH_DATA_DIR
    ?? join(env.DSH_HOME || DEFAULT_DSH_HOME, "cyberpunk-workbench");
}
