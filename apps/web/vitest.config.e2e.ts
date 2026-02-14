import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    include: ['e2e/**/*.spec.ts'],
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
      ],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
});
