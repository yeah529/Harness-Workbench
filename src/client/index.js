import React from "react";
import THEME_CSS from "./theme.css";
import WORKBENCH_CSS from "./workbench.css";
import { localDateKey } from "./store.js";
import { getStore } from "./storeInstance.js";
import { getWorkbenchSession, openWorkbenchSession } from "./workbenchSessions.js";
import { createNavigationStore } from "./navigation.js";
import { WorkbenchShell } from "./WorkbenchShell.js";
import { registerWorkbenchSettingsSection as registerSettingsSection } from "./settingsSlot.js";
import { registerKnowledgeBaseReferenceSource } from "./knowledgeReferences.js";
import { registerModelIndicator } from "./ModelIndicator.js";
import { registerImageAttachmentButton } from "./ImageAttachmentButton.js";

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

const inject = ["slots", "layout", "workspaces", "sessions", "connection", "inputTriggers"];

function registerWorkbenchSettingsSection(ctx, settingsStore = store) {
  return registerSettingsSection(ctx, settingsStore);
}

function apply(ctx) {
  injectCss("dsh-cyberpunk-workbench/theme.css", THEME_CSS);
  injectCss("dsh-cyberpunk-workbench/workbench.css", WORKBENCH_CSS);

  ctx.effect(function () {
    store.actions.refresh().catch(function () {});
    return function () { store.dispose(); };
  });

  registerWorkbenchSettingsSection(ctx);
  registerKnowledgeBaseReferenceSource(ctx, store);
  registerImageAttachmentButton(ctx);
  registerModelIndicator(ctx);

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
        const openKnownSession = async function (sessionId) {
          const entry = store.getSnapshot().workbenchSessions?.[sessionId];
          if (!entry?.scope) throw new Error("找不到会话上下文");
          let result;
          if (entry.scope.kind === "project") {
            result = await store.actions.openProjectChat({ projectId: entry.scope.scopeId, resumeSessionId: sessionId });
          } else if (entry.scope.kind === "knowledge_base") {
            result = await store.actions.openKnowledgeChat({ knowledgeBaseId: entry.scope.scopeId, chatId: entry.chatId });
          } else {
            result = await store.actions.openIndependentSession({ resumeSessionId: sessionId });
          }
          return openResult(result, entry.scope.kind === "project" ? entry.scope.scopeId : null);
        };
        const createSession = async function () {
          const result = await store.actions.openIndependentSession();
          return openResult(result, null);
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
          workspaces: ctx.workspaces,
          createProject,
          createSession,
          openSession: openKnownSession,
          openKnowledge: navigation.openKnowledge,
          openSessions: navigation.openSessions,
          enterProject(projectId, options = {}) {
            if (projectId == null) return Promise.reject(new Error("项目缺少 projectId"));
            return store.actions.openProjectChat({
              projectId,
              resumeSessionId: options.newSession ? undefined : options.resumeSessionId,
            }).then(function (result) { return openResult(result, projectId); });
          },
          enterKnowledgeBase(knowledgeBaseId, options = {}) {
            if (knowledgeBaseId == null) return Promise.reject(new Error("知识库缺少 knowledgeBaseId"));
            return store.actions.openKnowledgeChat({
              knowledgeBaseId,
              chatId: options.newSession ? undefined : options.chatId,
            }).then(function (result) { return openResult(result, null); });
          },
        };
      },
    }, WorkbenchShell);
  });
}

export { inject, apply, getStore, registerWorkbenchSettingsSection };
