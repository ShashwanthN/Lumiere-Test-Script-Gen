# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-tier1-items.spec.ts >> Tier 1 — Masters — Items — Data Set >> create record with valid data
- Location: output/tests/01-tier1-items.spec.ts:25:7

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  locator('[role="dialog"][data-slot="sheet-content"]')
Expected: hidden
Received: visible
Timeout:  30000ms

Call log:
  - Expect "toBeHidden" with timeout 30000ms
  - waiting for locator('[role="dialog"][data-slot="sheet-content"]')
    63 × locator resolved to <div role="dialog" tabindex="-1" id="radix-_r_3u_" data-state="open" data-slot="sheet-content" aria-labelledby="radix-_r_3v_" aria-describedby="radix-_r_40_" class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 w-3/4 border-l sm:max-w-sm !w-[576px] !max-w-[90vw] fl…>…</div>
       - unexpected value "visible"

```

```yaml
- dialog "Add Items":
  - heading "Add Items" [level=2]
  - paragraph: Add new item information
  - group
  - group
  - group
  - group
  - text: Item Group *
  - combobox: PIPE 001 R RAW MATERIAL
  - group
  - group
  - text: Material Description
  - combobox: MATERIAL_1781544324805 MATERIAL_1781544324805
  - text: Material Spec Description *
  - combobox: material_specification_description_1781531571806_mio2 UES_1781531570673
  - text: UOM Unit
  - combobox: UES_1781532208014 uom_symbol_1781532209241_hx71
  - group
  - group
  - group
  - group
  - text: Dimensions
  - textbox "key"
  - text: ":"
  - textbox "value"
  - button "Remove" [disabled]
  - button "Add Pair" [disabled]
  - text: Supply Condition Description *
  - combobox: UnSpecified 00
  - button "Cancel"
  - button "Add"
  - button "Close"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { readCtx, writeCtx } from './helpers/context';
  3   | 
  4   | // Tier 1 — Masters — Items
  5   | // Route: /masters/items
  6   | // APIs: GET get_items_testing, POST create_items, GET get_last_item_serial_by_group, DELETE delete_items, PUT update_items, GET get_items
  7   | 
  8   | const T = String(Date.now()).slice(-6);
  9   | const NAME = `NAME_${T}`;
  10  | 
  11  | // ─── UI Render ────────────────────────────────────────────────────────────────
  12  | 
  13  | test.describe('Tier 1 — Masters — Items — UI renders', () => {
  14  |   test('UI renders', async ({ page }) => {
  15  |     await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
  16  |     await expect(page.locator('body')).toBeVisible();
  17  |     await expect(page.getByRole('heading', { name: 'Items', exact: false }).first()).toBeVisible({ timeout: 25000 });
  18  |   });
  19  | });
  20  | 
  21  | // ─── Data Set ─────────────────────────────────────────────────────────────────
  22  | 
  23  | test.describe('Tier 1 — Masters — Items — Data Set', () => {
  24  | 
  25  |   test('create record with valid data', async ({ page }) => {
  26  |     await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
  27  |     await page.getByRole('button', { name: 'Add Items' }).click();
  28  |     {
  29  |       const _lbl = page.getByLabel('Material Spec Description', { exact: false });
  30  |       const _cbx = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first();
  31  |       const _btn = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  32  |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  33  |     }
  34  |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  35  |     await page.getByRole('option').first().click();
  36  |     await page.waitForTimeout(700); // cascade: let dependent fields update
  37  |     {
  38  |       const _lbl = page.getByLabel('Supply Condition Description', { exact: false });
  39  |       const _cbx = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first();
  40  |       const _btn = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  41  |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  42  |     }
  43  |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  44  |     await page.getByRole('option').first().click();
  45  |     await page.waitForTimeout(700); // cascade: let dependent fields update
  46  |     {
  47  |       const _lbl = page.getByLabel('Item Group', { exact: false });
  48  |       const _cbx = page.locator('label').filter({ hasText: 'Item Group' }).locator('..').getByRole('combobox').first();
  49  |       const _btn = page.locator('label').filter({ hasText: 'Item Group' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  50  |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  51  |     }
  52  |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  53  |     await page.getByRole('option').first().click();
  54  |     await page.waitForTimeout(700); // cascade: let dependent fields update
  55  |     {
  56  |       const _lbl = page.getByLabel('UOM Unit', { exact: false });
  57  |       const _cbx = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('..').getByRole('combobox').first();
  58  |       const _btn = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  59  |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  60  |     }
  61  |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  62  |     await page.getByRole('option').first().click();
  63  |     await page.waitForTimeout(700); // cascade: let dependent fields update
  64  |     await page.getByLabel('Unit Weight', { exact: false }).fill(`UNIT_WEI_${T}`);
  65  |     await page.getByLabel('Unit Volume', { exact: false }).fill(`UNIT_VOL_${T}`);
  66  |     await page.getByLabel('Designation', { exact: false }).fill(`DESIGNAT_${T}`);
  67  |     await page.getByLabel('Manufacturing Standard', { exact: false }).fill(`MFG_STD_${T}`);
  68  |     await page.getByLabel('Item Name', { exact: false }).fill(NAME);
  69  |     await page.getByLabel('Item Description', { exact: false }).fill(`ITEM_DES_${T}`);
  70  |     await page.getByLabel('Item Size', { exact: false }).fill(`ITEM_SIZ_${T}`);
  71  |     {
  72  |       const _lbl = page.getByLabel('Material Description', { exact: false });
  73  |       const _cbx = page.locator('label').filter({ hasText: 'Material Description' }).locator('..').getByRole('combobox').first();
  74  |       const _btn = page.locator('label').filter({ hasText: 'Material Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  75  |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  76  |     }
  77  |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  78  |     await page.getByRole('option').first().click();
  79  |     await page.getByRole('button', { name: 'Add', exact: true }).click();
> 80  |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
      |                                                                              ^ Error: expect(locator).toBeHidden() failed
  81  |     // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
  82  |     const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
  83  |     const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/testing', {
  84  |       headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  85  |     });
  86  |     const list = await resp.json().catch(() => ({}));
  87  |     const rawData = list?.data?.data ?? list?.data ?? list;
  88  |     const found = Array.isArray(rawData) ? rawData : [];
  89  |     const record = found.find(r => String(r['name'] ?? '') === NAME);
  90  |     writeCtx('items', { id: record?.id ?? null, 'name': NAME, 'item_code': record?.['item_code'] ?? null });
  91  |   });
  92  | 
  93  |   test('item_code — unique name rejected (API)', async ({ page }) => {
  94  |     const ctx = readCtx();
  95  |     if (!ctx['items']?.['item_code']) test.skip();
  96  |     const resp = await page.request.post('https://api.dev.erp.eepc.coffeeinc.in/api/items/create', {
  97  |       data: { 'item_code': ctx['items']['item_code'] },
  98  |     });
  99  |     expect(resp.ok()).toBe(false);
  100 |   });
  101 | 
  102 |   test('name — unique name rejected', async ({ page }) => {
  103 |     await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
  104 |     await page.getByRole('button', { name: 'Add Items' }).click();
  105 |     await page.getByLabel('Item Name', { exact: false }).fill(NAME);
  106 |     {
  107 |       const _lbl = page.getByLabel('Material Spec Description', { exact: false });
  108 |       const _cbx = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first();
  109 |       const _btn = page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  110 |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  111 |     }
  112 |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  113 |     await page.getByRole('option').first().click();
  114 |     await page.waitForTimeout(700); // cascade: let dependent fields update
  115 |     {
  116 |       const _lbl = page.getByLabel('Supply Condition Description', { exact: false });
  117 |       const _cbx = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first();
  118 |       const _btn = page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  119 |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  120 |     }
  121 |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  122 |     await page.getByRole('option').first().click();
  123 |     await page.waitForTimeout(700); // cascade: let dependent fields update
  124 |     {
  125 |       const _lbl = page.getByLabel('Item Group', { exact: false });
  126 |       const _cbx = page.locator('label').filter({ hasText: 'Item Group' }).locator('..').getByRole('combobox').first();
  127 |       const _btn = page.locator('label').filter({ hasText: 'Item Group' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  128 |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  129 |     }
  130 |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  131 |     await page.getByRole('option').first().click();
  132 |     await page.waitForTimeout(700); // cascade: let dependent fields update
  133 |     {
  134 |       const _lbl = page.getByLabel('UOM Unit', { exact: false });
  135 |       const _cbx = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('..').getByRole('combobox').first();
  136 |       const _btn = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  137 |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  138 |     }
  139 |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  140 |     await page.getByRole('option').first().click();
  141 |     await page.waitForTimeout(700); // cascade: let dependent fields update
  142 |     await page.getByLabel('Unit Weight', { exact: false }).fill(`UNIT_WEI_${T}`);
  143 |     await page.getByLabel('Unit Volume', { exact: false }).fill(`UNIT_VOL_${T}`);
  144 |     await page.getByLabel('Designation', { exact: false }).fill(`DESIGNAT_${T}`);
  145 |     await page.getByLabel('Manufacturing Standard', { exact: false }).fill(`MFG_STD_${T}`);
  146 |     await page.getByLabel('Item Description', { exact: false }).fill(`ITEM_DES_${T}`);
  147 |     await page.getByLabel('Item Size', { exact: false }).fill(`ITEM_SIZ_${T}`);
  148 |     {
  149 |       const _lbl = page.getByLabel('Material Description', { exact: false });
  150 |       const _cbx = page.locator('label').filter({ hasText: 'Material Description' }).locator('..').getByRole('combobox').first();
  151 |       const _btn = page.locator('label').filter({ hasText: 'Material Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  152 |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  153 |     }
  154 |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  155 |     await page.getByRole('option').first().click();
  156 |     await page.getByRole('button', { name: 'Add', exact: true }).click();
  157 |     await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  158 |   });
  159 | 
  160 |   test('update record with valid data', async ({ page }) => {
  161 |     const updCtx = readCtx();
  162 |     if (!updCtx['items']?.['name']) test.skip();
  163 |     const updSearch = updCtx['items']['name'];
  164 |     await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
  165 |     await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(updSearch);
  166 |     await page.waitForTimeout(500);
  167 |     const updRow = page.getByRole('row').filter({ hasText: updSearch }).first();
  168 |     await updRow.getByRole('button').last().click();
  169 |     await page.getByRole('menuitem', { name: /edit/i }).first().click()
  170 |       .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
  171 |     if (await page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {
  172 |       await page.locator('label').filter({ hasText: 'Material Spec Description' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });
  173 |       await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  174 |       await page.getByRole('option').first().click();
  175 |       await page.waitForTimeout(700);
  176 |     }
  177 |     if (await page.locator('label').filter({ hasText: 'Item Group Name' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {
  178 |       await page.locator('label').filter({ hasText: 'Item Group Name' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });
  179 |       await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  180 |       await page.getByRole('option').first().click();
```