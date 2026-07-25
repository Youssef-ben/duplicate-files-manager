import { registerCli, registerGlobal, registerTheme } from '@handlers/index';
import { BrowserWindow } from 'electron';

/**
 * Registers the IPC handlers for the application.
 */
export function registerHandlers(win: BrowserWindow): void {
  registerGlobal(win);
  registerCli(win);
  registerTheme();
}
