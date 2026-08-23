import { DEFAULT_TIME_ZONE, validateTimeZone } from "./timezone.js";

export const DEFAULT_AUTOMATION_PROMPTS = Object.freeze({
  summaryPrompt: [
    "请总结项目 {{projectId}} 在 {{date}} 的进展。",
    "以下数据是本次总结的全部输入；不要读取工作区，不要调用任何工具。",
    "仅输出最终中文总结正文，不要输出 DSML、XML、代码、分析过程或工具调用。若数据均为空，请直接说明今日暂无可总结的项目进展记录。",
  ].join("\n"),
  todoPrompt: [
    "请根据项目 {{projectId}} 在 {{date}} 的未完成事项生成 {{nextDate}} 的待办。",
    "以下数据是本次生成的全部输入；不要读取工作区，不要调用任何工具，也不要输出 DSML、XML 或工具调用。",
    "只输出逐行清单，不要输出标题。",
  ].join("\n"),
});

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
  automationPrompts: DEFAULT_AUTOMATION_PROMPTS,
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
