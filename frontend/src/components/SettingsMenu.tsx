import React, { useState } from 'react';

// Main Settings Menu Component (Instagram-style navigation)
const SettingsMenu: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('menu');

  const menuItems = [
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: '👤',
      description: 'Change your profile picture, name, and bio',
      onClick: () => setCurrentPage('profile')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: '🔒',
      description: 'Control who can see your content',
      onClick: () => setCurrentPage('privacy')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔',
      description: 'Manage email and push notifications',
      onClick: () => setCurrentPage('notifications')
    },
    {
      id: 'journal',
      title: 'Journal Preferences',
      icon: '📝',
      description: 'Writing settings and defaults',
      onClick: () => setCurrentPage('journal')
    },
    {
      id: 'display',
      title: 'Display & Accessibility',
      icon: '🎨',
      description: 'Theme, font size, and display options',
      onClick: () => setCurrentPage('display')
    },
    {
      id: 'account',
      title: 'Account',
      icon: '⚙️',
      description: 'Password, data export, and account actions',
      onClick: () => setCurrentPage('account')
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: '❓',
      description: 'Get help and contact support',
      onClick: () => setCurrentPage('help')
    },
    {
      id: 'about',
      title: 'About',
      icon: 'ℹ️',
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
          <div className="max-w-lg mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-4">
              <h1 className="font-['Playfair_Display'] text-2xl font-bold text-gray-800">
                Settings
              </h1>
            </div>

            {/* Menu Items */}
            <div className="divide-y divide-gray-200">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
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
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    bio: 'Journaling my thoughts and experiences...',
    avatar: null as string | null,
    isPublic: false
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setProfile(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setProfile(prev => ({ ...prev, avatar: null }));
  };

  return (
    <div className="max-w-lg mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-xl text-gray-800">Edit Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarPreview || profile.avatar ? (
                <img
                  src={avatarPreview || profile.avatar!}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-400">👤</span>
              )}
            </div>

            {/* Edit Button */}
            <label className="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 space-x-4">
            <label className="text-purple-600 font-medium cursor-pointer hover:text-purple-700">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
            {(avatarPreview || profile.avatar) && (
              <button
                onClick={removeAvatar}
                className="text-red-600 font-medium hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              placeholder="Write a short bio about yourself..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {profile.bio.length}/150 characters
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-800">Public Profile</div>
              <div className="text-sm text-gray-500">Allow others to find and view your profile</div>
            </div>
            <button
              onClick={() => setProfile(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                profile.isPublic ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Placeholder components for other settings pages
const PrivacySettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-lg mx-auto bg-white min-h-screen">
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-xl text-gray-800">Privacy & Security</h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Privacy settings would go here...</p>
    </div>
  </div>
);

const NotificationSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-lg mx-auto bg-white min-h-screen">
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-xl text-gray-800">Notifications</h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Notification settings would go here...</p>
    </div>
  </div>
);

const JournalSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-lg mx-auto bg-white min-h-screen">
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-xl text-gray-800">Journal Preferences</h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Journal settings would go here...</p>
    </div>
  </div>
);

const DisplaySettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-lg mx-auto bg-white min-h-screen">
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-xl text-gray-800">Display & Accessibility</h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Display settings would go here...</p>
    </div>
  </div>
);

const AccountSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-lg mx-auto bg-white min-h-screen">
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-xl text-gray-800">Account</h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Account settings would go here...</p>
    </div>
  </div>
);

const HelpSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-lg mx-auto bg-white min-h-screen">
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-xl text-gray-800">Help & Support</h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">Help and support options would go here...</p>
    </div>
  </div>
);

const AboutSettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-lg mx-auto bg-white min-h-screen">
    <div className="border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-xl text-gray-800">About</h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600">App information and legal details would go here...</p>
    </div>
  </div>
);

export default SettingsMenu;
