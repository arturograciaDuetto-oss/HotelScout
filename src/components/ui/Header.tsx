import { Hotel, ChevronDown, ArrowLeft, Search } from 'lucide-react';

interface Props {
  hasDossier: boolean;
  currentQuery?: string;
  onNewSearch: () => void;
}

export function Header({ hasDossier, currentQuery, onNewSearch }: Props) {
  return (
    <header className="bg-duetto-navy text-duetto-white shadow-duetto-lg shrink-0">
      <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand + back button */}
        <div className="flex items-center gap-3 shrink-0">
          {hasDossier && (
            <button
              onClick={onNewSearch}
              className="p-1.5 rounded-lg hover:bg-duetto-navy-700 transition-colors text-duetto-gray-400 hover:text-white"
              title="New search"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-duetto-blue flex items-center justify-center">
              <Hotel size={16} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Hotel<span className="text-duetto-teal-400">Scout</span>
            </span>
          </div>
        </div>

        {/* Current query indicator */}
        {hasDossier && currentQuery && (
          <button
            onClick={onNewSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-duetto-navy-700
                       hover:bg-duetto-navy-600 transition-colors text-sm text-duetto-gray-300 group"
          >
            <Search size={13} className="text-duetto-gray-400" />
            <span className="font-medium text-duetto-white truncate max-w-xs">{currentQuery}</span>
            <span className="text-duetto-gray-400 text-xs group-hover:text-duetto-gray-300 whitespace-nowrap">
              · New search
            </span>
          </button>
        )}

        {/* User */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-duetto
                             hover:bg-duetto-navy-700 transition-colors">
            <div className="w-7 h-7 rounded-full bg-duetto-blue-400 flex items-center justify-center
                            text-xs font-bold text-white">
              AG
            </div>
            <span className="text-sm font-medium hidden sm:block">Arturo</span>
            <ChevronDown size={13} className="text-duetto-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
