import { ClockIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { formatDuration } from '@utils/strings'
import { StepSelector, useOrganizeStore } from '../../store/organizeStore'

export const ConfirmCompleted = (): React.JSX.Element => {
  const { selectedFolderPath } = useOrganizeStore()

  const { completedAtMs } = useOrganizeStore(StepSelector('flatten'))

  return (
    <div className="flex flex-col items-start justify-start w-full h-fit gap-2 px-1">
      <div className="flex flex-row items-center justify-center w-full gap-2">
        <div className="flex flex-2 w-full h-full flex-row items-start justify-center gap-4 bg-surface-bright rounded-md px-4 py-4 pr-25 shadow-card">
          <div className="flex flex-1 flex-col items-center justify-center w-full h-full bg-surface-variant rounded-md p-2">
            <CommandLineIcon className="size-6 text-primary" />
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <span className="text-xs font-medium text-primary uppercase">Organized Folder</span>
            <span className="text-xs font-semibold text-on-surface-variant truncate code font-mono">
              {selectedFolderPath}\organized
            </span>
          </div>
        </div>

        <div className="flex flex-1 w-full h-full flex-row items-start justify-center gap-4 bg-surface rounded-md px-4 py-4 shadow-card">
          <div className="flex flex-1 flex-col items-center justify-center w-full h-full bg-surface-variant rounded-md p-2">
            <ClockIcon className="size-6 text-primary" />
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <span className="text-xs font-medium text-primary uppercase">Process Time</span>
            <span className="text-sm font-bold text-on-surface-variant truncate font-mono">
              {formatDuration(completedAtMs ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
