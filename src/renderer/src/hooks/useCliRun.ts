import { useEffect } from 'react'
import { useCliStore } from '@stores/cliStore'
import type { CliRunArgs, ProgressEvent, SummaryEvent } from '@main/cli/types'

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
    const unsubscribe = window.api.onCliProgress(handleEvent)
    return unsubscribe
  }, [handleEvent])

  const run = (args: CliRunArgs): void => {
    const runId = crypto.randomUUID()
    start(runId)
    window.api.cliRun({ ...args, runId })
  }

  const stop = (): void => {
    const runId = useCliStore.getState().runId
    if (runId) {
      window.api.cliCancel(runId)
      cancel()
    }
  }

  return { run, stop, status, progress, summary }
}
