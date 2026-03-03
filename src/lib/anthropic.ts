import Anthropic from '@anthropic-ai/sdk';
import type {
  HotelData,
  Stakeholder,
  BuyingSignal,
  NewsItem,
  MediaItem,
  SocialPost,
  PersonaAnalysis,
  PersonaHypotheses,
  HypothesisChallenge,
  PersonaPitch,
  PitchFocus,
  DocumentAnalysis,
} from '../types';

// ── Client ────────────────────────────────────────────────────────────────────

function getClient(): Anthropic {
  const apiKey =
    localStorage.getItem('anthropic_api_key') || import.meta.env.VITE_ANTHROPIC_API_KEY;
  return new Anthropic({ apiKey: apiKey ?? '', dangerouslyAllowBrowser: true });
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = Math.min(
    text.indexOf('{') === -1 ? Infinity : text.indexOf('{'),
    text.indexOf('[') === -1 ? Infinity : text.indexOf('[')
  );
  const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  if (start !== Infinity && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

// ── Web-search helper ─────────────────────────────────────────────────────────

async function callWithSearch(
  client: Anthropic,
  prompt: string,
  maxTokens = 8000
): Promise<{ text: string; usedWebSearch: boolean }> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createFn = client.messages.create.bind(client.messages) as any;

    let response = await createFn({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
    });

    let loops = 0;
    while (response.stop_reason === 'tool_use' && loops < 6) {
      loops++;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toolUseBlocks = response.content.filter((b: any) => b.type === 'tool_use');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toolResults = toolUseBlocks.map((b: any) => ({
        type: 'tool_result' as const,
        tool_use_id: b.id as string,
        content: `Search for "${(b.input as { query?: string })?.query ?? ''}" executed.`,
      }));

      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResults });

      response = await createFn({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textBlock = response.content.find((b: any) => b.type === 'text');
    return { text: textBlock?.text ?? '', usedWebSearch: true };
  } catch {
    // Fallback: no web search
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = response.content.find(b => b.type === 'text');
    return { text: text?.type === 'text' ? text.text : '', usedWebSearch: false };
  }
}

// ── Main dossier generation ───────────────────────────────────────────────────

export async function generateDossier(query: string): Promise<HotelData> {
  const client = getClient();

  const prompt = `You are an elite B2B sales intelligence analyst for Duetto (a Revenue Management System provider). Research the hotel company or brand: "${query}".

Use web search to find real-time information. Prioritize: Skift, STR, Costar, Hotstats, company investor relations, LinkedIn, SEC/EDGAR.

Return ONLY valid JSON (no markdown, no text before/after) with this exact structure:

{
  "company": {
    "name": "Full brand name",
    "website": "https://official-website.com",
    "headquarters": "City, Country",
    "summary": "2-3 sentence company overview"
  },
  "portfolio": {
    "totalHotels": 250,
    "totalRooms": 65000,
    "brands": ["Brand A", "Brand B"],
    "countries": ["USA", "UK"],
    "segments": ["Luxury", "Upper Upscale"]
  },
  "duettoAlignment": [
    { "valueProposition": "Open Pricing", "alignment": "Specific reason this value prop fits this company" },
    { "valueProposition": "Automation", "alignment": "How automation helps this specific company" },
    { "valueProposition": "Analytics", "alignment": "Analytics opportunity" }
  ],
  "techStack": {
    "pms": "Oracle Opera or 'Unknown'",
    "crs": "OPERA Central or 'Unknown'",
    "rms": "IDeaS G3 or 'Unknown' — do NOT default to Duetto",
    "otherTools": ["Salesforce"],
    "techMaturity": "Legacy",
    "rmsCompetitorBattlecard": "If rms is a Duetto competitor (IDeaS, Atomize, Lighthouse, Pace, RevPAR Guru, etc.): 2-sentence competitive opportunity for Duetto. Otherwise null.",
    "notes": "Tech strategy context"
  },
  "financials": {
    "isPublic": true,
    "ticker": "MAR",
    "stockPrice": "$220.50",
    "exchange": "NASDAQ",
    "earningsSummary": "Latest earnings highlights",
    "earningsLink": "https://real-link-or-omit-field.com",
    "revenueRange": "$5B-$6B annually"
  },
  "buyingSignals": [
    {
      "id": "bs1",
      "type": "Leadership Change",
      "description": "Specific event and why it matters for Duetto",
      "date": "Q1 2024",
      "sourceUrl": "https://verified-source.com or omit field",
      "significance": "High"
    }
  ],
  "stakeholders": [
    {
      "id": "sk1",
      "name": "First Last",
      "title": "VP Revenue Management",
      "location": "New York, USA",
      "tenure": "~2 years",
      "linkedinUrl": "https://linkedin.com/in/exact-profile — ONLY if >90% confident",
      "email": "f.last@company.com — ONLY if from public source",
      "relevanceNote": "Why this person is a priority target for Duetto RMS",
      "isManuallyAdded": false,
      "isDeparted": false
    }
  ],
  "news": [
    {
      "id": "n1",
      "title": "Exact headline",
      "summary": "2-3 sentence summary",
      "sourceUrl": "https://actual-article-url.com — REQUIRED, omit item if no real URL",
      "publishedDate": "January 2024",
      "source": "Skift"
    }
  ],
  "media": [
    {
      "id": "md1",
      "type": "Podcast",
      "title": "Episode title",
      "guestName": "Guest Name",
      "description": "Episode description",
      "url": "https://actual-url.com — REQUIRED, omit item if no real URL",
      "platform": "Spotify",
      "date": "October 2023"
    }
  ],
  "socialPosts": [
    {
      "id": "sp1",
      "platform": "LinkedIn",
      "content": "Post description or excerpt",
      "url": "https://linkedin.com/company/... — REQUIRED, omit item if no real URL",
      "date": "December 2023",
      "engagement": "1.2K reactions"
    }
  ]
}

CRITICAL RULES:
1. news, media, socialPosts: ONLY include items with a real, verified URL. 2 real items > 6 guessed ones.
2. stakeholders.linkedinUrl: Only if >90% confident it is the correct profile.
3. stakeholders.email: Only if from a public source.
4. financials.earningsLink: Only if you have the real URL.
5. Include 5-7 stakeholders: CEO, CCO/CRO, VP Revenue Management, VP Technology, VP Sales & Marketing.
6. techMaturity: "Legacy", "Transitioning", or "Modern"
7. buyingSignals.type: "M&A", "Leadership Change", "Funding", "Expansion", "Technology", or "Other"
8. buyingSignals.significance: "High", "Medium", or "Low"`;

  const { text, usedWebSearch } = await callWithSearch(client, prompt, 8000);
  const parsed = JSON.parse(extractJson(text));

  const data: HotelData = {
    id: uid(),
    query,
    generatedAt: new Date().toISOString(),
    usedWebSearch,
    company: parsed.company,
    portfolio: parsed.portfolio,
    duettoAlignment: parsed.duettoAlignment ?? [],
    techStack: parsed.techStack,
    financials: parsed.financials ?? { isPublic: false },
    buyingSignals: (parsed.buyingSignals ?? []).map((s: Omit<BuyingSignal, 'id'> & { id?: string }) => ({
      ...s,
      id: s.id ?? uid(),
    })),
    stakeholders: (parsed.stakeholders ?? []).map((s: Omit<Stakeholder, 'id'> & { id?: string }) => ({
      ...s,
      id: s.id ?? uid(),
    })),
    news: (parsed.news ?? []).map((n: Omit<NewsItem, 'id'> & { id?: string }) => ({ ...n, id: n.id ?? uid() })),
    media: (parsed.media ?? []).map((m: Omit<MediaItem, 'id'> & { id?: string }) => ({ ...m, id: m.id ?? uid() })),
    socialPosts: (parsed.socialPosts ?? []).map((p: Omit<SocialPost, 'id'> & { id?: string }) => ({
      ...p,
      id: p.id ?? uid(),
    })),
    documents: [],
    notes: '',
  };

  return data;
}

// ── Stakeholder Enrichment ────────────────────────────────────────────────────

export async function enrichStakeholder(
  stakeholder: Stakeholder,
  companyName: string
): Promise<Partial<Stakeholder>> {
  const client = getClient();
  const prompt = `Research "${stakeholder.name}", ${stakeholder.title} at "${companyName}". Use web search.

Find their LinkedIn URL, business email, location, tenure. Return ONLY valid JSON — omit fields you cannot verify:
{
  "linkedinUrl": "https://linkedin.com/in/actual-profile",
  "email": "email@company.com",
  "location": "City, Country",
  "tenure": "Time in role"
}`;

  const { text } = await callWithSearch(client, prompt, 800);
  try {
    return JSON.parse(extractJson(text)) as Partial<Stakeholder>;
  } catch {
    return {};
  }
}

// ── Persona Analysis (Modal Tab 1) ────────────────────────────────────────────

export async function analyzePersona(
  stakeholder: Stakeholder,
  companyName: string,
  companyContext: string
): Promise<PersonaAnalysis> {
  const client = getClient();
  const prompt = `You are a B2B sales coach for Duetto (Revenue Management System). Analyze this target.

Person: ${stakeholder.name}, ${stakeholder.title} at ${companyName}
Context: ${companyContext}
${stakeholder.relevanceNote ? `Relevance note: ${stakeholder.relevanceNote}` : ''}

Return ONLY valid JSON:
{
  "professionalSummary": "3-4 sentence professional overview — background, role scope, career trajectory, priorities",
  "recentActivity": "Their likely focus areas and any known public activity (conferences, articles, initiatives)",
  "duettoReasons": [
    "Specific reason 1 why Duetto is directly relevant to their role",
    "Specific reason 2",
    "Specific reason 3"
  ]
}`;

  const { text } = await callWithSearch(client, prompt, 1500);
  return JSON.parse(extractJson(text)) as PersonaAnalysis;
}

// ── Persona Hypotheses (Modal Tab 2) ─────────────────────────────────────────

export async function generateHypotheses(
  stakeholder: Stakeholder,
  companyName: string,
  companyContext: string,
  documentContext: string
): Promise<PersonaHypotheses> {
  const client = getClient();
  const docSection = documentContext ? `\nUploaded report insights:\n${documentContext}` : '';

  const prompt = `You are a senior enterprise sales strategist for Duetto (RMS). Generate strategic hypotheses.

Person: ${stakeholder.name}, ${stakeholder.title} at ${companyName}
Company context: ${companyContext}${docSection}

Return ONLY valid JSON:
{
  "challenges": [
    {
      "id": "h1",
      "challenge": "Specific business challenge this person faces (reference company context)",
      "duettoSolution": "How Duetto's Open Pricing/Automation/Analytics solves this",
      "conversationStarter": "Natural one-sentence opener that leads into this challenge"
    },
    { "id": "h2", "challenge": "...", "duettoSolution": "...", "conversationStarter": "..." },
    { "id": "h3", "challenge": "...", "duettoSolution": "...", "conversationStarter": "..." }
  ],
  "generalConversationStarters": [
    "Opener based on a specific company news item or signal",
    "Opener based on industry trend",
    "Opener based on their role's typical priorities"
  ]
}`;

  const { text } = await callWithSearch(client, prompt, 2000);
  return JSON.parse(extractJson(text)) as PersonaHypotheses;
}

// ── Regenerate single hypothesis ──────────────────────────────────────────────

export async function regenerateHypothesis(
  original: HypothesisChallenge,
  stakeholder: Stakeholder,
  companyName: string,
  documentContext: string
): Promise<HypothesisChallenge> {
  const client = getClient();
  const prompt = `Regenerate this hypothesis with a fresh, different angle for ${stakeholder.name} (${stakeholder.title}) at ${companyName}.
Original challenge: ${original.challenge}
${documentContext ? `Document insights: ${documentContext}` : ''}
Return ONLY valid JSON — different from original:
{ "id": "${original.id}", "challenge": "...", "duettoSolution": "...", "conversationStarter": "..." }`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = response.content.find(b => b.type === 'text');
  const raw = text?.type === 'text' ? text.text : '';
  return JSON.parse(extractJson(raw)) as HypothesisChallenge;
}

// ── Pitch Generation (Modal Tab 3) ────────────────────────────────────────────

export async function generatePitch(
  stakeholder: Stakeholder,
  companyName: string,
  companyContext: string,
  focus: PitchFocus,
  customInstructions: string,
  documentContext: string
): Promise<PersonaPitch> {
  const client = getClient();
  const prompt = `Write a personalized cold email for Duetto (Revenue Management System).

Recipient: ${stakeholder.name}, ${stakeholder.title} at ${companyName}
Company context: ${companyContext}
Focus: ${focus}
${customInstructions ? `Special instructions: ${customInstructions}` : ''}
${documentContext ? `Data from uploaded reports: ${documentContext}` : ''}

Rules: 120 words max, lead with THEIR world, reference something specific, NO "I hope this email finds you well", end with a soft question, subject under 60 chars.

Return ONLY valid JSON:
{ "subject": "Subject line", "body": "Full email body" }`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 700,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = response.content.find(b => b.type === 'text');
  const raw = text?.type === 'text' ? text.text : '';
  return JSON.parse(extractJson(raw)) as PersonaPitch;
}

// ── Regenerate subject line only ──────────────────────────────────────────────

export async function regenerateSubject(
  body: string,
  stakeholder: Stakeholder,
  companyName: string
): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 80,
    messages: [
      {
        role: 'user',
        content: `Write a new compelling cold email subject line (under 60 chars) for ${stakeholder.name} (${stakeholder.title}) at ${companyName}. Body:\n${body}\n\nReturn ONLY the subject line text.`,
      },
    ],
  });
  const text = response.content.find(b => b.type === 'text');
  return text?.type === 'text' ? text.text.replace(/^["']|["']$/g, '').trim() : '';
}

// ── Document Analysis ─────────────────────────────────────────────────────────

export async function analyzeUploadedDocument(
  fileContent: string,
  fileName: string,
  companyName: string
): Promise<Omit<DocumentAnalysis, 'id' | 'fileName' | 'fileType' | 'documentType' | 'uploadedAt'>> {
  const client = getClient();
  const isHotstats =
    fileName.toLowerCase().includes('hotstats') ||
    fileContent.toLowerCase().includes('goppar') ||
    fileContent.toLowerCase().includes('trevpar');

  const prompt = `You are a hospitality finance analyst reviewing a ${isHotstats ? 'Hotstats profitability' : 'market'} report for a Duetto sales rep researching "${companyName}".

Document: ${fileName}
Content: ${fileContent.slice(0, 8000)}

${isHotstats ? 'Focus on: GOPPAR, EBITDA, Payroll %, TRevPAR, departmental profitability' : 'Focus on: RevPAR, ADR, Occupancy by segment, demand drivers'}

Return ONLY valid JSON:
{
  "kpis": [{ "name": "KPI", "value": "value", "segment": "segment", "period": "period", "type": "revenue" }],
  "trends": ["Trend 1", "Trend 2"],
  "executiveSummary": "3-4 sentence summary of key findings",
  "duettoAngle": "2-3 sentences on how Duetto addresses the challenges shown in this data"
}
For kpis[].type: "revenue", "occupancy", "profitability", or "other"`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = response.content.find(b => b.type === 'text');
  const raw = text?.type === 'text' ? text.text : '';
  return JSON.parse(extractJson(raw));
}
