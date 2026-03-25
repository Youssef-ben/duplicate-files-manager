import { XMarkIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

export interface CancelButtonProps {
  onClick: () => void
}

export const CancelButton = ({ onClick }: CancelButtonProps): React.JSX.Element => {
  return (
    <button
      type="button"
      title="Cancel"
      onClick={onClick}
      className={mergeCls(
        'flex w-6 h-6 flex-row items-center justify-center gap-1 rounded-full p-1 transition-colors',
        'group active:scale-95 cursor-pointer border border-primary bg-transparent text-primary hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim'
      )}
    >
      <XMarkIcon className="size-4 stroke-3 shrink-0 transition-all duration-500 group-hover:rotate-90" />
    </button>
  )
}
