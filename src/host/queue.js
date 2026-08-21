/**
 * Serial document indexing queue.
 *
 * createIndexQueue turns content-addressed uploads into durable indexes by
 * running, one document at a time, the pipeline
 * parseDocument -> chunkSections -> indexDocument. Each task reads the stored
 * file from its content-addressed path, resolves the document's *live* SQLite
 * links into projectIds / knowledgeBaseIds, and hands them to the indexer.
 *
 * The queue is strictly serial: one document is processed at a time, and a
 * failed document is marked "failed" (never left half-written) while the queue
 * moves on to the next task. The same documentId has at most one queued task;
 * a second enqueue for an in-flight or pending document coalesces onto the
 * existing task's completion promise.
 */

import { chunkSections } from "./chunk.js";
import { parseDocument } from "./parse.js";

/** Bound a thrown value into a short, non-leaking message. */
function messageOf(err) {
  if (err == null) return "unknown error";
  const msg = typeof err.message === "string" ? err.message : String(err);
  return msg.length <= 300 ? msg : msg.slice(0, 300) + "…";
}

function validateTask(task) {
  if (task == null || typeof task !== "object") {
    throw new Error("enqueue requires a task object");
  }
  if (!Number.isSafeInteger(task.documentId) || task.documentId <= 0) {
    throw new Error("enqueue requires a positive integer documentId");
  }
  if (typeof task.filePath !== "string" || task.filePath === "") {
    throw new Error("enqueue requires a filePath string");
  }
  if (typeof task.originalName !== "string" || task.originalName === "") {
    throw new Error("enqueue requires an originalName string");
  }
}

/**
 * @param {object} options
 * @param {ReturnType<import("./repositories.js").createRepositories>} options.repos
 * @param {{ indexDocument: (opts: object) => Promise<object> }} options.indexer
 */
export function createIndexQueue({ repos, indexer }) {
  if (!repos || !indexer) {
    throw new Error("createIndexQueue requires repos and indexer");
  }

  const pending = [];            // entries waiting to run, FIFO
  const byDocumentId = new Map(); // documentId -> entry (dedupe)
  let running = false;
  let closed = false;
  let drainPromise = null;
  const idleWaiters = [];

  async function processTask(task) {
    const { documentId, filePath, originalName, mimeType } = task;
    try {
      const { sections } = await parseDocument({ path: filePath, originalName, mimeType });
      const chunks = chunkSections({ documentId, originalName, sections });

      // Resolve live links now so a newly-added association is reflected even
      // if the document was already indexed before the link existed.
      const links = repos.documents.listLinks(documentId);
      const projectIds = [...new Set(links.filter((l) => l.scope === "project").map((l) => l.scopeId))];
      const knowledgeBaseIds = [...new Set(links.filter((l) => l.scope === "knowledgeBase").map((l) => l.scopeId))];

      const result = await indexer.indexDocument({ documentId, chunks, projectIds, knowledgeBaseIds });
      return { ok: result == null || result.ok !== false, documentId, error: result ? result.error : undefined };
    } catch (err) {
      // A parse/chunk/index failure must mark the document failed and continue.
      repos.documents.updateIndexState(documentId, {
        status: "failed",
        error: "indexing: " + messageOf(err),
        indexedAt: null,
      });
      return { ok: false, documentId, error: messageOf(err) };
    }
  }

  async function drain() {
    running = true;
    try {
      while (pending.length > 0) {
        const entry = pending.shift();
        try {
          const result = await processTask(entry.task);
          entry.resolve(result);
        } catch (err) {
          entry.resolve({ ok: false, documentId: entry.task.documentId, error: messageOf(err) });
        } finally {
          // Keep the documentId mapped while the task is in-flight so a
          // concurrent enqueue coalesces onto this entry instead of starting a
          // duplicate run. Only release it once processing fully completes, so
          // an explicit reindex may then re-enqueue the document.
          byDocumentId.delete(entry.task.documentId);
        }
      }
    } finally {
      running = false;
      const waiters = idleWaiters.splice(0);
      for (const waiter of waiters) waiter();
    }
  }

  function kick() {
    if (!drainPromise) {
      drainPromise = drain().finally(() => {
        drainPromise = null;
        // `idle()` waiters resume from drain's finally block before this
        // promise-finally callback clears the guard. If a caller enqueues
        // immediately after idle resolves, pick that work up on the next
        // turn instead of leaving it stranded behind the old promise.
        if (pending.length > 0 && !closed) kick();
      });
    }
  }

  return {
    /**
     * Enqueue one document for indexing. A duplicate documentId coalesces onto
     * the existing task. The returned promise resolves with the task outcome
     * ({ ok, documentId, error? }) once its processing finishes; it never
     * rejects.
     */
    enqueue(task) {
      if (closed) throw new Error("index queue is closed");
      validateTask(task);
      const existing = byDocumentId.get(task.documentId);
      if (existing) return existing.promise;
      let resolve;
      const promise = new Promise((res) => { resolve = res; });
      const entry = { task, resolve, promise };
      byDocumentId.set(task.documentId, entry);
      pending.push(entry);
      kick();
      return promise;
    },

    /** Resolve once every queued and in-flight task has finished. */
    idle() {
      if (!running && pending.length === 0) return Promise.resolve();
      return new Promise((resolve) => idleWaiters.push(resolve));
    },

    /**
     * Stop accepting new work and wait for every pending and in-flight task to
     * finish. Safe to call during plugin disposal; never leaves a dangling
     * processing promise.
     */
    async close() {
      closed = true;
      if (drainPromise) await drainPromise;
    },
  };
}
