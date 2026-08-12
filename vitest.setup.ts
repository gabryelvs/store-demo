// jsdom 30 under Vitest 4 does not expose `localStorage` on `window` or
// `globalThis`, and Node's own `localStorage` is gated behind the
// `--localstorage-file` flag, so it isn't usable here either. Install a
// minimal in-memory `Storage` implementation so cart persistence code
// (which reads `window.localStorage`) and tests (which read the bare
// global) both resolve to the same store.

// Present in real browsers — this guards against double-installing if a
// future jsdom/Node version starts providing one natively.
if (typeof globalThis.localStorage === "undefined") {
  const store: Record<string, string> = {};

  const storage: Storage = {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key in store) {
        delete store[key];
      }
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };

  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
    enumerable: true,
  });

  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
    enumerable: true,
  });
}
