import { useEffect, useMemo, useState } from 'react';
import { SettingsContext } from './settingsContext.js';
import { useLocalStorage } from './useLocalStorage.js';
import { translator } from '../lib/i18n.js';

const DEFAULTS = {
  tempUnit: 'c', 
  windUnit: 'kmh', 
  theme: 'system', 
  lang: 'en', 
};

export function SettingsProvider({ children }) {
  
  const [settings, setSettings] = useLocalStorage('skycast:settings', DEFAULTS);

  const merged = useMemo(() => ({ ...DEFAULTS, ...settings }), [settings]);

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
