import React from "react";
import { Sparkle } from "@phosphor-icons/react";
import { SkillConflictDialog, SkillDeleteDialog, SkillScopeManager, skillCatalogCount, skillScopeKey } from "./SkillsManager.js";

const h = React.createElement;
export { SkillConflictDialog, SkillDeleteDialog, SkillScopeManager };

export function SkillsPage({ store }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const projects = Array.isArray(state.projects) ? state.projects : [];
  const [scope, setScope] = React.useState("global");
  const [projectId, setProjectId] = React.useState(projects[0]?.id ?? null);
  React.useEffect(() => {
    if (scope === "project" && projectId == null && projects[0]) setProjectId(projects[0].id);
  }, [scope, projectId, projects]);
  return h("main", { className: "cpwb-skills-page" },
    h("div", { className: "cpwb-skills-layout" },
      h("header", { className: "cpwb-skills-header" }, h("div", { className: "cpwb-skills-title" }, h(Sparkle, { size: 19, "aria-hidden": true }), h("div", null, h("span", null, "SKILL MATRIX"), h("h1", null, "Skills ", h("span", { className: "cpwb-skills-title-alias" }, "技能矩阵")), h("p", null, "为 Workbench 装载可复用能力，在全局或当前项目生效。"))), h("span", { className: "cpwb-skills-count" }, String(skillCatalogCount(state, scope, projectId)).padStart(2, "0"))),
      h("div", { className: "cpwb-skills-tabs", role: "tablist", "aria-label": "Skill 作用域" },
        h("button", { type: "button", role: "tab", "aria-selected": scope === "global", className: scope === "global" ? "cpwb-active" : "", onClick: () => setScope("global") }, "全局"),
        h("button", { type: "button", role: "tab", "aria-selected": scope === "project", className: scope === "project" ? "cpwb-active" : "", onClick: () => setScope("project") }, "项目")),
      scope === "project" ? h("label", { className: "cpwb-skills-project-select" }, h("span", null, "选择项目"), h("select", { value: projectId ?? "", onChange: (event) => setProjectId(Number(event.target.value) || null), "aria-label": "选择 Skill 所属项目" }, projects.length ? projects.map((project) => h("option", { key: project.id, value: project.id }, project.name)) : h("option", { value: "" }, "暂无项目"))) : null,
      h(SkillScopeManager, { key: skillScopeKey(scope, projectId), store, scope, projectId })));
}
