# Draft Session, Schedule, and Search Polish Implementation Plan

> **Execution:** Inline in the active non-main worktree. Each task follows red-green-refactor and is verified before the next task starts.

**Goal:** Make new conversations feel identical to an existing DSH conversation before an ID exists, while completing the missing project/global search and automation interaction paths.

**Architecture:** Keep DSH as the only durable conversation runtime. Workbench owns a local pending-conversation state before first send, materializes a scoped DSH Session on submit, applies the selected model, and hands the message to native DSH admission without waiting for the response. Project tools remain Workbench data, and scheduled execution creates a visible project parent conversation with a DSH Subagent child under the existing restricted automation tool policy.

**Stack:** React, Cordis/DSH rc.2 public client services, Node HTTP API, SQLite repositories, node:test, existing Cyberpunk Workbench CSS.

---

## Task 1: Scope-correct session search and project entry

**Files:** `src/host/repositories.js`, `src/host/api.js`, `src/client/SessionListPage.js`, `src/client/ProjectHome.js`, `src/client/WorkbenchShell.js`, matching API/client tests.

1. Add failing tests proving scoped project queries honor `query` and project-card navigation opens the all-sessions page with a locked project filter.
2. Extend the repository query contract instead of filtering a page in the browser.
3. Add a secondary “查看全部会话” action to each project card without making the entire card ambiguous.
4. Verify pagination, project filter changes, and archived/non-archived boundaries.

## Task 2: Todo and schedule search plus global creation

**Files:** `src/client/Todos.js`, `src/client/Automation.js`, `src/client/WorkbenchSessionShell.js`, `src/client/workbench.css`, client tests.

1. Add interaction tests for todo title search, project schedule search, and global schedule search.
2. Reuse the existing schedule modal for global creation; global creation must select one project before save.
3. Keep the list dense: search and add controls live in one compact toolbar, not separate cards.
4. Verify empty, loading, error, and filtered states.

## Task 3: Visible scheduled Subagent execution

**Files:** `src/host/index.js`, `src/host/sessions.js`, `src/host/scheduler.js`, `src/host/repositories.js`, `src/host/api.js`, schedule/session tests.

1. Prove a due schedule creates a visible project Workbench session and a durable DSH Subagent child.
2. Create the visible parent, start an available Subagent provider, record the run/session relationship, and release live handles safely.
3. Prefer `spawn`, then `fork`, then the first registered provider; absence is a clear execution failure, never a fake completion.
4. Preserve the existing restricted scheduled tool policy and verify failure/status propagation.

## Task 4: Zero-ID pending conversation surface

**Files:** `src/client/NewSessionDialog.js`, `src/client/WorkbenchShell.js`, `src/client/store.js`, `src/client/pendingSession.js`, `src/client/index.js`, `src/host/api.js`, `src/host/sessions.js`, `src/client/workbench.css`, draft/session tests.

1. Opening a new conversation does not create a Session ID; the draft page offers text, images, model/reasoning selection, and `@` source affordances.
2. Split materialization from first prompt completion: create/bind the DSH Session, apply model selection, submit through the public Conversation face, and return on admission.
3. Use the same Workbench shell geometry and composer visual system as an existing session.
4. On accepted admission, bind the new session in place and add it to recent sessions immediately; on failure, keep the complete local draft and show a retryable error.
5. Verify first-sentence title derivation and no blank-history pollution.

## Task 5: Integrated visual and runtime verification

1. Add regression assertions for compact toolbars, project secondary action, pending composer parity, and responsive boundaries.
2. Run focused suites after each task.
3. Run `git diff --check`, `npm run check`, `git status --short`, and `git diff --stat` before handoff.
4. If a usable isolated provider is available, smoke first-send streaming and scheduled Subagent activity; otherwise report that runtime-provider boundary separately from automated contract coverage.
