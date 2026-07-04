const CACHE_NAME = "travel-translation-memory-v06";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=6",
  "./app.js?v=6",
  "./storage.js?v=6",
  "./ocr.js?v=6",
  "./ai.js?v=6",
  "./manifest.webmanifest",
  "./favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
