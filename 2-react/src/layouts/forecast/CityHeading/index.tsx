import type { ReactNode } from "react";

interface CityHeadingProps {
  kicker: string;
  children?: ReactNode;
}

/** Judul halaman: label kecil + "Jakarta" (+ konten hero opsional di bawahnya). */
export function CityHeading({ kicker, children }: CityHeadingProps) {
  return (
    <header className="flex flex-col items-center gap-1 pt-2 pb-4 text-center">
      <span className="text-xs font-semibold tracking-[0.14em] text-text-2 uppercase sm:text-[13px]">
        {kicker}
      </span>
      <h1 className="text-[32px] leading-tight font-medium sm:text-[40px]">Jakarta</h1>
      {children}
    </header>
  );
}
