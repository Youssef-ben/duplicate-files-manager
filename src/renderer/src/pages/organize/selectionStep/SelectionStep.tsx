import { FolderSelection, ScanningSummary, StepProgress } from '@components/steps';
import { SelectionHeader } from './selectionHeader';
import { useFolderSelection } from './useFolderSelection';

export const SelectionStep = (): React.JSX.Element => {
  const {
    step,
    folder,
    progress,
    isRunning,
    isCompleted,
    handleOnResetClick,
    handleOnFolderSelected,
    handleOnBrowseClick
  } = useFolderSelection();

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      <SelectionHeader folderPath={folder} status={step.status} onResetClick={handleOnResetClick} />

      {!folder && (
        <FolderSelection
          tips={{
            title: 'Organization Tips'
          }}
          handleOnFolderSelected={handleOnFolderSelected}
          handleOnBrowseClick={handleOnBrowseClick}
        />
      )}

      {isRunning && !isCompleted && (
        <StepProgress startedAtMs={step.startedAtMs ?? 0} progress={progress} />
      )}

      {isCompleted && (
        <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
          <ScanningSummary result={step.result} />
        </div>
      )}
    </div>
  );
};
