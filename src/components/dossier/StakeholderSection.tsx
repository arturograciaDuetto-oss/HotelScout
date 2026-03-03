import { Users, Linkedin, Mail, RefreshCw, ExternalLink } from 'lucide-react';
import type { Stakeholder, BuyerType } from '../../types';

interface Props {
  data: Stakeholder[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const BUYER_TYPE_STYLES: Record<BuyerType, string> = {
  'Champion': 'badge-green',
  'Decision Maker': 'badge-blue',
  'Influencer': 'badge-teal',
  'Gatekeeper': 'badge-amber',
};

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="card-body space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-duetto-gray-100 rounded w-40" />
            <div className="h-3 bg-duetto-gray-100 rounded w-28" />
          </div>
          <div className="h-5 bg-duetto-gray-100 rounded-full w-24" />
        </div>
        <div className="h-3 bg-duetto-gray-100 rounded w-full" />
        <div className="h-3 bg-duetto-gray-100 rounded w-3/4" />
        <div className="flex gap-2 pt-1">
          <div className="h-7 bg-duetto-gray-100 rounded w-24" />
          <div className="h-7 bg-duetto-gray-100 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export function StakeholderSection({ data, loading, error, onRetry }: Props) {
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

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-duetto-teal" />
          <h3 className="font-semibold text-duetto-navy text-sm">Decision-Maker Map</h3>
        </div>
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-duetto-teal" />
          <h3 className="font-semibold text-duetto-navy text-sm">Decision-Maker Map</h3>
        </div>
        <span className="text-xs text-duetto-gray-400">{data.length} stakeholders identified</span>
      </div>

      {data.map((s, i) => (
        <div key={i} className="card hover:shadow-duetto-md transition-shadow">
          <div className="card-body">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-duetto-navy flex items-center justify-center
                                text-duetto-white font-bold text-sm shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-duetto-navy text-sm">{s.name}</p>
                  <p className="text-duetto-gray-500 text-xs">{s.title}</p>
                  {s.tenure && (
                    <p className="text-duetto-gray-400 text-xs mt-0.5">Tenure: {s.tenure}</p>
                  )}
                </div>
              </div>
              <span className={`badge ${BUYER_TYPE_STYLES[s.buyerType]} shrink-0`}>
                {s.buyerType}
              </span>
            </div>

            <p className="text-duetto-gray-600 text-sm leading-relaxed mb-3">{s.bio}</p>

            {s.publicStatements && (
              <div className="bg-duetto-gray-50 rounded-lg px-3 py-2 mb-3 border-l-2 border-duetto-blue-300">
                <p className="text-duetto-gray-600 text-xs italic">"{s.publicStatements}"</p>
              </div>
            )}

            {s.painPoints.length > 0 && (
              <div className="mb-3">
                <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">
                  Likely Pain Points
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {s.painPoints.map((p, j) => (
                    <span key={j} className="badge badge-red">{p}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-duetto-gray-100">
              <a
                href={s.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs px-3 py-1.5 gap-1.5"
              >
                <Linkedin size={13} className="text-[#0077B5]" />
                LinkedIn
                <ExternalLink size={11} className="text-duetto-gray-400" />
              </a>
              <button
                onClick={() => copyText(s.emailFormat)}
                className="btn-secondary text-xs px-3 py-1.5 gap-1.5"
                title="Copy email format"
              >
                <Mail size={13} className="text-duetto-gray-500" />
                {s.emailFormat}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
