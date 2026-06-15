import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '*.spec.ts',
  use: {
    baseURL: 'https://dev.erp.eepc.coffeeinc.in',
  },
});
