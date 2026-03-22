import { DropZone } from '@components/dropZone'
import { FolderIcon } from '@heroicons/react/24/solid'
import { mergeCls } from '@utils/ClassNameMerger'

export interface FolderSelectorProps {
  onFolderSelected: (path: string) => void
  onClick: () => void
}

export const FolderSelector = (props: FolderSelectorProps): React.JSX.Element => {
  return (
    <DropZone
      {...props}
      className="flex flex-col items-center justify-center w-[80%] lg:w-[50%] gap-4 p-8 h-[340px] mx-auto  "
    >
      <div className="flex flex-row items-center justify-center size-15 gap-1 rounded-md p-2">
        <FolderIcon className="size-13 text-primary" />
      </div>

      <div className="flex flex-col items-center justify-center w-full mb-4 ">
        <span className="text-xl font-bold text-primary">Target Directory</span>
        <span className="text-md text-outline-dim">Drag a folder here or click to browse.</span>
      </div>

      <button
        type="button"
        className={mergeCls(
          'flex w-fit flex-row items-center justify-center gap-1 rounded-md px-4 py-1 transition-colors',
          'group active:scale-95 cursor-pointer border border-primary bg-primary text-on-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim'
        )}
      >
        <span className="text-md group-hover:font-medium">Browse Folders</span>
      </button>
    </DropZone>
  )
}
