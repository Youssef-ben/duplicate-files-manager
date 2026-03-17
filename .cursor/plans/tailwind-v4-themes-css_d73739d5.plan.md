---
name: tailwind-v4-themes-css
overview: Add Tailwind v4 theme tokens and per-theme color values in a single CSS file, without adding any components or switching logic.
todos:
  - id: create-themes-css
    content: Create src/renderer/styles/themes.css with @theme block, :root default (light), and all [data-theme="..."] overrides for catppuccin-mocha, nord, one-dark, dark, and light
    status: completed
  - id: import-themes-css
    content: Import ./themes.css from src/renderer/styles/index.css so Tailwind picks up tokens and the renderer loads theme CSS
    status: completed
isProject: false
---

### Goals

- **Define Tailwind v4 theme tokens** for all required color roles using `@theme`.
- **Provide concrete color values per theme** using `[data-theme="..."]` attribute selectors.
- **Set a default theme on `:root`** that mirrors the `light` theme so the app always has baseline colors.
- **Keep scope CSS-only** with no React, JS, or IPC changes.

### Files to Create/Update

- **Create** `[src/renderer/styles/themes.css](src/renderer/styles/themes.css)`
- **Update** `[src/renderer/styles/index.css](src/renderer/styles/index.css)` to `@import "./themes.css"` near the top.

### Detailed Plan

- **1. Declare Tailwind theme tokens via `@theme`**
  - In `src/renderer/styles/themes.css`, add a top-level `@theme` block that declares all tokens with `initial` values, exactly as specified:
    - `--color-base`, `--color-mantle`, `--color-surface`, `--color-overlay`
    - `--color-muted`, `--color-subtle`, `--color-text`
    - `--color-accent`, `--color-accent-alt`
    - `--color-success`, `--color-warning`, `--color-error`, `--color-info`
  - This ensures Tailwind v4 picks up the tokens and generates corresponding utilities.
- **2. Define the default `:root` theme (mirroring `light`)**
  - Still in `themes.css`, add a `:root { ... }` block.
  - Set each `--color-*` variable to the `light` theme values provided:
    - `--color-base: #fafafa;`, `--color-mantle: #f0f0f0;`, `--color-surface: #ffffff;`, `--color-overlay: #e5e5e5;`
    - `--color-muted: #9ca3af;`, `--color-subtle: #6b7280;`, `--color-text: #111827;`
    - `--color-accent: #4f46e5;`, `--color-accent-alt: #7c3aed;`
    - `--color-success: #16a34a;`, `--color-warning: #d97706;`, `--color-error: #dc2626;`, `--color-info: #0284c7;`
  - This guarantees sane colors even if no `data-theme` attribute is present.
- **3. Add per-theme `[data-theme="..."]` blocks**
  - For each named theme, create a `:root[data-theme="theme-name"] { ... }` block in `themes.css` and override all tokens with the provided values.
  - `**catppuccin-mocha`**:
    - `:root[data-theme="catppuccin-mocha"] { --color-base: #1e1e2e; ... }` using all the given colors.
  - `**nord`**:
    - `:root[data-theme="nord"] { ... }` with the Nord palette values.
  - `**one-dark`**:
    - `:root[data-theme="one-dark"] { ... }` using the One Dark values.
  - `**dark`** (system dark):
    - `:root[data-theme="dark"] { ... }` mirroring the `one-dark` values exactly (duplicate assignments for clarity and future independence).
  - `**light**` (system light):
    - `:root[data-theme="light"] { ... }` mirroring the same values as the default `:root` block.
  - Ensure each block sets **all** tokens so switching themes is complete and predictable.
- **4. Wire themes.css into Tailwind via index.css**
  - Open `src/renderer/styles/index.css`.
  - At the top (after Tailwind base directives if present), add:
    - `@import "./themes.css";`
  - This makes sure Tailwind sees the `@theme` block during compilation and that the runtime CSS variables are loaded in the renderer.

### Usage Notes (for future implementation)

- Components can later rely on Tailwind utilities that map to these tokens (per Tailwind v4 semantics) or directly use the CSS variables via `var(--color-*)`.
- Theme switching can be implemented separately by toggling `data-theme` on `document.documentElement` (not part of this task).

