const CACHE_NAME = 'flux-os-cache-v3';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './logo.png',
  // Cache all the CDNs so they work offline
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap'
];

// Install event: Download everything the first time
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching FLUX OS Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch event: Serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found, otherwise fetch from internet
      return cachedResponse || fetch(event.request);
    })
  );
});

// Activate event: Clean up old caches if we update the app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});