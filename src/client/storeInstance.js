/**
 * The singleton server-backed workbench store, created once against the real
 * cpwbApi. Components import { getStore } from here to avoid importing index.js
 * (which imports the components back — a cycle).
 */

import { createWorkbenchStore } from "./store.js";
import { cpwbApi } from "./api.js";

export const store = createWorkbenchStore(cpwbApi);

export function getStore() {
  return store;
}
