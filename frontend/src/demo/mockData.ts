// src/demo/mockData.ts
// Pre-seeded demo data — shaped to match your /api/posts/ response exactly.
// Edit these entries to customize what visitors see in the demo.

export type Post = {
  id: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: number;
};

export const DEMO_USER = {
  id: 0,
  email: "demo@lumajournal.com",
  username: "Demo User",
};

export const DEMO_PROMPT = {
  prompt: "What's one small thing that brought you peace today?",
};

export const DEMO_POSTS: Post[] = [
  {
    id: 1,
    title: "Morning check-in",
    content:
      "Woke up feeling more rested than usual. Made coffee and sat outside for a few minutes before the day started. It's the small rituals that keep me grounded.",
    mood: "😌 Calm",
    tags: ["#morning", "#gratitude"],
    created_at: new Date(Date.now() - 0 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 0 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 2,
    title: "Hard day at work",
    content:
      "Deadline pressure hit hard today. I kept second-guessing every decision. By the end I was just exhausted. Going to bed early and trying again tomorrow.",
    mood: "😔 Sad",
    tags: ["#burnout", "#work"],
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 3,
    title: "Therapy session",
    content:
      "Good session today. We talked about how I respond to criticism — turns out I internalize it way more than I realize. A lot to sit with but it felt productive.",
    mood: "🤔 Reflective",
    tags: ["#therapy", "#growth"],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 4,
    title: "Anxious for no reason",
    content:
      "Couldn't shake this low-level anxiety all day. Nothing specific triggered it. Just that background hum of dread. Went for a walk which helped a little.",
    mood: "😰 Anxious",
    tags: ["#anxiety", "#coping"],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 5,
    title: "Really good day",
    content:
      "Everything clicked today. Finished a project I'd been putting off, had a great conversation with a friend, and actually cooked a real meal. I want more days like this.",
    mood: "😄 Happy",
    tags: ["#gratitude", "#wins"],
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 6,
    title: "Journaling feels hard lately",
    content:
      "I keep opening this app and staring at a blank page. Not because nothing is happening — more because everything is and I don't know where to start.",
    mood: "😶 Numb",
    tags: ["#burnout", "#reflection"],
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 7,
    title: "Gratitude practice",
    content:
      "Three things I'm grateful for today: the way light hit the kitchen window this morning, a text from my sister, and the fact that I showed up even when I didn't want to.",
    mood: "🥹 Grateful",
    tags: ["#gratitude", "#morning"],
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 8,
    title: "Couldn't sleep",
    content:
      "Up at 3am again. My brain just wouldn't quiet down. Ended up writing in my notebook for a while which helped. Need to figure out a better wind-down routine.",
    mood: "😰 Anxious",
    tags: ["#sleep", "#anxiety"],
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 9,
    title: "Small win",
    content:
      "Finally replied to an email I'd been avoiding for two weeks. It took five minutes. I don't know why I make these things so much bigger in my head.",
    mood: "😌 Calm",
    tags: ["#wins", "#growth"],
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    user_id: 0,
  },
  {
    id: 10,
    title: "Missing someone",
    content:
      "Thought about my grandmother today out of nowhere. It's been two years. Grief is weird — it doesn't go away, it just changes shape.",
    mood: "😔 Sad",
    tags: ["#grief", "#reflection"],
    created_at: new Date(Date.now() - 16 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 16 * 86400000).toISOString(),
    user_id: 0,
  },
];

// Analytics derived from posts — computed once at import time
export function computeDemoAnalytics(posts: Post[]) {
  const moodCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};

  for (const post of posts) {
    moodCounts[post.mood] = (moodCounts[post.mood] || 0) + 1;
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  // Writing streak: count consecutive days from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const writtenDays = new Set(
    posts.map((p) => {
      const d = new Date(p.created_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    if (writtenDays.has(day.getTime())) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalEntries: posts.length,
    writingStreak: streak,
    moodCounts,
    tagCounts,
    topMood: Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
    topTag: Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
  };
}
