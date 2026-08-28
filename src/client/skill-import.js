import { zip } from "fflate";

export const SKILL_IMPORT_LIMITS = Object.freeze({
  archiveBytes: 50 * 1024 * 1024,
  entries: 1000,
  expandedBytes: 100 * 1024 * 1024,
  singleFileBytes: 50 * 1024 * 1024,
});

export const SKILL_IMPORT_ERROR_CODES = Object.freeze({
  ARCHIVE_TOO_LARGE: "SKILL_ARCHIVE_TOO_LARGE",
  ARCHIVE_UNSAFE: "SKILL_ARCHIVE_UNSAFE",
  PACKAGE_INVALID: "SKILL_PACKAGE_INVALID",
});

export class SkillImportError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "SkillImportError";
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

function packageError(message, details) {
  return new SkillImportError(SKILL_IMPORT_ERROR_CODES.PACKAGE_INVALID, message, details);
}

function unsafePath(message, details) {
  return new SkillImportError(SKILL_IMPORT_ERROR_CODES.ARCHIVE_UNSAFE, message, details);
}

function tooLarge(message, details) {
  return new SkillImportError(SKILL_IMPORT_ERROR_CODES.ARCHIVE_TOO_LARGE, message, details);
}

function asFiles(files) {
  if (files === null || typeof files !== "object" || !Number.isSafeInteger(files.length)) {
    throw packageError("Skill directory selection is invalid");
  }
  return Array.from(files);
}

function validatePath(rawPath) {
  if (typeof rawPath !== "string" || rawPath.length === 0) {
    throw unsafePath("Skill file path is invalid");
  }
  if (rawPath.includes("\0") || rawPath.includes("\\") || rawPath.startsWith("/") || /^[A-Za-z]:/.test(rawPath)) {
    throw unsafePath("Skill file path is unsafe", { path: rawPath });
  }
  const parts = rawPath.split("/");
  if (parts.some((part) => part.length === 0 || part === "." || part === "..")) {
    throw unsafePath("Skill file path is unsafe", { path: rawPath });
  }
  if (parts.length < 2 || parts[0].length === 0) {
    throw packageError("Skill directory must contain one wrapper folder");
  }
  return parts;
}

function readFileBytes(file, path) {
  if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
    throw packageError("Skill directory contains an invalid file", { path });
  }
  return Promise.resolve().then(() => file.arrayBuffer()).then((buffer) => {
    let bytes;
    try {
      bytes = buffer instanceof Uint8Array ? new Uint8Array(buffer) : new Uint8Array(buffer);
    } catch {
      throw packageError("Skill file could not be read", { path });
    }
    return bytes;
  });
}

function zipFiles(entries) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      callback(value);
    };
    try {
      zip(entries, (error, bytes) => {
        if (error) {
          finish(reject, packageError("Skill directory could not be compressed", { cause: String(error.message ?? error) }));
          return;
        }
        finish(resolve, bytes);
      });
    } catch (error) {
      finish(reject, packageError("Skill directory could not be compressed", { cause: String(error?.message ?? error) }));
    }
  });
}

export async function packSkillDirectory(files) {
  const selected = asFiles(files);
  if (selected.length < 1 || selected.length > SKILL_IMPORT_LIMITS.entries) {
    throw packageError("Skill directory must contain between 1 and 1000 files", {
      entries: selected.length,
      limit: SKILL_IMPORT_LIMITS.entries,
    });
  }

  const entries = [];
  const roots = new Set();
  const paths = new Set();
  let declaredBytes = 0;
  for (const file of selected) {
    const parts = validatePath(file?.webkitRelativePath);
    const path = parts.join("/");
    if (paths.has(path)) throw packageError("Skill directory contains duplicate paths", { path });
    paths.add(path);
    roots.add(parts[0]);
    if (!Number.isSafeInteger(file?.size) || file.size < 0) {
      throw packageError("Skill directory contains a file with an invalid size", { path });
    }
    if (file.size > SKILL_IMPORT_LIMITS.singleFileBytes) {
      throw tooLarge("Skill file exceeds the byte limit", { bytes: file.size, limit: SKILL_IMPORT_LIMITS.singleFileBytes, path });
    }
    declaredBytes += file.size;
    if (declaredBytes > SKILL_IMPORT_LIMITS.expandedBytes) {
      throw tooLarge("Skill directory exceeds the expanded byte limit", { bytes: declaredBytes, limit: SKILL_IMPORT_LIMITS.expandedBytes });
    }
    entries.push({ file, path });
  }
  if (roots.size !== 1) throw packageError("Skill directory must contain exactly one wrapper folder");

  const contents = {};
  let actualBytes = 0;
  await Promise.all(entries.map(async ({ file, path }) => {
    const bytes = await readFileBytes(file, path);
    if (bytes.byteLength > SKILL_IMPORT_LIMITS.singleFileBytes) {
      throw tooLarge("Skill file exceeds the byte limit", { bytes: bytes.byteLength, limit: SKILL_IMPORT_LIMITS.singleFileBytes, path });
    }
    actualBytes += bytes.byteLength;
    if (actualBytes > SKILL_IMPORT_LIMITS.expandedBytes) {
      throw tooLarge("Skill directory exceeds the expanded byte limit", { bytes: actualBytes, limit: SKILL_IMPORT_LIMITS.expandedBytes });
    }
    contents[path] = bytes;
  }));

  const archiveBytes = await zipFiles(contents);
  if (archiveBytes.byteLength > SKILL_IMPORT_LIMITS.archiveBytes) {
    throw tooLarge("ZIP archive exceeds the byte limit", { bytes: archiveBytes.byteLength, limit: SKILL_IMPORT_LIMITS.archiveBytes });
  }
  return {
    archive: new Blob([archiveBytes], { type: "application/zip" }),
    sourceName: [...roots][0],
  };
}
