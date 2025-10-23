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

  try {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:oIMziLaMpIgojNDK@db.bmsyrncxiohcqwvjzbea.supabase.co:5432/postgres';
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { surveyResponses } });

    const responses = await db.select().from(surveyResponses).orderBy(desc(surveyResponses.completedAt));

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responses),
    };
  } catch (error) {
    console.error('Error fetching responses:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch responses' }),
    };
  }
};
