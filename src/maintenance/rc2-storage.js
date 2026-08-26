import { createHash, randomUUID } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import {
  access,
  copyFile,
  cp,
  lstat,
  mkdir,
  open,
  readFile,
  readdir,
  rename,
  rm,
} from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

const SESSION_ID = /^[A-Za-z0-9._-]+$/;
const SHA256 = /^[a-f0-9]{64}$/;
const DATABASE_MEMBERS = Object.freeze([
  "workbench.sqlite",
  "workbench.sqlite-wal",
  "workbench.sqlite-shm",
]);

function purgeError(code, message, cause) {
  const error = new Error(message, cause ? { cause } : undefined);
  error.code = code;
  return error;
}

function assertAbsoluteDirectoryInput(value, label) {
  if (typeof value !== "string" || !isAbsolute(value)) {
    throw new TypeError(`${label} must be an absolute path`);
  }
  return resolve(value);
}

function assertSessionId(value) {
  if (
    typeof value !== "string" ||
    !SESSION_ID.test(value) ||
    value === "." ||
    value === ".." ||
    value.includes("..")
  ) {
    throw new TypeError(`invalid session id: ${String(value)}`);
  }
  return value;
}

function assertSha256(value) {
  if (typeof value !== "string" || !SHA256.test(value)) {
    throw new TypeError(`invalid document sha256: ${String(value)}`);
  }
  return value;
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function readJsonDocument(path, label) {
  let raw;
  try {
    raw = await readFile(path, "utf8");
  } catch (error) {
    throw purgeError("PURGE_STORAGE_UNREADABLE", `${label} cannot be read: ${error.message}`, error);
  }
  let value;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    throw purgeError("PURGE_STORAGE_INVALID_JSON", `${label} contains invalid JSON: ${error.message}`, error);
  }
  return { raw, value };
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw purgeError("PURGE_STORAGE_UNSUPPORTED", `${label} must be an object`);
  }
  return value;
}

async function readRc2Documents(dshHome) {
  const storageRoot = join(dshHome, "storages");
  const workspaceFile = join(storageRoot, "workspace.json");
  const projectionFile = join(storageRoot, "session_projcache.json");
  const workspace = await readJsonDocument(workspaceFile, "workspace.json");
  const projection = await readJsonDocument(projectionFile, "session_projcache.json");
  assertObject(workspace.value?.tables?.workspaces, "workspace.json tables.workspaces");
  assertObject(projection.value?.tables?.sessions, "session_projcache.json tables.sessions");
  return { workspaceFile, projectionFile, workspace, projection };
}

async function writeJsonAtomic(path, value) {
  const temporaryPath = `${path}.purge-${process.pid}-${randomUUID()}`;
  let handle;
  try {
    handle = await open(temporaryPath, "wx", 0o600);
    await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, "utf8");
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporaryPath, path);
  } catch (error) {
    await handle?.close().catch(() => {});
    await rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function cloneFile(source, destination) {
  await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
  try {
    await copyFile(source, destination, fsConstants.COPYFILE_FICLONE);
  } catch (error) {
    if (!["ENOTSUP", "EINVAL", "EXDEV"].includes(error?.code)) throw error;
    await copyFile(source, destination);
  }
}

async function restoreFileAtomic(source, destination) {
  const temporaryPath = `${destination}.restore-${process.pid}-${randomUUID()}`;
  await cloneFile(source, temporaryPath);
  await rename(temporaryPath, destination);
}

async function copyDirectorySnapshot(source, destination) {
  const info = await lstat(source);
  if (info.isSymbolicLink() || !info.isDirectory()) {
    throw purgeError("PURGE_STORAGE_UNSAFE_PATH", `snapshot source must be a real directory: ${source}`);
  }
  await cp(source, destination, {
    recursive: true,
    force: false,
    errorOnExist: true,
    preserveTimestamps: true,
  });
}

async function movePath(source, destination) {
  await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
  try {
    await rename(source, destination);
  } catch (error) {
    if (error?.code !== "EXDEV") throw error;
    const info = await lstat(source);
    if (info.isDirectory()) {
      await cp(source, destination, { recursive: true, force: false, errorOnExist: true });
      await rm(source, { recursive: true });
    } else {
      await cloneFile(source, destination);
      await rm(source);
    }
  }
}

function normalizeParent(value) {
  if (value == null) return null;
  if (typeof value === "string") return assertSessionId(value);
  if (typeof value === "object" && !Array.isArray(value)) {
    return assertSessionId(value.sessionId);
  }
  throw purgeError("PURGE_SESSION_GRAPH_AMBIGUOUS", "session parent reference is invalid");
}

function parentForSession(entry) {
  const candidates = [
    entry?.parentSession,
    entry?.parentSessionId,
    entry?.identity?.parentSession,
  ]
    .filter((value) => value != null)
    .map(normalizeParent);
  const parents = new Set(candidates);
  if (parents.size > 1) {
    throw purgeError("PURGE_SESSION_GRAPH_AMBIGUOUS", "session has conflicting parents");
  }
  return candidates[0] ?? null;
}

export async function probeRc2PurgeBackend({ dshHome, dataDir }) {
  try {
    const normalizedHome = assertAbsoluteDirectoryInput(dshHome, "dshHome");
    const normalizedData = assertAbsoluteDirectoryInput(dataDir, "dataDir");
    const databasePath = resolve(normalizedData, "workbench.sqlite");
    const delta = relative(normalizedData, databasePath);
    if (delta.startsWith("..") || isAbsolute(delta)) {
      throw purgeError("PURGE_STORAGE_UNSAFE_PATH", "Workbench database escapes dataDir");
    }
    await readRc2Documents(normalizedHome);
    return { supported: true, backend: "rc2-jsonl-zstd", reason: null };
  } catch (error) {
    return {
      supported: false,
      backend: null,
      reason: error?.message ?? "RC.2 storage probe failed",
    };
  }
}

export async function readSessionDescendants({ dshHome, rootSessionIds }) {
  const normalizedHome = assertAbsoluteDirectoryInput(dshHome, "dshHome");
  const roots = new Set((rootSessionIds ?? []).map(assertSessionId));
  const { projection } = await readRc2Documents(normalizedHome);
  const children = new Map();
  for (const [sessionId, entry] of Object.entries(projection.value.tables.sessions)) {
    assertSessionId(sessionId);
    const parent = parentForSession(entry);
    if (!parent) continue;
    const list = children.get(parent) ?? [];
    list.push(sessionId);
    children.set(parent, list);
  }

  const visiting = new Set();
  const visited = new Set();
  const descendants = new Set();
  function visit(sessionId) {
    if (visiting.has(sessionId)) {
      throw purgeError("PURGE_SESSION_GRAPH_AMBIGUOUS", `cycle detected at ${sessionId}`);
    }
    if (visited.has(sessionId)) return;
    visiting.add(sessionId);
    for (const child of children.get(sessionId) ?? []) {
      if (!roots.has(child)) descendants.add(child);
      visit(child);
    }
    visiting.delete(sessionId);
    visited.add(sessionId);
  }
  for (const root of roots) visit(root);
  return [...descendants].sort();
}

async function locateSessionDirectories(dshHome, sessionIds) {
  const sessionsRoot = join(dshHome, "sessions");
  const buckets = await readdir(sessionsRoot, { withFileTypes: true });
  const result = [];
  for (const sessionId of sessionIds) {
    assertSessionId(sessionId);
    const matches = [];
    for (const bucket of buckets) {
      if (!bucket.isDirectory() || bucket.isSymbolicLink()) continue;
      const bucketPath = join(sessionsRoot, bucket.name);
      const entries = await readdir(bucketPath, { withFileTypes: true });
      const entry = entries.find((candidate) => candidate.name === sessionId);
      if (!entry) continue;
      const sourcePath = join(bucketPath, sessionId);
      const info = await lstat(sourcePath);
      if (info.isSymbolicLink()) {
        throw purgeError(
          "PURGE_STORAGE_UNSAFE_PATH",
          `symbolic link Session directory is not supported: ${sessionId}`,
        );
      }
      if (!info.isDirectory()) {
        throw purgeError("PURGE_STORAGE_UNSAFE_PATH", `Session path is not a directory: ${sessionId}`);
      }
      matches.push({ sessionId, cwdKey: bucket.name, sourcePath });
    }
    if (matches.length === 0) {
      throw purgeError("PURGE_SESSION_NOT_FOUND", `native Session directory not found: ${sessionId}`);
    }
    if (matches.length > 1) {
      throw purgeError("PURGE_SESSION_DUPLICATE", `duplicate Session directory: ${sessionId}`);
    }
    result.push(matches[0]);
  }
  return result;
}

function removeNativeReferences(workspace, projection, targetIds) {
  const target = new Set(targetIds);
  const nextWorkspace = structuredClone(workspace);
  const nextProjection = structuredClone(projection);
  const archived = nextWorkspace.global?.archivedSessionIds;
  if (Array.isArray(archived)) {
    nextWorkspace.global.archivedSessionIds = archived.filter((id) => !target.has(id));
  }
  for (const workspaceEntry of Object.values(nextWorkspace.tables.workspaces)) {
    if (Array.isArray(workspaceEntry?.sessionIds)) {
      workspaceEntry.sessionIds = workspaceEntry.sessionIds.filter((id) => !target.has(id));
    }
  }
  for (const sessionId of target) delete nextProjection.tables.sessions[sessionId];
  return { workspace: nextWorkspace, projection: nextProjection };
}

function semanticFingerprint(value) {
  return hash(JSON.stringify(value));
}

async function snapshotWorkbench(dataDir, backupRoot) {
  const members = [];
  for (const name of DATABASE_MEMBERS) {
    const sourcePath = join(dataDir, name);
    const destinationPath = join(backupRoot, "workbench", name);
    const existed = await pathExists(sourcePath);
    if (existed) await cloneFile(sourcePath, destinationPath);
    members.push({ name, sourcePath, backupPath: destinationPath, existed });
  }
  const vectorSource = join(dataDir, "vectors");
  const vectorBackup = join(backupRoot, "workbench", "vectors");
  const vectorsExisted = await pathExists(vectorSource);
  if (vectorsExisted) await copyDirectorySnapshot(vectorSource, vectorBackup);
  return {
    databaseMembers: members,
    vectors: { sourcePath: vectorSource, backupPath: vectorBackup, existed: vectorsExisted },
  };
}

async function restoreWorkbenchSnapshot(workbench) {
  for (const member of workbench.databaseMembers) {
    if (member.existed) await restoreFileAtomic(member.backupPath, member.sourcePath);
    else await rm(member.sourcePath, { force: true });
  }
  await rm(workbench.vectors.sourcePath, { recursive: true, force: true });
  if (workbench.vectors.existed) {
    await copyDirectorySnapshot(workbench.vectors.backupPath, workbench.vectors.sourcePath);
  }
}

async function restoreMovedEntry(entry) {
  if (!(await pathExists(entry.quarantinePath))) return;
  if (await pathExists(entry.sourcePath)) {
    throw purgeError("PURGE_RESTORE_CONFLICT", `restore target already exists: ${entry.sourcePath}`);
  }
  await movePath(entry.quarantinePath, entry.sourcePath);
}

async function restoreFromManifest(manifest, { restoreWorkbench = true } = {}) {
  await restoreFileAtomic(manifest.native.workspace.backupPath, manifest.native.workspace.sourcePath);
  await restoreFileAtomic(manifest.native.projection.backupPath, manifest.native.projection.sourcePath);
  if (restoreWorkbench) await restoreWorkbenchSnapshot(manifest.workbench);
  for (const entry of [...manifest.orphanFiles, ...manifest.sessions].reverse()) {
    await restoreMovedEntry(entry);
  }
}

export async function prepareRc2Purge({
  dshHome,
  dataDir,
  job,
  jobs,
  faultInjector = () => {},
}) {
  const normalizedHome = assertAbsoluteDirectoryInput(dshHome, "dshHome");
  const normalizedData = assertAbsoluteDirectoryInput(dataDir, "dataDir");
  const targetIds = [
    ...new Set([
      ...(job?.sessionIds ?? []),
      ...(job?.descendantSessionIds ?? []),
    ].map(assertSessionId)),
  ];
  const orphanDocuments = (job?.orphanDocuments ?? []).map((document) => ({
    id: document.id,
    sha256: assertSha256(document.sha256),
  }));
  const documents = await readRc2Documents(normalizedHome);
  const sessionDirectories = await locateSessionDirectories(normalizedHome, targetIds);
  const jobRoot = join(jobs.root, job.jobId);
  const backupRoot = join(jobRoot, "backup");
  const quarantineRoot = join(jobRoot, "quarantine");
  await mkdir(join(backupRoot, "native"), { recursive: true, mode: 0o700 });
  await mkdir(join(quarantineRoot, "sessions"), { recursive: true, mode: 0o700 });
  await mkdir(join(quarantineRoot, "files"), { recursive: true, mode: 0o700 });

  const native = {
    workspace: {
      sourcePath: documents.workspaceFile,
      backupPath: join(backupRoot, "native", "workspace.json"),
      sha256: hash(documents.workspace.raw),
    },
    projection: {
      sourcePath: documents.projectionFile,
      backupPath: join(backupRoot, "native", "session_projcache.json"),
      sha256: hash(documents.projection.raw),
    },
  };
  await cloneFile(native.workspace.sourcePath, native.workspace.backupPath);
  await cloneFile(native.projection.sourcePath, native.projection.backupPath);
  const workbench = await snapshotWorkbench(normalizedData, backupRoot);
  const sessions = sessionDirectories.map((entry) => ({
    ...entry,
    quarantinePath: join(quarantineRoot, "sessions", entry.cwdKey, entry.sessionId),
  }));
  const orphanFiles = [];
  for (const document of orphanDocuments) {
    const sourcePath = join(normalizedData, "files", document.sha256);
    if (!(await pathExists(sourcePath))) continue;
    const info = await lstat(sourcePath);
    if (info.isSymbolicLink() || !info.isFile()) {
      throw purgeError("PURGE_STORAGE_UNSAFE_PATH", `orphan document path is unsafe: ${document.sha256}`);
    }
    orphanFiles.push({
      ...document,
      sourcePath,
      quarantinePath: join(quarantineRoot, "files", document.sha256),
    });
  }
  const edited = removeNativeReferences(
    documents.workspace.value,
    documents.projection.value,
    targetIds,
  );
  const manifest = {
    version: 1,
    jobId: job.jobId,
    backupRoot,
    quarantineRoot,
    targetSessionIds: targetIds,
    native,
    workbench,
    sessions,
    orphanFiles,
    fingerprints: {
      workspaceAfter: semanticFingerprint(edited.workspace),
      projectionAfter: semanticFingerprint(edited.projection),
    },
  };
  await jobs.writeManifest(job.jobId, manifest);

  const moved = [];
  try {
    for (const entry of sessions) {
      await movePath(entry.sourcePath, entry.quarantinePath);
      moved.push(entry);
      faultInjector(`session-moved:${moved.length}`, entry);
    }
    for (const entry of orphanFiles) {
      await movePath(entry.sourcePath, entry.quarantinePath);
      moved.push(entry);
      faultInjector(`orphan-moved:${moved.length}`, entry);
    }
    await writeJsonAtomic(documents.workspaceFile, edited.workspace);
    faultInjector("workspace-written");
    await writeJsonAtomic(documents.projectionFile, edited.projection);
    faultInjector("projection-written");
    const verified = await readRc2Documents(normalizedHome);
    if (
      semanticFingerprint(verified.workspace.value) !== manifest.fingerprints.workspaceAfter ||
      semanticFingerprint(verified.projection.value) !== manifest.fingerprints.projectionAfter
    ) {
      throw purgeError("PURGE_STORAGE_VERIFY_FAILED", "RC.2 metadata verification failed");
    }
    return manifest;
  } catch (error) {
    try {
      await restoreFileAtomic(native.workspace.backupPath, native.workspace.sourcePath);
      await restoreFileAtomic(native.projection.backupPath, native.projection.sourcePath);
      for (const entry of moved.reverse()) await restoreMovedEntry(entry);
    } catch (restoreError) {
      throw purgeError(
        "PURGE_PREPARE_ROLLBACK_FAILED",
        `purge preparation failed and rollback failed: ${restoreError.message}`,
        error,
      );
    }
    throw error;
  }
}

export async function restoreRc2Purge({ dshHome, dataDir, jobId, jobs }) {
  assertAbsoluteDirectoryInput(dshHome, "dshHome");
  assertAbsoluteDirectoryInput(dataDir, "dataDir");
  const manifest = await jobs.readManifest(jobId);
  await restoreFromManifest(manifest);
  return manifest;
}

function hasNativeReference(workspace, projection, sessionId) {
  if (workspace.global?.archivedSessionIds?.includes(sessionId)) return true;
  if (Object.hasOwn(projection.tables.sessions, sessionId)) return true;
  return Object.values(workspace.tables.workspaces).some((entry) =>
    entry?.sessionIds?.includes(sessionId),
  );
}

export async function commitRc2Purge({ dshHome, dataDir, jobId, jobs }) {
  const normalizedHome = assertAbsoluteDirectoryInput(dshHome, "dshHome");
  assertAbsoluteDirectoryInput(dataDir, "dataDir");
  const manifest = await jobs.readManifest(jobId);
  const documents = await readRc2Documents(normalizedHome);
  for (const sessionId of manifest.targetSessionIds) {
    if (hasNativeReference(documents.workspace.value, documents.projection.value, sessionId)) {
      throw purgeError("PURGE_VERIFY_TARGET_PRESENT", `Session reference still exists: ${sessionId}`);
    }
  }
  for (const entry of manifest.sessions) {
    if (await pathExists(entry.sourcePath)) {
      throw purgeError("PURGE_VERIFY_TARGET_PRESENT", `Session path still exists: ${entry.sourcePath}`);
    }
  }
  for (const entry of manifest.orphanFiles) {
    if (await pathExists(entry.sourcePath)) {
      throw purgeError("PURGE_VERIFY_TARGET_PRESENT", `orphan file still exists: ${entry.sourcePath}`);
    }
  }
  await rm(manifest.backupRoot, { recursive: true, force: true });
  await rm(manifest.quarantineRoot, { recursive: true, force: true });
  return jobs.transition(jobId, "verifying", "completed", {
    completedAt: new Date().toISOString(),
  });
}
