import { useMemo } from 'react';
import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import LoadingSpinner from '@/components/LoadingSpinner';
import OptimistBoat from '@/components/OptimistBoat';
import { CheckCircle2 } from 'lucide-react';

const zones = [
  { key: 'Green' as const, themeKey: 'green' as const, color: '#2E7D32', bgClass: 'from-green-50 to-green-100', boatSize: 32 },
  { key: 'Blue' as const, themeKey: 'blue' as const, color: '#1565C0', bgClass: 'from-blue-50 to-blue-100', boatSize: 44 },
  { key: 'Red' as const, themeKey: 'red' as const, color: '#C62828', bgClass: 'from-red-50 to-red-100', boatSize: 56 },
];

const SkillProgression = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const { data, isLoading } = useDataStore();

  const grouped = useMemo(() => {
    if (!data?.skillProgression) return {};
    const groups: Record<string, typeof data.skillProgression> = {};
    for (const skill of data.skillProgression) {
      const t = skill.team || 'Other';
      if (!groups[t]) groups[t] = [];
      groups[t].push(skill);
    }
    // Sort by order within each group
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.order - b.order);
    }
    return groups;
  }, [data?.skillProgression]);

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">{t('skills.title')}</h1>
        <p className="text-muted-foreground">{t('skills.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {zones.map(zone => (
          <div
            key={zone.key}
            className={`rounded-xl border p-6 bg-gradient-to-b ${zone.bgClass}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <OptimistBoat size={zone.boatSize} color={zone.color} />
              <h2 className="font-heading text-xl font-bold" style={{ color: zone.color }}>
                {t('skills.zones.' + zone.themeKey, zone.key + ' Zone')}
              </h2>
            </div>
            <div className="space-y-3">
              {(grouped[zone.key] || []).map(skill => (
                <div key={skill.skillEn || skill.skillSv} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: zone.color }} />
                  <div>
                    <p className="text-sm font-medium">{localize(skill, 'skill')}</p>
                    <p className="text-xs text-muted-foreground">{localize(skill, 'description')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Journey connector (desktop) */}
      <div className="hidden lg:flex items-center justify-center gap-2 -mt-4">
        <div className="h-0.5 w-16 bg-green-400" />
        <span className="text-muted-foreground text-xs">{'\u2192'}</span>
        <div className="h-0.5 w-16 bg-blue-400" />
        <span className="text-muted-foreground text-xs">{'\u2192'}</span>
        <div className="h-0.5 w-16 bg-red-400" />
      </div>
    </div>
  );
};

export default SkillProgression;
