import { useState } from 'react';
import {
  Building2, Globe, DollarSign, Cpu, TrendingUp,
  Zap, ExternalLink, Copy, Check,
} from 'lucide-react';
import { SectionCard } from '../ui/SectionCard';
import type { HotelData, BuyingSignalType } from '../../types';

interface Props { data: HotelData; }

const SIGNAL_STYLES: Record<BuyingSignalType, string> = {
  'M&A': 'badge-blue',
  'Leadership Change': 'badge-amber',
  'Funding': 'badge-green',
  'Expansion': 'badge-teal',
  'Technology': 'badge-navy',
  'Other': 'badge-red',
};
const SIG_PRIORITY = { High: 'bg-duetto-red', Medium: 'bg-duetto-amber', Low: 'bg-duetto-green' };
const MATURITY_STYLE = { Legacy: 'badge-red', Transitioning: 'badge-amber', Modern: 'badge-green' } as const;

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 rounded hover:bg-duetto-gray-100 text-duetto-gray-400 hover:text-duetto-navy transition-colors">
      {copied ? <Check size={13} className="text-duetto-green" /> : <Copy size={13} />}
    </button>
  );
}

export function OverviewSection({ data }: Props) {
  const { company, portfolio, techStack, financials, buyingSignals, duettoAlignment } = data;

  return (
    <div className="space-y-4">

      {/* Company Overview */}
      <SectionCard title="Company Overview" icon={Building2} iconColor="text-duetto-blue"
        action={<a href={company.website} target="_blank" rel="noopener noreferrer"
          className="btn-secondary text-xs px-2.5 py-1 gap-1">
          <Globe size={12} /> Website <ExternalLink size={10} className="text-duetto-gray-400" />
        </a>}>
        <p className="text-duetto-gray-700 text-sm leading-relaxed mb-4">{company.summary}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">HQ</span>
            <span className="font-medium text-duetto-gray-900">{company.headquarters}</span></div>
          <div><span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">Properties</span>
            <span className="font-medium text-duetto-gray-900">{String(portfolio.totalHotels)} hotels · {String(portfolio.totalRooms).toLocaleString()} rooms</span></div>
        </div>
      </SectionCard>

      {/* Portfolio */}
      <SectionCard title="Portfolio" icon={Building2} iconColor="text-duetto-teal">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Brands</span>
            <div className="flex flex-wrap gap-1.5">
              {portfolio.brands.map(b => <span key={b} className="badge badge-blue">{b}</span>)}
            </div>
          </div>
          <div>
            <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Segments</span>
            <div className="flex flex-wrap gap-1.5">
              {portfolio.segments.map(s => <span key={s} className="badge badge-teal">{s}</span>)}
            </div>
          </div>
          <div>
            <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-1.5">Markets ({portfolio.countries.length} countries)</span>
            <div className="flex flex-wrap gap-1.5">
              {portfolio.countries.slice(0, 12).map(c => <span key={c} className="badge badge-navy">{c}</span>)}
              {portfolio.countries.length > 12 && <span className="badge badge-navy">+{portfolio.countries.length - 12} more</span>}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Duetto Alignment */}
      {duettoAlignment.length > 0 && (
        <SectionCard title="Strategic Alignment with Duetto" icon={Zap} iconColor="text-duetto-amber">
          <div className="space-y-3">
            {duettoAlignment.map((a, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-duetto-amber flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-semibold text-duetto-navy text-sm">{a.valueProposition}</p>
                  <p className="text-duetto-gray-600 text-sm leading-relaxed">{a.alignment}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Tech Stack */}
      <SectionCard title="Technology Stack" icon={Cpu} iconColor="text-duetto-amber"
        badge={<span className={`badge ${MATURITY_STYLE[techStack.techMaturity]} ml-1`}>{techStack.techMaturity}</span>}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'PMS', value: techStack.pms },
              { label: 'CRS', value: techStack.crs },
              { label: 'RMS', value: techStack.rms, highlight: techStack.rms !== 'Unknown' && !techStack.rms.toLowerCase().includes('duetto') },
              { label: 'Other Tools', value: techStack.otherTools.join(', ') || '—' },
            ].map(({ label, value, highlight }) => (
              <div key={label}>
                <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">{label}</span>
                <span className={`font-medium ${highlight ? 'text-duetto-amber' : 'text-duetto-gray-900'}`}>{value}</span>
              </div>
            ))}
          </div>
          {techStack.rmsCompetitorBattlecard && (
            <div className="mt-3 bg-duetto-amber-50 border border-duetto-amber-100 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-duetto-amber uppercase tracking-wide mb-1">Competitive Opportunity</p>
              <p className="text-duetto-gray-700 text-sm leading-relaxed">{techStack.rmsCompetitorBattlecard}</p>
            </div>
          )}
          {techStack.notes && (
            <p className="text-duetto-gray-500 text-xs italic border-t border-duetto-gray-100 pt-2 mt-2">{techStack.notes}</p>
          )}
        </div>
      </SectionCard>

      {/* Financials */}
      {(financials.isPublic || financials.revenueRange) && (
        <SectionCard title="Financials" icon={DollarSign} iconColor="text-duetto-green"
          badge={financials.ticker ? <span className="badge badge-green ml-1">{financials.ticker}</span> : undefined}>
          <div className="space-y-3">
            {financials.isPublic && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {financials.stockPrice && (
                  <div>
                    <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">Stock Price</span>
                    <span className="font-semibold text-duetto-gray-900 text-lg">{financials.stockPrice}</span>
                    {financials.exchange && <span className="text-duetto-gray-400 text-xs ml-1">({financials.exchange})</span>}
                  </div>
                )}
                {financials.revenueRange && (
                  <div>
                    <span className="text-duetto-gray-400 text-xs uppercase tracking-wide block mb-0.5">Revenue Range</span>
                    <span className="font-medium text-duetto-gray-900">{financials.revenueRange}</span>
                  </div>
                )}
              </div>
            )}
            {financials.earningsSummary && (
              <div className="pt-2 border-t border-duetto-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-duetto-gray-400 text-xs uppercase tracking-wide">Latest Earnings</span>
                  {financials.earningsLink && (
                    <a href={financials.earningsLink} target="_blank" rel="noopener noreferrer"
                      className="text-duetto-blue text-xs hover:underline flex items-center gap-0.5">
                      Report <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <p className="text-duetto-gray-700 text-sm leading-relaxed">{financials.earningsSummary}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Buying Signals */}
      {buyingSignals.length > 0 && (
        <SectionCard title="Buying Signals" icon={TrendingUp} iconColor="text-duetto-red"
          badge={<span className="badge badge-red ml-1">{buyingSignals.length}</span>}>
          <div className="space-y-3">
            {buyingSignals.map(signal => (
              <div key={signal.id} className="flex gap-3 items-start">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${SIG_PRIORITY[signal.significance]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`badge ${SIGNAL_STYLES[signal.type]}`}>{signal.type}</span>
                    {signal.date && <span className="text-duetto-gray-400 text-xs">{signal.date}</span>}
                    <span className={`text-xs font-medium ${signal.significance === 'High' ? 'text-duetto-red' : signal.significance === 'Medium' ? 'text-duetto-amber' : 'text-duetto-green'}`}>
                      {signal.significance}
                    </span>
                  </div>
                  <p className="text-duetto-gray-700 text-sm leading-relaxed">{signal.description}</p>
                  {signal.sourceUrl && (
                    <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="text-duetto-blue text-xs hover:underline flex items-center gap-0.5 mt-0.5">
                      Source <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                <CopyBtn text={signal.description} />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Copy for Salesforce */}
      <SalesforceCopyBlock data={data} />
    </div>
  );
}

function SalesforceCopyBlock({ data }: { data: HotelData }) {
  const [copied, setCopied] = useState(false);

  const activeStakeholders = data.stakeholders.filter(s => !s.isDeparted);

  const text = [
    `=== HOTEL SCOUT INTELLIGENCE ===`,
    `Company: ${data.company.name}`,
    `Website: ${data.company.website}`,
    `HQ: ${data.company.headquarters}`,
    ``,
    `SUMMARY`,
    data.company.summary,
    ``,
    `TECH STACK`,
    `PMS: ${data.techStack.pms}`,
    `CRS: ${data.techStack.crs}`,
    `RMS: ${data.techStack.rms} ← KEY INSIGHT`,
    data.techStack.rmsCompetitorBattlecard ? `Competitive angle: ${data.techStack.rmsCompetitorBattlecard}` : '',
    ``,
    `BUYING SIGNALS`,
    ...data.buyingSignals.map(s => `• [${s.type}] ${s.description}${s.date ? ` (${s.date})` : ''}`),
    ``,
    `DECISION MAKERS`,
    ...activeStakeholders.map(s =>
      [s.name, s.title, s.email, s.linkedinUrl].filter(Boolean).join(' | ')
    ),
    ``,
    `Generated by HotelScout | ${new Date(data.generatedAt).toLocaleDateString()}`,
  ].filter(l => l !== undefined).join('\n');

  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 3000); }}
      className={`w-full btn ${copied ? 'btn-secondary text-duetto-green' : 'btn-secondary'} justify-center gap-2`}>
      {copied ? <><Check size={15} className="text-duetto-green" /> Copied to clipboard!</> : <><Copy size={15} /> Copy for Salesforce</>}
    </button>
  );
}
