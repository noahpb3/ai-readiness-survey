import express from 'express';
import cors from 'cors';
import { db } from './db';
import { surveyResponses } from './db/schema';
import { desc, sql } from 'drizzle-orm';

const app = express();
const PORT = 3001; // Fixed port for backend server

app.use(cors());
app.use(express.json());

// Save survey response
app.post('/api/survey/submit', async (req, res) => {
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
    } = req.body;

    const [result] = await db.insert(surveyResponses).values({
      industry,
      companySize,
      annualRevenue,
      responses,
      overallScore,
      maturityLevel: maturityLevel.name, // Extract name from maturityLevel object
      strategyScore: dimensionScores.strategy,
      dataScore: dimensionScores.data,
      peopleScore: dimensionScores.people,
      governanceScore: dimensionScores.governance,
      executionScore: dimensionScores.execution,
      biggestOpportunity: reflections?.opportunity,
      biggestObstacle: reflections?.obstacle,
      mostReadyDepartment: reflections?.readyDepartment, // Fixed: was .department, should be .readyDepartment
    }).returning();

    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error saving survey response:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save survey response',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Get all responses (for admin)
app.get('/api/admin/responses', async (req, res) => {
  try {
    const responses = await db.select().from(surveyResponses).orderBy(desc(surveyResponses.completedAt));
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get analytics/stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = await db.select({
      totalResponses: sql<number>`count(*)::int`,
      avgScore: sql<number>`round(avg(${surveyResponses.overallScore}))::int`,
    }).from(surveyResponses);

    res.json(stats[0] || { totalResponses: 0, avgScore: 0 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

