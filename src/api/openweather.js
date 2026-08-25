import { owmFetch } from './client.js';

/**
 * Weather is always requested in metric and converted at render time, so
 * flipping °C/°F or km/h/mph never costs a network call.
 */
const METRIC = { units: 'metric' };

export function getCurrent({ lat, lon, lang = 'en' }, options) {
  return owmFetch('/data/2.5/weather', { lat, lon, lang, ...METRIC }, options);
}

export function getForecast({ lat, lon, lang = 'en' }, options) {
  return owmFetch('/data/2.5/forecast', { lat, lon, lang, ...METRIC }, options);
}

/** Autocomplete. Replaces the Mapbox geocoder the old app used. */
export function geocode(query, options) {
  return owmFetch('/geo/1.0/direct', { q: query, limit: 5 }, options);
}

/** Turns browser geolocation coordinates into a city name. */
export function reverseGeocode({ lat, lon }, options) {
  return owmFetch('/geo/1.0/reverse', { lat, lon, limit: 1 }, options);
}
