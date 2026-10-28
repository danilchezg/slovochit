// Словочит service worker: keeps the whole app (shell, fonts, dictionary) available offline.
const VERSION = "__VERSION__";
const CACHE = "slovochit-" + VERSION;
const FILES = __FILES__;
const RT = "slovochit-rt"; // offline translator runtime: kept across app updates

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});
self.addEventListener("message", e => { if (e.data === "skip") self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("slovochit-") && k !== CACHE && k !== RT) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // API calls etc. go straight to the network
  e.respondWith((async () => {
    const cache = await caches.open(url.pathname.includes("/lib/tf/") ? RT : CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && url.pathname.match(/\.(json|woff2|png|js|mjs|wasm|css|html)$/)) cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === "navigate") return (await cache.match("./")) || (await cache.match("index.html"));
      throw err;
    }
  })());
});
