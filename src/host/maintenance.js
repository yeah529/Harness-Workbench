import { createHash, randomUUID } from "node:crypto";

import {
  probeRc2PurgeBackend,
  readSessionDescendants,
} from "../maintenance/rc2-storage.js";

function normalizeKind(kind) {
  if (kind === "project") return "project";
  if (["knowledge_base", "knowledge-base", "knowledgeBase"].includes(kind)) {
    return "knowledge_base";
  }
  throw new TypeError("maintenance requires a project or knowledge base");
}

function normalizeId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new TypeError("container id must be positive");
  return id;
}

function versionOf(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function publicJob(job) {
  return structuredClone(job);
}

function recoveryCommand(env) {
  const value = String(env.CPWB_RECOVERY_COMMAND ?? "").trim();
  if (
    value &&
    !/[\r\n]/.test(value) &&
    !/(access[_-]?token|authorization|api[_-]?key|bearer)/i.test(value)
  ) return value;
  return "dsh-workbench web";
}

export function createMaintenanceService({
  env = process.env,
  dshHome,
  dataDir,
  repos,
  vectorIndex,
  jobs,
  now = () => new Date(),
}) {
  const supervised = env.CPWB_SUPERVISED === "1";
  const startupJobId = env.CPWB_MAINTENANCE_JOB_ID || null;
  const generation = env.CPWB_LAUNCH_GENERATION || null;
  let locked = Boolean(startupJobId);

  function capability() {
    return supervised
      ? {
          available: true,
          requiresRestart: true,
          backend: "rc2-jsonl-zstd",
          reason: null,
        }
      : {
          available: false,
          requiresRestart: true,
          backend: null,
          reason: "Permanent deletion requires dsh-workbench supervised mode",
        };
  }

  async function containerPlan(kindInput, idInput) {
    const kind = normalizeKind(kindInput);
    const id = normalizeId(idInput);
    const repository = kind === "project" ? repos.projects : repos.knowledgeBases;
    const plan = repository.deletionPlan(id);
    if (!plan) throw new Error("container not found");
    const container = kind === "project" ? plan.project : plan.knowledgeBase;
    const sessionIds = [...plan.sessionIds].sort();
    const descendantSessionIds = await readSessionDescendants({
      dshHome,
      rootSessionIds: sessionIds,
    });
    const orphanDocuments = [...plan.orphanDocuments].sort((left, right) => left.id - right.id);
    const payload = {
      kind,
      id,
      name: container.name,
      sessionIds,
      descendantSessionIds,
      orphanDocumentIds: orphanDocuments.map((document) => document.id),
    };
    return {
      ...payload,
      container,
      orphanDocuments,
      linkedDocuments: plan.linkedDocuments,
      relationshipCount: plan.relationshipCount,
      planVersion: versionOf(payload),
      permanentDeletion: capability(),
    };
  }

  async function createPurgeJob(input) {
    if (!supervised) throw new Error(capability().reason);
    if (input?.restartConfirmed !== true) {
      throw new Error("restart confirmation is required");
    }
    const backend = await probeRc2PurgeBackend({ dshHome, dataDir });
    if (!backend.supported) throw new Error(backend.reason);
    if ((await jobs.listIncomplete()).length > 0) {
      throw new Error("another purge maintenance job is active");
    }
    const plan = await containerPlan(input.kind, input.id);
    if (input.name !== plan.name) throw new Error("exact container name is required");
    if (input.planVersion !== plan.planVersion) {
      throw new Error("stale purge plan: refresh the deletion details");
    }
    return jobs.create({
      jobId: `purge-${randomUUID()}`,
      container: { kind: plan.kind, id: plan.id, name: plan.name },
      planVersion: plan.planVersion,
      sessionIds: plan.sessionIds,
      descendantSessionIds: plan.descendantSessionIds,
      orphanDocuments: plan.orphanDocuments.map(({ id, sha256 }) => ({ id, sha256 })),
      createdAt: now().toISOString(),
      recoveryCommand: recoveryCommand(env),
    });
  }

  async function finalizeStartupJob() {
    if (!startupJobId) {
      locked = false;
      return null;
    }
    const restarting = await jobs.read(startupJobId);
    if (restarting.state !== "restarting") {
      throw new Error(
        `startup purge job must be restarting, found ${restarting.state}`,
      );
    }
    const job = await jobs.transition(
      startupJobId,
      "restarting",
      "workbench_finalizing",
      { finalizationStartedAt: now().toISOString() },
    );
    try {
      for (const sessionId of [
        ...new Set([...job.sessionIds, ...job.descendantSessionIds]),
      ]) {
        await vectorIndex.deleteSession(sessionId);
      }
      for (const document of job.orphanDocuments) {
        await vectorIndex.deleteDocument(document.id);
      }
      repos.maintenance.purgeContainer({
        kind: job.container.kind,
        id: job.container.id,
        expectedSessionIds: job.sessionIds,
        expectedOrphanDocumentIds: job.orphanDocuments.map((document) => document.id),
      });
      const verifying = await jobs.transition(
        startupJobId,
        "workbench_finalizing",
        "verifying",
        { finalizationFinishedAt: now().toISOString() },
      );
      locked = false;
      return verifying;
    } catch (error) {
      await jobs.transition(
        startupJobId,
        "workbench_finalizing",
        "restoring",
        {
          error: {
            code: "PURGE_WORKBENCH_FINALIZE_FAILED",
            message: error?.message ?? "Workbench purge finalization failed",
          },
        },
      ).catch(() => {});
      throw error;
    }
  }

  return {
    capability,
    containerPlan,
    createPurgeJob,
    armPurgeJob(jobId) {
      return jobs.arm(jobId);
    },
    async getJob(jobId) {
      return publicJob(await jobs.read(jobId));
    },
    isLocked() {
      return locked;
    },
    finalizeStartupJob,
    async markGenerationReady() {
      if (!generation) return null;
      return jobs.writeReady(generation, {
        jobId: startupJobId,
        generation,
        readyAt: now().toISOString(),
      });
    },
  };
}
