import { DropDown, DropDownProps } from '@components/dropDown';

export interface StatusBarProps extends Omit<DropDownProps, 'action'> {
  totalCount: number;
}

export const StatusBar = ({
  totalCount,
  flaggedCount,
  onAction,
  onSelectAll,
  onUnselectAll
}: StatusBarProps): React.JSX.Element => {
  return (
    <div className="flex flex-row items-end justify-between w-full h-10 shrink-0 gap-2 pb-1 border-b border-outline-variant uppercase">
      <span className="text-[10px] font-normal text-outline-dim">
        {`Selected: ${flaggedCount} / ${totalCount}`}
      </span>

      <DropDown
        action="Synchronize"
        flaggedCount={flaggedCount}
        onAction={onAction}
        onSelectAll={onSelectAll}
        onUnselectAll={onUnselectAll}
      />
    </div>
  );
};
