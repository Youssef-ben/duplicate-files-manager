/* eslint-disable react-refresh/only-export-components */
import { type ThemePreference } from '@handlers/theme/types';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({
  children
}: ThemeProviderProps): ReturnType<typeof ThemeContext.Provider> {
  const [selectedTheme, setSelectedTheme] = useState<ThemePreference>('system');
  const [theme, setPreferredTheme] = useState<ThemePreference>('system');

  useEffect(() => {
    let cancelled = false;

    const fetchTheme = (): void => {
      window.appApi.theme
        .getTheme()
        .then(
          ({
            resolved,
            preference: {
              theme: { selected }
            }
          }) => {
            if (cancelled) return;
            setPreferredTheme(selected);
            setSelectedTheme(resolved);
          }
        )
        .catch(() => {
          // Optional: Handle error (e.g. log or ignore)
        });
    };

    fetchTheme();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = window.appApi.theme.onThemeChanged((theme) => {
      setPreferredTheme(theme);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const setTheme = useCallback((theme: ThemePreference): void => {
    setPreferredTheme(theme);
    setSelectedTheme(theme);
    window.appApi.theme.setTheme(theme);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: selectedTheme,
      setTheme
    }),
    [selectedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
