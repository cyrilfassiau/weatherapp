import { useSettings } from '../hooks/settingsContext.js';
import { errorKeyFor } from '../lib/i18n.js';
import { AlertIcon, RefreshIcon, SearchIcon } from './Icons.jsx';

/** Skeleton mirrors the loaded layout's dimensions, so nothing shifts on arrival. */
export function WeatherSkeleton() {
  const { t } = useSettings();

  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t('loading')}</span>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="skeleton h-7 w-44" />
        <div className="skeleton h-4 w-28" />
        <div className="skeleton mt-2 size-36 rounded-full" />
        <div className="skeleton h-16 w-40" />
        <div className="skeleton h-4 w-52" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton h-[6.5rem] rounded-3xl" />
        ))}
      </div>

      <div className="skeleton h-40 rounded-3xl" />
      <div className="skeleton h-64 rounded-3xl" />
      <div className="skeleton h-72 rounded-3xl" />
    </div>
  );
}

export function ErrorState({ kind, onRetry }) {
  const { t } = useSettings();
  // A misconfigured key is the developer's problem to fix, not something a
  // retry button can resolve, so those two kinds get no retry affordance.
  const retryable = kind !== 'missing-key' && kind !== 'bad-key';

  return (
    <div role="alert" className="surface flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center">
      <AlertIcon className="text-3xl text-amber-500" />
      <p className="max-w-sm text-[0.95rem] text-secondary">{t(errorKeyFor(kind))}</p>
      {retryable && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 flex items-center gap-2 rounded-full bg-black/10 px-5 py-2.5 text-[0.9rem] font-medium transition hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/22"
        >
          <RefreshIcon className="text-[1rem]" />
          {t('retry')}
        </button>
      )}
    </div>
  );
}

export function EmptyState() {
  const { t } = useSettings();

  return (
    <div className="surface flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
      <SearchIcon className="text-3xl text-faint" />
      <h2 className="text-xl font-semibold">{t('emptyTitle')}</h2>
      <p className="max-w-sm text-[0.95rem] text-secondary">{t('emptyBody')}</p>
    </div>
  );
}
