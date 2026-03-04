import { useState, useMemo } from 'react';
import { useDataStore } from '@/store/dataStore';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Camera, ExternalLink } from 'lucide-react';

function toEmbedUrl(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    // YouTube watch URL → embed URL
    if ((u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') && u.pathname === '/watch') {
      const videoId = u.searchParams.get('v');
      if (videoId) {
        const list = u.searchParams.get('list');
        return `https://www.youtube.com/embed/${videoId}${list ? `?list=${list}` : ''}`;
      }
    }
    // youtu.be short URL
    if (u.hostname === 'youtu.be') {
      const videoId = u.pathname.slice(1);
      const list = u.searchParams.get('list');
      return `https://www.youtube.com/embed/${videoId}${list ? `?list=${list}` : ''}`;
    }
  } catch { /* not a valid URL, return as-is */ }
  return url;
}

const LiveCameras = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useDataStore();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const locations = useMemo(() => data?.locations || [], [data?.locations]);
  const selected = locations[selectedIdx] || null;
  const defaultWebcamUrl = data?.settings?.['Default Webcam URL'] || '';
  const rawUrl = selected?.webcamUrl || defaultWebcamUrl;
  const webcamUrl = toEmbedUrl(rawUrl);
  const hasWebcam = webcamUrl.trim() !== '';

  if (isLoading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t('cameras.title')}</h1>

      <select
        value={selected?.name || ''}
        onChange={e => {
          const idx = locations.findIndex(l => l.name === e.target.value);
          if (idx >= 0) setSelectedIdx(idx);
        }}
        className="px-3 py-1.5 rounded-md border bg-card text-sm"
      >
        {locations.map(v => <option key={v.name}>{v.name}</option>)}
      </select>

      {/* Main camera feed */}
      {hasWebcam ? (
        <div className="rounded-xl bg-muted border overflow-hidden aspect-video">
          <iframe
            src={webcamUrl}
            title={selected?.name}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-xl bg-muted border overflow-hidden aspect-video flex items-center justify-center flex-col gap-3 text-muted-foreground">
          <Camera size={48} className="opacity-30" />
          <p className="text-lg font-heading font-medium">{t('cameras.noFeed')}</p>
          <p className="text-sm">{selected?.name}</p>
        </div>
      )}

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {locations.map((v, idx) => (
          <button
            key={v.name}
            onClick={() => setSelectedIdx(idx)}
            className={`rounded-lg bg-muted border aspect-video flex items-center justify-center transition-all ${
              selectedIdx === idx ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
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
        <p className="text-sm text-muted-foreground">{t('cameras.comingSoon')}</p>
        <a
          href="https://www.windy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ExternalLink size={14} />
          {t('cameras.windyLink')}
        </a>
      </div>
    </div>
  );
};

export default LiveCameras;
