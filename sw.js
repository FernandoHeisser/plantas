// Service worker do Projeto Casa (PWA) — sem biblioteca.
// Subir CACHE ao mudar a lista de pré-cache ou a estratégia (o activate apaga as versões antigas).
const CACHE = 'casa-v1';

// Site de arquivo único: a página "/" (index.html) + ícones/manifest + libs CDN de versão fixa.
const SHELL = [
    '/',
    '/manifest.webmanifest',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-maskable-512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-32.png',
];
const CDN = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/three@0.128.0/build/three.min.js',
    'https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js',
    'https://unpkg.com/three@0.128.0/examples/js/environments/RoomEnvironment.js',
    'https://unpkg.com/three@0.128.0/examples/js/utils/BufferGeometryUtils.js',
];
// Origens imutáveis (URL versionada) → cache primeiro. Tiles de satélite (ESRI) NÃO entram:
// são muitos e grandes; offline o mapa abre sem o fundo de satélite.
const IMMUTABLE = ['https://unpkg.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

self.addEventListener('install', e => {
    e.waitUntil((async () => {
        const c = await caches.open(CACHE);
        await c.addAll(SHELL);
        // CDN: falha isolada não derruba a instalação (é guardado de novo no 1º uso).
        await Promise.allSettled(CDN.map(u => c.add(u)));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', e => {
    e.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // Navegação: rede primeiro, cache como reserva. Todas as rotas (/v2, /v3, /v0.x…) são
    // a mesma index.html (SPA), então a reserva é sempre "/".
    if (req.mode === 'navigate') {
        e.respondWith((async () => {
            try {
                const res = await fetch(req);
                if (res.ok) (await caches.open(CACHE)).put('/', res.clone());
                return res;
            } catch {
                return (await caches.match('/')) || Response.error();
            }
        })());
        return;
    }

    // Arquivos do próprio site: cache primeiro, atualizando em segundo plano. Nunca o sw.js.
    if (url.origin === self.location.origin) {
        if (url.pathname === '/sw.js') return;
        e.respondWith((async () => {
            const c = await caches.open(CACHE);
            const hit = await c.match(req);
            const net = fetch(req).then(res => {
                if (res.ok) c.put(req, res.clone());
                return res;
            }).catch(() => hit);
            if (hit) { e.waitUntil(net); return hit; }
            return net;
        })());
        return;
    }

    // Libs CDN e fontes (URLs versionadas): cache primeiro; guarda no 1º uso.
    if (IMMUTABLE.includes(url.origin)) {
        e.respondWith((async () => {
            const c = await caches.open(CACHE);
            const hit = await c.match(req, { ignoreVary: true });
            if (hit) return hit;
            const res = await fetch(req);
            if (res.ok || res.type === 'opaque') c.put(req, res.clone());
            return res;
        })());
    }
});
