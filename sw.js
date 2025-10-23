// Versión actual de la aplicación
const VERSION = "v1.0.0";
const CACHE_NAME = "donantes-" + VERSION;

// Archivos a cachear para funcionamiento offline
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/register.html",
  "/donationcenter.html",
  "/styles.css",
  "/script.js",
  "/firebase.js",
  "/assets/logo.png",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;600;700&display=swap"
];

// Instalar y cachear los recursos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Archivos cacheados correctamente");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar y limpiar versiones antiguas del caché
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  console.log("Service Worker activado, versión:", VERSION);
});

// Interceptar peticiones y servir desde el caché si está disponible
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna desde el caché o hace la petición en línea
      return response || fetch(event.request);
    })
  );
});
