// src/services/notificationService.ts
import { supabase } from '../supabaseClient';

export interface NotificationData {
  user_id: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}

export interface NotificationPreferences {
  email_new_follower?: boolean;
  email_journal_reminder?: boolean;
  email_weekly_digest?: boolean;
  push_new_follower?: boolean;
  push_journal_reminder?: boolean;
  push_milestones?: boolean;
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_days?: string[];
}

class NotificationService {
  // Create a new notification
  async createNotification(data: NotificationData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: data.user_id,
          type: data.type,
          title: data.title,
          message: data.message,
          metadata: data.metadata || {},
          read: false
        }]);

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      // Also send browser push notification if enabled
      await this.sendBrowserNotification(data);

      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  // Get user's notification preferences
  async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', userId)
        .single();

      return profile?.notification_preferences || {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  // Send browser push notification
  async sendBrowserNotification(data: NotificationData): Promise<void> {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const preferences = await this.getUserPreferences(data.user_id);

        // Check if user has enabled push notifications for this type
        const shouldSend = this.shouldSendPushNotification(data.type, preferences);

        if (shouldSend) {
          new Notification(data.title, {
            body: data.message,
            icon: '/logo.png', // Update this to your actual icon path
            badge: '/logo.png',
            tag: data.type, // Prevents duplicate notifications
          });
        }
      }
    } catch (error) {
      console.error('Error sending browser notification:', error);
    }
  }

  // Check if push notification should be sent based on user preferences
  private shouldSendPushNotification(type: string, preferences: NotificationPreferences | null): boolean {
    if (!preferences) return false;

    switch (type) {
      case 'new_follower':
        return preferences.push_new_follower ?? true;
      case 'journal_reminder':
        return preferences.push_journal_reminder ?? true;
      case 'milestone':
      case 'streak':
        return preferences.push_milestones ?? true;
      default:
        return false;
    }
  }

  // Journal-specific notifications
  async notifyJournalReminder(userId: string): Promise<boolean> {
    return this.createNotification({
      user_id: userId,
      type: 'journal_reminder',
      title: 'Time to journal! ✍️',
      message: "Don't forget to write in your journal today. Take a moment to reflect on your thoughts and experiences.",
      metadata: { source: 'daily_reminder' }
    });
  }

  async notifyStreakMilestone(userId: string, streakDays: number): Promise<boolean> {
    const milestones = [3, 7, 14, 30, 60, 100, 365];

    if (!milestones.includes(streakDays)) {
      return false; // Only notify on milestone days
    }

    let emoji = '🎉';
    let message = `Congratulations! You've journaled for ${streakDays} days in a row.`;

    if (streakDays >= 365) {
      emoji = '👑';
      message = `Incredible! You've maintained a full year of journaling. You're a true journal master!`;
    } else if (streakDays >= 100) {
      emoji = '🏆';
      message = `Amazing! ${streakDays} days of consistent journaling. You're building an incredible habit!`;
    } else if (streakDays >= 30) {
      emoji = '🌟';
      message = `Fantastic! One month of journaling completed. Your dedication is inspiring!`;
    }

    return this.createNotification({
      user_id: userId,
      type: 'milestone',
      title: `${streakDays}-day streak! ${emoji}`,
      message,
      metadata: {
        streak_days: streakDays,
        milestone_type: 'journal_streak'
      }
    });
  }

  async notifyWeeklyDigest(userId: string, weekData: any): Promise<boolean> {
    const { entriesCount, topMood, totalWords } = weekData;

    return this.createNotification({
      user_id: userId,
      type: 'weekly_digest',
      title: 'Your week in review 📊',
      message: `You wrote ${entriesCount} journal entries this week. Your most common mood was "${topMood}" and you wrote ${totalWords} words total.`,
      metadata: {
        entries_count: entriesCount,
        top_mood: topMood,
        total_words: totalWords,
        week_start: weekData.weekStart
      }
    });
  }

  async notifyNewFollower(userId: string, followerName: string): Promise<boolean> {
    return this.createNotification({
      user_id: userId,
      type: 'new_follower',
      title: 'New follower! 👥',
      message: `${followerName} started following your journal.`,
      metadata: {
        follower_name: followerName,
        action_type: 'follow'
      }
    });
  }

  // Batch operations
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false);

      return !error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  async markAsRead(notificationId: number, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async getNotifications(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
