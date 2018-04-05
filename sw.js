var staticCacheName = 'restaurant-static-v26';

/**
 * Cache some resources when installing the service worker
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {

      return cache.addAll([
        '/restaurant.html',
        'js/restaurant_info.js',
        'css/styles.css',
        'data/restaurants.json'
      ]);
    })
  );
});

/**
 * Delete previous service workers
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Get resources from the cache or fetch resources through networks then cache them.
 */
self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

    event.respondWith(
      caches.open(staticCacheName).then(function(cache) {
        return  cache.match(event.request).then(function(response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
});

/**
 * Skip waiting when there is a new version
 */
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});