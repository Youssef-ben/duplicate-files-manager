import { ClearFolderButton } from '@components/buttons'
import { LoadingDots } from '@components/loadingDots'
import { FolderIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCliRun } from '@hooks/useCliRun'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { mergeCls } from '@utils/ClassNameMerger'
import { getProgressPercentage } from '@utils/strings'
import { useCallback, useMemo } from 'react'

interface ScanningHeaderProps {
  folderPath: string
}

export const ScanningHeader = ({ folderPath }: ScanningHeaderProps): React.JSX.Element => {
  const { reset } = useOrganizeStore()
  const { status } = useOrganizeStore(StepSelector('selection'))

  const { progress, resetRunner } = useCliRun()

  const isCompleted = useMemo(() => status === 'COMPLETED', [status])
  const isRunning = useMemo(() => status === 'RUNNING', [status])

  const progressLabel = useMemo(() => {
    if (isCompleted) return 'Scan Completed Successfully'

    return `${progress?.stage ?? 'Discovering'}`
  }, [isCompleted, progress?.stage])

  const progressPercentage = getProgressPercentage(progress)

  const onClearClick = useCallback(() => {
    reset()
    resetRunner()
  }, [reset, resetRunner])

  const onCancelClick = useCallback(() => {
    resetRunner()
    onClearClick()
  }, [resetRunner, onClearClick])

  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      {/* Process Status */}
      <div className="flex flex-row items-center justify-between">
        <span className="flex text-xl font-semibold text-primary capitalize gap-1 items-end justify-baseline ">
          {progressLabel}
          {isRunning && <LoadingDots />}
        </span>

        {/* Change Folder Button */}
        {isCompleted && <ClearFolderButton title="Change Folder" onClick={onClearClick} />}

        {isRunning && (
          <button
            type="button"
            title="Cancel Scan"
            onClick={onCancelClick}
            className={mergeCls(
              'flex w-6 h-6 flex-row items-center justify-center gap-1 rounded-full p-1 transition-colors',
              'group active:scale-95 cursor-pointer border border-primary bg-transparent text-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim'
            )}
          >
            <XMarkIcon className="size-4 stroke-3 shrink-0 transition-all duration-500 group-hover:rotate-90" />
          </button>
        )}
      </div>

      {/* Processing folder and progress percentage */}
      <div className="flex max-w-full min-w-0 flex-row items-baseline justify-between gap-2">
        <div
          className="w-0 min-w-0 flex-1 truncate text-sm text-outline-dim"
          title={folderPath.trim()}
        >
          <div className="relative w-full flex flex-row items-baseline justify-start">
            <FolderIcon className="absolute size-4 stroke-3 shrink-0 bottom-px " />
            <span className="ml-5 text-xs font-semibold w-full truncate">{folderPath.trim()}</span>
          </div>
        </div>

        <span
          className={mergeCls('shrink-0 text-md font-semibold text-primary tabular-nums', {
            'uppercase font-bold text-[10px]': isCompleted,
            'text-on-surface-variant/80': progressPercentage === 0
          })}
        >
          {isCompleted ? 'done' : `${progressPercentage}%`}
        </span>
      </div>
    </div>
  )
}
