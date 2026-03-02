const CACHE = 'dsa-v2';

const ASSETS = [
  '/',
  '/index.html',
  '/script.js',
  '/img/hero.jpg',
  '/img/philosophy-bg.jpg',
  '/img/portfolio/1.jpg',
  '/img/portfolio/2.jpg',
  '/img/portfolio/3.jpg',
  '/img/portfolio/4.jpg',
  '/img/portfolio/5.jpg',
  '/img/portfolio/6.jpg',
  '/img/portfolio/7.jpg',
  '/img/portfolio/8.jpg',
  '/fonts/ibmplexmono-v20--F63fjptAgt5VM-kVkqdyU8n1i8q131nj-o.woff2',
  '/fonts/ibmplexmono-v20--F63fjptAgt5VM-kVkqdyU8n1iAq131nj-otFQ.woff2',
  '/fonts/ibmplexmono-v20--F63fjptAgt5VM-kVkqdyU8n1iEq131nj-otFQ.woff2',
  '/fonts/ibmplexmono-v20--F63fjptAgt5VM-kVkqdyU8n1iIq131nj-otFQ.woff2',
  '/fonts/ibmplexmono-v20--F63fjptAgt5VM-kVkqdyU8n1isq131nj-otFQ.woff2',
  '/fonts/ibmplexmono-v20--F6qfjptAgt5VM-kVkqdyU8n3twJwl1FgsAXHNlYzg.woff2',
  '/fonts/ibmplexmono-v20--F6qfjptAgt5VM-kVkqdyU8n3twJwl5FgsAXHNlYzg.woff2',
  '/fonts/ibmplexmono-v20--F6qfjptAgt5VM-kVkqdyU8n3twJwl9FgsAXHNlYzg.woff2',
  '/fonts/ibmplexmono-v20--F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgsAXHNk.woff2',
  '/fonts/ibmplexmono-v20--F6qfjptAgt5VM-kVkqdyU8n3twJwlRFgsAXHNlYzg.woff2',
  '/fonts/instrumentsans-v4-pxigypc9vsFDm051Uf6KVwgkfoSbSnNPooZAN0lInHGpCWNE27lgU-XJojENuu-2oy4H28zdQwQzNA.woff2',
  '/fonts/instrumentsans-v4-pxigypc9vsFDm051Uf6KVwgkfoSbSnNPooZAN0lInHGpCWNE27lgU-XJojENuu-2oyAH28zdQwQzNOgX.woff2',
  '/fonts/instrumentsans-v4-pxiTypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr0She1ZuWi3hKpA.woff2',
  '/fonts/instrumentsans-v4-pxiTypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr0SZe1ZuWi3g.woff2',
  '/fonts/lora-v37-0QIhMX1D_JOuMw_LIftLtfOm8w.woff2',
  '/fonts/lora-v37-0QIhMX1D_JOuMw_LJftLtfOm84TX.woff2',
  '/fonts/lora-v37-0QIhMX1D_JOuMw_LL_tLtfOm84TX.woff2',
  '/fonts/lora-v37-0QIhMX1D_JOuMw_LLPtLtfOm84TX.woff2',
  '/fonts/lora-v37-0QIhMX1D_JOuMw_LLvtLtfOm84TX.woff2',
  '/fonts/lora-v37-0QIhMX1D_JOuMw_LT_tLtfOm84TX.woff2',
  '/fonts/lora-v37-0QIhMX1D_JOuMw_LXftLtfOm84TX.woff2',
  '/fonts/lora-v37-0QIvMX1D_JOuM2T7I_FMl_GW8g.woff2',
  '/fonts/lora-v37-0QIvMX1D_JOuM3b7I_FMl_GW8g.woff2',
  '/fonts/lora-v37-0QIvMX1D_JOuMw77I_FMl_GW8g.woff2',
  '/fonts/lora-v37-0QIvMX1D_JOuMwf7I_FMl_GW8g.woff2',
  '/fonts/lora-v37-0QIvMX1D_JOuMwr7I_FMl_E.woff2',
  '/fonts/lora-v37-0QIvMX1D_JOuMwT7I_FMl_GW8g.woff2',
  '/fonts/lora-v37-0QIvMX1D_JOuMwX7I_FMl_GW8g.woff2',
];

// Pre-cache all assets on install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Delete old caches on activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first for assets, network-first for HTML
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Network-first for HTML navigation (keeps page fresh)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for everything else (images, fonts, JS, CSS)
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
