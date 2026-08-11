import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["lib/lead-validation.ts", "app/api/leads/route.ts"],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
