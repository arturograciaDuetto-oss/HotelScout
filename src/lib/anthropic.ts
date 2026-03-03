import Anthropic from '@anthropic-ai/sdk';
import type { CompanyResearch, Stakeholder, NewsItem, ActionableOutput } from '../types';

function getClient(): Anthropic {
  const apiKey =
    localStorage.getItem('anthropic_api_key') || import.meta.env.VITE_ANTHROPIC_API_KEY;
  return new Anthropic({ apiKey: apiKey ?? '', dangerouslyAllowBrowser: true });
}

// Strips markdown code fences that Claude sometimes wraps JSON in
function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export async function generateCompanyResearch(query: string): Promise<CompanyResearch> {
  const client = getClient();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are a B2B sales intelligence analyst specializing in hospitality technology. Research "${query}" for a Duetto (Revenue Management System) sales representative.

Return ONLY valid JSON with this exact structure — no markdown, no commentary:
{
  "overview": {
    "name": "Official company name",
    "description": "2–3 sentence company description",
    "headquarters": "City, Country",
    "foundedYear": "Year or decade",
    "propertyCount": "Approximate number and type (e.g. '400+ full-service hotels')",
    "segments": ["Brand segment 1", "Brand segment 2"],
    "geographicFootprint": "Key regions of operation",
    "marketPosition": "Market positioning statement",
    "recentDevelopments": "Key recent strategic news (last 18 months)"
  },
  "financials": {
    "estimatedRevenue": "Estimated annual revenue range",
    "recentNews": "Recent financial news or M&A activity",
    "growthTrajectory": "Growth direction and context",
    "keyMetrics": ["Metric 1", "Metric 2", "Metric 3"]
  },
  "techStack": {
    "rms": "Current Revenue Management System if known, else 'Unknown'",
    "pms": "Property Management System if known, else 'Unknown'",
    "crs": "Central Reservation System if known, else 'Unknown'",
    "channelManager": "Channel management solution if known, else 'Unknown'",
    "otherTools": ["Tool 1", "Tool 2"],
    "techMaturity": "Legacy",
    "notes": "Context about tech approach or known digital transformation initiatives"
  },
  "industryContext": {
    "keyTrends": ["Trend 1", "Trend 2", "Trend 3"],
    "competitiveSet": ["Competitor 1", "Competitor 2", "Competitor 3"],
    "macroFactors": ["Macro factor 1", "Macro factor 2"]
  }
}

For techMaturity use exactly one of: "Legacy", "Transitioning", or "Modern".`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(extractJson(text)) as CompanyResearch;
}

export async function generateStakeholders(query: string): Promise<Stakeholder[]> {
  const client = getClient();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: `You are a B2B sales intelligence analyst. Identify key decision-makers and stakeholders at "${query}" who would be involved in a Revenue Management System (RMS) purchase for Duetto.

Return ONLY valid JSON — an array of stakeholder objects, no markdown:
[
  {
    "name": "Full name if known, or '[Title] at [Company]' if unknown",
    "title": "Current job title",
    "department": "Revenue Management",
    "tenure": "Estimated time in role",
    "linkedinUrl": "https://linkedin.com/in/likely-profile or https://linkedin.com/company/brand",
    "emailFormat": "firstname.lastname@company.com",
    "bio": "2-sentence professional background",
    "publicStatements": "Any known public quotes or positions on revenue strategy, or empty string",
    "buyerType": "Champion",
    "painPoints": ["Pain point 1", "Pain point 2"]
  }
]

Include 5–7 stakeholders across: CEO/President, Chief Commercial Officer or CRO, VP/Director Revenue Management, VP/Director Technology, VP/Director Sales & Marketing, CFO or Finance lead.
For buyerType use exactly one of: "Champion", "Decision Maker", "Influencer", "Gatekeeper".
Sort by most likely to champion an RMS purchase first.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(extractJson(text)) as Stakeholder[];
}

export async function generateNewsContent(query: string): Promise<NewsItem[]> {
  const client = getClient();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    messages: [
      {
        role: 'user',
        content: `You are a sales intelligence researcher. Find content and news about "${query}" that a Duetto (Revenue Management System) sales rep could use as personalized outreach hooks.

Return ONLY valid JSON — an array of items, no markdown:
[
  {
    "title": "Title of article, podcast episode, or content piece",
    "type": "News Article",
    "date": "Approximate date or year",
    "summary": "2–3 sentence summary",
    "outreachHook": "How a sales rep could reference this in outreach (one sentence starting with an action verb, e.g. 'Congratulate them on...' or 'Reference their CEO comment about...')",
    "source": "Publication, podcast name, or platform"
  }
]

Include 6–8 items covering: recent press releases, executive podcast/interview appearances, conference presentations, notable LinkedIn posts from leadership, strategic announcements.
For type use exactly one of: "Press Release", "Podcast", "YouTube", "LinkedIn", "Conference", "News Article".`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(extractJson(text)) as NewsItem[];
}

export async function generateActionableOutput(
  query: string,
  companyContext: string
): Promise<ActionableOutput> {
  const client = getClient();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    messages: [
      {
        role: 'user',
        content: `You are a senior enterprise sales strategist at Duetto, a Revenue Management System used by luxury and upscale hotels globally. Based on research about "${query}", generate actionable sales output.

Company context:
${companyContext}

Return ONLY valid JSON — no markdown:
{
  "strategicHypotheses": [
    "Hypothesis 1: Specific reason why they need Duetto NOW based on their current situation",
    "Hypothesis 2",
    "Hypothesis 3"
  ],
  "buyerPersonas": [
    {
      "title": "Job title",
      "profile": "2–3 sentence description of this person's world and priorities",
      "painPoints": ["Pain 1", "Pain 2", "Pain 3"],
      "motivations": ["Motivation 1", "Motivation 2"],
      "objections": ["Objection 1", "Objection 2"],
      "messagingAngle": "The one core message that resonates with this persona"
    }
  ],
  "coldEmail": {
    "subject": "Email subject line under 60 characters — personalized, not generic",
    "body": "Email body, 120 words max. Reference specific insights. Lead with their world, not your product. Conversational tone. No 'I hope this email finds you well'. End with a soft question.",
    "callToAction": "Specific CTA, e.g. '15 minutes to explore how we helped [similar brand] increase RevPAR by 12%?'"
  },
  "linkedinMessage": "LinkedIn connection request under 300 characters. Personalized, warm, not salesy.",
  "callOpening": "30-second call opening framework. Start with a specific insight about their business to earn the right to ask a discovery question."
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(extractJson(text)) as ActionableOutput;
}

export async function analyzeDocument(
  fileContent: string,
  fileName: string,
  hotelQuery: string
): Promise<{ kpis: string[]; trends: string[]; insights: string[]; duettoAngle: string }> {
  const client = getClient();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `You are a hospitality finance and revenue management analyst reviewing a document for a Duetto sales representative researching "${hotelQuery}".

Document: ${fileName}

Document content:
${fileContent.slice(0, 8000)}

Return ONLY valid JSON — no markdown:
{
  "kpis": ["KPI name: value and context"],
  "trends": ["Trend observation"],
  "insights": ["Strategic insight from the data"],
  "duettoAngle": "2–3 sentences on how Duetto's RMS would specifically address the challenges or opportunities shown in this data. Bridge top-line revenue with bottom-line profitability."
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return JSON.parse(extractJson(text));
}
