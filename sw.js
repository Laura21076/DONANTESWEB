const CACHE_NAME = "donantes-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/register.html",
  "/styles.css",
  "/script.js",
  "/firebase.js",
  "/assets/logo.png"
];

// Instalar y cachear los recursos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Archivos cacheados");
      return cache.addAll(urlsToCache);
    })
  );
});

// Servir contenido desde caché
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
