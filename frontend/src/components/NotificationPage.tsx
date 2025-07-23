import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// TypeScript interfaces
interface User {
  id: string;
  email?: string;
  [key: string]: any; // Allow other Supabase user properties
}

interface NotificationPreferences {
  email_new_follower?: boolean;
  email_journal_reminder?: boolean;
  email_weekly_digest?: boolean;
  email_security_alerts?: boolean;
  email_product_updates?: boolean;
  push_new_follower?: boolean;
  push_journal_reminder?: boolean;
  push_milestones?: boolean;
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_days?: string[];
  reminder_frequency?: string;
  in_app_sounds?: boolean;
  in_app_badges?: boolean;
}

const NotificationsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Email Notifications
  const [emailNewFollower, setEmailNewFollower] = useState(true);
  const [emailJournalReminder, setEmailJournalReminder] = useState(true);
  const [emailWeeklyDigest, setEmailWeeklyDigest] = useState(true);
  const [emailSecurityAlerts, setEmailSecurityAlerts] = useState(true);
  const [emailProductUpdates, setEmailProductUpdates] = useState(false);

  // Push Notifications (Browser)
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushNewFollower, setPushNewFollower] = useState(true);
  const [pushJournalReminder, setPushJournalReminder] = useState(true);
  const [pushMilestones, setPushMilestones] = useState(true);

  // Journal Reminders
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [reminderDays, setReminderDays] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]);
  const [reminderFrequency, setReminderFrequency] = useState("daily");

  // In-App Notifications
  const [inAppSounds, setInAppSounds] = useState(true);
  const [inAppBadges, setInAppBadges] = useState(true);

  useEffect(() => {
    loadUserSettings();
    checkPushPermission();
  }, []);

  const loadUserSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // Load notification preferences from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("notification_preferences")
          .eq("id", user.id)
          .single();

        if (profile?.notification_preferences) {
          const prefs = profile.notification_preferences;
          setEmailNewFollower(prefs.email_new_follower ?? true);
          setEmailJournalReminder(prefs.email_journal_reminder ?? true);
          setEmailWeeklyDigest(prefs.email_weekly_digest ?? true);
          setEmailSecurityAlerts(prefs.email_security_alerts ?? true);
          setEmailProductUpdates(prefs.email_product_updates ?? false);

          setPushNewFollower(prefs.push_new_follower ?? true);
          setPushJournalReminder(prefs.push_journal_reminder ?? true);
          setPushMilestones(prefs.push_milestones ?? true);

          setReminderEnabled(prefs.reminder_enabled ?? true);
          setReminderTime(prefs.reminder_time ?? "20:00");
          setReminderDays(
            prefs.reminder_days ?? [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ]
          );
          setReminderFrequency(prefs.reminder_frequency ?? "daily");

          setInAppSounds(prefs.in_app_sounds ?? true);
          setInAppBadges(prefs.in_app_badges ?? true);
        }
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPushPermission = () => {
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  };

  const requestPushPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setPushEnabled(permission === "granted");
      if (permission === "granted") {
        alert("Push notifications enabled!");
      } else {
        alert(
          "Push notifications were denied. You can enable them in your browser settings."
        );
      }
    } else {
      alert("Push notifications are not supported in this browser.");
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      const preferences: NotificationPreferences = {
        email_new_follower: emailNewFollower,
        email_journal_reminder: emailJournalReminder,
        email_weekly_digest: emailWeeklyDigest,
        email_security_alerts: emailSecurityAlerts,
        email_product_updates: emailProductUpdates,
        push_new_follower: pushNewFollower,
        push_journal_reminder: pushJournalReminder,
        push_milestones: pushMilestones,
        reminder_enabled: reminderEnabled,
        reminder_time: reminderTime,
        reminder_days: reminderDays,
        reminder_frequency: reminderFrequency,
        in_app_sounds: inAppSounds,
        in_app_badges: inAppBadges,
      };

      const { error } = await supabase
        .from("profiles")
        .update({
          notification_preferences: preferences,
        })
        .eq("id", user?.id);

      if (error) throw error;

      alert("Notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleReminderDay = (day: string) => {
    setReminderDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A78BFA] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Notifications
              </h1>
              <p className="text-sm text-gray-600">
                Manage how and when you receive notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Settings Panel - Now Full Width */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Email Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Email Notifications
                </h2>
                <p className="text-sm text-gray-600">
                  Choose what emails you'd like to receive
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "emailNewFollower",
                  value: emailNewFollower,
                  setter: setEmailNewFollower,
                  label: "New followers",
                  desc: "When someone starts following your journal",
                },
                {
                  key: "emailJournalReminder",
                  value: emailJournalReminder,
                  setter: setEmailJournalReminder,
                  label: "Journal reminders",
                  desc: "Daily reminders to write in your journal",
                },
                {
                  key: "emailWeeklyDigest",
                  value: emailWeeklyDigest,
                  setter: setEmailWeeklyDigest,
                  label: "Weekly digest",
                  desc: "Summary of your week's journaling activity",
                },
                {
                  key: "emailSecurityAlerts",
                  value: emailSecurityAlerts,
                  setter: setEmailSecurityAlerts,
                  label: "Security alerts",
                  desc: "Important security notifications about your account",
                },
                {
                  key: "emailProductUpdates",
                  value: emailProductUpdates,
                  setter: setEmailProductUpdates,
                  label: "Product updates",
                  desc: "News about new features and improvements",
                },
              ].map(({ key, value, setter, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <button
                    onClick={() => setter(!value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? "bg-[#A78BFA]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM6 2v20l5-5 5 5V2H6z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Browser Notifications
                </h2>
                <p className="text-sm text-gray-600">
                  Real-time notifications in your browser
                </p>
              </div>
            </div>

            {!pushEnabled && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span className="text-sm text-yellow-800">
                    Push notifications are disabled
                  </span>
                </div>
                <button
                  onClick={requestPushPermission}
                  className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Enable Push Notifications
                </button>
              </div>
            )}

            <div className="space-y-4">
              {[
                {
                  key: "pushNewFollower",
                  value: pushNewFollower,
                  setter: setPushNewFollower,
                  label: "New followers",
                  disabled: !pushEnabled,
                },
                {
                  key: "pushJournalReminder",
                  value: pushJournalReminder,
                  setter: setPushJournalReminder,
                  label: "Journal reminders",
                  disabled: !pushEnabled,
                },
                {
                  key: "pushMilestones",
                  value: pushMilestones,
                  setter: setPushMilestones,
                  label: "Milestones & achievements",
                  disabled: !pushEnabled,
                },
              ].map(({ key, value, setter, label, disabled }) => (
                <div key={key} className="flex items-center justify-between">
                  <label
                    className={`text-sm font-medium ${
                      disabled ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {label}
                  </label>
                  <button
                    onClick={() => !disabled && setter(!value)}
                    disabled={disabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      disabled
                        ? "bg-gray-100 cursor-not-allowed"
                        : value
                        ? "bg-[#A78BFA]"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value && !disabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Journal Reminders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Journal Reminders
                </h2>
                <p className="text-sm text-gray-600">
                  Set up automatic reminders to journal
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Enable reminders
                </label>
                <button
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reminderEnabled ? "bg-[#A78BFA]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reminderEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {reminderEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder time
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Reminder days
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {[
                        { key: "monday", label: "Mon" },
                        { key: "tuesday", label: "Tue" },
                        { key: "wednesday", label: "Wed" },
                        { key: "thursday", label: "Thu" },
                        { key: "friday", label: "Fri" },
                        { key: "saturday", label: "Sat" },
                        { key: "sunday", label: "Sun" },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => toggleReminderDay(key)}
                          className={`p-2 text-xs rounded-lg border transition-colors ${
                            reminderDays.includes(key)
                              ? "bg-[#A78BFA] text-white border-[#A78BFA]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={saveNotificationSettings}
            disabled={saving}
            className="w-full bg-[#A78BFA] text-white py-3 px-4 rounded-lg hover:bg-[#9333EA] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : "Save Notification Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
