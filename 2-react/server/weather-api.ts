import type { Connect, Plugin } from "vite";

const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const CITY = "Jakarta,ID";
export const WEATHER_API_PATH = "/api/weather/forecast";

function sendJson(res: Parameters<Connect.NextHandleFunction>[1], status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

/**
 * Satu endpoint server-side untuk prakiraan Jakarta. API key OpenWeatherMap dibaca dari
 * environment server (OPENWEATHER_API_KEY) dan ditambahkan di sini, jadi key tidak pernah
 * masuk ke bundle browser. Kota sudah ditetapkan supaya endpoint ini bukan proxy terbuka.
 *
 * Aktif di `yarn dev` dan `yarn preview`. Hosting statis (Netlify, dsb.) butuh serverless
 * function dengan logika yang sama.
 */
export function weatherApi(apiKey: string | undefined): Plugin {
  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    const pathname = req.url?.split("?")[0];
    if (pathname !== WEATHER_API_PATH) return next();

    if (req.method !== "GET") {
      sendJson(res, 405, { code: "METHOD_NOT_ALLOWED", message: "Gunakan GET." });
      return;
    }
    if (!apiKey) {
      sendJson(res, 500, {
        code: "MISSING_API_KEY",
        message: "OPENWEATHER_API_KEY belum diatur di file .env.",
      });
      return;
    }

    const url = new URL(FORECAST_URL);
    url.searchParams.set("q", CITY);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "id");
    url.searchParams.set("appid", apiKey);

    try {
      const upstream = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      const body = await upstream.text();
      res.statusCode = upstream.status;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      res.end(body);
    } catch {
      sendJson(res, 502, {
        code: "UPSTREAM_UNREACHABLE",
        message: "Server OpenWeatherMap tidak bisa dihubungi.",
      });
    }
  };

  return {
    name: "weather-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
