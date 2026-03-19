import { ThemeSwatch } from '@handlers/theme/types'
import { mergeCls } from '@utils/ClassNameMerger'
import { JSX } from 'react'

export interface ThemeThumbnailProps {
  theme: ThemeSwatch
  isActive: boolean
  onClick: () => void
}

export const ThemeThumbnail = ({ theme, isActive, onClick }: ThemeThumbnailProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
    >
      <div
        className={mergeCls(
          'relative h-24 w-24 rounded-md border bg-surface border-muted transition-transform hover:scale-[1.02]',
          {
            'ring-2 ring-accent ring-offset-2 ring-offset-surface': isActive
          }
        )}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
          {theme.swatches.map((color) => (
            <div key={color} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      <span className="block text-xs font-medium text-subtle">{theme.label}</span>
    </button>
  )
}
