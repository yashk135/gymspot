# 🏋️ GymSpot — Google Antigravity Prompt Pack
### Master Context + All Phase Prompts (Copy-Paste Ready)
**By Yash Balkisan Karwa**

---

## HOW TO USE THIS DOCUMENT

```
Step 1 → Open Google Antigravity
Step 2 → Start a new Mission
Step 3 → Paste the MASTER CONTEXT PROMPT first (once, at the very beginning)
Step 4 → Then paste PHASE 0 PROMPT
Step 5 → Agent works → Produces Artifact → STOPS
Step 6 → You review the Artifact and test the code
Step 7 → If happy, comment on the Artifact: "APPROVED — proceed to Phase 1"
Step 8 → Paste PHASE 1 PROMPT
Step 9 → Repeat for every phase
```

> ⚠️ NEVER paste the next phase prompt until you've tested and approved the current one.

---

---

# 📌 MASTER CONTEXT PROMPT
### Paste this ONCE at the very start. Never again.

---

```
You are building GymSpot — a global two-sided SaaS marketplace for gym discovery.
Think Zomato, but for gyms. Works in any city, any country.

---

## THE PRODUCT

Two types of users:
1. GYM OWNERS — list their gym (photos, pricing, timings, amenities, trainers, deals)
2. GYM USERS — discover nearby gyms, compare them, and book free trials

GymSpot solves a real problem: Google Maps shows WHERE gyms are, but never shows
real membership prices, gym type filters, trainer profiles, or trial booking.
GymSpot fills every gap Google Maps has.

## THE 4 KILLER FEATURES (must be in MVP — non-negotiable)
1. Verified Membership Prices → real fees, publicly listed
2. Compare 3 Gyms Side-by-Side → instant value comparison
3. One-Click Free Trial Booking → gym owner gets notified instantly
4. Live Deals & Offers → time-limited discounts only on GymSpot

---

## TECH STACK (do NOT deviate from this)

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (OTP + Google login) |
| Media Storage | Cloudinary |
| Maps | Leaflet.js + React-Leaflet + OpenStreetMap (NO Google Maps — it costs money) |
| Email | Resend |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Payments (India) | Razorpay |
| Payments (Global) | Stripe |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Validation | Zod |
| PWA | next-pwa |
| Error Monitoring | Sentry |
| Frontend Hosting | Cloudflare Pages |
| Backend Hosting | Render.com |
| Analytics | Umami (self-hosted) |

---

## FOLDER STRUCTURE (follow exactly)

gymspot/
├── app/
│   ├── (user)/                    → User-facing pages
│   │   ├── page.tsx               → Home / Gym Discovery
│   │   ├── gym/[id]/page.tsx      → Gym Detail Page
│   │   ├── compare/page.tsx       → Compare Gyms
│   │   ├── saved/page.tsx         → Saved Gyms
│   │   ├── search/page.tsx        → Search + Filters
│   │   └── profile/page.tsx       → User Profile
│   ├── (owner)/                   → Gym Owner Portal
│   │   ├── dashboard/page.tsx     → Owner Dashboard
│   │   ├── listing/create/page.tsx → 5-step listing wizard
│   │   ├── listing/edit/[id]/page.tsx
│   │   ├── inquiries/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── announcements/page.tsx
│   │   ├── deals/page.tsx
│   │   └── upgrade/page.tsx
│   ├── (admin)/                   → Admin panel (protected)
│   │   ├── verifications/page.tsx
│   │   ├── gyms/page.tsx
│   │   └── users/page.tsx
│   ├── api/                       → Backend API routes
│   │   ├── auth/
│   │   ├── gyms/
│   │   ├── users/
│   │   ├── reviews/
│   │   ├── trials/
│   │   ├── payments/
│   │   ├── notifications/
│   │   └── upload/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                        → shadcn/ui base components
│   ├── gym/                       → GymCard, GymGallery, GymMap
│   ├── owner/                     → ListingWizard, DashboardStats
│   ├── shared/                    → Navbar, Footer, FilterBar
│   └── forms/
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   ├── supabase/middleware.ts
│   ├── cloudinary.ts
│   ├── razorpay.ts
│   ├── stripe.ts
│   ├── fcm.ts
│   ├── geo.ts
│   └── validators.ts
├── supabase/
│   ├── migrations/
│   └── types.ts
├── hooks/
│   ├── useLocation.ts
│   ├── useGyms.ts
│   ├── useAuth.ts
│   └── useFilters.ts
├── types/index.ts
├── public/
│   ├── manifest.json
│   └── icons/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
└── middleware.ts

---

## DATABASE SCHEMA (Supabase / PostgreSQL)

USERS: id, name, email, phone, profile_pic, city, lat, lng, created_at
GYM_OWNERS: id, name, email, phone, is_verified, plan_type, country, currency, created_at
GYMS: id, owner_id, name, description, address, country, lat, lng, phone, email,
      gym_type, gender_type, is_verified, is_featured, total_rating,
      rating_count, status, created_at
GYM_PHOTOS: id, gym_id, url, is_video, order_index
GYM_TIMINGS: id, gym_id, day_of_week, open_time, close_time, is_closed, is_24x7
GYM_AMENITIES: id, gym_id, amenity_name
GYM_EQUIPMENT: id, gym_id, equipment_name
MEMBERSHIP_PLANS: id, gym_id, plan_name, duration_days, price, currency, features, is_active
TRAINERS: id, gym_id, name, photo_url, specialization, experience_years, bio
REVIEWS: id, user_id, gym_id, rating, cleanliness_rating, equipment_rating,
         staff_rating, value_rating, comment, created_at
SAVED_GYMS: id, user_id, gym_id, saved_at
TRIAL_REQUESTS: id, user_id, gym_id, preferred_date, status, note, created_at
ANNOUNCEMENTS: id, gym_id, title, body, expires_at, created_at
GYM_DEALS: id, gym_id, title, description, discount_percent, expires_at, is_active
OWNER_SUBSCRIPTIONS: id, owner_id, plan_type, start_date, end_date, payment_id, amount, currency, status
VERIFICATIONS: id, owner_id, gym_id, document_url, status, reviewed_at

---

## BRANDING
- App Name: GymSpot
- Tagline: "Find Your Gym, Own Your Fitness"
- Primary Color: #FF5722 (Electric Orange)
- Dark: #1A1A2E (Charcoal Black)
- Accent: #FFFFFF
- Success: #4CAF50
- Font: Inter (UI) + Syne (headings)

---

## CHECKPOINT RULES — READ THIS CAREFULLY

You MUST follow these rules for every phase of this project:

1. Before writing any code, produce a PLAN ARTIFACT showing exactly what you will build.
   Wait for my comment "APPROVED" before writing any code.

2. After completing each phase or feature, produce a COMPLETION ARTIFACT with:
   - What was built
   - Files created or modified
   - How to test it
   - Any issues or decisions made
   Then STOP completely. Do not proceed to anything else.

3. Only continue after I comment "APPROVED — proceed to [next phase]"

4. Never skip ahead. Never build Phase 2 features during Phase 1.

5. If you are unsure about anything, STOP and ask before proceeding.

---

This is the full context. Acknowledge you have understood by listing:
1. The product name and core idea
2. The tech stack (all tools)
3. The 4 killer MVP features
4. The checkpoint rule

Then wait for my first phase prompt. Do not start coding yet.
```

---

---

# ⚙️ PHASE 0 PROMPT — Project Setup
### Paste after the agent acknowledges the master context

---

```
PHASE 0 — Project Setup

Before writing anything, produce a PLAN ARTIFACT listing every step you will take.
Wait for my "APPROVED" comment before executing.

Your job in this phase:

1. Initialize Next.js 14 project
   Command: npx create-next-app@latest gymspot --typescript --tailwind --app --src-dir=no --import-alias="@/*"

2. Install all dependencies:
   npm install @supabase/supabase-js @supabase/ssr
   npm install cloudinary
   npm install leaflet react-leaflet
   npm install @types/leaflet
   npm install resend
   npm install firebase
   npm install zustand
   npm install @tanstack/react-query
   npm install zod
   npm install razorpay stripe
   npm install next-pwa
   npm install @sentry/nextjs
   npx shadcn@latest init

3. Install shadcn/ui components:
   npx shadcn@latest add button card input label badge
   npx shadcn@latest add dialog sheet tabs avatar
   npx shadcn@latest add dropdown-menu separator skeleton toast

4. Create the exact folder structure from the master context.
   Create placeholder index.ts / page.tsx files in each folder so the structure exists.

5. Create .env.example with all required keys (empty values):
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   RESEND_API_KEY=
   NEXT_PUBLIC_FIREBASE_API_KEY=
   FIREBASE_SERVER_KEY=
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   SENTRY_DSN=
   NEXTAUTH_SECRET=

6. Set up tailwind.config.js with GymSpot brand colors:
   Primary: #FF5722
   Dark: #1A1A2E
   Success: #4CAF50

7. Set up next.config.js with PWA config (next-pwa).

8. Create a basic root layout.tsx with:
   - Inter + Syne fonts from Google Fonts
   - TanStack Query provider
   - Sonner toast provider
   - Dark/light mode support

9. Create a beautiful minimal coming-soon home page (app/page.tsx) with:
   - GymSpot logo text
   - Tagline: "Find Your Gym, Own Your Fitness"
   - Orange on dark background
   - "Coming Soon" text
   This is just a placeholder — real home page comes in Phase 2.

10. Set up GitHub Actions CI file (.github/workflows/ci.yml) for auto-deploy check.

WHEN DONE:
- Produce a COMPLETION ARTIFACT listing all files created
- Show the folder tree
- List all installed packages
- Show how to run locally: npm run dev
- STOP. Do not proceed to Phase 1.

Wait for my "APPROVED — proceed to Phase 1" before anything else.
```

---

---

# 🗄️ PHASE 1 PROMPT — Database Schema
### Paste only after Phase 0 is APPROVED

---

```
PHASE 1 — Supabase Database Setup

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

Your job in this phase:

1. Create the Supabase migration files in supabase/migrations/ for ALL tables
   from the master context database schema. One SQL file per logical group:

   001_users.sql          → USERS table
   002_gym_owners.sql     → GYM_OWNERS table  
   003_gyms.sql           → GYMS table + PostGIS geo index for location search
   004_gym_details.sql    → GYM_PHOTOS, GYM_TIMINGS, GYM_AMENITIES, GYM_EQUIPMENT
   005_memberships.sql    → MEMBERSHIP_PLANS, TRAINERS
   006_interactions.sql   → REVIEWS, SAVED_GYMS, TRIAL_REQUESTS
   007_content.sql        → ANNOUNCEMENTS, GYM_DEALS
   008_subscriptions.sql  → OWNER_SUBSCRIPTIONS, VERIFICATIONS

2. Add Row Level Security (RLS) policies:
   - Users can only read/edit their own profile
   - Gym owners can only edit their own gym listings
   - Anyone can read approved/active gym listings
   - Only admins can update verification status

3. Create a Supabase geo search function:
   CREATE FUNCTION gyms_within_radius(lat float, lng float, radius_km float)
   This powers the "nearby gyms" feature.

4. Auto-generate TypeScript types from the schema:
   Create supabase/types.ts with full TypeScript interfaces for every table.

5. Create lib/supabase/client.ts (browser client)
   Create lib/supabase/server.ts (server client for API routes)
   Create lib/supabase/middleware.ts (auth session refresh)

6. Update middleware.ts to protect:
   - /owner/* routes → must be logged in as owner
   - /admin/* routes → must be admin role

7. Create a seed file supabase/seed.sql with:
   - 3 sample gym owners
   - 5 sample gyms in Mumbai (with lat/lng)
   - Sample membership plans for each gym
   - Sample photos (use placeholder URLs)
   This lets you test the UI without real data.

WHEN DONE:
- Produce a COMPLETION ARTIFACT with:
  - All SQL files created
  - All RLS policies listed
  - TypeScript types preview (first 20 lines)
  - How to run migrations: npx supabase db push
  - How to verify: list all tables in Supabase dashboard
- STOP. Do not proceed to Phase 2.

Wait for my "APPROVED — proceed to Phase 2" before anything else.
```

---

---

# 🔐 PHASE 2 PROMPT — Authentication
### Paste only after Phase 1 is APPROVED

---

```
PHASE 2 — Authentication System

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

Your job in this phase:

Build COMPLETE auth for both User and Gym Owner with Supabase Auth.

1. User Auth Pages:
   app/(auth)/login/page.tsx
   app/(auth)/signup/page.tsx
   app/(auth)/verify-otp/page.tsx

   Features:
   - Google OAuth login (one button)
   - Phone OTP login (works with any country code — international format)
   - Email + password (fallback option)
   - Beautiful UI using shadcn/ui + GymSpot branding (orange on dark)

2. Owner Auth Pages:
   app/(auth)/owner/login/page.tsx
   app/(auth)/owner/signup/page.tsx

   Same as user auth but with:
   - "I own a gym" context in the UI
   - After signup → redirect to listing wizard
   - Country + currency selector on signup (auto-detect, user can change)

3. Auth API routes:
   app/api/auth/callback/route.ts → Supabase OAuth callback
   app/api/auth/signout/route.ts → Sign out handler

4. useAuth hook (hooks/useAuth.ts):
   - getCurrentUser()
   - getUserRole() → 'user' | 'owner' | 'admin'
   - isLoggedIn()
   - signOut()

5. After login:
   - Regular user → redirect to home /
   - Gym owner → redirect to /owner/dashboard
   - Admin → redirect to /admin

6. Protected routes middleware already done in Phase 1 —
   verify it works correctly with real Supabase auth.

7. Add an auth-aware Navbar component (components/shared/Navbar.tsx):
   - Logo: "GymSpot" in orange
   - If logged out: "Login" + "List Your Gym" buttons
   - If user logged in: avatar + "Saved" + "Profile"
   - If owner logged in: avatar + "Dashboard"
   - Mobile hamburger menu

WHEN DONE:
- Produce a COMPLETION ARTIFACT with:
  - All auth pages and routes created
  - How to test Google login
  - How to test phone OTP
  - Screenshot or description of login UI
- STOP. Do not proceed to Phase 3.

Wait for my "APPROVED — proceed to Phase 3" before anything else.
```

---

---

# 🏗️ PHASE 3 PROMPT — Gym Owner Listing Wizard
### Paste only after Phase 2 is APPROVED

---

```
PHASE 3 — Gym Owner Listing Creation

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

Your job in this phase:

Build the 5-step gym listing wizard for owners at app/(owner)/listing/create/

STEP 1 — Basic Info
- Gym name (required)
- Short tagline (optional)
- Full description (textarea)
- Country (dropdown — all countries)
- Full address (street, city, pincode)
- Phone (with country code picker)
- Email, Website (optional)
- Gym type: General / CrossFit / Powerlifting / MMA / Yoga / Zumba / Mixed
- Gender policy: Co-ed / Ladies Only / Men Only

STEP 2 — Location Pin
- Show an OpenStreetMap (Leaflet.js) with a draggable marker
- Auto-locate from address entered in Step 1
- Owner drags pin to exact location
- Save lat/lng to database

STEP 3 — Photos
- Drag and drop photo uploader
- Upload to Cloudinary via signed upload (lib/cloudinary.ts)
- Free tier: max 5 photos
- Show thumbnail previews with delete button
- Cover photo selector (first one by default)
- Show "Upgrade to Premium for unlimited photos" badge

STEP 4 — Membership Plans + Details
- Membership plan builder:
  → Plan name, duration (dropdown: 1/3/6/12 months), price (in owner's currency)
  → "What's included" text
  → Toggle: Student discount / Couples plan / Personal training available
  → Add multiple plans (at least one required)
- Timings builder:
  → Day-wise open/close time picker (Mon–Sun)
  → "Closed" toggle per day
  → "24x7" master toggle
- Amenities checklist (icon grid):
  AC, Parking, Locker Room, Sauna, Steam Room, Swimming Pool,
  Cafeteria, WiFi, Shower, Wheelchair Accessible, Cardio Zone,
  Free Weights, Personal Training, Group Classes

STEP 5 — Trainers + Submit
- Add trainer profiles (optional but recommended):
  → Name, photo upload, specialization, years of experience, bio
  → Add multiple trainers
- Final review: show summary of everything entered
- Submit button → creates gym in database with status: 'pending'
- Show success screen: "Your gym is under review. We'll notify you within 24 hours."
- Owner gets email via Resend confirming submission

IMPORTANT RULES:
- Wizard must show progress bar (Step 1 of 5, etc.)
- Each step validates before allowing to proceed
- Save progress to localStorage so owner doesn't lose data if they close the tab
- Use Zod for all form validation
- All forms use react-hook-form + Zod resolver

WHEN DONE:
- Produce a COMPLETION ARTIFACT with:
  - All wizard steps built
  - How to test the full flow end-to-end
  - Cloudinary upload working?
  - Map location picker working?
  - Database record created on submit?
- STOP. Do not proceed to Phase 4.

Wait for my "APPROVED — proceed to Phase 4" before anything else.
```

---

---

# 🏠 PHASE 4 PROMPT — User Home Screen + Discovery
### Paste only after Phase 3 is APPROVED

---

```
PHASE 4 — User Home Screen + Gym Discovery

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

Your job in this phase:

Build the core user experience — the home screen and gym discovery flow.

1. Location Detection (hooks/useLocation.ts)
   - Auto-detect user GPS via browser geolocation API
   - Fallback: manual city search
   - Save location to Zustand global store
   - Show "Allow location" prompt with nice UI

2. Home Screen (app/(user)/page.tsx)
   - Hero section: "Find Your Perfect Gym" with location input
   - Horizontal scrollable deals strip (killer feature #4)
   - "Gyms Near You" section — card grid
   - Featured/Boosted Gyms section (top placement)
   - Map toggle button (list view ↔ map view)

3. Gym Card Component (components/gym/GymCard.tsx)
   - Cover photo
   - Gym name + verified badge (if verified)
   - Rating (stars + count)
   - Distance from user
   - Price (starting from ₹X/month or $X/month based on user location)
   - Gym type tag (CrossFit / Yoga / General etc.)
   - "Open Now" / "Closed" indicator
   - Save/bookmark button (heart icon)
   - "New Gym" badge (if listed within 30 days)

4. Filter Bar (components/shared/FilterBar.tsx)
   Full filter system with:
   - Distance: 0.5km / 1km / 2km / 5km / Any
   - Price: monthly fee range slider (in local currency)
   - Gender: All / Co-ed / Ladies Only / Men Only
   - Gym Type: All / General / CrossFit / Powerlifting / MMA / Yoga / Zumba
   - Amenities: multi-select checkboxes
   - Timing: All / 24x7 / Early Morning / Late Night
   - Membership: Student Discount / Couples / Personal Training
   - Rating: Any / 4+ stars / 3+ stars
   - Sort by: Distance / Price (low-high) / Rating / Newest

5. Map View (components/gym/GymMap.tsx)
   - Leaflet.js + OpenStreetMap
   - Pins for each nearby gym
   - Click pin → show gym name card popup
   - Click popup → open gym detail page

6. Nearby Gyms API (app/api/gyms/nearby/route.ts)
   - Takes lat, lng, radius_km, filters as params
   - Uses the PostGIS radius function from Phase 1
   - Returns gyms sorted by distance
   - Supports all filter params

7. Search Page (app/(user)/search/page.tsx)
   - Search box (gym name or area)
   - Same filter bar
   - Results grid
   - "No gyms found" empty state with nice illustration

WHEN DONE:
- Produce a COMPLETION ARTIFACT with:
  - Home screen built and working?
  - GPS location detection working?
  - Gym cards showing with real seed data?
  - Filters working?
  - Map view showing pins?
- STOP. Do not proceed to Phase 5.

Wait for my "APPROVED — proceed to Phase 5" before anything else.
```

---

---

# 📄 PHASE 5 PROMPT — Gym Detail Page
### Paste only after Phase 4 is APPROVED

---

```
PHASE 5 — Gym Detail Page

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

Your job in this phase:

Build the full gym detail page at app/(user)/gym/[id]/page.tsx
This is the most important user-facing page.

1. Photo/Video Carousel
   - Full-width swipeable carousel
   - Thumbnail strip below
   - Fullscreen mode on tap
   - Powered by Cloudinary URLs

2. Header Section
   - Gym name (large)
   - Verified badge (if verified)
   - Rating (stars + review count)
   - Distance from user
   - "Open Now" / "Closed" + today's hours
   - Gym type tag
   - Action buttons row: [💾 Save] [⚖️ Compare] [🎟️ Free Trial] [💬 WhatsApp] [📞 Call]

3. About Section
   - Full description
   - All timings (day-wise table)
   - Address with mini Leaflet map showing location

4. Membership Plans Section (KILLER FEATURE #1)
   - Card for each plan
   - Duration, price in local currency, what's included
   - Highlight best value plan
   - Special badges: Student / Couples / Personal Training

5. Amenities Section
   - Icon grid (colored icons for each amenity)

6. Equipment Section
   - Clean list of available equipment

7. Trainers Section
   - Card per trainer: photo, name, specialization, experience

8. Active Deals Section (KILLER FEATURE #4)
   - Banner for each active deal
   - Countdown timer for expiry
   - Discount percentage badge

9. Reviews Section
   - Overall rating breakdown (cleanliness, equipment, staff, value)
   - Individual review cards
   - "Write a Review" button (only if user has booked a trial)

10. Compare Button Logic
    - When user clicks Compare, add gym to compare store (Zustand)
    - Max 3 gyms
    - Show floating "Compare (2)" bar at bottom when 2+ gyms selected
    - Click bar → go to /compare page

11. Free Trial Booking Flow (KILLER FEATURE #3)
    - Click "Free Trial" → opens modal/sheet
    - Pick preferred date (date picker)
    - Optional note to gym
    - Submit → creates TRIAL_REQUESTS record in DB
    - Push notification to gym owner via FCM
    - Email to gym owner via Resend
    - Success message to user: "Trial requested! The gym will confirm within 24 hrs."

12. SEO
    - Dynamic metadata: "GymSpot | [Gym Name] — [City]"
    - Open Graph image using gym cover photo
    - Structured data (JSON-LD) for gym listing (LocalBusiness schema)
    - This makes gym pages rank on Google for "[gym name] [city]"

WHEN DONE:
- Produce a COMPLETION ARTIFACT with:
  - Full detail page working with seed data?
  - Free trial booking flow tested end-to-end?
  - Compare button adding gyms to store?
  - Photos loading from Cloudinary?
  - WhatsApp and Call buttons working?
- STOP. Do not proceed to Phase 6.

Wait for my "APPROVED — proceed to Phase 6" before anything else.
```

---

---

# ⚖️ PHASE 6 PROMPT — Compare + Saved Gyms
### Paste only after Phase 5 is APPROVED

---

```
PHASE 6 — Compare Gyms + Saved Gyms

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

1. Compare Page (app/(user)/compare/page.tsx) — KILLER FEATURE #2
   - Side-by-side comparison of up to 3 gyms
   - Rows to compare:
     → Cover photo
     → Name + Verified badge
     → Rating
     → Distance
     → Price range (cheapest monthly plan)
     → Gym type
     → Gender policy
     → Amenities (green tick / red cross per amenity)
     → Trainer count
     → 24x7 or not
     → Active deals
     → "Value Score" (auto-calculated: rating / price ratio, normalized 0–10)
   - "Visit Gym" button under each column
   - "Request Trial" button under each column
   - Remove gym from comparison (X button)
   - "Compare more gyms" → goes back to home

2. Saved Gyms Page (app/(user)/saved/page.tsx)
   - Grid of saved/bookmarked gym cards
   - Remove from saved (heart toggle)
   - Empty state: "No saved gyms yet. Start exploring!"
   - SAVED_GYMS table in Supabase (from Phase 1) powers this

3. User Profile Page (app/(user)/profile/page.tsx)
   - Edit name, phone, profile photo
   - Change location
   - My trial requests (list with status: pending / accepted / declined)
   - My reviews
   - Currency preference (auto-detected, user can override)

WHEN DONE:
- Produce a COMPLETION ARTIFACT
- STOP. Wait for "APPROVED — proceed to Phase 7"
```

---

---

# 📊 PHASE 7 PROMPT — Owner Dashboard
### Paste only after Phase 6 is APPROVED

---

```
PHASE 7 — Gym Owner Dashboard

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

Build the full owner experience at app/(owner)/

1. Owner Dashboard (app/(owner)/dashboard/page.tsx)
   Analytics cards row:
   - 👁️ Profile Views (this week / this month)
   - 💾 Saves/Bookmarks
   - 🎟️ Trial Requests received
   - 📞 Phone clicks
   - 💬 WhatsApp clicks
   - 📊 Conversion Rate (trials requested / profile views %)
   
   Quick actions:
   - Post Announcement
   - Add Deal
   - Edit Listing
   - Upgrade to Premium

   Listing status banner:
   - "Pending verification" (yellow)
   - "Live — visible to users" (green)
   - "Rejected — see reason" (red)

2. Trial Request Manager (app/(owner)/inquiries/page.tsx)
   - Table of all trial requests
   - Columns: User name, requested date, note, status
   - Actions: Accept / Decline (with optional reason)
   - On Accept → user gets push notification + email
   - Pending requests highlighted
   - Auto-expire badge if not responded in 48hrs

3. Announcements (app/(owner)/announcements/page.tsx)
   - Create announcement (title + body + expiry date)
   - List of active announcements
   - Delete / Edit

4. Deals & Offers (app/(owner)/deals/page.tsx)
   - Create deal: title, description, discount %, expiry date
   - Active deals list with countdown timers
   - Toggle active/inactive
   - Premium badge on "Add Deal" for free tier users (they can see but not post — premium feature)

5. Edit Listing (app/(owner)/listing/edit/[id]/page.tsx)
   - Same wizard UI as Phase 3 but pre-filled with existing data
   - Owner can update any section
   - Changes go live immediately (no re-verification needed for content edits)

WHEN DONE:
- Produce a COMPLETION ARTIFACT
- STOP. Wait for "APPROVED — proceed to Phase 8"
```

---

---

# 🛡️ PHASE 8 PROMPT — Admin Panel + Verification
### Paste only after Phase 7 is APPROVED

---

```
PHASE 8 — Admin Panel + Gym Verification

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

Build the admin panel at app/(admin)/ — protected, only you can access.

1. Admin Auth
   - Hardcode your email as admin in Supabase (role: admin)
   - Middleware already protects /admin/* routes

2. Verification Queue (app/(admin)/verifications/page.tsx)
   - Table of gyms with status: 'pending'
   - Show: gym name, owner name, submitted date, document link
   - Actions: Approve → sets is_verified=true, status='active', sends email to owner
             Reject → sets status='rejected', sends email with reason

3. All Gyms (app/(admin)/gyms/page.tsx)
   - Full list of all gyms (active, pending, rejected)
   - Search by name, city, country
   - Toggle featured status (boosts gym)
   - Deactivate a gym (if spam/fraud)

4. All Users (app/(admin)/users/page.tsx)
   - List of all registered users and owners
   - Basic stats per user

5. Platform Stats (app/(admin)/reports/page.tsx)
   - Total gyms listed (by country)
   - Total users
   - Total trial requests
   - Total revenue (from owner subscriptions)

WHEN DONE:
- Produce a COMPLETION ARTIFACT
- STOP. Wait for "APPROVED — proceed to Phase 9"
```

---

---

# 💳 PHASE 9 PROMPT — Payments + Premium
### Paste only after Phase 8 is APPROVED

---

```
PHASE 9 — Payments & Premium Plan

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

1. Premium Plan Upgrade Page (app/(owner)/upgrade/page.tsx)
   - Show Free vs Premium comparison table:
     Free: 1 listing, 5 photos, basic info, trial requests
     Premium: unlimited photos + 3 videos, featured badge, full analytics,
              priority search, deal posting, announcements, trainer profiles
   - Pricing: ₹999/month or ₹8,999/year (India)
              $12/month or $99/year (Global)
   - Auto-detect owner's country → show correct payment provider

2. Razorpay Integration (India owners)
   - lib/razorpay.ts with order creation
   - app/api/payments/razorpay/create-order/route.ts
   - app/api/payments/razorpay/verify/route.ts (webhook)
   - On success → update OWNER_SUBSCRIPTIONS table
   - On success → set gym owner plan_type = 'premium'

3. Stripe Integration (Global owners)
   - lib/stripe.ts with Stripe SDK
   - app/api/payments/stripe/create-checkout/route.ts
   - app/api/payments/stripe/webhook/route.ts
   - Stripe Checkout (hosted page — no card UI to build)
   - On success → same DB update

4. Premium Feature Gating
   - Photo upload: limit to 5 photos for free tier (show upgrade prompt)
   - Videos: disabled for free tier (show upgrade prompt)
   - Analytics page: basic stats free, detailed stats premium
   - Deals: visible to free owners but posting requires premium
   - Featured badge: only premium owners
   - Priority search placement: only premium owners

5. Boost Listing (separate one-time purchase)
   - ₹299/week (India) / $4/week (Global)
   - Appears at top of search in their city for 7 days
   - Same Razorpay/Stripe flow
   - Sets is_featured=true with expiry date

WHEN DONE:
- Produce a COMPLETION ARTIFACT
- STOP. Wait for "APPROVED — proceed to Phase 10"
```

---

---

# 📱 PHASE 10 PROMPT — PWA + Polish + Launch
### Paste only after Phase 9 is APPROVED

---

```
PHASE 10 — PWA, Polish & Launch Prep

Before writing anything, produce a PLAN ARTIFACT. Wait for "APPROVED" before executing.

1. PWA Setup
   - Configure next-pwa in next.config.js
   - Create public/manifest.json:
     name: "GymSpot", short_name: "GymSpot"
     theme_color: "#FF5722", background_color: "#1A1A2E"
   - Generate all icon sizes: 72x72 to 512x512
   - Add "Add to Home Screen" prompt component
   - Test: app installs on Android Chrome

2. Push Notifications
   - Firebase FCM fully wired up
   - Request notification permission on login
   - Save FCM token per user in Supabase
   - Trigger notifications for:
     → Owner: new trial request received
     → User: trial request accepted/declined
     → User: new deal from a saved gym

3. SEO — Auto-generated Gym Pages
   - Dynamic sitemap.xml (next.js sitemap route)
   - Every gym page has proper metadata:
     Title: "[Gym Name] — GymSpot | Gyms in [City]"
     Description: "[Gym Name] membership prices from [price]. [amenities list]."
   - JSON-LD structured data (LocalBusiness) on every gym page
   - Auto-generates pages for queries like "gyms in andheri" via gym listing pages

4. Performance Polish
   - All images use Next.js Image component with Cloudinary loader
   - Skeleton loading states on all data-loading components
   - Error boundaries on all major sections
   - Empty states with helpful copy and CTA on all list pages

5. Error Monitoring
   - Sentry fully configured (npx @sentry/wizard@latest -i nextjs)
   - Test error capture working

6. Landing / Marketing Page (app/landing/page.tsx or app/page.tsx if no gyms yet)
   - Hero: "Find Your Perfect Gym — Real Prices, Real Reviews"
   - The Google Maps problem (what GymSpot solves)
   - How it works (3 steps for users, 3 steps for owners)
   - CTA: "Find Gyms Near Me" + "List Your Gym Free"
   - Designed with GymSpot branding: Orange on dark

7. Final Checklist Before Deploy:
   - [ ] All env variables set in Cloudflare Pages dashboard
   - [ ] Supabase RLS policies tested
   - [ ] Cloudinary upload working in production
   - [ ] Razorpay/Stripe test payments working
   - [ ] FCM push notifications working on mobile
   - [ ] PWA installs correctly on Android
   - [ ] All pages mobile responsive
   - [ ] Lighthouse score > 85

WHEN DONE:
- Produce a COMPLETION ARTIFACT with full launch checklist status
- The product is now ready to onboard real gyms
- STOP. Await further instructions.

🎉 GymSpot MVP is complete.
```

---

---

## ✅ QUICK REFERENCE — Phase Order

| Phase | What | Keyword to unlock next |
|---|---|---|
| Master Context | Full project brief | "APPROVED — start Phase 0" |
| Phase 0 | Project setup + folder structure | "APPROVED — proceed to Phase 1" |
| Phase 1 | Database schema (Supabase) | "APPROVED — proceed to Phase 2" |
| Phase 2 | Authentication (OTP + Google) | "APPROVED — proceed to Phase 3" |
| Phase 3 | Owner listing wizard | "APPROVED — proceed to Phase 4" |
| Phase 4 | User home + gym discovery | "APPROVED — proceed to Phase 5" |
| Phase 5 | Gym detail page + trial booking | "APPROVED — proceed to Phase 6" |
| Phase 6 | Compare gyms + saved gyms | "APPROVED — proceed to Phase 7" |
| Phase 7 | Owner dashboard + analytics | "APPROVED — proceed to Phase 8" |
| Phase 8 | Admin panel + verification | "APPROVED — proceed to Phase 9" |
| Phase 9 | Payments (Razorpay + Stripe) | "APPROVED — proceed to Phase 10" |
| Phase 10 | PWA + polish + launch | 🚀 Ship it |

---

*GymSpot Antigravity Prompt Pack — By Yash Balkisan Karwa*
*Total Phases: 10 | Estimated Build Time: 8–12 weeks solo*
