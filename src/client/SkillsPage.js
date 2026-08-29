import React from "react";
import { Circuitry } from "@phosphor-icons/react";
import { SkillCollectionDialog, SkillConflictDialog, SkillDeleteDialog, SkillScopeManager, skillCatalogCount, skillScopeKey } from "./SkillsManager.js";

const h = React.createElement;
export { SkillCollectionDialog, SkillConflictDialog, SkillDeleteDialog, SkillScopeManager };

function NeuralSkillChip() {
  return h("div", { className: "cpwb-skills-chip", role: "img", "aria-label": "神经技能芯片已连接" },
    h("span", { className: "cpwb-skills-chip-board", "aria-hidden": true }),
    h("span", { className: "cpwb-skills-chip-bus", "aria-hidden": true }),
    h("span", { className: "cpwb-skills-chip-die", "aria-hidden": true }, h(Circuitry, { size: 25, weight: "thin" })),
    h("span", { className: "cpwb-skills-chip-scan", "aria-hidden": true }),
    h("span", { className: "cpwb-skills-chip-label", "aria-hidden": true }, "NEURAL SKILL CHIP"),
    h("span", { className: "cpwb-skills-chip-state", "aria-hidden": true }, "LINKED"));
}

export function SkillsPage({ store }) {
  const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const projects = Array.isArray(state.projects) ? state.projects : [];
  const [scope, setScope] = React.useState("global");
  const [projectId, setProjectId] = React.useState(projects[0]?.id ?? null);
  React.useEffect(() => {
    if (scope === "project" && projectId == null && projects[0]) setProjectId(projects[0].id);
  }, [scope, projectId, projects]);
  const globalCount = skillCatalogCount(state, "global");
  const projectCount = skillCatalogCount(state, "project", projectId);
  return h("main", { className: "cpwb-skills-page" },
    h("div", { className: "cpwb-skills-layout" },
      h("header", { className: "cpwb-skills-header" },
        h("div", { className: "cpwb-skills-title" },
          h("span", { className: "cpwb-skills-kicker" }, h(Circuitry, { size: 13, "aria-hidden": true }), "SKILL MATRIX / CHIP BAY"),
          h("h1", null, "Skills ", h("span", { className: "cpwb-skills-title-alias" }, "技能矩阵")),
          h("p", null, "将可复用能力写入神经芯片，在全局或当前项目接入 Workbench。")),
        h(NeuralSkillChip)),
      h("div", { className: "cpwb-skills-tabs", role: "tablist", "aria-label": "Skill 作用域" },
        h("button", { type: "button", role: "tab", "aria-selected": scope === "global", className: scope === "global" ? "cpwb-active" : "", onClick: () => setScope("global") }, "全局矩阵", h("span", { className: "cpwb-skills-tab-count" }, `（${globalCount}）`)),
        h("button", { type: "button", role: "tab", "aria-selected": scope === "project", className: scope === "project" ? "cpwb-active" : "", onClick: () => setScope("project") }, "项目矩阵", h("span", { className: "cpwb-skills-tab-count" }, `（${projectCount}）`))),
      scope === "project" ? h("label", { className: "cpwb-skills-project-select" }, h("span", null, "选择项目"), h("select", { value: projectId ?? "", onChange: (event) => setProjectId(Number(event.target.value) || null), "aria-label": "选择 Skill 所属项目" }, projects.length ? projects.map((project) => h("option", { key: project.id, value: project.id }, project.name)) : h("option", { value: "" }, "暂无项目"))) : null,
      h(SkillScopeManager, { key: skillScopeKey(scope, projectId), store, scope, projectId })));
}
