export default {
  ci: {
    collect: {
      url: [
        'http://localhost:4173',
        'http://localhost:4173/auth'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: [
          '--no-sandbox',
          '--headless',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ],
        // Use desktop settings consistently
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        // Optimize for CI environment
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        // Skip PWA audits to focus on performance
        skipAudits: [
          'service-worker',
          'installable-manifest',
          'splash-screen',
          'themed-omnibox',
          'maskable-icon'
        ]
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}; 