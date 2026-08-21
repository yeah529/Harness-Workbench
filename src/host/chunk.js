/**
 * Deterministic section chunker.
 *
 * chunkSections turns the semantic sections produced by parse.js into stable,
 * retrieval-ready chunks. Every chunk carries a document id, a contiguous
 * 0-based ordinal, its text, a traceable locator, and a content hash computed
 * as sha256(documentId + "\0" + locator + "\0" + text).
 *
 * Sizing is measured in Unicode code points (never UTF-16 code units), so
 * astral-plane characters (emoji, CJK extension B, ...) each count once and a
 * hard cut can never split a surrogate pair in half. The fixed rule constants
 * are exported alongside CHUNK_RULE_VERSION so the indexer can detect a rule
 * change and mark affected documents stale.
 *
 * Boundaries are honoured rather than crossed:
 *   - PPTX slides and XLSX sheets are atomic: a slide/sheet is split only
 *     within itself and never merged with a neighbour.
 *   - Source-code sections keep their real "lines:A-B" locators and are split
 *     on complete lines (preferring blank-line and function-definition
 *     boundaries); a single line that alone exceeds the hard cap is hard-cut
 *     on code points (never mid-CRLF or mid-surrogate-pair), with every piece
 *     keeping that same line's own locator.
 *   - Markdown headings become context attached to the following body chunks
 *     via the "heading" field without altering the body's source locator.
 *
 * Long runs are split preferentially at paragraph, sentence, newline and
 * space boundaries; a hard cut (with a small, bounded overlap) is used only
 * when no boundary exists. Overlap never exceeds CHUNK_MAX_OVERLAP_CODE_POINTS
 * and is always smaller than the target size, so the algorithm always advances.
 */

import { createHash } from "node:crypto";

/** Version bumped whenever the rules below change; stored with each index. */
export const CHUNK_RULE_VERSION = "1";

/** Preferred chunk size in Unicode code points. */
export const CHUNK_TARGET_CODE_POINTS = 800;

/** Hard upper bound on a single chunk's text, in Unicode code points. */
export const CHUNK_MAX_CODE_POINTS = 1200;

/** Maximum overlap between adjacent chunks, in Unicode code points. */
export const CHUNK_MAX_OVERLAP_CODE_POINTS = 120;

/** Frozen view of the rule constants for callers that want one object. */
export const CHUNK_RULES = Object.freeze({
  version: CHUNK_RULE_VERSION,
  targetCodePoints: CHUNK_TARGET_CODE_POINTS,
  maxCodePoints: CHUNK_MAX_CODE_POINTS,
  maxOverlapCodePoints: CHUNK_MAX_OVERLAP_CODE_POINTS,
});

/**
 * Overlap used when a run has no natural boundary and must be hard-cut. It is
 * clamped strictly below the target size so the next chunk's start always
 * advances past the previous chunk's start.
 */
const HARD_SPLIT_OVERLAP = Math.min(
  CHUNK_MAX_OVERLAP_CODE_POINTS,
  CHUNK_TARGET_CODE_POINTS - 1,
);

/** Kinds whose short, adjacent, same-kind sections may be merged together. */
const MERGEABLE_KINDS = new Set(["line", "paragraph", "text"]);

/** Sentence-ending punctuation used as soft split boundaries. */
const SENTENCE_END = new Set([".", "!", "?", ";", "。", "！", "？", "；", "…"]);

/** Whitespace (excluding line breaks, handled separately) usable as a soft boundary. */
const SOFT_SPACE = new Set([" ", "\t", "\u3000"]);

/** Lightweight, language-agnostic "this line starts a function/type" hints. */
const FUNCTION_START_PATTERNS = [
  /^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\b/,
  /^(?:export\s+)?(?:async\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=/,
  /^(?:async\s+)?(?:def|class)\b/,
  /^(?:pub\s+|public\s+|private\s+|protected\s+|static\s+|final\s+|abstract\s+|async\s+|synchronized\s+|native\s+|override\s+|default\s+)*(?:fn|func|fun|def|class|interface|enum|struct|trait|impl|object|type|record|void|int|long|double|float|boolean|char|byte|short|String|bool)\b/,
];

/** Number of Unicode code points in a string (for...of iterates code points). */
function codePointLength(text) {
  let count = 0;
  for (const _cp of text) count += 1;
  return count;
}

/** sha256 hex of the canonical chunk identity string. */
function contentHash(documentId, locator, text) {
  const input = documentId + "\0" + locator + "\0" + text;
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * Priority of the split boundary just before index "end" of the code-point
 * array. Higher is preferred: 4 = paragraph (blank line), 3 = sentence end,
 * 2 = newline, 1 = space, -1 = no boundary. A "\r" is never a boundary so a
 * CRLF pair can never be cut in half.
 */
function boundaryPriority(cps, start, end) {
  if (end <= start) return -1;
  const last = cps[end - 1];
  if (last === "\n") {
    const before = cps[end - 2];
    if (before === "\n") return 4;
    if (before === "\r") {
      const b2 = cps[end - 3];
      if (b2 === "\n") return 4; // "...\n\r\n" blank line (mixed endings)
      return 2; // single CRLF line ending
    }
    return 2; // single LF line ending
  }
  if (last === "\r") return -1;
  if (SENTENCE_END.has(last)) return 3;
  if (SOFT_SPACE.has(last)) return 1;
  return -1;
}

/**
 * Split a long run into pieces of at most CHUNK_MAX_CODE_POINTS, preferring
 * natural boundaries near the target size and hard-cutting (with overlap) only
 * when none exists. Never splits a code point and always advances.
 */
function splitLongText(text) {
  const cps = Array.from(text);
  if (cps.length <= CHUNK_MAX_CODE_POINTS) return [text];

  const pieces = [];
  let start = 0;
  while (start < cps.length) {
    const remaining = cps.length - start;
    if (remaining <= CHUNK_MAX_CODE_POINTS) {
      pieces.push(cps.slice(start).join(""));
      break;
    }

    const lo = start + CHUNK_TARGET_CODE_POINTS;
    const hi = Math.min(start + CHUNK_MAX_CODE_POINTS, cps.length);

    let best = -1;
    let bestPriority = -1;
    for (let end = lo; end <= hi; end++) {
      const priority = boundaryPriority(cps, start, end);
      if (priority > bestPriority) {
        bestPriority = priority;
        best = end;
      }
    }

    let end;
    let natural;
    if (best !== -1) {
      end = best;
      natural = true;
    } else {
      end = lo;
      natural = false;
    }
    if (end <= start) end = Math.min(start + 1, cps.length);

    pieces.push(cps.slice(start, end).join(""));

    if (natural) {
      start = end;
    } else {
      start = end - HARD_SPLIT_OVERLAP;
      if (start < 0) start = 0;
    }
  }
  return pieces;
}

/**
 * Deterministically hard-cut a single source line that alone exceeds
 * CHUNK_MAX_CODE_POINTS. It works on code points (so a surrogate pair is never
 * split) and never breaks a CRLF pair at a cut. Adjacent pieces overlap by
 * exactly HARD_SPLIT_OVERLAP code points, so re-assembling them in order while
 * dropping that overlap reproduces the original line byte-for-byte.
 */
function splitSingleLineHard(text) {
  const cps = Array.from(text);
  if (cps.length <= CHUNK_MAX_CODE_POINTS) return [text];

  const pieces = [];
  let start = 0;
  while (start < cps.length) {
    const remaining = cps.length - start;
    if (remaining <= CHUNK_MAX_CODE_POINTS) {
      pieces.push(cps.slice(start).join(""));
      break;
    }

    let end = start + CHUNK_MAX_CODE_POINTS;
    // A CRLF pair must stay intact: if the cut lands between its "\r" and
    // "\n", pull the cut back one code point so the "\r" begins the next piece.
    while (end > start && cps[end - 1] === "\r" && cps[end] === "\n") {
      end -= 1;
    }

    pieces.push(cps.slice(start, end).join(""));
    start = end - HARD_SPLIT_OVERLAP;
  }
  return pieces;
}

/** Split text into lines that keep their trailing newline (CRLF preserved). */
function splitLinesKeepEndings(text) {
  const lines = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 0x0a) {
      lines.push(text.slice(start, i + 1));
      start = i + 1;
    }
  }
  if (start < text.length) lines.push(text.slice(start));
  return lines;
}

/** Parse a "lines:A-B" (or single "line:N") locator into a numeric range. */
function parseLineRange(locator) {
  const range = /^lines:(\d+)-(\d+)$/.exec(locator);
  if (range) return { start: Number(range[1]), end: Number(range[2]) };
  const single = /^line:(\d+)$/.exec(locator);
  if (single) return { start: Number(single[1]), end: Number(single[1]) };
  return null;
}

function isBlankLine(line) {
  return line.trim() === "";
}

function isFunctionStartLine(line) {
  const t = line.trimStart();
  if (t.length === 0) return false;
  return FUNCTION_START_PATTERNS.some((re) => re.test(t));
}

/**
 * Chunk one source-code section on complete-line boundaries, updating the
 * locator to the real "lines:A-B" of each piece. Blank-line and function-start
 * boundaries are preferred once the target size is reached.
 */
function chunkCode(unit) {
  const range = parseLineRange(unit.locator);
  const base = range ? range.start : 1;
  const lines = splitLinesKeepEndings(unit.text);

  const groups = [];
  let i = 0;
  while (i < lines.length) {
    // A single source line that alone exceeds the hard cap cannot fit in any
    // chunk; hard-cut it into overlapping, code-point-bounded pieces that all
    // honestly keep this same line's own locator (never a later line number).
    if (codePointLength(lines[i]) > CHUNK_MAX_CODE_POINTS) {
      const lineNo = base + i;
      for (const piece of splitSingleLineHard(lines[i])) {
        groups.push({
          text: piece,
          locator: "lines:" + lineNo + "-" + lineNo,
        });
      }
      i += 1;
      continue;
    }

    let j = i;
    let cps = 0;
    while (j < lines.length) {
      const add = codePointLength(lines[j]);
      if (j > i && cps + add > CHUNK_MAX_CODE_POINTS) break;
      cps += add;
      j += 1;
      if (cps >= CHUNK_TARGET_CODE_POINTS) {
        // Look ahead for a preferred boundary (blank line or function start)
        // without exceeding the hard cap.
        let k = j;
        let acc = cps;
        while (k < lines.length) {
          const next = codePointLength(lines[k]);
          if (acc + next > CHUNK_MAX_CODE_POINTS) break;
          if (isBlankLine(lines[k])) {
            j = k + 1;
            break;
          }
          if (isFunctionStartLine(lines[k])) {
            j = k;
            break;
          }
          acc += next;
          k += 1;
        }
        break;
      }
    }
    if (j <= i) j = i + 1;
    groups.push({
      text: lines.slice(i, j).join(""),
      locator: "lines:" + (base + i) + "-" + (base + j - 1),
    });
    i = j;
  }
  return groups;
}

/**
 * Split one chunking unit into pieces. Code uses line-aware splitting with
 * per-piece locators; every other kind uses the generic boundary splitter and
 * keeps the unit's locator unchanged.
 */
function splitUnit(unit) {
  if (unit.kind === "code") {
    return chunkCode(unit).map((p) => ({
      text: p.text,
      locator: p.locator,
      kind: "code",
      heading: unit.heading,
    }));
  }
  return splitLongText(unit.text).map((text) => ({
    text,
    locator: unit.locator,
    kind: unit.kind,
    heading: unit.heading,
  }));
}

/**
 * Fold Markdown headings into context and skip blank sections.
 *
 * A heading becomes the "heading" context for every following body section
 * (the most recent heading wins); headings themselves are only emitted as
 * standalone chunks when no body follows them (so a headings-only document is
 * not silently dropped).
 */
function collectUnits(sections) {
  const units = [];
  let heading = null;
  const pendingHeadings = [];
  for (const section of sections) {
    if (!section || typeof section.text !== "string") continue;
    if (section.text.trim() === "") continue;
    if (section.kind === "heading") {
      heading = section.text.trim();
      pendingHeadings.push({
        text: heading,
        locator: typeof section.locator === "string" ? section.locator : "",
        kind: "heading",
        heading: null,
      });
      continue;
    }
    pendingHeadings.length = 0; // consumed by this body section
    units.push({
      text: section.text,
      locator: typeof section.locator === "string" ? section.locator : "",
      kind: typeof section.kind === "string" && section.kind !== "" ? section.kind : "text",
      heading,
    });
  }
  for (const pending of pendingHeadings) units.push(pending);
  return units;
}

/** Merge a run of same-kind, same-heading sections into one unit. */
function combineMergeGroup(group) {
  const first = group[0];
  const last = group[group.length - 1];
  return {
    text: group.map((g) => g.text).join("\n"),
    locator: group.length === 1 ? first.locator : first.locator + ".." + last.locator,
    kind: first.kind,
    heading: first.heading,
  };
}

/**
 * Greedily merge short, adjacent, same-kind sections (never across a slide,
 * sheet, code or heading boundary) up to the target size, recording the merged
 * span as "locator1..locator2".
 */
function mergeUnits(units) {
  const out = [];
  let i = 0;
  while (i < units.length) {
    const unit = units[i];
    if (!MERGEABLE_KINDS.has(unit.kind)) {
      out.push(unit);
      i += 1;
      continue;
    }
    const group = [unit];
    let total = codePointLength(unit.text);
    let j = i + 1;
    while (
      j < units.length &&
      units[j].kind === unit.kind &&
      units[j].heading === unit.heading
    ) {
      const add = codePointLength(units[j].text) + 1; // +1 for the "\n" join
      if (total + add > CHUNK_MAX_CODE_POINTS) break;
      group.push(units[j]);
      total += add;
      j += 1;
      if (total >= CHUNK_TARGET_CODE_POINTS) break;
    }
    out.push(combineMergeGroup(group));
    i = j;
  }
  return out;
}

/**
 * Turn parsed sections into deterministic chunks.
 *
 * @param {object} options
 * @param {string|number} options.documentId id of the source document
 * @param {string} options.originalName base file name carried on every chunk
 * @param {Array<{ text: string, locator?: string, kind?: string }>} options.sections
 * @returns {Array<{ documentId, ordinal, text, locator, contentHash, originalName, kind, heading? }>}
 */
export function chunkSections({ documentId, originalName, sections }) {
  const list = Array.isArray(sections) ? sections : [];
  const units = mergeUnits(collectUnits(list));

  const chunks = [];
  let ordinal = 0;
  for (const unit of units) {
    for (const piece of splitUnit(unit)) {
      const chunk = {
        documentId,
        ordinal,
        text: piece.text,
        locator: piece.locator,
        contentHash: contentHash(documentId, piece.locator, piece.text),
        originalName,
        kind: piece.kind,
      };
      if (piece.heading != null) chunk.heading = piece.heading;
      chunks.push(chunk);
      ordinal += 1;
    }
  }
  return chunks;
}
