import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { HomePage } from "@/app/pages/HomePage";
import { ForecastError, weatherService } from "@/services/weather.service";
import { fullForecast, jakartaUnix } from "@/test/forecast-fixture";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(jakartaUnix("2026-11-21T07:55") * 1000);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("HomePage", () => {
  it("menampilkan status memuat lalu 5 hari prakiraan", async () => {
    vi.spyOn(weatherService, "getForecast").mockResolvedValue(fullForecast());
    render(<HomePage />);

    expect(screen.getByText("Memuat prakiraan cuaca Jakarta…")).toBeInTheDocument();

    const list = await screen.findByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    expect(within(list).getByText(/Minggu/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Jakarta" })).toBeInTheDocument();
    expect(screen.getByText("Diperbarui 07.55 WIB")).toBeInTheDocument();
  });

  it("menampilkan langkah setup kalau API key belum diatur", async () => {
    vi.spyOn(weatherService, "getForecast").mockRejectedValue(new ForecastError("missing-key"));
    render(<HomePage />);

    expect(
      await screen.findByRole("heading", { name: "API key belum diatur" }),
    ).toBeInTheDocument();
    expect(screen.getByText("OPENWEATHER_API_KEY")).toBeInTheDocument();
  });

  it("menampilkan error dan bisa mencoba lagi", async () => {
    const getForecast = vi
      .spyOn(weatherService, "getForecast")
      .mockRejectedValueOnce(new ForecastError("network"))
      .mockResolvedValueOnce(fullForecast());
    render(<HomePage />);

    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText("Prakiraan belum bisa dimuat")).toBeInTheDocument();

    fireEvent.click(within(alert).getByRole("button", { name: /Coba lagi/ }));
    expect(await screen.findByRole("list")).toBeInTheDocument();
    expect(getForecast).toHaveBeenCalledTimes(2);
  });

  it("refresh gagal tetap menampilkan data lama dengan banner", async () => {
    vi.spyOn(weatherService, "getForecast")
      .mockResolvedValueOnce(fullForecast())
      .mockRejectedValueOnce(new ForecastError("network"));
    render(<HomePage />);

    await screen.findByRole("list");
    fireEvent.click(screen.getByRole("button", { name: "Perbarui prakiraan" }));

    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText("Gagal memperbarui.")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
