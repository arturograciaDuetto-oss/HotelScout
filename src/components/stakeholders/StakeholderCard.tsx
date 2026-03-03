import { useState } from 'react';
import { Linkedin, Mail, MapPin, Clock, ExternalLink, UserX, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { enrichStakeholder } from '../../lib/anthropic';
import type { Stakeholder } from '../../types';

interface Props {
  stakeholder: Stakeholder;
  companyName: string;
  onUpdate: (updated: Stakeholder) => void;
  onAnalyzePersona: (s: Stakeholder) => void;
}

export function StakeholderCard({ stakeholder, companyName, onUpdate, onAnalyzePersona }: Props) {
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [confirmDepart, setConfirmDepart] = useState(false);

  const s = stakeholder;
  const isDeparted = s.isDeparted ?? false;

  async function handleEnrich() {
    setEnrichLoading(true);
    try {
      const enriched = await enrichStakeholder(s, companyName);
      onUpdate({ ...s, ...enriched });
    } catch { /* silent */ }
    finally { setEnrichLoading(false); }
  }

  function copyEmail() {
    if (!s.email) return;
    navigator.clipboard.writeText(s.email).catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  function handleToggleDeparted() {
    if (!isDeparted) {
      setConfirmDepart(true);
    } else {
      onUpdate({ ...s, isDeparted: false });
    }
  }

  const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={`card transition-all ${isDeparted ? 'opacity-50 grayscale' : 'hover:shadow-duetto-md'}`}>
      <div className="card-body">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${isDeparted ? 'bg-duetto-gray-400' : 'bg-duetto-navy'}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-duetto-navy text-sm leading-tight">{s.name}</p>
                <p className="text-duetto-gray-500 text-xs">{s.title}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {s.isManuallyAdded && <span className="badge badge-amber text-xs">Manual</span>}
                {isDeparted && <span className="badge badge-red text-xs">Departed</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-duetto-gray-500 mb-3">
          {s.location && <span className="flex items-center gap-0.5"><MapPin size={10} />{s.location}</span>}
          {s.tenure && <span className="flex items-center gap-0.5"><Clock size={10} />{s.tenure}</span>}
        </div>

        {/* Relevance note */}
        {s.relevanceNote && (
          <div className="bg-duetto-teal-50 border border-duetto-teal-100 rounded px-3 py-2 mb-3">
            <p className="text-duetto-gray-700 text-xs leading-relaxed">{s.relevanceNote}</p>
          </div>
        )}

        {/* Contact links */}
        <div className="flex flex-wrap gap-2 mb-3">
          {s.linkedinUrl && (
            <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-xs px-2.5 py-1.5 gap-1">
              <Linkedin size={12} className="text-[#0077B5]" />LinkedIn<ExternalLink size={10} className="text-duetto-gray-300" />
            </a>
          )}
          {s.email && (
            <button onClick={copyEmail} className="btn-secondary text-xs px-2.5 py-1.5 gap-1">
              {copiedEmail ? <Check size={12} className="text-duetto-green" /> : <Mail size={12} />}
              {s.email}
            </button>
          )}
        </div>

        {/* Actions */}
        {!isDeparted && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onAnalyzePersona(s)}
              className="btn-primary text-xs px-3 py-1.5 gap-1 flex-1 justify-center">
              <Sparkles size={12} /> Analyze Persona
            </button>
            {(!s.linkedinUrl || !s.email) && (
              <button
                onClick={handleEnrich}
                disabled={enrichLoading}
                className="btn-secondary text-xs px-3 py-1.5 gap-1 disabled:opacity-50">
                {enrichLoading ? <Loader2 size={12} className="animate-spin" /> : <Copy size={12} />}
                {enrichLoading ? 'Enriching…' : 'Enrich'}
              </button>
            )}
            <button onClick={handleToggleDeparted}
              className="btn-ghost text-xs px-2 py-1.5 gap-1 text-duetto-gray-400 hover:text-duetto-red">
              <UserX size={12} /> Mark Departed
            </button>
          </div>
        )}
        {isDeparted && (
          <button onClick={handleToggleDeparted} className="btn-ghost text-xs gap-1 text-duetto-gray-500">
            <UserX size={12} /> Undo Departed
          </button>
        )}
      </div>

      {/* Departure confirm overlay */}
      {confirmDepart && (
        <div className="absolute inset-0 bg-white/95 rounded-duetto flex flex-col items-center justify-center gap-3 p-4 z-10">
          <p className="font-semibold text-duetto-navy text-sm text-center">Mark {s.name} as Departed?</p>
          <p className="text-duetto-gray-500 text-xs text-center">This will grey out the card and disable further actions.</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDepart(false)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={() => { onUpdate({ ...s, isDeparted: true }); setConfirmDepart(false); }} className="btn text-sm bg-duetto-red text-white hover:bg-duetto-red-100">Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}
