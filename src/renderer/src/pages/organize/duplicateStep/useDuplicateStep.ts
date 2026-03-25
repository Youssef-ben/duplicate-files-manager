import { CliRunArgs, ProgressEvent } from '@handlers/cli/types'
import { DuplicatesProgressSummary, DuplicatesResults } from '@handlers/cli/types/duplicates.mode'
import { useCliRun } from '@hooks/useCliRun'
import { useCallback, useEffect, useMemo } from 'react'
import { StepSelector, useOrganizeStore } from '../store/organizeStore'

interface UseDuplicateStepResult {
  result: DuplicatesResults | undefined
  isRunning: boolean
  isCompleted: boolean
  startedAtMs: number | undefined
  progress: ProgressEvent | null
  run: (args: CliRunArgs) => void
  handleStartProcess: () => void
}

export const useDuplicateStep = (): UseDuplicateStepResult => {
  const { getPath } = useOrganizeStore()

  const {
    stepRunnerId,
    status,
    result,
    startedAtMs,
    start,
    complete,
    reset: resetDuplicates
  } = useOrganizeStore(StepSelector('duplicates'))

  const { runnerId, summary, progress, run, resetRunner } = useCliRun()

  /**
   * On completion:
   * - Read the summary
   * - Set the summary
   * - Complete the step
   */
  useEffect(() => {
    if (!summary || status === 'COMPLETED' || stepRunnerId !== runnerId) return
    const { report_path } = summary as DuplicatesProgressSummary
    const results = window.appApi.cli.readSummaryResult<DuplicatesResults>(report_path)

    complete(results)
  }, [summary, status, stepRunnerId, runnerId, complete])

  useEffect(() => {
    if (!getPath()) window.location.reload()
  }, [getPath])

  const handleStartProcess = useCallback(() => {
    if (!getPath()) return

    // Reset the step store.
    resetDuplicates()
    resetRunner()

    queueMicrotask(() => {
      const newRunId = crypto.randomUUID()
      start(newRunId)
      run({
        runId: newRunId,
        mode: 'find-duplicate',
        sourceRoot: getPath()
      })
    })
  }, [start, run, resetDuplicates, resetRunner, getPath])

  return {
    result,
    isRunning: useMemo(() => status === 'RUNNING', [status]),
    isCompleted: useMemo(() => status === 'COMPLETED', [status]),
    startedAtMs,
    progress,
    run,
    handleStartProcess
  }
}
