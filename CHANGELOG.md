# Changelog

All notable changes to the Roman Aviation / AURA Travels platform are documented here.

Format: [Semantic Versioning](https://semver.org/)
Dates: `YYYY-MM-DD`

---

## [Unreleased]

### Added
- Full Docker Compose setup for 4-person team development
  - `docker-compose.yml` — PostgreSQL 16, Redis 7, Django, Next.js
  - `backend/Dockerfile` — python:3.12-slim with psycopg2 dependencies
  - `frontend/Dockerfile` — node:20-alpine with hot reload polling for Windows/Mac
  - `.env.docker` — shared safe team dev environment (committed to git)
  - `.dockerignore` files for backend and frontend
- Hot reload via Docker volume mounts (no rebuild needed during dev)
- Auto-migration on backend container start (`manage.py migrate --noinput`)
- PostgreSQL 16 with health checks (backend waits for DB to be ready)
- Redis 7 with health checks (backend waits for Redis)
- `.gitignore` updated: `.env.docker` allowed, all other env files blocked

### Planned
- Payment gateway full integration (Razorpay/Stripe)
- Email invoice delivery post-booking
- Admin analytics dashboard charts
- Push notifications

---

## [1.2.0] — 2026-07-30

### Fixed
- Replaced PostgreSQL-only `ArrayField` with SQLite3-compatible `models.JSONField` across 4 apps (`boats`, `helicopters`, `hotels`, `packages`)
- Updated all affected migration files (`0002_*.py`) to use `models.JSONField`
- All 33 Django migrations now apply cleanly on SQLite3

### Added
- SQLite3 as default development database (auto-fallback when `DATABASE_URL` is not set)
- Both frontend (Next.js) and backend (Django) servers running in parallel

---

## [1.1.0] — 2026-07-04

### Added
- OTP-based authentication with PBKDF2 hashing
- Rate limiting on OTP resend (60s cooldown)
- OTP attempt locking (5 max attempts)
- Password reset flow via OTP
- Direct login / register without OTP
- User profile update endpoint
- Support ticket system (open/resolved)
- Career applications with CV + photo upload
- CSV export for admin reports
- S3 file upload endpoint
- PDF invoice generation via ReportLab
- drf-spectacular Swagger/OpenAPI docs at `/api/docs`

### Changed
- `ArrayField` → `JSONField` in boats, helicopters, hotels, packages (migration 0002)

---

## [1.0.0] — 2026-07-01

### Added
- Initial project scaffold (Django + Next.js monorepo)
- Custom `User` model with 7 roles: `superadmin`, `admin`, `operator`, `support`, `finance`, `contentmanager`, `customer`
- JWT authentication (SimpleJWT) with 1-day access + 7-day refresh tokens
- CORS configured for localhost:3000
- REST API for: Helicopters, Tour Packages, Hotels, Boats, Bookings
- Next.js App Router with Turbopack
- Zustand global state (auth, bookings, tickets, cart)
- Axios client with auto JWT header injection
- Three.js / Framer Motion / GSAP animations on homepage
- Tailwind CSS v4 styling
- Vercel deployment config (`vercel.json`)
