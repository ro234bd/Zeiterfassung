// sw.js - Völlig neutralisiert und alter Cache wird gelöscht

self.addEventListener('install', (e) => {
  // Zwingt den Browser, diese neue (leere) Version sofort zu aktivieren
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Löscht alle alten Offline-Speicher (Caches), die Probleme machen
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Der Türsteher macht Feierabend: 
  // Alle Anfragen (Speichern, Laden) gehen direkt und unbearbeitet ans echte Internet
  return;
});
