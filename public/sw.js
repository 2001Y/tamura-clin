const CACHE_NAME = 'medical-card-cache-v1';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/medical-card'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CACHE_URLS))
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('getUserMedia')) {
        // カメラアクセスのリクエストはキャッシュせず、常にネットワークから取得
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => response || fetch(event.request))
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
