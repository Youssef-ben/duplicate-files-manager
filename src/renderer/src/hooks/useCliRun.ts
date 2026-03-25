import type { CliRunArgs, ProgressEvent, SummaryEvent } from '@handlers/cli'
import { useCliStore } from '@stores/cliStore'
import { useCallback, useEffect } from 'react'

interface UseCliRunResult {
  runnerId: string | null
  runnerStatus: 'IDLE' | 'RUNNING' | 'DONE' | 'ERROR'
  progress: ProgressEvent | null
  summary: SummaryEvent | null

  run: (args: CliRunArgs) => void
  stop: () => void
  resetRunner: () => void
}

export function useCliRun(): UseCliRunResult {
  const { runId, start, handleEvent, cancel, status, progress, summary, reset } = useCliStore()

  useEffect(() => {
    const unsubscribe = window.appApi.cli.onProgress(handleEvent)
    return unsubscribe
  }, [handleEvent])

  const run = useCallback(
    (args: CliRunArgs): void => {
      if (!args.runId) {
        args.runId = crypto.randomUUID()
      }
      start(args.runId)
      window.appApi.cli.run(args)
    },
    [start]
  )

  const stop = useCallback((): void => {
    const runId = useCliStore.getState().runId
    if (runId) {
      window.appApi.cli.cancel(runId)
      cancel()
    }
  }, [cancel])

  const resetRunner = useCallback((): void => {
    stop()
    reset()
  }, [reset, stop])

  return {
    runnerId: runId,
    runnerStatus: status,
    progress,
    summary,
    run,
    stop,
    resetRunner
  }
}
