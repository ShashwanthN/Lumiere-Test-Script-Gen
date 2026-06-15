import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 2 — Projects — Applicable PGMA
// Route: /projects/applicable-pgma
// APIs: POST create_applicable_pgma, GET get_applicable_pgma, GET get_applicable_pgma_by_project_id, GET get_applicable_pgma_list_by_project, GET get_list_of_ma_code_by_pg_code, GET get_pgma_by_project_id

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 2 — Projects — Applicable PGMA — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/projects/applicable-pgma', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Applicable PGMA', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 2 — Projects — Applicable PGMA — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/projects/applicable-pgma', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add' }).click();
    {
      const _lbl = page.getByLabel('Select Project', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Select Project' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Select Project' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Is Final?', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Is Final?' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Is Final?' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'YES' }).first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Prepared By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Prepared By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Prepared By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Remarks', { exact: false }).fill(`REMARKS_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/applicable-pgma', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('applicable_pgma', { id: record?.id ?? null });
  });




});
