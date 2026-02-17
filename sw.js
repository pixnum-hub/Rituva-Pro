const CACHE_NAME = "rituva-cache-v1";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./style.css", // if you split CSS
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install SW and cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate and clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch event: serve cached first, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response; // Serve cached
      return fetch(event.request).catch(() => {
        // Fallback offline response if needed
        if (event.request.destination === "document") return caches.match("./index.html");
      });
    })
  );
});
