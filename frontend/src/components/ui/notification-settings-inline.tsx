import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { webPushService } from '@/lib/webPushService';

export type NotificationSettingsState = {
  pushNotifications: boolean;
  writingReminders: boolean;
  likeNotifications: boolean;
  achievementNotifications: boolean;
  systemNotifications: boolean;
};

function getPermissionStatus(permission: NotificationPermission) {
  switch (permission) {
    case 'granted':
      return { text: 'Enabled', variant: 'default' as const, color: 'text-green-600 dark:text-green-400' };
    case 'denied':
      return { text: 'Blocked', variant: 'destructive' as const, color: 'text-red-600 dark:text-red-400' };
    default:
      return { text: 'Not Set', variant: 'secondary' as const, color: 'text-yellow-600 dark:text-yellow-400' };
  }
}

export const NotificationSettingsInline: React.FC = () => {
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettingsState>({
    pushNotifications: false,
    writingReminders: true,
    likeNotifications: true,
    achievementNotifications: true,
    systemNotifications: true,
  });

  useEffect(() => {
    setIsSupported(webPushService.isSupported());
    setPermission(webPushService.getPermissionStatus());

    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {}
    }
  }, []);

  const saveSettings = (newSettings: NotificationSettingsState) => {
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
  };

  const handleEnablePushNotifications = async () => {
    try {
      const newPermission = await webPushService.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        await webPushService.initialize();
        saveSettings({ ...settings, pushNotifications: true });

        await webPushService.showWelcomeNotification();

        toast({
          title: 'Push notifications enabled!',
          description: "You'll now receive browser notifications for important updates.",
        });
      } else {
        toast({
          title: 'Permission denied',
          description: 'To enable notifications, please allow them in your browser settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable push notifications. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDisablePushNotifications = () => {
    saveSettings({ ...settings, pushNotifications: false });
    toast({
      title: 'Push notifications disabled',
      description: 'You can re-enable them anytime in settings.',
    });
  };

  const status = getPermissionStatus(permission);

  return (
    <div className="space-y-6">
      {/* Browser Push Notifications */}
      <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[hsl(var(--color-foreground))]">Browser Notifications</CardTitle>
            <Badge variant={status.variant} className={status.color}>
              {status.text}
            </Badge>
          </div>
          <CardDescription className="text-sm text-[hsl(var(--color-muted-foreground))]">
            Receive notifications even when Luma is closed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupported ? (
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
              Your browser doesn't support push notifications.
            </p>
          ) : permission === 'granted' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-enabled" className="text-sm text-[hsl(var(--color-foreground))]">
                  Enable push notifications
                </Label>
                <Switch
                  id="push-enabled"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleEnablePushNotifications();
                    } else {
                      handleDisablePushNotifications();
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <Button
              onClick={handleEnablePushNotifications}
              className="w-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]"
            >
              <Bell className="h-4 w-4 mr-2" />
              Enable Browser Notifications
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[hsl(var(--color-foreground))]">Notification Types</CardTitle>
          <CardDescription className="text-sm text-[hsl(var(--color-muted-foreground))]">
            Choose which notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="writing-reminders" className="text-sm text-[hsl(var(--color-foreground))]">
              Writing reminders
            </Label>
            <Switch
              id="writing-reminders"
              checked={settings.writingReminders}
              onCheckedChange={(checked) => {
                saveSettings({ ...settings, writingReminders: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="like-notifications" className="text-sm text-[hsl(var(--color-foreground))]">
              Like notifications
            </Label>
            <Switch
              id="like-notifications"
              checked={settings.likeNotifications}
              onCheckedChange={(checked) => {
                saveSettings({ ...settings, likeNotifications: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="achievement-notifications" className="text-sm text-[hsl(var(--color-foreground))]">
              Achievement notifications
            </Label>
            <Switch
              id="achievement-notifications"
              checked={settings.achievementNotifications}
              onCheckedChange={(checked) => {
                saveSettings({ ...settings, achievementNotifications: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="system-notifications" className="text-sm text-[hsl(var(--color-foreground))]">
              System notifications
            </Label>
            <Switch
              id="system-notifications"
              checked={settings.systemNotifications}
              onCheckedChange={(checked) => {
                saveSettings({ ...settings, systemNotifications: checked });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Help text */}
      <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
        <p>• In-app notifications are always enabled</p>
        <p>• You can change browser notification settings anytime</p>
        <p>• Notifications help you stay consistent with journaling</p>
      </div>
    </div>
  );
};
