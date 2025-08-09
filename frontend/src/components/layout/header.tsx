import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { ThemeCustomizer } from '../ui/theme-customizer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((word: string) => word.length > 0)
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const id = user?.id;
    if (!id) { setAvatarUrl(null); return; }
    supabase
      .from('profiles')
      .select('avatar_url')
      .eq('user_id', id)
      .maybeSingle()
      .then(({ data }) => {
        setAvatarUrl(data?.avatar_url ?? null);
      });
  }, [user?.id]);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[hsl(var(--color-background)_/_0.95)] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--color-background)_/_0.6)]"
      style={{ borderBottom: '1px solid hsl(var(--color-border) / 0.4)' }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-healing))] bg-clip-text text-transparent">
              Luma
            </span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/dashboard?tab=entries')}
            className="text-sm font-medium text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2"
          >
            <span className="hidden sm:inline">My Entries</span>
          </button>
          <button
            onClick={() => navigate('/dashboard?tab=analytics')}
            className="text-sm font-medium text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2"
          >
            <span className="hidden sm:inline">Analytics</span>
          </button>
          <button
            onClick={() => navigate('/dashboard?tab=resources')}
            className="text-sm font-medium text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2"
          >
            <span className="hidden sm:inline">Resources</span>
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeCustomizer />
          <ThemeToggle />
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-8 w-8">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl || undefined} alt={userName} />
                ) : null}
                <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))] text-xs">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block text-[hsl(var(--color-foreground))]">{userName}</span>
            </button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-healing))] hover:from-[hsl(var(--color-primary)_/_0.9)] hover:to-[hsl(var(--color-healing)_/_0.9)] text-[hsl(var(--color-primary-foreground))] shadow-[var(--shadow-gentle)]"
              >
                Get Started
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
