import { useDataStore } from '@/store/dataStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { useLocalizedField } from '@/hooks/useLocalizedField';
import { MapPin, Navigation, Clock, Car, ExternalLink, Calendar, Users, Globe, Trophy } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { RegattaResult, SailEvent } from '@/types';
import { isHomeLocation } from '@/config/clubConfig';

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

const teamColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  blue:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  red:   'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

interface ResultsTabProps {
  results: RegattaResult[];
  events: SailEvent[];
}

function ResultsTab({ results, events }: ResultsTabProps) {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();

  // Only regattas (or championships) that have results
  const regattasWithResults = useMemo(() => {
    const eventIds = new Set(results.map(r => r.eventId));
    return events
      .filter(e => eventIds.has(e.eventId))
      .sort((a, b) => b.dateStart.localeCompare(a.dateStart)); // newest first
  }, [results, events]);

  const [selectedEventId, setSelectedEventId] = useState<string>(() => regattasWithResults[0]?.eventId || '');

  useEffect(() => {
    if (!selectedEventId && regattasWithResults.length > 0) {
      setSelectedEventId(regattasWithResults[0].eventId);
    }
  }, [regattasWithResults]);

  const selectedEvent = useMemo(() => events.find(e => e.eventId === selectedEventId), [events, selectedEventId]);

  const tableResults = useMemo(() =>
    results
      .filter(r => r.eventId === selectedEventId)
      .sort((a, b) => a.position - b.position),
    [results, selectedEventId]
  );

  // Determine number of races from the data
  const raceCount = useMemo(() => {
    if (tableResults.length === 0) return 0;
    return Math.max(...tableResults.map(r => r.raceScores ? r.raceScores.split(',').length : 0));
  }, [tableResults]);

  if (regattasWithResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <Trophy size={40} className="opacity-30" />
        <p className="text-sm">{t('results.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Regatta selector */}
      <div className="flex flex-wrap gap-2">
        {regattasWithResults.map(e => (
          <button
            key={e.eventId}
            onClick={() => setSelectedEventId(e.eventId)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              selectedEventId === e.eventId
                ? 'border-primary bg-primary/10 text-primary'
                : 'hover:bg-secondary'
            }`}
          >
            {localize(e, 'name')}
            <span className="ml-1.5 text-xs text-muted-foreground">{e.dateStart.slice(0, 7)}</span>
          </button>
        ))}
      </div>

      {/* Results table */}
      {selectedEvent && tableResults.length > 0 && (
        <div className="rounded-xl border overflow-hidden">
          <div className="bg-card px-4 py-3 border-b flex items-center gap-2">
            <Trophy size={16} className="text-primary" />
            <span className="font-semibold text-sm">{localize(selectedEvent, 'name')}</span>
            <span className="text-xs text-muted-foreground ml-1">— {selectedEvent.dateStart}{selectedEvent.dateEnd && ` – ${selectedEvent.dateEnd}`}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="px-3 py-2 text-left w-10">{t('results.position')}</th>
                  <th className="px-3 py-2 text-left">{t('results.sailor')}</th>
                  <th className="px-3 py-2 text-left">{t('results.sailNumber')}</th>
                  <th className="px-3 py-2 text-left">{t('results.team')}</th>
                  {Array.from({ length: raceCount }, (_, i) => (
                    <th key={i} className="px-3 py-2 text-center">{t('results.race')} {i + 1}</th>
                  ))}
                  <th className="px-3 py-2 text-center font-bold">{t('results.total')}</th>
                </tr>
              </thead>
              <tbody>
                {tableResults.map((r, idx) => {
                  const scores = r.raceScores ? r.raceScores.split(',').map(s => s.trim()) : [];
                  return (
                    <tr key={r.resultId} className={`border-t ${idx % 2 === 0 ? '' : 'bg-muted/20'}`}>
                      <td className="px-3 py-2.5 font-bold text-center">
                        {r.position === 1 ? '🥇' : r.position === 2 ? '🥈' : r.position === 3 ? '🥉' : r.position}
                      </td>
                      <td className="px-3 py-2.5 font-medium">
                        {r.sailorName}
                        {r.notesEn || r.notesSv ? (
                          <span className="ml-1 text-xs text-muted-foreground" title={r.notesEn || r.notesSv}>ⓘ</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs">{r.sailNumber}</td>
                      <td className="px-3 py-2.5">
                        {r.team && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${teamColors[r.team] || 'bg-muted text-muted-foreground'}`}>
                            {r.team}
                          </span>
                        )}
                      </td>
                      {Array.from({ length: raceCount }, (_, i) => {
                        const score = scores[i] || '—';
                        const isPenalty = isNaN(Number(score)) && score !== '—';
                        return (
                          <td key={i} className={`px-3 py-2.5 text-center ${isPenalty ? 'text-destructive font-medium' : ''}`}>
                            {score}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5 text-center font-bold">{r.totalPoints}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const EventsAndMaps = () => {
  const { t } = useTranslation();
  const { localize } = useLocalizedField();
  const data = useDataStore(s => s.data);
  const team = useThemeStore(s => s.team);

  const [activeTab, setActiveTab] = useState<'events' | 'results'>('events');
  const [searchParams] = useSearchParams();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const allEvents = useMemo(() => {
    if (!data) return [];
    return data.events
      .filter(e => !team || e.teams.length === 0 || e.teams.includes('All') || e.teams.some(t => t.toLowerCase() === team.toLowerCase()))
      .sort((a, b) => a.dateStart.localeCompare(b.dateStart));
  }, [data, team]);

  const upcomingEvents = useMemo(() =>
    allEvents.filter(e => (e.dateEnd || e.dateStart) >= today),
    [allEvents, today]
  );

  const locations = data?.locations || [];
  const regattaResults = data?.regattaResults || [];

  const [selectedEvent, setSelectedEvent] = useState(upcomingEvents[0] || null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // When data loads, select event from URL param or default to first
  useEffect(() => {
    if (upcomingEvents.length > 0) {
      const eventId = searchParams.get('event');
      if (eventId) {
        const found = upcomingEvents.find(e => e.eventId === eventId);
        if (found) { setSelectedEvent(found); return; }
      }
      if (!selectedEvent) setSelectedEvent(upcomingEvents[0]);
    }
  }, [upcomingEvents.length, searchParams]);

  const handleSelectEvent = useCallback((e: typeof upcomingEvents[0]) => {
    setSelectedEvent(e);
    // On mobile, scroll to venue details
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, []);

  const venue = useMemo(() => {
    if (!selectedEvent) return locations[0] || null;
    const found = locations.find(loc => loc.name === selectedEvent.locationName);
    if (found) return found;
    // Build a venue-like object from the event's own data when no matching location
    if (selectedEvent.locationName) {
      return {
        name: selectedEvent.locationName,
        address: selectedEvent.address || '',
        latitude: selectedEvent.latitude,
        longitude: selectedEvent.longitude,
        googleMapsUrl: '',
        website: '',
        parkingInfoSv: selectedEvent.parkingInfoSv || '',
        parkingInfoEn: selectedEvent.parkingInfoEn || '',
        facilitiesSv: '',
        facilitiesEn: '',
      };
    }
    return locations[0] || null;
  }, [selectedEvent, locations]);

  const markers = useMemo(() => {
    // Only show markers for locations referenced by filtered events
    const eventLocationNames = new Set(upcomingEvents.map(e => e.locationName));
    return locations
      .filter(loc => eventLocationNames.has(loc.name))
      .map(loc => {
        const parsed = parseCoordsFromGoogleMapsUrl(loc.googleMapsUrl);
        return {
          lat: parsed?.lat ?? loc.latitude,
          lng: parsed?.lng ?? loc.longitude,
          label: loc.name,
          isHome: isHomeLocation(data?.settings, loc.name),
        };
      });
  }, [locations, upcomingEvents]);

  // Count regattas with results for the badge
  const resultsCount = useMemo(() => {
    const eventIds = new Set(regattaResults.map(r => r.eventId));
    return eventIds.size;
  }, [regattaResults]);

  if (!data) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('events.title')}</h1>

      {/* Tab bar */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === 'events'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('results.tabEvents')}
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-1.5 ${
            activeTab === 'results'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy size={14} />
          {t('results.tabResults')}
          {resultsCount > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {resultsCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'results' ? (
        <ResultsTab results={regattaResults} events={allEvents} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Event list */}
          <div className="lg:col-span-3 space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {upcomingEvents.map(e => (
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
                  // Prefer venue coords parsed from Google Maps URL, then venue lat/lng, then event lat/lng
                  const parsed = venue ? parseCoordsFromGoogleMapsUrl(venue.googleMapsUrl) : null;
                  const lat = parsed?.lat ?? venue?.latitude ?? selectedEvent?.latitude;
                  const lng = parsed?.lng ?? venue?.longitude ?? selectedEvent?.longitude;
                  return <LazyMapView markers={markers} selectedLat={lat} selectedLng={lng} height="400px" />;
                })()}
              </Suspense>
            </MapErrorBoundary>

            {/* Selected event details */}
            {selectedEvent && (
              <div className="rounded-xl bg-card border p-5 team-border-top">
                <h3 className="font-heading text-lg font-semibold mb-2">{localize(selectedEvent, 'name')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">{selectedEvent.dateStart}</p>
                      {(selectedEvent.arrivalTime || selectedEvent.startTime || selectedEvent.endTime) && (
                        <p className="text-muted-foreground">
                          {selectedEvent.arrivalTime && <>{t('events.arrivalTime')}: {selectedEvent.arrivalTime}<br /></>}
                          {selectedEvent.startTime && <>{t('events.startTime')}: {selectedEvent.startTime}</>}
                          {selectedEvent.endTime && <> – {selectedEvent.endTime}</>}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 text-muted-foreground" />
                    <p className="text-muted-foreground">{selectedEvent.locationName}</p>
                  </div>
                  {selectedEvent.teams.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Users size={14} className="mt-0.5 text-muted-foreground" />
                      <p className="text-muted-foreground">{selectedEvent.teams.join(', ')}</p>
                    </div>
                  )}
                </div>
                {localize(selectedEvent, 'description') && (
                  <p className="text-sm text-muted-foreground">{localize(selectedEvent, 'description')}</p>
                )}
                {/* Action buttons on event card */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {(() => {
                    const parsed = venue ? parseCoordsFromGoogleMapsUrl(venue.googleMapsUrl) : null;
                    const lat = parsed?.lat ?? venue?.latitude ?? selectedEvent.latitude;
                    const lng = parsed?.lng ?? venue?.longitude ?? selectedEvent.longitude;
                    return lat && lng ? (
                      <>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer')}
                          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
                        >
                          <Navigation size={14} />
                          {t('events.getDirections')}
                        </button>
                        <button
                          onClick={() => window.open(venue?.googleMapsUrl || `https://www.google.com/maps?q=${lat},${lng}`, '_blank', 'noopener,noreferrer')}
                          className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5"
                        >
                          <MapPin size={14} />
                          {t('events.viewOnGoogleMaps')}
                        </button>
                      </>
                    ) : null;
                  })()}
                  {selectedEvent.sailarenaLink && (
                    <button
                      onClick={() => window.open(selectedEvent.sailarenaLink, '_blank', 'noopener,noreferrer')}
                      className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} />
                      {t('events.viewOnSailarena')}
                    </button>
                  )}
                  {venue?.website && (
                    <button
                      onClick={() => window.open(venue.website, '_blank', 'noopener,noreferrer')}
                      className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5"
                    >
                      <Globe size={14} />
                      {t('events.website')}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Venue details */}
            {venue && (
              <div className="rounded-xl bg-card border p-5">
                <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  {venue.name}
                  {isHomeLocation(data?.settings, venue.name) && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t('events.home')}</span>}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {venue.address && (
                    <div className="flex items-start gap-2">
                      <Navigation size={14} className="mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t('events.address')}</p>
                        <p className="text-muted-foreground">{venue.address}</p>
                      </div>
                    </div>
                  )}
                  {localize(venue, 'parkingInfo') && (
                    <div className="flex items-start gap-2">
                      <Car size={14} className="mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t('events.parking')}</p>
                        <p className="text-muted-foreground">{localize(venue, 'parkingInfo')}</p>
                      </div>
                    </div>
                  )}
                  {localize(venue, 'facilities') && (
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t('events.facilities')}</p>
                        <p className="text-muted-foreground">{localize(venue, 'facilities')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAndMaps;
