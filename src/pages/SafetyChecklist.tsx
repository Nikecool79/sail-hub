import { useState, useMemo } from 'react';
import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShieldCheck, Shirt, Wrench, Sun, Apple } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, Shirt, Wrench, Sun, Apple,
  Safety: ShieldCheck, Clothing: Shirt, Equipment: Wrench, Protection: Sun, Nutrition: Apple,
};
const teamDots: Record<string, string> = {
  green: 'bg-green-500', blue: 'bg-blue-500', red: 'bg-red-500',
  Green: 'bg-green-500', Blue: 'bg-blue-500', Red: 'bg-red-500',
};

const SafetyChecklist = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const { data, isLoading } = useDataStore();
  const { team } = useThemeStore();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleChecked = (item: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const grouped = useMemo(() => {
    if (!data?.safetyChecklist) return {};
    const filtered = data.safetyChecklist.filter(item => {
      if (!team) return true;
      const capitalTeam = team.charAt(0).toUpperCase() + team.slice(1);
      return item.requiredFor.includes('All') || item.requiredFor.includes(capitalTeam) || item.requiredFor.includes(team);
    });
    const groups: Record<string, typeof filtered> = {};
    for (const item of filtered) {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }, [data?.safetyChecklist, team]);

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-heading text-2xl font-bold">{t('safety.title')}</h1>
      <p className="text-sm text-muted-foreground">{t('safety.subtitle')}</p>

      {Object.entries(grouped).map(([category, items]) => {
        const Icon = iconMap[category] || ShieldCheck;
        return (
          <div key={category} className="rounded-xl bg-card border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={20} className="text-primary" />
              <h2 className="font-heading text-lg font-semibold">{t('safety.categories.' + category, category)}</h2>
            </div>
            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.item}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  onClick={() => toggleChecked(item.item)}
                >
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    checked.has(item.item) ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {checked.has(item.item) && (
                      <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${checked.has(item.item) ? 'line-through opacity-60' : ''}`}>{item.item}</p>
                      <div className="flex gap-1">
                        {item.requiredFor.filter(t => t !== 'All').map(t => (
                          <span key={t} className={`w-2 h-2 rounded-full ${teamDots[t] || ''}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{localize(item, 'description')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SafetyChecklist;
