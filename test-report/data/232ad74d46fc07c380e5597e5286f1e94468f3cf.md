# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-tier1-raw-material-indents.spec.ts >> Tier 1 — Material Indents — Raw Material Indents — Data Set >> delete record
- Location: output/tests/01-tier1-raw-material-indents.spec.ts:66:7

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: 'Add', exact: true })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { readCtx, writeCtx } from './helpers/context';
  3  | 
  4  | // Tier 1 — Material Indents — Raw Material Indents
  5  | // Route: /raw-material-indents
  6  | // APIs: DELETE delete_raw_material_indent_list, PUT update_rmi_v2, POST create_rmi_v2, POST create_raw_material_indent, DELETE delete_raw_material_indent, GET get_raw_material_indent_by_project_id, GET get_raw_material_indent_list_items, GET get_raw_material_indent, POST create_raw_material_indent_list_item, GET get_applicable_pgma_list, GET get_raw_material_indent_by_id, GET get_rmi_list_items_with_details, DELETE delete_rmi_v2, GET list_rmi_v2, GET get_raw_material_indents, PUT update_raw_material_indent, GET get_last_rmi_serial_by_project, GET get_rmi_v2_edit, GET get_raw_material_indent_list, GET get_raw_material_indent_for_export, GET get_rmi_items_v2, GET get_rmi_v2
  7  | 
  8  | const T = String(Date.now()).slice(-6);
  9  | 
  10 | // ─── UI Render ────────────────────────────────────────────────────────────────
  11 | 
  12 | test.describe('Tier 1 — Material Indents — Raw Material Indents — UI renders', () => {
  13 |   test('UI renders', async ({ page }) => {
  14 |     await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
  15 |     await expect(page.locator('body')).toBeVisible();
  16 |     await expect(page.getByRole('heading', { name: 'Raw Material Indents', exact: false }).first()).toBeVisible({ timeout: 25000 });
  17 |   });
  18 | });
  19 | 
  20 | // ─── Data Set ─────────────────────────────────────────────────────────────────
  21 | 
  22 | test.describe('Tier 1 — Material Indents — Raw Material Indents — Data Set', () => {
  23 | 
  24 |   test('create record with valid data', async ({ page }) => {
  25 |     await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
  26 |     await page.getByRole('button', { name: 'Add' }).click();
  27 |     // no fillable fields — form may be auto-populated
  28 |     await page.getByRole('button', { name: 'Add', exact: true }).click();
  29 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  30 |     // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
  31 |     const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
  32 |     const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/raw-material-indent-list-items', {
  33 |       headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  34 |     });
  35 |     const list = await resp.json().catch(() => ({}));
  36 |     const rawData = list?.data?.data ?? list?.data ?? list;
  37 |     const found = Array.isArray(rawData) ? rawData : [];
  38 |     const record = found[0];
  39 |     writeCtx('raw_material_indent', { id: record?.id ?? null });
  40 |   });
  41 | 
  42 |   test('project_id — nonexistent reference rejected (API)', async ({ page }) => {
  43 |     const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/raw-material-indent/v2/create', {
  44 |       data: { 'project_id': '00000000-0000-0000-0000-000000000000' },
  45 |     });
  46 |     expect(resp.ok()).toBe(false);
  47 |   });
  48 | 
  49 |   test('update record with valid data', async ({ page }) => {
  50 | 
  51 |     await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
  52 |     await page.getByRole('button', { name: 'Add' }).click();
  53 |     // no fillable fields
  54 |     await page.getByRole('button', { name: 'Add', exact: true }).click();
  55 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  56 |     await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
  57 |     await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
  58 |     await page.getByRole('menuitem', { name: /edit/i }).first().click()
  59 |       .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
  60 |     // no editable non-unique fields
  61 |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  62 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  63 |   });
  64 | 
  65 | 
  66 |   test('delete record', async ({ page }) => {
  67 | 
  68 |     await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
  69 |     await page.getByRole('button', { name: 'Add' }).click();
  70 |     // no fillable fields
> 71 |     await page.getByRole('button', { name: 'Add', exact: true }).click();
     |                                                                  ^ Error: locator.click: Test ended.
  72 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  73 |     await page.goto('/raw-material-indents', { waitUntil: 'domcontentloaded' });
  74 |     await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
  75 |     await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
  76 |       .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
  77 |     await page.getByRole('button', { name: 'Delete', exact: true }).click();
  78 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  79 |   });
  80 | });
  81 | 
```