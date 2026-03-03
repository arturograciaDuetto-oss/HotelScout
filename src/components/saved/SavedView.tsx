import { useState, useMemo } from 'react';
import { Bookmark, Building2, Users, Search, Trash2, ExternalLink, Globe2 } from 'lucide-react';
import { loadProfiles, deleteProfile } from '../../lib/storage';
import type { HotelData } from '../../types';

type ViewMode = 'company' | 'people';
type SortBy = 'recent' | 'name';

interface Props {
  onOpenProfile: (data: HotelData) => void;
}

export function SavedView({ onOpenProfile }: Props) {
  const [profiles, setProfiles] = useState<HotelData[]>(() => loadProfiles());
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('company');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filterSegment, setFilterSegment] = useState('');

  const allSegments = useMemo(() => {
    const segs = new Set<string>();
    profiles.forEach(p => p.portfolio.segments.forEach(s => segs.add(s)));
    return Array.from(segs).sort();
  }, [profiles]);

  const filtered = useMemo(() => {
    let list = [...profiles];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.company.name.toLowerCase().includes(q) ||
        p.query.toLowerCase().includes(q) ||
        p.company.headquarters.toLowerCase().includes(q)
      );
    }
    if (filterSegment) {
      list = list.filter(p => p.portfolio.segments.includes(filterSegment));
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.company.name.localeCompare(b.company.name));
    } else {
      list.sort((a, b) => new Date(b.savedAt ?? b.generatedAt).getTime() - new Date(a.savedAt ?? a.generatedAt).getTime());
    }
    return list;
  }, [profiles, search, filterSegment, sortBy]);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm('Delete this saved profile?')) {
      deleteProfile(id);
      setProfiles(loadProfiles());
    }
  }

  // People view: flatten all stakeholders across profiles
  const allPeople = useMemo(() => {
    if (viewMode !== 'people') return [];
    return filtered.flatMap(p =>
      p.stakeholders
        .filter(s => !s.isDeparted)
        .map(s => ({ ...s, companyName: p.company.name, profileId: p.id, profile: p }))
    );
  }, [filtered, viewMode]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bookmark size={18} className="text-duetto-blue" />
            <h2 className="font-bold text-duetto-navy text-lg">Saved Profiles</h2>
            <span className="badge badge-blue">{profiles.length}</span>
          </div>
          <div className="flex gap-1 bg-duetto-gray-100 p-1 rounded-lg">
            {(['company', 'people'] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all capitalize
                  ${viewMode === v ? 'bg-white shadow-duetto-sm text-duetto-navy' : 'text-duetto-gray-500 hover:text-duetto-gray-700'}`}>
                {v === 'company' ? <><Building2 size={13} className="inline mr-1" />Companies</> : <><Users size={13} className="inline mr-1" />People</>}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-0 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-duetto-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search companies…"
              className="w-full pl-8 pr-3 py-2 rounded-duetto border border-duetto-gray-200 text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-duetto-blue focus:border-transparent" />
          </div>
          {allSegments.length > 0 && (
            <select value={filterSegment} onChange={e => setFilterSegment(e.target.value)}
              className="px-3 py-2 rounded-duetto border border-duetto-gray-200 text-sm bg-white text-duetto-gray-700
                         focus:outline-none focus:ring-2 focus:ring-duetto-blue">
              <option value="">All segments</option>
              {allSegments.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 rounded-duetto border border-duetto-gray-200 text-sm bg-white text-duetto-gray-700
                       focus:outline-none focus:ring-2 focus:ring-duetto-blue">
            <option value="recent">Most recent</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {profiles.length === 0 && (
          <div className="text-center py-16">
            <Bookmark size={40} className="mx-auto text-duetto-gray-200 mb-3" />
            <p className="font-semibold text-duetto-gray-700 mb-1">No saved profiles yet</p>
            <p className="text-duetto-gray-400 text-sm">Search for a hotel brand and save the profile.</p>
          </div>
        )}

        {/* Company view */}
        {viewMode === 'company' && (
          <div className="space-y-3">
            {filtered.map(p => (
              <div key={p.id} onClick={() => onOpenProfile(p)}
                className="card cursor-pointer hover:shadow-duetto-md transition-all group">
                <div className="card-body">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-duetto bg-duetto-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {p.company.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-duetto-navy group-hover:text-duetto-blue transition-colors">{p.company.name}</p>
                          {p.usedWebSearch && <Globe2 size={11} className="text-duetto-green shrink-0" />}
                        </div>
                        <p className="text-duetto-gray-500 text-sm">{p.company.headquarters}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.portfolio.segments.slice(0, 3).map(s => <span key={s} className="badge badge-teal">{s}</span>)}
                          <span className="badge badge-blue">{String(p.portfolio.totalHotels)} hotels</span>
                          <span className="badge badge-navy">{p.techStack.rms}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-1 shrink-0">
                      <span className="text-duetto-gray-400 text-xs mt-0.5">
                        {new Date(p.savedAt ?? p.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <button onClick={e => handleDelete(p.id, e)}
                        className="p-1.5 rounded hover:bg-duetto-red-50 text-duetto-gray-300 hover:text-duetto-red transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {p.notes && (
                    <div className="mt-3 pt-3 border-t border-duetto-gray-100">
                      <p className="text-duetto-gray-500 text-xs line-clamp-2">{p.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && profiles.length > 0 && (
              <p className="text-center text-duetto-gray-400 text-sm py-8">No profiles match your filters.</p>
            )}
          </div>
        )}

        {/* People view */}
        {viewMode === 'people' && (
          <div className="space-y-3">
            {allPeople.map((person, i) => (
              <div key={`${person.profileId}-${person.id}-${i}`} onClick={() => onOpenProfile(person.profile)}
                className="card cursor-pointer hover:shadow-duetto-md transition-all group">
                <div className="card-body flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-duetto-navy flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-duetto-navy text-sm group-hover:text-duetto-blue transition-colors">{person.name}</p>
                    <p className="text-duetto-gray-500 text-xs">{person.title}</p>
                    <p className="text-duetto-gray-400 text-xs mt-0.5">{person.companyName}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {person.email && <span className="text-duetto-gray-500 text-xs">{person.email}</span>}
                      {person.linkedinUrl && (
                        <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-duetto-blue text-xs hover:underline flex items-center gap-0.5">
                          LinkedIn <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {allPeople.length === 0 && (
              <p className="text-center text-duetto-gray-400 text-sm py-8">No people found in filtered profiles.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
