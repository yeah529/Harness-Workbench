import React from "react";
import { Check, Copy, Warning } from "@phosphor-icons/react";

export const MAINTENANCE_STORAGE_KEY = "cpwb-maintenance-job";

const TERMINAL_STATES = new Set(["completed", "restored", "rollback_pending"]);
const NORMAL_PHASE = new Map([
  ["queued", 0],
  ["stopping", 0],
  ["quarantining", 1],
  ["native_refs_updated", 2],
  ["restarting", 3],
  ["workbench_finalizing", 3],
  ["verifying", 3],
  ["completed", 4],
]);

const STEPS = [
  ["关闭 DSH 服务", "FLUSH & RELEASE SESSION HANDLES"],
  ["隔离会话数据", "QUARANTINE FROZEN SESSION ARTIFACTS"],
  ["清理关系与索引", "WORKSPACE / CACHE / VECTOR INDEX"],
  ["重启并验证", "BOOT / HEALTH / SESSION LIST"],
];

function screenCopy(job) {
  if (job.state === "rollback_pending") {
    return {
      view: "manual",
      eyebrow: "RECOVERY REQUIRED / LOCAL",
      first: "服务恢复",
      accent: "需要协助",
      lead: "自动删除已经停止，隔离数据未被销毁。启动器会在下次运行时优先恢复事务，不会继续执行永久删除。",
      connection: "SERVICE OFFLINE",
      stage: "!",
      coreTitle: "LOCAL RECOVERY COMMAND REQUIRED",
      coreMeta: "保留当前页面，服务上线后会自动重新连接",
    };
  }
  if (job.state === "restoring" || job.state === "restored") {
    return {
      view: "rollback",
      eyebrow: "ROLLBACK PROTOCOL / SAFE",
      first: "删除未完成",
      accent: job.state === "restored" ? "数据已恢复" : "正在恢复",
      lead: job.state === "restored"
        ? "新服务未通过就绪校验。隔离会话、Workspace 关系与 Workbench 索引已经恢复，原容器保持不变。"
        : "系统正在恢复删除前的会话、Workspace 关系与 Workbench 索引，恢复完成前不会启动新的删除任务。",
      connection: job.state === "restored" ? "DATA RESTORED" : "RESTORING SERVICE",
      stage: "R",
      coreTitle: job.state === "restored" ? "ROLLBACK VERIFIED" : "ROLLBACK IN PROGRESS",
      coreMeta: job.state === "restored" ? "备份校验完成，原数据保持可用" : "正在恢复本地事务快照",
    };
  }
  if (job.state === "completed") {
    return {
      view: "complete",
      eyebrow: "SAFE PURGE / VERIFIED",
      first: "清除完成",
      accent: "系统一致",
      lead: "目标会话、原生引用、Workbench 关系与索引已经一致清理，新一代 Workbench 已通过就绪校验。",
      connection: "CORE ONLINE",
      stage: "OK",
      coreTitle: "TRANSACTION COMMITTED",
      coreMeta: "安全备份已提交，工作台可以继续使用",
    };
  }
  const stateCopy = {
    queued: ["等待维护", "监管接管", "删除任务已冻结，正在等待启动器安全停止当前 DSH 服务。"],
    stopping: ["正在关闭", "DSH 服务", "Workbench 正在释放会话句柄并安全停止当前 DSH 服务。"],
    quarantining: ["正在隔离", "会话数据", "目标会话正在移入事务隔离区，非目标会话与项目目录不会被修改。"],
    native_refs_updated: ["正在清理", "关系索引", "原生 Workspace 引用已更新，正在准备新一代 Workbench 完成索引清理。"],
    restarting: ["正在重启", "智能核心", "目标会话已安全隔离。Workbench 正在重新接入 DSH，并验证会话、索引和项目关系。"],
    workbench_finalizing: ["正在同步", "工作台索引", "新一代 Workbench 已启动，正在清理冻结计划中的业务关系与向量索引。"],
    verifying: ["正在验证", "系统一致性", "系统正在核对原生会话、Workspace 引用和 Workbench 投影是否全部一致。"],
    reconnecting: ["正在重连", "智能核心", "浏览器正在重新连接 Workbench，当前画面保留最后一次服务器确认的事务阶段。"],
  }[job.state] ?? ["系统维护", "智能核心", "Workbench 正在处理本地安全维护任务。"];
  return {
    view: "restart",
    eyebrow: "SYSTEM MAINTENANCE / LOCAL",
    first: stateCopy[0],
    accent: stateCopy[1],
    lead: stateCopy[2],
    connection: job.disconnected ? "RECONNECTING" : "TRANSACTION ACTIVE",
    stage: String((NORMAL_PHASE.get(job.state) ?? 0) + 1).padStart(2, "0"),
    coreTitle: job.disconnected ? "SERVICE HANDSHAKE IN PROGRESS" : "SAFE PURGE PROTOCOL ACTIVE",
    coreMeta: job.disconnected ? "页面保持在线，服务恢复后会自动继续" : "本地事务锁已启用，请勿关闭启动终端",
  };
}

function stepState(job, index) {
  if (job.state === "rollback_pending") return index < 2 ? "done" : "failed";
  if (job.state === "restoring") return index < 2 ? "done" : index === 2 ? "failed" : "active";
  if (job.state === "restored") return index < 2 || index === 3 ? "done" : "failed";
  const phase = NORMAL_PHASE.get(job.state) ?? 0;
  if (phase >= 4 || index < phase) return "done";
  if (index === phase) return "active";
  return "waiting";
}

function stepLabel(state) {
  if (state === "done") return "DONE";
  if (state === "active") return "ACTIVE";
  if (state === "failed") return "FAILED";
  return "WAIT";
}

function writeStoredJob(job) {
  if (typeof window === "undefined" || !window.sessionStorage || !job?.jobId) return;
  try {
    window.sessionStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify({
      jobId: job.jobId,
      recoveryCommand: job.recoveryCommand || "dsh-workbench web",
    }));
  } catch {}
}

function clearStoredJob() {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try { window.sessionStorage.removeItem(MAINTENANCE_STORAGE_KEY); } catch {}
}

export function readStoredMaintenanceJob() {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(MAINTENANCE_STORAGE_KEY));
    return typeof value?.jobId === "string" ? value : null;
  } catch {
    return null;
  }
}

export function MaintenanceScreen({ store, job, onFinished }) {
  const [copied, setCopied] = React.useState(false);
  const copy = screenCopy(job);
  const manual = job.state === "rollback_pending";
  const terminal = TERMINAL_STATES.has(job.state);
  const command = job.recoveryCommand || "dsh-workbench web";
  const targetName = job.container?.name || "本地容器";

  React.useEffect(() => { writeStoredJob(job); }, [job?.jobId, command]);

  React.useEffect(function () {
    if (!job?.jobId || terminal || typeof window === "undefined") return undefined;
    let cancelled = false;
    let timer = null;
    const poll = async function () {
      await store.actions.refreshPurgeJob(job.jobId);
      if (!cancelled) {
        const disconnected = store.getSnapshot().maintenanceJob?.disconnected === true;
        timer = window.setTimeout(poll, disconnected ? 1500 : 500);
      }
    };
    timer = window.setTimeout(poll, 250);
    return function () {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [job?.jobId, job?.state, store, terminal]);

  const copyRecoveryCommand = async function () {
    try {
      await globalThis.navigator?.clipboard?.writeText?.(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const finish = async function () {
    await store.actions.clearPurgeJob();
    clearStoredJob();
    onFinished?.(job);
  };

  return React.createElement("main", {
    className: `cpwb-maintenance-screen cpwb-maintenance-${copy.view}`,
    role: manual || job.state === "restored" ? "alert" : "status",
    "aria-live": manual ? "assertive" : "polite",
  },
    React.createElement("header", { className: "cpwb-maintenance-topbar" },
      React.createElement("div", { className: "cpwb-maintenance-brand" },
        React.createElement("span", { className: "cpwb-maintenance-brand-mark", "aria-hidden": true }),
        React.createElement("span", null, React.createElement("strong", null, "HARNESS"), React.createElement("small", null, "WORKBENCH"))),
      React.createElement("div", { className: "cpwb-maintenance-protocol" }, "SAFE PURGE PROTOCOL / LOCAL NODE"),
      React.createElement("div", { className: "cpwb-maintenance-connection" },
        React.createElement("i", { "aria-hidden": true }),
        React.createElement("span", null, copy.connection))),
    React.createElement("section", { className: "cpwb-maintenance-stage" },
      React.createElement("article", { className: "cpwb-maintenance-card" },
        React.createElement("div", { className: "cpwb-maintenance-main" },
          React.createElement("div", { className: "cpwb-maintenance-cyber-field", "aria-hidden": true },
            React.createElement("div", { className: "cpwb-maintenance-code" }, "// 2077"),
            React.createElement("div", { className: "cpwb-maintenance-radar" }, React.createElement("i")),
            React.createElement("div", { className: "cpwb-maintenance-datum" },
              React.createElement("span", null, "NODE GRID"), React.createElement("b", null, "31.2304 N"),
              React.createElement("span", null, "RESTART VECTOR"), React.createElement("b", null, terminal ? "STABLE" : "ACTIVE"),
              React.createElement("span", null, "SAFE ZONE"), React.createElement("b", null, "LOCAL")),
            React.createElement("div", { className: "cpwb-maintenance-scan" }),
            React.createElement("div", { className: "cpwb-maintenance-skyline" },
              Array.from({ length: 12 }, (_, index) => React.createElement("span", { key: index })))),
          React.createElement("div", { className: "cpwb-maintenance-eyebrow" }, copy.eyebrow),
          React.createElement("h1", null, copy.first, React.createElement("span", null, copy.accent)),
          React.createElement("p", { className: "cpwb-maintenance-lead" }, copy.lead),
          manual
            ? React.createElement("div", { className: "cpwb-maintenance-recovery" },
                React.createElement("strong", null, React.createElement(Warning, { size: 18, "aria-hidden": true }), " 自动恢复未能重新启动服务"),
                React.createElement("p", null, "数据已恢复并保留在安全备份中。请在 Terminal 运行以下命令，启动器会先完成回滚检查，再恢复 Workbench。"),
                React.createElement("div", { className: "cpwb-maintenance-command" },
                  React.createElement("code", null, command),
                  React.createElement("button", { type: "button", onClick: copyRecoveryCommand, "aria-label": "复制恢复命令" },
                    React.createElement(Copy, { size: 16, "aria-hidden": true }), copied ? "已复制" : "复制命令")))
            : React.createElement("div", { className: "cpwb-maintenance-core" },
                React.createElement("div", { className: "cpwb-maintenance-core-visual", "aria-hidden": true }, React.createElement("b")),
                React.createElement("div", { className: "cpwb-maintenance-signal", "aria-hidden": true }),
                React.createElement("div", { className: "cpwb-maintenance-core-copy" }, React.createElement("strong", null, copy.coreTitle), React.createElement("span", null, copy.coreMeta)))),
        React.createElement("aside", { className: "cpwb-maintenance-side" },
          React.createElement("div", { className: "cpwb-maintenance-side-head" },
            React.createElement("span", null, "TRANSACTION", React.createElement("br"), job.jobId),
            React.createElement("b", null, copy.stage)),
          React.createElement("ol", { className: "cpwb-maintenance-steps" },
            STEPS.map(function ([title, detail], index) {
              const state = stepState(job, index);
              return React.createElement("li", { key: title, className: `cpwb-maintenance-step cpwb-${state}` },
                React.createElement("span", { className: "cpwb-maintenance-step-index" }, String(index + 1).padStart(2, "0")),
                React.createElement("span", { className: "cpwb-maintenance-step-copy" }, React.createElement("strong", null, title), React.createElement("small", null, detail)),
                React.createElement("span", { className: "cpwb-maintenance-step-state" }, state === "done" ? React.createElement(Check, { size: 12, "aria-hidden": true }) : null, stepLabel(state)));
            })),
          React.createElement("div", { className: "cpwb-maintenance-reconnect" },
            React.createElement("strong", null, job.disconnected ? "正在重新连接 Workbench" : terminal ? "Workbench 服务已响应" : "Workbench 事务连接正常"),
            React.createElement("p", null, job.disconnected
              ? "服务恢复后页面会自动继续，无需刷新。若启动失败，系统会自动恢复删除前的数据。"
              : terminal ? "任务已经到达可确认状态。" : "页面只显示服务器已确认的阶段，不使用模拟百分比。"),
            terminal && !manual
              ? React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: finish }, job.state === "completed" ? "返回工作台" : "查看已恢复数据")
              : null)))),
    React.createElement("footer", { className: "cpwb-maintenance-footer" },
      React.createElement("span", null, job.container?.kind === "knowledge_base" ? "KNOWLEDGE CHIP" : "PROJECT", ": ", React.createElement("strong", null, targetName)),
      React.createElement("span", null, "JOB ", React.createElement("strong", null, job.jobId)),
      React.createElement("span", null, "LOCAL BACKUP: ", React.createElement("strong", null, terminal ? "VERIFIED" : "ARMED"))));
}
