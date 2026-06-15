import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 3 — Projects — Drawing No. Generation
// Route: /projects/drawings
// APIs: GET get_last_drawing_by_project_id, POST create_drawing, GET get_drawings_pg_list, GET get_drawings_ma_list, GET view_drawing, GET get_drawings, PUT update_drawing, GET get_drawings_by_project_id, GET get_last_drawing_serial_by_project, GET get_pgma_by_drawing_id

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 3 — Projects — Drawing No. Generation — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/projects/drawings', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Drawing No. Generation', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 3 — Projects — Drawing No. Generation — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/projects/drawings', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Drawing' }).click();
    {
      const _lbl = page.getByLabel('Drawing Type (+)', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing Type (+)' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing Type (+)' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'REFERENCE' }).first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Drawing Type (*)', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing Type (*)' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing Type (*)' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'SHOP FABRN ONLY' }).first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Product', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Product' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Product' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Drawing Code', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing Code' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing Code' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Drawing Size', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing Size' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing Size' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('IBR / NON IBR', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'IBR / NON IBR' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'IBR / NON IBR' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await page.getByRole('option', { name: 'IBR' }).first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Project', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Project' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Project' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Applicable PG by proj', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Applicable PG by proj' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Applicable PG by proj' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Applicable MA by proj', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Applicable MA by proj' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Applicable MA by proj' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Checked By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Checked By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Checked By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
      const _lbl = page.getByLabel('Prepared By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Prepared By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Prepared By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Drawn By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawn By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawn By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Description', { exact: false }).fill(`DESCRIPT_${T}`);
    await page.getByLabel('Revision Number', { exact: false }).fill(`${T}`);
    await page.getByLabel('Drg Release Date', { exact: false }).fill(`2026-01-01`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/drawings', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('drawings', { id: record?.id ?? null, 'drawing_number': record?.['drawing_number'] ?? null });
  });

  test('drawing_number — unique name rejected (API)', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx['drawings']?.['drawing_number']) test.skip();
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/drawings', {
      data: { 'drawing_number': ctx['drawings']['drawing_number'] },
    });
    expect(resp.ok()).toBe(false);
  });

  test('update record with valid data', async ({ page }) => {
    await page.goto('/projects/drawings', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
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
      const _lbl = page.getByLabel('Drawn By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawn By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawn By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Checked By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Checked By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Checked By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
    await page.getByLabel('Revision Number', { exact: false }).fill(`1`);
    await page.getByLabel('Revision Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Drawing Release Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Description', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });


});
