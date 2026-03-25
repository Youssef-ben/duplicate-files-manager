import { FolderMinusIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

export interface ClearFolderButtonProps {
  title?: string
  onClick: () => void
}
export const ClearFolderButton = ({
  title = 'Clear Folder',
  onClick
}: ClearFolderButtonProps): React.JSX.Element => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={mergeCls(
        'flex w-8 h-7 flex-row items-center justify-center gap-1 rounded-md p-1 transition-colors mr-2',
        'group active:scale-95 cursor-pointer border border-primary bg-primary text-on-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim'
      )}
    >
      <FolderMinusIcon className="size-4 stroke-3 shrink-0" />
    </button>
  )
}
