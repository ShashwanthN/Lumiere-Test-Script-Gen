# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-tier1-raw-material-indents.spec.ts >> Tier 1 — Material Indents — Raw Material Indents — Data Set >> create record with valid data
- Location: output/tests/01-tier1-raw-material-indents.spec.ts:24:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - generic [ref=e6]:
      - generic [ref=e8]:
        - img "EEPC ERP" [ref=e10]
        - generic [ref=e11]:
          - generic [ref=e12]: EEPC ERP
          - generic [ref=e13]: PMS / SL System
      - generic [ref=e15]:
        - generic [ref=e16]: Platform
        - list [ref=e17]:
          - listitem [ref=e18]:
            - link "Home" [ref=e19] [cursor=pointer]:
              - /url: /
              - img [ref=e20]
              - generic [ref=e23]: Home
          - listitem [ref=e24]:
            - button "Masters" [ref=e25]:
              - img [ref=e26]
              - generic [ref=e30]: Masters
              - img [ref=e31]
          - listitem [ref=e33]:
            - link "Employees" [ref=e34] [cursor=pointer]:
              - /url: /employees
              - img [ref=e35]
              - generic [ref=e38]: Employees
          - listitem [ref=e39]:
            - link "Customers" [ref=e40] [cursor=pointer]:
              - /url: /customers
              - img [ref=e41]
              - generic [ref=e46]: Customers
          - listitem [ref=e47]:
            - button "Projects" [ref=e48]:
              - img [ref=e49]
              - generic [ref=e51]: Projects
              - img [ref=e52]
          - listitem [ref=e54]:
            - button "Material Indents" [expanded] [ref=e55]:
              - img [ref=e56]
              - generic [ref=e59]: Material Indents
              - img [ref=e60]
            - list [ref=e63]:
              - listitem [ref=e64]:
                - link "Bill of Materials" [ref=e65] [cursor=pointer]:
                  - /url: /bill-of-materials
                  - generic [ref=e66]: Bill of Materials
              - listitem [ref=e67]:
                - link "Raw Material Indents" [ref=e68] [cursor=pointer]:
                  - /url: /raw-material-indents
                  - generic [ref=e69]: Raw Material Indents
              - listitem [ref=e70]:
                - link "Bought Out Components" [ref=e71] [cursor=pointer]:
                  - /url: /boc-indents
                  - generic [ref=e72]: Bought Out Components
          - listitem [ref=e73]:
            - link "PMS Generation" [ref=e74] [cursor=pointer]:
              - /url: /pms-generation
              - img [ref=e75]
              - generic [ref=e78]: PMS Generation
          - listitem [ref=e79]:
            - link "Adeos Document Intelligence" [ref=e80] [cursor=pointer]:
              - /url: /adeos_document_intelligence
              - generic [ref=e81]: Adeos Document Intelligence
          - listitem [ref=e82]:
            - button "Admin" [ref=e83]:
              - img [ref=e84]
              - generic [ref=e96]: Admin
              - img [ref=e97]
          - listitem [ref=e99]:
            - button "Settings" [ref=e100]:
              - img [ref=e101]
              - generic [ref=e104]: Settings
              - img [ref=e105]
      - list [ref=e108]:
        - listitem [ref=e109]:
          - button "CS Coffee Super Admin coffee@coffeeinc.in" [ref=e110]:
            - generic [ref=e112]: CS
            - generic [ref=e113]:
              - generic [ref=e114]: Coffee Super Admin
              - generic [ref=e115]: coffee@coffeeinc.in
            - img [ref=e116]
      - button "Toggle Sidebar" [ref=e119]
    - main [ref=e120]:
      - generic [ref=e123]:
        - button "Toggle Sidebar" [ref=e124] [cursor=pointer]:
          - img
          - generic [ref=e125]: Toggle Sidebar
        - navigation "breadcrumb" [ref=e126]:
          - list [ref=e127]:
            - listitem [ref=e129]:
              - link "Raw Material Indents" [disabled] [ref=e130]
            - generic [ref=e131]:
              - listitem [ref=e132]:
                - img [ref=e133]
              - listitem [ref=e135]:
                - link "Create" [disabled] [ref=e136]
      - generic [ref=e139]:
        - generic [ref=e143]:
          - heading "Create Raw Material Indent" [level=2] [ref=e144]
          - paragraph [ref=e145]: Fill in the details below to create a new RMI
        - generic [ref=e148]:
          - generic [ref=e149]:
            - group [ref=e152]:
              - generic [ref=e153]: Indent Number
              - textbox "Generated code" [ref=e154]: "******/RMI/0001"
            - group [ref=e157]:
              - generic [ref=e158]: Indent Date
              - textbox "Indent Date" [ref=e159]: 2026-06-16
            - group [ref=e162]:
              - generic [ref=e163]: Revision No
              - textbox "Revision No" [disabled]:
                - /placeholder: "00"
            - group [ref=e166]:
              - generic [ref=e167]: Revision Date
              - textbox "Revision Date" [ref=e168]: 2026-06-16
            - group [ref=e171]:
              - generic [ref=e172]: Mark as Final
              - combobox "Mark as Final" [ref=e173]:
                - generic: Select...
                - img
              - combobox [ref=e174]
          - generic [ref=e175]:
            - generic [ref=e178]:
              - generic [ref=e179]:
                - text: Select Project
                - generic [ref=e180]: "*"
              - combobox [ref=e182] [cursor=pointer]:
                - generic [ref=e183]: Search and select project...
                - img
            - group [ref=e186]:
              - generic [ref=e187]: Customer
              - textbox "Customer" [disabled]:
                - /placeholder: Auto-filled from project
          - generic [ref=e188]:
            - group [ref=e191]:
              - generic [ref=e192]:
                - text: PGMA Status
                - generic [ref=e193]: "*"
              - combobox "PGMA Status *" [ref=e194]:
                - generic: INCOMPLETE
                - img
              - combobox [ref=e195]
            - group [ref=e198]:
              - generic [ref=e199]: Supply Scope
              - textbox "Supply Scope" [ref=e200]:
                - /placeholder: e.g. Supply & Erection
          - generic [ref=e201]:
            - generic [ref=e204]:
              - generic [ref=e205]:
                - text: Applicable PG
                - generic [ref=e206]: "*"
              - combobox [ref=e208] [cursor=pointer]:
                - generic [ref=e209]: Select applicable PG...
                - img
            - generic [ref=e212]:
              - generic [ref=e213]: Applicable MA
              - combobox [ref=e215] [cursor=pointer]:
                - generic [ref=e216]: Select applicable MA...
                - img
          - group [ref=e220]:
            - generic [ref=e221]: Notes/Remarks
            - textbox "Notes/Remarks" [ref=e222]:
              - /placeholder: Enter any additional notes or remarks...
        - generic [ref=e225]:
          - table [ref=e228]:
            - rowgroup [ref=e229]:
              - row "Item Description Att/Cert SQM Qty Unit Wt Size 1 Value Size 2 Value Total Weight Remarks" [ref=e230]:
                - columnheader "Item" [ref=e231]
                - columnheader "Description" [ref=e232]
                - columnheader "Att/Cert" [ref=e233]
                - columnheader "SQM" [ref=e234]
                - columnheader "Qty" [ref=e235]
                - columnheader "Unit Wt" [ref=e236]
                - columnheader "Size 1 Value" [ref=e237]
                - columnheader "Size 2 Value" [ref=e238]
                - columnheader "Total Weight" [ref=e239]
                - columnheader "Remarks" [ref=e240]
                - columnheader [ref=e241]
            - rowgroup [ref=e242]:
              - row "No items added. Click Add Item to start." [ref=e243]:
                - cell "No items added. Click Add Item to start." [ref=e244]
            - rowgroup [ref=e245]:
              - row "TOTALS - - - 0.00 - - - 0.00 -" [ref=e246]:
                - cell "TOTALS" [ref=e247]
                - cell "-" [ref=e248]
                - cell "-" [ref=e249]
                - cell "-" [ref=e250]
                - cell "0.00" [ref=e251]
                - cell "-" [ref=e252]
                - cell "-" [ref=e253]
                - cell "-" [ref=e254]
                - cell "0.00" [ref=e255]
                - cell "-" [ref=e256]
                - cell [ref=e257]
          - generic [ref=e259]:
            - button "Add Group" [ref=e260] [cursor=pointer]:
              - img
              - text: Add Group
            - button "Add Item" [disabled]:
              - img
              - text: Add Item
            - button "Add Items" [disabled]:
              - img
              - text: Add Items
        - generic [ref=e262]:
          - generic [ref=e265]:
            - generic [ref=e266]:
              - text: Prepared By
              - generic [ref=e267]: "*"
            - combobox [ref=e269] [cursor=pointer]:
              - generic [ref=e270]: Select employee...
              - img
          - generic [ref=e273]:
            - generic [ref=e274]:
              - text: Checked By
              - generic [ref=e275]: "*"
            - combobox [ref=e277] [cursor=pointer]:
              - generic [ref=e278]: Select employee...
              - img
          - generic [ref=e281]:
            - generic [ref=e282]:
              - text: Approved By
              - generic [ref=e283]: "*"
            - combobox [ref=e285] [cursor=pointer]:
              - generic [ref=e286]: Select employee...
              - img
        - generic [ref=e288]:
          - button "Cancel" [ref=e291] [cursor=pointer]
          - button "Save RMI" [ref=e294] [cursor=pointer]
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
> 28 |     await page.getByRole('button', { name: 'Add', exact: true }).click();
     |                                                                  ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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
  71 |     await page.getByRole('button', { name: 'Add', exact: true }).click();
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