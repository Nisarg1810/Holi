# ✈️ Roman Aviation — Helicopter Tourism & Travel Platform

> **AURA Travels** — A full-stack luxury helicopter tourism and travel booking platform built for Roman Aviation.

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Backend](https://img.shields.io/badge/Backend-Django%205-green)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black)
![Database](https://img.shields.io/badge/DB-PostgreSQL%2016-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
![License](https://img.shields.io/badge/License-Private-red)

---

## 🐳 Docker Quick Start (Recommended for Team)

**Prerequisites**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

```bash
# 1. Clone the repo
git clone <repo-url>
cd Holi

# 2. Start everything (PostgreSQL + Redis + Django + Next.js)
docker compose up --build

# 3. Open in browser
# Frontend:   http://localhost:3000
# Backend:    http://localhost:8000
# API Docs:   http://localhost:8000/api/docs
# Admin:      http://localhost:8000/django/
```

> **Hot reload works** — edit any file and changes reflect instantly without rebuilding.

### Common Docker Commands
```bash
docker compose up           # Start all services
docker compose up --build   # Rebuild images (after requirements/package changes)
docker compose down         # Stop all services
docker compose down -v      # Stop and delete database volumes (fresh start)
docker compose logs -f backend    # Watch Django logs
docker compose logs -f frontend   # Watch Next.js logs
docker compose exec backend python manage.py createsuperuser  # Create admin user
docker compose exec backend python manage.py shell            # Django shell
```

---

## 📋 Table of Contents


- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Running in Development](#running-in-development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Team Docs](#team-docs)

---

## Overview

Roman Aviation is a premium helicopter tourism and travel booking platform (branded as **AURA Travels**) offering:

- 🚁 Helicopter charter bookings
- 🏔️ Tour packages
- 🏨 Hotel bookings
- ⛵ Boat ride bookings
- 👤 Customer dashboard with booking history
- 🛡️ Admin panel for operators, finance, and content teams
- 📄 Invoice generation (PDF via ReportLab)
- 🔔 Support ticket system

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Django 5 + Django REST Framework |
| Auth | SimpleJWT (JWT access + refresh tokens) |
| OTP | PBKDF2-hashed OTPs, 5-min expiry, rate-limited |
| Database | SQLite3 (dev) / PostgreSQL (prod) |
| Task Queue | Celery + Redis |
| Storage | AWS S3 via boto3 |
| PDF Generation | ReportLab |
| Email | Gmail SMTP / Console (dev fallback) |
| SMS | Twilio |
| API Docs | drf-spectacular (Swagger/OpenAPI) |
| Deployment | Gunicorn + Whitenoise |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| State Management | Zustand (persisted in localStorage) |
| HTTP Client | Axios (auto JWT injection) |
| 3D / Animation | Three.js, @react-three/fiber, Framer Motion, GSAP |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |

---

## Project Structure

```
Holi/
├── README.md                  # This file
├── CHANGELOG.md               # Version history
├── ARCHITECTURE.md            # System architecture overview
├── API_DOCUMENTATION.md       # All API endpoints reference
├── DATABASE_SCHEMA.md         # All database tables and fields
├── TASKS.md                   # Active development tasks
├── AI_CONTEXT.md              # Context for AI coding assistants
├── .env.example               # Example environment variables
├── vercel.json                # Vercel deployment config
│
├── backend/                   # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── apps/                  # Django apps
│       ├── authentication/    # Users, OTP, JWT auth
│       ├── helicopters/       # Fleet management
│       ├── packages/          # Tour packages
│       ├── hotels/            # Hotel listings
│       ├── boats/             # Boat rides
│       ├── bookings/          # All bookings
│       ├── payments/          # Payment gateway
│       ├── invoices/          # PDF invoice generation
│       ├── notifications/     # Support tickets
│       ├── careers/           # Job applications
│       └── reports/           # CSV export & file upload
│
└── frontend/                  # Next.js App
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    └── src/
        ├── app/               # Next.js App Router pages
        │   ├── page.tsx       # Home page (landing)
        │   ├── layout.tsx     # Root layout
        │   ├── auth/          # Login / Register
        │   ├── dashboard/     # Customer dashboard
        │   ├── admin/         # Admin panel
        │   ├── booking/       # Booking flow
        │   ├── checkout/      # Checkout & payment
        │   ├── tours/         # Package pages
        │   ├── hotels/        # Hotel pages
        │   ├── boats/         # Boat pages
        │   ├── careers/       # Careers page
        │   └── contact/       # Contact page
        ├── components/
        │   ├── layout/        # Navbar, Footer, AmbientEffects
        │   ├── booking/       # Booking flow components
        │   └── 3d/            # Three.js 3D components
        ├── store/
        │   ├── useAuthStore.ts   # Auth + bookings + tickets state
        │   └── useCartStore.ts   # Cart state
        ├── utils/
        │   ├── api.ts            # Axios instance with JWT interceptor
        │   └── mockData.ts       # Development mock data
        └── lib/
            └── liteapi.ts        # Hotel API integration
```

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- pip, npm

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Open
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/api/docs

---

## Environment Variables

Copy `.env.example` to `backend/.env` and fill in the values.

---

## Running in Development

```bash
# Terminal 1 — Backend
cd backend && python manage.py runserver 8000

# Terminal 2 — Frontend
cd frontend && npm run dev

# Terminal 3 — Celery (optional, for async tasks)
cd backend && celery -A config worker --loglevel=info
```

---

## API Documentation

Full API reference: `API_DOCUMENTATION.md`
Interactive Swagger UI: http://localhost:8000/api/docs

---

## Deployment

The project is configured for **Vercel** deployment via `vercel.json`:
- Frontend → Vercel (Next.js serverless)
- Backend → Vercel (Django via WSGI)

---

## Team Docs

| Document | Purpose |
|---|---|
| `ARCHITECTURE.md` | System design & data flow |
| `API_DOCUMENTATION.md` | All REST endpoints |
| `DATABASE_SCHEMA.md` | All DB tables & fields |
| `CHANGELOG.md` | Version history |
| `TASKS.md` | Active tasks & backlog |
| `AI_CONTEXT.md` | AI assistant context |
