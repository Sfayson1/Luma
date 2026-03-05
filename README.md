# Luma

A private, personal journaling app for mindful self-reflection. Luma lets you write freely, track your mood over time, and gain insight into your emotional patterns — all in a space that belongs only to you. No followers, no likes, no social noise.

**Demo:** [www.lumajournal.com](https://www.lumajournal.com/demo)

---

## Features

- **Journal entries** — Create, edit, and delete entries with mood and hashtag support
- **Daily reflection prompt** — A new curated prompt each day, automatically rotated (no manual setup needed)
- **Mood tracking** — Log your mood per entry: Great, Good, Okay, Low, or Difficult
- **Hashtags** — Tag entries to identify recurring themes
- **Search** — Full-text search across all your entries by content or hashtag
- **Analytics**
  - Daily and weekly mood trend charts
  - Mood distribution breakdown
  - 12-week streak history heatmap
  - Writing patterns by day of week
  - Top tags usage chart
  - Data-driven personal insights
- **Streak tracking** — Current streak, longest streak, and milestone achievements
- **Settings** — Update account info, change password, toggle light/dark theme, manage privacy preferences
- **Mental health resources** — Crisis support lines and self-care guidance

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 7 | Build tool |
| Tailwind CSS v4 | Styling |
| Radix UI | Accessible component primitives |
| Tiptap | Rich text editor for journal entries |
| Recharts | Analytics charts |
| React Router v7 | Client-side routing |
| Lucide React | Icons |

### Backend
| Tool | Purpose |
|---|---|
| FastAPI | REST API framework |
| SQLAlchemy | ORM |
| PostgreSQL (Neon) | Database |
| python-jose | JWT authentication |
| passlib + bcrypt | Password hashing |
| Uvicorn | ASGI server |

### Deployment
| Service | What |
|---|---|
| Vercel | Frontend — auto-deploys on push to `main` |
| Render | Backend — auto-deploys on commit |

---

## Project Structure

```
Luma/
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/    # DashboardHeader, navigation
│   │   │   └── ui/        # Cards, modals, forms, analytics charts
│   │   ├── hooks/         # useAuth, useJournalEntries, useToast
│   │   ├── lib/           # apiFetch helper
│   │   ├── pages/         # DashboardPage, SettingsPage, auth pages
│   │   └── services/      # analyticsService
│   └── vercel.json        # SPA catch-all rewrite rule
│
└── backend/               # FastAPI app
    ├── routers/
    │   ├── auth.py        # Login, register, JWT
    │   ├── posts.py       # Journal entry CRUD (user-scoped)
    │   ├── prompts.py     # Daily prompt — static list, date-seeded rotation
    │   └── users.py       # User profile, password change
    ├── models.py          # SQLAlchemy models
    ├── schemas.py         # Pydantic request/response schemas
    ├── database.py        # DB connection and session
    └── main.py            # App entrypoint, CORS, router registration
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL database (or a [Neon](https://neon.tech) connection string)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://user:password@host/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

```bash
uvicorn main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/posts/` | Get all entries for current user |
| POST | `/api/posts/` | Create a new entry |
| PUT | `/api/posts/{id}` | Update an entry |
| DELETE | `/api/posts/{id}` | Delete an entry |
| GET | `/api/prompts/prompt-of-the-day` | Get today's reflection prompt |
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update profile |
| PUT | `/api/users/me/password` | Change password |

All protected routes require an `Authorization: Bearer <token>` header.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |

---

## Important Notice

Luma is designed to support mental wellness through journaling and self-reflection. It is not a substitute for professional mental health treatment. If you are experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

**US Crisis Line:** 988 Suicide & Crisis Lifeline

---

## Author

Made by [Sherika Fayson](https://github.com/sherikafayson)
