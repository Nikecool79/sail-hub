import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start

  const allEvents = useMemo(() => {
    if (!data) return [];
    let filtered = data.events;
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

  // Auto-select the first upcoming event's day when month loads
  useEffect(() => {
    const todayDate = today.getDate();
    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

    // Find the first event on or after today (or first event of the month if not current month)
    const upcoming = monthEvents
      .map(e => new Date(e.dateStart).getDate())
      .filter(d => !isCurrentMonth || d >= todayDate)
      .sort((a, b) => a - b);

    if (upcoming.length > 0) {
      setSelectedDay(upcoming[0]);
    } else if (monthEvents.length > 0) {
      // Fallback: select the first event day in the month
      setSelectedDay(new Date(monthEvents[0].dateStart).getDate());
    } else {
      setSelectedDay(null);
    }
  }, [month, year, monthEvents.length]);

  const dayEvents = (day: number) => monthEvents.filter(e => new Date(e.dateStart).getDate() === day);

  // Up to 5 upcoming events from the selected date (or today), across all months
  const upcomingFromSelected = useMemo(() => {
    const fromDate = selectedDay
      ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
      : today.toISOString().split('T')[0];
    return allEvents
      .filter(e => (e.dateEnd || e.dateStart) >= fromDate)
      .sort((a, b) => a.dateStart.localeCompare(b.dateStart))
      .slice(0, 5);
  }, [allEvents, selectedDay, month, year, today]);

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

      {/* Two-column layout: events left, calendar right */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left: Upcoming events from selected date */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="rounded-xl bg-card border p-5 space-y-3">
            <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {selectedDay
                ? `${t('calendar.from')} ${months[month]} ${selectedDay}`
                : t('calendar.upcomingEvents')}
            </h3>
            {upcomingFromSelected.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('calendar.noEvents')}</p>
            ) : (
              upcomingFromSelected.map(e => (
                <div
                  key={e.eventId}
                  className="p-3 rounded-lg bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => navigate(`/events?event=${e.eventId}`)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${eventTypeColors[e.type]}`} />
                      <span className="text-xs capitalize text-muted-foreground">{e.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{e.dateStart}</span>
                      <ExternalLink size={12} className="text-muted-foreground" />
                    </div>
                  </div>
                  <p className="font-medium">{localize(e, 'name')}</p>
                  <p className="text-sm text-muted-foreground">{e.locationName}</p>
                  {(e.startTime || e.endTime) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {e.startTime}{e.startTime && e.endTime && ' – '}{e.endTime}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Calendar grid */}
        <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
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
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition-colors ${
                    isSelected ? 'bg-primary text-primary-foreground'
                      : isToday ? 'ring-1 ring-primary hover:bg-secondary'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <span>{day}</span>
                  {de.length > 0 && (
                    <div className="flex gap-0.5">
                      {de.map((e, idx) => (
                        <span key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground/80' : eventTypeColors[e.type] || 'bg-muted-foreground'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
