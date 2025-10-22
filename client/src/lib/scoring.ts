import { dimensions, maturityLevels, questions, type Dimension, type MaturityLevel } from './surveyData';

export interface SurveyResponse {
  [questionId: string]: number | number[] | string;
}

export interface DimensionScore {
  dimension: Dimension;
  score: number;
  maturityLevel: MaturityLevel;
}

export interface SurveyResult {
  overallScore: number;
  maturityLevel: MaturityLevel;
  dimensionScores: DimensionScore[];
  completedAt: Date;
  reflections?: {
    opportunity?: string;
    obstacle?: string;
    readyDepartment?: string;
  };
}

/**
 * Calculate score for a single question response
 */
function calculateQuestionScore(questionId: string, response: number | number[] | string): number {
  const question = questions.find(q => q.id === questionId);
  if (!question || question.optional) return 0;

  if (question.type === 'rating') {
    // Rating questions are 1-5, convert to 0-100
    return ((response as number) - 1) * 25;
  } else if (question.type === 'multiple-choice') {
    // Multiple choice options are indexed 0-N, convert to 0-100
    const optionCount = question.options!.length;
    return ((response as number) / (optionCount - 1)) * 100;
  }
  
  return 0;
}

/**
 * Calculate score for a specific dimension
 */
function calculateDimensionScore(dimensionId: string, responses: SurveyResponse): number {
  const dimensionQuestions = questions.filter(q => q.dimension === dimensionId && !q.optional);
  
  if (dimensionQuestions.length === 0) return 0;
  
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const question of dimensionQuestions) {
    const response = responses[question.id];
    if (response !== undefined && response !== '') {
      totalScore += calculateQuestionScore(question.id, response) * question.weight;
      totalWeight += question.weight;
    }
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

/**
 * Determine maturity level based on score
 */
function getMaturityLevel(score: number): MaturityLevel {
  return maturityLevels.find(
    level => score >= level.range[0] && score <= level.range[1]
  ) || maturityLevels[0];
}

/**
 * Calculate overall survey results
 */
export function calculateResults(responses: SurveyResponse): SurveyResult {
  // Calculate dimension scores (excluding reflection)
  const scoredDimensions = dimensions.filter(d => d.id !== 'reflection');
  const dimensionScores: DimensionScore[] = scoredDimensions.map(dimension => {
    const score = calculateDimensionScore(dimension.id, responses);
    return {
      dimension,
      score: Math.round(score),
      maturityLevel: getMaturityLevel(score)
    };
  });
  
  // Calculate weighted overall score
  let overallScore = 0;
  for (const dimScore of dimensionScores) {
    overallScore += dimScore.score * dimScore.dimension.weight;
  }
  overallScore = Math.round(overallScore);
  
  // Extract reflections
  const reflections = {
    opportunity: responses.q16 as string,
    obstacle: responses.q17 as string,
    readyDepartment: responses.q18 !== undefined 
      ? questions.find(q => q.id === 'q18')?.options?.[responses.q18 as number]
      : undefined
  };
  
  return {
    overallScore,
    maturityLevel: getMaturityLevel(overallScore),
    dimensionScores,
    completedAt: new Date(),
    reflections
  };
}

/**
 * Generate recommendations based on results
 */
export interface Recommendation {
  dimension: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions: string[];
}

export function generateRecommendations(result: SurveyResult): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Sort dimensions by score (lowest first) to prioritize improvements
  const sortedDimensions = [...result.dimensionScores].sort((a, b) => a.score - b.score);
  
  for (let i = 0; i < sortedDimensions.length; i++) {
    const dimScore = sortedDimensions[i];
    const priority = i < 2 ? 'high' : i < 4 ? 'medium' : 'low';
    
    const rec = getRecommendationForDimension(dimScore, priority);
    if (rec) recommendations.push(rec);
  }
  
  return recommendations;
}

function getRecommendationForDimension(
  dimScore: DimensionScore,
  priority: 'high' | 'medium' | 'low'
): Recommendation | null {
  const { dimension, score, maturityLevel } = dimScore;
  
  const recommendations: Record<string, Record<string, { title: string; description: string; actions: string[] }>> = {
    strategy: {
      'Exploring': {
        title: 'Define Your AI Vision',
        description: 'Start by clarifying what AI means for your business and setting clear goals.',
        actions: [
          'Schedule a leadership workshop to discuss AI opportunities',
          'Identify 1-2 specific business problems AI could solve',
          'Add AI exploration to your strategic planning documents',
          'Assign an executive sponsor to champion AI initiatives'
        ]
      },
      'Experimenting': {
        title: 'Strengthen Strategic Alignment',
        description: 'Build on your emerging AI strategy with clearer goals and communication.',
        actions: [
          'Create measurable AI objectives tied to business outcomes',
          'Develop a simple AI roadmap for the next 12 months',
          'Communicate AI wins and learnings to the entire team',
          'Allocate dedicated budget for AI experimentation'
        ]
      },
      'Scaling': {
        title: 'Integrate AI into Core Strategy',
        description: 'Make AI a central part of your competitive advantage and growth plans.',
        actions: [
          'Include AI metrics in quarterly business reviews',
          'Expand AI initiatives across multiple departments',
          'Share your AI journey externally (blog, case studies)',
          'Build partnerships with AI vendors or consultants'
        ]
      },
      'Leading': {
        title: 'Drive Industry Leadership',
        description: 'Leverage your AI maturity to innovate and influence your market.',
        actions: [
          'Explore cutting-edge AI applications in your industry',
          'Share best practices at conferences or industry events',
          'Mentor other SMBs on their AI journey',
          'Continuously refine strategy based on emerging trends'
        ]
      }
    },
    data: {
      'Exploring': {
        title: 'Build Data Foundations',
        description: 'Start organizing and connecting your business systems to unlock AI potential.',
        actions: [
          'Audit your current systems and data quality',
          'Prioritize integrating your most critical tools (CRM + accounting)',
          'Move to cloud-based tools if still using legacy software',
          'Establish basic data hygiene practices (regular cleanup, validation)'
        ]
      },
      'Experimenting': {
        title: 'Improve Data Accessibility',
        description: 'Make your data more usable and reliable for AI applications.',
        actions: [
          'Implement automated data syncing between key systems',
          'Create dashboards to visualize important business metrics',
          'Document where critical data lives and who owns it',
          'Explore low-code integration tools (Zapier, Make, etc.)'
        ]
      },
      'Scaling': {
        title: 'Optimize Data Infrastructure',
        description: 'Build a robust data platform that supports advanced AI use cases.',
        actions: [
          'Consider a data warehouse for centralized analytics',
          'Implement real-time data pipelines for critical workflows',
          'Establish data quality monitoring and alerts',
          'Enable self-service analytics for team members'
        ]
      },
      'Leading': {
        title: 'Achieve Data Excellence',
        description: 'Maintain world-class data practices that enable continuous AI innovation.',
        actions: [
          'Implement advanced analytics and predictive modeling',
          'Create a data culture with training and best practices',
          'Explore AI-powered data quality and governance tools',
          'Share data insights across the organization in real-time'
        ]
      }
    },
    people: {
      'Exploring': {
        title: 'Build AI Awareness',
        description: 'Help your team understand AI\'s potential and start experimenting safely.',
        actions: [
          'Host lunch-and-learns about AI tools relevant to your business',
          'Give employees access to AI tools (ChatGPT, Copilot, etc.)',
          'Create a Slack/Teams channel for sharing AI tips and wins',
          'Identify 1-2 AI champions who are excited to explore'
        ]
      },
      'Experimenting': {
        title: 'Develop AI Skills',
        description: 'Invest in training and create a culture of AI experimentation.',
        actions: [
          'Provide AI training courses or certifications',
          'Set aside time for employees to experiment with AI',
          'Recognize and reward creative AI use cases',
          'Form an AI task force with representatives from each department'
        ]
      },
      'Scaling': {
        title: 'Scale AI Capabilities',
        description: 'Expand AI expertise across the organization to support multiple initiatives.',
        actions: [
          'Hire or upskill for specialized AI roles (data analyst, AI coordinator)',
          'Create internal AI playbooks and documentation',
          'Integrate AI skills into job descriptions and performance reviews',
          'Establish mentorship programs for AI skill development'
        ]
      },
      'Leading': {
        title: 'Foster AI Innovation Culture',
        description: 'Make continuous AI learning and innovation part of your company DNA.',
        actions: [
          'Become known as an AI-forward employer to attract talent',
          'Host internal AI hackathons or innovation challenges',
          'Contribute to AI communities and open source projects',
          'Create career paths for AI and data roles'
        ]
      }
    },
    governance: {
      'Exploring': {
        title: 'Establish AI Guidelines',
        description: 'Create basic policies to ensure responsible and safe AI use.',
        actions: [
          'Draft simple AI usage guidelines (what\'s okay, what\'s not)',
          'Educate team on AI risks (data privacy, accuracy, bias)',
          'Require human review of AI-generated content before customer use',
          'Document which AI tools are approved for business use'
        ]
      },
      'Experimenting': {
        title: 'Formalize AI Governance',
        description: 'Develop structured processes for responsible AI deployment.',
        actions: [
          'Create an AI review checklist for new initiatives',
          'Establish data privacy protocols for AI tools',
          'Implement version control and documentation for AI workflows',
          'Conduct regular audits of AI tool usage and outputs'
        ]
      },
      'Scaling': {
        title: 'Mature Governance Practices',
        description: 'Scale governance to support multiple AI systems in production.',
        actions: [
          'Implement automated compliance checks where possible',
          'Create an AI ethics committee or review board',
          'Develop incident response procedures for AI failures',
          'Maintain transparency reports on AI use for stakeholders'
        ]
      },
      'Leading': {
        title: 'Lead Responsible AI',
        description: 'Demonstrate industry leadership in AI ethics and governance.',
        actions: [
          'Publish your AI principles and governance framework publicly',
          'Participate in industry AI ethics and standards groups',
          'Implement explainable AI practices for customer-facing systems',
          'Continuously update governance based on emerging regulations'
        ]
      }
    },
    execution: {
      'Exploring': {
        title: 'Launch Your First AI Project',
        description: 'Start small with a focused pilot that can deliver quick wins.',
        actions: [
          'Choose a low-risk, high-value use case (e.g., email drafting, data entry)',
          'Set clear success metrics before starting',
          'Document the process and results for learning',
          'Celebrate and share the results with the team'
        ]
      },
      'Experimenting': {
        title: 'Expand AI Experimentation',
        description: 'Build on initial success with additional pilots and better measurement.',
        actions: [
          'Launch 2-3 pilots in different departments',
          'Develop a simple ROI framework for AI projects',
          'Create a repository of AI use cases and lessons learned',
          'Establish a regular cadence for reviewing AI initiatives'
        ]
      },
      'Scaling': {
        title: 'Scale Proven AI Solutions',
        description: 'Move successful pilots to production and expand across the organization.',
        actions: [
          'Standardize and automate successful AI workflows',
          'Integrate AI into core business processes',
          'Track and report AI impact in business reviews',
          'Build a pipeline of new AI opportunities to explore'
        ]
      },
      'Leading': {
        title: 'Drive Continuous AI Innovation',
        description: 'Maintain momentum with ongoing optimization and new applications.',
        actions: [
          'Continuously optimize existing AI systems for better results',
          'Explore emerging AI technologies and applications',
          'Share case studies and success stories externally',
          'Use AI insights to drive strategic business decisions'
        ]
      }
    }
  };
  
  const levelRecs = recommendations[dimension.id]?.[maturityLevel.name];
  if (!levelRecs) return null;
  
  return {
    dimension: dimension.name,
    priority,
    ...levelRecs
  };
}

