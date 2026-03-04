import WaveDivider from '@/components/WaveDivider';
import { sponsors } from '@/data/sampleData';
import { Heart, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const allSponsors = [...sponsors.gold, ...sponsors.silver, ...sponsors.bronze];

const AppFooter = () => (
  <footer className="mt-auto border-t bg-card">
    <WaveDivider flip />

    {/* Sponsor ribbon */}
    <div className="py-4 overflow-hidden border-b">
      <p className="text-center text-xs text-muted-foreground mb-3 tracking-wider uppercase">Stolt sponsor / Proud sponsor</p>
      <div className="relative">
        <div className="flex gap-8 sponsor-scroll whitespace-nowrap">
          {[...allSponsors, ...allSponsors].map((s, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-muted/30 hover:bg-muted transition-colors flex-shrink-0 grayscale hover:grayscale-0"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {s.name.charAt(0)}
              </div>
              <span className="text-sm text-muted-foreground">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="text-center md:text-left">
        <p className="font-heading font-semibold text-foreground">Kullaviks Segelsällskap</p>
        <p>Hamnvägen 12, 429 44 Kullavik</p>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">Home</Link>
        <Link to="/calendar" className="hover:text-foreground transition-colors">Calendar</Link>
        <Link to="/contacts" className="hover:text-foreground transition-colors">Contact</Link>
        <Link to="/become-sponsor" className="hover:text-foreground transition-colors">Become a Sponsor</Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-secondary transition-colors" aria-label="Facebook">
          <Facebook size={18} />
        </button>
        <button className="p-2 rounded-md hover:bg-secondary transition-colors" aria-label="Instagram">
          <Instagram size={18} />
        </button>
        <span className="flex items-center gap-1 text-xs">
          Made with <Heart size={12} className="text-destructive" /> for young sailors
        </span>
      </div>
    </div>
  </footer>
);

export default AppFooter;
