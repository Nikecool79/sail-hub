import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { useDataStore } from '@/store/dataStore';
import { getDefaultCoords } from '@/config/clubConfig';

// Fix default marker icons for Vite bundler
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  type?: string;
  isHome?: boolean;
}

interface Props {
  markers: MapMarker[];
  selectedLat?: number;
  selectedLng?: number;
  height?: string;
  zoom?: number;
}

function FlyToSelected({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13, { duration: 1 });
    }
  }, [lat, lng, map]);
  return null;
}

export default function MapView({ markers, selectedLat, selectedLng, height = '400px', zoom = 10 }: Props) {
  const settings = useDataStore((s) => s.data?.settings);
  const defaults = getDefaultCoords(settings);
  const center: [number, number] = selectedLat && selectedLng
    ? [selectedLat, selectedLng]
    : [defaults.lat, defaults.lng];

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }} className="rounded-xl z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected lat={selectedLat} lng={selectedLng} />
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>
            <strong>{m.label}</strong>
            {m.isHome && <span> (Home)</span>}
            <br />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1565C0' }}
            >
              Get Directions
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
