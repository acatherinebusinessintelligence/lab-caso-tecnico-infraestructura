/**
 * PersistenceAdapter — la UI no conoce el backend de almacenamiento.
 */

export function createLocalStorageAdapter(storageKey) {
  return {
    kind: "localStorage",
    get() {
      try {
        return globalThis.localStorage?.getItem(storageKey) ?? null;
      } catch {
        return null;
      }
    },
    set(value) {
      try {
        globalThis.localStorage?.setItem(storageKey, value);
      } catch {
        /* cuota / privado */
      }
    },
    remove() {
      try {
        globalThis.localStorage?.removeItem(storageKey);
      } catch {
        /* ignore */
      }
    },
  };
}

/**
 * Memoria + objeto serializable para getCurrentState() de H5P.
 * previousState se inyecta al construir.
 */
export function createH5PStateAdapter(previousState = null) {
  let data = previousState && typeof previousState === "object" ? previousState : null;
  let warnOnce = false;
  return {
    kind: "h5p",
    get() {
      if (!data) return null;
      try {
        return JSON.stringify(data);
      } catch {
        return null;
      }
    },
    set(value) {
      try {
        data = typeof value === "string" ? JSON.parse(value) : value;
      } catch (err) {
        if (!warnOnce && typeof console !== "undefined") {
          warnOnce = true;
          // eslint-disable-next-line no-console
          console.warn("[lab] No se pudo persistir estado H5P; se mantiene el anterior.", err);
        }
      }
    },
    remove() {
      data = null;
    },
    /** Objeto vivo para getCurrentState() */
    getStateObject() {
      return data;
    },
    seed(stateObj) {
      data = stateObj && typeof stateObj === "object" ? stateObj : null;
    },
  };
}

export function createMemoryAdapter(initial = null) {
  let data = initial;
  return {
    kind: "memory",
    get() {
      return data == null ? null : typeof data === "string" ? data : JSON.stringify(data);
    },
    set(value) {
      data = value;
    },
    remove() {
      data = null;
    },
  };
}

/**
 * Elige adapter: H5P si hay previousState/forzar; si no, localStorage.
 */
export function resolvePersistence({ preferH5P = false, previousState = null, storageKey } = {}) {
  if (preferH5P || previousState != null) {
    return createH5PStateAdapter(previousState);
  }
  return createLocalStorageAdapter(storageKey);
}
