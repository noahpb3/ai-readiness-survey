# Database Setup for Deployment

## Issue Fixed
The "View Results" button was not working due to a data format mismatch between the frontend and backend. This has been **FIXED** in the latest code.

### What was fixed:
1. **Frontend (Survey.tsx)**: Now converts `dimensionScores` array to an object before sending to the API
2. **Backend (server/index.ts)**: 
   - Fixed to extract `maturityLevel.name` from the maturityLevel object
   - Fixed reflection field mapping (`reflections.readyDepartment` instead of `reflections.department`)
   - Added better error logging

## Database Setup Required for Production

The survey application is now fully functional and will show results correctly. However, to enable database persistence, you need to:

### 1. Create the Database Table

Run the SQL from `setup-database.sql` in your Supabase database:

```sql
-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  
  -- Company Information
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  annual_revenue TEXT,
  
  -- Survey Responses (all questions)
  responses JSONB NOT NULL,
  
  -- Calculated Scores
  overall_score INTEGER NOT NULL,
  maturity_level TEXT NOT NULL,
  
  -- Dimension Scores
  strategy_score INTEGER NOT NULL,
  data_score INTEGER NOT NULL,
  people_score INTEGER NOT NULL,
  governance_score INTEGER NOT NULL,
  execution_score INTEGER NOT NULL,
  
  -- Reflections
  biggest_opportunity TEXT,
  biggest_obstacle TEXT,
  most_ready_department TEXT,
  
  -- Metadata
  completed_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_industry ON survey_responses(industry);
CREATE INDEX IF NOT EXISTS idx_company_size ON survey_responses(company_size);
CREATE INDEX IF NOT EXISTS idx_completed_at ON survey_responses(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_overall_score ON survey_responses(overall_score DESC);
```

### 2. Set Environment Variable

Make sure your deployment has the `DATABASE_URL` environment variable set:

```
DATABASE_URL=postgresql://postgres:oIMziLaMpIgojNDK@db.bmsyrncxiohcqwvjzbea.supabase.co:5432/postgres
```

### 3. Deploy Both Frontend and Backend

The application requires both:
- **Frontend**: Vite dev server (port 3000) - serves the React app
- **Backend**: Express server (port 3001) - handles API requests and database operations

For Netlify deployment:
- Frontend is deployed as a static site
- Backend needs to be deployed separately (consider Netlify Functions, Vercel, or Railway)
- Update the API endpoint in the frontend code if backend is on a different domain

## Testing Database Connection

Once deployed, test the database connection by:

1. Complete a survey
2. Check the browser console for "Survey saved successfully" message
3. Query the database to verify the record was inserted:

```sql
SELECT * FROM survey_responses ORDER BY completed_at DESC LIMIT 1;
```

## Current Status

✅ **Survey flow is working** - users can complete the survey and view results  
✅ **Results page displays correctly** - all scores, dimensions, and recommendations shown  
✅ **Data format issues fixed** - frontend and backend now communicate properly  
⚠️ **Database persistence** - requires table creation in Supabase (SQL provided above)

The application will continue to work and show results even if database save fails, ensuring a good user experience.

