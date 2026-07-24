export type SupportedTheme = 'dark' | 'light' | 'nord' | 'catppuccin-mocha';
export type ThemePreference = SupportedTheme | 'system';

export type ThemeStoreSchema = {
  theme: {
    selected: ThemePreference;
  };
};

export type ThemeSnapshot = {
  preference: ThemeStoreSchema;
  resolved: ThemePreference;
};

export type ThemeApi = {
  getTheme: () => Promise<ThemeSnapshot>;
  setTheme: (theme: ThemePreference) => void;
  onThemeChanged: (callback: (theme: SupportedTheme) => void) => () => void;
};

export interface ThemeSwatch {
  id: ThemePreference;
  label: string;
  swatches: string[];
}

export const THEMES_SWATCHES: ThemeSwatch[] = [
  { id: 'system', label: 'System', swatches: ['#fafafa', '#21252b'] },
  { id: 'light', label: 'Light', swatches: ['#fafafa', '#edeff1', '#006a61'] },
  { id: 'dark', label: 'Dark', swatches: ['#21252b', '#36393a', '#006a61'] },
  { id: 'nord', label: 'Nord', swatches: ['#2e3440', '#3b4252', '#88c0d0'] },
  {
    id: 'catppuccin-mocha',
    label: 'Catppuccin Mocha',
    swatches: ['#1e1e2e', '#313244', '#cba6f7']
  }
];
