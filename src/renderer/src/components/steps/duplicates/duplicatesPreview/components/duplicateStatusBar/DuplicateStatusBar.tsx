import { DropDown, DropDownProps } from './dropDown'

export interface DuplicateStatusBarProps extends DropDownProps {
  totalCount: number
}

export const DuplicateStatusBar = ({
  flaggedCount,
  totalCount,
  onDeleteDuplicates,
  onSelectDuplicates,
  onUnselectDuplicates
}: DuplicateStatusBarProps): React.JSX.Element => {
  return (
    <div className="flex flex-row items-end justify-between w-full h-10 shrink-0 gap-2 px-2 border-b border-outline-variant pb-2 uppercase">
      <span className="text-[10px] font-normal text-outline-dim">
        {`Selected: ${flaggedCount} / ${totalCount}`}
      </span>

      <DropDown
        flaggedCount={flaggedCount}
        onDeleteDuplicates={onDeleteDuplicates}
        onSelectDuplicates={onSelectDuplicates}
        onUnselectDuplicates={onUnselectDuplicates}
      />
    </div>
  )
}
