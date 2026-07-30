# Database Schema — Roman Aviation / AURA Travels

Engine: **PostgreSQL 16** (Docker / production) | **SQLite3** (local non-Docker fallback)
ORM: Django 5 models
All `ArrayField` types replaced with `JSONField` for cross-database compatibility.

## Connecting to the Database

### Via Docker (team default)
```bash
# Interactive psql shell
docker compose exec db psql -U aura -d aura_dev

# Or connect with any DB tool (DBeaver, TablePlus, etc.)
Host:     localhost
Port:     5432
Database: aura_dev
User:     aura
Password: aura_dev_pass
```

### Reset Database (Docker)
```bash
docker compose down -v      # ⚠️ Deletes all data
docker compose up --build   # Re-runs all migrations automatically
```

---


## Table: `users`
> App: `authentication` | Model: `User`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto | Django default |
| `name` | VARCHAR(100) | NOT NULL | First name |
| `last_name` | VARCHAR(100) | NULL | Last name |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Login email |
| `phone` | VARCHAR(20) | NULL | Phone number |
| `password` | VARCHAR(128) | NOT NULL | PBKDF2 hashed |
| `role` | VARCHAR(20) | DEFAULT `customer` | Enum (see below) |
| `gender` | VARCHAR(20) | NULL | M/F/Other |
| `date_of_birth` | DATE | NULL | DOB |
| `city_of_residence` | VARCHAR(100) | NULL | City |
| `state` | VARCHAR(100) | NULL | State/Province |
| `nationality` | VARCHAR(100) | NULL | Country |
| `marital_status` | VARCHAR(50) | NULL | Single/Married/etc |
| `anniversary` | DATE | NULL | Anniversary date |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account active |
| `is_staff` | BOOLEAN | DEFAULT FALSE | Django admin access |
| `is_superuser` | BOOLEAN | DEFAULT FALSE | Full permissions |
| `created_at` | DATETIME | auto_now_add | Registration time |

**Roles:** `superadmin` | `admin` | `operator` | `support` | `finance` | `contentmanager` | `customer`

---

## Table: `otp_verifications`
> App: `authentication` | Model: `OTPVerification`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto | Django default |
| `email` | VARCHAR | INDEX | Target email |
| `otp_hash` | VARCHAR(255) | NOT NULL | PBKDF2 hashed OTP |
| `created_at` | DATETIME | auto_now_add | When OTP was created |
| `expires_at` | DATETIME | NOT NULL | OTP expiry (5 min) |
| `attempts` | SMALLINT | DEFAULT 0 | Wrong attempt count |
| `is_verified` | BOOLEAN | DEFAULT FALSE | OTP used successfully |
| `last_sent_at` | DATETIME | auto_now_add | Rate-limit anchor (60s) |

**Business Rules:**
- Max 5 wrong attempts before lockout
- OTP expires after 5 minutes
- 60-second cooldown on resend

---

## Table: `helicopters`
> App: `helicopters` | Model: `Helicopter`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | e.g. `heli-1` |
| `name` | VARCHAR(100) | NOT NULL | e.g. `Airbus H125` |
| `model` | VARCHAR(100) | NOT NULL | Model name |
| `tagline` | VARCHAR(200) | NULL | Marketing tagline |
| `price` | DECIMAL(12,2) | NOT NULL | Price per booking |
| `capacity` | INTEGER | NOT NULL | Max passengers |
| `speed` | VARCHAR(50) | NULL | e.g. `250 km/h` |
| `range` | VARCHAR(50) | NULL | e.g. `650 km` |
| `safety_rating` | VARCHAR(10) | NULL | e.g. `A+` |
| `description` | TEXT | NULL | Full description |
| `image` | VARCHAR(255) | NULL | Image path/URL |
| `features` | JSON | DEFAULT `[]` | List of feature strings |
| `specs` | JSON | DEFAULT `{}` | Key-value spec dict |
| `schedules` | JSON | DEFAULT `[]` | Available time slots |

---

## Table: `tours`
> App: `packages` | Model: `Tour`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | e.g. `tour-1` |
| `name` | VARCHAR(100) | NOT NULL | Tour name |
| `tagline` | VARCHAR(255) | NULL | Short description |
| `price` | DECIMAL(12,2) | NOT NULL | Price per person |
| `duration` | VARCHAR(100) | NOT NULL | e.g. `7 Days / 6 Nights` |
| `rating` | DECIMAL(3,2) | DEFAULT 5.0 | Star rating |
| `image` | VARCHAR(255) | NULL | Image path/URL |
| `inclusions` | JSON | DEFAULT `[]` | What's included |
| `exclusions` | JSON | DEFAULT `[]` | What's excluded |
| `itinerary` | JSON | DEFAULT `[]` | Day-by-day plan |

**Itinerary JSON shape:**
```json
[
  {
    "day": 1,
    "title": "Arrival at Base",
    "desc": "Check in and orientation",
    "stay": "Hotel Grand View",
    "transport": "Helicopter"
  }
]
```

---

## Table: `hotels`
> App: `hotels` | Model: `Hotel`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | e.g. `hotel-1` |
| `name` | VARCHAR(150) | NOT NULL | Hotel name |
| `location` | VARCHAR(255) | NULL | City, State |
| `rating` | VARCHAR(10) | DEFAULT `5.0/5.0` | Rating string |
| `price` | DECIMAL(12,2) | NOT NULL | Price per night |
| `image` | VARCHAR(255) | NULL | Image path/URL |
| `amenities` | JSON | DEFAULT `[]` | List of amenity strings |
| `description` | TEXT | NULL | Full description |

---

## Table: `boats`
> App: `boats` | Model: `Boat`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | e.g. `boat-1` |
| `name` | VARCHAR(150) | NOT NULL | Boat name |
| `type` | VARCHAR(100) | NULL | e.g. `Luxury Yacht` |
| `capacity` | VARCHAR(50) | NULL | e.g. `12 guests` |
| `price` | DECIMAL(12,2) | NOT NULL | Price per booking |
| `image` | VARCHAR(255) | NULL | Image path/URL |
| `schedules` | JSON | DEFAULT `[]` | Available time slots |
| `description` | TEXT | NULL | Full description |

---

## Table: `bookings`
> App: `bookings` | Model: `Booking`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | e.g. `BK-1234` |
| `user_email` | VARCHAR(100) | NOT NULL | Booking owner email |
| `type` | VARCHAR(50) | NOT NULL | `helicopter`/`package`/`hotel`/`boat` |
| `name` | VARCHAR(100) | NOT NULL | Service name |
| `details` | TEXT | NULL | Free-form notes |
| `date` | VARCHAR(50) | NOT NULL | Booking date string |
| `passengers` | INTEGER | DEFAULT 2 | Passenger count |
| `price` | DECIMAL(12,2) | NOT NULL | Total price |
| `status` | VARCHAR(50) | DEFAULT `Confirmed` | Status enum |
| `created_at` | DATETIME | auto_now_add | Creation timestamp |

**Statuses:** `Confirmed` | `Pending` | `Cancelled` | `In Flight`

---

## Table: `tickets`
> App: `notifications` | Model: `Ticket`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(50) | PK | e.g. `TCK-101` |
| `user_email` | VARCHAR(100) | NOT NULL | Ticket owner |
| `subject` | VARCHAR(200) | NOT NULL | Ticket subject |
| `category` | VARCHAR(50) | NOT NULL | e.g. `Booking`, `General` |
| `status` | VARCHAR(20) | DEFAULT `Open` | `Open` / `Resolved` |
| `date` | VARCHAR(50) | NOT NULL | Date string |
| `messages` | JSON | DEFAULT `[]` | Thread of messages |

**Messages JSON shape:**
```json
[
  {
    "sender": "user",
    "text": "My booking was cancelled unexpectedly.",
    "date": "2026-07-30"
  },
  {
    "sender": "support",
    "text": "We are looking into this for you.",
    "date": "2026-07-30"
  }
]
```

---

## Table: `career_applications`
> App: `careers` | Model: `CareerApplication`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK, auto | Django default |
| `name` | VARCHAR(100) | NOT NULL | Applicant name |
| `email` | VARCHAR(100) | NOT NULL | Contact email |
| `qualification` | VARCHAR(255) | NULL | Highest qualification |
| `experience` | VARCHAR(255) | NULL | Years + description |
| `cv_file` | VARCHAR(255) | NOT NULL | S3 URL to CV/resume |
| `photo_file` | VARCHAR(255) | NULL | S3 URL to photo |
| `status` | VARCHAR(50) | DEFAULT `Pending` | Review status |
| `created_at` | DATETIME | auto_now_add | Submission time |

---

## Django Built-in Tables (also present)

| Table | Purpose |
|---|---|
| `django_admin_log` | Admin panel audit trail |
| `auth_group` | Permission groups |
| `auth_permission` | Granular permissions |
| `django_content_type` | Content type framework |
| `django_session` | Session storage |
| `django_migrations` | Migration history |
