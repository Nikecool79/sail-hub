import { marketplaceItems, sponsors } from '@/data/sampleData';
import { Sailboat, Wind, Shirt, Wrench, Search, ExternalLink, Mail } from 'lucide-react';
import { useState } from 'react';

const catIcons: Record<string, React.ElementType> = {
  boat: Sailboat, sail: Wind, clothing: Shirt, equipment: Wrench,
};
const conditionColors: Record<string, string> = {
  'Like New': 'bg-green-100 text-green-700',
  'Good': 'bg-blue-100 text-blue-700',
  'Fair': 'bg-yellow-100 text-yellow-700',
};

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = marketplaceItems.filter(i =>
    (!category || i.category === category) &&
    (!search || i.title.toLowerCase().includes(search.toLowerCase()))
  );
  const selectedItem = marketplaceItems.find(i => i.id === selected);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Marketplace</h1>

      {/* Featured shops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sponsors.gold.map(s => (
          <div key={s.name} className="rounded-xl border border-dashed p-4 card-hover bg-sand/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">{s.name.charAt(0)}</div>
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.tagline}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-card text-sm"
          />
        </div>
        <select
          value={category || ''}
          onChange={e => setCategory(e.target.value || null)}
          className="px-3 py-2 rounded-md border bg-card text-sm"
        >
          <option value="">All categories</option>
          <option value="boat">Boats</option>
          <option value="sail">Sails</option>
          <option value="clothing">Clothing</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const CatIcon = catIcons[item.category] || Wrench;
          return (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`text-left rounded-xl bg-card border p-5 card-hover transition-all ${selected === item.id ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CatIcon size={16} className="text-muted-foreground" />
                <span className={`text-xs px-2 py-0.5 rounded-full ${conditionColors[item.condition] || 'bg-muted'}`}>{item.condition}</span>
              </div>
              <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
              <p className="font-heading text-xl font-bold text-primary">{item.price} SEK</p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{item.seller}</span>
                <span>{item.date}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div className="rounded-xl bg-card border p-5 team-border-top">
          <h3 className="font-heading text-lg font-semibold mb-1">{selectedItem.title}</h3>
          <p className="font-heading text-2xl font-bold text-primary mb-3">{selectedItem.price} SEK</p>
          <p className="text-sm text-muted-foreground mb-4">{selectedItem.description}</p>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
              <ExternalLink size={14} /> View on Blocket
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm hover:bg-secondary">
              <Mail size={14} /> Contact seller
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Want to sell something? Contact us at <a href="mailto:forsaljning@klubben.se" className="text-primary hover:underline">forsaljning@klubben.se</a>
      </p>
    </div>
  );
};

export default Marketplace;
