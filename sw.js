// sw.js - Version 3.61 FORCE UPDATE
const CACHE_NAME = 'zeiterfassung-v3.61-secure'; // Neuer Name zwingt zum Neuladen
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Installieren und altes Cache löschen
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Zwingt den Browser, den neuen Worker sofort zu nehmen
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Aktivieren und alte Caches aufräumen
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Alten Cache entfernen:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch-Strategie: Erst Netzwerk, dann Cache (damit Updates schneller sichtbar sind)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Neue Version vom Server holen und im Cache speichern
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request)) // Falls offline, nimm Cache
  );
});
