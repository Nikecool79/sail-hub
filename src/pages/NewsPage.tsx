import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { getSponsorsByPlacement, trackSponsorClick } from '@/utils/sponsorUtils';
import { createWhatsAppShareLink } from '@/utils/whatsapp';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Pin, Share2, Megaphone } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { NewsItem } from '@/types';

const teamBadge = (teams: string[]) => {
  if (!teams || teams.length === 0) return null;
  const colors: Record<string, string> = { green: 'bg-green-500', blue: 'bg-blue-500', red: 'bg-red-500' };
  return (
    <>
      {teams.map(team => (
        <span key={team} className={`w-2 h-2 rounded-full ${colors[team.toLowerCase()] || ''} inline-block`} />
      ))}
    </>
  );
};

function NewsCard({ n }: { n: NewsItem }) {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const [isExpanded, setIsExpanded] = useState(false);

  const title = localize(n, 'title');
  const body = localize(n, 'body');

  return (
    <div className={`rounded-xl bg-card border p-5 card-hover ${n.pinned ? 'ring-1 ring-primary/30' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        {n.pinned && <Pin size={14} className="text-primary" />}
        {teamBadge(n.teams)}
        <span className="text-xs text-muted-foreground">{n.date}</span>
      </div>
      <h3 className="font-heading text-lg font-semibold mb-1">{title}</h3>
      {body.length > 150 ? (
        isExpanded ? (
          <div className="text-sm text-muted-foreground mb-3">
            <p className="whitespace-pre-line">{body}</p>
            <button
              className="text-primary hover:underline text-xs mt-1"
              onClick={() => setIsExpanded(false)}
            >
              {t('news.showLess')}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-3">
            {body.slice(0, 150)}{'... '}
            <button
              className="text-primary hover:underline text-xs"
              onClick={() => setIsExpanded(true)}
            >
              {t('news.readMore')}
            </button>
          </p>
        )
      ) : (
        <p className="text-sm text-muted-foreground mb-3">{body}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{n.author}</span>
        <button
          className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          aria-label={t('news.share')}
          onClick={() => {
            const shareUrl = createWhatsAppShareLink(title + ' - ' + body.slice(0, 150));
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
          }}
        >
          <Share2 size={14} />
        </button>
      </div>
    </div>
  );
}

const NewsPage = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const { data, isLoading } = useDataStore();
  const [filter, setFilter] = useState<string | null>(null);

  const newsItems = useMemo(() => {
    if (!data?.news) return [];
    return data.news
      .filter(n => n.active)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [data?.news]);

  const filtered = useMemo(() => {
    return newsItems.filter(n =>
      !filter || n.teams.some(t => t.toLowerCase() === filter.toLowerCase())
    );
  }, [newsItems, filter]);

  const sponsorAds = useMemo(() => {
    if (!data?.sponsors) return [];
    return getSponsorsByPlacement(data.sponsors, 'News Page');
  }, [data?.sponsors]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('news.title')}</h1>

      <div className="flex gap-2 flex-wrap">
        {[null, 'green', 'blue', 'red'].map(f => (
          <button
            key={f || 'all'}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full capitalize transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {f ? t(`teams.${f}`) : t('news.filterAll')}
          </button>
        ))}
      </div>

      <div className="space-y-4 max-w-2xl">
        {filtered.map((n, idx) => {
          const sponsorAd = sponsorAds.length > 0 ? sponsorAds[idx % sponsorAds.length] : null;

          return (
            <div key={`${n.newsId}-${idx}`}>
              <NewsCard n={n} />

              {/* Sponsor card every 5th item */}
              {(idx + 1) % 5 === 0 && sponsorAd && (
                <div
                  className="rounded-xl bg-sand/30 border border-dashed p-4 mt-4 relative cursor-pointer"
                  onClick={() => trackSponsorClick(sponsorAd.adId, sponsorAd.clickUrl)}
                >
                  <span className="absolute top-2 right-2 text-[10px] bg-muted px-2 py-0.5 rounded-full">{t('news.ad')}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <Megaphone size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sponsorAd.businessName}</p>
                      <p className="text-xs text-muted-foreground">{localize(sponsorAd, 'tagline')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsPage;
