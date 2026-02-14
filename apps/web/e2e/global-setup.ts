import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  console.log('Starting E2E test environment...');
});

afterAll(async () => {
  console.log('Cleaning up E2E test environment...');
});
