---
name: FlattenBeforeAfter
overview: Replace the placeholder in `FlattenFolder.tsx` with the screenshot-style Before/After staging preview UI (static placeholder content).
todos:
  - id: flatten-ui-replace-placeholder
    content: 'Edit `src/renderer/src/pages/organize/flattenFolder/FlattenFolder.tsx`: replace the placeholder div with the screenshot-style Before/After preview layout (static placeholder content) and add necessary Heroicons imports.'
    status: completed
  - id: flatten-ui-style-fit
    content: Ensure the new preview section uses existing layout conventions from organize pages (min-h-0/overflow handling, `bg-surface` cards, `shadow-card`, typography tokens) so it fits within the wizard step.
    status: completed
  - id: flatten-ui-lint
    content: After code changes, run `ReadLints` for the edited file to confirm no new linter/TS diagnostics were introduced.
    status: completed
isProject: false
---

## Goal

Implement the exact screenshot-like Before/After section inside `FlattenFolder.tsx` (while still using static placeholder data, not wiring to CLI/state).

## Implementation details

- Update `src/renderer/src/pages/organize/flattenFolder/FlattenFolder.tsx`.
- Replace the placeholder block currently at the bottom of the component:
  - From `Should have a section to show what will happen like a before and after view.`
  - To a new responsive 3-column layout: **Before tree (left card)** + **arrow (center)** + **Flattened/staging output (right card)**.
- Use existing Tailwind/theme tokens that are already used in the organize flow:
  - `bg-surface`, `bg-surface-bright`, `shadow-card`, `rounded-md`, `border-outline-variant`
  - `text-primary`, `text-outline-dim`, `text-on-surface-variant`
  - `bg-primary-container` for the `HOSTED` chips.
- Reuse the same “tree-like” visual approach already present in other organize panels (indentation + folder/file icons), but keep it static for now.
- Add Heroicons (from `@heroicons/react/24/outline`) for:
  - left tree icons (`FolderIcon`, `PhotoIcon`, `DocumentTextIcon`)
  - center arrow (`ArrowLongRightIcon`)
  - right-side notice/iconography.
- Ensure the new section fits inside the wizard content area:
  - add `min-h-0` and `overflow-hidden` on the row container
  - add `overflow-y-auto` on the left/right tree/message areas if needed.

## Files to change

- `src/renderer/src/pages/organize/flattenFolder/FlattenFolder.tsx`

## Acceptance criteria

- The UI renders a side-by-side Before/After preview matching the screenshot’s overall layout (cards + arrow + hosted rows + notice box).
- No TypeScript errors, and the app builds with the new imports/classes.
