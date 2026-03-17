/* eslint-disable react-refresh/only-export-components */
import { type SupportedTheme, type ThemePreference } from '@handlers/theme/types'
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface ThemeContextValue {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({
  children
}: ThemeProviderProps): ReturnType<typeof ThemeContext.Provider> {
  const [SupportedTheme, setSupportedTheme] = useState<SupportedTheme>('dark')
  const [theme, setPreferredTheme] = useState<ThemePreference>('system')

  useEffect(() => {
    let cancelled = false

    const fetchTheme = async (): Promise<void> => {
      const theme = await window.appApi.theme.getTheme()
      if (cancelled) return
      console.log('fetchTheme', theme)
      setPreferredTheme(theme)
    }

    void fetchTheme()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', SupportedTheme)
  }, [SupportedTheme])

  useEffect(() => {
    const unsubscribe = window.appApi.theme.onThemeChanged((theme) => {
      setSupportedTheme(theme)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const setTheme = useCallback((theme: ThemePreference): void => {
    setPreferredTheme(theme)
    window.appApi.theme.setTheme(theme)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme
    }),
    [theme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
