// src/services/notificationService.ts
import { apiFetch } from "../lib/api";
import { me } from "../lib/auth";

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

export interface NotificationOut {
  id: number;
  user_id: string;
  type: string;
  title: string;
  message: string;
  metadata: any;
  read: boolean;
  created_at: string; // ISO
  updated_at?: string | null;
}

class NotificationService {
  // Create a new notification
  async createNotification(data: NotificationData): Promise<boolean> {
    try {
      // Ensure auth token works
      await me();

      await apiFetch<NotificationOut>("/api/notifications/", {
        method: "POST",
        body: JSON.stringify({
          user_id: data.user_id,
          type: data.type,
          title: data.title,
          message: data.message,
          metadata: data.metadata || {},
        }),
      });

      // Also send browser notification if enabled
      await this.sendBrowserNotification(data);
      return true;
    } catch (error) {
      console.error("Error creating notification:", error);
      return false;
    }
  }

  // Get user's notification preferences
  async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      await me();

      // You can implement this route on backend as:
      // GET /api/notifications/preferences  (infer user from token)
      // OR GET /api/users/{id}/preferences
      // This version assumes user inferred from token:
      const prefs = await apiFetch<NotificationPreferences>("/api/notifications/preferences");
      return prefs || {};
    } catch (error) {
      console.error("Error getting user preferences:", error);
      return null;
    }
  }

  // Send browser push notification
  async sendBrowserNotification(data: NotificationData): Promise<void> {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        const preferences = await this.getUserPreferences(data.user_id);
        const shouldSend = this.shouldSendPushNotification(data.type, preferences);

        if (shouldSend) {
          new Notification(data.title, {
            body: data.message,
            icon: "/logo.png",
            badge: "/logo.png",
            tag: data.type,
          });
        }
      }
    } catch (error) {
      console.error("Error sending browser notification:", error);
    }
  }

  // Check if push notification should be sent based on user preferences
  private shouldSendPushNotification(
    type: string,
    preferences: NotificationPreferences | null
  ): boolean {
    if (!preferences) return false;

    switch (type) {
      case "new_follower":
        return preferences.push_new_follower ?? true;
      case "journal_reminder":
        return preferences.push_journal_reminder ?? true;
      case "milestone":
      case "streak":
        return preferences.push_milestones ?? true;
      default:
        return false;
    }
  }

  // Journal-specific notifications
  async notifyJournalReminder(userId: string): Promise<boolean> {
    return this.createNotification({
      user_id: userId,
      type: "journal_reminder",
      title: "Time to journal! ✍️",
      message:
        "Don't forget to write in your journal today. Take a moment to reflect on your thoughts and experiences.",
      metadata: { source: "daily_reminder" },
    });
  }

  async notifyStreakMilestone(userId: string, streakDays: number): Promise<boolean> {
    const milestones = [3, 7, 14, 30, 60, 100, 365];
    if (!milestones.includes(streakDays)) return false;

    let emoji = "🎉";
    let message = `Congratulations! You've journaled for ${streakDays} days in a row.`;

    if (streakDays >= 365) {
      emoji = "👑";
      message = "Incredible! You've maintained a full year of journaling. You're a true journal master!";
    } else if (streakDays >= 100) {
      emoji = "🏆";
      message = `Amazing! ${streakDays} days of consistent journaling. You're building an incredible habit!`;
    } else if (streakDays >= 30) {
      emoji = "🌟";
      message = "Fantastic! One month of journaling completed. Your dedication is inspiring!";
    }

    return this.createNotification({
      user_id: userId,
      type: "milestone",
      title: `${streakDays}-day streak! ${emoji}`,
      message,
      metadata: { streak_days: streakDays, milestone_type: "journal_streak" },
    });
  }

  async notifyWeeklyDigest(userId: string, weekData: any): Promise<boolean> {
    const { entriesCount, topMood, totalWords } = weekData;

    return this.createNotification({
      user_id: userId,
      type: "weekly_digest",
      title: "Your week in review 📊",
      message: `You wrote ${entriesCount} journal entries this week. Your most common mood was "${topMood}" and you wrote ${totalWords} words total.`,
      metadata: {
        entries_count: entriesCount,
        top_mood: topMood,
        total_words: totalWords,
        week_start: weekData.weekStart,
      },
    });
  }

  async notifyNewFollower(userId: string, followerName: string): Promise<boolean> {
    return this.createNotification({
      user_id: userId,
      type: "new_follower",
      title: "New follower! 👥",
      message: `${followerName} started following your journal.`,
      metadata: { follower_name: followerName, action_type: "follow" },
    });
  }

  // Batch operations
  async markAllAsRead(_userId: string): Promise<boolean> {
    try {
      await me();
      await apiFetch("/api/notifications/read-all", { method: "PUT" });
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }

  async markAsRead(notificationId: number, _userId: string): Promise<boolean> {
    try {
      await me();
      await apiFetch(`/api/notifications/${notificationId}/read`, { method: "PUT" });
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  async getNotifications(_userId: string, limit: number = 20): Promise<NotificationOut[]> {
    try {
      await me();
      return await apiFetch<NotificationOut[]>(`/api/notifications/?limit=${limit}`);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async getUnreadCount(_userId: string): Promise<number> {
    try {
      await me();
      const res = await apiFetch<{ count: number }>("/api/notifications/unread-count");
      return res.count || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
