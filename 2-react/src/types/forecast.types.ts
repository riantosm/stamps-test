/**
 * Bentuk respons OpenWeatherMap `GET /data/2.5/forecast` (5 hari / 3 jam), hanya field yang
 * dipakai aplikasi ini.
 */
export interface OwmForecastEntry {
  /** Unix time (detik, UTC). */
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    id: number;
    description: string;
  }[];
  wind: {
    /** m/s (units=metric). */
    speed: number;
    deg: number;
  };
  /** Peluang hujan 0..1. */
  pop: number;
}

export interface OwmForecastResponse {
  list: OwmForecastEntry[];
  city: {
    name: string;
    /** Selisih detik dari UTC (Jakarta: 25200). */
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export type ConditionKind =
  "clear" | "partly-cloudy" | "cloudy" | "drizzle" | "rain" | "thunderstorm" | "snow" | "fog";

export interface DailyForecast {
  /** Tanggal lokal Jakarta, `YYYY-MM-DD`. */
  date: string;
  /** Suhu rata-rata semua pembacaan 3-jam pada tanggal itu (°C). */
  avgTemp: number;
  condition: {
    kind: ConditionKind;
    /** Deskripsi bahasa Indonesia dari OpenWeatherMap (`lang=id`). */
    description: string;
  };
  /** Jumlah pembacaan 3-jam pada hari itu (8 = sehari penuh). */
  readings: number;
  /** Hari terakhir prakiraan biasanya terpotong karena data hanya mencakup ±120 jam. */
  isPartial: boolean;
  humidity: number;
  windKmh: number;
  /** Arah asal angin rata-rata dalam derajat, `null` kalau tidak bisa ditentukan. */
  windFromDeg: number | null;
  /** Peluang hujan tertinggi hari itu, 0..100. */
  rainChance: number;
}

export interface ForecastSummary {
  days: DailyForecast[];
  /** Skala batang suhu: dibulatkan ke derajat penuh terdekat. */
  tempScale: { min: number; max: number };
  sun: { sunrise: number; sunset: number; timezone: number };
}

export type ForecastErrorKind = "missing-key" | "invalid-key" | "network" | "unknown";
