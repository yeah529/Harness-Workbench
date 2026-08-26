import { randomUUID } from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  readdir,
  rename,
  rm,
} from "node:fs/promises";
import { join } from "node:path";

export const PURGE_STATES = Object.freeze([
  "queued",
  "stopping",
  "quarantining",
  "native_refs_updated",
  "restarting",
  "workbench_finalizing",
  "verifying",
  "completed",
  "restoring",
  "restored",
  "rollback_pending",
]);

export const ACTIVE_PURGE_STATES = Object.freeze(
  PURGE_STATES.filter((state) => state !== "completed" && state !== "restored"),
);

const NEXT_STATES = new Map([
  ["queued", new Set(["stopping", "restored"])],
  ["stopping", new Set(["quarantining", "restoring", "restored"])],
  ["quarantining", new Set(["native_refs_updated", "restoring"])],
  ["native_refs_updated", new Set(["restarting", "restoring"])],
  ["restarting", new Set(["workbench_finalizing", "restoring"])],
  ["workbench_finalizing", new Set(["verifying", "restoring"])],
  ["verifying", new Set(["completed", "restoring"])],
  ["restoring", new Set(["restored", "rollback_pending"])],
  ["rollback_pending", new Set(["restoring"])],
]);

const SAFE_ID = /^[A-Za-z0-9](?:[A-Za-z0-9_-]{0,126}[A-Za-z0-9])?$/;

function assertSafeId(value, label) {
  if (typeof value !== "string" || !SAFE_ID.test(value)) {
    throw new TypeError(`invalid ${label}`);
  }
  return value;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJsonAtomic(path, value) {
  const temporaryPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
  let handle;
  try {
    handle = await open(temporaryPath, "wx", 0o600);
    await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, "utf8");
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporaryPath, path);
  } catch (error) {
    await handle?.close().catch(() => {});
    await rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

function assertTransition(current, next) {
  if (!NEXT_STATES.get(current)?.has(next)) {
    throw new Error(`illegal purge transition: ${current} -> ${next}`);
  }
}

function normalizeOwner(owner) {
  if (!Number.isSafeInteger(owner?.pid) || owner.pid <= 0) {
    throw new TypeError("invalid lock owner pid");
  }
  return {
    pid: owner.pid,
    generation: assertSafeId(owner.generation, "generation"),
  };
}

export function resolveMaintenanceRoot({ dshHome }) {
  if (typeof dshHome !== "string" || dshHome.trim() === "") {
    throw new TypeError("dshHome is required");
  }
  return join(dshHome, "cyberpunk-workbench", "maintenance");
}

export function createPurgeJobStore({ dshHome }) {
  const root = resolveMaintenanceRoot({ dshHome });
  const readyRoot = join(root, "ready");
  const lockPath = join(root, "active.lock.json");

  const jobDirectory = (jobId) => join(root, assertSafeId(jobId, "job id"));
  const statePath = (jobId) => join(jobDirectory(jobId), "state.json");
  const manifestPath = (jobId) => join(jobDirectory(jobId), "manifest.json");
  const readyPath = (generation) =>
    join(readyRoot, `${assertSafeId(generation, "generation")}.json`);

  async function ensureRoot() {
    await mkdir(root, { recursive: true, mode: 0o700 });
  }

  async function read(jobId) {
    return readJson(statePath(jobId));
  }

  return {
    root,

    async create(request) {
      const jobId = assertSafeId(request?.jobId, "job id");
      await ensureRoot();
      await mkdir(jobDirectory(jobId), { mode: 0o700 });
      const created = {
        ...cloneJson(request),
        jobId,
        state: "queued",
        revision: 1,
        armed: false,
      };
      await writeJsonAtomic(statePath(jobId), created);
      return created;
    },

    read,

    async listIncomplete() {
      let entries;
      try {
        entries = await readdir(root, { withFileTypes: true });
      } catch (error) {
        if (error?.code === "ENOENT") return [];
        throw error;
      }
      const jobs = [];
      for (const entry of entries) {
        if (!entry.isDirectory() || !SAFE_ID.test(entry.name) || entry.name === "ready") {
          continue;
        }
        const job = await read(entry.name);
        if (ACTIVE_PURGE_STATES.includes(job.state)) {
          jobs.push(job);
        }
      }
      return jobs.sort(
        (left, right) =>
          String(left.createdAt).localeCompare(String(right.createdAt)) ||
          left.jobId.localeCompare(right.jobId),
      );
    },

    async arm(jobId) {
      const current = await read(jobId);
      if (current.armed) return current;
      const armed = {
        ...current,
        armed: true,
        revision: current.revision + 1,
      };
      await writeJsonAtomic(statePath(jobId), armed);
      return armed;
    },

    async transition(jobId, expectedState, nextState, patch = {}) {
      const current = await read(jobId);
      if (current.state !== expectedState) {
        throw new Error(
          `expected ${expectedState} for purge job ${jobId}, found ${current.state}`,
        );
      }
      assertTransition(current.state, nextState);
      const updated = {
        ...current,
        ...cloneJson(patch),
        jobId: current.jobId,
        state: nextState,
        revision: current.revision + 1,
      };
      await writeJsonAtomic(statePath(jobId), updated);
      return updated;
    },

    async writeManifest(jobId, manifest) {
      const path = manifestPath(jobId);
      await writeJsonAtomic(path, cloneJson(manifest));
      return cloneJson(manifest);
    },

    async readManifest(jobId) {
      return readJson(manifestPath(jobId));
    },

    async writeReady(generation, payload) {
      await mkdir(readyRoot, { recursive: true, mode: 0o700 });
      const value = cloneJson(payload);
      await writeJsonAtomic(readyPath(generation), value);
      return value;
    },

    async readReady(generation) {
      return readJson(readyPath(generation));
    },

    async acquireLock(owner) {
      const normalized = normalizeOwner(owner);
      await ensureRoot();
      let handle;
      try {
        handle = await open(lockPath, "wx", 0o600);
        await handle.writeFile(`${JSON.stringify(normalized, null, 2)}\n`, "utf8");
        await handle.sync();
        await handle.close();
        return normalized;
      } catch (error) {
        await handle?.close().catch(() => {});
        if (error?.code === "EEXIST") {
          throw new Error("purge maintenance lock is already held", { cause: error });
        }
        throw error;
      }
    },

    async releaseLock(owner) {
      const normalized = normalizeOwner(owner);
      const current = await readJson(lockPath);
      if (
        current.pid !== normalized.pid ||
        current.generation !== normalized.generation
      ) {
        throw new Error("purge maintenance lock owner does not match");
      }
      await rm(lockPath);
    },
  };
}
