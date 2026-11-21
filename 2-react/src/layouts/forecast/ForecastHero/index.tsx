import { useEffect } from "react";
import {
  animate,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { WeatherIcon } from "@/components/atoms/WeatherIcon";
import { capitalize, formatLongDate, formatTemp } from "@/utils/format";
import type { DailyForecast } from "@/types/forecast.types";
import { CityHeading } from "../CityHeading";

interface ForecastHeroProps {
  day: DailyForecast;
}

/** Angka mulai sedikit di bawah nilai akhir lalu "menghitung naik" saat muncul / berubah. */
const COUNT_FROM_OFFSET = 4;

function AnimatedTemperature({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const current = useMotionValue(reduceMotion ? value : value - COUNT_FROM_OFFSET);
  const text = useTransform(current, (latest) => formatTemp(latest));

  useEffect(() => {
    if (reduceMotion) {
      current.set(value);
      return;
    }
    const controls = animate(current, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [current, value, reduceMotion]);

  return (
    <p className="text-8xl leading-none font-extralight tracking-tighter tabular-nums sm:text-[120px]">
      {/* Pembaca layar langsung mendapat nilai akhir, bukan angka yang sedang berjalan. */}
      <span className="sr-only">{formatTemp(value)}°C</span>
      <m.span aria-hidden="true">{text}</m.span>
      <span aria-hidden="true">°</span>
    </p>
  );
}

/** Ringkasan hari pertama prakiraan (besok): suhu rata-rata besar + kondisi. */
export function ForecastHero({ day }: ForecastHeroProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Saat scroll, hero tertinggal sedikit dan memudar: memberi kesan kedalaman.
  const y = useTransform(scrollY, [0, 400], [0, 70]);
  const opacity = useTransform(scrollY, [0, 360], [1, 0.4]);

  return (
    <m.div style={reduceMotion ? undefined : { y, opacity }}>
      <CityHeading kicker="Prakiraan besok">
        <AnimatedTemperature value={day.avgTemp} />
        <p className="mt-2 inline-flex items-center gap-2 text-lg font-medium sm:text-xl">
          <WeatherIcon kind={day.condition.kind} className="size-6 motion-safe:animate-float" />
          {capitalize(day.condition.description)}
        </p>
        <p className="text-sm text-text-2 sm:text-[15px]">
          Rata-rata harian · {formatLongDate(day.date)}
        </p>
      </CityHeading>
    </m.div>
  );
}
