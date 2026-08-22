import React from "react";
import { Key, Plug, ShieldCheck, SpinnerGap, WarningCircle } from "@phosphor-icons/react";

const WORKBENCH_SECTIONS = [
  ["workbench", "总览"],
  ["timezone", "时区"],
  ["embedding", "向量模型"],
  ["network", "网络 / Proxy"],
  ["auth", "Codex"],
];

function ActionMessage({ message }) {
  return message ? React.createElement("p", { role: "status", className: "cpwb-settings-message" }, message) : null;
}

function TimezonePanel({ settings, store }) {
  const [draft, setDraft] = React.useState(settings.timezone || "Asia/Shanghai");
  const [message, setMessage] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => setDraft(settings.timezone || "Asia/Shanghai"), [settings.timezone]);
  const save = async () => {
    setSaving(true); setMessage("");
    try { await store.actions.updateTimezone(draft); setMessage("已更新；历史 UTC 时间保持不变。"); }
    catch (error) { setMessage(error?.message || "时区更新失败"); }
    finally { setSaving(false); }
  };
  return React.createElement("div", { className: "cpwb-settings-panel" },
    React.createElement("span", { className: "cpwb-eyebrow" }, "WORKBENCH / GLOBAL TIMEZONE"),
    React.createElement("h2", null, "全局时区"),
    React.createElement("p", null, "所有待办、定时任务、总结与界面时间统一使用 Workbench 时区。"),
    React.createElement("select", { value: draft, onChange: (event) => setDraft(event.target.value), "aria-label": "Workbench 时区" },
      ...["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/London", "America/Los_Angeles", "America/New_York", "UTC"].map((zone) => React.createElement("option", { key: zone, value: zone }, zone))),
    React.createElement("input", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "合法 IANA ID，例如 Europe/Berlin", "aria-label": "自定义 IANA 时区" }),
    React.createElement("button", { type: "button", onClick: save, disabled: saving }, saving ? "保存中…" : "保存时区"),
    React.createElement(ActionMessage, { message }),
  );
}

function EmbeddingPanel({ settings, store }) {
  const embedding = settings.embedding || {};
  const credential = embedding.credential || { configured: false, source: null, readOnly: false };
  const [draft, setDraft] = React.useState({
    provider: embedding.provider || "ollama", baseUrl: embedding.baseUrl || "http://127.0.0.1:11434",
    model: embedding.model || "qwen3-embedding:0.6b", dimensions: embedding.dimensions || 1024,
    timeoutMs: embedding.timeoutMs || 30000, credentialRef: embedding.credentialRef || "",
  });
  const [credentialValue, setCredentialValue] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => setDraft({
    provider: embedding.provider || "ollama", baseUrl: embedding.baseUrl || "http://127.0.0.1:11434",
    model: embedding.model || "qwen3-embedding:0.6b", dimensions: embedding.dimensions || 1024,
    timeoutMs: embedding.timeoutMs || 30000, credentialRef: embedding.credentialRef || "",
  }), [embedding.provider, embedding.baseUrl, embedding.model, embedding.dimensions, embedding.timeoutMs, embedding.credentialRef]);
  const patch = (key) => (event) => setDraft((current) => ({ ...current, [key]: event.target.value }));
  const run = async (action, success) => {
    setSaving(true); setMessage("");
    try { await action(); setMessage(success); }
    catch (error) { setMessage(error?.message || "操作失败"); }
    finally { setSaving(false); }
  };
  const config = { ...draft, dimensions: Number(draft.dimensions), timeoutMs: Number(draft.timeoutMs) };
  const index = settings.index || {};
  return React.createElement("div", { className: "cpwb-settings-panel" },
    React.createElement("span", { className: "cpwb-eyebrow" }, "KNOWLEDGE / EMBEDDING"),
    React.createElement("h2", null, "向量模型"),
    React.createElement("label", null, "Provider", React.createElement("select", { value: draft.provider, onChange: patch("provider") }, React.createElement("option", { value: "ollama" }, "Ollama"), React.createElement("option", { value: "openai-compatible" }, "OpenAI-compatible"))),
    React.createElement("label", null, "Base URL", React.createElement("input", { value: draft.baseUrl, onChange: patch("baseUrl"), "aria-label": "Embedding Base URL" })),
    React.createElement("label", null, "Model", React.createElement("input", { value: draft.model, onChange: patch("model"), "aria-label": "Embedding model" })),
    React.createElement("label", null, "Dimensions", React.createElement("input", { type: "number", value: draft.dimensions, onChange: patch("dimensions"), "aria-label": "Embedding dimensions" })),
    React.createElement("label", null, "Timeout (ms)", React.createElement("input", { type: "number", value: draft.timeoutMs, onChange: patch("timeoutMs"), "aria-label": "Embedding timeout" })),
    React.createElement("label", null, "Credential reference", React.createElement("input", { value: draft.credentialRef, onChange: patch("credentialRef"), "aria-label": "Embedding credential reference" })),
    React.createElement("div", { className: "cpwb-settings-actions" },
      React.createElement("button", { type: "button", onClick: () => run(() => store.actions.testEmbedding(config), "向量服务连接正常。"), disabled: saving }, "测试连接"),
      React.createElement("button", { type: "button", onClick: () => run(() => store.actions.updateEmbedding(config), "向量配置已保存，索引状态正在校验。"), disabled: saving }, "保存配置")),
    React.createElement("fieldset", null,
      React.createElement("legend", null, "凭据状态"),
      React.createElement("p", null, credential.configured ? `已配置 · 来源 ${credential.source || "未知"}` : "未配置", credential.readOnly ? " · 只读" : ""),
      React.createElement("input", { type: "password", value: credentialValue, onChange: (event) => setCredentialValue(event.target.value), placeholder: "输入新凭据", "aria-label": "新 embedding 凭据" }),
      React.createElement("button", { type: "button", onClick: () => run(() => store.actions.putEmbeddingCredential({ credentialRef: draft.credentialRef, value: credentialValue }), "凭据已交由 DSH credentials 保存。"), disabled: saving || !draft.credentialRef || !credentialValue }, "设置 / 替换凭据"),
      React.createElement("button", { type: "button", onClick: () => run(() => store.actions.deleteEmbeddingCredential({ credentialRef: draft.credentialRef }), "凭据已清除。"), disabled: saving || !draft.credentialRef }, "清除凭据")),
    React.createElement("div", { className: "cpwb-settings-index" },
      React.createElement("strong", null, `索引状态：${index.status || "unknown"}`),
      React.createElement("span", null, `文档 ${index.counts?.ready ?? index.documentCount ?? 0}`),
      React.createElement("p", null, "影响范围：全部知识库文档"),
      React.createElement("button", { type: "button", onClick: () => {
        const allowed = typeof window === "undefined" || typeof window.confirm !== "function"
          ? true
          : window.confirm("将重建全部知识库向量索引，可能需要较长时间。继续？");
        if (allowed) store.actions.reindexAllIndexes?.();
      }, disabled: saving }, "重建全部向量索引")),
    React.createElement(ActionMessage, { message }),
  );
}

function NetworkPanel({ settings, store }) {
  const network = settings.network || {};
  const saved = network.nextLaunch || network;
  const [draft, setDraft] = React.useState({ mode: saved.mode || "inherit", proxyUrl: saved.proxyUrl || "", noProxy: saved.noProxy || "" });
  const [message, setMessage] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);
  React.useEffect(() => setDraft({ mode: saved.mode || "inherit", proxyUrl: saved.proxyUrl || "", noProxy: saved.noProxy || "" }), [saved.mode, saved.proxyUrl, saved.noProxy]);
  const run = async (action, success) => { setSaving(true); setMessage(""); try { const result = await action(); if (result) setTestResult(result); setMessage(success); } catch (error) { setMessage(error?.message || "网络操作失败"); } finally { setSaving(false); } };
  return React.createElement("div", { className: "cpwb-settings-panel" },
    React.createElement("span", { className: "cpwb-eyebrow" }, "RUNTIME / NETWORK"),
    React.createElement("h2", null, "网络 / Proxy"),
    React.createElement("label", null, "模式", React.createElement("select", { value: draft.mode, onChange: (event) => setDraft({ ...draft, mode: event.target.value }) }, React.createElement("option", { value: "inherit" }, "继承 DSH"), React.createElement("option", { value: "direct" }, "直连"), React.createElement("option", { value: "custom" }, "自定义 Proxy"))),
    React.createElement("label", null, "Proxy URL", React.createElement("input", { value: draft.proxyUrl, onChange: (event) => setDraft({ ...draft, proxyUrl: event.target.value }), "aria-label": "Proxy URL" })),
    React.createElement("label", null, "No Proxy", React.createElement("input", { value: draft.noProxy, onChange: (event) => setDraft({ ...draft, noProxy: event.target.value }), "aria-label": "No Proxy" })),
    React.createElement("div", { className: "cpwb-settings-actions" },
      React.createElement("button", { type: "button", onClick: () => run(() => store.actions.updateNetwork(draft), "网络配置已保存；进程级代理将在下次启动生效。"), disabled: saving }, "保存网络"),
      React.createElement("button", { type: "button", onClick: () => run(() => store.actions.testNetwork(draft), "已完成当前生效网络测试；自定义配置将在下次启动验证。"), disabled: saving }, "测试当前生效网络")),
    React.createElement("p", null, `当前生效：${network.currentEffective?.mode || "inherit"}`),
    React.createElement("p", null, `下次启动：${network.nextLaunch?.mode || network.mode || "inherit"}`),
    React.createElement("p", null, network.requiresRestart ? "配置已保存，下次启动生效。" : "当前进程已与保存配置一致。"),
    testResult ? React.createElement("pre", { "data-network-result": true }, JSON.stringify(testResult)) : null,
    React.createElement(ActionMessage, { message }),
  );
}

function AuthPanel({ settings, store }) {
  const auth = settings.auth || {};
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const explainError = (error) => ({
    CODEX_AUTH_CACHE_UNAVAILABLE: "未找到本机 Codex 登录缓存，请先在 Codex 中完成登录。",
    CODEX_AUTH_CACHE_INVALID: "本机 Codex 登录缓存格式无效，请重新登录 Codex 后再试。",
    CODEX_AUTH_TOKEN_MISSING: "登录缓存中没有可用凭据，请重新登录 Codex 后再试。",
    CODEX_AUTH_UNAVAILABLE: "当前 DSH credentials 服务不可用。",
  }[error?.code] || error?.message || "Codex 接入失败");
  const connect = async () => {
    setBusy(true); setMessage("");
    try { await store.actions.connectCodex(); setMessage("Codex 凭据已接入；下一次模型请求将直接使用。无需重启。"); }
    catch (error) { setMessage(explainError(error)); }
    finally { setBusy(false); }
  };
  const test = async () => {
    setBusy(true); setMessage("");
    try {
      const result = await store.actions.testAuth();
      setMessage(result?.ok ? "本地凭据已就绪；远端有效性将在下一次模型请求时确认。" : "尚未找到可用的 Codex 凭据。");
    } catch (error) { setMessage(explainError(error)); }
    finally { setBusy(false); }
  };
  const configured = auth.configured === true;
  return React.createElement("div", { className: "cpwb-settings-panel" },
    React.createElement("span", { className: "cpwb-eyebrow" }, "CODEX LINK / LOCAL AUTH BRIDGE"),
    React.createElement("h2", null, "Codex 快速接入"),
    React.createElement("div", { className: `cpwb-auth-state ${configured ? "cpwb-auth-online" : "cpwb-auth-offline"}` },
      React.createElement("span", { className: "cpwb-auth-icon" }, configured
        ? React.createElement(ShieldCheck, { size: 25, weight: "duotone", "aria-hidden": true })
        : React.createElement(Key, { size: 25, weight: "duotone", "aria-hidden": true })),
      React.createElement("div", null,
        React.createElement("strong", null, configured ? "CODEX LINK / ONLINE" : "CODEX LINK / NOT CONNECTED"),
        React.createElement("p", null, configured ? `凭据来源：${auth.source || "DSH credentials"}` : "扫描本机 Codex 登录缓存，并安全接入当前 Workbench。"))),
    React.createElement("div", { className: "cpwb-auth-privacy" },
      React.createElement(WarningCircle, { size: 17, weight: "regular", "aria-hidden": true }),
      React.createElement("p", null, "扫描只在点击后发生。令牌不会发送到浏览器、写入 Workbench 数据库或显示在日志中。")),
    configured
      ? React.createElement("div", { className: "cpwb-settings-actions" },
          React.createElement("button", { type: "button", onClick: test, disabled: busy }, busy ? "验证中…" : "验证本地凭据"),
          React.createElement("span", { className: "cpwb-auth-activation" }, "NEXT REQUEST / ACTIVE"))
      : React.createElement("button", { type: "button", className: "cpwb-auth-connect", onClick: connect, disabled: busy || auth.canConnect === false },
          busy ? React.createElement(React.Fragment, null, React.createElement(SpinnerGap, { size: 18, className: "cpwb-spin", "aria-hidden": true }), "正在接入…")
            : React.createElement(React.Fragment, null, React.createElement(Plug, { size: 18, weight: "bold", "aria-hidden": true }), "扫描并接入 Codex")),
    auth.readOnly ? React.createElement("p", null, "该凭据由启动环境提供，只读且优先于本地凭据库。") : null,
    auth.canConnect === false && !configured ? React.createElement("p", { className: "cpwb-auth-unavailable" }, "当前 DSH credentials 服务不可用，无法执行自动接入。") : null,
    React.createElement(ActionMessage, { message }),
  );
}

function WorkbenchPanel({ section, settings, store }) {
  if (section === "timezone") return React.createElement(TimezonePanel, { settings, store });
  if (section === "embedding") return React.createElement(EmbeddingPanel, { settings, store });
  if (section === "network") return React.createElement(NetworkPanel, { settings, store });
  if (section === "auth") return React.createElement(AuthPanel, { settings, store });
  return React.createElement("div", { className: "cpwb-settings-panel" },
    React.createElement("span", { className: "cpwb-eyebrow" }, "HARNESS WORKBENCH"),
    React.createElement("h2", null, "Workbench 设置"),
    React.createElement("p", null, "这里是 Workbench 自有设置。模型、插件与 DSH credentials 继续由原生 DSH 设置页面管理。"),
  );
}

/** A settings.section contribution rendered by rc.2's native SettingsRoot. */
export function WorkbenchSettingsSection({ store, initialActive = "workbench" }) {
  const [active, setActive] = React.useState(initialActive);
  const subscribe = store?.subscribe || (() => () => {});
  const getSnapshot = store?.getSnapshot || (() => ({}));
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot) || {};
  const settings = snapshot.settings || {};
  React.useEffect(() => {
    if (typeof store?.actions?.loadSettings === "function") store.actions.loadSettings().catch(() => {});
  }, [store]);
  return React.createElement("section", { className: "cpwb-native-settings-section", "aria-label": "Harness Workbench 设置" },
    React.createElement("header", { className: "cpwb-native-settings-header" },
      React.createElement("div", null,
        React.createElement("span", { className: "cpwb-eyebrow" }, "HARNESS WORKBENCH / SYSTEM CONFIG"),
        React.createElement("h2", null, "Workbench 设置"),
        React.createElement("p", null, "项目工作台扩展设置；模型、插件和 Agent 预设继续由左侧原生分类管理。"))),
    React.createElement("nav", { className: "cpwb-settings-nav", "aria-label": "Workbench 设置分类" },
      ...WORKBENCH_SECTIONS.map(([id, label]) => React.createElement("button", { key: id, type: "button", className: active === id ? "cpwb-active" : "", onClick: () => setActive(id) }, label))),
    React.createElement("main", { className: "cpwb-settings-content" }, React.createElement(WorkbenchPanel, { section: active, settings, store })),
  );
}
