import { Camera, ExternalLink } from 'lucide-react';
import { venues } from '@/data/sampleData';
import { useState } from 'react';

const LiveCameras = () => {
  const [location, setLocation] = useState(venues[0].name);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Live Cameras</h1>

      <select
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="px-3 py-1.5 rounded-md border bg-card text-sm"
      >
        {venues.map(v => <option key={v.name}>{v.name}</option>)}
      </select>

      {/* Main camera feed */}
      <div className="rounded-xl bg-muted border overflow-hidden aspect-video flex items-center justify-center flex-col gap-3 text-muted-foreground">
        <Camera size={48} className="opacity-30" />
        <p className="text-lg font-heading font-medium">No camera feed available</p>
        <p className="text-sm">{location}</p>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {venues.map(v => (
          <button
            key={v.name}
            onClick={() => setLocation(v.name)}
            className={`rounded-lg bg-muted border aspect-video flex items-center justify-center transition-all ${
              location === v.name ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <div className="text-center text-muted-foreground">
              <Camera size={20} className="mx-auto mb-1 opacity-30" />
              <p className="text-xs">{v.name}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="text-sm text-muted-foreground">Coming soon — we are working on getting live cameras at the harbor</p>
        <a
          href="https://www.windy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ExternalLink size={14} />
          Check Windy.com for more cameras
        </a>
      </div>
    </div>
  );
};

export default LiveCameras;
