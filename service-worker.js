importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
const { initialize } = workbox.googleAnalytics;


const { registerRoute } = workbox.routing;
const {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} = workbox.strategies;

// Used for filtering matches based on status code, header, or both
const { CacheableResponsePlugin } = workbox.cacheableResponse;
// Used to limit entries in cache, remove entries after a certain period of time
const { ExpirationPlugin } = workbox.expiration;
const {setCacheNameDetails} = workbox.core;

setCacheNameDetails({
  prefix: 'grade-analyzer',
  suffix: 'v1.1.1',
  precache: 'custom-precache-name',
  runtime: 'custom-runtime-name',
  googleAnalytics: 'custom-google-analytics-name'
});
initialize();
// Cache page navigations (html) with a Network First strategy
registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ request }) => request.mode === 'navigate',
  // Use a Network First caching strategy
  new NetworkFirst({
    // Put all cached files in a cache named 'pages'
    cacheName: 'pages',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker' ||
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css',
  // Use a Stale While Revalidate caching strategy
  new StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'
    cacheName: 'assets',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

// Cache images with a Cache First strategy
registerRoute(
  // Check to see if the request's destination is style for an image
  ({ request }) => 
  request.destination === 'image',

  // Use a Cache First caching strategy
  new CacheFirst({
    // Put all cached files in a cache named 'images'
    cacheName: 'images',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // Don't cache more than 50 items, and expire them after 30 days
      new ExpirationPlugin({
        maxEntries: 50,
        // maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  }),
);
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});




// custom sw config v2
// const CACHE_NAME = 'static-cache-v2.0';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/styles.css',
//   '/main.js',
//   '/manifest.webmanifest',
//   '/grade.png',
//   '/favicon.ico',
//   'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css',
//   'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
//   'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
// ];

// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//     .then(function(cache) {
//       console.info(' caching...')
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addEventListener('activate', (event) => {
  
//   event.waitUntil(
//     caches.keys().then( keys => {
//       // wipeing out old caches
//       return Promise.all(
//         keys.filter( key => key !== CACHE_NAME)
//             .map(key => caches.delete(key))
//       )
//     })
//   )
// })

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.match(event.request)
//       .then(function(response) {
//         return response || fetchAndCache(event.request);
//       })
//     );
//   });
  
//   function fetchAndCache(url) {
//     return fetch(url)
//     .then(function(response) {
//       // Check if we received a valid response
//       if (!response.ok) {
//         throw Error(response.statusText);
//       }
//       return caches.open(CACHE_NAME)
//       .then(function(cache) {
//         cache.put(url, response.clone());
//         return response;
//       });
//     })
//     .catch(function(error) {
//       console.log('Request failed:', error);
//       // You could return a custom offline 404 page here
//     });
//   }