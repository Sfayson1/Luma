import React, { useState, useEffect, useCallback } from 'react';

// Types
interface Tag {
  id: number;
  name: string;
  color: string;
}

interface PostFilters {
  mood?: string;
  tagIds?: number[];
  dateFrom?: string;
  dateTo?: string;
}

interface Post {
  id: number;
  content: string;
  mood: string;
  date_posted: string;
  post_tags: Array<{
    tag: Tag;
  }>;
}

interface PostFilterProps {
  onFiltersChange: (filters: PostFilters) => void;
  availableTags?: Tag[];
  availableMoods?: string[];
  isLoading?: boolean;
}

const PostFilter: React.FC<PostFilterProps> = ({
  onFiltersChange,
  availableTags = [],
  availableMoods = ['happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 'tired', 'neutral'],
  isLoading = false
}) => {
  const [filters, setFilters] = useState<PostFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Apply filters whenever they change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]); // Remove onFiltersChange from dependencies

  const updateFilter = (key: keyof PostFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  const toggleTag = (tagId: number) => {
    const currentTags = filters.tagIds || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];

    updateFilter('tagIds', newTags.length > 0 ? newTags : undefined);
  };

  const moodEmojis: { [key: string]: string } = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    calm: '😌',
    angry: '😠',
    excited: '🤩',
    tired: '😴',
    neutral: '😐'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-800">Filter Posts</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : Boolean(v)).length} active
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Quick Filters (always visible) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Mood Pills */}
        {availableMoods.slice(0, 4).map(mood => (
          <button
            key={mood}
            onClick={() => updateFilter('mood', filters.mood === mood ? undefined : mood)}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filters.mood === mood
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{moodEmojis[mood]}</span>
            {mood}
          </button>
        ))}

        {/* Popular Tags */}
        {availableTags.slice(0, 3).map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filters.tagIds?.includes(tag.id)
                ? 'text-white'
                : 'text-gray-700 hover:opacity-80'
            }`}
            style={{
              backgroundColor: filters.tagIds?.includes(tag.id) ? tag.color : `${tag.color}20`,
              borderColor: tag.color,
              borderWidth: '1px'
            }}
          >
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
          </button>
        ))}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* All Moods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood
            </label>
            <div className="flex flex-wrap gap-2">
              {availableMoods.map(mood => (
                <button
                  key={mood}
                  onClick={() => updateFilter('mood', filters.mood === mood ? undefined : mood)}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.mood === mood
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{moodEmojis[mood]}</span>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* All Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags {filters.tagIds && filters.tagIds.length > 0 && (
                <span className="text-blue-600">({filters.tagIds.length} selected)</span>
              )}
            </label>
            <div className="max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.tagIds?.includes(tag.id)
                        ? 'text-white'
                        : 'text-gray-700 hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: filters.tagIds?.includes(tag.id) ? tag.color : `${tag.color}20`,
                      borderColor: tag.color,
                      borderWidth: '1px'
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                    {filters.tagIds?.includes(tag.id) && (
                      <span className="ml-2">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Applying filters...</span>
        </div>
      )}
    </div>
  );
};

// Post List Component that uses the filter
interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <div className="text-gray-500 mb-2">📝</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No entries found</h3>
        <p className="text-gray-500">
          Try adjusting your filters or create a new journal entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {post.mood === 'happy' ? '😊' :
                 post.mood === 'sad' ? '😢' :
                 post.mood === 'anxious' ? '😰' :
                 post.mood === 'calm' ? '😌' :
                 post.mood === 'angry' ? '😠' :
                 post.mood === 'excited' ? '🤩' :
                 post.mood === 'tired' ? '😴' : '😐'}
              </span>
              <div>
                <div className="font-medium text-gray-800 capitalize">{post.mood}</div>
                <div className="text-sm text-gray-500">
                  {new Date(post.date_posted).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-3 line-clamp-3">
            {post.content}
          </p>

          {post.post_tags && post.post_tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.post_tags.map((postTag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: postTag.tag.color }}
                >
                  {postTag.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main component that combines filter and posts
const FilterablePosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Mock posts data
    const mockPosts: Post[] = [
      {
        id: 1,
        content: "Today was a great day! I felt really productive and accomplished a lot of my goals.",
        mood: "happy",
        date_posted: "2025-07-17T10:00:00Z",
        post_tags: [
          { tag: { id: 1, name: "productivity", color: "#22c55e" } },
          { tag: { id: 2, name: "goals", color: "#3b82f6" } }
        ]
      },
      {
        id: 2,
        content: "Feeling a bit overwhelmed with work deadlines. Need to find better work-life balance.",
        mood: "anxious",
        date_posted: "2025-07-16T15:30:00Z",
        post_tags: [
          { tag: { id: 3, name: "work", color: "#f97316" } },
          { tag: { id: 4, name: "stress", color: "#ef4444" } }
        ]
      },
      {
        id: 3,
        content: "Had a peaceful morning with coffee and reading. These quiet moments are so important.",
        mood: "calm",
        date_posted: "2025-07-15T08:00:00Z",
        post_tags: [
          { tag: { id: 5, name: "mindfulness", color: "#8b5cf6" } },
          { tag: { id: 6, name: "self-care", color: "#ec4899" } }
        ]
      }
    ];

    const mockTags: Tag[] = [
      { id: 1, name: "productivity", color: "#22c55e" },
      { id: 2, name: "goals", color: "#3b82f6" },
      { id: 3, name: "work", color: "#f97316" },
      { id: 4, name: "stress", color: "#ef4444" },
      { id: 5, name: "mindfulness", color: "#8b5cf6" },
      { id: 6, name: "self-care", color: "#ec4899" }
    ];

    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
    setAvailableTags(mockTags);
  }, []);

  const handleFiltersChange = useCallback((filters: PostFilters) => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...posts];

      // Filter by mood
      if (filters.mood) {
        filtered = filtered.filter(post => post.mood === filters.mood);
      }

      // Filter by tags
      if (filters.tagIds && filters.tagIds.length > 0) {
        filtered = filtered.filter(post =>
          post.post_tags.some(postTag => filters.tagIds?.includes(postTag.tag.id))
        );
      }

      // Filter by date range
      if (filters.dateFrom) {
        filtered = filtered.filter(post =>
          new Date(post.date_posted) >= new Date(filters.dateFrom!)
        );
      }

      if (filters.dateTo) {
        filtered = filtered.filter(post =>
          new Date(post.date_posted) <= new Date(filters.dateTo!)
        );
      }

      setFilteredPosts(filtered);
      setIsLoading(false);
    }, 500);
  }, [posts]); // Only depend on posts

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1F2937] mb-6">
        My Journal Entries
      </h1>

      <PostFilter
        onFiltersChange={handleFiltersChange}
        availableTags={availableTags}
        isLoading={isLoading}
      />

      <PostList posts={filteredPosts} isLoading={isLoading} />
    </div>
  );
};

export default FilterablePosts;
