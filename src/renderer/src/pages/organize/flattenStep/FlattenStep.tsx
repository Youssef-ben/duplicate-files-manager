import { SimpleButton } from '@components/buttons'
import { StepProgress } from '@components/steps/stepProgress'
import { FlatteningProgressSummary, FlatteningResults } from '@handlers/cli/types/flatten.mode'
import { useCliRun } from '@hooks/useCliRun'
import { useCallback, useEffect, useMemo } from 'react'
import { StepSelector, useOrganizeStore } from '../store/organizeStore'
import { FlatteningHeader } from './fatteningHeader'
import { FlatteningCompleted } from './flatteningCompleted'
import { FlatteningPreview } from './flatteningPreview'

export const FlattenFolder = (): React.JSX.Element => {
  const { selectedFolderPath, getPath } = useOrganizeStore()
  const { stepRunnerId, status, startedAtMs, start, complete, reset } = useOrganizeStore(
    StepSelector('flatten')
  )
  const { reset: resetDuplicates } = useOrganizeStore(StepSelector('duplicates'))

  const { runnerId, summary, progress, run, resetRunner, stop } = useCliRun()

  useEffect(() => {
    if (!getPath()) window.location.reload()
  }, [getPath])

  /**
   * On completion:
   * - Read the summary
   * - Set the summary
   * - Complete the step
   */
  useEffect(
    function onCompletion() {
      if (!summary || status === 'COMPLETED' || stepRunnerId !== runnerId) return
      const { report_path } = summary as FlatteningProgressSummary
      const results = window.appApi.cli.readSummaryResult<FlatteningResults>(report_path)

      complete(results)
    },
    [summary, status, stepRunnerId, runnerId, complete]
  )

  const startProcess = useCallback(() => {
    if (!selectedFolderPath || !getPath()) return
    reset()
    resetDuplicates()
    resetRunner()

    const newRunId = crypto.randomUUID()
    start(newRunId)
    run({
      runId: newRunId,
      menu: 'organize',
      mode: 'flatten',
      sourceRoot: selectedFolderPath,
      outputFolder: getPath()
    })
  }, [selectedFolderPath, start, run, reset, resetRunner, resetDuplicates, getPath])

  const handleOnFlattenClick = useCallback(() => {
    if (status !== 'NOT_STARTED') return
    startProcess()
  }, [startProcess, status])

  const handleCancelFlatten = useCallback(() => {
    stop()
    reset()
  }, [stop, reset])

  const isRunning = useMemo(() => status === 'RUNNING', [status])
  const isCompleted = useMemo(() => status === 'COMPLETED', [status])

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      <FlatteningHeader
        status={status}
        onCancelClick={handleCancelFlatten}
        onReRunClick={startProcess}
      />

      {!isCompleted && <FlatteningPreview />}

      {/* Start Processing Button */}
      {!isRunning && !isCompleted && (
        <div className="flex flex-col items-end justify-center w-full gap-1">
          <SimpleButton variant="outline" label="Start Processing" onClick={handleOnFlattenClick} />
        </div>
      )}

      {isRunning && !isCompleted && (
        <StepProgress startedAtMs={startedAtMs ?? 0} progress={progress} />
      )}

      {!isRunning && isCompleted && <FlatteningCompleted />}
    </div>
  )
}
