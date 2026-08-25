import { useSettings } from '../hooks/settingsContext.js';
import {
  formatPercent,
  formatPressure,
  formatTemp,
  formatVisibility,
  temp,
  windDescriptor,
  windDirection,
  windSpeed,
  windUnitLabel,
} from '../lib/units.js';
import {
  CloudIcon,
  DewIcon,
  DropletIcon,
  EyeIcon,
  GaugeIcon,
  ThermometerIcon,
  WindArrow,
  WindIcon,
} from './Icons.jsx';

function Tile({ icon, label, value, sub, children }) {
  return (
    <div className="surface flex flex-col gap-1.5 rounded-3xl p-4">
      <div className="flex items-center gap-2 text-[0.78rem] font-medium tracking-wide text-secondary uppercase">
        <span className="text-[1rem]">{icon}</span>
        {label}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[1.6rem] leading-tight font-semibold whitespace-nowrap tabular-nums">
          {value}
        </span>
        {children}
      </div>
      {sub && <p className="text-[0.8rem] text-faint">{sub}</p>}
    </div>
  );
}

/** Every field the free tier actually returns, one tile each. */
export function DetailGrid({ current, slot }) {
  const { tempUnit, windUnit, t } = useSettings();

  const speed = windSpeed(current.windSpeed, windUnit);
  // Gusts only when the current reading itself carries one; borrowing a
  // forecast slot's gust can pair 14 mph with a 10 mph "gust".
  const gust = current.windGust;
  const descriptor = windDescriptor(current.windSpeed);
  const direction = windDirection(current.windDeg);
  // Compare in the active unit so the delta matches the numbers beside it.
  const feelsDelta = temp(current.feelsLike, tempUnit) - temp(current.temp, tempUnit);
  const dewPoint = slot?.dewPoint;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <Tile
        icon={<WindIcon />}
        label={t('wind')}
        value={`${speed} ${windUnitLabel(windUnit)}`}
        sub={
          [descriptor ? t(descriptor) : null, gust ? t('gusting', { value: `${windSpeed(gust, windUnit)} ${windUnitLabel(windUnit)}` }) : null]
            .filter(Boolean)
            .join(' · ') || null
        }
      >
        {direction && (
          <span className="flex items-center gap-1 text-[0.85rem] text-secondary">
            <WindArrow deg={current.windDeg} className="text-[0.95rem]" />
            {direction}
          </span>
        )}
      </Tile>

      <Tile icon={<DropletIcon />} label={t('humidity')} value={`${current.humidity}%`} />

      <Tile
        icon={<ThermometerIcon />}
        label={t('feelsLike')}
        value={formatTemp(current.feelsLike, tempUnit)}
        sub={feelsDelta ? t('vsActual', { value: `${feelsDelta > 0 ? '+' : ''}${feelsDelta}°` }) : null}
      />

      <Tile icon={<GaugeIcon />} label={t('pressure')} value={formatPressure(current.pressure, windUnit)} />

      <Tile
        icon={<EyeIcon />}
        label={t('visibility')}
        value={formatVisibility(current.visibility, windUnit)}
        sub={current.visibility >= 10000 ? t('clearView') : null}
      />

      <Tile
        icon={<CloudIcon />}
        label={t('cloudCover')}
        value={`${current.clouds}%`}
        sub={slot ? `${t('chanceOfRain')} ${formatPercent(slot.pop)}` : null}
      />

      {/* dew_point ships with forecast slots but not the current-weather
          endpoint, so this tile appears only once a forecast has loaded. */}
      {dewPoint !== null && dewPoint !== undefined && (
        <Tile icon={<DewIcon />} label={t('dewPoint')} value={formatTemp(dewPoint, tempUnit)} />
      )}
    </div>
  );
}
