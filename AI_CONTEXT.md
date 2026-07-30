# AI Context — Roman Aviation / AURA Travels

> This file is for AI coding assistants (Copilot, Cursor, Gemini, Claude, etc.).
> Read this FIRST before making any code changes.

---

## Project Summary

**Roman Aviation** is a luxury helicopter tourism platform branded as **AURA Travels**.
It is a full-stack monorepo with:
- **Backend**: Django 5 REST API (`/backend`)
- **Frontend**: Next.js 16 App Router (`/frontend`)
- **Docker**: 4-service Compose setup (PostgreSQL 16, Redis 7, Django, Next.js)
- **Team**: 4 developers — use `docker compose up --build` to start

---

## Critical Rules

1. **Database**: **Never use `django.contrib.postgres.fields.ArrayField`** — use `models.JSONField` instead. All list fields are already `JSONField`. Docker uses PostgreSQL 16; local non-Docker falls back to SQLite3.

2. **Auth**: Custom `User` model at `authentication.User`. Always set `AUTH_USER_MODEL = 'authentication.User'`. Never use Django's built-in `User` directly.

3. **API URLs**: Two URL sets exist — `/api/v1/*` (versioned) and `/api/*` (compat). Both call the same views. Add new endpoints to **both** in `config/urls.py`.

4. **Frontend API client**: All HTTP calls go through `src/utils/api.ts` (Axios). JWT is auto-injected from localStorage. **Do not use `fetch` directly**.

5. **State**: All global state is in Zustand stores (`src/store/`). Auth + bookings + tickets = `useAuthStore`. Cart = `useCartStore`.

6. **Next.js version**: This is **Next.js 16** with App Router and Turbopack. All pages are in `src/app/`. Use `"use client"` directive when using hooks or browser APIs.

7. **Tailwind**: Version **4** (not v3). Config differs — use `@import "tailwindcss"` not `@tailwind base/components/utilities`.

8. **Docker**: The team runs everything via Docker Compose. Do NOT edit `docker-compose.yml` container names (`roman_db`, `roman_redis`, `roman_backend`, `roman_frontend`) — other files depend on them. Redis/DB hostnames inside Docker are `db` and `redis` (service names), not `localhost`.

---

## File Map — Key Files

```
backend/
├── config/settings.py          # All Django settings — DB, auth, JWT, CORS, email
├── config/urls.py              # ALL routes — add new endpoints here
├── apps/authentication/
│   ├── models.py               # User + OTPVerification models
│   ├── views.py                # All auth views (very large ~36KB)
│   └── serializers.py          # User serializers
├── apps/bookings/models.py     # Booking model (all types unified)
├── apps/helicopters/models.py  # Helicopter model (features, schedules = JSONField)
├── apps/hotels/models.py       # Hotel model (amenities = JSONField)
├── apps/boats/models.py        # Boat model (schedules = JSONField)
├── apps/packages/models.py     # Tour model (inclusions, exclusions = JSONField)
├── apps/notifications/models.py# Ticket model (messages = JSONField)
├── apps/careers/models.py      # CareerApplication model
├── apps/payments/views.py      # Payment create/verify
├── apps/invoices/views.py      # PDF generation (ReportLab)
└── apps/reports/views.py       # CSV export + S3 upload

frontend/src/
├── app/page.tsx                # Home page — very large (50KB), main landing
├── app/layout.tsx              # Root layout — wraps all pages
├── utils/api.ts                # Axios client (10s timeout, JWT interceptor)
├── utils/mockData.ts           # Dev mock data for offline testing
├── store/useAuthStore.ts       # Auth + bookings + tickets + notifications
├── store/useCartStore.ts       # Shopping cart
└── lib/liteapi.ts              # LiteAPI hotel search integration
```

---

## Data Models (Quick Reference)

### User Roles
`superadmin` > `admin` > `operator` | `support` | `finance` | `contentmanager` > `customer`

### Booking Types
`helicopter` | `package` | `hotel` | `boat`

### Booking Statuses
`Confirmed` | `Pending` | `Cancelled` | `In Flight`

### Ticket Statuses
`Open` | `Resolved`

---

## Common Patterns

### Adding a new API endpoint
1. Create/modify the view in `apps/<appname>/views.py`
2. Register in `config/urls.py` under **both** `router_v1` and `router_compat` (or direct `path`)
3. Add to `API_DOCUMENTATION.md`

### Adding a new Django model field
1. Edit the model in `apps/<appname>/models.py`
2. **With Docker**: `docker compose exec backend python manage.py makemigrations && docker compose exec backend python manage.py migrate`
3. **Without Docker**: `python manage.py makemigrations && python manage.py migrate`
4. Update `DATABASE_SCHEMA.md`
5. **If it's a list field, use `models.JSONField(default=list)` not `ArrayField`**

### Adding a new frontend page
1. Create directory in `frontend/src/app/<route>/`
2. Add `page.tsx` (and `"use client"` if needed)
3. Use `API` from `utils/api.ts` for data fetching
4. Hot reload works automatically (Docker volume mount handles it)

### Adding Zustand state
- Add to `useAuthStore.ts` for auth-related data
- Add to `useCartStore.ts` for cart data
- Create new store file for entirely new domains

### After changing requirements.txt or package.json
```bash
docker compose up --build   # Must rebuild Docker image
```

### Reset the database (Docker)
```bash
docker compose down -v      # Deletes postgres_data volume
docker compose up --build   # Fresh database, migrations re-run automatically
```

---

## Environment

### Running with Docker (team default)
```bash
docker compose up --build   # first time
docker compose up           # daily
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/api/docs
- **Django Admin**: http://localhost:8000/django/
- **PostgreSQL**: `localhost:5432` (db=`aura_dev`, user=`aura`, pass=`aura_dev_pass`)
- **Redis**: `localhost:6379`
- **Env config**: `.env.docker` (root, committed to git)

### Running Locally (without Docker)
```bash
# Terminal 1
cd backend && python manage.py runserver 8000
# Terminal 2
cd frontend && npm run dev
```
- Uses **SQLite3** automatically (no `DATABASE_URL` env needed)
- Frontend env: `frontend/.env.local` (gitignored, copy from `.env.example`)

---

## Known Gotchas

| Issue | Detail |
|---|---|
| `ArrayField` breaks SQLite3 | Use `models.JSONField(default=list)` always |
| `AUTH_USER_MODEL` | Must be `authentication.User` not `auth.User` |
| CSRF disabled for API | `DisableCSRFForAPIMiddleware` is active — JWT replaces CSRF |
| Zustand localStorage key | `"aura-auth-storage"` — token at `state.token` |
| Axios base URL | Hardcoded fallback is `:5000` — override with env var |
| Next.js 16 App Router | No `pages/` directory — all routes in `app/` |
| Tailwind v4 | Config syntax different from v3 |
