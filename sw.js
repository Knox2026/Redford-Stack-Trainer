const CACHE_NAME = 'stack-trainer-v1.5.0'; // Increment this!
const ASSETS = [
  'index.html',
  'manifest.json',
  'rsl.png',
  'sw.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // <--- CRITICAL: Forces the new version to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all([
        self.clients.claim(), // <--- CRITICAL: Takes control of the current page instantly
        ...keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
