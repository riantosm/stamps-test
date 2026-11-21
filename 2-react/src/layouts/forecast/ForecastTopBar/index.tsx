import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { formatJakartaClock } from "@/utils/format";

interface ForecastTopBarProps {
  updatedAt: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function ForecastTopBar({ updatedAt, isLoading, onRefresh }: ForecastTopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p role="status" className="inline-flex items-center gap-2 text-sm text-text-2">
        {isLoading ? (
          "Memuat prakiraan cuaca Jakarta…"
        ) : updatedAt ? (
          <>
            <Clock aria-hidden="true" className="size-4" />
            Diperbarui {formatJakartaClock(updatedAt)} WIB
          </>
        ) : null}
      </p>
      <Button
        onClick={onRefresh}
        isLoading={isLoading}
        leftIcon={
          <RefreshCw
            aria-hidden="true"
            className="transition-transform duration-500 motion-safe:group-hover:rotate-180"
          />
        }
        aria-label={isLoading ? "Memuat prakiraan" : "Perbarui prakiraan"}
        className="max-sm:px-0"
      >
        <span className="max-sm:sr-only">{isLoading ? "Memuat…" : "Perbarui"}</span>
      </Button>
    </div>
  );
}
