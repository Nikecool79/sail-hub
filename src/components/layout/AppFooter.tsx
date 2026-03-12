import WaveDivider from '@/components/WaveDivider';
import { Heart, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { getActiveSponsors } from '@/utils/sponsorUtils';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { getClubName, getSetting } from '@/config/clubConfig';

const AppFooter = () => {
  const { t, i18n } = useTranslation();
  const data = useDataStore((s) => s.data);
  const team = useThemeStore((s) => s.team);
  const { localize } = useLocalizedField();
  const settings = data?.settings;
  const lang = (i18n.language?.startsWith('sv') ? 'sv' : 'en') as 'sv' | 'en';
  const allSponsors = data ? getActiveSponsors(data.sponsors) : [];

  const instagramUrl = team?.toLowerCase() === 'green'
    ? (data?.settings['Instagram Skola'] || data?.settings['Instagram'] || '')
    : team
      ? (data?.settings['Instagram KKKK'] || data?.settings['Instagram'] || '')
      : (data?.settings['Instagram'] || data?.settings['Instagram Skola'] || data?.settings['Instagram KKKK'] || '');

  return (
    <footer className="mt-auto border-t bg-card">
      <WaveDivider flip />

      <div className="py-4 overflow-hidden border-b">
        <p className="text-center text-xs text-muted-foreground mb-3 tracking-wider uppercase">{t('sponsors.proudSponsor')}</p>
        <div className="relative">
          <div className="flex gap-8 sponsor-scroll whitespace-nowrap">
            {[...allSponsors, ...allSponsors].map((s, i) => {
              const url = s.clickUrl || s.websiteUrl;
              const Tag = url ? 'a' : 'div';
              const linkProps = url ? { href: url, target: '_blank' as const, rel: 'noopener noreferrer' } : {};
              return (
                <Tag
                  key={i}
                  {...linkProps}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-muted/30 hover:bg-muted transition-colors flex-shrink-0 grayscale hover:grayscale-0 ${url ? 'cursor-pointer' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {s.logoUrl ? (
                      <img src={s.logoUrl} alt="" className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                    ) : (
                      s.businessName.charAt(0)
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{s.businessName}</span>
                </Tag>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="text-center md:text-left">
          <p className="font-heading font-semibold text-foreground">{getClubName(settings, lang)}</p>
          {getSetting(settings, 'Club Address') && <p>{getSetting(settings, 'Club Address')}</p>}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">{t('nav.dashboard')}</Link>
          <Link to="/calendar" className="hover:text-foreground transition-colors">{t('nav.calendar')}</Link>
          <Link to="/contacts" className="hover:text-foreground transition-colors">{t('nav.contacts')}</Link>
          <Link to="/become-sponsor" className="hover:text-foreground transition-colors">{t('sponsors.becomeSponsor')}</Link>
        </div>

        <div className="flex items-center gap-3">
          {(data?.settings['Facebook Page'] || data?.settings['Facebook URL']) && (
            <a href={data!.settings['Facebook Page'] || data!.settings['Facebook URL']} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-secondary transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          )}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-secondary transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          )}
          <span className="flex items-center gap-1 text-xs">
            Made with <Heart size={12} className="text-destructive" /> for young sailors
          </span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
