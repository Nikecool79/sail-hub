import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '@/services/openMeteo';
import type { WeatherData } from '@/types';

export function useWeather(lat: number, lng: number, locationName: string) {
  return useQuery<WeatherData>({
    queryKey: ['weather', lat, lng],
    queryFn: async () => {
      const raw = await fetchWeather(lat, lng);
      return {
        current: {
          temperature: raw.current.temperature_2m,
          feelsLike: raw.current.apparent_temperature,
          humidity: raw.current.relative_humidity_2m,
          precipitation: raw.current.precipitation,
          uvIndex: raw.current.uv_index,
          windSpeed: Math.round(raw.current.wind_speed_10m),
          windDirection: raw.current.wind_direction_10m,
          windGusts: Math.round(raw.current.wind_gusts_10m),
          weatherCode: raw.current.weather_code,
          isDay: raw.current.is_day === 1,
        },
        hourly: (raw.hourly?.time || []).map((t: string, i: number) => ({
          time: t,
          temperature: raw.hourly.temperature_2m[i],
          windSpeed: Math.round(raw.hourly.wind_speed_10m[i]),
          windDirection: raw.hourly.wind_direction_10m[i],
          weatherCode: raw.hourly.weather_code[i],
        })),
        daily: (raw.daily?.time || []).map((d: string, i: number) => ({
          date: d,
          tempMax: raw.daily.temperature_2m_max[i],
          tempMin: raw.daily.temperature_2m_min[i],
          windSpeedMax: Math.round(raw.daily.wind_speed_10m_max[i]),
          windDirectionDominant: raw.daily.wind_direction_10m_dominant[i],
          weatherCode: raw.daily.weather_code[i],
          precipitationSum: raw.daily.precipitation_sum[i],
        })),
        location: locationName,
        fetchedAt: Date.now(),
      };
    },
    refetchInterval: 15 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    enabled: lat !== 0 && lng !== 0,
  });
}
