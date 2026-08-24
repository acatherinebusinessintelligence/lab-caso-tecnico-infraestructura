/**
 * @deprecated Prefer resolvePersistence from ./persistence/index.js
 * Kept as thin alias for imports existentes.
 */
import { createLocalStorageAdapter } from "./persistence/index.js";
import { LAB_CONFIG } from "../config/labConfig.js";

const local = createLocalStorageAdapter(LAB_CONFIG.storageKey);

export const storageAdapter = {
  get(key) {
    if (key && key !== LAB_CONFIG.storageKey) {
      try {
        return globalThis.localStorage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    }
    return local.get();
  },
  set(key, value) {
    if (key && key !== LAB_CONFIG.storageKey) {
      try {
        globalThis.localStorage?.setItem(key, value);
      } catch {
        /* ignore */
      }
      return;
    }
    local.set(value);
  },
  remove(key) {
    if (key && key !== LAB_CONFIG.storageKey) {
      try {
        globalThis.localStorage?.removeItem(key);
      } catch {
        /* ignore */
      }
      return;
    }
    local.remove();
  },
};
