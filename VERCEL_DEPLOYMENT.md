# Hosting MediZap on Vercel – Complete Step-by-Step Guide

This project is configured for **1-click deployment on Vercel** with full Vite SPA support, clean routing rewrites, and serverless API integration.

---

## Prerequisites
- A free account on [Vercel](https://vercel.com).
- Your Supabase project URL and Key:
  - `VITE_SUPABASE_URL`: `https://xviesnouyuapqmzplukr.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_c_yQXCiNKklDYaMsxanowA_OO7i6L9q`

---

## Method 1: Deploy with GitHub (Recommended)

### Step 1: Push Project to GitHub

In your project directory, initialize git and push to GitHub:
```powershell
# 1. Initialize git
git init
git add .
git commit -m "feat: MediZap production with Supabase and Vercel configuration"

# 2. Add your GitHub repository URL (create an empty repo on GitHub first)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/medzap.git
git push -u origin main
```

### Step 2: Import Project in Vercel

1. Log in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Under **Import Git Repository**, find your `medzap` repo and click **Import**.

### Step 3: Configure Build & Environment Variables

1. **Framework Preset**: Vercel will automatically detect **Vite**.
2. **Root Directory**: Leave as `./` (default).
3. **Build Command**: `vite build` (or `npm run build`).
4. **Output Directory**: `dist`.
5. Expand the **Environment Variables** section and add:
   | Variable Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://xviesnouyuapqmzplukr.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_c_yQXCiNKklDYaMsxanowA_OO7i6L9q` |
   | `GEMINI_API_KEY` | *(Optional - your Google Gemini API key if available)* |
   | `GEMINI_MODEL` | `gemini-2.5-flash` |

6. Click **Deploy**.

Within 45–60 seconds, Vercel will build your application and provide your live production domain (e.g. `https://medzap-taupe.vercel.app`).

---

## Method 2: Deploy Using the Vercel CLI

If you prefer deploying directly from your terminal:

1. Install Vercel CLI (or run via npx):
   ```powershell
   npx vercel
   ```

2. Follow the terminal prompts:
   - `Set up and deploy?` -> `Y`
   - `Which scope?` -> Select your personal account
   - `Link to existing project?` -> `N`
   - `What's your project's name?` -> `medizap`
   - `In which directory is your code located?` -> `./`
   - `Want to modify these settings?` -> `N`

3. Add your Supabase environment variables in the Vercel dashboard (or via CLI):
   ```powershell
   npx vercel env add VITE_SUPABASE_URL production
   npx vercel env add VITE_SUPABASE_ANON_KEY production
   ```

4. Deploy to Production:
   ```powershell
   npx vercel --prod
   ```

---

## What `vercel.json` Does
Your project already contains [`vercel.json`](./vercel.json) configured with:
```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
- **`/api/*` Rewrite**: Routes API and AI Clinical Triage requests to the serverless function in [`api/index.ts`](./api/index.ts).
- **`/*` Rewrite**: Handles client-side SPA routing (`/find-doctors`, `/hospitals`, `/my-appointments`) so refreshing pages in production never triggers a 404 error.
- **Fail-safe Triage**: If the API encounters cold start latency, the frontend automatically falls back to instant client-side clinical triage matching doctors from your catalog.
