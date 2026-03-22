import { ProgressBar } from '@components/index'
import { useCliRun } from '@hooks/useCliRun'
import { StepSelector, useOrganizeStore } from '@pages/organize/store/organizeStore'
import { getProgressPercentage } from '@utils/strings'
import { useCallback, useEffect, useMemo } from 'react'
import { ScanningHeader } from './scanningHeader'
import { ScanningLoader } from './scanningLoader'
import { ScanningSummaryPanel } from './scanningSummaryPanel'

export const ScanningContent = (): React.JSX.Element => {
  const { rootFolderPath, reset } = useOrganizeStore()
  const { stop, status, progress } = useCliRun()

  const selectedStep = useOrganizeStore(StepSelector('selection'))

  const onClearClick = useCallback(() => {
    stop()
    reset()
  }, [stop, reset])

  useEffect(() => {
    selectedStep.setIsCompleted(status === 'done')
  }, [status, selectedStep])

  const progressLabel = useMemo(() => {
    return status === 'done' ? 'Completed ' : `${progress?.stage ?? 'Discovering'}`
  }, [status, progress?.stage])

  const progressPercentage = getProgressPercentage(progress)

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-2 overflow-hidden">
      <ScanningHeader
        isLoading={status !== 'done'}
        label={progressLabel}
        progress={progressPercentage}
        folderPath={rootFolderPath ?? ''}
        onClearClick={status === 'done' ? onClearClick : undefined}
      />

      {/* Progress bar */}
      <div className="flex flex-col items-left justify-center w-full">
        <ProgressBar percentage={progressPercentage} />
      </div>

      {/* Summary */}
      {status === 'done' ? (
        <ScanningSummaryPanel />
      ) : (
        <ScanningLoader show={true} progress={progressPercentage} />
      )}
    </div>
  )
}
