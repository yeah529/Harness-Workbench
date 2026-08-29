import {
  referencedSessionFiles,
  sessionFileReferenceText,
} from "../shared/sessionFileReferences.js";
import { isWorkbenchSessionId } from "./workbenchSessions.js";

const MAX_CONTEXT_CODE_POINTS = 32000;

function sessionRows(store, sessionId) {
  return store.getSnapshot().sessionFilesBySession?.[sessionId] || [];
}

export function createSessionFileReferenceSource({ store }) {
  if (!store?.actions?.loadSessionFiles) throw new TypeError("session file store is required");
  return {
    trigger: "@",
    name: "cpwbSessionFile",
    order: 10,
    showGroupTitle: true,
    async candidates(session, { query, signal }) {
      if (signal?.aborted || !isWorkbenchSessionId(session?.sessionId)) return [];
      await store.actions.loadSessionFiles(session.sessionId);
      if (signal?.aborted) return [];
      const needle = String(query || "").trim().toLocaleLowerCase();
      return sessionRows(store, session.sessionId)
        .filter((file) => !needle || String(file.originalName || "").toLocaleLowerCase().includes(needle))
        .map((file) => ({
          name: file.originalName,
          description: file.parseStatus === "ready" ? "会话文件 · 直接注入上下文" : "会话文件 · 解析失败",
          section: "会话文件",
          value: String(file.id),
        }));
    },
    onPick({ candidate, session }) {
      if (!isWorkbenchSessionId(session?.sessionId)) return undefined;
      const file = sessionRows(store, session?.sessionId).find((row) => String(row.id) === String(candidate?.value));
      return file ? { text: sessionFileReferenceText(file) + " " } : undefined;
    },
    async warm(session) {
      if (isWorkbenchSessionId(session?.sessionId)) await store.actions.loadSessionFiles(session.sessionId);
    },
    lexicon(session) {
      if (!isWorkbenchSessionId(session?.sessionId)) return undefined;
      const values = sessionRows(store, session?.sessionId).map(sessionFileReferenceText);
      return values.length > 0 ? values : undefined;
    },
    subscribeLexicon(session, listener) {
      if (!isWorkbenchSessionId(session?.sessionId)) return () => {};
      return store.subscribe(listener);
    },
    async matchEnter(session, text) {
      if (!isWorkbenchSessionId(session?.sessionId)) return undefined;
      await store.actions.loadSessionFiles(session.sessionId);
      const files = referencedSessionFiles(text, sessionRows(store, session.sessionId));
      const failed = files.find((file) => file.parseStatus !== "ready");
      if (failed) throw new Error(`文件“${failed.originalName}”解析失败，无法发送`);
      const codePoints = files.reduce((total, file) => total + Number(file.contextCodePoints || 0), 0);
      if (codePoints > MAX_CONTEXT_CODE_POINTS) {
        throw new Error(`本次引用文件正文超过 ${MAX_CONTEXT_CODE_POINTS.toLocaleString("zh-CN")} 字符，请减少引用文件`);
      }
      return undefined;
    },
  };
}

export function registerSessionFileReferenceSource(ctx, store) {
  if (!ctx.inputTriggers?.registerSource) throw new Error("DSH inputTriggers service is unavailable");
  return ctx.effect(
    () => ctx.inputTriggers.registerSource(createSessionFileReferenceSource({ store })),
    "cpwb: session-file @ source",
  );
}
