import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/LoadingSpinner';
import OptimistBoat from '@/components/OptimistBoat';
import WaveDivider from '@/components/WaveDivider';

const defaultTiers = [
  { name: 'Gold', defaultPrice: '500 SEK/month', settingsKey: 'Gold Tier Price SEK/Month', color: '#D4AF37', boatSize: 56, benefitKeys: ['sponsor.benefits.logoEvents', 'sponsor.benefits.featuredCard', 'sponsor.benefits.sponsoredPosts', 'sponsor.benefits.footerRibbon', 'sponsor.benefits.socialMentions'] },
  { name: 'Silver', defaultPrice: '300 SEK/month', settingsKey: 'Silver Tier Price SEK/Month', color: '#9CA3AF', boatSize: 40, benefitKeys: ['sponsor.benefits.sidebarRotation', 'sponsor.benefits.footerRibbon', 'sponsor.benefits.logoSponsorsPage', 'sponsor.benefits.socialQuarterly'] },
  { name: 'Bronze', defaultPrice: '150 SEK/month', settingsKey: 'Bronze Tier Price SEK/Month', color: '#B45309', boatSize: 28, benefitKeys: ['sponsor.benefits.logoSponsorsPage', 'sponsor.benefits.footerRibbon'] },
];

const BecomeSponsor = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useDataStore();

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  const settings = data.settings || {};

  const tiers = defaultTiers.map(tier => {
    const settingsPrice = settings[tier.settingsKey];
    const price = settingsPrice ? `${settingsPrice} SEK/${t('sponsor.perMonth')}` : tier.defaultPrice;
    return { ...tier, price };
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-10 text-center overflow-hidden">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{t('sponsor.heroTitle')}</h1>
        <p className="text-lg text-muted-foreground">{t('sponsor.heroSubtitle')}</p>
        <WaveDivider className="absolute bottom-0 left-0" />
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map(tier => (
          <div key={tier.name} className="rounded-xl border-2 border-dashed p-6 text-center card-hover" style={{ borderColor: tier.color }}>
            <OptimistBoat size={tier.boatSize} color={tier.color} className="mx-auto mb-3" />
            <h2 className="font-heading text-xl font-bold mb-1" style={{ color: tier.color }}>
              {t('sponsor.tiers.' + tier.name.toLowerCase(), tier.name)}
            </h2>
            <p className="font-heading text-2xl font-bold mb-4">{tier.price}</p>
            <ul className="text-sm text-left space-y-2">
              {tier.benefitKeys.map(key => (
                <li key={key} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: tier.color }} />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="rounded-xl bg-card border p-6 max-w-lg mx-auto">
        <h2 className="font-heading text-lg font-semibold mb-4 text-center">{t('sponsor.contactHeading')}</h2>
        <div className="space-y-3">
          <input placeholder={t('sponsor.form.name')} className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
          <input placeholder={t('sponsor.form.business')} className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
          <input placeholder={t('sponsor.form.email')} type="email" className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
          <textarea placeholder={t('sponsor.form.message')} rows={3} className="w-full px-3 py-2 rounded-md border bg-background text-sm resize-none" />
          <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            {t('sponsor.form.send')}
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">{t('sponsor.emailUs')}</p>
      </div>
    </div>
  );
};

export default BecomeSponsor;
