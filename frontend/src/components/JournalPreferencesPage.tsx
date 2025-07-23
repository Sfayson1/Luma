import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JournalPreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    defaultMood: 'neutral',
    autoSave: true,
    reminderEnabled: true,
    reminderTime: '20:00',
    promptType: 'daily',
    wordCountGoal: 100,
    showWordCount: true,
    enableTags: true,
    defaultTags: ['reflection', 'gratitude'],
    privacyDefault: 'private'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would save to your backend/Supabase

    setIsSaving(false);
    setSaveMessage('Preferences saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleGoBack = () => {
    // Navigate back to settings
    navigate('/dashboard');

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-light text-gray-800">Journal Preferences</h1>
              <p className="text-gray-600 font-light">Customize your journaling experience</p>
            </div>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">

          {/* Writing Settings */}
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Writing Settings</h3>
            <div className="space-y-4">

              {/* Default Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Mood for New Entries
                </label>
                <select
                  value={preferences.defaultMood}
                  onChange={(e) => setPreferences(prev => ({ ...prev, defaultMood: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="happy">😊 Happy</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="sad">😢 Sad</option>
                  <option value="excited">🎉 Excited</option>
                  <option value="anxious">😰 Anxious</option>
                  <option value="grateful">🙏 Grateful</option>
                </select>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Auto-save drafts</label>
                  <p className="text-sm text-gray-500">Automatically save your work as you type</p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.autoSave ? 'bg-purple-400' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Word Count Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Word Count Goal
                </label>
                <input
                  type="number"
                  value={preferences.wordCountGoal}
                  onChange={(e) => setPreferences(prev => ({ ...prev, wordCountGoal: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  min="0"
                  step="50"
                />
              </div>

              {/* Show Word Count */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Show word count while writing</label>
                  <p className="text-sm text-gray-500">Display word count in the editor</p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, showWordCount: !prev.showWordCount }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.showWordCount ? 'bg-purple-400' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.showWordCount ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Prompts & Reminders */}
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Prompts & Reminders</h3>
            <div className="space-y-4">

              {/* Reminder Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Daily writing reminders</label>
                  <p className="text-sm text-gray-500">Get notified to write in your journal</p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, reminderEnabled: !prev.reminderEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.reminderEnabled ? 'bg-purple-400' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reminder Time */}
              {preferences.reminderEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={preferences.reminderTime}
                    onChange={(e) => setPreferences(prev => ({ ...prev, reminderTime: e.target.value }))}
                    className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              )}

              {/* Prompt Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt Frequency
                </label>
                <select
                  value={preferences.promptType}
                  onChange={(e) => setPreferences(prev => ({ ...prev, promptType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="daily">Daily prompts</option>
                  <option value="weekly">Weekly prompts</option>
                  <option value="random">Random prompts</option>
                  <option value="none">No prompts</option>
                </select>
              </div>
            </div>
          </section>

          {/* Tags & Organization */}
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tags & Organization</h3>
            <div className="space-y-4">

              {/* Enable Tags */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable tags</label>
                  <p className="text-sm text-gray-500">Use tags to organize your entries</p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, enableTags: !prev.enableTags }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.enableTags ? 'bg-purple-400' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.enableTags ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Default Privacy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Entry Privacy
                </label>
                <select
                  value={preferences.privacyDefault}
                  onChange={(e) => setPreferences(prev => ({ ...prev, privacyDefault: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="private">🔒 Private (only you can see)</option>
                  <option value="public">🌍 Public (visible to others)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-100">
            {saveMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <p className="text-green-600 text-sm font-light">{saveMessage}</p>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-purple-400 text-white py-3 px-4 rounded-2xl font-light hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPreferencesPage;
