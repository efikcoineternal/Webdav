// sw.js – minimal service worker for PWA
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    event.waitUntil(self.skipWaiting()); // activates immediately
});

self.addEventListener('fetch', (event) => {
    // optional: network‑first fallback – keeps the app fast
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
