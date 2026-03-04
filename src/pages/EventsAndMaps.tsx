import { events, venues } from '@/data/sampleData';
import { MapPin, Navigation, Clock, Car } from 'lucide-react';
import { useState } from 'react';

const EventsAndMaps = () => {
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const venue = venues.find(v => v.name === selectedEvent.location) || venues[0];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Events & Maps</h1>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Event list */}
        <div className="lg:col-span-3 space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {events.map(e => (
            <button
              key={e.id}
              onClick={() => setSelectedEvent(e)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedEvent.id === e.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'hover:bg-secondary'
              }`}
            >
              <p className="font-medium text-sm">{e.name}</p>
              <p className="text-xs text-muted-foreground">{e.date}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>{e.location}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-xl bg-muted border overflow-hidden" style={{ height: '400px' }}>
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-muted-foreground">
              <div className="relative">
                {/* Stylized map placeholder */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-20">
                  <path d="M20,180 Q50,100 100,120 T180,60" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  <circle cx="30" cy="170" r="6" fill="currentColor" opacity="0.5" />
                  <circle cx="80" cy="130" r="6" fill="currentColor" opacity="0.5" />
                  <circle cx="140" cy="90" r="6" fill="currentColor" opacity="0.5" />
                  <circle cx="170" cy="65" r="6" fill="currentColor" opacity="0.5" />
                </svg>
                {/* Pins */}
                {venues.map((v, i) => (
                  <div
                    key={v.name}
                    className={`absolute flex flex-col items-center ${v.name === venue.name ? 'text-primary scale-125' : 'text-muted-foreground'} transition-all`}
                    style={{
                      left: `${20 + i * 45}px`,
                      top: `${160 - i * 35}px`,
                    }}
                  >
                    <MapPin size={20} fill={v.isHome ? 'currentColor' : 'none'} />
                    <span className="text-[9px] mt-0.5 whitespace-nowrap">{v.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm">Map — {venue.name}</p>
            </div>
          </div>

          {/* Venue details */}
          <div className="rounded-xl bg-card border p-5 team-border-top">
            <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              {venue.name}
              {venue.isHome && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Home</span>}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Navigation size={14} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">{venue.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Car size={14} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Parking</p>
                  <p className="text-muted-foreground">{venue.parking}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Facilities</p>
                  <p className="text-muted-foreground">{venue.facilities}</p>
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsAndMaps;
