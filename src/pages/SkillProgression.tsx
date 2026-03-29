import { useMemo } from 'react';
import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import LoadingSpinner from '@/components/LoadingSpinner';
import OptimistBoat from '@/components/OptimistBoat';
import { CheckCircle2 } from 'lucide-react';
import { TEAMS } from '@/config/clubConfig';

const ILCA_RIGS = [
  { name: 'ILCA 4', sail: '4.7 m²', weight: '40–60 kg' },
  { name: 'ILCA 6', sail: '5.76 m²', weight: '55–78 kg' },
  { name: 'ILCA 7', sail: '7.06 m²', weight: '75–90+ kg' },
];

const zones = TEAMS.map((t, i) => ({
  key: (t.id.charAt(0).toUpperCase() + t.id.slice(1)) as string,
  themeKey: t.id,
  color: t.color,
  bgClass: t.bgClass,
  boatSize: 32 + i * 12,
}));

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {zone.themeKey === 'ilca' && (
                <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-600">Rig</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-600">Segel</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-600">Vikt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ILCA_RIGS.map(rig => (
                        <tr key={rig.name} className="border-t border-gray-100">
                          <td className="px-2 py-1.5 font-medium" style={{ color: zone.color }}>{rig.name}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{rig.sail}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{rig.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Journey connector (desktop) */}
      <div className="hidden lg:flex items-center justify-center gap-2 -mt-4">
        <div className="h-0.5 w-12 bg-green-400" />
        <span className="text-muted-foreground text-xs">{'\u2192'}</span>
        <div className="h-0.5 w-12 bg-blue-400" />
        <span className="text-muted-foreground text-xs">{'\u2192'}</span>
        <div className="h-0.5 w-12 bg-red-400" />
        <span className="text-muted-foreground text-xs">{'\u2192'}</span>
        <div className="h-0.5 w-12 bg-gray-400" />
      </div>
    </div>
  );
};

export default SkillProgression;
