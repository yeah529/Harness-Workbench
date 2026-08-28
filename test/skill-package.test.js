import { test } from "node:test";
import assert from "node:assert/strict";
import { lstat, readFile } from "node:fs/promises";
import { join } from "node:path";
import { strToU8, zipSync } from "fflate";
import { createTempDir, removeTempDir } from "./helpers.js";
import {
  SKILL_ERROR_CODES,
  extractSkillArchive,
  parseSkillMarkdown,
} from "../src/host/skill-package.js";

const skillMd = (name = "example-skill") => strToU8(
  `---\nname: ${name}\ndescription: Example description.\n---\n\n# Example\n`,
);

function centralDirectory(bytes) {
  for (let offset = 0; offset + 4 <= bytes.length; offset += 1) {
    if (bytes[offset] === 0x50 && bytes[offset + 1] === 0x4b
      && bytes[offset + 2] === 0x01 && bytes[offset + 3] === 0x02) {
      return offset;
    }
  }
  throw new Error("central directory not found");
}

function patchCentralEntry(bytes, patch) {
  const result = bytes.slice();
  patch(result, centralDirectory(result));
  return result;
}

function symlinkArchive() {
  return patchCentralEntry(zipSync({
    "SKILL.md": skillMd(),
  }), (bytes, offset) => {
    bytes[offset + 5] = 3;
    new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
      .setUint32(offset + 38, 0o120777 << 16, true);
  });
}

function encryptedArchive() {
  return patchCentralEntry(zipSync({
    "SKILL.md": skillMd(),
  }), (bytes, offset) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    view.setUint16(offset + 8, view.getUint16(offset + 8, true) | 1, true);
  });
}

function zip64Archive() {
  return patchCentralEntry(zipSync({
    "SKILL.md": skillMd(),
  }), (bytes, offset) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    view.setUint32(offset + 20, 0xffffffff, true);
  });
}

test("extractSkillArchive accepts one wrapper and returns the frontmatter identity", async (t) => {
  const root = await createTempDir("cpwb-skill-package-");
  t.after(() => removeTempDir(root));
  const bytes = zipSync({
    "wrapper/SKILL.md": skillMd(),
    "wrapper/references/example.md": strToU8("reference"),
  });
  const result = await extractSkillArchive({ archiveBytes: bytes, destination: join(root, "out") });
  assert.deepEqual(result, {
    name: "example-skill",
    description: "Example description.",
    files: ["SKILL.md", "references/example.md"],
    fileCount: 2,
    totalBytes: skillMd().length + 9,
  });
  assert.equal(await readFile(join(root, "out", "references", "example.md"), "utf8"), "reference");
});

test("parseSkillMarkdown requires canonical name and description", () => {
  assert.throws(
    () => parseSkillMarkdown("---\nname: Not Valid\ndescription: x\n---\nbody"),
    (error) => error.code === SKILL_ERROR_CODES.NAME_INVALID,
  );
  assert.throws(
    () => parseSkillMarkdown("---\nname: valid-name\n---\nbody"),
    (error) => error.code === SKILL_ERROR_CODES.PACKAGE_INVALID,
  );
});

test("extractSkillArchive rejects unsafe or ambiguous archives", async (t) => {
  const root = await createTempDir("cpwb-skill-unsafe-");
  t.after(() => removeTempDir(root));
  const cases = [
    ["path traversal", { "../escape": strToU8("x"), "SKILL.md": skillMd() }, SKILL_ERROR_CODES.ARCHIVE_UNSAFE],
    ["multiple skills", { "a/SKILL.md": skillMd("a"), "b/SKILL.md": skillMd("b") }, SKILL_ERROR_CODES.PACKAGE_INVALID],
    ["nested wrapper", { "a/b/SKILL.md": skillMd() }, SKILL_ERROR_CODES.PACKAGE_INVALID],
    ["too many entries", Object.fromEntries(Array.from({ length: 1001 }, (_, i) => [`f-${i}`, strToU8("x")])), SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE],
  ];
  for (const [label, entries, code] of cases) {
    await assert.rejects(
      () => extractSkillArchive({ archiveBytes: zipSync(entries), destination: join(root, label.replaceAll(" ", "-")) }),
      (error) => error.code === code,
      label,
    );
  }
  assert.equal((await lstat(root)).isDirectory(), true);
});

test("extractSkillArchive rejects symlink, encrypted, and ZIP64 entries before writing", async (t) => {
  const root = await createTempDir("cpwb-skill-zip-boundary-");
  t.after(() => removeTempDir(root));
  for (const [label, archiveBytes] of [
    ["symlink", symlinkArchive()],
    ["encrypted", encryptedArchive()],
    ["zip64", zip64Archive()],
  ]) {
    const destination = join(root, label);
    await assert.rejects(
      () => extractSkillArchive({ archiveBytes, destination }),
      (error) => error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
      label,
    );
    await assert.rejects(() => lstat(destination), { code: "ENOENT" }, `${label} destination`);
  }
});

test("extractSkillArchive enforces single-file and expanded-byte limits", async (t) => {
  const root = await createTempDir("cpwb-skill-limits-");
  t.after(() => removeTempDir(root));
  await assert.rejects(
    () => extractSkillArchive({
      archiveBytes: zipSync({ "SKILL.md": skillMd() }),
      destination: join(root, "single"),
      limits: { singleFileBytes: 2 },
    }),
    (error) => error.code === SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE,
  );
  await assert.rejects(
    () => extractSkillArchive({
      archiveBytes: zipSync({ "SKILL.md": skillMd() }),
      destination: join(root, "expanded"),
      limits: { expandedBytes: 3 },
    }),
    (error) => error.code === SKILL_ERROR_CODES.ARCHIVE_TOO_LARGE,
  );
});

