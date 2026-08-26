import { useSettings } from '../hooks/settingsContext.js';
import { iconUrl } from '../lib/conditions.js';
import { formatHour, formatFullDate, formatOffset } from '../lib/time.js';
import { formatTemp, tempUnitLabel, temp } from '../lib/units.js';
import { StarIcon } from './Icons.jsx';

export function CurrentWeather({ place, current, day, saved, onToggleSave }) {
  const { tempUnit, lang, t } = useSettings();
  const tz = current.timezone;
  
  
  const showRange = day && day.slots.length >= 4;

  return (
    <section className="rise flex flex-col items-center gap-1 text-center">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {place?.name ?? current.name}
        </h1>
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? t('unsave') : t('save')}
          title={saved ? t('unsave') : t('save')}
          className={`grid size-9 place-items-center rounded-full text-[1.05rem] transition hover:scale-110 active:scale-95 ${
            saved ? 'text-amber-400' : 'text-faint hover:text-[var(--text-primary)]'
          }`}
        >
          <StarIcon filled={saved} />
        </button>
      </div>

      <p className="text-[0.9rem] text-secondary">
        {[place?.state, place?.country ?? current.country].filter(Boolean).join(', ')}
      </p>

      <p className="text-[0.82rem] text-faint">
        {formatFullDate(current.dt, tz, lang)} · {formatHour(current.dt, tz, lang)} {formatOffset(tz)}
      </p>

      <img
        src={iconUrl(current.conditionId)}
        alt=""
        width="160"
        height="160"
        className="mt-2 size-36 object-contain drop-shadow-2xl sm:size-44"
      />

      <div className="flex items-start">
        <span className="text-7xl leading-none font-light tracking-tighter tabular-nums sm:text-8xl">
          {temp(current.temp, tempUnit)}
        </span>
        <span className="mt-2 text-2xl font-light text-secondary">{tempUnitLabel(tempUnit)}</span>
      </div>

      {/* OpenWeatherMap localizes the description itself via the lang param. */}
      <p className="text-[1.05rem] font-medium first-letter:uppercase">{current.description}</p>

      <p className="text-[0.92rem] text-secondary">
        {t('feelsLike')} {formatTemp(current.feelsLike, tempUnit)}
        {showRange && (
          <>
            {' · '}
            {t('high')} {formatTemp(day.max, tempUnit)} · {t('low')} {formatTemp(day.min, tempUnit)}
          </>
        )}
      </p>
    </section>
  );
}
