const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(lat: number, lng: number) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day',
    hourly: 'temperature_2m,wind_speed_10m,wind_direction_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum',
    wind_speed_unit: 'kn',
    timezone: 'Europe/Stockholm',
    forecast_days: '7',
    forecast_hours: '24',
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  return response.json();
}
