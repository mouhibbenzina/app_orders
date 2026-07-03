const CACHE = 'app-orders-cache-v1';
const URLS = ['/', '/index.html', '/css/style.css', '/js/api.js', '/js/auth.js', '/js/app.js',
  '/js/screens/login.js', '/js/screens/agent-home.js', '/js/screens/new-request.js',
  '/js/screens/dg-home.js', '/js/screens/guard-home.js', '/js/screens/request-detail.js',
  '/js/screens/history.js', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(URLS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
