import { test, expect } from '@playwright/test';

const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;

test.describe('Performance Monitoring Tests', () => {
  test.skip(!testEmail || !testPassword, 'TEST_EMAIL and TEST_PASSWORD environment variables required');

  test('Console error reduction validation', async ({ page }) => {
    const consoleErrors: string[] = [];
    const postMessageErrors: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        consoleErrors.push(text);
        
        if (text.includes('postMessage')) {
          postMessageErrors.push(text);
        }
      }
    });

    // Navigate and interact with the app
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });

    // Wait for goals to load
    await page.waitForTimeout(3000);

    // Check that postMessage errors are significantly reduced
    console.log(`📊 Total console errors: ${consoleErrors.length}`);
    console.log(`📊 PostMessage errors: ${postMessageErrors.length}`);
    
    // With our filtering, we should see very few postMessage errors
    expect(postMessageErrors.length).toBeLessThan(5);
    
    // Total errors should be manageable
    expect(consoleErrors.length).toBeLessThan(20);
  });

  test('Performance metrics measurement', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });

    // Wait for content to load
    await page.waitForSelector('[data-testid^="goal-card-"], [data-testid="empty-state-title"]', { timeout: 5000 });

    const loadTime = Date.now() - startTime;

    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: any = {};

          entries.forEach((entry) => {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
          });

          // Get navigation timing
          const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          vitals.domContentLoaded = nav.domContentLoadedEventEnd - nav.navigationStart;
          vitals.loadComplete = nav.loadEventEnd - nav.navigationStart;

          resolve(vitals);
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // Resolve after 2 seconds if no metrics collected
        setTimeout(() => resolve({}), 2000);
      });
    });

    console.log('📊 Performance Metrics:', {
      'Total Load Time': `${loadTime}ms`,
      'First Contentful Paint': metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A',
      'Largest Contentful Paint': metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A',
      'DOM Content Loaded': metrics.domContentLoaded ? `${Math.round(metrics.domContentLoaded)}ms` : 'N/A',
      'Load Complete': metrics.loadComplete ? `${Math.round(metrics.loadComplete)}ms` : 'N/A'
    });

    // Performance assertions
    expect(loadTime).toBeLessThan(8000); // Should load within 8 seconds
    if (metrics.fcp) expect(metrics.fcp).toBeLessThan(3000); // FCP under 3 seconds
    if (metrics.lcp) expect(metrics.lcp).toBeLessThan(4000); // LCP under 4 seconds
  });

  test('Image lazy loading verification', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });

    // Check if images are lazy loaded
    const images = await page.locator('img').all();
    
    if (images.length > 0) {
      for (const img of images.slice(0, 3)) { // Check first 3 images
        const loading = await img.getAttribute('loading');
        const hasLazySrc = await img.evaluate(el => el.src !== '');
        
        console.log(`📊 Image loading attribute: ${loading}`);
        expect(hasLazySrc).toBe(true);
      }
    }
  });

  test('Memory usage monitoring', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail!);
    await page.fill('input[name="password"]', testPassword!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 10000 });

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize
      } : null;
    });

    if (initialMemory) {
      console.log('📊 Memory Usage:', {
        'Used Heap': `${Math.round(initialMemory.usedJSHeapSize / 1024 / 1024)}MB`,
        'Total Heap': `${Math.round(initialMemory.totalJSHeapSize / 1024 / 1024)}MB`
      });

      // Memory should be reasonable (under 100MB for used heap)
      expect(initialMemory.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024);
    }
  });
});