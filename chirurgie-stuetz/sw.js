// ==========================================
// DER KILL-SWITCH (Anti-Cache)
// ==========================================

self.addEventListener('install', (e) => {
  // Überspringt die Wartezeit und aktiviert sich sofort
  self.skipWaiting(); 
});

self.addEventListener('activate', (e) => {
  // Radikale Säuberung: Löscht JEDEN Cache, den diese App jemals angelegt hat
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Kill-Switch feuert: Lösche Cache ->', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim(); 
});

self.addEventListener('fetch', (e) => {
  // Bypass: Holt die Daten IMMER frisch aus dem Internet. 
  // Es wird absolut NICHTS mehr in einen Offline-Cache gelegt!
  e.respondWith(
    fetch(e.request).catch((err) => {
      console.log("Netzwerkfehler oder Offline:", err);
      // Wenn das Internet komplett weg ist, sucht er als letzten Ausweg im 
      // (hoffentlich leeren) Cache, aber speichert von sich aus nie wieder etwas ab.
      return caches.match(e.request);
    })
  );
});
