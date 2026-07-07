# Finnger Dashboard — Next.js App

A pixel-perfect Next.js frontend with Login/Signup page, Dashboard, and Permission Settings — built with Tailwind CSS.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
nextjs-app/
├── pages/
│   ├── _app.js          # App wrapper (global CSS)
│   ├── index.js         # Login / Sign Up page
│   └── dashboard.js     # Dashboard page
├── components/
│   ├── Sidebar.js        # Collapsible icon sidebar
│   ├── PermissionModal.js # Permission settings modal
│   └── PerformanceChart.js # SVG performance chart
├── styles/
│   └── globals.css      # Global styles + Tailwind + Google Fonts
├── tailwind.config.js
└── postcss.config.js
```

---

## ✨ Features

### Login Page (`/`)
- Split-screen layout: form left, animated illustration right
- Toggle between **Sign In** and **Sign Up**
- Email + password fields with show/hide toggle
- Remember me checkbox + Forgot Password
- Validation & loading state
- On success: saves user to `localStorage` → navigates to `/dashboard`

### Dashboard (`/dashboard`)
- **Header**: Logo, nav tabs (Dashboard / Speaking / Progress / Courses), search, bell, user avatar
- **Sidebar**: Collapsible icon sidebar with 6 sections, expand/collapse toggle
- **Course Selection**: Searchable course cards with progress bars
- **Performance Chart**: Interactive SVG chart (Theory / Practice / Lexicon) with hover tooltips
- **Homework**: Task list with animated progress bars
- **Friends Score**: Leaderboard with avatars and stats
- **User Menu**: Dropdown with profile, Manage Permissions, Sign Out

### Permission Settings Modal
- Accessible from User Avatar → **Manage Permissions**
- **Quick Role Presets**: Admin / Editor / Viewer / Custom
- Toggle-based permissions for 5 modules:
  - 👥 User Management
  - 📝 Content
  - 📊 Analytics
  - ⚙️ Settings
  - 💳 Billing
- 3 permission types per module: **View / Edit / Delete**
- Visual progress bar showing active permission count
- Save → updates `localStorage` + shows success toast

---

## 🔌 Connecting Your Backend

Replace the mock auth in `pages/index.js` (`handleSubmit`) with your real API call:

```js
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await res.json();
if (data.token) {
  localStorage.setItem('user', JSON.stringify(data.user));
  router.push('/dashboard');
}
```

---

## 🛠 Tech Stack

- **Next.js 14** (Pages Router)
- **Tailwind CSS 3**
- **React 18** (useState, useEffect, useRouter)
- **Google Fonts**: Sora (display) + DM Sans (body)
- Pure **SVG** for performance chart (no chart library dependency)
