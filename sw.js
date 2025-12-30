const VERSION = 'yw-cdn-v1';
const CORE = ['/', '/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(CORE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(req);
    const networkPromise = fetch(req).then(res => {
      if (res.ok && (res.type === 'basic' || res.type === 'default')) {
        cache.put(req, res.clone());
      }
      return res;
    }).catch(() => cached || Promise.reject('offline'));

    return cached || networkPromise;
  })());
});
