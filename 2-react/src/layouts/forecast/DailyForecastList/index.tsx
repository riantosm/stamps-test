import { useId } from "react";
import { m } from "motion/react";
import { CalendarDays } from "lucide-react";
import { GlassPanel } from "@/components/atoms/GlassPanel";
import { TempTrack } from "@/components/atoms/TempTrack";
import { WeatherIcon } from "@/components/atoms/WeatherIcon";
import { capitalize, formatDayName, formatShortDate, formatTemp } from "@/utils/format";
import { temperaturePosition } from "@/utils/forecast";
import { fadeUp, revealOnScroll, staggerContainer } from "@/utils/motion";
import type { DailyForecast, ForecastSummary } from "@/types/forecast.types";

interface DailyForecastListProps {
  days: DailyForecast[];
  scale: ForecastSummary["tempScale"];
  className?: string;
}

export function DailyForecastList({ days, scale, className }: DailyForecastListProps) {
  const titleId = useId();

  return (
    <GlassPanel as="section" aria-labelledby={titleId} className={className}>
      <div className="px-4 pt-4 sm:px-6 sm:pt-5">
        <h2
          id={titleId}
          className="flex items-center gap-2 border-b border-glass-border pb-3 text-xs font-semibold tracking-[0.1em] text-text-3 uppercase"
        >
          <CalendarDays aria-hidden="true" className="size-4" />
          Prakiraan {days.length} hari
        </h2>
      </div>

      <m.ul variants={staggerContainer} {...revealOnScroll} className="px-2 sm:px-3">
        {days.map((day) => (
          <m.li
            key={day.date}
            variants={fadeUp}
            className="group relative grid grid-cols-[minmax(0,1fr)_26px_56px_52px] items-center gap-3 rounded-xl px-2 py-3 not-first:before:absolute not-first:before:inset-x-2 not-first:before:top-0 not-first:before:h-px not-first:before:bg-divider sm:not-first:before:inset-x-3 transition-colors duration-200 hover:bg-row-hover sm:grid-cols-[104px_minmax(0,1.1fr)_minmax(0,1.3fr)_72px] sm:gap-4 sm:px-3 sm:py-3.5"
          >
            <div className="flex min-w-0 flex-col">
              <span className="text-base font-semibold sm:text-[17px]">
                {formatDayName(day.date)}
                <span className="font-normal text-text-3 sm:hidden">
                  {" "}
                  {formatShortDate(day.date)}
                </span>
              </span>
              <span className="hidden text-[13px] text-text-3 sm:block">
                {formatShortDate(day.date)}
              </span>
              <span className="truncate text-[13px] text-text-3 sm:hidden">
                {capitalize(day.condition.description)}
              </span>
              {day.isPartial && <span className="text-xs text-text-3">Data sebagian</span>}
            </div>

            <div className="flex min-w-0 items-center gap-2.5 text-[15px] text-text-2">
              <WeatherIcon
                kind={day.condition.kind}
                className="size-[26px] transition-transform duration-300 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-110"
              />
              <span className="hidden truncate sm:inline">
                {capitalize(day.condition.description)}
              </span>
            </div>

            <TempTrack position={temperaturePosition(day.avgTemp, scale)} />

            <span className="text-right text-xl font-semibold tabular-nums transition-transform duration-300 motion-safe:group-hover:scale-105 sm:text-[22px]">
              {formatTemp(day.avgTemp)}°<span className="sr-only">C</span>
            </span>
          </m.li>
        ))}
      </m.ul>

      <p className="mx-4 mt-2 mb-4 border-t border-glass-border pt-3 text-[13px] leading-normal text-text-3 sm:mx-6 sm:mb-5">
        Satu suhu per hari: rata-rata dari pembacaan setiap 3 jam, waktu Jakarta (WIB). Batang
        menunjukkan posisi suhu pada skala {scale.min}–{scale.max}°C.
      </p>
    </GlassPanel>
  );
}
