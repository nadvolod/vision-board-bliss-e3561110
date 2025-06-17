
const CACHE_NAME = 'vision-board-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Cache Unsplash images aggressively
const UNSPLASH_CACHE = 'unsplash-images-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Cache Unsplash images with long expiry
  if (event.request.url.includes('images.unsplash.com')) {
    event.respondWith(
      caches.open(UNSPLASH_CACHE).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((response) => {
            // Cache successful responses for 1 week
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Cache API responses for 5 minutes
  if (event.request.url.includes('/rest/v1/user_goals')) {
    event.respondWith(
      caches.open('api-cache-v1').then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            const responseDate = new Date(response.headers.get('date'));
            const now = new Date();
            const fiveMinutes = 5 * 60 * 1000;
            
            if (now - responseDate < fiveMinutes) {
              return response;
            }
          }
          
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Default fetch for other requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
