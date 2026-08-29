import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { chmod, lstat, mkdir, mkdtemp as fsMkdtemp, readFile, readdir, realpath as fsRealpath, rename as fsRename, rm, symlink, writeFile } from "node:fs/promises";
import { basename, isAbsolute, join, parse, resolve } from "node:path";
import { strToU8, zipSync } from "fflate";

import { createTempDir, removeTempDir } from "./helpers.js";
import { SKILL_ERROR_CODES } from "../src/host/skill-package.js";
import { canonicalPathIdentity, createSkillManager } from "../src/host/skill-manager.js";

const markdown = (name, description = name) => `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`;
const archive = (name, description = name) => zipSync({
  "SKILL.md": strToU8(markdown(name, description)),
  "references/value.md": strToU8(description),
});
const collectionArchive = (skills) => zipSync(Object.fromEntries(skills.flatMap(({ name, description = name }) => [
  [`skills/${name}/SKILL.md`, strToU8(markdown(name, description))],
  [`skills/${name}/references/value.md`, strToU8(description)],
])));

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

test("canonical path identity preserves suffixes when the nearest ancestor is filesystem root", async () => {
  const missing = join(parse(resolve(process.cwd())).root, `.cpwb-skill-identity-${randomUUID()}`, "skills");
  assert.equal(
    await canonicalPathIdentity({ lstat, realpath: fsRealpath }, missing),
    missing,
  );
});

test("canonical path identity retains a component when an existing ancestor disappears during realpath", async (t) => {
  const root = await createTempDir("cpwb-skill-identity-race-");
  t.after(() => removeTempDir(root));
  const missing = join(root, "missing", "skills");
  let failOnce = true;
  const identity = await canonicalPathIdentity({
    lstat,
    realpath: async (path) => {
      if (failOnce) {
        failOnce = false;
        const error = new Error("ancestor disappeared");
        error.code = "ENOENT";
        throw error;
      }
      return fsRealpath(path);
    },
  }, missing);
  assert.equal(identity, join(await fsRealpath(root), "missing", "skills"));
});

test("canonical path identity maps a non-directory ancestor to a stable permission error", async () => {
  const target = join("/", `.cpwb-skill-identity-file-${randomUUID()}`, "skills");
  const error = new Error(`not a directory: ${target}`);
  error.code = "ENOTDIR";
  await assert.rejects(
    () => canonicalPathIdentity({ lstat: async () => { throw error; }, realpath: fsRealpath }, target),
    (candidate) => candidate.code === SKILL_ERROR_CODES.PERMISSION_DENIED
      && !JSON.stringify(candidate).includes(target),
  );
  await assert.rejects(
    () => canonicalPathIdentity({
      lstat: async () => ({ isDirectory: () => true }),
      realpath: async () => { throw error; },
    }, target),
    (candidate) => candidate.code === SKILL_ERROR_CODES.PERMISSION_DENIED
      && !JSON.stringify(candidate).includes(target),
  );
});

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

test("project list fails closed when .dsh is a symlink and never scans its target", async (t) => {
  const root = await createTempDir("cpwb-skill-project-symlink-");
  t.after(() => removeTempDir(root));
  const projectPath = join(root, "project");
  const outside = join(root, "outside");
  await mkdir(projectPath);
  await makeBundle(join(outside, "skills"), "outside-skill", "outside-skill");
  await symlink(outside, join(projectPath, ".dsh"));

  const manager = createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(projectPath) });
  await assert.rejects(
    () => manager.list({ scope: "project", projectId: 7 }),
    (error) => error.code === SKILL_ERROR_CODES.PERMISSION_DENIED,
  );
});

test("global list fails closed when DSH_HOME is a symlink", async (t) => {
  const root = await createTempDir("cpwb-skill-dshhome-symlink-");
  t.after(() => removeTempDir(root));
  const outside = join(root, "outside");
  const dshHome = join(root, "dsh-link");
  await makeBundle(join(outside, "skills"), "outside-skill", "outside-skill");
  await symlink(outside, dshHome);
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await assert.rejects(() => manager.list({ scope: "global" }), (error) => error.code === SKILL_ERROR_CODES.PERMISSION_DENIED);
});

test("project roots remain usable beneath an ancestor symlink", async (t) => {
  const root = await createTempDir("cpwb-skill-ancestor-link-");
  t.after(() => removeTempDir(root));
  const realParent = join(root, "real-parent");
  const project = join(realParent, "project");
  await mkdir(project, { recursive: true });
  await symlink(realParent, join(root, "alias-parent"));
  const manager = createSkillManager({
    dshHome: join(root, "dsh"),
    repos: projectRepos(join(root, "alias-parent", "project")),
  });
  const catalog = await manager.list({ scope: "project", projectId: 7 });
  assert.deepEqual(catalog.items, []);
});

test("list ignores the empty disabled storage root", async (t) => {
  const root = await createTempDir("cpwb-skill-disabled-root-");
  t.after(() => removeTempDir(root));
  const skillsRoot = join(root, "dsh", "skills");
  await makeBundle(skillsRoot, "active-skill", "active-skill");
  await mkdir(join(skillsRoot, ".disabled"), { recursive: true });

  const catalog = await createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(root) })
    .list({ scope: "global" });

  assert.deepEqual(catalog.items.map(({ name }) => name), ["active-skill"]);
  assert.deepEqual(catalog.diagnostics, []);
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

test("same-scope import conflicts, confirmed replacement preserves disabled state", async (t) => {
  const root = await createTempDir("cpwb-skill-replace-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
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

test("collection import returns a no-write preview before one confirmed batch install", async (t) => {
  const root = await createTempDir("cpwb-skill-collection-preview-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  const archiveBytes = collectionArchive([
    { name: "brainstorming", description: "Explore intent first." },
    { name: "systematic-debugging", description: "Debug from evidence." },
  ]);

  await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes, sourceName: "superpowers.zip" }),
    (error) => error.code === SKILL_ERROR_CODES.COLLECTION_CONFIRMATION_REQUIRED
      && error.details.kind === "collection"
      && error.details.count === 2
      && error.details.conflictCount === 0
      && error.details.skills.every((skill) => skill.conflict === false),
  );
  await assert.rejects(() => lstat(join(dshHome, "skills")), { code: "ENOENT" });

  const result = await manager.importArchive({
    scope: "global",
    archiveBytes,
    sourceName: "superpowers.zip",
    confirmCollection: true,
  });
  assert.deepEqual({ kind: result.kind, count: result.count, replacedCount: result.replacedCount }, {
    kind: "collection",
    count: 2,
    replacedCount: 0,
  });
  assert.deepEqual(result.items.map(({ name }) => name), ["brainstorming", "systematic-debugging"]);
  assert.deepEqual((await manager.list({ scope: "global" })).items.map(({ name }) => name), ["brainstorming", "systematic-debugging"]);
});

test("collection preview marks same-scope conflicts and confirmed replacement preserves disabled state", async (t) => {
  const root = await createTempDir("cpwb-skill-collection-conflict-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await manager.importArchive({ scope: "global", archiveBytes: archive("brainstorming", "old"), sourceName: "old.zip" });
  await manager.setEnabled({ scope: "global", name: "brainstorming", enabled: false });
  const archiveBytes = collectionArchive([
    { name: "brainstorming", description: "new" },
    { name: "systematic-debugging", description: "fresh" },
  ]);

  await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes, sourceName: "superpowers.zip" }),
    (error) => error.code === SKILL_ERROR_CODES.COLLECTION_CONFIRMATION_REQUIRED
      && error.details.conflictCount === 1
      && error.details.skills.find((skill) => skill.name === "brainstorming")?.existing?.state === "disabled",
  );
  await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes, sourceName: "superpowers.zip", confirmCollection: true }),
    (error) => error.code === SKILL_ERROR_CODES.COLLECTION_CONFIRMATION_REQUIRED,
  );

  const result = await manager.importArchive({
    scope: "global",
    archiveBytes,
    sourceName: "superpowers.zip",
    confirmCollection: true,
    replace: true,
  });
  assert.equal(result.replacedCount, 1);
  assert.equal(result.items.find((item) => item.name === "brainstorming").state, "disabled");
  assert.equal(await readFile(join(dshHome, "skills", ".disabled", "brainstorming", "references", "value.md"), "utf8"), "new");
});

test("collection import rolls every Skill back when a later install rename fails", async (t) => {
  const root = await createTempDir("cpwb-skill-collection-rollback-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const fileOps = {
    rename: async (source, destination) => {
      if (destination === join(skillsRoot, "systematic-debugging") && basename(source) === "systematic-debugging") {
        const error = new Error("injected collection rename failure");
        error.code = "EIO";
        throw error;
      }
      return fsRename(source, destination);
    },
  };
  const manager = createSkillManager({ dshHome, repos: projectRepos(root), fileOps });
  const archiveBytes = collectionArchive([
    { name: "brainstorming" },
    { name: "systematic-debugging" },
  ]);

  await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes, sourceName: "superpowers.zip", confirmCollection: true }),
    { code: "EIO" },
  );
  await assert.rejects(() => lstat(join(skillsRoot, "brainstorming")), { code: "ENOENT" });
  await assert.rejects(() => lstat(join(skillsRoot, "systematic-debugging")), { code: "ENOENT" });
  assert.deepEqual(await readdir(join(skillsRoot, ".transactions")), []);
});

test("collection import removes target staging when batch preparation fails", async (t) => {
  const root = await createTempDir("cpwb-skill-collection-prepare-failure-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: {
      writeFile: async (path, ...args) => {
        if (path.includes(".staging") && path.endsWith(join("systematic-debugging", "SKILL.md"))) {
          const error = new Error("injected staging write failure");
          error.code = "EIO";
          throw error;
        }
        return writeFile(path, ...args);
      },
    },
  });
  const archiveBytes = collectionArchive([{ name: "brainstorming" }, { name: "systematic-debugging" }]);

  await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes, sourceName: "superpowers.zip", confirmCollection: true }),
    { code: "EIO" },
  );
  assert.deepEqual(await readdir(join(skillsRoot, ".staging")), []);
  await assert.rejects(() => lstat(join(skillsRoot, "brainstorming")), { code: "ENOENT" });
});

test("enable, disable, and delete affect only the exact canonical target", async (t) => {
  const root = await createTempDir("cpwb-skill-lifecycle-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await manager.importArchive({ scope: "global", archiveBytes: archive("target-skill", "target"), sourceName: "target.zip" });
  await manager.importArchive({ scope: "global", archiveBytes: archive("sibling-skill", "sibling"), sourceName: "sibling.zip" });
  assert.equal((await manager.setEnabled({ scope: "global", name: "target-skill", enabled: false })).state, "disabled");
  assert.equal((await manager.setEnabled({ scope: "global", name: "target-skill", enabled: true })).state, "enabled");
  await manager.remove({ scope: "global", name: "target-skill" });
  assert.equal((await manager.list({ scope: "global" })).items.some((item) => item.name === "target-skill"), false);
  assert.equal((await manager.list({ scope: "global" })).items.some((item) => item.name === "sibling-skill"), true);
  assert.equal(await readFile(join(dshHome, "skills", "sibling-skill", "SKILL.md"), "utf8").then(Boolean), true);
});

test("replacement rolls back the previous directory after an incoming rename failure", async (t) => {
  const root = await createTempDir("cpwb-skill-rollback-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const finalPath = join(skillsRoot, "rollback-me");
  let failIncoming = false;
  const fileOps = {
    rename: async (source, destination) => {
      if (failIncoming && basename(source) === "incoming" && destination === finalPath) {
        const error = new Error("injected incoming rename failure");
        error.code = "EIO";
        throw error;
      }
      return fsRename(source, destination);
    },
  };
  const manager = createSkillManager({ dshHome, repos: projectRepos(root), fileOps });
  await manager.importArchive({ scope: "global", archiveBytes: archive("rollback-me", "old"), sourceName: "old.zip" });
  failIncoming = true;
  await assert.rejects(() => manager.importArchive({ scope: "global", archiveBytes: archive("rollback-me", "new"), sourceName: "new.zip", replace: true }), { code: "EIO" });
  assert.equal(await readFile(join(finalPath, "SKILL.md"), "utf8"), markdown("rollback-me", "old"));
  assert.deepEqual(await readdir(join(skillsRoot, ".transactions")), []);
});

test("replacement rolls back when post-rename verification fails", async (t) => {
  const root = await createTempDir("cpwb-skill-verify-rollback-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const finalPath = join(dshHome, "skills", "verify-me");
  let readCount = 0;
  const fileOps = {
    readFile: async (path, ...args) => {
      readCount += 1;
      if (readCount >= 6 && path === join(finalPath, "SKILL.md")) {
        const error = new Error("injected verification failure");
        error.code = "EIO";
        throw error;
      }
      return readFile(path, ...args);
    },
  };
  const manager = createSkillManager({ dshHome, repos: projectRepos(root), fileOps });
  await manager.importArchive({ scope: "global", archiveBytes: archive("verify-me", "old"), sourceName: "old.zip" });
  await assert.rejects(() => manager.importArchive({ scope: "global", archiveBytes: archive("verify-me", "new"), sourceName: "new.zip", replace: true }), { code: "EIO" });
  assert.equal(await readFile(join(finalPath, "SKILL.md"), "utf8"), markdown("verify-me", "old"));
});

test("list recovers a committed previous directory and removes transaction residue", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const transactionId = "recovery-transaction";
  const previous = join(skillsRoot, ".staging", transactionId, "previous");
  await mkdir(previous, { recursive: true });
  await writeFile(join(previous, "SKILL.md"), markdown("recover-me", "old"));
  await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
  await writeFile(join(skillsRoot, ".transactions", `${transactionId}.json`), JSON.stringify({
    version: 1,
    id: transactionId,
    name: "recover-me",
    state: "enabled",
    finalRelative: "recover-me",
    stagingRelative: `.staging/${transactionId}/incoming`,
    previousRelative: `.staging/${transactionId}/previous`,
  }));
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  const catalog = await manager.list({ scope: "global" });
  assert.equal(catalog.items[0].name, "recover-me");
  assert.equal(await readFile(join(skillsRoot, "recover-me", "SKILL.md"), "utf8"), markdown("recover-me", "old"));
  assert.deepEqual(await readdir(join(skillsRoot, ".transactions")), []);
  await assert.rejects(() => lstat(join(skillsRoot, ".staging", transactionId)), { code: "ENOENT" });
});

test("list rolls a prepared collection transaction back as one unit", async (t) => {
  const root = await createTempDir("cpwb-skill-collection-recovery-prepared-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const id = "collection-prepared";
  await makeBundle(join(skillsRoot, ".staging", id, "previous"), "brainstorming", "brainstorming", "old");
  await makeBundle(skillsRoot, "brainstorming", "brainstorming", "new");
  await makeBundle(join(skillsRoot, ".staging", id, "incoming"), "systematic-debugging", "systematic-debugging", "fresh");
  await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
  await writeFile(join(skillsRoot, ".transactions", `${id}.json`), JSON.stringify({
    version: 2,
    kind: "collection",
    phase: "prepared",
    id,
    items: [
      { name: "brainstorming", state: "enabled", existed: true, finalRelative: "brainstorming", incomingRelative: `.staging/${id}/incoming/brainstorming`, previousRelative: `.staging/${id}/previous/brainstorming` },
      { name: "systematic-debugging", state: "enabled", existed: false, finalRelative: "systematic-debugging", incomingRelative: `.staging/${id}/incoming/systematic-debugging`, previousRelative: `.staging/${id}/previous/systematic-debugging` },
    ],
  }));

  const catalog = await createSkillManager({ dshHome, repos: projectRepos(root) }).list({ scope: "global" });
  assert.deepEqual(catalog.items.map(({ name }) => name), ["brainstorming"]);
  assert.equal(await readFile(join(skillsRoot, "brainstorming", "SKILL.md"), "utf8"), markdown("brainstorming", "old"));
  await assert.rejects(() => lstat(join(skillsRoot, "systematic-debugging")), { code: "ENOENT" });
  assert.deepEqual(await readdir(join(skillsRoot, ".transactions")), []);
});

test("list keeps every final Skill and cleans a committed collection transaction", async (t) => {
  const root = await createTempDir("cpwb-skill-collection-recovery-committed-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const id = "collection-committed";
  await makeBundle(join(skillsRoot, ".staging", id, "previous"), "brainstorming", "brainstorming", "old");
  await makeBundle(skillsRoot, "brainstorming", "brainstorming", "new");
  await makeBundle(skillsRoot, "systematic-debugging", "systematic-debugging", "fresh");
  await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
  await writeFile(join(skillsRoot, ".transactions", `${id}.json`), JSON.stringify({
    version: 2,
    kind: "collection",
    phase: "committed",
    id,
    items: [
      { name: "brainstorming", state: "enabled", existed: true, finalRelative: "brainstorming", incomingRelative: `.staging/${id}/incoming/brainstorming`, previousRelative: `.staging/${id}/previous/brainstorming` },
      { name: "systematic-debugging", state: "enabled", existed: false, finalRelative: "systematic-debugging", incomingRelative: `.staging/${id}/incoming/systematic-debugging`, previousRelative: `.staging/${id}/previous/systematic-debugging` },
    ],
  }));

  const catalog = await createSkillManager({ dshHome, repos: projectRepos(root) }).list({ scope: "global" });
  assert.deepEqual(catalog.items.map(({ name }) => name), ["brainstorming", "systematic-debugging"]);
  assert.equal(await readFile(join(skillsRoot, "brainstorming", "SKILL.md"), "utf8"), markdown("brainstorming", "new"));
  assert.deepEqual(await readdir(join(skillsRoot, ".transactions")), []);
  await assert.rejects(() => lstat(join(skillsRoot, ".staging", id)), { code: "ENOENT" });
});

test("recovery rejects a non-directory incoming entry without changing transaction evidence", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-file-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const transactionId = "recovery-file-incoming";
  const staging = join(skillsRoot, ".staging", transactionId);
  const previous = join(staging, "previous");
  const incoming = join(staging, "incoming");
  const descriptorPath = join(skillsRoot, ".transactions", `${transactionId}.json`);
  await mkdir(previous, { recursive: true });
  await writeFile(join(previous, "SKILL.md"), markdown("recover-file", "old"));
  await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
  await writeFile(incoming, "not a directory");
  await writeFile(descriptorPath, JSON.stringify({
    version: 1,
    id: transactionId,
    name: "recover-file",
    state: "enabled",
    finalRelative: "recover-file",
    stagingRelative: `.staging/${transactionId}/incoming`,
    previousRelative: `.staging/${transactionId}/previous`,
  }));

  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await assert.rejects(() => manager.list({ scope: "global" }), (error) => error.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED);
  assert.equal(await readFile(incoming, "utf8"), "not a directory");
  assert.equal(await readFile(join(previous, "SKILL.md"), "utf8"), markdown("recover-file", "old"));
  assert.equal(await readFile(descriptorPath, "utf8").then(Boolean), true);
  await assert.rejects(() => lstat(join(skillsRoot, "recover-file")), { code: "ENOENT" });
});

test("initial install removes a new directory when post-install scan fails", async (t) => {
  const root = await createTempDir("cpwb-skill-initial-rollback-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const finalPath = join(skillsRoot, "new-skill");
  let failScan = false;
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: {
      readFile: async (path, ...args) => {
        if (failScan && path === join(finalPath, "SKILL.md")) {
          const error = new Error("injected scan failure");
          error.code = "EIO";
          throw error;
        }
        return readFile(path, ...args);
      },
    },
  });
  await manager.importArchive({ scope: "global", archiveBytes: archive("sibling-skill"), sourceName: "sibling.zip" });
  failScan = true;
  await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes: archive("new-skill"), sourceName: "new.zip" }),
    (error) => error.code === "EIO",
  );
  await assert.rejects(() => lstat(finalPath), { code: "ENOENT" });
  assert.equal((await manager.list({ scope: "global" })).items[0].name, "sibling-skill");
});

test("enable and disable restore the original directory when post-move scan fails", async (t) => {
  const root = await createTempDir("cpwb-skill-state-rollback-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const enabledPath = join(skillsRoot, "state-skill");
  const disabledPath = join(skillsRoot, ".disabled", "state-skill");
  let failPath = null;
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: {
      readFile: async (path, ...args) => {
        if (path === failPath) {
          const error = new Error("injected state scan failure");
          error.code = "EIO";
          throw error;
        }
        return readFile(path, ...args);
      },
    },
  });
  await manager.importArchive({ scope: "global", archiveBytes: archive("state-skill"), sourceName: "state.zip" });
  failPath = join(disabledPath, "SKILL.md");
  await assert.rejects(() => manager.setEnabled({ scope: "global", name: "state-skill", enabled: false }), (error) => error.code === "EIO");
  assert.equal(await readFile(join(enabledPath, "SKILL.md"), "utf8").then(Boolean), true);
  failPath = null;
  await manager.setEnabled({ scope: "global", name: "state-skill", enabled: false });
  failPath = join(enabledPath, "SKILL.md");
  await assert.rejects(() => manager.setEnabled({ scope: "global", name: "state-skill", enabled: true }), (error) => error.code === "EIO");
  assert.equal(await readFile(join(disabledPath, "SKILL.md"), "utf8").then(Boolean), true);
});

test("malformed transaction descriptors return stable recovery errors and preserve evidence", async (t) => {
  for (const [index, value] of [null, [], 1, "descriptor", true].entries()) {
    const root = await createTempDir(`cpwb-skill-recovery-shape-${index}-`);
    t.after(() => removeTempDir(root));
    const skillsRoot = join(root, "dsh", "skills");
    const descriptorPath = join(skillsRoot, ".transactions", `malformed-${index}.json`);
    await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
    await writeFile(descriptorPath, JSON.stringify(value));
    const manager = createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(root) });
    await assert.rejects(
      () => manager.list({ scope: "global" }),
      (error) => error.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED,
    );
    assert.equal(await readFile(descriptorPath, "utf8"), JSON.stringify(value));
  }
  const root = await createTempDir("cpwb-skill-recovery-malformed-object-");
  t.after(() => removeTempDir(root));
  const skillsRoot = join(root, "dsh", "skills");
  const descriptorPath = join(skillsRoot, ".transactions", "malformed-object.json");
  const value = {
    version: 1,
    id: "malformed-object",
    name: "malformed-object",
    state: "enabled",
    finalRelative: null,
    stagingRelative: ".staging/malformed-object/incoming",
    previousRelative: ".staging/malformed-object/previous",
  };
  await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
  await writeFile(descriptorPath, JSON.stringify(value));
  const manager = createSkillManager({ dshHome: join(root, "dsh"), repos: projectRepos(root) });
  await assert.rejects(() => manager.list({ scope: "global" }), (error) => error.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED);
  assert.equal(await readFile(descriptorPath, "utf8"), JSON.stringify(value));
});

test("ambiguous enabled and disabled state rejects every lifecycle mutation", async (t) => {
  const root = await createTempDir("cpwb-skill-ambiguous-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  await makeBundle(skillsRoot, "ambiguous", "ambiguous", "enabled");
  await makeBundle(join(skillsRoot, ".disabled"), "ambiguous", "ambiguous", "disabled");
  const revealPath = async () => { throw new Error("reveal must not run"); };
  const manager = createSkillManager({ dshHome, repos: projectRepos(root), revealPath });
  const calls = [
    () => manager.importArchive({ scope: "global", archiveBytes: archive("ambiguous", "incoming"), sourceName: "incoming.zip", replace: true }),
    () => manager.setEnabled({ scope: "global", name: "ambiguous", enabled: true }),
    () => manager.setEnabled({ scope: "global", name: "ambiguous", enabled: false }),
    () => manager.remove({ scope: "global", name: "ambiguous" }),
    () => manager.reveal({ scope: "global", name: "ambiguous" }),
  ];
  for (const call of calls) await assert.rejects(call, (error) => error.code === "SKILL_STATE_CONFLICT");
  assert.equal(await readFile(join(skillsRoot, "ambiguous", "SKILL.md"), "utf8"), markdown("ambiguous", "enabled"));
  assert.equal(await readFile(join(skillsRoot, ".disabled", "ambiguous", "SKILL.md"), "utf8"), markdown("ambiguous", "disabled"));
});

test("same name can be imported into global and project scopes independently", async (t) => {
  const root = await createTempDir("cpwb-skill-scope-isolation-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const projectPath = join(root, "project");
  await mkdir(projectPath, { recursive: true });
  const manager = createSkillManager({ dshHome, repos: projectRepos(projectPath) });
  const globalItem = await manager.importArchive({ scope: "global", archiveBytes: archive("same-skill", "global"), sourceName: "global.zip" });
  const projectItem = await manager.importArchive({ scope: "project", projectId: 7, archiveBytes: archive("same-skill", "project"), sourceName: "project.zip" });
  assert.equal(globalItem.state, "enabled");
  assert.equal(projectItem.state, "enabled");
  assert.equal(await readFile(join(dshHome, "skills", "same-skill", "SKILL.md"), "utf8").then(Boolean), true);
  assert.equal(await readFile(join(projectPath, ".dsh", "skills", "same-skill", "SKILL.md"), "utf8").then(Boolean), true);
  assert.equal((await manager.list({ scope: "project", projectId: 7 })).items[0].shadowsGlobal, true);
});

test("reveal opens the exact enabled skill path", async (t) => {
  const root = await createTempDir("cpwb-skill-reveal-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const revealed = [];
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    revealPath: async (path) => revealed.push(path),
  });
  await manager.importArchive({ scope: "global", archiveBytes: archive("reveal-me", "reveal"), sourceName: "reveal.zip" });
  await manager.reveal({ scope: "global", name: "reveal-me" });
  assert.deepEqual(revealed, [join(dshHome, "skills", "reveal-me")]);
});

test("import preserves binary skill resources byte-for-byte", async (t) => {
  const root = await createTempDir("cpwb-skill-binary-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const bytes = Uint8Array.from([0, 255, 1, 128, 34, 10]);
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await manager.importArchive({
    scope: "global",
    archiveBytes: zipSync({ "SKILL.md": strToU8(markdown("binary-skill")), "assets/data.bin": bytes }),
    sourceName: "binary.zip",
  });
  assert.deepEqual(
    await readFile(join(dshHome, "skills", "binary-skill", "assets", "data.bin")),
    Buffer.from(bytes),
  );
});

test("mutation write failures map to a safe permission error", async (t) => {
  const root = await createTempDir("cpwb-skill-mutation-permission-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: {
      mkdir: async () => {
        const error = new Error("secret /private/path");
        error.code = "EACCES";
        throw error;
      },
    },
  });
  const error = await assert.rejects(
    () => manager.importArchive({ scope: "global", archiveBytes: archive("permission-me"), sourceName: "permission.zip" }),
    (candidate) => candidate.code === SKILL_ERROR_CODES.PERMISSION_DENIED
      && !JSON.stringify(candidate.details ?? {}).includes("/private/path"),
  );
  assert.equal(error, undefined);
});

test("import refuses a project skills path with a symlinked ancestor", async (t) => {
  const root = await createTempDir("cpwb-skill-root-link-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const projectPath = join(root, "project");
  const outside = join(root, "outside");
  await mkdir(projectPath, { recursive: true });
  await mkdir(outside, { recursive: true });
  await symlink(outside, join(projectPath, ".dsh"));
  const manager = createSkillManager({ dshHome, repos: projectRepos(projectPath) });
  await assert.rejects(
    () => manager.importArchive({ scope: "project", projectId: 7, archiveBytes: archive("linked-root"), sourceName: "linked.zip" }),
    (error) => error.code === SKILL_ERROR_CODES.PERMISSION_DENIED,
  );
  await assert.rejects(() => lstat(join(outside, "skills")), { code: "ENOENT" });
});

test("lifecycle mutations refuse symlinked internal skill directories", async (t) => {
  const root = await createTempDir("cpwb-skill-internal-link-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const outside = join(root, "outside");
  await mkdir(join(skillsRoot, "safe-skill"), { recursive: true });
  await writeFile(join(skillsRoot, "safe-skill", "SKILL.md"), markdown("safe-skill"));
  await mkdir(outside, { recursive: true });
  await symlink(outside, join(skillsRoot, ".disabled"));
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await assert.rejects(
    () => manager.setEnabled({ scope: "global", name: "safe-skill", enabled: false }),
    (error) => error.code === SKILL_ERROR_CODES.PERMISSION_DENIED,
  );
  await assert.rejects(() => lstat(join(outside, "safe-skill")), { code: "ENOENT" });
  assert.equal(await readFile(join(skillsRoot, "safe-skill", "SKILL.md"), "utf8"), markdown("safe-skill"));
});

test("lifecycle mutations refuse ordinary-file internal skill paths", async (t) => {
  const root = await createTempDir("cpwb-skill-internal-file-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  await makeBundle(skillsRoot, "safe-skill", "safe-skill");
  await writeFile(join(skillsRoot, ".disabled"), "occupied");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  const error = await assert.rejects(
    () => manager.setEnabled({ scope: "global", name: "safe-skill", enabled: false }),
    (candidate) => candidate.code === SKILL_ERROR_CODES.PERMISSION_DENIED
      && !JSON.stringify(candidate).includes(root),
  );
  assert.equal(error, undefined);
  assert.equal(await readFile(join(skillsRoot, "safe-skill", "SKILL.md"), "utf8"), markdown("safe-skill"));
});

async function writeTransactionFixture(skillsRoot, id, name, state, previous = true) {
  const previousPath = join(skillsRoot, ".staging", id, "previous");
  if (previous) {
    await mkdir(previousPath, { recursive: true });
    await writeFile(join(previousPath, "SKILL.md"), markdown(name, "old"));
  }
  await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
  await writeFile(join(skillsRoot, ".transactions", `${id}.json`), JSON.stringify({
    version: 1,
    id,
    name,
    state,
    finalRelative: state === "disabled" ? `.disabled/${name}` : name,
    stagingRelative: `.staging/${id}/incoming`,
    previousRelative: `.staging/${id}/previous`,
  }));
}

test("recovery accepts the POSIX disabled transaction path", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-disabled-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  await writeTransactionFixture(skillsRoot, "disabled-recovery", "disabled-recovery", "disabled");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  const catalog = await manager.list({ scope: "global" });
  assert.equal(catalog.items[0].state, "disabled");
  assert.equal(await readFile(join(skillsRoot, ".disabled", "disabled-recovery", "SKILL.md"), "utf8"), markdown("disabled-recovery", "old"));
});

test("recovery refuses symlinked disabled and staging transaction paths", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-links-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const outside = join(root, "outside");
  await mkdir(outside, { recursive: true });
  await mkdir(join(skillsRoot, ".staging", "disabled-link"), { recursive: true });
  await symlink(outside, join(skillsRoot, ".disabled"));
  await writeTransactionFixture(skillsRoot, "disabled-link", "recover-disabled", "disabled");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await assert.rejects(() => manager.list({ scope: "global" }), (error) => error.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED);
  await assert.rejects(() => lstat(join(outside, "recover-disabled")), { code: "ENOENT" });

  await rm(join(skillsRoot, ".disabled"), { recursive: true, force: true });
  const stagingLink = join(skillsRoot, ".staging", "staging-link");
  await rm(stagingLink, { recursive: true, force: true });
  await symlink(outside, stagingLink);
  await writeTransactionFixture(skillsRoot, "staging-link", "recover-staging", "enabled", false);
  await assert.rejects(() => manager.list({ scope: "global" }), (error) => error.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED);
  await assert.rejects(() => lstat(join(outside, "recover-staging")), { code: "ENOENT" });
});

test("recovery refuses ordinary-file disabled and staging transaction paths", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-files-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  await mkdir(join(skillsRoot, ".staging"), { recursive: true });
  await writeFile(join(skillsRoot, ".disabled"), "occupied");
  await writeTransactionFixture(skillsRoot, "disabled-file", "recover-disabled-file", "enabled");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  const disabledError = await assert.rejects(
    () => manager.list({ scope: "global" }),
    (candidate) => candidate.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED
      && !JSON.stringify(candidate).includes(root),
  );
  assert.equal(disabledError, undefined);
  await lstat(join(skillsRoot, ".transactions", "disabled-file.json"));

  await rm(join(skillsRoot, ".disabled"));
  await rm(join(skillsRoot, ".transactions", "disabled-file.json"));
  await rm(join(skillsRoot, ".staging"), { recursive: true, force: true });
  await writeFile(join(skillsRoot, ".staging"), "occupied");
  await mkdir(join(skillsRoot, ".transactions"), { recursive: true });
  await writeFile(join(skillsRoot, ".transactions", "staging-file.json"), JSON.stringify({
    version: 1,
    id: "staging-file",
    name: "recover-staging-file",
    state: "enabled",
    finalRelative: "recover-staging-file",
    stagingRelative: ".staging/staging-file/incoming",
    previousRelative: ".staging/staging-file/previous",
  }));
  const stagingError = await assert.rejects(
    () => manager.list({ scope: "global" }),
    (candidate) => candidate.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED
      && !JSON.stringify(candidate).includes(root),
  );
  assert.equal(stagingError, undefined);
  await lstat(join(skillsRoot, ".transactions", "staging-file.json"));
});

test("concurrent managers deduplicate recovery for one root", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-concurrent-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  await writeTransactionFixture(skillsRoot, "concurrent-recovery", "recover-concurrent", "enabled");
  const delayedOps = {
    rename: async (...args) => {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
      return fsRename(...args);
    },
  };
  const first = createSkillManager({ dshHome, repos: projectRepos(root), fileOps: delayedOps });
  const second = createSkillManager({ dshHome, repos: projectRepos(root), fileOps: delayedOps });
  const results = await Promise.allSettled([
    first.list({ scope: "global" }),
    second.list({ scope: "global" }),
  ]);
  assert.deepEqual(results.map((result) => result.status), ["fulfilled", "fulfilled"]);
  assert.equal(results[0].value.items[0].name, "recover-concurrent");
  assert.equal(results[1].value.items[0].name, "recover-concurrent");
});

test("parent symlink aliases share recovery identity and both lists succeed", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-alias-");
  t.after(() => removeTempDir(root));
  const realParent = join(root, "real-parent");
  const aliasParent = join(root, "alias-parent");
  const realDshHome = join(realParent, "dsh");
  const aliasDshHome = join(aliasParent, "dsh");
  await mkdir(realDshHome, { recursive: true });
  await symlink(realParent, aliasParent);
  await writeTransactionFixture(join(realDshHome, "skills"), "alias-recovery", "recover-alias", "enabled");
  const delayedOps = {
    rename: async (...args) => {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 10));
      return fsRename(...args);
    },
  };
  const first = createSkillManager({ dshHome: realDshHome, repos: projectRepos(root), fileOps: delayedOps });
  const second = createSkillManager({ dshHome: aliasDshHome, repos: projectRepos(root), fileOps: delayedOps });
  const results = await Promise.allSettled([
    first.list({ scope: "global" }),
    second.list({ scope: "global" }),
  ]);
  assert.deepEqual(results.map((result) => result.status), ["fulfilled", "fulfilled"]);
  assert.deepEqual(results.map((result) => result.value.items.map(({ name }) => name)), [["recover-alias"], ["recover-alias"]]);
  assert.ok(results.every((result) => !result.reason));
});

test("a second manager does not recover a live transaction from the first manager", async (t) => {
  const root = await createTempDir("cpwb-skill-live-transaction-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  const finalPath = join(skillsRoot, "live-transaction");
  let startedResolve;
  let releaseResolve;
  const started = new Promise((resolvePromise) => { startedResolve = resolvePromise; });
  const paused = new Promise((resolvePromise) => { releaseResolve = resolvePromise; });
  const managerOne = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: {
      rename: async (source, destination) => {
        if (source === finalPath && basename(destination) === "previous") {
          startedResolve();
          await paused;
        }
        return fsRename(source, destination);
      },
    },
  });
  await managerOne.importArchive({ scope: "global", archiveBytes: archive("live-transaction", "old"), sourceName: "old.zip" });
  const replacement = managerOne.importArchive({ scope: "global", archiveBytes: archive("live-transaction", "new"), sourceName: "new.zip", replace: true });
  await started;
  const managerTwo = createSkillManager({ dshHome, repos: projectRepos(root) });
  await managerTwo.list({ scope: "global" });
  const transactionFiles = await readdir(join(skillsRoot, ".transactions"));
  assert.equal(transactionFiles.length, 1);
  releaseResolve();
  await replacement;
});

test("a parent-symlink alias does not recover another manager's live transaction", async (t) => {
  const root = await createTempDir("cpwb-skill-live-alias-");
  t.after(() => removeTempDir(root));
  const realParent = join(root, "real-parent");
  const aliasParent = join(root, "alias-parent");
  const realDshHome = join(realParent, "dsh");
  const aliasDshHome = join(aliasParent, "dsh");
  const finalPath = join(realDshHome, "skills", "live-alias");
  await mkdir(realDshHome, { recursive: true });
  await symlink(realParent, aliasParent);
  let startedResolve;
  let releaseResolve;
  const started = new Promise((resolvePromise) => { startedResolve = resolvePromise; });
  const paused = new Promise((resolvePromise) => { releaseResolve = resolvePromise; });
  const managerOne = createSkillManager({
    dshHome: realDshHome,
    repos: projectRepos(root),
    fileOps: {
      rename: async (source, destination) => {
        if (source === finalPath && basename(destination) === "previous") {
          startedResolve();
          await paused;
        }
        return fsRename(source, destination);
      },
    },
  });
  await managerOne.importArchive({ scope: "global", archiveBytes: archive("live-alias", "old"), sourceName: "old.zip" });
  const replacement = managerOne.importArchive({ scope: "global", archiveBytes: archive("live-alias", "new"), sourceName: "new.zip", replace: true });
  await started;
  const managerTwo = createSkillManager({ dshHome: aliasDshHome, repos: projectRepos(root) });
  await managerTwo.list({ scope: "global" });
  assert.equal((await readdir(join(realDshHome, "skills", ".transactions"))).length, 1);
  releaseResolve();
  await replacement;
});

test("same-name mutations through parent-symlink aliases are serialized", async (t) => {
  const root = await createTempDir("cpwb-skill-mutation-alias-");
  t.after(() => removeTempDir(root));
  const realParent = join(root, "real-parent");
  const aliasParent = join(root, "alias-parent");
  const realDshHome = join(realParent, "dsh");
  const aliasDshHome = join(aliasParent, "dsh");
  const aliasSkillsRoot = join(aliasDshHome, "skills");
  const finalPath = join(realDshHome, "skills", "serialized-alias");
  const disabledPath = join(realDshHome, "skills", ".disabled", "serialized-alias");
  await mkdir(realDshHome, { recursive: true });
  await symlink(realParent, aliasParent);
  let firstStartedResolve;
  let releaseResolve;
  const firstStarted = new Promise((resolvePromise) => { firstStartedResolve = resolvePromise; });
  const paused = new Promise((resolvePromise) => { releaseResolve = resolvePromise; });
  let secondResolved = false;
  let secondEnteredMutation = false;
  const sharedOps = {
    mkdir: async (...args) => {
      if (secondResolved) secondEnteredMutation = true;
      return mkdir(...args);
    },
    realpath: async (path) => {
      if (path === aliasSkillsRoot) secondResolved = true;
      return fsRealpath(path);
    },
    rename: async (source, destination) => {
      if (source === finalPath && destination === disabledPath) {
        firstStartedResolve();
        await paused;
      }
      return fsRename(source, destination);
    },
  };
  const managerOne = createSkillManager({ dshHome: realDshHome, repos: projectRepos(root), fileOps: sharedOps });
  const managerTwo = createSkillManager({ dshHome: aliasDshHome, repos: projectRepos(root), fileOps: sharedOps });
  await managerOne.importArchive({ scope: "global", archiveBytes: archive("serialized-alias", "old"), sourceName: "old.zip" });
  const first = managerOne.setEnabled({ scope: "global", name: "serialized-alias", enabled: false });
  await firstStarted;
  const second = managerTwo.setEnabled({ scope: "global", name: "serialized-alias", enabled: false });
  while (!secondResolved) await new Promise((resolvePromise) => setTimeout(resolvePromise, 1));
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 15));
  assert.equal(secondEnteredMutation, false);
  releaseResolve();
  await Promise.all([first, second]);
});

test("recovery rejects an alternate enabled or disabled final state", async (t) => {
  const root = await createTempDir("cpwb-skill-recovery-state-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const skillsRoot = join(dshHome, "skills");
  await makeBundle(skillsRoot, "recover-state", "recover-state", "enabled");
  await makeBundle(join(skillsRoot, ".disabled"), "recover-state", "recover-state", "disabled");
  await writeTransactionFixture(skillsRoot, "state-recovery", "recover-state", "enabled");
  const manager = createSkillManager({ dshHome, repos: projectRepos(root) });
  await assert.rejects(() => manager.list({ scope: "global" }), (error) => error.code === SKILL_ERROR_CODES.RECOVERY_REQUIRED);
  assert.equal(await readFile(join(skillsRoot, "recover-state", "SKILL.md"), "utf8"), markdown("recover-state", "enabled"));
  assert.equal(await readFile(join(skillsRoot, ".disabled", "recover-state", "SKILL.md"), "utf8"), markdown("recover-state", "disabled"));
  await lstat(join(skillsRoot, ".staging", "state-recovery", "previous"));
  await lstat(join(skillsRoot, ".transactions", "state-recovery.json"));
});

test("manager import routes temporary directory lifecycle through fileOps", async (t) => {
  const root = await createTempDir("cpwb-skill-fileops-temp-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const calls = { mkdtemp: 0, realpath: 0, rm: 0 };
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: {
      mkdtemp: async (...args) => { calls.mkdtemp += 1; return fsMkdtemp(...args); },
      realpath: async (...args) => { calls.realpath += 1; return fsRealpath(...args); },
      rm: async (...args) => { calls.rm += 1; return rm(...args); },
    },
  });
  await manager.importArchive({ scope: "global", archiveBytes: archive("temp-seam"), sourceName: "temp.zip" });
  assert.equal(calls.mkdtemp, 1);
  assert.equal(calls.realpath, 2);
  assert.equal(calls.rm >= 1, true);
});

test("transaction syncing tolerates a file handle without sync", async (t) => {
  const root = await createTempDir("cpwb-skill-sync-seam-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: { open: async () => ({ close: async () => {} }) },
  });
  await manager.importArchive({ scope: "global", archiveBytes: archive("sync-seam", "old"), sourceName: "old.zip" });
  const replaced = await manager.importArchive({ scope: "global", archiveBytes: archive("sync-seam", "new"), sourceName: "new.zip", replace: true });
  assert.equal(replaced.description, "new");
});

test("transaction syncing tolerates a missing file handle", async (t) => {
  const root = await createTempDir("cpwb-skill-sync-missing-handle-");
  t.after(() => removeTempDir(root));
  const dshHome = join(root, "dsh");
  const manager = createSkillManager({
    dshHome,
    repos: projectRepos(root),
    fileOps: { open: async () => null },
  });
  await manager.importArchive({ scope: "global", archiveBytes: archive("sync-missing", "old"), sourceName: "old.zip" });
  const replaced = await manager.importArchive({ scope: "global", archiveBytes: archive("sync-missing", "new"), sourceName: "new.zip", replace: true });
  assert.equal(replaced.description, "new");
});
