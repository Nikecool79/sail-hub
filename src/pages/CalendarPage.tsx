import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const eventTypeColors: Record<string, string> = {
  Regatta: 'bg-ocean',
  Training: 'bg-green-500',
  Championship: 'bg-red-500',
  Social: 'bg-yellow-400',
};

const CalendarPage = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const data = useDataStore(s => s.data);
  const team = useThemeStore(s => s.team);

  const [month, setMonth] = useState(3); // April = 3 (0-indexed)
  const [year] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start

  const allEvents = useMemo(() => {
    if (!data) return [];
    let filtered = data.events;
    // Filter by selected team if one is chosen
    if (team) {
      filtered = filtered.filter(e =>
        e.teams.length === 0 || e.teams.includes('All') || e.teams.some(t => t.toLowerCase() === team.toLowerCase())
      );
    }
    return filtered;
  }, [data, team]);

  const monthEvents = useMemo(() => {
    return allEvents.filter(e => {
      const d = new Date(e.dateStart);
      return d.getMonth() === month && d.getFullYear() === year && (!filter || e.type === filter);
    });
  }, [allEvents, month, year, filter]);

  const dayEvents = (day: number) => monthEvents.filter(e => new Date(e.dateStart).getDate() === day);
  const selectedDayEvents = selectedDay ? dayEvents(selectedDay) : [];

  const types = ['Regatta', 'Training', 'Championship', 'Social'];

  if (!data) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('calendar.title')}</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${!filter ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          {t('calendar.allTypes')}
        </button>
        {types.map(tp => (
          <button
            key={tp}
            onClick={() => setFilter(f => f === tp ? null : tp)}
            className={`px-3 py-1.5 text-sm rounded-full capitalize transition-colors ${filter === tp ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
          >
            {tp}
          </button>
        ))}
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => setMonth(m => Math.max(0, m - 1))} className="p-2 rounded-md hover:bg-secondary"><ChevronLeft size={20} /></button>
        <h2 className="font-heading text-xl font-semibold">{months[month]} {year}</h2>
        <button onClick={() => setMonth(m => Math.min(11, m + 1))} className="p-2 rounded-md hover:bg-secondary"><ChevronRight size={20} /></button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const de = dayEvents(day);
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <span>{day}</span>
              {de.length > 0 && (
                <div className="flex gap-0.5">
                  {de.map((e, idx) => (
                    <span key={idx} className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[e.type] || 'bg-muted-foreground'}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="rounded-xl bg-card border p-5 space-y-3">
          <h3 className="font-heading font-semibold">{months[month]} {selectedDay}, {year}</h3>
          {selectedDayEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('calendar.noEvents')}</p>
          ) : (
            selectedDayEvents.map(e => (
              <div key={e.eventId} className="p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${eventTypeColors[e.type]}`} />
                  <span className="text-xs capitalize text-muted-foreground">{e.type}</span>
                </div>
                <p className="font-medium">{localize(e, 'name')}</p>
                <p className="text-sm text-muted-foreground">{e.locationName}</p>
                {(e.startTime || e.endTime) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {e.startTime}{e.startTime && e.endTime && ' – '}{e.endTime}
                  </p>
                )}
                <p className="text-sm mt-1">{localize(e, 'description')}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
