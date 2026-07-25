import { BrowserWindow, ipcMain, ipcRenderer, nativeTheme } from 'electron';
import { THEME_CHANNELS } from './channels';
import {
  convertToSystemTheme,
  getCurrentPreference,
  resolveTheme,
  setCurrentPreference
} from './theme.store';
import type { SupportedTheme, ThemeApi, ThemePreference, ThemeSnapshot } from './types';

function broadcastThemeChange(): void {
  const { theme } = getCurrentPreference();
  const resolved = resolveTheme(theme.selected);

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(THEME_CHANNELS.CHANGED, resolved);
  });
}

/**
 * Registers the theme IPC handlers for the application.
 */
export function registerTheme(): void {
  const { theme } = getCurrentPreference();

  nativeTheme.themeSource = convertToSystemTheme(theme.selected);

  ipcMain.handle(THEME_CHANNELS.GET, (): ThemeSnapshot => {
    const { theme: t } = getCurrentPreference();
    return {
      preference: {
        theme: {
          selected: resolveTheme(t.selected)
        }
      },
      resolved: t.selected
    };
  });

  ipcMain.on(THEME_CHANNELS.SET, (_event, pref: ThemePreference) => {
    setCurrentPreference(pref);
    nativeTheme.themeSource = convertToSystemTheme(pref);
    broadcastThemeChange();
  });

  nativeTheme.on(THEME_CHANNELS.UPDATED, () => {
    broadcastThemeChange();
  });
}

/**
 * Returns the theme API for the preload layer.
 */
export function themePreload(): ThemeApi {
  return {
    getTheme: () => ipcRenderer.invoke(THEME_CHANNELS.GET),
    setTheme: (theme: ThemePreference) => ipcRenderer.send(THEME_CHANNELS.SET, theme),
    onThemeChanged: (callback: (theme: SupportedTheme) => void) => {
      ipcRenderer.on(THEME_CHANNELS.CHANGED, (_e, theme) => callback(theme));
      return () => ipcRenderer.removeAllListeners(THEME_CHANNELS.CHANGED);
    }
  };
}
