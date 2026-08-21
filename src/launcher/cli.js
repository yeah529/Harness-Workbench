function value(args, index, flag) {
  const current = args[index];
  if (current.startsWith(`${flag}=`)) {
    const equal = current.slice(flag.length + 1);
    if (!equal) throw new Error(`${flag} needs a non-empty value`);
    return [equal, index];
  }
  if (args[index + 1] === undefined || args[index + 1] === "" || args[index + 1].startsWith("--")) throw new Error(`${flag} needs a value`);
  return [args[index + 1], index + 1];
}

export function parseWorkbenchArgs(argv = []) {
  const input = [...argv];
  let command = "web";
  if (input[0] && !input[0].startsWith("-")) command = input.shift();
  if (command !== "web") throw new Error(`unsupported command: ${command}`);
  let codexAuth = "disabled";
  const proxy = { mode: "inherit", noProxy: "" };
  const proxyFields = [];
  let proxyExplicit = false;
  let dataDir;
  const args = [];
  let passthrough = false;
  for (let index = 0; index < input.length; index += 1) {
    const current = input[index];
    if (passthrough) { args.push(current); continue; }
    if (current === "--") { passthrough = true; continue; }
    if (current === "--codex-auth" || current.startsWith("--codex-auth=")) {
      const [next, consumed] = value(input, index, "--codex-auth");
      if (!['disabled', 'auto'].includes(next)) throw new Error("--codex-auth must be disabled or auto");
      codexAuth = next;
      index = consumed;
      continue;
    }
    if (current === "--proxy-mode" || current.startsWith("--proxy-mode=")) {
      const [next, consumed] = value(input, index, "--proxy-mode");
      if (!['inherit', 'direct', 'custom'].includes(next)) throw new Error("--proxy-mode must be inherit, direct or custom");
      proxy.mode = next;
      proxyFields.push("mode");
      proxyExplicit = true;
      index = consumed;
      continue;
    }
    if (current === "--proxy-url" || current.startsWith("--proxy-url=")) {
      const [next, consumed] = value(input, index, "--proxy-url");
      proxy.proxyUrl = next;
      proxy.mode = "custom";
      proxyFields.push("proxyUrl", "mode");
      proxyExplicit = true;
      index = consumed;
      continue;
    }
    if (current === "--no-proxy" || current.startsWith("--no-proxy=")) {
      const [next, consumed] = value(input, index, "--no-proxy");
      proxy.noProxy = next;
      proxyFields.push("noProxy");
      proxyExplicit = true;
      index = consumed;
      continue;
    }
    if (current === "--data-dir" || current.startsWith("--data-dir=")) {
      const [next, consumed] = value(input, index, "--data-dir");
      dataDir = next;
      index = consumed;
      continue;
    }
    args.push(current);
  }
  return { command, codexAuth, proxy, proxyExplicit, proxyFields: [...new Set(proxyFields)], dataDir, args };
}
