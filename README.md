# Skycast

A weather app built with React and Vite, powered by the OpenWeatherMap free tier.

Search any city, or use your location, and get current conditions, a 48-hour trend,
a 5-day forecast, and a set of saved cities that persist between visits.

## Features

**Weather**
- Current conditions: temperature, feels-like, humidity, dew point, wind (speed,
  gusts and compass direction), pressure, visibility and cloud cover
- Next 24 hours at the 3-hour resolution the free forecast provides
- 48-hour temperature trend with precipitation probability, drawn as inline SVG
- 5-day forecast; each day expands to show its hourly detail
- Sunrise/sunset arc with day length and time until the next event

**Places**
- City autocomplete via OpenWeatherMap's geocoder, keyboard navigable
- Save cities and switch between them instantly
- "Use my location" via browser geolocation and reverse geocoding
- Last viewed city and saved list restored on reload

**Interface**
- Backgrounds that follow the weather condition and the time of day
- Light/dark theme; on *System* it follows the city's own day and night
- °C/km/h or °F/mph, converted at render time so toggling never refetches
- English and French, including the weather descriptions themselves
- Skeleton loading states, distinct error states, installable as a PWA

## Timezones

Every timestamp renders in the **searched city's** local time, not your own.
Search Tokyo from Brussels and you get Tokyo's clock, Tokyo's sunrise, and a
night sky if it is night there.

## Getting started

```bash
npm install
```

Copy the example environment file and add your key from
[openweathermap.org/api_keys](https://home.openweathermap.org/api_keys):

```bash
cp .env.example .env
```

```bash
npm run dev
```

A new OpenWeatherMap key can take a couple of hours to activate. Until it does,
the app will tell you the key was rejected rather than pretending no cities matched.

## About the API key

This is a client-side app, so the key is visible in the browser's network tab —
that is inherent to calling the API directly from the page, not a flaw in the
setup here. `.env` is gitignored so the key stays out of the repository.

If you ever need the key genuinely hidden, it has to move to a server: a Netlify
or Vercel function that holds the key and proxies requests, with the page calling
that function instead.

## Which endpoints this uses

All on the **free tier**:

| Endpoint | Used for |
| --- | --- |
| `/data/2.5/weather` | Current conditions |
| `/data/2.5/forecast` | 5 day / 3 hour forecast, aggregated into days |
| `/geo/1.0/direct` | City autocomplete |
| `/geo/1.0/reverse` | Turning geolocation coordinates into a city name |

Hour-by-hour forecasts, UV index and government weather alerts need the separate
One Call API 3.0 subscription and are deliberately not faked from 3-hour data.

The free tier allows 60 calls a minute. Responses are cached per city for ten
minutes and the geocoder is debounced, so normal use stays well inside that.

## Project layout

```
src/
├── api/          OpenWeatherMap client and endpoint wrappers
├── lib/          units, city-local time, condition mapping, normalising, i18n
├── hooks/        data fetching, geolocation, search, settings, storage
└── components/   UI
```

Weather data is always requested in metric and converted for display, so the
unit toggles are instant and cost nothing.

## Deploying

`npm run build` outputs to `dist/`.

Deploying to a GitHub Pages **project** site additionally needs
`base: '/weatherapp/'` in `vite.config.js`, or the built asset paths will 404.
Netlify, Vercel and any root-domain host need no change.

Remember to set `VITE_OWM_API_KEY` in your host's environment variables.
