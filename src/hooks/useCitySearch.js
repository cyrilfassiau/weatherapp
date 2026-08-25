import { useEffect, useState } from 'react';
import { geocode } from '../api/openweather.js';
import { ErrorKind, isAbort } from '../api/client.js';
import { normalizePlace } from '../lib/normalize.js';
import { useDebouncedValue } from './useDebouncedValue.js';

/**
 * City autocomplete against OpenWeatherMap's geocoder.
 *
 * Debounced, and every superseded request is aborted, so typing "brussels"
 * costs one call rather than eight.
 */
export function useCitySearch(query) {
  const debounced = useDebouncedValue(query.trim(), 300);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  // Surfaced so a rejected key reads as a key problem rather than as
  // "no cities match", which sends you chasing the wrong bug.
  const [error, setError] = useState(null);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setSearching(false);
      setError(null);
      return undefined;
    }

    const controller = new AbortController();
    setSearching(true);
    setError(null);

    geocode(debounced, { signal: controller.signal })
      .then((matches) => {
        if (controller.signal.aborted) return;
        // The geocoder can return the same city twice with different casing.
        const seen = new Set();
        const unique = matches.map(normalizePlace).filter((place) => {
          if (seen.has(place.id)) return false;
          seen.add(place.id);
          return true;
        });
        setResults(unique);
        setSearching(false);
      })
      .catch((err) => {
        if (isAbort(err) || controller.signal.aborted) return;
        setResults([]);
        setError(err.kind ?? ErrorKind.UNKNOWN);
        setSearching(false);
      });

    return () => controller.abort();
  }, [debounced]);

  return { results, searching, error, hasQuery: debounced.length >= 2 };
}
