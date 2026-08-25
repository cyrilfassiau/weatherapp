import { cityDateKey, cityHour, isDaytime } from './time.js';

/**
 * Raw OpenWeatherMap payloads are nested and inconsistent between endpoints.
 * Everything downstream of here consumes these flat shapes instead.
 */

export function normalizeCurrent(raw) {
  const weather = raw.weather?.[0] ?? {};
  return {
    dt: raw.dt,
    timezone: raw.timezone ?? 0,
    name: raw.name,
    country: raw.sys?.country ?? null,
    coord: { lat: raw.coord?.lat, lon: raw.coord?.lon },
    conditionId: weather.id ?? 800,
    description: weather.description ?? '',
    temp: raw.main?.temp,
    feelsLike: raw.main?.feels_like,
    tempMin: raw.main?.temp_min,
    tempMax: raw.main?.temp_max,
    pressure: raw.main?.pressure,
    humidity: raw.main?.humidity,
    visibility: raw.visibility,
    clouds: raw.clouds?.all,
    windSpeed: raw.wind?.speed,
    windDeg: raw.wind?.deg,
    windGust: raw.wind?.gust ?? null,
    sunrise: raw.sys?.sunrise ?? null,
    sunset: raw.sys?.sunset ?? null,
    isDay: isDaytime(raw.dt, raw.sys?.sunrise, raw.sys?.sunset),
  };
}

function normalizeSlot(entry, sunrise, sunset) {
  const weather = entry.weather?.[0] ?? {};
  return {
    dt: entry.dt,
    conditionId: weather.id ?? 800,
    description: weather.description ?? '',
    temp: entry.main?.temp,
    feelsLike: entry.main?.feels_like,
    humidity: entry.main?.humidity,
    dewPoint: entry.main?.dew_point ?? null,
    pressure: entry.main?.pressure,
    clouds: entry.clouds?.all,
    visibility: entry.visibility,
    windSpeed: entry.wind?.speed,
    windDeg: entry.wind?.deg,
    windGust: entry.wind?.gust ?? null,
    pop: entry.pop ?? 0,
    rain: entry.rain?.['3h'] ?? 0,
    snow: entry.snow?.['3h'] ?? 0,
    isDay: isDaytime(entry.dt, sunrise, sunset),
  };
}

/**
 * The free tier returns 40 entries at 3-hour resolution. We surface them as-is
 * for the hourly strip rather than interpolating, so the UI never implies
 * precision the data does not have.
 */
export function normalizeForecast(raw) {
  const timezone = raw.city?.timezone ?? 0;
  const sunrise = raw.city?.sunrise ?? null;
  const sunset = raw.city?.sunset ?? null;
  const slots = (raw.list ?? []).map((entry) => normalizeSlot(entry, sunrise, sunset));

  return {
    timezone,
    sunrise,
    sunset,
    city: {
      name: raw.city?.name,
      country: raw.city?.country ?? null,
      coord: raw.city?.coord ?? null,
    },
    slots,
    days: groupByDay(slots, timezone),
  };
}

/**
 * Bucket the 3-hour slots into city-local calendar days.
 *
 * The representative condition for a day is the slot nearest local noon, not
 * the first of the day — otherwise a clear morning would label a day of rain.
 * The first and last buckets are usually partial days, so `partial` is flagged
 * for the UI to label "today" honestly.
 */
export function groupByDay(slots, timezone) {
  const buckets = new Map();

  for (const slot of slots) {
    const key = cityDateKey(slot.dt, timezone);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(slot);
  }

  return [...buckets.entries()].map(([key, entries]) => {
    const temps = entries.map((e) => e.temp).filter((t) => t !== undefined);
    const midday = entries.reduce((best, entry) =>
      Math.abs(cityHour(entry.dt, timezone) - 12) < Math.abs(cityHour(best.dt, timezone) - 12) ? entry : best,
    );

    return {
      key,
      dt: entries[0].dt,
      slots: entries,
      // A full day has 8 three-hour slots; fewer means the window clipped it.
      partial: entries.length < 8,
      min: Math.min(...temps),
      max: Math.max(...temps),
      pop: Math.max(...entries.map((e) => e.pop ?? 0)),
      rain: entries.reduce((sum, e) => sum + (e.rain ?? 0), 0),
      snow: entries.reduce((sum, e) => sum + (e.snow ?? 0), 0),
      conditionId: midday.conditionId,
      description: midday.description,
      windSpeed: Math.max(...entries.map((e) => e.windSpeed ?? 0)),
    };
  });
}

/** The next N slots from now — 8 slots is the coming 24 hours. */
export function upcomingSlots(slots, count = 8) {
  const now = Math.floor(Date.now() / 1000);
  const future = slots.filter((slot) => slot.dt >= now - 3600);
  return (future.length ? future : slots).slice(0, count);
}

/** A stable identity for a place, used as cache key and saved-city id. */
export const placeId = (lat, lon) => `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;

/** Flattens a geocoding result into the place shape the app passes around. */
export function normalizePlace(raw) {
  return {
    id: placeId(raw.lat, raw.lon),
    name: raw.name,
    state: raw.state ?? null,
    country: raw.country ?? null,
    lat: raw.lat,
    lon: raw.lon,
  };
}

/** "Brussels, Brussels-Capital, BE" — omitting whichever parts are missing. */
export const placeLabel = (place) =>
  [place?.name, place?.state, place?.country].filter(Boolean).join(', ');
