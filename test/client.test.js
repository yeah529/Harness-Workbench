/**
 * Client API wrapper + server-backed store tests (Task 7).
 *
 * These are pure Node tests with no React: they drive createCpwbApi and
 * createWorkbenchStore against a mock fetch, asserting exact request
 * shape (path / method / body / headers), JSON error-envelope parsing,
 * abort propagation, stale-response protection, mutation-then-refetch
 * behavior, and dispose aborts in-flight requests.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createCpwbApi, cpwbApi, CpwbApiError } from "../src/client/api.js";
import { createWorkbenchStore, localDateKey } from "../src/client/store.js";
import { needsDocumentPolling } from "../src/client/KnowledgeBase.js";
import { WorkbenchSidebar } from "../src/client/WorkbenchSidebar.js";
import { ProjectHome } from "../src/client/ProjectHome.js";

// ---------------------------------------------------------------- helpers

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

function makeFetch(handler) {
  const calls = [];
  const fetchImpl = (url, init) => {
    const entry = { url: String(url), init: init || {} };
    calls.push(entry);
    return handler(entry, calls.length - 1);
  };
  fetchImpl.calls = calls;
  return fetchImpl;
}

/** Parse the url + return { pathname, searchParams }. */
function parse(url) {
  const u = new URL(url, "http://dsh.local");
  return { pathname: u.pathname, searchParams: u.searchParams };
}

test("sidebar renders the approved hierarchy with one Workbench-styled settings action", () => {
  const recentSessions = Array.from({ length: 25 }, (_, index) => ({
    sessionId: "session-cpwb-" + index,
    title: "会话 " + index,
    scope: { kind: "independent", scopeId: null },
  }));
  const html = renderToStaticMarkup(React.createElement(WorkbenchSidebar, { page: "home", recentSessions }));
  assert.match(html, /新建会话/);
  assert.match(html, /首页/);
  assert.match(html, /知识芯片/);
  assert.match(html, /查看全部会话/);
  assert.doesNotMatch(html, /<span>归档会话<\/span>/);
  assert.match(html, /<button[^>]+cpwb-sidebar-settings/);
  assert.match(html, />设置</);
  assert.doesNotMatch(html, /cpwb-sidebar-settings-seat/);
  assert.equal((html.match(/class="cpwb-sidebar-recent"/g) || []).length, 20);
  assert.match(html, /最近会话/);
  assert.doesNotMatch(html, /其他最近会话|当前项目|当前知识库|当前会话/);
  assert.equal((html.match(/data-logo-part="approved-node-artwork"/g) || []).length, 1);
  assert.match(html, /class="cpwb-sidebar-footer-wordmark"/);
  assert.doesNotMatch(html, /data-logo-part="harness-core"/);
  assert.equal((html.match(/data-logo-part="wordmark-main"/g) || []).length, 4);
  assert.equal((html.match(/data-logo-channel=/g) || []).length, 2);
  assert.doesNotMatch(html, /<text/);
});

const ISO = "2026-08-17T00:00:00.000Z";

const project = { id: 1, workspaceId: "w1", name: "P", path: "/p", createdAt: ISO, updatedAt: ISO };
const kb = { id: 2, name: "K", description: null, createdAt: ISO, updatedAt: ISO };
const doc = { id: 3, sha256: "abc", originalName: "n.md", mimeType: "text/markdown", size: 4, status: "ready", error: null, createdAt: ISO, indexedAt: ISO };
const todo = { id: 5, projectId: 1, title: "pl", done: false, source: "manual", dueAt: "2026-08-18T10:00:00.000Z", createdAt: ISO, completedAt: null, overdue: false };

// ------------------------------------------------------------------ api

test("api: health uses GET /api/cpwb/health", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    assert.equal(pathname, "/api/cpwb/health");
    assert.equal(init.method ?? "GET", "GET");
    return jsonResponse(200, { ok: true, reachable: true });
  });
  const api = createCpwbApi({ fetchImpl });
  const out = await api.health();
  assert.equal(out.ok, true);
  assert.equal(fetchImpl.calls.length, 1);
});

test("api: projects list/create use exact path, method, JSON body", async () => {
  const fetchImpl = makeFetch(({ url, init }, i) => {
    const { pathname } = parse(url);
    if (i === 0) {
      assert.equal(pathname, "/api/cpwb/projects");
      assert.equal(init.method ?? "GET", "GET");
      return jsonResponse(200, [project]);
    }
    assert.equal(pathname, "/api/cpwb/projects");
    assert.equal(init.method, "POST");
    assert.equal(init.headers["content-type"], "application/json");
    assert.deepEqual(JSON.parse(init.body), { name: "P", path: "/p", workspaceId: "w1" });
    return jsonResponse(201, project);
  });
  const api = createCpwbApi({ fetchImpl });
  assert.equal((await api.projects.list()).length, 1);
  await api.projects.create({ name: "P", path: "/p", workspaceId: "w1" });
});

test("api: projects expose deletion preview and session policy", async () => {
  const fetchImpl = makeFetch(({ url, init }, index) => {
    const parsed = parse(url);
    if (index === 0) {
      assert.equal(parsed.pathname, "/api/cpwb/projects/1");
      assert.equal(init.method, "PATCH");
      assert.deepEqual(JSON.parse(init.body), { name: "Renamed" });
      return jsonResponse(200, { ...project, name: "Renamed" });
    }
    if (index === 1) {
      assert.equal(parsed.pathname, "/api/cpwb/projects/1/deletion-plan");
      assert.equal(init.method ?? "GET", "GET");
      return jsonResponse(200, { kind: "project", id: 1, name: "P", sessionCount: 0, relationshipCount: 0, documentCount: 0, orphanDocumentCount: 0, permanentDeletionAvailable: false });
    }
    assert.equal(parsed.pathname, "/api/cpwb/projects/1");
    assert.equal(parsed.searchParams.get("sessionPolicy"), "detach");
    assert.equal(init.method, "DELETE");
    return jsonResponse(200, { removed: true, projectId: 1, sessionPolicy: "detach", detachedSessionCount: 0, deletedSessionCount: 0, orphanDocumentIds: [] });
  });
  const api = createCpwbApi({ fetchImpl });
  assert.equal((await api.projects.update({ id: 1, name: "Renamed" })).name, "Renamed");
  assert.equal((await api.projects.deletionPlan(1)).sessionCount, 0);
  assert.equal((await api.projects.remove(1, { sessionPolicy: "detach" })).removed, true);
});

test("project card exposes rename and delete controls without replacing its open action", () => {
  const state = { phase: "ready", projects: [project], knowledgeBases: [], recentSessions: [], recentSessionTotal: 0, error: null };
  const store = { subscribe: () => () => {}, getSnapshot: () => state, actions: { retry: async () => {} } };
  const html = renderToStaticMarkup(React.createElement(ProjectHome, {
    open: true, store, enterProject: async () => {}, createProject: async () => {}, openKnowledge: () => {},
  }));
  assert.match(html, /aria-label="重命名项目 P"/);
  assert.match(html, /aria-label="删除项目 P"/);
  assert.match(html, /aria-label="打开项目 P"/);
  assert.match(html, /aria-label="查看项目 P 的全部会话"/);
});

test("api: knowledge-bases create drops undefined description", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/knowledge-bases");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), { name: "K" });
    return jsonResponse(201, kb);
  });
  const api = createCpwbApi({ fetchImpl });
  await api.knowledgeBases.create({ name: "K" });
});

test("api: knowledge-base deletion exposes preview and policy", async () => {
  const fetchImpl = makeFetch(({ url, init }, index) => {
    const parsed = parse(url);
    if (index === 0) {
      assert.equal(parsed.pathname, "/api/cpwb/knowledge-bases/9/deletion-plan");
      return jsonResponse(200, { kind: "knowledge_base", id: 9, sessionCount: 1 });
    }
    assert.equal(parsed.pathname, "/api/cpwb/knowledge-bases/9");
    assert.equal(parsed.searchParams.get("sessionPolicy"), "delete");
    assert.equal(init.method, "DELETE");
    return jsonResponse(200, { removed: true, orphanDocumentIds: [3] });
  });
  const api = createCpwbApi({ fetchImpl });
  await api.knowledgeBases.deletionPlan(9);
  await api.knowledgeBases.remove(9, { sessionPolicy: "delete" });
});

test("api: project knowledge-base link/unlink use exact nested paths", async () => {
  const fetchImpl = makeFetch(({ url, init }, i) => {
    const { pathname } = parse(url);
    if (i === 0) {
      assert.equal(pathname, "/api/cpwb/projects/7/knowledge-bases");
      return jsonResponse(200, [kb]);
    }
    if (i === 1) {
      assert.equal(pathname, "/api/cpwb/projects/7/knowledge-bases/9");
      assert.equal(init.method, "POST");
      return jsonResponse(201, { projectId: 7, knowledgeBaseId: 9 });
    }
    assert.equal(pathname, "/api/cpwb/projects/7/knowledge-bases/9");
    assert.equal(init.method, "DELETE");
    return jsonResponse(200, { removed: 1 });
  });
  const api = createCpwbApi({ fetchImpl });
  await api.projectKnowledgeBases.list(7);
  await api.projectKnowledgeBases.link(7, 9);
  await api.projectKnowledgeBases.unlink(7, 9);
});

test("api: knowledge-base projects use the inverse relationship route", async () => {
  const fetchImpl = makeFetch(({ url }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/knowledge-bases/2/projects");
    return jsonResponse(200, [project]);
  });
  const api = createCpwbApi({ fetchImpl });
  assert.deepEqual(await api.knowledgeBaseProjects.list(2), [project]);
});

test("api: documents list encodes scope/scopeId query", async () => {
  const fetchImpl = makeFetch(({ url }) => {
    const { pathname, searchParams } = parse(url);
    assert.equal(pathname, "/api/cpwb/documents");
    assert.equal(searchParams.get("scope"), "knowledgeBase");
    assert.equal(searchParams.get("scopeId"), "2");
    return jsonResponse(200, [doc]);
  });
  const api = createCpwbApi({ fetchImpl });
  await api.documents.list({ scope: "knowledgeBase", scopeId: 2 });
});

test("api: document contentUrl builds safe inline and download URLs", () => {
  const api = createCpwbApi({ fetchImpl: async () => jsonResponse(200, {}) });
  assert.equal(api.documents.contentUrl(3), "/api/cpwb/documents/3/content");
  assert.equal(api.documents.contentUrl(3, { download: true }), "/api/cpwb/documents/3/content?download=1");
  assert.throws(() => api.documents.contentUrl(0), /positive integer/);
});

test("api: documents upload sends raw body + encoded filename + scope headers", async () => {
  const file = { name: "中文 笔记.md", size: 5 };
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    assert.equal(pathname, "/api/cpwb/documents");
    assert.equal(init.method, "POST");
    assert.equal(init.body, file);
    assert.equal(init.headers["x-cpwb-filename"], encodeURIComponent(file.name));
    assert.equal(init.headers["x-cpwb-scope"], "knowledgeBase");
    assert.equal(init.headers["x-cpwb-scope-id"], "2");
    assert.equal(init.headers["content-type"], undefined);
    return jsonResponse(202, { document: doc, queued: true });
  });
  const api = createCpwbApi({ fetchImpl });
  const out = await api.documents.upload({ file, scope: "knowledgeBase", scopeId: 2 });
  assert.equal(out.queued, true);
});

test("api: documents reindex/unlink use exact paths and methods", async () => {
  const fetchImpl = makeFetch(({ url, init }, i) => {
    const { pathname } = parse(url);
    if (i === 0) {
      assert.equal(pathname, "/api/cpwb/documents/3/reindex");
      assert.equal(init.method, "POST");
      return jsonResponse(202, { document: doc, queued: true });
    }
    assert.equal(pathname, "/api/cpwb/documents/3/links/project/1");
    assert.equal(init.method, "DELETE");
    return jsonResponse(200, { removed: 1 });
  });
  const api = createCpwbApi({ fetchImpl });
  await api.documents.reindex(3);
  await api.documents.unlink({ id: 3, scope: "project", scopeId: 1 });
});

test("api: search posts scope/query/limit", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/search");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), { scope: "knowledgeBase", scopeId: 2, query: "q", limit: 4 });
    return jsonResponse(200, []);
  });
  const api = createCpwbApi({ fetchImpl });
  await api.search({ scope: "knowledgeBase", scopeId: 2, query: "q", limit: 4 });
});

test("api: todos list/create/update/delete use exact contract", async () => {
  const fetchImpl = makeFetch(({ url, init }, i) => {
    const { pathname, searchParams } = parse(url);
    assert.equal(pathname, i === 3 ? "/api/cpwb/todos/5" : "/api/cpwb/todos");
    if (i === 0) {
      assert.equal(init.method ?? "GET", "GET");
      assert.equal(searchParams.get("projectId"), "1");
      return jsonResponse(200, [todo]);
    }
    if (i === 1) {
      assert.equal(init.method, "POST");
      assert.deepEqual(JSON.parse(init.body), { projectId: 1, title: "pl", dueAt: "2026-08-18T10:00:00.000Z", source: "manual" });
      return jsonResponse(201, todo);
    }
    if (i === 2) {
      assert.equal(init.method, "PATCH");
      assert.deepEqual(JSON.parse(init.body), { id: 5, done: true });
      return jsonResponse(200, { ...todo, done: true, completedAt: ISO });
    }
    assert.equal(init.method, "DELETE");
    return jsonResponse(200, { removed: true, todoId: 5 });
  });
  const api = createCpwbApi({ fetchImpl });
  await api.todos.list({ projectId: 1 });
  await api.todos.create({ projectId: 1, title: "pl", dueAt: "2026-08-18T10:00:00.000Z", source: "manual" });
  await api.todos.update({ id: 5, done: true });
  await api.todos.remove(5);
});

test("api: Codex connect uses the explicit local-auth import endpoint", async () => {
  const fetchImpl = makeFetch(({ url, init }) => {
    assert.equal(parse(url).pathname, "/api/cpwb/settings/auth/codex/connect");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), {});
    return jsonResponse(200, { provider: "openai-codex", configured: true, source: "credentials", activation: "next-request" });
  });
  const result = await createCpwbApi({ fetchImpl }).settings.connectCodex();
  assert.equal(result.configured, true);
});

test("api: automation prompts use the Workbench settings endpoint", async () => {
  const fetchImpl = makeFetch(({ url, init }, index) => {
    assert.equal(parse(url).pathname, "/api/cpwb/settings/automation-prompts");
    if (index === 0) return jsonResponse(200, { summaryPrompt: "Summary", todoPrompt: "Todo" });
    assert.equal(init.method, "PATCH");
    assert.deepEqual(JSON.parse(init.body), { summaryPrompt: "New summary", todoPrompt: "New todo" });
    return jsonResponse(200, { summaryPrompt: "New summary", todoPrompt: "New todo" });
  });
  const api = createCpwbApi({ fetchImpl });
  assert.equal((await api.settings.automationPrompts()).summaryPrompt, "Summary");
  assert.equal((await api.settings.updateAutomationPrompts({ summaryPrompt: "New summary", todoPrompt: "New todo" })).todoPrompt, "New todo");
});

test("api: schedules create/update/delete/run/history use the modal contract", async () => {
  const fetchImpl = makeFetch(({ url, init }, i) => {
    const { pathname } = parse(url);
    if (i === 0) {
      assert.equal(pathname, "/api/cpwb/schedules");
      assert.equal(init.method, "POST");
      assert.deepEqual(JSON.parse(init.body), { projectId: 1, name: "s", recurrence: "daily", startsAt: "2026-08-24T13:00:00.000Z" });
      return jsonResponse(201, { id: 6, projectId: 1, name: "s", recurrence: "daily", startsAt: "2026-08-24T13:00:00.000Z", rule: "daily 21:00", enabled: true });
    }
    if (i === 1) {
      assert.equal(pathname, "/api/cpwb/schedules");
      assert.equal(init.method, "PATCH");
      assert.deepEqual(JSON.parse(init.body), { id: 6, enabled: false });
      return jsonResponse(200, { id: 6, enabled: false });
    }
    if (i === 2) {
      assert.equal(pathname, "/api/cpwb/schedules/6");
      assert.equal(init.method, "DELETE");
      return jsonResponse(200, { removed: true, id: 6 });
    }
    if (i === 3) {
      assert.equal(pathname, "/api/cpwb/schedules/6/run");
      assert.equal(init.method, "POST");
      return jsonResponse(200, { ok: true });
    }
    assert.equal(pathname, "/api/cpwb/schedules/6/runs");
    assert.equal(init.method, "GET");
    return jsonResponse(200, [{ status: "failed", sessionId: "sess", error: "boom" }]);
  });
  const api = createCpwbApi({ fetchImpl });
  await api.schedules.create({ projectId: 1, name: "s", recurrence: "daily", startsAt: "2026-08-24T13:00:00.000Z" });
  await api.schedules.update({ id: 6, enabled: false });
  await api.schedules.remove(6);
  await api.schedules.run(6);
  assert.deepEqual(await api.schedules.runs(6), [{ status: "failed", sessionId: "sess", error: "boom" }]);
});

test("api: summaries list/run/delete paths", async () => {
  const fetchImpl = makeFetch(({ url, init }, i) => {
    const { pathname } = parse(url);
    if (i === 0) {
      assert.equal(pathname, "/api/cpwb/summaries");
      return jsonResponse(200, []);
    }
    if (i === 1) {
      assert.equal(pathname, "/api/cpwb/summaries/run");
      assert.deepEqual(JSON.parse(init.body), { projectId: 1 });
      return jsonResponse(200, { ok: true });
    }
    if (i === 2) {
      assert.equal(pathname, "/api/cpwb/summaries/9");
      assert.equal(init.method, "DELETE");
      return jsonResponse(200, { removed: true, id: 9 });
    }
    throw new Error("unexpected request " + pathname);
  });
  const api = createCpwbApi({ fetchImpl });
  await api.summaries.list({ projectId: 1 });
  await api.summaries.run({ projectId: 1 });
  await api.summaries.remove(9);
});

test("store: deleting a summary refreshes the active project's summary list", async () => {
  let summaries = [{ id: 9, projectId: 1, summaryDate: "2026-08-22", status: "completed", content: "old" }];
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/summaries/9" && method === "DELETE") {
      summaries = [];
      return jsonResponse(200, { removed: true, id: 9 });
    }
    if (pathname === "/api/cpwb/todos" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/schedules" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/summaries" && method === "GET") return jsonResponse(200, summaries);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "not found" } });
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));
  await store.actions.refreshProject(1, "2026-08-22");
  await store.actions.deleteSummary({ id: 9, projectId: 1 });

  assert.deepEqual(store.getSnapshot().summaries, []);
  assert.equal(store.getSnapshot().action.type, "deleteSummary");
  assert.equal(store.getSnapshot().action.status, "done");
});

test("store: a failed summary generation refreshes the failed row and keeps the action error visible", async () => {
  const failedSummary = { id: 9, projectId: 1, summaryDate: "2026-08-22", status: "failed", content: null };
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/summaries/run" && method === "POST") {
      return jsonResponse(502, { error: { code: "SUMMARY_GENERATION_FAILED", message: "每日总结生成失败，请重试" } });
    }
    if (pathname === "/api/cpwb/todos" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/schedules" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/summaries" && method === "GET") return jsonResponse(200, [failedSummary]);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "not found" } });
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));

  await assert.rejects(
    () => store.actions.runSummary({ projectId: 1, summaryDate: "2026-08-22" }),
    /每日总结生成失败/,
  );

  assert.deepEqual(store.getSnapshot().summaries, [failedSummary]);
  assert.equal(store.getSnapshot().action.type, "runSummary");
  assert.equal(store.getSnapshot().action.status, "error");
  assert.equal(store.getSnapshot().action.error.code, "SUMMARY_GENERATION_FAILED");
});

test("store: a failed schedule run refreshes its diagnostic session and keeps the action error visible", async () => {
  const schedule = { id: 6, projectId: 1, name: "夜间接口审计", enabled: true, sessionId: "session-schedule-6" };
  const diagnosticSession = {
    sessionId: "session-schedule-6",
    title: "夜间接口审计",
    sessionType: "schedule",
    scheduleName: "夜间接口审计",
    scope: { kind: "project", id: 1 },
  };
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/schedules/6/run" && method === "POST") {
      return jsonResponse(502, { error: { code: "SCHEDULE_RUN_FAILED", message: "定时任务执行失败" } });
    }
    if (pathname === "/api/cpwb/todos" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/schedules" && method === "GET") return jsonResponse(200, [schedule]);
    if (pathname === "/api/cpwb/schedules/6/runs" && method === "GET") {
      return jsonResponse(200, [{ status: "failed", sessionId: diagnosticSession.sessionId, error: "agent failed" }]);
    }
    if (pathname === "/api/cpwb/summaries" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/chat/sessions" && method === "GET") {
      return jsonResponse(200, { items: [diagnosticSession], total: 1, limit: 20, offset: 0 });
    }
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "not found" } });
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));
  await store.actions.refreshProject(1, "2026-08-25");

  await assert.rejects(
    () => store.actions.runSchedule(6),
    /定时任务执行失败/,
  );

  assert.deepEqual(store.getSnapshot().recentSessions, [diagnosticSession]);
  assert.equal(store.getSnapshot().scheduleRuns["6"][0].sessionId, diagnosticSession.sessionId);
  assert.equal(store.getSnapshot().action.type, "runSchedule");
  assert.equal(store.getSnapshot().action.status, "error");
  assert.equal(store.getSnapshot().action.error.code, "SCHEDULE_RUN_FAILED");
});

test("api: non-ok JSON error envelope becomes Error with code/status", async () => {
  const fetchImpl = makeFetch(() => jsonResponse(422, { error: { code: "INVALID_FIELD", message: "bad field" } }));
  const api = createCpwbApi({ fetchImpl });
  await assert.rejects(
    () => api.projects.create({ name: "x" }),
    (err) => {
      assert.ok(err instanceof CpwbApiError);
      assert.equal(err.code, "INVALID_FIELD");
      assert.equal(err.status, 422);
      assert.equal(err.message, "bad field");
      return true;
    },
  );
});

test("api: non-JSON non-ok response still yields a status-bearing error", async () => {
  const fetchImpl = makeFetch(() => ({
    ok: false,
    status: 500,
    json: async () => { throw new Error("not json"); },
    text: async () => "boom",
  }));
  const api = createCpwbApi({ fetchImpl });
  await assert.rejects(
    () => api.health(),
    (err) => err.status === 500 && err.code === "HTTP_500",
  );
});

test("api: pre-aborted signal rejects with ABORTED before fetch", async () => {
  const ac = new AbortController();
  ac.abort();
  let called = false;
  const fetchImpl = makeFetch(() => { called = true; return jsonResponse(200, {}); });
  const api = createCpwbApi({ fetchImpl });
  await assert.rejects(
    () => api.health({ signal: ac.signal }),
    (err) => err.code === "ABORTED",
  );
  assert.equal(called, false);
});

test("api: transport failure maps to NETWORK_ERROR with status 0", async () => {
  const fetchImpl = makeFetch(() => { throw new Error("socket hang up"); });
  const api = createCpwbApi({ fetchImpl });
  await assert.rejects(
    () => api.health(),
    (err) => err.code === "NETWORK_ERROR" && err.status === 0,
  );
});

test("api: cpwbApi is a ready singleton", () => {
  assert.ok(cpwbApi);
  assert.equal(typeof cpwbApi.health, "function");
  assert.equal(typeof cpwbApi.documents.upload, "function");
});

// ---------------------------------------------------------------- store

/** Build a mock fetch that serves a full refresh + project refresh. */
function scenarioFetch(overrides = {}) {
  let failLeft = overrides.failOnce ? 1 : 0;
  return makeFetch(({ url, init }) => {
    const { pathname, searchParams } = parse(url);
    const method = init.method ?? "GET";
    if (failLeft > 0) {
      failLeft -= 1;
      return jsonResponse(500, { error: { code: "INTERNAL_ERROR", message: "boom" } });
    }
    if (pathname === "/api/cpwb/health") return jsonResponse(200, overrides.health ?? { ok: true, reachable: true, embedding: { model: "e", present: true, dimensions: 1024, usable: true } });
    if (pathname === "/api/cpwb/projects" && method === "GET") return jsonResponse(200, overrides.projects ?? [project]);
    if (pathname === "/api/cpwb/projects" && method === "POST") return jsonResponse(201, overrides.createdProject ?? project);
    if (pathname === "/api/cpwb/knowledge-bases" && method === "GET") return jsonResponse(200, overrides.kbs ?? [kb]);
    if (pathname === "/api/cpwb/knowledge-bases" && method === "POST") return jsonResponse(201, kb);
    if (pathname === "/api/cpwb/documents" && method === "GET") return jsonResponse(200, overrides.docs ?? [doc]);
    if (pathname === "/api/cpwb/todos" && method === "GET") return jsonResponse(200, overrides.todos ?? [todo]);
    if (pathname === "/api/cpwb/todos" && method === "POST") return jsonResponse(201, overrides.createdTodo ?? { ...todo, id: 99, title: "new" });
    if (pathname.match(/^\/api\/cpwb\/schedules\/\d+\/runs$/) && method === "GET") {
      const id = pathname.split("/")[4];
      return jsonResponse(200, overrides.scheduleRuns?.[id] ?? []);
    }
    if (pathname === "/api/cpwb/schedules" && method === "GET") return jsonResponse(200, overrides.schedules ?? []);
    if (pathname === "/api/cpwb/summaries" && method === "GET") return jsonResponse(200, overrides.summaries ?? []);
    if (pathname === "/api/cpwb/projects/1/knowledge-bases" && method === "GET") return jsonResponse(200, overrides.linkedKbs ?? [kb]);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "not found" } });
  });
}

test("store: refresh pulls health/projects/knowledgeBases/documents and reaches ready", async () => {
  const fetchImpl = scenarioFetch();
  const api = createCpwbApi({ fetchImpl });
  const store = createWorkbenchStore(api);
  await store.actions.refresh();
  const s = store.getSnapshot();
  assert.equal(s.phase, "ready");
  assert.equal(s.projects.length, 1);
  assert.equal(s.knowledgeBases.length, 1);
  assert.equal(s.documents.length, 1);
  assert.equal(s.health.reachable, true);
  assert.equal(s.error, null);
  assert.equal(s.citations.length, 0);
  const recentRequest = fetchImpl.calls.find(({ url }) => parse(url).pathname === "/api/cpwb/chat/sessions");
  assert.equal(parse(recentRequest.url).searchParams.get("limit"), "20");
});

test("api and store keep purge state across a temporary status disconnect", async () => {
  let reads = 0;
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    if (pathname === "/api/cpwb/maintenance/purge-jobs" && init.method === "POST") {
      return jsonResponse(202, {
        jobId: "purge-client",
        state: "queued",
        revision: 1,
        recoveryCommand: "dsh-workbench web",
      });
    }
    if (pathname === "/api/cpwb/maintenance/purge-jobs/purge-client") {
      reads += 1;
      if (reads === 1) throw new Error("fetch failed");
      return jsonResponse(200, {
        jobId: "purge-client",
        state: "restarting",
        revision: 5,
      });
    }
    throw new Error("unexpected request: " + pathname);
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));

  await store.actions.startContainerPurge({
    kind: "project",
    id: 4,
    planVersion: "plan-hash",
    confirmation: "Research",
    restartConfirmed: true,
  });
  await store.actions.refreshPurgeJob("purge-client");
  assert.equal(store.getSnapshot().maintenanceJob.jobId, "purge-client");
  assert.equal(store.getSnapshot().maintenanceJob.state, "queued");
  assert.equal(store.getSnapshot().maintenanceJob.disconnected, true);
  await store.actions.refreshPurgeJob("purge-client");
  assert.equal(store.getSnapshot().maintenanceJob.state, "restarting");
  assert.equal(store.getSnapshot().maintenanceJob.disconnected, false);
});

test("store: automation prompt settings load and update the visible snapshot", async () => {
  let prompts = { summaryPrompt: "Summary", todoPrompt: "Todo" };
  const api = {
    health: async () => ({ ok: true }),
    settings: {
      automationPrompts: async () => prompts,
      updateAutomationPrompts: async (next) => { prompts = next; return prompts; },
    },
  };
  const store = createWorkbenchStore(api);
  await store.actions.loadSettings();
  assert.deepEqual(store.getSnapshot().settings.automationPrompts, prompts);
  await store.actions.updateAutomationPrompts({ summaryPrompt: "New summary", todoPrompt: "New todo" });
  assert.deepEqual(store.getSnapshot().settings.automationPrompts, { summaryPrompt: "New summary", todoPrompt: "New todo" });
});

test("store: refresh failure reaches error phase with code/message", async () => {
  const api = createCpwbApi({ fetchImpl: scenarioFetch({ failOnce: true }) });
  const store = createWorkbenchStore(api);
  await store.actions.refresh();
  const s = store.getSnapshot();
  assert.equal(s.phase, "error");
  assert.equal(s.error.code, "INTERNAL_ERROR");
});

test("store: retry recovers from error to ready", async () => {
  const api = createCpwbApi({ fetchImpl: scenarioFetch({ failOnce: true }) });
  const store = createWorkbenchStore(api);
  await store.actions.refresh();
  assert.equal(store.getSnapshot().phase, "error");
  await store.actions.retry();
  assert.equal(store.getSnapshot().phase, "ready");
});

test("store: refreshProject pulls todos/schedules/summaries", async () => {
  const api = createCpwbApi({ fetchImpl: scenarioFetch({
    schedules: [{ id: 2, projectId: 1, name: "nightly", rule: "daily 21:00", enabled: true }],
    scheduleRuns: { 2: [{ id: 8, status: "failed", sessionId: "session-failed", error: "provider unavailable" }] },
  }) });
  const store = createWorkbenchStore(api);
  await store.actions.refreshProject(1, "2026-08-17");
  const s = store.getSnapshot();
  assert.equal(s.activeProjectId, 1);
  assert.equal(s.todos.length, 1);
  assert.ok(Array.isArray(s.schedules));
  assert.ok(Array.isArray(s.summaries));
  assert.deepEqual(s.scheduleRuns["2"], [{ id: 8, status: "failed", sessionId: "session-failed", error: "provider unavailable" }]);
});

test("store: createTodo mutates then re-fetches todos", async () => {
  const overrides = { todos: [todo] };
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/todos" && method === "POST") {
      return jsonResponse(201, { ...todo, id: 99, title: "new" });
    }
    if (pathname === "/api/cpwb/todos" && method === "GET") {
      return jsonResponse(200, overrides.todos);
    }
    if (pathname === "/api/cpwb/schedules" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/summaries" && method === "GET") return jsonResponse(200, []);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "nf" } });
  });
  const api = createCpwbApi({ fetchImpl });
  const store = createWorkbenchStore(api);
  // After the POST succeeds, the refetch must return two todos.
  overrides.todos = [todo, { ...todo, id: 99, title: "new" }];
  await store.actions.createTodo({ projectId: 1, title: "new", dueAt: "2026-08-18T10:00:00.000Z", source: "manual" });
  const s = store.getSnapshot();
  assert.equal(s.todos.length, 2);
});

test("store: deleteTodo deletes then re-fetches the active project todos", async () => {
  let rows = [todo];
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/todos/5" && method === "DELETE") {
      rows = [];
      return jsonResponse(200, { removed: true, todoId: 5 });
    }
    if (pathname === "/api/cpwb/todos" && method === "GET") return jsonResponse(200, rows);
    if (pathname === "/api/cpwb/schedules" && method === "GET") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/summaries" && method === "GET") return jsonResponse(200, []);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "nf" } });
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));
  await store.actions.refreshProject(1, "2026-08-23");
  await store.actions.deleteTodo(5);
  assert.deepEqual(store.getSnapshot().todos, []);
});

test("store: project rename/delete refresh the authoritative project list", async () => {
  let rows = [project];
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/projects/1" && method === "PATCH") {
      rows = [{ ...project, name: JSON.parse(init.body).name }];
      return jsonResponse(200, rows[0]);
    }
    if (pathname === "/api/cpwb/projects/1" && method === "DELETE") {
      assert.equal(parse(url).searchParams.get("sessionPolicy"), "detach");
      rows = [];
      return jsonResponse(200, { removed: true, projectId: 1, sessionPolicy: "detach", detachedSessionCount: 0, deletedSessionCount: 0, orphanDocumentIds: [] });
    }
    if (pathname === "/api/cpwb/projects" && method === "GET") return jsonResponse(200, rows);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "not found" } });
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));
  await store.actions.renameProject({ id: 1, name: "Renamed" });
  assert.equal(store.getSnapshot().projects[0].name, "Renamed");
  await store.actions.deleteProject({ id: 1, sessionPolicy: "detach" });
  assert.deepEqual(store.getSnapshot().projects, []);
});

test("store: linking a knowledge base refreshes both project links and knowledge cards", async () => {
  const linkedKnowledgeBase = {
    ...kb,
    linkedProjects: [{ ...project, sessionCount: 0 }],
    overview: { linkedProjectCount: 1 },
  };
  const fetchImpl = makeFetch(({ url, init }) => {
    const { pathname } = parse(url);
    const method = init.method ?? "GET";
    if (pathname === "/api/cpwb/projects/1/knowledge-bases/2" && method === "POST") {
      return jsonResponse(201, { projectId: 1, knowledgeBaseId: 2 });
    }
    if (pathname === "/api/cpwb/projects/1/knowledge-bases" && method === "GET") {
      return jsonResponse(200, [linkedKnowledgeBase]);
    }
    if (pathname === "/api/cpwb/knowledge-bases" && method === "GET") {
      return jsonResponse(200, [linkedKnowledgeBase]);
    }
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "not found" } });
  });
  const store = createWorkbenchStore(createCpwbApi({ fetchImpl }));

  await store.actions.linkProjectKnowledgeBase(1, 2);

  assert.equal(store.getSnapshot().linkedKnowledgeBases[0].id, 2);
  assert.equal(store.getSnapshot().knowledgeBases[0].overview.linkedProjectCount, 1);
  assert.deepEqual(
    fetchImpl.calls.map(({ url, init }) => [parse(url).pathname, init.method ?? "GET"]),
    [
      ["/api/cpwb/projects/1/knowledge-bases/2", "POST"],
      ["/api/cpwb/projects/1/knowledge-bases", "GET"],
      ["/api/cpwb/knowledge-bases", "GET"],
    ],
  );
});

test("store: stale refresh response never overwrites a newer refresh", async () => {
  let generation = 1;
  const pending = [];
  const fetchImpl = makeFetch(({ url }) => {
    const gen = generation;
    if (gen === 1) {
      return new Promise((resolve) => pending.push({ url, resolve }));
    }
    const { pathname } = parse(url);
    if (pathname === "/api/cpwb/health") return jsonResponse(200, { ok: true, reachable: true, embedding: { model: "e", present: true, dimensions: 1024, usable: true } });
    if (pathname === "/api/cpwb/projects") return jsonResponse(200, [{ ...project, name: "new-project" }]);
    if (pathname === "/api/cpwb/knowledge-bases") return jsonResponse(200, []);
    if (pathname === "/api/cpwb/documents") return jsonResponse(200, []);
    return jsonResponse(404, { error: { code: "NOT_FOUND", message: "nf" } });
  });
  const api = createCpwbApi({ fetchImpl });
  const store = createWorkbenchStore(api);
  const p1 = store.actions.refresh(); // slow
  generation = 2;
  const p2 = store.actions.refresh(); // fast "new"
  await p2;
  // resolve the slow first refresh with "old" data
  for (const { url, resolve } of pending) {
    const { pathname } = parse(url);
    if (pathname === "/api/cpwb/health") resolve(jsonResponse(200, { ok: true, reachable: true, embedding: { model: "e", present: true, dimensions: 1024, usable: true } }));
    else if (pathname === "/api/cpwb/projects") resolve(jsonResponse(200, [{ ...project, name: "old-project" }]));
    else if (pathname === "/api/cpwb/knowledge-bases") resolve(jsonResponse(200, []));
    else resolve(jsonResponse(200, []));
  }
  await p1;
  const s = store.getSnapshot();
  assert.equal(s.phase, "ready");
  assert.equal(s.projects[0].name, "new-project");
});

test("store: dispose aborts in-flight refresh", async () => {
  let sawAborted = false;
  const fetchImpl = makeFetch(({ url, init }) => {
    return new Promise((_resolve, reject) => {
      if (init.signal) {
        init.signal.addEventListener("abort", () => { sawAborted = true; reject(new DOMException("aborted", "AbortError")); });
      }
    });
  });
  const api = createCpwbApi({ fetchImpl });
  const store = createWorkbenchStore(api);
  const p = store.actions.refresh();
  store.dispose();
  await p; // should not reject (abort is swallowed by stale/aborted guard)
  assert.equal(sawAborted, true);
  // after dispose, snapshot stays in loading (no further writes)
  assert.equal(store.getSnapshot().phase, "loading");
});

test("localDateKey produces local YYYY-MM-DD", () => {
  const d = new Date(2026, 7, 17, 3, 0, 0); // Aug 17 2026 local
  assert.equal(localDateKey(d), "2026-08-17");
});

// ------------------------------------------------------- document polling helper

test("needsDocumentPolling: false without a selected knowledge base", () => {
  const docs = [{ id: 1, status: "uploading" }];
  assert.equal(needsDocumentPolling(docs, null), false);
  assert.equal(needsDocumentPolling(docs, undefined), false);
  assert.equal(needsDocumentPolling(docs, ""), false);
});

test("needsDocumentPolling: true when selected doc is uploading/parsing/embedding", () => {
  assert.equal(needsDocumentPolling([{ id: 1, status: "uploading" }], "kb1"), true);
  assert.equal(needsDocumentPolling([{ id: 1, status: "parsing" }], "kb1"), true);
  assert.equal(needsDocumentPolling([{ id: 1, status: "embedding" }], "kb1"), true);
});

test("needsDocumentPolling: false for ready/failed/stale and queued is never a DB status", () => {
  assert.equal(needsDocumentPolling([{ id: 1, status: "ready" }], "kb1"), false);
  assert.equal(needsDocumentPolling([{ id: 1, status: "failed" }], "kb1"), false);
  assert.equal(needsDocumentPolling([{ id: 1, status: "stale" }], "kb1"), false);
  assert.equal(needsDocumentPolling([{ id: 1, status: "queued" }], "kb1"), false);
});

test("needsDocumentPolling: false for empty / missing document lists", () => {
  assert.equal(needsDocumentPolling([], "kb1"), false);
  assert.equal(needsDocumentPolling(undefined, "kb1"), false);
  assert.equal(needsDocumentPolling(null, "kb1"), false);
  assert.equal(needsDocumentPolling("not-an-array", "kb1"), false);
});

test("needsDocumentPolling: only in-flight statuses among mixed documents count", () => {
  const docs = [
    { id: 1, status: "ready" },
    { id: 2, status: "queued" },
    { id: 3, status: "failed" },
    { id: 4, status: "embedding" },
  ];
  assert.equal(needsDocumentPolling(docs, "kb1"), true);
});
