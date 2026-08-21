import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const libDir = resolve(root, "lib");

async function main() {
  await mkdir(libDir, { recursive: true });

  // Host half: bundle Node ESM source into lib/index.js.
  await build({
    entryPoints: [resolve(root, "src/host/index.js")],
    outfile: resolve(libDir, "index.js"),
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    sourcemap: false,
    logLevel: "info",
    // Keep every runtime dependency external so the host bundle stays small and
    // never wrongly inlines a transitive package (e.g. apache-arrow). Native
    // bindings (LanceDB) also resolve from node_modules at runtime this way.
    packages: "external",
  });

  // Client half: bundle with React externalized into CommonJS, then wrap it in
  // the DSH ModuleLoader bootstrap so it registers under the expected id.
  const client = await build({
    entryPoints: [resolve(root, "src/client/index.js")],
    bundle: true,
    platform: "browser",
    format: "cjs",
    target: "es2020",
    external: ["react"],
    loader: { ".css": "text", ".svg": "text" },
    sourcemap: false,
    write: false,
    logLevel: "info",
  });
  const body = client.outputFiles[0].text;
  const wrapped = [
    'window.__ModuleLoader__.load({',
    '	id: "dsh-cyberpunk-workbench",',
    '	factory(require) {',
    '		const module = { exports: {} };',
    '		const exports = module.exports;',
    body,
    '		return module.exports;',
    '	},',
    '});',
    '',
  ].join("\n");
  await writeFile(resolve(libDir, "client.js"), wrapped);

  // Verify the built host entry actually resolves its external dependencies
  // from node_modules at runtime (guards against accidental inlining that would
  // both bloat the bundle and break transitive/native resolution).
  await import(pathToFileURL(resolve(libDir, "index.js")).href);
  console.log("host bundle external deps resolve OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
