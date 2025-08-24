import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  loadTime?: number;
}

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.fcp = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            metricsRef.current.lcp = entry.startTime;
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metricsRef.current.cls = (metricsRef.current.cls || 0) + (entry as any).value;
            }
            break;
          case 'first-input':
            metricsRef.current.fid = (entry as any).processingStart - entry.startTime;
            break;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    } catch (e) {
      // Some browsers might not support all entry types
      console.warn('Performance observer not fully supported');
    }

    // Monitor navigation timing
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const nav = navigationEntries[0];
      metricsRef.current.ttfb = nav.responseStart - nav.requestStart;
      metricsRef.current.loadTime = nav.loadEventEnd - nav.fetchStart;
    }

    // Log metrics after page load
    const logMetrics = () => {
      const metrics = metricsRef.current;
      console.log('📊 Performance Metrics:', {
        'First Contentful Paint (FCP)': metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A',
        'Largest Contentful Paint (LCP)': metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A',
        'Cumulative Layout Shift (CLS)': metrics.cls ? metrics.cls.toFixed(3) : 'N/A',
        'First Input Delay (FID)': metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A',
        'Time to First Byte (TTFB)': metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A',
        'Load Time': metrics.loadTime ? `${Math.round(metrics.loadTime)}ms` : 'N/A'
      });
    };

    // Log after 3 seconds to capture most metrics
    const timeout = setTimeout(logMetrics, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return metricsRef.current;
};