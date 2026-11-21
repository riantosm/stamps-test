import axios from "axios";
import { httpClient } from "@/services/http-client";
import type { ForecastErrorKind, OwmForecastResponse } from "@/types/forecast.types";

const MESSAGES: Record<ForecastErrorKind, string> = {
  "missing-key": "API key OpenWeatherMap belum diatur.",
  "invalid-key":
    "API key ditolak OpenWeatherMap. Periksa kembali nilai OPENWEATHER_API_KEY di file .env.",
  network: "Server cuaca tidak merespons. Periksa koneksi internet, lalu coba lagi.",
  unknown: "Terjadi kesalahan saat memuat prakiraan. Coba lagi beberapa saat lagi.",
};

export class ForecastError extends Error {
  readonly kind: ForecastErrorKind;

  constructor(kind: ForecastErrorKind, options?: ErrorOptions) {
    super(MESSAGES[kind], options);
    this.name = "ForecastError";
    this.kind = kind;
  }
}

function classify(error: unknown): ForecastErrorKind {
  if (!axios.isAxiosError(error)) return "unknown";
  const status = error.response?.status;
  const code = error.response?.data?.code;
  if (code === "MISSING_API_KEY") return "missing-key";
  if (status === 401) return "invalid-key";
  if (!error.response || status === 502 || status === 503 || status === 504) return "network";
  return "unknown";
}

export const weatherService = {
  /** Prakiraan 5 hari / 3 jam untuk Jakarta (kota ditetapkan di server). */
  async getForecast(signal?: AbortSignal): Promise<OwmForecastResponse> {
    try {
      const { data } = await httpClient.get<OwmForecastResponse>("/weather/forecast", { signal });
      if (!Array.isArray(data?.list) || !data.city) throw new ForecastError("unknown");
      return data;
    } catch (error) {
      if (error instanceof ForecastError || axios.isCancel(error)) throw error;
      throw new ForecastError(classify(error), { cause: error });
    }
  },
};
