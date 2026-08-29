import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { openDatabase, closeDatabase } from "../src/host/database.js";
import { createRepositories } from "../src/host/repositories.js";
import {
  MAX_SESSION_FILE_CONTEXT_CODE_POINTS,
  SessionFileError,
  createSessionFileVault,
} from "../src/host/session-files.js";
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
