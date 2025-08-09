import React from 'react';
import { Monitor, Sun, Moon, Palette, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DisplaySettingsPage() {
  const { mode, colorScheme, isDark, setMode, setColorScheme } = useTheme();

  // Get dynamic colors based on current color scheme (matching your dashboard)
  const getButtonColors = () => {
    const colorMap = {
      purple: "bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary)_/_0.9)]",
      blue: "bg-[hsl(200_80%_50%)] hover:bg-[hsl(200_80%_45%)]",
      green: "bg-[hsl(142_69%_58%)] hover:bg-[hsl(142_69%_53%)]",
      pink: "bg-[hsl(330_81%_60%)] hover:bg-[hsl(330_81%_55%)]",
      indigo: "bg-[hsl(238_56%_58%)] hover:bg-[hsl(238_56%_53%)]",
    };
    return colorMap[colorScheme];
  };

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Light theme' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Dark theme' },
    { value: 'system' as const, label: 'System', icon: Monitor, description: 'Follow system preference' }
  ];

  const colorSchemes = [
    { value: 'purple' as const, label: 'Purple', colorClass: 'bg-[hsl(var(--color-primary))]', description: 'Purple accent' },
    { value: 'blue' as const, label: 'Blue', colorClass: 'bg-[hsl(200_80%_50%)]', description: 'Blue accent' },
    { value: 'green' as const, label: 'Green', colorClass: 'bg-[hsl(142_69%_58%)]', description: 'Green accent' },
    { value: 'pink' as const, label: 'Pink', colorClass: 'bg-[hsl(330_81%_60%)]', description: 'Pink accent' },
    { value: 'indigo' as const, label: 'Indigo', colorClass: 'bg-[hsl(238_56%_58%)]', description: 'Indigo accent' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-2 transition-colors duration-300">
            Display Settings
          </h1>
          <p className="text-[hsl(var(--color-muted-foreground))] transition-colors duration-300">
            Customize your theme and display preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Theme Mode Section */}
          <div className="bg-[hsl(var(--color-card))] rounded-xl p-6 shadow-[var(--shadow-gentle)] border border-[hsl(var(--color-border))] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[hsl(var(--color-primary)_/_0.1)] rounded-lg">
                <Palette className="w-5 h-5 text-[hsl(var(--color-primary))]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[hsl(var(--color-foreground))] transition-colors duration-300">
                  Theme Mode
                </h2>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))] transition-colors duration-300">
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
                        ? `border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)_/_0.05)]`
                        : 'border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary)_/_0.3)] bg-[hsl(var(--color-card))]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className={`w-5 h-5 ${isSelected ? `text-[hsl(var(--color-primary))]` : 'text-[hsl(var(--color-muted-foreground))]'}`} />
                      <span className={`font-medium ${isSelected ? `text-[hsl(var(--color-primary))]` : 'text-[hsl(var(--color-foreground))]'} transition-colors duration-300`}>
                        {theme.label}
                      </span>
                    </div>
                    <p className={`text-sm ${isSelected ? `text-[hsl(var(--color-primary)_/_0.7)]` : 'text-[hsl(var(--color-muted-foreground))]'} transition-colors duration-300`}>
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Scheme Section */}
          <div className="bg-[hsl(var(--color-card))] rounded-xl p-6 shadow-[var(--shadow-gentle)] border border-[hsl(var(--color-border))] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[hsl(var(--color-healing)_/_0.3)] rounded-lg">
                <Palette className="w-5 h-5 text-[hsl(var(--color-healing))]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[hsl(var(--color-foreground))] transition-colors duration-300">
                  Color Scheme
                </h2>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))] transition-colors duration-300">
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
                        ? `border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)_/_0.05)]`
                        : 'border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary)_/_0.3)] bg-[hsl(var(--color-card))]'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full ${scheme.colorClass} mx-auto mb-2`}></div>
                    <span className={`font-medium block ${isSelected ? `text-[hsl(var(--color-primary))]` : 'text-[hsl(var(--color-foreground))]'} transition-colors duration-300`}>
                      {scheme.label}
                    </span>
                    <p className={`text-xs mt-1 ${isSelected ? `text-[hsl(var(--color-primary)_/_0.7)]` : 'text-[hsl(var(--color-muted-foreground))]'} transition-colors duration-300`}>
                      {scheme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="bg-[hsl(var(--color-card))] rounded-xl p-6 shadow-[var(--shadow-gentle)] border border-[hsl(var(--color-border))] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[hsl(var(--color-serenity)_/_0.3)] rounded-lg">
                <Eye className="w-5 h-5 text-[hsl(var(--color-primary))]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[hsl(var(--color-foreground))] transition-colors duration-300">
                  Live Preview
                </h2>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))] transition-colors duration-300">
                  See how your theme looks in action
                </p>
              </div>
            </div>

            <div className="bg-[hsl(var(--color-muted))] rounded-lg p-6 border border-[hsl(var(--color-border))] transition-colors duration-300">
              <div className="space-y-4">
                {/* Sample Card */}
                <div className="bg-[hsl(var(--color-card))] p-4 rounded-lg border border-[hsl(var(--color-border))] transition-colors duration-300">
                  <h3 className="font-semibold text-[hsl(var(--color-foreground))] mb-2 transition-colors duration-300">
                    Sample Journal Entry
                  </h3>
                  <p className="text-[hsl(var(--color-muted-foreground))] text-sm mb-3 transition-colors duration-300">
                    This is how your journal entries will look with the current theme settings.
                  </p>
                  <button className={`${getButtonColors()} text-[hsl(var(--color-primary-foreground))] px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm`}>
                    Sample Button
                  </button>
                </div>

                {/* Current Settings Display */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--color-muted-foreground))] transition-colors duration-300">Current Settings:</span>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getButtonColors()} text-[hsl(var(--color-primary-foreground))]`}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getButtonColors()} text-[hsl(var(--color-primary-foreground))]`}>
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
