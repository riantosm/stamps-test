import { describe, expect, it } from "vitest";
import {
  averageWindDirection,
  conditionKind,
  localDateKey,
  temperaturePosition,
  temperatureScale,
  toDailyForecasts,
} from "@/utils/forecast";
import {
  entry,
  forecastResponse,
  fullForecast,
  JAKARTA_OFFSET,
  jakartaUnix,
} from "@/test/forecast-fixture";

// 21 Nov 2026, 07.55 WIB
const NOW = jakartaUnix("2026-11-21T07:55") * 1000;

describe("localDateKey", () => {
  it("memakai tanggal Jakarta, bukan UTC", () => {
    // 22 Nov 01.00 WIB = 21 Nov 18.00 UTC
    expect(localDateKey(jakartaUnix("2026-11-22T01:00"), JAKARTA_OFFSET)).toBe("2026-11-22");
  });
});

describe("toDailyForecasts", () => {
  it("mengembalikan 5 hari mulai besok, satu suhu rata-rata per hari", () => {
    const days = toDailyForecasts(fullForecast(), NOW);
    expect(days.map((day) => day.date)).toEqual([
      "2026-11-22",
      "2026-11-23",
      "2026-11-24",
      "2026-11-25",
      "2026-11-26",
    ]);
    expect(days.map((day) => day.avgTemp)).toEqual([27, 28, 29, 30, 31]);
    expect(days.every((day) => day.readings === 8 && !day.isPartial)).toBe(true);
  });

  it("mengabaikan pembacaan hari ini", () => {
    const data = forecastResponse([
      entry("2026-11-21T21:00", 40),
      entry("2026-11-22T00:00", 26),
      entry("2026-11-22T03:00", 28),
    ]);
    const [first] = toDailyForecasts(data, NOW);
    expect(first.date).toBe("2026-11-22");
    expect(first.avgTemp).toBe(27);
  });

  it("menandai hari yang datanya tidak lengkap", () => {
    const data = forecastResponse([entry("2026-11-26T00:00", 27), entry("2026-11-26T03:00", 27)]);
    const [day] = toDailyForecasts(data, NOW);
    expect(day.readings).toBe(2);
    expect(day.isPartial).toBe(true);
  });

  it("memilih kondisi yang paling sering muncul", () => {
    const data = forecastResponse([
      entry("2026-11-22T00:00", 27, { id: 803, description: "awan pecah" }),
      entry("2026-11-22T03:00", 27, { id: 500, description: "hujan ringan" }),
      entry("2026-11-22T06:00", 27, { id: 500, description: "hujan ringan" }),
    ]);
    expect(toDailyForecasts(data, NOW)[0].condition).toEqual({
      kind: "rain",
      description: "hujan ringan",
    });
  });

  it("menghitung kelembapan, angin (km/j), dan peluang hujan tertinggi", () => {
    const data = forecastResponse([
      entry("2026-11-22T00:00", 27, { humidity: 80, speed: 2, pop: 0.2 }),
      entry("2026-11-22T03:00", 27, { humidity: 90, speed: 4, pop: 0.7 }),
    ]);
    const [day] = toDailyForecasts(data, NOW);
    expect(day.humidity).toBe(85);
    expect(day.windKmh).toBe(11); // 3 m/s × 3,6
    expect(day.rainChance).toBe(70);
  });
});

describe("averageWindDirection", () => {
  it("merata-ratakan sudut lewat vektor (350° dan 10° → 0°)", () => {
    const result = averageWindDirection([
      { wind: { speed: 1, deg: 350 } },
      { wind: { speed: 1, deg: 10 } },
    ]);
    expect(result).not.toBeNull();
    expect(Math.min(result!, 360 - result!)).toBeCloseTo(0, 5);
  });

  it("null kalau angin saling meniadakan", () => {
    expect(
      averageWindDirection([{ wind: { speed: 1, deg: 0 } }, { wind: { speed: 1, deg: 180 } }]),
    ).toBeNull();
  });
});

describe("conditionKind", () => {
  it.each([
    [211, "thunderstorm"],
    [301, "drizzle"],
    [501, "rain"],
    [721, "fog"],
    [800, "clear"],
    [802, "partly-cloudy"],
    [804, "cloudy"],
  ] as const)("%i → %s", (id, kind) => {
    expect(conditionKind(id)).toBe(kind);
  });
});

describe("temperatureScale & temperaturePosition", () => {
  it("membulatkan skala ke derajat penuh", () => {
    expect(temperatureScale([{ avgTemp: 27.1 }, { avgTemp: 29.2 }])).toEqual({ min: 27, max: 30 });
  });

  it("melebarkan skala kalau semua suhu sama", () => {
    expect(temperatureScale([{ avgTemp: 28 }, { avgTemp: 28 }])).toEqual({ min: 27, max: 29 });
  });

  it("posisi dibatasi 0..1", () => {
    const scale = { min: 27, max: 30 };
    expect(temperaturePosition(28.5, scale)).toBeCloseTo(0.5);
    expect(temperaturePosition(10, scale)).toBe(0);
    expect(temperaturePosition(40, scale)).toBe(1);
  });
});
