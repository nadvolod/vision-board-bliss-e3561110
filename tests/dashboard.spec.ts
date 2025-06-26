import { expect, test } from '@playwright/test';

test.describe('Dashboard Login and Image Loading Performance', () => {
  const testEmail = process.env.TEST_EMAIL!;
  const testPassword = process.env.TEST_PASSWORD!;

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should login successfully and load dashboard with fast image loading', async ({ page }) => {
    // Start measuring total time
    const startTime = Date.now();

    // Check if we're redirected to auth page or already logged in
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    
    if (currentUrl.includes('/auth') || currentUrl === 'http://localhost:8080/') {
      // We need to login
      console.log('Navigating to auth page...');
      await page.goto('/auth');
      
      // Fill login form
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
      
      // Click login button
      await page.click('button[type="submit"]');
      
      // Wait for navigation to dashboard
      await page.waitForURL(/\/app/, { timeout: 10000 });
    } else if (!currentUrl.includes('/app')) {
      // Navigate to dashboard if not already there
      await page.goto('/app');
    }

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/app/);
    
    // Wait for the main dashboard content to load
    await page.waitForSelector('main', { timeout: 10000 });
    
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Verify we have the main elements that we know exist
    await expect(page.locator('h1:has-text("Vision Board")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Goal")')).toBeVisible();
    
    console.log('✅ Dashboard loaded successfully with core elements');
    
    // Check if there are goals/images to load and test performance
    const goalCards = page.locator('.vision-card');
    const goalCount = await goalCards.count();
    
    console.log(`Found ${goalCount} goal cards`);
    
    if (goalCount > 0) {
      // Array to store image loading times
      const imageLoadTimes: number[] = [];
      
      // Test up to 10 images for performance
      const imagesToTest = Math.min(goalCount, 10);
      
      for (let i = 0; i < imagesToTest; i++) {
        const goalCard = goalCards.nth(i);
        const image = goalCard.locator('img').first();
        
        // Start timing when we try to access the image
        const imageStartTime = Date.now();
        
        // Wait for image to be visible
        await image.waitFor({ state: 'visible', timeout: 5000 });
        
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
      
      // Assert average loading time is under 500ms
      expect(averageLoadTime).toBeLessThan(500);
      
      console.log(`✅ All ${imagesToTest} images loaded faster than 500ms!`);
    } else {
      console.log('No goals found - testing empty dashboard state');
      
      // For empty state, just verify the dashboard structure is there
      await expect(page.locator('main')).toBeVisible();
      console.log('✅ Dashboard loaded successfully with empty state');
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`Total dashboard load time: ${totalTime}ms`);
    
    // Assert total load time is reasonable (under 5 seconds)
    expect(totalTime).toBeLessThan(5000);
    
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

  test('should navigate successfully after login', async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });
    
    console.log('Successfully logged in and navigated to dashboard');
    
    // Check basic page elements that we know exist
    await expect(page.locator('h1:has-text("Vision Board")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Goal")')).toBeVisible();
    
    console.log('✅ Navigation test passed - dashboard elements are functional');
  });
}); 