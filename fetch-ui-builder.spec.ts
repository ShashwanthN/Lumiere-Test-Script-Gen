import { test, expect } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const EMAIL = process.env.EMAIL || 'coffee@coffeeinc.in';
const PASSWORD = process.env.PASSWORD || 'Kafka@shore25';
const API_BASE = 'https://api.dev.erp.eepc.coffeeinc.in';
const OUT = join(__dirname, 'output', 'ui-builder');

test('fetch all UI screens and components', async ({ page }) => {
  mkdirSync(OUT, { recursive: true });

  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill(EMAIL);
  await page.getByPlaceholder('Enter your password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Welcome back!')).toBeVisible({ timeout: 15000 });

  await page.goto('/admin/screens');
  await expect(page.getByText('Manage your application screens')).toBeVisible({ timeout: 15000 });

  const [screensResp, groupedResp] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/screens?skip=') && r.status() === 200),
    page.waitForResponse(r => r.url().includes('/screens/grouped') && r.status() === 200),
  ]);

  const screens = await screensResp.json();
  const grouped = await groupedResp.json();

  const components = {};
  for (const s of screens) {
    const resp = await page.request.get(`${API_BASE}/screens/${s.id}/components`);
    components[s.id] = await resp.json();
  }

  const output = {
    generatedAt: new Date().toISOString(),
    totalScreens: screens.length,
    totalGroups: grouped.groups.length,
    groups: grouped.groups.map(g => ({
      group: g.title,
      icon: g.icon,
      position: g.position,
      screens: g.screens.map(s => ({
        name: s.name,
        route: s.route,
        description: s.description,
        isPublished: s.is_published,
        isMenu: s.is_menu,
        menuPosition: s.menu_position,
        menuIcon: s.menu_icon,
        moduleId: s.module_id,
        screenId: s.id,
        componentCount: (components[s.id] || []).length,
        components: components[s.id] || [],
      })),
    })),
  };

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const tsDir = join(OUT, ts);
  const latestDir = join(OUT, 'latest');
  mkdirSync(tsDir, { recursive: true });
  mkdirSync(latestDir, { recursive: true });

  writeFileSync(join(tsDir, 'screens-list.json'), JSON.stringify(screens, null, 2));
  writeFileSync(join(tsDir, 'screens-grouped.json'), JSON.stringify(grouped, null, 2));
  writeFileSync(join(tsDir, 'screens-components.json'), JSON.stringify(components, null, 2));
  writeFileSync(join(tsDir, 'ui-builder-export.json'), JSON.stringify(output, null, 2));

  writeFileSync(join(latestDir, 'screens-list.json'), JSON.stringify(screens, null, 2));
  writeFileSync(join(latestDir, 'screens-grouped.json'), JSON.stringify(grouped, null, 2));
  writeFileSync(join(latestDir, 'screens-components.json'), JSON.stringify(components, null, 2));
  writeFileSync(join(latestDir, 'ui-builder-export.json'), JSON.stringify(output, null, 2));

  console.log(`Exported ${screens.length} screens → output/ui-builder/${ts}/`);
  for (const g of output.groups) {
    console.log(`  ${g.group}: ${g.screens.map(s => s.name).join(', ')}`);
  }
});
