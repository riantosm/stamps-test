import { FORECAST_DAYS } from "@/constants/app";
import type {
  ConditionKind,
  DailyForecast,
  ForecastSummary,
  OwmForecastEntry,
  OwmForecastResponse,
} from "@/types/forecast.types";

const READINGS_PER_FULL_DAY = 8;
const MS_TO_KMH = 3.6;

/** Tanggal lokal `YYYY-MM-DD` dari unix time + offset zona waktu kota (detik). */
export function localDateKey(unixSeconds: number, offsetSeconds: number): string {
  return new Date((unixSeconds + offsetSeconds) * 1000).toISOString().slice(0, 10);
}

/** Kelompok kondisi dari kode cuaca OpenWeatherMap (https://openweathermap.org/weather-conditions). */
export function conditionKind(weatherId: number): ConditionKind {
  if (weatherId >= 200 && weatherId < 300) return "thunderstorm";
  if (weatherId >= 300 && weatherId < 400) return "drizzle";
  if (weatherId >= 500 && weatherId < 600) return "rain";
  if (weatherId >= 600 && weatherId < 700) return "snow";
  if (weatherId >= 700 && weatherId < 800) return "fog";
  if (weatherId === 800) return "clear";
  if (weatherId === 801 || weatherId === 802) return "partly-cloudy";
  return "cloudy";
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Kondisi yang paling sering muncul sepanjang hari (seri: yang muncul lebih dulu). */
function dominantCondition(entries: OwmForecastEntry[]): DailyForecast["condition"] {
  const counts = new Map<string, { count: number; id: number }>();
  for (const entry of entries) {
    const weather = entry.weather[0];
    if (!weather) continue;
    const current = counts.get(weather.description);
    counts.set(weather.description, { count: (current?.count ?? 0) + 1, id: weather.id });
  }

  let best: { description: string; id: number; count: number } | null = null;
  for (const [description, { count, id }] of counts) {
    if (!best || count > best.count) best = { description, id, count };
  }
  if (!best) return { kind: "cloudy", description: "tidak diketahui" };
  return { kind: conditionKind(best.id), description: best.description };
}

/**
 * Arah angin rata-rata lewat rata-rata vektor (rata-rata biasa salah untuk sudut: 350° dan 10°
 * seharusnya 0°, bukan 180°). Kecepatan dipakai sebagai bobot.
 */
export function averageWindDirection(entries: Pick<OwmForecastEntry, "wind">[]): number | null {
  let x = 0;
  let y = 0;
  for (const { wind } of entries) {
    const radians = (wind.deg * Math.PI) / 180;
    x += Math.sin(radians) * wind.speed;
    y += Math.cos(radians) * wind.speed;
  }
  if (Math.hypot(x, y) < 1e-6) return null;
  const degrees = (Math.atan2(x, y) * 180) / Math.PI;
  return (degrees + 360) % 360;
}

/**
 * Ubah data 3-jam menjadi satu baris per hari (tanggal lokal Jakarta), mulai besok,
 * maksimal `days` hari. Suhu hari = rata-rata semua pembacaan pada tanggal itu, sama seperti
 * solusi CLI di folder `2/`.
 */
export function toDailyForecasts(
  data: OwmForecastResponse,
  now: number = Date.now(),
  days: number = FORECAST_DAYS,
): DailyForecast[] {
  const offset = data.city.timezone;
  const today = localDateKey(Math.floor(now / 1000), offset);
  const byDate = new Map<string, OwmForecastEntry[]>();

  for (const entry of data.list) {
    const key = localDateKey(entry.dt, offset);
    if (key <= today) continue;
    const bucket = byDate.get(key);
    if (bucket) bucket.push(entry);
    else byDate.set(key, [entry]);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, days)
    .map(([date, entries]) => ({
      date,
      avgTemp: average(entries.map((entry) => entry.main.temp)),
      condition: dominantCondition(entries),
      readings: entries.length,
      isPartial: entries.length < READINGS_PER_FULL_DAY,
      humidity: Math.round(average(entries.map((entry) => entry.main.humidity))),
      windKmh: Math.round(average(entries.map((entry) => entry.wind.speed)) * MS_TO_KMH),
      windFromDeg: averageWindDirection(entries),
      rainChance: Math.round(Math.max(...entries.map((entry) => entry.pop)) * 100),
    }));
}

/** Skala batang suhu: dari derajat bulat di bawah suhu terendah sampai di atas suhu tertinggi. */
export function temperatureScale(days: Pick<DailyForecast, "avgTemp">[]): {
  min: number;
  max: number;
} {
  if (days.length === 0) return { min: 0, max: 1 };
  const temps = days.map((day) => day.avgTemp);
  const min = Math.floor(Math.min(...temps));
  const max = Math.ceil(Math.max(...temps));
  return min === max ? { min: min - 1, max: max + 1 } : { min, max };
}

/** Posisi suhu pada skala, 0..1. */
export function temperaturePosition(temp: number, scale: { min: number; max: number }): number {
  const ratio = (temp - scale.min) / (scale.max - scale.min);
  return Math.min(1, Math.max(0, ratio));
}

export function summarizeForecast(
  data: OwmForecastResponse,
  now: number = Date.now(),
): ForecastSummary {
  const days = toDailyForecasts(data, now);
  return {
    days,
    tempScale: temperatureScale(days),
    sun: { sunrise: data.city.sunrise, sunset: data.city.sunset, timezone: data.city.timezone },
  };
}
