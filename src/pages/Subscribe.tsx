import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Bell, MessageCircle, Facebook, Instagram } from 'lucide-react';

const Subscribe = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useDataStore();

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  const settings = data.settings || {};
  const mailchimpUrl = settings['Mailchimp URL'] || settings['Mailchimp Action URL'] || '';
  const hasMailchimp = mailchimpUrl.trim() !== '';

  const whatsappGroups = [
    { labelKey: 'subscribe.whatsapp.green', settingsKey: 'WhatsApp Green Group', bg: 'bg-green-600 hover:bg-green-700' },
    { labelKey: 'subscribe.whatsapp.blue', settingsKey: 'WhatsApp Blue Group', bg: 'bg-blue-600 hover:bg-blue-700' },
    { labelKey: 'subscribe.whatsapp.red', settingsKey: 'WhatsApp Red Group', bg: 'bg-red-600 hover:bg-red-700' },
    { labelKey: 'subscribe.whatsapp.all', settingsKey: 'WhatsApp All Club Group', bg: 'bg-emerald-600 hover:bg-emerald-700' },
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-center">{t('subscribe.title')}</h1>

      {/* Email signup — only shown if Mailchimp URL is configured */}
      {hasMailchimp && (
        <div className="rounded-xl bg-card border p-6 team-border-top">
          <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            {t('subscribe.email.heading')}
          </h2>
          <div className="space-y-3">
            <input placeholder={t('subscribe.email.namePlaceholder')} className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
            <input placeholder={t('subscribe.email.emailPlaceholder')} type="email" className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
            <select className="w-full px-3 py-2 rounded-md border bg-background text-sm">
              <option>{t('subscribe.email.allTeams')}</option>
              <option>{t('subscribe.email.greenTeam')}</option>
              <option>{t('subscribe.email.blueTeam')}</option>
              <option>{t('subscribe.email.redTeam')}</option>
            </select>
            <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              {t('subscribe.email.button')}
            </button>
          </div>
        </div>
      )}

      {/* Push notifications */}
      <div className="rounded-xl bg-card border p-6">
        <h2 className="font-heading text-lg font-semibold mb-2">{t('subscribe.push.heading')}</h2>
        <p className="text-sm text-muted-foreground mb-3">{t('subscribe.push.description')}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm">{t('subscribe.push.enable')}</span>
          <div className="w-12 h-6 rounded-full bg-muted relative cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-card shadow absolute top-0.5 left-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="rounded-xl bg-card border p-6">
        <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle size={18} />
          {t('subscribe.whatsapp.heading')}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {whatsappGroups.map(g => {
            const url = settings[g.settingsKey];
            const hasUrl = url && url.trim() !== '';
            return (
              <a
                key={g.labelKey}
                href={hasUrl ? url : undefined}
                target={hasUrl ? '_blank' : undefined}
                rel={hasUrl ? 'noopener noreferrer' : undefined}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${g.bg} ${!hasUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ color: 'white' }}
                onClick={e => { if (!hasUrl) e.preventDefault(); }}
              >
                <MessageCircle size={14} className="inline mr-1.5" />
                {hasUrl ? t(g.labelKey) : t('subscribe.linkComingSoon')}
              </a>
            );
          })}
        </div>
      </div>

      {/* Social */}
      {(settings['Facebook Page'] || settings['Facebook URL'] || settings['Instagram'] || settings['Instagram URL']) && (
        <div className="flex justify-center gap-3">
          {(settings['Facebook Page'] || settings['Facebook URL']) && (
            <a href={settings['Facebook Page'] || settings['Facebook URL']} target="_blank" rel="noopener noreferrer" className="p-3 rounded-md border hover:bg-secondary transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          )}
          {(settings['Instagram'] || settings['Instagram URL']) && (
            <a href={settings['Instagram'] || settings['Instagram URL']} target="_blank" rel="noopener noreferrer" className="p-3 rounded-md border hover:bg-secondary transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscribe;
