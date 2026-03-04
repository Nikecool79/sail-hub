import { newsItems, sponsors } from '@/data/sampleData';
import { Pin, Share2, Megaphone } from 'lucide-react';
import { useState } from 'react';

const teamBadge = (team: string | null) => {
  if (!team) return null;
  const colors: Record<string, string> = { green: 'bg-green-500', blue: 'bg-blue-500', red: 'bg-red-500' };
  return <span className={`w-2 h-2 rounded-full ${colors[team] || ''} inline-block`} />;
};

const NewsPage = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = newsItems.filter(n => !filter || n.team === filter);
  const sponsorAd = sponsors.gold[0];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">News</h1>

      <div className="flex gap-2 flex-wrap">
        {[null, 'green', 'blue', 'red'].map(f => (
          <button
            key={f || 'all'}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full capitalize transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {f || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4 max-w-2xl">
        {filtered.map((n, idx) => (
          <div key={n.id}>
            <div className={`rounded-xl bg-card border p-5 card-hover ${n.pinned ? 'ring-1 ring-primary/30' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                {n.pinned && <Pin size={14} className="text-primary" />}
                {teamBadge(n.team)}
                <span className="text-xs text-muted-foreground">{n.date}</span>
              </div>
              <h3 className="font-heading text-lg font-semibold mb-1">{n.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{n.body.slice(0, 150)}... <button className="text-primary hover:underline text-xs">Read more</button></p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">By {n.author}</span>
                <button className="p-1.5 rounded-md hover:bg-secondary transition-colors" aria-label="Share on WhatsApp">
                  <Share2 size={14} />
                </button>
              </div>
            </div>

            {/* Sponsor card every 5th item */}
            {(idx + 1) % 5 === 0 && (
              <div className="rounded-xl bg-sand/30 border border-dashed p-4 mt-4 relative">
                <span className="absolute top-2 right-2 text-[10px] bg-muted px-2 py-0.5 rounded-full">Annons / Ad</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                    <Megaphone size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sponsorAd.name}</p>
                    <p className="text-xs text-muted-foreground">{sponsorAd.tagline}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
