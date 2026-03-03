import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export type Trend = 'up' | 'down' | 'flat'

interface MetricCardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: Trend
  trendValue?: string
  accent?: 'blue' | 'teal' | 'amber' | 'green' | 'red'
  icon?: React.ReactNode
}

const TREND_ICON = {
  up:   TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

const TREND_COLOUR: Record<Trend, string> = {
  up:   'text-duetto-green',
  down: 'text-duetto-red',
  flat: 'text-duetto-gray-400',
}

const ACCENT_BAR: Record<NonNullable<MetricCardProps['accent']>, string> = {
  blue:  'bg-duetto-blue',
  teal:  'bg-duetto-teal',
  amber: 'bg-duetto-amber',
  green: 'bg-duetto-green',
  red:   'bg-duetto-red',
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  trendValue,
  accent = 'blue',
  icon,
}: MetricCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend] : null

  return (
    <div className="card relative overflow-visible">
      {/* Accent strip */}
      <div className={clsx('absolute top-0 left-0 w-1 h-full rounded-l-duetto', ACCENT_BAR[accent])} />

      <div className="card-body pl-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-duetto-gray-400 mb-1.5">
              {label}
            </p>
            <p className="text-3xl font-bold text-duetto-navy tracking-tight truncate">
              {value}
            </p>
            {subtext && (
              <p className="mt-1 text-xs text-duetto-gray-500">{subtext}</p>
            )}
          </div>

          {icon && (
            <div className="w-10 h-10 rounded-duetto bg-duetto-gray-100 flex items-center justify-center
                            text-duetto-gray-400 shrink-0">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className={clsx('flex items-center gap-1 mt-3 text-xs font-semibold', TREND_COLOUR[trend])}>
            {TrendIcon && <TrendIcon size={13} />}
            <span>{trendValue ?? trend}</span>
          </div>
        )}
      </div>
    </div>
  )
}
