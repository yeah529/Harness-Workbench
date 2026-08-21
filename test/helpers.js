/**
 * Shared test helpers for the workbench host test suite.
 *
 * Every test gets a throwaway directory under the OS temporary directory so
 * the durable SQLite database never touches ~/.dsh/cyberpunk-workbench.
 */

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Create a unique temporary data directory. */
export async function createTempDir(prefix = "cpwb-test-") {
  return mkdtemp(join(tmpdir(), prefix));
}

/** Recursively remove a temporary data directory after the database is closed. */
export async function removeTempDir(dir) {
  await rm(dir, { recursive: true, force: true });
}
