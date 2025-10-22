# Netlify Deployment Guide

## Prerequisites

- GitHub account
- Netlify account (free tier works)
- Your code pushed to a GitHub repository

## Step 1: Push Code to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit - AI Readiness Survey"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2: Connect to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select your repository

## Step 3: Configure Build Settings

Netlify should auto-detect the settings from `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Functions directory**: `netlify/functions`

## Step 4: Add Environment Variables

In Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add the following:

**Key**: `DATABASE_URL`  
**Value**: `postgresql://postgres:oIMziLaMpIgojNDK@db.bmsyrncxiohcqwvjzbea.supabase.co:5432/postgres`

## Step 5: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://[random-name].netlify.app`

## Step 6: Test the Deployment

1. Visit your Netlify URL
2. Complete a survey
3. Check your browser console - you should see "Survey saved successfully"
4. Verify in Supabase that the data was saved:
   - Go to Supabase → Table Editor → survey_responses
   - You should see the new entry

## Custom Domain (Optional)

To use a custom domain:

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow the instructions to configure DNS

## Troubleshooting

### Build fails

- Check the build logs in Netlify
- Make sure all dependencies are in `package.json`
- Verify Node version is 22.13.0

### Database connection fails

- Verify DATABASE_URL is set correctly in environment variables
- Check Supabase database is accessible (not paused)
- Ensure the `survey_responses` table exists

### Functions not working

- Check the Functions tab in Netlify dashboard
- Look for error logs
- Verify the API routes match: `/api/survey/submit`, `/api/admin/responses`, `/api/admin/stats`

## Files Included for Deployment

- ✅ `netlify.toml` - Netlify configuration
- ✅ `netlify/functions/survey-submit.ts` - Survey submission API
- ✅ `netlify/functions/admin-responses.ts` - Get all responses
- ✅ `netlify/functions/admin-stats.ts` - Get statistics
- ✅ `package.json` - Updated with @netlify/functions

## What Happens After Deployment

1. **Frontend**: React app is built and served as static files
2. **Backend**: Express API routes are converted to Netlify Functions
3. **Database**: Functions connect to your Supabase PostgreSQL database
4. **API Routes**: 
   - `/api/survey/submit` → `/.netlify/functions/survey-submit`
   - `/api/admin/responses` → `/.netlify/functions/admin-responses`
   - `/api/admin/stats` → `/.netlify/functions/admin-stats`

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers a new deployment
- Netlify automatically builds and deploys your changes
- You can preview deployments from pull requests

## Monitoring

In Netlify dashboard you can:
- View deployment history
- Check function logs
- Monitor bandwidth usage
- See analytics

Your AI Readiness Survey is now live and ready to collect responses! 🎉

