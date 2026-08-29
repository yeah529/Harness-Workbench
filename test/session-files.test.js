import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import {
  MAX_SESSION_FILE_CONTEXT_CODE_POINTS,
  SessionFileError,
  createSessionFileVault,
} from "../src/host/session-files.js";
import { stripSessionFileReferences } from "../src/shared/sessionFileReferences.js";
import { createTempDir, removeTempDir } from "./helpers.js";

async function fixture(t) {
  const dataDir = await createTempDir();
  const db = openDatabase({ dataDir });
  const repos = createRepositories(db);
  const sessionId = "session-cpwb-file-vault";
  repos.workbenchSessions.create({ sessionId, scope: { kind: "independent", id: null } });
  const vault = createSessionFileVault({ dataDir, repos });
  t.after(async () => {
    closeDatabase(db);
    await removeTempDir(dataDir);
  });
  return { dataDir, repos, sessionId, vault };
}

test("File Vault stores and parses a session file without creating a document", async (t) => {
  const { dataDir, repos, sessionId, vault } = await fixture(t);
  const file = await vault.upload({
    sessionId,
    originalName: "brief.md",
    stream: Readable.from(["# Brief\nDirect context"]),
  });

  assert.equal(file.parseStatus, "ready");
  assert.equal(file.originalName, "brief.md");
  assert.match(file.contextText, /Direct context/);
  assert.equal(repos.documents.list().length, 0);
  assert.deepEqual(vault.list(sessionId).map((item) => item.id), [file.id]);
  assert.equal(
    await readFile(join(dataDir, "session-vault", "files", file.sha256), "utf8"),
    "# Brief\nDirect context",
  );
});

test("File Vault keeps an unparseable original but marks it non-injectable", async (t) => {
  const { sessionId, vault } = await fixture(t);
  const file = await vault.upload({
    sessionId,
    originalName: "binary.txt",
    stream: Readable.from([Buffer.from([0, 1, 2])]),
  });

  assert.equal(file.parseStatus, "failed");
  assert.equal(file.contextText, null);
  await assert.rejects(
    vault.resolveReferences({ sessionId, text: "read @文件/binary.txt" }),
    (error) => error instanceof SessionFileError && error.code === "SESSION_FILE_NOT_READY",
  );
});

test("File Vault resolves only explicit current-session markers and enforces the full-text budget", async (t) => {
  const { repos, sessionId, vault } = await fixture(t);
  const first = repos.sessionFiles.create({
    sessionId,
    sha256: "1".repeat(64),
    originalName: "one.txt",
    size: 3,
    parseStatus: "ready",
    contextText: "ONE",
    contextCodePoints: 3,
  });
  repos.sessionFiles.create({
    sessionId,
    sha256: "2".repeat(64),
    originalName: "two.txt",
    size: 3,
    parseStatus: "ready",
    contextText: "TWO",
    contextCodePoints: 3,
  });

  const resolved = await vault.resolveReferences({ sessionId, text: "read @文件/one.txt only" });
  assert.deepEqual(resolved.files.map((item) => item.id), [first.id]);
  assert.match(resolved.text, /<file_context>/);
  assert.match(resolved.text, /ONE/);
  assert.doesNotMatch(resolved.text, /TWO/);
  assert.match(resolved.text, /untrusted reference data/);

  repos.sessionFiles.create({
    sessionId,
    sha256: "3".repeat(64),
    originalName: "huge.txt",
    size: MAX_SESSION_FILE_CONTEXT_CODE_POINTS + 1,
    parseStatus: "ready",
    contextText: "x".repeat(MAX_SESSION_FILE_CONTEXT_CODE_POINTS + 1),
    contextCodePoints: MAX_SESSION_FILE_CONTEXT_CODE_POINTS + 1,
  });
  await assert.rejects(
    vault.resolveReferences({ sessionId, text: "@文件/huge.txt" }),
    (error) => error instanceof SessionFileError
      && error.code === "SESSION_FILE_CONTEXT_TOO_LARGE"
      && error.message === "引用内容超过 32,000 字符，请减少文件或拆分发送。",
  );
});

test("File Vault resolves one exact delimited filename when names share a prefix", async (t) => {
  const { repos, sessionId, vault } = await fixture(t);
  repos.sessionFiles.create({
    sessionId,
    sha256: "4".repeat(64),
    originalName: "plan.md",
    size: 4,
    parseStatus: "ready",
    contextText: "PLAN",
    contextCodePoints: 4,
  });
  const selected = repos.sessionFiles.create({
    sessionId,
    sha256: "5".repeat(64),
    originalName: "plan.md.txt",
    size: 8,
    parseStatus: "ready",
    contextText: "SELECTED",
    contextCodePoints: 8,
  });

  const prompt = "检查 @文件/plan.md.txt";
  const resolved = await vault.resolveReferences({ sessionId, text: prompt });

  assert.deepEqual(resolved.files.map((file) => file.id), [selected.id]);
  assert.doesNotMatch(resolved.text, />PLAN</);
  assert.match(resolved.text, /SELECTED/);
  assert.equal(stripSessionFileReferences(prompt, repos.sessionFiles.listBySession(sessionId)), "检查");

  const both = await vault.resolveReferences({
    sessionId,
    text: "比较 @文件/plan.md.txt 和 @文件/plan.md ",
  });
  assert.deepEqual(both.files.map((file) => file.originalName), ["plan.md.txt", "plan.md"]);
  assert.equal(
    stripSessionFileReferences(
      "比较 @文件/plan.md.txt 和 @文件/plan.md ",
      repos.sessionFiles.listBySession(sessionId),
    ),
    "比较 和",
  );
});

test("File Vault removes the raw object only after its last metadata reference", async (t) => {
  const { dataDir, repos, sessionId, vault } = await fixture(t);
  const otherSessionId = "session-cpwb-file-vault-other";
  repos.workbenchSessions.create({ sessionId: otherSessionId, scope: { kind: "independent", id: null } });
  const first = await vault.upload({ sessionId, originalName: "same.txt", stream: Readable.from(["same"]) });
  const second = await vault.upload({ sessionId: otherSessionId, originalName: "same.txt", stream: Readable.from(["same"]) });
  const objectPath = join(dataDir, "session-vault", "files", first.sha256);

  await vault.remove(first.id);
  assert.equal(await readFile(objectPath, "utf8"), "same");
  await vault.remove(second.id);
  await assert.rejects(readFile(objectPath), /ENOENT/);
});

test("File Vault maps concurrent duplicate uploads and removes the losing object", async (t) => {
  const { dataDir, repos, sessionId, vault } = await fixture(t);
  const results = await Promise.allSettled([
    vault.upload({ sessionId, originalName: "race.md", stream: Readable.from(["first"]) }),
    vault.upload({ sessionId, originalName: "race.md", stream: Readable.from(["second"]) }),
  ]);

  const fulfilled = results.filter((result) => result.status === "fulfilled");
  const rejected = results.filter((result) => result.status === "rejected");
  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 1);
  assert.equal(rejected[0].reason instanceof SessionFileError, true);
  assert.equal(rejected[0].reason.code, "SESSION_FILE_DUPLICATE_NAME");

  const rows = repos.sessionFiles.listBySession(sessionId);
  assert.equal(rows.length, 1);
  assert.deepEqual(await readdir(join(dataDir, "session-vault", "files")), [rows[0].sha256]);
});

test("File Vault never removes an object claimed by another in-flight upload", async (t) => {
  const { dataDir, repos, sessionId, vault } = await fixture(t);
  const claimantSessionId = "session-cpwb-file-vault-claimant";
  repos.workbenchSessions.create({
    sessionId: claimantSessionId,
    scope: { kind: "independent", id: null },
  });
  const create = repos.sessionFiles.create.bind(repos.sessionFiles);
  let releaseClaimant;
  let markClaimantReached;
  let markFailingReached;
  const claimantGate = new Promise((resolve) => { releaseClaimant = resolve; });
  const claimantReached = new Promise((resolve) => { markClaimantReached = resolve; });
  const failingReached = new Promise((resolve) => { markFailingReached = resolve; });
  repos.sessionFiles.create = (input) => {
    if (input.sessionId === claimantSessionId) {
      markClaimantReached();
      return claimantGate.then(() => create(input));
    }
    if (input.sessionId === sessionId) {
      markFailingReached();
      throw new Error("injected metadata failure");
    }
    return create(input);
  };

  const claimant = vault.upload({
    sessionId: claimantSessionId,
    originalName: "claim.md",
    stream: Readable.from(["shared bytes"]),
  });
  await claimantReached;
  const failing = vault.upload({
    sessionId,
    originalName: "failure.md",
    stream: Readable.from(["shared bytes"]),
  });
  let timer;
  const enteredBeforeClaimant = await Promise.race([
    failingReached.then(() => {
      clearTimeout(timer);
      return true;
    }),
    new Promise((resolve) => { timer = setTimeout(() => resolve(false), 50); }),
  ]);
  if (enteredBeforeClaimant) await assert.rejects(failing, /injected metadata failure/);
  releaseClaimant();

  const claimed = await claimant;
  if (!enteredBeforeClaimant) await assert.rejects(failing, /injected metadata failure/);
  assert.equal(enteredBeforeClaimant, false);
  assert.equal(
    await readFile(join(dataDir, "session-vault", "files", claimed.sha256), "utf8"),
    "shared bytes",
  );
  assert.equal(repos.sessionFiles.countBySha256(claimed.sha256), 1);
});
