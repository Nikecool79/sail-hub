import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, ExternalLink } from 'lucide-react';
import { InstagramEmbed } from 'react-social-media-embed';

interface Props {
  settings: Record<string, string>;
}

const SocialMediaWidget = ({ settings }: Props) => {
  const { t } = useTranslation();

  const facebookUrl = settings['Facebook Page'] || settings['Facebook URL'] || '';
  const instagramUrl = settings['Instagram'] || settings['Instagram URL'] || '';
  const instagramPostUrl = settings['Instagram Post URL'] || '';

  const hasFacebook = facebookUrl.trim() !== '';
  const hasInstagram = instagramUrl.trim() !== '' || instagramPostUrl.trim() !== '';

  if (!hasFacebook && !hasInstagram) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-sm font-medium uppercase tracking-wider">{t('dashboard.socialMedia')}</span>
      </div>
      <div className={`grid gap-4 ${hasFacebook && hasInstagram ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl'}`}>
        {/* Facebook */}
        {hasFacebook && (
          <div className="rounded-xl bg-card border p-5 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Facebook size={16} />
              <span className="text-sm font-medium">{t('dashboard.followOnFacebook')}</span>
            </div>
            {/* Compact page plugin — header only */}
            <div className="overflow-hidden rounded-lg">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookUrl)}&tabs=&width=500&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="100%"
                height="130"
                style={{ border: 'none', overflow: 'hidden' }}
                allow="encrypted-media"
                loading="lazy"
                title="Facebook Page"
              />
            </div>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1877F2] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Facebook size={14} />
              {t('dashboard.visitFacebook')}
            </a>
          </div>
        )}

        {/* Instagram */}
        {hasInstagram && (
          <div className="rounded-xl bg-card border p-5 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Instagram size={16} />
              <span className="text-sm font-medium">{t('dashboard.latestOnInstagram')}</span>
            </div>
            {instagramPostUrl.trim() ? (
              <div className="overflow-hidden rounded-lg flex justify-center">
                <InstagramEmbed url={instagramPostUrl} width="100%" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard.followUsOnInstagram')}</p>
            )}
            {instagramUrl.trim() && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Instagram size={14} />
                {t('dashboard.visitInstagram')}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaWidget;
