# CLAUDE.md

Cuaca Jakarta (`2-react`): React 19 + Vite + TypeScript + Tailwind CSS v4 + Redux Toolkit.
UI untuk soal no 2 tes Stamps: prakiraan Jakarta 5 hari, satu suhu rata-rata per hari.

## Commands

- `yarn dev`: server dev (port 5173, `strictPort`)
- `yarn build`: `tsc -b && vite build`
- `yarn preview`: jalankan hasil build
- `yarn test` / `yarn test:watch`: Vitest (jsdom)
- `yarn lint`: ESLint
- `yarn format` / `yarn format:check`: Prettier

## Batasan

Kecuali user menyuruhnya secara eksplisit di chat (izin per perintah, bukan izin umum):

- ❌ Menjalankan dev server / preview: `yarn dev`, `yarn preview`, `vite`.
- ❌ Deploy: `netlify deploy`, push ke hosting apa pun.
- ❌ `git commit` / `git push`.

Boleh tanpa izin: membuat/mengedit file, `yarn add` / `yarn install`, `yarn tsc`, `yarn lint`,
`yarn build`, `yarn test`, `yarn format`.

## Arsitektur

- `server/weather-api.ts`: plugin Vite yang melayani `GET /api/weather/forecast` di dev dan
  preview. Menambahkan `appid` dari `OPENWEATHER_API_KEY` (`.env`, **tanpa** prefix `VITE_`),
  kota tetap `Jakarta,ID`, `units=metric`, `lang=id`. Tanpa key → 500 `{ code: "MISSING_API_KEY" }`.
  Browser tidak pernah memegang key; jangan pindahkan key ke `VITE_*`.
- `src/services/weather.service.ts`: `weatherService.getForecast()` + `ForecastError`
  (`missing-key` | `invalid-key` | `network` | `unknown`).
- `src/utils/forecast.ts`: fungsi murni. Kelompokkan per tanggal lokal (`dt + city.timezone`),
  buang hari ini, ambil 5 hari, suhu = rata-rata, kondisi = deskripsi paling sering, angin =
  rata-rata vektor. Hari dengan < 8 pembacaan ditandai `isPartial`.
- `src/hooks/use-forecast.ts`: state lokal halaman (tanpa slice). Refresh gagal dengan data lama
  → data tetap tampil + `error` (banner), bukan layar error.
- `src/app/pages/HomePage`: satu-satunya halaman; komponen fitur di `src/layouts/forecast/`.
- Redux hanya `uiSlice` (konvensi), whitelist persist kosong.
- `TypeScript` dipin ke 6.0.x karena typescript-eslint belum mendukung TS 7.0.

## Konvensi

- Komponen: atomic design, `Folder/index.tsx`, named export, varian `Record<Union, string>` + `cn()`.
- Warna hanya dari token di `src/css/index.css` (satu tema langit, tanpa `.dark`/ThemeToggle);
  tanpa hex inline. Panel kaca: utility `glass`; latar: `bg-sky`.
- Ikon `lucide-react`, selalu `aria-hidden` dan disertai teks. Import internal pakai `@/`.
- Teks UI bahasa Indonesia; angka `id-ID` (`27,8°`, jam `07.55`).
- Animasi `motion` lewat `m.*` di dalam `LazyMotion` + `MotionConfig reducedMotion="user"`;
  preset di `utils/motion.ts` (`fadeUp`, `growX`, `staggerContainer`, `revealOnScroll`).
  Style yang diikat ke motion value (parallax `useScroll` / pointer) tidak ikut dimatikan
  `MotionConfig`: cek `useReducedMotion()` dan jangan pasang style-nya. Animasi CSS
  (`animate-drift`, `animate-float`, `animate-rain`, …) selalu pakai prefix `motion-safe:`.
- Kartu yang bereaksi ke mouse: `GlassPanel interactive` (utility `glass-interactive`,
  sorotan lewat CSS var `--mx`/`--my`, tanpa state React).
- Test di `__tests__/` sebelah kodenya; fixture OpenWeatherMap di `src/test/forecast-fixture.ts`.

## Workflow desain

Skill desain terpasang global. Pakai sesuai tahap, jangan sekaligus:

- Arah visual: ui-ux-pro-max. Sumber kebenaran desain: `design-system/cuaca-jakarta/MASTER.md`;
  override halaman ini di `design-system/cuaca-jakarta/pages/home.md` (menang atas MASTER:
  tema langit gelap, bukan palet terang MASTER). Baca keduanya sebelum membuat layar baru.
  Jangan regenerate dengan `--force` tanpa izin user.
  Script: `python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py`.
- Sebelum membuat komponen kompleks: `vibe-coding-advisor` (opsional).
- Semua teks UI (tombol, error, empty state, konfirmasi): `ux-copy`, bahasa Indonesia, nada ramah dan singkat.
- Sebelum rilis: `review-ux-ui` (target user: reviewer tes + pengguna umum, WCAG AA), lalu
  `uxui-evaluator` / `interface-auditor` kalau perlu audit tambahan.
- Warna tetap lewat token semantik; design system tidak boleh memasukkan hex inline ke komponen.
