import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 1 — Material Indents — Raw Material Indents
// Route: /raw-material-indents
// APIs: DELETE delete_raw_material_indent_list, PUT update_rmi_v2, POST create_rmi_v2, POST create_raw_material_indent, DELETE delete_raw_material_indent, GET get_raw_material_indent_by_project_id, GET get_raw_material_indent_list_items, GET get_raw_material_indent, POST create_raw_material_indent_list_item, GET get_applicable_pgma_list, GET get_raw_material_indent_by_id, GET get_rmi_list_items_with_details, DELETE delete_rmi_v2, GET list_rmi_v2, GET get_raw_material_indents, PUT update_raw_material_indent, GET get_last_rmi_serial_by_project, GET get_rmi_v2_edit, GET get_raw_material_indent_list, GET get_raw_material_indent_for_export, GET get_rmi_items_v2, GET get_rmi_v2

const T = String(Date.now()).slice(-6);

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Material Indents — Raw Material Indents — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Raw Material Indents', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Material Indents — Raw Material Indents — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add' }).click();
    // no fillable fields — form may be auto-populated
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/raw-material-indent-list-items', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found[0];
    writeCtx('raw_material_indent', { id: record?.id ?? null });
  });

  test('project_id — nonexistent reference rejected (API)', async ({ page }) => {
    const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/raw-material-indent/v2/create', {
      data: { 'project_id': '00000000-0000-0000-0000-000000000000' },
    });
    expect(resp.ok()).toBe(false);
  });

  test('update record with valid data', async ({ page }) => {

    await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add' }).click();
    // no fillable fields
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    // no editable non-unique fields
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });


  test('delete record', async ({ page }) => {

    await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add' }).click();
    // no fillable fields
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
