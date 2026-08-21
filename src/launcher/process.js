import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { buildChildEnv, loadCodexAccessToken, redactToken } from "./auth.js";
import { buildProxyEnv } from "./proxy.js";
import { readSavedNetwork, selectProxySettings } from "./settings.js";

const require = createRequire(import.meta.url);

export function resolveDshCommand({ dshBin, env = process.env, requireResolve = require.resolve } = {}) {
  if (dshBin) return { file: dshBin, prefixArgs: [] };
  try {
    return { file: process.execPath, prefixArgs: [requireResolve("@deepseek-ai/dsh/lib/bin.js")] };
  } catch {
    return { file: env.NPX_BIN || "npx", prefixArgs: ["--yes", "@deepseek-ai/dsh@0.1.0-rc.8"] };
  }
}

export function forwardChildSignals({ processLike = process, child } = {}) {
  // Node signal events do not pass the signal name as an argument.
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

export async function launchDsh({ args = [], dshBin, codexAuth = "disabled", env = process.env, proxy = {}, proxyExplicit = false, proxyFields = [], dataDir, patchPath } = {}) {
  // loadCodexAccessToken never reads the cache unless codexAuth is explicitly
  // auto. An inherited OPENAI_CODEX_ACCESS_TOKEN is already child-ready and
  // therefore does not trigger any cache lookup.
  const token = await loadCodexAccessToken({ codexAuth, env });
  const savedProxy = readSavedNetwork({ dataDir, env });
  const selectedProxy = selectProxySettings({ saved: savedProxy, cli: proxy, proxyExplicit, proxyFields });
  const proxyEnv = buildProxyEnv({ env, ...selectedProxy });
  const childEnv = buildChildEnv({ baseEnv: env, token, proxyEnv });
  if (dataDir) childEnv.DSH_CYBERPUNK_WORKBENCH_DATA_DIR = dataDir;
  const command = resolveDshCommand({ dshBin, env });
  const childArgs = [...command.prefixArgs, "web"];
  if (patchPath) childArgs.push("--patch", patchPath);
  childArgs.push(...args);
  return new Promise((resolve, reject) => {
    const child = spawn(command.file, childArgs, { env: childEnv, stdio: "inherit" });
    const dispose = forwardChildSignals({ child });
    child.once("error", (error) => { dispose(); reject(new Error(redactToken(error.message, token))); });
    child.once("exit", (code, signal) => { dispose(); resolve({ code: code ?? 1, signal }); });
  });
}
