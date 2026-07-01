const CACHE_NAME = 'cache_@cachename';

const APP_SHELL = [
    './',
    './index.html',
    './favicon.svg',
    './script.js',
    './style.css',
];

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        await Promise.allSettled(
            APP_SHELL.map(url => cache.add(url))
        );

        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();

        await Promise.all(
            cacheNames
                .filter(name => name !== CACHE_NAME)
                .map(name => caches.delete(name))
        );

        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;

    // Сам SW не обрабатываем.
    if (url.pathname.endsWith('/sw.js')) return;

    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request);

        if (response && response.ok) {
            await cache.put('./index.html', response.clone());
        }

        return response;
    } catch (error) {
        return (
            await cache.match('./index.html') ||
            await cache.match('./') ||
            new Response('Offline', {
                status: 503,
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                },
            })
        );
    }
}

async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const response = await fetch(request);

        if (response && response.ok) {
            await cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        return new Response('Offline and resource not cached', {
            status: 503,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    }
}