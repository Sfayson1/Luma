import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ColorScheme = "purple" | "blue" | "green" | "pink" | "indigo";
type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  colorScheme: ColorScheme;
  mode: ThemeMode;
  isDark: boolean;
  setColorScheme: (scheme: ColorScheme) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    return (
      (localStorage.getItem("luma-color-scheme") as ColorScheme) || "purple"
    );
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("luma-theme-mode") as ThemeMode) || "light";
  });

  const [isDark, setIsDark] = useState(false);

  // Update dark mode state and DOM
  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;

      if (mode === "dark") {
        shouldBeDark = true;
      } else if (mode === "system") {
        shouldBeDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      }



      // Apply or remove dark class from HTML element
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");

      } else {
        document.documentElement.classList.remove("dark");

      }

      // Set color scheme data attribute for CSS variables (if needed later)
      document.documentElement.setAttribute("data-color-scheme", colorScheme);
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mode === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, colorScheme]);
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("luma-theme-mode", newMode);
  };

  const setColorSchemeWithStorage = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    localStorage.setItem("luma-color-scheme", scheme);
  };

  // FIXED: Use actual mode value instead of isDark
  const toggleMode = () => {
  
    const newMode = mode === "dark" ? "light" : "dark";

    setMode(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        mode,
        isDark,
        setColorScheme: setColorSchemeWithStorage,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
