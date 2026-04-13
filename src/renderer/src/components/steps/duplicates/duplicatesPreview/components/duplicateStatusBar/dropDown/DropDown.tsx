import { CheckIcon, EllipsisVerticalIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { mergeCls } from '@utils/ClassNameMerger'
import { DropDownItem } from './DropDownItem'
import { useDropDown } from './useDropDown'

export interface DropDownProps {
  flaggedCount: number
  onDeleteDuplicates: () => void
  onSelectDuplicates: () => void
  onUnselectDuplicates: () => void
}

export const DropDown = ({
  flaggedCount,
  onDeleteDuplicates,
  onSelectDuplicates,
  onUnselectDuplicates
}: DropDownProps): React.JSX.Element => {
  const {
    containerRef,
    open,
    handleOnDropdownClick,
    showSelectAll,
    disableDelete,
    handleDeleteDuplicates,
    handleSelectDuplicates,
    handleUnselectDuplicates
  } = useDropDown({
    flaggedCount,
    onDeleteDuplicates,
    onSelectDuplicates,
    onUnselectDuplicates
  })

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => handleOnDropdownClick(!open)}
        className={mergeCls(
          'flex flex-row items-center justify-center p-1 rounded-md border transition-colors duration-500',
          'group border-primary bg-surface text-primary cursor-pointer',
          'ring-none outline-none focus:outline-none focus:ring-0',
          {
            'bg-primary-dim/60 text-on-primary border-primary-dim': open,
            'hover:bg-primary-dim/80 hover:text-on-primary hover:border-primary-dim active:scale-95':
              !open
          }
        )}
      >
        <EllipsisVerticalIcon className="size-4 stroke-2 shrink-0" aria-hidden />
        <span className="sr-only">Open duplicate actions</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-40 rounded-md border border-outline-variant bg-surface py-1 shadow-lg"
        >
          <DropDownItem
            isDisabled={!showSelectAll}
            label="Select Duplicates"
            icon={<CheckIcon className="size-4 stroke-2 shrink-0 " aria-hidden />}
            onClick={handleSelectDuplicates}
          />

          <DropDownItem
            isDisabled={flaggedCount <= 0}
            label="Unselect Duplicates"
            icon={<XMarkIcon className="size-4 stroke-2 shrink-0" aria-hidden />}
            onClick={handleUnselectDuplicates}
          />

          <div className="h-px w-full bg-outline-variant my-1" />

          <DropDownItem
            isDisabled={disableDelete}
            label="Delete Duplicates"
            icon={<TrashIcon className="size-4 shrink-0 text-error" aria-hidden />}
            onClick={handleDeleteDuplicates}
          />
        </div>
      )}
    </div>
  )
}
