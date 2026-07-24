import { CommonStepHeader } from '@components/steps/commonStepHeader';
import type { StepStatus } from '@renderer/types/common';

interface ConfirmHeaderProps {
  status: StepStatus;
  onCancelClick: () => void;
  onReRunClick: () => void;
}

export const ConfirmHeader = ({
  status,
  onCancelClick,
  onReRunClick
}: ConfirmHeaderProps): React.JSX.Element => {
  return (
    <CommonStepHeader
      title="Confirm Organization"
      status={status}
      onCancelClick={onCancelClick}
      onReRunClick={onReRunClick}
      idleContent={<IdleContent />}
      runningContent={<RunningContent />}
      completedContent={<CompletedContent />}
    />
  );
};

const IdleContent = (): React.JSX.Element => {
  return (
    <p className="text-sm text-outline-dim text-justify w-full">
      <span className="block mb-2 w-full">
        Review the structural changes before executing the final operation. This action will modify
        the physical location of assets on your local drive.
      </span>
    </p>
  );
};

const RunningContent = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-1">
      <p className="text-sm text-outline-dim text-justify">
        Carefully scanning to identify duplicates — no changes are being made yet.
      </p>
    </div>
  );
};

const CompletedContent = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-left justify-center w-full gap-6">
      <div className="flex flex-row items-center justify-start gap-1">
        <span className="text-sm text-outline-dim text-justify">
          Folder organization has been completed.
        </span>
      </div>
    </div>
  );
};
