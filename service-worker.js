const cache_name = "cache_1.0.0";
const assets = [
  "/todo/",
  "https://unpkg.com/dexie@latest/dist/modern/dexie.mjs",
  "/todo/index.html",
  "/todo/main.js",
  "/todo/reset.css",
  "/todo/main.css",
  "/todo/icons/64.png",
  "/todo/icons/128.png",
  "/todo/icons/256.png",
  "/todo/icons/512.png",
];

self.addEventListener("install", (evt) => {
  console.log("Service worker installed");
  evt.waitUntil(
    caches.open(cache_name).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", (evt) => {
  console.log("Service worker activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== cache_name)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", function (e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});