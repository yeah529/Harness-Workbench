# Knowledge Backplane Production Implementation Plan

**Goal:** Replace the old knowledge-center management stack with the approved Cyberpunk 2077 knowledge-chip/backplane experience while keeping every existing Workbench knowledge-base capability connected to real RC.2 host data.

**Architecture:** Keep `KnowledgeBase` as the compact project/session tool, add a dedicated production knowledge-center page with board/create/detail modes, and expose additive host overview/file-content contracts. A pure connector-routing helper plus a small React layout hook keeps one card-to-backplane line accurate across hover, focus, resize, and responsive layouts.

**Tech Stack:** React 18, existing Workbench external store/API, Node HTTP host, SQLite repositories, Node test runner, existing CSS design tokens. No new dependencies.

**Spec:** `.superpowers/brainstorm/41750-1787553448/content/knowledge-backplane-cyberpunk-v1.html`

**Global Constraints:** Preserve the current RC.2 native conversation shell, sidebar, settings composition, unrelated dirty files, existing Cyberpunk tokens, and all project-rail knowledge tools. Never expose filesystem paths or credentials. Hide the connector only after the board becomes a single stacked column.

---

### Task 1: Real knowledge overview and original-file contract

**Files:**
- Modify: `src/host/api.js`
- Modify: `src/client/api.js`
- Test: `test/api.test.js`
- Test: `test/client.test.js`

1. Add failing API tests for real per-knowledge-base file/chunk/link/session/index metrics and linked-project rows.
2. Add failing API tests for safe inline/download original-file responses without revealing `dataDir` or SHA storage paths.
3. Implement the smallest host mapping and streaming route using existing repositories and stored SHA files.
4. Add the client document content URL helper and exact request-contract tests.
5. Run the focused API/client tests.

### Task 2: Connector routing and knowledge-center interaction model

**Files:**
- Create: `src/client/knowledgeBackplane.js`
- Create: `test/knowledge-backplane.test.js`

1. Port the approved mockup's obstacle-aware single-connector geometry into a pure function.
2. Test left-card blocker routing, right-card direct routing, invalid geometry, and active-card selection.
3. Implement the React measurement hook with `ResizeObserver`, focus parity, stale-leave protection, and cleanup.
4. Run the focused connector tests.

### Task 3: Production knowledge-chip board, create screen, and detail screen

**Files:**
- Create: `src/client/KnowledgeCenterPage.js`
- Modify: `src/client/KnowledgeBase.js`
- Modify: `src/client/WorkbenchShell.js`
- Test: `test/knowledge-center.test.js`

1. Add failing rendered-contract tests for the board, live metrics, selected/preview backplane, empty state, accessible actions, and no mock data.
2. Add failing interaction tests for pin/hover state, full-screen create with multi-file initialization, detail entry, chat creation, deletion, project links, and file open/download controls.
3. Implement board/create/detail modes using existing store actions and the new overview fields.
4. Keep the compact project-rail `KnowledgeBase` behavior intact and remove only the obsolete knowledge-center export.
5. Run focused knowledge-center and existing client tests.

### Task 4: 1:1 Cyberpunk visual system and responsive behavior

**Files:**
- Modify: `src/client/workbench.css`
- Modify: `src/client/theme.css` only if a shared token is required
- Modify: `test/css.test.js`

1. Add CSS contract tests for the board grid, chip/backplane z-order, connector visibility breakpoints, focus states, reduced motion, and no horizontal overflow rules.
2. Port the approved mockup dimensions, cut corners, grid texture, cyan/amber states, typography hierarchy, shadows, and motion into prefixed production classes.
3. Preserve desktop two-column chips, tablet single-column chips with connector, and mobile stacked layout without connector.
4. Run CSS and responsive tests.

### Task 5: End-to-end verification and rendered comparison

**Files:**
- Modify generated bundles only via `npm run build`
- Update tests only for defects found during verification

1. Run `git diff --check` and focused tests.
2. Run `npm run check` and record the exact pass count.
3. Start an isolated RC.2 Workbench profile on a non-user port and render the knowledge page at the approved desktop viewport plus tablet/mobile viewports.
4. Compare the production render against the approved mockup for layout, spacing, color, z-order, connector behavior, overflow, create/detail transitions, and real actions; iterate until material differences are removed.
5. Report any remaining difference that cannot be validated rather than claiming pixel-perfect parity.
