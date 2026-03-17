import { THEMES_SWATCHES } from '@handlers/theme/types'
import { useTheme } from '@renderer/context/theme'
import type { JSX } from 'react'
import { ThemeThumbnail } from './themeThumbnail'

interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps): JSX.Element {
  const { theme, setTheme } = useTheme()

  return (
    <div className={`grid grid-cols-3 gap-4 ${className ?? ''}`.trim()}>
      {THEMES_SWATCHES.map((themeSwatch) => (
        <ThemeThumbnail
          key={themeSwatch.id}
          theme={themeSwatch}
          isActive={theme === themeSwatch.id}
          onClick={() => setTheme(themeSwatch.id)}
        />
      ))}
    </div>
  )
}
