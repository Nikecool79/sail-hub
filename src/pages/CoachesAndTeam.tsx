import { coaches, events } from '@/data/sampleData';
import { Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const CoachesAndTeam = () => {
  const [selectedEvent, setSelectedEvent] = useState(events[0].name);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">Coaches & Team</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map(c => (
          <div key={c.name} className="rounded-xl bg-card border p-5 card-hover team-border-top">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center font-heading text-lg font-bold text-muted-foreground">
                {c.initials}
              </div>
              <div>
                <p className="font-heading font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.role}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{c.bio}</p>
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
        <h2 className="font-heading text-xl font-semibold mb-4">Event Assignments</h2>
        <select
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-card text-sm mb-4"
        >
          {events.map(e => <option key={e.id}>{e.name}</option>)}
        </select>

        <div className="rounded-xl bg-card border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3 font-medium">Coaches</th>
                <th className="text-left p-3 font-medium">Rigs</th>
                <th className="text-left p-3 font-medium">Boats</th>
                <th className="text-left p-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Erik L., Anna B.</td>
                <td className="p-3">8</td>
                <td className="p-3">12</td>
                <td className="p-3 text-muted-foreground">Bring extra sails</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoachesAndTeam;
