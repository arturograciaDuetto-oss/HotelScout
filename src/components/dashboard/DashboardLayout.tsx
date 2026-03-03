import { useState } from 'react';
import { Building2, Users, Newspaper, Upload, Globe2 } from 'lucide-react';
import { OverviewSection } from './OverviewSection';
import { StakeholderGrid } from '../stakeholders/StakeholderGrid';
import { ContentSection } from '../content/ContentSection';
import { DocumentSection } from '../documents/DocumentSection';
import type { HotelData, Stakeholder, DocumentAnalysis } from '../../types';

type Section = 'overview' | 'stakeholders' | 'content' | 'documents';

interface Props {
  data: HotelData;
  onUpdateStakeholder: (s: Stakeholder) => void;
  onAddStakeholder: (s: Stakeholder) => void;
  onAnalyzePersona: (s: Stakeholder) => void;
  onDocumentAdded: (doc: DocumentAnalysis) => void;
  onDocumentRemoved: (id: string) => void;
}

const NAV: { id: Section; label: string; icon: typeof Building2 }[] = [
  { id: 'overview',     label: 'Overview',        icon: Building2 },
  { id: 'stakeholders', label: 'Stakeholders',     icon: Users },
  { id: 'content',      label: 'Content & Hooks',  icon: Newspaper },
  { id: 'documents',    label: 'Documents',         icon: Upload },
];

export function DashboardLayout({
  data,
  onUpdateStakeholder,
  onAddStakeholder,
  onAnalyzePersona,
  onDocumentAdded,
  onDocumentRemoved,
}: Props) {
  const [section, setSection] = useState<Section>('overview');

  const badgeCounts: Partial<Record<Section, number>> = {
    stakeholders: data.stakeholders.filter(s => !s.isDeparted).length,
    content: data.news.length + data.media.length + data.socialPosts.length,
    documents: data.documents.length,
  };

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-duetto-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-duetto-gray-100">
          <p className="text-xs text-duetto-gray-400 uppercase tracking-wide mb-0.5">Research</p>
          <p className="font-bold text-duetto-navy text-sm leading-tight">{data.company.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {data.usedWebSearch ? (
              <span className="flex items-center gap-0.5 text-duetto-green text-xs font-medium">
                <Globe2 size={10} /> Live search
              </span>
            ) : (
              <span className="text-duetto-gray-400 text-xs">AI knowledge base</span>
            )}
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${section === id ? 'bg-duetto-blue-50 text-duetto-blue' : 'text-duetto-gray-600 hover:bg-duetto-gray-100 hover:text-duetto-navy'}`}>
              <Icon size={15} />
              <span className="flex-1 text-left">{label}</span>
              {badgeCounts[id] !== undefined && badgeCounts[id]! > 0 && (
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${section === id ? 'bg-duetto-blue text-white' : 'bg-duetto-gray-200 text-duetto-gray-600'}`}>
                  {badgeCounts[id]}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-duetto-gray-100">
          <p className="text-duetto-gray-400 text-xs text-center">Powered by Claude AI</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-5">
        <div className="max-w-2xl mx-auto">
          {section === 'overview' && <OverviewSection data={data} />}
          {section === 'stakeholders' && (
            <StakeholderGrid
              data={data}
              onUpdateStakeholder={onUpdateStakeholder}
              onAddStakeholder={onAddStakeholder}
              onAnalyzePersona={onAnalyzePersona}
            />
          )}
          {section === 'content' && <ContentSection data={data} />}
          {section === 'documents' && (
            <DocumentSection
              documents={data.documents}
              companyName={data.company.name}
              onDocumentAdded={onDocumentAdded}
              onDocumentRemoved={onDocumentRemoved}
            />
          )}
        </div>
      </main>
    </div>
  );
}
