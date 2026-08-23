# Unified Session Context Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split project/knowledge-base/independent chat paths with one Workbench projection over native DSH sessions, add dynamic context sources, and deliver the approved three-column Workbench interaction without replacing the RC.2 conversation kernel.

**Architecture:** DSH remains the source of truth for messages, model selection, reasoning, Files API, tools, approvals, streaming, and Subagent activity. Workbench owns only session scope/lifecycle/title projections, project-to-knowledge-base links, context overrides, message references, project tools, and navigation. The host exposes one scope-based session API and one context resolver; the client keeps drafts local until the first valid prompt activates a native DSH session.

**Tech Stack:** Node.js 22+, ESM JavaScript, `node:sqlite`, React 19, DeepSeek Harness `0.1.1-rc.2` public host/client slots, Node test runner, existing Workbench CSS and Phosphor icons.

**Spec:** `docs/superpowers/specs/2026-08-23-unified-session-context-architecture-design.md`

## Global Constraints

- Work only in a registered linked worktree on a non-main branch.
- Preserve the native RC.2 `ConversationRoot`; never claim a second `conversation.session`, filter `conversation.view`, or duplicate native message/model/files/tools/Subagent renderers.
- Delete the deprecated `knowledge_chats`, `chatId`, and scope-specific create/reopen paths. Do not add a compatibility adapter.
- Do not persist a DSH session before the first non-empty user message.
- All production code changes follow red-green-refactor. Every new behavioral test must fail for the missing behavior before implementation.
- Reuse existing repositories, vector/chunk infrastructure, settings, modal primitives, responsive rail helpers, and native form controls. Add no dependency unless the installed stack cannot satisfy the requirement.
- Keep credentials, DSH data, uploaded documents, vector indexes, SQLite files, personal paths, and test fixtures out of Git.
- Before final handoff run `git diff --check`, `npm run check`, RC.2 isolated browser smoke tests, `git status --short`, and `git diff --stat`.

---

## File and Interface Map

### Host data and services

- Modify `src/host/config.js`: bump `SCHEMA_VERSION` from 6 to 7.
- Modify `src/host/database.js`: fresh schema and v6-to-v7 migration; remove `knowledge_chats` and `chat_id`; add lifecycle/title lock/context tables.
- Modify `src/host/repositories.js`: one `workbenchSessions` repository, `sessionContextSources`, `messageContextRefs`, and transactional container policies.
- Add `src/host/context.js`: dynamic inherited/pinned/disabled context resolution and validation.
- Add `src/host/session-index.js`: extract final user/assistant pairs and adapt them to existing chunk/vector indexing.
- Modify `src/host/sessions.js`: scope-based create/reopen/move/retry/delete and public RC.2 pre-step integration.
- Modify `src/host/api.js`: unified session/context/container APIs and stable errors.
- Modify `src/host/scheduler.js`: project-only conversation summaries and globally aggregated schedules.
- Modify `src/host/index.js`: inject resolver/index/container callbacks without new plugin ownership.

### Client state and UI

- Modify `src/client/api.js`: scope-based session, context, container policy, and global schedule contracts.
- Modify `src/client/store.js`: local draft lifecycle, unified session activation, move/rename/delete/context actions, container-aware lists.
- Modify `src/client/workbenchSessions.js`: runtime registry stores only `{ sessionId, scope }`; no `chatId`.
- Add `src/client/NewSessionDialog.js`: context-aware owner selection and inheritance preview.
- Modify `src/client/WorkbenchShell.js`: page/draft/session composition and modal ownership.
- Modify `src/client/WorkbenchSidebar.js`: fixed global actions, current-container section, deduplicated cross-container recents, fixed settings/logo footer.
- Modify `src/client/WorkbenchSessionShell.js`: three scope-specific right rails while native conversation remains the center.
- Modify `src/client/KnowledgeBase.js`, `src/client/Automation.js`, and `src/client/workbench.css`: relationship, global schedule, deletion, responsive, and Cyberpunk styling.
- Modify `scripts/reset-demo.mjs` and `scripts/verify.cjs`: new schema and production composition checks.

### Tests

- Modify `test/database.test.js`, `test/api.test.js`, `test/sessions.test.js`, `test/client-chat.test.js`, `test/scheduler.test.js`, `test/css.test.js`, and `test/task4-session-shell.test.js`.
- Add `test/context.test.js`, `test/session-index.test.js`, and `test/unified-session-ui.test.js` for behavior that does not fit an existing focused suite.

---

## Task 1: Migrate to one session projection and context metadata

**Files:**

- Modify: `src/host/config.js`
- Modify: `src/host/database.js`
- Modify: `src/host/repositories.js`
- Modify: `test/database.test.js`

- [ ] **Step 1: Write failing schema and repository tests**

Add tests proving a fresh database and a v6 database both reach schema v7 with:

```js
for (const table of [
  "workbench_sessions",
  "session_context_sources",
  "message_context_refs",
  "project_knowledge_bases",
]) assert.equal(hasTable(db, table), true);
assert.equal(hasTable(db, "knowledge_chats"), false);
assert.equal(hasColumn(db, "workbench_sessions", "chat_id"), false);
```

Add repository behavior tests for:

```js
const session = repos.workbenchSessions.create({
  sessionId: "session-cpwb-1",
  scope: { kind: "project", id: project.id },
  provider: "deepseek-official",
  model: "deepseek-v4-flash",
  lifecycleStatus: "draft_failed",
});
assert.equal(session.lifecycleStatus, "draft_failed");
assert.equal(session.titleLocked, false);

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
assert.equal(repos.sessionContextSources.list(session.sessionId)[0].mode, "disabled");
```

Also prove invalid scope pairs, invalid source kinds/modes, self references, and duplicate message refs are rejected by SQLite or repository validation.

- [ ] **Step 2: Run the focused suite and confirm RED**

Run:

```bash
node --test test/database.test.js
```

Expected failure: schema version/table/column and new repository methods are missing.

- [ ] **Step 3: Implement the v7 schema and minimal repositories**

Use this canonical shape:

```sql
CREATE TABLE workbench_sessions (
  session_id TEXT PRIMARY KEY,
  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('project','knowledge_base','independent')),
  scope_id INTEGER,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  reasoning_effort TEXT,
  title TEXT,
  title_locked INTEGER NOT NULL DEFAULT 0 CHECK (title_locked IN (0,1)),
  lifecycle_status TEXT NOT NULL DEFAULT 'active' CHECK (lifecycle_status IN ('draft_failed','active')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK ((scope_kind='independent' AND scope_id IS NULL) OR (scope_kind!='independent' AND scope_id IS NOT NULL))
);
```

`V6_TO_V7_MIGRATION_SQL` must rebuild `workbench_sessions` through a temporary table so valid v6 rows survive, then drop `knowledge_chats`. Add:

```sql
UNIQUE(session_id, source_kind, source_id)
```

to `session_context_sources`, and:

```sql
PRIMARY KEY(session_id, message_id, source_kind, source_id)
```

to `message_context_refs`.

Expose minimal repository methods:

```js
workbenchSessions.create(input)
workbenchSessions.updateScope({ sessionId, scope })
workbenchSessions.updateLifecycle({ sessionId, lifecycleStatus })
workbenchSessions.rename({ sessionId, title, titleLocked: true })
workbenchSessions.list({ scopeKind, scopeId, lifecycleStatus, limit, offset })
workbenchSessions.listAll({ scopeKind, query, lifecycleStatus, limit, offset })
sessionContextSources.set(input)
sessionContextSources.remove(input)
sessionContextSources.list(sessionId)
messageContextRefs.addMany({ sessionId, messageId, sources })
messageContextRefs.list({ sessionId, messageId })
```

Keep `upsert` only if an existing call still needs it during the same task; remove it once Task 2 converts all callers.

- [ ] **Step 4: Run GREEN and regression tests**

```bash
node --test test/database.test.js test/todos-auth-settings.test.js
```

- [ ] **Step 5: Commit**

```bash
git add src/host/config.js src/host/database.js src/host/repositories.js test/database.test.js
git commit -m "Unify Workbench session schema"
```

---

## Task 2: Unify host session lifecycle and API

**Files:**

- Modify: `src/host/session-errors.js`
- Modify: `src/host/sessions.js`
- Modify: `src/host/api.js`
- Modify: `src/host/index.js`
- Modify: `test/sessions.test.js`
- Modify: `test/api.test.js`

- [ ] **Step 1: Write failing lifecycle tests**

Add real service/repository tests for:

1. `createSession({ scope })` creates or resumes only after activation is requested.
2. Project, KB, and independent use the same scope contract.
3. No `knowledgeChats`, `chatId`, `projectId`, or `knowledgeBaseId` branch remains in the public session method.
4. A created DSH session whose first prompt fails is persisted as `draft_failed` with the original pending text available to the client response.
5. `retryDraft(sessionId)` reopens the same DSH session and becomes `active` only after a completed final answer.
6. Rename locks the Workbench title and updates native durable title through an injected `renameNativeSession` seam.
7. Move changes only scope/context projections and preserves DSH history/model selection.
8. Delete invokes the injected native DSH deletion adapter before removing Workbench metadata; failure leaves metadata intact.

Desired service boundary:

```js
await sessions.activateDraft({
  scope: { kind: "project", id: project.id },
  question: "整理今天的接口进展",
  oneShotSources: [],
  pinnedSources: [],
});
await sessions.patchSession(sessionId, {
  operation: "move",
  scope: { kind: "independent" },
});
```

- [ ] **Step 2: Confirm focused tests fail for the removed/absent contract**

```bash
node --test test/sessions.test.js test/api.test.js
```

- [ ] **Step 3: Implement one scope validator and lifecycle**

Use one canonical normalizer:

```js
normalizeScope({ kind, id })
// => { kind: 'independent', id: null }
// => { kind: 'project'|'knowledge_base', id: positiveInteger }
```

Replace `reopenKnowledgeChat` and branch-specific create paths with:

```js
resolveScope(scope)
createScopedSession({ scope, selection })
reopenScopedSession({ sessionId })
activateDraft({ scope, question, oneShotSources, pinnedSources })
retryDraft({ sessionId, question, oneShotSources })
```

DSH prompt submission still goes through the native SessionFace/public agent seam. Workbench must not create a second message persistence path.

- [ ] **Step 4: Replace API routes with scope operations**

Implement:

```text
GET    /chat/sessions?scopeKind=&scopeId=&query=&limit=&offset=
POST   /chat/sessions                     activate first prompt
PATCH  /chat/sessions/:sessionId          rename | move | retryDraft
DELETE /chat/sessions/:sessionId
GET    /chat/sessions/:sessionId/context
PUT    /chat/sessions/:sessionId/context
DELETE /chat/sessions/:sessionId/context
POST   /chat/sessions/:sessionId/context/promote
```

Remove `/knowledge-chats`. Keep `/chat/prompts` only for active-session subsequent prompts if the existing native bridge still consumes it; otherwise delete it and let native DSH own all prompt sends. Use stable errors: `INVALID_SCOPE`, `DRAFT_ACTIVATION_FAILED`, `CONTEXT_SOURCE_UNAVAILABLE`, `SESSION_DELETE_FAILED`.

- [ ] **Step 5: Run GREEN and API regression**

```bash
node --test test/sessions.test.js test/api.test.js test/host-lifecycle.test.js
```

- [ ] **Step 6: Commit**

```bash
git add src/host/session-errors.js src/host/sessions.js src/host/api.js src/host/index.js test/sessions.test.js test/api.test.js
git commit -m "Unify Workbench session lifecycle"
```

---

## Task 3: Resolve dynamic inherited, pinned, and disabled context

**Files:**

- Add: `src/host/context.js`
- Modify: `src/host/sessions.js`
- Modify: `src/host/retrieval.js`
- Add: `test/context.test.js`
- Modify: `test/sessions.test.js`

- [ ] **Step 1: Write failing resolver tests**

Cover these literal expectations:

```js
assert.deepEqual(
  resolver.resolve({ sessionId: projectSession.sessionId }),
  [
    { kind: "workspace_file", id: String(project.id), state: "inherited" },
    { kind: "knowledge_base", id: String(kbA.id), state: "inherited" },
    { kind: "knowledge_base", id: String(kbB.id), state: "pinned" },
  ],
);
```

Tests must prove:

- project KB links are read on every resolution, not copied to each session;
- a disabled inherited KB is absent;
- unlinking a KB removes inherited context but preserves the same source when it is pinned;
- KB scope inherits only its own KB;
- independent scope has no inherited sources;
- move performs smart rebase and removes inapplicable disabled overrides;
- missing/deleted sources are returned as unavailable metadata for UI but ignored by retrieval;
- self session references are rejected.

- [ ] **Step 2: Confirm RED**

```bash
node --test test/context.test.js
```

- [ ] **Step 3: Implement the resolver with repository composition**

Public surface:

```js
createContextResolver({ repos, filesApi, sourceAccess })
resolver.resolve({ sessionId })
resolver.validate({ sessionId, sources })
resolver.setOverride({ sessionId, source, mode })
resolver.removeOverride({ sessionId, source })
resolver.rebase({ sessionId, fromScope, toScope })
resolver.resolveForPrompt({ sessionId, oneShotSources })
```

The resolver returns identities and retrieval descriptors, not assembled prompt text. Reuse `projectKnowledgeBases`, `documents`, and RC.2 Files API access checks.

- [ ] **Step 4: Replace the current KB-only pre-step scope expansion**

`createWorkbenchRagPreStep` should ask `ContextResolver.resolveForPrompt` and pass the resulting source descriptors to the existing retrieval layer. Keep fail-closed behavior when a requested source is unavailable or an index is not ready.

- [ ] **Step 5: Run GREEN and session regression**

```bash
node --test test/context.test.js test/sessions.test.js test/retrieval.test.js
```

- [ ] **Step 6: Commit**

```bash
git add src/host/context.js src/host/sessions.js src/host/retrieval.js test/context.test.js test/sessions.test.js
git commit -m "Resolve unified session context"
```

---

## Task 4: Index final session messages and support message references

**Files:**

- Add: `src/host/session-index.js`
- Modify: `src/host/vectors.js`
- Modify: `src/host/retrieval.js`
- Modify: `src/host/sessions.js`
- Add: `test/session-index.test.js`
- Modify: `test/retrieval.test.js`

- [ ] **Step 1: Write failing final-body extraction tests**

Build a real event fixture containing user messages, assistant final messages, thinking, reasoning, tool calls/results, retry/error events, and partial stream events. Assert the exact indexed text:

```js
assert.deepEqual(extractSessionPairs(events), [{
  ordinal: 0,
  user: "请检查 Files API",
  assistant: "Files API 已通过范围校验。",
}]);
```

Also assert:

- later complete pairs receive deterministic ordinals and content hashes;
- no final assistant message means no pair;
- a referenced session is retrieved one level only;
- current-session references are rejected;
- deleted reference metadata yields `available: false` and does not abort other sources.

- [ ] **Step 2: Confirm RED**

```bash
node --test test/session-index.test.js test/retrieval.test.js
```

- [ ] **Step 3: Implement one adapter over existing vectors**

Use the installed embedding adapter and vector store; do not create another database or model client. Public surface:

```js
createSessionIndexAdapter({ sessionQuery, embedding, vectorStore })
adapter.extract(sessionId)
adapter.reindex(sessionId)
adapter.search({ sourceSessionId, query, limit, signal })
adapter.remove(sessionId)
```

Store source metadata that distinguishes `sourceKind: "session"` from document chunks. If the current vector store cannot safely multiplex session vectors, extend its key/metadata minimally rather than creating a second store.

- [ ] **Step 4: Persist one-shot refs only after native message identity exists**

Capture the public DSH user message ID returned/observed by the native send path and write `message_context_refs`. Promotion copies one ref into `session_context_sources` as `pinned`; it does not duplicate text.

- [ ] **Step 5: Run GREEN**

```bash
node --test test/session-index.test.js test/retrieval.test.js test/sessions.test.js
```

- [ ] **Step 6: Commit**

```bash
git add src/host/session-index.js src/host/vectors.js src/host/retrieval.js src/host/sessions.js test/session-index.test.js test/retrieval.test.js test/sessions.test.js
git commit -m "Index final session conversations"
```

---

## Task 5: Add client-only drafts and the unified new-session flow

**Files:**

- Modify: `src/client/api.js`
- Modify: `src/client/store.js`
- Modify: `src/client/workbenchSessions.js`
- Add: `src/client/NewSessionDialog.js`
- Modify: `src/client/WorkbenchShell.js`
- Modify: `test/client-chat.test.js`
- Add: `test/unified-session-ui.test.js`

- [ ] **Step 1: Write failing store tests for draft lifecycle**

Test the observable state transitions:

```js
store.actions.startDraft({ scope: { kind: "project", id: 3 } });
assert.equal(fetchCalls.length, 0);
assert.equal(store.getSnapshot().draft.scope.kind, "project");

await store.actions.activateDraft({ text: "完成接口验收" });
assert.equal(fetchCalls[0].pathname, "/api/cpwb/chat/sessions");
assert.equal(store.getSnapshot().draft, null);
```

Add tests for:

- empty text is rejected client-side and creates nothing;
- closing a pristine draft discards it without confirmation;
- activation failure keeps text/scope/sources and sets `draft_failed`;
- retry uses the same persisted session ID;
- session titles come from the first natural sentence;
- recent-session reload excludes `draft_failed`;
- project/KB/independent all use the same store action.

- [ ] **Step 2: Confirm RED**

```bash
node --test test/client-chat.test.js test/unified-session-ui.test.js
```

- [ ] **Step 3: Implement the API and store contract**

Replace `openProjectChat`, `openKnowledgeChat`, and `openIndependentSession` with:

```js
startDraft({ scope, pinnedSources = [] })
discardDraft()
activateDraft({ text, oneShotSources = [] })
retryDraft({ text, oneShotSources = [] })
openSession(sessionId)
renameSession({ sessionId, title })
moveSession({ sessionId, scope })
deleteSession(sessionId)
```

The store mirrors native session readiness through the existing `waitForSessionReady` helper only after host activation returns a DSH session ID.

- [ ] **Step 4: Implement the context-aware modal**

`NewSessionDialog` contains native radio/select controls, current-container defaulting, an inheritance preview, focus restoration, Escape handling, and no title field. “进入新会话” calls `startDraft`; it must not call the host.

- [ ] **Step 5: Run GREEN and client regression**

```bash
node --test test/client-chat.test.js test/unified-session-ui.test.js test/client.test.js
```

- [ ] **Step 6: Commit**

```bash
git add src/client/api.js src/client/store.js src/client/workbenchSessions.js src/client/NewSessionDialog.js src/client/WorkbenchShell.js test/client-chat.test.js test/unified-session-ui.test.js
git commit -m "Add unified session drafts"
```

---

## Task 6: Rebuild the three-column navigation and scope-aware right rail

**Files:**

- Modify: `src/client/WorkbenchSidebar.js`
- Modify: `src/client/WorkbenchSessionShell.js`
- Modify: `src/client/KnowledgeBase.js`
- Modify: `src/client/Automation.js`
- Modify: `src/client/workbench.css`
- Modify: `test/unified-session-ui.test.js`
- Modify: `test/task4-session-shell.test.js`
- Modify: `test/css.test.js`

- [ ] **Step 1: Write failing rendered-contract tests**

Render the real React components and assert:

- global actions are exactly 新建会话, 首页, 全部会话, 知识库;
- project sessions show current project + three project sessions + “查看全部 N 个会话”;
- KB sessions show current KB + three KB sessions;
- independent sessions show only the current item in the current-context section;
- cross-container recents exclude IDs already shown above;
- settings and `SidebarBrand` are outside the scrollable list;
- right tabs match the approved project/KB/independent matrices;
- no component claims `conversation.session` or filters `conversation.view`.

- [ ] **Step 2: Confirm RED**

```bash
node --test test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js
```

- [ ] **Step 3: Implement current-container navigation**

Compute the two lists in one pure helper:

```js
partitionSidebarSessions({ activeSession, sessions, currentLimit: 3, recentLimit: 8 })
// => { currentContainer, otherRecent, totalInContainer }
```

No switch Toast. Keep the production `SidebarBrand` SVG and fixed settings action in `.cpwb-sidebar-fixed-footer`.

- [ ] **Step 4: Implement scope-specific rails**

Use one rail shell and data-driven tabs:

```js
PROJECT: todos, schedule, knowledge, summary
KNOWLEDGE_BASE: documents, index, projects, global_schedule
INDEPENDENT: context, files, subagents, global_schedule
```

Reuse `KnowledgeBase`, `Automation`, RC.2 Files/Subagent public stores, `DrawerDialog`, and `useWorkbenchLayoutMode`. Do not add parallel message or file renderers.

- [ ] **Step 5: Refine responsive Cyberpunk styling**

Preserve current cyan/amber/red tokens, angular cuts, subtle scanline texture, and production logo. Fix density and hierarchy instead of adding ornamental panels. Verify footer visibility and no horizontal overflow at 1280, 768, and 390 widths.

- [ ] **Step 6: Run GREEN**

```bash
node --test test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js
```

- [ ] **Step 7: Commit**

```bash
git add src/client/WorkbenchSidebar.js src/client/WorkbenchSessionShell.js src/client/KnowledgeBase.js src/client/Automation.js src/client/workbench.css test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js
git commit -m "Rebuild unified session workspace UI"
```

---

## Task 7: Add container retention policies and project-scoped automation

**Files:**

- Modify: `src/host/repositories.js`
- Modify: `src/host/api.js`
- Modify: `src/host/scheduler.js`
- Modify: `src/client/api.js`
- Modify: `src/client/store.js`
- Modify: `src/client/ProjectHome.js`
- Modify: `src/client/KnowledgeBase.js`
- Modify: `src/client/Automation.js`
- Modify: `test/database.test.js`
- Modify: `test/api.test.js`
- Modify: `test/scheduler.test.js`
- Modify: `test/unified-session-ui.test.js`

- [ ] **Step 1: Write failing deletion-policy tests**

Test both explicit paths:

```js
await containerService.deleteProject(project.id, { sessions: "detach" });
assert.deepEqual(repos.workbenchSessions.get(sessionId).scope, { kind: "independent", id: null });

await containerService.deleteKnowledgeBase(kb.id, { sessions: "delete", confirmation: kb.name });
assert.equal(repos.workbenchSessions.get(sessionId), null);
assert.equal(nativeDeletedIds.includes(sessionId), true);
```

Assert project deletion never calls a filesystem removal seam. Assert KB deletion removes Workbench-owned document links/chunks/vectors but does not remove original external files or the embedding model. Failed native DSH deletion must roll back/abort metadata deletion.

- [ ] **Step 2: Write failing automation scope tests**

Prove:

- summaries read all active project sessions on the requested local date;
- KB and independent sessions are excluded;
- final assistant bodies and user bodies are included, thinking/tools/errors are excluded;
- linked KB document changes may be added separately;
- global schedules return project labels and filter by project/status/time;
- todos and summaries do not render in KB/independent rails.

- [ ] **Step 3: Confirm RED**

```bash
node --test test/database.test.js test/api.test.js test/scheduler.test.js test/unified-session-ui.test.js
```

- [ ] **Step 4: Implement transactional container policies**

Use explicit service calls:

```js
deleteProject(id, { sessionPolicy: "detach" | "delete", confirmation })
deleteKnowledgeBase(id, { sessionPolicy: "detach" | "delete", confirmation })
```

`detach` moves sessions to independent before deleting the container. `delete` requires exact name confirmation and deletes DSH sessions before the transaction removes Workbench metadata. Context references to deleted sessions remain as unavailable identities until normal cleanup; they never block other sources.

- [ ] **Step 5: Add the two-choice confirmation modal**

Show container name, session count, relationship count, and cleanup scope. Default to “保留会话并转为独立会话”; danger path requires typed name. Use the existing top-layer modal primitive and restore focus on close.

- [ ] **Step 6: Update scheduler and global schedule API/UI**

Reuse `listProjectConversations(projectId, date, timeZone)` over unified `workbenchSessions`. Add project labels to the unscoped schedule list response rather than creating a new table.

- [ ] **Step 7: Run GREEN**

```bash
node --test test/database.test.js test/api.test.js test/scheduler.test.js test/unified-session-ui.test.js
```

- [ ] **Step 8: Commit**

```bash
git add src/host/repositories.js src/host/api.js src/host/scheduler.js src/client/api.js src/client/store.js src/client/ProjectHome.js src/client/KnowledgeBase.js src/client/Automation.js test/database.test.js test/api.test.js test/scheduler.test.js test/unified-session-ui.test.js
git commit -m "Add safe container retention policies"
```

---

## Task 8: Remove legacy paths and complete RC.2 verification

**Files:**

- Modify: `scripts/reset-demo.mjs`
- Modify: `scripts/verify.cjs`
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: affected tests under `test/`
- Generated by build: `lib/index.js`, `lib/client.js`

- [ ] **Step 1: Add/adjust verification guards**

`scripts/verify.cjs` must fail when production sources contain:

```text
knowledge_chats
knowledgeChats
chatId
openProjectChat
openKnowledgeChat
openIndependentSession
only: 'chat'
conversation.session registration by Workbench
```

It must also exercise the real client store flow: start a local draft, activate through one session endpoint, open the resulting native session, and render all three right-rail matrices.

- [ ] **Step 2: Confirm the legacy guard fails before cleanup**

```bash
node scripts/verify.cjs
```

- [ ] **Step 3: Remove legacy code and update demo reset**

Delete obsolete repositories, API methods, comments, test fixtures, and demo SQL. Reset only the exact Workbench mock project/session/todo/summary records documented by the script; do not touch unrelated DSH history.

- [ ] **Step 4: Update bilingual README**

Document:

- unified session ownership;
- multi-session projects and KBs;
- dynamic context sources and `@` behavior;
- draft activation and failure recovery;
- container deletion choices;
- project-only todos/summaries and project-owned global schedules;
- RC.2 native Files, model/reasoning, tools, approvals, and Subagent boundaries;
- isolated startup/verification commands and proxy/Codex auth notes without personal paths or tokens.

- [ ] **Step 5: Run focused static and unit verification**

```bash
git diff --check
node scripts/verify.cjs
npm run check
```

Expected: all tests pass, `=== VERIFY OK ===`, generated bundles parse, and no sensitive or legacy-path scan hits.

- [ ] **Step 6: Run an isolated RC.2 browser smoke**

Use a temporary `DSH_HOME`, temporary Workbench data dir, `DSH_TELEMETRY_MODE=DISABLED`, and an ephemeral port. Validate:

1. project creates two sessions and switches between them without Toast;
2. KB creates two sessions and links to two projects;
3. independent draft creates no DSH session until first send;
4. model/reasoning, Chat/Trajectory, Files/image attachment, tools, approvals, queue/steer, streaming, and Subagent native surfaces remain present;
5. project/KB/independent right rails match scope;
6. settings and production SVG remain visible at 1280x720, 768x900, and 390x844;
7. no horizontal overflow and page-owned console errors/warnings are zero.

If no provider credential is available, record model-answer/tool execution as unverified and still verify native composition with controlled public-slot fixtures. Do not claim real provider completion without evidence.

- [ ] **Step 7: Final repository audit**

```bash
git status --short
git diff --stat
rg -n "/Users/yewang|access_token|api[_-]?key|authorization: bearer|knowledge_chats|openKnowledgeChat|chatId" src test scripts README.md README.zh-CN.md package.json
```

Review every hit; test sentinel values are allowed only when clearly fake and source/runtime credentials are forbidden.

- [ ] **Step 8: Commit**

```bash
git add scripts/reset-demo.mjs scripts/verify.cjs README.md README.zh-CN.md test lib
git commit -m "Complete unified session migration"
```

---

## Final Acceptance Checklist

- [ ] One session model serves project, KB, and independent scopes.
- [ ] Projects and KBs each support multiple sessions; projects link multiple KBs.
- [ ] No empty DSH session is created before the first valid prompt.
- [ ] `draft_failed` is retryable and excluded from normal recents.
- [ ] Context inheritance is dynamic; pinned/disabled overrides survive valid moves.
- [ ] Session indexing contains only user text and final assistant body.
- [ ] Left navigation, native conversation center, and scope-aware right rail match the approved information architecture.
- [ ] Todos/summaries are project-only; schedules are project-owned and globally aggregatable.
- [ ] Container deletion requires an explicit detach-or-delete choice.
- [ ] RC.2 native conversation, Files, model/reasoning, tools, approvals, streaming, and Subagent capabilities remain intact.
- [ ] Full checks and three-viewport browser smoke evidence are recorded before handoff.
