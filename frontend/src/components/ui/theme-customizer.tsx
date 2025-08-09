import { useState } from "react"
import { Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const themes = [
  {
    name: "Default",
    label: "Luma Blue",
    cssVars: {
      light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        primary: "221 83% 53%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 4.8% 95.9%",
        "secondary-foreground": "240 5.9% 10%",
        muted: "240 4.8% 95.9%",
        "muted-foreground": "240 3.8% 46.1%",
        accent: "240 4.8% 95.9%",
        "accent-foreground": "240 5.9% 10%",
        border: "240 5.9% 90%",
        input: "240 5.9% 90%",
        ring: "221 83% 53%",
      },
      dark: {
        background: "240 10% 3.9%",
        foreground: "0 0% 98%",
        primary: "221 83% 53%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 3.7% 15.9%",
        "secondary-foreground": "0 0% 98%",
        muted: "240 3.7% 15.9%",
        "muted-foreground": "240 5% 64.9%",
        accent: "240 3.7% 15.9%",
        "accent-foreground": "0 0% 98%",
        border: "240 3.7% 15.9%",
        input: "240 3.7% 15.9%",
        ring: "221 83% 53%",
      }
    }
  },
  {
    name: "Emerald",
    label: "Forest Green",
    cssVars: {
      light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        primary: "142 76% 36%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 4.8% 95.9%",
        "secondary-foreground": "240 5.9% 10%",
        muted: "240 4.8% 95.9%",
        "muted-foreground": "240 3.8% 46.1%",
        accent: "240 4.8% 95.9%",
        "accent-foreground": "240 5.9% 10%",
        border: "240 5.9% 90%",
        input: "240 5.9% 90%",
        ring: "142 76% 36%",
      },
      dark: {
        background: "240 10% 3.9%",
        foreground: "0 0% 98%",
        primary: "142 76% 36%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 3.7% 15.9%",
        "secondary-foreground": "0 0% 98%",
        muted: "240 3.7% 15.9%",
        "muted-foreground": "240 5% 64.9%",
        accent: "240 3.7% 15.9%",
        "accent-foreground": "0 0% 98%",
        border: "240 3.7% 15.9%",
        input: "240 3.7% 15.9%",
        ring: "142 76% 36%",
      }
    }
  },
  {
    name: "Rose",
    label: "Warm Rose",
    cssVars: {
      light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        primary: "346 77% 49%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 4.8% 95.9%",
        "secondary-foreground": "240 5.9% 10%",
        muted: "240 4.8% 95.9%",
        "muted-foreground": "240 3.8% 46.1%",
        accent: "240 4.8% 95.9%",
        "accent-foreground": "240 5.9% 10%",
        border: "240 5.9% 90%",
        input: "240 5.9% 90%",
        ring: "346 77% 49%",
      },
      dark: {
        background: "240 10% 3.9%",
        foreground: "0 0% 98%",
        primary: "346 77% 49%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 3.7% 15.9%",
        "secondary-foreground": "0 0% 98%",
        muted: "240 3.7% 15.9%",
        "muted-foreground": "240 5% 64.9%",
        accent: "240 3.7% 15.9%",
        "accent-foreground": "0 0% 98%",
        border: "240 3.7% 15.9%",
        input: "240 3.7% 15.9%",
        ring: "346 77% 49%",
      }
    }
  },
  {
    name: "Purple",
    label: "Royal Purple",
    cssVars: {
      light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        primary: "262 83% 58%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 4.8% 95.9%",
        "secondary-foreground": "240 5.9% 10%",
        muted: "240 4.8% 95.9%",
        "muted-foreground": "240 3.8% 46.1%",
        accent: "240 4.8% 95.9%",
        "accent-foreground": "240 5.9% 10%",
        border: "240 5.9% 90%",
        input: "240 5.9% 90%",
        ring: "262 83% 58%",
      },
      dark: {
        background: "240 10% 3.9%",
        foreground: "0 0% 98%",
        primary: "262 83% 58%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 3.7% 15.9%",
        "secondary-foreground": "0 0% 98%",
        muted: "240 3.7% 15.9%",
        "muted-foreground": "240 5% 64.9%",
        accent: "240 3.7% 15.9%",
        "accent-foreground": "0 0% 98%",
        border: "240 3.7% 15.9%",
        input: "240 3.7% 15.9%",
        ring: "262 83% 58%",
      }
    }
  },
  {
    name: "Orange",
    label: "Sunset Orange",
    cssVars: {
      light: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        primary: "24 95% 53%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 4.8% 95.9%",
        "secondary-foreground": "240 5.9% 10%",
        muted: "240 4.8% 95.9%",
        "muted-foreground": "240 3.8% 46.1%",
        accent: "240 4.8% 95.9%",
        "accent-foreground": "240 5.9% 10%",
        border: "240 5.9% 90%",
        input: "240 5.9% 90%",
        ring: "24 95% 53%",
      },
      dark: {
        background: "240 10% 3.9%",
        foreground: "0 0% 98%",
        primary: "24 95% 53%",
        "primary-foreground": "0 0% 98%",
        secondary: "240 3.7% 15.9%",
        "secondary-foreground": "0 0% 98%",
        muted: "240 3.7% 15.9%",
        "muted-foreground": "240 5% 64.9%",
        accent: "240 3.7% 15.9%",
        "accent-foreground": "0 0% 98%",
        border: "240 3.7% 15.9%",
        input: "240 3.7% 15.9%",
        ring: "24 95% 53%",
      }
    }
  }
]

export function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState("Default")

  const applyTheme = (theme: typeof themes[0]) => {
    const root = document.documentElement
    const isDark = root.classList.contains("dark")
    const themeVars = isDark ? theme.cssVars.dark : theme.cssVars.light

    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value)
    })

    setSelectedTheme(theme.name)
    localStorage.setItem("luma-theme", theme.name)
  }

  const resetToDefault = () => {
    const root = document.documentElement
    const defaultTheme = themes[0]
    applyTheme(defaultTheme)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Customize theme">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Customize theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
          <DialogDescription>
            Choose your perfect color theme. Changes apply instantly to both light and dark modes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {themes.map((theme) => (
            <Card
              key={theme.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTheme === theme.name ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => applyTheme(theme)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">{theme.label}</CardTitle>
                    <CardDescription className="text-xs">{theme.name} Theme</CardDescription>
                  </div>
                  {selectedTheme === theme.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  {/* Light theme preview */}
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Light</p>
                    <div
                      className="h-8 rounded border border-border"
                      style={{
                        background: `hsl(${theme.cssVars.light.background})`,
                        borderColor: `hsl(${theme.cssVars.light.border})`
                      }}
                    >
                      <div className="h-full flex items-center gap-1 px-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: `hsl(${theme.cssVars.light.primary})` }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: `hsl(${theme.cssVars.light.secondary})` }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: `hsl(${theme.cssVars.light.accent})` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dark theme preview */}
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Dark</p>
                    <div
                      className="h-8 rounded border"
                      style={{
                        background: `hsl(${theme.cssVars.dark.background})`,
                        borderColor: `hsl(${theme.cssVars.dark.border})`
                      }}
                    >
                      <div className="h-full flex items-center gap-1 px-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: `hsl(${theme.cssVars.dark.primary})` }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: `hsl(${theme.cssVars.dark.secondary})` }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: `hsl(${theme.cssVars.dark.accent})` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {selectedTheme === theme.name && (
                  <Badge variant="secondary" className="text-xs">
                    Active Theme
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Themes are saved to your browser and persist across sessions.
          </p>
          <Button variant="outline" onClick={resetToDefault}>
            Reset to Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
