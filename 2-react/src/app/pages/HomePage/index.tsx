import { SkyBackdrop } from "@/components/atoms/SkyBackdrop";
import { useForecast } from "@/hooks/use-forecast";
import { DailyForecastList } from "@/layouts/forecast/DailyForecastList";
import { ForecastErrorPanel } from "@/layouts/forecast/ForecastErrorPanel";
import { ForecastFooter } from "@/layouts/forecast/ForecastFooter";
import { ForecastHero } from "@/layouts/forecast/ForecastHero";
import { ForecastMetrics } from "@/layouts/forecast/ForecastMetrics";
import { ForecastSkeleton } from "@/layouts/forecast/ForecastSkeleton";
import { ForecastTopBar } from "@/layouts/forecast/ForecastTopBar";
import { MissingApiKeyPanel } from "@/layouts/forecast/MissingApiKeyPanel";
import { RefreshErrorBanner } from "@/layouts/forecast/RefreshErrorBanner";

export function HomePage() {
  const { status, summary, updatedAt, error, isRefreshing, refresh } = useForecast();

  function renderContent() {
    if (status === "loading") {
      return (
        <>
          <ForecastTopBar updatedAt={null} isLoading onRefresh={refresh} />
          <ForecastSkeleton />
        </>
      );
    }

    if (status === "error" || !summary) {
      if (error?.kind === "missing-key") return <MissingApiKeyPanel />;
      return (
        <ForecastErrorPanel message={error?.message ?? "Terjadi kesalahan."} onRetry={refresh} />
      );
    }

    const [tomorrow] = summary.days;
    return (
      <>
        <ForecastTopBar updatedAt={updatedAt} isLoading={isRefreshing} onRefresh={refresh} />
        {error && (
          <RefreshErrorBanner message={error.message} updatedAt={updatedAt} onRetry={refresh} />
        )}
        <ForecastHero day={tomorrow} />
        <div className="flex flex-wrap items-stretch gap-4">
          <DailyForecastList
            days={summary.days}
            scale={summary.tempScale}
            className="min-w-0 flex-[999_1_560px]"
          />
          <div className="flex min-w-0 flex-[1_1_420px]">
            <ForecastMetrics day={tomorrow} sun={summary.sun} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-sky">
      <SkyBackdrop condition={summary?.days[0]?.condition.kind} />
      <main className="relative mx-auto flex max-w-[1120px] flex-col gap-8 px-4 pt-5 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
        {renderContent()}
        <ForecastFooter />
      </main>
    </div>
  );
}
