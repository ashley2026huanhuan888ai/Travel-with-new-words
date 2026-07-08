const CACHE_NAME = "travel-translation-memory-v16";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=16",
  "./app.js?v=16",
  "./storage.js?v=16",
  "./ocr.js?v=16",
  "./ai.js?v=16",
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
