import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 2 — Projects — Projects
// Route: /projects/list
// APIs: POST create_projects, DELETE delete_projects, PUT update_projects, GET get_projects

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 2 — Projects — Projects — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/projects/list', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Projects', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 2 — Projects — Projects — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/projects/list', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Project' }).click();
    {
      const _lbl = page.getByLabel('Customer', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Customer' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Customer' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Project Code', { exact: false }).fill(`PROJECT__${T}`);
    await page.getByLabel('Project Name', { exact: false }).fill(`PROJECT__${T}`);
    await page.getByLabel('Project Description', { exact: false }).fill(`PROJECT__${T}`);
    await page.getByLabel('Start Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('End Date', { exact: false }).fill(`2026-01-01`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/projects', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('projects', { id: record?.id ?? null, 'project_code': record?.['project_code'] ?? null });
  });

  test('project_code — unique name rejected', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx['projects']?.['project_code']) test.skip();
    await page.goto('/projects/list', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Project' }).click();
    await page.getByLabel('Project Code', { exact: false }).fill(ctx['projects']['project_code']);
    {
      const _lbl = page.getByLabel('Customer', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Customer' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Customer' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Project Name', { exact: false }).fill(`PROJECT__${T}`);
    await page.getByLabel('Project Description', { exact: false }).fill(`PROJECT__${T}`);
    await page.getByLabel('Start Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('End Date', { exact: false }).fill(`2026-01-01`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('update record with valid data', async ({ page }) => {
    await page.goto('/projects/list', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Project Description', { exact: false }).fill(`1`);
    await page.getByLabel('Start Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('End Date', { exact: false }).fill(`2026-01-01`);
    {
      const _lbl = page.getByLabel('Customer Name', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Customer Name' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Customer Name' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('project_code — unique_except_self: duplicate on update rejected', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx['projects']?.['project_code']) test.skip();
    const T2 = String(Date.now() + 1).slice(-6);
    const FIELD_T2 = `PROJECT__${T2}`;
    await page.goto('/projects/list', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Project' }).click();
    {
      const _lbl = page.getByLabel('Customer', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Customer' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Customer' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Project Code', { exact: false }).fill(`PROJECT__${T2}`);
    await page.getByLabel('Project Name', { exact: false }).fill(`PROJECT__${T2}`);
    await page.getByLabel('Project Description', { exact: false }).fill(`PROJECT__${T2}`);
    await page.getByLabel('Start Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('End Date', { exact: false }).fill(`2026-01-01`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/projects/list', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
    await page.waitForTimeout(500);
    const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
    await row2.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Project Code', { exact: false }).clear();
    await page.getByLabel('Project Code', { exact: false }).fill(ctx['projects']['project_code']);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('delete record', async ({ page }) => {
    await page.goto('/projects/list', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
