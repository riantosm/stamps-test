import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { ConditionKind } from "@/types/forecast.types";

const ICON: Record<ConditionKind, { Icon: LucideIcon; colorClass: string }> = {
  clear: { Icon: Sun, colorClass: "text-icon-sun" },
  "partly-cloudy": { Icon: CloudSun, colorClass: "text-icon-sun" },
  cloudy: { Icon: Cloud, colorClass: "text-icon-cloud" },
  drizzle: { Icon: CloudDrizzle, colorClass: "text-icon-rain" },
  rain: { Icon: CloudRain, colorClass: "text-icon-rain" },
  thunderstorm: { Icon: CloudLightning, colorClass: "text-icon-storm" },
  snow: { Icon: Snowflake, colorClass: "text-icon-cloud" },
  fog: { Icon: CloudFog, colorClass: "text-icon-fog" },
};

interface WeatherIconProps {
  kind: ConditionKind;
  className?: string;
}

/** Ikon dekoratif: kondisi cuaca selalu ditulis juga sebagai teks di sebelahnya. */
export function WeatherIcon({ kind, className }: WeatherIconProps) {
  const { Icon, colorClass } = ICON[kind];
  return (
    <Icon aria-hidden="true" strokeWidth={1.75} className={cn("shrink-0", colorClass, className)} />
  );
}
