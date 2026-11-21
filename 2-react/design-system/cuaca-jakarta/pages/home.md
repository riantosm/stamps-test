# Override halaman: Home (prakiraan 5 hari)

> Override ini **menang atas** `../MASTER.md` untuk halaman utama. Sumber: kanvas desain
> revisi "tidak terlalu polos" (gaya aplikasi cuaca dengan latar langit).

## Kenapa berbeda dari MASTER

MASTER menyarankan Minimalism/Swiss terang (latar `#F0F9FF`, primary `#0284C7`). User meminta
tampilan yang lebih hidup, bergaya aplikasi cuaca: latar langit, angka suhu besar, panel kaca.
Selain itu primary MASTER `#0284C7` dengan teks putih hanya 4.1:1 (gagal AA).

## Warna (token di `src/css/index.css`)

| Peran | Nilai | Catatan |
|---|---|---|
| Langit | `#0E3557` → `#1B5583` → `#2A6A9C` | gradasi vertikal, `bg-sky` |
| Panel kaca | `rgb(6 24 43 / 0.38)` + border `rgb(255 255 255 / 0.14)` + blur 14px | `glass` |
| Teks | putih / putih 90% / putih 78% | 78% hanya di dalam panel kaca (≥ 6.2:1) |
| Tombol utama | latar putih, teks `#0E3557` | 12.6:1 |
| Ikon | hujan `#7DD3FC`, awan `#E2E8F0`, petir `#C4B5FD`, cerah `#FCD34D` | dekoratif, selalu ada teks |
| Skala suhu | `#5EEAD4` → `#FCD34D` → `#FB923C` | batang posisi suhu |

Kontras terendah: putih 90% di atas `#2A6A9C` = 5.7:1. Putih 80% di atas `#2A6A9C` hanya 4.3:1;
jangan dipakai untuk teks di atas langit.

## Tipografi

Inter (MASTER). Suhu hero 96–120px weight 200; suhu harian 20–22px weight 600; label kartu 12px
uppercase tracking 0.1em.

## Tata letak

1. Bar atas: "Diperbarui HH.MM WIB" + tombol Perbarui (ikon saja di < 640px).
2. Hero tengah: "Prakiraan besok", "Jakarta", suhu rata-rata besok, kondisi, tanggal.
3. Baris: daftar 5 hari (flex 999 1 560px) + grid 2×2 metrik (flex 1 1 380px), membungkus di
   layar sempit.
4. Footer: sumber data.

## Aturan

- Tetap **satu suhu per hari** (syarat soal). Metrik lain bukan suhu.
- State memuat memakai kerangka yang sama dengan hasil akhir (tanpa lompatan layout).
- Refresh gagal dengan data lama: banner `role="alert"`, data tetap tampil.
- Animasi hanya fade-up berurutan; `prefers-reduced-motion` dihormati lewat `MotionConfig`.
