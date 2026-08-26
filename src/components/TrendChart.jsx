import { useId, useMemo } from 'react';
import { useSettings } from '../hooks/settingsContext.js';
import { formatShortHour } from '../lib/time.js';
import { temp, tempUnitLabel } from '../lib/units.js';



const W = 720;
const H = 260;
const PAD = { top: 26, right: 16, bottom: 46, left: 16 };
const PLOT_H = H - PAD.top - PAD.bottom;
const BAR_ZONE = 54; // Bottom band of the plot reserved for the precip bars.

/** Catmull-Rom to cubic Bézier, so the temperature line curves smoothly. */
function smoothPath(points) {
  if (points.length < 2) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

export function TrendChart({ slots, timezone }) {
  const { tempUnit, lang, t } = useSettings();
  const gradientId = useId();

  const chart = useMemo(() => {
    const data = slots;
    if (data.length < 2) return null;

    const temps = data.map((slot) => temp(slot.temp, tempUnit));
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    // A flat run of identical temperatures would divide by zero; pad the range.
    const span = max - min || 1;

    const usableW = W - PAD.left - PAD.right;
    const lineZone = PLOT_H - BAR_ZONE;

    const points = data.map((slot, index) => ({
      x: PAD.left + (index / (data.length - 1)) * usableW,
      y: PAD.top + lineZone - ((temps[index] - min) / span) * (lineZone - 20),
      value: temps[index],
      slot,
    }));

    const barWidth = Math.min(26, (usableW / data.length) * 0.55);

    return { data, points, min, max, barWidth, baseline: PAD.top + PLOT_H };
  }, [slots, tempUnit]);

  if (!chart) return null;

  const { points, barWidth, baseline } = chart;
  const line = smoothPath(points);
  const area = `${line} L ${points.at(-1).x} ${baseline} L ${points[0].x} ${baseline} Z`;

  return (
    <section className="surface rounded-3xl p-5">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="text-[0.78rem] font-medium tracking-wide text-secondary uppercase">
          {t('temperature')} · {tempUnitLabel(tempUnit)}
        </h2>
        <span className="flex items-center gap-1.5 text-[0.72rem] text-faint">
          <span className="size-2 rounded-full bg-sky-400" />
          {t('chanceOfRain')}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full overflow-visible"
        role="img"
        aria-label={`${t('temperature')} ${chart.min}${tempUnitLabel(tempUnit)} to ${chart.max}${tempUnitLabel(tempUnit)} over the next 48 hours`}
      >
        <defs>
          <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="var(--chart-fill)" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Precipitation probability, drawn behind the temperature line. */}
        {chart.data.map((slot, index) => {
          const height = (slot.pop ?? 0) * BAR_ZONE;
          if (height < 1) return null;
          return (
            <rect
              key={`bar-${slot.dt}`}
              x={points[index].x - barWidth / 2}
              y={baseline - height}
              width={barWidth}
              height={height}
              rx={barWidth / 3}
              className="fill-sky-400/55 dark:fill-sky-300/45"
            />
          );
        })}

        <line x1={PAD.left} y1={baseline} x2={W - PAD.right} y2={baseline} stroke="currentColor" strokeOpacity="0.16" />

        <path d={area} fill={`url(#${gradientId}-area)`} />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="draw-line"
          style={{ '--len': 2400 }}
        />

        {points.map((point, index) => (
          <g key={point.slot.dt}>
            <circle cx={point.x} cy={point.y} r="3.5" fill="currentColor" />
            {/* Label every other point so the axis never collides with itself. */}
            {index % 2 === 0 && (
              <>
                <text
                  x={point.x}
                  y={point.y - 13}
                  textAnchor="middle"
                  className="fill-current text-[15px] font-semibold"
                >
                  {point.value}°
                </text>
                <text
                  x={point.x}
                  y={H - 16}
                  textAnchor="middle"
                  className="fill-current text-[14px] opacity-55"
                >
                  {formatShortHour(point.slot.dt, timezone, lang)}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </section>
  );
}
