/**
 * Cyberpunk 2077 workbench plugin, node half.
 *
 * Wires the durable host stack inside one scoped lifecycle: SQLite database +
 * repositories, the local Ollama client, the LanceDB vector index + document
 * indexer, the hybrid retriever, and the serial index queue. Generation uses
 * the existing DSH-configured provider route; this plugin does not register or
 * emulate a generation adapter. It registers the single "/api/cpwb" API
 * prefix route on the DSH webServer and owns all local indexing resources.
 */

import { mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { createOllamaClient } from "./ollama.js";
import { openDatabase, closeDatabase } from "./database.js";
import { createRepositories } from "./repositories.js";
import { createVectorIndex, createDocumentIndexer } from "./vectors.js";
import { createRetriever } from "./retrieval.js";
import { createIndexQueue } from "./queue.js";
import { createApi } from "./api.js";
import { createSessionService } from "./sessions.js";
import { assertAutomationText, createScheduler, isAutomationProtocolLeak } from "./scheduler.js";
import { resolveDataRoot } from "./config.js";
import { createWorkbenchSettings } from "./settings.js";
import { createEmbeddingAdapter } from "./embedding.js";
import { localDateKey } from "./timezone.js";
import { createCodexAuth } from "./codex-auth.js";
import { createContextResolver } from "./context.js";

/**
 * Host plugin dependencies: the DSH web server, the LLM adapter registry, and
 * the public DSH agent/session/workspace services the session orchestrator
 * composes. Optional services are read from the injected context without
 * probing the DSH context accessor for names that may not be registered.
 */
const inject = ["webServer", "agents", "sessions", "workspaceRegistry", "credentials"];

function optionalContextService(ctx, name) {
  // Cordis only exposes injected services as context properties. The `in`
  // guard also keeps lightweight lifecycle tests and older compositions from
  // probing an undeclared property and turning an optional seam into boot
  // failure.
  return name in ctx ? ctx[name] : undefined;
}

/** Build the host-owned scheduled prompt runner with one release seam. */
export function createScheduledRunPrompt(sessionService) {
  return async function runScheduledPrompt({ kind = "schedule", projectId, prompt }) {
    let session = null;
    try {
      session = await sessionService.createSession({ scope: { kind: "project", id: projectId }, scheduled: true });
      let result = await sessionService.submitPrompt({
        sessionId: session.sessionId,
        question: prompt,
      });
      if ((kind === "summary" || kind === "todo") && result.outcome?.reason?.kind !== "completed") {
        throw new Error(`模型${kind === "summary" ? "总结" : "待办"}生成未正常完成`);
      }
      let text = result.outcome?.text ?? "";
      if ((kind === "summary" || kind === "todo") && (text.trim() === "" || isAutomationProtocolLeak(text))) {
        const requestedOutput = kind === "summary" ? "最终中文总结正文" : "最终待办逐行清单";
        result = await sessionService.submitPrompt({
          sessionId: session.sessionId,
          question: `上一条响应不是可展示的${requestedOutput}。不要调用任何工具，不要输出 DSML、XML、代码或分析过程；只依据上一条消息已提供的数据，直接输出${requestedOutput}。`,
        });
        if (result.outcome?.reason?.kind !== "completed") {
          throw new Error(`模型${kind === "summary" ? "总结" : "待办"}生成未正常完成`);
        }
        text = result.outcome?.text ?? "";
      }
      return {
        sessionId: session.sessionId,
        text: kind === "summary" || kind === "todo" ? assertAutomationText(text, kind) : text,
      };
    } catch (error) {
      if (!session?.sessionId) throw error;
      const wrapped = new Error(error instanceof Error ? error.message : String(error));
      wrapped.sessionId = session.sessionId;
      throw wrapped;
    } finally {
      if (session?.sessionId) await sessionService.release(session.sessionId);
    }
  };
}

/** Host plugin body — build the stack and own its lifecycle. */
function apply(ctx, config = {}) {
  const dataDir = resolveDataRoot({ dataDir: config.dataDir });

  ctx.effect(() => {
    let disposeRoute = null;
    let db = null;
    let vectorIndex = null;
    let queue = null;
    let sessionService = null;
    let scheduler = null;
    try {
      db = openDatabase({ dataDir });
      const repos = createRepositories(db);
      const contextResolver = createContextResolver({ repos });
      const settings = createWorkbenchSettings({ repos, dshInitial: config.settings?.initial });
      const ollama = createOllamaClient();
      vectorIndex = createVectorIndex({ dataDir });
      const credentials = optionalContextService(ctx, "credentials");
      const codexAuth = createCodexAuth({ credentials });
      const getCredential = async (ref) => {
        if (!credentials || typeof credentials.resolve !== "function") return undefined;
        const resolved = await credentials.resolve(ref);
        return resolved?.value ?? resolved;
      };
      const makeEmbedding = (embeddingConfig) => createEmbeddingAdapter({ ...embeddingConfig, getCredential });
      const embeddingRuntime = { current: makeEmbedding(settings.get("embedding")) };
      const embedding = {
        identity: () => embeddingRuntime.current.identity(),
        listModels: (options) => embeddingRuntime.current.listModels(options),
        embed: (texts, options) => embeddingRuntime.current.embed(texts, options),
        health: (options) => embeddingRuntime.current.health(options),
      };
      let indexer;
      const onEmbeddingConfigChange = async (next) => {
        const previous = embeddingRuntime.current;
        const candidate = makeEmbedding(next);
        embeddingRuntime.current = candidate;
        try {
          if (indexer) await indexer.reconcileStale({
            model: candidate.identity().model,
            dimensions: candidate.identity().dimensions,
          });
        } catch (error) {
          embeddingRuntime.current = previous;
          throw error;
        }
      };
      indexer = createDocumentIndexer({ repos, vectorIndex, embedding });
      const retriever = createRetriever({ repos, vectorIndex, embedding });
      void indexer.reconcileStale().catch(() => {});
      queue = createIndexQueue({ repos, indexer });
      const sessionWorkspace = async ({ kind, scopeId }) => {
        if (!ctx.workspaceRegistry || typeof ctx.workspaceRegistry.resolveByPath !== "function" || typeof ctx.workspaceRegistry.create !== "function") {
          throw new Error("DSH workspace registry is unavailable for Workbench sessions");
        }
        const path = kind === "knowledge_base"
          ? join(dataDir, "knowledge-bases", String(scopeId))
          : join(dataDir, "sessions", "independent");
        await mkdir(path, { recursive: true });
        const existing = await ctx.workspaceRegistry.resolveByPath(path);
        const title = kind === "knowledge_base" ? "Workbench KB " + scopeId : "Workbench Independent";
        return existing ?? ctx.workspaceRegistry.create(path, title);
      };
      sessionService = createSessionService({ ctx, repos, retriever, sessionWorkspace, contextResolver });
      const runPrompt = createScheduledRunPrompt(sessionService);
      scheduler = createScheduler({
        repos,
        runPrompt,
        timeZone: () => settings.get("timezone"),
        automationPrompts: () => settings.get("automationPrompts"),
        projectConversations: (input) => sessionService.readProjectDailyConversation(input),
      });
      scheduler.start();
      const api = createApi({
        repos,
        queue,
        ollama,
        retriever,
        dataDir,
        sessions: sessionService,
        settings,
        embeddingFactory: makeEmbedding,
        onEmbeddingConfigChange,
        credentials,
        codexAuth,
        dshAdapter: optionalContextService(ctx, "dshAdapter") ?? null,
        services: {
          deleteProject: async (projectId) => {
            const plan = repos.projects.deletionPlan(projectId);
            if (!plan) return null;
            for (const sessionId of plan.sessionIds) await sessionService.release(sessionId);
            for (const document of plan.orphanDocuments) await vectorIndex.deleteDocument(document.id);
            const removed = repos.projects.removeCascade(projectId);
            for (const document of plan.orphanDocuments) {
              await unlink(join(dataDir, "files", document.sha256)).catch((error) => {
                if (error?.code !== "ENOENT") throw error;
              });
            }
            return removed;
          },
          deleteKnowledgeBase: async (knowledgeBaseId) => {
            const plan = repos.knowledgeBases.deletionPlan(knowledgeBaseId);
            if (!plan) return null;
            for (const sessionId of plan.sessionIds) await sessionService.release(sessionId);
            for (const document of plan.orphanDocuments) await vectorIndex.deleteDocument(document.id);
            const removed = repos.knowledgeBases.removeCascade(knowledgeBaseId);
            for (const document of plan.orphanDocuments) {
              await unlink(join(dataDir, "files", document.sha256)).catch((error) => {
                if (error?.code !== "ENOENT") throw error;
              });
            }
            return removed;
          },
          runSchedule: (schedule) => scheduler.runScheduleNow(schedule),
          runSummary: ({ projectId, summaryDate }) => scheduler.runSummary(
            { id: projectId },
            new Date(),
            summaryDate ?? localDateKey(new Date(), settings.get("timezone")),
            settings.get("timezone"),
            { force: true },
          ),
        },
      });
      disposeRoute = api.register(ctx.webServer);
    } catch (err) {
      // Release whatever was created before the failure, in reverse order, so a
      // failed boot never leaks an adapter, route, or open resources.
      if (disposeRoute) { try { disposeRoute(); } catch { /* ignore */ } }
      if (scheduler) scheduler.stop();
      if (sessionService) { void sessionService.dispose().catch(() => {}); }
      if (queue) { void queue.close().catch(() => {}); }
      if (vectorIndex) { void vectorIndex.close().catch(() => {}); }
      if (db) { try { closeDatabase(db); } catch { /* ignore */ } }
      throw err;
    }

    return async () => {
      // Withdraw the route first (no new work), then drain every live DSH agent
      // handle before closing the index/vector/database layers in order.
      disposeRoute();
      scheduler.stop();
      await sessionService.dispose();
      await queue.close();
      await vectorIndex.close();
      closeDatabase(db);
    };
  }, "cpwb: host api + lifecycle");
}

export { inject, apply };
