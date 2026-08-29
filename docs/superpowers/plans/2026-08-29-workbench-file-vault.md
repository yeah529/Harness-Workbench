# Workbench File Vault Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add non-vectorized, persistent session files that are injected directly into the referenced model turn and remain available through `@文件`.

**Architecture:** Store raw bytes in a dedicated content-addressed Session File Vault and metadata/extracted context in a new `session_files` table. Reuse the existing parser without calling the index queue, inject referenced content through the existing rc.2 `agent/pre-step`, and expose one additive composer button plus scope-aware right-rail file views.

**Tech Stack:** Node.js 22, node:sqlite, existing Node HTTP host, React 18, DSH rc.2 Slot/InputTrigger contracts, existing `saveFile` and `parseDocument`, Node test runner. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-29-workbench-file-vault-design.md`

## Global Constraints

- Target DeepSeek Harness `0.1.1-rc.2`.
- Session files never enter `documents`, `chunks`, `document_index_metadata`, the index queue, or vector storage.
- Raw files live under `<dataDir>/session-vault/files/<sha256>`, never inside a project Workspace.
- Direct file context is full-text and fails explicitly above 32,000 Unicode code points; it is never silently truncated or vectorized.
- Keep DSH native image attachments, ConversationRoot, model selection, realtime stream, tools, trajectory, approvals and Subagent behavior intact.
- Preserve the existing Cyberpunk 2077 cyan/amber, hard-edge design system and responsive rail behavior.
- No new production dependency.

---

### Task 1: Session File Vault schema and repository

**Files:**
- Modify: `src/host/config.js`
- Modify: `src/host/database.js`
- Modify: `src/host/repositories.js`
- Test: `test/database.test.js`

**Interfaces:**
- Produces: `repos.sessionFiles.create(input)`, `get(id)`, `getBySessionAndName(sessionId, originalName)`, `listBySession(sessionId)`, `remove(id)`, and `countBySha256(sha256)`.
- Produces row shape: `{ id, sessionId, sha256, originalName, mimeType, size, parseStatus, parseError, contextText, contextCodePoints, createdAt }`.

- [ ] **Step 1: Write the failing schema and repository tests**

```js
const row = repos.sessionFiles.create({
  sessionId,
  sha256: "a".repeat(64),
  originalName: "brief.md",
  mimeType: "text/markdown",
  size: 7,
  parseStatus: "ready",
  contextText: "# Brief",
  contextCodePoints: 7,
});
assert.equal(repos.sessionFiles.listBySession(sessionId)[0].id, row.id);
assert.throws(() => repos.sessionFiles.create({ ...input, sha256: "b".repeat(64) }), /unique/i);
```

- [ ] **Step 2: Run the focused test and verify the missing repository failure**

Run: `node --test test/database.test.js`

Expected: FAIL because `repos.sessionFiles` and schema version 10 do not exist.

- [ ] **Step 3: Add schema v10 and the minimal repository**

```sql
CREATE TABLE session_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES workbench_sessions(session_id) ON DELETE CASCADE,
  sha256 TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER NOT NULL,
  parse_status TEXT NOT NULL CHECK (parse_status IN ('ready', 'failed')),
  parse_error TEXT,
  context_text TEXT,
  context_code_points INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  UNIQUE (session_id, original_name)
);
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `node --test test/database.test.js`

- [ ] **Step 5: Commit the independently testable data layer**

```bash
git add src/host/config.js src/host/database.js src/host/repositories.js test/database.test.js
git commit -m "feat: add session file vault data model"
```

### Task 2: File Vault storage, parsing and HTTP contract

**Files:**
- Create: `src/host/session-files.js`
- Modify: `src/host/api.js`
- Modify: `src/host/index.js`
- Test: `test/session-files.test.js`
- Test: `test/api.test.js`

**Interfaces:**
- Produces: `createSessionFileVault({ dataDir, repos })` with `upload({ sessionId, stream, originalName })`, `list(sessionId)`, `get(id)`, `remove(id)`, `resolveReferences({ sessionId, text })`, and `removeBySession(sessionId)`.
- `resolveReferences` returns `{ files, text, codePoints }` and throws `SESSION_FILE_CONTEXT_TOO_LARGE`, `SESSION_FILE_NOT_READY`, or `SESSION_FILE_NOT_FOUND`.

- [ ] **Step 1: Write failing storage tests**

```js
const file = await vault.upload({ sessionId, originalName: "brief.md", stream: Readable.from("# Brief") });
assert.equal(file.parseStatus, "ready");
assert.equal(queueCalls.length, 0);
assert.match((await vault.resolveReferences({ sessionId, text: "use @文件/brief.md" })).text, /# Brief/);
```

- [ ] **Step 2: Run tests and verify the missing vault failure**

Run: `node --test test/session-files.test.js test/api.test.js`

- [ ] **Step 3: Implement synchronous parse-without-index upload and direct context assembly**

```js
const saved = await saveFile({ dataDir: join(dataDir, "session-vault"), stream, originalName });
const sections = await parseDocument({ filePath: saved.path, originalName: saved.originalName, mimeType: saved.mimeType });
const contextText = sections.map((section) => `[${section.locator}] ${section.text}`).join("\n\n");
```

The context assembler wraps each file in `<file_context>` with escaped attributes and the untrusted-data warning, rejects totals above 32,000 code points, and never reads `documents` or calls `queue.enqueue`.

- [ ] **Step 4: Add exact API tests and routes**

```js
const upload = await fetch(base + "/session-files", {
  method: "POST",
  headers: { "x-cpwb-session-id": sessionId, "x-cpwb-filename": encodeURIComponent("brief.md") },
  body: "# Brief",
});
assert.equal(upload.status, 201);
assert.equal((await upload.json()).parseStatus, "ready");
```

- [ ] **Step 5: Run the focused host tests**

Run: `node --test test/session-files.test.js test/api.test.js`

- [ ] **Step 6: Commit the host contract**

```bash
git add src/host/session-files.js src/host/api.js src/host/index.js test/session-files.test.js test/api.test.js
git commit -m "feat: expose non-vectorized session files"
```

### Task 3: Prompt injection and `@文件` source

**Files:**
- Create: `src/shared/sessionFileReferences.js`
- Create: `src/client/sessionFileReferences.js`
- Modify: `src/host/sessions.js`
- Modify: `src/host/index.js`
- Modify: `src/client/index.js`
- Test: `test/session-files.test.js`
- Test: `test/sessions.test.js`
- Test: `test/workbench-upgrade.test.js`

**Interfaces:**
- Produces: `sessionFileReferenceText(file)`, `stripSessionFileReferences(text, files)`, and `createSessionFileReferenceSource({ store })`.
- Extends: `createWorkbenchRagPreStep({ ..., fileContext })` where `fileContext.resolveReferences({ sessionId, text })` returns direct context.

- [ ] **Step 1: Write failing reference/source tests**

```js
const picked = source.onPick({ candidate: { value: "17" } });
assert.deepEqual(picked, { text: "@文件/brief.md " });
assert.deepEqual(await source.candidates({ sessionId }, request), [{ section: "会话文件", name: "brief.md", value: "17" }]);
```

- [ ] **Step 2: Write failing pre-step tests**

```js
const decision = await preStep({ signal }, async () => ({ kind: "enter", messages: [user("read @文件/brief.md")] }));
assert.equal(decision.messages[0].source.form, "file-context");
assert.match(messageText(decision.messages[0]), /<file_context>/);
assert.doesNotMatch(messageText(decision.messages[0]), /embedding/i);
```

- [ ] **Step 3: Implement the shared marker and client source**

The source uses the current `ClientSessionContext.sessionId`, lists only that Session's files, returns plain text references, exposes a lexicon, and implements Enter preflight that throws for failed files or context totals above 32,000 code points.

- [ ] **Step 4: Extend pre-step composition without replacing DSH ConversationRoot**

```js
const fileContextResult = await fileContext.resolveReferences({ sessionId, text: rawQuestion });
const fileRecall = createUserMessage({
  content: [{ type: "text", text: fileContextResult.text }],
  source: { kind: "plugin", plugin: "dsh-cyberpunk-workbench", form: "file-context" },
});
return { kind: "enter", messages: [fileRecall, knowledgeRecall, ...decision.messages].filter(Boolean) };
```

- [ ] **Step 5: Run focused source/session tests**

Run: `node --test test/session-files.test.js test/sessions.test.js test/workbench-upgrade.test.js`

- [ ] **Step 6: Commit the prompt/reference path**

```bash
git add src/shared/sessionFileReferences.js src/client/sessionFileReferences.js src/host/sessions.js src/host/index.js src/client/index.js test/session-files.test.js test/sessions.test.js test/workbench-upgrade.test.js
git commit -m "feat: inject session files through at references"
```

### Task 4: Composer upload and zero-ID draft activation

**Files:**
- Create: `src/client/FileAttachmentButton.js`
- Modify: `src/client/api.js`
- Modify: `src/client/store.js`
- Modify: `src/client/index.js`
- Modify: `src/client/NewSessionDialog.js`
- Modify: `src/client/pendingSession.js`
- Test: `test/client.test.js`
- Test: `test/pending-session.test.js`

**Interfaces:**
- Produces client API: `api.sessionFiles.list`, `upload`, `contentUrl`, and `remove`.
- Produces store actions: `loadSessionFiles(sessionId)`, `uploadSessionFiles({ sessionId, files })`, `deleteSessionFile({ sessionId, id })`.
- Extends `submitPendingDraft` input with `files: File[]`; it uploads after materialization and before `conversation.sendSession`.

- [ ] **Step 1: Write failing API/store tests**

```js
await api.sessionFiles.upload({ sessionId, file });
assert.equal(request.headers["x-cpwb-session-id"], sessionId);
assert.equal(request.pathname, "/api/cpwb/session-files");
```

- [ ] **Step 2: Write failing active-composer and draft-order tests**

```js
assert.deepEqual(calls, ["materialize", "upload:brief.md", "ready", "model", "send:hello @文件/brief.md", "confirm"]);
```

- [ ] **Step 3: Implement the additive paperclip button**

Register it in `conversation.input.left` beside the existing image button. It uploads multiple accepted files, appends successful `@文件/...` markers through `inputActions.setDraft`, keeps DSH image handling untouched, and renders compact uploading/error status.

- [ ] **Step 4: Extend the zero-ID draft composer**

Add a separate generic-file picker/list. Preserve its local `File` objects until first submit, then use the order in the interface block; failed upload or parse leaves the text, images, generic files and materialized Session available for retry.

- [ ] **Step 5: Run focused client/draft tests**

Run: `node --test test/client.test.js test/pending-session.test.js`

- [ ] **Step 6: Commit the composer path**

```bash
git add src/client/FileAttachmentButton.js src/client/api.js src/client/store.js src/client/index.js src/client/NewSessionDialog.js src/client/pendingSession.js test/client.test.js test/pending-session.test.js
git commit -m "feat: upload files from conversation composer"
```

### Task 5: Scope-aware file tabs and removal of vectorized session documents

**Files:**
- Modify: `src/client/WorkbenchSessionShell.js`
- Modify: `src/client/workbench.css`
- Modify: `src/client/store.js`
- Modify: `src/client/api.js`
- Modify: `src/host/api.js`
- Modify: `src/host/repositories.js`
- Test: `test/unified-session-ui.test.js`
- Test: `test/client.test.js`
- Test: `test/api.test.js`
- Test: `test/css.test.js`

**Interfaces:**
- Replaces `SessionDocumentsPanel` with `SessionFilesPanel`.
- Removes `documents` API/store `scope=session` support; knowledge/project document scopes remain unchanged.

- [ ] **Step 1: Write failing scope-specific tab tests**

```js
assert.deepEqual(PROJECT_TOOL_TABS.map(([id]) => id), ["todos", "schedule", "files", "knowledge", "summary"]);
assert.deepEqual(KNOWLEDGE_TOOL_TABS.map(([id]) => id), ["files", "documents", "index", "projects", "global_schedule"]);
assert.deepEqual(INDEPENDENT_TOOL_TABS.map(([id]) => id), ["files", "subagents", "global_schedule"]);
```

- [ ] **Step 2: Implement the File Vault panel and explicit terminology**

The panel displays `SESSION FILES`, upload/open/download/delete controls, `ready/failed` parse state and an explicit “不向量化” label. Project scope also explains that real Workspace files remain under DSH native `@路径`; knowledge scope labels vectorized material `芯片文档`.

- [ ] **Step 3: Remove the deprecated session-document route**

`/documents?scope=session`, session document upload and session document unlink return 422. Remove `loadSessionDocuments`, the document poller and `uploaded_file` pinning from the session-file UI path while preserving knowledge/project document behavior.

- [ ] **Step 4: Apply the existing Cyberpunk visual system and responsive checks**

Use existing `--cpwb-cyan`, `--cpwb-amber`, cut-corner variables, compact code labels, visible focus states and the existing drawer breakpoint. Do not introduce a new visual language.

- [ ] **Step 5: Run focused UI/API/CSS tests**

Run: `node --test test/unified-session-ui.test.js test/client.test.js test/api.test.js test/css.test.js`

- [ ] **Step 6: Commit the scope-aware UI**

```bash
git add src/client/WorkbenchSessionShell.js src/client/workbench.css src/client/store.js src/client/api.js src/host/api.js src/host/repositories.js test/unified-session-ui.test.js test/client.test.js test/api.test.js test/css.test.js
git commit -m "feat: separate session files from knowledge documents"
```

### Task 6: Full regression, browser interaction and documentation

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify generated bundles only through: `npm run build`
- Update tests only for defects found during verification.

**Interfaces:**
- Consumes every Task 1-5 interface.
- Produces verified rc.2 host/client bundles and documented file semantics.

- [ ] **Step 1: Run static and full automated verification**

Run:

```bash
git diff --check
npm run check
git status --short
git diff --stat
```

- [ ] **Step 2: Run an isolated rc.2 browser smoke**

Start Workbench with a temporary `DSH_HOME` and non-user port. Verify independent, project and knowledge-chip Sessions can upload a text file, show it in the correct file tab, append an `@文件` reference, send it, and receive a model-facing `file-context` plugin message without any vector/index activity.

- [ ] **Step 3: Verify error and responsive paths**

At desktop, tablet and mobile widths verify: duplicate name error, parse failure remains downloadable, oversized combined context blocks send with visible feedback, file deletion removes the row, knowledge documents still show index status, and no horizontal overflow appears.

- [ ] **Step 4: Update bilingual documentation**

Document the three resource classes, accepted file types, 50 MB upload cap, 32,000-code-point direct-context cap, `@文件` reuse and the fact that session files are never embedded.

- [ ] **Step 5: Re-run full verification after documentation/build changes**

Run: `npm run check`

- [ ] **Step 6: Commit the verified feature**

```bash
git add README.md README.zh-CN.md lib/client.js lib/index.js
git commit -m "docs: explain session file context"
```
