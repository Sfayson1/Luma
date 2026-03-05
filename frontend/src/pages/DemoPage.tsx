import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoProvider, useDemoContext } from '../demo/DemoProvider';
import { DemoBanner } from '../demo/DemoBanner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { BookOpen, Plus, TrendingUp, Target } from 'lucide-react';

const moodLabels: Record<string, string> = {
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  difficult: 'Difficult',
};

function DemoContent() {
  const { posts, user } = useDemoContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'entries' | 'analytics'>('entries');

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
                <Button className="mt-4 gap-2" onClick={() => navigate('/signup')}>
                  <Plus className="h-4 w-4" />
                  Write your answer
                </Button>
              </CardContent>
            </Card>

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
                    Sample Entries
                  </CardTitle>
                  <Badge variant="secondary">{posts.length} entries</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-[hsl(var(--color-foreground))]">{post.title}</p>
                      <span className="text-xs text-[hsl(var(--color-muted-foreground))] whitespace-nowrap">
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
                    Create your own journal →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analytics Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  In your real account you'll see mood trend charts, streak history, writing patterns by day of week, top tags, and personalized insights — all built from your actual entries.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Mood Trends', 'Streak History', 'Writing Patterns', 'Top Tags'].map((feature) => (
                    <div
                      key={feature}
                      className="p-3 rounded-lg border border-[hsl(var(--color-border))] text-sm font-medium text-[hsl(var(--color-foreground))] flex items-center gap-2"
                    >
                      <Target className="h-4 w-4 text-[hsl(var(--color-primary))]" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full" onClick={() => navigate('/signup')}>
                  Start journaling for free
                </Button>
              </CardContent>
            </Card>
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
