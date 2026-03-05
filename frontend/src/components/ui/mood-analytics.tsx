import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { TrendingUp, TrendingDown, Calendar, Heart, Brain, Target, Tag, Flame } from 'lucide-react';

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

    // Writing patterns by day of week
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCountsMap = new Array(7).fill(0);
    entries.forEach(entry => {
      const d = new Date(entry.created_at);
      dayCountsMap[d.getDay()]++;
    });
    const writingPatterns = dayNames.map((day, i) => ({ day, count: dayCountsMap[i] }));

    // Tag usage (top 8)
    const tagCountsMap: Record<string, number> = {};
    entries.forEach(entry => {
      (entry.hashtags || []).forEach(tag => {
        tagCountsMap[tag] = (tagCountsMap[tag] || 0) + 1;
      });
    });
    const tagUsage = Object.entries(tagCountsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));

    // Streak history — last 12 weeks (84 days) as flat array
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const streakHistory = Array.from({ length: 84 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (83 - i));
      const dateStr = d.toISOString().split('T')[0];
      const count = entries.filter(e => e.created_at.split('T')[0] === dateStr).length;
      return { date: dateStr, count, day: d.getDay() };
    });

    // Current streak (consecutive days ending today)
    let currentStreak = 0;
    for (let i = 83; i >= 0; i--) {
      if (streakHistory[i].count > 0) currentStreak++;
      else break;
    }

    // Longest streak
    let longestStreak = 0;
    let running = 0;
    streakHistory.forEach(d => {
      if (d.count > 0) { running++; longestStreak = Math.max(longestStreak, running); }
      else running = 0;
    });

    // Best writing day
    const bestDayIndex = dayCountsMap.indexOf(Math.max(...dayCountsMap));
    const bestDay = dayNames[bestDayIndex];

    // Most used tag
    const topTag = tagUsage[0]?.tag ?? null;

    return {
      dailyMoods: dailyMoods.filter(d => d.mood !== null),
      moodDistribution,
      weeklyData,
      currentMoodAvg: Math.round(currentMoodAvg * 10) / 10,
      moodTrend: Math.round(moodTrend * 10) / 10,
      totalEntries: entries.length,
      averageMood: Math.round((entries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / entries.length) * 10) / 10,
      writingPatterns,
      tagUsage,
      streakHistory,
      currentStreak,
      longestStreak,
      bestDay,
      topTag,
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                {analytics.moodTrend > 0 ? '+' : ''}{analytics.moodTrend} vs prev 10
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
                <p className="text-sm font-medium text-[hsl(var(--color-muted-foreground))]">Current Streak</p>
                <p className="text-2xl font-bold text-[hsl(var(--color-foreground))]">{analytics.currentStreak}</p>
              </div>
              <Flame className="h-5 w-5 text-[hsl(25_95%_55%)]" />
            </div>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-2">
              Best: {analytics.longestStreak} days
            </p>
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

      {/* Streak History */}
      <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[hsl(25_95%_55%)]" />
            Streak History (Last 12 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 flex-wrap">
            {analytics.streakHistory.map((day, i) => (
              <div
                key={i}
                title={`${day.date}: ${day.count} ${day.count === 1 ? 'entry' : 'entries'}`}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: day.count === 0
                    ? 'hsl(var(--color-border))'
                    : day.count === 1
                    ? 'hsl(var(--color-primary) / 0.4)'
                    : 'hsl(var(--color-primary))'
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-[hsl(var(--color-muted-foreground))]">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[hsl(var(--color-border))]" />
              <span>No entry</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--color-primary) / 0.4)' }} />
              <span>1 entry</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--color-primary))' }} />
              <span>2+ entries</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Writing Patterns */}
        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Writing Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.writingPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="day" stroke="hsl(var(--color-muted-foreground))" fontSize={12} />
                <YAxis allowDecimals={false} stroke="hsl(var(--color-muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--color-background))',
                    border: '1px solid hsl(var(--color-border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, 'Entries']}
                />
                <Bar dataKey="count" fill="hsl(var(--color-healing))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tag Usage */}
        <Card style={{ border: '1px solid hsl(var(--color-primary) / 0.2)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Top Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.tagUsage.length === 0 ? (
              <div className="flex items-center justify-center h-[220px] text-[hsl(var(--color-muted-foreground))] text-sm">
                No tags used yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.tagUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis type="number" allowDecimals={false} stroke="hsl(var(--color-muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="tag" stroke="hsl(var(--color-muted-foreground))" fontSize={12} width={70} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--color-background))',
                      border: '1px solid hsl(var(--color-border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [value, 'Uses']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--color-primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
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
          <div className="space-y-3">
            {analytics.moodTrend > 0.5 && (
              <div className="flex items-start gap-3 p-3 bg-[hsl(142_69%_95%)] rounded-lg">
                <TrendingUp className="h-5 w-5 text-[hsl(142_69%_40%)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[hsl(142_69%_25%)]">Mood Improving</p>
                  <p className="text-sm text-[hsl(142_69%_30%)]">
                    Your last 10 entries are {analytics.moodTrend.toFixed(1)} points higher than the previous 10. Keep it up!
                  </p>
                </div>
              </div>
            )}

            {analytics.moodTrend < -0.5 && (
              <div className="flex items-start gap-3 p-3 bg-[hsl(45_100%_95%)] rounded-lg">
                <TrendingDown className="h-5 w-5 text-[hsl(45_100%_35%)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[hsl(45_100%_25%)]">Mood Dipping</p>
                  <p className="text-sm text-[hsl(45_100%_30%)]">
                    Your mood has dropped {Math.abs(analytics.moodTrend).toFixed(1)} points recently. Be gentle with yourself and consider reaching out for support.
                  </p>
                </div>
              </div>
            )}

            {analytics.currentStreak >= 3 && (
              <div className="flex items-start gap-3 p-3 bg-[hsl(25_95%_95%)] rounded-lg">
                <Flame className="h-5 w-5 text-[hsl(25_95%_45%)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[hsl(25_95%_25%)]">{analytics.currentStreak}-Day Streak</p>
                  <p className="text-sm text-[hsl(25_95%_30%)]">
                    You've journaled {analytics.currentStreak} days in a row.{analytics.currentStreak === analytics.longestStreak ? ' That\'s your personal best!' : ` Your longest streak is ${analytics.longestStreak} days — you're on your way!`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-[hsl(var(--color-serenity)_/_0.4)] rounded-lg">
              <Calendar className="h-5 w-5 text-[hsl(var(--color-primary))] mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-[hsl(var(--color-foreground))]">You write most on {analytics.bestDay}s</p>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  Consider setting a reminder for the rest of the week to build a consistent habit.
                </p>
              </div>
            </div>

            {analytics.topTag && (
              <div className="flex items-start gap-3 p-3 bg-[hsl(200_80%_95%)] rounded-lg">
                <Tag className="h-5 w-5 text-[hsl(200_80%_40%)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[hsl(200_80%_25%)]">Top theme: #{analytics.topTag}</p>
                  <p className="text-sm text-[hsl(200_80%_30%)]">
                    This tag appears most in your entries. It may reflect a recurring focus in your life right now.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
