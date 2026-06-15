import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 1 — Masters — Units Of Measurement
// Route: /masters/units-of-measurement
// APIs: POST create_uom, GET get_uom, PUT update_uom, DELETE delete_uom

const T = String(Date.now()).slice(-6);
const UOM_UNIT = `UOM_UNIT_${T}`;

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Units Of Measurement — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Units Of Measurement', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Units Of Measurement — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add UOM' }).click();
    await page.getByLabel('Unit', { exact: false }).fill(UOM_UNIT);
    await page.getByLabel('Symbol', { exact: false }).fill(`UOM_SYMB_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/uom', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found.find(r => String(r['uom_unit'] ?? '') === UOM_UNIT);
    writeCtx('uom', { id: record?.id ?? null, 'uom_unit': UOM_UNIT });
  });

  test('uom_unit — unique name rejected', async ({ page }) => {
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add UOM' }).click();
    await page.getByLabel('Unit', { exact: false }).fill(UOM_UNIT);
    await page.getByLabel('Symbol', { exact: false }).fill(`UOM_SYMB_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('update record with valid data', async ({ page }) => {
    const UPD_TRACK = `UPD_${T}`;
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add UOM' }).click();
    await page.getByLabel('Unit', { exact: false }).fill(UPD_TRACK);
    await page.getByLabel('Symbol', { exact: false }).fill(`UOM_SYMB_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(UPD_TRACK);
    await page.waitForTimeout(500);
    const updRow = page.getByRole('row').filter({ hasText: UPD_TRACK }).first();
    await updRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Symbol', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('uom_unit — unique_except_self: duplicate on update rejected', async ({ page }) => {
    const T2 = String(Date.now() + 1).slice(-6);
    const FIELD_T2 = `UOM_UNIT_${T2}`;
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add UOM' }).click();
    await page.getByLabel('Unit', { exact: false }).fill(`UOM_UNIT_${T2}`);
    await page.getByLabel('Symbol', { exact: false }).fill(`UOM_SYMB_${T2}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
    await page.waitForTimeout(500);
    const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
    await row2.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Unit', { exact: false }).clear();
    await page.getByLabel('Unit', { exact: false }).fill(UOM_UNIT);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('delete record', async ({ page }) => {
    const DEL_TRACK = `DEL_${T}`;
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add UOM' }).click();
    await page.getByLabel('Unit', { exact: false }).fill(DEL_TRACK);
    await page.getByLabel('Symbol', { exact: false }).fill(`UOM_SYMB_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/units-of-measurement', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(DEL_TRACK);
    await page.waitForTimeout(500);
    const delRow = page.getByRole('row').filter({ hasText: DEL_TRACK }).first();
    await delRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
