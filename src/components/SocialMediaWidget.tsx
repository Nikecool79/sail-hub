import { useTranslation } from 'react-i18next';
import { Facebook, Instagram } from 'lucide-react';
import { InstagramEmbed } from 'react-social-media-embed';

interface Props {
  settings: Record<string, string>;
}

const SocialMediaWidget = ({ settings }: Props) => {
  const { t } = useTranslation();

  const facebookUrl = settings['Facebook Page'] || settings['Facebook URL'] || '';
  const instagramPostUrl = settings['Instagram Post URL'] || '';

  const hasFacebook = facebookUrl.trim() !== '';
  const hasInstagram = instagramPostUrl.trim() !== '';

  if (!hasFacebook && !hasInstagram) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-sm font-medium uppercase tracking-wider">{t('dashboard.socialMedia')}</span>
      </div>
      <div className={`grid gap-4 ${hasFacebook && hasInstagram ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {hasFacebook && (
          <div className="rounded-xl bg-card border p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Facebook size={16} />
              <span className="text-sm font-medium">{t('dashboard.followOnFacebook')}</span>
            </div>
            <div className="overflow-hidden rounded-lg">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookUrl)}&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
                width="100%"
                height="500"
                style={{ border: 'none', overflow: 'hidden' }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                loading="lazy"
                title="Facebook Page"
              />
            </div>
          </div>
        )}

        {hasInstagram && (
          <div className="rounded-xl bg-card border p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Instagram size={16} />
              <span className="text-sm font-medium">{t('dashboard.latestOnInstagram')}</span>
            </div>
            <div className="overflow-hidden rounded-lg flex justify-center">
              <InstagramEmbed url={instagramPostUrl} width="100%" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaWidget;
