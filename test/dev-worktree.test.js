import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const guardScript = resolve(repoRoot, "scripts/dev-worktree.mjs");

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function replaceLink(target, link) {
  rmSync(link, { recursive: true, force: true });
  mkdirSync(dirname(link), { recursive: true });
  symlinkSync(target, link);
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "cpwb-worktree-guard-"));
  const primary = join(root, "repo");
  const active = join(root, "active");
  const globalRoot = join(root, "global", "lib", "node_modules");
  const globalPrefix = join(root, "global");
  const dshHome = join(root, "dsh-home");
  const fakeBin = join(root, "fake-bin");
  const commandLog = join(root, "npm.log");
  const packageLink = join(globalRoot, "dsh-cyberpunk-workbench");
  const binaryLink = join(globalPrefix, "bin", "dsh-workbench");
  const profileLink = join(dshHome, "profiles", "web", "node_modules", "dsh-cyberpunk-workbench");

  mkdirSync(primary, { recursive: true });
  git(primary, "init", "-b", "main");
  mkdirSync(join(primary, "bin"), { recursive: true });
  mkdirSync(join(primary, "scripts"), { recursive: true });
  writeFileSync(join(primary, "package.json"), JSON.stringify({ name: "dsh-cyberpunk-workbench" }));
  writeFileSync(join(primary, "bin", "dsh-workbench.js"), "#!/usr/bin/env node\n");
  writeFileSync(join(primary, "scripts", "install.sh"), `#!/usr/bin/env bash
set -euo pipefail
link="$DSH_HOME/profiles/web/node_modules/dsh-cyberpunk-workbench"
mkdir -p "$(dirname "$link")"
ln -sfn "$PWD" "$link"
`);
  git(primary, "add", ".");
  git(primary, "-c", "user.name=Workbench Test", "-c", "user.email=test@example.invalid", "commit", "-m", "fixture");
  git(primary, "worktree", "add", "-b", "feat/active", active);

  mkdirSync(fakeBin, { recursive: true });
  const fakeNpm = join(fakeBin, "npm");
  writeFileSync(fakeNpm, `#!/usr/bin/env bash
set -euo pipefail
printf '%s\\n' "$*" >> "$CPWB_TEST_COMMAND_LOG"
case "\${1:-}" in
  root) printf '%s\\n' "$CPWB_TEST_NPM_ROOT" ;;
  prefix) printf '%s\\n' "$CPWB_TEST_NPM_PREFIX" ;;
  run) exit 0 ;;
  link)
    mkdir -p "$CPWB_TEST_NPM_ROOT" "$CPWB_TEST_NPM_PREFIX/bin"
    ln -sfn "$PWD" "$CPWB_TEST_NPM_ROOT/dsh-cyberpunk-workbench"
    ln -sfn "$PWD/bin/dsh-workbench.js" "$CPWB_TEST_NPM_PREFIX/bin/dsh-workbench"
    ;;
  *) exit 2 ;;
esac
`);
  chmodSync(fakeNpm, 0o755);

  const env = {
    ...process.env,
    PATH: [join(globalPrefix, "bin"), fakeBin, process.env.PATH].join(delimiter),
    DSH_HOME: dshHome,
    CPWB_TEST_COMMAND_LOG: commandLog,
    CPWB_TEST_NPM_ROOT: globalRoot,
    CPWB_TEST_NPM_PREFIX: globalPrefix,
  };

  return {
    root, primary, active, globalRoot, globalPrefix, dshHome, commandLog,
    packageLink, binaryLink, profileLink, env,
    linkCurrent() {
      replaceLink(active, packageLink);
      replaceLink(join(active, "bin", "dsh-workbench.js"), binaryLink);
      replaceLink(active, profileLink);
    },
    run(command) {
      return spawnSync(process.execPath, [guardScript, command], { cwd: active, env, encoding: "utf8" });
    },
    cleanup() { rmSync(root, { recursive: true, force: true }); },
  };
}

test("dev:doctor rejects a global command and DSH profile linked to another checkout", (t) => {
  const f = fixture();
  t.after(f.cleanup);
  replaceLink(f.primary, f.packageLink);
  replaceLink(join(f.primary, "bin", "dsh-workbench.js"), f.binaryLink);
  replaceLink(f.primary, f.profileLink);

  const result = f.run("doctor");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not point to the current worktree/i);
  assert.match(result.stderr, /npm run dev:activate/i);
});

test("dev:doctor rejects another dirty linked worktree", (t) => {
  const f = fixture();
  t.after(f.cleanup);
  f.linkCurrent();
  const other = join(f.root, "other");
  git(f.primary, "worktree", "add", "-b", "feat/other", other);
  writeFileSync(join(other, "uncommitted.txt"), "dirty\n");

  const result = f.run("doctor");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /other worktree has uncommitted changes/i);
  assert.match(result.stderr, /feat\/other/);
});

test("premerge rejects uncommitted changes in the current worktree before running checks", (t) => {
  const f = fixture();
  t.after(f.cleanup);
  f.linkCurrent();
  writeFileSync(join(f.active, "draft.txt"), "dirty\n");

  const result = f.run("premerge");

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /current worktree must be clean before merge/i);
  assert.equal(readFileSync(f.commandLog, "utf8"), "root -g\nprefix -g\n");
});

test("dev:activate builds and repoints both launch paths to the current worktree", (t) => {
  const f = fixture();
  t.after(f.cleanup);
  replaceLink(f.primary, f.packageLink);
  replaceLink(join(f.primary, "bin", "dsh-workbench.js"), f.binaryLink);
  replaceLink(f.primary, f.profileLink);

  const result = f.run("activate");

  assert.equal(result.status, 0, result.stderr);
  assert.equal(realpathSync(f.packageLink), realpathSync(f.active));
  assert.equal(realpathSync(f.binaryLink), realpathSync(join(f.active, "bin", "dsh-workbench.js")));
  assert.equal(realpathSync(f.profileLink), realpathSync(f.active));
  assert.match(readFileSync(f.commandLog, "utf8"), /^run build\nlink --no-audit --no-fund\nroot -g\nprefix -g\n$/);
  assert.match(result.stdout, /WORKTREE ACTIVE/);
});

test("premerge runs the full repository check after all guards pass", (t) => {
  const f = fixture();
  t.after(f.cleanup);
  f.linkCurrent();

  const result = f.run("premerge");

  assert.equal(result.status, 0, result.stderr);
  assert.match(readFileSync(f.commandLog, "utf8"), /run check/);
  assert.match(result.stdout, /PREMERGE OK/);
});
