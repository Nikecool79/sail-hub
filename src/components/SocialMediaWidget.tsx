import { useTranslation } from 'react-i18next';
import { Facebook, Instagram } from 'lucide-react';
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
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-card border p-5 flex items-center gap-4 card-hover group"
          >
            <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
              <Facebook size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t('dashboard.followOnFacebook')}</p>
              <p className="text-xs text-muted-foreground truncate">{facebookUrl.replace(/^https?:\/\/(www\.)?/, '')}</p>
            </div>
            <span className="px-4 py-2 rounded-md bg-[#1877F2] text-white text-sm font-medium group-hover:opacity-90 transition-opacity flex-shrink-0">
              {t('dashboard.visitFacebook')}
            </span>
          </a>
        )}

        {/* Instagram */}
        {hasInstagram && (
          <div className="rounded-xl bg-card border p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                <Instagram size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t('dashboard.latestOnInstagram')}</p>
                {instagramUrl.trim() && (
                  <p className="text-xs text-muted-foreground truncate">{instagramUrl.replace(/^https?:\/\/(www\.)?/, '')}</p>
                )}
              </div>
              {instagramUrl.trim() && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  {t('dashboard.visitInstagram')}
                </a>
              )}
            </div>
            {instagramPostUrl.trim() && (
              <div className="overflow-hidden rounded-lg flex justify-center">
                <InstagramEmbed url={instagramPostUrl} width="100%" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaWidget;
