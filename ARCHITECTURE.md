# Architecture — Roman Aviation / AURA Travels

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                       │
│                    Next.js 16 (App Router)                   │
│                  http://localhost:3000  (:3000)               │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP / Axios + JWT Bearer
                             │ NEXT_PUBLIC_API_URL=http://localhost:8000/api
                             │
┌────────────────────────────▼────────────────────────────────┐
│                        DJANGO REST API                        │
│                 Django 5 + DRF + SimpleJWT                   │
│                  http://localhost:8000  (:8000)               │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │  auth    │ │ bookings │ │ payments │ │  invoices    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │helicoptrs│ │  tours   │ │  hotels  │ │    boats     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ tickets  │ │ careers  │ │ reports  │                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
└──────────┬──────────────────────────┬──────────────────────┘
           │                          │
┌──────────▼──────────┐   ┌──────────▼──────────┐
│  PostgreSQL 16      │   │   Redis 7 (Docker)   │
│  (Docker :5432)     │   │   Celery broker      │
│  roman_db container │   │   roman_redis        │
└─────────────────────┘   └─────────────────────┘
           │
┌──────────▼──────────┐
│      AWS S3         │
│  (file/CV uploads)  │
└─────────────────────┘
```

---

## Frontend Architecture

### Next.js App Router Structure

```
src/app/
├── layout.tsx          Root layout (Navbar + Footer + Providers)
├── page.tsx            Landing page (home, 3D hero, sections)
├── auth/               Authentication flow
├── dashboard/          Customer: bookings, tickets, profile
├── admin/              Staff: manage fleet, bookings, users
├── booking/            Step-by-step booking wizard
├── checkout/           Payment + order confirmation
├── tours/              Tour packages listing + detail
├── hotels/             Hotel listing + detail
├── boats/              Boat ride listing + detail
├── charter/            Private helicopter charter
├── services/           Services overview page
├── careers/            Job application form
├── contact/            Contact form
├── blog/               Blog posts (static)
├── about/              About page
├── profile/            User profile editor
├── payment/            Razorpay/payment redirect handler
├── success/            Booking success confirmation
├── privacy/            Privacy policy
├── terms/              Terms of service
└── refunds/            Refund policy
```

### State Management (Zustand)

```
useAuthStore (persisted to localStorage: "aura-auth-storage")
├── user          — User profile object (name, email, phone, etc.)
├── token         — JWT access token
├── refresh       — JWT refresh token
├── isLoggedIn    — Boolean auth flag
├── bookings[]    — User's bookings (synced from API)
├── tickets[]     — Support tickets (synced from API)
└── notifications[] — In-app notifications

useCartStore
└── cart[]        — Items pending checkout
```

### API Client (Axios)

- Base URL: `NEXT_PUBLIC_API_URL` env var (default `http://localhost:8000/api`)
- Auto-injects `Authorization: Bearer <token>` from localStorage on every request
- 10-second request timeout

---

## Backend Architecture

### Django App Responsibilities

| App | Responsibility |
|---|---|
| `authentication` | User model, OTP, JWT login/register, profile update |
| `helicopters` | Fleet listings (CRUD) |
| `packages` | Tour package listings (CRUD) |
| `hotels` | Hotel listings (CRUD) |
| `boats` | Boat ride listings (CRUD) |
| `bookings` | All bookings across types, cancel action |
| `payments` | Payment gateway create & verify |
| `invoices` | PDF invoice generation via ReportLab |
| `notifications` | Support tickets with reply threads |
| `careers` | Career application submissions |
| `reports` | Admin CSV export, S3 file upload |

### URL Structure

```
/                    → Redirect to /api/docs
/django/             → Django Admin panel
/api/docs            → Swagger UI
/api/schema          → OpenAPI schema (JSON)

/api/v1/auth/*       → Versioned auth endpoints
/api/v1/helicopters  → Fleet CRUD
/api/v1/packages     → Tour packages CRUD
/api/v1/bookings     → Bookings CRUD
/api/v1/hotels       → Hotels CRUD
/api/v1/boats        → Boats CRUD
/api/v1/payments/*   → Payment create/verify
/api/v1/invoices/<id>→ PDF invoice download
/api/v1/reports/*    → CSV export, upload

/api/*               → Backward-compat aliases (same views)
```

### Authentication Flow

```
1. Register:   POST /api/auth/register (email + name + password)
               OR
               POST /api/auth/send-register-otp → verify OTP → register

2. Login:      POST /api/auth/password-login (email + password)
               OR
               POST /api/auth/send-otp → POST /api/auth/verify-otp
               → returns { access, refresh, user }

3. Requests:   Authorization: Bearer <access_token>

4. Reset:      POST /api/auth/send-reset-otp → verify OTP → POST /api/auth/reset-password
```

---

## Database Strategy

| Environment | Database | Config |
|---|---|---|
| Docker (team dev) | PostgreSQL 16 | `DATABASE_URL` set in `.env.docker` → `db` container |
| Local (no Docker) | SQLite3 | No `DATABASE_URL` env — auto creates `db.sqlite3` |
| Production (Vercel) | PostgreSQL | Set `DATABASE_URL` in Vercel env vars |

All list/array fields use `JSONField` (works on both SQLite3 + PostgreSQL).

> **Why JSONField?** Originally used `django.contrib.postgres.fields.ArrayField` but it is PostgreSQL-only and breaks SQLite3. All 4 affected apps (boats, helicopters, hotels, packages) were migrated to `models.JSONField` in migration `0002`.

---

## Docker Architecture

### Container Map

```
docker compose up
        │
        ├── roman_db        postgres:16-alpine     :5432
        │     └─ Healthcheck: pg_isready -U aura -d aura_dev
        │
        ├── roman_redis     redis:7-alpine         :6379
        │     └─ Healthcheck: redis-cli ping
        │
        ├── roman_backend   python:3.12-slim       :8000
        │     ├─ Waits for: roman_db (healthy), roman_redis (healthy)
        │     ├─ On start:  python manage.py migrate --noinput
        │     └─ Then:      python manage.py runserver 0.0.0.0:8000
        │
        └── roman_frontend  node:20-alpine         :3000
              └─ Waits for: roman_backend (started)
```

### Docker Files

| File | Purpose |
|---|---|
| `docker-compose.yml` | Orchestrates all 4 services |
| `backend/Dockerfile` | Builds Django image (python:3.12-slim + psycopg2) |
| `frontend/Dockerfile` | Builds Next.js image (node:20-alpine + hot reload polling) |
| `backend/.dockerignore` | Excludes venv, cache, secrets from image |
| `frontend/.dockerignore` | Excludes node_modules, .next, secrets from image |
| `.env.docker` | ✅ Committed — shared safe dev defaults for the team |
| `frontend/.env.local` | ❌ Gitignored — individual local dev (non-Docker) |

### Volume Strategy

| Volume | Type | Purpose |
|---|---|---|
| `./backend:/app` | Bind mount | Hot reload — code changes instant |
| `./frontend/src:/app/src` | Bind mount | Hot reload — source files |
| `./frontend/public:/app/public` | Bind mount | Hot reload — public assets |
| `/app/node_modules` | Anonymous | Protects container's installed packages |
| `/app/.next` | Anonymous | Protects container's build cache |
| `roman_postgres_data` | Named volume | Persistent database data |
| `roman_redis_data` | Named volume | Persistent Redis data |

### Key Environment Variables in Docker

```
Backend container:
  DATABASE_URL=postgresql://aura:aura_dev_pass@db:5432/aura_dev  ← db = container name
  REDIS_URL=redis://redis:6379/0                                  ← redis = container name
  CELERY_BROKER_URL=redis://redis:6379/0
  DJANGO_SETTINGS_MODULE=config.settings                         ← set in Dockerfile
  PYTHONPATH=/app:/app/apps                                      ← set in Dockerfile

Frontend container:
  NEXT_PUBLIC_API_URL=http://localhost:8000/api   ← localhost = user's machine (browser-side)
  WATCHPACK_POLLING=true                          ← enables hot reload on Windows/Mac Docker
```

> **Important**: `NEXT_PUBLIC_*` vars are baked into the browser JS bundle at build/start time.
> They must use `localhost` (the user's machine), NOT the container name `backend`.

### Common Docker Commands

```bash
# Start everything
docker compose up
docker compose up --build          # Force rebuild (after requirements.txt / package.json change)

# Stop
docker compose down                # Stop containers
docker compose down -v             # Stop + delete all volumes (fresh database)

# Logs
docker compose logs -f             # All services
docker compose logs -f backend     # Django only
docker compose logs -f frontend    # Next.js only

# Django management
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py shell

# Database access
docker compose exec db psql -U aura -d aura_dev
```

---

## Deployment (Vercel)

```
vercel.json defines two services:
├── frontend  → root: frontend/  (Next.js framework)
└── backend   → root: backend/   (Django WSGI)

Rewrites:
├── /api/backend/* → backend service
└── /*             → frontend service
```
