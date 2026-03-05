import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoProvider, useDemoContext } from '../demo/DemoProvider';
import { DemoBanner } from '../demo/DemoBanner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { BookOpen, Plus, PenTool, X } from 'lucide-react';
import { MoodAnalytics } from '../components/ui/mood-analytics';
import { JournalEntry } from '../hooks/useJournalEntries';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'difficult';

function DemoContent() {
  const { posts, createPost } = useDemoContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'entries' | 'analytics'>('entries');
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('okay');
  const [tagsInput, setTagsInput] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const tags = tagsInput
      .split(/[\s,]+/)
      .map((t) => t.trim().replace(/^#+/, ''))
      .filter(Boolean)
      .map((t) => `#${t}`);
    createPost({ title: '', content: content.trim(), mood, tags });
    setContent('');
    setTagsInput('');
    setMood('okay');
    setShowForm(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))]">
      <DemoBanner onSignUp={() => navigate('/signup')} />

      {/* Header */}
      <div className="border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold text-[hsl(var(--color-foreground))]">Luma</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('entries')}
                className={activeTab === 'entries' ? 'font-semibold' : ''}>
                Journal
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('analytics')}
                className={activeTab === 'analytics' ? 'font-semibold' : ''}>
                Analytics
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}
                className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))]">
                Sign up free
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-3xl">
        {activeTab === 'entries' && (
          <div className="space-y-6">
            {/* Prompt */}
            <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))] mb-2">
                  Today's Reflection
                </p>
                <p className="text-lg text-[hsl(var(--color-foreground))]">
                  What's one small thing that brought you peace today?
                </p>
              </CardContent>
            </Card>

            {/* Write entry */}
            {!showForm ? (
              <Button
                className="w-full gap-2 bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))]"
                onClick={() => setShowForm(true)}
              >
                <PenTool className="h-4 w-4" />
                Write a journal entry
              </Button>
            ) : (
              <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.3)' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      New Entry
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Textarea
                        placeholder="Express your thoughts and feelings..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        className="resize-none"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm">Mood</Label>
                        <Select value={mood} onValueChange={(v) => setMood(v as Mood)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="great">Great</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="okay">Okay</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="difficult">Difficult</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-sm">Tags</Label>
                        <Input
                          placeholder="#gratitude, #growth"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!content.trim()}>
                        Save entry
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {justSaved && (
              <div className="text-center text-sm text-[hsl(142_69%_40%)] font-medium">
                Entry saved! Sign up to keep your journal permanently.{' '}
                <button className="underline" onClick={() => navigate('/signup')}>Create an account</button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card style={{ border: '1px solid hsl(var(--color-border))', borderLeft: '4px solid hsl(var(--color-primary))' }}>
                <CardContent className="p-4">
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))]">Entries</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </CardContent>
              </Card>
              <Card style={{ border: '1px solid hsl(var(--color-border))', borderLeft: '4px solid hsl(142 69% 58%)' }}>
                <CardContent className="p-4">
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))]">Streak</p>
                  <p className="text-2xl font-bold">2 days</p>
                </CardContent>
              </Card>
              <Card style={{ border: '1px solid hsl(var(--color-border))', borderLeft: '4px solid hsl(var(--color-healing))' }}>
                <CardContent className="p-4">
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))]">This week</p>
                  <p className="text-2xl font-bold">3</p>
                </CardContent>
              </Card>
            </div>

            {/* Entries */}
            <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4" />
                    Entries
                  </CardTitle>
                  <Badge variant="secondary">{posts.length} total</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {post.title && (
                        <p className="text-sm font-medium text-[hsl(var(--color-foreground))]">{post.title}</p>
                      )}
                      <span className="text-xs text-[hsl(var(--color-muted-foreground))] whitespace-nowrap ml-auto">
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))] line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">{post.mood}</Badge>
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-[hsl(var(--color-primary))]">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" onClick={() => navigate('/signup')}>
                    Create your real journal →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <MoodAnalytics entries={posts.map((p): JournalEntry => ({
              id: String(p.id),
              title: p.title,
              content: p.content,
              author: 'Demo User',
              user_id: '0',
              timestamp: p.created_at,
              is_private: true,
              mood: p.mood as JournalEntry['mood'],
              hashtags: p.tags,
              likes: 0,
              comments: 0,
              created_at: p.created_at,
              updated_at: p.updated_at,
            }))} />
            <div className="text-center">
              <Button onClick={() => navigate('/signup')}>
                Start your real journal →
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DemoPage() {
  return (
    <DemoProvider>
      <DemoContent />
    </DemoProvider>
  );
}
