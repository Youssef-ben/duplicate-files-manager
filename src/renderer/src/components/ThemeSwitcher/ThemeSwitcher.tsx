import { useTheme } from '@context/theme'
import { THEMES_SWATCHES } from '@handlers/theme/types'
import type { JSX } from 'react'
import { ThemeThumbnail } from './themeThumbnail'
export function ThemeSwitcher(): JSX.Element {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-row items-left gap-4 flex-wrap w-full">
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
