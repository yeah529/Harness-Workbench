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
    noun: "知识库",
    relation: "关联项目",
    cleanup: "知识库自有文档副本、解析块和向量会删除；外部原文件与本地 embedding 模型不会删除。",
  },
};

export function ContainerDeleteDialog({ kind, target, store, initialPlan = null, onClose, onDeleted }) {
  const copy = COPY[kind];
  const [plan, setPlan] = React.useState(initialPlan);
  const [policy, setPolicy] = React.useState("detach");
  const [confirmation, setConfirmation] = React.useState("");
  const [error, setError] = React.useState(null);
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const deleting = state.action?.type === (kind === "project" ? "deleteProject" : "deleteKnowledgeBase") && state.action.status === "running";

  React.useEffect(function () {
    if (initialPlan) return;
    let current = true;
    const load = kind === "project"
      ? store.actions.loadProjectDeletionPlan(target.id)
      : store.actions.loadKnowledgeBaseDeletionPlan(target.id);
    load.then((value) => { if (current) setPlan(value); }).catch((cause) => { if (current) setError(cause); });
    return function () { current = false; };
  }, [initialPlan, kind, store, target.id]);

  const nativeDeleteRequired = (plan?.sessionCount || 0) > 0;
  const deleteUnavailable = policy === "delete" && nativeDeleteRequired && plan?.permanentDeletionAvailable === false;
  const nameConfirmed = policy !== "delete" || confirmation === target.name;
  const canSubmit = !!plan && !deleting && !deleteUnavailable && nameConfirmed;

  const submit = function () {
    if (!canSubmit) return;
    setError(null);
    const operation = kind === "project"
      ? store.actions.deleteProject({ id: target.id, sessionPolicy: policy })
      : store.actions.deleteKnowledgeBase({ id: target.id, sessionPolicy: policy });
    operation.then(function () {
      onDeleted?.();
      onClose();
    }).catch(setError);
  };

  return React.createElement(GlobalModal, { onClose: deleting ? undefined : onClose, labelledBy: "cpwb-container-delete-title" },
    React.createElement("section", { className: "cpwb-modal cpwb-container-delete-modal" },
      React.createElement("div", { className: "cpwb-modal-kicker" }, copy.kicker),
      React.createElement("h3", { id: "cpwb-container-delete-title" }, "删除" + copy.noun + "「" + target.name + "」"),
      plan
        ? React.createElement("div", { className: "cpwb-delete-impact", "aria-label": "删除影响范围" },
            React.createElement("span", null, React.createElement("b", null, plan.sessionCount), " 个会话"),
            React.createElement("span", null, React.createElement("b", null, plan.relationshipCount), " 个" + copy.relation),
            React.createElement("span", null, React.createElement("b", null, plan.documentCount), " 个文档"),
            React.createElement("span", null, React.createElement("b", null, plan.orphanDocumentCount), " 个独占索引"))
        : React.createElement("div", { className: "cpwb-delete-loading", role: "status" }, "正在核对会话、关系与索引…"),
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
            deleteUnavailable ? React.createElement("div", { className: "cpwb-form-error", role: "alert" }, React.createElement(Warning, { size: 15 }), " 当前 DSH RC.2 未公开原生会话删除能力，无法安全执行永久删除。") : null,
            React.createElement("label", null, "输入完整名称确认永久删除", React.createElement("input", { value: confirmation, onChange: (event) => setConfirmation(event.target.value), placeholder: target.name, autoComplete: "off" })))
        : null,
      React.createElement("div", { className: "cpwb-danger-confirm" }, React.createElement("span", null, copy.cleanup)),
      error ? React.createElement("div", { className: "cpwb-form-error", role: "alert" }, error.message || String(error)) : null,
      React.createElement("div", { className: "cpwb-modal-actions" },
        React.createElement("button", { type: "button", className: "cpwb-btn", disabled: deleting, onClick: onClose }, "取消"),
        React.createElement("button", { type: "button", className: policy === "delete" ? "cpwb-btn cpwb-btn-danger" : "cpwb-btn cpwb-btn-primary", disabled: !canSubmit, onClick: submit }, deleting ? "处理中…" : (policy === "delete" ? "永久删除" : "删除并保留会话")))));
}
