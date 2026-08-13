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
      include: [
        "lib/lead-validation.ts",
        "lib/i18n.ts",
        "lib/content.ts",
        "lib/blog.ts",
        "lib/rich-text.ts",
        "lib/supabase-key.ts",
        "lib/structured-data.ts",
        "app/api/leads/route.ts",
      ],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
});
