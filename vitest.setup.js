/**
 * Vitest global setup.
 *
 * happy-dom 20 exposes a `localStorage` getter on `window`, but under Node 22+
 * it resolves to `undefined` (Node ships a native, opt-in `localStorage` that
 * stays disabled without `--localstorage-file`, shadowing happy-dom's). The
 * composables under test rely on `window.localStorage`, so we install a small
 * in-memory implementation that works regardless of the Node/happy-dom combo.
 */

class MemoryStorage {
  #store = new Map();

  get length() {
    return this.#store.size;
  }

  clear() {
    this.#store.clear();
  }

  getItem(key) {
    const k = String(key);
    return this.#store.has(k) ? this.#store.get(k) : null;
  }

  setItem(key, value) {
    this.#store.set(String(key), String(value));
  }

  removeItem(key) {
    this.#store.delete(String(key));
  }

  key(index) {
    return Array.from(this.#store.keys())[index] ?? null;
  }
}

const storage = new MemoryStorage();
const descriptor = { value: storage, configurable: true, writable: true };

Object.defineProperty(globalThis, "localStorage", descriptor);
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", descriptor);
}
