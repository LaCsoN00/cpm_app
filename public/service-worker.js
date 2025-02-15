const urlsToCache = [
  "/",
  "/offline.html",
  "/icon.png",
  "/styles.css",
  "/manifest.json",
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('push', function (event) {
    if (event.data) {
      const data = event.data.json()
      const options = {
        body: data.body,
        icon: data.icon || '/icon.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
        },
      }
      event.waitUntil(self.registration.showNotification(data.title, options))
    }
  })
   
  self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.')
    event.notification.close()
    event.waitUntil(clients.openWindow('<https://your-website.com>'))
  })