import { useCallback, useEffect, useState } from "react";
import { ForecastError, weatherService } from "@/services/weather.service";
import { summarizeForecast } from "@/utils/forecast";
import type { ForecastErrorKind, ForecastSummary } from "@/types/forecast.types";

export interface ForecastState {
  /** `loading` hanya saat belum ada data sama sekali; refresh memakai `isRefreshing`. */
  status: "loading" | "ready" | "error";
  summary: ForecastSummary | null;
  updatedAt: Date | null;
  error: { kind: ForecastErrorKind; message: string } | null;
  isRefreshing: boolean;
}

const INITIAL_STATE: ForecastState = {
  status: "loading",
  summary: null,
  updatedAt: null,
  error: null,
  isRefreshing: false,
};

function toForecastError(error: unknown): ForecastError {
  return error instanceof ForecastError ? error : new ForecastError("unknown", { cause: error });
}

/**
 * Prakiraan Jakarta untuk satu halaman (state lokal, tanpa slice Redux).
 * Kalau refresh gagal padahal data lama ada, data lama tetap tampil dan `error` diisi
 * supaya halaman bisa menampilkan banner, bukan mengosongkan layar.
 */
export function useForecast() {
  const [state, setState] = useState<ForecastState>(INITIAL_STATE);
  /** Naik setiap kali user minta refresh; effect di bawah memuat ulang saat nilainya berubah. */
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    weatherService
      .getForecast(controller.signal)
      .then((data) => {
        const summary = summarizeForecast(data);
        if (summary.days.length === 0) throw new ForecastError("unknown");
        if (controller.signal.aborted) return;
        setState({
          status: "ready",
          summary,
          updatedAt: new Date(),
          error: null,
          isRefreshing: false,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const { kind, message } = toForecastError(error);
        setState((prev) => ({
          ...prev,
          status: prev.summary ? "ready" : "error",
          error: { kind, message },
          isRefreshing: false,
        }));
      });

    // Request lama dibatalkan saat refresh berikutnya dimulai atau komponen dilepas.
    return () => controller.abort();
  }, [requestId]);

  const refresh = useCallback(() => {
    setState((prev) =>
      prev.summary
        ? { ...prev, isRefreshing: true, error: null }
        : { ...prev, status: "loading", error: null, isRefreshing: true },
    );
    setRequestId((id) => id + 1);
  }, []);

  return { ...state, refresh };
}
