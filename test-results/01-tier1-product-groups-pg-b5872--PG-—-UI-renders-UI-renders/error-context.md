# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-tier1-product-groups-pg.spec.ts >> Tier 1 — Masters — Product Groups (PG) — UI renders >> UI renders
- Location: output/tests/01-tier1-product-groups-pg.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Product Groups (PG)' }).first()
Expected: visible
Timeout: 25000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 25000ms
  - waiting for getByRole('heading', { name: 'Product Groups (PG)' }).first()

```

```yaml
- region "Notifications alt+T"
- img "EEPC ERP"
- text: EEPC ERP PMS / SL System Platform
- list:
  - listitem:
    - link "Home":
      - /url: /
  - listitem:
    - button "Masters" [expanded]
    - list:
      - listitem:
        - link "Materials":
          - /url: /masters/materials
      - listitem:
        - link "Units Of Measurement":
          - /url: /masters/units-of-measurement
      - listitem:
        - link "Items":
          - /url: /masters/items
      - listitem:
        - link "Item Groups":
          - /url: /masters/item-groups
      - listitem:
        - link "Item Classes":
          - /url: /masters/item-classes
      - listitem:
        - link "Material Specifications":
          - /url: /masters/material-specifications
      - listitem:
        - link "Drawing Categories":
          - /url: /masters/drawing-categories
      - listitem:
        - link "Drawing Sizes":
          - /url: /masters/drawing-sizes
      - listitem:
        - link "Product Groups (PG)":
          - /url: /masters/product-groups
      - listitem:
        - link "PGMA":
          - /url: /masters/pgma
  - listitem:
    - link "Employees":
      - /url: /employees
  - listitem:
    - link "Customers":
      - /url: /customers
  - listitem:
    - button "Projects"
  - listitem:
    - button "Material Indents"
  - listitem:
    - link "PMS Generation":
      - /url: /pms-generation
  - listitem:
    - link "Adeos Document Intelligence":
      - /url: /adeos_document_intelligence
  - listitem:
    - button "Admin"
  - listitem:
    - button "Settings"
- list:
  - listitem:
    - button "CS Coffee Super Admin coffee@coffeeinc.in"
- button "Toggle Sidebar"
- main:
  - button "Toggle Sidebar"
  - navigation "breadcrumb":
    - list:
      - listitem:
        - link "Masters" [disabled]
      - listitem:
        - link "Product Groups" [disabled]
  - heading "Product Groups" [level=3]
  - paragraph: Manage your Product Groups here
  - button "Add PG"
  - textbox "Search..."
  - button "View"
  - table:
    - rowgroup:
      - row "Select all PG Code PG Description Actions":
        - columnheader "Select all":
          - checkbox "Select all"
        - columnheader "PG Code":
          - button "PG Code"
        - columnheader "PG Description":
          - button "PG Description"
        - columnheader "Actions"
    - rowgroup:
      - row "Select row 00 BOILER-GENERAL Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "00"
        - cell "BOILER-GENERAL"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 01 BOILER-STRUCTURES Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "01"
        - cell "BOILER-STRUCTURES"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 02 BOILER-ECONOMISER Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "02"
        - cell "BOILER-ECONOMISER"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 03 BOILER-DRUM Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "03"
        - cell "BOILER-DRUM"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 04 BOILER-FURNACE Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "04"
        - cell "BOILER-FURNACE"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 05 BOILER-SUPER HEATER Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "05"
        - cell "BOILER-SUPER HEATER"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 06 BOILER-PIPINGS Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "06"
        - cell "BOILER-PIPINGS"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 07 BOILER-AIR SYSTEM Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "07"
        - cell "BOILER-AIR SYSTEM"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 08 BOILER-FLUE GAS SYSTEM Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "08"
        - cell "BOILER-FLUE GAS SYSTEM"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 09 BOILER-FUEL FEEDING SYSTEM Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "09"
        - cell "BOILER-FUEL FEEDING SYSTEM"
        - cell "Open menu":
          - button "Open menu"
  - text: 0 of 84 row(s) selected.
  - paragraph: Rows per page
  - combobox: "10"
  - text: Page 1 of 9
  - button "Go to first page" [disabled]
  - button "Go to previous page" [disabled]
  - button "Go to next page"
  - button "Go to last page"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { readCtx, writeCtx } from './helpers/context';
  3   | 
  4   | // Tier 1 — Masters — Product Groups (PG)
  5   | // Route: /masters/product-groups
  6   | // APIs: POST create_pg_master, GET get_pg_master_by_project_id, PUT update_pg_master, DELETE delete_pg_master, GET get_pg_master
  7   | 
  8   | const T = String(Date.now()).slice(-6);
  9   | 
  10  | // ─── UI Render ────────────────────────────────────────────────────────────────
  11  | 
  12  | test.describe('Tier 1 — Masters — Product Groups (PG) — UI renders', () => {
  13  |   test('UI renders', async ({ page }) => {
  14  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  15  |     await expect(page.locator('body')).toBeVisible();
> 16  |     await expect(page.getByRole('heading', { name: 'Product Groups (PG)', exact: false }).first()).toBeVisible({ timeout: 25000 });
      |                                                                                                    ^ Error: expect(locator).toBeVisible() failed
  17  |   });
  18  | });
  19  | 
  20  | // ─── Data Set ─────────────────────────────────────────────────────────────────
  21  | 
  22  | test.describe('Tier 1 — Masters — Product Groups (PG) — Data Set', () => {
  23  | 
  24  |   test('create record with valid data', async ({ page }) => {
  25  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  26  |     await page.getByRole('button', { name: 'Add PG' }).click();
  27  |     await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T}`);
  28  |     await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T}`);
  29  |     await page.getByRole('button', { name: 'Add', exact: true }).click();
  30  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  31  |     // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
  32  |     const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
  33  |     const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/pg_master', {
  34  |       headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  35  |     });
  36  |     const list = await resp.json().catch(() => ({}));
  37  |     const rawData = list?.data?.data ?? list?.data ?? list;
  38  |     const found = Array.isArray(rawData) ? rawData : [];
  39  |     const record = found[0];
  40  |     writeCtx('pg_master', { id: record?.id ?? null });
  41  |   });
  42  | 
  43  | 
  44  |   test('update record with valid data', async ({ page }) => {
  45  | 
  46  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  47  |     await page.getByRole('button', { name: 'Add PG' }).click();
  48  |     await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T}`);
  49  |     await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T}`);
  50  |     await page.getByRole('button', { name: 'Add', exact: true }).click();
  51  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  52  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  53  |     await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
  54  |     await page.getByRole('menuitem', { name: /edit/i }).first().click()
  55  |       .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
  56  |     await page.getByLabel('PG Code', { exact: false }).fill(`1`);
  57  |     await page.getByLabel('PG Description', { exact: false }).fill(`1`);
  58  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  59  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  60  |   });
  61  | 
  62  |   test('pg_code — unique_except_self: duplicate on update rejected', async ({ page }) => {
  63  |     const ctx = readCtx();
  64  |     if (!ctx['pg_master']?.['pg_code']) test.skip();
  65  |     const T2 = String(Date.now() + 1).slice(-6);
  66  |     const FIELD_T2 = `PG_CODE_${T2}`;
  67  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  68  |     await page.getByRole('button', { name: 'Add PG' }).click();
  69  |     await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T2}`);
  70  |     await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T2}`);
  71  |     await page.getByRole('button', { name: 'Add', exact: true }).click();
  72  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  73  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  74  |     await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
  75  |     await page.waitForTimeout(500);
  76  |     const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
  77  |     await row2.getByRole('button').first().click();
  78  |     await page.getByRole('menuitem', { name: /edit/i }).first().click()
  79  |       .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
  80  |     await page.getByLabel('PG Code', { exact: false }).clear();
  81  |     await page.getByLabel('PG Code', { exact: false }).fill(ctx['pg_master']['pg_code']);
  82  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  83  |     await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  84  |   });
  85  | 
  86  |   test('delete record', async ({ page }) => {
  87  | 
  88  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  89  |     await page.getByRole('button', { name: 'Add PG' }).click();
  90  |     await page.getByLabel('PG Code', { exact: false }).fill(`PG_CODE_${T}`);
  91  |     await page.getByLabel('PG Description', { exact: false }).fill(`PG_DESCR_${T}`);
  92  |     await page.getByRole('button', { name: 'Add', exact: true }).click();
  93  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  94  |     await page.goto('/masters/product-groups', { waitUntil: 'domcontentloaded' });
  95  |     await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
  96  |     await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
  97  |       .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
  98  |     await page.getByRole('button', { name: 'Delete', exact: true }).click();
  99  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  100 |   });
  101 | });
  102 | 
```