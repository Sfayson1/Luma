self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Send message to main thread
  event.waitUntil(
    self.clients.matchAll().then(function(clients) {
      if (clients.length > 0) {
        clients[0].postMessage({
          type: 'NOTIFICATION_CLICK',
          notificationData: event.notification.data
        });
        return clients[0].focus();
      }
    })
  );
});
