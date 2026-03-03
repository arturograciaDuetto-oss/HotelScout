import { Building2, Target, TrendingUp, DollarSign, Users, Zap } from 'lucide-react'
import { MetricCard } from '../cards/MetricCard'
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
]

export function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-duetto-navy">Overview</h1>
        <p className="text-sm text-duetto-gray-500 mt-1">
          Your AI-powered hotel sales pipeline at a glance.
        </p>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          label="Total Prospects"
          value="248"
          subtext="across 14 markets"
          trend="up"
          trendValue="+12 this week"
          accent="blue"
          icon={<Building2 size={18} />}
        />
        <MetricCard
          label="Active Leads"
          value="37"
          subtext="in pipeline"
          trend="up"
          trendValue="+4 this week"
          accent="teal"
          icon={<Target size={18} />}
        />
        <MetricCard
          label="Win Rate"
          value="68%"
          subtext="last 90 days"
          trend="up"
          trendValue="+5 pp"
          accent="green"
          icon={<TrendingUp size={18} />}
        />
        <MetricCard
          label="Pipeline ARR"
          value="$1.2M"
          subtext="weighted"
          trend="up"
          trendValue="+$84K"
          accent="blue"
          icon={<DollarSign size={18} />}
        />
        <MetricCard
          label="AI Briefs"
          value="91"
          subtext="generated today"
          trend="flat"
          trendValue="stable"
          accent="teal"
          icon={<Zap size={18} />}
        />
        <MetricCard
          label="Contacts"
          value="615"
          subtext="decision-makers"
          trend="up"
          trendValue="+23"
          accent="amber"
          icon={<Users size={18} />}
        />
      </div>

      {/* Recent high-priority leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-duetto-navy">High-Priority Leads</h2>
          <button className="text-xs font-semibold text-duetto-blue hover:underline">
            View all →
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_LEADS.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </div>

      {/* Quick stats banner */}
      <div className="card bg-gradient-to-r from-duetto-navy to-duetto-navy-700 text-duetto-white border-0">
        <div className="card-body flex flex-wrap gap-8 items-center">
          <div>
            <p className="text-xs text-duetto-gray-300 uppercase tracking-widest mb-0.5">
              Q1 Target
            </p>
            <p className="text-2xl font-bold">$3.6M ARR</p>
          </div>
          <div className="w-px h-10 bg-duetto-navy-600 hidden sm:block" />
          <div>
            <p className="text-xs text-duetto-gray-300 uppercase tracking-widest mb-0.5">
              Achieved
            </p>
            <p className="text-2xl font-bold text-duetto-teal-400">$2.1M</p>
          </div>
          <div className="w-px h-10 bg-duetto-navy-600 hidden sm:block" />
          <div>
            <p className="text-xs text-duetto-gray-300 uppercase tracking-widest mb-0.5">
              Remaining
            </p>
            <p className="text-2xl font-bold text-duetto-amber">$1.5M</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-duetto-gray-300">58% complete</span>
            </div>
            <div className="w-48 h-2 rounded-full bg-duetto-navy-600">
              <div className="h-full rounded-full bg-duetto-teal" style={{ width: '58%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
