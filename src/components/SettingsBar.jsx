import { useSettings } from '../hooks/settingsContext.js';
import { LANGUAGES } from '../lib/i18n.js';
import { MonitorIcon, MoonIcon, SunIcon } from './Icons.jsx';


function Segmented({ label, value, options, onChange }) {
  return (
    <div role="radiogroup" aria-label={label} className="surface flex items-center gap-0.5 rounded-full p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={`grid h-8 min-w-8 place-items-center rounded-full px-2.5 text-[0.78rem] font-semibold transition ${
              selected ? 'bg-black/12 dark:bg-white/18' : 'text-secondary hover:text-[var(--text-primary)]'
            }`}
          >
            {option.node ?? option.short}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsBar() {
  const { tempUnit, theme, lang, set, toggleUnits, t } = useSettings();

  return (
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
      <Segmented
        label={t('units')}
        value={tempUnit}
        onChange={toggleUnits}
        options={[
          { value: 'c', short: '°C', label: 'Celsius, km/h' },
          { value: 'f', short: '°F', label: 'Fahrenheit, mph' },
        ]}
      />

      <Segmented
        label={t('theme')}
        value={theme}
        onChange={(value) => set({ theme: value })}
        options={[
          { value: 'light', label: t('light'), node: <SunIcon className="text-[1rem]" /> },
          { value: 'dark', label: t('dark'), node: <MoonIcon className="text-[1rem]" /> },
          { value: 'system', label: t('system'), node: <MonitorIcon className="text-[1rem]" /> },
        ]}
      />

      <Segmented
        label={t('language')}
        value={lang}
        onChange={(value) => set({ lang: value })}
        options={LANGUAGES.map((language) => ({
          value: language.value,
          short: language.short,
          label: language.label,
        }))}
      />
    </div>
  );
}
