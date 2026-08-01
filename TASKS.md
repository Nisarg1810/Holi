# TASKS — Roman Aviation / AURA Travels

> Active development tasks, backlog, and known issues.
> Update this file when picking up or completing work.
> Format: `[ ]` = todo, `[/]` = in progress, `[x]` = done

---

## 🔥 Active / In Progress

- [ ] Test full booking flow end-to-end (frontend → Django API → PostgreSQL via Docker)
- [ ] Integrate payment gateway (Razorpay) — backend routes exist, need frontend wiring
- [ ] Create Django superuser for admin panel: `docker compose exec backend python manage.py createsuperuser`

---

## ✅ Completed

- [x] Scaffold Django + Next.js monorepo
- [x] Custom `User` model with 7 roles (superadmin, admin, operator, support, finance, contentmanager, customer)
- [x] JWT auth (SimpleJWT) — access (1 day) + refresh (7 day) tokens
- [x] OTP system — PBKDF2-hashed, 5-min expiry, 5-attempt lockout, 60s resend rate-limit
- [x] All auth routes: register, login, OTP send/verify/resend, password reset, direct login
- [x] REST API for: helicopters, tours, hotels, boats, bookings, payments, invoices, tickets, careers, reports
- [x] Swagger/OpenAPI docs at `/api/docs`
- [x] Next.js App Router with 21+ pages
- [x] Zustand state management (auth, bookings, tickets, cart) — persisted
- [x] Axios client with auto JWT injection from localStorage
- [x] Three.js / Framer Motion / GSAP animations
- [x] Tailwind CSS v4 styling
- [x] Vercel deployment config
- [x] Replace Postgres `ArrayField` → `JSONField` in 4 apps (boats, helicopters, hotels, packages)
- [x] All 33 Django migrations pass on both SQLite3 and PostgreSQL
- [x] Both servers running (Django :8000, Next.js :3000)
- [x] Documentation files created (README, ARCHITECTURE, API_DOCUMENTATION, DATABASE_SCHEMA, CHANGELOG, TASKS, AI_CONTEXT, .env.example)
- [x] **Docker Compose setup for 4-person team** — PostgreSQL 16 + Redis 7 + Django + Next.js
- [x] `backend/Dockerfile` — python:3.12-slim, psycopg2, PYTHONPATH, DJANGO_SETTINGS_MODULE
- [x] `frontend/Dockerfile` — node:20-alpine, WATCHPACK_POLLING for hot reload on Windows/Mac
- [x] `.env.docker` — committed safe team dev defaults
- [x] `.dockerignore` for backend and frontend
- [x] `.gitignore` updated — `.env.docker` allowed, secrets blocked
- [x] Fixed `api.ts` fallback URL (`:5000` → `:8000`)
- [x] Fixed Celery URLs to read from `REDIS_URL` env var (Docker-compatible)
- [x] Fixed `package.json` dev script — added `--hostname 0.0.0.0` for Docker binding
- [x] All docs updated with Docker details (ARCHITECTURE, AI_CONTEXT, TASKS, DATABASE_SCHEMA, CHANGELOG)
- [x] MakeMyTrip luxury UI redesign for Home Page, User Dashboard, Navbar, and Search Box
- [x] End-to-end user authentication modal, separate Auth page, and guest navigation state
- [x] Database integrations for User Dashboard, Profile, KYC Document Upload, Security Protocols, and Wishlist
- [x] Dedicated searchable FAQs page migration and My Trips feature
- [x] Database model & migration fixes for Boat capacity field and PostgreSQL compatibility


---

## 📋 Backlog

### Backend
- [ ] Add Django admin customization for each model
- [ ] Add pagination to all list endpoints
- [ ] Add search/filter to helicopters, tours, hotels
- [ ] Implement Celery tasks for: email delivery, invoice generation async
- [ ] Add token refresh endpoint handling in frontend
- [ ] Rate limiting on all auth endpoints (django-ratelimit)
- [ ] Add unit tests (pytest-django)
- [ ] Logging config (structured JSON logs)

### Frontend
- [ ] Fix `NEXT_PUBLIC_API_URL` default — currently `localhost:5000`, should be `localhost:8000`
- [ ] Admin dashboard charts (bookings by type, revenue over time)
- [ ] Email invoice delivery button in dashboard
- [ ] Dark/light mode toggle
- [ ] Mobile responsiveness audit
- [ ] Add loading skeletons for API-fetched content
- [ ] SEO meta tags for all pages
- [ ] Error boundary components
- [ ] End-to-end tests (Playwright or Cypress)

### DevOps / Infrastructure
- [x] Docker Compose setup (PostgreSQL 16, Redis 7, Django, Next.js)
- [x] `backend/Dockerfile` and `frontend/Dockerfile`
- [x] `.env.docker` — team shared env config
- [ ] Set up AWS S3 bucket + IAM user for file uploads
- [ ] Configure Vercel environment variables for production deployment
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add health check endpoint: `GET /api/health`
- [ ] Database backup strategy for production PostgreSQL
- [ ] Production PostgreSQL (separate from Docker dev DB)

---

## 🐛 Known Issues

| Issue | Severity | Status |
|---|---|---|
| No token refresh interceptor — users get logged out after 1 day | Medium | Open |
| `npm audit` reports 4 high severity vulnerabilities in frontend deps | Medium | Open |
| Celery workers not running by default — add to `docker-compose.yml` when needed | Low | Open |
| No health check endpoint (`/api/health`) for load balancer / uptime monitoring | Low | Open |

---

## 🗓️ Sprint / Milestone

### Milestone 1 — Foundation (Done ✅)
All APIs, auth, basic frontend, database

### Milestone 2 — Team Dev Ready (Done ✅)
- Docker Compose — PostgreSQL 16, Redis 7, Django, Next.js
- All 4 Dockerfiles + `.env.docker` + `.dockerignore` files
- Hot reload via volume mounts
- Fixed API URL, Celery URLs, Next.js hostname binding
- Full documentation suite (8 MD files)

### Milestone 3 — Feature Complete (Current)
- Payment integration (Razorpay)
- Admin dashboard charts
- Full booking flow end-to-end test
- Token refresh interceptor

### Milestone 4 — Production Ready
- AWS S3 + IAM configured
- Vercel env vars set
- CI/CD pipeline (GitHub Actions)
- Performance + security hardening
- Database backup strategy
