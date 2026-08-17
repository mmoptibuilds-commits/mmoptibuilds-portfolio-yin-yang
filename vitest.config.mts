import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    // Only unit tests. The browser-driven suites (a11y, keyboard, responsive,
    // bundle) run against a real production server via scripts/ and are wired
    // up as separate npm scripts, because they need a build to be meaningful.
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
