# Enterprise OS

A comprehensive enterprise management platform covering HR, CRM, ERP, Finance, Projects, and more.

## Stack

- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4, Shadcn UI, TanStack Query, Zustand, React Router v7
- **Backend**: Python 3.11, FastAPI, SQLAlchemy ORM, SQLite (auto-seeded on first run)
- **Auth**: JWT (PyJWT), PBKDF2 password hashing, role-based access control
- **Tooling**: pnpm workspaces, monorepo layout

## Running the project

Two workflows run in parallel:

| Workflow | Command | Port |
|---|---|---|
| Backend API | `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000` | 8000 |
| Start application | `pnpm --filter @workspace/enterprise-os run dev` | 5000 |

The backend auto-creates and seeds the SQLite database (`backend/enterprise_os.db`) on first startup. Seeding runs in a background thread so the server is immediately available on port 8000.

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@enterpriseos.com | admin123 |
| Employee | employee@enterpriseos.com | employee123 |

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY is set as an environment variable (see .env.example).
| `OPENROUTER_API_KEY` | No | Insights engine (optional, falls back gracefully) |
| `GEMINI_API_KEY` | No | Insights engine fallback (optional) |

## Project structure

```
backend/app/          FastAPI app, routes, models, migrations
frontend/src/         React pages and components
lib/api-client-react/ Generated OpenAPI client hooks (Orval)
lib/api-spec/         OpenAPI YAML spec
```

## User preferences

- Keep SQLite as the database — no PostgreSQL or external DB.
