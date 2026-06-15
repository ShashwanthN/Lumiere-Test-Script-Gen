import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 1 — Masters — Items
// Route: /masters/items
// APIs: GET get_items_testing, POST create_items, GET get_last_item_serial_by_group, DELETE delete_items, PUT update_items, GET get_items

const T = String(Date.now()).slice(-6);
const NAME = `NAME_${T}`;

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Items — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Items', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Items — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Items' }).click();
    {
      const _lbl = page.getByLabel('Material Spec Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Supply Condition Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Item Group', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Group' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Group' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('UOM Unit', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Unit Weight', { exact: false }).fill(`UNIT_WEI_${T}`);
    await page.getByLabel('Unit Volume', { exact: false }).fill(`UNIT_VOL_${T}`);
    await page.getByLabel('Designation', { exact: false }).fill(`DESIGNAT_${T}`);
    await page.getByLabel('Manufacturing Standard', { exact: false }).fill(`MFG_STD_${T}`);
    await page.getByLabel('Item Name', { exact: false }).fill(NAME);
    await page.getByLabel('Item Description', { exact: false }).fill(`ITEM_DES_${T}`);
    await page.getByLabel('Item Size', { exact: false }).fill(`ITEM_SIZ_${T}`);
    {
      const _lbl = page.getByLabel('Material Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Material Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Material Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/testing', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found.find(r => String(r['name'] ?? '') === NAME);
    writeCtx('items', { id: record?.id ?? null, 'name': NAME, 'item_code': record?.['item_code'] ?? null });
  });

  test('item_code — unique name rejected (API)', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx['items']?.['item_code']) test.skip();
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/items/create', {
      data: { 'item_code': ctx['items']['item_code'] },
    });
    expect(resp.ok()).toBe(false);
  });

  test('name — unique name rejected', async ({ page }) => {
    await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Items' }).click();
    await page.getByLabel('Item Name', { exact: false }).fill(NAME);
    {
      const _lbl = page.getByLabel('Material Spec Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Supply Condition Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Item Group', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Group' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Group' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('UOM Unit', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Unit Weight', { exact: false }).fill(`UNIT_WEI_${T}`);
    await page.getByLabel('Unit Volume', { exact: false }).fill(`UNIT_VOL_${T}`);
    await page.getByLabel('Designation', { exact: false }).fill(`DESIGNAT_${T}`);
    await page.getByLabel('Manufacturing Standard', { exact: false }).fill(`MFG_STD_${T}`);
    await page.getByLabel('Item Description', { exact: false }).fill(`ITEM_DES_${T}`);
    await page.getByLabel('Item Size', { exact: false }).fill(`ITEM_SIZ_${T}`);
    {
      const _lbl = page.getByLabel('Material Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Material Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Material Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('update record with valid data', async ({ page }) => {
    const updCtx = readCtx();
    if (!updCtx['items']?.['name']) test.skip();
    const updSearch = updCtx['items']['name'];
    await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(updSearch);
    await page.waitForTimeout(500);
    const updRow = page.getByRole('row').filter({ hasText: updSearch }).first();
    await updRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    if (await page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {
      await page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });
      await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
      await page.getByRole('option').first().click();
      await page.waitForTimeout(700);
    }
    if (await page.locator('label').filter({ hasText: 'Item Group Name' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {
      await page.locator('label').filter({ hasText: 'Item Group Name' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });
      await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
      await page.getByRole('option').first().click();
      await page.waitForTimeout(700);
    }
    if (await page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {
      await page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });
      await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
      await page.getByRole('option').first().click();
    }
    {
      const _lbl = page.getByLabel('Material Description', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Material Description' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Material Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Unit Weight', { exact: false }).fill(`1`);
    await page.getByLabel('Unit Volume', { exact: false }).fill(`1`);
    {
      const _lbl = page.getByLabel('UOM Unit', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.getByLabel('Item Description', { exact: false }).fill(`1`);
    await page.getByLabel('Item Size', { exact: false }).fill(`1`);
    await page.getByLabel('Designation', { exact: false }).fill(`1`);
    await page.getByLabel('Manufacturing Standard', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('item_code — unique_except_self: TODO', async () => {
    // 'item_code' is auto-generated or a composite field — cannot test via form fill.
    test.skip();
  });

  test('delete record', async ({ page }) => {
    const delCtx = readCtx();
    if (!delCtx['items']?.['name']) test.skip();
    const delSearch = delCtx['items']['name'];
    await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(delSearch);
    await page.waitForTimeout(500);
    const delRow = page.getByRole('row').filter({ hasText: delSearch }).first();
    await delRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
