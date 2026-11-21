import { JAKARTA_TIME_ZONE } from "@/constants/app";

const LOCALE = "id-ID";

const tempFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** `27.84` → `"27,8"` (tanpa satuan; pemanggil menambahkan `°` atau `°C`). */
export function formatTemp(celsius: number): string {
  return tempFormatter.format(celsius);
}

/** `YYYY-MM-DD` dibaca sebagai tanggal kalender (UTC) supaya tidak bergeser oleh zona browser. */
function calendarDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

/** `"2026-11-22"` → `"Minggu"`. */
export function formatDayName(isoDate: string): string {
  return calendarDate(isoDate).toLocaleDateString(LOCALE, { weekday: "long", timeZone: "UTC" });
}

/** `"2026-11-22"` → `"22 Nov"`. */
export function formatShortDate(isoDate: string): string {
  return calendarDate(isoDate).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

/** `"2026-11-22"` → `"Minggu, 22 Nov 2026"`. */
export function formatLongDate(isoDate: string): string {
  return `${formatDayName(isoDate)}, ${formatShortDate(isoDate)} ${isoDate.slice(0, 4)}`;
}

/** Jam lokal kota dari unix time + offset, misalnya `"05.32"`. */
export function formatCityTime(unixSeconds: number, offsetSeconds: number): string {
  return new Date((unixSeconds + offsetSeconds) * 1000).toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  });
}

/** Jam WIB untuk label "Diperbarui", misalnya `"07.55"`. */
export function formatJakartaClock(date: Date): string {
  return date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: JAKARTA_TIME_ZONE,
  });
}

const COMPASS = [
  "utara",
  "timur laut",
  "timur",
  "tenggara",
  "selatan",
  "barat daya",
  "barat",
  "barat laut",
] as const;

/** Derajat arah asal angin → nama mata angin, misalnya `315` → `"barat laut"`. */
export function compassDirection(degrees: number): string {
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % COMPASS.length;
  return COMPASS[index];
}

/** `"hujan ringan"` → `"Hujan ringan"`. */
export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase(LOCALE) + text.slice(1);
}
