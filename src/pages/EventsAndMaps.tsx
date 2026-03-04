import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { MapPin, Navigation, Clock, Car } from 'lucide-react';
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const LazyMapView = React.lazy(() => import('@/components/map/MapView'));

function MapFallback() {
  return (
    <div className="rounded-xl bg-muted border flex items-center justify-center text-muted-foreground" style={{ height: '400px' }}>
      <p className="text-sm">Loading map...</p>
    </div>
  );
}

class MapErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl bg-muted border flex items-center justify-center text-muted-foreground" style={{ height: '400px' }}>
          <p className="text-sm">Map could not be loaded</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const EventsAndMaps = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const data = useDataStore(s => s.data);

  const events = data?.events || [];
  const locations = data?.locations || [];

  const [selectedEvent, setSelectedEvent] = useState(events[0] || null);

  // When data loads and no event is selected yet, pick the first
  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events.length]);

  const venue = useMemo(() => {
    if (!selectedEvent) return locations[0] || null;
    return locations.find(loc => loc.name === selectedEvent.locationName) || locations[0] || null;
  }, [selectedEvent, locations]);

  const markers = useMemo(() => {
    return locations.map(loc => ({
      lat: loc.latitude,
      lng: loc.longitude,
      label: loc.name,
      isHome: loc.name.includes('Kullavik'),
    }));
  }, [locations]);

  if (!data) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('events.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Event list */}
        <div className="lg:col-span-3 space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {events.map(e => (
            <button
              key={e.eventId}
              onClick={() => setSelectedEvent(e)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedEvent?.eventId === e.eventId
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'hover:bg-secondary'
              }`}
            >
              <p className="font-medium text-sm">{localize(e, 'name')}</p>
              <p className="text-xs text-muted-foreground">{e.dateStart}</p>
              {(e.startTime || e.endTime) && (
                <p className="text-xs text-muted-foreground">
                  {e.startTime}{e.startTime && e.endTime && ' – '}{e.endTime}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>{e.locationName}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Map + Venue details */}
        <div className="lg:col-span-7 space-y-4">
          <MapErrorBoundary>
            <Suspense fallback={<MapFallback />}>
              <LazyMapView markers={markers} selectedLat={venue?.latitude} selectedLng={venue?.longitude} height="400px" />
            </Suspense>
          </MapErrorBoundary>

          {/* Venue details */}
          {venue && (
            <div className="rounded-xl bg-card border p-5 team-border-top">
              <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                {venue.name}
                {venue.name.includes('Kullavik') && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t('events.home')}</span>}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Navigation size={14} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('events.address')}</p>
                    <p className="text-muted-foreground">{venue.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Car size={14} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('events.parking')}</p>
                    <p className="text-muted-foreground">{localize(venue, 'parkingInfo')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('events.facilities')}</p>
                    <p className="text-muted-foreground">{localize(venue, 'facilities')}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`, '_blank', 'noopener,noreferrer')}
                className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t('events.getDirections')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsAndMaps;
