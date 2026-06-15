const CACHE_NAME = 'peaklab-v2';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Continue even if some files fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Bypass everything in dev / Vite-served URLs — let the browser fetch directly.
  const isDevHost =
    url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.local');
  const isViteInternal =
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('/.vite/') ||
    url.searchParams.has('t') ||
    url.searchParams.has('import') ||
    url.searchParams.has('v');

  if (isDevHost || isViteInternal) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return (
            response ||
            new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
            })
          );
        });
      })
  );
});
