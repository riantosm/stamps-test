/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { weatherApi } from "./server/weather-api.ts";

export default defineConfig(({ mode }) => {
  // Prefix "" = baca semua variabel, termasuk OPENWEATHER_API_KEY yang sengaja TIDAK diberi
  // prefix VITE_ supaya tidak pernah diekspos ke kode browser.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), weatherApi(env.OPENWEATHER_API_KEY)],
    resolve: {
      // import.meta.dirname, bukan __dirname: Vite 8 memperingatkan __dirname di config.
      alias: { "@": path.resolve(import.meta.dirname, "./src") },
    },
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 5173,
      strictPort: true,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});
