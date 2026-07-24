import { ChevronRightIcon, FolderIcon, WalletIcon } from '@heroicons/react/24/outline';
import { humanizeSize } from '@utils/strings';

export interface SummaryFolderProps {
  name: string;
  size: number;
  path: string;
  files: number;
  hasChildren: boolean;
  isExpanded: boolean;
  depth: number;
  onToggle: () => void;
}

export const SummaryFolder = ({
  name,
  size,
  path,
  files,
  hasChildren,
  isExpanded,
  depth,
  onToggle
}: SummaryFolderProps): React.JSX.Element => {
  return (
    <div
      className="flex flex-row items-center justify-start w-full gap-2 rounded-md px-2 py-2 bg-surface-bright text-xs text-on-surface-variant shadow-card cursor-pointer select-none"
      onClick={onToggle}
      style={{ filter: `brightness(${1 - depth * 0.1})` }}
    >
      <div className="flex flex-row items-center justify-center size-9 rounded-md bg-surface text-primary shrink-0">
        <FolderIcon className="size-5" />
      </div>

      <div className="flex flex-col items-left justify-start gap-1 w-full pr-1 min-w-0 overflow-hidden">
        <div className="flex flex-row items-center justify-between w-full">
          <span className="text-xs font-semibold text-primary truncate">{name}</span>
          <span className="text-[10px] font-normal text-outline-dim shrink-0 ml-2">
            {humanizeSize(size)}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <span className="text-xs font-normal text-outline-dim truncate">{path}</span>
          <span className="text-[10px] font-normal text-outline-dim shrink-0 ml-2">
            {files > 1 ? (
              `${files.toLocaleString()} files`
            ) : (
              <WalletIcon title="Contains only folder" className="size-4 stroke-2 shrink-0" />
            )}
          </span>
        </div>
      </div>

      {hasChildren && (
        <ChevronRightIcon
          className={`size-4 shrink-0 text-outline-dim transition-transform  duration-500 ${isExpanded ? 'rotate-90' : ''}`}
        />
      )}
    </div>
  );
};
