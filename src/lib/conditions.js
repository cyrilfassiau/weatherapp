/**
 * Maps an OpenWeatherMap condition id to the artwork and the page background.
 *
 * Id ranges: 2xx thunderstorm, 3xx drizzle, 5xx rain, 6xx snow,
 * 7xx atmosphere (mist/fog/haze/dust), 800 clear, 80x clouds.
 * https://openweathermap.org/weather-conditions
 */

/**
 * The icon set inherited from the original app has no thunderstorm artwork,
 * so 2xx borrows rain.png. Drop a thunder.png into public/icons and add it
 * here to give storms their own image.
 */
function iconFile(id) {
  if (id >= 200 && id < 300) return 'rain.png';
  if (id >= 300 && id < 400) return 'drizzle.png';
  if (id >= 500 && id < 600) return 'rain.png';
  if (id >= 600 && id < 700) return 'snow.png';
  if (id >= 700 && id < 800) return 'mist.png';
  if (id === 800) return 'clear.png';
  if (id > 800) return 'clouds.png';
  return 'clear.png';
}

export const iconUrl = (id) => `${import.meta.env.BASE_URL}icons/${iconFile(id)}`;

/** Coarse family, used for background and accent selection. */
export function family(id) {
  if (id >= 200 && id < 300) return 'thunder';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'mist';
  if (id === 800) return 'clear';
  if (id === 801 || id === 802) return 'partly';
  return 'clouds';
}

/**
 * Background gradients, one pair per family. Day and night differ so the same
 * condition reads correctly at 3pm and 3am.
 */
/*
 * Two variants per family, and the variant *is* the theme: day palettes are
 * light and pair with dark text, night palettes are deep and pair with light
 * text. That keeps the light/dark toggle meaningful — picking "light" always
 * yields a light page — while the condition still decides the hue.
 *
 * Every stop clears WCAG AA (4.5:1) against the text colour its variant
 * implies, checked in both directions.
 */
const SKIES = {
  clear: {
    day: ['#4aa3f0', '#8fd0f5', '#d9f0fb'],
    night: ['#0b1533', '#152452', '#243b74'],
  },
  partly: {
    day: ['#5a9fd8', '#93c4e6', '#dbe9f4'],
    night: ['#101a37', '#1c2b55', '#2c4272'],
  },
  clouds: {
    day: ['#7c8fa4', '#9aabbe', '#cfd9e3'],
    night: ['#12182a', '#1e2740', '#333f5c'],
  },
  rain: {
    day: ['#708595', '#8a9db0', '#bcc9d6'],
    night: ['#0c1526', '#16233b', '#253853'],
  },
  drizzle: {
    day: ['#75899d', '#93a6b8', '#c3cfda'],
    night: ['#0e1728', '#18263e', '#283b57'],
  },
  thunder: {
    day: ['#808699', '#969cae', '#b4b9c8'],
    night: ['#080b1a', '#141a33', '#232a4d'],
  },
  snow: {
    day: ['#7f95ad', '#adc1d4', '#e6eef5'],
    night: ['#101827', '#1d2a40', '#31425c'],
  },
  mist: {
    day: ['#7d8a97', '#a5b1bc', '#d7dee4'],
    night: ['#111722', '#1d2532', '#303a49'],
  },
};

/** CSS gradient for the page background, given a condition and time of day. */
export function skyGradient(id, isDay) {
  const sky = SKIES[family(id)] ?? SKIES.clear;
  const [a, b, c] = isDay ? sky.day : sky.night;
  return `linear-gradient(160deg, ${a} 0%, ${b} 45%, ${c} 100%)`;
}

/**
 * Which sky variant to paint, and therefore which theme the page wears.
 * An explicit light/dark choice wins; on 'system' the city's own day/night
 * decides, so a night in Tokyo renders as night even at noon here.
 */
export function resolveNight(theme, isDay, prefersDark) {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return isDay === null || isDay === undefined ? prefersDark : !isDay;
}
