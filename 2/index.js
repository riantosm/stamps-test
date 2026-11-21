try {
  process.loadEnvFile();
} catch {
  // no .env file, fall back to the shell environment
}

const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = 'Jakarta,ID';
const DAYS = 5;

if (!API_KEY) {
  console.error('OPENWEATHER_API_KEY is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

async function getForecast() {
  const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
  url.searchParams.set('q', CITY);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('appid', API_KEY);

  const res = await fetch(url);
  const body = await res.json();

  if (!res.ok) {
    throw new Error(`OpenWeatherMap returned ${res.status}: ${body.message}`);
  }
  return body;
}

// The free API gives a reading every 3 hours, so group them by local date
// and use the average as that day's temperature.
function dailyAverages(data) {
  const offset = data.city.timezone;
  const days = new Map();

  for (const item of data.list) {
    const local = new Date((item.dt + offset) * 1000);
    const key = local.toISOString().slice(0, 10);

    if (!days.has(key)) days.set(key, []);
    days.get(key).push(item.main.temp);
  }

  const today = new Date((Date.now() / 1000 + offset) * 1000).toISOString().slice(0, 10);

  return [...days]
    .filter(([date]) => date > today)
    .slice(0, DAYS)
    .map(([date, temps]) => ({
      date,
      temp: temps.reduce((a, b) => a + b, 0) / temps.length,
    }));
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

async function main() {
  const data = await getForecast();

  console.log('Weather Forecast:');
  for (const { date, temp } of dailyAverages(data)) {
    console.log(`${formatDate(date)}: ${temp.toFixed(2)}°C`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
