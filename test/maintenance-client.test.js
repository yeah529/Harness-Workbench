import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ContainerDeleteDialog } from "../src/client/ContainerDeleteDialog.js";
import { MaintenanceScreen } from "../src/client/MaintenanceScreen.js";

function staticStore(snapshot = { action: null }) {
  return {
    subscribe: () => () => {},
    getSnapshot: () => snapshot,
    actions: {},
  };
}

test("permanent deletion has a separate restart acknowledgement after exact-name confirmation", () => {
  const html = renderToStaticMarkup(React.createElement(ContainerDeleteDialog, {
    kind: "project",
    target: { id: 4, name: "Research" },
    store: staticStore(),
    initialPlan: {
      kind: "project",
      id: 4,
      name: "Research",
      sessionCount: 2,
      descendantSessionCount: 1,
      relationshipCount: 0,
      documentCount: 0,
      orphanDocumentCount: 0,
      planVersion: "plan-hash",
      permanentDeletion: {
        available: true,
        requiresRestart: true,
        backend: "rc2-jsonl-zstd",
        reason: null,
      },
    },
    initialPolicy: "delete",
    initialConfirmation: "Research",
    initialStep: "restart",
    onClose() {},
  }));

  assert.match(html, /Workbench 将自动停止并重启/);
  assert.match(html, /页面会短暂断开/);
  assert.match(html, /3 至 10 秒/);
  assert.match(html, /我已了解 Workbench 将自动重启/);
  assert.match(html, /永久删除并重启/);
  assert.match(html, /disabled=""/);
  assert.match(html, /2 个主会话/);
  assert.match(html, /1 个 Subagent 后代/);
});

test("maintenance screen renders only confirmed restart stages and disconnect state", () => {
  const html = renderToStaticMarkup(React.createElement(MaintenanceScreen, {
    store: staticStore(),
    job: {
      jobId: "purge-ui",
      state: "restarting",
      disconnected: true,
      recoveryCommand: "dsh-workbench web",
      container: { kind: "project", id: 4, name: "Research" },
    },
  }));

  assert.match(html, /role="status"/);
  assert.match(html, /正在重启<span>智能核心<\/span>/);
  assert.match(html, /正在重新连接 Workbench/);
  assert.match(html, /关闭 DSH 服务/);
  assert.match(html, /隔离会话数据/);
  assert.match(html, /清理关系与索引/);
  assert.match(html, /重启并验证/);
  assert.doesNotMatch(html, /\d+%/);
  assert.doesNotMatch(html, /[–—]/);
});

test("rollback pending exposes an alert, sanitized recovery command, and accessible copy action", () => {
  const html = renderToStaticMarkup(React.createElement(MaintenanceScreen, {
    store: staticStore(),
    job: {
      jobId: "purge-manual",
      state: "rollback_pending",
      disconnected: true,
      recoveryCommand: "dsh-workbench web",
      container: { kind: "knowledge_base", id: 7, name: "Architecture" },
      error: { code: "PURGE_RECOVERY_START_FAILED", message: "recovery child failed" },
    },
  }));

  assert.match(html, /role="alert"/);
  assert.match(html, /服务恢复<span>需要协助<\/span>/);
  assert.match(html, /dsh-workbench web/);
  assert.match(html, /aria-label="复制恢复命令"/);
  assert.match(html, /purge-manual/);
});

test("Workbench shell resumes a stored maintenance job without persisting credentials", async () => {
  const [shellSource, maintenanceSource] = await Promise.all([
    readFile(new URL("../src/client/WorkbenchShell.js", import.meta.url), "utf8"),
    readFile(new URL("../src/client/MaintenanceScreen.js", import.meta.url), "utf8"),
  ]);
  assert.match(maintenanceSource, /cpwb-maintenance-job/);
  assert.match(shellSource, /resumePurgeJob/);
  assert.doesNotMatch(shellSource + maintenanceSource, /OPENAI_CODEX_ACCESS_TOKEN|Authorization|apiKey/);
});
