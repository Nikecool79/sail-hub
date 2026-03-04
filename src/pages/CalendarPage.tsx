import { events } from '@/data/sampleData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const eventTypeColors: Record<string, string> = {
  regatta: 'bg-ocean',
  training: 'bg-green-500',
  championship: 'bg-red-500',
  social: 'bg-yellow-400',
};

const CalendarPage = () => {
  const [month, setMonth] = useState(3); // April = 3 (0-indexed)
  const [year] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start

  const monthEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year && (!filter || e.type === filter);
  });

  const dayEvents = (day: number) => monthEvents.filter(e => new Date(e.date).getDate() === day);
  const selectedDayEvents = selectedDay ? dayEvents(selectedDay) : [];

  const types = ['regatta', 'training', 'championship', 'social'];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Calendar</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${!filter ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          All
        </button>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(f => f === t ? null : t)}
            className={`px-3 py-1.5 text-sm rounded-full capitalize transition-colors ${filter === t ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
          >
            {t}
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
            <p className="text-sm text-muted-foreground">No events — smooth sailing ahead! ⛵</p>
          ) : (
            selectedDayEvents.map(e => (
              <div key={e.id} className="p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${eventTypeColors[e.type]}`} />
                  <span className="text-xs capitalize text-muted-foreground">{e.type}</span>
                </div>
                <p className="font-medium">{e.name}</p>
                <p className="text-sm text-muted-foreground">{e.location}</p>
                <p className="text-sm mt-1">{e.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
