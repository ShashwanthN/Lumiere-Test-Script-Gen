import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 1 — Masters — Product Groups (PG)
// Route: /masters/product-groups
// APIs: POST create_pg_master, GET get_pg_master_by_project_id, PUT update_pg_master, DELETE delete_pg_master, GET get_pg_master

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Product Groups (PG) — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Product Groups (PG)', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Product Groups (PG) — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add PG' }).click();
    await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T}`);
    await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/pg_master', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('pg_master', { id: record?.id ?? null });
  });


  test('update record with valid data', async ({ page }) => {

    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add PG' }).click();
    await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T}`);
    await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('PG Code', { exact: false }).fill(`1`);
    await page.getByLabel('PG Description', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('pg_code — unique_except_self: duplicate on update rejected', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx['pg_master']?.['pg_code']) test.skip();
    const T2 = String(Date.now() + 1).slice(-6);
    const FIELD_T2 = `PG_CODE_${T2}`;
    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add PG' }).click();
    await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T2}`);
    await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T2}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
    await page.waitForTimeout(500);
    const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
    await row2.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('PG Code', { exact: false }).clear();
    await page.getByLabel('PG Code', { exact: false }).fill(ctx['pg_master']['pg_code']);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('delete record', async ({ page }) => {

    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add PG' }).click();
    await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T}`);
    await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
