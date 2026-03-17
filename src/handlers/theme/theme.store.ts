import { nativeTheme } from 'electron'
import ElectronStore from 'electron-store'
import type { SupportedTheme, ThemePreference, ThemeStoreSchema } from './types'

interface ElectronStoreCtor {
  default?: typeof ElectronStore
}
const StoreCtor = (ElectronStore as unknown as ElectronStoreCtor).default ?? ElectronStore

const DEFAULT_PREFERENCES: ThemeStoreSchema = {
  theme: {
    selected: 'system'
  }
}

const store = new StoreCtor<ThemeStoreSchema>({
  name: 'settings',
  defaults: DEFAULT_PREFERENCES
})

export function getCurrentPreference(): ThemeStoreSchema {
  return store.get('preferences', DEFAULT_PREFERENCES)
}

export function setCurrentPreference(pref: ThemePreference): void {
  store.set('preferences.theme.selected', pref)
}

export function convertToSystemTheme(pref: ThemePreference): 'dark' | 'light' | 'system' {
  const name = pref.toLowerCase()

  if (name.includes('dark') || name.includes('nord') || name.includes('catppuccin-mocha')) {
    return 'dark'
  }

  if (name.includes('light')) {
    return 'light'
  }

  return 'system'
}

export function resolveTheme(pref: ThemePreference): SupportedTheme {
  if (pref === 'system') {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  }

  return pref
}
