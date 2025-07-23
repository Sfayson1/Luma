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
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Mood Trends</h3>
        <div className="text-center py-8 text-gray-500">
          No mood data available yet. Start journaling to see your mood trends!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Mood Trends Over Time</h3>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip
              labelFormatter={(value) => `Date: ${formatDate(value as string)}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />

            {moods.map((mood) => (
              <Line
                key={mood}
                type="monotone"
                dataKey={mood}
                stroke={moodColors[mood] || '#64748b'}
                strokeWidth={3}
                dot={{ fill: moodColors[mood] || '#64748b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: moodColors[mood] || '#64748b', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mood distribution summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Mood Distribution</h4>
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
                  style={{ backgroundColor: moodColors[mood] || '#64748b' }}
                />
                <div className="text-sm font-medium text-gray-700 capitalize">
                  {mood}
                </div>
                <div className="text-xs text-gray-500">
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
