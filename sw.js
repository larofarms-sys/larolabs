// ICU Core Service Worker
const CACHE_NAME = 'icu-core-v1';
const VAPID_PUBLIC_KEY = 'BA5mLWeMzqwTscQkDe0ldVV-KDlhReZeMJIJ6CKLmgMfZd7jgmrVUYZ8wk0ruO4wZoylPkXQHfN1HUD8eFwKOCk';

// Install - cache key assets
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new message',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/icu/' },
    actions: [
      { action: 'open', title: 'Open App' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'ICU Core', options)
  );
});

// Notification clicked
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/icu/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
