import { CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { GlassPanel } from "@/components/atoms/GlassPanel";
import { CityHeading } from "../CityHeading";

interface ForecastErrorPanelProps {
  message: string;
  onRetry: () => void;
}

export function ForecastErrorPanel({ message, onRetry }: ForecastErrorPanelProps) {
  return (
    <div className="flex flex-col gap-10 pt-6 sm:pt-12">
      <CityHeading kicker="Prakiraan 5 hari" />
      <GlassPanel
        role="alert"
        className="flex w-full max-w-[560px] flex-col items-center gap-3.5 self-center px-6 py-10 text-center sm:px-8"
      >
        <div className="flex size-[72px] items-center justify-center rounded-full bg-danger-soft">
          <CloudOff aria-hidden="true" strokeWidth={1.75} className="size-[34px] text-danger" />
        </div>
        <h2 className="text-2xl leading-snug font-semibold">Prakiraan belum bisa dimuat</h2>
        <p className="max-w-[420px] text-base leading-normal text-text-2">{message}</p>
        <Button
          onClick={onRetry}
          leftIcon={<RefreshCw aria-hidden="true" />}
          className="mt-2.5 px-[22px]"
        >
          Coba lagi
        </Button>
      </GlassPanel>
    </div>
  );
}
