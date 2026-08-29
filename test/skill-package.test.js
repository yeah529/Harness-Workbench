import { test } from "node:test";
import assert from "node:assert/strict";
import { lstat, mkdir, readFile, readdir, realpath, symlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { strToU8, zipSync } from "fflate";
import { createTempDir, removeTempDir } from "./helpers.js";
import {
  SKILL_ERROR_CODES,
  extractSkillArchive,
  extractSkillPackage,
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
  return specialFileArchive(3);
}

function specialFileArchive(operatingSystem) {
  return patchCentralEntry(zipSync({
    "SKILL.md": skillMd(),
  }), (bytes, offset) => {
    bytes[offset + 5] = operatingSystem;
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

function underReportedEntryArchive(declaredSize = null, content = skillMd()) {
  return patchCentralEntry(zipSync({
    "SKILL.md": content,
  }), (bytes, offset) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const actualSize = view.getUint32(offset + 24, true);
    assert.ok(actualSize > 4);
    view.setUint32(offset + 24, declaredSize ?? actualSize - 4, true);
  });
}

function largeSkillMd() {
  const body = Array.from({ length: 30_000 }, (_, index) => `line-${String(index).padStart(5, "0")}-${(index * 2654435761 >>> 0).toString(16)}\n`).join("");
  return strToU8(`---\nname: example-skill\ndescription: Example description.\n---\n${body}`);
}

function insertZip64Records(bytes) {
  let endOffset = -1;
  for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
    if (bytes[offset] === 0x50 && bytes[offset + 1] === 0x4b
      && bytes[offset + 2] === 0x05 && bytes[offset + 3] === 0x06) {
      endOffset = offset;
      break;
    }
  }
  assert.notEqual(endOffset, -1);
  const zip64End = new Uint8Array(56);
  new DataView(zip64End.buffer).setUint32(0, 0x06064b50, true);
  const zip64Locator = new Uint8Array(20);
  new DataView(zip64Locator.buffer).setUint32(0, 0x07064b50, true);
  const result = new Uint8Array(bytes.length + zip64End.length + zip64Locator.length);
  result.set(bytes.subarray(0, endOffset));
  result.set(zip64End, endOffset);
  result.set(zip64Locator, endOffset + zip64End.length);
  result.set(bytes.subarray(endOffset), endOffset + zip64End.length + zip64Locator.length);
  return result;
}

test("extractSkillArchive accepts one wrapper and returns the frontmatter identity", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-package-"));
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

test("extractSkillArchive accepts explicit ZIP directory entries", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-directory-entry-"));
  t.after(() => removeTempDir(root));
  const bytes = zipSync({
    "wrapper/": new Uint8Array(),
    "wrapper/SKILL.md": skillMd(),
  });

  const result = await extractSkillArchive({ archiveBytes: bytes, destination: join(root, "out") });

  assert.deepEqual(result.files, ["SKILL.md"]);
  assert.equal(await readFile(join(root, "out", "SKILL.md"), "utf8"), new TextDecoder().decode(skillMd()));
});

test("extractSkillPackage accepts a wrapped skills collection and materializes each child independently", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-collection-"));
  t.after(() => removeTempDir(root));
  const bytes = zipSync({
    "superpowers/skills/brainstorming/SKILL.md": skillMd("brainstorming"),
    "superpowers/skills/brainstorming/references/notes.md": strToU8("notes"),
    "superpowers/skills/systematic-debugging/SKILL.md": skillMd("systematic-debugging"),
  });

  const result = await extractSkillPackage({ archiveBytes: bytes, destination: join(root, "out") });

  assert.equal(result.kind, "collection");
  assert.equal(result.count, 2);
  assert.deepEqual(result.skills.map(({ name, files, fileCount }) => ({ name, files, fileCount })), [
    { name: "brainstorming", files: ["SKILL.md", "references/notes.md"], fileCount: 2 },
    { name: "systematic-debugging", files: ["SKILL.md"], fileCount: 1 },
  ]);
  assert.equal(await readFile(join(root, "out", "brainstorming", "references", "notes.md"), "utf8"), "notes");
  assert.match(await readFile(join(root, "out", "systematic-debugging", "SKILL.md"), "utf8"), /name: systematic-debugging/);
});

test("extractSkillPackage rejects ambiguous collections and folder-name mismatches before writing", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-collection-invalid-"));
  t.after(() => removeTempDir(root));
  for (const [label, entries] of [
    ["arbitrary multiple roots", { "a/SKILL.md": skillMd("a"), "b/SKILL.md": skillMd("b") }],
    ["outside collection file", { "README.md": strToU8("outside"), "skills/a/SKILL.md": skillMd("a"), "skills/b/SKILL.md": skillMd("b") }],
    ["folder mismatch", { "skills/a/SKILL.md": skillMd("other-a"), "skills/b/SKILL.md": skillMd("b") }],
  ]) {
    const destination = join(root, label.replaceAll(" ", "-"));
    await assert.rejects(
      () => extractSkillPackage({ archiveBytes: zipSync(entries), destination }),
      (error) => error.code === SKILL_ERROR_CODES.PACKAGE_INVALID,
      label,
    );
    await assert.rejects(() => lstat(destination), { code: "ENOENT" }, `${label} destination`);
  }
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
  const root = await realpath(await createTempDir("cpwb-skill-unsafe-"));
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
  const root = await realpath(await createTempDir("cpwb-skill-zip-boundary-"));
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

test("extractSkillArchive rejects central metadata that under-reports decompressed bytes", async (t) => {
  const root = await createTempDir("cpwb-skill-zip-integrity-");
  t.after(() => removeTempDir(root));
  const destination = join(root, "out");
  await assert.rejects(
    () => extractSkillArchive({ archiveBytes: underReportedEntryArchive(), destination }),
    (error) => error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
  );
  await assert.rejects(() => lstat(destination), { code: "ENOENT" });
});

test("extractSkillArchive bounds a low-declared deflate entry before it exceeds small limits", async (t) => {
  const root = await createTempDir("cpwb-skill-zip-bounded-");
  t.after(() => removeTempDir(root));
  await assert.rejects(
    () => extractSkillArchive({
      // The compressed payload spans multiple bounded Inflate pushes.
      archiveBytes: underReportedEntryArchive(8, largeSkillMd()),
      destination: join(root, "out"),
      limits: { singleFileBytes: 8, expandedBytes: 8 },
    }),
    (error) => error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
  );
});

test("extractSkillArchive rejects special file modes even without a Unix creator", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-special-mode-"));
  t.after(() => removeTempDir(root));
  const destination = join(root, "out");
  await assert.rejects(
    () => extractSkillArchive({ archiveBytes: specialFileArchive(0), destination }),
    (error) => error instanceof Error && error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
  );
  await assert.rejects(() => lstat(destination), { code: "ENOENT" });
});

test("extractSkillArchive rejects ZIP64 records even when classic EOCD fields are usable", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-zip64-records-"));
  t.after(() => removeTempDir(root));
  const destination = join(root, "out");
  await assert.rejects(
    () => extractSkillArchive({ archiveBytes: insertZip64Records(zipSync({ "SKILL.md": skillMd() })), destination }),
    (error) => error instanceof Error && error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
  );
  await assert.rejects(() => lstat(destination), { code: "ENOENT" });
});

test("extractSkillArchive rejects destination symlinks without writing through them", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-destination-links-"));
  const outside = await realpath(await createTempDir("cpwb-skill-outside-"));
  t.after(() => Promise.all([removeTempDir(root), removeTempDir(outside)]));
  const archiveBytes = zipSync({ "SKILL.md": skillMd() });
  const destination = join(root, "out");
  await symlink(outside, destination);
  await assert.rejects(
    () => extractSkillArchive({ archiveBytes, destination }),
    (error) => error instanceof Error && error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
  );
  await assert.rejects(() => lstat(join(outside, "SKILL.md")), { code: "ENOENT" });
});

test("extractSkillArchive rejects nested destination symlinks without writing through them", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-nested-link-"));
  const outside = await realpath(await createTempDir("cpwb-skill-nested-outside-"));
  t.after(() => Promise.all([removeTempDir(root), removeTempDir(outside)]));
  const parent = join(root, "parent");
  await mkdir(parent);
  await symlink(outside, join(parent, "link"));
  await mkdir(join(outside, "out"));
  const destination = join(parent, "link", "out");
  await assert.rejects(
    () => extractSkillArchive({ archiveBytes: zipSync({ "SKILL.md": skillMd() }), destination }),
    (error) => error instanceof Error && error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
  );
  await assert.rejects(() => lstat(join(outside, "out", "SKILL.md")), { code: "ENOENT" });
});

test("extractSkillArchive rejects deeper existing destination ancestors through a symlink", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-deep-link-"));
  const outside = await realpath(await createTempDir("cpwb-skill-deep-outside-"));
  t.after(() => Promise.all([removeTempDir(root), removeTempDir(outside)]));
  const parent = join(root, "parent");
  await mkdir(parent);
  await symlink(outside, join(parent, "link"));
  await mkdir(join(outside, "deep", "out"), { recursive: true });
  const destination = join(parent, "link", "deep", "out");
  await assert.rejects(
    () => extractSkillArchive({ archiveBytes: zipSync({ "SKILL.md": skillMd() }), destination }),
    (error) => error instanceof Error && error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
  );
  await assert.rejects(() => lstat(join(outside, "deep", "out", "SKILL.md")), { code: "ENOENT" });
});

test("extractSkillArchive does not trust a symlinked TMPDIR anchor", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-env-link-"));
  const outside = await realpath(await createTempDir("cpwb-skill-env-outside-"));
  t.after(() => Promise.all([removeTempDir(root), removeTempDir(outside)]));
  const target = join(root, "real-temp");
  const linkedTemp = join(root, "tmp-link");
  await mkdir(target);
  await symlink(target, linkedTemp);
  const destination = join(linkedTemp, "anchor", "out");
  const previousTmpDir = process.env.TMPDIR;
  process.env.TMPDIR = linkedTemp;
  try {
    await assert.rejects(
      () => extractSkillArchive({ archiveBytes: zipSync({ "SKILL.md": skillMd() }), destination }),
      (error) => error instanceof Error && error.code === SKILL_ERROR_CODES.ARCHIVE_UNSAFE,
    );
  } finally {
    if (previousTmpDir === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = previousTmpDir;
  }
  await assert.rejects(() => lstat(join(target, "anchor", "out", "SKILL.md")), { code: "ENOENT" });
});

test("extractSkillArchive cleans a failed materialization and maps the I/O error", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-materialize-failure-"));
  t.after(() => removeTempDir(root));
  const destination = join(root, "out");
  await mkdir(destination);
  await mkdir(join(destination, "references"));
  const blockingFile = join(destination, "references", "example.md");
  await writeFile(blockingFile, "existing");
  await assert.rejects(
    () => extractSkillArchive({
      archiveBytes: zipSync({ "SKILL.md": skillMd(), "references/example.md": strToU8("new") }),
      destination,
    }),
    (error) => error instanceof Error
      && error.name === "SkillManagerError"
      && error.code === SKILL_ERROR_CODES.PERMISSION_DENIED,
  );
  assert.equal(await readFile(blockingFile, "utf8"), "existing");
  await assert.rejects(() => lstat(join(destination, "SKILL.md")), { code: "ENOENT" });
  assert.deepEqual(await readdir(root), ["out"]);
});

test("extractSkillArchive enforces single-file and expanded-byte limits", async (t) => {
  const root = await realpath(await createTempDir("cpwb-skill-limits-"));
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
