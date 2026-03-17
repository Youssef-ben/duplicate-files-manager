import { app } from 'electron'
import path from 'path'

export function getCliPath(): string {
  const exe = process.platform === 'win32' ? 'library-organizer.exe' : 'library-organizer'
  return app.isPackaged
    ? path.join(process.resourcesPath, exe)
    : path.join(app.getAppPath(), 'resources', exe)
}
