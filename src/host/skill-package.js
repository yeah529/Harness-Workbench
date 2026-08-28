import { lstat, mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, join, parse, posix, resolve, sep } from "node:path";
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

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ZIP_CENTRAL_SIGNATURE = 0x02014b50;
const ZIP_END_SIGNATURE = 0x06054b50;
const ZIP64_END_SIGNATURE = 0x06064b50;
const ZIP64_LOCATOR_SIGNATURE = 0x07064b50;
const ZIP64_SENTINEL = 0xffffffff;
const UNIX_SYMLINK_MODE = 0o120000;
const UNIX_FILE_TYPE_MASK = 0o170000;
const UNIX_REGULAR_MODE = 0o100000;
const UNIX_DIRECTORY_MODE = 0o040000;

function packageError(message, details) {
  return new SkillManagerError(SKILL_ERROR_CODES.PACKAGE_INVALID, message, details);
}

function unsafeArchive(message, details) {
  return new SkillManagerError(SKILL_ERROR_CODES.ARCHIVE_UNSAFE, message, details);
}

function tooLarge(message, details) {
  return new SkillManagerError(SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE, message, details);
}

function decodeUtf8(bytes) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    throw unsafeArchive("ZIP entry name is not valid UTF-8", { cause: String(error.message) });
  }
}

function readUint16(view, offset) {
  return view.getUint16(offset, true);
}

function readUint32(view, offset) {
  return view.getUint32(offset, true);
}

function findEndOfCentralDirectory(bytes, view) {
  const start = Math.max(0, bytes.length - 22 - 0xffff);
  for (let offset = bytes.length - 22; offset >= start; offset -= 1) {
    if (readUint32(view, offset) !== ZIP_END_SIGNATURE) continue;
    const commentLength = readUint16(view, offset + 20);
    if (offset + 22 + commentLength === bytes.length) return offset;
  }
  throw unsafeArchive("ZIP end of central directory is missing");
}

function readZipExtraFields(bytes, offset, length) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const fields = [];
  const end = offset + length;
  while (offset < end) {
    if (offset + 4 > end) throw unsafeArchive("ZIP extra field is truncated");
    const id = readUint16(view, offset);
    const size = readUint16(view, offset + 2);
    offset += 4;
    if (offset + size > end) throw unsafeArchive("ZIP extra field is truncated");
    fields.push([id, bytes.subarray(offset, offset + size)]);
    offset += size;
  }
  return fields;
}

function inspectZipCentralDirectory(archiveBytes) {
  const bytes = archiveBytes instanceof Uint8Array ? archiveBytes : new Uint8Array(archiveBytes);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const endOffset = findEndOfCentralDirectory(bytes, view);
  const entryCount = readUint16(view, endOffset + 10);
  const centralSize = readUint32(view, endOffset + 12);
  const centralOffset = readUint32(view, endOffset + 16);
  if (entryCount === 0xffff || centralSize === ZIP64_SENTINEL || centralOffset === ZIP64_SENTINEL) {
    throw unsafeArchive("ZIP64 archives are not supported");
  }
  const centralEnd = centralOffset + centralSize;
  if (centralEnd > endOffset || centralEnd > bytes.length) {
    throw unsafeArchive("ZIP central directory is outside the archive");
  }
  for (let offset = centralEnd; offset + 4 <= endOffset; offset += 1) {
    const signature = readUint32(view, offset);
    if (signature === ZIP64_END_SIGNATURE || signature === ZIP64_LOCATOR_SIGNATURE) {
      throw unsafeArchive("ZIP64 records are not supported");
    }
  }

  const entries = [];
  let offset = centralOffset;
  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > bytes.length || readUint32(view, offset) !== ZIP_CENTRAL_SIGNATURE) {
      throw unsafeArchive("ZIP central directory entry is invalid", { index });
    }
    const flags = readUint16(view, offset + 8);
    const compressedSize = readUint32(view, offset + 20);
    const originalSize = readUint32(view, offset + 24);
    const nameLength = readUint16(view, offset + 28);
    const extraLength = readUint16(view, offset + 30);
    const commentLength = readUint16(view, offset + 32);
    const externalAttributes = readUint32(view, offset + 38);
    const localOffset = readUint32(view, offset + 42);
    const recordLength = 46 + nameLength + extraLength + commentLength;
    if (offset + recordLength > bytes.length) throw unsafeArchive("ZIP central directory entry is truncated", { index });
    if (flags & 1) throw unsafeArchive("Encrypted ZIP entries are not supported", { index });
    if (compressedSize === ZIP64_SENTINEL || originalSize === ZIP64_SENTINEL || localOffset === ZIP64_SENTINEL) {
      throw unsafeArchive("ZIP64 entries are not supported", { index });
    }
    const extras = readZipExtraFields(bytes, offset + 46 + nameLength, extraLength);
    if (extras.some(([id]) => id === 0x0001)) throw unsafeArchive("ZIP64 entries are not supported", { index });

    const unixType = (externalAttributes >>> 16) & UNIX_FILE_TYPE_MASK;
    if (unixType === UNIX_SYMLINK_MODE) {
      throw unsafeArchive("ZIP symbolic links are not supported", { index });
    }
    if (unixType !== 0 && unixType !== UNIX_REGULAR_MODE && unixType !== UNIX_DIRECTORY_MODE) {
      throw unsafeArchive("Special ZIP file types are not supported", { index });
    }
    const name = decodeUtf8(bytes.subarray(offset + 46, offset + 46 + nameLength));
    entries.push({ name, compressedSize, originalSize, localOffset });
    offset += recordLength;
  }
  if (offset !== centralOffset + centralSize) throw unsafeArchive("ZIP central directory size is invalid");
  return { bytes, entries };
}

async function assertDestinationPathSafe(destination) {
  const absolute = resolve(destination);
  const trustedRoots = [tmpdir(), homedir()].map((root) => resolve(root));
  const trustedRoot = trustedRoots.find((root) => absolute === root || absolute.startsWith(`${root}${sep}`))
    ?? parse(absolute).root;
  let current = trustedRoot;
  const components = absolute.slice(trustedRoot.length).split(sep).filter(Boolean);
  for (const component of components) {
    current = join(current, component);
    try {
      if ((await lstat(current)).isSymbolicLink()) {
        throw unsafeArchive("Destination path contains a symbolic link");
      }
    } catch (error) {
      if (error instanceof SkillManagerError) throw error;
      if (error.code !== "ENOENT") {
        throw new SkillManagerError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Destination path cannot be inspected", { cause: error.code ?? "UNKNOWN" });
      }
      break;
    }
  }
  return absolute;
}

function materializationError(error) {
  return new SkillManagerError(SKILL_ERROR_CODES.PERMISSION_DENIED, "Skill package could not be materialized", { cause: error.code ?? "UNKNOWN" });
}

function normalizeEntryName(name) {
  const normalized = name.replaceAll("\\", "/");
  if (normalized.includes("\0") || normalized.startsWith("/") || /^[A-Za-z]:/.test(normalized)) {
    throw unsafeArchive("ZIP entry path is unsafe", { name });
  }
  const parts = normalized.split("/");
  if (parts.length === 0 || parts.some((part) => part.length === 0 || part === "." || part === "..")) {
    throw unsafeArchive("ZIP entry path is unsafe", { name });
  }
  return posix.join(...parts);
}

function readLimits(limits) {
  return { ...SKILL_PACKAGE_LIMITS, ...(limits ?? {}) };
}

export function parseSkillMarkdown(markdown) {
  if (typeof markdown !== "string") throw packageError("SKILL.md must be text");
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!match) throw packageError("SKILL.md must start with YAML frontmatter");
  let frontmatter;
  try {
    frontmatter = loadYaml(match[1]);
  } catch (error) {
    throw packageError("SKILL.md frontmatter is invalid", { cause: String(error.message) });
  }
  if (frontmatter === null || typeof frontmatter !== "object" || Array.isArray(frontmatter)) {
    throw packageError("SKILL.md frontmatter must be a mapping");
  }
  if (typeof frontmatter.name !== "string" || typeof frontmatter.description !== "string") {
    throw packageError("SKILL.md requires string name and description");
  }
  if (!SKILL_NAME_PATTERN.test(frontmatter.name)) {
    throw new SkillManagerError(SKILL_ERROR_CODES.NAME_INVALID, "Skill name is not valid", { name: frontmatter.name });
  }
  if (frontmatter.description.trim().length === 0) throw packageError("Skill description is required");
  return { name: frontmatter.name, description: frontmatter.description };
}

export async function extractSkillArchive({ archiveBytes, destination, limits }) {
  const effectiveLimits = readLimits(limits);
  const bytes = archiveBytes instanceof Uint8Array ? archiveBytes : new Uint8Array(archiveBytes);
  if (bytes.byteLength > effectiveLimits.archiveBytes) {
    throw tooLarge("ZIP archive exceeds the byte limit", { bytes: bytes.byteLength, limit: effectiveLimits.archiveBytes });
  }
  const inspected = inspectZipCentralDirectory(bytes);
  if (inspected.entries.length > effectiveLimits.entries) {
    throw tooLarge("ZIP archive contains too many entries", { entries: inspected.entries.length, limit: effectiveLimits.entries });
  }

  const normalizedEntries = inspected.entries.map((entry) => ({ ...entry, path: normalizeEntryName(entry.name) }));
  const uniquePaths = new Set(normalizedEntries.map((entry) => entry.path));
  if (uniquePaths.size !== normalizedEntries.length) throw packageError("ZIP archive contains duplicate paths");
  const skillEntries = normalizedEntries.filter((entry) => entry.path === "SKILL.md" || entry.path.endsWith("/SKILL.md"));
  if (skillEntries.length !== 1) throw packageError("ZIP archive must contain exactly one SKILL.md");

  const skillParts = skillEntries[0].path.split("/");
  let wrapper = "";
  if (skillParts.length === 2) wrapper = skillParts[0];
  else if (skillParts.length !== 1) throw packageError("ZIP archive contains a nested wrapper");
  const relativeEntries = normalizedEntries.map((entry) => {
    if (wrapper && !entry.path.startsWith(`${wrapper}/`)) throw packageError("ZIP archive contains multiple wrappers");
    const path = wrapper ? entry.path.slice(wrapper.length + 1) : entry.path;
    return { ...entry, path };
  });
  const relativeSkill = relativeEntries.find((entry) => entry.path === "SKILL.md");
  if (!relativeSkill) throw packageError("ZIP archive wrapper is invalid");

  let declaredCount = 0;
  let declaredBytes = 0;
  let extracted;
  try {
    extracted = unzipSync(bytes, {
      filter(file) {
        declaredCount += 1;
        if (declaredCount > effectiveLimits.entries) throw tooLarge("ZIP archive contains too many entries", { limit: effectiveLimits.entries });
        if (file.originalSize > effectiveLimits.singleFileBytes) {
          throw tooLarge("ZIP entry exceeds the single-file byte limit", { name: file.name, bytes: file.originalSize, limit: effectiveLimits.singleFileBytes });
        }
        declaredBytes += file.originalSize;
        if (declaredBytes > effectiveLimits.expandedBytes) {
          throw tooLarge("ZIP archive exceeds the expanded byte limit", { bytes: declaredBytes, limit: effectiveLimits.expandedBytes });
        }
        return true;
      },
    });
  } catch (error) {
    if (error instanceof SkillManagerError) throw error;
    throw unsafeArchive("ZIP archive could not be extracted", { cause: String(error.message) });
  }

  const actualEntries = Object.entries(extracted);
  if (actualEntries.length !== declaredCount) throw unsafeArchive("ZIP entry count changed during extraction");
  let totalBytes = 0;
  for (const [, data] of actualEntries) {
    if (data.byteLength > effectiveLimits.singleFileBytes) {
      throw tooLarge("ZIP entry exceeds the single-file byte limit", { bytes: data.byteLength, limit: effectiveLimits.singleFileBytes });
    }
    totalBytes += data.byteLength;
    if (totalBytes > effectiveLimits.expandedBytes) {
      throw tooLarge("ZIP archive exceeds the expanded byte limit", { bytes: totalBytes, limit: effectiveLimits.expandedBytes });
    }
  }
  if (totalBytes !== declaredBytes) throw unsafeArchive("ZIP expanded size does not match its metadata");

  const dataByPath = new Map();
  const declaredSizeByPath = new Map();
  for (const entry of relativeEntries) declaredSizeByPath.set(entry.path, entry.originalSize);
  for (const [name, data] of actualEntries) {
    const normalized = normalizeEntryName(name);
    const relative = wrapper ? (normalized.startsWith(`${wrapper}/`) ? normalized.slice(wrapper.length + 1) : null) : normalized;
    if (!relative) throw packageError("ZIP archive contains multiple wrappers");
    if (data.byteLength !== declaredSizeByPath.get(relative)) {
      throw unsafeArchive("ZIP expanded size does not match its metadata", { name });
    }
    dataByPath.set(relative, data);
  }
  if (!dataByPath.has("SKILL.md")) throw packageError("ZIP archive must contain SKILL.md");
  let markdown;
  try {
    markdown = new TextDecoder("utf-8", { fatal: true }).decode(dataByPath.get("SKILL.md"));
  } catch (error) {
    throw packageError("SKILL.md must be valid UTF-8", { cause: String(error.message) });
  }
  const identity = parseSkillMarkdown(markdown);
  const files = [...dataByPath.keys()].sort();

  const absoluteDestination = await assertDestinationPathSafe(destination);
  const parent = dirname(absoluteDestination);
  let staging;
  try {
    await mkdir(parent, { recursive: true });
    await assertDestinationPathSafe(absoluteDestination);
    staging = await mkdtemp(join(parent, ".cpwb-skill-package-"));
    for (const file of files) {
      const target = join(staging, ...file.split("/"));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, dataByPath.get(file), { flag: "wx" });
    }
    await assertDestinationPathSafe(absoluteDestination);
    await rename(staging, absoluteDestination);
    staging = undefined;
  } catch (error) {
    if (staging) await rm(staging, { recursive: true, force: true }).catch(() => {});
    if (error instanceof SkillManagerError) throw error;
    throw materializationError(error);
  }
  return { ...identity, files, fileCount: files.length, totalBytes };
}
