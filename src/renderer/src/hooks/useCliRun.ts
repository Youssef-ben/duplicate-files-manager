import type { CliRunArgs, ProgressEvent, SummaryEvent } from '@handlers/cli'
import { useCliStore } from '@stores/cliStore'
import { useEffect } from 'react'

interface UseCliRunResult {
  run: (args: CliRunArgs) => void
  stop: () => void
  status: 'idle' | 'running' | 'done' | 'error'
  progress: ProgressEvent | null
  summary: SummaryEvent | null
}

export function useCliRun(): UseCliRunResult {
  const { start, handleEvent, cancel, status, progress, summary } = useCliStore()

  useEffect(() => {
    const unsubscribe = window.appApi.cli.onProgress(handleEvent)
    return unsubscribe
  }, [handleEvent])

  const run = (args: CliRunArgs): void => {
    if (!args.runId) {
      args.runId = crypto.randomUUID()
    }
    start(args.runId)
    window.appApi.cli.run(args)
  }

  const stop = (): void => {
    const runId = useCliStore.getState().runId
    if (runId) {
      window.appApi.cli.cancel(runId)
      cancel()
    }
  }

  return { run, stop, status, progress, summary }
}
