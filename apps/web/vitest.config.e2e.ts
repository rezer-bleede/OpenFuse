import { defineConfig } from 'vitest/config';
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
    environment: 'happy-dom',
    include: ['e2e/**/*.spec.ts', 'e2e/**/*.spec.tsx'],
    setupFiles: ['./e2e/setup.ts'],
    globalSetup: './e2e/global-setup.ts',
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true }
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
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
  }
});
