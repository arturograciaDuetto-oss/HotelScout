import { useState } from 'react';
import { Newspaper, Mic, Youtube, Linkedin, MonitorPlay, FileText, Copy, Check, RefreshCw } from 'lucide-react';
import type { NewsItem, ContentType } from '../../types';

interface Props {
  data: NewsItem[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const TYPE_CONFIG: Record<ContentType, { icon: typeof Newspaper; color: string; badge: string }> = {
  'News Article':   { icon: Newspaper,   color: 'text-duetto-blue',  badge: 'badge-blue' },
  'Podcast':        { icon: Mic,         color: 'text-duetto-teal',  badge: 'badge-teal' },
  'YouTube':        { icon: Youtube,     color: 'text-duetto-red',   badge: 'badge-red' },
  'LinkedIn':       { icon: Linkedin,    color: 'text-[#0077B5]',   badge: 'badge-blue' },
  'Conference':     { icon: MonitorPlay, color: 'text-duetto-amber', badge: 'badge-amber' },
  'Press Release':  { icon: FileText,    color: 'text-duetto-green', badge: 'badge-green' },
};

function SkeletonItem() {
  return (
    <div className="card animate-pulse">
      <div className="card-body space-y-2">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-duetto-gray-100 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-duetto-gray-100 rounded w-3/4" />
            <div className="h-3 bg-duetto-gray-100 rounded w-1/3" />
          </div>
        </div>
        <div className="h-3 bg-duetto-gray-100 rounded w-full" />
        <div className="h-3 bg-duetto-gray-100 rounded w-4/5" />
        <div className="h-8 bg-duetto-gray-100 rounded-lg w-full mt-2" />
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const [copied, setCopied] = useState(false);
  const { icon: Icon, color, badge } = TYPE_CONFIG[item.type] ?? TYPE_CONFIG['News Article'];

  function copyHook() {
    navigator.clipboard.writeText(item.outreachHook).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card hover:shadow-duetto-md transition-shadow">
      <div className="card-body">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-duetto-gray-100 flex items-center justify-center shrink-0">
            <Icon size={16} className={color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-duetto-navy text-sm leading-snug mb-1">{item.title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge ${badge}`}>{item.type}</span>
              <span className="text-duetto-gray-400 text-xs">{item.source}</span>
              <span className="text-duetto-gray-300 text-xs">·</span>
              <span className="text-duetto-gray-400 text-xs">{item.date}</span>
            </div>
          </div>
        </div>

        <p className="text-duetto-gray-600 text-sm leading-relaxed mb-3">{item.summary}</p>

        <div className="bg-duetto-blue-50 border border-duetto-blue-100 rounded-lg px-3 py-2.5 flex items-start justify-between gap-3">
          <div>
            <span className="text-duetto-blue text-xs font-semibold uppercase tracking-wide block mb-1">
              Outreach Hook
            </span>
            <p className="text-duetto-gray-700 text-sm leading-relaxed">{item.outreachHook}</p>
          </div>
          <button
            onClick={copyHook}
            className="shrink-0 p-1.5 rounded-lg hover:bg-duetto-blue-100 text-duetto-blue transition-colors"
            title="Copy hook"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function NewsSection({ data, loading, error, onRetry }: Props) {
  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-duetto-red text-sm mb-3">{error}</p>
        <button onClick={onRetry} className="btn-secondary text-sm gap-1.5">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper size={16} className="text-duetto-blue" />
          <h3 className="font-semibold text-duetto-navy text-sm">News & Content</h3>
        </div>
        {[1, 2, 3].map(i => <SkeletonItem key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Newspaper size={16} className="text-duetto-blue" />
          <h3 className="font-semibold text-duetto-navy text-sm">News & Content Hooks</h3>
        </div>
        <span className="text-xs text-duetto-gray-400">{data.length} items found</span>
      </div>

      {data.map((item, i) => <NewsCard key={i} item={item} />)}

      <p className="text-duetto-gray-400 text-xs text-center pt-2">
        Content sourced from Claude's training knowledge — verify dates before outreach.
      </p>
    </div>
  );
}
