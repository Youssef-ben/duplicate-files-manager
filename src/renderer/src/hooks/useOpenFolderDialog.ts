import { useCallback } from 'react';

export interface UseOpenFolderDialogData {
  openFolder: () => Promise<string | null>;
}

export function useOpenFolderDialog(): UseOpenFolderDialogData {
  const openFolder = useCallback(() => window.appApi.global.openFolder(), []);

  return { openFolder };
}
