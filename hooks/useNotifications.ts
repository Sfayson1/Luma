import { useState, useEffect } from 'react';
import { notificationService } from '../frontend/src/services/notificationService';
import { supabase } from '../frontend/src/supabaseClient';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    setupRealtimeSubscription();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await notificationService.getNotifications(user.id);
        setNotifications(data);

        const count = await notificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Notification change:', payload);
          loadNotifications(); // Refresh notifications on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const success = await notificationService.markAsRead(notificationId, user.id);
      if (success) {
        await loadNotifications(); // Refresh
      }
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const success = await notificationService.markAllAsRead(user.id);
      if (success) {
        await loadNotifications(); // Refresh
      }
    }
  };

  const deleteNotification = async (notificationId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const success = await notificationService.deleteNotification(notificationId, user.id);
      if (success) {
        await loadNotifications(); // Refresh
      }
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications
  };
};

// Hook to trigger notifications based on user actions
export const useNotificationTriggers = () => {
  const triggerJournalReminder = async (userId: string) => {
    return await notificationService.notifyJournalReminder(userId);
  };

  const triggerStreakMilestone = async (userId: string, streakDays: number) => {
    return await notificationService.notifyStreakMilestone(userId, streakDays);
  };

  const triggerWeeklyDigest = async (userId: string, weekData: any) => {
    return await notificationService.notifyWeeklyDigest(userId, weekData);
  };

  const triggerNewFollower = async (userId: string, followerName: string) => {
    return await notificationService.notifyNewFollower(userId, followerName);
  };

  const triggerSecurityAlert = async (userId: string, alertType: string, details: string) => {
    return await notificationService.notifySecurityAlert(userId, alertType, details);
  };

  return {
    triggerJournalReminder,
    triggerStreakMilestone,
    triggerWeeklyDigest,
    triggerNewFollower,
    triggerSecurityAlert
  };
};
