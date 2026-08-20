import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';
import { useDataStore } from '@/store/dataStore';
import { useWeather } from '@/hooks/useWeather';
import { getDefaultCoords, getDefaultLocationName } from '@/config/clubConfig';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Gauge, Sliders, Waves, RefreshCw } from 'lucide-react';

type SeaState = 'flat' | 'chop' | 'waves';
type Band = 'light' | 'lm' | 'med' | 'fresh' | 'strong';

const SEA_VALUES: Record<SeaState, number> = { flat: 0, chop: -0.5, waves: -1 };

const BANDS: Array<{ max: number; cls: Band }> = [
  { max: 3, cls: 'light' },
  { max: 5, cls: 'lm' },
  { max: 7, cls: 'med' },
  { max: 9, cls: 'fresh' },
  { max: 99, cls: 'strong' },
];

const SETTING_ORDER: Array<[string, string, boolean?]> = [
  ['throatPeak', 'throatPeakText', true],
  ['sprit', 'sprit'],
  ['luff', 'luff'],
  ['outhaul', 'outhaul'],
  ['vang', 'vang'],
  ['board', 'board'],
  ['body', 'body'],
];

const RigCalculator = () => {
  const { t } = useTranslation();
  const team = useThemeStore((s) => s.team);
  const settings = useDataStore((s) => s.data?.settings);
  const [weight, setWeight] = useState(33);
  const [wind, setWind] = useState(5);
  const [gust, setGust] = useState(7);
  const [sea, setSea] = useState<SeaState>('flat');
  const [prefilled, setPrefilled] = useState(false);

  const coords = getDefaultCoords(settings);
  const locationName = getDefaultLocationName(settings);
  const weather = useWeather(coords.lat, coords.lng, locationName);
  const forecast = weather.data?.current;

  const applyForecast = () => {
    if (!forecast) return;
    setWind(Math.min(12, forecast.windSpeed));
    setGust(Math.max(Math.min(16, forecast.windGusts), Math.min(12, forecast.windSpeed)));
  };

  const appliedRef = useRef(false);
  useEffect(() => {
    if (forecast && !appliedRef.current) {
      appliedRef.current = true;
      applyForecast();
      setPrefilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecast]);

  const { rake, band, eff, angle, rangeMin, rangeMax, gap, gustClamped } = useMemo(() => {
    const gustClamped = Math.max(gust, wind);
    const gustEff = wind + 0.6 * (gustClamped - wind);
    const weightAdj = (42 - weight) / 5;
    const eff = Math.max(0, gustEff + weightAdj + SEA_VALUES[sea]);

    let rake = 285 - 1.25 * eff;
    rake = Math.max(272, Math.min(285, rake));
    const rakeRounded = Math.round(rake);

    const band = BANDS.find((b) => eff < b.max) || BANDS[BANDS.length - 1];
    const angle = ((285 - rake) / 13) * 9;
    const rangeMin = Math.max(272, rakeRounded - 1);
    const rangeMax = Math.min(285, rakeRounded + 1);
    const gap = gustClamped - wind;

    return { rake: rakeRounded, band, eff, angle, rangeMin, rangeMax, gap, gustClamped };
  }, [weight, wind, gust, sea]);

  if (team === 'ilca') return <Navigate to="/dashboard" replace />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <Sliders size={22} className="text-primary" />
          {t('rigCalculator.title', 'Rig Calculator')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('rigCalculator.subtitle', 'Optimist mast rake and setup guide, tuned to sailor weight and conditions.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Conditions */}
        <div className="rounded-xl bg-card border p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Waves size={15} /> {t('rigCalculator.conditions.title')}
            </div>
            {forecast && (
              <button
                type="button"
                onClick={applyForecast}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                title={t('rigCalculator.forecast.buttonTitle', { location: locationName }) as string}
              >
                <RefreshCw size={12} /> {t('rigCalculator.forecast.button')}
              </button>
            )}
          </div>
          {prefilled && (
            <p className="text-xs text-muted-foreground -mt-2 mb-4">
              {t('rigCalculator.forecast.prefilledNote', {
                location: locationName || t('rigCalculator.forecast.prefilledNoteFallback'),
              })}
            </p>
          )}

          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold">{t('rigCalculator.conditions.weight')}</label>
              <span className="text-sm font-bold text-primary bg-primary/10 rounded px-2 py-0.5 tabular-nums">{weight} kg</span>
            </div>
            <Slider min={25} max={55} step={1} value={[weight]} onValueChange={([v]) => setWeight(v)} />
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold">{t('rigCalculator.conditions.wind')}</label>
              <span className="text-sm font-bold text-primary bg-primary/10 rounded px-2 py-0.5 tabular-nums">{wind.toFixed(1)} m/s</span>
            </div>
            <Slider
              min={0}
              max={12}
              step={0.5}
              value={[wind]}
              onValueChange={([v]) => {
                setWind(v);
                if (gust < v) setGust(v);
              }}
            />
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold">{t('rigCalculator.conditions.gust')}</label>
              <span className="text-sm font-bold text-primary bg-primary/10 rounded px-2 py-0.5 tabular-nums">{gustClamped.toFixed(1)} m/s</span>
            </div>
            <Slider min={0} max={16} step={0.5} value={[gustClamped]} onValueChange={([v]) => setGust(v)} />
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t('rigCalculator.conditions.gustHint')}</p>
          </div>

          <div>
            <div className="mb-2">
              <span className="text-sm font-semibold">{t('rigCalculator.conditions.water')}</span>
            </div>
            <ToggleGroup type="single" value={sea} onValueChange={(v) => v && setSea(v as SeaState)} className="justify-start gap-2">
              <ToggleGroupItem value="flat" className="flex-1 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                {t('rigCalculator.sea.flat')}
              </ToggleGroupItem>
              <ToggleGroupItem value="chop" className="flex-1 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                {t('rigCalculator.sea.chop')}
              </ToggleGroupItem>
              <ToggleGroupItem value="waves" className="flex-1 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                {t('rigCalculator.sea.waves')}
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t('rigCalculator.conditions.waterHint')}</p>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-xl bg-card border p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            <Gauge size={15} /> {t('rigCalculator.result.title')}
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center max-[520px]:grid-cols-1">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-primary tabular-nums tracking-tight">
                {rake}
                <small className="text-base text-muted-foreground font-semibold ml-1">cm</small>
              </div>
              <div className="flex gap-1.5 flex-wrap mt-3">
                <span className="text-xs font-bold rounded-md px-2 py-1 bg-green-100 text-green-700 border border-green-200">
                  {t('rigCalculator.bands.' + band.cls)}
                </span>
                <span className="text-xs font-bold rounded-md px-2 py-1 bg-primary/10 text-primary border border-primary/20">
                  {t('rigCalculator.result.effective', { value: eff.toFixed(1) })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                {t('rigCalculator.result.rangeText', { min: rangeMin, max: rangeMax })}
              </p>
            </div>
            <svg width="140" height="124" viewBox="0 0 170 150" aria-hidden="true" className="mx-auto">
              <path d="M0 128 Q 20 122 40 128 T 80 128 T 120 128 T 160 128 L170 128 V150 H0 Z" fill="#3B82F6" opacity=".14" />
              <path d="M28 112 L138 112 L130 128 L40 128 Z" fill="hsl(var(--card))" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" />
              <g style={{ transformOrigin: '58px 112px', transform: `rotate(${angle}deg)`, transition: 'transform .3s ease' }}>
                <line x1="58" y1="112" x2="58" y2="18" stroke="#344054" strokeWidth="3" strokeLinecap="round" />
                <line x1="58" y1="96" x2="112" y2="26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                <path d="M60 22 L110 28 L116 100 L60 100 Z" fill="#3B82F6" opacity=".85" />
                <line x1="58" y1="100" x2="118" y2="100" stroke="#344054" strokeWidth="3" strokeLinecap="round" />
              </g>
            </svg>
            {gap >= 3 && (
              <div className="col-span-full mt-1.5 bg-amber-50 border border-amber-200 border-l-[3px] border-l-amber-500 px-3.5 py-2.5 rounded-lg text-xs leading-relaxed text-amber-800">
                <strong>{t('rigCalculator.result.gustGapTitle')}</strong>{' '}
                {t('rigCalculator.result.gustGapText', { gap: gap.toFixed(1) })}
              </div>
            )}
          </div>
        </div>

        {/* Full setup */}
        <div className="rounded-xl bg-card border p-5 lg:col-span-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {t('rigCalculator.setup.title')}
          </div>
          <div>
            {SETTING_ORDER.map(([nameKey, keyOrText, always]) => (
              <div key={nameKey} className="grid grid-cols-[130px_1fr] max-[520px]:grid-cols-1 gap-3.5 py-3 border-b last:border-b-0 text-sm">
                <div>
                  <div className="font-bold text-xs">{t('rigCalculator.setup.names.' + nameKey)}</div>
                  {always && (
                    <span className="inline-block font-bold text-[10px] tracking-wide text-green-700 bg-green-100 border border-green-200 rounded px-1.5 py-0.5 mt-1">
                      {t('rigCalculator.setup.always')}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  {always ? t('rigCalculator.setup.' + keyOrText) : t(`rigCalculator.setups.${band.cls}.${keyOrText}`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to use */}
        <div className="rounded-xl bg-card border p-5 lg:col-span-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {t('rigCalculator.howTo.title')}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">{t('rigCalculator.howTo.measuringLabel')}</strong> {t('rigCalculator.howTo.measuringText')}{' '}
            <strong className="text-foreground">{t('rigCalculator.howTo.onWaterLabel')}</strong> {t('rigCalculator.howTo.onWaterText')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RigCalculator;
