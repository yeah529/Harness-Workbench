import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";

import { createPurgeJobStore } from "../maintenance/purge-jobs.js";
import {
  commitRc2Purge,
  prepareRc2Purge,
  restoreRc2Purge,
} from "../maintenance/rc2-storage.js";
import { buildChildEnv, loadCodexAccessToken, redactToken } from "./auth.js";
import { buildProxyEnv } from "./proxy.js";
import { readSavedNetwork, selectProxySettings } from "./settings.js";

const require = createRequire(import.meta.url);

export function resolveDshCommand({ dshBin, env = process.env, requireResolve = require.resolve } = {}) {
  if (dshBin) return { file: dshBin, prefixArgs: [] };
  try {
    return { file: process.execPath, prefixArgs: [requireResolve("@deepseek-ai/dsh/lib/bin.js")] };
  } catch {
    return { file: env.NPX_BIN || "npx", prefixArgs: ["--yes", "@deepseek-ai/dsh@0.1.1-rc.2"] };
  }
}

export function forwardChildSignals({ processLike = process, child } = {}) {
  const forwardInt = () => child.kill("SIGINT");
  const forwardTerm = () => child.kill("SIGTERM");
  processLike.once("SIGINT", forwardInt);
  processLike.once("SIGTERM", forwardTerm);
  const dispose = () => {
    processLike.removeListener("SIGINT", forwardInt);
    processLike.removeListener("SIGTERM", forwardTerm);
  };
  return dispose;
}

export function buildSupervisedChildEnv({
  baseEnv,
  dshHome,
  generation,
  jobId = null,
  recoveryCommand = "dsh-workbench web",
}) {
  const childEnv = {
    ...baseEnv,
    CPWB_SUPERVISED: "1",
    CPWB_DSH_HOME: dshHome,
    CPWB_LAUNCH_GENERATION: generation,
    CPWB_RECOVERY_COMMAND: recoveryCommand,
  };
  if (jobId) childEnv.CPWB_MAINTENANCE_JOB_ID = jobId;
  else delete childEnv.CPWB_MAINTENANCE_JOB_ID;
  return childEnv;
}

export function spawnDshChild({
  command,
  childArgs,
  childEnv,
  spawnImpl = spawn,
}) {
  const child = spawnImpl(command.file, childArgs, {
    env: childEnv,
    stdio: "inherit",
  });
  const exit = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code: code ?? 1, signal }));
  });
  return { child, exit };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForGenerationReady({
  jobs,
  generation,
  childExit,
  timeoutMs = 30_000,
  pollMs = 200,
}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      return await jobs.readReady(generation);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const event = await Promise.race([
      childExit.then((result) => ({ type: "exit", result })),
      delay(Math.min(pollMs, Math.max(1, deadline - Date.now()))).then(() => ({ type: "poll" })),
    ]);
    if (event.type === "exit") {
      const error = new Error("DSH child exited before the Workbench generation became ready");
      error.code = "PURGE_CHILD_EXITED";
      error.exit = event.result;
      throw error;
    }
  }
  const error = new Error(`Workbench generation readiness timed out: ${generation}`);
  error.code = "PURGE_READY_TIMEOUT";
  throw error;
}

async function waitForArmedJobOrExit({ jobs, childExit, pollMs }) {
  while (true) {
    const armed = (await jobs.listIncomplete()).find(
      (job) => job.state === "queued" && job.armed === true,
    );
    if (armed) return { type: "job", job: armed };
    const event = await Promise.race([
      childExit.then((result) => ({ type: "exit", result })),
      delay(pollMs).then(() => ({ type: "poll" })),
    ]);
    if (event.type === "exit") return event;
  }
}

async function stopChild(running, signal = "SIGTERM") {
  if (!running) return null;
  if (running.child.exitCode == null && running.child.signalCode == null) {
    running.child.kill(signal);
  }
  return running.exit.catch(() => ({ code: 1, signal: null }));
}

async function transitionToRestoring(jobs, jobId, error) {
  const current = await jobs.read(jobId);
  if (current.state === "restoring" || current.state === "restored") return current;
  return jobs.transition(jobId, current.state, "restoring", {
    error: {
      code: error?.code ?? "PURGE_MAINTENANCE_FAILED",
      message: error?.message ?? "maintenance failed",
    },
  });
}

async function hasManifest(jobs, jobId) {
  try {
    await jobs.readManifest(jobId);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

export async function recoverIncompletePurge({ dshHome, dataDir, jobs }) {
  const restored = [];
  for (const job of await jobs.listIncomplete()) {
    if (job.state === "queued") continue;
    if (job.state === "stopping" && !(await hasManifest(jobs, job.jobId))) {
      await jobs.transition(job.jobId, "stopping", "restored", {
        restoredAt: new Date().toISOString(),
      });
      continue;
    }
    if (job.state === "rollback_pending") {
      await jobs.transition(job.jobId, "rollback_pending", "restoring");
    } else if (job.state !== "restoring") {
      await transitionToRestoring(jobs, job.jobId);
    }
    if (await hasManifest(jobs, job.jobId)) {
      await restoreRc2Purge({ dshHome, dataDir, jobId: job.jobId, jobs });
    }
    restored.push(job.jobId);
  }
  return restored;
}

function maintenanceHome({ env, dataDir }) {
  if (env.CPWB_DSH_HOME) return env.CPWB_DSH_HOME;
  if (env.DSH_HOME) return env.DSH_HOME;
  if (env !== process.env && dataDir) return join(dataDir, ".dsh-supervisor");
  return join(homedir(), ".dsh");
}

function nextGeneration(counter) {
  return `generation-${counter}-${randomUUID()}`;
}

export async function launchDsh({
  args = [],
  dshBin,
  codexAuth = "disabled",
  env = process.env,
  proxy = {},
  proxyExplicit = false,
  proxyFields = [],
  dataDir,
  patchPath,
  processLike = process,
  spawnImpl = spawn,
  readyTimeoutMs = 30_000,
  readyPollMs = 200,
  monitorPollMs = 200,
  faultInjector = () => {},
} = {}) {
  const token = await loadCodexAccessToken({ codexAuth, env });
  const savedProxy = readSavedNetwork({ dataDir, env });
  const selectedProxy = selectProxySettings({ saved: savedProxy, cli: proxy, proxyExplicit, proxyFields });
  const proxyEnv = buildProxyEnv({ env, ...selectedProxy });
  const baseChildEnv = buildChildEnv({ baseEnv: env, token, proxyEnv });
  if (dataDir) baseChildEnv.DSH_CYBERPUNK_WORKBENCH_DATA_DIR = dataDir;
  const command = resolveDshCommand({ dshBin, env });
  const childArgs = [...command.prefixArgs, "web"];
  if (patchPath) childArgs.push("--patch", patchPath);
  childArgs.push(...args);

  const dshHome = maintenanceHome({ env, dataDir });
  const resolvedDataDir = dataDir
    ?? env.DSH_CYBERPUNK_WORKBENCH_DATA_DIR
    ?? join(dshHome, "cyberpunk-workbench");
  const jobs = createPurgeJobStore({ dshHome });
  const recoveryCommand = "dsh-workbench web";
  const pendingRestores = await recoverIncompletePurge({ dshHome, dataDir: resolvedDataDir, jobs });
  let generationCounter = 0;
  let running = null;
  let parentSignal = null;
  let dataPrepared = false;
  const onInt = () => {
    parentSignal ??= "SIGINT";
    if (running) running.child.kill(dataPrepared ? "SIGTERM" : "SIGINT");
  };
  const onTerm = () => {
    parentSignal ??= "SIGTERM";
    if (running) running.child.kill("SIGTERM");
  };
  processLike.once("SIGINT", onInt);
  processLike.once("SIGTERM", onTerm);

  const spawnGeneration = (jobId = null) => {
    generationCounter += 1;
    const generation = nextGeneration(generationCounter);
    const childEnv = buildSupervisedChildEnv({
      baseEnv: baseChildEnv,
      dshHome,
      generation,
      jobId,
      recoveryCommand,
    });
    const started = spawnDshChild({ command, childArgs, childEnv, spawnImpl });
    return { ...started, generation };
  };

  try {
    running = spawnGeneration();
    if (pendingRestores.length > 0) {
      await waitForGenerationReady({
        jobs,
        generation: running.generation,
        childExit: running.exit,
        timeoutMs: readyTimeoutMs,
        pollMs: readyPollMs,
      });
      for (const jobId of pendingRestores) {
        await jobs.transition(jobId, "restoring", "restored", {
          restoredAt: new Date().toISOString(),
        });
      }
    }

    while (true) {
      const event = await waitForArmedJobOrExit({
        jobs,
        childExit: running.exit,
        pollMs: monitorPollMs,
      });
      if (event.type === "exit") {
        return parentSignal ? { code: event.result.code, signal: parentSignal } : event.result;
      }

      const jobId = event.job.jobId;
      const owner = { pid: process.pid, generation: running.generation };
      await jobs.transition(jobId, "queued", "stopping", {
        stoppedGeneration: running.generation,
      });
      await stopChild(running, "SIGTERM");
      if (parentSignal) return { code: 1, signal: parentSignal };
      await jobs.acquireLock(owner);

      try {
        const quarantining = await jobs.transition(jobId, "stopping", "quarantining");
        await prepareRc2Purge({
          dshHome,
          dataDir: resolvedDataDir,
          job: quarantining,
          jobs,
          faultInjector,
        });
        dataPrepared = true;
        await jobs.transition(jobId, "quarantining", "native_refs_updated");
        await jobs.transition(jobId, "native_refs_updated", "restarting");
        faultInjector("before-maintenance-child-spawn");
        if (parentSignal) {
          const error = new Error("maintenance was interrupted before restart");
          error.code = "PURGE_INTERRUPTED";
          throw error;
        }
        running = spawnGeneration(jobId);
        await waitForGenerationReady({
          jobs,
          generation: running.generation,
          childExit: running.exit,
          timeoutMs: readyTimeoutMs,
          pollMs: readyPollMs,
        });
        const finalized = await jobs.read(jobId);
        if (finalized.state !== "verifying") {
          const error = new Error(`Host did not finalize purge job: ${finalized.state}`);
          error.code = "PURGE_HOST_NOT_VERIFIED";
          throw error;
        }
        await commitRc2Purge({ dshHome, dataDir: resolvedDataDir, jobId, jobs });
        dataPrepared = false;
        await jobs.releaseLock(owner);
      } catch (error) {
        await stopChild(running, "SIGTERM");
        await transitionToRestoring(jobs, jobId, error);
        if (await hasManifest(jobs, jobId)) {
          await restoreRc2Purge({ dshHome, dataDir: resolvedDataDir, jobId, jobs });
        }
        dataPrepared = false;
        if (parentSignal) {
          await jobs.transition(jobId, "restoring", "restored", {
            restoredAt: new Date().toISOString(),
          });
          await jobs.releaseLock(owner).catch(() => {});
          return { code: 1, signal: parentSignal };
        }
        try {
          faultInjector("before-recovery-child-spawn");
          running = spawnGeneration();
          await waitForGenerationReady({
            jobs,
            generation: running.generation,
            childExit: running.exit,
            timeoutMs: readyTimeoutMs,
            pollMs: readyPollMs,
          });
          await jobs.transition(jobId, "restoring", "restored", {
            restoredAt: new Date().toISOString(),
          });
          await jobs.releaseLock(owner).catch(() => {});
        } catch (recoveryError) {
          await stopChild(running, "SIGTERM");
          await jobs.transition(jobId, "restoring", "rollback_pending", {
            error: {
              code: recoveryError?.code ?? "PURGE_RECOVERY_START_FAILED",
              message: recoveryError?.message ?? "recovery child failed",
            },
          });
          await jobs.releaseLock(owner).catch(() => {});
          return { code: 1, signal: null };
        }
      }
    }
  } catch (error) {
    throw new Error(redactToken(error?.message ?? String(error), token), { cause: error });
  } finally {
    processLike.removeListener("SIGINT", onInt);
    processLike.removeListener("SIGTERM", onTerm);
  }
}
