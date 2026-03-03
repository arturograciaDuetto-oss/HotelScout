import { useState } from 'react';
import { Newspaper, Mic, Youtube, Linkedin, Twitter, Instagram, ExternalLink, Copy, Check } from 'lucide-react';
import type { HotelData, NewsItem, MediaItem, SocialPost } from '../../types';

interface Props { data: HotelData; }

function CopyHookBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded hover:bg-duetto-gray-100 text-duetto-gray-400 transition-colors shrink-0"
      title="Copy hook">
      {copied ? <Check size={13} className="text-duetto-green" /> : <Copy size={13} />}
    </button>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="border border-duetto-gray-200 rounded-duetto p-4 hover:shadow-duetto-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-1">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="font-semibold text-duetto-navy text-sm hover:text-duetto-blue hover:underline leading-snug flex-1">
          {item.title}
        </a>
        <ExternalLink size={13} className="text-duetto-gray-300 shrink-0 mt-0.5" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="badge badge-blue text-xs">{item.source}</span>
        {item.publishedDate && <span className="text-duetto-gray-400 text-xs">{item.publishedDate}</span>}
      </div>
      <p className="text-duetto-gray-600 text-sm leading-relaxed">{item.summary}</p>
    </div>
  );
}

const MEDIA_ICONS = { Podcast: Mic, YouTube: Youtube } as const;
const MEDIA_COLORS = { Podcast: 'text-duetto-teal', YouTube: 'text-duetto-red' } as const;

function MediaCard({ item }: { item: MediaItem }) {
  const Icon = MEDIA_ICONS[item.type];
  const color = MEDIA_COLORS[item.type];
  return (
    <div className="border border-duetto-gray-200 rounded-duetto p-4 hover:shadow-duetto-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-duetto-gray-100 flex items-center justify-center shrink-0">
          <Icon size={16} className={color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="font-semibold text-duetto-navy text-sm hover:text-duetto-blue hover:underline leading-snug">
              {item.title}
            </a>
            <ExternalLink size={12} className="text-duetto-gray-300 shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`badge text-xs ${item.type === 'Podcast' ? 'badge-teal' : 'badge-red'}`}>{item.platform}</span>
            {item.guestName && <span className="text-duetto-gray-500 text-xs">feat. {item.guestName}</span>}
            {item.date && <span className="text-duetto-gray-400 text-xs">{item.date}</span>}
          </div>
          <p className="text-duetto-gray-600 text-sm">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

const SOCIAL_ICONS = { LinkedIn: Linkedin, X: Twitter, Instagram: Instagram } as const;
const SOCIAL_BADGES: Record<string, string> = { LinkedIn: 'badge-blue', X: 'badge-navy', Instagram: 'badge-red' };

function SocialCard({ post }: { post: SocialPost }) {
  const Icon = SOCIAL_ICONS[post.platform] ?? Linkedin;
  return (
    <div className="border border-duetto-gray-200 rounded-duetto p-4 hover:shadow-duetto-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-duetto-gray-100 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-duetto-gray-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className={`badge text-xs ${SOCIAL_BADGES[post.platform] ?? 'badge-blue'}`}>{post.platform}</span>
              {post.date && <span className="text-duetto-gray-400 text-xs">{post.date}</span>}
              {post.engagement && <span className="text-duetto-gray-400 text-xs">{post.engagement}</span>}
            </div>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={12} className="text-duetto-gray-300 hover:text-duetto-blue" />
            </a>
          </div>
          <p className="text-duetto-gray-700 text-sm leading-relaxed">{post.content}</p>
        </div>
        <CopyHookBtn text={`Re: "${post.content.slice(0, 100)}…" — ${post.url}`} />
      </div>
    </div>
  );
}

type SubSection = 'news' | 'media' | 'social';

export function ContentSection({ data }: Props) {
  const [active, setActive] = useState<SubSection>('news');

  const tabs: { id: SubSection; label: string; count: number; icon: typeof Newspaper }[] = [
    { id: 'news', label: 'News', count: data.news.length, icon: Newspaper },
    { id: 'media', label: 'Podcasts & Video', count: data.media.length, icon: Mic },
    { id: 'social', label: 'Social Media', count: data.socialPosts.length, icon: Linkedin },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 bg-duetto-gray-100 p-1 rounded-duetto">
        {tabs.map(({ id, label, count, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all
              ${active === id ? 'bg-white shadow-duetto-sm text-duetto-navy' : 'text-duetto-gray-500 hover:text-duetto-gray-700'}`}>
            <Icon size={13} />
            {label}
            {count > 0 && (
              <span className={`w-4 h-4 rounded-full text-white text-xs flex items-center justify-center ${active === id ? 'bg-duetto-blue' : 'bg-duetto-gray-300'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {active === 'news' && (
        data.news.length > 0 ? (
          <div className="space-y-3">
            {data.news.map(n => <NewsCard key={n.id} item={n} />)}
            <p className="text-duetto-gray-400 text-xs text-center">Verify dates before outreach. AI knowledge may have a cutoff.</p>
          </div>
        ) : (
          <p className="text-center text-duetto-gray-400 text-sm py-8">No verified news items found.</p>
        )
      )}

      {active === 'media' && (
        data.media.length > 0 ? (
          <div className="space-y-3">
            {data.media.map(m => <MediaCard key={m.id} item={m} />)}
          </div>
        ) : (
          <p className="text-center text-duetto-gray-400 text-sm py-8">No verified podcast or video appearances found.</p>
        )
      )}

      {active === 'social' && (
        data.socialPosts.length > 0 ? (
          <div className="space-y-3">
            {data.socialPosts.map(p => <SocialCard key={p.id} post={p} />)}
          </div>
        ) : (
          <p className="text-center text-duetto-gray-400 text-sm py-8">No verified social posts found.</p>
        )
      )}
    </div>
  );
}
