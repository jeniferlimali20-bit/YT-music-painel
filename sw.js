const CACHE_NAME = 'yt-musc-v8';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'icon512.png'
];

self.addEventListener('install', event => {
  // Força o SW a se tornar ativo imediatamente
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  // Garante que o SW controle a página imediatamente
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

