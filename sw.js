self.addEventListener('install', (e) => {
  console.log('Service Worker instalado!');
  // Força o Service Worker novo a assumir o controle imediatamente
  self.skipWaiting(); 
});

self.addEventListener('activate', (e) => {
  // Garante que o SW controle a página na hora, sem precisar recarregar
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Necessário para o PWA ser considerado "instalável"
  e.respondWith(fetch(e.request));
});
