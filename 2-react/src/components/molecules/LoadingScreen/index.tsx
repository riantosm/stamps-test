import { APP_NAME } from "@/constants/app";
import { cn } from "@/utils/cn";

interface LoadingScreenProps {
  variant?: "full" | "inline";
}

const VARIANT_CLASS: Record<NonNullable<LoadingScreenProps["variant"]>, string> = {
  full: "min-h-dvh bg-sky",
  inline: "py-16",
};

export function LoadingScreen({ variant = "full" }: LoadingScreenProps) {
  return (
    <div
      role="status"
      className={cn("flex flex-col items-center justify-center gap-4", VARIANT_CLASS[variant])}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="size-12 animate-spin motion-reduce:animate-none"
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--track)" strokeWidth="4" />
        <path
          d="M24 4a20 20 0 0 1 20 20"
          fill="none"
          stroke="var(--text)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm font-medium text-text-2">Memuat {APP_NAME}…</span>
    </div>
  );
}
