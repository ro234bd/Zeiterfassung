// sw.js - Völlig neutralisiert. Lässt alle Cloud-Speicherungen durch.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Löscht alle alten Caches, die Probleme machen
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Ignoriert alle Anfragen und lässt sie direkt ans Internet durch
  return;
});
