# API Documentation — Roman Aviation / AURA Travels

Base URL (dev): `http://localhost:8000`
Interactive Docs: `http://localhost:8000/api/docs`

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

---

## Authentication (`/api/auth/`)

### Register with Password
```
POST /api/auth/register
POST /api/v1/auth/register

Body: { "email": "...", "name": "...", "password": "..." }
Response: { "access": "...", "refresh": "...", "user": {...} }
```

### Password Login
```
POST /api/auth/password-login
POST /api/v1/auth/password-login

Body: { "email": "...", "password": "..." }
Response: { "access": "...", "refresh": "...", "user": {...} }
```

### Send OTP (Login)
```
POST /api/auth/send-otp
POST /api/v1/auth/send-otp

Body: { "email": "..." }
Response: { "message": "OTP sent" }
```

### Verify OTP (Login)
```
POST /api/auth/verify-otp
POST /api/v1/auth/verify-otp

Body: { "email": "...", "otp": "123456" }
Response: { "access": "...", "refresh": "...", "user": {...} }
```

### Resend OTP
```
POST /api/auth/resend-otp
Body: { "email": "..." }
Response: { "message": "OTP resent" }
Note: 60-second rate limit enforced
```

### Direct Login (no OTP)
```
POST /api/auth/direct-login
Body: { "email": "..." }
Response: { "access": "...", "refresh": "...", "user": {...} }
```

### Register with OTP
```
POST /api/auth/send-register-otp   — Send OTP to new email
POST /api/auth/verify-signup-otp   — Verify OTP, create account
POST /api/auth/direct-register     — Register without OTP

Body: { "email": "...", "name": "...", "otp": "..." }
```

### Password Reset
```
POST /api/auth/send-reset-otp      — Send OTP for password reset
POST /api/auth/reset-password      — Reset with OTP

Body (reset): { "email": "...", "otp": "...", "new_password": "..." }
```

### Update Profile
```
POST /api/auth/profile
Auth: Required

Body: {
  "email": "...",
  "name": "...",
  "phone": "...",
  "gender": "...",
  "date_of_birth": "YYYY-MM-DD",
  "city_of_residence": "...",
  "state": "...",
  "nationality": "...",
  "marital_status": "...",
  "anniversary": "YYYY-MM-DD"
}
Response: { updated user object }
```

---

## Users (`/api/users/`)

```
GET    /api/users            — List all users (admin)
GET    /api/users/<id>       — Get user by ID
PUT    /api/users/<id>       — Update user
DELETE /api/users/<id>       — Delete user
```

---

## Helicopters (`/api/fleet/` or `/api/v1/helicopters/`)

```
GET    /api/fleet            — List all helicopters
GET    /api/fleet/<id>       — Get helicopter by ID
POST   /api/fleet            — Create helicopter (admin)
PUT    /api/fleet/<id>       — Update helicopter (admin)
DELETE /api/fleet/<id>       — Delete helicopter (admin)
```

**Helicopter Object:**
```json
{
  "id": "heli-1",
  "name": "Airbus H125",
  "model": "H125",
  "tagline": "The ultimate mountain explorer",
  "price": 25000.00,
  "capacity": 5,
  "speed": "250 km/h",
  "range": "650 km",
  "safety_rating": "A+",
  "description": "...",
  "image": "/image/heli1.jpg",
  "features": ["Air conditioning", "GPS Navigation"],
  "specs": {"Engine": "Turbomeca Arriel 2D", "MTOW": "2250 kg"},
  "schedules": ["Morning - 06:00", "Afternoon - 14:00"]
}
```

---

## Tour Packages (`/api/tours/` or `/api/v1/packages/`)

```
GET    /api/tours            — List all tour packages
GET    /api/tours/<id>       — Get tour by ID
POST   /api/tours            — Create tour (admin)
PUT    /api/tours/<id>       — Update tour (admin)
DELETE /api/tours/<id>       — Delete tour (admin)
```

**Tour Object:**
```json
{
  "id": "tour-1",
  "name": "Himalayan Odyssey",
  "tagline": "7 days of pure adventure",
  "price": 85000.00,
  "duration": "7 Days / 6 Nights",
  "rating": 4.9,
  "image": "/image/tour1.jpg",
  "inclusions": ["Helicopter transfers", "Hotel accommodation"],
  "exclusions": ["Personal expenses", "Travel insurance"],
  "itinerary": [
    { "day": 1, "title": "Arrival", "desc": "...", "stay": "Hotel XYZ", "transport": "Helicopter" }
  ]
}
```

---

## Hotels (`/api/hotels/` or `/api/v1/hotels/`)

```
GET    /api/hotels           — List all hotels
GET    /api/hotels/<id>      — Get hotel by ID
POST   /api/hotels           — Create hotel (admin)
PUT    /api/hotels/<id>      — Update hotel (admin)
DELETE /api/hotels/<id>      — Delete hotel (admin)
```

**Hotel Object:**
```json
{
  "id": "hotel-1",
  "name": "The Grand Himalayan",
  "location": "Manali, Himachal Pradesh",
  "rating": "4.8/5.0",
  "price": 12000.00,
  "image": "/image/hotel1.jpg",
  "amenities": ["Swimming Pool", "Spa", "Restaurant", "WiFi"],
  "description": "..."
}
```

---

## Boats (`/api/boats/` or `/api/v1/boats/`)

```
GET    /api/boats            — List all boats
GET    /api/boats/<id>       — Get boat by ID
POST   /api/boats            — Create boat (admin)
PUT    /api/boats/<id>       — Update boat (admin)
DELETE /api/boats/<id>       — Delete boat (admin)
```

**Boat Object:**
```json
{
  "id": "boat-1",
  "name": "Azure Voyager",
  "type": "Luxury Yacht",
  "capacity": "12 guests",
  "price": 15000.00,
  "image": "/image/boat1.jpg",
  "schedules": ["Sunrise - 06:00", "Sunset - 17:00"],
  "description": "..."
}
```

---

## Bookings (`/api/bookings/` or `/api/v1/bookings/`)

```
GET    /api/bookings                    — List bookings (filter by ?email=...)
GET    /api/bookings/<id>              — Get booking by ID
POST   /api/bookings                    — Create booking
DELETE /api/bookings/<id>              — Delete booking (admin)
POST   /api/bookings/cancel/<id>       — Cancel a booking
```

**Booking Object:**
```json
{
  "id": "BK-1234",
  "user_email": "user@example.com",
  "type": "helicopter",
  "name": "Airbus H125 - Himalayan Tour",
  "details": "2 adults, window seat preferred",
  "date": "2026-08-15",
  "passengers": 2,
  "price": 25000.00,
  "status": "Confirmed",
  "created_at": "2026-07-30T10:00:00Z"
}
```

**Booking Types:** `helicopter` | `package` | `hotel` | `boat`
**Booking Statuses:** `Confirmed` | `Pending` | `Cancelled` | `In Flight`

---

## Payments (`/api/payments/`)

```
POST /api/payments/create    — Create payment order
Body: { "amount": 25000, "currency": "INR", "booking_id": "BK-1234" }
Response: { "order_id": "...", "amount": ..., "currency": "..." }

POST /api/payments/verify    — Verify payment signature
Body: { "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "..." }
Response: { "status": "success" }
```

---

## Invoices (`/api/v1/invoices/<id>`)

```
GET /api/v1/invoices/<booking_id>      — Download PDF invoice
GET /api/bookings/invoice/<booking_id> — Compat alias
Response: PDF file (application/pdf)
```

---

## Support Tickets (`/api/tickets/` or `/api/v1/notifications/tickets/`)

```
GET    /api/tickets               — List tickets (filter by ?email=...)
GET    /api/tickets/<id>          — Get ticket by ID
POST   /api/tickets               — Create ticket
POST   /api/tickets/reply/<id>    — Add reply to ticket

Body (create): {
  "id": "TCK-101",
  "user_email": "...",
  "subject": "...",
  "category": "Booking",
  "date": "2026-07-30",
  "initialMessage": "..."
}

Body (reply): { "text": "...", "sender": "user" | "support" }
```

---

## Careers (`/api/careers/` or `/api/v1/careers/`)

```
GET    /api/careers           — List all applications (admin)
POST   /api/careers           — Submit application
DELETE /api/careers/<id>      — Delete application (admin)

Body: {
  "name": "...",
  "email": "...",
  "qualification": "...",
  "experience": "...",
  "cv_file": "s3://...",
  "photo_file": "s3://..."
}
```

---

## Reports & Admin (`/api/admin/`)

```
GET  /api/admin/export/<table>     — Export table to CSV
     Tables: users, bookings, helicopters, tours, hotels, boats,
             tickets, careers, otp_verifications

POST /api/storage/upload           — Upload file to S3
     Body: multipart/form-data { file: <file> }
     Response: { "url": "https://s3.amazonaws.com/..." }
```
