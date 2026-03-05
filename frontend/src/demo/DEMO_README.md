# Luma Demo Mode

A zero-auth, static demo of Luma Journal that runs entirely in React state — no backend, no Neon, no Render calls.

## Files

```
src/demo/
├── mockData.ts        — Pre-seeded posts, prompt, user, and analytics computation
├── useDemoPosts.ts    — State-based drop-in for your real posts API calls
├── DemoProvider.tsx   — Context provider that wraps the demo route
└── DemoBanner.tsx     — "DEMO MODE" banner with sign-up CTA
```

---

## How to wire it in

### 1. Add a demo route in your router

```tsx
// src/App.tsx (or wherever your routes live)
import { DemoProvider } from "./demo/DemoProvider";
import { DemoBanner } from "./demo/DemoBanner";
import { JournalApp } from "./JournalApp"; // your main app component

<Route path="/demo" element={
  <DemoProvider>
    <DemoBanner onSignUp={() => navigate("/register")} />
    <JournalApp isDemo={true} />
  </DemoProvider>
} />
```

### 2. In your posts/journal components, check for demo mode

Wherever you currently call your real API (e.g. `fetch("/api/posts/")`), add a demo check:

```tsx
import { useDemoContext } from "../demo/DemoProvider";

// At the top of your component:
const isDemo = /* check if we're on /demo route, e.g.: */
  window.location.pathname.startsWith("/demo");

// Then conditionally use demo data:
const demoCtx = isDemo ? useDemoContext() : null;

const posts = isDemo
  ? demoCtx.posts
  : await fetch("/api/posts/", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json());
```

Or cleaner — pass `isDemo` as a prop down from your route and branch at the data layer.

### 3. Replace API mutation calls

| Real API call | Demo equivalent |
|---|---|
| `POST /api/posts/` | `demoCtx.createPost(data)` |
| `PUT /api/posts/{id}` | `demoCtx.updatePost(id, data)` |
| `DELETE /api/posts/{id}` | `demoCtx.deletePost(id)` |
| `GET /api/prompts/prompt-of-the-day` | `demoCtx.getPrompt()` |

### 4. Analytics

Your analytics are derived from posts. In demo mode:

```tsx
const analytics = isDemo
  ? demoCtx.analytics
  : computeAnalyticsFromPosts(posts); // your existing logic
```

`demoCtx.analytics` returns:
```ts
{
  totalEntries: number,
  writingStreak: number,
  moodCounts: Record<string, number>,
  tagCounts: Record<string, number>,
  topMood: string | null,
  topTag: string | null,
}
```

---

## Deploy the demo

Add `/demo` to your Vercel deployment. Link to it from:
- Your landing page ("Try the demo →")
- Your portfolio at sherikafayson.com
- Your GitHub README
- Handshake / LinkedIn posts

The demo URL will be: `https://lumajournal.com/demo`

---

## Customize the demo data

Edit `src/demo/mockData.ts` to change the pre-seeded entries. The entries are designed to feel authentic to a mental health journaling app — varied moods, real-sounding reflections, no fake positivity.
