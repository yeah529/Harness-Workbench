import { WorkbenchSettingsSection } from "./SettingsSection.js";

/**
 * Register the Workbench contribution in the native settings section list.
 * The DSH settings plugin owns sidebar.settings and its child declarations;
 * this module deliberately contributes no children and no replacement shell.
 */
export function registerWorkbenchSettingsSection(ctx, store) {
  if (!ctx?.slots?.inject || !ctx?.slots?.register) {
    throw new TypeError("settings section registration requires the DSH slots service");
  }
  return ctx.slots.inject("settings.section", function () {
    return ctx.slots.register({
      name: "settings.section",
      id: "cpwb-workbench-settings",
      order: 20,
      label: "Workbench",
      inject: function () {
        return { store };
      },
    }, WorkbenchSettingsSection);
  });
}
