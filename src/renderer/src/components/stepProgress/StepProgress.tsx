import { LoadingDots } from '@components/loadingDots'
import { ProgressBar } from '@components/progressBar'
import { ProgressEvent } from '@handlers/cli/types'
import {
  calculateRemainingTime,
  formatDuration,
  getProgressPercentage,
  humanizeSize
} from '@utils/strings'

export interface StepProgressProps {
  startedAtMs: number
  progress: ProgressEvent
}

export const StepProgress = ({ startedAtMs, progress }: StepProgressProps): React.JSX.Element => {
  const progressPercentage = getProgressPercentage(progress)
  const remainingTime = calculateRemainingTime(progress, startedAtMs)
  const isDiscovering = progress.stage.toLowerCase() === 'discovering'

  return (
    <div className="flex flex-row items-start justify-center w-full gap-4 p-2">
      <div className="flex flex-col items-start justify-start w-full gap-6 bg-surface-bright rounded-md px-4 py-6 shadow-card">
        <div className="flex flex-col items-start justify-start w-full gap-1">
          {/* Progress Header */}
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center justify-start gap-1">
              <span className="text-xs font-semibold text-primary uppercase">{progress.stage}</span>
              <LoadingDots />
            </div>
            {!isDiscovering && (
              <span className="text-xl font-semibold text-primary uppercase tabular-nums">
                {progressPercentage}%
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col items-start justify-center w-full gap-1">
            <ProgressBar percentage={progressPercentage} />
            <div className="flex flex-row items-start justify-between w-full px-1">
              <span className="text-[10px] font-normal text-outline-dim">
                PROCESSING
                <span className="font-mono">{progress.file ? ` - ${progress.file}` : ''}</span>
              </span>

              {!isDiscovering && (
                <div className="flex flex-row flex-wrap items-baseline gap-x-1 gap-y-0">
                  <span className="text-xs font-bold text-outline-dim tabular-nums">
                    {progress.current}
                  </span>
                  <span className="text-[10px] font-normal text-outline-dim">
                    / {progress.total} files
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-row items-start justify-between w-full px-1">
              <span className="text-[10px] font-normal text-outline-dim uppercase">
                {progress.file_size_bytes && humanizeSize(progress.file_size_bytes)}
              </span>
              {remainingTime > 0 && (
                <span className="text-[10px] font-normal text-outline-dim uppercase">
                  Time Remaining: {formatDuration(remainingTime)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
