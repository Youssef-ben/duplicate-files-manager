import { mergeCls } from '@renderer/utils/ClassNameMerger';

interface DropDownItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
}

export const DropDownItem = ({
  label,
  icon,
  onClick,
  isDisabled
}: DropDownItemProps): React.JSX.Element => {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={isDisabled}
      onClick={() => {
        if (isDisabled) return;
        onClick();
      }}
      className={mergeCls(
        'flex w-full flex-row items-center gap-2 cursor-pointer px-3 py-2 text-left text-xs font-normal normal-case transition-colors',
        'hover:bg-surface-variant/80',
        {
          'cursor-not-allowed opacity-50': isDisabled,
          'text-on-surface': !isDisabled
        }
      )}
    >
      {icon}
      {label}
    </button>
  );
};
