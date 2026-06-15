import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 3 — Material Indents — Bill of Materials v2
// Route: /bill-of-materials
// APIs: POST create_bom_v2, DELETE delete_bom_v2, PUT update_bom_v2, GET get_bom_v2, GET get_bom_last_serial, GET get_bom_for_export, GET list_bom_v2

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 3 — Material Indents — Bill of Materials v2 — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/bill-of-materials', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bill of Materials v2', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 3 — Material Indents — Bill of Materials v2 — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/bill-of-materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add BOM' }).click();
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
      const _lbl = page.getByLabel('Prepared By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Prepared By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Prepared By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
      const _lbl = page.getByLabel('Drawing', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Is Variant?', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Notes', { exact: false }).fill(`ADD_NOTE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/bom/v2', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('bill_of_materials', { id: record?.id ?? null });
  });

  test('project_id — nonexistent reference rejected (API)', async ({ page }) => {
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/bom/v2/create', {
      data: { 'project_id': '00000000-0000-0000-0000-000000000000' },
    });
    expect(resp.ok()).toBe(false);
  });

  test('[project_id, drawing_id] — unique combination rejected', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx['bill_of_materials']) test.skip();
    await page.goto('/bill-of-materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add BOM' }).click();
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
      const _lbl = page.getByLabel('Prepared By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Prepared By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Prepared By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
      const _lbl = page.getByLabel('Drawing', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Is Variant?', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Notes', { exact: false }).fill(`ADD_NOTE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|combination|error/i)).toBeVisible({ timeout: 8000 });
  });

  test('update record with valid data', async ({ page }) => {

    await page.goto('/bill-of-materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add BOM' }).click();
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
      const _lbl = page.getByLabel('Prepared By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Prepared By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Prepared By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
      const _lbl = page.getByLabel('Drawing', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Is Variant?', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Notes', { exact: false }).fill(`ADD_NOTE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/bill-of-materials', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
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
      const _lbl = page.getByLabel('Drawing', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Is Variant?', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
      const _lbl = page.getByLabel('Is Final?', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Is Final?' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Is Final?' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Notes', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('[project_id, drawing_id] — unique_except_self: TODO', async () => {
    // '[project_id, drawing_id]' is auto-generated or a composite field — cannot test via form fill.
    test.skip();
  });

  test('delete record', async ({ page }) => {

    await page.goto('/bill-of-materials', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add BOM' }).click();
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
      const _lbl = page.getByLabel('Prepared By', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Prepared By' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Prepared By' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
      const _lbl = page.getByLabel('Drawing', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Drawing' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Drawing' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
    }
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    {
      const _lbl = page.getByLabel('Is Variant?', { exact: false });
      const _cbx = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('..').getByRole('combobox').first();
      const _btn = page.locator('label').filter({ hasText: 'Is Variant?' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
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
    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('option').first().click();
    await page.waitForTimeout(700); // cascade: let dependent fields update
    await page.getByLabel('Notes', { exact: false }).fill(`ADD_NOTE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/bill-of-materials', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
