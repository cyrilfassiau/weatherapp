import { useCallback, useState } from 'react';
import { reverseGeocode } from '../api/openweather.js';
import { normalizePlace } from '../lib/normalize.js';


export function useGeolocation(onResolved) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('geoUnavailable');
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const [match] = await reverseGeocode({ lat: coords.latitude, lon: coords.longitude });
          onResolved(
            match
              ? normalizePlace(match)
              // Reverse geocoding can come back empty over open water or
              // sparsely mapped areas; the coordinates still fetch weather.
              : {
                  id: `${coords.latitude.toFixed(3)},${coords.longitude.toFixed(3)}`,
                  name: 'My location',
                  state: null,
                  country: null,
                  lat: coords.latitude,
                  lon: coords.longitude,
                },
          );
        } catch {
          setError('geoUnavailable');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setError(err.code === err.PERMISSION_DENIED ? 'geoDenied' : 'geoUnavailable');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }, [onResolved]);

  return { locate, locating, error, clearError: () => setError(null) };
}
