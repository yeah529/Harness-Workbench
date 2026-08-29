export const SESSION_FILE_REFERENCE_PREFIX = "@文件/";

export function sessionFileReferenceText(file) {
  return SESSION_FILE_REFERENCE_PREFIX + String(file?.originalName ?? "");
}

function matchSessionFileReferences(text, rows) {
  const input = String(text ?? "");
  const candidates = [...(rows || [])]
    .map((file) => ({ file, reference: sessionFileReferenceText(file) }))
    .filter(({ reference }) => reference.length > SESSION_FILE_REFERENCE_PREFIX.length)
    .sort((left, right) => right.reference.length - left.reference.length);
  const files = [];
  const ranges = [];
  const selected = new Set();
  let offset = 0;
  while (offset < input.length) {
    const start = input.indexOf(SESSION_FILE_REFERENCE_PREFIX, offset);
    if (start === -1) break;
    const match = candidates.find(({ reference }) =>
      input.startsWith(reference, start) &&
      (start + reference.length === input.length || /\s/u.test(input[start + reference.length])),
    );
    if (!match) {
      offset = start + SESSION_FILE_REFERENCE_PREFIX.length;
      continue;
    }
    const end = start + match.reference.length;
    ranges.push({ start, end });
    if (!selected.has(match.file)) {
      selected.add(match.file);
      files.push(match.file);
    }
    offset = end;
  }
  return { files, ranges };
}

export function referencedSessionFiles(text, rows) {
  return matchSessionFileReferences(text, rows).files;
}

export function stripSessionFileReferences(text, rows) {
  const input = String(text ?? "");
  const { ranges } = matchSessionFileReferences(input, rows);
  let result = "";
  let offset = 0;
  for (const range of ranges) {
    result += input.slice(offset, range.start) + " ";
    offset = range.end;
  }
  result += input.slice(offset);
  return result.replace(/\s+/g, " ").trim();
}
