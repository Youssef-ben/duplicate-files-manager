import { useOpenFolderDialog } from '@hooks/useOpenFolderDialog';
import { useCallback } from 'react';
import { StepSelector, useOrganizeStore } from '../store/organizeStore';

interface UseOutputStepResult {
  hasSelection: boolean;
  selectedPath: string;
  handleOnFolderSelected: (path?: string) => void;
  handleOnBrowseClick: () => Promise<void>;
  handleOnSkipClick: () => void;
  handleOnClearClick: () => void;
}

export const useOutputStep = (): UseOutputStepResult => {
  const { openFolder } = useOpenFolderDialog();
  const { outputFolderPath, setOutputFolderPath } = useOrganizeStore();
  const { complete, reset } = useOrganizeStore(StepSelector('output'));

  const handleOnFolderSelected = useCallback(
    (path?: string): void => {
      setOutputFolderPath(path);
      complete({ path: path });
    },
    [setOutputFolderPath, complete]
  );

  const handleOnBrowseClick = useCallback(async (): Promise<void> => {
    const path = await openFolder();
    if (!path) return;

    handleOnFolderSelected(path);
  }, [openFolder, handleOnFolderSelected]);

  const handleOnSkipClick = useCallback(() => {
    handleOnFolderSelected(undefined);

    setTimeout(() => {
      const nextButton = document.getElementById('wizard-next');
      nextButton?.click();
    }, 200);
  }, [handleOnFolderSelected]);

  const handleOnClearClick = useCallback(() => {
    setOutputFolderPath('');
    reset();
  }, [setOutputFolderPath, reset]);

  return {
    hasSelection: !!outputFolderPath,
    selectedPath: outputFolderPath ?? '',
    handleOnFolderSelected,
    handleOnBrowseClick,
    handleOnSkipClick,
    handleOnClearClick
  };
};
