import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 1 — Masters — Materials
// Route: /masters/materials
// APIs: POST create_material, PUT update_materials, GET get_materials_id, DELETE delete_materials, GET get_materials

const T = String(Date.now()).slice(-6);
const MATERIAL_COD = `MATERIAL_${T}`;

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Materials — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Materials', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Materials — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Material' }).click();
    await page.getByLabel('Material Code', { exact: false }).fill(MATERIAL_COD);
    await page.getByLabel('Material Description', { exact: false }).fill(`MATERIAL_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/materials', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found.find(r => String(r['material_code'] ?? '') === MATERIAL_COD);
    writeCtx('materials', { id: record?.id ?? null, 'material_code': MATERIAL_COD });
  });

  test('material_code — unique name rejected', async ({ page }) => {
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Material' }).click();
    await page.getByLabel('Material Code', { exact: false }).fill(MATERIAL_COD);
    await page.getByLabel('Material Description', { exact: false }).fill(`MATERIAL_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('update record with valid data', async ({ page }) => {
    const UPD_TRACK = `UPD_${T}`;
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Material' }).click();
    await page.getByLabel('Material Code', { exact: false }).fill(UPD_TRACK);
    await page.getByLabel('Material Description', { exact: false }).fill(`MATERIAL_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(UPD_TRACK);
    await page.waitForTimeout(500);
    const updRow = page.getByRole('row').filter({ hasText: UPD_TRACK }).first();
    await updRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Material Description', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('material_code — unique_except_self: duplicate on update rejected', async ({ page }) => {
    const T2 = String(Date.now() + 1).slice(-6);
    const FIELD_T2 = `MATERIAL_${T2}`;
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Material' }).click();
    await page.getByLabel('Material Code', { exact: false }).fill(`MATERIAL_${T2}`);
    await page.getByLabel('Material Description', { exact: false }).fill(`MATERIAL_${T2}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
    await page.waitForTimeout(500);
    const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
    await row2.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Material Code', { exact: false }).clear();
    await page.getByLabel('Material Code', { exact: false }).fill(MATERIAL_COD);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('delete record', async ({ page }) => {
    const DEL_TRACK = `DEL_${T}`;
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Material' }).click();
    await page.getByLabel('Material Code', { exact: false }).fill(DEL_TRACK);
    await page.getByLabel('Material Description', { exact: false }).fill(`MATERIAL_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/materials', { waitUntil: 'domcontentloaded' });
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
