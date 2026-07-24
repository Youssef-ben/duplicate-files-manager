import { CommonStepHeader } from '@components/steps';
import { FolderIcon } from '@heroicons/react/24/outline';
import type { StepStatus } from '@renderer/types/common';

export interface SynchronizeHeaderProps extends CompletedContentProps {
  title: string;
  status: StepStatus;
  onResetClick: () => void;
  onCancelClick: () => void;
}

export const SynchronizeHeader = ({
  title,
  status,
  folderPath,
  onResetClick,
  onCancelClick
}: SynchronizeHeaderProps): React.JSX.Element => {
  return (
    <CommonStepHeader
      title={title}
      status={status}
      onReRunClick={onResetClick}
      onCancelClick={onCancelClick}
      idleContent={<IdleContent />}
      runningContent={<RunningContent />}
      completedContent={<CompletedContent folderPath={folderPath} />}
    />
  );
};

const IdleContent = (): React.JSX.Element => {
  return (
    <div className="text-sm text-outline-dim text-justify">
      Select the directory to be synchronized.
    </div>
  );
};

const RunningContent = (): React.JSX.Element => {
  return <div>Scanning directory structure.</div>;
};

interface CompletedContentProps {
  folderPath: string;
}
const CompletedContent = ({ folderPath }: CompletedContentProps): React.JSX.Element => {
  return (
    <div className="flex max-w-full min-w-0 flex-row items-baseline justify-between gap-2 mt-1">
      <div
        className="w-0 min-w-0 flex-1 truncate text-sm text-outline-dim"
        title={folderPath.trim()}
      >
        <div className="relative w-full flex flex-row items-baseline justify-start">
          <FolderIcon className="absolute size-4 stroke-3 shrink-0 bottom-px " />
          <span className="ml-5 text-xs font-semibold w-full truncate">{folderPath.trim()}</span>
        </div>
      </div>
    </div>
  );
};
