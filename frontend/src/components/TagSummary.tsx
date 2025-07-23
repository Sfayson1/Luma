import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TagCount {
  name: string;
  count: number;
  color: string;
}

interface TagSummaryProps {
  tagCounts: TagCount[];
}

const TagSummary: React.FC<TagSummaryProps> = ({ tagCounts }) => {
  // Ensure tagCounts is always an array
  const safeTagCounts = tagCounts && Array.isArray(tagCounts) ? tagCounts : [];

  // Prepare data for charts
  const topTags = safeTagCounts.slice(0, 8); // Top 8 tags for better visualization
  const totalUsage = safeTagCounts.reduce((sum, tag) => sum + tag.count, 0);

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            <span style={{ color: data.color }}>●</span> Used {data.value} times
          </p>
        </div>
      );
    }
    return null;
  };

  if (!safeTagCounts || safeTagCounts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tag Usage</h3>
        <div className="text-center py-8 text-gray-500">
          No tags used yet. Start adding tags to your journal entries to see your patterns!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Tag Usage Summary</h3>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">
            {safeTagCounts.length}
          </div>
          <div className="text-sm text-indigo-700">Unique Tags</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {totalUsage}
          </div>
          <div className="text-sm text-green-700">Total Tag Uses</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {safeTagCounts[0]?.name || 'N/A'}
          </div>
          <div className="text-sm text-purple-700">Most Used Tag</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Top Tags by Usage</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTags} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis fontSize={12} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Tag Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topTags}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ name, percent }) =>
                    (percent && percent > 0.05) ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
                  }
                  labelLine={false}
                >
                  {topTags.map((tag, index) => (
                    <Cell key={`cell-${index}`} fill={tag.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, props: any) => [
                    `${value} uses (${((value / totalUsage) * 100).toFixed(1)}%)`,
                    props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tag List */}
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">All Tags</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safeTagCounts.map((tag, index) => {
            const percentage = totalUsage > 0 ? ((tag.count / totalUsage) * 100).toFixed(1) : '0.0';
            return (
              <div
                key={tag.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="font-medium text-gray-700">
                    {tag.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    {tag.count}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
        <h5 className="font-medium text-amber-800 mb-2">💡 Insights</h5>
        <div className="text-sm text-amber-700 space-y-1">
          {safeTagCounts.length > 5 && (
            <p>• You're exploring diverse topics with {safeTagCounts.length} different tags</p>
          )}
          {safeTagCounts[0] && safeTagCounts[0].count > 5 && (
            <p>• "{safeTagCounts[0].name}" is a recurring theme in your writing</p>
          )}
          {safeTagCounts.filter(tag => tag.count === 1).length > safeTagCounts.length / 2 && (
            <p>• You have many unique experiences - consider revisiting some themes</p>
          )}
          {totalUsage > 20 && (
            <p>• Great job organizing your thoughts with tags!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagSummary;
