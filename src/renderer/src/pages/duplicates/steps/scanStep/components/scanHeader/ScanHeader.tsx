import { CommonStepHeader } from '@components/steps';
import type { StepStatus } from '@renderer/types/common';
import { humanizeSize } from '@renderer/utils/strings';

export interface ScanHeaderProps extends CompletedContentProps {
  status: StepStatus;
  onResetClick: () => void;
  onCancelClick: () => void;
}

export const ScanHeader = ({
  status,
  groupsCount,
  filesCount,
  totalSize,
  onResetClick,
  onCancelClick
}: ScanHeaderProps): React.JSX.Element => {
  return (
    <CommonStepHeader
      title="Find Duplicates"
      status={status}
      onReRunClick={onResetClick}
      onCancelClick={onCancelClick}
      idleContent={<IdleContent />}
      runningContent={<RunningContent />}
      completedContent={
        <CompletedContent groupsCount={groupsCount} filesCount={filesCount} totalSize={totalSize} />
      }
    />
  );
};

const IdleContent = (): React.JSX.Element => {
  return (
    <div className="text-sm text-outline-dim text-justify">
      Start scanning the directory structure for duplicates files.
    </div>
  );
};

const RunningContent = (): React.JSX.Element => {
  return <div>Scanning directory structure for duplicates files.</div>;
};

interface CompletedContentProps {
  groupsCount: number;
  filesCount: number;
  totalSize: number;
}
const CompletedContent = ({
  groupsCount,
  filesCount,
  totalSize
}: CompletedContentProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-6">
      <div className="flex flex-row items-center justify-start gap-1">
        <span className="text-xs font-semibold text-primary bg-primary-dim/10 px-2 py-1 rounded-md w-fit">
          <span className="font-mono">{groupsCount.toLocaleString()}</span> Groups (
          <span className="font-mono">{filesCount.toLocaleString()}</span> files,{' '}
          <span className="font-mono">{humanizeSize(totalSize)}</span>)
        </span>
        <span className="text-sm text-outline-dim text-justify">
          — Choose the versions to delete and confirm to apply your changes.
        </span>
      </div>
    </div>
  );
};
