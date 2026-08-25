import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrent, getForecast } from '../api/openweather.js';
import { isAbort, ErrorKind } from '../api/client.js';
import { normalizeCurrent, normalizeForecast, placeId } from '../lib/normalize.js';

/**
 * The free tier allows 60 calls a minute. Responses are memoised per place and
 * language for ten minutes, which keeps switching between saved cities instant
 * and well clear of the limit — weather data does not change faster than that.
 */
const TTL_MS = 10 * 60 * 1000;
const cache = new Map();

const cacheKey = (place, lang) => `${placeId(place.lat, place.lon)}:${lang}`;

function readCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}

/**
 * Loads current conditions and the 5-day forecast for a place.
 *
 * Both endpoints are fetched in parallel; a cache hit resolves synchronously
 * on the first render so there is no skeleton flash when switching cities.
 */
export function useWeather(place, lang) {
  const [data, setData] = useState(() => (place ? readCache(cacheKey(place, lang)) : null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshedAt, setRefreshedAt] = useState(null);

  // Tracks the in-flight request so a fast city switch cancels the stale one.
  const controllerRef = useRef(null);
  const [reloadToken, setReloadToken] = useState(0);

  const retry = useCallback(() => {
    if (place) cache.delete(cacheKey(place, lang));
    setReloadToken((token) => token + 1);
  }, [place, lang]);

  useEffect(() => {
    if (!place) {
      setData(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    const key = cacheKey(place, lang);
    const cached = readCache(key);
    if (cached) {
      setData(cached);
      setError(null);
      setLoading(false);
      return undefined;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const options = { signal: controller.signal };
    const coords = { lat: place.lat, lon: place.lon, lang };

    setLoading(true);
    setError(null);

    Promise.all([getCurrent(coords, options), getForecast(coords, options)])
      .then(([rawCurrent, rawForecast]) => {
        if (controller.signal.aborted) return;
        const next = {
          place,
          current: normalizeCurrent(rawCurrent),
          forecast: normalizeForecast(rawForecast),
        };
        cache.set(key, { at: Date.now(), data: next });
        setData(next);
        setRefreshedAt(Date.now());
        setLoading(false);
      })
      .catch((err) => {
        // An aborted request was replaced by a newer one — not a failure.
        if (isAbort(err) || controller.signal.aborted) return;
        setError({ kind: err.kind ?? ErrorKind.UNKNOWN, message: err.message });
        setLoading(false);
      });

    return () => controller.abort();
  }, [place, lang, reloadToken]);

  return { data, loading, error, retry, refreshedAt };
}
