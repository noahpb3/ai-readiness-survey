import { pgTable, text, integer, timestamp, jsonb, serial } from 'drizzle-orm/pg-core';

export const surveyResponses = pgTable('survey_responses', {
  id: serial('id').primaryKey(),
  
  // Company Information
  industry: text('industry').notNull(),
  companySize: text('company_size').notNull(),
  annualRevenue: text('annual_revenue'),
  
  // Survey Responses (all 15 questions + 3 reflections)
  responses: jsonb('responses').notNull(),
  
  // Calculated Scores
  overallScore: integer('overall_score').notNull(),
  maturityLevel: text('maturity_level').notNull(),
  
  // Dimension Scores
  strategyScore: integer('strategy_score').notNull(),
  dataScore: integer('data_score').notNull(),
  peopleScore: integer('people_score').notNull(),
  governanceScore: integer('governance_score').notNull(),
  executionScore: integer('execution_score').notNull(),
  
  // Reflections
  biggestOpportunity: text('biggest_opportunity'),
  biggestObstacle: text('biggest_obstacle'),
  mostReadyDepartment: text('most_ready_department'),
  
  // Metadata
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type NewSurveyResponse = typeof surveyResponses.$inferInsert;

