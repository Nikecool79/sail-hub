import { safetyItems } from '@/data/sampleData';
import { ShieldCheck, Shirt, Wrench, Sun, Apple } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, Shirt, Wrench, Sun, Apple,
};
const teamDots: Record<string, string> = {
  green: 'bg-green-500', blue: 'bg-blue-500', red: 'bg-red-500',
};

const SafetyChecklist = () => (
  <div className="space-y-6 max-w-3xl">
    <h1 className="font-heading text-2xl font-bold">Safety Checklist</h1>
    <p className="text-sm text-muted-foreground">Print this list and check before every session. Skriv ut och kontrollera innan varje pass.</p>

    {safetyItems.map(section => {
      const Icon = iconMap[section.icon] || ShieldCheck;
      return (
        <div key={section.category} className="rounded-xl bg-card border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon size={20} className="text-primary" />
            <h2 className="font-heading text-lg font-semibold">{section.category}</h2>
          </div>
          <div className="space-y-3">
            {section.items.map(item => (
              <div key={item.name} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex gap-1">
                      {item.teams.map(t => (
                        <span key={t} className={`w-2 h-2 rounded-full ${teamDots[t]}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default SafetyChecklist;
