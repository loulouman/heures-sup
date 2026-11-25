// Cache minimal pour rendre l'appli installable ; les appels Microsoft passent toujours par le réseau.
const CACHE = "heures-sup-v1";
const FICHIERS = ["./", "index.html", "msal-browser.min.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS))));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // login / Graph : jamais en cache
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
