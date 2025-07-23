import React from 'react';
import { Monitor, Sun, Moon, Palette, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DisplaySettingsPage() {
  const { mode, colorScheme, isDark, setMode, setColorScheme } = useTheme();

  // Get dynamic colors based on current color scheme (matching your dashboard)
  const getButtonColors = () => {
    const colorMap = {
      purple: "bg-purple-400 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700",
      blue: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
      green: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
      pink: "bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700",
      indigo: "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700",
    };
    return colorMap[colorScheme];
  };

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Light theme' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Dark theme' },
    { value: 'system' as const, label: 'System', icon: Monitor, description: 'Follow system preference' }
  ];

  const colorSchemes = [
    { value: 'purple' as const, label: 'Purple', colorClass: 'bg-purple-400', description: 'Purple accent' },
    { value: 'blue' as const, label: 'Blue', colorClass: 'bg-blue-400', description: 'Blue accent' },
    { value: 'green' as const, label: 'Green', colorClass: 'bg-green-400', description: 'Green accent' },
    { value: 'pink' as const, label: 'Pink', colorClass: 'bg-pink-400', description: 'Pink accent' },
    { value: 'indigo' as const, label: 'Indigo', colorClass: 'bg-indigo-400', description: 'Indigo accent' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
            Display Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Customize your theme and display preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Theme Mode Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Theme Mode
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Choose your preferred theme mode
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const IconComponent = theme.icon;
                const isSelected = mode === theme.value;

                return (
                  <button
                    key={theme.value}
                    onClick={() => setMode(theme.value)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300 text-left
                      ${isSelected
                        ? `border-${colorScheme}-400 bg-${colorScheme}-50 dark:bg-${colorScheme}-900/20 dark:border-${colorScheme}-500`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className={`w-5 h-5 ${isSelected ? `text-${colorScheme}-600 dark:text-${colorScheme}-400` : 'text-gray-600 dark:text-gray-400'}`} />
                      <span className={`font-medium ${isSelected ? `text-${colorScheme}-900 dark:text-${colorScheme}-100` : 'text-gray-900 dark:text-gray-100'} transition-colors duration-300`}>
                        {theme.label}
                      </span>
                    </div>
                    <p className={`text-sm ${isSelected ? `text-${colorScheme}-700 dark:text-${colorScheme}-300` : 'text-gray-600 dark:text-gray-400'} transition-colors duration-300`}>
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Scheme Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Color Scheme
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Choose your preferred accent color
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {colorSchemes.map((scheme) => {
                const isSelected = colorScheme === scheme.value;

                return (
                  <button
                    key={scheme.value}
                    onClick={() => setColorScheme(scheme.value)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300 text-center
                      ${isSelected
                        ? `border-${scheme.value}-400 bg-${scheme.value}-50 dark:bg-${scheme.value}-900/20`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full ${scheme.colorClass} mx-auto mb-2`}></div>
                    <span className={`font-medium block ${isSelected ? `text-${scheme.value}-900 dark:text-${scheme.value}-100` : 'text-gray-900 dark:text-gray-100'} transition-colors duration-300`}>
                      {scheme.label}
                    </span>
                    <p className={`text-xs mt-1 ${isSelected ? `text-${scheme.value}-700 dark:text-${scheme.value}-300` : 'text-gray-600 dark:text-gray-400'} transition-colors duration-300`}>
                      {scheme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Live Preview
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  See how your theme looks in action
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
              <div className="space-y-4">
                {/* Sample Card */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                    Sample Journal Entry
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 transition-colors duration-300">
                    This is how your journal entries will look with the current theme settings.
                  </p>
                  <button className={`${getButtonColors()} text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm`}>
                    Sample Button
                  </button>
                </div>

                {/* Current Settings Display */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Current Settings:</span>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getButtonColors()} text-white`}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getButtonColors()} text-white`}>
                      {colorScheme.charAt(0).toUpperCase() + colorScheme.slice(1)} Accent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
