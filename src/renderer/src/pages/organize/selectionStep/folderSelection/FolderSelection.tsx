import { FolderSelector } from '@components/folderSelector'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { useFolderSelection } from './useFolderSelection'

export const FolderSelection = (): React.JSX.Element => {
  const { handleOnFolderSelected, handleOnBrowseClick } = useFolderSelection()

  return (
    <div className="flex flex-col w-full gap-4 h-full">
      {/* Header */}
      <div className="flex flex-col items-left justify-center w-full gap-1">
        <span className="text-xl font-semibold text-primary">Start Organizing</span>
        <p className="text-sm text-outline-dim">
          Choose a root directory to begin the automated cleanup and organization process.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center w-full gap-2 h-full ">
        {/* Target Directory */}
        <FolderSelector
          title="Target Directory"
          description="Drag a folder here or click to browse."
          onFolderSelected={handleOnFolderSelected}
          onClick={handleOnBrowseClick}
        />

        {/* Notice */}
        <div className="mt-4 flex flex-col items-left justify-center w-fit gap-2 h-fit bg-surface px-4 py-2 border-l-6 border-primary ">
          <div className="flex flex-row items-center justify-left gap-2">
            <LightBulbIcon className="size-5 text-primary shrink-0" />
            <span className="text-sm font-semibold text-primary">Organization Tips</span>
          </div>
          <ul className="text-xs text-on-secondary-container list-disc list-inside pl-8">
            <li>
              You can drag and drop a folder inside the above box or click anywhere to browse.
            </li>
            <li>Selecting a parent folder will automatically index all sub-directories.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
