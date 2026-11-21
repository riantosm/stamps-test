import { Skeleton } from "@/components/atoms/Skeleton";
import { GlassPanel } from "@/components/atoms/GlassPanel";
import { FORECAST_DAYS } from "@/constants/app";
import { CityHeading } from "../CityHeading";

/** Kerangka dengan tata letak yang sama dengan hasil akhir, supaya tidak ada lompatan layout. */
export function ForecastSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8">
      <CityHeading kicker="Prakiraan besok">
        <Skeleton className="my-1 h-24 w-48 rounded-card sm:h-28 sm:w-56" />
        <Skeleton className="h-5 w-40" />
        <Skeleton tone="soft" className="h-3.5 w-60" />
      </CityHeading>

      <div className="flex flex-wrap gap-4">
        <GlassPanel className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 px-4 py-5 sm:px-6">
          <Skeleton className="h-3 w-36" />
          {Array.from({ length: FORECAST_DAYS }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,1fr)_26px_56px_52px] items-center gap-3 sm:grid-cols-[104px_minmax(0,1.1fr)_minmax(0,1.3fr)_72px] sm:gap-4"
            >
              <Skeleton className="h-4" />
              <Skeleton tone="soft" className="h-4" />
              <Skeleton tone="soft" className="h-1.5 rounded-full" />
              <Skeleton className="h-5" />
            </div>
          ))}
        </GlassPanel>
        <div className="grid min-w-0 flex-[1_1_420px] auto-rows-fr grid-cols-2 gap-3 sm:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <GlassPanel key={index} aria-hidden="true" className="min-h-[150px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
