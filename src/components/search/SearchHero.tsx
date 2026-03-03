import { useState, FormEvent } from 'react';
import { Search, Sparkles, Building2, TrendingUp, Users } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'Marriott International',
  'Accor Hotels',
  'Four Seasons',
  'Rosewood Hotels',
  'Minor Hotels',
  'Mandarin Oriental',
];

const CAPABILITIES = [
  { icon: Building2, label: 'Company & Market Research', color: 'text-duetto-blue' },
  { icon: Users, label: 'Stakeholder Mapping', color: 'text-duetto-teal' },
  { icon: TrendingUp, label: 'Personalized Outreach', color: 'text-duetto-green' },
];

interface Props {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function SearchHero({ onSearch, isSearching }: Props) {
  const [input, setInput] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (q) onSearch(q);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      {/* Hero headline */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-duetto-blue-50 border border-duetto-blue-100 mb-6">
          <Sparkles size={14} className="text-duetto-blue" />
          <span className="text-xs font-semibold text-duetto-blue tracking-wide uppercase">
            AI Sales Intelligence
          </span>
        </div>
        <h1 className="text-4xl font-bold text-duetto-navy mb-4 leading-tight">
          Research any hotel brand.<br />
          <span className="text-duetto-blue">Walk in knowing everything.</span>
        </h1>
        <p className="text-duetto-gray-500 text-lg leading-relaxed">
          Enter a hotel brand or property name to generate a comprehensive sales dossier —
          company intel, stakeholder map, media hooks, and ready-to-send outreach in seconds.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
        <div className="relative flex items-center">
          <Search
            size={20}
            className="absolute left-5 text-duetto-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter hotel brand or property (e.g. Accor Hotels, Waldorf Astoria)…"
            disabled={isSearching}
            className="w-full pl-13 pr-36 py-4 text-base rounded-duetto border-2 border-duetto-gray-200
                       bg-white shadow-duetto text-duetto-gray-900 placeholder:text-duetto-gray-400
                       focus:outline-none focus:border-duetto-blue focus:shadow-duetto-glow
                       disabled:opacity-60 transition-all"
            style={{ paddingLeft: '3.25rem' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSearching}
            className="absolute right-2 btn-primary px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Researching…
              </span>
            ) : (
              'Generate Dossier'
            )}
          </button>
        </div>
      </form>

      {/* Example queries */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {EXAMPLE_QUERIES.map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); onSearch(q); }}
            disabled={isSearching}
            className="px-3 py-1.5 text-sm rounded-full border border-duetto-gray-200
                       bg-white text-duetto-gray-600 hover:border-duetto-blue hover:text-duetto-blue
                       hover:bg-duetto-blue-50 transition-all disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Capability pills */}
      <div className="flex flex-wrap gap-6 justify-center">
        {CAPABILITIES.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-duetto-gray-500">
            <Icon size={16} className={color} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
