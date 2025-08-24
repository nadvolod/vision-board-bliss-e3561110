import { expect, test } from '@playwright/test';

const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;

test.describe('Vision Board Performance Tests', () => {
  test.skip(!testEmail || !testPassword, 'TEST_EMAIL and TEST_PASSWORD environment variables required');

  test('Filter button should load within 300ms (mobile optimized)', async ({ page }) => {
    // Set mobile viewport for mobile testing
    await page.setViewportSize({ width: 375, height: 667 });
    
    console.log('📝 Testing mobile performance...');
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });

    // Critical UI elements should load immediately
    const filterButton = page.locator('[data-testid="filter-button"]');
    await expect(filterButton).toBeVisible({ timeout: 300 });
    
    console.log('✅ Filter button loaded within 300ms');
  });

  test('Goals should load within 1 second after login', async ({ page }) => {
    console.log('📝 Testing goal loading performance...');
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });

    // Wait for content to load (either goal cards or empty state)
    const goalCards = page.locator('[data-testid^="goal-card-"]'); 
    const emptyState = page.locator('[data-testid="empty-state-title"]');
    
    await page.waitForFunction(() => {
      const goalCards = document.querySelectorAll('[data-testid^="goal-card-"]');
      const emptyState = document.querySelector('[data-testid="empty-state-title"]');
      const loadingSpinner = document.querySelector('.animate-spin');
      return goalCards.length > 0 || emptyState !== null || !loadingSpinner;
    }, { timeout: 1000 });
    
    // Verify content is visible
    const hasGoalCards = await goalCards.count() > 0;
    if (hasGoalCards) {
      await expect(goalCards.first()).toBeVisible({ timeout: 1000 });
      console.log(`✅ ${await goalCards.count()} goal cards loaded successfully`);
    } else {
      await expect(emptyState).toBeVisible({ timeout: 1000 });
      console.log('✅ Empty state loaded successfully');
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
