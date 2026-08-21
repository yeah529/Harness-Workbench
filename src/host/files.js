/**
 * Safe file storage for uploaded workbench documents.
 *
 * saveFile streams an upload to a random temporary file under
 * <dataDir>/tmp while computing its SHA-256 and byte count, rejects anything
 * over the size limit, then atomically links the temp file into
 * <dataDir>/files/<sha256> using a create-if-absent hard link. The stored
 * filename is always the content hash, never the original name, so a
 * path-traversal name cannot escape the data directory.
 *
 * Content-addressed storage never trusts a pre-existing file merely because it
 * sits at <files>/<sha256>: if that path already exists its SHA-256 and size
 * are re-computed from disk. A matching object is deduplicated (the freshly
 * written temp copy is dropped); a corrupted or truncated object is atomically
 * replaced with the already-validated temp copy. Concurrent identical uploads
 * therefore collapse to exactly one verified file and never leave temp residue.
 */

import { createHash, randomUUID } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { link, mkdir, rename, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import { resolveDataRoot } from "./config.js";

/** Default upload size cap: 50 MB. */
export const DEFAULT_MAX_BYTES = 50 * 1024 * 1024;

/** Stable error codes surfaced to callers and, later, the HTTP API. */
export const FILE_ERROR_CODES = Object.freeze({
  INVALID_NAME: "EINVAL_NAME",
  NAME_WITH_NUL: "EINVAL_NUL",
  NAME_WITH_PATH: "EINVAL_PATH",
  UNSUPPORTED_EXTENSION: "EUNSUPPORTED_EXTENSION",
  TOO_LARGE: "EFILE_TOO_LARGE",
  INVALID_MAX_BYTES: "EINVAL_MAX_BYTES",
  INVALID_STREAM: "EINVAL_STREAM",
  INVALID_CHUNK: "EINVAL_CHUNK",
});

/** Extensions the workbench accepts for upload (lowercase, no leading dot). */
export const ALLOWED_EXTENSIONS = Object.freeze([
  "txt", "md", "markdown", "html", "htm", "docx", "pptx", "xlsx",
  "js", "ts", "jsx", "tsx", "json", "yaml", "yml", "py", "java",
  "go", "rs", "c", "cpp", "h", "hpp", "css", "sql", "sh",
]);

const ALLOWED_EXTENSION_SET = new Set(ALLOWED_EXTENSIONS);

const MIME_BY_EXTENSION = {
  txt: "text/plain",
  md: "text/markdown",
  markdown: "text/markdown",
  html: "text/html",
  htm: "text/html",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  js: "text/javascript",
  jsx: "text/jsx",
  ts: "text/typescript",
  tsx: "text/tsx",
  json: "application/json",
  yaml: "text/yaml",
  yml: "text/yaml",
  py: "text/x-python",
  java: "text/x-java",
  go: "text/x-go",
  rs: "text/x-rust",
  c: "text/x-c",
  cpp: "text/x-c++",
  h: "text/x-c",
  hpp: "text/x-c++",
  css: "text/css",
  sql: "text/x-sql",
  sh: "text/x-sh",
};

/** Storage error carrying a stable machine-readable code. */
export class FileStorageError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "FileStorageError";
    this.code = code;
  }
}
function formatMegabytes(bytes) {
  const mb = bytes / (1024 * 1024);
  return (Number.isInteger(mb) ? String(mb) : mb.toFixed(1)) + " MB";
}

/** Lowercase extension without the leading dot, or "" when absent. */
function extractExtension(name) {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return ""; // no dot, or a leading-dot file like ".markdown"
  return name.slice(dot + 1).toLowerCase();
}

/**
 * Validate an upload's original file name.
 *
 * Rejects non-strings, empty names, NUL bytes, "." / "..", and any name that
 * carries a path component (either separator). Returns the lowercased
 * extension after confirming it is allowed.
 */
function validateOriginalName(originalName) {
  if (typeof originalName !== "string") {
    throw new FileStorageError(FILE_ERROR_CODES.INVALID_NAME, "originalName must be a string");
  }
  if (originalName.length === 0) {
    throw new FileStorageError(FILE_ERROR_CODES.INVALID_NAME, "originalName must not be empty");
  }
  if (originalName.includes("\0")) {
    throw new FileStorageError(FILE_ERROR_CODES.NAME_WITH_NUL, "originalName must not contain a NUL byte");
  }
  if (originalName === "." || originalName === "..") {
    throw new FileStorageError(FILE_ERROR_CODES.NAME_WITH_PATH, "originalName must not be a path component");
  }
  if (originalName.includes("/") || originalName.includes("\\")) {
    throw new FileStorageError(FILE_ERROR_CODES.NAME_WITH_PATH, "originalName must not contain path separators");
  }
  const extension = extractExtension(originalName);
  if (!ALLOWED_EXTENSION_SET.has(extension)) {
    throw new FileStorageError(
      FILE_ERROR_CODES.UNSUPPORTED_EXTENSION,
      "unsupported file extension: " + (extension || "(none)"),
    );
  }
  return { originalName, extension };
}

/**
 * Validate the size cap.
 *
 * maxBytes must be a non-negative safe integer: any non-number, negative,
 * fractional, unsafe, or non-finite value is rejected up front so the storage
 * meter can rely on an exact byte limit.
 */
function validateMaxBytes(maxBytes) {
  if (typeof maxBytes !== "number" || !Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new FileStorageError(
      FILE_ERROR_CODES.INVALID_MAX_BYTES,
      "maxBytes must be a non-negative safe integer",
    );
  }
}

/** Coerce one stream chunk into a Buffer for hashing and writing. */
function asBuffer(chunk) {
  if (Buffer.isBuffer(chunk)) return chunk;
  if (typeof chunk === "string") return Buffer.from(chunk, "utf8");
  if (chunk instanceof Uint8Array) return Buffer.from(chunk);
  if (chunk instanceof ArrayBuffer) return Buffer.from(chunk);
  throw new FileStorageError(FILE_ERROR_CODES.INVALID_CHUNK, "stream produced an unsupported chunk type");
}

/** Normalize a Node/async-iterable/web stream into a Node Readable. */
function asReadable(stream) {
  if (stream && typeof stream.pipe === "function") return stream;
  if (stream && typeof stream[Symbol.asyncIterator] === "function") return Readable.from(stream);
  throw new FileStorageError(FILE_ERROR_CODES.INVALID_STREAM, "stream must be a readable stream");
}

/**
 * Stream a file from disk and recompute its SHA-256 and byte count.
 *
 * Used to re-verify an object that already exists at the content-addressed
 * path: existence alone proves nothing, so the bytes on disk are hashed again
 * and compared against the freshly computed upload hash and size.
 *
 * @returns {Promise<{ sha256: string, size: number }>}
 */
async function hashFile(path) {
  const hash = createHash("sha256");
  let size = 0;
  for await (const chunk of createReadStream(path)) {
    const buf = asBuffer(chunk);
    size += buf.length;
    hash.update(buf);
  }
  return { sha256: hash.digest("hex"), size };
}

/**
 * Move the already-validated temp copy to its content-addressed home.
 *
 * Uses an atomic create-if-absent hard link (link(2) fails with EEXIST when
 * the destination already exists) so concurrent deduplication never relies on
 * a racy access-then-rename check. When the destination is already present its
 * bytes are re-hashed:
 *
 *   - matching hash and size  -> drop the temp copy (idempotent dedupe);
 *   - corrupt/truncated       -> atomically replace it with the temp copy via
 *                                rename, which is already fully validated.
 *
 * @param {string} tmpPath validated temp file (always the exact expected bytes)
 * @param {string} finalPath <files>/<sha256> destination
 * @param {string} expectedSha256 hash computed while streaming the upload
 * @param {number} expectedSize byte count computed while streaming the upload
 */
async function installFile(tmpPath, finalPath, expectedSha256, expectedSize) {
  try {
    await link(tmpPath, finalPath);
    await rm(tmpPath, { force: true }).catch(() => {});
    return;
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }

  // Destination already exists: never trust it on sight, re-verify its bytes.
  const existing = await hashFile(finalPath);
  if (existing.sha256 === expectedSha256 && existing.size === expectedSize) {
    await rm(tmpPath, { force: true }).catch(() => {});
    return;
  }

  // Corrupted or truncated: atomically replace with the validated temp copy.
  await rename(tmpPath, finalPath);
}

/**
 * Persist one uploaded file by content hash.
 *
 * @param {object} options
 * @param {AsyncIterable<Buffer|Uint8Array|string>} options.stream upload body
 * @param {string} options.originalName caller-supplied base file name
 * @param {number} [options.maxBytes] size cap (defaults to 50 MB)
 * @param {string} options.dataDir data root; files/ and tmp/ are created below it
 * @returns {Promise<{ sha256: string, path: string, originalName: string, extension: string, size: number, mimeType: string|null }>}
 */
export async function saveFile({ stream, originalName, maxBytes = DEFAULT_MAX_BYTES, dataDir }) {
  validateMaxBytes(maxBytes);
  const { extension } = validateOriginalName(originalName);

  const root = resolve(resolveDataRoot({ dataDir }));
  await mkdir(join(root, "tmp"), { recursive: true });
  await mkdir(join(root, "files"), { recursive: true });

  const tmpPath = join(root, "tmp", randomUUID());
  const hash = createHash("sha256");
  let size = 0;

  const meter = new Transform({
    writableObjectMode: true,
    transform(chunk, _encoding, callback) {
      const buf = asBuffer(chunk);
      size += buf.length;
      if (size > maxBytes) {
        callback(new FileStorageError(
          FILE_ERROR_CODES.TOO_LARGE,
          "file exceeds the " + formatMegabytes(maxBytes) + " limit",
        ));
        return;
      }
      hash.update(buf);
      callback(null, buf);
    },
  });

  try {
    await pipeline(asReadable(stream), meter, createWriteStream(tmpPath, { flags: "wx" }));
  } catch (err) {
    await rm(tmpPath, { force: true }).catch(() => {});
    throw err;
  }

  const sha256 = hash.digest("hex");
  const finalPath = join(root, "files", sha256);

  try {
    await installFile(tmpPath, finalPath, sha256, size);
  } catch (err) {
    await rm(tmpPath, { force: true }).catch(() => {});
    throw err;
  }

  return {
    sha256,
    path: finalPath,
    originalName,
    extension,
    size,
    mimeType: MIME_BY_EXTENSION[extension] ?? null,
  };
}
