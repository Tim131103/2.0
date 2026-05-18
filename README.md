# Sanxia Old Street Explorer — 三峽老街探索

A Progressive Web App (PWA) for exploring Sanxia Old Street in Taiwan. Users can discover local shops, check in to earn points, redeem rewards, plan walking routes, and browse upcoming events.

---

## Tech Stack

### Frontend (`sanxia-explorer/`)

| Technology | Purpose |
|---|---|
| **React 18** | UI framework (component-based, hooks) |
| **Vite 5** | Dev server and build tool |
| **Tailwind CSS 3** | Utility-first CSS styling |
| **PostCSS + Autoprefixer** | CSS processing and browser compatibility |
| **PWA (Web App Manifest + Service Worker)** | Installable app, offline support |

### Backend (`api/`)

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express 5** | HTTP server and REST API |
| **PostgreSQL** | Relational database |
| **pg** | PostgreSQL client for Node.js |
| **bcryptjs** | Password hashing |
| **jsonwebtoken (JWT)** | Authentication tokens |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |

---

## Project Structure

```
2.0/
├── api/                        # Backend REST API
│   ├── index.js                # App entry point, server setup
│   ├── db.js                   # PostgreSQL connection pool
│   ├── schema.sql              # Database schema (auto-migrated on startup)
│   ├── migrate.js              # Migration helper
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   └── routes/
│       ├── auth.js             # Register / login endpoints
│       ├── checkins.js         # Shop check-in logic
│       ├── rewards.js          # Points redemption
│       └── user.js             # User profile
│
└── sanxia-explorer/            # Frontend PWA
    ├── index.html
    ├── vite.config.js          # Vite config (proxies /api → localhost:3001)
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   ├── manifest.json       # PWA manifest
    │   ├── sw.js               # Service worker
    │   └── icons/              # App icons (48px – 512px)
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Root component, routing logic
        ├── api.js              # API client (fetch wrapper)
        ├── index.css           # Global styles
        ├── components/         # Page and UI components
        │   ├── AuthPage.jsx
        │   ├── HomePage.jsx
        │   ├── ShopsPage.jsx
        │   ├── RewardsPage.jsx
        │   ├── RoutePlanner.jsx
        │   ├── EventsPage.jsx
        │   ├── Navbar.jsx
        │   ├── BottomNav.jsx
        │   ├── SplashScreen.jsx
        │   ├── InstallBanner.jsx
        │   ├── Footer.jsx
        │   └── MigratePrompt.jsx
        ├── data/               # Static data
        │   ├── shops.js
        │   ├── events.js
        │   └── tiers.js
        └── hooks/
            ├── useAuth.js
            └── usePullToRefresh.js
```

---

## Database Schema

Three tables managed in PostgreSQL:

- **`users`** — email, hashed password, points balance
- **`checkins`** — records of users checking in to shops (one per user/shop)
- **`redemptions`** — records of reward redemptions with tier and points spent

The schema is applied automatically on API startup via `schema.sql`.

---

## Features

- **Authentication** — Register and log in with email/password (JWT-based)
- **Shop Discovery** — Browse shops on Sanxia Old Street with details and categories
- **Check-ins** — Check in to shops to earn points
- **Rewards** — Redeem accumulated points for tiered rewards
- **Route Planner** — Plan a walking route through the old street
- **Events** — View upcoming local events
- **PWA** — Installable on Android, iOS, and Windows; works offline

---

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (used for the frontend) or npm
- PostgreSQL database

### Backend

```bash
cd api
# Create a .env file with:
# DATABASE_URL=postgres://user:password@localhost:5432/sanxia
# JWT_SECRET=your_secret_here
# PORT=3001
# CORS_ORIGIN=https://your-frontend-domain.com (production only)

npm install
npm run dev
```

The API will start on `http://localhost:3001`. The database schema is applied automatically on first run.

### Frontend

```bash
cd sanxia-explorer
bun install   # or npm install
bun run dev   # or npm run dev
```

The app will start on `http://localhost:5173`. API requests to `/api/*` are proxied to the backend automatically in development.

### Production Build

```bash
cd sanxia-explorer
bun run build   # or npm run build
```

Output is in `sanxia-explorer/dist/`.

---

## Environment Variables (API)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Port the API listens on (default: `3001`) |
| `CORS_ORIGIN` | Allowed origin in production |
| `NODE_ENV` | Set to `production` in production |
