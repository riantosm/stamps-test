import { describe, expect, it } from "vitest";
import {
  capitalize,
  compassDirection,
  formatCityTime,
  formatDayName,
  formatLongDate,
  formatShortDate,
  formatTemp,
} from "@/utils/format";
import { JAKARTA_OFFSET, jakartaUnix } from "@/test/forecast-fixture";

describe("format", () => {
  it("suhu memakai koma desimal dan satu angka di belakang koma", () => {
    expect(formatTemp(27.84)).toBe("27,8");
    expect(formatTemp(28)).toBe("28,0");
  });

  it("nama hari dan tanggal dalam bahasa Indonesia", () => {
    expect(formatDayName("2026-11-22")).toBe("Minggu");
    expect(formatShortDate("2026-11-22")).toBe("22 Nov");
    expect(formatLongDate("2026-11-22")).toBe("Minggu, 22 Nov 2026");
  });

  it("jam kota memakai offset kota, bukan zona browser", () => {
    expect(formatCityTime(jakartaUnix("2026-11-21T05:32"), JAKARTA_OFFSET)).toBe("05.32");
  });

  it("arah mata angin", () => {
    expect(compassDirection(0)).toBe("utara");
    expect(compassDirection(315)).toBe("barat laut");
    expect(compassDirection(359)).toBe("utara");
    expect(compassDirection(-45)).toBe("barat laut");
  });

  it("huruf pertama kapital", () => {
    expect(capitalize("hujan ringan")).toBe("Hujan ringan");
  });
});
