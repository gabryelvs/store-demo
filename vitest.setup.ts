import { beforeEach } from "vitest";

// Ensure localStorage is available in jsdom
if (typeof window !== "undefined" && !window.localStorage) {
  const storage: Record<string, string> = {};

  window.localStorage = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => {
      storage[key] = String(value);
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      for (const key in storage) {
        delete storage[key];
      }
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: (index: number) => {
      const keys = Object.keys(storage);
      return keys[index] ?? null;
    },
  } as Storage;
}
