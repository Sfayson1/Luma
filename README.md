## 🌙 Luma

**Luma** is a calming journaling app designed to support mindful reflection and mental wellness. With features like mood tracking, writing prompts, private entries, and personalized analytics, Luma encourages users to grow through self-awareness — without the noise of social media.

---

🌐 [Live Demo](www.lumajournal.com)


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

## 🆘 **Mental Health & Safety**
* 🆘 **Crisis Support Resources** – Quick access to suicide prevention hotlines and mental health services.
* 🔍 **Therapy Search Tools** – Find affordable therapy options and mental health professionals.
* 📱 **Digital Wellness Tools** – Curated list of mental health apps and support platforms.
* 🛡️ **Crisis Intervention** – Gentle support when concerning patterns are detected.
---
### ⚠️ Important Notice
Luma is designed to support mental wellness through journaling and self-reflection. While we provide crisis resources and support information, Luma is not a substitute for professional mental health treatment. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

**Crisis Support:** Call 988 (Suicide & Crisis Lifeline) for immediate help.
---

## ⚙️ **User Settings & Privacy**
* 🔐 **Privacy Controls** – Manage default entry privacy and profile visibility.
* 🔑 **Password Management** – Secure password reset and account security.
* 🎨 **Display Customization** – Theme selection, typography, and accessibility options.
* 📝 **Journal Preferences** – Writing goals, reminders, and prompt frequency.
* 📊 **Data Export** – Download all your journal data in JSON format.

---

### 🧱 Built With
* ⚛️ **React (TypeScript)** – Frontend SPA with component-driven UI.
* ⚡ **FastAPI** – Backend with JWT auth and async endpoints.
* 🛢️ **Supabase (PostgreSQL)** – Realtime DB + auth + storage.
* 📊 **Recharts & Chart.js** – For visualizing analytics and streaks.
* 🎨 **Tailwind CSS** – Utility-first styling for responsive design.
* 🚀 **React Router** – Client-side routing and navigation..

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
* [x] Mental health crisis support resources
* [x] Password reset & account management
* [x] Comprehensive settings (privacy, display, journal preferences)
* [x] Data export functionality
* [ ] Crisis detection & intervention system
* [x] Mobile dark mode support
* [x] Customizable themes
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

📄 License
This project is licensed under the MIT License.


### 👤 Author

Made with ❤️ by [Sherika Fayson](https://github.com/sherikafayson)



