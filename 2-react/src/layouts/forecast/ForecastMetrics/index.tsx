import type { ReactNode } from "react";
import { m } from "motion/react";
import { Droplet, Sunrise, Umbrella, Wind } from "lucide-react";
import { MetricCard } from "@/components/molecules/MetricCard";
import { compassDirection, formatCityTime } from "@/utils/format";
import { fadeUp, growX, revealOnScroll, staggerContainer } from "@/utils/motion";
import type { DailyForecast, ForecastSummary } from "@/types/forecast.types";

interface ForecastMetricsProps {
  /** Hari pertama prakiraan (besok). */
  day: DailyForecast;
  sun: ForecastSummary["sun"];
}

/** Tiap kartu muncul berurutan saat grid masuk layar. */
function Reveal({ children }: { children: ReactNode }) {
  return (
    <m.div variants={fadeUp} className="h-full">
      {children}
    </m.div>
  );
}

export function ForecastMetrics({ day, sun }: ForecastMetricsProps) {
  const sunrise = formatCityTime(sun.sunrise, sun.timezone);
  const sunset = formatCityTime(sun.sunset, sun.timezone);

  return (
    <m.div
      variants={staggerContainer}
      {...revealOnScroll}
      className="grid w-full auto-rows-fr grid-cols-2 gap-3 sm:gap-4"
    >
      <Reveal>
        <MetricCard
          label="Kelembapan"
          icon={Droplet}
          value={`${day.humidity}%`}
          description="Rata-rata besok."
        />
      </Reveal>
      <Reveal>
        <MetricCard
          label="Angin"
          icon={Wind}
          value={
            <>
              {day.windKmh} <span className="text-base sm:text-lg">km/j</span>
            </>
          }
          description={
            day.windFromDeg === null
              ? "Rata-rata besok."
              : `Rata-rata besok, dari ${compassDirection(day.windFromDeg)}.`
          }
        />
      </Reveal>
      <Reveal>
        <MetricCard
          label="Peluang hujan"
          icon={Umbrella}
          value={`${day.rainChance}%`}
          visual={
            <div aria-hidden="true" className="h-1.5 rounded-full bg-track">
              <m.div
                variants={growX}
                className="h-full origin-left rounded-full bg-icon-rain"
                style={{ width: `${day.rainChance}%` }}
              />
            </div>
          }
          description="Tertinggi besok."
        />
      </Reveal>
      <Reveal>
        <MetricCard
          label="Matahari"
          icon={Sunrise}
          value={sunrise}
          description={`Terbit hari ini. Terbenam ${sunset}.`}
        />
      </Reveal>
    </m.div>
  );
}
