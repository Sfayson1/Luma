# Luma — Frontend

React + TypeScript + Vite frontend for [Luma](https://www.lumajournal.com), a private journaling app.

## Stack

- **React 19** + **TypeScript**
- **Vite 7** — build tool with HMR
- **Tailwind CSS v4** — styling
- **Radix UI** — accessible component primitives
- **Tiptap** — rich text editor for journal entries
- **Recharts** — mood analytics charts
- **React Router v7** — client-side routing
- **Lucide React** — icons

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

Create a `.env` file at the root of `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Structure

```
src/
├── components/
│   ├── layout/      # DashboardHeader, navigation
│   └── ui/          # Cards, modals, forms, analytics charts
├── hooks/           # useAuth, useJournalEntries, useToast
├── lib/             # apiFetch helper
├── pages/           # DashboardPage, SettingsPage, auth pages
└── services/        # analyticsService
```

## Deployment

Deployed on **Vercel**. Auto-deploys on push to `main`.

`vercel.json` includes a catch-all rewrite rule so React Router works correctly on hard reload:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
