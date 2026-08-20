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

const SEA_VALUES: Record<SeaState, number> = { flat: 0, chop: -0.5, waves: -1 };

const BANDS = [
  { max: 3, name: 'Light', cls: 'light' },
  { max: 5, name: 'Light–medium', cls: 'lm' },
  { max: 7, name: 'Medium', cls: 'med' },
  { max: 9, name: 'Fresh', cls: 'fresh' },
  { max: 99, name: 'Strong', cls: 'strong' },
] as const;

const SETUPS: Record<string, Record<string, string>> = {
  light: {
    sprit: 'A hint of the diagonal crease may remain, especially downwind — keep the leech soft.',
    luff: 'Slightly loose: about 5–10 mm gap between sail and mast for a rounder, more powerful entry.',
    outhaul: 'Eased — a hand’s width of depth between boom and foot of the sail.',
    vang: 'Just snug or slightly slack so the leech stays open.',
    board: 'Fully down upwind.',
    body: 'Weight well forward, by the mast thwart. Sit still — every movement shakes wind out of the sail.',
  },
  lm: {
    sprit: 'Tension until the throat-to-clew crease just disappears.',
    luff: 'Moderate — sail close to the mast but not pinned.',
    outhaul: 'Moderate depth in the foot.',
    vang: 'Snug once sheeted in for upwind.',
    board: 'Fully down upwind.',
    body: 'Weight starting to move aft and out as pressure builds.',
  },
  med: {
    sprit: 'Crease just removed. If gusty, ease 1 cm so the peak can breathe.',
    luff: 'Snug — sail sitting close to the mast for a flatter entry.',
    outhaul: 'Firm and getting flat.',
    vang: 'Firm. Set it sheeted in for upwind before the start.',
    board: 'Fully down upwind; halfway on reaches.',
    body: 'Hiking. In gusts: ease the sheet first, hike, steer up slightly — in that order.',
  },
  fresh: {
    sprit: 'Ease 1–2 cm from “crease just gone” upwind so the leech twists open and dumps the gusts. Re-tension a touch downwind.',
    luff: 'Tight — sail almost touching the mast.',
    outhaul: 'Tight, foot nearly flat along the boom.',
    vang: 'Firm — essential so the boom doesn’t sky when she eases in a gust.',
    board: 'Raised 5–10 cm upwind to reduce trip force; well up downwind.',
    body: 'Full hiking, active mainsheet. Ease 20–30 cm the moment a gust hits, trim back as the boat flattens.',
  },
  strong: {
    sprit: 'Eased noticeably upwind — an open, twisted leech is the biggest depower left.',
    luff: 'Maximum snug.',
    outhaul: 'Maximum tight.',
    vang: 'Firm — critical downwind to prevent a death roll.',
    board: 'Up 10 cm upwind; most of the way up downwind.',
    body: 'Survival mode is normal and fine at this weight. Flat boat, eased sheet, pick moments. Getting round the course is the win.',
  },
};

const SETTING_ORDER: Array<[string, string, boolean?]> = [
  ['Throat & peak ties', 'Always as tight as possible, every day. The two most important ties on the boat.', true],
  ['Sprit', 'sprit'],
  ['Luff ties', 'luff'],
  ['Outhaul', 'outhaul'],
  ['Vang', 'vang'],
  ['Daggerboard', 'board'],
  ['Sailor', 'body'],
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

  const { rake, band, eff, angle, rangeTxt, gap, gustClamped } = useMemo(() => {
    const gustClamped = Math.max(gust, wind);
    const gustEff = wind + 0.6 * (gustClamped - wind);
    const weightAdj = (42 - weight) / 5;
    const eff = Math.max(0, gustEff + weightAdj + SEA_VALUES[sea]);

    let rake = 285 - 1.25 * eff;
    rake = Math.max(272, Math.min(285, rake));
    const rakeRounded = Math.round(rake);

    const band = BANDS.find((b) => eff < b.max) || BANDS[BANDS.length - 1];
    const angle = ((285 - rake) / 13) * 9;
    const rangeTxt = `Working range ${Math.max(272, rakeRounded - 1)}–${Math.min(285, rakeRounded + 1)} cm. Start here, adjust 1 cm from how the boat feels.`;
    const gap = gustClamped - wind;

    return { rake: rakeRounded, band, eff, angle, rangeTxt, gap, gustClamped };
  }, [weight, wind, gust, sea]);

  if (team === 'ilca') return <Navigate to="/dashboard" replace />;

  const setup = SETUPS[band.cls];

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
              <Waves size={15} /> Conditions
            </div>
            {forecast && (
              <button
                type="button"
                onClick={applyForecast}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                title={`Use today's forecast for ${locationName}`}
              >
                <RefreshCw size={12} /> Today's forecast
              </button>
            )}
          </div>
          {prefilled && (
            <p className="text-xs text-muted-foreground -mt-2 mb-4">
              Wind and gusts prefilled from today's forecast for {locationName || 'your club'} — adjust freely.
            </p>
          )}

          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold">Sailor weight</label>
              <span className="text-sm font-bold text-primary bg-primary/10 rounded px-2 py-0.5 tabular-nums">{weight} kg</span>
            </div>
            <Slider min={25} max={55} step={1} value={[weight]} onValueChange={([v]) => setWeight(v)} />
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold">Average wind</label>
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
              <label className="text-sm font-semibold">Gusts</label>
              <span className="text-sm font-bold text-primary bg-primary/10 rounded px-2 py-0.5 tabular-nums">{gustClamped.toFixed(1)} m/s</span>
            </div>
            <Slider min={0} max={16} step={0.5} value={[gustClamped]} onValueChange={([v]) => setGust(v)} />
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Use the gust figure from the forecast — gusts count more than the average for a light sailor.
            </p>
          </div>

          <div>
            <div className="mb-2">
              <span className="text-sm font-semibold">Water</span>
            </div>
            <ToggleGroup type="single" value={sea} onValueChange={(v) => v && setSea(v as SeaState)} className="justify-start gap-2">
              <ToggleGroupItem value="flat" className="flex-1 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                Flat
              </ToggleGroupItem>
              <ToggleGroupItem value="chop" className="flex-1 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                Chop
              </ToggleGroupItem>
              <ToggleGroupItem value="waves" className="flex-1 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                Waves
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Waves need power to punch through — the calculator stands the mast up slightly.
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-xl bg-card border p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            <Gauge size={15} /> Mast rake — tip to transom
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center max-[520px]:grid-cols-1">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-primary tabular-nums tracking-tight">
                {rake}
                <small className="text-base text-muted-foreground font-semibold ml-1">cm</small>
              </div>
              <div className="flex gap-1.5 flex-wrap mt-3">
                <span className="text-xs font-bold rounded-md px-2 py-1 bg-green-100 text-green-700 border border-green-200">{band.name}</span>
                <span className="text-xs font-bold rounded-md px-2 py-1 bg-primary/10 text-primary border border-primary/20">~{eff.toFixed(1)} m/s effective</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{rangeTxt}</p>
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
                <strong>Big gust gap.</strong> Gusts are {gap.toFixed(1)} m/s over the average — the setting above is biased toward the gusts. Expect to feel underpowered in the lulls; that is the right trade at this weight.
              </div>
            )}
          </div>
        </div>

        {/* Full setup */}
        <div className="rounded-xl bg-card border p-5 lg:col-span-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Full setup for these conditions
          </div>
          <div>
            {SETTING_ORDER.map(([name, keyOrText, always]) => (
              <div key={name} className="grid grid-cols-[130px_1fr] max-[520px]:grid-cols-1 gap-3.5 py-3 border-b last:border-b-0 text-sm">
                <div>
                  <div className="font-bold text-xs">{name}</div>
                  {always && (
                    <span className="inline-block font-bold text-[10px] tracking-wide text-green-700 bg-green-100 border border-green-200 rounded px-1.5 py-0.5 mt-1">
                      ALL CONDITIONS
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground leading-relaxed">{always ? keyOrText : setup[keyOrText]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How to use */}
        <div className="rounded-xl bg-card border p-5 lg:col-span-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            How to use the number
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Measuring:</strong> hook a tape over the mast tip and measure to the top aft edge of the transom, on centerline.
            Figures assume a standard sail cut — your sailmaker’s guide may sit 1–2 cm away, so treat this as a starting point.{' '}
            <strong className="text-foreground">The on-water test always wins:</strong> hiking flat out and still heeling → rake 1 cm more next time.
            Boat feels dead → stand it up 1 cm. Change one thing at a time so she learns what each control does.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RigCalculator;
