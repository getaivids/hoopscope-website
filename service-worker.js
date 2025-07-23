/**
 * Hoopscope Service Worker
 * Provides caching and offline capabilities
 * 
 * @version 1.0.0
 */

const CACHE_NAME = 'hoopscope-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/js/api.js',
  '/js/main.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap',
  'https://cdn.tailwindcss.com'
];

// Install event - precache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Pre-caching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('fonts.googleapis.com') &&
      !event.request.url.includes('fonts.gstatic.com')) {
    return;
  }
  
  // For API requests, use network-first strategy
  if (event.request.url.includes('/api/')) {
    return event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
  }
  
  // For image requests, use cache-first strategy
  if (event.request.destination === 'image') {
    return event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // If image is in cache, serve it
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise fetch from network and cache
          return fetch(event.request)
            .then(response => {
              // Clone the response to store in cache
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(error => {
              console.error('Fetch failed for image:', error);
              // Return a placeholder image or error response
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#333"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#fff">Image Error</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            });
        })
    );
  }
  
  // For other assets, use stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Update cache with fresh response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
              
            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return new Response('Network error occurred', { status: 408, headers: { 'Content-Type': 'text/plain' } });
          });
          
        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  const title = 'Hoopscope';
  const options = {
    body: event.data.text() || 'New updates available!',
    icon: '/icon-192x192.png',
    badge: '/badge-96x96.png'
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window client is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});