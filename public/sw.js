
const CACHE_NAME = 'vision-board-v2';
const STATIC_CACHE = 'static-v2';
const IMAGES_CACHE = 'images-v2';
const API_CACHE = 'api-v2';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install service worker and cache initial resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)),
      caches.open(STATIC_CACHE),
      caches.open(IMAGES_CACHE),
      caches.open(API_CACHE)
    ])
  );
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!['vision-board-v2', 'static-v2', 'images-v2', 'api-v2'].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Unsplash images with aggressive caching
  if (url.hostname === 'images.unsplash.com') {
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request).then((response) => {
            if (response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              cache.put(request, responseClone);
            }
            return response;
          }).catch(() => {
            // Return a placeholder image if fetch fails
            return new Response('', { status: 204 });
          });
        });
      })
    );
    return;
  }

  // Handle Supabase API requests with short-term caching
  if (url.hostname.includes('supabase') && url.pathname.includes('/rest/v1/user_goals')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            const responseDate = new Date(response.headers.get('date') || '');
            const now = new Date();
            const oneMinute = 60 * 1000;
            
            if (now - responseDate < oneMinute) {
              return response;
            }
          }
          
          return fetch(request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              cache.put(request, responseClone);
            }
            return response;
          }).catch(() => {
            // Return cached response if available, even if stale
            return response || new Response('[]', { 
              status: 200, 
              headers: { 'Content-Type': 'application/json' } 
            });
          });
        });
      })
    );
    return;
  }

  // Handle static assets
  if (request.destination === 'script' || request.destination === 'style' || request.destination === 'document') {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Default network-first strategy for other requests
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
