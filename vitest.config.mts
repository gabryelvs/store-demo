import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Cart logic is pure; jsdom is only needed for the storage tests.
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
