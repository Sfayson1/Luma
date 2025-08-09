import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, BarChart3, HelpCircle, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { NotificationCenter } from "@/components/ui/notification-center";

interface DashboardHeaderProps {
  userName: string;
  avatarUrl?: string | null;
  activeTab: "entries" | "analytics" | "resources";
  onTabChange: (tab: "entries" | "analytics" | "resources") => void;
}

export const DashboardHeader = ({ userName, avatarUrl, activeTab, onTabChange }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((word: string) => word.length > 0)
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTabClasses = (tab: string) =>
    activeTab === tab
      ? "text-[hsl(var(--color-primary))] border-b-2 border-[hsl(var(--color-primary))]"
      : "text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]";

  return (
    <header
      className="bg-[hsl(var(--color-background)_/_0.95)] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--color-background)_/_0.6)]"
      style={{ border: '1px solid hsl(var(--color-border))' }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-[hsl(var(--color-primary))]">Luma</h1>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onTabChange("entries")}
                className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${getTabClasses("entries")}`}
              >
                <BookOpen className="h-4 w-4" />
                My Entries
              </button>
              <button
                onClick={() => onTabChange("analytics")}
                className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${getTabClasses("analytics")}`}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </button>
              <button
                onClick={() => onTabChange("resources")}
                className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${getTabClasses("resources")}`}
              >
                <HelpCircle className="h-4 w-4" />
                Resources
              </button>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <NotificationCenter />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-[hsl(var(--color-accent))] text-[hsl(var(--color-foreground))]"
                >
                  <Avatar className="h-8 w-8">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl ?? undefined} alt={userName} />
                    ) : null}
                    <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))] font-medium text-sm">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block text-[hsl(var(--color-foreground))]">{userName}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 bg-[hsl(var(--color-background))] shadow-[var(--shadow-warm)] z-50"
                align="end"
                sideOffset={5}
                style={{ border: '1px solid hsl(var(--color-border))' }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-[hsl(var(--color-foreground))]">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-[hsl(var(--color-muted-foreground))]">
                      Manage your account settings
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-[hsl(var(--color-destructive))] hover:bg-[hsl(var(--color-destructive)_/_0.1)] focus:text-[hsl(var(--color-destructive))]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
