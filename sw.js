/* Painel GWA — service worker: permite instalar como app e abre a última versão se ficar sem internet.
   Os dados (planilhas do Google) nunca são guardados aqui; só a página. */
const CACHE = 'gwa-painel-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.add('/')).catch(() => {})) });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.mode !== 'navigate') return; /* só a página; o resto vai direto para a rede */
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put('/', cp)) } return res })
    .catch(() => caches.match('/')));
});
