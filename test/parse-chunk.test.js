/**
 * Uploaded-file storage, parser, and chunker tests.
 *
 * Task 3A covers the safe file store (saveFile). Task 3B1 adds the
 * non-Office parser (parseDocument) and its text fixtures; Office formats
 * and chunking are covered by the remaining Task 3 steps.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, basename, dirname } from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

import { saveFile, FILE_ERROR_CODES } from "../src/host/files.js";
import { parseDocument, PARSE_ERROR_CODES, OFFICE_DECOMPRESSION_LIMITS } from "../src/host/parse.js";
import { chunkSections, CHUNK_RULE_VERSION, CHUNK_TARGET_CODE_POINTS, CHUNK_MAX_CODE_POINTS, CHUNK_MAX_OVERLAP_CODE_POINTS } from "../src/host/chunk.js";
import { createTempDir, removeTempDir } from "./helpers.js";

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

const fixture = (name) => join(dirname(fileURLToPath(import.meta.url)), "fixtures", name);

/** Count non-overlapping occurrences of a literal substring. */
const countOccurrences = (haystack, needle) => haystack.split(needle).length - 1;

/** Number of Unicode code points in a string. */
const cplen = (s) => Array.from(s).length;

/** True when a string contains a lone (unpaired) UTF-16 surrogate half. */
const hasLoneSurrogate = (s) => {
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = s.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
      i += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
};

/** Longest code-point suffix of `a` that is also a code-point prefix of `b`. */
const sharedOverlap = (a, b) => {
  const ac = Array.from(a);
  const bc = Array.from(b);
  const limit = Math.min(ac.length, bc.length);
  for (let k = limit; k > 0; k--) {
    let ok = true;
    for (let i = 0; i < k; i++) {
      if (ac[ac.length - k + i] !== bc[i]) { ok = false; break; }
    }
    if (ok) return k;
  }
  return 0;
};

test("saveFile stores a stream by sha256 and returns JSON-safe metadata", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const part1 = Buffer.from("netrunner ");
  const part2 = Buffer.from("knowledge base\nsecond line\n");
  const content = Buffer.concat([part1, part2]);

  const meta = await saveFile({
    stream: Readable.from([part1, part2]),
    originalName: "guide.md",
    dataDir,
  });

  assert.equal(meta.sha256, sha256(content));
  assert.equal(meta.originalName, "guide.md");
  assert.equal(meta.extension, "md");
  assert.equal(meta.mimeType, "text/markdown");
  assert.equal(meta.size, content.length);
  assert.equal(basename(meta.path), meta.sha256);
  assert.ok(!meta.path.includes("guide.md"), "stored path never contains the original name");

  assert.deepEqual(await readFile(meta.path), content, "stored bytes match the upload exactly");
  assert.deepEqual(await readdir(join(dataDir, "files")), [meta.sha256], "one file named by its hash");
  assert.deepEqual(await readdir(join(dataDir, "tmp")), [], "no temp residue after success");
});
test("re-saving identical content deduplicates to one physical file", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const content = Buffer.from("same bytes, uploaded twice");
  const first = await saveFile({ stream: Readable.from([content]), originalName: "a.txt", dataDir });
  const second = await saveFile({ stream: Readable.from([content]), originalName: "b.txt", dataDir });

  assert.equal(second.sha256, first.sha256);
  assert.equal(second.path, first.path);
  assert.equal(second.originalName, "b.txt", "metadata keeps the current upload's name");
  assert.equal((await readdir(join(dataDir, "files"))).length, 1, "content is stored exactly once");
  assert.deepEqual(await readdir(join(dataDir, "tmp")), [], "no temp residue on duplicate");
});

test("concurrent saves of identical content collapse to one verified file", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const content = Buffer.from("same content uploaded concurrently");
  const expected = sha256(content);

  const results = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      saveFile({ stream: Readable.from([content]), originalName: `c${i}.txt`, dataDir }),
    ),
  );

  for (const meta of results) {
    assert.equal(meta.sha256, expected);
    assert.equal(meta.size, content.length);
  }
  assert.deepEqual(await readdir(join(dataDir, "files")), [expected], "exactly one hash-named file");
  assert.deepEqual(await readFile(join(dataDir, "files", expected)), content, "stored bytes match the upload");
  assert.deepEqual(await readdir(join(dataDir, "tmp")), [], "no temp residue under concurrency");
});

test("duplicate upload repairs a corrupted/truncated object so bytes and hash are correct", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const content = Buffer.from("canonical bytes");
  const first = await saveFile({ stream: Readable.from([content]), originalName: "a.txt", dataDir });
  const expected = sha256(content);

  // A damaged object already sits at the content-addressed path. saveFile must
  // not trust it on sight: it re-hashes the file on disk and, finding it wrong,
  // atomically repairs it with the freshly validated upload.
  for (const damaged of ["TAMPERED", Buffer.alloc(content.length, 0x00)]) {
    await writeFile(first.path, damaged);
    const second = await saveFile({ stream: Readable.from([content]), originalName: "b.txt", dataDir });

    assert.equal(second.path, first.path);
    assert.equal(second.sha256, expected);
    assert.deepEqual(await readFile(first.path), content, "corrupted object is atomically repaired");
    assert.equal(sha256(await readFile(first.path)), expected, "repaired bytes hash to the expected sha256");
    assert.deepEqual(await readdir(join(dataDir, "tmp")), [], "no temp residue after repair");
    assert.deepEqual(await readdir(join(dataDir, "files")), [expected], "still exactly one stored file");
  }
});

test("rejects path traversal and path-component names", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  for (const name of ["../../etc/passwd.md", "/etc/passwd.md", "..\\..\\evil.md", "subdir/note.txt", "..", "."]) {
    await assert.rejects(
      () => saveFile({ stream: Readable.from([Buffer.from("x")]), originalName: name, dataDir }),
      (err) => err && err.code === FILE_ERROR_CODES.NAME_WITH_PATH,
      "expected rejection for: " + name,
    );
  }

  assert.deepEqual(await readdir(dataDir), [], "rejected names create nothing on disk");
});

test("rejects names containing a NUL byte", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  await assert.rejects(
    () => saveFile({ stream: Readable.from([Buffer.from("x")]), originalName: "ok.md\0.exe", dataDir }),
    (err) => err && err.code === FILE_ERROR_CODES.NAME_WITH_NUL,
  );
  assert.deepEqual(await readdir(dataDir), []);
});

test("rejects non-string or empty original names", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  for (const name of [null, undefined, 42, {}, [], ""]) {
    await assert.rejects(
      () => saveFile({ stream: Readable.from([Buffer.from("x")]), originalName: name, dataDir }),
      (err) => err && err.code === FILE_ERROR_CODES.INVALID_NAME,
      "expected rejection for: " + String(name),
    );
  }
  assert.deepEqual(await readdir(dataDir), []);
});

test("rejects unsupported extensions", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  for (const name of ["payload.exe", "archive.zip", "notes.pdf", "noext", ".hidden"]) {
    await assert.rejects(
      () => saveFile({ stream: Readable.from([Buffer.from("x")]), originalName: name, dataDir }),
      (err) => err && err.code === FILE_ERROR_CODES.UNSUPPORTED_EXTENSION,
      "expected rejection for: " + name,
    );
  }
  assert.deepEqual(await readdir(dataDir), []);
});

test("rejects invalid maxBytes values with EINVAL_MAX_BYTES", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  for (const bad of [-1, 1.5, NaN, Infinity, "10", null, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(
      () => saveFile({ stream: Readable.from([Buffer.from("x")]), originalName: "a.txt", dataDir, maxBytes: bad }),
      (err) => err && err.code === FILE_ERROR_CODES.INVALID_MAX_BYTES,
      "expected rejection for maxBytes: " + String(bad),
    );
  }
  assert.deepEqual(await readdir(dataDir), [], "invalid maxBytes creates nothing on disk");
});

test("stream chunks of an unsupported type get a dedicated EINVAL_CHUNK code", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  await assert.rejects(
    () => saveFile({ stream: Readable.from([{ notABuffer: true }]), originalName: "a.txt", dataDir }),
    (err) => err && err.code === FILE_ERROR_CODES.INVALID_CHUNK,
  );
  assert.deepEqual(await readdir(join(dataDir, "tmp")), [], "no temp residue after a chunk type error");
  assert.deepEqual(await readdir(join(dataDir, "files")), [], "no stored file after a chunk type error");
});

test("rejects streams over maxBytes and removes the temp file", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const maxBytes = 10;
  const oversized = Buffer.alloc(25, 0x61);

  await assert.rejects(
    () => saveFile({ stream: Readable.from([oversized]), originalName: "big.txt", dataDir, maxBytes }),
    (err) => err && err.code === FILE_ERROR_CODES.TOO_LARGE,
  );

  assert.deepEqual(await readdir(join(dataDir, "files")), [], "no stored file on overflow");
  assert.deepEqual(await readdir(join(dataDir, "tmp")), [], "temp file removed after overflow");
});

test("removes the temp file when the stream errors mid-upload", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  async function* broken() {
    yield Buffer.from("partial data");
    throw new Error("connection reset");
  }

  await assert.rejects(
    () => saveFile({ stream: Readable.from(broken()), originalName: "partial.txt", dataDir }),
    /connection reset/,
  );

  assert.deepEqual(await readdir(join(dataDir, "files")), []);
  assert.deepEqual(await readdir(join(dataDir, "tmp")), []);
});

test("parseDocument parses a Chinese TXT file into line sections", async () => {
  const result = await parseDocument({
    path: fixture("chinese.txt"),
    originalName: "chinese.txt",
    mimeType: "text/plain",
  });

  assert.deepEqual(
    result.sections.map((s) => s.locator),
    ["line:1", "line:2", "line:3"],
  );
  assert.deepEqual(
    result.sections.map((s) => s.text),
    ["你好，世界", "赛博朋克工作台知识库", "第三行验证行号定位"],
  );
  assert.ok(result.sections.every((s) => s.kind === "line"));
});

test("parseDocument parses Markdown headings and paragraphs with stable locators", async () => {
  const result = await parseDocument({
    path: fixture("sample.md"),
    originalName: "sample.md",
    mimeType: "text/markdown",
  });

  const headings = result.sections.filter((s) => s.kind === "heading");
  assert.equal(headings.length, 2);
  assert.deepEqual(headings[0], { text: "第一章 概述", locator: "line:1", kind: "heading" });
  assert.deepEqual(headings[1], { text: "第二章 细节", locator: "line:5", kind: "heading" });

  const paragraphs = result.sections.filter((s) => s.kind === "paragraph");
  assert.equal(paragraphs.length, 2);
  assert.deepEqual(paragraphs[0], { text: "这是第一段中文内容。", locator: "lines:3-3", kind: "paragraph" });
  assert.deepEqual(paragraphs[1], { text: "这是第二段内容。", locator: "lines:7-7", kind: "paragraph" });
});

test("parseDocument drops HTML script/style and tags via html-to-text", async () => {
  const result = await parseDocument({
    path: fixture("sample.html"),
    originalName: "sample.html",
    mimeType: "text/html",
  });

  const text = result.sections.map((s) => s.text).join("\n");
  assert.match(text, /赛博朋克主页/);
  assert.match(text, /正文段落一/);
  assert.match(text, /正文段落二/);
  assert.doesNotMatch(text, /should not appear/);
  assert.doesNotMatch(text, /injected/);
  assert.doesNotMatch(text, /\.hidden/);
  assert.doesNotMatch(text, /color: red/);
  assert.ok(result.sections.every((s) => s.kind === "text"));
});

test("parseDocument gives code files stable lines:A-B locators", async () => {
  const result = await parseDocument({
    path: fixture("sample.js"),
    originalName: "sample.js",
    mimeType: "text/javascript",
  });

  assert.deepEqual(
    result.sections.map((s) => s.locator),
    ["lines:1-1", "lines:3-5", "lines:7-7"],
  );
  assert.ok(result.sections.every((s) => s.kind === "code"));
  assert.equal(result.sections[1].text, "function greet(name) {\n  return `hello ${name}`;\n}");
});

test("parseDocument rejects binary content containing a NUL byte", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const path = join(dataDir, "binary.txt");
  await writeFile(path, Buffer.from([0x68, 0x00, 0x69]));

  await assert.rejects(
    () => parseDocument({ path, originalName: "binary.txt", mimeType: "text/plain" }),
    (err) => err && err.code === PARSE_ERROR_CODES.BINARY_CONTENT,
  );
});

test("parseDocument rejects extracted text over the 20 MB limit", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const path = join(dataDir, "huge.txt");
  await writeFile(path, "a".repeat(20 * 1024 * 1024 + 1), "utf8");

  await assert.rejects(
    () => parseDocument({ path, originalName: "huge.txt", mimeType: "text/plain" }),
    (err) => err && err.code === PARSE_ERROR_CODES.TEXT_TOO_LARGE,
  );
});

test("parseDocument returns empty sections for an empty file", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const path = join(dataDir, "empty.md");
  await writeFile(path, "", "utf8");

  const result = await parseDocument({ path, originalName: "empty.md", mimeType: "text/markdown" });
  assert.deepEqual(result, { sections: [] });
});

test("parseDocument rejects unsupported types", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const path = join(dataDir, "payload");
  await writeFile(path, "x");

  for (const name of ["archive.zip", "noext", ".hidden", "legacy.doc", "slides.ppt"]) {
    await assert.rejects(
      () => parseDocument({ path, originalName: name, mimeType: null }),
      (err) => err && err.code === PARSE_ERROR_CODES.UNSUPPORTED_TYPE,
      "expected rejection for: " + name,
    );
  }
});

test("Office decompression limits are strict finite positive integers", () => {
  for (const [key, value] of Object.entries(OFFICE_DECOMPRESSION_LIMITS)) {
    assert.ok(Number.isSafeInteger(value) && value > 0, key + " must be a positive finite integer");
  }
});

test("Office fixtures are real PK ZIP archives, not renamed text", async () => {
  for (const name of ["sample.docx", "sample.pptx", "sample.xlsx"]) {
    const bytes = await readFile(fixture(name));
    assert.deepEqual(
      [...bytes.subarray(0, 4)],
      [0x50, 0x4b, 0x03, 0x04],
      name + " must start with a PK ZIP local-file-header signature",
    );
  }
});

test("parseDocument parses DOCX headings, paragraphs and tables with stable locators", async () => {
  const result = await parseDocument({
    path: fixture("sample.docx"),
    originalName: "sample.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const headings = result.sections.filter((s) => s.kind === "heading");
  assert.deepEqual(headings.map((s) => s.text), ["第一章 概述"]);
  assert.deepEqual(headings[0], { text: "第一章 概述", locator: "heading:1", kind: "heading" });

  const paragraphs = result.sections.filter((s) => s.kind === "paragraph");
  assert.equal(paragraphs.length, 2);
  assert.deepEqual(paragraphs[0], { text: "这是第一段中文内容。", locator: "paragraph:1", kind: "paragraph" });
  assert.deepEqual(paragraphs[1], { text: "赛博朋克工作台知识库", locator: "paragraph:2", kind: "paragraph" });

  const tables = result.sections.filter((s) => s.kind === "table");
  assert.equal(tables.length, 1);
  assert.equal(tables[0].locator, "table:1");
  assert.match(tables[0].text, /表头甲/);
  assert.match(tables[0].text, /数据二/);

  // No parent/child double-counting: each key string appears exactly once
  // across the whole extracted text.
  const docxText = result.sections.map((s) => s.text).join("\n");
  for (const key of ["第一章 概述", "这是第一段中文内容。", "赛博朋克工作台知识库", "表头甲", "表头乙", "数据一", "数据二"]) {
    assert.equal(countOccurrences(docxText, key), 1, key + " must appear exactly once (no double-count)");
  }
});

test("parseDocument merges each PPTX slide into one section with a slide:N locator", async () => {
  const result = await parseDocument({
    path: fixture("sample.pptx"),
    originalName: "sample.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });

  const slides = result.sections.filter((s) => s.kind === "slide");
  assert.equal(slides.length, 2);
  assert.deepEqual(slides.map((s) => s.locator), ["slide:1", "slide:2"]);
  assert.match(slides[0].text, /第一页标题/);
  assert.match(slides[0].text, /第一页正文内容/);
  assert.doesNotMatch(slides[0].text, /第二页/);
  assert.match(slides[1].text, /第二页标题/);
  assert.match(slides[1].text, /第二页正文内容/);

  // No parent/child double-counting: each slide's strings appear exactly once.
  const pptxText = result.sections.map((s) => s.text).join("\n");
  for (const key of ["第一页标题", "第一页正文内容", "第二页标题", "第二页正文内容"]) {
    assert.equal(countOccurrences(pptxText, key), 1, key + " must appear exactly once (no double-count)");
  }
});

test("parseDocument emits one XLSX section per sheet with its real name and used range", async () => {
  const result = await parseDocument({
    path: fixture("sample.xlsx"),
    originalName: "sample.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const sheets = result.sections.filter((s) => s.kind === "sheet");
  assert.equal(sheets.length, 1);
  assert.equal(sheets[0].locator, "sheet:项目计划 cells:A1:B3");
  assert.match(sheets[0].text, /任务/);
  assert.match(sheets[0].text, /渗透测试/);
  assert.match(sheets[0].text, /朱迪/);
});

test("parseDocument maps officeparser ZIP size limits to a stable ParseError with a cause", async () => {
  await assert.rejects(
    () => parseDocument({
      path: fixture("sample.docx"),
      originalName: "sample.docx",
      mimeType: null,
      decompressionLimits: { maxUncompressedBytes: 10 },
    }),
    (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_ZIP_SIZE_LIMIT && err.cause instanceof Error,
  );
});

test("parseDocument maps officeparser ZIP entry-count limits to a stable ParseError with a cause", async () => {
  await assert.rejects(
    () => parseDocument({
      path: fixture("sample.docx"),
      originalName: "sample.docx",
      mimeType: null,
      decompressionLimits: { maxZipEntries: 2 },
    }),
    (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_ZIP_ENTRY_LIMIT && err.cause instanceof Error,
  );
});

test("parseDocument rejects invalid decompressionLimits overrides before officeparser runs", async () => {
  const base = { path: fixture("sample.docx"), originalName: "sample.docx", mimeType: null };

  // Invalid values: Infinity, 0, negative, non-integer, NaN, and strings.
  for (const value of [Infinity, 0, -1, 1.5, NaN, "10"]) {
    await assert.rejects(
      () => parseDocument({ ...base, decompressionLimits: { maxUncompressedBytes: value } }),
      (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
      "expected rejection for maxUncompressedBytes: " + String(value),
    );
  }

  // A value above a default can never raise the bound.
  await assert.rejects(
    () => parseDocument({ ...base, decompressionLimits: { maxUncompressedBytes: OFFICE_DECOMPRESSION_LIMITS.maxUncompressedBytes + 1 } }),
    (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
  );
  await assert.rejects(
    () => parseDocument({ ...base, decompressionLimits: { maxZipEntries: OFFICE_DECOMPRESSION_LIMITS.maxZipEntries + 1 } }),
    (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
  );
  await assert.rejects(
    () => parseDocument({ ...base, decompressionLimits: { maxTableCells: OFFICE_DECOMPRESSION_LIMITS.maxTableCells + 1 } }),
    (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
  );

  // Unknown keys are rejected.
  await assert.rejects(
    () => parseDocument({ ...base, decompressionLimits: { maxUncompressedBytes: 10, extraKey: 1 } }),
    (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
  );

  // Non-object overrides are rejected.
  for (const bad of ["64", [], 42]) {
    await assert.rejects(
      () => parseDocument({ ...base, decompressionLimits: bad }),
      (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
      "expected rejection for decompressionLimits: " + String(bad),
    );
  }
});

test("parseDocument maps a corrupt Office file to OFFICE_PARSE_FAILED without swallowing the cause", async (t) => {
  const dataDir = await createTempDir();
  t.after(() => removeTempDir(dataDir));

  const path = join(dataDir, "fake.docx");
  await writeFile(path, "this is not a zip archive");

  await assert.rejects(
    () => parseDocument({ path, originalName: "fake.docx", mimeType: null }),
    (err) => err && err.code === PARSE_ERROR_CODES.OFFICE_PARSE_FAILED && err.cause instanceof Error,
  );
});
test("chunk rule constants are fixed and match the design limits", () => {
  assert.equal(CHUNK_RULE_VERSION, "1");
  assert.ok(Number.isSafeInteger(CHUNK_TARGET_CODE_POINTS) && CHUNK_TARGET_CODE_POINTS > 0);
  assert.ok(Number.isSafeInteger(CHUNK_MAX_CODE_POINTS) && CHUNK_MAX_CODE_POINTS >= CHUNK_TARGET_CODE_POINTS);
  assert.ok(Number.isSafeInteger(CHUNK_MAX_OVERLAP_CODE_POINTS) && CHUNK_MAX_OVERLAP_CODE_POINTS >= 0);
  assert.ok(CHUNK_MAX_CODE_POINTS <= 1200);
  assert.ok(CHUNK_MAX_OVERLAP_CODE_POINTS <= 120);
});

test("chunkSections is deterministic with contiguous ordinals and exact content hashes", () => {
  const sections = [
    { text: "第一段内容。", locator: "lines:1-1", kind: "paragraph" },
    { text: "const netrunner = 'V';", locator: "lines:3-3", kind: "code" },
  ];
  const input = { documentId: 42, originalName: "doc.md", sections };
  const first = chunkSections(input);
  const second = chunkSections(input);

  assert.deepEqual(second, first, "same input yields identical chunks field-for-field");
  assert.deepEqual(first.map((c) => c.ordinal), [0, 1], "ordinals start at 0 and increase by 1");
  assert.equal(first[0].documentId, 42);
  assert.equal(first[0].originalName, "doc.md");
  assert.equal(first[0].kind, "paragraph");
  assert.equal(
    first[0].contentHash,
    sha256(Buffer.from("42\u0000lines:1-1\u0000第一段内容。", "utf8")),
    "contentHash is sha256(documentId + NUL + locator + NUL + text)",
  );
});

test("chunkSections measures text in code points so Chinese and emoji never exceed 1200", async () => {
  const parsed = await parseDocument({
    path: fixture("chinese.txt"),
    originalName: "chinese.txt",
    mimeType: "text/plain",
  });
  const chunks = chunkSections({ documentId: 1, originalName: "chinese.txt", sections: parsed.sections });
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].locator, "line:1..line:3");
  assert.equal(chunks[0].text, "你好，世界\n赛博朋克工作台知识库\n第三行验证行号定位");
  assert.ok(chunks.every((c) => cplen(c.text) <= CHUNK_MAX_CODE_POINTS));

  const emoji = chunkSections({
    documentId: 2,
    originalName: "emoji.txt",
    sections: [{ text: "😀".repeat(1500), locator: "line:1", kind: "line" }],
  });
  assert.ok(emoji.length > 1, "astral text must be split by code points");
  assert.ok(emoji.every((c) => cplen(c.text) <= CHUNK_MAX_CODE_POINTS));
  assert.ok(emoji.every((c) => !hasLoneSurrogate(c.text)), "no surrogate pair is cut in half");
  const total = emoji.reduce((n, c) => n + cplen(c.text), 0);
  assert.equal(total, 1500 + (emoji.length - 1) * CHUNK_MAX_OVERLAP_CODE_POINTS, "overlap accounts for the exact tail/head sharing");
});

test("chunkSections splits a long run with no spaces without exceeding 1200 code points", () => {
  const text = "甲".repeat(3000);
  const chunks = chunkSections({
    documentId: 1,
    originalName: "long.txt",
    sections: [{ text, locator: "line:1", kind: "line" }],
  });
  assert.ok(chunks.length > 1, "a 3000-code-point run must be split");
  assert.ok(chunks.every((c) => cplen(c.text) <= CHUNK_MAX_CODE_POINTS));
  assert.ok(chunks[0].text.startsWith("甲"));
  assert.ok(chunks[chunks.length - 1].text.endsWith("甲"), "coverage reaches the end of the input");
});

test("chunkSections overlap between adjacent chunks never exceeds 120 code points", () => {
  const text = Array.from({ length: 2500 }, (_, i) => String.fromCodePoint(0x4e00 + i)).join("");
  const chunks = chunkSections({
    documentId: 1,
    originalName: "o.txt",
    sections: [{ text, locator: "line:1", kind: "line" }],
  });
  assert.ok(chunks.length > 1);
  for (let i = 1; i < chunks.length; i++) {
    const overlap = sharedOverlap(chunks[i - 1].text, chunks[i].text);
    assert.ok(overlap >= 0 && overlap <= CHUNK_MAX_OVERLAP_CODE_POINTS, "overlap " + overlap + " must be within 0..120");
  }
  const total = chunks.reduce((n, c) => n + cplen(c.text), 0);
  assert.equal(total, 2500 + (chunks.length - 1) * CHUNK_MAX_OVERLAP_CODE_POINTS, "hard-cut overlap is exactly 120 code points with no gap");
});

test("chunkSections attaches a Markdown heading as context without changing the source locator", () => {
  const chunks = chunkSections({
    documentId: 1,
    originalName: "sample.md",
    sections: [
      { text: "第一章 概述", locator: "line:1", kind: "heading" },
      { text: "这是第一段中文内容。", locator: "lines:3-3", kind: "paragraph" },
      { text: "第二章 细节", locator: "line:5", kind: "heading" },
      { text: "这是第二段内容。", locator: "lines:7-7", kind: "paragraph" },
    ],
  });
  assert.deepEqual(chunks.map((c) => c.locator), ["lines:3-3", "lines:7-7"], "body locators are untouched");
  assert.deepEqual(chunks.map((c) => c.heading), ["第一章 概述", "第二章 细节"]);
  assert.deepEqual(chunks.map((c) => c.text), ["这是第一段中文内容。", "这是第二段内容。"]);
});

test("chunkSections never merges across PPTX slides", async () => {
  const parsed = await parseDocument({
    path: fixture("sample.pptx"),
    originalName: "sample.pptx",
    mimeType: null,
  });
  const chunks = chunkSections({ documentId: 1, originalName: "sample.pptx", sections: parsed.sections });
  const slides = chunks.filter((c) => c.kind === "slide");
  assert.equal(slides.length, 2);
  assert.deepEqual(slides.map((c) => c.locator), ["slide:1", "slide:2"]);
  assert.match(slides[0].text, /第一页标题/);
  assert.doesNotMatch(slides[0].text, /第二页/);
  assert.match(slides[1].text, /第二页标题/);

  const synthetic = chunkSections({
    documentId: 2,
    originalName: "long.pptx",
    sections: [
      { text: "SLIDE1 " + "a".repeat(1500), locator: "slide:1", kind: "slide" },
      { text: "SLIDE2 " + "b".repeat(200), locator: "slide:2", kind: "slide" },
    ],
  });
  assert.ok(synthetic.every((c) => c.locator === "slide:1" || c.locator === "slide:2"));
  assert.ok(synthetic.filter((c) => c.locator === "slide:1").every((c) => !c.text.includes("SLIDE2")));
  assert.ok(synthetic.some((c) => c.locator === "slide:2" && c.text.includes("SLIDE2")));
});

test("chunkSections never merges across XLSX sheets", () => {
  const chunks = chunkSections({
    documentId: 1,
    originalName: "multi.xlsx",
    sections: [
      { text: "任务\t负责人\n渗透测试\t朱迪", locator: "sheet:计划 cells:A1:B2", kind: "sheet" },
      { text: "任务\t负责人\n数据备份\t帕南", locator: "sheet:运维 cells:A1:B2", kind: "sheet" },
    ],
  });
  assert.equal(chunks.length, 2);
  assert.deepEqual(chunks.map((c) => c.locator), ["sheet:计划 cells:A1:B2", "sheet:运维 cells:A1:B2"]);
  assert.match(chunks[0].text, /渗透测试/);
  assert.doesNotMatch(chunks[0].text, /数据备份/);
  assert.match(chunks[1].text, /数据备份/);
});

test("chunkSections updates code locators to real lines:A-B and preserves every line", () => {
  const lines = [];
  for (let i = 1; i <= 100; i++) {
    lines.push("const value" + String(i).padStart(3, "0") + " = compute(" + i + "); // padding to make this block long enough to split");
  }
  const codeText = lines.join("\n");
  const chunks = chunkSections({
    documentId: 1,
    originalName: "big.js",
    sections: [{ text: codeText, locator: "lines:10-109", kind: "code" }],
  });

  assert.ok(chunks.length > 1, "an oversized code block must be split");
  assert.ok(chunks.every((c) => /^lines:\d+-\d+$/.test(c.locator)));
  assert.ok(chunks.every((c) => cplen(c.text) <= CHUNK_MAX_CODE_POINTS));
  assert.equal(chunks.map((c) => c.text).join(""), codeText, "no line is lost, re-ordered, or duplicated");

  const ranges = chunks.map((c) => {
    const m = /^lines:(\d+)-(\d+)$/.exec(c.locator);
    return { start: Number(m[1]), end: Number(m[2]) };
  });
  assert.equal(ranges[0].start, 10);
  assert.equal(ranges[ranges.length - 1].end, 109);
  for (let i = 1; i < ranges.length; i++) {
    assert.equal(ranges[i].start, ranges[i - 1].end + 1, "line ranges are contiguous and never overlap");
  }
});

test("chunkSections never breaks a CRLF pair or a Unicode code point", () => {
  const crlf = "let a = 1;\r\nlet b = 2;\r\nlet c = 3;\r\n";
  const crlfChunks = chunkSections({
    documentId: 1,
    originalName: "crlf.js",
    sections: [{ text: crlf, locator: "lines:1-3", kind: "code" }],
  });
  assert.equal(crlfChunks.map((c) => c.text).join(""), crlf, "CRLF sequences are preserved exactly");

  const mixed = "前缀😀后缀".repeat(400);
  const mixedChunks = chunkSections({
    documentId: 2,
    originalName: "mixed.txt",
    sections: [{ text: mixed, locator: "line:1", kind: "line" }],
  });
  assert.ok(mixedChunks.every((c) => cplen(c.text) <= CHUNK_MAX_CODE_POINTS));
  assert.ok(mixedChunks.every((c) => !hasLoneSurrogate(c.text)));
});

test("chunkSections hard-cuts a single over-long code line honestly and deterministically", () => {
  // A single source-code line over 3000 code points, with astral emoji mixed in
  // and a trailing CRLF that the hard cut must never split.
  let body = "";
  for (let i = 0; i < 3346; i++) {
    body += i % 100 === 0 ? "😀" : String.fromCodePoint(0x4e00 + i);
  }
  // 'const s = "' (11) + 3346 body + '";' (2) + CRLF (2) = 3361 code points.
  // 3361 places one hard-cut boundary exactly on the trailing CRLF, so the
  // CRLF-preserving guard is exercised (one piece ends one code point early).
  const line = 'const s = "' + body + '";\r\n';
  assert.ok(cplen(line) >= 3000, "regression line must be at least 3000 code points");

  const sections = [{ text: line, locator: "lines:7-7", kind: "code" }];
  const snapshot = JSON.stringify(sections);
  const chunks = chunkSections({ documentId: 99, originalName: "single.js", sections });

  // The caller's sections are never mutated.
  assert.equal(JSON.stringify(sections), snapshot, "input sections are not modified in place");

  // Hard-cut into multiple pieces, each within the absolute cap, surrogate-safe.
  assert.ok(chunks.length > 1, "an over-long single code line must be split");
  assert.ok(chunks.every((c) => cplen(c.text) <= CHUNK_MAX_CODE_POINTS), "every chunk respects the absolute 1200 cap");
  assert.ok(chunks.every((c) => !hasLoneSurrogate(c.text)), "no surrogate pair is cut in half");
  assert.ok(chunks.every((c) => !c.text.endsWith("\r")), "no chunk ends with a dangling CR (CRLF never split)");

  // Honest locators: every piece keeps the true source line, never a later one.
  assert.ok(chunks.every((c) => c.locator === "lines:7-7"), "all pieces keep the true source line locator");

  // Deterministic contiguous ordinals and exact content hashes.
  assert.deepEqual(
    chunks.map((c) => c.ordinal),
    Array.from({ length: chunks.length }, (_, i) => i),
    "ordinals are contiguous starting at 0",
  );
  for (const c of chunks) {
    assert.equal(
      c.contentHash,
      sha256(Buffer.from("99\u0000lines:7-7\u0000" + c.text, "utf8")),
      "contentHash is sha256(documentId + NUL + locator + NUL + text)",
    );
  }

  // The fixed overlap stays bounded, each later chunk adds fresh content (so the
  // algorithm advances), and in-order dedup reconstructs the original line.
  const overlap = CHUNK_MAX_OVERLAP_CODE_POINTS;
  assert.ok(overlap <= 120, "hard-cut overlap is bounded by CHUNK_MAX_OVERLAP_CODE_POINTS");
  assert.ok(chunks.slice(1).every((c) => cplen(c.text) > overlap), "each later chunk adds fresh content (the cut advances)");
  for (let k = 1; k < chunks.length; k++) {
    const tail = Array.from(chunks[k - 1].text).slice(-overlap).join("");
    const head = Array.from(chunks[k].text).slice(0, overlap).join("");
    assert.equal(head, tail, "adjacent chunks overlap by exactly the fixed overlap");
  }

  let rebuilt = chunks[0].text;
  for (let k = 1; k < chunks.length; k++) {
    rebuilt += Array.from(chunks[k].text).slice(overlap).join("");
  }
  assert.equal(rebuilt, line, "in-order dedup reconstructs the original single line exactly");
});

test("chunkSections merges short same-kind sections with a traceable locator1..locator2", () => {
  const chunks = chunkSections({
    documentId: 1,
    originalName: "t.txt",
    sections: [
      { text: "第一行", locator: "line:1", kind: "line" },
      { text: "第二行", locator: "line:2", kind: "line" },
      { text: "第三行", locator: "line:3", kind: "line" },
    ],
  });
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].locator, "line:1..line:3");
  assert.equal(chunks[0].text, "第一行\n第二行\n第三行");
});

test("chunkSections returns [] for empty or blank-only input and never mutates its sections", () => {
  assert.deepEqual(chunkSections({ documentId: 1, originalName: "e.md", sections: [] }), []);
  assert.deepEqual(chunkSections({ documentId: 2, originalName: "b.md", sections: [{ text: "   ", locator: "line:1", kind: "line" }, { text: "\n\t ", locator: "line:2", kind: "line" }] }), []);

  const sections = [
    { text: "保持不变", locator: "line:1", kind: "line" },
    { text: "第二行", locator: "line:2", kind: "line" },
  ];
  const snapshot = JSON.stringify(sections);
  chunkSections({ documentId: 3, originalName: "c.txt", sections });
  assert.equal(JSON.stringify(sections), snapshot, "input sections are not modified in place");
});
