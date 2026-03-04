import { weatherData, venues } from '@/data/sampleData';
import { Thermometer, Droplets, Sun, CloudRain, Cloud, CloudSun as CloudSunIcon, Eye, Umbrella } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  sun: Sun,
  'cloud-sun': CloudSunIcon,
  cloud: Cloud,
  'cloud-rain': CloudRain,
};

const WeatherPage = () => {
  const [location, setLocation] = useState(venues[0].name);
  const w = weatherData.current;
  const sailingCondition = w.windSpeed < 8 ? { label: 'Light winds — good for beginners', color: 'bg-green-500' }
    : w.windSpeed < 16 ? { label: 'Good for sailing', color: 'bg-green-500' }
    : w.windSpeed < 22 ? { label: 'Moderate — experienced sailors', color: 'bg-yellow-400' }
    : { label: 'Not recommended', color: 'bg-red-500' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-heading text-2xl font-bold">Weather</h1>
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-card text-sm"
        >
          {venues.map(v => <option key={v.name}>{v.name}</option>)}
        </select>
      </div>

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
            <g transform={`rotate(${w.windDirection} 100 100)`}>
              <path d="M100 25 L106 70 L100 62 L94 70 Z" fill="hsl(var(--primary))" />
              <circle cx="100" cy="25" r="3" fill="hsl(var(--primary))" />
            </g>

            {/* Center text */}
            <text x="100" y="95" textAnchor="middle" className="fill-foreground font-heading text-2xl font-bold">{w.windSpeed}</text>
            <text x="100" y="112" textAnchor="middle" className="fill-muted-foreground text-xs">knots</text>
          </svg>
        </div>
      </div>

      {/* Sailing condition */}
      <div className="flex justify-center">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${sailingCondition.color} text-foreground`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          {sailingCondition.label}
        </span>
      </div>

      {/* Current conditions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { icon: Thermometer, label: 'Temperature', value: `${w.temp}°C` },
          { icon: Thermometer, label: 'Feels Like', value: `${w.feelsLike}°C` },
          { icon: Droplets, label: 'Humidity', value: `${w.humidity}%` },
          { icon: Umbrella, label: 'Precipitation', value: `${w.precipitation} mm` },
          { icon: Eye, label: 'UV Index', value: `${w.uvIndex}` },
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
        <h2 className="font-heading text-lg font-semibold mb-3">7-Day Forecast</h2>
        <div className="grid grid-cols-7 gap-2">
          {weatherData.daily.map(d => {
            const Icon = iconMap[d.icon] || Cloud;
            return (
              <div key={d.day} className="rounded-xl bg-card border p-3 text-center card-hover">
                <p className="text-xs font-medium mb-1">{d.day}</p>
                <Icon size={20} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm font-bold">{d.high}°</p>
                <p className="text-xs text-muted-foreground">{d.low}°</p>
                <p className="text-[10px] text-muted-foreground mt-1">{d.wind} kn</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-3">Hourly</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weatherData.hourly.map(h => {
            const Icon = iconMap[h.icon] || Cloud;
            return (
              <div key={h.hour} className="flex-shrink-0 rounded-xl bg-card border px-4 py-3 text-center min-w-[80px]">
                <p className="text-xs text-muted-foreground">{h.hour}</p>
                <Icon size={18} className="mx-auto my-1 text-muted-foreground" />
                <p className="text-sm font-bold">{h.temp}°</p>
                <p className="text-[10px] text-muted-foreground">{h.wind} kn</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
