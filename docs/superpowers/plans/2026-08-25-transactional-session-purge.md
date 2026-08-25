# Transactional Session Purge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add safe permanent project and knowledge-chip deletion that stops DSH, removes only the frozen native sessions and Workbench data, automatically restarts, and restores everything if restart or finalization fails.

**Architecture:** `dsh-workbench` becomes the sole supervisor for destructive RC.2 maintenance. A small durable job ledger under `DSH_HOME` coordinates the Host and Launcher; the Launcher owns offline storage snapshots and restart recovery, while the Host owns exact Workbench database/vector finalization. The browser performs two confirmations and keeps a full-screen maintenance surface alive across the temporary server disconnect.

**Tech Stack:** Node.js 22 ESM, `node:fs/promises`, `node:sqlite`, React 18, existing Phosphor icons, native CSS, Node test runner, DeepSeek Harness `0.1.1-rc.2`.

**Spec:** `docs/superpowers/specs/2026-08-25-transactional-session-purge-design.md`

## Global Constraints

- Work only in the registered linked worktree `.worktrees/rc2-workbench-fusion` on branch `feat/rc2-workbench-fusion`; never edit the primary `main` checkout.
- Preserve all pre-existing dirty changes and stage only files listed by each task.
- Target DeepSeek Harness `0.1.1-rc.2` and its JSONL.Zstd sessions plus JSON Workspace/projection stores.
- Direct `dsh web` must fail closed for permanent deletion; only `dsh-workbench web` exposes the capability.
- Never delete entire `sessions/`, `workspace.json`, `session_projcache.json`, `DSH_HOME`, or a Workspace source directory.
- Never accept filesystem paths or Session ID lists from the browser.
- Do not add a dependency; use Node standard-library filesystem, process, crypto and test APIs.
- Keep existing detach-to-independent deletion behavior available and non-restarting.
- Use the existing React, Phosphor and CSS system; do not replace DSH native conversation or settings composition.
- Cyberpunk maintenance UI is a preserve-style redesign: deep charcoal and wine background, cyan system lines, amber destructive action, sharp clipped geometry, no rounded generic cards.
- Visible UI copy contains no em dash or en dash characters.
- Every animated maintenance element must stop under `prefers-reduced-motion: reduce`.
- Do not report successful deletion until native Session directories/references, Workbench rows, session vectors and orphan document vectors/files are all absent and the new Host generation is ready.

## File Structure

### New files

- `src/maintenance/purge-jobs.js`: durable job records, legal state transitions, atomic JSON writes, single-job lock and ready markers shared by Host and Launcher.
- `src/maintenance/rc2-storage.js`: RC.2 backend detection, descendant discovery, exact native-reference editing, snapshots, quarantine, restore and commit.
- `src/host/maintenance.js`: capability projection, frozen container plan creation, startup finalization and maintenance lock.
- `src/client/MaintenanceScreen.js`: restart confirmation result surface, disconnect-aware polling and full-screen Cyberpunk maintenance UI.
- `test/purge-jobs.test.js`: state-machine and durable-ledger tests.
- `test/rc2-storage.test.js`: exact storage mutation, path safety and restore tests.
- `test/maintenance-host.test.js`: Host plan/finalization/capability tests.
- `test/maintenance-client.test.js`: confirmation, polling, recovery and responsive markup tests.
- `test/maintenance-supervisor.test.js`: real child-process restart and rollback fault-injection tests.

### Modified files

- `package.json`: ship `src/maintenance` in the npm package.
- `bin/dsh-workbench.js`: invoke the supervised launcher without changing user-facing CLI syntax.
- `src/launcher/process.js`: preserve launch arguments and supervise one DSH child through maintenance restart/recovery.
- `src/host/repositories.js`: add one transactional exact-container purge operation.
- `src/host/index.js`: construct maintenance service, gate business writes, finalize restart jobs and emit generation-ready markers.
- `src/host/api.js`: expose capability, create/status routes and stable purge errors.
- `src/client/api.js`: add maintenance endpoints and new deletion capability shape.
- `src/client/store.js`: hold and refresh maintenance job state without turning disconnects into terminal failures.
- `src/client/ContainerDeleteDialog.js`: add the explicit second restart confirmation.
- `src/client/WorkbenchShell.js`: render the maintenance screen above all Workbench views.
- `src/client/workbench.css`: implement the confirmed responsive maintenance visual and dialog states.
- `test/api.test.js`, `test/client.test.js`, `test/unified-session-ui.test.js`, `test/launcher.test.js`, `test/css.test.js`: update existing contracts and add regressions.
- `scripts/verify.cjs`: assert packaged production code contains the new routes/components and no unsafe delete fallback.
- `README.md`: document restart behavior, supported backend and automatic/manual recovery.

---

### Task 1: Durable purge job ledger

**Files:**
- Create: `src/maintenance/purge-jobs.js`
- Create: `test/purge-jobs.test.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `PURGE_STATES`, `ACTIVE_PURGE_STATES`, `resolveMaintenanceRoot({ dshHome })`, `createPurgeJobStore({ dshHome })`.
- `createPurgeJobStore` returns `create(request)`, `read(jobId)`, `listIncomplete()`, `arm(jobId)`, `transition(jobId, expectedState, nextState, patch)`, `writeManifest(jobId, manifest)`, `readManifest(jobId)`, `writeReady(generation, payload)`, `readReady(generation)`, `acquireLock(owner)`, and `releaseLock(owner)`.
- Later tasks rely on `transition` rejecting stale revisions and illegal state changes.

- [ ] **Step 1: Write the failing state and persistence tests**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createPurgeJobStore } from "../src/maintenance/purge-jobs.js";

test("purge jobs persist legal transitions and reject stale writers", async (t) => {
  const dshHome = await mkdtemp(join(tmpdir(), "cpwb-purge-jobs-"));
  t.after(() => rm(dshHome, { recursive: true, force: true }));
  const jobs = createPurgeJobStore({ dshHome });
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
  const stopping = await jobs.transition("purge-1", "queued", "stopping", { generation: "g-1" });
  assert.equal(stopping.revision, 3);
  await assert.rejects(
    () => jobs.transition("purge-1", "queued", "quarantining"),
    /expected queued.*found stopping/i,
  );
  const disk = JSON.parse(await readFile(join(dshHome, "cyberpunk-workbench/maintenance/purge-1/state.json"), "utf8"));
  assert.equal(disk.state, "stopping");
});
```

- [ ] **Step 2: Run the focused test and confirm the missing module failure**

Run: `node --test test/purge-jobs.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/maintenance/purge-jobs.js`.

- [ ] **Step 3: Implement the minimum atomic job store**

Implement the exported state constants and this transition boundary:

```js
export const PURGE_STATES = Object.freeze([
  "queued", "stopping", "quarantining", "native_refs_updated",
  "restarting", "workbench_finalizing", "verifying", "completed",
  "restoring", "restored", "rollback_pending",
]);

const NEXT = new Map([
  ["queued", new Set(["stopping", "restored"])],
  ["stopping", new Set(["quarantining", "restoring", "restored"])],
  ["quarantining", new Set(["native_refs_updated", "restoring"])],
  ["native_refs_updated", new Set(["restarting", "restoring"])],
  ["restarting", new Set(["workbench_finalizing", "restoring"])],
  ["workbench_finalizing", new Set(["verifying", "restoring"])],
  ["verifying", new Set(["completed", "restoring"])],
  ["restoring", new Set(["restored", "rollback_pending"])],
]);

function assertTransition(current, next) {
  if (!NEXT.get(current)?.has(next)) {
    throw new Error(`illegal purge transition: ${current} -> ${next}`);
  }
}
```

Use `mkdir`, `open`, `writeFile`, `rename`, `readFile` and `rm` from `node:fs/promises`. Atomic JSON writes must create a sibling temporary file with mode `0o600`, sync the file handle, close it and rename it over the target. `acquireLock` uses `open(lockPath, "wx", 0o600)`; it never silently replaces an existing lock.

Add `"src/maintenance"` to `package.json.files` because the launcher imports these source modules at package runtime.

- [ ] **Step 4: Add lock, ready-marker and invalid-input assertions**

Extend the test with exact assertions for:

```js
await jobs.acquireLock({ pid: 123, generation: "g-1" });
await assert.rejects(() => jobs.acquireLock({ pid: 456, generation: "g-2" }), /lock/i);
await jobs.writeReady("g-1", { jobId: "purge-1", readyAt: "2026-08-25T10:00:03.000Z" });
assert.equal((await jobs.readReady("g-1")).jobId, "purge-1");
await jobs.releaseLock({ pid: 123, generation: "g-1" });
await assert.rejects(() => jobs.read("../escape"), /job id/i);
```

- [ ] **Step 5: Run the job tests**

Run: `node --test test/purge-jobs.test.js`

Expected: all purge job tests PASS.

- [ ] **Step 6: Commit only the ledger files**

```bash
git add src/maintenance/purge-jobs.js test/purge-jobs.test.js package.json
git commit -m "feat: add durable purge job ledger"
```

### Task 2: RC.2 offline storage transaction

**Files:**
- Create: `src/maintenance/rc2-storage.js`
- Create: `test/rc2-storage.test.js`

**Interfaces:**
- Consumes: `createPurgeJobStore` manifest paths from Task 1.
- Produces: `probeRc2PurgeBackend({ dshHome, dataDir })`, `readSessionDescendants({ dshHome, rootSessionIds })`, `prepareRc2Purge({ dshHome, dataDir, job, jobs })`, `restoreRc2Purge({ dshHome, dataDir, jobId, jobs })`, and `commitRc2Purge({ dshHome, dataDir, jobId, jobs })`.
- `prepareRc2Purge` returns a manifest with exact native Session paths, original JSON hashes, Workbench snapshot members, quarantined orphan files and non-target semantic fingerprints.

- [ ] **Step 1: Build a real RC.2 temporary fixture and write the failing exact-delete test**

```js
test("prepare removes only frozen RC.2 sessions and restore reconstructs every layer", async (t) => {
  const root = await makeRc2Fixture(t, {
    sessions: [
      { id: "session-parent", cwdKey: "-work-research", parentSession: null },
      { id: "session-child", cwdKey: "-work-research", parentSession: "session-parent" },
      { id: "session-keep", cwdKey: "-work-other", parentSession: null },
    ],
  });
  const jobs = createPurgeJobStore({ dshHome: root.dshHome });
  const job = await jobs.create({
    jobId: "purge-storage",
    container: { kind: "project", id: 3, name: "Research" },
    sessionIds: ["session-parent"],
    descendantSessionIds: ["session-child"],
    orphanDocuments: [{ id: 9, sha256: "a".repeat(64) }],
    createdAt: "2026-08-25T11:00:00.000Z",
  });
  await prepareRc2Purge({ dshHome: root.dshHome, dataDir: root.dataDir, job, jobs });
  assert.equal(await pathExists(root.sessionPath("session-parent")), false);
  assert.equal(await pathExists(root.sessionPath("session-child")), false);
  assert.equal(await pathExists(root.sessionPath("session-keep")), true);
  assert.deepEqual(await workspaceSessionIds(root.workspaceFile), ["session-keep"]);
  assert.deepEqual(await projectionIds(root.projectionFile), ["session-keep"]);
  await restoreRc2Purge({ dshHome: root.dshHome, dataDir: root.dataDir, jobId: job.jobId, jobs });
  assert.equal(await pathExists(root.sessionPath("session-parent")), true);
  assert.deepEqual(await workspaceSessionIds(root.workspaceFile), ["session-child", "session-keep", "session-parent"]);
});
```

- [ ] **Step 2: Run the storage test and confirm the missing module failure**

Run: `node --test test/rc2-storage.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/maintenance/rc2-storage.js`.

- [ ] **Step 3: Implement backend probing, exact Session lookup and descendant expansion**

`probeRc2PurgeBackend` must parse `storages/workspace.json` and `storages/session_projcache.json`, verify `tables.sessions` is an object, verify the Workbench database path stays under `dataDir`, and return:

```js
{
  supported: true,
  backend: "rc2-jsonl-zstd",
  reason: null,
}
```

`readSessionDescendants` walks `tables.sessions` by `parentSession`, accepts either a parent ID string or `{ sessionId }`, uses a visited set and throws `PURGE_SESSION_GRAPH_AMBIGUOUS` if a cycle or conflicting parent is found.

Exact Session directory lookup scans only `sessions/<cwd-key>/<session-id>`, rejects symbolic links, rejects duplicate matches, and validates Session IDs with `/^[A-Za-z0-9._-]+$/` before joining paths.

- [ ] **Step 4: Implement preparation with safe snapshots and exact JSON edits**

Use these standard-library rules:

```js
import { constants as fsConstants } from "node:fs";
import { copyFile, cp, lstat, mkdir, readFile, rename, rm } from "node:fs/promises";

async function cloneFile(source, destination) {
  try {
    await copyFile(source, destination, fsConstants.COPYFILE_FICLONE);
  } catch (error) {
    if (!["ENOTSUP", "EINVAL", "EXDEV"].includes(error?.code)) throw error;
    await copyFile(source, destination);
  }
}
```

Preparation must:

1. Copy `workspace.json`, `session_projcache.json`, `workbench.sqlite`, optional `-wal`/`-shm`, and the complete shared LanceDB `vectors/` directory into the job backup. The full vector snapshot is required because target and non-target rows share LanceDB tables.
2. Move only frozen Session directories and `dataDir/files/<orphan-sha256>` into job quarantine.
3. Remove only matching IDs from `global.archivedSessionIds`, every Workspace `sessionIds`, and `tables.sessions`.
4. Write both JSON files atomically and preserve unknown fields.
5. Re-read both files, compare non-target semantic fingerprints and persist the manifest before returning.

- [ ] **Step 5: Implement restore and commit**

`restoreRc2Purge` executes only while DSH is stopped. It restores native JSON files, Workbench SQLite members, the full vector snapshot, quarantined Session directories and orphan files, and leaves the job in `restoring`. Only the Launcher may transition to `restored`, after the recovery child has emitted a matching ready marker.

`commitRc2Purge` first verifies all target paths and references remain absent, then removes only the current job's `backup/` and `quarantine/` directories and transitions `verifying` to `completed`. It retains a metadata-only `state.json` and `manifest.json` with message content excluded.

- [ ] **Step 6: Add safety and fault-injection cases**

Add tests that assert:

- a symbolic-link Session directory is rejected;
- a Session ID containing `/` or `..` is rejected;
- duplicate Session directories are rejected;
- malformed JSON causes no file move;
- injected failure after one Session move restores the first move;
- a non-target Workspace field and non-target Session payload survive byte-for-byte after restore;
- commit removes the quarantine only after absence verification;
- the vector backup restores non-target and target table files after a simulated Host mutation.

- [ ] **Step 7: Run the storage tests**

Run: `node --test test/purge-jobs.test.js test/rc2-storage.test.js`

Expected: all tests PASS.

- [ ] **Step 8: Commit only the RC.2 adapter files**

```bash
git add src/maintenance/rc2-storage.js test/rc2-storage.test.js
git commit -m "feat: add recoverable rc2 session storage purge"
```

### Task 3: Host maintenance planning and exact Workbench finalization

**Files:**
- Create: `src/host/maintenance.js`
- Create: `test/maintenance-host.test.js`
- Modify: `src/host/repositories.js`
- Modify: `src/host/index.js`
- Modify: `test/database.test.js`
- Modify: `test/host-lifecycle.test.js`

**Interfaces:**
- Consumes: Task 1 job store and Task 2 RC.2 probe/descendant reader.
- Produces: `createMaintenanceService({ env, dshHome, dataDir, repos, vectorIndex, jobs })` with `capability()`, `containerPlan(kind, id)`, `createPurgeJob(input)`, `armPurgeJob(jobId)`, `getJob(jobId)`, `isLocked()`, `finalizeStartupJob()`, and `markGenerationReady()`.
- Adds `repos.maintenance.purgeContainer({ kind, id, expectedSessionIds, expectedOrphanDocumentIds })`.

- [ ] **Step 1: Write failing repository atomicity tests**

```js
test("maintenance purge removes the frozen container graph in one transaction", () => {
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const project = repos.projects.create({ name: "Research" });
  repos.workbenchSessions.create({ sessionId: "session-a", scope: { kind: "project", id: project.id } });
  repos.todos.create({ projectId: project.id, title: "Ship", dueAt: "2026-08-26T10:00:00.000Z" });
  const removed = repos.maintenance.purgeContainer({
    kind: "project",
    id: project.id,
    expectedSessionIds: ["session-a"],
    expectedOrphanDocumentIds: [],
  });
  assert.equal(removed.container.name, "Research");
  assert.equal(repos.projects.get(project.id), null);
  assert.equal(repos.workbenchSessions.get("session-a"), null);
  assert.deepEqual(repos.todos.list({ projectId: project.id }), []);
});
```

Add a stale-plan case where `session-b` is inserted after the expected list is frozen; assert the method throws and every project row remains.

- [ ] **Step 2: Run the repository tests and confirm the missing method failure**

Run: `node --test test/database.test.js`

Expected: FAIL because `repos.maintenance` is undefined.

- [ ] **Step 3: Implement one repository transaction**

Inside `createRepositories`, add a `maintenance` repository whose `purgeContainer`:

1. Calls the existing project or knowledge-base `deletionPlan`.
2. Compares sorted current and expected Session/document ID arrays.
3. Deletes only the expected `workbench_sessions` rows.
4. Deletes the container so foreign-key cascades remove todos, schedules, summaries and relationships.
5. Deletes only expected orphan document rows.
6. Returns the frozen plan.

Run all six operations inside the existing `transaction(db, callback)` helper. Do not add a schema migration or a second database.

- [ ] **Step 4: Write failing Host capability and finalization tests**

```js
test("supervised host advertises restart purge and finalizes the exact startup job", async () => {
  const service = createMaintenanceService({
    env: {
      CPWB_SUPERVISED: "1",
      CPWB_MAINTENANCE_JOB_ID: "purge-host",
      CPWB_LAUNCH_GENERATION: "generation-2",
    },
    dshHome,
    dataDir,
    repos,
    vectorIndex,
    jobs,
  });
  assert.deepEqual(service.capability(), {
    available: true,
    requiresRestart: true,
    backend: "rc2-jsonl-zstd",
    reason: null,
  });
  await service.finalizeStartupJob();
  assert.deepEqual(vectorDeletes.sessions.sort(), ["session-child", "session-parent"]);
  assert.equal(repos.projects.get(project.id), null);
  await service.markGenerationReady();
  assert.equal((await jobs.readReady("generation-2")).jobId, "purge-host");
});
```

- [ ] **Step 5: Run the Host test and confirm the missing service failure**

Run: `node --test test/maintenance-host.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/host/maintenance.js`.

- [ ] **Step 6: Implement the Host maintenance service**

`containerPlan(kind, id)` reads the repository plan, expands Subagent descendants from the RC.2 projection store, and returns counts plus an opaque `planVersion` generated from this stable JSON payload:

```js
JSON.stringify({
  kind,
  id,
  name: container.name,
  sessionIds: [...plan.sessionIds].sort(),
  descendantSessionIds: [...descendants].sort(),
  orphanDocumentIds: plan.orphanDocuments.map((document) => document.id).sort((a, b) => a - b),
})
```

`createPurgeJob` requires exact name, `restartConfirmed === true`, a matching `planVersion`, no active job, and a supported supervised backend. It writes only server-derived Session IDs and orphan `{ id, sha256 }` pairs.

`finalizeStartupJob` transitions `restarting` to `workbench_finalizing`, deletes Session vectors for roots and descendants, deletes orphan document vectors, invokes `repos.maintenance.purgeContainer`, then transitions to `verifying`. Any error is persisted with `PURGE_WORKBENCH_FINALIZE_FAILED` and rethrown for the Launcher to restore the offline snapshot.

`isLocked()` is true for `CPWB_MAINTENANCE_JOB_ID` until finalization reaches `verifying`; Host API uses it to reject business writes with `503 PURGE_MAINTENANCE_ACTIVE`.

- [ ] **Step 7: Wire lifecycle readiness without blocking Cordis registration**

In `src/host/index.js`:

- construct the maintenance service after repositories and vector index;
- replace `sessionService.canDeleteNativeSessions()` as the container capability source;
- keep detach deletion in the existing `deleteContainer` path;
- register the API before asynchronous finalization so the status route can recover immediately;
- start `finalizeStartupJob().then(markGenerationReady)` and keep the promise for cleanup/error reporting;
- do not start scheduler or startup index reconciliation while `maintenance.isLocked()` is true;
- after maintenance finalization reaches `verifying`, start the scheduler and startup index reconciliation before writing the ready marker;
- on ordinary supervised boot with no purge job, write the generation-ready marker after all Host services initialize.

- [ ] **Step 8: Run Host-focused tests**

Run: `node --test test/database.test.js test/maintenance-host.test.js test/host-lifecycle.test.js`

Expected: all tests PASS.

- [ ] **Step 9: Commit the Host finalization slice**

```bash
git add src/host/maintenance.js src/host/repositories.js src/host/index.js test/maintenance-host.test.js test/database.test.js test/host-lifecycle.test.js
git commit -m "feat: finalize purge jobs inside workbench host"
```

### Task 4: Maintenance HTTP and client-store contracts

**Files:**
- Modify: `src/host/api.js`
- Modify: `src/client/api.js`
- Modify: `src/client/store.js`
- Modify: `test/api.test.js`
- Modify: `test/client.test.js`

**Interfaces:**
- Consumes: `maintenance` service from Task 3.
- Produces HTTP `POST /api/cpwb/maintenance/purge-jobs` and `GET /api/cpwb/maintenance/purge-jobs/:jobId`.
- Produces Client methods `api.maintenance.createPurgeJob(input)` and `api.maintenance.getPurgeJob(jobId)`.
- Produces Store actions `startContainerPurge(input)`, `refreshPurgeJob(jobId)`, `resumePurgeJob(jobId)`, and `clearPurgeJob()` plus snapshot field `maintenanceJob`.

- [ ] **Step 1: Write failing API capability and creation tests**

```js
test("purge API returns restart capability, arms after response, and hides server paths", async (t) => {
  const calls = [];
  const maintenance = {
    capability: () => ({ available: true, requiresRestart: true, backend: "rc2-jsonl-zstd", reason: null }),
    containerPlan: () => ({
      kind: "project", id: 4, name: "Research", sessionCount: 2,
      descendantSessionCount: 1, relationshipCount: 0, documentCount: 0,
      orphanDocumentCount: 0, planVersion: "plan-hash",
    }),
    createPurgeJob: async (input) => {
      calls.push(input);
      return { jobId: "purge-api", state: "queued", recoveryCommand: "dsh-workbench web" };
    },
    armPurgeJob: async (jobId) => calls.push({ armed: jobId }),
    getJob: async () => ({ jobId: "purge-api", state: "queued", revision: 1 }),
    isLocked: () => false,
  };
  const { base } = await startApi(t, { services: { maintenance } });
  const plan = await fetch(base + "/projects/4/deletion-plan").then((response) => response.json());
  assert.equal(plan.permanentDeletion.available, true);
  const response = await fetch(base + "/maintenance/purge-jobs", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      kind: "project", id: 4, planVersion: "plan-hash",
      confirmation: "Research", restartConfirmed: true,
    }),
  });
  assert.equal(response.status, 202);
  const body = await response.json();
  assert.equal(body.recoveryCommand, "dsh-workbench web");
  assert.doesNotMatch(JSON.stringify(body), /Users|access_token|Authorization/);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(calls.at(-1), { armed: "purge-api" });
});
```

- [ ] **Step 2: Run API tests and confirm route failure**

Run: `node --test test/api.test.js`

Expected: FAIL because `/maintenance/purge-jobs` returns 404 and deletion plans lack `permanentDeletion`.

- [ ] **Step 3: Implement stable HTTP contracts**

Update `createApi` to receive `services.maintenance` and add:

```js
{ pattern: "/maintenance/purge-jobs", methods: { POST: handlePurgeJobCreate } },
{ pattern: "/maintenance/purge-jobs/:jobId", methods: { GET: handlePurgeJobGet } },
```

The POST body accepts only `kind`, positive `id`, `planVersion`, `confirmation` and `restartConfirmed`. It returns `202`, registers `res.once("finish", () => maintenance.armPurgeJob(jobId))`, and logs an arm failure without returning sensitive detail.

Deletion-plan responses replace `permanentDeletionAvailable` with:

```js
permanentDeletion: {
  available: capability.available,
  requiresRestart: capability.requiresRestart,
  backend: capability.backend,
  reason: capability.reason,
}
```

While `maintenance.isLocked()` is true, allow `/health` and `/maintenance/purge-jobs/:jobId`; return `503 PURGE_MAINTENANCE_ACTIVE` for other write routes. Existing `DELETE ?sessionPolicy=detach` stays unchanged. Existing `DELETE ?sessionPolicy=delete` returns `409 PURGE_JOB_REQUIRED` and never mutates data.

- [ ] **Step 4: Write failing Client API/store tests**

```js
test("store keeps purge state across a temporary status disconnect", async () => {
  let reads = 0;
  const api = makeApi({
    maintenance: {
      createPurgeJob: async () => ({ jobId: "purge-client", state: "queued", recoveryCommand: "dsh-workbench web" }),
      getPurgeJob: async () => {
        reads += 1;
        if (reads === 1) throw Object.assign(new Error("fetch failed"), { code: "NETWORK" });
        return { jobId: "purge-client", state: "restarting", revision: 5 };
      },
    },
  });
  const store = createWorkbenchStore(api);
  await store.actions.startContainerPurge({
    kind: "project", id: 4, planVersion: "plan-hash",
    confirmation: "Research", restartConfirmed: true,
  });
  await store.actions.refreshPurgeJob("purge-client");
  assert.equal(store.getSnapshot().maintenanceJob.disconnected, true);
  await store.actions.refreshPurgeJob("purge-client");
  assert.equal(store.getSnapshot().maintenanceJob.state, "restarting");
  assert.equal(store.getSnapshot().maintenanceJob.disconnected, false);
});
```

- [ ] **Step 5: Implement API and store methods**

Add to `src/client/api.js`:

```js
maintenance: {
  createPurgeJob(input, { signal } = {}) {
    return request({ method: "POST", path: "/maintenance/purge-jobs", body: input, signal });
  },
  getPurgeJob(jobId, { signal } = {}) {
    return request({ path: "/maintenance/purge-jobs/" + encodeURIComponent(jobId), signal });
  },
},
```

The store initializes `maintenanceJob: null`. A failed status fetch patches only `{ disconnected: true, lastPollError }`; it must not clear `jobId`, overwrite the last confirmed state or set the whole Workbench phase to error. `clearPurgeJob` clears only after `completed` or `restored`, then calls `refresh()`.

- [ ] **Step 6: Run HTTP and client tests**

Run: `node --test test/api.test.js test/client.test.js`

Expected: all tests PASS.

- [ ] **Step 7: Commit the contracts**

```bash
git add src/host/api.js src/client/api.js src/client/store.js test/api.test.js test/client.test.js
git commit -m "feat: expose maintenance purge jobs"
```

### Task 5: Launcher supervision, restart and rollback

**Files:**
- Modify: `src/launcher/process.js`
- Modify: `bin/dsh-workbench.js`
- Modify: `test/launcher.test.js`
- Create: `test/maintenance-supervisor.test.js`

**Interfaces:**
- Consumes: Task 1 ledger and Task 2 storage transaction.
- Produces: existing `launchDsh(options)` with unchanged external call shape and supervised maintenance behavior.
- Internal functions exported for tests: `buildSupervisedChildEnv`, `waitForGenerationReady`, and `recoverIncompletePurge`.

- [ ] **Step 1: Write a failing real-child restart test**

Create a temporary executable DSH stub that writes its generation and PID, imports `createPurgeJobStore`, writes the generation-ready marker, and stays alive until `SIGTERM`. The test creates and arms a purge job after first readiness, then asserts:

```js
assert.equal(generations.length, 2);
assert.notEqual(generations[0].pid, generations[1].pid);
assert.equal((await jobs.read("purge-supervisor")).state, "completed");
assert.equal(await pathExists(targetSessionPath), false);
assert.equal(await pathExists(keepSessionPath), true);
assert.equal(second.env.OPENAI_CODEX_ACCESS_TOKEN_HASH, first.env.OPENAI_CODEX_ACCESS_TOKEN_HASH);
assert.deepEqual(second.proxy, first.proxy);
```

Use a temporary `DSH_HOME`; never touch the user's real profile.

- [ ] **Step 2: Run the supervisor test and confirm it times out or exits after one child**

Run: `node --test test/maintenance-supervisor.test.js`

Expected: FAIL because the current launcher has no job monitor or restart loop.

- [ ] **Step 3: Refactor one-child launch without changing ordinary behavior**

Extract an internal child start operation from `launchDsh`:

```js
function spawnDshChild({ command, childArgs, childEnv, spawnImpl = spawn }) {
  const child = spawnImpl(command.file, childArgs, { env: childEnv, stdio: "inherit" });
  const exit = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code: code ?? 1, signal }));
  });
  return { child, exit };
}
```

Build the command, args, proxy environment and Codex token exactly once. Every maintenance restart clones that already-sanitized child environment and changes only `CPWB_LAUNCH_GENERATION` and `CPWB_MAINTENANCE_JOB_ID`.

Ordinary child exit and forwarded SIGINT/SIGTERM must preserve all existing `test/launcher.test.js` expectations.

- [ ] **Step 4: Implement generation readiness and armed-job monitoring**

Every supervised child receives:

```js
{
  CPWB_SUPERVISED: "1",
  CPWB_DSH_HOME: dshHome,
  CPWB_LAUNCH_GENERATION: generation,
  CPWB_RECOVERY_COMMAND: "dsh-workbench web",
}
```

`waitForGenerationReady` races the child exit with the generation-ready marker, polling the small local JSON file at 200ms and enforcing a 30-second production timeout. Tests inject a shorter timeout. It does not inspect stdout or assume a port.

The main loop races child exit with `jobs.listIncomplete()` until it finds one armed `queued` job. It waits for DSH to exit fully before calling `prepareRc2Purge`.

- [ ] **Step 5: Implement the maintenance cycle and single rollback attempt**

The cycle is exact:

```text
queued -> stopping -> quarantining -> native_refs_updated
       -> restarting -> workbench_finalizing -> verifying -> completed
```

On failure after preparation:

1. stop the maintenance child;
2. transition to `restoring`;
3. call `restoreRc2Purge` while no child is alive;
4. start one normal recovery child with the same args, proxy and auth;
5. if ready, transition to `restored` and continue supervising;
6. if not ready, transition to `rollback_pending`, preserve backup and exit non-zero.

Before every ordinary launch, `recoverIncompletePurge` handles:

- `completed`: finish exact backup/quarantine cleanup;
- any state from `quarantining` through `verifying`: restore first;
- `rollback_pending`: restore idempotently before spawning DSH;
- unarmed `queued`: leave data untouched.

If the parent receives SIGINT or SIGTERM before preparation, forward it and exit with existing signal semantics. If a signal arrives after any data was quarantined, finish the exact restore first, then re-deliver the same signal to the Launcher process. A user interrupt must never strand a half-updated store.

- [ ] **Step 6: Add fault-injection tests for every boundary**

Use table-driven subtests for failure after:

- first Session move;
- native JSON replacement;
- maintenance child spawn;
- Host finalization marker;
- recovery child spawn.

Each test asserts exact target/non-target directories, JSON references, Workbench SQLite hash and vector snapshot hash. The final case must leave `rollback_pending`; a second `launchDsh` call must restore and reach ready.

- [ ] **Step 7: Run launcher suites**

Run: `node --test test/launcher.test.js test/maintenance-supervisor.test.js test/purge-jobs.test.js test/rc2-storage.test.js`

Expected: all tests PASS and no child process remains running.

- [ ] **Step 8: Commit the supervisor slice**

```bash
git add src/launcher/process.js bin/dsh-workbench.js test/launcher.test.js test/maintenance-supervisor.test.js
git commit -m "feat: supervise destructive workbench maintenance"
```

### Task 6: Restart confirmation and Cyberpunk maintenance surface

**Files:**
- Create: `src/client/MaintenanceScreen.js`
- Create: `test/maintenance-client.test.js`
- Modify: `src/client/ContainerDeleteDialog.js`
- Modify: `src/client/WorkbenchShell.js`
- Modify: `src/client/workbench.css`
- Modify: `test/unified-session-ui.test.js`
- Modify: `test/css.test.js`

**Interfaces:**
- Consumes: Task 4 Store actions and `maintenanceJob` snapshot.
- Produces: `MaintenanceScreen({ store, job, onFinished })` and a two-phase `ContainerDeleteDialog`.
- The screen stores only `jobId` and `recoveryCommand` under session-storage key `cpwb-maintenance-job`.

- [ ] **Step 1: Write failing confirmation and maintenance-state render tests**

```js
test("permanent deletion requires name and a separate restart acknowledgement", () => {
  const html = renderToStaticMarkup(React.createElement(ContainerDeleteDialog, {
    kind: "project",
    target: { id: 4, name: "Research" },
    store,
    initialPlan: {
      kind: "project", id: 4, name: "Research", sessionCount: 2,
      descendantSessionCount: 1, relationshipCount: 0, documentCount: 0,
      orphanDocumentCount: 0, planVersion: "plan-hash",
      permanentDeletion: { available: true, requiresRestart: true, backend: "rc2-jsonl-zstd", reason: null },
    },
    initialPolicy: "delete",
    initialConfirmation: "Research",
    initialStep: "restart",
    onClose() {},
  }));
  assert.match(html, /Workbench 将自动停止并重启/);
  assert.match(html, /我已了解 Workbench 将自动重启/);
  assert.match(html, /永久删除并重启/);
  assert.match(html, /disabled=""/);
});

test("maintenance screen renders real confirmed state and disconnect fallback", () => {
  const html = renderToStaticMarkup(React.createElement(MaintenanceScreen, {
    store,
    job: {
      jobId: "purge-ui", state: "restarting", disconnected: true,
      recoveryCommand: "dsh-workbench web", targetName: "Research",
    },
  }));
  assert.match(html, /正在重启智能核心/);
  assert.match(html, /正在重新连接/);
  assert.match(html, /dsh-workbench web/);
  assert.doesNotMatch(html, /%/);
});
```

- [ ] **Step 2: Run the UI test and confirm missing component/copy failures**

Run: `node --test test/maintenance-client.test.js test/unified-session-ui.test.js`

Expected: FAIL because `MaintenanceScreen` and the restart-confirmation phase do not exist.

- [ ] **Step 3: Implement the second confirmation inside the existing dialog**

Keep `ContainerDeleteDialog` as one component and add local `step: "policy" | "restart"` plus `restartConfirmed` state. Do not create a second modal component.

The first permanent-delete button becomes “继续确认”. It advances only when the exact name matches. The second view contains:

- target name and frozen Session/Subagent counts;
- “Workbench 将自动停止并重启”；
- “页面会短暂断开，恢复后自动重新连接”；
- recovery guarantee and same-command recovery instruction;
- required checkbox “我已了解 Workbench 将自动重启”；
- primary button “永久删除并重启”.

Submitting calls `store.actions.startContainerPurge` and does not close back to the previous page. Detach deletion continues to call the existing direct delete action.

- [ ] **Step 4: Implement disconnect-aware maintenance polling**

`MaintenanceScreen` uses a single effect with a cancellable timer:

```js
React.useEffect(function () {
  if (!job?.jobId || ["completed", "restored"].includes(job.state)) return undefined;
  let cancelled = false;
  let timer = null;
  const poll = async function () {
    await store.actions.refreshPurgeJob(job.jobId);
    if (!cancelled) timer = window.setTimeout(poll, store.getSnapshot().maintenanceJob?.disconnected ? 1500 : 500);
  };
  timer = window.setTimeout(poll, 250);
  return function () {
    cancelled = true;
    if (timer) window.clearTimeout(timer);
  };
}, [job?.jobId, job?.state, store]);
```

Persist `{ jobId, recoveryCommand }` in `sessionStorage`. On Workbench mount, `WorkbenchShell` calls `resumePurgeJob` for the stored ID. Clear it only after a terminal status is rendered and acknowledged.

- [ ] **Step 5: Implement the confirmed visual in native CSS**

Use existing tokens and no new visual dependency. The root is `position: fixed; inset: 0; min-height: 100dvh; z-index` above all Workbench surfaces. Build decoration from semantic HTML and CSS pseudo-elements:

- a low-contrast city wireframe along the lower third;
- a right-side scanner radar with conic-gradient sweep;
- cyan circuit tracks and coordinate labels;
- a low-opacity `2077` HUD watermark;
- the central sharp-cut maintenance panel and four true status rows;
- cyan current-state signal, amber destructive checkpoint and red terminal failure;
- solid dark fallback when backdrop filtering is unavailable.

Animations communicate scanner activity and current-state transition only. Under `prefers-reduced-motion: reduce`, set every maintenance animation and transition duration to `0.01ms` and hide the radar sweep.

At widths below 768px, collapse scanner and side diagnostics, keep the central title, four states and recovery command fully visible, and prevent horizontal overflow at 390px.

- [ ] **Step 6: Add DOM, accessibility and CSS safety tests**

Assert:

- the overlay has `role="status"` during work and `role="alert"` on failure;
- the restart checkbox has a visible label;
- focus returns correctly when cancelling the second confirmation;
- no visible string contains `—` or `–`;
- CSS braces remain balanced;
- `.cpwb-maintenance-screen` uses `min-height: 100dvh`, not `height: 100vh`;
- a `prefers-reduced-motion: reduce` rule disables every named maintenance animation;
- terminal states expose the recovery command and a copy button with accessible name.

- [ ] **Step 7: Render and compare at the confirmed viewport**

Run the isolated visual harness at 884x703 and compare to the confirmed `permanent-delete-maintenance-v3.html` design. Then verify 1280x720, 768x900 and 390x844:

- no horizontal overflow;
- central title and status rows stay within the viewport;
- failure recovery command is selectable and copyable;
- reduced-motion emulation removes radar and scan animation;
- console error and warning count is zero.

- [ ] **Step 8: Run UI-focused tests**

Run: `node --test test/maintenance-client.test.js test/unified-session-ui.test.js test/css.test.js`

Expected: all tests PASS.

- [ ] **Step 9: Commit the maintenance UI**

```bash
git add src/client/MaintenanceScreen.js src/client/ContainerDeleteDialog.js src/client/WorkbenchShell.js src/client/workbench.css test/maintenance-client.test.js test/unified-session-ui.test.js test/css.test.js
git commit -m "feat: add cyberpunk restart maintenance flow"
```

### Task 7: End-to-end recovery proof, package verification and documentation

**Files:**
- Modify: `scripts/verify.cjs`
- Modify: `README.md`
- Modify: `test/maintenance-supervisor.test.js`
- Modify: `test/api.test.js`
- Modify: `test/client.test.js`

**Interfaces:**
- Consumes all prior tasks.
- Produces end-to-end evidence for successful purge, first-restart rollback and next-launch recovery.

- [ ] **Step 1: Add a complete temporary-profile acceptance test**

The test starts the real `bin/dsh-workbench.js` against a controllable DSH stub and a temporary `DSH_HOME`, then uses real HTTP requests to:

1. obtain a project deletion plan;
2. create and arm a purge job;
3. observe the first Host exit and second generation;
4. receive `completed` from the restarted Host;
5. verify exact filesystem and SQLite outcomes.

The acceptance assertions are:

```js
assert.equal(await pathExists(targetSessionPath), false);
assert.equal(await pathExists(childSessionPath), false);
assert.equal(await pathExists(otherSessionPath), true);
assert.equal(workspace.sessionIds.includes("session-target"), false);
assert.equal(Object.hasOwn(projection.tables.sessions, "session-target"), false);
assert.equal(repos.projects.get(project.id), null);
assert.equal(repos.workbenchSessions.get("session-target"), null);
assert.equal(await sessionVectorCount("session-target"), 0);
assert.equal(await pathExists(orphanFilePath), false);
```

- [ ] **Step 2: Add end-to-end rollback and next-launch recovery cases**

Case A makes the first maintenance restart exit before ready. Assert automatic restore, one recovery start, `restored`, and readable target/non-target sessions.

Case B makes both maintenance and recovery starts fail. Assert `rollback_pending`, backup presence and non-zero launcher exit. Start the same command a second time with a healthy stub and assert it restores before ready, leaves the project/session intact, and changes the job to `restored`.

- [ ] **Step 3: Update the production verifier**

`scripts/verify.cjs` must assert built output includes:

- `/maintenance/purge-jobs` routes;
- `PURGE_SUPERVISOR_REQUIRED` and `PURGE_ROLLBACK_PENDING` errors;
- `CPWB_SUPERVISED` and generation-ready handling;
- `MaintenanceScreen` visible copy;
- no recursive delete of `DSH_HOME`, `sessions/`, `workspace.json` or `session_projcache.json`;
- no source path containing `/Users/yewang`;
- no token or Authorization value in a recovery command.

- [ ] **Step 4: Document user and maintainer recovery**

Add matching Chinese and English README sections covering:

- permanent deletion requires `dsh-workbench web`;
- the service automatically restarts and the browser reconnects;
- supported backend is RC.2 local JSONL.Zstd/JSON only;
- failure restores automatically;
- if the page remains offline, rerun `dsh-workbench web` with the same normal options;
- the Launcher repairs `rollback_pending` before starting DSH;
- backup job directory must not be manually removed before recovery;
- direct `dsh web` offers detach-only deletion.

- [ ] **Step 5: Run the complete verification suite**

Run: `npm run check`

Expected: build succeeds, every Node test passes, `scripts/verify.cjs` prints `=== VERIFY OK ===`, and both generated bundles pass `node --check`.

- [ ] **Step 6: Run repository safety checks**

Run:

```bash
git diff --check
npm run dev:doctor
git status --short
git diff --stat
```

Expected: no whitespace errors; `dev:doctor` reports `WORKTREE OK`; status contains only intentional task files plus the user's already-existing changes.

- [ ] **Step 7: Activate this linked worktree for the local `dsh-workbench` command**

Run: `npm run dev:activate`

Expected: build, npm link and profile link checks finish with `WORKTREE ACTIVE`, and the global `dsh-workbench` resolves to `.worktrees/rc2-workbench-fusion`.

- [ ] **Step 8: Perform a real isolated RC.2 smoke test**

Use a new temporary `DSH_HOME`, never the user's real profile. Start `dsh-workbench web --no-open --port 0`, create disposable project/session fixture data, execute a permanent delete and verify:

- the browser shows the two confirmations and full-screen maintenance states;
- the DSH child PID changes once;
- the browser reconnects without manual refresh;
- the target disappears and the unrelated fixture session opens;
- browser console contains no page error or warning;
- the temporary service is stopped after verification.

- [ ] **Step 9: Commit documentation and end-to-end proof**

```bash
git add scripts/verify.cjs README.md test/maintenance-supervisor.test.js test/api.test.js test/client.test.js
git commit -m "test: prove transactional purge recovery"
```

## Plan Self-Review

### Spec coverage

- Capability gate and direct-DSH fail-closed behavior: Tasks 3-4.
- Frozen plan, exact name and restart acknowledgement: Tasks 3, 4 and 6.
- Subagent descendant handling: Tasks 2-3.
- Offline native Session/reference mutation: Task 2.
- Workbench SQLite, vectors and orphan file cleanup: Tasks 2-3.
- Launcher stop, restart, ready verification and rollback: Task 5.
- Full-screen Cyberpunk UI, disconnect handling and recovery command: Task 6.
- Crash matrix and `rollback_pending`: Tasks 2, 5 and 7.
- Security, path confinement and redaction: Tasks 1-2, 4-5 and 7.
- Responsive, reduced-motion and browser visual proof: Task 6.
- README, packaging and isolated real-profile verification: Task 7.

### Type and name consistency

- The shared record uses `state`, not `status`, from job ledger through API, Store and UI.
- The server capability is always `permanentDeletion` with `available`, `requiresRestart`, `backend` and `reason`.
- The frozen child list is always `descendantSessionIds`; UI receives `descendantSessionCount` only in the public plan.
- `jobId`, `planVersion`, `confirmation` and `restartConfirmed` use the same names in Client, API and Host.
- Launcher/Host readiness always keys on `CPWB_LAUNCH_GENERATION`; purge startup also carries `CPWB_MAINTENANCE_JOB_ID`.
