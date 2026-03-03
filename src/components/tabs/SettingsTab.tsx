import { useState } from 'react'
import { Save, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export function SettingsTab() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_ANTHROPIC_API_KEY ?? '')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const [territory, setTerritory] = useState('EMEA')
  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const hasKey = apiKey.trim().startsWith('sk-ant-')

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-duetto-navy">Settings</h1>
        <p className="text-sm text-duetto-gray-500 mt-1">
          Configure your HotelScout environment and AI preferences.
        </p>
      </div>

      {/* ── API Key ─────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-duetto-navy">Anthropic API Key</h2>
        </div>
        <div className="card-body space-y-4">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-duetto text-xs font-medium border ${
              hasKey
                ? 'bg-duetto-green-50 border-duetto-green-100 text-duetto-green'
                : 'bg-duetto-amber-50 border-duetto-amber-100 text-duetto-amber'
            }`}
          >
            {hasKey
              ? <><CheckCircle2 size={13} /> API key detected — AI features enabled</>
              : <><AlertCircle size={13} /> No valid key — add VITE_ANTHROPIC_API_KEY to .env.local</>
            }
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-duetto-gray-600">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-…"
                className="w-full pr-10 pl-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                           font-mono tracking-wide focus:outline-none focus:ring-2
                           focus:ring-duetto-blue focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                aria-label="Toggle key visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-duetto-gray-400 hover:text-duetto-gray-600"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[11px] text-duetto-gray-400">
              Changes here are session-only. For persistence, update your <code className="bg-duetto-gray-100 px-1 rounded">.env.local</code> file.
            </p>
          </div>
        </div>
      </div>

      {/* ── Regional ────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-duetto-navy">Regional Preferences</h2>
        </div>
        <div className="card-body grid sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Territory',
              value: territory,
              setter: setTerritory,
              options: ['EMEA', 'AMER', 'APAC', 'LATAM', 'Global'],
            },
            {
              label: 'Currency',
              value: currency,
              setter: setCurrency,
              options: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
            },
            {
              label: 'Language',
              value: language,
              setter: setLanguage,
              options: ['en', 'es', 'fr', 'de', 'ja'],
            },
          ].map(({ label, value, setter, options }) => (
            <div key={label} className="space-y-1">
              <label className="text-xs font-medium text-duetto-gray-600">{label}</label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-duetto-gray-200 rounded-duetto
                           bg-duetto-white focus:outline-none focus:ring-2 focus:ring-duetto-blue
                           focus:border-transparent"
              >
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Model ─────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-duetto-navy">AI Model</h2>
        </div>
        <div className="card-body space-y-3">
          {[
            { id: 'sonnet', label: 'Claude Sonnet 4.6', sub: 'Best balance of speed and intelligence (recommended)', checked: true },
            { id: 'haiku',  label: 'Claude Haiku 4.5',  sub: 'Fastest responses, ideal for bulk scoring',            checked: false },
          ].map(({ id, label, sub, checked }) => (
            <label key={id} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="model"
                defaultChecked={checked}
                className="mt-0.5 accent-duetto-blue"
              />
              <div>
                <p className="text-sm font-medium text-duetto-navy group-hover:text-duetto-blue transition-colors">
                  {label}
                </p>
                <p className="text-xs text-duetto-gray-500">{sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary">
          <Save size={14} />
          Save Settings
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-duetto-green">
            <CheckCircle2 size={14} />
            Saved!
          </span>
        )}
      </div>
    </div>
  )
}
