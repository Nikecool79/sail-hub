import { navItems, sponsors } from '@/data/sampleData';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, MapPin, CloudSun, Video, Users, Phone,
  Newspaper, ShoppingBag, TrendingUp, ShieldCheck, Bell, Heart, Menu, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import OptimistBoat from '@/components/OptimistBoat';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, CalendarDays, MapPin, CloudSun, Video, Users, Phone,
  Newspaper, ShoppingBag, TrendingUp, ShieldCheck, Bell, Heart,
};

const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [sponsorIdx, setSponsorIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSponsorIdx(i => (i + 1) % sponsors.silver.length), 5000);
    return () => clearInterval(t);
  }, []);

  const currentSponsor = sponsors.silver[sponsorIdx];

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
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-md bg-sidebar-accent p-3 text-xs transition-opacity">
          <p className="text-sidebar-foreground/50 uppercase tracking-wider mb-1">Sponsor</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-sidebar-foreground/10 flex items-center justify-center text-[10px] font-bold text-sidebar-foreground/40">
              {currentSponsor.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sidebar-foreground">{currentSponsor.name}</p>
              <p className="text-sidebar-foreground/50">{currentSponsor.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-card border shadow-sm"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {nav}
      </aside>
    </>
  );
};

export default AppSidebar;
