import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, type LucideIcon } from 'lucide-react';

interface WeatherCodeInfo {
  icon: LucideIcon;
  descKey: string;
}

const codeMap: Record<number, WeatherCodeInfo> = {
  0: { icon: Sun, descKey: 'weatherCodes.0' },
  1: { icon: Sun, descKey: 'weatherCodes.1' },
  2: { icon: CloudSun, descKey: 'weatherCodes.2' },
  3: { icon: Cloud, descKey: 'weatherCodes.3' },
  45: { icon: CloudFog, descKey: 'weatherCodes.45' },
  48: { icon: CloudFog, descKey: 'weatherCodes.48' },
  51: { icon: CloudDrizzle, descKey: 'weatherCodes.51' },
  53: { icon: CloudDrizzle, descKey: 'weatherCodes.53' },
  55: { icon: CloudDrizzle, descKey: 'weatherCodes.55' },
  61: { icon: CloudRain, descKey: 'weatherCodes.61' },
  63: { icon: CloudRain, descKey: 'weatherCodes.63' },
  65: { icon: CloudRain, descKey: 'weatherCodes.65' },
  71: { icon: CloudSnow, descKey: 'weatherCodes.71' },
  73: { icon: CloudSnow, descKey: 'weatherCodes.73' },
  75: { icon: CloudSnow, descKey: 'weatherCodes.75' },
  80: { icon: CloudRain, descKey: 'weatherCodes.80' },
  81: { icon: CloudRain, descKey: 'weatherCodes.81' },
  82: { icon: CloudRain, descKey: 'weatherCodes.82' },
  85: { icon: CloudSnow, descKey: 'weatherCodes.85' },
  86: { icon: CloudSnow, descKey: 'weatherCodes.86' },
  95: { icon: CloudLightning, descKey: 'weatherCodes.95' },
  96: { icon: CloudLightning, descKey: 'weatherCodes.96' },
  99: { icon: CloudLightning, descKey: 'weatherCodes.99' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return codeMap[code] || { icon: Cloud, descKey: 'weatherCodes.3' };
}

export function degreesToCompass(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}
