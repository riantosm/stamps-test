import axios from "axios";

/**
 * Semua request ke `/api/*` di origin yang sama. Endpoint itu dilayani server dev/preview
 * (`server/weather-api.ts`) yang menambahkan API key, jadi browser tidak pernah memegang key.
 */
export const httpClient = axios.create({
  baseURL: "/api",
  timeout: 15_000,
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
