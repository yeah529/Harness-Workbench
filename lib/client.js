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
  apply: () => apply,
  getStore: () => getStore,
  inject: () => inject,
  registerWorkbenchSettingsSection: () => registerWorkbenchSettingsSection2
});
module.exports = __toCommonJS(index_exports);
var import_react32 = __toESM(require("react"), 1);

// src/client/theme.css
var theme_default = ':root {\n  color-scheme: dark;\n  --cpwb-bg: #07090f;\n  --cpwb-surface-base: #07090f;\n  --cpwb-surface-panel: #0c1016;\n  --cpwb-surface-raised: #111720;\n  --cpwb-surface-overlay: #171e28;\n  --cpwb-surface-input: #0a0e14;\n  --cpwb-yellow: #fce700;\n  --cpwb-amber: #ffb51b;\n  --cpwb-cyan: #4de8f4;\n  --cpwb-red: #e64a58;\n  --cpwb-magenta: #ff4965;\n  --cpwb-green: #52d2a5;\n  --cpwb-text: #f1eee6;\n  --cpwb-text-secondary: #aeb8c5;\n  --cpwb-muted: #748296;\n  --cpwb-border: rgba(77, 232, 244, .18);\n  --cpwb-border-strong: rgba(77, 232, 244, .38);\n  --cpwb-amber-soft: rgba(255, 181, 27, .1);\n  --cpwb-cyan-soft: rgba(77, 232, 244, .09);\n  --cpwb-danger-soft: rgba(230, 74, 88, .12);\n  --cpwb-shadow-1: 0 18px 52px rgba(0, 0, 0, .34);\n  --cpwb-shadow-2: 0 30px 90px rgba(0, 0, 0, .58);\n  --cpwb-cut-sm: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);\n  --cpwb-cut-lg: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 14px 100%, 0 calc(100% - 14px));\n  --cpwb-code: "SF Mono", "Roboto Mono", Consolas, monospace;\n}\n\nhtml,\nbody {\n  background-color: var(--cpwb-surface-base);\n  color: var(--cpwb-text);\n}\n\n/* Workbench is a visual skin around the native rc.2 state machine. Override\n   public DSH design tokens, not generated component class names. */\nbody:has(.cpwb-app-shell) {\n  color-scheme: dark;\n  --dsw-alias-bg-base: var(--cpwb-surface-base);\n  --dsw-alias-bg-layer-1: var(--cpwb-surface-panel);\n  --dsw-alias-bg-layer-2: var(--cpwb-surface-raised);\n  --dsw-alias-bg-layer-3: var(--cpwb-surface-overlay);\n  --dsw-alias-bg-mask-1: rgba(1, 3, 7, .78);\n  --dsw-alias-bg-mask-2: rgba(1, 3, 7, .62);\n  --dsw-alias-bg-overlay: #1d2632;\n  --dsw-alias-border-l1: var(--cpwb-border);\n  --dsw-alias-border-l2: rgba(77, 232, 244, .25);\n  --dsw-alias-border-l2-darkmode-thin: rgba(77, 232, 244, .2);\n  --dsw-alias-border-l3: var(--cpwb-border-strong);\n  --dsw-alias-border-l4: rgba(77, 232, 244, .5);\n  --dsw-alias-brand-primary: var(--cpwb-amber);\n  --dsw-alias-brand-primary-invert: #090b10;\n  --dsw-alias-brand-text: var(--cpwb-amber);\n  --dsw-alias-label-primary: var(--cpwb-text);\n  --dsw-alias-label-primary-bluish: var(--cpwb-text);\n  --dsw-alias-label-primary-dimmed: #d4d8de;\n  --dsw-alias-label-secondary: var(--cpwb-text-secondary);\n  --dsw-alias-label-tertiary: var(--cpwb-muted);\n  --dsw-alias-label-caption: #617085;\n  --dsw-alias-label-dimmed: #4d5868;\n  --dsw-alias-button-primary-fill: var(--cpwb-amber);\n  --dsw-alias-button-primary-hover: #ffd05b;\n  --dsw-alias-button-primary-dimmed: #5d4b22;\n  --dsw-alias-button-info-fill: var(--cpwb-cyan);\n  --dsw-alias-button-info-hover: #82f2fa;\n  --dsw-alias-button-elevated-fill: var(--cpwb-surface-overlay);\n  --dsw-alias-button-floating-fill: var(--cpwb-surface-raised);\n  --dsw-alias-button-floating-hover: #1a2632;\n  --dsw-alias-button-ghost-active-border: var(--cpwb-border-strong);\n  --dsw-alias-button-ghost-active-fill: var(--cpwb-cyan-soft);\n  --dsw-alias-button-ghost-active-hover: rgba(77, 232, 244, .14);\n  --dsw-alias-interactive-bg-hover: var(--cpwb-cyan-soft);\n  --dsw-alias-interactive-bg-hover-accent: rgba(77, 232, 244, .15);\n  --dsw-alias-interactive-bg-active: var(--cpwb-amber-soft);\n  --dsw-alias-interactive-bg-hover-solid: #19222d;\n  --dsw-alias-interactive-bg-hover-danger: var(--cpwb-danger-soft);\n  --dsw-alias-state-business-primary: var(--cpwb-cyan);\n  --dsw-alias-state-business-tertiary: rgba(77, 232, 244, .13);\n  --dsw-alias-state-error-primary: #ff7183;\n  --dsw-alias-state-error-secondary: var(--cpwb-red);\n  --dsw-alias-state-success-primary: var(--cpwb-green);\n  --dsw-alias-state-success-secondary: #72dfbb;\n  --dsw-alias-state-success-tertiary: rgba(82, 210, 165, .12);\n  --dsw-alias-state-warn-primary: var(--cpwb-amber);\n  --dsw-alias-state-warn-secondary: #ffd05b;\n  --dsw-alias-state-warn-tertiary: var(--cpwb-amber-soft);\n  --dsw-alias-markdown-code-block: #080c12;\n  --dsw-alias-markdown-code-block-banner: #0d131c;\n  --dsw-alias-markdown-inline-code: #151c26;\n  --dsw-alias-scrollbar-bg-l1: #263140;\n  --dsw-alias-scrollbar-bg-l2: #303d4d;\n  --dsw-alias-scrollbar-hover-l1: var(--cpwb-cyan);\n  --dsw-alias-scrollbar-hover-l2: var(--cpwb-cyan);\n  --dsw-specific-bubble: #121a24;\n  --dsw-specific-bubble-highlight: rgba(77, 232, 244, .12);\n  --dsw-specific-input-major: var(--cpwb-surface-input);\n  --dsw-specific-menu: var(--cpwb-surface-overlay);\n  --dsw-specific-selector: #141b25;\n  --dsw-specific-sidebar-fill: var(--cpwb-surface-panel);\n  --dsw-specific-sidebar-nav-item-active: var(--cpwb-amber-soft);\n  --dsw-specific-sidebar-nav-item-hover: var(--cpwb-cyan-soft);\n  --dsw-shadow-lv3: var(--cpwb-shadow-2);\n}\n\nbody:has(.cpwb-app-shell) [data-slot="conversation"] {\n  --dsw-static-deepseek-500: var(--cpwb-amber);\n  --dsw-static-deepseek-200: #ffd05b;\n  color: var(--cpwb-text);\n  background:\n    radial-gradient(circle at 82% 0%, rgba(101, 24, 37, .17), transparent 35%),\n    var(--cpwb-surface-base);\n}\n\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"] {\n  color: var(--cpwb-text);\n  border: 1px solid var(--cpwb-border-strong);\n  border-radius: 0;\n  background: var(--cpwb-surface-raised);\n  box-shadow: var(--cpwb-shadow-2);\n  clip-path: var(--cpwb-cut-lg);\n}\n\n/* rc.2 settings selectors and theme cubes otherwise retain light-mode fills\n   when the host preference is "follow system". Keep their semantics native,\n   but make the controls legible inside the Workbench dark shell. */\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:has(nav button[aria-current]) button[aria-haspopup="menu"] {\n  color: var(--cpwb-text) !important;\n  border-color: var(--cpwb-border-strong) !important;\n  background: var(--cpwb-surface-panel) !important;\n}\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:has(nav button[aria-current]) button[aria-pressed="false"] {\n  color: var(--cpwb-text-secondary) !important;\n  border-color: var(--cpwb-border) !important;\n  background: var(--cpwb-surface-panel) !important;\n}\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:has(nav button[aria-current]) button[aria-pressed="true"] {\n  color: #090b10 !important;\n  border-color: var(--cpwb-amber) !important;\n  background: var(--cpwb-amber) !important;\n}\n\nbody:has(.cpwb-app-shell) :where(button, a, input, select, textarea):focus-visible,\n:where(.cpwb-btn, .cpwb-tab, .cpwb-toggle, .cpwb-close, .cpwb-x, .cpwb-kb-name, .cpwb-folder-add, .cpwb-section-action, .cpwb-card-new, .cpwb-kcard-new, .cpwb-sidebar-new, .cpwb-sidebar-nav-item, .cpwb-sidebar-recent, .cpwb-sidebar-all):focus-visible {\n  outline: 2px solid var(--cpwb-cyan);\n  outline-offset: 3px;\n}\n\n.cpwb-status { padding: 7px 9px; margin-bottom: 9px; font-size: 11px; border-left: 2px solid currentColor; }\n.cpwb-status-loading { color: var(--cpwb-cyan); }\n.cpwb-status-success { color: var(--cpwb-green); }\n.cpwb-status-error { color: var(--cpwb-magenta); }\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.001ms !important; }\n}\n';

// src/client/workbench.css
var workbench_default = '/* Deepseek Harness Workbench \u2014 adaptive Cyberpunk 2077 / precision-glass UI */\n\n.cpwb-home,\n.cpwb-panel,\n.cpwb-wordmark-launcher,\n.cpwb-rail-reopen { font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }\n\n.cpwb-home {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  display: grid;\n  grid-template-columns: clamp(176px, 15vw, 236px) minmax(0, 1fr);\n  overflow: hidden;\n  color: var(--cpwb-text);\n  background:\n    radial-gradient(circle at 74% 0%, rgba(125, 26, 42, .32), transparent 40%),\n    radial-gradient(circle at 14% 88%, rgba(0, 240, 255, .07), transparent 32%),\n    linear-gradient(122deg, #08080d 0%, #10090d 44%, #09090f 100%);\n}\n\n/* Native SettingsRoot remains the sole settings owner. Its trigger stays\n   mounted for the Workbench sidebar action to invoke, but is not rendered as\n   a second floating control. */\n.cpwb-workbench-overlay { position: absolute; inset: 0; z-index: 30; pointer-events: none; }\n.cpwb-workbench-overlay.cpwb-home { pointer-events: auto; }\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] { pointer-events: none; }\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] { visibility: hidden; }\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] * {\n  visibility: hidden !important; pointer-events: none !important;\n}\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.settings"] {\n  visibility: visible !important; pointer-events: auto !important;\n}\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.settings"] * {\n  visibility: visible !important; pointer-events: auto !important;\n}\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.settings"] > button {\n  position: fixed;\n  left: -9999px;\n  bottom: auto;\n  width: 1px;\n  height: 1px;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.brand.mark"],\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.brand.name"],\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.workspaces"],\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.workspaces.directoryFlow"],\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] [data-slot="sidebar.footer.action"] {\n  display: none !important;\n}\nbody:has(.cpwb-workbench-overlay) [data-slot="sidebar"] > *:not([data-slot="sidebar.settings"]) {\n  visibility: hidden; pointer-events: none;\n}\n.cpwb-home::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  opacity: .22;\n  background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,.035) 1px, transparent 1px);\n  background-size: 4px 4px, 72px 72px;\n  mask-image: linear-gradient(to bottom, #000, transparent 72%);\n}\n.cpwb-home-noise {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  opacity: .28;\n  mix-blend-mode: screen;\n  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(255,255,255,.012) 3px 4px);\n}\n\n.cpwb-home-identity {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n  overflow: hidden;\n  padding: 34px 22px 28px;\n  border-right: 1px solid rgba(0, 240, 255, .23);\n  background: linear-gradient(180deg, rgba(8,10,15,.88), rgba(9,8,12,.58));\n  backdrop-filter: blur(18px) saturate(130%);\n  box-shadow: 16px 0 50px rgba(0,0,0,.3);\n}\n.cpwb-home-identity::after {\n  content: "";\n  position: absolute;\n  right: -2px;\n  top: 9%;\n  width: 3px;\n  height: 92px;\n  background: var(--cpwb-cyan);\n  box-shadow: 0 0 18px rgba(0,240,255,.45);\n}\n.cpwb-brand-mark { display: flex; gap: 5px; width: 72px; height: 22px; margin-bottom: 18px; }\n.cpwb-brand-mark i { flex: 1; border-top: 3px solid var(--cpwb-red); border-bottom: 1px solid var(--cpwb-red); transform: skewX(-28deg); opacity: .86; }\n.cpwb-brand-name { font: 800 clamp(15px, 1.2vw, 19px)/1.05 var(--cpwb-code); letter-spacing: .08em; }\n.cpwb-brand-name span { display: block; margin-top: 8px; color: var(--cpwb-cyan); font-size: 9px; font-weight: 500; letter-spacing: .18em; }\n.cpwb-home-telemetry { display: grid; gap: 10px; margin-top: auto; font: 500 9px/1.2 var(--cpwb-code); color: var(--cpwb-muted); letter-spacing: .12em; }\n.cpwb-home-telemetry span { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-top: 1px solid rgba(0,240,255,.16); }\n.cpwb-home-telemetry b { color: var(--cpwb-cyan); font-size: 16px; }\n.cpwb-brand-codes { margin-top: 28px; color: rgba(129,218,226,.54); font: 500 8px/1.7 var(--cpwb-code); letter-spacing: .1em; }\n\n.cpwb-home-main { position: relative; z-index: 1; min-width: 0; overflow: auto; padding: clamp(30px, 4vw, 68px) clamp(26px, 5vw, 82px) 86px; scrollbar-color: rgba(0,240,255,.3) transparent; }\n.cpwb-hero { position: relative; max-width: 1200px; margin: 0 auto clamp(44px, 6vh, 72px); padding: 6px 0 14px clamp(20px, 2.3vw, 36px); border-left: 2px solid var(--cpwb-cyan); }\n.cpwb-hero::before, .cpwb-hero::after { content: ""; position: absolute; left: 0; width: 17px; height: 1px; background: var(--cpwb-cyan); }\n.cpwb-hero::before { top: 0; }.cpwb-hero::after { bottom: 0; }\n.cpwb-hero-kicker { margin-bottom: 16px; color: var(--cpwb-cyan); font: 600 clamp(9px, .78vw, 12px)/1.2 var(--cpwb-code); letter-spacing: .24em; text-transform: uppercase; }\n.cpwb-hero h1 { display: grid; margin: 0; font-size: clamp(35px, 5vw, 78px); font-weight: 820; line-height: .91; letter-spacing: -.055em; }\n.cpwb-hero h1 span { width: max-content; max-width: 100%; }\n.cpwb-hero-accent { color: var(--cpwb-amber); text-shadow: 0 0 32px rgba(255,183,37,.12); }\n.cpwb-hero p { margin: 22px 0 0; color: rgba(241,238,230,.69); font-size: clamp(14px, 1.25vw, 19px); font-weight: 520; letter-spacing: .18em; }\n\n.cpwb-home-section { max-width: 1200px; margin: 0 auto 52px; }\n.cpwb-home-section > header { display: flex; align-items: flex-end; justify-content: space-between; gap: 22px; margin-bottom: 19px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,240,255,.25); }\n.cpwb-home-section > header > div > span { color: var(--cpwb-cyan); font: 600 9px/1.2 var(--cpwb-code); letter-spacing: .2em; }\n.cpwb-home-section h2 { margin: 6px 0 0; font-size: clamp(19px, 1.6vw, 25px); font-weight: 690; letter-spacing: .035em; }\n.cpwb-folder-add, .cpwb-section-action, .cpwb-inline-create button {\n  appearance: none;\n  color: var(--cpwb-cyan);\n  border: 1px solid rgba(0,240,255,.45);\n  background: rgba(6,16,21,.64);\n  cursor: pointer;\n  transition: color .18s ease, background .18s ease, transform .18s ease, box-shadow .18s ease;\n}\n.cpwb-folder-add { position: relative; display: grid; grid-template-columns: 34px 1fr; align-items: center; gap: 8px; min-width: 126px; padding: 8px 12px 8px 8px; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); }\n.cpwb-folder-add > span { display: grid; place-items: center; grid-row: 1 / span 2; position: relative; }\n.cpwb-folder-add b { position: absolute; top: 2px; left: 30px; color: var(--cpwb-amber); font: 800 17px/1 var(--cpwb-code); }\n.cpwb-folder-add em { font: 600 10px/1 var(--cpwb-code); font-style: normal; letter-spacing: .06em; }\n.cpwb-folder-add:hover, .cpwb-section-action:hover { color: #071014; background: var(--cpwb-cyan); box-shadow: 0 0 22px rgba(0,240,255,.22); transform: translateY(-2px); }\n.cpwb-folder-add:disabled { cursor: wait; opacity: .55; }\n\n.cpwb-project-grid { display: grid; grid-template-columns: repeat(3, minmax(240px, 1fr)); gap: clamp(14px, 1.5vw, 23px); }\n.cpwb-project-card {\n  --card-line: rgba(0,240,255,.52);\n  position: relative;\n  min-height: clamp(225px, 23vw, 290px);\n  overflow: hidden;\n  padding: 21px;\n  border: 1px solid var(--card-line);\n  color: var(--cpwb-text);\n  background: linear-gradient(150deg, rgba(19,23,31,.8), rgba(9,9,14,.72));\n  backdrop-filter: blur(18px) saturate(125%);\n  clip-path: polygon(0 0, calc(100% - 23px) 0, 100% 23px, 100% 100%, 15px 100%, 0 calc(100% - 15px));\n  box-shadow: 0 20px 48px rgba(0,0,0,.3), inset 0 1px rgba(255,255,255,.025);\n  cursor: pointer;\n  animation: cpwb-rise .48s both;\n  animation-delay: calc(var(--cpwb-card-index) * 55ms);\n  transition: transform .24s cubic-bezier(.2,.8,.2,1), border-color .2s ease, box-shadow .24s ease, background .2s ease;\n}\n.cpwb-project-card::after { content: ""; position: absolute; right: 0; top: 0; width: 42%; height: 5px; background: var(--cpwb-cyan); transform-origin: right; transform: scaleX(.12); transition: transform .25s ease, background .25s ease; }\n.cpwb-project-card:hover, .cpwb-project-card:focus-visible { --card-line: rgba(255,183,37,.95); transform: translateY(-7px); background: linear-gradient(150deg, rgba(46,34,25,.9), rgba(12,11,16,.84)); box-shadow: 0 27px 64px rgba(0,0,0,.45), 0 0 0 1px rgba(255,183,37,.16), 0 0 30px rgba(255,183,37,.07); outline: none; }\n.cpwb-project-card:hover::after, .cpwb-project-card:focus-visible::after { transform: scaleX(1); background: var(--cpwb-amber); }\n.cpwb-card-scan { position: absolute; inset: 0; pointer-events: none; opacity: 0; background: linear-gradient(to bottom, transparent, rgba(0,240,255,.08), transparent); transform: translateY(-100%); }\n.cpwb-project-card:hover .cpwb-card-scan { opacity: 1; animation: cpwb-scan 1.4s ease-out; }\n.cpwb-card-topline { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--cpwb-cyan); font: 600 8px/1 var(--cpwb-code); letter-spacing: .15em; }\n.cpwb-card-top-actions { display: flex; align-items: center; gap: 5px; }\n.cpwb-card-state { color: var(--cpwb-green); }\n.cpwb-card-manage { appearance: none; display: grid; place-items: center; width: 25px; height: 23px; padding: 0; color: rgba(0,240,255,.7); border: 1px solid rgba(0,240,255,.2); background: rgba(4,12,16,.56); cursor: pointer; transition: color .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease; }\n.cpwb-card-manage:hover, .cpwb-card-manage:focus-visible { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 14px rgba(0,240,255,.2); outline: none; }\n.cpwb-card-manage-danger:hover, .cpwb-card-manage-danger:focus-visible { color: #fff; border-color: var(--cpwb-magenta); background: var(--cpwb-magenta); box-shadow: 0 0 14px rgba(255,42,109,.22); }\n.cpwb-card-manage:disabled { cursor: not-allowed; opacity: .35; }\n.cpwb-card-symbol { display: grid; place-items: center; width: 60px; height: 60px; margin: 34px 0 20px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.3); background: rgba(0,240,255,.04); clip-path: polygon(0 0, 78% 0, 100% 22%, 100% 100%, 0 100%); transition: color .2s ease, transform .25s ease; }\n.cpwb-project-card:hover .cpwb-card-symbol { color: var(--cpwb-amber); transform: rotate(-3deg) scale(1.05); }\n.cpwb-card-copy h3 { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: clamp(18px, 1.65vw, 25px); letter-spacing: -.02em; }\n.cpwb-card-copy p { margin: 8px 0 5px; overflow: hidden; color: var(--cpwb-muted); font: 500 10px/1.4 var(--cpwb-code); text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-card-copy span { color: rgba(224,229,236,.5); font-size: 10px; }\n.cpwb-card-actions { position: absolute; left: 21px; right: 21px; bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px solid rgba(0,240,255,.14); }\n.cpwb-card-enter { color: var(--cpwb-cyan); font: 650 10px/1 var(--cpwb-code); letter-spacing: .08em; }\n.cpwb-card-enter b { color: var(--cpwb-amber); font-size: 15px; }\n.cpwb-card-new, .cpwb-kcard-new { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 7px 9px; color: var(--cpwb-text); border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.025); font: 600 9px/1 var(--cpwb-code); cursor: pointer; }\n.cpwb-card-new > svg { display: block; flex: 0 0 auto; }\n.cpwb-card-new:hover, .cpwb-kcard-new:hover { color: #0b0b0d; border-color: var(--cpwb-amber); background: var(--cpwb-amber); }\n.cpwb-project-modal-note { margin-top: -2px; padding-left: 10px; border-left: 2px solid rgba(0,240,255,.48); }\n\n.cpwb-kb-section { padding-top: 2px; }\n.cpwb-section-action { padding: 9px 13px; font: 600 10px/1 var(--cpwb-code); }\n.cpwb-inline-create { display: flex; gap: 6px; }\n.cpwb-inline-create input { min-width: 160px; padding: 8px 10px; color: var(--cpwb-text); border: 1px solid rgba(0,240,255,.35); background: rgba(0,0,0,.35); outline: none; }\n.cpwb-inline-create input:focus { border-color: var(--cpwb-cyan); box-shadow: 0 0 0 2px rgba(0,240,255,.1); }\n.cpwb-inline-create button { padding: 7px 9px; font-size: 10px; }\n.cpwb-knowledge-grid { display: grid; grid-template-columns: repeat(3, minmax(220px, 1fr)); gap: 13px; }\n.cpwb-knowledge-card { position: relative; display: grid; grid-template-columns: 52px minmax(0,1fr) auto; align-items: center; gap: 14px; min-height: 112px; padding: 18px; border: 1px solid rgba(0,240,255,.26); background: rgba(13,16,22,.64); backdrop-filter: blur(16px); clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 0 100%); cursor: pointer; animation: cpwb-rise .42s both; animation-delay: calc(var(--cpwb-card-index) * 45ms); transition: transform .2s ease, border-color .2s ease, background .2s ease; }\n.cpwb-knowledge-card:hover, .cpwb-knowledge-card:focus-visible { transform: translateY(-3px); border-color: var(--cpwb-cyan); background: rgba(9,28,34,.76); outline: none; }\n.cpwb-kcard-index { position: absolute; top: 7px; right: 10px; color: rgba(0,240,255,.5); font: 500 7px/1 var(--cpwb-code); letter-spacing: .12em; }\n.cpwb-kcard-icon { display: grid; place-items: center; width: 48px; height: 48px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.34); }\n.cpwb-kcard-copy { min-width: 0; }.cpwb-kcard-copy h3 { margin: 0; overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }.cpwb-kcard-copy p { margin: 5px 0; overflow: hidden; color: var(--cpwb-muted); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }.cpwb-kcard-copy span { color: rgba(230,235,240,.43); font-size: 8px; }\n.cpwb-kcard-new { align-self: end; }\n.cpwb-home-loading, .cpwb-home-error, .cpwb-empty { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 110px; color: var(--cpwb-muted); border: 1px dashed rgba(0,240,255,.2); background: rgba(0,0,0,.12); font-size: 12px; }\n.cpwb-home-loading i { width: 8px; height: 8px; background: var(--cpwb-cyan); box-shadow: 0 0 12px var(--cpwb-cyan); animation: cpwb-pulse 1s infinite alternate; }\n.cpwb-home-error { justify-content: flex-start; max-width: 1200px; min-height: auto; margin: 0 auto 28px; padding: 12px 15px; color: #ff7188; border-style: solid; border-color: rgba(255,42,109,.4); }\n.cpwb-home-error span { flex: 1; }.cpwb-home-error button { color: var(--cpwb-text); border: 1px solid currentColor; background: transparent; cursor: pointer; }\n.cpwb-home-footer { position: absolute; z-index: 2; left: clamp(176px, 15vw, 236px); right: 0; bottom: 0; display: flex; justify-content: space-between; padding: 9px clamp(26px,5vw,82px); color: rgba(0,240,255,.5); border-top: 1px solid rgba(0,240,255,.14); background: rgba(7,7,11,.76); backdrop-filter: blur(10px); font: 500 7px/1 var(--cpwb-code); letter-spacing: .16em; }\n\n/* Persistent lower-left wordmark */\n.cpwb-wordmark-launcher { position: relative; z-index: 1; display: grid; box-sizing: border-box; width: 100%; padding: 9px 12px 8px 19px; overflow: hidden; color: var(--cpwb-text); border: 0; border-left: 2px solid var(--cpwb-cyan); background: linear-gradient(100deg, rgba(9,11,16,.88), rgba(9,11,16,.35)); backdrop-filter: blur(12px); text-align: left; clip-path: polygon(0 0, 92% 0, 100% 32%, 100% 100%, 0 100%); }\n.cpwb-wordmark-launcher::before { content: ""; position: absolute; left: 5px; top: 7px; bottom: 7px; width: 2px; background: var(--cpwb-amber); transform: skewY(-28deg); }\n.cpwb-wordmark-main { font: 850 16px/.9 var(--cpwb-code); letter-spacing: .1em; transform: skewX(-7deg); }.cpwb-wordmark-sub { margin-top: 5px; color: var(--cpwb-cyan); font: 600 7px/1 var(--cpwb-code); letter-spacing: .28em; }\n.cpwb-wordmark-compact { display: none; color: var(--cpwb-text); font: 900 21px/.9 var(--cpwb-code); text-align: center; transform: skewX(-9deg); }\n\n/* Unified Workbench shell: one persistent global sidebar, one center page. */\n.cpwb-app-shell {\n  position: absolute;\n  z-index: 34;\n  inset: 0;\n  display: grid;\n  grid-template-columns: 248px minmax(0, 1fr);\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n  color: var(--cpwb-text);\n  background: #07090f;\n  pointer-events: none;\n}\n.cpwb-global-sidebar {\n  --cpwb-logo-cut: #080a10;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n  padding: 18px 15px 14px;\n  box-sizing: border-box;\n  overflow: hidden;\n  border-right: 1px solid rgba(77, 232, 244, .25);\n  background:\n    linear-gradient(180deg, rgba(11, 14, 20, .96), rgba(7, 9, 15, .98)),\n    repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,.012) 3px 4px);\n  box-shadow: 20px 0 54px rgba(0, 0, 0, .32);\n  pointer-events: auto;\n}\n.cpwb-sidebar-primary { flex: 0 0 auto; }\n.cpwb-sidebar-product { display: grid; gap: 5px; margin: 2px 7px 19px; color: #f0eee8; font: 780 14px/1 var(--cpwb-code); letter-spacing: .13em; }\n.cpwb-sidebar-product small { color: var(--cpwb-cyan); font-size: 7px; font-weight: 600; letter-spacing: .24em; }\n.cpwb-sidebar-new,\n.cpwb-sidebar-nav-item,\n.cpwb-sidebar-recent,\n.cpwb-sidebar-all {\n  appearance: none;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  color: #8c99aa;\n  border: 1px solid transparent;\n  background: transparent;\n  cursor: pointer;\n  text-align: left;\n}\n.cpwb-sidebar-new { gap: 10px; min-height: 44px; padding: 0 13px; color: #090b11; border-color: var(--cpwb-amber); background: var(--cpwb-amber); font-size: 12px; font-weight: 750; clip-path: polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 0 100%); }\n.cpwb-sidebar-new:hover { filter: brightness(1.08); box-shadow: 0 0 24px rgba(255,181,27,.16); }\n.cpwb-sidebar-global-nav { display: grid; gap: 3px; margin-top: 12px; }\n.cpwb-sidebar-nav-item { position: relative; gap: 11px; min-height: 40px; padding: 0 12px; font-size: 11px; }\n.cpwb-sidebar-nav-item:hover,\n.cpwb-sidebar-nav-item.cpwb-active { color: #f1eee8; border-color: rgba(77,232,244,.18); background: linear-gradient(90deg, rgba(77,232,244,.1), transparent 82%); }\n.cpwb-sidebar-nav-item.cpwb-active::before { content: ""; position: absolute; left: -1px; top: 8px; bottom: 8px; width: 2px; background: var(--cpwb-amber); box-shadow: 0 0 10px rgba(255,181,27,.4); }\n.cpwb-sidebar-recents {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  margin-top: 21px;\n  overflow: hidden;\n  border-top: 1px solid rgba(77,232,244,.14);\n}\n.cpwb-sidebar-current { flex: 0 0 auto; margin-top: 16px; padding-bottom: 10px; overflow: hidden; border-top: 1px solid rgba(77,232,244,.18); border-bottom: 1px solid rgba(77,232,244,.12); background: linear-gradient(110deg, rgba(77,232,244,.045), transparent 72%); }\n.cpwb-sidebar-container-name { margin: 0 8px 7px; overflow: hidden; color: #f0eee8; font-size: 12px; font-weight: 680; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-sidebar-current-list { display: grid; gap: 1px; }\n.cpwb-sidebar-current .cpwb-sidebar-all { margin: 7px 8px 0; width: calc(100% - 16px); }\n.cpwb-sidebar-section-label { display: flex; align-items: center; justify-content: space-between; flex: 0 0 auto; padding: 14px 8px 9px; color: #69778a; font: 650 8px/1 var(--cpwb-code); letter-spacing: .18em; text-transform: uppercase; }\n.cpwb-sidebar-section-label b { color: var(--cpwb-cyan); font-size: 9px; }\n.cpwb-sidebar-recent-scroll { flex: 1 1 auto; min-height: 0; overflow-x: hidden; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(77,232,244,.3) transparent; }\n.cpwb-sidebar-recent { gap: 9px; padding: 9px 8px; }\n.cpwb-sidebar-recent > svg { flex: 0 0 auto; color: #536377; }\n.cpwb-sidebar-recent > span { display: grid; min-width: 0; gap: 4px; }\n.cpwb-sidebar-recent strong { overflow: hidden; color: #b8c1cd; font-size: 10px; font-weight: 560; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-sidebar-recent small { color: #596779; font: 600 7px/1 var(--cpwb-code); letter-spacing: .08em; }\n.cpwb-sidebar-recent:hover,\n.cpwb-sidebar-recent.cpwb-active { border-color: rgba(77,232,244,.16); background: rgba(77,232,244,.055); }\n.cpwb-sidebar-recent.cpwb-active strong { color: var(--cpwb-cyan); }\n.cpwb-sidebar-all { justify-content: center; min-height: 34px; margin-top: 5px; color: var(--cpwb-cyan); border-style: dashed; border-color: rgba(77,232,244,.22); font: 600 8px/1 var(--cpwb-code); letter-spacing: .09em; }\n.cpwb-sidebar-empty { margin: 12px 8px; color: #536174; font-size: 10px; }\n.cpwb-sidebar-fixed-footer {\n  display: grid;\n  flex: 0 0 auto;\n  gap: 9px;\n  padding-top: 10px;\n  border-top: 1px solid rgba(77,232,244,.16);\n  background: #080a10;\n}\n.cpwb-sidebar-settings-seat { flex: 0 0 38px; min-height: 38px; pointer-events: none; }\n.cpwb-sidebar-fixed-footer .cpwb-sidebar-brand-footer { margin: 0; padding-top: 8px; background: transparent; }\n.cpwb-sidebar-wordmark svg { display: block; width: min(100%, 190px); height: auto; }\n.cpwb-workbench-stage { position: relative; min-width: 0; min-height: 0; overflow: hidden; pointer-events: none; }\n.cpwb-workbench-stage > .cpwb-home,\n.cpwb-workbench-stage > .cpwb-workbench-page { pointer-events: auto; }\n.cpwb-workbench-page { position: absolute; inset: 0; overflow: auto; padding: 42px; background: radial-gradient(circle at 75% 0, rgba(96,22,34,.25), transparent 38%), #090a10; }\n.cpwb-workbench-stage > .cpwb-home { grid-template-columns: minmax(0, 1fr); }\n.cpwb-workbench-stage .cpwb-home-footer { left: 0; }\n.cpwb-home-metrics { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 22px; color: #6f7c8e; font: 600 8px/1 var(--cpwb-code); letter-spacing: .12em; }\n.cpwb-home-metrics b { color: var(--cpwb-cyan); font-size: 12px; }\n.cpwb-knowledge-entry > button { appearance: none; display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 16px; width: 100%; padding: 19px 21px; color: #8c99aa; border: 1px solid rgba(77,232,244,.2); background: linear-gradient(105deg, rgba(77,232,244,.07), rgba(255,181,27,.025) 60%, transparent); cursor: pointer; text-align: left; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%); }\n.cpwb-knowledge-entry > button > svg:first-child { color: var(--cpwb-cyan); }\n.cpwb-knowledge-entry > button > svg:last-child { color: var(--cpwb-amber); }\n.cpwb-knowledge-entry > button > span { display: grid; gap: 5px; }\n.cpwb-knowledge-entry small { color: var(--cpwb-cyan); font: 600 8px/1 var(--cpwb-code); letter-spacing: .16em; }\n.cpwb-knowledge-entry strong { color: #f0eee8; font-size: 16px; }\n.cpwb-knowledge-entry em { color: #6e7b8d; font-size: 10px; font-style: normal; }\n.cpwb-knowledge-entry > button:hover { border-color: rgba(77,232,244,.5); background: linear-gradient(105deg, rgba(77,232,244,.12), rgba(255,181,27,.045) 60%, transparent); }\n.cpwb-page-header { display: flex; align-items: end; justify-content: space-between; gap: 28px; box-sizing: border-box; width: min(100%, 1180px); margin: 0 auto 26px; padding: 18px 22px 20px; border: 1px solid rgba(77,232,244,.18); border-left: 2px solid var(--cpwb-cyan); background: linear-gradient(105deg, rgba(8,13,19,.78), rgba(38,8,16,.38)); box-shadow: 0 18px 50px rgba(0,0,0,.24); clip-path: var(--cpwb-cut-sm); }\n.cpwb-page-header-main { min-width: 0; }\n.cpwb-page-header-stat { display: flex; align-items: baseline; gap: 6px; color: var(--cpwb-text-muted); font: 600 9px/1 var(--cpwb-code); white-space: nowrap; }.cpwb-page-header-stat strong { color: var(--cpwb-amber); font-size: 24px; }\n.cpwb-page-header span { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .2em; }\n.cpwb-page-header h1 { margin: 8px 0 5px; color: #f1eee8; font-size: clamp(25px, 3vw, 40px); letter-spacing: -.025em; }\n.cpwb-page-header p { margin: 0; color: #778598; font-size: 11px; }\n.cpwb-knowledge-center-body { max-width: 1180px; margin: 0 auto; }\n.cpwb-knowledge-center-body > div { display: grid; grid-template-columns: minmax(260px, .65fr) minmax(0, 1.35fr); gap: 14px; align-items: start; }\n.cpwb-knowledge-center-body .cpwb-section { padding: 17px; border: 1px solid rgba(77,232,244,.14); background: rgba(12,15,21,.72); backdrop-filter: blur(14px); }\n.cpwb-session-list-page { display: flex; flex-direction: column; }\n.cpwb-session-filters { display: grid; grid-template-columns: minmax(220px,1fr) 160px auto; gap: 10px; width: min(100%, 1180px); margin: 0 auto 18px; }\n.cpwb-session-filters label { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 0 12px; border: 1px solid rgba(77,232,244,.2); background: rgba(5,7,12,.62); }\n.cpwb-session-filters label svg { color: var(--cpwb-cyan); flex: 0 0 auto; }\n.cpwb-session-filters input,\n.cpwb-session-filters select { min-width: 0; min-height: 40px; color: #dfe4ea; border: 1px solid rgba(77,232,244,.2); background: rgba(5,7,12,.62); outline: none; }\n.cpwb-session-filters input { width: 100%; border: 0; background: transparent; }\n.cpwb-session-filters select { padding: 0 10px; }\n.cpwb-session-filters > button,\n.cpwb-session-pagination button { min-height: 40px; padding: 0 17px; color: #080a10; border: 1px solid var(--cpwb-amber); background: var(--cpwb-amber); cursor: pointer; font-weight: 700; }\n.cpwb-session-list { display: grid; gap: 7px; width: min(100%, 1180px); margin: 0 auto; }\n.cpwb-session-list-row { appearance: none; display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 13px; min-height: 62px; padding: 10px 15px; color: #8694a7; border: 1px solid rgba(77,232,244,.13); background: rgba(11,14,20,.72); cursor: pointer; text-align: left; }\n.cpwb-session-list-row > svg { color: var(--cpwb-cyan); }\n.cpwb-session-list-row > span { display: grid; gap: 5px; min-width: 0; }\n.cpwb-session-list-row strong { overflow: hidden; color: #dce2e9; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-session-list-row small { color: #607084; font: 600 8px/1 var(--cpwb-code); letter-spacing: .08em; }\n.cpwb-session-list-row time { color: #627084; font: 600 8px/1 var(--cpwb-code); }\n.cpwb-session-list-row:hover { border-color: rgba(77,232,244,.42); background: linear-gradient(90deg, rgba(77,232,244,.08), rgba(11,14,20,.72)); }\n.cpwb-session-list-empty { display: grid; place-items: center; gap: 10px; flex: 1; color: #607084; }\n.cpwb-session-pagination { display: flex; align-items: center; justify-content: space-between; width: min(100%, 1180px); margin: auto auto 0; padding-top: 18px; color: #657387; font-size: 10px; }\n.cpwb-session-pagination div { display: flex; gap: 8px; }\n.cpwb-session-pagination button { min-height: 32px; padding: 0 12px; color: var(--cpwb-cyan); border-color: rgba(77,232,244,.28); background: transparent; }\n.cpwb-session-pagination button:disabled { cursor: not-allowed; opacity: .35; }\n.cpwb-app-shell[data-page="conversation"] { background: transparent; }\n.cpwb-app-shell[data-page="conversation"] .cpwb-workbench-stage { overflow: visible; }\n.cpwb-session-chrome { position: absolute; inset: 0; pointer-events: none; }\n.cpwb-session-context-bar { position: absolute; z-index: 44; top: 12px; left: 14px; right: 14px; display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 39px; padding: 0 13px; color: var(--cpwb-text-secondary); border: 1px solid rgba(77,232,244,.2); background: linear-gradient(90deg, rgba(10,14,20,.88), rgba(10,13,18,.64)); box-shadow: inset 2px 0 var(--cpwb-cyan), 0 9px 28px rgba(0,0,0,.2); backdrop-filter: blur(16px) saturate(120%); clip-path: var(--cpwb-cut-sm); }\n.cpwb-has-context-rail .cpwb-session-context-bar { right: calc(var(--cpwb-rail-width, 320px) + 14px); }\n.cpwb-session-context-kind { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; white-space: nowrap; }\n.cpwb-session-context-identity, .cpwb-session-context-meta { display: flex; align-items: baseline; min-width: 0; gap: 10px; }.cpwb-session-context-identity { flex: 1; }.cpwb-session-context-meta { flex: 0 0 auto; }\n.cpwb-session-context-bar strong { min-width: 0; overflow: hidden; color: var(--cpwb-text); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-session-context-bar small { color: var(--cpwb-text-muted); font-size: 9px; white-space: nowrap; }\n.cpwb-session-context-bar em { color: var(--cpwb-amber); font: 600 8px/1 var(--cpwb-code); font-style: normal; white-space: nowrap; }\n.cpwb-session-subagent-trigger { appearance: none; display: inline-flex; align-items: center; gap: 6px; min-height: 27px; padding: 0 8px; color: var(--cpwb-cyan); border: 1px solid rgba(77,232,244,.26); background: rgba(77,232,244,.045); font: 650 7px/1 var(--cpwb-code); letter-spacing: .11em; clip-path: var(--cpwb-cut-sm); cursor: pointer; pointer-events: auto; }\n.cpwb-session-subagent-trigger b { min-width: 18px; color: #081014; background: var(--cpwb-cyan); padding: 3px 4px; text-align: center; }\n.cpwb-session-subagent-trigger:hover, .cpwb-session-subagent-trigger[aria-expanded="true"] { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 20px rgba(77,232,244,.18); }\n.cpwb-session-subagent-trigger:hover b, .cpwb-session-subagent-trigger[aria-expanded="true"] b { color: var(--cpwb-amber); background: #071014; }\n.cpwb-project-rail { position: absolute; z-index: 45; top: 0; right: 0; bottom: 0; display: flex; flex-direction: column; width: var(--cpwb-rail-width, 320px); min-width: 0; overflow: hidden; color: var(--cpwb-text); border-left: 1px solid rgba(77,232,244,.3); background: linear-gradient(180deg, rgba(12,16,22,.95), rgba(7,9,14,.98)); box-shadow: -22px 0 60px rgba(0,0,0,.38); backdrop-filter: blur(20px) saturate(125%); pointer-events: auto; }\n.cpwb-project-rail::before { content: ""; position: absolute; top: 0; left: 0; width: 38%; height: 2px; background: var(--cpwb-cyan); box-shadow: 0 0 13px rgba(77,232,244,.4); }\n.cpwb-project-rail-header { flex: 0 0 auto; padding: 21px 18px 16px; border-bottom: 1px solid rgba(77,232,244,.16); }\n.cpwb-project-rail-header > span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .2em; }\n.cpwb-project-rail-header h2 { margin: 8px 0 6px; overflow: hidden; color: #f1eee8; font-size: 17px; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-project-rail-header small { color: #607084; font: 600 8px/1 var(--cpwb-code); letter-spacing: .09em; }\n.cpwb-project-tool-tabs { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); flex: 0 0 auto; border-bottom: 1px solid rgba(77,232,244,.14); }\n.cpwb-project-tool-tabs button { position: relative; appearance: none; display: grid; justify-items: center; gap: 6px; min-width: 0; padding: 12px 3px 10px; color: #68778b; border: 0; background: transparent; cursor: pointer; }\n.cpwb-project-tool-tabs button svg { color: inherit; }\n.cpwb-project-tool-tabs button span { overflow: hidden; width: 100%; font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-project-tool-tabs button::after { content: ""; position: absolute; left: 18%; right: 18%; bottom: -1px; height: 2px; background: var(--cpwb-amber); transform: scaleX(0); transition: transform .18s ease; }\n.cpwb-project-tool-tabs button:hover,\n.cpwb-project-tool-tabs button.cpwb-active { color: var(--cpwb-amber); background: linear-gradient(to top, rgba(255,181,27,.07), transparent); }\n.cpwb-project-tool-tabs button.cpwb-active::after { transform: scaleX(1); box-shadow: 0 0 10px rgba(255,181,27,.35); }\n.cpwb-project-tool-body { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 15px; scrollbar-width: thin; scrollbar-color: rgba(77,232,244,.28) transparent; }\n.cpwb-context-list { display: grid; align-content: start; gap: 9px; }\n.cpwb-context-card { display: grid; gap: 6px; padding: 11px 12px; border: 1px solid rgba(77,232,244,.14); border-left: 2px solid rgba(77,232,244,.45); background: rgba(255,255,255,.018); clip-path: var(--cpwb-cut-sm); }\n.cpwb-context-card-primary { border-left-color: var(--cpwb-amber); background: linear-gradient(110deg, rgba(255,181,27,.065), rgba(77,232,244,.02)); }\n.cpwb-context-card > span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; }\n.cpwb-context-card > strong { overflow-wrap: anywhere; color: var(--cpwb-text); font-size: 11px; }\n.cpwb-context-card > small { color: var(--cpwb-text-muted); font-size: 9px; line-height: 1.45; }\n.cpwb-context-empty { padding: 28px 12px; color: var(--cpwb-text-muted); border: 1px dashed rgba(77,232,244,.2); text-align: center; font-size: 10px; }\n\n/* Right workbench inspector */\n.cpwb-rail-host { color: var(--cpwb-text); }\n.cpwb-rail { position: relative; display: flex; height: 100%; min-width: 0; filter: drop-shadow(-18px 0 35px rgba(0,0,0,.32)); }\n.cpwb-panel { display: flex; flex: 1; flex-direction: column; min-width: 0; height: 100%; overflow: hidden; border-left: 1px solid rgba(0,240,255,.34); background: linear-gradient(180deg, rgba(13,15,21,.94), rgba(8,9,13,.94)); backdrop-filter: blur(22px) saturate(125%); }\n.cpwb-panel::before { content: ""; position: absolute; top: 0; left: 0; width: 35%; height: 2px; background: var(--cpwb-cyan); box-shadow: 0 0 12px rgba(0,240,255,.35); }\n.cpwb-inspector-header { display: flex; align-items: center; justify-content: space-between; min-height: 68px; padding: 15px 15px 13px 18px; border-bottom: 1px solid rgba(0,240,255,.18); }\n.cpwb-inspector-heading { min-width: 0; }.cpwb-inspector-heading > span { color: var(--cpwb-cyan); font: 600 7px/1 var(--cpwb-code); letter-spacing: .19em; }.cpwb-inspector-heading h2 { margin: 7px 0 0; overflow: hidden; font-size: 15px; font-weight: 680; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-close { display: grid; place-items: center; width: 31px; height: 31px; color: var(--cpwb-muted); border: 1px solid rgba(0,240,255,.25); background: rgba(0,0,0,.16); cursor: pointer; font-size: 21px; }.cpwb-close:hover { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }\n.cpwb-tabs { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; border-bottom: 1px solid rgba(0,240,255,.15); }\n.cpwb-tab { position: relative; display: grid; justify-items: center; gap: 6px; min-width: 0; padding: 12px 3px 10px; color: #77859a; border: 0; background: transparent; cursor: pointer; font-size: 9px; }.cpwb-tab svg { width: 15px; height: 15px; }.cpwb-tab span { overflow: hidden; width: 100%; text-overflow: ellipsis; white-space: nowrap; }.cpwb-tab::after { content: ""; position: absolute; left: 16%; right: 16%; bottom: -1px; height: 2px; background: var(--cpwb-amber); transform: scaleX(0); transition: transform .18s ease; }.cpwb-tab:hover { color: var(--cpwb-text); }.cpwb-tab.cpwb-active { color: var(--cpwb-amber); background: linear-gradient(to top, rgba(255,183,37,.08), transparent); }.cpwb-tab.cpwb-active::after { transform: scaleX(1); box-shadow: 0 0 9px rgba(255,183,37,.35); }\n.cpwb-body { flex: 1; min-height: 0; overflow: auto; padding: 13px; scrollbar-width: thin; scrollbar-color: rgba(0,240,255,.25) transparent; }\n.cpwb-rail-divider { width: 7px; flex: 0 0 7px; cursor: ew-resize; background: transparent; outline: none; }.cpwb-rail-divider::after { content: ""; display: block; width: 1px; height: 100%; margin-left: 5px; background: rgba(0,240,255,.18); }.cpwb-rail-divider:hover::after, .cpwb-rail-divider:focus-visible::after { width: 2px; background: var(--cpwb-cyan); box-shadow: 0 0 12px rgba(0,240,255,.4); }\n.cpwb-rail-reopen { position: fixed; z-index: 58; right: 0; top: 42%; display: grid; justify-items: center; gap: 5px; padding: 13px 6px 11px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.45); border-right: 0; background: rgba(9,12,17,.9); backdrop-filter: blur(12px); cursor: pointer; clip-path: polygon(9px 0, 100% 0, 100% 100%, 0 100%, 0 9px); }.cpwb-rail-reopen b { writing-mode: vertical-rl; font: 600 7px/1 var(--cpwb-code); letter-spacing: .15em; }\n\n.cpwb-section { padding: 12px 0 15px; border-bottom: 1px solid rgba(0,240,255,.1); }.cpwb-section:first-child { padding-top: 1px; }.cpwb-section:last-child { border-bottom: 0; }\n.cpwb-section-head, .cpwb-row, .cpwb-addrow, .cpwb-toggle-row, .cpwb-citation-head, .cpwb-item, .cpwb-kb-row, .cpwb-upload-file { display: flex; align-items: center; gap: 8px; }.cpwb-section-head { justify-content: space-between; margin-bottom: 9px; }.cpwb-label { color: var(--cpwb-cyan); font: 650 9px/1 var(--cpwb-code); letter-spacing: .12em; text-transform: uppercase; }.cpwb-row, .cpwb-addrow { margin-bottom: 7px; }.cpwb-addrow .cpwb-input { flex: 1; min-width: 0; }\n.cpwb-input { box-sizing: border-box; width: 100%; min-height: 31px; padding: 7px 9px; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.24); border-radius: 0; background: rgba(0,0,0,.18); outline: none; font: 500 11px/1.4 inherit; resize: vertical; }.cpwb-input:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }.cpwb-rule-input { min-width: 125px; }\n.cpwb-btn, .cpwb-x, .cpwb-toggle, .cpwb-kb-name { appearance: none; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.24); background: rgba(255,255,255,.025); cursor: pointer; }.cpwb-btn { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 29px; padding: 6px 8px; font-size: 9px; line-height: 1; white-space: nowrap; }.cpwb-button-content > svg { flex: 0 0 auto; }.cpwb-btn:hover { color: var(--cpwb-cyan); border-color: rgba(0,240,255,.55); }.cpwb-btn-primary { color: #071014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); font-weight: 700; }.cpwb-btn-primary:hover { color: #071014; box-shadow: 0 0 15px rgba(0,240,255,.2); }.cpwb-btn-danger { color: #ff8295; border-color: rgba(255,42,109,.35); background: rgba(255,42,109,.05); }.cpwb-btn:disabled, .cpwb-x:disabled, .cpwb-toggle:disabled { cursor: not-allowed; opacity: .42; }\n.cpwb-list, .cpwb-kb-list, .cpwb-citations { display: grid; gap: 7px; }.cpwb-item, .cpwb-kb-row { align-items: flex-start; padding: 9px; border: 1px solid rgba(137,157,180,.13); background: rgba(255,255,255,.018); }.cpwb-kb-row { align-items: center; }.cpwb-item-main { flex: 1; min-width: 0; }.cpwb-item-title { min-width: 0; overflow-wrap: anywhere; color: #e6edf3; font-size: 11px; }.cpwb-item-meta { margin-top: 4px; overflow-wrap: anywhere; color: #758398; font-size: 9px; line-height: 1.45; }.cpwb-item-done .cpwb-item-title { color: #647181; text-decoration: line-through; }.cpwb-overdue { color: #ff6d80; }.cpwb-check { display: inline-grid; place-items: center; flex: 0 0 22px; width: 22px; height: 22px; padding: 0; color: #061014; border: 1px solid rgba(139,159,181,.4); background: transparent; cursor: pointer; }.cpwb-check.cpwb-done { border-color: var(--cpwb-green); background: var(--cpwb-green); }.cpwb-x { display: grid; place-items: center; flex: 0 0 auto; width: 25px; height: 25px; color: #77859a; border: 0; background: transparent; }.cpwb-x:hover { color: #ff7188; }\n.cpwb-badge { display: inline-block; margin-left: 6px; padding: 2px 5px; border: 1px solid currentColor; font: 600 7px/1 var(--cpwb-code); }.cpwb-badge-done { color: var(--cpwb-green); }.cpwb-badge-pending { color: var(--cpwb-cyan); }.cpwb-badge-overdue { color: #ff7188; }\n.cpwb-kb-name { flex: 1; min-width: 0; overflow: hidden; padding: 5px; border: 0; text-align: left; text-overflow: ellipsis; white-space: nowrap; }.cpwb-kb-name:hover { color: var(--cpwb-cyan); }.cpwb-kb-sel { border-color: rgba(255,183,37,.42); background: rgba(255,183,37,.05); }.cpwb-kb-sel .cpwb-kb-name { color: var(--cpwb-amber); }\n.cpwb-drop { display: grid; place-items: center; min-height: 74px; padding: 10px; color: #8390a2; border: 1px dashed rgba(0,240,255,.28); background: rgba(0,240,255,.025); cursor: pointer; text-align: center; font-size: 10px; }.cpwb-drop:hover, .cpwb-drop-active { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); background: rgba(0,240,255,.06); }.cpwb-upload-block { margin: 7px 0; }.cpwb-upload-file { justify-content: space-between; padding: 5px; }\n.cpwb-citation { padding: 9px; border-left: 2px solid var(--cpwb-cyan); background: rgba(0,240,255,.035); }.cpwb-citation-head { justify-content: space-between; color: var(--cpwb-cyan); font-size: 9px; }.cpwb-citation-file { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.cpwb-citation-locator { color: #69788c; }.cpwb-citation-heading { margin-top: 6px; font-size: 10px; font-weight: 650; }.cpwb-citation-text { margin-top: 5px; color: #a8b4c2; font-size: 9px; line-height: 1.55; }\n.cpwb-toggle-row { justify-content: space-between; padding: 7px 0; color: #bdc7d3; font-size: 10px; }.cpwb-toggle { min-width: 34px; padding: 5px; color: #7d8999; font: 700 8px/1 var(--cpwb-code); }.cpwb-toggle.cpwb-on { color: #071014; border-color: var(--cpwb-green); background: var(--cpwb-green); }.cpwb-summary-entry { margin-bottom: 7px; padding: 9px; overflow-wrap: anywhere; border-left: 2px solid var(--cpwb-amber); background: rgba(255,183,37,.035); color: #c3cbd4; font-size: 10px; line-height: 1.5; }.cpwb-summary-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; }.cpwb-summary-actions { display: flex; flex: 0 0 auto; gap: 5px; }.cpwb-summary-content { white-space: pre-wrap; }.cpwb-summary-failed { color: #ff7188; }\n.cpwb-status, .cpwb-error-msg { padding: 7px 9px; margin-bottom: 8px; border-left: 2px solid currentColor; font-size: 9px; }.cpwb-status { display: flex; align-items: center; gap: 6px; line-height: 1.2; }.cpwb-status svg { flex: 0 0 auto; }.cpwb-status-loading { color: var(--cpwb-cyan); }.cpwb-status-success { color: var(--cpwb-green); }.cpwb-status-error, .cpwb-error-msg { color: #ff7188; }.cpwb-error { padding-bottom: 9px; }\n\n.cpwb-drawer-root { position: fixed; z-index: 91; inset: 0; }.cpwb-drawer-backdrop { position: absolute; inset: 0; background: rgba(2,3,6,.68); backdrop-filter: blur(5px); }.cpwb-drawer { position: absolute; top: 0; right: 0; bottom: 0; width: min(88vw, 390px); animation: cpwb-drawer-in .23s ease-out; box-shadow: -25px 0 60px rgba(0,0,0,.48); }\n\n/* Full-screen rc.2 session projection. DSH owns the state machine; this layer\n   owns only the information architecture, glass surfaces, and focus order. */\n.cpwb-fullscreen-shell { position: absolute; inset: 0; z-index: 35; width: 100%; min-height: 100%; height: 100%; display: grid; grid-template-columns: 232px minmax(0, 1fr); overflow: hidden; color: var(--cpwb-text); pointer-events: none; }\n.cpwb-session-overlay .cpwb-sidebar, .cpwb-session-overlay .cpwb-tool-rail { pointer-events: auto; }\n.cpwb-fullscreen-shell.cpwb-tool-open { grid-template-columns: 232px minmax(0, 1fr) minmax(280px, 320px); }\n.cpwb-sidebar { display: flex; flex-direction: column; box-sizing: border-box; min-width: 0; min-height: 0; height: 100%; overflow: hidden; padding: 22px 14px 14px; border-right: 1px solid rgba(0,240,255,.22); background: rgba(7,10,15,.82); backdrop-filter: blur(22px); }\n.cpwb-sidebar-logo { display: flex; align-items: baseline; gap: 7px; padding: 8px; color: var(--cpwb-text); border: 0; background: transparent; cursor: pointer; text-align: left; font: 800 17px/1 var(--cpwb-code); letter-spacing: .1em; }.cpwb-sidebar-logo b { color: var(--cpwb-cyan); font-size: 8px; letter-spacing: .2em; }.cpwb-sidebar-project { margin: 26px 8px 18px; overflow: hidden; color: var(--cpwb-muted); font: 600 9px/1 var(--cpwb-code); letter-spacing: .16em; text-overflow: ellipsis; text-transform: uppercase; }\n.cpwb-sidebar-toggle { align-self: flex-end; width: 26px; height: 24px; margin: 4px 0 6px; color: var(--cpwb-cyan); border: 1px solid rgba(0,240,255,.25); background: transparent; cursor: pointer; }\n.cpwb-sidebar-scroll { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-x: hidden; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(0,240,255,.25) transparent; }.cpwb-sidebar nav { display: grid; gap: 4px; }.cpwb-sidebar-item { display: grid; grid-template-columns: 25px minmax(0,1fr); align-items: center; gap: 7px; padding: 12px 10px; color: #8290a4; border: 1px solid transparent; background: transparent; cursor: pointer; text-align: left; font-size: 12px; }.cpwb-sidebar-item > span { color: var(--cpwb-cyan); font: 16px/1 var(--cpwb-code); text-align: center; }.cpwb-sidebar-item:hover, .cpwb-sidebar-item.cpwb-active { color: var(--cpwb-text); border-color: rgba(0,240,255,.22); background: linear-gradient(90deg, rgba(0,240,255,.11), transparent); box-shadow: inset 3px 0 var(--cpwb-amber); }.cpwb-sidebar-brand-footer { position: relative; z-index: 2; display: grid; flex: 0 0 auto; gap: 9px; margin-top: 12px; padding-top: 11px; border-top: 1px solid rgba(0,240,255,.18); background: linear-gradient(180deg, rgba(7,10,15,.55), rgba(7,10,15,.96)); }.cpwb-sidebar-status { color: #637286; font: 600 8px/1.3 var(--cpwb-code); letter-spacing: .1em; }\n.cpwb-session-history { min-width: 0; margin-top: 17px; padding-top: 13px; border-top: 1px solid rgba(0,240,255,.12); }.cpwb-history-title { margin: 0 8px 8px; color: #637286; font: 650 8px/1.2 var(--cpwb-code); letter-spacing: .12em; }.cpwb-history-item { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 5px; width: 100%; padding: 8px; overflow: hidden; color: #8b99aa; border: 1px solid transparent; background: transparent; cursor: pointer; text-align: left; font-size: 10px; }.cpwb-history-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.cpwb-history-item small { color: #4bba91; font: 7px/1 var(--cpwb-code); }.cpwb-history-item:hover, .cpwb-history-item.cpwb-active { color: var(--cpwb-text); border-color: rgba(0,240,255,.18); background: rgba(0,240,255,.06); }.cpwb-history-more { width: 100%; margin-top: 4px; padding: 7px; color: var(--cpwb-cyan); border: 1px dashed rgba(0,240,255,.25); background: transparent; cursor: pointer; font: 8px/1 var(--cpwb-code); }\n.cpwb-fullscreen-shell.cpwb-sidebar-collapsed { grid-template-columns: 62px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-sidebar-collapsed.cpwb-tool-open { grid-template-columns: 62px minmax(0, 1fr) minmax(280px, 320px); }.cpwb-sidebar-collapsed .cpwb-sidebar { padding-left: 7px; padding-right: 7px; }.cpwb-sidebar-collapsed .cpwb-sidebar-logo span, .cpwb-sidebar-collapsed .cpwb-sidebar-logo b, .cpwb-sidebar-collapsed .cpwb-sidebar-project, .cpwb-sidebar-collapsed .cpwb-sidebar-item, .cpwb-sidebar-collapsed .cpwb-sidebar-status, .cpwb-sidebar-collapsed .cpwb-wordmark-main, .cpwb-sidebar-collapsed .cpwb-wordmark-sub { font-size: 0; }.cpwb-sidebar-collapsed .cpwb-sidebar-item { grid-template-columns: 1fr; justify-items: center; padding-left: 5px; padding-right: 5px; }.cpwb-sidebar-collapsed .cpwb-sidebar-item > span { font-size: 18px; }.cpwb-sidebar-collapsed .cpwb-sidebar-logo { padding-left: 0; padding-right: 0; }.cpwb-sidebar-collapsed .cpwb-wordmark-launcher { width: 46px; padding: 9px 5px 8px; }.cpwb-sidebar-collapsed .cpwb-wordmark-compact { display: block; }\n.cpwb-session-conversation { pointer-events: none; min-width: 0; min-height: 0; }.cpwb-session-context, .cpwb-session-view { display: none; }\n.cpwb-modal { box-sizing: border-box; }\n.cpwb-tool-rail { min-width: 0; overflow: auto; padding: 22px 15px; border-left: 1px solid rgba(0,240,255,.3); background: linear-gradient(180deg, rgba(12,16,22,.91), rgba(7,9,13,.95)); backdrop-filter: blur(18px); }.cpwb-tool-rail-title { margin-bottom: 16px; color: var(--cpwb-amber); font: 650 9px/1 var(--cpwb-code); letter-spacing: .18em; }.cpwb-tool-panel { min-width: 0; }.cpwb-tool-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 13px; color: var(--cpwb-cyan); font: 650 9px/1.3 var(--cpwb-code); }.cpwb-todo-row { display: flex; align-items: flex-start; gap: 8px; padding: 10px 6px; border-bottom: 1px solid rgba(139,159,181,.13); }.cpwb-todo-details { display: grid; gap: 2px; padding: 0; color: inherit; border: 0; background: transparent; text-align: left; cursor: pointer; }.cpwb-todo-details .cpwb-item-meta { display: block; }.cpwb-icon-button { display: inline-grid; place-items: center; flex: 0 0 27px; width: 27px; height: 27px; padding: 0; color: #96a5b8; border: 1px solid rgba(139,159,181,.2); background: transparent; cursor: pointer; }.cpwb-icon-button:hover { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }.cpwb-danger-icon:hover { color: #ff7188; border-color: rgba(255,42,109,.55); }\n.cpwb-todo-tabs { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 15px; border: 1px solid rgba(0,240,255,.18); background: rgba(3,8,13,.5); }.cpwb-todo-tabs button { display: flex; align-items: center; justify-content: space-between; min-height: 35px; padding: 0 11px; color: #77859a; border: 0; border-bottom: 2px solid transparent; background: transparent; cursor: pointer; font: 650 9px/1 var(--cpwb-code); }.cpwb-todo-tabs button + button { border-left: 1px solid rgba(0,240,255,.12); }.cpwb-todo-tabs button:hover { color: var(--cpwb-cyan); background: rgba(0,240,255,.04); }.cpwb-todo-tabs button.cpwb-active { color: var(--cpwb-cyan); border-bottom-color: var(--cpwb-cyan); background: rgba(0,240,255,.07); }.cpwb-todo-tabs small { min-width: 19px; padding: 3px 5px; color: inherit; border: 1px solid currentColor; font-size: 8px; text-align: center; }\n.cpwb-todo-sections { display: grid; gap: 18px; }.cpwb-todo-section h4 { margin: 0 0 6px; color: #8995a7; font: 650 10px/1.2 var(--cpwb-code); letter-spacing: .04em; }.cpwb-todo-section-overdue h4 { color: #ff667f; }.cpwb-todo-section-completed h4 { color: var(--cpwb-green); }.cpwb-todo-section .cpwb-list { gap: 0; border-top: 1px solid rgba(139,159,181,.12); }.cpwb-todo-row { display: grid; grid-template-columns: 22px minmax(0,1fr) auto 27px 27px; align-items: center; gap: 7px; min-width: 0; padding: 10px 4px; transition: background .16s ease, border-color .16s ease; }.cpwb-todo-row:hover { background: rgba(0,240,255,.025); }.cpwb-todo-row-overdue { border-left: 2px solid rgba(255,42,109,.72); background: rgba(255,42,109,.035); }.cpwb-todo-time { display: grid; justify-items: end; gap: 2px; min-width: 38px; color: var(--cpwb-cyan); font: 650 10px/1 var(--cpwb-code); }.cpwb-todo-time small { color: #ff667f; font-size: 7px; letter-spacing: .04em; }.cpwb-todo-time.cpwb-todo-overdue { color: #ff667f; }.cpwb-item-done .cpwb-todo-time { color: var(--cpwb-green); }.cpwb-item-done { opacity: .72; }.cpwb-todo-details:focus-visible, .cpwb-todo-tabs button:focus-visible, .cpwb-icon-button:focus-visible, .cpwb-check:focus-visible { outline: 2px solid var(--cpwb-cyan); outline-offset: 2px; }\n.cpwb-modal-backdrop { position: fixed; z-index: 120; inset: 0; display: grid; place-items: center; padding: 18px; background: rgba(2,3,6,.7); backdrop-filter: blur(12px); }.cpwb-modal { width: min(100%, 480px); max-height: min(90vh, 720px); overflow: auto; padding: 24px; border: 1px solid rgba(0,240,255,.45); background: linear-gradient(145deg, rgba(19,23,31,.96), rgba(12,10,16,.98)); box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 32px rgba(0,240,255,.08); }.cpwb-modal h3 { margin: 8px 0 22px; font-size: 22px; }.cpwb-modal p { color: var(--cpwb-text-secondary); font-size: 12px; line-height: 1.6; }.cpwb-modal label { display: grid; gap: 7px; margin-bottom: 14px; color: #9da9b8; font: 600 9px/1 var(--cpwb-code); letter-spacing: .08em; }.cpwb-modal input, .cpwb-modal textarea { box-sizing: border-box; min-width: 0; width: 100%; padding: 11px; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.25); background: rgba(0,0,0,.25); outline: none; font: 400 13px/1.35 inherit; resize: vertical; }.cpwb-modal textarea { min-height: 88px; }.cpwb-modal input:focus, .cpwb-modal textarea:focus { border-color: var(--cpwb-cyan); box-shadow: 0 0 0 2px rgba(0,240,255,.1); }.cpwb-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }.cpwb-form-error { margin: 4px 0 14px; color: #ff7188; font-size: 11px; }.cpwb-modal-actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }.cpwb-modal-actions-split { align-items: center; justify-content: space-between; }.cpwb-modal-actions .cpwb-row { margin: 0; }.cpwb-recurrence-picker { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-bottom: 14px; border: 1px solid rgba(139,159,181,.2); background: rgba(139,159,181,.2); }.cpwb-recurrence-picker button { min-height: 35px; color: var(--cpwb-text-secondary); border: 0; background: #0c1118; cursor: pointer; }.cpwb-recurrence-picker button.cpwb-active { color: #071014; background: var(--cpwb-amber); }.cpwb-switch-row { display: flex !important; align-items: center; justify-content: space-between; }.cpwb-switch-row input { width: auto; accent-color: var(--cpwb-cyan); }.cpwb-danger-confirm { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 8px 0; padding: 10px; color: #ff92a3; border-left: 2px solid var(--cpwb-magenta); background: rgba(255,42,109,.07); font-size: 10px; }.cpwb-schedule-row { display: grid; grid-template-columns: 30px minmax(0,1fr) auto 27px 27px; align-items: center; gap: 7px; padding: 10px 7px; border-bottom: 1px solid rgba(139,159,181,.13); cursor: pointer; }.cpwb-schedule-row:hover { background: rgba(0,240,255,.025); }.cpwb-schedule-icon { display: grid; place-items: center; color: var(--cpwb-cyan); }.cpwb-schedule-state { font: 650 7px/1 var(--cpwb-code); letter-spacing: .08em; }.cpwb-schedule-state.cpwb-on { color: var(--cpwb-green); }.cpwb-schedule-state.cpwb-off { color: var(--cpwb-text-muted); }\n.cpwb-page-modal-host { box-sizing: border-box !important; position: fixed; z-index: 220; inset: 0; place-items: center; width: 100vw; max-width: none !important; height: 100dvh; max-height: none !important; margin: 0; padding: 18px; overflow: auto; color: var(--cpwb-text); border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; clip-path: none !important; }\n.cpwb-page-modal-host[open] { display: grid; }.cpwb-page-modal-host:not([open]) { display: none; }.cpwb-page-modal-host::backdrop { background: rgba(2,3,6,.72); backdrop-filter: blur(12px); }\n.cpwb-page-modal-host .cpwb-modal { max-height: min(90dvh, 720px); clip-path: var(--cpwb-cut-lg); }\n .cpwb-native-settings-section { min-width: 0; overflow: auto; padding: 22px 26px; color: var(--cpwb-text); background: linear-gradient(180deg, rgba(12,13,19,.94), rgba(8,9,13,.98)); } .cpwb-native-settings-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 18px; border-bottom: 1px solid rgba(0,240,255,.16); }.cpwb-settings-nav { display: grid; align-content: start; gap: 3px; padding: 18px 12px; border-right: 1px solid rgba(0,240,255,.13); }.cpwb-settings-nav > span { margin: 13px 8px 7px; color: var(--cpwb-cyan); font: 600 8px/1 var(--cpwb-code); letter-spacing: .15em; }.cpwb-settings-nav button { padding: 10px 9px; color: #92a1b4; border: 0; background: transparent; cursor: pointer; text-align: left; font-size: 11px; }.cpwb-settings-nav button:hover, .cpwb-settings-nav button.cpwb-active { color: var(--cpwb-text); background: rgba(0,240,255,.1); box-shadow: inset 2px 0 var(--cpwb-amber); }.cpwb-settings-content { min-width: 0; overflow: auto; padding: 34px; }.cpwb-settings-panel { max-width: 680px; display: grid; gap: 12px; padding: 20px; border: 1px solid rgba(0,240,255,.2); background: rgba(255,255,255,.02); }.cpwb-settings-panel h2 { margin: 0 0 4px; }.cpwb-settings-panel p { color: var(--cpwb-muted); font-size: 12px; line-height: 1.55; }.cpwb-settings-panel label { display: grid; gap: 6px; color: #9da9b8; font: 600 9px/1 var(--cpwb-code); letter-spacing: .08em; }.cpwb-settings-panel input, .cpwb-settings-panel select { min-width: 0; padding: 9px; color: var(--cpwb-text); border: 1px solid rgba(139,159,181,.25); background: rgba(0,0,0,.25); outline: none; }.cpwb-settings-panel input:focus, .cpwb-settings-panel select:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }.cpwb-settings-panel button { justify-self: start; padding: 8px 12px; color: var(--cpwb-text); border: 1px solid rgba(0,240,255,.3); background: rgba(0,240,255,.05); cursor: pointer; }.cpwb-settings-panel button:hover { color: var(--cpwb-cyan); border-color: var(--cpwb-cyan); }.cpwb-settings-actions, .cpwb-settings-index { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }.cpwb-settings-panel fieldset { display: grid; gap: 9px; border: 1px solid rgba(139,159,181,.2); }.cpwb-settings-panel legend { color: var(--cpwb-cyan); font: 600 9px/1 var(--cpwb-code); }.cpwb-settings-message { color: var(--cpwb-green) !important; }.cpwb-settings-panel pre { max-width: 100%; overflow: auto; color: var(--cpwb-cyan); font-size: 10px; }\n\n/* Workbench section inside the native SettingsRoot. Native settings owns the\n   modal and close affordance; this section stays a clean, single-level panel. */\n.cpwb-native-settings-section {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  min-height: 100%;\n  overflow: visible;\n  padding: 0;\n  color: var(--cpwb-text);\n  background: transparent;\n}\n.cpwb-native-settings-header {\n  display: block;\n  padding: 2px 0 17px;\n  border-bottom: 1px solid var(--cpwb-border);\n}\n.cpwb-native-settings-header h2 { margin: 7px 0 6px; font-size: 21px; }\n.cpwb-native-settings-header p { margin: 0; color: var(--cpwb-muted); font-size: 10px; line-height: 1.5; }\n.cpwb-eyebrow { color: var(--cpwb-cyan); font: 650 8px/1 var(--cpwb-code); letter-spacing: .16em; }\n.cpwb-settings-nav {\n  display: flex;\n  flex: 0 0 auto;\n  align-items: stretch;\n  gap: 0;\n  overflow-x: auto;\n  padding: 10px 0 0;\n  border-right: 0;\n  border-bottom: 1px solid var(--cpwb-border);\n}\n.cpwb-settings-nav button {\n  position: relative;\n  flex: 0 0 auto;\n  min-height: 36px;\n  padding: 0 12px;\n  color: var(--cpwb-muted);\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  font-size: 10px;\n}\n.cpwb-settings-nav button::after { content: ""; position: absolute; left: 12px; right: 12px; bottom: -1px; height: 2px; background: var(--cpwb-amber); transform: scaleX(0); }\n.cpwb-settings-nav button:hover,\n.cpwb-settings-nav button.cpwb-active { color: var(--cpwb-text); background: var(--cpwb-cyan-soft); box-shadow: none; }\n.cpwb-settings-nav button.cpwb-active::after { transform: scaleX(1); }\n.cpwb-settings-content { min-width: 0; overflow: visible; padding: 18px 0 0; }\n.cpwb-settings-panel { display: grid; max-width: none; gap: 12px; padding: 19px; border: 1px solid var(--cpwb-border); background: var(--cpwb-surface-panel); clip-path: var(--cpwb-cut-sm); }\n.cpwb-settings-panel label { color: var(--cpwb-text-secondary); }\n.cpwb-settings-panel input,\n.cpwb-settings-panel select,\n.cpwb-settings-panel textarea { color: var(--cpwb-text); border-color: var(--cpwb-border); background: var(--cpwb-surface-input); }\n.cpwb-prompt-settings textarea { box-sizing: border-box; width: 100%; min-height: 132px; padding: 12px; resize: vertical; outline: none; font: 11px/1.6 var(--cpwb-code); }\n.cpwb-prompt-settings textarea:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }\n.cpwb-settings-panel button { color: var(--cpwb-text); border-color: var(--cpwb-border-strong); background: var(--cpwb-cyan-soft); }\n.cpwb-settings-panel fieldset { border-color: var(--cpwb-border); }\n.cpwb-auth-state { position: relative; display: grid; grid-template-columns: 42px minmax(0,1fr); align-items: center; gap: 12px; min-height: 72px; padding: 13px 15px; overflow: hidden; border: 1px solid var(--cpwb-border); background: linear-gradient(100deg, rgba(0,240,255,.06), rgba(255,255,255,.015)); }\n.cpwb-auth-state::after { content: ""; position: absolute; top: 0; right: 0; width: 44px; height: 3px; background: var(--cpwb-cyan); box-shadow: 0 0 14px rgba(0,240,255,.45); }\n.cpwb-auth-online { border-color: rgba(83,216,165,.38); }\n.cpwb-auth-online::after { background: var(--cpwb-green); box-shadow: 0 0 14px rgba(83,216,165,.4); }\n.cpwb-auth-icon { display: grid; place-items: center; width: 40px; height: 40px; color: var(--cpwb-cyan); border: 1px solid currentColor; background: rgba(0,240,255,.05); clip-path: var(--cpwb-cut-sm); }\n.cpwb-auth-online .cpwb-auth-icon { color: var(--cpwb-green); background: rgba(83,216,165,.06); }\n.cpwb-auth-state strong { color: var(--cpwb-text); font: 700 10px/1.2 var(--cpwb-code); letter-spacing: .11em; }\n.cpwb-auth-state p { margin: 5px 0 0; }\n.cpwb-auth-privacy { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; color: var(--cpwb-cyan); border-left: 2px solid var(--cpwb-cyan); background: rgba(0,240,255,.035); }\n.cpwb-auth-privacy svg { flex: 0 0 auto; margin-top: 1px; }\n.cpwb-auth-privacy p { margin: 0; }\n.cpwb-settings-panel button.cpwb-auth-connect { display: inline-flex; align-items: center; gap: 8px; min-height: 39px; padding: 0 15px; color: #111217; border-color: var(--cpwb-amber); background: var(--cpwb-amber); font-weight: 750; }\n.cpwb-settings-panel button.cpwb-auth-connect:hover { color: #05070a; border-color: #ffd45c; background: #ffd45c; box-shadow: 0 0 24px rgba(255,184,25,.18); }\n.cpwb-settings-panel button:disabled { cursor: not-allowed; opacity: .48; }\n.cpwb-auth-activation { color: var(--cpwb-green); font: 650 8px/1 var(--cpwb-code); letter-spacing: .12em; }\n.cpwb-auth-unavailable { color: #ff7188 !important; }\n.cpwb-spin { animation: cpwb-spin .75s linear infinite; }\n@keyframes cpwb-spin { to { transform: rotate(360deg); } }\n\n/* rc.2 composer fusion. Native DSH remains the owner of model selection,\n   attachments, Files API and @ references; Workbench only adds readable\n   chrome and a shared cyberpunk visual language around those public seats. */\n.cpwb-model-indicator { appearance: none; display: inline-flex; align-items: center; gap: 8px; min-height: 34px; max-width: min(220px, 28vw); padding: 0 11px; color: #e8edf2; border: 1px solid rgba(77,232,244,.38); background: linear-gradient(105deg, rgba(77,232,244,.08), rgba(15,17,24,.92)); box-shadow: inset 2px 0 var(--cpwb-cyan); clip-path: var(--cpwb-cut-sm); cursor: pointer; font: 650 10px/1 var(--cpwb-code); }\n.cpwb-model-indicator span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-model-indicator svg { flex: 0 0 auto; color: var(--cpwb-cyan); }\n.cpwb-model-indicator:hover, .cpwb-model-indicator:focus-visible { color: #061014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 20px rgba(77,232,244,.2); outline: none; }\n.cpwb-model-indicator:hover svg, .cpwb-model-indicator:focus-visible svg { color: #061014; }\n.cpwb-model-indicator:disabled { cursor: not-allowed; opacity: .45; }\nbody:has(.cpwb-app-shell[data-page="conversation"]):has(.cpwb-model-indicator) [data-slot="conversation.input.model"] button[aria-haspopup="menu"] { box-sizing: border-box !important; width: 1px !important; min-width: 1px !important; max-width: 1px !important; height: 34px !important; min-height: 34px !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; opacity: 0 !important; border: 0 !important; pointer-events: none !important; }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"], body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] { color: #edf2f5 !important; border: 1px solid rgba(77,232,244,.55) !important; background: #0a0e16 !important; box-shadow: 0 18px 52px rgba(0,0,0,.58), inset 2px 0 rgba(77,232,244,.12) !important; }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"] [role="menuitem"], body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] [role="menuitem"] { color: #edf2f5 !important; border-bottom-color: rgba(77,232,244,.14) !important; opacity: 1 !important; }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"] [role="menuitem"] span, body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] [role="menuitem"] span { color: inherit !important; }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="\u6A21\u578B"] [role="menuitem"]:hover, body:has(.cpwb-app-shell[data-page="conversation"]) [role="menu"][aria-label*="model" i] [role="menuitem"]:hover { color: #061014 !important; background: var(--cpwb-cyan) !important; }\n.cpwb-image-attachment-button { appearance: none; display: grid; place-items: center; width: 34px; height: 34px; padding: 0; color: #aeb8c6; border: 1px solid rgba(77,232,244,.34); background: rgba(8,12,18,.9); cursor: pointer; clip-path: var(--cpwb-cut-sm); }\n.cpwb-image-attachment-button:hover, .cpwb-image-attachment-button:focus-visible { color: #061014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); box-shadow: 0 0 18px rgba(77,232,244,.18); outline: none; }\n.cpwb-image-attachment-button:disabled { cursor: not-allowed; opacity: .38; }\n.cpwb-image-attachment-input { position: fixed !important; width: 1px !important; height: 1px !important; overflow: hidden !important; opacity: 0 !important; pointer-events: none !important; }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] { box-sizing: border-box; width: 100%; max-width: none; }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] > * { box-sizing: border-box; width: 100%; max-width: none; border-color: rgba(77,232,244,.52); background: rgba(8,11,17,.98); box-shadow: 0 -16px 48px rgba(0,0,0,.46), 0 0 0 1px rgba(77,232,244,.06); }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] [role="option"]:hover,\nbody:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.overlay"] [role="option"][aria-selected="true"] { color: #061014; background: var(--cpwb-cyan); }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.attachments"] { width: 100%; }\nbody:has(.cpwb-app-shell[data-page="conversation"]) [data-slot="conversation.input.attachments"] button { border-color: rgba(77,232,244,.42); background: rgba(8,12,18,.92); }\n\n/* Wide, transcript-first Subagent activity drawer. */\n.cpwb-subagent-backdrop { position: fixed; z-index: 190; inset: 0; display: flex; justify-content: flex-end; background: rgba(2,4,8,.56); backdrop-filter: blur(4px); pointer-events: auto; }\n.cpwb-subagent-drawer { position: relative; display: grid; grid-template-rows: auto auto auto minmax(0,1fr) auto auto; width: clamp(440px, 42vw, 680px); height: 100dvh; min-width: 0; overflow: hidden; color: var(--cpwb-text); border: 0; border-left: 1px solid rgba(77,232,244,.58); background: radial-gradient(circle at 100% 0, rgba(96,19,32,.34), transparent 34%), linear-gradient(180deg, rgba(10,13,20,.985), rgba(5,7,12,.995)); box-shadow: -36px 0 90px rgba(0,0,0,.56), inset 2px 0 rgba(77,232,244,.08); animation: cpwb-drawer-in .24s cubic-bezier(.2,.8,.2,1); }\n.cpwb-subagent-drawer::before { content: ""; position: absolute; z-index: 2; top: 0; left: 0; width: 38%; height: 3px; background: var(--cpwb-cyan); box-shadow: 0 0 18px rgba(77,232,244,.5); }\n.cpwb-subagent-drawer-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 74px; padding: 16px 18px; border-bottom: 1px solid rgba(77,232,244,.2); }\n.cpwb-subagent-heading { display: flex; align-items: center; gap: 11px; min-width: 0; }\n.cpwb-subagent-heading > svg { color: var(--cpwb-cyan); }\n.cpwb-subagent-heading span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .2em; }\n.cpwb-subagent-heading h2 { margin: 6px 0 0; color: #f0eee8; font-size: 17px; }\n.cpwb-subagent-header-actions { display: flex; gap: 6px; }\n.cpwb-subagent-header-actions button, .cpwb-subagent-info-layer header button { appearance: none; display: grid; place-items: center; width: 35px; height: 35px; color: #aeb8c6; border: 1px solid rgba(77,232,244,.28); background: rgba(9,13,19,.78); cursor: pointer; }\n.cpwb-subagent-header-actions button:hover, .cpwb-subagent-info-layer header button:hover { color: #061014; border-color: var(--cpwb-cyan); background: var(--cpwb-cyan); }\n.cpwb-subagent-header-actions button:disabled { cursor: not-allowed; opacity: .3; }\n.cpwb-subagent-selector { position: relative; z-index: 5; padding: 12px 18px 0; }\n.cpwb-subagent-selector-trigger { appearance: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 55px; padding: 0 15px; color: #f0eee8; border: 1px solid rgba(77,232,244,.42); background: rgba(13,17,24,.94); box-shadow: inset 3px 0 var(--cpwb-amber); clip-path: var(--cpwb-cut-sm); cursor: pointer; text-align: left; }\n.cpwb-subagent-selector-trigger > span { display: grid; min-width: 0; gap: 5px; }\n.cpwb-subagent-selector-trigger strong { overflow: hidden; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-subagent-selector-trigger small { color: var(--cpwb-green); font: 650 7px/1 var(--cpwb-code); letter-spacing: .13em; }\n.cpwb-subagent-selector-trigger svg { color: var(--cpwb-cyan); }\n.cpwb-subagent-selector-trigger:hover, .cpwb-subagent-selector-trigger[aria-expanded="true"] { border-color: var(--cpwb-cyan); background: rgba(77,232,244,.1); box-shadow: inset 3px 0 var(--cpwb-cyan), 0 0 24px rgba(77,232,244,.08); }\n.cpwb-subagent-selector-menu { position: absolute; z-index: 8; top: calc(100% - 1px); left: 18px; right: 18px; max-height: min(48vh, 390px); overflow: auto; border: 1px solid var(--cpwb-cyan); background: #080c12; box-shadow: 0 22px 48px rgba(0,0,0,.62); }\n.cpwb-subagent-selector-menu button { appearance: none; display: grid; grid-template-columns: 36px minmax(0,1fr) auto; align-items: center; gap: 9px; width: 100%; min-height: 65px; padding: 7px 12px; color: #bac4d0; border: 0; border-bottom: 1px solid rgba(77,232,244,.13); background: #090d14; cursor: pointer; text-align: left; }\n.cpwb-subagent-selector-menu button b { color: var(--cpwb-amber); font: 700 9px/1 var(--cpwb-code); }\n.cpwb-subagent-selector-menu button span { display: grid; min-width: 0; gap: 5px; }\n.cpwb-subagent-selector-menu button strong { overflow: hidden; color: inherit; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-subagent-selector-menu button small { color: #607084; font: 600 7px/1 var(--cpwb-code); letter-spacing: .09em; }\n.cpwb-subagent-selector-menu button em { color: #6b788a; font: 650 7px/1 var(--cpwb-code); font-style: normal; }\n.cpwb-subagent-selector-menu button:hover, .cpwb-subagent-selector-menu button:focus-visible, .cpwb-subagent-selector-menu button.cpwb-selected { color: #061014; background: var(--cpwb-cyan); outline: none; }\n.cpwb-subagent-selector-menu button:hover small, .cpwb-subagent-selector-menu button:hover em, .cpwb-subagent-selector-menu button:focus-visible small, .cpwb-subagent-selector-menu button:focus-visible em, .cpwb-subagent-selector-menu button.cpwb-selected small, .cpwb-subagent-selector-menu button.cpwb-selected em { color: rgba(6,16,20,.7); }\n.cpwb-subagent-selector-menu button:hover b, .cpwb-subagent-selector-menu button:focus-visible b, .cpwb-subagent-selector-menu button.cpwb-selected b { color: #061014; }\n.cpwb-subagent-statusbar { display: flex; align-items: center; gap: 10px; min-height: 38px; margin: 0 18px; padding: 0 4px; color: #647286; border-bottom: 1px solid rgba(77,232,244,.15); font: 650 7px/1 var(--cpwb-code); letter-spacing: .12em; }\n.cpwb-subagent-statusbar span { color: #718095; }.cpwb-subagent-statusbar span.cpwb-running { color: var(--cpwb-green); }.cpwb-subagent-statusbar b { color: var(--cpwb-amber); }.cpwb-subagent-statusbar small { margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-subagent-transcript { min-height: 0; overflow-x: hidden; overflow-y: auto; padding: 17px 18px 22px; scrollbar-width: thin; scrollbar-color: rgba(77,232,244,.3) transparent; }\n.cpwb-subagent-message { position: relative; display: grid; gap: 7px; max-width: 86%; margin-bottom: 14px; padding: 12px 14px; border: 1px solid rgba(77,232,244,.14); background: rgba(14,18,25,.74); clip-path: var(--cpwb-cut-sm); }\n.cpwb-subagent-message span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .16em; }\n.cpwb-subagent-message p { margin: 0; color: #c9d0d9; font-size: 11px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }\n.cpwb-subagent-message-user { margin-left: auto; border-color: rgba(255,181,27,.2); background: rgba(255,181,27,.055); }.cpwb-subagent-message-user span { color: var(--cpwb-amber); }\n.cpwb-subagent-message-tool { max-width: 94%; margin-left: auto; margin-right: auto; border-style: dashed; background: rgba(77,232,244,.025); }.cpwb-subagent-message-tool p { color: #748399; font: 600 9px/1.45 var(--cpwb-code); }\n.cpwb-subagent-empty { display: grid; place-items: center; align-content: center; gap: 9px; min-height: 100%; padding: 28px; color: #607084; text-align: center; }.cpwb-subagent-empty svg { color: var(--cpwb-cyan); }.cpwb-subagent-empty strong { color: #99a6b6; font-size: 12px; }.cpwb-subagent-empty p { max-width: 330px; margin: 0; font-size: 10px; line-height: 1.6; }\n.cpwb-subagent-error { margin: 0 18px 10px; padding: 9px 11px; color: #ff8a9e; border-left: 2px solid var(--cpwb-magenta); background: rgba(255,42,109,.07); font-size: 10px; }\n.cpwb-subagent-readonly { min-height: 54px; padding: 18px; color: #677589; border-top: 1px solid rgba(77,232,244,.16); background: rgba(4,7,11,.74); text-align: center; font: 650 8px/1 var(--cpwb-code); letter-spacing: .1em; }\n.cpwb-subagent-composer { display: grid; gap: 8px; padding: 12px 18px 16px; border-top: 1px solid rgba(77,232,244,.2); background: rgba(5,8,13,.88); }\n.cpwb-subagent-composer textarea { box-sizing: border-box; width: 100%; min-height: 68px; resize: vertical; padding: 11px 12px; color: #e4e8ed; border: 1px solid rgba(77,232,244,.28); background: rgba(10,13,19,.9); outline: none; font: 11px/1.55 var(--cpwb-ui); }\n.cpwb-subagent-composer textarea:focus { border-color: var(--cpwb-cyan); box-shadow: inset 2px 0 var(--cpwb-cyan); }\n.cpwb-subagent-composer > div { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #607084; font: 650 8px/1 var(--cpwb-code); }\n.cpwb-subagent-composer button { appearance: none; display: inline-flex; align-items: center; gap: 7px; min-height: 34px; padding: 0 12px; cursor: pointer; font: 700 8px/1 var(--cpwb-code); }\n.cpwb-subagent-stop { color: #ff8a9e; border: 1px solid rgba(255,42,109,.36); background: rgba(255,42,109,.06); }.cpwb-subagent-stop:hover { color: #fff; border-color: var(--cpwb-magenta); background: var(--cpwb-magenta); }\n.cpwb-subagent-send { color: #071014; border: 1px solid var(--cpwb-amber); background: var(--cpwb-amber); }.cpwb-subagent-send:hover { filter: brightness(1.08); }.cpwb-subagent-send:disabled { cursor: not-allowed; opacity: .38; }\n.cpwb-subagent-info-layer { position: absolute; z-index: 12; inset: 0; overflow: auto; color: var(--cpwb-text); background: radial-gradient(circle at 80% 0, rgba(96,19,32,.4), transparent 42%), #080b11; animation: cpwb-rise .2s ease-out; }\n.cpwb-subagent-info-layer header { display: flex; align-items: center; justify-content: space-between; min-height: 76px; padding: 14px 18px; border-bottom: 1px solid rgba(77,232,244,.24); }.cpwb-subagent-info-layer header span { color: var(--cpwb-cyan); font: 650 7px/1 var(--cpwb-code); letter-spacing: .2em; }.cpwb-subagent-info-layer h3 { margin: 7px 0 0; font-size: 18px; }\n.cpwb-subagent-info-grid { display: grid; gap: 22px; padding: 24px 20px; }.cpwb-subagent-info-grid dl { display: grid; gap: 1px; margin: 0; border: 1px solid rgba(77,232,244,.2); }.cpwb-subagent-info-grid dl div { display: grid; grid-template-columns: 130px minmax(0,1fr); min-height: 48px; border-bottom: 1px solid rgba(77,232,244,.12); }.cpwb-subagent-info-grid dl div:last-child { border-bottom: 0; }.cpwb-subagent-info-grid dt, .cpwb-subagent-info-grid dd { display: flex; align-items: center; margin: 0; padding: 10px 12px; }.cpwb-subagent-info-grid dt { color: var(--cpwb-cyan); border-right: 1px solid rgba(77,232,244,.14); font: 650 8px/1 var(--cpwb-code); letter-spacing: .11em; }.cpwb-subagent-info-grid dd { overflow-wrap: anywhere; color: #b5c0cd; font: 600 9px/1.5 var(--cpwb-code); }.cpwb-subagent-info-grid p { margin: 0; padding: 14px 16px; color: #8391a3; border-left: 2px solid var(--cpwb-amber); background: rgba(255,181,27,.045); font-size: 10px; line-height: 1.7; }\nbody:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"] nav button[aria-current="true"] {\n  color: var(--cpwb-amber);\n  background: var(--cpwb-amber-soft);\n  box-shadow: inset 2px 0 var(--cpwb-amber);\n}\n\n@keyframes cpwb-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }\n@keyframes cpwb-scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }\n@keyframes cpwb-pulse { to { opacity: .35; transform: scale(.75); } }\n@keyframes cpwb-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }\n\n@media (max-width: 1199px) {\n  .cpwb-home { grid-template-columns: 176px minmax(0,1fr); }\n  .cpwb-home-main { padding-left: 32px; padding-right: 32px; }\n  .cpwb-home-footer { left: 176px; padding-left: 32px; padding-right: 32px; }\n  .cpwb-project-grid { grid-template-columns: repeat(2, minmax(230px, 1fr)); }\n  .cpwb-knowledge-grid { grid-template-columns: repeat(2, minmax(220px, 1fr)); }\n}\n\n@media (max-width: 899px) {\n  .cpwb-home { grid-template-columns: 62px minmax(0, 1fr); }\n  .cpwb-home-identity { display: flex; padding: 14px 7px 12px; }\n  .cpwb-home-identity .cpwb-brand-name, .cpwb-home-identity .cpwb-home-telemetry, .cpwb-home-identity .cpwb-brand-codes, .cpwb-home-identity .cpwb-sidebar-status, .cpwb-home-identity .cpwb-wordmark-main, .cpwb-home-identity .cpwb-wordmark-sub { display: none; }\n  .cpwb-home-identity .cpwb-brand-mark { width: 42px; height: 15px; margin: 0 auto; }\n  .cpwb-home-identity .cpwb-sidebar-brand-footer { margin-top: auto; }\n  .cpwb-home-identity .cpwb-wordmark-launcher { width: 46px; padding: 9px 5px 8px; }\n  .cpwb-home-identity .cpwb-wordmark-compact { display: block; }\n  .cpwb-home-main { height: 100%; box-sizing: border-box; padding: 28px 22px 76px; }\n  .cpwb-home-footer { left: 62px; padding-left: 22px; padding-right: 22px; }\n  .cpwb-hero { margin-bottom: 42px; }.cpwb-hero h1 { font-size: clamp(34px, 9vw, 62px); }\n  .cpwb-project-grid { grid-template-columns: repeat(2, minmax(210px, 1fr)); }\n  .cpwb-project-card { min-height: 235px; }\n  .cpwb-row { flex-wrap: wrap; }.cpwb-row > .cpwb-input { flex: 1 1 100%; }\n  .cpwb-fullscreen-shell { grid-template-columns: 220px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-tool-open { grid-template-columns: 220px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-sidebar-collapsed { grid-template-columns: 62px minmax(0, 1fr); }.cpwb-fullscreen-shell.cpwb-sidebar-collapsed.cpwb-tool-open { grid-template-columns: 62px minmax(0, 1fr); }.cpwb-sidebar { padding: 12px 7px; }.cpwb-tool-rail { position: fixed; z-index: 90; top: 0; right: 0; bottom: 0; width: min(88vw, 360px); box-shadow: -25px 0 60px rgba(0,0,0,.5); }.cpwb-session-context { padding: 10px 18px; }.cpwb-session-view { padding: 15px 12px; }\n\n}\n\n@media (max-height: 640px) {\n  .cpwb-home-identity { padding-top: 18px; padding-bottom: 12px; }\n  .cpwb-brand-codes { display: none; }\n  .cpwb-home-telemetry { gap: 2px; }\n  .cpwb-home-telemetry span { padding: 6px 0; }\n  .cpwb-sidebar { padding-top: 12px; padding-bottom: 10px; }\n  .cpwb-sidebar-project { margin-top: 12px; margin-bottom: 10px; }\n  .cpwb-sidebar-item { padding-top: 9px; padding-bottom: 9px; }\n  .cpwb-sidebar-brand-footer { gap: 6px; margin-top: 7px; padding-top: 7px; }\n}\n\n@media (max-width: 620px) {\n  .cpwb-home-main { padding: 22px 14px 74px; }\n  .cpwb-hero { margin-bottom: 35px; padding-left: 17px; }.cpwb-hero-kicker { letter-spacing: .13em; }.cpwb-hero h1 { font-size: clamp(31px, 11.5vw, 48px); line-height: .94; }.cpwb-hero p { margin-top: 17px; letter-spacing: .1em; }\n  .cpwb-home-section > header { align-items: center; }.cpwb-home-section { margin-bottom: 38px; }\n  .cpwb-folder-add { grid-template-columns: 28px; min-width: 46px; width: 46px; padding: 8px; }.cpwb-folder-add b { left: 26px; }.cpwb-folder-add em { display: none; }\n  .cpwb-project-grid, .cpwb-knowledge-grid { grid-template-columns: 1fr; }\n  .cpwb-project-card { min-height: 225px; }.cpwb-card-symbol { margin-top: 25px; }\n  .cpwb-knowledge-card { min-height: 96px; }\n  .cpwb-inline-create input { min-width: 110px; max-width: 130px; }\n  .cpwb-home-footer span { display: none; }\n  .cpwb-wordmark-launcher { left: 8px; bottom: 8px; width: 108px; }.cpwb-wordmark-main { font-size: 13px; }\n  .cpwb-tab { padding-left: 2px; padding-right: 2px; }.cpwb-tab span { font-size: 8px; }\n  .cpwb-session-context strong { font-size: 14px; }.cpwb-form-grid { grid-template-columns: 1fr; gap: 0; }.cpwb-settings-nav { grid-template-columns: repeat(2, minmax(0,1fr)); overflow: auto; max-height: 190px; border-right: 0; border-bottom: 1px solid rgba(0,240,255,.13); }.cpwb-settings-nav > span { grid-column: 1 / -1; }.cpwb-settings-content { padding: 18px; }\n  body .cpwb-subagent-drawer { width: 100vw; }\n  .cpwb-subagent-selector { padding-left: 12px; padding-right: 12px; }\n  .cpwb-subagent-selector-menu { left: 12px; right: 12px; }\n  .cpwb-subagent-selector-menu button { grid-template-columns: 30px minmax(0,1fr); }\n  .cpwb-subagent-selector-menu button em { display: none; }\n  body .cpwb-model-indicator { max-width: 150px; padding-left: 9px; padding-right: 9px; }\n}\n\n@media (max-width: 390px) {\n  .cpwb-hero h1 { font-size: 30px; }\n  .cpwb-kcard-new { display: none; }\n  .cpwb-knowledge-card { grid-template-columns: 45px minmax(0,1fr); }\n  .cpwb-home-footer { font-size: 6px; }\n}\n\n/* Unified-shell responsive behavior. Tablet keeps a compact docked navigation\n   and moves project tools into a modal drawer; mobile makes both sides modal. */\n.cpwb-mobile-nav-trigger,\n.cpwb-project-tool-toggle {\n  appearance: none;\n  position: absolute;\n  z-index: 80;\n  top: 12px;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  min-height: 38px;\n  color: var(--cpwb-text);\n  border: 1px solid var(--cpwb-border-strong);\n  background: var(--cpwb-surface-raised);\n  box-shadow: var(--cpwb-shadow-1);\n  clip-path: var(--cpwb-cut-sm);\n  cursor: pointer;\n  pointer-events: auto;\n}\n.cpwb-mobile-nav-trigger { left: 12px; width: 42px; justify-content: center; padding: 0; }\n.cpwb-project-tool-toggle { right: 12px; padding: 0 13px; color: var(--cpwb-amber); }\n.cpwb-responsive-drawer {\n  position: fixed;\n  z-index: 150;\n  top: 0;\n  bottom: 0;\n  width: min(88vw, 320px);\n  max-width: none;\n  height: 100dvh;\n  max-height: none;\n  margin: 0;\n  padding: 0;\n  overflow: visible;\n  color: var(--cpwb-text);\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: var(--cpwb-shadow-2);\n  clip-path: none;\n  pointer-events: auto;\n}\n.cpwb-responsive-drawer::backdrop { background: rgba(1, 3, 7, .74); backdrop-filter: blur(5px); }\n.cpwb-drawer-left { left: 0; right: auto; }\n.cpwb-drawer-right { left: auto; right: 0; }\n.cpwb-responsive-drawer .cpwb-global-sidebar { width: 100%; }\n.cpwb-responsive-drawer .cpwb-project-rail-drawer { position: relative; inset: auto; width: 100%; height: 100%; }\n.cpwb-sidebar-settings {\n  appearance: none;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 38px;\n  padding: 0 11px;\n  color: var(--cpwb-text-secondary);\n  border: 1px solid var(--cpwb-border-strong);\n  background: var(--cpwb-surface-raised);\n  clip-path: var(--cpwb-cut-sm);\n  cursor: pointer;\n}\n.cpwb-sidebar-settings:hover { color: var(--cpwb-text); background: var(--cpwb-cyan-soft); }\n\n/* A draft is deliberately a Workbench-only surface. The native conversation\n   becomes visible only after the first prompt has created a durable session. */\n.cpwb-draft-conversation {\n  box-sizing: border-box;\n  min-width: 0;\n  height: 100%;\n  display: grid;\n  grid-template-rows: 64px minmax(0, 1fr) auto;\n  padding: 0 clamp(18px, 3vw, 52px) 28px;\n  color: var(--cpwb-text);\n  background:\n    radial-gradient(circle at 76% 8%, rgba(121, 25, 43, .22), transparent 34%),\n    linear-gradient(180deg, rgba(7, 10, 15, .96), rgba(8, 9, 14, .99));\n}\n.cpwb-draft-conversation > header {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  min-width: 0;\n  border-bottom: 1px solid rgba(0, 240, 255, .22);\n}\n.cpwb-draft-conversation > header span { color: var(--cpwb-cyan); font: 650 9px/1 var(--cpwb-code); letter-spacing: .16em; }\n.cpwb-draft-conversation > header strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.cpwb-draft-conversation > header button { margin-left: auto; color: var(--cpwb-muted); border: 0; background: transparent; cursor: pointer; }\n.cpwb-draft-empty { align-self: center; justify-self: center; max-width: 520px; text-align: center; color: var(--cpwb-text-secondary); }\n.cpwb-draft-empty svg { color: var(--cpwb-cyan); }\n.cpwb-draft-empty h2 { margin: 16px 0 8px; color: var(--cpwb-text); font-size: clamp(20px, 2.1vw, 30px); }\n.cpwb-draft-empty p { margin: 0; line-height: 1.75; }\n.cpwb-draft-composer {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 12px;\n  width: min(100%, 920px);\n  margin: 0 auto;\n  padding: 14px;\n  border: 1px solid rgba(0, 240, 255, .38);\n  background: rgba(10, 13, 20, .82);\n  box-shadow: 0 18px 48px rgba(0, 0, 0, .32);\n  clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);\n}\n.cpwb-draft-composer textarea { box-sizing: border-box; min-height: 92px; resize: vertical; padding: 8px 10px; color: var(--cpwb-text); border: 0; outline: 0; background: transparent; font: inherit; }\n.cpwb-draft-composer > button { align-self: end; min-width: 104px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; color: #090a0e; border: 0; background: var(--cpwb-amber); font-weight: 760; cursor: pointer; }\n.cpwb-draft-composer > button:disabled { opacity: .45; cursor: not-allowed; }\n.cpwb-draft-error { grid-column: 1 / -1; margin: 0; color: var(--cpwb-red); font-size: 12px; }\n\n.cpwb-new-session-host { width: min(680px, calc(100vw - 28px)); padding: 0; color: var(--cpwb-text); border: 1px solid rgba(0, 240, 255, .42); background: rgba(8, 10, 16, .97); box-shadow: 0 28px 90px rgba(0, 0, 0, .66); clip-path: var(--cpwb-cut-lg); }\n.cpwb-new-session-host::backdrop { background: rgba(2, 3, 7, .78); backdrop-filter: blur(7px); }\n.cpwb-new-session-dialog { display: grid; gap: 22px; padding: clamp(22px, 4vw, 38px); }\n.cpwb-new-session-dialog header { padding-left: 18px; border-left: 2px solid var(--cpwb-cyan); }\n.cpwb-new-session-dialog header > span { color: var(--cpwb-cyan); font: 650 9px/1 var(--cpwb-code); letter-spacing: .2em; }\n.cpwb-new-session-dialog h2 { margin: 8px 0 6px; font-size: 28px; }\n.cpwb-new-session-dialog header p { margin: 0; color: var(--cpwb-muted); line-height: 1.55; }\n.cpwb-owner-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; padding: 0; border: 0; }\n.cpwb-owner-options legend, .cpwb-owner-select > span { margin-bottom: 9px; color: var(--cpwb-muted); font: 650 9px/1 var(--cpwb-code); letter-spacing: .15em; text-transform: uppercase; }\n.cpwb-owner-options legend { grid-column: 1 / -1; }\n.cpwb-owner-options label { position: relative; display: flex; align-items: center; gap: 9px; min-height: 50px; padding: 0 13px; color: var(--cpwb-text-secondary); border: 1px solid var(--cpwb-border-strong); background: rgba(14, 17, 24, .76); cursor: pointer; }\n.cpwb-owner-options label.cpwb-active { color: var(--cpwb-text); border-color: var(--cpwb-cyan); background: var(--cpwb-cyan-soft); box-shadow: inset 3px 0 0 var(--cpwb-cyan); }\n.cpwb-owner-options input { position: absolute; opacity: 0; pointer-events: none; }\n.cpwb-owner-select { display: grid; }\n.cpwb-owner-select select { min-height: 44px; padding: 0 12px; color: var(--cpwb-text); border: 1px solid var(--cpwb-border-strong); background: var(--cpwb-surface-raised); }\n.cpwb-context-preview { padding: 15px 17px; border: 1px solid rgba(0, 240, 255, .2); background: rgba(0, 240, 255, .035); }\n.cpwb-context-preview > div { display: flex; align-items: center; gap: 9px; color: var(--cpwb-cyan); }\n.cpwb-context-preview ul { margin: 11px 0 0 26px; padding: 0; color: var(--cpwb-text-secondary); line-height: 1.7; }\n.cpwb-new-session-dialog footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }\n.cpwb-button-ghost, .cpwb-button-primary { min-height: 42px; padding: 0 17px; border: 1px solid var(--cpwb-border-strong); cursor: pointer; }\n.cpwb-button-ghost { color: var(--cpwb-text-secondary); background: transparent; }\n.cpwb-button-primary { display: inline-flex; align-items: center; gap: 8px; color: #08090d; border-color: var(--cpwb-amber); background: var(--cpwb-amber); font-weight: 760; }\n.cpwb-button-primary:disabled { opacity: .42; cursor: not-allowed; }\n\n@media (min-width: 900px) and (max-width: 1279px) {\n  .cpwb-app-shell { grid-template-columns: 190px minmax(0, 1fr); }\n  .cpwb-global-sidebar { padding: 14px 12px 12px; }\n  .cpwb-sidebar-product { margin-bottom: 15px; font-size: 12px; }\n  .cpwb-sidebar-new { min-height: 40px; }\n  .cpwb-sidebar-nav-item { min-height: 36px; }\n  .cpwb-sidebar-recents { margin-top: 15px; }\n  .cpwb-sidebar-recent { padding: 7px 6px; }\n  .cpwb-sidebar-fixed-footer .cpwb-sidebar-brand-footer { padding-top: 4px; }\n  .cpwb-sidebar-wordmark svg { width: 154px; }\n  .cpwb-workbench-page { padding: 30px 26px; }\n  .cpwb-knowledge-center-body > div { grid-template-columns: minmax(220px, .8fr) minmax(0, 1.2fr); }\n  .cpwb-has-context-rail .cpwb-session-context-bar { right: 130px; }\n}\n\n@media (max-width: 899px) {\n  .cpwb-app-shell { grid-template-columns: minmax(0, 1fr); }\n  .cpwb-workbench-page { padding: 62px 14px 18px; }\n  .cpwb-home-main { padding-top: 68px; }\n  .cpwb-home-footer { left: 0; }\n  .cpwb-project-grid { grid-template-columns: 1fr; }\n  .cpwb-knowledge-center-body > div { grid-template-columns: 1fr; }\n  .cpwb-session-filters { grid-template-columns: minmax(0, 1fr); }\n  .cpwb-page-header { align-items: flex-start; padding: 16px 16px 18px; }.cpwb-page-header-stat { align-self: flex-end; }.cpwb-page-header-stat strong { font-size: 18px; }\n  .cpwb-session-list-row { grid-template-columns: auto minmax(0, 1fr); }\n  .cpwb-session-list-row time { display: none; }\n  .cpwb-responsive-drawer .cpwb-global-sidebar { padding: 16px 14px 12px; }\n  .cpwb-session-context-bar { top: 58px; left: 12px; right: 12px; }\n  .cpwb-has-context-rail .cpwb-session-context-bar { right: 12px; }\n  .cpwb-session-context-bar small,\n  .cpwb-session-context-bar em { display: none; }\n  .cpwb-session-context-meta { display: flex; }\n  .cpwb-session-subagent-trigger span { display: none; }\n  .cpwb-subagent-drawer { width: min(92vw, 620px); }\n  .cpwb-model-indicator { max-width: 190px; }\n  .cpwb-recurrence-picker { grid-template-columns: repeat(2, 1fr); }\n  .cpwb-schedule-row { grid-template-columns: 28px minmax(0,1fr) 27px 27px; }.cpwb-schedule-state { display: none; }\n  body:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:not(.cpwb-responsive-drawer):has(nav button[aria-current]) {\n    flex-direction: column;\n    width: calc(100vw - 24px);\n    max-width: none;\n    height: calc(100dvh - 24px);\n    max-height: none;\n  }\n  body:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:not(.cpwb-responsive-drawer):has(nav button[aria-current]) > nav {\n    box-sizing: border-box;\n    width: 100%;\n    padding: 15px 12px 0;\n  }\n  body:has(.cpwb-app-shell) [role="dialog"][aria-modal="true"]:not(.cpwb-responsive-drawer):has(nav button[aria-current]) > nav > div:last-child {\n    flex-direction: row;\n    overflow-x: auto;\n  }\n  .cpwb-settings-content { padding-top: 14px; }\n  .cpwb-draft-conversation { grid-template-rows: 58px minmax(0, 1fr) auto; padding: 0 12px 14px; }\n  .cpwb-draft-composer { grid-template-columns: minmax(0, 1fr); }\n  .cpwb-draft-composer > button { justify-self: end; }\n  .cpwb-owner-options { grid-template-columns: 1fr; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .cpwb-project-card, .cpwb-knowledge-card, .cpwb-card-scan, .cpwb-drawer, .cpwb-home-loading i { animation: none !important; }\n  .cpwb-project-card, .cpwb-knowledge-card, .cpwb-folder-add { transition: none !important; }\n}\n\n@media (prefers-reduced-transparency: reduce) {\n  .cpwb-home-identity,\n  .cpwb-project-card,\n  .cpwb-knowledge-card,\n  .cpwb-panel,\n  .cpwb-global-sidebar,\n  .cpwb-project-rail,\n  .cpwb-responsive-drawer,\n  .cpwb-settings-panel,\n  .cpwb-wordmark-launcher {\n    backdrop-filter: none;\n    background-color: var(--cpwb-surface-panel);\n  }\n}\n';

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
function localDateKey(date = /* @__PURE__ */ new Date()) {
  const y = date.getFullYear();
  const m10 = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m10 + "-" + d;
}
function toError(err) {
  if (err && typeof err.code === "string") {
    return { code: err.code, message: err && typeof err.message === "string" ? err.message : String(err) };
  }
  return { code: "UNKNOWN", message: err && typeof err.message === "string" ? err.message : String(err) };
}
function isAborted(err, ac) {
  return err && err.code === "ABORTED" || ac && ac.signal && ac.signal.aborted;
}
function loadAutomation(api, projectId, signal) {
  if (typeof api.automation?.get !== "function") return Promise.resolve({ projectId, summaryEnabled: true, nextDayTodosEnabled: true });
  return api.automation.get(projectId, { signal }).catch(function(err) {
    if (err && (err.code === "NOT_FOUND" || err.status === 404)) return { projectId, summaryEnabled: true, nextDayTodosEnabled: true };
    throw err;
  });
}
function loadScheduleRuns(api, schedules, signal) {
  if (typeof api.schedules?.runs !== "function") return Promise.resolve({});
  return Promise.all((Array.isArray(schedules) ? schedules : []).map(
    (schedule) => api.schedules.runs(schedule.id, { signal }).catch(function(err) {
      if (err && (err.code === "NOT_FOUND" || err.status === 404)) return [];
      throw err;
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
    sessionPage: { items: [], total: 0, limit: 20, offset: 0, query: "", context: null },
    workbenchSessions: {},
    citationsBySession: {},
    contextBySession: {},
    scopeSessionPage: { items: [], total: 0, limit: 3, offset: 0 },
    globalSchedules: [],
    linkedProjects: []
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
        } catch (err) {
          if (disposed || mySeq !== seq) return void 0;
          if (isAborted(err, ac)) return void 0;
          setState({ error: toError(err) });
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
      const sessionPage = await fetchSessionPage({ limit: 8, offset: 0 }, ac.signal);
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
    } catch (err) {
      if (disposed || seq !== refreshSeq) return;
      if (isAborted(err, ac)) return;
      setState({ phase: "error", error: toError(err) });
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
    } catch (err) {
      if (disposed || seq !== projectSeq) return;
      if (isAborted(err, ac)) return;
      setState({ error: toError(err), action: { type: "refreshProject", status: "error", error: toError(err) } });
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
  function projectIdFor(collection, id) {
    const arr = state[collection];
    if (Array.isArray(arr)) {
      const item = arr.find((x) => x.id === id);
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
    } catch (err) {
      setState({ action: { type, ...meta, status: "error", error: toError(err) } });
      throw err;
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
    loadRecentSessions: async function loadRecentSessions({ limit = 8 } = {}) {
      return loadRecent.run(limit);
    },
    loadAllSessions: async function loadAllSessions({ query = "", scopeKind = null, scopeId = null, offset = 0, limit = 20 } = {}) {
      return loadSessionPage.run({ query, scopeKind, scopeId, offset, limit });
    },
    loadScopeSessions: async function loadScopeSessions(scope) {
      const normalized = normalizeSessionScope(scope);
      if (normalized.kind === "independent") {
        const page2 = { items: [], total: 0, limit: 3, offset: 0 };
        setState({ scopeSessionPage: page2 });
        return page2;
      }
      const page = await fetchSessionPage({ scopeKind: normalized.kind, scopeId: normalized.id, limit: 3, offset: 0 });
      setState({ scopeSessionPage: page });
      return page;
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
    discardDraft: function discardDraft() {
      setState({ draft: null });
    },
    activateDraft: async function activateDraft({ text, oneShotSources = [] }) {
      const question = typeof text === "string" ? text.trim() : "";
      if (!question) throw new TypeError("\u9996\u6761\u6D88\u606F\u4E0D\u80FD\u4E3A\u7A7A");
      const draft = state.draft;
      if (!draft) throw new TypeError("\u5F53\u524D\u6CA1\u6709\u5F85\u6FC0\u6D3B\u7684\u4F1A\u8BDD\u8349\u7A3F");
      setState({ draft: { ...draft, text, status: "activating", error: null } });
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("activateDraft", () => api.chat.sessions.create({
          scope: draft.scope,
          question,
          pinnedSources: draft.pinnedSources,
          oneShotSources
        }, { signal: ac.signal }));
      } catch (error) {
        const details = error?.details;
        setState({ draft: {
          ...draft,
          text,
          status: details?.lifecycleStatus === "draft_failed" ? "draft_failed" : "error",
          sessionId: details?.sessionId ?? null,
          error: toError(error)
        } });
        throw error;
      } finally {
        untrack(ac);
      }
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId: result.sessionId, scope: entry.scope });
      setState({
        draft: null,
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
        citationsBySession: { ...state.citationsBySession, [result.sessionId]: Array.isArray(result.citations) ? result.citations : [] }
      });
      await loadRecent.run(8);
      return result;
    },
    retryDraft: async function retryDraft({ text, oneShotSources = [] }) {
      const draft = state.draft;
      const question = typeof text === "string" ? text.trim() : "";
      if (!draft?.sessionId || draft.status !== "draft_failed") throw new TypeError("\u5F53\u524D\u8349\u7A3F\u4E0D\u53EF\u91CD\u8BD5");
      if (!question) throw new TypeError("\u9996\u6761\u6D88\u606F\u4E0D\u80FD\u4E3A\u7A7A");
      const ac = track(new AbortController());
      let result;
      try {
        result = await runAction("retryDraft", () => api.chat.sessions.retry({
          sessionId: draft.sessionId,
          question,
          oneShotSources
        }, { signal: ac.signal }));
      } catch (error) {
        setState({ draft: { ...draft, text, status: "draft_failed", error: toError(error) } });
        throw error;
      } finally {
        untrack(ac);
      }
      const entry = normalizeSessionRow({ ...result, scope: result.scope ?? draft.scope });
      registerWorkbenchSession({ sessionId: result.sessionId, scope: entry.scope });
      setState({
        draft: null,
        workbenchSessions: { ...state.workbenchSessions, [result.sessionId]: entry },
        citationsBySession: { ...state.citationsBySession, [result.sessionId]: Array.isArray(result.citations) ? result.citations : [] }
      });
      await loadRecent.run(8);
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
      await loadRecent.run(8);
      return entry;
    },
    moveSession: async function moveSession({ sessionId, scope }) {
      const result = await runAction("moveSession", () => api.chat.sessions.move({ sessionId, scope: normalizeSessionScope(scope) }));
      const entry = normalizeSessionRow(result);
      registerWorkbenchSession({ sessionId, scope: entry.scope });
      setState({ workbenchSessions: { ...state.workbenchSessions, [sessionId]: entry } });
      await loadRecent.run(8);
      return entry;
    },
    deleteSession: async function deleteSession(sessionId) {
      const result = await runAction("deleteSession", () => api.chat.sessions.remove(sessionId));
      const next = { ...state.workbenchSessions };
      delete next[sessionId];
      setState({ workbenchSessions: next });
      await loadRecent.run(8);
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
    deleteProject: async function deleteProject(id) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteProject", () => api.projects.remove(id, { signal: ac.signal }), { projectId: id });
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
    deleteKnowledgeBase: async function deleteKnowledgeBase(id) {
      const ac = track(new AbortController());
      try {
        await runAction("deleteKnowledgeBase", () => api.knowledgeBases.remove(id, { signal: ac.signal }), { knowledgeBaseId: id });
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
      await loadLinked.run(projectId);
    },
    unlinkProjectKnowledgeBase: async function unlinkProjectKnowledgeBase(projectId, knowledgeBaseId) {
      const ac = track(new AbortController());
      try {
        await runAction("unlinkProjectKnowledgeBase", () => api.projectKnowledgeBases.unlink(projectId, knowledgeBaseId, { signal: ac.signal }));
      } finally {
        untrack(ac);
      }
      await loadLinked.run(projectId);
    },
    uploadFiles: async function uploadFiles({ files, scope, scopeId }) {
      const list = Array.isArray(files) ? files : [files];
      if (list.length === 0) return { ok: true, uploaded: [], failures: [] };
      setState({ action: { type: "upload", status: "running", error: null, done: 0, total: list.length } });
      const uploaded = [];
      const failures = [];
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        const ac = track(new AbortController());
        try {
          const res = await api.documents.upload({ file, scope, scopeId }, { signal: ac.signal });
          uploaded.push({ file, document: res.document });
        } catch (err) {
          failures.push({ file, error: toError(err) });
        } finally {
          untrack(ac);
        }
        setState({ action: { type: "upload", status: "running", error: null, done: i + 1, total: list.length } });
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
      try {
        await runAction("runSchedule", () => api.schedules.run(id, { signal: ac.signal }), { scheduleId: id });
      } finally {
        untrack(ac);
      }
      if (state.activeProjectId != null) await refreshProject(state.activeProjectId, lastToday ?? localDateKey());
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
  const s11 = sp.toString();
  return s11 ? "?" + s11 : "";
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
      const err = data && typeof data.error === "object" && data.error !== null ? data.error : {};
      const code = typeof err.code === "string" && err.code ? err.code : "HTTP_" + response.status;
      const message = typeof err.message === "string" && err.message ? err.message : "request failed";
      throw new CpwbApiError(code, message, response.status, err.details);
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
      remove(id, { signal } = {}) {
        return request2({ method: "DELETE", path: "/projects/" + id, signal });
      }
    },
    knowledgeBases: {
      list({ signal } = {}) {
        return request2({ path: "/knowledge-bases", signal });
      },
      create({ name, description }, { signal } = {}) {
        return request2({ method: "POST", path: "/knowledge-bases", body: { name, description }, signal });
      },
      remove(id, { signal } = {}) {
        return request2({ method: "DELETE", path: "/knowledge-bases/" + id, signal });
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
    documents: {
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
    chat: {
      sessions: {
        list({ scopeKind, scopeId, limit, offset, query } = {}, { signal } = {}) {
          return request2({
            path: "/chat/sessions",
            query: { scopeKind, scopeId, limit, offset, query },
            signal
          });
        },
        create({ scope, question, pinnedSources = [], oneShotSources = [] }, { signal } = {}) {
          return request2({ method: "POST", path: "/chat/sessions", body: { scope, question, pinnedSources, oneShotSources }, signal });
        },
        open(sessionId, { signal } = {}) {
          return request2({ method: "POST", path: "/chat/sessions/" + encodeURIComponent(sessionId) + "/open", body: {}, signal });
        },
        retry({ sessionId, question, oneShotSources = [] }, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "retryDraft", question, oneShotSources }, signal });
        },
        rename({ sessionId, title }, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "rename", title }, signal });
        },
        move({ sessionId, scope }, { signal } = {}) {
          return request2({ method: "PATCH", path: "/chat/sessions/" + encodeURIComponent(sessionId), body: { operation: "move", scope }, signal });
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

// src/client/navigation.js
var PAGES = /* @__PURE__ */ new Set(["home", "knowledge", "sessions", "draft", "conversation"]);
function createNavigationStore({ initialPage = "home" } = {}) {
  if (!PAGES.has(initialPage)) throw new TypeError("unknown Workbench page: " + initialPage);
  let snapshot = { page: initialPage, sessionId: null };
  const listeners = /* @__PURE__ */ new Set();
  function publish(page, sessionId = null) {
    const next = { page, sessionId };
    if (snapshot.page === next.page && snapshot.sessionId === next.sessionId) return;
    snapshot = next;
    for (const listener of listeners) listener();
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
      publish("home");
    },
    openKnowledge() {
      publish("knowledge");
    },
    openSessions() {
      publish("sessions");
    },
    openDraft() {
      publish("draft");
    },
    openConversation(sessionId) {
      if (typeof sessionId !== "string" || sessionId.length === 0) {
        throw new TypeError("sessionId is required");
      }
      publish("conversation", sessionId);
    }
  };
}

// src/client/WorkbenchShell.js
var import_react26 = __toESM(require("react"), 1);

// node_modules/@phosphor-icons/react/dist/defs/ArrowClockwise.es.js
var e = __toESM(require("react"), 1);
var a = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("path", { d: "M244,56v48a12,12,0,0,1-12,12H184a12,12,0,1,1,0-24H201.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76,76,0,1,0,127,204h1a75.53,75.53,0,0,0,52.15-20.72,12,12,0,0,1,16.49,17.45A99.45,99.45,0,0,1,128,228h-1.37A100,100,0,1,1,198.51,57.06L220,76.72V56a12,12,0,0,1,24,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("path", { d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z", opacity: "0.2" }), /* @__PURE__ */ e.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1-5.66-13.66l17-17-10.55-9.65-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,1,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60l10.93,10L226.34,50.3A8,8,0,0,1,240,56Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("path", { d: "M238,56v48a6,6,0,0,1-6,6H184a6,6,0,0,1,0-12h32.55l-30.38-27.8c-.06-.06-.12-.13-.19-.19a82,82,0,1,0-1.7,117.65,6,6,0,0,1,8.24,8.73A93.46,93.46,0,0,1,128,222h-1.28A94,94,0,1,1,194.37,61.4L226,90.35V56a6,6,0,1,1,12,0Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("path", { d: "M236,56v48a4,4,0,0,1-4,4H184a4,4,0,0,1,0-8h37.7L187.53,68.69l-.13-.12a84,84,0,1,0-1.75,120.51,4,4,0,0,1,5.5,5.82A91.43,91.43,0,0,1,128,220h-1.26A92,92,0,1,1,193,62.84l35,32.05V56a4,4,0,1,1,8,0Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowRight.es.js
var e2 = __toESM(require("react"), 1);
var a2 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M216,128l-72,72V56Z", opacity: "0.2" }), /* @__PURE__ */ e2.createElement("path", { d: "M221.66,122.34l-72-72A8,8,0,0,0,136,56v64H40a8,8,0,0,0,0,16h96v64a8,8,0,0,0,13.66,5.66l72-72A8,8,0,0,0,221.66,122.34ZM152,180.69V75.31L204.69,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M221.66,133.66l-72,72A8,8,0,0,1,136,200V136H40a8,8,0,0,1,0-16h96V56a8,8,0,0,1,13.66-5.66l72,72A8,8,0,0,1,221.66,133.66Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M220.24,132.24l-72,72a6,6,0,0,1-8.48-8.48L201.51,134H40a6,6,0,0,1,0-12H201.51L139.76,60.24a6,6,0,0,1,8.48-8.48l72,72A6,6,0,0,1,220.24,132.24Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e2.createElement(e2.Fragment, null, /* @__PURE__ */ e2.createElement("path", { d: "M218.83,130.83l-72,72a4,4,0,0,1-5.66-5.66L206.34,132H40a4,4,0,0,1,0-8H206.34L141.17,58.83a4,4,0,0,1,5.66-5.66l72,72A4,4,0,0,1,218.83,130.83Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ArrowUpRight.es.js
var e3 = __toESM(require("react"), 1);
var a3 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e3.createElement(e3.Fragment, null, /* @__PURE__ */ e3.createElement("path", { d: "M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e3.createElement(e3.Fragment, null, /* @__PURE__ */ e3.createElement("path", { d: "M192,64V168L88,64Z", opacity: "0.2" }), /* @__PURE__ */ e3.createElement("path", { d: "M192,56H88a8,8,0,0,0-5.66,13.66L128.69,116,58.34,186.34a8,8,0,0,0,11.32,11.32L140,127.31l46.34,46.35A8,8,0,0,0,200,168V64A8,8,0,0,0,192,56Zm-8,92.69-38.34-38.34h0L107.31,72H184Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e3.createElement(e3.Fragment, null, /* @__PURE__ */ e3.createElement("path", { d: "M200,64V168a8,8,0,0,1-13.66,5.66L140,127.31,69.66,197.66a8,8,0,0,1-11.32-11.32L128.69,116,82.34,69.66A8,8,0,0,1,88,56H192A8,8,0,0,1,200,64Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e3.createElement(e3.Fragment, null, /* @__PURE__ */ e3.createElement("path", { d: "M198,64V168a6,6,0,0,1-12,0V78.48L68.24,196.24a6,6,0,0,1-8.48-8.48L177.52,70H88a6,6,0,0,1,0-12H192A6,6,0,0,1,198,64Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e3.createElement(e3.Fragment, null, /* @__PURE__ */ e3.createElement("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e3.createElement(e3.Fragment, null, /* @__PURE__ */ e3.createElement("path", { d: "M196,64V168a4,4,0,0,1-8,0V73.66L66.83,194.83a4,4,0,0,1-5.66-5.66L182.34,68H88a4,4,0,0,1,0-8H192A4,4,0,0,1,196,64Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Books.es.js
var a4 = __toESM(require("react"), 1);
var e4 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a4.createElement(a4.Fragment, null, /* @__PURE__ */ a4.createElement("path", { d: "M235.57,193.73,202.38,35.93a20,20,0,0,0-23.76-15.48L131.81,30.51a19.82,19.82,0,0,0-11,6.65A20,20,0,0,0,104,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V90.25l25.62,121.82A20,20,0,0,0,169.15,228a20.27,20.27,0,0,0,4.23-.45l46.81-10.06A20.1,20.1,0,0,0,235.57,193.73ZM148.19,88.65l39-8.38,2.53,12-39,8.38Zm7.46,35.5,39-8.38,9.16,43.58-39,8.38Zm24.06-79.39,2.53,12-39,8.38-2.53-12ZM60,88h40v80H60Zm40-36V64H60V52ZM60,204V192h40v12Zm112.29-.76-2.53-12,39-8.38,2.53,12Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a4.createElement(a4.Fragment, null, /* @__PURE__ */ a4.createElement(
      "path",
      {
        d: "M48,72h64V184H48ZM190.64,38.39a8,8,0,0,0-9.5-6.21l-46.81,10a8.07,8.07,0,0,0-6.15,9.57L139.79,107l62.46-13.42Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a4.createElement("path", { d: "M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a4.createElement(a4.Fragment, null, /* @__PURE__ */ a4.createElement("path", { d: "M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm10,47.38-3.35-15.9,46.82-10.06,3.34,15.9Zm70,100.41-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm48,160H56V192h48v16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a4.createElement(a4.Fragment, null, /* @__PURE__ */ a4.createElement("path", { d: "M104,34H56A14,14,0,0,0,42,48V208a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V48A14,14,0,0,0,104,34ZM54,78h52V178H54Zm2-32h48a2,2,0,0,1,2,2V66H54V48A2,2,0,0,1,56,46Zm48,164H56a2,2,0,0,1-2-2V190h52v18A2,2,0,0,1,104,210Zm125.7-15L196.51,37.16a14,14,0,0,0-16.63-10.85L133.07,36.37A14.09,14.09,0,0,0,122.3,53l33.19,157.81a14,14,0,0,0,6.1,8.9,13.85,13.85,0,0,0,7.57,2.26,13.55,13.55,0,0,0,3-.32l46.81-10.05A14.09,14.09,0,0,0,229.7,195Zm-82.81-83.32,50.73-10.9,14.12,67.16L161,178.81Zm-6.63-31.56L191,69.19,195.15,89l-50.73,10.9Zm-4.66-32,46.8-10.05a2.18,2.18,0,0,1,.42,0,1.89,1.89,0,0,1,1.05.32,2,2,0,0,1,.89,1.31l3.75,17.82L137.79,68.34l-3.74-17.78A2.07,2.07,0,0,1,135.6,48.1Zm80.81,151.8L169.6,210a1.92,1.92,0,0,1-1.47-.27,2,2,0,0,1-.89-1.31l-3.75-17.82,50.72-10.9L218,197.43A2.07,2.07,0,0,1,216.41,199.9Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a4.createElement(a4.Fragment, null, /* @__PURE__ */ a4.createElement("path", { d: "M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55ZM136,50.15c0-.06,0-.09,0-.09l46.8-10,3.33,15.87L139.33,66Zm6.62,31.47,46.82-10.05,3.34,15.9L146,97.53Zm6.64,31.57,46.82-10.06,13.3,63.24-46.82,10.06ZM216,197.94l-46.8,10-3.33-15.87L212.67,182,216,197.85C216,197.91,216,197.94,216,197.94ZM104,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32ZM56,48h48V64H56Zm0,32h48v96H56Zm48,128H56V192h48v16Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a4.createElement(a4.Fragment, null, /* @__PURE__ */ a4.createElement("path", { d: "M104,36H56A12,12,0,0,0,44,48V208a12,12,0,0,0,12,12h48a12,12,0,0,0,12-12V48A12,12,0,0,0,104,36ZM52,76h56V180H52Zm4-32h48a4,4,0,0,1,4,4V68H52V48A4,4,0,0,1,56,44Zm48,168H56a4,4,0,0,1-4-4V188h56v20A4,4,0,0,1,104,212Zm123.74-16.62L194.55,37.57a12,12,0,0,0-14.25-9.3L133.49,38.32a12.1,12.1,0,0,0-9.23,14.3l33.19,157.81a12,12,0,0,0,14.25,9.3l46.81-10.06h0A12.08,12.08,0,0,0,227.74,195.38Zm-83.21-85.27,54.63-11.73,15,71.07-54.63,11.74Zm-6.64-31.56,54.64-11.74,5,23.74-54.64,11.73Zm-2.71-32.4L182,36.09a4,4,0,0,1,.84-.09,3.94,3.94,0,0,1,2.14.64,4,4,0,0,1,1.76,2.58L190.88,59,136.24,70.72,132.09,51A4.07,4.07,0,0,1,135.18,46.15Zm81.65,155.7L170,211.91a4,4,0,0,1-3-.55,4,4,0,0,1-1.76-2.58L161.12,189l54.64-11.73L219.91,197A4.07,4.07,0,0,1,216.83,201.85Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CalendarBlank.es.js
var a5 = __toESM(require("react"), 1);
var e5 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a5.createElement(a5.Fragment, null, /* @__PURE__ */ a5.createElement("path", { d: "M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a5.createElement(a5.Fragment, null, /* @__PURE__ */ a5.createElement(
      "path",
      {
        d: "M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a5.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a5.createElement(a5.Fragment, null, /* @__PURE__ */ a5.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,48H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a5.createElement(a5.Fragment, null, /* @__PURE__ */ a5.createElement("path", { d: "M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a5.createElement(a5.Fragment, null, /* @__PURE__ */ a5.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a5.createElement(a5.Fragment, null, /* @__PURE__ */ a5.createElement("path", { d: "M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM48,44H76V56a4,4,0,0,0,8,0V44h88V56a4,4,0,0,0,8,0V44h28a4,4,0,0,1,4,4V84H44V48A4,4,0,0,1,48,44ZM208,212H48a4,4,0,0,1-4-4V92H212V208A4,4,0,0,1,208,212Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CalendarCheck.es.js
var a6 = __toESM(require("react"), 1);
var V = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement(
      "path",
      {
        d: "M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a6.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM169.66,133.66l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35a8,8,0,0,1,11.32,11.32ZM48,80V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-39.76-86.24a6,6,0,0,1,0,8.48l-48,48a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L116,167.51l43.76-43.75A6,6,0,0,1,168.24,123.76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a6.createElement(a6.Fragment, null, /* @__PURE__ */ a6.createElement("path", { d: "M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM48,44H76V56a4,4,0,0,0,8,0V44h88V56a4,4,0,0,0,8,0V44h28a4,4,0,0,1,4,4V84H44V48A4,4,0,0,1,48,44ZM208,212H48a4,4,0,0,1-4-4V92H212V208A4,4,0,0,1,208,212Zm-41.17-86.83a4,4,0,0,1,0,5.66l-48,48a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L116,170.34l45.17-45.17A4,4,0,0,1,166.83,125.17Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CaretDown.es.js
var e6 = __toESM(require("react"), 1);
var t = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e6.createElement(e6.Fragment, null, /* @__PURE__ */ e6.createElement("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e6.createElement(e6.Fragment, null, /* @__PURE__ */ e6.createElement("path", { d: "M208,96l-80,80L48,96Z", opacity: "0.2" }), /* @__PURE__ */ e6.createElement("path", { d: "M215.39,92.94A8,8,0,0,0,208,88H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,215.39,92.94ZM128,164.69,67.31,104H188.69Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e6.createElement(e6.Fragment, null, /* @__PURE__ */ e6.createElement("path", { d: "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e6.createElement(e6.Fragment, null, /* @__PURE__ */ e6.createElement("path", { d: "M212.24,100.24l-80,80a6,6,0,0,1-8.48,0l-80-80a6,6,0,0,1,8.48-8.48L128,167.51l75.76-75.75a6,6,0,0,1,8.48,8.48Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e6.createElement(e6.Fragment, null, /* @__PURE__ */ e6.createElement("path", { d: "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e6.createElement(e6.Fragment, null, /* @__PURE__ */ e6.createElement("path", { d: "M210.83,98.83l-80,80a4,4,0,0,1-5.66,0l-80-80a4,4,0,0,1,5.66-5.66L128,170.34l77.17-77.17a4,4,0,1,1,5.66,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ChatCircleText.es.js
var a7 = __toESM(require("react"), 1);
var e7 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a7.createElement(a7.Fragment, null, /* @__PURE__ */ a7.createElement("path", { d: "M172,108a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,108Zm-12,28H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm76-8A108,108,0,0,1,78.77,224.15L46.34,235A20,20,0,0,1,21,209.66l10.81-32.43A108,108,0,1,1,236,128Zm-24,0A84,84,0,1,0,55.27,170.06a12,12,0,0,1,1,9.81l-9.93,29.79,29.79-9.93a12.1,12.1,0,0,1,3.8-.62,12,12,0,0,1,6,1.62A84,84,0,0,0,212,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a7.createElement(a7.Fragment, null, /* @__PURE__ */ a7.createElement(
      "path",
      {
        d: "M224,128A96,96,0,0,1,79.93,211.11h0L42.54,223.58a8,8,0,0,1-10.12-10.12l12.47-37.39h0A96,96,0,1,1,224,128Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a7.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-4-1.08,7.85,7.85,0,0,0-2.53.42L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Zm40-104a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,112Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,144Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a7.createElement(a7.Fragment, null, /* @__PURE__ */ a7.createElement("path", { d: "M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm32,128H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a7.createElement(a7.Fragment, null, /* @__PURE__ */ a7.createElement("path", { d: "M166,112a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,112Zm-6,26H96a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm70-10A102,102,0,0,1,79.31,217.65L44.44,229.27a14,14,0,0,1-17.71-17.71l11.62-34.87A102,102,0,1,1,230,128Zm-12,0A90,90,0,1,0,50.08,173.06a6,6,0,0,1,.5,4.91L38.12,215.35a2,2,0,0,0,2.53,2.53L78,205.42a6.2,6.2,0,0,1,1.9-.31,6.09,6.09,0,0,1,3,.81A90,90,0,0,0,218,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a7.createElement(a7.Fragment, null, /* @__PURE__ */ a7.createElement("path", { d: "M168,112a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,112Zm-8,24H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm72-8A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a7.createElement(a7.Fragment, null, /* @__PURE__ */ a7.createElement("path", { d: "M164,112a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,112Zm-4,28H96a4,4,0,0,0,0,8h64a4,4,0,0,0,0-8Zm68-12A100,100,0,0,1,79.5,215.47l-35.69,11.9a12,12,0,0,1-15.18-15.18l11.9-35.69A100,100,0,1,1,228,128Zm-8,0A92,92,0,1,0,48.35,174.07a4,4,0,0,1,.33,3.27L36.22,214.72a4,4,0,0,0,5.06,5.06l37.38-12.46a3.93,3.93,0,0,1,1.27-.21,4.05,4.05,0,0,1,2,.54A92,92,0,0,0,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ChatsCircle.es.js
var a8 = __toESM(require("react"), 1);
var e8 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M236.34,187.09A84,84,0,0,0,172.29,68.9,84,84,0,0,0,19.66,139.09l-6.84,23.26a20,20,0,0,0,24.83,24.83l23.26-6.84a83.94,83.94,0,0,0,22.76,6.74,84.06,84.06,0,0,0,111.42,41.26l23.26,6.84a20,20,0,0,0,24.83-24.83ZM62,155.5a11.88,11.88,0,0,0-3.39.49l-20.72,6.09L44,141.35a12,12,0,0,0-.93-9A60,60,0,1,1,67.7,156.92,12,12,0,0,0,62,155.5Zm150.89,24.8a12,12,0,0,0-.93,9l6.09,20.73L197.36,204a12,12,0,0,0-9.06.93A60,60,0,0,1,111,186.63a83.93,83.93,0,0,0,68.55-91.37,60,60,0,0,1,33.38,85Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement(
      "path",
      {
        d: "M231.66,213.73a8,8,0,0,1-9.93,9.93L194,215.5A72.05,72.05,0,0,1,92.06,175.89h0c1.31.07,2.62.11,3.94.11a72,72,0,0,0,67.93-95.88h0A72,72,0,0,1,223.5,186Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a8.createElement("path", { d: "M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86ZM62,159.5a8.28,8.28,0,0,0-2.26.32L32,168l8.17-27.76a8,8,0,0,0-.63-6,64,64,0,1,1,26.26,26.26A8,8,0,0,0,62,159.5Zm153.79,28.73L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86Zm-16.25,1.47L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M229.93,186.58A78,78,0,0,0,168.16,74.42,78,78,0,1,0,26.07,138.58L18.58,164A14,14,0,0,0,36,181.42l25.46-7.49a78,78,0,0,0,26.39,7.63,78,78,0,0,0,106.77,40.37L220,229.42A14,14,0,0,0,237.42,212ZM62,161.5a6.05,6.05,0,0,0-1.69.24l-27.77,8.17a2,2,0,0,1-2.48-2.48l8.17-27.77a6.05,6.05,0,0,0-.47-4.53,66,66,0,1,1,27.08,27.08A6,6,0,0,0,62,161.5Zm155.71,26.16,8.17,27.77a2,2,0,0,1-2.48,2.48l-27.77-8.17a6.06,6.06,0,0,0-4.53.47,66,66,0,0,1-90-28.4,77.92,77.92,0,0,0,71-94.68,66,66,0,0,1,46.07,96A6.05,6.05,0,0,0,217.74,187.66Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86ZM62,159.5a8.28,8.28,0,0,0-2.26.32L32,168l8.17-27.76a8,8,0,0,0-.63-6,64,64,0,1,1,26.26,26.26A8,8,0,0,0,62,159.5Zm153.79,28.73L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a8.createElement(a8.Fragment, null, /* @__PURE__ */ a8.createElement("path", { d: "M227.79,186.39a76,76,0,0,0-61-110.07A76,76,0,1,0,28.21,138.39L20.5,164.6a12,12,0,0,0,14.9,14.9l26.21-7.71a75.93,75.93,0,0,0,27.6,7.9,76,76,0,0,0,105.18,40.1l26.21,7.71a12,12,0,0,0,14.9-14.9ZM60.9,163.66l-27.76,8.17a4,4,0,0,1-5-5l8.17-27.76a4.07,4.07,0,0,0-.31-3A68,68,0,1,1,63.92,164,4.06,4.06,0,0,0,60.9,163.66Zm165.92,55.16a4,4,0,0,1-4,1l-27.76-8.17a4.07,4.07,0,0,0-3,.31A68,68,0,0,1,98,180a76,76,0,0,0,71.5-95.28A68,68,0,0,1,220,184.08a4.07,4.07,0,0,0-.31,3l8.17,27.76A4,4,0,0,1,226.82,218.82Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Check.es.js
var e9 = __toESM(require("react"), 1);
var a9 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e9.createElement(e9.Fragment, null, /* @__PURE__ */ e9.createElement("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e9.createElement(e9.Fragment, null, /* @__PURE__ */ e9.createElement(
      "path",
      {
        d: "M232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e9.createElement("path", { d: "M205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e9.createElement(e9.Fragment, null, /* @__PURE__ */ e9.createElement("path", { d: "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e9.createElement(e9.Fragment, null, /* @__PURE__ */ e9.createElement("path", { d: "M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e9.createElement(e9.Fragment, null, /* @__PURE__ */ e9.createElement("path", { d: "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e9.createElement(e9.Fragment, null, /* @__PURE__ */ e9.createElement("path", { d: "M226.83,74.83l-128,128a4,4,0,0,1-5.66,0l-56-56a4,4,0,0,1,5.66-5.66L96,194.34,221.17,69.17a4,4,0,1,1,5.66,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/CheckCircle.es.js
var e10 = __toESM(require("react"), 1);
var a10 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e10.createElement(e10.Fragment, null, /* @__PURE__ */ e10.createElement("path", { d: "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e10.createElement(e10.Fragment, null, /* @__PURE__ */ e10.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ e10.createElement("path", { d: "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e10.createElement(e10.Fragment, null, /* @__PURE__ */ e10.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e10.createElement(e10.Fragment, null, /* @__PURE__ */ e10.createElement("path", { d: "M172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e10.createElement(e10.Fragment, null, /* @__PURE__ */ e10.createElement("path", { d: "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e10.createElement(e10.Fragment, null, /* @__PURE__ */ e10.createElement("path", { d: "M170.83,101.17a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ClockCountdown.es.js
var a11 = __toESM(require("react"), 1);
var e11 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M236,137A108.13,108.13,0,1,1,119,20,12,12,0,0,1,121,44,84.12,84.12,0,1,0,212,135,12,12,0,1,1,236,137ZM116,76v52a12,12,0,0,0,12,12h52a12,12,0,0,0,0-24H140V76a12,12,0,0,0-24,0Zm92,20a16,16,0,1,0-16-16A16,16,0,0,0,208,96ZM176,64a16,16,0,1,0-16-16A16,16,0,0,0,176,64Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ a11.createElement("path", { d: "M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M208,96a12,12,0,1,1,12,12A12,12,0,0,1,208,96ZM196,72a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm28.66,56a8,8,0,0,0-8.63,7.31A88.12,88.12,0,1,1,120.66,40,8,8,0,0,0,119.34,24,104.12,104.12,0,1,0,232,136.66,8,8,0,0,0,224.66,128ZM128,56a72,72,0,1,1-72,72A72.08,72.08,0,0,1,128,56Zm-8,72a8,8,0,0,0,8,8h48a8,8,0,0,0,0-16H136V80a8,8,0,0,0-16,0Zm40-80a12,12,0,1,0-12-12A12,12,0,0,0,160,48Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M230,136.49A102.12,102.12,0,1,1,119.51,26a6,6,0,0,1,1,12A90.13,90.13,0,1,0,218,135.51a6,6,0,1,1,12,1ZM122,72v56a6,6,0,0,0,6,6h56a6,6,0,0,0,0-12H134V72a6,6,0,0,0-12,0Zm38-26a10,10,0,1,0-10-10A10,10,0,0,0,160,46Zm36,24a10,10,0,1,0-10-10A10,10,0,0,0,196,70Zm24,36a10,10,0,1,0-10-10A10,10,0,0,0,220,106Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a11.createElement(a11.Fragment, null, /* @__PURE__ */ a11.createElement("path", { d: "M228,136.33A100.13,100.13,0,1,1,119.67,28a4,4,0,1,1,.66,8A92.13,92.13,0,1,0,220,135.67a4,4,0,1,1,8,.66ZM128,132h56a4,4,0,0,0,0-8H132V72a4,4,0,0,0-8,0v56A4,4,0,0,0,128,132Zm32-88a8,8,0,1,0-8-8A8,8,0,0,0,160,44Zm36,24a8,8,0,1,0-8-8A8,8,0,0,0,196,68Zm24,36a8,8,0,1,0-8-8A8,8,0,0,0,220,104Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Database.es.js
var e12 = __toESM(require("react"), 1);
var t2 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e12.createElement(e12.Fragment, null, /* @__PURE__ */ e12.createElement("path", { d: "M196,35.52C177.62,25.51,153.48,20,128,20S78.38,25.51,60,35.52C39.37,46.79,28,62.58,28,80v96c0,17.42,11.37,33.21,32,44.48,18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52c20.66-11.27,32-27.06,32-44.48V80C228,62.58,216.63,46.79,196,35.52ZM204,128c0,17-31.21,36-76,36s-76-19-76-36v-8.46a88.9,88.9,0,0,0,8,4.94c18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52a88.9,88.9,0,0,0,8-4.94ZM128,44c44.79,0,76,19,76,36s-31.21,36-76,36S52,97,52,80,83.21,44,128,44Zm0,168c-44.79,0-76-19-76-36v-8.46a88.9,88.9,0,0,0,8,4.94c18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52a88.9,88.9,0,0,0,8-4.94V176C204,193,172.79,212,128,212Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e12.createElement(e12.Fragment, null, /* @__PURE__ */ e12.createElement(
      "path",
      {
        d: "M216,80c0,26.51-39.4,48-88,48S40,106.51,40,80s39.4-48,88-48S216,53.49,216,80Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e12.createElement("path", { d: "M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e12.createElement(e12.Fragment, null, /* @__PURE__ */ e12.createElement("path", { d: "M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64Zm-21.61,74.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e12.createElement(e12.Fragment, null, /* @__PURE__ */ e12.createElement("path", { d: "M128,26C75.29,26,34,49.72,34,80v96c0,30.28,41.29,54,94,54s94-23.72,94-54V80C222,49.72,180.71,26,128,26Zm0,12c44.45,0,82,19.23,82,42s-37.55,42-82,42S46,102.77,46,80,83.55,38,128,38Zm82,138c0,22.77-37.55,42-82,42s-82-19.23-82-42V154.79C62,171.16,92.37,182,128,182s66-10.84,82-27.21Zm0-48c0,22.77-37.55,42-82,42s-82-19.23-82-42V106.79C62,123.16,92.37,134,128,134s66-10.84,82-27.21Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e12.createElement(e12.Fragment, null, /* @__PURE__ */ e12.createElement("path", { d: "M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e12.createElement(e12.Fragment, null, /* @__PURE__ */ e12.createElement("path", { d: "M192.14,42.55C174.94,33.17,152.16,28,128,28S81.06,33.17,63.86,42.55C45.89,52.35,36,65.65,36,80v96c0,14.35,9.89,27.65,27.86,37.45,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c18-9.8,27.86-23.1,27.86-37.45V80C220,65.65,210.11,52.35,192.14,42.55ZM212,176c0,11.29-8.41,22.1-23.69,30.43C172.27,215.18,150.85,220,128,220s-44.27-4.82-60.31-13.57C52.41,198.1,44,187.29,44,176V149.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm0-48c0,11.29-8.41,22.1-23.69,30.43C172.27,167.18,150.85,172,128,172s-44.27-4.82-60.31-13.57C52.41,150.1,44,139.29,44,128V101.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm-23.69-17.57C172.27,119.18,150.85,124,128,124s-44.27-4.82-60.31-13.57C52.41,102.1,44,91.29,44,80s8.41-22.1,23.69-30.43C83.73,40.82,105.15,36,128,36s44.27,4.82,60.31,13.57C203.59,57.9,212,68.71,212,80S203.59,102.1,188.31,110.43Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/DownloadSimple.es.js
var a12 = __toESM(require("react"), 1);
var e13 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement(
      "path",
      {
        d: "M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a12.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,168,96H136V32a8,8,0,0,0-16,0V96H88a8,8,0,0,0-5.66,13.66Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,129.51V32a6,6,0,0,0-12,0v97.51L92.24,99.76a6,6,0,0,0-8.48,8.48Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a12.createElement(a12.Fragment, null, /* @__PURE__ */ a12.createElement("path", { d: "M220,144v64a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V144a4,4,0,0,1,8,0v60H212V144a4,4,0,0,1,8,0Zm-94.83,2.83a4,4,0,0,0,5.66,0l40-40a4,4,0,1,0-5.66-5.66L132,134.34V32a4,4,0,0,0-8,0V134.34L90.83,101.17a4,4,0,0,0-5.66,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/File.es.js
var e14 = __toESM(require("react"), 1);
var a13 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e14.createElement(e14.Fragment, null, /* @__PURE__ */ e14.createElement("path", { d: "M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e14.createElement(e14.Fragment, null, /* @__PURE__ */ e14.createElement("path", { d: "M208,88H152V32Z", opacity: "0.2" }), /* @__PURE__ */ e14.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e14.createElement(e14.Fragment, null, /* @__PURE__ */ e14.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e14.createElement(e14.Fragment, null, /* @__PURE__ */ e14.createElement("path", { d: "M212.24,83.76l-56-56A6,6,0,0,0,152,26H56A14,14,0,0,0,42,40V216a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V88A6,6,0,0,0,212.24,83.76ZM158,46.48,193.52,82H158ZM200,218H56a2,2,0,0,1-2-2V40a2,2,0,0,1,2-2h90V88a6,6,0,0,0,6,6h50V216A2,2,0,0,1,200,218Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e14.createElement(e14.Fragment, null, /* @__PURE__ */ e14.createElement("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e14.createElement(e14.Fragment, null, /* @__PURE__ */ e14.createElement("path", { d: "M210.83,85.17l-56-56A4,4,0,0,0,152,28H56A12,12,0,0,0,44,40V216a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V88A4,4,0,0,0,210.83,85.17ZM156,41.65,198.34,84H156ZM200,220H56a4,4,0,0,1-4-4V40a4,4,0,0,1,4-4h92V88a4,4,0,0,0,4,4h52V216A4,4,0,0,1,200,220Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/FolderOpen.es.js
var a14 = __toESM(require("react"), 1);
var e15 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M248.23,112.31A20,20,0,0,0,232,104H220V88a20,20,0,0,0-20-20H132L105.34,48a20.12,20.12,0,0,0-12-4H40A20,20,0,0,0,20,64V208a12,12,0,0,0,12,12H211.1a12,12,0,0,0,11.33-8l28.49-81.47.06-.17A20,20,0,0,0,248.23,112.31ZM92,68l28.8,21.6A12,12,0,0,0,128,92h68v12H69.77a20,20,0,0,0-18.94,13.58L44,137.15V68ZM202.59,196H48.89l23.72-68H226.37Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement(
      "path",
      {
        d: "M208,88v24H69.77a8,8,0,0,0-7.59,5.47L32,208V64a8,8,0,0,1,8-8H93.33a8,8,0,0,1,4.8,1.6L128,80h72A8,8,0,0,1,208,88Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a14.createElement("path", { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M243.36,111.81A14,14,0,0,0,232,106H214V88a14,14,0,0,0-14-14H130L101.74,52.8a14.06,14.06,0,0,0-8.4-2.8H40A14,14,0,0,0,26,64V208a6,6,0,0,0,6,6H211.1a6,6,0,0,0,5.69-4.1l28.49-85.47A14,14,0,0,0,243.36,111.81ZM40,62H93.34a2,2,0,0,1,1.2.4L124.4,84.8A6,6,0,0,0,128,86h72a2,2,0,0,1,2,2v18H69.77a14,14,0,0,0-13.28,9.57L38,171V64A2,2,0,0,1,40,62Zm193.9,58.63L206.78,202H40.33l27.54-82.63a2,2,0,0,1,1.9-1.37H232a2,2,0,0,1,1.9,2.63Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a14.createElement(a14.Fragment, null, /* @__PURE__ */ a14.createElement("path", { d: "M241.72,113a11.88,11.88,0,0,0-9.73-5H212V88a12,12,0,0,0-12-12H129.33l-28.8-21.6a12.05,12.05,0,0,0-7.2-2.4H40A12,12,0,0,0,28,64V208a4,4,0,0,0,4,4H211.09a4,4,0,0,0,3.79-2.74l28.49-85.47A11.86,11.86,0,0,0,241.72,113ZM40,60H93.33a4,4,0,0,1,2.4.8L125.6,83.2a4,4,0,0,0,2.4.8h72a4,4,0,0,1,4,4v20H69.76a12,12,0,0,0-11.38,8.21L36,183.35V64A4,4,0,0,1,40,60Zm195.78,61.26L208.2,204H37.55L66,118.74A4,4,0,0,1,69.76,116H232a4,4,0,0,1,3.79,5.26Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/GearSix.es.js
var a15 = __toESM(require("react"), 1);
var l = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a15.createElement(a15.Fragment, null, /* @__PURE__ */ a15.createElement("path", { d: "M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm113.86-49.57A12,12,0,0,0,236,98.34L208.21,82.49l-.11-31.31a12,12,0,0,0-4.25-9.12,116,116,0,0,0-38-21.41,12,12,0,0,0-9.68.89L128,37.27,99.83,21.53a12,12,0,0,0-9.7-.9,116.06,116.06,0,0,0-38,21.47,12,12,0,0,0-4.24,9.1l-.14,31.34L20,98.35a12,12,0,0,0-5.85,8.11,110.7,110.7,0,0,0,0,43.11A12,12,0,0,0,20,157.66l27.82,15.85.11,31.31a12,12,0,0,0,4.25,9.12,116,116,0,0,0,38,21.41,12,12,0,0,0,9.68-.89L128,218.73l28.14,15.74a12,12,0,0,0,9.7.9,116.06,116.06,0,0,0,38-21.47,12,12,0,0,0,4.24-9.1l.14-31.34,27.81-15.81a12,12,0,0,0,5.85-8.11A110.7,110.7,0,0,0,241.86,106.43Zm-22.63,33.18-26.88,15.28a11.94,11.94,0,0,0-4.55,4.59c-.54,1-1.11,1.93-1.7,2.88a12,12,0,0,0-1.83,6.31L184.13,199a91.83,91.83,0,0,1-21.07,11.87l-27.15-15.19a12,12,0,0,0-5.86-1.53h-.29c-1.14,0-2.3,0-3.44,0a12.08,12.08,0,0,0-6.14,1.51L93,210.82A92.27,92.27,0,0,1,71.88,199l-.11-30.24a12,12,0,0,0-1.83-6.32c-.58-.94-1.16-1.91-1.7-2.88A11.92,11.92,0,0,0,63.7,155L36.8,139.63a86.53,86.53,0,0,1,0-23.24l26.88-15.28a12,12,0,0,0,4.55-4.58c.54-1,1.11-1.94,1.7-2.89a12,12,0,0,0,1.83-6.31L71.87,57A91.83,91.83,0,0,1,92.94,45.17l27.15,15.19a11.92,11.92,0,0,0,6.15,1.52c1.14,0,2.3,0,3.44,0a12.08,12.08,0,0,0,6.14-1.51L163,45.18A92.27,92.27,0,0,1,184.12,57l.11,30.24a12,12,0,0,0,1.83,6.32c.58.94,1.16,1.91,1.7,2.88A11.92,11.92,0,0,0,192.3,101l26.9,15.33A86.53,86.53,0,0,1,219.23,139.61Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a15.createElement(a15.Fragment, null, /* @__PURE__ */ a15.createElement(
      "path",
      {
        d: "M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a15.createElement("path", { d: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.1,8.1,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8,8,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a15.createElement(a15.Fragment, null, /* @__PURE__ */ a15.createElement("path", { d: "M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a15.createElement(a15.Fragment, null, /* @__PURE__ */ a15.createElement("path", { d: "M128,82a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Zm108-54.4a6,6,0,0,0-2.92-4L202.64,86.22l-.42-.71L202.1,51.2A6,6,0,0,0,200,46.64a110.12,110.12,0,0,0-36.07-20.31,6,6,0,0,0-4.84.45L128.46,43.86h-1L96.91,26.76a6,6,0,0,0-4.86-.44A109.92,109.92,0,0,0,56,46.68a6,6,0,0,0-2.12,4.55l-.16,34.34c-.14.23-.28.47-.41.71L22.91,103.57A6,6,0,0,0,20,107.62a104.81,104.81,0,0,0,0,40.78,6,6,0,0,0,2.92,4l30.42,17.33.42.71.12,34.31A6,6,0,0,0,56,209.36a110.12,110.12,0,0,0,36.07,20.31,6,6,0,0,0,4.84-.45l30.61-17.08h1l30.56,17.1A6.09,6.09,0,0,0,162,230a5.83,5.83,0,0,0,1.93-.32,109.92,109.92,0,0,0,36-20.36,6,6,0,0,0,2.12-4.55l.16-34.34c.14-.23.28-.47.41-.71l30.42-17.29a6,6,0,0,0,2.92-4.05A104.81,104.81,0,0,0,236,107.6Zm-11.25,35.79L195.32,160.1a6.07,6.07,0,0,0-2.28,2.3c-.59,1-1.21,2.11-1.86,3.14a6,6,0,0,0-.91,3.16l-.16,33.21a98.15,98.15,0,0,1-27.52,15.53L133,200.88a6,6,0,0,0-2.93-.77h-.14c-1.24,0-2.5,0-3.74,0a6,6,0,0,0-3.07.76L93.45,217.43a98,98,0,0,1-27.56-15.49l-.12-33.17a6,6,0,0,0-.91-3.16c-.64-1-1.27-2.08-1.86-3.14a6,6,0,0,0-2.27-2.3L31.3,143.4a93,93,0,0,1,0-30.79L60.68,95.9A6.07,6.07,0,0,0,63,93.6c.59-1,1.21-2.11,1.86-3.14a6,6,0,0,0,.91-3.16l.16-33.21A98.15,98.15,0,0,1,93.41,38.56L123,55.12a5.81,5.81,0,0,0,3.07.76c1.24,0,2.5,0,3.74,0a6,6,0,0,0,3.07-.76l29.65-16.56a98,98,0,0,1,27.56,15.49l.12,33.17a6,6,0,0,0,.91,3.16c.64,1,1.27,2.08,1.86,3.14a6,6,0,0,0,2.27,2.3L224.7,112.6A93,93,0,0,1,224.73,143.39Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a15.createElement(a15.Fragment, null, /* @__PURE__ */ a15.createElement("path", { d: "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a15.createElement(a15.Fragment, null, /* @__PURE__ */ a15.createElement("path", { d: "M128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36,36,0,0,1,128,164Zm106-56a4,4,0,0,0-2-2.7l-30.89-17.6q-.47-.82-1-1.62L200.1,51.2a3.94,3.94,0,0,0-1.42-3,107.8,107.8,0,0,0-35.41-19.94,4,4,0,0,0-3.23.29L129,45.87h-2l-31-17.36a4,4,0,0,0-3.23-.3,108.05,108.05,0,0,0-35.39,20,4,4,0,0,0-1.41,3l-.16,34.9-1,1.62L23.9,105.3A4,4,0,0,0,22,108a102.76,102.76,0,0,0,0,40,4,4,0,0,0,1.95,2.7l30.89,17.6q.47.83,1,1.62l.12,34.87a3.94,3.94,0,0,0,1.42,3,107.8,107.8,0,0,0,35.41,19.94,4,4,0,0,0,3.23-.29L127,210.13h2l31,17.36a4,4,0,0,0,3.23.3,108.05,108.05,0,0,0,35.39-20,4,4,0,0,0,1.41-3l.16-34.9,1-1.62L232.1,150.7a4,4,0,0,0,2-2.71A102.76,102.76,0,0,0,234,108Zm-7.48,36.67L196.3,161.84a4,4,0,0,0-1.51,1.53c-.61,1.09-1.25,2.17-1.91,3.24a3.92,3.92,0,0,0-.61,2.1l-.16,34.15a99.8,99.8,0,0,1-29.7,16.77l-30.4-17a4.06,4.06,0,0,0-2-.51H130c-1.28,0-2.57,0-3.84,0a4.1,4.1,0,0,0-2.05.51l-30.45,17A100.23,100.23,0,0,1,63.89,202.9l-.12-34.12a3.93,3.93,0,0,0-.61-2.11c-.66-1-1.3-2.14-1.91-3.23a4,4,0,0,0-1.51-1.53L29.49,144.68a94.78,94.78,0,0,1,0-33.34L59.7,94.16a4,4,0,0,0,1.51-1.53c.61-1.09,1.25-2.17,1.91-3.23a4,4,0,0,0,.61-2.11l.16-34.15a99.8,99.8,0,0,1,29.7-16.77l30.4,17a4.1,4.1,0,0,0,2.05.51c1.28,0,2.57,0,3.84,0a4,4,0,0,0,2.05-.51l30.45-17A100.23,100.23,0,0,1,192.11,53.1l.12,34.12a3.93,3.93,0,0,0,.61,2.11c.66,1,1.3,2.14,1.91,3.23a4,4,0,0,0,1.51,1.53l30.25,17.23A94.78,94.78,0,0,1,226.54,144.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/House.es.js
var a16 = __toESM(require("react"), 1);
var e16 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a16.createElement(a16.Fragment, null, /* @__PURE__ */ a16.createElement("path", { d: "M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a16.createElement(a16.Fragment, null, /* @__PURE__ */ a16.createElement(
      "path",
      {
        d: "M216,120v96H152V152H104v64H40V120a8,8,0,0,1,2.34-5.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,216,120Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a16.createElement("path", { d: "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a16.createElement(a16.Fragment, null, /* @__PURE__ */ a16.createElement("path", { d: "M224,120v96a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V164a4,4,0,0,0-4-4H108a4,4,0,0,0-4,4v52a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a16.createElement(a16.Fragment, null, /* @__PURE__ */ a16.createElement("path", { d: "M217.9,110.1l-80-80a14,14,0,0,0-19.8,0l-80,80A13.92,13.92,0,0,0,34,120v96a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V158h36v58a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V120A13.92,13.92,0,0,0,217.9,110.1ZM210,210H158V152a6,6,0,0,0-6-6H104a6,6,0,0,0-6,6v58H46V120a2,2,0,0,1,.58-1.42l80-80a2,2,0,0,1,2.84,0l80,80A2,2,0,0,1,210,120Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a16.createElement(a16.Fragment, null, /* @__PURE__ */ a16.createElement("path", { d: "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a16.createElement(a16.Fragment, null, /* @__PURE__ */ a16.createElement("path", { d: "M216.49,111.51l-80-80a12,12,0,0,0-17,0l-80,80A12,12,0,0,0,36,120v96a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V156h40v60a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V120A12,12,0,0,0,216.49,111.51ZM212,212H156V152a4,4,0,0,0-4-4H104a4,4,0,0,0-4,4v60H44V120a4,4,0,0,1,1.17-2.83l80-80a4,4,0,0,1,5.66,0l80,80A4,4,0,0,1,212,120Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ImageSquare.es.js
var a17 = __toESM(require("react"), 1);
var e17 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M208,28H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28Zm-4,24v63.72L186.14,97.86a20,20,0,0,0-28.28,0L52,203.72V52ZM85.66,204,172,117.66l32,32V204ZM76,96a20,20,0,1,1,20,20A20,20,0,0,1,76,96Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement(
      "path",
      {
        d: "M208,40H48a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8h8.69L166.34,106.34a8,8,0,0,1,11.32,0L216,144.69V48A8,8,0,0,0,208,40ZM96,112a16,16,0,1,1,16-16A16,16,0,0,1,96,112Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a17.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L53.37,208H48ZM208,208H76l96-96,36,36v60ZM96,120A24,24,0,1,0,72,96,24,24,0,0,0,96,120Zm0-32a8,8,0,1,1-8,8A8,8,0,0,1,96,88Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L53.37,208H48ZM80,96a16,16,0,1,1,16,16A16,16,0,0,1,80,96Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM46,208V48a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2v82.2l-28.1-28.1a14,14,0,0,0-19.8,0L54.2,210H48A2,2,0,0,1,46,208Zm162,2H71.17l99.41-99.41a2,2,0,0,1,2.83,0L210,147.17V208A2,2,0,0,1,208,210ZM96,118A22,22,0,1,0,74,96,22,22,0,0,0,96,118Zm0-32A10,10,0,1,1,86,96,10,10,0,0,1,96,86Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208v77.38l-24.69-24.7a16,16,0,0,0-22.62,0L53.37,208H48ZM208,208H76l96-96,36,36v60ZM96,120A24,24,0,1,0,72,96,24,24,0,0,0,96,120Zm0-32a8,8,0,1,1-8,8A8,8,0,0,1,96,88Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a17.createElement(a17.Fragment, null, /* @__PURE__ */ a17.createElement("path", { d: "M208,36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM44,208V48a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4v87l-31.51-31.52a12,12,0,0,0-17,0L55,212H48A4,4,0,0,1,44,208Zm164,4H66.34L169.17,109.17a4,4,0,0,1,5.66,0L212,146.34V208A4,4,0,0,1,208,212ZM96,116A20,20,0,1,0,76,96,20,20,0,0,0,96,116Zm0-32A12,12,0,1,1,84,96,12,12,0,0,1,96,84Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Info.es.js
var e18 = __toESM(require("react"), 1);
var a18 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e18.createElement(e18.Fragment, null, /* @__PURE__ */ e18.createElement("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e18.createElement(e18.Fragment, null, /* @__PURE__ */ e18.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ e18.createElement("path", { d: "M144,176a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176Zm88-48A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128ZM124,96a12,12,0,1,0-12-12A12,12,0,0,0,124,96Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e18.createElement(e18.Fragment, null, /* @__PURE__ */ e18.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e18.createElement(e18.Fragment, null, /* @__PURE__ */ e18.createElement("path", { d: "M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e18.createElement(e18.Fragment, null, /* @__PURE__ */ e18.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e18.createElement(e18.Fragment, null, /* @__PURE__ */ e18.createElement("path", { d: "M140,176a4,4,0,0,1-4,4,12,12,0,0,1-12-12V128a4,4,0,0,0-4-4,4,4,0,0,1,0-8,12,12,0,0,1,12,12v40a4,4,0,0,0,4,4A4,4,0,0,1,140,176ZM124,92a8,8,0,1,0-8-8A8,8,0,0,0,124,92Zm104,36A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Key.es.js
var a19 = __toESM(require("react"), 1);
var e19 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Zm48,22.74A84.3,84.3,0,0,1,160.11,180H160a83.52,83.52,0,0,1-23.65-3.38l-7.86,7.87A12,12,0,0,1,120,188H108v12a12,12,0,0,1-12,12H84v12a12,12,0,0,1-12,12H40a20,20,0,0,1-20-20V187.31a19.86,19.86,0,0,1,5.86-14.14l53.52-53.52A84,84,0,1,1,244,98.74ZM202.43,53.57A59.48,59.48,0,0,0,158,36c-32,1-58,27.89-58,59.89a59.69,59.69,0,0,0,4.2,22.19,12,12,0,0,1-2.55,13.21L44,189v23H60V200a12,12,0,0,1,12-12H84V176a12,12,0,0,1,12-12h19l9.65-9.65a12,12,0,0,1,13.22-2.55A59.58,59.58,0,0,0,160,156h.08c32,0,58.87-26.07,59.89-58A59.55,59.55,0,0,0,202.43,53.57Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement(
      "path",
      {
        d: "M232,98.36C230.73,136.92,198.67,168,160.09,168a71.68,71.68,0,0,1-26.92-5.17h0L120,176H96v24H72v24H40a8,8,0,0,1-8-8V187.31a8,8,0,0,1,2.34-5.65l58.83-58.83h0A71.68,71.68,0,0,1,88,95.91c0-38.58,31.08-70.64,69.64-71.87A72,72,0,0,1,232,98.36Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a19.createElement("path", { d: "M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM180,92a16,16,0,1,1,16-16A16,16,0,0,1,180,92Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M215.15,40.85A78,78,0,0,0,86.2,121.31l-56.1,56.1a13.94,13.94,0,0,0-4.1,9.9V216a14,14,0,0,0,14,14H72a6,6,0,0,0,6-6V206H96a6,6,0,0,0,6-6V182h18a6,6,0,0,0,4.24-1.76l10.45-10.44A77.59,77.59,0,0,0,160,174h.1A78,78,0,0,0,215.15,40.85ZM226,98.16c-1.12,35.16-30.67,63.8-65.88,63.84a65.93,65.93,0,0,1-24.51-4.67,6,6,0,0,0-6.64,1.26L117.51,170H96a6,6,0,0,0-6,6v18H72a6,6,0,0,0-6,6v18H40a2,2,0,0,1-2-2V187.31a2,2,0,0,1,.58-1.41l58.83-58.83a6,6,0,0,0,1.26-6.64A65.61,65.61,0,0,1,94,95.92C94,60.71,122.68,31.16,157.83,30A66,66,0,0,1,226,98.16ZM190,76a10,10,0,1,1-10-10A10,10,0,0,1,190,76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a19.createElement(a19.Fragment, null, /* @__PURE__ */ a19.createElement("path", { d: "M213.74,42.26A76,76,0,0,0,88.51,121.84l-57,57A11.93,11.93,0,0,0,28,187.31V216a12,12,0,0,0,12,12H72a4,4,0,0,0,4-4V204H96a4,4,0,0,0,4-4V180h20a4,4,0,0,0,2.83-1.17l11.33-11.34A75.72,75.72,0,0,0,160,172h.1A76,76,0,0,0,213.74,42.26Zm14.22,56c-1.15,36.22-31.6,65.72-67.87,65.77H160a67.52,67.52,0,0,1-25.21-4.83,4,4,0,0,0-4.45.83l-12,12H96a4,4,0,0,0-4,4v20H72a4,4,0,0,0-4,4v20H40a4,4,0,0,1-4-4V187.31a4.06,4.06,0,0,1,1.17-2.83L96,125.66a4,4,0,0,0,.83-4.45A67.51,67.51,0,0,1,92,95.91C92,59.64,121.55,29.19,157.77,28A68,68,0,0,1,228,98.23ZM188,76a8,8,0,1,1-8-8A8,8,0,0,1,188,76Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/List.es.js
var a20 = __toESM(require("react"), 1);
var e20 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M216,64V192H40V64Z", opacity: "0.2" }), /* @__PURE__ */ a20.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM192,184H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a20.createElement(a20.Fragment, null, /* @__PURE__ */ a20.createElement("path", { d: "M220,128a4,4,0,0,1-4,4H40a4,4,0,0,1,0-8H216A4,4,0,0,1,220,128ZM40,68H216a4,4,0,0,0,0-8H40a4,4,0,0,0,0,8ZM216,188H40a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ListBullets.es.js
var a21 = __toESM(require("react"), 1);
var e21 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a21.createElement(a21.Fragment, null, /* @__PURE__ */ a21.createElement("path", { d: "M76,64A12,12,0,0,1,88,52H216a12,12,0,0,1,0,24H88A12,12,0,0,1,76,64Zm140,52H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H88a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM44,112a16,16,0,1,0,16,16A16,16,0,0,0,44,112Zm0-64A16,16,0,1,0,60,64,16,16,0,0,0,44,48Zm0,128a16,16,0,1,0,16,16A16,16,0,0,0,44,176Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a21.createElement(a21.Fragment, null, /* @__PURE__ */ a21.createElement("path", { d: "M216,64V192H88V64Z", opacity: "0.2" }), /* @__PURE__ */ a21.createElement("path", { d: "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,1,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,1,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a21.createElement(a21.Fragment, null, /* @__PURE__ */ a21.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM68,188a12,12,0,1,1,12-12A12,12,0,0,1,68,188Zm0-48a12,12,0,1,1,12-12A12,12,0,0,1,68,140Zm0-48A12,12,0,1,1,80,80,12,12,0,0,1,68,92Zm124,92H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Zm0-48H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Zm0-48H104a8,8,0,0,1,0-16h88a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a21.createElement(a21.Fragment, null, /* @__PURE__ */ a21.createElement("path", { d: "M82,64a6,6,0,0,1,6-6H216a6,6,0,0,1,0,12H88A6,6,0,0,1,82,64Zm134,58H88a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Zm0,64H88a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12ZM44,54A10,10,0,1,0,54,64,10,10,0,0,0,44,54Zm0,128a10,10,0,1,0,10,10A10,10,0,0,0,44,182Zm0-64a10,10,0,1,0,10,10A10,10,0,0,0,44,118Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a21.createElement(a21.Fragment, null, /* @__PURE__ */ a21.createElement("path", { d: "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a21.createElement(a21.Fragment, null, /* @__PURE__ */ a21.createElement("path", { d: "M84,64a4,4,0,0,1,4-4H216a4,4,0,0,1,0,8H88A4,4,0,0,1,84,64Zm132,60H88a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Zm0,64H88a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8ZM44,120a8,8,0,1,0,8,8A8,8,0,0,0,44,120Zm0-64a8,8,0,1,0,8,8A8,8,0,0,0,44,56Zm0,128a8,8,0,1,0,8,8A8,8,0,0,0,44,184Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/MagnifyingGlass.es.js
var e22 = __toESM(require("react"), 1);
var a22 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z", opacity: "0.2" }), /* @__PURE__ */ e22.createElement("path", { d: "M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e22.createElement(e22.Fragment, null, /* @__PURE__ */ e22.createElement("path", { d: "M226.83,221.17l-52.7-52.7a84.1,84.1,0,1,0-5.66,5.66l52.7,52.7a4,4,0,0,0,5.66-5.66ZM36,112a76,76,0,1,1,76,76A76.08,76.08,0,0,1,36,112Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Note.es.js
var a23 = __toESM(require("react"), 1);
var e23 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M84,108A12,12,0,0,1,96,96h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,108Zm32,28H96a12,12,0,0,0,0,24h20a12,12,0,0,0,0-24ZM228,48V156.69a19.86,19.86,0,0,1-5.86,14.14l-51.31,51.31A19.86,19.86,0,0,1,156.69,228H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28H208A20,20,0,0,1,228,48ZM52,204h92V156a12,12,0,0,1,12-12h48V52H52Zm139-36H168v23Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M216,160l-56,56V160Z", opacity: "0.2" }), /* @__PURE__ */ a23.createElement("path", { d: "M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.92,15.92,0,0,0,168,219.31L219.31,168A15.92,15.92,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM96,88h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm32,80H96a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16ZM96,136a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm64,68.69V160h44.7Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M90,96a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H96A6,6,0,0,1,90,96Zm6,38h64a6,6,0,0,0,0-12H96a6,6,0,0,0,0,12Zm32,20H96a6,6,0,0,0,0,12h32a6,6,0,0,0,0-12ZM222,48V156.69a13.94,13.94,0,0,1-4.1,9.9L166.59,217.9a13.94,13.94,0,0,1-9.9,4.1H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34H208A14,14,0,0,1,222,48ZM48,210H154V160a6,6,0,0,1,6-6h50V48a2,2,0,0,0-2-2H48a2,2,0,0,0-2,2V208A2,2,0,0,0,48,210Zm153.52-44H166v35.52Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a23.createElement(a23.Fragment, null, /* @__PURE__ */ a23.createElement("path", { d: "M92,96a4,4,0,0,1,4-4h64a4,4,0,0,1,0,8H96A4,4,0,0,1,92,96Zm4,36h64a4,4,0,0,0,0-8H96a4,4,0,0,0,0,8Zm32,24H96a4,4,0,0,0,0,8h32a4,4,0,0,0,0-8ZM220,48V156.69a11.9,11.9,0,0,1-3.52,8.48l-51.31,51.32a11.93,11.93,0,0,1-8.48,3.51H48a12,12,0,0,1-12-12V48A12,12,0,0,1,48,36H208A12,12,0,0,1,220,48ZM48,212H156V160a4,4,0,0,1,4-4h52V48a4,4,0,0,0-4-4H48a4,4,0,0,0-4,4V208A4,4,0,0,0,48,212Zm158.35-48H164v42.35Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/PaperPlaneTilt.es.js
var a24 = __toESM(require("react"), 1);
var e24 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M230.14,25.86a20,20,0,0,0-19.57-5.11l-.22.07L18.44,79a20,20,0,0,0-3.06,37.25L99,157l40.71,83.65a19.81,19.81,0,0,0,18,11.38c.57,0,1.15,0,1.73-.07A19.82,19.82,0,0,0,177,237.56L235.18,45.65a1.42,1.42,0,0,0,.07-.22A20,20,0,0,0,230.14,25.86ZM156.91,221.07l-34.37-70.64,46-45.95a12,12,0,0,0-17-17l-46,46L34.93,99.09,210,46Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement(
      "path",
      {
        d: "M223.69,42.18l-58.22,192a8,8,0,0,1-14.92,1.25L108,148,20.58,105.45a8,8,0,0,1,1.25-14.92l192-58.22A8,8,0,0,1,223.69,42.18Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a24.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M225.88,30.12a13.83,13.83,0,0,0-13.7-3.58l-.11,0L20.14,84.77A14,14,0,0,0,18,110.85l85.56,41.64L145.12,238a13.87,13.87,0,0,0,12.61,8c.4,0,.81,0,1.21-.05a13.9,13.9,0,0,0,12.29-10.09l58.2-191.93,0-.11A13.83,13.83,0,0,0,225.88,30.12Zm-8,10.4L159.73,232.43l0,.11a2,2,0,0,1-3.76.26l-40.68-83.58,49-49a6,6,0,1,0-8.49-8.49l-49,49L23.15,100a2,2,0,0,1,.31-3.74l.11,0L215.48,38.08a1.94,1.94,0,0,1,1.92.52A2,2,0,0,1,217.92,40.52Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a24.createElement(a24.Fragment, null, /* @__PURE__ */ a24.createElement("path", { d: "M224.47,31.52a11.87,11.87,0,0,0-11.82-3L20.74,86.67a12,12,0,0,0-1.91,22.38L105,151l41.92,86.15A11.88,11.88,0,0,0,157.74,244c.34,0,.69,0,1,0a11.89,11.89,0,0,0,10.52-8.63l58.21-192,0-.08A11.85,11.85,0,0,0,224.47,31.52Zm-4.62,9.54-58.23,192a4,4,0,0,1-7.48.59l-41.3-84.86,50-50a4,4,0,1,0-5.66-5.66l-50,50-84.9-41.31a3.88,3.88,0,0,1-2.27-4,3.93,3.93,0,0,1,3-3.54L214.9,36.16A3.93,3.93,0,0,1,216,36a4,4,0,0,1,2.79,1.19A3.93,3.93,0,0,1,219.85,41.06Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Paperclip.es.js
var a25 = __toESM(require("react"), 1);
var e25 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M212.48,136.49l-82.06,82a60,60,0,0,1-84.85-84.88l98.16-97.89a40,40,0,0,1,56.56,56.59l-.17.16-95.8,92.22a12,12,0,1,1-16.64-17.3l95.71-92.12a16,16,0,0,0-22.7-22.56L62.53,150.57a36,36,0,0,0,50.93,50.91l82.06-82a12,12,0,0,1,17,17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement(
      "path",
      {
        d: "M180.75,104.75,204,128l-82.06,81.94a48,48,0,0,1-67.88-67.88L153.37,41.37a32,32,0,0,1,45.26,45.26Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a25.createElement("path", { d: "M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,50.34a8,8,0,0,0-11.32,0L87.09,143A24,24,0,1,0,121,177l49.32-50.32a8,8,0,1,1,11.42,11.2l-49.37,50.38a40,40,0,1,1-56.62-56.51L143,63.09A24,24,0,1,1,177,97L109.71,165.6a8,8,0,1,1-11.42-11.2L165.6,85.71a8,8,0,0,0,.06-11.37Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M208.25,123.76a6,6,0,0,1,0,8.49l-82.06,82a54,54,0,0,1-76.36-76.39L149.1,37.14a38,38,0,1,1,53.77,53.72L103.59,191.54a22,22,0,1,1-31.15-31.09l83.28-84.67a6,6,0,0,1,8.56,8.42L81,168.91a10,10,0,1,0,14.11,14.18L194.35,82.4a26,26,0,1,0-36.74-36.8L58.33,146.28a42,42,0,1,0,59.37,59.44l82.06-82A6,6,0,0,1,208.25,123.76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a25.createElement(a25.Fragment, null, /* @__PURE__ */ a25.createElement("path", { d: "M206.83,125.17a4,4,0,0,1,0,5.66l-82.06,82a52,52,0,0,1-73.54-73.55L150.52,38.55a36,36,0,1,1,50.94,50.9l-99.3,100.69a20,20,0,1,1-28.3-28.27l83.29-84.68a4,4,0,1,1,5.7,5.61L79.54,167.5a12,12,0,1,0,16.95,17L195.78,83.81A28,28,0,1,0,156.2,44.18L56.91,144.87a44,44,0,1,0,62.21,62.26l82-82A4,4,0,0,1,206.83,125.17Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/PencilSimple.es.js
var a26 = __toESM(require("react"), 1);
var e26 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement(
      "path",
      {
        d: "M221.66,90.34,192,120,136,64l29.66-29.66a8,8,0,0,1,11.31,0L221.66,79A8,8,0,0,1,221.66,90.34Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a26.createElement("path", { d: "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108.68,147.31,64l24-24L216,84.68Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M225.9,74.78,181.21,30.09a14,14,0,0,0-19.8,0L38.1,153.41a13.94,13.94,0,0,0-4.1,9.9V208a14,14,0,0,0,14,14H92.69a13.94,13.94,0,0,0,9.9-4.1L225.9,94.58a14,14,0,0,0,0-19.8ZM94.1,209.41a2,2,0,0,1-1.41.59H48a2,2,0,0,1-2-2V163.31a2,2,0,0,1,.59-1.41L136,72.48,183.51,120ZM217.41,86.1,192,111.51,144.49,64,169.9,38.58a2,2,0,0,1,2.83,0l44.68,44.69a2,2,0,0,1,0,2.83Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a26.createElement(a26.Fragment, null, /* @__PURE__ */ a26.createElement("path", { d: "M224.49,76.2,179.8,31.51a12,12,0,0,0-17,0L133.17,61.17h0L39.52,154.83A11.9,11.9,0,0,0,36,163.31V208a12,12,0,0,0,12,12H92.69a12,12,0,0,0,8.48-3.51L224.48,93.17a12,12,0,0,0,0-17Zm-129,134.63A4,4,0,0,1,92.69,212H48a4,4,0,0,1-4-4V163.31a4,4,0,0,1,1.17-2.83L136,69.65,186.34,120ZM218.83,87.51,192,114.34,141.66,64l26.82-26.83a4,4,0,0,1,5.66,0l44.69,44.68a4,4,0,0,1,0,5.66Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Play.es.js
var e27 = __toESM(require("react"), 1);
var a27 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e27.createElement(e27.Fragment, null, /* @__PURE__ */ e27.createElement("path", { d: "M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e27.createElement(e27.Fragment, null, /* @__PURE__ */ e27.createElement(
      "path",
      {
        d: "M228.23,134.69,84.15,222.81A8,8,0,0,1,72,216.12V39.88a8,8,0,0,1,12.15-6.69l144.08,88.12A7.82,7.82,0,0,1,228.23,134.69Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e27.createElement("path", { d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e27.createElement(e27.Fragment, null, /* @__PURE__ */ e27.createElement("path", { d: "M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e27.createElement(e27.Fragment, null, /* @__PURE__ */ e27.createElement("path", { d: "M231.36,116.19,87.28,28.06a14,14,0,0,0-14.18-.27A13.69,13.69,0,0,0,66,39.87V216.13a13.69,13.69,0,0,0,7.1,12.08,14,14,0,0,0,14.18-.27l144.08-88.13a13.82,13.82,0,0,0,0-23.62Zm-6.26,13.38L81,217.7a2,2,0,0,1-2.06,0,1.78,1.78,0,0,1-1-1.61V39.87a1.78,1.78,0,0,1,1-1.61A2.06,2.06,0,0,1,80,38a2,2,0,0,1,1,.31L225.1,126.43a1.82,1.82,0,0,1,0,3.14Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e27.createElement(e27.Fragment, null, /* @__PURE__ */ e27.createElement("path", { d: "M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e27.createElement(e27.Fragment, null, /* @__PURE__ */ e27.createElement("path", { d: "M230.32,117.9,86.24,29.79a11.91,11.91,0,0,0-12.17-.23A11.71,11.71,0,0,0,68,39.89V216.11a11.71,11.71,0,0,0,6.07,10.33,11.91,11.91,0,0,0,12.17-.23L230.32,138.1a11.82,11.82,0,0,0,0-20.2Zm-4.18,13.37L82.06,219.39a4,4,0,0,1-4.07.07,3.77,3.77,0,0,1-2-3.35V39.89a3.77,3.77,0,0,1,2-3.35,4,4,0,0,1,4.07.07l144.08,88.12a3.8,3.8,0,0,1,0,6.54Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Plug.es.js
var a28 = __toESM(require("react"), 1);
var l2 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M240.49,63.51a12,12,0,0,0-17,0L192,95,161,64l31.52-31.51a12,12,0,0,0-17-17L144,47,120.49,23.51a12,12,0,1,0-17,17L107,44,56.89,94.14a44,44,0,0,0,0,62.23l12.88,12.88L23.51,215.51a12,12,0,0,0,17,17l46.26-46.26,12.88,12.88a44,44,0,0,0,62.23,0L212,149l3.51,3.52a12,12,0,0,0,17-17L209,112l31.52-31.51A12,12,0,0,0,240.49,63.51Zm-95.6,118.63a20,20,0,0,1-28.29,0L73.86,139.4a20,20,0,0,1,0-28.29L124,61l71,71Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement(
      "path",
      {
        d: "M212,132l-58.63,58.63a32,32,0,0,1-45.25,0L65.37,147.88a32,32,0,0,1,0-45.25L124,44Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a28.createElement("path", { d: "M237.66,66.34a8,8,0,0,0-11.32,0L192,100.69,155.31,64l34.35-34.34a8,8,0,1,0-11.32-11.32L144,52.69,117.66,26.34a8,8,0,0,0-11.32,11.32L112.69,44l-53,53a40,40,0,0,0,0,56.57l15.71,15.71L26.34,218.34a8,8,0,0,0,11.32,11.32l49.09-49.09,15.71,15.71a40,40,0,0,0,56.57,0l53-53,6.34,6.35a8,8,0,0,0,11.32-11.32L203.31,112l34.35-34.34A8,8,0,0,0,237.66,66.34ZM147.72,185a24,24,0,0,1-33.95,0L71,142.23a24,24,0,0,1,0-33.95l53-53L200.69,132Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M237.66,77.66,203.31,112l26.35,26.34a8,8,0,0,1-11.32,11.32L212,143.31l-53,53a40,40,0,0,1-56.57,0L86.75,180.57,37.66,229.66a8,8,0,0,1-11.32-11.32l49.09-49.09L59.72,153.54a40,40,0,0,1,0-56.57l53-53-6.35-6.34a8,8,0,0,1,11.32-11.32L144,52.69l34.34-34.35a8,8,0,1,1,11.32,11.32L155.31,64,192,100.69l34.34-34.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M236.24,67.76a6,6,0,0,0-8.48,0L192,103.51,152.49,64l35.75-35.76a6,6,0,0,0-8.48-8.48L144,55.51,116.24,27.76a6,6,0,1,0-8.48,8.48L115.51,44,61.13,98.38a38,38,0,0,0,0,53.75l17.13,17.12-50.5,50.51a6,6,0,1,0,8.48,8.48l50.51-50.5,17.13,17.13a38,38,0,0,0,53.74,0L212,140.49l7.76,7.75a6,6,0,0,0,8.48-8.48L200.49,112l35.75-35.76A6,6,0,0,0,236.24,67.76ZM149.13,186.38a26,26,0,0,1-36.77,0L69.62,143.64a26,26,0,0,1,0-36.77L124,52.49,203.51,132Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M237.66,66.34a8,8,0,0,0-11.32,0L192,100.69,155.31,64l34.35-34.34a8,8,0,1,0-11.32-11.32L144,52.69,117.66,26.34a8,8,0,0,0-11.32,11.32L112.69,44l-53,53a40,40,0,0,0,0,56.57l15.71,15.71L26.34,218.34a8,8,0,0,0,11.32,11.32l49.09-49.09,15.71,15.71a40,40,0,0,0,56.57,0l53-53,6.34,6.35a8,8,0,0,0,11.32-11.32L203.31,112l34.35-34.34A8,8,0,0,0,237.66,66.34ZM147.72,185a24,24,0,0,1-33.95,0L71,142.23a24,24,0,0,1,0-33.95l53-53L200.69,132Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a28.createElement(a28.Fragment, null, /* @__PURE__ */ a28.createElement("path", { d: "M234.83,69.17a4,4,0,0,0-5.66,0L192,106.34,149.66,64l37.17-37.17a4,4,0,1,0-5.66-5.66L144,58.34,114.83,29.17a4,4,0,0,0-5.66,5.66L118.34,44,62.54,99.8a36.05,36.05,0,0,0,0,50.91l18.55,18.54L29.17,221.17a4,4,0,0,0,5.66,5.66l51.92-51.92,18.54,18.55a36.06,36.06,0,0,0,50.91,0l55.8-55.8,9.17,9.17a4,4,0,0,0,5.66-5.66L197.66,112l37.17-37.17A4,4,0,0,0,234.83,69.17ZM150.54,187.8a28,28,0,0,1-39.59,0L68.2,145.05a28,28,0,0,1,0-39.59L124,49.66,206.34,132Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Plus.es.js
var e28 = __toESM(require("react"), 1);
var a29 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e28.createElement(e28.Fragment, null, /* @__PURE__ */ e28.createElement("path", { d: "M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e28.createElement(e28.Fragment, null, /* @__PURE__ */ e28.createElement(
      "path",
      {
        d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e28.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e28.createElement(e28.Fragment, null, /* @__PURE__ */ e28.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e28.createElement(e28.Fragment, null, /* @__PURE__ */ e28.createElement("path", { d: "M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e28.createElement(e28.Fragment, null, /* @__PURE__ */ e28.createElement("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e28.createElement(e28.Fragment, null, /* @__PURE__ */ e28.createElement("path", { d: "M220,128a4,4,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,0-8h84V40a4,4,0,0,1,8,0v84h84A4,4,0,0,1,220,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Robot.es.js
var a30 = __toESM(require("react"), 1);
var e29 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M72,104a16,16,0,1,1,16,16A16,16,0,0,1,72,104Zm96,16a16,16,0,1,0-16-16A16,16,0,0,0,168,120Zm68-40V192a36,36,0,0,1-36,36H56a36,36,0,0,1-36-36V80A36,36,0,0,1,56,44h60V16a12,12,0,0,1,24,0V44h60A36,36,0,0,1,236,80Zm-24,0a12,12,0,0,0-12-12H56A12,12,0,0,0,44,80V192a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12Zm-12,82a30,30,0,0,1-30,30H86a30,30,0,0,1,0-60h84A30,30,0,0,1,200,162Zm-80-6v12h16V156ZM86,168H96V156H86a6,6,0,0,0,0,12Zm90-6a6,6,0,0,0-6-6H160v12h10A6,6,0,0,0,176,162Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement(
      "path",
      {
        d: "M200,56H56A24,24,0,0,0,32,80V192a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V80A24,24,0,0,0,200,56ZM164,184H92a20,20,0,0,1,0-40h72a20,20,0,0,1,0,40Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a30.createElement("path", { d: "M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Zm4,28H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48ZM172,96a12,12,0,1,1-12,12A12,12,0,0,1,172,96ZM96,184H80a16,16,0,0,1,0-32H96ZM84,120a12,12,0,1,1,12-12A12,12,0,0,1,84,120Zm60,64H112V152h32Zm32,0H160V152h16a16,16,0,0,1,0,32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M200,50H134V16a6,6,0,0,0-12,0V50H56A30,30,0,0,0,26,80V192a30,30,0,0,0,30,30H200a30,30,0,0,0,30-30V80A30,30,0,0,0,200,50Zm18,142a18,18,0,0,1-18,18H56a18,18,0,0,1-18-18V80A18,18,0,0,1,56,62H200a18,18,0,0,1,18,18ZM74,108a10,10,0,1,1,10,10A10,10,0,0,1,74,108Zm88,0a10,10,0,1,1,10,10A10,10,0,0,1,162,108Zm2,30H92a26,26,0,0,0,0,52h72a26,26,0,0,0,0-52Zm-22,12v28H114V150ZM78,164a14,14,0,0,1,14-14h10v28H92A14,14,0,0,1,78,164Zm86,14H154V150h10a14,14,0,0,1,0,28Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a30.createElement(a30.Fragment, null, /* @__PURE__ */ a30.createElement("path", { d: "M200,52H132V16a4,4,0,0,0-8,0V52H56A28,28,0,0,0,28,80V192a28,28,0,0,0,28,28H200a28,28,0,0,0,28-28V80A28,28,0,0,0,200,52Zm20,140a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V80A20,20,0,0,1,56,60H200a20,20,0,0,1,20,20ZM76,108a8,8,0,1,1,8,8A8,8,0,0,1,76,108Zm88,0a8,8,0,1,1,8,8A8,8,0,0,1,164,108Zm0,32H92a24,24,0,0,0,0,48h72a24,24,0,0,0,0-48Zm-20,8v32H112V148ZM76,164a16,16,0,0,1,16-16h12v32H92A16,16,0,0,1,76,164Zm88,16H152V148h12a16,16,0,0,1,0,32Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/ShieldCheck.es.js
var a31 = __toESM(require("react"), 1);
var e30 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204ZM79.51,144.49a12,12,0,1,1,17-17L112,143l47.51-47.52a12,12,0,0,1,17,17l-56,56a12,12,0,0,1-17,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement(
      "path",
      {
        d: "M216,56v56c0,96-88,120-88,120S40,208,40,112V56a8,8,0,0,1,8-8H208A8,8,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a31.createElement("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm-34.32,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M208,42H48A14,14,0,0,0,34,56v56c0,51.94,25.12,83.4,46.2,100.64,22.73,18.6,45.27,24.89,46.22,25.15a6,6,0,0,0,3.16,0c.95-.26,23.49-6.55,46.22-25.15C196.88,195.4,222,163.94,222,112V56A14,14,0,0,0,208,42Zm2,70c0,37.76-13.94,68.39-41.44,91.06A131.17,131.17,0,0,1,128,225.72a130.94,130.94,0,0,1-40.56-22.66C59.94,180.39,46,149.76,46,112V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2ZM172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a31.createElement(a31.Fragment, null, /* @__PURE__ */ a31.createElement("path", { d: "M208,44H48A12,12,0,0,0,36,56v56c0,51.16,24.73,82.12,45.47,99.1,22.4,18.32,44.55,24.5,45.48,24.76a4,4,0,0,0,2.1,0c.93-.26,23.08-6.44,45.48-24.76,20.74-17,45.47-47.94,45.47-99.1V56A12,12,0,0,0,208,44Zm4,68c0,38.44-14.23,69.63-42.29,92.71A132.45,132.45,0,0,1,128,227.82a132.23,132.23,0,0,1-41.71-23.11C58.23,181.63,44,150.44,44,112V56a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-41.17-10.83a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Sparkle.es.js
var a32 = __toESM(require("react"), 1);
var l3 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M199,125.31l-49.88-18.39L130.69,57a19.92,19.92,0,0,0-37.38,0L74.92,106.92,25,125.31a19.92,19.92,0,0,0,0,37.38l49.88,18.39L93.31,231a19.92,19.92,0,0,0,37.38,0l18.39-49.88L199,162.69a19.92,19.92,0,0,0,0-37.38Zm-63.38,35.16a12,12,0,0,0-7.11,7.11L112,212.28l-16.47-44.7a12,12,0,0,0-7.11-7.11L43.72,144l44.7-16.47a12,12,0,0,0,7.11-7.11L112,75.72l16.47,44.7a12,12,0,0,0,7.11,7.11L180.28,144ZM140,40a12,12,0,0,1,12-12h12V16a12,12,0,0,1,24,0V28h12a12,12,0,0,1,0,24H188V64a12,12,0,0,1-24,0V52H152A12,12,0,0,1,140,40ZM252,88a12,12,0,0,1-12,12h-4v4a12,12,0,0,1-24,0v-4h-4a12,12,0,0,1,0-24h4V72a12,12,0,0,1,24,0v4h4A12,12,0,0,1,252,88Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement(
      "path",
      {
        d: "M194.82,151.43l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0l-20.3-55.09-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3A7.92,7.92,0,0,1,194.82,151.43Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a32.createElement("path", { d: "M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M196.89,130.94,144.4,111.6,125.06,59.11a13.92,13.92,0,0,0-26.12,0L79.6,111.6,27.11,130.94a13.92,13.92,0,0,0,0,26.12L79.6,176.4l19.34,52.49a13.92,13.92,0,0,0,26.12,0L144.4,176.4l52.49-19.34a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-55.08,20.3a6,6,0,0,0-3.56,3.56l-20.3,55.08a1.92,1.92,0,0,1-3.6,0L89.9,169.66a6,6,0,0,0-3.56-3.56L31.26,145.8a1.92,1.92,0,0,1,0-3.6l55.08-20.3a6,6,0,0,0,3.56-3.56l20.3-55.08a1.92,1.92,0,0,1,3.6,0l20.3,55.08a6,6,0,0,0,3.56,3.56l55.08,20.3a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a32.createElement(a32.Fragment, null, /* @__PURE__ */ a32.createElement("path", { d: "M196.2,132.81l-53.36-19.65L123.19,59.8a11.93,11.93,0,0,0-22.38,0L81.16,113.16,27.8,132.81a11.93,11.93,0,0,0,0,22.38l53.36,19.65,19.65,53.36a11.93,11.93,0,0,0,22.38,0l19.65-53.36,53.36-19.65a11.93,11.93,0,0,0,0-22.38Zm-2.77,14.87L138.35,168a4,4,0,0,0-2.37,2.37l-20.3,55.08a3.92,3.92,0,0,1-7.36,0L88,170.35A4,4,0,0,0,85.65,168l-55.08-20.3a3.92,3.92,0,0,1,0-7.36L85.65,120A4,4,0,0,0,88,117.65l20.3-55.08a3.92,3.92,0,0,1,7.36,0L136,117.65a4,4,0,0,0,2.37,2.37l55.08,20.3a3.92,3.92,0,0,1,0,7.36ZM148,40a4,4,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4,4,0,0,1,148,40Zm96,48a4,4,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4,4,0,0,1,244,88Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/SpinnerGap.es.js
var a33 = __toESM(require("react"), 1);
var e31 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M140,32V64a12,12,0,0,1-24,0V32a12,12,0,0,1,24,0Zm84,84H192a12,12,0,0,0,0,24h32a12,12,0,0,0,0-24Zm-42.26,48.77a12,12,0,1,0-17,17l22.63,22.63a12,12,0,0,0,17-17ZM128,180a12,12,0,0,0-12,12v32a12,12,0,0,0,24,0V192A12,12,0,0,0,128,180ZM74.26,164.77,51.63,187.4a12,12,0,0,0,17,17l22.63-22.63a12,12,0,1,0-17-17ZM76,128a12,12,0,0,0-12-12H32a12,12,0,0,0,0,24H64A12,12,0,0,0,76,128ZM68.6,51.63a12,12,0,1,0-17,17L74.26,91.23a12,12,0,0,0,17-17Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ a33.createElement("path", { d: "M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM48,136a8,8,0,0,1,0-16H72a8,8,0,0,1,0,16Zm46.06,37.25-17,17a8,8,0,0,1-11.32-11.32l17-17a8,8,0,0,1,11.31,11.31Zm0-79.19a8,8,0,0,1-11.31,0l-17-17A8,8,0,0,1,77.09,65.77l17,17A8,8,0,0,1,94.06,94.06ZM136,208a8,8,0,0,1-16,0V184a8,8,0,0,1,16,0Zm0-136a8,8,0,0,1-16,0V48a8,8,0,0,1,16,0Zm54.23,118.23a8,8,0,0,1-11.32,0l-17-17a8,8,0,0,1,11.31-11.31l17,17A8,8,0,0,1,190.23,190.23ZM208,136H184a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M134,32V64a6,6,0,0,1-12,0V32a6,6,0,0,1,12,0Zm90,90H192a6,6,0,0,0,0,12h32a6,6,0,0,0,0-12Zm-46.5,47A6,6,0,0,0,169,177.5l22.63,22.62a6,6,0,0,0,8.48-8.48ZM128,186a6,6,0,0,0-6,6v32a6,6,0,0,0,12,0V192A6,6,0,0,0,128,186ZM78.5,169,55.88,191.64a6,6,0,1,0,8.48,8.48L87,177.5A6,6,0,1,0,78.5,169ZM70,128a6,6,0,0,0-6-6H32a6,6,0,0,0,0,12H64A6,6,0,0,0,70,128ZM64.36,55.88a6,6,0,0,0-8.48,8.48L78.5,87A6,6,0,1,0,87,78.5Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a33.createElement(a33.Fragment, null, /* @__PURE__ */ a33.createElement("path", { d: "M132,32V64a4,4,0,0,1-8,0V32a4,4,0,0,1,8,0Zm92,92H192a4,4,0,0,0,0,8h32a4,4,0,0,0,0-8Zm-47.92,46.43a4,4,0,1,0-5.65,5.65l22.62,22.63a4,4,0,0,0,5.66-5.66ZM128,188a4,4,0,0,0-4,4v32a4,4,0,0,0,8,0V192A4,4,0,0,0,128,188ZM79.92,170.43,57.29,193.05A4,4,0,0,0,63,198.71l22.62-22.63a4,4,0,1,0-5.65-5.65ZM68,128a4,4,0,0,0-4-4H32a4,4,0,0,0,0,8H64A4,4,0,0,0,68,128ZM63,57.29A4,4,0,0,0,57.29,63L79.92,85.57a4,4,0,1,0,5.65-5.65Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Stop.es.js
var e32 = __toESM(require("react"), 1);
var a34 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e32.createElement(e32.Fragment, null, /* @__PURE__ */ e32.createElement("path", { d: "M200,36H56A20,20,0,0,0,36,56V200a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V56A20,20,0,0,0,200,36Zm-4,160H60V60H196Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e32.createElement(e32.Fragment, null, /* @__PURE__ */ e32.createElement(
      "path",
      {
        d: "M208,56V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e32.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e32.createElement(e32.Fragment, null, /* @__PURE__ */ e32.createElement("path", { d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e32.createElement(e32.Fragment, null, /* @__PURE__ */ e32.createElement("path", { d: "M200,42H56A14,14,0,0,0,42,56V200a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V56A14,14,0,0,0,200,42Zm2,158a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H200a2,2,0,0,1,2,2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e32.createElement(e32.Fragment, null, /* @__PURE__ */ e32.createElement("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e32.createElement(e32.Fragment, null, /* @__PURE__ */ e32.createElement("path", { d: "M200,44H56A12,12,0,0,0,44,56V200a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12V56A12,12,0,0,0,200,44Zm4,156a4,4,0,0,1-4,4H56a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H200a4,4,0,0,1,4,4Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Trash.es.js
var a35 = __toESM(require("react"), 1);
var e33 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56Z", opacity: "0.2" }), /* @__PURE__ */ a35.createElement("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a35.createElement(a35.Fragment, null, /* @__PURE__ */ a35.createElement("path", { d: "M216,52H172V40a20,20,0,0,0-20-20H104A20,20,0,0,0,84,40V52H40a4,4,0,0,0,0,8H52V208a12,12,0,0,0,12,12H192a12,12,0,0,0,12-12V60h12a4,4,0,0,0,0-8ZM92,40a12,12,0,0,1,12-12h48a12,12,0,0,1,12,12V52H92ZM196,208a4,4,0,0,1-4,4H64a4,4,0,0,1-4-4V60H196ZM108,104v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Zm48,0v64a4,4,0,0,1-8,0V104a4,4,0,0,1,8,0Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/TreeStructure.es.js
var a36 = __toESM(require("react"), 1);
var H = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a36.createElement(a36.Fragment, null, /* @__PURE__ */ a36.createElement("path", { d: "M160,116h48a20,20,0,0,0,20-20V48a20,20,0,0,0-20-20H160a20,20,0,0,0-20,20V60H128a28,28,0,0,0-28,28v28H76v-4A20,20,0,0,0,56,92H24A20,20,0,0,0,4,112v32a20,20,0,0,0,20,20H56a20,20,0,0,0,20-20v-4h24v28a28,28,0,0,0,28,28h12v12a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V160a20,20,0,0,0-20-20H160a20,20,0,0,0-20,20v12H128a4,4,0,0,1-4-4V88a4,4,0,0,1,4-4h12V96A20,20,0,0,0,160,116ZM52,140H28V116H52Zm112,24h40v40H164Zm0-112h40V92H164Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a36.createElement(a36.Fragment, null, /* @__PURE__ */ a36.createElement(
      "path",
      {
        d: "M64,112v32a8,8,0,0,1-8,8H24a8,8,0,0,1-8-8V112a8,8,0,0,1,8-8H56A8,8,0,0,1,64,112ZM208,40H160a8,8,0,0,0-8,8V96a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V48A8,8,0,0,0,208,40Zm0,112H160a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V160A8,8,0,0,0,208,152Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a36.createElement("path", { d: "M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a36.createElement(a36.Fragment, null, /* @__PURE__ */ a36.createElement("path", { d: "M144,96V80H128a8,8,0,0,0-8,8v80a8,8,0,0,0,8,8h16V160a16,16,0,0,1,16-16h48a16,16,0,0,1,16,16v48a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V192H128a24,24,0,0,1-24-24V136H72v8a16,16,0,0,1-16,16H24A16,16,0,0,1,8,144V112A16,16,0,0,1,24,96H56a16,16,0,0,1,16,16v8h32V88a24,24,0,0,1,24-24h16V48a16,16,0,0,1,16-16h48a16,16,0,0,1,16,16V96a16,16,0,0,1-16,16H160A16,16,0,0,1,144,96Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a36.createElement(a36.Fragment, null, /* @__PURE__ */ a36.createElement("path", { d: "M160,110h48a14,14,0,0,0,14-14V48a14,14,0,0,0-14-14H160a14,14,0,0,0-14,14V66H128a22,22,0,0,0-22,22v34H70V112A14,14,0,0,0,56,98H24a14,14,0,0,0-14,14v32a14,14,0,0,0,14,14H56a14,14,0,0,0,14-14V134h36v34a22,22,0,0,0,22,22h18v18a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V160a14,14,0,0,0-14-14H160a14,14,0,0,0-14,14v18H128a10,10,0,0,1-10-10V88a10,10,0,0,1,10-10h18V96A14,14,0,0,0,160,110ZM58,144a2,2,0,0,1-2,2H24a2,2,0,0,1-2-2V112a2,2,0,0,1,2-2H56a2,2,0,0,1,2,2Zm100,16a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2v48a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2Zm0-112a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2V96a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a36.createElement(a36.Fragment, null, /* @__PURE__ */ a36.createElement("path", { d: "M160,112h48a16,16,0,0,0,16-16V48a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16V64H128a24,24,0,0,0-24,24v32H72v-8A16,16,0,0,0,56,96H24A16,16,0,0,0,8,112v32a16,16,0,0,0,16,16H56a16,16,0,0,0,16-16v-8h32v32a24,24,0,0,0,24,24h16v16a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V160a16,16,0,0,0-16-16H160a16,16,0,0,0-16,16v16H128a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h16V96A16,16,0,0,0,160,112ZM56,144H24V112H56v32Zm104,16h48v48H160Zm0-112h48V96H160Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a36.createElement(a36.Fragment, null, /* @__PURE__ */ a36.createElement("path", { d: "M160,108h48a12,12,0,0,0,12-12V48a12,12,0,0,0-12-12H160a12,12,0,0,0-12,12V68H128a20,20,0,0,0-20,20v36H68V112a12,12,0,0,0-12-12H24a12,12,0,0,0-12,12v32a12,12,0,0,0,12,12H56a12,12,0,0,0,12-12V132h40v36a20,20,0,0,0,20,20h20v20a12,12,0,0,0,12,12h48a12,12,0,0,0,12-12V160a12,12,0,0,0-12-12H160a12,12,0,0,0-12,12v20H128a12,12,0,0,1-12-12V88a12,12,0,0,1,12-12h20V96A12,12,0,0,0,160,108ZM60,144a4,4,0,0,1-4,4H24a4,4,0,0,1-4-4V112a4,4,0,0,1,4-4H56a4,4,0,0,1,4,4Zm96,16a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4v48a4,4,0,0,1-4,4H160a4,4,0,0,1-4-4Zm0-112a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V96a4,4,0,0,1-4,4H160a4,4,0,0,1-4-4Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/UserCircle.es.js
var e34 = __toESM(require("react"), 1);
var a37 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e34.createElement(e34.Fragment, null, /* @__PURE__ */ e34.createElement("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e34.createElement(e34.Fragment, null, /* @__PURE__ */ e34.createElement(
      "path",
      {
        d: "M224,128a95.76,95.76,0,0,1-31.8,71.37A72,72,0,0,0,128,160a40,40,0,1,0-40-40,40,40,0,0,0,40,40,72,72,0,0,0-64.2,39.37h0A96,96,0,1,1,224,128Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e34.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e34.createElement(e34.Fragment, null, /* @__PURE__ */ e34.createElement("path", { d: "M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e34.createElement(e34.Fragment, null, /* @__PURE__ */ e34.createElement("path", { d: "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26ZM71.44,198a66,66,0,0,1,113.12,0,89.8,89.8,0,0,1-113.12,0ZM94,120a34,34,0,1,1,34,34A34,34,0,0,1,94,120Zm99.51,69.64a77.53,77.53,0,0,0-40-31.38,46,46,0,1,0-51,0,77.53,77.53,0,0,0-40,31.38,90,90,0,1,1,131,0Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e34.createElement(e34.Fragment, null, /* @__PURE__ */ e34.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e34.createElement(e34.Fragment, null, /* @__PURE__ */ e34.createElement("path", { d: "M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28ZM68.87,198.42a68,68,0,0,1,118.26,0,91.8,91.8,0,0,1-118.26,0Zm124.3-5.55a75.61,75.61,0,0,0-44.51-34,44,44,0,1,0-41.32,0,75.61,75.61,0,0,0-44.51,34,92,92,0,1,1,130.34,0ZM128,156a36,36,0,1,1,36-36A36,36,0,0,1,128,156Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/Warning.es.js
var a38 = __toESM(require("react"), 1);
var e35 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement(
      "path",
      {
        d: "M215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22c6.3-11,22.52-11,28.82,0l87.46,151.87C236,202.79,228.08,216,215.46,216Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ a38.createElement("path", { d: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M235.07,189.09,147.61,37.22h0a22.75,22.75,0,0,0-39.22,0L20.93,189.09a21.53,21.53,0,0,0,0,21.72A22.35,22.35,0,0,0,40.55,222h174.9a22.35,22.35,0,0,0,19.6-11.19A21.53,21.53,0,0,0,235.07,189.09ZM224.66,204.8a10.46,10.46,0,0,1-9.21,5.2H40.55a10.46,10.46,0,0,1-9.21-5.2,9.51,9.51,0,0,1,0-9.72L118.79,43.21a10.75,10.75,0,0,1,18.42,0l87.46,151.87A9.51,9.51,0,0,1,224.66,204.8ZM122,144V104a6,6,0,0,1,12,0v40a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,180Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ a38.createElement(a38.Fragment, null, /* @__PURE__ */ a38.createElement("path", { d: "M233.34,190.09,145.88,38.22h0a20.75,20.75,0,0,0-35.76,0L22.66,190.09a19.52,19.52,0,0,0,0,19.71A20.36,20.36,0,0,0,40.54,220H215.46a20.36,20.36,0,0,0,17.86-10.2A19.52,19.52,0,0,0,233.34,190.09ZM226.4,205.8a12.47,12.47,0,0,1-10.94,6.2H40.54a12.47,12.47,0,0,1-10.94-6.2,11.45,11.45,0,0,1,0-11.72L117.05,42.21a12.76,12.76,0,0,1,21.9,0L226.4,194.08A11.45,11.45,0,0,1,226.4,205.8ZM124,144V104a4,4,0,0,1,8,0v40a4,4,0,0,1-8,0Zm12,36a8,8,0,1,1-8-8A8,8,0,0,1,136,180Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/WarningCircle.es.js
var e36 = __toESM(require("react"), 1);
var a39 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e36.createElement(e36.Fragment, null, /* @__PURE__ */ e36.createElement("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e36.createElement(e36.Fragment, null, /* @__PURE__ */ e36.createElement("path", { d: "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", opacity: "0.2" }), /* @__PURE__ */ e36.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e36.createElement(e36.Fragment, null, /* @__PURE__ */ e36.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e36.createElement(e36.Fragment, null, /* @__PURE__ */ e36.createElement("path", { d: "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm-6-82V80a6,6,0,0,1,12,0v56a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,172Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e36.createElement(e36.Fragment, null, /* @__PURE__ */ e36.createElement("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e36.createElement(e36.Fragment, null, /* @__PURE__ */ e36.createElement("path", { d: "M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm-4-84V80a4,4,0,0,1,8,0v56a4,4,0,0,1-8,0Zm12,36a8,8,0,1,1-8-8A8,8,0,0,1,136,172Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/defs/X.es.js
var e37 = __toESM(require("react"), 1);
var a40 = /* @__PURE__ */ new Map([
  [
    "bold",
    /* @__PURE__ */ e37.createElement(e37.Fragment, null, /* @__PURE__ */ e37.createElement("path", { d: "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" }))
  ],
  [
    "duotone",
    /* @__PURE__ */ e37.createElement(e37.Fragment, null, /* @__PURE__ */ e37.createElement(
      "path",
      {
        d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
        opacity: "0.2"
      }
    ), /* @__PURE__ */ e37.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "fill",
    /* @__PURE__ */ e37.createElement(e37.Fragment, null, /* @__PURE__ */ e37.createElement("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "light",
    /* @__PURE__ */ e37.createElement(e37.Fragment, null, /* @__PURE__ */ e37.createElement("path", { d: "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z" }))
  ],
  [
    "regular",
    /* @__PURE__ */ e37.createElement(e37.Fragment, null, /* @__PURE__ */ e37.createElement("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }))
  ],
  [
    "thin",
    /* @__PURE__ */ e37.createElement(e37.Fragment, null, /* @__PURE__ */ e37.createElement("path", { d: "M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z" }))
  ]
]);

// node_modules/@phosphor-icons/react/dist/lib/IconBase.es.js
var e38 = __toESM(require("react"), 1);

// node_modules/@phosphor-icons/react/dist/lib/context.es.js
var import_react = require("react");
var o = (0, import_react.createContext)({
  color: "currentColor",
  size: "1em",
  weight: "regular",
  mirrored: false
});

// node_modules/@phosphor-icons/react/dist/lib/IconBase.es.js
var p = e38.forwardRef(
  (s11, a49) => {
    const {
      alt: n14,
      color: r10,
      size: t9,
      weight: o33,
      mirrored: c7,
      children: i,
      weights: m10,
      ...x
    } = s11, {
      color: d = "currentColor",
      size: l5,
      weight: f2 = "regular",
      mirrored: g = false,
      ...w
    } = e38.useContext(o);
    return /* @__PURE__ */ e38.createElement(
      "svg",
      {
        ref: a49,
        xmlns: "http://www.w3.org/2000/svg",
        width: t9 != null ? t9 : l5,
        height: t9 != null ? t9 : l5,
        fill: r10 != null ? r10 : d,
        viewBox: "0 0 256 256",
        transform: c7 || g ? "scale(-1, 1)" : void 0,
        ...w,
        ...x
      },
      !!n14 && /* @__PURE__ */ e38.createElement("title", null, n14),
      i,
      m10.get(o33 != null ? o33 : f2)
    );
  }
);
p.displayName = "IconBase";

// node_modules/@phosphor-icons/react/dist/csr/ArrowClockwise.es.js
var o2 = __toESM(require("react"), 1);
var r2 = o2.forwardRef((e70, c7) => /* @__PURE__ */ o2.createElement(p, { ref: c7, ...e70, weights: a }));
r2.displayName = "ArrowClockwiseIcon";
var m = r2;

// node_modules/@phosphor-icons/react/dist/csr/ArrowRight.es.js
var o3 = __toESM(require("react"), 1);
var r3 = o3.forwardRef((t9, e70) => /* @__PURE__ */ o3.createElement(p, { ref: e70, ...t9, weights: a2 }));
r3.displayName = "ArrowRightIcon";
var s = r3;

// node_modules/@phosphor-icons/react/dist/csr/ArrowUpRight.es.js
var o4 = __toESM(require("react"), 1);
var r4 = o4.forwardRef((t9, e70) => /* @__PURE__ */ o4.createElement(p, { ref: e70, ...t9, weights: a3 }));
r4.displayName = "ArrowUpRightIcon";
var c = r4;

// node_modules/@phosphor-icons/react/dist/csr/Books.es.js
var o5 = __toESM(require("react"), 1);
var e39 = o5.forwardRef((r10, s11) => /* @__PURE__ */ o5.createElement(p, { ref: s11, ...r10, weights: e4 }));
e39.displayName = "BooksIcon";
var n = e39;

// node_modules/@phosphor-icons/react/dist/csr/CalendarBlank.es.js
var a41 = __toESM(require("react"), 1);
var e40 = a41.forwardRef((o33, r10) => /* @__PURE__ */ a41.createElement(p, { ref: r10, ...o33, weights: e5 }));
e40.displayName = "CalendarBlankIcon";
var c2 = e40;

// node_modules/@phosphor-icons/react/dist/csr/CalendarCheck.es.js
var e41 = __toESM(require("react"), 1);
var a42 = e41.forwardRef((o33, r10) => /* @__PURE__ */ e41.createElement(p, { ref: r10, ...o33, weights: V }));
a42.displayName = "CalendarCheckIcon";
var s2 = a42;

// node_modules/@phosphor-icons/react/dist/csr/CaretDown.es.js
var o6 = __toESM(require("react"), 1);
var e42 = o6.forwardRef((r10, t9) => /* @__PURE__ */ o6.createElement(p, { ref: t9, ...r10, weights: t }));
e42.displayName = "CaretDownIcon";
var s3 = e42;

// node_modules/@phosphor-icons/react/dist/csr/ChatCircleText.es.js
var e43 = __toESM(require("react"), 1);
var t3 = e43.forwardRef((o33, r10) => /* @__PURE__ */ e43.createElement(p, { ref: r10, ...o33, weights: e7 }));
t3.displayName = "ChatCircleTextIcon";
var s4 = t3;

// node_modules/@phosphor-icons/react/dist/csr/ChatsCircle.es.js
var e44 = __toESM(require("react"), 1);
var o7 = e44.forwardRef((r10, t9) => /* @__PURE__ */ e44.createElement(p, { ref: t9, ...r10, weights: e8 }));
o7.displayName = "ChatsCircleIcon";
var m2 = o7;

// node_modules/@phosphor-icons/react/dist/csr/Check.es.js
var e45 = __toESM(require("react"), 1);
var o8 = e45.forwardRef((c7, r10) => /* @__PURE__ */ e45.createElement(p, { ref: r10, ...c7, weights: a9 }));
o8.displayName = "CheckIcon";
var n2 = o8;

// node_modules/@phosphor-icons/react/dist/csr/CheckCircle.es.js
var e46 = __toESM(require("react"), 1);
var c3 = e46.forwardRef((o33, r10) => /* @__PURE__ */ e46.createElement(p, { ref: r10, ...o33, weights: a10 }));
c3.displayName = "CheckCircleIcon";
var s5 = c3;

// node_modules/@phosphor-icons/react/dist/csr/ClockCountdown.es.js
var o9 = __toESM(require("react"), 1);
var t4 = o9.forwardRef((n14, c7) => /* @__PURE__ */ o9.createElement(p, { ref: c7, ...n14, weights: e11 }));
t4.displayName = "ClockCountdownIcon";
var s6 = t4;

// node_modules/@phosphor-icons/react/dist/csr/Database.es.js
var a43 = __toESM(require("react"), 1);
var e47 = a43.forwardRef((o33, t9) => /* @__PURE__ */ a43.createElement(p, { ref: t9, ...o33, weights: t2 }));
e47.displayName = "DatabaseIcon";
var n3 = e47;

// node_modules/@phosphor-icons/react/dist/csr/DownloadSimple.es.js
var o10 = __toESM(require("react"), 1);
var e48 = o10.forwardRef((a49, m10) => /* @__PURE__ */ o10.createElement(p, { ref: m10, ...a49, weights: e13 }));
e48.displayName = "DownloadSimpleIcon";
var l4 = e48;

// node_modules/@phosphor-icons/react/dist/csr/File.es.js
var e49 = __toESM(require("react"), 1);
var o11 = e49.forwardRef((r10, t9) => /* @__PURE__ */ e49.createElement(p, { ref: t9, ...r10, weights: a13 }));
o11.displayName = "FileIcon";
var s7 = o11;

// node_modules/@phosphor-icons/react/dist/csr/FolderOpen.es.js
var o12 = __toESM(require("react"), 1);
var e50 = o12.forwardRef((r10, n14) => /* @__PURE__ */ o12.createElement(p, { ref: n14, ...r10, weights: e15 }));
e50.displayName = "FolderOpenIcon";
var m3 = e50;

// node_modules/@phosphor-icons/react/dist/csr/GearSix.es.js
var e51 = __toESM(require("react"), 1);
var o13 = e51.forwardRef((r10, a49) => /* @__PURE__ */ e51.createElement(p, { ref: a49, ...r10, weights: l }));
o13.displayName = "GearSixIcon";
var s8 = o13;

// node_modules/@phosphor-icons/react/dist/csr/House.es.js
var o14 = __toESM(require("react"), 1);
var e52 = o14.forwardRef((r10, s11) => /* @__PURE__ */ o14.createElement(p, { ref: s11, ...r10, weights: e16 }));
e52.displayName = "HouseIcon";
var n4 = e52;

// node_modules/@phosphor-icons/react/dist/csr/ImageSquare.es.js
var e53 = __toESM(require("react"), 1);
var a44 = e53.forwardRef((o33, r10) => /* @__PURE__ */ e53.createElement(p, { ref: r10, ...o33, weights: e17 }));
a44.displayName = "ImageSquareIcon";
var I = a44;

// node_modules/@phosphor-icons/react/dist/csr/Info.es.js
var o15 = __toESM(require("react"), 1);
var e54 = o15.forwardRef((r10, t9) => /* @__PURE__ */ o15.createElement(p, { ref: t9, ...r10, weights: a18 }));
e54.displayName = "InfoIcon";
var c4 = e54;

// node_modules/@phosphor-icons/react/dist/csr/Key.es.js
var e55 = __toESM(require("react"), 1);
var o16 = e55.forwardRef((r10, t9) => /* @__PURE__ */ e55.createElement(p, { ref: t9, ...r10, weights: e19 }));
o16.displayName = "KeyIcon";
var n5 = o16;

// node_modules/@phosphor-icons/react/dist/csr/List.es.js
var o17 = __toESM(require("react"), 1);
var t5 = o17.forwardRef((e70, r10) => /* @__PURE__ */ o17.createElement(p, { ref: r10, ...e70, weights: e20 }));
t5.displayName = "ListIcon";
var c5 = t5;

// node_modules/@phosphor-icons/react/dist/csr/ListBullets.es.js
var t6 = __toESM(require("react"), 1);
var e56 = t6.forwardRef((o33, s11) => /* @__PURE__ */ t6.createElement(p, { ref: s11, ...o33, weights: e21 }));
e56.displayName = "ListBulletsIcon";
var m4 = e56;

// node_modules/@phosphor-icons/react/dist/csr/MagnifyingGlass.es.js
var a45 = __toESM(require("react"), 1);
var o18 = a45.forwardRef((s11, n14) => /* @__PURE__ */ a45.createElement(p, { ref: n14, ...s11, weights: a22 }));
o18.displayName = "MagnifyingGlassIcon";
var f = o18;

// node_modules/@phosphor-icons/react/dist/csr/Note.es.js
var o19 = __toESM(require("react"), 1);
var e57 = o19.forwardRef((t9, r10) => /* @__PURE__ */ o19.createElement(p, { ref: r10, ...t9, weights: e23 }));
e57.displayName = "NoteIcon";
var n6 = e57;

// node_modules/@phosphor-icons/react/dist/csr/PaperPlaneTilt.es.js
var e58 = __toESM(require("react"), 1);
var a46 = e58.forwardRef((o33, r10) => /* @__PURE__ */ e58.createElement(p, { ref: r10, ...o33, weights: e24 }));
a46.displayName = "PaperPlaneTiltIcon";
var m5 = a46;

// node_modules/@phosphor-icons/react/dist/csr/Paperclip.es.js
var e59 = __toESM(require("react"), 1);
var o20 = e59.forwardRef((r10, a49) => /* @__PURE__ */ e59.createElement(p, { ref: a49, ...r10, weights: e25 }));
o20.displayName = "PaperclipIcon";
var m6 = o20;

// node_modules/@phosphor-icons/react/dist/csr/PencilSimple.es.js
var e60 = __toESM(require("react"), 1);
var o21 = e60.forwardRef((i, m10) => /* @__PURE__ */ e60.createElement(p, { ref: m10, ...i, weights: e26 }));
o21.displayName = "PencilSimpleIcon";
var a47 = o21;

// node_modules/@phosphor-icons/react/dist/csr/Play.es.js
var o22 = __toESM(require("react"), 1);
var a48 = o22.forwardRef((e70, r10) => /* @__PURE__ */ o22.createElement(p, { ref: r10, ...e70, weights: a27 }));
a48.displayName = "PlayIcon";
var n7 = a48;

// node_modules/@phosphor-icons/react/dist/csr/Plug.es.js
var o23 = __toESM(require("react"), 1);
var e61 = o23.forwardRef((r10, t9) => /* @__PURE__ */ o23.createElement(p, { ref: t9, ...r10, weights: l2 }));
e61.displayName = "PlugIcon";
var n8 = e61;

// node_modules/@phosphor-icons/react/dist/csr/Plus.es.js
var o24 = __toESM(require("react"), 1);
var e62 = o24.forwardRef((r10, s11) => /* @__PURE__ */ o24.createElement(p, { ref: s11, ...r10, weights: a29 }));
e62.displayName = "PlusIcon";
var n9 = e62;

// node_modules/@phosphor-icons/react/dist/csr/Robot.es.js
var o25 = __toESM(require("react"), 1);
var t7 = o25.forwardRef((e70, r10) => /* @__PURE__ */ o25.createElement(p, { ref: r10, ...e70, weights: e29 }));
t7.displayName = "RobotIcon";
var n10 = t7;

// node_modules/@phosphor-icons/react/dist/csr/ShieldCheck.es.js
var e63 = __toESM(require("react"), 1);
var o26 = e63.forwardRef((c7, r10) => /* @__PURE__ */ e63.createElement(p, { ref: r10, ...c7, weights: e30 }));
o26.displayName = "ShieldCheckIcon";
var h = o26;

// node_modules/@phosphor-icons/react/dist/csr/Sparkle.es.js
var e64 = __toESM(require("react"), 1);
var o27 = e64.forwardRef((r10, a49) => /* @__PURE__ */ e64.createElement(p, { ref: a49, ...r10, weights: l3 }));
o27.displayName = "SparkleIcon";
var s9 = o27;

// node_modules/@phosphor-icons/react/dist/csr/SpinnerGap.es.js
var e65 = __toESM(require("react"), 1);
var o28 = e65.forwardRef((r10, n14) => /* @__PURE__ */ e65.createElement(p, { ref: n14, ...r10, weights: e31 }));
o28.displayName = "SpinnerGapIcon";
var m7 = o28;

// node_modules/@phosphor-icons/react/dist/csr/Stop.es.js
var o29 = __toESM(require("react"), 1);
var t8 = o29.forwardRef((e70, r10) => /* @__PURE__ */ o29.createElement(p, { ref: r10, ...e70, weights: a34 }));
t8.displayName = "StopIcon";
var s10 = t8;

// node_modules/@phosphor-icons/react/dist/csr/Trash.es.js
var o30 = __toESM(require("react"), 1);
var r5 = o30.forwardRef((a49, e70) => /* @__PURE__ */ o30.createElement(p, { ref: e70, ...a49, weights: e33 }));
r5.displayName = "TrashIcon";
var n11 = r5;

// node_modules/@phosphor-icons/react/dist/csr/TreeStructure.es.js
var e66 = __toESM(require("react"), 1);
var r6 = e66.forwardRef((t9, o33) => /* @__PURE__ */ e66.createElement(p, { ref: o33, ...t9, weights: H }));
r6.displayName = "TreeStructureIcon";
var n12 = r6;

// node_modules/@phosphor-icons/react/dist/csr/UserCircle.es.js
var e67 = __toESM(require("react"), 1);
var r7 = e67.forwardRef((o33, c7) => /* @__PURE__ */ e67.createElement(p, { ref: c7, ...o33, weights: a37 }));
r7.displayName = "UserCircleIcon";
var m8 = r7;

// node_modules/@phosphor-icons/react/dist/csr/Warning.es.js
var o31 = __toESM(require("react"), 1);
var r8 = o31.forwardRef((n14, a49) => /* @__PURE__ */ o31.createElement(p, { ref: a49, ...n14, weights: e35 }));
r8.displayName = "WarningIcon";
var c6 = r8;

// node_modules/@phosphor-icons/react/dist/csr/WarningCircle.es.js
var r9 = __toESM(require("react"), 1);
var e68 = r9.forwardRef((o33, n14) => /* @__PURE__ */ r9.createElement(p, { ref: n14, ...o33, weights: a39 }));
e68.displayName = "WarningCircleIcon";
var m9 = e68;

// node_modules/@phosphor-icons/react/dist/csr/X.es.js
var o32 = __toESM(require("react"), 1);
var e69 = o32.forwardRef((r10, t9) => /* @__PURE__ */ o32.createElement(p, { ref: t9, ...r10, weights: a40 }));
e69.displayName = "XIcon";
var n13 = e69;

// src/client/ProjectHome.js
var import_react3 = __toESM(require("react"), 1);

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

// src/client/ProjectHome.js
var homeOpen = true;
var homeListeners = /* @__PURE__ */ new Set();
function useHomeOpen() {
  return import_react3.default.useSyncExternalStore(
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
function ProjectCard({ project, index, enterProject, busyId, setBusyId, setError, onRename, onDelete }) {
  const recent = project.recentSession || null;
  const mountedRef = import_react3.default.useRef(true);
  import_react3.default.useEffect(function() {
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
    }).catch(function(err) {
      if (!mountedRef.current) return;
      setError(err && err.message ? err.message : "\u65E0\u6CD5\u6253\u5F00\u9879\u76EE");
      setBusyId(null);
    });
  };
  const busy = busyId === "project:" + project.id;
  return import_react3.default.createElement(
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
    import_react3.default.createElement("div", { className: "cpwb-card-scan", "aria-hidden": true }),
    import_react3.default.createElement(
      "div",
      { className: "cpwb-card-topline" },
      import_react3.default.createElement("span", { className: "cpwb-card-seq" }, "PROJECT / " + String(index + 1).padStart(2, "0")),
      import_react3.default.createElement(
        "div",
        { className: "cpwb-card-top-actions" },
        import_react3.default.createElement("span", { className: "cpwb-card-state" }, recent ? "SESSION READY" : "NEW NODE"),
        import_react3.default.createElement("button", {
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
        }, import_react3.default.createElement(a47, { size: 14, weight: "regular", "aria-hidden": true })),
        import_react3.default.createElement("button", {
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
        }, import_react3.default.createElement(n11, { size: 14, weight: "regular", "aria-hidden": true }))
      )
    ),
    import_react3.default.createElement("div", { className: "cpwb-card-symbol", "aria-hidden": true }, glyph(ICONS.folder, 32)),
    import_react3.default.createElement(
      "div",
      { className: "cpwb-card-copy" },
      import_react3.default.createElement("h3", null, project.name),
      import_react3.default.createElement("p", { title: project.path || "" }, shortPath(project.path)),
      import_react3.default.createElement("span", null, formatRecent(recent && recent.updatedAt))
    ),
    import_react3.default.createElement(
      "div",
      { className: "cpwb-card-actions" },
      import_react3.default.createElement("span", { className: "cpwb-card-enter" }, busy ? "\u8FDE\u63A5\u4E2D\u2026" : recent ? "\u7EE7\u7EED\u4F1A\u8BDD" : "\u8FDB\u5165\u9879\u76EE", import_react3.default.createElement(c, { size: 14, weight: "regular", "aria-hidden": true })),
      import_react3.default.createElement("button", {
        type: "button",
        className: "cpwb-card-new",
        onClick: function(event) {
          event.stopPropagation();
          open(true);
        },
        disabled: busyId != null,
        title: "\u4E3A\u8BE5\u9879\u76EE\u65B0\u5EFA\u4F1A\u8BDD"
      }, glyph(ICONS.plus), import_react3.default.createElement("span", null, "\u65B0\u4F1A\u8BDD"))
    )
  );
}
function ProjectHome(props) {
  const store3 = props.store;
  const state = import_react3.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const legacyOpen = useHomeOpen();
  const open = props.open === void 0 ? legacyOpen : props.open;
  const homeStyle = useHomeOverlayStyle(open);
  const [busyId, setBusyId] = import_react3.default.useState(null);
  const [enterError, setEnterError] = import_react3.default.useState(null);
  const [creatingProject, setCreatingProject] = import_react3.default.useState(false);
  const [renameTarget, setRenameTarget] = import_react3.default.useState(null);
  const [renameDraft, setRenameDraft] = import_react3.default.useState("");
  const [deleteTarget, setDeleteTarget] = import_react3.default.useState(null);
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
  const deleting = !!(state.action && state.action.type === "deleteProject" && state.action.status === "running");
  const addFolder = function() {
    if (creatingProject) return;
    setCreatingProject(true);
    setEnterError(null);
    props.createProject().catch(function(err) {
      setEnterError(err && err.message ? err.message : "\u6DFB\u52A0\u6587\u4EF6\u5939\u5931\u8D25");
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
    }).catch(function(err) {
      setEnterError(err && err.message ? err.message : "\u4FEE\u6539\u9879\u76EE\u540D\u79F0\u5931\u8D25");
    });
  };
  const confirmDelete = function() {
    if (!deleteTarget || deleting) return;
    setEnterError(null);
    store3.actions.deleteProject(deleteTarget.id).then(function() {
      setDeleteTarget(null);
    }).catch(function(err) {
      setEnterError(err && err.message ? err.message : "\u5220\u9664\u9879\u76EE\u5931\u8D25");
    });
  };
  return import_react3.default.createElement(
    "div",
    { className: "cpwb-home cpwb-workbench-overlay", "data-page": "home", style: homeStyle, role: "main", "aria-label": "Deepseek Harness Workbench" },
    import_react3.default.createElement("div", { className: "cpwb-home-noise", "aria-hidden": true }),
    import_react3.default.createElement(
      "main",
      { className: "cpwb-home-main" },
      import_react3.default.createElement(
        "section",
        { className: "cpwb-hero" },
        import_react3.default.createElement("div", { className: "cpwb-hero-kicker" }, "Harness Workbench / Intelligence online"),
        import_react3.default.createElement(
          "h1",
          null,
          import_react3.default.createElement("span", null, "YOUR PROJECT."),
          import_react3.default.createElement("span", null, "YOUR SYSTEM."),
          import_react3.default.createElement("span", { className: "cpwb-hero-accent" }, "YOUR INTELLIGENCE.")
        ),
        import_react3.default.createElement("p", null, "\u9A7E\u9A6D\u667A\u80FD\uFF0C\u9879\u76EE\u89C9\u9192"),
        import_react3.default.createElement(
          "div",
          { className: "cpwb-home-metrics" },
          import_react3.default.createElement("span", null, import_react3.default.createElement("b", null, String(workspaceCount).padStart(2, "0")), " WORKSPACES"),
          import_react3.default.createElement("span", null, import_react3.default.createElement("b", null, String(sessionCount).padStart(2, "0")), " SESSIONS"),
          import_react3.default.createElement("span", null, import_react3.default.createElement("b", null, String(knowledgeCount).padStart(2, "0")), " KNOWLEDGE")
        )
      ),
      error ? import_react3.default.createElement(
        "div",
        { className: "cpwb-home-error", role: "alert" },
        glyph(ICONS.warn),
        import_react3.default.createElement("span", null, error.message || String(error)),
        import_react3.default.createElement("button", { type: "button", onClick: function() {
          setEnterError(null);
          store3.actions.retry().catch(function() {
          });
        } }, "\u91CD\u8BD5")
      ) : null,
      state.phase === "loading" ? import_react3.default.createElement("div", { className: "cpwb-home-loading", role: "status" }, import_react3.default.createElement("i"), " \u6B63\u5728\u540C\u6B65\u5DE5\u4F5C\u53F0\u6570\u636E\u2026") : import_react3.default.createElement(
        import_react3.default.Fragment,
        null,
        import_react3.default.createElement(
          "section",
          { className: "cpwb-home-section" },
          import_react3.default.createElement(
            "header",
            null,
            import_react3.default.createElement("div", null, import_react3.default.createElement("span", null, "01 / WORKSPACES"), import_react3.default.createElement("h2", null, "\u9879\u76EE\u5DE5\u4F5C\u533A")),
            import_react3.default.createElement(
              "button",
              { type: "button", className: "cpwb-folder-add", onClick: addFolder, disabled: creatingProject, title: "\u6DFB\u52A0\u6587\u4EF6\u5939\u4E3A\u9879\u76EE", "aria-label": "\u6DFB\u52A0\u6587\u4EF6\u5939\u4E3A\u9879\u76EE" },
              import_react3.default.createElement("span", null, glyph(ICONS.folder, 22)),
              import_react3.default.createElement("b", null, "+"),
              import_react3.default.createElement("em", null, creatingProject ? "\u8FDE\u63A5\u4E2D" : "\u6DFB\u52A0\u6587\u4EF6\u5939")
            )
          ),
          projects.length === 0 ? import_react3.default.createElement(Empty, { glyph: glyph(ICONS.folder, 24) }, "\u6682\u65E0\u9879\u76EE\uFF0C\u4F7F\u7528\u53F3\u4E0A\u89D2\u6587\u4EF6\u5939\u56FE\u6807\u6DFB\u52A0") : import_react3.default.createElement("div", { className: "cpwb-project-grid" }, projects.map(function(project, index) {
            return import_react3.default.createElement(ProjectCard, {
              key: project.id,
              project,
              index,
              enterProject: props.enterProject,
              busyId,
              setBusyId,
              setError: setEnterError,
              onRename: beginRename,
              onDelete: setDeleteTarget
            });
          }))
        ),
        import_react3.default.createElement(
          "section",
          { className: "cpwb-home-section cpwb-knowledge-entry" },
          import_react3.default.createElement(
            "button",
            { type: "button", onClick: props.openKnowledge },
            import_react3.default.createElement(n3, { size: 26, weight: "regular", "aria-hidden": true }),
            import_react3.default.createElement(
              "span",
              null,
              import_react3.default.createElement("small", null, "02 / KNOWLEDGE NODES"),
              import_react3.default.createElement("strong", null, "\u6253\u5F00\u77E5\u8BC6\u5E93\u4E2D\u5FC3"),
              import_react3.default.createElement("em", null, knowledgeBases.length + " \u4E2A\u77E5\u8BC6\u5E93 \xB7 \u4E0A\u4F20\u3001\u5411\u91CF\u5316\u3001\u68C0\u7D22\u4E0E\u4F1A\u8BDD")
            ),
            import_react3.default.createElement(c, { size: 20, weight: "regular", "aria-hidden": true })
          )
        )
      )
    ),
    import_react3.default.createElement("footer", { className: "cpwb-home-footer" }, "DEEPSEEK HARNESS / PROJECT INTELLIGENCE SYSTEM", import_react3.default.createElement("span", null, "LOCAL-FIRST \xB7 VECTOR-READY")),
    renameTarget ? import_react3.default.createElement("div", {
      className: "cpwb-modal-backdrop",
      onMouseDown: function(event) {
        if (event.target === event.currentTarget && !renaming) setRenameTarget(null);
      }
    }, import_react3.default.createElement(
      "form",
      {
        className: "cpwb-modal cpwb-project-modal",
        role: "dialog",
        "aria-modal": true,
        "aria-labelledby": "cpwb-rename-project-title",
        onSubmit: submitRename
      },
      import_react3.default.createElement("div", { className: "cpwb-modal-kicker" }, "PROJECT / RENAME"),
      import_react3.default.createElement("h3", { id: "cpwb-rename-project-title" }, "\u4FEE\u6539\u9879\u76EE\u540D\u79F0"),
      import_react3.default.createElement("label", null, "\u9879\u76EE\u540D\u79F0", import_react3.default.createElement("input", {
        value: renameDraft,
        maxLength: 120,
        autoFocus: true,
        onChange: function(event) {
          setRenameDraft(event.target.value);
        }
      })),
      import_react3.default.createElement("p", { className: "cpwb-project-modal-note" }, "\u4EC5\u4FEE\u6539 Workbench \u4E2D\u7684\u663E\u793A\u540D\u79F0\uFF0C\u4E0D\u4F1A\u91CD\u547D\u540D\u78C1\u76D8\u76EE\u5F55\u6216 DSH workspace\u3002"),
      import_react3.default.createElement(
        "div",
        { className: "cpwb-modal-actions" },
        import_react3.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: renaming, onClick: function() {
          setRenameTarget(null);
        } }, "\u53D6\u6D88"),
        import_react3.default.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: renaming || renameDraft.trim() === "" }, renaming ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u540D\u79F0")
      )
    )) : null,
    deleteTarget ? import_react3.default.createElement("div", {
      className: "cpwb-modal-backdrop",
      onMouseDown: function(event) {
        if (event.target === event.currentTarget && !deleting) setDeleteTarget(null);
      }
    }, import_react3.default.createElement(
      "section",
      {
        className: "cpwb-modal cpwb-danger-modal cpwb-project-modal",
        role: "dialog",
        "aria-modal": true,
        "aria-labelledby": "cpwb-delete-project-title"
      },
      import_react3.default.createElement("div", { className: "cpwb-modal-kicker" }, "PROJECT / DELETE"),
      import_react3.default.createElement("h3", { id: "cpwb-delete-project-title" }, "\u4ECE Workbench \u5220\u9664\u300C" + deleteTarget.name + "\u300D\uFF1F"),
      import_react3.default.createElement("p", null, "\u9879\u76EE\u7684\u5F85\u529E\u3001\u5B9A\u65F6\u4EFB\u52A1\u3001\u603B\u7ED3\u3001\u9879\u76EE\u4F1A\u8BDD\u53CA\u4EC5\u5C5E\u4E8E\u8BE5\u9879\u76EE\u7684\u6587\u6863\u4E0E\u5411\u91CF\u5C06\u6C38\u4E45\u5220\u9664\uFF1B\u5171\u4EAB\u6587\u6863\u548C\u5173\u8054\u77E5\u8BC6\u5E93\u4F1A\u4FDD\u7559\u3002"),
      import_react3.default.createElement("div", { className: "cpwb-danger-confirm" }, import_react3.default.createElement("span", null, "\u78C1\u76D8\u76EE\u5F55\u4E0E DSH workspace \u4E0D\u4F1A\u88AB\u5220\u9664\u3002")),
      import_react3.default.createElement(
        "div",
        { className: "cpwb-modal-actions" },
        import_react3.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: deleting, onClick: function() {
          setDeleteTarget(null);
        } }, "\u53D6\u6D88"),
        import_react3.default.createElement(
          "button",
          { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", disabled: deleting, onClick: confirmDelete },
          import_react3.default.createElement(n11, { size: 14, "aria-hidden": true }),
          import_react3.default.createElement("span", null, deleting ? "\u5220\u9664\u4E2D\u2026" : "\u5220\u9664\u9879\u76EE")
        )
      )
    )) : null
  );
}

// src/client/WorkbenchSessionShell.js
var import_react17 = __toESM(require("react"), 1);

// src/client/Todos.js
var import_react7 = __toESM(require("react"), 1);

// src/client/globalModal.js
var import_react6 = __toESM(require("react"), 1);

// src/client/responsive.js
var import_react5 = __toESM(require("react"), 1);
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
  const observed = import_react5.default.useSyncExternalStore(subscribeViewport, viewportSnapshot, () => "desktop");
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
  const dialogRef = import_react5.default.useRef(null);
  import_react5.default.useEffect(function() {
    if (!open) return void 0;
    const dialog = dialogRef.current;
    if (!dialog) return void 0;
    const restoreTarget = triggerRef?.current || document.activeElement;
    return activateDrawerDialog(dialog, restoreTarget);
  }, [open, triggerRef]);
  if (!open) return null;
  return import_react5.default.createElement("dialog", {
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
  const dialogRef = import_react6.default.useRef(null);
  const restoreTargetRef = import_react6.default.useRef(typeof document === "undefined" ? null : document.activeElement);
  import_react6.default.useEffect(function() {
    return activateDrawerDialog(dialogRef.current, restoreTargetRef.current);
  }, []);
  return import_react6.default.createElement("dialog", {
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
  const p2 = localDateTimeParts(value, timeZone);
  return `${String(p2.year).padStart(4, "0")}-${String(p2.month).padStart(2, "0")}-${String(p2.day).padStart(2, "0")}`;
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
  const p2 = localDateTimeParts(value, timeZone);
  return `${String(p2.year).padStart(4, "0")}-${String(p2.month).padStart(2, "0")}-${String(p2.day).padStart(2, "0")} ${String(p2.hour).padStart(2, "0")}:${String(p2.minute).padStart(2, "0")}`;
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
function organizeTodos(todos, { view = "pending", timeZone = DEFAULT_TIME_ZONE, now = /* @__PURE__ */ new Date() } = {}) {
  const today = localDateKey2(now, timeZone);
  const tomorrow = addLocalDays(today, 1);
  const rows = (Array.isArray(todos) ? todos : []).filter((todo) => view === "completed" ? todo.done : !todo.done);
  rows.sort((a49, b) => view === "completed" ? new Date(b.completedAt || b.dueAt).getTime() - new Date(a49.completedAt || a49.dueAt).getTime() : new Date(a49.dueAt).getTime() - new Date(b.dueAt).getTime());
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
  const [title, setTitle] = import_react7.default.useState(todo?.title || "");
  const [date, setDate] = import_react7.default.useState(initial.date);
  const [time, setTime] = import_react7.default.useState(initial.time);
  const [localError, setLocalError] = import_react7.default.useState("");
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
  return import_react7.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-todo-dialog-title" },
    import_react7.default.createElement(
      "form",
      { className: "cpwb-modal", onSubmit: submit },
      import_react7.default.createElement("div", { className: "cpwb-modal-kicker" }, todo ? "TODO / MODIFY" : "TODO / NEW"),
      import_react7.default.createElement("h3", { id: "cpwb-todo-dialog-title" }, todo ? "\u7F16\u8F91\u5F85\u529E" : "\u6DFB\u52A0\u5F85\u529E"),
      import_react7.default.createElement("label", null, "\u6807\u9898", import_react7.default.createElement("input", { autoFocus: true, value: title, onChange: (e70) => setTitle(e70.target.value), placeholder: "\u4F8B\u5982\uFF1A\u5B8C\u6210\u68C0\u7D22\u63A5\u53E3\u5BA1\u8BA1" })),
      import_react7.default.createElement(
        "div",
        { className: "cpwb-form-grid" },
        import_react7.default.createElement("label", null, "\u9884\u8BA1\u5B8C\u6210\u65E5\u671F", import_react7.default.createElement("input", { type: "date", value: date, onChange: (e70) => setDate(e70.target.value) })),
        import_react7.default.createElement("label", null, "\u9884\u8BA1\u5B8C\u6210\u65F6\u95F4", import_react7.default.createElement("input", { type: "time", value: time, onChange: (e70) => setTime(e70.target.value) }))
      ),
      localError || error ? import_react7.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, localError || error.message || String(error)) : null,
      import_react7.default.createElement("div", { className: "cpwb-modal-actions" }, import_react7.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: onClose }, "\u53D6\u6D88"), import_react7.default.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: busy }, busy ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"))
    )
  );
}
function Todos({ store: store3, projectId, now }) {
  const state = import_react7.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const [dialog, setDialog] = import_react7.default.useState(null);
  const [deleteTarget, setDeleteTarget] = import_react7.default.useState(null);
  const [view, setView] = import_react7.default.useState("pending");
  const action = state.action;
  const todos = Array.isArray(state.todos) ? state.todos : [];
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
  const sections = organizeTodos(todos, { view, timeZone, now: now || /* @__PURE__ */ new Date() });
  const remove = () => store3.actions.deleteTodo(deleteTarget.id).then(() => setDeleteTarget(null));
  return import_react7.default.createElement(
    "section",
    { className: "cpwb-tool-panel" },
    import_react7.default.createElement("div", { className: "cpwb-tool-head" }, import_react7.default.createElement("span", null, "PROJECT TODO"), import_react7.default.createElement("button", { className: "cpwb-btn cpwb-btn-primary cpwb-button-content", type: "button", onClick: () => setDialog({ todo: null }) }, import_react7.default.createElement(n9, { size: 14, weight: "bold" }), import_react7.default.createElement("span", null, "\u65B0\u589E"))),
    import_react7.default.createElement(
      "div",
      { className: "cpwb-todo-tabs", role: "tablist", "aria-label": "\u5F85\u529E\u72B6\u6001" },
      import_react7.default.createElement("button", { type: "button", role: "tab", "aria-selected": view === "pending", className: view === "pending" ? "cpwb-active" : "", onClick: () => setView("pending") }, import_react7.default.createElement("span", null, "\u5F85\u5904\u7406"), import_react7.default.createElement("small", null, pending)),
      import_react7.default.createElement("button", { type: "button", role: "tab", "aria-selected": view === "completed", className: view === "completed" ? "cpwb-active" : "", onClick: () => setView("completed") }, import_react7.default.createElement("span", null, "\u5DF2\u5B8C\u6210"), import_react7.default.createElement("small", null, completed))
    ),
    error ? import_react7.default.createElement("div", { className: "cpwb-status cpwb-status-error", role: "alert" }, error.message || String(error)) : null,
    sections.length === 0 ? import_react7.default.createElement(Empty, { glyph: glyph(ICONS.grid) }, view === "completed" ? "\u6682\u65E0\u5DF2\u5B8C\u6210\u5F85\u529E" : "\u6682\u65E0\u5F85\u5904\u7406\u5F85\u529E\uFF0C\u6DFB\u52A0\u7B2C\u4E00\u9879") : import_react7.default.createElement("div", { className: "cpwb-todo-sections" }, sections.map((section) => import_react7.default.createElement(
      "section",
      { key: section.key, className: "cpwb-todo-section cpwb-todo-section-" + section.status },
      import_react7.default.createElement("h4", null, section.label),
      import_react7.default.createElement("div", { className: "cpwb-list" }, section.items.map((todo) => import_react7.default.createElement(
        "article",
        { key: todo.id, className: "cpwb-todo-row" + (todo.done ? " cpwb-item-done" : "") + (section.status === "overdue" ? " cpwb-todo-row-overdue" : "") },
        import_react7.default.createElement("button", { type: "button", className: "cpwb-check" + (todo.done ? " cpwb-done" : ""), onClick: () => toggle(todo), "aria-label": todo.done ? "\u6807\u8BB0\u672A\u5B8C\u6210" : "\u6807\u8BB0\u5B8C\u6210" }, todo.done ? import_react7.default.createElement(n2, { size: 14, weight: "bold" }) : null),
        import_react7.default.createElement(
          "button",
          { type: "button", className: "cpwb-item-main cpwb-todo-details", onClick: () => setDialog({ todo }) },
          import_react7.default.createElement("span", { className: "cpwb-item-title" }, todo.title),
          import_react7.default.createElement("span", { className: "cpwb-item-meta" }, todo.done ? "\u9884\u8BA1\u5B8C\u6210 " + localDateTime(todo.dueAt, timeZone) : todo.source === "auto" ? "\u81EA\u52A8\u751F\u6210" : "\u624B\u52A8\u521B\u5EFA")
        ),
        import_react7.default.createElement("span", { className: "cpwb-todo-time" + (section.status === "overdue" ? " cpwb-todo-overdue" : "") }, section.status === "overdue" ? import_react7.default.createElement("small", null, "\u5DF2\u8FC7\u671F") : null, localTime(todo.done ? todo.completedAt || todo.dueAt : todo.dueAt, timeZone)),
        import_react7.default.createElement("button", { type: "button", className: "cpwb-icon-button", onClick: () => setDialog({ todo }), "aria-label": "\u7F16\u8F91\u5F85\u529E " + todo.title }, import_react7.default.createElement(a47, { size: 14 })),
        import_react7.default.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", onClick: () => setDeleteTarget(todo), "aria-label": "\u5220\u9664\u5F85\u529E " + todo.title }, import_react7.default.createElement(n11, { size: 14 }))
      )))
    ))),
    dialog ? import_react7.default.createElement(TodoDialog, { todo: dialog.todo, onSave: save, onClose: () => setDialog(null), busy: action?.type === "todo" && action.status === "running", error, timeZone }) : null,
    deleteTarget ? import_react7.default.createElement(
      GlobalModal,
      { onClose: () => setDeleteTarget(null), labelledBy: "cpwb-delete-todo-title" },
      import_react7.default.createElement(
        "section",
        { className: "cpwb-modal cpwb-danger-modal" },
        import_react7.default.createElement("div", { className: "cpwb-modal-kicker" }, "TODO / DELETE"),
        import_react7.default.createElement("h3", { id: "cpwb-delete-todo-title" }, "\u5220\u9664\u5F85\u529E\uFF1F"),
        import_react7.default.createElement("p", null, "\u300C" + deleteTarget.title + "\u300D\u5C06\u6C38\u4E45\u5220\u9664\uFF0C\u6B64\u64CD\u4F5C\u65E0\u6CD5\u64A4\u9500\u3002"),
        import_react7.default.createElement(
          "div",
          { className: "cpwb-modal-actions" },
          import_react7.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: () => setDeleteTarget(null) }, "\u53D6\u6D88"),
          import_react7.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", disabled: action?.type === "todo" && action.status === "running", onClick: () => remove().catch(() => {
          }) }, import_react7.default.createElement(n11, { size: 14 }), import_react7.default.createElement("span", null, "\u786E\u8BA4\u5220\u9664"))
        )
      )
    ) : null
  );
}

// src/client/KnowledgeBase.js
var import_react9 = __toESM(require("react"), 1);
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
var ACCEPT = ACCEPT_EXTENSIONS.map(function(e70) {
  return "." + e70;
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
function formatBytes(n14) {
  if (n14 == null) return "";
  if (n14 < 1024) return n14 + " B";
  if (n14 < 1024 * 1024) return (n14 / 1024).toFixed(1) + " KB";
  return (n14 / (1024 * 1024)).toFixed(1) + " MB";
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
  return import_react9.default.createElement(
    "div",
    { key: d.id, className: "cpwb-item" },
    import_react9.default.createElement(
      "div",
      { className: "cpwb-item-main" },
      import_react9.default.createElement(
        "div",
        { className: "cpwb-item-title" },
        glyph(ICONS.doc),
        " " + d.originalName,
        import_react9.default.createElement(Badge, { kind: meta.kind }, meta.label)
      ),
      import_react9.default.createElement(
        "div",
        { className: "cpwb-item-meta" },
        formatBytes(d.size) + (d.error ? " \xB7 " + d.error : "")
      )
    ),
    canReindex ? import_react9.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: !!reindexing, onClick: function() {
      onReindex(d);
    }, title: "\u91CD\u65B0\u7D22\u5F15" }, glyph(ICONS.refresh), " \u91CD\u65B0\u7D22\u5F15") : null,
    import_react9.default.createElement("button", { type: "button", className: "cpwb-x", disabled: !!unlinkingDoc, onClick: function() {
      onUnlink(d);
    }, title: "\u4ECE\u672C\u77E5\u8BC6\u5E93\u89E3\u9664\u5173\u8054" }, glyph(ICONS.x))
  );
}
function renderCitation(c7, i) {
  return import_react9.default.createElement(
    "div",
    { key: c7.sourceId || c7.originalName + ":" + i, className: "cpwb-citation" },
    import_react9.default.createElement(
      "div",
      { className: "cpwb-citation-head" },
      import_react9.default.createElement("span", { className: "cpwb-citation-file" }, c7.originalName),
      import_react9.default.createElement("span", { className: "cpwb-citation-locator" }, c7.locator || "")
    ),
    c7.heading ? import_react9.default.createElement("div", { className: "cpwb-citation-heading" }, c7.heading) : null,
    import_react9.default.createElement("div", { className: "cpwb-citation-text" }, c7.text)
  );
}
function KnowledgeBase({ store: store3, projectId, knowledgeBaseId, sessions, workspaces, onConversationOpen, onDraftOpen, view = "all" }) {
  const standalone = knowledgeBaseId != null;
  const state = import_react9.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const newKbState = import_react9.default.useState("");
  const queryState = import_react9.default.useState("");
  const dragState = import_react9.default.useState(false);
  const pendingState = import_react9.default.useState([]);
  const newKb = newKbState[0];
  const setNewKb = newKbState[1];
  const query = queryState[0];
  const setQuery = queryState[1];
  const dragActive = dragState[0];
  const setDragActive = dragState[1];
  const pending = pendingState[0];
  const setPending = pendingState[1];
  const chatErrorState = import_react9.default.useState(null);
  const chatError = chatErrorState[0];
  const setChatError = chatErrorState[1];
  const openingChatState = import_react9.default.useState(false);
  const openingChat = openingChatState[0];
  const setOpeningChat = openingChatState[1];
  const scopeReadyState = import_react9.default.useState(!standalone);
  const scopeReady = scopeReadyState[0];
  const setScopeReady = scopeReadyState[1];
  const [deleteTarget, setDeleteTarget] = import_react9.default.useState(null);
  const mountedRef = import_react9.default.useRef(true);
  import_react9.default.useEffect(function() {
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
  const deletingKb = !!(action && action.type === "deleteKnowledgeBase" && action.status === "running");
  import_react9.default.useEffect(function() {
    if (projectId == null) return;
    store3.actions.loadAllDocuments().catch(function() {
    });
    store3.actions.loadLinkedKnowledgeBases(projectId).catch(function() {
    });
  }, [projectId, store3]);
  import_react9.default.useEffect(function() {
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
  import_react9.default.useEffect(function() {
    if (!needsDocumentPolling(documents, selectedId)) return;
    const timer = setTimeout(function() {
      store3.actions.refreshDocuments().catch(function() {
      });
    }, 1500);
    return function() {
      clearTimeout(timer);
    };
  }, [documents, selectedId, store3]);
  import_react9.default.useEffect(function() {
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
    const batch = files.map(function(f2, i) {
      return { key: Date.now() + ":" + i, name: f2.name, index: i };
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
  const onDrop = function(e70) {
    e70.preventDefault();
    setDragActive(false);
    if (e70.dataTransfer && e70.dataTransfer.files) handleFiles(e70.dataTransfer.files);
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
    }).catch(function(err) {
      if (!mountedRef.current) return;
      setOpeningChat(false);
      setChatError(err && err.message ? err.message : "\u6253\u5F00\u804A\u5929\u5931\u8D25");
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
  return import_react9.default.createElement(
    "div",
    null,
    kbError ? import_react9.default.createElement(
      "div",
      { className: "cpwb-error" },
      import_react9.default.createElement(
        "div",
        { className: "cpwb-error-msg" },
        (kbError.code ? kbError.code + "\uFF1A" : "") + (kbError.message || "\u52A0\u8F7D\u5931\u8D25")
      ),
      import_react9.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: retryError, title: "\u5237\u65B0/\u91CD\u8BD5" }, glyph(ICONS.refresh), " \u5237\u65B0 / \u91CD\u8BD5")
    ) : null,
    showDirectory ? import_react9.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react9.default.createElement(
        "div",
        { className: "cpwb-section-head" },
        import_react9.default.createElement("div", { className: "cpwb-label" }, "\u77E5\u8BC6\u5E93 \xB7 " + knowledgeBases.length)
      ),
      import_react9.default.createElement(
        "div",
        { className: "cpwb-addrow" },
        import_react9.default.createElement("input", { className: "cpwb-input", value: newKb, placeholder: "\u65B0\u5EFA\u77E5\u8BC6\u5E93\u2026", onChange: function(e70) {
          setNewKb(e70.target.value);
        }, onKeyDown: function(e70) {
          if (e70.key === "Enter") createKb();
        } }),
        import_react9.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: createKb, title: "\u65B0\u5EFA\u77E5\u8BC6\u5E93", disabled: creatingKb }, glyph(ICONS.plus))
      ),
      knowledgeBases.length === 0 ? import_react9.default.createElement(Empty, { glyph: glyph(ICONS.db, 18) }, "\u6682\u65E0\u77E5\u8BC6\u5E93\uFF0C\u5148\u65B0\u5EFA\u4E00\u4E2A") : import_react9.default.createElement("div", { className: "cpwb-kb-list" }, knowledgeBases.map(function(kb) {
        const isSel = kb.id === selectedId;
        const isLinked = linkedIds.has(kb.id);
        return import_react9.default.createElement(
          "div",
          { key: kb.id, className: "cpwb-kb-row" + (isSel ? " cpwb-kb-sel" : "") },
          import_react9.default.createElement(
            "button",
            { type: "button", className: "cpwb-kb-name", onClick: function() {
              select(kb);
            }, title: "\u9009\u62E9\u77E5\u8BC6\u5E93" },
            glyph(ICONS.db),
            " " + kb.name
          ),
          projectId != null && isLinked ? import_react9.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", onClick: function() {
            store3.actions.unlinkProjectKnowledgeBase(projectId, kb.id).catch(function() {
            });
          }, title: "\u89E3\u9664\u4E0E\u672C\u9879\u76EE\u7684\u5173\u8054", disabled: unlinkingKb }, "\u89E3\u9664\u5173\u8054") : projectId != null ? import_react9.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: function() {
            store3.actions.linkProjectKnowledgeBase(projectId, kb.id).catch(function() {
            });
          }, title: "\u5173\u8054\u5230\u672C\u9879\u76EE", disabled: linking }, "\u5173\u8054") : null,
          import_react9.default.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", onClick: function() {
            setDeleteTarget(kb);
          }, title: "\u5220\u9664\u77E5\u8BC6\u5E93", "aria-label": "\u5220\u9664\u77E5\u8BC6\u5E93 " + kb.name }, import_react9.default.createElement(n11, { size: 14 }))
        );
      }))
    ) : null,
    showDocuments ? import_react9.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react9.default.createElement(
        "div",
        { className: "cpwb-section-head" },
        import_react9.default.createElement("div", { className: "cpwb-label" }, "\u6587\u6863"),
        import_react9.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: refreshStatus, title: "\u5237\u65B0\u72B6\u6001" }, glyph(ICONS.refresh), " \u5237\u65B0\u72B6\u6001")
      ),
      selectedId != null ? import_react9.default.createElement(
        "label",
        {
          className: "cpwb-drop" + (dragActive ? " cpwb-drop-active" : ""),
          onDrop,
          onDragOver: function(e70) {
            e70.preventDefault();
            if (!uploading) setDragActive(true);
          },
          onDragLeave: function() {
            setDragActive(false);
          }
        },
        import_react9.default.createElement("input", { type: "file", multiple: true, accept: ACCEPT, disabled: uploading, style: { display: "none" }, onChange: function(e70) {
          handleFiles(e70.target.files);
          e70.target.value = "";
        } }),
        glyph(ICONS.upload),
        " \u9009\u62E9\u6587\u4EF6\u6216\u62D6\u62FD\u5230\u300C" + (selected ? selected.name : "\u77E5\u8BC6\u5E93") + "\u300D"
      ) : import_react9.default.createElement(Empty, { glyph: glyph(ICONS.db, 18) }, "\u9009\u62E9\u6216\u65B0\u5EFA\u77E5\u8BC6\u5E93\u540E\u4E0A\u4F20\u6587\u4EF6"),
      pending.length > 0 ? import_react9.default.createElement(
        "div",
        { className: "cpwb-upload-block" },
        import_react9.default.createElement("div", { className: "cpwb-item-meta" }, "\u4E0A\u4F20\u8FDB\u5EA6 " + uploadDone + "/" + uploadTotal),
        pending.map(function(p2) {
          const label = uploadStatusLabel(p2.index, uploadAction);
          return import_react9.default.createElement(
            "div",
            { key: p2.key, className: "cpwb-upload-file" },
            import_react9.default.createElement("span", { className: "cpwb-item-title" }, p2.name),
            import_react9.default.createElement(Badge, { kind: label === "\u5931\u8D25" ? "overdue" : "pending" }, label)
          );
        })
      ) : null,
      selectedId == null ? null : documents.length === 0 ? import_react9.default.createElement(Empty, { glyph: glyph(ICONS.doc, 18) }, "\u8BE5\u77E5\u8BC6\u5E93\u6682\u65E0\u6587\u6863") : import_react9.default.createElement("div", { className: "cpwb-list" }, documents.map(function(d) {
        return renderDocumentItem(d, reindex, unlink, reindexing, unlinkingDoc);
      }))
    ) : null,
    selectedId != null && showRetrieval ? import_react9.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react9.default.createElement("div", { className: "cpwb-section-head" }, import_react9.default.createElement("div", { className: "cpwb-label" }, "\u77E5\u8BC6\u5E93\u68C0\u7D22")),
      import_react9.default.createElement(
        "div",
        { className: "cpwb-addrow" },
        import_react9.default.createElement("input", { className: "cpwb-input", value: query, placeholder: "\u68C0\u7D22\u8BE5\u77E5\u8BC6\u5E93\u2026", onChange: function(e70) {
          setQuery(e70.target.value);
        }, onKeyDown: function(e70) {
          if (e70.key === "Enter") runSearch();
        } }),
        import_react9.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: runSearch, title: "\u68C0\u7D22", disabled: searching }, glyph(ICONS.search))
      ),
      citations.length === 0 ? import_react9.default.createElement(Empty, { glyph: glyph(ICONS.search, 18) }, "\u8F93\u5165\u5173\u952E\u8BCD\u68C0\u7D22\u77E5\u8BC6\u5E93\u5185\u5BB9") : import_react9.default.createElement("div", { className: "cpwb-citations" }, citations.map(renderCitation))
    ) : null,
    selectedId != null && showSessions ? import_react9.default.createElement(
      "div",
      { className: "cpwb-section" },
      import_react9.default.createElement(
        "div",
        { className: "cpwb-section-head" },
        import_react9.default.createElement("div", { className: "cpwb-label" }, "\u77E5\u8BC6\u5E93\u95EE\u7B54"),
        import_react9.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: function() {
          openChat(null);
        }, disabled: openingChat, title: "\u65B0\u5EFA\u804A\u5929" }, glyph(ICONS.plus), " \u65B0\u5EFA\u804A\u5929")
      ),
      chatError ? import_react9.default.createElement("div", { className: "cpwb-error-msg" }, chatError) : null,
      knowledgeSessions.length === 0 ? import_react9.default.createElement(Empty, { glyph: glyph(ICONS.book, 18) }, "\u9009\u62E9\u77E5\u8BC6\u5E93\u540E\u65B0\u5EFA\u4F1A\u8BDD") : import_react9.default.createElement("div", { className: "cpwb-kb-list" }, knowledgeSessions.map(function(session) {
        return import_react9.default.createElement(
          "div",
          { key: session.sessionId, className: "cpwb-kb-row" },
          import_react9.default.createElement(
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
    deleteTarget ? import_react9.default.createElement(
      "div",
      { className: "cpwb-modal-backdrop", onMouseDown: (event) => {
        if (event.target === event.currentTarget) setDeleteTarget(null);
      } },
      import_react9.default.createElement(
        "section",
        { className: "cpwb-modal cpwb-danger-modal", role: "dialog", "aria-modal": true, "aria-labelledby": "cpwb-delete-kb-title" },
        import_react9.default.createElement("div", { className: "cpwb-modal-kicker" }, "KNOWLEDGE / DELETE"),
        import_react9.default.createElement("h3", { id: "cpwb-delete-kb-title" }, "\u5220\u9664\u300C" + deleteTarget.name + "\u300D\uFF1F"),
        import_react9.default.createElement("p", null, "\u77E5\u8BC6\u5E93\u3001\u4F1A\u8BDD\u548C\u4EC5\u5C5E\u4E8E\u5B83\u7684\u6587\u6863/\u5411\u91CF\u5C06\u6C38\u4E45\u5220\u9664\uFF1B\u4ECD\u88AB\u5176\u4ED6\u9879\u76EE\u6216\u77E5\u8BC6\u5E93\u4F7F\u7528\u7684\u5171\u4EAB\u6587\u6863\u4F1A\u4FDD\u7559\u3002"),
        import_react9.default.createElement(
          "div",
          { className: "cpwb-modal-actions" },
          import_react9.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: () => setDeleteTarget(null) }, "\u53D6\u6D88"),
          import_react9.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", disabled: deletingKb, onClick: () => store3.actions.deleteKnowledgeBase(deleteTarget.id).then(() => setDeleteTarget(null)).catch(() => {
          }) }, import_react9.default.createElement(n11, { size: 14 }), import_react9.default.createElement("span", null, deletingKb ? "\u5220\u9664\u4E2D\u2026" : "\u6C38\u4E45\u5220\u9664"))
        )
      )
    ) : null
  );
}
function KnowledgeCenterPage(props) {
  return import_react9.default.createElement(
    "main",
    { className: "cpwb-knowledge-center cpwb-workbench-page", "data-page": "knowledge" },
    import_react9.default.createElement(
      "header",
      { className: "cpwb-page-header" },
      import_react9.default.createElement(
        "div",
        null,
        import_react9.default.createElement("span", null, "02 / KNOWLEDGE NODES"),
        import_react9.default.createElement("h1", null, "\u77E5\u8BC6\u5E93\u4E2D\u5FC3"),
        import_react9.default.createElement("p", null, "\u4E0A\u4F20\u3001\u5411\u91CF\u5316\u3001\u68C0\u7D22\uFF0C\u5E76\u4ECE\u4EFB\u610F\u77E5\u8BC6\u5E93\u53D1\u8D77\u72EC\u7ACB\u4F1A\u8BDD\u3002")
      )
    ),
    import_react9.default.createElement(
      "section",
      { className: "cpwb-knowledge-center-body" },
      import_react9.default.createElement(KnowledgeBase, { ...props, view: "all" })
    )
  );
}

// src/client/Automation.js
var import_react11 = __toESM(require("react"), 1);
var RECURRENCE_LABELS = { once: "\u4EC5\u4E00\u6B21", daily: "\u6BCF\u65E5", weekly: "\u6BCF\u5468", monthly: "\u6BCF\u6708" };
var SUMMARY_STATUS_LABELS = { completed: "\u5DF2\u5B8C\u6210", pending: "\u751F\u6210\u4E2D", failed: "\u5931\u8D25" };
var pad2 = (value) => String(value).padStart(2, "0");
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
function Feedback({ action, type }) {
  if (!action || action.type !== type) return null;
  const iconProps = { size: 15, weight: "bold", "aria-hidden": true };
  if (action.status === "running") return import_react11.default.createElement("div", { className: "cpwb-status cpwb-status-loading", role: "status" }, import_react11.default.createElement(m7, iconProps), import_react11.default.createElement("span", null, "\u6267\u884C\u4E2D\u2026"));
  if (action.status === "error") return import_react11.default.createElement("div", { className: "cpwb-status cpwb-status-error", role: "alert" }, import_react11.default.createElement(c6, iconProps), import_react11.default.createElement("span", null, action.error?.message || "\u64CD\u4F5C\u5931\u8D25"));
  if (action.status === "done") return import_react11.default.createElement("div", { className: "cpwb-status cpwb-status-success", role: "status" }, import_react11.default.createElement(s5, iconProps), import_react11.default.createElement("span", null, "\u5DF2\u5B8C\u6210"));
  return null;
}
function ScheduleDialog({ schedule, timeZone, busy, error, onSave, onDelete, onClose }) {
  const initial = dateTimeFields(schedule?.startsAt || schedule?.nextRunAt, timeZone);
  const [name, setName] = import_react11.default.useState(schedule?.name || "");
  const [prompt, setPrompt] = import_react11.default.useState(schedule?.prompt || "");
  const [recurrence, setRecurrence] = import_react11.default.useState(inferredRecurrence(schedule));
  const [date, setDate] = import_react11.default.useState(initial.date);
  const [time, setTime] = import_react11.default.useState(initial.time);
  const [enabled, setEnabled] = import_react11.default.useState(schedule?.enabled !== false);
  const [confirmDelete, setConfirmDelete] = import_react11.default.useState(false);
  const [localError, setLocalError] = import_react11.default.useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !date || !time) {
      setLocalError("\u540D\u79F0\u3001\u65E5\u671F\u548C\u65F6\u95F4\u5747\u4E3A\u5FC5\u586B\u9879");
      return;
    }
    let startsAt;
    try {
      startsAt = zonedDateTimeToUtc(date, time, timeZone).toISOString();
    } catch (cause) {
      setLocalError(cause.message);
      return;
    }
    onSave({ name: name.trim(), prompt: prompt.trim() || null, recurrence, startsAt, enabled }).catch(() => {
    });
  };
  return import_react11.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-schedule-dialog-title" },
    import_react11.default.createElement(
      "form",
      { className: "cpwb-modal cpwb-schedule-modal", onSubmit: submit },
      import_react11.default.createElement("div", { className: "cpwb-modal-kicker" }, schedule ? "SCHEDULE / DETAILS" : "SCHEDULE / NEW"),
      import_react11.default.createElement("h3", { id: "cpwb-schedule-dialog-title" }, schedule ? "\u5B9A\u65F6\u4EFB\u52A1\u8BE6\u60C5" : "\u65B0\u589E\u5B9A\u65F6\u4EFB\u52A1"),
      import_react11.default.createElement("label", null, "\u4EFB\u52A1\u540D\u79F0", import_react11.default.createElement("input", { autoFocus: true, value: name, onChange: (event) => setName(event.target.value), placeholder: "\u4F8B\u5982\uFF1A\u751F\u6210\u9879\u76EE\u5468\u62A5" })),
      import_react11.default.createElement("label", null, "\u6267\u884C\u63D0\u793A\u8BCD", import_react11.default.createElement("textarea", { value: prompt, onChange: (event) => setPrompt(event.target.value), placeholder: "\u544A\u8BC9\u6A21\u578B\u9700\u8981\u5B8C\u6210\u4EC0\u4E48" })),
      import_react11.default.createElement("div", { className: "cpwb-recurrence-picker", role: "group", "aria-label": "\u91CD\u590D\u9891\u7387" }, Object.entries(RECURRENCE_LABELS).map(([value, label]) => import_react11.default.createElement("button", {
        key: value,
        type: "button",
        className: recurrence === value ? "cpwb-active" : "",
        "aria-pressed": recurrence === value,
        onClick: () => setRecurrence(value)
      }, label))),
      import_react11.default.createElement(
        "div",
        { className: "cpwb-form-grid" },
        import_react11.default.createElement("label", null, recurrence === "once" ? "\u6267\u884C\u65E5\u671F" : "\u9996\u6B21\u6267\u884C\u65E5\u671F", import_react11.default.createElement("input", { type: "date", value: date, onChange: (event) => setDate(event.target.value) })),
        import_react11.default.createElement("label", null, "\u6267\u884C\u65F6\u95F4", import_react11.default.createElement("input", { type: "time", value: time, onChange: (event) => setTime(event.target.value) }))
      ),
      import_react11.default.createElement("label", { className: "cpwb-switch-row" }, import_react11.default.createElement("span", null, "\u542F\u7528\u4EFB\u52A1"), import_react11.default.createElement("input", { type: "checkbox", checked: enabled, onChange: (event) => setEnabled(event.target.checked) })),
      localError || error ? import_react11.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, localError || error.message || String(error)) : null,
      confirmDelete ? import_react11.default.createElement("div", { className: "cpwb-danger-confirm" }, import_react11.default.createElement("span", null, "\u5220\u9664\u540E\u6267\u884C\u5386\u53F2\u4E5F\u4F1A\u6E05\u9664\u3002"), import_react11.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: busy, onClick: () => onDelete().catch(() => {
      }) }, "\u786E\u8BA4\u5220\u9664")) : null,
      import_react11.default.createElement(
        "div",
        { className: "cpwb-modal-actions cpwb-modal-actions-split" },
        schedule ? import_react11.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger cpwb-button-content", onClick: () => setConfirmDelete(true) }, import_react11.default.createElement(n11, { size: 15 }), import_react11.default.createElement("span", null, "\u5220\u9664")) : import_react11.default.createElement("span", null),
        import_react11.default.createElement("div", { className: "cpwb-row" }, import_react11.default.createElement("button", { type: "button", className: "cpwb-btn", onClick: onClose }, "\u53D6\u6D88"), import_react11.default.createElement("button", { type: "submit", className: "cpwb-btn cpwb-btn-primary", disabled: busy }, busy ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"))
      )
    )
  );
}
function SummaryDeleteDialog({ summary, busy, error, onConfirm, onClose }) {
  return import_react11.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-summary-delete-title" },
    import_react11.default.createElement(
      "div",
      { className: "cpwb-modal" },
      import_react11.default.createElement("div", { className: "cpwb-modal-kicker" }, "SUMMARY / DELETE"),
      import_react11.default.createElement("h3", { id: "cpwb-summary-delete-title" }, "\u5220\u9664\u6BCF\u65E5\u603B\u7ED3"),
      import_react11.default.createElement("p", null, `\u786E\u5B9A\u5220\u9664 ${summary.summaryDate} \u7684\u6BCF\u65E5\u603B\u7ED3\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u4F1A\u5220\u9664\u9879\u76EE\u6216\u4F1A\u8BDD\u3002`),
      error ? import_react11.default.createElement("div", { className: "cpwb-form-error", role: "alert" }, error.message || String(error)) : null,
      import_react11.default.createElement(
        "div",
        { className: "cpwb-modal-actions" },
        import_react11.default.createElement("button", { type: "button", className: "cpwb-btn", disabled: busy, onClick: onClose }, "\u53D6\u6D88"),
        import_react11.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-danger", disabled: busy, onClick: () => onConfirm().catch(() => {
        }) }, busy ? "\u5220\u9664\u4E2D\u2026" : "\u786E\u8BA4\u5220\u9664")
      )
    )
  );
}
function Automation({ store: store3, projectId, view = "all", initialDialog = null }) {
  const state = import_react11.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const [dialog, setDialog] = import_react11.default.useState(initialDialog === "create" ? { schedule: null } : null);
  const [summaryToDelete, setSummaryToDelete] = import_react11.default.useState(null);
  const schedules = Array.isArray(state.schedules) ? state.schedules : [];
  const scheduleRuns = state.scheduleRuns || {};
  const summaries = Array.isArray(state.summaries) ? state.summaries : [];
  const automation = state.automation || { summaryEnabled: true, nextDayTodosEnabled: true };
  const action = state.action;
  const timeZone = state.settings?.timezone || DEFAULT_TIME_ZONE;
  const projectName = state.projects?.find((project) => project.id === projectId)?.name || "\u9879\u76EE";
  const scheduleAction = ["createSchedule", "updateSchedule", "deleteSchedule"].includes(action?.type) ? action : null;
  const summaryGenerating = action?.type === "runSummary" && action.status === "running";
  const summaryDeleting = action?.type === "deleteSummary" && action.status === "running";
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
  const scheduleNodes = schedules.map((schedule) => {
    const runs = Array.isArray(scheduleRuns[schedule.id]) ? scheduleRuns[schedule.id] : [];
    const latest = runs.at(-1);
    return import_react11.default.createElement(
      "article",
      { key: schedule.id, className: "cpwb-schedule-row", onClick: () => setDialog({ schedule }) },
      import_react11.default.createElement("div", { className: "cpwb-schedule-icon" }, import_react11.default.createElement(s6, { size: 18, weight: "regular" })),
      import_react11.default.createElement("div", { className: "cpwb-item-main" }, import_react11.default.createElement("div", { className: "cpwb-item-title" }, schedule.name), import_react11.default.createElement("div", { className: "cpwb-item-meta" }, `${RECURRENCE_LABELS[inferredRecurrence(schedule)]} \xB7 \u4E0B\u6B21 ${fmtTime(schedule.nextRunAt, timeZone)}`), latest ? import_react11.default.createElement("div", { className: "cpwb-item-meta" }, "\u6700\u8FD1\u6267\u884C \xB7 " + (latest.status || "unknown")) : null),
      import_react11.default.createElement("span", { className: "cpwb-schedule-state " + (schedule.enabled === false ? "cpwb-off" : "cpwb-on") }, schedule.enabled === false ? "\u505C\u7528" : "\u8FD0\u884C\u4E2D"),
      import_react11.default.createElement("button", { type: "button", className: "cpwb-icon-button", title: "\u7ACB\u5373\u8FD0\u884C", "aria-label": "\u7ACB\u5373\u8FD0\u884C " + schedule.name, disabled: schedule.enabled === false || action?.type === "runSchedule" && action.scheduleId === schedule.id && action.status === "running", onClick: (event) => {
        event.stopPropagation();
        store3.actions.runSchedule(schedule.id).catch(() => {
        });
      } }, import_react11.default.createElement(n7, { size: 14, weight: "fill" })),
      import_react11.default.createElement("button", { type: "button", className: "cpwb-icon-button", "aria-label": "\u7F16\u8F91 " + schedule.name, onClick: (event) => {
        event.stopPropagation();
        setDialog({ schedule });
      } }, import_react11.default.createElement(a47, { size: 14 }))
    );
  });
  const summaryNodes = summaries.map((summary) => {
    const downloadable = summary.status === "completed" && typeof summary.content === "string" && summary.content.trim() !== "";
    const displayContent = summary.status === "failed" ? "\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u751F\u6210" : summary.status === "pending" ? "\u6B63\u5728\u751F\u6210\u2026" : summary.content || "\u6682\u65E0\u5185\u5BB9";
    return import_react11.default.createElement(
      "article",
      { key: summary.id, className: "cpwb-summary-entry" },
      import_react11.default.createElement(
        "div",
        { className: "cpwb-summary-head" },
        import_react11.default.createElement("div", { className: "cpwb-item-meta" }, summary.summaryDate + " \xB7 " + (SUMMARY_STATUS_LABELS[summary.status] || summary.status)),
        import_react11.default.createElement(
          "div",
          { className: "cpwb-summary-actions" },
          downloadable ? import_react11.default.createElement("button", { type: "button", className: "cpwb-icon-button", title: "\u4E0B\u8F7D Markdown", "aria-label": `\u4E0B\u8F7D ${summary.summaryDate} \u6BCF\u65E5\u603B\u7ED3`, onClick: () => downloadSummaryMarkdown({ projectName, summary }) }, import_react11.default.createElement(l4, { size: 14 })) : null,
          import_react11.default.createElement("button", { type: "button", className: "cpwb-icon-button cpwb-danger-icon", title: "\u5220\u9664", "aria-label": `\u5220\u9664 ${summary.summaryDate} \u6BCF\u65E5\u603B\u7ED3`, onClick: () => setSummaryToDelete(summary) }, import_react11.default.createElement(n11, { size: 14 }))
        )
      ),
      import_react11.default.createElement("div", { className: "cpwb-summary-content" + (summary.status === "failed" ? " cpwb-summary-failed" : ""), role: summary.status === "failed" ? "alert" : void 0 }, displayContent)
    );
  });
  return import_react11.default.createElement(
    "div",
    null,
    view !== "schedule" ? import_react11.default.createElement("section", { className: "cpwb-section" }, import_react11.default.createElement("div", { className: "cpwb-section-head" }, import_react11.default.createElement("div", { className: "cpwb-label" }, "\u81EA\u52A8\u5316\u5F00\u5173")), import_react11.default.createElement("div", { className: "cpwb-toggle-row" }, import_react11.default.createElement("span", null, "21:00 \u6BCF\u65E5\u603B\u7ED3"), import_react11.default.createElement("button", { type: "button", className: "cpwb-toggle" + (automation.summaryEnabled ? " cpwb-on" : ""), onClick: () => toggle("summaryEnabled") }, automation.summaryEnabled ? "\u5F00" : "\u5173")), import_react11.default.createElement("div", { className: "cpwb-toggle-row" }, import_react11.default.createElement("span", null, "21:00 \u6B21\u65E5\u5F85\u529E"), import_react11.default.createElement("button", { type: "button", className: "cpwb-toggle" + (automation.nextDayTodosEnabled ? " cpwb-on" : ""), onClick: () => toggle("nextDayTodosEnabled") }, automation.nextDayTodosEnabled ? "\u5F00" : "\u5173")), import_react11.default.createElement(Feedback, { action, type: "updateAutomation" })) : null,
    view !== "summary" ? import_react11.default.createElement("section", { className: "cpwb-tool-panel" }, import_react11.default.createElement("div", { className: "cpwb-tool-head" }, import_react11.default.createElement("span", null, "SCHEDULES // " + String(schedules.length).padStart(2, "0")), import_react11.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary cpwb-button-content", onClick: () => setDialog({ schedule: null }) }, import_react11.default.createElement(n9, { size: 14, weight: "bold" }), import_react11.default.createElement("span", null, "\u65B0\u589E"))), import_react11.default.createElement(Feedback, { action, type: "runSchedule" }), schedules.length === 0 ? import_react11.default.createElement(Empty, { glyph: import_react11.default.createElement(c2, { size: 20 }) }, "\u6682\u65E0\u5B9A\u65F6\u4EFB\u52A1") : import_react11.default.createElement("div", { className: "cpwb-list" }, scheduleNodes)) : null,
    view !== "schedule" ? import_react11.default.createElement("section", { className: "cpwb-section" }, import_react11.default.createElement("div", { className: "cpwb-section-head" }, import_react11.default.createElement("div", { className: "cpwb-label" }, "\u6BCF\u65E5\u603B\u7ED3\u8BB0\u5F55"), import_react11.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-button-content", disabled: summaryGenerating, onClick: () => store3.actions.runSummary({ projectId, summaryDate: localDateKey() }).catch(() => {
    }) }, summaryGenerating ? import_react11.default.createElement(m7, { size: 13, className: "cpwb-spin" }) : import_react11.default.createElement(n7, { size: 13 }), import_react11.default.createElement("span", null, summaryGenerating ? "\u751F\u6210\u4E2D\u2026" : "\u7ACB\u5373\u751F\u6210"))), import_react11.default.createElement(Feedback, { action, type: "runSummary" }), import_react11.default.createElement(Feedback, { action, type: "deleteSummary" }), summaries.length === 0 ? import_react11.default.createElement(Empty, { glyph: import_react11.default.createElement(c2, { size: 20 }) }, "\u6682\u65E0\u603B\u7ED3\u8BB0\u5F55") : summaryNodes) : null,
    dialog ? import_react11.default.createElement(ScheduleDialog, { schedule: dialog.schedule, timeZone, busy: scheduleAction?.status === "running", error: scheduleAction?.status === "error" ? scheduleAction.error : null, onSave: save, onDelete: remove, onClose: () => setDialog(null) }) : null,
    summaryToDelete ? import_react11.default.createElement(SummaryDeleteDialog, { summary: summaryToDelete, busy: summaryDeleting, error: action?.type === "deleteSummary" && action.status === "error" ? action.error : null, onConfirm: () => store3.actions.deleteSummary({ id: summaryToDelete.id, projectId }).then(() => setSummaryToDelete(null)), onClose: () => setSummaryToDelete(null) }) : null
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

// src/client/ModelIndicator.js
var import_react13 = __toESM(require("react"), 1);
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
  const [label, setLabel] = import_react13.default.useState(null);
  import_react13.default.useEffect(function() {
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
  return import_react13.default.createElement("button", {
    type: "button",
    className: "cpwb-model-indicator",
    disabled: locked,
    title: selection ? "\u5F53\u524D\u6A21\u578B\uFF1A" + selection : "\u6253\u5F00\u6A21\u578B\u4E0E\u63A8\u7406\u7B49\u7EA7\u9009\u62E9",
    "aria-label": selection ? "\u5F53\u524D\u6A21\u578B " + selection + "\uFF0C\u70B9\u51FB\u5207\u6362" : "\u6253\u5F00\u6A21\u578B\u4E0E\u63A8\u7406\u7B49\u7EA7\u9009\u62E9",
    onClick: openNativeModelMenu
  }, import_react13.default.createElement("span", null, label), import_react13.default.createElement(s3, { size: 14, weight: "bold", "aria-hidden": true }));
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

// src/client/SubagentDrawer.js
var import_react15 = __toESM(require("react"), 1);

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
  return import_react15.default.useSyncExternalStore(
    source?.subscribe || (() => () => {
    }),
    source?.getSnapshot || emptySessionsSnapshot,
    source?.getSnapshot || emptySessionsSnapshot
  );
}
function Selector({ entries, selectedId, onSelect }) {
  const [open, setOpen] = import_react15.default.useState(false);
  const selected = entries.find((entry) => entry.id === selectedId) || entries[0];
  return import_react15.default.createElement(
    "div",
    { className: "cpwb-subagent-selector" },
    import_react15.default.createElement(
      "button",
      {
        type: "button",
        className: "cpwb-subagent-selector-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        onClick: () => setOpen((value) => !value)
      },
      import_react15.default.createElement(
        "span",
        null,
        import_react15.default.createElement("strong", null, selected?.label || selected?.id || "\u9009\u62E9\u5B50\u667A\u80FD\u4F53"),
        selected ? import_react15.default.createElement("small", null, selected.activity === "running" ? "RUNNING" : "INACTIVE") : null
      ),
      import_react15.default.createElement(s3, { size: 16, weight: "bold", "aria-hidden": true })
    ),
    open ? import_react15.default.createElement(
      "div",
      { className: "cpwb-subagent-selector-menu", role: "listbox", "aria-label": "\u9009\u62E9\u5B50\u667A\u80FD\u4F53" },
      entries.map((entry, index) => import_react15.default.createElement(
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
        import_react15.default.createElement("b", null, String(index + 1).padStart(2, "0")),
        import_react15.default.createElement(
          "span",
          null,
          import_react15.default.createElement("strong", null, entry.label || entry.id),
          import_react15.default.createElement("small", null, entry.activity.toUpperCase() + " / " + entry.mode.toUpperCase())
        ),
        import_react15.default.createElement("em", null, entry.mode === "one-shot" ? "ONE-SHOT" : "CONTINUABLE")
      ))
    ) : null
  );
}
function InfoLayer({ entry, parentSessionId, onClose }) {
  return import_react15.default.createElement(
    "section",
    { className: "cpwb-subagent-info-layer", "aria-label": "\u5B50\u667A\u80FD\u4F53\u8BE6\u60C5" },
    import_react15.default.createElement(
      "header",
      null,
      import_react15.default.createElement("div", null, import_react15.default.createElement("span", null, "SUBAGENT PROFILE"), import_react15.default.createElement("h3", null, entry.label || entry.id)),
      import_react15.default.createElement("button", { type: "button", onClick: onClose, "aria-label": "\u5173\u95ED\u5B50\u667A\u80FD\u4F53\u8BE6\u60C5" }, import_react15.default.createElement(n13, { size: 18 }))
    ),
    import_react15.default.createElement(
      "div",
      { className: "cpwb-subagent-info-grid" },
      import_react15.default.createElement(
        "dl",
        null,
        import_react15.default.createElement("div", null, import_react15.default.createElement("dt", null, "SESSION ID"), import_react15.default.createElement("dd", null, entry.id)),
        import_react15.default.createElement("div", null, import_react15.default.createElement("dt", null, "PARENT"), import_react15.default.createElement("dd", null, parentSessionId)),
        import_react15.default.createElement("div", null, import_react15.default.createElement("dt", null, "MODE"), import_react15.default.createElement("dd", null, entry.mode.toUpperCase())),
        import_react15.default.createElement("div", null, import_react15.default.createElement("dt", null, "ACTIVITY"), import_react15.default.createElement("dd", null, entry.activity.toUpperCase())),
        import_react15.default.createElement("div", null, import_react15.default.createElement("dt", null, "DESCENDANTS"), import_react15.default.createElement("dd", null, entry.hasChildren ? "AVAILABLE" : "NONE"))
      ),
      import_react15.default.createElement("p", null, entry.mode === "one-shot" ? "\u8BE5\u5B50\u667A\u80FD\u4F53\u662F\u4E00\u6B21\u6027\u6267\u884C\u8BB0\u5F55\u3002\u4F60\u53EF\u4EE5\u5BA1\u9605\u5B8C\u6574\u4F1A\u8BDD\uFF0C\u4F46\u4E0D\u80FD\u7EE7\u7EED\u5411\u5176\u53D1\u9001\u6D88\u606F\u3002" : "\u8BE5\u5B50\u667A\u80FD\u4F53\u652F\u6301\u591A\u8F6E\u7EED\u804A\u3002\u540E\u7EED\u6D88\u606F\u901A\u8FC7 rc.2 \u7684 parent-addressed FIFO \u901A\u9053\u53D1\u9001\u3002")
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
  const [fallbackCatalog, setFallbackCatalog] = import_react15.default.useState(initialCatalog || { entries: [], parentAvailable: false });
  const catalog = liveCatalog?.entries ? liveCatalog : fallbackCatalog;
  const entries = healthySubagentEntries(catalog);
  const [selectedId, setSelectedId] = import_react15.default.useState(entries[0]?.id || null);
  const selected = entries.find((entry) => entry.id === selectedId) || entries[0] || null;
  const [history, setHistory] = import_react15.default.useState(Array.isArray(initialHistory) ? initialHistory : []);
  const [historyState, setHistoryState] = import_react15.default.useState(initialHistory ? "ready" : "idle");
  const [error, setError] = import_react15.default.useState(null);
  const [draft, setDraft] = import_react15.default.useState("");
  const [sending, setSending] = import_react15.default.useState(false);
  const [showInfo, setShowInfo] = import_react15.default.useState(false);
  const client = import_react15.default.useMemo(() => createSubagentClient(connection), [connection]);
  import_react15.default.useEffect(function() {
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
  import_react15.default.useEffect(function() {
    if (selected && entries.some((entry) => entry.id === selectedId)) return;
    setSelectedId(entries[0]?.id || null);
  }, [entries, selected, selectedId]);
  const loadHistory = import_react15.default.useCallback(async function(signal) {
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
  import_react15.default.useEffect(function() {
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
  import_react15.default.useEffect(function() {
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
  return import_react15.default.createElement(
    "div",
    { className: "cpwb-subagent-backdrop", onMouseDown(event) {
      if (event.target === event.currentTarget) onClose?.();
    } },
    import_react15.default.createElement(
      "aside",
      { className: "cpwb-subagent-drawer", role: "dialog", "aria-modal": "true", "aria-label": "\u5B50\u667A\u80FD\u4F53\u6D3B\u52A8" },
      import_react15.default.createElement(
        "header",
        { className: "cpwb-subagent-drawer-header" },
        import_react15.default.createElement(
          "div",
          { className: "cpwb-subagent-heading" },
          import_react15.default.createElement(n10, { size: 21, weight: "duotone", "aria-hidden": true }),
          import_react15.default.createElement("div", null, import_react15.default.createElement("span", null, "SUBAGENT ACTIVITY"), import_react15.default.createElement("h2", null, "\u5B50\u667A\u80FD\u4F53\u4F1A\u8BDD"))
        ),
        import_react15.default.createElement(
          "div",
          { className: "cpwb-subagent-header-actions" },
          import_react15.default.createElement("button", { type: "button", onClick: refreshNow, "aria-label": "\u5237\u65B0\u5B50\u667A\u80FD\u4F53\u4F1A\u8BDD" }, import_react15.default.createElement(m, { size: 18, className: historyState === "refreshing" ? "cpwb-spin" : "" })),
          import_react15.default.createElement("button", { type: "button", onClick: () => setShowInfo(true), disabled: !selected, "aria-label": "\u67E5\u770B\u5B50\u667A\u80FD\u4F53\u8BE6\u60C5" }, import_react15.default.createElement(c4, { size: 19 })),
          import_react15.default.createElement("button", { type: "button", onClick: onClose, "aria-label": "\u5173\u95ED\u5B50\u667A\u80FD\u4F53\u62BD\u5C49" }, import_react15.default.createElement(n13, { size: 19 }))
        )
      ),
      entries.length > 0 ? import_react15.default.createElement(Selector, { entries, selectedId: selected?.id, onSelect(id) {
        setSelectedId(id);
        setHistory([]);
        setHistoryState("idle");
        setError(null);
      } }) : null,
      selected ? import_react15.default.createElement(
        "div",
        { className: "cpwb-subagent-statusbar" },
        import_react15.default.createElement("span", { className: selected.activity === "running" ? "cpwb-running" : "" }, selected.activity.toUpperCase()),
        import_react15.default.createElement("b", null, selected.mode === "one-shot" ? "ONE-SHOT" : "CONTINUABLE"),
        import_react15.default.createElement("small", null, "PARENT / " + parentSessionId)
      ) : null,
      import_react15.default.createElement(
        "div",
        { className: "cpwb-subagent-transcript", "aria-live": "polite" },
        entries.length === 0 ? import_react15.default.createElement("div", { className: "cpwb-subagent-empty" }, import_react15.default.createElement(n10, { size: 28 }), import_react15.default.createElement("strong", null, "\u6682\u65E0\u5B50\u667A\u80FD\u4F53\u6D3B\u52A8"), import_react15.default.createElement("p", null, "\u5F53\u524D\u4F1A\u8BDD\u542F\u52A8\u5B50\u667A\u80FD\u4F53\u540E\uFF0C\u4F1A\u5728\u8FD9\u91CC\u663E\u793A\u8FD0\u884C\u72B6\u6001\u548C\u4F1A\u8BDD\u8BB0\u5F55\u3002")) : historyState === "loading" && history.length === 0 ? import_react15.default.createElement("div", { className: "cpwb-subagent-empty" }, import_react15.default.createElement("strong", null, "\u6B63\u5728\u8BFB\u53D6\u4F1A\u8BDD\u8BB0\u5F55\u2026")) : history.length === 0 ? import_react15.default.createElement("div", { className: "cpwb-subagent-empty" }, import_react15.default.createElement("strong", null, "\u5C1A\u65E0\u53EF\u89C1\u6D88\u606F"), import_react15.default.createElement("p", null, "\u5B50\u667A\u80FD\u4F53\u53EF\u80FD\u4ECD\u5728\u521D\u59CB\u5316\uFF0C\u6216\u5F53\u524D\u8BB0\u5F55\u53EA\u5305\u542B\u8FD0\u884C\u4E8B\u4EF6\u3002")) : history.map((row) => import_react15.default.createElement(
          "article",
          { key: row.key, className: "cpwb-subagent-message cpwb-subagent-message-" + row.role },
          import_react15.default.createElement("span", null, row.role === "user" ? "PARENT" : row.role === "assistant" ? "SUBAGENT" : "TOOL"),
          import_react15.default.createElement("p", null, row.text)
        ))
      ),
      error ? import_react15.default.createElement("p", { className: "cpwb-subagent-error", role: "alert" }, error.message || String(error)) : null,
      selected?.mode === "one-shot" ? import_react15.default.createElement("footer", { className: "cpwb-subagent-readonly" }, "\u4E00\u6B21\u6027\u4EFB\u52A1\u4EC5\u652F\u6301\u67E5\u770B\u8BB0\u5F55") : selected ? import_react15.default.createElement(
        "form",
        { className: "cpwb-subagent-composer", onSubmit: sendFollowup },
        import_react15.default.createElement("textarea", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "\u5411\u5B50\u667A\u80FD\u4F53\u53D1\u9001\u6D88\u606F", "aria-label": "\u5411\u5B50\u667A\u80FD\u4F53\u53D1\u9001\u6D88\u606F", rows: 2 }),
        import_react15.default.createElement(
          "div",
          null,
          selected.activity === "running" ? import_react15.default.createElement("button", { type: "button", className: "cpwb-subagent-stop", onClick: interrupt }, import_react15.default.createElement(s10, { size: 15, weight: "fill" }), "\u505C\u6B62\u5F53\u524D\u8F6E\u6B21") : import_react15.default.createElement("span", null, catalog.parentAvailable === false ? "\u7236\u4F1A\u8BDD\u6682\u4E0D\u53EF\u7528" : "\u53EF\u7EE7\u7EED\u5BF9\u8BDD"),
          import_react15.default.createElement("button", { type: "submit", className: "cpwb-subagent-send", disabled: sending || !draft.trim() || catalog.parentAvailable === false }, import_react15.default.createElement(m5, { size: 16, weight: "fill" }), sending ? "\u53D1\u9001\u4E2D" : "\u53D1\u9001")
        )
      ) : null,
      showInfo && selected ? import_react15.default.createElement(InfoLayer, { entry: selected, parentSessionId, onClose: () => setShowInfo(false) }) : null
    )
  );
}

// src/client/WorkbenchSessionShell.js
var PROJECT_TOOL_TABS = Object.freeze([
  ["todos", "\u5F85\u529E", s2],
  ["schedule", "\u5B9A\u65F6\u4EFB\u52A1", s6],
  ["knowledge", "\u5173\u8054\u77E5\u8BC6\u5E93", n],
  ["summary", "\u6BCF\u65E5\u603B\u7ED3", n6]
]);
var KNOWLEDGE_TOOL_TABS = Object.freeze([
  ["documents", "\u6587\u6863", s7],
  ["index", "\u7D22\u5F15", f],
  ["projects", "\u5173\u8054\u9879\u76EE", m3],
  ["global_schedule", "\u5168\u5C40\u5B9A\u65F6", s6]
]);
var INDEPENDENT_TOOL_TABS = Object.freeze([
  ["context", "\u4E0A\u4E0B\u6587", n12],
  ["files", "\u6587\u4EF6", m6],
  ["subagents", "Subagent", n10],
  ["global_schedule", "\u5168\u5C40\u5B9A\u65F6", s6]
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
var useBrowserLayoutEffect = typeof window === "undefined" ? import_react17.default.useEffect : import_react17.default.useLayoutEffect;
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
  const [nativeDetailsOpen, setNativeDetailsOpen] = import_react17.default.useState(false);
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
function GlobalSchedulesPanel({ state, store: store3 }) {
  import_react17.default.useEffect(function() {
    store3.actions.loadGlobalSchedules?.().catch(function() {
    });
  }, [store3]);
  const rows = Array.isArray(state.globalSchedules) ? state.globalSchedules : [];
  if (!rows.length) return import_react17.default.createElement("div", { className: "cpwb-context-empty" }, "\u6682\u65E0\u5168\u5C40\u5B9A\u65F6\u4EFB\u52A1");
  return import_react17.default.createElement("div", { className: "cpwb-context-list" }, rows.map((schedule) => {
    const project = state.projects?.find?.((item) => item.id === schedule.projectId);
    return import_react17.default.createElement(
      "article",
      { key: schedule.id, className: "cpwb-context-card" },
      import_react17.default.createElement("span", null, project?.name || "\u9879\u76EE #" + schedule.projectId),
      import_react17.default.createElement("strong", null, schedule.name),
      import_react17.default.createElement("small", null, (schedule.enabled ? "\u5DF2\u542F\u7528" : "\u5DF2\u6682\u505C") + " \xB7 " + (schedule.nextRunAt || schedule.startsAt || "\u5F85\u8BA1\u7B97"))
    );
  }));
}
function SessionContextPanel({ sessionId, scope, state, store: store3 }) {
  import_react17.default.useEffect(function() {
    store3.actions.loadSessionContext?.(sessionId).catch(function() {
    });
  }, [sessionId, store3]);
  const rows = Array.isArray(state.contextBySession?.[sessionId]) ? state.contextBySession[sessionId] : [];
  const inherited = scope.kind === "project" ? "\u9879\u76EE Workspace + \u5168\u90E8\u5173\u8054\u77E5\u8BC6\u5E93" : scope.kind === "knowledge_base" ? "\u5F53\u524D\u77E5\u8BC6\u5E93\u5168\u90E8\u53EF\u7528\u6587\u6863" : "\u65E0\u9ED8\u8BA4\u7EE7\u627F\u6765\u6E90";
  return import_react17.default.createElement(
    "div",
    { className: "cpwb-context-list" },
    import_react17.default.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" }, import_react17.default.createElement("span", null, "INHERITED"), import_react17.default.createElement("strong", null, inherited), import_react17.default.createElement("small", null, "\u968F\u5BB9\u5668\u5173\u8054\u53D8\u5316\u52A8\u6001\u66F4\u65B0")),
    rows.map((row, index) => import_react17.default.createElement(
      "article",
      { key: row.id || index, className: "cpwb-context-card" },
      import_react17.default.createElement("span", null, String(row.mode || "pinned").toUpperCase()),
      import_react17.default.createElement("strong", null, (row.sourceKind || row.source?.kind) + " / " + (row.sourceId || row.source?.id)),
      import_react17.default.createElement("small", null, row.available === false ? "\u5F15\u7528\u6765\u6E90\u5DF2\u5220\u9664" : "\u4F1A\u8BDD\u56FA\u5B9A\u6765\u6E90")
    ))
  );
}
function SessionFilesPanel() {
  return import_react17.default.createElement(
    "div",
    { className: "cpwb-context-list" },
    import_react17.default.createElement(
      "article",
      { className: "cpwb-context-card cpwb-context-card-primary" },
      import_react17.default.createElement("span", null, "DSH FILES API"),
      import_react17.default.createElement("strong", null, "\u6587\u4EF6\u4E0E\u56FE\u7247\u7531\u539F\u751F\u8F93\u5165\u533A\u7BA1\u7406"),
      import_react17.default.createElement("small", null, "\u4F7F\u7528\u56DE\u5F62\u9488\u3001\u56FE\u7247\u6309\u94AE\u6216 @ \u5F15\u7528\u5F53\u524D Workspace \u6587\u4EF6")
    )
  );
}
function KnowledgeIndexPanel({ knowledgeBaseId, state, store: store3 }) {
  const docs = Array.isArray(state.documents) ? state.documents : [];
  const ready = docs.filter((item) => item.status === "ready").length;
  const stale = docs.filter((item) => item.status === "stale" || item.status === "failed").length;
  return import_react17.default.createElement(
    "div",
    { className: "cpwb-context-list" },
    import_react17.default.createElement(
      "article",
      { className: "cpwb-context-card cpwb-context-card-primary" },
      import_react17.default.createElement("span", null, "VECTOR INDEX"),
      import_react17.default.createElement("strong", null, ready + " / " + docs.length + " \u6587\u6863\u5C31\u7EEA"),
      import_react17.default.createElement("small", null, stale ? stale + " \u4E2A\u7D22\u5F15\u9700\u8981\u5904\u7406" : "\u7D22\u5F15\u72B6\u6001\u6B63\u5E38")
    ),
    import_react17.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: () => store3.actions.reindexKnowledgeBase?.(knowledgeBaseId) }, "\u91CD\u5EFA\u5F53\u524D\u77E5\u8BC6\u5E93\u7D22\u5F15")
  );
}
function LinkedProjectsPanel({ knowledgeBaseId, state, store: store3 }) {
  import_react17.default.useEffect(function() {
    store3.actions.loadKnowledgeBaseProjects?.(knowledgeBaseId).catch(function() {
    });
  }, [knowledgeBaseId, store3]);
  const projects = Array.isArray(state.linkedProjects) ? state.linkedProjects : [];
  return import_react17.default.createElement("div", { className: "cpwb-context-list" }, projects.length ? projects.map((project) => import_react17.default.createElement("article", { key: project.id, className: "cpwb-context-card" }, import_react17.default.createElement("span", null, "PROJECT"), import_react17.default.createElement("strong", null, project.name), import_react17.default.createElement("small", null, project.path || "\u5DF2\u5173\u8054"))) : import_react17.default.createElement("div", { className: "cpwb-context-empty" }, "\u5C1A\u672A\u5173\u8054\u4EFB\u4F55\u9879\u76EE"));
}
function WorkbenchSessionShell(props) {
  const state = import_react17.default.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const legacyHomeOpen = useHomeOpen();
  const sessionSnapshot = import_react17.default.useSyncExternalStore(
    props.sessions?.list?.subscribe || (() => () => {
    }),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions)),
    props.sessions?.list?.getSnapshot || (() => readSessionSnapshot(props.sessions))
  );
  const sessionId = props.sessionId ?? sessionSnapshot.current;
  const runtimeEntry = getWorkbenchSession(sessionId);
  const persistedEntry = state.workbenchSessions?.[sessionId];
  const entry = persistedEntry ? { ...runtimeEntry, ...persistedEntry } : runtimeEntry;
  const scope = entry?.scope;
  const projectId = scope?.kind === "project" ? scope.id : null;
  const knowledgeBaseId = scope?.kind === "knowledge_base" ? scope.id : null;
  const project = projectId == null ? null : projectFor(state, projectId);
  const knowledgeBase = knowledgeBaseId == null ? null : knowledgeBaseFor(state, knowledgeBaseId);
  const [activeTool, setActiveTool] = import_react17.default.useState(function() {
    return scope?.kind === "project" ? "todos" : scope?.kind === "knowledge_base" ? "documents" : "context";
  });
  const visible = props.open === void 0 ? !legacyHomeOpen : props.open;
  const scopeKey = scope?.kind ? scope.kind + ":" + String(scope.id ?? "") : null;
  const contextSeatAvailable = useContextRailSeat(scopeKey);
  useSessionHeaderSeat(visible && Boolean(sessionId?.startsWith?.("session-cpwb-")));
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const projectTriggerRef = import_react17.default.useRef(null);
  const nativeSelectionLabel = useNativeModelSelectionLabel(sessionId);
  const [subagentOpen, setSubagentOpen] = import_react17.default.useState(false);
  const subagentCatalog = sessionSnapshot?.subagentsByParent?.[sessionId];
  const subagentCount = Array.isArray(subagentCatalog?.entries) ? subagentCatalog.entries.filter((item) => item?.kind === "child").length : 0;
  import_react17.default.useEffect(function() {
    setSubagentOpen(false);
    if (!visible || !sessionId || typeof props.sessions?.refreshSubagents !== "function") return void 0;
    props.sessions.refreshSubagents(sessionId).catch(function() {
    });
    return void 0;
  }, [props.sessions, sessionId, visible]);
  import_react17.default.useEffect(function() {
    setActiveTool(scope?.kind === "project" ? "todos" : scope?.kind === "knowledge_base" ? "documents" : "context");
  }, [scope?.kind, scope?.id]);
  import_react17.default.useEffect(function() {
    if (scope?.kind !== "independent" || entry?.title || typeof props.store.actions.loadRecentSessions !== "function") return void 0;
    let attempts = 0;
    let stopped = false;
    let timer = null;
    const refresh = async function() {
      attempts += 1;
      await props.store.actions.loadRecentSessions({ limit: 8 }).catch(function() {
      });
      if (!stopped && attempts < 12) timer = setTimeout(refresh, 1500);
    };
    void refresh();
    return function() {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [entry?.title, props.store, scope?.kind, sessionId]);
  import_react17.default.useEffect(function() {
    if (projectId != null && state.activeProjectId !== projectId) {
      props.store.actions.refreshProject(projectId).catch(function() {
      });
    }
  }, [projectId, props.store, state.activeProjectId]);
  if (!visible || !sessionId || !String(sessionId).startsWith("session-cpwb-")) return null;
  const toolTabs = projectId != null ? PROJECT_TOOL_TABS : knowledgeBaseId != null ? KNOWLEDGE_TOOL_TABS : INDEPENDENT_TOOL_TABS;
  let body = null;
  if (projectId != null) {
    if (activeTool === "todos") body = import_react17.default.createElement(Todos, { store: props.store, projectId });
    else if (activeTool === "schedule") body = import_react17.default.createElement(Automation, { store: props.store, projectId, view: "schedule" });
    else if (activeTool === "knowledge") body = import_react17.default.createElement(KnowledgeBase, { store: props.store, projectId, view: "linked" });
    else if (activeTool === "summary") body = import_react17.default.createElement(Automation, { store: props.store, projectId, view: "summary" });
  } else if (knowledgeBaseId != null) {
    if (activeTool === "documents") body = import_react17.default.createElement(KnowledgeBase, { store: props.store, knowledgeBaseId, view: "documents" });
    else if (activeTool === "index") body = import_react17.default.createElement(KnowledgeIndexPanel, { knowledgeBaseId, state, store: props.store });
    else if (activeTool === "projects") body = import_react17.default.createElement(LinkedProjectsPanel, { knowledgeBaseId, state, store: props.store });
    else if (activeTool === "global_schedule") body = import_react17.default.createElement(GlobalSchedulesPanel, { state, store: props.store });
  } else {
    if (activeTool === "context") body = import_react17.default.createElement(SessionContextPanel, { sessionId, scope: scope || { kind: "independent", id: null }, state, store: props.store });
    else if (activeTool === "files") body = import_react17.default.createElement(SessionFilesPanel);
    else if (activeTool === "subagents") body = import_react17.default.createElement(
      "div",
      { className: "cpwb-context-list" },
      import_react17.default.createElement("article", { className: "cpwb-context-card cpwb-context-card-primary" }, import_react17.default.createElement("span", null, "SUBAGENT ACTIVITY"), import_react17.default.createElement("strong", null, subagentCount + " \u4E2A\u5B50\u667A\u80FD\u4F53"), import_react17.default.createElement("small", null, "\u67E5\u770B\u4F1A\u8BDD\u3001\u72B6\u6001\u4E0E\u8FD0\u884C\u8BE6\u60C5")),
      import_react17.default.createElement("button", { type: "button", className: "cpwb-btn cpwb-btn-primary", onClick: () => setSubagentOpen(true) }, "\u6253\u5F00 Subagent \u62BD\u5C49")
    );
    else if (activeTool === "global_schedule") body = import_react17.default.createElement(GlobalSchedulesPanel, { state, store: props.store });
  }
  const contextRail = function(drawer = false) {
    const railKind = projectId != null ? "PROJECT SYSTEM" : knowledgeBaseId != null ? "KNOWLEDGE SYSTEM" : "SESSION SYSTEM";
    const railName = projectId != null ? project?.name || "\u9879\u76EE\u5DE5\u4F5C\u53F0" : knowledgeBaseId != null ? knowledgeBase?.name || "\u77E5\u8BC6\u5E93" : entry?.title || "\u72EC\u7ACB\u4F1A\u8BDD";
    const railMeta = projectId != null ? "\u9879\u76EE\u4E0A\u4E0B\u6587 \xB7 " + String(projectId).padStart(2, "0") : knowledgeBaseId != null ? "\u77E5\u8BC6\u5E93\u4E0A\u4E0B\u6587 \xB7 " + String(knowledgeBaseId).padStart(2, "0") : "\u65E0\u5BB9\u5668\u5F52\u5C5E \xB7 GLOBAL";
    return import_react17.default.createElement(
      "aside",
      { className: "cpwb-project-rail" + (drawer ? " cpwb-project-rail-drawer" : ""), "aria-label": "\u4E0A\u4E0B\u6587\u5DE5\u5177" },
      import_react17.default.createElement(
        "header",
        { className: "cpwb-project-rail-header" },
        import_react17.default.createElement("span", null, railKind),
        import_react17.default.createElement("h2", null, railName),
        import_react17.default.createElement("small", null, railMeta)
      ),
      import_react17.default.createElement("nav", { className: "cpwb-project-tool-tabs", "aria-label": "\u4E0A\u4E0B\u6587\u5DE5\u5177" }, toolTabs.map(([id, label, IconComponent]) => import_react17.default.createElement("button", {
        type: "button",
        key: id,
        className: activeTool === id ? "cpwb-active" : "",
        onClick: () => setActiveTool(id),
        "aria-current": activeTool === id ? "page" : void 0,
        title: label
      }, import_react17.default.createElement(IconComponent, { size: 18, weight: "regular", "aria-hidden": true }), import_react17.default.createElement("span", null, label)))),
      import_react17.default.createElement("div", { className: "cpwb-project-tool-body" }, body)
    );
  };
  const dockedContextRail = contextSeatAvailable && layoutMode === "desktop";
  const drawerContextRail = contextSeatAvailable && layoutMode !== "desktop";
  const contextType = projectId != null ? "\u9879\u76EE\u4F1A\u8BDD" : knowledgeBaseId != null ? "\u77E5\u8BC6\u5E93\u4F1A\u8BDD" : "\u72EC\u7ACB\u4F1A\u8BDD";
  const contextName = projectId != null ? project?.name || "\u9879\u76EE\u5DE5\u4F5C\u53F0" : knowledgeBaseId != null ? knowledgeBase?.name || entry?.contextName || "\u77E5\u8BC6\u5E93" : entry?.title || entry?.displayTitle || "\u65B0\u72EC\u7ACB\u4F1A\u8BDD";
  const contextDetail = projectId != null ? String(Array.isArray(state.linkedKnowledgeBases) ? state.linkedKnowledgeBases.length : 0) + " \u4E2A\u5173\u8054\u77E5\u8BC6\u5E93" : knowledgeBaseId != null ? "\u5411\u91CF\u68C0\u7D22\u5DF2\u542F\u7528" : "\u672A\u5173\u8054\u9879\u76EE \xB7 \u672A\u542F\u7528\u77E5\u8BC6\u5E93";
  const selection = entry?.selection || {};
  const selectionLabel = nativeSelectionLabel || [selection.model, selection.reasoningEffort].filter(Boolean).join(" \xB7 ") || "\u6A21\u578B\u7531\u4F1A\u8BDD\u9009\u62E9\u5668\u63A7\u5236";
  return import_react17.default.createElement(
    "div",
    {
      className: "cpwb-session-chrome cpwb-workbench-overlay cpwb-has-context-rail " + (projectId != null ? "cpwb-project-context" : "cpwb-standalone-context"),
      "data-session-context": scope?.kind || "unknown",
      "data-right-owner": dockedContextRail ? "context-tools" : !contextSeatAvailable ? "native-details" : void 0,
      "aria-label": "Workbench \u4F1A\u8BDD\u6846\u67B6"
    },
    import_react17.default.createElement(
      "header",
      { className: "cpwb-session-context-bar", "aria-label": "\u4F1A\u8BDD\u4E0A\u4E0B\u6587" },
      import_react17.default.createElement(
        "div",
        { className: "cpwb-session-context-identity" },
        import_react17.default.createElement("span", { className: "cpwb-session-context-kind" }, contextType),
        import_react17.default.createElement("strong", null, contextName)
      ),
      import_react17.default.createElement(
        "div",
        { className: "cpwb-session-context-meta" },
        import_react17.default.createElement("small", null, contextDetail),
        import_react17.default.createElement("button", {
          type: "button",
          className: "cpwb-session-subagent-trigger",
          onClick: () => setSubagentOpen(true),
          "aria-label": "\u6253\u5F00\u5B50\u667A\u80FD\u4F53\u6D3B\u52A8\uFF0C\u5171 " + subagentCount + " \u4E2A",
          "aria-expanded": subagentOpen
        }, import_react17.default.createElement(n10, { size: 16, weight: "duotone", "aria-hidden": true }), import_react17.default.createElement("span", null, "SUBAGENT"), import_react17.default.createElement("b", null, String(subagentCount).padStart(2, "0"))),
        import_react17.default.createElement("em", null, selectionLabel)
      )
    ),
    dockedContextRail ? contextRail(false) : null,
    drawerContextRail ? import_react17.default.createElement("button", {
      ref: projectTriggerRef,
      type: "button",
      className: "cpwb-project-tool-toggle",
      "aria-label": "\u6253\u5F00\u4E0A\u4E0B\u6587\u5DE5\u5177",
      "aria-expanded": props.projectDrawerOpen === true,
      onClick: props.onProjectDrawerOpen
    }, import_react17.default.createElement(n12, { size: 18, "aria-hidden": true }), import_react17.default.createElement("span", null, "\u4E0A\u4E0B\u6587\u5DE5\u5177")) : null,
    drawerContextRail ? import_react17.default.createElement(DrawerDialog, {
      open: props.projectDrawerOpen === true,
      onClose: props.onProjectDrawerClose,
      label: "\u4E0A\u4E0B\u6587\u5DE5\u5177",
      side: "right",
      triggerRef: projectTriggerRef
    }, contextRail(true)) : null,
    import_react17.default.createElement(SubagentDrawer, {
      open: subagentOpen,
      parentSessionId: sessionId,
      connection: props.connection,
      sessions: props.sessions,
      onClose: () => setSubagentOpen(false)
    })
  );
}

// src/client/WorkbenchSidebar.js
var import_react20 = __toESM(require("react"), 1);

// src/client/SidebarBrand.js
var import_react19 = __toESM(require("react"), 1);
function HarnessWorkbenchLogo() {
  return import_react19.default.createElement(
    "svg",
    { viewBox: "0 0 190 74", role: "img", "aria-labelledby": "cpwb-logo-title" },
    import_react19.default.createElement("title", { id: "cpwb-logo-title" }, "Harness Workbench"),
    import_react19.default.createElement(
      "g",
      { fill: "var(--cpwb-logo-cyan, #4de8f4)", transform: "translate(3 3)" },
      import_react19.default.createElement("text", { x: "9", y: "39", textLength: "166", lengthAdjust: "spacingAndGlyphs", fontFamily: "Rajdhani, sans-serif", fontSize: "39", fontStyle: "italic", fontWeight: "500" }, "HARNESS")
    ),
    import_react19.default.createElement(
      "g",
      { fill: "var(--cpwb-logo-amber, #ffb51b)" },
      import_react19.default.createElement("text", { x: "7", y: "37", textLength: "166", lengthAdjust: "spacingAndGlyphs", fontFamily: "Rajdhani, sans-serif", fontSize: "39", fontStyle: "italic", fontWeight: "500" }, "HARNESS")
    ),
    import_react19.default.createElement("path", { fill: "var(--cpwb-logo-cut, #07090f)", d: "M43 9h8L37 43h-8zM94 8h7L87 44h-7zM146 8h7l-14 36h-7z" }),
    import_react19.default.createElement("path", { fill: "none", stroke: "var(--cpwb-logo-cyan, #4de8f4)", strokeWidth: "1.5", d: "M2 45L28 39M0 49L43 45M159 39L188 31M153 44L190 39" }),
    import_react19.default.createElement("text", { x: "28", y: "63", fill: "var(--cpwb-logo-cyan, #4de8f4)", fontFamily: "Rajdhani, sans-serif", fontSize: "11", fontWeight: "600", letterSpacing: "5" }, "WORKBENCH")
  );
}
function SidebarBrand({ status = "DSH // LOCAL NODE" }) {
  return import_react19.default.createElement(
    "footer",
    { className: "cpwb-sidebar-brand-footer", "aria-label": "Harness Workbench" },
    import_react19.default.createElement("div", { className: "cpwb-sidebar-status" }, status),
    import_react19.default.createElement("div", { className: "cpwb-sidebar-wordmark" }, import_react19.default.createElement(HarnessWorkbenchLogo))
  );
}

// src/client/WorkbenchSidebar.js
var ICON_WEIGHT = "regular";
function NavIcon({ component: Component }) {
  return import_react20.default.createElement(Component, { size: 19, weight: ICON_WEIGHT, "aria-hidden": true });
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
function sameScope(left, right) {
  return left?.kind === right?.kind && String(left?.id ?? "") === String(right?.id ?? "");
}
function partitionSidebarSessions(sessions, currentScope, activeSessionId) {
  const list = Array.isArray(sessions) ? sessions : [];
  if (!currentScope) return { current: [], recent: list.slice(0, 8) };
  const inCurrent = currentScope.kind === "independent" ? list.filter((item) => item.sessionId === activeSessionId) : list.filter((item) => sameScope(sessionScope(item), currentScope));
  const excluded = new Set(inCurrent.map((item) => item.sessionId));
  if (currentScope.kind === "independent" && activeSessionId) excluded.add(activeSessionId);
  return {
    current: inCurrent.slice(0, 3),
    recent: list.filter((item) => !excluded.has(item.sessionId) && !sameScope(sessionScope(item), currentScope)).slice(0, 8)
  };
}
function sessionButton(session, activeSessionId, onOpenSession) {
  return import_react20.default.createElement(
    "button",
    {
      type: "button",
      key: session.sessionId,
      className: "cpwb-sidebar-recent" + (session.sessionId === activeSessionId ? " cpwb-active" : ""),
      onClick: () => onOpenSession?.(session.sessionId)
    },
    import_react20.default.createElement(NavIcon, { component: m2 }),
    import_react20.default.createElement(
      "span",
      null,
      import_react20.default.createElement("strong", null, session.title || session.displayTitle || session.contextName || "\u672A\u547D\u540D\u4F1A\u8BDD"),
      import_react20.default.createElement("small", null, contextLabel(session))
    )
  );
}
function WorkbenchSidebar({
  page,
  activeSessionId,
  recentSessions = [],
  currentScope = null,
  currentContainerName = null,
  currentContainerTotal = 0,
  onNavigate,
  onNewSession,
  onOpenSession,
  settingsTrigger
}) {
  const groups = partitionSidebarSessions(recentSessions, currentScope, activeSessionId);
  const nav = [
    ["home", "\u9996\u9875", n4],
    ["sessions", "\u5168\u90E8\u4F1A\u8BDD", m4],
    ["knowledge", "\u77E5\u8BC6\u5E93", n]
  ];
  const containerKind = currentScope?.kind === "project" ? "\u5F53\u524D\u9879\u76EE" : currentScope?.kind === "knowledge_base" ? "\u5F53\u524D\u77E5\u8BC6\u5E93" : "\u5F53\u524D\u4F1A\u8BDD";
  return import_react20.default.createElement(
    "aside",
    { className: "cpwb-global-sidebar", "aria-label": "Workbench \u5168\u5C40\u5BFC\u822A" },
    import_react20.default.createElement(
      "div",
      { className: "cpwb-sidebar-primary" },
      import_react20.default.createElement(
        "div",
        { className: "cpwb-sidebar-product" },
        import_react20.default.createElement("span", null, "DEEPSEEK"),
        import_react20.default.createElement("small", null, "HARNESS WORKBENCH")
      ),
      import_react20.default.createElement(
        "button",
        { type: "button", className: "cpwb-sidebar-new", onClick: onNewSession },
        import_react20.default.createElement(NavIcon, { component: n9 }),
        import_react20.default.createElement("span", null, "\u65B0\u5EFA\u4F1A\u8BDD")
      ),
      import_react20.default.createElement(
        "nav",
        { className: "cpwb-sidebar-global-nav", "aria-label": "\u4E3B\u5BFC\u822A" },
        nav.map(([id, label, IconComponent]) => import_react20.default.createElement("button", {
          type: "button",
          key: id,
          className: "cpwb-sidebar-nav-item" + (page === id ? " cpwb-active" : ""),
          "aria-current": page === id ? "page" : void 0,
          onClick: () => onNavigate?.(id)
        }, import_react20.default.createElement(NavIcon, { component: IconComponent }), import_react20.default.createElement("span", null, label)))
      )
    ),
    currentScope ? import_react20.default.createElement(
      "section",
      { className: "cpwb-sidebar-current", "aria-label": containerKind },
      import_react20.default.createElement("div", { className: "cpwb-sidebar-section-label" }, containerKind, import_react20.default.createElement("b", null, String(currentContainerTotal || groups.current.length).padStart(2, "0"))),
      import_react20.default.createElement("div", { className: "cpwb-sidebar-container-name" }, currentContainerName || "\u5F53\u524D\u4E0A\u4E0B\u6587"),
      import_react20.default.createElement(
        "div",
        { className: "cpwb-sidebar-current-list" },
        groups.current.length ? groups.current.map((session) => sessionButton(session, activeSessionId, onOpenSession)) : import_react20.default.createElement("p", { className: "cpwb-sidebar-empty" }, "\u6682\u65E0\u5DF2\u4FDD\u5B58\u4F1A\u8BDD")
      ),
      import_react20.default.createElement(
        "button",
        { type: "button", className: "cpwb-sidebar-all", onClick: () => onNavigate?.("sessions") },
        "\u67E5\u770B\u5168\u90E8 " + (currentContainerTotal || groups.current.length) + " \u4E2A\u4F1A\u8BDD"
      )
    ) : null,
    import_react20.default.createElement(
      "section",
      { className: "cpwb-sidebar-recents", "aria-label": "\u5176\u4ED6\u6700\u8FD1\u4F1A\u8BDD" },
      import_react20.default.createElement("div", { className: "cpwb-sidebar-section-label" }, currentScope ? "\u5176\u4ED6\u6700\u8FD1\u4F1A\u8BDD" : "\u6700\u8FD1\u4F1A\u8BDD", import_react20.default.createElement("b", null, String(groups.recent.length).padStart(2, "0"))),
      import_react20.default.createElement(
        "div",
        { className: "cpwb-sidebar-recent-scroll" },
        groups.recent.length === 0 ? import_react20.default.createElement("p", { className: "cpwb-sidebar-empty" }, "\u6682\u65E0\u4F1A\u8BDD") : groups.recent.map((session) => sessionButton(session, activeSessionId, onOpenSession)),
        import_react20.default.createElement(
          "button",
          { type: "button", className: "cpwb-sidebar-all", onClick: () => onNavigate?.("sessions") },
          "\u67E5\u770B\u5168\u90E8\u4F1A\u8BDD"
        )
      )
    ),
    import_react20.default.createElement(
      "div",
      { className: "cpwb-sidebar-fixed-footer" },
      import_react20.default.createElement(
        "button",
        { type: "button", className: "cpwb-sidebar-settings", onClick: settingsTrigger },
        import_react20.default.createElement(NavIcon, { component: s8 }),
        import_react20.default.createElement("span", null, "\u8BBE\u7F6E")
      ),
      import_react20.default.createElement(SidebarBrand, { status: "INTELLIGENCE ONLINE" })
    )
  );
}

// src/client/SessionListPage.js
var import_react22 = __toESM(require("react"), 1);
function scopeLabel(row) {
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
function SessionListPage({ store: store3, onOpenSession }) {
  const state = import_react22.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const [query, setQuery] = import_react22.default.useState("");
  const [context, setContext] = import_react22.default.useState("");
  const page = state.sessionPage ?? { items: [], total: 0, limit: 20, offset: 0 };
  const load = import_react22.default.useCallback((offset = 0) => store3.actions.loadAllSessions({
    query: query.trim(),
    scopeKind: context || null,
    offset,
    limit: page.limit || 20
  }), [context, page.limit, query, store3]);
  import_react22.default.useEffect(function() {
    load(0).catch(function() {
    });
  }, []);
  return import_react22.default.createElement(
    "main",
    { className: "cpwb-session-list-page cpwb-workbench-page", "data-page": "sessions" },
    import_react22.default.createElement(
      "header",
      { className: "cpwb-page-header" },
      import_react22.default.createElement(
        "div",
        { className: "cpwb-page-header-main" },
        import_react22.default.createElement("span", null, "03 / CONVERSATIONS"),
        import_react22.default.createElement("h1", null, "\u5168\u90E8\u4F1A\u8BDD"),
        import_react22.default.createElement("p", null, "\u9879\u76EE\u3001\u77E5\u8BC6\u5E93\u4E0E\u72EC\u7ACB\u4F1A\u8BDD\u7EDF\u4E00\u5F52\u6863\u3002")
      ),
      import_react22.default.createElement("div", { className: "cpwb-page-header-stat" }, import_react22.default.createElement("strong", null, page.total), import_react22.default.createElement("span", null, "\u6761\u4F1A\u8BDD"))
    ),
    import_react22.default.createElement(
      "form",
      { className: "cpwb-session-filters", onSubmit: function(event) {
        event.preventDefault();
        load(0).catch(function() {
        });
      } },
      import_react22.default.createElement(
        "label",
        null,
        import_react22.default.createElement(f, { size: 18, weight: "regular", "aria-hidden": true }),
        import_react22.default.createElement("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "\u641C\u7D22\u4F1A\u8BDD\u6216\u6765\u6E90", "aria-label": "\u641C\u7D22\u4F1A\u8BDD" })
      ),
      import_react22.default.createElement(
        "select",
        { value: context, onChange: (event) => setContext(event.target.value), "aria-label": "\u4F1A\u8BDD\u7C7B\u578B" },
        import_react22.default.createElement("option", { value: "" }, "\u5168\u90E8\u7C7B\u578B"),
        import_react22.default.createElement("option", { value: "project" }, "\u9879\u76EE"),
        import_react22.default.createElement("option", { value: "knowledge_base" }, "\u77E5\u8BC6\u5E93"),
        import_react22.default.createElement("option", { value: "independent" }, "\u72EC\u7ACB")
      ),
      import_react22.default.createElement("button", { type: "submit" }, "\u68C0\u7D22")
    ),
    state.action?.status === "error" ? import_react22.default.createElement("div", { className: "cpwb-page-error", role: "alert" }, state.action.error?.message || "\u4F1A\u8BDD\u52A0\u8F7D\u5931\u8D25") : null,
    page.items.length === 0 ? import_react22.default.createElement("div", { className: "cpwb-session-list-empty" }, import_react22.default.createElement(s4, { size: 28, weight: "regular" }), import_react22.default.createElement("span", null, "\u6682\u65E0\u5339\u914D\u4F1A\u8BDD")) : import_react22.default.createElement("div", { className: "cpwb-session-list" }, page.items.map((row) => import_react22.default.createElement(
      "button",
      {
        type: "button",
        key: row.sessionId,
        className: "cpwb-session-list-row",
        onClick: () => onOpenSession?.(row.sessionId)
      },
      import_react22.default.createElement(s4, { size: 20, weight: "regular", "aria-hidden": true }),
      import_react22.default.createElement(
        "span",
        null,
        import_react22.default.createElement("strong", null, row.title || row.displayTitle || row.contextName || "\u672A\u547D\u540D\u4F1A\u8BDD"),
        import_react22.default.createElement("small", null, scopeLabel(row))
      ),
      import_react22.default.createElement("time", null, activityLabel(row.updatedAt))
    ))),
    import_react22.default.createElement(
      "footer",
      { className: "cpwb-session-pagination" },
      import_react22.default.createElement("span", null, "\u5171 " + page.total + " \u6761"),
      import_react22.default.createElement(
        "div",
        null,
        import_react22.default.createElement("button", { type: "button", disabled: page.offset <= 0, onClick: () => load(Math.max(0, page.offset - page.limit)).catch(function() {
        }) }, "\u4E0A\u4E00\u9875"),
        import_react22.default.createElement("button", { type: "button", disabled: page.offset + page.limit >= page.total, onClick: () => load(page.offset + page.limit).catch(function() {
        }) }, "\u4E0B\u4E00\u9875")
      )
    )
  );
}

// src/client/NewSessionDialog.js
var import_react24 = __toESM(require("react"), 1);
var OWNER_TYPES = [
  ["project", "\u9879\u76EE", m3],
  ["knowledge_base", "\u77E5\u8BC6\u5E93", n],
  ["independent", "\u72EC\u7ACB\u4F1A\u8BDD", m8]
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
  return ["\u9ED8\u8BA4\u4E0D\u7EE7\u627F\u4E0A\u4E0B\u6587\uFF0C\u53EF\u5728\u4F1A\u8BDD\u4E2D\u4F7F\u7528 @ \u6DFB\u52A0"];
}
function NewSessionDialog({ open, store: store3, initialScope, onClose, onStart }) {
  const state = import_react24.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const normalized = normalizedInitialScope(initialScope);
  const [kind, setKind] = import_react24.default.useState(normalized.kind);
  const [ownerId, setOwnerId] = import_react24.default.useState(normalized.id == null ? "" : String(normalized.id));
  import_react24.default.useEffect(function() {
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
  return import_react24.default.createElement(
    GlobalModal,
    { onClose, labelledBy: "cpwb-new-session-title", className: "cpwb-new-session-host" },
    import_react24.default.createElement(
      "form",
      { className: "cpwb-new-session-dialog", onSubmit: start },
      import_react24.default.createElement(
        "header",
        null,
        import_react24.default.createElement("span", null, "SESSION / INITIALIZE"),
        import_react24.default.createElement("h2", { id: "cpwb-new-session-title" }, "\u65B0\u5EFA\u4F1A\u8BDD"),
        import_react24.default.createElement("p", null, "\u9009\u62E9\u552F\u4E00\u5F52\u5C5E\u3002\u7B2C\u4E00\u6761\u6709\u6548\u6D88\u606F\u53D1\u9001\u524D\u4E0D\u4F1A\u521B\u5EFA DSH Session\u3002")
      ),
      import_react24.default.createElement(
        "fieldset",
        { className: "cpwb-owner-options" },
        import_react24.default.createElement("legend", null, "\u4F1A\u8BDD\u5F52\u5C5E"),
        OWNER_TYPES.map(([value, label, Icon2]) => import_react24.default.createElement(
          "label",
          {
            key: value,
            className: kind === value ? "cpwb-active" : ""
          },
          import_react24.default.createElement("input", {
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
          import_react24.default.createElement(Icon2, { size: 20, weight: "duotone", "aria-hidden": true }),
          import_react24.default.createElement("span", null, label)
        ))
      ),
      kind !== "independent" ? import_react24.default.createElement(
        "label",
        { className: "cpwb-owner-select" },
        import_react24.default.createElement("span", null, kind === "project" ? "\u9009\u62E9\u9879\u76EE" : "\u9009\u62E9\u77E5\u8BC6\u5E93"),
        import_react24.default.createElement("select", {
          value: ownerId || String(owners[0]?.id ?? ""),
          onChange: (event) => setOwnerId(event.target.value)
        }, owners.map((item) => import_react24.default.createElement("option", { key: item.id, value: item.id }, item.name)))
      ) : null,
      import_react24.default.createElement(
        "section",
        { className: "cpwb-context-preview", "aria-label": "\u9ED8\u8BA4\u4E0A\u4E0B\u6587" },
        import_react24.default.createElement("div", null, import_react24.default.createElement(s9, { size: 18, "aria-hidden": true }), import_react24.default.createElement("strong", null, "\u9ED8\u8BA4\u4E0A\u4E0B\u6587")),
        import_react24.default.createElement("ul", null, sourcePreview(scope, state).map((text) => import_react24.default.createElement("li", { key: text }, text)))
      ),
      import_react24.default.createElement(
        "footer",
        null,
        import_react24.default.createElement("button", { type: "button", className: "cpwb-button-ghost", onClick: onClose }, "\u53D6\u6D88"),
        import_react24.default.createElement(
          "button",
          { type: "submit", className: "cpwb-button-primary", disabled: !valid },
          "\u8FDB\u5165\u65B0\u4F1A\u8BDD",
          import_react24.default.createElement(s, { size: 17, "aria-hidden": true })
        )
      )
    )
  );
}
function DraftConversation({ store: store3, onActivated, onCancel }) {
  const state = import_react24.default.useSyncExternalStore(store3.subscribe, store3.getSnapshot, store3.getSnapshot);
  const draft = state.draft;
  const [text, setText] = import_react24.default.useState(draft?.text || "");
  import_react24.default.useEffect(function() {
    setText(draft?.text || "");
  }, [draft?.sessionId, draft?.status]);
  if (!draft) return null;
  const busy = draft.status === "activating";
  const submit = function(event) {
    event.preventDefault();
    const action = draft.status === "draft_failed" ? store3.actions.retryDraft : store3.actions.activateDraft;
    action({ text }).then(onActivated).catch(function() {
    });
  };
  const scopeLabel2 = draft.scope.kind === "project" ? "\u9879\u76EE\u4F1A\u8BDD" : draft.scope.kind === "knowledge_base" ? "\u77E5\u8BC6\u5E93\u4F1A\u8BDD" : "\u72EC\u7ACB\u4F1A\u8BDD";
  return import_react24.default.createElement(
    "main",
    { className: "cpwb-draft-conversation", "data-status": draft.status },
    import_react24.default.createElement(
      "header",
      null,
      import_react24.default.createElement("span", null, scopeLabel2),
      import_react24.default.createElement("strong", null, "\u65B0\u4F1A\u8BDD"),
      import_react24.default.createElement("button", { type: "button", onClick: onCancel }, "\u9000\u51FA\u8349\u7A3F")
    ),
    import_react24.default.createElement(
      "section",
      { className: "cpwb-draft-empty" },
      import_react24.default.createElement(s9, { size: 26, weight: "duotone", "aria-hidden": true }),
      import_react24.default.createElement("h2", null, draft.status === "draft_failed" ? "\u9996\u6B21\u54CD\u5E94\u5931\u8D25\uFF0C\u53EF\u539F\u5730\u91CD\u8BD5" : "\u4ECE\u7B2C\u4E00\u6761\u6D88\u606F\u5F00\u59CB"),
      import_react24.default.createElement("p", null, "\u53D1\u9001\u540E\u624D\u4F1A\u521B\u5EFA\u539F\u751F DSH Session\uFF0C\u5E76\u7EE7\u7EED\u4F7F\u7528\u5B8C\u6574\u7684\u6A21\u578B\u3001\u63A8\u7406\u3001\u6587\u4EF6\u3001\u5DE5\u5177\u4E0E Subagent \u80FD\u529B\u3002")
    ),
    import_react24.default.createElement(
      "form",
      { className: "cpwb-draft-composer", onSubmit: submit },
      import_react24.default.createElement("textarea", {
        value: text,
        disabled: busy,
        onChange: (event) => setText(event.target.value),
        placeholder: "\u63CF\u8FF0\u4F60\u60F3\u8981\u6784\u5EFA\u7684\u5185\u5BB9\u2026",
        "aria-label": "\u9996\u6761\u6D88\u606F"
      }),
      draft.error ? import_react24.default.createElement("p", { className: "cpwb-draft-error", role: "alert" }, draft.error.message) : null,
      import_react24.default.createElement(
        "button",
        { type: "submit", disabled: busy || !text.trim() },
        import_react24.default.createElement(m5, { size: 18, weight: "fill", "aria-hidden": true }),
        busy ? "\u6B63\u5728\u8FDE\u63A5" : draft.status === "draft_failed" ? "\u91CD\u8BD5" : "\u53D1\u9001"
      )
    )
  );
}

// src/client/WorkbenchShell.js
function WorkbenchShell(props) {
  const navigation2 = props.navigation;
  const view = import_react26.default.useSyncExternalStore(
    navigation2.subscribe,
    navigation2.getSnapshot,
    navigation2.getSnapshot
  );
  const state = import_react26.default.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const [drawerOwner, setDrawerOwner] = import_react26.default.useState(null);
  const [newSessionOpen, setNewSessionOpen] = import_react26.default.useState(false);
  const navigationTriggerRef = import_react26.default.useRef(null);
  const navigate = function(page) {
    if (page === "home") navigation2.openHome();
    else if (page === "knowledge") navigation2.openKnowledge();
    else if (page === "sessions") navigation2.openSessions();
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
  const openNativeSettings = function() {
    closeDrawer();
    if (typeof document === "undefined") return;
    window.setTimeout(function() {
      document.querySelector('[data-slot="sidebar.settings"] > button')?.click?.();
    }, 0);
  };
  const activeEntry = state.workbenchSessions?.[view.sessionId] || state.recentSessions?.find?.((item) => item.sessionId === view.sessionId) || null;
  const currentScope = state.draft?.scope ?? activeEntry?.scope ?? null;
  const currentContainerName = currentScope?.kind === "project" ? state.projects?.find?.((item) => item.id === currentScope.id)?.name : currentScope?.kind === "knowledge_base" ? state.knowledgeBases?.find?.((item) => item.id === currentScope.id)?.name : activeEntry?.title || activeEntry?.displayTitle || "\u5F53\u524D\u72EC\u7ACB\u4F1A\u8BDD";
  import_react26.default.useEffect(function() {
    if (!currentScope || view.page !== "conversation" && view.page !== "draft") return;
    props.store.actions.loadScopeSessions?.(currentScope).catch(function() {
    });
  }, [currentScope?.kind, currentScope?.id, props.store, view.page, view.sessionId]);
  import_react26.default.useEffect(function() {
    if (view.page !== "conversation" && drawerOwner === "project") closeDrawer();
    if (layoutMode !== "mobile" && drawerOwner === "navigation") closeDrawer();
    if (layoutMode === "desktop" && drawerOwner === "project") closeDrawer();
  }, [drawerOwner, layoutMode, view.page]);
  let center;
  if (view.page === "conversation") {
    center = import_react26.default.createElement(WorkbenchSessionShell, {
      ...props,
      open: true,
      globalSidebar: true,
      sessionId: view.sessionId,
      onHome: navigation2.openHome,
      layoutMode,
      projectDrawerOpen: drawerOwner === "project",
      onProjectDrawerOpen: () => openDrawer("project"),
      onProjectDrawerClose: closeDrawer
    });
  } else if (view.page === "draft") {
    center = import_react26.default.createElement(DraftConversation, {
      store: props.store,
      onActivated: props.openActivatedSession,
      onCancel() {
        props.store.actions.discardDraft();
        navigation2.openHome();
      }
    });
  } else if (view.page === "knowledge") {
    center = import_react26.default.createElement(KnowledgeCenterPage, {
      store: props.store,
      sessions: props.sessions,
      workspaces: props.workspaces,
      onConversationOpen: navigation2.openConversation,
      onDraftOpen: navigation2.openDraft
    });
  } else if (view.page === "sessions") {
    center = import_react26.default.createElement(SessionListPage, { store: props.store, onOpenSession: openSession });
  } else {
    center = import_react26.default.createElement(ProjectHome, { ...props, open: true });
  }
  const sidebarSessions = [...state.scopeSessionPage?.items || [], ...state.recentSessions || []].filter((item, index, list) => list.findIndex((candidate) => candidate.sessionId === item.sessionId) === index);
  const sidebar = import_react26.default.createElement(WorkbenchSidebar, {
    page: view.page,
    activeSessionId: view.sessionId,
    recentSessions: sidebarSessions,
    currentScope: view.page === "conversation" || view.page === "draft" ? currentScope : null,
    currentContainerName,
    currentContainerTotal: currentScope?.kind === "independent" ? view.sessionId ? 1 : 0 : state.scopeSessionPage?.total || 0,
    onNavigate: navigate,
    onNewSession: createSession,
    onOpenSession: openSession,
    mobile: layoutMode === "mobile",
    settingsTrigger: openNativeSettings
  });
  const dialogScope = currentScope ?? { kind: "independent", id: null };
  return import_react26.default.createElement(
    "div",
    {
      className: "cpwb-app-shell cpwb-layout-" + layoutMode,
      "data-page": view.page,
      "data-navigation-open": drawerOwner === "navigation" ? "true" : "false"
    },
    layoutMode === "mobile" ? import_react26.default.createElement(
      import_react26.default.Fragment,
      null,
      import_react26.default.createElement("button", {
        ref: navigationTriggerRef,
        type: "button",
        className: "cpwb-mobile-nav-trigger",
        "aria-label": "\u6253\u5F00\u5BFC\u822A",
        "aria-expanded": drawerOwner === "navigation",
        onClick: () => openDrawer("navigation")
      }, import_react26.default.createElement(c5, { size: 21, "aria-hidden": true })),
      import_react26.default.createElement(DrawerDialog, {
        open: drawerOwner === "navigation",
        onClose: closeDrawer,
        label: "Workbench \u5BFC\u822A",
        side: "left",
        triggerRef: navigationTriggerRef
      }, sidebar)
    ) : sidebar,
    import_react26.default.createElement("section", { className: "cpwb-workbench-stage" }, center),
    import_react26.default.createElement(NewSessionDialog, {
      open: newSessionOpen,
      store: props.store,
      initialScope: dialogScope,
      onClose: () => setNewSessionOpen(false),
      onStart(input) {
        props.store.actions.startDraft(input);
        setNewSessionOpen(false);
        navigation2.openDraft();
      }
    })
  );
}

// src/client/SettingsSection.js
var import_react28 = __toESM(require("react"), 1);
var WORKBENCH_SECTIONS = [
  ["workbench", "\u603B\u89C8"],
  ["timezone", "\u65F6\u533A"],
  ["automation", "\u81EA\u52A8\u5316\u63D0\u793A\u8BCD"],
  ["embedding", "\u5411\u91CF\u6A21\u578B"],
  ["network", "\u7F51\u7EDC / Proxy"],
  ["auth", "Codex"]
];
function ActionMessage({ message }) {
  return message ? import_react28.default.createElement("p", { role: "status", className: "cpwb-settings-message" }, message) : null;
}
function TimezonePanel({ settings, store: store3 }) {
  const [draft, setDraft] = import_react28.default.useState(settings.timezone || "Asia/Shanghai");
  const [message, setMessage] = import_react28.default.useState("");
  const [saving, setSaving] = import_react28.default.useState(false);
  import_react28.default.useEffect(() => setDraft(settings.timezone || "Asia/Shanghai"), [settings.timezone]);
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
  return import_react28.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react28.default.createElement("span", { className: "cpwb-eyebrow" }, "WORKBENCH / GLOBAL TIMEZONE"),
    import_react28.default.createElement("h2", null, "\u5168\u5C40\u65F6\u533A"),
    import_react28.default.createElement("p", null, "\u6240\u6709\u5F85\u529E\u3001\u5B9A\u65F6\u4EFB\u52A1\u3001\u603B\u7ED3\u4E0E\u754C\u9762\u65F6\u95F4\u7EDF\u4E00\u4F7F\u7528 Workbench \u65F6\u533A\u3002"),
    import_react28.default.createElement(
      "select",
      { value: draft, onChange: (event) => setDraft(event.target.value), "aria-label": "Workbench \u65F6\u533A" },
      ...["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/London", "America/Los_Angeles", "America/New_York", "UTC"].map((zone) => import_react28.default.createElement("option", { key: zone, value: zone }, zone))
    ),
    import_react28.default.createElement("input", { value: draft, onChange: (event) => setDraft(event.target.value), placeholder: "\u5408\u6CD5 IANA ID\uFF0C\u4F8B\u5982 Europe/Berlin", "aria-label": "\u81EA\u5B9A\u4E49 IANA \u65F6\u533A" }),
    import_react28.default.createElement("button", { type: "button", onClick: save, disabled: saving }, saving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u65F6\u533A"),
    import_react28.default.createElement(ActionMessage, { message })
  );
}
function AutomationPromptsPanel({ settings, store: store3 }) {
  const prompts = settings.automationPrompts || { summaryPrompt: "", todoPrompt: "" };
  const [draft, setDraft] = import_react28.default.useState(prompts);
  const [message, setMessage] = import_react28.default.useState("");
  const [saving, setSaving] = import_react28.default.useState(false);
  import_react28.default.useEffect(() => setDraft(prompts), [prompts.summaryPrompt, prompts.todoPrompt]);
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
  return import_react28.default.createElement(
    "div",
    { className: "cpwb-settings-panel cpwb-prompt-settings" },
    import_react28.default.createElement("span", { className: "cpwb-eyebrow" }, "AUTOMATION / PROMPT CONTROL"),
    import_react28.default.createElement("h2", null, "\u81EA\u52A8\u5316\u63D0\u793A\u8BCD"),
    import_react28.default.createElement("p", null, "\u652F\u6301\u53D8\u91CF {{projectId}}\u3001{{date}}\u3001{{nextDate}}\uFF1B\u8FD0\u884C\u65F6\u9879\u76EE\u6570\u636E\u4F1A\u7531\u7CFB\u7EDF\u5B89\u5168\u8FFD\u52A0\u3002"),
    import_react28.default.createElement(
      "label",
      null,
      "\u6BCF\u65E5\u603B\u7ED3\u63D0\u793A\u8BCD",
      import_react28.default.createElement("textarea", { rows: 8, value: draft.summaryPrompt, onChange: patch("summaryPrompt"), "aria-label": "\u6BCF\u65E5\u603B\u7ED3\u63D0\u793A\u8BCD" })
    ),
    import_react28.default.createElement(
      "label",
      null,
      "\u6B21\u65E5\u5F85\u529E\u63D0\u793A\u8BCD",
      import_react28.default.createElement("textarea", { rows: 8, value: draft.todoPrompt, onChange: patch("todoPrompt"), "aria-label": "\u6B21\u65E5\u5F85\u529E\u63D0\u793A\u8BCD" })
    ),
    import_react28.default.createElement("button", { type: "button", onClick: save, disabled: saving }, saving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u63D0\u793A\u8BCD"),
    import_react28.default.createElement(ActionMessage, { message })
  );
}
function EmbeddingPanel({ settings, store: store3 }) {
  const embedding = settings.embedding || {};
  const credential = embedding.credential || { configured: false, source: null, readOnly: false };
  const [draft, setDraft] = import_react28.default.useState({
    provider: embedding.provider || "ollama",
    baseUrl: embedding.baseUrl || "http://127.0.0.1:11434",
    model: embedding.model || "qwen3-embedding:0.6b",
    dimensions: embedding.dimensions || 1024,
    timeoutMs: embedding.timeoutMs || 3e4,
    credentialRef: embedding.credentialRef || ""
  });
  const [credentialValue, setCredentialValue] = import_react28.default.useState("");
  const [message, setMessage] = import_react28.default.useState("");
  const [saving, setSaving] = import_react28.default.useState(false);
  import_react28.default.useEffect(() => setDraft({
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
  return import_react28.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react28.default.createElement("span", { className: "cpwb-eyebrow" }, "KNOWLEDGE / EMBEDDING"),
    import_react28.default.createElement("h2", null, "\u5411\u91CF\u6A21\u578B"),
    import_react28.default.createElement("label", null, "Provider", import_react28.default.createElement("select", { value: draft.provider, onChange: patch("provider") }, import_react28.default.createElement("option", { value: "ollama" }, "Ollama"), import_react28.default.createElement("option", { value: "openai-compatible" }, "OpenAI-compatible"))),
    import_react28.default.createElement("label", null, "Base URL", import_react28.default.createElement("input", { value: draft.baseUrl, onChange: patch("baseUrl"), "aria-label": "Embedding Base URL" })),
    import_react28.default.createElement("label", null, "Model", import_react28.default.createElement("input", { value: draft.model, onChange: patch("model"), "aria-label": "Embedding model" })),
    import_react28.default.createElement("label", null, "Dimensions", import_react28.default.createElement("input", { type: "number", value: draft.dimensions, onChange: patch("dimensions"), "aria-label": "Embedding dimensions" })),
    import_react28.default.createElement("label", null, "Timeout (ms)", import_react28.default.createElement("input", { type: "number", value: draft.timeoutMs, onChange: patch("timeoutMs"), "aria-label": "Embedding timeout" })),
    import_react28.default.createElement("label", null, "Credential reference", import_react28.default.createElement("input", { value: draft.credentialRef, onChange: patch("credentialRef"), "aria-label": "Embedding credential reference" })),
    import_react28.default.createElement(
      "div",
      { className: "cpwb-settings-actions" },
      import_react28.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.testEmbedding(config), "\u5411\u91CF\u670D\u52A1\u8FDE\u63A5\u6B63\u5E38\u3002"), disabled: saving }, "\u6D4B\u8BD5\u8FDE\u63A5"),
      import_react28.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.updateEmbedding(config), "\u5411\u91CF\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u7D22\u5F15\u72B6\u6001\u6B63\u5728\u6821\u9A8C\u3002"), disabled: saving }, "\u4FDD\u5B58\u914D\u7F6E")
    ),
    import_react28.default.createElement(
      "fieldset",
      null,
      import_react28.default.createElement("legend", null, "\u51ED\u636E\u72B6\u6001"),
      import_react28.default.createElement("p", null, credential.configured ? `\u5DF2\u914D\u7F6E \xB7 \u6765\u6E90 ${credential.source || "\u672A\u77E5"}` : "\u672A\u914D\u7F6E", credential.readOnly ? " \xB7 \u53EA\u8BFB" : ""),
      import_react28.default.createElement("input", { type: "password", value: credentialValue, onChange: (event) => setCredentialValue(event.target.value), placeholder: "\u8F93\u5165\u65B0\u51ED\u636E", "aria-label": "\u65B0 embedding \u51ED\u636E" }),
      import_react28.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.putEmbeddingCredential({ credentialRef: draft.credentialRef, value: credentialValue }), "\u51ED\u636E\u5DF2\u4EA4\u7531 DSH credentials \u4FDD\u5B58\u3002"), disabled: saving || !draft.credentialRef || !credentialValue }, "\u8BBE\u7F6E / \u66FF\u6362\u51ED\u636E"),
      import_react28.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.deleteEmbeddingCredential({ credentialRef: draft.credentialRef }), "\u51ED\u636E\u5DF2\u6E05\u9664\u3002"), disabled: saving || !draft.credentialRef }, "\u6E05\u9664\u51ED\u636E")
    ),
    import_react28.default.createElement(
      "div",
      { className: "cpwb-settings-index" },
      import_react28.default.createElement("strong", null, `\u7D22\u5F15\u72B6\u6001\uFF1A${index.status || "unknown"}`),
      import_react28.default.createElement("span", null, `\u6587\u6863 ${index.counts?.ready ?? index.documentCount ?? 0}`),
      import_react28.default.createElement("p", null, "\u5F71\u54CD\u8303\u56F4\uFF1A\u5168\u90E8\u77E5\u8BC6\u5E93\u6587\u6863"),
      import_react28.default.createElement("button", { type: "button", onClick: () => {
        const allowed = typeof window === "undefined" || typeof window.confirm !== "function" ? true : window.confirm("\u5C06\u91CD\u5EFA\u5168\u90E8\u77E5\u8BC6\u5E93\u5411\u91CF\u7D22\u5F15\uFF0C\u53EF\u80FD\u9700\u8981\u8F83\u957F\u65F6\u95F4\u3002\u7EE7\u7EED\uFF1F");
        if (allowed) store3.actions.reindexAllIndexes?.();
      }, disabled: saving }, "\u91CD\u5EFA\u5168\u90E8\u5411\u91CF\u7D22\u5F15")
    ),
    import_react28.default.createElement(ActionMessage, { message })
  );
}
function NetworkPanel({ settings, store: store3 }) {
  const network = settings.network || {};
  const saved = network.nextLaunch || network;
  const [draft, setDraft] = import_react28.default.useState({ mode: saved.mode || "inherit", proxyUrl: saved.proxyUrl || "", noProxy: saved.noProxy || "" });
  const [message, setMessage] = import_react28.default.useState("");
  const [saving, setSaving] = import_react28.default.useState(false);
  const [testResult, setTestResult] = import_react28.default.useState(null);
  import_react28.default.useEffect(() => setDraft({ mode: saved.mode || "inherit", proxyUrl: saved.proxyUrl || "", noProxy: saved.noProxy || "" }), [saved.mode, saved.proxyUrl, saved.noProxy]);
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
  return import_react28.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react28.default.createElement("span", { className: "cpwb-eyebrow" }, "RUNTIME / NETWORK"),
    import_react28.default.createElement("h2", null, "\u7F51\u7EDC / Proxy"),
    import_react28.default.createElement("label", null, "\u6A21\u5F0F", import_react28.default.createElement("select", { value: draft.mode, onChange: (event) => setDraft({ ...draft, mode: event.target.value }) }, import_react28.default.createElement("option", { value: "inherit" }, "\u7EE7\u627F DSH"), import_react28.default.createElement("option", { value: "direct" }, "\u76F4\u8FDE"), import_react28.default.createElement("option", { value: "custom" }, "\u81EA\u5B9A\u4E49 Proxy"))),
    import_react28.default.createElement("label", null, "Proxy URL", import_react28.default.createElement("input", { value: draft.proxyUrl, onChange: (event) => setDraft({ ...draft, proxyUrl: event.target.value }), "aria-label": "Proxy URL" })),
    import_react28.default.createElement("label", null, "No Proxy", import_react28.default.createElement("input", { value: draft.noProxy, onChange: (event) => setDraft({ ...draft, noProxy: event.target.value }), "aria-label": "No Proxy" })),
    import_react28.default.createElement(
      "div",
      { className: "cpwb-settings-actions" },
      import_react28.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.updateNetwork(draft), "\u7F51\u7EDC\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF1B\u8FDB\u7A0B\u7EA7\u4EE3\u7406\u5C06\u5728\u4E0B\u6B21\u542F\u52A8\u751F\u6548\u3002"), disabled: saving }, "\u4FDD\u5B58\u7F51\u7EDC"),
      import_react28.default.createElement("button", { type: "button", onClick: () => run(() => store3.actions.testNetwork(draft), "\u5DF2\u5B8C\u6210\u5F53\u524D\u751F\u6548\u7F51\u7EDC\u6D4B\u8BD5\uFF1B\u81EA\u5B9A\u4E49\u914D\u7F6E\u5C06\u5728\u4E0B\u6B21\u542F\u52A8\u9A8C\u8BC1\u3002"), disabled: saving }, "\u6D4B\u8BD5\u5F53\u524D\u751F\u6548\u7F51\u7EDC")
    ),
    import_react28.default.createElement("p", null, `\u5F53\u524D\u751F\u6548\uFF1A${network.currentEffective?.mode || "inherit"}`),
    import_react28.default.createElement("p", null, `\u4E0B\u6B21\u542F\u52A8\uFF1A${network.nextLaunch?.mode || network.mode || "inherit"}`),
    import_react28.default.createElement("p", null, network.requiresRestart ? "\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u542F\u52A8\u751F\u6548\u3002" : "\u5F53\u524D\u8FDB\u7A0B\u5DF2\u4E0E\u4FDD\u5B58\u914D\u7F6E\u4E00\u81F4\u3002"),
    testResult ? import_react28.default.createElement("pre", { "data-network-result": true }, JSON.stringify(testResult)) : null,
    import_react28.default.createElement(ActionMessage, { message })
  );
}
function AuthPanel({ settings, store: store3 }) {
  const auth = settings.auth || {};
  const [message, setMessage] = import_react28.default.useState("");
  const [busy, setBusy] = import_react28.default.useState(false);
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
  return import_react28.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react28.default.createElement("span", { className: "cpwb-eyebrow" }, "CODEX LINK / LOCAL AUTH BRIDGE"),
    import_react28.default.createElement("h2", null, "Codex \u5FEB\u901F\u63A5\u5165"),
    import_react28.default.createElement(
      "div",
      { className: `cpwb-auth-state ${configured ? "cpwb-auth-online" : "cpwb-auth-offline"}` },
      import_react28.default.createElement("span", { className: "cpwb-auth-icon" }, configured ? import_react28.default.createElement(h, { size: 25, weight: "duotone", "aria-hidden": true }) : import_react28.default.createElement(n5, { size: 25, weight: "duotone", "aria-hidden": true })),
      import_react28.default.createElement(
        "div",
        null,
        import_react28.default.createElement("strong", null, configured ? "CODEX LINK / ONLINE" : "CODEX LINK / NOT CONNECTED"),
        import_react28.default.createElement("p", null, configured ? `\u51ED\u636E\u6765\u6E90\uFF1A${auth.source || "DSH credentials"}` : "\u626B\u63CF\u672C\u673A Codex \u767B\u5F55\u7F13\u5B58\uFF0C\u5E76\u5B89\u5168\u63A5\u5165\u5F53\u524D Workbench\u3002")
      )
    ),
    import_react28.default.createElement(
      "div",
      { className: "cpwb-auth-privacy" },
      import_react28.default.createElement(m9, { size: 17, weight: "regular", "aria-hidden": true }),
      import_react28.default.createElement("p", null, "\u626B\u63CF\u53EA\u5728\u70B9\u51FB\u540E\u53D1\u751F\u3002\u4EE4\u724C\u4E0D\u4F1A\u53D1\u9001\u5230\u6D4F\u89C8\u5668\u3001\u5199\u5165 Workbench \u6570\u636E\u5E93\u6216\u663E\u793A\u5728\u65E5\u5FD7\u4E2D\u3002")
    ),
    configured ? import_react28.default.createElement(
      "div",
      { className: "cpwb-settings-actions" },
      import_react28.default.createElement("button", { type: "button", onClick: test, disabled: busy }, busy ? "\u9A8C\u8BC1\u4E2D\u2026" : "\u9A8C\u8BC1\u672C\u5730\u51ED\u636E"),
      import_react28.default.createElement("span", { className: "cpwb-auth-activation" }, "NEXT REQUEST / ACTIVE")
    ) : import_react28.default.createElement(
      "button",
      { type: "button", className: "cpwb-auth-connect", onClick: connect, disabled: busy || auth.canConnect === false },
      busy ? import_react28.default.createElement(import_react28.default.Fragment, null, import_react28.default.createElement(m7, { size: 18, className: "cpwb-spin", "aria-hidden": true }), "\u6B63\u5728\u63A5\u5165\u2026") : import_react28.default.createElement(import_react28.default.Fragment, null, import_react28.default.createElement(n8, { size: 18, weight: "bold", "aria-hidden": true }), "\u626B\u63CF\u5E76\u63A5\u5165 Codex")
    ),
    auth.readOnly ? import_react28.default.createElement("p", null, "\u8BE5\u51ED\u636E\u7531\u542F\u52A8\u73AF\u5883\u63D0\u4F9B\uFF0C\u53EA\u8BFB\u4E14\u4F18\u5148\u4E8E\u672C\u5730\u51ED\u636E\u5E93\u3002") : null,
    auth.canConnect === false && !configured ? import_react28.default.createElement("p", { className: "cpwb-auth-unavailable" }, "\u5F53\u524D DSH credentials \u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u6267\u884C\u81EA\u52A8\u63A5\u5165\u3002") : null,
    import_react28.default.createElement(ActionMessage, { message })
  );
}
function WorkbenchPanel({ section, settings, store: store3 }) {
  if (section === "timezone") return import_react28.default.createElement(TimezonePanel, { settings, store: store3 });
  if (section === "automation") return import_react28.default.createElement(AutomationPromptsPanel, { settings, store: store3 });
  if (section === "embedding") return import_react28.default.createElement(EmbeddingPanel, { settings, store: store3 });
  if (section === "network") return import_react28.default.createElement(NetworkPanel, { settings, store: store3 });
  if (section === "auth") return import_react28.default.createElement(AuthPanel, { settings, store: store3 });
  return import_react28.default.createElement(
    "div",
    { className: "cpwb-settings-panel" },
    import_react28.default.createElement("span", { className: "cpwb-eyebrow" }, "HARNESS WORKBENCH"),
    import_react28.default.createElement("h2", null, "Workbench \u8BBE\u7F6E"),
    import_react28.default.createElement("p", null, "\u8FD9\u91CC\u662F Workbench \u81EA\u6709\u8BBE\u7F6E\u3002\u6A21\u578B\u3001\u63D2\u4EF6\u4E0E DSH credentials \u7EE7\u7EED\u7531\u539F\u751F DSH \u8BBE\u7F6E\u9875\u9762\u7BA1\u7406\u3002")
  );
}
function WorkbenchSettingsSection({ store: store3, initialActive = "workbench" }) {
  const [active, setActive] = import_react28.default.useState(initialActive);
  const subscribe = store3?.subscribe || (() => () => {
  });
  const getSnapshot = store3?.getSnapshot || (() => ({}));
  const snapshot = import_react28.default.useSyncExternalStore(subscribe, getSnapshot, getSnapshot) || {};
  const settings = snapshot.settings || {};
  import_react28.default.useEffect(() => {
    if (typeof store3?.actions?.loadSettings === "function") store3.actions.loadSettings().catch(() => {
    });
  }, [store3]);
  return import_react28.default.createElement(
    "section",
    { className: "cpwb-native-settings-section", "aria-label": "Harness Workbench \u8BBE\u7F6E" },
    import_react28.default.createElement(
      "header",
      { className: "cpwb-native-settings-header" },
      import_react28.default.createElement(
        "div",
        null,
        import_react28.default.createElement("span", { className: "cpwb-eyebrow" }, "HARNESS WORKBENCH / SYSTEM CONFIG"),
        import_react28.default.createElement("h2", null, "Workbench \u8BBE\u7F6E"),
        import_react28.default.createElement("p", null, "\u9879\u76EE\u5DE5\u4F5C\u53F0\u6269\u5C55\u8BBE\u7F6E\uFF1B\u6A21\u578B\u3001\u63D2\u4EF6\u548C Agent \u9884\u8BBE\u7EE7\u7EED\u7531\u5DE6\u4FA7\u539F\u751F\u5206\u7C7B\u7BA1\u7406\u3002")
      )
    ),
    import_react28.default.createElement(
      "nav",
      { className: "cpwb-settings-nav", "aria-label": "Workbench \u8BBE\u7F6E\u5206\u7C7B" },
      ...WORKBENCH_SECTIONS.map(([id, label]) => import_react28.default.createElement("button", { key: id, type: "button", className: active === id ? "cpwb-active" : "", onClick: () => setActive(id) }, label))
    ),
    import_react28.default.createElement("main", { className: "cpwb-settings-content" }, import_react28.default.createElement(WorkbenchPanel, { section: active, settings, store: store3 }))
  );
}

// src/client/settingsSlot.js
function registerWorkbenchSettingsSection(ctx, store3) {
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
        return { store: store3 };
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
var import_react30 = __toESM(require("react"), 1);
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
  const pickerRef = import_react30.default.useRef(null);
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
  return import_react30.default.createElement(
    import_react30.default.Fragment,
    null,
    import_react30.default.createElement("button", {
      type: "button",
      className: "cpwb-image-attachment-button",
      disabled: locked,
      title: "\u6DFB\u52A0\u56FE\u7247",
      "aria-label": "\u6DFB\u52A0\u56FE\u7247",
      onClick: choose
    }, import_react30.default.createElement(I, { size: 17, weight: "regular", "aria-hidden": true })),
    import_react30.default.createElement("input", {
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
var inject = ["slots", "layout", "workspaces", "sessions", "connection", "inputTriggers"];
function registerWorkbenchSettingsSection2(ctx, settingsStore = store2) {
  return registerWorkbenchSettingsSection(ctx, settingsStore);
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
  registerWorkbenchSettingsSection2(ctx);
  registerKnowledgeBaseReferenceSource(ctx, store2);
  registerImageAttachmentButton(ctx);
  registerModelIndicator(ctx);
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
        const openKnownSession = async function(sessionId) {
          const entry = store2.getSnapshot().workbenchSessions?.[sessionId];
          if (!entry?.scope) throw new Error("\u627E\u4E0D\u5230\u4F1A\u8BDD\u4E0A\u4E0B\u6587");
          const result = await store2.actions.openSession(sessionId);
          return openResult(result, entry.scope.kind === "project" ? entry.scope.id : null);
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
