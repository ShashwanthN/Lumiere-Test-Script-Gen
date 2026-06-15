import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 1 — Masters — Item Groups
// Route: /masters/item-groups
// APIs: POST create_item_groups, DELETE delete_item_groups, GET get_item_groups, PUT update_item_groups

const T = String(Date.now()).slice(-6);
const ITEM_GROUP_C = `ITEM_GRO_${T}`;

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Item Groups — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Item Groups', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Masters — Item Groups — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Item Groups' }).click();
    {
      const _lbl = page.getByLabel('Item Class', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Class' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Class' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Group Code', { exact: false }).fill(ITEM_GROUP_C);
    await page.getByLabel('Group Name', { exact: false }).fill(`ITEM_GRO_${T}`);
    await page.getByLabel('Size 1 Label', { exact: false }).fill(`SIZE_1_L_${T}`);
    await page.getByLabel('Size 2 Label', { exact: false }).fill(`SIZE_2_L_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/item-groups', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found.find(r => String(r['item_group_code'] ?? '') === ITEM_GROUP_C);
    writeCtx('item_groups', { id: record?.id ?? null, 'item_group_code': ITEM_GROUP_C });
  });

  test('item_group_code — unique name rejected', async ({ page }) => {
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Item Groups' }).click();
    await page.getByLabel('Group Code', { exact: false }).fill(ITEM_GROUP_C);
    {
      const _lbl = page.getByLabel('Item Class', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Class' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Class' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Group Name', { exact: false }).fill(`ITEM_GRO_${T}`);
    await page.getByLabel('Size 1 Label', { exact: false }).fill(`SIZE_1_L_${T}`);
    await page.getByLabel('Size 2 Label', { exact: false }).fill(`SIZE_2_L_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('update record with valid data', async ({ page }) => {
    const UPD_TRACK = `UPD_${T}`;
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Item Groups' }).click();
    {
      const _lbl = page.getByLabel('Item Class', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Class' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Class' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Group Code', { exact: false }).fill(UPD_TRACK);
    await page.getByLabel('Group Name', { exact: false }).fill(`ITEM_GRO_${T}`);
    await page.getByLabel('Size 1 Label', { exact: false }).fill(`SIZE_1_L_${T}`);
    await page.getByLabel('Size 2 Label', { exact: false }).fill(`SIZE_2_L_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(UPD_TRACK);
    await page.waitForTimeout(500);
    const updRow = page.getByRole('row').filter({ hasText: UPD_TRACK }).first();
    await updRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    {
      const _lbl = page.getByLabel('Item Class', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Class' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Class' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Group Name', { exact: false }).fill(`1`);
    await page.getByLabel('Size 1 Label', { exact: false }).fill(`1`);
    await page.getByLabel('Size 2 Label', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('item_group_code — unique_except_self: duplicate on update rejected', async ({ page }) => {
    const T2 = String(Date.now() + 1).slice(-6);
    const FIELD_T2 = `ITEM_GRO_${T2}`;
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Item Groups' }).click();
    {
      const _lbl = page.getByLabel('Item Class', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Class' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Class' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Group Code', { exact: false }).fill(`ITEM_GRO_${T2}`);
    await page.getByLabel('Group Name', { exact: false }).fill(`ITEM_GRO_${T2}`);
    await page.getByLabel('Size 1 Label', { exact: false }).fill(`SIZE_1_L_${T2}`);
    await page.getByLabel('Size 2 Label', { exact: false }).fill(`SIZE_2_L_${T2}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
    await page.waitForTimeout(500);
    const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
    await row2.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Group Code', { exact: false }).clear();
    await page.getByLabel('Group Code', { exact: false }).fill(ITEM_GROUP_C);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('delete record', async ({ page }) => {
    const DEL_TRACK = `DEL_${T}`;
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Item Groups' }).click();
    {
      const _lbl = page.getByLabel('Item Class', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Item Class' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Item Class' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Group Code', { exact: false }).fill(DEL_TRACK);
    await page.getByLabel('Group Name', { exact: false }).fill(`ITEM_GRO_${T}`);
    await page.getByLabel('Size 1 Label', { exact: false }).fill(`SIZE_1_L_${T}`);
    await page.getByLabel('Size 2 Label', { exact: false }).fill(`SIZE_2_L_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/masters/item-groups', { waitUntil: 'domcontentloaded' });
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
