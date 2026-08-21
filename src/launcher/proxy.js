export function validateProxyUrl(value) {
  if (value == null || value === "") return null;
  let url;
  try { url = new URL(value); } catch { throw new Error("proxy URL must be a valid http or https URL"); }
  if (!/^https?:$/.test(url.protocol) || !url.hostname) throw new Error("proxy URL must use http or https");
  if (url.username || url.password) throw new Error("proxy URL cannot contain credentials");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function sanitizeProxyUrl(value) {
  try {
    const url = new URL(value);
    url.username = ""; url.password = ""; url.search = ""; url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch { return ""; }
}

export function describeProxyEnv(env = process.env) {
  const describe = (value) => value ? sanitizeProxyUrl(value) : null;
  return { http: describe(env.HTTP_PROXY || env.http_proxy), https: describe(env.HTTPS_PROXY || env.https_proxy), noProxy: env.NO_PROXY || env.no_proxy || "", nodeUseEnvProxy: env.NODE_USE_ENV_PROXY === "1" };
}

export function buildProxyEnv({ env = process.env, mode = "inherit", proxyUrl, noProxy = "" } = {}) {
  if (!['inherit', 'direct', 'custom'].includes(mode)) throw new Error("proxy mode must be inherit, direct or custom");
  if (mode === "direct") return {
    ...env,
    NODE_USE_ENV_PROXY: "1",
    HTTP_PROXY: "", HTTPS_PROXY: "", http_proxy: "", https_proxy: "", NO_PROXY: noProxy, no_proxy: noProxy
  };
  if (mode === "custom") {
    const url = validateProxyUrl(proxyUrl);
    if (!url) throw new Error("custom proxy URL is required");
    return {
      ...env,
      NODE_USE_ENV_PROXY: "1",
      HTTP_PROXY: url, HTTPS_PROXY: url, http_proxy: "", https_proxy: "", NO_PROXY: noProxy, no_proxy: noProxy
    };
  }
  return noProxy
    ? { ...env, NODE_USE_ENV_PROXY: "1", NO_PROXY: noProxy, no_proxy: noProxy }
    : { ...env, NODE_USE_ENV_PROXY: "1" };
}
