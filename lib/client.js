window.__ModuleLoader__.load({
	id: "dsh-cyberpunk-workbench",
	factory(require) {
		const module = { exports: {} };
		const exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.js
var index_exports = {};
__export(index_exports, {
  SKILL_IMPORT_ERROR_CODES: () => SKILL_IMPORT_ERROR_CODES,
  SKILL_IMPORT_LIMITS: () => SKILL_IMPORT_LIMITS,
  SkillImportError: () => SkillImportError,
  apply: () => apply,
  getStore: () => getStore,
  inject: () => inject,
  packSkillDirectory: () => packSkillDirectory,
  registerWorkbenchSettingsSection: () => registerWorkbenchSettingsSection2
});
module.exports = __toCommonJS(index_exports);
var import_react48 = __toESM(require("react"), 1);

// src/client/theme.css
var theme_default = ':root {\n  color-scheme: dark;\n  --cpwb-bg: #07090f;\n  --cpwb-surface-base: #07090f;\n  --cpwb-surface-panel: #0c1016;\n  --cpwb-surface-raised: #111720;\n  --cpwb-surface-overlay: #171e28;\n  --cpwb-surface-input: #0a0e14;\n  --cpwb-yellow: #fce700;\n  --cpwb-amber: #ffb51b;\n  --cpwb-cyan: #4de8f4;\n  --cpwb-red: #e64a58;\n  --cpwb-magenta: #ff4965;\n  --cpwb-green: #52d2a5;\n  --cpwb-text: #f1eee6;\n  --cpwb-text-secondary: #aeb8c5;\n  --cpwb-muted: #748296;\n  --cpwb-border: rgba(77, 232, 244, .18);\n  --cpwb-border-strong: rgba(77, 232, 244, .38);\n  --cpwb-amber-soft: rgba(255, 181, 27, .1);\n  --cpwb-cyan-soft: rgba(77, 232, 244, .09);\n  --cpwb-danger-soft: rgba(230, 74, 88, .12);\n  --cpwb-shadow-1: 0 18px 52px rgba(0, 0, 0, .34);\n  --cpwb-shadow-2: 0 30px 90px rgba(0, 0, 0, .58);\n  --cpwb-cut-sm: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);\n  --cpwb-cut-lg: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 14px 100%, 0 calc(100% - 14px));\n  --cpwb-code: "SF Mono", "Roboto Mono", Consolas, monospace;\n}\n\nhtml,\nbody {\n  background-color: var(--cpwb-surface-base);\n  color: var(--cpwb-text);\n}\n\n/* Workbench is a visual skin around the native rc.2 state machine. Override\n   public DSH design tokens, not generated component class names. */\nbody:has(.cpwb-app-shell) {\n  color-scheme: dark;\n  --dsw-alias-bg-base: var(--cpwb-surface-base);\n  --dsw-alias-bg-layer-1: var(--cpwb-surface-panel);\n  --dsw-alias-bg-layer-2: var(--cpwb-surface-raised);\n  --dsw-alias-bg-layer-3: var(--cpwb-surface-overlay);\n  --dsw-alias-bg-mask-1: rgba(1, 3, 7, .78);\n  --dsw-alias-bg-mask-2: rgba(1, 3, 7, .62);\n  --dsw-alias-bg-overlay: #1d2632;\n  --dsw-alias-border-l1: var(--cpwb-border);\n  --dsw-alias-border-l2: rgba(77, 232, 244, .25);\n  --dsw-alias-border-l2-darkmode-thin: rgba(77, 232, 244, .2);\n  --dsw-alias-border-l3: var(--cpwb-border-strong);\n  --dsw-alias-border-l4: rgba(77, 232, 244, .5);\n  --dsw-alias-brand-primary: var(--cpwb-amber);\n  --dsw-alias-brand-primary-invert: #090b10;\n  --dsw-alias-brand-text: var(--cpwb-amber);\n  --dsw-alias-label-primary: var(--cpwb-text);\n  --dsw-alias-label-primary-bluish: var(--cpwb-text);\n  --dsw-alias-label-primary-dimmed: #d4d8de;\n  --dsw-alias-label-secondary: var(--cpwb-text-secondary);\n  --dsw-alias-label-tertiary: var(--cpwb-muted);\n  --dsw-alias-label-caption: #617085;\n  --dsw-alias-label-dimmed: #4d5868;\n  --dsw-alias-button-primary-fill: var(--cpwb-amber);\n  --dsw-alias-button-primary-hover: #ffd05b;\n  --dsw-alias-button-primary-dimmed: #5d4b22;\n  --dsw-alias-button-info-fill: var(--cpwb-cyan);\n  --dsw-alias-button-info-hover: #82f2fa;\n  --dsw-alias-button-elevated-fill: var(--cpwb-surface-overlay);\n  --dsw-alias-button-floating-fill: var(--cpwb-surface-raised);\n  --dsw-alias-button-floating-hover: #1a2632;\n  --dsw-alias-button-ghost-active-border: var(--cpwb-border-strong);\n  --dsw-alias-button-ghost-active-fill: var(--cpwb-cyan-soft);\n  --dsw-alias-button-ghost-active-hover: rgba(77, 232, 244, .14);\n  --dsw-alias-interactive-bg-hover: var(--cpwb-cyan-soft);\n  --dsw-alias-interactive-bg-hover-accent: rgba(77, 232, 244, .15);\n  --dsw-alias-interactive-bg-active: var(--cpwb-amber-soft);\n  --dsw-alias-interactive-bg-hover-solid: #19222d;\n  --dsw-alias-interactive-bg-hover-danger: var(--cpwb-danger-soft);\n  --dsw-alias-state-business-primary: var(--cpwb-cyan);\n  --dsw-alias-state-business-tertiary: rgba(77, 232, 244, .13);\n  --dsw-alias-state-error-primary: #ff7183;\n  --dsw-alias-state-error-secondary: var(--cpwb-red);\n  --dsw-alias-state-success-primary: var(--cpwb-green);\n  --dsw-alias-state-success-secondary: #72dfbb;\n  --dsw-alias-state-success-tertiary: rgba(82, 210, 165, .12);\n  --dsw-alias-state-warn-primary: var(--cpwb-amber);\n  --dsw-alias-state-warn-secondary: #ffd05b;\n  --dsw-alias-state-warn-tertiary: var(--cpwb-amber-soft);\n  --dsw-alias-markdown-code-block: #080c12;\n  --dsw-alias-markdown-code-block-banner: #0d131c;\n  --dsw-alias-markdown-inline-code: #151c26;\n  --dsw-alias-scrollbar-bg-l1: #263140;\n  --dsw-alias-scrollbar-bg-l2: #303d4d;\n  --dsw-alias-scrollbar-hover-l1: var(--cpwb-cyan);\n  --dsw-alias-scrollbar-hover-l2: var(--cpwb-cyan);\n  --dsw-specific-bubble: #121a24;\n  --dsw-specific-bubble-highlight: rgba(77, 232, 244, .12);\n  --dsw-specific-input-major: var(--cpwb-surface-input);\n  --dsw-specific-menu: var(--cpwb-surface-overlay);\n  --dsw-specific-selector: #141b25;\n  --dsw-specific-sidebar-fill: var(--cpwb-surface-panel);\n  --dsw-specific-sidebar-nav-item-active: var(--cpwb-amber-soft);\n  --dsw-specific-sidebar-nav-item-hover: var(--cpwb-cyan-soft);\n  --dsw-shadow-lv3: var(--cpwb-shadow-2);\n}\n\nbody:has(.cpwb-app-shell) [data-slot="conversation"] {\n  --dsw-static-deepseek-500: var(--cpwb-amber);\n  --dsw-static-deepseek-200: #ffd05b;\n  color: var(--cpwb-text);\n  background:\n    radial-gradient(circle at 82% 0%, rgba(101, 24, 37, .17), transparent 35%),\n    var(--cpwb-surface-base);\n}\n\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"] {\n  color: var(--cpwb-text);\n  border: 1px solid var(--cpwb-border-strong);\n  border-radius: 0;\n  background: var(--cpwb-surface-raised);\n  box-shadow: var(--cpwb-shadow-2);\n  clip-path: var(--cpwb-cut-lg);\n}\n\n/* rc.2 settings selectors and theme cubes otherwise retain light-mode fills\n   when the host preference is "follow system". Keep their semantics native,\n   but make the controls legible inside the Workbench dark shell. */\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:has(nav button[aria-current]) button[aria-haspopup="menu"] {\n  color: var(--cpwb-text) !important;\n  border-color: var(--cpwb-border-strong) !important;\n  background: var(--cpwb-surface-panel) !important;\n}\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:has(nav button[aria-current]) button[aria-pressed="false"] {\n  color: var(--cpwb-text-secondary) !important;\n  border-color: var(--cpwb-border) !important;\n  background: var(--cpwb-surface-panel) !important;\n}\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:has(nav button[aria-current]) button[aria-pressed="true"] {\n  color: #090b10 !important;\n  border-color: var(--cpwb-amber) !important;\n  background: var(--cpwb-amber) !important;\n}\n\nbody:has(.cpwb-app-shell) :where(button, a, input, select, textarea):focus-visible,\n:where(.cpwb-btn, .cpwb-tab, .cpwb-toggle, .cpwb-close, .cpwb-x, .cpwb-kb-name, .cpwb-folder-add, .cpwb-section-action, .cpwb-card-new, .cpwb-kcard-new, .cpwb-sidebar-new, .cpwb-sidebar-nav-item, .cpwb-sidebar-recent, .cpwb-sidebar-all, .cpwb-session-list-open, .cpwb-session-list-action, .cpwb-session-archive-trigger):focus-visible {\n  outline: 2px solid var(--cpwb-cyan);\n  outline-offset: 3px;\n}\n\n.cpwb-status { padding: 7px 9px; margin-bottom: 9px; font-size: 11px; border-left: 2px solid currentColor; }\n.cpwb-status-loading { color: var(--cpwb-cyan); }\n.cpwb-status-success { color: var(--cpwb-green); }\n.cpwb-status-error { color: var(--cpwb-magenta); }\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.001ms !important; }\n}\n';

// src/client/workbench.css
var workbench_default = `/* Deepseek Harness Workbench \u2014 adaptive Cyberpunk 2077 / precision-glass UI */

.cpwb-home,
.cpwb-panel,
.cpwb-wordmark-launcher,
.cpwb-rail-reopen { font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }

.cpwb-home {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: clamp(176px, 15vw, 236px) minmax(0, 1fr);
  overflow: hidden;
  color: var(--cpwb-text);
  background:
    radial-gradient(circle at 74% 0%, rgba(125, 26, 42, .32), transparent 40%),
    radial-gradient(circle at 14% 88%, rgba(0, 240, 255, .07), transparent 32%),
    linear-gradient(122deg, #08080d 0%, #10090d 44%, #09090f 100%);
}

/* Native SettingsRoot remains the sole settings owner. Its trigger stays
   mounted for the Workbench sidebar action to invoke, but is not rendered as
   a second floating control. */
.cpwb-workbench-overlay { position: absolute; inset: 0; z-index: 30; pointer-events: none; }
.cpwb-workbench-overlay.cpwb-home { pointer-events: auto; }
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] { pointer-events: none; }
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] { visibility: hidden; }
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] * {
  visibility: hidden !important; pointer-events: none !important;
}
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.settings"] {
  visibility: visible !important; pointer-events: auto !important;
}
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.settings"] * {
  visibility: visible !important; pointer-events: auto !important;
}
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.settings"] > button {
  position: fixed;
  left: -9999px;
  bottom: auto;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  opacity: 0;
  visibility: hidden !important;
  pointer-events: none !important;
}
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.brand.mark"],
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.brand.name"],
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.workspaces"],
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.workspaces.directoryFlow"],
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.footer.action"] {
  display: none !important;
}
body:has(.cpwb-workbench-overlay) [data-slot="sidebar"] > *:not([data-slot="sidebar.settings"]) {
  visibility: hidden; pointer-events: none;
}
.cpwb-home::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .22;
  background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,.035) 1px, transparent 1px);
  background-size: 4px 4px, 72px 72px;
  mask-image: linear-gradient(to bottom, #000, transparent 72%);
}
.cpwb-home-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .28;
  mix-blend-mode: screen;
  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(255,255,255,.012) 3px 4px);
}

.cpwb-home-identity {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  padding: 34px 22px 28px;
  border-right: 1px solid rgba(0, 240, 255, .23);
  background: linear-gradient(180deg, rgba(8,10,15,.88), rgba(9,8,12,.58));
  backdrop-filter: blur(18px) saturate(130%);
  box-shadow: 16px 0 50px rgba(0,0,0,.3);
}
.cpwb-home-identity::after {
  content: "";
  position: absolute;
  right: -2px;
  top: 9%;
  width: 3px;
  height: 92px;
  background: var(--cpwb-cyan);
  box-shadow: 0 0 18px rgba(0,240,255,.45);
}
.cpwb-brand-mark { display: flex; gap: 5px; width: 72px; height: 22px; margin-bottom: 18px; }
.cpwb-brand-mark i { flex: 1; border-top: 3px solid var(--cpwb-red); border-bottom: 1px solid var(--cpwb-red); transform: skewX(-28deg); opacity: .86; }
.cpwb-brand-name { font: 800 clamp(15px, 1.2vw, 19px)/1.05 var(--cpwb-code); letter-spacing: .08em; }
.cpwb-brand-name span { display: block; margin-top: 8px; color: var(--cpwb-cyan); font-size: 9px; font-weight: 500; letter-spacing: .18em; }
.cpwb-home-telemetry { display: grid; gap: 10px; margin-top: auto; font: 500 9px/1.2 var(--cpwb-code); color: var(--cpwb-muted); letter-spacing: .12em; }
.cpwb-home-telemetry span { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-top: 1px solid rgba(0,240,255,.16); }
.cpwb-home-telemetry b { color: var(--cpwb-cyan); font-size: 16px; }
.cpwb-brand-codes { margin-top: 28px; color: rgba(129,218,226,.54); font: 500 8px/1.7 var(--cpwb-code); letter-spacing: .1em; }

.cpwb-home-main { position: relative; z-index: 1; min-width: 0; overflow: auto; padding: clamp(30px, 4vw, 68px) clamp(26px, 5vw, 82px) 86px; scrollbar-color: rgba(0,240,255,.3) transparent; }
.cpwb-hero { position: relative; max-width: 1200px; margin: 0 auto clamp(44px, 6vh, 72px); padding: 6px 0 14px clamp(20px, 2.3vw, 36px); border-left: 2px solid var(--cpwb-cyan); }
.cpwb-hero::before, .cpwb-hero::after { content: ""; position: absolute; left: 0; width: 17px; height: 1px; background: var(--cpwb-cyan); }
.cpwb-hero::before { top: 0; }.cpwb-hero::after { bottom: 0; }
.cpwb-hero-kicker { margin-bottom: 16px; color: var(--cpwb-cyan); font: 600 clamp(9px, .78vw, 12px)/1.2 var(--cpwb-code); letter-spacing: .24em; text-transform: uppercase; }
.cpwb-hero h1 { display: grid; margin: 0; font-size: clamp(35px, 5vw, 78px); font-weight: 820; line-height: .91; letter-spacing: -.055em; }
.cpwb-hero h1 span { width: max-content; max-width: 100%; }
.cpwb-hero-accent { color: var(--cpwb-amber); text-shadow: 0 0 32px rgba(255,183,37,.12); }
.cpwb-hero p { margin: 22px 0 0; color: rgba(241,238,230,.69); font-size: clamp(14px, 1.25vw, 19px); font-weight: 520; letter-spacing: .18em; }

.cpwb-home-section { max-width: 1200px; margin: 0 auto 52px; }
.cpwb-home-section > header { display: flex; align-items: flex-end; justify-content: space-between; gap: 22px; margin-bottom: 19px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,240,255,.25); }
.cpwb-home-section > header > div > span { color: var(--cpwb-cyan); font: 600 9px/1.2 var(--cpwb-code); letter-spacing: .2em; }
.cpwb-home-section h2 { margin: 6px 0 0; font-size: clamp(19px, 1.6vw, 25px); font-weight: 690; letter-spacing: .035em; }
.cpwb-folder-add, .cpwb-section-action, .cpwb-inline-create button {
  appearance: none;
  color: var(--cpwb-cyan);
  border: 1px solid rgba(0,240,255,.45);
  background: rgba(6,16,21,.64);
  cursor: pointer;
  transition: color .18s ease, background .18s ease, transform .18s ease, box-shadow .18s ease;
}
.cpwb-folder-add { position: relative; display: grid; grid-template-columns: 34px 1fr; align-items: center; gap: 8px; min-width: 126px; padding: 8px 12px 8px 8px; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); }
.cpwb-folder-add > span { display: grid; place-items: center; grid-row: 1 / span 2; position: relative; }
.cpwb-folder-add b { position: absolute; top: 2px; left: 30px; color: var(--cpwb-amber); font: 800 17px/1 var(--cpwb-code); }
.cpwb-folder-add em { font: 600 10px/1 var(--cpwb-code); font-style: normal; letter-spacing: .06em; }
.cpwb-folder-add:hover, .cpwb-section-action:hover { color: #071014; background: var(--cpwb-cyan); box-shadow: 0 0 22px rgba(0,240,255,.22); transform: translateY(-2px); }
.cpwb-folder-add:disabled { cursor: wait; opacity: .55; }

.cpwb-project-grid { display: grid; grid-template-columns: repeat(3, minmax(240px, 1fr)); gap: clamp(14px, 1.5vw, 23px); }
.cpwb-project-card {
  --card-line: rgba(0,240,255,.52);
  position: relative;
  min-height: clamp(225px, 23vw, 290px);
  overflow: hidden;
  padding: 21px;
  border: 1px solid var(--card-line);
  color: var(--cpwb-text);
  background: linear-gradient(150deg, rgba(19,23,31,.8), rgba(9,9,14,.72));
  backdrop-filter: blur(18px) saturate(125%);
  clip-path: polygon(0 0, calc(100% - 23px) 0, 100% 23px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  box-shadow: 0 20px 48px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.025);
  cursor: pointer;
  animation: cpwb-rise .48s both;
  animation-delay: calc(var(--cpwb-card-index) * 55ms);
  transition: transform .24s cubic-bezier(.2,.8,.2,1), border-color .2s ease, box-shadow .24s ease, background .2s ease;
}
.cpwb-project-card::after { content: ""; position: absolute; right: 0; top: 0; width: 42%; height: 5px; background: var(--cpwb-cyan); transform-origin: right; transform: scaleX(.12); transition: transform .25s ease, background .25s ease; }
.cpwb-project-card:hover, .cpwb-project-card:focus-visible { --card-line: rgba(255,183,37,.95); transform: translateY(-7px); background: linear-gradient(150deg, rgba(46,34,25,.9), rgba(12,11,16,.84)); box-shadow: 0 27px 64px rgba(0,0,0,.45), 0 0 0 1px rgba(255,183,37,.16), 0 0 30px rgba(255,183,37,.07); outline: none; }
.cpwb-project-card:hover::after, .cpwb-project-card:focus-visible::after { transform: scaleX(1); background: var(--cpwb-amber); }
.cpwb-card-scan { position: absolute; inset: 0; pointer-events: none; opacity: 0; background: linear-gradient(to bottom, transparent, rgba(0,240,255,.08), transparent); transform: translateY(-100%); }
.cpwb-project-card:hover .cpwb-card-scan { opacity: 1; animation: cpwb-scan 1.4s ease-out; }
.cpwb-card-topline { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--cpwb-cyan); font: 600 8px/1 var(--cpwb-code); letter-spacing: .15em; }
.cpwb-card-top-actions { display: flex; align-items: center; gap: 5px; }
.cpwb-card-state { color: var(--cpwb-green); }
.cpwb-card-manage { appearance: none; display: grid; place-items: center; width: 25px; height: 23px; padding: 0; color: rgba(0,240,255,.7); border: 1px solid rgba(0,240,255,.2); background: rgba(4,12,16,.56); cursor: pointer; transition: color .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease; }
.cpwb-card-manage:hover, .cpwb-card-manage:focus-visible { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 14px rgba(0,240,255,.2); outline: none; }
.cpwb-card-manage-danger:hover, .cpwb-card-manage-danger:focus-visible { color: #fff; border-color: var(--cpwb-magenta); background: var(--cpwb-magenta); box-shadow: 0 0 14px rgba(255,42,109,.22); }
.cpwb-card-manage:disabled { cursor: not-allowed; opacity: .35; }
.cpwb-card-symbol { display: grid; place-items: center; width: 60px; height: 60px; margin: 34px 0 20px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.3); background: rgba(0,240,255,.04); clip-path: polygon(0 0, 78% 0, 100% 22%, 100% 100%, 0 100%); transition: color .2s ease, transform .25s ease; }
.cpwb-project-card:hover .cpwb-card-symbol { color: var(--cpwb-amber); transform: rotate(-3deg) scale(1.05); }
.cpwb-card-copy h3 { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: clamp(18px, 1.65vw, 25px); letter-spacing: -.02em; }
.cpwb-card-copy p { margin: 8px 0 5px; overflow: hidden; color: var(--cpwb-muted); font: 500 10px/1.4 var(--cpwb-code); text-overflow: ellipsis; white-space: nowrap; }
.cpwb-card-copy span { color: rgba(224,229,236,.5); font-size: 10px; }
.cpwb-card-actions { position: absolute; left: 21px; right: 21px; bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px solid rgba(0,240,255,.14); }
.cpwb-card-enter { color: var(--cpwb-cyan); font: 650 10px/1 var(--cpwb-code); letter-spacing: .08em; }
.cpwb-card-enter b { color: var(--cpwb-amber); font-size: 15px; }
.cpwb-card-new, .cpwb-kcard-new { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 7px 9px; color: var(--cpwb-text); border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.025); font: 600 9px/1 var(--cpwb-code); cursor: pointer; }
.cpwb-card-sessions { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 7px 9px; color: var(--cpwb-text); border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.025); font: 600 9px/1 var(--cpwb-code); cursor: pointer; }
.cpwb-card-new > svg { display: block; flex: 0 0 auto; }
.cpwb-card-new:hover, .cpwb-kcard-new:hover { color: #0b0b0d; border-color: var(--cpwb-amber); background: var(--cpwb-amber); }
.cpwb-card-sessions { margin-left: auto; color: var(--cpwb-cyan); border-color: rgba(77,232,244,.28); }
.cpwb-card-sessions:hover { color: #061014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); }
.cpwb-project-modal-note { margin-top: -2px; padding-left: 10px; border-left: 2px solid rgba(0,240,255,.48); }

.cpwb-kb-section { padding-top: 2px; }
.cpwb-section-action { padding: 9px 13px; font: 600 10px/1 var(--cpwb-code); }
.cpwb-inline-create { display: flex; gap: 6px; }
.cpwb-inline-create input { min-width: 160px; padding: 8px 10px; color: var(--cpwb-text); border: 1px solid rgba(0,240,255,.35); background: rgba(0,0,0,.35); outline: none; }
.cpwb-inline-create input:focus { border-color: var(--cpwb-cyan); box-shadow: 0 0 0 2px rgba(0,240,255,.1); }
.cpwb-inline-create button { padding: 7px 9px; font-size: 10px; }
.cpwb-knowledge-grid { display: grid; grid-template-columns: repeat(3, minmax(220px, 1fr)); gap: 13px; }
.cpwb-knowledge-card { position: relative; display: grid; grid-template-columns: 52px minmax(0,1fr) auto; align-items: center; gap: 14px; min-height: 112px; padding: 18px; border: 1px solid rgba(0,240,255,.26); background: rgba(13,16,22,.64); backdrop-filter: blur(16px); clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 0 100%); cursor: pointer; animation: cpwb-rise .42s both; animation-delay: calc(var(--cpwb-card-index) * 45ms); transition: transform .2s ease, border-color .2s ease, background .2s ease; }
.cpwb-knowledge-card:hover, .cpwb-knowledge-card:focus-visible { transform: translateY(-3px); border-color: var(--cpwb-cyan); background: rgba(9,28,34,.76); outline: none; }
.cpwb-kcard-index { position: absolute; top: 7px; right: 10px; color: rgba(0,240,255,.5); font: 500 7px/1 var(--cpwb-code); letter-spacing: .12em; }
.cpwb-kcard-icon { display: grid; place-items: center; width: 48px; height: 48px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.34); }
.cpwb-kcard-copy { min-width: 0; }.cpwb-kcard-copy h3 { margin: 0; overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }.cpwb-kcard-copy p { margin: 5px 0; overflow: hidden; color: var(--cpwb-muted); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }.cpwb-kcard-copy span { color: rgba(230,235,240,.43); font-size: 8px; }
.cpwb-kcard-new { align-self: end; }
.cpwb-home-loading, .cpwb-home-error, .cpwb-empty { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 110px; color: var(--cpwb-muted); border: 1px dashed rgba(0,240,255,.2); background: rgba(0,0,0,.12); font-size: 12px; }
.cpwb-home-loading i { width: 8px; height: 8px; background: var(--cpwb-cyan); box-shadow: 0 0 12px var(--cpwb-cyan); animation: cpwb-pulse 1s infinite alternate; }
.cpwb-home-error { justify-content: flex-start; max-width: 1200px; min-height: auto; margin: 0 auto 28px; padding: 12px 15px; color: #ff7188; border-style: solid; border-color: rgba(255,42,109,.4); }
.cpwb-home-error span { flex: 1; }.cpwb-home-error button { color: var(--cpwb-text); border: 1px solid currentColor; background: transparent; cursor: pointer; }
.cpwb-home-footer { position: absolute; z-index: 2; left: clamp(176px, 15vw, 236px); right: 0; bottom: 0; display: flex; justify-content: space-between; padding: 9px clamp(26px,5vw,82px); color: rgba(0,240,255,.5); border-top: 1px solid rgba(0,240,255,.14); background: rgba(7,7,11,.76); backdrop-filter: blur(10px); font: 500 7px/1 var(--cpwb-code); letter-spacing: .16em; }

/* Persistent lower-left wordmark */
.cpwb-wordmark-launcher { position: relative; z-index: 1; display: grid; box-sizing: border-box; width: 100%; padding: 9px 12px 8px 19px; overflow: hidden; color: var(--cpwb-text); border: 0; border-left: 2px solid var(--cpwb-cyan); background: linear-gradient(100deg, rgba(9,11,16,.88), rgba(9,11,16,.35)); backdrop-filter: blur(12px); text-align: left; clip-path: polygon(0 0, 92% 0, 100% 32%, 100% 100%, 0 100%); }
.cpwb-wordmark-launcher::before { content: ""; position: absolute; left: 5px; top: 7px; bottom: 7px; width: 2px; background: var(--cpwb-amber); transform: skewY(-28deg); }
.cpwb-wordmark-main { font: 850 16px/.9 var(--cpwb-code); letter-spacing: .1em; transform: skewX(-7deg); }.cpwb-wordmark-sub { margin-top: 5px; color: var(--cpwb-cyan); font: 600 7px/1 var(--cpwb-code); letter-spacing: .28em; }
.cpwb-wordmark-compact { display: none; color: var(--cpwb-text); font: 900 21px/.9 var(--cpwb-code); text-align: center; transform: skewX(-9deg); }

/* Unified Workbench shell: one persistent global sidebar, one center page. */
.cpwb-app-shell {
  position: absolute;
  z-index: 34;
  inset: 0;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  color: var(--cpwb-text);
  background: #07090f;
  pointer-events: none;
}
.cpwb-app-shell > .cpwb-page-modal-host { pointer-events: auto; }
.cpwb-global-sidebar {
  --cpwb-logo-cut: #080a10;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: 18px 15px 14px;
  box-sizing: border-box;
  overflow: hidden;
  border-right: 1px solid rgba(77, 232, 244, .25);
  background:
    linear-gradient(180deg, rgba(11, 14, 20, .96), rgba(7, 9, 15, .98)),
    repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,.012) 3px 4px);
  box-shadow: 20px 0 54px rgba(0, 0, 0, .32);
  pointer-events: auto;
}
.cpwb-sidebar-primary { flex: 0 0 auto; }
.cpwb-sidebar-product { display: grid; grid-template-columns: 34px minmax(0, 1fr); align-items: center; gap: 10px; margin: 2px 7px 19px; color: #f0eee8; }
.cpwb-sidebar-product-mark { display: grid; place-items: center; width: 34px; height: 34px; filter: drop-shadow(0 0 7px rgba(77,232,244,.16)); }
.cpwb-workbench-node-mark { display: block; width: 100%; height: auto; }
.cpwb-sidebar-product-copy { display: flex; align-items: center; min-width: 0; }
.cpwb-sidebar-product-wordmark { display: block; width: min(100%, 116px); height: auto; color: #f3f0ea; filter: drop-shadow(0 0 6px rgba(77,232,244,.08)); }
.cpwb-sidebar-new,
.cpwb-sidebar-nav-item,
.cpwb-sidebar-recent,
.cpwb-sidebar-all {
  appearance: none;
  display: flex;
  align-items: center;
  width: 100%;
  color: #8c99aa;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.cpwb-sidebar-new { gap: 10px; min-height: 44px; padding: 0 13px; color: #090b11; border-color: var(--cpwb-amber); background: var(--cpwb-amber); font-size: 12px; font-weight: 750; clip-path: polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 0 100%); }
.cpwb-sidebar-new:hover { filter: brightness(1.08); box-shadow: 0 0 24px rgba(255,181,27,.16); }
.cpwb-sidebar-global-nav { display: grid; gap: 3px; margin-top: 12px; }
.cpwb-sidebar-nav-item { position: relative; gap: 11px; min-height: 40px; padding: 0 12px; font-size: 11px; }
.cpwb-sidebar-nav-item:hover,
.cpwb-sidebar-nav-item.cpwb-active { color: #f1eee8; border-color: rgba(77,232,244,.18); background: linear-gradient(90deg, rgba(77,232,244,.1), transparent 82%); }
.cpwb-sidebar-nav-item.cpwb-active::before { content: ""; position: absolute; left: -1px; top: 8px; bottom: 8px; width: 2px; background: var(--cpwb-amber); box-shadow: 0 0 10px rgba(255,181,27,.4); }
.cpwb-sidebar-recents {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  margin-top: 21px;
  overflow: hidden;
  border-top: 1px solid rgba(77,232,244,.14);
}
.cpwb-sidebar-section-label { display: flex; align-items: center; justify-content: space-between; flex: 0 0 auto; padding: 14px 8px 9px; color: #69778a; font: 650 8px/1 var(--cpwb-code); letter-spacing: .18em; text-transform: uppercase; }
.cpwb-sidebar-section-label b { color: var(--cpwb-cyan); font-size: 9px; }
.cpwb-sidebar-recent-scroll { flex: 1 1 auto; min-height: 0; overflow-x: hidden; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(77,232,244,.3) transparent; }
.cpwb-sidebar-date-group { display: grid; gap: 1px; }
.cpwb-sidebar-date-label { margin: 0; padding: 14px 8px 6px; color: #707d8f; font-size: 10px; font-weight: 620; letter-spacing: .04em; }
.cpwb-sidebar-date-group:first-child .cpwb-sidebar-date-label { padding-top: 4px; }
.cpwb-sidebar-session-row { display: grid; grid-template-columns: minmax(0,1fr) 29px; align-items: stretch; min-width: 0; border: 1px solid transparent; transition: border-color .14s ease, background-color .14s ease; }
.cpwb-sidebar-recent { padding: 9px 8px; }
.cpwb-sidebar-session-content { display: grid; min-width: 0; gap: 5px; }
.cpwb-sidebar-recent strong { overflow: hidden; color: #c1c8d1; font-size: 10.5px; font-weight: 590; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-sidebar-recent small { display: flex; align-items: center; gap: 6px; min-width: 0; color: #667387; font: 600 7px/1 var(--cpwb-code); letter-spacing: .06em; }
.cpwb-sidebar-recent small svg { flex: 0 0 auto; }
.cpwb-sidebar-recent small span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-sidebar-session-row[data-session-kind="project"] .cpwb-sidebar-recent small svg { color: var(--cpwb-cyan); }
.cpwb-sidebar-session-row[data-session-kind="knowledge-base"] .cpwb-sidebar-recent small svg { color: var(--cpwb-amber); }
.cpwb-sidebar-session-row[data-session-kind="independent"] .cpwb-sidebar-recent small svg { color: #8090a4; }
.cpwb-sidebar-session-row:hover,
.cpwb-sidebar-session-row:focus-within,
.cpwb-sidebar-session-row.cpwb-active { border-color: rgba(77,232,244,.16); background: rgba(77,232,244,.055); }
.cpwb-sidebar-session-row.cpwb-active strong { color: var(--cpwb-cyan); }
.cpwb-sidebar-session-action { appearance: none; display: grid; place-items: center; width: 29px; padding: 0; color: #718094; border: 0; border-left: 1px solid transparent; background: transparent; cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .14s ease, color .14s ease, background-color .14s ease; }
.cpwb-sidebar-session-row:hover .cpwb-sidebar-session-action,
.cpwb-sidebar-session-row:focus-within .cpwb-sidebar-session-action { opacity: 1; pointer-events: auto; }
.cpwb-sidebar-session-action:hover,
.cpwb-sidebar-session-action:focus-visible { color: #071014; border-left-color: var(--cpwb-cyan); background: var(--cpwb-cyan); outline: none; }
.cpwb-sidebar-all { justify-content: center; min-height: 34px; margin-top: 5px; color: var(--cpwb-cyan); border-style: dashed; border-color: rgba(77,232,244,.22); font: 600 8px/1 var(--cpwb-code); letter-spacing: .09em; }
.cpwb-sidebar-empty { margin: 12px 8px; color: #536174; font-size: 10px; }
.cpwb-sidebar-fixed-footer {
  display: grid;
  flex: 0 0 auto;
  gap: 9px;
  padding-top: 10px;
  border-top: 1px solid rgba(77,232,244,.16);
  background: #080a10;
}
.cpwb-sidebar-settings-seat { flex: 0 0 38px; min-height: 38px; pointer-events: none; }
.cpwb-sidebar-fixed-footer .cpwb-sidebar-brand-footer { margin: 0; padding-top: 8px; background: transparent; }
.cpwb-sidebar-wordmark { position: relative; isolation: isolate; }
.cpwb-sidebar-footer-wordmark { display: block; width: min(100%, 190px); height: auto; color: var(--cpwb-amber); filter: drop-shadow(0 0 8px rgba(77,232,244,.09)); }
.cpwb-sidebar-footer-wordmark-channel { position: absolute; inset: 0 auto auto 0; opacity: 0; pointer-events: none; mix-blend-mode: screen; }
.cpwb-sidebar-footer-wordmark-cyan { --cpwb-logo-cyan: var(--cpwb-cyan); color: var(--cpwb-cyan); clip-path: polygon(0 0, 100% 0, 100% 42%, 77% 35%, 52% 46%, 29% 34%, 0 44%); }
.cpwb-sidebar-footer-wordmark-magenta { --cpwb-logo-cyan: var(--cpwb-magenta); color: var(--cpwb-magenta); clip-path: polygon(0 58%, 23% 48%, 49% 61%, 73% 47%, 100% 56%, 100% 100%, 0 100%); }

@keyframes cpwb-wordmark-glitch {
  0%, 67%, 82%, 91%, 95%, 100% { opacity: 1; transform: translate3d(0, 0, 0) skewX(0); }
  68% { opacity: .28; transform: translate3d(-3px, 0, 0) skewX(-3deg); }
  70% { opacity: 1; transform: translate3d(4px, -1px, 0) skewX(2deg); }
  73% { opacity: .52; transform: translate3d(-2px, 1px, 0) scaleX(1.015); }
  76% { opacity: 1; transform: translate3d(3px, 0, 0) skewX(-1deg); }
  79% { opacity: .72; transform: translate3d(-1px, 0, 0); }
  92% { opacity: .48; transform: translate3d(2px, 0, 0); }
  94% { opacity: 1; transform: translate3d(-1px, 0, 0); }
}
@keyframes cpwb-wordmark-cyan {
  0%, 67%, 82%, 91%, 95%, 100% { opacity: 0; transform: translate3d(0, 0, 0); }
  68% { opacity: .95; transform: translate3d(-6px, -1px, 0); }
  70% { opacity: .38; transform: translate3d(4px, 0, 0); }
  73% { opacity: .88; transform: translate3d(-4px, 1px, 0); }
  76% { opacity: .5; transform: translate3d(6px, -1px, 0); }
  79% { opacity: .78; transform: translate3d(-3px, 0, 0); }
  92% { opacity: .58; transform: translate3d(-2px, 0, 0); }
  94% { opacity: 0; transform: translate3d(0, 0, 0); }
}
@keyframes cpwb-wordmark-magenta {
  0%, 67%, 82%, 91%, 95%, 100% { opacity: 0; transform: translate3d(0, 0, 0); }
  68% { opacity: .82; transform: translate3d(6px, 1px, 0); }
  70% { opacity: .45; transform: translate3d(-5px, 0, 0); }
  73% { opacity: .92; transform: translate3d(4px, -1px, 0); }
  76% { opacity: .42; transform: translate3d(-6px, 1px, 0); }
  79% { opacity: .72; transform: translate3d(3px, 0, 0); }
  92% { opacity: .52; transform: translate3d(2px, 0, 0); }
  94% { opacity: 0; transform: translate3d(0, 0, 0); }
}
@media (prefers-reduced-motion: no-preference) {
  .cpwb-sidebar-footer-wordmark { transform-box: fill-box; transform-origin: center; will-change: opacity, transform; }
  .cpwb-sidebar-footer-wordmark:not([data-logo-channel]) { animation: cpwb-wordmark-glitch 2.6s steps(1, end) infinite; }
  .cpwb-sidebar-footer-wordmark-cyan { animation: cpwb-wordmark-cyan 2.6s steps(1, end) infinite; }
  .cpwb-sidebar-footer-wordmark-magenta { animation: cpwb-wordmark-magenta 2.6s steps(1, end) infinite; }
}
@media (prefers-reduced-motion: reduce) {
  .cpwb-sidebar-footer-wordmark { animation: none !important; transform: none !important; }
  .cpwb-sidebar-footer-wordmark-channel { display: none; }
}
.cpwb-workbench-stage { position: relative; min-width: 0; min-height: 0; overflow: hidden; pointer-events: none; }
.cpwb-workbench-stage > .cpwb-home,
.cpwb-workbench-stage > .cpwb-workbench-page,
.cpwb-workbench-stage > .cpwb-skills-page { pointer-events: auto; }
.cpwb-workbench-stage > .cpwb-draft-conversation { pointer-events: auto; }
.cpwb-workbench-page { position: absolute; inset: 0; overflow: auto; padding: 42px; background: radial-gradient(circle at 75% 0, rgba(96,22,34,.25), transparent 38%), #090a10; }
.cpwb-workbench-stage > .cpwb-home { grid-template-columns: minmax(0, 1fr); }
.cpwb-workbench-stage .cpwb-home-footer { left: 0; }
.cpwb-home-metrics { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 22px; color: #6f7c8e; font: 600 8px/1 var(--cpwb-code); letter-spacing: .12em; }
.cpwb-home-metrics b { color: var(--cpwb-cyan); font-size: 12px; }
.cpwb-knowledge-entry > button { appearance: none; display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 16px; width: 100%; padding: 19px 21px; color: #8c99aa; border: 1px solid rgba(77,232,244,.2); background: linear-gradient(105deg, rgba(77,232,244,.07), rgba(255,181,27,.025) 60%, transparent); cursor: pointer; text-align: left; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%); }
.cpwb-knowledge-entry > button > svg:first-child { color: var(--cpwb-cyan); }
.cpwb-knowledge-entry > button > svg:last-child { color: var(--cpwb-amber); }
.cpwb-knowledge-entry > button > span { display: grid; gap: 5px; }
.cpwb-knowledge-entry small { color: var(--cpwb-cyan); font: 600 8px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-knowledge-entry strong { color: #f0eee8; font-size: 16px; }
.cpwb-knowledge-entry em { color: #6e7b8d; font-size: 10px; font-style: normal; }
.cpwb-knowledge-entry > button:hover { border-color: rgba(77,232,244,.5); background: linear-gradient(105deg, rgba(77,232,244,.12), rgba(255,181,27,.045) 60%, transparent); }
.cpwb-page-header { display: flex; align-items: end; justify-content: space-between; gap: 28px; box-sizing: border-box; width: min(100%, 1180px); margin: 0 auto 26px; padding: 18px 22px 20px; border: 1px solid rgba(77,232,244,.18); border-left: 2px solid var(--cpwb-cyan); background: linear-gradient(105deg, rgba(8,13,19,.78), rgba(38,8,16,.38)); box-shadow: 0 18px 50px rgba(0,0,0,.24); clip-path: var(--cpwb-cut-sm); }
.cpwb-page-header-main { min-width: 0; }
.cpwb-page-header-stat { display: flex; align-items: baseline; gap: 6px; color: var(--cpwb-text-muted); font: 600 9px/1 var(--cpwb-code); white-space: nowrap; }.cpwb-page-header-stat strong { color: var(--cpwb-amber); font-size: 24px; }
.cpwb-page-header span { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .2em; }
.cpwb-page-header h1 { margin: 8px 0 5px; color: #f1eee8; font-size: clamp(25px, 3vw, 40px); letter-spacing: -.025em; }
.cpwb-page-header p { margin: 0; color: #778598; font-size: 11px; }
.cpwb-knowledge-center-body { max-width: 1180px; margin: 0 auto; }
.cpwb-knowledge-center-body > div { display: grid; grid-template-columns: minmax(260px, .65fr) minmax(0, 1.35fr); gap: 14px; align-items: start; }
.cpwb-knowledge-center-body .cpwb-section { padding: 17px; border: 1px solid rgba(77,232,244,.14); background: rgba(12,15,21,.72); backdrop-filter: blur(14px); }
.cpwb-session-list-page { display: flex; flex-direction: column; }
.cpwb-session-scope-banner { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: baseline; gap: 12px; width: min(100%,1180px); margin: 0 auto 10px; padding: 10px 12px; color: var(--cpwb-text); border-left: 2px solid var(--cpwb-cyan); background: rgba(77,232,244,.055); }
.cpwb-session-scope-banner span, .cpwb-session-scope-banner small { color: var(--cpwb-cyan-dim); font: 600 9px/1.2 var(--cpwb-code); letter-spacing: .12em; }
.cpwb-session-scope-banner strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-session-filters { display: grid; grid-template-columns: minmax(220px,1fr) 160px auto; gap: 10px; width: min(100%, 1180px); margin: 0 auto 18px; }
.cpwb-session-filters-locked { grid-template-columns: minmax(220px,1fr) auto; }
.cpwb-tool-search { display: flex; align-items: center; gap: 8px; min-height: 36px; margin: 8px 0 12px; padding: 0 10px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.18); background: rgba(4,8,13,.62); }
.cpwb-tool-search input { width: 100%; min-width: 0; color: var(--cpwb-text); border: 0; outline: 0; background: transparent; font: 500 11px/1.3 var(--cpwb-ui); }
.cpwb-tool-search:focus-within { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 0 var(--cpwb-cyan); }
.cpwb-global-schedule-head { margin-bottom: 0; }
.cpwb-session-filters label { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 0 12px; border: 1px solid rgba(77,232,244,.2); background: rgba(5,7,12,.62); }
.cpwb-session-filters label svg { color: var(--cpwb-cyan); flex: 0 0 auto; }
.cpwb-session-filters input,
.cpwb-session-filters select { min-width: 0; min-height: 40px; color: #dfe4ea; border: 1px solid rgba(77,232,244,.2); background: rgba(5,7,12,.62); outline: none; }
.cpwb-session-filters input { width: 100%; border: 0; background: transparent; }
.cpwb-session-filters select { padding: 0 10px; }
.cpwb-session-filters > button,
.cpwb-session-pagination button { min-height: 40px; padding: 0 17px; color: #080a10; border: 1px solid var(--cpwb-amber); background: var(--cpwb-amber); cursor: pointer; font-weight: 700; }
.cpwb-session-list { display: grid; gap: 7px; width: min(100%, 1180px); margin: 0 auto; }
.cpwb-session-list-row { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: stretch; min-height: 62px; color: #8694a7; border: 1px solid rgba(77,232,244,.13); background: rgba(11,14,20,.72); }
.cpwb-session-list-open { appearance: none; display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 13px; min-width: 0; padding: 10px 15px; color: inherit; border: 0; background: transparent; cursor: pointer; text-align: left; }
.cpwb-session-list-open > svg { color: var(--cpwb-cyan); }
.cpwb-session-list-open > span { display: grid; gap: 5px; min-width: 0; }
.cpwb-session-list-row strong { overflow: hidden; color: #dce2e9; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-session-list-row small { color: #607084; font: 600 8px/1 var(--cpwb-code); letter-spacing: .08em; }
.cpwb-session-list-row time { color: #627084; font: 600 8px/1 var(--cpwb-code); }
.cpwb-session-list-row:hover { border-color: rgba(77,232,244,.42); background: linear-gradient(90deg, rgba(77,232,244,.08), rgba(11,14,20,.72)); }
.cpwb-session-list-row-archived { border-left-color: rgba(255,181,27,.65); background: linear-gradient(90deg, rgba(255,181,27,.045), rgba(11,14,20,.72) 42%); }
.cpwb-session-list-action { appearance: none; display: inline-flex; align-items: center; justify-content: center; min-width: 44px; padding: 0 12px; color: #7e8b9c; border: 0; border-left: 1px solid rgba(77,232,244,.13); background: rgba(2,5,9,.24); cursor: pointer; }
.cpwb-session-list-action:hover { color: #071014; background: var(--cpwb-cyan); }
.cpwb-session-list-empty { display: grid; place-items: center; gap: 10px; flex: 1; color: #607084; }
.cpwb-session-pagination { display: flex; align-items: center; justify-content: space-between; width: min(100%, 1180px); margin: auto auto 0; padding-top: 18px; color: #657387; font-size: 10px; }
.cpwb-session-pagination div { display: flex; gap: 8px; }
.cpwb-session-pagination button { min-height: 32px; padding: 0 12px; color: var(--cpwb-cyan); border-color: rgba(77,232,244,.28); background: transparent; }
.cpwb-session-pagination button:disabled { cursor: not-allowed; opacity: .35; }
.cpwb-app-shell[data-page="conversation"] { background: transparent; }
.cpwb-app-shell[data-page="conversation"] .cpwb-workbench-stage { overflow: visible; }
.cpwb-session-chrome { position: absolute; inset: 0; pointer-events: none; }
.cpwb-session-transition { position: absolute; z-index: 43; inset: 0; display: grid; place-items: center; padding: 72px 24px 24px; background: linear-gradient(135deg, rgba(5,8,13,.985), rgba(8,12,18,.97) 58%, rgba(24,9,14,.94)); pointer-events: auto; }
.cpwb-session-transition::before { content: ""; position: absolute; inset: 0; background: linear-gradient(rgba(77,232,244,.026) 1px, transparent 1px), linear-gradient(90deg, rgba(77,232,244,.026) 1px, transparent 1px); background-size: 42px 42px; pointer-events: none; }
.cpwb-session-transition-panel { position: relative; display: grid; justify-items: start; box-sizing: border-box; width: min(430px, calc(100% - 32px)); padding: 28px 30px 30px; color: var(--cpwb-text); border: 1px solid rgba(77,232,244,.36); border-left: 3px solid var(--cpwb-cyan); background: rgba(8,12,18,.92); box-shadow: 18px 18px 0 rgba(0,0,0,.2), inset 0 1px rgba(255,255,255,.035); clip-path: var(--cpwb-cut-md); }
.cpwb-session-transition-code { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .2em; }
.cpwb-session-transition-mark { display: grid; place-items: center; width: 48px; height: 48px; margin: 22px 0 18px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.5); background: rgba(77,232,244,.06); }
.cpwb-session-transition-panel strong { font-size: 20px; letter-spacing: -.02em; }
.cpwb-session-transition-panel p { max-width: 38ch; margin: 9px 0 0; color: var(--cpwb-text-muted); font-size: 11px; line-height: 1.65; }
.cpwb-session-transition-signal { display: grid; grid-template-columns: 56px 32px 14px; gap: 6px; width: 100%; margin-top: 24px; }
.cpwb-session-transition-signal i { display: block; height: 3px; background: var(--cpwb-cyan); opacity: .9; }.cpwb-session-transition-signal i:nth-child(2) { opacity: .48; }.cpwb-session-transition-signal i:nth-child(3) { opacity: .22; }
.cpwb-session-transition-actions { display: flex; gap: 9px; margin-top: 24px; }.cpwb-session-transition-actions .cpwb-btn { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; padding-inline: 16px; }
.cpwb-session-transitioning .cpwb-session-context-meta .cpwb-session-subagent-trigger { display: none; }
.cpwb-session-transitioning:has(.cpwb-session-transition[role="alert"]) .cpwb-session-context-kind,
.cpwb-session-transitioning:has(.cpwb-session-transition[role="alert"]) .cpwb-session-transition-code,
.cpwb-session-transitioning:has(.cpwb-session-transition[role="alert"]) .cpwb-session-transition-mark { color: #ff7188; }
.cpwb-session-transitioning:has(.cpwb-session-transition[role="alert"]) .cpwb-session-transition-panel { border-color: rgba(255,113,136,.42); border-left-color: #ff7188; }
.cpwb-session-context-bar { position: absolute; z-index: 44; top: 12px; left: 14px; right: 14px; display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 39px; padding: 0 13px; color: var(--cpwb-text-secondary); border: 1px solid rgba(77,232,244,.2); background: linear-gradient(90deg, rgba(10,14,20,.88), rgba(10,13,18,.64)); box-shadow: inset 2px 0 var(--cpwb-cyan), 0 9px 28px rgba(0,0,0,.2); backdrop-filter: blur(16px) saturate(120%); clip-path: var(--cpwb-cut-sm); }
.cpwb-has-context-rail .cpwb-session-context-bar { right: calc(var(--cpwb-rail-width, 320px) + 14px); }
.cpwb-session-context-kind { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; white-space: nowrap; }
.cpwb-session-context-identity, .cpwb-session-context-meta { display: flex; align-items: baseline; min-width: 0; gap: 10px; }.cpwb-session-context-identity { flex: 1; }.cpwb-session-context-meta { flex: 0 0 auto; }
.cpwb-session-context-bar strong { min-width: 0; overflow: hidden; color: var(--cpwb-text); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-session-context-bar small { color: var(--cpwb-text-muted); font-size: 9px; white-space: nowrap; }
.cpwb-session-context-bar em { color: var(--cpwb-amber); font: 600 8px/1 var(--cpwb-code); font-style: normal; white-space: nowrap; }
.cpwb-session-id { display: inline-flex; align-items: center; flex: 0 1 auto; min-width: 0; max-width: 190px; color: #667488; pointer-events: auto; }
.cpwb-session-id code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 600 7px/1 var(--cpwb-code); letter-spacing: .06em; }
.cpwb-session-id-copy { appearance: none; display: grid; place-items: center; flex: 0 0 25px; width: 25px; height: 25px; margin-left: 3px; padding: 0; color: var(--cpwb-cyan); border: 1px solid transparent; background: transparent; cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .14s ease, border-color .14s ease, background-color .14s ease; }
.cpwb-session-id:hover .cpwb-session-id-copy,
.cpwb-session-id:focus-within .cpwb-session-id-copy { opacity: 1; pointer-events: auto; }
.cpwb-session-id-copy:hover,
.cpwb-session-id-copy:focus-visible { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); outline: none; }
.cpwb-session-subagent-trigger { appearance: none; display: inline-flex; align-items: center; gap: 6px; min-height: 27px; padding: 0 8px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.26); background: rgba(77,232,244,.045); font: 650 7px/1 var(--cpwb-code); letter-spacing: .11em; clip-path: var(--cpwb-cut-sm); cursor: pointer; pointer-events: auto; }
.cpwb-session-subagent-trigger b { min-width: 18px; color: #081014; background: var(--cpwb-cyan); padding: 3px 4px; text-align: center; }
.cpwb-session-subagent-trigger:hover, .cpwb-session-subagent-trigger[aria-expanded="true"] { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 20px rgba(77,232,244,.18); }
.cpwb-session-subagent-trigger:hover b, .cpwb-session-subagent-trigger[aria-expanded="true"] b { color: var(--cpwb-amber); background: #071014; }
.cpwb-project-rail { position: absolute; z-index: 45; top: 0; right: 0; bottom: 0; display: flex; flex-direction: column; width: var(--cpwb-rail-width, 320px); min-width: 0; overflow: hidden; color: var(--cpwb-text); border-left: 1px solid rgba(77,232,244,.3); background: linear-gradient(180deg, rgba(12,16,22,.95), rgba(7,9,14,.98)); box-shadow: -22px 0 60px rgba(0,0,0,.38); backdrop-filter: blur(20px) saturate(125%); pointer-events: auto; }
.cpwb-project-rail::before { content: ""; position: absolute; top: 0; left: 0; width: 38%; height: 2px; background: var(--cpwb-cyan); box-shadow: 0 0 13px rgba(77,232,244,.4); }
.cpwb-project-rail-header { flex: 0 0 auto; padding: 21px 18px 16px; border-bottom: 1px solid rgba(77,232,244,.16); }
.cpwb-project-rail-header > span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .2em; }
.cpwb-project-rail-header h2 { margin: 8px 0 6px; overflow: hidden; color: #f1eee8; font-size: 17px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-project-rail-header small { color: #607084; font: 600 8px/1 var(--cpwb-code); letter-spacing: .09em; }
.cpwb-project-tool-tabs { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); flex: 0 0 auto; border-bottom: 1px solid rgba(77,232,244,.14); }
.cpwb-project-tool-tabs button { position: relative; appearance: none; display: grid; justify-items: center; gap: 6px; min-width: 0; padding: 12px 3px 10px; color: #68778b; border: 0; background: transparent; cursor: pointer; }
.cpwb-project-tool-tabs button svg { color: inherit; }
.cpwb-project-tool-tabs button span { overflow: hidden; width: 100%; font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-project-tool-tabs button::after { content: ""; position: absolute; left: 18%; right: 18%; bottom: -1px; height: 2px; background: var(--cpwb-amber); transform: scaleX(0); transition: transform .18s ease; }
.cpwb-project-tool-tabs button:hover,
.cpwb-project-tool-tabs button.cpwb-active { color: var(--cpwb-amber); background: linear-gradient(to top, rgba(255,181,27,.07), transparent); }
.cpwb-project-tool-tabs button.cpwb-active::after { transform: scaleX(1); box-shadow: 0 0 10px rgba(255,181,27,.35); }
.cpwb-project-tool-tabs[data-tool-count="5"] { grid-template-columns: repeat(5, minmax(0,1fr)); }
.cpwb-project-tool-body { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 15px; scrollbar-width: thin; scrollbar-color: rgba(77,232,244,.28) transparent; }
.cpwb-context-list { display: grid; align-content: start; gap: 9px; }
.cpwb-context-card { display: grid; gap: 6px; padding: 11px 12px; border: 1px solid rgba(77,232,244,.14); border-left: 2px solid rgba(77,232,244,.45); background: rgba(255,255,255,.018); clip-path: var(--cpwb-cut-sm); }
.cpwb-context-card-primary { border-left-color: var(--cpwb-amber); background: linear-gradient(110deg, rgba(255,181,27,.065), rgba(77,232,244,.02)); }
.cpwb-context-card > span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-context-card > strong { overflow-wrap: anywhere; color: var(--cpwb-text); font-size: 11px; }
.cpwb-context-card > small { color: var(--cpwb-text-muted); font-size: 9px; line-height: 1.45; }
.cpwb-context-empty { padding: 28px 12px; color: var(--cpwb-text-muted); border: 1px dashed rgba(77,232,244,.2); text-align: center; font-size: 10px; }
.cpwb-global-schedules { display: grid; gap: 9px; }
.cpwb-context-filters { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding-bottom: 9px; border-bottom: 1px solid rgba(77,232,244,.14); }
.cpwb-context-filters label { display: grid; gap: 5px; color: var(--cpwb-text-muted); font: 650 7px/1 var(--cpwb-code); letter-spacing: .1em; }
.cpwb-context-filters label:last-child { grid-column: 1 / -1; }
.cpwb-context-filters select, .cpwb-context-filters input { box-sizing: border-box; width: 100%; min-width: 0; height: 32px; padding: 0 8px; color: var(--cpwb-text); border: 1px solid rgba(77,232,244,.25); background: #080d13; outline: none; font: 550 9px/1 var(--cpwb-code); color-scheme: dark; }
.cpwb-context-filters select:hover, .cpwb-context-filters input:hover, .cpwb-context-filters select:focus, .cpwb-context-filters input:focus { border-color: var(--cpwb-cyan); }
.cpwb-context-filter-count { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .1em; text-align: right; }

/* Right workbench inspector */
.cpwb-rail-host { color: var(--cpwb-text); }
.cpwb-rail { position: relative; display: flex; height: 100%; min-width: 0; filter: drop-shadow(-18px 0 35px rgba(0,0,0,.32)); }
.cpwb-panel { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100%; overflow: hidden; border-left: 1px solid rgba(0,240,255,.34); background: linear-gradient(180deg, rgba(13,15,21,.94), rgba(8,9,13,.94)); backdrop-filter: blur(22px) saturate(125%); }
.cpwb-panel::before { content: ""; position: absolute; top: 0; left: 0; width: 35%; height: 2px; background: var(--cpwb-cyan); box-shadow: 0 0 12px rgba(0,240,255,.35); }
.cpwb-inspector-header { display: flex; align-items: center; justify-content: space-between; min-height: 68px; padding: 15px 15px 13px 18px; border-bottom: 1px solid rgba(0,240,255,.18); }
.cpwb-inspector-heading { min-width: 0; }.cpwb-inspector-heading > span { color: var(--cpwb-cyan); font: 600 7px/1 var(--cpwb-code); letter-spacing: .19em; }.cpwb-inspector-heading h2 { margin: 7px 0 0; overflow: hidden; font-size: 15px; font-weight: 680; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-close { display: grid; place-items: center; width: 31px; height: 31px; color: var(--cpwb-muted); border: 1px solid rgba(0,240,255,.25); background: rgba(0,0,0,.16); cursor: pointer; font-size: 21px; }.cpwb-close:hover { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }
.cpwb-tabs { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; border-bottom: 1px solid rgba(0,240,255,.15); }
.cpwb-tab { position: relative; display: grid; justify-items: center; gap: 6px; min-width: 0; padding: 12px 3px 10px; color: #77859a; border: 0; background: transparent; cursor: pointer; font-size: 9px; }.cpwb-tab svg { width: 15px; height: 15px; }.cpwb-tab span { overflow: hidden; width: 100%; text-overflow: ellipsis; white-space: nowrap; }.cpwb-tab::after { content: ""; position: absolute; left: 16%; right: 16%; bottom: -1px; height: 2px; background: var(--cpwb-amber); transform: scaleX(0); transition: transform .18s ease; }.cpwb-tab:hover { color: var(--cpwb-text); }.cpwb-tab.cpwb-active { color: var(--cpwb-amber); background: linear-gradient(to top, rgba(255,183,37,.08), transparent); }.cpwb-tab.cpwb-active::after { transform: scaleX(1); box-shadow: 0 0 9px rgba(255,183,37,.35); }
.cpwb-body { flex: 1; min-height: 0; overflow: auto; padding: 13px; scrollbar-width: thin; scrollbar-color: rgba(0,240,255,.25) transparent; }
.cpwb-rail-divider { width: 7px; flex: 0 0 7px; cursor: ew-resize; background: transparent; outline: none; }.cpwb-rail-divider::after { content: ""; display: block; width: 1px; height: 100%; margin-left: 5px; background: rgba(0,240,255,.18); }.cpwb-rail-divider:hover::after, .cpwb-rail-divider:focus-visible::after { width: 2px; background: var(--cpwb-cyan); box-shadow: 0 0 12px rgba(0,240,255,.4); }
.cpwb-rail-reopen { position: fixed; z-index: 58; right: 0; top: 42%; display: grid; justify-items: center; gap: 5px; padding: 13px 6px 11px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.45); border-right: 0; background: rgba(9,12,17,.9); backdrop-filter: blur(12px); cursor: pointer; clip-path: polygon(9px 0, 100% 0, 100% 100%, 0 100%, 0 9px); }.cpwb-rail-reopen b { writing-mode: vertical-rl; font: 600 7px/1 var(--cpwb-code); letter-spacing: .15em; }

.cpwb-section { padding: 12px 0 15px; border-bottom: 1px solid rgba(0,240,255,.1); }.cpwb-section:first-child { padding-top: 1px; }.cpwb-section:last-child { border-bottom: 0; }
.cpwb-section-head, .cpwb-row, .cpwb-addrow, .cpwb-toggle-row, .cpwb-citation-head, .cpwb-item, .cpwb-kb-row, .cpwb-upload-file { display: flex; align-items: center; gap: 8px; }.cpwb-section-head { justify-content: space-between; margin-bottom: 9px; }.cpwb-label { color: var(--cpwb-cyan); font: 650 9px/1 var(--cpwb-code); letter-spacing: .12em; text-transform: uppercase; }.cpwb-row, .cpwb-addrow { margin-bottom: 7px; }.cpwb-addrow .cpwb-input { flex: 1; min-width: 0; }
.cpwb-input { box-sizing: border-box; width: 100%; min-height: 31px; padding: 7px 9px; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.24); border-radius: 0; background: rgba(0,0,0,.18); outline: none; font: 500 11px/1.4 inherit; resize: vertical; }.cpwb-input:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }.cpwb-rule-input { min-width: 125px; }
.cpwb-btn, .cpwb-x, .cpwb-toggle, .cpwb-kb-name { appearance: none; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.24); background: rgba(255,255,255,.025); cursor: pointer; }.cpwb-btn { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 29px; padding: 6px 8px; font-size: 9px; line-height: 1; white-space: nowrap; }.cpwb-button-content > svg { flex: 0 0 auto; }.cpwb-btn:hover { color: var(--cpwb-cyan); border-color: rgba(0,240,255,.55); }.cpwb-btn-primary { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); font-weight: 700; }.cpwb-btn-primary:hover { color: #071014; box-shadow: 0 0 15px rgba(0,240,255,.2); }.cpwb-btn-danger { color: #ff8295; border-color: rgba(255,42,109,.35); background: rgba(255,42,109,.05); }.cpwb-btn:disabled, .cpwb-x:disabled, .cpwb-toggle:disabled { cursor: not-allowed; opacity: .42; }
.cpwb-list, .cpwb-kb-list, .cpwb-citations { display: grid; gap: 7px; }.cpwb-item, .cpwb-kb-row { align-items: flex-start; padding: 9px; border: 1px solid rgba(137,157,180,.13); background: rgba(255,255,255,.018); }.cpwb-kb-row { align-items: center; }.cpwb-item-main { flex: 1; min-width: 0; }.cpwb-item-title { min-width: 0; overflow-wrap: anywhere; color: #e6edf3; font-size: 11px; }.cpwb-item-meta { margin-top: 4px; overflow-wrap: anywhere; color: #758398; font-size: 9px; line-height: 1.45; }.cpwb-item-done .cpwb-item-title { color: #647181; text-decoration: line-through; }.cpwb-overdue { color: #ff6d80; }.cpwb-check { display: inline-grid; place-items: center; flex: 0 0 22px; width: 22px; height: 22px; padding: 0; color: #061014; border: 1px solid rgba(139,159,181,.4); background: transparent; cursor: pointer; }.cpwb-check.cpwb-done { border-color: var(--cpwb-green); background: var(--cpwb-green); }.cpwb-x { display: grid; place-items: center; flex: 0 0 auto; width: 25px; height: 25px; color: #77859a; border: 0; background: transparent; }.cpwb-x:hover { color: #ff7188; }
.cpwb-badge { display: inline-block; margin-left: 6px; padding: 2px 5px; border: 1px solid currentColor; font: 600 7px/1 var(--cpwb-code); }.cpwb-badge-done { color: var(--cpwb-green); }.cpwb-badge-pending { color: var(--cpwb-cyan); }.cpwb-badge-overdue { color: #ff7188; }
.cpwb-kb-name { flex: 1; min-width: 0; overflow: hidden; padding: 5px; border: 0; text-align: left; text-overflow: ellipsis; white-space: nowrap; }.cpwb-kb-name:hover { color: var(--cpwb-cyan); }.cpwb-kb-sel { border-color: rgba(255,183,37,.42); background: rgba(255,183,37,.05); }.cpwb-kb-sel .cpwb-kb-name { color: var(--cpwb-amber); }
.cpwb-drop { display: grid; place-items: center; min-height: 74px; padding: 10px; color: #8390a2; border: 1px dashed rgba(0,240,255,.28); background: rgba(0,240,255,.025); cursor: pointer; text-align: center; font-size: 10px; }.cpwb-drop:hover, .cpwb-drop-active { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); background: rgba(0,240,255,.06); }.cpwb-upload-block { margin: 7px 0; }.cpwb-upload-file { justify-content: space-between; padding: 5px; }
.cpwb-citation { padding: 9px; border-left: 2px solid var(--cpwb-cyan); background: rgba(0,240,255,.035); }.cpwb-citation-head { justify-content: space-between; color: var(--cpwb-cyan); font-size: 9px; }.cpwb-citation-file { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.cpwb-citation-locator { color: #69788c; }.cpwb-citation-heading { margin-top: 6px; font-size: 10px; font-weight: 650; }.cpwb-citation-text { margin-top: 5px; color: #a8b4c2; font-size: 9px; line-height: 1.55; }

.cpwb-knowledge-sources-tail {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--cpwb-cyan) 42%, transparent);
  border-left: 3px solid var(--cpwb-cyan);
  background: color-mix(in srgb, var(--cpwb-surface-panel) 92%, var(--cpwb-cyan) 8%);
  color: var(--cpwb-text);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
}
.cpwb-knowledge-sources-summary {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 8px 12px;
  cursor: pointer;
  list-style: none;
  font-family: var(--cpwb-code);
}
.cpwb-knowledge-sources-summary::-webkit-details-marker { display: none; }
.cpwb-knowledge-sources-summary:focus-visible { outline: 2px solid var(--cpwb-amber); outline-offset: -3px; }
.cpwb-knowledge-sources-mark { color: var(--cpwb-amber); font-size: 11px; font-weight: 800; letter-spacing: .08em; }
.cpwb-knowledge-sources-title { color: var(--cpwb-cyan); font-size: 11px; font-weight: 800; letter-spacing: .08em; }
.cpwb-knowledge-sources-count { color: var(--cpwb-muted); font-size: 10px; white-space: nowrap; }
.cpwb-knowledge-sources-list { display: grid; border-top: 1px solid color-mix(in srgb, var(--cpwb-cyan) 24%, transparent); }
.cpwb-knowledge-source {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) minmax(90px, auto) 16px;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 7px 12px;
  color: var(--cpwb-text);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--cpwb-cyan) 13%, transparent);
  transition: background-color .16s ease, color .16s ease;
}
.cpwb-knowledge-source:last-child { border-bottom: 0; }
.cpwb-knowledge-source:hover,
.cpwb-knowledge-source:focus-visible { color: var(--cpwb-cyan); background: color-mix(in srgb, var(--cpwb-cyan) 12%, transparent); }
.cpwb-knowledge-source:focus-visible { outline: 1px solid var(--cpwb-cyan); outline-offset: -2px; }
.cpwb-knowledge-source-static { grid-template-columns: 18px minmax(0, 1fr) minmax(90px, auto); }
.cpwb-knowledge-source-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 650; }
.cpwb-knowledge-source-locator { color: var(--cpwb-muted); font-family: var(--cpwb-code); font-size: 9px; text-align: right; }

@media (max-width: 899px) {
  .cpwb-knowledge-sources-summary { grid-template-columns: 22px minmax(0, 1fr); }
  .cpwb-knowledge-sources-count { grid-column: 2; white-space: normal; }
  .cpwb-knowledge-source,
  .cpwb-knowledge-source-static { grid-template-columns: 18px minmax(0, 1fr) 16px; }
  .cpwb-knowledge-source-locator { grid-column: 2 / -1; text-align: left; white-space: normal; }
}

/* Skills management keeps the Workbench's dark industrial surface, with a
   restrained cyan signal for scope and action state. */
.cpwb-skills-page { position: absolute; inset: 0; overflow: auto; display: flex; flex-direction: column; padding: 34px 42px 48px; color: var(--cpwb-text); background: radial-gradient(circle at 76% 0, rgba(96,22,34,.2), transparent 38%), #090a10; }
.cpwb-skills-layout { width: min(100%, 1180px); margin: 0 auto; }
.cpwb-skills-header { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 18px 22px; border-left: 2px solid var(--cpwb-cyan); border-bottom: 1px solid rgba(77,232,244,.16); background: rgba(8,13,19,.7); }
.cpwb-skills-title { display: flex; align-items: flex-start; gap: 13px; min-width: 0; }
.cpwb-skills-title > svg { flex: 0 0 auto; margin-top: 3px; color: var(--cpwb-cyan); }
.cpwb-skills-title span, .cpwb-skills-project-select > span, .cpwb-skills-conflict-grid > div > span { color: var(--cpwb-cyan); font: 650 8px/1.25 var(--cpwb-code); letter-spacing: .18em; text-transform: uppercase; }
.cpwb-skills-title h1 { margin: 7px 0 4px; font-size: clamp(24px, 3vw, 38px); letter-spacing: -.02em; }
.cpwb-skills-title h1 .cpwb-skills-title-alias { display: inline-block; margin-left: .35em; padding-left: .55em; color: var(--cpwb-cyan); border-left: 1px solid rgba(77,232,244,.35); font: inherit; font-size: .48em; font-weight: 650; letter-spacing: .08em; text-transform: none; vertical-align: .16em; }
.cpwb-skills-title p { margin: 0; color: var(--cpwb-muted); font-size: 11px; }
.cpwb-skills-count { color: var(--cpwb-amber); font: 700 27px/1 var(--cpwb-code); }
.cpwb-skills-tabs { display: flex; min-height: 42px; margin-top: 24px; border-bottom: 1px solid var(--cpwb-border); }
.cpwb-skills-tabs button { min-width: 92px; padding: 0 17px; color: var(--cpwb-muted); border: 0; border-bottom: 2px solid transparent; background: transparent; cursor: pointer; }
.cpwb-skills-tabs button:hover, .cpwb-skills-tabs button.cpwb-active { color: var(--cpwb-cyan); border-bottom-color: var(--cpwb-cyan); background: var(--cpwb-cyan-soft); }
.cpwb-skills-project-select { display: grid; gap: 7px; width: min(100%, 330px); margin-top: 18px; }
.cpwb-skills-project-select select { min-height: 38px; padding: 0 11px; color: var(--cpwb-text); border: 1px solid var(--cpwb-border-strong); background: var(--cpwb-surface-raised); }
.cpwb-skills-scope-manager { margin-top: 18px; }
.cpwb-skills-path { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; min-height: 46px; padding: 0 12px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.17); background: rgba(0,240,255,.025); }
.cpwb-skills-path code { min-width: 0; overflow-wrap: anywhere; color: var(--cpwb-text-secondary); font: 600 10px/1.4 var(--cpwb-code); }
.cpwb-skills-copy { display: inline-flex; align-items: center; gap: 5px; min-height: 28px; padding: 0 8px; color: var(--cpwb-muted); border: 1px solid var(--cpwb-border-strong); background: transparent; cursor: pointer; font-size: 9px; white-space: nowrap; }
.cpwb-skills-copy:hover { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }
.cpwb-skills-toolbar { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin: 14px 0 10px; }
.cpwb-skills-list { border-top: 1px solid rgba(139,159,181,.16); }
.cpwb-skill-row { display: grid; grid-template-columns: minmax(150px, .8fr) minmax(0, 1.4fr) auto; min-height: 74px; align-items: center; gap: 18px; padding: 0 10px; border-bottom: 1px solid rgba(139,159,181,.13); }
.cpwb-skill-row:hover, .cpwb-skill-row-busy { background: rgba(0,240,255,.028); }
.cpwb-skill-identity, .cpwb-skill-summary { min-width: 0; }
.cpwb-skill-identity { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
.cpwb-skill-identity strong { overflow-wrap: anywhere; color: var(--cpwb-text); font-size: 12px; }
.cpwb-skill-summary p { margin: 0 0 5px; overflow-wrap: anywhere; color: var(--cpwb-text-secondary); font-size: 11px; line-height: 1.45; }
.cpwb-skill-summary small { display: block; overflow-wrap: anywhere; color: var(--cpwb-muted); font: 500 9px/1.35 var(--cpwb-code); }
.cpwb-skill-status, .cpwb-skill-shadow { display: inline-flex; align-items: center; min-height: 18px; padding: 0 6px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.3); font: 650 8px/1 var(--cpwb-code); white-space: nowrap; }
.cpwb-skill-status-disabled { color: var(--cpwb-muted); border-color: var(--cpwb-border-strong); }
.cpwb-skill-shadow { color: var(--cpwb-amber); border-color: rgba(255,181,27,.32); }
.cpwb-skill-actions { display: flex; gap: 6px; justify-content: flex-end; }
.cpwb-skill-actions .cpwb-icon-button:disabled { opacity: .35; cursor: not-allowed; }
.cpwb-skills-state, .cpwb-skills-empty, .cpwb-skills-diagnostics { margin-top: 18px; padding: 24px; border: 1px solid rgba(77,232,244,.15); background: rgba(255,255,255,.018); }
.cpwb-skills-state { display: flex; align-items: center; gap: 10px; color: var(--cpwb-muted); }
.cpwb-skills-error { color: #ff8697; }
.cpwb-skills-error .cpwb-btn { margin-left: auto; }
.cpwb-skills-empty { display: grid; justify-items: start; gap: 8px; color: var(--cpwb-muted); }
.cpwb-skills-empty svg { color: var(--cpwb-cyan); }
.cpwb-skills-empty strong, .cpwb-skills-diagnostics strong { color: var(--cpwb-text); font-size: 13px; }
.cpwb-skills-empty p { margin: 0; font-size: 11px; }
.cpwb-skills-diagnostics { border-left: 2px solid var(--cpwb-amber); }
.cpwb-skills-diagnostics p { margin: 8px 0 0; overflow-wrap: anywhere; color: var(--cpwb-muted); font-size: 10px; }
.cpwb-skills-action-status, .cpwb-skills-action-error { margin-top: 10px; font-size: 10px; }
.cpwb-skills-action-status { color: var(--cpwb-green); }
.cpwb-skills-action-error { color: #ff8697; }
.cpwb-skills-skeleton { display: inline-block; width: 66px; height: 8px; background: rgba(77,232,244,.22); animation: cpwb-skills-pulse 1.2s ease-in-out infinite; }
@keyframes cpwb-skills-pulse { 50% { opacity: .36; } }
.cpwb-visually-hidden { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }
.cpwb-skills-dialog { width: min(100%, 570px); max-height: calc(100dvh - 24px); overflow: auto; }
.cpwb-skills-dialog-lead { margin: 10px 0 0; color: var(--cpwb-muted); font-size: 11px; line-height: 1.55; }
.cpwb-skills-conflict-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; margin-top: 20px; }
.cpwb-skills-conflict-grid > div { display: grid; gap: 8px; min-width: 0; padding: 13px; border: 1px solid var(--cpwb-border-strong); background: rgba(255,255,255,.02); }
.cpwb-skills-conflict-grid strong { overflow-wrap: anywhere; color: var(--cpwb-text); }
.cpwb-skills-conflict-grid small { overflow-wrap: anywhere; color: var(--cpwb-muted); font-size: 10px; line-height: 1.4; }
.cpwb-skills-delete-facts { display: grid; gap: 0; margin: 18px 0 0; border-top: 1px solid var(--cpwb-border); }
.cpwb-skills-delete-facts > div { display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--cpwb-border); }
.cpwb-skills-delete-facts dt { color: var(--cpwb-muted); font: 650 9px/1.4 var(--cpwb-code); }
.cpwb-skills-delete-facts dd { margin: 0; overflow-wrap: anywhere; color: var(--cpwb-text-secondary); font-size: 10px; }
.cpwb-skills-dialog .cpwb-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 22px; }

/* The project rail is a compact projection of the same manager. Keep its
   actions and state model shared with the full page, while making the dense
   320px surface scannable and keeping the installed root out of the visible
   label (it remains available through the title and accessible path label). */
.cpwb-project-rail .cpwb-skills-compact { margin-top: 0; }
.cpwb-skills-compact-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 13px; padding-bottom: 11px; border-bottom: 1px solid rgba(77,232,244,.16); }
.cpwb-skills-compact-title { display: flex; align-items: center; gap: 8px; min-width: 0; color: var(--cpwb-cyan); }
.cpwb-skills-compact-title svg { flex: 0 0 auto; }
.cpwb-skills-compact-title span { display: block; color: var(--cpwb-cyan-dim); font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-skills-compact-title h3 { margin: 5px 0 0; color: var(--cpwb-text); font-size: 15px; letter-spacing: -.015em; }
.cpwb-skills-compact-count { color: var(--cpwb-amber); font: 700 18px/1 var(--cpwb-code); }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-path { min-height: 38px; padding: 0 9px; gap: 7px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-path code { font-size: 9px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-copy { min-height: 24px; padding: 0 6px; font-size: 8px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-copy span { display: none; }
.cpwb-skills-compact .cpwb-skills-toolbar { position: relative; justify-content: flex-start; margin: 11px 0 9px; }
.cpwb-skills-import-menu { position: relative; }
.cpwb-skills-import-trigger { min-height: 31px; padding-inline: 9px; font-size: 9px; }
.cpwb-skills-import-options { position: absolute; z-index: 5; top: calc(100% + 5px); left: 0; display: grid; min-width: 142px; padding: 4px; border: 1px solid var(--cpwb-border-strong); background: var(--cpwb-surface-raised); box-shadow: var(--cpwb-shadow-1); }
.cpwb-skills-import-options button { display: flex; align-items: center; gap: 7px; min-height: 31px; padding: 0 8px; color: var(--cpwb-text-secondary); border: 0; background: transparent; cursor: pointer; text-align: left; font-size: 10px; }
.cpwb-skills-import-options button:hover, .cpwb-skills-import-options button:focus-visible { color: #071014; outline: none; background: var(--cpwb-cyan); }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-list { border-top-color: rgba(139,159,181,.2); }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skill-row { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 7px; min-height: 0; padding: 11px 0; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skill-identity { gap: 5px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skill-identity strong { font-size: 11px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skill-summary { grid-column: 1 / -1; grid-row: 2; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skill-summary p { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; margin: 5px 0 4px; overflow: hidden; font-size: 10px; line-height: 1.4; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skill-summary small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 8px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skill-actions { grid-column: 2; grid-row: 1; gap: 4px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-icon-button { width: 25px; height: 25px; flex-basis: 25px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-state,
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-empty,
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-diagnostics { margin-top: 12px; padding: 15px 12px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-empty strong { font-size: 11px; }
.cpwb-project-rail .cpwb-skills-compact .cpwb-skills-empty p { font-size: 9px; }
@media (prefers-reduced-motion: reduce) {
  .cpwb-skills-skeleton { animation: none !important; }
}
@media (max-width: 899px) {
  .cpwb-skills-page { padding: 62px 14px 24px; }
}
@media screen and (max-width: 720px) {
  .cpwb-skills-page { padding: 62px 14px 24px; }
  .cpwb-skills-header { align-items: flex-start; padding: 15px; }
  .cpwb-skills-count { font-size: 20px; }
  .cpwb-skills-title h1 { font-size: 25px; }
  .cpwb-skills-toolbar { justify-content: stretch; }
  .cpwb-skills-toolbar .cpwb-btn { flex: 1 1 140px; }
  .cpwb-skill-row { grid-template-columns: minmax(0, 1fr) auto; min-height: 74px; gap: 9px; padding: 12px 6px; }
  .cpwb-skill-summary { grid-column: 1 / -1; grid-row: 2; }
  .cpwb-skill-actions { grid-column: 2; grid-row: 1; }
  .cpwb-skills-conflict-grid { grid-template-columns: 1fr; }
  .cpwb-skills-dialog { width: calc(100vw - 24px); }
}
.cpwb-toggle-row { justify-content: space-between; padding: 7px 0; color: #bdc7d3; font-size: 10px; }.cpwb-toggle { min-width: 34px; padding: 5px; color: #7d8999; font: 700 8px/1 var(--cpwb-code); }.cpwb-toggle.cpwb-on { color: #071014; border-color: var(--cpwb-green); background: var(--cpwb-green); }.cpwb-summary-entry { position: relative; isolation: isolate; margin-bottom: 7px; padding: 9px; overflow: hidden; overflow-wrap: anywhere; border-left: 2px solid var(--cpwb-amber); background: rgba(255,183,37,.035); color: #c3cbd4; font-size: 10px; line-height: 1.5; }.cpwb-summary-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; }.cpwb-summary-actions { display: flex; flex: 0 0 auto; gap: 5px; }.cpwb-summary-content { white-space: pre-wrap; }.cpwb-summary-failed { color: #ff7188; }
.cpwb-generation-wave { position: relative; height: 4px; margin: 1px 0 10px; overflow: hidden; border: 1px solid rgba(77,232,244,.18); background: rgba(77,232,244,.035); box-shadow: inset 0 0 8px rgba(77,232,244,.06); }
.cpwb-generation-wave::before { content: ""; position: absolute; inset: 0; opacity: .48; background: repeating-linear-gradient(90deg, transparent 0 7px, rgba(77,232,244,.28) 7px 9px, transparent 9px 15px); animation: cpwb-generation-wave .8s linear infinite; }
.cpwb-generation-wave::after { content: ""; position: absolute; inset: -1px auto -1px 0; width: 34%; background: linear-gradient(90deg, transparent, rgba(77,232,244,.92), transparent); box-shadow: 0 0 14px rgba(77,232,244,.5); transform: translateX(-120%); animation: cpwb-generation-sweep 1.25s cubic-bezier(.4,0,.2,1) infinite; }
.cpwb-entry-arrived { position: relative; isolation: isolate; animation: cpwb-entry-arrival-edge 1.1s ease-out both; }
.cpwb-entry-arrived::after { content: ""; position: absolute; z-index: 3; inset: 0; pointer-events: none; background: linear-gradient(90deg, transparent 0%, rgba(77,232,244,.08) 35%, rgba(77,232,244,.42) 50%, rgba(77,232,244,.08) 65%, transparent 100%); transform: translateX(-115%); animation: cpwb-entry-arrival-wave .9s cubic-bezier(.2,.75,.25,1) both; }
@keyframes cpwb-generation-wave { to { background-position: 15px 0; } }
@keyframes cpwb-generation-sweep { 0% { transform: translateX(-120%); } 70%,100% { transform: translateX(310%); } }
@keyframes cpwb-entry-arrival-edge { 0% { box-shadow: inset 3px 0 var(--cpwb-cyan), 0 0 0 1px rgba(77,232,244,.44); } 100% { box-shadow: inset 0 0 transparent, 0 0 0 1px transparent; } }
@keyframes cpwb-entry-arrival-wave { 0% { opacity: 0; transform: translateX(-115%); } 18% { opacity: 1; } 100% { opacity: 0; transform: translateX(115%); } }
.cpwb-status, .cpwb-error-msg { padding: 7px 9px; margin-bottom: 8px; border-left: 2px solid currentColor; font-size: 9px; }.cpwb-status { display: flex; align-items: center; gap: 6px; line-height: 1.2; }.cpwb-status svg { flex: 0 0 auto; }.cpwb-status-loading { color: var(--cpwb-cyan); }.cpwb-status-success { color: var(--cpwb-green); }.cpwb-status-error, .cpwb-error-msg { color: #ff7188; }.cpwb-error { padding-bottom: 9px; }

.cpwb-drawer-root { position: fixed; z-index: 91; inset: 0; }.cpwb-drawer-backdrop { position: absolute; inset: 0; background: rgba(2,3,6,.68); backdrop-filter: blur(5px); }.cpwb-drawer { position: absolute; top: 0; right: 0; bottom: 0; width: min(88vw, 390px); animation: cpwb-drawer-in .23s ease-out; box-shadow: -25px 0 60px rgba(0,0,0,.48); }

/* Full-screen rc.2 session projection. DSH owns the state machine; this layer
   owns only the information architecture, glass surfaces, and focus order. */
.cpwb-fullscreen-shell { position: absolute; inset: 0; z-index: 35; width: 100%; min-height: 100%; height: 100%; display: grid; grid-template-columns: 232px minmax(0, 1fr); overflow: hidden; color: var(--cpwb-text); pointer-events: none; }
.cpwb-session-overlay .cpwb-sidebar, .cpwb-session-overlay .cpwb-tool-rail { pointer-events: auto; }
.cpwb-fullscreen-shell.cpwb-tool-open { grid-template-columns: 232px minmax(0, 1fr) minmax(280px, 320px); }
.cpwb-sidebar { display: flex; flex-direction: column; box-sizing: border-box; min-width: 0; min-height: 0; height: 100%; overflow: hidden; padding: 22px 14px 14px; border-right: 1px solid rgba(0,240,255,.22); background: rgba(7,10,15,.82); backdrop-filter: blur(22px); }
.cpwb-sidebar-logo { display: flex; align-items: baseline; gap: 7px; padding: 8px; color: var(--cpwb-text); border: 0; background: transparent; cursor: pointer; text-align: left; font: 800 17px/1 var(--cpwb-code); letter-spacing: .1em; }.cpwb-sidebar-logo b { color: var(--cpwb-cyan); font-size: 8px; letter-spacing: .2em; }.cpwb-sidebar-project { margin: 26px 8px 18px; overflow: hidden; color: var(--cpwb-muted); font: 600 9px/1 var(--cpwb-code); letter-spacing: .16em; text-overflow: ellipsis; text-transform: uppercase; }
.cpwb-sidebar-toggle { align-self: flex-end; width: 26px; height: 24px; margin: 4px 0 6px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.25); background: transparent; cursor: pointer; }
.cpwb-sidebar-scroll { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-x: hidden; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(0,240,255,.25) transparent; }.cpwb-sidebar nav { display: grid; gap: 4px; }.cpwb-sidebar-item { display: grid; grid-template-columns: 25px minmax(0,1fr); align-items: center; gap: 7px; padding: 12px 10px; color: #8290a4; border: 1px solid transparent; background: transparent; cursor: pointer; text-align: left; font-size: 12px; }.cpwb-sidebar-item > span { color: var(--cpwb-cyan); font: 16px/1 var(--cpwb-code); text-align: center; }.cpwb-sidebar-item:hover, .cpwb-sidebar-item.cpwb-active { color: var(--cpwb-text); border-color: rgba(0,240,255,.22); background: linear-gradient(90deg, rgba(0,240,255,.11), transparent); box-shadow: inset 3px 0 var(--cpwb-amber); }.cpwb-sidebar-brand-footer { position: relative; z-index: 2; display: grid; flex: 0 0 auto; gap: 9px; margin-top: 12px; padding-top: 11px; border-top: 1px solid rgba(0,240,255,.18); background: linear-gradient(180deg, rgba(7,10,15,.55), rgba(7,10,15,.96)); }.cpwb-sidebar-status { color: #637286; font: 600 8px/1.3 var(--cpwb-code); letter-spacing: .1em; }
.cpwb-session-history { min-width: 0; margin-top: 17px; padding-top: 13px; border-top: 1px solid rgba(0,240,255,.12); }.cpwb-history-title { margin: 0 8px 8px; color: #637286; font: 650 8px/1.2 var(--cpwb-code); letter-spacing: .12em; }.cpwb-history-item { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 5px; width: 100%; padding: 8px; overflow: hidden; color: #8b99aa; border: 1px solid transparent; background: transparent; cursor: pointer; text-align: left; font-size: 10px; }.cpwb-history-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.cpwb-history-item small { color: #4bba91; font: 7px/1 var(--cpwb-code); }.cpwb-history-item:hover, .cpwb-history-item.cpwb-active { color: var(--cpwb-text); border-color: rgba(0,240,255,.18); background: rgba(0,240,255,.06); }.cpwb-history-more { width: 100%; margin-top: 4px; padding: 7px; color: var(--cpwb-cyan); border: 1px dashed rgba(0,240,255,.25); background: transparent; cursor: pointer; font: 8px/1 var(--cpwb-code); }
.cpwb-fullscreen-shell.cpwb-sidebar-collapsed { grid-template-columns: 62px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-sidebar-collapsed.cpwb-tool-open { grid-template-columns: 62px minmax(0, 1fr) minmax(280px, 320px); }.cpwb-sidebar-collapsed .cpwb-sidebar { padding-left: 7px; padding-right: 7px; }.cpwb-sidebar-collapsed .cpwb-sidebar-logo span, .cpwb-sidebar-collapsed .cpwb-sidebar-logo b, .cpwb-sidebar-collapsed .cpwb-sidebar-project, .cpwb-sidebar-collapsed .cpwb-sidebar-item, .cpwb-sidebar-collapsed .cpwb-sidebar-status, .cpwb-sidebar-collapsed .cpwb-wordmark-main, .cpwb-sidebar-collapsed .cpwb-wordmark-sub { font-size: 0; }.cpwb-sidebar-collapsed .cpwb-sidebar-item { grid-template-columns: 1fr; justify-items: center; padding-left: 5px; padding-right: 5px; }.cpwb-sidebar-collapsed .cpwb-sidebar-item > span { font-size: 18px; }.cpwb-sidebar-collapsed .cpwb-sidebar-logo { padding-left: 0; padding-right: 0; }.cpwb-sidebar-collapsed .cpwb-wordmark-launcher { width: 46px; padding: 9px 5px 8px; }.cpwb-sidebar-collapsed .cpwb-wordmark-compact { display: block; }
.cpwb-session-conversation { pointer-events: none; min-width: 0; min-height: 0; }.cpwb-session-context, .cpwb-session-view { display: none; }
.cpwb-modal { box-sizing: border-box; }
.cpwb-tool-rail { min-width: 0; overflow: auto; padding: 22px 15px; border-left: 1px solid rgba(0,240,255,.3); background: linear-gradient(180deg, rgba(12,16,22,.91), rgba(7,9,13,.95)); backdrop-filter: blur(18px); }.cpwb-tool-rail-title { margin-bottom: 16px; color: var(--cpwb-amber); font: 650 9px/1 var(--cpwb-code); letter-spacing: .18em; }.cpwb-tool-panel { min-width: 0; }.cpwb-tool-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 13px; color: var(--cpwb-cyan); font: 650 9px/1.3 var(--cpwb-code); }.cpwb-todo-row { position: relative; isolation: isolate; display: flex; align-items: flex-start; gap: 8px; padding: 10px 6px; overflow: hidden; border-bottom: 1px solid rgba(139,159,181,.13); }.cpwb-todo-details { display: grid; gap: 2px; padding: 0; color: inherit; border: 0; background: transparent; text-align: left; cursor: pointer; }.cpwb-todo-details .cpwb-item-meta { display: block; }.cpwb-icon-button { display: inline-grid; place-items: center; flex: 0 0 27px; width: 27px; height: 27px; padding: 0; color: #96a5b8; border: 1px solid rgba(139,159,181,.2); background: transparent; cursor: pointer; }.cpwb-icon-button:hover { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }.cpwb-danger-icon:hover { color: #ff7188; border-color: rgba(255,42,109,.55); }
.cpwb-todo-tabs { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 15px; border: 1px solid rgba(0,240,255,.18); background: rgba(3,8,13,.5); }.cpwb-todo-tabs button { display: flex; align-items: center; justify-content: space-between; min-height: 35px; padding: 0 11px; color: #77859a; border: 0; border-bottom: 2px solid transparent; background: transparent; cursor: pointer; font: 650 9px/1 var(--cpwb-code); }.cpwb-todo-tabs button + button { border-left: 1px solid rgba(0,240,255,.12); }.cpwb-todo-tabs button:hover { color: var(--cpwb-cyan); background: rgba(0,240,255,.04); }.cpwb-todo-tabs button.cpwb-active { color: var(--cpwb-cyan); border-bottom-color: var(--cpwb-cyan); background: rgba(0,240,255,.07); }.cpwb-todo-tabs small { min-width: 19px; padding: 3px 5px; color: inherit; border: 1px solid currentColor; font-size: 8px; text-align: center; }
.cpwb-todo-sections { display: grid; gap: 18px; }.cpwb-todo-section h4 { margin: 0 0 6px; color: #8995a7; font: 650 10px/1.2 var(--cpwb-code); letter-spacing: .04em; }.cpwb-todo-section-overdue h4 { color: #ff667f; }.cpwb-todo-section-completed h4 { color: var(--cpwb-green); }.cpwb-todo-section .cpwb-list { gap: 0; border-top: 1px solid rgba(139,159,181,.12); }.cpwb-todo-row { display: grid; grid-template-columns: 22px minmax(0,1fr) auto 27px 27px; align-items: center; gap: 7px; min-width: 0; padding: 10px 4px; transition: background .16s ease, border-color .16s ease; }.cpwb-todo-row:hover { background: rgba(0,240,255,.025); }.cpwb-todo-row-overdue { border-left: 2px solid rgba(255,42,109,.72); background: rgba(255,42,109,.035); }.cpwb-todo-time { display: grid; justify-items: end; gap: 2px; min-width: 38px; color: var(--cpwb-cyan); font: 650 10px/1 var(--cpwb-code); }.cpwb-todo-time small { color: #ff667f; font-size: 7px; letter-spacing: .04em; }.cpwb-todo-time.cpwb-todo-overdue { color: #ff667f; }.cpwb-item-done .cpwb-todo-time { color: var(--cpwb-green); }.cpwb-item-done { opacity: .72; }.cpwb-todo-details:focus-visible, .cpwb-todo-tabs button:focus-visible, .cpwb-icon-button:focus-visible, .cpwb-check:focus-visible { outline: 2px solid var(--cpwb-cyan); outline-offset: 2px; }
.cpwb-modal-backdrop { position: fixed; z-index: 120; inset: 0; display: grid; place-items: center; padding: 18px; background: rgba(2,3,6,.7); backdrop-filter: blur(12px); }.cpwb-modal { width: min(100%, 480px); max-height: min(90vh, 720px); overflow: auto; padding: 24px; border: 1px solid rgba(0,240,255,.45); background: linear-gradient(145deg, rgba(19,23,31,.96), rgba(12,10,16,.98)); box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 32px rgba(0,240,255,.08); }.cpwb-modal h3 { margin: 8px 0 22px; font-size: 22px; }.cpwb-modal p { color: var(--cpwb-text-secondary); font-size: 12px; line-height: 1.6; }.cpwb-modal label { display: grid; gap: 7px; margin-bottom: 14px; color: #9da9b8; font: 600 9px/1 var(--cpwb-code); letter-spacing: .08em; }.cpwb-modal input, .cpwb-modal textarea { box-sizing: border-box; min-width: 0; width: 100%; padding: 11px; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.25); background: rgba(0,0,0,.25); outline: none; font: 400 13px/1.35 inherit; resize: vertical; }.cpwb-modal textarea { min-height: 88px; }.cpwb-modal input:focus, .cpwb-modal textarea:focus { border-color: var(--cpwb-cyan); box-shadow: 0 0 0 2px rgba(0,240,255,.1); }.cpwb-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }.cpwb-form-error { margin: 4px 0 14px; color: #ff7188; font-size: 11px; }.cpwb-modal-actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }.cpwb-modal-actions-split { align-items: center; justify-content: space-between; }.cpwb-modal-actions .cpwb-row { margin: 0; }.cpwb-recurrence-picker { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-bottom: 14px; border: 1px solid rgba(139,159,181,.2); background: rgba(139,159,181,.2); }.cpwb-recurrence-picker button { min-height: 35px; color: var(--cpwb-text-secondary); border: 0; background: #0c1118; cursor: pointer; }.cpwb-recurrence-picker button.cpwb-active { color: #071014; background: var(--cpwb-amber); }.cpwb-switch-row { display: flex !important; align-items: center; justify-content: space-between; }.cpwb-switch-row input { width: auto; accent-color: var(--cpwb-cyan); }.cpwb-danger-confirm { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 8px 0; padding: 10px; color: #ff92a3; border-left: 2px solid var(--cpwb-magenta); background: rgba(255,42,109,.07); font-size: 10px; }.cpwb-schedule-row { display: grid; grid-template-columns: 30px minmax(0,1fr) auto 27px 27px; align-items: center; gap: 7px; padding: 10px 7px; border-bottom: 1px solid rgba(139,159,181,.13); cursor: pointer; }.cpwb-schedule-row:hover { background: rgba(0,240,255,.025); }.cpwb-schedule-icon { display: grid; place-items: center; color: var(--cpwb-cyan); }.cpwb-schedule-state { font: 650 7px/1 var(--cpwb-code); letter-spacing: .08em; }.cpwb-schedule-state.cpwb-on { color: var(--cpwb-green); }.cpwb-schedule-state.cpwb-off { color: var(--cpwb-text-muted); }
.cpwb-page-modal-host { box-sizing: border-box !important; position: fixed; z-index: 220; inset: 0; place-items: center; width: 100vw; max-width: none !important; height: 100dvh; max-height: none !important; margin: 0; padding: 18px; overflow: auto; color: var(--cpwb-text); border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; clip-path: none !important; }
.cpwb-page-modal-host[open] { display: grid; }.cpwb-page-modal-host:not([open]) { display: none; }.cpwb-page-modal-host::backdrop { background: rgba(2,3,6,.72); backdrop-filter: blur(12px); }
.cpwb-page-modal-host .cpwb-modal { max-height: min(90dvh, 720px); clip-path: var(--cpwb-cut-lg); }
.cpwb-container-delete-modal { width: min(100%, 620px); }
.cpwb-delete-impact { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; margin: -7px 0 18px; border: 1px solid rgba(0,240,255,.22); background: rgba(0,240,255,.16); }
.cpwb-delete-impact span { display: grid; gap: 5px; min-width: 0; padding: 11px 9px; color: var(--cpwb-text-muted); background: rgba(8,12,18,.94); font: 600 8px/1.2 var(--cpwb-code); letter-spacing: .06em; text-transform: uppercase; }
.cpwb-delete-impact b { overflow: hidden; color: var(--cpwb-cyan); font-size: 16px; text-overflow: ellipsis; }
.cpwb-delete-loading { margin: -7px 0 18px; padding: 14px; color: var(--cpwb-cyan); border: 1px dashed rgba(0,240,255,.28); font: 600 9px/1.4 var(--cpwb-code); letter-spacing: .08em; }
.cpwb-delete-policy { display: grid; gap: 8px; }
.cpwb-delete-policy > label { display: grid; grid-template-columns: 18px 24px minmax(0,1fr); align-items: center; gap: 10px; margin: 0; padding: 13px; border: 1px solid rgba(139,159,181,.2); background: rgba(4,8,13,.6); cursor: pointer; transition: border-color .16s ease, background .16s ease, transform .16s ease; }
.cpwb-delete-policy > label:hover { border-color: rgba(0,240,255,.55); background: rgba(0,240,255,.055); transform: translateX(2px); }
.cpwb-delete-policy > label.cpwb-selected { border-color: var(--cpwb-cyan); box-shadow: inset 3px 0 var(--cpwb-cyan); }
.cpwb-delete-policy > label.cpwb-danger-choice.cpwb-selected { border-color: var(--cpwb-magenta); box-shadow: inset 3px 0 var(--cpwb-magenta); }
.cpwb-delete-policy input { width: 14px; accent-color: var(--cpwb-cyan); }
.cpwb-delete-policy svg { color: var(--cpwb-cyan); }
.cpwb-delete-policy .cpwb-danger-choice svg { color: #ff7188; }
.cpwb-delete-policy span { display: grid; gap: 5px; }
.cpwb-delete-policy strong { color: var(--cpwb-text); font: 650 12px/1.3 inherit; letter-spacing: 0; }
.cpwb-delete-policy strong em { margin-left: 8px; padding: 2px 5px; color: #061114; background: var(--cpwb-cyan); font: 700 7px/1 var(--cpwb-code); letter-spacing: .08em; }
.cpwb-delete-policy small { color: var(--cpwb-text-muted); font: 500 9px/1.5 inherit; letter-spacing: 0; }
.cpwb-delete-confirm-zone { margin-top: 10px; padding: 12px; border: 1px solid rgba(255,42,109,.24); background: rgba(255,42,109,.04); }
.cpwb-delete-confirm-zone label { margin: 0; }
.cpwb-delete-confirm-zone .cpwb-form-error { display: flex; align-items: center; gap: 6px; }
@media (max-width: 620px) { .cpwb-delete-impact { grid-template-columns: repeat(2, 1fr); } .cpwb-delete-policy > label { grid-template-columns: 16px 20px minmax(0,1fr); padding: 11px 9px; } }

/* Supervised RC.2 maintenance. This surface remains rendered while the Host
   disconnects, so every phase shown here comes from the durable purge job. */
.cpwb-restart-confirmation { display: grid; gap: 13px; }
.cpwb-restart-target { display: grid; gap: 7px; padding: 14px 16px; border: 1px solid rgba(77,232,244,.3); background: linear-gradient(100deg, rgba(77,232,244,.09), transparent 55%); clip-path: var(--cpwb-cut-sm); }
.cpwb-restart-target > span { color: var(--cpwb-cyan); font: 700 8px/1 var(--cpwb-code); letter-spacing: .18em; }
.cpwb-restart-target > strong { overflow-wrap: anywhere; color: var(--cpwb-text); font-size: 18px; }
.cpwb-restart-target > small { color: #8190a4; font: 650 9px/1.4 var(--cpwb-code); }
.cpwb-restart-notice { display: grid; grid-template-columns: 28px minmax(0,1fr); gap: 12px; padding: 15px; color: var(--cpwb-amber); border: 1px solid rgba(255,181,27,.32); border-left: 3px solid var(--cpwb-amber); background: rgba(255,181,27,.07); }
.cpwb-restart-notice > span { display: grid; gap: 7px; }
.cpwb-restart-notice strong { color: var(--cpwb-text); font-size: 13px; }
.cpwb-restart-notice small { color: #a4adba; font-size: 10px; line-height: 1.6; }
.cpwb-restart-guarantees { display: grid; gap: 8px; margin: 0; padding: 13px 16px 13px 32px; color: #8f9bae; border: 1px solid rgba(77,232,244,.15); background: rgba(4,8,13,.48); font-size: 10px; line-height: 1.55; }
.cpwb-restart-guarantees li::marker { color: var(--cpwb-cyan); }
.cpwb-restart-checkbox { display: grid !important; grid-template-columns: 20px minmax(0,1fr); align-items: center; gap: 10px !important; margin: 0 !important; padding: 13px 14px; color: var(--cpwb-text) !important; border: 1px solid rgba(255,73,111,.38); background: rgba(255,73,111,.065); cursor: pointer; }
.cpwb-restart-checkbox input { width: 16px; height: 16px; margin: 0; accent-color: var(--cpwb-amber); }

.cpwb-app-shell > .cpwb-maintenance-screen { pointer-events: auto; }
.cpwb-maintenance-screen {
  position: fixed;
  z-index: 420;
  inset: 0;
  isolation: isolate;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto minmax(0,1fr) auto;
  min-width: 320px;
  min-height: 100dvh;
  padding: 24px clamp(22px,4vw,72px) 22px;
  overflow-x: hidden;
  overflow-y: auto;
  color: #f2eee9;
  background: radial-gradient(circle at 88% 7%, rgba(106,14,31,.34), transparent 32%), radial-gradient(circle at 15% 100%, rgba(9,109,118,.15), transparent 34%), #05070c;
  font-family: "Arial Narrow", "Avenir Next Condensed", "PingFang SC", sans-serif;
}
.cpwb-maintenance-screen::before { content: ""; position: fixed; z-index: -2; inset: 0; opacity: .43; pointer-events: none; background-image: linear-gradient(rgba(77,232,244,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(77,232,244,.035) 1px, transparent 1px); background-size: 42px 42px; mask-image: linear-gradient(to bottom, black, transparent 92%); }
.cpwb-maintenance-screen::after { content: ""; position: fixed; z-index: 8; inset: 0; opacity: .11; pointer-events: none; background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(255,255,255,.055) 4px); mix-blend-mode: soft-light; }
.cpwb-maintenance-topbar { display: grid; grid-template-columns: minmax(230px,1fr) auto minmax(230px,1fr); align-items: center; min-height: 58px; border-bottom: 1px solid rgba(77,232,244,.28); }
.cpwb-maintenance-brand { display: flex; align-items: center; gap: 15px; min-width: 0; }
.cpwb-maintenance-brand > span:last-child { display: grid; gap: 3px; }
.cpwb-maintenance-brand strong { font: 900 17px/1 "Arial Narrow", "Avenir Next Condensed", sans-serif; letter-spacing: .12em; }
.cpwb-maintenance-brand small { color: var(--cpwb-cyan); font: 700 8px/1 var(--cpwb-code); letter-spacing: .28em; }
.cpwb-maintenance-brand-mark { position: relative; width: 38px; height: 28px; border-top: 3px solid var(--cpwb-amber); border-bottom: 2px solid var(--cpwb-cyan); transform: skewX(-16deg); }
.cpwb-maintenance-brand-mark::before, .cpwb-maintenance-brand-mark::after { content: ""; position: absolute; height: 2px; background: currentColor; transform: skewX(32deg); }
.cpwb-maintenance-brand-mark::before { top: 7px; left: 7px; width: 24px; color: var(--cpwb-cyan); }
.cpwb-maintenance-brand-mark::after { bottom: 6px; left: -2px; width: 28px; color: var(--cpwb-amber); }
.cpwb-maintenance-protocol { justify-self: center; color: var(--cpwb-cyan); font: 800 9px/1 var(--cpwb-code); letter-spacing: .24em; }
.cpwb-maintenance-connection { justify-self: end; display: flex; align-items: center; gap: 10px; color: var(--cpwb-green); font: 800 8px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-maintenance-connection i { width: 7px; height: 7px; background: currentColor; box-shadow: 0 0 14px currentColor; animation: cpwb-maintenance-pulse 1.5s ease-in-out infinite; }
.cpwb-maintenance-manual .cpwb-maintenance-connection { color: #ff496f; }
.cpwb-maintenance-stage { width: min(1220px,100%); margin: auto; padding: clamp(42px,7vh,76px) 0 clamp(34px,5vh,54px); }
.cpwb-maintenance-card { position: relative; display: grid; grid-template-columns: minmax(0,1.18fr) minmax(310px,.82fr); min-height: 560px; overflow: hidden; border: 1px solid rgba(77,232,244,.28); background: linear-gradient(118deg, rgba(77,232,244,.035), transparent 44%), linear-gradient(300deg, rgba(255,73,111,.055), transparent 42%), rgba(10,15,23,.9); box-shadow: 0 34px 100px rgba(0,0,0,.48), inset 0 0 42px rgba(77,232,244,.025); backdrop-filter: blur(20px) saturate(115%); clip-path: polygon(0 0, calc(100% - 42px) 0, 100% 42px, 100% 100%, 26px 100%, 0 calc(100% - 26px)); }
.cpwb-maintenance-card::before { content: ""; position: absolute; z-index: 5; top: 0; left: 0; width: 38%; height: 4px; background: var(--cpwb-cyan); box-shadow: 0 0 18px rgba(77,232,244,.5); }
.cpwb-maintenance-main { position: relative; display: flex; flex-direction: column; min-width: 0; overflow: hidden; padding: clamp(34px,5vw,68px); border-right: 1px solid rgba(77,232,244,.26); }
.cpwb-maintenance-main > :not(.cpwb-maintenance-cyber-field) { position: relative; z-index: 3; }
.cpwb-maintenance-cyber-field { position: absolute; z-index: 1; inset: 0; overflow: hidden; pointer-events: none; }
.cpwb-maintenance-cyber-field::before { content: ""; position: absolute; inset: 8% 0 0 5%; opacity: .28; background: linear-gradient(90deg, transparent 0 13%, rgba(77,232,244,.19) 13% 13.15%, transparent 13.15% 47%, rgba(77,232,244,.12) 47% 47.15%, transparent 47.15%), linear-gradient(16deg, transparent 0 48%, rgba(255,181,27,.12) 48% 48.25%, transparent 48.25%), linear-gradient(164deg, transparent 0 56%, rgba(77,232,244,.1) 56% 56.2%, transparent 56.2%); clip-path: polygon(0 0,100% 0,100% 100%,9% 100%,0 88%); }
.cpwb-maintenance-cyber-field::after { content: ""; position: absolute; left: 6%; right: 5%; top: 48%; height: 1px; opacity: .28; background: linear-gradient(90deg,var(--cpwb-cyan),transparent 28%,transparent 70%,var(--cpwb-amber)); box-shadow: 0 82px 0 rgba(77,232,244,.14), 0 164px 0 rgba(77,232,244,.08); }
.cpwb-maintenance-code { position: absolute; top: 5%; right: 4%; color: transparent; opacity: .08; font: 950 clamp(64px,8vw,118px)/1 var(--cpwb-code); letter-spacing: -.08em; -webkit-text-stroke: 1px var(--cpwb-cyan); transform: skewX(-8deg); }
.cpwb-maintenance-radar { position: absolute; top: 17%; right: 5.5%; width: clamp(150px,19vw,245px); aspect-ratio: 1; opacity: .22; border: 1px solid var(--cpwb-cyan); border-radius: 50%; background: repeating-radial-gradient(circle,transparent 0 23px,rgba(77,232,244,.2) 24px 25px), repeating-conic-gradient(from 28deg,rgba(77,232,244,.16) 0 1deg,transparent 1deg 15deg); box-shadow: inset 0 0 34px rgba(77,232,244,.08), 0 0 30px rgba(77,232,244,.04); animation: cpwb-maintenance-radar 18s linear infinite; }
.cpwb-maintenance-radar::before, .cpwb-maintenance-radar::after { content: ""; position: absolute; background: var(--cpwb-cyan); opacity: .46; }
.cpwb-maintenance-radar::before { left: 50%; top: -12%; bottom: -12%; width: 1px; }
.cpwb-maintenance-radar::after { top: 50%; left: -12%; right: -12%; height: 1px; }
.cpwb-maintenance-radar i { position: absolute; top: 27%; right: 13%; width: 7px; height: 7px; background: var(--cpwb-amber); box-shadow: 0 0 15px var(--cpwb-amber); transform: rotate(45deg); animation: cpwb-maintenance-pulse 1.8s ease-in-out infinite; }
.cpwb-maintenance-datum { position: absolute; top: 63%; right: 5%; display: grid; grid-template-columns: auto auto; gap: 7px 15px; color: rgba(77,232,244,.42); font: 700 7px/1 var(--cpwb-code); letter-spacing: .13em; text-align: right; }
.cpwb-maintenance-datum b { color: rgba(255,181,27,.48); }
.cpwb-maintenance-scan { position: absolute; top: 0; left: -30%; width: 26%; height: 100%; opacity: .24; background: linear-gradient(90deg,transparent,rgba(77,232,244,.15),rgba(255,255,255,.1),transparent); transform: skewX(-19deg); animation: cpwb-maintenance-scan 6s ease-in-out infinite; }
.cpwb-maintenance-skyline { position: absolute; left: 3%; right: 3%; bottom: 0; display: flex; align-items: flex-end; gap: clamp(6px,1vw,13px); height: 31%; opacity: .17; mask-image: linear-gradient(to top,black 15%,rgba(0,0,0,.6) 58%,transparent 100%); }
.cpwb-maintenance-skyline span { position: relative; flex: 1; min-width: 8px; height: 48%; border: 1px solid var(--cpwb-cyan); border-bottom: 0; background: repeating-linear-gradient(to bottom,transparent 0 10px,rgba(77,232,244,.22) 10px 11px), linear-gradient(90deg,rgba(77,232,244,.06),transparent); clip-path: polygon(0 9px,9px 0,100% 0,100% 100%,0 100%); }
.cpwb-maintenance-skyline span:nth-child(2), .cpwb-maintenance-skyline span:nth-child(7) { height: 66%; flex: 1.25; }
.cpwb-maintenance-skyline span:nth-child(4), .cpwb-maintenance-skyline span:nth-child(9) { height: 79%; flex: 1.45; }
.cpwb-maintenance-skyline span:nth-child(6), .cpwb-maintenance-skyline span:nth-child(11) { height: 90%; }
.cpwb-maintenance-skyline span:nth-child(3n) { height: 38%; border-color: var(--cpwb-amber); }
.cpwb-maintenance-eyebrow { display: flex; align-items: center; gap: 14px; color: #ff496f; font: 800 9px/1 var(--cpwb-code); letter-spacing: .22em; }
.cpwb-maintenance-eyebrow::before { content: ""; width: 34px; height: 2px; background: currentColor; }
.cpwb-maintenance-main h1 { max-width: 780px; margin: 26px 0 15px; color: #f2eee9; font-size: clamp(48px,6vw,92px); font-weight: 950; line-height: .87; letter-spacing: -.055em; text-shadow: 0 10px 38px rgba(0,0,0,.84), 0 0 24px rgba(77,232,244,.045); text-transform: uppercase; }
.cpwb-maintenance-main h1 span { display: block; color: var(--cpwb-amber); }
.cpwb-maintenance-rollback .cpwb-maintenance-eyebrow, .cpwb-maintenance-rollback .cpwb-maintenance-main h1 span, .cpwb-maintenance-complete .cpwb-maintenance-eyebrow { color: var(--cpwb-green); }
.cpwb-maintenance-manual .cpwb-maintenance-main h1 span { color: #ff496f; }
.cpwb-maintenance-lead { max-width: 670px; margin: 0; color: #9ba6b5; font-size: clamp(14px,1.5vw,19px); line-height: 1.65; }
.cpwb-maintenance-core { position: relative; display: flex; align-items: center; gap: 22px; margin-top: auto; padding-top: 48px; }
.cpwb-maintenance-core-visual { position: relative; display: grid; place-items: center; flex: 0 0 110px; height: 110px; }
.cpwb-maintenance-core-visual::before, .cpwb-maintenance-core-visual::after { content: ""; position: absolute; inset: 8px; border: 1px solid var(--cpwb-cyan); transform: rotate(45deg); animation: cpwb-maintenance-core 5s linear infinite; }
.cpwb-maintenance-core-visual::after { inset: 25px; border-color: var(--cpwb-amber); animation-direction: reverse; animation-duration: 3.8s; }
.cpwb-maintenance-core-visual b { width: 16px; height: 16px; background: #f2eee9; box-shadow: 0 0 18px var(--cpwb-cyan), 0 0 36px var(--cpwb-cyan); transform: rotate(45deg); }
.cpwb-maintenance-signal { position: absolute; left: 104px; right: -68px; top: calc(50% + 24px); height: 1px; overflow: hidden; background: rgba(77,232,244,.26); }
.cpwb-maintenance-signal::after { content: ""; position: absolute; top: -1px; left: -22%; width: 22%; height: 3px; background: linear-gradient(90deg,transparent,var(--cpwb-cyan),white); box-shadow: 0 0 13px var(--cpwb-cyan); animation: cpwb-maintenance-travel 2.4s ease-in-out infinite; }
.cpwb-maintenance-core-copy { min-width: 0; }
.cpwb-maintenance-core-copy strong { display: block; margin-bottom: 8px; font: 900 14px/1.2 var(--cpwb-code); letter-spacing: .06em; }
.cpwb-maintenance-core-copy span { color: #778498; font: 650 10px/1.65 var(--cpwb-code); }
.cpwb-maintenance-recovery { margin-top: auto; padding: 22px 24px; border: 1px solid rgba(255,73,111,.36); border-left: 4px solid #ff496f; background: rgba(255,73,111,.11); }
.cpwb-maintenance-recovery > strong { display: flex; align-items: center; gap: 8px; color: #ff496f; font: 900 13px/1.3 var(--cpwb-code); }
.cpwb-maintenance-recovery > p { color: #a6afbb; font: 650 10px/1.6 var(--cpwb-code); }
.cpwb-maintenance-command { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 14px; padding: 13px 14px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.24); background: rgba(0,0,0,.35); font: 700 9px/1.4 var(--cpwb-code); }
.cpwb-maintenance-command code { min-width: 0; overflow-wrap: anywhere; user-select: all; }
.cpwb-maintenance-command button { display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto; padding: 7px 9px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.35); background: transparent; cursor: pointer; font: 700 8px/1 var(--cpwb-code); }
.cpwb-maintenance-command button:hover { color: #041015; background: var(--cpwb-cyan); }
.cpwb-maintenance-side { display: grid; grid-template-rows: auto 1fr auto; min-width: 0; background: rgba(3,7,12,.52); }
.cpwb-maintenance-side-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 32px 34px 25px; border-bottom: 1px solid rgba(77,232,244,.16); }
.cpwb-maintenance-side-head span { max-width: 230px; overflow-wrap: anywhere; color: var(--cpwb-cyan); font: 800 9px/1.4 var(--cpwb-code); letter-spacing: .12em; }
.cpwb-maintenance-side-head b { color: var(--cpwb-amber); font: 900 28px/1 var(--cpwb-code); }
.cpwb-maintenance-steps { margin: 0; padding: 10px 0; list-style: none; }
.cpwb-maintenance-step { position: relative; display: grid; grid-template-columns: 46px minmax(0,1fr) auto; align-items: center; gap: 8px; min-height: 83px; padding: 14px 30px 14px 34px; color: #667386; border-bottom: 1px solid rgba(77,232,244,.09); transition: color .2s ease, background .2s ease; }
.cpwb-maintenance-step::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: transparent; }
.cpwb-maintenance-step-index { font: 900 11px/1 var(--cpwb-code); }
.cpwb-maintenance-step-copy { display: grid; gap: 6px; }
.cpwb-maintenance-step-copy strong { color: currentColor; font-size: 15px; letter-spacing: .02em; }
.cpwb-maintenance-step-copy small { color: #596577; font: 650 8px/1.3 var(--cpwb-code); letter-spacing: .09em; }
.cpwb-maintenance-step-state { display: flex; align-items: center; gap: 4px; font: 800 8px/1 var(--cpwb-code); letter-spacing: .08em; }
.cpwb-maintenance-step.cpwb-done { color: var(--cpwb-green); }
.cpwb-maintenance-step.cpwb-active { color: #f2eee9; background: linear-gradient(90deg,rgba(77,232,244,.12),transparent); }
.cpwb-maintenance-step.cpwb-active::before { background: var(--cpwb-cyan); box-shadow: 0 0 18px var(--cpwb-cyan); }
.cpwb-maintenance-step.cpwb-active .cpwb-maintenance-step-index, .cpwb-maintenance-step.cpwb-active .cpwb-maintenance-step-state { color: var(--cpwb-cyan); }
.cpwb-maintenance-step.cpwb-active .cpwb-maintenance-step-index { animation: cpwb-maintenance-pulse 1.2s ease-in-out infinite; }
.cpwb-maintenance-step.cpwb-failed { color: #ff496f; background: rgba(255,73,111,.11); }
.cpwb-maintenance-step.cpwb-failed::before { background: #ff496f; }
.cpwb-maintenance-reconnect { margin: 18px 26px 28px; padding: 20px; border: 1px solid rgba(77,232,244,.26); background: rgba(77,232,244,.035); clip-path: var(--cpwb-cut-sm); }
.cpwb-maintenance-reconnect > strong { display: flex; align-items: center; gap: 11px; color: var(--cpwb-cyan); font: 850 11px/1.4 var(--cpwb-code); }
.cpwb-maintenance-reconnect > strong::before { content: ""; width: 8px; height: 8px; border: 2px solid var(--cpwb-cyan); border-right-color: transparent; animation: cpwb-maintenance-spin 1s linear infinite; }
.cpwb-maintenance-reconnect > p { margin: 10px 0 0; color: #778498; font: 600 9px/1.6 var(--cpwb-code); }
.cpwb-maintenance-reconnect > button { width: 100%; margin-top: 14px; }
.cpwb-maintenance-footer { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; min-height: 52px; color: #516074; border-top: 1px solid rgba(77,232,244,.14); font: 700 8px/1 var(--cpwb-code); letter-spacing: .1em; }
.cpwb-maintenance-footer > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-maintenance-footer strong { color: var(--cpwb-cyan); }
.cpwb-maintenance-footer > span:nth-child(2) { justify-self: center; }
.cpwb-maintenance-footer > span:last-child { justify-self: end; }

@keyframes cpwb-maintenance-radar { to { transform: rotate(360deg); } }
@keyframes cpwb-maintenance-scan { 0%,18% { left: -30%; } 70%,100% { left: 120%; } }
@keyframes cpwb-maintenance-pulse { 0%,100% { opacity: .42; } 50% { opacity: 1; } }
@keyframes cpwb-maintenance-core { to { transform: rotate(405deg); } }
@keyframes cpwb-maintenance-travel { 0% { left: -22%; } 70%,100% { left: 100%; } }
@keyframes cpwb-maintenance-spin { to { transform: rotate(360deg); } }

@media (max-height: 760px) and (min-width: 721px) {
  .cpwb-maintenance-screen { padding: 12px 24px 10px; }
  .cpwb-maintenance-topbar { min-height: 48px; }
  .cpwb-maintenance-stage { padding: 14px 0 12px; }
  .cpwb-maintenance-card { min-height: 525px; }
  .cpwb-maintenance-main { padding: 34px 40px; }
  .cpwb-maintenance-main h1 { margin: 19px 0 12px; font-size: clamp(46px,5vw,66px); }
  .cpwb-maintenance-lead { font-size: 14px; line-height: 1.55; }
  .cpwb-maintenance-core { padding-top: 28px; }
  .cpwb-maintenance-core-visual { flex-basis: 84px; height: 84px; }
  .cpwb-maintenance-side-head { padding: 22px 26px 18px; }
  .cpwb-maintenance-step { min-height: 67px; padding: 10px 24px 10px 27px; }
  .cpwb-maintenance-reconnect { margin: 12px 18px 18px; padding: 15px 16px; }
  .cpwb-maintenance-footer { min-height: 42px; }
}

@media (max-width: 720px) {
  .cpwb-maintenance-screen { grid-template-rows: auto auto auto; padding: 16px; }
  .cpwb-maintenance-topbar { grid-template-columns: minmax(0,1fr) auto; }
  .cpwb-maintenance-protocol { display: none; }
  .cpwb-maintenance-stage { padding: 28px 0; }
  .cpwb-maintenance-card { grid-template-columns: 1fr; min-height: 0; clip-path: polygon(0 0,calc(100% - 28px) 0,100% 28px,100% 100%,18px 100%,0 calc(100% - 18px)); }
  .cpwb-maintenance-main { min-height: 470px; border-right: 0; border-bottom: 1px solid rgba(77,232,244,.26); }
  .cpwb-maintenance-side { min-height: 520px; }
  .cpwb-maintenance-footer { grid-template-columns: 1fr; padding-top: 14px; }
  .cpwb-maintenance-footer > span:nth-child(2), .cpwb-maintenance-footer > span:last-child { justify-self: start; }
}

@media (max-width: 560px) {
  .cpwb-maintenance-brand small, .cpwb-maintenance-connection span { display: none; }
  .cpwb-maintenance-main { min-height: 430px; padding: 34px 24px; }
  .cpwb-maintenance-main h1 { font-size: 43px; }
  .cpwb-maintenance-core { gap: 15px; padding-top: 34px; }
  .cpwb-maintenance-core-visual { flex-basis: 76px; height: 76px; }
  .cpwb-maintenance-signal { left: 72px; }
  .cpwb-maintenance-radar { top: 25%; right: -6%; width: 170px; }
  .cpwb-maintenance-datum { display: none; }
  .cpwb-maintenance-skyline { height: 24%; }
  .cpwb-maintenance-side-head, .cpwb-maintenance-step { padding-left: 20px; padding-right: 20px; }
  .cpwb-maintenance-step { grid-template-columns: 34px minmax(0,1fr); }
  .cpwb-maintenance-step-state { grid-column: 2; }
  .cpwb-maintenance-command { align-items: stretch; flex-direction: column; }
  .cpwb-maintenance-command button { align-self: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .cpwb-maintenance-screen *, .cpwb-maintenance-screen *::before, .cpwb-maintenance-screen *::after { animation: none !important; transition-duration: .01ms !important; }
  .cpwb-maintenance-radar, .cpwb-maintenance-scan { visibility: hidden; }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .cpwb-maintenance-card { background-color: #090e16; }
}
 .cpwb-native-settings-section { min-width: 0; overflow: auto; padding: 22px 26px; color: var(--cpwb-text); background: linear-gradient(180deg, rgba(12,13,19,.94), rgba(8,9,13,.98)); } .cpwb-native-settings-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 18px; border-bottom: 1px solid rgba(0,240,255,.16); }.cpwb-settings-nav { display: grid; align-content: start; gap: 3px; padding: 18px 12px; border-right: 1px solid rgba(0,240,255,.13); }.cpwb-settings-nav > span { margin: 13px 8px 7px; color: var(--cpwb-cyan); font: 600 8px/1 var(--cpwb-code); letter-spacing: .15em; }.cpwb-settings-nav button { padding: 10px 9px; color: #92a1b4; border: 0; background: transparent; cursor: pointer; text-align: left; font-size: 11px; }.cpwb-settings-nav button:hover, .cpwb-settings-nav button.cpwb-active { color: var(--cpwb-text); background: rgba(0,240,255,.1); box-shadow: inset 2px 0 var(--cpwb-amber); }.cpwb-settings-content { min-width: 0; overflow: auto; padding: 34px; }.cpwb-settings-panel { max-width: 680px; display: grid; gap: 12px; padding: 20px; border: 1px solid rgba(0,240,255,.2); background: rgba(255,255,255,.02); }.cpwb-settings-panel h2 { margin: 0 0 4px; }.cpwb-settings-panel p { color: var(--cpwb-muted); font-size: 12px; line-height: 1.55; }.cpwb-settings-panel label { display: grid; gap: 6px; color: #9da9b8; font: 600 9px/1 var(--cpwb-code); letter-spacing: .08em; }.cpwb-settings-panel input, .cpwb-settings-panel select { min-width: 0; padding: 9px; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.25); background: rgba(0,0,0,.25); outline: none; }.cpwb-settings-panel input:focus, .cpwb-settings-panel select:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }.cpwb-settings-panel button { justify-self: start; padding: 8px 12px; color: var(--cpwb-text); border: 1px solid rgba(0,240,255,.3); background: rgba(0,240,255,.05); cursor: pointer; }.cpwb-settings-panel button:hover { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }.cpwb-settings-actions, .cpwb-settings-index { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }.cpwb-settings-panel fieldset { display: grid; gap: 9px; border: 1px solid rgba(139,159,181,.2); }.cpwb-settings-panel legend { color: var(--cpwb-cyan); font: 600 9px/1 var(--cpwb-code); }.cpwb-settings-message { color: var(--cpwb-green) !important; }.cpwb-settings-panel pre { max-width: 100%; overflow: auto; color: var(--cpwb-cyan); font-size: 10px; }

/* Workbench section inside the native SettingsRoot. Native settings owns the
   modal and close affordance; this section stays a clean, single-level panel. */
.cpwb-native-settings-section {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100%;
  overflow: visible;
  padding: 0;
  color: var(--cpwb-text);
  background: transparent;
}
.cpwb-native-settings-header {
  display: block;
  padding: 2px 0 17px;
  border-bottom: 1px solid var(--cpwb-border);
}
.cpwb-native-settings-header h2 { margin: 7px 0 6px; font-size: 21px; }
.cpwb-native-settings-header p { margin: 0; color: var(--cpwb-muted); font-size: 10px; line-height: 1.5; }
.cpwb-eyebrow { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-settings-nav {
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  gap: 0;
  overflow-x: auto;
  padding: 10px 0 0;
  border-right: 0;
  border-bottom: 1px solid var(--cpwb-border);
}
.cpwb-settings-nav button {
  position: relative;
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0 12px;
  color: var(--cpwb-muted);
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 10px;
}
.cpwb-settings-nav button::after { content: ""; position: absolute; left: 12px; right: 12px; bottom: -1px; height: 2px; background: var(--cpwb-amber); transform: scaleX(0); }
.cpwb-settings-nav button:hover,
.cpwb-settings-nav button.cpwb-active { color: var(--cpwb-text); background: var(--cpwb-cyan-soft); box-shadow: none; }
.cpwb-settings-nav button.cpwb-active::after { transform: scaleX(1); }
.cpwb-settings-content { min-width: 0; overflow: visible; padding: 18px 0 0; }
.cpwb-settings-archive { min-height: 430px; }
.cpwb-settings-archive-header { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 16px; padding: 17px 18px; border: 1px solid var(--cpwb-border); border-left: 2px solid var(--cpwb-cyan); background: linear-gradient(105deg, rgba(8,13,19,.86), rgba(38,8,16,.3)); clip-path: var(--cpwb-cut-sm); }
.cpwb-settings-archive-header h2 { margin: 7px 0 5px; color: var(--cpwb-text); font-size: 20px; }
.cpwb-settings-archive-header p { margin: 0; color: var(--cpwb-muted); font-size: 10px; line-height: 1.5; }
.cpwb-settings-archive-header > strong { color: var(--cpwb-amber); font: 700 24px/1 var(--cpwb-code); }
.cpwb-settings-archive .cpwb-session-filters { grid-template-columns: minmax(180px, 1fr) 122px auto; margin-bottom: 13px; }
.cpwb-settings-archive .cpwb-session-list { gap: 6px; }
.cpwb-settings-archive .cpwb-session-list-row { min-height: 56px; }
.cpwb-settings-archive .cpwb-session-list-open { padding: 9px 12px; }
.cpwb-settings-archive .cpwb-session-pagination { margin-top: 0; }
.cpwb-settings-panel { display: grid; max-width: none; gap: 12px; padding: 19px; border: 1px solid var(--cpwb-border); background: var(--cpwb-surface-panel); clip-path: var(--cpwb-cut-sm); }
.cpwb-settings-panel:has(.cpwb-cyber-select-trigger[aria-expanded="true"]) { overflow: visible; clip-path: none; }
.cpwb-settings-panel label { color: var(--cpwb-text-secondary); }
.cpwb-settings-panel input,
.cpwb-settings-panel select,
.cpwb-settings-panel textarea { color: var(--cpwb-text); border-color: var(--cpwb-border); background: var(--cpwb-surface-input); }
.cpwb-prompt-settings textarea { box-sizing: border-box; width: 100%; min-height: 132px; padding: 12px; resize: vertical; outline: none; font: 11px/1.6 var(--cpwb-code); }
.cpwb-prompt-settings textarea:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }
.cpwb-settings-panel button { color: var(--cpwb-text); border-color: var(--cpwb-border-strong); background: var(--cpwb-cyan-soft); }
.cpwb-settings-panel fieldset { border-color: var(--cpwb-border); }
.cpwb-auth-state { position: relative; display: grid; grid-template-columns: 42px minmax(0,1fr); align-items: center; gap: 12px; min-height: 72px; padding: 13px 15px; overflow: hidden; border: 1px solid var(--cpwb-border); background: linear-gradient(100deg, rgba(0,240,255,.06), rgba(255,255,255,.015)); }
.cpwb-auth-state::after { content: ""; position: absolute; top: 0; right: 0; width: 44px; height: 3px; background: var(--cpwb-cyan); box-shadow: 0 0 14px rgba(0,240,255,.45); }
.cpwb-auth-online { border-color: rgba(83,216,165,.38); }
.cpwb-auth-online::after { background: var(--cpwb-green); box-shadow: 0 0 14px rgba(83,216,165,.4); }
.cpwb-auth-icon { display: grid; place-items: center; width: 40px; height: 40px; color: var(--cpwb-cyan); border: 1px solid currentColor; background: rgba(0,240,255,.05); clip-path: var(--cpwb-cut-sm); }
.cpwb-auth-online .cpwb-auth-icon { color: var(--cpwb-green); background: rgba(83,216,165,.06); }
.cpwb-auth-state strong { color: var(--cpwb-text); font: 700 10px/1.2 var(--cpwb-code); letter-spacing: .11em; }
.cpwb-auth-state p { margin: 5px 0 0; }
.cpwb-auth-privacy { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; color: var(--cpwb-cyan); border-left: 2px solid var(--cpwb-cyan); background: rgba(0,240,255,.035); }
.cpwb-auth-privacy svg { flex: 0 0 auto; margin-top: 1px; }
.cpwb-auth-privacy p { margin: 0; }
.cpwb-settings-panel button.cpwb-auth-connect { display: inline-flex; align-items: center; gap: 8px; min-height: 39px; padding: 0 15px; color: #111217; border-color: var(--cpwb-amber); background: var(--cpwb-amber); font-weight: 750; }
.cpwb-settings-panel button.cpwb-auth-connect:hover { color: #05070a; border-color: #ffd45c; background: #ffd45c; box-shadow: 0 0 24px rgba(255,184,25,.18); }
.cpwb-settings-panel button:disabled { cursor: not-allowed; opacity: .48; }
.cpwb-auth-activation { color: var(--cpwb-green); font: 650 8px/1 var(--cpwb-code); letter-spacing: .12em; }
.cpwb-auth-unavailable { color: #ff7188 !important; }
.cpwb-spin { animation: cpwb-spin .75s linear infinite; }
@keyframes cpwb-spin { to { transform: rotate(360deg); } }

/* Workbench-owned select control. Native macOS select popovers cannot inherit
   the app palette, so every Workbench choice uses this one accessible shell. */
.cpwb-cyber-select { position: relative; z-index: 2; box-sizing: border-box; width: 100%; min-width: 0; color: var(--cpwb-text); font-family: var(--cpwb-ui); letter-spacing: 0; }
.cpwb-cyber-select:focus-within { z-index: 150; }
.cpwb-cyber-select-trigger { appearance: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-sizing: border-box; width: 100%; min-width: 0; min-height: 40px; padding: 0 12px; overflow: hidden; color: var(--cpwb-text); border: 1px solid var(--cpwb-border-strong); background: linear-gradient(105deg, rgba(77,232,244,.045), var(--cpwb-surface-input) 42%); box-shadow: inset 2px 0 rgba(77,232,244,.42); clip-path: var(--cpwb-cut-sm); cursor: pointer; text-align: left; font: 600 11px/1.2 var(--cpwb-ui); }
.cpwb-cyber-select-trigger > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-cyber-select-trigger > svg { flex: 0 0 auto; color: var(--cpwb-cyan); transition: transform .16s ease; }
.cpwb-cyber-select-trigger:hover,
.cpwb-cyber-select-trigger:focus-visible,
.cpwb-cyber-select-trigger[aria-expanded="true"] { color: var(--cpwb-text); border-color: var(--cpwb-cyan); background: linear-gradient(105deg, rgba(77,232,244,.13), rgba(9,14,20,.98)); box-shadow: inset 2px 0 var(--cpwb-cyan), 0 10px 28px rgba(0,0,0,.24); outline: none; }
.cpwb-cyber-select-trigger[aria-expanded="true"] { box-shadow: inset 3px 0 var(--cpwb-amber), 0 10px 28px rgba(0,0,0,.3); }
.cpwb-cyber-select-trigger[aria-expanded="true"] > svg { color: var(--cpwb-amber); transform: rotate(180deg); }
.cpwb-cyber-select-trigger:disabled { cursor: not-allowed; opacity: .45; }
.cpwb-cyber-select-placeholder { color: var(--cpwb-text-muted); }
.cpwb-cyber-select-list { position: absolute; z-index: 160; top: calc(100% + 5px); left: 0; right: 0; display: grid; max-height: min(320px, 46vh); padding: 4px; overflow: auto; border: 1px solid var(--cpwb-cyan); background: rgba(7,11,17,.99); box-shadow: 0 22px 56px rgba(0,0,0,.64), inset 2px 0 rgba(77,232,244,.13); clip-path: var(--cpwb-cut-sm); scrollbar-width: thin; scrollbar-color: rgba(77,232,244,.4) transparent; }
.cpwb-cyber-select-list [role="option"] { appearance: none; display: grid; grid-template-columns: minmax(0,1fr) 18px; align-items: center; gap: 8px; width: 100%; min-height: 38px; padding: 0 10px; color: var(--cpwb-text-secondary); border: 0; border-bottom: 1px solid rgba(77,232,244,.1); background: transparent; box-shadow: none; cursor: pointer; text-align: left; font: 600 10px/1.25 var(--cpwb-ui); }
.cpwb-cyber-select-list [role="option"]:last-child { border-bottom: 0; }
.cpwb-cyber-select-list [role="option"] > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-cyber-select-list [role="option"] > svg { justify-self: end; color: var(--cpwb-amber); }
.cpwb-cyber-select-list [role="option"].cpwb-selected { color: var(--cpwb-amber); background: rgba(255,184,25,.075); box-shadow: inset 2px 0 var(--cpwb-amber); }
.cpwb-cyber-select-list [role="option"]:hover,
.cpwb-cyber-select-list [role="option"]:focus-visible { color: #e9fbff; border-color: rgba(77,232,244,.45); background: rgba(77,232,244,.14); box-shadow: inset 2px 0 var(--cpwb-cyan); outline: none; }
.cpwb-cyber-select-list [role="option"]:disabled { cursor: not-allowed; opacity: .4; }
.cpwb-settings-panel .cpwb-cyber-select-trigger,
.cpwb-settings-panel .cpwb-cyber-select-list [role="option"] { justify-self: stretch; }
.cpwb-settings-panel .cpwb-cyber-select-trigger:hover,
.cpwb-settings-panel .cpwb-cyber-select-trigger:focus-visible,
.cpwb-settings-panel .cpwb-cyber-select-trigger[aria-expanded="true"] { color: var(--cpwb-text); }
.cpwb-settings-panel .cpwb-cyber-select-list [role="option"]:hover,
.cpwb-settings-panel .cpwb-cyber-select-list [role="option"]:focus-visible { color: #e9fbff; }
.cpwb-session-filters > .cpwb-cyber-select { min-width: 0; }
.cpwb-context-filters .cpwb-cyber-select-trigger { min-height: 32px; padding: 0 8px; font: 550 9px/1 var(--cpwb-code); }
.cpwb-owner-select .cpwb-cyber-select-trigger { min-height: 44px; }

/* rc.2 composer fusion. Native DSH remains the owner of model selection,
   attachments, Files API and @ references; Workbench only adds readable
   chrome and a shared cyberpunk visual language around those public seats. */
.cpwb-model-indicator { appearance: none; display: inline-flex; align-items: center; gap: 8px; min-height: 34px; max-width: min(220px, 28vw); padding: 0 11px; color: #e8edf2; border: 1px solid rgba(77,232,244,.38); background: linear-gradient(105deg, rgba(77,232,244,.08), rgba(15,17,24,.92)); box-shadow: inset 2px 0 var(--cpwb-cyan); clip-path: var(--cpwb-cut-sm); cursor: pointer; font: 650 10px/1 var(--cpwb-code); }
.cpwb-model-indicator span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-model-indicator svg { flex: 0 0 auto; color: var(--cpwb-cyan); }
.cpwb-model-indicator:hover, .cpwb-model-indicator:focus-visible { color: #061014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 20px rgba(77,232,244,.2); outline: none; }
.cpwb-model-indicator:hover svg, .cpwb-model-indicator:focus-visible svg { color: #061014; }
.cpwb-model-indicator:disabled { cursor: not-allowed; opacity: .45; }
body:has(.cpwb-app-shell[data-page="conversation"]):has(.cpwb-model-indicator) [data-slot="conversation.input.model"] button[aria-haspopup="menu"] { box-sizing: border-box !important; width: 1px !important; min-width: 1px !important; max-width: 1px !important; height: 34px !important; min-height: 34px !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; opacity: 0 !important; border: 0 !important; pointer-events: none !important; }
body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"], body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] { color: #edf2f5 !important; border: 1px solid rgba(77,232,244,.55) !important; background: #0a0e16 !important; box-shadow: 0 18px 52px rgba(0,0,0,.58), inset 2px 0 rgba(77,232,244,.12) !important; }
body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"] [role="menuitem"], body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] [role="menuitem"] { color: #edf2f5 !important; border-bottom-color: rgba(77,232,244,.14) !important; opacity: 1 !important; }
body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"] [role="menuitem"] span, body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] [role="menuitem"] span { color: inherit !important; }
body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"] [role="menuitem"]:hover, body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] [role="menuitem"]:hover { color: #061014 !important; background: var(--cpwb-cyan) !important; }
.cpwb-image-attachment-button { appearance: none; display: grid; place-items: center; width: 34px; height: 34px; padding: 0; color: #aeb8c6; border: 1px solid rgba(77,232,244,.34); background: rgba(8,12,18,.9); cursor: pointer; clip-path: var(--cpwb-cut-sm); }
.cpwb-image-attachment-button:hover, .cpwb-image-attachment-button:focus-visible { color: #061014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 18px rgba(77,232,244,.18); outline: none; }
.cpwb-image-attachment-button:disabled { cursor: not-allowed; opacity: .38; }
.cpwb-image-attachment-input { position: fixed !important; width: 1px !important; height: 1px !important; overflow: hidden !important; opacity: 0 !important; pointer-events: none !important; }
body:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] { box-sizing: border-box; width: 100%; max-width: none; }
body:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] > * { box-sizing: border-box; width: 100%; max-width: none; border-color: rgba(77,232,244,.52); background: rgba(8,11,17,.98); box-shadow: 0 -16px 48px rgba(0,0,0,.46), 0 0 0 1px rgba(77,232,244,.06); }
body:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] [role="option"]:hover,
body:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] [role="option"][aria-selected="true"] { color: #061014; background: var(--cpwb-cyan); }
body:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.attachments"] { width: 100%; }
body:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.attachments"] button { border-color: rgba(77,232,244,.42); background: rgba(8,12,18,.92); }

/* Wide, transcript-first Subagent activity drawer. */
.cpwb-subagent-backdrop { position: fixed; z-index: 190; inset: 0; display: flex; justify-content: flex-end; background: rgba(2,4,8,.56); backdrop-filter: blur(4px); pointer-events: auto; }
.cpwb-subagent-drawer { position: relative; display: grid; grid-template-rows: auto auto auto minmax(0,1fr) auto auto; width: clamp(440px, 42vw, 680px); height: 100dvh; min-width: 0; overflow: hidden; color: var(--cpwb-text); border: 0; border-left: 1px solid rgba(77,232,244,.58); background: radial-gradient(circle at 100% 0, rgba(96,19,32,.34), transparent 34%), linear-gradient(180deg, rgba(10,13,20,.985), rgba(5,7,12,.995)); box-shadow: -36px 0 90px rgba(0,0,0,.56), inset 2px 0 rgba(77,232,244,.08); animation: cpwb-drawer-in .24s cubic-bezier(.2,.8,.2,1); }
.cpwb-subagent-drawer::before { content: ""; position: absolute; z-index: 2; top: 0; left: 0; width: 38%; height: 3px; background: var(--cpwb-cyan); box-shadow: 0 0 18px rgba(77,232,244,.5); }
.cpwb-subagent-drawer-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 74px; padding: 16px 18px; border-bottom: 1px solid rgba(77,232,244,.2); }
.cpwb-subagent-heading { display: flex; align-items: center; gap: 11px; min-width: 0; }
.cpwb-subagent-heading > svg { color: var(--cpwb-cyan); }
.cpwb-subagent-heading span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .2em; }
.cpwb-subagent-heading h2 { margin: 6px 0 0; color: #f0eee8; font-size: 17px; }
.cpwb-subagent-header-actions { display: flex; gap: 6px; }
.cpwb-subagent-header-actions button, .cpwb-subagent-info-layer header button { appearance: none; display: grid; place-items: center; width: 35px; height: 35px; color: #aeb8c6; border: 1px solid rgba(77,232,244,.28); background: rgba(9,13,19,.78); cursor: pointer; }
.cpwb-subagent-header-actions button:hover, .cpwb-subagent-info-layer header button:hover { color: #061014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); }
.cpwb-subagent-header-actions button:disabled { cursor: not-allowed; opacity: .3; }
.cpwb-subagent-selector { position: relative; z-index: 5; padding: 12px 18px 0; }
.cpwb-subagent-selector-trigger { appearance: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 55px; padding: 0 15px; color: #f0eee8; border: 1px solid rgba(77,232,244,.42); background: rgba(13,17,24,.94); box-shadow: inset 3px 0 var(--cpwb-amber); clip-path: var(--cpwb-cut-sm); cursor: pointer; text-align: left; }
.cpwb-subagent-selector-trigger > span { display: grid; min-width: 0; gap: 5px; }
.cpwb-subagent-selector-trigger strong { overflow: hidden; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-subagent-selector-trigger small { color: var(--cpwb-green); font: 650 7px/1 var(--cpwb-code); letter-spacing: .13em; }
.cpwb-subagent-selector-trigger svg { color: var(--cpwb-cyan); }
.cpwb-subagent-selector-trigger:hover, .cpwb-subagent-selector-trigger[aria-expanded="true"] { border-color: var(--cpwb-cyan); background: rgba(77,232,244,.1); box-shadow: inset 3px 0 var(--cpwb-cyan), 0 0 24px rgba(77,232,244,.08); }
.cpwb-subagent-selector-menu { position: absolute; z-index: 8; top: calc(100% - 1px); left: 18px; right: 18px; max-height: min(48vh, 390px); overflow: auto; border: 1px solid var(--cpwb-cyan); background: #080c12; box-shadow: 0 22px 48px rgba(0,0,0,.62); }
.cpwb-subagent-selector-menu button { appearance: none; display: grid; grid-template-columns: 36px minmax(0,1fr) auto; align-items: center; gap: 9px; width: 100%; min-height: 65px; padding: 7px 12px; color: #bac4d0; border: 0; border-bottom: 1px solid rgba(77,232,244,.13); background: #090d14; cursor: pointer; text-align: left; }
.cpwb-subagent-selector-menu button b { color: var(--cpwb-amber); font: 700 9px/1 var(--cpwb-code); }
.cpwb-subagent-selector-menu button span { display: grid; min-width: 0; gap: 5px; }
.cpwb-subagent-selector-menu button strong { overflow: hidden; color: inherit; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-subagent-selector-menu button small { color: #607084; font: 600 7px/1 var(--cpwb-code); letter-spacing: .09em; }
.cpwb-subagent-selector-menu button em { color: #6b788a; font: 650 7px/1 var(--cpwb-code); font-style: normal; }
.cpwb-subagent-selector-menu button:hover, .cpwb-subagent-selector-menu button:focus-visible, .cpwb-subagent-selector-menu button.cpwb-selected { color: #061014; background: var(--cpwb-cyan); outline: none; }
.cpwb-subagent-selector-menu button:hover small, .cpwb-subagent-selector-menu button:hover em, .cpwb-subagent-selector-menu button:focus-visible small, .cpwb-subagent-selector-menu button:focus-visible em, .cpwb-subagent-selector-menu button.cpwb-selected small, .cpwb-subagent-selector-menu button.cpwb-selected em { color: rgba(6,16,20,.7); }
.cpwb-subagent-selector-menu button:hover b, .cpwb-subagent-selector-menu button:focus-visible b, .cpwb-subagent-selector-menu button.cpwb-selected b { color: #061014; }
.cpwb-subagent-statusbar { display: flex; align-items: center; gap: 10px; min-height: 38px; margin: 0 18px; padding: 0 4px; color: #647286; border-bottom: 1px solid rgba(77,232,244,.15); font: 650 7px/1 var(--cpwb-code); letter-spacing: .12em; }
.cpwb-subagent-statusbar span { color: #718095; }.cpwb-subagent-statusbar span.cpwb-running { color: var(--cpwb-green); }.cpwb-subagent-statusbar b { color: var(--cpwb-amber); }.cpwb-subagent-statusbar small { margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-subagent-transcript { min-height: 0; overflow-x: hidden; overflow-y: auto; padding: 17px 18px 22px; scrollbar-width: thin; scrollbar-color: rgba(77,232,244,.3) transparent; }
.cpwb-subagent-message { position: relative; display: grid; gap: 7px; max-width: 86%; margin-bottom: 14px; padding: 12px 14px; border: 1px solid rgba(77,232,244,.14); background: rgba(14,18,25,.74); clip-path: var(--cpwb-cut-sm); }
.cpwb-subagent-message span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-subagent-message p { margin: 0; color: #c9d0d9; font-size: 11px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
.cpwb-subagent-message-user { margin-left: auto; border-color: rgba(255,181,27,.2); background: rgba(255,181,27,.055); }.cpwb-subagent-message-user span { color: var(--cpwb-amber); }
.cpwb-subagent-message-tool { max-width: 94%; margin-left: auto; margin-right: auto; border-style: dashed; background: rgba(77,232,244,.025); }.cpwb-subagent-message-tool p { color: #748399; font: 600 9px/1.45 var(--cpwb-code); }
.cpwb-subagent-empty { display: grid; place-items: center; align-content: center; gap: 9px; min-height: 100%; padding: 28px; color: #607084; text-align: center; }.cpwb-subagent-empty svg { color: var(--cpwb-cyan); }.cpwb-subagent-empty strong { color: #99a6b6; font-size: 12px; }.cpwb-subagent-empty p { max-width: 330px; margin: 0; font-size: 10px; line-height: 1.6; }
.cpwb-subagent-error { margin: 0 18px 10px; padding: 9px 11px; color: #ff8a9e; border-left: 2px solid var(--cpwb-magenta); background: rgba(255,42,109,.07); font-size: 10px; }
.cpwb-subagent-readonly { min-height: 54px; padding: 18px; color: #677589; border-top: 1px solid rgba(77,232,244,.16); background: rgba(4,7,11,.74); text-align: center; font: 650 8px/1 var(--cpwb-code); letter-spacing: .1em; }
.cpwb-subagent-composer { display: grid; gap: 8px; padding: 12px 18px 16px; border-top: 1px solid rgba(77,232,244,.2); background: rgba(5,8,13,.88); }
.cpwb-subagent-composer textarea { box-sizing: border-box; width: 100%; min-height: 68px; resize: vertical; padding: 11px 12px; color: #e4e8ed; border: 1px solid rgba(77,232,244,.28); background: rgba(10,13,19,.9); outline: none; font: 11px/1.55 var(--cpwb-ui); }
.cpwb-subagent-composer textarea:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }
.cpwb-subagent-composer > div { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #607084; font: 650 8px/1 var(--cpwb-code); }
.cpwb-subagent-composer button { appearance: none; display: inline-flex; align-items: center; gap: 7px; min-height: 34px; padding: 0 12px; cursor: pointer; font: 700 8px/1 var(--cpwb-code); }
.cpwb-subagent-stop { color: #ff8a9e; border: 1px solid rgba(255,42,109,.36); background: rgba(255,42,109,.06); }.cpwb-subagent-stop:hover { color: #fff; border-color: var(--cpwb-magenta); background: var(--cpwb-magenta); }
.cpwb-subagent-send { color: #071014; border: 1px solid var(--cpwb-amber); background: var(--cpwb-amber); }.cpwb-subagent-send:hover { filter: brightness(1.08); }.cpwb-subagent-send:disabled { cursor: not-allowed; opacity: .38; }
.cpwb-subagent-info-layer { position: absolute; z-index: 12; inset: 0; overflow: auto; color: var(--cpwb-text); background: radial-gradient(circle at 80% 0, rgba(96,19,32,.4), transparent 42%), #080b11; animation: cpwb-rise .2s ease-out; }
.cpwb-subagent-info-layer header { display: flex; align-items: center; justify-content: space-between; min-height: 76px; padding: 14px 18px; border-bottom: 1px solid rgba(77,232,244,.24); }.cpwb-subagent-info-layer header span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .2em; }.cpwb-subagent-info-layer h3 { margin: 7px 0 0; font-size: 18px; }
.cpwb-subagent-info-grid { display: grid; gap: 22px; padding: 24px 20px; }.cpwb-subagent-info-grid dl { display: grid; gap: 1px; margin: 0; border: 1px solid rgba(77,232,244,.2); }.cpwb-subagent-info-grid dl div { display: grid; grid-template-columns: 130px minmax(0,1fr); min-height: 48px; border-bottom: 1px solid rgba(77,232,244,.12); }.cpwb-subagent-info-grid dl div:last-child { border-bottom: 0; }.cpwb-subagent-info-grid dt, .cpwb-subagent-info-grid dd { display: flex; align-items: center; margin: 0; padding: 10px 12px; }.cpwb-subagent-info-grid dt { color: var(--cpwb-cyan); border-right: 1px solid rgba(77,232,244,.14); font: 650 8px/1 var(--cpwb-code); letter-spacing: .11em; }.cpwb-subagent-info-grid dd { overflow-wrap: anywhere; color: #b5c0cd; font: 600 9px/1.5 var(--cpwb-code); }.cpwb-subagent-info-grid p { margin: 0; padding: 14px 16px; color: #8391a3; border-left: 2px solid var(--cpwb-amber); background: rgba(255,181,27,.045); font-size: 10px; line-height: 1.7; }
body:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"] nav button[aria-current="true"] {
  color: var(--cpwb-amber);
  background: var(--cpwb-amber-soft);
  box-shadow: inset 2px 0 var(--cpwb-amber);
}

@keyframes cpwb-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cpwb-scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
@keyframes cpwb-pulse { to { opacity: .35; transform: scale(.75); } }
@keyframes cpwb-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }

@media (max-width: 1199px) {
  .cpwb-home { grid-template-columns: 176px minmax(0,1fr); }
  .cpwb-home-main { padding-left: 32px; padding-right: 32px; }
  .cpwb-home-footer { left: 176px; padding-left: 32px; padding-right: 32px; }
  .cpwb-project-grid { grid-template-columns: repeat(2, minmax(230px, 1fr)); }
  .cpwb-knowledge-grid { grid-template-columns: repeat(2, minmax(220px, 1fr)); }
}

@media (max-width: 899px) {
  .cpwb-home { grid-template-columns: 62px minmax(0, 1fr); }
  .cpwb-home-identity { display: flex; padding: 14px 7px 12px; }
  .cpwb-home-identity .cpwb-brand-name, .cpwb-home-identity .cpwb-home-telemetry, .cpwb-home-identity .cpwb-brand-codes, .cpwb-home-identity .cpwb-sidebar-status, .cpwb-home-identity .cpwb-wordmark-main, .cpwb-home-identity .cpwb-wordmark-sub { display: none; }
  .cpwb-home-identity .cpwb-brand-mark { width: 42px; height: 15px; margin: 0 auto; }
  .cpwb-home-identity .cpwb-sidebar-brand-footer { margin-top: auto; }
  .cpwb-home-identity .cpwb-wordmark-launcher { width: 46px; padding: 9px 5px 8px; }
  .cpwb-home-identity .cpwb-wordmark-compact { display: block; }
  .cpwb-home-main { height: 100%; box-sizing: border-box; padding: 28px 22px 76px; }
  .cpwb-home-footer { left: 62px; padding-left: 22px; padding-right: 22px; }
  .cpwb-hero { margin-bottom: 42px; }.cpwb-hero h1 { font-size: clamp(34px, 9vw, 62px); }
  .cpwb-project-grid { grid-template-columns: repeat(2, minmax(210px, 1fr)); }
  .cpwb-project-card { min-height: 235px; }
  .cpwb-row { flex-wrap: wrap; }.cpwb-row > .cpwb-input { flex: 1 1 100%; }
  .cpwb-fullscreen-shell { grid-template-columns: 220px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-tool-open { grid-template-columns: 220px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-sidebar-collapsed { grid-template-columns: 62px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-sidebar-collapsed.cpwb-tool-open { grid-template-columns: 62px minmax(0, 1fr); }.cpwb-sidebar { padding: 12px 7px; }.cpwb-tool-rail { position: fixed; z-index: 90; top: 0; right: 0; bottom: 0; width: min(88vw, 360px); box-shadow: -25px 0 60px rgba(0,0,0,.5); }.cpwb-session-context { padding: 10px 18px; }.cpwb-session-view { padding: 15px 12px; }

}

@media (max-height: 640px) {
  .cpwb-home-identity { padding-top: 18px; padding-bottom: 12px; }
  .cpwb-brand-codes { display: none; }
  .cpwb-home-telemetry { gap: 2px; }
  .cpwb-home-telemetry span { padding: 6px 0; }
  .cpwb-sidebar { padding-top: 12px; padding-bottom: 10px; }
  .cpwb-sidebar-project { margin-top: 12px; margin-bottom: 10px; }
  .cpwb-sidebar-item { padding-top: 9px; padding-bottom: 9px; }
  .cpwb-sidebar-brand-footer { gap: 6px; margin-top: 7px; padding-top: 7px; }
}

@media (max-width: 620px) {
  .cpwb-home-main { padding: 22px 14px 74px; }
  .cpwb-hero { margin-bottom: 35px; padding-left: 17px; }.cpwb-hero-kicker { letter-spacing: .13em; }.cpwb-hero h1 { font-size: clamp(31px, 11.5vw, 48px); line-height: .94; }.cpwb-hero p { margin-top: 17px; letter-spacing: .1em; }
  .cpwb-home-section > header { align-items: center; }.cpwb-home-section { margin-bottom: 38px; }
  .cpwb-folder-add { grid-template-columns: 28px; min-width: 46px; width: 46px; padding: 8px; }.cpwb-folder-add b { left: 26px; }.cpwb-folder-add em { display: none; }
  .cpwb-project-grid, .cpwb-knowledge-grid { grid-template-columns: 1fr; }
  .cpwb-project-card { min-height: 225px; }.cpwb-card-symbol { margin-top: 25px; }
  .cpwb-knowledge-card { min-height: 96px; }
  .cpwb-inline-create input { min-width: 110px; max-width: 130px; }
  .cpwb-home-footer span { display: none; }
  .cpwb-wordmark-launcher { left: 8px; bottom: 8px; width: 108px; }.cpwb-wordmark-main { font-size: 13px; }
  .cpwb-tab { padding-left: 2px; padding-right: 2px; }.cpwb-tab span { font-size: 8px; }
  .cpwb-session-context strong { font-size: 14px; }.cpwb-form-grid { grid-template-columns: 1fr; gap: 0; }.cpwb-settings-nav { grid-template-columns: repeat(2, minmax(0,1fr)); overflow: auto; max-height: 190px; border-right: 0; border-bottom: 1px solid rgba(0,240,255,.13); }.cpwb-settings-nav > span { grid-column: 1 / -1; }.cpwb-settings-content { padding: 18px; }
  body .cpwb-subagent-drawer { width: 100vw; }
  .cpwb-subagent-selector { padding-left: 12px; padding-right: 12px; }
  .cpwb-subagent-selector-menu { left: 12px; right: 12px; }
  .cpwb-subagent-selector-menu button { grid-template-columns: 30px minmax(0,1fr); }
  .cpwb-subagent-selector-menu button em { display: none; }
  body .cpwb-model-indicator { max-width: 150px; padding-left: 9px; padding-right: 9px; }
}

@media (max-width: 390px) {
  .cpwb-hero h1 { font-size: 30px; }
  .cpwb-kcard-new { display: none; }
  .cpwb-knowledge-card { grid-template-columns: 45px minmax(0,1fr); }
  .cpwb-home-footer { font-size: 6px; }
}

/* Unified-shell responsive behavior. Tablet keeps a compact docked navigation
   and moves project tools into a modal drawer; mobile makes both sides modal. */
.cpwb-mobile-nav-trigger,
.cpwb-project-tool-toggle {
  appearance: none;
  position: absolute;
  z-index: 80;
  top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  color: var(--cpwb-text);
  border: 1px solid var(--cpwb-border-strong);
  background: var(--cpwb-surface-raised);
  box-shadow: var(--cpwb-shadow-1);
  clip-path: var(--cpwb-cut-sm);
  cursor: pointer;
  pointer-events: auto;
}
.cpwb-mobile-nav-trigger { left: 12px; width: 42px; justify-content: center; padding: 0; }
.cpwb-project-tool-toggle { right: 12px; padding: 0 13px; color: var(--cpwb-amber); }
.cpwb-responsive-drawer {
  position: fixed;
  z-index: 150;
  top: 0;
  bottom: 0;
  width: min(88vw, 320px);
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  color: var(--cpwb-text);
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: var(--cpwb-shadow-2);
  clip-path: none;
  pointer-events: auto;
}
.cpwb-responsive-drawer::backdrop { background: rgba(1, 3, 7, .74); backdrop-filter: blur(5px); }
.cpwb-drawer-left { left: 0; right: auto; }
.cpwb-drawer-right { left: auto; right: 0; }
.cpwb-responsive-drawer .cpwb-global-sidebar { width: 100%; }
.cpwb-responsive-drawer .cpwb-project-rail-drawer { position: relative; inset: auto; width: 100%; height: 100%; }
.cpwb-sidebar-settings {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 11px;
  color: var(--cpwb-text-secondary);
  border: 1px solid var(--cpwb-border-strong);
  background: var(--cpwb-surface-raised);
  clip-path: var(--cpwb-cut-sm);
  cursor: pointer;
}
.cpwb-sidebar-settings:hover { color: var(--cpwb-text); background: var(--cpwb-cyan-soft); }

/* Zero-id pending conversation: visually identical to the active Workbench
   shell, but no durable DSH id exists until the first send is admitted. */
.cpwb-draft-conversation {
  box-sizing: border-box;
  min-width: 0;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
  grid-template-rows: 64px minmax(0, 1fr);
  padding: 0;
  overflow: hidden;
  color: var(--cpwb-text);
  background:
    radial-gradient(circle at 76% 8%, rgba(121, 25, 43, .22), transparent 34%),
    linear-gradient(180deg, rgba(7, 10, 15, .96), rgba(8, 9, 14, .99));
}
.cpwb-draft-conversation > header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
  padding: 0 18px;
  border-bottom: 1px solid rgba(0, 240, 255, .22);
  background: rgba(7, 11, 17, .76);
  box-shadow: inset 2px 0 var(--cpwb-cyan);
}
.cpwb-pending-identity { display: flex; align-items: baseline; min-width: 0; gap: 12px; }
.cpwb-pending-identity span { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-pending-identity strong { overflow: hidden; color: var(--cpwb-text); text-overflow: ellipsis; white-space: nowrap; }
.cpwb-pending-identity small { color: var(--cpwb-text-muted); font: 550 8px/1 var(--cpwb-code); letter-spacing: .05em; white-space: nowrap; }
.cpwb-draft-conversation > header > button { flex: 0 0 auto; color: var(--cpwb-muted); border: 1px solid transparent; background: transparent; cursor: pointer; }
.cpwb-draft-conversation > header > button:hover { color: var(--cpwb-cyan); border-color: rgba(77,232,244,.28); }
.cpwb-pending-main { box-sizing: border-box; display: grid; grid-template-rows: minmax(0, 1fr) auto; min-width: 0; min-height: 0; padding: 22px clamp(18px, 3.4vw, 56px) 28px; overflow: hidden; }
.cpwb-draft-empty { align-self: center; justify-self: center; max-width: 520px; text-align: center; color: var(--cpwb-text-secondary); }
.cpwb-draft-empty svg { color: var(--cpwb-cyan); }
.cpwb-draft-empty h2 { margin: 16px 0 8px; color: var(--cpwb-text); font-size: clamp(20px, 2.1vw, 30px); }
.cpwb-draft-empty p { margin: 0; line-height: 1.75; }
.cpwb-draft-composer {
  box-sizing: border-box;
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  width: min(100%, 920px);
  margin: 0 auto;
  padding: 12px 14px 14px;
  border: 1px solid rgba(0, 240, 255, .38);
  border-left-width: 2px;
  background: rgba(10, 13, 20, .82);
  box-shadow: 0 18px 48px rgba(0, 0, 0, .32);
}
.cpwb-draft-composer:focus-within { border-color: var(--cpwb-cyan); box-shadow: 0 18px 48px rgba(0,0,0,.32), 0 0 0 1px rgba(77,232,244,.12); }
.cpwb-draft-composer textarea { box-sizing: border-box; min-height: 88px; resize: vertical; padding: 8px 10px 12px; color: var(--cpwb-text); border: 0; outline: 0; background: transparent; font: inherit; }
.cpwb-pending-composer-tools { display: flex; align-items: center; gap: 9px; padding-top: 11px; border-top: 1px solid rgba(139,159,181,.14); }
.cpwb-pending-tool { appearance: none; display: grid; place-items: center; flex: 0 0 40px; width: 40px; height: 40px; padding: 0; color: #a5afbd; border: 1px solid rgba(77,232,244,.28); background: rgba(5,9,14,.56); cursor: pointer; }
.cpwb-pending-tool:hover { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); }
.cpwb-pending-model { position: relative; min-width: 0; }
.cpwb-pending-model-trigger { appearance: none; display: flex; align-items: center; gap: 8px; min-height: 40px; max-width: min(340px, 38vw); padding: 0 13px; color: #c4cbd5; border: 1px solid rgba(77,232,244,.28); background: rgba(5,9,14,.56); cursor: pointer; }
.cpwb-pending-model-trigger span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-pending-model-trigger:hover, .cpwb-pending-model-trigger[aria-expanded="true"] { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); background: rgba(77,232,244,.08); }
.cpwb-pending-model-menu { box-sizing: border-box; position: absolute; z-index: 75; left: 0; bottom: calc(100% + 9px); display: grid; gap: 8px; width: min(520px, calc(100vw - 340px)); max-height: min(60vh, 540px); padding: 13px; overflow: auto; color: var(--cpwb-text); border: 1px solid var(--cpwb-cyan); background: rgba(8,11,17,.98); box-shadow: 0 24px 70px rgba(0,0,0,.64), inset 2px 0 var(--cpwb-amber); clip-path: var(--cpwb-cut-lg); }
.cpwb-pending-model-menu-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 10px; color: var(--cpwb-cyan); border-bottom: 1px solid rgba(77,232,244,.2); font: 650 8px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-pending-model-menu-head button { color: var(--cpwb-text-muted); border: 0; background: transparent; cursor: pointer; }
.cpwb-pending-model-menu-head button:hover { color: var(--cpwb-cyan); }
.cpwb-pending-model-menu section { display: grid; gap: 4px; }
.cpwb-pending-model-menu h3 { margin: 4px 7px; color: #667488; font: 650 8px/1 var(--cpwb-code); letter-spacing: .12em; }
.cpwb-pending-model-menu section > button { display: grid; gap: 4px; padding: 10px 11px; color: #b8c2cf; border: 1px solid transparent; background: transparent; text-align: left; cursor: pointer; }
.cpwb-pending-model-menu section > button:hover, .cpwb-pending-model-menu section > button.cpwb-active { color: var(--cpwb-cyan); border-color: rgba(77,232,244,.48); background: rgba(77,232,244,.09); box-shadow: inset 2px 0 var(--cpwb-cyan); }
.cpwb-pending-model-menu section small { color: #667488; font-size: 9px; }
.cpwb-pending-reasoning { display: grid; gap: 8px; padding-top: 10px; border-top: 1px solid rgba(77,232,244,.16); }
.cpwb-pending-reasoning > span { color: #748195; font: 650 8px/1 var(--cpwb-code); letter-spacing: .14em; }
.cpwb-pending-reasoning > div { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
.cpwb-pending-reasoning button { min-height: 35px; color: #aab4c1; border: 1px solid rgba(77,232,244,.25); background: rgba(3,6,10,.54); cursor: pointer; }
.cpwb-pending-reasoning button:hover, .cpwb-pending-reasoning button.cpwb-active { color: #071014; border-color: var(--cpwb-amber); background: var(--cpwb-amber); }
.cpwb-pending-send { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 104px; min-height: 40px; margin-left: auto; padding: 0 18px; color: #090a0e; border: 0; background: var(--cpwb-amber); font-weight: 760; cursor: pointer; clip-path: var(--cpwb-cut-sm); }
.cpwb-pending-send:hover { filter: brightness(1.08); }
.cpwb-pending-send:disabled { opacity: .45; cursor: not-allowed; }
.cpwb-draft-error { margin: 10px 2px 0; color: var(--cpwb-red); font-size: 11px; }
.cpwb-pending-attachments { display: flex; gap: 8px; overflow-x: auto; padding: 2px 2px 10px; }
.cpwb-pending-attachments figure { position: relative; flex: 0 0 70px; width: 70px; height: 54px; margin: 0; overflow: hidden; border: 1px solid rgba(77,232,244,.38); background: #05080c; }
.cpwb-pending-attachments img { width: 100%; height: 100%; object-fit: cover; }
.cpwb-pending-attachments button { position: absolute; top: 3px; right: 3px; display: grid; place-items: center; width: 20px; height: 20px; padding: 0; color: #fff; border: 1px solid rgba(255,255,255,.32); background: rgba(2,3,6,.78); cursor: pointer; }
.cpwb-pending-context { box-sizing: border-box; min-width: 0; padding: 24px 18px; overflow: auto; border-left: 1px solid rgba(77,232,244,.28); background: linear-gradient(180deg, rgba(12,16,22,.95), rgba(7,9,14,.98)); box-shadow: -22px 0 60px rgba(0,0,0,.3); }
.cpwb-pending-context > span { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .18em; }
.cpwb-pending-context h2 { margin: 10px 0 6px; overflow-wrap: anywhere; font-size: 18px; }
.cpwb-pending-context > small { color: var(--cpwb-text-muted); font-size: 9px; }
.cpwb-pending-context > div { display: grid; gap: 8px; margin-top: 24px; }
.cpwb-pending-context article { display: flex; align-items: center; gap: 9px; padding: 11px; color: #aab5c3; border: 1px solid rgba(77,232,244,.15); border-left: 2px solid var(--cpwb-cyan); background: rgba(255,255,255,.018); font-size: 10px; }
.cpwb-pending-context article svg { flex: 0 0 auto; color: var(--cpwb-amber); }

.cpwb-new-session-host { width: min(680px, calc(100vw - 28px)); padding: 0; color: var(--cpwb-text); border: 1px solid rgba(0, 240, 255, .42); background: rgba(8, 10, 16, .97); box-shadow: 0 28px 90px rgba(0, 0, 0, .66); clip-path: var(--cpwb-cut-lg); }
.cpwb-new-session-host::backdrop { background: rgba(2, 3, 7, .78); backdrop-filter: blur(7px); }
.cpwb-new-session-dialog { display: grid; gap: 22px; padding: clamp(22px, 4vw, 38px); }
.cpwb-new-session-dialog header { padding-left: 18px; border-left: 2px solid var(--cpwb-cyan); }
.cpwb-new-session-dialog header > span { color: var(--cpwb-cyan); font: 650 9px/1 var(--cpwb-code); letter-spacing: .2em; }
.cpwb-new-session-dialog h2 { margin: 8px 0 6px; font-size: 28px; }
.cpwb-new-session-dialog header p { margin: 0; color: var(--cpwb-muted); line-height: 1.55; }
.cpwb-owner-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; padding: 0; border: 0; }
.cpwb-owner-options legend, .cpwb-owner-select > span { margin-bottom: 9px; color: var(--cpwb-muted); font: 650 9px/1 var(--cpwb-code); letter-spacing: .15em; text-transform: uppercase; }
.cpwb-owner-options legend { grid-column: 1 / -1; }
.cpwb-owner-options label { position: relative; display: flex; align-items: center; gap: 9px; min-height: 50px; padding: 0 13px; color: var(--cpwb-text-secondary); border: 1px solid var(--cpwb-border-strong); background: rgba(14, 17, 24, .76); cursor: pointer; }
.cpwb-owner-options label.cpwb-active { color: var(--cpwb-text); border-color: var(--cpwb-cyan); background: var(--cpwb-cyan-soft); box-shadow: inset 3px 0 0 var(--cpwb-cyan); }
.cpwb-owner-options input { position: absolute; opacity: 0; pointer-events: none; }
.cpwb-owner-select { display: grid; }
.cpwb-owner-select select { min-height: 44px; padding: 0 12px; color: var(--cpwb-text); border: 1px solid var(--cpwb-border-strong); background: var(--cpwb-surface-raised); }
.cpwb-context-preview { padding: 15px 17px; border: 1px solid rgba(0, 240, 255, .2); background: rgba(0, 240, 255, .035); }
.cpwb-context-preview > div { display: flex; align-items: center; gap: 9px; color: var(--cpwb-cyan); }
.cpwb-context-preview ul { margin: 11px 0 0 26px; padding: 0; color: var(--cpwb-text-secondary); line-height: 1.7; }
.cpwb-new-session-dialog footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
.cpwb-button-ghost, .cpwb-button-primary { min-height: 42px; padding: 0 17px; border: 1px solid var(--cpwb-border-strong); cursor: pointer; }
.cpwb-button-ghost { color: var(--cpwb-text-secondary); background: transparent; }
.cpwb-button-primary { display: inline-flex; align-items: center; gap: 8px; color: #08090d; border-color: var(--cpwb-amber); background: var(--cpwb-amber); font-weight: 760; }
.cpwb-button-primary:disabled { opacity: .42; cursor: not-allowed; }

@media (min-width: 900px) and (max-width: 1279px) {
  .cpwb-app-shell { grid-template-columns: 190px minmax(0, 1fr); }
  .cpwb-global-sidebar { padding: 14px 12px 12px; }
  .cpwb-sidebar-product { grid-template-columns: 30px minmax(0, 1fr); gap: 8px; margin-bottom: 15px; }
  .cpwb-sidebar-product-mark { width: 30px; height: 30px; }
  .cpwb-sidebar-product-wordmark { width: min(100%, 102px); }
  .cpwb-sidebar-new { min-height: 40px; }
  .cpwb-sidebar-nav-item { min-height: 36px; }
  .cpwb-sidebar-recents { margin-top: 15px; }
  .cpwb-sidebar-recent { padding: 7px 6px; }
  .cpwb-sidebar-fixed-footer .cpwb-sidebar-brand-footer { padding-top: 4px; }
  .cpwb-sidebar-footer-wordmark { width: 158px; }
  .cpwb-workbench-page { padding: 30px 26px; }
  .cpwb-knowledge-center-body > div { grid-template-columns: minmax(220px, .8fr) minmax(0, 1.2fr); }
  .cpwb-has-context-rail .cpwb-session-context-bar { right: 130px; }
}

@media (max-width: 899px) {
  .cpwb-app-shell { grid-template-columns: minmax(0, 1fr); }
  .cpwb-workbench-page { padding: 62px 14px 18px; }
  .cpwb-home-main { padding-top: 68px; }
  .cpwb-home-footer { left: 0; }
  .cpwb-project-grid { grid-template-columns: 1fr; }
  .cpwb-knowledge-center-body > div { grid-template-columns: 1fr; }
  .cpwb-session-filters { grid-template-columns: minmax(0, 1fr); }
  .cpwb-page-header { align-items: flex-start; padding: 16px 16px 18px; }.cpwb-page-header-stat { align-self: flex-end; }.cpwb-page-header-stat strong { font-size: 18px; }
  .cpwb-session-list-open { grid-template-columns: auto minmax(0, 1fr); }
  .cpwb-session-list-row time { display: none; }
  .cpwb-session-list-action { min-width: 42px; padding: 0 10px; }
  .cpwb-responsive-drawer .cpwb-global-sidebar { padding: 16px 14px 12px; }
  .cpwb-session-context-bar { top: 58px; left: 12px; right: 12px; }
  .cpwb-has-context-rail .cpwb-session-context-bar { right: 12px; }
  .cpwb-session-context-bar small,
  .cpwb-session-context-bar em { display: none; }
  .cpwb-session-context-meta { display: flex; }
  .cpwb-session-id { max-width: 125px; }
  .cpwb-session-subagent-trigger span { display: none; }
  .cpwb-subagent-drawer { width: min(92vw, 620px); }
  .cpwb-model-indicator { max-width: 190px; }
  .cpwb-recurrence-picker { grid-template-columns: repeat(2, 1fr); }
  .cpwb-schedule-row { grid-template-columns: 28px minmax(0,1fr) 27px 27px; }.cpwb-schedule-state { display: none; }
  body:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:not(.cpwb-responsive-drawer):has(nav button[aria-current]) {
    flex-direction: column;
    width: calc(100vw - 24px);
    max-width: none;
    height: calc(100dvh - 24px);
    max-height: none;
  }
  body:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:not(.cpwb-responsive-drawer):has(nav button[aria-current]) > nav {
    box-sizing: border-box;
    width: 100%;
    padding: 15px 12px 0;
  }
  body:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:not(.cpwb-responsive-drawer):has(nav button[aria-current]) > nav > div:last-child {
    flex-direction: row;
    overflow-x: auto;
  }
  .cpwb-settings-content { padding-top: 14px; }
  .cpwb-settings-archive .cpwb-session-filters { grid-template-columns: minmax(0, 1fr); }
  .cpwb-settings-archive-header { align-items: flex-start; padding: 15px; }
  .cpwb-draft-conversation { grid-template-columns: minmax(0, 1fr); grid-template-rows: 58px minmax(0, 1fr); }
  .cpwb-draft-conversation > header { padding-left: 64px; }
  .cpwb-pending-context { display: none; }
  .cpwb-pending-main { padding: 18px 12px 14px; }
  .cpwb-pending-identity small { display: none; }
  .cpwb-pending-model-menu { width: min(520px, calc(100vw - 48px)); }
  .cpwb-owner-options { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .cpwb-pending-identity { gap: 8px; }
  .cpwb-pending-identity span { display: none; }
  .cpwb-pending-main { padding-left: 8px; padding-right: 8px; }
  .cpwb-draft-empty p { font-size: 11px; }
  .cpwb-pending-composer-tools { gap: 6px; }
  .cpwb-pending-model-trigger { max-width: calc(100vw - 190px); padding: 0 9px; }
  .cpwb-pending-send { min-width: 44px; width: 44px; padding: 0; font-size: 0; }
}

@media (hover: none) {
  .cpwb-sidebar-session-action,
  .cpwb-session-id-copy { opacity: 1; pointer-events: auto; }
}

@media (prefers-reduced-motion: reduce) {
  .cpwb-project-card, .cpwb-knowledge-card, .cpwb-card-scan, .cpwb-drawer, .cpwb-home-loading i, .cpwb-generation-wave::before, .cpwb-generation-wave::after, .cpwb-entry-arrived, .cpwb-entry-arrived::after { animation: none !important; }
  .cpwb-generation-wave::after { width: 28%; transform: none; opacity: .72; }
  .cpwb-entry-arrived::after { display: none; }
  .cpwb-project-card, .cpwb-knowledge-card, .cpwb-folder-add { transition: none !important; }
}

@media (prefers-reduced-transparency: reduce) {
  .cpwb-home-identity,
  .cpwb-project-card,
  .cpwb-knowledge-card,
  .cpwb-panel,
  .cpwb-global-sidebar,
  .cpwb-project-rail,
  .cpwb-responsive-drawer,
  .cpwb-settings-panel,
  .cpwb-wordmark-launcher {
    backdrop-filter: none;
    background-color: var(--cpwb-surface-panel);
  }
}

/* Knowledge Backplane \u2014 approved knowledge-chip production surface. */
.cpwb-knowledge-center {
  padding: 31px clamp(24px, 4vw, 62px) 54px;
  color: var(--cpwb-text);
  background:
    radial-gradient(circle at 84% 2%, rgba(96, 22, 34, .42), transparent 34%),
    linear-gradient(135deg, #06080d, #090a10 58%, #07080d);
  font-family: "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif;
}
.cpwb-knowledge-center::before {
  content: "";
  position: fixed;
  z-index: 100;
  inset: 0;
  pointer-events: none;
  opacity: .12;
  background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,.035) 3px 4px);
  mix-blend-mode: soft-light;
}
.cpwb-knowledge-page-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  max-width: 1320px;
  margin-bottom: 20px;
  padding: 18px 22px 20px;
}
.cpwb-knowledge-page-head h1 { font: 760 clamp(27px, 3.3vw, 46px)/.95 "Avenir Next Condensed", "Arial Narrow", "PingFang SC", sans-serif; }
.cpwb-knowledge-page-head p { max-width: 680px; line-height: 1.55; }
.cpwb-knowledge-head-actions { display: flex; align-items: center; justify-content: flex-end; gap: 9px; }
.cpwb-kb-action {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  color: var(--cpwb-text);
  border: 1px solid rgba(77,232,244,.28);
  background: rgba(77,232,244,.045);
  cursor: pointer;
  font: 700 9px/1 var(--cpwb-code);
  letter-spacing: .08em;
  clip-path: var(--cpwb-cut-sm);
  transition: transform .16s ease, color .16s ease, background .16s ease, border-color .16s ease;
}
.cpwb-kb-action:hover { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); transform: translateY(-1px); }
.cpwb-kb-action:active { transform: translateY(1px) scale(.99); }
.cpwb-kb-action:disabled { cursor: not-allowed; opacity: .42; transform: none; }
.cpwb-kb-action-primary { color: #090b11; border-color: var(--cpwb-amber); background: var(--cpwb-amber); }
.cpwb-kb-action-primary:hover { color: #090b11; border-color: #ffc340; background: #ffc340; }
.cpwb-kb-action-ghost { color: #8f9cad; background: rgba(7,9,15,.52); }
.cpwb-kb-action-danger { color: #ff8295; border-color: rgba(255,77,109,.42); background: rgba(255,77,109,.05); }
.cpwb-kb-action-danger:hover { color: white; border-color: var(--cpwb-magenta); background: var(--cpwb-magenta); }
.cpwb-knowledge-eyebrow { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .2em; }
.cpwb-knowledge-board {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 318px;
  gap: 56px;
  box-sizing: border-box;
  width: min(100%, 1320px);
  min-height: 590px;
  margin: 0 auto;
  padding: 28px;
  overflow: hidden;
  border: 1px solid rgba(77,232,244,.17);
  background:
    linear-gradient(rgba(77,232,244,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(77,232,244,.025) 1px, transparent 1px),
    radial-gradient(circle at 89% 32%, rgba(77,232,244,.055), transparent 28%),
    rgba(7,10,15,.72);
  background-size: 34px 34px, 34px 34px, auto, auto;
  clip-path: var(--cpwb-cut-lg);
}
.cpwb-knowledge-board::before { content: ""; position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 1px rgba(255,255,255,.025), inset 0 0 80px rgba(0,0,0,.54); }
.cpwb-knowledge-chip-area { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-content: start; gap: 22px; min-width: 0; }
.cpwb-knowledge-chip-area-title { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 24px; color: #6c7a8d; font: 650 8px/1 var(--cpwb-code); letter-spacing: .15em; }
.cpwb-knowledge-chip-area-title b { color: var(--cpwb-cyan); }
.cpwb-knowledge-chip {
  appearance: none;
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-width: 0;
  min-height: 214px;
  padding: 19px 20px 18px;
  overflow: visible;
  color: var(--cpwb-text);
  border: 1px solid rgba(77,232,244,.29);
  background: linear-gradient(145deg, rgba(18,24,34,.98), rgba(8,11,17,.98));
  box-shadow: 0 20px 42px rgba(0,0,0,.27), inset 0 1px rgba(255,255,255,.025);
  clip-path: var(--cpwb-cut-lg);
  cursor: pointer;
  text-align: left;
  transition: transform .24s cubic-bezier(.2,.8,.2,1), border-color .2s ease, box-shadow .2s ease;
}
.cpwb-knowledge-chip::before,
.cpwb-knowledge-chip::after { content: ""; position: absolute; top: 31px; bottom: 31px; width: 7px; opacity: .68; background: repeating-linear-gradient(180deg, var(--cpwb-cyan) 0 3px, transparent 3px 12px); }
.cpwb-knowledge-chip::before { left: -8px; }
.cpwb-knowledge-chip::after { right: -8px; transition: filter .2s ease; }
.cpwb-knowledge-chip:hover,
.cpwb-knowledge-chip:focus-visible,
.cpwb-knowledge-chip.cpwb-preview,
.cpwb-knowledge-chip.cpwb-selected { transform: translateY(-5px); border-color: var(--cpwb-cyan); box-shadow: 0 28px 50px rgba(0,0,0,.36), inset 0 0 0 1px rgba(77,232,244,.08); outline: none; }
.cpwb-knowledge-chip.cpwb-selected { border-color: var(--cpwb-amber); }
.cpwb-knowledge-chip.cpwb-selected::before,
.cpwb-knowledge-chip.cpwb-selected::after { background: repeating-linear-gradient(180deg, var(--cpwb-amber) 0 3px, transparent 3px 12px); }
.cpwb-knowledge-chip:hover::after,
.cpwb-knowledge-chip:focus-visible::after,
.cpwb-knowledge-chip.cpwb-preview::after { filter: drop-shadow(0 0 5px var(--cpwb-cyan)); }
.cpwb-knowledge-chip-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .15em; }
.cpwb-knowledge-chip-state { color: var(--cpwb-green); white-space: nowrap; }
.cpwb-knowledge-chip-state.cpwb-state-indexing { color: var(--cpwb-amber); }
.cpwb-knowledge-chip-state.cpwb-state-attention { color: #ff8295; }
.cpwb-knowledge-chip-state.cpwb-state-empty { color: #6b788a; }
.cpwb-knowledge-chip-core { display: grid; grid-template-columns: 58px minmax(0, 1fr); align-items: center; gap: 15px; padding: 22px 0 18px; }
.cpwb-knowledge-die { position: relative; display: grid; place-items: center; width: 58px; height: 58px; color: var(--cpwb-cyan); border: 1px solid currentColor; background: rgba(77,232,244,.04); box-shadow: inset 0 0 0 7px rgba(77,232,244,.025); clip-path: var(--cpwb-cut-sm); }
.cpwb-knowledge-die::before { content: ""; width: 23px; height: 23px; border: 1px solid currentColor; box-shadow: inset 0 0 0 5px rgba(77,232,244,.05); transform: rotate(45deg); }
.cpwb-knowledge-die::after { content: ""; position: absolute; inset: 7px; border-top: 1px solid rgba(77,232,244,.18); border-bottom: 1px solid rgba(77,232,244,.18); }
.cpwb-knowledge-chip.cpwb-selected .cpwb-knowledge-die { color: var(--cpwb-amber); background: rgba(255,181,27,.04); }
.cpwb-knowledge-chip-copy { min-width: 0; }
.cpwb-knowledge-chip-copy h2 { margin: 0 0 6px; overflow: hidden; color: var(--cpwb-text); font: 720 19px/1 "Avenir Next Condensed", "Arial Narrow", "PingFang SC", sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-knowledge-chip-copy p { display: -webkit-box; margin: 0; overflow: hidden; color: #718096; font-size: 10px; line-height: 1.5; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.cpwb-knowledge-chip-meta { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(77,232,244,.13); }
.cpwb-knowledge-chip-meta > span { display: grid; gap: 5px; padding: 12px 8px 0; color: #647286; border-right: 1px solid rgba(77,232,244,.1); font: 600 7px/1 var(--cpwb-code); letter-spacing: .08em; }
.cpwb-knowledge-chip-meta > span:first-child { padding-left: 0; }
.cpwb-knowledge-chip-meta > span:last-child { border-right: 0; }
.cpwb-knowledge-chip-meta b { color: #c4ccd7; font-size: 11px; }
.cpwb-knowledge-link { position: absolute; z-index: 3; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.cpwb-knowledge-link path { fill: none; stroke: var(--cpwb-cyan); stroke-width: 1.25; stroke-dasharray: 11 7; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 5px rgba(77,232,244,.36)); transition: d .2s cubic-bezier(.2,.8,.2,1), opacity .2s ease; }
.cpwb-knowledge-link circle { fill: var(--cpwb-cyan); filter: drop-shadow(0 0 5px rgba(77,232,244,.5)); }
.cpwb-knowledge-link-origin { fill: var(--cpwb-amber) !important; }
.cpwb-knowledge-link.cpwb-previewing .cpwb-knowledge-link-origin { fill: var(--cpwb-cyan) !important; }
.cpwb-knowledge-core {
  position: relative;
  z-index: 4;
  align-self: stretch;
  min-width: 0;
  min-height: 520px;
  padding: 22px 18px;
  border: 1px solid rgba(77,232,244,.34);
  background: linear-gradient(180deg, rgba(15,20,29,.98), rgba(7,10,15,.98));
  box-shadow: -18px 0 48px rgba(0,0,0,.28), inset 2px 0 rgba(77,232,244,.06);
  clip-path: var(--cpwb-cut-lg);
}
.cpwb-knowledge-core::before { content: ""; position: absolute; top: 0; left: 0; width: 44%; height: 3px; background: var(--cpwb-cyan); box-shadow: 0 0 13px rgba(77,232,244,.35); }
.cpwb-knowledge-core.cpwb-previewing { border-color: rgba(77,232,244,.72); }
.cpwb-knowledge-core-head { display: flex; align-items: start; justify-content: space-between; gap: 14px; padding-bottom: 18px; border-bottom: 1px solid rgba(77,232,244,.16); }
.cpwb-knowledge-core-head h2 { margin: 6px 0 0; overflow: hidden; font: 760 19px/1 "Avenir Next Condensed", "Arial Narrow", "PingFang SC", sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-knowledge-core-head small { display: block; margin-top: 7px; color: #637186; font: 650 7px/1 var(--cpwb-code); letter-spacing: .13em; }
.cpwb-knowledge-core-mark { display: grid; place-items: center; flex: 0 0 auto; width: 42px; height: 42px; color: var(--cpwb-amber); border: 1px solid var(--cpwb-amber); font: 800 14px/1 var(--cpwb-code); clip-path: var(--cpwb-cut-sm); }
.cpwb-knowledge-core.cpwb-previewing .cpwb-knowledge-core-mark { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }
.cpwb-knowledge-core-section { padding: 18px 0; border-bottom: 1px solid rgba(77,232,244,.12); }
.cpwb-knowledge-core-section:last-child { border-bottom: 0; }
.cpwb-knowledge-core-label { display: flex; justify-content: space-between; gap: 12px; color: #69788b; font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; }
.cpwb-knowledge-core-label b { color: var(--cpwb-cyan); }
.cpwb-knowledge-sockets { display: grid; gap: 8px; margin-top: 12px; }
.cpwb-knowledge-socket { position: relative; display: grid; grid-template-columns: 28px minmax(0,1fr) auto; align-items: center; gap: 9px; min-height: 48px; padding: 7px 9px; color: #aeb9c8; border: 1px solid rgba(77,232,244,.17); background: rgba(77,232,244,.035); clip-path: var(--cpwb-cut-sm); }
.cpwb-knowledge-socket.cpwb-live { border-color: rgba(77,232,244,.42); background: linear-gradient(90deg, rgba(77,232,244,.1), transparent); }
.cpwb-knowledge-socket.cpwb-empty-socket { grid-template-columns: 28px minmax(0,1fr); border-style: dashed; background: rgba(255,181,27,.025); }
.cpwb-knowledge-socket > i { display: grid; place-items: center; width: 28px; height: 28px; color: var(--cpwb-cyan); border: 1px solid currentColor; font: 750 9px/1 var(--cpwb-code); font-style: normal; }
.cpwb-knowledge-socket.cpwb-empty-socket > i { color: var(--cpwb-amber); }
.cpwb-knowledge-socket > span { display: grid; gap: 3px; min-width: 0; }
.cpwb-knowledge-socket strong { overflow: hidden; color: #d9dde3; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-knowledge-socket small { color: #617084; font: 600 7px/1 var(--cpwb-code); }
.cpwb-knowledge-socket em { color: var(--cpwb-green); font: 650 7px/1 var(--cpwb-code); font-style: normal; }
.cpwb-kb-core-action { width: 100%; margin-top: 12px; }
.cpwb-knowledge-activity { display: grid; gap: 8px; margin-top: 12px; }
.cpwb-knowledge-activity > div { display: grid; grid-template-columns: 46px minmax(0,1fr) auto; gap: 8px; align-items: center; color: #8d9aab; font-size: 9px; }
.cpwb-knowledge-activity time { color: #5d6c80; font: 600 7px/1 var(--cpwb-code); }
.cpwb-knowledge-activity b { color: var(--cpwb-amber); font: 650 7px/1 var(--cpwb-code); }
.cpwb-knowledge-activity p { margin: 0; color: #617084; font-size: 9px; }
.cpwb-knowledge-core-actions { padding-bottom: 0; }
.cpwb-knowledge-empty-board { display: grid; place-items: center; align-content: center; box-sizing: border-box; width: min(100%, 1320px); min-height: 540px; margin: 0 auto; padding: 48px; color: #718096; border: 1px dashed rgba(77,232,244,.26); background: linear-gradient(rgba(77,232,244,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(77,232,244,.025) 1px, transparent 1px), rgba(7,10,15,.72); background-size: 34px 34px; text-align: center; clip-path: var(--cpwb-cut-lg); }
.cpwb-knowledge-empty-board .cpwb-knowledge-die { margin-bottom: 22px; }
.cpwb-knowledge-empty-board h2 { margin: 12px 0 7px; color: var(--cpwb-text); font-size: 24px; }
.cpwb-knowledge-empty-board p { max-width: 520px; margin: 0 0 22px; line-height: 1.7; }
.cpwb-knowledge-page-error { width: min(100%, 1320px); margin: 0 auto 14px; }

/* Full-screen knowledge module creation. */
.cpwb-knowledge-create-layout { display: grid; grid-template-columns: minmax(300px, .72fr) minmax(0, 1.28fr); gap: 18px; width: min(100%, 1320px); min-height: 620px; margin: 0 auto; }
.cpwb-knowledge-panel { position: relative; padding: 20px; border: 1px solid rgba(77,232,244,.18); background: rgba(11,15,22,.84); clip-path: var(--cpwb-cut-sm); }
.cpwb-knowledge-panel::before { content: ""; position: absolute; top: 0; left: 0; width: 30%; height: 2px; background: var(--cpwb-cyan); }
.cpwb-knowledge-form { display: grid; align-content: start; gap: 24px; }
.cpwb-knowledge-form > label { display: grid; gap: 9px; }
.cpwb-knowledge-form > label > span { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .13em; }
.cpwb-knowledge-form input,
.cpwb-knowledge-form textarea { box-sizing: border-box; width: 100%; padding: 12px 13px; color: var(--cpwb-text); border: 1px solid rgba(77,232,244,.25); background: rgba(5,8,13,.72); outline: none; }
.cpwb-knowledge-form textarea { min-height: 128px; resize: vertical; }
.cpwb-knowledge-form input:focus,
.cpwb-knowledge-form textarea:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }
.cpwb-knowledge-form small { color: #657386; font-size: 9px; }
.cpwb-knowledge-runtime { display: grid; gap: 11px; }
.cpwb-knowledge-runtime > div { display: grid; grid-template-columns: 42px minmax(0,1fr) auto; align-items: center; gap: 12px; min-height: 68px; padding: 10px; border: 1px solid rgba(77,232,244,.17); background: rgba(77,232,244,.035); }
.cpwb-knowledge-runtime i { display: grid; place-items: center; width: 42px; height: 42px; color: var(--cpwb-cyan); border: 1px solid currentColor; font: 750 10px/1 var(--cpwb-code); font-style: normal; }
.cpwb-knowledge-runtime span { display: grid; gap: 5px; min-width: 0; }
.cpwb-knowledge-runtime strong { overflow: hidden; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-knowledge-upload-zone { display: flex; flex-direction: column; gap: 13px; }
.cpwb-knowledge-drop { display: grid; place-items: center; align-content: center; min-height: 320px; padding: 34px; color: #778699; border: 1px dashed rgba(77,232,244,.34); background: radial-gradient(circle at center, rgba(77,232,244,.06), transparent 58%), rgba(2,5,9,.25); cursor: pointer; text-align: center; }
.cpwb-knowledge-drop input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
.cpwb-knowledge-drop > span { display: grid; place-items: center; width: 66px; height: 66px; margin-bottom: 17px; color: var(--cpwb-amber); border: 1px solid var(--cpwb-amber); transform: rotate(45deg); }
.cpwb-knowledge-drop > span svg { transform: rotate(-45deg); }
.cpwb-knowledge-drop strong { color: var(--cpwb-text); font-size: 15px; }
.cpwb-knowledge-drop p { max-width: 520px; margin: 8px 0 0; font-size: 10px; line-height: 1.7; }
.cpwb-knowledge-drop:hover { border-color: var(--cpwb-cyan); background: radial-gradient(circle at center, rgba(77,232,244,.1), transparent 58%), rgba(2,5,9,.25); }
.cpwb-knowledge-selected-files { display: grid; gap: 7px; }
.cpwb-knowledge-selected-files > div { display: grid; grid-template-columns: 40px minmax(0,1fr) 30px; align-items: center; gap: 11px; min-height: 54px; padding: 7px 9px; border: 1px solid rgba(77,232,244,.13); }
.cpwb-knowledge-selected-files > div > b { display: grid; place-items: center; width: 38px; height: 36px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.3); font: 700 7px/1 var(--cpwb-code); }
.cpwb-knowledge-selected-files span { display: grid; gap: 4px; min-width: 0; }
.cpwb-knowledge-selected-files strong { overflow: hidden; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-knowledge-selected-files small { color: #617084; font-size: 8px; }
.cpwb-knowledge-selected-files button { display: grid; place-items: center; width: 28px; height: 28px; padding: 0; color: #7b899a; border: 0; background: transparent; cursor: pointer; }
.cpwb-knowledge-selected-files button:hover { color: white; background: var(--cpwb-magenta); }
.cpwb-knowledge-create-submit { align-self: flex-end; margin-top: auto; }
.cpwb-knowledge-local-error { margin: 0; padding: 10px 12px; color: #ff8295; border-left: 2px solid var(--cpwb-magenta); background: rgba(255,73,101,.07); font-size: 10px; }

/* Knowledge module detail. */
.cpwb-knowledge-detail { width: min(100%, 1320px); margin: 0 auto; }
.cpwb-knowledge-summary-strip { display: grid; grid-template-columns: repeat(4,1fr); margin-bottom: 18px; border: 1px solid rgba(77,232,244,.14); }
.cpwb-knowledge-summary-strip > div { display: grid; gap: 7px; padding: 14px; border-right: 1px solid rgba(77,232,244,.12); }
.cpwb-knowledge-summary-strip > div:last-child { border-right: 0; }
.cpwb-knowledge-summary-strip span { color: #637186; font: 600 7px/1 var(--cpwb-code); letter-spacing: .11em; }
.cpwb-knowledge-summary-strip b { color: var(--cpwb-text); font: 700 15px/1 var(--cpwb-code); }
.cpwb-knowledge-summary-strip b.cpwb-cyan { color: var(--cpwb-cyan); }
.cpwb-knowledge-detail-grid { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(290px,.75fr); gap: 18px; }
.cpwb-knowledge-files-panel > header,
.cpwb-knowledge-links-panel > header { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
.cpwb-knowledge-files-panel > header h2,
.cpwb-knowledge-links-panel > header h2 { margin: 0; font: 720 16px/1 "Avenir Next Condensed", "Arial Narrow", "PingFang SC", sans-serif; }
.cpwb-knowledge-files-panel > header span,
.cpwb-knowledge-links-panel > header span { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .14em; }
.cpwb-knowledge-compact-upload { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 13px; padding: 9px 11px; color: var(--cpwb-cyan); border: 1px dashed rgba(77,232,244,.32); cursor: pointer; font: 650 8px/1 var(--cpwb-code); }
.cpwb-knowledge-compact-upload input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.cpwb-knowledge-file-list { display: grid; gap: 8px; }
.cpwb-knowledge-file-row { display: grid; grid-template-columns: 38px minmax(0,1fr) minmax(105px,132px) 62px auto; align-items: center; gap: 12px; min-height: 58px; padding: 8px 10px; border: 1px solid rgba(77,232,244,.12); background: rgba(255,255,255,.012); }
.cpwb-knowledge-file-row > i { display: grid; place-items: center; width: 34px; height: 34px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.28); font: 700 7px/1 var(--cpwb-code); font-style: normal; }
.cpwb-knowledge-file-row > span:nth-child(2) { display: grid; gap: 4px; min-width: 0; }
.cpwb-knowledge-file-row > span:nth-child(2) strong { overflow: hidden; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.cpwb-knowledge-file-row > span:nth-child(2) small { color: #607084; font: 600 7px/1 var(--cpwb-code); }
.cpwb-knowledge-file-progress { display: grid; gap: 6px; }
.cpwb-knowledge-file-progress > span { height: 3px; overflow: hidden; background: rgba(255,255,255,.04); }
.cpwb-knowledge-file-progress > span i { display: block; height: 100%; background: var(--cpwb-cyan); }
.cpwb-knowledge-file-progress small { color: #6b798b; font: 600 7px/1 var(--cpwb-code); }
.cpwb-knowledge-file-row > em { color: var(--cpwb-green); font: 650 7px/1 var(--cpwb-code); font-style: normal; text-align: right; }
.cpwb-knowledge-file-row > em.cpwb-status-pending { color: var(--cpwb-amber); }
.cpwb-knowledge-file-row > em.cpwb-status-overdue { color: #ff8295; }
.cpwb-knowledge-file-actions { display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
.cpwb-knowledge-file-actions a,
.cpwb-knowledge-file-actions button { display: grid; place-items: center; min-width: 27px; height: 27px; padding: 0 6px; color: #8290a2; border: 1px solid rgba(77,232,244,.15); background: rgba(77,232,244,.025); cursor: pointer; font: 650 7px/1 var(--cpwb-code); text-decoration: none; }
.cpwb-knowledge-file-actions a:hover,
.cpwb-knowledge-file-actions button:hover { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); }
.cpwb-knowledge-detail-empty { display: grid; place-items: center; min-height: 210px; color: #627084; border: 1px dashed rgba(77,232,244,.18); }
.cpwb-knowledge-upload-progress { display: grid; gap: 8px; margin-top: 12px; color: #718096; font: 650 8px/1 var(--cpwb-code); }
.cpwb-knowledge-upload-progress > i { height: 4px; background: rgba(255,255,255,.04); }
.cpwb-knowledge-upload-progress b { display: block; height: 100%; background: var(--cpwb-amber); box-shadow: 0 0 10px rgba(255,181,27,.3); }
.cpwb-knowledge-link-map { display: grid; gap: 10px; }
.cpwb-knowledge-link-map > div { display: grid; grid-template-columns: 34px minmax(0,1fr); gap: 10px; padding: 12px; border: 1px solid rgba(77,232,244,.16); background: rgba(77,232,244,.07); }
.cpwb-knowledge-link-map > div > i { display: grid; place-items: center; width: 34px; height: 34px; color: var(--cpwb-amber); border: 1px solid currentColor; font: 700 8px/1 var(--cpwb-code); font-style: normal; }
.cpwb-knowledge-link-map span { display: grid; gap: 4px; }
.cpwb-knowledge-link-map strong { font-size: 10px; }
.cpwb-knowledge-link-map small { color: #647286; font: 600 7px/1 var(--cpwb-code); }
.cpwb-knowledge-link-map p { color: #647286; font-size: 10px; }
.cpwb-knowledge-runtime-detail { margin-top: 18px; padding: 18px 0; border-top: 1px solid rgba(77,232,244,.12); border-bottom: 1px solid rgba(77,232,244,.12); }
.cpwb-knowledge-runtime-detail p { display: flex; justify-content: space-between; gap: 12px; margin: 12px 0 0; color: #66758a; font-size: 9px; }
.cpwb-knowledge-runtime-detail strong { overflow-wrap: anywhere; color: #b7c1cd; text-align: right; }
.cpwb-knowledge-link-dialog { width: min(100%, 620px); }
.cpwb-knowledge-link-host { pointer-events: auto; }
.cpwb-knowledge-project-options { display: grid; gap: 8px; max-height: min(50vh, 430px); overflow: auto; }
.cpwb-knowledge-project-options > button { appearance: none; display: grid; grid-template-columns: 34px minmax(0,1fr) auto; align-items: center; gap: 11px; min-height: 58px; padding: 9px 11px; color: #8290a2; border: 1px solid rgba(77,232,244,.16); background: rgba(77,232,244,.025); cursor: pointer; text-align: left; }
.cpwb-knowledge-project-options > button[aria-pressed="true"] { color: var(--cpwb-text); border-color: rgba(77,232,244,.45); background: linear-gradient(90deg, rgba(77,232,244,.11), transparent); }
.cpwb-knowledge-project-options > button[aria-busy="true"] { border-color: var(--cpwb-amber); background: rgba(255,181,27,.075); }
.cpwb-knowledge-project-options > button:disabled { cursor: progress; opacity: .72; }
.cpwb-knowledge-project-options i { display: grid; place-items: center; width: 32px; height: 32px; color: var(--cpwb-cyan); border: 1px solid currentColor; font: 700 7px/1 var(--cpwb-code); font-style: normal; }
.cpwb-knowledge-project-options span { display: grid; gap: 5px; min-width: 0; }
.cpwb-knowledge-project-options strong { color: #dce2e9; font-size: 11px; }
.cpwb-knowledge-project-options small { color: #627084; font-size: 8px; }
.cpwb-knowledge-project-options em { color: var(--cpwb-amber); font: 650 7px/1 var(--cpwb-code); font-style: normal; }

@keyframes cpwb-knowledge-flow { to { stroke-dashoffset: -36; } }
@keyframes cpwb-knowledge-boot { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: no-preference) {
  .cpwb-knowledge-link-path { animation: cpwb-knowledge-flow 1.15s linear infinite; }
  .cpwb-knowledge-chip { animation: cpwb-knowledge-boot .45s both; }
}

@media (max-width: 1180px) {
  .cpwb-knowledge-board { grid-template-columns: minmax(0,1fr) 270px; gap: 30px; padding: 22px; }
  .cpwb-knowledge-chip-area { grid-template-columns: 1fr; }
  .cpwb-knowledge-detail-grid { grid-template-columns: 1fr; }
  .cpwb-knowledge-create-layout { grid-template-columns: minmax(280px,.82fr) minmax(0,1.18fr); }
}

@media (max-width: 899px) {
  .cpwb-knowledge-center { padding: 62px 14px 30px; }
  .cpwb-knowledge-page-head { grid-template-columns: 1fr; align-items: start; }
  .cpwb-knowledge-head-actions { justify-content: flex-start; }
  .cpwb-knowledge-create-layout { grid-template-columns: 1fr; min-height: 0; }
  .cpwb-knowledge-drop { min-height: 240px; }
}

@media (max-width: 820px) {
  .cpwb-knowledge-board { grid-template-columns: 1fr; min-height: 0; padding: 16px; }
  .cpwb-knowledge-link { display: none; }
  .cpwb-knowledge-core { min-height: 0; }
  .cpwb-knowledge-summary-strip { grid-template-columns: repeat(2,1fr); }
  .cpwb-knowledge-summary-strip > div:nth-child(2) { border-right: 0; }
  .cpwb-knowledge-summary-strip > div:nth-child(-n+2) { border-bottom: 1px solid rgba(77,232,244,.12); }
  .cpwb-knowledge-file-row { grid-template-columns: 34px minmax(0,1fr) auto; }
  .cpwb-knowledge-file-progress { grid-column: 2 / 4; }
  .cpwb-knowledge-file-row > em { grid-column: 2; grid-row: 3; text-align: left; }
  .cpwb-knowledge-file-actions { grid-column: 3; grid-row: 3; }
}

@media (max-width: 560px) {
  .cpwb-knowledge-page-head { padding: 15px; }
  .cpwb-knowledge-page-head h1 { font-size: 26px; }
  .cpwb-knowledge-head-actions { display: grid; grid-template-columns: 1fr 1fr; width: 100%; }
  .cpwb-knowledge-head-actions .cpwb-kb-action { padding-inline: 9px; }
  .cpwb-knowledge-chip-area { gap: 16px; }
  .cpwb-knowledge-chip { min-height: 205px; }
  .cpwb-knowledge-core { padding-inline: 14px; }
  .cpwb-knowledge-form { padding: 16px; }
  .cpwb-knowledge-runtime > div { grid-template-columns: 38px minmax(0,1fr); }
  .cpwb-knowledge-runtime .cpwb-kb-action { grid-column: 1 / -1; }
  .cpwb-knowledge-summary-strip > div { padding: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  .cpwb-knowledge-link-path,
  .cpwb-knowledge-chip { animation: none !important; transition: none !important; }
}

@media (prefers-reduced-transparency: reduce) {
  .cpwb-knowledge-board,
  .cpwb-knowledge-chip,
  .cpwb-knowledge-core,
  .cpwb-knowledge-panel { backdrop-filter: none; background-color: var(--cpwb-surface-panel); }
}
`;

// src/client/workbenchSessions.js
var registry = /* @__PURE__ */ new Map();
function registerWorkbenchSession({ sessionId, scope }) {
  const entry = { scope: { kind: scope.kind, id: scope.id ?? null } };
  registry.set(sessionId, entry);
  return entry;
}
function getWorkbenchSession(sessionId) {
  return registry.get(sessionId) ?? null;
}
function readSnapshot(store3) {
  if (!store3 || typeof store3.getSnapshot !== "function") return null;
  try {
    return store3.getSnapshot();
  } catch {
    return null;
  }
}
function hasSession(sessions, sessionId) {
  const snapshot = readSnapshot(sessions?.list);
  return Boolean(snapshot?.byId && snapshot.byId[sessionId]);
}
function workspaceItems(workspaces) {
  const snapshot = readSnapshot(workspaces?.list);
  return Array.isArray(snapshot?.items) ? snapshot.items : [];
}
function workspaceContainsSession(workspaces, sessionId) {
  if (!workspaces) return true;
  return workspaceItems(workspaces).some((workspace) => Array.isArray(workspace?.sessionIds) && workspace.sessionIds.includes(sessionId));
}
function observableError(store3, label) {
  const snapshot = readSnapshot(store3);
  if (snapshot?.state !== "error") return null;
  const detail = snapshot.error?.message || snapshot.error?.code || `${label} snapshot error`;
  return new Error(detail);
}
function sessionListReady(sessions, sessionId) {
  return hasSession(sessions, sessionId) && (typeof sessions.binding !== "function" || sessions.binding(sessionId) !== void 0);
}
function waitForSessionReady(sessions, sessionId, { workspaces, timeoutMs = 1e4 } = {}) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const unsubs = [];
    let timer = null;
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      for (const unsub of unsubs) unsub();
      if (timer) clearTimeout(timer);
      fn(value);
    };
    const check = () => {
      if (settled) return;
      const workspaceError = observableError(workspaces?.list, "workspaces");
      if (workspaceError) return finish(reject, workspaceError);
      if (sessionListReady(sessions, sessionId) && workspaceContainsSession(workspaces, sessionId)) {
        return finish(resolve, sessionId);
      }
      if (Date.now() >= deadline) {
        return finish(reject, new Error("session is not ready for open: " + sessionId));
      }
    };
    for (const store3 of [sessions?.list, workspaces?.list]) {
      if (typeof store3?.subscribe === "function") unsubs.push(store3.subscribe(check));
    }
    timer = setTimeout(check, Math.max(0, timeoutMs));
    check();
  });
}
async function openWorkbenchSession(sessions, sessionId, options = {}) {
  await waitForSessionReady(sessions, sessionId, options);
  sessions.open(sessionId);
  return sessionId;
}

// src/client/store.js
var RECENT_SESSION_LIMIT = 20;
function localDateKey(date = /* @__PURE__ */ new Date()) {
  const y = date.getFullYear();
  const m12 = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m12 + "-" + d;
}
function toError(err2, { includeDetails = false } = {}) {
  if (err2 && typeof err2.code === "string") {
    return {
      code: err2.code,
      message: err2 && typeof err2.message === "string" ? err2.message : String(err2),
      ...includeDetails && err2.details !== void 0 ? { details: err2.details } : {}
    };
  }
  return {
    code: "UNKNOWN",
    message: err2 && typeof err2.message === "string" ? err2.message : String(err2),
    ...includeDetails && err2?.details !== void 0 ? { details: err2.details } : {}
  };
}
function normalizeSkillTarget(input = {}) {
  if (input.scope === "global") return { scope: "global", key: "global", request: { scope: "global" } };
  if (input.scope === "project" && Number.isSafeInteger(input.projectId) && input.projectId > 0) {
    return {
      scope: "project",
      projectId: input.projectId,
      key: "project:" + input.projectId,
      request: { scope: "project", projectId: input.projectId }
    };
  }
  throw new TypeError("skill scope must be global or project with a positive projectId");
}
function isAborted(err2, ac) {
  return err2 && err2.code === "ABORTED" || ac && ac.signal && ac.signal.aborted;
}
function loadAutomation(api, projectId, signal) {
  if (typeof api.automation?.get !== "function") return Promise.resolve({ projectId, summaryEnabled: true, nextDayTodosEnabled: true });
  return api.automation.get(projectId, { signal }).catch(function(err2) {
    if (err2 && (err2.code === "NOT_FOUND" || err2.status === 404)) return { projectId, summaryEnabled: true, nextDayTodosEnabled: true };
    throw err2;
  });
}
function loadScheduleRuns(api, schedules, signal) {
  if (typeof api.schedules?.runs !== "function") return Promise.resolve({});
  return Promise.all((Array.isArray(schedules) ? schedules : []).map(
    (schedule) => api.schedules.runs(schedule.id, { signal }).catch(function(err2) {
      if (err2 && (err2.code === "NOT_FOUND" || err2.status === 404)) return [];
      throw err2;
    }).then((runs) => [String(schedule.id), Array.isArray(runs) ? runs : []])
  )).then((entries) => Object.fromEntries(entries));
}
function normalizeSessionRow(row) {
  const kind = row?.scope?.kind ?? row?.scopeKind;
  const id = row?.scope?.id ?? row?.scopeId ?? null;
  return {
    ...row,
    scope: { kind, id }
  };
}
function normalizeSessionScope(scope) {
  if (!scope || !["project", "knowledge_base", "independent"].includes(scope.kind)) {
    throw new TypeError("\u4F1A\u8BDD\u5F52\u5C5E\u65E0\u6548");
  }
  if (scope.kind === "independent") return { kind: "independent", id: null };
  if (!Number.isSafeInteger(scope.id) || scope.id <= 0) throw new TypeError("\u4F1A\u8BDD\u5F52\u5C5E\u7F3A\u5C11\u6709\u6548 ID");
  return { kind: scope.kind, id: scope.id };
}
function sessionMap(rows) {
  const out = {};
  for (const raw of Array.isArray(rows) ? rows : []) {
    const row = normalizeSessionRow(raw);
    if (row.sessionId) out[row.sessionId] = row;
  }
  return out;
}
function createWorkbenchStore(api) {
  if (!api || typeof api.health !== "function") {
    throw new Error("createWorkbenchStore requires a cpwb api");
  }
  let state = {
    phase: "loading",
    projects: [],
    knowledgeBases: [],
    documents: [],
    health: null,
    settings: { timezone: "Asia/Shanghai", embedding: null, network: null, auth: null, index: null, automationPrompts: null },
    error: null,
    activeProjectId: null,
    activeKnowledgeBaseId: null,
    linkedKnowledgeBases: [],
    todos: [],
    schedules: [],
    scheduleRuns: {},
    summaries: [],
    automation: { summaryEnabled: true, nextDayTodosEnabled: true },
    citations: [],
    action: null,
    draft: null,
    recentSessions: [],
    recentSessionTotal: 0,
    sessionPage: { items: [], total: 0, limit: 20, offset: 0, query: "", context: null, archived: false },
    workbenchSessions: {},
    citationsBySession: {},
    contextBySession: {},
    globalSchedules: [],
    linkedProjects: [],
    maintenanceJob: null,
    skillCatalogs: {},
    skillAction: null
  };
  const listeners = /* @__PURE__ */ new Set();
  const controllers = /* @__PURE__ */ new Set();
  let disposed = false;
  let documentsScope = { type: "all" };
  let lastToday = null;
  let refreshSeq = 0;
  let refreshAbort = null;
  let projectSeq = 0;
  let projectAbort = null;
  const skillLoadSeq = /* @__PURE__ */ new Map();
  const skillLoads = /* @__PURE__ */ new Map();
  let skillActionSeq = 0;
  function setState(patch) {
    state = { ...state, ...patch };
    for (const listener of listeners) listener();
  }
  function subscribe(listener) {
    listeners.add(listener);
    return function unsubscribe() {
      listeners.delete(listener);
    };
  }
  function getSnapshot() {
    return state;
  }
  function track(ac) {
    controllers.add(ac);
    return ac;
  }
  function untrack(ac) {
    controllers.delete(ac);
  }
  function makeGuarded(fetcher, apply2) {
    let seq = 0;
    let controller = null;
    return {
      async run(...args) {
        seq += 1;
        const mySeq = seq;
        if (controller) controller.abort();
        const ac = track(new AbortController());
        controller = ac;
        try {
          const data = await fetcher(...args, ac.signal);
          if (disposed || mySeq !== seq) return data;
          apply2(data);
          return data;
        } catch (err2) {
          if (disposed || mySeq !== seq) return void 0;
          if (isAborted(err2, ac)) return void 0;
          setState({ error: toError(err2) });
          return void 0;
        } finally {
          untrack(ac);
          if (controller === ac) controller = null;
        }
      }
    };
  }
  const loadProjects = makeGuarded(
    (signal) => api.projects.list({ signal }),
    (projects) => setState({ projects })
  );
  const loadKnowledgeBases = makeGuarded(
    (signal) => api.knowledgeBases.list({ signal }),
    (knowledgeBases) => setState({ knowledgeBases })
  );
  const loadDocuments = makeGuarded(
    (signal) => {
      if (documentsScope.type === "knowledgeBase") {
        return api.documents.list({ scope: "knowledgeBase", scopeId: documentsScope.id, signal });
      }
      return api.documents.list({ signal });
    },
    (documents) => setState({ documents })
  );
  const loadLinked = makeGuarded(
    (projectId, signal) => api.projectKnowledgeBases.list(projectId, { signal }),
    (linkedKnowledgeBases) => setState({ linkedKnowledgeBases })
  );
  async function fetchSessionPage(params, signal) {
    if (typeof api.chat?.sessions?.list !== "function") {
      return { items: [], total: 0, limit: params.limit ?? 8, offset: params.offset ?? 0 };
    }
    try {
      const result = await api.chat.sessions.list(params, { signal });
      if (Array.isArray(result)) {
        return { items: result, total: result.length, limit: params.limit ?? result.length, offset: params.offset ?? 0 };
      }
      return result;
    } catch (error) {
      if (error?.status === 404 || error?.code === "NOT_FOUND") {
        return { items: [], total: 0, limit: params.limit ?? 8, offset: params.offset ?? 0 };
      }
      throw error;
    }
  }
  const loadRecent = makeGuarded(
    (limit, signal) => fetchSessionPage({ limit, offset: 0 }, signal),
    (page) => {
      const rows = page.items.map(normalizeSessionRow);
      setState({ recentSessions: rows, recentSessionTotal: Number(page.total) || rows.length, workbenchSessions: { ...state.workbenchSessions, ...sessionMap(rows) } });
    }
  );
  const loadSessionPage = makeGuarded(
    (params, signal) => fetchSessionPage(params, signal),
    (page) => {
      const items = page.items.map(normalizeSessionRow);
      setState({
        sessionPage: { ...page, items },
        workbenchSessions: { ...state.workbenchSessions, ...sessionMap(items) }
      });
    }
  );
  async function refresh() {
    refreshSeq += 1;
    const seq = refreshSeq;
    if (refreshAbort) refreshAbort.abort();
    const ac = track(new AbortController());
    refreshAbort = ac;
    documentsScope = { type: "all" };
    setState({ phase: "loading", error: null, activeKnowledgeBaseId: null });
    try {
      const [health, projects, knowledgeBases, documents] = await Promise.all([
        api.health({ signal: ac.signal }),
        api.projects.list({ signal: ac.signal }),
        api.knowledgeBases.list({ signal: ac.signal }),
        api.documents.list({ signal: ac.signal })
      ]);
      if (disposed || seq !== refreshSeq) return;
      const sessionPage = await fetchSessionPage({ limit: RECENT_SESSION_LIMIT, offset: 0 }, ac.signal);
      if (disposed || seq !== refreshSeq) return;
      const recentSessions = sessionPage.items.map(normalizeSessionRow);
      setState({
        phase: "ready",
        health,
        projects,
        knowledgeBases,
        documents,
        recentSessions,
        recentSessionTotal: Number(sessionPage.total) || recentSessions.length,
        workbenchSessions: sessionMap(recentSessions),
        error: null
      });
    } catch (err2) {
      if (disposed || seq !== refreshSeq) return;
      if (isAborted(err2, ac)) return;
      setState({ phase: "error", error: toError(err2) });
    } finally {
      untrack(ac);
      if (refreshAbort === ac) refreshAbort = null;
    }
  }
  async function refreshProject(projectId, today) {
    projectSeq += 1;
    const seq = projectSeq;
    if (projectAbort) projectAbort.abort();
    const ac = track(new AbortController());
    projectAbort = ac;
    lastToday = today;
    setState({ activeProjectId: projectId, error: null, action: { type: "refreshProject", status: "running", error: null } });
    try {
      const [todos, schedules, summaries, automation] = await Promise.all([
        api.todos.list({ projectId, signal: ac.signal }),
        api.schedules.list({ projectId, signal: ac.signal }),
        api.summaries.list({ projectId, signal: ac.signal }),
        loadAutomation(api, projectId, ac.signal)
      ]);
      const scheduleRuns = await loadScheduleRuns(api, schedules, ac.signal);
      if (disposed || seq !== projectSeq) return;
      setState({ todos, schedules, scheduleRuns, summaries, automation, error: null, action: { type: "refreshProject", status: "done", error: null } });
    } catch (err2) {
      if (disposed || seq !== projectSeq) return;
      if (isAborted(err2, ac)) return;
      setState({ error: toError(err2), action: { type: "refreshProject", status: "error", error: toError(err2) } });
    } finally {
      untrack(ac);
      if (projectAbort === ac) projectAbort = null;
    }
  }
  async function refreshDocuments() {
    await loadDocuments.run();
  }
  async function loadSettings() {
    if (!api.settings) return state.settings;
    const readSetting = (name) => typeof api.settings[name] === "function" ? Promise.resolve().then(() => api.settings[name]()).catch(() => null) : Promise.resolve(null);
    const [timezone, embedding, network, auth, index, automationPrompts] = await Promise.all([
      readSetting("timezone"),
      readSetting("embedding"),
      readSetting("network"),
      readSetting("authStatus"),
      readSetting("indexStatus"),
      readSetting("automationPrompts")
    ]);
    const next = {
      timezone: timezone?.timezone || timezone || state.settings.timezone,
      embedding: embedding || state.settings.embedding,
      network: network || state.settings.network,
      auth: auth || state.settings.auth,
      index: index || state.settings.index,
      automationPrompts: automationPrompts || state.settings.automationPrompts
    };
    setState({ settings: next });
    return next;
  }
  function updateSkillCatalog(key, patch) {
    const previous = state.skillCatalogs[key] || { status: "loading", data: null, error: null };
    setState({
      skillCatalogs: {
        ...state.skillCatalogs,
        [key]: { ...previous, ...patch }
      }
    });
  }
  async function loadSkills(input = {}, { throwOnError = false } = {}) {
    if (disposed) return void 0;
    const target = normalizeSkillTarget(input);
    const key = target.key;
    const previous = state.skillCatalogs[key] || { status: "loading", data: null, error: null };
    const seq = (skillLoadSeq.get(key) || 0) + 1;
    skillLoadSeq.set(key, seq);
    const prior = skillLoads.get(key);
    if (prior) prior.abort();
    const ac = track(new AbortController());
    skillLoads.set(key, ac);
    updateSkillCatalog(key, { status: "loading", data: previous.data ?? null, error: null });
    try {
      const data = await api.skills.list({ ...target.request, signal: ac.signal });
      if (disposed || skillLoadSeq.get(key) !== seq) return data;
      updateSkillCatalog(key, { status: "ready", data, error: null });
      return data;
    } catch (err2) {
      if (disposed || skillLoadSeq.get(key) !== seq || isAborted(err2, ac)) return void 0;
      updateSkillCatalog(key, { status: "error", data: previous.data ?? null, error: toError(err2, { includeDetails: true }) });
      if (throwOnError) throw err2;
      return void 0;
    } finally {
      untrack(ac);
      if (skillLoads.get(key) === ac) skillLoads.delete(key);
    }
  }
  function updateSkillAction(mySeq, action) {
    if (!disposed && mySeq === skillActionSeq) setState({ skillAction: action });
  }
  async function runSkillMutation(type, input, invoke, { reload = true } = {}) {
    const target = normalizeSkillTarget(input);
    const key = target.key;
    const name = input.name;
    const mySeq = ++skillActionSeq;
    updateSkillAction(mySeq, { type, key, name, status: "running", error: null });
    const ac = track(new AbortController());
    try {
      const result = await invoke({ ...target.request, signal: ac.signal });
      if (!disposed && reload) await loadSkills(target.request, { throwOnError: true });
      updateSkillAction(mySeq, { type, key, name, status: "done", error: null, result });
      return result;
    } catch (err2) {
      updateSkillAction(mySeq, { type, key, name, status: "error", error: toError(err2, { includeDetails: true }) });
      throw err2;
    } finally {
      untrack(ac);
    }
  }
  function projectIdFor(collection, id) {
    const arr = state[collection];
    if (Array.isArray(arr)) {
      const item = arr.find((x2) => x2.id === id);
      if (item && item.projectId != null) return item.projectId;
    }
    return activeProjectId;
  }
  async function runAction(type, fn, meta = {}) {
    setState({ action: { type, ...meta, status: "running", error: null } });
    try {
      const result = await fn();
      setState({ action: { type, ...meta, status: "done", error: null, result } });
      return result;
    } catch (err2) {
      setState({ action: { type, ...meta, status: "error", error: toError(err2) } });
      throw err2;
    }
  }
  const actions = {
    refresh,
    retry: async function retry() {
      await refresh();
      if (state.activeProjectId != null) {
        await refreshProject(state.activeProjectId, lastToday ?? localDateKey());
      }
    },
    refreshProject,
    refreshDocuments,
    loadSettings,
    loadSkills,
    importSkill: async function importSkill(input = {}) {
      return runSkillMutation(
        "importSkill",
        input,
        ({ scope, projectId, signal }) => api.skills.importBundle({
          archive: input.archive,
          scope,
          ...projectId === void 0 ? {} : { projectId },
          sourceName: input.sourceName,
          replace: input.replace === true
        }, { signal })
      );
    },
    setSkillEnabled: async function setSkillEnabled(input = {}) {
      return runSkillMutation(
        "setSkillEnabled",
        input,
        ({ scope, projectId, signal }) => api.skills.setEnabled({
          name: input.name,
          scope,
          ...projectId === void 0 ? {} : { projectId },
          enabled: input.enabled === true
        }, { signal })
      );
    },
    deleteSkill: async function deleteSkill(input = {}) {
      return runSkillMutation(
        "deleteSkill",
        input,
        ({ scope, projectId, signal }) => api.skills.remove({
          name: input.name,
          scope,
          ...projectId === void 0 ? {} : { projectId }
        }, { signal })
      );
    },
    revealSkill: async function revealSkill(input = {}) {
      return runSkillMutation(
        "revealSkill",
        input,
        ({ scope, projectId, signal }) => api.skills.reveal({
          name: input.name,
          scope,
          ...projectId === void 0 ? {} : { projectId }
        }, { signal }),
        { reload: false }
      );
    },
    startContainerPurge: async function startContainerPurge(input) {
      if (typeof api.maintenance?.createPurgeJob !== "function") {
        throw new Error("maintenance purge API is unavailable");
      }
      const job = await runAction(
        "startContainerPurge",
        () => api.maintenance.createPurgeJob(input)
      );
      setState({
        maintenanceJob: {
          ...job,
          disconnected: false,
          lastPollError: null
        }
      });
      return job;
    },
    refreshPurgeJob: async function refreshPurgeJob(jobId) {
      if (typeof api.maintenance?.getPurgeJob !== "function") {
        throw new Error("maintenance purge API is unavailable");
      }
      try {
        const job = await api.maintenance.getPurgeJob(jobId);
        setState({
          maintenanceJob: {
            ...state.maintenanceJob?.jobId === jobId ? state.maintenanceJob : {},
            ...job,
            disconnected: false,
            lastPollError: null
          }
        });
        return job;
      } catch (error) {
        const lastConfirmed = state.maintenanceJob?.jobId === jobId ? state.maintenanceJob : { jobId };
        setState({
          maintenanceJob: {
            ...lastConfirmed,
            disconnected: true,
            lastPollError: toError(error)
          }
        });
        return null;
      }
    },
    resumePurgeJob: async function resumePurgeJob(jobId) {
      if (state.maintenanceJob?.jobId !== jobId) {
        setState({
          maintenanceJob: {
            jobId,
            state: "reconnecting",
            disconnected: false,
            lastPollError: null
          }
        });
      }
      return actions.refreshPurgeJob(jobId);
    },
    clearPurgeJob: async function clearPurgeJob() {
      const terminal = state.maintenanceJob?.state;
      if (!terminal) return;
      if (terminal !== "completed" && terminal !== "restored") {
        throw new Error("maintenance job is not complete");
      }
      setState({ maintenanceJob: null });
      await refresh();
    },
    updateTimezone: async function updateTimezone(timezone) {
      const result = await runAction("updateTimezone", () => api.settings.updateTimezone(timezone));
      setState({ settings: { ...state.settings, timezone: result?.timezone || result } });
      return result;
    },
    updateAutomationPrompts: async function updateAutomationPrompts(prompts) {
      const result = await runAction("updateAutomationPrompts", () => api.settings.updateAutomationPrompts(prompts));
      setState({ settings: { ...state.settings, automationPrompts: result } });
      return result;
    },
    updateEmbedding: async function updateEmbedding(config) {
      const result = await runAction("updateEmbedding", () => api.settings.updateEmbedding(config));
      setState({ settings: { ...state.settings, embedding: result } });
      return result;
    },
    testEmbedding: async function testEmbedding(config) {
      return runAction("testEmbedding", () => api.settings.testEmbedding(config));
    },
    putEmbeddingCredential: async function putEmbeddingCredential(input) {
      const result = await runAction("putEmbeddingCredential", () => api.settings.putEmbeddingCredential(input));
      await loadSettings();
      return result;
    },
    deleteEmbeddingCredential: async function deleteEmbeddingCredential(input) {
      const result = await runAction("deleteEmbeddingCredential", () => api.settings.deleteEmbeddingCredential(input));
      await loadSettings();
      return result;
    },
    reindexAllIndexes: async function reindexAllIndexes() {
      const result = await runAction("reindexIndex", () => api.settings.reindex());
      await loadSettings();
      return result;
    },
    updateNetwork: async function updateNetwork(config) {
      const result = await runAction("updateNetwork", () => api.settings.updateNetwork(config));
      setState({ settings: { ...state.settings, network: result } });
      return result;
    },
    testNetwork: async function testNetwork(config) {
      return runAction("testNetwork", () => api.settings.testNetwork(config));
    },
    testAuth: async function testAuth() {
      return runAction("testAuth", () => api.settings.authTest());
    },
    connectCodex: async function connectCodex() {
      const result = await runAction("connectCodex", () => api.settings.connectCodex());
      await loadSettings();
      return result;
    },
    loadRecentSessions: async function loadRecentSessions({ limit = RECENT_SESSION_LIMIT } = {}) {
      return loadRecent.run(limit);
    },
    loadAllSessions: async function loadAllSessions({ query = "", scopeKind = null, scopeId = null, archived = false, offset = 0, limit = 20 } = {}) {
      return loadSessionPage.run({ query, scopeKind, scopeId, archived, offset, limit });
    },
    loadGlobalSchedules: async function loadGlobalSchedules() {
      const schedules = await runAction("loadGlobalSchedules", () => api.schedules.list({}));
      setState({ globalSchedules: Array.isArray(schedules) ? schedules : [] });
      return schedules;
    },
    loadKnowledgeBaseProjects: async function loadKnowledgeBaseProjects(knowledgeBaseId) {
      const projects = await runAction("loadKnowledgeBaseProjects", () => api.knowledgeBaseProjects.list(knowledgeBaseId));
      setState({ linkedProjects: Array.isArray(projects) ? projects : [] });
      return projects;
    },
    reindexKnowledgeBase: async function reindexKnowledgeBase(knowledgeBaseId) {
      const result = await runAction("reindexKnowledgeBase", () => api.knowledgeBaseIndex.reindex(knowledgeBaseId));
      await actions.refreshDocuments();
      return result;
    },
    startDraft: function startDraft({ scope, pinnedSources = [] }) {
      const draft = {
        scope: normalizeSessionScope(scope),
        pinnedSources: Array.isArray(pinnedSources) ? pinnedSources : [],
        text: "",
        status: "pristine",
        sessionId: null,
        error: null
      };
      setState({ draft, error: null });
      return draft;
    },
    discardDraft: async function discardDraft() {
      const draft = state.draft;
      if (!draft) return null;
      if (draft.status === "admitted") return actions.confirmDraft();
      if (draft.sessionId) {
        await runAction("discardDraft", () => api.chat.sessions.remove(draft.sessionId));
      }
      setState({ draft: null });
      return null;
    },
    materializeDraft: async function materializeDraft({ text }) {
      const title = typeof text === "string" ? text.trim() : "";
      if (!title) throw new TypeError("\u9996\u6761\u6D88\u606F\u4E0D\u80FD\u4E3A\u7A7A");
      const draft = state.draft;
      if (!draft) throw new TypeError("\u5F53\u524D\u6CA1\u6709\u5F85\u6FC0\u6D3B\u7684\u4F1A\u8BDD\u8349\u7A3F");
      if (draft.sessionId) {
        setState({ draft: { ...draft, text, error: null } });
        return { sessionId: draft.sessionId, scope: draft.scope, title };
      }
      setState({ draft: { ...draft, text, status: "materializing", error: null } });
      const ac = track(new AbortController());
      try {
        const result = await runAction("materializeDraft", () => api.chat.sessions.create({
          scope: draft.scope,
          title,
          pinnedSources: draft.pinnedSources
        }, { signal: ac.signal }));
        setState({ draft: {
          ...draft,
          text,
          status: "materialized",
          sessionId: result.sessionId,
          error: null
        } });
        return result;
      } catch (error) {
        setState({ draft: { ...draft, text, status: "error", error: toError(error) } });
        throw error;
      } finally {
        untrack(ac);
      }
    },
    markDraftAdmitted: function markDraftAdmitted() {
      const draft = state.draft;
      if (!draft?.sessionId) throw new TypeError("\u4F1A\u8BDD\u5C1A\u672A\u7269\u5316");
      setState({ draft: { ...draft, status: "admitted", error: null } });
    },
    markDraftError: function markDraftError(error) {
      const draft = state.draft;
      if (!draft) return;
      setState({ draft: { ...draft, status: draft.status === "admitted" ? "admitted" : "materialized", error: toError(error) } });
    },
    confirmDraft: async function confirmDraft() {
      const draft = state.draft;
      if (!draft?.sessionId || draft.status !== "admitted") throw new TypeError("\u9996\u6761\u6D88\u606F\u5C1A\u672A\u88AB DSH \u63A5\u53D7");
      const result = await runAction("confirmDraft", () => api.chat.sessions.confirm(draft.sessionId));
      const entry = normalizeSessionRow({ ...result, scope: result.scope ?? draft.scope });
      registerWorkbenchSession({ sessionId: result.sessionId, scope: entry.scope });
      setState({
        draft: null,
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry }
      });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return result;
    },
    openSession: async function openSession(sessionId) {
      const result = await runAction("openSession", () => api.chat.sessions.open(sessionId));
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId, scope: entry.scope });
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      return entry;
    },
    renameSession: async function renameSession({ sessionId, title }) {
      const result = await runAction("renameSession", () => api.chat.sessions.rename({ sessionId, title }));
      const entry = normalizeSessionRow(result);
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },
    moveSession: async function moveSession({ sessionId, scope }) {
      const result = await runAction("moveSession", () => api.chat.sessions.move({ sessionId, scope: normalizeSessionScope(scope) }));
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId, scope: entry.scope });
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },
    archiveSession: async function archiveSession(sessionId) {
      const result = await runAction("archiveSession", () => api.chat.sessions.archive(sessionId));
      const entry = normalizeSessionRow(result);
      setState({
        recentSessions: state.recentSessions.filter((row) => row.sessionId !== sessionId),
        workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry }
      });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },
    restoreSession: async function restoreSession(sessionId) {
      const result = await runAction("restoreSession", () => api.chat.sessions.restore(sessionId));
      const entry = normalizeSessionRow(result);
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return entry;
    },
    deleteSession: async function deleteSession(sessionId) {
      const result = await runAction("deleteSession", () => api.chat.sessions.remove(sessionId));
      const next = { ...state.workbenchSessions };
      delete next[sessionId];
      setState({ workbenchSessions: next });
      await loadRecent.run(RECENT_SESSION_LIMIT);
      return result;
    },
    loadSessionContext: async function loadSessionContext(sessionId) {
      const context = await runAction("loadSessionContext", () => api.chat.sessions.context.get(sessionId));
      setState({ contextBySession: { ...state.contextBySession, [sessionId]: context } });
      return context;
    },
    setSessionContext: async function setSessionContext({ sessionId, source, mode }) {
      const context = await runAction("setSessionContext", () => api.chat.sessions.context.set({ sessionId, source, mode }));
      setState({ contextBySession: { ...state.contextBySession, [sessionId]: context } });
      return context;
    },
    removeSessionContext: async function removeSessionContext({ sessionId, source }) {
      await runAction("removeSessionContext", () => api.chat.sessions.context.remove({ sessionId, source }));
      return actions.loadSessionContext(sessionId);
    },
    selectKnowledgeBase: async function selectKnowledgeBase(kbId) {
      documentsScope = { type: "knowledgeBase", id: kbId };
      setState({ activeKnowledgeBaseId: kbId, citations: [] });
      await loadDocuments.run();
    },
    loadAllDocuments: async function loadAllDocuments() {
      documentsScope = { type: "all" };
      setState({ activeKnowledgeBaseId: null, citations: [] });
      await loadDocuments.run();
    },
    loadLinkedKnowledgeBases: async function loadLinkedKnowledgeBases(projectId) {
      await loadLinked.run(projectId);
    },
    createProject: async function createProject({ name, path, workspaceId }) {
      const ac = track(new AbortController());
      let created;
      try {
        created = await runAction("createProject", () => api.projects.create({ name, path, workspaceId }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await loadProjects.run();
      return created;
    },
    renameProject: async function renameProject({ id, name }) {
      const ac = track(new AbortController());
      let updated;
      try {
        updated = await runAction("renameProject", () => api.projects.update({ id, name }, { signal: ac.signal }), { projectId: id });
      } finally {
        untrack(ac);
      }
      await loadProjects.run();
      return updated;
    },
    loadProjectDeletionPlan: async function loadProjectDeletionPlan(id) {
      const ac = track(new AbortController());
      try {
        return await runAction("loadProjectDeletionPlan", () => api.projects.deletionPlan(id, { signal: ac.signal }), { projectId: id });
      } finally {
        untrack(ac);
      }
    },
    deleteProject: async function deleteProject({ id, sessionPolicy = "detach" }) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteProject", () => api.projects.remove(id, { sessionPolicy, signal: ac.signal }), { projectId: id, sessionPolicy });
      } finally {
        untrack(ac);
      }
      await loadProjects.run();
      if (state.activeProjectId === id) {
        setState({
          activeProjectId: null,
          linkedKnowledgeBases: [],
          todos: [],
          schedules: [],
          scheduleRuns: {},
          summaries: []
        });
      }
    },
    createKnowledgeBase: async function createKnowledgeBase({ name, description }) {
      const ac = track(new AbortController());
      let created;
      try {
        created = await runAction("createKnowledgeBase", () => api.knowledgeBases.create({ name, description }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await loadKnowledgeBases.run();
      return created;
    },
    loadKnowledgeBaseDeletionPlan: async function loadKnowledgeBaseDeletionPlan(id) {
      const ac = track(new AbortController());
      try {
        return await runAction("loadKnowledgeBaseDeletionPlan", () => api.knowledgeBases.deletionPlan(id, { signal: ac.signal }), { knowledgeBaseId: id });
      } finally {
        untrack(ac);
      }
    },
    deleteKnowledgeBase: async function deleteKnowledgeBase({ id, sessionPolicy = "detach" }) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteKnowledgeBase", () => api.knowledgeBases.remove(id, { sessionPolicy, signal: ac.signal }), { knowledgeBaseId: id, sessionPolicy });
      } finally {
        untrack(ac);
      }
      if (state.activeKnowledgeBaseId === id) documentsScope = { type: "all" };
      await refresh();
      setState({
        activeKnowledgeBaseId: state.activeKnowledgeBaseId === id ? null : state.activeKnowledgeBaseId,
        citations: state.activeKnowledgeBaseId === id ? [] : state.citations
      });
    },
    linkProjectKnowledgeBase: async function linkProjectKnowledgeBase(projectId, knowledgeBaseId) {
      const ac = track(new AbortController());
      try {
        await runAction("linkProjectKnowledgeBase", () => api.projectKnowledgeBases.link(projectId, knowledgeBaseId, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await Promise.all([loadLinked.run(projectId), loadKnowledgeBases.run()]);
    },
    unlinkProjectKnowledgeBase: async function unlinkProjectKnowledgeBase(projectId, knowledgeBaseId) {
      const ac = track(new AbortController());
      try {
        await runAction("unlinkProjectKnowledgeBase", () => api.projectKnowledgeBases.unlink(projectId, knowledgeBaseId, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await Promise.all([loadLinked.run(projectId), loadKnowledgeBases.run()]);
    },
    uploadFiles: async function uploadFiles({ files, scope, scopeId }) {
      const list = Array.isArray(files) ? files : [files];
      if (list.length === 0) return { ok: true, uploaded: [], failures: [] };
      setState({ action: { type: "upload", status: "running", error: null, done: 0, total: list.length } });
      const uploaded = [];
      const failures = [];
      for (let i3 = 0; i3 < list.length; i3 += 1) {
        const file = list[i3];
        const ac = track(new AbortController());
        try {
          const res = await api.documents.upload({ file, scope, scopeId }, { signal: ac.signal });
          uploaded.push({ file, document: res.document });
        } catch (err2) {
          failures.push({ file, error: toError(err2) });
        } finally {
          untrack(ac);
        }
        setState({ action: { type: "upload", status: "running", error: null, done: i3 + 1, total: list.length } });
      }
      await refreshDocuments();
      if (failures.length > 0) {
        setState({ action: { type: "upload", status: "error", error: failures[0].error, done: list.length, total: list.length } });
        return { ok: false, uploaded, failures };
      }
      setState({ action: { type: "upload", status: "done", error: null, done: list.length, total: list.length } });
      return { ok: true, uploaded, failures };
    },
    reindexDocument: async function reindexDocument(id) {
      const ac = track(new AbortController());
      try {
        await runAction("reindexDocument", () => api.documents.reindex(id, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshDocuments();
    },
    unlinkDocument: async function unlinkDocument({ id, scope, scopeId }) {
      const ac = track(new AbortController());
      try {
        await runAction("unlinkDocument", () => api.documents.unlink({ id, scope, scopeId }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshDocuments();
    },
    search: async function search({ scope, scopeId, query, limit }) {
      const ac = track(new AbortController());
      let results;
      try {
        results = await runAction("search", () => api.search({ scope, scopeId, query, limit }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      setState({ citations: Array.isArray(results) ? results : [] });
      return results;
    },
    createTodo: async function createTodo({ projectId, title, dueAt, source = "manual" }) {
      const ac = track(new AbortController());
      try {
        await runAction("todo", () => api.todos.create({ projectId, title, dueAt, source }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
    },
    updateTodo: async function updateTodo({ id, title, dueAt, done }) {
      const ac = track(new AbortController());
      try {
        await runAction("todo", () => api.todos.update({ id, title, dueAt, done }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      const projectId = projectIdFor("todos", id);
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },
    deleteTodo: async function deleteTodo(id) {
      const projectId = projectIdFor("todos", id);
      const ac = track(new AbortController());
      try {
        await runAction("todo", () => api.todos.remove(id, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },
    createSchedule: async function createSchedule({ projectId, name, recurrence, startsAt, prompt, enabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("createSchedule", () => api.schedules.create({ projectId, name, recurrence, startsAt, prompt, enabled }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
    },
    createGlobalSchedule: async function createGlobalSchedule({ projectId, name, recurrence, startsAt, prompt, enabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("createGlobalSchedule", () => api.schedules.create({ projectId, name, recurrence, startsAt, prompt, enabled }, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      const schedules = await api.schedules.list({});
      setState({ globalSchedules: Array.isArray(schedules) ? schedules : [] });
    },
    updateSchedule: async function updateSchedule({ id, name, prompt, recurrence, startsAt, enabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("updateSchedule", () => api.schedules.update({ id, name, prompt, recurrence, startsAt, enabled }, { signal: ac.signal }), { scheduleId: id });
      } finally {
        untrack(ac);
      }
      const projectId = projectIdFor("schedules", id);
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },
    deleteSchedule: async function deleteSchedule(id) {
      const projectId = projectIdFor("schedules", id);
      const ac = track(new AbortController());
      try {
        await runAction("deleteSchedule", () => api.schedules.remove(id, { signal: ac.signal }), { scheduleId: id });
      } finally {
        untrack(ac);
      }
      if (projectId != null) await refreshProject(projectId, lastToday ?? localDateKey());
    },
    runSchedule: async function runSchedule(id) {
      const ac = track(new AbortController());
      let result;
      let failure = null;
      try {
        result = await runAction("runSchedule", () => api.schedules.run(id, { signal: ac.signal }), { scheduleId: id });
      } catch (error) {
        failure = error;
      } finally {
        untrack(ac);
      }
      if (state.activeProjectId != null) await refreshProject(state.activeProjectId, lastToday ?? localDateKey());
      await loadRecent.run(RECENT_SESSION_LIMIT);
      if (failure) {
        setState({ action: { type: "runSchedule", scheduleId: id, status: "error", error: toError(failure) } });
        throw failure;
      }
      setState({ action: { type: "runSchedule", scheduleId: id, status: "done", error: null, result } });
      return result;
    },
    runSummary: async function runSummary({ projectId, summaryDate }) {
      const ac = track(new AbortController());
      let result;
      let failure = null;
      try {
        result = await runAction("runSummary", () => api.summaries.run({ projectId, summaryDate }, { signal: ac.signal }));
      } catch (error) {
        failure = error;
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
      if (failure) {
        setState({ action: { type: "runSummary", status: "error", error: toError(failure) } });
        throw failure;
      }
      setState({ action: { type: "runSummary", status: "done", error: null, result } });
    },
    deleteSummary: async function deleteSummary({ id, projectId }) {
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("deleteSummary", () => api.summaries.remove(id, { signal: ac.signal }), { summaryId: id });
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
      setState({ action: { type: "deleteSummary", summaryId: id, status: "done", error: null, result } });
    },
    updateAutomation: async function updateAutomation({ projectId, summaryEnabled, nextDayTodosEnabled }) {
      const ac = track(new AbortController());
      try {
        await runAction("updateAutomation", () => api.automation.update(
          { projectId, summaryEnabled, nextDayTodosEnabled },
          { signal: ac.signal }
        ));
      } finally {
        untrack(ac);
      }
      await refreshProject(projectId, lastToday ?? localDateKey());
    }
  };
  function dispose() {
    disposed = true;
    for (const ac of skillLoads.values()) ac.abort();
    for (const ac of controllers) ac.abort();
    controllers.clear();
    listeners.clear();
  }
  return { subscribe, getSnapshot, actions, dispose };
}

// src/client/api.js
var API_PREFIX = "/api/cpwb";
var CpwbApiError = class extends Error {
  constructor(code, message, status = 0, details) {
    super(message);
    this.name = "CpwbApiError";
    this.code = code;
    this.status = status;
    if (details !== void 0) this.details = details;
  }
};
function buildQuery(params) {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === void 0 || value === null || value === "") continue;
    sp.set(key, String(value));
  }
  const s15 = sp.toString();
  return s15 ? "?" + s15 : "";
}
function createCpwbApi({ fetchImpl, basePath = API_PREFIX } = {}) {
  const fetchFn = fetchImpl ?? globalThis.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error("createCpwbApi requires a fetch implementation");
  }
  async function request2({ method = "GET", path, query, body, headers = {}, rawBody, signal } = {}) {
    if (signal && signal.aborted) {
      throw new CpwbApiError("ABORTED", "request aborted", 0);
    }
    const url = basePath + path + buildQuery(query);
    const init = { method, headers: { ...headers }, signal };
    if (rawBody !== void 0 && rawBody !== null) {
      init.body = rawBody;
    } else if (body !== void 0) {
      init.headers["content-type"] = "application/json";
      init.body = JSON.stringify(body);
    }
    let response;
    try {
      response = await fetchFn(url, init);
    } catch (cause) {
      if (signal && signal.aborted) throw new CpwbApiError("ABORTED", "request aborted", 0);
      const message = cause && typeof cause.message === "string" ? cause.message : String(cause);
      throw new CpwbApiError("NETWORK_ERROR", "network request failed: " + message, 0);
    }
    let data;
    try {
      data = await response.json();
    } catch {
      if (!response.ok) {
        throw new CpwbApiError("HTTP_" + response.status, "HTTP " + response.status, response.status);
      }
      throw new CpwbApiError("INVALID_RESPONSE", "response was not JSON", response.status);
    }
    if (!response.ok) {
      const err2 = data && typeof data.error === "object" && data.error !== null ? data.error : {};
      const code = typeof err2.code === "string" && err2.code ? err2.code : "HTTP_" + response.status;
      const message = typeof err2.message === "string" && err2.message ? err2.message : "request failed";
      throw new CpwbApiError(code, message, response.status, err2.details);
    }
    return data;
  }
  return {
    health({ signal } = {}) {
      return request2({ path: "/health", signal });
    },
    projects: {
      list({ signal } = {}) {
        return request2({ path: "/projects", signal });
      },
      create({ name, path, workspaceId }, { signal } = {}) {
        return request2({ method: "POST", path: "/projects", body: { name, path, workspaceId }, signal });
      },
      update({ id, name }, { signal } = {}) {
        return request2({ method: "PATCH", path: "/projects/" + id, body: { name }, signal });
      },
      deletionPlan(id, { signal } = {}) {
        return request2({ path: "/projects/" + id + "/deletion-plan", signal });
      },
      remove(id, { sessionPolicy = "detach", signal } = {}) {
        return request2({ method: "DELETE", path: "/projects/" + id, query: { sessionPolicy }, signal });
      }
    },
    knowledgeBases: {
      list({ signal } = {}) {
        return request2({ path: "/knowledge-bases", signal });
      },
      create({ name, description }, { signal } = {}) {
        return request2({ method: "POST", path: "/knowledge-bases", body: { name, description }, signal });
      },
      deletionPlan(id, { signal } = {}) {
        return request2({ path: "/knowledge-bases/" + id + "/deletion-plan", signal });
      },
      remove(id, { sessionPolicy = "detach", signal } = {}) {
        return request2({ method: "DELETE", path: "/knowledge-bases/" + id, query: { sessionPolicy }, signal });
      }
    },
    projectKnowledgeBases: {
      list(projectId, { signal } = {}) {
        return request2({ path: "/projects/" + projectId + "/knowledge-bases", signal });
      },
      link(projectId, knowledgeBaseId, { signal } = {}) {
        return request2({ method: "POST", path: "/projects/" + projectId + "/knowledge-bases/" + knowledgeBaseId, signal });
      },
      unlink(projectId, knowledgeBaseId, { signal } = {}) {
        return request2({ method: "DELETE", path: "/projects/" + projectId + "/knowledge-bases/" + knowledgeBaseId, signal });
      }
    },
    knowledgeBaseProjects: {
      list(knowledgeBaseId, { signal } = {}) {
        return request2({ path: "/knowledge-bases/" + knowledgeBaseId + "/projects", signal });
      }
    },
    skills: {
      list({ scope, projectId, signal } = {}) {
        return request2({ path: "/skills", query: { scope, projectId }, signal });
      },
      importBundle({ archive, scope, projectId, sourceName, replace = false }, { signal } = {}) {
        return request2({
          method: "POST",
          path: "/skills/import",
          rawBody: archive,
          headers: {
            "content-type": "application/zip",
            "x-cpwb-skill-scope": scope,
            "x-cpwb-filename": encodeURIComponent(sourceName),
            ...projectId === void 0 ? {} : { "x-cpwb-project-id": String(projectId) },
            "x-cpwb-replace": String(replace)
          },
          signal
        });
      },
      setEnabled({ name, scope, projectId, enabled }, { signal } = {}) {
        return request2({
          method: "PATCH",
          path: "/skills/" + encodeURIComponent(name),
          body: { scope, projectId, operation: enabled ? "enable" : "disable" },
          signal
        });
      },
      remove({ name, scope, projectId }, { signal } = {}) {
        return request2({
          method: "DELETE",
          path: "/skills/" + encodeURIComponent(name),
          query: { scope, projectId },
          signal
        });
      },
      reveal({ name, scope, projectId }, { signal } = {}) {
        return request2({
          method: "POST",
          path: "/skills/" + encodeURIComponent(name) + "/reveal",
          body: { scope, projectId },
          signal
        });
      }
    },
    documents: {
      contentUrl(id, { download = false } = {}) {
        if (!Number.isSafeInteger(id) || id < 1) throw new TypeError("document id must be a positive integer");
        return basePath + "/documents/" + id + "/content" + (download ? "?download=1" : "");
      },
      list({ scope, scopeId, signal } = {}) {
        return request2({ path: "/documents", query: { scope, scopeId }, signal });
      },
      get(id, { signal } = {}) {
        return request2({ path: "/documents/" + id, signal });
      },
      upload({ file, scope, scopeId }, { signal } = {}) {
        return request2({
          method: "POST",
          path: "/documents",
          rawBody: file,
          headers: {
            "x-cpwb-filename": encodeURIComponent(file.name),
            "x-cpwb-scope": scope,
            "x-cpwb-scope-id": String(scopeId)
          },
          signal
        });
      },
      reindex(id, { signal } = {}) {
        return request2({ method: "POST", path: "/documents/" + id + "/reindex", signal });
      },
      unlink({ id, scope, scopeId }, { signal } = {}) {
        return request2({ method: "DELETE", path: "/documents/" + id + "/links/" + scope + "/" + scopeId, signal });
      }
    },
    search({ scope, scopeId, query, limit }, { signal } = {}) {
      return request2({ method: "POST", path: "/search", body: { scope, scopeId, query, limit }, signal });
    },
    todos: {
      list({ projectId, signal } = {}) {
        return request2({ path: "/todos", query: { projectId }, signal });
      },
      create({ projectId, title, dueAt, source }, { signal } = {}) {
        return request2({ method: "POST", path: "/todos", body: { projectId, title, dueAt, source }, signal });
      },
      update({ id, title, dueAt, done }, { signal } = {}) {
        return request2({ method: "PATCH", path: "/todos", body: { id, title, dueAt, done }, signal });
      },
      remove(id, { signal } = {}) {
        return request2({ method: "DELETE", path: "/todos/" + id, signal });
      }
    },
    settings: {
      timezone({ signal } = {}) {
        return request2({ path: "/settings/timezone", signal });
      },
      updateTimezone(timezone, { signal } = {}) {
        return request2({ method: "PATCH", path: "/settings/timezone", body: { timezone }, signal });
      },
      automationPrompts({ signal } = {}) {
        return request2({ path: "/settings/automation-prompts", signal });
      },
      updateAutomationPrompts(body, { signal } = {}) {
        return request2({ method: "PATCH", path: "/settings/automation-prompts", body, signal });
      },
      embedding({ signal } = {}) {
        return request2({ path: "/settings/embedding", signal });
      },
      updateEmbedding(body, { signal } = {}) {
        return request2({ method: "PATCH", path: "/settings/embedding", body, signal });
      },
      testEmbedding(body, { signal } = {}) {
        return request2({ method: "POST", path: "/settings/embedding/test", body, signal });
      },
      indexStatus({ signal } = {}) {
        return request2({ path: "/settings/index", signal });
      },
      reindex({ signal } = {}) {
        return request2({ method: "POST", path: "/settings/index/reindex", signal });
      },
      putEmbeddingCredential(body, { signal } = {}) {
        return request2({ method: "PUT", path: "/settings/embedding/credential", body, signal });
      },
      deleteEmbeddingCredential(body, { signal } = {}) {
        return request2({ method: "DELETE", path: "/settings/embedding/credential", body, signal });
      },
      network({ signal } = {}) {
        return request2({ path: "/settings/network", signal });
      },
      updateNetwork(body, { signal } = {}) {
        return request2({ method: "PATCH", path: "/settings/network", body, signal });
      },
      testNetwork(body, { signal } = {}) {
        return request2({ method: "POST", path: "/settings/network/test", body, signal });
      },
      authStatus({ signal } = {}) {
        return request2({ path: "/settings/auth/status", signal });
      },
      authTest({ signal } = {}) {
        return request2({ method: "POST", path: "/settings/auth/test", body: {}, signal });
      },
      connectCodex({ signal } = {}) {
        return request2({ method: "POST", path: "/settings/auth/codex/connect", body: {}, signal });
      }
    },
    knowledgeBaseIndex: {
      reindex(knowledgeBaseId, { signal } = {}) {
        return request2({ method: "POST", path: "/knowledge-bases/" + knowledgeBaseId + "/reindex", signal });
      }
    },
    schedules: {
      list({ projectId, signal } = {}) {
        return request2({ path: "/schedules", query: { projectId }, signal });
      },
      create({ projectId, name, recurrence, startsAt, prompt, enabled }, { signal } = {}) {
        return request2({ method: "POST", path: "/schedules", body: { projectId, name, recurrence, startsAt, prompt, enabled }, signal });
      },
      update({ id, name, prompt, recurrence, startsAt, enabled }, { signal } = {}) {
        return request2({ method: "PATCH", path: "/schedules", body: { id, name, prompt, recurrence, startsAt, enabled }, signal });
      },
      remove(id, { signal } = {}) {
        return request2({ method: "DELETE", path: "/schedules/" + id, signal });
      },
      run(id, { signal } = {}) {
        return request2({ method: "POST", path: "/schedules/" + id + "/run", signal });
      },
      runs(id, { signal } = {}) {
        return request2({ path: "/schedules/" + id + "/runs", signal });
      }
    },
    summaries: {
      list({ projectId, signal } = {}) {
        return request2({ path: "/summaries", query: { projectId }, signal });
      },
      run({ projectId, summaryDate }, { signal } = {}) {
        return request2({ method: "POST", path: "/summaries/run", body: { projectId, summaryDate }, signal });
      },
      remove(id, { signal } = {}) {
        return request2({ method: "DELETE", path: "/summaries/" + id, signal });
      }
    },
    automation: {
      get(projectId, { signal } = {}) {
        return request2({ path: "/projects/" + projectId + "/automation", signal });
      },
      update({ projectId, summaryEnabled, nextDayTodosEnabled }, { signal } = {}) {
        return request2({ method: "PATCH", path: "/projects/" + projectId + "/automation", body: { summaryEnabled, nextDayTodosEnabled }, signal });
      }
    },
    maintenance: {
      createPurgeJob(input, { signal } = {}) {
        return request2({
          method: "POST",
          path: "/maintenance/purge-jobs",
          body: input,
          signal
        });
      },
      getPurgeJob(jobId, { signal } = {}) {
        return request2({
          path: "/maintenance/purge-jobs/" + encodeURIComponent(jobId),
          signal
        });
      }
    },
    chat: {
      sessions: {
        list({ scopeKind, scopeId, archived, limit, offset, query } = {}, { signal } = {}) {
          return request2({
            path: "/chat/sessions",
            query: { scopeKind, scopeId, archived, limit, offset, query },
            signal
          });
        },
        create({ scope, title, pinnedSources = [] }, { signal } = {}) {
          return request2({ method: "POST", path: "/chat/sessions", body: { scope, title, pinnedSources }, signal });
        },
        open(sessionId, { signal } = {}) {
          return request2({ method: "POST", path: "/chat/sessions/" + encodeURIComponent(sessionId) + "/open", body: {}, signal });
        },
        confirm(sessionId, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "confirmDraft" }, signal });
        },
        rename({ sessionId, title }, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "rename", title }, signal });
        },
        move({ sessionId, scope }, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "move", scope }, signal });
        },
        archive(sessionId, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "archive" }, signal });
        },
        restore(sessionId, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "restore" }, signal });
        },
        remove(sessionId, { signal } = {}) {
          return request2({ method: "DELETE", path: "/chat/sessions/" + encodeURIComponent(sessionId), signal });
        },
        context: {
          get(sessionId, { signal } = {}) {
            return request2({ path: "/chat/sessions/" + encodeURIComponent(sessionId) + "/context", signal });
          },
          set({ sessionId, source, mode }, { signal } = {}) {
            return request2({ method: "PUT", path: "/chat/sessions/" + encodeURIComponent(sessionId) + "/context", body: { source, mode }, signal });
          },
          remove({ sessionId, source }, { signal } = {}) {
            return request2({
              method: "DELETE",
              path: "/chat/sessions/" + encodeURIComponent(sessionId) + "/context",
              query: { sourceKind: source.kind, sourceId: source.id },
              signal
            });
          }
        }
      }
    }
  };
}
var cpwbApi = createCpwbApi();

// src/client/storeInstance.js
var store = createWorkbenchStore(cpwbApi);
function getStore() {
  return store;
}

// src/client/sessionNavigation.js
async function openKnownWorkbenchSession({ sessionId, store: store3, sessions, workspaces, navigation: navigation2 }) {
  if (!store3?.actions?.openSession || !sessions || !navigation2?.beginConversation) {
    throw new TypeError("session navigation dependencies are unavailable");
  }
  const transitionId = navigation2.beginConversation(sessionId);
  try {
    const result = await store3.actions.openSession(sessionId);
    const targetId = result?.sessionId || sessionId;
    await waitForSessionReady(sessions, targetId, { workspaces });
    if (navigation2.isConversationTransitionCurrent(sessionId, transitionId)) {
      sessions.open(targetId);
      navigation2.completeConversation(sessionId, transitionId);
    }
    return result;
  } catch (error) {
    navigation2.failConversation(sessionId, transitionId, error);
    throw error;
  }
}

// src/client/navigation.js
var PAGES = /* @__PURE__ */ new Set(["home", "knowledge", "sessions", "skills", "draft", "conversation"]);
function createNavigationStore({ initialPage = "home" } = {}) {
  if (!PAGES.has(initialPage)) throw new TypeError("unknown Workbench page: " + initialPage);
  let snapshot = { page: initialPage, sessionId: null };
  let conversationTransition = 0;
  const listeners = /* @__PURE__ */ new Set();
  function publish(page, sessionId = null, meta = {}) {
    const next = { page, sessionId, ...meta };
    if (snapshot.page === next.page && snapshot.sessionId === next.sessionId && snapshot.opening === next.opening && snapshot.error?.message === next.error?.message) return;
    snapshot = next;
    for (const listener of listeners) listener();
  }
  function openPage(page) {
    conversationTransition += 1;
    publish(page);
  }
  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    openHome() {
      openPage("home");
    },
    openKnowledge() {
      openPage("knowledge");
    },
    openSessions() {
      openPage("sessions");
    },
    openSkills() {
      openPage("skills");
    },
    openDraft() {
      openPage("draft");
    },
    openConversation(sessionId) {
      if (typeof sessionId !== "string" || sessionId.length === 0) {
        throw new TypeError("sessionId is required");
      }
      conversationTransition += 1;
      publish("conversation", sessionId);
    },
    beginConversation(sessionId) {
      if (typeof sessionId !== "string" || sessionId.length === 0) {
        throw new TypeError("sessionId is required");
      }
      conversationTransition += 1;
      publish("conversation", sessionId, { opening: true });
      return conversationTransition;
    },
    isConversationTransitionCurrent(sessionId, transitionId) {
      return snapshot.page === "conversation" && snapshot.sessionId === sessionId && conversationTransition === transitionId;
    },
    completeConversation(sessionId, transitionId) {
      if (snapshot.page !== "conversation" || snapshot.sessionId !== sessionId || conversationTransition !== transitionId) return false;
      publish("conversation", sessionId);
      return true;
    },
    failConversation(sessionId, transitionId, error) {
      if (snapshot.page !== "conversation" || snapshot.sessionId !== sessionId || conversationTransition !== transitionId) return false;
      const message = error && typeof error.message === "string" ? error.message : String(error || "\u65E0\u6CD5\u6062\u590D\u4F1A\u8BDD");
      publish("conversation", sessionId, { error: { message } });
      return true;
    }
  };
}

// src/client/WorkbenchShell.js
var import_react42 = __toESM(require("react"), 1);

// node_modules/@phosphor-icons/react/dist/defs/Archive.es.js
var a = __toESM(require("react"), 1);
var e = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a.createElement(a.Fragment, null, /* @__PURE__ */ a.createElement("path", { d: "M224,44H32A20,20,0,0,0,12,64V88a20,20,0,0,0,16,19.6V192a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V107.6A20,20,0,0,0,244,88V64A20,20,0,0,0,224,44ZM36,68H220V84H36ZM52,188V108H204v80Zm112-52a12,12,0,0,1-12,12H104a12,12,0,0,1,0-24h48A12,12,0,0,1,164,136Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a.createElement(a.Fragment, null, /* @__PURE__ */ a.createElement("path", { d: "M216,96v96a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96Z", opacity: "0.2" }), /* @__PURE__ */ a.createElement("path", { d: "M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a.createElement(a.Fragment, null, /* @__PURE__ */ a.createElement("path", { d: "M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm-72,96H104a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm72-56H32V64H224V88Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a.createElement(a.Fragment, null, /* @__PURE__ */ a.createElement("path", { d: "M224,50H32A14,14,0,0,0,18,64V88a14,14,0,0,0,14,14h2v90a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V102h2a14,14,0,0,0,14-14V64A14,14,0,0,0,224,50ZM210,192a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V102H210ZM226,88a2,2,0,0,1-2,2H32a2,2,0,0,1-2-2V64a2,2,0,0,1,2-2H224a2,2,0,0,1,2,2ZM98,136a6,6,0,0,1,6-6h48a6,6,0,0,1,0,12H104A6,6,0,0,1,98,136Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a.createElement(a.Fragment, null, /* @__PURE__ */ a.createElement("path", { d: "M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a.createElement(a.Fragment, null, /* @__PURE__ */ a.createElement("path", { d: "M224,52H32A12,12,0,0,0,20,64V88a12,12,0,0,0,12,12h4v92a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V100h4a12,12,0,0,0,12-12V64A12,12,0,0,0,224,52ZM212,192a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V100H212ZM228,88a4,4,0,0,1-4,4H32a4,4,0,0,1-4-4V64a4,4,0,0,1,4-4H224a4,4,0,0,1,4,4ZM100,136a4,4,0,0,1,4-4h48a4,4,0,0,1,0,8H104A4,4,0,0,1,100,136Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowClockwise.es.js
var e2 = __toESM(require("react"), 1);
var a2 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M244,56v48a12,12,0,0,1-12,12H184a12,12,0,1,1,0-24H201.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76,76,0,1,0,127,204h1a75.53,75.53,0,0,0,52.15-20.72,12,12,0,0,1,16.49,17.45A99.45,99.45,0,0,1,128,228h-1.37A100,100,0,1,1,198.51,57.06L220,76.72V56a12,12,0,0,1,24,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z", opacity: "0.2" }), /* @__PURE__ */ e2.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1-5.66-13.66l17-17-10.55-9.65-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,1,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60l10.93,10L226.34,50.3A8,8,0,0,1,240,56Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M238,56v48a6,6,0,0,1-6,6H184a6,6,0,0,1,0-12h32.55l-30.38-27.8c-.06-.06-.12-.13-.19-.19a82,82,0,1,0-1.7,117.65,6,6,0,0,1,8.24,8.73A93.46,93.46,0,0,1,128,222h-1.28A94,94,0,1,1,194.37,61.4L226,90.35V56a6,6,0,1,1,12,0Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M236,56v48a4,4,0,0,1-4,4H184a4,4,0,0,1,0-8h37.7L187.53,68.69l-.13-.12a84,84,0,1,0-1.75,120.51,4,4,0,0,1,5.5,5.82A91.43,91.43,0,0,1,128,220h-1.26A92,92,0,1,1,193,62.84l35,32.05V56a4,4,0,1,1,8,0Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowCounterClockwise.es.js
var a3 = __toESM(require("react"), 1);
var e3 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a3.createElement(a3.Fragment, null, /* @__PURE__ */ a3.createElement("path", { d: "M228,128a100,100,0,0,1-98.66,100H128a99.39,99.39,0,0,1-68.62-27.29,12,12,0,0,1,16.48-17.45,76,76,0,1,0-1.57-109c-.13.13-.25.25-.39.37L54.89,92H72a12,12,0,0,1,0,24H24a12,12,0,0,1-12-12V56a12,12,0,0,1,24,0V76.72L57.48,57.06A100,100,0,0,1,228,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a3.createElement(a3.Fragment, null, /* @__PURE__ */ a3.createElement("path", { d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z", opacity: "0.2" }), /* @__PURE__ */ a3.createElement("path", { d: "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a3.createElement(a3.Fragment, null, /* @__PURE__ */ a3.createElement("path", { d: "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L60.63,81.29l17,17A8,8,0,0,1,72,112H24a8,8,0,0,1-8-8V56A8,8,0,0,1,29.66,50.3L49.31,70,60.25,60A96,96,0,0,1,224,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a3.createElement(a3.Fragment, null, /* @__PURE__ */ a3.createElement("path", { d: "M222,128a94,94,0,0,1-92.74,94H128a93.43,93.43,0,0,1-64.5-25.65,6,6,0,1,1,8.24-8.72A82,82,0,1,0,70,70l-.19.19L39.44,98H72a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V56a6,6,0,0,1,12,0V90.34L61.63,61.4A94,94,0,0,1,222,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a3.createElement(a3.Fragment, null, /* @__PURE__ */ a3.createElement("path", { d: "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a3.createElement(a3.Fragment, null, /* @__PURE__ */ a3.createElement("path", { d: "M220,128a92,92,0,0,1-90.77,92H128a91.47,91.47,0,0,1-63.13-25.1,4,4,0,1,1,5.5-5.82A84,84,0,1,0,68.6,68.57l-.13.12L34.3,100H72a4,4,0,0,1,0,8H24a4,4,0,0,1-4-4V56a4,4,0,0,1,8,0V94.89l35-32A92,92,0,0,1,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowLeft.es.js
var e4 = __toESM(require("react"), 1);
var a4 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e4.createElement(e4.Fragment, null, /* @__PURE__ */ e4.createElement("path", { d: "M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e4.createElement(e4.Fragment, null, /* @__PURE__ */ e4.createElement("path", { d: "M112,56V200L40,128Z", opacity: "0.2" }), /* @__PURE__ */ e4.createElement("path", { d: "M216,120H120V56a8,8,0,0,0-13.66-5.66l-72,72a8,8,0,0,0,0,11.32l72,72A8,8,0,0,0,120,200V136h96a8,8,0,0,0,0-16ZM104,180.69,51.31,128,104,75.31Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e4.createElement(e4.Fragment, null, /* @__PURE__ */ e4.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H120v64a8,8,0,0,1-13.66,5.66l-72-72a8,8,0,0,1,0-11.32l72-72A8,8,0,0,1,120,56v64h96A8,8,0,0,1,224,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e4.createElement(e4.Fragment, null, /* @__PURE__ */ e4.createElement("path", { d: "M222,128a6,6,0,0,1-6,6H54.49l61.75,61.76a6,6,0,1,1-8.48,8.48l-72-72a6,6,0,0,1,0-8.48l72-72a6,6,0,0,1,8.48,8.48L54.49,122H216A6,6,0,0,1,222,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e4.createElement(e4.Fragment, null, /* @__PURE__ */ e4.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e4.createElement(e4.Fragment, null, /* @__PURE__ */ e4.createElement("path", { d: "M220,128a4,4,0,0,1-4,4H49.66l65.17,65.17a4,4,0,0,1-5.66,5.66l-72-72a4,4,0,0,1,0-5.66l72-72a4,4,0,0,1,5.66,5.66L49.66,124H216A4,4,0,0,1,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowRight.es.js
var e5 = __toESM(require("react"), 1);
var a5 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e5.createElement(e5.Fragment, null, /* @__PURE__ */ e5.createElement("path", { d: "M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e5.createElement(e5.Fragment, null, /* @__PURE__ */ e5.createElement("path", { d: "M216,128l-72,72V56Z", opacity: "0.2" }), /* @__PURE__ */ e5.createElement("path", { d: "M221.66,122.34l-72-72A8,8,0,0,0,136,56v64H40a8,8,0,0,0,0,16h96v64a8,8,0,0,0,13.66,5.66l72-72A8,8,0,0,0,221.66,122.34ZM152,180.69V75.31L204.69,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e5.createElement(e5.Fragment, null, /* @__PURE__ */ e5.createElement("path", { d: "M221.66,133.66l-72,72A8,8,0,0,1,136,200V136H40a8,8,0,0,1,0-16h96V56a8,8,0,0,1,13.66-5.66l72,72A8,8,0,0,1,221.66,133.66Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e5.createElement(e5.Fragment, null, /* @__PURE__ */ e5.createElement("path", { d: "M220.24,132.24l-72,72a6,6,0,0,1-8.48-8.48L201.51,134H40a6,6,0,0,1,0-12H201.51L139.76,60.24a6,6,0,0,1,8.48-8.48l72,72A6,6,0,0,1,220.24,132.24Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e5.createElement(e5.Fragment, null, /* @__PURE__ */ e5.createElement("path", { d: "M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e5.createElement(e5.Fragment, null, /* @__PURE__ */ e5.createElement("path", { d: "M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowSquareOut.es.js
var a6 = __toESM(require("react"), 1);
var e6 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M228,104a12,12,0,0,1-24,0V69l-59.51,59.51a12,12,0,0,1-17-17L187,52H152a12,12,0,0,1,0-24h64a12,12,0,0,1,12,12Zm-44,24a12,12,0,0,0-12,12v64H52V84h64a12,12,0,0,0,0-24H48A20,20,0,0,0,28,80V208a20,20,0,0,0,20,20H176a20,20,0,0,0,20-20V140A12,12,0,0,0,184,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement(
      "path",
      {
        d: "M184,80V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H176A8,8,0,0,1,184,80Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a6.createElement("path", { d: "M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M192,136v72a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V80A16,16,0,0,1,48,64h72a8,8,0,0,1,0,16H48V208H176V136a8,8,0,0,1,16,0Zm32-96a8,8,0,0,0-8-8H152a8,8,0,0,0-5.66,13.66L172.69,72l-42.35,42.34a8,8,0,0,0,11.32,11.32L184,83.31l26.34,26.35A8,8,0,0,0,224,104Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M222,104a6,6,0,0,1-12,0V54.49l-69.75,69.75a6,6,0,0,1-8.48-8.48L201.51,46H152a6,6,0,0,1,0-12h64a6,6,0,0,1,6,6Zm-38,26a6,6,0,0,0-6,6v72a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V80a2,2,0,0,1,2-2h72a6,6,0,0,0,0-12H48A14,14,0,0,0,34,80V208a14,14,0,0,0,14,14H176a14,14,0,0,0,14-14V136A6,6,0,0,0,184,130Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M220,104a4,4,0,0,1-8,0V49.66l-73.16,73.17a4,4,0,0,1-5.66-5.66L206.34,44H152a4,4,0,0,1,0-8h64a4,4,0,0,1,4,4Zm-36,28a4,4,0,0,0-4,4v72a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V80a4,4,0,0,1,4-4h72a4,4,0,0,0,0-8H48A12,12,0,0,0,36,80V208a12,12,0,0,0,12,12H176a12,12,0,0,0,12-12V136A4,4,0,0,0,184,132Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowUpRight.es.js
var e7 = __toESM(require("react"), 1);
var a7 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e7.createElement(e7.Fragment, null, /* @__PURE__ */ e7.createElement("path", { d: "M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e7.createElement(e7.Fragment, null, /* @__PURE__ */ e7.createElement("path", { d: "M192,64V168L88,64Z", opacity: "0.2" }), /* @__PURE__ */ e7.createElement("path", { d: "M192,56H88a8,8,0,0,0-5.66,13.66L128.69,116,58.34,186.34a8,8,0,0,0,11.32,11.32L140,127.31l46.34,46.35A8,8,0,0,0,200,168V64A8,8,0,0,0,192,56Zm-8,92.69-38.34-38.34h0L107.31,72H184Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e7.createElement(e7.Fragment, null, /* @__PURE__ */ e7.createElement("path", { d: "M200,64V168a8,8,0,0,1-13.66,5.66L140,127.31,69.66,197.66a8,8,0,0,1-11.32-11.32L128.69,116,82.34,69.66A8,8,0,0,1,88,56H192A8,8,0,0,1,200,64Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e7.createElement(e7.Fragment, null, /* @__PURE__ */ e7.createElement("path", { d: "M198,64V168a6,6,0,0,1-12,0V78.48L68.24,196.24a6,6,0,0,1-8.48-8.48L177.52,70H88a6,6,0,0,1,0-12H192A6,6,0,0,1,198,64Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e7.createElement(e7.Fragment, null, /* @__PURE__ */ e7.createElement("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e7.createElement(e7.Fragment, null, /* @__PURE__ */ e7.createElement("path", { d: "M196,64V168a4,4,0,0,1-8,0V73.66L66.83,194.83a4,4,0,0,1-5.66-5.66L182.34,68H88a4,4,0,0,1,0-8H192A4,4,0,0,1,196,64Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowsOutLineHorizontal.es.js
var a8 = __toESM(require("react"), 1);
var e8 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M140,40V216a12,12,0,0,1-24,0V40a12,12,0,0,1,24,0ZM88,116H45l11.52-11.51a12,12,0,0,0-17-17l-32,32a12,12,0,0,0,0,17l32,32a12,12,0,0,0,17-17L45,140H88a12,12,0,0,0,0-24Zm160.49,3.51-32-32a12,12,0,0,0-17,17L211,116H168a12,12,0,0,0,0,24h43l-11.52,11.51a12,12,0,0,0,17,17l32-32A12,12,0,0,0,248.49,119.51Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement(
      "path",
      {
        d: "M240,56V200a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V56A16,16,0,0,1,32,40H224A16,16,0,0,1,240,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a8.createElement("path", { d: "M136,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM96,120H35.31l18.35-18.34A8,8,0,0,0,42.34,90.34l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.32-11.32L35.31,136H96a8,8,0,0,0,0-16Zm149.66,2.34-32-32a8,8,0,0,0-11.32,11.32L220.69,120H160a8,8,0,0,0,0,16h60.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,245.66,122.34Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M104,128a8,8,0,0,1-8,8H56v24a8,8,0,0,1-13.66,5.66l-32-32a8,8,0,0,1,0-11.32l32-32A8,8,0,0,1,56,96v24H96A8,8,0,0,1,104,128Zm141.66-5.66-32-32A8,8,0,0,0,200,96v24H160a8,8,0,0,0,0,16h40v24a8,8,0,0,0,13.66,5.66l32-32A8,8,0,0,0,245.66,122.34ZM128,32a8,8,0,0,0-8,8V216a8,8,0,0,0,16,0V40A8,8,0,0,0,128,32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M134,40V216a6,6,0,0,1-12,0V40a6,6,0,0,1,12,0ZM96,122H30.49l21.75-21.76a6,6,0,0,0-8.48-8.48l-32,32a6,6,0,0,0,0,8.48l32,32a6,6,0,0,0,8.48-8.48L30.49,134H96a6,6,0,0,0,0-12Zm148.24,1.76-32-32a6,6,0,0,0-8.48,8.48L225.51,122H160a6,6,0,0,0,0,12h65.51l-21.75,21.76a6,6,0,1,0,8.48,8.48l32-32A6,6,0,0,0,244.24,123.76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M136,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM96,120H35.31l18.35-18.34A8,8,0,0,0,42.34,90.34l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.32-11.32L35.31,136H96a8,8,0,0,0,0-16Zm149.66,2.34-32-32a8,8,0,0,0-11.32,11.32L220.69,120H160a8,8,0,0,0,0,16h60.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,245.66,122.34Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M132,40V216a4,4,0,0,1-8,0V40a4,4,0,0,1,8,0ZM96,124H25.66L50.83,98.83a4,4,0,0,0-5.66-5.66l-32,32a4,4,0,0,0,0,5.66l32,32a4,4,0,1,0,5.66-5.66L25.66,132H96a4,4,0,0,0,0-8Zm146.83,1.17-32-32a4,4,0,0,0-5.66,5.66L230.34,124H160a4,4,0,0,0,0,8h70.34l-25.17,25.17a4,4,0,0,0,5.66,5.66l32-32A4,4,0,0,0,242.83,125.17Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Books.es.js
var a9 = __toESM(require("react"), 1);
var e9 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a9.createElement(a9.Fragment, null, /* @__PURE__ */ a9.createElement("path", { d: "M235.57,193.73,202.38,35.93a20,20,0,0,0-23.76-15.48L131.81,30.51a19.82,19.82,0,0,0-11,6.65A20,20,0,0,0,104,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V90.25l25.62,121.82A20,20,0,0,0,169.15,228a20.27,20.27,0,0,0,4.23-.45l46.81-10.06A20.1,20.1,0,0,0,235.57,193.73ZM148.19,88.65l39-8.38,2.53,12-39,8.38Zm7.46,35.5,39-8.38,9.16,43.58-39,8.38Zm24.06-79.39,2.53,12-39,8.38-2.53-12ZM60,88h40v80H60Zm40-36V64H60V52ZM60,204V192h40v12Zm112.29-.76-2.53-12,39-8.38,2.53,12Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a9.createElement(a9.Fragment, null, /* @__PURE__ */ a9.createElement(
      "path",
      {
        d: "M48,72h64V184H48ZM190.64,38.39a8,8,0,0,0-9.5-6.21l-46.81,10a8.07,8.07,0,0,0-6.15,9.57L139.79,107l62.46-13.42Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a9.createElement("path", { d: "M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a9.createElement(a9.Fragment, null, /* @__PURE__ */ a9.createElement("path", { d: "M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm10,47.38-3.35-15.9,46.82-10.06,3.34,15.9Zm70,100.41-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm48,160H56V192h48v16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a9.createElement(a9.Fragment, null, /* @__PURE__ */ a9.createElement("path", { d: "M104,34H56A14,14,0,0,0,42,48V208a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V48A14,14,0,0,0,104,34ZM54,78h52V178H54Zm2-32h48a2,2,0,0,1,2,2V66H54V48A2,2,0,0,1,56,46Zm48,164H56a2,2,0,0,1-2-2V190h52v18A2,2,0,0,1,104,210Zm125.7-15L196.51,37.16a14,14,0,0,0-16.63-10.85L133.07,36.37A14.09,14.09,0,0,0,122.3,53l33.19,157.81a14,14,0,0,0,6.1,8.9,13.85,13.85,0,0,0,7.57,2.26,13.55,13.55,0,0,0,3-.32l46.81-10.05A14.09,14.09,0,0,0,229.7,195Zm-82.81-83.32,50.73-10.9,14.12,67.16L161,178.81Zm-6.63-31.56L191,69.19,195.15,89l-50.73,10.9Zm-4.66-32,46.8-10.05a2.18,2.18,0,0,1,.42,0,1.89,1.89,0,0,1,1.05.32,2,2,0,0,1,.89,1.31l3.75,17.82L137.79,68.34l-3.74-17.78A2.07,2.07,0,0,1,135.6,48.1Zm80.81,151.8L169.6,210a1.92,1.92,0,0,1-1.47-.27,2,2,0,0,1-.89-1.31l-3.75-17.82,50.72-10.9L218,197.43A2.07,2.07,0,0,1,216.41,199.9Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a9.createElement(a9.Fragment, null, /* @__PURE__ */ a9.createElement("path", { d: "M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a9.createElement(a9.Fragment, null, /* @__PURE__ */ a9.createElement("path", { d: "M104,36H56A12,12,0,0,0,44,48V208a12,12,0,0,0,12,12h48a12,12,0,0,0,12-12V48A12,12,0,0,0,104,36ZM52,76h56V180H52Zm4-32h48a4,4,0,0,1,4,4V68H52V48A4,4,0,0,1,56,44Zm48,168H56a4,4,0,0,1-4-4V188h56v20A4,4,0,0,1,104,212Zm123.74-16.62L194.55,37.57a12,12,0,0,0-14.25-9.3L133.49,38.32a12.1,12.1,0,0,0-9.23,14.3l33.19,157.81a12,12,0,0,0,14.25,9.3l46.81-10.06h0A12.08,12.08,0,0,0,227.74,195.38Zm-83.21-85.27,54.63-11.73,15,71.07-54.63,11.74Zm-6.64-31.56,54.64-11.74,5,23.74-54.64,11.73Zm-2.71-32.4L182,36.09a4,4,0,0,1,.84-.09,3.94,3.94,0,0,1,2.14.64,4,4,0,0,1,1.76,2.58L190.88,59,136.24,70.72,132.09,51A4.07,4.07,0,0,1,135.18,46.15Zm81.65,155.7L170,211.91a4,4,0,0,1-3-.55,4,4,0,0,1-1.76-2.58L161.12,189l54.64-11.73L219.91,197A4.07,4.07,0,0,1,216.83,201.85Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CalendarBlank.es.js
var a10 = __toESM(require("react"), 1);
var e10 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a10.createElement(a10.Fragment, null, /* @__PURE__ */ a10.createElement("path", { d: "M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a10.createElement(a10.Fragment, null, /* @__PURE__ */ a10.createElement(
      "path",
      {
        d: "M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a10.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a10.createElement(a10.Fragment, null, /* @__PURE__ */ a10.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,48H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a10.createElement(a10.Fragment, null, /* @__PURE__ */ a10.createElement("path", { d: "M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a10.createElement(a10.Fragment, null, /* @__PURE__ */ a10.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a10.createElement(a10.Fragment, null, /* @__PURE__ */ a10.createElement("path", { d: "M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM48,44H76V56a4,4,0,0,0,8,0V44h88V56a4,4,0,0,0,8,0V44h28a4,4,0,0,1,4,4V84H44V48A4,4,0,0,1,48,44ZM208,212H48a4,4,0,0,1-4-4V92H212V208A4,4,0,0,1,208,212Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CalendarCheck.es.js
var a11 = __toESM(require("react"), 1);
var V = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement(
      "path",
      {
        d: "M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a11.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM169.66,133.66l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35a8,8,0,0,1,11.32,11.32ZM48,80V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-39.76-86.24a6,6,0,0,1,0,8.48l-48,48a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L116,167.51l43.76-43.75A6,6,0,0,1,168.24,123.76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM48,44H76V56a4,4,0,0,0,8,0V44h88V56a4,4,0,0,0,8,0V44h28a4,4,0,0,1,4,4V84H44V48A4,4,0,0,1,48,44ZM208,212H48a4,4,0,0,1-4-4V92H212V208A4,4,0,0,1,208,212Zm-41.17-86.83a4,4,0,0,1,0,5.66l-48,48a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L116,170.34l45.17-45.17A4,4,0,0,1,166.83,125.17Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CaretDown.es.js
var e11 = __toESM(require("react"), 1);
var t = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e11.createElement(e11.Fragment, null, /* @__PURE__ */ e11.createElement("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e11.createElement(e11.Fragment, null, /* @__PURE__ */ e11.createElement("path", { d: "M208,96l-80,80L48,96Z", opacity: "0.2" }), /* @__PURE__ */ e11.createElement("path", { d: "M215.39,92.94A8,8,0,0,0,208,88H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,215.39,92.94ZM128,164.69,67.31,104H188.69Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e11.createElement(e11.Fragment, null, /* @__PURE__ */ e11.createElement("path", { d: "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e11.createElement(e11.Fragment, null, /* @__PURE__ */ e11.createElement("path", { d: "M212.24,100.24l-80,80a6,6,0,0,1-8.48,0l-80-80a6,6,0,0,1,8.48-8.48L128,167.51l75.76-75.75a6,6,0,0,1,8.48,8.48Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e11.createElement(e11.Fragment, null, /* @__PURE__ */ e11.createElement("path", { d: "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e11.createElement(e11.Fragment, null, /* @__PURE__ */ e11.createElement("path", { d: "M210.83,98.83l-80,80a4,4,0,0,1-5.66,0l-80-80a4,4,0,0,1,5.66-5.66L128,170.34l77.17-77.17a4,4,0,1,1,5.66,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ChatCircleDots.es.js
var a12 = __toESM(require("react"), 1);
var e12 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M120,128a16,16,0,1,1-16-16A16,16,0,0,1,120,128Zm32-16a16,16,0,1,0,16,16A16,16,0,0,0,152,112Zm84,16A108,108,0,0,1,78.77,224.15L46.34,235A20,20,0,0,1,21,209.66l10.81-32.43A108,108,0,1,1,236,128Zm-24,0A84,84,0,1,0,55.27,170.06a12,12,0,0,1,1,9.81l-9.93,29.79,29.79-9.93a12.1,12.1,0,0,1,3.8-.62,12,12,0,0,1,6,1.62A84,84,0,0,0,212,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement(
      "path",
      {
        d: "M224,128A96,96,0,0,1,79.93,211.11h0L42.54,223.58a8,8,0,0,1-10.12-10.12l12.47-37.39h0A96,96,0,1,1,224,128Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a12.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-4-1.08,7.85,7.85,0,0,0-2.53.42L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm-44,0a12,12,0,1,1-12-12A12,12,0,0,1,96,128Zm88,0a12,12,0,1,1-12-12A12,12,0,0,1,184,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24ZM84,140a12,12,0,1,1,12-12A12,12,0,0,1,84,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,128,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,172,140Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M138,128a10,10,0,1,1-10-10A10,10,0,0,1,138,128ZM84,118a10,10,0,1,0,10,10A10,10,0,0,0,84,118Zm88,0a10,10,0,1,0,10,10A10,10,0,0,0,172,118Zm58,10A102,102,0,0,1,79.31,217.65L44.44,229.27a14,14,0,0,1-17.71-17.71l11.62-34.87A102,102,0,1,1,230,128Zm-12,0A90,90,0,1,0,50.08,173.06a6,6,0,0,1,.5,4.91L38.12,215.35a2,2,0,0,0,2.53,2.53L78,205.42a6.2,6.2,0,0,1,1.9-.31,6.09,6.09,0,0,1,3,.81A90,90,0,0,0,218,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M136,128a8,8,0,1,1-8-8A8,8,0,0,1,136,128Zm-52-8a8,8,0,1,0,8,8A8,8,0,0,0,84,120Zm88,0a8,8,0,1,0,8,8A8,8,0,0,0,172,120Zm56,8A100,100,0,0,1,79.5,215.47l-35.69,11.9a12,12,0,0,1-15.18-15.18l11.9-35.69A100,100,0,1,1,228,128Zm-8,0A92,92,0,1,0,48.35,174.07a4,4,0,0,1,.33,3.27L36.22,214.72a4,4,0,0,0,5.06,5.06l37.38-12.46a3.93,3.93,0,0,1,1.27-.21,4.05,4.05,0,0,1,2,.54A92,92,0,0,0,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ChatCircleText.es.js
var a13 = __toESM(require("react"), 1);
var e13 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a13.createElement(a13.Fragment, null, /* @__PURE__ */ a13.createElement("path", { d: "M172,108a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,108Zm-12,28H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm76-8A108,108,0,0,1,78.77,224.15L46.34,235A20,20,0,0,1,21,209.66l10.81-32.43A108,108,0,1,1,236,128Zm-24,0A84,84,0,1,0,55.27,170.06a12,12,0,0,1,1,9.81l-9.93,29.79,29.79-9.93a12.1,12.1,0,0,1,3.8-.62,12,12,0,0,1,6,1.62A84,84,0,0,0,212,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a13.createElement(a13.Fragment, null, /* @__PURE__ */ a13.createElement(
      "path",
      {
        d: "M224,128A96,96,0,0,1,79.93,211.11h0L42.54,223.58a8,8,0,0,1-10.12-10.12l12.47-37.39h0A96,96,0,1,1,224,128Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a13.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-4-1.08,7.85,7.85,0,0,0-2.53.42L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Zm40-104a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,112Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,144Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a13.createElement(a13.Fragment, null, /* @__PURE__ */ a13.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm32,128H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a13.createElement(a13.Fragment, null, /* @__PURE__ */ a13.createElement("path", { d: "M166,112a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,112Zm-6,26H96a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm70-10A102,102,0,0,1,79.31,217.65L44.44,229.27a14,14,0,0,1-17.71-17.71l11.62-34.87A102,102,0,1,1,230,128Zm-12,0A90,90,0,1,0,50.08,173.06a6,6,0,0,1,.5,4.91L38.12,215.35a2,2,0,0,0,2.53,2.53L78,205.42a6.2,6.2,0,0,1,1.9-.31,6.09,6.09,0,0,1,3,.81A90,90,0,0,0,218,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a13.createElement(a13.Fragment, null, /* @__PURE__ */ a13.createElement("path", { d: "M168,112a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,112Zm-8,24H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm72-8A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a13.createElement(a13.Fragment, null, /* @__PURE__ */ a13.createElement("path", { d: "M164,112a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,112Zm-4,28H96a4,4,0,0,0,0,8h64a4,4,0,0,0,0-8Zm68-12A100,100,0,0,1,79.5,215.47l-35.69,11.9a12,12,0,0,1-15.18-15.18l11.9-35.69A100,100,0,1,1,228,128Zm-8,0A92,92,0,1,0,48.35,174.07a4,4,0,0,1,.33,3.27L36.22,214.72a4,4,0,0,0,5.06,5.06l37.38-12.46a3.93,3.93,0,0,1,1.27-.21,4.05,4.05,0,0,1,2,.54A92,92,0,0,0,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ChatsCircle.es.js
var a14 = __toESM(require("react"), 1);
var e14 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M236.34,187.09A84,84,0,0,0,172.29,68.9,84,84,0,0,0,19.66,139.09l-6.84,23.26a20,20,0,0,0,24.83,24.83l23.26-6.84a83.94,83.94,0,0,0,22.76,6.74,84.06,84.06,0,0,0,111.42,41.26l23.26,6.84a20,20,0,0,0,24.83-24.83ZM62,155.5a11.88,11.88,0,0,0-3.39.49l-20.72,6.09L44,141.35a12,12,0,0,0-.93-9A60,60,0,1,1,67.7,156.92,12,12,0,0,0,62,155.5Zm150.89,24.8a12,12,0,0,0-.93,9l6.09,20.73L197.36,204a12,12,0,0,0-9.06.93A60,60,0,0,1,111,186.63a83.93,83.93,0,0,0,68.55-91.37,60,60,0,0,1,33.38,85Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement(
      "path",
      {
        d: "M231.66,213.73a8,8,0,0,1-9.93,9.93L194,215.5A72.05,72.05,0,0,1,92.06,175.89h0c1.31.07,2.62.11,3.94.11a72,72,0,0,0,67.93-95.88h0A72,72,0,0,1,223.5,186Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a14.createElement("path", { d: "M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86ZM62,159.5a8.28,8.28,0,0,0-2.26.32L32,168l8.17-27.76a8,8,0,0,0-.63-6,64,64,0,1,1,26.26,26.26A8,8,0,0,0,62,159.5Zm153.79,28.73L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86Zm-16.25,1.47L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M229.93,186.58A78,78,0,0,0,168.16,74.42,78,78,0,1,0,26.07,138.58L18.58,164A14,14,0,0,0,36,181.42l25.46-7.49a78,78,0,0,0,26.39,7.63,78,78,0,0,0,106.77,40.37L220,229.42A14,14,0,0,0,237.42,212ZM62,161.5a6.05,6.05,0,0,0-1.69.24l-27.77,8.17a2,2,0,0,1-2.48-2.48l8.17-27.77a6.05,6.05,0,0,0-.47-4.53,66,66,0,1,1,27.08,27.08A6,6,0,0,0,62,161.5Zm155.71,26.16,8.17,27.77a2,2,0,0,1-2.48,2.48l-27.77-8.17a6.06,6.06,0,0,0-4.53.47,66,66,0,0,1-90-28.4,77.92,77.92,0,0,0,71-94.68,66,66,0,0,1,46.07,96A6.05,6.05,0,0,0,217.74,187.66Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86ZM62,159.5a8.28,8.28,0,0,0-2.26.32L32,168l8.17-27.76a8,8,0,0,0-.63-6,64,64,0,1,1,26.26,26.26A8,8,0,0,0,62,159.5Zm153.79,28.73L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M227.79,186.39a76,76,0,0,0-61-110.07A76,76,0,1,0,28.21,138.39L20.5,164.6a12,12,0,0,0,14.9,14.9l26.21-7.71a75.93,75.93,0,0,0,27.6,7.9,76,76,0,0,0,105.18,40.1l26.21,7.71a12,12,0,0,0,14.9-14.9ZM60.9,163.66l-27.76,8.17a4,4,0,0,1-5-5l8.17-27.76a4.07,4.07,0,0,0-.31-3A68,68,0,1,1,63.92,164,4.06,4.06,0,0,0,60.9,163.66Zm165.92,55.16a4,4,0,0,1-4,1l-27.76-8.17a4.07,4.07,0,0,0-3,.31A68,68,0,0,1,98,180a76,76,0,0,0,71.5-95.28A68,68,0,0,1,220,184.08a4.07,4.07,0,0,0-.31,3l8.17,27.76A4,4,0,0,1,226.82,218.82Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Check.es.js
var e15 = __toESM(require("react"), 1);
var a15 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e15.createElement(e15.Fragment, null, /* @__PURE__ */ e15.createElement("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e15.createElement(e15.Fragment, null, /* @__PURE__ */ e15.createElement(
      "path",
      {
        d: "M232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e15.createElement("path", { d: "M205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e15.createElement(e15.Fragment, null, /* @__PURE__ */ e15.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e15.createElement(e15.Fragment, null, /* @__PURE__ */ e15.createElement("path", { d: "M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e15.createElement(e15.Fragment, null, /* @__PURE__ */ e15.createElement("path", { d: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e15.createElement(e15.Fragment, null, /* @__PURE__ */ e15.createElement("path", { d: "M226.83,74.83l-128,128a4,4,0,0,1-5.66,0l-56-56a4,4,0,0,1,5.66-5.66L96,194.34,221.17,69.17a4,4,0,1,1,5.66,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CheckCircle.es.js
var e16 = __toESM(require("react"), 1);
var a16 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e16.createElement(e16.Fragment, null, /* @__PURE__ */ e16.createElement("path", { d: "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e16.createElement(e16.Fragment, null, /* @__PURE__ */ e16.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ e16.createElement("path", { d: "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e16.createElement(e16.Fragment, null, /* @__PURE__ */ e16.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e16.createElement(e16.Fragment, null, /* @__PURE__ */ e16.createElement("path", { d: "M172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e16.createElement(e16.Fragment, null, /* @__PURE__ */ e16.createElement("path", { d: "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e16.createElement(e16.Fragment, null, /* @__PURE__ */ e16.createElement("path", { d: "M170.83,101.17a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ClipboardText.es.js
var a17 = __toESM(require("react"), 1);
var e17 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M172,164a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,164Zm-12-52H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm60-64V216a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V48A20,20,0,0,1,56,28H90.53a51.88,51.88,0,0,1,74.94,0H200A20,20,0,0,1,220,48ZM100.29,60h55.42a28,28,0,0,0-55.42,0ZM196,52H178.59A52.13,52.13,0,0,1,180,64v8a12,12,0,0,1-12,12H88A12,12,0,0,1,76,72V64a52.13,52.13,0,0,1,1.41-12H60V212H196Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement(
      "path",
      {
        d: "M208,48V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96a39.83,39.83,0,0,0-8,24v8h80V64a39.83,39.83,0,0,0-8-24h40A8,8,0,0,1,208,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a17.createElement("path", { d: "M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm32,128H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M166,152a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,152Zm-6-38H96a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm54-66V216a14,14,0,0,1-14,14H56a14,14,0,0,1-14-14V48A14,14,0,0,1,56,34H93.17a45.91,45.91,0,0,1,69.66,0H200A14,14,0,0,1,214,48ZM94,64v2h68V64a34,34,0,0,0-68,0ZM202,48a2,2,0,0,0-2-2H170.33A45.77,45.77,0,0,1,174,64v8a6,6,0,0,1-6,6H88a6,6,0,0,1-6-6V64a45.77,45.77,0,0,1,3.67-18H56a2,2,0,0,0-2,2V216a2,2,0,0,0,2,2H200a2,2,0,0,0,2-2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M164,152a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,152Zm-4-36H96a4,4,0,0,0,0,8h64a4,4,0,0,0,0-8Zm52-68V216a12,12,0,0,1-12,12H56a12,12,0,0,1-12-12V48A12,12,0,0,1,56,36H94.08a44,44,0,0,1,67.84,0H200A12,12,0,0,1,212,48ZM92,64v4h72V64a36,36,0,0,0-72,0ZM204,48a4,4,0,0,0-4-4H167.17A43.71,43.71,0,0,1,172,64v8a4,4,0,0,1-4,4H88a4,4,0,0,1-4-4V64a43.71,43.71,0,0,1,4.83-20H56a4,4,0,0,0-4,4V216a4,4,0,0,0,4,4H200a4,4,0,0,0,4-4Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ClockCountdown.es.js
var a18 = __toESM(require("react"), 1);
var e18 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a18.createElement(a18.Fragment, null, /* @__PURE__ */ a18.createElement("path", { d: "M236,137A108.13,108.13,0,1,1,119,20,12,12,0,0,1,121,44,84.12,84.12,0,1,0,212,135,12,12,0,1,1,236,137ZM116,76v52a12,12,0,0,0,12,12h52a12,12,0,0,0,0-24H140V76a12,12,0,0,0-24,0Zm92,20a16,16,0,1,0-16-16A16,16,0,0,0,208,96ZM176,64a16,16,0,1,0-16-16A16,16,0,0,0,176,64Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a18.createElement(a18.Fragment, null, /* @__PURE__ */ a18.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ a18.createElement("path", { d: "M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a18.createElement(a18.Fragment, null, /* @__PURE__ */ a18.createElement("path", { d: "M208,96a12,12,0,1,1,12,12A12,12,0,0,1,208,96ZM196,72a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm28.66,56a8,8,0,0,0-8.63,7.31A88.12,88.12,0,1,1,120.66,40,8,8,0,0,0,119.34,24,104.12,104.12,0,1,0,232,136.66,8,8,0,0,0,224.66,128ZM128,56a72,72,0,1,1-72,72A72.08,72.08,0,0,1,128,56Zm-8,72a8,8,0,0,0,8,8h48a8,8,0,0,0,0-16H136V80a8,8,0,0,0-16,0Zm40-80a12,12,0,1,0-12-12A12,12,0,0,0,160,48Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a18.createElement(a18.Fragment, null, /* @__PURE__ */ a18.createElement("path", { d: "M230,136.49A102.12,102.12,0,1,1,119.51,26a6,6,0,0,1,1,12A90.13,90.13,0,1,0,218,135.51a6,6,0,1,1,12,1ZM122,72v56a6,6,0,0,0,6,6h56a6,6,0,0,0,0-12H134V72a6,6,0,0,0-12,0Zm38-26a10,10,0,1,0-10-10A10,10,0,0,0,160,46Zm36,24a10,10,0,1,0-10-10A10,10,0,0,0,196,70Zm24,36a10,10,0,1,0-10-10A10,10,0,0,0,220,106Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a18.createElement(a18.Fragment, null, /* @__PURE__ */ a18.createElement("path", { d: "M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a18.createElement(a18.Fragment, null, /* @__PURE__ */ a18.createElement("path", { d: "M228,136.33A100.13,100.13,0,1,1,119.67,28a4,4,0,1,1,.66,8A92.13,92.13,0,1,0,220,135.67a4,4,0,1,1,8,.66ZM128,132h56a4,4,0,0,0,0-8H132V72a4,4,0,0,0-8,0v56A4,4,0,0,0,128,132Zm32-88a8,8,0,1,0-8-8A8,8,0,0,0,160,44Zm36,24a8,8,0,1,0-8-8A8,8,0,0,0,196,68Zm24,36a8,8,0,1,0-8-8A8,8,0,0,0,220,104Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Copy.es.js
var a19 = __toESM(require("react"), 1);
var e19 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216,40V168H168V88H88V40Z", opacity: "0.2" }), /* @__PURE__ */ a19.createElement("path", { d: "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216,34H88a6,6,0,0,0-6,6V82H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H168a6,6,0,0,0,6-6V174h42a6,6,0,0,0,6-6V40A6,6,0,0,0,216,34ZM162,210H46V94H162Zm48-48H174V88a6,6,0,0,0-6-6H94V46H210Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216,36H88a4,4,0,0,0-4,4V84H40a4,4,0,0,0-4,4V216a4,4,0,0,0,4,4H168a4,4,0,0,0,4-4V172h44a4,4,0,0,0,4-4V40A4,4,0,0,0,216,36ZM164,212H44V92H164Zm48-48H172V88a4,4,0,0,0-4-4H92V44H212Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Database.es.js
var e20 = __toESM(require("react"), 1);
var t2 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e20.createElement(e20.Fragment, null, /* @__PURE__ */ e20.createElement("path", { d: "M196,35.52C177.62,25.51,153.48,20,128,20S78.38,25.51,60,35.52C39.37,46.79,28,62.58,28,80v96c0,17.42,11.37,33.21,32,44.48,18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52c20.66-11.27,32-27.06,32-44.48V80C228,62.58,216.63,46.79,196,35.52ZM204,128c0,17-31.21,36-76,36s-76-19-76-36v-8.46a88.9,88.9,0,0,0,8,4.94c18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52a88.9,88.9,0,0,0,8-4.94ZM128,44c44.79,0,76,19,76,36s-31.21,36-76,36S52,97,52,80,83.21,44,128,44Zm0,168c-44.79,0-76-19-76-36v-8.46a88.9,88.9,0,0,0,8,4.94c18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52a88.9,88.9,0,0,0,8-4.94V176C204,193,172.79,212,128,212Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e20.createElement(e20.Fragment, null, /* @__PURE__ */ e20.createElement(
      "path",
      {
        d: "M216,80c0,26.51-39.4,48-88,48S40,106.51,40,80s39.4-48,88-48S216,53.49,216,80Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e20.createElement("path", { d: "M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e20.createElement(e20.Fragment, null, /* @__PURE__ */ e20.createElement("path", { d: "M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64Zm-21.61,74.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e20.createElement(e20.Fragment, null, /* @__PURE__ */ e20.createElement("path", { d: "M128,26C75.29,26,34,49.72,34,80v96c0,30.28,41.29,54,94,54s94-23.72,94-54V80C222,49.72,180.71,26,128,26Zm0,12c44.45,0,82,19.23,82,42s-37.55,42-82,42S46,102.77,46,80,83.55,38,128,38Zm82,138c0,22.77-37.55,42-82,42s-82-19.23-82-42V154.79C62,171.16,92.37,182,128,182s66-10.84,82-27.21Zm0-48c0,22.77-37.55,42-82,42s-82-19.23-82-42V106.79C62,123.16,92.37,134,128,134s66-10.84,82-27.21Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e20.createElement(e20.Fragment, null, /* @__PURE__ */ e20.createElement("path", { d: "M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e20.createElement(e20.Fragment, null, /* @__PURE__ */ e20.createElement("path", { d: "M192.14,42.55C174.94,33.17,152.16,28,128,28S81.06,33.17,63.86,42.55C45.89,52.35,36,65.65,36,80v96c0,14.35,9.89,27.65,27.86,37.45,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c18-9.8,27.86-23.1,27.86-37.45V80C220,65.65,210.11,52.35,192.14,42.55ZM212,176c0,11.29-8.41,22.1-23.69,30.43C172.27,215.18,150.85,220,128,220s-44.27-4.82-60.31-13.57C52.41,198.1,44,187.29,44,176V149.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm0-48c0,11.29-8.41,22.1-23.69,30.43C172.27,167.18,150.85,172,128,172s-44.27-4.82-60.31-13.57C52.41,150.1,44,139.29,44,128V101.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm-23.69-17.57C172.27,119.18,150.85,124,128,124s-44.27-4.82-60.31-13.57C52.41,102.1,44,91.29,44,80s8.41-22.1,23.69-30.43C83.73,40.82,105.15,36,128,36s44.27,4.82,60.31,13.57C203.59,57.9,212,68.71,212,80S203.59,102.1,188.31,110.43Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/DownloadSimple.es.js
var a20 = __toESM(require("react"), 1);
var e21 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement(
      "path",
      {
        d: "M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a20.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,168,96H136V32a8,8,0,0,0-16,0V96H88a8,8,0,0,0-5.66,13.66Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,129.51V32a6,6,0,0,0-12,0v97.51L92.24,99.76a6,6,0,0,0-8.48,8.48Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M220,144v64a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V144a4,4,0,0,1,8,0v60H212V144a4,4,0,0,1,8,0Zm-94.83,2.83a4,4,0,0,0,5.66,0l40-40a4,4,0,1,0-5.66-5.66L132,134.34V32a4,4,0,0,0-8,0V134.34L90.83,101.17a4,4,0,0,0-5.66,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Eye.es.js
var e22 = __toESM(require("react"), 1);
var a21 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M251,123.13c-.37-.81-9.13-20.26-28.48-39.61C196.63,57.67,164,44,128,44S59.37,57.67,33.51,83.52C14.16,102.87,5.4,122.32,5,123.13a12.08,12.08,0,0,0,0,9.75c.37.82,9.13,20.26,28.49,39.61C59.37,198.34,92,212,128,212s68.63-13.66,94.48-39.51c19.36-19.35,28.12-38.79,28.49-39.61A12.08,12.08,0,0,0,251,123.13Zm-46.06,33C183.47,177.27,157.59,188,128,188s-55.47-10.73-76.91-31.88A130.36,130.36,0,0,1,29.52,128,130.45,130.45,0,0,1,51.09,99.89C72.54,78.73,98.41,68,128,68s55.46,10.73,76.91,31.89A130.36,130.36,0,0,1,226.48,128,130.45,130.45,0,0,1,204.91,156.12ZM128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,148Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement(
      "path",
      {
        d: "M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Zm0,112a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e22.createElement("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M245.48,125.57c-.34-.78-8.66-19.23-27.24-37.81C201,70.54,171.38,50,128,50S55,70.54,37.76,87.76c-18.58,18.58-26.9,37-27.24,37.81a6,6,0,0,0,0,4.88c.34.77,8.66,19.22,27.24,37.8C55,185.47,84.62,206,128,206s73-20.53,90.24-37.75c18.58-18.58,26.9-37,27.24-37.8A6,6,0,0,0,245.48,125.57ZM128,194c-31.38,0-58.78-11.42-81.45-33.93A134.77,134.77,0,0,1,22.69,128,134.56,134.56,0,0,1,46.55,95.94C69.22,73.42,96.62,62,128,62s58.78,11.42,81.45,33.94A134.56,134.56,0,0,1,233.31,128C226.94,140.21,195,194,128,194Zm0-112a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M243.66,126.38c-.34-.76-8.52-18.89-26.83-37.2C199.87,72.22,170.7,52,128,52S56.13,72.22,39.17,89.18c-18.31,18.31-26.49,36.44-26.83,37.2a4.08,4.08,0,0,0,0,3.25c.34.77,8.52,18.89,26.83,37.2,17,17,46.14,37.17,88.83,37.17s71.87-20.21,88.83-37.17c18.31-18.31,26.49-36.43,26.83-37.2A4.08,4.08,0,0,0,243.66,126.38Zm-32.7,35c-23.07,23-51,34.62-83,34.62s-59.89-11.65-83-34.62A135.71,135.71,0,0,1,20.44,128,135.69,135.69,0,0,1,45,94.62C68.11,71.65,96,60,128,60s59.89,11.65,83,34.62A135.79,135.79,0,0,1,235.56,128,135.71,135.71,0,0,1,211,161.38ZM128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36,36,0,0,1,128,164Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/File.es.js
var e23 = __toESM(require("react"), 1);
var a22 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e23.createElement(e23.Fragment, null, /* @__PURE__ */ e23.createElement("path", { d: "M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e23.createElement(e23.Fragment, null, /* @__PURE__ */ e23.createElement("path", { d: "M208,88H152V32Z", opacity: "0.2" }), /* @__PURE__ */ e23.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e23.createElement(e23.Fragment, null, /* @__PURE__ */ e23.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e23.createElement(e23.Fragment, null, /* @__PURE__ */ e23.createElement("path", { d: "M212.24,83.76l-56-56A6,6,0,0,0,152,26H56A14,14,0,0,0,42,40V216a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V88A6,6,0,0,0,212.24,83.76ZM158,46.48,193.52,82H158ZM200,218H56a2,2,0,0,1-2-2V40a2,2,0,0,1,2-2h90V88a6,6,0,0,0,6,6h50V216A2,2,0,0,1,200,218Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e23.createElement(e23.Fragment, null, /* @__PURE__ */ e23.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e23.createElement(e23.Fragment, null, /* @__PURE__ */ e23.createElement("path", { d: "M210.83,85.17l-56-56A4,4,0,0,0,152,28H56A12,12,0,0,0,44,40V216a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V88A4,4,0,0,0,210.83,85.17ZM156,41.65,198.34,84H156ZM200,220H56a4,4,0,0,1-4-4V40a4,4,0,0,1,4-4h92V88a4,4,0,0,0,4,4h52V216A4,4,0,0,1,200,220Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/FileText.es.js
var a23 = __toESM(require("react"), 1);
var e24 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M208,88H152V32Z", opacity: "0.2" }), /* @__PURE__ */ a23.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,176H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm-8-56V44l44,44Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M212.24,83.76l-56-56A6,6,0,0,0,152,26H56A14,14,0,0,0,42,40V216a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V88A6,6,0,0,0,212.24,83.76ZM158,46.48,193.52,82H158ZM200,218H56a2,2,0,0,1-2-2V40a2,2,0,0,1,2-2h90V88a6,6,0,0,0,6,6h50V216A2,2,0,0,1,200,218Zm-34-82a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,136Zm0,32a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,168Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M210.83,85.17l-56-56A4,4,0,0,0,152,28H56A12,12,0,0,0,44,40V216a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V88A4,4,0,0,0,210.83,85.17ZM156,41.65,198.34,84H156ZM200,220H56a4,4,0,0,1-4-4V40a4,4,0,0,1,4-4h92V88a4,4,0,0,0,4,4h52V216A4,4,0,0,1,200,220Zm-36-84a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,136Zm0,32a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,168Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/FolderOpen.es.js
var a24 = __toESM(require("react"), 1);
var e25 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M248.23,112.31A20,20,0,0,0,232,104H220V88a20,20,0,0,0-20-20H132L105.34,48a20.12,20.12,0,0,0-12-4H40A20,20,0,0,0,20,64V208a12,12,0,0,0,12,12H211.1a12,12,0,0,0,11.33-8l28.49-81.47.06-.17A20,20,0,0,0,248.23,112.31ZM92,68l28.8,21.6A12,12,0,0,0,128,92h68v12H69.77a20,20,0,0,0-18.94,13.58L44,137.15V68ZM202.59,196H48.89l23.72-68H226.37Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement(
      "path",
      {
        d: "M208,88v24H69.77a8,8,0,0,0-7.59,5.47L32,208V64a8,8,0,0,1,8-8H93.33a8,8,0,0,1,4.8,1.6L128,80h72A8,8,0,0,1,208,88Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a24.createElement("path", { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M243.36,111.81A14,14,0,0,0,232,106H214V88a14,14,0,0,0-14-14H130L101.74,52.8a14.06,14.06,0,0,0-8.4-2.8H40A14,14,0,0,0,26,64V208a6,6,0,0,0,6,6H211.1a6,6,0,0,0,5.69-4.1l28.49-85.47A14,14,0,0,0,243.36,111.81ZM40,62H93.34a2,2,0,0,1,1.2.4L124.4,84.8A6,6,0,0,0,128,86h72a2,2,0,0,1,2,2v18H69.77a14,14,0,0,0-13.28,9.57L38,171V64A2,2,0,0,1,40,62Zm193.9,58.63L206.78,202H40.33l27.54-82.63a2,2,0,0,1,1.9-1.37H232a2,2,0,0,1,1.9,2.63Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M241.72,113a11.88,11.88,0,0,0-9.73-5H212V88a12,12,0,0,0-12-12H129.33l-28.8-21.6a12.05,12.05,0,0,0-7.2-2.4H40A12,12,0,0,0,28,64V208a4,4,0,0,0,4,4H211.09a4,4,0,0,0,3.79-2.74l28.49-85.47A11.86,11.86,0,0,0,241.72,113ZM40,60H93.33a4,4,0,0,1,2.4.8L125.6,83.2a4,4,0,0,0,2.4.8h72a4,4,0,0,1,4,4v20H69.76a12,12,0,0,0-11.38,8.21L36,183.35V64A4,4,0,0,1,40,60Zm195.78,61.26L208.2,204H37.55L66,118.74A4,4,0,0,1,69.76,116H232a4,4,0,0,1,3.79,5.26Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/GearSix.es.js
var a25 = __toESM(require("react"), 1);
var l = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm113.86-49.57A12,12,0,0,0,236,98.34L208.21,82.49l-.11-31.31a12,12,0,0,0-4.25-9.12,116,116,0,0,0-38-21.41,12,12,0,0,0-9.68.89L128,37.27,99.83,21.53a12,12,0,0,0-9.7-.9,116.06,116.06,0,0,0-38,21.47,12,12,0,0,0-4.24,9.1l-.14,31.34L20,98.35a12,12,0,0,0-5.85,8.11,110.7,110.7,0,0,0,0,43.11A12,12,0,0,0,20,157.66l27.82,15.85.11,31.31a12,12,0,0,0,4.25,9.12,116,116,0,0,0,38,21.41,12,12,0,0,0,9.68-.89L128,218.73l28.14,15.74a12,12,0,0,0,9.7.9,116.06,116.06,0,0,0,38-21.47,12,12,0,0,0,4.24-9.1l.14-31.34,27.81-15.81a12,12,0,0,0,5.85-8.11A110.7,110.7,0,0,0,241.86,106.43Zm-22.63,33.18-26.88,15.28a11.94,11.94,0,0,0-4.55,4.59c-.54,1-1.11,1.93-1.7,2.88a12,12,0,0,0-1.83,6.31L184.13,199a91.83,91.83,0,0,1-21.07,11.87l-27.15-15.19a12,12,0,0,0-5.86-1.53h-.29c-1.14,0-2.3,0-3.44,0a12.08,12.08,0,0,0-6.14,1.51L93,210.82A92.27,92.27,0,0,1,71.88,199l-.11-30.24a12,12,0,0,0-1.83-6.32c-.58-.94-1.16-1.91-1.7-2.88A11.92,11.92,0,0,0,63.7,155L36.8,139.63a86.53,86.53,0,0,1,0-23.24l26.88-15.28a12,12,0,0,0,4.55-4.58c.54-1,1.11-1.94,1.7-2.89a12,12,0,0,0,1.83-6.31L71.87,57A91.83,91.83,0,0,1,92.94,45.17l27.15,15.19a11.92,11.92,0,0,0,6.15,1.52c1.14,0,2.3,0,3.44,0a12.08,12.08,0,0,0,6.14-1.51L163,45.18A92.27,92.27,0,0,1,184.12,57l.11,30.24a12,12,0,0,0,1.83,6.32c.58.94,1.16,1.91,1.7,2.88A11.92,11.92,0,0,0,192.3,101l26.9,15.33A86.53,86.53,0,0,1,219.23,139.61Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement(
      "path",
      {
        d: "M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a25.createElement("path", { d: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.1,8.1,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8,8,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M128,82a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Zm108-54.4a6,6,0,0,0-2.92-4L202.64,86.22l-.42-.71L202.1,51.2A6,6,0,0,0,200,46.64a110.12,110.12,0,0,0-36.07-20.31,6,6,0,0,0-4.84.45L128.46,43.86h-1L96.91,26.76a6,6,0,0,0-4.86-.44A109.92,109.92,0,0,0,56,46.68a6,6,0,0,0-2.12,4.55l-.16,34.34c-.14.23-.28.47-.41.71L22.91,103.57A6,6,0,0,0,20,107.62a104.81,104.81,0,0,0,0,40.78,6,6,0,0,0,2.92,4l30.42,17.33.42.71.12,34.31A6,6,0,0,0,56,209.36a110.12,110.12,0,0,0,36.07,20.31,6,6,0,0,0,4.84-.45l30.61-17.08h1l30.56,17.1A6.09,6.09,0,0,0,162,230a5.83,5.83,0,0,0,1.93-.32,109.92,109.92,0,0,0,36-20.36,6,6,0,0,0,2.12-4.55l.16-34.34c.14-.23.28-.47.41-.71l30.42-17.29a6,6,0,0,0,2.92-4.05A104.81,104.81,0,0,0,236,107.6Zm-11.25,35.79L195.32,160.1a6.07,6.07,0,0,0-2.28,2.3c-.59,1-1.21,2.11-1.86,3.14a6,6,0,0,0-.91,3.16l-.16,33.21a98.15,98.15,0,0,1-27.52,15.53L133,200.88a6,6,0,0,0-2.93-.77h-.14c-1.24,0-2.5,0-3.74,0a6,6,0,0,0-3.07.76L93.45,217.43a98,98,0,0,1-27.56-15.49l-.12-33.17a6,6,0,0,0-.91-3.16c-.64-1-1.27-2.08-1.86-3.14a6,6,0,0,0-2.27-2.3L31.3,143.4a93,93,0,0,1,0-30.79L60.68,95.9A6.07,6.07,0,0,0,63,93.6c.59-1,1.21-2.11,1.86-3.14a6,6,0,0,0,.91-3.16l.16-33.21A98.15,98.15,0,0,1,93.41,38.56L123,55.12a5.81,5.81,0,0,0,3.07.76c1.24,0,2.5,0,3.74,0a6,6,0,0,0,3.07-.76l29.65-16.56a98,98,0,0,1,27.56,15.49l.12,33.17a6,6,0,0,0,.91,3.16c.64,1,1.27,2.08,1.86,3.14a6,6,0,0,0,2.27,2.3L224.7,112.6A93,93,0,0,1,224.73,143.39Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36,36,0,0,1,128,164Zm106-56a4,4,0,0,0-2-2.7l-30.89-17.6q-.47-.82-1-1.62L200.1,51.2a3.94,3.94,0,0,0-1.42-3,107.8,107.8,0,0,0-35.41-19.94,4,4,0,0,0-3.23.29L129,45.87h-2l-31-17.36a4,4,0,0,0-3.23-.3,108.05,108.05,0,0,0-35.39,20,4,4,0,0,0-1.41,3l-.16,34.9-1,1.62L23.9,105.3A4,4,0,0,0,22,108a102.76,102.76,0,0,0,0,40,4,4,0,0,0,1.95,2.7l30.89,17.6q.47.83,1,1.62l.12,34.87a3.94,3.94,0,0,0,1.42,3,107.8,107.8,0,0,0,35.41,19.94,4,4,0,0,0,3.23-.29L127,210.13h2l31,17.36a4,4,0,0,0,3.23.3,108.05,108.05,0,0,0,35.39-20,4,4,0,0,0,1.41-3l.16-34.9,1-1.62L232.1,150.7a4,4,0,0,0,2-2.71A102.76,102.76,0,0,0,234,108Zm-7.48,36.67L196.3,161.84a4,4,0,0,0-1.51,1.53c-.61,1.09-1.25,2.17-1.91,3.24a3.92,3.92,0,0,0-.61,2.1l-.16,34.15a99.8,99.8,0,0,1-29.7,16.77l-30.4-17a4.06,4.06,0,0,0-2-.51H130c-1.28,0-2.57,0-3.84,0a4.1,4.1,0,0,0-2.05.51l-30.45,17A100.23,100.23,0,0,1,63.89,202.9l-.12-34.12a3.93,3.93,0,0,0-.61-2.11c-.66-1-1.3-2.14-1.91-3.23a4,4,0,0,0-1.51-1.53L29.49,144.68a94.78,94.78,0,0,1,0-33.34L59.7,94.16a4,4,0,0,0,1.51-1.53c.61-1.09,1.25-2.17,1.91-3.23a4,4,0,0,0,.61-2.11l.16-34.15a99.8,99.8,0,0,1,29.7-16.77l30.4,17a4.1,4.1,0,0,0,2.05.51c1.28,0,2.57,0,3.84,0a4,4,0,0,0,2.05-.51l30.45-17A100.23,100.23,0,0,1,192.11,53.1l.12,34.12a3.93,3.93,0,0,0,.61,2.11c.66,1,1.3,2.14,1.91,3.23a4,4,0,0,0,1.51,1.53l30.25,17.23A94.78,94.78,0,0,1,226.54,144.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/House.es.js
var a26 = __toESM(require("react"), 1);
var e26 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement(
      "path",
      {
        d: "M216,120v96H152V152H104v64H40V120a8,8,0,0,1,2.34-5.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,216,120Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a26.createElement("path", { d: "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M224,120v96a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V164a4,4,0,0,0-4-4H108a4,4,0,0,0-4,4v52a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M217.9,110.1l-80-80a14,14,0,0,0-19.8,0l-80,80A13.92,13.92,0,0,0,34,120v96a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V158h36v58a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V120A13.92,13.92,0,0,0,217.9,110.1ZM210,210H158V152a6,6,0,0,0-6-6H104a6,6,0,0,0-6,6v58H46V120a2,2,0,0,1,.58-1.42l80-80a2,2,0,0,1,2.84,0l80,80A2,2,0,0,1,210,120Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M216.49,111.51l-80-80a12,12,0,0,0-17,0l-80,80A12,12,0,0,0,36,120v96a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V156h40v60a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V120A12,12,0,0,0,216.49,111.51ZM212,212H156V152a4,4,0,0,0-4-4H104a4,4,0,0,0-4,4v60H44V120a4,4,0,0,1,1.17-2.83l80-80a4,4,0,0,1,5.66,0l80,80A4,4,0,0,1,212,120Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Image.es.js
var a27 = __toESM(require("react"), 1);
var e27 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a27.createElement(a27.Fragment, null, /* @__PURE__ */ a27.createElement("path", { d: "M144,96a16,16,0,1,1,16,16A16,16,0,0,1,144,96Zm92-40V200a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V56A20,20,0,0,1,40,36H216A20,20,0,0,1,236,56ZM44,60v79.72l33.86-33.86a20,20,0,0,1,28.28,0L147.31,147l17.18-17.17a20,20,0,0,1,28.28,0L212,149.09V60Zm0,136H162.34L92,125.66l-48,48Zm168,0V183l-33.37-33.37L164.28,164l32,32Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a27.createElement(a27.Fragment, null, /* @__PURE__ */ a27.createElement(
      "path",
      {
        d: "M224,56V178.06l-39.72-39.72a8,8,0,0,0-11.31,0L147.31,164,97.66,114.34a8,8,0,0,0-11.32,0L32,168.69V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a27.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a27.createElement(a27.Fragment, null, /* @__PURE__ */ a27.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM156,88a12,12,0,1,1-12,12A12,12,0,0,1,156,88Zm60,112H40V160.69l46.34-46.35a8,8,0,0,1,11.32,0h0L165,181.66a8,8,0,0,0,11.32-11.32l-17.66-17.65L173,138.34a8,8,0,0,1,11.31,0L216,170.07V200Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a27.createElement(a27.Fragment, null, /* @__PURE__ */ a27.createElement("path", { d: "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM40,54H216a2,2,0,0,1,2,2V163.57L188.53,134.1a14,14,0,0,0-19.8,0l-21.42,21.42L101.9,110.1a14,14,0,0,0-19.8,0L38,154.2V56A2,2,0,0,1,40,54ZM38,200V171.17l52.58-52.58a2,2,0,0,1,2.84,0L176.83,202H40A2,2,0,0,1,38,200Zm178,2H193.8l-38-38,21.41-21.42a2,2,0,0,1,2.83,0l38,38V200A2,2,0,0,1,216,202ZM146,100a10,10,0,1,1,10,10A10,10,0,0,1,146,100Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a27.createElement(a27.Fragment, null, /* @__PURE__ */ a27.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a27.createElement(a27.Fragment, null, /* @__PURE__ */ a27.createElement("path", { d: "M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44ZM40,52H216a4,4,0,0,1,4,4V168.4l-32.89-32.89a12,12,0,0,0-17,0l-22.83,22.83-46.82-46.83a12,12,0,0,0-17,0L36,159V56A4,4,0,0,1,40,52ZM36,200V170.34l53.17-53.17a4,4,0,0,1,5.66,0L181.66,204H40A4,4,0,0,1,36,200Zm180,4H193l-40-40,22.83-22.83a4,4,0,0,1,5.66,0L220,179.71V200A4,4,0,0,1,216,204ZM148,100a8,8,0,1,1,8,8A8,8,0,0,1,148,100Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ImageSquare.es.js
var a28 = __toESM(require("react"), 1);
var e28 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M208,28H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28Zm-4,24v63.72L186.14,97.86a20,20,0,0,0-28.28,0L52,203.72V52ZM85.66,204,172,117.66l32,32V204ZM76,96a20,20,0,1,1,20,20A20,20,0,0,1,76,96Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement(
      "path",
      {
        d: "M208,40H48a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8h8.69L166.34,106.34a8,8,0,0,1,11.32,0L216,144.69V48A8,8,0,0,0,208,40ZM96,112a16,16,0,1,1,16-16A16,16,0,0,1,96,112Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a28.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L53.37,208H48ZM208,208H76l96-96,36,36v60ZM96,120A24,24,0,1,0,72,96,24,24,0,0,0,96,120Zm0-32a8,8,0,1,1-8,8A8,8,0,0,1,96,88Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L53.37,208H48ZM80,96a16,16,0,1,1,16,16A16,16,0,0,1,80,96Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM46,208V48a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2v82.2l-28.1-28.1a14,14,0,0,0-19.8,0L54.2,210H48A2,2,0,0,1,46,208Zm162,2H71.17l99.41-99.41a2,2,0,0,1,2.83,0L210,147.17V208A2,2,0,0,1,208,210ZM96,118A22,22,0,1,0,74,96,22,22,0,0,0,96,118Zm0-32A10,10,0,1,1,86,96,10,10,0,0,1,96,86Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L53.37,208H48ZM208,208H76l96-96,36,36v60ZM96,120A24,24,0,1,0,72,96,24,24,0,0,0,96,120Zm0-32a8,8,0,1,1-8,8A8,8,0,0,1,96,88Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M208,36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM44,208V48a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4v87l-31.51-31.52a12,12,0,0,0-17,0L55,212H48A4,4,0,0,1,44,208Zm164,4H66.34L169.17,109.17a4,4,0,0,1,5.66,0L212,146.34V208A4,4,0,0,1,208,212ZM96,116A20,20,0,1,0,76,96,20,20,0,0,0,96,116Zm0-32A12,12,0,1,1,84,96,12,12,0,0,1,96,84Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Info.es.js
var e29 = __toESM(require("react"), 1);
var a29 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e29.createElement(e29.Fragment, null, /* @__PURE__ */ e29.createElement("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e29.createElement(e29.Fragment, null, /* @__PURE__ */ e29.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ e29.createElement("path", { d: "M144,176a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176Zm88-48A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128ZM124,96a12,12,0,1,0-12-12A12,12,0,0,0,124,96Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e29.createElement(e29.Fragment, null, /* @__PURE__ */ e29.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e29.createElement(e29.Fragment, null, /* @__PURE__ */ e29.createElement("path", { d: "M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e29.createElement(e29.Fragment, null, /* @__PURE__ */ e29.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e29.createElement(e29.Fragment, null, /* @__PURE__ */ e29.createElement("path", { d: "M140,176a4,4,0,0,1-4,4,12,12,0,0,1-12-12V128a4,4,0,0,0-4-4,4,4,0,0,1,0-8,12,12,0,0,1,12,12v40a4,4,0,0,0,4,4A4,4,0,0,1,140,176ZM124,92a8,8,0,1,0-8-8A8,8,0,0,0,124,92Zm104,36A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Key.es.js
var a30 = __toESM(require("react"), 1);
var e30 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Zm48,22.74A84.3,84.3,0,0,1,160.11,180H160a83.52,83.52,0,0,1-23.65-3.38l-7.86,7.87A12,12,0,0,1,120,188H108v12a12,12,0,0,1-12,12H84v12a12,12,0,0,1-12,12H40a20,20,0,0,1-20-20V187.31a19.86,19.86,0,0,1,5.86-14.14l53.52-53.52A84,84,0,1,1,244,98.74ZM202.43,53.57A59.48,59.48,0,0,0,158,36c-32,1-58,27.89-58,59.89a59.69,59.69,0,0,0,4.2,22.19,12,12,0,0,1-2.55,13.21L44,189v23H60V200a12,12,0,0,1,12-12H84V176a12,12,0,0,1,12-12h19l9.65-9.65a12,12,0,0,1,13.22-2.55A59.58,59.58,0,0,0,160,156h.08c32,0,58.87-26.07,59.89-58A59.55,59.55,0,0,0,202.43,53.57Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement(
      "path",
      {
        d: "M232,98.36C230.73,136.92,198.67,168,160.09,168a71.68,71.68,0,0,1-26.92-5.17h0L120,176H96v24H72v24H40a8,8,0,0,1-8-8V187.31a8,8,0,0,1,2.34-5.65l58.83-58.83h0A71.68,71.68,0,0,1,88,95.91c0-38.58,31.08-70.64,69.64-71.87A72,72,0,0,1,232,98.36Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a30.createElement("path", { d: "M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM180,92a16,16,0,1,1,16-16A16,16,0,0,1,180,92Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M215.15,40.85A78,78,0,0,0,86.2,121.31l-56.1,56.1a13.94,13.94,0,0,0-4.1,9.9V216a14,14,0,0,0,14,14H72a6,6,0,0,0,6-6V206H96a6,6,0,0,0,6-6V182h18a6,6,0,0,0,4.24-1.76l10.45-10.44A77.59,77.59,0,0,0,160,174h.1A78,78,0,0,0,215.15,40.85ZM226,98.16c-1.12,35.16-30.67,63.8-65.88,63.84a65.93,65.93,0,0,1-24.51-4.67,6,6,0,0,0-6.64,1.26L117.51,170H96a6,6,0,0,0-6,6v18H72a6,6,0,0,0-6,6v18H40a2,2,0,0,1-2-2V187.31a2,2,0,0,1,.58-1.41l58.83-58.83a6,6,0,0,0,1.26-6.64A65.61,65.61,0,0,1,94,95.92C94,60.71,122.68,31.16,157.83,30A66,66,0,0,1,226,98.16ZM190,76a10,10,0,1,1-10-10A10,10,0,0,1,190,76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M213.74,42.26A76,76,0,0,0,88.51,121.84l-57,57A11.93,11.93,0,0,0,28,187.31V216a12,12,0,0,0,12,12H72a4,4,0,0,0,4-4V204H96a4,4,0,0,0,4-4V180h20a4,4,0,0,0,2.83-1.17l11.33-11.34A75.72,75.72,0,0,0,160,172h.1A76,76,0,0,0,213.74,42.26Zm14.22,56c-1.15,36.22-31.6,65.72-67.87,65.77H160a67.52,67.52,0,0,1-25.21-4.83,4,4,0,0,0-4.45.83l-12,12H96a4,4,0,0,0-4,4v20H72a4,4,0,0,0-4,4v20H40a4,4,0,0,1-4-4V187.31a4.06,4.06,0,0,1,1.17-2.83L96,125.66a4,4,0,0,0,.83-4.45A67.51,67.51,0,0,1,92,95.91C92,59.64,121.55,29.19,157.77,28A68,68,0,0,1,228,98.23ZM188,76a8,8,0,1,1-8-8A8,8,0,0,1,188,76Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/LinkSimple.es.js
var a31 = __toESM(require("react"), 1);
var l2 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M87.5,151.52l64-64a12,12,0,0,1,17,17l-64,64a12,12,0,0,1-17-17Zm131-114a60.08,60.08,0,0,0-84.87,0L103.51,67.61a12,12,0,0,0,17,17l30.07-30.06a36,36,0,0,1,50.93,50.92L171.4,135.52a12,12,0,1,0,17,17l30.08-30.06A60.09,60.09,0,0,0,218.45,37.55ZM135.52,171.4l-30.07,30.08a36,36,0,0,1-50.92-50.93l30.06-30.07a12,12,0,0,0-17-17L37.55,133.58a60,60,0,0,0,84.88,84.87l30.06-30.07a12,12,0,0,0-17-17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement(
      "path",
      {
        d: "M209.94,113.94l-96,96a48,48,0,0,1-67.88-67.88l96-96a48,48,0,0,1,67.88,67.88Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a31.createElement("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM144.56,173.66l-21.45,21.45a44,44,0,0,1-62.22-62.22l21.45-21.46a8,8,0,0,1,11.32,11.31L72.2,144.2a28,28,0,0,0,39.6,39.6l21.45-21.46a8,8,0,0,1,11.31,11.32Zm-34.9-16a8,8,0,0,1-11.32-11.32l48-48a8,8,0,0,1,11.32,11.32Zm85.45-34.55-21.45,21.45a8,8,0,0,1-11.32-11.31L183.8,111.8a28,28,0,0,0-39.6-39.6L122.74,93.66a8,8,0,0,1-11.31-11.32l21.46-21.45a44,44,0,0,1,62.22,62.22Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M164.25,91.75a6,6,0,0,1,0,8.49l-64,64a6,6,0,0,1-8.49-8.48l64-64A6,6,0,0,1,164.25,91.75ZM214.2,41.8a54.07,54.07,0,0,0-76.38,0L107.75,71.85a6,6,0,0,0,8.49,8.49l30.07-30.06a42,42,0,0,1,59.41,59.41l-30.08,30.07a6,6,0,1,0,8.49,8.49l30.07-30.07A54,54,0,0,0,214.2,41.8ZM139.76,175.64l-30.07,30.08a42,42,0,0,1-59.41-59.41l30.06-30.07a6,6,0,0,0-8.49-8.49l-30,30.07a54,54,0,0,0,76.38,76.39l30.07-30.08a6,6,0,0,0-8.49-8.49Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M162.84,93.16a4,4,0,0,1,0,5.66l-64,64a4,4,0,0,1-5.66-5.66l64-64A4,4,0,0,1,162.84,93.16Zm49.95-49.95a52.07,52.07,0,0,0-73.56,0L109.17,73.27a4,4,0,0,0,5.65,5.66l30.07-30.06a44,44,0,0,1,62.24,62.24l-30.07,30.06a4,4,0,0,0,5.66,5.66l30.07-30.06A52.07,52.07,0,0,0,212.79,43.21ZM141.17,177.06l-30.06,30.07a44,44,0,0,1-62.24-62.24l30.06-30.06a4,4,0,0,0-5.66-5.66L43.21,139.23a52,52,0,0,0,73.56,73.56l30.06-30.07a4,4,0,1,0-5.66-5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/List.es.js
var a32 = __toESM(require("react"), 1);
var e31 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M216,64V192H40V64Z", opacity: "0.2" }), /* @__PURE__ */ a32.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM192,184H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M220,128a4,4,0,0,1-4,4H40a4,4,0,0,1,0-8H216A4,4,0,0,1,220,128ZM40,68H216a4,4,0,0,0,0-8H40a4,4,0,0,0,0,8ZM216,188H40a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ListBullets.es.js
var a33 = __toESM(require("react"), 1);
var e32 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M76,64A12,12,0,0,1,88,52H216a12,12,0,0,1,0,24H88A12,12,0,0,1,76,64Zm140,52H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM44,112a16,16,0,1,0,16,16A16,16,0,0,0,44,112Zm0-64A16,16,0,1,0,60,64,16,16,0,0,0,44,48Zm0,128a16,16,0,1,0,16,16A16,16,0,0,0,44,176Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M216,64V192H88V64Z", opacity: "0.2" }), /* @__PURE__ */ a33.createElement("path", { d: "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,1,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,1,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM68,188a12,12,0,1,1,12-12A12,12,0,0,1,68,188Zm0-48a12,12,0,1,1,12-12A12,12,0,0,1,68,140Zm0-48A12,12,0,1,1,80,80,12,12,0,0,1,68,92Zm124,92H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Zm0-48H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Zm0-48H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M82,64a6,6,0,0,1,6-6H216a6,6,0,0,1,0,12H88A6,6,0,0,1,82,64Zm134,58H88a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Zm0,64H88a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12ZM44,54A10,10,0,1,0,54,64,10,10,0,0,0,44,54Zm0,128a10,10,0,1,0,10,10A10,10,0,0,0,44,182Zm0-64a10,10,0,1,0,10,10A10,10,0,0,0,44,118Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M84,64a4,4,0,0,1,4-4H216a4,4,0,0,1,0,8H88A4,4,0,0,1,84,64Zm132,60H88a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Zm0,64H88a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8ZM44,120a8,8,0,1,0,8,8A8,8,0,0,0,44,120Zm0-64a8,8,0,1,0,8,8A8,8,0,0,0,44,56Zm0,128a8,8,0,1,0,8,8A8,8,0,0,0,44,184Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/MagnifyingGlass.es.js
var e33 = __toESM(require("react"), 1);
var a34 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e33.createElement(e33.Fragment, null, /* @__PURE__ */ e33.createElement("path", { d: "M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e33.createElement(e33.Fragment, null, /* @__PURE__ */ e33.createElement("path", { d: "M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z", opacity: "0.2" }), /* @__PURE__ */ e33.createElement("path", { d: "M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e33.createElement(e33.Fragment, null, /* @__PURE__ */ e33.createElement("path", { d: "M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e33.createElement(e33.Fragment, null, /* @__PURE__ */ e33.createElement("path", { d: "M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e33.createElement(e33.Fragment, null, /* @__PURE__ */ e33.createElement("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e33.createElement(e33.Fragment, null, /* @__PURE__ */ e33.createElement("path", { d: "M226.83,221.17l-52.7-52.7a84.1,84.1,0,1,0-5.66,5.66l52.7,52.7a4,4,0,0,0,5.66-5.66ZM36,112a76,76,0,1,1,76,76A76.08,76.08,0,0,1,36,112Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Note.es.js
var a35 = __toESM(require("react"), 1);
var e34 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M84,108A12,12,0,0,1,96,96h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,108Zm32,28H96a12,12,0,0,0,0,24h20a12,12,0,0,0,0-24ZM228,48V156.69a19.86,19.86,0,0,1-5.86,14.14l-51.31,51.31A19.86,19.86,0,0,1,156.69,228H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28H208A20,20,0,0,1,228,48ZM52,204h92V156a12,12,0,0,1,12-12h48V52H52Zm139-36H168v23Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M216,160l-56,56V160Z", opacity: "0.2" }), /* @__PURE__ */ a35.createElement("path", { d: "M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.92,15.92,0,0,0,168,219.31L219.31,168A15.92,15.92,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM96,88h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm32,80H96a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16ZM96,136a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm64,68.69V160h44.7Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M90,96a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H96A6,6,0,0,1,90,96Zm6,38h64a6,6,0,0,0,0-12H96a6,6,0,0,0,0,12Zm32,20H96a6,6,0,0,0,0,12h32a6,6,0,0,0,0-12ZM222,48V156.69a13.94,13.94,0,0,1-4.1,9.9L166.59,217.9a13.94,13.94,0,0,1-9.9,4.1H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34H208A14,14,0,0,1,222,48ZM48,210H154V160a6,6,0,0,1,6-6h50V48a2,2,0,0,0-2-2H48a2,2,0,0,0-2,2V208A2,2,0,0,0,48,210Zm153.52-44H166v35.52Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M92,96a4,4,0,0,1,4-4h64a4,4,0,0,1,0,8H96A4,4,0,0,1,92,96Zm4,36h64a4,4,0,0,0,0-8H96a4,4,0,0,0,0,8Zm32,24H96a4,4,0,0,0,0,8h32a4,4,0,0,0,0-8ZM220,48V156.69a11.9,11.9,0,0,1-3.52,8.48l-51.31,51.32a11.93,11.93,0,0,1-8.48,3.51H48a12,12,0,0,1-12-12V48A12,12,0,0,1,48,36H208A12,12,0,0,1,220,48ZM48,212H156V160a4,4,0,0,1,4-4h52V48a4,4,0,0,0-4-4H48a4,4,0,0,0-4,4V208A4,4,0,0,0,48,212Zm158.35-48H164v42.35Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Package.es.js
var l3 = __toESM(require("react"), 1);
var a36 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ l3.createElement(l3.Fragment, null, /* @__PURE__ */ l3.createElement("path", { d: "M225.6,62.64l-88-48.17a19.91,19.91,0,0,0-19.2,0l-88,48.17A20,20,0,0,0,20,80.19v95.62a20,20,0,0,0,10.4,17.55l88,48.17a19.89,19.89,0,0,0,19.2,0l88-48.17A20,20,0,0,0,236,175.81V80.19A20,20,0,0,0,225.6,62.64ZM128,36.57,200,76,178.57,87.73l-72-39.42Zm0,78.83L56,76,81.56,62l72,39.41ZM44,96.79l72,39.4v76.67L44,173.44Zm96,116.07V136.19l24-13.13V152a12,12,0,0,0,24,0V109.92l24-13.13v76.65Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ l3.createElement(l3.Fragment, null, /* @__PURE__ */ l3.createElement(
      "path",
      {
        d: "M128,129.09V232a8,8,0,0,1-3.84-1l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,.7-3.25Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ l3.createElement("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ l3.createElement(l3.Fragment, null, /* @__PURE__ */ l3.createElement("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ l3.createElement(l3.Fragment, null, /* @__PURE__ */ l3.createElement("path", { d: "M222.72,67.91l-88-48.18a13.9,13.9,0,0,0-13.44,0l-88,48.18A14,14,0,0,0,26,80.18v95.64a14,14,0,0,0,7.28,12.27l88,48.18a13.92,13.92,0,0,0,13.44,0l88-48.18A14,14,0,0,0,230,175.82V80.18A14,14,0,0,0,222.72,67.91ZM127,30.25a2,2,0,0,1,1.92,0L212.51,76,178.57,94.57,94.05,48.31ZM122,223,39,177.57a2,2,0,0,1-1-1.75V86.66l84,46ZM43.49,76,81.56,55.15l84.51,46.26L128,122.24ZM218,175.82a2,2,0,0,1-1,1.75h0L134,223V132.64l36-19.71V152a6,6,0,0,0,12,0V106.37l36-19.71Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ l3.createElement(l3.Fragment, null, /* @__PURE__ */ l3.createElement("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ l3.createElement(l3.Fragment, null, /* @__PURE__ */ l3.createElement("path", { d: "M221.76,69.66l-88-48.18a12,12,0,0,0-11.52,0l-88,48.18A12,12,0,0,0,28,80.18v95.64a12,12,0,0,0,6.24,10.52l88,48.18a11.95,11.95,0,0,0,11.52,0l88-48.18A12,12,0,0,0,228,175.82V80.18A12,12,0,0,0,221.76,69.66ZM126.08,28.5a3.94,3.94,0,0,1,3.84,0L216.67,76,178.5,96.89a4,4,0,0,0-.58-.4l-88-48.18Zm1.92,96L39.33,76,81.56,52.87l88.67,48.54Zm-89.92,54.8a4,4,0,0,1-2.08-3.5V83.29l88,48.16v94.91Zm179.84,0h0l-85.92,47V131.45l40-21.89V152a4,4,0,0,0,8,0V105.18l40-21.89v92.53A4,4,0,0,1,217.92,179.32Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/PaperPlaneTilt.es.js
var a37 = __toESM(require("react"), 1);
var e35 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a37.createElement(a37.Fragment, null, /* @__PURE__ */ a37.createElement("path", { d: "M230.14,25.86a20,20,0,0,0-19.57-5.11l-.22.07L18.44,79a20,20,0,0,0-3.06,37.25L99,157l40.71,83.65a19.81,19.81,0,0,0,18,11.38c.57,0,1.15,0,1.73-.07A19.82,19.82,0,0,0,177,237.56L235.18,45.65a1.42,1.42,0,0,0,.07-.22A20,20,0,0,0,230.14,25.86ZM156.91,221.07l-34.37-70.64,46-45.95a12,12,0,0,0-17-17l-46,46L34.93,99.09,210,46Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a37.createElement(a37.Fragment, null, /* @__PURE__ */ a37.createElement(
      "path",
      {
        d: "M223.69,42.18l-58.22,192a8,8,0,0,1-14.92,1.25L108,148,20.58,105.45a8,8,0,0,1,1.25-14.92l192-58.22A8,8,0,0,1,223.69,42.18Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a37.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a37.createElement(a37.Fragment, null, /* @__PURE__ */ a37.createElement("path", { d: "M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a37.createElement(a37.Fragment, null, /* @__PURE__ */ a37.createElement("path", { d: "M225.88,30.12a13.83,13.83,0,0,0-13.7-3.58l-.11,0L20.14,84.77A14,14,0,0,0,18,110.85l85.56,41.64L145.12,238a13.87,13.87,0,0,0,12.61,8c.4,0,.81,0,1.21-.05a13.9,13.9,0,0,0,12.29-10.09l58.2-191.93,0-.11A13.83,13.83,0,0,0,225.88,30.12Zm-8,10.4L159.73,232.43l0,.11a2,2,0,0,1-3.76.26l-40.68-83.58,49-49a6,6,0,1,0-8.49-8.49l-49,49L23.15,100a2,2,0,0,1,.31-3.74l.11,0L215.48,38.08a1.94,1.94,0,0,1,1.92.52A2,2,0,0,1,217.92,40.52Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a37.createElement(a37.Fragment, null, /* @__PURE__ */ a37.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a37.createElement(a37.Fragment, null, /* @__PURE__ */ a37.createElement("path", { d: "M224.47,31.52a11.87,11.87,0,0,0-11.82-3L20.74,86.67a12,12,0,0,0-1.91,22.38L105,151l41.92,86.15A11.88,11.88,0,0,0,157.74,244c.34,0,.69,0,1,0a11.89,11.89,0,0,0,10.52-8.63l58.21-192,0-.08A11.85,11.85,0,0,0,224.47,31.52Zm-4.62,9.54-58.23,192a4,4,0,0,1-7.48.59l-41.3-84.86,50-50a4,4,0,1,0-5.66-5.66l-50,50-84.9-41.31a3.88,3.88,0,0,1-2.27-4,3.93,3.93,0,0,1,3-3.54L214.9,36.16A3.93,3.93,0,0,1,216,36a4,4,0,0,1,2.79,1.19A3.93,3.93,0,0,1,219.85,41.06Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Paperclip.es.js
var a38 = __toESM(require("react"), 1);
var e36 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M212.48,136.49l-82.06,82a60,60,0,0,1-84.85-84.88l98.16-97.89a40,40,0,0,1,56.56,56.59l-.17.16-95.8,92.22a12,12,0,1,1-16.64-17.3l95.71-92.12a16,16,0,0,0-22.7-22.56L62.53,150.57a36,36,0,0,0,50.93,50.91l82.06-82a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement(
      "path",
      {
        d: "M180.75,104.75,204,128l-82.06,81.94a48,48,0,0,1-67.88-67.88L153.37,41.37a32,32,0,0,1,45.26,45.26Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a38.createElement("path", { d: "M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,50.34a8,8,0,0,0-11.32,0L87.09,143A24,24,0,1,0,121,177l49.32-50.32a8,8,0,1,1,11.42,11.2l-49.37,50.38a40,40,0,1,1-56.62-56.51L143,63.09A24,24,0,1,1,177,97L109.71,165.6a8,8,0,1,1-11.42-11.2L165.6,85.71a8,8,0,0,0,.06-11.37Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M208.25,123.76a6,6,0,0,1,0,8.49l-82.06,82a54,54,0,0,1-76.36-76.39L149.1,37.14a38,38,0,1,1,53.77,53.72L103.59,191.54a22,22,0,1,1-31.15-31.09l83.28-84.67a6,6,0,0,1,8.56,8.42L81,168.91a10,10,0,1,0,14.11,14.18L194.35,82.4a26,26,0,1,0-36.74-36.8L58.33,146.28a42,42,0,1,0,59.37,59.44l82.06-82A6,6,0,0,1,208.25,123.76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M206.83,125.17a4,4,0,0,1,0,5.66l-82.06,82a52,52,0,0,1-73.54-73.55L150.52,38.55a36,36,0,1,1,50.94,50.9l-99.3,100.69a20,20,0,1,1-28.3-28.27l83.29-84.68a4,4,0,1,1,5.7,5.61L79.54,167.5a12,12,0,1,0,16.95,17L195.78,83.81A28,28,0,1,0,156.2,44.18L56.91,144.87a44,44,0,1,0,62.21,62.26l82-82A4,4,0,0,1,206.83,125.17Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Pause.es.js
var a39 = __toESM(require("react"), 1);
var e37 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a39.createElement(a39.Fragment, null, /* @__PURE__ */ a39.createElement("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a39.createElement(a39.Fragment, null, /* @__PURE__ */ a39.createElement(
      "path",
      {
        d: "M208,48V208a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h40A8,8,0,0,1,208,48ZM96,40H56a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H96a8,8,0,0,0,8-8V48A8,8,0,0,0,96,40Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a39.createElement("path", { d: "M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a39.createElement(a39.Fragment, null, /* @__PURE__ */ a39.createElement("path", { d: "M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a39.createElement(a39.Fragment, null, /* @__PURE__ */ a39.createElement("path", { d: "M200,34H160a14,14,0,0,0-14,14V208a14,14,0,0,0,14,14h40a14,14,0,0,0,14-14V48A14,14,0,0,0,200,34Zm2,174a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2h40a2,2,0,0,1,2,2ZM96,34H56A14,14,0,0,0,42,48V208a14,14,0,0,0,14,14H96a14,14,0,0,0,14-14V48A14,14,0,0,0,96,34Zm2,174a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2H96a2,2,0,0,1,2,2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a39.createElement(a39.Fragment, null, /* @__PURE__ */ a39.createElement("path", { d: "M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a39.createElement(a39.Fragment, null, /* @__PURE__ */ a39.createElement("path", { d: "M200,36H160a12,12,0,0,0-12,12V208a12,12,0,0,0,12,12h40a12,12,0,0,0,12-12V48A12,12,0,0,0,200,36Zm4,172a4,4,0,0,1-4,4H160a4,4,0,0,1-4-4V48a4,4,0,0,1,4-4h40a4,4,0,0,1,4,4ZM96,36H56A12,12,0,0,0,44,48V208a12,12,0,0,0,12,12H96a12,12,0,0,0,12-12V48A12,12,0,0,0,96,36Zm4,172a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V48a4,4,0,0,1,4-4H96a4,4,0,0,1,4,4Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/PencilSimple.es.js
var a40 = __toESM(require("react"), 1);
var e38 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a40.createElement(a40.Fragment, null, /* @__PURE__ */ a40.createElement("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a40.createElement(a40.Fragment, null, /* @__PURE__ */ a40.createElement(
      "path",
      {
        d: "M221.66,90.34,192,120,136,64l29.66-29.66a8,8,0,0,1,11.31,0L221.66,79A8,8,0,0,1,221.66,90.34Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a40.createElement("path", { d: "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a40.createElement(a40.Fragment, null, /* @__PURE__ */ a40.createElement("path", { d: "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108.68,147.31,64l24-24L216,84.68Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a40.createElement(a40.Fragment, null, /* @__PURE__ */ a40.createElement("path", { d: "M225.9,74.78,181.21,30.09a14,14,0,0,0-19.8,0L38.1,153.41a13.94,13.94,0,0,0-4.1,9.9V208a14,14,0,0,0,14,14H92.69a13.94,13.94,0,0,0,9.9-4.1L225.9,94.58a14,14,0,0,0,0-19.8ZM94.1,209.41a2,2,0,0,1-1.41.59H48a2,2,0,0,1-2-2V163.31a2,2,0,0,1,.59-1.41L136,72.48,183.51,120ZM217.41,86.1,192,111.51,144.49,64,169.9,38.58a2,2,0,0,1,2.83,0l44.68,44.69a2,2,0,0,1,0,2.83Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a40.createElement(a40.Fragment, null, /* @__PURE__ */ a40.createElement("path", { d: "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a40.createElement(a40.Fragment, null, /* @__PURE__ */ a40.createElement("path", { d: "M224.49,76.2,179.8,31.51a12,12,0,0,0-17,0L133.17,61.17h0L39.52,154.83A11.9,11.9,0,0,0,36,163.31V208a12,12,0,0,0,12,12H92.69a12,12,0,0,0,8.48-3.51L224.48,93.17a12,12,0,0,0,0-17Zm-129,134.63A4,4,0,0,1,92.69,212H48a4,4,0,0,1-4-4V163.31a4,4,0,0,1,1.17-2.83L136,69.65,186.34,120ZM218.83,87.51,192,114.34,141.66,64l26.82-26.83a4,4,0,0,1,5.66,0l44.69,44.68a4,4,0,0,1,0,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Play.es.js
var e39 = __toESM(require("react"), 1);
var a41 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e39.createElement(e39.Fragment, null, /* @__PURE__ */ e39.createElement("path", { d: "M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e39.createElement(e39.Fragment, null, /* @__PURE__ */ e39.createElement(
      "path",
      {
        d: "M228.23,134.69,84.15,222.81A8,8,0,0,1,72,216.12V39.88a8,8,0,0,1,12.15-6.69l144.08,88.12A7.82,7.82,0,0,1,228.23,134.69Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e39.createElement("path", { d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e39.createElement(e39.Fragment, null, /* @__PURE__ */ e39.createElement("path", { d: "M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e39.createElement(e39.Fragment, null, /* @__PURE__ */ e39.createElement("path", { d: "M231.36,116.19,87.28,28.06a14,14,0,0,0-14.18-.27A13.69,13.69,0,0,0,66,39.87V216.13a13.69,13.69,0,0,0,7.1,12.08,14,14,0,0,0,14.18-.27l144.08-88.13a13.82,13.82,0,0,0,0-23.62Zm-6.26,13.38L81,217.7a2,2,0,0,1-2.06,0,1.78,1.78,0,0,1-1-1.61V39.87a1.78,1.78,0,0,1,1-1.61A2.06,2.06,0,0,1,80,38a2,2,0,0,1,1,.31L225.1,126.43a1.82,1.82,0,0,1,0,3.14Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e39.createElement(e39.Fragment, null, /* @__PURE__ */ e39.createElement("path", { d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e39.createElement(e39.Fragment, null, /* @__PURE__ */ e39.createElement("path", { d: "M230.32,117.9,86.24,29.79a11.91,11.91,0,0,0-12.17-.23A11.71,11.71,0,0,0,68,39.89V216.11a11.71,11.71,0,0,0,6.07,10.33,11.91,11.91,0,0,0,12.17-.23L230.32,138.1a11.82,11.82,0,0,0,0-20.2Zm-4.18,13.37L82.06,219.39a4,4,0,0,1-4.07.07,3.77,3.77,0,0,1-2-3.35V39.89a3.77,3.77,0,0,1,2-3.35,4,4,0,0,1,4.07.07l144.08,88.12a3.8,3.8,0,0,1,0,6.54Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Plug.es.js
var a42 = __toESM(require("react"), 1);
var l4 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a42.createElement(a42.Fragment, null, /* @__PURE__ */ a42.createElement("path", { d: "M240.49,63.51a12,12,0,0,0-17,0L192,95,161,64l31.52-31.51a12,12,0,0,0-17-17L144,47,120.49,23.51a12,12,0,1,0-17,17L107,44,56.89,94.14a44,44,0,0,0,0,62.23l12.88,12.88L23.51,215.51a12,12,0,0,0,17,17l46.26-46.26,12.88,12.88a44,44,0,0,0,62.23,0L212,149l3.51,3.52a12,12,0,0,0,17-17L209,112l31.52-31.51A12,12,0,0,0,240.49,63.51Zm-95.6,118.63a20,20,0,0,1-28.29,0L73.86,139.4a20,20,0,0,1,0-28.29L124,61l71,71Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a42.createElement(a42.Fragment, null, /* @__PURE__ */ a42.createElement(
      "path",
      {
        d: "M212,132l-58.63,58.63a32,32,0,0,1-45.25,0L65.37,147.88a32,32,0,0,1,0-45.25L124,44Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a42.createElement("path", { d: "M237.66,66.34a8,8,0,0,0-11.32,0L192,100.69,155.31,64l34.35-34.34a8,8,0,1,0-11.32-11.32L144,52.69,117.66,26.34a8,8,0,0,0-11.32,11.32L112.69,44l-53,53a40,40,0,0,0,0,56.57l15.71,15.71L26.34,218.34a8,8,0,0,0,11.32,11.32l49.09-49.09,15.71,15.71a40,40,0,0,0,56.57,0l53-53,6.34,6.35a8,8,0,0,0,11.32-11.32L203.31,112l34.35-34.34A8,8,0,0,0,237.66,66.34ZM147.72,185a24,24,0,0,1-33.95,0L71,142.23a24,24,0,0,1,0-33.95l53-53L200.69,132Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a42.createElement(a42.Fragment, null, /* @__PURE__ */ a42.createElement("path", { d: "M237.66,77.66,203.31,112l26.35,26.34a8,8,0,0,1-11.32,11.32L212,143.31l-53,53a40,40,0,0,1-56.57,0L86.75,180.57,37.66,229.66a8,8,0,0,1-11.32-11.32l49.09-49.09L59.72,153.54a40,40,0,0,1,0-56.57l53-53-6.35-6.34a8,8,0,0,1,11.32-11.32L144,52.69l34.34-34.35a8,8,0,1,1,11.32,11.32L155.31,64,192,100.69l34.34-34.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a42.createElement(a42.Fragment, null, /* @__PURE__ */ a42.createElement("path", { d: "M236.24,67.76a6,6,0,0,0-8.48,0L192,103.51,152.49,64l35.75-35.76a6,6,0,0,0-8.48-8.48L144,55.51,116.24,27.76a6,6,0,1,0-8.48,8.48L115.51,44,61.13,98.38a38,38,0,0,0,0,53.75l17.13,17.12-50.5,50.51a6,6,0,1,0,8.48,8.48l50.51-50.5,17.13,17.13a38,38,0,0,0,53.74,0L212,140.49l7.76,7.75a6,6,0,0,0,8.48-8.48L200.49,112l35.75-35.76A6,6,0,0,0,236.24,67.76ZM149.13,186.38a26,26,0,0,1-36.77,0L69.62,143.64a26,26,0,0,1,0-36.77L124,52.49,203.51,132Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a42.createElement(a42.Fragment, null, /* @__PURE__ */ a42.createElement("path", { d: "M237.66,66.34a8,8,0,0,0-11.32,0L192,100.69,155.31,64l34.35-34.34a8,8,0,1,0-11.32-11.32L144,52.69,117.66,26.34a8,8,0,0,0-11.32,11.32L112.69,44l-53,53a40,40,0,0,0,0,56.57l15.71,15.71L26.34,218.34a8,8,0,0,0,11.32,11.32l49.09-49.09,15.71,15.71a40,40,0,0,0,56.57,0l53-53,6.34,6.35a8,8,0,0,0,11.32-11.32L203.31,112l34.35-34.34A8,8,0,0,0,237.66,66.34ZM147.72,185a24,24,0,0,1-33.95,0L71,142.23a24,24,0,0,1,0-33.95l53-53L200.69,132Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a42.createElement(a42.Fragment, null, /* @__PURE__ */ a42.createElement("path", { d: "M234.83,69.17a4,4,0,0,0-5.66,0L192,106.34,149.66,64l37.17-37.17a4,4,0,1,0-5.66-5.66L144,58.34,114.83,29.17a4,4,0,0,0-5.66,5.66L118.34,44,62.54,99.8a36.05,36.05,0,0,0,0,50.91l18.55,18.54L29.17,221.17a4,4,0,0,0,5.66,5.66l51.92-51.92,18.54,18.55a36.06,36.06,0,0,0,50.91,0l55.8-55.8,9.17,9.17a4,4,0,0,0,5.66-5.66L197.66,112l37.17-37.17A4,4,0,0,0,234.83,69.17ZM150.54,187.8a28,28,0,0,1-39.59,0L68.2,145.05a28,28,0,0,1,0-39.59L124,49.66,206.34,132Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Plus.es.js
var e40 = __toESM(require("react"), 1);
var a43 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e40.createElement(e40.Fragment, null, /* @__PURE__ */ e40.createElement("path", { d: "M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e40.createElement(e40.Fragment, null, /* @__PURE__ */ e40.createElement(
      "path",
      {
        d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e40.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e40.createElement(e40.Fragment, null, /* @__PURE__ */ e40.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e40.createElement(e40.Fragment, null, /* @__PURE__ */ e40.createElement("path", { d: "M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e40.createElement(e40.Fragment, null, /* @__PURE__ */ e40.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e40.createElement(e40.Fragment, null, /* @__PURE__ */ e40.createElement("path", { d: "M220,128a4,4,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,0-8h84V40a4,4,0,0,1,8,0v84h84A4,4,0,0,1,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Robot.es.js
var a44 = __toESM(require("react"), 1);
var e41 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a44.createElement(a44.Fragment, null, /* @__PURE__ */ a44.createElement("path", { d: "M72,104a16,16,0,1,1,16,16A16,16,0,0,1,72,104Zm96,16a16,16,0,1,0-16-16A16,16,0,0,0,168,120Zm68-40V192a36,36,0,0,1-36,36H56a36,36,0,0,1-36-36V80A36,36,0,0,1,56,44h60V16a12,12,0,0,1,24,0V44h60A36,36,0,0,1,236,80Zm-24,0a12,12,0,0,0-12-12H56A12,12,0,0,0,44,80V192a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12Zm-12,82a30,30,0,0,1-30,30H86a30,30,0,0,1,0-60h84A30,30,0,0,1,200,162Zm-80-6v12h16V156ZM86,168H96V156H86a6,6,0,0,0,0,12Zm90-6a6,6,0,0,0-6-6H160v12h10A6,6,0,0,0,176,162Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a44.createElement(a44.Fragment, null, /* @__PURE__ */ a44.createElement(
      "path",
      {
        d: "M200,56H56A24,24,0,0,0,32,80V192a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V80A24,24,0,0,0,200,56ZM164,184H92a20,20,0,0,1,0-40h72a20,20,0,0,1,0,40Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a44.createElement("path", { d: "M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Zm4,28H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a44.createElement(a44.Fragment, null, /* @__PURE__ */ a44.createElement("path", { d: "M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48ZM172,96a12,12,0,1,1-12,12A12,12,0,0,1,172,96ZM96,184H80a16,16,0,0,1,0-32H96ZM84,120a12,12,0,1,1,12-12A12,12,0,0,1,84,120Zm60,64H112V152h32Zm32,0H160V152h16a16,16,0,0,1,0,32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a44.createElement(a44.Fragment, null, /* @__PURE__ */ a44.createElement("path", { d: "M200,50H134V16a6,6,0,0,0-12,0V50H56A30,30,0,0,0,26,80V192a30,30,0,0,0,30,30H200a30,30,0,0,0,30-30V80A30,30,0,0,0,200,50Zm18,142a18,18,0,0,1-18,18H56a18,18,0,0,1-18-18V80A18,18,0,0,1,56,62H200a18,18,0,0,1,18,18ZM74,108a10,10,0,1,1,10,10A10,10,0,0,1,74,108Zm88,0a10,10,0,1,1,10,10A10,10,0,0,1,162,108Zm2,30H92a26,26,0,0,0,0,52h72a26,26,0,0,0,0-52Zm-22,12v28H114V150ZM78,164a14,14,0,0,1,14-14h10v28H92A14,14,0,0,1,78,164Zm86,14H154V150h10a14,14,0,0,1,0,28Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a44.createElement(a44.Fragment, null, /* @__PURE__ */ a44.createElement("path", { d: "M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a44.createElement(a44.Fragment, null, /* @__PURE__ */ a44.createElement("path", { d: "M200,52H132V16a4,4,0,0,0-8,0V52H56A28,28,0,0,0,28,80V192a28,28,0,0,0,28,28H200a28,28,0,0,0,28-28V80A28,28,0,0,0,200,52Zm20,140a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V80A20,20,0,0,1,56,60H200a20,20,0,0,1,20,20ZM76,108a8,8,0,1,1,8,8A8,8,0,0,1,76,108Zm88,0a8,8,0,1,1,8,8A8,8,0,0,1,164,108Zm0,32H92a24,24,0,0,0,0,48h72a24,24,0,0,0,0-48Zm-20,8v32H112V148ZM76,164a16,16,0,0,1,16-16h12v32H92A16,16,0,0,1,76,164Zm88,16H152V148h12a16,16,0,0,1,0,32Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ShieldCheck.es.js
var a45 = __toESM(require("react"), 1);
var e42 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a45.createElement(a45.Fragment, null, /* @__PURE__ */ a45.createElement("path", { d: "M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204ZM79.51,144.49a12,12,0,1,1,17-17L112,143l47.51-47.52a12,12,0,0,1,17,17l-56,56a12,12,0,0,1-17,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a45.createElement(a45.Fragment, null, /* @__PURE__ */ a45.createElement(
      "path",
      {
        d: "M216,56v56c0,96-88,120-88,120S40,208,40,112V56a8,8,0,0,1,8-8H208A8,8,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a45.createElement("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a45.createElement(a45.Fragment, null, /* @__PURE__ */ a45.createElement("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm-34.32,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a45.createElement(a45.Fragment, null, /* @__PURE__ */ a45.createElement("path", { d: "M208,42H48A14,14,0,0,0,34,56v56c0,51.94,25.12,83.4,46.2,100.64,22.73,18.6,45.27,24.89,46.22,25.15a6,6,0,0,0,3.16,0c.95-.26,23.49-6.55,46.22-25.15C196.88,195.4,222,163.94,222,112V56A14,14,0,0,0,208,42Zm2,70c0,37.76-13.94,68.39-41.44,91.06A131.17,131.17,0,0,1,128,225.72a130.94,130.94,0,0,1-40.56-22.66C59.94,180.39,46,149.76,46,112V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2ZM172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a45.createElement(a45.Fragment, null, /* @__PURE__ */ a45.createElement("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a45.createElement(a45.Fragment, null, /* @__PURE__ */ a45.createElement("path", { d: "M208,44H48A12,12,0,0,0,36,56v56c0,51.16,24.73,82.12,45.47,99.1,22.4,18.32,44.55,24.5,45.48,24.76a4,4,0,0,0,2.1,0c.93-.26,23.08-6.44,45.48-24.76,20.74-17,45.47-47.94,45.47-99.1V56A12,12,0,0,0,208,44Zm4,68c0,38.44-14.23,69.63-42.29,92.71A132.45,132.45,0,0,1,128,227.82a132.23,132.23,0,0,1-41.71-23.11C58.23,181.63,44,150.44,44,112V56a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-41.17-10.83a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Sparkle.es.js
var a46 = __toESM(require("react"), 1);
var l5 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a46.createElement(a46.Fragment, null, /* @__PURE__ */ a46.createElement("path", { d: "M199,125.31l-49.88-18.39L130.69,57a19.92,19.92,0,0,0-37.38,0L74.92,106.92,25,125.31a19.92,19.92,0,0,0,0,37.38l49.88,18.39L93.31,231a19.92,19.92,0,0,0,37.38,0l18.39-49.88L199,162.69a19.92,19.92,0,0,0,0-37.38Zm-63.38,35.16a12,12,0,0,0-7.11,7.11L112,212.28l-16.47-44.7a12,12,0,0,0-7.11-7.11L43.72,144l44.7-16.47a12,12,0,0,0,7.11-7.11L112,75.72l16.47,44.7a12,12,0,0,0,7.11,7.11L180.28,144ZM140,40a12,12,0,0,1,12-12h12V16a12,12,0,0,1,24,0V28h12a12,12,0,0,1,0,24H188V64a12,12,0,0,1-24,0V52H152A12,12,0,0,1,140,40ZM252,88a12,12,0,0,1-12,12h-4v4a12,12,0,0,1-24,0v-4h-4a12,12,0,0,1,0-24h4V72a12,12,0,0,1,24,0v4h4A12,12,0,0,1,252,88Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a46.createElement(a46.Fragment, null, /* @__PURE__ */ a46.createElement(
      "path",
      {
        d: "M194.82,151.43l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0l-20.3-55.09-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3A7.92,7.92,0,0,1,194.82,151.43Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a46.createElement("path", { d: "M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a46.createElement(a46.Fragment, null, /* @__PURE__ */ a46.createElement("path", { d: "M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a46.createElement(a46.Fragment, null, /* @__PURE__ */ a46.createElement("path", { d: "M196.89,130.94,144.4,111.6,125.06,59.11a13.92,13.92,0,0,0-26.12,0L79.6,111.6,27.11,130.94a13.92,13.92,0,0,0,0,26.12L79.6,176.4l19.34,52.49a13.92,13.92,0,0,0,26.12,0L144.4,176.4l52.49-19.34a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-55.08,20.3a6,6,0,0,0-3.56,3.56l-20.3,55.08a1.92,1.92,0,0,1-3.6,0L89.9,169.66a6,6,0,0,0-3.56-3.56L31.26,145.8a1.92,1.92,0,0,1,0-3.6l55.08-20.3a6,6,0,0,0,3.56-3.56l20.3-55.08a1.92,1.92,0,0,1,3.6,0l20.3,55.08a6,6,0,0,0,3.56,3.56l55.08,20.3a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a46.createElement(a46.Fragment, null, /* @__PURE__ */ a46.createElement("path", { d: "M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a46.createElement(a46.Fragment, null, /* @__PURE__ */ a46.createElement("path", { d: "M196.2,132.81l-53.36-19.65L123.19,59.8a11.93,11.93,0,0,0-22.38,0L81.16,113.16,27.8,132.81a11.93,11.93,0,0,0,0,22.38l53.36,19.65,19.65,53.36a11.93,11.93,0,0,0,22.38,0l19.65-53.36,53.36-19.65a11.93,11.93,0,0,0,0-22.38Zm-2.77,14.87L138.35,168a4,4,0,0,0-2.37,2.37l-20.3,55.08a3.92,3.92,0,0,1-7.36,0L88,170.35A4,4,0,0,0,85.65,168l-55.08-20.3a3.92,3.92,0,0,1,0-7.36L85.65,120A4,4,0,0,0,88,117.65l20.3-55.08a3.92,3.92,0,0,1,7.36,0L136,117.65a4,4,0,0,0,2.37,2.37l55.08,20.3a3.92,3.92,0,0,1,0,7.36ZM148,40a4,4,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4,4,0,0,1,148,40Zm96,48a4,4,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4,4,0,0,1,244,88Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/SpinnerGap.es.js
var a47 = __toESM(require("react"), 1);
var e43 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a47.createElement(a47.Fragment, null, /* @__PURE__ */ a47.createElement("path", { d: "M140,32V64a12,12,0,0,1-24,0V32a12,12,0,0,1,24,0Zm84,84H192a12,12,0,0,0,0,24h32a12,12,0,0,0,0-24Zm-42.26,48.77a12,12,0,1,0-17,17l22.63,22.63a12,12,0,0,0,17-17ZM128,180a12,12,0,0,0-12,12v32a12,12,0,0,0,24,0V192A12,12,0,0,0,128,180ZM74.26,164.77,51.63,187.4a12,12,0,0,0,17,17l22.63-22.63a12,12,0,1,0-17-17ZM76,128a12,12,0,0,0-12-12H32a12,12,0,0,0,0,24H64A12,12,0,0,0,76,128ZM68.6,51.63a12,12,0,1,0-17,17L74.26,91.23a12,12,0,0,0,17-17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a47.createElement(a47.Fragment, null, /* @__PURE__ */ a47.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ a47.createElement("path", { d: "M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a47.createElement(a47.Fragment, null, /* @__PURE__ */ a47.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM48,136a8,8,0,0,1,0-16H72a8,8,0,0,1,0,16Zm46.06,37.25-17,17a8,8,0,0,1-11.32-11.32l17-17a8,8,0,0,1,11.31,11.31Zm0-79.19a8,8,0,0,1-11.31,0l-17-17A8,8,0,0,1,77.09,65.77l17,17A8,8,0,0,1,94.06,94.06ZM136,208a8,8,0,0,1-16,0V184a8,8,0,0,1,16,0Zm0-136a8,8,0,0,1-16,0V48a8,8,0,0,1,16,0Zm54.23,118.23a8,8,0,0,1-11.32,0l-17-17a8,8,0,0,1,11.31-11.31l17,17A8,8,0,0,1,190.23,190.23ZM208,136H184a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a47.createElement(a47.Fragment, null, /* @__PURE__ */ a47.createElement("path", { d: "M134,32V64a6,6,0,0,1-12,0V32a6,6,0,0,1,12,0Zm90,90H192a6,6,0,0,0,0,12h32a6,6,0,0,0,0-12Zm-46.5,47A6,6,0,0,0,169,177.5l22.63,22.62a6,6,0,0,0,8.48-8.48ZM128,186a6,6,0,0,0-6,6v32a6,6,0,0,0,12,0V192A6,6,0,0,0,128,186ZM78.5,169,55.88,191.64a6,6,0,1,0,8.48,8.48L87,177.5A6,6,0,1,0,78.5,169ZM70,128a6,6,0,0,0-6-6H32a6,6,0,0,0,0,12H64A6,6,0,0,0,70,128ZM64.36,55.88a6,6,0,0,0-8.48,8.48L78.5,87A6,6,0,1,0,87,78.5Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a47.createElement(a47.Fragment, null, /* @__PURE__ */ a47.createElement("path", { d: "M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a47.createElement(a47.Fragment, null, /* @__PURE__ */ a47.createElement("path", { d: "M132,32V64a4,4,0,0,1-8,0V32a4,4,0,0,1,8,0Zm92,92H192a4,4,0,0,0,0,8h32a4,4,0,0,0,0-8Zm-47.92,46.43a4,4,0,1,0-5.65,5.65l22.62,22.63a4,4,0,0,0,5.66-5.66ZM128,188a4,4,0,0,0-4,4v32a4,4,0,0,0,8,0V192A4,4,0,0,0,128,188ZM79.92,170.43,57.29,193.05A4,4,0,0,0,63,198.71l22.62-22.63a4,4,0,1,0-5.65-5.65ZM68,128a4,4,0,0,0-4-4H32a4,4,0,0,0,0,8H64A4,4,0,0,0,68,128ZM63,57.29A4,4,0,0,0,57.29,63L79.92,85.57a4,4,0,1,0,5.65-5.65Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Stop.es.js
var e44 = __toESM(require("react"), 1);
var a48 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e44.createElement(e44.Fragment, null, /* @__PURE__ */ e44.createElement("path", { d: "M200,36H56A20,20,0,0,0,36,56V200a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V56A20,20,0,0,0,200,36Zm-4,160H60V60H196Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e44.createElement(e44.Fragment, null, /* @__PURE__ */ e44.createElement(
      "path",
      {
        d: "M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e44.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e44.createElement(e44.Fragment, null, /* @__PURE__ */ e44.createElement("path", { d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e44.createElement(e44.Fragment, null, /* @__PURE__ */ e44.createElement("path", { d: "M200,42H56A14,14,0,0,0,42,56V200a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,158a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H200a2,2,0,0,1,2,2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e44.createElement(e44.Fragment, null, /* @__PURE__ */ e44.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e44.createElement(e44.Fragment, null, /* @__PURE__ */ e44.createElement("path", { d: "M200,44H56A12,12,0,0,0,44,56V200a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V56A12,12,0,0,0,200,44Zm4,156a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Trash.es.js
var a49 = __toESM(require("react"), 1);
var e45 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a49.createElement(a49.Fragment, null, /* @__PURE__ */ a49.createElement("path", { d: "M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a49.createElement(a49.Fragment, null, /* @__PURE__ */ a49.createElement("path", { d: "M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56Z", opacity: "0.2" }), /* @__PURE__ */ a49.createElement("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a49.createElement(a49.Fragment, null, /* @__PURE__ */ a49.createElement("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a49.createElement(a49.Fragment, null, /* @__PURE__ */ a49.createElement("path", { d: "M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a49.createElement(a49.Fragment, null, /* @__PURE__ */ a49.createElement("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a49.createElement(a49.Fragment, null, /* @__PURE__ */ a49.createElement("path", { d: "M216,52H172V40a20,20,0,0,0-20-20H104A20,20,0,0,0,84,40V52H40a4,4,0,0,0,0,8H52V208a12,12,0,0,0,12,12H192a12,12,0,0,0,12-12V60h12a4,4,0,0,0,0-8ZM92,40a12,12,0,0,1,12-12h48a12,12,0,0,1,12,12V52H92ZM196,208a4,4,0,0,1-4,4H64a4,4,0,0,1-4-4V60H196ZM108,104v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Zm48,0v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/TreeStructure.es.js
var a50 = __toESM(require("react"), 1);
var H = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a50.createElement(a50.Fragment, null, /* @__PURE__ */ a50.createElement("path", { d: "M160,116h48a20,20,0,0,0,20-20V48a20,20,0,0,0-20-20H160a20,20,0,0,0-20,20V60H128a28,28,0,0,0-28,28v28H76v-4A20,20,0,0,0,56,92H24A20,20,0,0,0,4,112v32a20,20,0,0,0,20,20H56a20,20,0,0,0,20-20v-4h24v28a28,28,0,0,0,28,28h12v12a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V160a20,20,0,0,0-20-20H160a20,20,0,0,0-20,20v12H128a4,4,0,0,1-4-4V88a4,4,0,0,1,4-4h12V96A20,20,0,0,0,160,116ZM52,140H28V116H52Zm112,24h40v40H164Zm0-112h40V92H164Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a50.createElement(a50.Fragment, null, /* @__PURE__ */ a50.createElement(
      "path",
      {
        d: "M64,112v32a8,8,0,0,1-8,8H24a8,8,0,0,1-8-8V112a8,8,0,0,1,8-8H56A8,8,0,0,1,64,112ZM208,40H160a8,8,0,0,0-8,8V96a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V48A8,8,0,0,0,208,40Zm0,112H160a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V160A8,8,0,0,0,208,152Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a50.createElement("path", { d: "M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a50.createElement(a50.Fragment, null, /* @__PURE__ */ a50.createElement("path", { d: "M144,96V80H128a8,8,0,0,0-8,8v80a8,8,0,0,0,8,8h16V160a16,16,0,0,1,16-16h48a16,16,0,0,1,16,16v48a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V192H128a24,24,0,0,1-24-24V136H72v8a16,16,0,0,1-16,16H24A16,16,0,0,1,8,144V112A16,16,0,0,1,24,96H56a16,16,0,0,1,16,16v8h32V88a24,24,0,0,1,24-24h16V48a16,16,0,0,1,16-16h48a16,16,0,0,1,16,16V96a16,16,0,0,1-16,16H160A16,16,0,0,1,144,96Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a50.createElement(a50.Fragment, null, /* @__PURE__ */ a50.createElement("path", { d: "M160,110h48a14,14,0,0,0,14-14V48a14,14,0,0,0-14-14H160a14,14,0,0,0-14,14V66H128a22,22,0,0,0-22,22v34H70V112A14,14,0,0,0,56,98H24a14,14,0,0,0-14,14v32a14,14,0,0,0,14,14H56a14,14,0,0,0,14-14V134h36v34a22,22,0,0,0,22,22h18v18a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V160a14,14,0,0,0-14-14H160a14,14,0,0,0-14,14v18H128a10,10,0,0,1-10-10V88a10,10,0,0,1,10-10h18V96A14,14,0,0,0,160,110ZM58,144a2,2,0,0,1-2,2H24a2,2,0,0,1-2-2V112a2,2,0,0,1,2-2H56a2,2,0,0,1,2,2Zm100,16a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2v48a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2Zm0-112a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2V96a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a50.createElement(a50.Fragment, null, /* @__PURE__ */ a50.createElement("path", { d: "M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a50.createElement(a50.Fragment, null, /* @__PURE__ */ a50.createElement("path", { d: "M160,108h48a12,12,0,0,0,12-12V48a12,12,0,0,0-12-12H160a12,12,0,0,0-12,12V68H128a20,20,0,0,0-20,20v36H68V112a12,12,0,0,0-12-12H24a12,12,0,0,0-12,12v32a12,12,0,0,0,12,12H56a12,12,0,0,0,12-12V132h40v36a20,20,0,0,0,20,20h20v20a12,12,0,0,0,12,12h48a12,12,0,0,0,12-12V160a12,12,0,0,0-12-12H160a12,12,0,0,0-12,12v20H128a12,12,0,0,1-12-12V88a12,12,0,0,1,12-12h20V96A12,12,0,0,0,160,108ZM60,144a4,4,0,0,1-4,4H24a4,4,0,0,1-4-4V112a4,4,0,0,1,4-4H56a4,4,0,0,1,4,4Zm96,16a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4v48a4,4,0,0,1-4,4H160a4,4,0,0,1-4-4Zm0-112a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V96a4,4,0,0,1-4,4H160a4,4,0,0,1-4-4Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/UploadSimple.es.js
var a51 = __toESM(require("react"), 1);
var e46 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a51.createElement(a51.Fragment, null, /* @__PURE__ */ a51.createElement("path", { d: "M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0ZM96.49,80.49,116,61v83a12,12,0,0,0,24,0V61l19.51,19.52a12,12,0,1,0,17-17l-40-40a12,12,0,0,0-17,0l-40,40a12,12,0,1,0,17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a51.createElement(a51.Fragment, null, /* @__PURE__ */ a51.createElement(
      "path",
      {
        d: "M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a51.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a51.createElement(a51.Fragment, null, /* @__PURE__ */ a51.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM88,80h32v64a8,8,0,0,0,16,0V80h32a8,8,0,0,0,5.66-13.66l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,88,80Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a51.createElement(a51.Fragment, null, /* @__PURE__ */ a51.createElement("path", { d: "M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0ZM92.24,76.24,122,46.49V144a6,6,0,0,0,12,0V46.49l29.76,29.75a6,6,0,0,0,8.48-8.48l-40-40a6,6,0,0,0-8.48,0l-40,40a6,6,0,0,0,8.48,8.48Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a51.createElement(a51.Fragment, null, /* @__PURE__ */ a51.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a51.createElement(a51.Fragment, null, /* @__PURE__ */ a51.createElement("path", { d: "M220,144v64a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V144a4,4,0,0,1,8,0v60H212V144a4,4,0,0,1,8,0ZM90.83,74.83,124,41.66V144a4,4,0,0,0,8,0V41.66l33.17,33.17a4,4,0,1,0,5.66-5.66l-40-40a4,4,0,0,0-5.66,0l-40,40a4,4,0,0,0,5.66,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/UserCircle.es.js
var e47 = __toESM(require("react"), 1);
var a52 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e47.createElement(e47.Fragment, null, /* @__PURE__ */ e47.createElement("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e47.createElement(e47.Fragment, null, /* @__PURE__ */ e47.createElement(
      "path",
      {
        d: "M224,128a95.76,95.76,0,0,1-31.8,71.37A72,72,0,0,0,128,160a40,40,0,1,0-40-40,40,40,0,0,0,40,40,72,72,0,0,0-64.2,39.37h0A96,96,0,1,1,224,128Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e47.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e47.createElement(e47.Fragment, null, /* @__PURE__ */ e47.createElement("path", { d: "M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e47.createElement(e47.Fragment, null, /* @__PURE__ */ e47.createElement("path", { d: "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26ZM71.44,198a66,66,0,0,1,113.12,0,89.8,89.8,0,0,1-113.12,0ZM94,120a34,34,0,1,1,34,34A34,34,0,0,1,94,120Zm99.51,69.64a77.53,77.53,0,0,0-40-31.38,46,46,0,1,0-51,0,77.53,77.53,0,0,0-40,31.38,90,90,0,1,1,131,0Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e47.createElement(e47.Fragment, null, /* @__PURE__ */ e47.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e47.createElement(e47.Fragment, null, /* @__PURE__ */ e47.createElement("path", { d: "M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28ZM68.87,198.42a68,68,0,0,1,118.26,0,91.8,91.8,0,0,1-118.26,0Zm124.3-5.55a75.61,75.61,0,0,0-44.51-34,44,44,0,1,0-41.32,0,75.61,75.61,0,0,0-44.51,34,92,92,0,1,1,130.34,0ZM128,156a36,36,0,1,1,36-36A36,36,0,0,1,128,156Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Warning.es.js
var a53 = __toESM(require("react"), 1);
var e48 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a53.createElement(a53.Fragment, null, /* @__PURE__ */ a53.createElement("path", { d: "M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a53.createElement(a53.Fragment, null, /* @__PURE__ */ a53.createElement(
      "path",
      {
        d: "M215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22c6.3-11,22.52-11,28.82,0l87.46,151.87C236,202.79,228.08,216,215.46,216Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a53.createElement("path", { d: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a53.createElement(a53.Fragment, null, /* @__PURE__ */ a53.createElement("path", { d: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a53.createElement(a53.Fragment, null, /* @__PURE__ */ a53.createElement("path", { d: "M235.07,189.09,147.61,37.22h0a22.75,22.75,0,0,0-39.22,0L20.93,189.09a21.53,21.53,0,0,0,0,21.72A22.35,22.35,0,0,0,40.55,222h174.9a22.35,22.35,0,0,0,19.6-11.19A21.53,21.53,0,0,0,235.07,189.09ZM224.66,204.8a10.46,10.46,0,0,1-9.21,5.2H40.55a10.46,10.46,0,0,1-9.21-5.2,9.51,9.51,0,0,1,0-9.72L118.79,43.21a10.75,10.75,0,0,1,18.42,0l87.46,151.87A9.51,9.51,0,0,1,224.66,204.8ZM122,144V104a6,6,0,0,1,12,0v40a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,180Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a53.createElement(a53.Fragment, null, /* @__PURE__ */ a53.createElement("path", { d: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a53.createElement(a53.Fragment, null, /* @__PURE__ */ a53.createElement("path", { d: "M233.34,190.09,145.88,38.22h0a20.75,20.75,0,0,0-35.76,0L22.66,190.09a19.52,19.52,0,0,0,0,19.71A20.36,20.36,0,0,0,40.54,220H215.46a20.36,20.36,0,0,0,17.86-10.2A19.52,19.52,0,0,0,233.34,190.09ZM226.4,205.8a12.47,12.47,0,0,1-10.94,6.2H40.54a12.47,12.47,0,0,1-10.94-6.2,11.45,11.45,0,0,1,0-11.72L117.05,42.21a12.76,12.76,0,0,1,21.9,0L226.4,194.08A11.45,11.45,0,0,1,226.4,205.8ZM124,144V104a4,4,0,0,1,8,0v40a4,4,0,0,1-8,0Zm12,36a8,8,0,1,1-8-8A8,8,0,0,1,136,180Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/WarningCircle.es.js
var e49 = __toESM(require("react"), 1);
var a54 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e49.createElement(e49.Fragment, null, /* @__PURE__ */ e49.createElement("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e49.createElement(e49.Fragment, null, /* @__PURE__ */ e49.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ e49.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e49.createElement(e49.Fragment, null, /* @__PURE__ */ e49.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e49.createElement(e49.Fragment, null, /* @__PURE__ */ e49.createElement("path", { d: "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm-6-82V80a6,6,0,0,1,12,0v56a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,172Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e49.createElement(e49.Fragment, null, /* @__PURE__ */ e49.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e49.createElement(e49.Fragment, null, /* @__PURE__ */ e49.createElement("path", { d: "M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm-4-84V80a4,4,0,0,1,8,0v56a4,4,0,0,1-8,0Zm12,36a8,8,0,1,1-8-8A8,8,0,0,1,136,172Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/X.es.js
var e50 = __toESM(require("react"), 1);
var a55 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e50.createElement(e50.Fragment, null, /* @__PURE__ */ e50.createElement("path", { d: "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e50.createElement(e50.Fragment, null, /* @__PURE__ */ e50.createElement(
      "path",
      {
        d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e50.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e50.createElement(e50.Fragment, null, /* @__PURE__ */ e50.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e50.createElement(e50.Fragment, null, /* @__PURE__ */ e50.createElement("path", { d: "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e50.createElement(e50.Fragment, null, /* @__PURE__ */ e50.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e50.createElement(e50.Fragment, null, /* @__PURE__ */ e50.createElement("path", { d: "M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/lib/IconBase.es.js
var e51 = __toESM(require("react"), 1);

// node_modules/@phosphor-icons/react/dist/lib/context.es.js
var import_react = require("react");
var o = (0, import_react.createContext)({
  color: "currentColor",
  size: "1em",
  weight: "regular",
  mirrored: false
});

// node_modules/@phosphor-icons/react/dist/lib/IconBase.es.js
var p = e51.forwardRef(
  (s15, a65) => {
    const {
      alt: n18,
      color: r14,
      size: t10,
      weight: o47,
      mirrored: c8,
      children: i3,
      weights: m12,
      ...x2
    } = s15, {
      color: d = "currentColor",
      size: l8,
      weight: f2 = "regular",
      mirrored: g = false,
      ...w
    } = e51.useContext(o);
    return /* @__PURE__ */ e51.createElement(
      "svg",
      {
        ref: a65,
        xmlns: "http://www.w3.org/2000/svg",
        width: t10 != null ? t10 : l8,
        height: t10 != null ? t10 : l8,
        fill: r14 != null ? r14 : d,
        viewBox: "0 0 256 256",
        transform: c8 || g ? "scale(-1, 1)" : void 0,
        ...w,
        ...x2
      },
      !!n18 && /* @__PURE__ */ e51.createElement("title", null, n18),
      i3,
      m12.get(o47 != null ? o47 : f2)
    );
  }
);
p.displayName = "IconBase";

// node_modules/@phosphor-icons/react/dist/csr/Archive.es.js
var e52 = __toESM(require("react"), 1);
var o2 = e52.forwardRef((r14, c8) => /* @__PURE__ */ e52.createElement(p, { ref: c8, ...r14, weights: e }));
o2.displayName = "ArchiveIcon";
var s = o2;

// node_modules/@phosphor-icons/react/dist/csr/ArrowClockwise.es.js
var o3 = __toESM(require("react"), 1);
var r2 = o3.forwardRef((e93, c8) => /* @__PURE__ */ o3.createElement(p, { ref: c8, ...e93, weights: a2 }));
r2.displayName = "ArrowClockwiseIcon";
var m = r2;

// node_modules/@phosphor-icons/react/dist/csr/ArrowCounterClockwise.es.js
var o4 = __toESM(require("react"), 1);
var r3 = o4.forwardRef((e93, t10) => /* @__PURE__ */ o4.createElement(p, { ref: t10, ...e93, weights: e3 }));
r3.displayName = "ArrowCounterClockwiseIcon";
var i = r3;

// node_modules/@phosphor-icons/react/dist/csr/ArrowLeft.es.js
var o5 = __toESM(require("react"), 1);
var r4 = o5.forwardRef((e93, t10) => /* @__PURE__ */ o5.createElement(p, { ref: t10, ...e93, weights: a4 }));
r4.displayName = "ArrowLeftIcon";
var s2 = r4;

// node_modules/@phosphor-icons/react/dist/csr/ArrowRight.es.js
var o6 = __toESM(require("react"), 1);
var r5 = o6.forwardRef((t10, e93) => /* @__PURE__ */ o6.createElement(p, { ref: e93, ...t10, weights: a5 }));
r5.displayName = "ArrowRightIcon";
var s3 = r5;

// node_modules/@phosphor-icons/react/dist/csr/ArrowSquareOut.es.js
var r6 = __toESM(require("react"), 1);
var o7 = r6.forwardRef((e93, t10) => /* @__PURE__ */ r6.createElement(p, { ref: t10, ...e93, weights: e6 }));
o7.displayName = "ArrowSquareOutIcon";
var n = o7;

// node_modules/@phosphor-icons/react/dist/csr/ArrowUpRight.es.js
var o8 = __toESM(require("react"), 1);
var r7 = o8.forwardRef((t10, e93) => /* @__PURE__ */ o8.createElement(p, { ref: e93, ...t10, weights: a7 }));
r7.displayName = "ArrowUpRightIcon";
var c = r7;

// node_modules/@phosphor-icons/react/dist/csr/ArrowsOutLineHorizontal.es.js
var o9 = __toESM(require("react"), 1);
var r8 = o9.forwardRef((t10, e93) => /* @__PURE__ */ o9.createElement(p, { ref: e93, ...t10, weights: e8 }));
r8.displayName = "ArrowsOutLineHorizontalIcon";
var m2 = r8;

// node_modules/@phosphor-icons/react/dist/csr/Books.es.js
var o10 = __toESM(require("react"), 1);
var e53 = o10.forwardRef((r14, s15) => /* @__PURE__ */ o10.createElement(p, { ref: s15, ...r14, weights: e9 }));
e53.displayName = "BooksIcon";
var n2 = e53;

// node_modules/@phosphor-icons/react/dist/csr/CalendarBlank.es.js
var a56 = __toESM(require("react"), 1);
var e54 = a56.forwardRef((o47, r14) => /* @__PURE__ */ a56.createElement(p, { ref: r14, ...o47, weights: e10 }));
e54.displayName = "CalendarBlankIcon";
var c2 = e54;

// node_modules/@phosphor-icons/react/dist/csr/CalendarCheck.es.js
var e55 = __toESM(require("react"), 1);
var a57 = e55.forwardRef((o47, r14) => /* @__PURE__ */ e55.createElement(p, { ref: r14, ...o47, weights: V }));
a57.displayName = "CalendarCheckIcon";
var s4 = a57;

// node_modules/@phosphor-icons/react/dist/csr/CaretDown.es.js
var o11 = __toESM(require("react"), 1);
var e56 = o11.forwardRef((r14, t10) => /* @__PURE__ */ o11.createElement(p, { ref: t10, ...r14, weights: t }));
e56.displayName = "CaretDownIcon";
var s5 = e56;

// node_modules/@phosphor-icons/react/dist/csr/ChatCircleDots.es.js
var o12 = __toESM(require("react"), 1);
var t3 = o12.forwardRef((e93, r14) => /* @__PURE__ */ o12.createElement(p, { ref: r14, ...e93, weights: e12 }));
t3.displayName = "ChatCircleDotsIcon";
var m3 = t3;

// node_modules/@phosphor-icons/react/dist/csr/ChatCircleText.es.js
var e57 = __toESM(require("react"), 1);
var t4 = e57.forwardRef((o47, r14) => /* @__PURE__ */ e57.createElement(p, { ref: r14, ...o47, weights: e13 }));
t4.displayName = "ChatCircleTextIcon";
var s6 = t4;

// node_modules/@phosphor-icons/react/dist/csr/ChatsCircle.es.js
var e58 = __toESM(require("react"), 1);
var o13 = e58.forwardRef((r14, t10) => /* @__PURE__ */ e58.createElement(p, { ref: t10, ...r14, weights: e14 }));
o13.displayName = "ChatsCircleIcon";
var m4 = o13;

// node_modules/@phosphor-icons/react/dist/csr/Check.es.js
var e59 = __toESM(require("react"), 1);
var o14 = e59.forwardRef((c8, r14) => /* @__PURE__ */ e59.createElement(p, { ref: r14, ...c8, weights: a15 }));
o14.displayName = "CheckIcon";
var n3 = o14;

// node_modules/@phosphor-icons/react/dist/csr/CheckCircle.es.js
var e60 = __toESM(require("react"), 1);
var c3 = e60.forwardRef((o47, r14) => /* @__PURE__ */ e60.createElement(p, { ref: r14, ...o47, weights: a16 }));
c3.displayName = "CheckCircleIcon";
var s7 = c3;

// node_modules/@phosphor-icons/react/dist/csr/ClipboardText.es.js
var o15 = __toESM(require("react"), 1);
var e61 = o15.forwardRef((r14, t10) => /* @__PURE__ */ o15.createElement(p, { ref: t10, ...r14, weights: e17 }));
e61.displayName = "ClipboardTextIcon";
var c4 = e61;

// node_modules/@phosphor-icons/react/dist/csr/ClockCountdown.es.js
var o16 = __toESM(require("react"), 1);
var t5 = o16.forwardRef((n18, c8) => /* @__PURE__ */ o16.createElement(p, { ref: c8, ...n18, weights: e18 }));
t5.displayName = "ClockCountdownIcon";
var s8 = t5;

// node_modules/@phosphor-icons/react/dist/csr/Copy.es.js
var o17 = __toESM(require("react"), 1);
var e62 = o17.forwardRef((r14, t10) => /* @__PURE__ */ o17.createElement(p, { ref: t10, ...r14, weights: e19 }));
e62.displayName = "CopyIcon";
var s9 = e62;

// node_modules/@phosphor-icons/react/dist/csr/Database.es.js
var a58 = __toESM(require("react"), 1);
var e63 = a58.forwardRef((o47, t10) => /* @__PURE__ */ a58.createElement(p, { ref: t10, ...o47, weights: t2 }));
e63.displayName = "DatabaseIcon";
var n4 = e63;

// node_modules/@phosphor-icons/react/dist/csr/DownloadSimple.es.js
var o18 = __toESM(require("react"), 1);
var e64 = o18.forwardRef((a65, m12) => /* @__PURE__ */ o18.createElement(p, { ref: m12, ...a65, weights: e21 }));
e64.displayName = "DownloadSimpleIcon";
var l6 = e64;

// node_modules/@phosphor-icons/react/dist/csr/Eye.es.js
var e65 = __toESM(require("react"), 1);
var o19 = e65.forwardRef((r14, t10) => /* @__PURE__ */ e65.createElement(p, { ref: t10, ...r14, weights: a21 }));
o19.displayName = "EyeIcon";
var n5 = o19;

// node_modules/@phosphor-icons/react/dist/csr/File.es.js
var e66 = __toESM(require("react"), 1);
var o20 = e66.forwardRef((r14, t10) => /* @__PURE__ */ e66.createElement(p, { ref: t10, ...r14, weights: a22 }));
o20.displayName = "FileIcon";
var s10 = o20;

// node_modules/@phosphor-icons/react/dist/csr/FileText.es.js
var e67 = __toESM(require("react"), 1);
var o21 = e67.forwardRef((t10, r14) => /* @__PURE__ */ e67.createElement(p, { ref: r14, ...t10, weights: e24 }));
o21.displayName = "FileTextIcon";
var s11 = o21;

// node_modules/@phosphor-icons/react/dist/csr/FolderOpen.es.js
var o22 = __toESM(require("react"), 1);
var e68 = o22.forwardRef((r14, n18) => /* @__PURE__ */ o22.createElement(p, { ref: n18, ...r14, weights: e25 }));
e68.displayName = "FolderOpenIcon";
var m5 = e68;

// node_modules/@phosphor-icons/react/dist/csr/GearSix.es.js
var e69 = __toESM(require("react"), 1);
var o23 = e69.forwardRef((r14, a65) => /* @__PURE__ */ e69.createElement(p, { ref: a65, ...r14, weights: l }));
o23.displayName = "GearSixIcon";
var s12 = o23;

// node_modules/@phosphor-icons/react/dist/csr/House.es.js
var o24 = __toESM(require("react"), 1);
var e70 = o24.forwardRef((r14, s15) => /* @__PURE__ */ o24.createElement(p, { ref: s15, ...r14, weights: e26 }));
e70.displayName = "HouseIcon";
var n6 = e70;

// node_modules/@phosphor-icons/react/dist/csr/Image.es.js
var e71 = __toESM(require("react"), 1);
var o25 = e71.forwardRef((a65, m12) => /* @__PURE__ */ e71.createElement(p, { ref: m12, ...a65, weights: e27 }));
o25.displayName = "ImageIcon";
var I = o25;

// node_modules/@phosphor-icons/react/dist/csr/ImageSquare.es.js
var e72 = __toESM(require("react"), 1);
var a59 = e72.forwardRef((o47, r14) => /* @__PURE__ */ e72.createElement(p, { ref: r14, ...o47, weights: e28 }));
a59.displayName = "ImageSquareIcon";
var I2 = a59;

// node_modules/@phosphor-icons/react/dist/csr/Info.es.js
var o26 = __toESM(require("react"), 1);
var e73 = o26.forwardRef((r14, t10) => /* @__PURE__ */ o26.createElement(p, { ref: t10, ...r14, weights: a29 }));
e73.displayName = "InfoIcon";
var c5 = e73;

// node_modules/@phosphor-icons/react/dist/csr/Key.es.js
var e74 = __toESM(require("react"), 1);
var o27 = e74.forwardRef((r14, t10) => /* @__PURE__ */ e74.createElement(p, { ref: t10, ...r14, weights: e30 }));
o27.displayName = "KeyIcon";
var n7 = o27;

// node_modules/@phosphor-icons/react/dist/csr/LinkSimple.es.js
var e75 = __toESM(require("react"), 1);
var o28 = e75.forwardRef((i3, m12) => /* @__PURE__ */ e75.createElement(p, { ref: m12, ...i3, weights: l2 }));
o28.displayName = "LinkSimpleIcon";
var p2 = o28;

// node_modules/@phosphor-icons/react/dist/csr/List.es.js
var o29 = __toESM(require("react"), 1);
var t6 = o29.forwardRef((e93, r14) => /* @__PURE__ */ o29.createElement(p, { ref: r14, ...e93, weights: e31 }));
t6.displayName = "ListIcon";
var c6 = t6;

// node_modules/@phosphor-icons/react/dist/csr/ListBullets.es.js
var t7 = __toESM(require("react"), 1);
var e76 = t7.forwardRef((o47, s15) => /* @__PURE__ */ t7.createElement(p, { ref: s15, ...o47, weights: e32 }));
e76.displayName = "ListBulletsIcon";
var m6 = e76;

// node_modules/@phosphor-icons/react/dist/csr/MagnifyingGlass.es.js
var a60 = __toESM(require("react"), 1);
var o30 = a60.forwardRef((s15, n18) => /* @__PURE__ */ a60.createElement(p, { ref: n18, ...s15, weights: a34 }));
o30.displayName = "MagnifyingGlassIcon";
var f = o30;

// node_modules/@phosphor-icons/react/dist/csr/Note.es.js
var o31 = __toESM(require("react"), 1);
var e77 = o31.forwardRef((t10, r14) => /* @__PURE__ */ o31.createElement(p, { ref: r14, ...t10, weights: e34 }));
e77.displayName = "NoteIcon";
var n8 = e77;

// node_modules/@phosphor-icons/react/dist/csr/Package.es.js
var a61 = __toESM(require("react"), 1);
var e78 = a61.forwardRef((o47, c8) => /* @__PURE__ */ a61.createElement(p, { ref: c8, ...o47, weights: a36 }));
e78.displayName = "PackageIcon";
var n9 = e78;

// node_modules/@phosphor-icons/react/dist/csr/PaperPlaneTilt.es.js
var e79 = __toESM(require("react"), 1);
var a62 = e79.forwardRef((o47, r14) => /* @__PURE__ */ e79.createElement(p, { ref: r14, ...o47, weights: e35 }));
a62.displayName = "PaperPlaneTiltIcon";
var m7 = a62;

// node_modules/@phosphor-icons/react/dist/csr/Paperclip.es.js
var e80 = __toESM(require("react"), 1);
var o32 = e80.forwardRef((r14, a65) => /* @__PURE__ */ e80.createElement(p, { ref: a65, ...r14, weights: e36 }));
o32.displayName = "PaperclipIcon";
var m8 = o32;

// node_modules/@phosphor-icons/react/dist/csr/Pause.es.js
var e81 = __toESM(require("react"), 1);
var o33 = e81.forwardRef((a65, r14) => /* @__PURE__ */ e81.createElement(p, { ref: r14, ...a65, weights: e37 }));
o33.displayName = "PauseIcon";
var n10 = o33;

// node_modules/@phosphor-icons/react/dist/csr/PencilSimple.es.js
var e82 = __toESM(require("react"), 1);
var o34 = e82.forwardRef((i3, m12) => /* @__PURE__ */ e82.createElement(p, { ref: m12, ...i3, weights: e38 }));
o34.displayName = "PencilSimpleIcon";
var a63 = o34;

// node_modules/@phosphor-icons/react/dist/csr/Play.es.js
var o35 = __toESM(require("react"), 1);
var a64 = o35.forwardRef((e93, r14) => /* @__PURE__ */ o35.createElement(p, { ref: r14, ...e93, weights: a41 }));
a64.displayName = "PlayIcon";
var n11 = a64;

// node_modules/@phosphor-icons/react/dist/csr/Plug.es.js
var o36 = __toESM(require("react"), 1);
var e83 = o36.forwardRef((r14, t10) => /* @__PURE__ */ o36.createElement(p, { ref: t10, ...r14, weights: l4 }));
e83.displayName = "PlugIcon";
var n12 = e83;

// node_modules/@phosphor-icons/react/dist/csr/Plus.es.js
var o37 = __toESM(require("react"), 1);
var e84 = o37.forwardRef((r14, s15) => /* @__PURE__ */ o37.createElement(p, { ref: s15, ...r14, weights: a43 }));
e84.displayName = "PlusIcon";
var n13 = e84;

// node_modules/@phosphor-icons/react/dist/csr/Robot.es.js
var o38 = __toESM(require("react"), 1);
var t8 = o38.forwardRef((e93, r14) => /* @__PURE__ */ o38.createElement(p, { ref: r14, ...e93, weights: e41 }));
t8.displayName = "RobotIcon";
var n14 = t8;

// node_modules/@phosphor-icons/react/dist/csr/ShieldCheck.es.js
var e85 = __toESM(require("react"), 1);
var o39 = e85.forwardRef((c8, r14) => /* @__PURE__ */ e85.createElement(p, { ref: r14, ...c8, weights: e42 }));
o39.displayName = "ShieldCheckIcon";
var h = o39;

// node_modules/@phosphor-icons/react/dist/csr/Sparkle.es.js
var e86 = __toESM(require("react"), 1);
var o40 = e86.forwardRef((r14, a65) => /* @__PURE__ */ e86.createElement(p, { ref: a65, ...r14, weights: l5 }));
o40.displayName = "SparkleIcon";
var s13 = o40;

// node_modules/@phosphor-icons/react/dist/csr/SpinnerGap.es.js
var e87 = __toESM(require("react"), 1);
var o41 = e87.forwardRef((r14, n18) => /* @__PURE__ */ e87.createElement(p, { ref: n18, ...r14, weights: e43 }));
o41.displayName = "SpinnerGapIcon";
var m9 = o41;

// node_modules/@phosphor-icons/react/dist/csr/Stop.es.js
var o42 = __toESM(require("react"), 1);
var t9 = o42.forwardRef((e93, r14) => /* @__PURE__ */ o42.createElement(p, { ref: r14, ...e93, weights: a48 }));
t9.displayName = "StopIcon";
var s14 = t9;

// node_modules/@phosphor-icons/react/dist/csr/Trash.es.js
var o43 = __toESM(require("react"), 1);
var r9 = o43.forwardRef((a65, e93) => /* @__PURE__ */ o43.createElement(p, { ref: e93, ...a65, weights: e45 }));
r9.displayName = "TrashIcon";
var n15 = r9;

// node_modules/@phosphor-icons/react/dist/csr/TreeStructure.es.js
var e88 = __toESM(require("react"), 1);
var r10 = e88.forwardRef((t10, o47) => /* @__PURE__ */ e88.createElement(p, { ref: o47, ...t10, weights: H }));
r10.displayName = "TreeStructureIcon";
var n16 = r10;

// node_modules/@phosphor-icons/react/dist/csr/UploadSimple.es.js
var o44 = __toESM(require("react"), 1);
var e89 = o44.forwardRef((a65, m12) => /* @__PURE__ */ o44.createElement(p, { ref: m12, ...a65, weights: e46 }));
e89.displayName = "UploadSimpleIcon";
var l7 = e89;

// node_modules/@phosphor-icons/react/dist/csr/UserCircle.es.js
var e90 = __toESM(require("react"), 1);
var r11 = e90.forwardRef((o47, c8) => /* @__PURE__ */ e90.createElement(p, { ref: c8, ...o47, weights: a52 }));
r11.displayName = "UserCircleIcon";
var m10 = r11;

// node_modules/@phosphor-icons/react/dist/csr/Warning.es.js
var o45 = __toESM(require("react"), 1);
var r12 = o45.forwardRef((n18, a65) => /* @__PURE__ */ o45.createElement(p, { ref: a65, ...n18, weights: e48 }));
r12.displayName = "WarningIcon";
var c7 = r12;

// node_modules/@phosphor-icons/react/dist/csr/WarningCircle.es.js
var r13 = __toESM(require("react"), 1);
var e91 = r13.forwardRef((o47, n18) => /* @__PURE__ */ r13.createElement(p, { ref: n18, ...o47, weights: a54 }));
e91.displayName = "WarningCircleIcon";
var m11 = e91;

// node_modules/@phosphor-icons/react/dist/csr/X.es.js
var o46 = __toESM(require("react"), 1);
var e92 = o46.forwardRef((r14, t10) => /* @__PURE__ */ o46.createElement(p, { ref: t10, ...r14, weights: a55 }));
e92.displayName = "XIcon";
var n17 = e92;

// src/client/ProjectHome.js
var import_react7 = __toESM(require("react"), 1);

// src/client/icons.js
var import_react2 = __toESM(require("react"), 1);
function Icon(props) {
  const size = props.size || 14;
  return import_react2.default.createElement(
    "svg",
    { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true },
    import_react2.default.createElement("path", { d: props.d })
  );
}
var ICONS = {
  grid: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  check: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z",
  x: "M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z",
  bolt: "M11 21h-1l1-7H7.5c-.58 0-1.05-.63-.74-1.18L11.5 3h1l-1 7h3.5c.58 0 1.05.63.74 1.18L11 21z",
  book: "M4 6H2v14c0 1.1.9 2 2 2h16v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H10v-2h10v2zm0-4H10v-2h10v2zm0-4H10V4h10v2z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.59 4.24 2.47-.78 1.33L11 13.5V7h2z",
  chart: "M5 9h4v11H5zM10 4h4v16h-4zM15 13h4v7h-4z",
  warn: "M12 2 1 21h22L12 2zm1 15h-2v2h2v-2zm0-6h-2v4h2v-4z",
  refresh: "M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24L13 11h7V4l-2.35 2.35z",
  sliders: "M4 7h8v2H4V7zm10 0h6v2h-6V7zM8 15h12v2H8v-2zM4 15h2v2H4v-2z",
  upload: "M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z",
  search: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z",
  link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  doc: "M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z",
  folder: "M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z",
  db: "M12 2C8.13 2 5 4.69 5 8c0 3.31 3.13 6 7 6s7-2.69 7-6c0-3.31-3.13-6-7-6zm0 10c-2.48 0-4.5-1.79-4.5-4S9.52 4 12 4s4.5 1.79 4.5 4-2.02 4-4.5 4zm0 1c-3.87 0-7 1.34-7 3v2h14v-2c0-1.66-3.13-3-7-3z"
};
function glyph(d, size) {
  return import_react2.default.createElement(Icon, { d, size: size || 14 });
}
function Badge(props) {
  return import_react2.default.createElement("span", { className: "cpwb-badge cpwb-badge-" + props.kind }, props.children);
}
function Empty(props) {
  return import_react2.default.createElement(
    "div",
    { className: "cpwb-empty" },
    import_react2.default.createElement("span", { className: "cpwb-glyph" }, props.glyph),
    props.children
  );
}

// src/client/ContainerDeleteDialog.js
var import_react5 = __toESM(require("react"), 1);

// src/client/globalModal.js
var import_react4 = __toESM(require("react"), 1);

// src/client/responsive.js
var import_react3 = __toESM(require("react"), 1);
var MOBILE_MAX = 899;
var DESKTOP_MIN = 1280;
function layoutModeForWidth(width) {
  const value = Number(width) || 0;
  if (value <= MOBILE_MAX) return "mobile";
  if (value < DESKTOP_MIN) return "tablet";
  return "desktop";
}
function nextDrawerOwner(current, requested) {
  if (requested == null || current === requested) return null;
  return requested;
}
function subscribeViewport(listener) {
  if (typeof window === "undefined") return function() {
  };
  window.addEventListener("resize", listener);
  return function() {
    window.removeEventListener("resize", listener);
  };
}
function viewportSnapshot() {
  return layoutModeForWidth(typeof window === "undefined" ? DESKTOP_MIN : window.innerWidth);
}
function useWorkbenchLayoutMode(override) {
  const observed = import_react3.default.useSyncExternalStore(subscribeViewport, viewportSnapshot, () => "desktop");
  return override || observed;
}
function activateDrawerDialog(dialog, restoreTarget) {
  if (!dialog) return function() {
  };
  try {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute?.("open", "");
  } catch {
    dialog.setAttribute?.("open", "");
  }
  dialog.querySelector?.("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")?.focus?.();
  return function() {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute?.("open");
    restoreTarget?.focus?.();
  };
}
function handleDrawerCancel(event, onClose) {
  event.preventDefault();
  onClose?.();
}
function DrawerDialog({ open, onClose, label, side, triggerRef, children }) {
  const dialogRef = import_react3.default.useRef(null);
  import_react3.default.useEffect(function() {
    if (!open) return void 0;
    const dialog = dialogRef.current;
    if (!dialog) return void 0;
    const restoreTarget = triggerRef?.current || document.activeElement;
    return activateDrawerDialog(dialog, restoreTarget);
  }, [open, triggerRef]);
  if (!open) return null;
  return import_react3.default.createElement("dialog", {
    ref: dialogRef,
    className: "cpwb-responsive-drawer cpwb-drawer-" + side,
    role: "dialog",
    "aria-label": label,
    "aria-modal": "true",
    "data-open": "true",
    onCancel(event) {
      handleDrawerCancel(event, onClose);
    },
    onClick(event) {
      if (event.target === event.currentTarget) onClose?.();
    }
  }, children);
}

// src/client/globalModal.js
function GlobalModal({ children, onClose, labelledBy, className = "" }) {
  const dialogRef = import_react4.default.useRef(null);
  const restoreTargetRef = import_react4.default.useRef(typeof document === "undefined" ? null : document.activeElement);
  import_react4.default.useEffect(function() {
    return activateDrawerDialog(dialogRef.current, restoreTargetRef.current);
  }, []);
  return import_react4.default.createElement("dialog", {
    ref: dialogRef,
    className: "cpwb-page-modal-host" + (className ? " " + className : ""),
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": labelledBy,
    onCancel(event) {
      handleDrawerCancel(event, onClose);
    },
    onClick(event) {
      if (event.target === event.currentTarget) onClose?.();
    }
  }, children);
}

// src/client/ContainerDeleteDialog.js
var COPY = {
  project: {
    kicker: "PROJECT / DELETE",
    noun: "\u9879\u76EE",
    relation: "\u5173\u8054\u77E5\u8BC6\u5E93",
    cleanup: "\u5F85\u529E\u3001\u5B9A\u65F6\u4EFB\u52A1\u3001\u6BCF\u65E5\u603B\u7ED3\u548C\u9879\u76EE\u5173\u7CFB\u4F1A\u5220\u9664\uFF1B\u78C1\u76D8\u76EE\u5F55\u4E0E DSH workspace \u4E0D\u4F1A\u5220\u9664\u3002"
  },
  knowledge_base: {
    kicker: "KNOWLEDGE / DELETE",
    noun: "\u77E5\u8BC6\u82AF\u7247",
    relation: "\u5173\u8054\u9879\u76EE",
    cleanup: "\u77E5\u8BC6\u82AF\u7247\u81EA\u6709\u6587\u6863\u526F\u672C\u3001\u89E3\u6790\u5757\u548C\u5411\u91CF\u4F1A\u5220\u9664\uFF1B\u5916\u90E8\u539F\u6587\u4EF6\u4E0E\u672C\u5730 embedding \u6A21\u578B\u4E0D\u4F1A\u5220\u9664\u3002"
  }
};
function ContainerDeleteDialog({
  kind,
  target,
  store: store3,
  initialPlan = null,
  initialPolicy = "detach",
  initialConfirmation = "",
  initialStep = "policy",
  initialRestartConfirmed = false,
  onClose,
  onDeleted
}) {
  const copy = COPY[kind];
  const [plan, setPlan] = import_react5.default.useState(initialPlan);
  const [policy, setPolicy] = import_react5.default.useState(initialPolicy);
  const [confirmation, setConfirmation] = import_react5.default.useState(initialConfirmation);
  const [step, setStep] = import_react5.default.useState(initialStep);
  const [restartConfirmed, setRestartConfirmed] = import_react5.default.useState(initialRestartConfirmed);
  const [error, setError] = import_react5.default.useState(null);
  const nameInputRef = import_react5.default.useRef(null);
  const state = import_react5.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const actionType = policy === "delete" ? "startContainerPurge" : kind === "project" ? "deleteProject" : "deleteKnowledgeBase";
  const deleting = state.action?.type === actionType && state.action.status === "running";
  import_react5.default.useEffect(function() {
    if (initialPlan) return;
    let current = true;
    const load = kind === "project" ? store3.actions.loadProjectDeletionPlan(target.id) : store3.actions.loadKnowledgeBaseDeletionPlan(target.id);
    load.then((value) => {
      if (current) setPlan(value);
    }).catch((cause) => {
      if (current) setError(cause);
    });
    return function() {
      current = false;
    };
  }, [initialPlan, kind, store3, target.id]);
  const permanentDeletion = plan?.permanentDeletion ?? {
    available: plan?.permanentDeletionAvailable === true,
    requiresRestart: true,
    backend: null,
    reason: plan?.permanentDeletionAvailable === false ? "\u6C38\u4E45\u5220\u9664\u9700\u8981 dsh-workbench \u76D1\u7BA1\u542F\u52A8\u6A21\u5F0F" : null
  };
  const deleteUnavailable = policy === "delete" && permanentDeletion.available !== true;
  const nameConfirmed = policy !== "delete" || confirmation === target.name;
  const canContinue = !!plan && !deleting && !deleteUnavailable && nameConfirmed && !!plan.planVersion;
  const canSubmit = policy === "detach" ? !!plan && !deleting : canContinue && restartConfirmed;
  const submit = async function() {
    if (!canSubmit) return;
    setError(null);
    try {
      if (policy === "delete") {
        await store3.actions.startContainerPurge({
          kind,
          id: target.id,
          planVersion: plan.planVersion,
          confirmation,
          restartConfirmed: true
        });
        onClose();
        return;
      }
      const operation = kind === "project" ? store3.actions.deleteProject({ id: target.id, sessionPolicy: "detach" }) : store3.actions.deleteKnowledgeBase({ id: target.id, sessionPolicy: "detach" });
      await operation;
      onDeleted?.();
      onClose();
    } catch (cause) {
      setError(cause);
    }
  };
  const returnToPolicy = function() {
    setStep("policy");
    setRestartConfirmed(false);
    if (typeof window !== "undefined") {
      window.setTimeout(() => nameInputRef.current?.focus?.(), 0);
    }
  };
  const primaryAction = step === "policy" && policy === "delete" ? import_react5.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: !canContinue, onClick: () => setStep("restart") }, "\u7EE7\u7EED\u786E\u8BA4") : import_react5.default.createElement("button", { type: "button", className: policy === "delete" ? "cpwb-btn cpwb-btn-danger" : "cpwb-btn cpwb-btn-primary", disabled: !canSubmit, onClick: submit }, deleting ? "\u5904\u7406\u4E2D\u2026" : policy === "delete" ? "\u6C38\u4E45\u5220\u9664\u5E76\u91CD\u542F" : "\u5220\u9664\u5E76\u4FDD\u7559\u4F1A\u8BDD");
  return import_react5.default.createElement(
    GlobalModal,
    { onClose: deleting ? void 0 : onClose, labelledBy: "cpwb-container-delete-title" },
    import_react5.default.createElement(
      "section",
      { className: "cpwb-modal cpwb-container-delete-modal" },
      import_react5.default.createElement("div", { className: "cpwb-modal-kicker" }, copy.kicker),
      import_react5.default.createElement("h3", { id: "cpwb-container-delete-title" }, step === "restart" ? "\u786E\u8BA4\u91CD\u542F\u5E76\u6C38\u4E45\u5220\u9664" : "\u5220\u9664" + copy.noun + "\u300C" + target.name + "\u300D"),
      plan ? import_react5.default.createElement(
        "div",
        { className: "cpwb-delete-impact", "aria-label": "\u5220\u9664\u5F71\u54CD\u8303\u56F4" },
        import_react5.default.createElement("span", null, import_react5.default.createElement("b", null, plan.sessionCount), " \u4E2A\u4F1A\u8BDD"),
        import_react5.default.createElement("span", null, import_react5.default.createElement("b", null, plan.relationshipCount), " \u4E2A" + copy.relation),
        import_react5.default.createElement("span", null, import_react5.default.createElement("b", null, plan.documentCount), " \u4E2A\u6587\u6863"),
        import_react5.default.createElement("span", null, import_react5.default.createElement("b", null, plan.orphanDocumentCount), " \u4E2A\u72EC\u5360\u7D22\u5F15")
      ) : import_react5.default.createElement("div", { className: "cpwb-delete-loading", role: "status" }, "\u6B63\u5728\u6838\u5BF9\u4F1A\u8BDD\u3001\u5173\u7CFB\u4E0E\u7D22\u5F15\u2026"),
      step === "policy" ? import_react5.default.createElement(
        import_react5.default.Fragment,
        null,
        import_react5.default.createElement(
          "div",
          { className: "cpwb-delete-policy", role: "radiogroup", "aria-label": "\u4F1A\u8BDD\u5904\u7406\u65B9\u5F0F" },
          import_react5.default.createElement(
            "label",
            { className: policy === "detach" ? "cpwb-selected" : "" },
            import_react5.default.createElement("input", { type: "radio", name: "session-policy", value: "detach", checked: policy === "detach", onChange: () => setPolicy("detach") }),
            import_react5.default.createElement(m2, { size: 20, "aria-hidden": true }),
            import_react5.default.createElement("span", null, import_react5.default.createElement("strong", null, "\u4FDD\u7559\u4F1A\u8BDD\u5E76\u79FB\u4E3A\u72EC\u7ACB\u4F1A\u8BDD", import_react5.default.createElement("em", null, "\u63A8\u8350")), import_react5.default.createElement("small", null, "\u79FB\u9664\u5BB9\u5668\u7EE7\u627F\u7684\u4E0A\u4E0B\u6587\uFF0C\u4ECD\u7136\u6709\u6548\u7684\u624B\u52A8\u56FA\u5B9A\u6765\u6E90\u4F1A\u4FDD\u7559\u3002"))
          ),
          import_react5.default.createElement(
            "label",
            { className: policy === "delete" ? "cpwb-selected cpwb-danger-choice" : "cpwb-danger-choice" },
            import_react5.default.createElement("input", { type: "radio", name: "session-policy", value: "delete", checked: policy === "delete", onChange: () => setPolicy("delete") }),
            import_react5.default.createElement(n15, { size: 20, "aria-hidden": true }),
            import_react5.default.createElement("span", null, import_react5.default.createElement("strong", null, "\u6C38\u4E45\u5220\u9664\u6240\u5C5E\u4F1A\u8BDD"), import_react5.default.createElement("small", null, "\u540C\u65F6\u5220\u9664 Workbench \u6295\u5F71\u3001\u4E0A\u4E0B\u6587\u8BB0\u5F55\u3001\u6D88\u606F\u7D22\u5F15\u548C DSH \u539F\u751F\u4F1A\u8BDD\u3002"))
          )
        ),
        policy === "delete" ? import_react5.default.createElement(
          "div",
          { className: "cpwb-delete-confirm-zone" },
          deleteUnavailable ? import_react5.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, import_react5.default.createElement(c7, { size: 15 }), " ", permanentDeletion.reason || "\u5F53\u524D\u5B58\u50A8\u540E\u7AEF\u65E0\u6CD5\u5B89\u5168\u6267\u884C\u6C38\u4E45\u5220\u9664\u3002") : null,
          import_react5.default.createElement("label", null, "\u8F93\u5165\u5B8C\u6574\u540D\u79F0\u786E\u8BA4\u6C38\u4E45\u5220\u9664", import_react5.default.createElement("input", { ref: nameInputRef, value: confirmation, onChange: (event) => setConfirmation(event.target.value), placeholder: target.name, autoComplete: "off" }))
        ) : null,
        import_react5.default.createElement("div", { className: "cpwb-danger-confirm" }, import_react5.default.createElement("span", null, copy.cleanup))
      ) : import_react5.default.createElement(
        "div",
        { className: "cpwb-restart-confirmation" },
        import_react5.default.createElement(
          "div",
          { className: "cpwb-restart-target" },
          import_react5.default.createElement("span", null, "TARGET / FROZEN PLAN"),
          import_react5.default.createElement("strong", null, target.name),
          import_react5.default.createElement("small", null, (plan?.sessionCount || 0) + " \u4E2A\u4E3B\u4F1A\u8BDD \xB7 " + (plan?.descendantSessionCount || 0) + " \u4E2A Subagent \u540E\u4EE3")
        ),
        import_react5.default.createElement(
          "div",
          { className: "cpwb-restart-notice" },
          import_react5.default.createElement(c7, { size: 22, "aria-hidden": true }),
          import_react5.default.createElement(
            "span",
            null,
            import_react5.default.createElement("strong", null, "Workbench \u5C06\u81EA\u52A8\u505C\u6B62\u5E76\u91CD\u542F"),
            import_react5.default.createElement("small", null, "\u9875\u9762\u4F1A\u77ED\u6682\u65AD\u5F00\uFF0C\u901A\u5E38\u9700\u8981 3 \u81F3 10 \u79D2\uFF0C\u5B9E\u9645\u65F6\u95F4\u53D6\u51B3\u4E8E\u672C\u5730\u6570\u636E\u91CF\u548C\u542F\u52A8\u901F\u5EA6\u3002\u670D\u52A1\u6062\u590D\u540E\u9875\u9762\u4F1A\u81EA\u52A8\u91CD\u65B0\u8FDE\u63A5\uFF0C\u4E0D\u9700\u8981\u624B\u5DE5\u5237\u65B0\u3002")
          )
        ),
        import_react5.default.createElement(
          "ul",
          { className: "cpwb-restart-guarantees" },
          import_react5.default.createElement("li", null, "\u5220\u9664\u5931\u8D25\u65F6\u4F1A\u81EA\u52A8\u6062\u590D\u4E8B\u52A1\u5907\u4EFD\u5E76\u91CD\u65B0\u542F\u52A8\u3002"),
          import_react5.default.createElement("li", null, "\u5982\u679C\u81EA\u52A8\u6062\u590D\u4ECD\u672A\u542F\u52A8\uFF0C\u4E0B\u6B21\u8FD0\u884C\u540C\u4E00\u6761 dsh-workbench \u547D\u4EE4\u4F1A\u4F18\u5148\u5B8C\u6210\u6062\u590D\u3002"),
          import_react5.default.createElement("li", null, "\u9879\u76EE\u76EE\u5F55\u3001\u77E5\u8BC6\u82AF\u7247\u5916\u90E8\u539F\u6587\u4EF6\u548C\u672C\u5730\u6A21\u578B\u4E0D\u4F1A\u5220\u9664\u3002")
        ),
        import_react5.default.createElement(
          "label",
          { className: "cpwb-restart-checkbox" },
          import_react5.default.createElement("input", { type: "checkbox", checked: restartConfirmed, onChange: (event) => setRestartConfirmed(event.target.checked) }),
          import_react5.default.createElement("span", null, "\u6211\u5DF2\u4E86\u89E3 Workbench \u5C06\u81EA\u52A8\u91CD\u542F")
        )
      ),
      error ? import_react5.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, error.message || String(error)) : null,
      import_react5.default.createElement(
        "div",
        { className: "cpwb-modal-actions" },
        import_react5.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: deleting, onClick: step === "restart" ? returnToPolicy : onClose }, step === "restart" ? "\u8FD4\u56DE\u4FEE\u6539" : "\u53D6\u6D88"),
        primaryAction
      )
    )
  );
}

// src/client/ProjectHome.js
var homeOpen = true;
var homeListeners = /* @__PURE__ */ new Set();
function useHomeOpen() {
  return import_react7.default.useSyncExternalStore(
    function subscribe(listener) {
      homeListeners.add(listener);
      return function() {
        homeListeners.delete(listener);
      };
    },
    function snapshot() {
      return homeOpen;
    },
    function serverSnapshot() {
      return homeOpen;
    }
  );
}
function shortPath(value) {
  if (!value) return "\u672A\u7ED1\u5B9A\u8DEF\u5F84";
  const parts2 = String(value).split(/[\\/]/).filter(Boolean);
  return parts2.length > 3 ? "\u2026/" + parts2.slice(-3).join("/") : value;
}
function formatRecent(value) {
  if (!value) return "\u5C1A\u672A\u5F00\u59CB\u4F1A\u8BDD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "\u6700\u8FD1\u4F1A\u8BDD\u53EF\u7EE7\u7EED";
  return "\u6700\u8FD1\u6D3B\u52A8 " + date.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function useHomeOverlayStyle(open) {
  return {
    "--cpwb-home-left": "0px",
    visibility: open ? "visible" : "hidden"
  };
}
function resolveHomeMetrics({
  projects = [],
  knowledgeBases = [],
  recentSessions = [],
  recentSessionTotal = 0
} = {}) {
  return {
    workspaceCount: projects.length,
    sessionCount: Math.max(Number(recentSessionTotal) || 0, recentSessions.length),
    knowledgeCount: knowledgeBases.length
  };
}
function ProjectCard({ project, index, enterProject, busyId, setBusyId, setError, onRename, onDelete, onViewSessions }) {
  const recent = project.recentSession || null;
  const mountedRef = import_react7.default.useRef(true);
  import_react7.default.useEffect(function() {
    mountedRef.current = true;
    return function() {
      mountedRef.current = false;
    };
  }, []);
  const open = function(newSession) {
    if (busyId != null) return;
    setBusyId("project:" + project.id);
    setError(null);
    enterProject(project.id, {
      newSession,
      resumeSessionId: newSession || !recent ? void 0 : recent.sessionId
    }).then(function() {
      if (mountedRef.current) setBusyId(null);
    }).catch(function(err2) {
      if (!mountedRef.current) return;
      setError(err2 && err2.message ? err2.message : "\u65E0\u6CD5\u6253\u5F00\u9879\u76EE");
      setBusyId(null);
    });
  };
  const busy = busyId === "project:" + project.id;
  return import_react7.default.createElement(
    "article",
    {
      className: "cpwb-project-card",
      style: { "--cpwb-card-index": index },
      onClick: function() {
        open(false);
      },
      onKeyDown: function(event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(false);
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-label": "\u6253\u5F00\u9879\u76EE " + project.name
    },
    import_react7.default.createElement("div", { className: "cpwb-card-scan", "aria-hidden": true }),
    import_react7.default.createElement(
      "div",
      { className: "cpwb-card-topline" },
      import_react7.default.createElement("span", { className: "cpwb-card-seq" }, "PROJECT / " + String(index + 1).padStart(2, "0")),
      import_react7.default.createElement(
        "div",
        { className: "cpwb-card-top-actions" },
        import_react7.default.createElement("span", { className: "cpwb-card-state" }, recent ? "SESSION READY" : "NEW NODE"),
        import_react7.default.createElement("button", {
          type: "button",
          className: "cpwb-card-manage",
          disabled: busyId != null,
          onClick: function(event) {
            event.stopPropagation();
            onRename(project);
          },
          onKeyDown: function(event) {
            event.stopPropagation();
          },
          title: "\u4FEE\u6539\u9879\u76EE\u540D\u79F0",
          "aria-label": "\u91CD\u547D\u540D\u9879\u76EE " + project.name
        }, import_react7.default.createElement(a63, { size: 14, weight: "regular", "aria-hidden": true })),
        import_react7.default.createElement("button", {
          type: "button",
          className: "cpwb-card-manage cpwb-card-manage-danger",
          disabled: busyId != null,
          onClick: function(event) {
            event.stopPropagation();
            onDelete(project);
          },
          onKeyDown: function(event) {
            event.stopPropagation();
          },
          title: "\u4ECE Workbench \u5220\u9664\u9879\u76EE",
          "aria-label": "\u5220\u9664\u9879\u76EE " + project.name
        }, import_react7.default.createElement(n15, { size: 14, weight: "regular", "aria-hidden": true }))
      )
    ),
    import_react7.default.createElement("div", { className: "cpwb-card-symbol", "aria-hidden": true }, glyph(ICONS.folder, 32)),
    import_react7.default.createElement(
      "div",
      { className: "cpwb-card-copy" },
      import_react7.default.createElement("h3", null, project.name),
      import_react7.default.createElement("p", { title: project.path || "" }, shortPath(project.path)),
      import_react7.default.createElement("span", null, formatRecent(recent && recent.updatedAt))
    ),
    import_react7.default.createElement(
      "div",
      { className: "cpwb-card-actions" },
      import_react7.default.createElement("span", { className: "cpwb-card-enter" }, busy ? "\u8FDE\u63A5\u4E2D\u2026" : recent ? "\u7EE7\u7EED\u4F1A\u8BDD" : "\u8FDB\u5165\u9879\u76EE", import_react7.default.createElement(c, { size: 14, weight: "regular", "aria-hidden": true })),
      import_react7.default.createElement("button", {
        type: "button",
        className: "cpwb-card-sessions",
        onClick: function(event) {
          event.stopPropagation();
          onViewSessions?.(project);
        },
        onKeyDown: function(event) {
          event.stopPropagation();
        },
        disabled: busyId != null,
        "aria-label": "\u67E5\u770B\u9879\u76EE " + project.name + " \u7684\u5168\u90E8\u4F1A\u8BDD",
        title: "\u67E5\u770B\u5168\u90E8\u4F1A\u8BDD"
      }, "\u5168\u90E8\u4F1A\u8BDD"),
      import_react7.default.createElement("button", {
        type: "button",
        className: "cpwb-card-new",
        onClick: function(event) {
          event.stopPropagation();
          open(true);
        },
        disabled: busyId != null,
        title: "\u4E3A\u8BE5\u9879\u76EE\u65B0\u5EFA\u4F1A\u8BDD"
      }, glyph(ICONS.plus), import_react7.default.createElement("span", null, "\u65B0\u4F1A\u8BDD"))
    )
  );
}
function ProjectHome(props) {
  const store3 = props.store;
  const state = import_react7.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const homeOpenSnapshot = useHomeOpen();
  const open = props.open === void 0 ? homeOpenSnapshot : props.open;
  const homeStyle = useHomeOverlayStyle(open);
  const [busyId, setBusyId] = import_react7.default.useState(null);
  const [enterError, setEnterError] = import_react7.default.useState(null);
  const [creatingProject, setCreatingProject] = import_react7.default.useState(false);
  const [renameTarget, setRenameTarget] = import_react7.default.useState(null);
  const [renameDraft, setRenameDraft] = import_react7.default.useState("");
  const [deleteTarget, setDeleteTarget] = import_react7.default.useState(null);
  if (!open) return null;
  const projects = Array.isArray(state.projects) ? state.projects : [];
  const knowledgeBases = Array.isArray(state.knowledgeBases) ? state.knowledgeBases : [];
  const { workspaceCount, sessionCount, knowledgeCount } = resolveHomeMetrics({
    projects,
    knowledgeBases,
    recentSessions: state.recentSessions,
    recentSessionTotal: state.recentSessionTotal
  });
  const error = enterError || state.error;
  const renaming = !!(state.action && state.action.type === "renameProject" && state.action.status === "running");
  const addFolder = function() {
    if (creatingProject) return;
    setCreatingProject(true);
    setEnterError(null);
    props.createProject().catch(function(err2) {
      setEnterError(err2 && err2.message ? err2.message : "\u6DFB\u52A0\u6587\u4EF6\u5939\u5931\u8D25");
    }).finally(function() {
      setCreatingProject(false);
    });
  };
  const beginRename = function(project) {
    setEnterError(null);
    setRenameTarget(project);
    setRenameDraft(project.name);
  };
  const submitRename = function(event) {
    event.preventDefault();
    const name = renameDraft.trim();
    if (!renameTarget || !name || renaming) return;
    setEnterError(null);
    store3.actions.renameProject({ id: renameTarget.id, name }).then(function() {
      setRenameTarget(null);
      setRenameDraft("");
    }).catch(function(err2) {
      setEnterError(err2 && err2.message ? err2.message : "\u4FEE\u6539\u9879\u76EE\u540D\u79F0\u5931\u8D25");
    });
  };
  return import_react7.default.createElement(
    "div",
    { className: "cpwb-home cpwb-workbench-overlay", "data-page": "home", style: homeStyle, role: "main", "aria-label": "Deepseek Harness Workbench" },
    import_react7.default.createElement("div", { className: "cpwb-home-noise", "aria-hidden": true }),
    import_react7.default.createElement(
      "main",
      { className: "cpwb-home-main" },
      import_react7.default.createElement(
        "section",
        { className: "cpwb-hero" },
        import_react7.default.createElement("div", { className: "cpwb-hero-kicker" }, "Harness Workbench / Intelligence online"),
        import_react7.default.createElement(
          "h1",
          null,
          import_react7.default.createElement("span", null, "YOUR PROJECT."),
          import_react7.default.createElement("span", null, "YOUR SYSTEM."),
          import_react7.default.createElement("span", { className: "cpwb-hero-accent" }, "YOUR INTELLIGENCE.")
        ),
        import_react7.default.createElement("p", null, "\u9A7E\u9A6D\u667A\u80FD\uFF0C\u9879\u76EE\u89C9\u9192"),
        import_react7.default.createElement(
          "div",
          { className: "cpwb-home-metrics" },
          import_react7.default.createElement("span", null, import_react7.default.createElement("b", null, String(workspaceCount).padStart(2, "0")), " WORKSPACES"),
          import_react7.default.createElement("span", null, import_react7.default.createElement("b", null, String(sessionCount).padStart(2, "0")), " SESSIONS"),
          import_react7.default.createElement("span", null, import_react7.default.createElement("b", null, String(knowledgeCount).padStart(2, "0")), " KNOWLEDGE")
        )
      ),
      error ? import_react7.default.createElement(
        "div",
        { className: "cpwb-home-error", role: "alert" },
        glyph(ICONS.warn),
        import_react7.default.createElement("span", null, error.message || String(error)),
        import_react7.default.createElement("button", { type: "button", onClick: function() {
          setEnterError(null);
          store3.actions.retry().catch(function() {
          });
        } }, "\u91CD\u8BD5")
      ) : null,
      state.phase === "loading" ? import_react7.default.createElement("div", { className: "cpwb-home-loading", role: "status" }, import_react7.default.createElement("i"), " \u6B63\u5728\u540C\u6B65\u5DE5\u4F5C\u53F0\u6570\u636E\u2026") : import_react7.default.createElement(
        import_react7.default.Fragment,
        null,
        import_react7.default.createElement(
          "section",
          { className: "cpwb-home-section" },
          import_react7.default.createElement(
            "header",
            null,
            import_react7.default.createElement("div", null, import_react7.default.createElement("span", null, "01 / WORKSPACES"), import_react7.default.createElement("h2", null, "\u9879\u76EE\u5DE5\u4F5C\u533A")),
            import_react7.default.createElement(
              "button",
              { type: "button", className: "cpwb-folder-add", onClick: addFolder, disabled: creatingProject, title: "\u6DFB\u52A0\u6587\u4EF6\u5939\u4E3A\u9879\u76EE", "aria-label": "\u6DFB\u52A0\u6587\u4EF6\u5939\u4E3A\u9879\u76EE" },
              import_react7.default.createElement("span", null, glyph(ICONS.folder, 22)),
              import_react7.default.createElement("b", null, "+"),
              import_react7.default.createElement("em", null, creatingProject ? "\u8FDE\u63A5\u4E2D" : "\u6DFB\u52A0\u6587\u4EF6\u5939")
            )
          ),
          projects.length === 0 ? import_react7.default.createElement(Empty, { glyph: glyph(ICONS.folder, 24) }, "\u6682\u65E0\u9879\u76EE\uFF0C\u4F7F\u7528\u53F3\u4E0A\u89D2\u6587\u4EF6\u5939\u56FE\u6807\u6DFB\u52A0") : import_react7.default.createElement("div", { className: "cpwb-project-grid" }, projects.map(function(project, index) {
            return import_react7.default.createElement(ProjectCard, {
              key: project.id,
              project,
              index,
              enterProject: props.enterProject,
              busyId,
              setBusyId,
              setError: setEnterError,
              onRename: beginRename,
              onDelete: setDeleteTarget,
              onViewSessions: props.openProjectSessions
            });
          }))
        ),
        import_react7.default.createElement(
          "section",
          { className: "cpwb-home-section cpwb-knowledge-entry" },
          import_react7.default.createElement(
            "button",
            { type: "button", onClick: props.openKnowledge },
            import_react7.default.createElement(n4, { size: 26, weight: "regular", "aria-hidden": true }),
            import_react7.default.createElement(
              "span",
              null,
              import_react7.default.createElement("small", null, "02 / KNOWLEDGE NODES"),
              import_react7.default.createElement("strong", null, "\u63A5\u5165\u77E5\u8BC6\u82AF\u7247"),
              import_react7.default.createElement("em", null, knowledgeBases.length + " \u4E2A\u77E5\u8BC6\u5E93 \xB7 \u4E0A\u4F20\u3001\u5411\u91CF\u5316\u3001\u68C0\u7D22\u4E0E\u4F1A\u8BDD")
            ),
            import_react7.default.createElement(c, { size: 20, weight: "regular", "aria-hidden": true })
          )
        )
      )
    ),
    import_react7.default.createElement("footer", { className: "cpwb-home-footer" }, "DEEPSEEK HARNESS / PROJECT INTELLIGENCE SYSTEM", import_react7.default.createElement("span", null, "LOCAL-FIRST \xB7 VECTOR-READY")),
    renameTarget ? import_react7.default.createElement("div", {
      className: "cpwb-modal-backdrop",
      onMouseDown: function(event) {
        if (event.target === event.currentTarget && !renaming) setRenameTarget(null);
      }
    }, import_react7.default.createElement(
      "form",
      {
        className: "cpwb-modal cpwb-project-modal",
        role: "dialog",
        "aria-modal": true,
        "aria-labelledby": "cpwb-rename-project-title",
        onSubmit: submitRename
      },
      import_react7.default.createElement("div", { className: "cpwb-modal-kicker" }, "PROJECT / RENAME"),
      import_react7.default.createElement("h3", { id: "cpwb-rename-project-title" }, "\u4FEE\u6539\u9879\u76EE\u540D\u79F0"),
      import_react7.default.createElement("label", null, "\u9879\u76EE\u540D\u79F0", import_react7.default.createElement("input", {
        value: renameDraft,
        maxLength: 120,
        autoFocus: true,
        onChange: function(event) {
          setRenameDraft(event.target.value);
        }
      })),
      import_react7.default.createElement("p", { className: "cpwb-project-modal-note" }, "\u4EC5\u4FEE\u6539 Workbench \u4E2D\u7684\u663E\u793A\u540D\u79F0\uFF0C\u4E0D\u4F1A\u91CD\u547D\u540D\u78C1\u76D8\u76EE\u5F55\u6216 DSH workspace\u3002"),
      import_react7.default.createElement(
        "div",
        { className: "cpwb-modal-actions" },
        import_react7.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: renaming, onClick: function() {
          setRenameTarget(null);
        } }, "\u53D6\u6D88"),
        import_react7.default.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: renaming || renameDraft.trim() === "" }, renaming ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u540D\u79F0")
      )
    )) : null,
    deleteTarget ? import_react7.default.createElement(ContainerDeleteDialog, { kind: "project", target: deleteTarget, store: store3, onClose: () => setDeleteTarget(null) }) : null
  );
}

// src/client/WorkbenchSessionShell.js
var import_react26 = __toESM(require("react"), 1);

// src/client/CyberSelect.js
var import_react9 = __toESM(require("react"), 1);
function enabledItems(root) {
  return Array.from(root?.querySelectorAll?.('[role="option"]') || []).filter((item) => !item.disabled);
}
function CyberSelect({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "\u8BF7\u9009\u62E9",
  disabled = false,
  className = ""
}) {
  const [open, setOpen] = import_react9.default.useState(false);
  const rootRef = import_react9.default.useRef(null);
  const triggerRef = import_react9.default.useRef(null);
  const focusOnOpen = import_react9.default.useRef(null);
  const listId = import_react9.default.useId();
  const selectedId = value == null ? "" : String(value);
  const selected = options.find((option) => String(option.value) === selectedId);
  import_react9.default.useEffect(() => {
    if (!open || focusOnOpen.current == null) return;
    const items = enabledItems(rootRef.current);
    const target = focusOnOpen.current === "last" ? items.at(-1) : items[0];
    focusOnOpen.current = null;
    target?.focus?.();
  }, [open]);
  const close = import_react9.default.useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus?.();
  }, []);
  import_react9.default.useEffect(() => {
    if (!open || typeof document === "undefined") return void 0;
    const dismiss = (event) => {
      if (rootRef.current?.contains?.(event.target)) return;
      close(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [close, open]);
  const moveFocus = (event) => {
    const items = enabledItems(rootRef.current);
    if (!items.length) return;
    const current = items.indexOf(event.target);
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (event.key === "ArrowDown") next = current < 0 ? 0 : (current + 1) % items.length;
    if (event.key === "ArrowUp") next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
    if (next !== current || current < 0) items[next]?.focus?.();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && open && event.target?.getAttribute?.("role") === "option") {
      event.preventDefault();
      event.stopPropagation();
      event.target.click();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!open) {
      focusOnOpen.current = event.key === "ArrowUp" || event.key === "End" ? "last" : "first";
      setOpen(true);
      return;
    }
    moveFocus(event);
  };
  return import_react9.default.createElement(
    "div",
    {
      ref: rootRef,
      className: `cpwb-cyber-select${className ? ` ${className}` : ""}`,
      onKeyDown: handleKeyDown
    },
    import_react9.default.createElement(
      "button",
      {
        ref: triggerRef,
        type: "button",
        className: "cpwb-cyber-select-trigger",
        disabled,
        "aria-label": ariaLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": open ? listId : void 0,
        onClick: () => setOpen((current) => !current)
      },
      import_react9.default.createElement("span", { className: selected ? "" : "cpwb-cyber-select-placeholder" }, selected?.label ?? placeholder),
      import_react9.default.createElement(s5, { size: 15, weight: "bold", "aria-hidden": true })
    ),
    open ? import_react9.default.createElement("div", {
      id: listId,
      className: "cpwb-cyber-select-list",
      role: "listbox",
      "aria-label": ariaLabel
    }, options.map((option) => {
      const id = String(option.value);
      const isSelected = id === selectedId;
      return import_react9.default.createElement("button", {
        type: "button",
        role: "option",
        key: id,
        disabled: option.disabled === true,
        "aria-selected": isSelected,
        className: isSelected ? "cpwb-selected" : "",
        onClick: () => {
          onChange?.(option.value);
          close(true);
        }
      }, import_react9.default.createElement("span", null, option.label), isSelected ? import_react9.default.createElement(n3, { size: 14, weight: "bold", "aria-hidden": true }) : null);
    })) : null
  );
}

// src/client/Todos.js
var import_react12 = __toESM(require("react"), 1);

// src/client/arrivalPulse.js
var import_react11 = __toESM(require("react"), 1);
function recordId(record) {
  const value = record && typeof record === "object" ? record.id : record;
  return value == null ? null : String(value);
}
function getNewRecordIds(previousIds, records) {
  if (previousIds == null) return [];
  return (Array.isArray(records) ? records : []).map(recordId).filter((id) => id != null && !previousIds.has(id));
}
function useArrivalPulse(records, duration = 1100) {
  const ids = (Array.isArray(records) ? records : []).map(recordId).filter(Boolean);
  const signature = JSON.stringify(ids);
  const previousIds = import_react11.default.useRef(null);
  const clearTimer = import_react11.default.useRef(null);
  const [arrivingIds, setArrivingIds] = import_react11.default.useState(() => /* @__PURE__ */ new Set());
  import_react11.default.useEffect(() => {
    const added = getNewRecordIds(previousIds.current, ids);
    previousIds.current = new Set(ids);
    if (added.length === 0) return;
    if (clearTimer.current != null) clearTimeout(clearTimer.current);
    setArrivingIds(new Set(added));
    clearTimer.current = setTimeout(() => {
      clearTimer.current = null;
      setArrivingIds(/* @__PURE__ */ new Set());
    }, duration);
  }, [signature, duration]);
  import_react11.default.useEffect(() => () => {
    if (clearTimer.current != null) clearTimeout(clearTimer.current);
  }, []);
  return arrivingIds;
}
function GenerationWave({ label }) {
  return import_react11.default.createElement("div", {
    className: "cpwb-generation-wave",
    role: "status",
    "aria-label": label
  }, import_react11.default.createElement("span", { "aria-hidden": true }));
}

// src/client/timezone.js
var DEFAULT_TIME_ZONE = "Asia/Shanghai";
function formatter(timeZone, withTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    calendar: "gregory",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...withTime ? { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" } : {}
  });
}
function validateTimeZone(value) {
  if (typeof value !== "string" || value.trim() === "") throw new Error("timezone must be a valid IANA time zone ID");
  const zone = value.trim();
  try {
    formatter(zone).format(/* @__PURE__ */ new Date());
  } catch {
    throw new Error("timezone must be a valid IANA time zone ID");
  }
  return zone;
}
function localDateTimeParts(value, timeZone = DEFAULT_TIME_ZONE) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("invalid date");
  const fields = Object.fromEntries(formatter(validateTimeZone(timeZone), true).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return { year: Number(fields.year), month: Number(fields.month), day: Number(fields.day), hour: Number(fields.hour), minute: Number(fields.minute), second: Number(fields.second) };
}
function localDateKey2(value = /* @__PURE__ */ new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const p3 = localDateTimeParts(value, timeZone);
  return `${String(p3.year).padStart(4, "0")}-${String(p3.month).padStart(2, "0")}-${String(p3.day).padStart(2, "0")}`;
}
function addLocalDays(dateValue, days) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateValue));
  if (!match) throw new Error("date must use YYYY-MM-DD");
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + Number(days)));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function parseLocal(dateValue, timeValue) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateValue));
  const time = /^(\d{2}):(\d{2})$/.exec(String(timeValue));
  if (!date || !time) throw new Error("local date and time must use YYYY-MM-DD and HH:mm");
  const result = { year: +date[1], month: +date[2], day: +date[3], hour: +time[1], minute: +time[2], second: 0 };
  const calendar = new Date(Date.UTC(result.year, result.month - 1, result.day));
  if (calendar.getUTCFullYear() !== result.year || calendar.getUTCMonth() !== result.month - 1 || calendar.getUTCDate() !== result.day || result.hour > 23 || result.minute > 59) throw new Error("local date and time is invalid");
  return result;
}
function zonedDateTimeToUtc(dateValue, timeValue, timeZone = DEFAULT_TIME_ZONE) {
  const zone = validateTimeZone(timeZone);
  const wanted = parseLocal(dateValue, timeValue);
  const naive = Date.UTC(wanted.year, wanted.month - 1, wanted.day, wanted.hour, wanted.minute);
  let instant = new Date(naive);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const actual2 = localDateTimeParts(instant, zone);
    const actualAsUtc = Date.UTC(actual2.year, actual2.month - 1, actual2.day, actual2.hour, actual2.minute, actual2.second);
    instant = new Date(naive - (actualAsUtc - instant.getTime()));
  }
  const actual = localDateTimeParts(instant, zone);
  if (actual.year !== wanted.year || actual.month !== wanted.month || actual.day !== wanted.day || actual.hour !== wanted.hour || actual.minute !== wanted.minute) throw new Error("local date and time does not exist in timezone");
  return instant;
}
function formatInstant(value, timeZone = DEFAULT_TIME_ZONE) {
  const p3 = localDateTimeParts(value, timeZone);
  return `${String(p3.year).padStart(4, "0")}-${String(p3.month).padStart(2, "0")}-${String(p3.day).padStart(2, "0")} ${String(p3.hour).padStart(2, "0")}:${String(p3.minute).padStart(2, "0")}`;
}

// src/client/Todos.js
function pad(value) {
  return String(value).padStart(2, "0");
}
function localDateTime(value, timeZone) {
  try {
    return formatInstant(value, timeZone);
  } catch {
    return String(value || "");
  }
}
function localTime(value, timeZone) {
  try {
    const date = localDateTimeParts(value, timeZone);
    return `${pad(date.hour)}:${pad(date.minute)}`;
  } catch {
    return "";
  }
}
function calendarLabel(value, timeZone) {
  const date = localDateTimeParts(value, timeZone);
  const weekday = new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "short" }).format(new Date(value));
  return `${date.month}\u6708${date.day}\u65E5\uFF0C${weekday}`;
}
function parts(value, timeZone) {
  if (!value) return { date: "", time: "" };
  const date = localDateTimeParts(value, timeZone);
  return { date: `${date.year}-${pad(date.month)}-${pad(date.day)}`, time: `${pad(date.hour)}:${pad(date.minute)}` };
}
function filterTodos(todos, query = "") {
  const needle = String(query ?? "").trim().toLocaleLowerCase();
  if (!needle) return Array.isArray(todos) ? todos : [];
  return (Array.isArray(todos) ? todos : []).filter((todo) => String(todo?.title || "").toLocaleLowerCase().includes(needle));
}
function organizeTodos(todos, { view = "pending", timeZone = DEFAULT_TIME_ZONE, now = /* @__PURE__ */ new Date() } = {}) {
  const today = localDateKey2(now, timeZone);
  const tomorrow = addLocalDays(today, 1);
  const rows = (Array.isArray(todos) ? todos : []).filter((todo) => view === "completed" ? todo.done : !todo.done);
  rows.sort((a65, b) => view === "completed" ? new Date(b.completedAt || b.dueAt).getTime() - new Date(a65.completedAt || a65.dueAt).getTime() : new Date(a65.dueAt).getTime() - new Date(b.dueAt).getTime());
  const sections = /* @__PURE__ */ new Map();
  for (const todo of rows) {
    const overdue = !todo.done && (todo.overdue === true || new Date(todo.dueAt).getTime() < now.getTime());
    const value = view === "completed" ? todo.completedAt || todo.dueAt : todo.dueAt;
    const date = localDateKey2(value, timeZone);
    const key = overdue ? "overdue" : view === "completed" ? "completed-" + date : date;
    let label;
    if (overdue) label = "\u5DF2\u8FC7\u671F";
    else if (view === "completed") label = date === today ? "\u4ECA\u5929\u5B8C\u6210" : calendarLabel(value, timeZone) + "\u5B8C\u6210";
    else if (date === today) label = "\u4ECA\u5929\uFF0C" + new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "short" }).format(new Date(value));
    else if (date === tomorrow) label = "\u660E\u5929\uFF0C" + new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "short" }).format(new Date(value));
    else label = calendarLabel(value, timeZone);
    if (!sections.has(key)) sections.set(key, { key, label, status: overdue ? "overdue" : view, items: [] });
    sections.get(key).items.push(todo);
  }
  return [...sections.values()];
}
function TodoDialog({ todo, onSave, onClose, busy, error, timeZone }) {
  const initial = parts(todo?.dueAt, timeZone);
  const [title, setTitle] = import_react12.default.useState(todo?.title || "");
  const [date, setDate] = import_react12.default.useState(initial.date);
  const [time, setTime] = import_react12.default.useState(initial.time);
  const [localError, setLocalError] = import_react12.default.useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!title.trim() || !date || !time) {
      setLocalError("\u6807\u9898\u3001\u65E5\u671F\u548C\u65F6\u95F4\u5747\u4E3A\u5FC5\u586B\u9879");
      return;
    }
    let dueAt;
    try {
      dueAt = zonedDateTimeToUtc(date, time, timeZone).toISOString();
    } catch (error2) {
      setLocalError(error2.message);
      return;
    }
    onSave({ title: title.trim(), dueAt }).catch(() => {
    });
  };
  return import_react12.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-todo-dialog-title" },
    import_react12.default.createElement(
      "form",
      { className: "cpwb-modal", onSubmit: submit },
      import_react12.default.createElement("div", { className: "cpwb-modal-kicker" }, todo ? "TODO / MODIFY" : "TODO / NEW"),
      import_react12.default.createElement("h3", { id: "cpwb-todo-dialog-title" }, todo ? "\u7F16\u8F91\u5F85\u529E" : "\u6DFB\u52A0\u5F85\u529E"),
      import_react12.default.createElement("label", null, "\u6807\u9898", import_react12.default.createElement("input", { autoFocus: true, value: title, onChange: (e93) => setTitle(e93.target.value), placeholder: "\u4F8B\u5982\uFF1A\u5B8C\u6210\u68C0\u7D22\u63A5\u53E3\u5BA1\u8BA1" })),
      import_react12.default.createElement(
        "div",
        { className: "cpwb-form-grid" },
        import_react12.default.createElement("label", null, "\u9884\u8BA1\u5B8C\u6210\u65E5\u671F", import_react12.default.createElement("input", { type: "date", value: date, onChange: (e93) => setDate(e93.target.value) })),
        import_react12.default.createElement("label", null, "\u9884\u8BA1\u5B8C\u6210\u65F6\u95F4", import_react12.default.createElement("input", { type: "time", value: time, onChange: (e93) => setTime(e93.target.value) }))
      ),
      localError || error ? import_react12.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, localError || error.message || String(error)) : null,
      import_react12.default.createElement("div", { className: "cpwb-modal-actions" }, import_react12.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: onClose }, "\u53D6\u6D88"), import_react12.default.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: busy }, busy ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"))
    )
  );
}
function Todos({ store: store3, projectId, now, initialQuery = "" }) {
  const state = import_react12.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const [dialog, setDialog] = import_react12.default.useState(null);
  const [deleteTarget, setDeleteTarget] = import_react12.default.useState(null);
  const [view, setView] = import_react12.default.useState("pending");
  const [query, setQuery] = import_react12.default.useState(initialQuery);
  const action = state.action;
  const todos = Array.isArray(state.todos) ? state.todos : [];
  const arrivingTodoIds = useArrivalPulse(todos);
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const error = action?.type === "todo" && action.status === "error" ? action.error : null;
  const save = (payload) => {
    const todo = dialog?.todo;
    const operation = todo ? store3.actions.updateTodo({ id: todo.id, ...payload }) : store3.actions.createTodo({ projectId, ...payload });
    return operation.then(() => setDialog(null));
  };
  const toggle = (todo) => store3.actions.updateTodo({ id: todo.id, done: !todo.done }).catch(() => {
  });
  const pending = todos.filter((todo) => !todo.done).length;
  const completed = todos.length - pending;
  const filteredTodos = filterTodos(todos, query);
  const sections = organizeTodos(filteredTodos, { view, timeZone, now: now || /* @__PURE__ */ new Date() });
  const remove = () => store3.actions.deleteTodo(deleteTarget.id).then(() => setDeleteTarget(null));
  return import_react12.default.createElement(
    "section",
    { className: "cpwb-tool-panel" },
    import_react12.default.createElement("div", { className: "cpwb-tool-head" }, import_react12.default.createElement("span", null, "PROJECT TODO"), import_react12.default.createElement("button", { className: "cpwb-btn cpwb-btn-primary cpwb-button-content", type: "button", onClick: () => setDialog({ todo: null }) }, import_react12.default.createElement(n13, { size: 14, weight: "bold" }), import_react12.default.createElement("span", null, "\u65B0\u589E"))),
    import_react12.default.createElement(
      "label",
      { className: "cpwb-tool-search" },
      import_react12.default.createElement("span", { "aria-hidden": true }, "\u2315"),
      import_react12.default.createElement("input", { type: "search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "\u641C\u7D22\u5F85\u529E\u4E8B\u9879", "aria-label": "\u641C\u7D22\u5F85\u529E" })
    ),
    import_react12.default.createElement(
      "div",
      { className: "cpwb-todo-tabs", role: "tablist", "aria-label": "\u5F85\u529E\u72B6\u6001" },
      import_react12.default.createElement("button", { type: "button", role: "tab", "aria-selected": view === "pending", className: view === "pending" ? "cpwb-active" : "", onClick: () => setView("pending") }, import_react12.default.createElement("span", null, "\u5F85\u5904\u7406"), import_react12.default.createElement("small", null, pending)),
      import_react12.default.createElement("button", { type: "button", role: "tab", "aria-selected": view === "completed", className: view === "completed" ? "cpwb-active" : "", onClick: () => setView("completed") }, import_react12.default.createElement("span", null, "\u5DF2\u5B8C\u6210"), import_react12.default.createElement("small", null, completed))
    ),
    error ? import_react12.default.createElement("div", { className: "cpwb-status cpwb-status-error", role: "alert" }, error.message || String(error)) : null,
    sections.length === 0 ? import_react12.default.createElement(Empty, { glyph: glyph(ICONS.grid) }, view === "completed" ? "\u6682\u65E0\u5DF2\u5B8C\u6210\u5F85\u529E" : "\u6682\u65E0\u5F85\u5904\u7406\u5F85\u529E\uFF0C\u6DFB\u52A0\u7B2C\u4E00\u9879") : import_react12.default.createElement("div", { className: "cpwb-todo-sections" }, sections.map((section) => import_react12.default.createElement(
      "section",
      { key: section.key, className: "cpwb-todo-section cpwb-todo-section-" + section.status },
      import_react12.default.createElement("h4", null, section.label),
      import_react12.default.createElement("div", { className: "cpwb-list" }, section.items.map((todo) => import_react12.default.createElement(
        "article",
        { key: todo.id, className: "cpwb-todo-row" + (todo.done ? " cpwb-item-done" : "") + (section.status === "overdue" ? " cpwb-todo-row-overdue" : "") + (arrivingTodoIds.has(String(todo.id)) ? " cpwb-entry-arrived" : "") },
        import_react12.default.createElement("button", { type: "button", className: "cpwb-check" + (todo.done ? " cpwb-done" : ""), onClick: () => toggle(todo), "aria-label": todo.done ? "\u6807\u8BB0\u672A\u5B8C\u6210" : "\u6807\u8BB0\u5B8C\u6210" }, todo.done ? import_react12.default.createElement(n3, { size: 14, weight: "bold" }) : null),
        import_react12.default.createElement(
          "button",
          { type: "button", className: "cpwb-item-main cpwb-todo-details", onClick: () => setDialog({ todo }) },
          import_react12.default.createElement("span", { className: "cpwb-item-title" }, todo.title),
          import_react12.default.createElement("span", { className: "cpwb-item-meta" }, todo.done ? "\u9884\u8BA1\u5B8C\u6210 " + localDateTime(todo.dueAt, timeZone) : todo.source === "auto" ? "\u81EA\u52A8\u751F\u6210" : "\u624B\u52A8\u521B\u5EFA")
        ),
        import_react12.default.createElement("span", { className: "cpwb-todo-time" + (section.status === "overdue" ? " cpwb-todo-overdue" : "") }, section.status === "overdue" ? import_react12.default.createElement("small", null, "\u5DF2\u8FC7\u671F") : null, localTime(todo.done ? todo.completedAt || todo.dueAt : todo.dueAt, timeZone)),
        import_react12.default.createElement("button", { type: "button", className: "cpwb-icon-button", onClick: () => setDialog({ todo }), "aria-label": "\u7F16\u8F91\u5F85\u529E " + todo.title }, import_react12.default.createElement(a63, { size: 14 })),
        import_react12.default.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", onClick: () => setDeleteTarget(todo), "aria-label": "\u5220\u9664\u5F85\u529E " + todo.title }, import_react12.default.createElement(n15, { size: 14 }))
      )))
    ))),
    dialog ? import_react12.default.createElement(TodoDialog, { todo: dialog.todo, onSave: save, onClose: () => setDialog(null), busy: action?.type === "todo" && action.status === "running", error, timeZone }) : null,
    deleteTarget ? import_react12.default.createElement(
      GlobalModal,
      { onClose: () => setDeleteTarget(null), labelledBy: "cpwb-delete-todo-title" },
      import_react12.default.createElement(
        "section",
        { className: "cpwb-modal cpwb-danger-modal" },
        import_react12.default.createElement("div", { className: "cpwb-modal-kicker" }, "TODO / DELETE"),
        import_react12.default.createElement("h3", { id: "cpwb-delete-todo-title" }, "\u5220\u9664\u5F85\u529E\uFF1F"),
        import_react12.default.createElement("p", null, "\u300C" + deleteTarget.title + "\u300D\u5C06\u6C38\u4E45\u5220\u9664\uFF0C\u6B64\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\u3002"),
        import_react12.default.createElement(
          "div",
          { className: "cpwb-modal-actions" },
          import_react12.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: () => setDeleteTarget(null) }, "\u53D6\u6D88"),
          import_react12.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", disabled: action?.type === "todo" && action.status === "running", onClick: () => remove().catch(() => {
          }) }, import_react12.default.createElement(n15, { size: 14 }), import_react12.default.createElement("span", null, "\u786E\u8BA4\u5220\u9664"))
        )
      )
    ) : null
  );
}

// src/client/KnowledgeBase.js
var import_react14 = __toESM(require("react"), 1);
var ACCEPT_EXTENSIONS = [
  "txt",
  "md",
  "markdown",
  "html",
  "htm",
  "docx",
  "pptx",
  "xlsx",
  "js",
  "ts",
  "jsx",
  "tsx",
  "json",
  "yaml",
  "yml",
  "py",
  "java",
  "go",
  "rs",
  "c",
  "cpp",
  "h",
  "hpp",
  "css",
  "sql",
  "sh"
];
var ACCEPT = ACCEPT_EXTENSIONS.map(function(e93) {
  return "." + e93;
}).join(",");
var DOC_STATUS = {
  uploading: { label: "\u4E0A\u4F20\u4E2D", kind: "pending" },
  queued: { label: "\u6392\u961F\u4E2D", kind: "pending" },
  parsing: { label: "\u89E3\u6790\u4E2D", kind: "pending" },
  embedding: { label: "\u5411\u91CF\u5316\u4E2D", kind: "pending" },
  ready: { label: "\u53EF\u68C0\u7D22", kind: "done" },
  failed: { label: "\u5931\u8D25", kind: "overdue" },
  stale: { label: "\u7D22\u5F15\u8FC7\u671F", kind: "overdue" }
};
function statusMeta(status) {
  return DOC_STATUS[status] || { label: status || "\u672A\u77E5", kind: "pending" };
}
function needsDocumentPolling(documents, selectedId) {
  if (selectedId == null || selectedId === "") return false;
  const list = Array.isArray(documents) ? documents : [];
  return list.some(function(d) {
    return d && (d.status === "uploading" || d.status === "parsing" || d.status === "embedding");
  });
}
function formatBytes(n18) {
  if (n18 == null) return "";
  if (n18 < 1024) return n18 + " B";
  if (n18 < 1024 * 1024) return (n18 / 1024).toFixed(1) + " KB";
  return (n18 / (1024 * 1024)).toFixed(1) + " MB";
}
function uploadStatusLabel(batchIndex, action) {
  if (!action || action.type !== "upload") return "\u6392\u961F\u4E2D";
  if (action.status === "error") return batchIndex < action.done ? "\u5DF2\u63D0\u4EA4" : "\u5931\u8D25";
  if (batchIndex < action.done) return "\u5DF2\u63D0\u4EA4";
  if (batchIndex === action.done) return "\u4E0A\u4F20\u4E2D";
  return "\u6392\u961F\u4E2D";
}
function renderDocumentItem(d, onReindex, onUnlink, reindexing, unlinkingDoc) {
  const meta = statusMeta(d.status);
  const canReindex = d.status === "failed" || d.status === "stale";
  return import_react14.default.createElement(
    "div",
    { key: d.id, className: "cpwb-item" },
    import_react14.default.createElement(
      "div",
      { className: "cpwb-item-main" },
      import_react14.default.createElement(
        "div",
        { className: "cpwb-item-title" },
        glyph(ICONS.doc),
        " " + d.originalName,
        import_react14.default.createElement(Badge, { kind: meta.kind }, meta.label)
      ),
      import_react14.default.createElement(
        "div",
        { className: "cpwb-item-meta" },
        formatBytes(d.size) + (d.error ? " \xB7 " + d.error : "")
      )
    ),
    canReindex ? import_react14.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: !!reindexing, onClick: function() {
      onReindex(d);
    }, title: "\u91CD\u65B0\u7D22\u5F15" }, glyph(ICONS.refresh), " \u91CD\u65B0\u7D22\u5F15") : null,
    import_react14.default.createElement("button", { type: "button", className: "cpwb-x", disabled: !!unlinkingDoc, onClick: function() {
      onUnlink(d);
    }, title: "\u4ECE\u672C\u77E5\u8BC6\u5E93\u89E3\u9664\u5173\u8054" }, glyph(ICONS.x))
  );
}
function renderCitation(c8, i3) {
  return import_react14.default.createElement(
    "div",
    { key: c8.sourceId || c8.originalName + ":" + i3, className: "cpwb-citation" },
    import_react14.default.createElement(
      "div",
      { className: "cpwb-citation-head" },
      import_react14.default.createElement("span", { className: "cpwb-citation-file" }, c8.originalName),
      import_react14.default.createElement("span", { className: "cpwb-citation-locator" }, c8.locator || "")
    ),
    c8.heading ? import_react14.default.createElement("div", { className: "cpwb-citation-heading" }, c8.heading) : null,
    import_react14.default.createElement("div", { className: "cpwb-citation-text" }, c8.text)
  );
}
function KnowledgeBase({ store: store3, projectId, knowledgeBaseId, sessions, workspaces, onConversationOpen, onDraftOpen, view = "all" }) {
  const standalone = knowledgeBaseId != null;
  const state = import_react14.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const newKbState = import_react14.default.useState("");
  const queryState = import_react14.default.useState("");
  const dragState = import_react14.default.useState(false);
  const pendingState = import_react14.default.useState([]);
  const newKb = newKbState[0];
  const setNewKb = newKbState[1];
  const query = queryState[0];
  const setQuery = queryState[1];
  const dragActive = dragState[0];
  const setDragActive = dragState[1];
  const pending = pendingState[0];
  const setPending = pendingState[1];
  const chatErrorState = import_react14.default.useState(null);
  const chatError = chatErrorState[0];
  const setChatError = chatErrorState[1];
  const openingChatState = import_react14.default.useState(false);
  const openingChat = openingChatState[0];
  const setOpeningChat = openingChatState[1];
  const scopeReadyState = import_react14.default.useState(!standalone);
  const scopeReady = scopeReadyState[0];
  const setScopeReady = scopeReadyState[1];
  const [deleteTarget, setDeleteTarget] = import_react14.default.useState(null);
  const mountedRef = import_react14.default.useRef(true);
  import_react14.default.useEffect(function() {
    mountedRef.current = true;
    return function() {
      mountedRef.current = false;
    };
  }, []);
  const knowledgeBases = Array.isArray(state.knowledgeBases) ? state.knowledgeBases : [];
  const selectedId = standalone ? knowledgeBaseId : state.activeKnowledgeBaseId;
  const knowledgeSessions = selectedId == null ? [] : (state.sessionPage?.items || []).filter(function(session) {
    return session.scope?.kind === "knowledge_base" && session.scope.id === selectedId;
  });
  const linked = Array.isArray(state.linkedKnowledgeBases) ? state.linkedKnowledgeBases : [];
  const documents = !standalone || scopeReady ? Array.isArray(state.documents) ? state.documents : [] : [];
  const citations = Array.isArray(state.citations) ? state.citations : [];
  const action = state.action;
  const showDirectory = !standalone && (view === "all" || view === "project" || view === "linked");
  const showDocuments = view === "all" || view === "project" || view === "documents";
  const showRetrieval = view === "all" || view === "retrieval";
  const showSessions = view === "all" || view === "session";
  const creatingKb = !!(action && action.type === "createKnowledgeBase" && action.status === "running");
  const uploading = !!(action && action.type === "upload" && action.status === "running");
  const searching = !!(action && action.type === "search" && action.status === "running");
  const linking = !!(action && action.type === "linkProjectKnowledgeBase" && action.status === "running");
  const unlinkingKb = !!(action && action.type === "unlinkProjectKnowledgeBase" && action.status === "running");
  const reindexing = !!(action && action.type === "reindexDocument" && action.status === "running");
  const unlinkingDoc = !!(action && action.type === "unlinkDocument" && action.status === "running");
  import_react14.default.useEffect(function() {
    if (projectId == null) return;
    store3.actions.loadAllDocuments().catch(function() {
    });
    store3.actions.loadLinkedKnowledgeBases(projectId).catch(function() {
    });
  }, [projectId, store3]);
  import_react14.default.useEffect(function() {
    if (!standalone) {
      setScopeReady(true);
      return;
    }
    let current = true;
    setScopeReady(false);
    Promise.all([
      store3.actions.selectKnowledgeBase(knowledgeBaseId),
      store3.actions.loadAllSessions({ scopeKind: "knowledge_base", scopeId: knowledgeBaseId, limit: 100 })
    ]).then(function() {
      if (current) setScopeReady(true);
    }).catch(function() {
      if (current) setScopeReady(true);
    });
    return function() {
      current = false;
    };
  }, [standalone, knowledgeBaseId, store3]);
  import_react14.default.useEffect(function() {
    if (!needsDocumentPolling(documents, selectedId)) return;
    const timer = setTimeout(function() {
      store3.actions.refreshDocuments().catch(function() {
      });
    }, 1500);
    return function() {
      clearTimeout(timer);
    };
  }, [documents, selectedId, store3]);
  import_react14.default.useEffect(function() {
    if (!standalone && selectedId != null) store3.actions.loadAllSessions({ scopeKind: "knowledge_base", scopeId: selectedId, limit: 100 }).catch(function() {
    });
  }, [standalone, selectedId, store3]);
  const linkedIds = new Set(linked.map(function(kb) {
    return kb.id;
  }));
  const selected = knowledgeBases.find(function(kb) {
    return kb.id === selectedId;
  }) || null;
  const actionError = action && action.status === "error" && action.error || null;
  const kbError = actionError || state.error;
  const select = function(kb) {
    store3.actions.selectKnowledgeBase(kb.id).catch(function() {
    });
  };
  const createKb = function() {
    const name = newKb.trim();
    if (!name) return;
    setNewKb("");
    store3.actions.createKnowledgeBase({ name }).then(function(created) {
      if (created && created.id) store3.actions.selectKnowledgeBase(created.id).catch(function() {
      });
    }).catch(function() {
    });
  };
  const refreshStatus = function() {
    store3.actions.refreshDocuments().catch(function() {
    });
  };
  const retryError = function() {
    store3.actions.refreshDocuments().catch(function() {
    });
    if (projectId != null) store3.actions.loadLinkedKnowledgeBases(projectId).catch(function() {
    });
  };
  const handleFiles = function(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0 || selectedId == null || uploading) return;
    const batch = files.map(function(f2, i3) {
      return { key: Date.now() + ":" + i3, name: f2.name, index: i3 };
    });
    setPending(batch);
    store3.actions.uploadFiles({ files, scope: "knowledgeBase", scopeId: selectedId }).then(
      function() {
        setPending([]);
      },
      function() {
        setPending([]);
      }
    );
  };
  const onDrop = function(e93) {
    e93.preventDefault();
    setDragActive(false);
    if (e93.dataTransfer && e93.dataTransfer.files) handleFiles(e93.dataTransfer.files);
  };
  const runSearch = function() {
    const q = query.trim();
    if (!q || selectedId == null) return;
    store3.actions.search({ scope: "knowledgeBase", scopeId: selectedId, query: q, limit: 8 }).catch(function() {
    });
  };
  const openChat = function(sessionId) {
    if (selectedId == null || openingChat) return;
    if (sessionId == null) {
      store3.actions.startDraft({ scope: { kind: "knowledge_base", id: selectedId } });
      onDraftOpen?.();
      return;
    }
    setOpeningChat(true);
    setChatError(null);
    store3.actions.openSession(sessionId).then(function(result) {
      if (!mountedRef.current) return result;
      if (!sessions) return result;
      return openWorkbenchSession(sessions, result.sessionId, { workspaces }).then(function() {
        onConversationOpen?.(result.sessionId);
        return result;
      });
    }).then(function(result) {
      if (!mountedRef.current) return result;
      setOpeningChat(false);
      store3.actions.loadAllSessions({ scopeKind: "knowledge_base", scopeId: selectedId, limit: 100 }).catch(function() {
      });
      return result;
    }).catch(function(err2) {
      if (!mountedRef.current) return;
      setOpeningChat(false);
      setChatError(err2 && err2.message ? err2.message : "\u6253\u5F00\u804A\u5929\u5931\u8D25");
    });
  };
  const reindex = function(d) {
    store3.actions.reindexDocument(d.id).catch(function() {
    });
  };
  const unlink = function(d) {
    store3.actions.unlinkDocument({ id: d.id, scope: "knowledgeBase", scopeId: selectedId }).catch(function() {
    });
  };
  const uploadAction = action && action.type === "upload" ? action : null;
  const uploadDone = uploadAction ? uploadAction.done || 0 : 0;
  const uploadTotal = uploadAction ? uploadAction.total || 0 : 0;
  return import_react14.default.createElement(
    "div",
    null,
    kbError ? import_react14.default.createElement(
      "div",
      { className: "cpwb-error" },
      import_react14.default.createElement(
        "div",
        { className: "cpwb-error-msg" },
        (kbError.code ? kbError.code + "\uFF1A" : "") + (kbError.message || "\u52A0\u8F7D\u5931\u8D25")
      ),
      import_react14.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: retryError, title: "\u5237\u65B0/\u91CD\u8BD5" }, glyph(ICONS.refresh), " \u5237\u65B0 / \u91CD\u8BD5")
    ) : null,
    showDirectory ? import_react14.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react14.default.createElement(
        "div",
        { className: "cpwb-section-head" },
        import_react14.default.createElement("div", { className: "cpwb-label" }, "\u77E5\u8BC6\u5E93 \xB7 " + knowledgeBases.length)
      ),
      import_react14.default.createElement(
        "div",
        { className: "cpwb-addrow" },
        import_react14.default.createElement("input", { className: "cpwb-input", value: newKb, placeholder: "\u65B0\u5EFA\u77E5\u8BC6\u5E93\u2026", onChange: function(e93) {
          setNewKb(e93.target.value);
        }, onKeyDown: function(e93) {
          if (e93.key === "Enter") createKb();
        } }),
        import_react14.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: createKb, title: "\u65B0\u5EFA\u77E5\u8BC6\u5E93", disabled: creatingKb }, glyph(ICONS.plus))
      ),
      knowledgeBases.length === 0 ? import_react14.default.createElement(Empty, { glyph: glyph(ICONS.db, 18) }, "\u6682\u65E0\u77E5\u8BC6\u5E93\uFF0C\u5148\u65B0\u5EFA\u4E00\u4E2A") : import_react14.default.createElement("div", { className: "cpwb-kb-list" }, knowledgeBases.map(function(kb) {
        const isSel = kb.id === selectedId;
        const isLinked = linkedIds.has(kb.id);
        return import_react14.default.createElement(
          "div",
          { key: kb.id, className: "cpwb-kb-row" + (isSel ? " cpwb-kb-sel" : "") },
          import_react14.default.createElement(
            "button",
            { type: "button", className: "cpwb-kb-name", onClick: function() {
              select(kb);
            }, title: "\u9009\u62E9\u77E5\u8BC6\u5E93" },
            glyph(ICONS.db),
            " " + kb.name
          ),
          projectId != null && isLinked ? import_react14.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", onClick: function() {
            store3.actions.unlinkProjectKnowledgeBase(projectId, kb.id).catch(function() {
            });
          }, title: "\u89E3\u9664\u4E0E\u672C\u9879\u76EE\u7684\u5173\u8054", disabled: unlinkingKb }, "\u89E3\u9664\u5173\u8054") : projectId != null ? import_react14.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: function() {
            store3.actions.linkProjectKnowledgeBase(projectId, kb.id).catch(function() {
            });
          }, title: "\u5173\u8054\u5230\u672C\u9879\u76EE", disabled: linking }, "\u5173\u8054") : null,
          import_react14.default.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", onClick: function() {
            setDeleteTarget(kb);
          }, title: "\u5220\u9664\u77E5\u8BC6\u5E93", "aria-label": "\u5220\u9664\u77E5\u8BC6\u5E93 " + kb.name }, import_react14.default.createElement(n15, { size: 14 }))
        );
      }))
    ) : null,
    showDocuments ? import_react14.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react14.default.createElement(
        "div",
        { className: "cpwb-section-head" },
        import_react14.default.createElement("div", { className: "cpwb-label" }, "\u6587\u6863"),
        import_react14.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: refreshStatus, title: "\u5237\u65B0\u72B6\u6001" }, glyph(ICONS.refresh), " \u5237\u65B0\u72B6\u6001")
      ),
      selectedId != null ? import_react14.default.createElement(
        "label",
        {
          className: "cpwb-drop" + (dragActive ? " cpwb-drop-active" : ""),
          onDrop,
          onDragOver: function(e93) {
            e93.preventDefault();
            if (!uploading) setDragActive(true);
          },
          onDragLeave: function() {
            setDragActive(false);
          }
        },
        import_react14.default.createElement("input", { type: "file", multiple: true, accept: ACCEPT, disabled: uploading, style: { display: "none" }, onChange: function(e93) {
          handleFiles(e93.target.files);
          e93.target.value = "";
        } }),
        glyph(ICONS.upload),
        " \u9009\u62E9\u6587\u4EF6\u6216\u62D6\u62FD\u5230\u300C" + (selected ? selected.name : "\u77E5\u8BC6\u5E93") + "\u300D"
      ) : import_react14.default.createElement(Empty, { glyph: glyph(ICONS.db, 18) }, "\u9009\u62E9\u6216\u65B0\u5EFA\u77E5\u8BC6\u5E93\u540E\u4E0A\u4F20\u6587\u4EF6"),
      pending.length > 0 ? import_react14.default.createElement(
        "div",
        { className: "cpwb-upload-block" },
        import_react14.default.createElement("div", { className: "cpwb-item-meta" }, "\u4E0A\u4F20\u8FDB\u5EA6 " + uploadDone + "/" + uploadTotal),
        pending.map(function(p3) {
          const label = uploadStatusLabel(p3.index, uploadAction);
          return import_react14.default.createElement(
            "div",
            { key: p3.key, className: "cpwb-upload-file" },
            import_react14.default.createElement("span", { className: "cpwb-item-title" }, p3.name),
            import_react14.default.createElement(Badge, { kind: label === "\u5931\u8D25" ? "overdue" : "pending" }, label)
          );
        })
      ) : null,
      selectedId == null ? null : documents.length === 0 ? import_react14.default.createElement(Empty, { glyph: glyph(ICONS.doc, 18) }, "\u8BE5\u77E5\u8BC6\u5E93\u6682\u65E0\u6587\u6863") : import_react14.default.createElement("div", { className: "cpwb-list" }, documents.map(function(d) {
        return renderDocumentItem(d, reindex, unlink, reindexing, unlinkingDoc);
      }))
    ) : null,
    selectedId != null && showRetrieval ? import_react14.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react14.default.createElement("div", { className: "cpwb-section-head" }, import_react14.default.createElement("div", { className: "cpwb-label" }, "\u77E5\u8BC6\u5E93\u68C0\u7D22")),
      import_react14.default.createElement(
        "div",
        { className: "cpwb-addrow" },
        import_react14.default.createElement("input", { className: "cpwb-input", value: query, placeholder: "\u68C0\u7D22\u8BE5\u77E5\u8BC6\u5E93\u2026", onChange: function(e93) {
          setQuery(e93.target.value);
        }, onKeyDown: function(e93) {
          if (e93.key === "Enter") runSearch();
        } }),
        import_react14.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: runSearch, title: "\u68C0\u7D22", disabled: searching }, glyph(ICONS.search))
      ),
      citations.length === 0 ? import_react14.default.createElement(Empty, { glyph: glyph(ICONS.search, 18) }, "\u8F93\u5165\u5173\u952E\u8BCD\u68C0\u7D22\u77E5\u8BC6\u5E93\u5185\u5BB9") : import_react14.default.createElement("div", { className: "cpwb-citations" }, citations.map(renderCitation))
    ) : null,
    selectedId != null && showSessions ? import_react14.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react14.default.createElement(
        "div",
        { className: "cpwb-section-head" },
        import_react14.default.createElement("div", { className: "cpwb-label" }, "\u77E5\u8BC6\u5E93\u95EE\u7B54"),
        import_react14.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: function() {
          openChat(null);
        }, disabled: openingChat, title: "\u65B0\u5EFA\u804A\u5929" }, glyph(ICONS.plus), " \u65B0\u5EFA\u804A\u5929")
      ),
      chatError ? import_react14.default.createElement("div", { className: "cpwb-error-msg" }, chatError) : null,
      knowledgeSessions.length === 0 ? import_react14.default.createElement(Empty, { glyph: glyph(ICONS.book, 18) }, "\u9009\u62E9\u77E5\u8BC6\u5E93\u540E\u65B0\u5EFA\u4F1A\u8BDD") : import_react14.default.createElement("div", { className: "cpwb-kb-list" }, knowledgeSessions.map(function(session) {
        return import_react14.default.createElement(
          "div",
          { key: session.sessionId, className: "cpwb-kb-row" },
          import_react14.default.createElement(
            "button",
            { type: "button", className: "cpwb-kb-name", onClick: function() {
              openChat(session.sessionId);
            }, title: "\u6253\u5F00\u4F1A\u8BDD" },
            glyph(ICONS.book),
            " " + (session.title || "\u672A\u547D\u540D\u4F1A\u8BDD")
          )
        );
      }))
    ) : null,
    deleteTarget ? import_react14.default.createElement(ContainerDeleteDialog, { kind: "knowledge_base", target: deleteTarget, store: store3, onClose: () => setDeleteTarget(null) }) : null
  );
}

// src/client/Automation.js
var import_react16 = __toESM(require("react"), 1);
var RECURRENCE_LABELS = { once: "\u4EC5\u4E00\u6B21", daily: "\u6BCF\u65E5", weekly: "\u6BCF\u5468", monthly: "\u6BCF\u6708" };
var SUMMARY_STATUS_LABELS = { completed: "\u5DF2\u5B8C\u6210", pending: "\u751F\u6210\u4E2D", failed: "\u5931\u8D25" };
var pad2 = (value) => String(value).padStart(2, "0");
function filterSchedules(schedules, query = "") {
  const needle = String(query ?? "").trim().toLocaleLowerCase();
  if (!needle) return Array.isArray(schedules) ? schedules : [];
  return (Array.isArray(schedules) ? schedules : []).filter((schedule) => {
    return [schedule?.name, schedule?.prompt].some((value) => String(value || "").toLocaleLowerCase().includes(needle));
  });
}
function buildSummaryMarkdown({ projectName, summary }) {
  const name = String(projectName || "\u9879\u76EE").trim() || "\u9879\u76EE";
  const date = String(summary?.summaryDate || "\u672A\u77E5\u65E5\u671F");
  const status = SUMMARY_STATUS_LABELS[summary?.status] || String(summary?.status || "\u672A\u77E5");
  const content = String(summary?.content || "\u6682\u65E0\u5185\u5BB9").trim();
  const safeName = name.replace(/[\\/:*?"<>|]+/g, "-").replace(/[. ]+$/g, "") || "\u9879\u76EE";
  return {
    filename: `${safeName}-${date}-\u6BCF\u65E5\u603B\u7ED3.md`,
    content: `# ${name} \u6BCF\u65E5\u603B\u7ED3

- \u65E5\u671F\uFF1A${date}
- \u72B6\u6001\uFF1A${status}

${content}
`
  };
}
function downloadSummaryMarkdown({ projectName, summary }) {
  const output = buildSummaryMarkdown({ projectName, summary });
  const blob = new Blob([output.content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = output.filename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
function fmtTime(value, timeZone = DEFAULT_TIME_ZONE) {
  if (!value) return "\u672A\u5B89\u6392";
  try {
    return formatInstant(value, timeZone);
  } catch {
    return String(value);
  }
}
function dateTimeFields(value, timeZone) {
  const parts2 = localDateTimeParts(value || new Date(Date.now() + 60 * 60 * 1e3), timeZone);
  return { date: `${parts2.year}-${pad2(parts2.month)}-${pad2(parts2.day)}`, time: `${pad2(parts2.hour)}:${pad2(parts2.minute)}` };
}
function inferredRecurrence(schedule) {
  if (schedule?.recurrence) return schedule.recurrence;
  const kind = String(schedule?.rule || "").split(/\s+/)[0];
  return ["once", "daily", "weekly", "monthly"].includes(kind) ? kind : "daily";
}
function Feedback({ action, type, errorsOnly = false }) {
  if (!action || action.type !== type) return null;
  const iconProps = { size: 15, weight: "bold", "aria-hidden": true };
  if (action.status === "running" && !errorsOnly) return import_react16.default.createElement("div", { className: "cpwb-status cpwb-status-loading", role: "status" }, import_react16.default.createElement(m9, iconProps), import_react16.default.createElement("span", null, "\u6267\u884C\u4E2D\u2026"));
  if (action.status === "error") return import_react16.default.createElement("div", { className: "cpwb-status cpwb-status-error", role: "alert" }, import_react16.default.createElement(c7, iconProps), import_react16.default.createElement("span", null, action.error?.message || "\u64CD\u4F5C\u5931\u8D25"));
  if (action.status === "done" && !errorsOnly) return import_react16.default.createElement("div", { className: "cpwb-status cpwb-status-success", role: "status" }, import_react16.default.createElement(s7, iconProps), import_react16.default.createElement("span", null, "\u5DF2\u5B8C\u6210"));
  return null;
}
function ScheduleDialog({ schedule, projectId = null, projects = [], timeZone, busy, error, onSave, onDelete, onClose }) {
  const initial = dateTimeFields(schedule?.startsAt || schedule?.nextRunAt, timeZone);
  const [name, setName] = import_react16.default.useState(schedule?.name || "");
  const [prompt, setPrompt] = import_react16.default.useState(schedule?.prompt || "");
  const [recurrence, setRecurrence] = import_react16.default.useState(inferredRecurrence(schedule));
  const [date, setDate] = import_react16.default.useState(initial.date);
  const [time, setTime] = import_react16.default.useState(initial.time);
  const [enabled, setEnabled] = import_react16.default.useState(schedule?.enabled !== false);
  const [confirmDelete, setConfirmDelete] = import_react16.default.useState(false);
  const [localError, setLocalError] = import_react16.default.useState("");
  const [selectedProjectId, setSelectedProjectId] = import_react16.default.useState(projectId == null ? String(schedule?.projectId || "") : String(projectId));
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !date || !time || !selectedProjectId) {
      setLocalError(projectId == null ? "\u6240\u5C5E\u9879\u76EE\u3001\u540D\u79F0\u3001\u65E5\u671F\u548C\u65F6\u95F4\u5747\u4E3A\u5FC5\u586B\u9879" : "\u540D\u79F0\u3001\u65E5\u671F\u548C\u65F6\u95F4\u5747\u4E3A\u5FC5\u586B\u9879");
      return;
    }
    let startsAt;
    try {
      startsAt = zonedDateTimeToUtc(date, time, timeZone).toISOString();
    } catch (cause) {
      setLocalError(cause.message);
      return;
    }
    onSave({ projectId: Number(selectedProjectId), name: name.trim(), prompt: prompt.trim() || null, recurrence, startsAt, enabled }).catch(() => {
    });
  };
  return import_react16.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-schedule-dialog-title" },
    import_react16.default.createElement(
      "form",
      { className: "cpwb-modal cpwb-schedule-modal", onSubmit: submit },
      import_react16.default.createElement("div", { className: "cpwb-modal-kicker" }, schedule ? "SCHEDULE / DETAILS" : "SCHEDULE / NEW"),
      import_react16.default.createElement("h3", { id: "cpwb-schedule-dialog-title" }, schedule ? "\u5B9A\u65F6\u4EFB\u52A1\u8BE6\u60C5" : "\u65B0\u589E\u5B9A\u65F6\u4EFB\u52A1"),
      projectId == null ? import_react16.default.createElement("label", null, "\u9009\u62E9\u6240\u5C5E\u9879\u76EE", import_react16.default.createElement(CyberSelect, {
        value: selectedProjectId,
        onChange: setSelectedProjectId,
        ariaLabel: "\u9009\u62E9\u5B9A\u65F6\u4EFB\u52A1\u6240\u5C5E\u9879\u76EE",
        placeholder: "\u8BF7\u9009\u62E9\u9879\u76EE",
        options: [{ value: "", label: "\u8BF7\u9009\u62E9\u9879\u76EE" }, ...projects.map((project) => ({ value: String(project.id), label: project.name }))]
      })) : null,
      import_react16.default.createElement("label", null, "\u4EFB\u52A1\u540D\u79F0", import_react16.default.createElement("input", { autoFocus: true, value: name, onChange: (event) => setName(event.target.value), placeholder: "\u4F8B\u5982\uFF1A\u751F\u6210\u9879\u76EE\u5468\u62A5" })),
      import_react16.default.createElement("label", null, "\u6267\u884C\u63D0\u793A\u8BCD", import_react16.default.createElement("textarea", { value: prompt, onChange: (event) => setPrompt(event.target.value), placeholder: "\u544A\u8BC9\u6A21\u578B\u9700\u8981\u5B8C\u6210\u4EC0\u4E48" })),
      import_react16.default.createElement("div", { className: "cpwb-recurrence-picker", role: "group", "aria-label": "\u91CD\u590D\u9891\u7387" }, Object.entries(RECURRENCE_LABELS).map(([value, label]) => import_react16.default.createElement("button", {
        key: value,
        type: "button",
        className: recurrence === value ? "cpwb-active" : "",
        "aria-pressed": recurrence === value,
        onClick: () => setRecurrence(value)
      }, label))),
      import_react16.default.createElement(
        "div",
        { className: "cpwb-form-grid" },
        import_react16.default.createElement("label", null, recurrence === "once" ? "\u6267\u884C\u65E5\u671F" : "\u9996\u6B21\u6267\u884C\u65E5\u671F", import_react16.default.createElement("input", { type: "date", value: date, onChange: (event) => setDate(event.target.value) })),
        import_react16.default.createElement("label", null, "\u6267\u884C\u65F6\u95F4", import_react16.default.createElement("input", { type: "time", value: time, onChange: (event) => setTime(event.target.value) }))
      ),
      import_react16.default.createElement("label", { className: "cpwb-switch-row" }, import_react16.default.createElement("span", null, "\u542F\u7528\u4EFB\u52A1"), import_react16.default.createElement("input", { type: "checkbox", checked: enabled, onChange: (event) => setEnabled(event.target.checked) })),
      localError || error ? import_react16.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, localError || error.message || String(error)) : null,
      confirmDelete ? import_react16.default.createElement("div", { className: "cpwb-danger-confirm" }, import_react16.default.createElement("span", null, "\u5220\u9664\u540E\u6267\u884C\u5386\u53F2\u4E5F\u4F1A\u6E05\u9664\u3002"), import_react16.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: busy, onClick: () => onDelete().catch(() => {
      }) }, "\u786E\u8BA4\u5220\u9664")) : null,
      import_react16.default.createElement(
        "div",
        { className: "cpwb-modal-actions cpwb-modal-actions-split" },
        schedule ? import_react16.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", onClick: () => setConfirmDelete(true) }, import_react16.default.createElement(n15, { size: 15 }), import_react16.default.createElement("span", null, "\u5220\u9664")) : import_react16.default.createElement("span", null),
        import_react16.default.createElement("div", { className: "cpwb-row" }, import_react16.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: onClose }, "\u53D6\u6D88"), import_react16.default.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: busy }, busy ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"))
      )
    )
  );
}
function SummaryDeleteDialog({ summary, busy, error, onConfirm, onClose }) {
  return import_react16.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-summary-delete-title" },
    import_react16.default.createElement(
      "div",
      { className: "cpwb-modal" },
      import_react16.default.createElement("div", { className: "cpwb-modal-kicker" }, "SUMMARY / DELETE"),
      import_react16.default.createElement("h3", { id: "cpwb-summary-delete-title" }, "\u5220\u9664\u6BCF\u65E5\u603B\u7ED3"),
      import_react16.default.createElement("p", null, `\u786E\u5B9A\u5220\u9664 ${summary.summaryDate} \u7684\u6BCF\u65E5\u603B\u7ED3\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u4F1A\u5220\u9664\u9879\u76EE\u6216\u4F1A\u8BDD\u3002`),
      error ? import_react16.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, error.message || String(error)) : null,
      import_react16.default.createElement(
        "div",
        { className: "cpwb-modal-actions" },
        import_react16.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: busy, onClick: onClose }, "\u53D6\u6D88"),
        import_react16.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: busy, onClick: () => onConfirm().catch(() => {
        }) }, busy ? "\u5220\u9664\u4E2D\u2026" : "\u786E\u8BA4\u5220\u9664")
      )
    )
  );
}
function Automation({ store: store3, projectId, view = "all", initialDialog = null, initialQuery = "" }) {
  const state = import_react16.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const [dialog, setDialog] = import_react16.default.useState(initialDialog === "create" ? { schedule: null } : null);
  const [summaryToDelete, setSummaryToDelete] = import_react16.default.useState(null);
  const [query, setQuery] = import_react16.default.useState(initialQuery);
  const schedules = Array.isArray(state.schedules) ? state.schedules : [];
  const visibleSchedules = filterSchedules(schedules, query);
  const scheduleRuns = state.scheduleRuns || {};
  const summaries = Array.isArray(state.summaries) ? state.summaries : [];
  const automation = state.automation || { summaryEnabled: true, nextDayTodosEnabled: true };
  const action = state.action;
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const projectName = state.projects?.find((project) => project.id === projectId)?.name || "\u9879\u76EE";
  const scheduleAction = ["createSchedule", "updateSchedule", "deleteSchedule"].includes(action?.type) ? action : null;
  const summaryGenerating = action?.type === "runSummary" && action.status === "running";
  const summaryDeleting = action?.type === "deleteSummary" && action.status === "running";
  const arrivingSummaryIds = useArrivalPulse(summaries);
  const save = (payload) => {
    const schedule = dialog?.schedule;
    const operation = schedule ? store3.actions.updateSchedule({ id: schedule.id, ...payload }) : store3.actions.createSchedule({ projectId, ...payload });
    return operation.then(() => setDialog(null));
  };
  const remove = () => store3.actions.deleteSchedule(dialog.schedule.id).then(() => setDialog(null));
  const toggle = (field) => store3.actions.updateAutomation({
    projectId,
    summaryEnabled: field === "summaryEnabled" ? !automation.summaryEnabled : automation.summaryEnabled,
    nextDayTodosEnabled: field === "nextDayTodosEnabled" ? !automation.nextDayTodosEnabled : automation.nextDayTodosEnabled
  }).catch(() => {
  });
  const scheduleNodes = visibleSchedules.map((schedule) => {
    const runs = Array.isArray(scheduleRuns[schedule.id]) ? scheduleRuns[schedule.id] : [];
    const latest = runs.at(-1);
    return import_react16.default.createElement(
      "article",
      { key: schedule.id, className: "cpwb-schedule-row", onClick: () => setDialog({ schedule }) },
      import_react16.default.createElement("div", { className: "cpwb-schedule-icon" }, import_react16.default.createElement(s8, { size: 18, weight: "regular" })),
      import_react16.default.createElement("div", { className: "cpwb-item-main" }, import_react16.default.createElement("div", { className: "cpwb-item-title" }, schedule.name), import_react16.default.createElement("div", { className: "cpwb-item-meta" }, `${RECURRENCE_LABELS[inferredRecurrence(schedule)]} \xB7 \u4E0B\u6B21 ${fmtTime(schedule.nextRunAt, timeZone)}`), latest ? import_react16.default.createElement("div", { className: "cpwb-item-meta" }, "\u6700\u8FD1\u6267\u884C \xB7 " + (latest.status || "unknown")) : null),
      import_react16.default.createElement("span", { className: "cpwb-schedule-state " + (schedule.enabled === false ? "cpwb-off" : "cpwb-on") }, schedule.enabled === false ? "\u505C\u7528" : "\u8FD0\u884C\u4E2D"),
      import_react16.default.createElement("button", { type: "button", className: "cpwb-icon-button", title: "\u7ACB\u5373\u8FD0\u884C", "aria-label": "\u7ACB\u5373\u8FD0\u884C " + schedule.name, disabled: schedule.enabled === false || action?.type === "runSchedule" && action.scheduleId === schedule.id && action.status === "running", onClick: (event) => {
        event.stopPropagation();
        store3.actions.runSchedule(schedule.id).catch(() => {
        });
      } }, import_react16.default.createElement(n11, { size: 14, weight: "fill" })),
      import_react16.default.createElement("button", { type: "button", className: "cpwb-icon-button", "aria-label": "\u7F16\u8F91 " + schedule.name, onClick: (event) => {
        event.stopPropagation();
        setDialog({ schedule });
      } }, import_react16.default.createElement(a63, { size: 14 }))
    );
  });
  const summaryNodes = summaries.map((summary) => {
    const downloadable = summary.status === "completed" && typeof summary.content === "string" && summary.content.trim() !== "";
    const displayContent = summary.status === "failed" ? "\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u751F\u6210" : summary.content || "\u6682\u65E0\u5185\u5BB9";
    return import_react16.default.createElement(
      "article",
      { key: summary.id, className: "cpwb-summary-entry" + (arrivingSummaryIds.has(String(summary.id)) ? " cpwb-entry-arrived" : "") },
      import_react16.default.createElement(
        "div",
        { className: "cpwb-summary-head" },
        import_react16.default.createElement("div", { className: "cpwb-item-meta" }, summary.summaryDate),
        import_react16.default.createElement(
          "div",
          { className: "cpwb-summary-actions" },
          downloadable ? import_react16.default.createElement("button", { type: "button", className: "cpwb-icon-button", title: "\u4E0B\u8F7D Markdown", "aria-label": `\u4E0B\u8F7D ${summary.summaryDate} \u6BCF\u65E5\u603B\u7ED3`, onClick: () => downloadSummaryMarkdown({ projectName, summary }) }, import_react16.default.createElement(l6, { size: 14 })) : null,
          import_react16.default.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", title: "\u5220\u9664", "aria-label": `\u5220\u9664 ${summary.summaryDate} \u6BCF\u65E5\u603B\u7ED3`, onClick: () => setSummaryToDelete(summary) }, import_react16.default.createElement(n15, { size: 14 }))
        )
      ),
      summary.status === "pending" ? import_react16.default.createElement(GenerationWave, { label: "\u6B63\u5728\u751F\u6210\u6BCF\u65E5\u603B\u7ED3" }) : import_react16.default.createElement("div", { className: "cpwb-summary-content" + (summary.status === "failed" ? " cpwb-summary-failed" : ""), role: summary.status === "failed" ? "alert" : void 0 }, displayContent)
    );
  });
  return import_react16.default.createElement(
    "div",
    null,
    view !== "schedule" ? import_react16.default.createElement("section", { className: "cpwb-section" }, import_react16.default.createElement("div", { className: "cpwb-section-head" }, import_react16.default.createElement("div", { className: "cpwb-label" }, "\u81EA\u52A8\u5316\u5F00\u5173")), import_react16.default.createElement("div", { className: "cpwb-toggle-row" }, import_react16.default.createElement("span", null, "21:00 \u6BCF\u65E5\u603B\u7ED3"), import_react16.default.createElement("button", { type: "button", className: "cpwb-toggle" + (automation.summaryEnabled ? " cpwb-on" : ""), onClick: () => toggle("summaryEnabled") }, automation.summaryEnabled ? "\u5F00" : "\u5173")), import_react16.default.createElement("div", { className: "cpwb-toggle-row" }, import_react16.default.createElement("span", null, "21:00 \u6B21\u65E5\u5F85\u529E"), import_react16.default.createElement("button", { type: "button", className: "cpwb-toggle" + (automation.nextDayTodosEnabled ? " cpwb-on" : ""), onClick: () => toggle("nextDayTodosEnabled") }, automation.nextDayTodosEnabled ? "\u5F00" : "\u5173")), import_react16.default.createElement(Feedback, { action, type: "updateAutomation" })) : null,
    view !== "summary" ? import_react16.default.createElement("section", { className: "cpwb-tool-panel" }, import_react16.default.createElement("div", { className: "cpwb-tool-head" }, import_react16.default.createElement("span", null, "SCHEDULES // " + String(visibleSchedules.length).padStart(2, "0")), import_react16.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", onClick: () => setDialog({ schedule: null }) }, import_react16.default.createElement(n13, { size: 14, weight: "bold" }), import_react16.default.createElement("span", null, "\u65B0\u589E"))), import_react16.default.createElement("label", { className: "cpwb-tool-search" }, import_react16.default.createElement("span", { "aria-hidden": true }, "\u2315"), import_react16.default.createElement("input", { type: "search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "\u641C\u7D22\u540D\u79F0\u6216\u63D0\u793A\u8BCD", "aria-label": "\u641C\u7D22\u5B9A\u65F6\u4EFB\u52A1" })), import_react16.default.createElement(Feedback, { action, type: "runSchedule" }), visibleSchedules.length === 0 ? import_react16.default.createElement(Empty, { glyph: import_react16.default.createElement(c2, { size: 20 }) }, schedules.length ? "\u6CA1\u6709\u5339\u914D\u7684\u5B9A\u65F6\u4EFB\u52A1" : "\u6682\u65E0\u5B9A\u65F6\u4EFB\u52A1") : import_react16.default.createElement("div", { className: "cpwb-list" }, scheduleNodes)) : null,
    view !== "schedule" ? import_react16.default.createElement("section", { className: "cpwb-section" }, import_react16.default.createElement("div", { className: "cpwb-section-head" }, import_react16.default.createElement("div", { className: "cpwb-label" }, "\u6BCF\u65E5\u603B\u7ED3\u8BB0\u5F55"), import_react16.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-button-content", disabled: summaryGenerating, "aria-busy": summaryGenerating || void 0, onClick: () => store3.actions.runSummary({ projectId, summaryDate: localDateKey() }).catch(() => {
    }) }, import_react16.default.createElement(n11, { size: 13 }), import_react16.default.createElement("span", null, "\u7ACB\u5373\u751F\u6210"))), summaryGenerating ? import_react16.default.createElement(GenerationWave, { label: "\u6B63\u5728\u751F\u6210\u6BCF\u65E5\u603B\u7ED3" }) : null, import_react16.default.createElement(Feedback, { action, type: "runSummary", errorsOnly: true }), import_react16.default.createElement(Feedback, { action, type: "deleteSummary", errorsOnly: true }), summaries.length === 0 ? import_react16.default.createElement(Empty, { glyph: import_react16.default.createElement(c2, { size: 20 }) }, "\u6682\u65E0\u603B\u7ED3\u8BB0\u5F55") : summaryNodes) : null,
    dialog ? import_react16.default.createElement(ScheduleDialog, { schedule: dialog.schedule, projectId, timeZone, busy: scheduleAction?.status === "running", error: scheduleAction?.status === "error" ? scheduleAction.error : null, onSave: save, onDelete: remove, onClose: () => setDialog(null) }) : null,
    summaryToDelete ? import_react16.default.createElement(SummaryDeleteDialog, { summary: summaryToDelete, busy: summaryDeleting, error: action?.type === "deleteSummary" && action.status === "error" ? action.error : null, onConfirm: () => store3.actions.deleteSummary({ id: summaryToDelete.id, projectId }).then(() => setSummaryToDelete(null)), onClose: () => setSummaryToDelete(null) }) : null
  );
}

// src/client/rail.js
var RAIL_WIDTH_MIN = 280;
var RAIL_WIDTH_MAX = 420;
var RAIL_WIDTH_DEFAULT = 320;
var RAIL_DRAWER_BREAKPOINT = 1280;
function clampRailWidth(value) {
  return Math.min(RAIL_WIDTH_MAX, Math.max(RAIL_WIDTH_MIN, value));
}
function isDrawerMode(viewportWidth) {
  return viewportWidth < RAIL_DRAWER_BREAKPOINT;
}
function conversationCompression(railWidth) {
  const width = clampRailWidth(railWidth);
  return {
    paddingRight: width + "px",
    cssVariable: { name: "--cpwb-rail-width", value: width + "px" }
  };
}
var RAIL_STYLE_PROPS = ["box-sizing", "padding-right", "--cpwb-rail-width"];
function resolveSlotColumn(slotEl) {
  if (!slotEl || typeof slotEl !== "object") return null;
  return slotEl.parentElement || null;
}
function resolveWorkbenchColumns(root) {
  const query = typeof root?.querySelector === "function" ? root.querySelector.bind(root) : function() {
    return null;
  };
  return {
    sidebarColumn: resolveSlotColumn(query('[data-slot="sidebar"]')),
    conversationColumn: resolveSlotColumn(query('[data-slot="conversation"]')),
    detailsColumn: resolveSlotColumn(query('[data-slot="details"]'))
  };
}
function captureInlineStyle(el, props) {
  const snapshot = {};
  if (el && el.style && typeof el.style.getPropertyValue === "function") {
    for (const prop of props) snapshot[prop] = el.style.getPropertyValue(prop);
  } else {
    for (const prop of props) snapshot[prop] = "";
  }
  return snapshot;
}
function applyInlineStyle(el, values) {
  if (!el || !el.style) return;
  for (const prop of Object.keys(values || {})) {
    const value = values[prop];
    if (value == null || value === "") {
      if (typeof el.style.removeProperty === "function") el.style.removeProperty(prop);
    } else if (typeof el.style.setProperty === "function") {
      el.style.setProperty(prop, value);
    }
  }
}
function restoreInlineStyle(el, snapshot) {
  if (!el || !el.style) return;
  for (const prop of Object.keys(snapshot || {})) {
    const original = snapshot[prop];
    if (original == null || original === "") {
      if (typeof el.style.removeProperty === "function") el.style.removeProperty(prop);
    } else if (typeof el.style.setProperty === "function") {
      el.style.setProperty(prop, original);
    }
  }
}

// src/client/SubagentDrawer.js
var import_react18 = __toESM(require("react"), 1);

// src/client/subagents.js
var rpcSequence = 0;
function request(payload) {
  rpcSequence += 1;
  const entropy = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Date.now().toString(36) + "-" + rpcSequence.toString(36);
  return { rpcId: "cpwb-" + entropy, payload };
}
function valueOf(response) {
  const result = response?.result;
  if (result?.ok === true) return result.value;
  const error = new Error(result?.error?.message || "DSH Subagent \u8BF7\u6C42\u5931\u8D25");
  error.code = result?.error?.code || "SUBAGENT_REQUEST_FAILED";
  error.details = result?.error?.details || {};
  throw error;
}
function healthySubagentEntries(catalog) {
  return (Array.isArray(catalog?.entries) ? catalog.entries : []).filter((entry) => entry?.kind === "child");
}
function textBlocks(content) {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content.filter((block) => block && (block.type === "text" || block.kind === "text")).map((block) => String(block.text || "").trim()).filter(Boolean).join("\n");
}
function subagentHistoryToTranscript(entries) {
  const rows = [];
  for (const item of Array.isArray(entries) ? entries : []) {
    const event = item?.event || item;
    const seq = event?.seq ?? rows.length;
    if (event?.type === "user/message") {
      const text = textBlocks(event.data?.content);
      if (text) rows.push({ key: "user-" + seq, role: "user", text, seq });
    } else if (event?.type === "assistant/message") {
      const text = textBlocks(event.data?.message?.content);
      if (text) rows.push({ key: "assistant-" + seq, role: "assistant", text, seq });
    } else if (event?.type === "tool/call") {
      rows.push({ key: "tool-call-" + seq, role: "tool", text: "\u8C03\u7528 " + (event.data?.name || "tool"), seq });
    } else if (event?.type === "tool/result") {
      const text = textBlocks(event.data?.message?.content) || (event.data?.error ? "\u5DE5\u5177\u6267\u884C\u5931\u8D25" : "\u5DE5\u5177\u6267\u884C\u5B8C\u6210");
      rows.push({ key: "tool-result-" + seq, role: "tool", text, seq });
    }
  }
  return rows;
}
function createSubagentClient(connection) {
  const api = connection?.api?.subagents;
  const requireApi = function(method) {
    if (typeof api?.[method] !== "function") {
      const error = new Error("\u5F53\u524D DSH \u672A\u63D0\u4F9B Subagent " + method + " \u63A5\u53E3\uFF0C\u8BF7\u786E\u8BA4\u5DF2\u5347\u7EA7\u5230 0.1.1-rc.2");
      error.code = "SUBAGENT_API_UNAVAILABLE";
      throw error;
    }
    return api[method].bind(api);
  };
  return {
    async list(parentSessionId, options = {}) {
      return valueOf(await requireApi("list")(request({ parentSessionId }), options.signal));
    },
    async history(address, options = {}) {
      const payload = { ...address };
      if (options.beforeSeq != null) payload.beforeSeq = options.beforeSeq;
      payload.maxMessages = options.maxMessages ?? 50;
      return valueOf(await requireApi("history")(request(payload), options.signal));
    },
    async prompt(address, text, options = {}) {
      const payload = {
        ...address,
        content: [{ type: "text", text: String(text || "").trim() }]
      };
      if (options.clientTimeZone) payload.clientTimeZone = options.clientTimeZone;
      return valueOf(await requireApi("prompt")(request(payload), options.signal));
    },
    async interrupt(address) {
      return valueOf(await requireApi("interrupt")(request(address)));
    }
  };
}

// src/client/SubagentDrawer.js
function emptySessionsSnapshot() {
  return { subagentsByParent: {} };
}
function useSessionsSnapshot(sessions) {
  const source = sessions?.list;
  return import_react18.default.useSyncExternalStore(
    source?.subscribe || (() => () => {
    }),
    source?.getSnapshot || emptySessionsSnapshot,
    source?.getSnapshot || emptySessionsSnapshot
  );
}
function Selector({ entries, selectedId, onSelect }) {
  const [open, setOpen] = import_react18.default.useState(false);
  const selected = entries.find((entry) => entry.id === selectedId) || entries[0];
  return import_react18.default.createElement(
    "div",
    { className: "cpwb-subagent-selector" },
    import_react18.default.createElement(
      "button",
      {
        type: "button",
        className: "cpwb-subagent-selector-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        onClick: () => setOpen((value) => !value)
      },
      import_react18.default.createElement(
        "span",
        null,
        import_react18.default.createElement("strong", null, selected?.label || selected?.id || "\u9009\u62E9\u5B50\u667A\u80FD\u4F53"),
        selected ? import_react18.default.createElement("small", null, selected.activity === "running" ? "RUNNING" : "INACTIVE") : null
      ),
      import_react18.default.createElement(s5, { size: 16, weight: "bold", "aria-hidden": true })
    ),
    open ? import_react18.default.createElement(
      "div",
      { className: "cpwb-subagent-selector-menu", role: "listbox", "aria-label": "\u9009\u62E9\u5B50\u667A\u80FD\u4F53" },
      entries.map((entry, index) => import_react18.default.createElement(
        "button",
        {
          type: "button",
          role: "option",
          key: entry.id,
          "aria-selected": entry.id === selected?.id,
          className: entry.id === selected?.id ? "cpwb-selected" : "",
          onClick() {
            onSelect(entry.id);
            setOpen(false);
          }
        },
        import_react18.default.createElement("b", null, String(index + 1).padStart(2, "0")),
        import_react18.default.createElement(
          "span",
          null,
          import_react18.default.createElement("strong", null, entry.label || entry.id),
          import_react18.default.createElement("small", null, entry.activity.toUpperCase() + " / " + entry.mode.toUpperCase())
        ),
        import_react18.default.createElement("em", null, entry.mode === "one-shot" ? "ONE-SHOT" : "CONTINUABLE")
      ))
    ) : null
  );
}
function InfoLayer({ entry, parentSessionId, onClose }) {
  return import_react18.default.createElement(
    "section",
    { className: "cpwb-subagent-info-layer", "aria-label": "\u5B50\u667A\u80FD\u4F53\u8BE6\u60C5" },
    import_react18.default.createElement(
      "header",
      null,
      import_react18.default.createElement("div", null, import_react18.default.createElement("span", null, "SUBAGENT PROFILE"), import_react18.default.createElement("h3", null, entry.label || entry.id)),
      import_react18.default.createElement("button", { type: "button", onClick: onClose, "aria-label": "\u5173\u95ED\u5B50\u667A\u80FD\u4F53\u8BE6\u60C5" }, import_react18.default.createElement(n17, { size: 18 }))
    ),
    import_react18.default.createElement(
      "div",
      { className: "cpwb-subagent-info-grid" },
      import_react18.default.createElement(
        "dl",
        null,
        import_react18.default.createElement("div", null, import_react18.default.createElement("dt", null, "SESSION ID"), import_react18.default.createElement("dd", null, entry.id)),
        import_react18.default.createElement("div", null, import_react18.default.createElement("dt", null, "PARENT"), import_react18.default.createElement("dd", null, parentSessionId)),
        import_react18.default.createElement("div", null, import_react18.default.createElement("dt", null, "MODE"), import_react18.default.createElement("dd", null, entry.mode.toUpperCase())),
        import_react18.default.createElement("div", null, import_react18.default.createElement("dt", null, "ACTIVITY"), import_react18.default.createElement("dd", null, entry.activity.toUpperCase())),
        import_react18.default.createElement("div", null, import_react18.default.createElement("dt", null, "DESCENDANTS"), import_react18.default.createElement("dd", null, entry.hasChildren ? "AVAILABLE" : "NONE"))
      ),
      import_react18.default.createElement("p", null, entry.mode === "one-shot" ? "\u8BE5\u5B50\u667A\u80FD\u4F53\u662F\u4E00\u6B21\u6027\u6267\u884C\u8BB0\u5F55\u3002\u4F60\u53EF\u4EE5\u5BA1\u9605\u5B8C\u6574\u4F1A\u8BDD\uFF0C\u4F46\u4E0D\u80FD\u7EE7\u7EED\u5411\u5176\u53D1\u9001\u6D88\u606F\u3002" : "\u8BE5\u5B50\u667A\u80FD\u4F53\u652F\u6301\u591A\u8F6E\u7EED\u804A\u3002\u540E\u7EED\u6D88\u606F\u901A\u8FC7 rc.2 \u7684 parent-addressed FIFO \u901A\u9053\u53D1\u9001\u3002")
    )
  );
}
function SubagentDrawer({
  open,
  parentSessionId,
  connection,
  sessions,
  initialCatalog = null,
  initialHistory = null,
  onClose
}) {
  const sessionsSnapshot = useSessionsSnapshot(sessions);
  const liveCatalog = sessionsSnapshot?.subagentsByParent?.[parentSessionId];
  const [fallbackCatalog, setFallbackCatalog] = import_react18.default.useState(initialCatalog || { entries: [], parentAvailable: false });
  const catalog = liveCatalog?.entries ? liveCatalog : fallbackCatalog;
  const entries = healthySubagentEntries(catalog);
  const [selectedId, setSelectedId] = import_react18.default.useState(entries[0]?.id || null);
  const selected = entries.find((entry) => entry.id === selectedId) || entries[0] || null;
  const [history, setHistory] = import_react18.default.useState(Array.isArray(initialHistory) ? initialHistory : []);
  const [historyState, setHistoryState] = import_react18.default.useState(initialHistory ? "ready" : "idle");
  const [error, setError] = import_react18.default.useState(null);
  const [draft, setDraft] = import_react18.default.useState("");
  const [sending, setSending] = import_react18.default.useState(false);
  const [showInfo, setShowInfo] = import_react18.default.useState(false);
  const client = import_react18.default.useMemo(() => createSubagentClient(connection), [connection]);
  import_react18.default.useEffect(function() {
    if (!open || !parentSessionId) return void 0;
    sessions?.setSubagentCatalogOpen?.(parentSessionId, true);
    let stopped = false;
    const refresh = async function() {
      try {
        if (typeof sessions?.refreshSubagents === "function") await sessions.refreshSubagents(parentSessionId);
        else if (!stopped) setFallbackCatalog(await client.list(parentSessionId));
      } catch (cause) {
        if (!stopped) setError(cause);
      }
    };
    void refresh();
    return function() {
      stopped = true;
      sessions?.setSubagentCatalogOpen?.(parentSessionId, false);
    };
  }, [client, open, parentSessionId, sessions]);
  import_react18.default.useEffect(function() {
    if (selected && entries.some((entry) => entry.id === selectedId)) return;
    setSelectedId(entries[0]?.id || null);
  }, [entries, selected, selectedId]);
  const loadHistory = import_react18.default.useCallback(async function(signal) {
    if (!selected || !parentSessionId) return;
    setHistoryState((value) => value === "ready" ? "refreshing" : "loading");
    try {
      const result = await client.history({ parentSessionId, childSessionId: selected.id, mode: selected.mode }, { signal, maxMessages: 80 });
      if (signal?.aborted) return;
      setHistory(subagentHistoryToTranscript(result.events));
      setHistoryState("ready");
      setError(null);
    } catch (cause) {
      if (signal?.aborted) return;
      setError(cause);
      setHistoryState("error");
    }
  }, [client, parentSessionId, selected]);
  import_react18.default.useEffect(function() {
    if (!open || !selected || initialHistory) return void 0;
    const controller = new AbortController();
    let timer = null;
    let stopped = false;
    const poll = async function() {
      await loadHistory(controller.signal);
      if (!stopped && selected.activity === "running") timer = setTimeout(poll, 2200);
    };
    void poll();
    return function() {
      stopped = true;
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [initialHistory, loadHistory, open, selected]);
  import_react18.default.useEffect(function() {
    if (!open || typeof window === "undefined") return void 0;
    const onKeyDown = function(event) {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return function() {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);
  if (!open) return null;
  const refreshNow = function() {
    if (initialHistory) return;
    const controller = new AbortController();
    void loadHistory(controller.signal);
  };
  const sendFollowup = async function(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selected || selected.mode !== "continuable") return;
    setSending(true);
    setError(null);
    try {
      await client.prompt({ parentSessionId, childSessionId: selected.id, mode: "continuable" }, text, {
        clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      setDraft("");
      await sessions?.refreshSubagents?.(parentSessionId);
      await loadHistory();
    } catch (cause) {
      setError(cause);
    } finally {
      setSending(false);
    }
  };
  const interrupt = async function() {
    if (!selected || selected.mode !== "continuable") return;
    try {
      await client.interrupt({ parentSessionId, childSessionId: selected.id, mode: "continuable" });
      await sessions?.refreshSubagents?.(parentSessionId);
    } catch (cause) {
      setError(cause);
    }
  };
  return import_react18.default.createElement(
    "div",
    { className: "cpwb-subagent-backdrop", onMouseDown(event) {
      if (event.target === event.currentTarget) onClose?.();
    } },
    import_react18.default.createElement(
      "aside",
      { className: "cpwb-subagent-drawer", role: "dialog", "aria-modal": "true", "aria-label": "\u5B50\u667A\u80FD\u4F53\u6D3B\u52A8" },
      import_react18.default.createElement(
        "header",
        { className: "cpwb-subagent-drawer-header" },
        import_react18.default.createElement(
          "div",
          { className: "cpwb-subagent-heading" },
          import_react18.default.createElement(n14, { size: 21, weight: "duotone", "aria-hidden": true }),
          import_react18.default.createElement("div", null, import_react18.default.createElement("span", null, "SUBAGENT ACTIVITY"), import_react18.default.createElement("h2", null, "\u5B50\u667A\u80FD\u4F53\u4F1A\u8BDD"))
        ),
        import_react18.default.createElement(
          "div",
          { className: "cpwb-subagent-header-actions" },
          import_react18.default.createElement("button", { type: "button", onClick: refreshNow, "aria-label": "\u5237\u65B0\u5B50\u667A\u80FD\u4F53\u4F1A\u8BDD" }, import_react18.default.createElement(m, { size: 18, className: historyState === "refreshing" ? "cpwb-spin" : "" })),
          import_react18.default.createElement("button", { type: "button", onClick: () => setShowInfo(true), disabled: !selected, "aria-label": "\u67E5\u770B\u5B50\u667A\u80FD\u4F53\u8BE6\u60C5" }, import_react18.default.createElement(c5, { size: 19 })),
          import_react18.default.createElement("button", { type: "button", onClick: onClose, "aria-label": "\u5173\u95ED\u5B50\u667A\u80FD\u4F53\u62BD\u5C49" }, import_react18.default.createElement(n17, { size: 19 }))
        )
      ),
      entries.length > 0 ? import_react18.default.createElement(Selector, { entries, selectedId: selected?.id, onSelect(id) {
        setSelectedId(id);
        setHistory([]);
        setHistoryState("idle");
        setError(null);
      } }) : null,
      selected ? import_react18.default.createElement(
        "div",
        { className: "cpwb-subagent-statusbar" },
        import_react18.default.createElement("span", { className: selected.activity === "running" ? "cpwb-running" : "" }, selected.activity.toUpperCase()),
        import_react18.default.createElement("b", null, selected.mode === "one-shot" ? "ONE-SHOT" : "CONTINUABLE"),
        import_react18.default.createElement("small", null, "PARENT / " + parentSessionId)
      ) : null,
      import_react18.default.createElement(
        "div",
        { className: "cpwb-subagent-transcript", "aria-live": "polite" },
        entries.length === 0 ? import_react18.default.createElement("div", { className: "cpwb-subagent-empty" }, import_react18.default.createElement(n14, { size: 28 }), import_react18.default.createElement("strong", null, "\u6682\u65E0\u5B50\u667A\u80FD\u4F53\u6D3B\u52A8"), import_react18.default.createElement("p", null, "\u5F53\u524D\u4F1A\u8BDD\u542F\u52A8\u5B50\u667A\u80FD\u4F53\u540E\uFF0C\u4F1A\u5728\u8FD9\u91CC\u663E\u793A\u8FD0\u884C\u72B6\u6001\u548C\u4F1A\u8BDD\u8BB0\u5F55\u3002")) : historyState === "loading" && history.length === 0 ? import_react18.default.createElement("div", { className: "cpwb-subagent-empty" }, import_react18.default.createElement("strong", null, "\u6B63\u5728\u8BFB\u53D6\u4F1A\u8BDD\u8BB0\u5F55\u2026")) : history.length === 0 ? import_react18.default.createElement("div", { className: "cpwb-subagent-empty" }, import_react18.default.createElement("strong", null, "\u5C1A\u65E0\u53EF\u89C1\u6D88\u606F"), import_react18.default.createElement("p", null, "\u5B50\u667A\u80FD\u4F53\u53EF\u80FD\u4ECD\u5728\u521D\u59CB\u5316\uFF0C\u6216\u5F53\u524D\u8BB0\u5F55\u53EA\u5305\u542B\u8FD0\u884C\u4E8B\u4EF6\u3002")) : history.map((row) => import_react18.default.createElement(
          "article",
          { key: row.key, className: "cpwb-subagent-message cpwb-subagent-message-" + row.role },
          import_react18.default.createElement("span", null, row.role === "user" ? "PARENT" : row.role === "assistant" ? "SUBAGENT" : "TOOL"),
          import_react18.default.createElement("p", null, row.text)
        ))
      ),
      error ? import_react18.default.createElement("p", { className: "cpwb-subagent-error", role: "alert" }, error.message || String(error)) : null,
      selected?.mode === "one-shot" ? import_react18.default.createElement("footer", { className: "cpwb-subagent-readonly" }, "\u4E00\u6B21\u6027\u4EFB\u52A1\u4EC5\u652F\u6301\u67E5\u770B\u8BB0\u5F55") : selected ? import_react18.default.createElement(
        "form",
        { className: "cpwb-subagent-composer", onSubmit: sendFollowup },
        import_react18.default.createElement("textarea", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "\u5411\u5B50\u667A\u80FD\u4F53\u53D1\u9001\u6D88\u606F", "aria-label": "\u5411\u5B50\u667A\u80FD\u4F53\u53D1\u9001\u6D88\u606F", rows: 2 }),
        import_react18.default.createElement(
          "div",
          null,
          selected.activity === "running" ? import_react18.default.createElement("button", { type: "button", className: "cpwb-subagent-stop", onClick: interrupt }, import_react18.default.createElement(s14, { size: 15, weight: "fill" }), "\u505C\u6B62\u5F53\u524D\u8F6E\u6B21") : import_react18.default.createElement("span", null, catalog.parentAvailable === false ? "\u7236\u4F1A\u8BDD\u6682\u4E0D\u53EF\u7528" : "\u53EF\u7EE7\u7EED\u5BF9\u8BDD"),
          import_react18.default.createElement("button", { type: "submit", className: "cpwb-subagent-send", disabled: sending || !draft.trim() || catalog.parentAvailable === false }, import_react18.default.createElement(m7, { size: 16, weight: "fill" }), sending ? "\u53D1\u9001\u4E2D" : "\u53D1\u9001")
        )
      ) : null,
      showInfo && selected ? import_react18.default.createElement(InfoLayer, { entry: selected, parentSessionId, onClose: () => setShowInfo(false) }) : null
    )
  );
}

// src/client/SkillsManager.js
var import_react20 = __toESM(require("react"), 1);

// node_modules/fflate/esm/browser.js
var ch2 = {};
var wk = (function(c8, id, msg, transfer, cb) {
  var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
    c8 + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
  ], { type: "text/javascript" }))));
  w.onmessage = function(e93) {
    var d = e93.data, ed = d.$e$;
    if (ed) {
      var err2 = new Error(ed[0]);
      err2["code"] = ed[1];
      err2.stack = ed[2];
      cb(err2, null);
    } else
      cb(null, d);
  };
  w.postMessage(msg, transfer);
  return w;
});
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i3 = 0; i3 < 31; ++i3) {
    b[i3] = start += 1 << eb[i3 - 1];
  }
  var r14 = new i32(b[30]);
  for (var i3 = 1; i3 < 30; ++i3) {
    for (var j = b[i3]; j < b[i3 + 1]; ++j) {
      r14[j] = j - b[i3] << 5 | i3;
    }
  }
  return { b, r: r14 };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i2 = 0; i2 < 32768; ++i2) {
  x = (i2 & 43690) >> 1 | (i2 & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i2] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i2;
var hMap = (function(cd, mb, r14) {
  var s15 = cd.length;
  var i3 = 0;
  var l8 = new u16(mb);
  for (; i3 < s15; ++i3) {
    if (cd[i3])
      ++l8[cd[i3] - 1];
  }
  var le = new u16(mb);
  for (i3 = 1; i3 < mb; ++i3) {
    le[i3] = le[i3 - 1] + l8[i3 - 1] << 1;
  }
  var co;
  if (r14) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i3 = 0; i3 < s15; ++i3) {
      if (cd[i3]) {
        var sv = i3 << 4 | cd[i3];
        var r_1 = mb - cd[i3];
        var v = le[cd[i3] - 1]++ << r_1;
        for (var m12 = v | (1 << r_1) - 1; v <= m12; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s15);
    for (i3 = 0; i3 < s15; ++i3) {
      if (cd[i3]) {
        co[i3] = rev[le[cd[i3] - 1]++] >> 15 - cd[i3];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i2 = 0; i2 < 144; ++i2)
  flt[i2] = 8;
var i2;
for (i2 = 144; i2 < 256; ++i2)
  flt[i2] = 9;
var i2;
for (i2 = 256; i2 < 280; ++i2)
  flt[i2] = 7;
var i2;
for (i2 = 280; i2 < 288; ++i2)
  flt[i2] = 8;
var i2;
var fdt = new u8(32);
for (i2 = 0; i2 < 32; ++i2)
  fdt[i2] = 5;
var i2;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var shft = function(p3) {
  return (p3 + 7) / 8 | 0;
};
var slc = function(v, s15, e93) {
  if (s15 == null || s15 < 0)
    s15 = 0;
  if (e93 == null || e93 > v.length)
    e93 = v.length;
  return new u8(v.subarray(s15, e93));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e93 = new Error(msg || ec[ind]);
  e93.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e93, err);
  if (!nt)
    throw e93;
  return e93;
};
var wbits = function(d, p3, v) {
  v <<= p3 & 7;
  var o47 = p3 / 8 | 0;
  d[o47] |= v;
  d[o47 + 1] |= v >> 8;
};
var wbits16 = function(d, p3, v) {
  v <<= p3 & 7;
  var o47 = p3 / 8 | 0;
  d[o47] |= v;
  d[o47 + 1] |= v >> 8;
  d[o47 + 2] |= v >> 16;
};
var hTree = function(d, mb) {
  var t10 = [];
  for (var i3 = 0; i3 < d.length; ++i3) {
    if (d[i3])
      t10.push({ s: i3, f: d[i3] });
  }
  var s15 = t10.length;
  var t22 = t10.slice();
  if (!s15)
    return { t: et, l: 0 };
  if (s15 == 1) {
    var v = new u8(t10[0].s + 1);
    v[t10[0].s] = 1;
    return { t: v, l: 1 };
  }
  t10.sort(function(a65, b) {
    return a65.f - b.f;
  });
  t10.push({ s: -1, f: 25001 });
  var l8 = t10[0], r14 = t10[1], i0 = 0, i1 = 1, i22 = 2;
  t10[0] = { s: -1, f: l8.f + r14.f, l: l8, r: r14 };
  while (i1 != s15 - 1) {
    l8 = t10[t10[i0].f < t10[i22].f ? i0++ : i22++];
    r14 = t10[i0 != i1 && t10[i0].f < t10[i22].f ? i0++ : i22++];
    t10[i1++] = { s: -1, f: l8.f + r14.f, l: l8, r: r14 };
  }
  var maxSym = t22[0].s;
  for (var i3 = 1; i3 < s15; ++i3) {
    if (t22[i3].s > maxSym)
      maxSym = t22[i3].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t10[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i3 = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t22.sort(function(a65, b) {
      return tr[b.s] - tr[a65.s] || a65.f - b.f;
    });
    for (; i3 < s15; ++i3) {
      var i2_1 = t22[i3].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t22[i3].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i3;
    }
    for (; i3 >= 0 && dt; --i3) {
      var i2_3 = t22[i3].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n18, l8, d) {
  return n18.s == -1 ? Math.max(ln(n18.l, l8, d + 1), ln(n18.r, l8, d + 1)) : l8[n18.s] = d;
};
var lc = function(c8) {
  var s15 = c8.length;
  while (s15 && !c8[--s15])
    ;
  var cl = new u16(++s15);
  var cli = 0, cln = c8[0], cls = 1;
  var w = function(v) {
    cl[cli++] = v;
  };
  for (var i3 = 1; i3 <= s15; ++i3) {
    if (c8[i3] == cln && i3 != s15)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c8[i3];
    }
  }
  return { c: cl.subarray(0, cli), n: s15 };
};
var clen = function(cf, cl) {
  var l8 = 0;
  for (var i3 = 0; i3 < cl.length; ++i3)
    l8 += cf[i3] * cl[i3];
  return l8;
};
var wfblk = function(out, pos, dat) {
  var s15 = dat.length;
  var o47 = shft(pos + 2);
  out[o47] = s15 & 255;
  out[o47 + 1] = s15 >> 8;
  out[o47 + 2] = out[o47] ^ 255;
  out[o47 + 3] = out[o47 + 1] ^ 255;
  for (var i3 = 0; i3 < s15; ++i3)
    out[o47 + i3 + 4] = dat[i3];
  return (o47 + 4 + s15) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p3) {
  wbits(out, p3++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i3 = 0; i3 < lclt.length; ++i3)
    ++lcfreq[lclt[i3] & 31];
  for (var i3 = 0; i3 < lcdt.length; ++i3)
    ++lcfreq[lcdt[i3] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p3, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p3, 1 + (dtlen < ftlen)), p3 += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p3, nlc - 257);
    wbits(out, p3 + 5, ndc - 1);
    wbits(out, p3 + 10, nlcc - 4);
    p3 += 14;
    for (var i3 = 0; i3 < nlcc; ++i3)
      wbits(out, p3 + 3 * i3, lct[clim[i3]]);
    p3 += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i3 = 0; i3 < clct.length; ++i3) {
        var len = clct[i3] & 31;
        wbits(out, p3, llm[len]), p3 += lct[len];
        if (len > 15)
          wbits(out, p3, clct[i3] >> 5 & 127), p3 += clct[i3] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i3 = 0; i3 < li; ++i3) {
    var sym = syms[i3];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p3, lm[len + 257]), p3 += ll[len + 257];
      if (len > 7)
        wbits(out, p3, sym >> 23 & 31), p3 += fleb[len];
      var dst = sym & 31;
      wbits16(out, p3, dm[dst]), p3 += dl[dst];
      if (dst > 3)
        wbits16(out, p3, sym >> 5 & 8191), p3 += fdeb[dst];
    } else {
      wbits16(out, p3, lm[sym]), p3 += ll[sym];
    }
  }
  wbits16(out, p3, lm[256]);
  return p3 + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st) {
  var s15 = st.z || dat.length;
  var o47 = new u8(pre + s15 + 5 * (1 + Math.ceil(s15 / 7e3)) + post);
  var w = o47.subarray(pre, o47.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n18 = opt >> 13, c8 = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i4) {
      return (dat[i4] ^ dat[i4 + 1] << bs1_1 ^ dat[i4 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i3 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i3 + 2 < s15; ++i3) {
      var hv = hsh(i3);
      var imod = i3 & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i3) {
        var rem = s15 - i3;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i3 - bs, pos);
          li = lc_1 = eb = 0, bs = i3;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l8 = 2, d = 0, ch_1 = c8, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i3 - dif)) {
          var maxn = Math.min(n18, rem) - 1;
          var maxd = Math.min(32767, i3);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i3 + l8] == dat[i3 + l8 - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i3 + nl] == dat[i3 + nl - dif]; ++nl)
                ;
              if (nl > l8) {
                l8 = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i3 - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l8] << 18 | revfd[d];
          var lin = revfl[l8] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i3 + l8;
          ++lc_1;
        } else {
          syms[li++] = dat[i3];
          ++lf[dat[i3]];
        }
      }
    }
    for (i3 = Math.max(i3, wi); i3 < s15; ++i3) {
      syms[li++] = dat[i3];
      ++lf[dat[i3]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i3 - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i3, st.w = wi;
    }
  } else {
    for (var i3 = st.w || 0; i3 < s15 + lst; i3 += 65535) {
      var e93 = i3 + 65535;
      if (e93 >= s15) {
        w[pos / 8 | 0] = lst;
        e93 = s15;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i3, e93));
    }
    st.i = s15;
  }
  return slc(o47, 0, pre + shft(pos) + post);
};
var crct = /* @__PURE__ */ (function() {
  var t10 = new Int32Array(256);
  for (var i3 = 0; i3 < 256; ++i3) {
    var c8 = i3, k = 9;
    while (--k)
      c8 = (c8 & 1 && -306674912) ^ c8 >>> 1;
    t10[i3] = c8;
  }
  return t10;
})();
var crc = function() {
  var c8 = -1;
  return {
    p: function(d) {
      var cr = c8;
      for (var i3 = 0; i3 < d.length; ++i3)
        cr = crct[cr & 255 ^ d[i3]] ^ cr >>> 8;
      c8 = cr;
    },
    d: function() {
      return ~c8;
    }
  };
};
var dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
};
var mrg = function(a65, b) {
  var o47 = {};
  for (var k in a65)
    o47[k] = a65[k];
  for (var k in b)
    o47[k] = b[k];
  return o47;
};
var wcln = function(fn, fnStr, td2) {
  var dt = fn();
  var st = fn.toString();
  var ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
  for (var i3 = 0; i3 < dt.length; ++i3) {
    var v = dt[i3], k = ks[i3];
    if (typeof v == "function") {
      fnStr += ";" + k + "=";
      var st_1 = v.toString();
      if (v.prototype) {
        if (st_1.indexOf("[native code]") != -1) {
          var spInd = st_1.indexOf(" ", 8) + 1;
          fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
        } else {
          fnStr += st_1;
          for (var t10 in v.prototype)
            fnStr += ";" + k + ".prototype." + t10 + "=" + v.prototype[t10].toString();
        }
      } else
        fnStr += st_1;
    } else
      td2[k] = v;
  }
  return fnStr;
};
var ch = [];
var cbfs = function(v) {
  var tl = [];
  for (var k in v) {
    if (v[k].buffer) {
      tl.push((v[k] = new v[k].constructor(v[k])).buffer);
    }
  }
  return tl;
};
var wrkr = function(fns, init, id, cb) {
  if (!ch[id]) {
    var fnStr = "", td_1 = {}, m12 = fns.length - 1;
    for (var i3 = 0; i3 < m12; ++i3)
      fnStr = wcln(fns[i3], fnStr, td_1);
    ch[id] = { c: wcln(fns[m12], fnStr, td_1), e: td_1 };
  }
  var td2 = mrg({}, ch[id].e);
  return wk(ch[id].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td2, cbfs(td2), cb);
};
var bDflt = function() {
  return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
};
var pbf = function(msg) {
  return postMessage(msg, [msg.buffer]);
};
var cbify = function(dat, opts, fns, init, id, cb) {
  var w = wrkr(fns, init, id, function(err2, dat2) {
    w.terminate();
    cb(err2, dat2);
  });
  w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
  return function() {
    w.terminate();
  };
};
var wbytes = function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
};
function deflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt
  ], function(ev) {
    return pbf(deflateSync(ev.data[0], ev.data[1]));
  }, 0, cb);
}
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
var fltn = function(d, p3, t10, o47) {
  for (var k in d) {
    var val = d[k], n18 = p3 + k, op = o47;
    if (Array.isArray(val))
      op = mrg(o47, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t10[n18] = [val, op];
    else {
      t10[n18 += "/"] = [new u8(0), op];
      fltn(val, n18, t10, o47);
    }
  }
};
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e93) {
}
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i3 = 0; i3 < str.length; ++i3)
      ar_1[i3] = str.charCodeAt(i3);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l8 = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = function(v) {
    ar[ai++] = v;
  };
  for (var i3 = 0; i3 < l8; ++i3) {
    if (ai + 5 > ar.length) {
      var n18 = new u8(ai + 8 + (l8 - i3 << 1));
      n18.set(ar);
      ar = n18;
    }
    var c8 = str.charCodeAt(i3);
    if (c8 < 128 || latin1)
      w(c8);
    else if (c8 < 2048)
      w(192 | c8 >> 6), w(128 | c8 & 63);
    else if (c8 > 55295 && c8 < 57344)
      c8 = 65536 + (c8 & 1023 << 10) | str.charCodeAt(++i3) & 1023, w(240 | c8 >> 18), w(128 | c8 >> 12 & 63), w(128 | c8 >> 6 & 63), w(128 | c8 & 63);
    else
      w(224 | c8 >> 12), w(128 | c8 >> 6 & 63), w(128 | c8 & 63);
  }
  return slc(ar, 0, ai);
}
var exfl = function(ex) {
  var le = 0;
  if (ex) {
    for (var k in ex) {
      var l8 = ex[k].length;
      if (l8 > 65535)
        err(9);
      le += l8 + 4;
    }
  }
  return le;
};
var wzh = function(d, b, f2, fn, u, c8, ce, co) {
  var fl2 = fn.length, ex = f2.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
  if (ce != null)
    d[b++] = 20, d[b++] = f2.os;
  d[b] = 20, b += 2;
  d[b++] = f2.flag << 1 | (c8 < 0 && 8), d[b++] = u && 8;
  d[b++] = f2.compression & 255, d[b++] = f2.compression >> 8;
  var dt = new Date(f2.mtime == null ? Date.now() : f2.mtime), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119)
    err(10);
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
  if (c8 != -1) {
    wbytes(d, b, f2.crc);
    wbytes(d, b + 4, c8 < 0 ? -c8 - 2 : c8);
    wbytes(d, b + 8, f2.size);
  }
  wbytes(d, b + 12, fl2);
  wbytes(d, b + 14, exl), b += 16;
  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f2.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }
  d.set(fn, b);
  b += fl2;
  if (exl) {
    for (var k in ex) {
      var exf = ex[k], l8 = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l8);
      d.set(exf, b + 4), b += 4 + l8;
    }
  }
  if (col)
    d.set(co, b), b += col;
  return b;
};
var wzf = function(o47, b, c8, d, e93) {
  wbytes(o47, b, 101010256);
  wbytes(o47, b + 8, c8);
  wbytes(o47, b + 10, c8);
  wbytes(o47, b + 12, d);
  wbytes(o47, b + 16, e93);
};
function zip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var r14 = {};
  fltn(data, "", r14, opts);
  var k = Object.keys(r14);
  var lft = k.length, o47 = 0, tot = 0;
  var slft = lft, files = new Array(lft);
  var term = [];
  var tAll = function() {
    for (var i4 = 0; i4 < term.length; ++i4)
      term[i4]();
  };
  var cbd = function(a65, b) {
    mt(function() {
      cb(a65, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var cbf = function() {
    var out = new u8(tot + 22), oe = o47, cdl = tot - o47;
    tot = 0;
    for (var i4 = 0; i4 < slft; ++i4) {
      var f2 = files[i4];
      try {
        var l8 = f2.c.length;
        wzh(out, tot, f2, f2.f, f2.u, l8);
        var badd = 30 + f2.f.length + exfl(f2.extra);
        var loc = tot + badd;
        out.set(f2.c, loc);
        wzh(out, o47, f2, f2.f, f2.u, l8, tot, f2.m), o47 += 16 + badd + (f2.m ? f2.m.length : 0), tot = loc + l8;
      } catch (e93) {
        return cbd(e93, null);
      }
    }
    wzf(out, o47, files.length, cdl, oe);
    cbd(null, out);
  };
  if (!lft)
    cbf();
  var _loop_1 = function(i4) {
    var fn = k[i4];
    var _a2 = r14[fn], file = _a2[0], p3 = _a2[1];
    var c8 = crc(), size = file.length;
    c8.p(file);
    var f2 = strToU8(fn), s15 = f2.length;
    var com = p3.comment, m12 = com && strToU8(com), ms = m12 && m12.length;
    var exl = exfl(p3.extra);
    var compression = p3.level == 0 ? 0 : 8;
    var cbl = function(e93, d) {
      if (e93) {
        tAll();
        cbd(e93, null);
      } else {
        var l8 = d.length;
        files[i4] = mrg(p3, {
          size,
          crc: c8.d(),
          c: d,
          f: f2,
          m: m12,
          u: s15 != fn.length || m12 && com.length != ms,
          compression
        });
        o47 += 30 + s15 + exl + l8;
        tot += 76 + 2 * (s15 + exl) + (ms || 0) + l8;
        if (!--lft)
          cbf();
      }
    };
    if (s15 > 65535)
      cbl(err(11, 0, 1), null);
    if (!compression)
      cbl(null, file);
    else if (size < 16e4) {
      try {
        cbl(null, deflateSync(file, p3));
      } catch (e93) {
        cbl(e93, null);
      }
    } else
      term.push(deflate(file, p3, cbl));
  };
  for (var i3 = 0; i3 < slft; ++i3) {
    _loop_1(i3);
  }
  return tAll;
}
var mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
  fn();
};

// src/client/skill-import.js
var SKILL_IMPORT_LIMITS = Object.freeze({
  archiveBytes: 50 * 1024 * 1024,
  entries: 1e3,
  expandedBytes: 100 * 1024 * 1024,
  singleFileBytes: 50 * 1024 * 1024
});
var SKILL_IMPORT_ERROR_CODES = Object.freeze({
  ARCHIVE_TOO_LARGE: "SKILL_ARCHIVE_TOO_LARGE",
  ARCHIVE_UNSAFE: "SKILL_ARCHIVE_UNSAFE",
  PACKAGE_INVALID: "SKILL_PACKAGE_INVALID"
});
var SkillImportError = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "SkillImportError";
    this.code = code;
    if (details !== void 0) this.details = details;
  }
};
function packageError(message, details) {
  return new SkillImportError(SKILL_IMPORT_ERROR_CODES.PACKAGE_INVALID, message, details);
}
function unsafePath(message, details) {
  return new SkillImportError(SKILL_IMPORT_ERROR_CODES.ARCHIVE_UNSAFE, message, details);
}
function tooLarge(message, details) {
  return new SkillImportError(SKILL_IMPORT_ERROR_CODES.ARCHIVE_TOO_LARGE, message, details);
}
function asFiles(files) {
  if (files === null || typeof files !== "object") {
    throw packageError("Skill directory selection is invalid");
  }
  let length;
  try {
    length = files.length;
  } catch {
    throw packageError("Skill directory selection is invalid");
  }
  if (!Number.isSafeInteger(length) || length < 1 || length > SKILL_IMPORT_LIMITS.entries) {
    throw packageError("Skill directory must contain between 1 and 1000 files", {
      entries: Number.isSafeInteger(length) ? length : void 0,
      limit: SKILL_IMPORT_LIMITS.entries
    });
  }
  if (Array.isArray(files)) return files;
  try {
    return Array.from(files);
  } catch {
    throw packageError("Skill directory selection is invalid");
  }
}
function validatePath(rawPath) {
  if (typeof rawPath !== "string" || rawPath.length === 0) {
    throw unsafePath("Skill file path is invalid");
  }
  if (rawPath.includes("\0") || rawPath.includes("\\") || rawPath.startsWith("/") || /^[A-Za-z]:/.test(rawPath)) {
    throw unsafePath("Skill file path is unsafe", { path: rawPath });
  }
  const parts2 = rawPath.split("/");
  if (parts2.some((part) => part.length === 0 || part === "." || part === "..")) {
    throw unsafePath("Skill file path is unsafe", { path: rawPath });
  }
  if (parts2.length < 2 || parts2[0].length === 0) {
    throw packageError("Skill directory must contain one wrapper folder");
  }
  return parts2;
}
function readFileBytes(file, path) {
  if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
    throw packageError("Skill directory contains an invalid file", { path });
  }
  return Promise.resolve().then(() => file.arrayBuffer()).then((buffer) => {
    try {
      const byteLengthGetter = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength")?.get;
      if (typeof byteLengthGetter !== "function") throw new TypeError("ArrayBuffer is unavailable");
      byteLengthGetter.call(buffer);
      return new Uint8Array(buffer);
    } catch {
      throw packageError("Skill file could not be read", { path });
    }
  }).catch((error) => {
    if (error instanceof SkillImportError) throw error;
    throw packageError("Skill file could not be read", { path });
  });
}
function zipFiles(entries) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      callback(value);
    };
    try {
      zip(entries, (error, bytes) => {
        if (error) {
          finish(reject, packageError("Skill directory could not be compressed"));
          return;
        }
        finish(resolve, bytes);
      });
    } catch {
      finish(reject, packageError("Skill directory could not be compressed"));
    }
  });
}
async function packSkillDirectory(files) {
  const selected = asFiles(files);
  const entries = [];
  const roots = /* @__PURE__ */ new Set();
  const paths = /* @__PURE__ */ new Set();
  let declaredBytes = 0;
  for (const file of selected) {
    const parts2 = validatePath(file?.webkitRelativePath);
    const path = parts2.join("/");
    if (paths.has(path)) throw packageError("Skill directory contains duplicate paths", { path });
    paths.add(path);
    roots.add(parts2[0]);
    if (!Number.isSafeInteger(file?.size) || file.size < 0) {
      throw packageError("Skill directory contains a file with an invalid size", { path });
    }
    if (file.size > SKILL_IMPORT_LIMITS.singleFileBytes) {
      throw tooLarge("Skill file exceeds the byte limit", { bytes: file.size, limit: SKILL_IMPORT_LIMITS.singleFileBytes, path });
    }
    declaredBytes += file.size;
    if (declaredBytes > SKILL_IMPORT_LIMITS.expandedBytes) {
      throw tooLarge("Skill directory exceeds the expanded byte limit", { bytes: declaredBytes, limit: SKILL_IMPORT_LIMITS.expandedBytes });
    }
    entries.push({ file, path });
  }
  if (roots.size !== 1) throw packageError("Skill directory must contain exactly one wrapper folder");
  const contents = {};
  let actualBytes = 0;
  for (const { file, path } of entries) {
    const bytes = await readFileBytes(file, path);
    if (bytes.byteLength > SKILL_IMPORT_LIMITS.singleFileBytes) {
      throw tooLarge("Skill file exceeds the byte limit", { bytes: bytes.byteLength, limit: SKILL_IMPORT_LIMITS.singleFileBytes, path });
    }
    actualBytes += bytes.byteLength;
    if (actualBytes > SKILL_IMPORT_LIMITS.expandedBytes) {
      throw tooLarge("Skill directory exceeds the expanded byte limit", { bytes: actualBytes, limit: SKILL_IMPORT_LIMITS.expandedBytes });
    }
    contents[path] = bytes;
  }
  const archiveBytes = await zipFiles(contents);
  if (!(archiveBytes instanceof Uint8Array)) {
    throw packageError("Skill directory could not be compressed");
  }
  if (archiveBytes.byteLength > SKILL_IMPORT_LIMITS.archiveBytes) {
    throw tooLarge("ZIP archive exceeds the byte limit", { bytes: archiveBytes.byteLength, limit: SKILL_IMPORT_LIMITS.archiveBytes });
  }
  if (typeof globalThis.Blob !== "function") {
    throw packageError("Skill archive output is unavailable");
  }
  let archive;
  try {
    archive = new globalThis.Blob([archiveBytes], { type: "application/zip" });
  } catch {
    throw packageError("Skill archive output could not be created");
  }
  return {
    archive,
    sourceName: [...roots][0]
  };
}

// src/client/SkillsManager.js
var h2 = import_react20.default.createElement;
function scopeLabel(scope) {
  return scope === "project" ? "\u9879\u76EE Skill" : "\u5168\u5C40 Skill";
}
function errorMessage(error) {
  if (!error) return "";
  return error.message || String(error);
}
function conflictFiles(value) {
  const files = Array.isArray(value?.files) ? value.files.filter((file) => typeof file === "string") : [];
  if (files.length === 0) return `${value?.fileCount ?? 0} \u4E2A\u6587\u4EF6`;
  const visible = files.slice(0, 4).join("\u3001");
  return `\u6587\u4EF6\uFF1A${visible}${files.length > 4 ? ` \u7B49 ${files.length} \u4E2A` : ""}`;
}
function skillScopeKey(scope = "global", projectId = null) {
  return scope === "project" ? `project:${projectId}` : "global";
}
function skillCatalogCount(state, scope = "global", projectId = null) {
  const items = state?.skillCatalogs?.[skillScopeKey(scope, projectId)]?.data?.items;
  return Array.isArray(items) ? items.length : 0;
}
function actionMatches(action, type, name, targetKey) {
  return action?.key === targetKey && action?.type === type && action?.name === name && action.status === "running";
}
function usableConflictDetails(details) {
  return !!details?.existing && typeof details.existing.name === "string" && details.existing.name.length > 0 && !!details?.incoming && typeof details.incoming.name === "string" && details.incoming.name.length > 0;
}
function shouldRetainSkillInput(error, currentKey, capturedKey, selectedPayload) {
  return error?.code === "SKILL_CONFLICT" && currentKey === capturedKey && !!selectedPayload && usableConflictDetails(error.details);
}
async function copySkillPath(writeText, path) {
  if (typeof writeText !== "function") throw new Error("\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u590D\u5236\uFF0C\u8BF7\u624B\u52A8\u9009\u62E9\u5B89\u88C5\u8DEF\u5F84\u3002");
  await writeText(path);
  return true;
}
function actionLabel(action) {
  if (action?.type === "importSkill") return action.status === "done" ? "Skill \u5BFC\u5165\u5B8C\u6210\u3002" : action.status === "running" ? "\u6B63\u5728\u5BFC\u5165 Skill\u3002" : "Skill \u5BFC\u5165\u5931\u8D25\u3002";
  if (action?.type === "setSkillEnabled") return action.status === "done" ? "Skill \u72B6\u6001\u5DF2\u66F4\u65B0\u3002" : action.status === "running" ? "\u6B63\u5728\u66F4\u65B0 Skill \u72B6\u6001\u3002" : "Skill \u72B6\u6001\u66F4\u65B0\u5931\u8D25\u3002";
  if (action?.type === "deleteSkill") return action.status === "done" ? "Skill \u5DF2\u5220\u9664\u3002" : action.status === "running" ? "\u6B63\u5728\u5220\u9664 Skill\u3002" : "Skill \u5220\u9664\u5931\u8D25\u3002";
  if (action?.type === "revealSkill") return action.status === "done" ? "\u5DF2\u8BF7\u6C42\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A Skill\u3002" : action.status === "running" ? "\u6B63\u5728\u6253\u5F00\u6587\u4EF6\u7BA1\u7406\u5668\u3002" : "\u65E0\u6CD5\u6253\u5F00\u6587\u4EF6\u7BA1\u7406\u5668\u3002";
  return "Skill \u64CD\u4F5C\u5DF2\u5B8C\u6210\u3002";
}
function CopyPath({ path, targetKey, onError }) {
  const [copied, setCopied] = import_react20.default.useState(false);
  const timerRef = import_react20.default.useRef(null);
  const aliveRef = import_react20.default.useRef(true);
  const generationRef = import_react20.default.useRef(0);
  import_react20.default.useEffect(() => () => {
    aliveRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  import_react20.default.useEffect(() => {
    generationRef.current += 1;
    setCopied(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [targetKey, path]);
  const copy = async function() {
    const generation = generationRef.current;
    const writer = globalThis.navigator?.clipboard?.writeText;
    if (typeof writer !== "function") {
      onError?.("\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u590D\u5236\uFF0C\u8BF7\u624B\u52A8\u9009\u62E9\u5B89\u88C5\u8DEF\u5F84\u3002");
      return;
    }
    try {
      await copySkillPath(writer.bind(globalThis.navigator.clipboard), path);
      if (!aliveRef.current || generationRef.current !== generation) return;
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (aliveRef.current) setCopied(false);
      }, 1200);
    } catch {
      if (aliveRef.current && generationRef.current === generation) {
        setCopied(false);
        onError?.("\u590D\u5236\u5B89\u88C5\u8DEF\u5F84\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u9009\u62E9\u8DEF\u5F84\u6587\u672C\u3002");
      }
    }
  };
  return h2(
    "button",
    { type: "button", className: "cpwb-skills-copy", onClick: copy, "aria-label": "\u590D\u5236\u5B89\u88C5\u8DEF\u5F84", title: copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u5B89\u88C5\u8DEF\u5F84" },
    copied ? h2(n3, { size: 14, "aria-hidden": true }) : h2(c4, { size: 14, "aria-hidden": true }),
    h2("span", null, copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u8DEF\u5F84")
  );
}
function SkillConflictDialog({ existing, incoming, onCancel, onReplace, busy = false }) {
  if (!existing || !incoming) return null;
  return h2(
    GlobalModal,
    { onClose: busy ? void 0 : onCancel, labelledBy: "cpwb-skill-conflict-title" },
    h2(
      "section",
      { className: "cpwb-modal cpwb-skills-dialog" },
      h2("div", { className: "cpwb-modal-kicker" }, "SKILL / IMPORT CONFLICT"),
      h2("h3", { id: "cpwb-skill-conflict-title" }, "\u540C\u540D Skill \u5DF2\u5B58\u5728"),
      h2("p", { className: "cpwb-skills-dialog-lead" }, "\u6B64\u4F5C\u7528\u57DF\u5DF2\u6709\u540C\u540D Skill\u3002\u786E\u8BA4\u540E\u5C06\u7528\u672C\u6B21\u5BFC\u5165\u5185\u5BB9\u66FF\u6362\u73B0\u6709\u76EE\u5F55\u3002"),
      h2(
        "div",
        { className: "cpwb-skills-conflict-grid" },
        h2(
          "div",
          null,
          h2("span", null, "\u73B0\u6709\u7248\u672C"),
          h2("strong", null, existing.name),
          h2("small", null, existing.description || "\u65E0\u63CF\u8FF0"),
          h2("small", null, `${existing.state === "disabled" ? "\u5DF2\u505C\u7528" : "\u5DF2\u542F\u7528"} \xB7 ${conflictFiles(existing)}`),
          existing.installedPath ? h2("small", null, `\u5B89\u88C5\u8DEF\u5F84\uFF1A${existing.installedPath}`) : null
        ),
        h2(
          "div",
          null,
          h2("span", null, "\u5F85\u5BFC\u5165\u7248\u672C"),
          h2("strong", null, incoming.name),
          h2("small", null, incoming.description || "\u65E0\u63CF\u8FF0"),
          h2("small", null, conflictFiles(incoming)),
          incoming.sourceName ? h2("small", null, `\u6765\u6E90\uFF1A${incoming.sourceName}`) : null
        )
      ),
      h2(
        "div",
        { className: "cpwb-modal-actions" },
        h2("button", { type: "button", className: "cpwb-btn", disabled: busy, onClick: onCancel }, "\u53D6\u6D88"),
        h2("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", disabled: busy, onClick: onReplace }, busy ? "\u66FF\u6362\u4E2D" : "\u786E\u8BA4\u66FF\u6362")
      )
    )
  );
}
function SkillDeleteDialog({ item, scope, onCancel, onConfirm, busy = false }) {
  if (!item) return null;
  return h2(
    GlobalModal,
    { onClose: busy ? void 0 : onCancel, labelledBy: "cpwb-skill-delete-title" },
    h2(
      "section",
      { className: "cpwb-modal cpwb-skills-dialog cpwb-skills-delete-dialog" },
      h2("div", { className: "cpwb-modal-kicker" }, "SKILL / DELETE"),
      h2("h3", { id: "cpwb-skill-delete-title" }, `\u5220\u9664 Skill\u300C${item.name}\u300D`),
      h2(
        "dl",
        { className: "cpwb-skills-delete-facts" },
        h2("div", null, h2("dt", null, "\u4F5C\u7528\u57DF"), h2("dd", null, scopeLabel(scope))),
        h2("div", null, h2("dt", null, "\u72B6\u6001"), h2("dd", null, item.state === "disabled" ? "\u5DF2\u505C\u7528" : "\u5DF2\u542F\u7528")),
        h2("div", null, h2("dt", null, "\u5B89\u88C5\u8DEF\u5F84"), h2("dd", null, item.path))
      ),
      h2("p", { className: "cpwb-skills-dialog-lead" }, "\u5220\u9664\u540E\u4E0D\u4F1A\u4FDD\u7559\u56DE\u6536\u7AD9\u6216\u7248\u672C\u6062\u590D\u3002"),
      h2(
        "div",
        { className: "cpwb-modal-actions" },
        h2("button", { type: "button", className: "cpwb-btn", disabled: busy, onClick: onCancel }, "\u53D6\u6D88"),
        h2("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: busy, onClick: onConfirm }, busy ? "\u5220\u9664\u4E2D" : "\u786E\u8BA4\u5220\u9664")
      )
    )
  );
}
function StatusBadge({ item }) {
  const state = item.state === "disabled" ? "\u5DF2\u505C\u7528" : "\u5DF2\u542F\u7528";
  return h2("span", { className: "cpwb-skill-status cpwb-skill-status-" + item.state }, item.health !== "valid" ? "\u65E0\u6548" : state);
}
function SkillRow({ item, scope, targetKey, store: store3, onDelete, compact = false }) {
  const state = store3.getSnapshot();
  const action = state.skillAction;
  const busy = action?.status === "running" && action.key === targetKey;
  const stateBusy = actionMatches(action, "setSkillEnabled", item.name, targetKey) || actionMatches(action, "deleteSkill", item.name, targetKey) || actionMatches(action, "revealSkill", item.name, targetKey);
  const disabled = item.health !== "valid";
  const run = (fn) => Promise.resolve(fn()).catch(() => {
  });
  return h2(
    "article",
    { className: "cpwb-skill-row" + (busy ? " cpwb-skill-row-busy" : ""), "data-skill-state": item.state, "data-skill-health": item.health, "aria-busy": busy ? "true" : void 0 },
    h2("div", { className: "cpwb-skill-identity" }, h2("strong", null, item.name), h2(StatusBadge, { item }), item.shadowsGlobal ? h2("span", { className: "cpwb-skill-shadow" }, "\u8986\u76D6\u5168\u5C40\u7248\u672C") : null),
    h2("div", { className: "cpwb-skill-summary" }, h2("p", null, item.description || "\u65E0\u63CF\u8FF0"), h2("small", { title: compact ? item.path : void 0 }, `${item.fileCount ?? item.files?.length ?? 0} \u4E2A\u6587\u4EF6 \xB7 ${compact ? `.dsh/skills/${item.name}` : item.path}`)),
    h2(
      "div",
      { className: "cpwb-skill-actions", "aria-label": item.name + "\u64CD\u4F5C" },
      disabled ? null : h2("button", { type: "button", className: "cpwb-icon-button", disabled: stateBusy, onClick: () => run(() => store3.actions.setSkillEnabled({ scope, ...scope === "project" ? { projectId: item.projectId } : {}, name: item.name, enabled: item.state === "disabled" })), "aria-label": item.state === "disabled" ? `\u542F\u7528 ${item.name}` : `\u505C\u7528 ${item.name}`, title: item.state === "disabled" ? "\u542F\u7528" : "\u505C\u7528" }, item.state === "disabled" ? h2(n11, { size: 15, "aria-hidden": true }) : h2(n10, { size: 15, "aria-hidden": true })),
      h2("button", { type: "button", className: "cpwb-icon-button", disabled: stateBusy, onClick: () => run(() => store3.actions.revealSkill({ scope, ...scope === "project" ? { projectId: item.projectId } : {}, name: item.name })), "aria-label": `\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A ${item.name}`, title: "\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A" }, h2(n5, { size: 15, "aria-hidden": true })),
      h2("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", disabled: stateBusy, onClick: () => onDelete(item), "aria-label": `\u5220\u9664 ${item.name}`, title: "\u5220\u9664" }, h2(n15, { size: 15, "aria-hidden": true }))
    )
  );
}
function SkillScopeManager({ store: store3, scope = "global", projectId = null, compact = false }) {
  const idSeed = import_react20.default.useId();
  const importMenuId = "cpwb-skills-import-menu-" + idSeed.replace(/:/g, "-");
  const importTriggerId = importMenuId + "-trigger";
  const state = import_react20.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const key = skillScopeKey(scope, projectId);
  const catalog = state.skillCatalogs?.[key] || { status: "loading", data: null, error: null };
  const [conflict, setConflict] = import_react20.default.useState(null);
  const [deleteTarget, setDeleteTarget] = import_react20.default.useState(null);
  const [selectedInput, setSelectedInput] = import_react20.default.useState(null);
  const [localError, setLocalError] = import_react20.default.useState(null);
  const [replacePending, setReplacePending] = import_react20.default.useState(false);
  const [importMenuOpen, setImportMenuOpen] = import_react20.default.useState(false);
  const activeKeyRef = import_react20.default.useRef(key);
  const generationRef = import_react20.default.useRef(0);
  const importRequestRef = import_react20.default.useRef(0);
  const replacePendingRef = import_react20.default.useRef(false);
  const directoryRef = import_react20.default.useRef(null);
  const zipRef = import_react20.default.useRef(null);
  const importTriggerRef = import_react20.default.useRef(null);
  const importMenuRef = import_react20.default.useRef(null);
  const menuFocusTimerRef = import_react20.default.useRef(null);
  activeKeyRef.current = key;
  import_react20.default.useEffect(() => {
    importRequestRef.current += 1;
    generationRef.current += 1;
    setConflict(null);
    setDeleteTarget(null);
    setSelectedInput(null);
    setLocalError(null);
    setImportMenuOpen(false);
    replacePendingRef.current = false;
    setReplacePending(false);
    return () => {
      generationRef.current += 1;
      importRequestRef.current += 1;
    };
  }, [key]);
  import_react20.default.useEffect(() => () => {
    if (menuFocusTimerRef.current) clearTimeout(menuFocusTimerRef.current);
  }, []);
  const closeImportMenu = import_react20.default.useCallback((restoreFocus = false) => {
    setImportMenuOpen(false);
    if (restoreFocus) importTriggerRef.current?.focus?.();
  }, []);
  import_react20.default.useEffect(() => {
    if (!compact || !importMenuOpen || typeof document === "undefined") return void 0;
    menuFocusTimerRef.current = setTimeout(() => {
      menuFocusTimerRef.current = null;
      importMenuRef.current?.querySelector?.("button[role='menuitem']")?.focus?.();
    }, 0);
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeImportMenu(true);
    };
    const onPointerDown = (event) => {
      if (importTriggerRef.current?.contains?.(event.target) || importMenuRef.current?.contains?.(event.target)) return;
      closeImportMenu(false);
    };
    const onClick = (event) => {
      if (importTriggerRef.current?.contains?.(event.target) || importMenuRef.current?.contains?.(event.target)) return;
      closeImportMenu(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("click", onClick);
    return () => {
      if (menuFocusTimerRef.current) {
        clearTimeout(menuFocusTimerRef.current);
        menuFocusTimerRef.current = null;
      }
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
    };
  }, [closeImportMenu, compact, importMenuOpen]);
  import_react20.default.useEffect(() => {
    if (typeof store3.actions.loadSkills !== "function" || scope === "project" && !(Number.isSafeInteger(projectId) && projectId > 0)) return void 0;
    store3.actions.loadSkills({ scope, ...scope === "project" ? { projectId } : {} }).catch?.(() => {
    });
    return void 0;
  }, [store3, scope, projectId]);
  const target = Object.freeze({ scope, ...scope === "project" ? { projectId } : {} });
  const isCurrent = (capturedKey, capturedGeneration, capturedRequest = null) => activeKeyRef.current === capturedKey && generationRef.current === capturedGeneration && (capturedRequest === null || importRequestRef.current === capturedRequest);
  const importArchive = async (archive, sourceName, capturedRequest) => {
    if (!archive || rootUnavailable) return;
    const capturedKey = key;
    const capturedGeneration = generationRef.current;
    const capturedTarget = target;
    if (!isCurrent(capturedKey, capturedGeneration, capturedRequest) || rootUnavailable) return;
    setLocalError(null);
    setConflict(null);
    setSelectedInput(null);
    if (archive.size > SKILL_IMPORT_LIMITS.archiveBytes) {
      setLocalError("ZIP \u6587\u4EF6\u8D85\u8FC7 50 MiB\uFF0C\u672A\u5F00\u59CB\u5BFC\u5165\u3002");
      return;
    }
    setSelectedInput({ archive, sourceName, target: capturedTarget, key: capturedKey, generation: capturedGeneration, request: capturedRequest });
    try {
      await store3.actions.importSkill({ ...capturedTarget, archive, sourceName });
      if (isCurrent(capturedKey, capturedGeneration, capturedRequest)) {
        setSelectedInput(null);
        setConflict(null);
      }
    } catch (error) {
      if (!isCurrent(capturedKey, capturedGeneration, capturedRequest)) return;
      if (shouldRetainSkillInput(error, activeKeyRef.current, capturedKey, { archive, sourceName })) {
        setConflict({ existing: error.details?.existing, incoming: error.details?.incoming || { name: sourceName }, key: capturedKey, generation: capturedGeneration, request: capturedRequest });
      } else {
        setSelectedInput(null);
        setLocalError(error?.code === "SKILL_CONFLICT" ? "Skill \u51B2\u7A81\u4FE1\u606F\u4E0D\u5B8C\u6574\uFF0C\u65E0\u6CD5\u5B89\u5168\u66FF\u6362\u3002\u8BF7\u91CD\u65B0\u5BFC\u5165\u540E\u91CD\u8BD5\u3002" : errorMessage(error) || "Skill \u5BFC\u5165\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u540E\u91CD\u8BD5\u3002");
      }
    }
  };
  const chooseDirectory = async (event) => {
    const input = event.currentTarget;
    const capturedKey = key;
    const capturedGeneration = generationRef.current;
    const capturedRequest = ++importRequestRef.current;
    const files = Array.from(input.files || []);
    input.value = "";
    replacePendingRef.current = false;
    setReplacePending(false);
    if (!isCurrent(capturedKey, capturedGeneration, capturedRequest) || rootUnavailable) return;
    setConflict(null);
    setSelectedInput(null);
    try {
      const packed = await packSkillDirectory(files);
      if (isCurrent(capturedKey, capturedGeneration, capturedRequest)) await importArchive(packed.archive, packed.sourceName, capturedRequest);
    } catch (error) {
      if (!isCurrent(capturedKey, capturedGeneration, capturedRequest)) return;
      setSelectedInput(null);
      setLocalError(errorMessage(error) || "\u76EE\u5F55\u6253\u5305\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5 Skill \u6587\u4EF6\u3002");
    }
  };
  const chooseZip = (event) => {
    const input = event.currentTarget;
    const capturedRequest = ++importRequestRef.current;
    const file = input.files?.[0];
    input.value = "";
    replacePendingRef.current = false;
    setReplacePending(false);
    setConflict(null);
    setSelectedInput(null);
    if (file && !rootUnavailable && isCurrent(key, generationRef.current, capturedRequest)) void importArchive(file, file.name, capturedRequest);
  };
  const replace = () => {
    const selected = selectedInput;
    if (!selected || selected.key !== key || selected.request !== importRequestRef.current || !isCurrent(selected.key, selected.generation, selected.request)) return;
    if (replacePendingRef.current) return;
    const capturedRequest = selected.request;
    replacePendingRef.current = true;
    setReplacePending(true);
    setLocalError(null);
    Promise.resolve().then(() => store3.actions.importSkill({ ...selected.target, archive: selected.archive, sourceName: selected.sourceName, replace: true })).then(() => {
      if (isCurrent(selected.key, selected.generation, capturedRequest)) {
        setConflict(null);
        setSelectedInput(null);
        setLocalError(null);
        replacePendingRef.current = false;
        setReplacePending(false);
      }
    }).catch((error) => {
      if (isCurrent(selected.key, selected.generation, capturedRequest)) {
        setLocalError(errorMessage(error) || "Skill \u66FF\u6362\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002");
        replacePendingRef.current = false;
        setReplacePending(false);
      }
    });
  };
  const data = catalog.data;
  const items = Array.isArray(data?.items) ? data.items : [];
  const action = state.skillAction;
  const currentAction = action?.key === key ? action : null;
  const actionError = currentAction?.status === "error" ? currentAction.error : null;
  const rootUnavailable = scope === "project" && !(Number.isSafeInteger(projectId) && projectId > 0) || catalog.error?.code === "PROJECT_PATH_UNAVAILABLE" || catalog.error?.code === "SKILL_PERMISSION_DENIED";
  const rootPath = data?.rootPath || "";
  const selectDirectory = () => {
    closeImportMenu(false);
    directoryRef.current?.click?.();
  };
  const selectZip = () => {
    closeImportMenu(false);
    zipRef.current?.click?.();
  };
  return h2(
    "section",
    { className: "cpwb-skills-scope-manager" + (compact ? " cpwb-skills-compact" : ""), "aria-label": scopeLabel(scope) },
    compact ? h2(
      "header",
      { className: "cpwb-skills-compact-head" },
      h2("div", { className: "cpwb-skills-compact-title" }, h2(s13, { size: 16, "aria-hidden": true }), h2("div", null, h2("span", null, "PROJECT TOOL"), h2("h3", null, "\u9879\u76EE Skills"))),
      h2("span", { className: "cpwb-skills-compact-count" }, String(items.length).padStart(2, "0"))
    ) : null,
    h2("div", { className: "cpwb-skills-path", "aria-label": rootPath ? `${scope === "project" ? "\u9879\u76EE" : "\u5168\u5C40"} Skill \u5B89\u88C5\u6839\u8DEF\u5F84\uFF1A${rootPath}` : "\u6B63\u5728\u8BFB\u53D6 Skill \u5B89\u88C5\u6839\u8DEF\u5F84" }, h2(m5, { size: 16, "aria-hidden": true }), h2("code", { title: rootPath }, compact ? ".dsh/skills/" : rootPath || "\u6B63\u5728\u8BFB\u53D6\u5B89\u88C5\u6839\u8DEF\u5F84"), rootPath ? h2(CopyPath, { path: rootPath, targetKey: key, onError: (message) => {
      if (activeKeyRef.current === key) setLocalError(message);
    } }) : null),
    h2(
      "div",
      { className: "cpwb-skills-toolbar" },
      h2("input", { ref: directoryRef, className: "cpwb-visually-hidden", type: "file", webkitdirectory: "", directory: "", multiple: true, onChange: chooseDirectory, tabIndex: -1, disabled: rootUnavailable, "aria-hidden": true }),
      h2("input", { ref: zipRef, className: "cpwb-visually-hidden", type: "file", accept: ".zip,application/zip", onChange: chooseZip, tabIndex: -1, disabled: rootUnavailable, "aria-hidden": true }),
      compact ? h2(
        "div",
        { className: "cpwb-skills-import-menu" },
        h2("button", { id: importTriggerId, ref: importTriggerRef, type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content cpwb-skills-import-trigger", disabled: rootUnavailable, onClick: () => setImportMenuOpen((open) => !open), "aria-haspopup": "menu", "aria-expanded": importMenuOpen, "aria-controls": importMenuId }, h2(l7, { size: 15, "aria-hidden": true }), h2("span", null, "\u5BFC\u5165 Skill")),
        importMenuOpen ? h2(
          "div",
          { id: importMenuId, ref: importMenuRef, className: "cpwb-skills-import-options", role: "menu", "aria-labelledby": importTriggerId, "aria-label": "\u9009\u62E9 Skill \u5BFC\u5165\u6765\u6E90" },
          h2("button", { type: "button", role: "menuitem", onClick: selectDirectory }, h2(m5, { size: 14, "aria-hidden": true }), h2("span", null, "\u4ECE\u76EE\u5F55\u5BFC\u5165")),
          h2("button", { type: "button", role: "menuitem", onClick: selectZip }, h2(n9, { size: 14, "aria-hidden": true }), h2("span", null, "\u4ECE ZIP \u5BFC\u5165"))
        ) : null
      ) : h2(
        import_react20.default.Fragment,
        null,
        h2("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", disabled: rootUnavailable, onClick: selectDirectory }, h2(l7, { size: 15, "aria-hidden": true }), h2("span", null, "\u5BFC\u5165\u76EE\u5F55")),
        h2("button", { type: "button", className: "cpwb-btn cpwb-button-content", disabled: rootUnavailable, onClick: selectZip }, h2(n9, { size: 15, "aria-hidden": true }), h2("span", null, "\u5BFC\u5165 ZIP"))
      )
    ),
    catalog.status === "loading" ? h2("div", { className: "cpwb-skills-state", role: "status" }, h2("span", { className: "cpwb-skills-skeleton" }), "\u6B63\u5728\u8BFB\u53D6 Skill \u76EE\u5F55") : null,
    catalog.status === "error" ? h2("div", { className: "cpwb-skills-state cpwb-skills-error", role: "alert" }, h2(m11, { size: 18, "aria-hidden": true }), errorMessage(catalog.error) || "Skill \u76EE\u5F55\u8BFB\u53D6\u5931\u8D25", h2("button", { type: "button", className: "cpwb-btn", onClick: () => store3.actions.loadSkills(target) }, "\u91CD\u8BD5")) : null,
    rootUnavailable ? h2("div", { className: "cpwb-skills-state cpwb-skills-error", role: "alert" }, scope === "project" ? "\u5F53\u524D\u9879\u76EE\u76EE\u5F55\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u7BA1\u7406\u9879\u76EE Skill\u3002" : "\u5168\u5C40 Skill \u76EE\u5F55\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u7EE7\u7EED\u7BA1\u7406\u3002") : null,
    catalog.status === "ready" && !rootUnavailable && items.length === 0 && !data?.diagnostics?.length ? h2("div", { className: "cpwb-skills-empty" }, h2(n9, { size: 24, "aria-hidden": true }), h2("strong", null, scope === "project" ? "\u5F53\u524D\u9879\u76EE\u5C1A\u672A\u5B89\u88C5 Skill" : "\u5C1A\u672A\u5B89\u88C5\u5168\u5C40 Skill"), h2("p", null, "\u4ECE\u672C\u5730\u76EE\u5F55\u6216 ZIP \u5BFC\u5165\u4E00\u4E2A Skill\u3002")) : null,
    Array.isArray(data?.diagnostics) && data.diagnostics.length ? h2("div", { className: "cpwb-skills-diagnostics", role: "alert" }, h2("strong", null, `${data.diagnostics.length} \u4E2A\u6761\u76EE\u9700\u8981\u5904\u7406`), data.diagnostics.map((diagnostic, index) => h2("p", { key: `${diagnostic.path}-${index}` }, diagnostic.message || "\u6761\u76EE\u65E0\u6548"))) : null,
    items.length ? h2("div", { className: "cpwb-skills-list" }, items.map((item) => h2(SkillRow, { key: item.name, item: { ...item, projectId }, scope, targetKey: key, store: store3, compact, onDelete: (next) => setDeleteTarget({ item: next, target, key, generation: generationRef.current }) }))) : null,
    currentAction && (currentAction.status === "running" || currentAction.status === "done") ? h2("div", { className: "cpwb-skills-action-status", role: "status", "aria-live": "polite" }, actionLabel(currentAction)) : null,
    actionError ? h2("div", { className: "cpwb-skills-action-error", role: "alert" }, errorMessage(actionError)) : null,
    localError ? h2("div", { className: "cpwb-skills-action-error", role: "alert" }, localError) : null,
    conflict && conflict.key === key && conflict.request === importRequestRef.current ? h2(SkillConflictDialog, { existing: conflict.existing, incoming: conflict.incoming, busy: replacePending || currentAction?.status === "running", onCancel: () => {
      importRequestRef.current += 1;
      replacePendingRef.current = false;
      setReplacePending(false);
      setConflict(null);
      setSelectedInput(null);
      setLocalError(null);
    }, onReplace: replace }) : null,
    deleteTarget && deleteTarget.key === key ? h2(SkillDeleteDialog, { item: deleteTarget.item, scope: deleteTarget.target.scope, busy: currentAction?.status === "running", onCancel: () => setDeleteTarget(null), onConfirm: () => {
      const captured = deleteTarget;
      if (!isCurrent(captured.key, captured.generation)) return;
      store3.actions.deleteSkill({ ...captured.target, name: captured.item.name }).then(() => {
        if (isCurrent(captured.key, captured.generation)) setDeleteTarget(null);
      }).catch(() => {
      });
    } }) : null
  );
}
function ProjectSkillsPanel({ store: store3, projectId }) {
  return h2(SkillScopeManager, { store: store3, scope: "project", projectId, compact: true });
}

// src/client/ModelIndicator.js
var import_react22 = __toESM(require("react"), 1);
function modelButtonIn(root = document) {
  if (!root || typeof root.querySelectorAll !== "function") return null;
  return Array.from(root.querySelectorAll("button[aria-label]")).find((button) => {
    const label = button.getAttribute("aria-label") || "";
    return label.startsWith("\u9009\u62E9\u6A21\u578B\uFF0C\u5F53\u524D") || label.startsWith("Select model, current");
  }) || null;
}
function parseNativeModelSelectionLabel(value) {
  if (typeof value !== "string") return null;
  const zh = value.match(/^选择模型，当前\s*(.+?)，推理等级\s*(.+)$/i);
  if (zh) return zh[1].trim() + " \xB7 " + zh[2].trim();
  const en = value.match(/^Select model, current\s*(.+?),\s*reasoning effort\s*(.+)$/i);
  if (en) return en[1].trim() + " \xB7 " + en[2].trim();
  return null;
}
function compactModelSelectionLabel(value) {
  if (typeof value !== "string" || !value.trim()) return "\u6A21\u578B \xB7 \u81EA\u52A8";
  const [model, effort] = value.split(" \xB7 ");
  const compactModel = String(model || "").replace(/^DeepSeek[-\s]*/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return [compactModel || model, effort].filter(Boolean).join(" \xB7 ");
}
function useNativeModelSelectionLabel(sessionId) {
  const [label, setLabel] = import_react22.default.useState(null);
  import_react22.default.useEffect(function() {
    if (typeof document === "undefined") return void 0;
    const update = function() {
      const native = modelButtonIn(document);
      setLabel(parseNativeModelSelectionLabel(native?.getAttribute("aria-label")));
    };
    update();
    if (typeof MutationObserver !== "function") return void 0;
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-label"]
    });
    return function() {
      observer.disconnect();
    };
  }, [sessionId]);
  return label;
}
function ModelIndicator({ sessionId, locked = false }) {
  const selection = useNativeModelSelectionLabel(sessionId);
  const label = compactModelSelectionLabel(selection);
  const openNativeModelMenu = function() {
    if (locked || typeof document === "undefined") return;
    modelButtonIn(document)?.click?.();
  };
  return import_react22.default.createElement("button", {
    type: "button",
    className: "cpwb-model-indicator",
    disabled: locked,
    title: selection ? "\u5F53\u524D\u6A21\u578B\uFF1A" + selection : "\u6253\u5F00\u6A21\u578B\u4E0E\u63A8\u7406\u7B49\u7EA7\u9009\u62E9",
    "aria-label": selection ? "\u5F53\u524D\u6A21\u578B " + selection + "\uFF0C\u70B9\u51FB\u5207\u6362" : "\u6253\u5F00\u6A21\u578B\u4E0E\u63A8\u7406\u7B49\u7EA7\u9009\u62E9",
    onClick: openNativeModelMenu
  }, import_react22.default.createElement("span", null, label), import_react22.default.createElement(s5, { size: 14, weight: "bold", "aria-hidden": true }));
}
function registerModelIndicator(ctx) {
  return ctx.slots.inject("conversation.input.right", function() {
    return ctx.slots.register({
      name: "conversation.input.right",
      id: "cpwb-model-indicator",
      order: 40
    }, ModelIndicator);
  });
}

// src/client/KnowledgeSourcesTail.js
var import_react24 = __toESM(require("react"), 1);
function groupKnowledgeDocuments(citations) {
  const groups = /* @__PURE__ */ new Map();
  for (const citation of Array.isArray(citations) ? citations : []) {
    const documentId = Number(citation?.documentId);
    const validId = Number.isSafeInteger(documentId) && documentId > 0 ? documentId : null;
    const name = String(citation?.originalName || "\u672A\u77E5\u6587\u6863");
    const key = validId === null ? "file:" + name : "document:" + validId;
    const group = groups.get(key) || { documentId: validId, name, locators: [] };
    const locator = String(citation?.locator || "").trim();
    if (locator && !group.locators.includes(locator)) group.locators.push(locator);
    groups.set(key, group);
  }
  return [...groups.values()];
}
function KnowledgeSourcesTail({ matched }) {
  const documents = groupKnowledgeDocuments(matched?.citations);
  if (documents.length === 0) return null;
  const passageCount = Number.isSafeInteger(matched?.passageCount) ? matched.passageCount : matched.citations.length;
  return import_react24.default.createElement(
    "details",
    { className: "cpwb-knowledge-sources-tail", open: true },
    import_react24.default.createElement(
      "summary",
      { className: "cpwb-knowledge-sources-summary" },
      import_react24.default.createElement("span", { className: "cpwb-knowledge-sources-mark", "aria-hidden": true }, "K"),
      import_react24.default.createElement("span", { className: "cpwb-knowledge-sources-title" }, "\u672C\u8F6E\u77E5\u8BC6\u6765\u6E90"),
      import_react24.default.createElement(
        "span",
        { className: "cpwb-knowledge-sources-count" },
        documents.length + " \u4E2A\u6587\u6863 / " + passageCount + " \u4E2A\u7247\u6BB5"
      )
    ),
    import_react24.default.createElement(
      "div",
      { className: "cpwb-knowledge-sources-list" },
      documents.map((document2) => {
        const content = import_react24.default.createElement(
          import_react24.default.Fragment,
          null,
          import_react24.default.createElement(s11, { size: 15, weight: "regular", "aria-hidden": true }),
          import_react24.default.createElement("span", { className: "cpwb-knowledge-source-name" }, document2.name),
          import_react24.default.createElement("span", { className: "cpwb-knowledge-source-locator" }, document2.locators.join(" / ")),
          document2.documentId === null ? null : import_react24.default.createElement(n, {
            size: 14,
            weight: "bold",
            "aria-hidden": true
          })
        );
        return document2.documentId === null ? import_react24.default.createElement("span", { key: "file:" + document2.name, className: "cpwb-knowledge-source cpwb-knowledge-source-static" }, content) : import_react24.default.createElement("a", {
          key: "document:" + document2.documentId,
          className: "cpwb-knowledge-source",
          href: cpwbApi.documents.contentUrl(document2.documentId),
          target: "_blank",
          rel: "noreferrer"
        }, content);
      })
    )
  );
}

// src/client/WorkbenchSessionShell.js
function compactSessionId(sessionId) {
  const value = String(sessionId || "");
  return value.length > 26 ? value.slice(0, 14) + "\u2026" + value.slice(-8) : value;
}
function SessionIdCopy({ sessionId }) {
  const [copied, setCopied] = import_react26.default.useState(false);
  const resetTimer = import_react26.default.useRef(null);
  import_react26.default.useEffect(function() {
    return function() {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);
  const copy = async function() {
    const writeText = globalThis.navigator?.clipboard?.writeText;
    if (typeof writeText !== "function") return;
    try {
      await writeText.call(globalThis.navigator.clipboard, sessionId);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };
  return import_react26.default.createElement(
    "span",
    { className: "cpwb-session-id", title: sessionId },
    import_react26.default.createElement("code", null, compactSessionId(sessionId)),
    import_react26.default.createElement("button", {
      type: "button",
      className: "cpwb-session-id-copy",
      onClick: copy,
      "aria-label": "\u590D\u5236 Session ID",
      title: copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u5B8C\u6574 Session ID"
    }, copied ? import_react26.default.createElement(n3, { size: 14, weight: "bold", "aria-hidden": true }) : import_react26.default.createElement(s9, { size: 14, weight: "regular", "aria-hidden": true }))
  );
}
var PROJECT_TOOL_TABS = Object.freeze([
  ["todos", "\u5F85\u529E", s4],
  ["schedule", "\u5B9A\u65F6\u4EFB\u52A1", s8],
  ["knowledge", "\u5173\u8054\u77E5\u8BC6\u5E93", n2],
  ["summary", "\u6BCF\u65E5\u603B\u7ED3", n8],
  ["skills", "Skills", s13]
]);
var KNOWLEDGE_TOOL_TABS = Object.freeze([
  ["documents", "\u6587\u6863", s10],
  ["index", "\u7D22\u5F15", f],
  ["projects", "\u5173\u8054\u9879\u76EE", m5],
  ["global_schedule", "\u5168\u5C40\u5B9A\u65F6", s8]
]);
var INDEPENDENT_TOOL_TABS = Object.freeze([
  ["context", "\u4E0A\u4E0B\u6587", n16],
  ["files", "\u6587\u4EF6", m8],
  ["subagents", "Subagent", n14],
  ["global_schedule", "\u5168\u5C40\u5B9A\u65F6", s8]
]);
function readSessionSnapshot(sessions) {
  try {
    return sessions?.list?.getSnapshot?.() ?? { current: void 0 };
  } catch {
    return { current: void 0 };
  }
}
function projectFor(state, projectId) {
  return Array.isArray(state.projects) ? state.projects.find((project) => project.id === projectId) : null;
}
function knowledgeBaseFor(state, knowledgeBaseId) {
  return Array.isArray(state.knowledgeBases) ? state.knowledgeBases.find((knowledgeBase) => knowledgeBase.id === knowledgeBaseId) : null;
}
var useBrowserLayoutEffect = typeof window === "undefined" ? import_react26.default.useEffect : import_react26.default.useLayoutEffect;
var SESSION_HEADER_STYLE_PROPS = ["box-sizing", "padding-top", "--cpwb-session-header-height"];
function useSessionHeaderSeat(active) {
  useBrowserLayoutEffect(function() {
    if (!active || typeof document === "undefined") return void 0;
    const { conversationColumn } = resolveWorkbenchColumns(document);
    if (!conversationColumn) return void 0;
    const original = captureInlineStyle(conversationColumn, SESSION_HEADER_STYLE_PROPS);
    const update = function() {
      const height = typeof window !== "undefined" && window.innerWidth < 900 ? 108 : 64;
      applyInlineStyle(conversationColumn, {
        "box-sizing": "border-box",
        "padding-top": height + "px",
        "--cpwb-session-header-height": height + "px"
      });
    };
    update();
    window.addEventListener("resize", update);
    return function() {
      window.removeEventListener("resize", update);
      restoreInlineStyle(conversationColumn, original);
    };
  }, [active]);
}
function useContextRailSeat(scopeKey) {
  const [nativeDetailsOpen, setNativeDetailsOpen] = import_react26.default.useState(false);
  useBrowserLayoutEffect(function() {
    setNativeDetailsOpen(false);
    if (!scopeKey || typeof document === "undefined") return void 0;
    const { conversationColumn, detailsColumn } = resolveWorkbenchColumns(document);
    if (!conversationColumn) return void 0;
    const original = captureInlineStyle(conversationColumn, RAIL_STYLE_PROPS);
    const compression = conversationCompression(RAIL_WIDTH_DEFAULT);
    let restored = false;
    const restore = function() {
      if (restored) return;
      restoreInlineStyle(conversationColumn, original);
      restored = true;
    };
    const reserve = function() {
      applyInlineStyle(conversationColumn, {
        "box-sizing": "border-box",
        "padding-right": compression.paddingRight,
        [compression.cssVariable.name]: compression.cssVariable.value
      });
      restored = false;
    };
    const update = function() {
      const detailsWidth = typeof detailsColumn?.getBoundingClientRect === "function" ? detailsColumn.getBoundingClientRect().width || 0 : 0;
      const detailsOpen = detailsWidth > 1;
      setNativeDetailsOpen(detailsOpen);
      const viewportWidth = typeof window === "undefined" ? 1280 : window.innerWidth;
      if (!detailsOpen && !isDrawerMode(viewportWidth)) reserve();
      else restore();
    };
    update();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
    observer?.observe(conversationColumn);
    if (detailsColumn) observer?.observe(detailsColumn);
    window.addEventListener("resize", update);
    return function() {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      restoreInlineStyle(conversationColumn, original);
    };
  }, [scopeKey]);
  return !nativeDetailsOpen;
}
function instantDateKey(value, timeZone) {
  if (!value) return "";
  try {
    const parts2 = localDateTimeParts(value, timeZone);
    return [parts2.year, String(parts2.month).padStart(2, "0"), String(parts2.day).padStart(2, "0")].join("-");
  } catch {
    return "";
  }
}
function GlobalSchedulesPanel({ state, store: store3, initialDialog = false }) {
  import_react26.default.useEffect(function() {
    store3.actions.loadGlobalSchedules?.().catch(function() {
    });
  }, [store3]);
  const rows = Array.isArray(state.globalSchedules) ? state.globalSchedules : [];
  const [dialogOpen, setDialogOpen] = import_react26.default.useState(initialDialog);
  const [query, setQuery] = import_react26.default.useState("");
  const [projectFilter, setProjectFilter] = import_react26.default.useState("all");
  const [statusFilter, setStatusFilter] = import_react26.default.useState("all");
  const [dateFilter, setDateFilter] = import_react26.default.useState("");
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const visibleRows = filterSchedules(rows, query).filter((schedule) => {
    if (projectFilter !== "all" && String(schedule.projectId) !== projectFilter) return false;
    if (statusFilter === "enabled" && schedule.enabled === false) return false;
    if (statusFilter === "paused" && schedule.enabled !== false) return false;
    if (dateFilter && instantDateKey(schedule.nextRunAt || schedule.startsAt, timeZone) !== dateFilter) return false;
    return true;
  });
  const action = state.action;
  const save = (payload) => store3.actions.createGlobalSchedule(payload).then(() => setDialogOpen(false));
  return import_react26.default.createElement(
    "div",
    { className: "cpwb-global-schedules" },
    import_react26.default.createElement(
      "div",
      { className: "cpwb-tool-head cpwb-global-schedule-head" },
      import_react26.default.createElement("span", null, "GLOBAL SCHEDULES"),
      import_react26.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", onClick: () => setDialogOpen(true) }, import_react26.default.createElement(n13, { size: 14, weight: "bold", "aria-hidden": true }), import_react26.default.createElement("span", null, "\u65B0\u589E\u5B9A\u65F6"))
    ),
    import_react26.default.createElement(
      "label",
      { className: "cpwb-tool-search" },
      import_react26.default.createElement(f, { size: 15, "aria-hidden": true }),
      import_react26.default.createElement("input", { type: "search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "\u641C\u7D22\u4EFB\u52A1\u540D\u79F0\u6216\u63D0\u793A\u8BCD", "aria-label": "\u641C\u7D22\u5168\u5C40\u5B9A\u65F6\u4EFB\u52A1" })
    ),
    import_react26.default.createElement(
      "div",
      { className: "cpwb-context-filters", "aria-label": "\u7B5B\u9009\u5168\u5C40\u5B9A\u65F6\u4EFB\u52A1" },
      import_react26.default.createElement("label", null, "\u9879\u76EE", import_react26.default.createElement(CyberSelect, {
        value: projectFilter,
        onChange: setProjectFilter,
        ariaLabel: "\u7B5B\u9009\u5B9A\u65F6\u4EFB\u52A1\u6240\u5C5E\u9879\u76EE",
        options: [{ value: "all", label: "\u5168\u90E8\u9879\u76EE" }, ...(state.projects || []).map((project) => ({ value: String(project.id), label: project.name }))]
      })),
      import_react26.default.createElement("label", null, "\u72B6\u6001", import_react26.default.createElement(CyberSelect, {
        value: statusFilter,
        onChange: setStatusFilter,
        ariaLabel: "\u7B5B\u9009\u5B9A\u65F6\u4EFB\u52A1\u72B6\u6001",
        options: [{ value: "all", label: "\u5168\u90E8\u72B6\u6001" }, { value: "enabled", label: "\u5DF2\u542F\u7528" }, { value: "paused", label: "\u5DF2\u6682\u505C" }]
      })),
      import_react26.default.createElement("label", null, "\u89E6\u53D1\u65E5\u671F", import_react26.default.createElement("input", { type: "date", value: dateFilter, onChange: (event) => setDateFilter(event.target.value) }))
    ),
    import_react26.default.createElement("div", { className: "cpwb-context-filter-count" }, "\u663E\u793A " + visibleRows.length + " / " + rows.length + " \u9879"),
    visibleRows.length === 0 ? import_react26.default.createElement("div", { className: "cpwb-context-empty" }, rows.length ? "\u6CA1\u6709\u7B26\u5408\u7B5B\u9009\u6761\u4EF6\u7684\u5B9A\u65F6\u4EFB\u52A1" : "\u6682\u65E0\u5168\u5C40\u5B9A\u65F6\u4EFB\u52A1") : null,
    import_react26.default.createElement("div", { className: "cpwb-context-list" }, visibleRows.map((schedule) => {
      const project = state.projects?.find?.((item) => item.id === schedule.projectId);
      return import_react26.default.createElement(
        "article",
        { key: schedule.id, className: "cpwb-context-card" },
        import_react26.default.createElement("span", null, project?.name || "\u9879\u76EE #" + schedule.projectId),
        import_react26.default.createElement("strong", null, schedule.name),
        import_react26.default.createElement("small", null, (schedule.enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u6682\u505C") + " \xB7 " + (schedule.nextRunAt || schedule.startsAt || "\u5F85\u8BA1\u7B97"))
      );
    })),
    dialogOpen ? import_react26.default.createElement(ScheduleDialog, {
      projects: state.projects || [],
      timeZone,
      busy: action?.type === "createGlobalSchedule" && action.status === "running",
      error: action?.type === "createGlobalSchedule" && action.status === "error" ? action.error : null,
      onSave: save,
      onClose: () => setDialogOpen(false)
    }) : null
  );
}
function SessionContextPanel({ sessionId, scope, state, store: store3 }) {
  import_react26.default.useEffect(function() {
    store3.actions.loadSessionContext?.(sessionId).catch(function() {
    });
  }, [sessionId, store3]);
  const rows = Array.isArray(state.contextBySession?.[sessionId]) ? state.contextBySession[sessionId] : [];
  const inherited = scope.kind === "project" ? "\u9879\u76EE Workspace + \u5168\u90E8\u5173\u8054\u77E5\u8BC6\u5E93" : scope.kind === "knowledge_base" ? "\u5F53\u524D\u77E5\u8BC6\u5E93\u5168\u90E8\u53EF\u7528\u6587\u6863" : "\u65E0\u9ED8\u8BA4\u7EE7\u627F\u6765\u6E90";
  return import_react26.default.createElement(
    "div",
    { className: "cpwb-context-list" },
    import_react26.default.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" }, import_react26.default.createElement("span", null, "INHERITED"), import_react26.default.createElement("strong", null, inherited), import_react26.default.createElement("small", null, "\u968F\u5BB9\u5668\u5173\u8054\u53D8\u5316\u52A8\u6001\u66F4\u65B0")),
    rows.map((row, index) => import_react26.default.createElement(
      "article",
      { key: row.id || index, className: "cpwb-context-card" },
      import_react26.default.createElement("span", null, String(row.mode || "pinned").toUpperCase()),
      import_react26.default.createElement("strong", null, (row.sourceKind || row.source?.kind) + " / " + (row.sourceId || row.source?.id)),
      import_react26.default.createElement("small", null, row.available === false ? "\u5F15\u7528\u6765\u6E90\u5DF2\u5220\u9664" : "\u4F1A\u8BDD\u56FA\u5B9A\u6765\u6E90")
    ))
  );
}
function SessionFilesPanel() {
  return import_react26.default.createElement(
    "div",
    { className: "cpwb-context-list" },
    import_react26.default.createElement(
      "article",
      { className: "cpwb-context-card cpwb-context-card-primary" },
      import_react26.default.createElement("span", null, "DSH FILES API"),
      import_react26.default.createElement("strong", null, "\u6587\u4EF6\u4E0E\u56FE\u7247\u7531\u539F\u751F\u8F93\u5165\u533A\u7BA1\u7406"),
      import_react26.default.createElement("small", null, "\u4F7F\u7528\u56DE\u5F62\u9488\u3001\u56FE\u7247\u6309\u94AE\u6216 @ \u5F15\u7528\u5F53\u524D Workspace \u6587\u4EF6")
    )
  );
}
function KnowledgeIndexPanel({ knowledgeBaseId, state, store: store3 }) {
  const docs = Array.isArray(state.documents) ? state.documents : [];
  const ready = docs.filter((item) => item.status === "ready").length;
  const stale = docs.filter((item) => item.status === "stale" || item.status === "failed").length;
  return import_react26.default.createElement(
    "div",
    { className: "cpwb-context-list" },
    import_react26.default.createElement(
      "article",
      { className: "cpwb-context-card cpwb-context-card-primary" },
      import_react26.default.createElement("span", null, "VECTOR INDEX"),
      import_react26.default.createElement("strong", null, ready + " / " + docs.length + " \u6587\u6863\u5C31\u7EEA"),
      import_react26.default.createElement("small", null, stale ? stale + " \u4E2A\u7D22\u5F15\u9700\u8981\u5904\u7406" : "\u7D22\u5F15\u72B6\u6001\u6B63\u5E38")
    ),
    import_react26.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: () => store3.actions.reindexKnowledgeBase?.(knowledgeBaseId) }, "\u91CD\u5EFA\u5F53\u524D\u77E5\u8BC6\u5E93\u7D22\u5F15")
  );
}
function LinkedProjectsPanel({ knowledgeBaseId, state, store: store3 }) {
  import_react26.default.useEffect(function() {
    store3.actions.loadKnowledgeBaseProjects?.(knowledgeBaseId).catch(function() {
    });
  }, [knowledgeBaseId, store3]);
  const projects = Array.isArray(state.linkedProjects) ? state.linkedProjects : [];
  return import_react26.default.createElement("div", { className: "cpwb-context-list" }, projects.length ? projects.map((project) => import_react26.default.createElement("article", { key: project.id, className: "cpwb-context-card" }, import_react26.default.createElement("span", null, "PROJECT"), import_react26.default.createElement("strong", null, project.name), import_react26.default.createElement("small", null, project.path || "\u5DF2\u5173\u8054"))) : import_react26.default.createElement("div", { className: "cpwb-context-empty" }, "\u5C1A\u672A\u5173\u8054\u4EFB\u4F55\u9879\u76EE"));
}
function WorkbenchSessionShell(props) {
  const tabIdSeed = import_react26.default.useId();
  const tabIdPrefix = "cpwb-tool-tab-" + tabIdSeed.replace(/:/g, "-");
  const tabRefs = import_react26.default.useRef(/* @__PURE__ */ new Map());
  const state = import_react26.default.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const homeOpenSnapshot = useHomeOpen();
  const sessionSnapshot = import_react26.default.useSyncExternalStore(
    props.sessions?.list?.subscribe || (() => () => {
    }),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions)),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions))
  );
  const sessionId = props.sessionId ?? sessionSnapshot.current;
  const opening = props.opening === true;
  const openError = props.openError?.message ? props.openError : null;
  const runtimeEntry = getWorkbenchSession(sessionId);
  const persistedEntry = state.workbenchSessions?.[sessionId];
  const entry = persistedEntry ? { ...runtimeEntry, ...persistedEntry } : runtimeEntry;
  const scope = entry?.scope;
  const projectId = scope?.kind === "project" ? scope.id : null;
  const knowledgeBaseId = scope?.kind === "knowledge_base" ? scope.id : null;
  const project = projectId == null ? null : projectFor(state, projectId);
  const knowledgeBase = knowledgeBaseId == null ? null : knowledgeBaseFor(state, knowledgeBaseId);
  const [activeTool, setActiveTool] = import_react26.default.useState(function() {
    return scope?.kind === "project" ? "todos" : scope?.kind === "knowledge_base" ? "documents" : "context";
  });
  const visible = props.open === void 0 ? !homeOpenSnapshot : props.open;
  const scopeKey = scope?.kind ? scope.kind + ":" + String(scope.id ?? "") : null;
  const contextSeatAvailable = useContextRailSeat(scopeKey);
  useSessionHeaderSeat(visible && Boolean(sessionId?.startsWith?.("session-cpwb-")));
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const projectTriggerRef = import_react26.default.useRef(null);
  const [subagentOpen, setSubagentOpen] = import_react26.default.useState(false);
  const subagentCatalog = sessionSnapshot?.subagentsByParent?.[sessionId];
  const subagentCount = Array.isArray(subagentCatalog?.entries) ? subagentCatalog.entries.filter((item) => item?.kind === "child").length : 0;
  import_react26.default.useEffect(function() {
    setSubagentOpen(false);
    if (!visible || opening || openError || !sessionId || typeof props.sessions?.refreshSubagents !== "function") return void 0;
    props.sessions.refreshSubagents(sessionId).catch(function() {
    });
    return void 0;
  }, [openError, opening, props.sessions, sessionId, visible]);
  import_react26.default.useEffect(function() {
    setActiveTool(scope?.kind === "project" ? "todos" : scope?.kind === "knowledge_base" ? "documents" : "context");
  }, [scope?.kind, scope?.id]);
  import_react26.default.useEffect(function() {
    if (scope?.kind !== "independent" || entry?.title || typeof props.store.actions.loadRecentSessions !== "function") return void 0;
    let attempts = 0;
    let stopped = false;
    let timer = null;
    const refresh = async function() {
      attempts += 1;
      await props.store.actions.loadRecentSessions().catch(function() {
      });
      if (!stopped && attempts < 12) timer = setTimeout(refresh, 1500);
    };
    void refresh();
    return function() {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [entry?.title, props.store, scope?.kind, sessionId]);
  import_react26.default.useEffect(function() {
    if (!opening && !openError && projectId != null && state.activeProjectId !== projectId) {
      props.store.actions.refreshProject(projectId).catch(function() {
      });
    }
  }, [openError, opening, projectId, props.store, state.activeProjectId]);
  if (!visible || !sessionId || !String(sessionId).startsWith("session-cpwb-")) return null;
  const toolTabs = projectId != null ? PROJECT_TOOL_TABS : knowledgeBaseId != null ? KNOWLEDGE_TOOL_TABS : INDEPENDENT_TOOL_TABS;
  const effectiveActiveTool = toolTabs.some(([id]) => id === activeTool) ? activeTool : toolTabs[0]?.[0];
  const tabIdFor = (id) => tabIdPrefix + "-" + id;
  const tabPanelId = tabIdPrefix + "-panel";
  const setTabRef = (id) => (node) => {
    if (node) tabRefs.current.set(id, node);
    else tabRefs.current.delete(id);
  };
  const onToolTabKeyDown = (event, id) => {
    const currentId = toolTabs.some(([tabId]) => tabId === id) ? id : effectiveActiveTool;
    const currentIndex = toolTabs.findIndex(([tabId]) => tabId === currentId);
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % toolTabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + toolTabs.length) % toolTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = toolTabs.length - 1;
    else return;
    event.preventDefault();
    const nextId = toolTabs[nextIndex][0];
    setActiveTool(nextId);
    tabRefs.current.get(nextId)?.focus?.();
  };
  let body = null;
  if (projectId != null) {
    if (effectiveActiveTool === "todos") body = import_react26.default.createElement(Todos, { store: props.store, projectId });
    else if (effectiveActiveTool === "schedule") body = import_react26.default.createElement(Automation, { store: props.store, projectId, view: "schedule" });
    else if (effectiveActiveTool === "knowledge") body = import_react26.default.createElement(KnowledgeBase, { store: props.store, projectId, view: "linked" });
    else if (effectiveActiveTool === "summary") body = import_react26.default.createElement(Automation, { store: props.store, projectId, view: "summary" });
    else if (effectiveActiveTool === "skills") body = import_react26.default.createElement(ProjectSkillsPanel, { store: props.store, projectId });
  } else if (knowledgeBaseId != null) {
    if (effectiveActiveTool === "documents") body = import_react26.default.createElement(KnowledgeBase, { store: props.store, knowledgeBaseId, view: "documents" });
    else if (effectiveActiveTool === "index") body = import_react26.default.createElement(KnowledgeIndexPanel, { knowledgeBaseId, state, store: props.store });
    else if (effectiveActiveTool === "projects") body = import_react26.default.createElement(LinkedProjectsPanel, { knowledgeBaseId, state, store: props.store });
    else if (effectiveActiveTool === "global_schedule") body = import_react26.default.createElement(GlobalSchedulesPanel, { state, store: props.store });
  } else {
    if (effectiveActiveTool === "context") body = import_react26.default.createElement(SessionContextPanel, { sessionId, scope: scope || { kind: "independent", id: null }, state, store: props.store });
    else if (effectiveActiveTool === "files") body = import_react26.default.createElement(SessionFilesPanel);
    else if (effectiveActiveTool === "subagents") body = import_react26.default.createElement(
      "div",
      { className: "cpwb-context-list" },
      import_react26.default.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" }, import_react26.default.createElement("span", null, "SUBAGENT ACTIVITY"), import_react26.default.createElement("strong", null, subagentCount + " \u4E2A\u5B50\u667A\u80FD\u4F53"), import_react26.default.createElement("small", null, "\u67E5\u770B\u4F1A\u8BDD\u3001\u72B6\u6001\u4E0E\u8FD0\u884C\u8BE6\u60C5")),
      import_react26.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: () => setSubagentOpen(true) }, "\u6253\u5F00 Subagent \u62BD\u5C49")
    );
    else if (effectiveActiveTool === "global_schedule") body = import_react26.default.createElement(GlobalSchedulesPanel, { state, store: props.store });
  }
  const contextRail = function(drawer = false) {
    const railKind = projectId != null ? "PROJECT SYSTEM" : knowledgeBaseId != null ? "KNOWLEDGE SYSTEM" : "SESSION SYSTEM";
    const railName = projectId != null ? project?.name || "\u9879\u76EE\u5DE5\u4F5C\u53F0" : knowledgeBaseId != null ? knowledgeBase?.name || "\u77E5\u8BC6\u5E93" : entry?.title || "\u72EC\u7ACB\u4F1A\u8BDD";
    const railMeta = projectId != null ? "\u9879\u76EE\u4E0A\u4E0B\u6587 \xB7 " + String(projectId).padStart(2, "0") : knowledgeBaseId != null ? "\u77E5\u8BC6\u5E93\u4E0A\u4E0B\u6587 \xB7 " + String(knowledgeBaseId).padStart(2, "0") : "\u65E0\u5BB9\u5668\u5F52\u5C5E \xB7 GLOBAL";
    return import_react26.default.createElement(
      "aside",
      { className: "cpwb-project-rail" + (drawer ? " cpwb-project-rail-drawer" : ""), "aria-label": "\u4E0A\u4E0B\u6587\u5DE5\u5177" },
      import_react26.default.createElement(
        "header",
        { className: "cpwb-project-rail-header" },
        import_react26.default.createElement("span", null, railKind),
        import_react26.default.createElement("h2", null, railName),
        import_react26.default.createElement("small", null, railMeta)
      ),
      import_react26.default.createElement("nav", { className: "cpwb-project-tool-tabs", role: "tablist", "aria-label": "\u4E0A\u4E0B\u6587\u5DE5\u5177", "data-tool-count": String(toolTabs.length) }, toolTabs.map(([id, label, IconComponent]) => import_react26.default.createElement("button", {
        type: "button",
        role: "tab",
        id: tabIdFor(id),
        ref: setTabRef(id),
        key: id,
        className: effectiveActiveTool === id ? "cpwb-active" : "",
        onClick: () => setActiveTool(id),
        onKeyDown: (event) => onToolTabKeyDown(event, id),
        tabIndex: effectiveActiveTool === id ? 0 : -1,
        "aria-selected": effectiveActiveTool === id,
        "aria-controls": tabPanelId,
        "aria-current": effectiveActiveTool === id ? "page" : void 0,
        title: label
      }, import_react26.default.createElement(IconComponent, { size: 18, weight: "regular", "aria-hidden": true }), import_react26.default.createElement("span", null, label)))),
      import_react26.default.createElement("div", { id: tabPanelId, className: "cpwb-project-tool-body", role: "tabpanel", "aria-label": effectiveActiveTool, "aria-labelledby": tabIdFor(effectiveActiveTool) }, body)
    );
  };
  const transitioning = opening || Boolean(openError);
  const dockedContextRail = !transitioning && contextSeatAvailable && layoutMode === "desktop";
  const drawerContextRail = !transitioning && contextSeatAvailable && layoutMode !== "desktop";
  const contextType = projectId != null ? "\u9879\u76EE\u4F1A\u8BDD" : knowledgeBaseId != null ? "\u77E5\u8BC6\u5E93\u4F1A\u8BDD" : "\u72EC\u7ACB\u4F1A\u8BDD";
  const contextName = projectId != null ? project?.name || "\u9879\u76EE\u5DE5\u4F5C\u53F0" : knowledgeBaseId != null ? knowledgeBase?.name || entry?.contextName || "\u77E5\u8BC6\u5E93" : entry?.title || entry?.displayTitle || "\u65B0\u72EC\u7ACB\u4F1A\u8BDD";
  const contextDetail = opening ? "\u6B63\u5728\u6062\u590D\u4F1A\u8BDD" : openError ? "\u6062\u590D\u5931\u8D25" : projectId != null ? String(Array.isArray(state.linkedKnowledgeBases) ? state.linkedKnowledgeBases.length : 0) + " \u4E2A\u5173\u8054\u77E5\u8BC6\u5E93" : knowledgeBaseId != null ? "\u5411\u91CF\u68C0\u7D22\u5DF2\u542F\u7528" : "\u672A\u5173\u8054\u9879\u76EE \xB7 \u672A\u542F\u7528\u77E5\u8BC6\u5E93";
  return import_react26.default.createElement(
    "div",
    {
      className: "cpwb-session-chrome cpwb-workbench-overlay " + (dockedContextRail ? "cpwb-has-context-rail " : "") + (projectId != null ? "cpwb-project-context" : "cpwb-standalone-context") + (transitioning ? " cpwb-session-transitioning" : ""),
      "data-session-context": scope?.kind || "unknown",
      "data-right-owner": dockedContextRail ? "context-tools" : !contextSeatAvailable ? "native-details" : void 0,
      "aria-label": "Workbench \u4F1A\u8BDD\u6846\u67B6"
    },
    import_react26.default.createElement(
      "header",
      { className: "cpwb-session-context-bar", "aria-label": "\u4F1A\u8BDD\u4E0A\u4E0B\u6587" },
      import_react26.default.createElement(
        "div",
        { className: "cpwb-session-context-identity" },
        import_react26.default.createElement("span", { className: "cpwb-session-context-kind" }, contextType),
        import_react26.default.createElement("strong", null, contextName),
        import_react26.default.createElement(SessionIdCopy, { sessionId })
      ),
      import_react26.default.createElement(
        "div",
        { className: "cpwb-session-context-meta" },
        import_react26.default.createElement("small", null, contextDetail),
        import_react26.default.createElement("button", {
          type: "button",
          className: "cpwb-session-subagent-trigger",
          onClick: () => setSubagentOpen(true),
          "aria-label": "\u6253\u5F00\u5B50\u667A\u80FD\u4F53\u6D3B\u52A8\uFF0C\u5171 " + subagentCount + " \u4E2A",
          "aria-expanded": subagentOpen
        }, import_react26.default.createElement(n14, { size: 16, weight: "duotone", "aria-hidden": true }), import_react26.default.createElement("span", null, "SUBAGENT"), import_react26.default.createElement("b", null, String(subagentCount).padStart(2, "0")))
      )
    ),
    transitioning ? import_react26.default.createElement("div", {
      className: "cpwb-session-transition",
      role: opening ? "status" : "alert",
      "aria-live": opening ? "polite" : "assertive"
    }, import_react26.default.createElement(
      "div",
      { className: "cpwb-session-transition-panel" },
      import_react26.default.createElement("div", { className: "cpwb-session-transition-code" }, openError ? "SESSION RESTORE ERROR" : "SESSION HANDSHAKE"),
      import_react26.default.createElement("div", { className: "cpwb-session-transition-mark", "aria-hidden": true }, openError ? import_react26.default.createElement(m11, { size: 28, weight: "regular" }) : import_react26.default.createElement(m, { size: 28, weight: "regular" })),
      import_react26.default.createElement("strong", null, openError ? "\u4F1A\u8BDD\u6062\u590D\u5931\u8D25" : "\u6B63\u5728\u6062\u590D\u4F1A\u8BDD"),
      import_react26.default.createElement("p", null, openError ? openError.message : "\u6B63\u5728\u540C\u6B65 DSH \u4F1A\u8BDD\u4E0E Workspace\uFF0C\u8BF7\u7A0D\u5019\u3002"),
      opening ? import_react26.default.createElement(
        "div",
        { className: "cpwb-session-transition-signal", "aria-hidden": true },
        import_react26.default.createElement("i", null),
        import_react26.default.createElement("i", null),
        import_react26.default.createElement("i", null)
      ) : null,
      openError ? import_react26.default.createElement(
        "div",
        { className: "cpwb-session-transition-actions" },
        import_react26.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: props.onRetryOpen }, import_react26.default.createElement(m, { size: 15, "aria-hidden": true }), "\u91CD\u8BD5"),
        import_react26.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: props.onHome }, import_react26.default.createElement(n6, { size: 15, "aria-hidden": true }), "\u8FD4\u56DE\u9996\u9875")
      ) : null
    )) : null,
    dockedContextRail ? contextRail(false) : null,
    drawerContextRail ? import_react26.default.createElement("button", {
      ref: projectTriggerRef,
      type: "button",
      className: "cpwb-project-tool-toggle",
      "aria-label": "\u6253\u5F00\u4E0A\u4E0B\u6587\u5DE5\u5177",
      "aria-expanded": props.projectDrawerOpen === true,
      onClick: props.onProjectDrawerOpen
    }, import_react26.default.createElement(n16, { size: 18, "aria-hidden": true }), import_react26.default.createElement("span", null, "\u4E0A\u4E0B\u6587\u5DE5\u5177")) : null,
    drawerContextRail ? import_react26.default.createElement(DrawerDialog, {
      open: props.projectDrawerOpen === true,
      onClose: props.onProjectDrawerClose,
      label: "\u4E0A\u4E0B\u6587\u5DE5\u5177",
      side: "right",
      triggerRef: projectTriggerRef
    }, contextRail(true)) : null,
    !transitioning ? import_react26.default.createElement(SubagentDrawer, {
      open: subagentOpen,
      parentSessionId: sessionId,
      connection: props.connection,
      sessions: props.sessions,
      onClose: () => setSubagentOpen(false)
    }) : null
  );
}

// src/client/WorkbenchSidebar.js
var import_react29 = __toESM(require("react"), 1);

// src/client/SidebarBrand.js
var import_react28 = __toESM(require("react"), 1);
var APPROVED_NODE_ARTWORK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALIAAACyCAMAAADRVGVaAAADAFBMVEVMaXE/8f1p48U1//+A//9A//9B8v0A//8A//9V//9g7eVB8/1C8v1B8fxB8/1A8/0/8f1C8vw/8v5A8vw/8/0/8/5M2v8/8/0+8v1C9P4/8/1B8/5D8/5B8f1e/7898v1RyshB9P5B8vxYrLtC8v5B8v413O5D8v5F8/5B9P1C8/088v0+8vw/8vw0y/9A8fxD8v088vxA4vA+9P078/1D8/098vxC9PxA9PxE9f493+ZB8/4/8/w93+w/9P1C6fBA8Po88vxD9P7+wAk+9P1C9v3/wgxF9f1B9f0/8vw99P489P1A5OxB5e1E9v1B8/1C9v431dxB9f5A9f5A8/w72+FA4elC9f4/8/468fxD9P1B6OlE8/1G9P4+8/w+9f5C8ftE9v0/9P499f498v084us/2+BD+P5E9fxD5ulB9f498fs+8/xB9v1D9/5C8vxI9P1G9/489PxD9PxP6eVA6fFA9f058fxy5bZC8/w92+R54rRE8PdW/qlF9v1A6fFB9PtB8Po+9v1E7PI79P1B8PlE8/xG9P5C7fRB6/RC8vxB5u5D6vFB9f088/xF8vs+9PxH9/5A6fAAgNFg6dZF9Pz8wQv8wghG8vtE9f5B6vJE8vv8whFG9Pw88/xL9v058vw+2+R64LNA7/tB8vs/7vhF6u9A7/dJ9v5B6vJE7fNG9/5H9ftG8flF6e9F8/xF8/tC7fRH8/tG9PtA7/hA7/lL9/78vg1B7vhD8PhC7/hB7fY/7vdH8flE8Pg/7fY+8/s97fhA7veA/4BD6/RJ9fxM9ftB7fU+3OZO8flM7fA82+VB7vZD7fVF7vU69/018Ps93eY94+5H8/pA5/FP9f0zytL5xBZQ7exQ9Pl94rBV7+1O8fQ42eE84eo11d5W6+Ze59hj59J/4K5X7OjsxiZV7Oo94Ouk1nZS9v5h6NNe69/wwhlW6+KS2o2O2pxg6drfxTSo1oH3xBRb7efGz1jBz1/FzlT1xAiM2p3axzq9z19f6txZ8O/VyTLnxhkZzkHHAAABAHRSTlMA+wUFAgT8AQIDBvn8/Pz7/Pz6+/r7Bvz7+vv8/PoE+gT6/AP6+gb8+/r6+vv6BPz69wj5+Pn4+/v7Gf34CfYW5Pr5+vv5+vv19/z7Gx74+PcW+/vzDA/5+Pj2Dfv88frn9f78/BEI/PMT/vXv8frg+/n27Qsi9/QJ4yIMnQPwL/Xv+UjqvOn5XkD3Jyvv8fL19jMCMd/1+N39NtT45Pr4728Q3+vPRbb9O1X76clP5thr9+zS3Pv5r6SVgdfCs8rowm4CZfPuima8gHh4c6zy7Vywz5L1MfZx5xnL3099Q34kTSGx4pahivk7b8I8Wy1itUziw1eYuPw3jq+S3Oz7hcyLQAAAAAlwSFlzAAALEwAACxMBAJqcGAAAIABJREFUeNrtnXlc03e290O2X35JINJEQCRgQaOkCSQiQRFkqRZyC0QtYAXKyExJoYCiRMQVqCgaRVDHpVqXulZbN1zGXdu6tE61rXbfpnvnzr7fZ2bufZ7nc76/JAQIaufef+7r1SNLCObHOyfnu50tItEP8oP8ID/ID/K/VThOxLFvHH2S+H7hu+n5Pft+94v1/D+u99Xu/di7XdVzSamU90rPrR6ReoTzPJkeCK7386Ur9Re/6/g9qPdTuE9c4S/wCRBeygWUHjj2pxMSxGIx+69SPEiZkMBu82K6H5eQ4l5ugCv5CS4k/f7AwsvGSYcplUpDenF1av6CBXPnLliwID8/jySfyQJ2B+5JzcioLi4yEKKII3Ul8OxZKNkLIFwxwWBQOpXpwn/2SUZGal7+3FWrVq9evWpBanVxabpTLMYTVNIz//5KlkrFCbyr+bXr+08cnT8DcuQIfc3MnEWyGx+ZmfNnzM/M3L1798mT50/svfTysv2LFh0QJcjCpDeWnbm17JwzgVdyzdevnz17dqmhKN0lPbcZcvTo0a0+OXoU92zYsGGW8Js7h269c/PwKtcwPo77PqPM+wIpUp+/NasgZ+a0yfGNjZOemTRp0jN+kvRMY2MSkzSSCRO6CjuqNtysTFAquXWb0+pyZi01pBsMCbcenf7ozGWprtIi6YrjFbmNkyYzya3IFQQ3hXsmN9LtioKKq5tvvT2FG8Z9X2QMhn3LCp4am2YDjy5Jlwa0JK+kpdlwd1KS2cbEDqkpr22bse2VMJfTJc17uaK2Y89hRZHLlXCute1y4d5VzuLKhH2zKrq6JkyYkOsTdpPusk+Y4HZAJqSl2d0l3afePbQPZn/fwAxaoeDeXj5pzhybPSvNFKEdodGYTFqthmTwgw/qNDoj3RcREWRO1Jgh9jR7TW3V6fzS0lKX7Ky9tiP5HVlxaSn/Suvltgb3MUN1pWvd1oIuENkdDqJLTi5JTnYkl9BXh0OFu1Qqo9GoUjmSHe6Wqh3XnufuyzYIl2EreNHhzkZrltms0+p0RvkIo1zOeKOGDBkyfMhwJiP0msTEIL0+kTHbC6uOrgyrdBXzV1pra6v25kuKimUHM/dAyaczXJXFeRcrch1pwHO73cmCAJeQSSwWi8qYnW2xEDY9lavvvnYfeu6ZtBRx3L7j8bYYk9k0GKodoTGqhwN5hDrKaIwqM0apLcOj1FFyuTwxUROcyJDTalqOH3MWFxNmeXlH69t8UaVs3dbatraO8+vSMaWc7c4ldaosDofFImAmZwvfsy24nWy0RI0cRcwqvAaOkrXvvi26p559yIph3MojSVYddKzTDIZuAacZgS9q9XAjE7VxuFqNO/RaQg4Kgpbd3deLK6srww6fLK8trLluqIRq9xe21RZmHjZkZJR+1gklq+if22Lxqtkn2YKiy8pGlYGZzCa5ZO21wzQGufuZK0B8YH6SzWzWmjVkv/rERNCBUa9W0wuXkhJK1Gp9sF4eHBwM64Ci3WXL8kqLivjmE1VtHa2fOcMq011n60C8+3CCyyV9u7Wl0J5MWtZb3B4tk34FPSe3Q83GMpJRo4ZbynCPylFRcW0pJ+a4ew89BRHPmgAdq8wgg3K1quBguWaoEUoOiTLKtVqVSmPU6+XaYIJN1Gi0Gq3Z3XqlGotM863OPbUdl1YeaF655XpnR0dH67lV+5pXv32yu8XudpMhWzD6YBz06adlSzbxWvCvzGikJ6NSQc8f7uPE0ntrGXa8clZSl82s0hPzCFiFGcigHxoVFWXUAFkrp7mDbiSagxK12kgtkGuwnJw/mdlSi8FXU1PTWlOTUremsKu8tRa3zeauNEwVZjb6yJjJpi0kUC99IeIoWAWg6TVgv0leu+PDfSLx3ZZv4BKx4vCRtDmYcTGmtHq9UW80a/RmIEK1xvj4eJWDLR1pmNbsNLexG2lpXXUVdR0dDbWXa2vXrHmzvK4ut25NV9eaOV1db2Lubenq6mrB7N3ibnEL4mBfS3okucRIOi4TnoSb7L29e8eHsOc4bkBoECvihvFXGuIJl4nerFJpoZvGyViVCgoKJgkybVIK/k2bFB8/ddrUx8aO1cQ/NnNsY2PXnK45c5KSHp24ffujkJ/85CeP0sdjP3qMydR4kmmQeDKGyZNL8FHgJyXJbkeyBXbhJnu3WEYlF7RfuyIdFjfQjoOZsZj/eXe8GXOFOYiItWaVLs2R82xZQVVVZ+eSzuPHX3rpyDYmG0jY/mDDBto23Dm0bNn+/fhc5pH9F0+fvnX69OmL+5dduHDo0J07tKOAsEds23bkpd5y/PiSHfU5Ock+CwfyqFHta9+94YwbFljNZMZiseGz7mm6iERtkAbIOnxqHfZT164fXrpy5YEDW9Y1Y8s1d+7cfLaDy/Nuyiori4uL0p1hhgRZggyC3ZzwTcGEfkwwhKW7SosrKyt7dnDCFs4jzc3rtqxc+ca1emMym6WTacYbNWrctPYd70xRDguoZ0ZcdL3bqIvUaE1g1mN40XDZsXkFx+Zsth2XyTxQ2O7jZ5n3HkhCgmwgYf+R77Wnl/IyZZhSEoYNrlIikeD/0DhbeqjeO2kT8ahxU7MLdtxe4Aw02eG/x4lLv2ufrJPLY2PliTQT6PUqR0v90aXS0aPDwkaHjSYJ8whhSEmNHlViU9L3ABB41vceCGQyiUSpxBXTR/skLJ1bfaHeTYu424M8JD5+0qnbC5RxgZBhyOe6c5M0IbFAxtqm16rM5pb6QwdwZfYHfEJqkw58UhHda3vuAZfJlH1EIhvNzb1Q38k2Hu05OaNyhqTETx07+dR3xcMCqTmO+7QzN0mnCZGHqNUjsbppzWmFyRdWc+lhElkYewWFV5FeSNk9T0SewxjHNgK9TqBeXcskSs9LJvDim4wfLc1fVl8F5jKoGXNeSsrUx54p2PG8tL+aMcOl7p00IVKrCQEzoNUqVZq7fdkqyWgZLibh8TL6KZnn732K8x5fB9qR8xwuyq6qZOqgV5OXhknzXt/RmdwO5JwcMA9J0YyNn715Vf8LcXGi13K6zFotiDWxsaFqrcpRUr8snw8jZfBFqZgXBMEMUV1dzPPc9xC/g36PQYfl56XiKJhBE09lcamrOkyKV08m4fIu7MDSksP2HDnjyowp8dkvfAbAflo27J80gRZj6BiC/VTJjmX5MomMl0mkeWcPHTpxYusJnNbObz15fuvRc1Lp/ek4oIOAIYNs69aTm09u3iCcB+/cOZcnleG6YVw+mJPLymDNsOdRUVFDsl+85BrWF1khem9Go85o0iTKQx57LCTkweEV0DEXRsRc3umOOgdOes+MnTjRtD1rek3yLZmU476nnnurmefyd1utNjqX6SA4nXXVni6S0kQUxuVd3OHuLsspy4E5AzlquPFqM9d3gwS7mD3BqBmkGSQPf+wxzWPx2acu5vESmlAlooNVl9fUWPEHINMh8yadNnxP5B5oP+R586ZPZ9BJuK513poNc0USmrolXMbFHd3t7Tnjxo3LAfLwKPfsY6K4fsjXn7JrwmEX4eFDHwvXZJ9alspJeJpBw7gVDW3YjGHnYTKZsrKypk+feloJD8V/V8uZ063TscbiLPlgZGTWdmvN5rkcQyY9v36quz2nfRQsI2rk8KGOZxf1M2ZOcespB+xCow0Jfyx8ovHFC/m8TEGuG/giriyprfFslAh6unUmIf9rxD5kUX5m1nQ6XWoefPDBwTpdjHXOrLkimbBGyrj813d0kymXCcjjljmlfQ9RRSeeHh7CjqQh4eG6F7eugo55tk4pFVeWtArIiWZBzVNPSxTfR8sBpmVelJc5hiFDzQ/qfpSks1qBLPEs6xJp/qFT7fWYNiwjR44MkYdvntJnmuNE1dumqqDjWK1GrtHNPrJPZuA9WwKl4phXy1otM43pj936nsj9tawQ5V2OyWLIgiRZrfOhZa9TUsIf+HBHO7RswUqsMYZvS8UU0cssRKlHnjZiqcZhz2QyFryB9ULKC8hhQC63G81mIx1GIiKysuY9duZ7IAdeSRQckG1ZpAhGbIphWpb5PKKysGP17VAykNVy4/htU/ojz3/aEquN1cRqTY2z92eQUfA9WgayCkc+TSyYTVnWqWdgc6J/idgPeY+A7FFyktU2ay7nQ8aaknEHzAAOlst1449M6X3YJuTMpy10+MdrX9B9UBrGNpfs2Sr5V5YUEjKO1aE4m0YAeRFWP9G/Auy/lOxhhhGh0zyg1Q0mw+ilZX607NwTDFktVweFLA+g5czxFr2czqBpBUdWczLm/ha0LCAbyQGlhp4jtlufXaSQ3Q/y3TZyQNYRsuYBDbmkkvog00x30IesG788kJYZslprSpt5qRKLvWdPDmTZzSWFjiFGI45jeBU0kdutT529D+R77D251D26GLNJp9GC2KyzxfRDlu6zJDPkYLk5fCAtJybGEvKyUs/Bw4P8BpDjYRkWS4oqVseQuXsh33O7zGUQsgbIRhCTlsf0RT7gLhOQY83hxwMhh+v1mHjNJvvMlwVkKd+DDFvW06nXmGI0bbfOBLJI9C/g9kfWasxGvYoGYF9kCZDZfBEaGzuAlsPdejb52mcuK+J7kGU+ZL1FFaoKNWqe9CDfBZq7twObkGHJ2li4pWDLj+ustvn+MwZ2Gls6aVZWBwfHagMNvymZ493wsgUHme2TgCzhvUdSzBg3PVrW6xky07JENDDzffnce5B1hGzGJDd/laBlnCQZ8jpCloNJPjCyXh9sFpBlvuAWlkEBmQTUWsEwJFwg5O8RJuAylpO/REsfOgF5hj+ywoOsBpXcHLK8OgDyj/V6u7k/Mh/GkOGzpPGnVwnIIgnH3cUy7u1f5YHcyBxSZr1Kb2bIy1d7kelTwjW3WhiyXK4aeqSSC6BlIAta3u81DA8yzcs6pmR8ak1ZNQGQveHIeyrbDzle8PtBoGtzD7KUeRlkDDlUrQ8dEDlcLxhG16T9Llkf5HI7nLeCbRh1JuvMRSJZb8MQ3XegzndYTV0Of5+RHJVGPYwDS8kehqwQiAVkEOlD9WrH0G0BkTFj4GWy2QnZz5bDFB5kCzMOo07XNXMRR3uMXoYh+r7IeQ1AVulZWABKtgG5mSEr/JBVQIYv3hHSB5nzIkNstppJ+9Ml/rasuAlkhovfq4zapK7ZhMyCt3yPDyuw+Meq/W/JuLkd8SDWqygygNXPZrU1NHN9kPVMy+q7INOTHQBZp2JGh6GiM9mBjC2tlPsXQ/qwZByCVy0BskfMzJYJmfNDXs2QgwUtV/dDpqWEDWBCHi3xt2XFG1VkGHqVZ6TYamYvYkesvNXrDqzct1SQfT7x3LH0MAn9hrlNe2Rd81yXRCldXeUwq7Tk+tOrmGEERtbCMOSOkCMBkGcwLQebbRh+o8N62TKQcValBVvFBredkCWi/ENHMy/vaUWkoba2sMUj5K/vK3WFiJpUVVW1tBQWltfW7pl/qFk6WrqlxKFl0S7i0tHr27GuLzLZMtY3zMtHpvgjC8eaGeH0IgQLWu6NfA7IWiBjAGIR1JntaxfxstGidQ0NtRRngNTMmTPHOmYMPkimT4cHYY4gvlsIVszBELPOmzevcMYB3iXdV+bQy43DjSNGjGDIVlt5L2QJIZMtBycG2+SBkC8DOTFYmJf9kfkeZAuLJGLGWLtIBuQDDbU7QcvEat2+fXtWzEMPZW3P2t5LzNs9kW9dGsW+CXrNnpWyIv5gmQPnTAofYptOJ2xrISEreiOTkvVam7o3sqgHmS0lBf2QK8ptOsEwQGxOcwNZks4Buba8psae1pVGTpmYyMERgyMinnzSlIUvRJu1nZ2TIslVodMhboWgEUF3dSyVFPMrxjkorgXDQIxOq4uxBUCmFx6fWhhGamDDGAD5elWhWQeLQ2SLIbeQlgm5o7YQttuFiFQauakinwSrRx4lZpzHTbifwjq0vUyjT5ttzoROQj72rCMyVks6Dk4kZKutcAsn8xH7ZgxCtvVBFvXYcqJgGE4PsrQHWaMPFmzZqE2DLUug5ZXLOwqBbKfwGNHoIkymR4mWPiHbTUlJJpM5MjKSgBE10iJBIi3JZs1tODy6Unbz2Ubs4+Qaxky2bG0JhKwlZHtoIOQ949nwSzRj+Dk98zLiClLeoLhekWseoVdb1IAOJeTZZ6RKIG9YXk4Tgt3udjDk7dsBOxEyODLSZIo0CWdnIEeyIJfOGK+ibI6uqpeWjq6WvfGsA8Yi10SNkFPoPoCWV+2x0LSqHgA5dQYOUtpgrYkhMy0r2CaQN/CEjBg2kPWhocZYrT1n/hbOJam+vryqgxkGwpdJMTEI90G9/wZ5ktkymUUk/plME03mJHoCqngk0ORWdZ7LqyzOuPCsTmMC8lC1XEvIY8bUrVP0RbYw5FBV1PL+yFOWM2S51uxd/RR+yG5zlIZC7TiBx8aqVO6cl5Zy6bLKs0saSM0TYBhmm0kHk4ic+OijEwWJFGQicZs8TtmkRkduydU3SquLXYtyks0aU6SGLAOuCHOMbQwNP3/kuQw5mM5+Ucun9N8WzfgxGUaoFju5ZYTsiTV5kYdo1Ai8wwEGh5IWzJ1XpOnpGYuOV3Vg9SBjJhdjZARmjPBwuHthHIMHRwKJlIwvZNWw56R4JC3cLM6odC1qd8MscMAGM4ixQE2f3tFHy3Nn0CTHkEP6IosEZAt+TVpe5iJkrxhk1ytaVPGaUEprIOBYrVHlLui+PlqirD53fElnFa15dpvHm0uIQkqPhljoZ9gxaXns2MZJuRXXjrkyKjPOFFQ4dIKbD7hasnXr9NrAyKEBkeFGnPFjix4HLRp+L2Pz6d21KniD7NzVFhzSQi0MWaNJQTRFlVsx+0ylzDX62LaqBkLGxJzFBBY9MTwcuBOJmYg9a0tSUiOmx6sfgDjvYk6Jg/Zv+GfSUhw3yBxEm88+yJlqATlURQt2X89n5fwf49SC3BsTkItkPQ/FpuvcVUxyqlBLaGgoAj9IIoG+jckVsy9mjC6WHb5z7QjyA8rXdNUwP79HpcKCx74yXMgzzxSsvXbDlVE693UQk/MJXhfyACNirjNnzbM2rO5jy5l6L3IUtkX9kcdbLGySs/ZB5vmD25Ld2ljYOZBj8bS0RuOQlOzkkhcv5o/OkK2+9ckGCptDGjohVS1V3VVV3VevVl29uqRKkE5E7as6j7/04Q1Xtav5Qk6uIz5++AgtnazNJkAHBWVZpyftz1DwfABkuVo/vh+yQlTtQYZTYOalUj9kjleEHT6aY3eHqrQwDBLK1jFmx0+uePHCOlepMmP16nU/vQ/51bp1zaWlyn1bcyZjOcRuiJkxGQXbenadzegJL/sbhloeAuRKrq9PjpD12sTgRJzsLhX7I+M63JZDOW53qJa2t7EwCmSnpBiN2QUVL95ZKSkW89KBwhD4xeLFi6MhiEamu5wGl3PFkRwHnZ2GC4dUcwwjrrFVvcL3IvYiawnZ+PRAyMGEDDdiMe+PjDMEN/diQQ0Ba8k6WDpbGfLakgtyth10ulxipJdGi6OjkVqLHNM+kekmj7hcpZUu142rBZON8UZySsKhpicjzsqyWe0NKzgyCs4fOT/TwpDVIfqntxX3Q55Cqx+9DKa0p/ZW9kKmXZUi70xJDc1IsRiDRkpaQnzZOCS58alrH7jSldEsWCCc7QS1insJoTubSpV5i7oLSMehRgu5cWjYETIRi2S9dCwg6wVk2PK2UtFAyIkBkRUSGZjtaSZixp8cMsSYok5JSTZOmzzz6gcGZ7THMhjzq68yU2CswrdoBu1Kz/i6u6UR841Wy84jGH6wCkHHmN4E735/ZNpPj99WJOL6LtjzQ5hhBJlsvZG9u1dJ/pkCrHHaWCTLlRmhYhgIYswpkyZd+4CPXuw1Zumr3Ks9ahaA2U/KJmfxou6WNFVKSixGHW3utZgpoOQa+/IVPOmYwhEBDEOeGGuGlvsbBtmynmzZNrOPljnBnsPmLqowp0Xq9GTJmDLAHJqSkjKpseDqBz3IHAcle61BHD1sWLQg+Mn5n90tUPLYeC2LlWMNwAKCucI+66AkjFcE0jJb/eSxcvPTGwIiY9OUKA8G8om+yCy7RTY6/2zBBCStwolt1MTHI6EAs0fjJCzD3TeUPZPG4sUiEagXizlRdA8zDOPzzhbk1qaNZYuiJigoIsJsisFcQcQyRQDkPA+yPET39KyiwMh00CLk6v6GQbahzDhb5XAYHVj8UsbCklXJySk5JY2NjQU7vnVKFws6XizivvrrP/74m9/85h9/XciJxQIzNP7ra3VY2N0pY1UUq2PmTLObY+vSMEY8ALKWIY+fVdR/+GWy4adPDIxMszOvDCu6XpVb6HUAYFHbceH1+mTH2MaSHd82vfqqQPzVP/688eGf/Wwj5Dd/bXpVTMjixdEfXKt7s6srLfNSRRWSrbvs+Aepcd85IA2jMHAA5FQ/Ww6EPD/E7UPO6K9l5pqSyIrOvXR17Vp8rF07e/aOd9/9YPWh+pI0Ve7Vd/9zF0cjj/vTbx4BMMnGjc+9/8ffL26iMbjw82t1tV3lE9w3Dl/bcerFF2e/OHP22oqKqoo7OInwjLgvMnyjmXT2S4zFoSUw8vh7IWNUK3nX0oOQFSuufPDB559//usv+J++Xl/idle9+19fiRZzi0V/+vMjG4H78MP0sfH997/5Ey0j0b/6cElH3ZrGlz535f3hg89vQN64+cGxK1euwNnJnHV+WWC9kLFtShSQuQCG4bbcA5kcMRJP2YuUMrBk0U5XdN7X9UhFf/dzLhpW8fdvHtn43M8Y88NeZnFTk/irj5d0dLTcWSp1KqWkdW/pi0jk8S76kBX9kYMIOT0gMnPN3M0wIBKl02kwOJ3p6S4SfFXm3SrpqPvwC1H0q9zCPz7sR/zwpk3PbXzujx81LVwo/s+rDXV39kmxnDud9GinAZdB9pbXNUp/QhHAMEjHhLx7AORQaNmMeTkAsk/NyJhjSXPYTBiowMVZLP11RVvj14sXvxot+t3PNv6sh/jhTY8899zG938X3bRw8a+vNdQd+kIqjuYxGKPFMjFlLfEyvlf10YDItn7IdJCaP5UMA36MAZDpGCgwC9DCagFmV9OigrZnPheJXxWL/+PhjX7EDz/yyCPPbdz0t6aFu8RfftLQsOGnnFJYCn0+aak/c+8/14MMYw0Hsqgfcgiz5bsgK3gvsyCeNS464+O6y7l/EImjud9/s2mTHzGQYRmb/viReJf47x83XD7+WwE5OtrPiz4QMZBTGXIQQ54VEJlti8yw5UvVd9eyh1hgdkbnf1LX1vGlqGnhq7/7Pxs3sWHn1fEjZBnf/F68a+Hv/9LR1v1lL2RZX09/351c3m69PigoKNGUmDU+EPIMIId6kWWyAZXsBy1j6xqfCuTLvxIpm179pQdZgBaIn9v4578P27Xro6872goO90aW3RvZDmLIgMh0kKKA8MuBkKWKfsQCcvQXQN7zK2h5MSFv+tmmhzcR8yM9yOJdu3Z9vaYt5Q+ckvdH7qvnXvrBHn13ECHLBeR+NSW0X/YhVwZC7q9k/ABk6U8/JC1zTYKWPWp++GceYiD/XulB/jXvQfZahsxX+tibmU2ninxByzj1mwZC9ng+C14u7o/M9yNmP2H0c192vtn25pfcQtjy/9tEyMIHgAVb/s1XC2EYf3mzbeLnUld0HzX7xbL8tOxDtjHk2AGQfyyc/YC8rC8yTmUDISu5VV+3vLnzzV9zC5te/fv/3eQ1jIcB/ByTjf/YtWvhwq/+a03bnKNYS6IJmh4u6Q3scbX2qIch46yVKGyLAiGHsM2pPgAyZmGDQeLN2g0LcxqUPcRffNyyBshf01Zi4T/JMphtkF0w6Ef+/NemXbvEP/2kbc3Orm2HpVisBSUrDSROWgLDnCyP2cA8gV58g4CsHdiW5wvIiZSP0QeZzr7sUj2rlMeSlSIQ174J+firxcqFi3/3f7HlBDPZhEfLG//41cKFuxb/4d22nWtqa7d9IGUnK6wmSlmfYl26qp/GPcg0LweaMeCT8yDDndcHmRetWtFXtjiZHYpFqw+11KLk5ZmtXy6Elnct/Nv7AvImn138+U9Nu5qw+n1cgvhZ7Z7OG4L7QMlXIjJ4UNgWkuDG4YyeDAUZGQZti4JIzOF9t0Xk4GIpJBT3E7Ts72g6tm1+Q0ddhUda6morLlZLsZIYuC137HtQeVbw8a+kyibsisW//4/332e2sWnTRgJ+//2/7SKLaVr4xbedhXta9+zp/laJzZFMKc3fjFBLVUldXUlJBcp3EBzc1sxJFL2RbXdDniWkkCQyLfuvfhLuSkPbzp1r5lGwbB7JzsJbxQA2SPedRBitvLD76y+kC5tg5+KFSsa8kRHTueT9v33U1KRk0OI/fNLZ2tq6p/tMBpcudsryZ62ZR9echzjcmjXzdu7cmdmskPD9kTVBGvP4zf2Riz3IQcyW+QR/5BUdO+dNnzedIuPWMVbkL7ecKVI606UHN5N9tlz9tlrpImLsLLEz/uU3DJbJN7/8SNnk9Rlxv/24mzFfWMXDXTN3G3lKs3SkxZgYXHXenmZO0s8wYMx3Q6ZIpoDs7xLnrgB5DEX2YswRMQ+NmT7PfctV5JKsmHW5rba2ZfMHlU2lTU0ed9ZCcdOf/vnN+xuxC33/m3/+bqGSlEyOl2hlk/SLr7uh6D3urVv4Yufc+bik7oEH9NogHZgfmm7ds66fYXiQ08ZvdgZC1gvpUFasfnxCb+TaeWOsNviNdTGIwkyf13ir1KW8Of9y2862lgv7oGKnBxlqbloY/dHvfvm3//jn3375u4/EzFywtSZZ7JS6brxEzIWbl8pcc4+k2XS6IApawZn40EPzrLV+yLwPGVujwMiVs+QsHwOuEAGZ761laARlzFBG1kNj5jhuyaqv77n8Vltty5m5YpcTlexNPT5DnEGUTR99JAw7z/2CzwgF8IfBt+qXAAAYtElEQVS3dmMQti5focw/ngb/OXPVBjEtz6vdEggZdhMR0DAqZ4Uw5KD+yIpjHWvmsZAvaWPMQ2OsjcvWnW643NZWu+dGMe/0OTubCHnhQqwckIX4J7g8SfniaHgXF+PYx616nQy6tfvGwRKHt0gPLx6Qp5cfADLz2ArIeQwZTvPAyNWZPcOvFzIiUsfq1tSMYaYcQ9ceY7W2ZraAeM2sg8h79/homYrhNIrGwrFQ+AS9mFtMz4R0DGS2XFYuIubatD12VlKoFQKahFzIkHv2GHm7hQTJAbTM/BjBdPaDF58h84JfC8Uwr1StqWFBEMIma7Z2Fba1tXXdOcDRWY73+AmJ7Q+//mIXbnp4o5Ufffnr6sVNZBbQMctuFEuVbxzvhHG0uFm+GQtJwf9JyCu9yMyh5kEOohkjZHOgsx9DZvMyTiX+yJI3qtZYH7eZHyefO6n5IWtN+Zq28ourRN7FiiE7lanfdndvvvj5lz/9ikzjo1/94duPP7z27ReLlfAWkY5ZTjQ6UqzY0NDaWmgnZISoGXNfZIWAbKd5ORGZApuL+iGnzvAgI00VpxJ/ZAMhp7HqUNtDZBjTrWPWtE0+WypkaHo3oUrlrz4ei0SSR9O6P/n4L3/5y8f/da07paWlo/vCT7kmsgpfZpSBW3qnc0+N2W5O1Gu0ekHLmJlz+yKfZAs2wsbm8A19vEUCsoWtfr2QWaZA2BvMMGzmGLMtxoYskawx82rdZ3mpkIfH8gnInvd9MnbM9ke3j5ljmzN2LPzOE+Bzm4OS1mmf/FYq+Pm9zE5p84XOVgRkE/VBSC5iQ1BA9g+iKVJPPoD5YBC2+AEdXKnLaVsEZiDv7Yu8pLxGKMG1MbuAmguuS/0PxxhW0t+C+CFKapiYZEubM6cRlbfPsHhf46RPcLTm/XulGKRzLybXQMvkypezYFrMdGvdyl6hSkUGQyanQNaPAyJPpYMUpWv4kD0pJIRsfdysx+MB/kDMGGvajFec/h4IHoNq1aGxlOdCeRgTWZR9IiGzIOWE+M2/5cS9UuYMfP6yWLuWkBF3p9yigMhmGzthA3l+YC1bWKyEHFwM2Zv1YgCy/fEHHniATaGYmmvi96PQ0v+VlkmrX4dVbDdlUbaLCQ01dGPHJiX9aGJSTNIY6Hna5t+iCLy3ng+nOBJRbqpVG+Ejj+mPzBOynREPhDyV+ZfNgk8uwS+Dy/BGR7lV97h5BNLazEGorKiZvN+l9HfzyGSGRTOTMDQjIk0REayRBnpojCVl6340eLDmwckzP1zp0TMvqFnJLS1zBOFF1SIpBQW+ZMsdhOx3ZM04ScfVIArcA5kLaBg0MQP5fG9kCbIRrWksT3WETmfLstZMvuiU+BkGlHwjpxEJTxGUG4CXWp1iZAmtY1nRyOMaY7anQUCPmiWilWV2eTClvZCWI0jLvZHJMOi4GhCZZb0cEWyZDON8qh8y6jtuNpRT6wkVxcl1MVnba3IvuiQyHzOIj1V12ZF1RPoK1SI/xqKiriLxKmFpGzHCqCrJeQnnPt7buwhaXlmmCpJThAytCuQC8r7eyKk9thweEPlZSxlt5bTmPshY/RpqkUBpduj1I1gGUU3JRaQ/9GhMeqyhcAIiprFGVP+wcFVoCiUCxCPbWUvxTeTPZudOvnZQ6vQ9TQl3oGxEEI0/Kkf2aHkf1ws5b7eKnAKJQWTL6YG0jB4gagtSj546n9fLMHgBmXLxkaQyOCarpoCQvWVfvHRFQ20h69SSotWw3F7YZ7Ijhe4xU/qCnjJ+p+VOA7N3CMAwDuSY5YnIZmJ5chqqkSJkaS9kRIwHQcuDYu6GrGfIvWYMLzLy5PSU0MaQeYln5PHSK3vKC+2UX6ENRbePMrzOkJwyVbxWxfKpKcOObDu34NpBzlMdx5B1VCxE1TmEjKSzjqW9kemEHTSIJCIw8rOWgZCPNbTahWxELK5BCIcWnEYeORv7OGgfaygvR+MJvPhqhC7VQB4yJPmJzdfKHCpWpDScyn6MKrSpcCeDWXh1yDByUAaTghyr4cNhGRSzrFvaK03Vh4zxFxB5OWzZEuoxjD7Ix1tZljhjhpa7gMyzVDrUep/rKKyxE7JKr4EtUFuOsuz6O+tuvFuCGCGYKRhLSfzU6yf5JQ8zkLfkmNmsTK+KHFruQeZ8yCov8vjAyO0WD/KJflquxQvP0lTR+UcX01VwKx0OQfJRFZ8toTw5OyXqW9CrJIUaf2S/+Hq+rPTGjmQ3noeRMkXZnEdNFUquHRa2f0puyzgdBYbViIhTxFaXZc09DGRqLMJULVPM3U3+rcRBpsSBkNGSIjRUr00jZENfZPqbFqNluB7Jbl2zb6WjCh5FMpVnxiFJTigrII1qKFScnHOhmnNKJDe60aPDYbZQWx+HhdTscJSUHD9IzDJ058oxaxDtpSIoDNseZCHeJSBrzWyL0R+ZlpK85WTLPmT/PQYbfioaX7BJWAaQz4zGIWQ0n39xZpqdqhYwmQBaJUdivSq5/kI1CqtQ1H/zanKLw2HTk02wXjpoTpPraFiB8kNCHgdbZgmSoaFaTVBMlrXxoA/ZT8tkGkFPB1j9BGQqFHU8tVfQsselh4oHpmXS4nCjoOUzEuXodL750FRkO9AIG05TA/4D4ErqL2SwUl2JhDt2td3tYGasJ0VbWJ+txoqbUjgkudU5Do2aiRd5EkP2RiuBnEkbOUKOGBh55Eh9DzLvj/ygilJzhg+3jIAtv4j85dGSdVufBrFGY4yi7lYjCFrtKDkF55eE7aJlYdwVMCPT3qF3M2TVcIc5rWtCxU0yjFU5DjllibPyOG2izubRMtdjGJnMJceQMwMit48qGzlSrcV+WVhKerS8REAuI2vWA3n2Itload6heLuOrR3UMwqNxNDQCDq+mCH1ruXEfLzErTLbVaxLkYW6FaH7TsWSFVIPslodFYWaPoxDQj7sQ1b4kE00AAMbxnEBOZQh9zIMVr2DKa6MJixsdrYTcrroQMEEWwRKcOVRakpM12nMWru7fZGLdCwVqnWJuTO5EE9FxboRUS8knc6eu/aWS0KGEaRGzUgU5sVQNvym+ZA5YZLLDGI7/EDIIgG5ftSoMprkvMjCscSHzBLboU8z07JoXdUEGDJ2YUNZ2yUMMntu1aLKXhtpjLNjnVU11DCMlEyigprXnnFh+D3hkIeG0h4Ko54hT146ALJ8IOT6UU+MKguNJVvmDX4HKZ+WGfIQlA8QMtdchTNKLHVAo2RejH2HvepspZSXcr2Yw17pdtdgTXGQntE3DLntuQVnRo/m1uU41KEWfKCMkOZlZI/v623LiEjR8KM9fn9kTpT6EkMeFSUg+5/9ZMd8yLSS6dK6Chbxo7nVS9Kos5hGyMUyqtK6Ss5k+NJ1epj5Y51uO7WxgjUzZIeAvAXIaqE0XC1Hya3NVrfSN2N4kc20kzOZgsYHQJ4CZBjGqKgUZssDIlvIMICczjUvcdhizZR/TGX9WNtKbuVJeW8Bog8apUVXjrtRMIgFNBkTHml57Zl0VB/kOJAkGDVSTXWIrEqq7oB3Xvbsl0nLZBmx5qmZgZBf8CFf6ovcUG53eJFxmPJoucFBWiY71siR0VxyOo/r3U5Fyj6wnVhxHHrWA9mhMqfp0goZ8kpCpgp8y8golM+hdrVuC11Aynn3GBm7NWZhi2+mSU4RCBmGgaXEh8xmDBykCJkNP2HGsFEpDJCPwxEBLWsjoWmzu+RiviIAMc0eNG+43VT9g7UQHf5aKhahhebKJ2DLZWxUR1kI2YqCIzq29CCfDKLVj7b44wdEfuKJMqMj51JqQo+WcVx9hZBpKTGqBMNAkQZDJmeryUQnPnvyhbncQC1rPMzJ1LWP2qPV9SBD0FlPTcg2a0ezoGXvCTvVs2AH3U3LUHOZY/alPLTTEmo0mB+DlSgik9aDbINhGEZLgZzGvL84oNrK7kLMbONYZ5mbVm5CzvVDRlEXiuMoyRabz2bBlj0HbFnqyQibCcjILepvy9jJeQyDkE/kJ/gjj74pIA/Jpp3vCJ3NDuQwaXNDGuuIBl+Eowwtme7WFghHgSudJW7WMNNs92g5h+ZlOTZiONhrScsMmdJdBWRD3u4IOvsNSpSbp+4O4BQg5Pp69DayzG5YpzDwXmRZWDpcL2acRodQIyHjCJQoYpIKUzTvYWnsVB0w7sJqXnHXen10VVpxtaSFLAP9NSsWuYoUK1GJFhyKhAromGXbWHMFZKZmcihtaYVKBg2ipSRkVpGi3375pSfYjAGotfUr/JYSQkbB0YOUTjtuXHbUCI3OnsNWrz1Wexa56uw5h1ZzCu7u5e+wjYPH0a0vzYssXVnGgjMwDDWrRbPNmbzOD1mRkPBOCDwv8kGJsXL9+H7IcaI8IDPisnGOFxYZnDJfWk5Y+rmKXF0KIZeNGmIcGhFjzz5drISWrTWIgtnNOYdWcfdulyFFM6HlyYXULRYzRlEpz5BJMPxGDNVgwZ60RXD/kjnjD6/aPTgGZVeIYUPLm/sirxelbnsCLXfopR+S3L75gNPA90IGL06hUWVR6hERMWnZpysNQEaZH/5+MogVnOie7TLAvPQIMdcUFixCc9iV1CkCvhe9cMaOBPIBoQ6bZjmUul3XPI42LUAeJNdHHe2v5SmbX2ivZ83FylIcsw81JxgEPTPktbkjwIumR1inRiDDedzFaoNiHUMuLEATKZnifjqSSMNEK4+043BbXrIIbVdXhtqCEukgxSragzUx9nEHWKslIkYD6iuFE1E7aBo0CGZjefaO0w+ZrraeKzr0Qnc769RVlh1fcOriAlmCwk/LQ8iQo6i31IgIkz3Hi1xTaNyfR+7K+0Im5vklhV3QMiGr7EGJ1LqOagTgFjBPAHKCgIzo7uHWqTHhpicBPHSo3PLisjhFn1ruOMWtF7pH0YG+LFRjjC/ZcYvFSygpbjRpeciDMIwogoYt27JPZ4QR8rw1KehkY2BJzvduHobsQINo5YyWWgy/4mLJymQ7On4FszMJdZnJsqesZMi0JeK2zJiqe9L0ZDiAhw4NcT9xRtQPWfRZjpu1Bi0LpU1xxY4z6Vi1CTksjJAJeBy18DJGZNkLTpOWZ9TsNO9PRaRccRct+9k4qxETLZ1R2NB9lrTsxnwwiPnk2F7O1JUjIGPocc27ZyahImxi+NChI8GcnPOZfw8upodhol900llX0LMxVlXVfR3VUWjSiGSUc2vROCU7mzrM0gJmram4VYzhN2NnzbI8nEwVfG9k/8r9Xn1/qHopjFs6o/PqWReGX0uN3SbUo+NI6XDUFM4mZJhjArd667jGyHB5ODrFkZajLO2f9m4bRsa8vvjlWIdaq7bArRZKrZurrt7kqamkJExyeMPayVPHUdsx9B6LmjpWO/tMukGxek/u3lWcJ6Z518YCnD+zgTt8dMfZ9HTFgRKHLkIDqCgMkyFDpk2d1LlFRL3VcOmtT03QyYXiYfX4oUOzyzJTRev7Iou5z561I+NczkpdcLwvqVpyTIGUc6g5bOlF1odUaF5O3equF0sQ7Ni/hTPwCj/me/XDZUuTQbH07EFsPrds2Dxr1vzM+Uzwbffpgy5qFBom3XJ0Zm68KjREHSVQy/Uv3O7T9JoZM7dgs8McrovUsj636M9bUnX1iiwMXp+wMGnGKuom7+kLSBKGuzOKFZQDwSsCIHMBO0IJrULDeFxSIkv3tqtHl1K0KV21qlqBMoKwBOm+bbNzk7BBiML2H5W4MHd99y96K5lpmRPH/bzeHhEeqQklZGrdnFtx9RVKrqI/IBwyfElnKI2BQhI8u+oey/A3g0Ba9mwBhJ4FnH8qu4xmU/w1l+zwS5NzG+HYQ6/gKLU6EfOyvv52396k7JHr11fezjGjzlvo3YzO05NLKq7ecEHPgJYkyHyZyxID636K9vwy3lftdj/9lTw5jTKhUaiQViyR4K0KhPQzZJ6lFyWseGltbuPk5CFsE6ZWo+mouWzvgr5XFhaTuLgFl3JqGHF7+6j29uRJkyoq1p6tlqDRp6+U3L+tKw1OhTcf715tPXzjj/fkBUp7ZWQybme6S3bs2tqKyZOzpw0ZRy2ZqVjPnHPyvQDt29kFxXHv7a13DAFwez0+c6ZNmzy54tStfN6F55/gE4MgwnfWqLYXNte3vKNnthDofN1C6WbPFcPS04vTDee615ZMRr9k1v4VLoqUWFXO+UDEwty83rD+vROnSrBrFpAxo02bXDL7wiopXV7af8FQ+HTM3NhcgO61Io8Fe/4p+l6gJ8eT7NnwTv3akmx0nsyh8xGQozSqFy+9N0DrdkKOM4jA3L2jfgeoqcnmuCHTsttPbV3RvMrzbhR4Kwo2uD0tjVlDY+plTN2MmVBlQFFpMdoWV0/xNjouRV/0Iupk7O1iLDw0zzcBpabSu13MXXdwf/1sh5Fe5VEeyUmuv7QAxIGbvInWr18fJ+beu/Dv74KZ6XlUe9mQ7HHJz9ZfPXLixMndeCMKQWbMuIz3p8ik96M4en7rCchefOzd+7Igy/B5CT/uPXH+/Hm6fy/9dAI/nWQXmeGR+cIlvJLZGfpsvCrWgu6e5GkD76ic9hcOLRiwPb5nCIq5Ba+DeccOMg/4FY1laCfsSE4Zi0Llif/2qEd+4vn+Iz9JmtNFPUZ2eoW1+qCaoo6OJSQYVJNmTppKMm3qg/iKjt54GCuMx7UhP0pK02ioJM+j4Zz69lMXBib2TnTI18oD87/vYMQQizEWYUcV6sKFJp9CqTX7hnh60uNMJtAbaZRPKOyo3dPW9hbJTpa7SOhttQ0MeUkVsiQpQAFnNBXaCu0FWfk4nSGRlIHlm1rvC8iw55z2U/tTubh7L6piLhXM75KWyUWAwlqIVihjN3l6XzxJ8OYY3eDBjw8e/ACYVY6uqm3XX3vl3GefXSLive+8c/v27ZffmremtnzZO+9cP/vO6Ya17cnZ9MYFtOnGImyU6xG61kZQmpwJJYt6FhpWs30ZO2m0t586PeWub07hHcN4l4JUZhv17fRI1E9ibjRFPhluCu+BNuFMZiLkwUgn1DyuetDdvu1muoJ3cuvOz3vrrd1vF1Xnp667jfTQrpebnagAnfLOVQyOMvTVN8IJTu8PoaXuBxoNZcElwk0mH4H3jRiJ3vtsIYNzMTv51Oli0vG9mTE/o5UpQ6bHwkdEpaYmOtE8iQO6oG2UF0ZEUC8UHbrL4D0wSqquHRMbioudqftB/Nb1ytIpxXnfvTVv57y9zQmlldWlh2ftYMjkCRHaHaK6AkXSiAihWwh6b7AdBYRsgjoaWhynbjNi0T2R12N+ZGOwmwafRZ2CTt1aj108OYh9I+xBLEU3CJvHoZoRw7O7d7xjSHC6DKm3p7/11vTbU8RFRc6fv7XzrXmX93FFRcVFq/avLWmnrp1lFBqBHxzvDoEkelBrtcEUlFJbRqoZctlIivBqtZYXvivihnHc/b0xBeVMvncILZBDQjQ6xhsbxHoyIMyCZi6JlCARhIMkyjgRK3lgsE6FVs15CszI6d9hxE2/tJpPLxq25TzGXs3PFTRPVy6qoGbbFsGbzDwBWj1sWY7wJ/yT6uFo8opPNbnIKZFFq51Q/52BXnHRfexpadpg8/Oh+hqbbtCTTK+wXBv5CxOFhA7f3MHSeCN1abO3NgMtnXuttXan9eQBRXqRs+h2TdvOtHeGGdLTSw2vLa/rclOkBJzkMUbqlkqrYfF4zCFqgsZzgX7Zs0FanOOF78Q08u67PR3m52Hce7c7w+FZYfMZ63EhpFZ45w7vhEfNABqPgtLgFK0739paPuNTzmkQcz/HW2qU7C/lnU68I8je2jVd1PUjzdNdWGiL4QnKkmDUIfwdCreiHgE3d0H97SL4Vu7dRc13ZIOecUqZ8vzeqseSHrXBJYQGNN63kHB7BV4fT+enCQ2fcumGdG7BparW8s7PiJh/u7Wh9eqhBRy2Z3F5p9e0sUUF0e4J5C3yXsL7lhTtJLi08F4xOS+8sPuzIjZXBGgs3H/V9j2zuLi49Qve/u5SZmtaCmZ1FKr2yGySgkmTG/F2RcjMP/KZwil28qm3Onbvnn8dwMPSP72zbcO2O59yhjhD3ILbbZdryyc804gNGnv7CfbwtYJc9V7z1Cl2d333jJO3n39P4U88MDLnfe8yr67j1nPpqe99+vzPSZ5//vnXmDwvCN18++23P/3001+8V6QYNsypmPILyBYM87hhhvxVq9dtWSCOw+24Bbj707ff9jzy5z5hV3m+t7z29i/eSxWjf/z69fel5D76FonWx8V5pj1FH+9Kry2miH6I8yxTCnhIaKSToySOldyTLxgSJ1wmzl8C7qwxkOL+hW6AXmg8HsoeBvH+lWHDfD8pvBB4OiL27iz0dz2vFjF69ssevLh7Cl12PelX9H2aLQ5M32uQ/k++b6DnLRVEnjdX4P5nL//fe8fAe5P/ID/ID/KD/CD/6+T/A3fgi70wNcpiAAAAAElFTkSuQmCC";
function nodeArtwork() {
  return import_react28.default.createElement("image", {
    "data-logo-part": "approved-node-artwork",
    href: APPROVED_NODE_ARTWORK,
    width: "178",
    height: "178",
    preserveAspectRatio: "xMidYMid meet"
  });
}
function wordmarkArtwork(fractured = false) {
  const artwork = [
    import_react28.default.createElement("path", {
      key: "main",
      "data-logo-part": "wordmark-main",
      fill: "currentColor",
      fillRule: "evenodd",
      d: [
        "M0 0h7v16h11V0h7v42h-7V23H7v19H0V0Z",
        "M30 42 39 0h10l9 42h-8l-2.2-11h-8.6L37 42h-7Zm10.6-18h5.8L43.5 8l-2.9 16Z",
        "M63 0h17l9 8v13l-7 7 9 14h-9l-8-13h-4v13h-7V0Zm7 7v15h8l4-4v-7l-4-4h-8Z",
        "M96 0h8l12 26V0h7v42h-8l-12-26v26h-7V0Z",
        "M130 0h25l-4 7h-14v9h13v7h-13v12h18l-4 7h-21V0Z",
        "M163 0h25l-4 7h-15l-4 4v4l4 4h11l8 7v8l-8 8h-23l4-7h15l5-5-5-4h-12l-7-7V7l6-7Z",
        "M196 0h25l-4 7h-15l-4 4v4l4 4h11l8 7v8l-8 8h-23l4-7h15l5-5-5-4h-12l-7-7V7l6-7Z"
      ].join(" ")
    }),
    import_react28.default.createElement("path", {
      key: "subtitle",
      "data-logo-part": "wordmark-subtitle",
      fill: "none",
      stroke: "var(--cpwb-logo-cyan, #4de8f4)",
      strokeLinecap: "square",
      strokeLinejoin: "miter",
      strokeWidth: "2.2",
      d: [
        "M2 51l3 12 4-8 4 8 3-12",
        "M30 51h10v12H30V51Z",
        "M57 63V51h8l3 3v3l-3 3h-8m8 0 4 3",
        "M84 51v12m0-6 11-6m-11 6 11 6",
        "M112 51v12h8l3-3v-2l-3-2 3-2v-1l-2-2h-9m0 5h8",
        "M140 51h12m-12 0v12h12m-12-6h10",
        "M168 63V51l12 12V51",
        "M207 52l-2-1h-8l-3 3v6l3 3h8l2-1",
        "M222 51v12m12-12v12m-12-6h12"
      ].join(" ")
    })
  ];
  if (fractured) {
    artwork.push(import_react28.default.createElement("path", {
      key: "fractures",
      "data-logo-part": "wordmark-fractures",
      fill: "var(--cpwb-logo-cut, #080a10)",
      d: "M-2 7h55l-6 4H-8Z M54 17h79l-7 4H48Z M10 30h61l-7 4H4Z M139 8h61l-6 4h-61Z M154 27h80l-8 5h-79Z M42 54h51l-4 2H38Z M126 59h78l-4 2h-78Z"
    }));
  }
  return artwork;
}
function WorkbenchNodeMark({ className = "cpwb-workbench-node-mark", ...props }) {
  const decorative = props["aria-hidden"] === true || props["aria-hidden"] === "true";
  return import_react28.default.createElement(
    "svg",
    {
      ...props,
      className,
      viewBox: "0 0 178 178",
      role: decorative ? void 0 : "img",
      "aria-label": decorative ? void 0 : "Harness Workbench \u56FE\u6807"
    },
    nodeArtwork()
  );
}
function HarnessWordmark({ className = "cpwb-harness-wordmark", fractured = false, ...props }) {
  return import_react28.default.createElement(
    "svg",
    {
      ...props,
      className,
      viewBox: "0 0 236 66",
      "aria-hidden": props["aria-label"] ? void 0 : true
    },
    ...wordmarkArtwork(fractured)
  );
}
function SidebarBrand({ status = "DSH // LOCAL NODE" }) {
  return import_react28.default.createElement(
    "footer",
    { className: "cpwb-sidebar-brand-footer", "aria-label": "Harness Workbench" },
    import_react28.default.createElement("div", { className: "cpwb-sidebar-status" }, status),
    import_react28.default.createElement(
      "div",
      { className: "cpwb-sidebar-wordmark" },
      import_react28.default.createElement(HarnessWordmark, { className: "cpwb-sidebar-footer-wordmark", fractured: true }),
      import_react28.default.createElement(HarnessWordmark, {
        className: "cpwb-sidebar-footer-wordmark cpwb-sidebar-footer-wordmark-channel cpwb-sidebar-footer-wordmark-cyan",
        "data-logo-channel": "cyan"
      }),
      import_react28.default.createElement(HarnessWordmark, {
        className: "cpwb-sidebar-footer-wordmark cpwb-sidebar-footer-wordmark-channel cpwb-sidebar-footer-wordmark-magenta",
        "data-logo-channel": "magenta"
      })
    )
  );
}

// src/client/WorkbenchSidebar.js
var ICON_WEIGHT = "regular";
var RECENT_SESSION_LIMIT2 = 20;
function NavIcon({ component: Component }) {
  return import_react29.default.createElement(Component, { size: 19, weight: ICON_WEIGHT, "aria-hidden": true });
}
function contextLabel(session) {
  if (session.contextName) return session.contextName;
  if (session.scope?.kind === "project") return "\u9879\u76EE";
  if (session.scope?.kind === "knowledge_base") return "\u77E5\u8BC6\u5E93";
  return "\u72EC\u7ACB";
}
function sessionScope(session) {
  if (session?.scope) return { kind: session.scope.kind, id: session.scope.id ?? null };
  return { kind: session?.scopeKind, id: session?.scopeId ?? null };
}
function sessionType(session) {
  if (session?.sessionType === "schedule") return { Icon: s8, label: "\u5B9A\u65F6\u4EFB\u52A1\u4F1A\u8BDD", kind: "schedule" };
  const scope = sessionScope(session);
  if (scope.kind === "project") return { Icon: m5, label: "\u9879\u76EE\u4F1A\u8BDD", kind: "project" };
  if (scope.kind === "knowledge_base") return { Icon: n2, label: "\u77E5\u8BC6\u5E93\u4F1A\u8BDD", kind: "knowledge-base" };
  return { Icon: m4, label: "\u72EC\u7ACB\u4F1A\u8BDD", kind: "independent" };
}
function calendarDay(parts2) {
  return Date.UTC(parts2.year, parts2.month - 1, parts2.day) / 864e5;
}
function activityGroupLabel(session, now, timeZone) {
  const value = session?.updatedAt || session?.createdAt;
  if (!value) return "\u66F4\u65E9";
  try {
    const activity = new Date(value);
    const activityParts = localDateTimeParts(activity, timeZone);
    const nowParts = localDateTimeParts(now, timeZone);
    const daysAgo = calendarDay(nowParts) - calendarDay(activityParts);
    if (daysAgo === 0) return "\u4ECA\u5929";
    if (daysAgo === 1) return "\u6628\u5929";
    if (daysAgo >= 2 && daysAgo <= 6) {
      return new Intl.DateTimeFormat("zh-CN", { timeZone, weekday: "long" }).format(activity);
    }
    if (activityParts.year === nowParts.year) return `${activityParts.month}\u6708${activityParts.day}\u65E5`;
    return `${activityParts.year}\u5E74${activityParts.month}\u6708${activityParts.day}\u65E5`;
  } catch {
    return "\u66F4\u65E9";
  }
}
function groupSidebarSessionsByDate(sessions, {
  now = /* @__PURE__ */ new Date(),
  timeZone = DEFAULT_TIME_ZONE
} = {}) {
  const groups = [];
  const byLabel = /* @__PURE__ */ new Map();
  for (const session of Array.isArray(sessions) ? sessions : []) {
    const label = activityGroupLabel(session, now, timeZone);
    let group = byLabel.get(label);
    if (!group) {
      group = { label, sessions: [] };
      byLabel.set(label, group);
      groups.push(group);
    }
    group.sessions.push(session);
  }
  return groups;
}
function sessionButton(session, activeSessionId, onOpenSession, onArchiveSession) {
  const title = session.title || session.displayTitle || session.contextName || "\u672A\u547D\u540D\u4F1A\u8BDD";
  const active = session.sessionId === activeSessionId;
  const type = sessionType(session);
  return import_react29.default.createElement(
    "div",
    {
      key: session.sessionId,
      className: "cpwb-sidebar-session-row" + (active ? " cpwb-active" : ""),
      "data-session-kind": type.kind
    },
    import_react29.default.createElement(
      "button",
      {
        type: "button",
        className: "cpwb-sidebar-recent",
        onClick: () => onOpenSession?.(session.sessionId),
        "aria-current": active ? "page" : void 0
      },
      import_react29.default.createElement(
        "span",
        { className: "cpwb-sidebar-session-content" },
        import_react29.default.createElement("strong", null, title),
        import_react29.default.createElement(
          "small",
          null,
          import_react29.default.createElement(type.Icon, {
            size: 12,
            weight: ICON_WEIGHT,
            role: "img",
            "aria-label": type.label
          }),
          import_react29.default.createElement("span", null, type.kind === "schedule" ? `\u5B9A\u65F6\u4EFB\u52A1 \xB7 ${contextLabel(session)}` : contextLabel(session))
        )
      )
    ),
    import_react29.default.createElement("button", {
      type: "button",
      className: "cpwb-sidebar-session-action",
      onClick: () => onArchiveSession?.(session.sessionId),
      "aria-label": "\u5F52\u6863\u4F1A\u8BDD " + title,
      title: "\u5F52\u6863\u4F1A\u8BDD"
    }, import_react29.default.createElement(s, { size: 15, weight: "regular", "aria-hidden": true }))
  );
}
function WorkbenchSidebar({
  page,
  activeSessionId,
  recentSessions = [],
  onNavigate,
  onNewSession,
  onOpenSession,
  onArchiveSession,
  settingsTrigger,
  timeZone = DEFAULT_TIME_ZONE
}) {
  const recents = (Array.isArray(recentSessions) ? recentSessions : []).slice(0, RECENT_SESSION_LIMIT2);
  const nav = [
    ["home", "\u9996\u9875", n6],
    ["sessions", "\u5168\u90E8\u4F1A\u8BDD", m6],
    ["knowledge", "\u77E5\u8BC6\u82AF\u7247", n2]
  ];
  return import_react29.default.createElement(
    "aside",
    { className: "cpwb-global-sidebar", "aria-label": "Workbench \u5168\u5C40\u5BFC\u822A" },
    import_react29.default.createElement(
      "div",
      { className: "cpwb-sidebar-primary" },
      import_react29.default.createElement(
        "div",
        { className: "cpwb-sidebar-product" },
        import_react29.default.createElement("div", { className: "cpwb-sidebar-product-mark" }, import_react29.default.createElement(WorkbenchNodeMark)),
        import_react29.default.createElement(
          "div",
          { className: "cpwb-sidebar-product-copy" },
          import_react29.default.createElement(HarnessWordmark, { className: "cpwb-sidebar-product-wordmark" })
        )
      ),
      import_react29.default.createElement(
        "button",
        { type: "button", className: "cpwb-sidebar-new", onClick: onNewSession },
        import_react29.default.createElement(NavIcon, { component: n13 }),
        import_react29.default.createElement("span", null, "\u65B0\u5EFA\u4F1A\u8BDD")
      ),
      import_react29.default.createElement(
        "nav",
        { className: "cpwb-sidebar-global-nav", "aria-label": "\u4E3B\u5BFC\u822A" },
        nav.map(([id, label, IconComponent]) => import_react29.default.createElement("button", {
          type: "button",
          key: id,
          className: "cpwb-sidebar-nav-item" + (page === id ? " cpwb-active" : ""),
          "aria-current": page === id ? "page" : void 0,
          onClick: () => onNavigate?.(id)
        }, import_react29.default.createElement(NavIcon, { component: IconComponent }), import_react29.default.createElement("span", null, label)))
      )
    ),
    import_react29.default.createElement(
      "section",
      { className: "cpwb-sidebar-recents", "aria-label": "\u6700\u8FD1\u4F1A\u8BDD" },
      import_react29.default.createElement("div", { className: "cpwb-sidebar-section-label" }, "\u6700\u8FD1\u4F1A\u8BDD", import_react29.default.createElement("b", null, String(recents.length).padStart(2, "0"))),
      import_react29.default.createElement(
        "div",
        { className: "cpwb-sidebar-recent-scroll" },
        recents.length === 0 ? import_react29.default.createElement("p", { className: "cpwb-sidebar-empty" }, "\u6682\u65E0\u4F1A\u8BDD") : groupSidebarSessionsByDate(recents, { timeZone }).map((group) => import_react29.default.createElement(
          "section",
          {
            key: group.label,
            className: "cpwb-sidebar-date-group",
            "aria-label": group.label
          },
          import_react29.default.createElement("h3", { className: "cpwb-sidebar-date-label" }, group.label),
          group.sessions.map((session) => sessionButton(session, activeSessionId, onOpenSession, onArchiveSession))
        )),
        import_react29.default.createElement(
          "button",
          { type: "button", className: "cpwb-sidebar-all", onClick: () => onNavigate?.("sessions") },
          "\u67E5\u770B\u5168\u90E8\u4F1A\u8BDD"
        )
      )
    ),
    import_react29.default.createElement(
      "div",
      { className: "cpwb-sidebar-fixed-footer" },
      import_react29.default.createElement("button", {
        type: "button",
        className: "cpwb-sidebar-settings cpwb-sidebar-skills" + (page === "skills" ? " cpwb-active" : ""),
        "aria-current": page === "skills" ? "page" : void 0,
        onClick: () => onNavigate?.("skills")
      }, import_react29.default.createElement(NavIcon, { component: s13 }), import_react29.default.createElement("span", null, "Skills")),
      import_react29.default.createElement(
        "button",
        { type: "button", className: "cpwb-sidebar-settings", onClick: settingsTrigger },
        import_react29.default.createElement(NavIcon, { component: s12 }),
        import_react29.default.createElement("span", null, "\u8BBE\u7F6E")
      ),
      import_react29.default.createElement(SidebarBrand, { status: "INTELLIGENCE ONLINE" })
    )
  );
}

// src/client/KnowledgeCenterPage.js
var import_react32 = __toESM(require("react"), 1);

// src/client/knowledgeBackplane.js
var import_react31 = __toESM(require("react"), 1);
function finiteRect(rect, keys = ["left", "right", "top", "bottom", "width", "height"]) {
  if (!rect) return false;
  return keys.every((key) => Number.isFinite(rect[key]));
}
function activeKnowledgeBaseId({ previewId, pinnedId }) {
  return previewId ?? pinnedId ?? null;
}
function nextKnowledgePreviewAfterLeave(currentPreviewId, leavingId) {
  return currentPreviewId === leavingId ? null : currentPreviewId;
}
function routeKnowledgeBackplaneLink({ boardRect, chipRect, panelRect, blockerRects = [] }) {
  if (!finiteRect(boardRect, ["left", "top", "width", "height"]) || !finiteRect(chipRect) || !finiteRect(panelRect, ["left", "top"])) return null;
  const startX = Math.round(chipRect.right - boardRect.left);
  const startY = Math.round(chipRect.top + chipRect.height / 2 - boardRect.top);
  const endX = Math.round(panelRect.left - boardRect.left);
  const endY = Math.round(panelRect.top + 96 - boardRect.top);
  const startYInViewport = chipRect.top + chipRect.height / 2;
  const blockers = blockerRects.filter((rect) => finiteRect(rect) && rect.left < panelRect.left && rect.right > chipRect.right && rect.top <= startYInViewport && rect.bottom >= startYInViewport);
  const nearestBlockerLeft = blockers.length ? Math.min(...blockers.map((rect) => rect.left)) : chipRect.right + 56;
  const firstLaneX = Math.min(
    Math.round(chipRect.right + Math.max(8, (nearestBlockerLeft - chipRect.right) / 2) - boardRect.left),
    endX - 42
  );
  const secondLaneX = endX - 28;
  const laneY = blockers.length ? Math.round(Math.max(chipRect.bottom, ...blockers.map((rect) => rect.bottom)) - boardRect.top + 18) : startY;
  return {
    path: `M ${startX} ${startY} H ${firstLaneX} V ${laneY} H ${secondLaneX} V ${endY} H ${endX}`,
    origin: { x: startX, y: startY },
    target: { x: endX, y: endY },
    viewBox: `0 0 ${Math.round(boardRect.width)} ${Math.round(boardRect.height)}`
  };
}
function sameLink(a65, b) {
  return a65?.path === b?.path && a65?.viewBox === b?.viewBox;
}
function useKnowledgeBackplaneLink({ activeId, boardRef, panelRef, cardRefs, cardCount }) {
  const [link, setLink] = import_react31.default.useState(null);
  const measure = import_react31.default.useCallback(function() {
    const board = boardRef.current;
    const panel = panelRef.current;
    const card = cardRefs.current.get(String(activeId));
    if (!board || !panel || !card) {
      setLink((current) => current == null ? current : null);
      return;
    }
    const next = routeKnowledgeBackplaneLink({
      boardRect: board.getBoundingClientRect(),
      chipRect: card.getBoundingClientRect(),
      panelRect: panel.getBoundingClientRect(),
      blockerRects: [...cardRefs.current.entries()].filter(([id]) => id !== String(activeId)).map(([, element]) => element.getBoundingClientRect())
    });
    setLink((current) => sameLink(current, next) ? current : next);
  }, [activeId, boardRef, panelRef, cardRefs]);
  const useLayoutEffect = typeof window === "undefined" ? import_react31.default.useEffect : import_react31.default.useLayoutEffect;
  useLayoutEffect(function() {
    measure();
    const observed = [boardRef.current, panelRef.current, ...cardRefs.current.values()].filter(Boolean);
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observed.forEach((element) => observer?.observe(element));
    globalThis.addEventListener?.("resize", measure);
    return function() {
      observer?.disconnect();
      globalThis.removeEventListener?.("resize", measure);
    };
  }, [cardCount, measure, boardRef, panelRef, cardRefs]);
  return link;
}

// src/client/KnowledgeCenterPage.js
var h3 = import_react32.default.createElement;
function twoDigits(value) {
  return String(value || 0).padStart(2, "0");
}
function overviewOf(knowledgeBase) {
  return {
    fileCount: 0,
    readyFileCount: 0,
    chunkCount: 0,
    linkedProjectCount: 0,
    sessionCount: 0,
    indexPercent: 0,
    state: "empty",
    latestIndexedAt: null,
    ...knowledgeBase?.overview || {}
  };
}
function startKnowledgeChatDraft({ store: store3, knowledgeBaseId, onDraftOpen }) {
  if (knowledgeBaseId == null) return false;
  store3.actions.startDraft({ scope: { kind: "knowledge_base", id: knowledgeBaseId } });
  onDraftOpen?.();
  return true;
}
function knowledgeStateLabel(overview) {
  const value = overview || {};
  if (value.state === "empty" || !value.fileCount) return "EMPTY";
  if (value.state === "ready") return "READY";
  if (value.state === "attention") return `ATTENTION ${value.indexPercent || 0}%`;
  return `INDEXING ${value.indexPercent || 0}%`;
}
function knowledgeActivityRows(knowledgeBase) {
  const overview = overviewOf(knowledgeBase);
  const rows = [];
  if (knowledgeBase?.recentSession?.updatedAt) {
    rows.push({ at: knowledgeBase.recentSession.updatedAt, label: `${overview.sessionCount} \u4E2A\u77E5\u8BC6\u5E93\u4F1A\u8BDD`, action: "SESSION" });
  }
  if (overview.latestIndexedAt) {
    rows.push({ at: overview.latestIndexedAt, label: `${overview.chunkCount} \u4E2A\u5411\u91CF\u5206\u5757\u53EF\u68C0\u7D22`, action: "INDEX" });
  }
  if (knowledgeBase?.updatedAt) {
    rows.push({ at: knowledgeBase.updatedAt, label: "\u6A21\u5757\u914D\u7F6E\u5DF2\u66F4\u65B0", action: "UPDATE" });
  }
  return rows.slice(0, 3);
}
function formatClock(value, timezone) {
  if (!value) return "--:--";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone || "Asia/Shanghai"
    }).format(new Date(value));
  } catch {
    return "--:--";
  }
}
function fileType(document2) {
  const name = String(document2?.originalName || "FILE");
  const extension = name.includes(".") ? name.split(".").pop() : "FILE";
  return extension.slice(0, 5).toUpperCase();
}
function KnowledgeHeader({ mode, knowledgeBase, onBack, onCreate, onSettings, onUpload, onChat }) {
  const board = mode === "board";
  const create = mode === "create";
  return h3(
    "header",
    { className: "cpwb-page-header cpwb-knowledge-page-head" },
    h3(
      "div",
      { className: "cpwb-page-header-main" },
      h3("span", null, create ? "NEW INTELLIGENCE MODULE" : board ? "KNOWLEDGE BACKPLANE / INTELLIGENCE MODULES" : `KB-MODULE // ${twoDigits(knowledgeBase?.id)} / ${knowledgeStateLabel(overviewOf(knowledgeBase))}`),
      h3("h1", null, create ? "\u521D\u59CB\u5316\u77E5\u8BC6\u82AF\u7247" : board ? "\u77E5\u8BC6\u82AF\u7247" : knowledgeBase?.name || "\u77E5\u8BC6\u5E93"),
      h3("p", null, create ? "\u77E5\u8BC6\u5E93\u521B\u5EFA\u540E\uFF0C\u6587\u4EF6\u4E0A\u4F20\u4E0E\u5411\u91CF\u5316\u4F1A\u5728\u6A21\u5757\u8BE6\u60C5\u4E2D\u7EE7\u7EED\u8FD0\u884C\u3002" : board ? "\u7BA1\u7406\u53EF\u63D2\u62D4\u77E5\u8BC6\u6A21\u5757\u3002\u6587\u4EF6\u3001\u5411\u91CF\u7D22\u5F15\u3001\u5173\u8054\u9879\u76EE\u4E0E\u4F1A\u8BDD\u72B6\u6001\u4FDD\u6301\u5728\u540C\u4E00\u6761\u771F\u5B9E\u6570\u636E\u94FE\u8DEF\u4E0A\u3002" : "\u7BA1\u7406\u539F\u59CB\u6587\u4EF6\u3001\u5411\u91CF\u7D22\u5F15\u548C\u9879\u76EE\u8FDE\u63A5\uFF1B\u4F1A\u8BDD\u7EE7\u7EED\u590D\u7528 Workbench \u7684 RC.2 \u539F\u751F\u80FD\u529B\u3002")
    ),
    h3(
      "div",
      { className: "cpwb-knowledge-head-actions" },
      board ? h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost", onClick: onSettings }, h3(s12, { size: 16 }), "\u5411\u91CF\u6A21\u578B") : null,
      board ? h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary", onClick: onCreate }, h3(n13, { size: 16 }), "\u65B0\u5EFA\u82AF\u7247") : null,
      !board ? h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost", onClick: onBack }, h3(s2, { size: 16 }), "\u8FD4\u56DE\u77E5\u8BC6\u5E93") : null,
      mode === "detail" ? h3("button", { type: "button", className: "cpwb-kb-action", onClick: onUpload }, h3(l7, { size: 16 }), "\u4E0A\u4F20\u6587\u4EF6") : null,
      mode === "detail" ? h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary", onClick: onChat }, h3(m3, { size: 16 }), "\u65B0\u5EFA\u77E5\u8BC6\u5E93\u4F1A\u8BDD") : null
    )
  );
}
function KnowledgeChip({ knowledgeBase, selected, preview, onPin, onPreview, onPreviewEnd, cardRef }) {
  const overview = overviewOf(knowledgeBase);
  const fileValue = overview.state === "indexing" ? `${overview.readyFileCount} / ${overview.fileCount}` : String(overview.fileCount);
  return h3(
    "button",
    {
      ref: cardRef,
      type: "button",
      className: "cpwb-knowledge-chip" + (selected ? " cpwb-selected" : "") + (preview ? " cpwb-preview" : ""),
      "data-kb-id": knowledgeBase.id,
      onMouseEnter: onPreview,
      onMouseLeave: onPreviewEnd,
      onFocus: onPreview,
      onBlur: onPreviewEnd,
      onClick: onPin,
      "aria-pressed": selected,
      "aria-label": `\u9009\u62E9\u77E5\u8BC6\u5E93 ${knowledgeBase.name}`
    },
    h3(
      "span",
      { className: "cpwb-knowledge-chip-top" },
      h3("span", null, `KB-MODULE // ${twoDigits(knowledgeBase.id)}`),
      h3("span", { className: "cpwb-knowledge-chip-state cpwb-state-" + overview.state }, knowledgeStateLabel(overview))
    ),
    h3(
      "span",
      { className: "cpwb-knowledge-chip-core" },
      h3("i", { className: "cpwb-knowledge-die", "aria-hidden": true }),
      h3(
        "span",
        { className: "cpwb-knowledge-chip-copy" },
        h3("h2", null, knowledgeBase.name),
        h3("p", null, knowledgeBase.description || "\u53EF\u88AB\u9879\u76EE\u548C\u72EC\u7ACB\u4F1A\u8BDD\u8C03\u7528\u7684\u77E5\u8BC6\u6A21\u5757")
      )
    ),
    h3(
      "span",
      { className: "cpwb-knowledge-chip-meta" },
      h3("span", null, h3("span", null, "FILES"), h3("b", null, fileValue)),
      h3("span", null, h3("span", null, "CHUNKS"), h3("b", null, overview.chunkCount.toLocaleString("en-US"))),
      h3("span", null, h3("span", null, "LINKS"), h3("b", null, twoDigits(overview.linkedProjectCount)))
    )
  );
}
function KnowledgeBackplane({ knowledgeBase, previewing, panelRef, timezone, onLink, onChat, onDetail }) {
  if (!knowledgeBase) return null;
  const overview = overviewOf(knowledgeBase);
  const projects = Array.isArray(knowledgeBase.linkedProjects) ? knowledgeBase.linkedProjects : [];
  const activity = knowledgeActivityRows(knowledgeBase);
  return h3(
    "aside",
    { ref: panelRef, className: "cpwb-knowledge-core" + (previewing ? " cpwb-previewing" : ""), "aria-live": "polite" },
    h3(
      "header",
      { className: "cpwb-knowledge-core-head" },
      h3(
        "div",
        null,
        h3("span", { className: "cpwb-knowledge-eyebrow" }, previewing ? "\u8FDE\u63A5\u80CC\u677F / HOVER PREVIEW" : "\u8FDE\u63A5\u80CC\u677F / PINNED MODULE"),
        h3("h2", null, knowledgeBase.name),
        h3("small", null, `KB-MODULE // ${twoDigits(knowledgeBase.id)}`)
      ),
      h3("span", { className: "cpwb-knowledge-core-mark" }, "HW")
    ),
    h3(
      "section",
      { className: "cpwb-knowledge-core-section" },
      h3("div", { className: "cpwb-knowledge-core-label" }, h3("span", null, "\u5DF2\u63A5\u5165\u9879\u76EE"), h3("b", null, `${twoDigits(projects.length)} LINKED`)),
      h3("div", { className: "cpwb-knowledge-sockets" }, projects.length ? projects.map((project, index) => h3(
        "div",
        { className: "cpwb-knowledge-socket cpwb-live", key: project.id },
        h3("i", null, `P${index + 1}`),
        h3("span", null, h3("strong", null, project.name), h3("small", null, `${project.sessionCount || 0} \u4E2A\u9879\u76EE\u4F1A\u8BDD`)),
        h3("em", null, "LINKED")
      )) : h3(
        "div",
        { className: "cpwb-knowledge-socket cpwb-empty-socket" },
        h3("i", null, "00"),
        h3("span", null, h3("strong", null, "\u5C1A\u672A\u5173\u8054\u9879\u76EE"), h3("small", null, "\u63A5\u5165\u9879\u76EE\u540E\uFF0C\u8BE5\u77E5\u8BC6\u5E93\u4F1A\u52A0\u5165\u9879\u76EE\u4F1A\u8BDD\u4E0A\u4E0B\u6587"))
      )),
      h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-core-action", onClick: onLink }, h3(p2, { size: 15 }), "\u63A5\u5165\u5176\u4ED6\u9879\u76EE")
    ),
    h3(
      "section",
      { className: "cpwb-knowledge-core-section" },
      h3("div", { className: "cpwb-knowledge-core-label" }, h3("span", null, "\u5F53\u524D\u77E5\u8BC6\u4E0A\u4E0B\u6587"), h3("b", null, `${overview.chunkCount.toLocaleString("en-US")} CHUNKS`)),
      h3("div", { className: "cpwb-knowledge-activity" }, activity.length ? activity.map((row, index) => h3("div", { key: row.action + index }, h3("time", null, formatClock(row.at, timezone)), h3("span", null, row.label), h3("b", null, row.action))) : h3("p", null, "\u6682\u65E0\u7D22\u5F15\u6216\u4F1A\u8BDD\u6D3B\u52A8"))
    ),
    h3(
      "section",
      { className: "cpwb-knowledge-core-section cpwb-knowledge-core-actions" },
      h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary cpwb-kb-core-action", onClick: onChat }, "\u4F7F\u7528\u6B64\u82AF\u7247\u65B0\u5EFA\u4F1A\u8BDD"),
      h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost cpwb-kb-core-action", onClick: onDetail }, "\u6253\u5F00\u6A21\u5757\u8BE6\u60C5")
    )
  );
}
function KnowledgeBoard({ knowledgeBases, pinnedId, previewId, onPin, onPreview, onPreviewEnd, onCreate, onChat, onDetail, onLink, timezone }) {
  const activeId = activeKnowledgeBaseId({ previewId, pinnedId });
  const active = knowledgeBases.find((item) => item.id === activeId) || null;
  const boardRef = import_react32.default.useRef(null);
  const panelRef = import_react32.default.useRef(null);
  const cardRefs = import_react32.default.useRef(/* @__PURE__ */ new Map());
  const link = useKnowledgeBackplaneLink({ activeId, boardRef, panelRef, cardRefs, cardCount: knowledgeBases.length });
  if (knowledgeBases.length === 0) {
    return h3(
      "section",
      { className: "cpwb-knowledge-empty-board" },
      h3("i", { className: "cpwb-knowledge-die", "aria-hidden": true }),
      h3("span", { className: "cpwb-knowledge-eyebrow" }, "NO INTELLIGENCE MODULES"),
      h3("h2", null, "\u5C1A\u672A\u63A5\u5165\u77E5\u8BC6\u82AF\u7247"),
      h3("p", null, "\u521B\u5EFA\u77E5\u8BC6\u5E93\u5E76\u4E0A\u4F20\u6587\u4EF6\uFF0CWorkbench \u4F1A\u5728\u672C\u5730\u5411\u91CF\u8282\u70B9\u5B8C\u6210\u89E3\u6790\u4E0E\u7D22\u5F15\u3002"),
      h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary", onClick: onCreate }, h3(n13, { size: 16 }), "\u521D\u59CB\u5316\u7B2C\u4E00\u4E2A\u82AF\u7247")
    );
  }
  return h3(
    "div",
    { ref: boardRef, className: "cpwb-knowledge-board" },
    link ? h3(
      "svg",
      { className: "cpwb-knowledge-link" + (previewId != null ? " cpwb-previewing" : ""), viewBox: link.viewBox, "aria-hidden": true },
      h3("path", { className: "cpwb-knowledge-link-path", d: link.path }),
      h3("circle", { className: "cpwb-knowledge-link-origin", cx: link.origin.x, cy: link.origin.y, r: 3 }),
      h3("circle", { cx: link.target.x, cy: link.target.y, r: 3 })
    ) : null,
    h3(
      "section",
      { className: "cpwb-knowledge-chip-area" },
      h3(
        "div",
        { className: "cpwb-knowledge-chip-area-title" },
        h3("span", null, "\u53EF\u7528\u6A21\u5757 ", h3("b", null, twoDigits(knowledgeBases.length))),
        h3("span", null, "\u672C\u5730\u5411\u91CF\u8282\u70B9 ", h3("b", null, "READY"))
      ),
      knowledgeBases.map((knowledgeBase) => h3(KnowledgeChip, {
        key: knowledgeBase.id,
        knowledgeBase,
        selected: knowledgeBase.id === pinnedId,
        preview: knowledgeBase.id === previewId && knowledgeBase.id !== pinnedId,
        onPin: () => onPin(knowledgeBase.id),
        onPreview: () => onPreview(knowledgeBase.id),
        onPreviewEnd: () => onPreviewEnd(knowledgeBase.id),
        cardRef: (element) => {
          if (element) cardRefs.current.set(String(knowledgeBase.id), element);
          else cardRefs.current.delete(String(knowledgeBase.id));
        }
      }))
    ),
    h3(KnowledgeBackplane, {
      knowledgeBase: active,
      previewing: previewId != null,
      panelRef,
      timezone,
      onLink: () => onLink(active.id),
      onChat,
      onDetail: () => onDetail(active.id)
    })
  );
}
function KnowledgeCreate({ settings, files, setFiles, name, setName, description, setDescription, saving, error, onSubmit, onSettings }) {
  const embedding = settings?.embedding || {};
  const removeFile = (index) => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  return h3(
    "form",
    { className: "cpwb-knowledge-create-layout", onSubmit },
    h3(
      "section",
      { className: "cpwb-knowledge-panel cpwb-knowledge-form" },
      h3("label", null, h3("span", null, "\u77E5\u8BC6\u5E93\u540D\u79F0"), h3("input", { value: name, onChange: (event) => setName(event.target.value), required: true, autoFocus: true, placeholder: "\u4F8B\u5982\uFF1A\u4EA7\u54C1\u9700\u6C42\u4E0E\u8BBE\u8BA1" }), h3("small", null, "\u7528\u4E8E\u9879\u76EE\u5173\u8054\u3001\u4F1A\u8BDD\u8303\u56F4\u548C\u5168\u5C40\u68C0\u7D22\u3002")),
      h3("label", null, h3("span", null, "\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09"), h3("textarea", { value: description, onChange: (event) => setDescription(event.target.value), placeholder: "\u8BF4\u660E\u8FD9\u4E2A\u77E5\u8BC6\u6A21\u5757\u5305\u542B\u4EC0\u4E48\u5185\u5BB9" })),
      h3(
        "div",
        { className: "cpwb-knowledge-runtime" },
        h3("span", { className: "cpwb-knowledge-eyebrow" }, "\u5168\u5C40\u5411\u91CF\u8FD0\u884C\u65F6"),
        h3("div", null, h3("i", null, "EM"), h3("span", null, h3("strong", null, embedding.model || "\u672A\u914D\u7F6E\u5411\u91CF\u6A21\u578B"), h3("small", null, `${embedding.provider || "unknown"} / ${embedding.dimensions || "?"} dimensions`)), h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-ghost", onClick: onSettings }, "\u8BBE\u7F6E"))
      )
    ),
    h3(
      "section",
      { className: "cpwb-knowledge-panel cpwb-knowledge-upload-zone" },
      h3(
        "label",
        { className: "cpwb-knowledge-drop" },
        h3("input", { type: "file", multiple: true, accept: ACCEPT, onChange: (event) => {
          setFiles(Array.from(event.target.files || []));
          event.target.value = "";
        } }),
        h3("span", null, h3(n13, { size: 27 })),
        h3("strong", null, "\u5C06\u6587\u4EF6\u63A5\u5165\u77E5\u8BC6\u82AF\u7247"),
        h3("p", null, "\u9009\u62E9\u591A\u4E2A TXT\u3001MD\u3001HTML\u3001DOCX\u3001PPTX\u3001XLSX \u6216\u4EE3\u7801\u6587\u4EF6\uFF1B\u4E5F\u53EF\u4EE5\u5148\u521B\u5EFA\u7A7A\u77E5\u8BC6\u5E93\u3002")
      ),
      h3("div", { className: "cpwb-knowledge-selected-files" }, files.map((file, index) => h3(
        "div",
        { key: file.name + index },
        h3("b", null, fileType({ originalName: file.name })),
        h3("span", null, h3("strong", null, file.name), h3("small", null, `${formatBytes(file.size)} / \u7B49\u5F85\u4E0A\u4F20`)),
        h3("button", { type: "button", onClick: () => removeFile(index), "aria-label": `\u79FB\u9664 ${file.name}` }, h3(n17, { size: 14 }))
      ))),
      error ? h3("p", { className: "cpwb-knowledge-local-error" }, error) : null,
      h3("button", { type: "submit", className: "cpwb-kb-action cpwb-kb-action-primary cpwb-knowledge-create-submit", disabled: saving || !name.trim() }, saving ? "\u521B\u5EFA\u4E2D\u2026" : "\u521B\u5EFA\u77E5\u8BC6\u5E93")
    )
  );
}
function documentProgress(document2) {
  return document2?.status === "ready" ? 100 : 0;
}
function KnowledgeDetail({ knowledgeBase, documents, action, settings, onFileInput, onLink, onDelete, onChat, onReindex, onUnlink }) {
  const overview = overviewOf(knowledgeBase);
  const linkedIds = new Set((knowledgeBase.linkedProjects || []).map((project) => project.id));
  return h3(
    "div",
    { className: "cpwb-knowledge-detail" },
    h3(
      "div",
      { className: "cpwb-knowledge-summary-strip" },
      h3("div", null, h3("span", null, "\u7D22\u5F15\u5B8C\u6210\u5EA6"), h3("b", { className: "cpwb-cyan" }, `${overview.indexPercent}%`)),
      h3("div", null, h3("span", null, "\u539F\u59CB\u6587\u4EF6"), h3("b", null, overview.fileCount)),
      h3("div", null, h3("span", null, "\u5411\u91CF\u5206\u5757"), h3("b", null, overview.chunkCount.toLocaleString("en-US"))),
      h3("div", null, h3("span", null, "\u5173\u8054\u9879\u76EE"), h3("b", null, twoDigits(overview.linkedProjectCount)))
    ),
    h3(
      "div",
      { className: "cpwb-knowledge-detail-grid" },
      h3(
        "section",
        { className: "cpwb-knowledge-panel cpwb-knowledge-files-panel" },
        h3("header", null, h3("h2", null, "\u6587\u4EF6\u4E0E\u5411\u91CF\u7D22\u5F15"), h3("span", null, `${overview.fileCount} FILES / ${knowledgeStateLabel(overview)}`)),
        h3("label", { className: "cpwb-knowledge-compact-upload" }, h3("input", { type: "file", multiple: true, accept: ACCEPT, onChange: onFileInput }), h3(l7, { size: 15 }), "\u9009\u62E9\u6587\u4EF6\u5E76\u4E0A\u4F20"),
        documents.length ? h3("div", { className: "cpwb-knowledge-file-list" }, documents.map((document2) => {
          const meta = statusMeta(document2.status);
          const progress = documentProgress(document2);
          return h3(
            "article",
            { key: document2.id, className: "cpwb-knowledge-file-row" },
            h3("i", null, fileType(document2)),
            h3("span", null, h3("strong", null, document2.originalName), h3("small", null, `${formatBytes(document2.size)}${document2.indexedAt ? " / \u5DF2\u5EFA\u7ACB\u7D22\u5F15" : " / \u7B49\u5F85\u7D22\u5F15"}`)),
            h3("span", { className: "cpwb-knowledge-file-progress" }, h3("span", null, h3("i", { style: { width: `${progress}%` } })), h3("small", null, progress ? `${progress}%` : meta.label)),
            h3("em", { className: "cpwb-status-" + meta.kind }, meta.label),
            h3(
              "span",
              { className: "cpwb-knowledge-file-actions" },
              h3("a", { href: cpwbApi.documents.contentUrl(document2.id), target: "_blank", rel: "noreferrer", title: "\u6253\u5F00\u539F\u59CB\u6587\u4EF6", "aria-label": `\u6253\u5F00\u539F\u59CB\u6587\u4EF6 ${document2.originalName}` }, h3(n, { size: 15 })),
              h3("a", { href: cpwbApi.documents.contentUrl(document2.id, { download: true }), download: document2.originalName, title: "\u4E0B\u8F7D\u539F\u59CB\u6587\u4EF6", "aria-label": `\u4E0B\u8F7D\u539F\u59CB\u6587\u4EF6 ${document2.originalName}` }, h3(l6, { size: 15 })),
              document2.status === "failed" || document2.status === "stale" ? h3("button", { type: "button", onClick: () => onReindex(document2), title: "\u91CD\u65B0\u7D22\u5F15" }, "RETRY") : null,
              h3("button", { type: "button", onClick: () => onUnlink(document2), title: "\u4ECE\u77E5\u8BC6\u5E93\u79FB\u9664", "aria-label": `\u4ECE\u77E5\u8BC6\u5E93\u79FB\u9664 ${document2.originalName}` }, h3(n17, { size: 14 }))
            )
          );
        })) : h3("div", { className: "cpwb-knowledge-detail-empty" }, "\u8BE5\u77E5\u8BC6\u5E93\u6682\u65E0\u6587\u4EF6"),
        action?.type === "upload" ? h3("div", { className: "cpwb-knowledge-upload-progress" }, h3("span", null, `\u4E0A\u4F20\u8FDB\u5EA6 ${action.done || 0} / ${action.total || 0}`), h3("i", null, h3("b", { style: { width: `${action.total ? Math.round((action.done || 0) / action.total * 100) : 0}%` } }))) : null
      ),
      h3(
        "aside",
        { className: "cpwb-knowledge-panel cpwb-knowledge-links-panel" },
        h3("header", null, h3("h2", null, "\u80CC\u677F\u8FDE\u63A5"), h3("span", null, `${twoDigits(linkedIds.size)} PROJECTS`)),
        h3("div", { className: "cpwb-knowledge-link-map" }, (knowledgeBase.linkedProjects || []).length ? knowledgeBase.linkedProjects.map((project, index) => h3("div", { key: project.id }, h3("i", null, `P${index + 1}`), h3("span", null, h3("strong", null, project.name), h3("small", null, `\u9879\u76EE\u4E0A\u4E0B\u6587\u5DF2\u542F\u7528 / ${project.sessionCount || 0} \u4E2A\u4F1A\u8BDD`)))) : h3("p", null, "\u5C1A\u672A\u5173\u8054\u9879\u76EE")),
        h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-core-action", onClick: onLink }, h3(p2, { size: 15 }), "\u7BA1\u7406\u9879\u76EE\u8FDE\u63A5"),
        h3(
          "section",
          { className: "cpwb-knowledge-runtime-detail" },
          h3("div", { className: "cpwb-knowledge-core-label" }, h3("span", null, "\u5411\u91CF\u8FD0\u884C\u65F6"), h3("b", null, "ONLINE")),
          h3("p", null, h3("span", null, "Provider"), h3("strong", null, settings?.embedding?.provider || "unknown")),
          h3("p", null, h3("span", null, "Model"), h3("strong", null, settings?.embedding?.model || "\u672A\u914D\u7F6E")),
          h3("p", null, h3("span", null, "Dimensions"), h3("strong", null, settings?.embedding?.dimensions || "?"))
        ),
        h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-primary cpwb-kb-core-action", onClick: onChat }, "\u65B0\u5EFA\u77E5\u8BC6\u5E93\u4F1A\u8BDD"),
        h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-danger cpwb-kb-core-action", onClick: onDelete }, h3(n15, { size: 15 }), "\u5220\u9664\u77E5\u8BC6\u5E93")
      )
    )
  );
}
function ProjectLinkDialog({ knowledgeBase, projects, busyProjectId = null, error = null, onToggle, onClose }) {
  if (!knowledgeBase) return null;
  const linked = new Set((knowledgeBase.linkedProjects || []).map((project) => project.id));
  return h3(
    GlobalModal,
    { className: "cpwb-knowledge-link-host", onClose, labelledBy: "cpwb-kb-link-title" },
    h3(
      "section",
      { className: "cpwb-modal cpwb-knowledge-link-dialog" },
      h3("div", { className: "cpwb-modal-kicker" }, "BACKPLANE / PROJECT LINKS"),
      h3("h3", { id: "cpwb-kb-link-title" }, `\u7BA1\u7406\u300C${knowledgeBase.name}\u300D\u7684\u9879\u76EE\u8FDE\u63A5`),
      h3("div", { className: "cpwb-knowledge-project-options" }, projects.length ? projects.map((project) => {
        const pending = busyProjectId === project.id;
        return h3(
          "button",
          { type: "button", key: project.id, disabled: busyProjectId != null, "aria-busy": pending ? "true" : void 0, "aria-pressed": linked.has(project.id), onClick: () => onToggle(project, linked.has(project.id)) },
          h3("i", null, pending ? ".." : linked.has(project.id) ? "ON" : "--"),
          h3("span", null, h3("strong", null, project.name), h3("small", null, pending ? "\u6B63\u5728\u540C\u6B65\u9879\u76EE\u4E0A\u4E0B\u6587" : linked.has(project.id) ? "\u5DF2\u63A5\u5165\u77E5\u8BC6\u4E0A\u4E0B\u6587" : "\u5C1A\u672A\u8FDE\u63A5")),
          h3("em", null, pending ? "SYNCING" : linked.has(project.id) ? "UNLINK" : "LINK")
        );
      }) : h3("p", null, "\u6682\u65E0\u53EF\u8FDE\u63A5\u9879\u76EE")),
      error ? h3("p", { className: "cpwb-knowledge-local-error", role: "alert" }, error) : null,
      h3("div", { className: "cpwb-modal-actions" }, h3("button", { type: "button", className: "cpwb-kb-action", onClick: onClose }, "\u5B8C\u6210"))
    )
  );
}
function KnowledgeCenterPage({
  store: store3,
  onDraftOpen,
  initialMode = "board",
  initialKnowledgeBaseId = null
}) {
  const state = import_react32.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const knowledgeBases = Array.isArray(state.knowledgeBases) ? state.knowledgeBases : [];
  const projects = Array.isArray(state.projects) ? state.projects : [];
  const documents = Array.isArray(state.documents) ? state.documents : [];
  const initialId = initialKnowledgeBaseId ?? state.activeKnowledgeBaseId ?? knowledgeBases[0]?.id ?? null;
  const [mode, setMode] = import_react32.default.useState(initialMode);
  const [pinnedId, setPinnedId] = import_react32.default.useState(initialId);
  const [previewId, setPreviewId] = import_react32.default.useState(null);
  const [createName, setCreateName] = import_react32.default.useState("");
  const [createDescription, setCreateDescription] = import_react32.default.useState("");
  const [createFiles, setCreateFiles] = import_react32.default.useState([]);
  const [saving, setSaving] = import_react32.default.useState(false);
  const [localError, setLocalError] = import_react32.default.useState(null);
  const [linkingProjectId, setLinkingProjectId] = import_react32.default.useState(null);
  const [linkError, setLinkError] = import_react32.default.useState(null);
  const [showLinks, setShowLinks] = import_react32.default.useState(false);
  const [deleteTarget, setDeleteTarget] = import_react32.default.useState(null);
  const selected = knowledgeBases.find((item) => item.id === pinnedId) || null;
  const timezone = state.settings?.timezone || "Asia/Shanghai";
  import_react32.default.useEffect(function() {
    if (knowledgeBases.length === 0) {
      setPinnedId(null);
      setPreviewId(null);
      return;
    }
    if (!knowledgeBases.some((item) => item.id === pinnedId)) setPinnedId(knowledgeBases[0].id);
  }, [knowledgeBases, pinnedId]);
  import_react32.default.useEffect(function() {
    if (mode !== "detail" || pinnedId == null) return;
    store3.actions.selectKnowledgeBase(pinnedId).catch(() => {
    });
  }, [mode, pinnedId, store3]);
  import_react32.default.useEffect(function() {
    if (mode !== "detail" || !needsDocumentPolling(documents, pinnedId)) return;
    const timer = setTimeout(() => store3.actions.refreshDocuments().catch(() => {
    }), 1500);
    return () => clearTimeout(timer);
  }, [documents, mode, pinnedId, store3]);
  const openSettings = function() {
    if (typeof document === "undefined") return;
    document.querySelector('[data-slot="sidebar.settings"] > button')?.click?.();
  };
  const pin = function(id) {
    setPinnedId(id);
    setPreviewId(null);
    store3.actions.selectKnowledgeBase(id).catch(() => {
    });
  };
  const openDetail = function(id = pinnedId) {
    if (id == null) return;
    setPinnedId(id);
    setPreviewId(null);
    store3.actions.selectKnowledgeBase(id).catch(() => {
    });
    setMode("detail");
  };
  const openProjectLinks = function(id = pinnedId) {
    if (id == null) return;
    setPinnedId(id);
    setPreviewId(null);
    store3.actions.selectKnowledgeBase(id).catch(() => {
    });
    setLinkError(null);
    setShowLinks(true);
  };
  const openChat = function() {
    const id = activeKnowledgeBaseId({ previewId, pinnedId });
    if (id == null || saving) return;
    setLocalError(null);
    try {
      startKnowledgeChatDraft({ store: store3, knowledgeBaseId: id, onDraftOpen });
    } catch (error) {
      setLocalError(error?.message || "\u6253\u5F00\u77E5\u8BC6\u5E93\u4F1A\u8BDD\u5931\u8D25");
    }
  };
  const createKnowledgeBase = async function(event) {
    event.preventDefault();
    const name = createName.trim();
    if (!name || saving) return;
    setSaving(true);
    setLocalError(null);
    try {
      const created = await store3.actions.createKnowledgeBase({ name, description: createDescription.trim() || void 0 });
      setPinnedId(created.id);
      await store3.actions.selectKnowledgeBase(created.id);
      setMode("detail");
      if (createFiles.length) await store3.actions.uploadFiles({ files: createFiles, scope: "knowledgeBase", scopeId: created.id });
      await store3.actions.refresh();
      await store3.actions.selectKnowledgeBase(created.id);
      setCreateFiles([]);
    } catch (error) {
      setLocalError(error?.message || "\u521B\u5EFA\u77E5\u8BC6\u5E93\u5931\u8D25");
    } finally {
      setSaving(false);
    }
  };
  const uploadFiles = function(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length || pinnedId == null) return;
    store3.actions.uploadFiles({ files, scope: "knowledgeBase", scopeId: pinnedId }).then(() => store3.actions.refresh()).then(() => store3.actions.selectKnowledgeBase(pinnedId)).catch(() => {
    });
  };
  const toggleProject = async function(project, isLinked) {
    if (!selected || linkingProjectId != null) return;
    setLinkingProjectId(project.id);
    setLinkError(null);
    try {
      if (isLinked) await store3.actions.unlinkProjectKnowledgeBase(project.id, selected.id);
      else await store3.actions.linkProjectKnowledgeBase(project.id, selected.id);
    } catch (error) {
      setLinkError(error?.message || "\u9879\u76EE\u8FDE\u63A5\u66F4\u65B0\u5931\u8D25");
    } finally {
      setLinkingProjectId(null);
    }
  };
  const deleteKnowledgeBase = async function() {
    if (!deleteTarget || saving) return;
    setSaving(true);
    try {
      await store3.actions.deleteKnowledgeBase(deleteTarget.id);
      setDeleteTarget(null);
      setMode("board");
      setPinnedId(null);
    } finally {
      setSaving(false);
    }
  };
  return h3(
    "main",
    { className: `cpwb-knowledge-center cpwb-workbench-page cpwb-knowledge-mode-${mode}`, "data-page": "knowledge" },
    h3(KnowledgeHeader, {
      mode,
      knowledgeBase: selected,
      onBack: () => setMode("board"),
      onCreate: () => {
        setMode("create");
        setLocalError(null);
      },
      onSettings: openSettings,
      onUpload: () => document.querySelector("#cpwb-kb-detail-upload")?.click?.(),
      onChat: openChat
    }),
    localError ? h3("div", { className: "cpwb-knowledge-local-error cpwb-knowledge-page-error" }, localError) : null,
    mode === "board" ? h3(KnowledgeBoard, {
      knowledgeBases,
      pinnedId,
      previewId,
      onPin: pin,
      onPreview: setPreviewId,
      onPreviewEnd: (id) => setPreviewId((current) => nextKnowledgePreviewAfterLeave(current, id)),
      onCreate: () => setMode("create"),
      onChat: openChat,
      onDetail: openDetail,
      onLink: openProjectLinks,
      timezone
    }) : null,
    mode === "create" ? h3(KnowledgeCreate, {
      settings: state.settings,
      files: createFiles,
      setFiles: setCreateFiles,
      name: createName,
      setName: setCreateName,
      description: createDescription,
      setDescription: setCreateDescription,
      saving,
      error: localError,
      onSubmit: createKnowledgeBase,
      onSettings: openSettings
    }) : null,
    mode === "detail" && selected ? h3(
      import_react32.default.Fragment,
      null,
      h3("input", { id: "cpwb-kb-detail-upload", type: "file", multiple: true, accept: ACCEPT, hidden: true, onChange: uploadFiles }),
      h3(KnowledgeDetail, {
        knowledgeBase: selected,
        documents,
        action: state.action,
        settings: state.settings,
        onFileInput: uploadFiles,
        onLink: openProjectLinks,
        onDelete: () => setDeleteTarget(selected),
        onChat: openChat,
        onReindex: (document2) => store3.actions.reindexDocument(document2.id).catch(() => {
        }),
        onUnlink: (document2) => store3.actions.unlinkDocument({ id: document2.id, scope: "knowledgeBase", scopeId: selected.id }).then(() => store3.actions.refresh()).then(() => store3.actions.selectKnowledgeBase(selected.id)).catch(() => {
        })
      })
    ) : null,
    showLinks ? h3(ProjectLinkDialog, { knowledgeBase: selected, projects, busyProjectId: linkingProjectId, error: linkError, onToggle: toggleProject, onClose: () => setShowLinks(false) }) : null,
    deleteTarget ? h3(
      "div",
      { className: "cpwb-modal-backdrop", onMouseDown: (event) => {
        if (event.target === event.currentTarget) setDeleteTarget(null);
      } },
      h3(
        "section",
        { className: "cpwb-modal cpwb-danger-modal", role: "dialog", "aria-modal": true, "aria-labelledby": "cpwb-delete-kb-center-title" },
        h3("div", { className: "cpwb-modal-kicker" }, "KNOWLEDGE / DELETE"),
        h3("h3", { id: "cpwb-delete-kb-center-title" }, `\u5220\u9664\u300C${deleteTarget.name}\u300D\uFF1F`),
        h3("p", null, "\u77E5\u8BC6\u5E93\u3001\u4F1A\u8BDD\u548C\u4EC5\u5C5E\u4E8E\u5B83\u7684\u6587\u6863\u4E0E\u5411\u91CF\u5C06\u6C38\u4E45\u5220\u9664\uFF1B\u5171\u4EAB\u6587\u6863\u4F1A\u4FDD\u7559\u3002"),
        h3(
          "div",
          { className: "cpwb-modal-actions" },
          h3("button", { type: "button", className: "cpwb-kb-action", onClick: () => setDeleteTarget(null) }, "\u53D6\u6D88"),
          h3("button", { type: "button", className: "cpwb-kb-action cpwb-kb-action-danger", disabled: saving, onClick: deleteKnowledgeBase }, h3(n15, { size: 14 }), saving ? "\u5220\u9664\u4E2D\u2026" : "\u6C38\u4E45\u5220\u9664")
        )
      )
    ) : null
  );
}

// src/client/SessionListPage.js
var import_react34 = __toESM(require("react"), 1);
function scopeLabel2(row) {
  if (row.contextName) return row.contextName;
  if (row.scope?.kind === "project") return "\u9879\u76EE";
  if (row.scope?.kind === "knowledge_base") return "\u77E5\u8BC6\u5E93";
  return "\u72EC\u7ACB";
}
function activityLabel(value) {
  if (!value) return "\u5C1A\u672A\u5F00\u59CB";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function SessionListPage({ archived = false, embedded = false, store: store3, onOpenSession, initialScope = null }) {
  const state = import_react34.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const [query, setQuery] = import_react34.default.useState("");
  const [appliedQuery, setAppliedQuery] = import_react34.default.useState("");
  const [context, setContext] = import_react34.default.useState("");
  const page = state.sessionPage ?? { items: [], total: 0, limit: 20, offset: 0 };
  const lockedScope = initialScope?.kind === "project" || initialScope?.kind === "knowledge_base" ? initialScope : null;
  const scopeKind = lockedScope?.kind ?? (context || null);
  const scopeId = lockedScope?.id ?? null;
  const load = import_react34.default.useCallback((offset = 0) => store3.actions.loadAllSessions({
    query: appliedQuery,
    scopeKind,
    scopeId,
    archived,
    offset,
    limit: page.limit || 20
  }), [appliedQuery, archived, page.limit, scopeId, scopeKind, store3]);
  import_react34.default.useEffect(function() {
    load(0).catch(function() {
    });
  }, [load]);
  const mutate = async function(row) {
    if (archived) await store3.actions.restoreSession(row.sessionId);
    else await store3.actions.archiveSession(row.sessionId);
    await load(0).catch(function() {
    });
  };
  const header = embedded ? import_react34.default.createElement(
    "header",
    { className: "cpwb-settings-archive-header" },
    import_react34.default.createElement(
      "div",
      null,
      import_react34.default.createElement("span", { className: "cpwb-eyebrow" }, "SESSION STORAGE / ARCHIVE"),
      import_react34.default.createElement("h2", null, "\u5F52\u6863\u4F1A\u8BDD"),
      import_react34.default.createElement("p", null, "\u68C0\u7D22\u5DF2\u5F52\u6863\u8BB0\u5F55\uFF0C\u6253\u5F00\u67E5\u770B\u6216\u6062\u590D\u5230\u6700\u8FD1\u4F1A\u8BDD\u3002")
    ),
    import_react34.default.createElement("strong", { "aria-label": page.total + " \u6761\u5F52\u6863\u4F1A\u8BDD" }, String(page.total).padStart(2, "0"))
  ) : import_react34.default.createElement(
    "header",
    { className: "cpwb-page-header" },
    import_react34.default.createElement(
      "div",
      { className: "cpwb-page-header-main" },
      import_react34.default.createElement("span", null, archived ? "04 / ARCHIVE" : "03 / CONVERSATIONS"),
      import_react34.default.createElement("h1", null, archived ? "\u5F52\u6863\u4F1A\u8BDD" : "\u5168\u90E8\u4F1A\u8BDD"),
      import_react34.default.createElement("p", null, archived ? "\u5DF2\u5F52\u6863\u8BB0\u5F55\u4ECD\u53EF\u67E5\u770B\uFF0C\u5E76\u53EF\u968F\u65F6\u6062\u590D\u5230\u6700\u8FD1\u4F1A\u8BDD\u3002" : "\u9879\u76EE\u3001\u77E5\u8BC6\u5E93\u4E0E\u72EC\u7ACB\u4F1A\u8BDD\u7EDF\u4E00\u7BA1\u7406\u3002")
    ),
    import_react34.default.createElement("div", { className: "cpwb-page-header-stat" }, import_react34.default.createElement("strong", null, page.total), import_react34.default.createElement("span", null, "\u6761\u4F1A\u8BDD"))
  );
  return import_react34.default.createElement(
    "main",
    {
      className: "cpwb-session-list-page" + (embedded ? " cpwb-settings-archive" : " cpwb-workbench-page"),
      "data-page": archived ? "archive" : "sessions"
    },
    header,
    lockedScope ? import_react34.default.createElement(
      "div",
      { className: "cpwb-session-scope-banner" },
      import_react34.default.createElement("span", null, lockedScope.kind === "project" ? "PROJECT SCOPE" : "KNOWLEDGE SCOPE"),
      import_react34.default.createElement("strong", null, lockedScope.name || (lockedScope.kind === "project" ? "\u5F53\u524D\u9879\u76EE" : "\u5F53\u524D\u77E5\u8BC6\u5E93")),
      import_react34.default.createElement("small", null, "\u4EC5\u663E\u793A\u8BE5" + (lockedScope.kind === "project" ? "\u9879\u76EE" : "\u77E5\u8BC6\u5E93") + "\u4F1A\u8BDD")
    ) : null,
    import_react34.default.createElement(
      "form",
      { className: "cpwb-session-filters" + (lockedScope ? " cpwb-session-filters-locked" : ""), onSubmit: function(event) {
        event.preventDefault();
        setAppliedQuery(query.trim());
      } },
      import_react34.default.createElement(
        "label",
        null,
        import_react34.default.createElement(f, { size: 18, weight: "regular", "aria-hidden": true }),
        import_react34.default.createElement("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: archived ? "\u641C\u7D22\u5F52\u6863\u4F1A\u8BDD\u6216\u6765\u6E90" : "\u641C\u7D22\u4F1A\u8BDD\u6216\u6765\u6E90", "aria-label": archived ? "\u641C\u7D22\u5F52\u6863\u4F1A\u8BDD" : "\u641C\u7D22\u4F1A\u8BDD" })
      ),
      lockedScope ? null : import_react34.default.createElement(CyberSelect, {
        value: context,
        onChange: setContext,
        ariaLabel: "\u4F1A\u8BDD\u7C7B\u578B",
        options: [
          { value: "", label: "\u5168\u90E8\u7C7B\u578B" },
          { value: "project", label: "\u9879\u76EE" },
          { value: "knowledge_base", label: "\u77E5\u8BC6\u5E93" },
          { value: "independent", label: "\u72EC\u7ACB" }
        ]
      }),
      import_react34.default.createElement("button", { type: "submit" }, archived ? "\u641C\u7D22" : "\u68C0\u7D22")
    ),
    state.action?.status === "error" ? import_react34.default.createElement("div", { className: "cpwb-page-error", role: "alert" }, state.action.error?.message || "\u4F1A\u8BDD\u52A0\u8F7D\u5931\u8D25") : null,
    page.items.length === 0 ? import_react34.default.createElement("div", { className: "cpwb-session-list-empty" }, import_react34.default.createElement(s6, { size: 28, weight: "regular" }), import_react34.default.createElement("span", null, "\u6682\u65E0\u5339\u914D\u4F1A\u8BDD")) : import_react34.default.createElement("div", { className: "cpwb-session-list" }, page.items.map((row) => import_react34.default.createElement(
      "article",
      {
        key: row.sessionId,
        className: "cpwb-session-list-row" + (archived ? " cpwb-session-list-row-archived" : "")
      },
      import_react34.default.createElement(
        "button",
        { type: "button", className: "cpwb-session-list-open", disabled: typeof onOpenSession !== "function", onClick: () => onOpenSession?.(row.sessionId) },
        import_react34.default.createElement(s6, { size: 20, weight: "regular", "aria-hidden": true }),
        import_react34.default.createElement(
          "span",
          null,
          import_react34.default.createElement("strong", null, row.title || row.displayTitle || row.contextName || "\u672A\u547D\u540D\u4F1A\u8BDD"),
          import_react34.default.createElement("small", null, scopeLabel2(row))
        ),
        import_react34.default.createElement("time", null, archived ? "\u5F52\u6863\u4E8E " + activityLabel(row.archivedAt) : activityLabel(row.updatedAt))
      ),
      import_react34.default.createElement("button", {
        type: "button",
        className: "cpwb-session-list-action",
        disabled: state.action?.status === "loading",
        onClick: () => mutate(row).catch(function() {
        }),
        "aria-label": (archived ? "\u6062\u590D\u4F1A\u8BDD " : "\u5F52\u6863\u4F1A\u8BDD ") + (row.title || "\u672A\u547D\u540D\u4F1A\u8BDD"),
        title: archived ? "\u6062\u590D\u4F1A\u8BDD" : "\u5F52\u6863\u4F1A\u8BDD"
      }, archived ? import_react34.default.createElement(i, { size: 18, weight: "regular", "aria-hidden": true }) : import_react34.default.createElement(s, { size: 18, weight: "regular", "aria-hidden": true }))
    ))),
    import_react34.default.createElement(
      "footer",
      { className: "cpwb-session-pagination" },
      import_react34.default.createElement("span", null, "\u5171 " + page.total + " \u6761"),
      import_react34.default.createElement(
        "div",
        null,
        import_react34.default.createElement("button", { type: "button", disabled: page.offset <= 0, onClick: () => load(Math.max(0, page.offset - page.limit)).catch(function() {
        }) }, "\u4E0A\u4E00\u9875"),
        import_react34.default.createElement("button", { type: "button", disabled: page.offset + page.limit >= page.total, onClick: () => load(page.offset + page.limit).catch(function() {
        }) }, "\u4E0B\u4E00\u9875")
      )
    )
  );
}

// src/client/SkillsPage.js
var import_react36 = __toESM(require("react"), 1);
var h4 = import_react36.default.createElement;
function SkillsPage({ store: store3 }) {
  const state = import_react36.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const projects = Array.isArray(state.projects) ? state.projects : [];
  const [scope, setScope] = import_react36.default.useState("global");
  const [projectId, setProjectId] = import_react36.default.useState(projects[0]?.id ?? null);
  import_react36.default.useEffect(() => {
    if (scope === "project" && projectId == null && projects[0]) setProjectId(projects[0].id);
  }, [scope, projectId, projects]);
  return h4(
    "main",
    { className: "cpwb-skills-page" },
    h4(
      "div",
      { className: "cpwb-skills-layout" },
      h4("header", { className: "cpwb-skills-header" }, h4("div", { className: "cpwb-skills-title" }, h4(s13, { size: 19, "aria-hidden": true }), h4("div", null, h4("span", null, "SKILL MATRIX"), h4("h1", null, "Skills ", h4("span", { className: "cpwb-skills-title-alias" }, "\u6280\u80FD\u77E9\u9635")), h4("p", null, "\u4E3A Workbench \u88C5\u8F7D\u53EF\u590D\u7528\u80FD\u529B\uFF0C\u5728\u5168\u5C40\u6216\u5F53\u524D\u9879\u76EE\u751F\u6548\u3002"))), h4("span", { className: "cpwb-skills-count" }, String(skillCatalogCount(state, scope, projectId)).padStart(2, "0"))),
      h4(
        "div",
        { className: "cpwb-skills-tabs", role: "tablist", "aria-label": "Skill \u4F5C\u7528\u57DF" },
        h4("button", { type: "button", role: "tab", "aria-selected": scope === "global", className: scope === "global" ? "cpwb-active" : "", onClick: () => setScope("global") }, "\u5168\u5C40"),
        h4("button", { type: "button", role: "tab", "aria-selected": scope === "project", className: scope === "project" ? "cpwb-active" : "", onClick: () => setScope("project") }, "\u9879\u76EE")
      ),
      scope === "project" ? h4("label", { className: "cpwb-skills-project-select" }, h4("span", null, "\u9009\u62E9\u9879\u76EE"), h4("select", { value: projectId ?? "", onChange: (event) => setProjectId(Number(event.target.value) || null), "aria-label": "\u9009\u62E9 Skill \u6240\u5C5E\u9879\u76EE" }, projects.length ? projects.map((project) => h4("option", { key: project.id, value: project.id }, project.name)) : h4("option", { value: "" }, "\u6682\u65E0\u9879\u76EE"))) : null,
      h4(SkillScopeManager, { key: skillScopeKey(scope, projectId), store: store3, scope, projectId })
    )
  );
}

// src/client/NewSessionDialog.js
var import_react38 = __toESM(require("react"), 1);

// src/client/pendingSession.js
function valueOf2(response, label) {
  const result = response?.result;
  if (result?.ok) return result.value;
  const error = new Error(result?.error?.message || label + " failed");
  error.code = result?.error?.code;
  error.details = result?.error?.details;
  throw error;
}
async function loadPendingModelCatalog(connection) {
  if (typeof connection?.api?.llm?.models !== "function") return { groups: [], failures: [] };
  const response = await connection.api.llm.models({});
  return valueOf2(response, "\u8BFB\u53D6\u6A21\u578B\u76EE\u5F55");
}
async function applyModelSelection(connection, sessionId, selection) {
  if (!selection) return null;
  if (typeof connection?.api?.sessions?.selectModel !== "function") {
    throw new Error("DSH \u6A21\u578B\u9009\u62E9\u670D\u52A1\u4E0D\u53EF\u7528");
  }
  const response = await connection.api.sessions.selectModel({
    sessionId,
    provider: selection.provider,
    model: selection.model,
    ...selection.reasoningEffort ? { reasoningEffort: selection.reasoningEffort } : {}
  });
  return valueOf2(response, "\u5207\u6362\u6A21\u578B");
}
async function submitPendingDraft({
  store: store3,
  sessions,
  workspaces,
  connection,
  conversation,
  text,
  imageIds = [],
  modelSelection = null,
  waitForReady = openWorkbenchSession
}) {
  const existing = store3.getSnapshot().draft;
  if (existing?.status === "admitted") {
    try {
      return await store3.actions.confirmDraft();
    } catch (error) {
      store3.actions.markDraftError?.(error);
      throw error;
    }
  }
  try {
    const pending = await store3.actions.materializeDraft({ text });
    const sessionId = pending.sessionId;
    await waitForReady(sessions, sessionId, { workspaces });
    await applyModelSelection(connection, sessionId, modelSelection);
    const session = sessions?.binding?.(sessionId)?.session;
    if (!session) throw new Error("DSH \u4F1A\u8BDD\u5C1A\u672A\u5C31\u7EEA");
    if (typeof conversation?.sendSession !== "function") throw new Error("DSH \u539F\u751F\u4F1A\u8BDD\u8F93\u5165\u670D\u52A1\u4E0D\u53EF\u7528");
    const outcome = await conversation.sendSession(session, text.trim(), imageIds, "queue");
    if (outcome?.kind !== "success") throw new Error("DSH \u672A\u63A5\u53D7\u9996\u6761\u6D88\u606F");
    store3.actions.markDraftAdmitted();
    return await store3.actions.confirmDraft();
  } catch (error) {
    store3.actions.markDraftError?.(error);
    throw error;
  }
}

// src/client/NewSessionDialog.js
var OWNER_TYPES = [
  ["project", "\u9879\u76EE", m5],
  ["knowledge_base", "\u77E5\u8BC6\u5E93", n2],
  ["independent", "\u72EC\u7ACB\u4F1A\u8BDD", m10]
];
function normalizedInitialScope(scope) {
  if (scope?.kind === "project" || scope?.kind === "knowledge_base") return { kind: scope.kind, id: scope.id };
  return { kind: "independent", id: null };
}
function sourcePreview(scope, state) {
  if (scope.kind === "project") {
    const project = state.projects?.find((item) => item.id === scope.id);
    return [project?.path ? "Workspace \u6587\u4EF6" : "\u9879\u76EE Workspace", "\u9879\u76EE\u5173\u8054\u7684\u5168\u90E8\u77E5\u8BC6\u5E93"];
  }
  if (scope.kind === "knowledge_base") {
    const kb = state.knowledgeBases?.find((item) => item.id === scope.id);
    return ["\u77E5\u8BC6\u5E93\u6587\u6863 \xB7 " + (kb?.name || "\u5F53\u524D\u77E5\u8BC6\u5E93")];
  }
  return ["\u9ED8\u8BA4\u4E0D\u7EE7\u627F\u4E0A\u4E0B\u6587\uFF1B\u9996\u6B21\u53D1\u9001\u540E\u53EF\u4F7F\u7528 @ \u6DFB\u52A0"];
}
function NewSessionDialog({ open, store: store3, initialScope, onClose, onStart }) {
  const state = import_react38.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const normalized = normalizedInitialScope(initialScope);
  const [kind, setKind] = import_react38.default.useState(normalized.kind);
  const [ownerId, setOwnerId] = import_react38.default.useState(normalized.id == null ? "" : String(normalized.id));
  import_react38.default.useEffect(function() {
    if (!open) return;
    const next = normalizedInitialScope(initialScope);
    setKind(next.kind);
    setOwnerId(next.id == null ? "" : String(next.id));
  }, [open, initialScope?.kind, initialScope?.id]);
  if (!open) return null;
  const owners = kind === "project" ? state.projects || [] : kind === "knowledge_base" ? state.knowledgeBases || [] : [];
  const selectedId = kind === "independent" ? null : Number(ownerId || owners[0]?.id);
  const scope = { kind, id: kind === "independent" ? null : selectedId };
  const valid = kind === "independent" || Number.isSafeInteger(selectedId) && selectedId > 0;
  const start = function(event) {
    event.preventDefault();
    if (!valid) return;
    onStart?.({ scope, pinnedSources: [] });
  };
  return import_react38.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-new-session-title", className: "cpwb-new-session-host" },
    import_react38.default.createElement(
      "form",
      { className: "cpwb-new-session-dialog", onSubmit: start },
      import_react38.default.createElement(
        "header",
        null,
        import_react38.default.createElement("span", null, "SESSION / INITIALIZE"),
        import_react38.default.createElement("h2", { id: "cpwb-new-session-title" }, "\u65B0\u5EFA\u4F1A\u8BDD"),
        import_react38.default.createElement("p", null, "\u9009\u62E9\u552F\u4E00\u5F52\u5C5E\u3002\u7B2C\u4E00\u6761\u6709\u6548\u6D88\u606F\u53D1\u9001\u524D\u4E0D\u4F1A\u521B\u5EFA DSH Session\u3002")
      ),
      import_react38.default.createElement(
        "fieldset",
        { className: "cpwb-owner-options" },
        import_react38.default.createElement("legend", null, "\u4F1A\u8BDD\u5F52\u5C5E"),
        OWNER_TYPES.map(([value, label, Icon2]) => import_react38.default.createElement(
          "label",
          {
            key: value,
            className: kind === value ? "cpwb-active" : ""
          },
          import_react38.default.createElement("input", {
            type: "radio",
            name: "session-owner",
            value,
            checked: kind === value,
            onChange: function() {
              setKind(value);
              const list = value === "project" ? state.projects : value === "knowledge_base" ? state.knowledgeBases : [];
              setOwnerId(value === "independent" ? "" : String(list?.[0]?.id ?? ""));
            }
          }),
          import_react38.default.createElement(Icon2, { size: 20, weight: "duotone", "aria-hidden": true }),
          import_react38.default.createElement("span", null, label)
        ))
      ),
      kind !== "independent" ? import_react38.default.createElement(
        "label",
        { className: "cpwb-owner-select" },
        import_react38.default.createElement("span", null, kind === "project" ? "\u9009\u62E9\u9879\u76EE" : "\u9009\u62E9\u77E5\u8BC6\u5E93"),
        import_react38.default.createElement(CyberSelect, {
          value: ownerId || String(owners[0]?.id ?? ""),
          onChange: setOwnerId,
          ariaLabel: kind === "project" ? "\u9009\u62E9\u9879\u76EE" : "\u9009\u62E9\u77E5\u8BC6\u5E93",
          placeholder: kind === "project" ? "\u8BF7\u9009\u62E9\u9879\u76EE" : "\u8BF7\u9009\u62E9\u77E5\u8BC6\u5E93",
          options: owners.map((item) => ({ value: String(item.id), label: item.name }))
        })
      ) : null,
      import_react38.default.createElement(
        "section",
        { className: "cpwb-context-preview", "aria-label": "\u9ED8\u8BA4\u4E0A\u4E0B\u6587" },
        import_react38.default.createElement("div", null, import_react38.default.createElement(s13, { size: 18, "aria-hidden": true }), import_react38.default.createElement("strong", null, "\u9ED8\u8BA4\u4E0A\u4E0B\u6587")),
        import_react38.default.createElement("ul", null, sourcePreview(scope, state).map((text) => import_react38.default.createElement("li", { key: text }, text)))
      ),
      import_react38.default.createElement(
        "footer",
        null,
        import_react38.default.createElement("button", { type: "button", className: "cpwb-button-ghost", onClick: onClose }, "\u53D6\u6D88"),
        import_react38.default.createElement(
          "button",
          { type: "submit", className: "cpwb-button-primary", disabled: !valid },
          "\u8FDB\u5165\u65B0\u4F1A\u8BDD",
          import_react38.default.createElement(s3, { size: 17, "aria-hidden": true })
        )
      )
    )
  );
}
function modelOption(groups, selection) {
  for (const group of groups) {
    const model = group.models?.find((item) => item.id === selection?.model);
    if (model && group.id === selection?.provider) return { group, model };
  }
  return null;
}
function pendingScopeName(draft, state) {
  if (draft.scope.kind === "project") return state.projects?.find((item) => item.id === draft.scope.id)?.name || "\u9879\u76EE\u5DE5\u4F5C\u53F0";
  if (draft.scope.kind === "knowledge_base") return state.knowledgeBases?.find((item) => item.id === draft.scope.id)?.name || "\u77E5\u8BC6\u5E93";
  return "\u72EC\u7ACB\u4F1A\u8BDD";
}
function watchPendingModelDismiss(documentObject, root, onDismiss) {
  const dismiss = function(event) {
    if (root?.contains?.(event.target)) return;
    onDismiss();
  };
  documentObject.addEventListener("pointerdown", dismiss);
  return function() {
    documentObject.removeEventListener("pointerdown", dismiss);
  };
}
function DraftConversation({ store: store3, sessions, workspaces, connection, conversation, onActivated, onCancel }) {
  const state = import_react38.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const draft = state.draft;
  const [text, setText] = import_react38.default.useState(draft?.text || "");
  const [catalog, setCatalog] = import_react38.default.useState({ groups: [], failures: [] });
  const [selection, setSelection] = import_react38.default.useState(null);
  const [modelOpen, setModelOpen] = import_react38.default.useState(false);
  const [attachments, setAttachments] = import_react38.default.useState([]);
  const [submitting, setSubmitting] = import_react38.default.useState(false);
  const [localError, setLocalError] = import_react38.default.useState(null);
  const fileInput = import_react38.default.useRef(null);
  const modelRoot = import_react38.default.useRef(null);
  import_react38.default.useEffect(function() {
    setText(draft?.text || "");
  }, [draft?.sessionId, draft?.status]);
  import_react38.default.useEffect(function() {
    let active = true;
    loadPendingModelCatalog(connection).then((value) => {
      if (active) setCatalog(value);
    }).catch((error) => {
      if (active) setLocalError(error.message);
    });
    return function() {
      active = false;
    };
  }, [connection]);
  import_react38.default.useEffect(function() {
    if (!modelOpen || typeof document === "undefined") return void 0;
    return watchPendingModelDismiss(document, modelRoot.current, () => setModelOpen(false));
  }, [modelOpen]);
  if (!draft) return null;
  const busy = submitting || draft.status === "materializing";
  const chosen = modelOption(catalog.groups || [], selection);
  const modelLabel = chosen ? chosen.model.name + (selection.reasoningEffort ? " \xB7 " + (chosen.model.reasoning?.efforts?.find((item) => item.id === selection.reasoningEffort)?.name || selection.reasoningEffort) : "") : "DSH \u9ED8\u8BA4 \xB7 \u81EA\u52A8";
  const submit = async function(event) {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setSubmitting(true);
    setLocalError(null);
    try {
      const result = await submitPendingDraft({
        store: store3,
        sessions,
        workspaces,
        connection,
        conversation,
        text,
        imageIds: attachments.map((item) => item.id),
        modelSelection: selection
      });
      await onActivated?.(result);
    } catch (error) {
      setLocalError(error.message || "\u9996\u6761\u6D88\u606F\u53D1\u9001\u5931\u8D25");
    } finally {
      setSubmitting(false);
    }
  };
  const scopeLabel3 = draft.scope.kind === "project" ? "\u9879\u76EE\u4F1A\u8BDD" : draft.scope.kind === "knowledge_base" ? "\u77E5\u8BC6\u5E93\u4F1A\u8BDD" : "\u72EC\u7ACB\u4F1A\u8BDD";
  const scopeName = pendingScopeName(draft, state);
  const chooseFiles = function(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    try {
      const created = conversation?.createDraftImages?.(files) || [];
      setAttachments((current) => [...current, ...created]);
      setLocalError(null);
    } catch (error) {
      setLocalError(error.message || "\u56FE\u7247\u8BFB\u53D6\u5931\u8D25");
    }
  };
  const removeAttachment = function(id) {
    conversation?.releaseDraftImage?.(id);
    setAttachments((current) => current.filter((item) => item.id !== id));
  };
  const cancel = function() {
    for (const attachment of attachments) conversation?.releaseDraftImage?.(attachment.id);
    onCancel?.();
  };
  return import_react38.default.createElement(
    "main",
    { className: "cpwb-draft-conversation cpwb-pending-session", "data-status": draft.status },
    import_react38.default.createElement(
      "header",
      null,
      import_react38.default.createElement(
        "div",
        { className: "cpwb-pending-identity" },
        import_react38.default.createElement("span", null, scopeLabel3),
        import_react38.default.createElement("strong", null, "\u65B0\u4F1A\u8BDD"),
        import_react38.default.createElement("small", null, "Session ID \u5C06\u5728\u9996\u6B21\u53D1\u9001\u65F6\u751F\u6210")
      ),
      import_react38.default.createElement("button", { type: "button", onClick: cancel }, "\u9000\u51FA\u8349\u7A3F")
    ),
    import_react38.default.createElement(
      "section",
      { className: "cpwb-pending-main" },
      import_react38.default.createElement(
        "section",
        { className: "cpwb-draft-empty" },
        import_react38.default.createElement(s13, { size: 26, weight: "duotone", "aria-hidden": true }),
        import_react38.default.createElement("h2", null, draft.status === "admitted" ? "\u6D88\u606F\u5DF2\u53D1\u9001\uFF0C\u6B63\u5728\u786E\u8BA4\u4F1A\u8BDD" : "\u4ECE\u7B2C\u4E00\u6761\u6D88\u606F\u5F00\u59CB"),
        import_react38.default.createElement("p", null, "\u53D1\u9001\u524D\u4E0D\u521B\u5EFA Session\u3002\u53D1\u9001\u540E\u539F\u5730\u8FDB\u5165\u5B8C\u6574 DSH \u4F1A\u8BDD\uFF0C\u6A21\u578B\u54CD\u5E94\u4F1A\u7ACB\u5373\u5F00\u59CB\u6D41\u5F0F\u663E\u793A\u3002")
      ),
      import_react38.default.createElement(
        "form",
        { className: "cpwb-draft-composer", onSubmit: submit },
        attachments.length ? import_react38.default.createElement("div", { className: "cpwb-pending-attachments", "aria-label": "\u5F85\u53D1\u9001\u56FE\u7247" }, attachments.map((attachment) => import_react38.default.createElement(
          "figure",
          { key: attachment.id },
          import_react38.default.createElement("img", { src: attachment.previewUrl, alt: attachment.file?.name || "\u5F85\u53D1\u9001\u56FE\u7247" }),
          import_react38.default.createElement("button", { type: "button", onClick: () => removeAttachment(attachment.id), "aria-label": "\u79FB\u9664 " + (attachment.file?.name || "\u56FE\u7247") }, import_react38.default.createElement(n17, { size: 13, "aria-hidden": true }))
        ))) : null,
        import_react38.default.createElement("textarea", {
          value: text,
          disabled: busy,
          onChange: (event) => setText(event.target.value),
          placeholder: "\u63CF\u8FF0\u4F60\u60F3\u8981\u6784\u5EFA\u7684\u5185\u5BB9\u2026",
          "aria-label": "\u9996\u6761\u6D88\u606F"
        }),
        import_react38.default.createElement(
          "div",
          { className: "cpwb-pending-composer-tools" },
          import_react38.default.createElement("input", { ref: fileInput, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: chooseFiles }),
          import_react38.default.createElement("button", { type: "button", className: "cpwb-pending-tool", onClick: () => fileInput.current?.click(), "aria-label": "\u6DFB\u52A0\u56FE\u7247", title: "\u6DFB\u52A0\u56FE\u7247" }, import_react38.default.createElement(I, { size: 20, "aria-hidden": true })),
          import_react38.default.createElement(
            "div",
            { ref: modelRoot, className: "cpwb-pending-model" },
            import_react38.default.createElement(
              "button",
              { type: "button", className: "cpwb-pending-model-trigger", onClick: () => setModelOpen((value) => !value), "aria-expanded": modelOpen, "aria-label": "\u9009\u62E9\u6A21\u578B\u4E0E\u63A8\u7406\u5F3A\u5EA6" },
              import_react38.default.createElement("span", null, modelLabel),
              import_react38.default.createElement(s5, { size: 15, "aria-hidden": true })
            ),
            modelOpen ? import_react38.default.createElement(
              "div",
              { className: "cpwb-pending-model-menu", role: "dialog", "aria-label": "\u6A21\u578B\u4E0E\u63A8\u7406\u5F3A\u5EA6" },
              import_react38.default.createElement("div", { className: "cpwb-pending-model-menu-head" }, import_react38.default.createElement("span", null, "MODEL ROUTING"), import_react38.default.createElement("button", { type: "button", onClick: () => {
                setSelection(null);
                setModelOpen(false);
              } }, "\u4F7F\u7528\u9ED8\u8BA4")),
              (catalog.groups || []).map((group) => import_react38.default.createElement(
                "section",
                { key: group.id },
                import_react38.default.createElement("h3", null, group.name),
                group.models?.map((model) => import_react38.default.createElement("button", {
                  type: "button",
                  key: model.id,
                  className: selection?.provider === group.id && selection?.model === model.id ? "cpwb-active" : "",
                  onClick: () => setSelection({ provider: group.id, model: model.id, reasoningEffort: model.reasoning?.defaultEffort })
                }, import_react38.default.createElement("strong", null, model.name), model.description ? import_react38.default.createElement("small", null, model.description) : null))
              )),
              chosen?.model?.reasoning?.efforts?.length ? import_react38.default.createElement(
                "div",
                { className: "cpwb-pending-reasoning" },
                import_react38.default.createElement("span", null, "REASONING EFFORT"),
                import_react38.default.createElement("div", null, chosen.model.reasoning.efforts.map((effort) => import_react38.default.createElement("button", {
                  type: "button",
                  key: effort.id,
                  className: selection?.reasoningEffort === effort.id ? "cpwb-active" : "",
                  onClick: () => setSelection({ ...selection, reasoningEffort: effort.id })
                }, effort.name)))
              ) : null
            ) : null
          ),
          import_react38.default.createElement(
            "button",
            { className: "cpwb-pending-send", type: "submit", disabled: busy || !text.trim() },
            import_react38.default.createElement(m7, { size: 18, weight: "fill", "aria-hidden": true }),
            busy ? "\u6B63\u5728\u8FDE\u63A5" : draft.status === "admitted" ? "\u5B8C\u6210\u8FDE\u63A5" : "\u53D1\u9001"
          )
        ),
        draft.error || localError ? import_react38.default.createElement("p", { className: "cpwb-draft-error", role: "alert" }, localError || draft.error?.message) : null
      )
    ),
    import_react38.default.createElement(
      "aside",
      { className: "cpwb-pending-context", "aria-label": "\u65B0\u4F1A\u8BDD\u4E0A\u4E0B\u6587" },
      import_react38.default.createElement("span", null, draft.scope.kind === "project" ? "PROJECT SYSTEM" : draft.scope.kind === "knowledge_base" ? "KNOWLEDGE SYSTEM" : "SESSION SYSTEM"),
      import_react38.default.createElement("h2", null, scopeName),
      import_react38.default.createElement("small", null, "\u9996\u6761\u6D88\u606F\u53D1\u9001\u540E\u6FC0\u6D3B\u5B8C\u6574\u5DE5\u5177\u680F"),
      import_react38.default.createElement(
        "div",
        null,
        sourcePreview(draft.scope, state).map((label) => import_react38.default.createElement("article", { key: label }, import_react38.default.createElement(s13, { size: 14, "aria-hidden": true }), import_react38.default.createElement("span", null, label)))
      )
    )
  );
}

// src/client/MaintenanceScreen.js
var import_react40 = __toESM(require("react"), 1);
var MAINTENANCE_STORAGE_KEY = "cpwb-maintenance-job";
var TERMINAL_STATES = /* @__PURE__ */ new Set(["completed", "restored", "rollback_pending"]);
var NORMAL_PHASE = /* @__PURE__ */ new Map([
  ["queued", 0],
  ["stopping", 0],
  ["quarantining", 1],
  ["native_refs_updated", 2],
  ["restarting", 3],
  ["workbench_finalizing", 3],
  ["verifying", 3],
  ["completed", 4]
]);
var STEPS = [
  ["\u5173\u95ED DSH \u670D\u52A1", "FLUSH & RELEASE SESSION HANDLES"],
  ["\u9694\u79BB\u4F1A\u8BDD\u6570\u636E", "QUARANTINE FROZEN SESSION ARTIFACTS"],
  ["\u6E05\u7406\u5173\u7CFB\u4E0E\u7D22\u5F15", "WORKSPACE / CACHE / VECTOR INDEX"],
  ["\u91CD\u542F\u5E76\u9A8C\u8BC1", "BOOT / HEALTH / SESSION LIST"]
];
function screenCopy(job) {
  if (job.state === "rollback_pending") {
    return {
      view: "manual",
      eyebrow: "RECOVERY REQUIRED / LOCAL",
      first: "\u670D\u52A1\u6062\u590D",
      accent: "\u9700\u8981\u534F\u52A9",
      lead: "\u81EA\u52A8\u5220\u9664\u5DF2\u7ECF\u505C\u6B62\uFF0C\u9694\u79BB\u6570\u636E\u672A\u88AB\u9500\u6BC1\u3002\u542F\u52A8\u5668\u4F1A\u5728\u4E0B\u6B21\u8FD0\u884C\u65F6\u4F18\u5148\u6062\u590D\u4E8B\u52A1\uFF0C\u4E0D\u4F1A\u7EE7\u7EED\u6267\u884C\u6C38\u4E45\u5220\u9664\u3002",
      connection: "SERVICE OFFLINE",
      stage: "!",
      coreTitle: "LOCAL RECOVERY COMMAND REQUIRED",
      coreMeta: "\u4FDD\u7559\u5F53\u524D\u9875\u9762\uFF0C\u670D\u52A1\u4E0A\u7EBF\u540E\u4F1A\u81EA\u52A8\u91CD\u65B0\u8FDE\u63A5"
    };
  }
  if (job.state === "restoring" || job.state === "restored") {
    return {
      view: "rollback",
      eyebrow: "ROLLBACK PROTOCOL / SAFE",
      first: "\u5220\u9664\u672A\u5B8C\u6210",
      accent: job.state === "restored" ? "\u6570\u636E\u5DF2\u6062\u590D" : "\u6B63\u5728\u6062\u590D",
      lead: job.state === "restored" ? "\u65B0\u670D\u52A1\u672A\u901A\u8FC7\u5C31\u7EEA\u6821\u9A8C\u3002\u9694\u79BB\u4F1A\u8BDD\u3001Workspace \u5173\u7CFB\u4E0E Workbench \u7D22\u5F15\u5DF2\u7ECF\u6062\u590D\uFF0C\u539F\u5BB9\u5668\u4FDD\u6301\u4E0D\u53D8\u3002" : "\u7CFB\u7EDF\u6B63\u5728\u6062\u590D\u5220\u9664\u524D\u7684\u4F1A\u8BDD\u3001Workspace \u5173\u7CFB\u4E0E Workbench \u7D22\u5F15\uFF0C\u6062\u590D\u5B8C\u6210\u524D\u4E0D\u4F1A\u542F\u52A8\u65B0\u7684\u5220\u9664\u4EFB\u52A1\u3002",
      connection: job.state === "restored" ? "DATA RESTORED" : "RESTORING SERVICE",
      stage: "R",
      coreTitle: job.state === "restored" ? "ROLLBACK VERIFIED" : "ROLLBACK IN PROGRESS",
      coreMeta: job.state === "restored" ? "\u5907\u4EFD\u6821\u9A8C\u5B8C\u6210\uFF0C\u539F\u6570\u636E\u4FDD\u6301\u53EF\u7528" : "\u6B63\u5728\u6062\u590D\u672C\u5730\u4E8B\u52A1\u5FEB\u7167"
    };
  }
  if (job.state === "completed") {
    return {
      view: "complete",
      eyebrow: "SAFE PURGE / VERIFIED",
      first: "\u6E05\u9664\u5B8C\u6210",
      accent: "\u7CFB\u7EDF\u4E00\u81F4",
      lead: "\u76EE\u6807\u4F1A\u8BDD\u3001\u539F\u751F\u5F15\u7528\u3001Workbench \u5173\u7CFB\u4E0E\u7D22\u5F15\u5DF2\u7ECF\u4E00\u81F4\u6E05\u7406\uFF0C\u65B0\u4E00\u4EE3 Workbench \u5DF2\u901A\u8FC7\u5C31\u7EEA\u6821\u9A8C\u3002",
      connection: "CORE ONLINE",
      stage: "OK",
      coreTitle: "TRANSACTION COMMITTED",
      coreMeta: "\u5B89\u5168\u5907\u4EFD\u5DF2\u63D0\u4EA4\uFF0C\u5DE5\u4F5C\u53F0\u53EF\u4EE5\u7EE7\u7EED\u4F7F\u7528"
    };
  }
  const stateCopy = {
    queued: ["\u7B49\u5F85\u7EF4\u62A4", "\u76D1\u7BA1\u63A5\u7BA1", "\u5220\u9664\u4EFB\u52A1\u5DF2\u51BB\u7ED3\uFF0C\u6B63\u5728\u7B49\u5F85\u542F\u52A8\u5668\u5B89\u5168\u505C\u6B62\u5F53\u524D DSH \u670D\u52A1\u3002"],
    stopping: ["\u6B63\u5728\u5173\u95ED", "DSH \u670D\u52A1", "Workbench \u6B63\u5728\u91CA\u653E\u4F1A\u8BDD\u53E5\u67C4\u5E76\u5B89\u5168\u505C\u6B62\u5F53\u524D DSH \u670D\u52A1\u3002"],
    quarantining: ["\u6B63\u5728\u9694\u79BB", "\u4F1A\u8BDD\u6570\u636E", "\u76EE\u6807\u4F1A\u8BDD\u6B63\u5728\u79FB\u5165\u4E8B\u52A1\u9694\u79BB\u533A\uFF0C\u975E\u76EE\u6807\u4F1A\u8BDD\u4E0E\u9879\u76EE\u76EE\u5F55\u4E0D\u4F1A\u88AB\u4FEE\u6539\u3002"],
    native_refs_updated: ["\u6B63\u5728\u6E05\u7406", "\u5173\u7CFB\u7D22\u5F15", "\u539F\u751F Workspace \u5F15\u7528\u5DF2\u66F4\u65B0\uFF0C\u6B63\u5728\u51C6\u5907\u65B0\u4E00\u4EE3 Workbench \u5B8C\u6210\u7D22\u5F15\u6E05\u7406\u3002"],
    restarting: ["\u6B63\u5728\u91CD\u542F", "\u667A\u80FD\u6838\u5FC3", "\u76EE\u6807\u4F1A\u8BDD\u5DF2\u5B89\u5168\u9694\u79BB\u3002Workbench \u6B63\u5728\u91CD\u65B0\u63A5\u5165 DSH\uFF0C\u5E76\u9A8C\u8BC1\u4F1A\u8BDD\u3001\u7D22\u5F15\u548C\u9879\u76EE\u5173\u7CFB\u3002"],
    workbench_finalizing: ["\u6B63\u5728\u540C\u6B65", "\u5DE5\u4F5C\u53F0\u7D22\u5F15", "\u65B0\u4E00\u4EE3 Workbench \u5DF2\u542F\u52A8\uFF0C\u6B63\u5728\u6E05\u7406\u51BB\u7ED3\u8BA1\u5212\u4E2D\u7684\u4E1A\u52A1\u5173\u7CFB\u4E0E\u5411\u91CF\u7D22\u5F15\u3002"],
    verifying: ["\u6B63\u5728\u9A8C\u8BC1", "\u7CFB\u7EDF\u4E00\u81F4\u6027", "\u7CFB\u7EDF\u6B63\u5728\u6838\u5BF9\u539F\u751F\u4F1A\u8BDD\u3001Workspace \u5F15\u7528\u548C Workbench \u6295\u5F71\u662F\u5426\u5168\u90E8\u4E00\u81F4\u3002"],
    reconnecting: ["\u6B63\u5728\u91CD\u8FDE", "\u667A\u80FD\u6838\u5FC3", "\u6D4F\u89C8\u5668\u6B63\u5728\u91CD\u65B0\u8FDE\u63A5 Workbench\uFF0C\u5F53\u524D\u753B\u9762\u4FDD\u7559\u6700\u540E\u4E00\u6B21\u670D\u52A1\u5668\u786E\u8BA4\u7684\u4E8B\u52A1\u9636\u6BB5\u3002"]
  }[job.state] ?? ["\u7CFB\u7EDF\u7EF4\u62A4", "\u667A\u80FD\u6838\u5FC3", "Workbench \u6B63\u5728\u5904\u7406\u672C\u5730\u5B89\u5168\u7EF4\u62A4\u4EFB\u52A1\u3002"];
  return {
    view: "restart",
    eyebrow: "SYSTEM MAINTENANCE / LOCAL",
    first: stateCopy[0],
    accent: stateCopy[1],
    lead: stateCopy[2],
    connection: job.disconnected ? "RECONNECTING" : "TRANSACTION ACTIVE",
    stage: String((NORMAL_PHASE.get(job.state) ?? 0) + 1).padStart(2, "0"),
    coreTitle: job.disconnected ? "SERVICE HANDSHAKE IN PROGRESS" : "SAFE PURGE PROTOCOL ACTIVE",
    coreMeta: job.disconnected ? "\u9875\u9762\u4FDD\u6301\u5728\u7EBF\uFF0C\u670D\u52A1\u6062\u590D\u540E\u4F1A\u81EA\u52A8\u7EE7\u7EED" : "\u672C\u5730\u4E8B\u52A1\u9501\u5DF2\u542F\u7528\uFF0C\u8BF7\u52FF\u5173\u95ED\u542F\u52A8\u7EC8\u7AEF"
  };
}
function stepState(job, index) {
  if (job.state === "rollback_pending") return index < 2 ? "done" : "failed";
  if (job.state === "restoring") return index < 2 ? "done" : index === 2 ? "failed" : "active";
  if (job.state === "restored") return index < 2 || index === 3 ? "done" : "failed";
  const phase = NORMAL_PHASE.get(job.state) ?? 0;
  if (phase >= 4 || index < phase) return "done";
  if (index === phase) return "active";
  return "waiting";
}
function stepLabel(state) {
  if (state === "done") return "DONE";
  if (state === "active") return "ACTIVE";
  if (state === "failed") return "FAILED";
  return "WAIT";
}
function writeStoredJob(job) {
  if (typeof window === "undefined" || !window.sessionStorage || !job?.jobId) return;
  try {
    window.sessionStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify({
      jobId: job.jobId,
      recoveryCommand: job.recoveryCommand || "dsh-workbench web"
    }));
  } catch {
  }
}
function clearStoredJob() {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(MAINTENANCE_STORAGE_KEY);
  } catch {
  }
}
function readStoredMaintenanceJob() {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(MAINTENANCE_STORAGE_KEY));
    return typeof value?.jobId === "string" ? value : null;
  } catch {
    return null;
  }
}
function MaintenanceScreen({ store: store3, job, onFinished }) {
  const [copied, setCopied] = import_react40.default.useState(false);
  const copy = screenCopy(job);
  const manual = job.state === "rollback_pending";
  const terminal = TERMINAL_STATES.has(job.state);
  const command = job.recoveryCommand || "dsh-workbench web";
  const targetName = job.container?.name || "\u672C\u5730\u5BB9\u5668";
  import_react40.default.useEffect(() => {
    writeStoredJob(job);
  }, [job?.jobId, command]);
  import_react40.default.useEffect(function() {
    if (!job?.jobId || terminal || typeof window === "undefined") return void 0;
    let cancelled = false;
    let timer = null;
    const poll = async function() {
      await store3.actions.refreshPurgeJob(job.jobId);
      if (!cancelled) {
        const disconnected = store3.getSnapshot().maintenanceJob?.disconnected === true;
        timer = window.setTimeout(poll, disconnected ? 1500 : 500);
      }
    };
    timer = window.setTimeout(poll, 250);
    return function() {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [job?.jobId, job?.state, store3, terminal]);
  const copyRecoveryCommand = async function() {
    try {
      await globalThis.navigator?.clipboard?.writeText?.(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const finish = async function() {
    await store3.actions.clearPurgeJob();
    clearStoredJob();
    onFinished?.(job);
  };
  return import_react40.default.createElement(
    "main",
    {
      className: `cpwb-maintenance-screen cpwb-maintenance-${copy.view}`,
      role: manual || job.state === "restored" ? "alert" : "status",
      "aria-live": manual ? "assertive" : "polite"
    },
    import_react40.default.createElement(
      "header",
      { className: "cpwb-maintenance-topbar" },
      import_react40.default.createElement(
        "div",
        { className: "cpwb-maintenance-brand" },
        import_react40.default.createElement("span", { className: "cpwb-maintenance-brand-mark", "aria-hidden": true }),
        import_react40.default.createElement("span", null, import_react40.default.createElement("strong", null, "HARNESS"), import_react40.default.createElement("small", null, "WORKBENCH"))
      ),
      import_react40.default.createElement("div", { className: "cpwb-maintenance-protocol" }, "SAFE PURGE PROTOCOL / LOCAL NODE"),
      import_react40.default.createElement(
        "div",
        { className: "cpwb-maintenance-connection" },
        import_react40.default.createElement("i", { "aria-hidden": true }),
        import_react40.default.createElement("span", null, copy.connection)
      )
    ),
    import_react40.default.createElement(
      "section",
      { className: "cpwb-maintenance-stage" },
      import_react40.default.createElement(
        "article",
        { className: "cpwb-maintenance-card" },
        import_react40.default.createElement(
          "div",
          { className: "cpwb-maintenance-main" },
          import_react40.default.createElement(
            "div",
            { className: "cpwb-maintenance-cyber-field", "aria-hidden": true },
            import_react40.default.createElement("div", { className: "cpwb-maintenance-code" }, "// 2077"),
            import_react40.default.createElement("div", { className: "cpwb-maintenance-radar" }, import_react40.default.createElement("i")),
            import_react40.default.createElement(
              "div",
              { className: "cpwb-maintenance-datum" },
              import_react40.default.createElement("span", null, "NODE GRID"),
              import_react40.default.createElement("b", null, "31.2304 N"),
              import_react40.default.createElement("span", null, "RESTART VECTOR"),
              import_react40.default.createElement("b", null, terminal ? "STABLE" : "ACTIVE"),
              import_react40.default.createElement("span", null, "SAFE ZONE"),
              import_react40.default.createElement("b", null, "LOCAL")
            ),
            import_react40.default.createElement("div", { className: "cpwb-maintenance-scan" }),
            import_react40.default.createElement(
              "div",
              { className: "cpwb-maintenance-skyline" },
              Array.from({ length: 12 }, (_, index) => import_react40.default.createElement("span", { key: index }))
            )
          ),
          import_react40.default.createElement("div", { className: "cpwb-maintenance-eyebrow" }, copy.eyebrow),
          import_react40.default.createElement("h1", null, copy.first, import_react40.default.createElement("span", null, copy.accent)),
          import_react40.default.createElement("p", { className: "cpwb-maintenance-lead" }, copy.lead),
          manual ? import_react40.default.createElement(
            "div",
            { className: "cpwb-maintenance-recovery" },
            import_react40.default.createElement("strong", null, import_react40.default.createElement(c7, { size: 18, "aria-hidden": true }), " \u81EA\u52A8\u6062\u590D\u672A\u80FD\u91CD\u65B0\u542F\u52A8\u670D\u52A1"),
            import_react40.default.createElement("p", null, "\u6570\u636E\u5DF2\u6062\u590D\u5E76\u4FDD\u7559\u5728\u5B89\u5168\u5907\u4EFD\u4E2D\u3002\u8BF7\u5728 Terminal \u8FD0\u884C\u4EE5\u4E0B\u547D\u4EE4\uFF0C\u542F\u52A8\u5668\u4F1A\u5148\u5B8C\u6210\u56DE\u6EDA\u68C0\u67E5\uFF0C\u518D\u6062\u590D Workbench\u3002"),
            import_react40.default.createElement(
              "div",
              { className: "cpwb-maintenance-command" },
              import_react40.default.createElement("code", null, command),
              import_react40.default.createElement(
                "button",
                { type: "button", onClick: copyRecoveryCommand, "aria-label": "\u590D\u5236\u6062\u590D\u547D\u4EE4" },
                import_react40.default.createElement(s9, { size: 16, "aria-hidden": true }),
                copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u547D\u4EE4"
              )
            )
          ) : import_react40.default.createElement(
            "div",
            { className: "cpwb-maintenance-core" },
            import_react40.default.createElement("div", { className: "cpwb-maintenance-core-visual", "aria-hidden": true }, import_react40.default.createElement("b")),
            import_react40.default.createElement("div", { className: "cpwb-maintenance-signal", "aria-hidden": true }),
            import_react40.default.createElement("div", { className: "cpwb-maintenance-core-copy" }, import_react40.default.createElement("strong", null, copy.coreTitle), import_react40.default.createElement("span", null, copy.coreMeta))
          )
        ),
        import_react40.default.createElement(
          "aside",
          { className: "cpwb-maintenance-side" },
          import_react40.default.createElement(
            "div",
            { className: "cpwb-maintenance-side-head" },
            import_react40.default.createElement("span", null, "TRANSACTION", import_react40.default.createElement("br"), job.jobId),
            import_react40.default.createElement("b", null, copy.stage)
          ),
          import_react40.default.createElement(
            "ol",
            { className: "cpwb-maintenance-steps" },
            STEPS.map(function([title, detail], index) {
              const state = stepState(job, index);
              return import_react40.default.createElement(
                "li",
                { key: title, className: `cpwb-maintenance-step cpwb-${state}` },
                import_react40.default.createElement("span", { className: "cpwb-maintenance-step-index" }, String(index + 1).padStart(2, "0")),
                import_react40.default.createElement("span", { className: "cpwb-maintenance-step-copy" }, import_react40.default.createElement("strong", null, title), import_react40.default.createElement("small", null, detail)),
                import_react40.default.createElement("span", { className: "cpwb-maintenance-step-state" }, state === "done" ? import_react40.default.createElement(n3, { size: 12, "aria-hidden": true }) : null, stepLabel(state))
              );
            })
          ),
          import_react40.default.createElement(
            "div",
            { className: "cpwb-maintenance-reconnect" },
            import_react40.default.createElement("strong", null, job.disconnected ? "\u6B63\u5728\u91CD\u65B0\u8FDE\u63A5 Workbench" : terminal ? "Workbench \u670D\u52A1\u5DF2\u54CD\u5E94" : "Workbench \u4E8B\u52A1\u8FDE\u63A5\u6B63\u5E38"),
            import_react40.default.createElement("p", null, job.disconnected ? "\u670D\u52A1\u6062\u590D\u540E\u9875\u9762\u4F1A\u81EA\u52A8\u7EE7\u7EED\uFF0C\u65E0\u9700\u5237\u65B0\u3002\u82E5\u542F\u52A8\u5931\u8D25\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u6062\u590D\u5220\u9664\u524D\u7684\u6570\u636E\u3002" : terminal ? "\u4EFB\u52A1\u5DF2\u7ECF\u5230\u8FBE\u53EF\u786E\u8BA4\u72B6\u6001\u3002" : "\u9875\u9762\u53EA\u663E\u793A\u670D\u52A1\u5668\u5DF2\u786E\u8BA4\u7684\u9636\u6BB5\uFF0C\u4E0D\u4F7F\u7528\u6A21\u62DF\u767E\u5206\u6BD4\u3002"),
            terminal && !manual ? import_react40.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: finish }, job.state === "completed" ? "\u8FD4\u56DE\u5DE5\u4F5C\u53F0" : "\u67E5\u770B\u5DF2\u6062\u590D\u6570\u636E") : null
          )
        )
      )
    ),
    import_react40.default.createElement(
      "footer",
      { className: "cpwb-maintenance-footer" },
      import_react40.default.createElement("span", null, job.container?.kind === "knowledge_base" ? "KNOWLEDGE CHIP" : "PROJECT", ": ", import_react40.default.createElement("strong", null, targetName)),
      import_react40.default.createElement("span", null, "JOB ", import_react40.default.createElement("strong", null, job.jobId)),
      import_react40.default.createElement("span", null, "LOCAL BACKUP: ", import_react40.default.createElement("strong", null, terminal ? "VERIFIED" : "ARMED"))
    )
  );
}

// src/client/WorkbenchShell.js
function WorkbenchShell(props) {
  const navigation2 = props.navigation;
  const view = import_react42.default.useSyncExternalStore(
    navigation2.subscribe,
    navigation2.getSnapshot,
    navigation2.getSnapshot
  );
  const state = import_react42.default.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const [drawerOwner, setDrawerOwner] = import_react42.default.useState(null);
  const [newSessionOpen, setNewSessionOpen] = import_react42.default.useState(false);
  const [sessionListScope, setSessionListScope] = import_react42.default.useState(null);
  const navigationTriggerRef = import_react42.default.useRef(null);
  import_react42.default.useEffect(function() {
    if (state.maintenanceJob || typeof props.store.actions.resumePurgeJob !== "function") return;
    const stored = readStoredMaintenanceJob();
    if (stored?.jobId) void props.store.actions.resumePurgeJob(stored.jobId);
  }, [props.store, state.maintenanceJob]);
  const navigate = function(page) {
    if (page === "home") navigation2.openHome();
    else if (page === "knowledge") navigation2.openKnowledge();
    else if (page === "sessions") {
      setSessionListScope(null);
      navigation2.openSessions();
    } else if (page === "skills") navigation2.openSkills();
    if (layoutMode === "mobile") setDrawerOwner(null);
  };
  const openDrawer = function(owner) {
    setDrawerOwner((current) => nextDrawerOwner(current, owner));
  };
  const closeDrawer = function() {
    setDrawerOwner(null);
  };
  const openSession = function(sessionId) {
    if (layoutMode === "mobile") closeDrawer();
    return props.openSession?.(sessionId);
  };
  const createSession = function() {
    if (layoutMode === "mobile") closeDrawer();
    setNewSessionOpen(true);
  };
  const archiveSession = async function(sessionId) {
    await props.store.actions.archiveSession(sessionId);
    if (view.sessionId === sessionId) navigation2.openSessions();
  };
  const openNativeSettings = function() {
    closeDrawer();
    if (typeof document === "undefined") return;
    window.setTimeout(function() {
      document.querySelector('[data-slot="sidebar.settings"] > button')?.click?.();
    }, 0);
  };
  const activeEntry = state.workbenchSessions?.[view.sessionId] || state.recentSessions?.find?.((item) => item.sessionId === view.sessionId) || null;
  const currentScope = state.draft?.scope ?? activeEntry?.scope ?? null;
  import_react42.default.useEffect(function() {
    if (view.page !== "conversation" && drawerOwner === "project") closeDrawer();
    if (layoutMode !== "mobile" && drawerOwner === "navigation") closeDrawer();
    if (layoutMode === "desktop" && drawerOwner === "project") closeDrawer();
  }, [drawerOwner, layoutMode, view.page]);
  let center;
  if (view.page === "conversation") {
    center = import_react42.default.createElement(WorkbenchSessionShell, {
      ...props,
      open: true,
      globalSidebar: true,
      sessionId: view.sessionId,
      opening: view.opening === true,
      openError: view.error || null,
      onRetryOpen: () => props.openSession?.(view.sessionId),
      onHome: navigation2.openHome,
      layoutMode,
      projectDrawerOpen: drawerOwner === "project",
      onProjectDrawerOpen: () => openDrawer("project"),
      onProjectDrawerClose: closeDrawer
    });
  } else if (view.page === "draft") {
    center = import_react42.default.createElement(DraftConversation, {
      store: props.store,
      sessions: props.sessions,
      workspaces: props.workspaces,
      connection: props.connection,
      conversation: props.conversation,
      onActivated: props.openActivatedSession,
      onCancel() {
        Promise.resolve(props.store.actions.discardDraft()).finally(navigation2.openHome);
      }
    });
  } else if (view.page === "knowledge") {
    center = import_react42.default.createElement(KnowledgeCenterPage, {
      store: props.store,
      onDraftOpen: navigation2.openDraft
    });
  } else if (view.page === "sessions") {
    center = import_react42.default.createElement(SessionListPage, { store: props.store, onOpenSession: openSession, initialScope: sessionListScope });
  } else if (view.page === "skills") {
    center = import_react42.default.createElement(SkillsPage, { store: props.store });
  } else {
    center = import_react42.default.createElement(ProjectHome, {
      ...props,
      open: true,
      openProjectSessions(project) {
        setSessionListScope({ kind: "project", id: project.id, name: project.name });
        navigation2.openSessions();
      }
    });
  }
  const sidebar = import_react42.default.createElement(WorkbenchSidebar, {
    page: view.page,
    activeSessionId: view.sessionId,
    recentSessions: state.recentSessions,
    onNavigate: navigate,
    onNewSession: createSession,
    onOpenSession: openSession,
    onArchiveSession: (sessionId) => archiveSession(sessionId).catch(function() {
    }),
    timeZone: state.settings?.timezone || DEFAULT_TIME_ZONE,
    mobile: layoutMode === "mobile",
    settingsTrigger: openNativeSettings
  });
  const dialogScope = currentScope ?? { kind: "independent", id: null };
  return import_react42.default.createElement(
    "div",
    {
      className: "cpwb-app-shell cpwb-layout-" + layoutMode,
      "data-page": view.page,
      "data-navigation-open": drawerOwner === "navigation" ? "true" : "false"
    },
    layoutMode === "mobile" ? import_react42.default.createElement(
      import_react42.default.Fragment,
      null,
      import_react42.default.createElement("button", {
        ref: navigationTriggerRef,
        type: "button",
        className: "cpwb-mobile-nav-trigger",
        "aria-label": "\u6253\u5F00\u5BFC\u822A",
        "aria-expanded": drawerOwner === "navigation",
        onClick: () => openDrawer("navigation")
      }, import_react42.default.createElement(c6, { size: 21, "aria-hidden": true })),
      import_react42.default.createElement(DrawerDialog, {
        open: drawerOwner === "navigation",
        onClose: closeDrawer,
        label: "Workbench \u5BFC\u822A",
        side: "left",
        triggerRef: navigationTriggerRef
      }, sidebar)
    ) : sidebar,
    import_react42.default.createElement("section", { className: "cpwb-workbench-stage" }, center),
    import_react42.default.createElement(NewSessionDialog, {
      open: newSessionOpen,
      store: props.store,
      initialScope: dialogScope,
      onClose: () => setNewSessionOpen(false),
      onStart(input) {
        props.store.actions.startDraft(input);
        setNewSessionOpen(false);
        navigation2.openDraft();
      }
    }),
    state.maintenanceJob ? import_react42.default.createElement(MaintenanceScreen, {
      store: props.store,
      job: state.maintenanceJob,
      onFinished() {
        setSessionListScope(null);
        navigation2.openHome();
      }
    }) : null
  );
}

// src/client/SettingsSection.js
var import_react44 = __toESM(require("react"), 1);
var WORKBENCH_SECTIONS = [
  ["workbench", "\u603B\u89C8"],
  ["timezone", "\u65F6\u533A"],
  ["automation", "\u81EA\u52A8\u5316\u63D0\u793A\u8BCD"],
  ["embedding", "\u5411\u91CF\u6A21\u578B"],
  ["network", "\u7F51\u7EDC / Proxy"],
  ["auth", "Codex"],
  ["archive", "\u5F52\u6863\u4F1A\u8BDD"]
];
function ActionMessage({ message }) {
  return message ? import_react44.default.createElement("p", { role: "status", className: "cpwb-settings-message" }, message) : null;
}
function TimezonePanel({ settings, store: store3 }) {
  const [draft, setDraft] = import_react44.default.useState(settings.timezone || "Asia/Shanghai");
  const [message, setMessage] = import_react44.default.useState("");
  const [saving, setSaving] = import_react44.default.useState(false);
  import_react44.default.useEffect(() => setDraft(settings.timezone || "Asia/Shanghai"), [settings.timezone]);
  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await store3.actions.updateTimezone(draft);
      setMessage("\u5DF2\u66F4\u65B0\uFF1B\u5386\u53F2 UTC \u65F6\u95F4\u4FDD\u6301\u4E0D\u53D8\u3002");
    } catch (error) {
      setMessage(error?.message || "\u65F6\u533A\u66F4\u65B0\u5931\u8D25");
    } finally {
      setSaving(false);
    }
  };
  return import_react44.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react44.default.createElement("span", { className: "cpwb-eyebrow" }, "WORKBENCH / GLOBAL TIMEZONE"),
    import_react44.default.createElement("h2", null, "\u5168\u5C40\u65F6\u533A"),
    import_react44.default.createElement("p", null, "\u6240\u6709\u5F85\u529E\u3001\u5B9A\u65F6\u4EFB\u52A1\u3001\u603B\u7ED3\u4E0E\u754C\u9762\u65F6\u95F4\u7EDF\u4E00\u4F7F\u7528 Workbench \u65F6\u533A\u3002"),
    import_react44.default.createElement(CyberSelect, {
      value: draft,
      onChange: setDraft,
      ariaLabel: "Workbench \u65F6\u533A",
      options: ["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/London", "America/Los_Angeles", "America/New_York", "UTC"].map((zone) => ({ value: zone, label: zone }))
    }),
    import_react44.default.createElement("input", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "\u5408\u6CD5 IANA ID\uFF0C\u4F8B\u5982 Europe/Berlin", "aria-label": "\u81EA\u5B9A\u4E49 IANA \u65F6\u533A" }),
    import_react44.default.createElement("button", { type: "button", onClick: save, disabled: saving }, saving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u65F6\u533A"),
    import_react44.default.createElement(ActionMessage, { message })
  );
}
function AutomationPromptsPanel({ settings, store: store3 }) {
  const prompts = settings.automationPrompts || { summaryPrompt: "", todoPrompt: "" };
  const [draft, setDraft] = import_react44.default.useState(prompts);
  const [message, setMessage] = import_react44.default.useState("");
  const [saving, setSaving] = import_react44.default.useState(false);
  import_react44.default.useEffect(() => setDraft(prompts), [prompts.summaryPrompt, prompts.todoPrompt]);
  const patch = (key) => (event) => setDraft((current) => ({ ...current, [key]: event.target.value }));
  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await store3.actions.updateAutomationPrompts(draft);
      setMessage("\u81EA\u52A8\u5316\u63D0\u793A\u8BCD\u5DF2\u4FDD\u5B58\uFF1B\u540E\u7EED\u751F\u6210\u5C06\u4F7F\u7528\u65B0\u5185\u5BB9\u3002");
    } catch (error) {
      setMessage(error?.message || "\u63D0\u793A\u8BCD\u4FDD\u5B58\u5931\u8D25");
    } finally {
      setSaving(false);
    }
  };
  return import_react44.default.createElement(
    "div",
    { className: "cpwb-settings-panel cpwb-prompt-settings" },
    import_react44.default.createElement("span", { className: "cpwb-eyebrow" }, "AUTOMATION / PROMPT CONTROL"),
    import_react44.default.createElement("h2", null, "\u81EA\u52A8\u5316\u63D0\u793A\u8BCD"),
    import_react44.default.createElement("p", null, "\u652F\u6301\u53D8\u91CF {{projectId}}\u3001{{date}}\u3001{{nextDate}}\uFF1B\u8FD0\u884C\u65F6\u9879\u76EE\u6570\u636E\u4F1A\u7531\u7CFB\u7EDF\u5B89\u5168\u8FFD\u52A0\u3002"),
    import_react44.default.createElement(
      "label",
      null,
      "\u6BCF\u65E5\u603B\u7ED3\u63D0\u793A\u8BCD",
      import_react44.default.createElement("textarea", { rows: 8, value: draft.summaryPrompt, onChange: patch("summaryPrompt"), "aria-label": "\u6BCF\u65E5\u603B\u7ED3\u63D0\u793A\u8BCD" })
    ),
    import_react44.default.createElement(
      "label",
      null,
      "\u6B21\u65E5\u5F85\u529E\u63D0\u793A\u8BCD",
      import_react44.default.createElement("textarea", { rows: 8, value: draft.todoPrompt, onChange: patch("todoPrompt"), "aria-label": "\u6B21\u65E5\u5F85\u529E\u63D0\u793A\u8BCD" })
    ),
    import_react44.default.createElement("button", { type: "button", onClick: save, disabled: saving }, saving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u63D0\u793A\u8BCD"),
    import_react44.default.createElement(ActionMessage, { message })
  );
}
function EmbeddingPanel({ settings, store: store3 }) {
  const embedding = settings.embedding || {};
  const credential = embedding.credential || { configured: false, source: null, readOnly: false };
  const [draft, setDraft] = import_react44.default.useState({
    provider: embedding.provider || "ollama",
    baseUrl: embedding.baseUrl || "http://127.0.0.1:11434",
    model: embedding.model || "qwen3-embedding:0.6b",
    dimensions: embedding.dimensions || 1024,
    timeoutMs: embedding.timeoutMs || 3e4,
    credentialRef: embedding.credentialRef || ""
  });
  const [credentialValue, setCredentialValue] = import_react44.default.useState("");
  const [message, setMessage] = import_react44.default.useState("");
  const [saving, setSaving] = import_react44.default.useState(false);
  import_react44.default.useEffect(() => setDraft({
    provider: embedding.provider || "ollama",
    baseUrl: embedding.baseUrl || "http://127.0.0.1:11434",
    model: embedding.model || "qwen3-embedding:0.6b",
    dimensions: embedding.dimensions || 1024,
    timeoutMs: embedding.timeoutMs || 3e4,
    credentialRef: embedding.credentialRef || ""
  }), [embedding.provider, embedding.baseUrl, embedding.model, embedding.dimensions, embedding.timeoutMs, embedding.credentialRef]);
  const patch = (key) => (event) => setDraft((current) => ({ ...current, [key]: event.target.value }));
  const run = async (action, success) => {
    setSaving(true);
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (error) {
      setMessage(error?.message || "\u64CD\u4F5C\u5931\u8D25");
    } finally {
      setSaving(false);
    }
  };
  const config = { ...draft, dimensions: Number(draft.dimensions), timeoutMs: Number(draft.timeoutMs) };
  const index = settings.index || {};
  return import_react44.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react44.default.createElement("span", { className: "cpwb-eyebrow" }, "KNOWLEDGE / EMBEDDING"),
    import_react44.default.createElement("h2", null, "\u5411\u91CF\u6A21\u578B"),
    import_react44.default.createElement("label", null, "Provider", import_react44.default.createElement(CyberSelect, {
      value: draft.provider,
      onChange: (provider) => setDraft((current) => ({ ...current, provider })),
      ariaLabel: "Embedding Provider",
      options: [{ value: "ollama", label: "Ollama" }, { value: "openai-compatible", label: "OpenAI-compatible" }]
    })),
    import_react44.default.createElement("label", null, "Base URL", import_react44.default.createElement("input", { value: draft.baseUrl, onChange: patch("baseUrl"), "aria-label": "Embedding Base URL" })),
    import_react44.default.createElement("label", null, "Model", import_react44.default.createElement("input", { value: draft.model, onChange: patch("model"), "aria-label": "Embedding model" })),
    import_react44.default.createElement("label", null, "Dimensions", import_react44.default.createElement("input", { type: "number", value: draft.dimensions, onChange: patch("dimensions"), "aria-label": "Embedding dimensions" })),
    import_react44.default.createElement("label", null, "Timeout (ms)", import_react44.default.createElement("input", { type: "number", value: draft.timeoutMs, onChange: patch("timeoutMs"), "aria-label": "Embedding timeout" })),
    import_react44.default.createElement("label", null, "Credential reference", import_react44.default.createElement("input", { value: draft.credentialRef, onChange: patch("credentialRef"), "aria-label": "Embedding credential reference" })),
    import_react44.default.createElement(
      "div",
      { className: "cpwb-settings-actions" },
      import_react44.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.testEmbedding(config), "\u5411\u91CF\u670D\u52A1\u8FDE\u63A5\u6B63\u5E38\u3002"), disabled: saving }, "\u6D4B\u8BD5\u8FDE\u63A5"),
      import_react44.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.updateEmbedding(config), "\u5411\u91CF\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u7D22\u5F15\u72B6\u6001\u6B63\u5728\u6821\u9A8C\u3002"), disabled: saving }, "\u4FDD\u5B58\u914D\u7F6E")
    ),
    import_react44.default.createElement(
      "fieldset",
      null,
      import_react44.default.createElement("legend", null, "\u51ED\u636E\u72B6\u6001"),
      import_react44.default.createElement("p", null, credential.configured ? `\u5DF2\u914D\u7F6E \xB7 \u6765\u6E90 ${credential.source || "\u672A\u77E5"}` : "\u672A\u914D\u7F6E", credential.readOnly ? " \xB7 \u53EA\u8BFB" : ""),
      import_react44.default.createElement("input", { type: "password", value: credentialValue, onChange: (event) => setCredentialValue(event.target.value), placeholder: "\u8F93\u5165\u65B0\u51ED\u636E", "aria-label": "\u65B0 embedding \u51ED\u636E" }),
      import_react44.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.putEmbeddingCredential({ credentialRef: draft.credentialRef, value: credentialValue }), "\u51ED\u636E\u5DF2\u4EA4\u7531 DSH credentials \u4FDD\u5B58\u3002"), disabled: saving || !draft.credentialRef || !credentialValue }, "\u8BBE\u7F6E / \u66FF\u6362\u51ED\u636E"),
      import_react44.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.deleteEmbeddingCredential({ credentialRef: draft.credentialRef }), "\u51ED\u636E\u5DF2\u6E05\u9664\u3002"), disabled: saving || !draft.credentialRef }, "\u6E05\u9664\u51ED\u636E")
    ),
    import_react44.default.createElement(
      "div",
      { className: "cpwb-settings-index" },
      import_react44.default.createElement("strong", null, `\u7D22\u5F15\u72B6\u6001\uFF1A${index.status || "unknown"}`),
      import_react44.default.createElement("span", null, `\u6587\u6863 ${index.counts?.ready ?? index.documentCount ?? 0}`),
      import_react44.default.createElement("p", null, "\u5F71\u54CD\u8303\u56F4\uFF1A\u5168\u90E8\u77E5\u8BC6\u5E93\u6587\u6863"),
      import_react44.default.createElement("button", { type: "button", onClick: () => {
        const allowed = typeof window === "undefined" || typeof window.confirm !== "function" ? true : window.confirm("\u5C06\u91CD\u5EFA\u5168\u90E8\u77E5\u8BC6\u5E93\u5411\u91CF\u7D22\u5F15\uFF0C\u53EF\u80FD\u9700\u8981\u8F83\u957F\u65F6\u95F4\u3002\u7EE7\u7EED\uFF1F");
        if (allowed) store3.actions.reindexAllIndexes?.();
      }, disabled: saving }, "\u91CD\u5EFA\u5168\u90E8\u5411\u91CF\u7D22\u5F15")
    ),
    import_react44.default.createElement(ActionMessage, { message })
  );
}
function NetworkPanel({ settings, store: store3 }) {
  const network = settings.network || {};
  const saved = network.nextLaunch || network;
  const [draft, setDraft] = import_react44.default.useState({ mode: saved.mode || "inherit", proxyUrl: saved.proxyUrl || "", noProxy: saved.noProxy || "" });
  const [message, setMessage] = import_react44.default.useState("");
  const [saving, setSaving] = import_react44.default.useState(false);
  const [testResult, setTestResult] = import_react44.default.useState(null);
  import_react44.default.useEffect(() => setDraft({ mode: saved.mode || "inherit", proxyUrl: saved.proxyUrl || "", noProxy: saved.noProxy || "" }), [saved.mode, saved.proxyUrl, saved.noProxy]);
  const run = async (action, success) => {
    setSaving(true);
    setMessage("");
    try {
      const result = await action();
      if (result) setTestResult(result);
      setMessage(success);
    } catch (error) {
      setMessage(error?.message || "\u7F51\u7EDC\u64CD\u4F5C\u5931\u8D25");
    } finally {
      setSaving(false);
    }
  };
  return import_react44.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react44.default.createElement("span", { className: "cpwb-eyebrow" }, "RUNTIME / NETWORK"),
    import_react44.default.createElement("h2", null, "\u7F51\u7EDC / Proxy"),
    import_react44.default.createElement("label", null, "\u6A21\u5F0F", import_react44.default.createElement(CyberSelect, {
      value: draft.mode,
      onChange: (mode) => setDraft((current) => ({ ...current, mode })),
      ariaLabel: "\u7F51\u7EDC\u6A21\u5F0F",
      options: [{ value: "inherit", label: "\u7EE7\u627F DSH" }, { value: "direct", label: "\u76F4\u8FDE" }, { value: "custom", label: "\u81EA\u5B9A\u4E49 Proxy" }]
    })),
    import_react44.default.createElement("label", null, "Proxy URL", import_react44.default.createElement("input", { value: draft.proxyUrl, onChange: (event) => setDraft({ ...draft, proxyUrl: event.target.value }), "aria-label": "Proxy URL" })),
    import_react44.default.createElement("label", null, "No Proxy", import_react44.default.createElement("input", { value: draft.noProxy, onChange: (event) => setDraft({ ...draft, noProxy: event.target.value }), "aria-label": "No Proxy" })),
    import_react44.default.createElement(
      "div",
      { className: "cpwb-settings-actions" },
      import_react44.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.updateNetwork(draft), "\u7F51\u7EDC\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF1B\u8FDB\u7A0B\u7EA7\u4EE3\u7406\u5C06\u5728\u4E0B\u6B21\u542F\u52A8\u751F\u6548\u3002"), disabled: saving }, "\u4FDD\u5B58\u7F51\u7EDC"),
      import_react44.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.testNetwork(draft), "\u5DF2\u5B8C\u6210\u5F53\u524D\u751F\u6548\u7F51\u7EDC\u6D4B\u8BD5\uFF1B\u81EA\u5B9A\u4E49\u914D\u7F6E\u5C06\u5728\u4E0B\u6B21\u542F\u52A8\u9A8C\u8BC1\u3002"), disabled: saving }, "\u6D4B\u8BD5\u5F53\u524D\u751F\u6548\u7F51\u7EDC")
    ),
    import_react44.default.createElement("p", null, `\u5F53\u524D\u751F\u6548\uFF1A${network.currentEffective?.mode || "inherit"}`),
    import_react44.default.createElement("p", null, `\u4E0B\u6B21\u542F\u52A8\uFF1A${network.nextLaunch?.mode || network.mode || "inherit"}`),
    import_react44.default.createElement("p", null, network.requiresRestart ? "\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u542F\u52A8\u751F\u6548\u3002" : "\u5F53\u524D\u8FDB\u7A0B\u5DF2\u4E0E\u4FDD\u5B58\u914D\u7F6E\u4E00\u81F4\u3002"),
    testResult ? import_react44.default.createElement("pre", { "data-network-result": true }, JSON.stringify(testResult)) : null,
    import_react44.default.createElement(ActionMessage, { message })
  );
}
function AuthPanel({ settings, store: store3 }) {
  const auth = settings.auth || {};
  const [message, setMessage] = import_react44.default.useState("");
  const [busy, setBusy] = import_react44.default.useState(false);
  const explainError = (error) => ({
    CODEX_AUTH_CACHE_UNAVAILABLE: "\u672A\u627E\u5230\u672C\u673A Codex \u767B\u5F55\u7F13\u5B58\uFF0C\u8BF7\u5148\u5728 Codex \u4E2D\u5B8C\u6210\u767B\u5F55\u3002",
    CODEX_AUTH_CACHE_INVALID: "\u672C\u673A Codex \u767B\u5F55\u7F13\u5B58\u683C\u5F0F\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55 Codex \u540E\u518D\u8BD5\u3002",
    CODEX_AUTH_TOKEN_MISSING: "\u767B\u5F55\u7F13\u5B58\u4E2D\u6CA1\u6709\u53EF\u7528\u51ED\u636E\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55 Codex \u540E\u518D\u8BD5\u3002",
    CODEX_AUTH_UNAVAILABLE: "\u5F53\u524D DSH credentials \u670D\u52A1\u4E0D\u53EF\u7528\u3002"
  })[error?.code] || error?.message || "Codex \u63A5\u5165\u5931\u8D25";
  const connect = async () => {
    setBusy(true);
    setMessage("");
    try {
      await store3.actions.connectCodex();
      setMessage("Codex \u51ED\u636E\u5DF2\u63A5\u5165\uFF1B\u4E0B\u4E00\u6B21\u6A21\u578B\u8BF7\u6C42\u5C06\u76F4\u63A5\u4F7F\u7528\u3002\u65E0\u9700\u91CD\u542F\u3002");
    } catch (error) {
      setMessage(explainError(error));
    } finally {
      setBusy(false);
    }
  };
  const test = async () => {
    setBusy(true);
    setMessage("");
    try {
      const result = await store3.actions.testAuth();
      setMessage(result?.ok ? "\u672C\u5730\u51ED\u636E\u5DF2\u5C31\u7EEA\uFF1B\u8FDC\u7AEF\u6709\u6548\u6027\u5C06\u5728\u4E0B\u4E00\u6B21\u6A21\u578B\u8BF7\u6C42\u65F6\u786E\u8BA4\u3002" : "\u5C1A\u672A\u627E\u5230\u53EF\u7528\u7684 Codex \u51ED\u636E\u3002");
    } catch (error) {
      setMessage(explainError(error));
    } finally {
      setBusy(false);
    }
  };
  const configured = auth.configured === true;
  return import_react44.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react44.default.createElement("span", { className: "cpwb-eyebrow" }, "CODEX LINK / LOCAL AUTH BRIDGE"),
    import_react44.default.createElement("h2", null, "Codex \u5FEB\u901F\u63A5\u5165"),
    import_react44.default.createElement(
      "div",
      { className: `cpwb-auth-state ${configured ? "cpwb-auth-online" : "cpwb-auth-offline"}` },
      import_react44.default.createElement("span", { className: "cpwb-auth-icon" }, configured ? import_react44.default.createElement(h, { size: 25, weight: "duotone", "aria-hidden": true }) : import_react44.default.createElement(n7, { size: 25, weight: "duotone", "aria-hidden": true })),
      import_react44.default.createElement(
        "div",
        null,
        import_react44.default.createElement("strong", null, configured ? "CODEX LINK / ONLINE" : "CODEX LINK / NOT CONNECTED"),
        import_react44.default.createElement("p", null, configured ? `\u51ED\u636E\u6765\u6E90\uFF1A${auth.source || "DSH credentials"}` : "\u626B\u63CF\u672C\u673A Codex \u767B\u5F55\u7F13\u5B58\uFF0C\u5E76\u5B89\u5168\u63A5\u5165\u5F53\u524D Workbench\u3002")
      )
    ),
    import_react44.default.createElement(
      "div",
      { className: "cpwb-auth-privacy" },
      import_react44.default.createElement(m11, { size: 17, weight: "regular", "aria-hidden": true }),
      import_react44.default.createElement("p", null, "\u626B\u63CF\u53EA\u5728\u70B9\u51FB\u540E\u53D1\u751F\u3002\u4EE4\u724C\u4E0D\u4F1A\u53D1\u9001\u5230\u6D4F\u89C8\u5668\u3001\u5199\u5165 Workbench \u6570\u636E\u5E93\u6216\u663E\u793A\u5728\u65E5\u5FD7\u4E2D\u3002")
    ),
    configured ? import_react44.default.createElement(
      "div",
      { className: "cpwb-settings-actions" },
      import_react44.default.createElement("button", { type: "button", onClick: test, disabled: busy }, busy ? "\u9A8C\u8BC1\u4E2D\u2026" : "\u9A8C\u8BC1\u672C\u5730\u51ED\u636E"),
      import_react44.default.createElement("span", { className: "cpwb-auth-activation" }, "NEXT REQUEST / ACTIVE")
    ) : import_react44.default.createElement(
      "button",
      { type: "button", className: "cpwb-auth-connect", onClick: connect, disabled: busy || auth.canConnect === false },
      busy ? import_react44.default.createElement(import_react44.default.Fragment, null, import_react44.default.createElement(m9, { size: 18, className: "cpwb-spin", "aria-hidden": true }), "\u6B63\u5728\u63A5\u5165\u2026") : import_react44.default.createElement(import_react44.default.Fragment, null, import_react44.default.createElement(n12, { size: 18, weight: "bold", "aria-hidden": true }), "\u626B\u63CF\u5E76\u63A5\u5165 Codex")
    ),
    auth.readOnly ? import_react44.default.createElement("p", null, "\u8BE5\u51ED\u636E\u7531\u542F\u52A8\u73AF\u5883\u63D0\u4F9B\uFF0C\u53EA\u8BFB\u4E14\u4F18\u5148\u4E8E\u672C\u5730\u51ED\u636E\u5E93\u3002") : null,
    auth.canConnect === false && !configured ? import_react44.default.createElement("p", { className: "cpwb-auth-unavailable" }, "\u5F53\u524D DSH credentials \u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u6267\u884C\u81EA\u52A8\u63A5\u5165\u3002") : null,
    import_react44.default.createElement(ActionMessage, { message })
  );
}
function WorkbenchPanel({ section, settings, store: store3, close, onOpenSession }) {
  if (section === "timezone") return import_react44.default.createElement(TimezonePanel, { settings, store: store3 });
  if (section === "automation") return import_react44.default.createElement(AutomationPromptsPanel, { settings, store: store3 });
  if (section === "embedding") return import_react44.default.createElement(EmbeddingPanel, { settings, store: store3 });
  if (section === "network") return import_react44.default.createElement(NetworkPanel, { settings, store: store3 });
  if (section === "auth") return import_react44.default.createElement(AuthPanel, { settings, store: store3 });
  if (section === "archive") return import_react44.default.createElement(SessionListPage, {
    archived: true,
    embedded: true,
    store: store3,
    onOpenSession: typeof onOpenSession === "function" ? async function(sessionId) {
      await onOpenSession(sessionId);
      close?.();
    } : void 0
  });
  return import_react44.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react44.default.createElement("span", { className: "cpwb-eyebrow" }, "HARNESS WORKBENCH"),
    import_react44.default.createElement("h2", null, "Workbench \u8BBE\u7F6E"),
    import_react44.default.createElement("p", null, "\u8FD9\u91CC\u662F Workbench \u81EA\u6709\u8BBE\u7F6E\u3002\u6A21\u578B\u3001\u63D2\u4EF6\u4E0E DSH credentials \u7EE7\u7EED\u7531\u539F\u751F DSH \u8BBE\u7F6E\u9875\u9762\u7BA1\u7406\u3002")
  );
}
function WorkbenchSettingsSection({ store: store3, initialActive = "workbench", close, onOpenSession }) {
  const [active, setActive] = import_react44.default.useState(initialActive);
  const subscribe = store3?.subscribe || (() => () => {
  });
  const getSnapshot = store3?.getSnapshot || (() => ({}));
  const snapshot = import_react44.default.useSyncExternalStore(subscribe, getSnapshot, getSnapshot) || {};
  const settings = snapshot.settings || {};
  import_react44.default.useEffect(() => {
    if (typeof store3?.actions?.loadSettings === "function") store3.actions.loadSettings().catch(() => {
    });
  }, [store3]);
  return import_react44.default.createElement(
    "section",
    { className: "cpwb-native-settings-section", "aria-label": "Harness Workbench \u8BBE\u7F6E" },
    import_react44.default.createElement(
      "header",
      { className: "cpwb-native-settings-header" },
      import_react44.default.createElement(
        "div",
        null,
        import_react44.default.createElement("span", { className: "cpwb-eyebrow" }, "HARNESS WORKBENCH / SYSTEM CONFIG"),
        import_react44.default.createElement("h2", null, "Workbench \u8BBE\u7F6E"),
        import_react44.default.createElement("p", null, "\u9879\u76EE\u5DE5\u4F5C\u53F0\u6269\u5C55\u8BBE\u7F6E\uFF1B\u6A21\u578B\u3001\u63D2\u4EF6\u548C Agent \u9884\u8BBE\u7EE7\u7EED\u7531\u5DE6\u4FA7\u539F\u751F\u5206\u7C7B\u7BA1\u7406\u3002")
      )
    ),
    import_react44.default.createElement(
      "nav",
      { className: "cpwb-settings-nav", "aria-label": "Workbench \u8BBE\u7F6E\u5206\u7C7B" },
      ...WORKBENCH_SECTIONS.map(([id, label]) => import_react44.default.createElement("button", { key: id, type: "button", className: active === id ? "cpwb-active" : "", onClick: () => setActive(id) }, label))
    ),
    import_react44.default.createElement("main", { className: "cpwb-settings-content" }, import_react44.default.createElement(WorkbenchPanel, { section: active, settings, store: store3, close, onOpenSession }))
  );
}

// src/client/settingsSlot.js
function registerWorkbenchSettingsSection(ctx, store3, { onOpenSession } = {}) {
  if (!ctx?.slots?.inject || !ctx?.slots?.register) {
    throw new TypeError("settings section registration requires the DSH slots service");
  }
  return ctx.slots.inject("settings.section", function() {
    return ctx.slots.register({
      name: "settings.section",
      id: "cpwb-workbench-settings",
      order: 20,
      label: "Workbench",
      inject: function() {
        return { store: store3, onOpenSession };
      }
    }, WorkbenchSettingsSection);
  });
}

// src/shared/knowledgeReferences.js
var PREFIX = "cpwb-kb:";
function escapeXmlAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function encodeKnowledgeBaseReference({ id, name }) {
  if (!Number.isSafeInteger(id) || id < 1) throw new TypeError("knowledge base id must be positive");
  return PREFIX + id + ":" + encodeURIComponent(String(name || "\u77E5\u8BC6\u5E93"));
}
function decodeKnowledgeBaseReference(ref) {
  if (typeof ref !== "string" || !ref.startsWith(PREFIX)) return null;
  const match = /^cpwb-kb:(\d+):(.*)$/.exec(ref);
  if (!match) return null;
  try {
    return { id: Number(match[1]), name: decodeURIComponent(match[2]) };
  } catch {
    return null;
  }
}
function serializeKnowledgeBaseReference(ref) {
  const value = decodeKnowledgeBaseReference(ref);
  if (!value) throw new TypeError("invalid knowledge base reference");
  return `<cpwb_knowledge_base id="${value.id}" name="${escapeXmlAttr(value.name)}" />`;
}

// src/client/knowledgeReferences.js
function createKnowledgeBaseReferenceSource({ getKnowledgeBases }) {
  if (typeof getKnowledgeBases !== "function") throw new TypeError("getKnowledgeBases is required");
  return {
    trigger: "@",
    name: "cpwbKnowledge",
    order: 20,
    showGroupTitle: false,
    async candidates(session, { query, signal }) {
      if (signal?.aborted) return [];
      const needle = String(query || "").trim().toLocaleLowerCase();
      return (getKnowledgeBases() || []).filter((item) => !needle || String(item.name || "").toLocaleLowerCase().includes(needle)).map((item) => ({
        name: "\u77E5\u8BC6\u5E93 \xB7 " + item.name,
        description: item.description || "\u5411\u91CF\u77E5\u8BC6\u5E93",
        section: "\u77E5\u8BC6\u5E93",
        value: encodeKnowledgeBaseReference(item)
      }));
    },
    onPick({ candidate }) {
      const value = decodeKnowledgeBaseReference(candidate?.value);
      if (!value) return void 0;
      return { insert: {
        source: "cpwbKnowledge",
        ref: candidate.value,
        label: value.name,
        appearance: "folder",
        clipboardText: "@\u77E5\u8BC6\u5E93/" + value.name
      } };
    },
    codec: {
      clipboardText(ref) {
        const value = decodeKnowledgeBaseReference(ref);
        return value ? "@\u77E5\u8BC6\u5E93/" + value.name : "@\u77E5\u8BC6\u5E93";
      },
      serialize(ref) {
        return Promise.resolve(serializeKnowledgeBaseReference(ref));
      }
    }
  };
}
function registerKnowledgeBaseReferenceSource(ctx, store3) {
  const inputTriggers = ctx.inputTriggers;
  if (!inputTriggers?.registerSource) throw new Error("DSH inputTriggers service is unavailable");
  const source = createKnowledgeBaseReferenceSource({
    getKnowledgeBases: () => store3.getSnapshot().knowledgeBases
  });
  return ctx.effect(() => inputTriggers.registerSource(source), "cpwb: knowledge-base @ source");
}

// src/client/ImageAttachmentButton.js
var import_react46 = __toESM(require("react"), 1);
function dispatchImageFiles(target, files, {
  DataTransferCtor = globalThis.DataTransfer,
  ClipboardEventCtor = globalThis.ClipboardEvent,
  EventCtor = globalThis.Event
} = {}) {
  if (!target || typeof target.dispatchEvent !== "function" || !files?.length || typeof DataTransferCtor !== "function") return false;
  const transfer = new DataTransferCtor();
  for (const file of files) transfer.items.add(file);
  let event;
  try {
    event = new ClipboardEventCtor("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: transfer
    });
  } catch {
    if (typeof EventCtor !== "function") return false;
    event = new EventCtor("paste", { bubbles: true, cancelable: true });
  }
  if (!event.clipboardData) {
    try {
      Object.defineProperty(event, "clipboardData", { value: transfer });
    } catch {
      return false;
    }
  }
  target.dispatchEvent(event);
  return true;
}
function ImageAttachmentButton({ input }) {
  const pickerRef = import_react46.default.useRef(null);
  const locked = !input || ["submitting", "adjudicating"].includes(input.phase);
  const choose = function() {
    pickerRef.current?.click?.();
  };
  const selected = function(event) {
    const picker = event.currentTarget;
    const textarea = picker.closest?.("[data-composer-card]")?.querySelector?.("textarea");
    const files = Array.from(picker.files || []).filter((file) => file.type.startsWith("image/"));
    dispatchImageFiles(textarea, files);
    picker.value = "";
  };
  return import_react46.default.createElement(
    import_react46.default.Fragment,
    null,
    import_react46.default.createElement("button", {
      type: "button",
      className: "cpwb-image-attachment-button",
      disabled: locked,
      title: "\u6DFB\u52A0\u56FE\u7247",
      "aria-label": "\u6DFB\u52A0\u56FE\u7247",
      onClick: choose
    }, import_react46.default.createElement(I2, { size: 17, weight: "regular", "aria-hidden": true })),
    import_react46.default.createElement("input", {
      ref: pickerRef,
      className: "cpwb-image-attachment-input",
      type: "file",
      accept: "image/*",
      multiple: true,
      tabIndex: -1,
      "aria-hidden": true,
      onChange: selected
    })
  );
}
function registerImageAttachmentButton(ctx) {
  return ctx.slots.inject("conversation.input.left", function() {
    return ctx.slots.register({
      name: "conversation.input.left",
      id: "cpwb-image-attachment-button",
      order: 10
    }, ImageAttachmentButton);
  });
}

// src/client/sessionAdapter.js
var STANDARD_SESSION_SLOTS = Object.freeze([
  "conversation.view",
  "conversation.chat.node",
  "conversation.chat.commandview",
  "conversation.chat.turnTail",
  "conversation.chat.assistant-actions",
  "conversation.details.tool",
  "conversation.composer",
  "conversation.composer.bar",
  "conversation.composer.dock",
  "conversation.input.left",
  "conversation.input.right",
  "conversation.input.attachments",
  "conversation.input.plan",
  "conversation.input.model",
  "*"
]);
var KNOWLEDGE_SOURCES_KEY = "workbench-knowledge-sources";
var SOURCE_LINE = /^\[source id="([^"\r\n]*)" document-id="([^"\r\n]*)" file="([^"\r\n]*)" locator="([^"\r\n]*)"\]$/gm;
function decodeXmlAttribute(value) {
  const entities = {
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    "#13": "\r",
    "#10": "\n",
    "#9": "	"
  };
  return String(value).replace(/&(quot|amp|lt|gt|#13|#10|#9);/g, (match, entity) => entities[entity] ?? match);
}
function knowledgeContextFromEvent(event) {
  if (event?.type !== "user/message") return null;
  const source = event.data?.source;
  if (source?.kind !== "plugin" || source.plugin !== "dsh-cyberpunk-workbench" || source.form !== "recall") return null;
  const text = (Array.isArray(event.data?.content) ? event.data.content : []).filter((block) => block?.type === "text").map((block) => String(block.text ?? "")).join("\n");
  const open = text.indexOf("<knowledge_context>\n");
  const close = text.indexOf("</knowledge_context>", open + 1);
  if (open === -1 || close === -1) return null;
  const citations = [];
  SOURCE_LINE.lastIndex = 0;
  for (const match of text.slice(open, close).matchAll(SOURCE_LINE)) {
    const documentId = Number(match[2]);
    citations.push({
      ...Number.isSafeInteger(documentId) && documentId > 0 ? { documentId } : {},
      sourceId: decodeXmlAttribute(match[1]),
      originalName: decodeXmlAttribute(match[3]),
      locator: decodeXmlAttribute(match[4])
    });
  }
  if (citations.length === 0) return null;
  const documents = new Set(citations.map((citation) => citation.documentId ? "document:" + citation.documentId : "file:" + citation.originalName));
  return {
    version: 1,
    passageCount: citations.length,
    documentCount: documents.size,
    citations
  };
}
function locationTurn(location) {
  if (location?.kind === "turn" || location?.kind === "step") return location.turn?.turn;
  return void 0;
}
var knowledgeSourcesDefinition = {
  kind: KNOWLEDGE_SOURCES_KEY,
  match(event) {
    return knowledgeContextFromEvent(event) === null ? null : { id: String(event.seq), role: "start" };
  },
  start(_context, match) {
    return knowledgeContextFromEvent(match.event);
  },
  update(context) {
    return context.state;
  },
  buildLocationData(context, scope) {
    if (scope !== "turn" || !context.state) return null;
    const turn = locationTurn(context.start?.location);
    return turn === void 0 ? null : {
      kind: "turn",
      turn,
      key: KNOWLEDGE_SOURCES_KEY,
      value: context.state
    };
  }
};
function selectKnowledgeSources(owner) {
  const value = owner?.turn?.data?.get?.(KNOWLEDGE_SOURCES_KEY);
  return Array.isArray(value?.citations) && value.citations.length > 0 ? value : null;
}
function registerKnowledgeSources(ctx, Component) {
  if (!ctx?.conversationEvents?.register || !ctx?.slots?.inject || !ctx?.slots?.register) {
    throw new TypeError("knowledge sources require DSH conversationEvents and slots services");
  }
  ctx.conversationEvents.register(knowledgeSourcesDefinition);
  return ctx.slots.inject("conversation.chat.turnTail", function() {
    return ctx.slots.register({
      name: "conversation.chat.turnTail",
      select: selectKnowledgeSources
    }, Component);
  });
}

// src/client/index.js
function injectCss(tagId, css) {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-cyberpunk-workbench";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
var store2 = getStore();
var navigation = createNavigationStore();
var inject = ["slots", "layout", "workspaces", "sessions", "connection", "conversation", "conversationEvents", "inputTriggers"];
function registerWorkbenchSettingsSection2(ctx, settingsStore = store2, options) {
  return registerWorkbenchSettingsSection(ctx, settingsStore, options);
}
function apply(ctx) {
  injectCss("dsh-cyberpunk-workbench/theme.css", theme_default);
  injectCss("dsh-cyberpunk-workbench/workbench.css", workbench_default);
  ctx.effect(function() {
    store2.actions.refresh().catch(function() {
    });
    return function() {
      store2.dispose();
    };
  });
  const openKnownSession = async function(sessionId) {
    return openKnownWorkbenchSession({
      sessionId,
      store: store2,
      sessions: ctx.sessions,
      workspaces: ctx.workspaces,
      navigation
    });
  };
  registerWorkbenchSettingsSection2(ctx, store2, { onOpenSession: openKnownSession });
  registerKnowledgeBaseReferenceSource(ctx, store2);
  registerImageAttachmentButton(ctx);
  registerModelIndicator(ctx);
  registerKnowledgeSources(ctx, KnowledgeSourcesTail);
  ctx.slots.inject("shell.overlay", function() {
    return ctx.slots.register({
      name: "shell.overlay",
      id: "cpwb-workbench-shell",
      order: 50,
      inject: function() {
        const openResult = function(result, projectId) {
          return openWorkbenchSession(ctx.sessions, result.sessionId, { workspaces: ctx.workspaces }).then(function() {
            navigation.openConversation(result.sessionId);
            if (projectId != null) return store2.actions.refreshProject(projectId, localDateKey());
            return result;
          });
        };
        const createProject = async function() {
          const path = await ctx.workspaces.pickDirectory();
          if (!path) return null;
          const ws = await ctx.workspaces.create({ path });
          const workspaceId = ws && ws.workspaceId;
          if (!workspaceId) throw new Error("DSH \u672A\u8FD4\u56DE workspaceId\uFF0C\u65E0\u6CD5\u521B\u5EFA\u9879\u76EE");
          const created = await store2.actions.createProject({
            name: ws.title || ws.name || path.split(/[\\/]/).filter(Boolean).pop() || path,
            path: ws.path || path,
            workspaceId
          });
          await store2.actions.refresh();
          return created;
        };
        return {
          store: store2,
          navigation,
          sessions: ctx.sessions,
          connection: ctx.connection,
          conversation: ctx.conversation,
          workspaces: ctx.workspaces,
          createProject,
          openActivatedSession(result) {
            const projectId = result.scope?.kind === "project" ? result.scope.id : null;
            return openResult(result, projectId);
          },
          openSession: openKnownSession,
          openKnowledge: navigation.openKnowledge,
          openSessions: navigation.openSessions,
          enterProject(projectId, options = {}) {
            if (projectId == null) return Promise.reject(new Error("\u9879\u76EE\u7F3A\u5C11 projectId"));
            if (!options.newSession && options.resumeSessionId) return openKnownSession(options.resumeSessionId);
            store2.actions.startDraft({ scope: { kind: "project", id: projectId } });
            navigation.openDraft();
            return Promise.resolve({ draft: true, scope: { kind: "project", id: projectId } });
          },
          enterKnowledgeBase(knowledgeBaseId, options = {}) {
            if (knowledgeBaseId == null) return Promise.reject(new Error("\u77E5\u8BC6\u5E93\u7F3A\u5C11 knowledgeBaseId"));
            if (!options.newSession && options.sessionId) return openKnownSession(options.sessionId);
            store2.actions.startDraft({ scope: { kind: "knowledge_base", id: knowledgeBaseId } });
            navigation.openDraft();
            return Promise.resolve({ draft: true, scope: { kind: "knowledge_base", id: knowledgeBaseId } });
          }
        };
      }
    }, WorkbenchShell);
  });
}

		return module.exports;
	},
});
