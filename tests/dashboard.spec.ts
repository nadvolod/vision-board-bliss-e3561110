import { expect, test } from '@playwright/test';

const testEmail = process.env.TEST_EMAIL || 'nadvolod@gmail.com';
const testPassword = process.env.TEST_PASSWORD || 'Test12345!';

test.describe('Dashboard Login and Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up performance timing
    await page.addInitScript(() => {
      window.performance.mark('dashboard-test-start');
    });
  });

  test('should login successfully and load dashboard in under 0.5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    // Login
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    const loginStartTime = Date.now();
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL(/\/app/, { timeout: 10000 });
    const loginTime = Date.now() - loginStartTime;
    console.log(`Login time: ${loginTime}ms`);
    
    // Mark dashboard load start
    const dashboardStartTime = Date.now();
    
    // Wait for dashboard to be fully loaded - use first() to handle multiple elements
    await expect(page.locator('h1, h2').filter({ hasText: /Vision Board|My Current Goals/ }).first()).toBeVisible({ timeout: 2000 });
    
    // Wait for main content area to be visible
    await expect(page.locator('main')).toBeVisible();
    
    // Verify dashboard is interactive (Add Goal button is clickable)
    const addButton = page.locator('button', { hasText: /Add Goal/i });
    await expect(addButton).toBeVisible();
    
    const dashboardLoadTime = Date.now() - dashboardStartTime;
    console.log(`Dashboard load time: ${dashboardLoadTime}ms`);
    
    // Assert dashboard loads in under 500ms
    expect(dashboardLoadTime).toBeLessThan(500);
    
    // Check for goals and test image loading performance if they exist
    const goalCards = page.locator('.vision-card, [data-testid="goal-card"]').or(
      page.locator('div').filter({ hasText: /goal/i }).locator('img')
    );
    
    const goalCount = await goalCards.count();
    
    console.log(`Found ${goalCount} goal cards`);
    
    if (goalCount > 0) {
      // Array to store image loading times
      const imageLoadTimes: number[] = [];
      
      // Test up to 5 images for performance (reduced from 10 for faster tests)
      const imagesToTest = Math.min(goalCount, 5);
      
      for (let i = 0; i < imagesToTest; i++) {
        const goalCard = goalCards.nth(i);
        const image = goalCard.locator('img').first();
        
        // Start timing when we try to access the image
        const imageStartTime = Date.now();
        
        // Wait for image to be visible
        await image.waitFor({ state: 'visible', timeout: 2000 });
        
        // Check if image is loaded
        await image.evaluate((img: HTMLImageElement) => {
          return new Promise((resolve) => {
            if (img.complete && img.naturalHeight !== 0) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true); // Count error as "loaded" for timing
            }
          });
        });
        
        const imageLoadTime = Date.now() - imageStartTime;
        imageLoadTimes.push(imageLoadTime);
        
        console.log(`Image ${i + 1} loaded in ${imageLoadTime}ms`);
        
        // Assert that each image loads within 500ms
        expect(imageLoadTime).toBeLessThan(500);
      }
      
      // Calculate and verify average loading time
      const averageLoadTime = imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length;
      console.log(`Average image loading time: ${averageLoadTime}ms`);
      
      // Assert average loading time is under 300ms (stricter than individual images)
      expect(averageLoadTime).toBeLessThan(300);
      
      console.log(`✅ All ${imagesToTest} images loaded faster than expected!`);
    } else {
      console.log('No goals found - testing empty dashboard state');
      
      // For empty state, just verify the dashboard structure is there
      await expect(page.locator('h2').filter({ hasText: /Welcome to Your Vision Board/i })).toBeVisible();
      console.log('✅ Dashboard loaded successfully with empty state');
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`Total test time: ${totalTime}ms`);
    
    // Assert total time is reasonable (under 3 seconds for complete flow)
    expect(totalTime).toBeLessThan(3000);
    
    console.log('✅ Dashboard performance test passed!');
  });

  test('should handle image loading errors gracefully', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });
    
    // Check if there are images and verify they have fallback handling
    const images = page.locator('img');
    const imageCount = await images.count();
    
    console.log(`Found ${imageCount} images on the page`);
    
    if (imageCount > 0) {
      // Test first few images for proper error handling
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const image = images.nth(i);
        
        // Check if image has proper alt text
        const altText = await image.getAttribute('alt');
        expect(altText).toBeTruthy();
        
        // Verify image loads or has fallback
        const isLoaded = await image.evaluate((img: HTMLImageElement) => {
          return img.complete && img.naturalHeight !== 0;
        });
        
        console.log(`Image ${i + 1}: alt="${altText}", loaded=${isLoaded}`);
      }
      
      console.log('✅ Images have proper alt text and load handling');
    } else {
      console.log('No images found on page - empty state verified');
    }
  });

  test('should verify core navigation elements load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    // Login
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });
    
    // Verify critical UI elements are present and interactive
    const elementsToCheck = [
      { selector: 'button', text: /Add Goal/i, name: 'Add Goal button' },
      { selector: 'h1, h2', text: /Vision Board|My Current Goals/i, name: 'Main heading' },
      { selector: 'main', text: '', name: 'Main content area' },
    ];
    
    for (const element of elementsToCheck) {
      const elementStartTime = Date.now();
      const locator = element.text 
        ? page.locator(element.selector).filter({ hasText: element.text }).first()
        : page.locator(element.selector);
      
      await expect(locator).toBeVisible({ timeout: 1000 });
      
      const elementLoadTime = Date.now() - elementStartTime;
      console.log(`${element.name} loaded in ${elementLoadTime}ms`);
      
      // Each critical element should load within 200ms
      expect(elementLoadTime).toBeLessThan(200);
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`Navigation elements test completed in ${totalTime}ms`);
    
    console.log('✅ All navigation elements loaded quickly!');
  });
}); 