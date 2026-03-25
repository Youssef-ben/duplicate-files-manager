import { ProgressBar } from '@components/progressBar'
import { ClockIcon, CommandLineIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { formatDuration, humanizeSize } from '@utils/strings'

export const FlatteningCompleted = (): React.JSX.Element => {
  const { getPath } = useOrganizeStore()

  const { status, result, completedAtMs } = useOrganizeStore(StepSelector('flatten'))

  if (status !== 'COMPLETED' || !result || !completedAtMs) return <></>

  return (
    <div className="flex flex-col items-start justify-center w-full gap-6 p-2">
      <div className="flex flex-row items-start justify-center w-full gap-3">
        <div className="flex flex-3 flex-col items-start justify-center w-full gap-6 bg-surface-bright rounded-md px-4 py-4 shadow-card">
          <div className="flex flex-col items-center justify-center w-full gap-1">
            <div className="flex flex-row items-center justify-center w-full gap-4 ">
              <span className="flex flex-1 text-xs font-bold text-primary uppercase">Status</span>
              <span className="flex text-[10px] font-semibold text-on-primary bg-primary rounded-full px-2 uppercase">
                100%
              </span>
            </div>

            <div className="flex flex-col items-start justify-center w-full gap-1">
              <span className="text-xl font-semibold text-on-primary-container capitalize">
                Operation Completed
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <div className="flex flex-row items-start justify-between w-full px-1">
              <span className="text-xs font-semibold text-outline-dim">
                <span className="font-mono">{result.total_staged.toLocaleString()}</span> of{' '}
                <span className="font-mono">{result.total_scanned.toLocaleString()}</span> files
                staged
              </span>
              <span className="text-xs font-bold text-primary uppercase">Done</span>
            </div>
            <ProgressBar percentage={100} />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center w-full gap-2 px-4 py-4 bg-primary rounded-md shadow-ghost h-full text-on-primary">
          <div className="flex flex-col items-start justify-center w-full gap-0 ">
            <span className="text-xs font-semibold text-on-primary uppercase">Total Data</span>
            <span className="text-2xl font-bold text-on-primary uppercase font-mono">
              {humanizeSize(result.total_bytes)}
            </span>
          </div>

          <div className="flex w-full border-b border-surface-variant rounded-full" />

          <div className="flex flex-col items-start justify-center w-full gap-0 ">
            <span className="text-xs font-semibold text-on-primary capitalize">
              <span className="font-mono">{result.total_staged.toLocaleString()}</span> files
              scanned
            </span>
            <span className="text-xs font-semibold text-on-primary/60 capitalize">
              Verified & validated
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start justify-center w-full gap-2">
        <div className="flex flex-2 h-full flex-row items-start justify-center w-85 gap-4 bg-surface-bright rounded-md px-4 py-4 shadow-card">
          <div className="flex flex-1 flex-col items-center justify-center w-full h-full bg-surface-variant rounded-md p-2">
            <CommandLineIcon className="size-6 text-primary" />
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <span className="text-xs font-medium text-primary uppercase">Staging Folder</span>
            <span className="text-xs font-semibold text-on-surface-variant truncate code font-mono">
              {`${getPath()}\\staging`}
            </span>
          </div>
        </div>

        <div className="flex flex-1 h-full flex-row items-start justify-center gap-4 bg-surface-bright rounded-md px-4 py-4 shadow-card">
          <div className="flex flex-1 flex-col items-center justify-center w-full h-full bg-surface-variant rounded-md p-2">
            <PhotoIcon className="size-6 text-primary" />
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <span className="text-xs font-medium text-primary uppercase">Processed Files</span>
            <span className="text-sm font-bold text-on-surface-variant truncate font-mono">
              {result.total_staged} files
            </span>
          </div>
        </div>

        <div className="flex flex-1 h-full flex-row items-start justify-center gap-4 bg-surface-bright rounded-md px-4 py-4 shadow-card">
          <div className="flex flex-1 flex-col items-center justify-center w-full h-full bg-surface-variant rounded-md p-2">
            <ClockIcon className="size-6 text-primary" />
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <span className="text-xs font-medium text-primary uppercase">Process Time</span>
            <span className="text-sm font-bold text-on-surface-variant truncate font-mono">
              {formatDuration(completedAtMs)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
