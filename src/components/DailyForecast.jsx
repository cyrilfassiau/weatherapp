import { useState } from 'react';
import { useSettings } from '../hooks/settingsContext.js';
import { iconUrl } from '../lib/conditions.js';
import { formatShortHour, formatWeekday } from '../lib/time.js';
import { formatPercent, formatTemp, temp } from '../lib/units.js';
import { ChevronIcon, DropletIcon } from './Icons.jsx';

/**
 * A bar spanning each day's min–max, positioned within the whole week's range,
 * so a cold day reads as short and left-shifted at a glance.
 */
function RangeBar({ day, weekMin, weekMax, unit }) {
  const span = weekMax - weekMin || 1;
  const left = ((temp(day.min, unit) - weekMin) / span) * 100;
  const width = ((temp(day.max, unit) - temp(day.min, unit)) / span) * 100;

  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/12">
      <div
        className="absolute inset-y-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-orange-400"
        style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
      />
    </div>
  );
}

export function DailyForecast({ days, timezone }) {
  const { tempUnit, lang, t } = useSettings();
  const [expandedKey, setExpandedKey] = useState(null);

  if (!days.length) return null;

  const weekMin = Math.min(...days.map((day) => temp(day.min, tempUnit)));
  const weekMax = Math.max(...days.map((day) => temp(day.max, tempUnit)));

  return (
    <section className="surface rounded-3xl p-5">
      <h2 className="mb-3 text-[0.78rem] font-medium tracking-wide text-secondary uppercase">
        {t('fiveDay')}
      </h2>

      <ul className="flex flex-col">
        {days.map((day, index) => {
          const expanded = expandedKey === day.key;
          return (
            <li key={day.key} className="border-b border-current/10 last:border-0">
              <button
                type="button"
                onClick={() => setExpandedKey(expanded ? null : day.key)}
                aria-expanded={expanded}
                aria-label={expanded ? t('collapse') : t('expand')}
                className="rise flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="w-12 shrink-0 text-[0.9rem] font-medium">
                  {index === 0 ? t('today') : formatWeekday(day.dt, timezone, lang)}
                </span>

                <img src={iconUrl(day.conditionId)} alt={day.description} width="36" height="36" className="size-9 shrink-0 object-contain" />

                <span className={`flex w-11 shrink-0 items-center gap-0.5 text-[0.75rem] tabular-nums ${day.pop > 0.1 ? 'text-sky-500 dark:text-sky-300' : 'opacity-0'}`}>
                  <DropletIcon className="text-[0.7rem]" />
                  {formatPercent(day.pop)}
                </span>

                <span className="w-9 shrink-0 text-right text-[0.9rem] text-secondary tabular-nums">
                  {formatTemp(day.min, tempUnit)}
                </span>

                <RangeBar day={day} weekMin={weekMin} weekMax={weekMax} unit={tempUnit} />

                <span className="w-9 shrink-0 text-[0.9rem] font-semibold tabular-nums">
                  {formatTemp(day.max, tempUnit)}
                </span>

                <ChevronIcon className={`shrink-0 text-[0.9rem] text-faint transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>

              {expanded && (
                <ul className="scroll-x flex gap-2 pb-4">
                  {day.slots.map((slot) => (
                    <li key={slot.dt} className="flex min-w-[3.9rem] shrink-0 flex-col items-center gap-1 rounded-xl bg-black/5 px-2 py-2.5 dark:bg-white/8">
                      <span className="text-[0.72rem] text-secondary tabular-nums">
                        {formatShortHour(slot.dt, timezone, lang)}
                      </span>
                      <img src={iconUrl(slot.conditionId)} alt="" width="28" height="28" className="size-7 object-contain" />
                      <span className="text-[0.85rem] font-semibold tabular-nums">{formatTemp(slot.temp, tempUnit)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
