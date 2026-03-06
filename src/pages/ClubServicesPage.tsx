import { useTranslation } from 'react-i18next';
import { Sailboat, MapPin, Package, ExternalLink, Mail, CheckCircle, Info, DollarSign } from 'lucide-react';

interface PriceRow {
  label: string;
  price: string;
  note?: string;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  prices?: PriceRow[];
  bullets?: string[];
  contactEmail?: string;
  contactLabelKey?: string;
  externalUrl?: string;
  externalLabelKey?: string;
  accentClass: string;
}

function ServiceCard({
  icon, titleKey, subtitleKey, descriptionKey,
  prices, bullets, contactEmail, contactLabelKey,
  externalUrl, externalLabelKey, accentClass,
}: ServiceCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-card border overflow-hidden flex flex-col">
      {/* Header band */}
      <div className={`${accentClass} px-6 py-5 flex items-center gap-4`}>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-white leading-tight">{t(titleKey)}</h2>
          <p className="text-sm text-white/80">{t(subtitleKey)}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-5 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">{t(descriptionKey)}</p>

        {/* Price table */}
        {prices && prices.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <DollarSign size={12} />
              {t('services.pricing')}
            </div>
            <div className="rounded-lg border overflow-hidden divide-y">
              {prices.map((row, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-foreground">{row.label}</span>
                  <div className="text-right">
                    <span className="font-semibold">{row.price}</span>
                    {row.note && <p className="text-xs text-muted-foreground">{row.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bullet points */}
        {bullets && bullets.length > 0 && (
          <ul className="space-y-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle size={14} className="mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Mail size={14} />
              {contactLabelKey ? t(contactLabelKey) : contactEmail}
            </a>
          )}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={14} />
              {externalLabelKey ? t(externalLabelKey) : t('services.readMore')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const ClubServicesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">{t('services.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('services.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Buying an Optimist */}
        <ServiceCard
          icon={<Sailboat size={24} className="text-white" />}
          titleKey="services.buyBoat.title"
          subtitleKey="services.buyBoat.subtitle"
          descriptionKey="services.buyBoat.description"
          accentClass="bg-gradient-to-br from-blue-600 to-blue-800"
          prices={[
            { label: t('services.buyBoat.priceBeginnerLabel'), price: '~5 000 kr', note: t('services.buyBoat.priceBeginnerNote') },
            { label: t('services.buyBoat.priceRacingLabel'),   price: '~10 000 kr', note: t('services.buyBoat.priceRacingNote') },
            { label: t('services.buyBoat.priceCompLabel'),     price: '~20 000 kr', note: t('services.buyBoat.priceCompNote') },
          ]}
          bullets={[
            t('services.buyBoat.tip1'),
            t('services.buyBoat.tip2'),
            t('services.buyBoat.tip3'),
            t('services.buyBoat.tip4'),
          ]}
          externalUrl="https://www.kkkk.se/batar/att-kopa-optimistjolle/"
          externalLabelKey="services.readMore"
        />

        {/* 2. Harbor Dinghy Spots */}
        <ServiceCard
          icon={<MapPin size={24} className="text-white" />}
          titleKey="services.harborSpots.title"
          subtitleKey="services.harborSpots.subtitle"
          descriptionKey="services.harborSpots.description"
          accentClass="bg-gradient-to-br from-teal-600 to-teal-800"
          prices={[
            { label: t('services.harborSpots.priceCraneLabel'), price: '5 000 kr', note: t('services.harborSpots.priceCraneNote') },
            { label: t('services.harborSpots.priceRegLabel'),   price: '2 500 kr', note: t('services.harborSpots.priceRegNote') },
          ]}
          bullets={[
            t('services.harborSpots.tip1'),
            t('services.harborSpots.tip2'),
            t('services.harborSpots.tip3'),
          ]}
          contactEmail="kassor@kkkk.se"
          contactLabelKey="services.contactTreasurer"
          externalUrl="https://www.kkkk.se/batar/jolleplatser-pa-hamnplan/"
          externalLabelKey="services.readMore"
        />

        {/* 3. Mast Storage */}
        <ServiceCard
          icon={<Package size={24} className="text-white" />}
          titleKey="services.mastStorage.title"
          subtitleKey="services.mastStorage.subtitle"
          descriptionKey="services.mastStorage.description"
          accentClass="bg-gradient-to-br from-amber-600 to-orange-700"
          bullets={[
            t('services.mastStorage.tip1'),
            t('services.mastStorage.tip2'),
            t('services.mastStorage.tip3'),
            t('services.mastStorage.tip4'),
          ]}
          contactEmail="traning@kkkk.se"
          contactLabelKey="services.contactTraining"
          externalUrl="https://www.kkkk.se/batar/mastskjul-for-aktiva-optmistseglare/"
          externalLabelKey="services.readMore"
        />
      </div>

      {/* Info banner */}
      <div className="rounded-xl border bg-muted/30 px-5 py-4 flex items-start gap-3 text-sm text-muted-foreground">
        <Info size={16} className="mt-0.5 flex-shrink-0" />
        <p>{t('services.infoNote')}</p>
      </div>
    </div>
  );
};

export default ClubServicesPage;
