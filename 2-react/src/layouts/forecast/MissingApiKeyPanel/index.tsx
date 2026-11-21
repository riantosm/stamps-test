import { ExternalLink, KeyRound } from "lucide-react";
import { GlassPanel } from "@/components/atoms/GlassPanel";
import { OPENWEATHER_API_KEYS_URL } from "@/constants/app";
import { CityHeading } from "../CityHeading";

function Code({ children }: { children: string }) {
  return (
    <code className="rounded-md border border-glass-border bg-skeleton-soft px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  );
}

export function MissingApiKeyPanel() {
  return (
    <div className="flex flex-col gap-10 pt-6 sm:pt-12">
      <CityHeading kicker="Prakiraan 5 hari" />
      <GlassPanel
        as="section"
        aria-labelledby="missing-key-title"
        className="flex w-full max-w-[640px] flex-col gap-4 self-center p-6 sm:p-9"
      >
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-warning-soft">
            <KeyRound aria-hidden="true" strokeWidth={1.75} className="size-7 text-warning" />
          </div>
          <h2 id="missing-key-title" className="text-2xl leading-snug font-semibold">
            API key belum diatur
          </h2>
        </div>
        <p className="text-base leading-normal text-text-2">
          Aplikasi ini butuh API key gratis dari OpenWeatherMap. Key tidak disimpan di kode sumber.
        </p>
        <ol className="flex list-decimal flex-col gap-2.5 pl-[22px] text-base leading-relaxed">
          <li>
            Salin <Code>.env.example</Code> menjadi <Code>.env</Code>
          </li>
          <li>
            Isi <Code>OPENWEATHER_API_KEY</Code> dengan key milikmu
          </li>
          <li>
            Jalankan ulang <Code>yarn dev</Code>
          </li>
        </ol>
        <a
          href={OPENWEATHER_API_KEYS_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 inline-flex h-11 items-center gap-2 self-start rounded-control bg-primary px-5 text-[15px] font-semibold text-primary-fg no-underline transition hover:brightness-95"
        >
          Buat API key gratis
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">(membuka tab baru)</span>
        </a>
      </GlassPanel>
    </div>
  );
}
