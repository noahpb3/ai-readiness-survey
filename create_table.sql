CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  overall_score INTEGER NOT NULL,
  maturity_level TEXT NOT NULL,
  dimension_scores JSONB NOT NULL,
  responses JSONB NOT NULL,
  opportunity TEXT,
  obstacle TEXT,
  ready_department TEXT,
  company_name TEXT,
  contact_email TEXT,
  contact_name TEXT,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT
);
