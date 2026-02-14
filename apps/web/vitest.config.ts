import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
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
      ],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
});
