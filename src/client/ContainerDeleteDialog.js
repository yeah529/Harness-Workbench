import React from "react";
import { ArrowsOutLineHorizontal, Trash, Warning } from "@phosphor-icons/react";
import { GlobalModal } from "./globalModal.js";

const COPY = {
  project: {
    kicker: "PROJECT / DELETE",
    noun: "项目",
    relation: "关联知识库",
    cleanup: "待办、定时任务、每日总结和项目关系会删除；磁盘目录与 DSH workspace 不会删除。",
  },
  knowledge_base: {
    kicker: "KNOWLEDGE / DELETE",
    noun: "知识芯片",
    relation: "关联项目",
    cleanup: "知识芯片自有文档副本、解析块和向量会删除；外部原文件与本地 embedding 模型不会删除。",
  },
};

export function ContainerDeleteDialog({
  kind,
  target,
  store,
  initialPlan = null,
  initialPolicy = "detach",
  initialConfirmation = "",
  initialStep = "policy",
  initialRestartConfirmed = false,
  onClose,
  onDeleted,
}) {
  const copy = COPY[kind];
  const [plan, setPlan] = React.useState(initialPlan);
  const [policy, setPolicy] = React.useState(initialPolicy);
  const [confirmation, setConfirmation] = React.useState(initialConfirmation);
  const [step, setStep] = React.useState(initialStep);
  const [restartConfirmed, setRestartConfirmed] = React.useState(initialRestartConfirmed);
  const [error, setError] = React.useState(null);
  const nameInputRef = React.useRef(null);
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const actionType = policy === "delete"
    ? "startContainerPurge"
    : (kind === "project" ? "deleteProject" : "deleteKnowledgeBase");
  const deleting = state.action?.type === actionType && state.action.status === "running";

  React.useEffect(function () {
    if (initialPlan) return;
    let current = true;
    const load = kind === "project"
      ? store.actions.loadProjectDeletionPlan(target.id)
      : store.actions.loadKnowledgeBaseDeletionPlan(target.id);
    load.then((value) => { if (current) setPlan(value); }).catch((cause) => { if (current) setError(cause); });
    return function () { current = false; };
  }, [initialPlan, kind, store, target.id]);

  const permanentDeletion = plan?.permanentDeletion ?? {
    available: plan?.permanentDeletionAvailable === true,
    requiresRestart: true,
    backend: null,
    reason: plan?.permanentDeletionAvailable === false ? "永久删除需要 dsh-workbench 监管启动模式" : null,
  };
  const deleteUnavailable = policy === "delete" && permanentDeletion.available !== true;
  const nameConfirmed = policy !== "delete" || confirmation === target.name;
  const canContinue = !!plan && !deleting && !deleteUnavailable && nameConfirmed && !!plan.planVersion;
  const canSubmit = policy === "detach"
    ? !!plan && !deleting
    : canContinue && restartConfirmed;

  const submit = async function () {
    if (!canSubmit) return;
    setError(null);
    try {
      if (policy === "delete") {
        await store.actions.startContainerPurge({
          kind,
          id: target.id,
          planVersion: plan.planVersion,
          confirmation,
          restartConfirmed: true,
        });
        onClose();
        return;
      }
      const operation = kind === "project"
        ? store.actions.deleteProject({ id: target.id, sessionPolicy: "detach" })
        : store.actions.deleteKnowledgeBase({ id: target.id, sessionPolicy: "detach" });
      await operation;
      onDeleted?.();
      onClose();
    } catch (cause) {
      setError(cause);
    }
  };

  const returnToPolicy = function () {
    setStep("policy");
    setRestartConfirmed(false);
    if (typeof window !== "undefined") {
      window.setTimeout(() => nameInputRef.current?.focus?.(), 0);
    }
  };
  const primaryAction = step === "policy" && policy === "delete"
    ? React.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: !canContinue, onClick: () => setStep("restart") }, "继续确认")
    : React.createElement("button", { type: "button", className: policy === "delete" ? "cpwb-btn cpwb-btn-danger" : "cpwb-btn cpwb-btn-primary", disabled: !canSubmit, onClick: submit }, deleting ? "处理中…" : (policy === "delete" ? "永久删除并重启" : "删除并保留会话"));

  return React.createElement(GlobalModal, { onClose: deleting ? undefined : onClose, labelledBy: "cpwb-container-delete-title" },
    React.createElement("section", { className: "cpwb-modal cpwb-container-delete-modal" },
      React.createElement("div", { className: "cpwb-modal-kicker" }, copy.kicker),
      React.createElement("h3", { id: "cpwb-container-delete-title" }, step === "restart" ? "确认重启并永久删除" : "删除" + copy.noun + "「" + target.name + "」"),
      plan
        ? React.createElement("div", { className: "cpwb-delete-impact", "aria-label": "删除影响范围" },
            React.createElement("span", null, React.createElement("b", null, plan.sessionCount), " 个会话"),
            React.createElement("span", null, React.createElement("b", null, plan.relationshipCount), " 个" + copy.relation),
            React.createElement("span", null, React.createElement("b", null, plan.documentCount), " 个文档"),
            React.createElement("span", null, React.createElement("b", null, plan.orphanDocumentCount), " 个独占索引"))
        : React.createElement("div", { className: "cpwb-delete-loading", role: "status" }, "正在核对会话、关系与索引…"),
      step === "policy"
        ? React.createElement(React.Fragment, null,
            React.createElement("div", { className: "cpwb-delete-policy", role: "radiogroup", "aria-label": "会话处理方式" },
              React.createElement("label", { className: policy === "detach" ? "cpwb-selected" : "" },
                React.createElement("input", { type: "radio", name: "session-policy", value: "detach", checked: policy === "detach", onChange: () => setPolicy("detach") }),
                React.createElement(ArrowsOutLineHorizontal, { size: 20, "aria-hidden": true }),
                React.createElement("span", null, React.createElement("strong", null, "保留会话并移为独立会话", React.createElement("em", null, "推荐")), React.createElement("small", null, "移除容器继承的上下文，仍然有效的手动固定来源会保留。"))),
              React.createElement("label", { className: policy === "delete" ? "cpwb-selected cpwb-danger-choice" : "cpwb-danger-choice" },
                React.createElement("input", { type: "radio", name: "session-policy", value: "delete", checked: policy === "delete", onChange: () => setPolicy("delete") }),
                React.createElement(Trash, { size: 20, "aria-hidden": true }),
                React.createElement("span", null, React.createElement("strong", null, "永久删除所属会话"), React.createElement("small", null, "同时删除 Workbench 投影、上下文记录、消息索引和 DSH 原生会话。")))),
            policy === "delete"
              ? React.createElement("div", { className: "cpwb-delete-confirm-zone" },
                  deleteUnavailable ? React.createElement("div", { className: "cpwb-form-error", role: "alert" }, React.createElement(Warning, { size: 15 }), " ", permanentDeletion.reason || "当前存储后端无法安全执行永久删除。") : null,
                  React.createElement("label", null, "输入完整名称确认永久删除", React.createElement("input", { ref: nameInputRef, value: confirmation, onChange: (event) => setConfirmation(event.target.value), placeholder: target.name, autoComplete: "off" })))
              : null,
            React.createElement("div", { className: "cpwb-danger-confirm" }, React.createElement("span", null, copy.cleanup)))
        : React.createElement("div", { className: "cpwb-restart-confirmation" },
            React.createElement("div", { className: "cpwb-restart-target" },
              React.createElement("span", null, "TARGET / FROZEN PLAN"),
              React.createElement("strong", null, target.name),
              React.createElement("small", null, (plan?.sessionCount || 0) + " 个主会话 · " + (plan?.descendantSessionCount || 0) + " 个 Subagent 后代")),
            React.createElement("div", { className: "cpwb-restart-notice" },
              React.createElement(Warning, { size: 22, "aria-hidden": true }),
              React.createElement("span", null,
                React.createElement("strong", null, "Workbench 将自动停止并重启"),
                React.createElement("small", null, "页面会短暂断开，通常需要 3 至 10 秒，实际时间取决于本地数据量和启动速度。服务恢复后页面会自动重新连接，不需要手工刷新。"))),
            React.createElement("ul", { className: "cpwb-restart-guarantees" },
              React.createElement("li", null, "删除失败时会自动恢复事务备份并重新启动。"),
              React.createElement("li", null, "如果自动恢复仍未启动，下次运行同一条 dsh-workbench 命令会优先完成恢复。"),
              React.createElement("li", null, "项目目录、知识芯片外部原文件和本地模型不会删除。")),
            React.createElement("label", { className: "cpwb-restart-checkbox" },
              React.createElement("input", { type: "checkbox", checked: restartConfirmed, onChange: (event) => setRestartConfirmed(event.target.checked) }),
              React.createElement("span", null, "我已了解 Workbench 将自动重启"))),
      error ? React.createElement("div", { className: "cpwb-form-error", role: "alert" }, error.message || String(error)) : null,
      React.createElement("div", { className: "cpwb-modal-actions" },
        React.createElement("button", { type: "button", className: "cpwb-btn", disabled: deleting, onClick: step === "restart" ? returnToPolicy : onClose }, step === "restart" ? "返回修改" : "取消"),
        primaryAction)));
}
