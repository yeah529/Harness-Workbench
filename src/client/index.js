import React from "react";
import THEME_CSS from "./theme.css";
import WORKBENCH_CSS from "./workbench.css";
import { localDateKey } from "./store.js";
import { getStore } from "./storeInstance.js";
import { openWorkbenchSession } from "./workbenchSessions.js";
import { openKnownWorkbenchSession } from "./sessionNavigation.js";
import { createNavigationStore } from "./navigation.js";
import { WorkbenchShell } from "./WorkbenchShell.js";
import { registerWorkbenchSettingsSection as registerSettingsSection } from "./settingsSlot.js";
import { registerKnowledgeBaseReferenceSource } from "./knowledgeReferences.js";
import { registerModelIndicator } from "./ModelIndicator.js";
import { registerImageAttachmentButton } from "./ImageAttachmentButton.js";
import { registerKnowledgeSources } from "./sessionAdapter.js";
import { KnowledgeSourcesTail } from "./KnowledgeSourcesTail.js";
export { packSkillDirectory, SkillImportError, SKILL_IMPORT_ERROR_CODES, SKILL_IMPORT_LIMITS } from "./skill-import.js";

function injectCss(tagId, css) {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-cyberpunk-workbench";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}

const store = getStore();
const navigation = createNavigationStore();

const inject = ["slots", "layout", "workspaces", "sessions", "connection", "conversation", "conversationEvents", "inputTriggers"];

function registerWorkbenchSettingsSection(ctx, settingsStore = store, options) {
  return registerSettingsSection(ctx, settingsStore, options);
}

function apply(ctx) {
  injectCss("dsh-cyberpunk-workbench/theme.css", THEME_CSS);
  injectCss("dsh-cyberpunk-workbench/workbench.css", WORKBENCH_CSS);

  ctx.effect(function () {
    store.actions.refresh().catch(function () {});
    return function () { store.dispose(); };
  });

  const openKnownSession = async function (sessionId) {
    return openKnownWorkbenchSession({
      sessionId,
      store,
      sessions: ctx.sessions,
      workspaces: ctx.workspaces,
      navigation,
    });
  };

  registerWorkbenchSettingsSection(ctx, store, { onOpenSession: openKnownSession });
  registerKnowledgeBaseReferenceSource(ctx, store);
  registerImageAttachmentButton(ctx);
  registerModelIndicator(ctx);
  registerKnowledgeSources(ctx, KnowledgeSourcesTail);

  ctx.slots.inject("shell.overlay", function () {
    return ctx.slots.register({
      name: "shell.overlay",
      id: "cpwb-workbench-shell",
      order: 50,
      inject: function () {
        const openResult = function (result, projectId) {
          return openWorkbenchSession(ctx.sessions, result.sessionId, { workspaces: ctx.workspaces }).then(function () {
            navigation.openConversation(result.sessionId);
            if (projectId != null) return store.actions.refreshProject(projectId, localDateKey());
            return result;
          });
        };
        const createProject = async function () {
          const path = await ctx.workspaces.pickDirectory();
          if (!path) return null;
          const ws = await ctx.workspaces.create({ path });
          const workspaceId = ws && ws.workspaceId;
          if (!workspaceId) throw new Error("DSH 未返回 workspaceId，无法创建项目");
          const created = await store.actions.createProject({
            name: ws.title || ws.name || path.split(/[\\/]/).filter(Boolean).pop() || path,
            path: ws.path || path,
            workspaceId,
          });
          await store.actions.refresh();
          return created;
        };
        return {
          store,
          navigation,
          sessions: ctx.sessions,
          connection: ctx.connection,
          conversation: ctx.conversation,
          workspaces: ctx.workspaces,
          createProject,
          openActivatedSession(result) {
            const projectId = result.scope?.kind === "project" ? result.scope.id : null;
            return openResult(result, projectId);
          },
          openSession: openKnownSession,
          openKnowledge: navigation.openKnowledge,
          openSessions: navigation.openSessions,
          enterProject(projectId, options = {}) {
            if (projectId == null) return Promise.reject(new Error("项目缺少 projectId"));
            if (!options.newSession && options.resumeSessionId) return openKnownSession(options.resumeSessionId);
            store.actions.startDraft({ scope: { kind: "project", id: projectId } });
            navigation.openDraft();
            return Promise.resolve({ draft: true, scope: { kind: "project", id: projectId } });
          },
          enterKnowledgeBase(knowledgeBaseId, options = {}) {
            if (knowledgeBaseId == null) return Promise.reject(new Error("知识库缺少 knowledgeBaseId"));
            if (!options.newSession && options.sessionId) return openKnownSession(options.sessionId);
            store.actions.startDraft({ scope: { kind: "knowledge_base", id: knowledgeBaseId } });
            navigation.openDraft();
            return Promise.resolve({ draft: true, scope: { kind: "knowledge_base", id: knowledgeBaseId } });
          },
        };
      },
    }, WorkbenchShell);
  });
}

export { inject, apply, getStore, registerWorkbenchSettingsSection };
