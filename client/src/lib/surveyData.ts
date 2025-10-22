export interface Question {
  id: string;
  dimension: string;
  text: string;
  type: 'rating' | 'multiple-choice' | 'multiple-select' | 'text';
  options?: string[];
  weight: number;
  optional?: boolean;
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
  weight: number;
  icon: string;
}

export const dimensions: Dimension[] = [
  {
    id: 'strategy',
    name: 'Strategy & Vision',
    description: 'Clear direction and leadership commitment to AI',
    weight: 0.20,
    icon: '🧭'
  },
  {
    id: 'data',
    name: 'Data & Systems',
    description: 'Integrated platforms and accessible data',
    weight: 0.25,
    icon: '💾'
  },
  {
    id: 'people',
    name: 'People & Skills',
    description: 'Team readiness and learning culture',
    weight: 0.20,
    icon: '👥'
  },
  {
    id: 'governance',
    name: 'Governance & Ethics',
    description: 'Responsible AI use and oversight',
    weight: 0.15,
    icon: '🛡️'
  },
  {
    id: 'execution',
    name: 'Execution & Impact',
    description: 'Proven results and continuous improvement',
    weight: 0.20,
    icon: '🚀'
  }
];

export const questions: Question[] = [
  // Strategy & Vision (3 questions)
  {
    id: 'q1',
    dimension: 'strategy',
    text: 'AI is explicitly mentioned in our strategic plan, OKRs, or leadership goals.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q2',
    dimension: 'strategy',
    text: 'We\'ve identified clear business outcomes that AI should achieve (efficiency, growth, innovation).',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q3',
    dimension: 'strategy',
    text: 'Our leaders communicate a consistent AI narrative internally and externally.',
    type: 'rating',
    weight: 1
  },
  
  // Data & Systems (3 questions)
  {
    id: 'q4',
    dimension: 'data',
    text: 'Our key business systems (CRM, accounting, marketing tools) share data or can talk to each other.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q5',
    dimension: 'data',
    text: 'Our data is accurate, structured, and accessible for decision-making.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q6',
    dimension: 'data',
    text: 'We use modern cloud tools (Google Workspace, Microsoft 365, Salesforce, etc.) that have built-in automation or AI features.',
    type: 'rating',
    weight: 1
  },
  
  // People & Skills (3 questions)
  {
    id: 'q7',
    dimension: 'people',
    text: 'Employees are encouraged to experiment with AI tools in their day-to-day work.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q8',
    dimension: 'people',
    text: 'We provide AI training or internal learning resources.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q9',
    dimension: 'people',
    text: 'We have an AI champion or task force that drives exploration and adoption.',
    type: 'rating',
    weight: 1
  },
  
  // Governance & Ethics (3 questions)
  {
    id: 'q10',
    dimension: 'governance',
    text: 'We have policies or guidelines for responsible AI use.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q11',
    dimension: 'governance',
    text: 'We check AI outputs for accuracy and fairness before using them in important decisions.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q12',
    dimension: 'governance',
    text: 'We maintain transparency about how AI affects our customers and team.',
    type: 'rating',
    weight: 1
  },
  
  // Execution & Impact (3 questions)
  {
    id: 'q13',
    dimension: 'execution',
    text: 'We\'ve launched one or more AI pilot projects that delivered measurable results.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q14',
    dimension: 'execution',
    text: 'We track ROI or performance metrics for AI initiatives.',
    type: 'rating',
    weight: 1
  },
  {
    id: 'q15',
    dimension: 'execution',
    text: 'AI is embedded into ongoing improvement or innovation processes.',
    type: 'rating',
    weight: 1
  },
  
  // Optional Open-Ended Questions
  {
    id: 'q16',
    dimension: 'reflection',
    text: 'What\'s your biggest opportunity for AI right now?',
    type: 'text',
    weight: 0,
    optional: true
  },
  {
    id: 'q17',
    dimension: 'reflection',
    text: 'What\'s your biggest obstacle or uncertainty around AI?',
    type: 'text',
    weight: 0,
    optional: true
  },
  {
    id: 'q18',
    dimension: 'reflection',
    text: 'Which department do you believe is most AI-ready?',
    type: 'multiple-choice',
    options: [
      'Marketing',
      'Operations',
      'Finance',
      'HR',
      'IT / Data',
      'Other'
    ],
    weight: 0,
    optional: true
  }
];

export interface MaturityLevel {
  level: number;
  name: string;
  range: [number, number];
  description: string;
  color: string;
}

export const maturityLevels: MaturityLevel[] = [
  {
    level: 1,
    name: 'Exploring',
    range: [0, 40],
    description: 'You\'re learning about AI\'s potential and beginning to explore opportunities',
    color: 'text-orange-600'
  },
  {
    level: 2,
    name: 'Experimenting',
    range: [41, 60],
    description: 'You\'re testing AI in specific areas and building foundational capabilities',
    color: 'text-yellow-600'
  },
  {
    level: 3,
    name: 'Scaling',
    range: [61, 80],
    description: 'AI is becoming part of your operations with proven results',
    color: 'text-blue-600'
  },
  {
    level: 4,
    name: 'Leading',
    range: [81, 100],
    description: 'AI drives competitive advantage and continuous innovation',
    color: 'text-green-600'
  }
];

