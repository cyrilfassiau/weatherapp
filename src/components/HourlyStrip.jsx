import { useSettings } from '../hooks/settingsContext.js';
import { iconUrl } from '../lib/conditions.js';
import { formatShortHour } from '../lib/time.js';
import { formatPercent, formatTemp } from '../lib/units.js';
import { DropletIcon } from './Icons.jsx';

/**
 * The next 24 hours at the 3-hour resolution the free forecast provides.
 * Deliberately not interpolated to per-hour — the subtitle says so.
 */
export function HourlyStrip({ slots, timezone }) {
  const { tempUnit, lang, t } = useSettings();
  if (!slots.length) return null;

  return (
    <section className="surface rounded-3xl p-5">
      <h2 className="text-[0.78rem] font-medium tracking-wide text-secondary uppercase">{t('next24h')}</h2>
      <p className="mt-0.5 mb-3 text-[0.76rem] text-faint">{t('threeHourly')}</p>

      <ul className="scroll-x flex gap-2 pb-2">
        {slots.map((slot, index) => (
          <li
            key={slot.dt}
            className="rise flex min-w-[4.6rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-2xl px-2 py-3 transition hover:bg-black/5 dark:hover:bg-white/8"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <span className="text-[0.8rem] font-medium text-secondary tabular-nums">
              {formatShortHour(slot.dt, timezone, lang)}
            </span>
            <img src={iconUrl(slot.conditionId)} alt={slot.description} width="44" height="44" className="size-11 object-contain" />
            <span className="text-[1.05rem] font-semibold tabular-nums">{formatTemp(slot.temp, tempUnit)}</span>
            <span className={`flex items-center gap-0.5 text-[0.72rem] tabular-nums ${slot.pop > 0.1 ? 'text-sky-500 dark:text-sky-300' : 'text-faint opacity-0'}`}>
              <DropletIcon className="text-[0.7rem]" />
              {formatPercent(slot.pop)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
