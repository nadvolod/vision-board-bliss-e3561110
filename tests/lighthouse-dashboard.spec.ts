// tests/auth-performance.spec.ts
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

// Test configuration - customize these values
const TEST_CONFIG = {
  loginUrl: 'http://localhost:8080/auth',
  testUrls: [
    'http://localhost:3000/dashboard',
    'http://localhost:3000/profile'
  ],
  credentials: {
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'password123'
  },
  thresholds: {
    performance: 80,
    accessibility: 90,
    'best-practices': 80,
    seo: 80
  }
};

test.describe('Authenticated Performance Tests', () => {
  
  test('Login and test dashboard performance', async ({ page }) => {
    // Step 1: Login
    console.log('🔐 Logging in...');
    await page.goto(TEST_CONFIG.loginUrl);
    
    // Fill login form
    await page.locator('input[name="email"]').fill(TEST_CONFIG.credentials.email);
    await page.locator('input[name="password"]').fill(TEST_CONFIG.credentials.password);
    await page.locator('button[type="submit"]').click();
    
    // Step 2: Run Lighthouse audit
    console.log('🔍 Running Lighthouse audit...');
    await playAudit({
      page,
      thresholds: TEST_CONFIG.thresholds,
      port: 9222
    });
    
    console.log('✅ Performance audit completed');
  });
  
});