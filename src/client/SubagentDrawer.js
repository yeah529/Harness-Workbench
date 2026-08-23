import React from "react";
import {
  ArrowClockwise,
  CaretDown,
  Info,
  PaperPlaneTilt,
  Robot,
  Stop,
  X,
} from "@phosphor-icons/react";
import {
  createSubagentClient,
  healthySubagentEntries,
  subagentHistoryToTranscript,
} from "./subagents.js";

function emptySessionsSnapshot() {
  return { subagentsByParent: {} };
}
function useSessionsSnapshot(sessions) {
  const source = sessions?.list;
  return React.useSyncExternalStore(
    source?.subscribe || (() => () => {}),
    source?.getSnapshot || emptySessionsSnapshot,
    source?.getSnapshot || emptySessionsSnapshot,
  );
}

function Selector({ entries, selectedId, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const selected = entries.find((entry) => entry.id === selectedId) || entries[0];
  return React.createElement("div", { className: "cpwb-subagent-selector" },
    React.createElement("button", {
      type: "button",
      className: "cpwb-subagent-selector-trigger",
      "aria-haspopup": "listbox",
      "aria-expanded": open,
      onClick: () => setOpen((value) => !value),
    },
    React.createElement("span", null,
      React.createElement("strong", null, selected?.label || selected?.id || "选择子智能体"),
      selected ? React.createElement("small", null, selected.activity === "running" ? "RUNNING" : "INACTIVE") : null),
    React.createElement(CaretDown, { size: 16, weight: "bold", "aria-hidden": true })),
    open ? React.createElement("div", { className: "cpwb-subagent-selector-menu", role: "listbox", "aria-label": "选择子智能体" },
      entries.map((entry, index) => React.createElement("button", {
        type: "button",
        role: "option",
        key: entry.id,
        "aria-selected": entry.id === selected?.id,
        className: entry.id === selected?.id ? "cpwb-selected" : "",
        onClick() { onSelect(entry.id); setOpen(false); },
      },
      React.createElement("b", null, String(index + 1).padStart(2, "0")),
      React.createElement("span", null,
        React.createElement("strong", null, entry.label || entry.id),
        React.createElement("small", null, entry.activity.toUpperCase() + " / " + entry.mode.toUpperCase())),
      React.createElement("em", null, entry.mode === "one-shot" ? "ONE-SHOT" : "CONTINUABLE")))) : null);
}

function InfoLayer({ entry, parentSessionId, onClose }) {
  return React.createElement("section", { className: "cpwb-subagent-info-layer", "aria-label": "子智能体详情" },
    React.createElement("header", null,
      React.createElement("div", null, React.createElement("span", null, "SUBAGENT PROFILE"), React.createElement("h3", null, entry.label || entry.id)),
      React.createElement("button", { type: "button", onClick: onClose, "aria-label": "关闭子智能体详情" }, React.createElement(X, { size: 18 }))),
    React.createElement("div", { className: "cpwb-subagent-info-grid" },
      React.createElement("dl", null,
        React.createElement("div", null, React.createElement("dt", null, "SESSION ID"), React.createElement("dd", null, entry.id)),
        React.createElement("div", null, React.createElement("dt", null, "PARENT"), React.createElement("dd", null, parentSessionId)),
        React.createElement("div", null, React.createElement("dt", null, "MODE"), React.createElement("dd", null, entry.mode.toUpperCase())),
        React.createElement("div", null, React.createElement("dt", null, "ACTIVITY"), React.createElement("dd", null, entry.activity.toUpperCase())),
        React.createElement("div", null, React.createElement("dt", null, "DESCENDANTS"), React.createElement("dd", null, entry.hasChildren ? "AVAILABLE" : "NONE"))),
      React.createElement("p", null, entry.mode === "one-shot"
        ? "该子智能体是一次性执行记录。你可以审阅完整会话，但不能继续向其发送消息。"
        : "该子智能体支持多轮续聊。后续消息通过 rc.2 的 parent-addressed FIFO 通道发送。")));
}

export function SubagentDrawer({
  open,
  parentSessionId,
  connection,
  sessions,
  initialCatalog = null,
  initialHistory = null,
  onClose,
}) {
  const sessionsSnapshot = useSessionsSnapshot(sessions);
  const liveCatalog = sessionsSnapshot?.subagentsByParent?.[parentSessionId];
  const [fallbackCatalog, setFallbackCatalog] = React.useState(initialCatalog || { entries: [], parentAvailable: false });
  const catalog = liveCatalog?.entries ? liveCatalog : fallbackCatalog;
  const entries = healthySubagentEntries(catalog);
  const [selectedId, setSelectedId] = React.useState(entries[0]?.id || null);
  const selected = entries.find((entry) => entry.id === selectedId) || entries[0] || null;
  const [history, setHistory] = React.useState(Array.isArray(initialHistory) ? initialHistory : []);
  const [historyState, setHistoryState] = React.useState(initialHistory ? "ready" : "idle");
  const [error, setError] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const client = React.useMemo(() => createSubagentClient(connection), [connection]);

  React.useEffect(function () {
    if (!open || !parentSessionId) return undefined;
    sessions?.setSubagentCatalogOpen?.(parentSessionId, true);
    let stopped = false;
    const refresh = async function () {
      try {
        if (typeof sessions?.refreshSubagents === "function") await sessions.refreshSubagents(parentSessionId);
        else if (!stopped) setFallbackCatalog(await client.list(parentSessionId));
      } catch (cause) {
        if (!stopped) setError(cause);
      }
    };
    void refresh();
    return function () {
      stopped = true;
      sessions?.setSubagentCatalogOpen?.(parentSessionId, false);
    };
  }, [client, open, parentSessionId, sessions]);

  React.useEffect(function () {
    if (selected && entries.some((entry) => entry.id === selectedId)) return;
    setSelectedId(entries[0]?.id || null);
  }, [entries, selected, selectedId]);

  const loadHistory = React.useCallback(async function (signal) {
    if (!selected || !parentSessionId) return;
    setHistoryState((value) => value === "ready" ? "refreshing" : "loading");
    try {
      const result = await client.history({ parentSessionId, childSessionId: selected.id, mode: selected.mode }, { signal, maxMessages: 80 });
      if (signal?.aborted) return;
      setHistory(subagentHistoryToTranscript(result.events));
      setHistoryState("ready");
      setError(null);
    } catch (cause) {
      if (signal?.aborted) return;
      setError(cause);
      setHistoryState("error");
    }
  }, [client, parentSessionId, selected]);

  React.useEffect(function () {
    if (!open || !selected || initialHistory) return undefined;
    const controller = new AbortController();
    let timer = null;
    let stopped = false;
    const poll = async function () {
      await loadHistory(controller.signal);
      if (!stopped && selected.activity === "running") timer = setTimeout(poll, 2200);
    };
    void poll();
    return function () {
      stopped = true;
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [initialHistory, loadHistory, open, selected]);

  React.useEffect(function () {
    if (!open || typeof window === "undefined") return undefined;
    const onKeyDown = function (event) { if (event.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKeyDown);
    return function () { window.removeEventListener("keydown", onKeyDown); };
  }, [onClose, open]);

  if (!open) return null;

  const refreshNow = function () {
    if (initialHistory) return;
    const controller = new AbortController();
    void loadHistory(controller.signal);
  };
  const sendFollowup = async function (event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selected || selected.mode !== "continuable") return;
    setSending(true);
    setError(null);
    try {
      await client.prompt({ parentSessionId, childSessionId: selected.id, mode: "continuable" }, text, {
        clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setDraft("");
      await sessions?.refreshSubagents?.(parentSessionId);
      await loadHistory();
    } catch (cause) {
      setError(cause);
    } finally {
      setSending(false);
    }
  };
  const interrupt = async function () {
    if (!selected || selected.mode !== "continuable") return;
    try {
      await client.interrupt({ parentSessionId, childSessionId: selected.id, mode: "continuable" });
      await sessions?.refreshSubagents?.(parentSessionId);
    } catch (cause) {
      setError(cause);
    }
  };

  return React.createElement("div", { className: "cpwb-subagent-backdrop", onMouseDown(event) { if (event.target === event.currentTarget) onClose?.(); } },
    React.createElement("aside", { className: "cpwb-subagent-drawer", role: "dialog", "aria-modal": "true", "aria-label": "子智能体活动" },
      React.createElement("header", { className: "cpwb-subagent-drawer-header" },
        React.createElement("div", { className: "cpwb-subagent-heading" },
          React.createElement(Robot, { size: 21, weight: "duotone", "aria-hidden": true }),
          React.createElement("div", null, React.createElement("span", null, "SUBAGENT ACTIVITY"), React.createElement("h2", null, "子智能体会话"))),
        React.createElement("div", { className: "cpwb-subagent-header-actions" },
          React.createElement("button", { type: "button", onClick: refreshNow, "aria-label": "刷新子智能体会话" }, React.createElement(ArrowClockwise, { size: 18, className: historyState === "refreshing" ? "cpwb-spin" : "" })),
          React.createElement("button", { type: "button", onClick: () => setShowInfo(true), disabled: !selected, "aria-label": "查看子智能体详情" }, React.createElement(Info, { size: 19 })),
          React.createElement("button", { type: "button", onClick: onClose, "aria-label": "关闭子智能体抽屉" }, React.createElement(X, { size: 19 })))),
      entries.length > 0 ? React.createElement(Selector, { entries, selectedId: selected?.id, onSelect(id) { setSelectedId(id); setHistory([]); setHistoryState("idle"); setError(null); } }) : null,
      selected ? React.createElement("div", { className: "cpwb-subagent-statusbar" },
        React.createElement("span", { className: selected.activity === "running" ? "cpwb-running" : "" }, selected.activity.toUpperCase()),
        React.createElement("b", null, selected.mode === "one-shot" ? "ONE-SHOT" : "CONTINUABLE"),
        React.createElement("small", null, "PARENT / " + parentSessionId)) : null,
      React.createElement("div", { className: "cpwb-subagent-transcript", "aria-live": "polite" },
        entries.length === 0
          ? React.createElement("div", { className: "cpwb-subagent-empty" }, React.createElement(Robot, { size: 28 }), React.createElement("strong", null, "暂无子智能体活动"), React.createElement("p", null, "当前会话启动子智能体后，会在这里显示运行状态和会话记录。"))
          : historyState === "loading" && history.length === 0
            ? React.createElement("div", { className: "cpwb-subagent-empty" }, React.createElement("strong", null, "正在读取会话记录…"))
            : history.length === 0
              ? React.createElement("div", { className: "cpwb-subagent-empty" }, React.createElement("strong", null, "尚无可见消息"), React.createElement("p", null, "子智能体可能仍在初始化，或当前记录只包含运行事件。"))
              : history.map((row) => React.createElement("article", { key: row.key, className: "cpwb-subagent-message cpwb-subagent-message-" + row.role },
                React.createElement("span", null, row.role === "user" ? "PARENT" : row.role === "assistant" ? "SUBAGENT" : "TOOL"),
                React.createElement("p", null, row.text)))),
      error ? React.createElement("p", { className: "cpwb-subagent-error", role: "alert" }, error.message || String(error)) : null,
      selected?.mode === "one-shot"
        ? React.createElement("footer", { className: "cpwb-subagent-readonly" }, "一次性任务仅支持查看记录")
        : selected ? React.createElement("form", { className: "cpwb-subagent-composer", onSubmit: sendFollowup },
          React.createElement("textarea", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "向子智能体发送消息", "aria-label": "向子智能体发送消息", rows: 2 }),
          React.createElement("div", null,
            selected.activity === "running" ? React.createElement("button", { type: "button", className: "cpwb-subagent-stop", onClick: interrupt }, React.createElement(Stop, { size: 15, weight: "fill" }), "停止当前轮次") : React.createElement("span", null, catalog.parentAvailable === false ? "父会话暂不可用" : "可继续对话"),
            React.createElement("button", { type: "submit", className: "cpwb-subagent-send", disabled: sending || !draft.trim() || catalog.parentAvailable === false }, React.createElement(PaperPlaneTilt, { size: 16, weight: "fill" }), sending ? "发送中" : "发送"))) : null,
      showInfo && selected ? React.createElement(InfoLayer, { entry: selected, parentSessionId, onClose: () => setShowInfo(false) }) : null));
}
