import { appendFile, lstat, mkdir, readFile, stat, symlink, unlink, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

const PACKAGE_NAME = "dsh-cyberpunk-workbench";
const PATCH_ROW = "- insert:\n    - id: cyberpunk-workbench\n      name: dsh-cyberpunk-workbench\n";

async function entry(path) {
  try { return await lstat(path); }
  catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function ensurePackage(profile, packageRoot) {
  const modules = join(profile, "node_modules");
  const link = join(modules, PACKAGE_NAME);
  await mkdir(modules, { recursive: true });
  const current = await entry(link);
  if (!current) {
    await symlink(packageRoot, link);
    return;
  }
  if (current.isDirectory()) return;
  if (!current.isSymbolicLink()) throw new Error(`refusing to replace non-directory Workbench profile entry: ${link}`);
  try {
    const target = await stat(link);
    if (target.isDirectory()) return;
    throw new Error(`Workbench profile link does not target a directory: ${link}`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    await unlink(link);
    await symlink(packageRoot, link);
  }
}

async function ensurePatch(profile) {
  const file = join(profile, "cordis.patch.yml");
  const current = await entry(file);
  if (!current) {
    await writeFile(file, PATCH_ROW, "utf8");
    return;
  }
  if (!current.isFile()) throw new Error(`Workbench profile patch is not a file: ${file}`);
  const source = await readFile(file, "utf8");
  const count = (source.match(/name:\s*dsh-cyberpunk-workbench(?:\s|$)/g) || []).length;
  if (count > 1) throw new Error("Workbench profile contains duplicate plugin registrations");
  if (count === 1) return;
  const separator = source.length === 0 ? "" : source.endsWith("\n") ? "\n" : "\n\n";
  await appendFile(file, separator + PATCH_ROW, "utf8");
}

export async function ensureWorkbenchProfile({ packageRoot, env = process.env } = {}) {
  if (typeof packageRoot !== "string" || !isAbsolute(packageRoot)) throw new TypeError("packageRoot must be an absolute path");
  const dshHome = env.DSH_HOME || join(homedir(), ".dsh");
  const profile = resolve(env.DSH_WEB_PROFILE || join(dshHome, "profiles", "web"));
  await mkdir(profile, { recursive: true });
  await ensurePackage(profile, resolve(packageRoot));
  await ensurePatch(profile);
  return { profile };
}
