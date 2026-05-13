// WICHTIG: Cache-Version auf v3 erhöht, um das Update zu erzwingen
const CACHE_NAME = 'ze-cache-chirstütz-v3'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Löscht ALLES, was nicht v3 heißt
          if (cacheName !== CACHE_NAME) {
            console.log('Update: Lösche alten Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); 
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
