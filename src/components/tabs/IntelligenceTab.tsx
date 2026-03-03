import { useState } from 'react'
import { Sparkles, Send, Loader2, Hotel } from 'lucide-react'
import { IntelCard } from '../cards/IntelCard'
import { generateHotelIntel, scoreProspect } from '../../lib/anthropic'

interface IntelResult {
  hotelName: string
  content: string
}

interface ScoreResult {
  hotelName: string
  score: string
}

export function IntelligenceTab() {
  // Intel generator state
  const [intelHotel, setIntelHotel] = useState('')
  const [intelCity, setIntelCity] = useState('')
  const [intelResult, setIntelResult] = useState<IntelResult | null>(null)
  const [intelLoading, setIntelLoading] = useState(false)
  const [intelError, setIntelError] = useState('')

  // Prospect scorer state
  const [scoreName, setScoreName] = useState('')
  const [scoreRooms, setScoreRooms] = useState('')
  const [scoreStars, setScoreStars] = useState('')
  const [scoreRms, setScoreRms] = useState('')
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreError, setScoreError] = useState('')

  async function handleGenIntel() {
    if (!intelHotel.trim() || !intelCity.trim()) return
    setIntelLoading(true)
    setIntelError('')
    try {
      const content = await generateHotelIntel(intelHotel.trim(), intelCity.trim())
      setIntelResult({ hotelName: intelHotel.trim(), content })
    } catch (err) {
      setIntelError(err instanceof Error ? err.message : 'AI request failed.')
    } finally {
      setIntelLoading(false)
    }
  }

  async function handleScore() {
    if (!scoreName.trim()) return
    setScoreLoading(true)
    setScoreError('')
    try {
      const score = await scoreProspect({
        hotelName: scoreName.trim(),
        rooms: parseInt(scoreRooms, 10) || 0,
        starRating: parseInt(scoreStars, 10) || 0,
        currentRms: scoreRms.trim(),
      })
      setScoreResult({ hotelName: scoreName.trim(), score })
    } catch (err) {
      setScoreError(err instanceof Error ? err.message : 'AI request failed.')
    } finally {
      setScoreLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-duetto-navy">Intelligence</h1>
        <p className="text-sm text-duetto-gray-500 mt-1">
          Claude AI tools for hotel research and prospect scoring.
        </p>
      </div>

      {/* ── Hotel Intel Generator ───────────────────────────── */}
      <div className="card">
        <div className="card-header flex items-center gap-2 bg-duetto-blue-50 border-duetto-blue-100">
          <Sparkles size={16} className="text-duetto-blue" />
          <h2 className="font-semibold text-duetto-navy text-sm">Sales Intel Brief</h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-xs text-duetto-gray-500 leading-relaxed">
            Generate an AI-powered sales brief for any hotel: RevPAR range, pain points,
            and the ideal Duetto pitch angle.
          </p>
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Hotel name"
              value={intelHotel}
              onChange={(e) => setIntelHotel(e.target.value)}
              className="flex-1 min-w-[140px] px-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                         focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
            />
            <input
              type="text"
              placeholder="City"
              value={intelCity}
              onChange={(e) => setIntelCity(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                         focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
            />
            <button
              onClick={handleGenIntel}
              disabled={intelLoading || !intelHotel.trim() || !intelCity.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {intelLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {intelLoading ? 'Generating…' : 'Generate'}
            </button>
          </div>

          {intelError && (
            <p className="text-xs text-duetto-red bg-duetto-red-50 border border-duetto-red-100 px-3 py-2 rounded-duetto">
              {intelError}
            </p>
          )}
        </div>
      </div>

      {(intelResult || intelLoading) && (
        <IntelCard
          hotelName={intelResult?.hotelName ?? intelHotel}
          content={intelResult?.content ?? ''}
          loading={intelLoading}
          onRefresh={handleGenIntel}
        />
      )}

      {/* ── Prospect Scorer ─────────────────────────────────── */}
      <div className="card">
        <div className="card-header flex items-center gap-2 bg-duetto-teal-50 border-duetto-teal-100">
          <Hotel size={16} className="text-duetto-teal" />
          <h2 className="font-semibold text-duetto-navy text-sm">Prospect Scorer</h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-xs text-duetto-gray-500">
            Score a hotel's Duetto RMS adoption likelihood (1–10) based on key attributes.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Hotel name *', placeholder: 'e.g. The Marriott Downtown', value: scoreName, setter: setScoreName },
              { label: 'Current RMS', placeholder: 'e.g. IDeaS, Manual, unknown', value: scoreRms, setter: setScoreRms },
              { label: 'Rooms', placeholder: 'e.g. 250', value: scoreRooms, setter: setScoreRooms },
              { label: 'Star rating', placeholder: '1 – 5', value: scoreStars, setter: setScoreStars },
            ].map(({ label, placeholder, value, setter }) => (
              <div key={label} className="space-y-1">
                <label className="text-xs font-medium text-duetto-gray-600">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                             focus:outline-none focus:ring-2 focus:ring-duetto-teal focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleScore}
            disabled={scoreLoading || !scoreName.trim()}
            className="btn bg-duetto-teal text-white hover:bg-duetto-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scoreLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {scoreLoading ? 'Scoring…' : 'Score Prospect'}
          </button>

          {scoreError && (
            <p className="text-xs text-duetto-red bg-duetto-red-50 border border-duetto-red-100 px-3 py-2 rounded-duetto">
              {scoreError}
            </p>
          )}
        </div>
      </div>

      {scoreResult && (
        <IntelCard
          hotelName={scoreResult.hotelName}
          content={scoreResult.score}
          loading={scoreLoading}
          onRefresh={handleScore}
        />
      )}
    </div>
  )
}
