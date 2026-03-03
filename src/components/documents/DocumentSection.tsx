import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, BarChart2, TrendingUp, Target, X, Loader2 } from 'lucide-react';
import { analyzeUploadedDocument } from '../../lib/anthropic';
import { parseFile } from '../../lib/fileParser';
import type { DocumentAnalysis } from '../../types';

interface Props {
  documents: DocumentAnalysis[];
  companyName: string;
  onDocumentAdded: (doc: DocumentAnalysis) => void;
  onDocumentRemoved: (id: string) => void;
}

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

const KPI_TYPE_COLORS = {
  revenue: 'bg-duetto-blue-50 text-duetto-blue',
  occupancy: 'bg-duetto-teal-50 text-duetto-teal',
  profitability: 'bg-duetto-green-50 text-duetto-green',
  other: 'bg-duetto-gray-100 text-duetto-gray-600',
} as const;

export function DocumentSection({ documents, companyName, onDocumentAdded, onDocumentRemoved }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setCurrentFile(file.name);
    try {
      const { text, fileType, documentType } = await parseFile(file);
      const result = await analyzeUploadedDocument(text, file.name, companyName);
      onDocumentAdded({
        id: uid(),
        fileName: file.name,
        fileType,
        documentType,
        uploadedAt: new Date().toISOString(),
        kpis: result.kpis,
        trends: result.trends,
        executiveSummary: result.executiveSummary,
        duettoAngle: result.duettoAngle,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setCurrentFile('');
    }
  }, [companyName, onDocumentAdded]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-duetto-gray-500 text-sm leading-relaxed mb-4">
          Upload Hotstats profitability reports, STR/market analyses, or P&amp;L statements.
          KPIs are extracted to bridge top-line revenue goals with bottom-line profitability.
        </p>

        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-duetto p-8 text-center transition-all
            ${isDragging ? 'border-duetto-blue bg-duetto-blue-50' : 'border-duetto-gray-200 hover:border-duetto-gray-300 bg-duetto-gray-50'}
            ${isAnalyzing ? 'opacity-60 pointer-events-none' : ''}`}>
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="text-duetto-blue animate-spin" />
              <div>
                <p className="font-semibold text-duetto-navy text-sm">Analyzing {currentFile}…</p>
                <p className="text-duetto-gray-400 text-xs mt-1">Extracting KPIs and Duetto angles</p>
              </div>
            </div>
          ) : (
            <>
              <Upload size={24} className="mx-auto text-duetto-gray-300 mb-2" />
              <p className="font-medium text-duetto-gray-700 text-sm mb-1">
                Drop a file or{' '}
                <label className="text-duetto-blue cursor-pointer hover:underline">
                  browse
                  <input type="file" className="sr-only" accept=".pdf,.xlsx,.xls,.csv,.txt"
                    onChange={handleInput} />
                </label>
              </p>
              <p className="text-duetto-gray-400 text-xs">PDF, XLSX, CSV · Hotstats, STR, P&amp;L reports</p>
            </>
          )}
        </div>
        {error && <p className="text-duetto-red text-sm mt-2">{error}</p>}
      </div>

      {documents.map(doc => (
        <div key={doc.id} className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-duetto-amber" />
              <span className="font-semibold text-duetto-navy text-sm">{doc.fileName}</span>
              <span className={`badge text-xs ${doc.documentType === 'hotstats' ? 'badge-green' : doc.documentType === 'market-report' ? 'badge-blue' : 'badge-teal'}`}>
                {doc.documentType === 'hotstats' ? 'Hotstats' : doc.documentType === 'market-report' ? 'Market Report' : 'Document'}
              </span>
            </div>
            <button onClick={() => onDocumentRemoved(doc.id)}
              className="p-1 rounded hover:bg-duetto-gray-100 text-duetto-gray-400 hover:text-duetto-red">
              <X size={14} />
            </button>
          </div>
          <div className="card-body space-y-4">
            <p className="text-duetto-gray-700 text-sm leading-relaxed">{doc.executiveSummary}</p>

            {doc.kpis.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <BarChart2 size={13} className="text-duetto-blue" />
                  <span className="text-xs font-semibold text-duetto-gray-500 uppercase tracking-wide">Key KPIs</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {doc.kpis.map((kpi, i) => (
                    <div key={i} className={`rounded-lg px-3 py-2 text-xs ${KPI_TYPE_COLORS[kpi.type] ?? KPI_TYPE_COLORS.other}`}>
                      <span className="font-semibold block">{kpi.value}</span>
                      <span className="opacity-75">{kpi.name}{kpi.segment ? ` (${kpi.segment})` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doc.trends.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={13} className="text-duetto-amber" />
                  <span className="text-xs font-semibold text-duetto-gray-500 uppercase tracking-wide">Trends</span>
                </div>
                <ul className="space-y-1">
                  {doc.trends.map((t, i) => (
                    <li key={i} className="text-sm text-duetto-gray-700 flex gap-2">
                      <span className="text-duetto-amber mt-0.5">↗</span><span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {doc.duettoAngle && (
              <div className="bg-duetto-teal-50 border border-duetto-teal-100 rounded-lg px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Target size={13} className="text-duetto-teal" />
                  <span className="text-xs font-semibold text-duetto-teal uppercase tracking-wide">Duetto Angle</span>
                </div>
                <p className="text-duetto-gray-700 text-sm leading-relaxed">{doc.duettoAngle}</p>
              </div>
            )}
          </div>
        </div>
      ))}

      {documents.length === 0 && !isAnalyzing && (
        <p className="text-center text-duetto-gray-400 text-sm py-4">
          Upload a Hotstats or market report to unlock deeper profitability insights.
        </p>
      )}
    </div>
  );
}
