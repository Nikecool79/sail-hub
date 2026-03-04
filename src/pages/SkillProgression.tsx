import { skills } from '@/data/sampleData';
import OptimistBoat from '@/components/OptimistBoat';
import { CheckCircle2 } from 'lucide-react';

const zones = [
  { key: 'green' as const, label: 'Green Zone', color: '#2E7D32', bgClass: 'from-green-50 to-green-100', boatSize: 32 },
  { key: 'blue' as const, label: 'Blue Zone', color: '#1565C0', bgClass: 'from-blue-50 to-blue-100', boatSize: 44 },
  { key: 'red' as const, label: 'Red Zone', color: '#C62828', bgClass: 'from-red-50 to-red-100', boatSize: 56 },
];

const SkillProgression = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h1 className="font-heading text-2xl font-bold">Your Sailing Journey</h1>
      <p className="text-muted-foreground">Din seglingsresa</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {zones.map(zone => (
        <div
          key={zone.key}
          className={`rounded-xl border p-6 bg-gradient-to-b ${zone.bgClass}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <OptimistBoat size={zone.boatSize} color={zone.color} />
            <h2 className="font-heading text-xl font-bold" style={{ color: zone.color }}>{zone.label}</h2>
          </div>
          <div className="space-y-3">
            {skills[zone.key].map(skill => (
              <div key={skill.name} className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: zone.color }} />
                <div>
                  <p className="text-sm font-medium">{skill.name}</p>
                  <p className="text-xs text-muted-foreground">{skill.description}</p>
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
      <span className="text-muted-foreground text-xs">→</span>
      <div className="h-0.5 w-16 bg-blue-400" />
      <span className="text-muted-foreground text-xs">→</span>
      <div className="h-0.5 w-16 bg-red-400" />
    </div>
  </div>
);

export default SkillProgression;
