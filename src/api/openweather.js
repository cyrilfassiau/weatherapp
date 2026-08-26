import { owmFetch } from './client.js';


const METRIC = { units: 'metric' };

export function getCurrent({ lat, lon, lang = 'en' }, options) {
  return owmFetch('/data/2.5/weather', { lat, lon, lang, ...METRIC }, options);
}

export function getForecast({ lat, lon, lang = 'en' }, options) {
  return owmFetch('/data/2.5/forecast', { lat, lon, lang, ...METRIC }, options);
}


export function geocode(query, options) {
  return owmFetch('/geo/1.0/direct', { q: query, limit: 5 }, options);
}

export function reverseGeocode({ lat, lon }, options) {
  return owmFetch('/geo/1.0/reverse', { lat, lon, limit: 1 }, options);
}
