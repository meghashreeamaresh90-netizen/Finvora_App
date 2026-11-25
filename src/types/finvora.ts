export type LanguageCode = 'en' | 'kn' | 'te' | 'hi' | 'mr' | 'ta';

export type LearnCategoryId =
  | 'savings'
  | 'budgeting'
  | 'banking'
  | 'loans'
  | 'insurance'
  | 'digital-payments';

export interface Lesson {
  id: string;
  categoryId: LearnCategoryId;
  title: string;
  summary: string;
  duration: string;
  steps: string[];
  keyTip: string;
  isCustom?: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  saved: number;
  deadline: string;
  icon: string;
}

export type SchemeCategoryTag =
  | 'Farmers'
  | 'Women'
  | 'SC/ST/OBC'
  | 'Senior Citizens';

export interface GovtScheme {
  id: string;
  name: string;
  shortName: string;
  benefitBadge: string;
  tags: SchemeCategoryTag[];
  summary: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  howToApply: string;
  minAge: number;
  maxAge: number;
  eligibleOccupations: string[];
  eligibleCategories: string[];
  womenFocused?: boolean;
}

export interface ScamReport {
  id: string;
  message: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  reasons: string[];
  advice: string;
  reportedBy: string;
  location: string;
  date: string;
  status: 'Pending' | 'Resolved';
}

export interface BankLocation {
  id: string;
  name: string;
  type: 'Bank' | 'ATM' | 'Post Office';
  address: string;
  distance: string;
  timings: string;
  phone: string;
  services: string[];
  mapsQuery: string;
}

export interface Reminder {
  id: string;
  title: string;
  dueText: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
