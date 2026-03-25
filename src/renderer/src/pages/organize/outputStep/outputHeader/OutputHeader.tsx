import { ClearFolderButton } from '@components/buttons'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

export interface OutputHeaderProps {
  hasSelection: boolean
  handleOnSkipClick: () => void
  handleOnClearClick: () => void
}

export const OutputHeader = ({
  hasSelection,
  handleOnSkipClick,
  handleOnClearClick
}: OutputHeaderProps): React.JSX.Element => {
  return (
    <div className="flex flex-row items-center justify-center w-full gap-1">
      <div className="flex flex-col items-left justify-center w-full gap-1">
        <span className="text-xl font-semibold text-primary">Output Directory</span>
        <p className="text-sm text-outline-dim">
          Choose a directory to save the organized files to.
        </p>
        <p className="text-sm text-outline-dim">
          If you skip this step, the organized files will be saved to the same directory as the
          source files.
        </p>
      </div>

      {!hasSelection && (
        <a
          role="button"
          title="Skip Step"
          onClick={handleOnSkipClick}
          className={mergeCls(
            'group flex flex-row items-center justify-center gap-1 h-fit w-fit',
            'bg-transparent text-on-surface-variant px-2 py-1',
            'active:scale-95 cursor-pointer hover:underline hover:font-medium text-sm'
          )}
        >
          Skip
          <ChevronRightIcon className="size-4 mt-[2px] shrink-0 group-hover:stroke-3" />
        </a>
      )}

      {hasSelection && <ClearFolderButton onClick={handleOnClearClick} />}
    </div>
  )
}
