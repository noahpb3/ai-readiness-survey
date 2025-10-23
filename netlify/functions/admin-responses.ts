
Published
netlify
/
functions
/
admin-responses.ts
1234567
Text file: admin-responses.tsLatest content with line numbers:46    try {47      const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.bmsyrncxiohcqwvjzbea:oIMziLaMpIgojNDK@aws-1-us-east-1.pooler.supabase.com:5432/postgres';48      const client = postgres(connectionString);49      const db = drizzle(client, { schema: { surveyResponses } });50  

admin-responses-NEW.ts
import { Handler } from '@netlify/functions';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, integer, timestamp, jsonb, serial } from 'drizzle-orm/pg-core';
import { desc } from 'drizzle-orm';

// Define schema inline for the function
const surveyResponses = pgTable('survey_responses', {
  id: serial('id').primaryKey(),
  industry: text('industry').notNull(),
  companySize: text('company_size').notNull(),
  annualRevenue: text('annual_revenue'),
  responses: jsonb('responses').notNull(),
  overallScore: integer('overall_score').notNull(),
  maturityLevel: text('maturity_level').notNull(),
  strategyScore: integer('strategy_score').notNull(),
  dataScore: integer('data_score').notNull(),
  peopleScore: integer('people_score').notNull(),
  governanceScore: integer('governance_score').notNull(),
  executionScore: integer('execution_score').notNull(),
  biggestOpportunity: text('biggest_opportunity'),
  biggestObstacle: text('biggest_obstacle'),
  mostReadyDepartment: text('most_ready_department'),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
