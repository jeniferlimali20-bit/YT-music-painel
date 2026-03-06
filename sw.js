const CACHE_NAME = 'yt-musc-v8';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon512.png'
];

// Instalação: Força o novo Service Worker a assumir o controle imediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(err => console.log("Erro de cache:", err))
  );
});

// Ativação: Limpa caches antigos (V7 e anteriores)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log("Removendo cache antigo:", key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Fetch: Tenta buscar na rede primeiro para garantir que a V8 apareça.
// Se estiver sem internet, ele usa o cache.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a busca na rede funcionar, ele atualiza o cache e retorna a resposta
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Se falhar a rede, usa o cache
  );
});
