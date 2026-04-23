import { FolderSelector } from '@components/folderSelector'
import { LightBulbIcon } from '@heroicons/react/24/outline'

export interface FolderSelectionProps {
  handleOnFolderSelected: (path: string) => void
  handleOnBrowseClick: () => void
  tips: {
    title: string
    items?: string[]
  }
}

const DEFAULT_TIPS = {
  title: 'Tips',
  items: [
    'You can drag and drop a folder inside the above box or click anywhere to browse.',
    'Selecting a parent folder will automatically index all sub-directories.'
  ]
}

export const FolderSelection = ({
  tips = DEFAULT_TIPS,
  handleOnFolderSelected,
  handleOnBrowseClick
}: FolderSelectionProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 h-full ">
      {/* Target Directory */}
      <FolderSelector
        title="Directory"
        description="Drag a folder here or click to browse."
        onFolderSelected={handleOnFolderSelected}
        onClick={handleOnBrowseClick}
      />

      {/* Notice */}
      <div className="mt-4 flex flex-col items-left justify-center w-fit gap-2 h-fit bg-surface px-4 py-2 border-l-6 border-primary ">
        <div className="flex flex-row items-center justify-left gap-2">
          <LightBulbIcon className="size-5 text-primary shrink-0" />
          <span className="text-sm font-semibold text-primary">
            {tips?.title ?? DEFAULT_TIPS.title}
          </span>
        </div>
        <ul className="text-xs text-on-secondary-container list-disc list-inside pl-8">
          {(tips?.items ?? DEFAULT_TIPS.items)?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
