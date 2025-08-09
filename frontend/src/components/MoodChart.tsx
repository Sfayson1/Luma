import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MoodDataPoint {
  date: string;
  mood: string;
  count: number;
}

interface MoodChartProps {
  moodData: MoodDataPoint[];
}

const MoodChart: React.FC<MoodChartProps> = ({ moodData }) => {
  // Transform data for the chart
  const chartData = React.useMemo(() => {
    if (!moodData || !Array.isArray(moodData)) return [];

    const dateMap: { [date: string]: any } = {};

    moodData.forEach(({ date, mood, count }) => {
      if (!dateMap[date]) {
        dateMap[date] = { date };
      }
      dateMap[date][mood] = count;
    });

    return Object.values(dateMap).sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [moodData]);

  // Get unique moods for the legend
  const moods = React.useMemo(() => {
    if (!moodData || !Array.isArray(moodData)) return [];

    const moodSet = new Set(moodData.map(d => d.mood));
    return Array.from(moodSet);
  }, [moodData]);

  // Color mapping for different moods
  const moodColors: { [key: string]: string } = {
    happy: '#22c55e',
    sad: '#3b82f6',
    anxious: '#f97316',
    calm: '#06b6d4',
    angry: '#ef4444',
    excited: '#8b5cf6',
    tired: '#6b7280',
    neutral: '#64748b'
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!moodData || moodData.length === 0) {
    return (
      <div className="bg-[hsl(var(--color-card))] p-6 rounded-lg shadow-[var(--shadow-gentle)]" >
        <h3 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-4">Mood Trends</h3>
        <div className="text-center py-8 text-[hsl(var(--color-muted-foreground))]">
          No mood data available yet. Start journaling to see your mood trends!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[hsl(var(--color-card))] p-6 rounded-lg shadow-[var(--shadow-gentle)]" >
      <h3 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-4">Mood Trends Over Time</h3>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="hsl(var(--color-muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--color-muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              labelFormatter={(value) => `Date: ${formatDate(value as string)}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--color-background))',
                border: '1px solid hsl(var(--color-border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-gentle)'
              }}
            />
            <Legend />

            {moods.map((mood) => (
              <Line
                key={mood}
                type="monotone"
                dataKey={mood}
                stroke={moodColors[mood] || 'hsl(var(--color-muted-foreground))'}
                strokeWidth={3}
                dot={{ fill: moodColors[mood] || 'hsl(var(--color-muted-foreground))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: moodColors[mood] || 'hsl(var(--color-muted-foreground))', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mood distribution summary */}
      <div className="mt-6 pt-4 border-[hsl(var(--color-border))]">
        <h4 className="text-lg font-medium text-[hsl(var(--color-foreground))] mb-3">Mood Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((mood) => {
            const totalCount = moodData
              .filter(d => d.mood === mood)
              .reduce((sum, d) => sum + d.count, 0);

            const totalEntries = moodData.reduce((sum, d) => sum + d.count, 0);
            const percentage = totalEntries > 0 ? Math.round((totalCount / totalEntries) * 100) : 0;

            return (
              <div key={mood} className="text-center">
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: moodColors[mood] || 'hsl(var(--color-muted-foreground))' }}
                />
                <div className="text-sm font-medium text-[hsl(var(--color-foreground))] capitalize">
                  {mood}
                </div>
                <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
                  {totalCount} entries ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodChart;
