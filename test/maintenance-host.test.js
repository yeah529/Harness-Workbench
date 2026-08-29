import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { closeDatabase, openDatabase } from "../src/host/database.js";
import { createMaintenanceService } from "../src/host/maintenance.js";
import { createRepositories } from "../src/host/repositories.js";
import { createPurgeJobStore } from "../src/maintenance/purge-jobs.js";

async function makeFixture(t) {
  const root = await mkdtemp(join(tmpdir(), "cpwb-maintenance-host-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dshHome = join(root, "dsh");
  const dataDir = join(root, "data");
  await mkdir(join(dshHome, "storages"), { recursive: true });
  await writeFile(
    join(dshHome, "storages", "workspace.json"),
    JSON.stringify({
      global: { archivedSessionIds: [] },
      tables: { workspaces: { "ws-1": { sessionIds: ["session-parent", "session-child"] } } },
    }),
  );
  await writeFile(
    join(dshHome, "storages", "session_projcache.json"),
    JSON.stringify({
      tables: {
        sessions: {
          "session-parent": { identity: { cwd: "/work/research" } },
          "session-child": {
            identity: { cwd: "/work/research" },
            parentSession: { sessionId: "session-parent" },
          },
        },
      },
    }),
  );
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(() => closeDatabase(db));
  return { root, dshHome, dataDir, repos };
}

test("supervised host freezes a server-derived purge plan", async (t) => {
  const fixture = await makeFixture(t);
  const project = fixture.repos.projects.create({ name: "Research" });
  fixture.repos.workbenchSessions.create({
    sessionId: "session-parent",
    scope: { kind: "project", id: project.id },
  });
  fixture.repos.sessionFiles.create({
    sessionId: "session-parent",
    sha256: "d".repeat(64),
    originalName: "brief.md",
    size: 5,
    parseStatus: "ready",
    contextText: "brief",
    contextCodePoints: 5,
  });
  const jobs = createPurgeJobStore({ dshHome: fixture.dshHome });
  const service = createMaintenanceService({
    ...fixture,
    env: { CPWB_SUPERVISED: "1" },
    jobs,
    vectorIndex: {},
  });

  assert.deepEqual(service.capability(), {
    available: true,
    requiresRestart: true,
    backend: "rc2-jsonl-zstd",
    reason: null,
  });
  const plan = await service.containerPlan("project", project.id);
  assert.deepEqual(plan.sessionIds, ["session-parent"]);
  assert.deepEqual(plan.descendantSessionIds, ["session-child"]);
  assert.deepEqual(plan.orphanSessionFiles, [{ sha256: "d".repeat(64) }]);
  await assert.rejects(
    () => service.createPurgeJob({
      kind: "project",
      id: project.id,
      name: "Wrong",
      restartConfirmed: true,
      planVersion: plan.planVersion,
    }),
    /exact container name/i,
  );
  const job = await service.createPurgeJob({
    kind: "project",
    id: project.id,
    name: "Research",
    restartConfirmed: true,
    planVersion: plan.planVersion,
  });
  assert.deepEqual(job.sessionIds, ["session-parent"]);
  assert.deepEqual(job.descendantSessionIds, ["session-child"]);
  assert.deepEqual(job.orphanSessionFiles, [{ sha256: "d".repeat(64) }]);
  assert.equal(job.armed, false);
  assert.equal((await service.armPurgeJob(job.jobId)).armed, true);
});

test("supervised startup finalizes exact vectors and Workbench rows before readiness", async (t) => {
  const fixture = await makeFixture(t);
  const project = fixture.repos.projects.create({ name: "Research" });
  const document = fixture.repos.documents.upsertBySha256({
    sha256: "c".repeat(64),
    originalName: "private.md",
  });
  fixture.repos.documents.link({ documentId: document.id, scope: "project", scopeId: project.id });
  fixture.repos.workbenchSessions.create({
    sessionId: "session-parent",
    scope: { kind: "project", id: project.id },
  });
  const jobs = createPurgeJobStore({ dshHome: fixture.dshHome });
  await jobs.create({
    jobId: "purge-host",
    container: { kind: "project", id: project.id, name: "Research" },
    sessionIds: ["session-parent"],
    descendantSessionIds: ["session-child"],
    orphanDocuments: [{ id: document.id, sha256: document.sha256 }],
    orphanSessionFiles: [],
    createdAt: "2026-08-25T10:00:00.000Z",
  });
  for (const [from, to] of [
    ["queued", "stopping"],
    ["stopping", "quarantining"],
    ["quarantining", "native_refs_updated"],
    ["native_refs_updated", "restarting"],
  ]) await jobs.transition("purge-host", from, to);

  const vectorDeletes = { sessions: [], documents: [] };
  const service = createMaintenanceService({
    ...fixture,
    env: {
      CPWB_SUPERVISED: "1",
      CPWB_MAINTENANCE_JOB_ID: "purge-host",
      CPWB_LAUNCH_GENERATION: "generation-2",
    },
    jobs,
    vectorIndex: {
      async deleteSession(id) { vectorDeletes.sessions.push(id); },
      async deleteDocument(id) { vectorDeletes.documents.push(id); },
    },
  });

  assert.equal(service.isLocked(), true);
  await service.finalizeStartupJob();
  assert.deepEqual(vectorDeletes.sessions.sort(), ["session-child", "session-parent"]);
  assert.deepEqual(vectorDeletes.documents, [document.id]);
  assert.equal(fixture.repos.projects.get(project.id), null);
  assert.equal((await jobs.read("purge-host")).state, "verifying");
  assert.equal(service.isLocked(), false);
  await service.markGenerationReady();
  assert.equal((await jobs.readReady("generation-2")).jobId, "purge-host");
});
