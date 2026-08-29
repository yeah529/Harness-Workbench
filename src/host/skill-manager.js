import {
  mkdir as fsMkdir,
  lstat as fsLstat,
  mkdtemp as fsMkdtemp,
  readdir as fsReaddir,
  readFile as fsReadFile,
  realpath as fsRealpath,
  rename as fsRename,
  rm as fsRm,
  open as fsOpen,
  writeFile as fsWriteFile,
} from "node:fs/promises";
import { spawn as childSpawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";

import {
  extractSkillPackage,
  parseSkillMarkdown,
  SkillManagerError,
  SKILL_ERROR_CODES,
  SKILL_PACKAGE_LIMITS,
} from "./skill-package.js";

const PERMISSION_CODES = new Set(["EACCES", "EPERM", "EROFS"]);
const INTERNAL_NAMES = new Set([".disabled", ".staging", ".transactions"]);

const defaultFileOps = Object.freeze({
  mkdir: fsMkdir,
  lstat: fsLstat,
  mkdtemp: fsMkdtemp,
  readdir: fsReaddir,
  readFile: fsReadFile,
  realpath: fsRealpath,
  rename: fsRename,
  rm: fsRm,
  open: fsOpen,
  writeFile: fsWriteFile,
});

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TRANSACTION_ID_PATTERN = /^[A-Za-z0-9-]+$/;
const locks = new Map();
const recoveryLocks = new Map();
const activeTransactions = new Set();

function serialize(key, operation) {
  const previous = locks.get(key) ?? Promise.resolve();
  const current = previous.catch(() => {}).then(operation);
  locks.set(key, current);
  return current.finally(() => {
    if (locks.get(key) === current) locks.delete(key);
  });
}

function serializeMany(keys, operation) {
  const ordered = [...new Set(keys)].sort();
  const acquire = (index) => index >= ordered.length
    ? operation()
    : serialize(ordered[index], () => acquire(index + 1));
  return acquire(0);
}

function permissionDenied(error, operation) {
  const mapped = new SkillManagerError(
    SKILL_ERROR_CODES.PERMISSION_DENIED,
    "Skill directory cannot be accessed",
    { operation },
  );
  Object.defineProperty(mapped, "cause", { value: error, enumerable: false });
  return mapped;
}

function throwMapped(error, operation) {
  if (PERMISSION_CODES.has(error?.code)) throw permissionDenied(error, operation);
  throw error;
}

async function inspect(ops, path, operation) {
  try {
    return await ops.lstat(path);
  } catch (error) {
    throwMapped(error, operation);
  }
}

async function readDirectory(ops, path) {
  try {
    return await ops.readdir(path, { withFileTypes: true });
  } catch (error) {
    throwMapped(error, "readdir");
  }
}

async function readText(ops, path) {
  try {
    const value = await ops.readFile(path, "utf8");
    return typeof value === "string" ? value : Buffer.from(value).toString("utf8");
  } catch (error) {
    throwMapped(error, "readFile");
  }
}

async function readBytes(ops, path) {
  try {
    return await ops.readFile(path);
  } catch (error) {
    throwMapped(error, "readFile");
  }
}

async function callFs(operation, callback, ...args) {
  try {
    return await callback(...args);
  } catch (error) {
    throwMapped(error, operation);
  }
}

export async function canonicalPathIdentity(ops, path) {
  const absolutePath = resolve(path);
  const suffix = [];
  let current = absolutePath;
  while (true) {
    let stat;
    try {
      stat = await optionalInspect(ops, current, "lstat");
    } catch (error) {
      if (error?.code === "ENOTDIR") {
        throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a non-directory path");
      }
      throw error;
    }
    if (stat) {
      let canonical;
      try {
        canonical = await ops.realpath(current);
      } catch (error) {
        if (error?.code === "ENOTDIR") {
          throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a non-directory path");
        }
        if (error?.code === "ENOENT") {
          const parent = dirname(current);
          suffix.unshift(basename(current));
          if (parent === current) return absolutePath;
          current = parent;
          continue;
        }
        throwMapped(error, "realpath");
      }
      return resolve(canonical, ...suffix);
    }
    const parent = dirname(current);
    if (parent === current) return absolutePath;
    suffix.unshift(basename(current));
    current = parent;
  }
}

async function assertRootPathSafe(
  ops,
  rootPath,
  anchorPath = dirname(rootPath),
  { checkInternals = true, requireDirectories = checkInternals } = {},
) {
  const absoluteRoot = resolve(rootPath);
  const absoluteAnchor = resolve(anchorPath);
  const descendant = relative(absoluteAnchor, absoluteRoot);
  if (descendant.startsWith("..") || isAbsolute(descendant)) {
    throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root is outside its trusted anchor");
  }
  let current = absoluteAnchor;
  const inspectPath = async (path) => {
    try {
      return await optionalInspect(ops, path, "lstat");
    } catch (error) {
      if (error?.code === "ENOTDIR") {
        throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a non-directory path");
      }
      throw error;
    }
  };
  const anchorStat = await inspectPath(current);
  if (anchorStat?.isSymbolicLink()) {
    throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a symbolic link");
  }
  if (requireDirectories && anchorStat && !anchorStat.isDirectory()) {
    throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a non-directory path");
  }
  const components = descendant.split(/[\\/]/).filter(Boolean);
  for (const component of components) {
    current = join(current, component);
    const stat = await inspectPath(current);
    if (stat?.isSymbolicLink()) {
      throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a symbolic link");
    }
    if (requireDirectories && stat && !stat.isDirectory()) {
      throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a non-directory path");
    }
    if (!stat) break;
  }
  if (!checkInternals) return;
  for (const current of [
    join(rootPath, ".disabled"),
    join(rootPath, ".staging"),
    join(rootPath, ".transactions"),
  ]) {
    const stat = await inspectPath(current);
    if (stat?.isSymbolicLink()) {
      throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a symbolic link");
    }
    if (requireDirectories && stat && !stat.isDirectory()) {
      throw mutationError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill root contains a non-directory path");
    }
  }
}

async function optionalRecoveryInspect(ops, path, descriptor) {
  try {
    return await optionalInspect(ops, path, "lstat");
  } catch (error) {
    if (error?.code === "ENOTDIR") throw recoveryError(descriptor);
    throw error;
  }
}

async function assertRecoveryPathsSafe(ops, rootPath, paths, descriptor) {
  for (const current of [
    dirname(rootPath),
    rootPath,
    join(rootPath, ".disabled"),
    join(rootPath, ".staging"),
    join(rootPath, ".transactions"),
  ]) {
    const stat = await optionalRecoveryInspect(ops, current, descriptor);
    if (stat?.isSymbolicLink() || (stat && !stat.isDirectory())) throw recoveryError(descriptor);
  }
  for (const path of Object.values(paths)) {
    const pathRelative = relative(rootPath, path);
    if (pathRelative.startsWith("..") || pathRelative.startsWith("/")) throw recoveryError(descriptor);
    const allowFile = path === paths.descriptor;
    let current = rootPath;
    for (const component of pathRelative.split(/[\\/]/).filter(Boolean)) {
      current = join(current, component);
      const stat = await optionalRecoveryInspect(ops, current, descriptor);
      if (stat?.isSymbolicLink() || (stat && !stat.isDirectory() && !(allowFile && current === path))) {
        throw recoveryError(descriptor);
      }
    }
  }
}

function diagnostic(path, kind, message) {
  return { kind, path, message };
}

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function entryName(entry) {
  return typeof entry === "string" ? entry : entry?.name;
}

function pathFor(rootPath, value) {
  return relative(rootPath, value).split("\\").join("/");
}

function safeName(name) {
  return typeof name === "string" && SKILL_NAME_PATTERN.test(name);
}

function safeTransactionId(id) {
  return typeof id === "string" && TRANSACTION_ID_PATTERN.test(id);
}

function mutationError(code, message, details) {
  return new SkillManagerError(code, message, details);
}

async function optionalInspect(ops, path, operation) {
  try {
    return await inspect(ops, path, operation);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function copyTree(ops, source, destination) {
  const sourceStat = await inspect(ops, source, "lstat");
  if (sourceStat.isSymbolicLink() || !sourceStat.isDirectory()) {
    throw new SkillManagerError(SKILL_ERROR_CODES.ARCHIVE_UNSAFE, "Skill staging path is not a directory");
  }
  await callFs("mkdir", ops.mkdir, destination, { recursive: true });
  for (const rawEntry of await readDirectory(ops, source)) {
    const name = entryName(rawEntry);
    if (typeof name !== "string" || name === "") continue;
    const from = join(source, name);
    const to = join(destination, name);
    const stat = await inspect(ops, from, "lstat");
    if (stat.isSymbolicLink()) {
      throw new SkillManagerError(SKILL_ERROR_CODES.ARCHIVE_UNSAFE, "Skill staging path contains a symbolic link");
    }
    if (stat.isDirectory()) {
      await copyTree(ops, from, to);
    } else if (stat.isFile()) {
      await callFs("writeFile", ops.writeFile, to, await readBytes(ops, from), { flag: "wx" });
    } else {
      throw new SkillManagerError(SKILL_ERROR_CODES.ARCHIVE_UNSAFE, "Skill staging path contains an unsupported entry");
    }
  }
}

async function syncFile(ops, path) {
  if (typeof ops.open !== "function") return;
  let handle;
  try {
    handle = await ops.open(path, "r");
    if (typeof handle?.sync === "function") await handle.sync();
  } catch (error) {
    if (!(["EINVAL", "EISDIR", "ENOTSUP"].includes(error?.code))) throwMapped(error, "fsync");
  } finally {
    await handle?.close?.().catch?.(() => {});
  }
}

async function writeTransaction(ops, transactionsPath, descriptor) {
  const descriptorPath = join(transactionsPath, `${descriptor.id}.json`);
  const temporaryPath = join(transactionsPath, `.${descriptor.id}.json.tmp`);
  await callFs("writeFile", ops.writeFile, temporaryPath, `${JSON.stringify(descriptor)}\n`, { flag: "wx" });
  await syncFile(ops, temporaryPath);
  await callFs("rename", ops.rename, temporaryPath, descriptorPath);
  await syncFile(ops, transactionsPath);
  return descriptorPath;
}

async function replaceTransaction(ops, transactionsPath, descriptor) {
  const descriptorPath = join(transactionsPath, `${descriptor.id}.json`);
  const temporaryPath = join(transactionsPath, `.${descriptor.id}.json.update.tmp`);
  await removePath(ops, temporaryPath).catch(() => {});
  await callFs("writeFile", ops.writeFile, temporaryPath, `${JSON.stringify(descriptor)}\n`, { flag: "wx" });
  await syncFile(ops, temporaryPath);
  await callFs("rename", ops.rename, temporaryPath, descriptorPath);
  await syncFile(ops, transactionsPath);
  return descriptorPath;
}

async function removePath(ops, path, operation = "rm") {
  try {
    await ops.rm(path, { recursive: true, force: true });
  } catch (error) {
    throwMapped(error, operation);
  }
}

function transactionPaths(rootPath, descriptor) {
  if (!descriptor || typeof descriptor !== "object" || Array.isArray(descriptor)) return null;
  const name = descriptor.name;
  const id = descriptor.id;
  if (!safeName(name) || !safeTransactionId(id)) return null;
  const state = descriptor.state === "disabled" ? "disabled" : descriptor.state === "enabled" ? "enabled" : null;
  if (!state || descriptor.version !== 1) return null;
  const finalRelative = state === "disabled" ? `.disabled/${name}` : name;
  if (descriptor.finalRelative !== finalRelative
    || descriptor.stagingRelative !== `.staging/${id}/incoming`
    || descriptor.previousRelative !== `.staging/${id}/previous`) return null;
  return {
    final: join(rootPath, finalRelative),
    incoming: join(rootPath, ".staging", id, "incoming"),
    previous: join(rootPath, ".staging", id, "previous"),
    staging: join(rootPath, ".staging", id),
  };
}

function collectionTransactionPaths(rootPath, descriptor) {
  if (!descriptor || typeof descriptor !== "object" || Array.isArray(descriptor)) return null;
  if (descriptor.version !== 2 || descriptor.kind !== "collection" || !safeTransactionId(descriptor.id)) return null;
  if (descriptor.phase !== "prepared" && descriptor.phase !== "committed") return null;
  if (!Array.isArray(descriptor.items) || descriptor.items.length < 2 || descriptor.items.length > SKILL_PACKAGE_LIMITS.entries) return null;
  const names = new Set();
  const items = [];
  for (const item of descriptor.items) {
    if (!item || typeof item !== "object" || Array.isArray(item) || !safeName(item.name) || names.has(item.name)) return null;
    names.add(item.name);
    const state = item.state === "disabled" ? "disabled" : item.state === "enabled" ? "enabled" : null;
    if (!state || typeof item.existed !== "boolean") return null;
    const finalRelative = state === "disabled" ? `.disabled/${item.name}` : item.name;
    const incomingRelative = `.staging/${descriptor.id}/incoming/${item.name}`;
    const previousRelative = `.staging/${descriptor.id}/previous/${item.name}`;
    if (item.finalRelative !== finalRelative
      || item.incomingRelative !== incomingRelative
      || item.previousRelative !== previousRelative) return null;
    items.push({
      ...item,
      final: join(rootPath, finalRelative),
      incoming: join(rootPath, incomingRelative),
      previous: join(rootPath, previousRelative),
      alternate: state === "disabled" ? join(rootPath, item.name) : join(rootPath, ".disabled", item.name),
    });
  }
  return { staging: join(rootPath, ".staging", descriptor.id), items };
}

async function settleCollectionTransaction({ rootPath, ops, descriptor, descriptorPath }) {
  const paths = collectionTransactionPaths(rootPath, descriptor);
  if (!paths) throw recoveryError(descriptor);
  const safePaths = { staging: paths.staging, descriptor: descriptorPath };
  for (const [index, item] of paths.items.entries()) {
    safePaths[`final${index}`] = item.final;
    safePaths[`incoming${index}`] = item.incoming;
    safePaths[`previous${index}`] = item.previous;
    safePaths[`alternate${index}`] = item.alternate;
  }
  await assertRecoveryPathsSafe(ops, rootPath, safePaths, descriptor);

  const inspected = [];
  for (const item of paths.items) {
    if (await optionalInspect(ops, item.alternate, "lstat")) throw recoveryError(descriptor);
    const final = await optionalInspect(ops, item.final, "lstat");
    const incoming = await optionalInspect(ops, item.incoming, "lstat");
    const previous = await optionalInspect(ops, item.previous, "lstat");
    if ([final, incoming, previous].some((stat) => stat && (stat.isSymbolicLink() || !stat.isDirectory()))) {
      throw recoveryError(descriptor);
    }
    inspected.push({ item, final, incoming, previous });
  }

  if (descriptor.phase === "committed") {
    if (inspected.some(({ final }) => !final)) throw recoveryError(descriptor);
  } else {
    for (const { item, final, incoming, previous } of inspected.reverse()) {
      if (item.existed) {
        if (previous) {
          if (final && incoming) throw recoveryError(descriptor);
          if (final) await removePath(ops, item.final);
          await callFs("mkdir", ops.mkdir, dirname(item.final), { recursive: true });
          await callFs("rename", ops.rename, item.previous, item.final);
        } else if (!final || !incoming) {
          throw recoveryError(descriptor);
        }
      } else if (final && !incoming) {
        await removePath(ops, item.final);
      }
    }
  }
  await removePath(ops, paths.staging);
  await removePath(ops, descriptorPath);
}

async function scanBundle({ rootPath, bundlePath, state, ops }) {
  const diagnostics = [];
  const skillPath = join(bundlePath, "SKILL.md");
  let skillStat;
  try {
    skillStat = await inspect(ops, skillPath, "lstat");
  } catch (error) {
    if (error?.code === "ENOENT") {
      diagnostics.push(diagnostic(bundlePath, "invalid-directory", "SKILL.md is missing"));
      return { diagnostics };
    }
    throw error;
  }
  if (skillStat.isSymbolicLink()) {
    diagnostics.push(diagnostic(skillPath, "nested-symlink", "Skill resources cannot be symbolic links"));
    return { diagnostics };
  }
  if (!skillStat.isFile()) {
    diagnostics.push(diagnostic(skillPath, "invalid-directory", "SKILL.md is not a file"));
    return { diagnostics };
  }

  let identity;
  try {
    identity = parseSkillMarkdown(await readText(ops, skillPath));
  } catch (error) {
    if (error?.code === SKILL_ERROR_CODES.PERMISSION_DENIED) throw error;
    if (error instanceof SkillManagerError) {
      diagnostics.push(diagnostic(skillPath, "invalid-frontmatter", "SKILL.md frontmatter is invalid"));
      return { diagnostics };
    }
    throw error;
  }
  if (identity.name !== bundlePath.split(/[\\/]/).pop()) {
    diagnostics.push(diagnostic(bundlePath, "folder-name-mismatch", "Skill folder name does not match frontmatter name"));
    return { diagnostics };
  }

  const files = [];
  async function walk(directory) {
    for (const rawEntry of await readDirectory(ops, directory)) {
      const name = entryName(rawEntry);
      if (typeof name !== "string" || name === "") continue;
      const absolutePath = join(directory, name);
      const stat = await inspect(ops, absolutePath, "lstat");
      if (stat.isSymbolicLink()) {
        diagnostics.push(diagnostic(absolutePath, "nested-symlink", "Skill resources cannot be symbolic links"));
        continue;
      }
      if (stat.isDirectory()) {
        await walk(absolutePath);
      } else if (stat.isFile()) {
        files.push(pathFor(bundlePath, absolutePath));
      } else {
        diagnostics.push(diagnostic(absolutePath, "unsupported-entry", "Skill bundle contains an unsupported file type"));
      }
    }
  }
  await walk(bundlePath);
  if (diagnostics.length > 0) return { diagnostics };
  files.sort();
  return {
    item: {
      name: identity.name,
      description: identity.description,
      state,
      health: "valid",
      path: bundlePath,
      files,
      fileCount: files.length,
      shadowsGlobal: false,
    },
    diagnostics,
  };
}

async function scanCatalogRoot({ rootPath, ops }) {
  const empty = { items: [], diagnostics: [] };
  let rootStat;
  try {
    rootStat = await inspect(ops, rootPath, "lstat");
  } catch (error) {
    if (error?.code === "ENOENT") return empty;
    throw error;
  }
  if (rootStat.isSymbolicLink()) {
    return { items: [], diagnostics: [diagnostic(rootPath, "symlink", "Skill root cannot be a symbolic link")] };
  }
  if (!rootStat.isDirectory()) {
    return { items: [], diagnostics: [diagnostic(rootPath, "invalid-directory", "Skill root is not a directory")] };
  }

  const candidates = [];
  const diagnostics = [];
  const entries = await readDirectory(ops, rootPath);
  for (const rawEntry of entries) {
    const name = entryName(rawEntry);
    if (typeof name !== "string" || name === "" || INTERNAL_NAMES.has(name)) continue;
    const path = join(rootPath, name);
    const stat = await inspect(ops, path, "lstat");
    if (stat.isSymbolicLink()) {
      diagnostics.push(diagnostic(path, "symlink", "Skill entries cannot be symbolic links"));
      continue;
    }
    if (!stat.isDirectory()) {
      diagnostics.push(diagnostic(path, "flat-file", "Flat files are not manageable Skills"));
      continue;
    }
    const result = await scanBundle({ rootPath, bundlePath: path, state: "enabled", ops });
    diagnostics.push(...result.diagnostics);
    if (result.item) candidates.push(result.item);
  }

  const disabledPath = join(rootPath, ".disabled");
  let disabledStat;
  try {
    disabledStat = await inspect(ops, disabledPath, "lstat");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (disabledStat?.isSymbolicLink()) {
    diagnostics.push(diagnostic(disabledPath, "symlink", "Disabled Skill root cannot be a symbolic link"));
  } else if (disabledStat?.isDirectory()) {
    for (const rawEntry of await readDirectory(ops, disabledPath)) {
      const name = entryName(rawEntry);
      if (typeof name !== "string" || name === "") continue;
      const path = join(disabledPath, name);
      const stat = await inspect(ops, path, "lstat");
      if (stat.isSymbolicLink()) {
        diagnostics.push(diagnostic(path, "symlink", "Skill entries cannot be symbolic links"));
        continue;
      }
      if (!stat.isDirectory()) {
        diagnostics.push(diagnostic(path, "flat-file", "Flat files are not manageable Skills"));
        continue;
      }
      const result = await scanBundle({ rootPath, bundlePath: path, state: "disabled", ops });
      diagnostics.push(...result.diagnostics);
      if (result.item) candidates.push(result.item);
    }
  } else if (disabledStat && !disabledStat.isDirectory()) {
    diagnostics.push(diagnostic(disabledPath, "invalid-directory", "Disabled Skill root is not a directory"));
  }

  const byName = new Map();
  const uniqueCandidates = [];
  for (const item of candidates) {
    const existing = byName.get(item.name);
    if (!existing) {
      byName.set(item.name, item);
      uniqueCandidates.push(item);
      continue;
    }
    uniqueCandidates.splice(uniqueCandidates.indexOf(existing), 1);
    diagnostics.push(diagnostic(existing.path, "state-conflict", "Skill exists in enabled and disabled locations"));
  }
  uniqueCandidates.sort((left, right) => compareStrings(left.name, right.name)
    || (left.state === right.state ? 0 : left.state === "enabled" ? -1 : 1));
  diagnostics.sort((left, right) => compareStrings(left.path, right.path));
  return { items: uniqueCandidates, diagnostics };
}

async function resolveTarget({ scope, projectId, dshHome, repos, ops }) {
  if (scope !== "global" && scope !== "project") {
    throw new SkillManagerError(SKILL_ERROR_CODES.INVALID_SCOPE, "Skill scope must be global or project");
  }
  if (scope === "global") {
    if (typeof dshHome !== "string" || dshHome.length === 0) {
      throw new SkillManagerError(SKILL_ERROR_CODES.INVALID_SCOPE, "DSH_HOME is unavailable");
    }
    const rootPath = resolve(dshHome, "skills");
    return {
      scope: { kind: "global" },
      rootPath,
      anchorPath: resolve(dshHome),
      identity: await canonicalPathIdentity(ops, rootPath),
    };
  }
  if (!Number.isSafeInteger(projectId) || projectId <= 0) {
    throw new SkillManagerError(SKILL_ERROR_CODES.INVALID_SCOPE, "Project scope requires a positive projectId");
  }
  const project = repos?.projects?.get?.(projectId);
  if (!project) throw new SkillManagerError(SKILL_ERROR_CODES.PROJECT_NOT_FOUND, "Project was not found");
  if (typeof project.path !== "string" || !isAbsolute(project.path)) {
    throw new SkillManagerError(SKILL_ERROR_CODES.PROJECT_PATH_UNAVAILABLE, "Project path must be absolute");
  }
  const projectPath = resolve(project.path);
  let projectStat;
  try {
    projectStat = await inspect(ops, projectPath, "lstat");
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new SkillManagerError(SKILL_ERROR_CODES.PROJECT_PATH_UNAVAILABLE, "Project path is unavailable");
    }
    throw error;
  }
  if (projectStat.isSymbolicLink() || !projectStat.isDirectory()) {
    throw new SkillManagerError(SKILL_ERROR_CODES.PROJECT_PATH_UNAVAILABLE, "Project path is not a directory");
  }
  const rootPath = resolve(projectPath, ".dsh", "skills");
  return {
    scope: { kind: "project", projectId },
    rootPath,
    anchorPath: projectPath,
    identity: await canonicalPathIdentity(ops, rootPath),
  };
}

function recoveryError(descriptor) {
  return new SkillManagerError(
    SKILL_ERROR_CODES.RECOVERY_REQUIRED,
    "Skill transaction recovery requires manual intervention",
    { id: descriptor?.id, name: descriptor?.name },
  );
}

async function recoverTransactions({ rootPath, ops, identity }) {
  const rootStat = await optionalRecoveryInspect(ops, rootPath, { name: "root" });
  if (!rootStat || rootStat.isSymbolicLink() || !rootStat.isDirectory()) return;
  const transactionsPath = join(rootPath, ".transactions");
  const transactionsStat = await optionalRecoveryInspect(ops, transactionsPath, { name: "transactions" });
  if (!transactionsStat) return;
  if (transactionsStat.isSymbolicLink() || !transactionsStat.isDirectory()) throw recoveryError({ name: "transactions" });

  for (const rawEntry of await readDirectory(ops, transactionsPath)) {
    const name = entryName(rawEntry);
    if (typeof name !== "string" || !name.endsWith(".json")) continue;
    const descriptorPath = join(transactionsPath, name);
    const descriptorStat = await inspect(ops, descriptorPath, "lstat");
    if (descriptorStat.isSymbolicLink() || !descriptorStat.isFile()) throw recoveryError({ name });
    let descriptor;
    try {
      descriptor = JSON.parse(await readText(ops, descriptorPath));
    } catch {
      throw recoveryError({ name });
    }
    if (!descriptor || typeof descriptor !== "object" || Array.isArray(descriptor) || !safeTransactionId(descriptor.id)) {
      throw recoveryError(descriptor);
    }
    if (name !== `${descriptor.id}.json`) throw recoveryError(descriptor);
    if (activeTransactions.has(`${identity}\0${descriptor.id}`)) continue;
    if (descriptor.version === 2 && descriptor.kind === "collection") {
      await settleCollectionTransaction({ rootPath, ops, descriptor, descriptorPath });
      continue;
    }
    const paths = transactionPaths(rootPath, descriptor);
    if (!paths) throw recoveryError(descriptor);
    const alternate = descriptor.state === "disabled"
      ? join(rootPath, descriptor.name)
      : join(rootPath, ".disabled", descriptor.name);
    await assertRecoveryPathsSafe(ops, rootPath, {
      final: paths.final,
      incoming: paths.incoming,
      previous: paths.previous,
      staging: paths.staging,
      descriptor: descriptorPath,
      alternate,
    }, descriptor);
    const alternateStat = await optionalInspect(ops, alternate, "lstat");
    if (alternateStat) throw recoveryError(descriptor);

    const finalStat = await optionalInspect(ops, paths.final, "lstat");
    const previousStat = await optionalInspect(ops, paths.previous, "lstat");
    const incomingStat = await optionalInspect(ops, paths.incoming, "lstat");
    if ([finalStat, previousStat, incomingStat].some((stat) => stat && (stat.isSymbolicLink() || !stat.isDirectory()))) {
      throw recoveryError(descriptor);
    }

    if (!finalStat && previousStat) {
      await callFs("mkdir", ops.mkdir, dirname(paths.final), { recursive: true });
      try {
        await ops.rename(paths.previous, paths.final);
      } catch (error) {
        throwMapped(error, "rename");
      }
    } else if (finalStat && previousStat) {
      await removePath(ops, paths.previous);
    } else if (!finalStat && !previousStat) {
      throw recoveryError(descriptor);
    }
    await removePath(ops, paths.staging);
    await removePath(ops, descriptorPath);
  }
}

async function recoverTransactionsShared({ rootPath, ops, identity: providedIdentity }) {
  const identity = providedIdentity ?? await canonicalPathIdentity(ops, rootPath);
  const existing = recoveryLocks.get(identity);
  if (existing) return existing;
  const current = recoverTransactions({ rootPath, ops, identity }).finally(() => {
    if (recoveryLocks.get(identity) === current) recoveryLocks.delete(identity);
  });
  recoveryLocks.set(identity, current);
  return current;
}

async function defaultRevealPath(path) {
  const platform = process.platform;
  const command = platform === "darwin" ? "open" : platform === "win32" ? "explorer.exe" : "xdg-open";
  await new Promise((resolvePromise, reject) => {
    let child;
    try {
      child = childSpawn(command, [path], { shell: false, detached: true, stdio: "ignore" });
    } catch (error) {
      reject(error);
      return;
    }
    child.once("error", reject);
    child.once("spawn", resolvePromise);
    child.unref?.();
  });
}

export function createSkillManager({ dshHome, repos, fileOps = defaultFileOps, revealPath: injectedRevealPath } = {}) {
  const ops = { ...defaultFileOps, ...(fileOps ?? {}) };
  const revealPath = injectedRevealPath ?? fileOps?.revealPath ?? defaultRevealPath;

  async function readState(target, name) {
    const enabledPath = join(target.rootPath, name);
    const disabledPath = join(target.rootPath, ".disabled", name);
    const enabledStat = await optionalInspect(ops, enabledPath, "lstat");
    const disabledStat = await optionalInspect(ops, disabledPath, "lstat");
    if (enabledStat && disabledStat) {
      throw mutationError(SKILL_ERROR_CODES.STATE_CONFLICT, "Skill exists in enabled and disabled locations", { name });
    }
    const state = enabledStat ? "enabled" : disabledStat ? "disabled" : null;
    if (!state) return null;
    const path = state === "enabled" ? enabledPath : disabledPath;
    const stat = state === "enabled" ? enabledStat : disabledStat;
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw mutationError(SKILL_ERROR_CODES.NOT_FOUND, "Skill was not found", { name });
    }
    const result = await scanBundle({ rootPath: target.rootPath, bundlePath: path, state, ops });
    if (!result.item || result.diagnostics.length > 0) {
      throw mutationError(SKILL_ERROR_CODES.NOT_FOUND, "Skill was not found", { name });
    }
    return result.item;
  }

  async function importCollection({ target, packageSummary, extractedRoot, sourceName, replace, confirmCollection }) {
    const lockKeys = packageSummary.skills.map((skill) => `${target.identity}\0${skill.name}`);
    return serializeMany(lockKeys, async () => {
      await assertRootPathSafe(ops, target.rootPath, target.anchorPath);
      await recoverTransactionsShared({ rootPath: target.rootPath, ops, identity: target.identity });
      const records = [];
      for (const summary of packageSummary.skills) {
        records.push({ summary, existing: await readState(target, summary.name) });
      }
      const conflictCount = records.filter(({ existing }) => existing).length;
      const preview = {
        kind: "collection",
        sourceName: typeof sourceName === "string" ? sourceName : "",
        count: records.length,
        conflictCount,
        skills: records.map(({ summary, existing }) => ({
          name: summary.name,
          description: summary.description,
          files: summary.files,
          fileCount: summary.fileCount,
          conflict: !!existing,
          ...(existing ? {
            existing: {
              name: existing.name,
              description: existing.description,
              state: existing.state,
              health: existing.health,
              files: existing.files,
              fileCount: existing.fileCount,
            },
          } : {}),
        })),
      };
      if (!confirmCollection || (conflictCount > 0 && !replace)) {
        throw mutationError(
          SKILL_ERROR_CODES.COLLECTION_CONFIRMATION_REQUIRED,
          "Skill collection requires confirmation",
          preview,
        );
      }

      await callFs("mkdir", ops.mkdir, target.rootPath, { recursive: true });
      const transactionId = randomUUID();
      const stagingRoot = join(target.rootPath, ".staging", transactionId);
      const stagingIncoming = join(stagingRoot, "incoming");
      const transactionsPath = join(target.rootPath, ".transactions");
      try {
        await callFs("mkdir", ops.mkdir, stagingIncoming, { recursive: true });
        for (const { summary } of records) {
          await copyTree(ops, join(extractedRoot, summary.name), join(stagingIncoming, summary.name));
        }
        await callFs("mkdir", ops.mkdir, transactionsPath, { recursive: true });
      } catch (error) {
        await removePath(ops, stagingRoot).catch(() => {});
        throwMapped(error, "mutation");
      }
      const descriptor = {
        version: 2,
        kind: "collection",
        phase: "prepared",
        id: transactionId,
        items: records.map(({ summary, existing }) => {
          const state = existing?.state ?? "enabled";
          return {
            name: summary.name,
            state,
            existed: !!existing,
            finalRelative: state === "disabled" ? `.disabled/${summary.name}` : summary.name,
            incomingRelative: `.staging/${transactionId}/incoming/${summary.name}`,
            previousRelative: `.staging/${transactionId}/previous/${summary.name}`,
          };
        }),
      };
      const activeKey = `${target.identity}\0${transactionId}`;
      activeTransactions.add(activeKey);
      try {
        let descriptorPath;
        let committed = false;
        let installedItems = [];
        try {
          descriptorPath = await writeTransaction(ops, transactionsPath, descriptor);
          for (const [index, record] of records.entries()) {
            const item = descriptor.items[index];
            const finalPath = join(target.rootPath, item.finalRelative);
            const incomingPath = join(target.rootPath, item.incomingRelative);
            if (record.existing) {
              const previousPath = join(target.rootPath, item.previousRelative);
              await callFs("mkdir", ops.mkdir, dirname(previousPath), { recursive: true });
              await callFs("rename", ops.rename, record.existing.path, previousPath);
            } else {
              await callFs("mkdir", ops.mkdir, dirname(finalPath), { recursive: true });
            }
            await callFs("rename", ops.rename, incomingPath, finalPath);
            const installed = await scanBundle({ rootPath: target.rootPath, bundlePath: finalPath, state: item.state, ops });
            if (!installed.item || installed.diagnostics.length > 0) {
              throw mutationError(SKILL_ERROR_CODES.PACKAGE_INVALID, "Installed Skill collection could not be scanned");
            }
            installedItems.push(installed.item);
          }
          descriptor.phase = "committed";
          await replaceTransaction(ops, transactionsPath, descriptor);
          committed = true;
        } catch (error) {
          if (descriptorPath) {
            try {
              await settleCollectionTransaction({
                rootPath: target.rootPath,
                ops,
                descriptor: { ...descriptor, phase: "prepared" },
                descriptorPath,
              });
            } catch {
              throw recoveryError(descriptor);
            }
          } else {
            await removePath(ops, stagingRoot).catch(() => {});
          }
          throwMapped(error, "mutation");
        }
        if (!committed) throw recoveryError(descriptor);
        try {
          await settleCollectionTransaction({ rootPath: target.rootPath, ops, descriptor, descriptorPath });
        } catch {
          throw recoveryError(descriptor);
        }
        installedItems = installedItems.sort((left, right) => compareStrings(left.name, right.name));
        return { kind: "collection", count: installedItems.length, replacedCount: conflictCount, items: installedItems };
      } finally {
        activeTransactions.delete(activeKey);
      }
    });
  }

  async function importArchive({ scope, projectId, archiveBytes, sourceName, replace = false, confirmCollection = false } = {}) {
    const target = await resolveTarget({ scope, projectId, dshHome, repos, ops });
    const bytes = archiveBytes instanceof Uint8Array ? archiveBytes : new Uint8Array(archiveBytes ?? 0);
    if (bytes.byteLength > SKILL_PACKAGE_LIMITS.archiveBytes) {
      throw new SkillManagerError(SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE, "ZIP archive exceeds the byte limit", {
        bytes: bytes.byteLength,
        limit: SKILL_PACKAGE_LIMITS.archiveBytes,
      });
    }

    const temporaryRoot = await callFs("mkdtemp", ops.mkdtemp, join(tmpdir(), ".cpwb-skill-import-"));
    let extractedRoot;
    try {
      const canonicalTempRoot = await callFs("realpath", ops.realpath, temporaryRoot);
      extractedRoot = join(canonicalTempRoot, "incoming");
      const packageSummary = await extractSkillPackage({ archiveBytes: bytes, destination: extractedRoot });
      if (packageSummary.kind === "collection") {
        return await importCollection({
          target,
          packageSummary,
          extractedRoot,
          sourceName,
          replace,
          confirmCollection,
        });
      }
      const summary = packageSummary.skills[0];
      const key = `${target.identity}\0${summary.name}`;
      return await serialize(key, async () => {
        await assertRootPathSafe(ops, target.rootPath, target.anchorPath);
        await recoverTransactionsShared({ rootPath: target.rootPath, ops, identity: target.identity });
        const existing = await readState(target, summary.name);
        const incoming = {
          name: summary.name,
          description: summary.description,
          sourceName: typeof sourceName === "string" ? sourceName : "",
          files: summary.files,
          fileCount: summary.fileCount,
          state: existing?.state ?? "enabled",
        };
        if (existing && !replace) {
          throw mutationError(SKILL_ERROR_CODES.CONFLICT, "A Skill with this name already exists", {
            existing: { ...existing, installedPath: existing.path, conflictSummary: "catalog-entry-v1" },
            incoming,
          });
        }

        await callFs("mkdir", ops.mkdir, target.rootPath, { recursive: true });
        const transactionId = randomUUID();
        const stagingRoot = join(target.rootPath, ".staging", transactionId);
        const stagingIncoming = join(stagingRoot, "incoming");
        await callFs("mkdir", ops.mkdir, stagingRoot, { recursive: true });
        await copyTree(ops, extractedRoot, stagingIncoming);
        const finalPath = existing?.state === "disabled"
          ? join(target.rootPath, ".disabled", summary.name)
          : join(target.rootPath, summary.name);
        const transactionsPath = join(target.rootPath, ".transactions");
        if (!existing) {
          try {
            await ops.rename(stagingIncoming, finalPath);
          } catch (error) {
            throwMapped(error, "rename");
          } finally {
            await removePath(ops, stagingRoot).catch(() => {});
          }
        } else {
          const previous = join(stagingRoot, "previous");
          const descriptor = {
            version: 1,
            id: transactionId,
            name: summary.name,
            state: existing.state,
            finalRelative: existing.state === "disabled" ? `.disabled/${summary.name}` : summary.name,
            stagingRelative: `.staging/${transactionId}/incoming`,
            previousRelative: `.staging/${transactionId}/previous`,
          };
          await callFs("mkdir", ops.mkdir, transactionsPath, { recursive: true });
          activeTransactions.add(`${target.identity}\0${transactionId}`);
          let descriptorPath;
          let movedPrevious = false;
          let movedIncoming = false;
          let committed = false;
          let cleanupAllowed = false;
          try {
            descriptorPath = await writeTransaction(ops, transactionsPath, descriptor);
            await ops.rename(existing.path, previous);
            movedPrevious = true;
            await ops.rename(stagingIncoming, finalPath);
            movedIncoming = true;
            const installed = await scanBundle({ rootPath: target.rootPath, bundlePath: finalPath, state: existing.state, ops });
            if (!installed.item || installed.diagnostics.length > 0) {
              throw mutationError(SKILL_ERROR_CODES.PACKAGE_INVALID, "Installed Skill could not be scanned");
            }
            committed = true;
            await removePath(ops, previous);
            await removePath(ops, stagingRoot);
            await removePath(ops, descriptorPath);
            cleanupAllowed = true;
            return installed.item;
          } catch (error) {
            if (!committed && movedPrevious) {
              let restored = false;
              const finalStat = await optionalInspect(ops, finalPath, "lstat");
              const previousStat = await optionalInspect(ops, previous, "lstat");
              try {
                if (finalStat && previousStat && movedIncoming) await removePath(ops, finalPath);
                if (!finalStat || (movedIncoming && finalStat)) {
                  await ops.rename(previous, finalPath);
                  restored = true;
                }
              } catch {
                restored = false;
              }
              if (!restored) throw recoveryError(descriptor);
              cleanupAllowed = true;
            }
            throwMapped(error, "mutation");
          } finally {
            activeTransactions.delete(`${target.identity}\0${transactionId}`);
            if (cleanupAllowed || !movedPrevious) {
              await removePath(ops, stagingRoot).catch(() => {});
              if (descriptorPath) await removePath(ops, descriptorPath).catch(() => {});
            }
          }
        }
        try {
          const installed = await scanBundle({ rootPath: target.rootPath, bundlePath: finalPath, state: "enabled", ops });
          if (!installed.item || installed.diagnostics.length > 0) {
            throw mutationError(SKILL_ERROR_CODES.PACKAGE_INVALID, "Installed Skill could not be scanned");
          }
          return installed.item;
        } catch (error) {
          try {
            await removePath(ops, finalPath);
          } catch {
            throw recoveryError({ name: summary.name });
          }
          throwMapped(error, "mutation");
        }
      });
    } finally {
      await removePath(ops, temporaryRoot).catch(() => {});
    }
  }

  async function setEnabled({ scope, projectId, name, enabled } = {}) {
    const target = await resolveTarget({ scope, projectId, dshHome, repos, ops });
    if (!safeName(name)) throw new SkillManagerError(SKILL_ERROR_CODES.NAME_INVALID, "Skill name is not valid", { name });
    return serialize(`${target.identity}\0${name}`, async () => {
      await assertRootPathSafe(ops, target.rootPath, target.anchorPath);
      await recoverTransactionsShared({ rootPath: target.rootPath, ops, identity: target.identity });
      const current = await readState(target, name);
      if (!current) throw mutationError(SKILL_ERROR_CODES.NOT_FOUND, "Skill was not found", { name });
      const desired = enabled ? "enabled" : "disabled";
      if (current.state === desired) return current;
      const destination = desired === "disabled" ? join(target.rootPath, ".disabled", name) : join(target.rootPath, name);
      if (desired === "disabled") await callFs("mkdir", ops.mkdir, dirname(destination), { recursive: true });
      try {
        await ops.rename(current.path, destination);
      } catch (error) {
        throwMapped(error, "rename");
      }
      try {
        const result = await scanBundle({ rootPath: target.rootPath, bundlePath: destination, state: desired, ops });
        if (!result.item || result.diagnostics.length > 0) throw mutationError(SKILL_ERROR_CODES.PACKAGE_INVALID, "Skill could not be scanned after state change");
        return result.item;
      } catch (error) {
        try {
          await ops.rename(destination, current.path);
        } catch {
          throw recoveryError({ name });
        }
        throwMapped(error, "mutation");
      }
    });
  }

  async function remove({ scope, projectId, name } = {}) {
    const target = await resolveTarget({ scope, projectId, dshHome, repos, ops });
    if (!safeName(name)) throw new SkillManagerError(SKILL_ERROR_CODES.NAME_INVALID, "Skill name is not valid", { name });
    return serialize(`${target.identity}\0${name}`, async () => {
      await assertRootPathSafe(ops, target.rootPath, target.anchorPath);
      await recoverTransactionsShared({ rootPath: target.rootPath, ops, identity: target.identity });
      const current = await readState(target, name);
      if (!current) throw mutationError(SKILL_ERROR_CODES.NOT_FOUND, "Skill was not found", { name });
      await removePath(ops, current.path);
      return { ...current, removed: true };
    });
  }

  async function reveal({ scope, projectId, name } = {}) {
    const target = await resolveTarget({ scope, projectId, dshHome, repos, ops });
    if (!safeName(name)) throw new SkillManagerError(SKILL_ERROR_CODES.NAME_INVALID, "Skill name is not valid", { name });
    return serialize(`${target.identity}\0${name}`, async () => {
      await assertRootPathSafe(ops, target.rootPath, target.anchorPath);
      await recoverTransactionsShared({ rootPath: target.rootPath, ops, identity: target.identity });
      const current = await readState(target, name);
      if (!current) throw mutationError(SKILL_ERROR_CODES.NOT_FOUND, "Skill was not found", { name });
      try {
        await revealPath(current.path);
      } catch (error) {
        const mapped = new SkillManagerError(SKILL_ERROR_CODES.FILE_MANAGER_UNAVAILABLE, "File manager could not be opened", { operation: "reveal" });
        Object.defineProperty(mapped, "cause", { value: error, enumerable: false });
        throw mapped;
      }
      return current;
    });
  }

  async function list({ scope, projectId } = {}) {
    const target = await resolveTarget({ scope, projectId, dshHome, repos, ops });
    await assertRootPathSafe(ops, target.rootPath, target.anchorPath, { checkInternals: false });
    await recoverTransactionsShared({ rootPath: target.rootPath, ops, identity: target.identity });
    const catalog = await scanCatalogRoot({ rootPath: target.rootPath, ops });
    if (scope === "project") {
      const globalRoot = resolve(dshHome, "skills");
      await assertRootPathSafe(ops, globalRoot, dshHome, { checkInternals: false });
      await recoverTransactionsShared({ rootPath: globalRoot, ops });
      const globalCatalog = await scanCatalogRoot({ rootPath: globalRoot, ops });
      const globalNames = new Set(globalCatalog.items.map((item) => item.name));
      for (const item of catalog.items) item.shadowsGlobal = globalNames.has(item.name);
    }
    return { scope: target.scope, rootPath: target.rootPath, ...catalog };
  }
  return { list, importArchive, setEnabled, remove, reveal };
}
