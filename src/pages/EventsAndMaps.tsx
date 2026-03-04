import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { MapPin, Navigation, Clock, Car, ExternalLink } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef, useCallback, Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

/** Extract lat/lng from a Google Maps URL (various formats) */
function parseCoordsFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  // Matches: @57.123,11.456  or  /place/57.123,11.456  or  ?q=57.123,11.456  or  ll=57.123,11.456
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/,
    /destination=(-?\d+\.\d+),(-?\d+\.\d+)/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  }
  return null;
}

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
  const detailsRef = useRef<HTMLDivElement>(null);

  // When data loads and no event is selected yet, pick the first
  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events.length]);

  const handleSelectEvent = useCallback((e: typeof events[0]) => {
    setSelectedEvent(e);
    // On mobile, scroll to venue details
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, []);

  const venue = useMemo(() => {
    if (!selectedEvent) return locations[0] || null;
    return locations.find(loc => loc.name === selectedEvent.locationName) || locations[0] || null;
  }, [selectedEvent, locations]);

  const markers = useMemo(() => {
    return locations.map(loc => {
      const parsed = parseCoordsFromGoogleMapsUrl(loc.googleMapsUrl);
      return {
        lat: parsed?.lat ?? loc.latitude,
        lng: parsed?.lng ?? loc.longitude,
        label: loc.name,
        isHome: loc.name.includes('Kullavik'),
      };
    });
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
              onClick={() => handleSelectEvent(e)}
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
        <div ref={detailsRef} className="lg:col-span-7 space-y-4">
          <MapErrorBoundary>
            <Suspense fallback={<MapFallback />}>
              {(() => {
                const parsed = venue ? parseCoordsFromGoogleMapsUrl(venue.googleMapsUrl) : null;
                return <LazyMapView markers={markers} selectedLat={parsed?.lat ?? venue?.latitude} selectedLng={parsed?.lng ?? venue?.longitude} height="400px" />;
              })()}
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
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    const parsed = parseCoordsFromGoogleMapsUrl(venue.googleMapsUrl);
                    const lat = parsed?.lat ?? venue.latitude;
                    const lng = parsed?.lng ?? venue.longitude;
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {t('events.getDirections')}
                </button>
                {venue.googleMapsUrl && (
                  <button
                    onClick={() => window.open(venue.googleMapsUrl, '_blank', 'noopener,noreferrer')}
                    className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    Google Maps
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsAndMaps;
