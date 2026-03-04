import { sponsors } from '@/data/sampleData';
import { ExternalLink } from 'lucide-react';

const SponsorsPage = () => (
  <div className="space-y-8">
    <h1 className="font-heading text-2xl font-bold">Our Sponsors</h1>

    {/* Gold */}
    <div>
      <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-yellow-400" /> Gold Sponsors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sponsors.gold.map(s => (
          <div key={s.name} className="rounded-xl border-2 border-dashed border-yellow-300 p-6 card-hover">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center font-heading text-2xl font-bold text-muted-foreground mb-3">
              {s.name.charAt(0)}
            </div>
            <h3 className="font-heading text-lg font-semibold">{s.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">{s.tagline}</p>
            <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
              <ExternalLink size={12} /> Visit website
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Silver */}
    <div>
      <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-gray-400" /> Silver Sponsors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sponsors.silver.map(s => (
          <div key={s.name} className="rounded-xl border border-dashed p-5 card-hover">
            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center font-heading text-lg font-bold text-muted-foreground mb-2">
              {s.name.charAt(0)}
            </div>
            <h3 className="font-heading font-semibold">{s.name}</h3>
            <p className="text-sm text-muted-foreground">{s.tagline}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Bronze */}
    <div>
      <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-amber-600" /> Bronze Sponsors
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {sponsors.bronze.map(s => (
          <div key={s.name} className="rounded-lg border border-dashed p-3 text-center card-hover">
            <div className="w-10 h-10 rounded-full bg-muted mx-auto mb-1 flex items-center justify-center text-xs font-bold text-muted-foreground">
              {s.name.charAt(0)}
            </div>
            <p className="text-sm font-medium">{s.name}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SponsorsPage;
