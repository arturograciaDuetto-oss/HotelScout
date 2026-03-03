import { useState } from 'react'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { LeadCard, type Lead } from '../cards/LeadCard'

const DEMO_LEADS: Lead[] = [
  {
    id: '1',
    hotelName: 'The Grand Palacio',
    contactName: 'Sofia Reyes',
    contactRole: 'Revenue Manager',
    estimatedDealSize: 48000,
    stage: 'demo',
    nextAction: 'Follow-up after RMS live demo',
    nextActionDate: 'Mar 5, 2026',
    priority: 'high',
  },
  {
    id: '2',
    hotelName: 'Seabreeze Boutique Resort',
    contactName: 'Marcus Chen',
    contactRole: 'GM',
    estimatedDealSize: 22000,
    stage: 'proposal',
    nextAction: 'Send tailored ROI proposal',
    nextActionDate: 'Mar 7, 2026',
    priority: 'high',
  },
  {
    id: '3',
    hotelName: 'Northview City Hotel',
    contactName: 'Priya Nair',
    contactRole: 'VP Operations',
    estimatedDealSize: 35000,
    stage: 'negotiation',
    nextAction: 'Contract review call',
    nextActionDate: 'Mar 10, 2026',
    priority: 'medium',
  },
  {
    id: '4',
    hotelName: 'Summit Peak Lodge',
    contactName: 'James Walker',
    contactRole: 'Owner',
    estimatedDealSize: 18000,
    stage: 'discovery',
    nextAction: 'Initial discovery call',
    nextActionDate: 'Mar 12, 2026',
    priority: 'medium',
  },
  {
    id: '5',
    hotelName: 'The Oxford Grand',
    contactName: 'Eleanor Hughes',
    contactRole: 'Director of Revenue',
    estimatedDealSize: 62000,
    stage: 'proposal',
    nextAction: 'Present annual pricing deck',
    nextActionDate: 'Mar 6, 2026',
    priority: 'high',
  },
  {
    id: '6',
    hotelName: 'Sakura Garden Hotel',
    contactName: 'Yuki Tanaka',
    contactRole: 'Revenue Analyst',
    estimatedDealSize: 27000,
    stage: 'discovery',
    nextAction: 'Send intro deck (JP localised)',
    nextActionDate: 'Mar 14, 2026',
    priority: 'low',
  },
  {
    id: '7',
    hotelName: 'Bella Vista Terrace',
    contactName: 'Lorenzo Mancini',
    contactRole: 'Revenue Manager',
    estimatedDealSize: 21000,
    stage: 'demo',
    nextAction: 'Duetto demo — IDeaS migration path',
    nextActionDate: 'Mar 8, 2026',
    priority: 'medium',
  },
  {
    id: '8',
    hotelName: 'Pacific Crest Hotel',
    contactName: 'Aisha Grant',
    contactRole: 'VP Finance',
    estimatedDealSize: 31000,
    stage: 'won',
    nextAction: 'Onboarding kickoff scheduled',
    nextActionDate: 'Mar 17, 2026',
    priority: 'low',
  },
]

type StageFilter = 'all' | Lead['stage']

const STAGES: { value: StageFilter; label: string }[] = [
  { value: 'all',          label: 'All'          },
  { value: 'discovery',    label: 'Discovery'    },
  { value: 'demo',         label: 'Demo'         },
  { value: 'proposal',     label: 'Proposal'     },
  { value: 'negotiation',  label: 'Negotiation'  },
  { value: 'won',          label: 'Won'          },
  { value: 'lost',         label: 'Lost'         },
]

export function LeadsTab() {
  const [stage, setStage] = useState<StageFilter>('all')

  const filtered = stage === 'all' ? DEMO_LEADS : DEMO_LEADS.filter((l) => l.stage === stage)

  const totalArr = DEMO_LEADS.reduce((s, l) => s + l.estimatedDealSize, 0)
  const formattedArr = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(totalArr)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-duetto-navy">Leads</h1>
          <p className="text-sm text-duetto-gray-500 mt-1">
            {DEMO_LEADS.length} active deals · {formattedArr} pipeline ARR
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={15} />
          Add Lead
        </button>
      </div>

      {/* Stage filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={14} className="text-duetto-gray-400" />
        {STAGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStage(value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              stage === value
                ? 'bg-duetto-navy text-white border-duetto-navy shadow-duetto-sm'
                : 'bg-duetto-white text-duetto-gray-500 border-duetto-gray-200 hover:border-duetto-gray-300 hover:text-duetto-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-12 text-duetto-gray-400 text-sm">
          No leads in this stage.
        </div>
      )}
    </div>
  )
}
