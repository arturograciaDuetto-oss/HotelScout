import { useState, useEffect } from 'react';
import {
  X, User, Lightbulb, Mail, Loader2, RefreshCw, RotateCcw,
  Copy, Check, ChevronRight, Zap,
} from 'lucide-react';
import {
  analyzePersona,
  generateHypotheses,
  regenerateHypothesis,
  generatePitch,
  regenerateSubject,
} from '../../lib/anthropic';
import type {
  Stakeholder,
  HotelData,
  PersonaAnalysis,
  PersonaHypotheses,
  PersonaPitch,
  PitchFocus,
  DocumentAnalysis,
} from '../../types';

type Tab = 'analysis' | 'hypotheses' | 'pitch';

interface Props {
  stakeholder: Stakeholder;
  hotelData: HotelData;
  onClose: () => void;
}

function buildCompanyContext(d: HotelData): string {
  return JSON.stringify({
    name: d.company.name,
    summary: d.company.summary,
    rms: d.techStack.rms,
    recentDevelopments: d.buyingSignals.slice(0, 3).map(s => s.description).join('; '),
    portfolio: `${d.portfolio.totalHotels} hotels, ${d.portfolio.segments.join('/')} segments`,
  });
}

function buildDocumentContext(docs: DocumentAnalysis[]): string {
  if (!docs.length) return '';
  return docs.map(d => `${d.fileName}: ${d.executiveSummary} Duetto angle: ${d.duettoAngle}`).join('\n');
}

function CopyBtn({ text, label = '' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="btn-secondary text-xs gap-1.5">
      {copied ? <Check size={12} className="text-duetto-green" /> : <Copy size={12} />}
      {label || (copied ? 'Copied!' : 'Copy')}
    </button>
  );
}

export function PersonaModal({ stakeholder, hotelData, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');

  // Tab 1 — Analysis
  const [analysis, setAnalysis] = useState<PersonaAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Tab 2 — Hypotheses
  const [hypotheses, setHypotheses] = useState<PersonaHypotheses | null>(null);
  const [hypothesesLoading, setHypothesesLoading] = useState(false);
  const [hypothesesError, setHypothesesError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [regenLoading, setRegenLoading] = useState<string | null>(null);

  // Tab 3 — Pitch
  const [pitch, setPitch] = useState<PersonaPitch | null>(null);
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchError, setPitchError] = useState<string | null>(null);
  const [pitchFocus, setPitchFocus] = useState<PitchFocus>('Open Pricing');
  const [customInstructions, setCustomInstructions] = useState('');
  const [subjectLoading, setSubjectLoading] = useState(false);

  const companyCtx = buildCompanyContext(hotelData);
  const docCtx = buildDocumentContext(hotelData.documents);

  // Auto-load analysis on mount
  useEffect(() => {
    async function load() {
      setAnalysisLoading(true);
      setAnalysisError(null);
      try {
        const result = await analyzePersona(stakeholder, hotelData.company.name, companyCtx);
        setAnalysis(result);
      } catch (e) {
        setAnalysisError(e instanceof Error ? e.message : 'Failed to load analysis');
      } finally {
        setAnalysisLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadHypotheses() {
    setHypothesesLoading(true);
    setHypothesesError(null);
    try {
      const result = await generateHypotheses(stakeholder, hotelData.company.name, companyCtx, docCtx);
      // Ensure ids
      result.challenges = result.challenges.map((c, i) => ({ ...c, id: c.id ?? `h${i + 1}` }));
      setHypotheses(result);
    } catch (e) {
      setHypothesesError(e instanceof Error ? e.message : 'Failed to generate hypotheses');
    } finally {
      setHypothesesLoading(false);
    }
  }

  async function handleRegenSelected() {
    if (!hypotheses) return;
    const toRegen = hypotheses.challenges.filter(c => selectedIds.has(c.id));
    for (const challenge of toRegen) {
      setRegenLoading(challenge.id);
      try {
        const updated = await regenerateHypothesis(challenge, stakeholder, hotelData.company.name, docCtx);
        setHypotheses(prev => prev ? {
          ...prev,
          challenges: prev.challenges.map(c => c.id === updated.id ? updated : c),
        } : null);
      } catch { /* keep original */ }
    }
    setRegenLoading(null);
    setSelectedIds(new Set());
  }

  async function handleGeneratePitch() {
    setPitchLoading(true);
    setPitchError(null);
    try {
      const result = await generatePitch(stakeholder, hotelData.company.name, companyCtx, pitchFocus, customInstructions, docCtx);
      setPitch(result);
    } catch (e) {
      setPitchError(e instanceof Error ? e.message : 'Failed to generate pitch');
    } finally {
      setPitchLoading(false);
    }
  }

  async function handleRegenSubject() {
    if (!pitch) return;
    setSubjectLoading(true);
    try {
      const newSubject = await regenerateSubject(pitch.body, stakeholder, hotelData.company.name);
      setPitch(prev => prev ? { ...prev, subject: newSubject } : null);
    } catch { /* keep original */ }
    setSubjectLoading(false);
  }

  const TABS: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'analysis', label: 'Analysis', icon: User },
    { id: 'hypotheses', label: 'Hypotheses', icon: Lightbulb },
    { id: 'pitch', label: 'Pitch', icon: Mail },
  ];

  const PITCH_FOCUSES: PitchFocus[] = ['Open Pricing', 'Profitability', 'Automation', 'Integration'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[88vh] rounded-t-2xl sm:rounded-duetto
                      shadow-duetto-lg flex flex-col overflow-hidden">

        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-duetto-gray-100 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-duetto-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
              {stakeholder.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-duetto-navy">{stakeholder.name}</p>
              <p className="text-duetto-gray-500 text-sm">{stakeholder.title} · {hotelData.company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-duetto-gray-100 text-duetto-gray-400 ml-2">
            <X size={18} />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-duetto-gray-100 shrink-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => {
              setActiveTab(id);
              if (id === 'hypotheses' && !hypotheses && !hypothesesLoading) loadHypotheses();
            }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-all
                ${activeTab === id
                  ? 'text-duetto-blue border-b-2 border-duetto-blue bg-duetto-blue-50'
                  : 'text-duetto-gray-500 hover:text-duetto-gray-700 hover:bg-duetto-gray-50'
                }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* ── Tab 1: Analysis ── */}
          {activeTab === 'analysis' && (
            <div className="space-y-4">
              {analysisLoading && (
                <div className="flex items-center gap-3 text-duetto-gray-500 py-8 justify-center">
                  <Loader2 size={20} className="animate-spin text-duetto-blue" />
                  <span className="text-sm">Analyzing persona…</span>
                </div>
              )}
              {analysisError && (
                <div className="text-center py-6">
                  <p className="text-duetto-red text-sm mb-3">{analysisError}</p>
                  <button onClick={() => { setAnalysisError(null); setAnalysisLoading(true); analyzePersona(stakeholder, hotelData.company.name, companyCtx).then(setAnalysis).catch(e => setAnalysisError(e.message)).finally(() => setAnalysisLoading(false)); }}
                    className="btn-secondary text-sm gap-1.5"><RefreshCw size={14} /> Retry</button>
                </div>
              )}
              {analysis && !analysisLoading && (
                <>
                  <div>
                    <p className="text-duetto-gray-400 text-xs uppercase tracking-wide mb-1.5">Professional Summary</p>
                    <p className="text-duetto-gray-700 text-sm leading-relaxed">{analysis.professionalSummary}</p>
                  </div>
                  <div className="pt-3 border-t border-duetto-gray-100">
                    <p className="text-duetto-gray-400 text-xs uppercase tracking-wide mb-1.5">Recent Activity & Focus</p>
                    <p className="text-duetto-gray-700 text-sm leading-relaxed">{analysis.recentActivity}</p>
                  </div>
                  <div className="pt-3 border-t border-duetto-gray-100">
                    <p className="text-duetto-gray-400 text-xs uppercase tracking-wide mb-2">Why Duetto is Relevant</p>
                    <ol className="space-y-2.5">
                      {analysis.duettoReasons.map((r, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-duetto-blue text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-duetto-gray-700 text-sm leading-relaxed">{r}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="pt-3 flex justify-end">
                    <button onClick={() => { setActiveTab('hypotheses'); if (!hypotheses && !hypothesesLoading) loadHypotheses(); }}
                      className="btn-primary text-sm gap-1.5">
                      Generate Hypotheses <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Tab 2: Hypotheses ── */}
          {activeTab === 'hypotheses' && (
            <div className="space-y-4">
              {hypothesesLoading && (
                <div className="flex items-center gap-3 text-duetto-gray-500 py-8 justify-center">
                  <Loader2 size={20} className="animate-spin text-duetto-blue" />
                  <span className="text-sm">Generating hypotheses{docCtx ? ' (including document insights)' : ''}…</span>
                </div>
              )}
              {hypothesesError && (
                <div className="text-center py-6">
                  <p className="text-duetto-red text-sm mb-3">{hypothesesError}</p>
                  <button onClick={loadHypotheses} className="btn-secondary text-sm gap-1.5"><RefreshCw size={14} /> Retry</button>
                </div>
              )}
              {hypotheses && !hypothesesLoading && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-duetto-gray-500 text-sm">Select hypotheses to regenerate with a fresh angle</p>
                    {selectedIds.size > 0 && (
                      <button onClick={handleRegenSelected} disabled={!!regenLoading}
                        className="btn-secondary text-xs gap-1.5 disabled:opacity-50">
                        <RotateCcw size={12} /> Regenerate {selectedIds.size} selected
                      </button>
                    )}
                  </div>

                  {hypotheses.challenges.map(challenge => (
                    <div key={challenge.id}
                      className={`border rounded-duetto p-4 cursor-pointer transition-all
                        ${selectedIds.has(challenge.id) ? 'border-duetto-blue bg-duetto-blue-50' : 'border-duetto-gray-200 hover:border-duetto-gray-300'}`}
                      onClick={() => setSelectedIds(prev => {
                        const next = new Set(prev);
                        next.has(challenge.id) ? next.delete(challenge.id) : next.add(challenge.id);
                        return next;
                      })}>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" readOnly checked={selectedIds.has(challenge.id)}
                          className="mt-1 accent-duetto-blue cursor-pointer" />
                        <div className="flex-1">
                          {regenLoading === challenge.id ? (
                            <div className="flex items-center gap-2 text-duetto-blue">
                              <Loader2 size={14} className="animate-spin" />
                              <span className="text-sm">Regenerating…</span>
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-duetto-navy text-sm mb-1">{challenge.challenge}</p>
                              <p className="text-duetto-gray-600 text-sm mb-2">
                                <span className="text-duetto-teal font-medium">Duetto solution: </span>
                                {challenge.duettoSolution}
                              </p>
                              <div className="bg-duetto-blue-50 border border-duetto-blue-100 rounded px-3 py-2">
                                <p className="text-duetto-blue text-xs font-semibold uppercase tracking-wide mb-0.5">Conversation Starter</p>
                                <p className="text-duetto-gray-700 text-sm italic">"{challenge.conversationStarter}"</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {hypotheses.generalConversationStarters.length > 0 && (
                    <div className="pt-3 border-t border-duetto-gray-100">
                      <p className="text-duetto-gray-400 text-xs uppercase tracking-wide mb-2">General Conversation Starters</p>
                      <ul className="space-y-2">
                        {hypotheses.generalConversationStarters.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-duetto-gray-700">
                            <span className="text-duetto-teal mt-0.5">→</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button onClick={() => setActiveTab('pitch')} className="btn-primary text-sm gap-1.5">
                      Draft Pitch Email <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Tab 3: Pitch ── */}
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              {/* Focus selector */}
              <div>
                <p className="text-duetto-gray-400 text-xs uppercase tracking-wide mb-2">Pitch Focus</p>
                <div className="flex flex-wrap gap-2">
                  {PITCH_FOCUSES.map(f => (
                    <button key={f} onClick={() => setPitchFocus(f)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                        ${pitchFocus === f ? 'bg-duetto-blue text-white border-duetto-blue' : 'bg-white text-duetto-gray-600 border-duetto-gray-200 hover:border-duetto-blue hover:text-duetto-blue'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom instructions */}
              <div>
                <p className="text-duetto-gray-400 text-xs uppercase tracking-wide mb-1.5">
                  Custom Instructions <span className="normal-case text-duetto-gray-400">(optional)</span>
                </p>
                <textarea
                  value={customInstructions}
                  onChange={e => setCustomInstructions(e.target.value)}
                  placeholder='e.g. "Mention we met at HITEC 2024" or "Reference their new Paris property"'
                  rows={2}
                  className="w-full px-3 py-2 rounded-duetto border border-duetto-gray-200 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
                />
              </div>

              <button onClick={handleGeneratePitch} disabled={pitchLoading}
                className="btn-primary w-full justify-center gap-2 disabled:opacity-50">
                {pitchLoading ? <><Loader2 size={15} className="animate-spin" /> Drafting email…</> : <><Zap size={15} /> Generate Pitch Email</>}
              </button>

              {pitchError && <p className="text-duetto-red text-sm">{pitchError}</p>}

              {pitch && !pitchLoading && (
                <div className="space-y-3 pt-2 border-t border-duetto-gray-100">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-duetto-gray-400 text-xs uppercase tracking-wide">Subject Line</span>
                      <div className="flex gap-1.5">
                        <button onClick={handleRegenSubject} disabled={subjectLoading}
                          className="btn-ghost text-xs gap-1 px-2 py-1 disabled:opacity-50">
                          {subjectLoading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                          New subject
                        </button>
                      </div>
                    </div>
                    <div className="bg-duetto-gray-50 rounded px-3 py-2 font-medium text-duetto-navy text-sm">
                      {pitch.subject}
                    </div>
                  </div>
                  <div>
                    <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Email Body</span>
                    <div className="bg-duetto-gray-50 rounded px-3 py-3 text-duetto-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {pitch.body}
                    </div>
                  </div>
                  <CopyBtn text={`Subject: ${pitch.subject}\n\n${pitch.body}`} label="Copy full email" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
