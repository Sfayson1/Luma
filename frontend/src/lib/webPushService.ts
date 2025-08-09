interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

class WebPushService {
  private registration: ServiceWorkerRegistration | null = null;

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported in this browser');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Register service worker for push notifications
  async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers are not supported');
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  // Show a local notification
  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.getPermissionStatus() !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    const notificationOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    };

    if (this.registration) {
      // Use service worker to show notification (better for persistence)
      await this.registration.showNotification(options.title, notificationOptions);
    } else {
      // Fallback to direct notification
      new Notification(options.title, notificationOptions);
    }
  }

  // Initialize the service (call this on app start)
  async initialize(): Promise<boolean> {
    try {
      if (!this.isSupported()) {
        console.warn('Push notifications are not supported in this browser');
        return false;
      }

      await this.registerServiceWorker();

      // Check if permission is already granted
      if (this.getPermissionStatus() === 'granted') {
        return true;
      }

      // Don't automatically request permission - let user choose
      return false;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Setup notification click handling
  setupNotificationHandlers(onNotificationClick?: (data: any) => void): void {
    if (!this.registration) return;

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'NOTIFICATION_CLICK') {
        onNotificationClick?.(event.data.notificationData);
      }
    });
  }

  // Show different types of notifications
  async showWelcomeNotification(): Promise<void> {
    await this.showNotification({
      title: 'Welcome to Luma! 🌟',
      body: 'Start your mindful journaling journey today.',
      tag: 'welcome',
    });
  }

  async showWritingReminder(): Promise<void> {
    await this.showNotification({
      title: 'Time to reflect 📝',
      body: "How are you feeling today? Share your thoughts in your journal.",
      tag: 'writing-reminder',
    });
  }

  async showStreakReminder(days: number): Promise<void> {
    await this.showNotification({
      title: `Don't break your ${days}-day streak! 🔥`,
      body: 'Take a moment to write in your journal and keep the momentum going.',
      tag: 'streak-reminder',
      data: { days },
    });
  }

  async showLikeNotification(likerName: string, entryTitle: string): Promise<void> {
    await this.showNotification({
      title: '❤️ Someone liked your entry!',
      body: `${likerName} liked "${entryTitle}"`,
      tag: 'like-notification',
      data: { likerName, entryTitle },
    });
  }

  async showAchievementNotification(achievement: string): Promise<void> {
    await this.showNotification({
      title: '🏆 Achievement Unlocked!',
      body: achievement,
      tag: 'achievement',
      data: { achievement },
    });
  }
}

export const webPushService = new WebPushService();
