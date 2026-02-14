import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    exclude: ["e2e/**"],
    coverage: {
      provider: 'v8',
      reporter: ["text", "lcov"],
      exclude: [
        'node_modules/',
        'e2e/',
        'test/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/config/**',
        '**/dist/**'
      ]
    }
  },
});
