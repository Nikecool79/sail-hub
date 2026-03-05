import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { getSponsorsByTier } from '@/utils/sponsorUtils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Sailboat, Wind, Shirt, Wrench, Search, ExternalLink, Mail, Phone, Facebook } from 'lucide-react';
import { useState, useMemo } from 'react';

const catIcons: Record<string, React.ElementType> = {
  boat: Sailboat, sail: Wind, clothing: Shirt, equipment: Wrench,
};
const conditionColors: Record<string, string> = {
  'Like New': 'bg-green-100 text-green-700',
  'Good': 'bg-blue-100 text-blue-700',
  'Fair': 'bg-yellow-100 text-yellow-700',
};

type SortOption = 'newest' | 'price-asc' | 'price-desc';

const Marketplace = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const { data, isLoading } = useDataStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('newest');
  const [selected, setSelected] = useState<string | null>(null);

  const activeItems = useMemo(() => {
    if (!data?.marketplace) return [];
    return data.marketplace.filter(i => i.status === 'Active');
  }, [data?.marketplace]);

  const filtered = useMemo(() => {
    let items = activeItems.filter(i => {
      const matchCategory = !category || i.category.toLowerCase() === category.toLowerCase();
      const title = localize(i, 'title').toLowerCase();
      const description = localize(i, 'description').toLowerCase();
      const term = search.toLowerCase();
      const matchSearch = !search || title.includes(term) || description.includes(term);
      return matchCategory && matchSearch;
    });

    switch (sort) {
      case 'newest':
        items = [...items].sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
        break;
      case 'price-asc':
        items = [...items].sort((a, b) => a.priceSek - b.priceSek);
        break;
      case 'price-desc':
        items = [...items].sort((a, b) => b.priceSek - a.priceSek);
        break;
    }

    return items;
  }, [activeItems, category, search, sort, localize]);

  const selectedItem = useMemo(() => {
    if (!selected) return null;
    return activeItems.find(i => i.itemId === selected) ?? null;
  }, [activeItems, selected]);

  const featuredShops = useMemo(() => {
    if (!data?.sponsors) return [];
    return getSponsorsByTier(data.sponsors, 'Gold');
  }, [data?.sponsors]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('marketplace.title')}</h1>

      {/* Featured shops */}
      {featuredShops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuredShops.map(s => (
            <div
              key={s.adId}
              className="rounded-xl border border-dashed p-4 card-hover bg-sand/20 cursor-pointer"
              onClick={() => { if (s.clickUrl || s.websiteUrl) window.open(s.clickUrl || s.websiteUrl, '_blank', 'noopener,noreferrer'); }}
            >
              <div className="flex items-center gap-3">
                {s.logoUrl ? (
                  <img src={s.logoUrl} alt={s.businessName} className="w-10 h-10 rounded object-contain flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground flex-shrink-0">{s.businessName.charAt(0)}</div>
                )}
                <div>
                  <p className="font-medium text-sm">{s.businessName}</p>
                  <p className="text-xs text-muted-foreground">{localize(s, 'tagline')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters — only show if there are items */}
      {activeItems.length > 0 && <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('marketplace.search')}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-card text-sm"
          />
        </div>
        <select
          value={category || ''}
          onChange={e => setCategory(e.target.value || null)}
          className="px-3 py-2 rounded-md border bg-card text-sm"
        >
          <option value="">{t('marketplace.allCategories')}</option>
          <option value="boat">Boats</option>
          <option value="sail">Sails</option>
          <option value="clothing">Clothing</option>
          <option value="equipment">Equipment</option>
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="px-3 py-2 rounded-md border bg-card text-sm"
        >
          <option value="newest">{t('marketplace.sortNewest')}</option>
          <option value="price-asc">{t('marketplace.sortPriceLow')}</option>
          <option value="price-desc">{t('marketplace.sortPriceHigh')}</option>
        </select>
      </div>}

      {/* Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const CatIcon = catIcons[item.category] || Wrench;
          const title = localize(item, 'title');
          return (
            <button
              key={item.itemId}
              onClick={() => setSelected(item.itemId)}
              className={`text-left rounded-xl bg-card border p-5 card-hover transition-all ${selected === item.itemId ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CatIcon size={16} className="text-muted-foreground" />
                <span className={`text-xs px-2 py-0.5 rounded-full ${conditionColors[item.condition] || 'bg-muted'}`}>{item.condition}</span>
              </div>
              <h3 className="font-heading font-semibold mb-1">{title}</h3>
              <p className="font-heading text-xl font-bold text-primary">{item.priceSek} SEK</p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{item.sellerName}</span>
                <span>{item.datePosted}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div className="rounded-xl bg-card border p-5 team-border-top">
          <h3 className="font-heading text-lg font-semibold mb-1">{localize(selectedItem, 'title')}</h3>
          <p className="font-heading text-2xl font-bold text-primary mb-3">{selectedItem.priceSek} SEK</p>
          <p className="text-sm text-muted-foreground mb-4">{localize(selectedItem, 'description')}</p>
          <div className="flex flex-wrap gap-2">
            {selectedItem.externalLink && (
              <a
                href={selectedItem.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
              >
                <ExternalLink size={14} /> {t('marketplace.viewOnBlocket')}
              </a>
            )}
            {selectedItem.facebookLink && (
              <a
                href={selectedItem.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#1877F2] text-white text-sm hover:opacity-90"
              >
                <Facebook size={14} /> {t('marketplace.viewOnFacebook')}
              </a>
            )}
            {selectedItem.sellerEmail && (
              <a
                href={`mailto:${selectedItem.sellerEmail}`}
                className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm hover:bg-secondary"
              >
                <Mail size={14} /> {t('marketplace.contactSeller')}
              </a>
            )}
            {selectedItem.sellerPhone && (
              <a
                href={`tel:${selectedItem.sellerPhone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm hover:bg-secondary"
              >
                <Phone size={14} /> {selectedItem.sellerPhone}
              </a>
            )}
          </div>
        </div>
      )}

      {activeItems.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">{t('empty.noItems')}</p>
      )}

      <p className="text-center text-sm text-muted-foreground">
        {t('marketplace.wantToSell')}
      </p>
    </div>
  );
};

export default Marketplace;
