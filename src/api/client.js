const API_KEY = import.meta.env.VITE_OWM_API_KEY;

/**
 * Error kinds the UI knows how to render distinctly. Anything unexpected
 * collapses to 'unknown' so the error state never renders a raw stack trace.
 */
export const ErrorKind = {
  MISSING_KEY: 'missing-key',
  BAD_KEY: 'bad-key',
  NOT_FOUND: 'not-found',
  RATE_LIMIT: 'rate-limit',
  OFFLINE: 'offline',
  UNKNOWN: 'unknown',
};

export class WeatherError extends Error {
  constructor(kind, message) {
    super(message);
    this.name = 'WeatherError';
    this.kind = kind;
  }
}

/** True for the AbortError thrown when a superseded request is cancelled. */
export const isAbort = (err) => err?.name === 'AbortError';

/**
 * Fetch an OpenWeatherMap endpoint with the key injected and errors normalized.
 * `signal` lets callers cancel superseded requests (every keystroke, in practice).
 */
export async function owmFetch(path, params = {}, { signal } = {}) {
  if (!API_KEY) {
    throw new WeatherError(
      ErrorKind.MISSING_KEY,
      'No API key found. Copy .env.example to .env and add your OpenWeatherMap key.',
    );
  }

  const url = new URL(`https://api.openweathermap.org${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  }
  url.searchParams.set('appid', API_KEY);

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (isAbort(err)) throw err;
    throw new WeatherError(ErrorKind.OFFLINE, 'Could not reach OpenWeatherMap. Check your connection.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new WeatherError(ErrorKind.BAD_KEY, 'That API key was rejected. New keys can take a couple of hours to activate.');
    }
    if (response.status === 404) {
      throw new WeatherError(ErrorKind.NOT_FOUND, 'No weather data for that location.');
    }
    if (response.status === 429) {
      throw new WeatherError(ErrorKind.RATE_LIMIT, 'Too many requests. The free tier allows 60 calls per minute.');
    }
    throw new WeatherError(ErrorKind.UNKNOWN, `OpenWeatherMap returned ${response.status}.`);
  }

  return response.json();
}
