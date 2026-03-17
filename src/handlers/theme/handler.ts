import { BrowserWindow, ipcMain, ipcRenderer, nativeTheme } from 'electron'
import { THEME_CHANNELS } from './channels'
import {
  convertToSystemTheme,
  getCurrentPreference,
  resolveTheme,
  setCurrentPreference
} from './theme.store'
import type { SupportedTheme, ThemeApi, ThemePreference } from './types'

function broadcastThemeChange(): void {
  const pref = getCurrentPreference()
  const resolved = resolveTheme(pref.theme.selected)

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(THEME_CHANNELS.CHANGED, resolved)
  })
}

/**
 * Registers the theme IPC handlers for the application.
 */
export function registerTheme(): void {
  const {
    theme: { selected: initialPreference }
  } = getCurrentPreference()

  nativeTheme.themeSource = convertToSystemTheme(initialPreference)

  ipcMain.handle(THEME_CHANNELS.GET, () => {
    const {
      theme: { selected: pref }
    } = getCurrentPreference()
    return resolveTheme(pref)
  })

  ipcMain.on(THEME_CHANNELS.SET, (_event, pref: ThemePreference) => {
    setCurrentPreference(pref)
    nativeTheme.themeSource = convertToSystemTheme(pref)
    broadcastThemeChange()
  })

  nativeTheme.on(THEME_CHANNELS.UPDATED, () => {
    broadcastThemeChange()
  })
}

/**
 * Returns the theme API for the preload layer.
 */
export function themePreload(): ThemeApi {
  return {
    getTheme: () => ipcRenderer.invoke(THEME_CHANNELS.GET),
    setTheme: (theme: ThemePreference) => ipcRenderer.send(THEME_CHANNELS.SET, theme),
    onThemeChanged: (callback: (theme: SupportedTheme) => void) => {
      ipcRenderer.on(THEME_CHANNELS.CHANGED, (_e, theme) => callback(theme))
      return () => ipcRenderer.removeAllListeners(THEME_CHANNELS.CHANGED)
    }
  }
}
