import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import {
  Heart, MessageCircle, Search, Users, Loader2, Calendar, Hash,
  Smile, Frown, Meh, Sun, CloudRain,
} from 'lucide-react';

const moodIcons: Record<string, React.ReactNode> = {
  great: <Sun className="h-4 w-4 text-[hsl(45_100%_50%)]" />,
  good: <Smile className="h-4 w-4 text-[hsl(142_69%_58%)]" />,
  okay: <Meh className="h-4 w-4 text-[hsl(200_80%_50%)]" />,
  low: <Frown className="h-4 w-4 text-[hsl(25_95%_53%)]" />,
  difficult: <CloudRain className="h-4 w-4 text-[hsl(var(--color-destructive))]" />,
};

const moodColors: Record<string, string> = {
  great: 'bg-[hsl(45_100%_95%)] text-[hsl(45_100%_30%)]',
  good: 'bg-[hsl(142_69%_95%)] text-[hsl(142_69%_30%)]',
  okay: 'bg-[hsl(200_80%_95%)] text-[hsl(200_80%_30%)]',
  low: 'bg-[hsl(25_95%_95%)] text-[hsl(25_95%_30%)]',
  difficult: 'bg-[hsl(var(--color-destructive)_/_0.1)] text-[hsl(var(--color-destructive))]',
};

interface FeedPost {
  id: number;
  content: string;
  date_posted: string;
  mood: string | null;
  privacy: string;
  tags: string | null;
  owner_id: number;
  owner: { id: number; username: string; first_name: string; last_name: string };
}

export function CommunityFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const userName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User';

  useEffect(() => {
    if (!user) { navigate('/auth', { replace: true }); return; }
    apiFetch<FeedPost[]>('/api/posts/')
      .then(data => setEntries(data.filter(e => e.privacy !== 'private')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = entries.filter(e => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || e.content.toLowerCase().includes(q) || (e.tags || '').toLowerCase().includes(q);
    const matchMood = !selectedMood || e.mood === selectedMood;
    return matchSearch && matchMood;
  });

  const getInitials = (o: FeedPost['owner']) =>
    `${o.first_name} ${o.last_name}`.trim().split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || o.username[0].toUpperCase();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))]">
      <DashboardHeader userName={userName} avatarUrl={null} activeTab="entries" onTabChange={() => navigate('/dashboard')} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-[hsl(var(--color-primary))]" />
            <h1 className="text-3xl font-bold text-[hsl(var(--color-foreground))]">Community Feed</h1>
          </div>
          <p className="text-[hsl(var(--color-muted-foreground))]">
            Public journal entries from the community.
          </p>
        </div>

        <Card className="mb-6" style={{ border: '1px solid hsl(var(--color-border))' }}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-muted-foreground))] h-4 w-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant={selectedMood === '' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedMood('')}>All</Button>
                {Object.keys(moodIcons).map(mood => (
                  <Button key={mood} variant={selectedMood === mood ? 'default' : 'outline'} size="sm"
                    onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                    className="flex items-center gap-1"
                    style={selectedMood !== mood ? { border: '1px solid hsl(var(--color-border))' } : {}}
                  >
                    {moodIcons[mood]}
                    <span className="capitalize hidden sm:inline">{mood}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(var(--color-primary))]" />
            <p className="text-[hsl(var(--color-muted-foreground))]">Loading...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--color-muted-foreground))]" />
            <h3 className="text-lg font-semibold mb-2">No public entries yet</h3>
            <p className="text-[hsl(var(--color-muted-foreground))]">Be the first to share your story!</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-6">
            {filtered.map(entry => (
              <Card key={entry.id} style={{ border: '1px solid hsl(var(--color-border))' }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))]">
                          {getInitials(entry.owner)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[hsl(var(--color-foreground))]">
                          {`${entry.owner.first_name} ${entry.owner.last_name}`.trim() || entry.owner.username}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))]">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(entry.date_posted).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {entry.mood && moodIcons[entry.mood] && (
                      <Badge variant="outline" className={moodColors[entry.mood]} style={{ border: '1px solid hsl(var(--color-border))' }}>
                        <div className="flex items-center gap-1">
                          {moodIcons[entry.mood]}
                          <span className="capitalize">{entry.mood}</span>
                        </div>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(var(--color-muted-foreground))] leading-relaxed">
                    {entry.content.length > 300 ? `${entry.content.slice(0, 300)}...` : entry.content}
                  </p>
                  {entry.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entry.tags.split(',').map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />{tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[hsl(var(--color-border))]">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled>
                      <Heart className="h-4 w-4" /><span>0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled>
                      <MessageCircle className="h-4 w-4" /><span>0</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
