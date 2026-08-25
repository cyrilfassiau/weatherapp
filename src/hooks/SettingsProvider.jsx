import { useEffect, useMemo, useState } from 'react';
import { SettingsContext } from './settingsContext.js';
import { useLocalStorage } from './useLocalStorage.js';
import { translator } from '../lib/i18n.js';

const DEFAULTS = {
  tempUnit: 'c', // 'c' | 'f'
  windUnit: 'kmh', // 'kmh' | 'mph'
  theme: 'system', // 'system' | 'light' | 'dark'
  lang: 'en', // 'en' | 'fr'
};

export function SettingsProvider({ children }) {
  // Key matches the pre-paint theme script in index.html.
  const [settings, setSettings] = useLocalStorage('skycast:settings', DEFAULTS);

  const merged = useMemo(() => ({ ...DEFAULTS, ...settings }), [settings]);

  // Track the OS preference; App combines it with the city's day/night to
  // decide the actual theme, so the sky and the UI never disagree.
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (event) => setPrefersDark(event.matches);
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    document.documentElement.lang = merged.lang;
  }, [merged.lang]);

  const value = useMemo(() => {
    const update = (patch) => setSettings((prev) => ({ ...DEFAULTS, ...prev, ...patch }));
    return {
      ...merged,
      prefersDark,
      set: update,
      // Flipping temperature flips wind and pressure with it — °F alongside km/h
      // is a combination no one actually wants.
      toggleUnits: () =>
        update(
          merged.tempUnit === 'c'
            ? { tempUnit: 'f', windUnit: 'mph' }
            : { tempUnit: 'c', windUnit: 'kmh' },
        ),
      t: translator(merged.lang),
    };
  }, [merged, prefersDark, setSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
