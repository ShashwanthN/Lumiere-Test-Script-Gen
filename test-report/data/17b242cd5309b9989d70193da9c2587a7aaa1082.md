# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-tier1-material-specifications.spec.ts >> Tier 1 — Masters — Material Specifications — UI renders >> UI renders
- Location: output/tests/01-tier1-material-specifications.spec.ts:14:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Material Specifications' }).first()
Expected: visible
Timeout: 25000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 25000ms
  - waiting for getByRole('heading', { name: 'Material Specifications' }).first()

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
        - link "Material Specifications" [disabled]
  - heading "Material Specification" [level=3]
  - paragraph: View material specifications and their descriptions
  - button "Add Material Spec"
  - textbox "Search..."
  - button "View"
  - table:
    - rowgroup:
      - row "Select all Material Spec code Material Spec description Actions":
        - columnheader "Select all":
          - checkbox "Select all"
        - columnheader "Material Spec code":
          - button "Material Spec code"
        - columnheader "Material Spec description":
          - button "Material Spec description"
        - columnheader "Actions"
    - rowgroup:
      - row "Select row UES_1781531570673 material_specification_description_1781531571806_mio2 Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "UES_1781531570673"
        - cell "material_specification_description_1781531571806_mio2"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row UNQ_1781531564091 material_specification_description_1781531565248_2lkb Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "UNQ_1781531564091"
        - cell "material_specification_description_1781531565248_2lkb"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row material_specification_code_1781531558029_4s70 material_specification_description_1781531558068_s90m Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "material_specification_code_1781531558029_4s70"
        - cell "material_specification_description_1781531558068_s90m"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 105 IS 513 GR. 3 Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "105"
        - cell "IS 513 GR. 3"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 917 IS 2062 E 350 GR.BR Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "917"
        - cell "IS 2062 E 350 GR.BR"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 124 IS1786 Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "124"
        - cell "IS1786"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 194 IS 3640 Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "194"
        - cell "IS 3640"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 140 IS 1875 CL 2 Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "140"
        - cell "IS 1875 CL 2"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 141 IS 1875 CL 3 Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "141"
        - cell "IS 1875 CL 3"
        - cell "Open menu":
          - button "Open menu"
      - row "Select row 142 IS 1875 CL 4 Open menu":
        - cell "Select row":
          - checkbox "Select row"
        - cell "142"
        - cell "IS 1875 CL 4"
        - cell "Open menu":
          - button "Open menu"
  - text: 0 of 235 row(s) selected.
  - paragraph: Rows per page
  - combobox: "10"
  - text: Page 1 of 24
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
  4   | // Tier 1 — Masters — Material Specifications
  5   | // Route: /masters/material-specifications
  6   | // APIs: POST create_material_specification, GET get_material_specifications, GET get_material_specifications_id, DELETE delete_material_specifications, PUT update_material_specifications
  7   | 
  8   | const T = String(Date.now()).slice(-6);
  9   | const MATERIAL_SPE = `MATERIAL_${T}`;
  10  | 
  11  | // ─── UI Render ────────────────────────────────────────────────────────────────
  12  | 
  13  | test.describe('Tier 1 — Masters — Material Specifications — UI renders', () => {
  14  |   test('UI renders', async ({ page }) => {
  15  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  16  |     await expect(page.locator('body')).toBeVisible();
> 17  |     await expect(page.getByRole('heading', { name: 'Material Specifications', exact: false }).first()).toBeVisible({ timeout: 25000 });
      |                                                                                                        ^ Error: expect(locator).toBeVisible() failed
  18  |   });
  19  | });
  20  | 
  21  | // ─── Data Set ─────────────────────────────────────────────────────────────────
  22  | 
  23  | test.describe('Tier 1 — Masters — Material Specifications — Data Set', () => {
  24  | 
  25  |   test('create record with valid data', async ({ page }) => {
  26  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  27  |     await page.getByRole('button', { name: 'Add Material Spec' }).click();
  28  |     await page.getByLabel('Material Spec Code', { exact: false }).fill(MATERIAL_SPE);
  29  |     await page.getByLabel('Material Spec Description', { exact: false }).fill(`MATERIAL_${T}`);
  30  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  31  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  32  |     // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
  33  |     const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
  34  |     const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/material-specifications', {
  35  |       headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  36  |     });
  37  |     const list = await resp.json().catch(() => ({}));
  38  |     const rawData = list?.data?.data ?? list?.data ?? list;
  39  |     const found = Array.isArray(rawData) ? rawData : [];
  40  |     const record = found.find(r => String(r['material_specification_code'] ?? '') === MATERIAL_SPE);
  41  |     writeCtx('material_specifications', { id: record?.id ?? null, 'material_specification_code': MATERIAL_SPE });
  42  |   });
  43  | 
  44  |   test('material_specification_code — unique name rejected', async ({ page }) => {
  45  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  46  |     await page.getByRole('button', { name: 'Add Material Spec' }).click();
  47  |     await page.getByLabel('Material Spec Code', { exact: false }).fill(MATERIAL_SPE);
  48  |     await page.getByLabel('Material Spec Description', { exact: false }).fill(`MATERIAL_${T}`);
  49  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  50  |     await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  51  |   });
  52  | 
  53  |   test('update record with valid data', async ({ page }) => {
  54  |     const UPD_TRACK = `UPD_${T}`;
  55  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  56  |     await page.getByRole('button', { name: 'Add Material Spec' }).click();
  57  |     await page.getByLabel('Material Spec Code', { exact: false }).fill(UPD_TRACK);
  58  |     await page.getByLabel('Material Spec Description', { exact: false }).fill(`MATERIAL_${T}`);
  59  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  60  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  61  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  62  |     await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(UPD_TRACK);
  63  |     await page.waitForTimeout(500);
  64  |     const updRow = page.getByRole('row').filter({ hasText: UPD_TRACK }).first();
  65  |     await updRow.getByRole('button').last().click();
  66  |     await page.getByRole('menuitem', { name: /edit/i }).first().click()
  67  |       .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
  68  |     await page.getByLabel('Material Spec Description', { exact: false }).fill(`1`);
  69  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  70  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  71  |   });
  72  | 
  73  |   test('material_specification_code — unique_except_self: duplicate on update rejected', async ({ page }) => {
  74  |     const T2 = String(Date.now() + 1).slice(-6);
  75  |     const FIELD_T2 = `MATERIAL_${T2}`;
  76  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  77  |     await page.getByRole('button', { name: 'Add Material Spec' }).click();
  78  |     await page.getByLabel('Material Spec Code', { exact: false }).fill(`MATERIAL_${T2}`);
  79  |     await page.getByLabel('Material Spec Description', { exact: false }).fill(`MATERIAL_${T2}`);
  80  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  81  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  82  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  83  |     await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
  84  |     await page.waitForTimeout(500);
  85  |     const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
  86  |     await row2.getByRole('button').first().click();
  87  |     await page.getByRole('menuitem', { name: /edit/i }).first().click()
  88  |       .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
  89  |     await page.getByLabel('Material Spec Code', { exact: false }).clear();
  90  |     await page.getByLabel('Material Spec Code', { exact: false }).fill(MATERIAL_SPE);
  91  |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  92  |     await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  93  |   });
  94  | 
  95  |   test('delete record', async ({ page }) => {
  96  |     const DEL_TRACK = `DEL_${T}`;
  97  |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  98  |     await page.getByRole('button', { name: 'Add Material Spec' }).click();
  99  |     await page.getByLabel('Material Spec Code', { exact: false }).fill(DEL_TRACK);
  100 |     await page.getByLabel('Material Spec Description', { exact: false }).fill(`MATERIAL_${T}`);
  101 |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  102 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  103 |     await page.goto('/masters/material-specifications', { waitUntil: 'domcontentloaded' });
  104 |     await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(DEL_TRACK);
  105 |     await page.waitForTimeout(500);
  106 |     const delRow = page.getByRole('row').filter({ hasText: DEL_TRACK }).first();
  107 |     await delRow.getByRole('button').last().click();
  108 |     await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
  109 |       .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
  110 |     await page.getByRole('button', { name: 'Delete', exact: true }).click();
  111 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  112 |   });
  113 | });
  114 | 
```