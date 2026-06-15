import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 4 — PMS Generation — PMS Generation
// Route: /pms-generation
// APIs: POST create_product_manufacturing_schedule, DELETE delete_product_manufacturing_schedule, GET list_product_manufacturing_schedule, PUT update_product_manufacturing_schedule, GET get_pms_bom_items_by_drawing, GET get_pdf_product_manufacturing_schedule, GET get_drawing_items_for_pms, GET get_pms_shipping_list, GET get_pms_drawing_index, GET get_pms_drawing_index_items, GET get_shipping_list_items, GET get_release_no_by_drawing_id, GET get_detail_product_manufacturing_schedule, GET get_pms_items_by_pms_id

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 4 — PMS Generation — PMS Generation — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/pms-generation', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'PMS Generation', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 4 — PMS Generation — PMS Generation — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/pms-generation', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add' }).click();
    // no fillable fields — form may be auto-populated
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/product-manufacturing-schedule', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('product_manufacturing_schedule', { id: record?.id ?? null });
  });

  test('project_id — nonexistent reference rejected (API)', async ({ page }) => {
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/product-manufacturing-schedule', {
      data: { 'project_id': '00000000-0000-0000-0000-000000000000' },
    });
    expect(resp.ok()).toBe(false);
  });

  test('drawing_id — nonexistent reference rejected (API)', async ({ page }) => {
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/product-manufacturing-schedule', {
      data: { 'drawing_id': '00000000-0000-0000-0000-000000000000' },
    });
    expect(resp.ok()).toBe(false);
  });

  test('customer_id — exceeds available rejected (API)', async ({ page }) => {
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/product-manufacturing-schedule', {
      data: { 'customer_id': 999999 },
    });
    expect(resp.ok()).toBe(false);
  });

  test('update record with valid data', async ({ page }) => {

    await page.goto('/pms-generation', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add' }).click();
    // no fillable fields
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/pms-generation', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    // no editable non-unique fields
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('pms_id — exceeds available rejected (API)', async ({ page }) => {
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/product-manufacturing-schedule', {
      data: { 'pms_id': 999999 },
    });
    expect(resp.ok()).toBe(false);
  });

  test('delete record', async ({ page }) => {

    await page.goto('/pms-generation', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add' }).click();
    // no fillable fields
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/pms-generation', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
