#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { launchDsh } from "../src/launcher/process.js";
import { parseWorkbenchArgs } from "../src/launcher/cli.js";

function codexRouteRequested(options, env) {
  return options.codexAuth === "auto"
    || Object.prototype.hasOwnProperty.call(env, "CODEX_ACCESS_TOKEN")
    || (typeof env.OPENAI_CODEX_ACCESS_TOKEN === "string" && env.OPENAI_CODEX_ACCESS_TOKEN.trim() !== "");
}

try {
  const options = parseWorkbenchArgs(process.argv.slice(2));
  const result = await launchDsh({
    args: options.args,
    codexAuth: options.codexAuth,
    env: process.env,
    proxy: options.proxy,
    proxyExplicit: options.proxyExplicit,
    proxyFields: options.proxyFields,
    dataDir: options.dataDir,
    dshBin: process.env.DSH_BIN || undefined,
    patchPath: codexRouteRequested(options, process.env)
      ? fileURLToPath(new URL("../dsh-codex.patch.yml", import.meta.url))
      : undefined
  });
  if (result.signal) {
    // launchDsh already disposed its handlers before resolving. Re-deliver the
    // same signal so shell/process supervisors observe signal semantics rather
    // than a misleading ordinary exit 1.
    try { process.kill(process.pid, result.signal); }
    catch { process.exitCode = 128; }
  } else {
    process.exitCode = result.code;
  }
} catch (error) {
  // Authentication errors are intentionally stable and contain no secret.
  console.error(error instanceof Error ? error.message : "failed to launch DSH Workbench");
  process.exitCode = 1;
}
