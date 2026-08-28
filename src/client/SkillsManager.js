import React from "react";
import { Check, ClipboardText, Eye, FolderOpen, Package, Pause, Play, Trash, UploadSimple, WarningCircle, X } from "@phosphor-icons/react";
import { GlobalModal } from "./globalModal.js";
import { packSkillDirectory, SKILL_IMPORT_LIMITS } from "./skill-import.js";

const h = React.createElement;

function scopeLabel(scope) {
  return scope === "project" ? "项目 Skill" : "全局 Skill";
}

function errorMessage(error) {
  if (!error) return "";
  return error.message || String(error);
}

function actionMatches(action, type, name) {
  return action?.type === type && action?.name === name && action.status === "running";
}

function CopyPath({ path }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async function () {
    try {
      await globalThis.navigator?.clipboard?.writeText?.(path);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { setCopied(false); }
  };
  return h("button", { type: "button", className: "cpwb-skills-copy", onClick: copy, "aria-label": "复制安装路径", title: copied ? "已复制" : "复制安装路径" },
    copied ? h(Check, { size: 14, "aria-hidden": true }) : h(ClipboardText, { size: 14, "aria-hidden": true }), h("span", null, copied ? "已复制" : "复制路径"));
}

export function SkillConflictDialog({ existing, incoming, onCancel, onReplace, busy = false }) {
  if (!existing || !incoming) return null;
  return h(GlobalModal, { onClose: busy ? undefined : onCancel, labelledBy: "cpwb-skill-conflict-title" },
    h("section", { className: "cpwb-modal cpwb-skills-dialog" },
      h("div", { className: "cpwb-modal-kicker" }, "SKILL / IMPORT CONFLICT"),
      h("h3", { id: "cpwb-skill-conflict-title" }, "同名 Skill 已存在"),
      h("p", { className: "cpwb-skills-dialog-lead" }, "此作用域已有同名 Skill。确认后将用本次导入内容替换现有目录。"),
      h("div", { className: "cpwb-skills-conflict-grid" },
        h("div", null, h("span", null, "现有版本"), h("strong", null, existing.name), h("small", null, existing.description || "无描述"), h("small", null, `${existing.state === "disabled" ? "已停用" : "已启用"} · ${existing.files?.length || existing.fileCount || 0} 个文件`)),
        h("div", null, h("span", null, "待导入版本"), h("strong", null, incoming.name), h("small", null, incoming.description || "无描述"), h("small", null, `${incoming.files?.length || incoming.fileCount || 0} 个文件`))),
      h("div", { className: "cpwb-modal-actions" },
        h("button", { type: "button", className: "cpwb-btn", disabled: busy, onClick: onCancel }, "取消"),
        h("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", disabled: busy, onClick: onReplace }, busy ? "替换中" : "确认替换"))));
}

export function SkillDeleteDialog({ item, scope, onCancel, onConfirm, busy = false }) {
  if (!item) return null;
  return h(GlobalModal, { onClose: busy ? undefined : onCancel, labelledBy: "cpwb-skill-delete-title" },
    h("section", { className: "cpwb-modal cpwb-skills-dialog cpwb-skills-delete-dialog" },
      h("div", { className: "cpwb-modal-kicker" }, "SKILL / DELETE"),
      h("h3", { id: "cpwb-skill-delete-title" }, `删除 Skill「${item.name}」`),
      h("dl", { className: "cpwb-skills-delete-facts" },
        h("div", null, h("dt", null, "作用域"), h("dd", null, scopeLabel(scope))),
        h("div", null, h("dt", null, "状态"), h("dd", null, item.state === "disabled" ? "已停用" : "已启用")),
        h("div", null, h("dt", null, "安装路径"), h("dd", null, item.path))),
      h("p", { className: "cpwb-skills-dialog-lead" }, "删除后不会保留回收站或版本恢复。"),
      h("div", { className: "cpwb-modal-actions" },
        h("button", { type: "button", className: "cpwb-btn", disabled: busy, onClick: onCancel }, "取消"),
        h("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: busy, onClick: onConfirm }, busy ? "删除中" : "确认删除"))));
}

function StatusBadge({ item }) {
  const state = item.state === "disabled" ? "已停用" : "已启用";
  return h("span", { className: "cpwb-skill-status cpwb-skill-status-" + item.state }, item.health !== "valid" ? "无效" : state);
}

function SkillRow({ item, scope, store, onDelete }) {
  const state = store.getSnapshot();
  const action = state.skillAction;
  const busy = action?.status === "running" && action.key === `${scope === "project" ? "project:" + item.projectId : "global"}`;
  const stateBusy = actionMatches(action, "setSkillEnabled", item.name) || actionMatches(action, "deleteSkill", item.name) || actionMatches(action, "revealSkill", item.name);
  const disabled = item.health !== "valid";
  const run = (fn) => Promise.resolve(fn()).catch(() => {});
  return h("article", { className: "cpwb-skill-row" + (busy ? " cpwb-skill-row-busy" : ""), "data-skill-state": item.state, "data-skill-health": item.health, "aria-busy": busy ? "true" : undefined },
    h("div", { className: "cpwb-skill-identity" }, h("strong", null, item.name), h(StatusBadge, { item }), item.shadowsGlobal ? h("span", { className: "cpwb-skill-shadow" }, "覆盖全局版本") : null),
    h("div", { className: "cpwb-skill-summary" }, h("p", null, item.description || "无描述"), h("small", null, `${item.fileCount ?? item.files?.length ?? 0} 个文件 · ${item.path}`)),
    h("div", { className: "cpwb-skill-actions", "aria-label": item.name + "操作" },
      disabled ? null : h("button", { type: "button", className: "cpwb-icon-button", disabled: stateBusy, onClick: () => run(() => store.actions.setSkillEnabled({ scope, ...(scope === "project" ? { projectId: item.projectId } : {}), name: item.name, enabled: item.state === "disabled" })), "aria-label": item.state === "disabled" ? `启用 ${item.name}` : `停用 ${item.name}`, title: item.state === "disabled" ? "启用" : "停用" }, item.state === "disabled" ? h(Play, { size: 15, "aria-hidden": true }) : h(Pause, { size: 15, "aria-hidden": true })),
      h("button", { type: "button", className: "cpwb-icon-button", disabled: stateBusy, onClick: () => run(() => store.actions.revealSkill({ scope, ...(scope === "project" ? { projectId: item.projectId } : {}), name: item.name })), "aria-label": `在文件管理器中显示 ${item.name}`, title: "在文件管理器中显示" }, h(Eye, { size: 15, "aria-hidden": true })),
      h("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", disabled: stateBusy, onClick: () => onDelete(item), "aria-label": `删除 ${item.name}`, title: "删除" }, h(Trash, { size: 15, "aria-hidden": true }))));
}

export function SkillScopeManager({ store, scope = "global", projectId = null, compact = false }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const key = scope === "project" ? `project:${projectId}` : "global";
  const catalog = state.skillCatalogs?.[key] || { status: "loading", data: null, error: null };
  const [conflict, setConflict] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [selectedInput, setSelectedInput] = React.useState(null);
  const [localError, setLocalError] = React.useState(null);
  const directoryRef = React.useRef(null);
  const zipRef = React.useRef(null);
  React.useEffect(() => {
    if (typeof store.actions.loadSkills !== "function" || (scope === "project" && !(Number.isSafeInteger(projectId) && projectId > 0))) return undefined;
    store.actions.loadSkills({ scope, ...(scope === "project" ? { projectId } : {}) }).catch?.(() => {});
    return undefined;
  }, [store, scope, projectId]);

  const target = { scope, ...(scope === "project" ? { projectId } : {}) };
  const importArchive = async (archive, sourceName, input) => {
    if (!archive) return;
    setLocalError(null);
    if (archive.size > SKILL_IMPORT_LIMITS.archiveBytes) {
      setLocalError("ZIP 文件超过 50 MiB，未开始导入。");
      input.value = "";
      return;
    }
    setSelectedInput({ archive, sourceName, input });
    try {
      await store.actions.importSkill({ ...target, archive, sourceName });
      setSelectedInput(null);
      setConflict(null);
    } catch (error) {
      if (error?.code === "SKILL_CONFLICT") {
        setConflict({ existing: error.details?.existing, incoming: error.details?.incoming || { name: sourceName } });
      } else setLocalError(errorMessage(error) || "Skill 导入失败，请检查文件后重试。" );
    } finally {
      input.value = "";
    }
  };
  const chooseDirectory = async (event) => {
    const input = event.currentTarget;
    try {
      const packed = await packSkillDirectory(input.files);
      await importArchive(packed.archive, packed.sourceName, input);
    } catch (error) {
      setSelectedInput(null);
      input.value = "";
      setLocalError(errorMessage(error) || "目录打包失败，请检查 Skill 文件。" );
    }
  };
  const chooseZip = (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (file) void importArchive(file, file.name, input);
  };
  const replace = () => {
    if (!selectedInput) return;
    store.actions.importSkill({ ...target, archive: selectedInput.archive, sourceName: selectedInput.sourceName, replace: true })
      .then(() => { setConflict(null); setSelectedInput(null); })
      .catch(() => {});
  };
  const data = catalog.data;
  const items = Array.isArray(data?.items) ? data.items : [];
  const action = state.skillAction;
  const actionError = action?.key === key && action.status === "error" ? action.error : null;
  const rootUnavailable = (scope === "project" && !(Number.isSafeInteger(projectId) && projectId > 0)) || catalog.error?.code === "PROJECT_PATH_UNAVAILABLE" || catalog.error?.code === "SKILL_PERMISSION_DENIED";
  return h("section", { className: "cpwb-skills-scope-manager" + (compact ? " cpwb-skills-compact" : ""), "aria-label": scopeLabel(scope) },
    h("div", { className: "cpwb-skills-path" }, h(FolderOpen, { size: 16, "aria-hidden": true }), h("code", { title: data?.rootPath || "" }, data?.rootPath || "正在读取安装根路径"), data?.rootPath ? h(CopyPath, { path: data.rootPath }) : null),
    h("div", { className: "cpwb-skills-toolbar" },
      h("input", { ref: directoryRef, className: "cpwb-visually-hidden", type: "file", webkitdirectory: "", directory: "", multiple: true, onChange: chooseDirectory, tabIndex: -1, "aria-hidden": true }),
      h("input", { ref: zipRef, className: "cpwb-visually-hidden", type: "file", accept: ".zip,application/zip", onChange: chooseZip, tabIndex: -1, "aria-hidden": true }),
      h("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", onClick: () => directoryRef.current?.click?.() }, h(UploadSimple, { size: 15, "aria-hidden": true }), h("span", null, "导入目录")),
      h("button", { type: "button", className: "cpwb-btn cpwb-button-content", onClick: () => zipRef.current?.click?.() }, h(Package, { size: 15, "aria-hidden": true }), h("span", null, "导入 ZIP"))),
    catalog.status === "loading" ? h("div", { className: "cpwb-skills-state", role: "status" }, h("span", { className: "cpwb-skills-skeleton" }), "正在读取 Skill 目录") : null,
    catalog.status === "error" ? h("div", { className: "cpwb-skills-state cpwb-skills-error", role: "alert" }, h(WarningCircle, { size: 18, "aria-hidden": true }), errorMessage(catalog.error) || "Skill 目录读取失败", h("button", { type: "button", className: "cpwb-btn", onClick: () => store.actions.loadSkills(target) }, "重试")) : null,
    rootUnavailable ? h("div", { className: "cpwb-skills-state cpwb-skills-error", role: "alert" }, scope === "project" ? "当前项目目录不可用，无法管理项目 Skill。" : "全局 Skill 目录不可用，无法继续管理。") : null,
    catalog.status === "ready" && !rootUnavailable && items.length === 0 && !(data?.diagnostics?.length) ? h("div", { className: "cpwb-skills-empty" }, h(Package, { size: 24, "aria-hidden": true }), h("strong", null, scope === "project" ? "当前项目尚未安装 Skill" : "尚未安装全局 Skill"), h("p", null, "从本地目录或 ZIP 导入一个 Skill。")) : null,
    Array.isArray(data?.diagnostics) && data.diagnostics.length ? h("div", { className: "cpwb-skills-diagnostics", role: "alert" }, h("strong", null, `${data.diagnostics.length} 个条目需要处理`), data.diagnostics.map((diagnostic, index) => h("p", { key: `${diagnostic.path}-${index}` }, diagnostic.message || "条目无效"))) : null,
    items.length ? h("div", { className: "cpwb-skills-list" }, items.map((item) => h(SkillRow, { key: item.name, item: { ...item, projectId }, scope, store, onDelete: setDeleteTarget }))) : null,
    actionError ? h("div", { className: "cpwb-skills-action-error", role: "alert" }, errorMessage(actionError)) : null,
    localError ? h("div", { className: "cpwb-skills-action-error", role: "alert" }, localError) : null,
    conflict ? h(SkillConflictDialog, { ...conflict, busy: action?.status === "running", onCancel: () => { setConflict(null); setSelectedInput(null); }, onReplace: replace }) : null,
    deleteTarget ? h(SkillDeleteDialog, { item: deleteTarget, scope, busy: action?.status === "running", onCancel: () => setDeleteTarget(null), onConfirm: () => store.actions.deleteSkill({ ...target, name: deleteTarget.name }).then(() => setDeleteTarget(null)).catch(() => {}) }) : null);
}
