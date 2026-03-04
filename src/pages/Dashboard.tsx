import { events, weatherData, newsItems } from '@/data/sampleData';
import { Clock, Wind, Newspaper, ExternalLink, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import OptimistBoat from '@/components/OptimistBoat';

const Dashboard = () => {
  const nextEvent = events[0];
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calc = () => {
      const target = new Date(nextEvent.date).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, []);

  const w = weatherData.current;
  const recentNews = newsItems.slice(0, 2);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Next Event */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Clock size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Next Event</span>
          </div>
          <h3 className="font-heading text-lg font-semibold">{nextEvent.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{nextEvent.date} — {nextEvent.location}</p>
          <div className="flex gap-3">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Min', value: countdown.minutes },
            ].map(({ label, value }) => (
              <div key={label} className="text-center bg-secondary rounded-lg px-3 py-2">
                <span className="font-heading text-xl font-bold number-flip">{value}</span>
                <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Wind size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Weather Now</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading text-3xl font-bold">{w.temp}°C</p>
              <p className="text-sm text-muted-foreground">{w.conditions}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{w.windSpeed} kn</p>
              <div className="flex items-center gap-1 justify-end">
                <svg width="16" height="16" viewBox="0 0 16 16" className="transition-transform" style={{ transform: `rotate(${w.windDirection}deg)` }}>
                  <path d="M8 2L12 12L8 9L4 12Z" fill="currentColor" />
                </svg>
                <span className="text-xs text-muted-foreground">SW</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{w.location}</p>
        </div>

        {/* Latest News */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Newspaper size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Latest News</span>
          </div>
          {recentNews.map(n => (
            <div key={n.id} className="mb-3 last:mb-0">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.date}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="rounded-xl bg-card border p-5 team-border-top card-hover">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <ExternalLink size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Quick Links</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['WhatsApp Group', 'Sailarena', 'Club Website'].map(link => (
              <button key={link} className="px-3 py-1.5 text-sm rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gold Sponsor */}
      <div className="rounded-xl bg-card border p-5 card-hover relative overflow-hidden">
        <span className="absolute top-2 right-2 text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Annons / Ad</span>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
            <Megaphone size={24} className="text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Gold Sponsor</p>
            <h3 className="font-heading text-lg font-semibold">Västkusten Marina</h3>
            <p className="text-sm text-muted-foreground">Your home on the water</p>
          </div>
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Visit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
