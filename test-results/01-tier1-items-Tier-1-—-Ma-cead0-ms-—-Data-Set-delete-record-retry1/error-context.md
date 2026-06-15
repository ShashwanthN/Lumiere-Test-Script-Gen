# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-tier1-items.spec.ts >> Tier 1 — Masters — Items — Data Set >> delete record
- Location: output/tests/01-tier1-items.spec.ts:220:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('row').filter({ hasText: 'NAME_692065' }).first().getByRole('button').last()

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
            - button "Masters" [expanded] [ref=e25]:
              - img [ref=e26]
              - generic [ref=e30]: Masters
              - img [ref=e31]
            - list [ref=e34]:
              - listitem [ref=e35]:
                - link "Materials" [ref=e36] [cursor=pointer]:
                  - /url: /masters/materials
                  - generic [ref=e37]: Materials
              - listitem [ref=e38]:
                - link "Units Of Measurement" [ref=e39] [cursor=pointer]:
                  - /url: /masters/units-of-measurement
                  - generic [ref=e40]: Units Of Measurement
              - listitem [ref=e41]:
                - link "Items" [ref=e42] [cursor=pointer]:
                  - /url: /masters/items
                  - generic [ref=e43]: Items
              - listitem [ref=e44]:
                - link "Item Groups" [ref=e45] [cursor=pointer]:
                  - /url: /masters/item-groups
                  - generic [ref=e46]: Item Groups
              - listitem [ref=e47]:
                - link "Item Classes" [ref=e48] [cursor=pointer]:
                  - /url: /masters/item-classes
                  - generic [ref=e49]: Item Classes
              - listitem [ref=e50]:
                - link "Material Specifications" [ref=e51] [cursor=pointer]:
                  - /url: /masters/material-specifications
                  - generic [ref=e52]: Material Specifications
              - listitem [ref=e53]:
                - link "Drawing Categories" [ref=e54] [cursor=pointer]:
                  - /url: /masters/drawing-categories
                  - generic [ref=e55]: Drawing Categories
              - listitem [ref=e56]:
                - link "Drawing Sizes" [ref=e57] [cursor=pointer]:
                  - /url: /masters/drawing-sizes
                  - generic [ref=e58]: Drawing Sizes
              - listitem [ref=e59]:
                - link "Product Groups (PG)" [ref=e60] [cursor=pointer]:
                  - /url: /masters/product-groups
                  - generic [ref=e61]: Product Groups (PG)
              - listitem [ref=e62]:
                - link "PGMA" [ref=e63] [cursor=pointer]:
                  - /url: /masters/pgma
                  - generic [ref=e64]: PGMA
          - listitem [ref=e65]:
            - link "Employees" [ref=e66] [cursor=pointer]:
              - /url: /employees
              - img [ref=e67]
              - generic [ref=e70]: Employees
          - listitem [ref=e71]:
            - link "Customers" [ref=e72] [cursor=pointer]:
              - /url: /customers
              - img [ref=e73]
              - generic [ref=e78]: Customers
          - listitem [ref=e79]:
            - button "Projects" [ref=e80]:
              - img [ref=e81]
              - generic [ref=e83]: Projects
              - img [ref=e84]
          - listitem [ref=e86]:
            - button "Material Indents" [ref=e87]:
              - img [ref=e88]
              - generic [ref=e91]: Material Indents
              - img [ref=e92]
          - listitem [ref=e94]:
            - link "PMS Generation" [ref=e95] [cursor=pointer]:
              - /url: /pms-generation
              - img [ref=e96]
              - generic [ref=e99]: PMS Generation
          - listitem [ref=e100]:
            - link "Adeos Document Intelligence" [ref=e101] [cursor=pointer]:
              - /url: /adeos_document_intelligence
              - generic [ref=e102]: Adeos Document Intelligence
          - listitem [ref=e103]:
            - button "Admin" [ref=e104]:
              - img [ref=e105]
              - generic [ref=e117]: Admin
              - img [ref=e118]
          - listitem [ref=e120]:
            - button "Settings" [ref=e121]:
              - img [ref=e122]
              - generic [ref=e125]: Settings
              - img [ref=e126]
      - list [ref=e129]:
        - listitem [ref=e130]:
          - button "CS Coffee Super Admin coffee@coffeeinc.in" [ref=e131]:
            - generic [ref=e133]: CS
            - generic [ref=e134]:
              - generic [ref=e135]: Coffee Super Admin
              - generic [ref=e136]: coffee@coffeeinc.in
            - img [ref=e137]
      - button "Toggle Sidebar" [ref=e140]
    - main [ref=e141]:
      - generic [ref=e144]:
        - button "Toggle Sidebar" [ref=e145] [cursor=pointer]:
          - img
          - generic [ref=e146]: Toggle Sidebar
        - navigation "breadcrumb" [ref=e147]:
          - list [ref=e148]:
            - listitem [ref=e150]:
              - link "Masters" [disabled] [ref=e151]
            - generic [ref=e152]:
              - listitem [ref=e153]:
                - img [ref=e154]
              - listitem [ref=e156]:
                - link "Items" [disabled] [ref=e157]
      - generic [ref=e161]:
        - generic [ref=e162]:
          - generic [ref=e164]:
            - heading "Items" [level=3] [ref=e165]
            - paragraph [ref=e166]: Manage your Items here
          - button "Add Items" [ref=e170] [cursor=pointer]:
            - img
            - text: Add Items
        - generic [ref=e173]:
          - generic [ref=e174]:
            - generic [ref=e175]:
              - textbox "Search..." [active] [ref=e176]: NAME_692065
              - button "Reset" [ref=e177] [cursor=pointer]:
                - text: Reset
                - img
            - button "View" [ref=e178] [cursor=pointer]:
              - img
              - text: View
          - table [ref=e181]:
            - rowgroup [ref=e182]:
              - row "Select all Code Name Size Group Material specification Class code Class description Actions" [ref=e183]:
                - columnheader "Select all" [ref=e184]:
                  - checkbox "Select all" [ref=e185]
                - columnheader "Code" [ref=e186]:
                  - button "Code" [ref=e188] [cursor=pointer]:
                    - generic [ref=e189]: Code
                    - img
                - columnheader "Name" [ref=e190]:
                  - button "Name" [ref=e192] [cursor=pointer]:
                    - generic [ref=e193]: Name
                    - img
                - columnheader "Size" [ref=e194]:
                  - button "Size" [ref=e196] [cursor=pointer]:
                    - generic [ref=e197]: Size
                    - img
                - columnheader "Group" [ref=e198]:
                  - button "Group" [ref=e200] [cursor=pointer]:
                    - generic [ref=e201]: Group
                    - img
                - columnheader "Material specification" [ref=e202]:
                  - button "Material specification" [ref=e204] [cursor=pointer]:
                    - generic [ref=e205]: Material specification
                    - img
                - columnheader "Class code" [ref=e206]:
                  - button "Class code" [ref=e208] [cursor=pointer]:
                    - generic [ref=e209]: Class code
                    - img
                - columnheader "Class description" [ref=e210]:
                  - button "Class description" [ref=e212] [cursor=pointer]:
                    - generic [ref=e213]: Class description
                    - img
                - columnheader "Actions" [ref=e214]
            - rowgroup [ref=e215]:
              - row "No results." [ref=e216]:
                - cell "No results." [ref=e217]
          - generic [ref=e218]:
            - generic [ref=e219]: 0 of 0 row(s) selected.
            - generic [ref=e220]:
              - generic [ref=e221]:
                - paragraph [ref=e222]: Rows per page
                - combobox [ref=e223]:
                  - generic: "10"
                  - img
              - generic [ref=e224]: Page 1 of 0
              - generic [ref=e225]:
                - button "Go to first page" [disabled]:
                  - generic: Go to first page
                  - img
                - button "Go to previous page" [disabled]:
                  - generic: Go to previous page
                  - img
                - button "Go to next page" [disabled]:
                  - generic: Go to next page
                  - img
                - button "Go to last page" [disabled]:
                  - generic: Go to last page
                  - img
```

# Test source

```ts
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
  181 |       await page.waitForTimeout(700);
  182 |     }
  183 |     if (await page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {
  184 |       await page.locator('label').filter({ hasText: 'Supply Condition Description' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });
  185 |       await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  186 |       await page.getByRole('option').first().click();
  187 |     }
  188 |     {
  189 |       const _lbl = page.getByLabel('Material Description', { exact: false });
  190 |       const _cbx = page.locator('label').filter({ hasText: 'Material Description' }).locator('..').getByRole('combobox').first();
  191 |       const _btn = page.locator('label').filter({ hasText: 'Material Description' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  192 |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  193 |     }
  194 |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  195 |     await page.getByRole('option').first().click();
  196 |     await page.waitForTimeout(700); // cascade: let dependent fields update
  197 |     await page.getByLabel('Unit Weight', { exact: false }).fill(`1`);
  198 |     await page.getByLabel('Unit Volume', { exact: false }).fill(`1`);
  199 |     {
  200 |       const _lbl = page.getByLabel('UOM Unit', { exact: false });
  201 |       const _cbx = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('..').getByRole('combobox').first();
  202 |       const _btn = page.locator('label').filter({ hasText: 'UOM Unit' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();
  203 |       await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });
  204 |     }
  205 |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });
  206 |     await page.getByRole('option').first().click();
  207 |     await page.getByLabel('Item Description', { exact: false }).fill(`1`);
  208 |     await page.getByLabel('Item Size', { exact: false }).fill(`1`);
  209 |     await page.getByLabel('Designation', { exact: false }).fill(`1`);
  210 |     await page.getByLabel('Manufacturing Standard', { exact: false }).fill(`1`);
  211 |     await page.getByRole('button', { name: 'Submit', exact: true }).click();
  212 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  213 |   });
  214 | 
  215 |   test('item_code — unique_except_self: TODO', async () => {
  216 |     // 'item_code' is auto-generated or a composite field — cannot test via form fill.
  217 |     test.skip();
  218 |   });
  219 | 
  220 |   test('delete record', async ({ page }) => {
  221 |     const delCtx = readCtx();
  222 |     if (!delCtx['items']?.['name']) test.skip();
  223 |     const delSearch = delCtx['items']['name'];
  224 |     await page.goto('/masters/items', { waitUntil: 'domcontentloaded' });
  225 |     await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(delSearch);
  226 |     await page.waitForTimeout(500);
  227 |     const delRow = page.getByRole('row').filter({ hasText: delSearch }).first();
> 228 |     await delRow.getByRole('button').last().click();
      |                                             ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  229 |     await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
  230 |       .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
  231 |     await page.getByRole('button', { name: 'Delete', exact: true }).click();
  232 |     await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  233 |   });
  234 | });
  235 | 
```