import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { useWeather } from '@/hooks/useWeather';
import { getWeatherInfo, degreesToCompass } from '@/utils/weatherCodes';
import { getSponsorsByTier, trackSponsorClick } from '@/utils/sponsorUtils';
import { Clock, Wind, Newspaper, ExternalLink, Megaphone } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import OptimistBoat from '@/components/OptimistBoat';
import LoadingSpinner from '@/components/LoadingSpinner';

const Dashboard = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const data = useDataStore(s => s.data);

  const defaultLat = data ? parseFloat(data.settings['Default Latitude'] || '57.4833') : 57.4833;
  const defaultLng = data ? parseFloat(data.settings['Default Longitude'] || '11.9333') : 11.9333;
  const locationName = data?.settings['Default Location Name'] || 'Kullavik Hamn';

  const weather = useWeather(defaultLat, defaultLng, locationName);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const nextEvent = useMemo(() => {
    if (!data) return null;
    return data.events
      .filter(e => e.dateStart >= today)
      .sort((a, b) => a.dateStart.localeCompare(b.dateStart))[0] || null;
  }, [data, today]);

  const recentNews = useMemo(() => {
    if (!data) return [];
    return data.news
      .filter(n => n.active)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 2);
  }, [data]);

  const goldSponsor = useMemo(() => {
    if (!data) return null;
    return getSponsorsByTier(data.sponsors, 'Gold')[0] || null;
  }, [data]);

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!nextEvent) return;
    const calc = () => {
      const target = new Date(nextEvent.dateStart).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [nextEvent]);

  if (!data) return <LoadingSpinner />;

  const w = weather.data?.current;

  const whatsappUrl = data.settings['WhatsApp Group URL'] || '#';
  const sailarenaUrl = data.settings['Sailarena URL'] || '#';
  const clubWebsiteUrl = data.settings['Club Website URL'] || '#';

  const quickLinks = [
    { label: t('dashboard.whatsappGroup'), url: whatsappUrl },
    { label: t('dashboard.sailarena'), url: sailarenaUrl },
    { label: t('dashboard.clubWebsite'), url: clubWebsiteUrl },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Next Event */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Clock size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{t('dashboard.nextEvent')}</span>
          </div>
          {nextEvent ? (
            <>
              <h3 className="font-heading text-lg font-semibold">{localize(nextEvent, 'name')}</h3>
              <p className="text-sm text-muted-foreground mb-3">{nextEvent.dateStart} — {nextEvent.locationName}</p>
              <div className="flex gap-3">
                {[
                  { label: t('dashboard.days'), value: countdown.days },
                  { label: t('dashboard.hours'), value: countdown.hours },
                  { label: t('dashboard.minutes'), value: countdown.minutes },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center bg-secondary rounded-lg px-3 py-2">
                    <span className="font-heading text-xl font-bold number-flip">{value}</span>
                    <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t('empty.noEvents')}</p>
          )}
        </div>

        {/* Weather */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Wind size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{t('dashboard.weatherNow')}</span>
          </div>
          {w ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading text-3xl font-bold">{w.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">{t(getWeatherInfo(w.weatherCode).descKey)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{w.windSpeed} kn</p>
                  <div className="flex items-center gap-1 justify-end">
                    <svg width="16" height="16" viewBox="0 0 16 16" className="transition-transform" style={{ transform: `rotate(${w.windDirection}deg)` }}>
                      <path d="M8 2L12 12L8 9L4 12Z" fill="currentColor" />
                    </svg>
                    <span className="text-xs text-muted-foreground">{degreesToCompass(w.windDirection)}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{weather.data?.location}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t('weather.unavailable')}</p>
          )}
        </div>

        {/* Latest News */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Newspaper size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{t('dashboard.latestNews')}</span>
          </div>
          {recentNews.length > 0 ? (
            recentNews.map(n => (
              <div key={n.newsId} className="mb-3 last:mb-0">
                <p className="text-sm font-medium">{localize(n, 'title')}</p>
                <p className="text-xs text-muted-foreground">{n.date}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t('empty.noNews')}</p>
          )}
        </div>

        {/* Quick Links */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <ExternalLink size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{t('dashboard.quickLinks')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map(link => (
              <button
                key={link.label}
                onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                className="px-3 py-1.5 text-sm rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gold Sponsor */}
      {goldSponsor && (
        <div className="rounded-xl bg-card border p-5 card-hover relative overflow-hidden">
          <span className="absolute top-2 right-2 text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t('sponsors.ad')}</span>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              {goldSponsor.logoUrl ? (
                <img src={goldSponsor.logoUrl} alt={goldSponsor.businessName} className="w-12 h-12 object-contain" />
              ) : (
                <Megaphone size={24} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{t('dashboard.goldSponsor')}</p>
              <h3 className="font-heading text-lg font-semibold">{goldSponsor.businessName}</h3>
              <p className="text-sm text-muted-foreground">{localize(goldSponsor, 'tagline')}</p>
            </div>
            <button
              onClick={() => trackSponsorClick(goldSponsor.adId, goldSponsor.clickUrl || goldSponsor.websiteUrl)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t('dashboard.visit')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
