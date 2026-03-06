import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Phone, Mail } from 'lucide-react';
import { useState, useMemo } from 'react';

const CoachesAndTeam = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const data = useDataStore(s => s.data);
  const { team } = useThemeStore();

  const coaches = useMemo(() => {
    if (!data) return [];
    return data.coaches
      .filter(c => c.active)
      .filter(c => !team || c.teams.length === 0 || c.teams.includes('All') || c.teams.some(t => t.toLowerCase() === team.toLowerCase()));
  }, [data, team]);

  const events = useMemo(() => {
    if (!data) return [];
    return data.events
      .filter(e => !team || e.teams.length === 0 || e.teams.includes('All') || e.teams.some(t => t.toLowerCase() === team.toLowerCase()));
  }, [data, team]);

  const [selectedEventId, setSelectedEventId] = useState('');

  // Auto-select first event when list changes
  const effectiveEventId = selectedEventId && events.some(e => e.eventId === selectedEventId)
    ? selectedEventId
    : events[0]?.eventId ?? '';

  if (!data) return <LoadingSpinner />;

  const selectedAssignments = data.eventAssignments.filter(a => a.eventId === effectiveEventId);

  const getInitials = (name: string) =>
    name.split(/\s+/).map(part => part[0]).join('').toUpperCase();

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">{t('coaches.title')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map(c => (
          <div key={c.coachId} className="rounded-xl bg-card border p-5 card-hover team-border-top">
            <div className="flex items-center gap-3 mb-3">
              {c.photoUrl ? (
                <img
                  src={c.photoUrl}
                  alt={c.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center font-heading text-lg font-bold text-muted-foreground">
                  {getInitials(c.name)}
                </div>
              )}
              <div>
                <p className="font-heading font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{localize(c, 'role')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{localize(c, 'bio')}</p>
            <div className="flex flex-col gap-1 text-sm">
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                <Phone size={14} /> {c.phone}
              </a>
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-primary hover:underline">
                <Mail size={14} /> {c.email}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Event assignments */}
      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">{t('coaches.eventAssignments')}</h2>
        <select
          value={effectiveEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-card text-sm mb-4"
        >
          {events.map(e => <option key={e.eventId} value={e.eventId}>{localize(e, 'name')}</option>)}
        </select>

        <div className="rounded-xl bg-card border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3 font-medium">{t('coaches.coach')}</th>
                <th className="text-left p-3 font-medium">{t('coaches.role')}</th>
                <th className="text-left p-3 font-medium">{t('coaches.rigs')}</th>
                <th className="text-left p-3 font-medium">{t('coaches.boats')}</th>
                <th className="text-left p-3 font-medium">{t('coaches.notes')}</th>
              </tr>
            </thead>
            <tbody>
              {selectedAssignments.length === 0 ? (
                <tr className="border-t">
                  <td className="p-3 text-muted-foreground" colSpan={5}>{t('coaches.noAssignments')}</td>
                </tr>
              ) : (
                selectedAssignments.map(a => (
                  <tr key={`${a.eventId}-${a.coachId}`} className="border-t">
                    <td className="p-3">{a.coachName}</td>
                    <td className="p-3">{localize(a, 'roleAtEvent')}</td>
                    <td className="p-3">{a.rigsAvailable}</td>
                    <td className="p-3">{a.boatsAvailable}</td>
                    <td className="p-3 text-muted-foreground">{localize(a, 'notes')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoachesAndTeam;
