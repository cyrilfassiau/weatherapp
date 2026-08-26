import { useSettings } from '../hooks/settingsContext.js';
import { CloseIcon } from './Icons.jsx';


export function SavedCities({ cities, activeId, onSelect, onRemove }) {
  const { t } = useSettings();
  if (!cities.length) return null;

  return (
    <nav aria-label={t('savedCities')} className="scroll-x -mx-1 flex gap-2 px-1 pb-1">
      {cities.map((city) => {
        const active = city.id === activeId;
        return (
          <div
            key={city.id}
            className={`surface group flex shrink-0 items-center gap-1 rounded-full py-1 pr-1 pl-4 transition ${
              active ? 'ring-2 ring-current/25' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(city)}
              aria-current={active ? 'true' : undefined}
              className="py-1.5 text-[0.86rem] font-medium whitespace-nowrap"
            >
              {city.name}
              {city.country && <span className="text-faint"> {city.country}</span>}
            </button>
            <button
              type="button"
              onClick={() => onRemove(city.id)}
              aria-label={`${t('unsave')}: ${city.name}`}
              className="grid size-7 shrink-0 place-items-center rounded-full text-[0.85rem] text-faint transition hover:bg-black/10 hover:text-[var(--text-primary)] dark:hover:bg-white/15"
            >
              <CloseIcon />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
