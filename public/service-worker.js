// Service Worker for Vision Board Bliss
const CACHE_NAME = 'vision-board-bliss-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json'
];

// Install event - cache core assets with error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          STATIC_ASSETS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => self.skipWaiting())
      .catch(err => console.warn('Service worker install failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
      .catch(err => console.warn('Service worker activation failed:', err))
  );
});

// Fetch event - handle requests intelligently
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and extensions
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.startsWith('moz-extension://')) {
    return;
  }

  // For API requests, always try network first
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Fallback to cache only for critical requests
          return caches.match(event.request);
        })
    );
    return;
  }

  // For same-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then((response) => {
              // Only cache successful responses
              if (response && response.status === 200 && response.type === 'basic') {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  })
                  .catch(err => console.warn('Failed to cache response:', err));
              }
              return response;
            })
            .catch(() => {
              // For navigation requests, return the cached root
              if (event.request.mode === 'navigate') {
                return caches.match('/');
              }
              throw new Error('No cached response available');
            });
        })
    );
  }
});