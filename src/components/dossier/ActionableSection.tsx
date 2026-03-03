import { useState } from 'react';
import { Zap, User, Mail, Linkedin, Phone, Copy, Check, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react';
import type { ActionableOutput } from '../../types';

interface Props {
  data: ActionableOutput | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onGenerate: () => void;
  canGenerate: boolean;
}

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-lg hover:bg-duetto-gray-100 text-duetto-gray-400 hover:text-duetto-navy transition-colors ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-duetto-green" /> : <Copy size={14} />}
    </button>
  );
}

export function ActionableSection({ data, loading, error, onRetry, onGenerate, canGenerate }: Props) {
  const [callOpen, setCallOpen] = useState(false);

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-duetto-red text-sm mb-3">{error}</p>
        <button onClick={onRetry} className="btn-secondary text-sm gap-1.5">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div className="card p-8 text-center">
        <Zap size={32} className="mx-auto text-duetto-amber mb-3 opacity-60" />
        <p className="font-semibold text-duetto-navy mb-1">Generate Sales Action Plan</p>
        <p className="text-duetto-gray-500 text-sm mb-5 max-w-xs mx-auto">
          Generates strategic hypotheses, buyer personas, and ready-to-copy cold emails and LinkedIn messages.
        </p>
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={15} />
          Generate Action Plan
        </button>
        {!canGenerate && (
          <p className="text-duetto-gray-400 text-xs mt-2">Wait for company research to complete first</p>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <Loader2 size={28} className="mx-auto text-duetto-blue animate-spin mb-3" />
        <p className="font-semibold text-duetto-navy text-sm">Generating action plan…</p>
        <p className="text-duetto-gray-500 text-xs mt-1">Crafting hypotheses, personas, and outreach templates</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-duetto-amber" />
        <h3 className="font-semibold text-duetto-navy text-sm">Action Center</h3>
      </div>

      {/* Strategic Hypotheses */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <Zap size={14} className="text-duetto-amber" />
          <h4 className="font-semibold text-duetto-navy text-sm">Strategic Hypotheses</h4>
          <span className="ml-auto text-xs text-duetto-gray-400">Why they need Duetto now</span>
        </div>
        <div className="card-body">
          <ol className="space-y-3">
            {data.strategicHypotheses.map((h, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-duetto-amber text-white text-xs font-bold
                                 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-duetto-gray-700 text-sm leading-relaxed">{h}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Buyer Personas */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <User size={14} className="text-duetto-teal" />
          <h4 className="font-semibold text-duetto-navy text-sm">Buyer Personas</h4>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4">
            {data.buyerPersonas.map((p, i) => (
              <div key={i} className="border border-duetto-gray-200 rounded-duetto p-4">
                <p className="font-semibold text-duetto-navy text-sm mb-1">{p.title}</p>
                <p className="text-duetto-gray-600 text-sm leading-relaxed mb-3">{p.profile}</p>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Pain Points</span>
                    <ul className="space-y-0.5">
                      {p.painPoints.map((pt, j) => (
                        <li key={j} className="text-duetto-gray-700 flex gap-1.5">
                          <span className="text-duetto-red mt-0.5">•</span>{pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Motivations</span>
                    <ul className="space-y-0.5">
                      {p.motivations.map((m, j) => (
                        <li key={j} className="text-duetto-gray-700 flex gap-1.5">
                          <span className="text-duetto-green mt-0.5">•</span>{m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-duetto-teal-50 border border-duetto-teal-100 rounded px-3 py-2">
                  <span className="text-duetto-teal text-xs font-semibold uppercase tracking-wide block mb-0.5">
                    Messaging Angle
                  </span>
                  <p className="text-duetto-gray-700 text-sm">{p.messagingAngle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cold Email */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-duetto-blue" />
            <h4 className="font-semibold text-duetto-navy text-sm">Cold Email</h4>
          </div>
          <CopyButton text={`Subject: ${data.coldEmail.subject}\n\n${data.coldEmail.body}\n\n${data.coldEmail.callToAction}`} />
        </div>
        <div className="card-body space-y-3">
          <div>
            <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Subject Line</span>
            <div className="bg-duetto-gray-50 rounded px-3 py-2 font-medium text-duetto-navy text-sm">
              {data.coldEmail.subject}
            </div>
          </div>
          <div>
            <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Body</span>
            <div className="bg-duetto-gray-50 rounded px-3 py-3 text-duetto-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {data.coldEmail.body}
            </div>
          </div>
          <div>
            <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Call to Action</span>
            <div className="bg-duetto-blue-50 border border-duetto-blue-100 rounded px-3 py-2 text-duetto-blue text-sm font-medium">
              {data.coldEmail.callToAction}
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Message */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Linkedin size={14} className="text-[#0077B5]" />
            <h4 className="font-semibold text-duetto-navy text-sm">LinkedIn Connection Request</h4>
          </div>
          <CopyButton text={data.linkedinMessage} />
        </div>
        <div className="card-body">
          <div className="bg-duetto-gray-50 rounded px-3 py-3 text-duetto-gray-700 text-sm leading-relaxed">
            {data.linkedinMessage}
          </div>
          <p className="text-duetto-gray-400 text-xs mt-2">
            {data.linkedinMessage.length}/300 characters
          </p>
        </div>
      </div>

      {/* Call Opening */}
      <div className="card">
        <button
          onClick={() => setCallOpen(o => !o)}
          className="card-header w-full flex items-center justify-between hover:bg-duetto-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-duetto-green" />
            <h4 className="font-semibold text-duetto-navy text-sm">Call Opening Framework</h4>
          </div>
          {callOpen ? <ChevronUp size={16} className="text-duetto-gray-400" /> : <ChevronDown size={16} className="text-duetto-gray-400" />}
        </button>
        {callOpen && (
          <div className="card-body">
            <div className="bg-duetto-green-50 border border-duetto-green-100 rounded px-4 py-3 text-duetto-gray-700 text-sm leading-relaxed relative">
              {data.callOpening}
              <CopyButton text={data.callOpening} className="absolute top-2 right-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
