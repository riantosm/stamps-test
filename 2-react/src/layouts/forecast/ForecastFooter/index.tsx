import { OPENWEATHER_URL } from "@/constants/app";

export function ForecastFooter() {
  return (
    <footer className="flex flex-wrap justify-between gap-2 text-sm text-text-2">
      <span>
        Data dari{" "}
        <a
          href={OPENWEATHER_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-text underline-offset-4 hover:underline"
        >
          OpenWeatherMap
        </a>
      </span>
      <span>Jakarta, Indonesia · WIB</span>
    </footer>
  );
}
