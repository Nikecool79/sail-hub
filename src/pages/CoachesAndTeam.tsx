import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, Clock, Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCoachTime } from '@/hooks/useCoachTime';

const COACH_TIME_SHEET_ID = import.meta.env.VITE_COACH_TIME_SHEET_ID || '';

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
  const { data: timeEntries, isLoading: timeLoading } = useCoachTime(COACH_TIME_SHEET_ID);

  // Auto-select first event when list changes
  const effectiveEventId = selectedEventId && events.some(e => e.eventId === selectedEventId)
    ? selectedEventId
    : events[0]?.eventId ?? '';

  // Hours summary per coach (all time)
  const hoursByCoach = useMemo(() => {
    if (!timeEntries) return {};
    const acc: Record<string, number> = {};
    for (const e of timeEntries) {
      acc[e.coach] = (acc[e.coach] || 0) + e.hours;
    }
    return acc;
  }, [timeEntries]);

  if (!data) return <LoadingSpinner />;

  const selectedAssignments = data.eventAssignments.filter(a => a.eventId === effectiveEventId);

  const getInitials = (name: string) =>
    name.split(/\s+/).map(part => part[0]).join('').toUpperCase();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('coaches.title')}</h1>

      <Tabs defaultValue="coaches">
        <TabsList>
          <TabsTrigger value="coaches" className="gap-2">
            <Users size={16} /> {t('coaches.tab')}
          </TabsTrigger>
          {COACH_TIME_SHEET_ID && (
            <TabsTrigger value="timelog" className="gap-2">
              <Clock size={16} /> {t('coaches.timeLog')}
            </TabsTrigger>
          )}
        </TabsList>

        {/* === COACHES TAB === */}
        <TabsContent value="coaches" className="space-y-8 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coaches.map(c => (
              <div key={c.coachId} className="rounded-xl bg-card border p-5 card-hover team-border-top">
                <div className="flex items-center gap-3 mb-3">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center font-heading text-lg font-bold text-muted-foreground">
                      {getInitials(c.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-heading font-semibold">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{localize(c, 'role')}</p>
                    {hoursByCoach[c.name] !== undefined && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Clock size={10} className="inline mr-1" />
                        {hoursByCoach[c.name].toFixed(1)} h totalt
                      </p>
                    )}
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
        </TabsContent>

        {/* === TIME LOG TAB === */}
        {COACH_TIME_SHEET_ID && (
          <TabsContent value="timelog" className="space-y-4 mt-4">
            {timeLoading ? (
              <LoadingSpinner />
            ) : !timeEntries || timeEntries.length === 0 ? (
              <div className="rounded-xl bg-card border p-8 text-center text-muted-foreground">
                <Clock size={40} className="mx-auto mb-3 opacity-40" />
                <p>{t('coaches.noTimeEntries')}</p>
              </div>
            ) : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(hoursByCoach)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, hours]) => (
                      <div key={name} className="rounded-xl bg-card border p-4 text-center">
                        <p className="font-heading font-bold text-2xl">{hours.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{name}</p>
                        <p className="text-xs text-muted-foreground">{t('coaches.hours')}</p>
                      </div>
                    ))}
                </div>

                {/* Log table */}
                <div className="rounded-xl bg-card border overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium">{t('coaches.date')}</th>
                        <th className="text-left p-3 font-medium">{t('coaches.coach')}</th>
                        <th className="text-left p-3 font-medium">{t('coaches.team')}</th>
                        <th className="text-left p-3 font-medium">{t('coaches.activity')}</th>
                        <th className="text-right p-3 font-medium">{t('coaches.hours')}</th>
                        <th className="text-left p-3 font-medium">{t('coaches.notes')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeEntries.map((e, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3 font-mono text-xs">{e.date}</td>
                          <td className="p-3 font-medium">{e.coach}</td>
                          <td className="p-3 capitalize">{e.team}</td>
                          <td className="p-3">{e.activity}</td>
                          <td className="p-3 text-right tabular-nums">{e.hours.toFixed(1)}</td>
                          <td className="p-3 text-muted-foreground">{e.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CoachesAndTeam;
