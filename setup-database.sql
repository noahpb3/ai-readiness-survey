-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  
  -- Company Information
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  annual_revenue TEXT,
  
  -- Survey Responses (all 15 questions + 3 reflections)
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
