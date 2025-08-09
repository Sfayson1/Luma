import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, User, Lock, Bell, BookOpen, Palette, Settings, HelpCircle, Info, Upload, X, Shield, MessageCircle, Eye, EyeOff, Database, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeCustomizer } from '@/components/ui/theme-customizer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/ui/theme-provider';
import { NotificationSettingsInline } from '@/components/ui/notification-settings-inline';
import { UserGuide } from '@/components/ui/user-guide';

interface SettingsPageProps {
  onBack?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState('menu');

  const menuItems = [
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: User,
      description: 'Change your profile picture, name, and bio',
      onClick: () => setCurrentPage('profile')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Lock,
      description: 'Control who can see your content',
      onClick: () => setCurrentPage('privacy')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage email and push notifications',
      onClick: () => setCurrentPage('notifications')
    },
    {
      id: 'journal',
      title: 'Journal Preferences',
      icon: BookOpen,
      description: 'Writing settings and defaults',
      onClick: () => setCurrentPage('journal')
    },
    {
      id: 'display',
      title: 'Display & Accessibility',
      icon: Palette,
      description: 'Theme, font size, and display options',
      onClick: () => setCurrentPage('display')
    },
    {
      id: 'account',
      title: 'Account',
      icon: Settings,
      description: 'Password, data export, and account actions',
      onClick: () => setCurrentPage('account')
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help and contact support',
      onClick: () => setCurrentPage('help')
    },
    {
      id: 'about',
      title: 'About',
      icon: Info,
      description: 'App version and legal information',
      onClick: () => setCurrentPage('about')
    }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfileSettingsPage onBack={() => setCurrentPage('menu')} />;
      case 'privacy':
        return <PrivacySettingsPage onBack={() => setCurrentPage('menu')} />;
      case 'notifications':
        return <NotificationSettingsPage onBack={() => setCurrentPage('menu')} />;
      case 'journal':
        return <JournalSettingsPage onBack={() => setCurrentPage('menu')} />;
      case 'display':
        return <DisplaySettingsPage onBack={() => setCurrentPage('menu')} />;
      case 'account':
        return <AccountSettingsPage onBack={() => setCurrentPage('menu')} />;
      case 'help':
        return <HelpSettingsPage onBack={() => setCurrentPage('menu')} />;
      case 'about':
        return <AboutSettingsPage onBack={() => setCurrentPage('menu')} />;
      default:
        return (
          <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
            {/* Header */}
            <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
                  </Button>
                  <h1 className="text-2xl font-bold text-[hsl(var(--color-foreground))]">Settings</h1>
                </div>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Done
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="divide-y divide-[hsl(var(--color-border))]">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="w-full px-6 py-4 text-left hover:bg-[hsl(var(--color-accent))] transition-colors active:bg-[hsl(var(--color-accent)_/_0.8)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--color-primary)_/_0.1)] flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                        </div>
                        <div>
                          <div className="font-medium text-[hsl(var(--color-foreground))]">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-[hsl(var(--color-muted-foreground))] mt-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer with navigation back to dashboard */}
            <div className="p-6 border-t border-[hsl(var(--color-border))]">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>

            {/* Sign Out */}
            <div className="px-6 pb-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        );
    }
  };

  return renderCurrentPage();
};

// Profile Settings Page Component
interface ProfileSettingsPageProps {
  onBack: () => void;
}

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: user?.user_metadata?.name?.split(' ')[0] || '',
    lastName: user?.user_metadata?.name?.split(' ')[1] || '',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || '',
    avatar: user?.user_metadata?.avatar_url || null,
    isPublic: false
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !user) return;
  try {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max size is 5MB.', variant: 'destructive' });
      return;
    }

    const ext = file.name.split('.')?.pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });
    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    const publicUrl = pub?.publicUrl;
    if (!publicUrl) throw new Error('Failed to get public URL');

    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id);
    if (updateErr) throw updateErr;

    setAvatarPreview(publicUrl);
    setProfile(prev => ({ ...prev, avatar: publicUrl }));
    toast({ title: 'Avatar updated' });
  } catch (err) {
    console.error('Avatar upload error:', err);
    toast({ title: 'Error', description: 'Failed to upload avatar', variant: 'destructive' });
  }
};

  const removeAvatar = () => {
    setAvatarPreview(null);
    setProfile(prev => ({ ...prev, avatar: null }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      {/* Header */}
      <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
          </Button>
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">Edit Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                {avatarPreview || profile.avatar ? (
                  <img
                    src={avatarPreview || profile.avatar!}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))]">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex gap-2">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </span>
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </Label>
                {(avatarPreview || profile.avatar) && (
                  <Button variant="destructive" onClick={removeAvatar}>
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-[hsl(var(--color-foreground))]">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))]"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-[hsl(var(--color-foreground))]">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-[hsl(var(--color-foreground))]">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))]"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-[hsl(var(--color-foreground))]">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Write a short bio about yourself..."
                rows={3}
                className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))] placeholder:text-[hsl(var(--color-muted-foreground))]"
              />
              <div className="text-xs text-[hsl(var(--color-muted-foreground))] mt-1">
                {profile.bio.length}/150 characters
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Public Profile</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Allow others to find and view your profile</p>
              </div>
              <Switch
                checked={profile.isPublic}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]">Save Changes</Button>
      </div>
    </div>
  );
};

// Other settings pages with proper styling
const PrivacySettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    profilePublic: false,
    allowComments: true,
    allowDMs: false,
    showLikes: true,
    dataSharing: false,
    blockedUsers: [] as string[],
  });
  const [blockInput, setBlockInput] = useState("");

  // Load from localStorage once
  React.useEffect(() => {
    const saved = localStorage.getItem('privacy-settings');
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveSettings = (next: typeof settings) => {
    setSettings(next);
    localStorage.setItem('privacy-settings', JSON.stringify(next));
  };

  const addBlocked = () => {
    const val = blockInput.trim();
    if (!val) return;
    if (settings.blockedUsers.includes(val)) return setBlockInput("");
    saveSettings({ ...settings, blockedUsers: [...settings.blockedUsers, val] });
    setBlockInput("");
  };

  const removeBlocked = (name: string) => {
    saveSettings({ ...settings, blockedUsers: settings.blockedUsers.filter(u => u !== name) });
  };

  return (
    <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
          </Button>
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">Privacy & Security</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Public profile</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Allow others to find and view your profile</p>
              </div>
              <Switch
                checked={settings.profilePublic}
                onCheckedChange={(checked) => saveSettings({ ...settings, profilePublic: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Show likes count</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Display total likes on your public entries</p>
              </div>
              <Switch
                checked={settings.showLikes}
                onCheckedChange={(checked) => saveSettings({ ...settings, showLikes: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Interactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Allow comments</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">People can comment on your public posts</p>
              </div>
              <Switch
                checked={settings.allowComments}
                onCheckedChange={(checked) => saveSettings({ ...settings, allowComments: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Allow direct messages</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Receive messages from the community</p>
              </div>
              <Switch
                checked={settings.allowDMs}
                onCheckedChange={(checked) => saveSettings({ ...settings, allowDMs: checked })}
              />
            </div>

            <div>
              <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Blocked users</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Username or email"
                  value={blockInput}
                  onChange={(e) => setBlockInput(e.target.value)}
                  className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))] placeholder:text-[hsl(var(--color-muted-foreground))]"
                />
                <Button onClick={addBlocked} className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]">Block</Button>
              </div>
              {settings.blockedUsers.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {settings.blockedUsers.map((u) => (
                    <span key={u} className="px-2 py-1 rounded-full text-xs bg-[hsl(var(--color-muted))] text-[hsl(var(--color-foreground))] border border-[hsl(var(--color-border))]">
                      {u}
                      <button className="ml-2 text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]" onClick={() => removeBlocked(u)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Data & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Anonymous analytics</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Help us improve by sharing usage metrics</p>
              </div>
              <Switch
                checked={settings.dataSharing}
                onCheckedChange={(checked) => saveSettings({ ...settings, dataSharing: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const NotificationSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { toast } = useToast();
  return (
    <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
          </Button>
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">Notifications</h1>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <NotificationSettingsInline />
        <div className="pt-2">
          <Button variant="outline" className="w-full" onClick={() => toast({ title: 'Preferences saved' })}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

const JournalSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    defaultPrivacy: false,
    defaultMood: 'okay',
    autoSave: true,
    writingReminders: true,
    reminderTime: '19:00',
    weeklyGoal: 3,
    showWordCount: true,
    enableSpellCheck: true,
    fontSize: 'medium',
    lineSpacing: 'normal'
  });

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('journal-settings', JSON.stringify(newSettings));
  };

  return (
    <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
          </Button>
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">Journal Preferences</h1>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Default Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Private by default</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">New entries will be private unless changed</p>
              </div>
              <Switch
                checked={settings.defaultPrivacy}
                onCheckedChange={(checked) => saveSettings({ ...settings, defaultPrivacy: checked })}
              />
            </div>

            <div>
              <Label htmlFor="defaultMood" className="text-base font-medium text-[hsl(var(--color-foreground))]">Default mood</Label>
              <select
                id="defaultMood"
                value={settings.defaultMood}
                onChange={(e) => saveSettings({ ...settings, defaultMood: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-[hsl(var(--color-border))] rounded-md bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]"
              >
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="okay">Okay</option>
                <option value="low">Low</option>
                <option value="difficult">Difficult</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Writing Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Auto-save drafts</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Automatically save your writing as you type</p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => saveSettings({ ...settings, autoSave: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Show word count</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Display word count while writing</p>
              </div>
              <Switch
                checked={settings.showWordCount}
                onCheckedChange={(checked) => saveSettings({ ...settings, showWordCount: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Spell check</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Enable spell checking while writing</p>
              </div>
              <Switch
                checked={settings.enableSpellCheck}
                onCheckedChange={(checked) => saveSettings({ ...settings, enableSpellCheck: checked })}
              />
            </div>

            <div>
              <Label htmlFor="fontSize" className="text-base font-medium text-[hsl(var(--color-foreground))]">Font size</Label>
              <select
                id="fontSize"
                value={settings.fontSize}
                onChange={(e) => saveSettings({ ...settings, fontSize: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-[hsl(var(--color-border))] rounded-md bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            <div>
              <Label htmlFor="lineSpacing" className="text-base font-medium text-[hsl(var(--color-foreground))]">Line spacing</Label>
              <select
                id="lineSpacing"
                value={settings.lineSpacing}
                onChange={(e) => saveSettings({ ...settings, lineSpacing: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-[hsl(var(--color-border))] rounded-md bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Writing Goals & Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Daily reminders</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Get reminded to write in your journal</p>
              </div>
              <Switch
                checked={settings.writingReminders}
                onCheckedChange={(checked) => saveSettings({ ...settings, writingReminders: checked })}
              />
            </div>

            {settings.writingReminders && (
              <div>
                <Label htmlFor="reminderTime" className="text-base font-medium text-[hsl(var(--color-foreground))]">Reminder time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => saveSettings({ ...settings, reminderTime: e.target.value })}
                  className="mt-2 bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))]"
                />
              </div>
            )}

            <div>
              <Label htmlFor="weeklyGoal" className="text-base font-medium text-[hsl(var(--color-foreground))]">Weekly writing goal</Label>
              <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-2">Number of entries per week</p>
              <Input
                id="weeklyGoal"
                type="number"
                min="1"
                max="7"
                value={settings.weeklyGoal}
                onChange={(e) => saveSettings({ ...settings, weeklyGoal: parseInt(e.target.value) || 1 })}
                className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DisplaySettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    themeMode: 'system',
    fontScale: 'medium',
    reduceMotion: false,
    highContrast: false,
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('display-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        if (parsed.themeMode) setTheme(parsed.themeMode);
      } catch {}
    } else {
      setSettings((s) => ({ ...s, themeMode: (theme as string) || 'system' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const size = settings.fontScale === 'small' ? '15px' : settings.fontScale === 'large' ? '18px' : settings.fontScale === 'extra-large' ? '20px' : '16px';
    document.documentElement.style.fontSize = size;
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? 'true' : 'false';
    document.documentElement.dataset.highContrast = settings.highContrast ? 'true' : 'false';
  }, [settings.fontScale, settings.reduceMotion, settings.highContrast]);

  const save = (next: typeof settings) => {
    setSettings(next);
    localStorage.setItem('display-settings', JSON.stringify(next));
  };

  return (
    <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
          </Button>
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">Display & Accessibility</h1>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="themeMode" className="text-base font-medium text-[hsl(var(--color-foreground))]">Mode</Label>
              <select
                id="themeMode"
                value={settings.themeMode}
                onChange={(e) => { const mode = e.target.value; save({ ...settings, themeMode: mode }); setTheme(mode as any); }}
                className="w-full mt-2 px-3 py-2 border border-[hsl(var(--color-border))] rounded-md bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Readability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fontScale" className="text-base font-medium text-[hsl(var(--color-foreground))]">Font size</Label>
              <select
                id="fontScale"
                value={settings.fontScale}
                onChange={(e) => save({ ...settings, fontScale: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-[hsl(var(--color-border))] rounded-md bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))]"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">Reduce motion</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Minimize animations and transitions</p>
              </div>
              <Switch checked={settings.reduceMotion} onCheckedChange={(checked) => save({ ...settings, reduceMotion: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-[hsl(var(--color-foreground))]">High contrast</Label>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Increase contrast for better readability</p>
              </div>
              <Switch checked={settings.highContrast} onCheckedChange={(checked) => save({ ...settings, highContrast: checked })} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Theme Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeCustomizer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AccountSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const canSave = password.length >= 8 && password === confirm && !loading;

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
      setPassword("");
      setConfirm("");
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message || "Unable to update password.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user!.id);
      if (error) throw error;
      const blob = new Blob([JSON.stringify(data || [], null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'luma-journal-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Export complete", description: `Downloaded ${data?.length || 0} entries.` });
    } catch (e: any) {
      toast({ title: "Export failed", description: e?.message || "Unable to export data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
          </Button>
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">Account</h1>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-password" className="text-[hsl(var(--color-foreground))]">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))]"
              />
              <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-1">Minimum 8 characters.</p>
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-[hsl(var(--color-foreground))]">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] border-[hsl(var(--color-border))]"
              />
            </div>
            <Button
              disabled={!canSave}
              onClick={handleUpdatePassword}
              className="w-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Export Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Download a JSON export of your journal entries.</p>
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={loading}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" /> Download Journal Data (JSON)
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">To delete your account and data, please contact support. We'll handle your request promptly.</p>
            <a href="mailto:support@luma.app?subject=Account%20Deletion%20Request" className="w-full">
              <Button variant="destructive" className="w-full">Request Account Deletion</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const HelpSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [showDocs, setShowDocs] = useState(false);

  if (showDocs) {
    return <UserGuide onBack={() => setShowDocs(false)} />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
          </Button>
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">Help & Support</h1>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Find guides and tips to get the most out of Luma.</p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowDocs(true)}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Read User Guide
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--color-foreground))]">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Need help? We're here for you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="mailto:support@luma.app?subject=Support%20Request" className="w-full">
                <Button className="w-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]">Contact Support</Button>
              </a>
              <a href="mailto:support@luma.app?subject=Bug%20Report" className="w-full">
                <Button variant="outline" className="w-full">Report a Bug</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AboutSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-2xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
    <div className="border-b border-[hsl(var(--color-border))] px-6 py-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-[hsl(var(--color-foreground))]" />
        </Button>
        <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">About</h1>
      </div>
    </div>
    <div className="p-6">
      <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--color-foreground))]">Luma Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[hsl(var(--color-muted-foreground))]">Version 1.0.0</p>
          <p className="text-[hsl(var(--color-muted-foreground))] mt-2">A mindful journaling experience.</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default SettingsPage;
