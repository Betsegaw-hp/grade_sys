importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

// This will work!
workbox.routing.registerRoute(
({request}) => request.destination === 'image',
new workbox.strategies.CacheFirst()
);

const CACHE_NAME = 'static-cache';
const urlsToCache = [
  '.',
  'index.html',
  'styles.css',
  'main.js',
  'Screenshot-of-app.png',
  'grade.png',
  'manifest.webmanifest',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        return response || fetchAndCache(event.request);
      })
    );
  });
  
  function fetchAndCache(url) {
    return fetch(url)
    .then(function(response) {
      // Check if we received a valid response
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return caches.open(CACHE_NAME)
      .then(function(cache) {
        cache.put(url, response.clone());
        return response;
      });
    })
    .catch(function(error) {
      console.log('Request failed:', error);
      // You could return a custom offline 404 page here
    });
  }