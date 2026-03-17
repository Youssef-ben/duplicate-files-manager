---
name: react-theme-switcher-component
overview: Create a ThemeSwitcher React component that uses the existing theme context to let users pick a theme preference, styled with Tailwind v4 tokens, and export it via an index file.
todos:
  - id: create-theme-switcher-component
    content: Implement src/renderer/src/components/ThemeSwitcher/ThemeSwitcher.tsx using useTheme, THEMES config, Tailwind token utilities, and the specified grid/card behavior.
    status: completed
  - id: export-theme-switcher-index
    content: Create src/renderer/src/components/ThemeSwitcher/index.ts to re-export ThemeSwitcher as named and default export.
    status: completed
isProject: false
---

### Goals

- **Expose a reusable ThemeSwitcher component** that drives the existing `ThemeProvider` / Electron theme system through `useTheme`.
- **Render a responsive swatch grid** using Tailwind v4 utilities and the color tokens from `themes.css`.
- **Keep scope minimal**: only add the ThemeSwitcher component and an index re-export; no new routes or pages.

### Files to Create/Update

- **Create** `[src/renderer/src/components/ThemeSwitcher/ThemeSwitcher.tsx](src/renderer/src/components/ThemeSwitcher/ThemeSwitcher.tsx)`
- **Create** `[src/renderer/src/components/ThemeSwitcher/index.ts](src/renderer/src/components/ThemeSwitcher/index.ts)`

### Detailed Plan

- **1. Define the themes model in the component**
  - Inside `ThemeSwitcher.tsx`, hardcode the `THEMES` array exactly as specified:

```ts
    const THEMES = [
      { id: 'system',           label: 'System',          swatches: ['#fafafa', '#1e1e2e'] },
      { id: 'light',            label: 'Light',           swatches: ['#fafafa', '#ffffff', '#4f46e5'] },
      { id: 'dark',             label: 'Dark',            swatches: ['#282c34', '#3e4451', '#61afef'] },
      { id: 'catppuccin-mocha', label: 'Catppuccin Mocha', swatches: ['#1e1e2e', '#313244', '#cba6f7'] },
      { id: 'nord',             label: 'Nord',            swatches: ['#2e3440', '#3b4252', '#88c0d0'] },
      { id: 'one-dark',         label: 'One Dark',        swatches: ['#282c34', '#3e4451', '#61afef'] },
    ] as const
    

```

- Type `id` as `ThemePreference` where appropriate so TS keeps the mapping aligned with the shared theme types.
- **2. Wire into the theme context with `useTheme`**
  - Import `useTheme` and `ThemePreference`:
    - `import { useTheme } from '../theme/useTheme'` (or via alias if available, e.g. `@renderer/theme`).
    - `import type { ThemePreference } from '@shared/theme.types'`.
  - Call `const { preference, setTheme } = useTheme()` inside the component.
  - When a user clicks a theme card, immediately invoke `setTheme(themeId as ThemePreference)`; no extra confirmation step.
- **3. Implement card selection and active state**
  - Determine if a theme is active via `const isActive = preference === theme.id`.
  - For the card container, build a Tailwind class string that:
    - Always uses token-based colors: `bg-surface`, `text-text`, `border-muted`, etc.
    - Adds an active ring when selected: `ring-2 ring-accent`.
    - Provides hover feedback: e.g. `hover:scale-[1.02] transition-transform` or `hover:border-subtle`.
  - Ensure the card itself doesn’t enforce a global background; it should work on any parent.
- **4. Swatch layout per theme**
  - **System card**:
    - Render a special container for `id === 'system'`:
      - A small square or rounded-rectangle with two halves (e.g. using `flex` and two children) where left uses the first swatch, right uses the second.
      - Use inline background colors for the tiny swatch blocks only: `style={{ backgroundColor: swatches[0] }}`.
  - **Other themes**:
    - Use a consistent card area, e.g. `h-20 w-full rounded-md overflow-hidden flex`.
    - Render each `swatch` entry as a flex child that fills horizontally, creating horizontal stripes.
    - Swatches may use inline styles for `backgroundColor` but card frame still uses Tailwind token utilities.
- **5. Grid layout and outer wrapper**
  - The outer `ThemeSwitcher` wrapper should:
    - Be a simple container, e.g. `div` with `grid grid-cols-3 gap-4`.
    - Avoid hard-coded width; rely on parent container sizing.
    - Use typography utilities where needed, e.g. `text-text text-sm` and `mt-2` below each card for the label.
  - Each card + label sits in a `div` within the grid.
- **6. Component API and exports**
  - `ThemeSwitcher.tsx`:
    - Export a single React component `ThemeSwitcher` that renders the described grid.
    - Optionally allow passing `className?: string` to extend styles, but keep it simple unless unnecessary.
  - `index.ts`:
    - Re-export the component both as default and named export:

```ts
      export { ThemeSwitcher } from './ThemeSwitcher'
      export default ThemeSwitcher
      

```

### Usage Notes

- The `ThemeSwitcher` can be imported into any Settings page later as `import ThemeSwitcher from '@renderer/components/ThemeSwitcher'` (once path alias or barrel files are set up).
- Because it only relies on `useTheme` and Tailwind tokens, it will automatically respect the current `ThemeProvider` and CSS theme variables without further wiring.

### Implementation Todos

- **create-theme-switcher-component**: Implement `ThemeSwitcher.tsx` with `THEMES` config, `useTheme` wiring, swatch cards, active and hover state, and token-based Tailwind classes.
- **export-theme-switcher-index**: Create `index.ts` that re-exports `ThemeSwitcher` as both a named and default export.

