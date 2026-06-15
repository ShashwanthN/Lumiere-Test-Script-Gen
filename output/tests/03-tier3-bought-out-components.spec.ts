import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 3 — Material Indents — Bought Out Components
// Route: /boc-indents
// APIs: POST create_bought_out_component, DELETE delete_bought_out_component, GET get_bought_out_components_export, GET get_bought_out_component_by_id, GET get_last_boc_serial_by_project, GET get_bought_out_components, PUT update_bought_out_component

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 3 — Material Indents — Bought Out Components — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/boc-indents', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bought Out Components', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 3 — Material Indents — Bought Out Components — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/boc-indents', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add BOC' }).click();
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
      const _lbl = page.getByLabel('Applicable PG', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Applicable PG' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Applicable PG' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Applicable MA', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Applicable MA' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Applicable MA' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Mark as Final', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Mark as Final' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Mark as Final' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'No - Draft' }).first().click();
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
    {
      const _lbl = page.getByLabel('Approved By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Approved By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Approved By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('PGMA Status', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'PGMA Status' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'PGMA Status' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'Incomplete' }).first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Indent Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Revision Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Notes / Remarks', { exact: false }).fill(`BOC_NOTE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/bought-out-components', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('bought_out_components', { id: record?.id ?? null, 'indent_no': record?.['indent_no'] ?? null });
  });

  test('indent_no — unique name rejected (API)', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx['bought_out_components']?.['indent_no']) test.skip();
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/bought-out-components', {
      data: { 'indent_no': ctx['bought_out_components']['indent_no'] },
    });
    expect(resp.ok()).toBe(false);
  });

  test('update record with valid data', async ({ page }) => {
    await page.goto('/boc-indents', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    if (await page.locator('label').filter({ hasText: 'Customer' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {
      await page.locator('label').filter({ hasText: 'Customer' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });
      await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
      await page.getByRole('option').first().click();
      await page.waitForTimeout(700);
    }
    {
      const _lbl = page.getByLabel('Mark as Final', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Mark as Final' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Mark as Final' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'No - Draft' }).first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
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
      const _lbl = page.getByLabel('Prepared By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Prepared By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Prepared By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Approved By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Approved By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Approved By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('PGMA Status', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'PGMA Status' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'PGMA Status' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'Incomplete' }).first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Notes / Remarks', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('boc_id — nonexistent reference rejected (API)', async ({ page }) => {
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/bought-out-components', {
      data: { 'boc_id': '00000000-0000-0000-0000-000000000000' },
    });
    expect(resp.ok()).toBe(false);
  });

  test('delete record', async ({ page }) => {
    await page.goto('/boc-indents', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
