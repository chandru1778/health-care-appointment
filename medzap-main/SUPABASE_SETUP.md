# MediZap – Supabase Connection & Setup Guide

This guide walks you through connecting MediZap to your Supabase project in under 3 minutes.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Choose your organization, project name (e.g. `medizap`), database password, and preferred region.
4. Click **Create new project** and wait ~1-2 minutes for the database to provision.

---

## 2. Execute the Database Schema & Seed Data

1. In your Supabase Project Dashboard, click on **SQL Editor** in the left sidebar (or press `Ctrl+K` and type `SQL`).
2. Click **New query**.
3. Open the file [`supabase_schema.sql`](./supabase_schema.sql) in this repository.
4. Copy all contents and paste them into the Supabase SQL Editor.
5. Click **Run** (or press `Ctrl + Enter`).

### What this schema sets up:
- **`public.profiles`**: Synchronized with Supabase Auth users via an automatic database trigger (`handle_new_user`).
- **`public.specialties`**: 10 medical specialties with counts and emoji badges.
- **`public.hospitals`**: 4 verified emergency centers and hospitals (Apollo Care, City Health, GreenLife, Saint Luke).
- **`public.doctors`**: 12 verified clinical specialists with credentials, fees, and next slots.
- **`public.appointments`**: Scheduled visits supporting status updates (`Confirmed`, `Pending Slot`, `Cancelled`, `Completed`), rescheduling, and telehealth.
- **`public.medical_records`**: Past consultation summaries, digital prescriptions, and diagnoses.
- **`public.family_members`**: Patient family care profiles.
- **`public.notification_preferences`**: SMS, Email, and Push notification channel toggles.
- **Row Level Security (RLS)**: Pre-configured secure policies for public read access to directories and user-level isolation for medical data.
- **Indexes**: Optimized for instantaneous search, filtering, and slot checking.

---

## 3. Connect MediZap to Supabase

1. In your Supabase Dashboard, go to **Project Settings** (gear icon at the bottom left) -> **API**.
2. Under **Project API keys**, locate:
   - **Project URL**: e.g., `https://abcdefghijklm.supabase.co`
   - **`anon` `public` key**: e.g., `eyJhbGciOi...`
3. In your project root, open the `.env` file (or copy `.env.example` to `.env`):
   ```env
   VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
   VITE_SUPABASE_ANON_KEY="YOUR_ACTUAL_ANON_PUBLIC_KEY"
   PORT=3000
   ```
4. Save the `.env` file.

---

## 4. Install Dependencies & Run MediZap

If Node.js is not yet installed on your system, install it from [https://nodejs.org](https://nodejs.org) (v18 or v20 LTS recommended).

Open your terminal in this directory:
```bash
# 1. Install dependencies (including @supabase/supabase-js)
npm install

# 2. Start the MediZap development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. What Works Out-of-the-Box:

- 🟢 **Live Database Indicator**: Header displays `Supabase Connected` with an animated green pulse when connected to Supabase (or `Local Mode` with zero errors if `.env` is unconfigured).
- 🔐 **Supabase Authentication**:
  - Sign Up: Creates real auth user in `auth.users` and automatically initializes `profiles` & `notification_preferences`.
  - Sign In: Signs in with Supabase Auth session persistence.
  - One-Click Demo Login: Instant guest sign-in for rapid testing.
- 🩺 **Doctor & Hospital Directory**: Fetches specialists, ratings, slots, and hospitals dynamically from Supabase.
- 📅 **Dynamic Appointment Booking**: Select real dates (Today, Tomorrow, and upcoming days), choose slots, and save directly to Supabase `appointments`.
- 🔄 **Reschedule & Cancel**: Real-time status update in Supabase (`status = 'Cancelled'`, new date/time slot updates).
- 👨‍👩‍👧 **Family Care Profiles**: Add family members with live database synchronization.
- 📋 **Medical History**: Live display of prescriptions, past diagnoses, and physician notes.
- 🔔 **Notification Preferences**: Real-time toggle of SMS, Email, and Push preferences.
- 🤖 **AI Clinical Triage Assistant**: Integrated with Google Gemini API with automatic clinical fallback matching doctors from your database.
