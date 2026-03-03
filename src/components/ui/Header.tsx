import { useState } from 'react';
import { Hotel, ChevronDown, ArrowLeft, Search, Bookmark, BookmarkCheck, Wifi, WifiOff } from 'lucide-react';
import { saveProfile, isSaved, deleteProfile } from '../../lib/storage';
import type { HotelData } from '../../types';

interface Props {
  view: 'search' | 'dossier' | 'saved';
  currentData?: HotelData | null;
  onNewSearch: () => void;
  onSavedView: () => void;
  onDataUpdate?: (data: HotelData) => void;
}

export function Header({ view, currentData, onNewSearch, onSavedView, onDataUpdate }: Props) {
  const [saved, setSaved] = useState(() =>
    currentData ? isSaved(currentData.id) : false
  );

  function handleSaveToggle() {
    if (!currentData) return;
    if (saved) {
      deleteProfile(currentData.id);
      setSaved(false);
    } else {
      const s = saveProfile(currentData);
      onDataUpdate?.(s);
      setSaved(true);
    }
  }

  // Sync saved state when currentData changes
  const isCurrentSaved = currentData ? isSaved(currentData.id) : false;
  if (isCurrentSaved !== saved) setSaved(isCurrentSaved);

  return (
    <header className="bg-duetto-navy text-duetto-white shadow-duetto-lg shrink-0">
      <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand + back */}
        <div className="flex items-center gap-3 shrink-0">
          {(view === 'dossier' || view === 'saved') && (
            <button onClick={onNewSearch}
              className="p-1.5 rounded-lg hover:bg-duetto-navy-700 transition-colors text-duetto-gray-400 hover:text-white"
              title="New search">
              <ArrowLeft size={16} />
            </button>
          )}
          <button onClick={onNewSearch} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-duetto-blue flex items-center justify-center">
              <Hotel size={16} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Hotel<span className="text-duetto-teal-400">Scout</span>
            </span>
          </button>
        </div>

        {/* Center: current query / search indicator */}
        {view === 'dossier' && currentData && (
          <div className="flex items-center gap-2 flex-1 justify-center">
            <button onClick={onNewSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-duetto-navy-700 hover:bg-duetto-navy-600 transition-colors text-sm max-w-xs">
              <Search size={12} className="text-duetto-gray-400 shrink-0" />
              <span className="font-medium text-white truncate">{currentData.company.name}</span>
              <span className="text-duetto-gray-400 text-xs whitespace-nowrap">· New search</span>
            </button>
            {/* Web search indicator */}
            {currentData.usedWebSearch ? (
              <span className="hidden sm:flex items-center gap-1 text-duetto-green text-xs font-medium">
                <Wifi size={12} /> Live
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1 text-duetto-gray-400 text-xs">
                <WifiOff size={12} /> Cached
              </span>
            )}
          </div>
        )}

        {view === 'saved' && (
          <p className="flex-1 text-center text-sm font-medium text-duetto-gray-300">Saved Profiles</p>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Save / unsave current profile */}
          {view === 'dossier' && currentData && (
            <button onClick={handleSaveToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                         hover:bg-duetto-navy-700"
              title={saved ? 'Unsave profile' : 'Save profile'}>
              {saved
                ? <><BookmarkCheck size={15} className="text-duetto-teal" /><span className="hidden sm:block text-duetto-teal">Saved</span></>
                : <><Bookmark size={15} className="text-duetto-gray-400" /><span className="hidden sm:block text-duetto-gray-300">Save</span></>
              }
            </button>
          )}

          {/* Saved profiles button */}
          <button onClick={onSavedView}
            className={`p-2 rounded-lg transition-colors ${view === 'saved' ? 'bg-duetto-navy-700 text-duetto-teal' : 'hover:bg-duetto-navy-700 text-duetto-gray-400 hover:text-white'}`}
            title="Saved profiles">
            <Bookmark size={16} />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-duetto hover:bg-duetto-navy-700 transition-colors">
            <div className="w-7 h-7 rounded-full bg-duetto-blue-400 flex items-center justify-center text-xs font-bold text-white">
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
