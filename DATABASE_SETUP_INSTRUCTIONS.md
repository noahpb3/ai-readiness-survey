# AI Readiness Survey - Database Setup Instructions

## Overview
The survey now includes:
- **Company Information Collection**: Industry, Company Size, Annual Revenue (optional)
- **Database Storage**: All responses saved to Supabase
- **Admin Dashboard**: View and analyze all submissions

## Step 1: Create Database Table

Run the SQL in `setup-database.sql` in your Supabase SQL Editor:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the contents of `setup-database.sql`
6. Click "Run"

This creates the `survey_responses` table with all necessary fields and indexes.

## Step 2: Test Locally

### Start Both Servers:

Terminal 1 - Frontend:
```bash
cd /home/ubuntu/ai-readiness-survey
pnpm dev
```

Terminal 2 - Backend API:
```bash
cd /home/ubuntu/ai-readiness-survey
pnpm dev:server
```

### Access the App:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Step 3: Complete a Test Survey

1. Go to http://localhost:3000
2. Click "Start Assessment"
3. Fill in company information (Industry & Company Size required)
4. Complete the 15 assessment questions + 3 reflections
5. View results page

## Step 4: Verify Database Storage

Check your Supabase dashboard:
1. Go to "Table Editor"
2. Select `survey_responses` table
3. You should see your test submission

## Step 5: View Admin Dashboard

Access `/admin` to see all survey responses:
- Total responses count
- Average AI readiness score
- Individual submission details
- Export to CSV functionality

## Company Information Collected

### Required Fields:
- **Industry/Sector** (16 options including "Other")
- **Company Size** (5 employee range options)

### Optional Field:
- **Annual Revenue** (6 revenue ranges + "Prefer not to say")

## Data Stored Per Submission

- Company info (industry, size, revenue)
- All 15 question responses
- 3 reflection answers (opportunity, obstacle, ready department)
- Overall AI readiness score (0-100)
- Maturity level (Exploring, Experimenting, Scaling, Leading)
- Individual dimension scores (Strategy, Data, People, Governance, Execution)
- Completion timestamp

## Analytics Capabilities

With this data, you can analyze:
- Average scores by industry
- AI readiness by company size
- Common obstacles and opportunities
- Trends over time
- Most/least ready departments

## Deployment Notes

When deploying to production:
1. DATABASE_URL environment variable is already configured
2. Both frontend and backend will deploy together
3. API endpoints will work automatically
4. Admin dashboard accessible at `/admin`

## Security Considerations

- No personally identifiable information is collected
- All responses are confidential
- Company info is aggregated for analysis only
- Consider adding authentication to `/admin` route for production

