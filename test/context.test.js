import { test } from "node:test";
import assert from "node:assert/strict";

import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import { createContextResolver, ContextSourceError } from "../src/host/context.js";
import { createTempDir, removeTempDir } from "./helpers.js";

async function fixture() {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const project = repos.projects.create({ name: "Project", workspaceId: "ws-project" });
  const kbA = repos.knowledgeBases.create({ name: "A" });
  const kbB = repos.knowledgeBases.create({ name: "B" });
  repos.projectKnowledgeBases.link({ projectId: project.id, knowledgeBaseId: kbA.id });
  const projectSession = repos.workbenchSessions.create({
    sessionId: "session-project",
    scope: { kind: "project", id: project.id },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
  });
  const kbSession = repos.workbenchSessions.create({
    sessionId: "session-kb",
    scope: { kind: "knowledge_base", id: kbA.id },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
  });
  const independentSession = repos.workbenchSessions.create({
    sessionId: "session-independent",
    scope: { kind: "independent" },
    provider: "deepseek-official",
    model: "deepseek-v4-flash",
  });
  const resolver = createContextResolver({ repos });
  return {
    repos, project, kbA, kbB, projectSession, kbSession, independentSession, resolver,
    async close() { closeDatabase(db); await removeTempDir(dataDir); },
  };
}

test("project context is computed live from workspace and linked knowledge bases", async () => {
  const f = await fixture();
  try {
    assert.deepEqual(f.resolver.resolve({ sessionId: f.projectSession.sessionId }), [
      { kind: "workspace_file", id: String(f.project.id), state: "inherited", available: true },
      { kind: "knowledge_base", id: String(f.kbA.id), state: "inherited", available: true },
    ]);

    f.repos.projectKnowledgeBases.link({ projectId: f.project.id, knowledgeBaseId: f.kbB.id });
    assert.deepEqual(
      f.resolver.resolve({ sessionId: f.projectSession.sessionId }).map((source) => source.id),
      [String(f.project.id), String(f.kbA.id), String(f.kbB.id)],
      "an existing session sees a newly linked KB without copied context rows",
    );
  } finally {
    await f.close();
  }
});

test("disabled inherited sources disappear while pinned sources survive unlinking", async () => {
  const f = await fixture();
  try {
    f.resolver.setOverride({
      sessionId: f.projectSession.sessionId,
      source: { kind: "knowledge_base", id: String(f.kbA.id) },
      mode: "disabled",
    });
    assert.deepEqual(f.resolver.resolve({ sessionId: f.projectSession.sessionId }).map((source) => source.kind), ["workspace_file"]);

    f.resolver.setOverride({
      sessionId: f.projectSession.sessionId,
      source: { kind: "knowledge_base", id: String(f.kbB.id) },
      mode: "pinned",
    });
    f.repos.projectKnowledgeBases.link({ projectId: f.project.id, knowledgeBaseId: f.kbB.id });
    f.repos.projectKnowledgeBases.unlink({ projectId: f.project.id, knowledgeBaseId: f.kbB.id });
    assert.deepEqual(f.resolver.resolve({ sessionId: f.projectSession.sessionId }).at(-1), {
      kind: "knowledge_base", id: String(f.kbB.id), state: "pinned", available: true,
    });
  } finally {
    await f.close();
  }
});

test("knowledge-base and independent sessions expose only their own inherited context", async () => {
  const f = await fixture();
  try {
    assert.deepEqual(f.resolver.resolve({ sessionId: f.kbSession.sessionId }), [
      { kind: "knowledge_base", id: String(f.kbA.id), state: "inherited", available: true },
    ]);
    assert.deepEqual(f.resolver.resolve({ sessionId: f.independentSession.sessionId }), []);
  } finally {
    await f.close();
  }
});

test("rebase removes obsolete disabled overrides and preserves pinned sources", async () => {
  const f = await fixture();
  try {
    f.resolver.setOverride({ sessionId: f.projectSession.sessionId, source: { kind: "knowledge_base", id: String(f.kbA.id) }, mode: "disabled" });
    f.resolver.setOverride({ sessionId: f.projectSession.sessionId, source: { kind: "knowledge_base", id: String(f.kbB.id) }, mode: "pinned" });
    f.repos.workbenchSessions.updateScope({ sessionId: f.projectSession.sessionId, scope: { kind: "independent" } });

    f.resolver.rebase({
      sessionId: f.projectSession.sessionId,
      fromScope: { kind: "project", id: f.project.id },
      toScope: { kind: "independent", id: null },
    });
    assert.deepEqual(f.repos.sessionContextSources.list(f.projectSession.sessionId).map((source) => [source.sourceKind, source.sourceId, source.mode]), [
      ["knowledge_base", String(f.kbB.id), "pinned"],
    ]);
  } finally {
    await f.close();
  }
});

test("missing pinned sources remain visible as unavailable but are omitted from prompt descriptors", async () => {
  const f = await fixture();
  try {
    f.repos.workbenchSessions.create({
      sessionId: "session-missing",
      scope: { kind: "independent" },
      provider: "deepseek-official",
      model: "deepseek-v4-flash",
    });
    f.repos.sessionContextSources.set({
      sessionId: "session-missing", sourceKind: "knowledge_base", sourceId: "999999", mode: "pinned",
    });
    assert.deepEqual(f.resolver.resolve({ sessionId: "session-missing" }), [
      { kind: "knowledge_base", id: "999999", state: "pinned", available: false },
    ]);
    assert.deepEqual(f.resolver.resolveForPrompt({ sessionId: "session-missing" }), []);
  } finally {
    await f.close();
  }
});

test("one-shot sources are validated, deduplicated, and self references are rejected", async () => {
  const f = await fixture();
  try {
    const sources = f.resolver.resolveForPrompt({
      sessionId: f.independentSession.sessionId,
      oneShotSources: [
        { kind: "knowledge_base", id: String(f.kbA.id) },
        { kind: "knowledge_base", id: String(f.kbA.id) },
        { kind: "session", id: f.projectSession.sessionId },
      ],
    });
    assert.deepEqual(sources.map((source) => [source.kind, source.id, source.state]), [
      ["knowledge_base", String(f.kbA.id), "one_shot"],
      ["session", f.projectSession.sessionId, "one_shot"],
    ]);
    assert.throws(
      () => f.resolver.validate({ sessionId: f.projectSession.sessionId, sources: [{ kind: "session", id: f.projectSession.sessionId }] }),
      (error) => error instanceof ContextSourceError && error.code === "SELF_REFERENCE",
    );
  } finally {
    await f.close();
  }
});
