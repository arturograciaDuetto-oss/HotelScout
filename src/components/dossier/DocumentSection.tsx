import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, BarChart2, Lightbulb, Target, X, Loader2 } from 'lucide-react';
import { analyzeDocument } from '../../lib/anthropic';
import type { DocumentAnalysis } from '../../types';

interface Props {
  documents: DocumentAnalysis[];
  hotelQuery: string;
  onDocumentAdded: (doc: DocumentAnalysis) => void;
  onDocumentRemoved: (index: number) => void;
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string ?? '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function DocumentSection({ documents, hotelQuery, onDocumentAdded, onDocumentRemoved }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<string>('');

  async function processFile(file: File) {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentFile(file.name);
    try {
      const content = await readFileAsText(file);
      const result = await analyzeDocument(content, file.name, hotelQuery);
      onDocumentAdded({
        fileName: file.name,
        fileType: file.type || 'text/plain',
        kpis: result.kpis,
        trends: result.trends,
        insights: result.insights,
        duettoAngle: result.duettoAngle,
        uploadedAt: new Date(),
      });
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setCurrentFile('');
    }
  }

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [hotelQuery]
  );

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Upload size={16} className="text-duetto-amber" />
        <h3 className="font-semibold text-duetto-navy text-sm">Document Analysis</h3>
      </div>

      <p className="text-duetto-gray-500 text-sm leading-relaxed">
        Upload Hotstats reports, market analyses, financial documents, or P&amp;L statements to extract KPIs
        and bridge top-line revenue with bottom-line profitability goals.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-duetto p-8 text-center transition-all
          ${isDragging ? 'border-duetto-blue bg-duetto-blue-50' : 'border-duetto-gray-200 bg-duetto-gray-50 hover:border-duetto-gray-300'}
          ${isAnalyzing ? 'opacity-60 pointer-events-none' : ''}`}
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-duetto-blue animate-spin" />
            <div>
              <p className="font-semibold text-duetto-navy text-sm">Analyzing {currentFile}…</p>
              <p className="text-duetto-gray-500 text-xs mt-1">Extracting KPIs and generating Duetto angles</p>
            </div>
          </div>
        ) : (
          <>
            <Upload size={28} className="mx-auto text-duetto-gray-300 mb-3" />
            <p className="font-semibold text-duetto-gray-700 text-sm mb-1">
              Drop a file here or{' '}
              <label className="text-duetto-blue cursor-pointer hover:underline">
                browse
                <input
                  type="file"
                  className="sr-only"
                  accept=".txt,.csv,.pdf,.xlsx,.xls,.json,.md"
                  onChange={handleFileInput}
                />
              </label>
            </p>
            <p className="text-duetto-gray-400 text-xs">
              Supports: TXT, CSV, PDF (text), XLSX, JSON — max 8,000 characters analysed
            </p>
          </>
        )}
      </div>

      {analysisError && (
        <div className="rounded-duetto bg-duetto-red-50 border border-duetto-red-100 px-4 py-3 text-duetto-red text-sm">
          {analysisError}
        </div>
      )}

      {/* Analysed documents */}
      {documents.map((doc, i) => (
        <div key={i} className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-duetto-amber" />
              <span className="font-semibold text-duetto-navy text-sm">{doc.fileName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-duetto-gray-400 text-xs">
                {doc.uploadedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button
                onClick={() => onDocumentRemoved(i)}
                className="p-1 rounded hover:bg-duetto-gray-100 text-duetto-gray-400 hover:text-duetto-red transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="card-body space-y-4">
            {/* KPIs */}
            {doc.kpis.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <BarChart2 size={13} className="text-duetto-blue" />
                  <span className="text-xs font-semibold text-duetto-gray-500 uppercase tracking-wide">KPIs</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {doc.kpis.map((kpi, j) => (
                    <div key={j} className="text-sm text-duetto-gray-700 bg-duetto-gray-50 rounded px-3 py-1.5">
                      {kpi}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends */}
            {doc.trends.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightbulb size={13} className="text-duetto-amber" />
                  <span className="text-xs font-semibold text-duetto-gray-500 uppercase tracking-wide">Trends</span>
                </div>
                <ul className="space-y-1">
                  {doc.trends.map((t, j) => (
                    <li key={j} className="text-sm text-duetto-gray-700 flex gap-2">
                      <span className="text-duetto-amber mt-0.5">↗</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Duetto Angle */}
            {doc.duettoAngle && (
              <div className="bg-duetto-teal-50 border border-duetto-teal-100 rounded-lg px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
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
        <div className="text-center py-6">
          <p className="text-duetto-gray-400 text-sm">
            No documents uploaded yet. Upload a Hotstats report or market analysis to unlock deeper insights.
          </p>
        </div>
      )}
    </div>
  );
}
