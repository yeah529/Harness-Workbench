import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { openDatabase, closeDatabase, applySchema, transaction } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import { SCHEMA_VERSION } from "../src/host/config.js";
import { createTempDir, removeTempDir } from "./helpers.js";

const ISO_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

test("one document links to many projects and knowledge bases", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const p1 = repos.projects.create({ name: "Alpha", path: "/workspaces/alpha" });
  const p2 = repos.projects.create({ name: "Beta", path: "/workspaces/beta" });
  const k1 = repos.knowledgeBases.create({ name: "Manual", description: "docs" });
  const k2 = repos.knowledgeBases.create({ name: "Archive" });

  const metadata = {
    sha256: "a".repeat(64),
    originalName: "guide.md",
    mimeType: "text/markdown",
    size: 10,
  };
  const doc = repos.documents.upsertBySha256(metadata);
  assert.ok(Number.isInteger(doc.id), "document id is an integer");

  // Same SHA-256 must reuse the stored document rather than create a second row.
  const again = repos.documents.upsertBySha256({ ...metadata, originalName: "renamed.md" });
  assert.equal(again.id, doc.id);
  assert.equal(repos.documents.list().length, 1);

  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: p1.id });
  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: p2.id });
  repos.documents.link({ documentId: doc.id, scope: "knowledgeBase", scopeId: k1.id });
  repos.documents.link({ documentId: doc.id, scope: "knowledgeBase", scopeId: k2.id });
  // Linking twice is idempotent and must not create a duplicate association.
  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: p1.id });

  const links = repos.documents.listLinks(doc.id);
  assert.equal(links.length, 4);
  assert.deepEqual(
    links.filter((l) => l.scope === "project").map((l) => l.scopeId).sort((a, b) => a - b),
    [p1.id, p2.id].sort((a, b) => a - b),
  );
  assert.deepEqual(
    links.filter((l) => l.scope === "knowledgeBase").map((l) => l.scopeId).sort((a, b) => a - b),
    [k1.id, k2.id].sort((a, b) => a - b),
  );

  assert.deepEqual(repos.documents.listByProject(p1.id).map((d) => d.id), [doc.id]);
  assert.deepEqual(repos.documents.listByKnowledgeBase(k1.id).map((d) => d.id), [doc.id]);
});

test("session files are durable non-vector rows scoped by session and unique by name", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const sessionId = "session-cpwb-file-vault";
  repos.workbenchSessions.create({
    sessionId,
    scope: { kind: "independent", id: null },
  });
  const file = repos.sessionFiles.create({
    sessionId,
    sha256: "f".repeat(64),
    originalName: "brief.md",
    mimeType: "text/markdown",
    size: 7,
    parseStatus: "ready",
    contextText: "# Brief",
    contextCodePoints: 7,
    now: "2026-08-29T01:00:00.000Z",
  });

  assert.equal(file.sessionId, sessionId);
  assert.equal(file.parseStatus, "ready");
  assert.equal(file.contextText, "# Brief");
  assert.equal(repos.sessionFiles.get(file.id).originalName, "brief.md");
  assert.equal(repos.sessionFiles.getBySessionAndName(sessionId, "brief.md").id, file.id);
  assert.deepEqual(repos.sessionFiles.listBySession(sessionId).map((item) => item.id), [file.id]);
  assert.equal(repos.sessionFiles.countBySha256("f".repeat(64)), 1);
  assert.throws(() => repos.sessionFiles.create({
    sessionId,
    sha256: "e".repeat(64),
    originalName: "brief.md",
    size: 8,
    parseStatus: "ready",
    contextText: "changed",
    contextCodePoints: 7,
  }), /unique/i);

  const removed = repos.sessionFiles.remove(file.id);
  assert.equal(removed.id, file.id);
  assert.equal(repos.sessionFiles.get(file.id), null);
});

test("projects detach owned sessions before deleting only Workbench-owned project data", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Before", path: "/real/workspace", workspaceId: "ws-1", now: "2026-08-21T01:00:00.000Z" });
  const other = repos.projects.create({ name: "Other" });
  const kb = repos.knowledgeBases.create({ name: "Shared KB" });
  const orphan = repos.documents.upsertBySha256({ sha256: "7".repeat(64), originalName: "orphan.md" });
  const shared = repos.documents.upsertBySha256({ sha256: "8".repeat(64), originalName: "shared.md" });
  repos.documents.link({ documentId: orphan.id, scope: "project", scopeId: project.id });
  repos.documents.link({ documentId: shared.id, scope: "project", scopeId: project.id });
  repos.documents.link({ documentId: shared.id, scope: "knowledgeBase", scopeId: kb.id });
  repos.projectKnowledgeBases.link({ projectId: project.id, knowledgeBaseId: kb.id });
  repos.todos.create({ projectId: project.id, title: "Todo", dueAt: "2026-08-22T10:00:00.000Z" });
  repos.schedules.create({ projectId: project.id, name: "Daily", rule: "daily 21:00" });
  repos.summaries.upsert({ projectId: project.id, summaryDate: "2026-08-21", content: "Summary", status: "ready" });
  repos.automation.update({ projectId: project.id, summaryEnabled: false });
  repos.workbenchSessions.create({ sessionId: "session-cpwb-project-delete", scope: { kind: "project", id: project.id }, provider: "deepseek-official", model: "deepseek-v4-flash" });

  const renamed = repos.projects.update({ id: project.id, name: "After", now: "2026-08-21T02:00:00.000Z" });
  assert.equal(renamed.name, "After");
  assert.equal(renamed.path, "/real/workspace");
  assert.equal(renamed.workspaceId, "ws-1");
  assert.equal(renamed.createdAt, "2026-08-21T01:00:00.000Z");
  assert.equal(renamed.updatedAt, "2026-08-21T02:00:00.000Z");

  const plan = repos.projects.deletionPlan(project.id);
  assert.deepEqual(plan.sessionIds, ["session-cpwb-project-delete"]);
  assert.deepEqual(plan.orphanDocuments.map((document) => document.id), [orphan.id]);
  assert.equal(plan.relationshipCount, 1);
  assert.throws(() => repos.projects.removeContainer(project.id), /owns sessions/i);
  repos.workbenchSessions.updateScope({ sessionId: "session-cpwb-project-delete", scope: { kind: "independent", id: null } });
  repos.projects.removeContainer(project.id);
  assert.equal(repos.projects.get(project.id), null);
  assert.equal(repos.projects.get(other.id).name, "Other");
  assert.deepEqual(repos.workbenchSessions.get("session-cpwb-project-delete").scope, { kind: "independent", id: null });
  assert.equal(repos.documents.get(orphan.id), null);
  assert.equal(repos.documents.get(shared.id).id, shared.id);
  assert.equal(repos.todos.list({ projectId: project.id }).length, 0);
  assert.equal(repos.schedules.list({ projectId: project.id }).length, 0);
  assert.equal(repos.summaries.list({ projectId: project.id }).length, 0);
  assert.equal(repos.projectKnowledgeBases.listByProject(project.id).length, 0);
});

test("maintenance purge removes one frozen project graph in one transaction", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Research" });
  const document = repos.documents.upsertBySha256({
    sha256: "9".repeat(64),
    originalName: "private.md",
  });
  repos.documents.link({ documentId: document.id, scope: "project", scopeId: project.id });
  repos.workbenchSessions.create({
    sessionId: "session-a",
    scope: { kind: "project", id: project.id },
  });
  repos.workbenchSessions.create({
    sessionId: "session-keep",
    scope: { kind: "independent", id: null },
  });
  repos.sessionFiles.create({
    sessionId: "session-a",
    sha256: "a".repeat(64),
    originalName: "private.md",
    size: 7,
    parseStatus: "ready",
    contextText: "private",
    contextCodePoints: 7,
  });
  repos.sessionFiles.create({
    sessionId: "session-a",
    sha256: "b".repeat(64),
    originalName: "shared.md",
    size: 6,
    parseStatus: "ready",
    contextText: "shared",
    contextCodePoints: 6,
  });
  repos.sessionFiles.create({
    sessionId: "session-keep",
    sha256: "b".repeat(64),
    originalName: "shared-copy.md",
    size: 6,
    parseStatus: "ready",
    contextText: "shared",
    contextCodePoints: 6,
  });
  repos.todos.create({
    projectId: project.id,
    title: "Ship",
    dueAt: "2026-08-26T10:00:00.000Z",
  });

  const removed = repos.maintenance.purgeContainer({
    kind: "project",
    id: project.id,
    expectedSessionIds: ["session-a"],
    expectedOrphanDocumentIds: [document.id],
    expectedSessionFileHashes: ["a".repeat(64)],
  });

  assert.equal(removed.container.name, "Research");
  assert.deepEqual(removed.orphanSessionFiles, [{ sha256: "a".repeat(64) }]);
  assert.equal(repos.projects.get(project.id), null);
  assert.equal(repos.workbenchSessions.get("session-a"), null);
  assert.equal(repos.sessionFiles.countBySha256("a".repeat(64)), 0);
  assert.equal(repos.sessionFiles.countBySha256("b".repeat(64)), 1);
  assert.equal(repos.documents.get(document.id), null);
  assert.deepEqual(repos.todos.list({ projectId: project.id }), []);
});

test("maintenance purge rejects a stale File Vault graph without deleting any row", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Research" });
  repos.workbenchSessions.create({
    sessionId: "session-a",
    scope: { kind: "project", id: project.id },
  });
  const frozen = repos.projects.deletionPlan(project.id);
  repos.sessionFiles.create({
    sessionId: "session-a",
    sha256: "c".repeat(64),
    originalName: "late.md",
    size: 4,
    parseStatus: "ready",
    contextText: "late",
    contextCodePoints: 4,
  });

  assert.throws(
    () => repos.maintenance.purgeContainer({
      kind: "project",
      id: project.id,
      expectedSessionIds: frozen.sessionIds,
      expectedOrphanDocumentIds: [],
      expectedSessionFileHashes: [],
    }),
    /stale purge plan/i,
  );
  assert.equal(repos.projects.get(project.id).name, "Research");
  assert.equal(repos.workbenchSessions.get("session-a").sessionId, "session-a");
  assert.equal(repos.sessionFiles.countBySha256("c".repeat(64)), 1);
});

test("maintenance purge rejects a stale plan without deleting any row", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Research" });
  repos.workbenchSessions.create({
    sessionId: "session-a",
    scope: { kind: "project", id: project.id },
  });
  const frozen = repos.projects.deletionPlan(project.id);
  repos.workbenchSessions.create({
    sessionId: "session-b",
    scope: { kind: "project", id: project.id },
  });

  assert.throws(
    () => repos.maintenance.purgeContainer({
      kind: "project",
      id: project.id,
      expectedSessionIds: frozen.sessionIds,
      expectedOrphanDocumentIds: [],
      expectedSessionFileHashes: [],
    }),
    /stale purge plan/i,
  );
  assert.equal(repos.projects.get(project.id).name, "Research");
  assert.equal(repos.workbenchSessions.get("session-a").sessionId, "session-a");
  assert.equal(repos.workbenchSessions.get("session-b").sessionId, "session-b");
});

test("unlink keeps a file while another association exists", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const p1 = repos.projects.create({ name: "One" });
  const p2 = repos.projects.create({ name: "Two" });
  const doc = repos.documents.upsertBySha256({
    sha256: "b".repeat(64),
    originalName: "notes.txt",
    mimeType: "text/plain",
    size: 3,
  });

  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: p1.id });
  repos.documents.link({ documentId: doc.id, scope: "project", scopeId: p2.id });

  repos.documents.unlink({ documentId: doc.id, scope: "project", scopeId: p1.id });

  // The stored document row survives because the second association still exists.
  const kept = repos.documents.get(doc.id);
  assert.ok(kept, "document must still be stored while another association exists");
  assert.equal(kept.id, doc.id);
  assert.deepEqual(repos.documents.listByProject(p1.id), []);
  assert.deepEqual(repos.documents.listByProject(p2.id).map((d) => d.id), [doc.id]);
  assert.equal(repos.documents.listLinks(doc.id).length, 1);
});

test("todos retain createdAt and become overdue by dueAt", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Delivery" });
  const todo = repos.todos.create({
    projectId: project.id,
    title: "Ship the workbench",
    dueAt: "2026-08-16T18:00:00.000Z",
  });

  assert.equal(todo.dueAt, "2026-08-16T18:00:00.000Z", "dueAt is retained exactly");
  assert.match(todo.createdAt, ISO_UTC_RE, "createdAt is ISO 8601 UTC");
  assert.equal(todo.done, false);

  const listed = repos.todos.list({ projectId: project.id, now: new Date("2026-08-17T12:00:00.000Z") });
  assert.equal(listed.length, 1);
  assert.equal(listed[0].overdue, true, "a past dueAt with done=false is overdue");

  const completed = repos.todos.update({ id: todo.id, done: true, now: new Date("2026-08-17T12:00:00.000Z") });
  assert.equal(completed.done, true);
  assert.equal(completed.completedAt, "2026-08-17T12:00:00.000Z");

  const after = repos.todos.list({ projectId: project.id, now: new Date("2026-08-17T12:00:00.000Z") });
  assert.equal(after[0].overdue, false, "a completed plan is no longer overdue");
});

test("todos remove deletes only the requested todo", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Cleanup" });
  const first = repos.todos.create({ projectId: project.id, title: "Delete me", dueAt: "2026-08-24T10:00:00.000Z" });
  const second = repos.todos.create({ projectId: project.id, title: "Keep me", dueAt: "2026-08-25T10:00:00.000Z" });

  assert.equal(repos.todos.remove(first.id), true);
  assert.equal(repos.todos.remove(first.id), false);
  assert.deepEqual(repos.todos.list({ projectId: project.id }).map((row) => row.id), [second.id]);
});

test("schedule run key is unique by scheduleId and scheduledAt", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Automation" });
  const schedule = repos.schedules.create({
    projectId: project.id,
    name: "Evening summary",
    prompt: "Summarize today",
    rule: "daily 21:00",
  });

  const scheduledAt = "2026-08-17T21:00:00.000Z";
  const startedAt = "2026-08-17T21:00:00.100Z";

  const first = repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt, startedAt });
  assert.equal(first.claimed, true, "first claim wins the unique (scheduleId, scheduledAt) key");
  assert.equal(first.status, "running");

  const second = repos.schedules.claimRun({
    scheduleId: schedule.id,
    scheduledAt,
    startedAt: "2026-08-17T21:00:05.000Z",
  });
  assert.equal(second.claimed, false, "a second claim of the same key is not a new run");
  assert.equal(second.id, first.id);

  assert.equal(repos.schedules.listRuns(schedule.id).length, 1, "only one run row exists for the key");

  // A different scheduledAt is a distinct key and may be claimed separately.
  const third = repos.schedules.claimRun({
    scheduleId: schedule.id,
    scheduledAt: "2026-08-18T21:00:00.000Z",
    startedAt,
  });
  assert.equal(third.claimed, true);
  assert.equal(repos.schedules.listRuns(schedule.id).length, 2);
});

test("unfinished schedule runs are failed on process recovery without touching terminal runs", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Recovery" });
  const schedule = repos.schedules.create({ projectId: project.id, name: "Nightly", rule: "daily 21:00" });
  const interrupted = repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt: "2026-08-24T13:00:00.000Z" });
  const completed = repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt: "2026-08-23T13:00:00.000Z" });
  repos.schedules.completeRun({ id: completed.id, sessionId: "session-complete", finishedAt: "2026-08-23T13:02:00.000Z" });

  const changed = repos.schedules.failRunning({
    error: "interrupted: Workbench restarted before the scheduled run completed",
    finishedAt: "2026-08-25T08:00:00.000Z",
  });

  assert.equal(changed, 1);
  const rows = repos.schedules.listRuns(schedule.id);
  assert.deepEqual(rows.map(({ id, status, sessionId, finishedAt, error }) => ({ id, status, sessionId, finishedAt, error })), [
    { id: interrupted.id, status: "failed", sessionId: null, finishedAt: "2026-08-25T08:00:00.000Z", error: "interrupted: Workbench restarted before the scheduled run completed" },
    { id: completed.id, status: "completed", sessionId: "session-complete", finishedAt: "2026-08-23T13:02:00.000Z", error: null },
  ]);
});

test("schedules persist modal metadata and support deletion with run cascade", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Automation" });
  const schedule = repos.schedules.create({
    projectId: project.id,
    name: "月末复盘",
    prompt: "总结本月",
    rule: "monthly 31 21:00",
    recurrence: "monthly",
    startsAt: "2026-08-31T13:00:00.000Z",
  });
  assert.equal(schedule.recurrence, "monthly");
  assert.equal(schedule.startsAt, "2026-08-31T13:00:00.000Z");
  const run = repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt: schedule.startsAt });
  assert.equal(run.claimed, true);
  assert.equal(repos.schedules.remove(schedule.id), true);
  assert.equal(repos.schedules.get(schedule.id), null);
  assert.deepEqual(repos.schedules.listRuns(schedule.id), []);
});

test("a schedule binds one durable project session and exposes its session type", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Automation" });
  const schedule = repos.schedules.create({
    projectId: project.id,
    name: "夜间接口审计",
    prompt: "检查接口并汇报",
    rule: "daily 21:00",
  });
  repos.workbenchSessions.create({
    sessionId: "session-cpwb-schedule",
    scope: { kind: "project", id: project.id },
    title: schedule.name,
  });

  assert.equal(schedule.sessionId, null);
  const bound = repos.schedules.bindSession({ id: schedule.id, sessionId: "session-cpwb-schedule" });
  assert.equal(bound.sessionId, "session-cpwb-schedule");
  const session = repos.workbenchSessions.get("session-cpwb-schedule");
  assert.equal(session.sessionType, "schedule");
  assert.equal(session.scheduleName, "夜间接口审计");

  repos.workbenchSessions.remove("session-cpwb-schedule");
  assert.equal(repos.schedules.get(schedule.id).sessionId, null, "native session removal clears the schedule binding");
});

test("knowledge-base deletion preserves detached sessions and only removes orphaned documents", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Shared" });
  const target = repos.knowledgeBases.create({ name: "Delete me" });
  const other = repos.knowledgeBases.create({ name: "Keep me" });
  const orphan = repos.documents.upsertBySha256({ sha256: "d".repeat(64), originalName: "orphan.md", size: 1 });
  const shared = repos.documents.upsertBySha256({ sha256: "e".repeat(64), originalName: "shared.md", size: 1 });
  repos.documents.link({ documentId: orphan.id, scope: "knowledgeBase", scopeId: target.id });
  repos.documents.link({ documentId: shared.id, scope: "knowledgeBase", scopeId: target.id });
  repos.documents.link({ documentId: shared.id, scope: "knowledgeBase", scopeId: other.id });
  repos.documents.link({ documentId: shared.id, scope: "project", scopeId: project.id });
  repos.projectKnowledgeBases.link({ projectId: project.id, knowledgeBaseId: target.id });
  repos.workbenchSessions.create({ sessionId: "session-cpwb-kb-delete", scope: { kind: "knowledge_base", id: target.id } });

  const plan = repos.knowledgeBases.deletionPlan(target.id);
  assert.deepEqual(plan.orphanDocuments.map((item) => item.id), [orphan.id]);
  assert.equal(plan.relationshipCount, 1);
  assert.throws(() => repos.knowledgeBases.removeContainer(target.id), /owns sessions/i);
  repos.workbenchSessions.updateScope({ sessionId: "session-cpwb-kb-delete", scope: { kind: "independent", id: null } });
  repos.knowledgeBases.removeContainer(target.id);
  assert.equal(repos.knowledgeBases.get(target.id), null);
  assert.deepEqual(repos.workbenchSessions.get("session-cpwb-kb-delete").scope, { kind: "independent", id: null });
  assert.equal(repos.documents.get(orphan.id), null);
  assert.equal(repos.documents.get(shared.id).id, shared.id);
  assert.equal(repos.documents.listLinks(shared.id).length, 2);
});

test("duplicate upload of a ready document keeps status and metadata", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const doc = repos.documents.upsertBySha256({
    sha256: "c".repeat(64),
    originalName: "report.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1234,
  });
  assert.equal(doc.status, "parsing");

  const indexedAt = "2026-08-17T10:00:00.000Z";
  const ready = repos.documents.updateIndexState(doc.id, { status: "ready", error: null, indexedAt });
  assert.equal(ready.status, "ready");
  assert.equal(ready.indexedAt, indexedAt);
  assert.equal(ready.error, null);

  // A repeat upload with different metadata must NOT reset state or metadata.
  const again = repos.documents.upsertBySha256({
    sha256: "c".repeat(64),
    originalName: "renamed.docx",
    mimeType: "text/plain",
    size: 9999,
  });
  assert.equal(again.id, doc.id);
  assert.equal(again.status, "ready", "ready status survives a duplicate upload");
  assert.equal(again.indexedAt, indexedAt, "indexed_at survives a duplicate upload");
  assert.equal(again.originalName, "report.docx", "original name survives a duplicate upload");
  assert.equal(again.mimeType, doc.mimeType, "mime type survives a duplicate upload");
  assert.equal(again.size, 1234, "size survives a duplicate upload");
  assert.equal(repos.documents.list().length, 1);

  // Failed transitions are explicit and also persist through updateIndexState.
  const failed = repos.documents.updateIndexState(doc.id, { status: "failed", error: "embedding down", indexedAt: null });
  assert.equal(failed.status, "failed");
  assert.equal(failed.error, "embedding down");
  assert.equal(failed.indexedAt, null);
});

test("todos compute overdue from the supplied instant, not a fabricated calendar day", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Delivery" });
  const todo = repos.todos.create({
    projectId: project.id,
    title: "Ship it",
    dueAt: "2026-08-16T18:00:00.000Z",
  });

  const beforeDue = repos.todos.list({ projectId: project.id, now: new Date("2026-08-16T17:59:59.000Z") });
  assert.equal(beforeDue[0].overdue, false);
  const afterDue = repos.todos.list({ projectId: project.id, now: new Date("2026-08-16T18:00:01.000Z") });
  assert.equal(afterDue[0].overdue, true);
});

test("migration is atomic: schema and user_version roll back together", async (t) => {
  const dataDir = await createTempDir();
  const file = join(dataDir, "workbench.sqlite");
  const db = new DatabaseSync(file);
  t.after(async () => {
    db.close();
    await removeTempDir(dataDir);
  });

  // A migration whose second statement is invalid must not leave the first
  // statement's table behind, and must not advance user_version.
  const broken = "CREATE TABLE mig_a (id INTEGER PRIMARY KEY); THIS IS NOT SQL;";
  assert.throws(() => applySchema(db, broken, 7));
  const leftover = db.prepare(
    "SELECT name FROM sqlite_master WHERE type IN ('table','index','trigger') AND name IN ('mig_a')",
  ).all();
  assert.equal(leftover.length, 0, "no partial schema survives a failed migration");
  assert.equal(db.prepare("PRAGMA user_version").get().user_version, 0, "user_version is not advanced on failure");

  // user_version participates in the same transaction and rolls back on throw.
  assert.throws(() => transaction(db, () => {
    db.exec("PRAGMA user_version = 9");
    throw new Error("boom");
  }));
  assert.equal(db.prepare("PRAGMA user_version").get().user_version, 0, "user_version rolls back with the transaction");
});

test("openDatabase records the current schema version and all core tables", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  assert.equal(db.prepare("PRAGMA user_version").get().user_version, SCHEMA_VERSION);
  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  ).all().map((r) => r.name);
  for (const expected of ["chunks", "documents", "knowledge_bases", "message_context_refs", "project_automation", "projects", "schedules", "schedule_runs", "session_context_sources", "summaries", "todos", "workbench_sessions", "workbench_settings"]) {
    assert.ok(tables.includes(expected), "missing table: " + expected);
  }
  assert.equal(tables.includes("knowledge_chats"), false);
  assert.equal(db.prepare("PRAGMA table_info(workbench_sessions)").all().some((column) => column.name === "chat_id"), false);
});

test("workbench sessions persist one scope, lifecycle, title lock, and activity", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Workbench" });
  const created = repos.workbenchSessions.create({
    sessionId: "session-cpwb-project",
    scope: { kind: "project", id: project.id },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
    lifecycleStatus: "draft_failed",
    now: new Date("2026-08-20T08:00:00.000Z"),
  });
  assert.deepEqual(created.scope, { kind: "project", id: project.id });
  assert.equal(created.lifecycleStatus, "draft_failed");
  assert.equal(created.titleLocked, false);
  assert.equal(repos.workbenchSessions.latest({ scopeKind: "project", scopeId: project.id }), null, "failed drafts stay out of normal recent sessions");

  const active = repos.workbenchSessions.updateLifecycle({ sessionId: created.sessionId, lifecycleStatus: "active" });
  assert.equal(active.lifecycleStatus, "active");
  assert.equal(repos.workbenchSessions.latest({ scopeKind: "project", scopeId: project.id }).sessionId, created.sessionId);

  const renamed = repos.workbenchSessions.rename({ sessionId: created.sessionId, title: "接口验收" });
  assert.equal(renamed.title, "接口验收");
  assert.equal(renamed.titleLocked, true);
  assert.equal(repos.workbenchSessions.setTitleIfEmpty(created.sessionId, "不得覆盖").title, "接口验收");

  const touched = repos.workbenchSessions.touch(created.sessionId, new Date("2026-08-20T09:00:00.000Z"));
  assert.equal(touched.selection.provider, "deepseek-official");
  assert.equal(touched.selection.model, "deepseek-v4-flash");

  const kb = repos.knowledgeBases.create({ name: "Manual" });
  repos.workbenchSessions.create({
    sessionId: "session-cpwb-kb",
    scope: { kind: "knowledge_base", id: kb.id },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
    now: new Date("2026-08-20T10:00:00.000Z"),
  });
  const independent = repos.workbenchSessions.create({
    sessionId: "session-cpwb-independent",
    scope: { kind: "independent" },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
    now: new Date("2026-08-20T11:00:00.000Z"),
  });
  assert.deepEqual(independent.scope, { kind: "independent", id: null });
  assert.equal(repos.workbenchSessions.setTitleIfEmpty(independent.sessionId, "检查登录流程").title, "检查登录流程");
  assert.equal(repos.workbenchSessions.setTitleIfEmpty(independent.sessionId, "不应覆盖").title, "检查登录流程");
  assert.equal(repos.workbenchSessions.listAll({ query: "登录" })[0].sessionId, independent.sessionId);
  assert.deepEqual(
    repos.workbenchSessions.listAll({ limit: 8 }).map((row) => [row.sessionId, row.contextName]),
    [
      ["session-cpwb-independent", "独立"],
      ["session-cpwb-kb", "Manual"],
      ["session-cpwb-project", "Workbench"],
    ],
  );

  const moved = repos.workbenchSessions.updateScope({ sessionId: independent.sessionId, scope: { kind: "project", id: project.id } });
  assert.deepEqual(moved.scope, { kind: "project", id: project.id });
  assert.throws(
    () => repos.workbenchSessions.create({ sessionId: "bad-independent", scope: { kind: "independent", id: project.id } }),
    /scope/i,
  );
});

test("workbench session search composes scope and keyword filters", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Research" });
  const other = repos.projects.create({ name: "Other" });
  repos.workbenchSessions.create({ sessionId: "session-hit", scope: { kind: "project", id: project.id }, title: "修复定时任务" });
  repos.workbenchSessions.create({ sessionId: "session-title-miss", scope: { kind: "project", id: project.id }, title: "知识库索引" });
  repos.workbenchSessions.create({ sessionId: "session-scope-miss", scope: { kind: "project", id: other.id }, title: "修复定时任务" });

  assert.deepEqual(
    repos.workbenchSessions.listAll({ scopeKind: "project", scopeId: project.id, query: "定时" }).map((row) => row.sessionId),
    ["session-hit"],
  );
  assert.equal(repos.workbenchSessions.countAll({ scopeKind: "project", scopeId: project.id, query: "定时" }), 1);
});

test("summaries are unique per project and date and upsert is idempotent", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Neural" });
  const first = repos.summaries.upsert({
    projectId: project.id,
    summaryDate: "2026-08-17",
    content: "first draft",
    status: "pending",
  });

  const again = repos.summaries.upsert({
    projectId: project.id,
    summaryDate: "2026-08-17",
    content: "final summary",
    status: "completed",
  });
  assert.equal(again.id, first.id, "upsert reuses the row for the same day");
  assert.equal(again.content, "final summary");
  assert.equal(again.status, "completed");
  assert.equal(repos.summaries.list({ projectId: project.id }).length, 1);

  // A different date is a distinct row.
  repos.summaries.upsert({ projectId: project.id, summaryDate: "2026-08-18", content: "next day" });
  assert.equal(repos.summaries.list({ projectId: project.id }).length, 2);

  assert.equal(repos.summaries.get(first.id).summaryDate, "2026-08-17");
});

test("summaries remove exactly one persisted record", async (t) => {
  const dataDir = await createTempDir();
  t.after(async () => removeTempDir(dataDir));
  const db = openDatabase({ dataDir });
  t.after(() => closeDatabase(db));
  const repos = createRepositories(db);
  const project = repos.projects.create({ name: "P" });
  const first = repos.summaries.upsert({ projectId: project.id, summaryDate: "2026-08-17", content: "first", status: "completed" });
  const second = repos.summaries.upsert({ projectId: project.id, summaryDate: "2026-08-18", content: "second", status: "completed" });

  assert.equal(repos.summaries.remove(first.id).id, first.id);
  assert.equal(repos.summaries.get(first.id), null);
  assert.equal(repos.summaries.get(second.id).content, "second");
  assert.equal(repos.summaries.remove(first.id), null);
});

test("project automation toggles persist independently and missed runs stay observable", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(() => { closeDatabase(db); return removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Automation" });
  assert.deepEqual(
    { summaryEnabled: repos.automation.get(project.id).summaryEnabled, nextDayTodosEnabled: repos.automation.get(project.id).nextDayTodosEnabled },
    { summaryEnabled: true, nextDayTodosEnabled: true },
  );
  const updated = repos.automation.update({ projectId: project.id, summaryEnabled: false, nextDayTodosEnabled: true });
  assert.equal(updated.summaryEnabled, false);
  assert.equal(updated.nextDayTodosEnabled, true);

  const schedule = repos.schedules.create({ projectId: project.id, name: "old", rule: "daily 21:00" });
  const run = repos.schedules.claimRun({ scheduleId: schedule.id, scheduledAt: "2026-08-18T13:00:00.000Z" });
  const missed = repos.schedules.missRun({ id: run.id, error: "older than 24 hours" });
  assert.equal(missed.status, "missed");
});

test("project knowledge base associations link, list, and unlink", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const p1 = repos.projects.create({ name: "Alpha" });
  const p2 = repos.projects.create({ name: "Beta" });
  const k1 = repos.knowledgeBases.create({ name: "Manual" });
  const k2 = repos.knowledgeBases.create({ name: "Archive" });

  repos.projectKnowledgeBases.link({ projectId: p1.id, knowledgeBaseId: k1.id });
  repos.projectKnowledgeBases.link({ projectId: p1.id, knowledgeBaseId: k2.id });
  repos.projectKnowledgeBases.link({ projectId: p2.id, knowledgeBaseId: k1.id });
  // Linking again is idempotent.
  repos.projectKnowledgeBases.link({ projectId: p1.id, knowledgeBaseId: k1.id });

  assert.deepEqual(
    repos.projectKnowledgeBases.listByProject(p1.id).map((k) => k.id).sort((a, b) => a - b),
    [k1.id, k2.id].sort((a, b) => a - b),
  );
  assert.deepEqual(
    repos.projectKnowledgeBases.listByKnowledgeBase(k1.id).map((p) => p.id).sort((a, b) => a - b),
    [p1.id, p2.id].sort((a, b) => a - b),
  );

  const removed = repos.projectKnowledgeBases.unlink({ projectId: p1.id, knowledgeBaseId: k1.id });
  assert.equal(removed, 1);
  assert.deepEqual(repos.projectKnowledgeBases.listByProject(p1.id).map((k) => k.id), [k2.id]);
});

test("chunks replace, list, and delete keep the FTS index in sync across text, locator, heading, and filename", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const doc = repos.documents.upsertBySha256({
    sha256: "d".repeat(64),
    originalName: "notes.md",
    mimeType: "text/markdown",
    size: 5,
  });

  repos.chunks.replaceForDocument({
    documentId: doc.id,
    chunks: [
      { ordinal: 0, text: "alpha beta gamma", locator: "lines:1-2", heading: "Chapter One", originalName: "notes.md", contentHash: "h1" },
    ],
  });

  const persisted = repos.chunks.listByDocument(doc.id);
  assert.equal(persisted.length, 1);
  assert.equal(persisted[0].heading, "Chapter One", "heading survives the write");
  assert.equal(persisted[0].originalName, "notes.md", "original name survives the write");

  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'beta'").all().length,
    1,
    "inserted chunk text is searchable via FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'Chapter'").all().length,
    1,
    "heading is searchable via FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'notes'").all().length,
    1,
    "original name is searchable via FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'lines'").all().length,
    1,
    "locator is searchable via FTS",
  );

  repos.chunks.replaceForDocument({
    documentId: doc.id,
    chunks: [
      { ordinal: 0, text: "foo bar baz", locator: "lines:1-2", heading: "Part Two", originalName: "notes.md", contentHash: "h2" },
      { ordinal: 1, text: "qux quux corge", locator: "lines:3-4", heading: null, originalName: "notes.md", contentHash: "h3" },
    ],
  });

  const after = repos.chunks.listByDocument(doc.id);
  assert.equal(after.length, 2);
  assert.deepEqual(after.map((c) => c.heading), ["Part Two", null], "nullable heading is preserved in order");

  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'beta'").all().length,
    0,
    "replaced chunk text is removed from FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'bar'").all().length,
    1,
    "new chunk text is searchable via FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'Chapter'").all().length,
    0,
    "old heading is removed from FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'Part'").all().length,
    1,
    "new heading is searchable via FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'corge'").all().length,
    1,
    "a null-heading chunk still syncs and stays searchable by text",
  );

  const removed = repos.chunks.deleteForDocument(doc.id);
  assert.equal(removed, 2);
  assert.equal(repos.chunks.listByDocument(doc.id).length, 0);
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'bar'").all().length,
    0,
    "deleted chunks are removed from FTS",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'notes'").all().length,
    0,
    "deleted filename is removed from FTS",
  );
});

test("chunks_fts uses the trigram tokenizer: unspaced CJK MATCH, bm25, and external-content sync", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  // 1. The initial schema declares the trigram tokenizer.
  const ddl = db.prepare(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'chunks_fts'",
  ).get();
  assert.ok(ddl && ddl.sql, "chunks_fts DDL is recorded");
  assert.match(ddl.sql, /tokenize\s*=\s*['"]trigram['"]/, "chunks_fts uses tokenize = trigram");

  const doc = repos.documents.upsertBySha256({
    sha256: "e".repeat(64),
    originalName: "深度学习神经网络入门教程.md",
    mimeType: "text/plain",
    size: 5,
  });

  // 2. MATCH: an unspaced CJK substring (>= 3 code points) hits without any
  //    artificial spaces in the stored text.
  repos.chunks.replaceForDocument({
    documentId: doc.id,
    chunks: [
      { ordinal: 0, text: "深度学习神经网络入门教程", locator: "lines:1-2", heading: "第一章", originalName: "深度学习神经网络入门教程.md", contentHash: "h1" },
    ],
  });
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH '神经网络'").all().length,
    1,
    "unspaced CJK substring is searchable via trigram",
  );

  // 3. bm25 is available with the trigram tokenizer and returns a finite score.
  const bm = db.prepare(
    "SELECT rowid, bm25(chunks_fts) AS score FROM chunks_fts WHERE chunks_fts MATCH '神经网络' ORDER BY bm25(chunks_fts)",
  ).all();
  assert.equal(bm.length, 1);
  assert.ok(Number.isFinite(bm[0].score), "bm25 returns a finite score for a trigram MATCH");

  // 4. external-content delete trigger removes FTS rows.
  repos.chunks.deleteForDocument(doc.id);
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH '神经网络'").all().length,
    0,
    "delete trigger removes FTS rows",
  );

  // 5. external-content update trigger syncs both directions: old text leaves
  //    the index and new text enters it.
  repos.chunks.replaceForDocument({
    documentId: doc.id,
    chunks: [
      { ordinal: 0, text: "old neural text alpha", locator: "l1", heading: "H1", originalName: "深度学习神经网络入门教程.md", contentHash: "h2" },
    ],
  });
  repos.chunks.replaceForDocument({
    documentId: doc.id,
    chunks: [
      { ordinal: 0, text: "new neural text beta", locator: "l2", heading: "H2", originalName: "深度学习神经网络入门教程.md", contentHash: "h3" },
    ],
  });
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'alpha'").all().length,
    0,
    "update trigger removed the old text",
  );
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH 'beta'").all().length,
    1,
    "update trigger added the new text",
  );
});

test("session context overrides replace mode for one source and reject self references", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Project" });
  const kb = repos.knowledgeBases.create({ name: "Manual" });
  const session = repos.workbenchSessions.create({
    sessionId: "session-cpwb-context",
    scope: { kind: "project", id: project.id },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
  });

  repos.sessionContextSources.set({
    sessionId: session.sessionId,
    sourceKind: "knowledge_base",
    sourceId: String(kb.id),
    mode: "pinned",
  });
  repos.sessionContextSources.set({
    sessionId: session.sessionId,
    sourceKind: "knowledge_base",
    sourceId: String(kb.id),
    mode: "disabled",
  });
  assert.deepEqual(repos.sessionContextSources.list(session.sessionId).map((row) => row.mode), ["disabled"]);
  assert.equal(repos.sessionContextSources.remove({ sessionId: session.sessionId, sourceKind: "knowledge_base", sourceId: String(kb.id) }), true);
  assert.deepEqual(repos.sessionContextSources.list(session.sessionId), []);
  assert.throws(() => repos.sessionContextSources.set({
    sessionId: session.sessionId,
    sourceKind: "session",
    sourceId: session.sessionId,
    mode: "pinned",
  }), /itself|self/i);
  assert.throws(() => repos.sessionContextSources.set({
    sessionId: session.sessionId,
    sourceKind: "unknown",
    sourceId: "1",
    mode: "pinned",
  }), /source/i);
});

test("message context references are idempotent and cascade with their session", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const session = repos.workbenchSessions.create({
    sessionId: "session-cpwb-message-context",
    scope: { kind: "independent" },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
  });
  repos.messageContextRefs.addMany({
    sessionId: session.sessionId,
    messageId: "message-1",
    sources: [
      { kind: "knowledge_base", id: "7" },
      { kind: "knowledge_base", id: "7" },
      { kind: "workspace_file", id: "src/host/api.js" },
    ],
  });
  assert.deepEqual(repos.messageContextRefs.list({ sessionId: session.sessionId, messageId: "message-1" }).map((row) => [row.sourceKind, row.sourceId]), [
    ["knowledge_base", "7"],
    ["workspace_file", "src/host/api.js"],
  ]);
  repos.workbenchSessions.remove(session.sessionId);
  assert.deepEqual(repos.messageContextRefs.list({ sessionId: session.sessionId, messageId: "message-1" }), []);
});

test("todos update title, dueAt, done, and completed_at", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Todos" });
  const todo = repos.todos.create({ projectId: project.id, title: "Do the thing", dueAt: "2026-08-18T12:00:00.000Z" });
  assert.equal(todo.done, false);

  const updated = repos.todos.update({ id: todo.id, title: "Do the revised thing", dueAt: "2026-08-19T12:00:00.000Z", now: "2026-08-17T09:00:00.000Z" });
  assert.equal(updated.title, "Do the revised thing");
  assert.equal(updated.dueAt, "2026-08-19T12:00:00.000Z");
  assert.equal(updated.done, false);
  assert.equal(updated.completedAt, null);

  const done = repos.todos.update({ id: todo.id, done: true, now: "2026-08-17T10:00:00.000Z" });
  assert.equal(done.done, true);
  assert.equal(done.completedAt, "2026-08-17T10:00:00.000Z");

  const editedAfterCompletion = repos.todos.update({
    id: todo.id,
    title: "Completed revised thing",
    dueAt: "2026-08-20T12:00:00.000Z",
    now: "2026-08-17T12:00:00.000Z",
  });
  assert.equal(editedAfterCompletion.completedAt, "2026-08-17T10:00:00.000Z", "editing a completed todo preserves completion time");

  // Reopening clears completed_at.
  const reopened = repos.todos.update({ id: todo.id, done: false, now: "2026-08-17T11:00:00.000Z" });
  assert.equal(reopened.done, false);
  assert.equal(reopened.completedAt, null);
});

test("schedule runs close out via completeRun and failRun", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  const project = repos.projects.create({ name: "Automation" });
  const schedule = repos.schedules.create({ projectId: project.id, name: "summary", rule: "daily 21:00" });

  const run = repos.schedules.claimRun({
    scheduleId: schedule.id,
    scheduledAt: "2026-08-17T21:00:00.000Z",
    startedAt: "2026-08-17T21:00:00.100Z",
  });
  assert.equal(run.claimed, true);

  const completed = repos.schedules.completeRun({
    id: run.id,
    sessionId: "sess-42",
    finishedAt: "2026-08-17T21:00:30.000Z",
  });
  assert.equal(completed.status, "completed");
  assert.equal(completed.sessionId, "sess-42");
  assert.equal(completed.finishedAt, "2026-08-17T21:00:30.000Z");

  const failedRun = repos.schedules.claimRun({
    scheduleId: schedule.id,
    scheduledAt: "2026-08-18T21:00:00.000Z",
  });
  const failed = repos.schedules.failRun({
    id: failedRun.id,
    sessionId: "sess-failed",
    error: "local embedding unavailable",
    finishedAt: "2026-08-18T21:00:05.000Z",
  });
  assert.equal(failed.status, "failed");
  assert.equal(failed.sessionId, "sess-failed");
  assert.equal(failed.error, "local embedding unavailable");
  assert.equal(failed.finishedAt, "2026-08-18T21:00:05.000Z");
});

test("legacy v1 database upgrades to trigram FTS and preserves existing chunks", async (t) => {
  const dataDir = await createTempDir();
  const file = join(dataDir, "workbench.sqlite");

  // Build a genuine v1 database: user_version=1, populated documents + chunks,
  // and a chunks_fts using the default (unicode61) tokenizer, which cannot
  // match unspaced CJK substrings.
  const legacy = new DatabaseSync(file);
  legacy.exec(`
    CREATE TABLE documents (
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
    CREATE TABLE chunks (
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
    CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
    CREATE TABLE plans (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
    CREATE VIRTUAL TABLE chunks_fts USING fts5(text, locator, heading, original_name);
    CREATE TRIGGER chunks_ai AFTER INSERT ON chunks BEGIN
      INSERT INTO chunks_fts(rowid, text, locator, heading, original_name)
        VALUES (new.id, new.text, new.locator, new.heading, new.original_name);
    END;
    CREATE TRIGGER chunks_ad AFTER DELETE ON chunks BEGIN
      INSERT INTO chunks_fts(chunks_fts, rowid, text, locator, heading, original_name)
        VALUES ('delete', old.id, old.text, old.locator, old.heading, old.original_name);
    END;
    CREATE TRIGGER chunks_au AFTER UPDATE ON chunks BEGIN
      INSERT INTO chunks_fts(chunks_fts, rowid, text, locator, heading, original_name)
        VALUES ('delete', old.id, old.text, old.locator, old.heading, old.original_name);
      INSERT INTO chunks_fts(rowid, text, locator, heading, original_name)
        VALUES (new.id, new.text, new.locator, new.heading, new.original_name);
    END;
  `);
  legacy.prepare(
    "INSERT INTO documents (sha256, original_name, mime_type, size, status, created_at) " +
      "VALUES (?, ?, ?, ?, 'ready', ?)",
  ).run("a".repeat(64), "深度学习神经网络入门教程.md", "text/plain", 5, "2026-08-17T00:00:00.000Z");
  legacy.prepare(
    "INSERT INTO chunks (document_id, ordinal, text, locator, heading, original_name, content_hash) " +
      "VALUES (1, 0, ?, ?, ?, ?, ?)",
  ).run("深度学习神经网络入门教程", "lines:1-2", "第一章", "深度学习神经网络入门教程.md", "h1");
  legacy.exec("PRAGMA user_version = 1");

  // Precondition: the old tokenizer cannot match the unspaced CJK substring.
  assert.equal(
    legacy.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH '神经网络'").all().length,
    0,
    "precondition: the unicode61 tokenizer does not index unspaced CJK substrings",
  );
  legacy.close();

  const db = openDatabase({ dataDir });
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });

  // Reopening upgrades the database to the current schema version.
  assert.equal(db.prepare("PRAGMA user_version").get().user_version, SCHEMA_VERSION);

  // The FTS table now uses the trigram tokenizer (external content table).
  const ddl = db.prepare(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'chunks_fts'",
  ).get();
  assert.ok(ddl && ddl.sql, "chunks_fts DDL is recorded after upgrade");
  assert.match(ddl.sql, /tokenize\s*=\s*['"]trigram['"]/, "chunks_fts uses tokenize = trigram after upgrade");

  // Existing documents and chunks survived the migration.
  assert.equal(db.prepare("SELECT id FROM documents").all().length, 1, "documents data is preserved");
  assert.equal(db.prepare("SELECT id FROM chunks").all().length, 1, "chunks data is preserved");

  // The pre-existing chunk is now searchable by the unspaced CJK substring.
  assert.equal(
    db.prepare("SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH '神经网络'").all().length,
    1,
    "existing chunk is searchable via trigram after upgrade",
  );

  for (const table of ["todos", "workbench_settings", "project_automation"]) {
    assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table)?.name, table, "v1 migration creates " + table);
  }
  for (const table of ["tasks", "plans"]) {
    assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table), undefined, "v1 migration removes " + table);
  }
});

test("v2 and v3 databases reach the current todo schema without legacy tables", async (t) => {
  const roots = [];
  t.after(async () => Promise.all(roots.map(async (dataDir) => removeTempDir(dataDir))));
  for (const version of [2, 3]) {
    const dataDir = await createTempDir("cpwb-migration-");
    roots.push(dataDir);
    const legacy = new DatabaseSync(join(dataDir, "workbench.sqlite"));
    legacy.exec(`
      CREATE TABLE projects (id INTEGER PRIMARY KEY);
      CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
      CREATE TABLE plans (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
      PRAGMA user_version = ${version};
    `);
    legacy.close();

    const db = openDatabase({ dataDir });
    for (const table of ["todos", "workbench_settings", "project_automation"]) {
      assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table)?.name, table, `v${version} migration creates ${table}`);
    }
    for (const table of ["tasks", "plans"]) {
      assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table), undefined, `v${version} migration removes ${table}`);
    }
    assert.equal(db.prepare("PRAGMA user_version").get().user_version, SCHEMA_VERSION);
    closeDatabase(db);
  }
});

test("todos schema constrains source and done values", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const project = db.prepare("INSERT INTO projects (name, created_at, updated_at) VALUES ('P', 'now', 'now')").run();
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });
  const projectId = Number(project.lastInsertRowid);
  const insert = db.prepare("INSERT INTO todos (project_id, title, done, source, due_at, created_at) VALUES (?, ?, ?, ?, ?, ?)");
  assert.throws(() => insert.run(projectId, "bad source", 0, "imported", "2026-08-20T10:00:00.000Z", "2026-08-20T00:00:00.000Z"), /CHECK constraint/i);
  assert.throws(() => insert.run(projectId, "bad done", 2, "manual", "2026-08-20T10:00:00.000Z", "2026-08-20T00:00:00.000Z"), /CHECK constraint/i);
});

test("v6 databases preserve valid sessions while removing the knowledge chat identity", async (t) => {
  const dataDir = await createTempDir();
  const file = join(dataDir, "workbench.sqlite");
  const legacy = new DatabaseSync(file);
  legacy.exec(`
    CREATE TABLE projects (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE knowledge_bases (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE project_knowledge_bases (project_id INTEGER NOT NULL, knowledge_base_id INTEGER NOT NULL, PRIMARY KEY(project_id, knowledge_base_id));
    CREATE TABLE schedules (
      id INTEGER PRIMARY KEY, project_id INTEGER NOT NULL, name TEXT NOT NULL, prompt TEXT, rule TEXT NOT NULL,
      recurrence TEXT, starts_at TEXT, enabled INTEGER NOT NULL DEFAULT 1, last_run_at TEXT, next_run_at TEXT
    );
    CREATE TABLE knowledge_chats (id INTEGER PRIMARY KEY, knowledge_base_id INTEGER NOT NULL, title TEXT, dsh_session_id TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE workbench_sessions (
      session_id TEXT PRIMARY KEY,
      scope_kind TEXT NOT NULL,
      scope_id INTEGER,
      chat_id INTEGER,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      reasoning_effort TEXT,
      title TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    INSERT INTO projects VALUES (1, 'P', '2026-08-20T00:00:00.000Z', '2026-08-20T00:00:00.000Z');
    INSERT INTO knowledge_bases VALUES (2, 'K', '2026-08-20T00:00:00.000Z', '2026-08-20T00:00:00.000Z');
    INSERT INTO project_knowledge_bases VALUES (1, 2);
    INSERT INTO knowledge_chats VALUES (3, 2, 'old', 'session-cpwb-kb', '2026-08-20T00:00:00.000Z', '2026-08-20T00:00:00.000Z');
    INSERT INTO workbench_sessions VALUES ('session-cpwb-kb', 'knowledge_base', 2, 3, 'deepseek-official', 'deepseek-v4-flash', 'high', '保留标题', '2026-08-20T00:00:00.000Z', '2026-08-20T01:00:00.000Z');
    PRAGMA user_version = 6;
  `);
  legacy.close();

  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });
  assert.equal(db.prepare("PRAGMA user_version").get().user_version, SCHEMA_VERSION);
  assert.equal(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge_chats'").get(), undefined);
  assert.equal(db.prepare("PRAGMA table_info(workbench_sessions)").all().some((column) => column.name === "chat_id"), false);
  const migrated = repos.workbenchSessions.get("session-cpwb-kb");
  assert.deepEqual(migrated.scope, { kind: "knowledge_base", id: 2 });
  assert.equal(migrated.title, "保留标题");
  assert.equal(migrated.titleLocked, false);
  assert.equal(migrated.lifecycleStatus, "active");
  assert.equal(repos.projectKnowledgeBases.listByProject(1)[0].id, 2);
});

test("session archive is reversible and excluded from active session queries", async (t) => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });

  const project = repos.projects.create({ name: "Archive Lab" });
  repos.workbenchSessions.create({
    sessionId: "session-cpwb-archive",
    scope: { kind: "project", id: project.id },
    title: "待归档会话",
  });

  const archived = repos.workbenchSessions.archive("session-cpwb-archive", new Date("2026-08-23T09:30:00.000Z"));
  assert.equal(archived.archivedAt, "2026-08-23T09:30:00.000Z");
  assert.deepEqual(repos.workbenchSessions.listAll({ archived: false }).map((row) => row.sessionId), []);
  assert.deepEqual(repos.workbenchSessions.listAll({ archived: true }).map((row) => row.sessionId), ["session-cpwb-archive"]);
  assert.deepEqual(repos.workbenchSessions.list({ scopeKind: "project", scopeId: project.id, archived: false }), []);
  assert.equal(repos.workbenchSessions.latest({ scopeKind: "project", scopeId: project.id }), null);

  const restored = repos.workbenchSessions.restore("session-cpwb-archive", new Date("2026-08-23T10:00:00.000Z"));
  assert.equal(restored.archivedAt, null);
  assert.deepEqual(repos.workbenchSessions.listAll({ archived: false }).map((row) => row.sessionId), ["session-cpwb-archive"]);
  assert.equal(repos.workbenchSessions.countAll({ archived: true }), 0);
});

test("v7 databases gain archive metadata without losing sessions", async (t) => {
  const dataDir = await createTempDir();
  const legacy = new DatabaseSync(join(dataDir, "workbench.sqlite"));
  legacy.exec(`
    CREATE TABLE projects (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE knowledge_bases (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE schedules (
      id INTEGER PRIMARY KEY, project_id INTEGER NOT NULL, name TEXT NOT NULL, prompt TEXT, rule TEXT NOT NULL,
      recurrence TEXT, starts_at TEXT, enabled INTEGER NOT NULL DEFAULT 1, last_run_at TEXT, next_run_at TEXT
    );
    CREATE TABLE workbench_sessions (
      session_id TEXT PRIMARY KEY,
      scope_kind TEXT NOT NULL,
      scope_id INTEGER,
      provider TEXT,
      model TEXT,
      reasoning_effort TEXT,
      title TEXT,
      title_locked INTEGER NOT NULL DEFAULT 0,
      lifecycle_status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    INSERT INTO workbench_sessions VALUES (
      'session-cpwb-v7', 'independent', NULL, NULL, NULL, NULL, '旧会话', 0, 'active',
      '2026-08-20T00:00:00.000Z', '2026-08-20T01:00:00.000Z'
    );
    PRAGMA user_version = 7;
  `);
  legacy.close();

  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });
  assert.equal(db.prepare("PRAGMA user_version").get().user_version, SCHEMA_VERSION);
  assert.equal(repos.workbenchSessions.get("session-cpwb-v7").archivedAt, null);
  assert.equal(db.prepare("PRAGMA table_info(workbench_sessions)").all().some((column) => column.name === "archived_at"), true);
});

test("v8 databases gain persistent schedule session binding", async (t) => {
  const dataDir = await createTempDir();
  const legacy = new DatabaseSync(join(dataDir, "workbench.sqlite"));
  legacy.exec(`
    CREATE TABLE projects (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE knowledge_bases (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE workbench_sessions (
      session_id TEXT PRIMARY KEY,
      scope_kind TEXT NOT NULL,
      scope_id INTEGER,
      provider TEXT,
      model TEXT,
      reasoning_effort TEXT,
      title TEXT,
      title_locked INTEGER NOT NULL DEFAULT 0,
      lifecycle_status TEXT NOT NULL DEFAULT 'active',
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE schedules (
      id INTEGER PRIMARY KEY,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      prompt TEXT,
      rule TEXT NOT NULL,
      recurrence TEXT,
      starts_at TEXT,
      enabled INTEGER NOT NULL DEFAULT 1,
      last_run_at TEXT,
      next_run_at TEXT
    );
    INSERT INTO projects VALUES (1, 'P', '2026-08-20T00:00:00.000Z', '2026-08-20T00:00:00.000Z');
    INSERT INTO workbench_sessions VALUES (
      'session-cpwb-v8', 'project', 1, NULL, NULL, NULL, '旧会话', 0, 'active', NULL,
      '2026-08-20T00:00:00.000Z', '2026-08-20T01:00:00.000Z'
    );
    INSERT INTO schedules VALUES (1, 1, '旧任务', 'run', 'daily 21:00', 'daily', NULL, 1, NULL, NULL);
    PRAGMA user_version = 8;
  `);
  legacy.close();

  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  t.after(async () => { closeDatabase(db); await removeTempDir(dataDir); });
  assert.equal(db.prepare("PRAGMA user_version").get().user_version, SCHEMA_VERSION);
  assert.equal(repos.schedules.get(1).sessionId, null);
  assert.equal(repos.schedules.bindSession({ id: 1, sessionId: "session-cpwb-v8" }).sessionId, "session-cpwb-v8");
  assert.equal(repos.workbenchSessions.get("session-cpwb-v8").sessionType, "schedule");
});
