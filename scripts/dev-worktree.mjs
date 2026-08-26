#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { lstatSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const PACKAGE_NAME = "dsh-cyberpunk-workbench";
const BRANCH_PATTERN = /^(feat|fix|refactor|chore|docs)\//;

function command(file, args, { cwd, env = process.env, inherit = false } = {}) {
  return execFileSync(file, args, {
    cwd,
    env,
    encoding: "utf8",
    stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  })?.trim() || "";
}

function git(args, cwd) {
  return command("git", args, { cwd });
}

function parseWorktrees(source) {
  return source.trim().split(/\n\n+/).filter(Boolean).map((block) => {
    const item = {};
    for (const line of block.split("\n")) {
      const space = line.indexOf(" ");
      if (space === -1) item[line] = true;
      else item[line.slice(0, space)] = line.slice(space + 1);
    }
    return item;
  });
}

function canonical(path) {
  try { return realpathSync.native(path); }
  catch { return null; }
}

function branchName(item) {
  return item.branch?.replace(/^refs\/heads\//, "") || "detached";
}

function assertLink(path, expected, label) {
  let kind;
  try { kind = lstatSync(path); }
  catch { throw new Error(`${label} is missing: ${path}. Run npm run dev:activate.`); }
  if (!kind.isSymbolicLink()) throw new Error(`${label} is not a development symlink: ${path}. Run npm run dev:activate.`);
  const actual = canonical(path);
  if (actual !== expected) {
    throw new Error(`${label} does not point to the current worktree. Expected ${expected}, got ${actual || "unresolved"}. Run npm run dev:activate.`);
  }
}

function worktreeState({ cwd = process.cwd(), env = process.env, checkLinks = true, requireCleanCurrent = false } = {}) {
  const root = canonical(git(["rev-parse", "--show-toplevel"], cwd));
  if (!root) throw new Error("current directory is not a Git repository");
  const branch = git(["branch", "--show-current"], root);
  if (!branch || branch === "main" || branch === "master" || !BRANCH_PATTERN.test(branch)) {
    throw new Error(`development must run from a registered non-main feature worktree; current branch: ${branch || "detached"}`);
  }

  const worktrees = parseWorktrees(git(["worktree", "list", "--porcelain"], root));
  const current = worktrees.find((item) => canonical(item.worktree) === root);
  const primary = worktrees[0];
  if (!current || !primary || canonical(primary.worktree) === root) {
    throw new Error("development must run from a registered linked worktree, not the primary checkout");
  }
  if (!["main", "master"].includes(branchName(primary))) {
    throw new Error(`primary checkout must stay on main or master; current branch: ${branchName(primary)}`);
  }
  const primaryChanges = git(["status", "--porcelain=v1"], primary.worktree);
  if (primaryChanges) throw new Error(`primary checkout has uncommitted changes: ${primary.worktree}`);

  for (const item of worktrees) {
    const path = canonical(item.worktree);
    if (!path || path === root || path === canonical(primary.worktree)) continue;
    const changes = git(["status", "--porcelain=v1"], path);
    if (changes) throw new Error(`other worktree has uncommitted changes: ${branchName(item)} at ${path}`);
  }

  let links = null;
  if (checkLinks) {
    const npmRoot = command("npm", ["root", "-g"], { cwd: root, env });
    const npmPrefix = command("npm", ["prefix", "-g"], { cwd: root, env });
    const dshHome = env.DSH_HOME || join(homedir(), ".dsh");
    const profile = resolve(env.DSH_WEB_PROFILE || join(dshHome, "profiles", "web"));
    links = {
      package: join(npmRoot, PACKAGE_NAME),
      binary: join(npmPrefix, "bin", "dsh-workbench"),
      profile: join(profile, "node_modules", PACKAGE_NAME),
    };
    assertLink(links.package, root, "global Workbench package");
    assertLink(links.binary, join(root, "bin", "dsh-workbench.js"), "dsh-workbench command");
    assertLink(links.profile, root, "DSH web profile Workbench link");
  }

  const currentChanges = git(["status", "--porcelain=v1"], root);
  if (requireCleanCurrent && currentChanges) throw new Error("current worktree must be clean before merge");
  return { root, branch, links, dirty: currentChanges ? currentChanges.split("\n").length : 0 };
}

function printState(state, heading) {
  console.log(heading);
  console.log(`  root: ${state.root}`);
  console.log(`  branch: ${state.branch}`);
  console.log(`  current changes: ${state.dirty}`);
  if (state.links) console.log(`  profile: ${state.links.profile}`);
}

function doctor(options) {
  const state = worktreeState(options);
  printState(state, "WORKTREE OK");
}

function activate({ cwd = process.cwd(), env = process.env } = {}) {
  const before = worktreeState({ cwd, env, checkLinks: false });
  command("npm", ["run", "build"], { cwd: before.root, env, inherit: true });
  command("npm", ["link", "--no-audit", "--no-fund"], { cwd: before.root, env, inherit: true });
  command("bash", [join(before.root, "scripts", "install.sh")], { cwd: before.root, env, inherit: true });
  const after = worktreeState({ cwd: before.root, env });
  printState(after, "WORKTREE ACTIVE");
}

function premerge({ cwd = process.cwd(), env = process.env } = {}) {
  const before = worktreeState({ cwd, env, requireCleanCurrent: true });
  command("npm", ["run", "check"], { cwd: before.root, env, inherit: true });
  command("git", ["diff", "--check"], { cwd: before.root, env, inherit: true });
  if (git(["status", "--porcelain=v1"], before.root)) {
    throw new Error("repository checks changed tracked files; commit regenerated output before merge");
  }
  printState(before, "PREMERGE OK");
}

const action = process.argv[2];
try {
  if (action === "doctor") doctor();
  else if (action === "activate") activate();
  else if (action === "premerge") premerge();
  else throw new Error("usage: dev-worktree.mjs <doctor|activate|premerge>");
} catch (error) {
  console.error(`WORKTREE GUARD FAILED: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
