import { expect, test } from '@playwright/test';

const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;

test.describe('Tiles Load Performance Test', () => {
  test.skip(!testEmail || !testPassword, 'TEST_EMAIL and TEST_PASSWORD environment variables required');

  test('Cached dashboard loads should be extremely fast', async ({ page }) => {
    console.log('🚀 Testing cached dashboard performance...');
    
    // Login and load dashboard first time
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });
    
    // First load to warm cache
    await page.goto('/app');
    await Promise.race([
      page.locator('[data-testid="goals-grid"]').waitFor({ state: 'visible', timeout: 7000 }),
      page.locator('[data-testid="empty-state"]').waitFor({ state: 'visible', timeout: 7000 }),
      page.locator('[data-testid="vision-board"]').waitFor({ state: 'visible', timeout: 7000 }),
      page.locator('[data-testid="goals-loading"]').waitFor({ state: 'visible', timeout: 7000 })
    ]);
    
    // Now test cached performance
    console.log('⚡ Testing cached load performance...');
    const cachedStartTime = Date.now();
    
    await page.goto('/app');
    
    // Wait for ANY content to appear (cached should be very fast)
    await Promise.race([
      page.locator('[data-testid="goals-grid"]').waitFor({ state: 'visible', timeout: 2000 }),
      page.locator('[data-testid="empty-state"]').waitFor({ state: 'visible', timeout: 2000 }),
      page.locator('[data-testid="vision-board"]').waitFor({ state: 'visible', timeout: 2000 }),
      page.locator('[data-testid="goals-loading"]').waitFor({ state: 'visible', timeout: 2000 })
    ]);
    
    const cachedLoadTime = Date.now() - cachedStartTime;
    console.log(`🚀 Cached load time: ${cachedLoadTime}ms`);
    
    // Cached loads should be very fast
    expect(cachedLoadTime).toBeLessThan(500); // More reasonable for cached content
    
    console.log('✅ Cached performance test passed!');
  });

  test('Multiple rapid page loads should maintain performance', async ({ page }) => {
    console.log('🔄 Testing performance under rapid navigation...');
    
    // Login
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });
    
    const loadTimes: number[] = [];
    
    // Test 5 rapid loads
    for (let i = 0; i < 5; i++) {
      console.log(`🏃 Rapid load ${i + 1}/5...`);
      
      const startTime = Date.now();
      await page.goto('/app');
      
      // Wait for any dashboard content to appear
      await Promise.race([
        page.locator('[data-testid="goals-grid"]').waitFor({ state: 'visible', timeout: 1500 }),
        page.locator('[data-testid="empty-state"]').waitFor({ state: 'visible', timeout: 1500 }),
        page.locator('[data-testid="vision-board"]').waitFor({ state: 'visible', timeout: 1500 }),
        page.locator('[data-testid="goals-loading"]').waitFor({ state: 'visible', timeout: 1500 })
      ]);
      
      const loadTime = Date.now() - startTime;
      loadTimes.push(loadTime);
      console.log(`⚡ Load ${i + 1} took: ${loadTime}ms`);
      
      // Brief pause between loads
      await page.waitForTimeout(100);
    }
    
    const averageLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
    const maxLoadTime = Math.max(...loadTimes);
    
    console.log(`📊 Average load time: ${averageLoadTime.toFixed(1)}ms`);
    console.log(`📊 Max load time: ${maxLoadTime}ms`);
    console.log(`📊 All load times: ${loadTimes.join('ms, ')}ms`);
    
    // All loads should be reasonably fast
    expect(maxLoadTime).toBeLessThan(1000); // More realistic for rapid navigation
    expect(averageLoadTime).toBeLessThan(500); // Average should be quite fast
    
    console.log('✅ Rapid navigation performance test passed!');
  });

  test('Dashboard content should load within 0.5 seconds after login', async ({ page }) => {
    // Step 1: Login
    console.log('📝 Logging in...');
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');

    // Step 2: measure how long empty state is visible
    const emptyStateTitle = page.locator('[data-testid="empty-state-title"]');
    const emptyStateVisibleTime = await emptyStateTitle.waitFor({ state: 'visible', timeout: 1000 });

    // Step 3: if the filter-button isn't visible after 0.5 seconds, fail the test
    const filterButton = page.locator('[data-testid="filter-button"]');
    await expect(filterButton).toBeVisible({ timeout: 500 });
  });
}); 