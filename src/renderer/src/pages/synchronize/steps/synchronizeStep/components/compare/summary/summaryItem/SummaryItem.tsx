import { mergeCls } from '@renderer/utils/ClassNameMerger';

export interface SummaryItemProps {
  label: string;
  value: string;
  isPath?: boolean;
}

export const SummaryItem = ({
  label,
  value,
  isPath = false
}: SummaryItemProps): React.JSX.Element => {
  return (
    <div className="flex w-full min-w-0 flex-row items-center justify-between gap-2">
      <span className="text-xs text-on-surface-variant capitalize">{label}</span>
      <span
        className={mergeCls('text-xs font-semibold text-primary font-mono', {
          'text-[11px]': isPath,
          uppercase: !isPath
        })}
      >
        {value}
      </span>
    </div>
  );
};
