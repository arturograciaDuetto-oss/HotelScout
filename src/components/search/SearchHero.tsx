import { useState, FormEvent } from 'react';
import { Search, Sparkles, Building2, Users, Newspaper, FileText, Zap, Globe2 } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'Marriott International', 'Accor Hotels', 'Four Seasons',
  'Rosewood Hotels', 'Minor Hotels', 'Mandarin Oriental',
];

const CAPABILITIES = [
  { icon: Building2,  label: 'Company & Market Research', color: 'text-duetto-blue' },
  { icon: Users,      label: 'Stakeholder Mapping',       color: 'text-duetto-teal' },
  { icon: Newspaper,  label: 'News & Content Hooks',      color: 'text-duetto-amber' },
  { icon: FileText,   label: 'Document Analysis',         color: 'text-duetto-green' },
  { icon: Zap,        label: 'Personalized Pitches',      color: 'text-duetto-red' },
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
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-duetto-blue-50 border border-duetto-blue-100 mb-5">
          <Globe2 size={13} className="text-duetto-blue" />
          <span className="text-xs font-semibold text-duetto-blue tracking-wide uppercase">
            AI + Web Search Intelligence
          </span>
        </div>
        <h1 className="text-4xl font-bold text-duetto-navy mb-4 leading-tight">
          Research any hotel brand.<br />
          <span className="text-duetto-blue">Walk in knowing everything.</span>
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
                       text-duetto-gray-900 placeholder:text-duetto-gray-400
                       focus:outline-none focus:border-duetto-blue focus:shadow-duetto-glow
                       disabled:opacity-60 transition-all"
            style={{ paddingLeft: '3rem', paddingRight: '11rem' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSearching}
            className="absolute right-2 btn-primary px-5 py-2.5 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSearching ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Researching…</>
            ) : (
              <><Sparkles size={14} />Generate Dossier</>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {EXAMPLE_QUERIES.map(q => (
          <button key={q} onClick={() => { setInput(q); onSearch(q); }} disabled={isSearching}
            className="px-3 py-1.5 text-sm rounded-full border border-duetto-gray-200 bg-white
                       text-duetto-gray-600 hover:border-duetto-blue hover:text-duetto-blue hover:bg-duetto-blue-50
                       transition-all disabled:opacity-40">
            {q}
          </button>
        ))}
      </div>

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
