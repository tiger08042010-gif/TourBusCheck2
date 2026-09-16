const CACHE_NAME = "tour-bus-check-v2";

const FILES_TO_CACHE = [
  "./",
  "./login.html",
  "./dashboard.html",
  "./bus.html",
  "./groups.html",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
