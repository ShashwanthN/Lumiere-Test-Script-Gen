import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  globalSetup: './global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 120000,
  reporter: [
    ['html', { outputFolder: '../../test-report', open: 'never' }],
    ['json', { outputFile: '../../test-report/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://dev.erp.eepc.coffeeinc.in',
    storageState: 'storageState.json',
    actionTimeout: 15000,
    navigationTimeout: 90000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
    },
  },
  outputDir: '../../test-results',
});
