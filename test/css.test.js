import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function scanCssBraces(source) {
  let depth = 0;
  let line = 1;
  let quote = null;
  let escaped = false;
  let inComment = false;
  const unclosedAt = [];
  const stack = [];

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (char === "\n") line += 1;
    if (inComment) {
      if (char === "*" && next === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }
    if (quote !== null) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "*") {
      inComment = true;
      index += 1;
      continue;
    }
    if (char === "\"" || char === "'") {
      quote = char;
      continue;
    }
    if (char === "{") {
      depth += 1;
      stack.push(line);
    } else if (char === "}") {
      depth -= 1;
      if (stack.length > 0) stack.pop();
      if (depth < 0) return { depth, unclosedAt: [] };
    }
  }
  unclosedAt.push(...stack);
  return { depth, unclosedAt };
}

test("workbench CSS has balanced comment/string-aware braces", () => {
  const filename = fileURLToPath(new URL("../src/client/workbench.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  assert.deepEqual(scanCssBraces(source), { depth: 0, unclosedAt: [] });
});

test("home overlay is column-constrained instead of viewport-fixed", () => {
  const filename = fileURLToPath(new URL("../src/client/workbench.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  const homeRule = source.match(/\.cpwb-home\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(homeRule, /position:\s*absolute/);
  assert.match(homeRule, /inset:\s*0/);
  assert.doesNotMatch(homeRule, /position:\s*fixed/);
});

test("workbench overlay keeps native SettingsRoot callable but hides its duplicate trigger", () => {
  const filename = fileURLToPath(new URL("../src/client/workbench.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  assert.match(source, /\[data-slot="sidebar"\]/);
  assert.match(source, /\[data-slot="sidebar\.settings"\]/);
  const nativeSettingsButton = source.match(/\[data-slot="sidebar\.settings"\]\s*>\s*button\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(nativeSettingsButton, /pointer-events:\s*none/);
  assert.match(nativeSettingsButton, /opacity:\s*0/);
  assert.match(source, /\[data-slot="sidebar\.settings"\]\s*\*\s*\{\s*visibility:\s*visible\s*!important;\s*pointer-events:\s*auto\s*!important;/);
  assert.match(source, /\.cpwb-sidebar-settings\s*\{/);
});

test("native DSH surfaces inherit the Workbench dark Cyberpunk token set", () => {
  const filename = fileURLToPath(new URL("../src/client/theme.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  assert.match(source, /body:has\(\.cpwb-app-shell\)/);
  assert.match(source, /--dsw-alias-bg-base:\s*var\(--cpwb-surface-base\)/);
  assert.match(source, /--dsw-alias-bg-layer-2:\s*var\(--cpwb-surface-raised\)/);
  assert.match(source, /--dsw-specific-input-major:\s*var\(--cpwb-surface-input\)/);
  assert.match(source, /\[role="dialog"\]\[aria-modal="true"\]/);
  assert.match(source, /button\[aria-haspopup="menu"\]/);
  assert.match(source, /button\[aria-pressed="true"\]/);
  assert.match(source, /background:\s*var\(--cpwb-amber\)\s*!important/);
  assert.doesNotMatch(source, /--dsw-alias-bg-(?:base|layer-[123]):\s*(?:#fff|white)\b/i);
});

test("global sidebar keeps recents scrollable while settings and the approved logo stay fixed", () => {
  const filename = fileURLToPath(new URL("../src/client/workbench.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  const sidebar = source.match(/\.cpwb-global-sidebar\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const recents = source.match(/\.cpwb-sidebar-recents\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const footer = source.match(/\.cpwb-sidebar-fixed-footer\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(sidebar, /display:\s*flex/);
  assert.match(sidebar, /flex-direction:\s*column/);
  assert.match(recents, /min-height:\s*0/);
  assert.match(recents, /flex:\s*1/);
  assert.match(footer, /flex:\s*0 0 auto/);

  const logo = fs.readFileSync(fileURLToPath(new URL("../src/client/assets/harness-workbench-logo.svg", import.meta.url)), "utf8");
  assert.match(logo, /viewBox="0 0 190 74"/);
  assert.match(logo, /<title[^>]*>Harness Workbench<\/title>/);
  assert.match(logo, /M43 9h8L37 43h-8zM94 8h7L87 44h-7zM146 8h7l-14 36h-7z/);
  assert.match(logo, /M2 45L28 39M0 49L43 45M159 39L188 31M153 44L190 39/);
});

test("top-layer Workbench dialogs remain interactive above the pointer-isolated shell", () => {
  const filename = fileURLToPath(new URL("../src/client/workbench.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  const shell = source.match(/\.cpwb-app-shell\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const modal = source.match(/\.cpwb-app-shell\s*>\s*\.cpwb-page-modal-host\s*\{([^}]*)\}/)?.[1] ?? "";
  const draft = source.match(/\.cpwb-workbench-stage\s*>\s*\.cpwb-draft-conversation\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(shell, /pointer-events:\s*none/);
  assert.match(modal, /pointer-events:\s*auto/);
  assert.match(draft, /pointer-events:\s*auto/);
});

test("project new-session action centers its plus icon with the label", () => {
  const filename = fileURLToPath(new URL("../src/client/workbench.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  const rule = source.match(/\.cpwb-card-new\s*,\s*\.cpwb-kcard-new\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(rule, /display:\s*inline-flex/);
  assert.match(rule, /align-items:\s*center/);
  assert.match(rule, /gap:\s*\d+px/);
});

test("modal width includes padding so project dialogs fit narrow viewports", () => {
  const filename = fileURLToPath(new URL("../src/client/workbench.css", import.meta.url));
  const source = fs.readFileSync(path.resolve(filename), "utf8");
  assert.match(source, /\.cpwb-modal\s*\{[^}]*box-sizing:\s*border-box[^}]*\}/);
  assert.match(source, /\.cpwb-modal\s*\{[^}]*width:\s*min\(100%,\s*480px\)[^}]*\}/);
});
