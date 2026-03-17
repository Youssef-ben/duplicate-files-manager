import { useEffect } from 'react'
import { useCliStore } from '../stores/cliStore'
import type { CliRunArgs } from '../../../main/cli/types'

export function useCliRun() {
  const { start, handleEvent, cancel, status, progress, summary } = useCliStore()

  useEffect(() => {
    const unsub = window.api.onCliProgress(handleEvent)
    return unsub
  }, [handleEvent])

  const run = (args: CliRunArgs) => {
    const runId = crypto.randomUUID()
    start(runId)
    window.api.cliRun({ ...args, runId })
  }

  const stop = () => {
    const runId = useCliStore.getState().runId
    if (runId) { window.api.cliCancel(runId); cancel() }
  }

  return { run, stop, status, progress, summary }
}
