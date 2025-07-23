import { supabase } from '../supabaseClient';

// Types for analytics data
export interface MoodDataPoint {
  date: string;
  mood: string;
  count: number;
}

export interface TagCount {
  name: string;
  count: number;
  color: string;
}

export interface AnalyticsData {
  moodOverTime: MoodDataPoint[];
  entryDates: string[];
  tagCounts: TagCount[];
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageEntriesPerWeek: number;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Fetch all user's posts with tags
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        mood,
        date_posted,
        post_tags(
          tag:tags(name, color)
        )
      `)
      .eq('owner_id', user.id)
      .order('date_posted', { ascending: true });

    if (postsError) throw postsError;

    // 1. Mood over time data
    const moodOverTime = calculateMoodOverTime(posts || []);

    // 2. Entry dates for streak calculation
    const entryDates = (posts || []).map(post =>
      new Date(post.date_posted).toISOString().split('T')[0]
    );

    // 3. Tag counts
    const tagCounts = calculateTagCounts(posts || []);

    // 4. Additional stats
    const totalEntries = posts?.length || 0;
    const streakData = calculateStreaks(entryDates);

    // 5. Weekly average
    const averageEntriesPerWeek = calculateWeeklyAverage(entryDates);

    return {
      moodOverTime,
      entryDates,
      tagCounts,
      totalEntries,
      currentStreak: streakData.current,
      longestStreak: streakData.longest,
      averageEntriesPerWeek
    };

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

// Helper function to calculate mood trends over time
function calculateMoodOverTime(posts: any[]): MoodDataPoint[] {
  const moodByDate: { [key: string]: { [mood: string]: number } } = {};

  posts.forEach(post => {
    if (post.mood) {
      const date = new Date(post.date_posted).toISOString().split('T')[0];

      if (!moodByDate[date]) {
        moodByDate[date] = {};
      }

      moodByDate[date][post.mood] = (moodByDate[date][post.mood] || 0) + 1;
    }
  });

  const result: MoodDataPoint[] = [];

  Object.entries(moodByDate).forEach(([date, moods]) => {
    Object.entries(moods).forEach(([mood, count]) => {
      result.push({ date, mood, count });
    });
  });

  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper function to calculate tag usage
function calculateTagCounts(posts: any[]): TagCount[] {
  const tagMap: { [name: string]: { count: number; color: string } } = {};

  posts.forEach(post => {
    if (post.post_tags) {
      post.post_tags.forEach((postTag: any) => {
        if (postTag.tag) {
          const tagName = postTag.tag.name;
          const tagColor = postTag.tag.color;

          if (tagMap[tagName]) {
            tagMap[tagName].count++;
          } else {
            tagMap[tagName] = { count: 1, color: tagColor };
          }
        }
      });
    }
  });

  return Object.entries(tagMap)
    .map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color
    }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to calculate writing streaks
function calculateStreaks(entryDates: string[]): { current: number; longest: number } {
  if (entryDates.length === 0) return { current: 0, longest: 0 };

  // Remove duplicates and sort
  const uniqueDates = [...new Set(entryDates)].sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (working backwards from today)
  const lastEntryDate = new Date(uniqueDates[uniqueDates.length - 1]);
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const lastEntryStr = uniqueDates[uniqueDates.length - 1];

  if (lastEntryStr === todayStr || lastEntryStr === yesterdayStr) {
    currentStreak = 1;

    // Count backwards
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const currDate = new Date(uniqueDates[i + 1]);
      const prevDate = new Date(uniqueDates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

// Helper function to calculate weekly average
function calculateWeeklyAverage(entryDates: string[]): number {
  if (entryDates.length === 0) return 0;

  const uniqueDates = [...new Set(entryDates)];
  const firstEntry = new Date(uniqueDates[0]);
  const lastEntry = new Date(uniqueDates[uniqueDates.length - 1]);

  const diffTime = lastEntry.getTime() - firstEntry.getTime();
  const diffWeeks = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));

  return Math.round((uniqueDates.length / diffWeeks) * 100) / 100;
}

// Additional utility functions for more specific analytics

export async function getMoodDistribution(): Promise<{ mood: string; count: number; percentage: number }[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('mood')
    .eq('owner_id', user.id)
    .not('mood', 'is', null);

  if (error) throw error;

  const moodCounts: { [mood: string]: number } = {};
  const total = posts?.length || 0;

  posts?.forEach(post => {
    moodCounts[post.mood] = (moodCounts[post.mood] || 0) + 1;
  });

  return Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count / total) * 100)
  }));
}

export async function getWritingPatternsByDay(): Promise<{ day: string; count: number }[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: posts, error } = await supabase
    .from('posts')
    .select('date_posted')
    .eq('owner_id', user.id);

  if (error) throw error;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = new Array(7).fill(0);

  posts?.forEach(post => {
    const day = new Date(post.date_posted).getDay();
    dayCounts[day]++;
  });

  return dayNames.map((day, index) => ({
    day,
    count: dayCounts[index]
  }));
}
