import { clsx } from 'clsx'
import { MapPin, Star, Bed, ExternalLink } from 'lucide-react'

export interface Hotel {
  id: string
  name: string
  city: string
  country: string
  stars: number
  rooms: number
  currentRms: string
  score: number          // 1–10 Duetto prospect score
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  logoInitials?: string
}

const STATUS_BADGE: Record<Hotel['status'], string> = {
  new:       'badge badge-blue',
  contacted: 'badge badge-amber',
  qualified: 'badge badge-teal',
  closed:    'badge badge-navy',
}

const STATUS_LABEL: Record<Hotel['status'], string> = {
  new:       'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  closed:    'Closed',
}

const SCORE_COLOUR = (score: number) => {
  if (score >= 8) return 'text-duetto-green font-bold'
  if (score >= 5) return 'text-duetto-amber font-bold'
  return 'text-duetto-red font-bold'
}

interface HotelCardProps {
  hotel: Hotel
  onSelect?: (hotel: Hotel) => void
}

export function HotelCard({ hotel, onSelect }: HotelCardProps) {
  return (
    <div
      className={clsx(
        'card group cursor-pointer hover:shadow-duetto-md hover:border-duetto-blue-300 transition-all duration-200',
      )}
      onClick={() => onSelect?.(hotel)}
    >
      <div className="card-body flex items-start gap-4">
        {/* Logo / Initials */}
        <div className="w-12 h-12 rounded-duetto bg-duetto-navy flex items-center justify-center
                        text-duetto-white font-bold text-sm shrink-0 uppercase shadow-duetto-sm">
          {hotel.logoInitials ?? hotel.name.slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-duetto-navy text-sm leading-tight truncate">
              {hotel.name}
            </h3>
            <span className={STATUS_BADGE[hotel.status]}>
              {STATUS_LABEL[hotel.status]}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-duetto-gray-500">
            <MapPin size={11} />
            <span>{hotel.city}, {hotel.country}</span>
          </div>

          <div className="flex items-center gap-3 mt-2.5 text-xs text-duetto-gray-500">
            <span className="flex items-center gap-1">
              <Star size={11} className="fill-duetto-amber text-duetto-amber" />
              {hotel.stars}-star
            </span>
            <span className="flex items-center gap-1">
              <Bed size={11} />
              {hotel.rooms} rooms
            </span>
            <span className="text-duetto-gray-400">RMS: {hotel.currentRms}</span>
          </div>
        </div>

        {/* Score */}
        <div className="shrink-0 text-right">
          <p className="text-[10px] text-duetto-gray-400 uppercase tracking-widest mb-0.5">Score</p>
          <p className={clsx('text-xl', SCORE_COLOUR(hotel.score))}>{hotel.score}</p>
          <ExternalLink size={12} className="ml-auto mt-1 text-duetto-gray-300 group-hover:text-duetto-blue transition-colors" />
        </div>
      </div>
    </div>
  )
}
