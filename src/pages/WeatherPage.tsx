import { useDataStore } from '@/store/dataStore';
import { useWeather } from '@/hooks/useWeather';
import { useTranslation } from 'react-i18next';
import { getWeatherInfo, degreesToCompass } from '@/utils/weatherCodes';
import { getSailingCondition } from '@/utils/sailing';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Thermometer, Droplets, Eye, Umbrella } from 'lucide-react';
import { useState } from 'react';

const WeatherPage = () => {
  const { t } = useTranslation();
  const data = useDataStore(s => s.data);
  const [locationIdx, setLocationIdx] = useState(0);

  if (!data) return <LoadingSpinner />;

  const locations = data.locations;
  const selectedLocation = locations[locationIdx] || locations[0];

  const weather = useWeather(selectedLocation.latitude, selectedLocation.longitude, selectedLocation.name);

  const current = weather.data?.current;
  const windSpeed = current?.windSpeed ?? 0;
  const windDirection = current?.windDirection ?? 0;
  const sailingCondition = getSailingCondition(windSpeed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-heading text-2xl font-bold">{t('weather.title')}</h1>
        <select
          value={locationIdx}
          onChange={e => setLocationIdx(Number(e.target.value))}
          className="px-3 py-1.5 rounded-md border bg-card text-sm"
        >
          {locations.map((loc, i) => <option key={loc.locationId} value={i}>{loc.name}</option>)}
        </select>
      </div>

      {weather.isLoading && <LoadingSpinner />}

      {weather.isError && (
        <div className="text-center text-muted-foreground py-8">{t('weather.unavailable')}</div>
      )}

      {weather.data && (
        <>
          {/* Wind Rose - Hero */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              {/* Compass circle */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4,4" />
                <circle cx="100" cy="100" r="45" fill="hsl(var(--secondary))" />

                {/* Cardinal points */}
                {[
                  { label: 'N', angle: 0 }, { label: 'E', angle: 90 },
                  { label: 'S', angle: 180 }, { label: 'W', angle: 270 },
                ].map(({ label, angle }) => {
                  const rad = (angle - 90) * Math.PI / 180;
                  const x = 100 + 82 * Math.cos(rad);
                  const y = 100 + 82 * Math.sin(rad);
                  return (
                    <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                      className="fill-foreground font-heading text-sm font-bold">{label}</text>
                  );
                })}

                {/* Tick marks */}
                {Array.from({ length: 36 }, (_, i) => i * 10).map(angle => {
                  const rad = (angle - 90) * Math.PI / 180;
                  const inner = angle % 90 === 0 ? 72 : angle % 30 === 0 ? 78 : 83;
                  return (
                    <line key={angle}
                      x1={100 + inner * Math.cos(rad)} y1={100 + inner * Math.sin(rad)}
                      x2={100 + 88 * Math.cos(rad)} y2={100 + 88 * Math.sin(rad)}
                      stroke="hsl(var(--muted-foreground))" strokeWidth={angle % 90 === 0 ? 2 : 0.5}
                    />
                  );
                })}

                {/* Wind direction arrow */}
                <g transform={`rotate(${windDirection} 100 100)`}>
                  <path d="M100 25 L106 70 L100 62 L94 70 Z" fill="hsl(var(--primary))" />
                  <circle cx="100" cy="25" r="3" fill="hsl(var(--primary))" />
                </g>

                {/* Center text */}
                <text x="100" y="95" textAnchor="middle" className="fill-foreground font-heading text-2xl font-bold">{windSpeed}</text>
                <text x="100" y="112" textAnchor="middle" className="fill-muted-foreground text-xs">{t('weather.knots')}</text>
              </svg>
            </div>
          </div>

          {/* Sailing condition */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${sailingCondition.color} text-foreground`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {t(sailingCondition.labelKey)}
            </span>
          </div>

          {/* Current conditions */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { icon: Thermometer, label: t('weather.temperature'), value: `${current!.temperature}°C` },
              { icon: Thermometer, label: t('weather.feelsLike'), value: `${current!.feelsLike}°C` },
              { icon: Droplets, label: t('weather.humidity'), value: `${current!.humidity}%` },
              { icon: Umbrella, label: t('weather.precipitation'), value: `${current!.precipitation} mm` },
              { icon: Eye, label: t('weather.uvIndex'), value: `${current!.uvIndex}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-card border p-4 text-center card-hover">
                <Icon size={20} className="mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-heading text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* 7-day forecast */}
          <div>
            <h2 className="font-heading text-lg font-semibold mb-3">{t('weather.sevenDayForecast')}</h2>
            <div className="grid grid-cols-7 gap-2">
              {weather.data.daily.map(d => {
                const { icon: Icon } = getWeatherInfo(d.weatherCode);
                const dayLabel = new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' });
                return (
                  <div key={d.date} className="rounded-xl bg-card border p-3 text-center card-hover">
                    <p className="text-xs font-medium mb-1">{dayLabel}</p>
                    <Icon size={20} className="mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-bold">{Math.round(d.tempMax)}°</p>
                    <p className="text-xs text-muted-foreground">{Math.round(d.tempMin)}°</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{d.windSpeedMax} kn</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly */}
          <div>
            <h2 className="font-heading text-lg font-semibold mb-3">{t('weather.hourly')}</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {weather.data.hourly.map(h => {
                const { icon: Icon } = getWeatherInfo(h.weatherCode);
                const hourLabel = new Date(h.time).getHours() + ':00';
                return (
                  <div key={h.time} className="flex-shrink-0 rounded-xl bg-card border px-4 py-3 text-center min-w-[80px]">
                    <p className="text-xs text-muted-foreground">{hourLabel}</p>
                    <Icon size={18} className="mx-auto my-1 text-muted-foreground" />
                    <p className="text-sm font-bold">{Math.round(h.temperature)}°</p>
                    <p className="text-[10px] text-muted-foreground">{h.windSpeed} kn</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;
