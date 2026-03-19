// WICHTIG: Wenn du ein großes Update machst, ändere hier die Versionsnummer (z.B. auf v2, v3 etc.)
const CACHE_NAME = 'ze-cache-chirstütz-v2'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// INSTALL-EVENT: Dateien speichern und den Service Worker sofort aktivieren
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Sorgt dafür, dass der neue Service Worker nicht in der Warteschlange hängen bleibt
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// ACTIVATE-EVENT: Alte Caches löschen, damit kein Datenmüll übrig bleibt
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Lösche alten Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Der neue Service Worker übernimmt sofort die Kontrolle über die Seite
});

// FETCH-EVENT: Network-First Strategie (Netzwerk zuerst, dann Cache)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Wenn wir online sind: Antwort klonen, in den Cache legen (fürs nächste Mal offline) und ausliefern
        if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Wenn wir offline sind (fetch schlägt fehl): Datei aus dem Cache laden
        return caches.match(e.request);
      })
  );
});
