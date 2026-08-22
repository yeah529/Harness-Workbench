let rpcSequence = 0;

function request(payload) {
  rpcSequence += 1;
  const entropy = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Date.now().toString(36) + "-" + rpcSequence.toString(36);
  return { rpcId: "cpwb-" + entropy, payload };
}
function valueOf(response) {
  const result = response?.result;
  if (result?.ok === true) return result.value;
  const error = new Error(result?.error?.message || "DSH Subagent 请求失败");
  error.code = result?.error?.code || "SUBAGENT_REQUEST_FAILED";
  error.details = result?.error?.details || {};
  throw error;
}

export function healthySubagentEntries(catalog) {
  return (Array.isArray(catalog?.entries) ? catalog.entries : []).filter((entry) => entry?.kind === "child");
}

function textBlocks(content) {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .filter((block) => block && (block.type === "text" || block.kind === "text"))
    .map((block) => String(block.text || "").trim())
    .filter(Boolean)
    .join("\n");
}

export function subagentHistoryToTranscript(entries) {
  const rows = [];
  for (const item of Array.isArray(entries) ? entries : []) {
    const event = item?.event || item;
    const seq = event?.seq ?? rows.length;
    if (event?.type === "user/message") {
      const text = textBlocks(event.data?.content);
      if (text) rows.push({ key: "user-" + seq, role: "user", text, seq });
    } else if (event?.type === "assistant/message") {
      const text = textBlocks(event.data?.message?.content);
      if (text) rows.push({ key: "assistant-" + seq, role: "assistant", text, seq });
    } else if (event?.type === "tool/call") {
      rows.push({ key: "tool-call-" + seq, role: "tool", text: "调用 " + (event.data?.name || "tool"), seq });
    } else if (event?.type === "tool/result") {
      const text = textBlocks(event.data?.message?.content) || (event.data?.error ? "工具执行失败" : "工具执行完成");
      rows.push({ key: "tool-result-" + seq, role: "tool", text, seq });
    }
  }
  return rows;
}

export function createSubagentClient(connection) {
  const api = connection?.api?.subagents;
  const requireApi = function (method) {
    if (typeof api?.[method] !== "function") {
      const error = new Error("当前 DSH 未提供 Subagent " + method + " 接口，请确认已升级到 0.1.1-rc.2");
      error.code = "SUBAGENT_API_UNAVAILABLE";
      throw error;
    }
    return api[method].bind(api);
  };
  return {
    async list(parentSessionId, options = {}) {
      return valueOf(await requireApi("list")(request({ parentSessionId }), options.signal));
    },
    async history(address, options = {}) {
      const payload = { ...address };
      if (options.beforeSeq != null) payload.beforeSeq = options.beforeSeq;
      payload.maxMessages = options.maxMessages ?? 50;
      return valueOf(await requireApi("history")(request(payload), options.signal));
    },
    async prompt(address, text, options = {}) {
      const payload = {
        ...address,
        content: [{ type: "text", text: String(text || "").trim() }],
      };
      if (options.clientTimeZone) payload.clientTimeZone = options.clientTimeZone;
      return valueOf(await requireApi("prompt")(request(payload), options.signal));
    },
    async interrupt(address) {
      return valueOf(await requireApi("interrupt")(request(address)));
    },
  };
}
