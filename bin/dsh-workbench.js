#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { launchDsh } from "../src/launcher/process.js";
import { parseWorkbenchArgs } from "../src/launcher/cli.js";
import { ensureWorkbenchProfile } from "../src/launcher/profile.js";

try {
  const options = parseWorkbenchArgs(process.argv.slice(2));
  const packageRoot = fileURLToPath(new URL("../", import.meta.url));
  await ensureWorkbenchProfile({ packageRoot, env: process.env });
  const result = await launchDsh({
    args: options.args,
    codexAuth: options.codexAuth,
    env: process.env,
    proxy: options.proxy,
    proxyExplicit: options.proxyExplicit,
    proxyFields: options.proxyFields,
    dataDir: options.dataDir,
    dshBin: process.env.DSH_BIN || undefined,
    patchPath: fileURLToPath(new URL("../dsh-codex.patch.yml", import.meta.url)),
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
