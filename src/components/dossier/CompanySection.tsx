import { Building2, DollarSign, Cpu, TrendingUp, RefreshCw } from 'lucide-react';
import type { CompanyResearch } from '../../types';

interface Props {
  data: CompanyResearch | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const MATURITY_COLORS = {
  Legacy: 'badge-red',
  Transitioning: 'badge-amber',
  Modern: 'badge-green',
};

function SectionLoader() {
  return (
    <div className="space-y-3 animate-pulse">
      {[80, 60, 70, 50].map(w => (
        <div key={w} className={`h-4 bg-duetto-gray-100 rounded w-${w === 80 ? 'full' : w === 60 ? '3/4' : w === 70 ? '5/6' : '2/3'}`} />
      ))}
    </div>
  );
}

export function CompanySection({ data, loading, error, onRetry }: Props) {
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

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <Building2 size={16} className="text-duetto-blue" />
          <h3 className="font-semibold text-duetto-navy text-sm">Company Overview</h3>
        </div>
        <div className="card-body">
          {loading || !data ? (
            <SectionLoader />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-duetto-gray-700 text-sm leading-relaxed mb-3">
                  {data.overview.description}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-duetto-gray-400 block text-xs uppercase tracking-wide mb-0.5">HQ</span>
                    <span className="text-duetto-gray-800 font-medium">{data.overview.headquarters}</span>
                  </div>
                  <div>
                    <span className="text-duetto-gray-400 block text-xs uppercase tracking-wide mb-0.5">Founded</span>
                    <span className="text-duetto-gray-800 font-medium">{data.overview.foundedYear}</span>
                  </div>
                  <div>
                    <span className="text-duetto-gray-400 block text-xs uppercase tracking-wide mb-0.5">Portfolio</span>
                    <span className="text-duetto-gray-800 font-medium">{data.overview.propertyCount}</span>
                  </div>
                  <div>
                    <span className="text-duetto-gray-400 block text-xs uppercase tracking-wide mb-0.5">Footprint</span>
                    <span className="text-duetto-gray-800 font-medium">{data.overview.geographicFootprint}</span>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Segments</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.overview.segments.map(s => (
                    <span key={s} className="badge badge-blue">{s}</span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-duetto-gray-100">
                <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Recent Developments</span>
                <p className="text-duetto-gray-700 text-sm leading-relaxed">{data.overview.recentDevelopments}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financials */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <DollarSign size={16} className="text-duetto-green" />
          <h3 className="font-semibold text-duetto-navy text-sm">Financial Metrics</h3>
        </div>
        <div className="card-body">
          {loading || !data ? (
            <SectionLoader />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">Est. Revenue</span>
                  <span className="text-duetto-gray-900 font-semibold">{data.financials.estimatedRevenue}</span>
                </div>
                <div>
                  <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">Growth</span>
                  <span className="text-duetto-gray-900 font-semibold">{data.financials.growthTrajectory}</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Key Metrics</span>
                <ul className="space-y-1">
                  {data.financials.keyMetrics.map((m, i) => (
                    <li key={i} className="text-sm text-duetto-gray-700 flex gap-2">
                      <span className="text-duetto-teal mt-0.5">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {data.financials.recentNews && (
                <div className="pt-2 border-t border-duetto-gray-100">
                  <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1">Financial News</span>
                  <p className="text-duetto-gray-700 text-sm">{data.financials.recentNews}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-duetto-amber" />
            <h3 className="font-semibold text-duetto-navy text-sm">Technology Stack</h3>
          </div>
          {data && (
            <span className={`badge ${MATURITY_COLORS[data.techStack.techMaturity]}`}>
              {data.techStack.techMaturity}
            </span>
          )}
        </div>
        <div className="card-body">
          {loading || !data ? (
            <SectionLoader />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'RMS', value: data.techStack.rms, highlight: data.techStack.rms !== 'Unknown' && data.techStack.rms.toLowerCase() !== 'duetto' },
                  { label: 'PMS', value: data.techStack.pms },
                  { label: 'CRS', value: data.techStack.crs },
                  { label: 'Channel Mgr', value: data.techStack.channelManager },
                ].map(({ label, value, highlight }) => (
                  <div key={label}>
                    <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">{label}</span>
                    <span className={`font-medium text-sm ${highlight ? 'text-duetto-amber' : 'text-duetto-gray-800'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {data.techStack.otherTools.length > 0 && (
                <div>
                  <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Other Tools</span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.techStack.otherTools.map(t => (
                      <span key={t} className="badge badge-teal">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.techStack.notes && (
                <div className="pt-2 border-t border-duetto-gray-100">
                  <p className="text-duetto-gray-600 text-sm italic">{data.techStack.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Industry Context */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <TrendingUp size={16} className="text-duetto-teal" />
          <h3 className="font-semibold text-duetto-navy text-sm">Industry Context</h3>
        </div>
        <div className="card-body">
          {loading || !data ? (
            <SectionLoader />
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Key Trends</span>
                <ul className="space-y-1">
                  {data.industryContext.keyTrends.map((t, i) => (
                    <li key={i} className="text-sm text-duetto-gray-700 flex gap-2">
                      <span className="text-duetto-blue mt-0.5">→</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Competitive Set</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.industryContext.competitiveSet.map(c => (
                    <span key={c} className="badge badge-navy">{c}</span>
                  ))}
                </div>
              </div>
              {data.industryContext.macroFactors.length > 0 && (
                <div>
                  <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Macro Factors</span>
                  <ul className="space-y-1">
                    {data.industryContext.macroFactors.map((f, i) => (
                      <li key={i} className="text-sm text-duetto-gray-600 flex gap-2">
                        <span className="text-duetto-gray-400 mt-0.5">—</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
