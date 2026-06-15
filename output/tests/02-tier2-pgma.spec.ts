import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 2 — Masters — PGMA
// Route: /masters/pgma
// APIs: POST create_pgma_master, DELETE delete_pgma_master, PUT update_pgma_master, GET get_pgma_master, GET get_pgma_master_by_project_id

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 2 — Masters — PGMA — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/masters/pgma', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'PGMA', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 2 — Masters — PGMA — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/masters/pgma', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add PGMA' }).click();
    await page.getByLabel('MA Code', { exact: false }).fill(`MA_CODE_${T}`);
    await page.getByLabel('MA Description', { exact: false }).fill(`MA_DESCR_${T}`);
    {
      const _lbl = page.getByLabel('Category Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Category Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Category Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    {
      const _lbl = page.getByLabel('PG Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'PG Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'PG Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/pgma-master', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('pgma_master', { id: record?.id ?? null });
  });


  test('update record with valid data', async ({ page }) => {

    await page.goto('/masters/pgma', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add PGMA' }).click();
    await page.getByLabel('MA Code', { exact: false }).fill(`MA_CODE_${T}`);
    await page.getByLabel('MA Description', { exact: false }).fill(`MA_DESCR_${T}`);
    {
      const _lbl = page.getByLabel('Category Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Category Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Category Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    {
      const _lbl = page.getByLabel('PG Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'PG Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'PG Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/pgma', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    {
      const _lbl = page.getByLabel('Category Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Category Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Category Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    {
      const _lbl = page.getByLabel('PG Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'PG Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'PG Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByLabel('MA Code', { exact: false }).fill(`1`);
    await page.getByLabel('MA Description', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });


  test('delete record', async ({ page }) => {

    await page.goto('/masters/pgma', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add PGMA' }).click();
    await page.getByLabel('MA Code', { exact: false }).fill(`MA_CODE_${T}`);
    await page.getByLabel('MA Description', { exact: false }).fill(`MA_DESCR_${T}`);
    {
      const _lbl = page.getByLabel('Category Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Category Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Category Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    {
      const _lbl = page.getByLabel('PG Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'PG Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'PG Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/pgma', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
