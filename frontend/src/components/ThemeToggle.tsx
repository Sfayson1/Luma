import React, { useState } from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { mode, colorScheme, isDark, setMode, setColorScheme, toggleMode } =
    useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // const handleToggleMode = () => {
  //
  //   toggleMode();
  //   
  // };

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const colorSchemes = [
    { value: "purple", label: "Purple", colorClass: "bg-purple-400" },
    { value: "blue", label: "Blue", colorClass: "bg-blue-400" },
    { value: "green", label: "Green", colorClass: "bg-green-400" },
    { value: "pink", label: "Pink", colorClass: "bg-pink-400" },
    { value: "indigo", label: "Indigo", colorClass: "bg-indigo-400" },
  ] as const;

  return (
    <div className="relative">


      {/* Your existing theme menu code... */}
    </div>
  );
};

export default ThemeToggle;
