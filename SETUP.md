# RPF Sporthorses — Setup Guide

## Overview

This is a Next.js 14 website with:
- **Sanity CMS** — barn owner updates content (copy, images, services, trainers, awards, gallery, show team)
- **Supabase** — user auth + database (scheduling, lessons, payments)
- **PayPal + Venmo** — payment links for clients
- Full scheduling system for trainers and students

---

## Step 1: Supabase Setup (Database + Auth)

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your project dashboard, go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Enable **Email Auth** under Authentication → Providers
5. Create trainer accounts manually: after a user signs up, update their `role` in the `profiles` table to `trainer` or `owner`
6. For each trainer, insert a row into the `trainers` table with their user ID

---

## Step 2: Sanity CMS Setup

1. Go to [sanity.io](https://sanity.io) and create a free project
2. Copy your **Project ID** → `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. In Sanity dashboard, go to **API → Tokens** → create a "Viewer" token → `SANITY_API_READ_TOKEN`
4. Set `NEXT_PUBLIC_SANITY_DATASET=production`
5. To access the CMS editor: go to `https://your-domain.com/studio`
   - Sign in with your Sanity credentials
   - Edit site settings, pages, services, gallery, trainers, awards, and show team

---

## Step 3: PayPal Setup

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Create an app and get your **Client ID** → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
3. Set `NEXT_PUBLIC_PAYPAL_ME_URL=https://paypal.me/YourHandle`
4. Set `NEXT_PUBLIC_VENMO_USERNAME=YourVenmoHandle`

---

## Step 4: Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

---

## Step 5: Deploy to Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add all environment variables from `.env.local` in the Vercel project settings
4. Deploy!

---

## How to Update Content (Barn Owner)

1. Go to `https://your-site.com/studio`
2. Log in with your Sanity account
3. Edit:
   - **Site Settings** — barn name, logo, contact info, social links
   - **Pages** — hero images, page text for each section
   - **Services** — add/edit services with descriptions and pricing
   - **Gallery** — upload and organize photos by category
   - **Trainers** — add trainer profiles and bios
   - **Awards** — log show results and championships
   - **Show Team** — add/update team member profiles

---

## How Scheduling Works

### For Students (Clients)
1. Create an account at `/signup`
2. Log in → Dashboard → "Book a Lesson"
3. Select trainer → duration (30 or 60 min) → date → time
4. Trainer receives notification and approves/declines
5. After approval, pay via PayPal or Venmo from the Payments page

### For Trainers
1. Log in → Trainer Dashboard (auto-redirected based on role)
2. **Set Availability** — configure weekly schedule and block off dates
3. **Approve/Decline** pending lesson requests from the dashboard
4. **Mark lessons paid** after receiving payment

### For Prospective Clients (Trial Lessons)
- No account required — go to `/trial`
- Fill in name, email, phone, experience level
- Select trainer and preferred date/time
- Trainer gets the request and confirms within 24 hours

---

## Project Structure

```
app/
  page.tsx              ← Home
  about/                ← About
  services/             ← Services
  gallery/              ← Gallery (with lightbox + filter)
  awards/               ← Awards
  show-team/            ← Show Team
  login/                ← Client login
  signup/               ← Create account
  trial/                ← Trial lesson booking (no login)
  dashboard/            ← Client dashboard
    schedule/           ← Book a lesson
    payments/           ← Pay fees (PayPal + Venmo)
    profile/            ← Update profile
  trainer/              ← Trainer dashboard
    availability/       ← Set weekly schedule + block dates
    lessons/            ← All lessons + payment management
  studio/               ← Sanity CMS (admin only)

lib/
  supabase/             ← Supabase client (browser + server)
  sanity/               ← Sanity client + image URL builder
  utils.ts              ← Shared utilities

sanity/
  schemas/              ← All CMS content types
  sanity.config.ts      ← Sanity Studio configuration

supabase/
  schema.sql            ← Run this in Supabase SQL editor
```
