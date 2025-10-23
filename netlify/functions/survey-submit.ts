import { Handler } from '@netlify/functions';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, integer, timestamp, jsonb, serial, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define schemas inline for the function
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

const questions = pgTable('questions', {
  id: text('id').primaryKey(),
  dimension: text('dimension').notNull(),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull(),
  weight: integer('weight').notNull(),
  isOptional: boolean('is_optional').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

const questionResponses = pgTable('question_responses', {
  id: serial('id').primaryKey(),
  surveyResponseId: integer('survey_response_id').notNull(),
  questionId: text('question_id').notNull(),
  answerValue: integer('answer_value'),
  answerText: text('answer_text'),
  createdAt: timestamp('created_at').defaultNow(),
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
    const db = drizzle(client, { schema: { surveyResponses, questionResponses } });

    // Insert main survey response
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

    // Insert individual question responses
    const questionResponsesData = [];
    
    // Handle rating questions (q1-q15)
    for (const [questionId, answerValue] of Object.entries(responses)) {
      if (questionId.match(/^q\d+$/)) {
        questionResponsesData.push({
          surveyResponseId: result.id,
          questionId: questionId,
          answerValue: typeof answerValue === 'number' ? answerValue : null,
          answerText: typeof answerValue === 'string' ? answerValue : null,
        });
      }
    }

    // Insert all question responses in batch
    if (questionResponsesData.length > 0) {
      await db.insert(questionResponses).values(questionResponsesData);
    }

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
