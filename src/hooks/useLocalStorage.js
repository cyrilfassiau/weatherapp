import { useEffect, useState } from 'react';

/**
 * State mirrored into localStorage. Reads lazily on mount and tolerates
 * private-mode / quota failures by falling back to in-memory state.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable (private browsing, quota) — keep working in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
