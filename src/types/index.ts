// ── Company Research ─────────────────────────────────────────────────────────

export interface CompanyOverview {
  name: string;
  description: string;
  headquarters: string;
  foundedYear: string;
  propertyCount: string;
  segments: string[];
  geographicFootprint: string;
  marketPosition: string;
  recentDevelopments: string;
}

export interface FinancialMetrics {
  estimatedRevenue: string;
  recentNews: string;
  growthTrajectory: string;
  keyMetrics: string[];
}

export interface TechStack {
  rms: string;
  pms: string;
  crs: string;
  channelManager: string;
  otherTools: string[];
  techMaturity: 'Legacy' | 'Transitioning' | 'Modern';
  notes: string;
}

export interface IndustryContext {
  keyTrends: string[];
  competitiveSet: string[];
  macroFactors: string[];
}

export interface CompanyResearch {
  overview: CompanyOverview;
  financials: FinancialMetrics;
  techStack: TechStack;
  industryContext: IndustryContext;
}

// ── Stakeholders ──────────────────────────────────────────────────────────────

export type BuyerType = 'Champion' | 'Decision Maker' | 'Influencer' | 'Gatekeeper';

export interface Stakeholder {
  name: string;
  title: string;
  department: string;
  tenure: string;
  linkedinUrl: string;
  emailFormat: string;
  bio: string;
  publicStatements: string;
  buyerType: BuyerType;
  painPoints: string[];
}

// ── News & Content ────────────────────────────────────────────────────────────

export type ContentType = 'Press Release' | 'Podcast' | 'YouTube' | 'LinkedIn' | 'Conference' | 'News Article';

export interface NewsItem {
  title: string;
  type: ContentType;
  date: string;
  summary: string;
  outreachHook: string;
  source: string;
}

// ── Actionable Output ─────────────────────────────────────────────────────────

export interface BuyerPersona {
  title: string;
  profile: string;
  painPoints: string[];
  motivations: string[];
  objections: string[];
  messagingAngle: string;
}

export interface ColdEmail {
  subject: string;
  body: string;
  callToAction: string;
}

export interface ActionableOutput {
  strategicHypotheses: string[];
  buyerPersonas: BuyerPersona[];
  coldEmail: ColdEmail;
  linkedinMessage: string;
  callOpening: string;
}

// ── Document Analysis ─────────────────────────────────────────────────────────

export interface DocumentAnalysis {
  fileName: string;
  fileType: string;
  kpis: string[];
  trends: string[];
  insights: string[];
  duettoAngle: string;
  uploadedAt: Date;
}

// ── Dossier ───────────────────────────────────────────────────────────────────

export interface Dossier {
  query: string;
  generatedAt: Date;
  company: CompanyResearch | null;
  stakeholders: Stakeholder[] | null;
  newsContent: NewsItem[] | null;
  documents: DocumentAnalysis[];
  actionable: ActionableOutput | null;
  loading: {
    company: boolean;
    stakeholders: boolean;
    newsContent: boolean;
    actionable: boolean;
  };
  error: {
    company: string | null;
    stakeholders: string | null;
    newsContent: string | null;
    actionable: string | null;
  };
}
