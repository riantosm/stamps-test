import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  tone?: "strong" | "soft";
}

const TONE_CLASS: Record<NonNullable<SkeletonProps["tone"]>, string> = {
  strong: "bg-skeleton",
  soft: "bg-skeleton-soft",
};

/** Blok placeholder dekoratif; status memuat diumumkan terpisah lewat `role="status"`. */
export function Skeleton({ className, tone = "strong" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md motion-reduce:animate-none",
        TONE_CLASS[tone],
        className,
      )}
    />
  );
}
