export const industryOptions = [
  'Technology/Software',
  'Healthcare/Life Sciences',
  'Manufacturing',
  'Retail/E-commerce',
  'Professional Services (Consulting, Legal, Accounting)',
  'Financial Services',
  'Education',
  'Non-profit',
  'Construction/Real Estate',
  'Hospitality/Tourism',
  'Transportation/Logistics',
  'Media/Entertainment',
  'Agriculture',
  'Energy/Utilities',
  'Government/Public Sector',
  'Other',
];

export const companySizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
];

export const revenueOptions = [
  'Under $1M',
  '$1M - $5M',
  '$5M - $25M',
  '$25M - $100M',
  'Over $100M',
  'Prefer not to say',
];

export interface CompanyInfo {
  industry: string;
  companySize: string;
  annualRevenue?: string;
}

