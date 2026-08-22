# Repository workflow

This repository is the canonical source for Harness Workbench. Do not edit a
copied or exported directory.

Before changing code, run:

```bash
git rev-parse --show-toplevel
git branch --show-current
git worktree list --porcelain
git status --short
```

Stop before editing when any of these checks fail, when the repository root is
not this project, or when the current branch is `main` or `master`. Create or
enter a registered worktree on a `feat/*`, `fix/*`, `refactor/*`, `chore/*`, or
`docs/*` branch first.

Keep the primary checkout clean on `main`. Put linked worktrees below the
ignored `.worktrees/` directory. Never commit credentials, local DSH data,
Codex authentication caches, environment files, SQLite databases, uploaded
documents, vector indexes, or `node_modules`.

Before handing off a change, run:

```bash
git diff --check
npm run check
git status --short
git diff --stat
```

Report the repository root, worktree path, branch, test result, and remaining
uncommitted changes. Never push without explicit user confirmation.
