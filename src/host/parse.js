/**
 * Document parser: plain text, Markdown, HTML, source code and Office formats.
 *
 * parseDocument reads an already-stored file and turns it into semantic
 * sections, each carrying a stable "locator" and "kind" so the chunker and the
 * citation UI can point back into the original document. This task covers
 * plain text (txt), Markdown (md/markdown), HTML (html/htm), every source-code
 * extension accepted by files.js, and the Office Open XML formats docx/pptx/xlsx.
 *
 * Dispatch is by the "originalName" extension, never by the untrusted mime
 * type: a caller that names a file "note.md" gets Markdown regardless of the
 * mimeType argument. Unsupported extensions fail with a stable error code
 * before any bytes are read.
 *
 * Office documents are parsed with officeparser into a structured AST, then
 * reduced to the same { text, locator, kind } section shape as every other
 * format. Macros are never executed, attachments are not extracted, and OCR is
 * disabled; only visible text from the document body is indexed, and it is
 * still subject to the shared 20 MB UTF-8 total-text cap.
 */

import { readFile } from "node:fs/promises";

import { compile } from "html-to-text";
import { parseOffice } from "officeparser";

import { ALLOWED_EXTENSIONS } from "./files.js";

/** Version bumped whenever the parsing rules below change; stored with each index. */
export const PARSER_VERSION = "1";

/** Stable error codes surfaced to callers and, later, the HTTP API. */
export const PARSE_ERROR_CODES = Object.freeze({
  UNSUPPORTED_TYPE: "EUNSUPPORTED_TYPE",
  BINARY_CONTENT: "EBINARY_CONTENT",
  TEXT_TOO_LARGE: "ETEXT_TOO_LARGE",
  OFFICE_PARSE_FAILED: "EOFFICE_PARSE_FAILED",
  OFFICE_ZIP_SIZE_LIMIT: "EOFFICE_ZIP_SIZE_LIMIT",
  OFFICE_ZIP_ENTRY_LIMIT: "EOFFICE_ZIP_ENTRY_LIMIT",
  OFFICE_LIMIT_CONFIG: "EOFFICE_LIMIT_CONFIG",
});

/** Extracted section text cap: 20 MB of UTF-8, measured across all sections. */
export const MAX_SECTION_TEXT_BYTES = 20 * 1024 * 1024;

/**
 * Strict, finite bounds applied to Office ZIP decompression via officeparser's
 * native "decompressionLimits". These bound the total uncompressed bytes and
 * the entry count *before* any XML is parsed, so a zip bomb cannot exhaust
 * memory:
 *
 *   - maxUncompressedBytes (64 MB): the sum of every uncompressed entry.
 *   - maxZipEntries (1000): the number of files/directories in the archive.
 *   - maxTableCells (100000): repeated-cell expansion guard (ODF formats).
 *
 * officeparser's own defaults are far looser (512 MB / 10000 / 1000000); these
 * are tightened to match the scale of documents this workbench accepts (the
 * extracted text is capped at 20 MB anyway). Tests may tighten individual
 * fields through parseDocument's "decompressionLimits" option, but callers can
 * never raise them: the option is validated and only accepts values at or
 * below each default.
 */
export const OFFICE_DECOMPRESSION_LIMITS = Object.freeze({
  maxUncompressedBytes: 64 * 1024 * 1024,
  maxZipEntries: 1000,
  maxTableCells: 100000,
});

/** Parsing error carrying a stable machine-readable code. */
export class ParseError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ParseError";
    this.code = code;
  }
}

const OFFICE_EXTENSIONS = new Set(["docx", "pptx", "xlsx"]);
const TEXT_EXTENSIONS = new Set(["txt", "md", "markdown", "html", "htm"]);
const MARKDOWN_EXTENSIONS = new Set(["md", "markdown"]);
const HTML_EXTENSIONS = new Set(["html", "htm"]);

// Every source-code extension files.js accepts for upload, minus the text and
// Office formats handled elsewhere: js, ts, jsx, tsx, json, yaml, yml, py,
// java, go, rs, c, cpp, h, hpp, css, sql, sh.
const CODE_EXTENSIONS = new Set(
  ALLOWED_EXTENSIONS.filter((ext) => !TEXT_EXTENSIONS.has(ext) && !OFFICE_EXTENSIONS.has(ext)),
);

/** Lowercase extension without the leading dot, or "" when absent. */
function extractExtension(name) {
  if (typeof name !== "string") return "";
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return "";
  return name.slice(dot + 1).toLowerCase();
}

/** UTF-8 byte length of a section's text. */
function utf8Length(text) {
  return Buffer.byteLength(text, "utf8");
}

/**
 * Reject binary content. NUL is the design's sentinel for "not text": any
 * document containing a 0x00 byte cannot be faithfully re-encoded as UTF-8
 * and must not be silently indexed. Office files are ZIP archives and are
 * routed through officeparser instead, so they never reach this check.
 */
function assertNoNul(buffer) {
  if (buffer.includes(0)) {
    throw new ParseError(
      PARSE_ERROR_CODES.BINARY_CONTENT,
      "document contains a NUL byte and is not valid UTF-8 text",
    );
  }
}

/** Reject documents whose combined section text exceeds the 20 MB cap. */
function enforceTextLimit(sections) {
  let total = 0;
  for (const section of sections) {
    total += utf8Length(section.text);
    if (total > MAX_SECTION_TEXT_BYTES) {
      throw new ParseError(
        PARSE_ERROR_CODES.TEXT_TOO_LARGE,
        "extracted text exceeds the 20 MB limit",
      );
    }
  }
  return sections;
}

/**
 * One section per non-empty line, locator "line:N" with N the 1-based line
 * number in the original file. Empty lines are skipped but still count toward
 * the following line numbers, so locators stay faithful to the source.
 */
function parseText(text) {
  const sections = [];
  text.split(/\r?\n/).forEach((line, index) => {
    if (line.length === 0) return;
    sections.push({ text: line, locator: "line:" + (index + 1), kind: "line" });
  });
  return sections;
}

const ATX_HEADING_RE = /^(#{1,6})\s+(.*)$/;

/**
 * Split Markdown into ATX headings and paragraph blocks.
 *
 * A heading section is one line with kind "heading" and a "line:N" locator;
 * a paragraph is a run of consecutive non-blank, non-heading lines with kind
 * "paragraph" and a "lines:A-B" locator. Blank lines delimit paragraphs and
 * never produce sections.
 */
function parseMarkdown(text) {
  const sections = [];
  const lines = text.split(/\r?\n/);

  let paragraphStart = null;
  let paragraphLines = [];
  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    sections.push({
      text: paragraphLines.join("\n"),
      locator: "lines:" + paragraphStart + "-" + (paragraphStart + paragraphLines.length - 1),
      kind: "paragraph",
    });
    paragraphLines = [];
    paragraphStart = null;
  };

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const heading = ATX_HEADING_RE.exec(line);
    if (heading) {
      flushParagraph();
      sections.push({ text: heading[2].trim(), locator: "line:" + lineNo, kind: "heading" });
      return;
    }
    if (line.trim().length === 0) {
      flushParagraph();
      return;
    }
    if (paragraphStart === null) paragraphStart = lineNo;
    paragraphLines.push(line);
  });
  flushParagraph();
  return sections;
}

/**
 * html-to-text instance configured once: word wrap is disabled so extracted
 * lines correspond to block boundaries, and script/style elements are skipped
 * (their contents are never indexed). Heading case is preserved instead of the
 * library's default uppercasing so the extracted text stays faithful.
 */
const htmlConverter = compile({
  wordwrap: false,
  selectors: [
    { selector: "script", format: "skip" },
    { selector: "style", format: "skip" },
    { selector: "h1", format: "heading", options: { uppercase: false } },
    { selector: "h2", format: "heading", options: { uppercase: false } },
    { selector: "h3", format: "heading", options: { uppercase: false } },
    { selector: "h4", format: "heading", options: { uppercase: false } },
    { selector: "h5", format: "heading", options: { uppercase: false } },
    { selector: "h6", format: "heading", options: { uppercase: false } },
  ],
});

/**
 * Strip HTML to text via html-to-text, then emit one section per non-empty
 * extracted line with kind "text" and a "line:N" locator into the extracted
 * text. Script, style, and every tag itself are dropped.
 */
function parseHtml(text) {
  const extracted = htmlConverter(text);
  const sections = [];
  extracted.split(/\r?\n/).forEach((line, index) => {
    if (line.trim().length === 0) return;
    sections.push({ text: line, locator: "line:" + (index + 1), kind: "text" });
  });
  return sections;
}

/**
 * Split source code into blank-line-delimited blocks with stable "lines:A-B"
 * locators (1-based, inclusive). Blank/whitespace lines separate blocks but do
 * not become sections, so the line range always references real source lines.
 */
function parseCode(text) {
  const sections = [];
  const lines = text.split(/\r?\n/);

  let blockStart = null;
  let blockLines = [];
  const flushBlock = () => {
    if (blockLines.length === 0) return;
    sections.push({
      text: blockLines.join("\n"),
      locator: "lines:" + blockStart + "-" + (blockStart + blockLines.length - 1),
      kind: "code",
    });
    blockLines = [];
    blockStart = null;
  };

  lines.forEach((line, index) => {
    if (line.trim().length === 0) {
      flushBlock();
      return;
    }
    if (blockStart === null) blockStart = index + 1;
    blockLines.push(line);
  });
  flushBlock();
  return sections;
}

/**
 * Collect the visible text leaves of a node's subtree into "out", in document
 * order.
 *
 * officeparser stamps a "text" field onto container nodes (paragraphs,
 * headings, cells, ...) that is simply the concatenation of their children's
 * text. To avoid double-counting, a node contributes either its children's
 * leaves (when it has children) or its own "text" (when it is a leaf) - never
 * both. Annotations such as "notes" and "comments" live outside "children" and
 * are deliberately not traversed: only the visible body text is indexed.
 */
function collectVisibleText(node, out) {
  if (!node) return;
  const children = Array.isArray(node.children) ? node.children : [];
  if (children.length > 0) {
    for (const child of children) collectVisibleText(child, out);
    return;
  }
  if (typeof node.text === "string" && node.text.length > 0) {
    out.push(node.text);
  }
}

/** Inline text of one block (paragraph/heading/list/cell): runs joined with no separator. */
function inlineText(node) {
  const parts = [];
  collectVisibleText(node, parts);
  return parts.join("");
}

/** Text of a table or sheet: cells joined with tabs within a row, rows joined with newlines. */
function gridText(node) {
  const rows = [];
  for (const row of Array.isArray(node.children) ? node.children : []) {
    const cells = [];
    for (const cell of Array.isArray(row.children) ? row.children : []) {
      cells.push(inlineText(cell));
    }
    rows.push(cells.join("\t"));
  }
  return rows.join("\n");
}

/** Text of a slide/page: each top-level block placed on its own line. */
function blocksText(node) {
  const blocks = [];
  for (const child of Array.isArray(node.children) ? node.children : []) {
    const text = inlineText(child);
    if (text.length > 0) blocks.push(text);
  }
  return blocks.join("\n");
}

/** Spreadsheet column letter for a 0-based column index (0 -> A, 25 -> Z, 26 -> AA). */
function columnName(index) {
  let name = "";
  let n = index + 1;
  while (n > 0) {
    n -= 1;
    name = String.fromCharCode(65 + (n % 26)) + name;
    n = Math.floor(n / 26);
  }
  return name;
}

/**
 * DOCX: one section per top-level body node. "kind" is the node type
 * (heading/paragraph/table/list, ...) and the locator is "<kind>:N" with an
 * independent, 1-based counter per kind, so "heading:1" and "paragraph:1" each
 * reference a specific, stable block.
 */
function parseDocx(content) {
  const sections = [];
  const counters = new Map();
  for (const node of content) {
    const kind = typeof node.type === "string" ? node.type : "block";
    const text = kind === "table" ? gridText(node) : inlineText(node);
    if (text.trim().length === 0) continue;
    const n = (counters.get(kind) ?? 0) + 1;
    counters.set(kind, n);
    sections.push({ text, locator: kind + ":" + n, kind });
  }
  return sections;
}

/**
 * PPTX: one section per top-level slide. All visible text on a slide is merged
 * into one section whose locator is the precise 1-based slide number
 * ("slide:1", "slide:2", ...), taken from the slide's own metadata rather than
 * from a filename parse.
 */
function parsePptx(content) {
  const sections = [];
  for (const node of content) {
    if (node.type !== "slide") continue;
    const slideNumber = node.metadata?.slideNumber;
    if (!Number.isInteger(slideNumber)) continue;
    const text = blocksText(node);
    if (text.trim().length === 0) continue;
    sections.push({ text, locator: "slide:" + slideNumber, kind: "slide" });
  }
  return sections;
}

/**
 * Collect the non-empty cells of a sheet with their 0-based grid coordinates.
 */
function collectSheetCells(sheet) {
  const cells = [];
  for (const row of Array.isArray(sheet.children) ? sheet.children : []) {
    for (const cell of Array.isArray(row.children) ? row.children : []) {
      const text = inlineText(cell);
      if (text.trim().length === 0) continue;
      const rowIndex = cell.metadata?.row;
      const colIndex = cell.metadata?.col;
      if (Number.isInteger(rowIndex) && Number.isInteger(colIndex)) {
        cells.push({ row: rowIndex, col: colIndex, text });
      }
    }
  }
  return cells;
}

/** A1-style range (e.g. "A1:B3") covering the given cells' 0-based coordinates. */
function computeRange(cells) {
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minCol = Infinity;
  let maxCol = -Infinity;
  for (const cell of cells) {
    if (cell.row < minRow) minRow = cell.row;
    if (cell.row > maxRow) maxRow = cell.row;
    if (cell.col < minCol) minCol = cell.col;
    if (cell.col > maxCol) maxCol = cell.col;
  }
  return columnName(minCol) + (minRow + 1) + ":" + columnName(maxCol) + (maxRow + 1);
}

/**
 * XLSX: one section per top-level sheet. The locator carries the real sheet
 * name and the actually-used cell range ("sheet:项目计划 cells:A1:B3"); the
 * range is derived from each cell's AST metadata coordinates, never hardcoded.
 */
function parseXlsx(content) {
  const sections = [];
  for (const node of content) {
    if (node.type !== "sheet") continue;
    const sheetName = node.metadata?.sheetName;
    const cells = collectSheetCells(node);
    if (cells.length === 0) continue;
    const text = gridText(node);
    if (text.trim().length === 0) continue;
    sections.push({
      text,
      locator: "sheet:" + sheetName + " cells:" + computeRange(cells),
      kind: "sheet",
    });
  }
  return sections;
}

/** Reduce an officeparser AST to semantic sections, keyed by extension. */
function buildOfficeSections(ast, extension) {
  const content = Array.isArray(ast.content) ? ast.content : [];
  if (extension === "docx") return parseDocx(content);
  if (extension === "pptx") return parsePptx(content);
  return parseXlsx(content); // xlsx
}

/**
 * Map an officeparser failure onto a stable ParseError without swallowing the
 * cause. The library brands its errors with an "officeIssue" object whose
 * "code" is one of its structured error types; ZIP size and entry-count limits
 * get their own codes because callers and tests distinguish them, while every
 * other officeparser error (corruption, missing part, nesting depth, ...)
 * collapses to OFFICE_PARSE_FAILED. The original error is preserved as
 * "cause" so the reason is never lost.
 */
function mapOfficeError(err) {
  const issue = err && err.officeIssue;
  const opCode = issue && issue.code;
  const message = err && err.message ? String(err.message) : String(err);
  let code;
  if (opCode === "ZIP_SIZE_LIMIT_EXCEEDED") {
    code = PARSE_ERROR_CODES.OFFICE_ZIP_SIZE_LIMIT;
  } else if (opCode === "ZIP_ENTRY_COUNT_LIMIT_EXCEEDED") {
    code = PARSE_ERROR_CODES.OFFICE_ZIP_ENTRY_LIMIT;
  } else {
    code = PARSE_ERROR_CODES.OFFICE_PARSE_FAILED;
  }
  const parsed = new ParseError(
    code,
    "office document parse failed" + (opCode ? " (" + opCode + ")" : "") + ": " + message,
  );
  parsed.cause = err;
  return parsed;
}

/**
 * Validate and merge an optional decompressionLimits override.
 *
 * Tests may tighten individual OFFICE_DECOMPRESSION_LIMITS fields, but a caller
 * may never raise them or add new ones. Only the three known keys are accepted;
 * each value must be a positive safe integer no greater than the corresponding
 * default. Unknown keys, non-object overrides, and non-integer / zero /
 * negative / Infinity / NaN values, and any value above its default, all fail
 * with a stable OFFICE_LIMIT_CONFIG ParseError before officeparser runs.
 */
function normalizeOfficeLimits(limitsOverride) {
  if (limitsOverride === undefined || limitsOverride === null) {
    return { ...OFFICE_DECOMPRESSION_LIMITS };
  }
  if (typeof limitsOverride !== "object" || Array.isArray(limitsOverride)) {
    throw new ParseError(
      PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
      "decompressionLimits must be a plain object",
    );
  }
  const limits = { ...OFFICE_DECOMPRESSION_LIMITS };
  for (const [key, value] of Object.entries(limitsOverride)) {
    if (!Object.hasOwn(OFFICE_DECOMPRESSION_LIMITS, key)) {
      throw new ParseError(
        PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
        "unknown decompressionLimits key: " + key,
      );
    }
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new ParseError(
        PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
        "decompressionLimits." + key + " must be a positive safe integer",
      );
    }
    if (value > OFFICE_DECOMPRESSION_LIMITS[key]) {
      throw new ParseError(
        PARSE_ERROR_CODES.OFFICE_LIMIT_CONFIG,
        "decompressionLimits." + key + " exceeds the default upper bound " + OFFICE_DECOMPRESSION_LIMITS[key],
      );
    }
    limits[key] = value;
  }
  return limits;
}

/**
 * Parse a stored Office file with officeparser, bounded by strict finite
 * decompression limits. Macros are never executed (officeparser only reads the
 * document parts), attachments are not extracted, OCR is disabled, and slide
 * masters are ignored so only real slide content is indexed.
 */
async function parseOfficeFile(path, fileType, limitsOverride) {
  const limits = normalizeOfficeLimits(limitsOverride);
  let ast;
  try {
    ast = await parseOffice(path, {
      fileType,
      extractAttachments: false,
      ocr: false,
      ignoreSlideMasters: true,
      decompressionLimits: limits,
    });
  } catch (err) {
    throw mapOfficeError(err);
  }
  return ast;
}

/**
 * Parse one stored document into semantic sections.
 *
 * @param {object} options
 * @param {string} options.path file path on disk
 * @param {string} options.originalName base file name used to pick the parser
 * @param {string|null} [options.mimeType] accepted for interface parity but not
 *   used for dispatch (the extension is authoritative)
 * @param {object} [options.decompressionLimits] optional per-field tightening of
 *   OFFICE_DECOMPRESSION_LIMITS for Office ZIP extraction (used by tests to
 *   trigger officeparser's native limit errors); only the three known keys are
 *   accepted and each value must be a positive safe integer at or below the
 *   corresponding default - never higher
 * @returns {Promise<{ sections: Array<{ text: string, locator: string, kind: string }> }>}
 */
export async function parseDocument({ path, originalName, mimeType, decompressionLimits }) {
  const extension = extractExtension(originalName);
  const supported =
    TEXT_EXTENSIONS.has(extension) ||
    CODE_EXTENSIONS.has(extension) ||
    OFFICE_EXTENSIONS.has(extension);
  if (!supported) {
    throw new ParseError(
      PARSE_ERROR_CODES.UNSUPPORTED_TYPE,
      "unsupported document type: " + (extension || "(none)"),
    );
  }

  if (OFFICE_EXTENSIONS.has(extension)) {
    const ast = await parseOfficeFile(path, extension, decompressionLimits);
    return { sections: enforceTextLimit(buildOfficeSections(ast, extension)) };
  }

  const buffer = await readFile(path);
  assertNoNul(buffer);
  const text = buffer.toString("utf8");

  let sections;
  if (extension === "txt") {
    sections = parseText(text);
  } else if (MARKDOWN_EXTENSIONS.has(extension)) {
    sections = parseMarkdown(text);
  } else if (HTML_EXTENSIONS.has(extension)) {
    sections = parseHtml(text);
  } else {
    sections = parseCode(text);
  }

  return { sections: enforceTextLimit(sections) };
}

/** Extensions parseDocument accepts (text, code, and Office formats). */
export const SUPPORTED_EXTENSIONS = Object.freeze([
  ...TEXT_EXTENSIONS,
  ...OFFICE_EXTENSIONS,
  ...CODE_EXTENSIONS,
].sort());
