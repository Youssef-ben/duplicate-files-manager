import type { CliRunArgs, CliEvent } from '@main/cli/types'

export {}
declare global {
  interface Window {
    api: {
      openFolder: () => Promise<string | null>
      cliRun: (args: CliRunArgs) => void
      cliCancel: (runId: string) => void
      onCliProgress: (cb: (e: CliEvent) => void) => () => void
    }
  }
}
