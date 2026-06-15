import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// Tier 1 — Customers — Customers
// Route: /customers
// APIs: POST create_customer, DELETE delete_customer, GET get_customer, PUT update_customer

const T = String(Date.now()).slice(-6);
const CUSTOMER_COD = `CUSTOMER_${T}`;

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Customers — Customers — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customers', exact: false }).first()).toBeVisible({ timeout: 25000 });
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('Tier 1 — Customers — Customers — Data Set', () => {

  test('create record with valid data', async ({ page }) => {
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await page.getByLabel('GSTIN', { exact: false }).fill(`GSTIN_${T}`);
    await page.getByLabel('GSTARN', { exact: false }).fill(`GSTARN_${T}`);
    await page.getByLabel('LST Reg No', { exact: false }).fill(`LST_REG__${T}`);
    await page.getByLabel('LST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Entry Tax No', { exact: false }).fill(`ENTRY_TA_${T}`);
    await page.getByLabel('Taxpayer Identification Number (TIN)', { exact: false }).fill(`TIN_NO_${T}`);
    await page.getByLabel('Collectorate', { exact: false }).fill(`COLLECTO_${T}`);
    await page.getByLabel('State', { exact: false }).fill(`STATE_${T}`);
    await page.getByLabel('Country', { exact: false }).fill(`COUNTRY_${T}`);
    await page.getByLabel('Customer Code', { exact: false }).fill(CUSTOMER_COD);
    await page.getByLabel('Customer Name', { exact: false }).fill(`CUSTOMER_${T}`);
    await page.getByLabel('CST Reg No', { exact: false }).fill(`CST_REG__${T}`);
    await page.getByLabel('CST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Excise No', { exact: false }).fill(`EXCISE_N_${T}`);
    await page.getByLabel('Excise Range', { exact: false }).fill(`EXCISE_R_${T}`);
    await page.getByLabel('Address 1', { exact: false }).fill(`ADDRESS1_${T}`);
    await page.getByLabel('Address 2', { exact: false }).fill(`ADDRESS2_${T}`);
    await page.getByLabel('Address 3', { exact: false }).fill(`ADDRESS3_${T}`);
    await page.getByLabel('Personal Account Number (PAN)', { exact: false }).fill(`PAN_NO_${T}`);
    await page.getByLabel('Excise Division', { exact: false }).fill(`EXCISE_D_${T}`);
    await page.getByLabel('Website', { exact: false }).fill(`WEBSITE_${T}`);
    await page.getByLabel('City', { exact: false }).fill(`CITY_${T}`);
    await page.getByLabel('Pincode', { exact: false }).fill(`PINCODE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('https://api.dev.erp.eepc.coffeeinc.in/api/customers', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
    const record = found.find(r => String(r['customer_code'] ?? '') === CUSTOMER_COD);
    writeCtx('customers', { id: record?.id ?? null, 'customer_code': CUSTOMER_COD });
  });

  test('customer_code — unique name rejected', async ({ page }) => {
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await page.getByLabel('Customer Code', { exact: false }).fill(CUSTOMER_COD);
    await page.getByLabel('GSTIN', { exact: false }).fill(`GSTIN_${T}`);
    await page.getByLabel('GSTARN', { exact: false }).fill(`GSTARN_${T}`);
    await page.getByLabel('LST Reg No', { exact: false }).fill(`LST_REG__${T}`);
    await page.getByLabel('LST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Entry Tax No', { exact: false }).fill(`ENTRY_TA_${T}`);
    await page.getByLabel('Taxpayer Identification Number (TIN)', { exact: false }).fill(`TIN_NO_${T}`);
    await page.getByLabel('Collectorate', { exact: false }).fill(`COLLECTO_${T}`);
    await page.getByLabel('State', { exact: false }).fill(`STATE_${T}`);
    await page.getByLabel('Country', { exact: false }).fill(`COUNTRY_${T}`);
    await page.getByLabel('Customer Name', { exact: false }).fill(`CUSTOMER_${T}`);
    await page.getByLabel('CST Reg No', { exact: false }).fill(`CST_REG__${T}`);
    await page.getByLabel('CST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Excise No', { exact: false }).fill(`EXCISE_N_${T}`);
    await page.getByLabel('Excise Range', { exact: false }).fill(`EXCISE_R_${T}`);
    await page.getByLabel('Address 1', { exact: false }).fill(`ADDRESS1_${T}`);
    await page.getByLabel('Address 2', { exact: false }).fill(`ADDRESS2_${T}`);
    await page.getByLabel('Address 3', { exact: false }).fill(`ADDRESS3_${T}`);
    await page.getByLabel('Personal Account Number (PAN)', { exact: false }).fill(`PAN_NO_${T}`);
    await page.getByLabel('Excise Division', { exact: false }).fill(`EXCISE_D_${T}`);
    await page.getByLabel('Website', { exact: false }).fill(`WEBSITE_${T}`);
    await page.getByLabel('City', { exact: false }).fill(`CITY_${T}`);
    await page.getByLabel('Pincode', { exact: false }).fill(`PINCODE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('update record with valid data', async ({ page }) => {
    const UPD_TRACK = `UPD_${T}`;
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await page.getByLabel('GSTIN', { exact: false }).fill(`GSTIN_${T}`);
    await page.getByLabel('GSTARN', { exact: false }).fill(`GSTARN_${T}`);
    await page.getByLabel('LST Reg No', { exact: false }).fill(`LST_REG__${T}`);
    await page.getByLabel('LST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Entry Tax No', { exact: false }).fill(`ENTRY_TA_${T}`);
    await page.getByLabel('Taxpayer Identification Number (TIN)', { exact: false }).fill(`TIN_NO_${T}`);
    await page.getByLabel('Collectorate', { exact: false }).fill(`COLLECTO_${T}`);
    await page.getByLabel('State', { exact: false }).fill(`STATE_${T}`);
    await page.getByLabel('Country', { exact: false }).fill(`COUNTRY_${T}`);
    await page.getByLabel('Customer Code', { exact: false }).fill(UPD_TRACK);
    await page.getByLabel('Customer Name', { exact: false }).fill(`CUSTOMER_${T}`);
    await page.getByLabel('CST Reg No', { exact: false }).fill(`CST_REG__${T}`);
    await page.getByLabel('CST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Excise No', { exact: false }).fill(`EXCISE_N_${T}`);
    await page.getByLabel('Excise Range', { exact: false }).fill(`EXCISE_R_${T}`);
    await page.getByLabel('Address 1', { exact: false }).fill(`ADDRESS1_${T}`);
    await page.getByLabel('Address 2', { exact: false }).fill(`ADDRESS2_${T}`);
    await page.getByLabel('Address 3', { exact: false }).fill(`ADDRESS3_${T}`);
    await page.getByLabel('Personal Account Number (PAN)', { exact: false }).fill(`PAN_NO_${T}`);
    await page.getByLabel('Excise Division', { exact: false }).fill(`EXCISE_D_${T}`);
    await page.getByLabel('Website', { exact: false }).fill(`WEBSITE_${T}`);
    await page.getByLabel('City', { exact: false }).fill(`CITY_${T}`);
    await page.getByLabel('Pincode', { exact: false }).fill(`PINCODE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(UPD_TRACK);
    await page.waitForTimeout(500);
    const updRow = page.getByRole('row').filter({ hasText: UPD_TRACK }).first();
    await updRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('GSTIN', { exact: false }).fill(`1`);
    await page.getByLabel('GSTARN', { exact: false }).fill(`1`);
    await page.getByLabel('CST Reg No', { exact: false }).fill(`1`);
    await page.getByLabel('CST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Customer Name', { exact: false }).fill(`1`);
    await page.getByLabel('Service Tax Reg No', { exact: false }).fill(`1`);
    await page.getByLabel('Entry Tax No', { exact: false }).fill(`1`);
    await page.getByLabel('LST Reg No', { exact: false }).fill(`1`);
    await page.getByLabel('LST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Website', { exact: false }).fill(`1`);
    await page.getByLabel('City', { exact: false }).fill(`1`);
    await page.getByLabel('Pincode', { exact: false }).fill(`1`);
    await page.getByLabel('State', { exact: false }).fill(`1`);
    await page.getByLabel('Country', { exact: false }).fill(`1`);
    await page.getByLabel('Excise No', { exact: false }).fill(`1`);
    await page.getByLabel('Excise Range', { exact: false }).fill(`1`);
    await page.getByLabel('Taxpayer Identification Number (TIN)', { exact: false }).fill(`1`);
    await page.getByLabel('Collectorate', { exact: false }).fill(`1`);
    await page.getByLabel('Address 1', { exact: false }).fill(`1`);
    await page.getByLabel('Address 2', { exact: false }).fill(`1`);
    await page.getByLabel('Address 3', { exact: false }).fill(`1`);
    await page.getByLabel('Personal Account Number (PAN)', { exact: false }).fill(`1`);
    await page.getByLabel('Excise Division', { exact: false }).fill(`1`);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });

  test('customer_code — unique_except_self: duplicate on update rejected', async ({ page }) => {
    const T2 = String(Date.now() + 1).slice(-6);
    const FIELD_T2 = `CUSTOMER_${T2}`;
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await page.getByLabel('GSTIN', { exact: false }).fill(`GSTIN_${T2}`);
    await page.getByLabel('GSTARN', { exact: false }).fill(`GSTARN_${T2}`);
    await page.getByLabel('LST Reg No', { exact: false }).fill(`LST_REG__${T2}`);
    await page.getByLabel('LST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Entry Tax No', { exact: false }).fill(`ENTRY_TA_${T2}`);
    await page.getByLabel('Taxpayer Identification Number (TIN)', { exact: false }).fill(`TIN_NO_${T2}`);
    await page.getByLabel('Collectorate', { exact: false }).fill(`COLLECTO_${T2}`);
    await page.getByLabel('State', { exact: false }).fill(`STATE_${T2}`);
    await page.getByLabel('Country', { exact: false }).fill(`COUNTRY_${T2}`);
    await page.getByLabel('Customer Code', { exact: false }).fill(`CUSTOMER_${T2}`);
    await page.getByLabel('Customer Name', { exact: false }).fill(`CUSTOMER_${T2}`);
    await page.getByLabel('CST Reg No', { exact: false }).fill(`CST_REG__${T2}`);
    await page.getByLabel('CST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Excise No', { exact: false }).fill(`EXCISE_N_${T2}`);
    await page.getByLabel('Excise Range', { exact: false }).fill(`EXCISE_R_${T2}`);
    await page.getByLabel('Address 1', { exact: false }).fill(`ADDRESS1_${T2}`);
    await page.getByLabel('Address 2', { exact: false }).fill(`ADDRESS2_${T2}`);
    await page.getByLabel('Address 3', { exact: false }).fill(`ADDRESS3_${T2}`);
    await page.getByLabel('Personal Account Number (PAN)', { exact: false }).fill(`PAN_NO_${T2}`);
    await page.getByLabel('Excise Division', { exact: false }).fill(`EXCISE_D_${T2}`);
    await page.getByLabel('Website', { exact: false }).fill(`WEBSITE_${T2}`);
    await page.getByLabel('City', { exact: false }).fill(`CITY_${T2}`);
    await page.getByLabel('Pincode', { exact: false }).fill(`PINCODE_${T2}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
    await page.waitForTimeout(500);
    const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
    await row2.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('Customer Code', { exact: false }).clear();
    await page.getByLabel('Customer Code', { exact: false }).fill(CUSTOMER_COD);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });

  test('delete record', async ({ page }) => {
    const DEL_TRACK = `DEL_${T}`;
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await page.getByLabel('GSTIN', { exact: false }).fill(`GSTIN_${T}`);
    await page.getByLabel('GSTARN', { exact: false }).fill(`GSTARN_${T}`);
    await page.getByLabel('LST Reg No', { exact: false }).fill(`LST_REG__${T}`);
    await page.getByLabel('LST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Entry Tax No', { exact: false }).fill(`ENTRY_TA_${T}`);
    await page.getByLabel('Taxpayer Identification Number (TIN)', { exact: false }).fill(`TIN_NO_${T}`);
    await page.getByLabel('Collectorate', { exact: false }).fill(`COLLECTO_${T}`);
    await page.getByLabel('State', { exact: false }).fill(`STATE_${T}`);
    await page.getByLabel('Country', { exact: false }).fill(`COUNTRY_${T}`);
    await page.getByLabel('Customer Code', { exact: false }).fill(DEL_TRACK);
    await page.getByLabel('Customer Name', { exact: false }).fill(`CUSTOMER_${T}`);
    await page.getByLabel('CST Reg No', { exact: false }).fill(`CST_REG__${T}`);
    await page.getByLabel('CST Reg Date', { exact: false }).fill(`2026-01-01`);
    await page.getByLabel('Excise No', { exact: false }).fill(`EXCISE_N_${T}`);
    await page.getByLabel('Excise Range', { exact: false }).fill(`EXCISE_R_${T}`);
    await page.getByLabel('Address 1', { exact: false }).fill(`ADDRESS1_${T}`);
    await page.getByLabel('Address 2', { exact: false }).fill(`ADDRESS2_${T}`);
    await page.getByLabel('Address 3', { exact: false }).fill(`ADDRESS3_${T}`);
    await page.getByLabel('Personal Account Number (PAN)', { exact: false }).fill(`PAN_NO_${T}`);
    await page.getByLabel('Excise Division', { exact: false }).fill(`EXCISE_D_${T}`);
    await page.getByLabel('Website', { exact: false }).fill(`WEBSITE_${T}`);
    await page.getByLabel('City', { exact: false }).fill(`CITY_${T}`);
    await page.getByLabel('Pincode', { exact: false }).fill(`PINCODE_${T}`);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(DEL_TRACK);
    await page.waitForTimeout(500);
    const delRow = page.getByRole('row').filter({ hasText: DEL_TRACK }).first();
    await delRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });
});
