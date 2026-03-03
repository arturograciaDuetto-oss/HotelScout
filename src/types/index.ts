// ── Core Company Data ─────────────────────────────────────────────────────────

export interface Company {
  name: string;
  website: string;
  headquarters: string;
  summary: string;
}

export interface Portfolio {
  totalHotels: number | string;
  totalRooms: number | string;
  brands: string[];
  countries: string[];
  segments: string[];
}

export interface DuettoAlignment {
  valueProposition: string;
  alignment: string;
}

// ── Tech Stack ────────────────────────────────────────────────────────────────

export interface TechStack {
  pms: string;
  crs: string;
  rms: string;
  otherTools: string[];
  techMaturity: 'Legacy' | 'Transitioning' | 'Modern';
  rmsCompetitorBattlecard: string | null;
  notes: string;
}

// ── Financials ────────────────────────────────────────────────────────────────

export interface Financials {
  isPublic: boolean;
  ticker?: string;
  stockPrice?: string;
  exchange?: string;
  earningsSummary?: string;
  earningsLink?: string;
  revenueRange?: string;
}

// ── Buying Signals ────────────────────────────────────────────────────────────

export type BuyingSignalType =
  | 'M&A'
  | 'Leadership Change'
  | 'Funding'
  | 'Expansion'
  | 'Technology'
  | 'Other';

export interface BuyingSignal {
  id: string;
  type: BuyingSignalType;
  description: string;
  date?: string;
  sourceUrl?: string;
  significance: 'High' | 'Medium' | 'Low';
}

// ── Stakeholders ──────────────────────────────────────────────────────────────

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  location?: string;
  tenure?: string;
  linkedinUrl?: string;
  email?: string;
  relevanceNote: string;
  isManuallyAdded?: boolean;
  isDeparted?: boolean;
}

// ── Content & Hooks ───────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  publishedDate?: string;
  source: string;
}

export interface MediaItem {
  id: string;
  type: 'Podcast' | 'YouTube';
  title: string;
  guestName?: string;
  description: string;
  url: string;
  platform: string;
  date?: string;
}

export interface SocialPost {
  id: string;
  platform: 'LinkedIn' | 'X' | 'Instagram';
  content: string;
  url: string;
  date?: string;
  engagement?: string;
}

// ── Document Analysis ─────────────────────────────────────────────────────────

export interface KPIExtract {
  name: string;
  value: string;
  segment?: string;
  period?: string;
  type: 'revenue' | 'occupancy' | 'profitability' | 'other';
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'excel' | 'csv' | 'other';
  documentType: 'market-report' | 'hotstats' | 'other';
  uploadedAt: string;
  kpis: KPIExtract[];
  trends: string[];
  executiveSummary: string;
  duettoAngle: string;
}

// ── Persona Modal ─────────────────────────────────────────────────────────────

export interface PersonaAnalysis {
  professionalSummary: string;
  recentActivity: string;
  duettoReasons: string[];
}

export interface HypothesisChallenge {
  id: string;
  challenge: string;
  duettoSolution: string;
  conversationStarter: string;
}

export interface PersonaHypotheses {
  challenges: HypothesisChallenge[];
  generalConversationStarters: string[];
}

export type PitchFocus = 'Profitability' | 'Open Pricing' | 'Automation' | 'Integration';

export interface PersonaPitch {
  subject: string;
  body: string;
}

// ── Root HotelData ────────────────────────────────────────────────────────────

export interface HotelData {
  id: string;
  query: string;
  generatedAt: string;
  usedWebSearch: boolean;
  company: Company;
  portfolio: Portfolio;
  duettoAlignment: DuettoAlignment[];
  techStack: TechStack;
  financials: Financials;
  buyingSignals: BuyingSignal[];
  stakeholders: Stakeholder[];
  news: NewsItem[];
  media: MediaItem[];
  socialPosts: SocialPost[];
  documents: DocumentAnalysis[];
  notes: string;
  savedAt?: string;
}
