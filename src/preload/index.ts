import { contextBridge, ipcRenderer } from 'electron'
import { CH } from '../main/ipc/channels'
import type { CliRunArgs, CliEvent } from '../main/cli/types'

contextBridge.exposeInMainWorld('api', {
  openFolder: (): Promise<string | null> =>
    ipcRenderer.invoke(CH.DIALOG_OPEN_FOLDER),

  cliRun: (args: CliRunArgs): void =>
    ipcRenderer.send(CH.CLI_RUN, args),

  cliCancel: (runId: string): void =>
    ipcRenderer.send(CH.CLI_CANCEL, runId),

  onCliProgress: (cb: (e: CliEvent) => void) => {
    ipcRenderer.on(CH.CLI_PROGRESS, (_e, event) => cb(event))
    return () => ipcRenderer.removeAllListeners(CH.CLI_PROGRESS)
  },
})
