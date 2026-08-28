import { test } from "node:test";
import assert from "node:assert/strict";
import { chmod, lstat, mkdir, readFile, readdir, rename as fsRename, rm, symlink, writeFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
import { strToU8, zipSync } from "fflate";

import { createTempDir, removeTempDir } from "./helpers.js";
import { SKILL_ERROR_CODES } from "../src/host/skill-package.js";
import { createSkillManager } from "../src/host/skill-manager.js";

const markdown = (name, description = name) => `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`;
const archive = (name, description = name) => zipSync({
  "SKILL.md": strToU8(markdown(name, description)),
  "references/value.md": strToU8(description),
});

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
      if (failIncoming && source.endsWith("/incoming") && destination === finalPath) {
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
