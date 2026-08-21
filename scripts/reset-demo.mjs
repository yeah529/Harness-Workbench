import { createConnection } from "node:net";
import { homedir } from "node:os";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { access, cp, mkdir, mkdtemp, readFile, readdir, realpath as fsRealpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";

import { closeDatabase, openDatabase, transaction } from "../src/host/database.js";
import { DB_FILENAME, SCHEMA_VERSION } from "../src/host/config.js";
import { DEFAULT_TIME_ZONE, addLocalDays, localDateKey, validateTimeZone, zonedDateTimeToUtc } from "../src/host/timezone.js";
import { createRepositories } from "../src/host/repositories.js";

export const EMPTY_SESSION_PROJCACHE = Object.freeze({
  unit: Object.freeze({ name: "session_projcache", version: 3 }),
  global: null,
  tables: Object.freeze({ sessions: Object.freeze({}) }),
});

const SESSION_CACHE_FILENAME = "session_projcache.json";
const WORKSPACE_FILENAME = "workspace.json";
const SESSION_DIRNAME = "sessions";

const TODO_TITLES = Object.freeze({
  overdue: "Review Workbench architecture",
  todayOne: "Polish session navigation",
  todayTwo: "Validate embedding settings",
  nextDay: "Prepare next-day integration checklist",
  future: "Run release smoke test",
  done: "Finalize README",
});

function valueAfter(argv, index, name) {
  const value = argv[index + 1];
  if (value == null || value === "" || value.startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function parseFlagValue(argument, name) {
  if (!argument.startsWith(`${name}=`)) return null;
  const value = argument.slice(name.length + 1);
  if (!value) throw new Error(`${name} requires a value`);
  return value;
}

/** Parse the intentionally small, explicit reset CLI. */
export function parseResetArgs(argv) {
  const result = { dev: false, dryRun: false };
  const valueFlags = new Map([
    ["--workspace-path", "workspacePath"],
    ["--dsh-home", "dshHome"],
    ["--data-dir", "dataDir"],
    ["--timezone", "timezone"],
    ["--port", "port"],
    ["--dsh-pid", "dshPid"],
    ["--now", "now"],
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--dev") result.dev = true;
    else if (argument === "--dry-run") result.dryRun = true;
    else if (argument === "--help" || argument === "-h") result.help = true;
    else {
      let matched = false;
      for (const [flag, key] of valueFlags) {
        const inline = parseFlagValue(argument, flag);
        if (inline != null) {
          result[key] = inline;
          matched = true;
          break;
        }
        if (argument === flag) {
          result[key] = valueAfter(argv, index, flag);
          index += 1;
          matched = true;
          break;
        }
      }
      if (!matched) throw new Error(`unknown argument: ${argument}`);
    }
  }
  if (!result.help && !result.dev) throw new Error("reset:demo requires --dev");
  if (result.port != null && (!/^\d+$/.test(String(result.port)) || Number(result.port) < 1 || Number(result.port) > 65535)) {
    throw new Error("--port must be a TCP port between 1 and 65535");
  }
  if (result.dshPid != null && (!/^\d+$/.test(String(result.dshPid)) || Number(result.dshPid) < 1)) {
    throw new Error("--dsh-pid must be a positive process ID");
  }
  return result;
}

function assertAbsolutePath(value, name) {
  if (typeof value !== "string" || !isAbsolute(value)) throw new Error(`${name} must be an absolute path`);
  return resolve(value);
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function realPath(path, name) {
  if (!(await pathExists(path))) throw new Error(`${name} not found: ${path}`);
  const info = await stat(path);
  if (!info.isDirectory()) throw new Error(`${name} must be a directory: ${path}`);
  return fsRealpath(path);
}

async function readJson(path, label) {
  let text;
  try {
    text = await readFile(path, "utf8");
  } catch (error) {
    throw new Error(`${label} cannot be read: ${error.message}`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} contains invalid JSON: ${error.message}`);
  }
}

async function atomicWriteJson(path, value) {
  const temporary = `${path}.reset-${process.pid}-${Math.random().toString(16).slice(2)}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, path);
}

function samePath(left, right) {
  return resolve(left) === resolve(right);
}

function isSameOrAncestor(candidate, protectedPath) {
  const pathDelta = relative(candidate, protectedPath);
  return pathDelta === "" || (!pathDelta.startsWith("..") && !isAbsolute(pathDelta));
}

async function canonicalOrResolved(path) {
  let cursor = resolve(path);
  const missingSuffix = [];
  while (true) {
    try {
      const canonicalAncestor = await fsRealpath(cursor);
      return join(canonicalAncestor, ...missingSuffix.reverse());
    } catch (error) {
      if (!(["ENOENT", "ENOTDIR"].includes(error.code)) || cursor === dirname(cursor)) throw error;
      missingSuffix.push(basename(cursor));
      cursor = dirname(cursor);
    }
  }
}

function assertNotBroadRoot(candidate, protectedPath, label) {
  if (isSameOrAncestor(candidate, protectedPath)) {
    throw new Error(`refusing ${label} or ancestor as Workbench data root: ${candidate}`);
  }
}

async function assertSafeDataRoot(dataRoot, { dshHome, workspacePath }) {
  const normalized = await canonicalOrResolved(dataRoot);
  assertNotBroadRoot(normalized, resolve("/"), "filesystem root");
  assertNotBroadRoot(normalized, await canonicalOrResolved(homedir()), "home directory");
  assertNotBroadRoot(normalized, await canonicalOrResolved(dshHome), "DSH_HOME");
  assertNotBroadRoot(normalized, await canonicalOrResolved(workspacePath), "workspace path");
  // A data root inside the project source is also unsafe even when it is not
  // an ancestor: replacing it would mutate a user-controlled source tree.
  const source = await canonicalOrResolved(workspacePath);
  if (isSameOrAncestor(source, normalized)) {
    throw new Error(`refusing data root inside project source: ${normalized}`);
  }
  const parent = dirname(normalized);
  if (!(await pathExists(parent)) || !(await stat(parent)).isDirectory()) {
    throw new Error(`data root parent must already exist: ${parent}`);
  }
  return normalized;
}

async function validateExistingDataRoot(dataDir) {
  if (!(await pathExists(dataDir))) return;
  const info = await stat(dataDir);
  if (!info.isDirectory()) throw new Error(`Workbench data root must be a directory: ${dataDir}`);
  const entries = await readdir(dataDir);
  if (entries.length === 0) return;
  const databasePath = join(dataDir, DB_FILENAME);
  if (!(await pathExists(databasePath))) {
    throw new Error(`non-empty data root is not an identified Workbench root: ${dataDir}`);
  }
  let db;
  try {
    db = new DatabaseSync(databasePath, { readOnly: true });
    const version = Number(db.prepare("PRAGMA user_version").get().user_version);
    const required = ["projects", "todos", "workbench_settings", "summaries"];
    const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const names = new Set(rows.map((row) => row.name));
    if (version !== SCHEMA_VERSION || required.some((name) => !names.has(name))) {
      throw new Error(`non-empty data root has no current Workbench schema: ${dataDir}`);
    }
  } catch (error) {
    if (error.message.includes("non-empty data root has no current")) throw error;
    throw new Error(`cannot validate Workbench data root: ${dataDir}`);
  } finally {
    db?.close();
  }
}

async function resolveRuntimeOptions(options = {}) {
  const env = options.env ?? process.env;
  const dshHome = assertAbsolutePath(options.dshHome ?? env.DSH_HOME ?? join(homedir(), ".dsh"), "dshHome");
  const workspacePath = assertAbsolutePath(options.workspacePath ?? env.DSH_RESEARCH_PATH ?? "", "workspacePath");
  const targetWorkspacePath = await realPath(workspacePath, "workspace path");
  const dataDir = await assertSafeDataRoot(
    options.dataDir ?? env.DSH_CYBERPUNK_WORKBENCH_DATA_DIR ?? join(dshHome, "cyberpunk-workbench"),
    { dshHome, workspacePath: targetWorkspacePath },
  );
  await validateExistingDataRoot(dataDir);
  const timeZone = validateTimeZone(options.timezone ?? env.DSH_WORKBENCH_TIMEZONE ?? DEFAULT_TIME_ZONE);
  const dshHomeStorage = join(dshHome, "storages");
  const workspaceFile = join(dshHomeStorage, WORKSPACE_FILENAME);
  const cacheFile = join(dshHomeStorage, SESSION_CACHE_FILENAME);
  const workspaceDocument = await readJson(workspaceFile, "workspace.json");
  const cacheDocument = await pathExists(cacheFile) ? await readJson(cacheFile, "session_projcache.json") : null;
  const workspaces = workspaceDocument?.tables?.workspaces;
  if (!workspaces || typeof workspaces !== "object" || Array.isArray(workspaces)) {
    throw new Error("workspace.json has no valid tables.workspaces object");
  }
  const matches = [];
  for (const [workspaceId, workspace] of Object.entries(workspaces)) {
    if (typeof workspace?.path !== "string" || !isAbsolute(workspace.path) || !(await pathExists(workspace.path))) continue;
    if (samePath(await fsRealpath(workspace.path), targetWorkspacePath)) matches.push({ workspaceId, workspace });
  }
  if (matches.length !== 1) throw new Error("workspace path does not resolve to exactly one configured workspace");
  const workspaceMatch = matches[0];
  const targetSessionIds = new Set(Array.isArray(workspaceMatch.workspace.sessionIds) ? workspaceMatch.workspace.sessionIds : []);
  for (const [sessionId, entry] of Object.entries(cacheDocument?.tables?.sessions ?? {})) {
    const cwd = entry?.identity?.cwd ?? entry?.cwd;
    if (targetSessionIds.has(sessionId) || (typeof cwd === "string" && samePath(cwd, targetWorkspacePath))) {
      targetSessionIds.add(sessionId);
    }
  }
  const databasePath = join(dataDir, DB_FILENAME);
  if (await pathExists(databasePath)) {
    const readDb = new DatabaseSync(databasePath, { readOnly: true });
    try {
      const projectRows = readDb.prepare(
        "SELECT id FROM projects WHERE workspace_id = ? OR path = ?",
      ).all(workspaceMatch.workspaceId, targetWorkspacePath);
      const selectSessions = readDb.prepare(
        "SELECT session_id FROM workbench_sessions WHERE scope_kind = 'project' AND scope_id = ?",
      );
      for (const project of projectRows) {
        for (const row of selectSessions.all(project.id)) targetSessionIds.add(row.session_id);
      }
    } finally {
      readDb.close();
    }
  }

  return {
    dshHome,
    workspacePath: targetWorkspacePath,
    dataDir,
    timeZone,
    workspaceFile,
    cacheFile,
    sessionsDir: join(dshHome, SESSION_DIRNAME),
    workspaceDocument,
    cacheDocument,
    workspaceId: workspaceMatch.workspaceId,
    workspaceTitle: workspaceMatch.workspace.title ?? workspaceMatch.workspaceId,
    targetSessionIds: [...targetSessionIds].sort(),
    now: options.now instanceof Date ? options.now : new Date(options.now ?? Date.now()),
  };
}

function dueAt(date, time, timeZone) {
  return zonedDateTimeToUtc(date, time, timeZone).toISOString();
}

function buildSeedPlan(runtime) {
  if (Number.isNaN(runtime.now.getTime())) throw new Error("now must be a valid date");
  const today = localDateKey(runtime.now, runtime.timeZone);
  const yesterday = addLocalDays(today, -1);
  const tomorrow = addLocalDays(today, 1);
  const future = addLocalDays(today, 7);
  return {
    timezone: runtime.timeZone,
    dates: { yesterday, today, tomorrow, future },
    projects: 1,
    todos: 6,
    summaries: 3,
    knowledgeBases: 0,
    documents: 0,
    vectors: 0,
    uploads: 0,
    sessions: 0,
    todosByKind: {
      overdue: { title: TODO_TITLES.overdue, source: "manual", dueAt: dueAt(yesterday, "18:00", runtime.timeZone) },
      todayOne: { title: TODO_TITLES.todayOne, source: "manual", dueAt: dueAt(today, "23:00", runtime.timeZone) },
      todayTwo: { title: TODO_TITLES.todayTwo, source: "manual", dueAt: dueAt(today, "23:30", runtime.timeZone) },
      nextDay: { title: TODO_TITLES.nextDay, source: "auto", dueAt: dueAt(tomorrow, "18:00", runtime.timeZone) },
      future: { title: TODO_TITLES.future, source: "manual", dueAt: dueAt(future, "18:00", runtime.timeZone) },
      done: { title: TODO_TITLES.done, source: "manual", dueAt: dueAt(yesterday, "12:00", runtime.timeZone), done: true },
    },
  };
}

/** Resolve and printable-plan generation; this function performs no writes. */
export async function planReset(options = {}) {
  const runtime = await resolveRuntimeOptions(options);
  return {
    targets: {
      workspaceFile: runtime.workspaceFile,
      sessionsDir: runtime.sessionsDir,
      cacheFile: runtime.cacheFile,
      dataDir: runtime.dataDir,
      sessionIds: runtime.targetSessionIds,
    },
    workspaceId: runtime.workspaceId,
    workspaceTitle: runtime.workspaceTitle,
    workspacePath: runtime.workspacePath,
    timezone: runtime.timeZone,
    seed: buildSeedPlan(runtime),
    runtime,
  };
}

/** Stable, secret-free report printed before any stop probe or mutation. */
export function formatResetPlan(plan, { dryRun = false } = {}) {
  return JSON.stringify({
    mode: dryRun ? "dry-run" : "destructive",
    targets: plan.targets,
    workspace: {
      id: plan.workspaceId,
      title: plan.workspaceTitle,
      path: plan.workspacePath,
    },
    timezone: plan.timezone,
    seed: {
      projects: plan.seed.projects,
      todos: plan.seed.todos,
      summaries: plan.seed.summaries,
      knowledgeBases: plan.seed.knowledgeBases,
      documents: plan.seed.documents,
      vectors: plan.seed.vectors,
      uploads: plan.seed.uploads,
      sessions: plan.seed.sessions,
    },
  }, null, 2);
}

function connectionStoppedError(error) {
  return ["ECONNREFUSED", "ECONNRESET", "EPIPE", "ENOTFOUND"].includes(error?.code);
}

async function checkPortStopped(port) {
  return new Promise((resolveResult, reject) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    let settled = false;
    const finish = (value, error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error); else resolveResult(value);
    };
    socket.once("connect", () => finish(false));
    socket.once("error", (error) => {
      if (connectionStoppedError(error)) finish(true);
      else finish(undefined, new Error(`cannot verify DSH port ${port}: ${error.message}`));
    });
    socket.setTimeout(800, () => finish(undefined, new Error(`timed out verifying DSH port ${port}`)));
  });
}

/**
 * Safe stopped check: a supplied PID is checked directly; otherwise the
 * configured localhost listener is probed. This never kills or guesses a
 * process by name.
 */
export async function isDshStopped({ pid, port, connect = checkPortStopped } = {}) {
  const checks = [];
  if (pid != null) {
    const numericPid = Number(pid);
    if (!Number.isInteger(numericPid) || numericPid < 1) throw new Error("invalid DSH pid");
    try {
      process.kill(numericPid, 0);
      checks.push(false);
    } catch (error) {
      if (error.code === "ESRCH") checks.push(true);
      else throw new Error(`cannot verify DSH pid ${numericPid}: ${error.message}`);
    }
  }
  if (port != null) checks.push(await connect(Number(port)));
  if (checks.length === 0) throw new Error("destructive reset requires an explicit --dsh-pid or --port");
  return checks.every(Boolean);
}

function clearWorkspaceSessions(document, workspaceId, targetSessionIds) {
  const next = structuredClone(document);
  if (!next.global || typeof next.global !== "object") next.global = {};
  const targetIds = new Set(targetSessionIds);
  next.global.archivedSessionIds = (next.global.archivedSessionIds ?? []).filter((id) => !targetIds.has(id));
  const workspace = next.tables?.workspaces?.[workspaceId];
  if (workspace && typeof workspace === "object") {
    workspace.sessionIds = (workspace.sessionIds ?? []).filter((id) => !targetIds.has(id));
  }
  return next;
}

function clearCacheSessions(document, workspacePath, targetSessionIds) {
  const next = structuredClone(document ?? EMPTY_SESSION_PROJCACHE);
  if (!next.tables || typeof next.tables !== "object") next.tables = {};
  if (!next.tables.sessions || typeof next.tables.sessions !== "object") next.tables.sessions = {};
  const targetIds = new Set(targetSessionIds);
  for (const [sessionId, entry] of Object.entries(next.tables.sessions)) {
    const cwd = entry?.identity?.cwd ?? entry?.cwd;
    if (targetIds.has(sessionId) || (typeof cwd === "string" && samePath(cwd, workspacePath))) {
      delete next.tables.sessions[sessionId];
    }
  }
  return next;
}

async function pruneTargetSessions(root, targetSessionIds, { removeRoot = false } = {}) {
  if (!(await pathExists(root))) return;
  const targetIds = new Set(targetSessionIds);
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const child = join(root, entry.name);
    if (targetIds.has(entry.name)) {
      await rm(child, { recursive: true, force: true });
    } else if (entry.isDirectory()) {
      await pruneTargetSessions(child, targetSessionIds, { removeRoot: true });
    }
  }
  if (removeRoot && (await readdir(root)).length === 0) await rm(root, { recursive: true, force: true });
}

async function seedData(runtime, seed, stage) {
  if (await pathExists(runtime.dataDir)) await cp(runtime.dataDir, stage, { recursive: true, force: true });
  await mkdir(join(stage, "files"), { recursive: true });
  await mkdir(join(stage, "uploads"), { recursive: true });
  await mkdir(join(stage, "tmp"), { recursive: true });
  await mkdir(join(stage, "vectors"), { recursive: true });
  const db = openDatabase({ dataDir: stage });
  try {
    const repositories = createRepositories(db);
    transaction(db, () => {
      const projectRows = db.prepare(
        "SELECT id FROM projects WHERE workspace_id = ? OR path = ?",
      ).all(runtime.workspaceId, runtime.workspacePath);
      const deleteProjectSessions = db.prepare(
        "DELETE FROM workbench_sessions WHERE scope_kind = 'project' AND scope_id = ?",
      );
      for (const row of projectRows) {
        deleteProjectSessions.run(row.id);
        db.prepare("DELETE FROM projects WHERE id = ?").run(row.id);
      }
      const deleteChat = db.prepare("DELETE FROM knowledge_chats WHERE dsh_session_id = ?");
      const deleteWorkbenchSession = db.prepare("DELETE FROM workbench_sessions WHERE session_id = ?");
      for (const sessionId of runtime.targetSessionIds) {
        deleteChat.run(sessionId);
        deleteWorkbenchSession.run(sessionId);
      }

      const project = repositories.projects.create({
        name: runtime.workspaceTitle,
        path: runtime.workspacePath,
        workspaceId: runtime.workspaceId,
        now: runtime.now,
      });
      repositories.settings.set("timezone", runtime.timeZone, runtime.now);
      for (const todo of Object.values(seed.todosByKind)) {
        const created = repositories.todos.create({
          projectId: project.id,
          title: todo.title,
          dueAt: todo.dueAt,
          source: todo.source,
          now: runtime.now,
        });
        if (todo.done) repositories.todos.update({ id: created.id, done: true, now: runtime.now });
      }
      repositories.summaries.upsert({ projectId: project.id, summaryDate: seed.dates.yesterday, content: "Mock summary: Workbench session and RAG integration completed.", status: "completed", now: runtime.now });
      repositories.summaries.upsert({ projectId: project.id, summaryDate: seed.dates.today, content: "Mock summary: Settings, timezone, and reset flows verified.", status: "completed", now: runtime.now });
      repositories.summaries.upsert({ projectId: project.id, summaryDate: seed.dates.tomorrow, content: null, status: "pending", now: runtime.now });
    });
    db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
  } finally {
    closeDatabase(db);
  }
  await rm(join(stage, `${DB_FILENAME}-wal`), { force: true });
  await rm(join(stage, `${DB_FILENAME}-shm`), { force: true });
}

async function verifySeed(stage, runtime) {
  const db = openDatabase({ dataDir: stage });
  try {
    const projects = db.prepare(
      "SELECT id FROM projects WHERE workspace_id = ? OR path = ?",
    ).all(runtime.workspaceId, runtime.workspacePath);
    if (projects.length !== 1) throw new Error(`seed verification failed: target project count ${projects.length}`);
    const projectId = projects[0].id;
    const scopedCount = (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE project_id = ?`).get(projectId).count;
    const linkedDocuments = db.prepare("SELECT COUNT(*) AS count FROM project_documents WHERE project_id = ?").get(projectId).count;
    const linkedKnowledgeBases = db.prepare("SELECT COUNT(*) AS count FROM project_knowledge_bases WHERE project_id = ?").get(projectId).count;
    const targetSessionCount = runtime.targetSessionIds.reduce((total, sessionId) => total + db.prepare(
      "SELECT COUNT(*) AS count FROM workbench_sessions WHERE session_id = ?",
    ).get(sessionId).count, 0);
    const result = {
      projects: 1,
      todos: scopedCount("todos"),
      summaries: scopedCount("summaries"),
      knowledgeBases: linkedKnowledgeBases,
      documents: linkedDocuments,
      vectors: 0,
      uploads: 0,
      sessions: db.prepare("SELECT COUNT(*) AS count FROM workbench_sessions WHERE scope_kind='project' AND scope_id = ?").get(projectId).count + targetSessionCount,
      autoTodos: db.prepare("SELECT COUNT(*) AS count FROM todos WHERE project_id=? AND source='auto'").get(projectId).count,
      doneTodos: db.prepare("SELECT COUNT(*) AS count FROM todos WHERE project_id=? AND done=1").get(projectId).count,
      completedSummaries: db.prepare("SELECT COUNT(*) AS count FROM summaries WHERE project_id=? AND status='completed'").get(projectId).count,
      pendingSummaries: db.prepare("SELECT COUNT(*) AS count FROM summaries WHERE project_id=? AND status='pending'").get(projectId).count,
      preservedProjects: db.prepare("SELECT COUNT(*) AS count FROM projects WHERE id <> ?").get(projectId).count,
      preservedKnowledgeBases: db.prepare("SELECT COUNT(*) AS count FROM knowledge_bases").get().count,
    };
    if (result.projects !== 1 || result.todos !== 6 || result.summaries !== 3 || result.knowledgeBases !== 0 || result.documents !== 0 || result.vectors !== 0 || result.sessions !== 0 || result.autoTodos !== 1 || result.doneTodos !== 1 || result.completedSummaries !== 2 || result.pendingSummaries !== 1) {
      throw new Error(`seed verification failed: ${JSON.stringify(result)}`);
    }
    return result;
  } finally {
    closeDatabase(db);
  }
}

async function moveAside(path, label) {
  if (!(await pathExists(path))) return null;
  const backup = `${path}.reset-backup-${process.pid}-${label}-${Math.random().toString(16).slice(2)}`;
  await rename(path, backup);
  return backup;
}

async function restoreBackup(target, backup) {
  if (!backup) return;
  await rm(target, { recursive: true, force: true });
  await rename(backup, target);
}

async function executeReset(plan, { onMutation = () => {}, cleanupBackup = rm } = {}) {
  const { runtime } = plan;
  onMutation("stage");
  const stage = await mkdtemp(join(dirname(runtime.dataDir), ".cpwb-reset-stage-"));
  const sessionsStage = await mkdtemp(join(dirname(runtime.sessionsDir), ".cpwb-sessions-stage-"));
  let dataBackup = null;
  let sessionsBackup = null;
  let sessionsInstalled = false;
  let dataInstalled = false;
  let workspaceChanged = false;
  let cacheChanged = false;
  let seedResult;
  const originalWorkspace = runtime.workspaceDocument;
  const originalCache = runtime.cacheDocument;
  try {
    await seedData(runtime, plan.seed, stage);
    seedResult = await verifySeed(stage, runtime);
    if (await pathExists(runtime.sessionsDir)) await cp(runtime.sessionsDir, sessionsStage, { recursive: true, force: true });
    await pruneTargetSessions(sessionsStage, runtime.targetSessionIds);
    sessionsBackup = await moveAside(runtime.sessionsDir, "sessions");
    await rename(sessionsStage, runtime.sessionsDir);
    sessionsInstalled = true;
    dataBackup = await moveAside(runtime.dataDir, "data");
    await rename(stage, runtime.dataDir);
    dataInstalled = true;
    await atomicWriteJson(runtime.workspaceFile, clearWorkspaceSessions(originalWorkspace, runtime.workspaceId, runtime.targetSessionIds));
    workspaceChanged = true;
    await atomicWriteJson(runtime.cacheFile, clearCacheSessions(originalCache, runtime.workspacePath, runtime.targetSessionIds));
    cacheChanged = true;
  } catch (error) {
    await rm(stage, { recursive: true, force: true }).catch(() => {});
    await rm(sessionsStage, { recursive: true, force: true }).catch(() => {});
    if (workspaceChanged) await atomicWriteJson(runtime.workspaceFile, originalWorkspace).catch(() => {});
    if (cacheChanged) {
      if (originalCache == null) await rm(runtime.cacheFile, { force: true }).catch(() => {});
      else await atomicWriteJson(runtime.cacheFile, originalCache).catch(() => {});
    }
    if (dataInstalled) await rm(runtime.dataDir, { recursive: true, force: true }).catch(() => {});
    await restoreBackup(runtime.dataDir, dataBackup).catch(() => {});
    if (sessionsInstalled) await rm(runtime.sessionsDir, { recursive: true, force: true }).catch(() => {});
    await restoreBackup(runtime.sessionsDir, sessionsBackup).catch(() => {});
    throw error;
  }

  // The commit is complete. Backup cleanup is deliberately outside the
  // rollback boundary: a cleanup failure must not delete the new target or
  // pretend that a rollback succeeded after an old backup was removed.
  const cleanupWarnings = [];
  for (const [kind, backup] of [["data", dataBackup], ["sessions", sessionsBackup]]) {
    if (!backup) continue;
    try {
      await cleanupBackup(backup, { recursive: true, force: true });
    } catch (error) {
      cleanupWarnings.push({ kind, path: backup, message: error.message });
    }
  }
  return {
    dryRun: false,
    plan: { ...plan, runtime: undefined },
    seed: seedResult,
    cleanupWarnings,
  };
}

/** Execute a guarded demo reset or return its exact no-write plan. */
export async function resetDemo(options = {}) {
  if (!options.dev) throw new Error("reset:demo requires explicit development mode (--dev)");
  const plan = options.plan ?? await planReset(options);
  if (typeof options.report === "function") await options.report(formatResetPlan(plan, { dryRun: options.dryRun }), plan);
  if (options.dryRun) return { dryRun: true, plan: { ...plan, runtime: undefined } };
  if (options.dshPid == null && options.port == null) {
    throw new Error("destructive reset requires an explicit --dsh-pid or --port");
  }
  const stopped = await (options.checkStopped ?? ((value) => isDshStopped(value)))({
    pid: options.dshPid,
    port: options.port,
  });
  if (!stopped) throw new Error("DSH must be stopped before reset:demo");
  return executeReset(plan, { onMutation: options.onMutation, cleanupBackup: options.cleanupBackup });
}

function printHelp() {
  console.log("Usage: npm run reset:demo -- --dev [--dry-run] --workspace-path /absolute/DSH-Research [--dsh-home /absolute/.dsh] [--data-dir /absolute/data] [--timezone Asia/Shanghai] [--port PORT | --dsh-pid PID]");
}

async function main() {
  const parsed = parseResetArgs(process.argv.slice(2));
  if (parsed.help) return printHelp();
  const result = await resetDemo({ ...parsed, report: (report) => console.log(report) });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && samePath(fileURLToPath(import.meta.url), process.argv[1])) {
  main().catch((error) => {
    console.error(`reset:demo failed: ${error.message}`);
    process.exitCode = 1;
  });
}
