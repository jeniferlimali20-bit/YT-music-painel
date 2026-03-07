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
// 1. Gera o formato XXX-XXX-XXX
function gerarCodigoKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const s = () => Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${s()}-${s()}-${s()}`;
}

// 2. Envia para o Firebase e Copia
function gerarESalvarKey() {
    const novaKey = gerarCodigoKey();
    
    // Salva na pasta 'keys' dentro do seu banco
    database.ref('keys/' + novaKey).set({
        hwid: "",          // Começa vazio para o cliente preencher no 1º uso
        status: "ativo",
        criado_em: new Date().toLocaleString()
    }).then(() => {
        document.getElementById('new-key-value').value = novaKey;
        navigator.clipboard.writeText(novaKey); // Copia pro seu celular
        alert("Key " + novaKey + " salva e copiada!");
    }).catch(err => alert("Erro: " + err.message));
}

// 3. Comando secreto: 5 cliques no Título H1 para abrir o painel
let cliques = 0;
const titulo = document.querySelector('h1'); // Ou o ID do seu título
if(titulo) {
    titulo.onclick = () => {
        cliques++;
        if(cliques >= 5) {
            document.getElementById('admin-panel').style.display = 'block';
            cliques = 0;
        }
    };
}

