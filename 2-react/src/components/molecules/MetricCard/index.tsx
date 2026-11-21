import { useId, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { GlassPanel } from "@/components/atoms/GlassPanel";

interface MetricCardProps {
  label: string;
  icon: LucideIcon;
  value: ReactNode;
  /** Visual tambahan di bawah angka (bar, kurva). */
  visual?: ReactNode;
  description: ReactNode;
}

export function MetricCard({ label, icon: Icon, value, visual, description }: MetricCardProps) {
  const titleId = useId();
  return (
    <GlassPanel
      as="section"
      interactive
      aria-labelledby={titleId}
      className="group flex h-full min-h-[150px] flex-col gap-2.5 p-4 sm:px-5 sm:py-[18px]"
    >
      <h2
        id={titleId}
        className="flex items-center gap-2 text-xs font-semibold tracking-[0.06em] text-text-3 uppercase sm:tracking-[0.1em]"
      >
        <Icon
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-110"
        />
        {label}
      </h2>
      <p className="text-[30px] leading-tight font-medium sm:text-4xl">{value}</p>
      {visual}
      <p className="mt-auto text-[13px] leading-normal text-text-3">{description}</p>
    </GlassPanel>
  );
}
