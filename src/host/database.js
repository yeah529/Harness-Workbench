/**
 * Durable SQLite data model for the workbench host.
 *
 * Owns schema initialization and the transaction boundary used by every
 * multi-table mutation. All timestamps are stored as ISO 8601 UTC strings.
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { DB_FILENAME, SCHEMA_VERSION, resolveDataRoot } from "./config.js";

/**
 * Exactly the tables from design section 5.1 plus the FTS5 table chunks_fts.
 * chunks_fts uses the FTS5 trigram tokenizer so substrings of unspaced CJK
 * text (e.g. "神经网络" inside "深度学习神经网络入门教程") are searchable
 * without artificially inserting spaces. Tokens shorter than three Unicode
 * code points match nothing in trigram and fall back to the vector route.
 * Foreign keys are enabled per connection, WAL is enabled for the database
 * file, and schema version 4 is recorded in PRAGMA user_version.
 */

/**
 * The chunks FTS5 index and its sync triggers. Shared by the fresh schema and
 * the v1 -> v2 migration so the trigram tokenizer and external-content sync
 * stay defined in exactly one place.
 */
const CHUNKS_FTS_SQL = `
CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  text,
  locator,
  heading,
  original_name,
  tokenize = 'trigram',
  content='chunks',
  content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS chunks_ai AFTER INSERT ON chunks BEGIN
  INSERT INTO chunks_fts(rowid, text, locator, heading, original_name)
    VALUES (new.id, new.text, new.locator, new.heading, new.original_name);
END;

CREATE TRIGGER IF NOT EXISTS chunks_ad AFTER DELETE ON chunks BEGIN
  INSERT INTO chunks_fts(chunks_fts, rowid, text, locator, heading, original_name)
    VALUES ('delete', old.id, old.text, old.locator, old.heading, old.original_name);
END;

CREATE TRIGGER IF NOT EXISTS chunks_au AFTER UPDATE ON chunks BEGIN
  INSERT INTO chunks_fts(chunks_fts, rowid, text, locator, heading, original_name)
    VALUES ('delete', old.id, old.text, old.locator, old.heading, old.original_name);
  INSERT INTO chunks_fts(rowid, text, locator, heading, original_name)
    VALUES (new.id, new.text, new.locator, new.heading, new.original_name);
END;
`;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id TEXT,
  name TEXT NOT NULL,
  path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS knowledge_bases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_knowledge_bases (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  knowledge_base_id INTEGER NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, knowledge_base_id)
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sha256 TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER,
  status TEXT NOT NULL DEFAULT 'parsing',
  error TEXT,
  created_at TEXT NOT NULL,
  indexed_at TEXT
);

CREATE TABLE IF NOT EXISTS knowledge_base_documents (
  knowledge_base_id INTEGER NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  PRIMARY KEY (knowledge_base_id, document_id)
);

CREATE TABLE IF NOT EXISTS project_documents (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, document_id)
);

CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL,
  text TEXT NOT NULL,
  locator TEXT NOT NULL,
  heading TEXT,
  original_name TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  UNIQUE (document_id, ordinal)
);

${CHUNKS_FTS_SQL}

CREATE TABLE IF NOT EXISTS document_index_metadata (
  document_id INTEGER PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
  embedding_model TEXT NOT NULL,
  embedding_digest TEXT NOT NULL,
  dimensions INTEGER NOT NULL,
  parser_version TEXT NOT NULL,
  chunker_version TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'auto')),
  due_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS todos_project_due ON todos(project_id, done, due_at);

CREATE TABLE IF NOT EXISTS workbench_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS summaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  summary_date TEXT NOT NULL,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  UNIQUE (project_id, summary_date)
);

CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt TEXT,
  rule TEXT NOT NULL,
  recurrence TEXT CHECK (recurrence IN ('once', 'daily', 'weekly', 'monthly')),
  starts_at TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  last_run_at TEXT,
  next_run_at TEXT
);

CREATE TABLE IF NOT EXISTS schedule_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schedule_id INTEGER NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  scheduled_at TEXT NOT NULL,
  session_id TEXT,
  status TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  error TEXT,
  UNIQUE (schedule_id, scheduled_at)
);

CREATE TABLE IF NOT EXISTS knowledge_chats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  knowledge_base_id INTEGER NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  title TEXT,
  dsh_session_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workbench_sessions (
  session_id TEXT PRIMARY KEY,
  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('project', 'knowledge_base', 'independent')),
  scope_id INTEGER,
  chat_id INTEGER,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  reasoning_effort TEXT,
  title TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (
    (scope_kind = 'independent' AND scope_id IS NULL) OR
    (scope_kind IN ('project', 'knowledge_base') AND scope_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS workbench_sessions_scope_activity
  ON workbench_sessions(scope_kind, scope_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS project_automation (
  project_id INTEGER PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  summary_enabled INTEGER NOT NULL DEFAULT 1,
  next_day_todos_enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
`;

/**
 * Upgrade a v1 database in place: replace the old-tokenizer chunks_fts with
 * the trigram external-content table and rebuild it from chunks. It drops the
 * v1 triggers first, drops the old virtual table, recreates both from
 * CHUNKS_FTS_SQL, then repopulates the index from the chunks content table so
 * no documents/chunks data is lost. It runs inside the same write transaction
 * as the user_version bump (see migrate below).
 */
const V1_TO_V2_MIGRATION_SQL = `
DROP TRIGGER IF EXISTS chunks_ai;
DROP TRIGGER IF EXISTS chunks_ad;
DROP TRIGGER IF EXISTS chunks_au;
DROP TABLE IF EXISTS chunks_fts;
${CHUNKS_FTS_SQL}
INSERT INTO chunks_fts(rowid, text, locator, heading, original_name)
  SELECT id, text, locator, heading, original_name FROM chunks;
`;

const V2_TO_V3_MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS workbench_sessions (
  session_id TEXT PRIMARY KEY,
  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('project', 'knowledgeBase')),
  scope_id INTEGER NOT NULL,
  chat_id INTEGER,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  reasoning_effort TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS workbench_sessions_scope_activity
  ON workbench_sessions(scope_kind, scope_id, updated_at DESC);
`;

const V3_TO_V4_MIGRATION_SQL = `
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS project_automation;
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'auto')),
  due_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE INDEX IF NOT EXISTS todos_project_due ON todos(project_id, done, due_at);
CREATE TABLE IF NOT EXISTS workbench_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS project_automation (
  project_id INTEGER PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  summary_enabled INTEGER NOT NULL DEFAULT 1,
  next_day_todos_enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
`;

const V4_TO_V5_MIGRATION_SQL = `
DROP TABLE IF EXISTS workbench_sessions;
CREATE TABLE workbench_sessions (
  session_id TEXT PRIMARY KEY,
  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('project', 'knowledge_base', 'independent')),
  scope_id INTEGER,
  chat_id INTEGER,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  reasoning_effort TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (
    (scope_kind = 'independent' AND scope_id IS NULL) OR
    (scope_kind IN ('project', 'knowledge_base') AND scope_id IS NOT NULL)
  )
);
CREATE INDEX workbench_sessions_scope_activity
  ON workbench_sessions(scope_kind, scope_id, updated_at DESC);
`;

const V5_TO_V6_MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt TEXT,
  rule TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  last_run_at TEXT,
  next_run_at TEXT
);
ALTER TABLE schedules ADD COLUMN recurrence TEXT CHECK (recurrence IN ('once', 'daily', 'weekly', 'monthly'));
ALTER TABLE schedules ADD COLUMN starts_at TEXT;
ALTER TABLE workbench_sessions ADD COLUMN title TEXT;
`;

/**
 * Apply one schema migration atomically.
 *
 * The DDL and the PRAGMA user_version bump run inside a single write
 * transaction so a failure mid-way rolls both back together: the database is
 * never left with a partial schema while its version header claims a newer
 * state. db.exec stops at the first failing statement, and the enclosing
 * ROLLBACK discards every DDL statement that already ran.
 *
 * @param {DatabaseSync} db
 * @param {string} schemaSql
 * @param {number} version
 */
export function applySchema(db, schemaSql, version) {
  const { user_version: current } = db.prepare("PRAGMA user_version").get();
  if (current >= version) return;
  transaction(db, () => {
    db.exec(schemaSql);
    db.exec("PRAGMA user_version = " + version);
  });
}

/**
 * Bring the database to the current schema version inside one write
 * transaction.
 *
 * A fresh database (user_version 0) runs the full SCHEMA_SQL. An existing v1
 * database is upgraded through each version boundary in order. v1 first gets
 * the FTS tokenizer upgrade, then the session tables, current todo schema, and
 * finally the canonical three-context session index. v2-v4 start at their
 * respective boundary. Session index migration is intentionally destructive:
 * this unreleased Workbench does not import legacy DSH session history.
 * same transaction as the final PRAGMA user_version update.
 */
function migrate(db) {
  const { user_version: current } = db.prepare("PRAGMA user_version").get();
  if (current >= SCHEMA_VERSION) return;
  transaction(db, () => {
    if (current === 1) {
      db.exec(V1_TO_V2_MIGRATION_SQL);
      db.exec(V2_TO_V3_MIGRATION_SQL);
      db.exec(V3_TO_V4_MIGRATION_SQL);
      db.exec(V4_TO_V5_MIGRATION_SQL);
      db.exec(V5_TO_V6_MIGRATION_SQL);
    } else if (current === 2) {
      db.exec(V2_TO_V3_MIGRATION_SQL);
      db.exec(V3_TO_V4_MIGRATION_SQL);
      db.exec(V4_TO_V5_MIGRATION_SQL);
      db.exec(V5_TO_V6_MIGRATION_SQL);
    } else if (current === 3) {
      db.exec(V3_TO_V4_MIGRATION_SQL);
      db.exec(V4_TO_V5_MIGRATION_SQL);
      db.exec(V5_TO_V6_MIGRATION_SQL);
    } else if (current === 4) {
      db.exec(V4_TO_V5_MIGRATION_SQL);
      db.exec(V5_TO_V6_MIGRATION_SQL);
    } else if (current === 5) {
      db.exec(V5_TO_V6_MIGRATION_SQL);
    } else {
      db.exec(SCHEMA_SQL);
    }
    db.exec("PRAGMA user_version = " + SCHEMA_VERSION);
  });
}

/**
 * Open (or create) the workbench SQLite database under `dataDir`.
 *
 * @param {{ dataDir?: string }} [options]
 * @returns {DatabaseSync}
 */
export function openDatabase({ dataDir } = {}) {
  const root = resolveDataRoot({ dataDir });
  mkdirSync(root, { recursive: true });
  const db = new DatabaseSync(join(root, DB_FILENAME));
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA journal_mode = WAL");
  migrate(db);
  return db;
}

/** Close the database and release WAL sidecar files. */
export function closeDatabase(db) {
  db.close();
}

/**
 * Run `fn` inside a single write transaction. Rolls back on any throw.
 *
 * @template T
 * @param {DatabaseSync} db
 * @param {() => T} fn
 * @returns {T}
 */
export function transaction(db, fn) {
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
