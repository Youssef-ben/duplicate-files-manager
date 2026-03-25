import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'

export interface RefreshButtonProps {
  title?: string
  onClick: () => void
}

export const RefreshButton = ({
  title = 'Refresh',
  onClick
}: RefreshButtonProps): React.JSX.Element => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={mergeCls(
        'flex w-6 h-6 flex-row items-center justify-center gap-1 p-1 border transition-all duration-500 rounded-full',
        'group border-primary bg-surface text-primary cursor-pointer',
        'hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim hover:rotate-90 active:scale-95'
      )}
    >
      <ArrowPathIcon className="size-3 stroke-2 shrink-0 " />
    </button>
  )
}
