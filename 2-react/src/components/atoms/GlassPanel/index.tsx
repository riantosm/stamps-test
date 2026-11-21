import type { HTMLAttributes, PointerEvent } from "react";
import { cn } from "@/utils/cn";

interface GlassPanelProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article";
  /** Terangkat saat hover + sorotan lembut yang mengikuti kursor. */
  interactive?: boolean;
}

/** Simpan posisi kursor sebagai CSS variable; tanpa state React, jadi tanpa re-render. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/** Panel kaca semi-transparan di atas latar langit. */
export function GlassPanel({
  as: Tag = "div",
  interactive = false,
  className,
  onPointerMove,
  ...rest
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        "glass rounded-card shadow-card",
        interactive && "glass-interactive",
        className,
      )}
      onPointerMove={
        interactive
          ? (event: PointerEvent<HTMLElement>) => {
              trackPointer(event);
              onPointerMove?.(event);
            }
          : onPointerMove
      }
      {...rest}
    />
  );
}
