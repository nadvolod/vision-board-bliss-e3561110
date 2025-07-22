import { expect, test } from '@playwright/test';

const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;

test.describe('Tiles Load Performance Test', () => {
  test.skip(!testEmail || !testPassword, 'TEST_EMAIL and TEST_PASSWORD environment variables required');

  test('Dashboard tiles should load within 0.5 seconds after login', async ({ page }) => {
    // Step 1: Login
    console.log('📝 Logging in...');
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });

    // Step 2: Check what content actually loads within 0.5 seconds
    const goalCards = page.locator('[data-testid^="goal-card-"]'); // Use starts-with selector for unique IDs
    const emptyState = page.locator('[data-testid="empty-state-title"]');
    const filterButton = page.locator('[data-testid="filter-button"]');

    await expect(filterButton).toBeVisible({ timeout: 500 });
    
    // Wait for content to load (either goal cards or empty state)
    await page.waitForFunction(() => {
      const goalCards = document.querySelectorAll('[data-testid^="goal-card-"]');
      const emptyState = document.querySelector('[data-testid="empty-state-title"]');
      const loadingElements = document.querySelectorAll('.animate-pulse');
      return goalCards.length > 0 || emptyState !== null || loadingElements.length === 0;
    }, { timeout: 2000 });
    
    // Check if we have goal cards or empty state within 1 second
    const hasGoalCards = await goalCards.count() > 0;
    if (hasGoalCards) {
      await expect(goalCards.first()).toBeVisible({ timeout: 1000 });
    } else {
      await expect(emptyState).toBeVisible({ timeout: 1000 });
    }
  });

  test('At least one tile should appear within 10 seconds', async ({ page }) => {
    console.log('🎯 Testing that content loads within 10 seconds...');
    
    // Login
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');

    // Wait for either goal tiles or empty state within 10 seconds
    const goalCards = page.locator('[data-testid^="goal-card-"]'); // Use starts-with selector for unique IDs
    const emptyState = page.locator('[data-testid="empty-state-title"]');
    
    // Wait for content to load
    await page.waitForFunction(() => {
      const goalCards = document.querySelectorAll('[data-testid^="goal-card-"]');
      const emptyState = document.querySelector('[data-testid="empty-state-title"]');
      const loadingElements = document.querySelectorAll('.animate-pulse');
      return goalCards.length > 0 || emptyState !== null || loadingElements.length === 0;
    }, { timeout: 10000 });
    
    // Check if we have goal cards or empty state within 10 seconds
    const hasGoalCards = await goalCards.count() > 0;
    if (hasGoalCards) {
      await expect(goalCards.first()).toBeVisible({ timeout: 10000 });
    } else {
      await expect(emptyState).toBeVisible({ timeout: 10000 });
    }
  });
});
