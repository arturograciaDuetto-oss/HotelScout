import { clsx } from 'clsx'
import { User, Calendar, DollarSign, ArrowRight } from 'lucide-react'

export interface Lead {
  id: string
  hotelName: string
  contactName: string
  contactRole: string
  estimatedDealSize: number   // USD
  stage: 'discovery' | 'demo' | 'proposal' | 'negotiation' | 'won' | 'lost'
  nextAction: string
  nextActionDate: string      // ISO date string
  priority: 'high' | 'medium' | 'low'
}

const STAGE_COLOURS: Record<Lead['stage'], string> = {
  discovery:   'badge badge-blue',
  demo:        'badge badge-teal',
  proposal:    'badge badge-amber',
  negotiation: 'badge badge-navy',
  won:         'badge badge-green',
  lost:        'badge badge-red',
}

const PRIORITY_DOT: Record<Lead['priority'], string> = {
  high:   'bg-duetto-red',
  medium: 'bg-duetto-amber',
  low:    'bg-duetto-green',
}

interface LeadCardProps {
  lead: Lead
  onOpen?: (lead: Lead) => void
}

export function LeadCard({ lead, onOpen }: LeadCardProps) {
  const dealLabel = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(lead.estimatedDealSize)

  return (
    <div
      className="card hover:shadow-duetto-md hover:border-duetto-blue-300 transition-all duration-200 cursor-pointer group"
      onClick={() => onOpen?.(lead)}
    >
      {/* Header strip */}
      <div className="card-header flex items-center justify-between gap-3 bg-duetto-gray-50">
        <div className="flex items-center gap-2 min-w-0">
          <span className={clsx('w-2 h-2 rounded-full shrink-0', PRIORITY_DOT[lead.priority])} />
          <span className="font-semibold text-duetto-navy text-sm truncate">{lead.hotelName}</span>
        </div>
        <span className={STAGE_COLOURS[lead.stage]}>
          {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
        </span>
      </div>

      <div className="card-body space-y-3">
        {/* Contact */}
        <div className="flex items-center gap-2 text-xs text-duetto-gray-600">
          <User size={13} className="text-duetto-gray-400" />
          <span className="font-medium">{lead.contactName}</span>
          <span className="text-duetto-gray-400">·</span>
          <span className="text-duetto-gray-500">{lead.contactRole}</span>
        </div>

        {/* Deal size */}
        <div className="flex items-center gap-2 text-xs">
          <DollarSign size={13} className="text-duetto-teal" />
          <span className="font-semibold text-duetto-navy">{dealLabel}</span>
          <span className="text-duetto-gray-400">est. ARR</span>
        </div>

        {/* Next action */}
        <div className="flex items-start gap-2 text-xs border-t border-duetto-gray-100 pt-3 mt-1">
          <Calendar size={13} className="text-duetto-blue mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-duetto-gray-500 leading-snug">{lead.nextAction}</p>
            <p className="font-semibold text-duetto-navy mt-0.5">{lead.nextActionDate}</p>
          </div>
          <ArrowRight
            size={14}
            className="text-duetto-gray-300 group-hover:text-duetto-blue transition-colors shrink-0 mt-0.5"
          />
        </div>
      </div>
    </div>
  )
}
