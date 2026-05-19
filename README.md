# 📋 Job Tracker

> A full-stack job application management system built with **Next.js 15**, **TypeScript**, **Redux Toolkit**, **Tailwind CSS**, and **shadcn/ui** — with a drag-and-drop Kanban board, interview scheduler, and live dashboard.

🔗 **Live Demo:** [https://job-tracker-theta-gold.vercel.app/]

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth simulation | Cookie-based session (demo mode — any email works) |
| 📝 Application CRUD | Create, read, update, delete job applications |
| 📋 Kanban board | Drag-and-drop cards between status columns |
| 📄 List view | Compact card list with inline status change |
| 🎯 Target matching | Highlight applications matching your target role & salary |
| 📅 Interview scheduler | Add, edit, delete interviews — view upcoming & past |
| 📊 Dashboard | Stats: total apps, active apps, response rate, offer rate, weekly goal |
| 🔍 Filter & search | Filter by status, work type, keywords, and tags |
| 📱 Responsive | Desktop sidebar + mobile bottom navigation |

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + Turbopack |
| Language | TypeScript (strict) |
| Global state | Redux Toolkit (applications, interviews) |
| Local state | Context API (user settings — target role, salary, weekly goal) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Data fetching | Server Components + API routes (in-memory store) |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Charts | react-circular-progressbar |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📁 Project Structure

```
job-tracker/
├── app/
│   ├── api/                    # REST API routes (applications, interviews)
│   ├── applications/           # Server component + client wrapper (Kanban / List)
│   ├── add/                    # Add new application form
│   ├── edit/[id]/              # Edit application page
│   ├── interviews/             # Interview management (upcoming / past)
│   ├── layout.tsx              # Root layout (Redux Provider, Context, Sidebar)
│   └── page.tsx                # Dashboard (stats + login simulation)
├── components/
│   ├── ApplicationCard.tsx     # Card UI (compact + full variants)
│   ├── KanbanColumn.tsx        # Droppable column with sortable cards
│   └── ...                     # Other shared UI components
├── context/
│   └── JobSearchContext.tsx    # Target role, salary, weekly goal state
├── hooks/
│   ├── useFilteredApplications.ts
│   ├── useApplicationForm.ts
│   └── ...
├── lib/
│   └── store.ts                # In-memory data store + dummy seed data
├── store/
│   ├── applicationSlice.ts     # Redux slice — CRUD + status updates
│   └── interviewSlice.ts       # Redux slice — interview management
├── types/
│   └── job.ts                  # TypeScript interfaces
└── middleware.ts               # Cookie-based auth guard
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, or **pnpm**
- **Git**

### 1 — Clone the repository

```bash
git clone https://github.com/your-username/job-tracker.git
cd job-tracker
```

### 2 — Install dependencies

```bash
npm install
```

> Drag-and-drop requires `@dnd-kit` packages:
>
> ```bash
> npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
> ```

### 3 — Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** `NEXT_PUBLIC_APP_URL` is used for server-side API calls. On Vercel it is auto-detected; you only need this locally.

### 4 — Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5 — Build for production

```bash
npm run build
npm start
```

---

## 🧭 How to Use

1. **Login** — enter any email address to set the demo session cookie and access the app.
2. **Dashboard** — view your application stats, set a weekly goal, and configure your target role and salary.
3. **Applications (List view)** — browse all applications in a compact card list. Filter by status, work type, or keyword. Edit status inline from each card.
4. **Applications (Kanban view)** — drag and drop cards between status columns (`Saved → Applied → Interview → Offer`, etc.). Columns highlight on hover.
5. **Add Application** — fill in company, role, location, work type, salary, tags, and notes.
6. **Interviews** — schedule new interviews, mark outcomes (passed / rejected), and review upcoming and past sessions.
7. **Edit / Delete** — use the ✏️ and 🗑️ icons on any card.

---

## ⚠️ Important Notes

### Data persistence
All data lives in a **server-side in-memory array**. It resets when the Next.js server restarts. This is intentional for demo/exam purposes — a production app would use a database (e.g. PostgreSQL, MongoDB).

### Authentication
The middleware checks for a `job_tracker_session` cookie. If missing, the user is redirected to `/login`. Login simply sets the cookie — there is no real auth backend or password validation.

### Middleware naming (Next.js 16+)
Next.js 16 deprecates the `middleware.ts` filename in favour of `proxy.ts`. The app still works as-is. To silence the warning, rename `middleware.ts` → `proxy.ts` and update the exported function name accordingly.

---

## ☁️ Deploying to Vercel

The project is live at [https://job-tracker-amber-three.vercel.app](https://job-tracker-amber-three.vercel.app).

To deploy your own copy:

1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Optionally set `NEXT_PUBLIC_APP_URL` in the Vercel environment variables dashboard.
4. Click **Deploy** — the build includes a `Suspense` boundary fix for `useSearchParams()` so it will succeed out of the box.

---

## 📄 License

Created as a technical exam project. Feel free to use it as a reference for your own Next.js + Redux applications.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [dnd kit](https://dndkit.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)