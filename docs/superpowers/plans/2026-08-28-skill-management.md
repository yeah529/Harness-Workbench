# Harness Workbench Skill Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Harness Workbench 中交付一个独立的本地 Skill 管理模块，支持全局与项目作用域的目录/ZIP 导入、同名替换、启停、删除、诊断和两个已确认 UI 入口。

**Architecture:** Workbench Host 直接管理 DSH 的规范 Skill 目录，文件系统是唯一事实源；DSH 原生 Skill Provider 继续负责会话内发现和优先级。客户端把目录统一打包为 ZIP，Host 对 ZIP 做限额、安全解压和 frontmatter 校验，再通过同文件系统暂存与事务记录完成原子安装或替换。

**Tech Stack:** Node.js ESM（Node `>=22.5.0`）、React 18、原生 `node:http` 风格 API、`fflate@0.8.3`、`js-yaml@4.3.1`、Node test runner、现有 Workbench CSS/Phosphor Icons。

**Spec:** `docs/superpowers/specs/2026-08-28-skill-management-design.md`

## Global Constraints

- 开发基线是 DeepSeek Harness `0.1.1-rc.2`，不得为旧版 DSH 增加兼容层。
- 只支持本地目录和 ZIP；不支持 URL、GitHub、市场、自动更新、批量操作、在线编辑或创建 Skill。
- 全局路径固定为 `<DSH_HOME>/skills/<skill-name>/`；项目路径固定为 `<project-directory>/.dsh/skills/<skill-name>/`。
- 项目创建时不创建 Skill 目录；首次成功导入才创建 `<skillsRoot>`。
- frontmatter `name` 是唯一身份，必须匹配 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`；`name` 和 `description` 都必填。
- 同作用域同名导入先返回冲突，只有显式 `replace=true` 才替换；项目与全局同名允许共存，项目版本覆盖全局版本。
- 替换必须保持现有启停状态；停用目录固定为 `<skillsRoot>/.disabled/<skill-name>/`。
- ZIP 上限为 50 MiB、1,000 个条目、解压后总计 100 MiB、单文件 50 MiB；路径穿越、绝对路径、盘符、UNC、NUL、设备文件和符号链接失败关闭。
- 不新增数据库表；管理列表直接扫描文件系统，并显示有效、停用、无效、状态冲突和不受支持条目。
- 客户端永远不能传入安装目标绝对路径；Host 只接受 `scope`、`projectId` 和 kebab-case `name`。
- 左侧 Skills 入口固定在设置上方，默认打开全局页；不新增顶部导航。项目 Skills 固定为项目右侧工具栏最后一个页签。
- UI 实现前必须显式读取并使用 `frontend-design` 与 `design-taste-frontend`，视觉参考为 `/Users/yewang/.codex/visualizations/2026/08/28/01a046ea-59a5-7fc1-a5ac-84726f743d69/skill-entry-layout.html`。
- 所有 Markdown 与代码文件使用 UTF-8（无 BOM）；保留用户无关修改，主 checkout 必须保持干净。
- 每个实现任务先写失败测试，再写最小实现；任务完成时提交源文件、测试和由 `npm run build` 更新的 `lib/index.js` 或 `lib/client.js`。

## Execution Context

- Repository root: `/Users/yewang/Nutstore Files/.symlinks/坚果云/Codex/DSH-Research/dsh-cyberpunk-workbench/.worktrees/skill-management`
- Branch: `feat/skill-management`
- Starting design commit: `b19c463`
- Before editing, re-run `git rev-parse --show-toplevel`, `git branch --show-current`, `git worktree list --porcelain`, and `git status --short`.

## File Map

### New host files

- `src/host/skill-package.js` — ZIP limits, ZIP metadata checks, safe extraction, YAML frontmatter parsing, canonical package summary, stable Skill error class/codes.
- `src/host/skill-manager.js` — trusted root resolution, scanning, diagnostics, imports, replacement transactions, recovery, enable/disable/delete/reveal operations.

### New client files

- `src/client/skill-import.js` — directory preflight and asynchronous ZIP creation for browser-selected files.
- `src/client/SkillsManager.js` — shared catalog/list/actions/import-conflict/delete dialogs used by the page and project rail.
- `src/client/SkillsPage.js` — full-page global/project tabs and project selector.

### Existing files to modify

- `package.json`, `package-lock.json` — declare `fflate` and `js-yaml` as direct production dependencies.
- `src/host/index.js` — construct one Skill manager from resolved `dshHome` and repositories, then inject it into the API.
- `src/host/api.js` — map Skill errors and expose the five approved Skill routes.
- `src/client/api.js` — exact Skill HTTP client contract.
- `src/client/store.js` — Skill catalogs and mutation actions.
- `src/client/navigation.js` — add the mutually exclusive `skills` page.
- `src/client/WorkbenchSidebar.js` — add the bottom Skills entry above Settings.
- `src/client/WorkbenchShell.js` — route the Skills page and mobile drawer behavior.
- `src/client/WorkbenchSessionShell.js` — add the project-only Skills rail tab.
- `src/client/workbench.css` — full-page, compact rail, dialog, responsive and accessibility styles.
- `lib/index.js`, `lib/client.js` — generated production bundles.

### Tests and fixtures

- `test/fixtures/skills/example-skill/SKILL.md`
- `test/fixtures/skills/example-skill/references/example.md`
- `test/skill-package.test.js`
- `test/skill-manager.test.js`
- `test/api.test.js`
- `test/client.test.js`
- `test/unified-session-ui.test.js`
- `test/task4-session-shell.test.js`
- `test/css.test.js`
- `test/host-lifecycle.test.js`

---

### Task 1: Skill package validation and safe extraction

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/host/skill-package.js`
- Create: `test/skill-package.test.js`
- Create: `test/fixtures/skills/example-skill/SKILL.md`
- Create: `test/fixtures/skills/example-skill/references/example.md`

**Interfaces:**
- Produces: `SKILL_PACKAGE_LIMITS`, `SKILL_ERROR_CODES`, `SkillManagerError`, `parseSkillMarkdown(markdown)`, and `extractSkillArchive({ archiveBytes, destination, limits })`.
- `extractSkillArchive` returns `{ name, description, files, fileCount, totalBytes }`, where `files` are relative to the normalized Skill root and sorted lexicographically.
- Throws `SkillManagerError` with a stable code and optional JSON-safe `details`.

- [ ] **Step 1: Add the canonical fixture files**

```markdown
---
name: example-skill
description: Example skill used by Workbench tests.
---

# Example Skill

Read `references/example.md` when the example is invoked.
```

`references/example.md` contains:

```markdown
# Example Reference

The Workbench Skill importer preserved this resource.
```

- [ ] **Step 2: Write failing package tests**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, lstat } from "node:fs/promises";
import { join } from "node:path";
import { strToU8, zipSync } from "fflate";
import { createTempDir, removeTempDir } from "./helpers.js";
import {
  SKILL_ERROR_CODES,
  extractSkillArchive,
  parseSkillMarkdown,
} from "../src/host/skill-package.js";

const skillMd = (name = "example-skill") => strToU8(
  `---\nname: ${name}\ndescription: Example description.\n---\n\n# Example\n`,
);

test("extractSkillArchive accepts one wrapper and returns the frontmatter identity", async (t) => {
  const root = await createTempDir("cpwb-skill-package-");
  t.after(() => removeTempDir(root));
  const bytes = zipSync({
    "wrapper/SKILL.md": skillMd(),
    "wrapper/references/example.md": strToU8("reference"),
  });
  const result = await extractSkillArchive({ archiveBytes: bytes, destination: join(root, "out") });
  assert.deepEqual(result, {
    name: "example-skill",
    description: "Example description.",
    files: ["SKILL.md", "references/example.md"],
    fileCount: 2,
    totalBytes: skillMd().length + 9,
  });
  assert.equal(await readFile(join(root, "out", "references", "example.md"), "utf8"), "reference");
});

test("parseSkillMarkdown requires canonical name and description", () => {
  assert.throws(
    () => parseSkillMarkdown("---\nname: Not Valid\ndescription: x\n---\nbody"),
    (error) => error.code === SKILL_ERROR_CODES.NAME_INVALID,
  );
  assert.throws(
    () => parseSkillMarkdown("---\nname: valid-name\n---\nbody"),
    (error) => error.code === SKILL_ERROR_CODES.PACKAGE_INVALID,
  );
});

test("extractSkillArchive rejects unsafe or ambiguous archives", async (t) => {
  const root = await createTempDir("cpwb-skill-unsafe-");
  t.after(() => removeTempDir(root));
  const cases = [
    ["path traversal", { "../escape": strToU8("x"), "SKILL.md": skillMd() }, SKILL_ERROR_CODES.ARCHIVE_UNSAFE],
    ["multiple skills", { "a/SKILL.md": skillMd("a"), "b/SKILL.md": skillMd("b") }, SKILL_ERROR_CODES.PACKAGE_INVALID],
    ["nested wrapper", { "a/b/SKILL.md": skillMd() }, SKILL_ERROR_CODES.PACKAGE_INVALID],
    ["too many entries", Object.fromEntries(Array.from({ length: 1001 }, (_, i) => [`f-${i}`, strToU8("x")])), SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE],
  ];
  for (const [label, entries, code] of cases) {
    await assert.rejects(
      () => extractSkillArchive({ archiveBytes: zipSync(entries), destination: join(root, label.replaceAll(" ", "-")) }),
      (error) => error.code === code,
      label,
    );
  }
  assert.equal((await lstat(root)).isDirectory(), true);
});
```

In the same test file, add byte-level ZIP fixture helpers that patch a central-directory external attribute to Unix symlink mode, set the encrypted general-purpose flag, and replace a size/offset sentinel with the ZIP64 sentinel. Assert each archive fails with `SKILL_ARCHIVE_UNSAFE` before `destination` is created. Add limit overrides for a 2-byte single-file limit and a 3-byte expanded-total limit so both boundaries are tested without allocating large buffers.

- [ ] **Step 3: Run the package tests and verify RED**

Run: `node --test test/skill-package.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/host/skill-package.js`.

- [ ] **Step 4: Declare the two direct runtime dependencies**

Run: `npm install --save-exact fflate@0.8.3 js-yaml@4.3.1`

Expected: `fflate` moves from `devDependencies` to `dependencies`; `js-yaml` appears in `dependencies`; the lockfile records both as direct dependencies. Do not add any other package.

- [ ] **Step 5: Implement the package boundary**

Create `src/host/skill-package.js` with this public shape and the tested limits:

```js
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";
import { unzipSync } from "fflate";
import { load as loadYaml } from "js-yaml";

export const SKILL_PACKAGE_LIMITS = Object.freeze({
  archiveBytes: 50 * 1024 * 1024,
  entries: 1000,
  expandedBytes: 100 * 1024 * 1024,
  singleFileBytes: 50 * 1024 * 1024,
});

export const SKILL_ERROR_CODES = Object.freeze({
  INVALID_SCOPE: "INVALID_SKILL_SCOPE",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
  PROJECT_PATH_UNAVAILABLE: "PROJECT_PATH_UNAVAILABLE",
  ARCHIVE_TOO_LARGE: "SKILL_ARCHIVE_TOO_LARGE",
  ARCHIVE_UNSAFE: "SKILL_ARCHIVE_UNSAFE",
  PACKAGE_INVALID: "SKILL_PACKAGE_INVALID",
  NAME_INVALID: "SKILL_NAME_INVALID",
  CONFLICT: "SKILL_CONFLICT",
  STATE_CONFLICT: "SKILL_STATE_CONFLICT",
  NOT_FOUND: "SKILL_NOT_FOUND",
  PERMISSION_DENIED: "SKILL_PERMISSION_DENIED",
  RECOVERY_REQUIRED: "SKILL_TRANSACTION_RECOVERY_REQUIRED",
  FILE_MANAGER_UNAVAILABLE: "FILE_MANAGER_UNAVAILABLE",
});

export class SkillManagerError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "SkillManagerError";
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}
```

Implementation requirements inside the file:

- Parse only a leading `---` YAML frontmatter block with `js-yaml.load`; require a plain mapping and string `name`/`description`.
- Use the exact kebab-case regex from Global Constraints.
- Inspect ZIP central-directory attributes before extraction and reject Unix file type `0o120000` (symbolic link). Reject ZIP64 and encrypted entries with `SKILL_ARCHIVE_UNSAFE` rather than guessing.
- In the `unzipSync` filter, count entries and sum declared `originalSize` before inflating; re-check actual output byte lengths afterward.
- Normalize backslashes to `/`; reject NUL, leading `/`, drive letters, UNC, empty components, `.` and `..`.
- Require exactly one `SKILL.md`, either at depth zero or below exactly one wrapper directory.
- Materialize every entry itself with `mkdir`/`writeFile`; never preserve executable or special modes from the archive.
- Remove the wrapper prefix before writing, sort the returned file list, and never write outside `destination`.

- [ ] **Step 6: Run the package tests and verify GREEN**

Run: `node --test test/skill-package.test.js`

Expected: all package tests pass, including unsafe archives and limit cases.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json package-lock.json src/host/skill-package.js test/skill-package.test.js test/fixtures/skills
git commit -m "feat: validate local skill packages"
```

---

### Task 2: Trusted roots, scanning, and diagnostics

**Files:**
- Create: `src/host/skill-manager.js`
- Create: `test/skill-manager.test.js`

**Interfaces:**
- Consumes: `parseSkillMarkdown`, `SkillManagerError`, and `SKILL_ERROR_CODES` from Task 1.
- Produces: `createSkillManager({ dshHome, repos, fileOps, revealPath })`.
- Produces methods: `list({ scope, projectId })`, `importArchive(input)`, `setEnabled(input)`, `remove(input)`, and `reveal(input)`; Tasks 2 initially implement only `list` and trusted target resolution.
- `list` returns `{ scope, rootPath, items, diagnostics }`, where `scope` is exactly `{ kind: "global" }` or `{ kind: "project", projectId }`; valid items use `{ name, description, state, health, path, files, fileCount, shadowsGlobal }`.

- [ ] **Step 1: Write failing scanner tests**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createTempDir, removeTempDir } from "./helpers.js";
import { createSkillManager } from "../src/host/skill-manager.js";

const markdown = (name, description = name) => `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`;

test("list scans enabled, disabled, invalid, and project shadowing without a database", async (t) => {
  const root = await createTempDir("cpwb-skill-manager-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const projectPath = join(root, "project");
  await mkdir(join(dshHome, "skills", "shared-skill"), { recursive: true });
  await writeFile(join(dshHome, "skills", "shared-skill", "SKILL.md"), markdown("shared-skill", "global"));
  await mkdir(join(projectPath, ".dsh", "skills", "shared-skill"), { recursive: true });
  await writeFile(join(projectPath, ".dsh", "skills", "shared-skill", "SKILL.md"), markdown("shared-skill", "project"));
  await mkdir(join(projectPath, ".dsh", "skills", ".disabled", "paused-skill"), { recursive: true });
  await writeFile(join(projectPath, ".dsh", "skills", ".disabled", "paused-skill", "SKILL.md"), markdown("paused-skill"));
  await mkdir(join(projectPath, ".dsh", "skills", "broken-folder"), { recursive: true });
  const repos = { projects: { get: (id) => id === 7 ? { id, path: projectPath } : null } };
  const manager = createSkillManager({ dshHome, repos });

  const catalog = await manager.list({ scope: "project", projectId: 7 });
  assert.equal(catalog.rootPath, join(projectPath, ".dsh", "skills"));
  assert.deepEqual(catalog.items.map(({ name, state, shadowsGlobal }) => ({ name, state, shadowsGlobal })), [
    { name: "paused-skill", state: "disabled", shadowsGlobal: false },
    { name: "shared-skill", state: "enabled", shadowsGlobal: true },
  ]);
  assert.equal(catalog.diagnostics[0].kind, "invalid-directory");
});

test("project scope resolves only an existing absolute project directory", async (t) => {
  const root = await createTempDir("cpwb-skill-scope-");
  t.after(() => removeTempDir(root));
  const manager = createSkillManager({
    dshHome: join(root, "dsh"),
    repos: { projects: { get: () => ({ id: 2, path: "relative/project" }) } },
  });
  await assert.rejects(
    () => manager.list({ scope: "project", projectId: 2 }),
    (error) => error.code === "PROJECT_PATH_UNAVAILABLE",
  );
});
```

- [ ] **Step 2: Run scanner tests and verify RED**

Run: `node --test test/skill-manager.test.js`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/host/skill-manager.js`.

- [ ] **Step 3: Implement target resolution and scanning**

Create the manager with this exact callable surface:

```js
export function createSkillManager({
  dshHome,
  repos,
  fileOps = defaultFileOps,
  revealPath = defaultRevealPath,
}) {
  async function list({ scope, projectId } = {}) {
    const target = await resolveTarget({ scope, projectId, dshHome, repos, fileOps });
    await recoverTransactions(target);
    return scanCatalog(target);
  }
  return { list, importArchive, setEnabled, remove, reveal };
}
```

Implementation requirements:

- `scope` must be exactly `global` or `project`; project scope requires a positive integer `projectId`.
- Global root is `resolve(dshHome, "skills")`. Project root is `resolve(project.path, ".dsh", "skills")`; `project.path` must be absolute, exist, and be a directory.
- A missing Skill root returns an empty catalog without creating directories.
- Read only one directory level for enabled entries and `.disabled`; skip `.staging` and `.transactions`.
- Use `lstat` and do not follow symlinks. A symlink, flat Markdown file, missing `SKILL.md`, invalid frontmatter, folder/frontmatter name mismatch, or enabled+disabled duplicate becomes a diagnostic and is not returned as a manageable item.
- Recursively count ordinary files within a valid bundle without following nested symlinks; a nested symlink makes the bundle invalid.
- For project catalogs, read the global catalog once and set `shadowsGlobal` only when the same valid global name exists.
- Sort items by `name`, with enabled before disabled only when names compare equal; sort diagnostics by path.
- Translate filesystem `EACCES`, `EPERM` and `EROFS` failures under a trusted root to `SKILL_PERMISSION_DENIED`; preserve the original error only as a server-side cause, never in JSON-safe details.

- [ ] **Step 4: Run scanner tests and verify GREEN**

Run: `node --test test/skill-manager.test.js`

Expected: scanner, empty-root, invalid entry and project path tests pass.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/host/skill-manager.js test/skill-manager.test.js
git commit -m "feat: scan global and project skills"
```

---

### Task 3: Transactional import, replacement, lifecycle actions, and recovery

**Files:**
- Modify: `src/host/skill-manager.js`
- Modify: `test/skill-manager.test.js`

**Interfaces:**
- Consumes: `extractSkillArchive` and Task 2 target/scanner functions.
- Completes `importArchive({ scope, projectId, archiveBytes, sourceName, replace })`.
- Completes `setEnabled({ scope, projectId, name, enabled })`, `remove({ scope, projectId, name })`, and `reveal({ scope, projectId, name })`.
- `importArchive` returns the installed catalog item; conflicts throw `SKILL_CONFLICT` with `{ existing, incoming }`.

- [ ] **Step 1: Add failing mutation tests**

```js
import { readFile } from "node:fs/promises";
import { strToU8, zipSync } from "fflate";

const archive = (name, description) => zipSync({
  "SKILL.md": strToU8(`---\nname: ${name}\ndescription: ${description}\n---\n\n# Body\n`),
  "references/value.md": strToU8(description),
});

test("same-scope import conflicts, confirmed replacement preserves disabled state", async (t) => {
  const { manager, dshHome } = await managerFixture(t);
  await manager.importArchive({ scope: "global", archiveBytes: archive("replace-me", "old"), sourceName: "old.zip", replace: false });
  await manager.setEnabled({ scope: "global", name: "replace-me", enabled: false });
  await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes: archive("replace-me", "new"), sourceName: "new.zip", replace: false }),
    (error) => error.code === "SKILL_CONFLICT" && error.details.existing.state === "disabled",
  );
  const replaced = await manager.importArchive({ scope: "global", archiveBytes: archive("replace-me", "new"), sourceName: "new.zip", replace: true });
  assert.equal(replaced.state, "disabled");
  assert.equal(await readFile(join(dshHome, "skills", ".disabled", "replace-me", "references", "value.md"), "utf8"), "new");
});

test("enable, disable, and delete affect only the exact canonical target", async (t) => {
  const { manager, dshHome } = await managerFixture(t);
  await manager.importArchive({ scope: "global", archiveBytes: archive("target-skill", "target"), sourceName: "target.zip" });
  await manager.importArchive({ scope: "global", archiveBytes: archive("sibling-skill", "sibling"), sourceName: "sibling.zip" });
  assert.equal((await manager.setEnabled({ scope: "global", name: "target-skill", enabled: false })).state, "disabled");
  assert.equal((await manager.setEnabled({ scope: "global", name: "target-skill", enabled: true })).state, "enabled");
  await manager.remove({ scope: "global", name: "target-skill" });
  assert.equal((await manager.list({ scope: "global" })).items.some((item) => item.name === "target-skill"), false);
  assert.equal((await manager.list({ scope: "global" })).items.some((item) => item.name === "sibling-skill"), true);
  assert.equal(await readFile(join(dshHome, "skills", "sibling-skill", "SKILL.md"), "utf8").then(Boolean), true);
});
```

Add five focused tests with these exact arrangements and assertions:

- **Rollback:** build a manager whose injected `fileOps.rename` delegates to `fs.rename` except when the source ends in `/incoming` and the destination is the canonical final path. Import an old bundle, run `replace:true`, assert rejection, assert the old `SKILL.md` remains at the final path, and assert `.transactions` contains no committed descriptor.
- **Crash recovery:** create the canonical `previous` directory plus a version-1 transaction JSON whose final directory is absent. Call `list`, assert the old directory is restored to `finalRelative`, and assert both the transaction JSON and its staging directory are removed.
- **Ambiguous state:** create both `<skillsRoot>/<name>` and `<skillsRoot>/.disabled/<name>`, then assert import, enable, disable, delete and reveal each reject with `SKILL_STATE_CONFLICT` without changing either directory.
- **Scope isolation:** import the same frontmatter name once into global scope and once into project `7`; assert neither import asks for replacement, both exact directories exist, and only the project item has `shadowsGlobal:true`.
- **Reveal target:** inject a `revealPath` spy, import an enabled bundle, call `reveal` with only scope and name, and assert the spy received exactly `join(dshHome, "skills", name)`.

- [ ] **Step 2: Run mutation tests and verify RED**

Run: `node --test test/skill-manager.test.js`

Expected: new mutation tests fail because Task 2 methods are not implemented.

- [ ] **Step 3: Implement serialized mutations and transaction recovery**

Use one in-process queue keyed by `rootPath + "\0" + name`:

```js
const locks = new Map();
function serialize(key, operation) {
  const previous = locks.get(key) ?? Promise.resolve();
  const current = previous.catch(() => {}).then(operation);
  locks.set(key, current);
  return current.finally(() => { if (locks.get(key) === current) locks.delete(key); });
}
```

Implementation sequence for `importArchive`:

1. Reject `archiveBytes.length > 50 MiB` before extraction.
2. Extract to an OS temporary directory and compute the incoming summary.
3. Resolve existing enabled/disabled paths and throw `SKILL_CONFLICT` unless `replace === true`.
4. Only after successful validation, create `<skillsRoot>/.staging/<transactionId>` and copy the normalized incoming directory there.
5. New install: rename incoming directly to `<skillsRoot>/<name>`.
6. Replacement: atomically write `.transactions/<transactionId>.json`, `fsync` the descriptor and containing transaction directory, move existing to `previous`, move incoming to the original enabled/disabled destination, rescan, then remove `previous` and the transaction file.
7. On ordinary failure, restore `previous` before surfacing the original stable error.
8. Always remove OS temp and unused staging content.

Transaction JSON contains only:

```json
{
  "version": 1,
  "id": "uuid",
  "name": "replace-me",
  "state": "disabled",
  "finalRelative": ".disabled/replace-me",
  "stagingRelative": ".staging/uuid/incoming",
  "previousRelative": ".staging/uuid/previous"
}
```

All relative fields are regenerated or revalidated against the canonical `name`; recovery never trusts arbitrary absolute paths from JSON.

Implement enable/disable as exact `rename` operations, make already-target-state calls idempotent, and reject an enabled+disabled duplicate. Implement delete with `rm(exactPath, { recursive: true })` only after the exact state has been re-read; never accept an arbitrary path or wildcard. Implement reveal through the injected `revealPath(exactPath)` function using `spawn(command, args, { shell: false, detached: true, stdio: "ignore" })` for macOS, Windows and Linux.

- [ ] **Step 4: Run manager tests and verify GREEN**

Run: `node --test test/skill-manager.test.js`

Expected: list, import, conflict, state preservation, rollback, recovery, enable/disable/delete and reveal tests all pass.

- [ ] **Step 5: Commit Task 3**

```bash
git add src/host/skill-manager.js test/skill-manager.test.js
git commit -m "feat: manage skill lifecycle transactionally"
```

---

### Task 4: Host API and lifecycle wiring

**Files:**
- Modify: `src/host/api.js`
- Modify: `src/host/index.js`
- Modify: `test/api.test.js`
- Modify: `test/host-lifecycle.test.js`
- Modify: `lib/index.js`

**Interfaces:**
- Consumes: `createSkillManager` and its five methods from Task 3.
- `createApi` gains optional dependency `skills`; Skill routes return `501 SKILL_MANAGER_UNAVAILABLE` only when that dependency is absent.
- Produces exact routes from the spec under `/api/cpwb`.

- [ ] **Step 1: Add failing API contract tests**

Extend `startApi` with `skills` and `skillManagerFactory` options. Immediately after `repos` is created, construct the optional dependency inside the same fixture so the manager and API share one repository instance:

```js
const dshHome = join(dataDir, "dsh-home");
const skillManager = skillManagerFactory
  ? skillManagerFactory({ dshHome, repos })
  : skills;
```

Pass `skills: skillManager` to `createApi` and include `dshHome` in the helper's return object. Then add:

```js
test("skill API lists, imports, conflicts, replaces, disables, and deletes", async (t) => {
  const { base } = await startApi(t, {
    skillManagerFactory: ({ dshHome, repos }) => createSkillManager({
      dshHome,
      repos,
      revealPath: async () => {},
    }),
  });
  const bytes = zipSync({ "SKILL.md": skillMd("api-skill") });
  let response = await fetch(base + "/skills/import", skillUploadBody(bytes, { scope: "global", sourceName: "api.zip" }));
  assert.equal(response.status, 201);
  response = await fetch(base + "/skills/import", skillUploadBody(bytes, { scope: "global", sourceName: "api.zip" }));
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, "SKILL_CONFLICT");
  response = await fetch(base + "/skills/import", skillUploadBody(bytes, { scope: "global", sourceName: "api.zip", replace: true }));
  assert.equal(response.status, 200);
  response = await fetch(base + "/skills/api-skill", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ scope: "global", operation: "disable" }),
  });
  assert.equal((await response.json()).state, "disabled");
  response = await fetch(base + "/skills/api-skill?scope=global", { method: "DELETE" });
  assert.equal(response.status, 200);
});

test("skill API never accepts an installation target path", async (t) => {
  const fake = { list: async (input) => input };
  const { base } = await startApi(t, { skills: fake });
  const response = await fetch(base + "/skills?scope=global&path=%2Ftmp%2Fevil");
  assert.equal(response.status, 422);
  assert.equal((await response.json()).error.code, "INVALID_FIELD");
});
```

Add a host lifecycle assertion that `createSkillManager` receives the already resolved `dshHome`, and that `createApi` receives the same manager without adding a new Cordis service injection.

- [ ] **Step 2: Run the API and lifecycle tests and verify RED**

Run: `node --test test/api.test.js test/host-lifecycle.test.js`

Expected: FAIL because `createApi` has no `skills` dependency or routes.

- [ ] **Step 3: Implement error mapping and five routes**

Add `SkillManagerError` handling in `toApiError` with this status mapping:

```js
const SKILL_ERROR_STATUS = {
  INVALID_SKILL_SCOPE: 422,
  PROJECT_NOT_FOUND: 404,
  PROJECT_PATH_UNAVAILABLE: 422,
  SKILL_ARCHIVE_TOO_LARGE: 413,
  SKILL_ARCHIVE_UNSAFE: 422,
  SKILL_PACKAGE_INVALID: 422,
  SKILL_NAME_INVALID: 422,
  SKILL_CONFLICT: 409,
  SKILL_STATE_CONFLICT: 409,
  SKILL_NOT_FOUND: 404,
  SKILL_PERMISSION_DENIED: 403,
  SKILL_TRANSACTION_RECOVERY_REQUIRED: 409,
  FILE_MANAGER_UNAVAILABLE: 501,
};
```

Implement and register:

```js
{ pattern: "/skills", methods: { GET: handleSkillsList } },
{ pattern: "/skills/import", methods: { POST: handleSkillImport } },
{ pattern: "/skills/:name/reveal", methods: { POST: handleSkillReveal } },
{ pattern: "/skills/:name", methods: { PATCH: handleSkillPatch, DELETE: handleSkillDelete } },
```

Route rules:

- `GET /skills` accepts only `scope` and `projectId` query keys.
- Import requires `content-type: application/zip`, `x-cpwb-skill-scope`, URI-encoded `x-cpwb-filename`, optional positive `x-cpwb-project-id`, and `x-cpwb-replace` equal to `true` or `false`.
- Add `readRawBody(req, 50 * 1024 * 1024)` that aborts at the authoritative compressed limit.
- PATCH accepts JSON `{ scope, projectId?, operation: "enable" | "disable" }` and rejects unknown fields.
- DELETE accepts only `scope` and optional `projectId` query keys.
- Reveal accepts JSON `{ scope, projectId? }` and returns `{ revealed: true }`.
- Validate `:name` with the canonical regex before calling the manager.

In `src/host/index.js`, construct `const skillManager = createSkillManager({ dshHome, repos })` beside the existing repositories and add `skills: skillManager` to the existing `createApi` dependency object. Do not add a Cordis service slot or a second repository instance.

- [ ] **Step 4: Run focused host tests and build**

Run: `node --test test/api.test.js test/host-lifecycle.test.js test/skill-package.test.js test/skill-manager.test.js`

Expected: all focused host tests pass.

Run: `npm run build`

Expected: `lib/index.js` rebuilds and the host bundle imports successfully.

- [ ] **Step 5: Commit Task 4**

```bash
git add src/host/api.js src/host/index.js test/api.test.js test/host-lifecycle.test.js lib/index.js
git commit -m "feat: expose skill management api"
```

---

### Task 5: Browser directory packaging and client API

**Files:**
- Create: `src/client/skill-import.js`
- Modify: `src/client/api.js`
- Modify: `test/client.test.js`
- Modify: `lib/client.js`

**Interfaces:**
- Produces: `packSkillDirectory(files)` returning `{ archive: Blob, sourceName: string }`.
- Produces `api.skills.list`, `api.skills.importBundle`, `api.skills.setEnabled`, `api.skills.remove`, and `api.skills.reveal`.
- All methods accept `{ scope: "global" | "project", projectId?: number }`; no method accepts a target path.

- [ ] **Step 1: Write failing client transport and packaging tests**

```js
import { unzipSync, strFromU8 } from "fflate";
import { packSkillDirectory } from "../src/client/skill-import.js";

test("packSkillDirectory preserves one selected root without absolute paths", async () => {
  const files = [
    fakeBrowserFile("example-skill/SKILL.md", "---\nname: example-skill\ndescription: Example.\n---\nbody"),
    fakeBrowserFile("example-skill/references/a.md", "A"),
  ];
  const packed = await packSkillDirectory(files);
  assert.equal(packed.sourceName, "example-skill");
  const entries = unzipSync(new Uint8Array(await packed.archive.arrayBuffer()));
  assert.deepEqual(Object.keys(entries).sort(), ["example-skill/SKILL.md", "example-skill/references/a.md"]);
  assert.equal(strFromU8(entries["example-skill/references/a.md"]), "A");
});

test("api: skills use the exact scoped contract and preserve conflict details", async () => {
  const archive = new Blob(["zip"], { type: "application/zip" });
  const fetchImpl = makeFetch(({ url, init }, index) => {
    const parsed = parse(url);
    if (index === 0) {
      assert.equal(parsed.pathname, "/api/cpwb/skills");
      assert.equal(parsed.searchParams.get("scope"), "project");
      assert.equal(parsed.searchParams.get("projectId"), "7");
      return jsonResponse(200, { items: [] });
    }
    assert.equal(parsed.pathname, "/api/cpwb/skills/import");
    assert.equal(init.method, "POST");
    assert.equal(init.body, archive);
    assert.equal(init.headers["content-type"], "application/zip");
    assert.equal(init.headers["x-cpwb-skill-scope"], "project");
    assert.equal(init.headers["x-cpwb-project-id"], "7");
    assert.equal(init.headers["x-cpwb-replace"], "false");
    return jsonResponse(409, { error: { code: "SKILL_CONFLICT", message: "同名 Skill 已存在", details: { existing: { name: "x" }, incoming: { name: "x" } } } });
  });
  const api = createCpwbApi({ fetchImpl });
  await api.skills.list({ scope: "project", projectId: 7 });
  await assert.rejects(
    () => api.skills.importBundle({ archive, scope: "project", projectId: 7, sourceName: "x.zip", replace: false }),
    (error) => error.code === "SKILL_CONFLICT" && error.details.existing.name === "x",
  );
});
```

- [ ] **Step 2: Run client tests and verify RED**

Run: `node --test test/client.test.js`

Expected: FAIL because `skill-import.js` and `api.skills` do not exist.

- [ ] **Step 3: Implement browser packaging**

`packSkillDirectory(files)` must:

- Accept an Array or FileList of ordinary browser `File` objects.
- Require 1–1,000 files, a non-empty shared first `webkitRelativePath` segment, total source bytes `<=100 MiB`, and each file `<=50 MiB`.
- Reject relative paths containing NUL, backslash, empty segments, `.` or `..`.
- Read files with `arrayBuffer()`, pass a path→`Uint8Array` map to asynchronous `fflate.zip`, and resolve a `Blob` with MIME `application/zip`; reject the resulting Blob when its compressed size exceeds 50 MiB.
- Preserve the selected wrapper folder because the Host accepts exactly one wrapper.
- Throw local errors with the same stable archive/package codes used by the Host.

- [ ] **Step 4: Implement exact client API methods**

Add this exact request mapping:

```js
skills: {
  list({ scope, projectId, signal } = {}) {
    return request({ path: "/skills", query: { scope, projectId }, signal });
  },
  importBundle({ archive, scope, projectId, sourceName, replace = false }, { signal } = {}) {
    return request({
      method: "POST",
      path: "/skills/import",
      rawBody: archive,
      headers: {
        "content-type": "application/zip",
        "x-cpwb-skill-scope": scope,
        "x-cpwb-filename": encodeURIComponent(sourceName),
        ...(projectId === undefined ? {} : { "x-cpwb-project-id": String(projectId) }),
        "x-cpwb-replace": String(replace),
      },
      signal,
    });
  },
  setEnabled({ name, scope, projectId, enabled }, { signal } = {}) {
    return request({ method: "PATCH", path: "/skills/" + encodeURIComponent(name), body: { scope, projectId, operation: enabled ? "enable" : "disable" }, signal });
  },
  remove({ name, scope, projectId }, { signal } = {}) {
    return request({ method: "DELETE", path: "/skills/" + encodeURIComponent(name), query: { scope, projectId }, signal });
  },
  reveal({ name, scope, projectId }, { signal } = {}) {
    return request({ method: "POST", path: "/skills/" + encodeURIComponent(name) + "/reveal", body: { scope, projectId }, signal });
  },
},
```

Use `encodeURIComponent(name)` for path segments and `encodeURIComponent(sourceName)` for the header. `setEnabled` sends operation `enable` or `disable`. Preserve the existing `CpwbApiError.details` behavior for conflict rendering.

- [ ] **Step 5: Run client tests and build**

Run: `node --test test/client.test.js`

Expected: packaging and exact request-shape tests pass.

Run: `npm run build`

Expected: `lib/client.js` contains the bundled `fflate` client code and passes `node --check lib/client.js`.

- [ ] **Step 6: Commit Task 5**

```bash
git add src/client/skill-import.js src/client/api.js test/client.test.js lib/client.js
git commit -m "feat: add skill import client"
```

---

### Task 6: Skill catalog state and mutations in the Workbench store

**Files:**
- Modify: `src/client/store.js`
- Modify: `test/client.test.js`
- Modify: `lib/client.js`

**Interfaces:**
- Consumes: `api.skills` from Task 5.
- Produces state `{ skillCatalogs, skillAction }`, keyed by `global` or `project:<id>`. Each catalog slot is `{ status, data, error }`, where `status` is `loading`, `ready`, or `error` and `data` is the last successful server catalog or `null`.
- Produces actions `loadSkills`, `importSkill`, `setSkillEnabled`, `deleteSkill`, and `revealSkill`.

- [ ] **Step 1: Write failing store tests**

```js
test("store keeps independent global and project skill catalogs", async () => {
  const calls = [];
  const api = {
    health: async () => ({ ok: true }),
    skills: {
      async list(input) {
        calls.push(["list", input]);
        return { scope: input.scope === "global" ? { kind: "global" } : { kind: "project", projectId: input.projectId }, rootPath: input.scope === "global" ? "/dsh/skills" : "/project/.dsh/skills", items: [], diagnostics: [] };
      },
      async setEnabled(input) { calls.push(["setEnabled", input]); return { name: input.name, state: input.enabled ? "enabled" : "disabled" }; },
      async remove(input) { calls.push(["remove", input]); return { removed: true }; },
      async reveal(input) { calls.push(["reveal", input]); return { revealed: true }; },
    },
  };
  const store = createWorkbenchStore(api);
  await store.actions.loadSkills({ scope: "global" });
  await store.actions.loadSkills({ scope: "project", projectId: 7 });
  assert.equal(store.getSnapshot().skillCatalogs.global.status, "ready");
  assert.equal(store.getSnapshot().skillCatalogs.global.data.rootPath, "/dsh/skills");
  assert.equal(store.getSnapshot().skillCatalogs["project:7"].data.rootPath, "/project/.dsh/skills");
  await store.actions.setSkillEnabled({ scope: "project", projectId: 7, name: "x", enabled: false });
  assert.deepEqual(calls.at(-1), ["list", { scope: "project", projectId: 7 }]);
});

test("store exposes a skill conflict without forging catalog state", async () => {
  const conflict = Object.assign(new Error("同名"), { code: "SKILL_CONFLICT", details: { existing: { name: "x" }, incoming: { name: "x" } } });
  const api = { health: async () => ({ ok: true }), skills: { importBundle: async () => { throw conflict; } } };
  const store = createWorkbenchStore(api);
  await assert.rejects(() => store.actions.importSkill({ scope: "global", archive: new Blob(), sourceName: "x.zip" }), /同名/);
  assert.equal(store.getSnapshot().skillAction.error.code, "SKILL_CONFLICT");
  assert.deepEqual(store.getSnapshot().skillAction.error.details, conflict.details);
});
```

- [ ] **Step 2: Run store tests and verify RED**

Run: `node --test test/client.test.js`

Expected: FAIL because Skill state and actions are absent.

- [ ] **Step 3: Implement the store slice**

Initialize:

```js
skillCatalogs: {},
skillAction: null,
```

Use `skillCatalogKey({ scope, projectId })` to return `global` or `project:<id>`. `loadSkills` uses a per-key sequence number and `AbortController`: it first writes `{ status: "loading", data: previousData, error: null }`, then writes `ready` with the returned catalog or `error` with `toError(err)` while retaining the last successful data. Switching projects cannot abort or overwrite another key. Skill loading errors remain inside their catalog slot and do not overwrite the store's existing general `error`. Every successful import, enable/disable or delete must reload exactly the affected catalog from the server; do not optimistically edit `items`. `revealSkill` does not reload.

Extend `toError` to preserve JSON-safe `details`:

```js
return {
  code: err.code,
  message: typeof err.message === "string" ? err.message : String(err),
  ...(err.details === undefined ? {} : { details: err.details }),
};
```

`skillAction` has `{ type, key, name, status, error }`; mutations update only this field and must not overwrite the existing general `action` used by projects, schedules and sessions.

- [ ] **Step 4: Run store tests and build**

Run: `node --test test/client.test.js`

Expected: Skill catalog separation, mutation refetch and conflict detail tests pass.

Run: `npm run build`

Expected: client bundle rebuild succeeds.

- [ ] **Step 5: Commit Task 6**

```bash
git add src/client/store.js test/client.test.js lib/client.js
git commit -m "feat: manage skill catalog state"
```

---

### Task 7: Full Skills page and bottom sidebar entry

**Files:**
- Create: `src/client/SkillsManager.js`
- Create: `src/client/SkillsPage.js`
- Modify: `src/client/navigation.js`
- Modify: `src/client/WorkbenchSidebar.js`
- Modify: `src/client/WorkbenchShell.js`
- Modify: `src/client/workbench.css`
- Modify: `test/unified-session-ui.test.js`
- Modify: `test/task4-session-shell.test.js`
- Modify: `test/css.test.js`
- Modify: `lib/client.js`

**Interfaces:**
- Consumes: store Skill state/actions and `packSkillDirectory`.
- Produces `SkillScopeManager({ store, scope, projectId, compact })` and dialog exports `SkillConflictDialog`, `SkillDeleteDialog`.
- Produces `SkillsPage({ store })`, defaulting to global scope.
- Navigation gains `openSkills()` and page value `skills`.

- [ ] **Step 1: Invoke the mandatory UI skills and capture the preflight decisions**

Read both complete instruction files before editing:

```bash
sed -n '1,400p' '/Users/yewang/.codex/skills/frontend-design/SKILL.md'
sed -n '1,400p' '/Users/yewang/.codex/skills/taste-skill/SKILL.md'
```

Apply them within the already approved Workbench design system. The browser mock is the primary visual fact source: keep the sidebar location, cyan active rail, compact typography, scope tabs, path strip, 74px list rhythm and existing project rail geometry. Do not introduce a top nav, marketing-page composition, gradients unrelated to existing tokens, or a new font dependency.

- [ ] **Step 2: Write failing navigation and page tests**

```js
test("skills navigation is mutually exclusive and sidebar entry sits above settings", () => {
  const navigation = createNavigationStore();
  navigation.openSkills();
  assert.equal(navigation.getSnapshot().page, "skills");
  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, { page: "skills", recentSessions: [] }));
  assert.match(html, /aria-current="page"[^>]*>[\s\S]*Skills/);
  assert.ok(html.indexOf(">Skills<") < html.indexOf(">设置<"));
});

test("SkillsPage defaults to global scope and exposes directory plus ZIP import", () => {
  const state = {
    projects: [{ id: 7, name: "Research" }],
    skillCatalogs: { global: { status: "ready", data: { scope: { kind: "global" }, rootPath: "/dsh/skills", items: [], diagnostics: [] }, error: null } },
    skillAction: null,
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: { loadSkills: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(SkillsPage, { store }));
  assert.match(html, /SKILL MANAGEMENT/);
  assert.match(html, /role="tab" aria-selected="true"[^>]*>全局/);
  assert.match(html, /\/dsh\/skills/);
  assert.match(html, /导入目录/);
  assert.match(html, /导入 ZIP/);
  assert.doesNotMatch(html, /替换 Skill/);
});

test("Skill conflict dialog is only an import decision", () => {
  const html = renderToStaticMarkup(React.createElement(SkillConflictDialog, {
    existing: { name: "x", description: "old", state: "enabled", files: ["SKILL.md"] },
    incoming: { name: "x", description: "new", files: ["SKILL.md", "references/a.md"] },
    onCancel() {}, onReplace() {},
  }));
  assert.match(html, /同名 Skill 已存在/);
  assert.match(html, /取消/);
  assert.match(html, /确认替换/);
});
```

Update the shell page matrix test from `home/knowledge/sessions/conversation` to include `skills`, and assert exactly one center page remains rendered.

- [ ] **Step 3: Run UI tests and verify RED**

Run: `node --test test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js`

Expected: FAIL because the Skills page, route and entry do not exist.

- [ ] **Step 4: Implement navigation and shell routing**

In `navigation.js`, add `skills` to `PAGES` and:

```js
openSkills() { openPage("skills"); },
```

In `WorkbenchShell.js`, route `skills` to `React.createElement(SkillsPage, { store: props.store })`, handle `navigate("skills")`, and pass `onNavigate` to the sidebar. Mobile navigation closes after opening Skills exactly like home/knowledge/sessions.

In `WorkbenchSidebar.js`, import `Sparkle` and render a dedicated footer button immediately before Settings:

```js
React.createElement("button", {
  type: "button",
  className: "cpwb-sidebar-settings cpwb-sidebar-skills" + (page === "skills" ? " cpwb-active" : ""),
  "aria-current": page === "skills" ? "page" : undefined,
  onClick: () => onNavigate?.("skills"),
}, React.createElement(NavIcon, { component: Sparkle }), React.createElement("span", null, "Skills"))
```

- [ ] **Step 5: Implement shared manager and full page**

`SkillsPage` owns only `scope` and selected `projectId`; it renders the approved page header, global/project tabs, project selector and one `SkillScopeManager`.

`SkillScopeManager` must:

- Call `loadSkills` on scope/project change.
- Render loading, root unavailable, empty, diagnostics and valid list states.
- Render installed path and copy action; call `revealSkill` for file-manager display.
- Use two visually distinct buttons, “导入目录” and “导入 ZIP”, backed by hidden `<input type="file" webkitdirectory="" multiple>` and `<input type="file" accept=".zip,application/zip">` controls.
- Convert a directory with `packSkillDirectory`; pass ZIP File directly as `archive`.
- Reject a selected ZIP larger than 50 MiB before calling the store, and reset each hidden file input after packaging so selecting the same source again still emits `change`.
- Keep the selected Blob/File in component state after `SKILL_CONFLICT`; `SkillConflictDialog` calls the same `importSkill` again with `replace:true`.
- Show enable/disable, display directory and delete actions; never show a standalone replace action.
- `SkillDeleteDialog` displays exact scope, name, state and path before calling `deleteSkill`.
- Disable only the affected row while `skillAction.status === "running"`.
- Use `role="status"` for progress/success and `role="alert"` for actionable errors.

- [ ] **Step 6: Add Workbench-native responsive styles**

Add focused `.cpwb-skills-*` rules using existing tokens. Required structural assertions:

```css
.cpwb-skills-page { display: flex; flex-direction: column; }
.cpwb-skills-layout { width: min(100%, 1180px); margin: 0 auto; }
.cpwb-skills-tabs { display: flex; min-height: 42px; border-bottom: 1px solid var(--cpwb-border); }
.cpwb-skills-path { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; min-height: 46px; }
.cpwb-skill-row { display: grid; grid-template-columns: minmax(150px, .8fr) minmax(0, 1.4fr) auto; min-height: 74px; }
.cpwb-sidebar-skills.cpwb-active { color: var(--cpwb-cyan); border-left: 2px solid var(--cpwb-cyan); background: var(--cpwb-cyan-soft); }
```

At `max-width: 720px`, collapse each row to one content column plus actions, keep long descriptions wrapping, and ensure dialogs fit `100dvh`. Add reduced-motion handling for any new progress animation.

Extend `test/css.test.js` with assertions for the fixed footer ordering class, 74px row rhythm, mobile collapse, dialog top-layer host and reduced-motion rules.

- [ ] **Step 7: Run UI tests and build**

Run: `node --test test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js`

Expected: Skills route, sidebar order, default scope, import controls, conflict dialog and CSS contracts pass.

Run: `npm run build`

Expected: `lib/client.js` rebuilds without bundling React.

- [ ] **Step 8: Commit Task 7**

```bash
git add src/client/SkillsManager.js src/client/SkillsPage.js src/client/navigation.js src/client/WorkbenchSidebar.js src/client/WorkbenchShell.js src/client/workbench.css test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js lib/client.js
git commit -m "feat: add global skill management page"
```

---

### Task 8: Project-only Skills tab in the right rail

**Files:**
- Modify: `src/client/WorkbenchSessionShell.js`
- Modify: `src/client/SkillsManager.js`
- Modify: `src/client/workbench.css`
- Modify: `test/unified-session-ui.test.js`
- Modify: `test/task4-session-shell.test.js`
- Modify: `lib/client.js`

**Interfaces:**
- Consumes: `SkillScopeManager` from Task 7.
- Produces: `PROJECT_TOOL_TABS` with `skills` as the final tab and `ProjectSkillsPanel({ store, projectId })` rendered only for project sessions.

- [ ] **Step 1: Write failing project rail tests**

```js
test("project rail adds Skills last without leaking it to other scopes", () => {
  assert.deepEqual(PROJECT_TOOL_TABS.map(([id, label]) => [id, label]), [
    ["todos", "待办"],
    ["schedule", "定时任务"],
    ["knowledge", "关联知识库"],
    ["summary", "每日总结"],
    ["skills", "Skills"],
  ]);
  assert.equal(KNOWLEDGE_TOOL_TABS.some(([id]) => id === "skills"), false);
  assert.equal(INDEPENDENT_TOOL_TABS.some(([id]) => id === "skills"), false);
});

test("project Skills rail binds directly to the current project", () => {
  const state = {
    projects: [{ id: 7, name: "Research" }],
    workbenchSessions: { "session-cpwb-project": { sessionId: "session-cpwb-project", scope: { kind: "project", id: 7 } } },
    skillCatalogs: { "project:7": { status: "ready", data: { scope: { kind: "project", projectId: 7 }, rootPath: "/project/.dsh/skills", items: [], diagnostics: [] }, error: null } },
    linkedKnowledgeBases: [],
  };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: { refreshProject: async () => {}, loadSkills: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(WorkbenchSessionShell, {
    sessionId: "session-cpwb-project", open: true, store, layoutMode: "desktop", initialTool: "skills",
  }));
  assert.match(html, /项目 Skills/);
  assert.match(html, /\/project\/\.dsh\/skills/);
  assert.doesNotMatch(html, /选择项目/);
});
```

If `initialTool` does not exist, add it as an optional public prop used to initialize the existing `activeTool` state; default behavior remains `todos`.

- [ ] **Step 2: Run rail tests and verify RED**

Run: `node --test test/unified-session-ui.test.js test/task4-session-shell.test.js`

Expected: FAIL because the project tool matrix has no Skills tab.

- [ ] **Step 3: Implement the compact project surface**

Import `Sparkle` and `SkillScopeManager`, append:

```js
["skills", "Skills", Sparkle],
```

to `PROJECT_TOOL_TABS`. In the project body switch:

```js
else if (activeTool === "skills") {
  body = React.createElement(SkillScopeManager, {
    store: props.store,
    scope: "project",
    projectId,
    compact: true,
  });
}
```

Compact mode keeps the same API/actions and dialogs but renders:

- “项目 Skills” heading and one compact import menu/button.
- Relative path `.dsh/skills/` plus a title containing the absolute installed root.
- Name, state and shadowing status; descriptions truncate to two lines.
- Row actions reachable by keyboard and labelled with the Skill name.
- No scope tabs, no project selector and no global operations.

Add compact CSS under `.cpwb-project-rail .cpwb-skills-*`, preserving the existing 320px rail and the already approved five-tab geometry. Tablet/mobile use the existing right Drawer without creating another overlay.

- [ ] **Step 4: Run rail tests and build**

Run: `node --test test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js`

Expected: project-only tab matrix, current project binding and compact CSS pass.

Run: `npm run build`

Expected: client bundle rebuild succeeds.

- [ ] **Step 5: Commit Task 8**

```bash
git add src/client/WorkbenchSessionShell.js src/client/SkillsManager.js src/client/workbench.css test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js lib/client.js
git commit -m "feat: add project skill rail"
```

---

### Task 9: End-to-end verification and visual QA

**Files:**
- Modify only if verification exposes a concrete defect; add the matching regression test in the same commit.

**Interfaces:**
- Consumes the complete Host→API→Store→UI chain.
- Produces verification evidence for package safety, filesystem effects, runtime visibility, responsive rendering and repository cleanliness.

- [ ] **Step 1: Run focused Skill suites**

Run:

```bash
node --test test/skill-package.test.js test/skill-manager.test.js test/api.test.js test/client.test.js test/unified-session-ui.test.js test/task4-session-shell.test.js test/css.test.js test/host-lifecycle.test.js
```

Expected: all focused tests pass with zero skipped Skill tests.

- [ ] **Step 2: Run the repository completion checks**

Run:

```bash
git diff --check
npm run check
git status --short
git diff --stat b19c463..HEAD
```

Expected: `npm run check` exits 0; `git diff --check` emits nothing; only intentional feature changes remain.

- [ ] **Step 3: Start an isolated real Workbench environment**

Use a new temporary `DSH_HOME` and port `3091`, which is distinct from the user's existing `57531` visualization server. Re-run the four Git worktree guards from Execution Context, then start the checked-out launcher directly in its own PTY:

```bash
skill_qa_home="$(mktemp -d /tmp/cpwb-skill-qa.XXXXXX)"
DSH_HOME="$skill_qa_home" \
DSH_CYBERPUNK_WORKBENCH_DATA_DIR="$skill_qa_home/workbench" \
DSH_TELEMETRY_MODE=DISABLED \
node ./bin/dsh-workbench.js web --no-open --port 3091
```

Do not use the real user profile and do not run `dev:activate`, which would repoint global links. Record the resolved `skill_qa_home`, PTY/process ID, listener and health response; do not stop or replace unrelated running DSH processes.

Expected evidence:

```text
listener: 127.0.0.1:3091
GET /api/cpwb/health: 200
DSH_HOME: isolated temporary directory
```

- [ ] **Step 4: Exercise the real import lifecycle**

Using `test/fixtures/skills/example-skill`:

1. Import it as a global directory and verify `<temp-DSH_HOME>/skills/example-skill/SKILL.md` plus the reference file.
2. Re-import unchanged and verify `409 SKILL_CONFLICT` reaches the dialog.
3. Confirm replacement and verify no duplicate or `.staging` residue.
4. Disable, enable and delete it; compare exact before/after target lists.
5. Create a temporary Workbench project directory, import the same name globally and at project scope, and verify both directories coexist.
6. Verify the project catalog reports `shadowsGlobal:true`; an independent catalog never reports project entries.
7. If the live DSH Skill Registry is exposed, verify the project cwd resolves the project definition and an independent cwd resolves the global definition. If it is not exposed, mark runtime readback as partially verified rather than inferring it from file existence.

- [ ] **Step 5: Perform browser rendering and interaction QA**

Read and use the in-app browser control skill before browser actions. At `1440×900`, compare the implementation to the approved browser mock for:

- no top navigation;
- bottom Skills entry immediately above Settings;
- default global tab;
- cyan active marker, page header, scope tabs, path strip and list rhythm;
- project rail Skills tab last and bound to the current project.

Repeat structural checks at `1024×768` and `390×844`. Exercise loading, empty, long description, invalid diagnostic, disabled, conflict, error, success and delete confirmation states. Check keyboard focus return, `aria-current`/`aria-selected`, horizontal overflow and console errors. Save screenshots for desktop full page, desktop project rail and mobile drawer.

- [ ] **Step 6: Fix only evidence-backed defects and rerun affected checks**

For each defect, first add the smallest failing regression test, then patch the focused file, run that test, and repeat the exact browser state. Do not perform unrelated visual redesign or refactoring.

If any code changes were required, commit them:

Stage only the evidence-backed verification changes with `git add -p`, then stage any changed generated bundles explicitly and commit:

```bash
git add -p
git add -u lib/index.js lib/client.js
git commit -m "fix: close skill management verification gaps"
```

Before committing, inspect `git diff --cached --stat`; omit unchanged generated bundle paths and reject every unrelated hunk.

- [ ] **Step 7: Final handoff audit**

Run:

```bash
git rev-parse --show-toplevel
git branch --show-current
git status --short
git log --oneline b19c463..HEAD
git -C ../.. status --short --branch
```

Expected:

- worktree root is `.worktrees/skill-management`;
- branch is `feat/skill-management`;
- feature worktree has no unintended uncommitted changes;
- primary checkout remains clean on `main`;
- no push, merge or release has occurred.
