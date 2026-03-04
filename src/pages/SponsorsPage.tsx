import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { getSponsorsByTier, trackSponsorClick } from '@/utils/sponsorUtils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

const SponsorsPage = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const { data, isLoading } = useDataStore();

  const goldSponsors = useMemo(() => {
    if (!data?.sponsors) return [];
    return getSponsorsByTier(data.sponsors, 'Gold');
  }, [data?.sponsors]);

  const silverSponsors = useMemo(() => {
    if (!data?.sponsors) return [];
    return getSponsorsByTier(data.sponsors, 'Silver');
  }, [data?.sponsors]);

  const bronzeSponsors = useMemo(() => {
    if (!data?.sponsors) return [];
    return getSponsorsByTier(data.sponsors, 'Bronze');
  }, [data?.sponsors]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">{t('sponsors.title')}</h1>

      {/* Gold */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400" /> {t('sponsors.gold')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goldSponsors.map(s => (
            <div key={s.adId} className="rounded-xl border-2 border-dashed border-yellow-300 p-6 card-hover">
              {s.logoUrl ? (
                <img src={s.logoUrl} alt={s.businessName} className="w-16 h-16 rounded-lg object-contain mb-3" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center font-heading text-2xl font-bold text-muted-foreground mb-3">
                  {s.businessName.charAt(0)}
                </div>
              )}
              <h3 className="font-heading text-lg font-semibold">{s.businessName}</h3>
              <p className="text-sm text-muted-foreground mb-1">{localize(s, 'tagline')}</p>
              <p className="text-sm text-muted-foreground mb-3">{localize(s, 'description')}</p>
              <button
                onClick={() => trackSponsorClick(s.adId, s.clickUrl)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
              >
                <ExternalLink size={12} /> {t('sponsors.visitWebsite')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Silver */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400" /> {t('sponsors.silver')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {silverSponsors.map(s => (
            <div key={s.adId} className="rounded-xl border border-dashed p-5 card-hover">
              {s.logoUrl ? (
                <img src={s.logoUrl} alt={s.businessName} className="w-12 h-12 rounded object-contain mb-2" />
              ) : (
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center font-heading text-lg font-bold text-muted-foreground mb-2">
                  {s.businessName.charAt(0)}
                </div>
              )}
              <h3 className="font-heading font-semibold">{s.businessName}</h3>
              <p className="text-sm text-muted-foreground">{localize(s, 'tagline')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bronze */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-600" /> {t('sponsors.bronze')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {bronzeSponsors.map(s => (
            <div key={s.adId} className="rounded-lg border border-dashed p-3 text-center card-hover">
              {s.logoUrl ? (
                <img src={s.logoUrl} alt={s.businessName} className="w-10 h-10 rounded-full mx-auto mb-1 object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted mx-auto mb-1 flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {s.businessName.charAt(0)}
                </div>
              )}
              <p className="text-sm font-medium">{s.businessName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage;
