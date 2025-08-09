// Service Worker for handling push notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);

  event.notification.close();

  // Send message to main app about notification click
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // If app is already open, focus it and send message
      if (clients.length > 0) {
        const client = clients[0];
        client.focus();
        client.postMessage({
          type: 'NOTIFICATION_CLICK',
          notificationData: event.notification.data,
        });
      } else {
        // Open the app
        self.clients.openWindow('/dashboard');
      }
    })
  );
});

// Handle background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'notification-sync') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // This would typically sync with your backend
  // For now, we'll just log
  console.log('Syncing notifications...');
}
