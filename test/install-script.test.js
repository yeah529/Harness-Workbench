import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const installScript = resolve(repoRoot, "scripts/install.sh");

test("install script repoints an existing plugin symlink to the current checkout", (t) => {
  const home = mkdtempSync(resolve(tmpdir(), "cpwb-install-"));
  const profileModules = resolve(home, "profiles/web/node_modules");
  const oldCheckout = resolve(home, "old-checkout");
  const pluginLink = resolve(profileModules, "dsh-cyberpunk-workbench");

  t.after(() => rmSync(home, { recursive: true, force: true }));
  mkdirSync(profileModules, { recursive: true });
  mkdirSync(oldCheckout);
  symlinkSync(oldCheckout, pluginLink);

  execFileSync("bash", [installScript], {
    env: { ...process.env, DSH_HOME: home },
    stdio: "pipe",
  });

  assert.equal(readlinkSync(pluginLink), repoRoot);
});
