import { useState } from 'react'
import { Megaphone, Mail, MessageSquare, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { askClaude } from '../../lib/anthropic'

type Channel = 'email' | 'linkedin'

interface Campaign {
  id: string
  name: string
  channel: Channel
  status: 'draft' | 'active' | 'paused' | 'completed'
  sent: number
  opened: number
  replied: number
}

const DEMO_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'APAC Q1 — Independent Luxury',  channel: 'email',    status: 'active',    sent: 142, opened: 89,  replied: 21 },
  { id: '2', name: 'EMEA — IDeaS Migration',         channel: 'email',    status: 'active',    sent: 98,  opened: 61,  replied: 14 },
  { id: '3', name: 'US Boutique — Spring Push',       channel: 'linkedin', status: 'paused',    sent: 55,  opened: 38,  replied: 9  },
  { id: '4', name: 'LatAm — Manual RMS Targets',     channel: 'email',    status: 'draft',     sent: 0,   opened: 0,   replied: 0  },
  { id: '5', name: 'Europe — Revenue Directors',     channel: 'linkedin', status: 'completed', sent: 210, opened: 162, replied: 44 },
]

const STATUS_BADGE: Record<Campaign['status'], string> = {
  draft:     'badge badge-blue',
  active:    'badge badge-teal',
  paused:    'badge badge-amber',
  completed: 'badge badge-navy',
}

export function OutreachTab() {
  const [hotelName, setHotelName] = useState('')
  const [contactName, setContactName] = useState('')
  const [channel, setChannel] = useState<Channel>('email')
  const [generated, setGenerated] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!hotelName.trim()) return
    setLoading(true)
    setError('')
    setGenerated('')
    try {
      const prompt =
        `Write a concise, personalised Duetto Revenue Management outreach ${channel === 'email' ? 'email' : 'LinkedIn message'} ` +
        `to ${contactName.trim() || 'the revenue manager'} at ${hotelName.trim()}. ` +
        `Focus on increasing RevPAR through automated pricing. Keep it under 120 words, friendly and direct. ` +
        `Include a clear CTA for a 20-min discovery call.`
      const text = await askClaude(prompt)
      setGenerated(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!generated) return
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const rate = (n: number, d: number) => (d === 0 ? '—' : `${Math.round((n / d) * 100)}%`)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-duetto-navy">Outreach</h1>
        <p className="text-sm text-duetto-gray-500 mt-1">
          AI-drafted messages and campaign performance tracking.
        </p>
      </div>

      {/* ── Campaigns table ──────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-duetto-navy mb-3">Active Campaigns</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-duetto-gray-50 border-b border-duetto-gray-100 text-left">
                {['Campaign', 'Channel', 'Status', 'Sent', 'Open Rate', 'Reply Rate'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-duetto-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-duetto-gray-100">
              {DEMO_CAMPAIGNS.map((c) => (
                <tr key={c.id} className="hover:bg-duetto-blue-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-duetto-navy">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-duetto-gray-600">
                      {c.channel === 'email'
                        ? <Mail size={13} className="text-duetto-blue" />
                        : <MessageSquare size={13} className="text-duetto-teal" />
                      }
                      {c.channel === 'email' ? 'Email' : 'LinkedIn'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={STATUS_BADGE[c.status]}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-duetto-gray-700">{c.sent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-duetto-gray-700">{rate(c.opened, c.sent)}</td>
                  <td className="px-4 py-3 font-semibold text-duetto-teal">{rate(c.replied, c.sent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── AI Message Drafter ───────────────────────────────── */}
      <div className="card max-w-2xl">
        <div className="card-header flex items-center gap-2 bg-duetto-blue-50 border-duetto-blue-100">
          <Megaphone size={16} className="text-duetto-blue" />
          <h2 className="font-semibold text-duetto-navy text-sm">AI Message Drafter</h2>
        </div>
        <div className="card-body space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-duetto-gray-600">Hotel name *</label>
              <input
                type="text"
                placeholder="e.g. The Grand Palacio"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                           focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-duetto-gray-600">Contact name</label>
              <input
                type="text"
                placeholder="e.g. Sofia Reyes"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                           focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Channel toggle */}
          <div className="flex items-center gap-2">
            {(['email', 'linkedin'] as Channel[]).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-duetto text-xs font-semibold border transition-all ${
                  channel === ch
                    ? 'bg-duetto-blue text-white border-duetto-blue shadow-duetto-sm'
                    : 'bg-duetto-white text-duetto-gray-500 border-duetto-gray-200 hover:border-duetto-gray-300'
                }`}
              >
                {ch === 'email' ? <Mail size={13} /> : <MessageSquare size={13} />}
                {ch === 'email' ? 'Email' : 'LinkedIn'}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !hotelName.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <Loader2 size={14} className="animate-spin" />
              : <Sparkles size={14} />
            }
            {loading ? 'Drafting…' : 'Draft Message'}
          </button>

          {error && (
            <p className="text-xs text-duetto-red bg-duetto-red-50 border border-duetto-red-100 px-3 py-2 rounded-duetto">
              {error}
            </p>
          )}

          {generated && (
            <div className="rounded-duetto border border-duetto-blue-100 bg-duetto-blue-50 p-4 space-y-3">
              <p className="text-sm text-duetto-gray-800 whitespace-pre-line leading-relaxed">
                {generated}
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold text-duetto-blue hover:text-duetto-blue-600"
              >
                {copied
                  ? <><CheckCircle2 size={13} className="text-duetto-green" /> Copied!</>
                  : 'Copy to clipboard'
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
