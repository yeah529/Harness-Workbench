import {
  decodeKnowledgeBaseReference,
  encodeKnowledgeBaseReference,
  serializeKnowledgeBaseReference,
} from "../shared/knowledgeReferences.js";

export { decodeKnowledgeBaseReference, encodeKnowledgeBaseReference };

export function createKnowledgeBaseReferenceSource({ getKnowledgeBases }) {
  if (typeof getKnowledgeBases !== "function") throw new TypeError("getKnowledgeBases is required");
  return {
    trigger: "@",
    name: "cpwbKnowledge",
    order: 20,
    showGroupTitle: false,
    async candidates(session, { query, signal }) {
      if (signal?.aborted) return [];
      const needle = String(query || "").trim().toLocaleLowerCase();
      return (getKnowledgeBases() || [])
        .filter((item) => !needle || String(item.name || "").toLocaleLowerCase().includes(needle))
        .map((item) => ({
          name: "知识库 · " + item.name,
          description: item.description || "向量知识库",
          section: "知识库",
          value: encodeKnowledgeBaseReference(item),
        }));
    },
    onPick({ candidate }) {
      const value = decodeKnowledgeBaseReference(candidate?.value);
      if (!value) return undefined;
      return { insert: {
        source: "cpwbKnowledge",
        ref: candidate.value,
        label: value.name,
        appearance: "folder",
        clipboardText: "@知识库/" + value.name,
      } };
    },
    codec: {
      clipboardText(ref) {
        const value = decodeKnowledgeBaseReference(ref);
        return value ? "@知识库/" + value.name : "@知识库";
      },
      serialize(ref) { return Promise.resolve(serializeKnowledgeBaseReference(ref)); },
    },
  };
}

export function registerKnowledgeBaseReferenceSource(ctx, store) {
  const inputTriggers = ctx.inputTriggers;
  if (!inputTriggers?.registerSource) throw new Error("DSH inputTriggers service is unavailable");
  const source = createKnowledgeBaseReferenceSource({
    getKnowledgeBases: () => store.getSnapshot().knowledgeBases,
  });
  return ctx.effect(() => inputTriggers.registerSource(source), "cpwb: knowledge-base @ source");
}
