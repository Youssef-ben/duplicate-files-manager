import { app } from 'electron';
import path from 'path';

const CLI_BASE_NAME = 'library-organizer-cli';

/**
 * Absolute path to the library-organizer-cli binary.
 *
 * - Packaged: `<process.resourcesPath>/resources/<binary>`
 * - Development: `<app.getAppPath()>/resources/<binary>` (project root under electron-vite)
 */
export function getCliBinaryPath(): string {
  const name = process.platform === 'win32' ? `${CLI_BASE_NAME}.exe` : CLI_BASE_NAME;
  const root = app.isPackaged ? process.resourcesPath : app.getAppPath();
  return path.join(root, 'resources', name);
}
