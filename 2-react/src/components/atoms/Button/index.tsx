import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "glass";
export type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:brightness-95",
  glass: "glass text-text hover:brightness-125",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: "h-11 min-w-11 gap-2 px-[18px] text-[15px] [&_svg]:size-[18px]",
  lg: "h-12 min-w-12 gap-2 px-6 text-base [&_svg]:size-5",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center rounded-control font-semibold transition duration-200",
        "hover:shadow-card motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97]",
        "disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none disabled:translate-y-0",
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        className,
      )}
      {...rest}
    >
      {isLoading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : leftIcon}
      {children}
    </button>
  );
}
