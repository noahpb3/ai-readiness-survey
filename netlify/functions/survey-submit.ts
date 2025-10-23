import { Handler } from '@netlify/functions';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, integer, timestamp, jsonb, serial } from 'drizzle-orm/pg-core';

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
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const {
      industry,
      companySize,
      annualRevenue,
      responses,
      overallScore,
      maturityLevel,
      dimensionScores,
      reflections,
    } = JSON.parse(event.body || '{}');

    // Connect to database
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.bmsyrncxiohcqwvjzbea:oIMziLaMpIgojNDK@aws-1-us-east-1.pooler.supabase.com:5432/postgres';
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { surveyResponses } });

    // Insert survey response
    const [result] = await db.insert(surveyResponses).values({
      industry,
      companySize,
      annualRevenue,
      responses,
      overallScore,
      maturityLevel: maturityLevel.name,
      strategyScore: dimensionScores.strategy,
      dataScore: dimensionScores.data,
      peopleScore: dimensionScores.people,
      governanceScore: dimensionScores.governance,
      executionScore: dimensionScores.execution,
      biggestOpportunity: reflections?.opportunity,
      biggestObstacle: reflections?.obstacle,
      mostReadyDepartment: reflections?.readyDepartment,
    }).returning();

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id: result.id }),
    };
  } catch (error) {
    console.error('Error saving survey response:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to save survey response',
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
