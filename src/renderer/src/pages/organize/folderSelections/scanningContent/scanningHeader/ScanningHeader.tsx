import { FolderMinusIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

interface ScanningHeaderProps {
  label: string
  progress: number
  isLoading: boolean
  folderPath: string
  onClearClick?: () => void
}
export const ScanningHeader = ({
  isLoading,
  label,
  progress,
  folderPath,
  onClearClick
}: ScanningHeaderProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      {/* Process Status */}
      <div className="flex flex-row items-center justify-between">
        <span className="flex text-xl font-semibold text-primary capitalize gap-1 ">
          {label}
          {isLoading && (
            <span className="text-2xl inline-flex">
              <span className="animate-bounce [animation-delay:-0.3s]">.</span>
              <span className="animate-bounce [animation-delay:-0.10s]">.</span>
              <span className="animate-bounce">.</span>
            </span>
          )}
        </span>

        {/* Change Folder Button */}
        {onClearClick && (
          <button
            type="button"
            title="Change Folder"
            onClick={onClearClick}
            className={mergeCls(
              'flex w-8 h-7 flex-row items-center justify-center gap-1 rounded-md p-1 transition-colors',
              'group active:scale-95 cursor-pointer border border-primary bg-primary text-on-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim'
            )}
          >
            <FolderMinusIcon className="size-4 stroke-3 shrink-0" />
          </button>
        )}
      </div>

      {/* Processing folder and progress percentage */}
      <div className="flex flex-row items-center justify-between">
        <p className="flex flex-row items-center justify-left text-sm text-outline-dim gap-2">
          Processing sub-directories of
          <span className=" text-xs font-semibold text-primary">({folderPath})</span>
        </p>

        <span className="text-xs text-on-surface-variant/80 tabular-nums">{progress}%</span>
      </div>
    </div>
  )
}
