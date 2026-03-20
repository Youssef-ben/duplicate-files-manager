export type SupportedTheme = 'dark' | 'light' | 'nord' | 'catppuccin-mocha'
export type ThemePreference = SupportedTheme | 'system'

export type ThemeStoreSchema = {
  theme: {
    selected: ThemePreference
  }
}

export type ThemeSnapshot = {
  preference: ThemeStoreSchema
  resolved: ThemePreference
}

export type ThemeApi = {
  getTheme: () => Promise<ThemeSnapshot>
  setTheme: (theme: ThemePreference) => void
  onThemeChanged: (callback: (theme: SupportedTheme) => void) => () => void
}

export interface ThemeSwatch {
  id: ThemePreference
  label: string
  swatches: string[]
}

export const THEMES_SWATCHES: ThemeSwatch[] = [
  { id: 'system', label: 'System', swatches: ['#fafafa', '#282c34'] },
  { id: 'light', label: 'Light', swatches: ['#fafafa', '#f0f0f0', '#1769BF'] },
  { id: 'dark', label: 'Dark', swatches: ['#282c34', '#3e4451', '#61afef'] },
  { id: 'nord', label: 'Nord', swatches: ['#2e3440', '#3b4252', '#88c0d0'] },
  {
    id: 'catppuccin-mocha',
    label: 'Catppuccin Mocha',
    swatches: ['#1e1e2e', '#313244', '#cba6f7']
  }
]
