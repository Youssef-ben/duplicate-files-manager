import { DetailsCard } from '@components/detailsCard';
import { FolderSelector } from '@components/folderSelector';
import { FolderIcon } from '@heroicons/react/24/outline';
import { OutputHeader } from './outputHeader';
import { useOutputStep } from './useOutputStep';

export const OutputStep = (): React.JSX.Element => {
  const {
    hasSelection,
    selectedPath,
    handleOnFolderSelected,
    handleOnBrowseClick,
    handleOnSkipClick,
    handleOnClearClick
  } = useOutputStep();

  return (
    <div className="flex flex-col w-full gap-4 h-full">
      {/* Header */}
      <OutputHeader
        hasSelection={hasSelection}
        handleOnSkipClick={handleOnSkipClick}
        handleOnClearClick={handleOnClearClick}
      />

      {/* Content */}
      {!hasSelection && (
        <div className="flex flex-col items-center justify-center w-full gap-2 h-full ">
          <FolderSelector
            title="Output Folder"
            description="Drag a folder here or click to browse."
            onFolderSelected={handleOnFolderSelected}
            onClick={handleOnBrowseClick}
          />
        </div>
      )}

      {hasSelection && (
        <div className="flex flex-row items-start justify-center w-full gap-2 px-2 py-2">
          <DetailsCard isPath title="Output Folder" value={selectedPath} icon={FolderIcon} />
        </div>
      )}
    </div>
  );
};
