import { DuplicatesFile } from '@handlers/cli/types/duplicates.mode';

export function findGroupContainingPath(
  groups: Record<string, DuplicatesFile[]>,
  filePath: string
): { hash: string; files: DuplicatesFile[]; file: DuplicatesFile } | undefined {
  for (const [hash, files] of Object.entries(groups)) {
    const file = files.find((f) => f.path === filePath);
    if (file) {
      return { hash, files, file };
    }
  }
  return undefined;
}

/** Whether flagging or removing this file still leaves at least one unselected file in the group. */
export function canActOnUnselectedFile(files: DuplicatesFile[], file: DuplicatesFile): boolean {
  if (file.is_flagged) return true;
  return files.filter((f) => !f.is_flagged).length > 1;
}

/** Keeps selection valid when the current hash disappears from `groups`. */
export function resolveSelectedGroupHash(
  groups: Record<string, DuplicatesFile[]>,
  selectedGroup: string
): string {
  const hashes = Object.keys(groups);
  if (hashes.length === 0) return '';
  if (groups[selectedGroup]) return selectedGroup;
  return hashes[0] ?? '';
}

/** Drops one file; removes the whole group if at most one file would remain. */
export function removeFileFromGroup(
  prev: Record<string, DuplicatesFile[]>,
  hash: string,
  filePath: string
): Record<string, DuplicatesFile[]> {
  const currentFiles = prev[hash];
  if (!currentFiles) return prev;

  const remaining = currentFiles.filter((file) => file.path !== filePath);
  if (remaining.length <= 1) {
    return Object.fromEntries(Object.entries(prev).filter(([key]) => key !== hash));
  }

  return {
    ...prev,
    [hash]: remaining
  };
}
