import * as XLSX from 'xlsx';

export type ParsedFile = {
  text: string;
  fileType: 'pdf' | 'excel' | 'csv' | 'other';
  documentType: 'market-report' | 'hotstats' | 'other';
};

function detectDocumentType(text: string, fileName: string): ParsedFile['documentType'] {
  const lower = (text + fileName).toLowerCase();
  if (lower.includes('hotstats') || lower.includes('goppar') || lower.includes('trevpar')) {
    return 'hotstats';
  }
  if (
    lower.includes('revpar') ||
    lower.includes('adr') ||
    lower.includes('occupancy') ||
    lower.includes('market report') ||
    lower.includes('str report')
  ) {
    return 'market-report';
  }
  return 'other';
}

async function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve((e.target?.result as string) ?? '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

async function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

async function parseExcel(file: File): Promise<string> {
  const buffer = await readAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  let text = '';
  workbook.SheetNames.forEach(name => {
    const sheet = workbook.Sheets[name];
    text += `\n=== Sheet: ${name} ===\n`;
    text += XLSX.utils.sheet_to_csv(sheet);
  });
  return text;
}

async function parsePdf(file: File): Promise<string> {
  // Dynamically import pdfjs-dist to avoid blocking initial load
  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Use CDN worker to avoid bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const buffer = await readAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text +=
        content.items
          .map(item => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ') + '\n';
    }
    return text;
  } catch {
    // Fallback: try reading as plain text (works for some simple PDFs)
    return readAsText(file);
  }
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  let text = '';
  let fileType: ParsedFile['fileType'] = 'other';

  if (ext === 'pdf') {
    fileType = 'pdf';
    text = await parsePdf(file);
  } else if (['xlsx', 'xls', 'xlsm'].includes(ext)) {
    fileType = 'excel';
    text = await parseExcel(file);
  } else if (ext === 'csv') {
    fileType = 'csv';
    text = await readAsText(file);
  } else {
    fileType = 'other';
    text = await readAsText(file);
  }

  const documentType = detectDocumentType(text, file.name);
  return { text, fileType, documentType };
}
