import { SimpleButton } from '@components/buttons'
import { StepProgress } from '@components/steps/stepProgress'
import { OrganizeProgressSummary } from '@handlers/cli/types/organize.mode'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useCliRun } from '@hooks/useCliRun'
import { useCallback, useEffect, useMemo } from 'react'
import { StepSelector, useOrganizeStore } from '../store/organizeStore'
import { ConfirmCompleted } from './confirmCompleted'
import { ConfirmHeader } from './confirmHeader'
import { ConfirmPreview } from './confirmPreview'

export const ConfirmStep = (): React.JSX.Element => {
  const { getPath } = useOrganizeStore()
  const {
    stepRunnerId,
    status,
    startedAtMs,
    start,
    complete,
    reset: resetConfirm
  } = useOrganizeStore(StepSelector('confirm'))
  const { runnerId, summary, progress, run, stop } = useCliRun()

  useEffect(() => {
    if (!summary || stepRunnerId !== runnerId) return

    complete(summary as OrganizeProgressSummary)
  }, [summary, complete, stepRunnerId, runnerId])

  const onOrganizeClick = useCallback(() => {
    const newRunId = crypto.randomUUID()
    start(newRunId)
    run({
      runId: newRunId,
      menu: 'organize',
      mode: 'organize',
      sourceRoot: getPath(),
      outputFolder: getPath()
    })
  }, [getPath, run, start])

  const handleCancelOrganize = useCallback(() => {
    stop()
    resetConfirm()
  }, [stop, resetConfirm])

  const isRunning = useMemo(() => status === 'RUNNING', [status])
  const isCompleted = useMemo(() => status === 'COMPLETED', [status])

  return (
    <div className="flex flex-1 flex-col w-full h-full gap-4 overflow-hidden">
      <ConfirmHeader
        status={status}
        onCancelClick={handleCancelOrganize}
        onReRunClick={onOrganizeClick}
      />

      <ConfirmPreview />

      {/** Progress */}
      {isRunning && !isCompleted && (
        <StepProgress startedAtMs={startedAtMs ?? 0} progress={progress} />
      )}

      {isCompleted && <ConfirmCompleted />}

      {/** Operation Warnings*/}
      {!isRunning && !isCompleted && (
        <div className="flex flex-row items-start justify-start w-full gap-2 text-amber-600 bg-amber-100 border border-amber-200 rounded-md px-2 py-4">
          <ExclamationTriangleIcon className="size-6 stroke-2 text-amber-700" />
          <div className="flex flex-col items-start justify-center w-full gap-1">
            <span className="text-sm font-medium text-amber-600">Risks & Warnings</span>
            <span className="text-xs font-normal text-amber-600/80">
              Although this operation works with staged files and not the originals, it is still a
              destructive operation.
            </span>
            <span className="text-xs font-normal text-amber-600/80">
              You will not be able to undo it. please make sure you have a backup of your data
              before proceeding.
            </span>
          </div>
        </div>
      )}

      {!isRunning && !isCompleted && (
        <div className="flex flex-col items-end justify-center w-full gap-1">
          <SimpleButton variant="outline" label="Start Processing" onClick={onOrganizeClick} />
        </div>
      )}
    </div>
  )
}
