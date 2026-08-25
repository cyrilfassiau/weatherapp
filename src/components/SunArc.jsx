import { useSettings } from '../hooks/settingsContext.js';
import { formatDuration, formatHour } from '../lib/time.js';
import { MoonIcon, SunIcon } from './Icons.jsx';

const W = 320;
const H = 120;
const PAD = 26;
const BASE = H - 22;

/** Semicircular arc from sunrise to sunset, with the sun placed at `now`. */
function arcPoint(progress) {
  const clamped = Math.min(1, Math.max(0, progress));
  const angle = Math.PI * (1 - clamped);
  const rx = (W - PAD * 2) / 2;
  const ry = BASE - PAD;
  return { x: W / 2 + rx * Math.cos(angle) * -1, y: BASE - ry * Math.sin(angle) };
}

export function SunArc({ current }) {
  const { lang, t } = useSettings();
  const { sunrise, sunset, timezone, dt, isDay } = current;

  if (!sunrise || !sunset) return null;

  const dayLength = sunset - sunrise;
  const progress = (dt - sunrise) / dayLength;
  const marker = arcPoint(progress);

  const nextEvent = isDay
    ? { seconds: sunset - dt, label: t('untilSunset') }
    : { seconds: (dt < sunrise ? sunrise : sunrise + 86400) - dt, label: t('untilSunrise') };

  const path = `M ${PAD} ${BASE} A ${(W - PAD * 2) / 2} ${BASE - PAD} 0 0 1 ${W - PAD} ${BASE}`;

  return (
    <section className="surface rounded-3xl p-5">
      <h2 className="mb-1 text-[0.78rem] font-medium tracking-wide text-secondary uppercase">
        {t('sunrise')} · {t('sunset')}
      </h2>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${t('sunrise')} ${formatHour(sunrise, timezone, lang)}, ${t('sunset')} ${formatHour(sunset, timezone, lang)}`}>
        <defs>
          <linearGradient id="sun-arc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="var(--chart-fill)" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Filled area beneath the travelled portion of the arc. */}
        <path d={`${path} L ${PAD} ${BASE} Z`} fill="url(#sun-arc-fill)" />
        <path d={path} fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="4 5" />

        <line x1={PAD - 10} y1={BASE} x2={W - PAD + 10} y2={BASE} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

        {progress >= 0 && progress <= 1 && (
          <g>
            <circle cx={marker.x} cy={marker.y} r="11" className="fill-amber-400/25" />
            <circle cx={marker.x} cy={marker.y} r="5.5" className="fill-amber-400" />
          </g>
        )}
      </svg>

      <div className="-mt-3 flex items-end justify-between text-[0.85rem]">
        <div className="flex items-center gap-1.5">
          <SunIcon className="text-[0.95rem] text-amber-400" />
          <span className="font-medium tabular-nums">{formatHour(sunrise, timezone, lang)}</span>
        </div>
        <div className="text-center text-[0.78rem] text-faint">
          <div>{formatDuration(nextEvent.seconds)} {nextEvent.label}</div>
          <div>{t('dayLength')} {formatDuration(dayLength)}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <MoonIcon className="text-[0.95rem] text-indigo-300" />
          <span className="font-medium tabular-nums">{formatHour(sunset, timezone, lang)}</span>
        </div>
      </div>
    </section>
  );
}
