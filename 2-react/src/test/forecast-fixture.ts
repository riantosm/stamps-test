import type { OwmForecastEntry, OwmForecastResponse } from "@/types/forecast.types";

export const JAKARTA_OFFSET = 7 * 3600;

/** Unix time dari jam lokal Jakarta, misalnya `"2026-11-22T06:00"`. */
export function jakartaUnix(localIso: string): number {
  return Date.parse(`${localIso}:00Z`) / 1000 - JAKARTA_OFFSET;
}

export function entry(
  localIso: string,
  temp: number,
  overrides: Partial<{
    id: number;
    description: string;
    humidity: number;
    speed: number;
    deg: number;
    pop: number;
  }> = {},
): OwmForecastEntry {
  return {
    dt: jakartaUnix(localIso),
    main: { temp, humidity: overrides.humidity ?? 80 },
    weather: [{ id: overrides.id ?? 500, description: overrides.description ?? "hujan ringan" }],
    wind: { speed: overrides.speed ?? 3, deg: overrides.deg ?? 315 },
    pop: overrides.pop ?? 0.5,
  };
}

export function forecastResponse(list: OwmForecastEntry[]): OwmForecastResponse {
  return {
    list,
    city: {
      name: "Jakarta",
      timezone: JAKARTA_OFFSET,
      sunrise: jakartaUnix("2026-11-21T05:32"),
      sunset: jakartaUnix("2026-11-21T17:51"),
    },
  };
}

/** 3-jam penuh dari besok jam 00.00 WIB selama `days` hari, suhu naik 1° per hari. */
export function fullForecast(startDate = "2026-11-22", days = 5): OwmForecastResponse {
  const list: OwmForecastEntry[] = [];
  const start = Date.parse(`${startDate}T00:00:00Z`);
  for (let day = 0; day < days; day++) {
    for (let slot = 0; slot < 8; slot++) {
      const local = new Date(start + day * 86_400_000 + slot * 3 * 3_600_000)
        .toISOString()
        .slice(0, 16);
      list.push(entry(local, 27 + day + (slot % 2 === 0 ? 0.5 : -0.5)));
    }
  }
  return forecastResponse(list);
}
