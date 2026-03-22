import { BrowserWindow, dialog, ipcMain, ipcRenderer, webUtils } from 'electron'
import { GLOBAL_CHANNELS } from './channels'
import { GlobalApi } from './types'

/**
 * Registers the global IPC handlers for the application.
 */
export function registerGlobal(win: BrowserWindow): void {
  ipcMain.handle(GLOBAL_CHANNELS.DIALOG_OPEN_FOLDER, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    return canceled ? null : filePaths[0]
  })
}

/**
 * Returns the global API for the preload layer.
 */
export function globalPreload(): GlobalApi {
  return {
    openFolder: () => ipcRenderer.invoke(GLOBAL_CHANNELS.DIALOG_OPEN_FOLDER),
    getPathForFile: (folder: File): string => webUtils.getPathForFile(folder)
  }
}
