import { useState } from 'react';
import { Building2, Users, Newspaper, Upload, Zap } from 'lucide-react';
import { CompanySection } from './CompanySection';
import { StakeholderSection } from './StakeholderSection';
import { NewsSection } from './NewsSection';
import { DocumentSection } from './DocumentSection';
import { ActionableSection } from './ActionableSection';
import type { Dossier, DocumentAnalysis } from '../../types';

type Section = 'company' | 'stakeholders' | 'news' | 'documents' | 'actionable';

interface Props {
  dossier: Dossier;
  onRetry: (section: 'company' | 'stakeholders' | 'news') => void;
  onGenerateActionable: () => void;
  onRetryActionable: () => void;
  onDocumentAdded: (doc: DocumentAnalysis) => void;
  onDocumentRemoved: (index: number) => void;
}

const NAV_ITEMS: { id: Section; label: string; icon: typeof Building2 }[] = [
  { id: 'company',      label: 'Company & Market', icon: Building2 },
  { id: 'stakeholders', label: 'Stakeholders',     icon: Users },
  { id: 'news',         label: 'News & Content',   icon: Newspaper },
  { id: 'documents',    label: 'Documents',         icon: Upload },
  { id: 'actionable',   label: 'Action Center',    icon: Zap },
];

function LoadingDot({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="ml-auto w-2 h-2 rounded-full bg-duetto-amber animate-pulse" />
  );
}

export function DossierView({
  dossier,
  onRetry,
  onGenerateActionable,
  onRetryActionable,
  onDocumentAdded,
  onDocumentRemoved,
}: Props) {
  const [activeSection, setActiveSection] = useState<Section>('company');

  const isLoading = (s: Section) => {
    if (s === 'company') return dossier.loading.company;
    if (s === 'stakeholders') return dossier.loading.stakeholders;
    if (s === 'news') return dossier.loading.newsContent;
    if (s === 'actionable') return dossier.loading.actionable;
    return false;
  };

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      {/* Left sidebar navigation */}
      <aside className="w-56 bg-white border-r border-duetto-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-duetto-gray-100">
          <p className="text-xs text-duetto-gray-400 uppercase tracking-wide mb-0.5">Dossier</p>
          <p className="font-bold text-duetto-navy text-sm leading-tight truncate">{dossier.query}</p>
          <p className="text-duetto-gray-400 text-xs mt-0.5">
            {dossier.generatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeSection === id
                  ? 'bg-duetto-blue-50 text-duetto-blue'
                  : 'text-duetto-gray-600 hover:bg-duetto-gray-100 hover:text-duetto-navy'
                }`}
            >
              <Icon size={15} />
              <span className="flex-1 text-left">{label}</span>
              <LoadingDot active={isLoading(id)} />
              {id === 'documents' && dossier.documents.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-duetto-amber text-white text-xs flex items-center justify-center ml-auto">
                  {dossier.documents.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-duetto-gray-100">
          <p className="text-duetto-gray-400 text-xs text-center">
            Powered by Claude AI × Duetto
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {activeSection === 'company' && (
            <CompanySection
              data={dossier.company}
              loading={dossier.loading.company}
              error={dossier.error.company}
              onRetry={() => onRetry('company')}
            />
          )}
          {activeSection === 'stakeholders' && (
            <StakeholderSection
              data={dossier.stakeholders}
              loading={dossier.loading.stakeholders}
              error={dossier.error.stakeholders}
              onRetry={() => onRetry('stakeholders')}
            />
          )}
          {activeSection === 'news' && (
            <NewsSection
              data={dossier.newsContent}
              loading={dossier.loading.newsContent}
              error={dossier.error.newsContent}
              onRetry={() => onRetry('news')}
            />
          )}
          {activeSection === 'documents' && (
            <DocumentSection
              documents={dossier.documents}
              hotelQuery={dossier.query}
              onDocumentAdded={onDocumentAdded}
              onDocumentRemoved={onDocumentRemoved}
            />
          )}
          {activeSection === 'actionable' && (
            <ActionableSection
              data={dossier.actionable}
              loading={dossier.loading.actionable}
              error={dossier.error.actionable}
              onRetry={onRetryActionable}
              onGenerate={onGenerateActionable}
              canGenerate={!dossier.loading.company && dossier.company !== null}
            />
          )}
        </div>
      </main>
    </div>
  );
}
