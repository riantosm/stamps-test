import { m } from "motion/react";
import { cn } from "@/utils/cn";
import { growX } from "@/utils/motion";

interface TempTrackProps {
  /** Posisi suhu pada skala, 0..1. */
  position: number;
  className?: string;
}

const MIN_FILL_PERCENT = 4;

/**
 * Batang horizontal yang menandai posisi satu suhu pada skala 5 hari. Dekoratif: angkanya
 * selalu tampil sebagai teks. Gradasi isian dibentangkan selebar batang penuh, jadi warnanya
 * menghangat sesuai posisi. Isian "tumbuh" dari kiri saat pertama terlihat; titiknya membesar
 * saat baris induknya (`group`) di-hover.
 */
export function TempTrack({ position, className }: TempTrackProps) {
  const percent = Math.max(MIN_FILL_PERCENT, Math.round(position * 100));
  return (
    <div aria-hidden="true" className={cn("relative h-1.5 rounded-full bg-track", className)}>
      <m.div
        variants={growX}
        className="h-full origin-left rounded-full bg-linear-to-r from-temp-cool via-temp-warm to-temp-hot"
        style={{ width: `${percent}%`, backgroundSize: `${10000 / percent}% 100%` }}
      />
      <div
        className="absolute -top-1 size-3.5 -translate-x-1/2 rounded-full bg-text ring-[3px] ring-sky-top/60 transition-transform duration-300 group-hover:scale-125"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
