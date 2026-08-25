import { useCallback, useEffect, useMemo } from 'react';
import { CurrentWeather } from './components/CurrentWeather.jsx';
import { DailyForecast } from './components/DailyForecast.jsx';
import { DetailGrid } from './components/DetailGrid.jsx';
import { HourlyStrip } from './components/HourlyStrip.jsx';
import { SavedCities } from './components/SavedCities.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { SettingsBar } from './components/SettingsBar.jsx';
import { SunArc } from './components/SunArc.jsx';
import { TrendChart } from './components/TrendChart.jsx';
import { EmptyState, ErrorState, WeatherSkeleton } from './components/States.jsx';
import { useGeolocation } from './hooks/useGeolocation.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useSettings } from './hooks/settingsContext.js';
import { useWeather } from './hooks/useWeather.js';
import { resolveNight, skyGradient } from './lib/conditions.js';
import { upcomingSlots } from './lib/normalize.js';
import { formatHour } from './lib/time.js';

export default function App() {
  const { lang, theme, prefersDark, t } = useSettings();

  // The last viewed city and the saved list both survive a reload.
  const [place, setPlace] = useLocalStorage('skycast:place', null);
  const [savedCities, setSavedCities] = useLocalStorage('skycast:saved', []);

  const { data, loading, error, retry, refreshedAt } = useWeather(place, lang);
  const { locate, locating, error: geoError, clearError } = useGeolocation(setPlace);

  const select = useCallback(
    (next) => {
      clearError();
      setPlace(next);
    },
    [clearError, setPlace],
  );

  const isSaved = place ? savedCities.some((city) => city.id === place.id) : false;

  const toggleSave = () => {
    if (!place) return;
    setSavedCities((cities) =>
      cities.some((city) => city.id === place.id)
        ? cities.filter((city) => city.id !== place.id)
        : [...cities, place],
    );
  };

  const removeCity = (id) => setSavedCities((cities) => cities.filter((city) => city.id !== id));

  const current = data?.current;
  const forecast = data?.forecast;

  // One decision drives both the sky variant and the UI theme, so a "light"
  // page never ends up wearing dark cards.
  const night = resolveNight(theme, current?.isDay ?? null, prefersDark);
  const background = current ? skyGradient(current.conditionId, !night) : undefined;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', night);
  }, [night]);

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', night ? '#0b1533' : '#8fd0f5');
  }, [night]);

  const hourly = useMemo(() => (forecast ? upcomingSlots(forecast.slots, 8) : []), [forecast]);
  // 16 three-hour buckets = the next 48 hours.
  const trend = useMemo(() => (forecast ? upcomingSlots(forecast.slots, 16) : []), [forecast]);
  const today = forecast?.days?.[0] ?? null;

  return (
    <div
      className={`min-h-dvh w-full transition-[background] duration-700 ${current ? '' : 'sky-default'}`}
      style={background ? { background } : undefined}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-3">
          {/* Stacked on narrow screens: three segmented controls and a
              wordmark do not share a 375px row without wrapping badly. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[0.95rem] font-semibold tracking-tight">{t('appName')}</span>
            <SettingsBar />
          </div>

          <SearchBar onSelect={select} onLocate={locate} locating={locating} />

          <SavedCities
            cities={savedCities}
            activeId={place?.id}
            onSelect={select}
            onRemove={removeCity}
          />

          {geoError && (
            <p role="alert" className="text-[0.85rem] text-amber-700 dark:text-amber-300">
              {t(geoError)}
            </p>
          )}
        </header>

        <main className="flex flex-col gap-4">
          {!place && !loading && <EmptyState />}

          {error && <ErrorState kind={error.kind} onRetry={retry} />}

          {/* Only show the skeleton on a cold load — a cached city switch keeps
              the previous data on screen instead of flashing placeholders. */}
          {loading && !data && !error && <WeatherSkeleton />}

          {data && !error && (
            <>
              <CurrentWeather
                place={place}
                current={current}
                day={today}
                saved={isSaved}
                onToggleSave={toggleSave}
              />

              <DetailGrid current={current} slot={hourly[0]} />

              <HourlyStrip slots={hourly} timezone={forecast.timezone} />

              <TrendChart slots={trend} timezone={forecast.timezone} />

              <SunArc current={current} />

              <DailyForecast days={forecast.days} timezone={forecast.timezone} />
            </>
          )}
        </main>

        {/* On a surface rather than bare: the gradient is at its lightest by
            the bottom of the page, where faint text would wash out. */}
        <footer className="surface mt-2 flex flex-wrap items-center justify-between gap-2 rounded-full px-4 py-2 text-[0.75rem] text-secondary">
          <span>{t('dataFrom')}</span>
          {refreshedAt && current && (
            <span>{t('updated', { value: formatHour(current.dt, current.timezone, lang) })}</span>
          )}
        </footer>
      </div>
    </div>
  );
}
