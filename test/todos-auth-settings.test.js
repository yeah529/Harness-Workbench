import { test } from "node:test";
import assert from "node:assert/strict";
import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import { createTempDir, removeTempDir } from "./helpers.js";
import { createWorkbenchSettings } from "../src/host/settings.js";
import { createEmbeddingAdapter, embeddingIdentity } from "../src/host/embedding.js";
import { loadCodexAccessToken, buildChildEnv } from "../src/launcher/auth.js";
import { launchDsh } from "../src/launcher/process.js";
import { sanitizeProxyUrl } from "../src/launcher/proxy.js";

test("todos replace tasks and plans with due_at and stable overdue ordering", async () => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const project = repos.projects.create({ name: "demo" });
  assert.equal(repos.todos, repos.todos);
  const overdue = repos.todos.create({ projectId: project.id, title: "overdue", dueAt: "2026-08-19T18:00:00.000+08:00" });
  const soon = repos.todos.create({ projectId: project.id, title: "soon", dueAt: "2026-08-20T18:00:00.000+08:00" });
  const done = repos.todos.create({ projectId: project.id, title: "done", dueAt: "2026-08-18T18:00:00.000+08:00" });
  repos.todos.update({ id: done.id, done: true });
  const list = repos.todos.list({ projectId: project.id, now: new Date("2026-08-20T19:00:00+08:00") });
  assert.deepEqual(list.map((item) => item.title), ["overdue", "soon", "done"]);
  assert.equal(list[0].overdue, true);
  assert.equal(list[2].completedAt != null, true);
  assert.throws(() => db.prepare("SELECT * FROM tasks").all(), /no such table/i);
  assert.throws(() => db.prepare("SELECT * FROM plans").all(), /no such table/i);
  assert.throws(() => repos.todos.create({ projectId: project.id, title: "bad", dueAt: "2026-08-20T18:00:00Z", source: "imported" }), /source/i);
  closeDatabase(db);
  await removeTempDir(dataDir);
});

test("workbench settings initialize once and strips credential material at every depth", async () => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const sentinel = "SENTINEL_SETTING_SECRET";
  const settings = createWorkbenchSettings({ repos, dshInitial: { embedding: { model: "init-model", apiKey: sentinel, nested: { authorization: sentinel } }, timezone: "Asia/Shanghai", token: sentinel } });
  assert.equal(settings.get("timezone"), "Asia/Shanghai");
  assert.equal(settings.get("embedding").model, "init-model");
  settings.set("embedding", { provider: "ollama", model: "qwen3-embedding:0.6b", apiKey: sentinel, nested: { password: sentinel, safe: "ok" } });
  assert.equal(settings.get("embedding").model, "qwen3-embedding:0.6b");
  const reopened = createWorkbenchSettings({ repos, dshInitial: { embedding: { model: "must-not-win" } } });
  assert.equal(reopened.get("embedding").model, "qwen3-embedding:0.6b");
  const raw = db.prepare("SELECT value FROM workbench_settings").all();
  assert.equal(JSON.stringify(raw).includes(sentinel), false);
  closeDatabase(db);
  await removeTempDir(dataDir);
});

test("automation prompts have editable defaults and persist user changes", async () => {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const settings = createWorkbenchSettings({ repos });
  const defaults = settings.get("automationPrompts");
  assert.match(defaults.summaryPrompt, /最终中文总结正文/);
  assert.match(defaults.todoPrompt, /逐行清单/);

  settings.set("automationPrompts", {
    summaryPrompt: "CUSTOM SUMMARY {{projectId}} {{date}}",
    todoPrompt: "CUSTOM TODO {{projectId}} {{date}} {{nextDate}}",
  });
  const reopened = createWorkbenchSettings({ repos });
  assert.deepEqual(reopened.get("automationPrompts"), {
    summaryPrompt: "CUSTOM SUMMARY {{projectId}} {{date}}",
    todoPrompt: "CUSTOM TODO {{projectId}} {{date}} {{nextDate}}",
  });
  closeDatabase(db);
  await removeTempDir(dataDir);
});

test("embedding factory exposes ollama and openai-compatible identity", () => {
  const ollama = createEmbeddingAdapter({ provider: "ollama", baseUrl: "http://127.0.0.1:11434", model: "qwen3-embedding:0.6b", dimensions: 1024, fetchImpl: async () => ({ ok: true, json: async () => ({ embedding: [1, 2] }) }) });
  assert.deepEqual(ollama.identity(), { provider: "ollama", endpoint: "http://127.0.0.1:11434", model: "qwen3-embedding:0.6b", dimensions: 1024 });
  assert.deepEqual(embeddingIdentity({ provider: "openai-compatible", baseUrl: "https://example.test/v1", model: "embed", dimensions: 3 }), { provider: "openai-compatible", endpoint: "https://example.test/v1", model: "embed", dimensions: 3 });
});

test("openai-compatible embedding uses config.fetchImpl and never sends an undefined bearer", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith("/models")) return { ok: true, json: async () => ({ data: [{ id: "embed" }] }) };
    return { ok: true, json: async () => ({ data: [{ index: 0, embedding: [1, 2, 3] }] }) };
  };
  const adapter = createEmbeddingAdapter({
    provider: "openai-compatible", baseUrl: "https://example.test/v1", model: "embed", dimensions: 3,
    credentialRef: "embedding.apiKey", fetchImpl,
    getCredential: async () => ({ value: "SENTINEL_EMBED_TOKEN" }),
  });
  assert.deepEqual(await adapter.embed(["hello"]), [[1, 2, 3]]);
  assert.deepEqual(await adapter.listModels(), [{ id: "embed", name: "embed", ownedBy: undefined }]);
  assert.equal(calls.every(({ init }) => init.headers.authorization === "Bearer SENTINEL_EMBED_TOKEN"), true);
  assert.equal(calls.some(({ init }) => JSON.stringify(init).includes("Bearer undefined")), false);

  const missing = createEmbeddingAdapter({
    provider: "openai-compatible", baseUrl: "https://example.test/v1", model: "embed", dimensions: 3,
    credentialRef: "missing", fetchImpl,
  });
  await assert.rejects(() => missing.embed(["hello"]), (error) => error.code === "CREDENTIAL_MISSING");
});

test("codex cache is opt-in and token only enters child env", async () => {
  const root = await createTempDir();
  const token = ["codex", "cache", Date.now(), Math.random()].join("-");
  const { writeFile } = await import("node:fs/promises");
  await writeFile(root + "/auth.json", JSON.stringify({ tokens: { access_token: token } }));
  assert.equal(await loadCodexAccessToken({ codexAuth: "disabled", codexHome: root }), undefined);
  assert.equal(await loadCodexAccessToken({ codexAuth: "auto", codexHome: root }), token);
  const env = buildChildEnv({ baseEnv: { PATH: "/bin", CODEX_ACCESS_TOKEN: token }, token });
  assert.equal(env.OPENAI_CODEX_ACCESS_TOKEN, token);
  assert.equal(Object.hasOwn(env, "CODEX_ACCESS_TOKEN"), false);
  assert.equal(JSON.stringify({ error: "codex authentication failed" }).includes(token), false);
  assert.equal(sanitizeProxyUrl("http://user:secret@example.test:8080"), "http://example.test:8080");
  await removeTempDir(root);
});

test("ordinary launcher does not read the Codex cache when bridge mode is disabled", async () => {
  const root = await createTempDir();
  try {
    const result = await launchDsh({ dataDir: root, dshBin: "/usr/bin/true", codexAuth: "disabled", env: { PATH: "/usr/bin:/bin" } });
    assert.equal(result.code, 0);
  } finally {
    await removeTempDir(root);
  }
});
