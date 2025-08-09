import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Search,
  Users,
  Loader2,
  Calendar,
  Hash,
  Smile,
  Frown,
  Meh,
  Sun,
  CloudRain,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { JournalEntry, useJournalEntries } from '@/hooks/useJournalEntries';
import { CommentsSection } from '@/components/ui/comments';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { EditJournalModal } from '@/components/ui/edit-journal-modal';

type FeedEntry = JournalEntry & { is_anonymous?: boolean };

const moodIcons = {
  great: <Sun className="h-4 w-4 text-[hsl(45_100%_50%)]" />,
  good: <Smile className="h-4 w-4 text-[hsl(142_69%_58%)]" />,
  okay: <Meh className="h-4 w-4 text-[hsl(200_80%_50%)]" />,
  low: <Frown className="h-4 w-4 text-[hsl(25_95%_53%)]" />,
  difficult: <CloudRain className="h-4 w-4 text-[hsl(var(--color-destructive))]" />
};

const moodColors = {
  great: 'bg-[hsl(45_100%_95%)] text-[hsl(45_100%_30%)]',
  good: 'bg-[hsl(142_69%_95%)] text-[hsl(142_69%_30%)]',
  okay: 'bg-[hsl(200_80%_95%)] text-[hsl(200_80%_30%)]',
  low: 'bg-[hsl(25_95%_95%)] text-[hsl(25_95%_30%)]',
  difficult: 'bg-[hsl(var(--color-destructive)_/_0.1)] text-[hsl(var(--color-destructive))]'
};

export function CommunityFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
  const [profilesByUser, setProfilesByUser] = useState<Record<string, string | null>>({});
  const [editEntry, setEditEntry] = useState<FeedEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { updateEntry, deleteEntry } = useJournalEntries();

  // Fetch public entries from all users
  const fetchPublicEntries = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const normalized = (data ?? []).map((e) => ({
        ...e,
        content: e.content ?? '',
        author: e.author ?? 'Member',
        hashtags: e.hashtags ?? [],
      })) as FeedEntry[];
      setEntries(normalized);

      // Fetch avatars for authors
      const ids = Array.from(new Set((data || []).map((e) => e.user_id)));
      if (ids.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('user_id, avatar_url')
          .in('user_id', ids);
        const map: Record<string, string | null> = {};
        (profs || []).forEach((p: any) => { map[p.user_id] = p.avatar_url ?? null; });
        setProfilesByUser(map);
      }

      // Fetch user's likes
      if (user) {
        await fetchUserLikes();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch community entries';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch which entries the current user has liked
  const fetchUserLikes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('entry_likes')
        .select('entry_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const likedEntryIds = new Set(data.map(like => like.entry_id));
      setUserLikes(likedEntryIds);
    } catch (err) {
      console.error('Failed to fetch user likes:', err);
    }
  };

  // Toggle like on an entry
  const toggleLike = async (entryId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to like entries",
        variant: "destructive",
      });
      return;
    }

    const isLiked = userLikes.has(entryId);

    try {
      if (isLiked) {
        // Unlike the entry
        const { error } = await supabase
          .from('entry_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('entry_id', entryId);

        if (error) throw error;

        // Update local state
        const newLikes = new Set(userLikes);
        newLikes.delete(entryId);
        setUserLikes(newLikes);

        // Update entry likes count locally
        setEntries(prev => prev.map(entry =>
          entry.id === entryId
            ? { ...entry, likes: Math.max(0, entry.likes - 1) }
            : entry
        ));
      } else {
        // Like the entry
        const { error } = await supabase
          .from('entry_likes')
          .insert({
            user_id: user.id,
            entry_id: entryId
          });

        if (error) throw error;

        // Update local state
        const newLikes = new Set(userLikes);
        newLikes.add(entryId);
        setUserLikes(newLikes);

        // Update entry likes count locally
        setEntries(prev => prev.map(entry =>
          entry.id === entryId
            ? { ...entry, likes: entry.likes + 1 }
            : entry
        ));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update like';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPublicEntries();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/community', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadAvatar = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      setAvatarUrl(data?.avatar_url ?? null);
    };
    loadAvatar();
  }, [user?.id]);

  // Filter entries based on search and mood
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery.trim() ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.hashtags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = !selectedMood || entry.mood === selectedMood;

    return matchesSearch && matchesMood;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!user) return null;

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((word: string) => word.length > 0)
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))]">
      <DashboardHeader
        userName={userName}
        avatarUrl={avatarUrl ?? undefined}
        activeTab="entries"
        onTabChange={(tab) => navigate('/dashboard')}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-[hsl(var(--color-primary))]" />
            <h1 className="text-3xl font-bold text-[hsl(var(--color-foreground))]">Community Feed</h1>
          </div>
          <p className="text-[hsl(var(--color-muted-foreground))]">
            Discover and connect with fellow journal writers. Read their stories, share support, and find inspiration.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6" style={{ border: '1px solid hsl(var(--color-border))' }}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--color-muted-foreground))] h-4 w-4" />
                <Input
                  placeholder="Search entries by title, content, or hashtags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))]"
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                />
              </div>

              {/* Mood Filter */}
              <div className="flex gap-2">
                <Button
                  variant={selectedMood === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMood('')}
                  className={selectedMood === ''
                    ? 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]'
                    : 'text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]'
                  }
                  style={selectedMood !== '' ? { border: '1px solid hsl(var(--color-border))' } : {}}
                >
                  All Moods
                </Button>
                {Object.entries(moodIcons).map(([mood, icon]) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                    className={`flex items-center gap-1 ${selectedMood === mood
                      ? 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]'
                      : 'text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]'
                    }`}
                    style={selectedMood !== mood ? { border: '1px solid hsl(var(--color-border))' } : {}}
                  >
                    {icon}
                    <span className="capitalize hidden sm:inline">{mood}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(var(--color-primary))]" />
            <p className="text-[hsl(var(--color-muted-foreground))]">Loading community entries...</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && (searchQuery || selectedMood) && (
          <div className="mb-4">
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
              Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedMood && ` with ${selectedMood} mood`}
            </p>
          </div>
        )}

        {/* Entries List */}
        {!loading && filteredEntries.length > 0 && (
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="hover:shadow-md transition-shadow"
                style={{ border: '1px solid hsl(var(--color-border))' }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {!entry.is_anonymous && profilesByUser[entry.user_id] ? (
                          <AvatarImage src={profilesByUser[entry.user_id] || undefined} alt={entry.author || 'User'} />
                        ) : null}
                        <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))]">
                          {getInitials(entry.is_anonymous ? 'Anonymous' : (entry.author || 'User'))}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[hsl(var(--color-foreground))]">{entry.is_anonymous ? 'Anonymous' : (entry.author || 'Member')}</p>
                        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))]">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(entry.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${moodColors[entry.mood]}`}
                        style={{ border: '1px solid hsl(var(--color-border))' }}
                      >
                        <div className="flex items-center gap-1">
                          {moodIcons[entry.mood]}
                          <span className="capitalize">{entry.mood}</span>
                        </div>
                      </Badge>
                      {entry.user_id === user.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-[hsl(var(--color-accent))]"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[hsl(var(--color-background))]"
                            style={{ border: '1px solid hsl(var(--color-border))' }}
                          >
                            <DropdownMenuItem
                              className="gap-2 text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                              onClick={() => setEditEntry(entry)}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-[hsl(var(--color-destructive))] hover:bg-[hsl(var(--color-destructive)_/_0.1)] focus:text-[hsl(var(--color-destructive))]"
                              onClick={() => setDeleteId(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">{entry.title}</h3>
                      <div
                        className="text-[hsl(var(--color-muted-foreground))] leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: entry.content && entry.content.length > 300
                            ? `${entry.content.slice(0, 300)}...`
                            : entry.content || ''
                        }}
                      />
                    </div>

                    {/* Hashtags */}
                    {entry.hashtags && entry.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.hashtags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-[hsl(var(--color-muted))] text-[hsl(var(--color-foreground))]"
                          >
                            <Hash className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {/* Engagement */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-2 hover:bg-[hsl(var(--color-accent))] ${userLikes.has(entry.id) ? 'text-[hsl(var(--color-destructive))]' : 'text-[hsl(var(--color-foreground))]'}`}
                          onClick={() => toggleLike(entry.id)}
                        >
                          <Heart className={`h-4 w-4 ${userLikes.has(entry.id) ? 'fill-current' : ''}`} />
                          <span>{entry.likes || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                          onClick={() => setOpenCommentsFor(openCommentsFor === entry.id ? null : entry.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{entry.comments || 0}</span>
                        </Button>
                      </div>

                      {entry.content && entry.content.length > 300 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                          style={{ border: '1px solid hsl(var(--color-border))' }}
                        >
                          Read More
                        </Button>
                      )}
                    </div>
                    {openCommentsFor === entry.id && (
                      <CommentsSection entryId={entry.id} entryOwnerId={entry.user_id} />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEntries.length === 0 && !searchQuery && !selectedMood && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-[hsl(var(--color-muted))] rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-[hsl(var(--color-muted-foreground))]" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">No Public Entries Yet</h3>
            <p className="text-[hsl(var(--color-muted-foreground))] mb-4 max-w-sm mx-auto">
              Be the first to share your story with the community! Make your journal entries public to inspire others.
            </p>
          </div>
        )}

        {/* No Results State */}
        {!loading && filteredEntries.length === 0 && (searchQuery || selectedMood) && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-[hsl(var(--color-muted))] rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-[hsl(var(--color-muted-foreground))]" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">No Results Found</h3>
            <p className="text-[hsl(var(--color-muted-foreground))] mb-4 max-w-sm mx-auto">
              No entries match your current filters. Try adjusting your search or mood filter.
            </p>
            <Button
              onClick={() => { setSearchQuery(''); setSelectedMood(''); }}
              variant="outline"
              className="text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
              style={{ border: '1px solid hsl(var(--color-border))' }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {editEntry && (
        <EditJournalModal
          open={!!editEntry}
          onOpenChange={(open) => { if (!open) setEditEntry(null); }}
          entry={editEntry}
          onSave={async (updates) => {
            await updateEntry(editEntry.id, updates);
            setEditEntry(null);
            fetchPublicEntries();
            toast({ title: 'Entry updated' });
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent
          className="bg-[hsl(var(--color-background))]"
          style={{ border: '1px solid hsl(var(--color-border))' }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[hsl(var(--color-foreground))]">Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--color-muted-foreground))]">
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
              style={{ border: '1px solid hsl(var(--color-border))' }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteId) {
                  await deleteEntry(deleteId);
                  setDeleteId(null);
                  fetchPublicEntries();
                  toast({ title: 'Entry deleted' });
                }
              }}
              className="bg-[hsl(var(--color-destructive))] text-[hsl(var(--color-destructive-foreground))] hover:bg-[hsl(var(--color-destructive)_/_0.9)]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
