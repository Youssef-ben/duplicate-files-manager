import {
  ArrowPathIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { mergeCls } from '@utils/ClassNameMerger';
import { useMemo } from 'react';
import { DropDownItem } from './DropDownItem';
import { useDropDown } from './useDropDown';

export interface DropDownProps {
  flaggedCount: number;
  action: 'Delete' | 'Synchronize';
  onAction: () => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
}

export const DropDown = ({
  action,
  flaggedCount,
  onAction,
  onSelectAll,
  onUnselectAll
}: DropDownProps): React.JSX.Element => {
  const {
    containerRef,
    open,
    handleOnDropdownClick,
    showSelectAll,
    disableDelete,
    handleAction,
    handleSelectAll,
    handleUnselectAll
  } = useDropDown({
    flaggedCount,
    onAction,
    onSelectAll,
    onUnselectAll
  });

  const IconComponent = useMemo(
    () => (action === 'Delete' ? TrashIcon : ArrowPathIcon),
    [action]
  ) as React.ElementType;

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
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-40 rounded-md border border-outline-variant bg-surface py-1 shadow-lg"
        >
          <DropDownItem
            isDisabled={!showSelectAll}
            label="Select All"
            icon={<CheckIcon className="size-4 stroke-2 shrink-0 " aria-hidden />}
            onClick={handleSelectAll}
          />

          <DropDownItem
            isDisabled={flaggedCount <= 0}
            label="Unselect All"
            icon={<XMarkIcon className="size-4 stroke-2 shrink-0" aria-hidden />}
            onClick={handleUnselectAll}
          />

          <div className="h-px w-full bg-outline-variant my-1" />

          <DropDownItem
            isDisabled={disableDelete}
            label={`${action}`}
            icon={
              <IconComponent
                className={mergeCls(
                  'size-4 shrink-0',
                  action === 'Delete' ? 'text-error' : 'text-primary'
                )}
                aria-hidden
              />
            }
            onClick={handleAction}
          />
        </div>
      )}
    </div>
  );
};
