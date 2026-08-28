import { test } from "node:test";
import assert from "node:assert/strict";
import { chmod, lstat, mkdir, symlink, writeFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";

import { createTempDir, removeTempDir } from "./helpers.js";
import { SKILL_ERROR_CODES } from "../src/host/skill-package.js";
import { createSkillManager } from "../src/host/skill-manager.js";

const markdown = (name, description = name) => `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`;

async function makeBundle(root, relative, name, description = name, files = {}) {
  const directory = join(root, relative);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "SKILL.md"), markdown(name, description));
  for (const [file, contents] of Object.entries(files)) {
    const target = join(directory, file);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, contents);
  }
  return directory;
}

function projectRepos(projectPath, id = 7) {
  return { projects: { get: (requested) => requested === id ? { id, path: projectPath } : null } };
}

test("list scans enabled, disabled, invalid, and project shadowing without a database", async (t) => {
  const root = await createTempDir("cpwb-skill-manager-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const projectPath = join(root, "project");
  await makeBundle(join(dshHome, "skills"), "shared-skill", "shared-skill", "global");
  await makeBundle(join(projectPath, ".dsh", "skills"), "shared-skill", "shared-skill", "project");
  await makeBundle(join(projectPath, ".dsh", "skills", ".disabled"), "paused-skill", "paused-skill");
  await mkdir(join(projectPath, ".dsh", "skills", "broken-folder"), { recursive: true });
  const manager = createSkillManager({ dshHome, repos: projectRepos(projectPath) });

  const catalog = await manager.list({ scope: "project", projectId: 7 });
  assert.equal(catalog.rootPath, join(projectPath, ".dsh", "skills"));
  assert.deepEqual(catalog.items.map(({ name, state, shadowsGlobal }) => ({ name, state, shadowsGlobal })), [
    { name: "paused-skill", state: "disabled", shadowsGlobal: false },
    { name: "shared-skill", state: "enabled", shadowsGlobal: true },
  ]);
  assert.equal(catalog.diagnostics[0].kind, "invalid-directory");
});

test("list reports invalid bundles, flat files, and symlink diagnostics", async (t) => {
  const root = await createTempDir("cpwb-skill-diagnostics-");
  t.after(() => removeTempDir(root));
  const skillsRoot = join(root, "dsh", "skills");
  await makeBundle(skillsRoot, "valid-skill", "valid-skill", "valid", { "references/readme.md": "read me" });
  await makeBundle(skillsRoot, "wrong-folder", "declared-name");
  await mkdir(join(skillsRoot, "missing-markdown"));
  await writeFile(join(skillsRoot, "flat.md"), markdown("flat"));
  await makeBundle(skillsRoot, "invalid-frontmatter", "invalid-frontmatter");
  await writeFile(join(skillsRoot, "invalid-frontmatter", "SKILL.md"), "not yaml");
  await symlink(join(skillsRoot, "valid-skill"), join(skillsRoot, "root-link"));
  await makeBundle(skillsRoot, "nested-link", "nested-link");
  await symlink(join(root, "outside.txt"), join(skillsRoot, "nested-link", "resource-link"));
  await writeFile(join(root, "outside.txt"), "outside");

  const catalog = await createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(root) })
    .list({ scope: "global" });
  assert.deepEqual(catalog.items.map(({ name, files, fileCount, health }) => ({ name, files, fileCount, health })), [
    { name: "valid-skill", files: ["SKILL.md", "references/readme.md"], fileCount: 2, health: "valid" },
  ]);
  assert.deepEqual(catalog.diagnostics.map(({ kind }) => kind), [
    "flat-file", "invalid-frontmatter", "invalid-directory", "nested-symlink", "symlink", "folder-name-mismatch",
  ]);
});

test("list diagnoses enabled and disabled duplicates and never returns either", async (t) => {
  const root = await createTempDir("cpwb-skill-duplicate-");
  t.after(() => removeTempDir(root));
  const skillsRoot = join(root, "dsh", "skills");
  await makeBundle(skillsRoot, "duplicate", "duplicate", "enabled");
  await makeBundle(join(skillsRoot, ".disabled"), "duplicate", "duplicate", "disabled");

  const catalog = await createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(root) })
    .list({ scope: "global" });
  assert.deepEqual(catalog.items, []);
  assert.equal(catalog.diagnostics.filter(({ kind }) => kind === "state-conflict").length, 1);
});

test("list returns an empty catalog for a missing root without creating it", async (t) => {
  const root = await createTempDir("cpwb-skill-empty-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const catalog = await createSkillManager({ dshHome, repos: projectRepos(root) }).list({ scope: "global" });
  assert.deepEqual(catalog.items, []);
  assert.deepEqual(catalog.diagnostics, []);
  await assert.rejects(() => lstat(join(dshHome, "skills")), { code: "ENOENT" });
});

test("project scope requires a known project with an existing absolute directory", async (t) => {
  const root = await createTempDir("cpwb-skill-scope-");
  t.after(() => removeTempDir(root));
  const existing = join(root, "project");
  await mkdir(existing);
  const manager = createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(existing) });
  for (const input of [
    { scope: "other" },
    { scope: "project", projectId: 0 },
    { scope: "project", projectId: 1.5 },
  ]) {
    await assert.rejects(() => manager.list(input), (error) => error.code === SKILL_ERROR_CODES.INVALID_SCOPE);
  }
  await assert.rejects(() => manager.list({ scope: "project", projectId: 99 }), (error) => error.code === SKILL_ERROR_CODES.PROJECT_NOT_FOUND);
  const relativeManager = createSkillManager({
    dshHome: join(root, "dsh"),
    repos: { projects: { get: () => ({ id: 2, path: "relative/project" }) } },
  });
  await assert.rejects(() => relativeManager.list({ scope: "project", projectId: 2 }), (error) => error.code === SKILL_ERROR_CODES.PROJECT_PATH_UNAVAILABLE);
  const missingManager = createSkillManager({
    dshHome: join(root, "dsh"),
    repos: { projects: { get: () => ({ id: 3, path: join(root, "missing") }) } },
  });
  await assert.rejects(() => missingManager.list({ scope: "project", projectId: 3 }), (error) => error.code === SKILL_ERROR_CODES.PROJECT_PATH_UNAVAILABLE);
  assert.equal(isAbsolute(existing), true);
});

test("list sorts items and diagnostics by their stable names and paths", async (t) => {
  const root = await createTempDir("cpwb-skill-sorting-");
  t.after(() => removeTempDir(root));
  const skillsRoot = join(root, "dsh", "skills");
  await makeBundle(skillsRoot, "zeta", "zeta");
  await makeBundle(skillsRoot, "alpha", "alpha");
  await makeBundle(join(skillsRoot, ".disabled"), "beta", "beta");
  await mkdir(join(skillsRoot, "aardvark"));
  await writeFile(join(skillsRoot, "aardvark", "SKILL.md"), markdown("aardvark"));
  await writeFile(join(skillsRoot, "flat.md"), "flat");
  const catalog = await createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(root) })
    .list({ scope: "global" });
  assert.deepEqual(catalog.items.map(({ name }) => name), ["aardvark", "alpha", "beta", "zeta"]);
  assert.deepEqual(catalog.diagnostics.map(({ path }) => path), [...catalog.diagnostics.map(({ path }) => path)].sort());
});

test("permission failures under a trusted root map to a safe manager error", async (t) => {
  const root = await createTempDir("cpwb-skill-permission-");
  t.after(() => { chmod(join(root, "dsh", "skills"), 0o755).catch(() => {}); return removeTempDir(root); });
  const skillsRoot = join(root, "dsh", "skills");
  await mkdir(skillsRoot, { recursive: true });
  await makeBundle(skillsRoot, "private-skill", "private-skill");
  const fileOps = {
    lstat: async (path) => {
      if (path === skillsRoot) {
        const error = new Error("secret /private/path");
        error.code = "EACCES";
        throw error;
      }
      return lstat(path);
    },
    readdir: async () => [],
    readFile: async () => "",
  };
  const error = await assert.rejects(
    () => createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(root), fileOps }).list({ scope: "global" }),
    (candidate) => candidate.code === SKILL_ERROR_CODES.PERMISSION_DENIED
      && !JSON.stringify(candidate.details ?? {}).includes("/private/path"),
  );
  assert.equal(error, undefined);
});
