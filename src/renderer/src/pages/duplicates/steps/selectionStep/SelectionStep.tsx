import { FolderSelection, ScanningSummary, StepLoader, StepProgress } from '@components/steps'
import { useMemo } from 'react'
import { SelectionHeader } from './selectionHeader'
import { useFolderSelection } from './useFolderSelection'

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
  } = useFolderSelection()

  const progressComponent = useMemo(() => {
    return progress ? (
      <StepProgress startedAtMs={step.startedAtMs ?? 0} progress={progress} />
    ) : (
      <StepLoader />
    )
  }, [progress, step.startedAtMs])

  return (
    <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
      <SelectionHeader folderPath={folder} status={step.status} onResetClick={handleOnResetClick} />

      {!folder && (
        <FolderSelection
          tips={{
            title: 'Duplicates Finder Tips'
          }}
          handleOnFolderSelected={handleOnFolderSelected}
          handleOnBrowseClick={handleOnBrowseClick}
        />
      )}

      {isRunning && !isCompleted && progressComponent}

      {isCompleted && (
        <div className="flex min-h-0 flex-1 flex-col w-full gap-4">
          <ScanningSummary result={step.result} />
        </div>
      )}
    </div>
  )
}
