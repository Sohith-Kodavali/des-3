// ABC Kitchen — Service Worker
const CACHE = 'abc3-shell-v2';
const SHELL = ['./','./index.html','./menu.html','./css/style.css','./js/app.js','./js/site-data.js','./js/supabase-client.js','./js/backend.js','./manifest.json','./favicon.svg'];
// Note: admin.html is intentionally not pre-cached — keeps admin always fresh.

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req).then((cached) => {
    const net = fetch(req).then((res) => {
      if (res && res.ok) { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(req, clone)); }
      return res;
    }).catch(() => cached);
    return cached || net;
  }));
});
