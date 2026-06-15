import { chromium } from '@playwright/test';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const EMAIL    = process.env.EMAIL    || 'coffee@coffeeinc.in';
const PASSWORD = process.env.PASSWORD || 'Kafka@shore25';
const BASE_URL = 'https://dev.erp.eepc.coffeeinc.in';
const STATE_PATH = join(process.cwd(), 'storageState.json');

export default async function globalSetup() {
  // Reuse an existing session if it's less than 1 hour old
  if (existsSync(STATE_PATH)) {
    const age = Date.now() - statSync(STATE_PATH).mtimeMs;
    if (age < 3_600_000) {
      console.log('  ✓ storageState.json is fresh — skipping login');
      return;
    }
  }

  const browser = await chromium.launch();
  const page    = await browser.newPage();

  console.log('  → Logging in to ' + BASE_URL + ' ...');
  await page.goto(BASE_URL + '/login');
  await page.getByPlaceholder('you@example.com').fill(EMAIL);
  await page.getByPlaceholder('Enter your password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForSelector('text=Welcome back!', { timeout: 20000 });

  await page.context().storageState({ path: STATE_PATH });
  console.log('  ✓ Logged in — storageState.json saved');

  await browser.close();
}
