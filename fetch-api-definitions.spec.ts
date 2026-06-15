import { test, expect } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const EMAIL = process.env.EMAIL || 'coffee@coffeeinc.in';
const PASSWORD = process.env.PASSWORD || 'Kafka@shore25';
const OUT = join(__dirname, 'output', 'api-builder');

test('fetch all API definitions and modules', async ({ page }) => {
  mkdirSync(OUT, { recursive: true });

  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill(EMAIL);
  await page.getByPlaceholder('Enter your password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Welcome back!')).toBeVisible({ timeout: 15000 });

  await page.goto('/admin/backend-builder');
  await expect(page.getByText('Manage dynamic API definitions')).toBeVisible({ timeout: 15000 });

  const [apiDefResponse, modulesResponse] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api-definitions') && r.status() === 200),
    page.waitForResponse(r => r.url().includes('/modules') && r.status() === 200),
  ]);

  const apiDefs = await apiDefResponse.json();
  const modules = await modulesResponse.json();

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const tsDir = join(OUT, ts);
  const latestDir = join(OUT, 'latest');
  mkdirSync(tsDir, { recursive: true });
  mkdirSync(latestDir, { recursive: true });

  writeFileSync(join(tsDir, 'api-definitions.json'), JSON.stringify(apiDefs, null, 2));
  writeFileSync(join(tsDir, 'modules.json'), JSON.stringify(modules, null, 2));
  writeFileSync(join(latestDir, 'api-definitions.json'), JSON.stringify(apiDefs, null, 2));
  writeFileSync(join(latestDir, 'modules.json'), JSON.stringify(modules, null, 2));

  console.log(`Exported ${apiDefs.length} API definitions → output/api-builder/${ts}/`);
  console.log(`Exported ${modules.length} modules → output/api-builder/${ts}/`);
});
