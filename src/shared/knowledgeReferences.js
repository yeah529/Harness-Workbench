const PREFIX = "cpwb-kb:";
const TAG_RE = /<cpwb_knowledge_base\s+id="(\d+)"(?:\s+name="[^"]*")?\s*\/>/gi;

function escapeXmlAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function encodeKnowledgeBaseReference({ id, name }) {
  if (!Number.isSafeInteger(id) || id < 1) throw new TypeError("knowledge base id must be positive");
  return PREFIX + id + ":" + encodeURIComponent(String(name || "知识库"));
}

export function decodeKnowledgeBaseReference(ref) {
  if (typeof ref !== "string" || !ref.startsWith(PREFIX)) return null;
  const match = /^cpwb-kb:(\d+):(.*)$/.exec(ref);
  if (!match) return null;
  try { return { id: Number(match[1]), name: decodeURIComponent(match[2]) }; }
  catch { return null; }
}

export function serializeKnowledgeBaseReference(ref) {
  const value = decodeKnowledgeBaseReference(ref);
  if (!value) throw new TypeError("invalid knowledge base reference");
  return `<cpwb_knowledge_base id="${value.id}" name="${escapeXmlAttr(value.name)}" />`;
}

export function extractKnowledgeBaseReferenceIds(text) {
  const ids = [];
  const seen = new Set();
  for (const match of String(text || "").matchAll(TAG_RE)) {
    const id = Number(match[1]);
    if (!seen.has(id)) { seen.add(id); ids.push(id); }
  }
  return ids;
}

export function stripKnowledgeBaseReferences(text) {
  return String(text || "").replace(TAG_RE, " ").replace(/\s+/g, " ").trim();
}
