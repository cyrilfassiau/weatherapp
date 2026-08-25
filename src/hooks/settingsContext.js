import { createContext, useContext } from 'react';

/**
 * Kept apart from the provider component: a module that exports both a
 * component and a plain function cannot be Fast Refreshed, which makes every
 * settings edit blow away app state during development.
 */
export const SettingsContext = createContext(null);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside <SettingsProvider>');
  return context;
}
