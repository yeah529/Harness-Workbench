import assert from "node:assert/strict";
import { readFile, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { createPurgeJobStore } from "../src/maintenance/purge-jobs.js";

async function createFixture(t) {
  const dshHome = await mkdtemp(join(tmpdir(), "cpwb-purge-jobs-"));
  t.after(() => rm(dshHome, { recursive: true, force: true }));
  return {
    dshHome,
    jobs: createPurgeJobStore({ dshHome }),
  };
}

test("purge jobs persist legal transitions and reject stale writers", async (t) => {
  const { dshHome, jobs } = await createFixture(t);
  const created = await jobs.create({
    jobId: "purge-1",
    container: { kind: "project", id: 7, name: "Research" },
    sessionIds: ["session-a"],
    descendantSessionIds: [],
    orphanDocuments: [],
    createdAt: "2026-08-25T10:00:00.000Z",
  });

  assert.equal(created.state, "queued");
  assert.equal(created.revision, 1);

  const armed = await jobs.arm("purge-1");
  assert.equal(armed.armed, true);

  const stopping = await jobs.transition("purge-1", "queued", "stopping", {
    generation: "g-1",
  });
  assert.equal(stopping.revision, 3);
  await assert.rejects(
    () => jobs.transition("purge-1", "queued", "quarantining"),
    /expected queued.*found stopping/i,
  );

  const disk = JSON.parse(
    await readFile(
      join(dshHome, "cyberpunk-workbench/maintenance/purge-1/state.json"),
      "utf8",
    ),
  );
  assert.equal(disk.state, "stopping");
});

test("purge jobs use an exclusive owner lock and generation ready markers", async (t) => {
  const { jobs } = await createFixture(t);
  const owner = { pid: 123, generation: "g-1" };

  await jobs.acquireLock(owner);
  await assert.rejects(
    () => jobs.acquireLock({ pid: 456, generation: "g-2" }),
    /lock/i,
  );

  await jobs.writeReady("g-1", {
    jobId: "purge-1",
    readyAt: "2026-08-25T10:00:03.000Z",
  });
  assert.equal((await jobs.readReady("g-1")).jobId, "purge-1");

  await assert.rejects(
    () => jobs.releaseLock({ pid: 456, generation: "g-2" }),
    /owner/i,
  );
  await jobs.releaseLock(owner);
});

test("purge jobs reject path-like identifiers and list only incomplete jobs", async (t) => {
  const { jobs } = await createFixture(t);

  await assert.rejects(() => jobs.read("../escape"), /job id/i);
  await assert.rejects(() => jobs.readReady("../escape"), /generation/i);

  await jobs.create({
    jobId: "purge-a",
    container: { kind: "knowledge-base", id: 4, name: "Specs" },
    sessionIds: [],
    descendantSessionIds: [],
    orphanDocuments: [],
    createdAt: "2026-08-25T10:00:00.000Z",
  });
  await jobs.create({
    jobId: "purge-b",
    container: { kind: "project", id: 8, name: "Workbench" },
    sessionIds: [],
    descendantSessionIds: [],
    orphanDocuments: [],
    createdAt: "2026-08-25T10:00:01.000Z",
  });
  await jobs.transition("purge-b", "queued", "restored");

  assert.deepEqual(
    (await jobs.listIncomplete()).map((job) => job.jobId),
    ["purge-a"],
  );
});
