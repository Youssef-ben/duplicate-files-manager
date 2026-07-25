import { CommonStepHeader } from '@components/steps';
import type { StepStatus } from '@renderer/types/common';

export interface HeaderProps {
  status: StepStatus;
  onResetClick: () => void;
  onCancelClick: () => void;
}

export const Header = ({ status, onResetClick, onCancelClick }: HeaderProps): React.JSX.Element => {
  return (
    <CommonStepHeader
      title="Synchronize"
      status={status}
      onReRunClick={onResetClick}
      onCancelClick={onCancelClick}
      idleContent={<IdleContent />}
      runningContent={<RunningContent />}
      completedContent={<CompletedContent />}
    />
  );
};

const IdleContent = (): React.JSX.Element => {
  return (
    <div className="text-sm text-outline-dim text-justify">
      Start the comparison process to find out the differences between the two selected directories.
    </div>
  );
};

const RunningContent = (): React.JSX.Element => {
  return <div>Comparing the directory structures.</div>;
};

const CompletedContent = (): React.JSX.Element => {
  return (
    <div>
      Select the files to be synchronized. This will allow you to bring the destination directory up
      to date with the source directory.
    </div>
  );
};
