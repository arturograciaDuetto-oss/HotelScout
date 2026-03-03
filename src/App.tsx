import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Header } from './components/ui/Header';
import { SearchHero } from './components/search/SearchHero';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { NotesPanel } from './components/dashboard/NotesPanel';
import { SavedView } from './components/saved/SavedView';
import { PersonaModal } from './components/stakeholders/PersonaModal';
import { generateDossier } from './lib/anthropic';
import { isSaved } from './lib/storage';
import type { HotelData, Stakeholder, DocumentAnalysis } from './types';

type View = 'search' | 'dossier' | 'saved';

export default function App() {
  const [view, setView] = useState<View>('search');
  const [currentData, setCurrentData] = useState<HotelData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [personaTarget, setPersonaTarget] = useState<Stakeholder | null>(null);

  async function handleSearch(query: string) {
    setIsGenerating(true);
    setGenerateError(null);
    setView('dossier');
    setCurrentData(null);
    try {
      const data = await generateDossier(query);
      setCurrentData(data);
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : 'Generation failed. Check your API key.');
      setView('search');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleUpdateStakeholder(updated: Stakeholder) {
    setCurrentData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        stakeholders: prev.stakeholders.map(s => s.id === updated.id ? updated : s),
      };
    });
  }

  function handleAddStakeholder(s: Stakeholder) {
    setCurrentData(prev => prev ? { ...prev, stakeholders: [...prev.stakeholders, s] } : prev);
  }

  function handleDocumentAdded(doc: DocumentAnalysis) {
    setCurrentData(prev => prev ? { ...prev, documents: [...prev.documents, doc] } : prev);
  }

  function handleDocumentRemoved(id: string) {
    setCurrentData(prev => prev ? { ...prev, documents: prev.documents.filter(d => d.id !== id) } : prev);
  }

  function handleNotesChange(notes: string) {
    setCurrentData(prev => prev ? { ...prev, notes } : prev);
  }

  function handleOpenSavedProfile(data: HotelData) {
    setCurrentData(data);
    setView('dossier');
  }

  return (
    <div className="h-screen flex flex-col bg-duetto-gray-50 font-sora overflow-hidden">
      <Header
        view={view}
        currentData={currentData}
        onNewSearch={() => { setView('search'); setCurrentData(null); setGenerateError(null); }}
        onSavedView={() => setView(view === 'saved' ? 'search' : 'saved')}
        onDataUpdate={setCurrentData}
      />

      {/* Search view */}
      {view === 'search' && !isGenerating && (
        <SearchHero onSearch={handleSearch} isSearching={isGenerating} />
      )}

      {/* Generating overlay */}
      {view === 'dossier' && isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-duetto-gray-500">
          <div className="relative">
            <Loader2 size={40} className="animate-spin text-duetto-blue" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-duetto-navy text-lg mb-1">Researching…</p>
            <p className="text-duetto-gray-500 text-sm">Using web search to find real-time intelligence</p>
            <p className="text-duetto-gray-400 text-xs mt-1">This may take 15–30 seconds</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {generateError && view === 'search' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-duetto-red text-white px-4 py-3 rounded-duetto shadow-duetto-lg text-sm max-w-md">
          {generateError}
        </div>
      )}

      {/* Dossier view */}
      {view === 'dossier' && currentData && !isGenerating && (
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <DashboardLayout
            data={currentData}
            onUpdateStakeholder={handleUpdateStakeholder}
            onAddStakeholder={handleAddStakeholder}
            onAnalyzePersona={setPersonaTarget}
            onDocumentAdded={handleDocumentAdded}
            onDocumentRemoved={handleDocumentRemoved}
          />
          <NotesPanel
            profileId={currentData.id}
            notes={currentData.notes}
            isSaved={isSaved(currentData.id)}
            onNotesChange={handleNotesChange}
          />
        </div>
      )}

      {/* Saved profiles view */}
      {view === 'saved' && (
        <SavedView onOpenProfile={handleOpenSavedProfile} />
      )}

      {/* Persona Modal */}
      {personaTarget && currentData && (
        <PersonaModal
          stakeholder={personaTarget}
          hotelData={currentData}
          onClose={() => setPersonaTarget(null)}
        />
      )}
    </div>
  );
}
