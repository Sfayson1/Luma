import { me } from "../lib/auth";
import { apiFetch } from "../lib/api";

// Types for analytics data
export interface MoodDataPoint {
  date: string; // YYYY-MM-DD
  mood: string;
  count: number;
}

export interface TagCount {
  name: string;
  count: number;
  color?: string; // optional now (FastAPI may not have it yet)
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

// Match your backend PostOutWithUser shape as best as possible
// Adjust fields if your API differs.
type PostFromApi = {
  id: number;
  content: string;
  date_posted: string; // ISO string or YYYY-MM-DD
  mood?: string | null;
  privacy: string;
  tags?: string | null; // currently a string in your schema
  prompt_id?: number | null;
  owner_id: string;
};

function toYYYYMMDD(dateValue: string): string {
  // Handles ISO timestamps or YYYY-MM-DD
  const d = new Date(dateValue);
  if (!Number.isNaN(d.getTime())) return d.toISOString().split("T")[0];
  // fallback if already YYYY-MM-DD
  return dateValue.split("T")[0];
}

function parseTags(tags?: string | null): string[] {
  if (!tags) return [];

  // Common formats:
  // "work, school, family"
  // "#work #school"
  // "work|school|family"
  // '["work","school"]' (if you ever store JSON as string)
  const trimmed = tags.trim();

  // JSON string array case
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) return arr.map(String).map(t => t.trim()).filter(Boolean);
    } catch {
      // fall through
    }
  }

  // Hashtags -> split on whitespace
  if (trimmed.includes("#")) {
    return trimmed
      .split(/\s+/)
      .map(t => t.replace(/^#+/, "").trim())
      .filter(Boolean);
  }

  // Pipe or comma separated
  return trimmed
    .split(/[,|]/g)
    .map(t => t.trim())
    .filter(Boolean);
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    // Ensure user is authenticated (and token works)
    await me();

    // Fetch all posts visible to current user (your backend filters privacy)
    const posts = await apiFetch<PostFromApi[]>("/api/posts/");

    // Mood over time
    const moodOverTime = calculateMoodOverTime(posts);

    // Entry dates
    const entryDates = posts.map(p => toYYYYMMDD(p.date_posted));

    // Tag counts
    const tagCounts = calculateTagCounts(posts);

    // Additional stats
    const totalEntries = posts.length;
    const streakData = calculateStreaks(entryDates);

    // Weekly average
    const averageEntriesPerWeek = calculateWeeklyAverage(entryDates);

    return {
      moodOverTime,
      entryDates,
      tagCounts,
      totalEntries,
      currentStreak: streakData.current,
      longestStreak: streakData.longest,
      averageEntriesPerWeek,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
}

// Helper function to calculate mood trends over time
function calculateMoodOverTime(posts: PostFromApi[]): MoodDataPoint[] {
  const moodByDate: Record<string, Record<string, number>> = {};

  posts.forEach((post) => {
    if (post.mood) {
      const date = toYYYYMMDD(post.date_posted);

      if (!moodByDate[date]) moodByDate[date] = {};
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

// Helper function to calculate tag usage (no colors unless your API provides them)
function calculateTagCounts(posts: PostFromApi[]): TagCount[] {
  const tagMap: Record<string, { count: number }> = {};

  posts.forEach((post) => {
    const tags = parseTags(post.tags);
    tags.forEach((tagName) => {
      if (!tagMap[tagName]) tagMap[tagName] = { count: 0 };
      tagMap[tagName].count++;
    });
  });

  return Object.entries(tagMap)
    .map(([name, data]) => ({ name, count: data.count }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to calculate writing streaks
function calculateStreaks(entryDates: string[]): { current: number; longest: number } {
  if (entryDates.length === 0) return { current: 0, longest: 0 };

  const uniqueDates = [...new Set(entryDates)].sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

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

  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const lastEntryStr = uniqueDates[uniqueDates.length - 1];

  if (lastEntryStr === todayStr || lastEntryStr === yesterdayStr) {
    currentStreak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const currDate = new Date(uniqueDates[i + 1]);
      const prevDate = new Date(uniqueDates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) currentStreak++;
      else break;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

// Helper function to calculate weekly average
function calculateWeeklyAverage(entryDates: string[]): number {
  if (entryDates.length === 0) return 0;

  const uniqueDates = [...new Set(entryDates)].sort();
  const firstEntry = new Date(uniqueDates[0]);
  const lastEntry = new Date(uniqueDates[uniqueDates.length - 1]);

  const diffTime = lastEntry.getTime() - firstEntry.getTime();
  const diffWeeks = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));

  return Math.round((uniqueDates.length / diffWeeks) * 100) / 100;
}

export async function getMoodDistribution(): Promise<
  { mood: string; count: number; percentage: number }[]
> {
  await me();
  const posts = await apiFetch<PostFromApi[]>("/api/posts/");

  const moodPosts = posts.filter(p => !!p.mood) as Array<PostFromApi & { mood: string }>;
  const total = moodPosts.length;

  const moodCounts: Record<string, number> = {};
  moodPosts.forEach(p => {
    moodCounts[p.mood!] = (moodCounts[p.mood!] || 0) + 1;
  });

  return Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: total ? Math.round((count / total) * 100) : 0,
  }));
}

export async function getWritingPatternsByDay(): Promise<{ day: string; count: number }[]> {
  await me();
  const posts = await apiFetch<PostFromApi[]>("/api/posts/");

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayCounts = new Array(7).fill(0);

  posts.forEach(post => {
    const d = new Date(post.date_posted);
    if (!Number.isNaN(d.getTime())) {
      dayCounts[d.getDay()]++;
    }
  });

  return dayNames.map((day, index) => ({ day, count: dayCounts[index] }));
}
