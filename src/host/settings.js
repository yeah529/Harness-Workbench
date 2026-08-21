import { DEFAULT_TIME_ZONE, validateTimeZone } from "./timezone.js";

const DEFAULTS = Object.freeze({
  embedding: {
    provider: "ollama",
    baseUrl: "http://127.0.0.1:11434",
    model: "qwen3-embedding:0.6b",
    dimensions: 1024,
    timeoutMs: 30_000,
  },
  network: { mode: "inherit", noProxy: "" },
  timezone: DEFAULT_TIME_ZONE,
  index: { status: "ready", identity: null, documentCount: 0 },
});

function clone(value) { return JSON.parse(JSON.stringify(value)); }

const SENSITIVE_KEY = /(?:api[_-]?key|token|password|secret|authorization)/i;

function stripSensitive(value) {
  if (Array.isArray(value)) return value.map(stripSensitive);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !SENSITIVE_KEY.test(key))
    .map(([key, child]) => [key, stripSensitive(child)]));
}

function merge(base, value) {
  if (base && typeof base === "object" && !Array.isArray(base)) {
    return { ...clone(base), ...(value && typeof value === "object" && !Array.isArray(value) ? value : {}) };
  }
  return value === undefined ? clone(base) : clone(value);
}

export function createWorkbenchSettings({ repos, dshInitial = {} } = {}) {
  if (!repos?.settings) throw new Error("createWorkbenchSettings requires settings repository");
  const read = (key) => repos.settings.get(key);
  const ensure = (key) => {
    const stored = read(key);
    if (stored != null) {
      const clean = stripSensitive(stored);
      const normalized = key === "timezone" ? validateTimeZone(clean) : merge(DEFAULTS[key] ?? {}, clean);
      if (JSON.stringify(normalized) !== JSON.stringify(stored)) repos.settings.set(key, normalized);
      return normalized;
    }
    const initial = stripSensitive(dshInitial[key] ?? DEFAULTS[key]);
    return repos.settings.set(key, key === "timezone" ? validateTimeZone(initial) : merge(DEFAULTS[key] ?? {}, initial));
  };
  return {
    get(key) { return clone(ensure(key)); },
    all() { return Object.fromEntries(Object.keys(DEFAULTS).map((key) => [key, clone(ensure(key))])); },
    set(key, value) {
      if (!(key in DEFAULTS)) throw new Error("unknown Workbench setting: " + key);
      value = stripSensitive(value);
      if (key === "timezone") value = validateTimeZone(value);
      if (key === "network" && value?.proxyUrl) {
        const url = new URL(value.proxyUrl);
        if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw new Error("proxy URL must be http(s) without credentials");
      }
      return clone(repos.settings.set(key, merge(ensure(key), value)));
    },
    reset(key) {
      if (!(key in DEFAULTS)) throw new Error("unknown Workbench setting: " + key);
      return clone(repos.settings.set(key, clone(DEFAULTS[key])));
    },
    defaults: clone(DEFAULTS),
  };
}

export { DEFAULTS as WORKBENCH_SETTING_DEFAULTS };
