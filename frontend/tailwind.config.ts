import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        card: "hsl(var(--color-card))",
        "card-foreground": "hsl(var(--color-card-foreground))",
        popover: "hsl(var(--color-popover))",
        "popover-foreground": "hsl(var(--color-popover-foreground))",
        primary: "hsl(var(--color-primary))",
        "primary-foreground": "hsl(var(--color-primary-foreground))",
        secondary: "hsl(var(--color-secondary))",
        "secondary-foreground": "hsl(var(--color-secondary-foreground))",
        muted: "hsl(var(--color-muted))",
        "muted-foreground": "hsl(var(--color-muted-foreground))",
        accent: "hsl(var(--color-accent))",
        "accent-foreground": "hsl(var(--color-accent-foreground))",
        destructive: "hsl(var(--color-destructive))",
        "destructive-foreground": "hsl(var(--color-destructive-foreground))",
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",

        // Luma Custom Design Tokens
        healing: "hsl(var(--color-healing))",
        serenity: "hsl(var(--color-serenity))",
        warmth: "hsl(var(--color-warmth))",
        gentle: "hsl(var(--color-gentle))",

        // Sidebar tokens
        "sidebar-background": "hsl(var(--color-sidebar-background))",
        "sidebar-foreground": "hsl(var(--color-sidebar-foreground))",
        "sidebar-primary": "hsl(var(--color-sidebar-primary))",
        "sidebar-primary-foreground": "hsl(var(--color-sidebar-primary-foreground))",
        "sidebar-accent": "hsl(var(--color-sidebar-accent))",
        "sidebar-accent-foreground": "hsl(var(--color-sidebar-accent-foreground))",
        "sidebar-border": "hsl(var(--color-sidebar-border))",
        "sidebar-ring": "hsl(var(--color-sidebar-ring))",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        gentle: "var(--shadow-gentle)",
        warm: "var(--shadow-warm)",
      },
      backgroundImage: {
        "gradient-healing": "var(--gradient-healing)",
        "gradient-calm": "var(--gradient-calm)",
        "gradient-warmth": "var(--gradient-warmth)",
      },
    },
  },
  plugins: [],
};

export default config;
