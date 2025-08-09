import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { TrendingUp, TrendingDown, Calendar, Heart, Brain, Target } from 'lucide-react';

interface MoodAnalyticsProps {
  entries: JournalEntry[];
}

const moodValues = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  difficult: 1
};

const moodColors = {
  great: '#10b981',
  good: '#3b82f6',
  okay: '#f59e0b',
  low: '#6b7280',
  difficult: '#8b5cf6'
};

const moodLabels = {
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  difficult: 'Difficult'
};

export const MoodAnalytics = ({ entries }: MoodAnalyticsProps) => {
  const analytics = useMemo(() => {
    if (!entries.length) return null;

    // Daily mood trends (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyMoods = last30Days.map(date => {
      const dayEntries = entries.filter(entry =>
        entry.created_at.split('T')[0] === date
      );

      if (dayEntries.length === 0) return { date, mood: null, count: 0 };

      const avgMood = dayEntries.reduce((sum, entry) =>
        sum + moodValues[entry.mood], 0
      ) / dayEntries.length;

      return {
        date,
        mood: Math.round(avgMood * 10) / 10,
        count: dayEntries.length,
        displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });

    // Mood distribution
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      mood: moodLabels[mood as keyof typeof moodLabels],
      count,
      percentage: Math.round((count / entries.length) * 100),
      color: moodColors[mood as keyof typeof moodColors]
    }));

    // Weekly trends
    const weeklyData = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });

      if (weekEntries.length > 0) {
        const avgMood = weekEntries.reduce((sum, entry) =>
          sum + moodValues[entry.mood], 0
        ) / weekEntries.length;

        weeklyData.push({
          week: `Week ${12 - i}`,
          mood: Math.round(avgMood * 10) / 10,
          entries: weekEntries.length,
          date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    }

    // Current stats
    const recentEntries = entries.slice(0, 10);
    const currentMoodAvg = recentEntries.length > 0
      ? recentEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / recentEntries.length
      : 0;

    const previousEntries = entries.slice(10, 20);
    const previousMoodAvg = previousEntries.length > 0
      ? previousEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / previousEntries.length
      : 0;

    const moodTrend = currentMoodAvg - previousMoodAvg;

    return {
      dailyMoods: dailyMoods.filter(d => d.mood !== null),
      moodDistribution,
      weeklyData,
      currentMoodAvg: Math.round(currentMoodAvg * 10) / 10,
      moodTrend: Math.round(moodTrend * 10) / 10,
      totalEntries: entries.length,
      averageMood: Math.round((entries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / entries.length) * 10) / 10
    };
  }, [entries]);

  if (!analytics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Brain className="h-12 w-12 text-[hsl(var(--color-muted-foreground))] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">No Data Yet</h3>
              <p className="text-[hsl(var(--color-muted-foreground))]">Start journaling to see your mood analytics!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Current Average</p>
                <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{analytics.currentMoodAvg}/5</p>
              </div>
              <Heart className="h-5 w-5 text-[hsl(var(--color-primary))]" />
            </div>
            <div className="flex items-center mt-2">
              {analytics.moodTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-[hsl(142_69%_58%)] mr-1" />
              ) : analytics.moodTrend < 0 ? (
                <TrendingDown className="h-4 w-4 text-[hsl(0_84%_60%)] mr-1" />
              ) : null}
              <span className={`text-sm ${
                analytics.moodTrend > 0 ? 'text-[hsl(142_69%_53%)]' :
                analytics.moodTrend < 0 ? 'text-[hsl(0_84%_55%)]' : 'text-[hsl(var(--color-muted-foreground))]'
              }`}>
                {analytics.moodTrend > 0 ? '+' : ''}{analytics.moodTrend} vs last 10 entries
              </span>
            </div>
          </CardContent>
        </Card>

        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Overall Average</p>
                <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{analytics.averageMood}/5</p>
              </div>
              <Target className="h-5 w-5 text-[hsl(200_80%_50%)]" />
            </div>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-2">
              Across {analytics.totalEntries} entries
            </p>
          </CardContent>
        </Card>

        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Best Mood</p>
                <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">
                  {analytics.moodDistribution.find(m => m.mood === 'Great')?.count || 0}
                </p>
              </div>
              <div className="w-3 h-3 rounded-full bg-[hsl(142_69%_58%)]" />
            </div>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-2">Great days</p>
          </CardContent>
        </Card>

        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Most Common</p>
                <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">
                  {analytics.moodDistribution.sort((a, b) => b.count - a.count)[0]?.mood || 'N/A'}
                </p>
              </div>
              <Calendar className="h-5 w-5 text-[hsl(var(--color-healing))]" />
            </div>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-2">
              {analytics.moodDistribution.sort((a, b) => b.count - a.count)[0]?.percentage || 0}% of time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Mood Trend */}
      <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Mood Trend (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.dailyMoods}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis
                dataKey="displayDate"
                stroke="hsl(var(--color-muted-foreground))"
                fontSize={12}
              />
              <YAxis
                domain={[1, 5]}
                stroke="hsl(var(--color-muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--color-background))',
                  border: '1px solid hsl(var(--color-border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--color-primary))"
                fill="hsl(var(--color-primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Overview */}
        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis
                  dataKey="week"
                  stroke="hsl(var(--color-muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  domain={[1, 5]}
                  stroke="hsl(var(--color-muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--color-background))',
                    border: '1px solid hsl(var(--color-border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="mood" fill="hsl(var(--color-primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.moodDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ mood, percentage }) => `${mood} (${percentage}%)`}
                  labelLine={false}
                >
                  {analytics.moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--color-background))',
                    border: '1px solid hsl(var(--color-border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {analytics.moodDistribution.map((item) => (
                <div key={item.mood} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    {item.mood}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Insights & Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.moodTrend > 0.5 && (
              <div className="flex items-start gap-3 p-3 bg-[hsl(142_69%_95%)]  border-[hsl(142_69%_80%)] rounded-lg">
                <TrendingUp className="h-5 w-5 text-[hsl(142_69%_40%)] mt-0.5" />
                <div>
                  <p className="font-medium text-[hsl(142_69%_25%)]">Positive Trend</p>
                  <p className="text-sm text-[hsl(142_69%_30%)]">
                    Your recent mood has been improving! Your last 10 entries show a {analytics.moodTrend.toFixed(1)} point increase.
                  </p>
                </div>
              </div>
            )}

            {analytics.moodTrend < -0.5 && (
              <div className="flex items-start gap-3 p-3 bg-[hsl(45_100%_95%)]  border-[hsl(45_100%_80%)] rounded-lg">
                <TrendingDown className="h-5 w-5 text-[hsl(45_100%_40%)] mt-0.5" />
                <div>
                  <p className="font-medium text-[hsl(45_100%_25%)]">Consider Support</p>
                  <p className="text-sm text-[hsl(45_100%_30%)]">
                    Your recent mood has been declining. Consider reaching out to friends, family, or a mental health professional.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-[hsl(200_80%_95%)] border-[hsl(200_80%_80%)] rounded-lg">
              <Target className="h-5 w-5 text-[hsl(200_80%_40%)] mt-0.5" />
              <div>
                <p className="font-medium text-[hsl(200_80%_25%)]">Consistency Insight</p>
                <p className="text-sm text-[hsl(200_80%_30%)]">
                  You've been journaling consistently! Regular reflection can help you better understand your emotional patterns.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
