import { navItems } from '@/data/sampleData';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, MapPin, CloudSun, Video, Users, Phone,
  Newspaper, ShoppingBag, TrendingUp, ShieldCheck, Bell, Heart, Menu, X, Anchor
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import OptimistBoat from '@/components/OptimistBoat';
import { useTranslation } from 'react-i18next';
import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { getSponsorsByPlacement, getSponsorsForTeam, trackSponsorClick } from '@/utils/sponsorUtils';
import { useLocalizedField } from '@/hooks/useLocalizedField';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, CalendarDays, MapPin, CloudSun, Video, Users, Phone,
  Newspaper, ShoppingBag, TrendingUp, ShieldCheck, Bell, Heart, Anchor,
};

const navI18nKeys: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/calendar': 'nav.calendar',
  '/events': 'nav.events',
  '/weather': 'nav.weather',
  '/cameras': 'nav.liveCameras',
  '/coaches': 'nav.coaches',
  '/fleet': 'nav.fleet',
  '/contacts': 'nav.contacts',
  '/news': 'nav.news',
  '/marketplace': 'nav.marketplace',
  '/skills': 'nav.skills',
  '/safety': 'nav.safety',
  '/subscribe': 'nav.subscribe',
  '/sponsors': 'nav.sponsors',
};

const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [sponsorIdx, setSponsorIdx] = useState(0);
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const data = useDataStore((s) => s.data);
  const team = useThemeStore((s) => s.team);

  const sidebarSponsors = useMemo(() => {
    if (!data) return [];
    const forTeam = getSponsorsForTeam(data.sponsors, team);
    const sidebar = getSponsorsByPlacement(forTeam, 'Sidebar');
    return sidebar.length > 0 ? sidebar : forTeam.slice(0, 3);
  }, [data, team]);

  const rotationInterval = data?.settings?.['Ad Rotation Interval Seconds']
    ? Number(data.settings['Ad Rotation Interval Seconds']) * 1000
    : 10000;

  useEffect(() => {
    if (sidebarSponsors.length <= 1) return;
    const t = setInterval(() => setSponsorIdx((i) => (i + 1) % sidebarSponsors.length), rotationInterval);
    return () => clearInterval(t);
  }, [sidebarSponsors.length, rotationInterval]);

  const currentSponsor = sidebarSponsors[sponsorIdx % Math.max(sidebarSponsors.length, 1)];

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <OptimistBoat size={24} color="hsl(var(--sidebar-primary))" />
        <span className="font-heading font-semibold text-sidebar-foreground">OptiSail</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
        {navItems.map(item => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const active = location.pathname === item.url;
          const label = navI18nKeys[item.url] ? t(navI18nKeys[item.url]) : item.title;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>

      {currentSponsor && (
        <div className="p-3 border-t border-sidebar-border">
          <div
            className="rounded-md bg-sidebar-accent p-3 text-xs transition-opacity cursor-pointer"
            onClick={() => trackSponsorClick(currentSponsor.adId, currentSponsor.clickUrl)}
          >
            <p className="text-sidebar-foreground/50 uppercase tracking-wider mb-1">{t('sponsors.proudSponsor')}</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-sidebar-foreground/10 flex items-center justify-center text-[10px] font-bold text-sidebar-foreground/40">
                {currentSponsor.logoUrl ? (
                  <img src={currentSponsor.logoUrl} alt="" className="w-8 h-8 rounded object-cover" loading="lazy" />
                ) : (
                  currentSponsor.businessName.charAt(0)
                )}
              </div>
              <div>
                <p className="font-medium text-sidebar-foreground">{currentSponsor.businessName}</p>
                <p className="text-sidebar-foreground/50">{localize(currentSponsor, 'tagline')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-card border shadow-sm"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {nav}
      </aside>
    </>
  );
};

export default AppSidebar;
