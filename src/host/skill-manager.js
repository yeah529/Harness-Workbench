import {
  lstat as fsLstat,
  readdir as fsReaddir,
  readFile as fsReadFile,
} from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";

import {
  parseSkillMarkdown,
  SkillManagerError,
  SKILL_ERROR_CODES,
} from "./skill-package.js";

const PERMISSION_CODES = new Set(["EACCES", "EPERM", "EROFS"]);
const INTERNAL_NAMES = new Set([".staging", ".transactions"]);

const defaultFileOps = Object.freeze({
  lstat: fsLstat,
  readdir: fsReaddir,
  readFile: fsReadFile,
});

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
    return { scope: { kind: "global" }, rootPath: resolve(dshHome, "skills") };
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
  return {
    scope: { kind: "project", projectId },
    rootPath: resolve(projectPath, ".dsh", "skills"),
  };
}

export function createSkillManager({ dshHome, repos, fileOps = defaultFileOps } = {}) {
  const ops = { ...defaultFileOps, ...(fileOps ?? {}) };
  async function list({ scope, projectId } = {}) {
    const target = await resolveTarget({ scope, projectId, dshHome, repos, ops });
    const catalog = await scanCatalogRoot({ rootPath: target.rootPath, ops });
    if (scope === "project") {
      const globalRoot = resolve(dshHome, "skills");
      const globalCatalog = await scanCatalogRoot({ rootPath: globalRoot, ops });
      const globalNames = new Set(globalCatalog.items.map((item) => item.name));
      for (const item of catalog.items) item.shadowsGlobal = globalNames.has(item.name);
    }
    return { scope: target.scope, rootPath: target.rootPath, ...catalog };
  }
  return { list };
}
