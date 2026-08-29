export const SESSION_FILE_REFERENCE_PREFIX = "@文件/";

export function sessionFileReferenceText(file) {
  return SESSION_FILE_REFERENCE_PREFIX + String(file?.originalName ?? "");
}

export function referencedSessionFiles(text, rows) {
  const input = String(text ?? "");
  return [...(rows || [])]
    .sort((left, right) => String(right.originalName || "").length - String(left.originalName || "").length)
    .filter((file) => input.includes(sessionFileReferenceText(file)));
}

export function stripSessionFileReferences(text, rows) {
  let result = String(text ?? "");
  for (const file of referencedSessionFiles(result, rows)) {
    result = result.split(sessionFileReferenceText(file)).join(" ");
  }
  return result.replace(/\s+/g, " ").trim();
}
