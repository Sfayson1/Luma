## 🌙 Luma

**Luma** is a calming journaling app designed to support mindful reflection and mental wellness. With features like mood tracking, writing prompts, private entries, and personalized analytics, Luma encourages users to grow through self-awareness — without the noise of social media.

---

### ✨ Features

* 📓 **Daily Prompts** – A new reflective question every day to guide your thoughts.
* 🎭 **Mood Tagging** – Tag your entries with expressive moods and emojis.
* 🏷️ **Custom Tags** – Add personal or predefined topic tags like `#burnout` or `#school`.
* 📅 **Mood & Writing Analytics** – Track your writing streaks, mood trends, and tag usage.
* 🔒 **Private by Default** – No followers, no likes — just your thoughts.
* 🗂️ **Search & Filter** – Filter journal entries by mood, tag, or date.
* ⚙️ **Edit & Delete** – Manage your entries with full control.
* 🖥️ **Responsive UI** – Clean, accessible, and mobile-friendly interface.

---

### 🧱 Built With

* ⚛️ **React (TypeScript)** – Frontend SPA with component-driven UI.
* ⚡ **FastAPI** – Backend with JWT auth and async endpoints.
* 🛢️ **Supabase (PostgreSQL)** – Realtime DB + auth + storage.
* 📊 **Recharts & Chart.js** – For visualizing analytics and streaks.

---

### 🛠️ Setup Instructions

#### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/luma.git
cd luma
```

#### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Add your Supabase DB URL and JWT_SECRET
poetry install
uvicorn main:app --reload
```

#### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Add your Vite environment variables (API URL, etc.)
npm install
npm run dev
```

#### 4. Supabase Setup

* Create a Supabase project
* Set up authentication and schema (posts, users, moods, tags)
* Optional: seed prompt data

---

### 📌 Roadmap

* [x] Daily prompts & journaling interface
* [x] Mood tagging with emojis
* [x] Writing streaks + mood chart
* [x] Filter entries by tag, mood, date
* [ ] Mobile dark mode support
* [ ] Customizable themes
* [ ] Self-hosted deployment script

---

### 🔒 Environment Variables

```env
# Backend (.env)
DATABASE_URL=your_supabase_postgres_url
JWT_SECRET=your_jwt_secret

# Frontend (.env)
VITE_API_URL=http://localhost:8000
```

---

### 👤 Author

Made with ❤️ by [Sherika Fayson](https://github.com/sherikafayson)



