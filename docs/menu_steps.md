# Menu Steps

This document describes all the steps for each menu in the app.

## History

| Date       | Change                                                   |
| ---------- | -------------------------------------------------------- |
| 2026-03-22 | Initial Document                                         |
| 2026-03-22 | Expanded Organize section (wizard steps, safety, layout) |
| 2026-03-22 | Expanded Duplicates section (goal, flow, steps, safety)  |
| 2026-03-22 | Expanded Synchronize section (goal, flow, steps, safety) |

## Dictionary

- Files: Images and Videos.

## Organize

### Goal

Take a messy folder tree, deduplicate safely, then lay files out in a predictable date-based structure without risking the original tree.

### Flow

The flow is presented as a wizard (see **Selection → Flatten → Duplicates → Confirm** in the UI):

1. **Selection** — Pick the root folder to organize (via the folder dialog). This is the scope for everything that follows.
2. **Flatten** — Copy or consolidate the tree into a **temporary working folder** so the source folder stays intact while duplicates and layout are figured out. Edits apply to the staging area, not the live library.
3. **Duplicates** — Run a duplicate scan on the **flattened** content. The app reports groups of identical files so the user can decide what to keep.
4. **Optional duplicate cleanup** — The user may remove extra copies (keep one file per duplicate group) so the organized result does not retain redundant files. Wording and actions here should stay aligned with **dry-run by default** and an explicit confirmation before any destructive step.
5. **Confirm** — User reviews a summary and approves the final organize step. Files are arranged under a **year / month** hierarchy derived from each file’s date (for example `2024/03-March/…`), using the pattern `yyyy/mm-MonthName` (four-digit year, two-digit month, full English month name).

**Outcome.** After confirmation, the library matches the chosen date-folder layout into an `organized` folder; earlier steps ensure the user sees duplicates and the staging workflow before anything irreversible happens.

### Steps

- **1.Selection**
- **2.Flattening**
- **3. Duplicate scan** · **3.1. Remove extra copies**
- **4.Confirm**

## Duplicates

Dedicated flow for finding and resolving duplicates **in place** (no flattening or date-based reorganize). Scope is still the media types called out in **Dictionary** (images and videos), unless the product later widens that.

### Goal

Scan a chosen folder tree for **duplicate files**, cluster identical content into groups, and let the user decide which paths to keep and which to remove—without implying that anything is deleted until they confirm.

### Flow

1. **Selection** — Pick the root folder to scan (folder dialog). Everything below that path is in scope for the run.
2. **Duplicate scan** — Walk the selected tree, hash or compare as the CLI defines, and build **duplicate groups** (same file content appearing in more than one path).
3. **Review & remove** — Present groups in the UI; within each group, the user marks paths to **remove** (typically keeping at least one copy). Deleting files is **irreversible**; match product rules: **dry-run / preview first**, then a clear **confirm** step before any real delete.

**Outcome.** After confirmation, only the selected paths are removed; unselected copies stay where they were.

### Steps

- **1. Selection**
- **2. Scan**
- **3. Review** · **3.1. Deletion**

## Synchronize

Keep two folder trees aligned by **copying files that exist on one side but not the other** (and optionally reconciling updates—exact rules depend on the CLI). Scope follows **Dictionary** unless extended later.

### Goal

Let the user pick **two roots** (call them **A** and **B**), see what differs between them, choose a **sync direction** (one-way **A → B**, one-way **B → A**, or **bidirectional** so each side receives what it is missing from the other), then apply only the operations they confirm.

### Flow

1. **Selection** — Choose folder **A** and folder **B** (e.g. two dialogs or a paired picker). These are the only trees involved in the run.
2. **Scan / compare** — Walk both trees (relative paths, sizes, hashes—per CLI) and build a **preview**: files present only under A, only under B, and any conflicts (same relative path but different content) if the tool reports them.
3. **Direction** — Pick how copies flow: **A → B** (fill gaps in B), **B → A** (fill gaps in A), or **bidirectional** (each side gets missing files from the other). The UI should make it obvious which way data moves.
4. **Review & sync** — From the preview, the user selects which planned copies (or moves) to run. **Dry-run / preview first**, then **confirm** before anything is written—consistent with the rest of the app.

**Outcome.** After confirmation, the chosen files exist on the target side(s); nothing else changes unless the user explicitly opts into deletes or overwrites in a later product iteration (document that separately if added).

### Steps

- **1. Selection** (folders **A** and **B**)
- **2. Scan / compare**
- **3. Direction** (one-way or bidirectional)
- **4. Review** · **4.1. Apply sync**
