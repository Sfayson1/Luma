import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { CreateJournal } from '../components/ui/create-journal';
import { SimpleJournalCard } from '../components/ui/simple-journal-card';
import { DashboardHeader } from '../components/layout/dashboard-header';
import { MoodAnalytics } from '../components/ui/mood-analytics';
import { supabase } from '@/integrations/supabase/client';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  TrendingUp,
  Calendar,
  Lightbulb,
  Plus,
  Smile,
  Frown,
  Meh,
  Sun,
  Cloud,
  CloudRain,
  Loader2,
  BookOpen,
  Target,
  Award,
  Share2,
  Search,
  Users
} from 'lucide-react';

const moodIcons = {
  great: Sun,
  good: Smile,
  okay: Meh,
  low: Cloud,
  difficult: CloudRain
};

const moodColors = {
  great: 'bg-[hsl(142_69%_95%)] text-[hsl(142_69%_30%)] border-[hsl(142_69%_80%)]',
  good: 'bg-[hsl(200_80%_95%)] text-[hsl(200_80%_30%)] border-[hsl(200_80%_80%)]',
  okay: 'bg-[hsl(45_100%_95%)] text-[hsl(45_100%_30%)] border-[hsl(45_100%_80%)]',
  low: 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] border-[hsl(var(--color-border))]',
  difficult: 'bg-[hsl(var(--color-healing)_/_0.1)] text-[hsl(var(--color-healing))] border-[hsl(var(--color-healing)_/_0.3)]'
};

const dailyPrompts = [
  "What brought you joy today?",
  "How did you practice self-care this week?",
  "What's one thing you're grateful for right now?",
  "How are you feeling in this moment?",
  "What would you tell your past self?",
  "What challenged you today and how did you grow?",
  "Describe a moment that made you smile recently."
];

 const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { entries, loading: entriesLoading, createEntry, updateEntry, deleteEntry } = useJournalEntries();
  const [currentPrompt] = useState(dailyPrompts[new Date().getDay() % dailyPrompts.length]);
  const [activeTab, setActiveTab] = useState<"entries" | "analytics" | "resources">("entries");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Load avatar on user change (must be declared before early returns to keep hooks order stable)
  useEffect(() => {
    const id = user?.id;
    if (!id) return;
    supabase
      .from('profiles')
      .select('avatar_url')
      .eq('user_id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setAvatarUrl(data?.avatar_url ?? null);
      });
  }, [user?.id]);

  const handleCreateEntry = async (newEntry: { title: string; content: string; isPrivate: boolean; isAnonymous: boolean; mood: 'great' | 'good' | 'okay' | 'low' | 'difficult'; hashtags: string[] }) => {
    await createEntry({
      title: newEntry.title,
      content: newEntry.content,
      is_private: newEntry.isPrivate,
      is_anonymous: newEntry.isAnonymous,
      mood: newEntry.mood,
      hashtags: newEntry.hashtags
    });
    setShowCreateForm(false);
  };

  const handleUpdateEntry = async (id: string, updates: any) => {
    await updateEntry(id, updates);
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
  };

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--color-background))] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[hsl(var(--color-background))] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
          <p className="text-[hsl(var(--color-muted-foreground))]">You need to be authenticated to view your journal entries.</p>
        </div>
      </div>
    );
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

  // Calculate actual streak based on journal entries
  const calculateStreak = (journalEntries: any[]) => {
    if (!journalEntries.length) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get unique dates with entries (sorted newest first)
    const entryDates = [...new Set(journalEntries.map(entry => {
      const date = new Date(entry.created_at);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }))].sort((a: number, b: number) => b - a);

    if (!entryDates.length) return 0;

    let streak = 0;
    let currentDate = today.getTime();

    // Check if there's an entry today or yesterday (to account for different time zones)
    const mostRecentEntry = entryDates[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (mostRecentEntry === today.getTime()) {
      // Entry today
      streak = 1;
      currentDate = today.getTime();
    } else if (mostRecentEntry === yesterday.getTime()) {
      // Entry yesterday, start from yesterday
      streak = 1;
      currentDate = yesterday.getTime();
    } else {
      // No recent entries, streak is 0
      return 0;
    }

    // Count consecutive days backwards
    for (let i = 1; i < entryDates.length; i++) {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);

      if (entryDates[i] === prevDay.getTime()) {
        streak++;
        currentDate = prevDay.getTime();
      } else {
        break;
      }
    }

    return streak;
  };

  const userStreak = calculateStreak(entries);

  // Filter entries based on search query
  const filteredEntries = entries.filter(entry => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const titleMatch = entry.title?.toLowerCase().includes(query);
    const contentMatch = entry.content?.toLowerCase().includes(query);
    const hashtagMatch = entry.hashtags?.some(tag => tag.toLowerCase().includes(query));

    return titleMatch || contentMatch || hashtagMatch;
  });

  const totalEntries = entries.length;
  const publicEntries = entries.filter(e => !e.is_private).length;
  const totalLikes = entries.reduce((sum, entry) => sum + (entry.likes || 0), 0);
  const thisWeekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate > weekAgo;
  }).length;

  const streakProgress = Math.min((userStreak / 30) * 100, 100);

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))]">
      <DashboardHeader
        userName={userName}
        avatarUrl={avatarUrl}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-2">
                Welcome back, {userName.split(' ')[0]}! ✨
              </h1>
              <p className="text-[hsl(var(--color-muted-foreground))] text-lg">
                Ready to continue your mindful journey?
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2 bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary)_/_0.9)]"
            >
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card style={{ border: '1px solid hsl(var(--color-border))', borderLeft: '4px solid hsl(var(--color-primary))'  }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Total Entries</p>
                  <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{totalEntries}</p>
                </div>
                <BookOpen className="h-5 w-5 text-[hsl(var(--color-primary))]" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ border: '1px solid hsl(var(--color-border))', borderLeft: '4px solid hsl(142 69% 58%)' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Current Streak</p>
                  <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{userStreak} days</p>
                </div>
                <Target className="h-5 w-5 text-[hsl(142_69%_58%)]" />
              </div>
              <div className="mt-2">
                <Progress value={streakProgress} className="h-2" />
                <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-1">
                  {30 - userStreak} days to 30-day milestone
                </p>
              </div>
            </CardContent>
          </Card>

          <Card  style={{ border: '1px solid hsl(var(--color-border))', borderLeft: '4px solid hsl(200 80% 50%)' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Community Support</p>
                  <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{totalLikes}</p>
                </div>
                <Heart className="h-5 w-5 text-[hsl(200_80%_50%)]" />
              </div>
            </CardContent>
          </Card>

          <Card  style={{ border: '1px solid hsl(var(--color-border))', borderLeft: '4px solid hsl(var(--color-healing))'}}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">This Week</p>
                  <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{thisWeekEntries}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-[hsl(var(--color-healing))]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "entries" && (
              <>
                {/* Daily Prompt Card */}
                <Card className="bg-[linear-gradient(to_bottom_right,hsl(var(--color-primary)_/_0.05),hsl(var(--color-primary)_/_0.1))]" style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-[hsl(var(--color-primary)_/_0.1)] rounded-full flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-[hsl(var(--color-primary))]" />
                    </div>
                    <CardTitle className="text-xl">Today's Reflection</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg text-[hsl(var(--color-muted-foreground))] leading-relaxed">
                      {currentPrompt}
                    </p>
                  </CardContent>
                </Card>

                {/* Create Journal Form */}
                {showCreateForm && (
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        New Journal Entry
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CreateJournal onSubmit={handleCreateEntry} />
                    </CardContent>
                  </Card>
                )}

                {/* Community Link */}
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/community')} style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Community Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[hsl(var(--color-muted-foreground))] mb-4">
                      Discover stories from fellow journal writers, find inspiration, and connect with the community.
                    </p>
                    <Button variant="outline" className="w-full" style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
                      Explore Community
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Entries */}
                <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Recent Entries
                      </CardTitle>
                      <Badge variant="secondary">{totalEntries} total</Badge>
                    </div>
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--color-muted-foreground))] h-4 w-4"/>
                      <Input
                        placeholder="Search entries by title, content, or hashtags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {entriesLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-[hsl(var(--color-muted-foreground))]">Loading your entries...</p>
                      </div>
                    ) : filteredEntries.length > 0 ? (
                      <div className="space-y-4">
                        {searchQuery && (
                          <div className="text-sm text-[hsl(var(--color-muted-foreground))] mb-4">
                            Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} matching "{searchQuery}"
                          </div>
                        )}
                        {filteredEntries.slice(0, searchQuery ? 10 : 5).map((entry) => (
                          <SimpleJournalCard
                            key={entry.id}
                            entry={{
                              ...entry,
                              timestamp: new Date(entry.created_at).toLocaleDateString(),
                              hashtags: entry.hashtags || []
                            }}
                            onEdit={handleUpdateEntry}
                            onDelete={handleDeleteEntry}
                            showManagement={true}
                            avatarUrl={avatarUrl}
                          />
                        ))}
                        {!searchQuery && entries.length > 5 && (
                          <div className="text-center pt-4">
                            <Button variant="outline">View All Entries</Button>
                          </div>
                        )}
                      </div>
                    ) : searchQuery ? (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-[hsl(var(--color-muted))] rounded-full flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-[hsl(var(--color-muted-foreground))]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">No Results Found</h3>
                        <p className="text-[hsl(var(--color-muted-foreground))] mb-4 max-w-sm mx-auto">
                          No entries match your search for "{searchQuery}". Try different keywords or check your spelling.
                        </p>
                        <Button onClick={() => setSearchQuery("")} variant="outline">
                          Clear Search
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-[hsl(var(--color-muted))] rounded-full flex items-center justify-center mb-4">
                          <BookOpen className="h-8 w-8 text-[hsl(var(--color-muted-foreground))]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">Start Your Journey</h3>
                        <p className="text-[hsl(var(--color-muted-foreground))] mb-4 max-w-sm mx-auto">
                          Your first journal entry is just a click away. Use today's prompt or share what's on your mind.
                        </p>
                        <Button onClick={() => setShowCreateForm(true)} variant="outline">
                          Write Your First Entry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <MoodAnalytics entries={entries} />
              </div>
            )}

            {activeTab === "resources" && (
              <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
                <CardHeader>
                  <CardTitle>Mental Health Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg" style={{ border: '1px solid hsl(var(--color-border))' }}>
                      <h4 className="font-semibold mb-2">Crisis Support</h4>
                      <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
                        If you're in immediate danger, please contact emergency services.
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>• US: 988 Suicide & Crisis Lifeline</p>
                        <p>• UK: 116 123 Samaritans</p>
                        <p>• Emergency: 911 (US) / 999 (UK)</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg" style={{ border: '1px solid hsl(var(--color-border))' }}>
                      <h4 className="font-semibold mb-2">Professional Help</h4>
                      <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
                        Consider speaking with a mental health professional if you're experiencing persistent difficulties.
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>• Find a therapist: Psychology Today</p>
                        <p>• Online therapy: BetterHelp, Talkspace</p>
                        <p>• Your healthcare provider</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg"style={{ border: '1px solid hsl(var(--color-border))' }}>
                      <h4 className="font-semibold mb-2">Self-Care Tips</h4>
                      <div className="space-y-1 text-sm text-[hsl(var(--color-muted-foreground))]">
                        <p>• Regular exercise and movement</p>
                        <p>• Consistent sleep schedule</p>
                        <p>• Mindfulness and meditation</p>
                        <p>• Social connections and support</p>
                        <p>• Limit alcohol and substances</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card style={{ border: '1px solid hsl(var(--color-border))' }}>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowCreateForm(true)}
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                >
                  <Plus className="h-4 w-4" />
                  New Entry
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab("analytics")}
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                >
                  <TrendingUp className="h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card style={{ border: '1px solid hsl(var(--color-border))' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Entries Written</span>
                      <span>{thisWeekEntries}/7</span>
                    </div>
                    <Progress value={(thisWeekEntries / 7) * 100} className="h-2" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                      {thisWeekEntries >= 7 ? "Amazing week! 🎉" : `${7 - thisWeekEntries} more to go!`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[hsl(142_69%_90%)] rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-[hsl(142_69%_40%)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">First Entry</p>
                      <p className="text-xs text-[hsl(var(--color-muted-foreground))]">Started your journey</p>
                    </div>
                  </div>

                  {userStreak >= 7 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[hsl(200_80%_90%)] rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-[hsl(200_80%_40%)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Week Warrior</p>
                        <p className="text-xs text-[hsl(var(--color-muted-foreground))]">7-day streak</p>
                      </div>
                    </div>
                  )}

                  {publicEntries > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[hsl(var(--color-healing)_/_0.2)] rounded-full flex items-center justify-center">
                        <Share2 className="h-4 w-4 text-[hsl(var(--color-healing))]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Community Builder</p>
                        <p className="text-xs text-[hsl(var(--color-muted-foreground))]">Shared publicly</p>
                      </div>
                    </div>
                  )}

                  {totalEntries === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                        Start writing to unlock achievements!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
export default DashboardPage;
