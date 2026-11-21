import type { CSSProperties } from "react";
import type { ConditionKind } from "@/types/forecast.types";

interface WeatherAmbienceProps {
  kind: ConditionKind;
}

const DROP_COUNT: Partial<Record<ConditionKind, number>> = {
  drizzle: 18,
  rain: 36,
  thunderstorm: 44,
};

/** Posisi "acak" tapi deterministik per indeks, supaya render tetap murni dan stabil. */
function dropStyle(index: number): CSSProperties {
  return {
    left: `${(index * 37 + 11) % 100}%`,
    height: `${14 + ((index * 7) % 12)}px`,
    opacity: 0.45 + ((index * 17) % 5) / 10,
    animationDuration: `${0.9 + ((index * 13) % 7) / 10}s`,
    animationDelay: `-${((index * 29) % 20) / 10}s`,
  };
}

/**
 * Efek cuaca halus di belakang konten, sesuai kondisi besok: tetesan hujan, kilat redup, atau
 * cahaya matahari. Murni dekoratif dan hanya bergerak kalau pengguna tidak meminta
 * pengurangan gerak (`motion-safe:`).
 */
export function WeatherAmbience({ kind }: WeatherAmbienceProps) {
  const drops = DROP_COUNT[kind] ?? 0;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {(kind === "clear" || kind === "partly-cloudy") && (
        <div className="sun-glow absolute -top-40 -right-24 size-[520px] rounded-full opacity-70 motion-safe:animate-sun-pulse" />
      )}

      {kind === "thunderstorm" && (
        <div className="storm-flash absolute inset-0 opacity-0 motion-safe:animate-flash" />
      )}

      {drops > 0 && (
        <div className="absolute inset-0 hidden motion-safe:block">
          {Array.from({ length: drops }, (_, index) => (
            <span
              key={index}
              className="absolute -top-[15vh] w-px rotate-[18deg] rounded-full bg-linear-to-b from-transparent to-rain-drop motion-safe:animate-rain"
              style={dropStyle(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
