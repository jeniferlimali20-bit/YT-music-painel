self.addEventListener('install', (e) => {
  console.log('Service Worker instalado!');
});

self.addEventListener('fetch', (e) => {
  // Necessário para o PWA ser considerado "instalável"
  e.respondWith(fetch(e.request));
});
