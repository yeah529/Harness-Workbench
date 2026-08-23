import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { closeDatabase, openDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import {
  isDshStopped,
  parseResetArgs,
  resetDemo,
} from "../scripts/reset-demo.mjs";

async function makeFixture(t) {
  const root = await mkdtemp(join(tmpdir(), "cpwb-reset-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const dshHome = join(root, "dsh");
  const workspacePath = join(root, "DSH-Research");
  const dataDir = join(root, "workbench-data");
  await mkdir(workspacePath, { recursive: true });
  await mkdir(join(dshHome, "storages", "workspace.json"), { recursive: true }).catch(() => {});
  await rm(join(dshHome, "storages", "workspace.json"), { recursive: true, force: true });
  await mkdir(join(dshHome, "storages"), { recursive: true });
  await mkdir(join(dshHome, "sessions"), { recursive: true });
  const oldSessionDir = join(dshHome, "sessions", "target-bucket", "old");
  await mkdir(oldSessionDir, { recursive: true });
  await writeFile(join(oldSessionDir, "session.jsonl.zstd"), "old session");

  const workspaceJson = {
    unit: { name: "workspace", version: 2 },
    global: { initialized: true, workspaceIds: ["ws-real"], archivedSessionIds: ["old"] },
    tables: {
      workspaces: {
        "ws-real": {
          path: workspacePath,
          title: "DSH Research",
          sessionIds: ["old"],
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
          customField: { keep: true },
        },
      },
    },
  };
  const workspaceFile = join(dshHome, "storages", "workspace.json");
  await writeFile(workspaceFile, JSON.stringify(workspaceJson, null, 2));
  await writeFile(
    join(dshHome, "storages", "session_projcache.json"),
    JSON.stringify({
      unit: { name: "session_projcache", version: 3 },
      global: null,
      tables: { sessions: { old: { cwd: workspacePath } } },
    }, null, 2),
  );

  await mkdir(dataDir, { recursive: true });
  const db = openDatabase({ dataDir });
  closeDatabase(db);
  await writeFile(join(dataDir, "stale-user-file.txt"), "must be rebuilt");
  return { root, dshHome, workspacePath, dataDir, workspaceFile };
}

function options(fixture, overrides = {}) {
  return {
    dev: true,
    dshHome: fixture.dshHome,
    workspacePath: fixture.workspacePath,
    dataDir: fixture.dataDir,
    timezone: "Asia/Shanghai",
    now: new Date("2026-08-21T04:00:00.000Z"),
    port: 3080,
    checkStopped: async () => true,
    ...overrides,
  };
}

test("reset-demo dry-run resolves exact workspace and makes no changes", async (t) => {
  const fixture = await makeFixture(t);
  const beforeWorkspace = await readFile(fixture.workspaceFile, "utf8");
  const result = await resetDemo(options(fixture, { dryRun: true }));

  assert.equal(result.dryRun, true);
  assert.equal(result.plan.workspaceId, "ws-real");
  assert.equal(result.plan.seed.projects, 1);
  assert.equal(result.plan.seed.todos, 6);
  assert.equal(result.plan.seed.summaries, 3);
  assert.deepEqual(result.plan.seed.knowledgeBases, 0);
  assert.equal(await readFile(fixture.workspaceFile, "utf8"), beforeWorkspace);
  assert.deepEqual((await readdir(fixture.dataDir)).sort(), ["stale-user-file.txt", "workbench.sqlite", "workbench.sqlite-shm", "workbench.sqlite-wal"].sort());
});

test("reset-demo clears only session state, rebuilds data, and seeds an idempotent demo", async (t) => {
  const fixture = await makeFixture(t);
  const reset = () => resetDemo(options(fixture));
  await reset();
  await reset();

  const workspace = JSON.parse(await readFile(fixture.workspaceFile, "utf8"));
  assert.deepEqual(workspace.global.archivedSessionIds, []);
  assert.deepEqual(workspace.global.workspaceIds, ["ws-real"]);
  assert.deepEqual(workspace.tables.workspaces["ws-real"].sessionIds, []);
  assert.equal(workspace.tables.workspaces["ws-real"].customField.keep, true);

  const cache = JSON.parse(await readFile(join(fixture.dshHome, "storages", "session_projcache.json")));
  assert.deepEqual(cache, {
    unit: { name: "session_projcache", version: 3 },
    global: null,
    tables: { sessions: {} },
  });
  assert.deepEqual(await readdir(join(fixture.dshHome, "sessions")), []);

  const db = openDatabase({ dataDir: fixture.dataDir });
  try {
    const count = (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
    assert.equal(count("projects"), 1);
    assert.equal(count("todos"), 6);
    assert.equal(count("summaries"), 3);
    assert.equal(count("knowledge_bases"), 0);
    assert.equal(count("documents"), 0);
    assert.equal(count("chunks"), 0);
    assert.equal(count("workbench_sessions"), 0);
    assert.equal(count("todos"), 6);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM todos WHERE source='auto'").get().count, 1);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM todos WHERE done=1").get().count, 1);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM summaries WHERE status='completed'").get().count, 2);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM summaries WHERE status='pending'").get().count, 1);
    assert.equal(db.prepare("SELECT path, workspace_id FROM projects").get().path, await realpath(fixture.workspacePath));
    assert.equal(db.prepare("SELECT workspace_id FROM projects").get().workspace_id, "ws-real");
  } finally {
    closeDatabase(db);
  }
  assert.deepEqual((await readdir(fixture.dataDir)).sort(), ["files", "tmp", "vectors", "uploads", "stale-user-file.txt", "workbench.sqlite"].sort());
});

test("reset-demo preserves sibling workspaces, sessions, projects, and global settings", async (t) => {
  const fixture = await makeFixture(t);
  const siblingPath = join(fixture.root, "Sibling-Workspace");
  await mkdir(siblingPath);

  const workspace = JSON.parse(await readFile(fixture.workspaceFile, "utf8"));
  workspace.global.workspaceIds.push("ws-sibling");
  workspace.global.archivedSessionIds.push("keep-session");
  workspace.tables.workspaces["ws-sibling"] = {
    path: siblingPath,
    title: "Sibling",
    sessionIds: ["keep-session"],
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
  await writeFile(fixture.workspaceFile, JSON.stringify(workspace, null, 2));

  const cacheFile = join(fixture.dshHome, "storages", "session_projcache.json");
  const cache = JSON.parse(await readFile(cacheFile, "utf8"));
  cache.tables.sessions["keep-session"] = { identity: { cwd: siblingPath } };
  await writeFile(cacheFile, JSON.stringify(cache, null, 2));

  const siblingBucket = join(fixture.dshHome, "sessions", "sibling-bucket", "keep-session");
  await mkdir(siblingBucket, { recursive: true });
  await writeFile(join(siblingBucket, "session.jsonl.zstd"), "keep");

  const db = openDatabase({ dataDir: fixture.dataDir });
  try {
    const repositories = createRepositories(db);
    const sibling = repositories.projects.create({
      workspaceId: "ws-sibling",
      name: "Sibling",
      path: siblingPath,
      now: new Date("2026-08-21T04:00:00.000Z"),
    });
    repositories.todos.create({
      projectId: sibling.id,
      title: "Preserve sibling todo",
      dueAt: "2026-08-22T10:00:00.000Z",
      source: "manual",
      now: new Date("2026-08-21T04:00:00.000Z"),
    });
    repositories.settings.set("network", { mode: "direct" }, new Date("2026-08-21T04:00:00.000Z"));
    repositories.workbenchSessions.create({
      sessionId: "keep-session",
      scope: { kind: "project", id: sibling.id },
      provider: "deepseek-official",
      model: "deepseek-v4-flash",
      now: new Date("2026-08-21T04:00:00.000Z"),
    });
  } finally {
    closeDatabase(db);
  }

  await resetDemo(options(fixture));

  const afterWorkspace = JSON.parse(await readFile(fixture.workspaceFile, "utf8"));
  assert.deepEqual(afterWorkspace.tables.workspaces["ws-real"].sessionIds, []);
  assert.deepEqual(afterWorkspace.tables.workspaces["ws-sibling"].sessionIds, ["keep-session"]);
  assert.deepEqual(afterWorkspace.global.archivedSessionIds, ["keep-session"]);
  const afterCache = JSON.parse(await readFile(cacheFile, "utf8"));
  assert.deepEqual(Object.keys(afterCache.tables.sessions), ["keep-session"]);
  assert.equal(await readFile(join(siblingBucket, "session.jsonl.zstd"), "utf8"), "keep");

  const afterDb = openDatabase({ dataDir: fixture.dataDir });
  try {
    assert.equal(afterDb.prepare("SELECT COUNT(*) AS count FROM projects").get().count, 2);
    assert.equal(afterDb.prepare("SELECT COUNT(*) AS count FROM projects WHERE workspace_id='ws-sibling'").get().count, 1);
    assert.equal(afterDb.prepare("SELECT COUNT(*) AS count FROM todos WHERE title='Preserve sibling todo'").get().count, 1);
    assert.equal(afterDb.prepare("SELECT COUNT(*) AS count FROM workbench_sessions WHERE session_id='keep-session'").get().count, 1);
    assert.deepEqual(JSON.parse(afterDb.prepare("SELECT value FROM workbench_settings WHERE key='network'").get().value), { mode: "direct" });
  } finally {
    closeDatabase(afterDb);
  }
});

test("reset-demo fails closed before changing anything when DSH is running", async (t) => {
  const fixture = await makeFixture(t);
  const beforeWorkspace = await readFile(fixture.workspaceFile, "utf8");
  await assert.rejects(
    resetDemo(options(fixture, { checkStopped: async () => false })),
    /DSH must be stopped/,
  );
  assert.equal(await readFile(fixture.workspaceFile, "utf8"), beforeWorkspace);
  assert.deepEqual((await readdir(fixture.dataDir)).sort(), ["stale-user-file.txt", "workbench.sqlite", "workbench.sqlite-shm", "workbench.sqlite-wal"].sort());
});

test("reset-demo rejects a path that is not an unambiguous DSH workspace", async (t) => {
  const fixture = await makeFixture(t);
  const unknownPath = join(fixture.root, "Other");
  await mkdir(unknownPath);
  await assert.rejects(
    resetDemo(options(fixture, { workspacePath: unknownPath })),
    /workspace path does not resolve to exactly one configured workspace/,
  );
  assert.deepEqual((await readdir(fixture.dataDir)).sort(), ["stale-user-file.txt", "workbench.sqlite", "workbench.sqlite-shm", "workbench.sqlite-wal"].sort());
});

test("reset-demo argument parser rejects missing values and requires explicit development mode", () => {
  assert.throws(() => parseResetArgs(["--dev", "--workspace-path="]), /requires a value/);
  assert.throws(() => parseResetArgs(["--workspace-path", "/tmp/workspace"]), /--dev/);
  const parsed = parseResetArgs([
    "--dev",
    "--dry-run",
    "--workspace-path",
    "/tmp/workspace",
    "--timezone",
    "America/Los_Angeles",
  ]);
  assert.equal(parsed.dryRun, true);
  assert.equal(parsed.timezone, "America/Los_Angeles");
});

test("reset-demo reports the plan before stopped verification and the first mutation", async (t) => {
  const fixture = await makeFixture(t);
  const events = [];
  let report;
  await resetDemo(options(fixture, {
    report: (value) => { events.push("report"); report = JSON.parse(value); },
    checkStopped: async () => { events.push("checkStopped"); return true; },
    onMutation: () => events.push("firstMutation"),
  }));
  assert.deepEqual(events.slice(0, 3), ["report", "checkStopped", "firstMutation"]);
  assert.equal(report.targets.dataDir, await realpath(fixture.dataDir));
  assert.equal(report.workspace.id, "ws-real");
  assert.deepEqual(report.seed, {
    projects: 1, todos: 6, summaries: 3, knowledgeBases: 0,
    documents: 0, vectors: 0, uploads: 0, sessions: 0,
  });
});

test("dry-run reports only the plan and never probes or mutates", async (t) => {
  const fixture = await makeFixture(t);
  const events = [];
  const result = await resetDemo(options(fixture, {
    dryRun: true,
    report: () => events.push("report"),
    checkStopped: async () => { events.push("checkStopped"); throw new Error("must not probe"); },
    onMutation: () => events.push("mutation"),
  }));
  assert.equal(result.dryRun, true);
  assert.deepEqual(events, ["report"]);
  assert.deepEqual((await readdir(fixture.dataDir)).sort(), ["stale-user-file.txt", "workbench.sqlite", "workbench.sqlite-shm", "workbench.sqlite-wal"].sort());
});

test("destructive reset requires an explicit port or PID and checks a non-default running port", async (t) => {
  const fixture = await makeFixture(t);
  await assert.rejects(
    resetDemo(options(fixture, { port: undefined, checkStopped: async () => { throw new Error("must not probe"); } })),
    /requires an explicit --dsh-pid or --port/,
  );
  await assert.rejects(
    resetDemo(options(fixture, { port: 62412, checkStopped: async () => false })),
    /DSH must be stopped/,
  );
  assert.deepEqual((await readdir(fixture.dataDir)).sort(), ["stale-user-file.txt", "workbench.sqlite", "workbench.sqlite-shm", "workbench.sqlite-wal"].sort());
});

test("reset-demo rejects broad, source-ancestor, and unmarked data roots before writing", async (t) => {
  const fixture = await makeFixture(t);
  const beforeData = (await readdir(fixture.dataDir)).sort();
  await assert.rejects(resetDemo(options(fixture, { dataDir: fixture.root })), /refusing/);
  const documents = join(fixture.root, "Documents");
  await mkdir(documents);
  await writeFile(join(documents, "notes.txt"), "not a Workbench root");
  await assert.rejects(resetDemo(options(fixture, { dataDir: documents })), /identified Workbench root/);
  const unmarked = join(fixture.root, "unmarked");
  await mkdir(unmarked);
  await writeFile(join(unmarked, "notes.txt"), "not a Workbench root");
  await assert.rejects(resetDemo(options(fixture, { dataDir: unmarked })), /identified Workbench root/);
  assert.deepEqual((await readdir(fixture.dataDir)).sort(), beforeData);
});

test("nonexistent leaf under a source symlink is rejected before report, probe, or mutation", async (t) => {
  const fixture = await makeFixture(t);
  const sourceLink = join(fixture.root, "link-to-source");
  await symlink(fixture.workspacePath, sourceLink, "dir");
  const events = [];
  await assert.rejects(
    resetDemo(options(fixture, {
      dataDir: join(sourceLink, "new-data-root"),
      report: () => events.push("report"),
      checkStopped: async () => { events.push("checkStopped"); return true; },
      onMutation: () => events.push("mutation"),
    })),
    /inside project source/,
  );
  assert.deepEqual(events, []);
  assert.equal((await readdir(fixture.workspacePath)).includes("new-data-root"), false);
});

test("nonexistent leaf under a safe symlink parent is canonicalized for dry-run and execution", async (t) => {
  const fixture = await makeFixture(t);
  const safeParent = join(fixture.root, "dedicated-data-parent");
  const safeLink = join(fixture.root, "link-to-dedicated-data");
  await mkdir(safeParent);
  await symlink(safeParent, safeLink, "dir");
  const symlinkTarget = join(safeLink, "new-data-root");
  const canonicalTarget = join(await realpath(safeParent), "new-data-root");

  let dryReport;
  const dryRun = await resetDemo(options(fixture, {
    dataDir: symlinkTarget,
    dryRun: true,
    report: (value) => { dryReport = JSON.parse(value); },
    checkStopped: async () => { throw new Error("dry-run must not probe"); },
  }));
  assert.equal(dryRun.plan.targets.dataDir, canonicalTarget);
  assert.equal(dryReport.targets.dataDir, canonicalTarget);
  assert.equal((await readdir(safeParent)).length, 0);

  let executionReport;
  await resetDemo(options(fixture, {
    dataDir: symlinkTarget,
    report: (value) => { executionReport = JSON.parse(value); },
  }));
  assert.equal(executionReport.targets.dataDir, canonicalTarget);
  assert.equal(await realpath(symlinkTarget), canonicalTarget);
  const db = openDatabase({ dataDir: canonicalTarget });
  try { assert.equal(db.prepare("SELECT COUNT(*) AS count FROM projects").get().count, 1); }
  finally { closeDatabase(db); }
});

test("backup cleanup failures are reported after commit without rollback or data loss", async (t) => {
  const fixture = await makeFixture(t);
  const result = await resetDemo(options(fixture, {
    cleanupBackup: async (path) => {
      if (path.includes("-data-")) throw new Error("injected data cleanup failure");
      await rm(path, { recursive: true, force: true });
    },
  }));
  assert.equal(result.cleanupWarnings.length, 1);
  assert.equal(result.cleanupWarnings[0].kind, "data");
  const db = openDatabase({ dataDir: fixture.dataDir });
  try {
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM projects").get().count, 1);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM todos").get().count, 6);
  } finally {
    closeDatabase(db);
  }
  assert.deepEqual(JSON.parse(await readFile(fixture.workspaceFile)).global.archivedSessionIds, []);
  assert.equal((await readdir(fixture.root)).some((name) => name.includes("reset-backup") && name.includes("-data-")), true);
});

test("session backup cleanup failure also keeps the committed target", async (t) => {
  const fixture = await makeFixture(t);
  const result = await resetDemo(options(fixture, {
    cleanupBackup: async (path) => {
      if (path.includes("-sessions-")) throw new Error("injected sessions cleanup failure");
      await rm(path, { recursive: true, force: true });
    },
  }));
  assert.equal(result.cleanupWarnings[0].kind, "sessions");
  assert.deepEqual(await readdir(join(fixture.dshHome, "sessions")), []);
  const db = openDatabase({ dataDir: fixture.dataDir });
  try { assert.equal(db.prepare("SELECT COUNT(*) AS count FROM projects").get().count, 1); }
  finally { closeDatabase(db); }
});

test("isDshStopped delegates the localhost probe and preserves its running/stopped result", async () => {
  assert.equal(await isDshStopped({ port: 3080, connect: async () => false }), false);
  assert.equal(await isDshStopped({ port: 3080, connect: async () => true }), true);
  assert.equal(await isDshStopped({ pid: process.pid, port: 62412, connect: async () => true }), false);
});
