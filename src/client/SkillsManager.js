import React from "react";
import { Check, ClipboardText, Eye, FolderOpen, Package, Pause, Play, Trash, UploadSimple, WarningCircle } from "@phosphor-icons/react";
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

export function skillScopeKey(scope = "global", projectId = null) {
  return scope === "project" ? `project:${projectId}` : "global";
}

export function actionMatches(action, type, name, targetKey) {
  return action?.key === targetKey && action?.type === type && action?.name === name && action.status === "running";
}

function usableConflictDetails(details) {
  return !!details?.existing && typeof details.existing.name === "string" && details.existing.name.length > 0
    && !!details?.incoming && typeof details.incoming.name === "string" && details.incoming.name.length > 0;
}

export function shouldRetainSkillInput(error, currentKey, capturedKey, selectedPayload) {
  return error?.code === "SKILL_CONFLICT" && currentKey === capturedKey && !!selectedPayload && usableConflictDetails(error.details);
}

export async function copySkillPath(writeText, path) {
  if (typeof writeText !== "function") throw new Error("当前浏览器不支持复制，请手动选择安装路径。");
  await writeText(path);
  return true;
}

function actionLabel(action) {
  if (action?.type === "importSkill") return action.status === "done" ? "Skill 导入完成。" : action.status === "running" ? "正在导入 Skill。" : "Skill 导入失败。";
  if (action?.type === "setSkillEnabled") return action.status === "done" ? "Skill 状态已更新。" : action.status === "running" ? "正在更新 Skill 状态。" : "Skill 状态更新失败。";
  if (action?.type === "deleteSkill") return action.status === "done" ? "Skill 已删除。" : action.status === "running" ? "正在删除 Skill。" : "Skill 删除失败。";
  if (action?.type === "revealSkill") return action.status === "done" ? "已请求在文件管理器中显示 Skill。" : action.status === "running" ? "正在打开文件管理器。" : "无法打开文件管理器。";
  return "Skill 操作已完成。";
}

function CopyPath({ path, targetKey, onError }) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef(null);
  const aliveRef = React.useRef(true);
  const generationRef = React.useRef(0);
  React.useEffect(() => () => {
    aliveRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  React.useEffect(() => {
    generationRef.current += 1;
    setCopied(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [targetKey, path]);
  const copy = async function () {
    const generation = generationRef.current;
    const writer = globalThis.navigator?.clipboard?.writeText;
    if (typeof writer !== "function") {
      onError?.("当前浏览器不支持复制，请手动选择安装路径。");
      return;
    }
    try {
      await copySkillPath(writer.bind(globalThis.navigator.clipboard), path);
      if (!aliveRef.current || generationRef.current !== generation) return;
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { if (aliveRef.current) setCopied(false); }, 1200);
    } catch {
      if (aliveRef.current && generationRef.current === generation) {
        setCopied(false);
        onError?.("复制安装路径失败，请手动选择路径文本。");
      }
    }
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

function SkillRow({ item, scope, targetKey, store, onDelete }) {
  const state = store.getSnapshot();
  const action = state.skillAction;
  const busy = action?.status === "running" && action.key === targetKey;
  const stateBusy = actionMatches(action, "setSkillEnabled", item.name, targetKey) || actionMatches(action, "deleteSkill", item.name, targetKey) || actionMatches(action, "revealSkill", item.name, targetKey);
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
  const key = skillScopeKey(scope, projectId);
  const catalog = state.skillCatalogs?.[key] || { status: "loading", data: null, error: null };
  const [conflict, setConflict] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [selectedInput, setSelectedInput] = React.useState(null);
  const [localError, setLocalError] = React.useState(null);
  const activeKeyRef = React.useRef(key);
  const generationRef = React.useRef(0);
  const directoryRef = React.useRef(null);
  const zipRef = React.useRef(null);
  activeKeyRef.current = key;
  React.useEffect(() => {
    generationRef.current += 1;
    setConflict(null);
    setDeleteTarget(null);
    setSelectedInput(null);
    setLocalError(null);
    return () => { generationRef.current += 1; };
  }, [key]);
  React.useEffect(() => {
    if (typeof store.actions.loadSkills !== "function" || (scope === "project" && !(Number.isSafeInteger(projectId) && projectId > 0))) return undefined;
    store.actions.loadSkills({ scope, ...(scope === "project" ? { projectId } : {}) }).catch?.(() => {});
    return undefined;
  }, [store, scope, projectId]);

  const target = Object.freeze({ scope, ...(scope === "project" ? { projectId } : {}) });
  const isCurrent = (capturedKey, capturedGeneration) => activeKeyRef.current === capturedKey && generationRef.current === capturedGeneration;
  const importArchive = async (archive, sourceName, input) => {
    if (!archive || rootUnavailable) return;
    const capturedKey = key;
    const capturedGeneration = generationRef.current;
    const capturedTarget = target;
    if (!isCurrent(capturedKey, capturedGeneration) || rootUnavailable) return;
    setLocalError(null);
    setConflict(null);
    setSelectedInput(null);
    if (archive.size > SKILL_IMPORT_LIMITS.archiveBytes) {
      setLocalError("ZIP 文件超过 50 MiB，未开始导入。");
      input.value = "";
      return;
    }
    setSelectedInput({ archive, sourceName, input, target: capturedTarget, key: capturedKey, generation: capturedGeneration });
    try {
      await store.actions.importSkill({ ...capturedTarget, archive, sourceName });
      if (isCurrent(capturedKey, capturedGeneration)) {
        setSelectedInput(null);
        setConflict(null);
      }
    } catch (error) {
      if (!isCurrent(capturedKey, capturedGeneration)) return;
      if (shouldRetainSkillInput(error, activeKeyRef.current, capturedKey, { archive, sourceName })) {
        setConflict({ existing: error.details?.existing, incoming: error.details?.incoming || { name: sourceName }, key: capturedKey, generation: capturedGeneration });
      } else {
        setSelectedInput(null);
        setLocalError(error?.code === "SKILL_CONFLICT"
          ? "Skill 冲突信息不完整，无法安全替换。请重新导入后重试。"
          : errorMessage(error) || "Skill 导入失败，请检查文件后重试。");
      }
    } finally {
      input.value = "";
    }
  };
  const chooseDirectory = async (event) => {
    const input = event.currentTarget;
    const capturedKey = key;
    const capturedGeneration = generationRef.current;
    if (!isCurrent(capturedKey, capturedGeneration) || rootUnavailable) return;
    setConflict(null);
    setSelectedInput(null);
    try {
      const packed = await packSkillDirectory(input.files);
      if (isCurrent(capturedKey, capturedGeneration)) await importArchive(packed.archive, packed.sourceName, input);
    } catch (error) {
      if (!isCurrent(capturedKey, capturedGeneration)) return;
      setSelectedInput(null);
      input.value = "";
      setLocalError(errorMessage(error) || "目录打包失败，请检查 Skill 文件。");
    }
  };
  const chooseZip = (event) => {
    const input = event.currentTarget;
    setConflict(null);
    setSelectedInput(null);
    const file = input.files?.[0];
    if (file && !rootUnavailable && isCurrent(key, generationRef.current)) void importArchive(file, file.name, input);
  };
  const replace = () => {
    const selected = selectedInput;
    if (!selected || selected.key !== key || !isCurrent(selected.key, selected.generation)) return;
    setLocalError(null);
    store.actions.importSkill({ ...selected.target, archive: selected.archive, sourceName: selected.sourceName, replace: true })
      .then(() => {
        if (isCurrent(selected.key, selected.generation)) { setConflict(null); setSelectedInput(null); }
      })
      .catch((error) => {
        if (isCurrent(selected.key, selected.generation)) setLocalError(errorMessage(error) || "Skill 替换失败，请重试。");
      });
  };
  const data = catalog.data;
  const items = Array.isArray(data?.items) ? data.items : [];
  const action = state.skillAction;
  const currentAction = action?.key === key ? action : null;
  const actionError = currentAction?.status === "error" ? currentAction.error : null;
  const rootUnavailable = (scope === "project" && !(Number.isSafeInteger(projectId) && projectId > 0)) || catalog.error?.code === "PROJECT_PATH_UNAVAILABLE" || catalog.error?.code === "SKILL_PERMISSION_DENIED";
  return h("section", { className: "cpwb-skills-scope-manager" + (compact ? " cpwb-skills-compact" : ""), "aria-label": scopeLabel(scope) },
    h("div", { className: "cpwb-skills-path" }, h(FolderOpen, { size: 16, "aria-hidden": true }), h("code", { title: data?.rootPath || "" }, data?.rootPath || "正在读取安装根路径"), data?.rootPath ? h(CopyPath, { path: data.rootPath, targetKey: key, onError: (message) => { if (activeKeyRef.current === key) setLocalError(message); } }) : null),
    h("div", { className: "cpwb-skills-toolbar" },
      h("input", { ref: directoryRef, className: "cpwb-visually-hidden", type: "file", webkitdirectory: "", directory: "", multiple: true, onChange: chooseDirectory, tabIndex: -1, disabled: rootUnavailable, "aria-hidden": true }),
      h("input", { ref: zipRef, className: "cpwb-visually-hidden", type: "file", accept: ".zip,application/zip", onChange: chooseZip, tabIndex: -1, disabled: rootUnavailable, "aria-hidden": true }),
      h("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", disabled: rootUnavailable, onClick: () => directoryRef.current?.click?.() }, h(UploadSimple, { size: 15, "aria-hidden": true }), h("span", null, "导入目录")),
      h("button", { type: "button", className: "cpwb-btn cpwb-button-content", disabled: rootUnavailable, onClick: () => zipRef.current?.click?.() }, h(Package, { size: 15, "aria-hidden": true }), h("span", null, "导入 ZIP"))),
    catalog.status === "loading" ? h("div", { className: "cpwb-skills-state", role: "status" }, h("span", { className: "cpwb-skills-skeleton" }), "正在读取 Skill 目录") : null,
    catalog.status === "error" ? h("div", { className: "cpwb-skills-state cpwb-skills-error", role: "alert" }, h(WarningCircle, { size: 18, "aria-hidden": true }), errorMessage(catalog.error) || "Skill 目录读取失败", h("button", { type: "button", className: "cpwb-btn", onClick: () => store.actions.loadSkills(target) }, "重试")) : null,
    rootUnavailable ? h("div", { className: "cpwb-skills-state cpwb-skills-error", role: "alert" }, scope === "project" ? "当前项目目录不可用，无法管理项目 Skill。" : "全局 Skill 目录不可用，无法继续管理。") : null,
    catalog.status === "ready" && !rootUnavailable && items.length === 0 && !(data?.diagnostics?.length) ? h("div", { className: "cpwb-skills-empty" }, h(Package, { size: 24, "aria-hidden": true }), h("strong", null, scope === "project" ? "当前项目尚未安装 Skill" : "尚未安装全局 Skill"), h("p", null, "从本地目录或 ZIP 导入一个 Skill。")) : null,
    Array.isArray(data?.diagnostics) && data.diagnostics.length ? h("div", { className: "cpwb-skills-diagnostics", role: "alert" }, h("strong", null, `${data.diagnostics.length} 个条目需要处理`), data.diagnostics.map((diagnostic, index) => h("p", { key: `${diagnostic.path}-${index}` }, diagnostic.message || "条目无效"))) : null,
    items.length ? h("div", { className: "cpwb-skills-list" }, items.map((item) => h(SkillRow, { key: item.name, item: { ...item, projectId }, scope, targetKey: key, store, onDelete: (next) => setDeleteTarget({ item: next, target, key, generation: generationRef.current }) }))) : null,
    currentAction && (currentAction.status === "running" || currentAction.status === "done") ? h("div", { className: "cpwb-skills-action-status", role: "status", "aria-live": "polite" }, actionLabel(currentAction)) : null,
    actionError ? h("div", { className: "cpwb-skills-action-error", role: "alert" }, errorMessage(actionError)) : null,
    localError ? h("div", { className: "cpwb-skills-action-error", role: "alert" }, localError) : null,
    conflict && conflict.key === key ? h(SkillConflictDialog, { existing: conflict.existing, incoming: conflict.incoming, busy: currentAction?.status === "running", onCancel: () => { setConflict(null); setSelectedInput(null); }, onReplace: replace }) : null,
    deleteTarget && deleteTarget.key === key ? h(SkillDeleteDialog, { item: deleteTarget.item, scope: deleteTarget.target.scope, busy: currentAction?.status === "running", onCancel: () => setDeleteTarget(null), onConfirm: () => {
      const captured = deleteTarget;
      if (!isCurrent(captured.key, captured.generation)) return;
      store.actions.deleteSkill({ ...captured.target, name: captured.item.name }).then(() => {
        if (isCurrent(captured.key, captured.generation)) setDeleteTarget(null);
      }).catch(() => {});
    } }) : null);
}
