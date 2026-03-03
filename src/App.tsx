import { useState, useCallback } from 'react';
import { Header } from './components/ui/Header';
import { SearchHero } from './components/search/SearchHero';
import { DossierView } from './components/dossier/DossierView';
import {
  generateCompanyResearch,
  generateStakeholders,
  generateNewsContent,
  generateActionableOutput,
} from './lib/anthropic';
import type { Dossier, DocumentAnalysis } from './types';

function emptyDossier(query: string): Dossier {
  return {
    query,
    generatedAt: new Date(),
    company: null,
    stakeholders: null,
    newsContent: null,
    documents: [],
    actionable: null,
    loading: { company: true, stakeholders: true, newsContent: true, actionable: false },
    error: { company: null, stakeholders: null, newsContent: null, actionable: null },
  };
}

export default function App() {
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const patchDossier = useCallback(
    (patch: (prev: Dossier) => Dossier) => {
      setDossier(prev => (prev ? patch(prev) : prev));
    },
    []
  );

  async function runCompanyResearch(query: string) {
    patchDossier(d => ({ ...d, loading: { ...d.loading, company: true }, error: { ...d.error, company: null } }));
    try {
      const company = await generateCompanyResearch(query);
      patchDossier(d => ({ ...d, company, loading: { ...d.loading, company: false } }));
    } catch (e) {
      patchDossier(d => ({
        ...d,
        loading: { ...d.loading, company: false },
        error: { ...d.error, company: e instanceof Error ? e.message : 'Failed to load company research' },
      }));
    }
  }

  async function runStakeholders(query: string) {
    patchDossier(d => ({ ...d, loading: { ...d.loading, stakeholders: true }, error: { ...d.error, stakeholders: null } }));
    try {
      const stakeholders = await generateStakeholders(query);
      patchDossier(d => ({ ...d, stakeholders, loading: { ...d.loading, stakeholders: false } }));
    } catch (e) {
      patchDossier(d => ({
        ...d,
        loading: { ...d.loading, stakeholders: false },
        error: { ...d.error, stakeholders: e instanceof Error ? e.message : 'Failed to load stakeholders' },
      }));
    }
  }

  async function runNewsContent(query: string) {
    patchDossier(d => ({ ...d, loading: { ...d.loading, newsContent: true }, error: { ...d.error, newsContent: null } }));
    try {
      const newsContent = await generateNewsContent(query);
      patchDossier(d => ({ ...d, newsContent, loading: { ...d.loading, newsContent: false } }));
    } catch (e) {
      patchDossier(d => ({
        ...d,
        loading: { ...d.loading, newsContent: false },
        error: { ...d.error, newsContent: e instanceof Error ? e.message : 'Failed to load news' },
      }));
    }
  }

  async function runActionable() {
    if (!dossier) return;
    const companyContext = dossier.company
      ? JSON.stringify({
          name: dossier.company.overview.name,
          description: dossier.company.overview.description,
          rms: dossier.company.techStack.rms,
          recentDevelopments: dossier.company.overview.recentDevelopments,
          propertyCount: dossier.company.overview.propertyCount,
          keyMetrics: dossier.company.financials.keyMetrics,
        })
      : dossier.query;

    patchDossier(d => ({ ...d, loading: { ...d.loading, actionable: true }, error: { ...d.error, actionable: null } }));
    try {
      const actionable = await generateActionableOutput(dossier.query, companyContext);
      patchDossier(d => ({ ...d, actionable, loading: { ...d.loading, actionable: false } }));
    } catch (e) {
      patchDossier(d => ({
        ...d,
        loading: { ...d.loading, actionable: false },
        error: { ...d.error, actionable: e instanceof Error ? e.message : 'Failed to generate action plan' },
      }));
    }
  }

  async function handleSearch(query: string) {
    setIsSearching(true);
    const fresh = emptyDossier(query);
    setDossier(fresh);
    setIsSearching(false);

    // Run all three research sections in parallel
    await Promise.all([
      runCompanyResearch(query),
      runStakeholders(query),
      runNewsContent(query),
    ]);
  }

  function handleNewSearch() {
    setDossier(null);
  }

  function handleDocumentAdded(doc: DocumentAnalysis) {
    patchDossier(d => ({ ...d, documents: [...d.documents, doc] }));
  }

  function handleDocumentRemoved(index: number) {
    patchDossier(d => ({ ...d, documents: d.documents.filter((_, i) => i !== index) }));
  }

  return (
    <div className="h-screen flex flex-col bg-duetto-gray-50 font-sora overflow-hidden">
      <Header
        hasDossier={dossier !== null}
        currentQuery={dossier?.query}
        onNewSearch={handleNewSearch}
      />

      {!dossier ? (
        <SearchHero onSearch={handleSearch} isSearching={isSearching} />
      ) : (
        <DossierView
          dossier={dossier}
          onRetry={(section) => {
            if (section === 'company') runCompanyResearch(dossier.query);
            if (section === 'stakeholders') runStakeholders(dossier.query);
            if (section === 'news') runNewsContent(dossier.query);
          }}
          onGenerateActionable={runActionable}
          onRetryActionable={runActionable}
          onDocumentAdded={handleDocumentAdded}
          onDocumentRemoved={handleDocumentRemoved}
        />
      )}
    </div>
  );
}
