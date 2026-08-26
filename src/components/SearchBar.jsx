import { useEffect, useId, useRef, useState } from 'react';
import { useCitySearch } from '../hooks/useCitySearch.js';
import { useSettings } from '../hooks/settingsContext.js';
import { errorKeyFor } from '../lib/i18n.js';
import { CrosshairIcon, SearchIcon } from './Icons.jsx';


export function SearchBar({ onSelect, onLocate, locating }) {
  const { t } = useSettings();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, searching, error, hasQuery } = useCitySearch(query);

  const listId = useId();
  const optionId = (index) => `${listId}-option-${index}`;
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Reset the highlight whenever the result set changes underneath it.
  useEffect(() => setActiveIndex(-1), [results]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const choose = (place) => {
    onSelect(place);
    setQuery('');
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      // First Escape closes the list, a second clears the query — the
      // behaviour the ARIA combobox pattern specifies.
      if (open) {
        setOpen(false);
        setActiveIndex(-1);
      } else {
        setQuery('');
      }
      return;
    }
    if (!results.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[activeIndex >= 0 ? activeIndex : 0]);
    }
  };

  const expanded = open && hasQuery;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="surface relative flex flex-1 items-center gap-3 rounded-full px-5 py-3">
          <SearchIcon className="shrink-0 text-[1.15rem] text-secondary" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label={t('searchLabel')}
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            spellCheck="false"
            value={query}
            placeholder={t('searchPlaceholder')}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent text-[0.98rem] outline-none placeholder:text-[var(--text-faint)]"
          />
          {searching && (
            <span
              aria-hidden
              className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40"
            />
          )}
        </div>

        <button
          type="button"
          onClick={onLocate}
          disabled={locating}
          title={t('useMyLocation')}
          aria-label={t('useMyLocation')}
          className="surface grid size-[3.05rem] shrink-0 place-items-center rounded-full transition hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <CrosshairIcon className={`text-[1.2rem] ${locating ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Announced to assistive tech without stealing focus from the input. */}
      <span className="sr-only" aria-live="polite">
        {expanded && !searching
          ? error
            ? t(errorKeyFor(error))
            : results.length
              ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
              : t('noResults')
          : ''}
      </span>

      {expanded && (
        <ul
          id={listId}
          role="listbox"
          aria-label={t('searchLabel')}
          className="surface absolute top-[calc(100%+0.6rem)] z-30 max-h-72 w-full overflow-y-auto rounded-3xl p-2"
        >
          {results.map((place, index) => (
            <li key={place.id} id={optionId(index)} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(place)}
                className={`w-full rounded-2xl px-4 py-2.5 text-left text-[0.92rem] transition ${
                  index === activeIndex ? 'bg-black/10 dark:bg-white/12' : ''
                }`}
              >
                <span className="font-medium">{place.name}</span>
                <span className="text-secondary">
                  {[place.state, place.country].filter(Boolean).length > 0 &&
                    ` — ${[place.state, place.country].filter(Boolean).join(', ')}`}
                </span>
              </button>
            </li>
          ))}

          {!results.length && !searching && (
            <li className="px-4 py-3 text-[0.9rem] text-secondary">
              {error ? t(errorKeyFor(error)) : t('noResults')}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
