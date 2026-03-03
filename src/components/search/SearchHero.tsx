import { useState, FormEvent } from 'react';
import { Search, Sparkles, Building2, Users, Newspaper, FileText, Zap, Globe2, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'Marriott International', 'Accor Hotels', 'Four Seasons',
  'Rosewood Hotels', 'Minor Hotels', 'Mandarin Oriental',
];

const CAPABILITIES = [
  { icon: Building2,  label: 'Company & Market Research', color: 'text-duetto-pine' },
  { icon: Users,      label: 'Stakeholder Mapping',       color: 'text-duetto-purple' },
  { icon: Newspaper,  label: 'News & Content Hooks',      color: 'text-duetto-orange' },
  { icon: FileText,   label: 'Document Analysis',         color: 'text-duetto-moss' },
  { icon: Zap,        label: 'Personalized Pitches',      color: 'text-duetto-red' },
];

interface Props {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function SearchHero({ onSearch, isSearching }: Props) {
  const [input, setInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showKeyValue, setShowKeyValue] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const storedKey = localStorage.getItem('anthropic_api_key') ?? '';
  const hasKey = storedKey.length > 0;

  function handleSaveKey() {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    localStorage.setItem('anthropic_api_key', trimmed);
    setApiKeyInput('');
    setKeySaved(true);
    setShowKeyInput(false);
    setTimeout(() => setKeySaved(false), 3000);
  }

  function handleClearKey() {
    localStorage.removeItem('anthropic_api_key');
    setKeySaved(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (q) onSearch(q);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center mb-10 max-w-2xl">
        {/* Badge pill — Mint bg + Pine Green text */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-duetto-teal-100 border border-duetto-teal-50 mb-5">
          <Globe2 size={13} className="text-duetto-pine" />
          <span className="text-xs font-semibold text-duetto-pine tracking-wide uppercase">
            AI + Web Search Intelligence
          </span>
        </div>
        <h1 className="text-4xl font-bold text-duetto-navy mb-4 leading-tight">
          Research any hotel brand.<br />
          <span className="text-duetto-pine">Walk in knowing everything.</span>
        </h1>
        <p className="text-duetto-gray-500 text-lg leading-relaxed">
          Enter a hotel brand or property name to generate a comprehensive sales dossier —
          live web data, decision-maker profiles, media hooks, and pitch-ready emails.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-7">
        <div className="relative flex items-center">
          <Search size={20} className="absolute text-duetto-gray-400 pointer-events-none" style={{ left: '1rem' }} />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter hotel brand or property (e.g. Accor Hotels, Waldorf Astoria)…"
            disabled={isSearching}
            className="w-full py-4 rounded-duetto border-2 border-duetto-gray-200 bg-white shadow-duetto
                       text-duetto-navy placeholder:text-duetto-gray-400
                       focus:outline-none focus:border-duetto-pine focus:shadow-duetto-glow
                       disabled:opacity-60 transition-all"
            style={{ paddingLeft: '3rem', paddingRight: '11rem' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSearching || !hasKey}
            className="absolute right-2 btn-primary px-5 py-2.5 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSearching ? (
              <><span className="w-4 h-4 border-2 border-duetto-midnight border-t-transparent rounded-full animate-spin" />Researching…</>
            ) : (
              <><Sparkles size={14} />Generate Dossier</>
            )}
          </button>
        </div>
      </form>

      {/* API Key section */}
      <div className="w-full max-w-2xl mb-5">
        {!hasKey && !showKeyInput && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-duetto bg-duetto-amber-50 border border-duetto-amber-100 text-sm">
            <Key size={15} className="text-duetto-orange shrink-0" />
            <span className="text-duetto-navy flex-1">An Anthropic API key is required to generate dossiers.</span>
            <button onClick={() => setShowKeyInput(true)}
              className="px-3 py-1 rounded-lg bg-duetto-orange text-white text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
              Add API Key
            </button>
          </div>
        )}

        {hasKey && !showKeyInput && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-duetto bg-duetto-green-100 border border-duetto-green-50 text-sm">
            <CheckCircle size={15} className="text-duetto-green shrink-0" />
            <span className="text-duetto-moss flex-1 font-medium">API key configured</span>
            <button onClick={() => setShowKeyInput(true)}
              className="text-xs text-duetto-pine hover:text-duetto-moss underline">
              Change
            </button>
            <button onClick={handleClearKey}
              className="text-xs text-duetto-red hover:opacity-70 underline ml-1">
              Remove
            </button>
          </div>
        )}

        {keySaved && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-duetto bg-duetto-green-100 border border-duetto-green-50 text-sm text-duetto-moss">
            <CheckCircle size={15} className="text-duetto-green" /> API key saved successfully.
          </div>
        )}

        {showKeyInput && (
          <div className="p-4 rounded-duetto border border-duetto-gray-200 bg-white shadow-duetto-sm">
            <p className="text-xs text-duetto-gray-500 mb-2 font-medium">
              Enter your <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
                className="text-duetto-pine underline">Anthropic API key</a> — stored only in your browser.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeyValue ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
                  placeholder="sk-ant-api03-…"
                  className="w-full px-3 py-2 pr-9 rounded-lg border border-duetto-gray-200 text-sm focus:outline-none focus:border-duetto-pine text-duetto-navy"
                />
                <button type="button" onClick={() => setShowKeyValue(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-duetto-gray-400 hover:text-duetto-gray-600">
                  {showKeyValue ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button onClick={handleSaveKey} disabled={!apiKeyInput.trim()}
                className="btn-primary px-4 py-2 disabled:opacity-40">
                Save
              </button>
              <button onClick={() => setShowKeyInput(false)}
                className="btn-secondary px-3 py-2">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Example query chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {EXAMPLE_QUERIES.map(q => (
          <button key={q} onClick={() => { setInput(q); onSearch(q); }} disabled={isSearching}
            className="px-3 py-1.5 text-sm rounded-full border border-duetto-gray-200 bg-white
                       text-duetto-gray-600 hover:border-duetto-pine hover:text-duetto-pine hover:bg-duetto-blue-50
                       transition-all disabled:opacity-40">
            {q}
          </button>
        ))}
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-5 justify-center">
        {CAPABILITIES.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-duetto-gray-500">
            <Icon size={14} className={color} />{label}
          </div>
        ))}
      </div>
    </div>
  );
}
