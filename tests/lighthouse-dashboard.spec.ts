// tests/auth-performance.spec.ts
import { test } from '@playwright/test';
import { launch } from 'chrome-launcher';
import { playAudit } from 'playwright-lighthouse';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const TEST_CONFIG = {
  loginUrl: `${BASE_URL}/auth`,
  testUrls: [
    `${BASE_URL}/app`
  ],
  credentials: {
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'password123'
  },
  thresholds: {
    performance: 85,
    accessibility: 90,
    'best-practices': 80,
    seo: 80
  }
};

test.describe('Authenticated Performance Tests', () => {
  
  test('Login and test dashboard performance', async ({ page }) => {
    // Launch Chrome with remote debugging
    // Launch Chrome, using headless mode when running in CI
    const chrome = await launch({
      port: 9222,
      chromeFlags: process.env.CI ? ['--headless'] : []
    });

    await page.goto(TEST_CONFIG.loginUrl);
    await page.locator('input[name="email"]').fill(TEST_CONFIG.credentials.email);
    await page.locator('input[name="password"]').fill(TEST_CONFIG.credentials.password);
    await page.locator('button[type="submit"]').click();

    await playAudit({
      page,
      thresholds: TEST_CONFIG.thresholds,
      port: 9222
    });

    try {
      await chrome.kill();
    } catch (error) {
      console.error('Failed to kill Chrome instance:', error);
    }
  });
  
});