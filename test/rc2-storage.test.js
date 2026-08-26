import assert from "node:assert/strict";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { createPurgeJobStore } from "../src/maintenance/purge-jobs.js";
import {
  commitRc2Purge,
  prepareRc2Purge,
  probeRc2PurgeBackend,
  readSessionDescendants,
  restoreRc2Purge,
} from "../src/maintenance/rc2-storage.js";

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function makeRc2Fixture(t, options = {}) {
  const root = await mkdtemp(join(tmpdir(), "cpwb-rc2-purge-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dshHome = join(root, "dsh");
  const dataDir = join(root, "workbench");
  const workspaceFile = join(dshHome, "storages", "workspace.json");
  const projectionFile = join(dshHome, "storages", "session_projcache.json");
  const sessions = options.sessions ?? [
    { id: "session-parent", cwdKey: "-work-research", parentSession: null },
    { id: "session-child", cwdKey: "-work-research", parentSession: "session-parent" },
    { id: "session-keep", cwdKey: "-work-other", parentSession: null },
  ];

  await mkdir(join(dshHome, "storages"), { recursive: true });
  await mkdir(join(dshHome, "sessions"), { recursive: true });
  await mkdir(join(dataDir, "files"), { recursive: true });
  await mkdir(join(dataDir, "vectors", "chunks.lance"), { recursive: true });

  const workspace = {
    unit: { name: "workspace", version: 2 },
    global: {
      initialized: true,
      workspaceIds: ["ws-research", "ws-other"],
      archivedSessionIds: ["session-child", "session-keep"],
      untouched: { preserve: true },
    },
    tables: {
      workspaces: {
        "ws-research": {
          path: "/work/research",
          sessionIds: ["session-parent", "session-child"],
          unknown: "keep-research",
        },
        "ws-other": {
          path: "/work/other",
          sessionIds: ["session-keep"],
          unknown: "keep-other",
        },
      },
    },
  };
  const cache = {
    unit: { name: "session_projcache", version: 3 },
    global: null,
    tables: {
      sessions: Object.fromEntries(
        sessions.map((entry) => [
          entry.id,
          {
            identity: { cwd: entry.cwdKey },
            ...(entry.parentSession == null ? {} : { parentSession: entry.parentSession }),
            payload: `payload-${entry.id}`,
          },
        ]),
      ),
    },
  };
  await writeFile(workspaceFile, `${JSON.stringify(workspace, null, 2)}\n`);
  await writeFile(projectionFile, `${JSON.stringify(cache, null, 2)}\n`);

  for (const session of sessions) {
    const directory = join(dshHome, "sessions", session.cwdKey, session.id);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, "session.jsonl.zstd"), `native-${session.id}`);
  }
  await writeFile(join(dataDir, "workbench.sqlite"), "sqlite-before");
  await writeFile(join(dataDir, "workbench.sqlite-wal"), "wal-before");
  await writeFile(join(dataDir, "vectors", "chunks.lance", "rows.lance"), "vectors-before");
  await writeFile(join(dataDir, "files", "a".repeat(64)), "orphan-before");

  return {
    root,
    dshHome,
    dataDir,
    workspaceFile,
    projectionFile,
    sessionPath(id, cwdKey = "-work-research") {
      return join(dshHome, "sessions", cwdKey, id);
    },
  };
}

async function createStorageJob(root, jobs, overrides = {}) {
  return jobs.create({
    jobId: overrides.jobId ?? "purge-storage",
    container: { kind: "project", id: 3, name: "Research" },
    sessionIds: overrides.sessionIds ?? ["session-parent"],
    descendantSessionIds: overrides.descendantSessionIds ?? ["session-child"],
    orphanDocuments: overrides.orphanDocuments ?? [{ id: 9, sha256: "a".repeat(64) }],
    createdAt: "2026-08-25T11:00:00.000Z",
  });
}

function sessionIds(document) {
  return Object.keys(document.tables.sessions).sort();
}

test("RC.2 probe and descendant expansion preserve an exact frozen graph", async (t) => {
  const root = await makeRc2Fixture(t);
  assert.deepEqual(await probeRc2PurgeBackend(root), {
    supported: true,
    backend: "rc2-jsonl-zstd",
    reason: null,
  });
  assert.deepEqual(
    await readSessionDescendants({ dshHome: root.dshHome, rootSessionIds: ["session-parent"] }),
    ["session-child"],
  );
});

test("prepare removes only frozen RC.2 sessions and restore reconstructs every layer", async (t) => {
  const root = await makeRc2Fixture(t);
  const jobs = createPurgeJobStore({ dshHome: root.dshHome });
  const job = await createStorageJob(root, jobs);
  const workspaceBefore = await readFile(root.workspaceFile, "utf8");
  const cacheBefore = await readFile(root.projectionFile, "utf8");

  const manifest = await prepareRc2Purge({ ...root, job, jobs });

  assert.equal(await pathExists(root.sessionPath("session-parent")), false);
  assert.equal(await pathExists(root.sessionPath("session-child")), false);
  assert.equal(await pathExists(root.sessionPath("session-keep", "-work-other")), true);
  const workspace = JSON.parse(await readFile(root.workspaceFile, "utf8"));
  const cache = JSON.parse(await readFile(root.projectionFile, "utf8"));
  assert.deepEqual(workspace.tables.workspaces["ws-research"].sessionIds, []);
  assert.deepEqual(workspace.tables.workspaces["ws-other"].sessionIds, ["session-keep"]);
  assert.deepEqual(workspace.global.archivedSessionIds, ["session-keep"]);
  assert.deepEqual(sessionIds(cache), ["session-keep"]);
  assert.equal(manifest.sessions.length, 2);

  await writeFile(join(root.dataDir, "workbench.sqlite"), "sqlite-mutated");
  await writeFile(join(root.dataDir, "vectors", "chunks.lance", "rows.lance"), "vectors-mutated");
  await restoreRc2Purge({ ...root, jobId: job.jobId, jobs });

  assert.equal(await pathExists(root.sessionPath("session-parent")), true);
  assert.equal(await pathExists(root.sessionPath("session-child")), true);
  assert.equal(await readFile(root.workspaceFile, "utf8"), workspaceBefore);
  assert.equal(await readFile(root.projectionFile, "utf8"), cacheBefore);
  assert.equal(await readFile(join(root.dataDir, "workbench.sqlite"), "utf8"), "sqlite-before");
  assert.equal(
    await readFile(join(root.dataDir, "vectors", "chunks.lance", "rows.lance"), "utf8"),
    "vectors-before",
  );
  assert.equal(await readFile(join(root.dataDir, "files", "a".repeat(64)), "utf8"), "orphan-before");
});

test("prepare rejects unsafe or ambiguous Session paths before mutation", async (t) => {
  const root = await makeRc2Fixture(t);
  const jobs = createPurgeJobStore({ dshHome: root.dshHome });
  const unsafeJob = await createStorageJob(root, jobs, {
    jobId: "purge-unsafe",
    sessionIds: ["../escape"],
  });
  await assert.rejects(
    () => prepareRc2Purge({ ...root, job: unsafeJob, jobs }),
    /session id/i,
  );

  const duplicate = root.sessionPath("session-parent", "-work-duplicate");
  await mkdir(duplicate, { recursive: true });
  await assert.rejects(
    prepareRc2Purge({ ...root, job: await createStorageJob(root, jobs, { jobId: "purge-duplicate" }), jobs }),
    /duplicate session directory/i,
  );
  assert.equal(await pathExists(root.sessionPath("session-parent")), true);
});

test("prepare rejects symbolic-link Session directories", async (t) => {
  const root = await makeRc2Fixture(t, {
    sessions: [{ id: "session-keep", cwdKey: "-work-other", parentSession: null }],
  });
  const outside = join(root.root, "outside-session");
  await mkdir(outside);
  await mkdir(join(root.dshHome, "sessions", "-work-research"), { recursive: true });
  await symlink(outside, root.sessionPath("session-parent"));
  const jobs = createPurgeJobStore({ dshHome: root.dshHome });
  const job = await createStorageJob(root, jobs, {
    jobId: "purge-symlink",
    descendantSessionIds: [],
    orphanDocuments: [],
  });

  await assert.rejects(prepareRc2Purge({ ...root, job, jobs }), /symbolic link/i);
  assert.equal(await pathExists(outside), true);
});

test("malformed metadata and injected move failures leave live data unchanged", async (t) => {
  const malformed = await makeRc2Fixture(t);
  const malformedJobs = createPurgeJobStore({ dshHome: malformed.dshHome });
  const malformedJob = await createStorageJob(malformed, malformedJobs, { jobId: "purge-malformed" });
  await writeFile(malformed.projectionFile, "{broken");
  await assert.rejects(
    prepareRc2Purge({ ...malformed, job: malformedJob, jobs: malformedJobs }),
    /invalid JSON/i,
  );
  assert.equal(await pathExists(malformed.sessionPath("session-parent")), true);

  const injected = await makeRc2Fixture(t);
  const injectedJobs = createPurgeJobStore({ dshHome: injected.dshHome });
  const injectedJob = await createStorageJob(injected, injectedJobs, { jobId: "purge-injected" });
  await assert.rejects(
    prepareRc2Purge({
      ...injected,
      job: injectedJob,
      jobs: injectedJobs,
      faultInjector(event) {
        if (event === "session-moved:1") throw new Error("injected move failure");
      },
    }),
    /injected move failure/,
  );
  assert.equal(await pathExists(injected.sessionPath("session-parent")), true);
  assert.equal(await pathExists(injected.sessionPath("session-child")), true);
  assert.equal(await pathExists(join(injected.dataDir, "files", "a".repeat(64))), true);
});

test("commit verifies absence before removing backup and quarantine", async (t) => {
  const root = await makeRc2Fixture(t);
  const jobs = createPurgeJobStore({ dshHome: root.dshHome });
  const job = await createStorageJob(root, jobs, { jobId: "purge-commit" });
  const manifest = await prepareRc2Purge({ ...root, job, jobs });

  await mkdir(root.sessionPath("session-parent"), { recursive: true });
  await assert.rejects(commitRc2Purge({ ...root, jobId: job.jobId, jobs }), /still exists/i);
  assert.equal(await pathExists(manifest.backupRoot), true);
  await rm(root.sessionPath("session-parent"), { recursive: true, force: true });

  for (const [from, to] of [
    ["queued", "stopping"],
    ["stopping", "quarantining"],
    ["quarantining", "native_refs_updated"],
    ["native_refs_updated", "restarting"],
    ["restarting", "workbench_finalizing"],
    ["workbench_finalizing", "verifying"],
  ]) {
    await jobs.transition(job.jobId, from, to);
  }
  await commitRc2Purge({ ...root, jobId: job.jobId, jobs });
  assert.equal((await jobs.read(job.jobId)).state, "completed");
  assert.equal(await pathExists(manifest.backupRoot), false);
  assert.equal(await pathExists(manifest.quarantineRoot), false);
  assert.deepEqual(await readdir(join(jobs.root, job.jobId)), ["manifest.json", "state.json"]);
});
