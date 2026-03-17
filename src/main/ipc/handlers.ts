import { ipcMain, dialog, BrowserWindow } from 'electron'
import { CH } from './channels'
import { runCli, cancelCli } from '../cli/runner'
import type { CliRunArgs } from '../cli/types'

export function registerHandlers(win: BrowserWindow): void {
  ipcMain.handle(CH.DIALOG_OPEN_FOLDER, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    return canceled ? null : filePaths[0]
  })

  ipcMain.on(CH.CLI_RUN, (_e, args: CliRunArgs) => {
    runCli(args, (event) => win.webContents.send(CH.CLI_PROGRESS, event))
  })

  ipcMain.on(CH.CLI_CANCEL, (_e, runId: string) => {
    cancelCli(runId)
  })
}
