import { Sparkles, RefreshCw } from 'lucide-react'
import { clsx } from 'clsx'

interface IntelCardProps {
  hotelName: string
  content: string
  loading?: boolean
  onRefresh?: () => void
}

export function IntelCard({ hotelName, content, loading = false, onRefresh }: IntelCardProps) {
  return (
    <div className="card border-duetto-blue-100">
      <div className="card-header flex items-center justify-between gap-3 bg-duetto-blue-50">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-duetto-blue" />
          <span className="text-sm font-semibold text-duetto-navy">
            AI Intel · <span className="text-duetto-blue">{hotelName}</span>
          </span>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh intel"
            className="btn-ghost px-2 py-1 text-duetto-gray-500 hover:text-duetto-blue disabled:opacity-40"
          >
            <RefreshCw size={13} className={clsx(loading && 'animate-spin')} />
          </button>
        )}
      </div>

      <div className="card-body">
        {loading ? (
          <div className="space-y-2.5">
            {[100, 90, 75].map((w) => (
              <div
                key={w}
                className="h-3 rounded-full bg-duetto-gray-100 animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-duetto-gray-700 leading-relaxed whitespace-pre-line">
            {content || 'No intel available. Click refresh to generate.'}
          </p>
        )}
      </div>
    </div>
  )
}
