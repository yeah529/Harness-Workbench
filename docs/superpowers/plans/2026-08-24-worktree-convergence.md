# RC.2 Worktree Convergence Implementation Plan

> Target: `feat/rc2-workbench-fusion` in `.worktrees/rc2-workbench-fusion`.
> Preserve the verified RC.2 launcher, Files/Subagent integration, and knowledge backplane while converging the unified-session worktree.

## Task 1: Preserve the verified RC.2 baseline

**Files:** current modified and untracked files in the target worktree.

1. Run `git diff --check` and `npm run check`.
2. Scan tracked source/docs for credentials and personal absolute paths.
3. Create a local baseline commit so conflict resolution is reversible.

## Task 2: Merge the committed unified-session architecture

**Source branch:** `feat/unified-session-architecture`.

1. Merge without pushing.
2. Resolve conflicts by keeping the unified session model and archive lifecycle while retaining RC.2 native conversation composition, launcher behavior, and the new knowledge center.
3. Do not hand-edit `lib/client.js` or `lib/index.js`; regenerate them with the build.
4. Run the unified-session focused tests, then `npm run check`.

## Task 3: Port valid uncommitted product refinements

**Source worktree:** `.worktrees/unified-session-implementation`.

Port only behavior that matches the approved product contract:

- Recent sessions: fixed latest 20, grouped by Workbench timezone, with project / knowledge-base / independent icons and a `查看全部会话` route.
- Draft conversations: render the normal conversation composer before a durable session exists and create the session on first send.
- Session list and archive: archive controls remain row-level and archived sessions stay discoverable.
- Project productivity: schedule/todo search and compact creation flows.
- Approved sidebar branding and alignment fixes.

Do not port generated bundles, stale knowledge-base UI, obsolete RC.8 compatibility paths, or worktree-local documentation that conflicts with the RC.2 target.

For each behavior, add or adapt a failing test before production changes and verify it after the minimal implementation.

## Task 4: Reconcile RC.2 and knowledge-center surfaces

1. Preserve the new knowledge card/backplane/create/detail flow and its connector geometry.
2. Ensure unified sessions can still originate from projects, knowledge bases, or independently.
3. Keep native RC.2 model, image, Files API, trajectory, and Subagent capabilities reachable through the Workbench skin.
4. Rebuild generated bundles.

## Task 5: Final verification and audit report

1. Run focused session/sidebar/knowledge tests.
2. Run `git diff --check` and `npm run check`.
3. Start an isolated RC.2 profile and verify desktop, tablet, and mobile layouts in a browser.
4. Re-run `git worktree list --porcelain` and status checks for every worktree.
5. Report every intentionally unmerged item and the reason it was excluded.
