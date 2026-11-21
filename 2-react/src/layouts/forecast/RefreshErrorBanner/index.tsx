import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { GlassPanel } from "@/components/atoms/GlassPanel";
import { formatJakartaClock } from "@/utils/format";

interface RefreshErrorBannerProps {
  message: string;
  updatedAt: Date | null;
  onRetry: () => void;
}

/** Refresh gagal tapi data lama masih ada: beri tahu tanpa mengosongkan layar. */
export function RefreshErrorBanner({ message, updatedAt, onRetry }: RefreshErrorBannerProps) {
  return (
    <GlassPanel
      role="alert"
      className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-5"
    >
      <TriangleAlert aria-hidden="true" className="size-5 shrink-0 text-warning" />
      <p className="min-w-0 flex-[999_1_280px] text-sm leading-normal text-text-2">
        <strong className="font-semibold text-text">Gagal memperbarui.</strong> {message}
        {updatedAt && ` Data yang tampil dari ${formatJakartaClock(updatedAt)} WIB.`}
      </p>
      <Button variant="glass" onClick={onRetry}>
        Coba lagi
      </Button>
    </GlassPanel>
  );
}
