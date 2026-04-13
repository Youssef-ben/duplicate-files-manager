import { CliMenu } from '@handlers/cli/types'
import { app, BrowserWindow, dialog, ipcMain, ipcRenderer, shell, webUtils } from 'electron'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
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

  ipcMain.handle(
    GLOBAL_CHANNELS.WRITE_JSON_FILE,
    async <T>(_e: unknown, name: string, menu: CliMenu, data: T): Promise<string> => {
      const outputPath = path.join(app.getPath('userData'), 'results', menu, `${name}.json`)

      mkdirSync(path.dirname(outputPath), { recursive: true })
      writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8')
      return outputPath
    }
  )

  ipcMain.handle(
    GLOBAL_CHANNELS.READ_JSON_FILE,
    async <T>(_e: unknown, name: string, filePath?: string): Promise<T> => {
      const jsonPath = filePath ?? path.join(app.getPath('userData'), `results/${name}.json`)
      if (!existsSync(jsonPath)) {
        throw new Error(`File not found: [${jsonPath}]`)
      }
      return JSON.parse(readFileSync(jsonPath, 'utf8')) as T
    }
  )

  ipcMain.handle(GLOBAL_CHANNELS.REMOVE_FOLDER, async (_e: unknown, menu: CliMenu) => {
    const folderPath = path.join(app.getPath('userData'), `results/${menu}`)

    if (!existsSync(folderPath)) {
      throw new Error(`Folder not found: [${folderPath}]`)
    }

    rmSync(folderPath, { recursive: true })
  })

  ipcMain.handle(GLOBAL_CHANNELS.OPEN_FILE_PATH, async (_e: unknown, filePath: unknown) => {
    if (typeof filePath !== 'string' || !filePath.trim()) {
      throw new Error('Invalid path')
    }
    const message = await shell.openPath(filePath.trim())
    if (message) {
      throw new Error(message)
    }
  })
}

/**
 * Returns the global API for the preload layer.
 */
export function globalPreload(): GlobalApi {
  return {
    openFolder: () => ipcRenderer.invoke(GLOBAL_CHANNELS.DIALOG_OPEN_FOLDER),
    openFilePath: (filePath: string): Promise<void> =>
      ipcRenderer.invoke(GLOBAL_CHANNELS.OPEN_FILE_PATH, filePath),
    getPathForFile: (folder: File): string => webUtils.getPathForFile(folder),
    writeJsonFile: <T>(name: string, menu: CliMenu, data: T): Promise<string> =>
      ipcRenderer.invoke(GLOBAL_CHANNELS.WRITE_JSON_FILE, name, menu, data),
    readJsonFile: <T>(name: string, filePath?: string): Promise<T> =>
      ipcRenderer.invoke(GLOBAL_CHANNELS.READ_JSON_FILE, name, filePath),
    removeFolder: (menu: CliMenu): Promise<void> =>
      ipcRenderer.invoke(GLOBAL_CHANNELS.REMOVE_FOLDER, menu)
  }
}
