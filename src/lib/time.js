/**
 * All timestamps render in the *searched city's* local time, never the
 * browser's. Searching Tokyo from Brussels should show Tokyo's night.
 *
 * The trick: OpenWeatherMap gives a UTC unix timestamp plus a `timezone`
 * offset in seconds. Shifting the timestamp by that offset and then reading it
 * with `timeZone: 'UTC'` yields the city's wall clock without needing an IANA
 * zone name, which the free API never returns.
 */

const shifted = (unixSeconds, offsetSeconds) => new Date((unixSeconds + offsetSeconds) * 1000);

const asUTC = (options) => ({ ...options, timeZone: 'UTC' });

/** Current time in the city, as a unix timestamp in seconds. */
export const nowInCity = () => Math.floor(Date.now() / 1000);

export function formatHour(unixSeconds, offsetSeconds, locale = 'en', hour12 = false) {
  return new Intl.DateTimeFormat(locale, asUTC({ hour: 'numeric', minute: '2-digit', hour12 }))
    .format(shifted(unixSeconds, offsetSeconds));
}

export function formatShortHour(unixSeconds, offsetSeconds, locale = 'en', hour12 = false) {
  return new Intl.DateTimeFormat(locale, asUTC(hour12 ? { hour: 'numeric', hour12: true } : { hour: '2-digit', hour12: false }))
    .format(shifted(unixSeconds, offsetSeconds));
}

export function formatWeekday(unixSeconds, offsetSeconds, locale = 'en') {
  return new Intl.DateTimeFormat(locale, asUTC({ weekday: 'short' }))
    .format(shifted(unixSeconds, offsetSeconds));
}

export function formatFullDate(unixSeconds, offsetSeconds, locale = 'en') {
  return new Intl.DateTimeFormat(locale, asUTC({ weekday: 'long', day: 'numeric', month: 'long' }))
    .format(shifted(unixSeconds, offsetSeconds));
}

/** Stable YYYY-MM-DD key in city-local time, used to bucket forecast entries by day. */
export function cityDateKey(unixSeconds, offsetSeconds) {
  return shifted(unixSeconds, offsetSeconds).toISOString().slice(0, 10);
}

/** City-local hour 0–23, used to pick each day's midday representative reading. */
export function cityHour(unixSeconds, offsetSeconds) {
  return shifted(unixSeconds, offsetSeconds).getUTCHours();
}

/** Is it daytime in the city right now (or at `at`)? Drives icon and background choice. */
export function isDaytime(at, sunrise, sunset) {
  if (!sunrise || !sunset) return true;
  // Compare against time-of-day so forecast entries days ahead still resolve
  // correctly against today's sunrise/sunset.
  const DAY = 86400;
  const t = ((at % DAY) + DAY) % DAY;
  const up = ((sunrise % DAY) + DAY) % DAY;
  const down = ((sunset % DAY) + DAY) % DAY;
  return up < down ? t >= up && t < down : t >= up || t < down;
}

/** "7h 42m" style duration from a span in seconds. */
export function formatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds / 60));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

/** The city's UTC offset as "UTC+2" / "UTC−5:30". */
export function formatOffset(offsetSeconds) {
  const sign = offsetSeconds < 0 ? '−' : '+';
  const abs = Math.abs(offsetSeconds);
  const hours = Math.floor(abs / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
}
