import { expect, test } from '@playwright/test';

test.describe('Offline Mode', () => {
  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;
  
  test('images load even when the app is offline', async ({ page }) => {
    // Set longer timeout for this test since it needs time for image caching
    test.setTimeout(30000);
    
    // Navigate directly to the auth page
    await page.goto('/auth');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Login
    await page.getByRole('textbox', { name: 'Email' }).fill(`${testEmail}`);
    await page.getByRole('textbox', { name: 'Password' }).fill(`${testPassword}`);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for navigation to complete
    await page.waitForURL('**/app', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Check if the vision board is loaded
    await expect(page.locator('[data-testid="vision-board"]')).toBeVisible();
    
    // Check if filter button is visible (this should always be visible)
    await expect(page.locator('[data-testid="filter-button"]')).toBeVisible();
    
    // Wait for the content to load (either goals or empty state)
    await page.waitForFunction(() => {
      const goalCards = document.querySelectorAll('[data-testid^="goal-card-"]');
      const emptyState = document.querySelector('[data-testid="empty-state-title"]');
      const loadingElements = document.querySelectorAll('.animate-pulse');
      return goalCards.length > 0 || emptyState !== null || loadingElements.length === 0;
    }, { timeout: 15000 });
    
    // Check for the specific placeholder goals that should NOT be visible
    const placeholderGoal1 = page.locator('text=Master React development');
    const placeholderGoal2 = page.locator('text=Run a marathon');
    
    const hasPlaceholder1 = await placeholderGoal1.isVisible();
    const hasPlaceholder2 = await placeholderGoal2.isVisible();
    
    console.log('Has placeholder goal 1 (Master React development):', hasPlaceholder1);
    console.log('Has placeholder goal 2 (Run a marathon):', hasPlaceholder2);
    
    // The main bug fix: these placeholder goals should NOT be visible
    expect(hasPlaceholder1).toBe(false);
    expect(hasPlaceholder2).toBe(false);
    
    // Check if there are any goal cards OR if we're in empty state
    const goalCards = await page.locator('[data-testid^="goal-card-"]');
    const emptyState = await page.locator('[data-testid="empty-state-title"]');
    
    const hasGoalCards = await goalCards.count() > 0;
    const hasEmptyState = await emptyState.isVisible();
    
    console.log('Has goal cards:', hasGoalCards);
    console.log('Has empty state:', hasEmptyState);
    
    // Either we should have goal cards OR empty state, but not placeholder goals
    expect(hasGoalCards || hasEmptyState).toBe(true);
    
    if (hasGoalCards) {
      console.log('✅ Found real goal cards (not placeholders)');
      
      // Test offline functionality with real goals
      await page.waitForTimeout(10000); // Wait for images to cache
      
      const cardCount = await goalCards.count();
      console.log('Number of goal cards:', cardCount);
      
      // Check that images are visible
      const goalImages = await page.locator('[data-testid^="goal-card-"] img');
      await expect(goalImages.first()).toBeVisible();
      
      // Go offline
      await page.context().setOffline(true);
      await page.waitForTimeout(2000);
      
      // Verify offline indicator appears
      await expect(page.locator('.fixed.bottom-4.right-4').getByText('Offline Mode')).toBeVisible();
      
      // Test that the app still works offline - goals should still be visible
      await expect(goalCards.first()).toBeVisible();
      
      // Test that images are still visible offline (cached by service worker)
      await expect(goalImages.first()).toBeVisible();
      
      console.log('✅ Offline mode test passed - images load even when offline');
    } else if (hasEmptyState) {
      console.log('✅ App loaded successfully with empty state - no placeholder goals shown');
    }
  });
}); 