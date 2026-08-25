/**
 * Every conversion in the app lives here.
 *
 * The API is always queried in metric, so these run at render time and the unit
 * toggles never trigger a refetch.
 *
 * Note on wind: OpenWeatherMap returns metres per second under `units=metric`,
 * NOT km/h. The previous version of this app printed the raw m/s value with a
 * "km/h" label, understating every wind reading by a factor of 3.6.
 */

export const M_S_TO_KM_H = 3.6;
export const M_S_TO_MPH = 2.236936;

export const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

/** Rounded temperature in the active unit. Returns a number, not a string. */
export function temp(celsius, unit = 'c') {
  if (celsius === null || celsius === undefined) return null;
  return Math.round(unit === 'f' ? toFahrenheit(celsius) : celsius);
}

export function formatTemp(celsius, unit = 'c') {
  const value = temp(celsius, unit);
  return value === null ? '—' : `${value}°`;
}

export const tempUnitLabel = (unit) => (unit === 'f' ? '°F' : '°C');

/** Wind speed from the API's m/s into the active unit. */
export function windSpeed(metresPerSecond, unit = 'kmh') {
  if (metresPerSecond === null || metresPerSecond === undefined) return null;
  const factor = unit === 'mph' ? M_S_TO_MPH : M_S_TO_KM_H;
  return Math.round(metresPerSecond * factor);
}

export const windUnitLabel = (unit) => (unit === 'mph' ? 'mph' : 'km/h');

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

/** Meteorological degrees to a 16-point compass label. */
export function windDirection(degrees) {
  if (degrees === null || degrees === undefined) return null;
  return COMPASS[Math.round(degrees / 22.5) % 16];
}

/** Visibility comes in metres, capped at 10 km by the API. */
export function formatVisibility(metres, unit = 'kmh') {
  if (metres === null || metres === undefined) return '—';
  if (unit === 'mph') return `${(metres / 1609.344).toFixed(1)} mi`;
  return metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${metres} m`;
}

export function formatPressure(hPa, unit = 'kmh') {
  if (hPa === null || hPa === undefined) return '—';
  if (unit === 'mph') return `${(hPa * 0.02953).toFixed(2)} inHg`;
  return `${Math.round(hPa)} hPa`;
}

export const formatPercent = (fraction01) =>
  fraction01 === null || fraction01 === undefined ? '—' : `${Math.round(fraction01 * 100)}%`;

/**
 * Beaufort-ish descriptor for a wind speed in m/s, used as a plain-language
 * subtitle under the raw number.
 */
export function windDescriptor(metresPerSecond) {
  if (metresPerSecond === null || metresPerSecond === undefined) return null;
  if (metresPerSecond < 1.6) return 'calm';
  if (metresPerSecond < 3.4) return 'lightBreeze';
  if (metresPerSecond < 8) return 'moderateBreeze';
  if (metresPerSecond < 13.9) return 'strongBreeze';
  if (metresPerSecond < 20.8) return 'gale';
  return 'storm';
}
